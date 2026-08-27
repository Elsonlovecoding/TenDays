import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { createPlaceholderScene } from './scenes/placeholder.js';
import { createDummyA } from './scenes/dummyA.js';
import { createDummyB } from './scenes/dummyB.js';
import { createTestRoom } from './scenes/testRoom.js';

// Core loop only — no scene logic lives here. Scenes are modules in
// src/scenes managed by SceneManager.

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scenes = new SceneManager(renderer);
scenes.register('placeholder', createPlaceholderScene);
scenes.register('dummy-a', createDummyA);
scenes.register('dummy-b', createDummyB);
scenes.register('test-room', createTestRoom);
scenes.switchTo('placeholder');

// Debug switching (P1.2): keys 1/2/3. The logged renderer.info.memory counts
// must come back to the same values each time a scene is revisited — if they
// only ever grow, some scene's dispose() is leaking.
const KEY_TO_SCENE = { 1: 'placeholder', 2: 'dummy-a', 3: 'dummy-b', 4: 'test-room' };
window.addEventListener('keydown', (event) => {
  const name = KEY_TO_SCENE[event.key];
  if (!name) return;
  scenes.switchTo(name);
  console.log(`[scene] ${name}`, JSON.stringify(renderer.info.memory));
});

// Console access for debugging, e.g. __tendays.renderer.info.memory
window.__tendays = { renderer, scenes };

window.addEventListener('resize', () => {
  scenes.resize(window.innerWidth, window.innerHeight);
  // Re-read the pixel ratio too: it changes when the window moves to a
  // monitor with different DPI (which also fires a resize event).
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  scenes.update(dt);
  scenes.render();
});
