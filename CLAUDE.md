# CLAUDE.md — 《十日终焉》 immersive companion site (repo: TenDays)

## What this project is
A fan-made companion for the Chinese web novel 《十日终焉》, in two parts:
- PART I — The Arrival: a 3D web experience. The visitor enters the world the
  way characters do: 列车 → 面试走廊 → 终焉之地. After first arrival, 终焉之地
  is the hub and the other spaces are re-enterable spokes.
- PART II — The Living World: a spoiler-aware world database (人物 1:1,
  规则 codex: 回响/生肖/神兽, 故事线 timeline), entered diegetically through
  the 3D world. A reader sets their chapter progress once; the entire site
  renders only what they'd know at that point.

Current phase: see PROGRESS.md. Phase definitions and per-phase prompt
playbooks: docs/ROADMAP.md. Two release milestones: R1 (arrival experience,
after P5), R2 (full companion, after P10).

## Tech
- Vite + Three.js, plain JavaScript, ES modules. No framework unless a real
  need appears and the maintainer approves.
- Keep code simple and readable — the maintainer is a student learning from
  this codebase. Clear structure over clever abstractions.
- Static site, no backend. State persists in localStorage. Content is files.

## Architecture spine — 3D (reusable modules; everything depends on these)
- src/core/SceneManager: named scenes with init/update/dispose. Multi-dimension
  project (列车 / 面试走廊 / 面试房间 / 终焉之地) — no scene logic in main.
- src/systems/PlayerController: one first-person controller shared by all scenes.
- src/systems/Interactions: Interactable {target, radius, promptText, onInteract}
  + HTML hint layer.
- src/core/Transitions: promise-based fade transitions for every dimension change.
- src/core/Journey: first-visit flow state (列车→走廊→终焉之地 once), hub after.
- Config-driven spaces: all dimensions/positions in src/config/*.js. The 面试房间
  is a TEMPLATE instanced thousands of times behind corridor doors — never
  hardcode layout inside a scene.

## Architecture spine — data (Part II; built in P6, consumed by every view)
- content/: one human-editable file per entity (character, event, location,
  回响, 生肖位, 神兽, 规则/游戏) with typed relations. Schema in docs/SCHEMA.md.
- Chapter-awareness is structural: every record has introduced_at; every
  spoilable field/relation has revealed_at.
- src/core/SpoilerEngine: the ONLY door to world data. At reader progress C:
  introduced_at > C → entity does not exist; revealed_at > C → field renders
  locked, never its value. No view may bypass it.
- src/ui/EntityPanel: the one shared detail component all views open.
- npm run validate (schema/relations/chapter sanity) and npm run test:spoilers
  (automated leak sweep, edges included) must pass before every push from P6 on.

## Canon rules (non-negotiable)
- NEVER invent details from the novel. Canonical details come only from files
  in docs/ (对照表) and content/ (entries the maintainer authors from the text).
- Canon-pass changes cite their 引用 in PROGRESS.md. No citation, no change.
- A needed detail with no source: obviously generic placeholder + TODO(canon):
  comment. Placeholder text never imitates book quotes.
- Spoiler discipline is a canon rule: leaking beyond reader progress is a bug
  of the highest severity.

## Working rules
- One feature per session. If asked for X, build X — no unrequested scope.
  Suggest ideas in one line at most.
- Design decisions marked as checkpoints in ROADMAP prompts: propose 2 options
  with tradeoffs and WAIT for the maintainer's pick before building.
- Graybox before beauty; readability before polish; 60fps is a feature.
- Stylized-but-exact, never photoreal. Fidelity = matching the text, not photos.
- Small, frequent commits with clear messages.

## Session ritual
- START: read this file, docs/ROADMAP.md and PROGRESS.md; continue from
  "Next up" in PROGRESS.md.
- END: update PROGRESS.md (done / decisions / next up), commit, push.

## Out of scope until after R2 (maintainer decision)
二创 layer (地猴·朝天笏 expansion), multiplayer, mobile controls beyond a
graceful desktop-only message, photorealism, any backend.
