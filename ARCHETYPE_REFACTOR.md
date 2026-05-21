# Archetype Refactor — 2026-05-21

## What changed

Bot archetypes and templates have been **split out of two giant shared files into per-bot files**.

### Before
```
scripts/lib/
  archetypes.js              ← 132 archetype defs in one file (2,123 lines)
  archetype-templates.js     ← 131 template fns in one file (14,263 lines)
  brief-composer.js          ← imports both
```

**Problem**: with multiple Claude agents working in parallel on different bots, these two files became collision hot-spots. When FaeBot agent and YumBot agent and EarthBot agent all committed changes, the file kept getting stomped — entries got wiped, templates lost mid-iteration, broken paths.

### After
```
scripts/bots/<bot>/
  archetypes.js              ← THIS bot's archetypes (e.g., earthbot/archetypes.js has 4 entries)
  archetype-templates.js     ← THIS bot's template fns
  index.js, paths/, pools.js, seeds/    ← unchanged

scripts/lib/
  archetypeRegistry.js       ← NEW: auto-discovers per-bot files, merges, errors on collision
  archetypes.js              ← thin re-export wrapping registry (3 lines of logic)
  archetype-templates.js     ← thin re-export wrapping registry (3 lines of logic)
  brief-composer.js          ← UNCHANGED (still requires the central re-exports)
  _orphan-archetypes.js      ← 3 orphan archetypes preserved (no paths reference them)
  _orphan-archetype-templates.js
```

### Cross-bot contention is now structurally impossible

Each bot's archetypes live in `scripts/bots/<bot>/archetypes.js` alongside that bot's path files, pool definitions, and seeds. Two agents working on different bots never touch the same file — no more stomps.

If two bots accidentally define the same archetype name, the registry throws a **clear collision error at boot** so it's caught immediately, not silently.

## How it works

### The registry (`scripts/lib/archetypeRegistry.js`)

At boot, scans `scripts/bots/*/archetypes.js` and `scripts/bots/*/archetype-templates.js`, merges every per-bot module export into one big object. Detects duplicate names across bots and throws.

### Backwards compatibility

`brief-composer.js` and any other importer continues to use:
```js
const { ARCHETYPES } = require('./archetypes');
const TEMPLATES = require('./archetype-templates');
```

These central files are now thin re-exports of the registry — `ARCHETYPES` and `TEMPLATES` still resolve to the same merged objects. **Zero code changes outside the two re-export files.**

### File ownership

Each archetype belongs to exactly one bot (verified — 0 multi-owner archetypes). Bot ownership map:

| Bot | Count | Notable |
|---|---|---|
| chibibot | 19 | biggest |
| dragonbot | 15 | includes legacy unprefixed names (ARCANE_HALLS, DRAGON_SCENE, etc) |
| bloombot | 15 | |
| dinobot | 13 | |
| pixelbot | 10 | |
| starbot | 9 | includes legacy unprefixed names (PURE_COSMOS, MEGASTRUCTURE, etc) |
| gothbot | 9 | |
| mechbot | 9 | |
| steambot | 9 | |
| yumbot | 8 | |
| faebot | 5 | |
| toybot | 4 | |
| earthbot | 4 | |
| **Orphans** | 3 | COZY_INTERIOR, TOYBOT_TOY_LANDSCAPE, CHIBIBOT_CUTE_FOOD — preserved in `_orphan-archetypes.js` |

## How to add a new archetype going forward

1. **Pick the owning bot** — `scripts/bots/<botname>/`
2. **Add the archetype** to that bot's `archetypes.js`:
   ```js
   module.exports = {
     // existing entries...
     MYBOT_NEW_PATH: {
       description: '...',
       slots: { path: ['subject', 'lighting', ...] },
       pickN: {},
       conditionalLayer: null,
       framingModes: null,
       anchorScaleRange: null,
     },
   };
   ```
3. **Add the matching template** to that bot's `archetype-templates.js`:
   ```js
   module.exports = {
     // existing entries...
     MYBOT_NEW_PATH: ({ slots, sharedDNA, vibeDirective }) => {
       const { subject, lighting, /* ... */ } = slots;
       return `... brief text ...`;
     },
   };
   ```
4. **Reference from a path file**:
   ```js
   // scripts/bots/mybot/paths/new-path.js
   module.exports = {
     archetype: 'MYBOT_NEW_PATH',
     pools: { subject: 'MYBOT_SUBJECT_POOL', /* ... */ },
   };
   ```

That's it. Nothing in `scripts/lib/` needs to change.

## Validation

Smoke-tested by composing a brief for every bot with axis-system paths:

| Bot | Test Path | Brief size | Status |
|---|---|---|---|
| bloombot | landscape | 2,019 chars | ✓ |
| chibibot | rainy-interior | 8,817 chars | ✓ |
| dinobot | dino-portrait | 9,049 chars | ✓ |
| dragonbot | landscape | 7,534 chars | ✓ |
| earthbot | epic-vista | 12,460 chars | ✓ |
| faebot | forest-fairy-scene | 6,702 chars | ✓ |
| gothbot | dark-landscape | 9,547 chars | ✓ |
| mechbot | humanoid-robots | 10,754 chars | ✓ |
| pixelbot | cozy-rpg-town | 5,181 chars | ✓ |
| starbot | cosmic-vista | 5,020 chars | ✓ |
| steambot | steampunk-scene | 4,697 chars | ✓ |
| toybot | barbie-scene | 8,192 chars | ✓ |
| yumbot | floral-garden-cup | 5,191 chars | ✓ |

**13 of 13 bots compose briefs successfully via the new registry.**

## Known issues (pre-existing, not introduced by refactor)

- **GOTHBOT_MONSTER_PROWL** archetype exists but no template — the template was lost in a previous shared-file stomp before this refactor. The path `scripts/bots/gothbot/paths/monster-prowl.js` will fail to render until the template is restored. This is exactly the kind of bug this refactor prevents going forward.

## For agents continuing work

**If you were editing `scripts/lib/archetypes.js` or `scripts/lib/archetype-templates.js`**:
- Your archetype/template is now in `scripts/bots/<yourbot>/archetypes.js` and `scripts/bots/<yourbot>/archetype-templates.js`
- All entries preserved — same names, same content, same shape
- Edit them in the per-bot files going forward
- The central files are now off-limits (have a "DO NOT ADD HERE" warning)

**If you're adding new archetypes**: see "How to add a new archetype going forward" above.

**If you had uncommitted edits to the central files before the refactor**: your changes were **not preserved** if you hadn't committed them. Re-apply to the appropriate per-bot file.
