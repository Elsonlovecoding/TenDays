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
- GitHub Pages auto-deploy: `.github/workflows/deploy.yml` (build → deploy on push).
- Public URL: https://elsonlovecoding.github.io/TenDays/

## Decisions
- Vite `base` is `/TenDays/` to match the GitHub Pages project path.
- Deploy workflow triggers on pushes to `main` AND `claude/**` (session branches),
  so each session's push is immediately checkable at the public URL. Latest push
  wins; tighten to `main`-only if that ever becomes a problem.
- Placeholder camera already uses FOV 75 and eye height 1.7m — the P1.3
  PlayerController spec — so these numbers never change later.

## Next up
- **P1.2 scene manager**: build `src/core/SceneManager` — register named scenes,
  switch between them, each scene owns init/update/dispose; two dummy scenes +
  debug number-key switching; verify dispose via `renderer.info` (no memory growth).
