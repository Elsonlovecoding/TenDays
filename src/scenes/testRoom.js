import * as THREE from 'three';
import { disposeScene } from '../core/SceneManager.js';
import { PlayerController } from '../systems/PlayerController.js';

// Debug-only box room for walking the PlayerController (P1.3): 8x8m, 3m high,
// every wall a registered collider. Replaced by the real 面试房间 in P1.4.
const ROOM = { width: 8, depth: 8, height: 3, wallThickness: 0.2 };

export function createTestRoom() {
  return {
    scene: null,
    camera: null,
    controller: null,
    hint: null,

    init({ renderer }) {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x2c2c30);

      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );

      this.controller = new PlayerController(this.camera, renderer.domElement);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(ROOM.width, ROOM.depth),
        new THREE.MeshStandardMaterial({ color: 0x6b6b6b })
      );
      floor.rotation.x = -Math.PI / 2;
      this.scene.add(floor);

      // Four walls, each a box mesh that doubles as a collider.
      const { width: w, depth: d, height: h, wallThickness: t } = ROOM;
      const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8a8a8a });
      const walls = [
        { size: [w + 2 * t, h, t], position: [0, h / 2, -d / 2 - t / 2] }, // north
        { size: [w + 2 * t, h, t], position: [0, h / 2, d / 2 + t / 2] }, // south
        { size: [t, h, d], position: [-w / 2 - t / 2, h / 2, 0] }, // west
        { size: [t, h, d], position: [w / 2 + t / 2, h / 2, 0] }, // east
      ];
      for (const { size, position } of walls) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(...size), wallMaterial);
        wall.position.set(...position);
        this.scene.add(wall);
        this.controller.addCollider(wall);
      }

      this.scene.add(new THREE.HemisphereLight(0xa0a0b0, 0x303030, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 1.0);
      key.position.set(2, 5, 3);
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
