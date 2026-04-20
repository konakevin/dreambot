# Migrate a bot to the new engine

This checklist is how every bot (except VenusBot, which is the exemplar) moves
from the old `scripts/generate-bot-dreams.js` + `bot_seeds` system into the new
`scripts/bots/<name>/` + `scripts/lib/botEngine.js` architecture.

**Follow it top to bottom.** Skipping steps breaks things — specifically,
skipping the atomic cutover commit causes double-posts, and skipping the
smoke test gate ships bad renders.

## Preconditions

- [ ] Phase 1 is merged (engine + VenusBot migrated + producing cleanly AT SCALE over 2+ weeks)
- [ ] `bot_dedup` + `bot_run_log` tables exist (migration 123)
- [ ] Bot's account exists in `users` table (username matches what we'll use)
- [ ] You've reviewed `scripts/bots/venusbot/` to understand the pattern

---

## The layered-axis architecture (read first)

Every bot's renders are a combination of 4 LAYERS. Get these right and the
bot feels consistent; get them wrong and you get dream-drift or same-y batches.

### Layer 1 — Shared DNA (`rollSharedDNA`)

Rolled ONCE per render. These axes define "who she is and what this render
FEELS like" independent of what she's doing. Passed to every path.

Typical shared axes (every bot has these or analogs):

| Axis | Size | Sonnet-seeded? | Dedup window | Notes |
|---|---|---|---|---|
| character / identity | 20-30 | YES | 5 days | each entry is a paragraph anchoring "who she is" |
| skin / tone / color | 20-25 | hand-curated | 5 days | Main diversity axis. Explicitly name every ethnicity + alien skin. |
| body type / silhouette | 10-15 | hand-curated | 5 days | Mix small/tall/curvy/thick/athletic/bombshell. Ban runway-thin default. |
| hair | 8-12 | hand-curated | — | Small pool is fine, low visibility. |
| eyes | 7-10 | hand-curated | — | Small pool OK. |
| glow / accent color | 10 | hand-curated | 3 days | Dominant light color of the render. |
| scene palette | 15-20 | hand-curated | 7 days | Overall image color mood. CRUCIAL for avoiding cluster on teal/orange. |
| internal exposure / quirk | 10-15 | hand-curated | — | Path-agnostic signature element. |
| wildcard | 30-50 | Sonnet-seeded | — | Surreal "look twice" element. |

### Layer 2 — Path-specific axes (rolled inside `buildBrief`)

Each path rolls its own additional axes. These define "what she's doing in
THIS render." The engine provides the picker; the path decides what to pull.

Typical path-specific axes:

| Path type | Typical axes |
|---|---|
| closeup / portrait | pose (50, Sonnet) + expression (50, Sonnet) + accent (50, Sonnet) + environment (50, Sonnet) |
| full-body / action | action-pose (50, Sonnet) + narrative moment (50, Sonnet, object-shaped `{kind,text}`) + any character-feature axis |
| seduction / lure | seduction moment (50, Sonnet) + any character-feature axis |
| fashion / editorial | fashion moment (30, Sonnet) + makeup (25, Sonnet, dedup window 5) |
| stare / eye-contact | stare moment (30, Sonnet, dedup window 5) |
| robot / variant | variant-axis (human-touch, 30, Sonnet) + sub-flavor roulette from other paths |

### Layer 3 — Universal prose blocks (`shared-blocks.js`)

Text blocks injected verbatim into every brief. These encode non-negotiable
rules. Typical blocks per bot:

- `REQUIRED_ELEMENTS_BLOCK` — bot-identity / body rules (e.g., "50%+ mechanical")
- `COVERAGE_BLOCK` or rules embedded in REQUIRED — coverage / rated-R constraints
- `SOLO_COMPOSITION_BLOCK` — character-centric bots only (solo framing)
- `HOT_AS_HELL_BLOCK` or tone-lock block — keeps the bot's visual signature
- `NO_POSING_BLOCK` (or embedded in HOT_AS_HELL) — candid-not-posed language
- `SURREAL_EFFECTS_BLOCK` or atmosphere block — visual texture layer
- Any path-specific override blocks (e.g., `ROBOT_FIRST_BLOCK` for 90/10)

### Layer 4 — Flux prompt wrapping (verbatim)

`promptPrefix` + `promptSuffix` are applied to EVERY render regardless of
path. These anchor the visual style Flux produces. Non-rolled, non-generated.
Copy from a "golden" existing render and tune.

---

## Sizing rules (how to decide axis size + generation method)

| Axis visibility | Size | Method | Dedup? |
|---|---|---|---|
| Rolled in every render, main diversity signal | 20-50 | Sonnet-seeded if ≥25, else hand-curated | YES, window 5-7 days |
| Rolled in every render, supporting detail | 8-15 | hand-curated | sometimes |
| Rolled in every render, subtle flavor | 5-10 | hand-curated | no |
| Rolled only for specific path | 30-50 | Sonnet-seeded if the path has a distinct "moment pool" | YES if dominant, NO if ancillary |

**Rule of thumb: if you can hand-list 20 good entries in 10 minutes, hand-curate.
If you can't, Sonnet-generate with batched intra-pool dedup.**

---

## 1. Audit the old bot

- [ ] Read `scripts/generate-bot-dreams.js` `BOTS.<botname>` config
  - Note: `mediums`, `excludeVibes`, `pinVibes` (if any), `banPhrases` (if any)
- [ ] Read `scripts/lib/seed-generator.js` `BOT_SEEDS.<botname>.strategies`
  - Each strategy corresponds to ONE path in the new system
  - Note the `category` naming, `prompt` text, `extractPrompt`, `separateDedup` / `continueDedup`
  - `continueDedup` entries collapse into the same path as their base — don't duplicate
- [ ] Pull recent posts from DB to understand actual output:
  ```sql
  SELECT image_url, ai_prompt, dream_medium, posted_at
  FROM uploads
  WHERE user_id = (SELECT id FROM users WHERE username = '<botname>')
  ORDER BY posted_at DESC LIMIT 20;
  ```
- [ ] Look at 10-15 of the images. What makes this bot feel like itself?
  Character? Setting? Tone? Unique visual signature?

## 2. Map old strategies → new paths

Build a table in your head (or in the PR description):

| Old strategy | New path filename | Character DNA? | Sonnet-seeded pool needed? |
|---|---|---|---|
| `botname_genre` | `paths/genre.js` | Y/N | Y/N |
| `botname_landscape` | `paths/landscape.js` | N | Y (maybe) |

Rules:
- Path filename is kebab-case, matches `bot.paths` entry exactly
- `extractPrompt` axes → hand-curated pools in `pools.js` OR Sonnet-seeded via `seeds/*.json`
  - If `extractPrompt` gets "skin tone, pose, feature" → roll `skin` + `pose` + `feature` axes via picker
  - If the prompt is mostly one free-form scene description → that's a candidate for a Sonnet-authored seed pool

## 3. Scaffold the bot directory

```
scripts/bots/<botname>/
  index.js                       # contract object (required)
  shared-blocks.js               # optional — REQUIRED_ELEMENTS, HOT_AS_HELL, etc.
  pools.js                       # hand-curated axis pools
  paths/<path>.js                # one per bot.paths entry
  seeds/*.json                   # optional — Sonnet-authored pools
  README.md                      # short description + list of paths + seeds
scripts/gen-seeds/<botname>/
  gen-<seed>.js                  # one per seed file in bots/<botname>/seeds/
```

**Naming conventions (commit these to muscle memory):**
- Bot directory: lowercase bot username matching DB
- Path files: kebab-case (`cyborg-fashion.js`, not `cyborg_fashion.js`)
- `bot.paths` entries match path filenames exactly (`'cyborg-fashion'`)
- Seed JSONs: snake_case, no bot prefix (directory is the namespace)
- Seed generators: `gen-<matches-seed-filename>.js` (`gen-stare-moments.js` → `seeds/stare_moments.json`)
- Workflow file: `.github/workflows/<botname>.yml` — bare bot name, no prefix

**File size heuristic:** `pools.js` + `shared-blocks.js` split when either would
exceed 200 lines. For tiny bots, merge both into `pools.js` and skip `shared-blocks.js`.

## 4. Fill out `index.js` contract

Reference `scripts/bots/venusbot/index.js` for shape. Required:

- `username` — must match `users.username`
- `displayName` — human-readable
- `promptPrefix` / `promptSuffix` — style tags wrapped around every Flux prompt (copy from old system as starting point, iterate)
- **Medium pattern** — pick ONE:
  - `defaultMedium: 'surreal'` (single, locked — VenusBot)
  - `mediums: ['photography', 'canvas', ...]` (flat list, weighted via repetition — most bots)
  - `mediumByPath: { lego: 'lego', retro: ['pixels', 'pixels', 'animation'] }` (path-specific pin, single or weighted array)
- `vibes: [...]` — invert the old `excludeVibes` to get this list; alternatively explicit allow-list
- `vibesByMedium: { anime: ['enchanted', 'cinematic'] }` — optional per-medium vibe pin (ports old `pinVibes`)
- `paths: [...]` — matches your `paths/*.js` files
- `pathWeights: { hero: 2 }` — optional, unlisted paths default to 1
- `bannedPhrases: ['phrase']` — optional, case-insensitive match on Sonnet output; retries up to 2x then fails
- `rollSharedDNA({ vibeKey, picker })` — optional; returns axes SHARED across all paths
- `buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker })` — **required**; dispatches to `paths/<path>.js`
- `caption({ sharedDNA, path })` — optional caption template

## 5. Write `rollSharedDNA`

Roll ONLY axes used by multiple paths. Per-path axes belong inside `buildBrief`.

Almost every bot should roll:
- `scenePalette` — overall image color mood (from shared SCENE_PALETTES)
- `colorPalette` — secondary lighting (from VIBE_COLOR map)

Character-centric bots also roll:
- `skin`, `bodyType`, `hair`, `eyes`, etc. (see VenusBot)
- `characterBase` — if you've got a Sonnet-authored character-identity pool

Scene-centric bots (EarthBot, BloomBot) may return very little or just scene/atmosphere.

## 6. Write `buildBrief` per path

Each `paths/<name>.js` is a function `({ sharedDNA, vibeDirective, vibeKey, picker }) => string`.

Template:

```js
const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // Roll path-specific axes via picker
  const axis1 = picker.pickWithRecency(pools.AXIS_1, 'axis1');
  const axis2 = picker.pick(pools.AXIS_2);

  return `You are a <role> writing <path-type> scenes for <BotName>.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases)...

<character / intent blocks>

${blocks.REQUIRED_ELEMENTS_BLOCK}  // if the bot has coverage rules

<path-specific axes: ${axis1}, ${axis2}>

<framing rules>

<mood: ${vibeDirective.slice(0, 250)}>

Output ONLY the scene description, 60-90 words, no preamble, no quotes.`;
};
```

This is where bot quality is made. Reference `scripts/bots/venusbot/paths/*` for
style. Expect 3-5 rounds of render-review-adjust per path.

## 7. Generate Sonnet-authored seed pools (if any paths need them)

For paths needing long scene-description seed pools (e.g., `stare_moments`,
`cyborg_fashion_moments`), write a generator script:

```
scripts/gen-seeds/<botname>/gen-<seed>.js
```

Pattern: meta-prompt + Sonnet call + JSON write. Model on
`scripts/gen-seeds/venusbot/gen-stare-moments.js`.

Run it:
```bash
node scripts/gen-seeds/<botname>/gen-<seed>.js
# writes to scripts/bots/<botname>/seeds/<seed>.json
```

Inspect output manually. Regenerate if tone's off.

## 8. Dev smoke test (GATE — requires Kevin approval)

```bash
node scripts/iter-bot.js --bot <botname> --count 10 --mode random --label migrate-smoke
```

This renders 10 dreams to `/tmp/<botname>-migrate-smoke/` without posting.

Kevin reviews all 10. Does NOT proceed to cutover without thumbs-up. Iterate
on briefs/pools as needed; re-render until approved.

**What to look for:**
- Every path represented? (random should sample all 5-8 paths)
- Body / character diversity?
- Scene-setting diversity (not all in the same location)?
- Color palette diversity (not all teal/orange)?
- Brand consistency — still feels like THIS bot?
- Anything embarrassing or broken?

## 9. Cross-path diversity check

```bash
node scripts/iter-bot.js --bot <botname> --count 20 --mode random --label diversity-check
```

20 renders. Look for:
- Path-clustering (all seductions, no landscapes)
- Same-subject-everywhere (same cyborg / same flower / same deity)
- Color clustering

Fix by expanding pools or bumping recency windows.

## 10. Atomic cutover commit

**All in ONE commit:**

1. Add `.github/workflows/<botname>.yml` — copy structure from `venusbot.yml`,
   adjust cron schedule (see "Cron staggering" below)
2. Remove `<botname>: { ... }` entry from `scripts/generate-bot-dreams.js` `BOTS` map
3. Remove `<botname>` from the bash array in `.github/workflows/bot-dreams.yml`

Commit message: `migrate <botname> to new engine`

**Why atomic:** if the new workflow lands before the old one is edited, the bot
double-posts. If the old is edited first, there's a window with no posts. Both
edits MUST be in the same commit.

### Cron staggering

Don't pile all bots on the same UTC hours. Current slots in use:
- Old system: `0 6` + `0 14` UTC (all un-migrated bots)
- VenusBot: `30 10` + `30 22` UTC

Pick two 12-hour-apart slots at minutes ≠ :00 (avoid old herd) and ≠ :30 (avoid VenusBot).
E.g., `15 11 * * *` + `15 23 * * *` for the second bot.

The workflow includes a random 0-4hr sleep, so exact slots matter less, but still
stagger to keep Replicate load predictable.

## 11. Post-cutover verification (24h)

- [ ] Trigger new workflow via GitHub Actions `workflow_dispatch` → confirm 1 post lands in-app
- [ ] Check DB: `SELECT * FROM bot_run_log WHERE bot_name = '<botname>' ORDER BY created_at DESC LIMIT 5`
  - Expect one `ok` row from the dispatch
- [ ] Check DB: `SELECT * FROM bot_dedup WHERE bot_name = '<botname>' ORDER BY picked_at DESC LIMIT 20`
  - Expect rows for each axis the bot rolls
- [ ] Wait for next scheduled cron slot; confirm second post
- [ ] Confirm no double-posts (old workflow doesn't accidentally still run this bot)

## 12. Update docs + roster

- [ ] Add the bot to any team-facing docs that list bots
- [ ] If you discovered any shared patterns during the migration (a block
      used by 3+ bots), extract it to `scripts/lib/sharedBlocks.js` in a
      follow-up commit (don't bundle with the migration itself)

---

## Per-bot complexity reference

| Complexity tier | Bots in this tier | Estimated time |
|---|---|---|
| Low (2 paths, no character DNA) | DragonBot, EarthBot, GlowBot | 3-4 hrs |
| Mid (3-5 paths, mixed character) | CuddleBot, SteamBot, ArcadeBot, TinyBot, BloomBot, InkBot, TitanBot, CoquetteBot, AnimalBot | 6-8 hrs |
| High (5+ paths, complex DNA) | MangaBot, GothBot, ToyBot, GlamBot | 1-1.5 sessions |
| Very High (7-8 paths, bespoke axes) | SirenBot (gender-split), StarBot | 2 sessions |
| Thinking bots (text+image compositing) | HumanBot, MuseBot | Schedule LAST — they use the `generateTextContent` + `postProcess` hooks |

## Common pitfalls

- **Forgetting to roll `scenePalette`** — batches cluster on teal/orange default. Always roll this.
- **Too-literal ports of old prompts** — old prompts were written for a different engine. Treat them as starting points, not final briefs.
- **Over-specifying materials / scenes** — Sonnet/Flux perform better with room to interpret. "Translucent torso with glowing core" > "chrome ribcage with 12 visible ribs and a 6-inch reactor in the sternum."
- **Picker axis names collide across paths** — use distinct axis names (`stare_moment`, not just `moment`) so dedup is path-scoped correctly.
- **Forgetting to commit old-runner removal** — if the bot stays in `generate-bot-dreams.js` after the new workflow lands, double-posts. Atomic commit only.
- **Running `iter-bot --post` without reviewing output first** — if the brief is broken, you'll post 10 bad dreams AND commit dedup picks. Always review `/tmp/<bot>-<label>/` first.

## Architectural rules (do not violate)

- **Never touch** `supabase/functions/generate-dream/`, `nightly-dreams/`, `scripts/nightly-dreams.js`. User-dream path is isolated.
- **Never mix** migrations in one commit (one bot per PR).
- **Never skip** the smoke test gate.
- **Never delete** the old system files until ALL bots have migrated AND run cleanly for 2+ weeks.
- **Never commit** an atomic cutover without a manual `workflow_dispatch` confirmation that the new workflow actually works.
