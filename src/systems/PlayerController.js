import * as THREE from 'three';

// First-person walk controller, shared by every dimension (P1.3).
// Pointer lock + mouse look, WASD, fixed eye height — no jumping, no head bob.
// Movement accelerates/decelerates over a short ramp so starts and stops feel
// weighty rather than instant, and never exceeds walking pace.
// Collision: the player is an axis-aligned box resolved against registered
// collider boxes one axis at a time, which makes you slide along walls
// instead of sticking to them.

const EYE_HEIGHT = 1.7; // meters
const WALK_SPEED = 2.0; // m/s
const ACCELERATION = 12; // m/s² — reaches walk speed in ~0.17s
const DECELERATION = 16; // m/s² — stops from walk speed in ~0.13s
const PLAYER_HALF_WIDTH = 0.3; // meters — half of the player's collision box
const LOOK_SENSITIVITY = 0.002; // radians per pixel of mouse movement
const MAX_PITCH = Math.PI / 2 - 0.05; // just short of straight up/down

export class PlayerController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    camera.fov = 75;
    camera.updateProjectionMatrix();
    // YXZ: yaw first, then pitch — mouse look never rolls the horizon.
    camera.rotation.order = 'YXZ';
    camera.position.y = EYE_HEIGHT;

    this.velocity = new THREE.Vector3();
    this.colliders = [];
    this.keys = { forward: false, back: false, left: false, right: false };

    this._onClick = () => this.domElement.requestPointerLock();
    this._onMouseMove = (event) => {
      if (!this.isLocked) return;
      this.camera.rotation.y -= event.movementX * LOOK_SENSITIVITY;
      this.camera.rotation.x = THREE.MathUtils.clamp(
        this.camera.rotation.x - event.movementY * LOOK_SENSITIVITY,
        -MAX_PITCH,
        MAX_PITCH
      );
    };
    this._onKey = (event, pressed) => {
      if (event.code === 'KeyW') this.keys.forward = pressed;
      if (event.code === 'KeyS') this.keys.back = pressed;
      if (event.code === 'KeyA') this.keys.left = pressed;
      if (event.code === 'KeyD') this.keys.right = pressed;
    };
    this._onKeyDown = (event) => this._onKey(event, true);
    this._onKeyUp = (event) => this._onKey(event, false);
    // Releasing a key while unlocked would otherwise leave it "stuck" pressed.
    this._onLockChange = () => {
      if (!this.isLocked) {
        this.keys.forward = this.keys.back = this.keys.left = this.keys.right = false;
      }
    };

    domElement.addEventListener('click', this._onClick);
    document.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('pointerlockchange', this._onLockChange);
  }

  get isLocked() {
    return document.pointerLockElement === this.domElement;
  }

  // Register anything the player must not walk through. Accepts an Object3D
  // (its world AABB is captured now — static geometry only) or a THREE.Box3.
  addCollider(objectOrBox) {
    const box = objectOrBox.isBox3
      ? objectOrBox.clone()
      : new THREE.Box3().setFromObject(objectOrBox);
    this.colliders.push(box);
  }

  update(dt) {
    // Wished velocity from input, in world space, yaw only.
    const wish = new THREE.Vector3();
    if (this.isLocked) {
      const forwardInput = (this.keys.forward ? 1 : 0) - (this.keys.back ? 1 : 0);
      const rightInput = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
      const yaw = this.camera.rotation.y;
      wish
        .addScaledVector(new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)), forwardInput)
        .addScaledVector(new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)), rightInput);
      if (wish.lengthSq() > 0) wish.normalize().multiplyScalar(WALK_SPEED);
    }

    // Ease current velocity toward the wished one — the "weight" of walking.
    const rate = wish.lengthSq() > 0 ? ACCELERATION : DECELERATION;
    const toWish = wish.clone().sub(this.velocity);
    const maxStep = rate * dt;
    if (toWish.length() <= maxStep) {
      this.velocity.copy(wish);
    } else {
      this.velocity.addScaledVector(toWish.normalize(), maxStep);
    }

    // One axis at a time, so hitting a wall diagonally slides along it.
    this._moveAxis('x', this.velocity.x * dt);
    this._moveAxis('z', this.velocity.z * dt);
    this.camera.position.y = EYE_HEIGHT;
  }

  _moveAxis(axis, delta) {
    if (delta === 0) return;
    const position = this.camera.position;
    position[axis] += delta;
    for (const box of this.colliders) {
      if (!this._overlaps(box)) continue;
      // Push back out to the collider's face and kill speed on that axis.
      position[axis] =
        delta > 0 ? box.min[axis] - PLAYER_HALF_WIDTH : box.max[axis] + PLAYER_HALF_WIDTH;
      this.velocity[axis] = 0;
    }
  }

  _overlaps(box) {
    const p = this.camera.position;
    return (
      p.x + PLAYER_HALF_WIDTH > box.min.x &&
      p.x - PLAYER_HALF_WIDTH < box.max.x &&
      p.z + PLAYER_HALF_WIDTH > box.min.z &&
      p.z - PLAYER_HALF_WIDTH < box.max.z &&
      box.min.y < EYE_HEIGHT && // player spans floor (0) to eye height
      box.max.y > 0
    );
  }

  dispose() {
    this.domElement.removeEventListener('click', this._onClick);
    document.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('pointerlockchange', this._onLockChange);
    if (this.isLocked) document.exitPointerLock();
  }
}
