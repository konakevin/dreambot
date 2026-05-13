# Bot Axis-System Refactor — Plan of Record

**Status:** Plan locked 2026-05-12. Phase 0 not started.
**Owner:** Kevin (decisions), Claude (implementation).
**Scope:** StarBot first; system designed to apply to DragonBot / GothBot / SteamBot / MechBot / DinoBot / BrickBot etc. after StarBot validates.

> Reference docs: `BOT_SCENE_QUALITY_PLAYBOOK.md` (the cross-bot rules), this file (the refactor execution plan), `memory/feedback_playbook_first.md` (the meta-rule: always re-read playbook before path work).

---

## Why we're doing this

After ~9 "finished" StarBot path migrations (alien-city, female-explorer, male-explorer, megastructure, space-opera, cosmic-oracle, cosmic-vista, real-space, cozy-sci-fi-interior), the truth is each was hand-built bespoke — every path file has ~150 lines of duplicated brief boilerplate, decisions like "canonical-LITE vs full" were ad-hoc per path, and the "system" exists in the playbook but never got compiled to shared code.

Result: inconsistent path states (some fat-seed, some slim; some with conditional drama, some without; some with framing modes), no portability to other bots, every new path = full hand-build.

The goal: **make path migration a 5-line declaration that taps a shared composer.** Migration becomes repeatable. The pattern transfers to other bots cleanly.

---

## Part 1: Architecture

### 1.1 Path Archetypes (`scripts/lib/archetypes.js`)

Six archetypes. Each declares its slot list, what axes apply, what conditional layers/framing modes are valid:

```js
{
  OUTDOOR_LANDSCAPE: {
    description: 'World is hero, entity is scale prover.',
    universalAxes: ['story_beat', 'anchor_scale', 'composition_frame',
                    'scale_provers', 'weather_particulate', 'emotional_dna', 'lighting'],
    botAxes: ['sky_layer', 'surprise_element', 'anchor_entity'],
    pathAxes: ['biome'],
    anchorScaleRange: ['TINY', 'SMALL'],
    conditionalLayer: { slot: 'phenomenon', gate: 0.40 },
    framingModes: null,
    examples: ['alien-landscape', 'dune-landscape', 'halo-landscape',
               'starwars-landscape', 'star-trek-landscape', 'starcraft-landscape'],
  },

  OUTDOOR_CITY: {
    description: 'Architecture / megastructure / city as hero.',
    universalAxes: ['story_beat', 'anchor_scale', 'composition_frame',
                    'scale_provers', 'weather_particulate', 'emotional_dna', 'lighting'],
    botAxes: ['sky_layer', 'surprise_element', 'anchor_entity', 'architecture_style'],
    pathAxes: ['setting'],
    anchorScaleRange: ['TINY', 'SMALL'],
    conditionalLayer: { slot: 'drama', gate: 0.40 },
    framingModes: null,
    examples: ['alien-city', 'megastructure', 'aliens-architecture',
               'guardians-architecture', 'mass-effect-architecture',
               'space-opera' /* spaceship-city; treated as OUTDOOR_CITY */],
  },

  INDOOR_INTIMATE: {
    description: 'Small lived-in interior. No sky, no monumental scale.',
    universalAxes: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting'],
    botAxes: [],  // no sky, no surprise (over-stuffs), no anchor_entity at this scale
    pathAxes: ['interior'],
    anchorScaleRange: null,
    conditionalLayer: { slot: 'moment', gate: 0.40 },
    framingModes: {
      modes: ['zoom_in_centerpiece', 'wide_room', 'windowless'],
      weights: [0.30, 0.45, 0.25],
    },
    examples: ['cozy-sci-fi-interior'],
  },

  CHARACTER: {
    description: 'Figure is protagonist. Anchor at MEDIUM/LARGE scale.',
    universalAxes: ['story_beat', 'anchor_scale', 'composition_frame',
                    'emotional_dna', 'lighting'],
    botAxes: ['sky_layer', 'surprise_element'],
    characterDnaAxes: ['race', 'hair_color', 'hairstyle', 'eye_color',
                       'skin_tone', 'outfit', 'accessory'],
    pathAxes: ['setting', 'action'],
    anchorScaleRange: ['MEDIUM', 'LARGE'],
    conditionalLayer: { slot: 'drama', gate: 0.40 },
    framingModes: null,
    examples: ['female-explorer', 'male-explorer', 'cosmic-oracle'],
  },

  PURE_COSMOS: {
    description: 'Astronomical phenomenon as subject. No figure.',
    universalAxes: ['story_beat', 'composition_frame', 'scale_provers',
                    'weather_particulate', 'emotional_dna', 'lighting'],
    botAxes: ['surprise_element'],  // secondary phenomenon
    pathAxes: ['phenomenon'],
    anchorScaleRange: null,
    conditionalLayer: { slot: 'event', gate: 0.40 },
    framingModes: null,
    examples: ['cosmic-vista'],
  },

  PHOTOREAL_ASTRO: {
    description: 'NASA-style astrophotography. FAT-seed exception.',
    universalAxes: ['story_beat', 'composition_frame', 'emotional_dna', 'lighting'],
    botAxes: [],
    pathAxes: ['subject'],  // FAT-seed pool — the rule for this archetype only
    anchorScaleRange: null,
    conditionalLayer: { slot: 'event', gate: 0.35 },
    framingModes: null,
    fatSeedException: true,
    examples: ['real-space'],
  },
}
```

### 1.2 Brief Composer (`scripts/lib/brief-composer.js`)

```js
function composeBrief({ bot, pathConfig, picker, sharedDNA, vibeDirective }) {
  const arch = ARCHETYPES[pathConfig.archetype];
  const slots = {};

  // 1. Roll universal axes
  for (const axisName of arch.universalAxes) {
    slots[axisName] = picker.pickWithRecency(UNIVERSAL_POOLS[axisName], axisName);
  }
  // 2. Roll bot-level axes
  for (const axisName of arch.botAxes) {
    slots[axisName] = picker.pickWithRecency(bot.pools[axisName], axisName);
  }
  // 3. Roll character DNA (if archetype declares it)
  if (arch.characterDnaAxes) {
    for (const axisName of arch.characterDnaAxes) {
      slots[axisName] = picker.pickWithRecency(bot.pools[axisName], axisName);
    }
  }
  // 4. Roll path-level axes (bespoke per path)
  for (const axisName of arch.pathAxes) {
    const poolName = pathConfig.pools[axisName];
    slots[axisName] = picker.pickWithRecency(PATH_POOLS[poolName], poolName);
  }
  // 5. Roll conditional drama
  if (arch.conditionalLayer && Math.random() < arch.conditionalLayer.gate) {
    const slot = arch.conditionalLayer.slot;
    slots[slot] = picker.pickWithRecency(PATH_POOLS[pathConfig.pools[slot]], slot);
  }
  // 6. Roll framing mode
  if (arch.framingModes) {
    slots._framingMode = rollFromWeights(arch.framingModes.modes, arch.framingModes.weights);
  }

  // 7. Run through archetype-specific template
  return ARCHETYPE_TEMPLATES[pathConfig.archetype](slots, sharedDNA, vibeDirective);
}
```

### 1.3 Path File Shape (post-refactor)

```js
// scripts/bots/starbot/paths/alien-landscape.js
module.exports = {
  archetype: 'OUTDOOR_LANDSCAPE',
  pools: {
    biome: 'alien_landscape_biome',           // slim bespoke
    phenomenon: 'alien_landscape_phenomenon', // conditional drama pool
  },
};
```

That's the whole path file post-refactor. The composer does the rest.

### 1.4 Pool resolution hierarchy (locked 2026-05-12, after Kevin chose "Option B")

The composer resolves each axis at render time with this order:

1. **Path override** — if the path file declares its own pool for this axis (e.g. cozy declares its own `story_beats` because intimate-scale beats differ from monumental beats), use it.
2. **Bot default** — otherwise use the bot's genre-coded version of that axis (e.g. StarBot's `story_beats` is sci-fi-coded; GothBot's is gothic-coded).
3. **No shared lib fallback** — every bot ships its own version of every universal axis. The shared lib only holds the COMPOSER and the ARCHETYPE DEFINITIONS, never default pool content. New-bot bootstrap = clone an existing bot's universal pools and re-gen with genre-coded recipe.

This is the **Layered Defaults with Path Overrides** model. Universal axis CONCEPTS are universal (every bot has a `story_beats` axis); the actual seed content is bot-coded by default and path-overridable when divergence matters.

| Axis category | Resolution |
|---|---|
| `biome` / `setting` / `interior` / `phenomenon` / `subject` (primary path subject) | Always path-bespoke |
| Conditional drama (`phenomenon` / `drama` / `moment` / `event`) | Always path-bespoke |
| Character action (CHARACTER archetype only) | Always path-bespoke |
| `anchor_entity` / `sky_layer` / `surprise_element` / `architecture_style` (bot-level) | Bot default; path may override |
| `story_beats` / `composition_frame` / `scale_provers` / `weather_particulate` / `emotional_dna` / `lighting` / `anchor_scale` (universal axes) | Bot default; path may override when needs diverge significantly (e.g. cozy intimate-scale story_beats) |

### 1.5 File Layout

```
scripts/
  lib/
    archetypes.js               # the 6 archetype declarations + slot definitions
    brief-composer.js           # the shared brief assembler — resolves slots
                                # via path → bot hierarchy
    archetype-templates.js      # the 6 brief templates per archetype
    gen-bot-pool.js             # bot-agnostic pool generator (extracted
                                # from gen-starbot-pool.js)
  bots/
    starbot/
      index.js                  # bot config: mediums, vibes, default-pool registry
      paths/                    # tiny declarations (5-15 lines each, post-refactor)
        legacy/                 # original hand-written path files preserved
                                # for 30 days post-migration
      seeds/
        universal/              # bot's genre-coded versions of universal axes
          story_beats.json      # StarBot sci-fi-coded
          composition_frame.json
          scale_provers.json
          weather_particulate.json
          emotional_dna.json
          lighting.json
          anchor_scale.json
        bot/                    # bot-level axes
          anchor_entity.json
          sky_layer.json
          surprise_element.json
          architecture_style.json
        path/                   # path-level bespoke pools
          alien_landscape_biome.json
          alien_landscape_phenomenon.json
          cosmic_oracle_locations.json
          ...
        path_overrides/         # rare per-path overrides of universal axes
          cozy_story_beats.json # intimate-scale story beats (overrides bot default)
          ...
      recipes/                  # bot-specific gen recipes for ALL its pools
    dragonbot/                  # future bots plug in the same way
      index.js
      paths/
      seeds/
        universal/              # DragonBot fantasy-coded universal axes
        bot/
        path/
        path_overrides/
      recipes/
```

**Note on migration of existing pools:** StarBot currently has its universal pools at `seeds/<axis>.json` (flat). They're already sci-fi-coded by content. The Phase 1 refactor moves them to `seeds/universal/<axis>.json` and registers them as the bot's defaults in `bots/starbot/index.js`. No content change.

---

## Part 2: Migration Strategy

### Phase 0 — Baseline & Snapshot (mandatory before any refactor)

**Goal:** Lock in the current behavior of all 9 finished StarBot paths so we have an objective parity check after refactor.

1. Add a deterministic-picker mode to `iter-bot.js` — accept `--seed N` flag that seeds the picker RNG so brief generation is reproducible.
2. For each of the 9 finished paths:
   - Run 20 brief generations with seeds 0-19. Save brief strings to `__tests__/snapshots/briefs/<path>.snapshot.txt`.
   - Run 5 actual renders with seeds 0-4. Save thumbnails to `__tests__/snapshots/renders/<path>/*.jpg`.
3. Write a jest test that re-runs the 20 seeded brief generations and diffs against the snapshot file. This becomes the parity gate for every subsequent commit.
4. Total snapshots: 180 brief strings + 45 image thumbnails.
5. Commit `phase-0-baseline-snapshots` with all of this. This is the contract refactoring must honor.

**Deliverable:** `__tests__/snapshots/` directory + jest test + the seeded picker mode.

### Phase 1 — Build the shared lib WITHOUT touching any path file

**Goal:** Compose the lib by extracting common structure from the 9 existing path files. No invention.

1. Write `archetypes.js` with the 6 archetype declarations (above).
2. Write `archetype-templates.js` — for each archetype, write the brief template by **literally extracting** the brief structure from the corresponding finished path file:
   - PURE_COSMOS template = cosmic-vista's current brief, parameterized over `${slots}`
   - OUTDOOR_LANDSCAPE template = alien-landscape's current brief
   - OUTDOOR_CITY template = alien-city's current brief
   - CHARACTER template = female-explorer's current brief
   - INDOOR_INTIMATE template = cozy-sci-fi-interior's current brief
   - PHOTOREAL_ASTRO template = real-space's current brief
3. Write `brief-composer.js` orchestrator (above).
4. Unit tests: composer returns the right brief shape for each archetype against synthetic pool data. (Validates the composer doesn't crash; doesn't yet verify parity with old briefs — that's Phase 2.)
5. **Path files remain unchanged.** Composer lives in parallel, unused.

**Deliverable:** `scripts/lib/` populated, unit tests pass, no path file touched.

### Phase 2 — First Path Parity Test (the gating check for the entire refactor)

**Goal:** Prove the composer can reproduce a real path's brief output exactly.

Choose **cosmic-vista** first — simplest archetype (PURE_COSMOS), no figure, no character DNA, slim 21-word pool. If composer fails here, design needs rework before touching other paths.

1. Write the new path file declaration form: `{ archetype: 'PURE_COSMOS', pools: { phenomenon: 'cosmic_phenomena', event: 'cosmic_event' } }`.
2. Add path file routing so `iter-bot.js` recognizes the declaration form and routes through the composer.
3. Run the 20-seed brief snapshot through the new composer (same RNG seeds as Phase 0).
4. **Diff against the Phase-0 snapshot:**
   - Byte-identical → ✅ proceed.
   - Whitespace/header-order differences only → ✅ accept after Kevin reviews the diff.
   - Any content difference (axis values, brief rules, conditional layer text) → ❌ STOP. Debug composer until brief output matches.
5. Once brief parity holds, render 5 images with the new composer at seeds 0-4. Visual-compare to Phase-0 image snapshots.
6. Kevin sign-off → commit `migrate-cosmic-vista-to-composer`. Move legacy path file to `paths/legacy/cosmic-vista.js`.

**Deliverable:** First path migrated through composer, snapshot test green, Kevin signed off.

### Phase 3 — Migrate Remaining Finished Paths (ascending complexity, one per commit)

Order matters — start simple, build composer confidence, save complex paths for last:

1. ✅ cosmic-vista (PURE_COSMOS) — done in Phase 2.
2. real-space (PHOTOREAL_ASTRO — fat-seed exception, narrow template).
3. cosmic-oracle (CHARACTER, slim pools).
4. alien-city (OUTDOOR_CITY, slim pool, has ARCHITECTURE_STYLE bot-axis).
5. megastructure (OUTDOOR_CITY, slim pool).
6. space-opera (OUTDOOR_CITY-ish, ships pool + 3 conditional drama layers — most complex conditional logic).
7. female-explorer (CHARACTER, full character DNA stack).
8. male-explorer (CHARACTER, recipe-transfer from female).
9. cozy-sci-fi-interior — **special case: pool must be reseeded slim FIRST** before composer migration. The current 400-entry 46w-avg pool is wrong-shape (fat) for INDOOR_INTIMATE archetype. Steps:
   - Author new `gen-bot-pool.js` recipe for `cozy_sci_fi_interiors` targeting 20-25 word atomic descriptions
   - Generate 200 slim entries, replace current pool
   - THEN migrate path file through composer
   - THEN parity-check against a fresh baseline (cozy's Phase-0 snapshot becomes irrelevant; we lock new baseline post-reseed)

Each path = its own commit. `git revert <sha>` rolls back any single path without affecting others. After every commit, the snapshot test runs and must still pass for ALL previously-migrated paths (no cross-contamination).

**Deliverable:** All 9 finished paths converted to composer declarations. Each rendered via the composer produces visually equivalent output to its pre-refactor version (or for cozy, the new slim-pool version is approved by Kevin as superseding the old).

### Phase 4 — Migrate Unfinished Paths (alien-landscape + 7 franchise paths)

For each unfinished path:

1. Declare archetype + bespoke pool names in path file.
2. Author bespoke slim pools via `gen-bot-pool.js` (target 200 entries each).
3. Author conditional drama pool (target ~50 entries, 40% gate).
4. R0 baseline → 5 renders → grade → iterate one change per round until 3 consecutive 4.5+/5 batches.
5. Update playbook iteration log per round.
6. Commit per path.

Paths to migrate in Phase 4 (in any order Kevin prefers — recommend alien-landscape first since it shares ALIEN_PLANET_BIOME with character paths and decoupling it benefits 3 paths):

- alien-landscape (OUTDOOR_LANDSCAPE — needs `alien_landscape_biome` + `alien_landscape_phenomenon`)
- dune-landscape (OUTDOOR_LANDSCAPE — Villeneuve-coded biome + sandstorm/spice-storm conditional)
- aliens-architecture (OUTDOOR_CITY — Giger biomech architecture + ambient horror conditional)
- starwars-landscape (OUTDOOR_LANDSCAPE — McQuarrie-coded biome)
- guardians-architecture (OUTDOOR_CITY — Marvel-cosmic architecture)
- mass-effect-architecture (OUTDOOR_CITY — Cerberus/citadel-coded)
- halo-landscape (OUTDOOR_LANDSCAPE — Bungie-coded ring landscape)
- star-trek-landscape (OUTDOOR_LANDSCAPE — utopian/exploratory)
- starcraft-landscape (OUTDOOR_LANDSCAPE — Blizzard sci-fi grit)

### Phase 5 — Update Playbook

1. Add an "Architecture: Path Archetypes" section to `BOT_SCENE_QUALITY_PLAYBOOK.md` documenting all 6 archetypes + decision tree (when to use which).
2. Add a "Migration Recipe" section: the steps to apply this system to a new path/bot.
3. Add a "Parity-Test Protocol" section: how to validate a path migration didn't regress.
4. Update per-path iteration log entries with composer-migration entries.
5. Mark the relevant pending paths as DONE in the iteration log.

### Phase 6 — Apply to Other Bots (proof of cross-bot portability)

DragonBot is the proof. Follow the NEW BOT INITIALIZATION CHECKLIST below.

Subsequent bots (GothBot, SteamBot, MechBot, DinoBot, BrickBot) follow the same checklist.

If the system worked for DragonBot with no architectural change to `scripts/lib/`, **portability is proven**.

---

## NEW BOT INITIALIZATION CHECKLIST

When starting a new bot, establish every pool listed below BEFORE any path migration. Skipping pools causes silent fallbacks or composer errors mid-render. This is the canonical setup recipe.

### Two-stage pool gen pattern (applies to every Stage A/B/C pool — locked 2026-05-12)

**Never go straight to production size.** Every new pool follows this two-stage gate:

1. **MVP — gen 25-30 entries first.** Run the recipe at target 25-30. Fast cycle (~2-3 min, ~$0.20 Sonnet). Render-test 5 against the path/bot/archetype the pool will feed.
2. **Approval gate — Kevin signs off on the recipe.** If the MVP renders hit the playbook bar (4.5+/5), the recipe is locked. If they don't, iterate the recipe (touchpoints / instructions / ban list / examples) and regen MVP. Repeat until approved.
3. **Production — scale to target via append-mode.** Once the recipe is locked, run `--target <N>` to append-gen up to production size (50-200 depending on pool type). The original 25-30 MVP entries are preserved.

**Why two-stage:** a bad recipe produces 200 mediocre entries instead of 30. Catching the recipe issue at MVP saves ~$1-2 of Sonnet + several minutes of regen. Production-sizing should only happen after the pool's first 25-30 entries have been visually validated through actual renders.

**The 25-30 MVP is a HARD gate.** Never declare a pool production-sized without prior MVP approval. The render-test must use the actual path the pool feeds — not synthetic prompts.

---

### Stage A — Universal axis pools (genre-coded, per-bot defaults)

Every bot ships its own version of all 7 universal pools. Genre-tailor the content (StarBot sci-fi-coded / DragonBot fantasy-coded / GothBot gothic-coded). The CONCEPTS are universal; the descriptions are bot-flavored.

| Pool | Target entries | Avg words/entry | Slot |
|---|---|---|---|
| `story_beats` | 50-100 | ~20 | `story_beat` |
| `composition_frame` | 50 | ~25 | `composition_frame` |
| `scale_provers` | 50 | ~20 | `scale_provers` |
| `weather_particulate` | 50-200 | ~20 | `weather_particulate` |
| `emotional_dna` | 50 | ~20 | `emotional_dna` |
| `lighting` | 100-200 | ~25 | `lighting` |
| `anchor_scale` | 4 | label-only | `anchor_scale` |

`anchor_scale` is universal labels (TINY / SMALL / MEDIUM / LARGE) — same content across bots; can be bot-shipped or shared.

**Bootstrap path for new bot:** clone StarBot's universal pool recipes from `scripts/gen-starbot-pool.js`, rewrite the recipe's `theme` + `touchpoints` for the new bot's genre, run `gen-bot-pool.js --bot <bot> --pool <axis> --target <N>` for each.

### Stage B — Bot-level axis pools (genre-coded)

| Pool | Target entries | Avg words/entry | Slot | Required for |
|---|---|---|---|---|
| `anchor_entity` | 50-100 | ~15-25 | `anchor_entity` | OUTDOOR_LANDSCAPE, OUTDOOR_CITY paths (figure/ship/creature anchor) |
| `sky_layer` | 30-50 | ~20 | `sky_layer` | OUTDOOR_LANDSCAPE, OUTDOOR_CITY, CHARACTER paths |
| `surprise_element` | 50-100 | ~15-25 | `surprise_element` | All paths except PHOTOREAL_ASTRO (secondary visual subject) |
| `architecture_style` | 25-50 | ~20 | `architecture_style` | OUTDOOR_CITY paths only (distinct structural languages) |

### Stage C — Per-path bespoke pools (path-coded)

Per path, run `gen-bot-pool.js --bot <bot> --pool <name> --target <N>`. The pools required depend on the path's archetype:

| Archetype | Required path-bespoke pools | Notes |
|---|---|---|
| **OUTDOOR_LANDSCAPE** | `<path>_biome` (slim, 200) + `<path>_phenomenon` (conditional, 50, 40% gate) | biome = geology+biology emphasis |
| **OUTDOOR_CITY** | `<path>_setting` (slim, 200) + `<path>_drama` (conditional, 50, 40% gate) | setting = architecture/megastructure emphasis |
| **INDOOR_INTIMATE** | `<path>_interior` (slim, 200) + `<path>_moment` (conditional, 50-200, 40% gate) | + framing modes auto-applied by archetype |
| **CHARACTER** | `<path>_setting` (slim, 200) + `<path>_action` (slim, 100-200) + `<path>_drama` (conditional, 50, 40% gate) | PLUS 7 character DNA pools (see Stage D) |
| **PURE_COSMOS** | `<path>_phenomenon` (slim, 200) + `<path>_event` (conditional, 50-100, 40% gate) | no figure |
| **PHOTOREAL_ASTRO** | `<path>_subject` (slim, 200 — named astronomical objects) + `<path>_event` (conditional, 50-100, 35% gate) | photoreal multi-wavelength wrapper added by template |

### Stage D — Character DNA pools (CHARACTER archetype only, per bot)

Each bot supplies the genre-coded race + appearance pools. Outfit and accessory pools may be path-specific:

| Pool | Target | Path or Bot level |
|---|---|---|
| `<bot>_race` (sci_fi_race / fantasy_race / etc.) | 25-50 | Bot-level (shared across the bot's CHARACTER paths) |
| `<bot>_skin` / `_eyes` / `_hair_color` | 25 each | Bot-level |
| `<path>_outfits` (female + male variants if both paths exist) | 100-200 | Path-level (action-stage-ready coverage) |
| `<path>_accessories` (female + male) | 50-100 | Path-level |
| `<path>_hairstyles` (female + male) | 50 | Path-level |
| `<path>_action` (engagement verbs for this character path) | 100-200 | Path-level |

### Stage E — Path overrides (rare, on-demand)

A path may override any universal or bot-level axis when its needs diverge significantly from the bot's default. Examples:

- `cozy-sci-fi-interior` overrides `story_beats` because the bot's default beats are monumental-scale (ARRIVAL / DEPARTURE / AWE) and cozy needs intimate-scale beats (RETURN HOME / EVENING IN / QUIET WATCHING).
- A path inside-a-vacuum might override `weather_particulate` to be cosmic-dust-only.

Override = author a new `<path>_<axis>.json` pool and declare it in the path's pool registry: `pools: { story_beat: '<path>_story_beats' }`.

### Stage F — Bot index.js (the bot's bind)

```js
module.exports = {
  username: '<bot>',
  displayName: '<Bot>',
  mediums: [...],          // bot's allowed mediums
  mediumByPath: {...},     // path → medium override
  vibes: [...],            // bot's allowed vibes
  vibesByPath: {...},      // path → vibe override
  modelByPath: {...},      // path → Flux model weights

  // Pool defaults registry — slot → pool name in pools.js. Composer reads
  // this when a path doesn't override a slot.
  defaultPools: {
    story_beat: '<BOT>_STORY_BEATS',
    composition_frame: '<BOT>_COMPOSITION_FRAME',
    scale_provers: '<BOT>_SCALE_PROVERS',
    weather_particulate: '<BOT>_WEATHER_PARTICULATE',
    emotional_dna: '<BOT>_EMOTIONAL_DNA',
    lighting: '<BOT>_LIGHTING',
    anchor_scale: '<BOT>_ANCHOR_SCALE',
    anchor_entity: '<BOT>_ANCHOR_ENTITY',
    sky_layer: '<BOT>_SKY_LAYER',
    surprise_element: '<BOT>_SURPRISE_ELEMENT',
    architecture_style: '<BOT>_ARCHITECTURE_STYLE', // if any OUTDOOR_CITY paths
  },

  poolByName(name) {
    if (!(name in pools)) throw new Error(`<Bot>.poolByName: unknown pool "${name}"`);
    return pools[name];
  },

  rollSharedDNA({ vibeKey, path, picker }) { /* bot's scene palette + color palette */ },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`<Bot>: unknown path "${path}"`);
    if (typeof builder === 'function') return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      return composeBrief({ bot: module.exports, pathConfig: builder, sharedDNA, vibeDirective, picker });
    }
    throw new Error(`<Bot>: path "${path}" has invalid export shape`);
  },

  caption({ path }) { return `[${path}] <Bot>`; },
};
```

### Stage G — Path files (declarations)

Each path file = ~10-line archetype declaration:

```js
module.exports = {
  archetype: 'OUTDOOR_LANDSCAPE',
  pools: {
    biome: 'FANTASY_FOREST_BIOME',          // path-bespoke (slim)
    phenomenon: 'FANTASY_FOREST_PHENOMENON', // conditional drama
    // optionally override universal axes:
    // story_beat: 'FANTASY_FOREST_STORY_BEATS', // override only if divergence matters
  },
};
```

### Stage H — Verification

Before declaring a new bot ready:

1. Every slot in every path's archetype must resolve (path override OR bot default). Run a smoke test that calls `composeBrief` for each path with synthetic inputs — error if any slot fails to resolve.
2. Run R0 baseline (5 renders per path) → grade against playbook's 8 components → iterate.
3. Cross-reference Kevin's hearts on the new bot's renders to calibrate quality.
4. Document bot-specific lessons in playbook's per-bot section.

### Estimated setup cost per new bot

- Stage A (7 universal pools): ~$2-3 in Sonnet gen
- Stage B (4 bot-level pools): ~$1-2
- Stage C (per-path bespoke): ~$0.30-1 per path × N paths
- Stage D (character DNA, if applicable): ~$2-3
- Stage F-G code: ~30 min copy-paste-edit from StarBot's index.js
- Stage H QA: 1-2 days of iteration

**Total bootstrap cost per new bot: ~1-3 days of work + ~$10-20 in Sonnet API.**

---

## Part 3: Hard Safety Rules

1. **Snapshot tests are mandatory.** Any commit that breaks an existing brief-snapshot test fails CI. No exceptions.
2. **One path migration per commit.** No bundled refactors. `git revert <sha>` must roll back exactly one path's migration.
3. **`paths/legacy/` keeps the old file for every migrated path** until 30 days of clean production renders confirm parity. After 30 days the legacy file can be removed in a cleanup commit.
4. **Brief text parity is the gating check, not visual render parity.** If brief text matches exactly, Flux output is byte-identical (Flux + same seed + same prompt = same image). Use visual A/B only when brief text has expected differences (e.g. cozy after slim-pool reseed).
5. **No archetype refactoring during path migration.** If a path needs a new archetype variant, finish the existing migrations first, then propose the archetype change in a separate cycle. Migration phase is for executing the design, not redesigning.
6. **No bot 2 (DragonBot etc.) until all StarBot finished paths are migrated and producing identical renders to pre-refactor.** Bot-portability proof has to wait until StarBot is proven.
7. **No "canonical-LITE" hidden decisions.** Every path's archetype is declared explicitly in the path file. If the brief feels over-stuffed or under-stuffed for a path, the fix is to either (a) tune the archetype's template, (b) propose a new archetype variant in a separate cycle, or (c) reshape the path's pool. Never silently drop axes.
8. **Update the playbook as lessons emerge.** Per `memory/feedback_playbook_first.md`: every round / every migration / every new pattern / every hard rule discovered → playbook gets updated in the same commit. Lessons that live only in chat die on auto-compact.

---

## Estimated Effort

| Phase | Effort | Gate |
|---|---|---|
| 0 — Baseline & snapshot | 2-3h | Snapshots committed, jest test green |
| 1 — Build shared lib (no path edits) | 3-4h | Unit tests pass on composer |
| 2 — First path parity test (cosmic-vista) | 2h | Brief-text byte-identical to snapshot; Kevin signs off |
| 3 — Migrate 8 more finished paths | 6-8h (with QA pauses) | Each path's snapshot test green; Kevin sign-off per path |
| 4 — Migrate 9 unfinished paths | 1-2 days | Each path 3 consecutive 4.5+/5 batches; Kevin sign-off |
| 5 — Playbook update | 1-2h | Playbook reflects current architecture |
| 6 — DragonBot proof | 1 day (separate session) | DragonBot ships with no lib changes |

**Total for StarBot full migration: ~2-3 working days with QA pauses.** Cross-bot proof: +1 day.

---

## Active state tracking

### Path migration status (as of plan lock 2026-05-12)

| Path | Archetype | Current state | Migration phase |
|---|---|---|---|
| alien-city | OUTDOOR_CITY | ✅ MIGRATED 2026-05-12 — composer-driven, reused ALIEN_CITIES (200 slim, no reseed needed), no conditional drama declared (city carries its own drama via busy-metropolis language); Kevin: "these are good" | Phase 3 #4 DONE |
| female-explorer | CHARACTER | hand-written brief, MEDIUM-shape pool (shared ALIEN_PLANET_BIOME at 42w), full canonical, no conditional drama | Phase 3 #7 |
| male-explorer | CHARACTER | same as female, recipe-transferred | Phase 3 #8 |
| megastructure | MEGASTRUCTURE archetype | ✅ MIGRATED 2026-05-12 — PIVOTED from "post-planetary megastructure" to "iconic cyberpunk building in bustling sci-fi city". Anime medium + flux-1.1-pro-ultra. Pool reseeded with cyberpunk DNA (sexy android holos + neon + flight traffic baked in). Brief mandates foreground-anchor-first + no romantic couples + no silhouette wording. Kevin: "these are good" | Phase 3 #5 DONE |
| space-opera | SPACE_OPERA (created + DISABLED) | ❌ REMOVED 2026-05-12 — composer + archetype + iconic-silhouette pool wired up, but Flux cannot reliably render sci-fi spaceships (output drifts to abstract orb/blob, modern-naval carrier-coded, or steampunk regardless of pool cleanup and brief admonitions). Path retired from rotation. SPACE_OPERA archetype + multi-pool conditional layer + composer wiring preserved in case future Flux release renders ships better. | Phase 3 #6 REMOVED |
| cosmic-oracle | CHARACTER | ✅ MIGRATED 2026-05-12 — composer-driven, full CHARACTER archetype (7 univ + 2 bot + 3 path + 1 conditional), anchor_scale range filter, surreal-positive reframe (no fatalism, dreamlike-impossible WONDER); Kevin: "these are good" | Phase 3 #3 DONE |
| cosmic-vista | PURE_COSMOS | ✅ MIGRATED 2026-05-12 — composer-driven, 9-line declaration; Kevin signed off "looks just as good" | Phase 2 DONE |
| real-space | PHOTOREAL_ASTRO | ✅ MIGRATED 2026-05-12 — composer-driven, slim 30-entry MVP pool (avg 19.6w), full canonical axes (6 universal + 1 bot + 1 path + 1 conditional); Kevin signed off "these are better"; needs 30→200 scale-up | Phase 3 #2 DONE (MVP) |
| cozy-sci-fi-interior | INDOOR_INTIMATE | hand-written brief, FAT pool (400 entries @ 46w — needs reseeding slim), canonical-LITE, cozy_moment conditional + framing modes | Phase 3 #9 (pool reseed first) |
| alien-landscape | OUTDOOR_LANDSCAPE | hand-written brief, MEDIUM-shape pool (shared ALIEN_PLANET_BIOME at 42w), full canonical, no conditional drama, no bespoke pool | Phase 4 |
| dune-landscape | OUTDOOR_LANDSCAPE | legacy 3-pool flat design, no canonical axes wired | Phase 4 |
| aliens-architecture | OUTDOOR_CITY | legacy 3-pool flat design | Phase 4 |
| starwars-landscape | OUTDOOR_LANDSCAPE | legacy 3-pool flat design | Phase 4 |
| guardians-architecture | OUTDOOR_CITY | legacy 3-pool flat design | Phase 4 |
| mass-effect-architecture | OUTDOOR_CITY | legacy 3-pool flat design | Phase 4 |
| halo-landscape | OUTDOOR_LANDSCAPE | legacy 3-pool flat design | Phase 4 |
| star-trek-landscape | OUTDOOR_LANDSCAPE | legacy 3-pool flat design | Phase 4 |
| starcraft-landscape | OUTDOOR_LANDSCAPE | legacy 3-pool flat design | Phase 4 |

### Universal-pool sizes (post-this-session)

| Pool | Size | Avg words | Notes |
|---|---|---|---|
| story_beats | 91 | ~25 | Sonnet exhausted theme around 95 (target was 100) |
| composition_frame | 50 | ~25 | Could potentially scale to 100 if needed |
| scale_provers | 50 | ~25 | Could scale to 100 |
| emotional_dna | 47 | ~25 | Sonnet exhausted around 50 |
| weather_particulate | 198 | ~20 | Big after this session's expansion |
| lighting | 200 | ~25 | At target |
| anchor_scale | 4 | label-only | Intentionally tiny (TINY/SMALL/MEDIUM/LARGE) |

### Bot-level pools (StarBot)

| Pool | Size | Notes |
|---|---|---|
| starbot_anchor_entity | ? | Need to re-audit |
| alien_sky_layer | 30 | Could scale to 100 |
| surprise_element | 118 | Sonnet exhausted theme at ~120 |
| architecture_style | ? | Need to re-audit |

### Path-level bespoke pools (StarBot)

| Pool | Path | Size | Avg words | Shape |
|---|---|---|---|---|
| alien_cities | alien-city | 200 | 24 | SLIM ✓ |
| megastructure_setting | megastructure | 200 | 23 | SLIM ✓ |
| space_opera_ships | space-opera | 199 | 27 | SLIM ✓ |
| cosmic_oracle_locations | cosmic-oracle | 200 | 21 | SLIM ✓ |
| cosmic_oracle_characters | cosmic-oracle | 200 | 24 | SLIM ✓ |
| cosmic_oracle_actions | cosmic-oracle | 200 | ~20 | SLIM ✓ |
| cosmic_phenomena | cosmic-vista | 200 | 21 | SLIM ✓ |
| real_space_subjects | real-space | 400 | ~130 | FAT (exception, by design) ✓ |
| cozy_sci_fi_interiors | cozy-sci-fi-interior | 400 | 46 | MEDIUM ❌ needs reseed slim |
| alien_planet_biome | (shared explorers + alien-landscape) | 200 | 42 | MEDIUM ❌ should be slim |

### Conditional drama pools

| Pool | Used by | Size | Gate |
|---|---|---|---|
| battle_dynamics | space-opera | ~50 | 60% |
| ritual_moment | cosmic-oracle | 25 | 40% |
| cosmic_event | cosmic-vista, real-space | 100 | 40% / 35% |
| cozy_moment | cozy-sci-fi-interior | 200 | 40% |

---

## When you (Claude) resume this work after a context compact

1. **Read this entire file first.**
2. **Then re-read** `BOT_SCENE_QUALITY_PLAYBOOK.md` for the cross-bot rules and the per-path iteration log.
3. **Then re-read** `memory/feedback_playbook_first.md` for the meta-rule (always check playbook first).
4. Check the active state table above to see which phase we're in.
5. Check git log for completed migration commits since plan lock.
6. Re-audit pool sizes with the audit script in `/tmp/audit-pools.js` (recreate from this file if missing).
7. **Don't propose architectural changes.** This plan is locked. If something needs to change, surface it as a question before changing course.
8. **Don't claim "finished" on a path** until its parity snapshot test passes AND Kevin signs off.

---

*End of plan. Last updated: 2026-05-12 plan-lock. Next update should be after Phase 0 completes.*
