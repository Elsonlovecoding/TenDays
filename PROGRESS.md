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
- **P1.2 scene manager**: build `src/core/SceneManager` — register named scenes,
  switch between them, each scene owns init/update/dispose; two dummy scenes +
  debug number-key switching; verify dispose via `renderer.info` (no memory growth).
