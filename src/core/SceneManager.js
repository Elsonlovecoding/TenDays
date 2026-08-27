import * as THREE from 'three';

// Owns which dimension is on screen. Scenes are registered as factories and
// built fresh on every switch; the outgoing scene must free its GPU resources
// in dispose() — verify with renderer.info.memory (counts return to the same
// values every time a scene is revisited).
//
// Scene contract (every module in src/scenes returns this shape):
//   factory() -> { scene, camera, init(), update(dt), dispose() }
export class SceneManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.factories = new Map();
    this.active = null;
    this.activeName = null;
  }

  register(name, factory) {
    this.factories.set(name, factory);
  }

  switchTo(name) {
    const factory = this.factories.get(name);
    if (!factory) throw new Error(`SceneManager: unknown scene "${name}"`);
    if (name === this.activeName) return;
    if (this.active) {
      this.active.dispose();
      this.active = null;
    }
    const next = factory();
    next.init();
    this.active = next;
    this.activeName = name;
  }

  update(dt) {
    if (this.active) this.active.update(dt);
  }

  render() {
    if (this.active) this.renderer.render(this.active.scene, this.active.camera);
  }

  resize(width, height) {
    if (!this.active) return;
    this.active.camera.aspect = width / height;
    this.active.camera.updateProjectionMatrix();
  }
}

// Frees the GPU side of everything in a scene. Three.js never garbage-collects
// geometries, materials or textures on its own — every scene's dispose() must
// call this (plus remove any event listeners the scene added).
export function disposeScene(scene) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    const materials = Array.isArray(obj.material)
      ? obj.material
      : obj.material
        ? [obj.material]
        : [];
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (value && value.isTexture) value.dispose();
      }
      material.dispose();
    }
  });
  scene.clear();
}
