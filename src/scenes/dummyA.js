import * as THREE from 'three';
import { disposeScene } from '../core/SceneManager.js';

// Debug-only scene for exercising SceneManager switching (P1.2).
// Dark room with a ring of slowly orbiting cubes.
export function createDummyA() {
  return {
    scene: null,
    camera: null,
    ring: null,

    init() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x1a1a20);

      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        200
      );
      this.camera.position.set(0, 1.7, 8);
      this.camera.lookAt(0, 1.7, 0);

      this.ring = new THREE.Group();
      const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
      const material = new THREE.MeshStandardMaterial({ color: 0x9a9aa5 });
      const COUNT = 8;
      for (let i = 0; i < COUNT; i++) {
        const cube = new THREE.Mesh(geometry, material);
        const angle = (i / COUNT) * Math.PI * 2;
        cube.position.set(Math.cos(angle) * 3, 1.7, Math.sin(angle) * 3);
        this.ring.add(cube);
      }
      this.scene.add(this.ring);

      this.scene.add(new THREE.HemisphereLight(0x8888aa, 0x222222, 1.0));
      const key = new THREE.DirectionalLight(0xffffff, 1.2);
      key.position.set(4, 8, 4);
      this.scene.add(key);
    },

    update(dt) {
      this.ring.rotation.y += dt * 0.5;
    },

    dispose() {
      disposeScene(this.scene);
    },
  };
}
