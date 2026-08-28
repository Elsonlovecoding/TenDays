import * as THREE from 'three';
import { disposeScene } from '../core/SceneManager.js';
import { PlayerController } from '../systems/PlayerController.js';
import { ROOM } from '../config/room.js';

// 面试房间 (P1.4) — the room template, built ENTIRELY from src/config/room.js.
// This scene is instanced thousands of times behind corridor doors in P3, so
// it holds construction logic only; every layout number comes from the config.

// Each wall runs along one floor axis at a fixed position on the other axis.
// North/south walls extend past the corners so the four boxes close the room.
function wallPlacements(cfg) {
  const { width, depth } = cfg.inner;
  const t = cfg.wallThickness;
  return {
    north: { runAxis: 'x', runLength: width + 2 * t, fixedAxis: 'z', fixedAt: -depth / 2 - t / 2 },
    south: { runAxis: 'x', runLength: width + 2 * t, fixedAxis: 'z', fixedAt: depth / 2 + t / 2 },
    west: { runAxis: 'z', runLength: depth, fixedAxis: 'x', fixedAt: -width / 2 - t / 2 },
    east: { runAxis: 'z', runLength: depth, fixedAxis: 'x', fixedAt: width / 2 + t / 2 },
  };
}

// Fail loudly on a config the builder cannot honor. Runs FIRST in init(),
// before any listeners or GPU resources exist, so a bad edit to room.js
// produces one clear error and leaves nothing behind.
function validateConfig(cfg) {
  const { wall, offset, width, height } = cfg.door;
  if (!['north', 'south', 'east', 'west'].includes(wall)) {
    throw new Error(`room config: door.wall must be north, south, east or west — got "${wall}"`);
  }
  // The door must stay inside the wall's INNER span — north/south wall boxes
  // run longer than that to close the corners, so runLength is not the bound.
  const innerEnd = (wall === 'north' || wall === 'south' ? cfg.inner.width : cfg.inner.depth) / 2;
  if (offset - width / 2 < -innerEnd || offset + width / 2 > innerEnd || height > cfg.inner.height) {
    throw new Error(
      `room config: door (offset ${offset}, ${width}x${height}m) does not fit inside the ${wall} wall`
    );
  }
}

// A solid wall is one segment; the wall holding the door is three — a piece on
// each side of the opening plus a header above it. A segment is a span along
// the wall: { center, length, bottom, top }, all in meters.
function wallSegments(side, runLength, cfg) {
  const { height } = cfg.inner;
  if (cfg.door.wall !== side) {
    return [{ center: 0, length: runLength, bottom: 0, top: height }];
  }
  const { offset, width: doorWidth, height: doorHeight } = cfg.door;
  const doorLeft = offset - doorWidth / 2;
  const doorRight = offset + doorWidth / 2;
  const wallEnd = runLength / 2;
  return [
    { center: (-wallEnd + doorLeft) / 2, length: doorLeft + wallEnd, bottom: 0, top: height },
    { center: (doorRight + wallEnd) / 2, length: wallEnd - doorRight, bottom: 0, top: height },
    { center: offset, length: doorWidth, bottom: doorHeight, top: height },
  ].filter((s) => s.length > 0 && s.top > s.bottom);
}

// Turn a segment of a wall into a box mesh at its place in the room.
function buildWallMesh(placement, segment, cfg, material) {
  const size = new THREE.Vector3(0, segment.top - segment.bottom, 0);
  size[placement.runAxis] = segment.length;
  size[placement.fixedAxis] = cfg.wallThickness;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), material);
  mesh.position.y = (segment.bottom + segment.top) / 2;
  mesh.position[placement.runAxis] = segment.center;
  mesh.position[placement.fixedAxis] = placement.fixedAt;
  return mesh;
}

// The default export builds the one canonical room; P3 passes seed-varied
// copies of the config instead: scenes.register(id, () => createInterviewRoom(varied)).
export function createInterviewRoom(cfg = ROOM) {
  return {
    scene: null,
    camera: null,
    controller: null,
    hint: null,

    init({ renderer }) {
      validateConfig(cfg);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x2c2c30);

      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );

      this.controller = new PlayerController(this.camera, renderer.domElement);
      this.camera.position.x = cfg.spawn.position[0];
      this.camera.position.z = cfg.spawn.position[1];
      this.camera.rotation.y = cfg.spawn.yaw;

      const materials = {
        floor: new THREE.MeshStandardMaterial({ color: cfg.grays.floor }),
        ceiling: new THREE.MeshStandardMaterial({ color: cfg.grays.ceiling }),
        wall: new THREE.MeshStandardMaterial({ color: cfg.grays.wall }),
        door: new THREE.MeshStandardMaterial({ color: cfg.grays.door }),
        furniture: new THREE.MeshStandardMaterial({ color: cfg.grays.furniture }),
      };

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(cfg.inner.width, cfg.inner.depth),
        materials.floor
      );
      floor.rotation.x = -Math.PI / 2;
      floor.name = 'floor';
      this.scene.add(floor);

      const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(cfg.inner.width, cfg.inner.depth),
        materials.ceiling
      );
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.y = cfg.inner.height;
      ceiling.name = 'ceiling';
      this.scene.add(ceiling);

      const placements = wallPlacements(cfg);
      for (const [side, placement] of Object.entries(placements)) {
        for (const segment of wallSegments(side, placement.runLength, cfg)) {
          const wall = buildWallMesh(placement, segment, cfg, materials.wall);
          wall.name = `wall-${side}`;
          this.scene.add(wall);
          this.controller.addCollider(wall);
        }
      }

      // The door itself: a slab closing its opening, flush with the wall for
      // now (recessed in P1.5, wired as an Interactable in P1.8).
      const door = buildWallMesh(
        placements[cfg.door.wall],
        { center: cfg.door.offset, length: cfg.door.width, bottom: 0, top: cfg.door.height },
        cfg,
        materials.door
      );
      door.name = 'door';
      this.scene.add(door);
      this.controller.addCollider(door);

      for (const item of cfg.furniture) {
        const [width, height, depth] = item.size;
        const piece = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials.furniture);
        piece.position.set(item.position[0], height / 2, item.position[1]);
        piece.rotation.y = item.rotationY;
        piece.name = item.id;
        this.scene.add(piece);
        this.controller.addCollider(piece);
      }

      // Readability lighting only — the real lighting pass is P1.9.
      this.scene.add(new THREE.HemisphereLight(0xa0a0b0, 0x303030, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 0.8);
      key.position.set(cfg.inner.width / 2, cfg.inner.height * 2, cfg.inner.depth / 2);
      this.scene.add(key);

      // Minimal debug hint until the real UI layer arrives in P1.6.
      this.hint = document.createElement('div');
      this.hint.textContent = '点击进入 · WASD 移动 · Esc 退出';
      this.hint.style.cssText =
        'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);' +
        'color:#ddd;font:14px sans-serif;background:rgba(0,0,0,.5);' +
        'padding:.4rem .8rem;border-radius:4px;pointer-events:none;';
      document.body.appendChild(this.hint);
      this._onLockChange = () => {
        this.hint.style.display = this.controller.isLocked ? 'none' : 'block';
      };
      document.addEventListener('pointerlockchange', this._onLockChange);
    },

    update(dt) {
      this.controller.update(dt);
    },

    dispose() {
      document.removeEventListener('pointerlockchange', this._onLockChange);
      this.hint.remove();
      this.controller.dispose();
      disposeScene(this.scene);
    },
  };
}
