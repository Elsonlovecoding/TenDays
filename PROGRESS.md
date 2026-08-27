# PROGRESS

Current phase: **P1 — 面试房间 graybox** (Part I · The Arrival), Session A.
Phase map and prompt playbook: docs/ROADMAP.md.

## Done

### P1.1 — scaffold + deploy (2026-08-27)
- Vite 8 + Three.js 0.185 scaffold: plain JavaScript, ES modules, no framework.
- Architecture-spine folders: `src/core`, `src/scenes`, `src/systems`, `src/ui`,
  `src/config` (empty for now except `scenes` — modules arrive in their phases).
- Core loop in `src/main.js`: renderer + resize + animation loop only, no scene
  logic. Placeholder scene (gray floor + plain sky) in `src/scenes/placeholder.js`,
  returning `{ scene, camera, update }` — the shape SceneManager will manage from P1.2.
- GitHub Pages auto-deploy: `.github/workflows/deploy.yml` builds and publishes
  `dist/` to the `gh-pages` branch on every push (verified green in Actions).
- Public URL: https://elsonlovecoding.github.io/TenDays/ — PENDING one one-time
  manual step (needs repo-admin rights no automation token has): repo Settings →
  Pages → Source "Deploy from a branch" → Branch `gh-pages` / `/ (root)` → Save.
  After that, every push deploys automatically with no further clicks.

### P1.2 — scene manager (2026-08-27)
- `src/core/SceneManager`: register named scene factories, `switchTo(name)`
  disposes the outgoing scene and builds the incoming one fresh; update/render/
  resize all route through it — `main.js` is loop-only again.
- Scene contract: `factory() -> { scene, camera, init(), update(dt), dispose() }`;
  shared `disposeScene()` helper frees geometries/materials/textures.
- Two debug scenes (`dummyA` cube ring, `dummyB` bobbing spheres) + number-key
  switching (1/2/3), each switch logs `renderer.info.memory`.
- Verified headless: 10 full switch cycles (30 switches) — geometries/textures
  return to identical counts on every revisit; no growth, no console errors.
- Console handle `window.__tendays = { renderer, scenes }` for manual
  `renderer.info` checks.

### P1.3 — player controller (2026-08-27)
- `src/systems/PlayerController`: pointer lock + mouse look (YXZ order, pitch
  clamped), WASD via `event.code`, eye height 1.7m, FOV 75, walk 2 m/s with
  accel 12 m/s² / decel 16 m/s² (weighty starts/stops, ~9cm settle on release).
- Collision: player AABB (0.6m wide) vs registered collider AABBs, resolved one
  axis at a time → slides along walls; `addCollider()` takes a mesh or Box3.
- `src/scenes/testRoom.js` (key 4): 8×8×3m box room, all walls colliders, with
  a minimal "click to enter" hint until the real UI layer (P1.6).
- Scene contract extended: `init(ctx)` receives `{ renderer }` (pointer lock
  needs the canvas). Scenes that don't need it ignore it.
- Verified headless: cruise 2.01 m/s; 165 position samples pushing/sliding into
  all four walls (incl. diagonals) never passed a wall face; keys clear on
  pointer-lock exit; dispose removes all listeners.

## Decisions
- Vite `base` is `/TenDays/` to match the GitHub Pages project path.
- Deploy workflow triggers on pushes to `main` AND `claude/**` (session branches),
  so each session's push is checkable at the public URL once its Actions run
  finishes. Latest push wins; tighten to `main`-only if that ever becomes a problem.
- Deploy publishes `dist/` to the `gh-pages` branch (peaceiris/actions-gh-pages)
  instead of the actions/deploy-pages route: the workflow token wasn't allowed to
  create the Pages site via API, while creating a `gh-pages` branch enables Pages
  automatically. `gh-pages` is build output only — never edit it by hand.
- Placeholder camera already uses FOV 75 and eye height 1.7m — the P1.3
  PlayerController spec — so these numbers never change later.

## Next up
- **P1.4 config-driven room shell**: `src/config/room.js` — every dimension of
  the 面试房间 in meters in one config object; `src/scenes/InterviewRoom` reads
  ONLY from that config (template for thousands of instances in P3). Gray only.
