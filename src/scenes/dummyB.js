import * as THREE from 'three';
import { disposeScene } from '../core/SceneManager.js';

// Debug-only scene for exercising SceneManager switching (P1.2).
// Pale fog with a row of gently bobbing spheres.
export function createDummyB() {
  return {
    scene: null,
    camera: null,
    spheres: [],
    elapsed: 0,

    init() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xd8d3c8);
      this.scene.fog = new THREE.Fog(0xd8d3c8, 5, 25);

      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        200
      );
      this.camera.position.set(0, 1.7, 6);
      this.camera.lookAt(0, 1.2, 0);

      const geometry = new THREE.SphereGeometry(0.5, 24, 16);
      const material = new THREE.MeshStandardMaterial({ color: 0x707070 });
      for (let i = 0; i < 5; i++) {
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set((i - 2) * 1.6, 1.2, 0);
        this.spheres.push(sphere);
        this.scene.add(sphere);
      }

      this.scene.add(new THREE.HemisphereLight(0xd8d3c8, 0x404040, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 1.3);
      key.position.set(-3, 6, 5);
      this.scene.add(key);
    },

    update(dt) {
      this.elapsed += dt;
      this.spheres.forEach((sphere, i) => {
        sphere.position.y = 1.2 + Math.sin(this.elapsed * 2 + i) * 0.3;
      });
    },

    dispose() {
      disposeScene(this.scene);
      this.spheres.length = 0;
    },
  };
}
