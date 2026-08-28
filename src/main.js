import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { createPlaceholderScene } from './scenes/placeholder.js';
import { createDummyA } from './scenes/dummyA.js';
import { createDummyB } from './scenes/dummyB.js';
import { createInterviewRoom } from './scenes/InterviewRoom.js';

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
scenes.register('interview-room', createInterviewRoom);
scenes.switchTo('placeholder');

// Debug switching (P1.2): keys 1-4. The logged renderer.info.memory counts
// must come back to the same values each time a scene is revisited — if they
// only ever grow, some scene's dispose() is leaking.
const KEY_TO_SCENE = { 1: 'placeholder', 2: 'dummy-a', 3: 'dummy-b', 4: 'interview-room' };
window.addEventListener('keydown', (event) => {
  const name = KEY_TO_SCENE[event.key];
  if (!name) return;
  scenes.switchTo(name);
  console.log(`[scene] ${name}`, JSON.stringify(renderer.info.memory));
});

// Console access for debugging, e.g. __tendays.renderer.info.memory
window.__tendays = { renderer, scenes };

// Debug key legend until the real UI layer arrives (P1.6) — without it the
// deployed site gives no clue these keys exist.
const legend = document.createElement('div');
legend.textContent = '按 1-4 切换场景 · 4 = 面试房间（点击进入 · WASD 行走 · Esc 退出）';
legend.style.cssText =
  'position:fixed;top:1rem;left:50%;transform:translateX(-50%);' +
  'color:#ddd;font:13px sans-serif;background:rgba(0,0,0,.45);' +
  'padding:.35rem .7rem;border-radius:4px;pointer-events:none;z-index:10;';
document.body.appendChild(legend);

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
