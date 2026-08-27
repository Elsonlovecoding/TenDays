# TenDays — Roadmap & prompt playbook (v3)

Repo: TenDays · Project: 《十日终焉》沉浸式 3D 同人站
Vision: enter the world the way characters do (列车 → 面试走廊 → 终焉之地),
then live in it (人物 / 规则 / 故事线, all spoiler-aware).

Structure: Part I = The Arrival (3D). Part II = The Living World (data + views).
Two public launches: R1 after P5, R2 after P10.
Content authoring (对照表, entries) is a PARALLEL track — phases gate on content,
code never waits for code.

Prompts are first strikes, not scripts: every prompt is followed by look → feel
notes → iterate. Always append your own constraints when you know more.

---

## Phase map

PART I — THE ARRIVAL
- P0 ✅ Repo setup
- P1 面试房间 graybox — 10 prompts, ~3 sessions
- P2 面试房间 canon pass — 7 prompts, ~3 sessions · GATE: 房间 对照表 已核对
- P3 面试走廊 — 7 prompts, ~4 sessions · GATE: 走廊 对照表
- P4 列车 — 6 prompts, ~4 sessions · GATE: 列车 对照表
- P5 终焉之地 vista + arrival sequence — 6 prompts, ~4 sessions
  → **R1 LAUNCH: arrival experience public**

PART II — THE LIVING WORLD
- P6 World database + spoiler engine — 6 prompts, ~4 sessions (the foundation)
- P7 人物 1:1 — 6 prompts, ~4 sessions · GATE: seed character entries authored
- P8 世界规则 codex (回响/生肖/神兽/规则) — 5 prompts, ~3 sessions
- P9 故事线 timeline — 4 prompts, ~3 sessions
- P10 Integration: doors become the world — 4 prompts, ~3 sessions
  → **R2 LAUNCH: full companion public**
- P11 Authoring upgrade — triggered by pain, not by date

Out of scope until after R2 (maintainer decision): 二创 layer (地猴·朝天笏),
multiplayer, mobile controls beyond a graceful message.

---

## Session ritual (every session)

START:
```
Read CLAUDE.md, docs/ROADMAP.md and PROGRESS.md. Continue from "Next up" in PROGRESS.md.
```

END:
```
Update PROGRESS.md: what we built, decisions made, next up. Commit everything and push.
```

---

# PART I — THE ARRIVAL

## P1 — 面试房间 graybox (10 prompts, ~3 sessions)

### Session A — engine spine

P1.1 scaffold + deploy
```
Read CLAUDE.md. Scaffold: Vite + Three.js (latest), plain JS, ES modules. Folder structure per the architecture spine: src/core, src/scenes, src/systems, src/ui, src/config. Create PROGRESS.md. Render a placeholder scene (gray floor + plain sky) through the core loop. Set up GitHub Pages auto-deploy on push and give me the public URL. Done when: the URL and npm run dev both show the scene.
```

P1.2 scene manager
```
Build src/core/SceneManager: register named scenes, switch between them; each scene owns init/update/dispose. This project has 4+ dimensions, so no scene logic in main. Add two dummy scenes and debug number-key switching. Done when: I can switch scenes repeatedly with no memory growth (verify dispose via renderer.info).
```

P1.3 player controller
```
Build src/systems/PlayerController as a reusable module: pointer lock + mouse look, WASD, eye height 1.7m, walk speed ~2 m/s with short acceleration/deceleration so starts and stops feel weighty, not instant. FOV 75. Collision: simple AABB against registered colliders. No jumping, no head bob. Done when: movement feels like walking (not ice-sliding) and I cannot clip through any wall of a test box room.
```

### Session B — the room as a template

P1.4 config-driven room shell
```
Create src/config/room.js: every dimension of the 面试房间 in meters in one config object (room 6x8x3 to start, wall thickness, door position/size, furniture positions). Build src/scenes/InterviewRoom reading ONLY from that config — this room is a template that will be instanced thousands of times in P3, so nothing hardcoded in the scene. Gray materials only. Done when: changing a number in room.js visibly changes the built room.
```

P1.5 furniture placeholders
```
Extend room.js + scene with furniture at real human proportions: desk 1.4 x 0.7 x 0.75m, two chairs (seat height 0.45m) facing each other across the desk, door 2.1 x 0.9m recessed 0.1m into its wall. Slightly different gray values per object so shapes separate. Done when: from the entrance, the silhouette alone reads "interview room" at believable human scale.
```

P1.6 interaction system
```
Build src/systems/Interactions: an Interactable takes {target, radius, promptText, onInteract}. When the player is within radius and roughly facing it, show a bottom-center HTML hint (按 E · promptText); pressing E fires onInteract. UI lives in src/ui as an HTML overlay layer, not in-canvas text. Done when: I can register a debug cube as interactable in one line, and the hint never appears from across the room.
```

### Session C — interactions, feel, QA

P1.7 overlay + interview trigger
```
Build src/ui/Overlay: full-screen centered text panel, fade in/out, dismiss with E or click, movement locked while open. Wire the desk as an Interactable (面试): opens overlay with placeholder 「面试开始…」 marked TODO(canon) — real flow arrives in P2 from docs/对照表. Done when: trigger works, movement locks during overlay and unlocks on dismiss.
```

P1.8 transition manager + door
```
Build src/core/Transitions: fadeOut → callback → fadeIn (black, ~0.6s each side), promise-based — used for every dimension change in this project. Wire the door as an Interactable (离开): transition into a stub scene (dark, centered 「面试走廊 — coming soon」, with a way back). Done when: no flash frames, and I can return to the room.
```

P1.9 graybox lighting + feel pass
```
Lighting for readability, not canon: soft ambient + one key light, sensible tone mapping/exposure so grays aren't washed out. Then iterate with me on feel — I'll give notes like 太亮 / camera too tall / walk floaty; apply each and wait for my next note. Done when: I say the graybox feels good to inhabit.
```

P1.10 QA + handover
```
QA pass: steady 60fps (report draw calls + triangles), correct resize, pointer-lock recovery after Esc, graceful "desktop only for now" message on touch devices. Update PROGRESS.md (next up: P2, gated on docs/对照表-面试房间.md). Commit and push. Done when: the deployed URL passes every check.
```

---

## P2 — 面试房间 canon pass (7 prompts, ~3 sessions)
GATE: docs/对照表-面试房间.md filled, 已核对. Canon law: every change cites its 引用;
gaps stay placeholder + TODO(canon).

P2.1 空间与陈设
```
Read docs/对照表-面试房间.md sections 1–2. Apply all 优先级:高 items to src/config/room.js and the scene. In PROGRESS.md, list every change with the 引用 that justified it. Anything not covered keeps its placeholder + TODO(canon). Done when: each config change traces to a quote.
```

P2.2 面试官 presence — design checkpoint
```
Read 对照表 section 3 (面试官). Propose 2 implementation options that honor the text (for example: stylized figure vs disembodied voice + environmental cue), with cost/effect tradeoffs in 5 lines each. WAIT for my pick before building anything. After I choose: build it, cite the 引用 behind each visual decision. Done when: the presence matches section 3 and I've approved it in-scene.
```

P2.3 光照
```
Read 对照表 section 4. Replace graybox lighting with the canon mood: light sources, color temperature, contrast per the quotes. Where the text is silent, propose a value and mark 推断 in PROGRESS.md. Iterate with my feel notes. Done when: a screenshot's lighting is defensible line-by-line against section 4.
```

P2.4 材质
```
Read 对照表 section 5. Stylized-but-exact material pass: flat colors + subtle roughness variation, minimal or no image textures (per CLAUDE.md, no photorealism). Cite 引用 per surface. Done when: floors/walls/furniture match the described materials at our stylization level.
```

P2.5 声音
```
Read 对照表 section 6. Ambient loop + interaction sounds per the text; master volume control in a small settings corner; audio starts only after first user gesture (browser autoplay policy). Keep files small (compressed, looped). Done when: sound matches section 6 and nothing plays before interaction.
```

P2.6 面试流程
```
Read 对照表 section 7. Upgrade the desk Overlay into the canon interview sequence: multi-step text flow (enter → questions → conclusion) exactly as documented; pacing controlled by E to advance. Steps the text doesn't specify stay placeholder + TODO(canon). Done when: the flow plays start-to-finish per section 7.
```

P2.7 canon QA + handover
```
Verify the room against 对照表 section 8 (非协商 Top 5) one item at a time, reporting pass/fail with a screenshot description for each. Fix fails. Capture a screenshot set for devlog. Update PROGRESS.md, commit, push. Done when: all Top 5 pass.
```

---

## P3 — 面试走廊 (7 prompts, ~4 sessions)
GATE: docs/对照表-面试走廊.md (duplicate the room template, fill it).

P3.1 corridor config + shell
```
Create src/config/corridor.js: length as a repeat-unit count, width/height, door spacing, lighting rhythm — all from 对照表 sections 1–2 (cite 引用; gaps = 推断 + note). Build src/scenes/Corridor walkable end to end using the shell only (no doors yet). Done when: walking the empty corridor already feels like the corridor's scale.
```

P3.2 doors at scale
```
Add doors via InstancedMesh from corridor.js. Target: 2000+ doors at steady 60fps (report draw calls). Each door instance carries data {id, number, seed}. Done when: I can walk past thousands of doors without frame drops.
```

P3.3 door numbering
```
Read 对照表 section on door markings. Render each door's number/marking per canon, performance-aware (texture atlas or canvas-generated textures, only near-player doors at full detail). Done when: numbers are readable up close, cost nothing at distance, and match the canon scheme.
```

P3.4 doors open into rooms
```
Wire door interaction: E on any door → Transitions into an InterviewRoom instance built from the room template, varied by that door's seed (door number displayed inside, minor prop offsets). Leaving returns me to the corridor at the same door. Done when: three different doors give three subtly different rooms and return works.
```

P3.5 corridor canon atmosphere
```
Apply 对照表 lighting/sound/atmosphere sections to the corridor: light rhythm, ambient sound, the feeling the text describes. Cite 引用; iterate with my feel notes. Done when: standing still in the corridor produces the mood the book describes.
```

P3.6 the two special ends
```
Per 对照表 transition sections: corridor entry point (from 列车 — stub for now) and the end door to 终焉之地 (visually distinct per canon, opens to a stub). Done when: both ends exist, are findable, and clearly differ from ordinary doors.
```

P3.7 performance + QA + handover
```
Perf pass: instancing sanity, frustum culling working, memory stable after opening/closing 20 rooms. Standard QA (resize, pointer lock, touch message). Screenshot set — this is the shareable phase. PROGRESS.md, commit, push. Done when: 60fps everywhere and the endless-corridor screenshot exists.
```

---

## P4 — 列车 (6 prompts, ~4 sessions)
GATE: docs/对照表-列车.md.

P4.1 carriage as repeat unit
```
Create src/config/train.js: one carriage as a repeatable unit (seats, windows, aisle, connecting doors) with dimensions from 对照表 sections 1–2 (cite; gaps = 推断). Build src/scenes/Train: 2–3 connected carriages, graybox, walkable. Done when: carriage proportions feel right walking the aisle.
```

P4.2 interior canon pass
```
Apply 对照表 陈设/材质 sections to the carriage: seats, fixtures, surfaces at our stylization level, citing 引用 per element. Done when: the interior passes the same section-8 style check as the room did.
```

P4.3 window view system
```
Build the moving-world-outside effect: layered parallax or shader-scrolled exterior per what the text describes being visible, cheap enough for 60fps. Include a stopped state. Done when: sitting by a window sells motion, and toggling moving/stopped works.
```

P4.4 motion + sound feel
```
Subtle train rumble audio loop + very gentle camera sway (amplitude tiny; include an off toggle for motion sensitivity). Iterate with my feel notes. Done when: eyes closed, the audio alone says "train"; sway never causes discomfort.
```

P4.5 列车 → 走廊 transition
```
Read the 对照表 transition section: implement how one leaves the 列车 into the 面试走廊 exactly as the text stages it, using Transitions. Done when: the crossing matches canon staging and lands me at the corridor's entry point.
```

P4.6 QA + handover
```
Standard QA + perf report. Screenshot set. PROGRESS.md (next up: P5), commit, push. Done when: deployed URL passes all checks.
```

---

## P5 — 终焉之地 vista + arrival sequence (6 prompts, ~4 sessions)

P5.1 the vista
```
Create src/config/land.js + src/scenes/LandVista: large-scale stylized terrain + skybox as seen from the corridor's exit, 神殿 silhouette placed per 对照表/推断 (cite what's canon vs guess). Vista only — no walkable terrain yet. Done when: the view reads epic at 60fps.
```

P5.2 the door-opening moment
```
Script the arrival beat: interacting with the corridor's end door → door opens with light spill → controlled walk-out onto the overlook → control returns to the player facing the vista. Use Transitions + a short scripted camera. Done when: the moment lands emotionally and control handoff is seamless.
```

P5.3 first-visit flow
```
Build src/core/Journey: localStorage-backed progress. First visit forces 列车 → 走廊 → 终焉之地 in order; returning visitors land at the hub with a "重走入场" (replay arrival) option. Done when: clearing storage reproduces the full first-visit flow, and a return visit skips it.
```

P5.4 hub navigation
```
From the 终焉之地 overlook, make 列车 and 面试走廊 re-enterable as spokes (diegetic portal points, not menu buttons), plus visibly-locked markers for future spokes. Done when: I can freely move between all three dimensions from the hub.
```

P5.5 arrival polish pass
```
Full run-through polish: pacing between scenes, continuous audio design across the whole 列车→走廊→终焉之地 sequence, all loads masked inside Transitions (no visible pop-in). Iterate with my notes on the complete run. Done when: one unbroken first-visit run feels intentional start to finish.
```

P5.6 R1 release QA
```
Release checklist: test in Chrome/Safari/Firefox, perf report per scene, favicon + page title + social share preview image, a short 关于/about overlay (fan project attribution, links). PROGRESS.md, commit, push. Done when: I would send this URL to a stranger.
```
→ **R1 LAUNCH: post to fandom + devlog episode.**

---

# PART II — THE LIVING WORLD

## P6 — World database + spoiler engine (6 prompts, ~4 sessions)
The foundation every view stands on. Built BEFORE any view.

P6.1 schema design — design checkpoint
```
Design the world data schema before writing code: entity types (character, event, location, 回响, 生肖位, 神兽, 规则/游戏) with typed relations (participates_in, located_at, holds_回响, member_of, governed_by), and chapter-awareness on EVERY record and EVERY field that can spoil (introduced_at chapter, per-field revealed_at). Content lives as human-editable files in content/ (one file per entity). Write the proposal to docs/SCHEMA.md and WAIT for my approval before implementing.
```

P6.2 loader + validation
```
Implement the approved schema: content/ file conventions, a loader that builds the in-memory world graph, and npm run validate — schema errors, broken relations, chapter sanity (revealed_at >= introduced_at), duplicate ids — with clear error messages. Done when: validate catches every mistake I deliberately plant in a test entry.
```

P6.3 spoiler engine
```
Build src/core/SpoilerEngine: given reader progress chapter C, it filters the world graph — entities with introduced_at > C do not exist at all; fields with revealed_at > C render as locked (视进度解锁 style), never as their value. All views must consume the graph ONLY through this engine. Done when: the same entity renders differently at three different C values, correctly.
```

P6.4 reader progress UI
```
Build the 阅读进度 control: set your chapter (input + arc-level presets), persisted in localStorage, changeable anytime from a persistent small UI element, with a clear "当前进度: 第 C 章" indicator so users always know what lens they're viewing through. Done when: changing progress instantly re-renders visible content.
```

P6.5 entity detail panel
```
Build src/ui/EntityPanel: one shared component that renders ANY entity type state-aware through the SpoilerEngine — name, summary, fields, and its relations as clickable links to other entities. Every future view (人物/规则/时间线/3D hotspots) opens this same panel. Done when: panel renders my seed entries of at least 3 different types correctly at 2 different progress values.
```

P6.6 spoiler leak tests
```
Build an automated spoiler test (npm run test:spoilers): for a sweep of progress values, walk every renderable entity/field/relation and assert nothing with introduced_at/revealed_at beyond progress appears. Relations count — an edge can be a spoiler. Wire it to run before every push. Done when: planting a deliberate leak makes the test fail loudly.
```

CONTENT TRACK (parallel, my job): author 10–15 REAL seed entries across types
while P6 is built — the schema gets validated against real content, not lorem ipsum.

---

## P7 — 人物 1:1 (6 prompts, ~4 sessions)
GATE: seed character entries authored. 1:1 = every NAMED character exists;
depth is tiered (main cast full pages, supporting cards).

P7.1 character index
```
Build the 人物 index view: card grid of all characters visible at current progress, filterable by faction and first-appearance arc, searchable by name. Cards show tier-appropriate info through the SpoilerEngine. Done when: index at chapter 50 vs chapter 500 shows correctly different populations.
```

P7.2 character page
```
Full character page for main-cast tier: state-aware arc timeline (what has happened to them up to my progress), current status, current 回响 loadout, allegiances — all through SpoilerEngine, all cross-linked via EntityPanel. Done when: one main character's page reads correctly at 3 progress points.
```

P7.3 relationship graph
```
Interactive relationship graph (force-directed): nodes = characters visible at progress, edges = typed relations (盟友/敌对/队伍/etc), filtered through SpoilerEngine (unrevealed edges absent, not grayed). Click node → EntityPanel. Keep it readable: cluster or filter controls for when the cast grows. Done when: the graph at two progress values differs correctly and stays legible at 50+ nodes.
```

P7.4 tier workflow
```
Formalize the two content tiers in schema + views: full profile vs card-only, with the validator enforcing required fields per tier. Document the authoring convention in docs/AUTHORING.md so I can batch-enter supporting cast fast. Done when: adding a card-tier character takes me under 3 minutes end to end.
```

P7.5 entry accelerator
```
Build a small import helper: I paste structured text (a documented plain-text format) → it generates valid content/ files, runs validate, reports what to fix. CLI is fine. Done when: I can turn my notes on 5 characters into 5 valid entries in one pass.
```

P7.6 QA + handover
```
Extend spoiler tests to the graph and index views explicitly. Standard QA. PROGRESS.md, commit, push. Done when: test:spoilers covers every P7 surface.
```

---

## P8 — 世界规则 codex (5 prompts, ~3 sessions)

P8.1 回响 database
```
Build the 回响 view: filterable database (by type, by holder, by first-appearance arc), each entry state-aware — a 回响's existence, holder, and evolution stages each carry their own revealed_at. Entry click → EntityPanel. Done when: a 回响 whose true nature is a late reveal shows only its early-known form at low progress.
```

P8.2 生肖 wheel
```
Build the 生肖 view as an interactive twelve-position wheel: each position shows its holder AT MY PROGRESS (holders change over the story — model succession with chapter ranges). Click position → holder history visible up to progress. Done when: the wheel at two progress values shows the correct different holders.
```

P8.3 神兽 bestiary
```
Build the 神兽 bestiary: entries with description, associated 生肖位/characters/events, appearance-gated by progress. Visual style consistent with the codex. Done when: bestiary renders seed entries correctly through the SpoilerEngine.
```

P8.4 规则 library
```
Build the 规则/游戏 library: one card per 游戏/round — its rules as documented, participants, outcome (outcome revealed_at = when the book reveals it, not when the game starts). Linked to timeline events and participants. Done when: a game in progress at my chapter shows rules but not outcome.
```

P8.5 QA + handover
```
Spoiler tests extended to all codex views. Standard QA. PROGRESS.md, commit, push. Done when: test:spoilers covers every P8 surface.
```

---

## P9 — 故事线 timeline (4 prompts, ~3 sessions)

P9.1 timeline model
```
Extend the schema for narrative structure: arcs contain 游戏/rounds contain events; events carry chapter anchors and participant/location/回响/规则 relations. Parallel tracks supported (simultaneous events on separate tracks). Validate against seed events. Done when: validate passes with real multi-track seed data.
```

P9.2 timeline view
```
Build the 故事线 view: horizontally scrubbed timeline with zoom levels (arc → 游戏 → event), parallel tracks rendered as lanes, HARD-CAPPED at my reading progress — beyond it the timeline visibly ends in a 「未读」 edge, no ghost entries. Done when: scrubbing and zooming are smooth and the cap moves with my progress setting.
```

P9.3 event detail
```
Event click → EntityPanel showing when/where/who/which 回响/under which 规则, every element cross-linked. Done when: I can navigate event → character → their 回响 → its other events without dead ends.
```

P9.4 QA + handover
```
Spoiler tests extended to timeline (the cap especially). Standard QA. PROGRESS.md, commit, push. Done when: test:spoilers covers the timeline.
```

---

## P10 — Integration: the doors become the world (4 prompts, ~3 sessions)

P10.1 diegetic navigation — design checkpoint
```
Design proposal: how the 3D world becomes the entrance to the data views — e.g. a marked zone of the 面试走廊 where doors open into 人物/规则/故事线, vs portals in the 终焉之地 hub. 2 options, tradeoffs, WAIT for my pick. Then build the chosen one with Transitions. Done when: I can reach every Part II view from inside the 3D world without a traditional menu.
```

P10.2 3D hotspots
```
Make world objects data-aware: locations in the 终焉之地 vista open their location entries; the interview desk opens the 规则 entry for interviews; corridor door numbers link where canon supports it. All through EntityPanel + SpoilerEngine. Done when: 5 hotspots work and none leaks beyond progress.
```

P10.3 deep links + share
```
URL routing: every view and entity gets a shareable URL (progress NOT encoded in links — visitors get their own progress prompt on first arrival, so links never spoil). Social share cards per major view. Done when: pasting an entity link into a new browser shows the progress prompt first, then the entity at chosen progress.
```

P10.4 R2 release QA
```
Full release checklist: cross-browser, perf per view, spoiler test suite green, content coverage report (entities per type, TODO(canon) count), about/credits updated. PROGRESS.md, commit, push. Done when: I would post this to the fandom as THE companion site.
```
→ **R2 LAUNCH: the full companion goes public + devlog episode.**

---

## P11 — Authoring upgrade (pain-triggered, unscheduled)

Trigger: when entering content via files + import helper feels slow (likely mid-P7/P8
content sprints). Then:
```
Build a local-only authoring UI (npm run author): forms per entity type generating valid content/ files, live validation, relation pickers that autocomplete existing ids. No backend, no auth — it writes files in my working copy. Done when: authoring a full-tier character via the UI beats hand-writing the file by 3x.
```

---

## Prompting rules

- One prompt, one system or feature. Verify in the browser before the next.
- Every task prompt ends with "Done when:" the agent can actually check.
- Design decisions get checkpoints: 2 options, tradeoffs, WAIT for my pick.
- Feedback by feel, EN or 中文: "门太小了", "walk floaty" — the agent converts feel to numbers.
- Errors: paste the full error, say "fix".
- Scope creep offer → "no, CLAUDE.md scope."
- Canon gap → placeholder + TODO(canon). The agent never invents book details.
- Every phase ends with QA + PROGRESS.md + push. Spoiler tests run before every push from P6 on.
