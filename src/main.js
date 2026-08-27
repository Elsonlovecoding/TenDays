import * as THREE from 'three';
import { createPlaceholderScene } from './scenes/placeholder.js';

// Core loop only — no scene logic lives here. Scenes are built in src/scenes/
// and will be managed by src/core/SceneManager from P1.2 on.

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Every scene module returns the same shape: { scene, camera, update(dt) }.
const active = createPlaceholderScene();

window.addEventListener('resize', () => {
  active.camera.aspect = window.innerWidth / window.innerHeight;
  active.camera.updateProjectionMatrix();
  // Re-read the pixel ratio too: it changes when the window moves to a
  // monitor with different DPI (which also fires a resize event).
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  active.update(dt);
  renderer.render(active.scene, active.camera);
});
