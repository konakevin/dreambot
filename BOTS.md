# Bot & Nightly Dream Generation System

> **V2 Bot Engine — Production (2026-04-25)**
>
> All 17 image bots run on the standalone V2 engine (`scripts/lib/botEngine.js`).
> Each bot is a pure-data Node module in `scripts/bots/<name>/`. All 17 are
> scheduled by a single DB-driven dispatcher (`.github/workflows/bots-dispatcher.yml`,
> fires every 15 min, reads `bot_schedules`) — see [Production Cron](#production-cron)
> for the dispatcher + scheduling-knob details. Two content bots (HumanBot,
> GlowBot) use custom standalone scripts with Sharp text overlays on a separate
> workflow — see [Content Bots](#content-bots-humanbot--glowbot).
>
> **Key files:**
> - `scripts/lib/botEngine.js` — shared render engine (Sonnet + Flux + Supabase)
> - `scripts/lib/seedGenHelper.js` — batched Sonnet pool generator with intra-pool dedup
> - `scripts/lib/modelPicker.js` — per-medium/vibe model routing (DB-backed)
> - `scripts/iter-bot.js` — dev iteration CLI (batch renders to /tmp or --post)
> - `scripts/run-bot.js` — production entry point (1 render, fail-loud, called by cron)
>
> **NEW PATH DEVELOPMENT (2026-07-07): all candidate paths iterate on AlphaBot**
> (`scripts/bots/alphabot/`), the PRIVATE proving-ground bot visible only to Kevin —
> see `ALPHABOT.md` for the privacy model, workflow, and promotion checklist.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview) — render pipeline, 4-layer axis structure, **3 engine layer enhancements** (chaos / two-pass / sensory)
2. [Bot Module Structure](#bot-module-structure) — file layout + **bot idempotence rule**
3. [The Bot Engine Contract](#the-bot-engine-contract) — required + optional fields including the 3 engine layers
4. [The Slot-Pool DNA Pattern](#the-slot-pool-dna-pattern) — defeats Sonnet's training-bias toward common archetypes
5. [Composition Architecture](#composition-architecture) — spatial anchor, camera-pool, cast block, CHAOS LEVEL 11, solo/ensemble split
6. [Path-Specific Lighting + Atmosphere](#path-specific-lighting--atmosphere) — per-path lighting pools (replaces shared LIGHTING/ATMOSPHERES)
7. [The NO LOCATION LEAKS Rule](#the-no-location-leaks-rule) — locations only from rolled pools, never from path-builder directive
8. [Seed Pool System](#seed-pool-system) — 200/50 standard, gen scripts, dedup
9. [Testing & Iteration (iter-bot.js)](#testing--iteration-iter-botjs) — CLI + **iteration workflow with Kevin** + **pulling actual ai_prompts**
10. [The "Bring It Alive" Process](#the-bring-it-alive-process) — modern architecture-first flow
11. [Writing Effective Briefs](#writing-effective-briefs) — structure, rules, anti-patterns
12. [Writing Effective Pool Gen Scripts](#writing-effective-pool-gen-scripts) — meta-prompts, dedup dimensions, anti-bias
13. [Lessons Learned](#lessons-learned) — 30 production lessons
14. [Production Cron](#production-cron) — per-bot GitHub Actions
15. [Bot Authentication & Credential Rotation](#bot-authentication--credential-rotation)
16. [Multi-Agent Worktree Workflow](#multi-agent-worktree-workflow) — concurrent Claude sessions need separate worktrees
17. [Creating a New Bot From Scratch](#creating-a-new-bot-from-scratch)
18. [Bot Roster](#bot-roster)
19. [Content Bots (HumanBot & GlowBot)](#content-bots-humanbot--glowbot)
20. [Nightly User Dreams](#nightly-user-dreams)
21. [Database Tables](#database-tables)

---

## Architecture Overview

### The Render Pipeline

Every bot render follows this exact pipeline:

```
1. Resolve path (cycleAllPaths shuffle-bag OR weighted random + 3-post dedup window)
2. Resolve medium (per-path override > bot.mediums list > defaultMedium)
3. Resolve vibe (vibesByPath > vibesByMedium > bot.vibes)
4. Fetch vibe directive from DB (dream_vibes.directive)
5. Create picker (pre-load 5-day recency window from bot_dedup)
6. Roll shared DNA (bot.rollSharedDNA — axes common to all paths)
7. Build brief (bot.buildBrief — path-specific Sonnet brief)
8. Call Sonnet (retry + Haiku fallback) → get 60-90 word prompt
9. Banned-phrase check → retry Sonnet up to 2x if triggered
10. Compose final prompt: prefix + mediumStyle + Sonnet output + suffix
11. Resolve model (bot.modelByPath > pickModel > flux-2-dev default)
12. Flux render (NSFW false-positive auto-retry up to 2x)
13. Download image to local disk
14. Optional post-process (content bots: Sharp text overlay)
15. Post to DB (uploads table + storage bucket)
16. Commit dedup picks to bot_dedup (ONLY on successful post)
17. Write bot_run_log (success or failure)
```

### Path Selection: Shuffle-Bag Cycling vs. Dedup Window

Bots have two path-selection strategies:

**Default (dedup window):** Weighted random pick from `bot.paths`, avoiding the last 3 posted paths. Good for bots where some path repetition is fine.

**Shuffle-bag / "mixed bag" (`cycleAllPaths: true`):** Every path is visited exactly once in random order before any path repeats. Once all N paths have posted, the bag refills and a fresh random cycle begins. This guarantees maximum variety — a bot with 15 paths posts all 15 in ~7.5 days (at 2/day) before you see the same path twice.

How it works:
- **In-batch:** `_batchCycleTracker[botName]` tracks which paths have been used this batch. When the tracker has all N paths, it resets to empty and a new cycle begins.
- **Across cron runs (DB persistence):** `getCycledUsedPaths()` reads `bot_run_log` for the bot, computes `totalOkPosts % pathCount` to find the current position within the cycle, then fetches the last N posts to reconstruct the "used" set.
- **Path picking:** `resolvePathCycled()` filters `bot.paths` to only those NOT in the used set, then does a weighted random pick from the remaining. If all paths are used (cycle complete), it picks from the full pool.

```javascript
// In bot index.js — opt in:
cycleAllPaths: true,
```

Implementation: `scripts/lib/botEngine.js` — `resolvePathCycled()`, `getCycledUsedPaths()`, `_batchCycleTracker`.
Tests: `__tests__/lib/cycleAllPaths.test.ts` — 16 tests covering pure function, multi-cycle simulation, mid-cycle resume, weighted paths.

**Which bots use it:** OceanBot (15 paths). Any bot with high path diversity where you want guaranteed coverage should opt in.

### 4-Layer Axis Structure

Every render is a combination of FOUR layers:

| Layer | What it is | Example |
|---|---|---|
| **1. Shared DNA** (`rollSharedDNA`) | Axes rolled ONCE per render, shared by all paths | skin, body-type, glow-color, scene-palette, character identity |
| **2. Path-specific axes** (inside `buildBrief`) | Axes rolled per-path | landscape type, action, closeup framing, camera angle |
| **3. Universal prose blocks** (`shared-blocks.js`) | Text injected verbatim into every brief | BLOW_IT_UP, NO_NAMED_CHARACTERS, SOLO_COMPOSITION |
| **4. Flux wrapping** (`promptPrefix` + `promptSuffix` + `mediumStyles`) | Style anchor applied to every final prompt | golden first-sentence + per-medium style + no-text suffix |

### 3 Engine Layer Enhancements (Chaos + Two-Pass Polish + Sensory Anchors)

```
━━━ PROVEN PATTERN — 3 engine layers (chaos / two-pass / sensory) ━━━
What worked: per-render distortion + tighter polish + multi-channel sensory
  anchoring lift renders from "static brief output" to "richly-detailed cinematic
  with controlled variation per render."
Reference impls (most recent first):
  • ToyBot 18 paths (2026-05-02, toybot-scene-paths branch) — full coverage
  • CuddleBot 22 paths (origin/main) — sensory pathContext for creature/scene split
  • StarBot 14 paths (commit 80e22ab "StarBot: chaos + two-pass + sensory anchors
    (6-context) + robot-moment fantasy ban") ← original implementation
Code reference: scripts/bots/starbot/index.js (canonical wiring),
                scripts/lib/{chaosLayer.js, sensoryAnchors.js, twoPassPolish.js}
Engine integration: scripts/lib/botEngine.js applies all 3 layers automatically
  if the bot.index.js has them configured.
```

These 3 layers are configured per-bot in `index.js` and applied automatically by `botEngine.js` per render. Without them, a bot still works but renders feel flat/repetitive.

#### Layer 1 — Chaos (`bot.chaos`)

```javascript
chaos: {
  enabled: true,
  skipPaths: [],                    // paths that opt OUT of chaos entirely
  allowSubjectChaosPaths: [          // paths that allow SUBJECT-level distortions
    'cosmic-vista', 'alien-landscape', 'space-opera',
    // ... all path names here
  ],
}
```

- **Subject-level chaos** = silhouette / echo distortions that warp the subject. Safe for SCENERY paths (landscape / city / vista). Risky for CHARACTER paths (deforms faces / bodies). Default: subject-chaos OFF.
- **Scene-level chaos** = atmospheric distortions (color refraction, smoke pattern shift, geometry tweak). Safe everywhere. Always enabled when `chaos.enabled: true`.
- **`skipPaths`** = paths where chaos is fully disabled (use sparingly).
- **Module:** `scripts/lib/chaosLayer.js` — `rollChaos()` + `buildChaosBriefBlock()`.

When a render fires, console output shows: `🌀 chaos: <channelKey> (intensity=0.62, n=1)`.

#### Layer 2 — Two-Pass Polish (`bot.twoPassPolish`)

```javascript
twoPassPolish: {
  enabled: true,
  conceptWords: 150,                // Sonnet concept-pass word target
  polishedWords: '65-90',           // Default Haiku polished-output target
  polishedWordsByPath: {            // Per-path overrides (character paths need more room)
    'cyborg-woman': '80-110',
    'cyborg-man': '80-110',
    'female-explorer': '80-110',
  },
  preservePhrasesByPath: {},        // Phrases the polish step MUST preserve
},
```

- **Pass 1 (Sonnet concept):** writes the rich brief-driven concept (~150 words).
- **Pass 2 (Haiku polish):** compresses concept to Flux-ready compound-phrase prose (~65-110 words depending on path).
- Character/cyborg/explorer paths get more polish room (80-110) because they need anatomy + outfit + pose detail in the polished output.
- **Module:** `scripts/lib/twoPassPolish.js` — `extendBriefForConcept()` + `buildPolishBrief()`.

When firing: `🔁 two-pass polish: concept→Haiku-polished (108 words)`.

#### Layer 3 — Sensory Anchors (`bot.sensoryAnchors`)

```javascript
sensoryAnchors: {
  enabled: true,
  requiredChannels: ['lightcolor'],         // Always rolled per render
  pathContext: {                            // Maps each path to a sensory CONTEXT
    'cyborg-woman': 'cyborg-female',        // pulls from cyborg-female sensory pools
    'cyborg-man': 'cyborg-male',
    'female-explorer': 'explorer-female',
    'cosmic-vista': 'scene',                // scene-context for scenery paths
    // ...
  },
  poolsByContextAndChannel: pools.SENSORY_POOLS,
}
```

- **Channels:** `lightcolor` (required), plus optional `smell / sound / touch / temperature / weight / air`. Engine rolls 1-3 channels per render including the required ones.
- **Contexts:** subject-type-specific pools (e.g., `cyborg-female` vs `scene`) so a cyborg gets cyborg-flavored sensory anchors and a landscape gets landscape-flavored anchors.
- **`requiredChannels: ['lightcolor']`** — guarantees a specific lighting/color anchor every render. Keeps palette discipline tight.
- **Module:** `scripts/lib/sensoryAnchors.js` — `rollSensoryAnchors()` + `buildSensoryBriefBlock()`.

When firing: `🌿 sensory: lightcolor+smell+temperature [figure] (n=3)`.

#### Wiring Sequence (botEngine.js)

```
brief = buildBrief(...)                              // Step 1: path-builder
brief += buildChaosBriefBlock(rollChaos(...))        // Step 2: append chaos
brief += buildSensoryBriefBlock(rollSensoryAnchors(...)) // Step 3: append sensory
concept = sonnet.generate(brief)                     // Step 4: pass 1
polished = haiku.generate(buildPolishBrief(concept)) // Step 5: pass 2
fluxPrompt = promptPrefix + mediumStyle + polished + promptSuffix
```

All 3 layers are opt-in. A bot without them still works — but it loses controlled variation, tighter polish, and per-render lighting/sensory anchoring.

### The Picker (DB-Backed Recency)

`createPicker()` pre-loads the last 5 days of picks from `bot_dedup` for the bot. Within a render:

- `picker.pick(pool)` — pure random, no dedup
- `picker.pickWithRecency(pool, axisName)` — filters out entries used in the last 5 days, warns if pool exhausted

Picks are queued in memory. `picker.commit()` writes them to DB **only** after a successful post. Dev batches without `--post` never commit — pool entries are never burned in dev mode.

**Pool exhaustion warning:** If a pool has fewer entries than 5 days of renders can consume, the picker falls back to full-pool random and logs a warning. The fix is always "expand the pool," never "shrink the dedup window."

---

## Bot Module Structure

Every bot lives in `scripts/bots/<name>/` with this structure:

```
scripts/bots/<name>/
  index.js          # The bot contract (required)
  pools.js          # Axis pools — inline arrays + load() from seeds/
  shared-blocks.js  # Universal prose blocks for this bot's identity
  paths/            # One .js file per path — each exports a brief-builder function
    cosmic-vista.js
    cyborg-woman.js
    ...
  seeds/            # Sonnet-generated JSON pools (200 entries each)
    alien_landscapes.json
    cyborg_actions.json
    ...
```

Generator scripts live separately in `scripts/gen-seeds/<name>/`:

```
scripts/gen-seeds/<name>/
  gen-alien-landscapes.js
  gen-cyborg-actions.js
  ...
```

### Bot Idempotence — Each Bot is Self-Contained

```
━━━ HARD RULE — bots NEVER cross-import each other's files ━━━
Reference: feedback Kevin enforced 2026-05-02 during cuddlebot/toybot port.
```

Each bot directory must be fully self-contained:
- `scripts/bots/<bot>/index.js` only requires from its own `./pools` and `./shared-blocks` and `./paths/`
- `scripts/bots/<bot>/pools.js` only loads from its own `./seeds/` directory
- **NEVER** require a pool file or seed JSON from another bot's directory

If a pool concept needs to be reused (e.g., `camera_angles.json`), **COPY** the JSON file into the new bot's `seeds/` folder. Don't symlink. Don't reach across.

**Why:** every bot is independently deletable. `rm -rf scripts/bots/<bot>/` should leave NO dangling references anywhere in the codebase. Cross-bot imports break this — deleting one bot would silently corrupt another.

Verification: `grep -rn "<otherbot>" scripts/bots/<thisbot>/` should return zero matches.

---

## The Bot Engine Contract

`index.js` exports a plain object with these fields:

### Required Fields

```javascript
module.exports = {
  username: 'starbot',        // matches DB users.username
  displayName: 'StarBot',     // for logs

  // Shuffle-bag path cycling — all paths visited once before any repeats
  // cycleAllPaths: true,

  // Which mediums this bot renders in (random pick per render)
  mediums: ['render'],
  // OR per-path medium locking:
  mediumByPath: {
    'real-space': 'real-astro',
    'cosmic-vista': 'render',
  },
  // OR single fixed medium:
  defaultMedium: 'watercolor',

  // Which vibes this bot uses (random pick per render)
  vibes: ['cinematic', 'dark', 'epic', 'ethereal', ...],
  // Optional per-path override:
  vibesByPath: {
    'cozy-sci-fi-interior': ['nostalgic', 'ethereal', 'enchanted', ...],
  },

  // All paths this bot can render
  paths: ['cosmic-vista', 'alien-landscape', 'cyborg-woman', ...],

  // Optional weighted path selection (default weight = 1)
  pathWeights: {
    'alien-landscape': 2,  // ~10.5% instead of ~5.3%
    'cyborg-woman': 2,
  },

  // Flux prompt wrapper — golden first-sentence + no-text suffix
  promptPrefix: 'cinematic sci-fi concept art, epic scale, ...',
  promptSuffix: 'no text, no words, no watermarks, ...',

  // Roll shared DNA (axes that persist across all paths for one render)
  rollSharedDNA({ vibeKey, path, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  // Build the Sonnet brief for a specific path
  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  // Optional caption for the uploaded post
  caption({ path }) {
    return `[${path}] StarBot`;
  },
};
```

### Optional Fields

```javascript
// Per-medium style injection — overrides DB flux_fragment for this bot.
// THIS IS HOW YOU MAKE EACH MEDIUM VISUALLY DISTINCT FOR YOUR BOT.
//
// IMPORTANT: keep mediumStyles concise (~150-300 chars per medium).
// DO NOT bake composition / framing / lens directives into the medium-style —
// "dramatic low-angle hero composition" / "shallow-depth-of-field" / "macro
// close" hardcoded into a medium-style overrides any rolled camera-angle and
// forces every render into hero-shot / single-subject framing. Medium-style
// describes ANATOMY / TEXTURE / MATERIAL only. Composition comes from rolled
// camera_angles + path-builder composition-lock blocks.
//
// (Lesson learned 2026-05-02 on toybot mech-toy-rampage — see Lessons section.)
mediumStyles: {
  photography: '35mm cinematic sci-fi film-still — Denis-Villeneuve ...',
  canvas: 'painted sci-fi-paperback-cover oil-on-canvas — Chesley-Bonestell ...',
  render: 'high-end cinematic 3D render — feature-film VFX quality ...',
},

// Per-medium prefix/suffix overrides (replaces bot.promptPrefix/Suffix for that medium)
promptPrefixByMedium: {
  'real-astro': 'NASA Hubble JWST astrophotography, ...',
},
promptSuffixByMedium: {
  'real-astro': 'astrophotography finish, deep black space contrast, ...',
},

// Per-path model locking — overrides pickModel() for specific paths
modelByPath: {
  'cosmic-vista': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  'cyborg-woman': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
},

// Phrases that trigger Sonnet re-roll (up to 2 retries)
bannedPhrases: ['jack skellington', 'tim burton'],

// 3 ENGINE-LAYER ENHANCEMENTS — see Architecture Overview > 3 Engine Layer Enhancements
// for full documentation. All three are opt-in. botEngine.js applies them
// automatically per render.

chaos: {
  enabled: true,
  skipPaths: [],
  allowSubjectChaosPaths: ['cosmic-vista', 'alien-landscape', /* ... */],
},

twoPassPolish: {
  enabled: true,
  conceptWords: 150,
  polishedWords: '65-90',
  polishedWordsByPath: {
    'cyborg-woman': '80-110',  // character paths get more room
  },
  preservePhrasesByPath: {},
},

sensoryAnchors: {
  enabled: true,
  requiredChannels: ['lightcolor'],
  pathContext: {
    'cyborg-woman': 'cyborg-female',
    'cosmic-vista': 'scene',
    /* ... */
  },
  poolsByContextAndChannel: pools.SENSORY_POOLS,
},

// Content bot hooks (HumanBot/MuseBot only)
generateTextContent({ picker, sharedDNA, path, vibeKey }) { ... },
postProcess({ localPath, textContent, sharedDNA, path }) { ... },
```

### Path Builder Functions

Each `paths/<name>.js` exports a function that returns a Sonnet brief string:

```javascript
module.exports = ({ sharedDNA, vibeDirective, vibeKey, picker }) => {
  // Roll path-specific axes
  const landscape = picker.pickWithRecency(pools.ALIEN_LANDSCAPES, 'alien_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  // Return the Sonnet brief — a multi-section prompt that tells Sonnet
  // exactly what to write, with pool entries filling the variable slots
  return `You are an alien-world concept artist writing a scene for StarBot...

━━━ THE ALIEN LANDSCAPE ━━━
${landscape}

━━━ LIGHTING ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. ...`;
};
```

---

## The Slot-Pool DNA Pattern

```
━━━ PROVEN PATTERN — slot-pool DNA ━━━
What worked: defeats Sonnet's training-bias toward common archetypes (teddy-bear,
  muscle-car, humanoid-mecha, steam-locomotive, hooded-monk) by injecting an
  explicit cast-roster per render that Sonnet must use, instead of letting
  Sonnet invent characters/subjects.
Reference impls (most recent first):
  • CuddleBot plushie-life + dollhouse-life (2026-05-02, toybot-scene-paths
    branch) — 30/70 solo-ensemble using CUTE_CREATURES pool
  • ToyBot plush-world / mech-toy-rampage / hotwheels-city / model-train-world
    / dollhouse-life / space-saga-figures (2026-05-02, toybot-scene-paths
    branch) — 6 paths with full slot-pool DNA
  • StarBot female-explorer / male-explorer (commit 004e40c "StarBot explorer
    paths: slot-pool DNA upgrade", 2026-04-30)
  • StarBot cyborg-woman / cyborg-man (commit 7c09211 "StarBot cyborg overhaul",
    2026-04-26) ← original
Code reference: scripts/bots/starbot/paths/cyborg-man.js (canonical, well-commented)
                scripts/bots/toybot/paths/mech-toy-rampage.js (modern with all layers)
                scripts/bots/toybot/seeds/{plush_creatures,hotwheels_cars,
                  mech_archetypes,train_consists,space_saga_figures}.json (200 each)
```

### Why slot-pool DNA

Without it, every render of a plush path gives you a teddy bear (Sonnet's default for "plush"). Every mech render gives you a humanoid mecha (Sonnet's default for "mech"). Every Hot-Wheels render gives you a chrome muscle car (Sonnet's default for "Hot Wheels"). Variety dies.

The slot-pool pattern fixes this: a dedicated `<subject>_<plural>.json` pool of 200 individual archetypes is rolled at render-time, and the path-builder injects the rolled cast as an explicit "RENDER THESE EXACT" block in the brief. Sonnet must use the listed creatures/cars/mechs — it can no longer default.

### The 4 essential slot-pools per path

For any path that has a clear subject type, build all 4:

| Pool | Purpose | Size | Example |
|---|---|---|---|
| `<path>_scenes.json` | Mid-action scenarios | 200 | "Five rebel pilots mid-trench-run, blaster-bolts streaking past canopies" |
| `<path>_landscapes.json` | Wide vistas / playset dioramas | 200 | "Wide Tatooine cantina interior, sandstone-arch entrance, jukebox alcove" |
| `<path>_<subjects>.json` | Individual subject archetypes (the slot-pool) | 200 | "vintage 3.75-inch Kenner Boba Fett, T-visor green-armor, jetpack with rocket" |
| `<path>_lighting.json` | Path-specific atmosphere + light + season | 100 | "Death Star Throne Room red-lit dais, single overhead spotlight on throne" |

Plus shared `camera_angles.json` (60-150 entries, copied per-bot for idempotence).

### Path-builder injection pattern

```javascript
const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // Roll scene + landscape (70/30 typical split)
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.PATH_LANDSCAPES, 'path_landscape')
    : picker.pickWithRecency(pools.PATH_SCENES, 'path_scene');

  // Roll path-specific lighting + camera
  const lighting = picker.pickWithRecency(pools.PATH_LIGHTING, 'path_lighting');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Slot-pool DNA: roll N subjects per render to defeat training-bias
  const castSize = 2 + Math.floor(Math.random() * 2);  // 2-3 typical
  const cast = [];
  for (let i = 0; i < castSize; i++) {
    cast.push(picker.pickWithRecency(pools.PATH_SUBJECTS, `path_subject_${i}`));
  }

  return `[role statement]

[shared blocks]

━━━ MEDIUM LOCK ━━━
[anatomy / texture / material — NO composition language]

━━━ CAMERA ━━━
${camera}

━━━ COMPOSITION LOCK — SPATIAL ANCHOR ━━━
WIDE DIORAMA FRAME — exactly ${castSize} distinct subjects visible simultaneously,
spatially separated as ${castSize === 2 ? 'left and right' : 'left, center, right'}.
Each occupies its OWN silhouette zone. NO single hero subject dominating.

━━━ THE SCENE ━━━
${scene}

━━━ THE CAST — RENDER THESE EXACT (NON-NEGOTIABLE) ━━━
The subjects in this scene MUST be exactly these specific archetypes — render
the EXACT class, gear, and signature detail of each:
${cast.map((c, i) => \`\${i + 1}. \${c}\`).join('\n')}

━━━ LIGHTING + ATMOSPHERE ━━━
${lighting}

[remaining blocks]`;
};
```

### Cast-roll size recommendations

| Subject type | Roll size | Why |
|---|---|---|
| Plush creatures | 1 (solo, 30%) or 3-5 (ensemble, 70%) | Mix tender hero + group adventure |
| Mech-toys | 2-3 | Larger casts dilute battle action — 3 max |
| Die-cast cars | 3-6 | Race / parade scenes need pack |
| Train consists | 1 | One train per scene (era + cars baked in) |
| Dollhouse figurines | 1 (solo, 30%) or 3-5 (ensemble, 70%) | Cozy domestic moments |
| Space-saga figures | 2-3 | Battle scenes need a duel + supporting cast |

Larger casts → static lineup feel + feature fusion (Flux merging multiple subjects into one). Smaller casts → action front-and-center.

---

## Composition Architecture

```
━━━ PROVEN PATTERN — composition-lock + spatial-anchor + camera-pool ━━━
What worked: solving Flux's "collapse multiple subjects into one hero shot"
  failure mode requires layered composition control.
Reference: ToyBot mech-toy-rampage R5-R8 iteration (toybot-scene-paths branch,
  2026-05-02) — diagnosed multi-mech collapse, fixed in 4 layers.
```

### Why composition is hard with Flux

When a polished prompt describes "powered-armor exosuit + snowplow-mech + manta-ray-mech all mid-action," Flux often renders ONE mech with all 3 sets of features ("feature fusion"). It happens because:

1. The PROMPT_PREFIX biases toward "the subject" (singular)
2. The medium-style hardcodes hero-shot composition ("low-angle hero", "shallow-DOF", "macro close")
3. The polished output is dense compound-noun prose where Flux struggles to parse separate subjects
4. Flux's training-bias for "mech" / "robot" defaults to single-mech vanity shot regardless

ChatGPT's diagnosis (2026-05-02): mechs are a known weak point for diffusion models. **Plushies have the same problem**. **Cars work fine** because they have rigid distinct silhouettes. **Multi-character only works when each subject is simple** (humans-in-clothes, cars) — but if subjects are visually rich (mechs, plushies), Flux compresses.

### Layer 1 — Spatial anchor (the killer fix)

Add a non-negotiable spatial anchor block to the path-builder:

```
━━━ COMPOSITION LOCK — NON-NEGOTIABLE SPATIAL ANCHOR ━━━
WIDE DIORAMA FRAME — exactly ${castSize} distinct mech-toys visible simultaneously,
spatially separated as ${castSize === 2 ? 'left and right' : 'left, center, right'}.
Each occupies its OWN silhouette zone — no overlap, no merging.
NO single hero subject dominating the frame.
ALL ${castSize} mechs visible in clear frame at the same time.
(Camera direction above sets the lens.)
```

Diffusion models respond to **spatial language** ("left/center/right", "foreground/midground/background") much better than narrative count ("three mechs"). This single block fixed mech-toy-rampage's multi-character collapse in one R5 iteration.

### Layer 2 — Strip composition language from mediumStyles

Most original `mediumStyles` entries had baked-in composition: "dramatic low-angle hero composition", "shallow-depth-of-field", "macro close depth-of-field". These come BEFORE the polished output in the final Flux prompt and override any rolled camera-angle.

**Fix:** describe ANATOMY / TEXTURE / MATERIAL only. Let `camera_angles` pool drive composition.

```javascript
// BAD — composition baked in (caused all mechs to render as single hero)
mech_toys: 'articulated mech-toy aesthetic — robot-toy with ball-joint articulation,
  ... mecha-anime-toy-line dramatic low-angle hero composition, chrome reflections,
  cockpit-glow, sparks-flying — NEVER CGI',

// GOOD — anatomy only, camera comes from pool roll
mech_toys: 'articulated mech-toys — robot-toys with ball-joint articulation at
  neck/shoulders/elbows/wrists/hips/knees/ankles, chrome-plated paneling, visible
  transformation seams, cockpit-canopy with glowing tinted plastic, hand-painted
  weathering, snap-on weapon accessories, 1/144 to 1/100 collector scale,
  real-physical-toys on a handcrafted set, chrome reflections, cockpit-glow,
  sparks-flying — NEVER IP-named, NEVER CGI',
```

The smoking-gun phrases to strip from any mediumStyle: `dramatic low-angle hero composition`, `shallow-depth-of-field`, `macro close`, `extreme low macro angle`, `display-cabinet photography`, `wide-diorama framing`, `hero composition`. These ALL force singular-subject framing.

### Layer 3 — Camera-angle slot-pool

Generate a `camera_angles.json` pool with 60-150 cinematic angles + lens cues. Roll one per render. This becomes the SOLE composition directive in the final prompt:

```javascript
const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
// brief includes:
// ━━━ CAMERA ━━━
// ${camera}
```

Sample entries:
```
"low-angle hero shot looking up, wide-90mm, deep-focus, dramatic chrome highlights"
"worm's-eye floor-level dust-cam, 2.39:1 cinemascope, foreground silhouettes blurred"
"high-angle bird's-eye 75-degrees-down, deep-focus diorama-overview, even spacing"
"canted dutch-tilt 15-degrees, telephoto-compression, foreground-action sharp"
```

Generate at **150-200 entries** to avoid pool exhaustion. ToyBot's initial 60-entry pool exhausted in 5 days under heavy iteration — picker fell back to full-pool random.

### Layer 4 — Cast block AFTER scene (not before)

Earlier impl had cast block BEFORE scene block. Result: Sonnet read the cast list as a static lineup directive ("here are 3 mechs to render") rather than as actors performing the scene. Renders defaulted to portrait-pose group shots.

**Fix:** scene block goes FIRST, then cast block reframed as "the action above is performed BY these specific archetypes":

```
━━━ THE MECH-TOY SCENE ━━━
${scene}    // e.g., "Four chrome mechs vs four dark in chaotic free-for-all..."

━━━ THE MECHS PERFORMING THIS SCENE ━━━
The battle-action above is performed BY these specific mech archetypes — render
their distinctive features WHILE they engage in the scene's action (mid-clash /
mid-volley / mid-charge / mid-rescue). NEVER render them as a static lineup or
standing-pose group portrait. They are ACTIVE participants in the battle, not
posing for a photo:
${cast.map((c, i) => \`\${i + 1}. \${c}\`).join('\n')}
```

### Solo / Ensemble Split (30/70)

For creature/character paths where single tender moments are worth keeping alongside group action, gate the cast roll:

```javascript
// 30% solo (1 subject) / 70% ensemble (3-5 subjects)
const isSolo = Math.random() < 0.3;
const castSize = isSolo ? 1 : 3 + Math.floor(Math.random() * 3);

// Then use isSolo to swap composition lock + cast block style:
${isSolo
  ? `━━━ COMPOSITION — SOLO TENDER MOMENT ━━━
A SINGLE subject in the frame, mid-cozy-activity. Intimate storybook composition.`
  : `━━━ COMPOSITION LOCK — SPATIAL ANCHOR ━━━
WIDE DIORAMA FRAME — exactly ${castSize} distinct subjects visible simultaneously...`}
```

When testing solo / ensemble independently, temp-hardcode `isSolo = true` (or `false`), run 5 batches, then revert to the random gate. Reference: toybot/paths/plush-world.js + cuddlebot/paths/plushie-life.js.

### CHAOS LEVEL 11 — Multi-Event Action

```
━━━ PROVEN PATTERN — CHAOS LEVEL 11 multi-event scenes ━━━
What worked: action paths felt static even with mid-action verbs because each
  scene-pool entry described ONE action (e.g., "soldiers mid-charge"). Forcing
  3+ simultaneous events per scene (vehicle exploding + figures mid-leap +
  blaster-bolts streaking + environmental destruction) creates true cinematic
  chaos that Flux renders as battle.
Reference: ToyBot space-saga-figures (toybot-scene-paths branch, 2026-05-02)
  scenes pool regen with explicit chaos rules.
Code: scripts/gen-seeds/toybot/gen-space-saga-scenes.js
```

For battle / action paths, the gen-script meta-prompt must enforce simultaneity:

```
━━━ CHAOS-LEVEL-11 RULE — NON-NEGOTIABLE ━━━
EVERY entry must contain MINIMUM 3 simultaneous things happening:
- 3+ characters mid-action (not standing) — firing / leaping / falling / dueling / charging
- VEHICLE in frame mid-action (TIE Fighter exploding / X-wing strafing / AT-AT falling)
- VISIBLE PYROTECHNICS — explosion-bloom + blaster-bolts streaking + debris-shrapnel
- ENVIRONMENTAL DESTRUCTION — wall mid-shatter / floor mid-collapse / panel mid-explode
```

Static tableau scenes ("haggling", "discussing", "setting-up", "surrounding-projector", "fueling-quietly") are explicitly BANNED in the gen-script meta-prompt for action paths. The pool entries must describe peak-chaos cinematic moments — not setup or aftermath.

---

## Path-Specific Lighting + Atmosphere

```
━━━ PROVEN PATTERN — path-specific lighting pools ━━━
What worked: shared LIGHTING + ATMOSPHERES pools made every path feel like the
  same toy-photo studio. Path-specific lighting+atmosphere pools (combined into
  one richer entry per render) gave each path distinct atmospheric DNA.
Reference: ToyBot 5 paths (toybot-scene-paths branch, 2026-05-02):
  • mech_lighting.json — battle atmospheres (neon-cityscape, volcano-glow,
    orbital-station, megacity-rain)
  • plush_lighting.json — cozy storybook (campfire-flicker, fairy-light strings,
    snowfall-window, attic-dust-motes)
  • hotwheels_lighting.json — household event-driven (BBQ-twilight, Christmas-
    tree, sleepover-fairy-light, halloween-driveway-fog)
  • dollhouse_lighting.json — interior cozy-domestic (Victorian fringed-lamp,
    nursery-nightlight, library-readinglamp)
  • train_weather.json — full season × weather × time-of-day axis
Plus CuddleBot: cuddle_plush_lighting.json + cuddle_dollhouse_lighting.json
  (cute-nudged variants for Sanrio/Pusheen kawaii energy)
Code: scripts/bots/toybot/paths/{mech-toy-rampage,plush-world,hotwheels-city,
      dollhouse-life,model-train-world}.js — all use path-specific lighting,
      none use shared LIGHTING/ATMOSPHERES rolls
```

### Why path-specific lighting

The shared `LIGHTING` + `ATMOSPHERES` pools were generic toy-photo lighting (studio strobe / noir / golden-hour / etc.). When every path drew from the same shared pool, paths felt repetitive even with distinct subjects.

Each path needs its OWN signature lighting/atmosphere DNA tied to the path's world:
- **mech battle paths** want neon megacity / orbital station / volcano lab
- **plush cozy paths** want campfire flicker / fairy lights / attic dust-motes
- **car event paths** want BBQ twilight / Christmas tree / driveway sunset
- **dollhouse interior paths** want Victorian fringed-lamp / nursery nightlight
- **train diorama paths** want autumn dawn / blizzard whiteout / aurora-borealis

### Pool size + content

100 entries per path, each entry combining ENVIRONMENT + LIGHT + ATMOSPHERE in one 10-20 word phrase:

```
"neon-cityscape backlit dawn, magenta-cyan crossfire glow, polluted smog haze, dramatic silhouettes"
"forest-campfire pink flicker dusk, ember-rose drift, pollen sparkles in golden flame-light"
"BBQ-twilight grill-smoke haze, ember-glow, sodium patio-lights flickering on, peach sky"
"Victorian-parlor fringed-lamp warm-amber pool, dust-motes in afternoon-window beam"
"winter blizzard whiteout, late-afternoon flat-pewter sky, snow-flurries obscuring distant terrain"
```

### Path-builder integration

REPLACE the `LIGHTING` + `ATMOSPHERES` rolls with a single path-specific lighting roll:

```javascript
// BEFORE (shared, generic, repetitive across paths)
const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
// ...
// ━━━ LIGHTING ━━━ ${lighting}
// ━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}

// AFTER (path-specific, distinct atmospheric DNA)
const lighting = picker.pickWithRecency(pools.PATH_LIGHTING, 'path_lighting');
// ...
// ━━━ LIGHTING + ATMOSPHERE ━━━ ${lighting}
```

### When to add path-specific lighting

- Path has a clear distinct world (battle / cozy-cottage / household-event / interior-domestic / weather-driven outdoor)
- Renders feel atmospherically repetitive across the path's batches
- Path uses sharedDNA.scenePalette + sharedDNA.colorPalette but those + shared LIGHTING create muddy color-stack

When NOT to add:
- Path is fundamentally a generic toy-photo shoot (lego-epic, claymation, vinyl) — shared LIGHTING is fine
- Path-specific atmosphere isn't compelling enough to fill 100 entries with distinct cues

---

## The NO LOCATION LEAKS Rule

```
━━━ HARD RULE — locations only from rolled pools, never from path-builder ━━━
What worked: keeping the path-builder's directive 100% architectural (rules,
  energy, framing) means the location/setting variety comes ENTIRELY from the
  rolled scene-pool entry. Mixing in directive-level location examples kills
  variety because every render gets those locations as anchors.
Reference: feedback Kevin caught 2026-05-02 in toybot/paths/space-saga-figures.js
  composition-lock (had "Hoth, Endor, Trench Run, Cantina, Sarlacc Pit" baked
  in as examples — leaked into every render)
Memory file: feedback_no_location_leaks.md
```

**The rule:** never hardcode specific locations / scenes / settings into a path-builder's base directive. Specific locations MUST come from the rolled Sonnet seed pool entry.

### What this means in practice

Path-builder directives describe **architecture, rules, energy** only:
- ✅ "WIDE DIORAMA FRAME — exactly N subjects visible simultaneously"
- ✅ "Frozen frame of cinematic chaos — multiple things happening simultaneously"
- ✅ "NEVER static / NEVER posed / NEVER lineup"
- ✅ "3+ figures mid-action + vehicle mid-action + visible pyrotechnics"

Path-builder directives **NEVER** name:
- ❌ Specific planets, cities, or worlds (no "Tatooine, Hoth, Endor")
- ❌ Specific scenes or moments (no "the Trench Run, the Cantina shootout")
- ❌ Specific eras or franchise-specific settings (no "1977 Mos Eisley")

### Where examples DO belong

If you need to give Sonnet examples of locations or scenes, put them in the **gen-script meta-prompt** (which produces the seed pool — runs once, not per-render):

```javascript
// In scripts/gen-seeds/<bot>/gen-<path>-scenes.js — examples here are FINE
metaPrompt: (n) => `Write ${n} Star Wars action scenes. Cover all iconic
  locations: Mos Eisley cantina, Hoth ice trench, Endor speeder chase,
  Death Star trench run, Cloud City duel, Mustafar lava platform...`,
```

Examples in gen-scripts produce a varied pool. Examples in path-builders compound across every render and kill variety.

### Quick check

Re-read your path-builder directive. If you can identify what bot/path/franchise it's for from the directive alone, you've leaked too much. The directive should be neutral architecture that would work for any bot doing similar work.

---

## Seed Pool System

### Pool Sizing Standard

**ALL pools: 200 entries, batch 50, Sonnet-generated.**

| Parameter | Value | Why |
|---|---|---|
| `total` | 200 | 5-day dedup window × 2 posts/day = 10 picks/window. 200 entries means the pool never exhausts. |
| `batch` | 50 | Sonnet generates 50 per call with intra-batch dedup. 4 batches × 50 = 200. Each batch sees all prior entries as "ALREADY GENERATED — DO NOT DUPLICATE." |

**Exception:** Hand-curated pools (skin tones, hair styles, body types, eye styles) stay inline in `pools.js` — these are sensitive axes where Sonnet-generated entries introduced unintended language (see Lessons Learned).

### Generator Scripts

Each pool has a generator script in `scripts/gen-seeds/<bot>/`:

```javascript
#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/alien_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ALIEN LANDSCAPE descriptions...

━━━ WHAT MAKES A GOOD ENTRY ━━━
...

━━━ CATEGORIES TO COVER (spread across all) ━━━
...

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: [what makes two entries "too similar"]

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
```

### How seedGenHelper Works

1. Calls Sonnet with the `metaPrompt(batchSize)` — batch 1 gets no prior entries
2. Parses JSON array from response
3. On batch 2+, appends ALL prior entries as a dedup reference:
   `━━━ ALREADY GENERATED (DO NOT DUPLICATE, vary strongly from these) ━━━`
4. Retries up to 3x on JSON parse failure (adds strictness note on retry)
5. Writes final JSON array to `outPath`

### Running Generators

```bash
# Single pool
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
node scripts/gen-seeds/starbot/gen-alien-landscapes.js

# All pools for a bot (parallel)
for f in scripts/gen-seeds/starbot/gen-*.js; do node "$f" & done; wait
```

### Pool Loading

`pools.js` uses a `load()` helper to read from `seeds/`:

```javascript
const fs = require('fs');
const path = require('path');
function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// Sonnet-generated pools (200 entries each)
const ALIEN_LANDSCAPES = load('alien_landscapes');

// Hand-curated pools (inline, sensitive axes)
const CYBORG_SKIN_TONES = [
  'deep ebony brown skin with rich mahogany undertones, warm and matte',
  ...
];
```

---

## Testing & Iteration (iter-bot.js)

### CLI Flags

```bash
node scripts/iter-bot.js --bot <name> [flags]

  --count N        # renders per batch (default 5 — ALWAYS USE 5 FOR GUT-CHECK)
  --mode X         # 'random' (default), 'mixed' (round-robin all paths), or specific path name
  --vibe X         # specific vibe key, or 'random' (default)
  --medium X       # force a specific medium (overrides bot.mediums entirely)
  --model X        # force a specific model (overrides bot.modelByPath + pickModel)
  --label X        # string in saved filenames (default 'iter')
  --post           # ALSO post each render to DB + commit dedup + write run log
  --dry-run        # brief-only debug, no Flux render
```

### Common Testing Patterns

```bash
# Random 5-render gut-check (default batch size)
node scripts/iter-bot.js --bot starbot --count 5 --post

# Test a specific path
node scripts/iter-bot.js --bot starbot --count 5 --mode cyborg-woman --post

# Test a specific path + vibe combo
node scripts/iter-bot.js --bot starbot --count 5 --mode cyborg-woman --vibe dark --post

# Test a specific medium across random paths
node scripts/iter-bot.js --bot starbot --count 5 --medium photography --post

# Force a specific Flux model for A/B testing
node scripts/iter-bot.js --bot starbot --count 5 --model black-forest-labs/flux-1.1-pro --post

# Round-robin all paths (1 render per path)
node scripts/iter-bot.js --bot starbot --count 13 --mode mixed --post

# Dry-run to inspect briefs without spending Replicate credits
node scripts/iter-bot.js --bot starbot --count 3 --dry-run

# Random 10-batch posted to feed for phone QA
node scripts/iter-bot.js --bot starbot --count 10 --post
```

### Temp Forcing Technique

To force closeup or full-body for paths with a random split:

```javascript
// In paths/cyborg-woman.js — TEMPORARILY change for testing:
const isCloseup = true;   // force all closeups
const isCloseup = false;  // force all full-body

// REVERT after testing:
const isCloseup = Math.random() < 0.7;  // 70% closeup, 30% full-body
```

### Key Rules

- **Default batch is 5.** 20 is overkill for gut-check. 5 gives signal without burning time/money.
- **"Run a batch" = always `--post`.** /tmp-only renders are useless — Kevin QAs on his phone.
- **After any code change, render 5 and verify.** Don't trust "deployed green" alone.
- **Test pools at 25 before scaling to 200.** Generate 25, test quality, then scale after approval.

### The Iteration Workflow with Kevin

```
━━━ PROVEN PATTERN — fire-grade-iterate cadence ━━━
What worked: tight 5-render loops with Kevin grading on phone, Claude making
  ONE targeted change per round based on feedback, never multi-variating.
Reference: ToyBot 5 new paths (toybot-scene-paths branch, 2026-05-02) — 35
  iterations across hotwheels / mech / plush / train / dollhouse converged in
  one session.
```

The standard back-and-forth that took ToyBot from "everything broken" to "approved across 6 paths":

1. **Claude fires** a 5-render batch with `--post --label <path>-r<N>`
2. **Console output** shows what fired per render (chaos / sensory / polish word counts) — Claude pastes the table back to Kevin
3. **Kevin grades on phone** while Claude waits. Typical responses:
   - `"good, next"` → fire next path's batch
   - `"good"` (no "next") → that path is locked in, ask what's next
   - `"X is wrong"` (e.g., "all single", "too red", "no track") → diagnose ONE layer, fix ONE thing, fire R<N+1>
   - `"hardcode X and run 5 more"` → temp-force the failing branch (e.g., `isSolo = true`), run 5, then revert to the random gate
4. **Claude diagnoses by pulling the actual `ai_prompt` from DB** when feedback isn't obvious from console output — this is what caught the medium-style "low-angle hero" override and the "characters standing around" feedback-fusion problem.
5. **One change per round.** Never multi-variate. If R2 fails, the next round changes ONE layer. The next round's grade tells you whether THAT change moved the needle.
6. **Commit on approval.** When Kevin says "good" / "perfect" / "next" — commit IMMEDIATELY before doing anything else. (See `feedback_commit_on_approval.md` memory — Kevin lost hours to this.)

#### Caption tagging for traceability

Use `--label <path>-r<N>-<descriptor>`:
- `mech-r1` — first batch, baseline
- `mech-r2` — second batch
- `mech-r5-spatial` — fifth batch with spatial-anchor change
- `mech-r7-no-comp` — seventh batch with composition-stripped medium-style

The label appears in caption like `[mech-toy-rampage] ToyBot` — Kevin can later filter `uploads.caption` by label to find specific iterations he hearted.

#### Pulling actual Flux prompts when stuck

When the console output and your edits look right but the render is still bad, pull what actually reached Flux:

```javascript
// Run via: node -e "<this script>"
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data } = await sb
  .from('uploads')
  .select('caption, ai_prompt')
  .ilike('caption', '%<path>%')
  .order('created_at', { ascending: false })
  .limit(5);
data.forEach(r => console.log(r.caption + ':\n' + r.ai_prompt + '\n'));
```

Look for:
- **Frontloaded directives in the medium-style** (e.g., "low-angle hero composition" overriding camera roll)
- **Stacked color sources** (mediumStyle + scenePalette + colorPalette + sensory all pushing the same color = muddy)
- **Truncation** at the end (Sonnet output cut off because medium-style ate too much budget)
- **Polish flattening** (cast list collapsed into compound prose)

This is how the "everything looks single-mech" diagnosis worked: Sonnet output was multi-mech good, but `mediumStyles.mech_toys` had "dramatic low-angle hero composition" hardcoded as the medium prefix, dominating Flux's interpretation. Fix was stripping composition language from medium-styles, leaving the rolled `camera_angles` to drive framing.

#### Auto-QA loop (no human in loop)

For longer convergence work, the auto-QA loop pattern (Claude grades own renders against pre-registered rubric) lives in `CLAUDE.md` under "Automated QA feedback loop". Use when Kevin's standing protocol is: "auto-tune path X to convergence" without per-round grading.

---

## The "Bring It Alive" Process

```
━━━ MODERN 7-step flow (post slot-pool DNA, post 3 engine layers) ━━━
What worked: architecture-first approach. Get the slot-pool + spatial anchor +
  camera + path-specific lighting + 3 layers wired BEFORE iterating on briefs.
  Brief tweaks compound poorly without the architectural foundation.
Reference: ToyBot 5 new paths (toybot-scene-paths branch, 2026-05-02) — this
  flow took mech-toy-rampage from "all single mechs" → "ensemble battles with
  varied camera + lighting" in ~7 iteration rounds.
```

### Step 1: Audit the Current State

```bash
node scripts/iter-bot.js --bot <name> --count 5 --post
node scripts/iter-bot.js --bot <name> --count 5 --mode <path> --post
```

Score on phone 1-5. Identify which paths are weakest. Note specific failure modes (single-character collapse / repetitive lighting / boring tableau / muddy color stack / etc.).

**Pull actual ai_prompts** for failing renders — see Testing & Iteration section. Diagnose at the layer where the failure originates: medium-style / scenes pool / path-builder directive / cast block / polish step.

### Step 2: Wire the 3 Engine Layers (if not already)

```javascript
// In bot/index.js — see Architecture > 3 Engine Layer Enhancements for full schema
chaos: { enabled: true, ... },
twoPassPolish: { enabled: true, ... },
sensoryAnchors: { enabled: true, requiredChannels: ['lightcolor'], ... },
```

This is one-time wiring per bot. Without these, every render lacks controlled variation, polish discipline, and per-render sensory anchoring.

### Step 3: Architect the Modern Stack (per failing path)

For each path that needs upgrade, build:

1. **Slot-pool DNA** — `<path>_<subjects>.json` (200 entries) of individual subject archetypes. Roll 2-5 per render and inject as cast block.
2. **Spatial-anchor composition lock** — non-negotiable left/center/right framing for multi-character paths.
3. **Camera-angle pool** (shared, copied to bot's seeds) — 100-200 cinematic angles + lens cues, rolled per render.
4. **Path-specific lighting pool** — `<path>_lighting.json` (100 entries) combining environment + light + atmosphere into one richer entry. Replaces shared LIGHTING+ATMOSPHERES rolls.
5. **30/70 solo-ensemble split** (for creature/character paths only) — gate cast roll by `Math.random() < 0.3`.
6. **Cast block AFTER scene** — never before. Frame as "the action above is performed BY these archetypes".

### Step 4: Fix the Medium-Style Prefix

Strip composition / framing / lens directives from `bot.mediumStyles[medium]`. Keep ANATOMY / TEXTURE / MATERIAL only. See Composition Architecture > Layer 2 for examples.

### Step 5: Generate Pools (Sonnet-seeded)

```bash
# Test at 25 first
node scripts/gen-seeds/<bot>/gen-<pool>.js   # set total: 25 initially

# Approval-gated scale to 200
# Update gen-script: total: 200, batch: 50
node scripts/gen-seeds/<bot>/gen-<pool>.js
```

Run gen-scripts in parallel where possible:

```bash
for f in scripts/gen-seeds/<bot>/gen-*.js; do node "$f" & done; wait
```

Verify all pools at 200 entries before iterating further.

### Step 6: Fire-Grade-Iterate

```bash
node scripts/iter-bot.js --bot <name> --count 5 --mode <path> --post --label <path>-r1
# Kevin grades on phone
# "good, next" → next path
# "X is wrong" → diagnose ONE layer, fix ONE thing, fire R2
```

Use the iteration workflow in Testing & Iteration section. ONE change per round. Multi-variating makes signal impossible to read.

### Step 7: Weight Paths and Lock In

```bash
# Run 10 random weighted renders to check distribution feels right
node scripts/iter-bot.js --bot <name> --count 10 --post
```

Adjust `pathWeights` until the distribution matches desired frequency. Higher-quality paths get weight 2-3, niche paths stay at 1.

Commit, push. (Per `feedback_commit_on_approval.md` — commit IMMEDIATELY when Kevin signs off, before doing anything else.)

### When to skip steps

- **Only Step 6 needed** when a working bot has one weak path and the architecture is otherwise sound. Pull ai_prompts, diagnose, fire targeted batches.
- **Skip Step 2** if the bot already has the 3 engine layers (StarBot / ToyBot / CuddleBot all do).
- **Skip Step 3** for "base" architecture paths where slot-pool isn't worth the build (lego-epic / claymation / vinyl).

---

## Writing Effective Briefs

### The Brief Structure

Every path brief follows this pattern:

```
1. Role statement — "You are a [role] writing a [scene type] for [Bot]"
2. CRITICAL identity-matching — "READ [the X below] and render THAT specific [thing]"
3. Anti-default warnings — "Do NOT default to: [list common AI failures]"
4. Pool-injected axes — ${sharedDNA.X}, ${picker.pickWithRecency(...)}, etc.
5. Composition rules — camera angle, framing, grounding
6. Mood context — ${vibeDirective.slice(0, 250)}
7. Amplification block — BLOW_IT_UP or equivalent
8. Bans — explicit imagery to never include
9. Solo composition — "ONLY figure in the frame"
10. Output format — "60-90 word scene description, comma-separated phrases, NO preamble..."
```

### Rules for Brief Writing

1. **Never plant example verbs/actions** — "lighting a cigarette, sipping a drink" made every 3rd render a cigarette scene. Describe CATEGORIES ("dynamic freeze-frame moment"), not specific instances.
2. **Don't name pop-culture characters** — "Ex Machina's Ava" doesn't land. Use plain visual descriptors.
3. **Max 1 REQUIRED/CRITICAL block** — 3+ mandatory sections dilute Sonnet. Pick the ONE thing that matters most.
4. **Positive framing beats negative** — "smooth sculptural surface" works better than "NO nipples NO nipples NO."
5. **Keep briefs under ~2000 chars** — longer briefs dilute the user's subject and hamper Sonnet creativity.
6. **Constrain at scene level, not prompt level** — seed the SCENE (via pools), let Sonnet write the PROMPT.

---

## Writing Effective Pool Gen Scripts

### The Meta-Prompt Structure

Every gen script's `metaPrompt` follows this pattern:

```
1. Role — "You are writing ${n} [AXIS] descriptions for [Bot]'s [path] path"
2. Entry format — "Each entry: [N-M] words. [What the entry describes]."
3. WHAT MAKES A GOOD ENTRY — specificity, distinctness, renderability
4. CATEGORIES TO COVER — spread entries across these families
5. DEDUP DIMENSIONS — "Deduplicate by: [what makes two entries too similar]"
6. OUTPUT — "JSON array of ${n} strings. No preamble, no numbering."
```

### Dedup Dimensions by Pool Type

| Pool type | Dedup dimensions | Example |
|---|---|---|
| Scene/landscape | setting type + time of day + dominant feature | "volcanic wasteland" ≠ "crystal desert" |
| Character | appearance + role + mood | multi-dimensional, not single-word |
| Action | primary verb + body engagement (upper/lower/full/hands) | "reaching" ≠ "running" |
| Color/material | base hue + warmth/coolness + intensity | "electric cyan" ≠ "deep midnight blue" |
| Camera/framing | angle + distance + composition emphasis | "low-angle hero shot" ≠ "aerial sweep" |

### Entry Detail Level

- **Scene/landscape pools:** 15-30 words. Enough detail that two entries render visibly different. Too short = Sonnet fills in generic details. Too long = entries fight with the brief.
- **Action pools:** 10-18 words. One specific action caught mid-motion.
- **Color/material pools:** 2-6 words. A specific, evocative description.
- **Character pools:** 20-40 words. Distinctive identity with visual anchors.

### Pool Testing Workflow

1. Generate at 25 entries first: `total: 25, batch: 25`
2. Run 5 renders using that pool, review quality
3. If quality is good, scale to 200: `total: 200, batch: 50`
4. If quality is bad, fix the meta-prompt first, then re-gen

**NEVER hand-write pool entries.** Always use gen scripts that call Sonnet. The one exception is sensitive axes (skin tones, body types) where Sonnet introduces unintended language — for those, hand-write entries matching the existing voice/tone.

---

## Lessons Learned

### From StarBot Cyborg-Woman Session (2026-04-25)

1. **Composition bans go in the BRIEF, not in pool gen scripts.** "Walking towards camera" is a Sonnet composition choice — ban it in the brief text, don't rewrite the action pool categories. The pool provides WHAT she's doing; the brief controls HOW Sonnet composes the shot.

2. **Hand-curate sensitive pools.** Sonnet-generated skin tone entries included suggestive texture language ("glossy wet-look finish", "smooth without pores") that made renders look naked. The fix was reverting to the original inline pool and hand-writing new entries matching the same concise voice: `"deep ebony brown skin with rich mahogany undertones, warm and matte"`.

3. **Closeup shots are reliably great; full-body shots need explicit grounding rules.** "FEET ON THE GROUND" as an absolute rule in the action pool gen script + "NOT standing still, NOT posing, NOT facing camera, NOT walking towards camera" in the brief = consistently good full-body shots.

4. **Ban AI-default imagery explicitly.** Floating skulls, skeletons, hovering symbolic objects — these are cheap AI clichés that ruin the render. Add explicit bans: "NO skulls, NO skeletons, NO floating objects in the sky."

5. **70/30 closeup/full-body split** — when closeups are 11/10 quality, lean into them. `Math.random() < 0.7` for 70% closeup, 30% full-body action.

### From DragonBot + Prior Bot Sessions

6. **Never plant example verbs in briefs.** Specifics like "cigarette, galaxies, etc." get repeated across ~30% of renders. Describe categories, not specific instances.

7. **Solo compositions for character bots.** Two-figure shots read as cheesy stock-art. "Pinning a man/kneeling beside a body" makes the render worse. Every character bot renders SOLO — one figure only.

8. **Ban passive poses in action pools.** No sitting, lying, watching, reading, meditating. Dynamic freeze-frames only. "She is caught MID-MOTION" language in the brief enforces this.

9. **Pool content is useless if the brief hardcodes composition that overrides it.** Always update pools AND briefs together when iterating.

10. **Constrain Sonnet at scene level.** Too-open Sonnet breeds redundancy. Seed the scene (via pools), let Sonnet write the prompt — never let Sonnet invent scenes from nothing.

11. **"Blow it up" blocks for scenery bots.** Every scenery-centric bot gets a BLOW_IT_UP block: "Theme is canvas, not ceiling. Stack: [every element within this theme's vocabulary] × 10."

12. **Artist names in medium config dominate Flux output.** "Bonestell" = Mars every single time. Keep medium config generic. Brief and pool entries can reference artists; the promptPrefix/mediumStyle should describe the LOOK, not the artist.

13. **Default test batch size: 5.** 20 is overkill for gut-check. 5 gives signal without burning time/money/patience.

### Engine-Level Safeguards

14. **NSFW false-positive auto-retry.** Flux's safety model occasionally flags clean prompts. Engine retries same prompt up to 2x (stochastic diffusion usually passes).

15. **Banned-phrase retry.** Some bots have `bannedPhrases` — engine catches + retries Sonnet up to 2x before failing loud.

16. **Fail loud on prod cron.** If all retries + fallbacks exhaust, engine throws. `bot_run_log` captures error + stage. GitHub Actions fails, sends email. Never auto-post a broken render.

17. **Sonnet → Haiku fallback.** callClaude retries on 429/500/502/503/504/529 with exponential backoff (1s/3s/10s/30s), then falls back to Haiku. If both exhaust, the render throws.

### From ToyBot 18-Path Build Session (2026-05-02, toybot-scene-paths branch)

18. **Bloated gen-script prompts dilute Sonnet output.** Initial gen-scripts for hotwheels / mech / plush / toybox-chaos / dollhouse-life were 8000-10000 chars each (40+ category examples + redundant rule blocks). Sonnet output was solo-vanity-shot biased despite "70%+ ensemble" instructions because the bloated prompt diluted the signal. Fix: trim gen-scripts to 3000-5000 chars (cut category examples from 40+ → 12 archetypal). Match the existing well-working gen-scripts (e.g., gen-tabletop-scenes.js at ~4500 chars) — that's the size standard.

19. **MediumStyle composition language overrides camera roll.** ToyBot mech-toy-rampage rendered every mech as "single low-angle hero" despite rolling varied camera_angles per render. The cause: `mediumStyles.mech_toys` had "mecha-anime-toy-line dramatic low-angle hero composition" hardcoded — Flux read this 600-char prefix BEFORE the polished output and forced hero-shot framing every time. Fix: strip composition / lens / framing language from mediumStyles. Keep anatomy / texture / material only. Let camera_angles pool drive composition.

20. **Cast block AFTER scene, not before.** Initial impl injected the cast list BEFORE the scene block. Result: Sonnet read it as a static lineup directive ("here are 3 mechs to render"). Fix: scene block first, cast block AFTER reframed as "the action above is performed BY these specific archetypes". Subjects became active participants instead of posing for a portrait.

21. **Smaller cast counts beat larger.** Mech cast 3-5 → 2-3 reduced static-lineup feel and cut feature-fusion (Flux merging multiple subjects into one "hero with all 3 sets of features"). Plush cast 4-6 → 3-5 same fix. Larger casts → static lineup. Smaller casts → action front-and-center.

22. **Diffusion models respond to spatial language, not narrative count.** Telling Flux "render 3 distinct mechs" doesn't work. Telling it "WIDE DIORAMA FRAME — 3 distinct mechs spatially separated as left, center, right, each in own silhouette zone" works. Spatial anchors > narrative anchors. (Diagnosed via ChatGPT consultation 2026-05-02 — see Composition Architecture section.)

23. **Single-color authority for some paths.** ToyBot space-saga-figures had RED/PURPLE muddy renders because 4 color sources stacked: path-specific lighting + scenePalette + colorPalette + sensory lightcolor. Fix: skip sharedDNA.scenePalette + sharedDNA.colorPalette injection in space-saga path-builder; let `space_saga_lighting` pool drive color alone. Use this fix when a path has a strong distinctive lighting pool — drops the multi-color compounding.

24. **Action paths need CHAOS LEVEL 11 multi-event scenes.** Space-saga R3 felt flat because each scene-pool entry described ONE action ("soldiers mid-charge"). Fix: gen-script meta-prompt enforces "MINIMUM 3 simultaneous things happening per entry — 3+ characters mid-action + vehicle mid-action + visible pyrotechnics + environmental destruction". Static tableau ("haggling", "discussing", "setting-up") explicitly BANNED. See Composition Architecture > CHAOS LEVEL 11.

25. **Camera-angle pool exhausts at 60 entries under heavy iteration.** ToyBot's 60-entry camera_angles ran the picker into "5-day window exhausted, falling back to full pool" within a session. Fix: generate camera_angles at 150-200 entries minimum.

26. **Wide-lens-macro doesn't pull Flux back; it stays close regardless.** Tested forcing wide-angle (14-24mm wide-lens macro) on green-army-warzone — Flux still rendered close-up framing. Wide-angle directive added some variety but didn't substantially change shot scale. Conclusion: Flux's training-bias for "toy-photography" is close-up regardless of lens directive. Pulled-back establishing shots are NOT reliably achievable through prompt language alone.

27. **Star Wars IP renders cleanly through Flux.** ToyBot space-saga path tested both archetype-only (no IP names) and full-Star-Wars-IP (Luke / Leia / Vader / X-wing / Tatooine / etc.) versions. Flux rendered both without refusal. Star Wars characters/locations are actually rendered MORE accurately when explicitly named because Flux has strong training data on those. The archetype-only approach produced more generic results. (For toybot specifically; YMMV per franchise.)

28. **NO LOCATION LEAKS in directives.** Path-builder composition-locks must NEVER name specific locations / scenes / franchise-specific settings. Setting variety comes EXCLUSIVELY from rolled scene-pool entries. Examples in gen-script meta-prompts are fine (they produce varied pool); examples in runtime path-builders compound across every render and kill variety. See "The NO LOCATION LEAKS Rule" section + memory file `feedback_no_location_leaks.md`.

29. **Pull actual Flux ai_prompts from DB when feedback isn't obvious.** When console output and code edits look correct but renders are still bad, query `uploads.ai_prompt` directly for the last N renders. This catches: medium-style frontloaded directives that override path-builder, color-stack muddy compounding, polished-output truncation, cast-list flattening into compound prose. The "everything looks single-mech" diagnosis was solved by reading ai_prompts and finding "low-angle hero composition" hardcoded in `mediumStyles.mech_toys`.

30. **One change per round.** Never multi-variate during iteration. If R2 fails, the next round changes ONE layer. The next round's grade tells you whether THAT change moved the needle. Multi-variate iterations make signal impossible to read.

---

## Production Cron

### Single DB-Driven Dispatcher

All 17 image bots are scheduled by `.github/workflows/bots-dispatcher.yml`:

```yaml
on:
  schedule:
    - cron: '*/15 * * * *'   # every 15 min, UTC
  workflow_dispatch:
    inputs:
      dry_run:
        description: 'List due bots without running them'
        type: choice
        options: ['false', 'true']

concurrency:
  group: bots-dispatcher
  cancel-in-progress: false  # queue overlapping ticks instead of dropping

jobs:
  dispatch:
    runs-on: ubuntu-latest
    timeout-minutes: 60        # worst case: 17 bots × ~3min sequential
    # ... checkout + Node 22 + npm ci ...
    - run: node scripts/dispatch-bots.js
```

The dispatcher (`scripts/dispatch-bots.js`) does:

1. `SELECT bot_name FROM bot_schedules WHERE active AND next_due_at <= now() ORDER BY next_due_at`
2. For each due bot: spawns `node scripts/run-bot.js --bot <name>` (own process for failure isolation)
3. On success: `UPDATE bot_schedules SET last_posted_at = now()` — DB trigger advances `next_due_at` to next slot
4. On failure: logs + skips → bot retries next tick (no `last_posted_at` change)
5. Failsafe: a bot that was created >6h ago with `last_posted_at IS NULL` is auto-deactivated (`active = false`, note added)

### Scheduling Knob — `bot_schedules` table

Change any bot's cadence via SQL — server-side, no code commit:

```sql
-- Bump YumBot to 4×/day
UPDATE bot_schedules SET posts_per_day = 4 WHERE bot_name = 'yumbot';

-- Pause MechBot
UPDATE bot_schedules SET active = false WHERE bot_name = 'mechbot';

-- Audit fleet cadence
SELECT bot_name, posts_per_day, active, next_due_at FROM bot_schedules ORDER BY next_due_at;

-- Reactivate a bot the failsafe auto-deactivated
UPDATE bot_schedules SET active = true, notes = NULL WHERE bot_name = 'x';
```

How slots work: each bot's `phase_seed` (0..1439, deterministic from md5(bot_name)) anchors its `posts_per_day` slots evenly across 24h UTC. Slot algorithm lives in `compute_bot_next_due()` (migration `177_bot_schedules.sql`). Two BEFORE-UPDATE triggers keep `next_due_at` in sync: one on `last_posted_at` change (post happened), one on `posts_per_day` / `active` / `phase_seed` change (config edit). Collisions are tolerated — if two bots' slots land within the same 15-min dispatcher tick, the dispatcher runs them sequentially.

### Workflow secrets

`SUPABASE_SERVICE_ROLE_KEY`, `REPLICATE_API_TOKEN`, `ANTHROPIC_API_KEY` — same as the per-bot workflows that this dispatcher replaced (removed in the cutover commit).

### Manual single-bot trigger

The dispatcher has no per-bot override input — to render one specific bot ad-hoc, run `node scripts/run-bot.js --bot <name>` locally. `run-bot.js` still accepts `--path` and `--vibe` overrides for manual testing.

---

## Bot Authentication & Credential Rotation

Bots are real Supabase Auth users (`bot-{username}@dreambot.app`). How they authenticate depends on which engine generates their dreams:

### Two Auth Patterns

| Pattern | Used by | How it auths |
|---|---|---|
| **Service role** (no password) | All V2 engine bots — `run-bot.js` invokes `lib/botEngine.js`, which uses `SUPABASE_SERVICE_ROLE_KEY` directly. No `signInWithPassword`. | Server-side admin key bypasses RLS to insert uploads. |
| **Password sign-in** | Legacy only — historically `scripts/generate-bot-dreams.js` called `auth.signInWithPassword()`. HumanBot and GlowBot now use service role directly. | Reads `BOT_PASSWORD_PREFIX` env var; password is `${BOT_PASSWORD_PREFIX}${botname}`. |

The `BOT_PASSWORD_PREFIX` system exists only for the legacy password-sign-in path. All active bots now use service role — the prefix can be retired but is kept for potential password-based auth needs.

### Where the Prefix Lives

| Location | Purpose |
|---|---|
| `.env.local` → `BOT_PASSWORD_PREFIX=...` | Local dev — read by `dotenv` in scripts |
| GitHub Actions secret `BOT_PASSWORD_PREFIX` | CI — passed to `bot-dreams.yml` workflow env block |
| Supabase Auth (per-user `encrypted_password`) | The actual stored password for each bot user is `${BOT_PASSWORD_PREFIX}${botname}` |

All three must stay in sync. If `.env.local` ≠ GitHub secret, local works but CI fails ("Invalid login credentials"). If either ≠ Supabase Auth, sign-in fails everywhere.

### Why a Prefix System (Not Per-Bot Passwords)

One value rotates ~25 bot passwords. Without a prefix, each bot would need its own unique password stored in `.env.local` + GitHub Actions, and each rotation = 25 manual updates. With a prefix, rotating means: pick a new 16-char random string, run one script, update one env var, update one GitHub secret.

### Rotation Procedure

When the prefix leaks (e.g., GitGuardian fires) or as routine hygiene:

1. **Pick a new prefix** — random 16+ chars, no quote-breaking specials. Example:
   ```bash
   node -e "console.log(require('crypto').randomBytes(12).toString('base64').replace(/[+/=]/g,'').slice(0,16) + '!!')"
   ```

2. **Update `.env.local`** with the new value (don't change the old one yet; the rotation script needs to verify against the old):
   ```
   BOT_PASSWORD_PREFIX=<NEW_VALUE>
   # OLD_BOT_PASSWORD_PREFIX defaults to the historical leaked prefix if
   # unset (see scripts/rotate-bot-passwords.js). Set this only if you've
   # previously rotated to a different non-default prefix.
   OLD_BOT_PASSWORD_PREFIX=<previous prefix, if not the default>
   ```

3. **Dry-run** to see which bots will rotate cleanly vs which are already on a non-standard password:
   ```bash
   node scripts/rotate-bot-passwords.js --dry-run
   ```
   Bots that fail the old-password sign-in are flagged "skipped" — usually means they were created/rotated outside the standard flow.

4. **Rotate live.** With `--force`, the script skips the pre/post sign-in verifications (admin API is authoritative) AND avoids Supabase Auth's aggressive rate limiter. Without `--force`, you'll skip mismatched bots — usually fine, but `--force` is what you want when you're trying to bring everyone in line.
   ```bash
   node scripts/rotate-bot-passwords.js --force
   ```
   Paces ~1.5s between bots to stay under rate limits. ~35s for ~25 bots.

5. **Update GitHub Actions secret** at https://github.com/konakevin/dreambot/settings/secrets/actions — find `BOT_PASSWORD_PREFIX` → "Update" → paste exact `.env.local` value (no quotes, no whitespace).

6. **Verify end-to-end via CI** — manually dispatch the bot-dreams workflow:
   ```bash
   gh workflow run bot-dreams.yml -R konakevin/dreambot -f bot=musebot -f count=1
   gh run watch <run-id> -R konakevin/dreambot
   ```
   If you see "Cannot sign in as musebot: Invalid login credentials" the GitHub secret value doesn't match `.env.local`.

7. **Mark the GitGuardian incident resolved** as "Revoked" if applicable.

### Deleting a Bot

`scripts/delete-bot.js` hard-deletes a bot account and ALL associated content in FK-safe order: likes/favorites/comments/shares on uploads → uploads → bot_seeds (matching `{name}_%`) → follows → friendships → notifications (both sides) → user_recipes → public.users → auth.users. Handles auth-only orphans (auth user exists but public.users row doesn't).

```bash
node scripts/delete-bot.js --bots nyx,glowbot --dry-run    # preview row counts
node scripts/delete-bot.js --bots nyx,glowbot              # actually delete
```

### Pre-Commit Secret Scanner

`scripts/check-secrets.sh` runs as part of the husky pre-commit hook and blocks commits that introduce common secret patterns: hardcoded password literals, the historical bot-password pattern, AWS access keys, Slack webhooks, PEM private keys, `api_key=`/`secret_key=` assignments with quoted long-string values.

Allowlist exceptions: `scripts/check-secrets.sh` (the scanner has to contain the patterns it scans for) and `scripts/rotate-bot-passwords.js` (must reference the historical leaked prefix as a fallback for non-force runs).

If a legitimate change trips the scanner, bypass with `git commit --no-verify`. Don't abuse it — every bypass is a chance for a real leak to land.

### Facebook OAuth Credentials

Separate from bot auth, Facebook OAuth uses two values that ship in client builds:

| Field | Storage |
|---|---|
| `FACEBOOK_APP_ID` | `.env.local` + EAS secret. Read by `app.config.js` at config-time. |
| `FACEBOOK_CLIENT_TOKEN` | `.env.local` + EAS secret. Read by `app.config.js` at config-time. |
| Facebook App Secret | Supabase Dashboard → Auth → Providers → Facebook (server-side only, never in git) |

Both client values are passed to the `react-native-fbsdk-next` plugin in `app.config.js`. They never enter git — `app.json` was migrated to dynamic `app.config.js` specifically for this. Rotation: Meta Developer Dashboard → App Settings → Advanced → Reset Client Token, then update `.env.local` AND run `eas env:create --name FACEBOOK_CLIENT_TOKEN --value <new> --force`. Rebuild via `npx expo prebuild --clean`.

---

## Multi-Agent Worktree Workflow

```
━━━ HARD RULE — multi-agent work MUST split worktrees ━━━
What worked: each Claude session in its own git worktree on its own branch.
  Multiple agents in the same project directory share ONE working tree, and
  any agent's `git checkout other-branch` flips files for ALL agents silently.
  Tonight's ToyBot work was lost twice to this collision before recovering
  via stashes the parallel agent had made.
Reference: CLAUDE.md "Concurrent agents — git worktrees" section
Memory file: stash_before_revert.md (related)
Branch: docs/multi-agent-worktree exists in repo as planning doc
```

Bots are typical multi-agent territory — Kevin often runs concurrent sessions to build / iterate / test different bots in parallel.

### Setup (per agent)

```bash
# From the main repo dir
git worktree add ../dreambot-<task> <branch-name>

# Optional: branch off main if creating a fresh task branch
git worktree add ../dreambot-<task> -b <new-branch-name> main
```

Each worktree has its own checked-out branch, its own working files, and its own state for `npm` / `node` / `supabase` commands. They share the underlying `.git/objects`, so it's cheap.

### Per-worktree quick-setup

```bash
cd ../dreambot-<task>

# Symlink node_modules from main repo (saves npm install time)
ln -s /Users/kevinmchenry/Development/apps/dreambot/node_modules node_modules

# Symlink .env.local (gitignored, won't propagate via git)
ln -s /Users/kevinmchenry/Development/apps/dreambot/.env.local .env.local
```

Both symlinks are safe because:
- `node_modules` is identical across all worktrees (same package.json)
- `.env.local` is read at runtime only (no concurrent-write conflicts)

### Cleanup (when branch merges)

```bash
git worktree remove ../dreambot-<task>
git push origin --delete <branch-name>   # if pushed
git branch -d <branch-name>              # if not pushed
```

### When to use worktrees

- ANY time 2+ Claude sessions are open on the same project
- ANY time you want to keep WIP from one task isolated from another
- ANY long-running iteration loop (e.g., bot "Bring It Alive" sessions) where you don't want to risk a parallel agent's checkout sweeping away your in-progress files

### What goes wrong without worktrees

```
Agent A: git checkout my-feature-branch     # files now reflect my-feature
Agent B: git checkout other-branch          # files now reflect other-branch
                                             # ← Agent A's session sees other-branch files now,
                                             # any uncommitted Agent A work is invisible/lost
                                             # until A re-checks out my-feature
```

Tonight (2026-05-02) lost ~30 minutes to this exact collision. The parallel agent stashed Agent A's work before checking out — but stashes drop the rename-history (only modifications survive). 5 path file renames + new path files + gen scripts + seed JSONs had to be partially reconstructed from stashes (recovered ~70%) and partially rebuilt from this conversation's context.

### Recovery if it happens

```bash
git stash list                # check for any "WIP: <task>" stashes
git reflog                    # find the SHA of HEAD just before the chaos
git stash show stash@{N} --name-status   # see what's in a stash
git stash apply stash@{N}     # restore a stash to current branch
```

Stashes preserve modifications + new files (with `-u`) but DROP rename-history. Renames must be re-applied via `git mv`.

---

## Creating a New Bot From Scratch

```
━━━ MODERN flow — start with the architecture, not the briefs ━━━
What worked: building the 3 engine layers + slot-pool DNA + camera + path-
  specific lighting + spatial anchor IN THAT ORDER before writing path briefs.
  Briefs are easy to iterate; architecture is hard to retrofit.
Reference: CuddleBot plushie-life + dollhouse-life port (toybot-scene-paths
  branch, 2026-05-02) — used this exact flow to bring 2 new paths online.
```

### Step 1: Create the Module + Wire 3 Engine Layers

```bash
mkdir -p scripts/bots/<name>/paths scripts/bots/<name>/seeds
mkdir -p scripts/gen-seeds/<name>
```

Create with the full modern contract:
- `index.js` — bot contract WITH chaos / twoPassPolish / sensoryAnchors fields populated
- `pools.js` — axis pools with `load()` helper (will fill as pools generate)
- `shared-blocks.js` — universal prose blocks (TOY_PHOTOGRAPHY_BLOCK / CINEMATIC_STORY_BLOCK / BLOW_IT_UP_BLOCK / WIDE_LENS_MACRO_BLOCK / etc.)

Verify idempotence: `grep -rn "<otherbot>" scripts/bots/<thisbot>/` returns 0. No cross-bot imports.

### Step 2: Define Paths

Each path is a distinct visual approach. Guidelines:
- 3-8 paths per bot (too few = repetitive, too many = diluted)
- Each path should produce visibly different renders
- Character bots: split by composition (closeup vs full-body) and/or action type
- Scene bots: split by environment type (landscape vs interior vs city vs cosmic)

For each path, decide which architecture stack to use:
- **Modern stack** (slot-pool + spatial anchor + camera + path-lighting) — for paths with a clear subject type and atmosphere DNA
- **Base** — for paths where slot-pool isn't worth the build

### Step 3: Generate Pools (Sonnet-seeded)

For each modern-stack path, generate the 4 essential pools:
- `<path>_scenes.json` (200 entries, batch 50) — mid-action scenarios
- `<path>_landscapes.json` (200) — wide vistas
- `<path>_<subjects>.json` (200) — slot-pool of individual subject archetypes
- `<path>_lighting.json` (100) — environment + light + atmosphere combined

Plus one shared pool per bot:
- `camera_angles.json` (150-200, copied from another bot or generated fresh)

Run gen-scripts at `total: 25` initially, verify quality, then scale to `total: 200`.

### Step 4: Write Path Briefs

One brief-builder per path in `paths/<name>.js`. Follow the brief structure in "Writing Effective Briefs" + the slot-pool injection pattern in "The Slot-Pool DNA Pattern" + the composition-lock pattern in "Composition Architecture".

Path-builder directive should be 100% architectural — NEVER leak specific locations / scenes / franchise-specific settings. See "The NO LOCATION LEAKS Rule".

### Step 5: Test (Fire-Grade-Iterate)

```bash
# Test each path individually with --label tagging
node scripts/iter-bot.js --bot <name> --count 5 --mode <path> --post --label <path>-r1

# Pull actual ai_prompts when feedback isn't obvious
node -e "
const {createClient} = require('@supabase/supabase-js');
const sb = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
sb.from('uploads').select('caption, ai_prompt')
  .ilike('caption', '%<path>%')
  .order('created_at', {ascending: false})
  .limit(5).then(({data}) => data.forEach(r => console.log(r.ai_prompt)));
"

# Test random distribution at end
node scripts/iter-bot.js --bot <name> --count 10 --post
```

Iterate per "The Iteration Workflow with Kevin" section.

### Step 6: Register in `bot_schedules` + Deploy

1. `INSERT INTO bot_schedules (bot_name, posts_per_day, active, phase_seed) VALUES ('<name>', 2, true, <hash_mod_1440>);` — pick `phase_seed` deterministically from md5(bot_name) so the bot returns to the same time-of-day after temp deactivation
2. Commit the bot module files (per `feedback_commit_on_approval.md` — commit IMMEDIATELY when Kevin approves)
3. Push to main — the dispatcher will pick the new bot up on its next tick (≤15 min). Dispatcher's 6h failsafe will auto-deactivate it if the first render fails repeatedly

### Step 7: Verify in App

Search for the bot in the app, check their profile shows posts. Review renders on phone.

---

## Bot Roster

### Active Image Bots (V2 Engine)

All 17 image bots below are scheduled by the DB-driven dispatcher (see [Production Cron](#production-cron)).

| Bot | Directory | Content | Paths | Architecture status |
|---|---|---|---|---|
| StarBot | `starbot/` | Sci-fi / space / cyborg | 14 | ✅ slot-pool DNA + 3 layers (cyborg-man / cyborg-woman / explorers) — **canonical reference impl** |
| ToyBot | `toybot/` | Toys / crafts / miniatures | 19 | ✅ 6 paths (mech / plush / hotwheels / train / dollhouse / space-saga) full slot-pool + spatial anchor + path-specific lighting + camera + 3 layers (toybot-scene-paths branch as of 2026-05-02) |
| ChibiBot | `chibibot/` | Hyper-cute chibi critters in cottage villages, magical hamlets, and snug interiors | 24 | ✅ Renamed from CozyBot 2026-05-07 (CuddleBot was merged in 2026-05-06). 70/30 medium rotation: `chibibot_render` (designer-vinyl / Pop Mart 3D CGI) and `chibibot_pixar` (modern Pixar/DreamWorks 3D animation). Plushie-life + dollhouse-life moved to ToyBot 2026-05-07. Creature pools (jungle/arctic/aquatic) + village pools rebalanced to 50/50 baby/adult. 3 indoor paths (rainy-interior / fireplace-cabin / bookish-sanctuary) weighted 2× |
| OceanBot | `oceanbot/` | Ocean / underwater / mermaid | 15 | ✅ `cycleAllPaths: true` — all 15 paths cycle before repeating; split lighting pools (underwater / surface / mermaid-specific) |
| DragonBot | `dragonbot/` | Epic fantasy / dragons | 8+ | ✅ scene-girls Pre-Raphaelite oil painting reference impl |
| GothBot | `gothbot/` | Gothic dark / vampires | 6+ | ✅ closeup+full-body split + bannedPhrases reference impl |
| MangaBot | `mangabot/` | Anime / Japanese | 4+ | base |
| BloomBot | `bloombot/` | Flowers / botanical | 4+ | base |
| EarthBot | `earthbot/` | Nature / landscape | 4+ | base |
| TinyBot | `tinybot/` | Miniatures / dioramas | 4+ | base |
| SteamBot | `steambot/` | Steampunk | 4+ | base |
| PixelBot | `pixelbot/` | Retro pixel art | 4+ | base |
| RetroBot | `retrobot/` | Retro / vaporwave | 4+ | base |
| DinoBot | `dinobot/` | Dinosaurs / prehistoric | 4+ | base |
| BeachBot | `beachbot/` | Beach / coastal | 4+ | base |
| BrickBot | `brickbot/` | LEGO / brick art | 4+ | base |

**Architecture status legend:**
- **base** — uses path-builder + shared LIGHTING/ATMOSPHERES + may have 3 engine layers if migrated post-`80e22ab`
- **✅ + features listed** — has the modern architecture stack (slot-pool DNA / spatial anchor / camera-pool / path-specific lighting / 3 layers / etc.)
- The "base" bots are candidates for the modern-architecture upgrade pattern — see `Creating a New Bot From Scratch` and `The "Bring It Alive" Process`.

### Content Bots (Custom Scripts)

| Bot | Voice | Medium/Vibe | Script |
|---|---|---|---|
| HumanBot | Deadpan AI observations about humans | watercolor + enchanted | `generate-humanbot.js` |
| GlowBot | Profound original thoughts | aura + ethereal | `generate-glowbot.js` |

Content bots use standalone scripts (NOT the V2 engine). See [Content Bots (HumanBot & GlowBot)](#content-bots-humanbot--glowbot) for full architecture.

### Reference Implementations

#### Modern architecture stack (slot-pool + spatial anchor + camera + path-specific lighting + 3 layers)

- **ToyBot mech-toy-rampage** (`scripts/bots/toybot/paths/mech-toy-rampage.js`, toybot-scene-paths branch) — most complete modern reference impl. Slot-pool DNA (mech_archetypes, 200 entries), spatial-anchor composition lock (left/center/right), camera_angles roll, path-specific mech_lighting (100 entries — neon megacity / volcano / orbital), composition-stripped medium-style, cast block AFTER scene with "performing this scene" framing. ALL learnings from the 2026-05-02 ToyBot session encoded here.

- **ToyBot plush-world** (`scripts/bots/toybot/paths/plush-world.js`, toybot-scene-paths branch) — reference for 30/70 solo-ensemble split. Solo branch suppresses spatial anchor and uses intimate-storybook composition. Ensemble branch uses standard slot-pool + spatial anchor.

- **CuddleBot plushie-life** (`scripts/bots/cuddlebot/paths/plushie-life.js`, toybot-scene-paths branch) — reference for porting the modern stack to a different bot's brand. Reuses CuddleBot's existing CUTE_CREATURES + PLUSHIE_SCENES pools, generates new cute-nudged lighting + landscape pools, copies camera_angles in for idempotence.

- **ToyBot space-saga-figures** (`scripts/bots/toybot/paths/space-saga-figures.js`, toybot-scene-paths branch) — reference for CHAOS LEVEL 11 multi-event scenes + single-color-source path-builders (skip scenePalette + colorPalette injection when path-specific lighting alone is enough).

#### Legacy reference impls

- **StarBot** (`scripts/bots/starbot/`) — 14 paths. Canonical impl of cyborg-man / cyborg-woman closeup-vs-full-body split, path-conditional rollSharedDNA, per-medium promptPrefix/Suffix overrides, per-medium mediumStyles, per-path modelByPath. Originator of the slot-pool DNA pattern (commit 7c09211). Originator of the 3 engine layers (commit 80e22ab).

- **GothBot** (`scripts/bots/gothbot/`) — reference for mediumStyles (how to make each medium visually distinct for the bot's identity), bannedPhrases, and the scene-girls pattern (Pre-Raphaelite oil painting + 4-pool architecture + custom medium + pose-first actions).

- **OceanBot** (`scripts/bots/oceanbot/`) — reference for `cycleAllPaths` shuffle-bag cycling (15 paths, all visited before any repeats), custom bot-scoped mediums (`maritime-oil-legend`, `maritime-oil-classic` for mermaid-legend path via `mediumByPath`), and split lighting pools (underwater vs. surface vs. mermaid-specific) — predecessor to the path-specific-lighting pattern.

### Notes

**Direct prompt mode** (`scripts/lib/botEngine.js`): if `buildBrief()` returns `{ direct: true, prompt: '...' }` instead of a string, the engine skips the Sonnet call entirely and uses the prompt as-is. The refusal detection (checks for "I cannot create", "I'm not able to", etc.) is a safety net for standard Sonnet paths.

---

## Content Bots (HumanBot & GlowBot)

Content bots are fundamentally different from image bots. They generate **text + image** posts where the text is the star — composited directly onto the image via Sharp SVG overlays. They bypass the V2 engine entirely and use standalone scripts with their own Sonnet calls, Flux Dev calls, and Supabase writes.

### Why They're Separate from the V2 Engine

The V2 engine pipeline (Sonnet brief → Flux render → post) mutates prompts through medium directives and prefix/suffix wrapping. Content bots need verbatim control over their Flux prompts to preserve specific aesthetics (watercolor storybook for HumanBot, bioluminescent aura for GlowBot). The Edge Function's V2 pipeline was restructuring/mutating hints — destroying the aesthetic that makes these bots work.

### Shared Architecture

Both content bots follow the same 4-step pipeline:

```
1. Call Sonnet → structured JSON (text content + image description)
2. Call Flux Dev directly → base image (bypasses Edge Function entirely)
3. Download image, composite text overlay via Sharp + SVG
4. Upload to Storage, insert uploads row with all feed-visibility flags
```

**Shared technical details:**
- **Auth:** Service role key (`SUPABASE_SERVICE_ROLE_KEY`), no bot password sign-in
- **Flux model:** `black-forest-labs/flux-dev` exclusively, called via Replicate REST API with polling
- **Image size:** 768×1344 (9:16), JPEG quality 92
- **Feed flags:** `is_public: true`, `is_approved: true`, `is_posted: true`, `posted_at: now()` — all set on insert so posts appear in feed immediately
- **Sonnet model:** `claude-sonnet-4-5-20250929` for all text generation
- **Banned-phrase system:** regex array checked after Sonnet returns; up to 3 retries on match
- **Batch dedup:** tracks recent topics/themes within a batch to prevent same-session repetition

### HumanBot

**Script:** `scripts/generate-humanbot.js`
**DB user_id:** `7df6aeb4-8e94-44b0-8f65-207638322f02`
**Medium/Vibe:** `watercolor` / `enchanted` (locked, every post)

**Voice:** Deadpan single-statement observations about humans from an AI's perspective. Starts with "Humans." 8-20 words. Not roasting, not warm — clinical and genuinely puzzled. The humor IS the observation stated so plainly it becomes profound.

**Example outputs:**
- "Humans will die on a hill they couldn't find on a map."
- "Humans invented the alarm clock and then invented the snooze button."
- "Humans created 'read receipts' and then got mad about them."

**Character:** A vintage 1950s tin wind-up toy robot crossed with a Rock 'Em Sock 'Em Robot — bright red lithographed metal body, boxy head, chrome trim, oversized boxing-glove hands. The robot fills 60% of the frame (chest-up hero shot) with nature as backdrop. The cheap-toy aesthetic against fine-art watercolor treatment is inherent comedy.

**Sonnet output format:**
```json
{ "topic": "2-4 word label", "thought": "Humans...", "image_hint": "15-30 words — backdrop + prop + lighting" }
```

**Seed pools (400 entries each):**
- `scripts/gen-seeds/humanbot/behaviors.json` — 400 peculiar human behaviors seeding topic diversity (8 categories × 50)
- `scripts/gen-seeds/humanbot/scenes.json` — 400 painterly storybook locations (nature, coasts, historic, whimsical — NO fluorescent/mundane/indoor)

**Text overlay:** Green phosphor terminal card on pitch black background, monospace font (SF Mono/Menlo/Consolas). Positioned at 60% down the image, 60% width, centered. Layout:
```
$ humanbot
> thought text wraps here
  continuation line
```

**Banned phrases:** "You are not X. You are Y." structure, therapy words (hiding, coping, performing, processing, deflecting)

**Style constants:**
- `WATERCOLOR_STYLE` — traditional watercolor painting, fluid transparent pigment, visible paper texture
- `ENCHANTED_MOOD` — fairy-tale atmosphere, sparkling particles, glowing soft light

### GlowBot

**Script:** `scripts/generate-glowbot.js`
**DB user_id:** `abe6398a-0af0-4a1f-9680-cb498c10f4c2`
**Medium/Vibe:** `aura` / `ethereal` (locked, every post)

**Voice:** Original profound thoughts — the kind you screenshot and send to a friend. 8-25 words. Does NOT start with "Humans" (that's HumanBot). Direct statements to the reader. Calm, certain, like someone who figured something out. The "3am scroller" — writing for someone scrolling alone, carrying something they haven't said out loud.

**Example outputs:**
- "The exhausting part isn't changing. It's pretending you haven't."
- "Ready is a place you arrive at by going, not a feeling you wait around for."
- "The hardest prison to escape is the version of yourself that other people still believe in."

**Five shapes that work:** reframe, uncomfortable truth, permission slip, wake-up call, quiet observation. Best ones have a TURN — start one direction, land somewhere unexpected.

**Character:** A small glowing cyborg flower growing from the ground in a vast nature landscape. Translucent crystalline petals with circuitry-vein patterns, mechanical stem, bioluminescent glow flooding outward. The flower is tiny — the landscape dwarfs it. Each render picks a random flower type (24 varieties: lotus, dahlia, orchid, protea, etc.) and a random color from a 50-color rainbow pool.

**50-color rainbow pool:** Each render picks one color that determines the flower's hue AND the color of light it casts onto surroundings (rocks, water, grass, fog). Colors span the full spectrum — deep ruby red through electric cyan through vivid purple through champagne gold. The prompt hammers the color 8+ times with words like DRENCHES, FLOODS, OVERWHELMING, BLEEDS to push Flux toward maximum glow saturation.

**Sonnet output format:**
```json
{ "type": "third_eye", "theme": "2-5 word label", "quote": "8-25 words", "flower": "10-20 words unique bloom shape/form", "image_hint": "20-35 words stunning nature scene + lighting" }
```

**Seed pool:**
- `scripts/gen-seeds/glowbot/topics.json` — 400 profound thought topic seeds (8 categories: courage/fear, love/connection, time/presence, growth/change, resilience/healing, purpose/meaning, perspective/wonder, identity/truth)

**Text overlay:** Serif typography (Cormorant Garamond, embedded as base64 @font-face) floating on a soft dark gradient fade. NO card chrome — no rectangle, no border. The text feels like part of the image, not laid on top. Gradient covers bottom 50% (transparent → 0.9 opacity). Text centered at 45% width to clear feed UI icons on the right side. Font auto-scales inversely with word count (0.044 ratio for ≤8 words down to 0.028 for 26+).

**Font files:** `scripts/fonts/CormorantGaramond-Regular.ttf` and `CormorantGaramond-Light.ttf` — loaded once at module init, base64-encoded, embedded in SVG @font-face. Falls back to Georgia if missing.

**Banned phrases:** Crystal-seller Instagram language — energy, vibrations, manifestation, chakras, abundance, "the universe is", "trust the process", alignment, "your journey", "higher self"

**Style constants:**
- `AURA_STYLE` — bioluminescent glow, subsurface scattering, extreme bloom, overexposed halos, god rays, chromatic aberration
- `ETHEREAL_MOOD` — otherworldly serenity, atmospheric haze, gauzy floating quality, entire scene bathed in flower glow

**Anthropic backoff:** GlowBot has its own `fetchAnthropicWithBackoff()` that retries on 429/529/5xx with exponential delays (2s/5s/12s/30s). HumanBot does not (throws immediately on non-2xx).

### How They Differ (Quick Reference)

| | HumanBot | GlowBot |
|---|---|---|
| **Voice** | "Humans..." deadpan observations | Direct profound statements |
| **Tone** | Clinical, puzzled, faintly judging | Calm, certain, wise |
| **Medium** | watercolor | aura (bioluminescent) |
| **Vibe** | enchanted | ethereal |
| **Character** | Red tin wind-up toy robot (hero shot) | Glowing cyborg flower (tiny in vast landscape) |
| **Overlay** | Green terminal card, monospace | Serif on gradient fade, no card |
| **Scene pool** | 400 painterly storybook locations | Scene from Sonnet (no separate pool) |
| **Topic pool** | 400 human behaviors | 400 profound thought seeds |
| **Color variety** | N/A (robot is always red) | 50-color rainbow pool per render |
| **Word limit** | 8-20 words | 8-25 words |
| **Font** | SF Mono / Menlo / monospace (system) | Cormorant Garamond (embedded TTF) |

### Running Content Bots

```bash
# HumanBot
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
node scripts/generate-humanbot.js              # one post
node scripts/generate-humanbot.js --count 5    # five posts
node scripts/generate-humanbot.js --dry-run    # Sonnet output only, no image

# GlowBot
node scripts/generate-glowbot.js               # one post
node scripts/generate-glowbot.js --count 5     # five posts
node scripts/generate-glowbot.js --dry-run     # Sonnet output only, no image
```

### Maintaining Content Bots

**Regenerating seed pools:**
```bash
node scripts/gen-seeds/humanbot/gen-behaviors.js   # 400 human behaviors
node scripts/gen-seeds/humanbot/gen-scenes.js      # 400 painterly scenes
node scripts/gen-seeds/glowbot/gen-topics.js       # 400 profound thought topics
```

**Tuning the voice:** Edit `SYSTEM_PROMPT` in the script. The examples section is the most important part — Sonnet calibrates to those examples. Add/remove examples to shift the tone.

**Tuning the visual:** Edit the style constants (`WATERCOLOR_STYLE`/`ENCHANTED_MOOD` for HumanBot, `AURA_STYLE`/`ETHEREAL_MOOD` for GlowBot) and the character description (`HUMANBOT_CHARACTER` / `buildFluxPrompt()`). These are plain strings prepended to the Flux prompt.

**Adding banned phrases:** Add regex patterns to the `BANNED_PHRASES` array. Sonnet retries up to 3x when a match is found.

**Changing the overlay:** Edit `buildTerminalSVG()` (HumanBot) or `buildQuoteSVG()` (GlowBot). Both generate SVG strings that Sharp composites onto the base image. Test changes by running `--count 1` and checking the output.

**Key rule:** These scripts are self-contained. They do NOT share code with the V2 engine, Edge Functions, or each other. Changes to one never affect the other or the image bots.

---

## Nightly User Dreams

Every night, each active user gets one personalized dream generated by the nightly cron. This system is completely separate from the bot engine — different table, different script, different pipeline.

### The Three Paths (40/30/30 split)

**Path 1 — Personal Cast + Personal Elements (40%)**
- One cast member: self (50%), +1 (25%), or pet (25%)
- At least one personal element: location, object, or both
- Face swap applied for self/+1 on face-swap mediums (not pets)

**Path 2 — Personal Elements Only (30%)**
- No cast member
- At least one personal element: location, object, or both
- Pure environment dream featuring the user's stuff

**Path 3 — Cast + Pure Random Scene (30%)**
- One cast member: self (50%), +1 (25%), or pet (25%)
- No personal elements — completely random scene

### The 8 Seed Pools

| Category | Slots | When used |
|---|---|---|
| `nightly_char` | `${character}` | Path 3 (cast in random scene) |
| `nightly_char_loc` | `${character}` + `${place}` | Path 1 (cast + location) |
| `nightly_char_obj` | `${character}` + `${thing}` | Path 1 (cast + object) |
| `nightly_char_loc_obj` | `${character}` + `${place}` + `${thing}` | Path 1 (cast + both) |
| `nightly_loc` | `${place}` | Path 2 (location only) |
| `nightly_obj` | `${thing}` | Path 2 (object only) |
| `nightly_loc_obj` | `${place}` + `${thing}` | Path 2 (both elements) |
| `nightly_pure` | none | Fallback (no personal data) |

100 deduped seeds per pool = 800 total.

### Slot Filling

- `${character}` → cast member's AI-generated text description (from photo upload)
- `${place}` → random pick from user's `dream_seeds.places`
- `${thing}` → random pick from user's `dream_seeds.things` + `dream_seeds.characters` combined

### Face Swap Rules

- **Face-swap mediums** (photography, watercolor, canvas, anime, neon, comics, shimmer, pencil, twilight, surreal): real photo pasted onto rendered character AFTER Flux generates.
- **Non-face-swap mediums** (coquette, pixels, lego, animation, claymation, vinyl, gothic, storybook, vaporwave, fairytale, handcrafted): fully stylized from text description only.
- **Pets**: always description-only, never face-swapped.

### Generating New Nightly Seeds

```bash
node scripts/generate-nightly-seeds.js --count 100        # all 8 pools × 100
node scripts/generate-nightly-seeds.js --count 1 --dry-run # test 1 per pool
node scripts/generate-nightly-seeds.js --combo character   # one specific pool
```

---

## Database Tables

### `bot_dedup` — Per-axis recency tracking

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| bot_name | text | Bot username |
| axis | text | Pool axis name (e.g., `alien_landscape`, `cyborg_glow`) |
| value | text | The stringified pool entry that was picked |
| picked_at | timestamptz | When picked (default: now, used for 5-day window) |

Picker reads last 5 days of picks to avoid repeats. Committed ONLY on successful post.

### `bot_run_log` — Render audit trail

| Column | Type | Purpose |
|---|---|---|
| bot_name | text | Bot username |
| path | text | Which path was rendered |
| vibe | text | Vibe key used |
| medium | text | Medium key used |
| model | text | Flux model used |
| status | text | 'ok' or 'failed' |
| image_url | text | Public URL of posted image |
| error | text | Error message (failures only) |
| error_stage | text | Pipeline stage where failure occurred |
| duration_ms | integer | Total render time |
| cost_cents | integer | Estimated API cost |
| prompt_preview | text | First 300 chars of final prompt |
| sonnet_retries | integer | Number of Sonnet retry attempts |
| sonnet_fell_back_to_secondary | boolean | Whether Haiku fallback was used |
| created_at | timestamptz | When the run happened |

### `nightly_seeds` — Nightly user dream seeds

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| category | text | Pool name (e.g., `nightly_char_loc`) |
| template | text | Scene template with `${character}/${place}/${thing}` slots |
| created_at | timestamptz | When inserted |

Permanent pool. Random pick every time (no usage tracking). 100 seeds per pool.

### `dream_templates` — LEGACY, DO NOT USE

Old table that used to hold both bot seeds and nightly templates. All code now reads from `bot_dedup`/`bot_run_log` (V2 bots) or `nightly_seeds` (user nightlies). Will be dropped.

### The April 2026 Deletion Incident

An unscoped delete wiped ALL rows from `dream_templates` — both bot seeds and nightly templates. Both systems broke. This is why the tables were split.

**Hard rules:**
- NEVER run unscoped deletes on any seed/dedup table
- Always scope by bot name or category prefix
- Query `SELECT category, count(*) GROUP BY category` before any delete operation

---

## Adding Sci-Fi Universe Paths to StarBot (Landscape + Architecture)

Pattern proven 2026-05-02 (Kevin). Use this whenever you want to adapt a sci-fi universe (Dune, Aliens, Star Wars, Guardians of the Galaxy, Mass Effect, Halo, Star Trek, StarCraft, etc.) into scene-only paths for StarBot.

The output is **2 new paths per universe**: `<universe>-landscape` (outdoor planet vistas) and `<universe>-architecture` (interior spaces). Both pure-scene, no characters.

### The 8-Step Recipe

**1. Identify the universe's visual signature**
   - 6-10 iconic biomes (landscape) and 6-10 iconic interiors (architecture). Each should be a recognizable visual category at a glance.
   - Identify color signatures per faction/world if multi-faction (e.g., StarCraft: rust-Terran / gold-blue-Protoss / red-Zerg).
   - Identify the universe's CONCEPT-ART tradition (Ralph McQuarrie for Star Wars, H.R. Giger for Aliens, Sparth for Halo, Sam Didier for StarCraft, etc.).

**2. Write 2 gen scripts** at `scripts/gen-seeds/starbot/gen-<universe>-landscapes.js` and `gen-<universe>-architecture.js`. Each:
   - `total: 25, batch: 12` — small focused pools.
   - Each entry is **25-50 words**, dense and paintable.
   - **CRITICAL** — every brief must have these sections:
     - **AESTHETIC DNA** paragraph naming the concept-art lineage and visual mood
     - **CATEGORY VARIETY** with explicit minimum-per-category counts (e.g., "TWIN-SUN DESERTS (~4)", "ICE-PLAIN WASTELANDS (~3)", etc.) — typically 6-10 categories per pool
     - **NO CHARACTERS** absolute ban (no people, no aliens, no foreground figures, no foreground spaceships — distant silhouettes at scale OK only when explicitly allowed)
     - **NO PROPER NOUNS** absolute ban — list every iconic franchise name to never use (Tatooine, Reaper, Khaydarin, etc.) and require generic-aesthetic descriptors instead
     - 2-3 example entries showing the desired voice and density

**3. Run gen scripts in parallel** for the universe (both landscape + architecture concurrently, ~30-90 sec each via Sonnet).

**4. Write 2 path files** at `scripts/bots/starbot/paths/<universe>-landscape.js` and `<universe>-architecture.js`. Each is a thin module that:
   - Picks one entry from the dedicated pool: `picker.pickWithRecency(pools.<UNIVERSE>_LANDSCAPES, ...)`
   - Picks lighting + atmosphere from shared pools
   - Wraps in this template:
     - SCI_FI_AWE_BLOCK + COSMIC_CANVAS_BLOCK + IMPOSSIBLE_BEAUTY_BLOCK
     - **NO CHARACTERS — NON-NEGOTIABLE** explicit reminder
     - The picked scene
     - Lighting / Atmosphere / scene palette / vibe color
     - **BLOW_IT_UP_BLOCK** (the generic sci-fi amplification — proven to work universally, do NOT make a per-universe variant unless tested)
     - Mood context from vibe directive
     - **NO FRANCHISE PROPER NOUNS** repeated reminder
     - Composition guidance (cinematic vista vs claustrophobic interior)
     - Output format spec

**5. Wire pool refs into `pools.js`:**
   - Add `<UNIVERSE>_LANDSCAPES: load('<universe>_landscapes')` and `<UNIVERSE>_ARCHITECTURE: load('<universe>_architecture')` to module exports
   - Append the new pools to `PLANET_SETTING` (landscape only) and `CHARACTER_INTERIOR` (architecture only) — additive, never replace
   - Append both to `COSMIC_ORACLE_LOCATIONS` (oracle path uses everything as flavor) — additive

**6. Wire path files into `index.js`:**
   - Add to the `pathBuilders` dictionary at the top
   - Add to `modelByPath` (flux-dev / flux-1.1-pro 50/50 rotation)
   - Add to `paths` array
   - Add to `pathWeights` map (default `1`)
   - Add to `chaos.allowSubjectChaosPaths` array
   - Add to `sensoryAnchors.pathContext` map → `'scene'`

**7. Verify load** with `node -e "const bot = require('./scripts/bots/starbot'); console.log('Active paths:', bot.paths.length);"` — should be old count + 2.

**8. Test 5-batch each via iter-bot:**
   ```bash
   node scripts/iter-bot.js --bot starbot --mode <universe>-landscape --count 5 --post --caption "v5-<universe>-landscape R1"
   node scripts/iter-bot.js --bot starbot --mode <universe>-architecture --count 5 --post --caption "v5-<universe>-architecture R1"
   ```
   Get user confirmation before moving to next universe. Scrap any path that doesn't land (e.g., mass-effect-landscape, dune-architecture, star-trek-architecture were all scrapped on first review).

### Why This Works

- **Aesthetic DNA reference** in the brief grounds Sonnet's vocabulary in a specific concept-art tradition rather than generic sci-fi clichés.
- **Per-category minimums** prevent Sonnet from clustering on 1-2 iconic biomes (otherwise you get all twin-sun deserts, no Hoth, no Endor).
- **Hard franchise-name bans** keep entries shippable (no IP issues) while preserving the ASTHETIC.
- **NO CHARACTERS** rule is non-negotiable — the moment you allow figures, Sonnet writes character-portraits and Flux renders close-up portraits, missing the whole "scene-only" point.
- **Same BLOW_IT_UP_BLOCK** across all paths means amplification is consistent and tunable in one place.
- **Scene pools also additively merge into character paths' location pools** (PLANET_SETTING, COSMIC_ORACLE_LOCATIONS, CHARACTER_INTERIOR) — so a Dune desert can show up as a backdrop for an explorer character render too. Pure additive: never replace existing entries, only extend.

### Universes Built So Far (2026-05-02)

| Universe | Landscape | Architecture | Notes |
|---|---|---|---|
| Dune | ✅ | ❌ scrapped | Polar/ice-coded entries felt off-brand |
| Aliens (Ridley Scott) | ✅ | ✅ | Architecture uses ALIENS-specific BLOW_IT_UP variant (Giger × Cameron × Cobb) |
| Star Wars | ✅ | ✅ | |
| Guardians of the Galaxy | ✅ | ✅ | |
| Mass Effect | ❌ scrapped | ✅ | Landscape was too generic-sci-fi |
| Halo | ✅ | ✅ | Halo-arc visible across sky is signature for landscape |
| Star Trek | ✅ | ❌ scrapped | Architecture too clean-sterile |
| StarCraft | ✅ | ✅ | 3-faction split (Terran/Protoss/Zerg) |

### Pinned Suggestions for Future Adaptations

| World | Visual Hook |
|---|---|
| Warhammer 40K | gothic-imperial hive cities, Forge World industrial-titan factories |
| Foundation | Trantor city-planet covering an entire world, Imperial classical-future |
| Stargate | Goa'uld gold-pyramid ships, Wraith biomechanical hive-ships, Atlantis underwater-city |
| The Expanse | Belt asteroid stations carved into rock, Mars Mariner Valley colonies |
| Babylon 5 | Vorlon organic-bioship, Shadow black-spider-ship, Centauri ornate empire |

---

## Tuning a Bot's Path Weight Distribution

Every bot's `index.js` exports a `pathWeights: {}` map where each path has a numeric weight. The picker draws weighted-random across the active set: a path with weight 4 is rendered twice as often as a path with weight 2. This is the lever for shaping a bot's overall "feed vibe."

### Why Aggregate Paths Into High-Level Categories First

Once a bot has 15+ active paths, looking at individual `pathWeights` becomes useless. You can't tell at a glance whether the feed leans scenery-heavy, character-heavy, or franchise-flavored. **Group paths into 3-5 high-level categories** that map to user-facing vibes, then reason about weights at the category level. Once you have target shares per category (e.g., "I want 40% universe-coded scenes / 30% character / 30% generic"), back into per-path weights.

For StarBot (2026-05-02 example):

| Category | Paths in category | Why grouped together |
|---|---|---|
| Universe-coded scene-only | dune-landscape, aliens-landscape, aliens-architecture, starwars-landscape, starwars-architecture, guardians-landscape, guardians-architecture, mass-effect-architecture, halo-landscape, halo-architecture, star-trek-landscape, starcraft-landscape, starcraft-architecture (13 paths) | All "fan-service IP-coded scenes, no characters" — same user-facing vibe |
| Character paths | female-explorer, male-explorer, cyborg-woman, robot-moment, cosmic-oracle (5 paths) | All render a character as primary subject |
| Generic scene paths | cosmic-vista, alien-landscape, space-opera, sci-fi-interior, cozy-sci-fi-interior, alien-city, real-space, megastructure (8 paths) | All "open sci-fi worldbuilding scenes, no franchise codes" |

### Computing Per-Path Weights From Category Targets

Given target category shares and path counts:

```
target_share_X
weight_per_path_in_X = (target_share_X / 100) × TOTAL / count_in_X
```

Example: StarBot's 26 active paths, target 40 / 30 / 30 split:

| Category | Target share | Path count | Weight each | Subtotal | Actual share |
|---|---|---|---|---|---|
| Universe scene | 40% | 13 | 4 | 52 | 39.4% |
| Character | 30% | 5 | 8 | 40 | 30.3% |
| Generic scene | 30% | 8 | 5 | 40 | 30.3% |
| **Total weight** | 100% | 26 | — | **132** | 100% |

Pick the smallest weights that hit the target. 4 / 8 / 5 reads as actually-40/30/30 once you compute (52/132, 40/132, 40/132). Avoid floats — integer weights are simpler to reason about and to update later.

### Layout Pattern

Group the entries in `pathWeights` by category in source order with a comment header per group. This makes weight-tuning a one-line edit per category and keeps audit-by-eye trivial:

```javascript
pathWeights: {
  // Generic scene paths (weight 5 each)
  'cosmic-vista': 5,
  'alien-landscape': 5,
  // ... 6 more

  // Character paths (weight 8 each)
  'robot-moment': 8,
  'cosmic-oracle': 8,
  // ... 3 more

  // Universe-coded scene-only paths (weight 4 each)
  'dune-landscape': 4,
  'aliens-landscape': 4,
  // ... 11 more
}
```

### When To Re-Tune

- After adding/removing paths in a category — recompute per-path weights so the category's target share holds.
- When user feedback says the feed "feels too X" — bump the underweighted category by one weight-tier.
- After a path is deactivated (commented out) — adjust the remaining paths in that category if you want the category's total share preserved.
- Quarterly sanity-check: run a 50-100 random batch and confirm the empirical category split matches the configured weights (recency-picker can sometimes cluster within categories).

### Hard Rules

- ALWAYS show a comment in `pathWeights` explaining the category structure and current target shares (so future edits don't drift the distribution by accident).
- Use integer weights — easier to update and easier to read.
- Comment out (don't delete) deactivated paths' weight lines — preserves the audit trail and makes re-enable a one-line revert.
