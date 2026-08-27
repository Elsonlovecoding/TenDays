import * as THREE from 'three';

// Placeholder scene: gray floor + plain sky. Proves the scaffold and the core
// loop work end to end; replaced by real dimensions from P1.4 on.
export function createPlaceholderScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  // Eye height 1.7m and FOV 75 — the standard the PlayerController (P1.3) will use.
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 1.7, 5);
  camera.lookAt(0, 1.7, 0);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x808080 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const hemi = new THREE.HemisphereLight(0xbfd1e5, 0x404040, 1.2);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(5, 10, 2);
  scene.add(sun);

  function update(dt) {
    // Nothing animates yet; the loop calls this every frame.
  }

  return { scene, camera, update };
}
