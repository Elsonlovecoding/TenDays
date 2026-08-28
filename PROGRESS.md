# PROGRESS

Current phase: **P1 — 面试房间 graybox** (Part I · The Arrival), Session B.
Phase map and prompt playbook: docs/ROADMAP.md.

## Done

### P1.4 — config-driven room shell (2026-08-28)
- `src/config/room.js`: the 面试房间 as ONE config object, every dimension in
  meters — inner size 6×8×3, wall thickness 0.2, door (wall/offset/size),
  spawn point, furniture boxes (desk + two chairs, placeholder sizes until
  P1.5), and the graybox gray values. All numbers TODO(canon) placeholders
  until the P2 pass over docs/对照表-面试房间.md.
- `src/scenes/InterviewRoom.js` (key 4): builds floor, ceiling, four walls,
  door slab and furniture purely from that config — construction logic only,
  zero layout numbers in the scene (P3 instances this template thousands of
  times). The door wall splits into two side segments + a header over the
  opening; a slab closes the opening (Interactable in P1.8). Every wall
  segment, the door and all furniture register as colliders. The config is
  validated first thing in init() — a bad door wall name or a door that
  doesn't fit inside its wall's inner span throws one clear error before any
  listeners or GPU resources exist, instead of building broken geometry.
- `createInterviewRoom(cfg = ROOM)` takes an optional per-instance config, so
  P3 can register seed-varied rooms (`() => createInterviewRoom(varied)`)
  without touching the shared export. Verified: a varied copy builds a 10m
  room with moved door/desk while the default room stays 6m.
- `src/scenes/testRoom.js` deleted — its debug job (walking the controller in
  a box) is done by the real room now, as its own comment planned.
- Verified headless (Playwright + pixel/geometry assertions): changing
  inner size, door offset/size, or a furniture position in room.js changes
  both the scene graph AND the rendered pixels (e.g. moving the door redraws
  47% of the frame); restoring the config restores the exact baseline image;
  no geometry/texture leak after leave-and-revisit (dummy-a counts identical
  before/after).

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
- The graybox palette lives in room.js, not the scene: P1.5 wants per-object
  gray values and P3 instances may vary them per door seed, so color is
  template data like every other number.
- The room's coordinate convention (documented in room.js): origin at floor
  center, +x east / +z south, door on the north wall, player spawns just
  inside it facing the desk.
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
- **P1.5 furniture placeholders**: extend room.js + InterviewRoom with
  furniture at real human proportions (desk 1.4×0.7×0.75m, chairs seat 0.45m
  facing each other, door 2.1×0.9m recessed 0.1m). Slightly different grays
  per object so silhouettes separate.
