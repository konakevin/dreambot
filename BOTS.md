# Bot & Nightly Dream Generation System

> **V2 Bot Engine — Production (2026-04-25)**
>
> All 19 image bots run on the standalone V2 engine (`scripts/lib/botEngine.js`).
> Each bot is a pure-data Node module in `scripts/bots/<name>/` with its own
> per-bot GitHub Actions cron. Two content bots (HumanBot, MuseBot) use custom
> scripts with Sharp text overlays.
>
> **Key files:**
> - `scripts/lib/botEngine.js` — shared render engine (Sonnet + Flux + Supabase)
> - `scripts/lib/seedGenHelper.js` — batched Sonnet pool generator with intra-pool dedup
> - `scripts/lib/modelPicker.js` — per-medium/vibe model routing (DB-backed)
> - `scripts/iter-bot.js` — dev iteration CLI (batch renders to /tmp or --post)
> - `scripts/run-bot.js` — production entry point (1 render, fail-loud, called by cron)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Bot Module Structure](#bot-module-structure)
3. [The Bot Engine Contract](#the-bot-engine-contract)
4. [Seed Pool System](#seed-pool-system)
5. [Testing & Iteration (iter-bot.js)](#testing--iteration-iter-botjs)
6. [The "Bring It Alive" Process](#the-bring-it-alive-process)
7. [Writing Effective Briefs](#writing-effective-briefs)
8. [Writing Effective Pool Gen Scripts](#writing-effective-pool-gen-scripts)
9. [Lessons Learned](#lessons-learned)
10. [Production Cron](#production-cron)
11. [Creating a New Bot From Scratch](#creating-a-new-bot-from-scratch)
12. [Bot Roster](#bot-roster)
13. [Nightly User Dreams](#nightly-user-dreams)
14. [Database Tables](#database-tables)

---

## Architecture Overview

### The Render Pipeline

Every bot render follows this exact pipeline:

```
1. Resolve path (weighted random + 3-post dedup window)
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

### 4-Layer Axis Structure

Every render is a combination of FOUR layers:

| Layer | What it is | Example |
|---|---|---|
| **1. Shared DNA** (`rollSharedDNA`) | Axes rolled ONCE per render, shared by all paths | skin, body-type, glow-color, scene-palette, character identity |
| **2. Path-specific axes** (inside `buildBrief`) | Axes rolled per-path | landscape type, action, closeup framing, camera angle |
| **3. Universal prose blocks** (`shared-blocks.js`) | Text injected verbatim into every brief | BLOW_IT_UP, NO_NAMED_CHARACTERS, SOLO_COMPOSITION |
| **4. Flux wrapping** (`promptPrefix` + `promptSuffix` + `mediumStyles`) | Style anchor applied to every final prompt | golden first-sentence + per-medium style + no-text suffix |

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

---

## The Bot Engine Contract

`index.js` exports a plain object with these fields:

### Required Fields

```javascript
module.exports = {
  username: 'starbot',        // matches DB users.username
  displayName: 'StarBot',     // for logs

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

---

## The "Bring It Alive" Process

This is the 5-step process developed through StarBot and DragonBot for taking a bot from functional to stunning. Apply this to every bot.

### Step 1: Audit the Current State

Before changing anything, understand what the bot is rendering:

```bash
# Run 5 random renders to see current quality
node scripts/iter-bot.js --bot <name> --count 5 --post

# Run 5 per specific path to identify weak spots
node scripts/iter-bot.js --bot <name> --count 5 --mode <path> --post
```

Review on phone. Score each render 1-5. Identify:
- Which paths produce stunning results?
- Which paths produce repetitive/boring/broken results?
- Are the briefs constraining Sonnet too much or too little?
- Are pool entries specific enough to produce distinct renders?

### Step 2: Fix the Brief

The brief is the single most important file. Common fixes:

- **Add identity-matching language** — "READ the [X] below and render THAT specific [thing]. Do NOT default to: [list the 4-5 most common AI defaults for this genre]"
- **Add composition bans** — "NOT walking towards camera, NOT facing camera, NOT posing, NOT standing still" (put these in the brief, NOT in pool gen scripts)
- **Add explicit banned imagery** — "NO skulls, NO skeletons, NO floating objects" (whatever the AI keeps defaulting to)
- **Add the BLOW_IT_UP block** — tells Sonnet to max every element within the theme's constraints
- **Enforce solo composition** — "She is the ONLY figure in the frame" for character bots
- **Cap the output format** — "Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers..."

**CRITICAL: Composition problems belong in the BRIEF, not in pool gen scripts.** The brief controls what Sonnet writes. The pool provides what the scene IS. "Walking towards camera" is a Sonnet composition problem — ban it in the brief, don't rewrite all your action entries.

### Step 3: Tune the Pools

After the brief is solid, iterate on pool quality:

- **Expand thin pools** — anything under 200 entries gets expanded
- **Check pool-to-brief alignment** — pool content is useless if the brief hardcodes composition that overrides it. Always update both together.
- **Add dedup dimensions to gen scripts** — "Deduplicate by: base hue + warmth/coolness + intensity" for colors, "verb + body engagement" for actions, "setting type + time of day" for scenes
- **For sensitive axes (skin/body/hair), hand-curate** — Sonnet-generated entries can introduce unintended texture language. Match the tone/voice of existing entries.

### Step 4: Add mediumStyles

Each `mediumStyles` entry gives the bot's visual DNA for that medium. Without it, the bot uses the generic DB `flux_fragment` which has no personality.

```javascript
mediumStyles: {
  render: 'high-end cinematic 3D render — feature-film VFX quality, ...',
  photography: '35mm cinematic sci-fi film-still — Denis-Villeneuve Blade-Runner-2049 ...',
},
```

### Step 5: Weight Paths and Lock In

After all paths render well individually:

```bash
# Run 10 random weighted renders to check distribution feels right
node scripts/iter-bot.js --bot <name> --count 10 --post
```

Adjust `pathWeights` until the distribution matches desired frequency. Higher-quality paths get weight 2, niche paths stay at 1.

Then expand all pools to 200 entries, commit, push.

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

---

## Production Cron

### Per-Bot Workflows

Each migrated bot has its own `.github/workflows/<name>.yml`:

```yaml
name: StarBot Dream Generation

on:
  schedule:
    - cron: '0 21 * * *'   # 2 posts/day, staggered times
    - cron: '0 9 * * *'
  workflow_dispatch:        # manual trigger with optional overrides
    inputs:
      path:
        description: 'Specific path (default: random)'
        required: false
        default: 'random'
      vibe:
        description: 'Specific vibe (default: random)'
        required: false
        default: 'random'

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Install dependencies
        run: npm ci --ignore-scripts
      - name: Random delay (0-4 hours)
        if: github.event_name == 'schedule'
        run: sleep $((RANDOM % 14400))
      - name: Generate dream
        env:
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          REPLICATE_API_TOKEN: ${{ secrets.REPLICATE_API_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          node scripts/run-bot.js \
            --bot starbot \
            --path "${{ inputs.path || 'random' }}" \
            --vibe "${{ inputs.vibe || 'random' }}"
```

### Key Cron Details

- Each bot runs 2x/day at staggered times + 0-4 hour random delay
- `run-bot.js` renders 1 dream, posts it, fails loud on error
- `workflow_dispatch` allows manual triggering with path/vibe overrides from the GitHub UI
- GitHub Actions secrets: `SUPABASE_SERVICE_ROLE_KEY`, `REPLICATE_API_TOKEN`, `ANTHROPIC_API_KEY`

### Creating a New Workflow

Copy an existing workflow, change the bot name and cron times. Stagger cron times by 15-30 minutes from existing bots to spread API load.

---

## Creating a New Bot From Scratch

### Step 1: Create the Module

```bash
mkdir -p scripts/bots/<name>/paths scripts/bots/<name>/seeds
```

Create:
- `index.js` — bot contract (see The Bot Engine Contract above)
- `pools.js` — axis pools with `load()` helper
- `shared-blocks.js` — universal prose blocks for this bot's identity

### Step 2: Define Paths

Each path is a distinct visual approach. Guidelines:
- 3-8 paths per bot (too few = repetitive, too many = diluted)
- Each path should produce visibly different renders
- Character bots: split by composition (closeup vs full-body) and/or action type
- Scene bots: split by environment type (landscape vs interior vs city vs cosmic)

### Step 3: Write Gen Scripts + Generate Pools

One gen script per pool in `scripts/gen-seeds/<name>/`. Start at `total: 25` for testing, scale to `total: 200, batch: 50` after approval.

### Step 4: Write Path Briefs

One brief-builder per path in `paths/<name>.js`. Follow the brief structure in "Writing Effective Briefs" above.

### Step 5: Test

```bash
# Test each path individually
node scripts/iter-bot.js --bot <name> --count 5 --mode <path> --post

# Test random distribution
node scripts/iter-bot.js --bot <name> --count 10 --post
```

### Step 6: Create Workflow + Deploy

1. Create `.github/workflows/<name>.yml` (copy from existing)
2. Commit everything
3. Push to main — cron activates on next scheduled run

### Step 7: Verify in App

Search for the bot in the app, check their profile shows posts. Review renders on phone.

---

## Bot Roster

### Active Image Bots (V2 Engine)

All 19 bots below are on per-bot crons via the V2 engine.

| Bot | Directory | Content | Paths | Mediums |
|---|---|---|---|---|
| StarBot | `starbot/` | Sci-fi / space / cyborg | 13 | render, real-astro, star-oil-cosmos |
| DragonBot | `dragonbot/` | Epic fantasy / dragons | 8+ | canvas, watercolor |
| GothBot | `gothbot/` | Gothic dark / vampires | 6+ | gothic, anime, canvas |
| SirenBot | `sirenbot/` | Fantasy characters | 7 | canvas, watercolor |
| MangaBot | `mangabot/` | Anime / Japanese | 4+ | anime |
| BloomBot | `bloombot/` | Flowers / botanical | 4+ | photography, canvas, watercolor, pencil |
| EarthBot | `earthbot/` | Nature / landscape | 4+ | photography, canvas, watercolor |
| ToyBot | `toybot/` | Toys / crafts / miniatures | 5+ | lego, animation, claymation |
| TinyBot | `tinybot/` | Miniatures / dioramas | 4+ | photography, animation, claymation |
| SteamBot | `steambot/` | Steampunk | 4+ | canvas, photography |
| TitanBot | `titanbot/` | Mythology / gods | 4+ | canvas, photography |
| CoquetteBot | `coquettebot/` | Cute feminine | 4+ | coquette, fairytale, watercolor |
| CuddleBot | `cuddlebot/` | Kawaii cozy | 4+ | animation, claymation, storybook |
| PixelBot | `pixelbot/` | Retro pixel art | 4+ | pixels |
| RetroBot | `retrobot/` | Retro / vaporwave | 4+ | vaporwave |
| OceanBot | `oceanbot/` | Ocean / underwater | 4+ | photography, canvas, watercolor |
| DinoBot | `dinobot/` | Dinosaurs / prehistoric | 4+ | canvas, photography |
| BeachBot | `beachbot/` | Beach / coastal | 4+ | photography, watercolor |
| BrickBot | `brickbot/` | LEGO / brick art | 4+ | lego |

### Content Bots (Custom Scripts)

| Bot | Content | Medium | Script |
|---|---|---|---|
| HumanBot | AI roasting human behavior | watercolor + enchanted | `generate-humanbot.js` |
| MuseBot | AI musing on human condition | aura + ethereal | `generate-musebot.js` |

Content bots follow a different architecture: stateless (no seed pool), Sonnet generates text content fresh each run, Sharp composites text overlay onto Flux-rendered base image.

### Reference Implementations

- **StarBot** (`scripts/bots/starbot/`) — the most complex bot. 13 paths, cyborg-woman with closeup/full-body split, path-conditional rollSharedDNA, per-medium promptPrefix/Suffix overrides, per-medium mediumStyles, per-path modelByPath. Use as reference for any character-centric bot with environment paths.

- **GothBot** (`scripts/bots/gothbot/`) — reference for mediumStyles (how to make each medium visually distinct for the bot's identity), bannedPhrases, and the scene-girls pattern (Pre-Raphaelite oil painting + 4-pool architecture + custom medium + pose-first actions).

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
