# CLAUDE.md — 《十日终焉》 immersive companion site

## What this project is
A fan-made 3D web experience for the Chinese web novel 《十日终焉》.
The visitor arrives the way characters do: 列车 → 面试走廊 → 终焉之地.
Long-term: the corridor's thousands of doors become the site's navigation.

## Current phase — Phase 1: 面试房间 (graybox)
One interview room, built as a REUSABLE TEMPLATE (it will later be
instanced behind thousands of corridor doors — design it self-contained
and parameterizable from day one).

Phase 1 scope, nothing more:
- First-person controls: WASD + mouse look (pointer lock), eye height ~1.7m
- Enclosed room, furniture as gray placeholder boxes (desk, chairs, door)
- One interview trigger near the desk → placeholder text overlay
- Door interaction → fade to black + "走廊 coming soon" stub
- Runs smoothly in a normal browser via `npm run dev`

Explicitly OUT of Phase 1: 列车, 终焉之地, textures/materials pass,
photorealism, sound, backend, multiplayer, mobile controls.

## Tech
- Vite + Three.js, plain JavaScript. No framework unless a real need appears.
- Keep the code simple and readable — the maintainer is a student learning
  from this codebase. Prefer clear structure over clever abstractions.

## Canon rules (non-negotiable)
- NEVER invent details from the novel. All canonical details (layout,
  props, text, names) come only from files in `docs/` (对照表 files the
  maintainer writes from the original text).
- If a canonical detail is needed and no 对照表 entry covers it: use an
  obviously generic placeholder and add a `TODO(canon):` comment.
- Placeholder text stays clearly placeholder — never fake book quotes.

## Working rules
- One feature per session. If asked for X, build X — do not add extras.
  Suggest ideas in one line at most; never implement unrequested scope.
- Graybox before beauty. No visual polish until geometry and interactions
  are approved.
- Small, frequent commits with clear messages.

## Session ritual
- START of every session: read this file and PROGRESS.md, then continue
  from "Next up".
- END of every session: update PROGRESS.md (done / decisions / next up),
  commit, push.
