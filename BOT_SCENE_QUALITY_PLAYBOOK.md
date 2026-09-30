# Bot Scene Quality Playbook

The canonical brain for the image-gen BOTS (`scripts/bots/<bot>/`, `scripts/lib/botEngine.js`, `run-bot.js`).
Nightly user dreams are a different engine and are NOT covered here.

**Read this whole file before any bot work** (config, paths, pools, seeds, archetypes, briefs, or answering how a
bot works). It is short on purpose. Rewritten from scratch 2026-09-29; every rule was re-checked against the code
that day.

**Where the rest lives**
- `BOT_SCENE_QUALITY_PLAYBOOK_ARCHIVE.md`: the previous 6,007-line playbook, frozen verbatim. It holds every dated
  war story, round log, score table and canonical migration walkthrough. Code comments that cite "playbook lesson
  N", "playbook line N", "SteamBot lessons", "the DragonBot 4-character-path migration recipe", "the failure-mode
  catalog" and similar point THERE. Read it for depth on one topic; never treat it as current.
- `BOTS.md`: engine architecture (render pipeline, picker, module contract, iter-bot flags).
- `/bot-paths` skill: the end-to-end path-building pipeline. `/reseed` skill + `RESEED_STATUS.md`: seed-pool repair.
- `ALPHABOT.md`: the private proving ground. `NEW_PATH_POOL_SCALING.md`: scaling pools to production depth.

**How to keep this file lean (the rule that makes it last)**
- A new lesson is ONE bullet in the right section: a rule, or `symptom → cause → fix`, tagged `(bot/path, date)`.
- If a rule changes, EDIT the existing bullet. Never add a newer bullet below an older one that contradicts it.
- Round logs, score tables and investigation narratives go in the archive under a dated heading, with at most a
  one-line pointer here.
- Before writing a bullet that names a file, script, path or config key, confirm it exists.

---

## 1. The bar

### 1.1 THE MOTTO (Kevin, 2026-09-22; outranks every rubric below)
Every render must be **playful, adventurous, vivid, beautiful, clever**. A clean, on-brief but sober, plain or merely
competent render is a MISS. "No defects" is never a pass.
- VIVID is literal: saturated, committed colour and dramatic light. Monochrome is a miss.
- CLEVER: one charm detail you find on a second look.
- ADVENTUROUS: a mid-action story beat beats a parked tableau.
- PLAYFUL is the house tone. Sober documentary realism is the enemy everywhere except EarthBot.
- A new path, bucket or pool rewrite has two acceptable outcomes: show something never seen, or redress something
  familiar as something more interesting. Of every pool entry ask "obvious version or surprising one?".

### 1.2 North Star
Every render is a 10/10 poster-worthy frame: would you put it on your wall, save it, scroll back to it? "Pretty but
empty" fails; "I can see what's happening, and it's part of a bigger world" passes. A bot's feed reads like pages of
one picture book: each frame distinct, on-brand, with a candid moment to observe. Every render delivers:
1. a visible story readable in 2 seconds;
2. layers and depth (foreground / mid / deep / sky, each carrying information);
3. an entity the eye lands on and follows;
4. genre-coded specificity (it could not have come from another bot);
5. material and atmospheric richness.

### 1.3 The 8 components of a memorable scene
The EPIC-scene rubric (StarBot/DragonBot origin). Cozy and cute bots (ChibiBot, FarmBot, TinyBot, YumBot) don't need
a monumental anchor; for them, read it through the motto.
1. **Monumental anchor**: one thing that's impossibly large; everything else frames it.
2. **Multi-tier composition**: 4+ visible depth layers (foreground / midground / deep distance / sky).
3. **Scale provers**: small things that prove the big things are massive (lit windows, tiny ships, figures-as-ants,
   fog at mid-height).
4. **Narrative beat**: something is happening (descent, arrival, awakening, witnessing).
5. **Readable focus**: the eye knows where to land first, then follows a clear visual path.
6. **Material truth**: surfaces have texture, weight, wear; not generic "smooth chrome".
7. **Light drama**: strong directional source, atmospheric volumetrics.
8. **Emotional DNA**: awe, dread, wonder, melancholy, picked deliberately, not by accident.

### 1.4 Standing bar rules
- **A bot's brand = its WORST seed × that seed's roll probability over months.** "Looked great in dev, degrades in
  the feed" is not decay: dev samples the best combos, automation rolls the whole combinatorial tail. Harden so the
  worst combo is acceptable, and audit pools as a SET, never by sampling.
- **Every scene needs a readable HERO**: a creature, a named landmark or structure, or a story moment. Glow, surf,
  aurora, mist and texture are the STAGE, never the subject.
- **DULLNESS is a defect class.** Every sky entry carries a feature (big soft moon, cotton puffs, stars, aurora, sun
  halo); no bleached flat light; no row of equal objects as hero; one charm detail per hero entry. Sweep
  `overcast sheet|clear dome|featureless|flat .*sky|bleached|minimal shadow|a row of` before round 0.
- **"Pretty but boring" is almost always an object PORTRAIT.** Add a verb-led story-beat axis, a layered-world axis
  and a verb-led cast, and delete any "hero-shot / catalog / fills-the-frame" line first.
- **Bot vocabulary is sacred.** Every template, recipe and example speaks the bot's own lineage (GothBot: Castlevania /
  Bloodborne / Crimson Peak / Berserk / Burton; DragonBot: LOTR / Skyrim / Witcher / Warcraft / D&D). Fantasy worlds
  keep their OWN aesthetic, never real-world ethnicity labels on fantasy characters.
- **Pop-culture / licensed IP is ALLOWED fleet-wide** (Kevin 2026-09-22). Don't strip it or re-add a ban.
- **Real-world bots (EarthBot, OceanBot, BloomBot macro)**: the bar is "the most magnificent REAL version". The register
  ladder is documentary-restrained → lush-professional-graded (EarthBot today) → maximal-amplifier → hyperreal (banned).
  `hyperreal`, `gallery-print`, "dial to eleven", teal-and-orange grades and surreal chaos push renders CGI. The fix is
  subtraction, not new bans.
- **Identity before pools.** Re-confirm a bot's aesthetic against Kevin's own reference images before the first pool
  is written ("beautiful" is not a spec).
- **Grading.** A beautiful, well-composed image that drifts slightly off-register is ≥3/5; reserve 2/5 for real
  technical failures (warped faces, broken anatomy, no subject, garbled composition). Composition variety is a feature.

---

## 2. Process: from idea to live path

### 2.1 Where work happens
- **All NEW-path development happens on AlphaBot** (private, Kevin-only: never `is_public`, never followers, never a
  `bot_schedules` row). Read `ALPHABOT.md` first. Clone the destination bot's per-path config BYTE-IDENTICAL (medium,
  models, prefixes, polish/chaos/sensory); axis names must not collide with the destination's. Promotion = reverse
  xerox + `scripts/promote-alphabot-renders.js` + a 5-render confirmation batch on the destination.
- **Every test or QA render posts as a SHADOW post**: hidden from the feed, reviewed by Kevin in the app on the bot's
  profile (purple SHADOW badge). Use `iter-bot --post --shadow`, or put the path in `shadowPaths[]`. `--post` alone
  PUBLISHES on a live bot. Never make a /tmp contact sheet the review surface.
- **Non-bot QA** (nightly, Create) goes to Kevin's PRIVATE dreams album, never the public feed.

### 2.2 The pipeline
1. **Design.** Re-read this file. Map the bot's existing paths (core scene, medium/model locks, axes, character vs
   scene lean). Decide reuse vs bespoke pools (default bespoke for identity axes, see §4.5).
2. **Pre-round-0 checks** (cheap, catch most failures before a render):
   - Print the bot's medium fragment and wrapper strings; count their words; find where the scene starts in a real
     `ai_prompt`. A long fragment, or one carrying a MANDATE instead of a style register, means the path needs its own
     medium (§4.4).
   - LAYPERSON CHECK every domain term, the path title and premise nouns, and the bot's own prefix/medium/suffix
     words: if a layperson pictures a different object, ban the word even though it is correct (§5.7).
   - Grep: any token used for two referents; hero-pool nouns diffed against every other axis.
3. **Wire** the path into `pathBuilders` + `shadowPaths[]` (NOT `paths[]`). Generate pools BEFORE the module loads
   them (`pools.js` throws on a missing seed file): gen scripts → run gens → path file → `pools.js` → `index.js`.
4. **Seed each pool to 25** (MVP). Never seed straight to production size.
5. **Dry-run the composed brief** (a ~30-line stub picker over the path builder, no API call; 40-200 rolls are free).
   It catches cross-axis contradictions (hero↔place, camera↔hero, animal↔setting), empty tag slices (a crash, not a
   dull render) and template prose leaking into the prompt.
6. **Wiring check**: `node scripts/audit-bot-pool-wiring.js --bot <bot>`, then confirm by hand that each picked value
   is actually INJECTED into the template and not cancelled by an absolute rule ("sealed in armour" silences
   `${hairstyle}`).
7. **QA rounds** (§2.3) on shadow renders until the bar is met, then Kevin signs off. (Kevin delegated the RESEED
   program's QA gates; new paths still need his sign-off.)
8. **Scale** (§2.4), then **sweep** the scaled pools, then **go live** (§2.5).
- Commit the MVP path design without waiting for the scale-up; the scale-up lands as a follow-up commit.

### 2.3 QA rounds
- A round = ~6 shadow renders from ONE `--count N` process (recency is per process; parallel wrappers repeat entries).
- **View every image**, then diagnose at the SOURCE (§3). Never from the image alone, never from path names.
- **One variable per round.** Multi-variable rounds hide which lever worked.
- **Cap at 3 rounds.** After two visibly bad rounds, the next attempt must be STRUCTURAL (different archetype,
  template or mandate), not "fix one more thing".
- **Render-test ONE path before rolling a pattern to its siblings.** (Eight franchise paths migrated at once all had to
  be reverted, 2026-05-13.) A converged recipe then transfers to siblings with pool swaps in 1-2 rounds.
- **Know the experiment's resolution.** A 1-2 in 6 residual is below what a 6-render round can see (~40 renders per arm
  to separate). 3 renders per arm FORMS a hypothesis; run a ≥6-render confirmation on the winner before shipping a pin
  or law. An observational split is a hypothesis until a one-variable intervention proves it.
- **Never show Kevin a batch a known upstream defect makes unjudgeable** (a bot prefix or template mandate that decides
  the picture regardless of the change). Fix or neutralise that layer first, or don't show the batch.
- **A taste remark is a question, not a change request.** Kevin preferring one render ≠ make every render like it.
- Fix the SPECIFIC cause and keep what worked; never over-revert to a safe-but-lifeless legacy design.
- When iterating on a keeper, anchor on its EXACT prompt and append only the new ask.
- Don't migrate a path whose legacy renders already work.
- Before judging a SUBJECT-pool repair, neutralise every layer that forces composition regardless of entry (bot prefix,
  hero mandate, medium fragment, template hard mandates, output order). With two subject pools, force both entries
  (`scripts/reseed/render-forced-entries.js --force a=… --force b=…`).

### 2.4 Scaling
- The production bar is **100 distinct IDEAS, not 100 entries** (`NEW_PATH_POOL_SCALING.md`). A 200-entry pool holding
  69 ideas delivers 69 distinguishable renders. Subject pools first; modifiers (light, camera, weather) matter less.
  The seed-diversity similarity measure is unreliable: never quote an idea count without its threshold and basis.
- Scale ONLY after sign-off, in APPEND mode, with the SAME recipe. Structural/atomic axes (skin, eyes, hair: 25 each
  is millions of combinations) and iconic-canon axes (~26-50 ceiling) stay small.
- Accept the semantic ceiling. When `--target` stops adding uniques, stop; to go further, SPLIT into sub-category pools.
- **Sweep after every scale-up.** Sonnet re-derives every banned noun at production scale (PixelBot 25 → 7,470
  reintroduced 101 fixed defects). Re-run EVERY register scan on the scaled pool, and a FORMAT-DRIFT scan: if the
  tested pool is ≥80% on the recipe's format marker and the scaled pool <80%, tighten the recipe, truncate to the
  tested entries, regen.
- Concurrency: pool GENERATION is Anthropic-bound, so ~6 parallel gen processes is fine (re-verify every count after:
  a 429 can leave one pool at 25). RENDERS hold DB connections: ≤3 concurrent, gated on `waitForHeadroom` /
  `node scripts/check-pool-headroom.js` (CLAUDE.md hard rule). Never mix the two numbers up.
- Long jobs: run gens in foreground chunks of ~3 pools (grow-to-N is idempotent, reruns resume). Render batches must
  run in the FOREGROUND (Bash timeout 600000); `run_in_background` renders produce nothing.

### 2.5 Go-live
- **Go-live is a faithful xerox**: move the string from `shadowPaths[]` to `paths[]` and change NOTHING about how it
  renders (mediumByPath, modelByPath, vibesByPath, prefixes, chaos/polish/sensory exactly as tested).
- Traps, verify after every flip (module loads, inPaths=true / inShadow=false, chaos/polish match shadow, buildBrief
  composes):
  - `allowSubjectChaosPaths = paths[]` newly enables chaos on the promoted path → add it to `chaos.skipPaths`.
  - If `...<BOT>_SHADOW_PATHS` is spread into skip/allow lists, set `shadowPaths: []` and add strings to `paths[]`
    rather than emptying the const.
  - Bots with `paths: pools.PATHS` / `ALL_PATHS = [...]` promote in that source array. BrickBot: a function-form path
    moved into PATHS must ALSO go into `SKIP_LEGACY_PER_PATH` in the same edit, or `pools.js` throws and the whole
    bot goes down.
- Folding shadow renders into the feed: never flip many shadow rows public with current timestamps. Drip/backdate via
  `scripts/promote-shadow-path.js` (it shuffles before scheduling), touch only visibility + time columns, then check
  the busiest single day and the last-24h count. Or leave them hidden and let the live path post fresh.

### 2.6 Inventing new paths for a bot
Map every current path (an Explore agent) → gap analysis → a tiered idea menu (Tier 1 core-gap vibe-pushers, Tier 2
fresh tone/subject, Tier 3 adjacent, plus a pure-spectacle tier) → Kevin picks → design axes → build per §2.2.

### 2.7 HTML matrix (per-bot model triage)
"Run an HTML matrix on `<bot>`" = `node scripts/qa-bot-model-matrix.js --bot <name>`. Defaults: 1 render per
(path × model), posted as SHADOW posts (hidden, since 2026-09-29; the June/July matrix runs went public), all paths ×
all allowedModels, one process per model. Narrow with `--paths` / `--models`; `--count 3` or `--no-post` only if asked.
Output `/tmp/<bot>-matrix.html`. Never ask Kevin to confirm defaults. In THIS protocol Kevin hearts the BAD cells;
tally them into `modelByPath` bans after he confirms. Outside a protocol where he states their meaning, hearts are
pointers, never ratings: never mine likes to calibrate. The grid groups renders by a `[path]` caption, so a bot whose
caption differs (FarmBot's is `FarmBot › <path>`) won't fill its grid.

### 2.8 Command cheat sheet
```sh
node scripts/iter-bot.js --bot <bot> --mode <path> --count 6 --label "<path> R1" --post --shadow
node scripts/iter-bot.js --bot <bot> --mode <path> --model <model> ...   # force a model
node scripts/audit-bot-pool-wiring.js --bot <bot>
node scripts/gen-<bot>-pool.js --pool <name> --count 25 [--target N] [--dry-run]
node scripts/reseed/grow-axis-pool.js <bot> <pool> --target N             # pool with no surviving generator
node scripts/reseed/render-forced-entries.js ...                         # force specific pool entries
node scripts/run-bot.js --bot <bot>                                      # the real production path
node scripts/check-pool-headroom.js                                      # exit 1 = DB pool tight
```
`--mode` renders a path in `paths[]`, `shadowPaths[]` or `seasonalPaths[*]`; the random shuffle-bag draws only from
`paths[]`.

---

## 3. Diagnosing a render

### 3.1 Diagnostic order (always)
1. Read the upload's stored `ai_prompt` (and `uploads.model`: the iter-bot log's `model=` line prints BEFORE the
   render-time ban guard can swap a banned model).
2. Grep the pools the path consumes for the words that caused it.
3. Audit the gen RECIPE (theme, touchpoints, instructions, examples) that produced the entry.
4. Fix the pool (surgical edit or regen) AND the recipe, or the next regen reintroduces it.
5. Only then touch the brief/template. Litmus: a brief rule of the form "even when the pool says X, render Y" means the
   pool must stop saying X.

### 3.2 "The brief described X but the render lacks it"
Check in this order before touching a pool or template:
- **Truncation**: the `sonnet_truncated` stamp / `✂️ TRUNCATED` in the log (`BRIEF_MAX_TOKENS` = 2000, locked by
  `__tests__/lib/briefTokenBudgetGuard.test.ts`). Never design a path around a token ceiling.
- **Emitted length and POSITION**: `bot_run_log.prompt_words` (mig 546; covers failed renders too; `prompt_preview`
  caps at 2000 chars, don't measure from it). Find the element's position as a % of the prompt. It is usually present
  but past the attended region (§5.1).
- **The ASSEMBLED prompt** (`pathPrefix + prefix + medium + <Sonnet text> + suffix`): read what sits between the
  prefix and Sonnet's text. Only then probe another model, and do it before round 2, not after round 3.
- **Sonnet refusals**: renders gone inexplicably generic/empty → grep stored prompts for meta text ("I notice",
  "I want to be transparent", "prompt injection", "I appreciate the creative detail"). The refusal text was sent to
  Flux as the prompt (FarmBot, 28% of calls, 2026-09-08).
- **The style layer**: varied scenes all rendering the same abstract gestalt → the medium fragment + prefix is a
  stronger prior than the scene (GothBot "Berserk/Miura, dense cross-hatching" dissolved every form). Shorten it.
- **Homogenization** ("same person every time") → read the COMPOSED brief (`bot.buildBrief` in a tiny harness, no DB)
  and look for a word or feature present in 6 of 6.
- **A two-part clause that half-lands** → check whether the half that landed is the ADDITIVE one (§5.7) before touching
  position, length or model.
- Before optimising a pool-level metric, confirm the pool's distinctive words survive into `ai_prompt`; pool text
  inside a brief gets paraphrased.

### 3.3 Safety flags (E005 / NSFW false positives)
- The engine retries a flagged prompt 2× then re-rolls picks up to 3×, which hides flags from the final result. Since
  2026-09-30 every flagged roll leaves a `bot_run_log` row (`status = 'skipped'`, `error_stage = 'safety_flag'`, the full
  flagged prompt in `prompt_preview`, the model in `model`), so start from
  `select * from bot_run_log where error_stage = 'safety_flag'`.
- REPLAY the exact prompt once per model with no retry (splits MODEL from CONTENT), then BISECT: halves →
  leave-one-out → 3× confirm the culprit alone and the prompt without it. Never blanket-soften a pool: the culprit is
  rarely the socially obvious word ("double-breasted", "short-waisted", "at his hip" were false positives).
- Known triggers: named living artists on the flux-2 family; "schoolgirl" on every Flux; figure DENSITY on flux-1.1
  ("a living mass filling the platforms": fix the TEMPLATE so people are sparse, small, distant, clothed).
- On character paths a flag is usually POSITION + PHRASING (costume placed late behind a skin description), not pool
  content (§5.6).

### 3.4 Sweeps, purges and your own tools
- **A sweep is a READING LIST, never a delete queue.** False-positive rates ran 65-88% across four builds. Print the
  matched token and read every hit ("tactile" is not "tile"; "kid goat", "gingerbread man" are not humans).
- **Count before purging.** Failures CONCENTRATED in a few entries → purge that class. Failures SPREAD evenly → the
  feature's own prior is winning; fix structurally (a crop or framing law), not by deletion.
- **Before treating an identifier as evidence, confirm it VARIES**; compare against comparable paths on the same model.
- **Your checks fail routinely**: regex alternation binding, "evenly" inside "unevenly", case-sensitive patterns on
  ALL-CAPS text, stale newlines in template literals, renamed headers. After any reword, confirm each check against one
  hand-read composed brief.
- **Sweep YOUR OWN text** (recipe, template prose, your fix) with the same regexes you run on generated output. A ban in
  a recipe is only a nudge; the sweep of the output is the control.
- Fixing a prompt defect: grep EVERY layer that can restate it (prose, pools, prefix, medium, output order); check the
  output order last. When trimming a template, diff the output order separately.
- Gen scripts write timestamped `.bak` files; a lost winning pool state can be restored by mapping keeper upload times
  to bak times.

---

## 4. How a bot is built (current architecture)

### 4.1 Module layout
`scripts/bots/<bot>/index.js` (config) + `paths/*.js` + `pools.js` + `archetypes.js` + `archetype-templates.js` +
`shared-blocks.js` + `seeds/*.json`, orchestrated by `scripts/lib/botEngine.js`. Config keys that matter: `paths[]`,
`shadowPaths[]`, `seasonalPaths`, `pathBuilders`, `mediumStyles`, `mediumByPath`, `modelByPath`, `allowedModels`,
`modelBanExemptions`, `promptPrefix` / `ByPath` / `ByMedium` / `ReplaceByPath`, `promptSuffix` / `ByPath` / `ByMedium`,
`chaos` + `twoPassPolish` skipPaths, `sensoryAnchors`, `vibesByPath`, `bannedPhrases`, `rollSharedDNA`, `buildBrief`.
Selection is a persisted shuffle-bag (mig 283); `pathWeights` no longer exists.

### 4.2 Two path shapes
- **Function form** `({sharedDNA, vibeDirective, picker}) => brief`: FarmBot, TinyBot, most PixelBot/ToyBot paths.
  A self-contained function path (inline prompt, own seed JSONs `require`d in the path file, no shared-file edits) is
  the fastest, most robust, multi-agent-collision-safe build. Intimate one-off paths may stay function form.
- **Declarative** `module.exports = { archetype, pools: { slot: 'POOL_NAME' } }` routed through `composeBrief`
  (`scripts/lib/brief-composer.js`): most other bots. `index.js` needs `defaultPools`, `poolByName` and a `buildBrief`
  that dispatches on the export shape (see `dragonbot/index.js`).
- Archetypes + templates live PER BOT in `scripts/bots/<bot>/archetypes.js` + `archetype-templates.js`, auto-discovered
  by `scripts/lib/archetypeRegistry.js` (a duplicate name across bots throws at boot). `scripts/lib/archetypes.js` is
  only a re-export shim; never add archetypes there. ~327 live archetypes, almost all path-bespoke.
- When replacing a path, keep the old file under `paths/legacy/<path>.js`.

### 4.3 How the composer rolls, and how the final prompt is assembled
- Roll order: `slots.universal` (path override → bot default; mostly lighting/atmosphere) → `slots.bot` →
  `slots.characterDnaAxes` → `slots.path` (required: throws if missing or empty) → conditional layers + framing modes →
  the template renders the brief. Every pick is `pickWithRecency` (a shuffle-bag). Pool specs can be `{name, tags}` or
  `{name, matchTagsFromSlot: 'subject'}` (filter a later slot by the tags an earlier slot rolled; both pools use
  `{tags, description}` objects). `ANY`-tagged entries match every filter: audit them for things some paths must never
  get.
- An UNWIRED conditional slot silently never fires (path slots throw; conditional ones don't).
- **Final Flux prompt** (`botEngine.js` ~1677-1715), in order:
  1. `promptPrefixByPath[path]` (prepended first);
  2. ONE of `promptPrefixByMedium[medium]` | `promptPrefixReplaceByPath[path]` | `promptPrefix`;
  3. `mediumStyles[medium]`, else the DB `flux_fragment`;
  4. the Sonnet body;
  5. ONE of `promptSuffixByPath` | `promptSuffixByMedium` | `promptSuffix`;
  then `stripScaffoldTokens()` (strips `[[…]]`, `**…**`, `Prefix:` labels; a `🧹` in the log means that brief is
  scaffold-heavy and should be fixed). `cleanMediumByModel` re-assembles with a clean medium for exempt non-Flux models.
- The medium fragment lands BEFORE the scene, in the attended first third: it is the highest-leverage and
  least-inspected layer in the fleet. It can override a path by length (crowding) or content (a mandate).
- Gotchas: `promptPrefixByMedium: ''` is falsy and falls through to `promptPrefix` (use a 2-4 word anchor); duplicate
  object keys in `index.js` silently overwrite.
- Flux 1.1 renders PNG by default.

### 4.4 Mediums
- **Bot-only (code-only) medium, no DB/migration**: add the text to `mediumStyles` (it overrides the DB
  `flux_fragment`; an unknown DB key returns ''), route with `mediumByPath`, lead with `promptPrefixByMedium`, and set
  `modelByPath` (plain or weighted `{model: weight}`) so the picker never reads a missing `dream_mediums` row.
  Tradeoff: not DLT-eligible. This is also the fix when the bot-wide medium carries a mandate or register that
  contradicts a path: a path-own medium of similar length that keeps the lineage anchors. Sonnet-side hooks like
  `heroMandate` can't escape a Flux-side mandate.
- A MEDIUM names the art treatment only (style, render quality, colour, finish, lineage). Never scene nouns (OceanBot's
  clean medium injected ships and a castle into a creature path) and never product-shot words ("designer
  collectible", "Pop Mart" prime shallow-DOF studio framing).
- Medium-identity bots split the jobs three ways: prefix = identity + quality; medium = content + composition; the
  rolled LOOK owns technique. When a bot's identity IS one medium, lock it in `promptPrefix`/`promptSuffix`, not per
  template.
- Pin a path's medium when it needs one consistent look (the medium is the dominant style lever), and curate vibes per
  path with `vibesByPath`, never bot-wide.
- Override a default medium whose COMPOSITION bias is wrong for a path (a portrait-biased medium on an action path).
- **Trimming a medium: keep every line whose intent nothing else carries.** Sentences Flux can't obey (instructions,
  rules about the rest of the prompt) go, or move to the Sonnet brief; picture words stay. FarmBot's first trim dropped
  "every character cute and round-cheeked" assuming the look register covered it, and 4 of 6 character renders came
  back as mature bishonen adults (FarmBot, 2026-09-30).

### 4.5 Axis design
- **Path-identity axes are path-bespoke pools.** Bot-default pools are for modifier axes only (lighting, weather,
  framing). Universal axis CONCEPTS are shared; CONTENT is always genre-coded per bot; there is no shared-library
  fallback.
- **Axis count is per path**: character paths ~12-14 (DNA: race/lineage, class, skin, eyes, hair colour, hairstyle,
  outfit, signature object; scene: setting, sky, light, weather, surprise, action, composition). Scene paths ~7-9
  (setting, architecture style, sky, light, weather, surprise, story beat, composition, optional tiny scale-prover
  figure). Intimate/cozy paths few: restraint is the vibe. Don't add 5 axes at once; new axes replace or condense old
  ones.
- **Pick the variant by what DOMINATES the frame**: landscape (biome + architecture + phenomenon ~80% gate + surprise +
  sky); subject-as-hero (identity + action + setting + drama ~40% gate); character-in-landscape; structure-as-hero
  (structure + architectural detail pickN 3 + inner light + gated accent); two-element 50/50; character-in-interior.
- **Split subject IDENTITY from ACTION** into two pools. Anatomy locks go in the TEMPLATE; the identity pool stays on
  visual identity. Sibling paths (candid vs peak-action) can differ ONLY in the action pool.
- **Split FIGURE axes from ENVIRONMENT axes** on character-in-environment paths so both stay detailed.
- **Scene-as-hero vistas**: hold the LOOK constant (medium + palette + light), vary the WORLD wide (a `world` axis with a
  ~12-family variety mandate); gated `conditionalLayers` for structures, events, ambient life. Give the signature
  phenomenon its own always-on money-shot axis; if it must match another axis (a dome mirroring the world), make it a
  template mandate derived from that axis.
- **Axis-clean stacked density**: each entry stacks 2-3 dimensions WITHIN its own lane (lighting = time + direction +
  colour + shadow) but never borrows another lane (no fog in lighting, no weather in subject; a palette axis is colour/
  light words only). Dense inside, pure between. Litmus: sample 5 entries per pool for cross-axis vocabulary. One
  concept per entry is pedestrian; "stack 3+ phenomena" is AI-fake; the middle wins.
- **Conditional layers** (`conditionalLayer: {slot, gate}` or `conditionalLayers: [...]`) are for drama you want only
  SOMETIMES: 10-15% rare, 40-60% frequent. Not for always-present attributes.
- `pickN: 2-3` on a stack axis forces density (ornament on a structure).
- **Engagement pool**: an always-on multi-actor beat (2-4 actors and their interaction) turns a vehicle "beauty shot"
  into a scene. **Vertigo pool**: scale-is-the-subject paths get a small bespoke camera + dominance + scale-prover pool.
- A shared per-render roll hijacks any path it doesn't fit (a game camera pool, a hardware palette, a bot-wide
  `scenePalette`, shared light pools carrying scene nouns). Give that path its own pools. A prose "compatibility"
  clause loses to a pool pick: filter the shared pool IN the path file instead.
- A path that borrows a landscape (vista) pool as its stage inherits vista priorities and strands its subject; scenes
  with actors need a bespoke ARENA pool (a floor + an enclosing edge).
- Paths about distinct visual languages (cities, buildings) need a STYLE axis, or Flux falls back to the medium's bias.
- Stash a trace string on `sharedDNA` (e.g. FarmBot `sharedDNA.scenePalette` = rolled look) so a bad render traces to
  its exact entry.

### 4.6 Layers: chaos, polish, sensory anchors
- **Two-pass Haiku polish** compresses to a word target by dropping path DNA and setting language first (SteamBot lost
  skin/eyes/hair until only the ethnicity noun survived). Skip it (`twoPassPolish.skipPaths`) on declarative-axis paths,
  gender-locked paths (Haiku strips he/his/bearded) and any path whose setting is a co-hero. It is a legacy tool.
- **Chaos**: skip on paths already dense with identity and on new axis paths through MVP; keep it where one surprise
  adds variety. Real-world bots turn it off bot-wide (EarthBot).
- **Sensory anchors**: channel selection is global, so a vacuum/space path still rolls `weight`/`air`; give it a safe
  context via `sensoryAnchors.pathContext[path]` (`scripts/lib/sensoryAnchors.js`).

### 4.7 Medium Looks (a per-render visual-register axis)
Proven on YumBot, MangaBot, ChibiBot, BloomBot, SteamBot, FarmBot, GothBot, PixelBot.
- Shape: a bot-wide look pool (`seeds/<bot>_look_register.json`) rolled in `rollSharedDNA` with `pickWithRecency`, a
  NEUTRAL medium that locks identity but defers style, short `promptPrefixByMedium`/`promptSuffixByMedium` anchors, and a
  look block that leads the brief (per template via a `<BOT>_LOOK_OVERRIDE(sharedDNA)` helper, or once in a central
  `buildBrief`). Growing the register is config-only and multiplies every look path.
- A function-form path on a look bot opens its prompt with the look override and routes to the neutral medium.
- Fits cast-identity and style-identity bots whose looks stay inside the bot's family. Not for bots whose medium IS the
  product (BrickBot LEGO photo, EarthBot nature photo).
- **Look entries are pure rendering technique** (palette, shading, linework, finish, studio reference) anchored to
  character nouns (eyes, linework, proportions). No subject anatomy; no time-of-day, weather, season or lighting words.
- Curate for composability: exclude looks that change PROPORTIONS (chibi on a serious bot) or COLOUR (B&W on a colour
  bot), and looks whose canonical subject isn't the cast (Art Nouveau drags a Mucha woman into a flower scene).
  Hand-authoring ~12 beats gen-scripting 25 near-dupes. Verify one render per look; cut looks that render the same.
- Exclude style-locked paths (a path that IS a style, e.g. ghibli-countryside) and wire look injection and
  `mediumByPath` together, path by path.
- HYBRID bots (some paths creature-led, some place-led): the neutral medium must be COMPOSITION-NEUTRAL (lock the cast,
  never assert the subject; drop subject nouns from the prefix too).
- Replace the bot prefix with a short anchor only when the prefix carries competing STYLE tokens; a pure-content prefix
  stays leading.
- Looks that ADD visible technique (dither, Bayer, hi-bit clusters) hold a pixel medium; looks that REDUCE it ("flat cel,
  no dither") collapse to smooth vector.
- Photographic register words in a path's own vocabulary (wet, beaded, razor-sharp) out-vote a graphic look at the top
  of the prompt. Check that before debugging "why don't the looks show".
- The look block's wording: plain and cooperative (§5.5), never AUTHORITY/OVERRIDES framing.

### 4.8 Seasonal paths
`seasonalPaths[holidayKey]` (e.g. `fall`, `halloween`) are never in `paths[]`. During a holiday window the engine gates
on `engine_config.bots_seasonal_pct` (50 since migration 581, 2026-09-29) and draws from a separate shuffle-bag
`${bot}::seasonal::${key}`; with two holidays in season (October) a second roll picks one by calendar weight. A path
can sit under two holidays (the pumpkin patches are Fall AND Halloween); each has its own bag. Year-round paths whose
content is seasonal belong in `seasonalPaths`, not `paths[]`. Fall sets (2026-09-29): ChibiBot, TinyBot, BloomBot,
FarmBot. A seasonal path
renders on demand with `--mode`. Hard-lock the season inside EACH entry of the pool that builds the place:
season-neutral entries ("a barn") drift to other seasons.

---

## 5. Prompt-craft laws

### 5.1 Position and the output order (the two biggest levers)
- **The required OUTPUT ORDER in the template is the only layer that reaches ~100% of prompts.** Seed tails reached
  ~20%; rules-block prose and pool text inside the brief reach ~0%. A rule that must be on every render is an ITEM in
  the output order. Proven both ways: an inflator left only in the order kept shipping; a law deleted only from the
  order vanished (0/6).
- **Attention falls off with POSITION.** Content at 5-10% of the prompt renders ~6/6; past ~30% it renders ~0/6.
  Measure position as a fraction of the prompt. Naming the focal subject first in the structure block took it from 1/6
  to 6/6 on several bots. A seed-level surface is necessary but not sufficient: it must also reach the first ~10%.
- **Position sets size.** A hero character goes early and leads with the action ("wide cinematic action shot of X doing
  Y in Z"); a scale-prover figure goes LAST; mid-prompt figures barely render. A scale anchor placed last renders as a
  tiny silhouette.
- **The first-third budget is zero-sum.** Never buy an unsolved trap by demoting a working rule. When you promote a
  clause, name what you delete to pay for it.
- **The first-named-noun law applies to the whole assembled prompt and inside every seed.** A hero entry must lead with
  its defining MASS. For a hybrid premise, lead with the WEAKER half (the bot wrapper already votes for the other).
- A path whose identity is a CONDITION (night, winter, underwater, storm) states it in the emitted prompt before the
  place; implied-by-the-axes is not enough.
- A cue the render must carry goes IN the pool text (spliced by code), not in an instruction about the pool text:
  Sonnet paraphrases instructions and drops the clause.

### 5.2 Length
- Total prompt length does NOT predict grade across paths (r ≈ -0.05). Use length only to ask whether a SPECIFIC element
  survives; never trim "because too long" without naming the element the trim rescues. Flux renders roughly the first
  third of a 600-word prompt.
- No cap at all → add one: the cheapest big win (roughly halves output). A cap already exists → tightening only
  re-orders; delete template prose and output-order items instead (8,049 → 4,023 chars, 12 → 8 items took output
  ~600 → ~180 words). A loud last word cap is a nudge (310-340 words against a 120-150 cap).
- Sonnet anchors length on your EXAMPLES, not your number: write examples that obey the cap. If a recipe won't come to
  length it asks for more than one sentence can hold; remove a requirement.
- Targets: ~85-110 words for a focused scene, under ~250 always; an emitted prompt over ~160 words usually means the
  brief over-instructs. Count it in round 1.
- **A big trim wakes up the late pools.** Entries that used to sit past the attended region start rendering once the
  prompt is short: after FarmBot's trim its camera pool's 11 "looking through a farmhouse window" entries began
  rendering as literal window frames (FarmBot, 2026-09-30). After any large cut, re-read the pools that used to land
  late (camera, weather, magic, closing lines).

### 5.3 The wrapper layer (prefix, medium, suffix)
- **Short.** More wrapper tokens don't add diversity; they lock Flux on the most-trained archetype for the wrapper's
  nouns. Character paths: `promptPrefixByPath[path] = ''` (a 120-token prefix gave the same pale heroine every render).
  A prefix is a SHORT identity or region anchor, nothing more.
- **Never enumerate** in a prefix or medium: no OR-lists, "X or Y or Z", "A and B and C". CLIP locks to the FIRST-named
  noun ('African landscape, savanna or Okavango Delta or Sahara…' rendered savanna every time). Name the REGION; subject
  entries carry the specifics.
- **Positive-only.** Prefix, medium, suffix and look text are prepended verbatim, and CLIP renders a negated noun ("no
  text, no watermarks" in a suffix renders watermarks). Put real bans in the Sonnet template (§5.4).
- **Identity must land in the first ~50 tokens.** A path is bespoke only if the first ~100-200 chars of its `ai_prompt`
  differ from its siblings'.
- **Audit bot-wide strings, not just paths.** A bot-wide string carries its cast to every path ("dreamy dappled light"
  out-votes a per-render light axis; SteamBot's "clockwork machinery / glass gauges" summon readable clocks; BrickBot's
  "natural bokeh, accurate skin tones" on a plastic bot). When renders feel homogeneous, audit the wrapper FIRST.
- When a path's design pivots, grep EVERY layer for directives that contradict it (a stale "NO FIGURES" suffix wins over
  a character-rich body).
- Don't lead with the same style words in both prefix and medium; split the jobs.
- Path-prefix overrides often exist to work around a bad medium: fix the medium first, then shrink the overrides.
- Never name a product line or proper noun you don't want printed ("LEGO Architecture Skylines" printed SKYLINES).
- Tilt-shift vs deep focus is per path: WIDE subjects get deep focus; intimate tabletop subjects keep tilt-shift.
- **Cruft audit every ~3 months** (CLAUDE.md): medium `flux_fragment` ≤ 250 chars, path prefix ≤ 120; over 300 is a
  candidate, over 500 has almost certainly drifted. These are AUDIT TRIGGERS, not proof. Families and greps:
  - negation cascades `\bNOT\b|\bNO\b`;
  - camera-brand stuffing `Hasselblad|Phase One|Carl Zeiss|Velvia|Kodak|Leica|Sony|Canon|Nikon` (one ref OK, 3+ cruft);
  - tech specs `\b\d+K\b|\b\d+MP\b|razor-sharp|tack-sharp|ultra-detailed|hyper detailed` (AI-photo tells);
  - travel-magazine `wallpaper-worthy|postcard-worthy|magazine-cover|Pulitzer|editorial gravitas` (hotels, resorts);
  - mountain-photographer tropes `deep tonal depth|dramatic atmospheric perspective|gallery-print` and photographer
    names (alpine vistas on non-mountain paths);
  - resort/CGI `hyperreal rendering|pristine`;
  - 5+ stacked intensifiers at the open (masterpiece/breathtaking/epic).
  Validate a de-cruft with 5 renders against a known pre-cruft keeper; restore only the one load-bearing token if a new
  failure appears.

### 5.4 Negation: which side of the wall
- **DANGEROUS**: any text concatenated straight into Flux (medium, prefix, suffix, look override, pool text that gets
  copied). CLIP renders the negated noun. Negation on gender/anatomy causes the drift it forbids ("breastbone" →
  write "sternum"). Negation-only direction ("NEVER head-on") fails; give the positive alternative ("three-quarter /
  side-profile / from behind").
- **HARMLESS**: instructions to Sonnet in the brief. Test: "does this sentence instruct the writer, or describe the
  picture?"
- **Exception**: a writer instruction that ENUMERATES banned phrases gets copied verbatim ("partly exposed" appeared in
  200/200 briefs). Keep writer instructions positive ("describe only what IS present, never negations") and dry-run grep.
- Sonnet echoes absent-figure bans ("the room is empty" → literal `no figures`): write the empty branch as a POSITIVE
  state of the room.
- Bans taught as lists seed those nouns ("DO NOT WRITE: sexy, seductive…"). One positive line instead ("beauty through
  couture and poise"). Cut allowed-vocabulary dumps too.

### 5.5 Writing briefs and templates
- **Instruction bloat → crammed renders with no hero.** Stacked mandate blocks, OBSESSIVE-detail demands, FORBIDDEN /
  ALLOWED lists, "render ALL THREE / STACK 3+ / every quadrant striking" and `━━━` / bold / ALL-CAPS scaffolding make
  Sonnet enumerate everything (250-350 words) and pattern-complete markup. ONE dominant hero ("One hero. Never a
  collage", owning 40-70% of frame) plus a couple of subordinate "if it fits" accents. The retired "MOVIE POSTER MOMENT
  + SPARKLE STACK" amplifier is an anti-pattern.
- **Guards**: each load-bearing guard is ONE short positive line (a one-line HARD RULE like "BOTH CREATURES VISIBLE,
  NEVER SOLO"). 3+ multi-paragraph MANDATORY blocks push Flux to the medium's generic centroid. Collapse triplicated
  STRUCTURE / HARD RULES / BANS into one composition paragraph + one comma-joined bans line. A paragraph repeated in a
  second template goes into a `shared-blocks.js` helper.
- **Never claim authority over other instructions.** "NON-NEGOTIABLE / AUTHORITY / OVERRIDES" framing in an override
  block made Sonnet refuse or meta-comment on ~28% of FarmBot calls (2026-09-08). Use plain cooperative wording
  ("Please write the Flux prompt using this art style throughout… Start the Flux prompt with these style words"). Plain
  hard-rule mandates are fine; claiming AUTHORITY is the trigger. (Not yet back-ported everywhere: §9.)
- **Template shape**: lead with the hero/action; state the path's load-bearing constraint first; an explicit
  STRUCTURE / output-order block; conditional slots handled with a ternary; the output instruction last.
- **Template mandates silently override pool variety.** When every render looks the same, audit the TEMPLATE: an
  outfit section saying "covered" 3× forced drapey coverage whatever the slot rolled; injected identity adjectives
  ("He is ancient, weathered") erase the seed's age/build. Write "render the SLOT's X exactly".
- **Pose-monotone paths**: read the template's structure, examples and permission lines before the pools. A "standing…"
  example or a "still poses are valid" line guarantees static renders. Open with the verb + an off-axis angle.
- **Examples become vocabulary** for the satellite axes, including examples in a shared law block. Write them as generic
  anchors ("bare rock", "a flower clump").
- **Laws and axes**: BANS go on every axis that can name the banned thing. A POSITIVE law goes in exactly 3 layers: the
  early framing block, the ONE axis that owns the thing, and the output order.
- A beat/`moment` axis never carries the path's identity or size law (Sonnet reads it as content).
- **A law the scene NEEDS (a size ruler) lives in the TEMPLATE + output order.** A rule in the gen recipe reaches the
  pool, not the prompt; leave the slot empty and Sonnet invents one (pigeon, thumb, "swallow a man"). Give the ruler one
  owning axis and ban its noun elsewhere; prefer a ruler expressed as a unit or verb ("a shovel-blade deep").
- **One place per frame**: if a rolled moment carries its own venue, the venue WINS and the setting axis contributes
  furniture + charm only ("tavern" + "alpine pass" = a tavern window showing the peaks).
- When a path has a subject pool, the template never also hands Sonnet a roster/palette for the same thing.
- **Sonnet never invents the varying element.** It comes from an authored pool, never a brief-side menu.
- Audit templates for pool-scale language ("across the pool of 25"): gen mandates pasted into render briefs bias renders.
- Tie a "focal figure" mandate to the rolled camera axis; bare "ONE clear focal figure" gives a centred front-facing
  subject every time. Put the CAMERA block above the HERO block; hero distance goes in the hero line AND the structure
  line.
- "At most ONE special sky feature" must count features from every axis that can add one.
- Warm WORDS don't fix an epic SHAPE: change what the path describes (intimate, eye-level, enclosed). Tie every
  light-amplification phrase to the rolled light axis; "warm volumetric glow" / "golden hour" in a template overrides a
  time-of-day axis.
- Colour through the medium, not a "multiple colours / jewel-bright" mandate (rainbow abstraction). A single explicit
  top block ("the whole world is COLD…") flips a warm-default bot. Attach a warm accent TO THE LIGHT ("warm honey only in
  the lit places"); an unattached accent renders as an object. "Two colours in opposition" needs two real hues, not a
  neutral.
- Cross-axis physical incompatibility gets a clause: "If A is X and B is Y, DROP the lesser one; restrained truth beats
  forced impossibility" (night sky vs daylight).
- A stock-photo bias (people at waterfalls, masonry in "scenic" nature) is not beaten by an item buried in a banned
  list; hoist it to a standalone block at the top of the brief naming trigger compositions and words.
- Scene paths ask for explicit depth layers and each layer's material, or Sonnet flattens to one sweep. City/busy paths:
  "INSIDE the city, alive with commotion".
- Register-collision guard: when two bots share a motif, name the other bot's territory as a ban in BOTH templates.
- Culture-coded bots need canon-named entries from gen #1 and a hard ban on the competing gravity well in every recipe.
- Beautiful-macabre subjects: a first rule "romantic-melancholy, NEVER horror or decay-porn" with tender human traces.
- A gated "single distant figure" slot: "exactly ONE lone figure, small and turned".
- Crowd/ensemble recipe: a verb-led moment pool opening with a shared event + 2-3 distributed sub-actions; a template
  first rule "a CROWD event, no single centred hero, 2-3 readable foreground couples plus a textured mass"; a crowd pool
  seeded as a MASS; every figure explicitly dressed. Multi-figure outings: every activity entry "all three friends
  together".
- Architecture paths with bridges/stairs: Sonnet NAMES every incidental figure and locks their wardrobe to the world
  ("every human-scale figure is a robed elf"), or an unstated figure renders as a modern tourist.
- A STORY BEAT block with concrete PASS / FAIL examples keeps creature scenes as moments, not poses.

### 5.6 Characters
- **Gender-lock every character brief** (never "they/the character"); ship a SEPARATE male path with its own he/his
  template rather than one neutral template.
- **Humans**: build appearance from atomic axes used IN FULL as a labeled block (Skin, Face, Eyes, Hair colour,
  Hairstyle, Facial hair), never a `.split(',')[0]`. Default: visual traits only, no template-injected nationality lock
  (an "open with a [ethnicity] woman" lock made Sonnet invent a nationality every render and ignore the skin pool,
  SteamBot 2026-06-27). Exception: when a strong painted medium whitewashes skin descriptors, an ethnicity NOUN in the
  first tokens is the stronger anchor (SteamBot 2026-05-23). Don't append " eyes"/" hair" if entries contain the word.
- **Non-human species**: the species is the noun; gender rides on a ROLE noun ("a Sorvathi bounty huntress") and
  pronouns. "[age] woman/man" as the identity noun paints the race as makeup on a modern human. Lead with the race +
  2-3 unmistakable non-human features; ban age words and man/woman/person as the identity noun (gate:
  `banHumanLanguage` / `HUMAN_LANGUAGE_RE` in `seedGenHelper.js`). Recover a female read with a silhouette cue in the
  costume text, never a human noun.
- **Homogenization triad**: (1) a template lock that injects identity; (2) the ACTION axis carrying costume ("captain's
  coat billowing" overrides the outfit slot: action entries describe ONLY pose + staging + props + light; regex-scan for
  garment nouns); (3) the persona/role pool carrying costume (use the role TITLE only, or reseed as role + demeanor).
  Fixing one alone does nothing. Also strip engine-grime/aging creep (soot, salt-stiffened, iron-grey, tired).
- **Signature features are OPTIONAL in the recipe** (antlers on ~half, glowing eyes on few); a feature mandated on every
  entry is "same person every time".
- **Portrait drift**: more "what she LOOKS like" text → portrait; more "what she's DOING" → full scene. Keep DNA to one
  compact bio line, front-load a grounded action, make the composition pool ~85% full-figure with zero face-only
  entries. Kinetic beats that move toward/across camera keep the face readable without going static.
- Never strip a DNA slot to fix an artifact; fix the conflicting entry or make the rule conditional (face coverings are
  environmental: vacuum = sealed visor, glacial = hood, breathable = face visible).
- **Costume FIRST, opaque, constructed.** A costume placed past ~30% of the prompt behind a skin description renders
  nude or trips the filter. Every body garment is STRUCTURED, OPAQUE, CONSTRUCTED (boned bodice, buttoned coat, plate
  over a sash top). Reject bodysuit, satin, sheer, mesh, "open over", "over a fitted underlayer", layered swimwear.
  Body axes describe FUNCTION not FORM ("sealed armour plating / tactical / layered"); never "fitted" / "form-fitting".
- **Coverage mix** for women: ~35% covered ornate / ~30% fitted / ~35% tasteful skin (bare arms, shoulders, midriff).
  Hard line: chainmail bikini, battle bra, strap-as-outfit, cleavage focus, plunging neckline, sultry wording, pin-up
  seated pose. Blanket "covered" bans produce drapey over-correction.
- **Male shirtless drift** triggers: "sleeveless", open vest, torn tunic, "rugged/smoldering", skin words (oiled,
  sculpted, chiseled), chest war-paint, pirate rigging. Every male outfit names a chest-covering item; the male skin pool
  describes the FACE only.
- **Pose clarity**: gravity-ambiguous seeds (rappel, inverted, wall-running, "defying gravity", limbs splayed, MID-AIR /
  AIRBORNE) render contorted or floating humans. Rewrite the body (feet planted, crouched, landing on a ledge), add
  "grounded, believable weight" to recipes and a compressed POSE-CLARITY LOCK to templates. Creature aerobatics are fine.
  Audit: `rappel|abseil|body inverted|defying gravity|wall-run|limbs splayed|mid-air|airborne`.
- A bot's pervasive register ("impossible", dreamy) lands on the figure's body and gear: say "surreal treatment applies
  to light/sky/world only, never the body or gear".
- Phrase priors: "bare midriff" beside a closed jacket = unzip; a "vest" = open front over a bare chest (say chest
  plate); a "crest" = helmet (say a mane from the scalp); "scars along the jaw" = stitched mouth; "a beard OF moss"
  renders pale (lead with the colour: "a thick jet-black beard with a little moss woven in").
- Hue words render literally: a "green-gold undertone" skin entry rendered green skin. Skin tones use warm/brown/gold
  words only.

### 5.7 The model ADDS, it doesn't subtract; words become things
- **Removal can't be described** (shorn, bare, leafless, drained, cut). Name a POSITIVE object that lacks the feature
  ("a pale bristled floor of cut stalks", proven by ADDED ruts and bales). Same for "blank": it doesn't subtract, naming
  the object adds it.
- **Colour first, shape second, species last.** A named species/breed/mineral renders in its PRIOR colour and out-votes
  the colour word beside it (fidelity 1.5/6 → 6/6). Lead a famous-photo premise with shape and size before the name.
- **JARGON COLLISION**: a domain-correct term that is also a common object renders that object confidently. Known
  minefields: balloon envelope/crown/skirt; telegraphy key/sounder/relay; gardening spur/runner/crown/eye; sailing
  sheet/head/foot/tack; printing plate/bed; coastal thrift/stack/spit; "cross" on a hilltop; "cloud" in "cloud forest"
  (use MIST); "stubble" (a beard); "baling" (bailing); "haymaker" (a punch); "film" when the wrapper says "35mm film";
  "fire" as a noun in autumn pools (literal flames: use "blazing colour", "peak colour saturation"); "herd"; "perched" on
  a fish (bird anatomy: say "resting on its splayed pectoral fins"); rust/crimson/scarlet on wet animal paths (blood);
  "cross-gabled" (literal crosses: say "twin-gabled").
- **LITERALIZATION**: shape words become objects. Light as column/pillar/shaft/cone/ribbon/bar; "halo RING"; "coins of
  light" (gold coins); "heart of ice"; "shaped like X"; borrowed adjectives ("feathered cirrus", "curling like a sleeping
  cat"); motion nouns ("sweeping"); straight-edged colour ("ruled band"); "stacked cloud towers". Light is a soft glow on
  a named lit SURFACE; describe forms in their own terms. Architecture similes are fine (charm).
- **Rigid-object words on sky/cloud/floating things** (disc, saucer, dome, orb, metallic, hovering, suspended) render UFO
  saucers; describe cloud as cloud with movement verbs, floating structures by feature (gasbags, tethers).
- **Modern-prior nouns**: every event noun passes "what is the most famous image of this noun?" (wedding, dress-form,
  choir, conductor render the modern thing full-size). Obscure creatures with no Flux prior (kodama, "a borrower",
  golems, faceless beings) collapse to an uncanny human graft: before seeding a species ask "does Flux have a prior?",
  describe it in concrete non-human terms or don't seed it. Obscure dinosaur genera → state body plan + a famous
  look-alike (DinoBot `SPECIES_ANCHOR`).
- **One token, one referent per prompt** ("winged X" makes X an animal). Name the other referent by shape.
- **Banning one trigger word is a half-fix**: Flux re-finds the centroid through the surrounding lexicon (cattle words on
  dinosaurs). Purge the whole analog lexicon at the source pools and the template's own examples; add positive anatomy.
- Magical-night priors leak through bans ("never glowing eyes" → glowing eyes): positive only ("eyes dark and wet, a
  tiny cold pinpoint of reflected moonlight"; "the only light is real astronomy").

---

## 6. Pools and seeding

### 6.1 The #1 principle
Flux renders the pool seed text, and brief adjectives cannot override a seed. Pool rewrites moved StarBot quality
30-50% per round; brief tweaks 5-10%. Start every fix with a POOL audit, and treat the gen RECIPE as the most important
text you write for an axis: when in doubt, regenerate (cheap) instead of iterating the brief.

### 6.2 Generators and commands
- Most bots: `node scripts/gen-<bot>-pool.js --pool <name> --count 25 [--target N] [--max-iter 15] [--dry-run]`. It
  writes `scripts/bots/<bot>/seeds/<pool>.json` with a `.bak-<ts>` backup. `--target` appends with cross-batch dedup.
  Always pass `--count`: the default varies by script (25, 30 or 50).
- Others: per-path gen scripts (`gen-steampunk-*-pools.js`, `gen-faebot-regatta-pools.js`,
  `gen-starbot-space-rogue-pools.js`, `gen-brickbot-airfield-pools.js`), `scripts/gen-seeds/<bot>/*` (its
  `generatePool` defaults to append:false = OVERWRITE; pass `append: true` to scale), and
  `scripts/reseed/grow-axis-pool.js` for a pool whose generator is gone. `gen-faebot-pool.js` ignores `--total`; use
  `--target`. Check which applies before writing a new recipe. `scripts/identify-subject-pools.js` finds a path's
  subject pool (never classify by slot name).
- Gen scripts call Sonnet through `SONNET` in `scripts/lib/models.js` with a long fetch timeout (the default 5-minute
  headers timeout is too short for big batches).
- Tagged-pool bots store `{tags, description}` objects, not flat strings.

### 6.3 Recipes
- Shape: `POOL_RECIPES[name] = { theme, touchpoints, instructions }`. `theme` = the bar + a variety mandate with EXPLICIT
  counts + strict bans that NAME the Flux failure ("NEVER X, that triggers Y in Flux") + phrasings to AVOID + mood.
  `touchpoints` = 5-25 varied examples in the bot's voice. `instructions` = short format + word count, numbered, no
  internal newlines.
- DO: explicit category counts; the bar first; quote phrasings to AVOID (bigger win than bans); a word count. DON'T:
  recipes over ~200 lines; 50+ stacked constraints (the first 5-10 carry it); several semantic axes in one recipe (split
  the pool); strip apostrophes/possessives.
- **The recipe often SANCTIONS the failure** (a subject-less phenomenon category, a chore-verb action list, an example
  demonstrating a banned pose). Purging seeds is half the fix; rewrite the recipe's mandate and examples too. Litmus:
  read the action pool TITLES for a chore-verb majority.
- **Never let Sonnet choose the varying element at gen time**: it converges on the same dozen. Pre-assign from a real
  roster, least-used first, pairwise cap, and verify the assignment came back. A pool whose recipe lists N variants but
  uses 2 = pre-assign across the recipe's own list.
- **Seed each sub-theme INDEPENDENTLY then join** (`scripts/lib/yumbotBucketGen.js` `generateBucketScenes`, or recipe
  `subThemes: [{aspect, weight}]`). A distribution asked for inside one meta-prompt is not delivered (asked 15/10, got
  25/0); seed each side of a load-bearing tag split as its own recipe and count tags before rendering.
- A recipe that lists literal colour words gets them echoed back: name the harmony's MOOD + a wide vocabulary menu, and
  "two entries may share at most one colour word". Colour-reality checks go to Sonnet, hue-family only.
- Useful variety mandates: outfit = climate distribution + silhouette variety; action = body-position distribution
  (default Sonnet output is 60%+ kneel/crouch/seated: cap ~20%); class = a full party roster. Candid TRAVEL / OBSTACLE /
  REST registers beat camp-chore and ritual registers (crossing a bridge = good, repairing one = goofy). Peak-action
  entries stack a primary beat + an environmental reaction + an active background.
- Action/interaction entries are VERB-LED around a SHARED object both actors touch; ban reaction-only phrasing
  ("gazing at", "looking at each other").

### 6.4 Dedup
Every gen script dedups at three levels: within the batch; across batches against the existing pool; by SIGNATURE (strip
the caps title and stopwords, take the first 12 tokens >4 chars, alphabetize, hash) plus exact titles. Reference
`signatureOf` / `dedupe` in `scripts/gen-starbot-pool.js` and `generatePool` in `scripts/lib/seedGenHelper.js`. Without
it, "200 entries" ≈ 75 unique. For boilerplate near-dupes: group by a 6-significant-word key, keep ≤2 per group, refill
with `--target`. When regen adds 0 after dedup, the theme is exhausted: author the rest directly.

### 6.5 Fixing a pool
- **Fixing a pool = unique entries of the SAME kind.** Never change a pool's essence while repairing it.
- Surgical over regen: for 1-10 bad entries (or a ratio rebalance), edit them in place AND harden the recipe. Regen only
  when the mandate must change for future entries. Wipe (move aside) when the recipe's structure changed; append when
  scaling a locked recipe.
- Before editing, check whether the pool is SHARED (a shared contaminant is a fleet-wide bug; one clean fixes every
  consumer) and whether a frozen path reads it.
- Sweep harness for a vocabulary defect: regex classifier → Sonnet rewrite of ONLY flagged entries → re-validate to 0
  residual → fix the recipe touchpoints (`scripts/fix-dragonbot-human-language.js`, `scripts/purge-earthbot-symmetry.js`).
- Audit every new pool against the bot's `bannedPhrases` before rendering: a whole-word hit (with inflections) that
  survives 2 retries kills the render.
- **When a bot RELIABLY renders a banned thing, a source contains it**: the subject pool, the gen metaPrompt that
  regenerates it, a template "OK to render X" line, or background figures in scene/surprise/light pools ("distant
  child", "villagers"). Purge all AND fix the generator. Occasional 1-2-in-5 tiny-figure leaks are different: add
  explicit what-to-omit examples at the template top.

### 6.6 Standing sweeps (run on MVP and scaled pools; read every match)
- Off-genre tropes on strict-genre bots:
  `pirate|buccaneer|corsair|privateer|tricorn|flintlock|musket|cutlass|treasure map|brass.?button|colonial|naval coat|powdered wig|frock coat|steampunk|clockwork|victorian|bloodborne|pegasus|cerberus|cyclops|sphinx|cowboy|samurai|ninja|revolver|pistol`
- Modern-prior nouns on fae/fantasy bots:
  `wedding|bride|groom|mannequin|dress-form|choir|conduct|belt|khaki|trouser|zipper|denim|camera|machine|plastic|jeans|birthday|christening`
- CJK characters `[　-鿿]`.
- Text-prior synonyms (§7.1).
- Corridor/vanishing point: `converg|toward a single point|shared .* point|apex|meeting point|single file|in a column|each progressively smaller`
  (hero pool too).
- Symmetry: `straight down the long axis|down its length|directly overhead|plan-form|vanishing point|on each side|both sides|\b(two|four|six)\b` next to like-element nouns.
- Camera-framing hijack (every `*_camera_framing` pool): `close-up|close-detail|close portrait|macro|extreme close|gripping|fingers|knuckles|dissolving entirely`
- Biome drift: any "wild setting / explore" pool mandates the home biome and lists the banned off-biome set.
- Motif compounding: a motif sanctioned in 3+ axes of one path appears on every render (a companion bird in action,
  accessory and surprise pools left only ~45% of renders bird-free). Cap each companion animal PER POOL; fix it in EVERY
  axis. Tiny distant flocks stay (scale provers).
- Dullness (§1.4) and pose clarity (§5.6).

### 6.7 Entry-level rules
- Every life/animal entry carries its own size/distance word; keep animal vocabulary in exactly ONE axis.
- A volume (chamber, dome) can't be a hero; every hero entry contains a MASS standing in the space.
- A setting entry leads with the setting and its density, and names an architectural STYLE.
- Single-purpose slot entries (one outfit, one light) are tight; no FG/MG/sky layering (that was the old fat-seed format).
- Scene entries describe an ACTION, not just a setting: embed mid-X tension (mid-launch, mid-rescue).
- Material truth lifts photoreal: "weathered ribbed obsidian with copper-green oxide", not "smooth chrome".
- A money-shot light axis that rolls against many places is place-agnostic (specific in detail kind, not surface nouns).
- Hard-lock the season and biome inside every place-building entry (a hard-locked vast biome also fixes a creature
  rendering too big).
- **Camera pools are hand-authored** (25 hero-agnostic framings ≈ 5 minutes; generated ones leak time, weather, hero type,
  posture). Camera entries name where the CAMERA sits (distance, height, orientation only; never a viewer posture verb:
  lying/standing/kneeling render a person), give an architectural hero an ANGLE word, and pass a FRAMING TEST ("could this
  camera actually SEE this?"). A camera ON the hero's structure removes the hero; a narrow aperture renders a peephole.
  Frame-edge foreground is a near EDGE, never a surround. Every framing is off-axis by construction.
- Framing entries never zoom past the hero (single organ, texture macro, hands on a hilt) or name a subject outside the
  hero roster.

---

## 7. Failure-mode catalogue (symptom → cause → fix)

### 7.1 Text and gibberish (the fleet's #1 residual)
- **Pseudo-lettering on a flat surface** → Flux backfills any UNDESCRIBED flat panel (counter front, lintel, quay wall,
  vehicle flank, awning) → name what the surface CARRIES (crates, a vine, lanterns) inside the hero seed and the output
  order. Done right it is a set-dressing win.
- **Text-SHAPED objects** (dial, gauge, clock, book spine, screen, signboard, keyboard, label, banner, scroll, a board over
  a doorway, analog instrument banks) → the shape IS a sign → delete the noun from EVERY layer that reaches Flux,
  including prefix and medium. A protective "blank dial" clause summons a numbered clock. Safe substrates: cloth (noren),
  wall planks, lantern paper, eave boards, curved walls.
- **Text-prior synonyms** → sweep `mark|glyph|sigil|stamped|engraved|etched|inscri|script|characters|plaque|sign` and
  process words `ruled|drawn|traced|written|inked|scored`, plus paper, note, letter, label, chalkboard, map, menu,
  weathervane, compass, sundial, coat of arms, crest, emblem. Safe glowing carving set INTO a wall: "a worn pictorial
  relief of a carved <shape> that glows softly from within the <material>" (15/15).
- **Sign prior in the SETTING itself** (an inn entrance) → deleting the noun leaves an absence that gets backfilled →
  DELETE + FILL the space with a positive non-sign object (strung lanterns, a snow-laden bough): 2/6 → 0/6.
- **Subject made entirely of text-shaped surfaces** (arcade machines) → filling one migrates text to the next strip →
  shrink the text-bearing AREA with a crop.
- **"One small painted picture on X"** → invents a signboard when X isn't guaranteed in frame → identify a thing by its
  CARGO piled to shape its silhouette (GOODS LAW, 19/20).
- **Information subjects** (charts, maps, scores, ledgers) → show information only as POSITION, COLOUR or COUNT of real
  objects (pins in moss, beads on a cord). 0 text in 26.
- **Anti-text and make-vivid rules on the same surface** → Flux takes the dull first option → ONE sentence ("the hive body
  painted, only the small flat panels plain").
- **"In flat blocks of colour" on hanging cloth** → a sign shape → describe cloth as sagging, folded, rippling.
- **Masonry carved with pseudo-text** → geology in mason vocabulary (courses, blocks, keystone) → stone bands sag and
  vary, edges rounded.
- **Branded-object subjects** (toys) → delete every text-shaped object from every recipe (foam letters, books, tins) + a
  per-object plain-surface clause in the output order and seeds.
- **Text residual on a clean path** → grep the bot-wide prefix and medium first.
- Accepted residual ~1 in 6 on storefront / airfield / tombstone / ship-bar-port registers.

### 7.2 Composition and framing
- **Hero on bokeh, world lost** → subject / product-style tokens front-loading CLIP ("designer collectible") → de-front-load
  the subject, strip DOF cues from prefix + medium, add "the whole world in sharp focus"; don't enrich the scene pool.
- **Receding corridor, subject tiled to the vanishing point** (stream, road, canal, track, formation) → the linear
  feature's prior beats camera words → CROSSWISE LAW: "crosses the picture from the left edge to the right edge, its
  surface fills the near half, the far bank is a BAND across the top, both ends run out of frame" in the template, every
  hero seed and the output order (0/20). A bridge "enters from ONE side edge and runs back out, cropped". Formations go
  lateral (line abreast, loose V, echelon).
- **Symmetric / mirrored / front-on frames** → axial camera entries, even counts, "on each side" → purge axial entries (don't
  strengthen the anti-front-on mandate); odd counts with one member set apart; one-sided wording. Carvings: "above the
  arch" (one place), never "beside" (mirrored).
- **Split-panel frame** (interior + window, or a left-vs-right colour assignment) → two zones described → ONE camera,
  one continuous space with a bright window in it; the outside softer through it; assign hues to LAYERS (overhead vs
  underfoot), never sides. Before shipping a strengthened rule, ask what it means geometrically.
- **Product shot / curio on a plinth** → a container or mass named as an OBJECT → CONCRETE BUT CROPPED: name it plainly,
  say where in frame it sits, give the crop ("glass arcing across the top corners and running off its edges"), keep
  base/stand/shelf out of every layer (9/9; an abstraction renders nothing). Open every detached mass with its attachment
  (welded to bark, half-buried).
- **Container with a standard viewing height** (tub, tank, cot) → only a HEIGHT-EXCLUSIVE surface buys the camera (hulls
  cut by the waterline with a meniscus).
- **Glass display case / aquarium** → a transparent volume with its own edges → bury the thing deep inside the room's own
  wall or floor, "seen through a great thickness of it".
- **Interior renders as a void or open sky** → the rolled look (isometric, voxel) decides whether the room exists → NAME
  the enclosing surfaces ("stone closes the frame down both sides; its vault closes it overhead") and what they are MADE
  OF, in the hero block and the structure block.
- **Interior light**: every light entry's source must EXIST INSIDE THE ROOM and say what it lands on (outdoor-sky entries
  give flat daylight); a narrow bright opening summons solid light cones, so "light is illumination on surfaces, not an
  object" lives in the TEMPLATE.
- **High perch under a big sky renders as a vista** → the perch type decides: a self-contained object (nest, boulder)
  renders whole from outside; a feature of something too big to frame (limb fork, root buttress) renders as a near
  surface. The parent must be woody.
- **Black void cutout** → a foreground described only as dark/shadowed → name what the foreground IS.
- **Busy collage** → a "stack 3+ elements / every quadrant striking" template → one hero, 40-70% of frame; drop always-on
  phenomenon gates.
- **Scattered, boring establishing shots** → entries describe a setting, not an action → mid-X tension in every entry.
- **Stacked-ring tower** → regular repeating geometry ("layer on layer", "even spacing") → "no two the same size, none
  level, spilling down ONE side".
- **Round buildings all become "a cylinder with a pointy hat"** → every dwelling names its massing (steep gable, long
  ridgeline, L-wing, catslide); cap conical at ~1 per 25.
- **A city shrinks to a skyline** → aerial-only framing → "INSIDE the city"; a remote location inside a city pool renders
  as a lone figure in a gorge.
- **A vehicle/ship beauty shot with no scene** → no engagement → an always-on engagement pool (§4.5).

### 7.3 Scale and size
- **Small creatures render giant** → size tracks COUNT, not size words (a count under ~12 is the giant-insect generator)
  → a count floor of ~12+; a size ruler IN frame fixed by a larger parent (comb cell, mast, standing figure); off-frame or
  free-floating rulers inflate.
- **Detail = size**: the one you describe most comes out biggest. Grant no subject a detail exemption; say so in the
  template.
- **A small creature named ON a made object brings the object at hero scale** (a parrot on a cage → a house-sized cage) →
  make the size cue a FRAME POSITION ("tiny at the far side of the picture").
- **A shape word in cargo's name becomes the shape** (TOWER of bowls) → many small pieces + a welded ruler.
- **Giant version of an object that also appears as set dressing** → the mundane one wins → a shared noun means
  substitution; rename one.
- **Vague size words ignored** → numeric or positional anchors (1-2% of frame, midground-back, "NOT foreground, NOT
  centred") with scale provers.
- **Megastructures render as towns** → demand the extent ("visible curvature, horizon-spanning, NOT a settlement").
- **Tiny humanoid renders as a naked wingless cherub** → "palm-sized / tiny" summons the putto → state ADULT proportions
  ("slender grown fae, long-limbed, the size of a mouse") and put one figure BIG in frame.

### 7.4 Figures and people
- **Humans on a no-humans bot** → commerce/crowd/village concepts (market, vendor, fair riders) or a source that contains
  people (§6.5) → make the cast MANDATORY and cast the human-role slot as the bot's own character type (critter,
  food-character); strip crowd language; never a negation list of human forms. "Distant crowd" → "tiny chibi-ANIMAL
  visitors".
- **Lone figure at the vanishing point** of a walkway into glowing haze, even under no-humans → name the exact bias ("the
  vanishing point is EMPTY, no lone person walking away").
- **Unstated incidental figures render as modern tourists** → name them and lock their wardrobe (§5.5).
- **A named action with no named actor** → a disembodied giant hand → name the whole figure.
- **Face portrait on a hands/object path** → "partial face / chin in frame" (Flux can't crop precisely) → ban faces
  entirely: hands + forearms, head out of frame.
- **"No figures, pure architecture"** → empty hallways by design → a genre scene needs its iconography in frame.
- **Venue object steals the posture** (a chair → she sits holding the cup) → keep venue charm non-interactive.

### 7.5 Anatomy and creatures
- **Humanoid face on a fish** → front-on framing of a round-eyed fish → front-on only for cephalopods and fanged
  predators; profile / three-quarter otherwise. Barreleye is banned everywhere.
- **Mangled limbs on an animal automaton** → "machine mimicking a real animal" + a dynamic pose → render automata STILL
  and clearly mechanical at rest.
- **Insect/moth/bat familiars** → owl-faced, ram-horned chimeras → trim at the source; birds, cats, wolves, hounds,
  serpents render true.
- **Personified object** → "the FACE of a hive" under a cute tone lock → a flat plane word ("the face of a comb") doesn't.
- **A glow word near a small dark aperture** → the glow relocates into the opening (a furnace in a hive).
- **"A dense rounded mass hanging from a branch"** = a wasp nest → a swarm made entirely of living bodies.
- **Spider register on a cute bot** → a positive ALLOW-list of cute bugs (ladybug, butterfly, bumblebee, snail, firefly)
  beats a ban-list; ban lexical relatives too (spider-silk, gossamer → "silk-thread").
- **Toys render factory-fresh** → adjectives lose to the product prior → state the finish as a surface in the hero seed's
  opening noun phrase ("gone matte and chalky, no shine") + a named material tradition.
- **Photoreal drift on a brick/toy bot** → landscape surfaces + sleek bodywork → name each drift surface as parts ("rock =
  stacked slope bricks, turf = green plate mosaic") and positive brick cues on bodywork ("studded roofline").
- **Sea warship on a space path** → a bare ship class with a naval counterpart → always "STARSHIP frigate".
- **Spaceship renders as a temple** → building-coded vocabulary (cathedral, citadel, minaret) → vessel forms
  (segmented-worm, obelisk-vessel, spire-needle).
- **Space scene turns grounded/cluttered** → nouns with a terrestrial prior (canyon, rail, "moon surface below", nebula
  pillars, debris) → scan every noun's strongest prior before adding it to a space pool.
- **Black hole renders as a swirl or dark planet** → "vortex / whirlpool / hole" → "a black hole with a blazing accretion
  disk", "a FEATURELESS pitch-black void circle", disk lensing over and under.
- **Rock cliffs inside a cloud world** → canyon/cliff/valley nouns → cloud vocabulary only (cloud-walls, thunderhead
  ranges).
- **Forest renders as a planted avenue** → cathedral / colonnade / nave / evenly-spaced in the seed → natural irregular
  old growth (uneven girth, leaning trunks, a fallen giant).
- **Pedestrian tourist snapshot from gorgeous prose** → a famous vantage/park name pulls the stock prototype → describe
  the geology; broad regions are safe.
- **Masonry, steps, footbridges Sonnet never wrote** → Flux's park-photography bias → a hoisted ZERO HUMAN-BUILT
  FEATURES block + keep trigger words out.

### 7.6 Register and tone
- **Cozy-cottage clutter Flux adds on its own** (wall lanterns, chimney pots, brass handles) → positive crowd-outs ("the
  ONLY lights are the glowing windows"); ban lists make it worse.
- **"Old fairytale building" misses** → three poles (tidy, moss-blob, derelict) → "old = weathered stone + moss + the
  forest's embrace, never decay, never tidiness".
- **Neon light on a nature path** → extreme light words ("electric-blue", "at eleven") → "the real best-light moment, light
  with a clear physical source" + de-cruft the seeds.
- **Sci-fi turns ominous** → the genre prior → ban the tone by name in the first template block, carry it in every recipe,
  tilt the atmosphere axis. Where darkness is load-bearing, roll the mood range and pin vibrancy to the hero.
- **Crisis busywork** (cannon recoil, engine-valve crisis) → reads as a Titanic boiler room → composed iconic hero shots.
- **Documentary register words** pull toward competent travel snapshots, not gallery prints; the medium owns the register.

---

## 8. Models

### 8.1 Fleet rules
- **Banned for ALL bots** (Kevin 2026-06-22, `BOT_BANNED_MODELS` in `scripts/lib/modelPicker.js`): Nano Banana
  (`google/gemini-2-image`, `google/nano-banana`) and `openai/gpt-image-2`. Enforced twice (picker strip + a render-time
  guard in `botEngine.js` that swaps to flux-1.1-pro-ultra). A bot opts back in only via `modelBanExemptions` AND
  `allowedModels`. To genuinely test a banned model, env-gate the guard temporarily and never commit the gate.
- **New-path default (Kevin 2026-09-24)**: a path that would pin flux-1.1-pro rolls 50/50 flux-1.1-pro /
  flux-1.1-pro-ultra (`modelByPath: [pro, ultra]`, or no entry). Pin pro-only ONLY on a measured ultra probe, write the
  numbers next to the pin, and add the path to `DOCUMENTED_PRO_ONLY` in `__tests__/lib/proOnlyPinGuard.test.ts`.
- `allowedModels` only FILTERS the medium's `dream_mediums.allowed_models`; `modelByPath` hard-locks and bypasses both.
- Always verify the model from `uploads.model`, never the iter-bot log.
- Kevin (2026-09-24): models have never been the cause of a path failing to render. Check the assembled prompt first
  (§3.2); a model that renders the premise better can still be unshippable (safety wall, signatures).

### 8.2 Current lineups (`allowedModels`, 2026-09-29)
| Bot | Models |
|---|---|
| alphabot, bloombot, brickbot, dragonbot, dreambot, earthbot, faebot, gothbot, oceanbot, outlawbot, starbot, steambot, tinybot, toybot | flux-1.1-pro + flux-1.1-pro-ultra |
| farmbot | flux-2-flex only |
| mangabot | flux-dev, 1.1-pro-ultra, 1.1-pro, flux-2-pro, flux-2-max |
| pixelbot | flux-dev, flux-2-flex, 1.1-pro-ultra, 1.1-pro, flux-2-pro, flux-2-max (scene paths: `SCENE_MODELS` in `scenePaths.js`) |
| dinobot | flux-dev, 1.1-pro-ultra, 1.1-pro, flux-2-pro + gemini-2-image (exempt) |
| chibibot | 1.1-pro-ultra, 1.1-pro + gpt-image-2, gemini-2-image (exempt) |
| yumbot | flux-dev, 1.1-pro, 1.1-pro-ultra, flux-2-flex + gpt-image-2, gemini-2-image (exempt) |

Per-path `modelByPath` pins override these. `BOT_MODEL_TALLY.md` has per-path history (check its date).

### 8.3 Model traits (measured)
- **flux-1.1-pro-ultra** signs its work (corner scrawl, up to ~1 in 5 on painted registers): a model-selection lever, never
  a prompt defect (suffix negation leaks the word). On CONDITION-identity paths (night, firelit or ice-lit interior,
  translucent resin, camera height, glass framing) it reverts to golden-hour exteriors, shots from outside and fake
  inscriptions. Both are valid documented reasons for a pro-only pin; neither is a blanket exclusion. It literalizes
  terrestrial nouns on space paths and poorly honours negatives.
- **flux-2 family** (pro, flex, max): the safety checker rejects NAMED LIVING ARTISTS; a medium naming artists can't ship
  on flux-2. flux-2-pro carries a "magical" prior (glowing predator eyes, vertical beams) that survives positive framing:
  keep it off night/predator/storm paths.
- **flux-dev** can delete the hero on condition-identity paths.
- **flux-1.1-pro (non-ultra)** renders smooth illustration on a pixel-painting register.
- **gpt-image-2** can't render 9:16 (pins 2:3). gpt-2/banana go abstract on painterly FUSION mediums but handle concrete
  style tags (Pixar 3D, Ghibli watercolour, oil, woodblock) fine.
- **`cleanMediumByModel`** (`scripts/lib/cleanMediumByModel.js`) swaps gpt-2/banana to a style-only `<bot>_gpt_clean`
  medium; it now matters only on the three exempt bots (ChibiBot, YumBot, DinoBot). Keys: `medium`, `pathPrefix`,
  `skipPaths`. A path whose identity is optical/material opts out (DinoBot's clean medium drops photoreal/PBR). Each
  `<bot>_gpt_clean` needs `dream_mediums` + `dlt_clean_mediums` rows.
- Safety: some content flags every Flux model ("schoolgirl"); find it by replay + bisect (§3.3).

---

## 9. Ops

- **Enable / reactivate a bot.** The dispatcher auto-deactivates any due bot with `last_posted_at IS NULL` whose row is
  over 6h old (`NEVER_POSTED_TIMEOUT_HOURS`, `scripts/dispatch-bots.js`), and only the dispatcher writes
  `last_posted_at` (iter-bot and run-bot don't). 5 consecutive failures also auto-deactivate (check `bot_run_log`).
  Procedure: `node scripts/run-bot.js --bot <name>` to prove the production path → set `active = true`, a NON-NULL recent
  `last_posted_at`, `next_due_at = now()`, `consecutive_failures = 0`, `last_failure_reason = null`, notes → read back.
  Cadence is `bot_schedules.posts_per_day` (fleet 2×/day) via the hourly `bots-dispatcher.yml`.
- **Avatars**: public `avatars` bucket at `<botUserId>/avatar.jpg` + `users.avatar_url` with a fresh `?v=`; no build or
  deploy. `scripts/regen-bot-avatars.js` (or `crop-bot-avatars.js`) then `apply-bot-avatars.js`. Avatars are ICONS: one
  bold subject, tight, simple background, in the bot's own medium. Skip hidden bots (`HIDDEN_BOT_USERNAMES` in
  `hooks/useBotUsers.ts`). Bot taglines are short whimsical "what you'll see", not character voice.
- **Spin a path off into a NEW bot** = full directory xerox (`cp -r`), never a paraphrased rebuild: edit username /
  displayName + `paths[]` only; revert the source bot (paths, mediumByPath, modelByPath, look filters, skipPaths,
  `pools.js` loaders, path file + seeds); `node -e "require(...)"` both; delete `.bak` files; strip the clone's duplicate
  archetype/template names (the registry throws on duplicates). DB username must equal the module username; reassign
  uploads via service role; schedule per the enable procedure.
- **Adding a DLT-eligible bot medium** (a `dream_mediums` row): also add a `dlt_clean_mediums` row (style-only,
  subject-stripped) via `node scripts/distill-clean-mediums.js --missing` (or `--key <k>`) and eyeball the 25-45-word
  output. Without it DLT falls back to the raw bot medium and overrides the user's subject. Bot `dream_mediums` rows are
  never mutated.
- **Finding the post Kevin means**: ask him to COMMENT on it and query `comments` by his id (he also uses the
  `sunnysteph` test account for likes/saves).
- **Seed tables**: NEVER an unscoped delete on `bot_seeds` (CLAUDE.md); scope by category, count first.

---

## 10. Bots: current profiles

Live paths are `paths[]` in each `index.js`; don't trust a list here over the code. Shadow and seasonal paths noted.

- **AlphaBot**: the private proving ground (§2.1). Holds DreamBot's former non-robot paths (dreamscape, far-eden ×2,
  hidden-conservatory, butterfly-realm, dream-spires, botanical, pulp ×2) and dormant ChibiBot-heritage paths; their
  archetypes live in alphabot's registry, never re-add them to dreambot. Its vista paths are the source of the
  scene-as-hero shape, the tone-steer rule and the sibling-path A/B trick (two looks for one path = two paths sharing an
  archetype + pools with a look-neutral template; `mediumByPath` is the only diff).
- **BloomBot**: flowers are always the hero. 13 fine-art looks via the `BLOOM_NEUTRAL` override, look block prepended
  once in `buildBrief`; `PROMPT_PREFIX` leads (content-only). Colour comes from the flower × colour prior matrix
  (`flowers.json`, `flowerEngine.js`, `flowerThemes.js`: ⅓ mono / ⅓ curated harmony / ⅓ spectrum); Flux renders a named
  species in its PRIOR colour, so a colour claim needs a species whose prior matches. Art Nouveau is banned as a look.
  Per-path hero-mandate branches exist (`HANGING_FLOWERS_MANDATE`, `FLOWER_FRIENDS_MANDATE`) because the bot-wide "pack
  the frame" mandate spams composed paths. flower-friends / flower-humming-birds: the entry is the only flower source; the
  pollinator or bird is named first. Seasonal: Fall ×1 (overgrown-pumpkin-blooms), Halloween ×4.
- **BrickBot**: AFOL-convention LEGO MOC diorama PHOTOGRAPHY where everything in frame is brick; tilt-shift is its
  "everything is LEGO" signal (wide paths get deep focus). No look register. Pop-culture IP allowed; hard-SF photoreal
  registers (Mass Effect, Expanse, cyberpunk-space) banned; registers ~80% iconic LEGO heritage / 15% retro-fantasy / 5%
  specialty. ~54% vehicle / 46% no-vehicle with mid-X tension; nature paths carry a `*_build_technique` axis as the
  anti-photoreal guard. Paths come from `pools.PATHS` (go-live trap: `SKIP_LEGACY_PER_PATH`, §2.5). Wrapper (2026-09-30): a 28-word prefix +
  its own 12-word `mediumStyles.photography` (the shared DB photo fragment carried "accurate skin tones, photographic
  realism"); templates ask 100-140 words; prompts ~257 words. balloon-festival
  says "balloon", never "envelope". airfield-biplanes: no register axis, hand-authored camera pool.
- **ChibiBot**: adorable CRITTERS only (real + fantasy creatures), villages and cozy scenes; NO humans of any kind,
  children included; cultural diversity lives on mythic creatures. Polished 3D designer-collectible register, chibi
  proportions, light honest to the time-of-day axis. HYBRID bot: 13 pure-style cute-film looks over the
  composition-neutral `chibibot_neutral`; `CHIBI_LOOK_PATHS` = every pathBuilders key except creature-world (a new path
  auto-gets looks). Keep the override block terse. Creature pool `cute_creatures_unified.json` (tagged, no CHILD tag;
  generator `scripts/gen-seeds/chibibot/gen-cute-creatures-unified.js` bans humans). creature-* outing family off one
  archetype (amusement-park, beach-day, camping, snow-day, county-fair, birthday-party, autumn-day, lantern-festival,
  school). Templates carry one-line HARD RULES + STORY BEAT blocks. Gotchas: outings drop to one hero unless entries are
  trio-forced; season drift unless the detail pool locks it; sky-village grounds ~2/6. Ban-exempt (gpt-2 + banana). Seasonal:
  Fall ×2 (creature-autumn-day, chibi-pumpkin-patch), Halloween ×5.
- **DinoBot**: photoreal prehistoric wildlife documentary. Standing cattle-lexicon purge (adult/juvenile/feeding,
  fern-plain/araucaria/cycad; never bull/calf/grazing/savanna/acacia/baobab); `SPECIES_ANCHOR` anchors obscure genera.
  `bannedPhrases` blocks human/hunter/explorer/tourist words: audit pools against it. The PALEO_LANDSCAPE template
  hardcodes a warm-earth palette (incl. "amber"), so a biome-pool rewrite alone changes nothing; the medium says
  "cinematic 35mm FILM still", so avoid "film" in pools. amber-forest DEACTIVATED 2026-09-25. Banana-exempt.
- **DragonBot**: strict high fantasy (LOTR / Skyrim / Witcher / Warcraft / D&D). Purge pirates, firearms, steampunk,
  Rococo, Bloodborne-Victorian, Greek-myth-specific creatures (pegasus, cerberus, cyclops, sphinx; keep minotaur, hydra,
  chimera, manticore). No real-world ethnicity on characters. `surreal` vibe removed bot-wide. `FANTASY_RACE` /
  `WARRIOR_SKIN` / `FEMALE_WARRIORS` are shared with the FROZEN artsy-girl path: don't edit. dragon-scene is the canonical
  subject-as-hero reference (identity + action + landscape + surprise, drama gate 0.4, Western-dragon anatomy lock in the
  template). Character paths use FEMALE_/MALE_ADVENTURER with an empty prefix and polish skipped, and carry the POSE-CLARITY
  LOCK. dragon-lore: ONE relic hero, colours-only `DRAGON_LORE_PALETTE`. arcane-library: cozy high-elven library in the
  Alan Lee + John Howe voice, intimate, eye-level, candle/brazier/fey light only.
- **DreamBot**: purely the bubble-bot robot (`bubble-bot-dreams`, `-warm` + crossovers). Axes: bot body / DOME (the #1
  variety lever) / eyes / pose + dream world / world detail ×2 / light / atmosphere ×2; dome-mirrors-world is a template
  mandate.
- **EarthBot**: real-Earth landscape, the only bot where documentary realism is the lane. ZERO HUMANS + ZERO HUMAN-BUILT
  FEATURES blocks in `archetype-templates.js`; Flux suffix `'uninhabited landscape, no text, no watermarks'` (no "no
  humans" tokens). Medium `earthbot_wow` (lush-professional-graded; revert copy in memory
  `feedback_earthbot_bold_wow_medium.md`). Chaos off, polish off, `cycleAllPaths`. Scene-as-hero beats 3-tier depth for
  landscape wow (subject 60-70%+, no near-foreground prop axis). Regional prefixes are "<Region> raw nature, photograph".
  epic-vista is the canonical landscape reference. No "fire" noun in autumn pools.
- **FaeBot**: painted fantasy (`painted_fantasy_novel`); creatures have a full beautiful face with real eyes and hair; no
  kodama; no animal-hybrid beast-men on forest-elder (animals only as companions). Village templates carry the "EVERYONE
  IN THE SCENE IS FAE" named-figure rule. The bot medium names artists, so no flux-2. "Tiny" renders naked cherubs here.
  Action paths need a path-own medium (the "soft ethereal dreamy" register gives sober pinups). acorn-boat-regatta and
  star-charting are pro-only (documented). mushroom-apothecary is the interior reference. fae-cottage built but
  deactivated.
- **FarmBot**: cozy farm life; rebuilt 2026-09; animals get EQUAL spotlight with people. Function-form paths; look
  register over `FARMBOT_COZY_NEUTRAL`; look entries carry no time-of-day/weather words. flux-2-flex only. Seasonal: Fall ×6
  (incl. autumn-village-market + harvest-festival, moved out of `paths[]` 2026-09-29), Halloween ×5. Prompt length (2026-09-30): the medium was cut from 276 to 45 words and every brief now ends with
  `FARMBOT_LENGTH_RULE` (120-160 words, style → subject → setting); emitted prompts fell from a median ~770 words to
  ~236. AlphaBot's FarmBot-destined candidates append the same rule. The costume parade rolls 1-3 costumed kids again
  (its 2-human cap was a workaround for the fixed truncation bug; removed 2026-09-30).
- **GothBot**: Castlevania / Bloodborne / Crimson Peak / Berserk / Burton; romantic-melancholy, never horror or decay-porn.
  8 render-style looks via `GOTHBOT_LOOK_OVERRIDE`. gothic-architecture = structure-as-hero. Familiars: ravens, crows,
  owls, cats, wolves, hounds, serpents only.
- **MangaBot**: anime / Japanese-culture canon, every entry culture-canon-named. 12 hand-authored anime looks over the
  neutral medium; look-excluded style-locked paths: ghibli-countryside, ghibli-painterly, slice-of-life, samurai-era.
  Look scene paths use `CAMERA_FRAMING_MANDATORY_BLOCK`, `NO_NAMED_CHARACTERS`, `NO_GENERIC_POSE`, `CULTURAL_RESPECT`;
  polish skipped. mecha-hangars keeps its anti-T-pose crouch + anti-Mt-Fuji container. night-touge drifts ~1/3 to modern
  supercars (cars by silhouette/era, never a make). game-center-arcade: crop to shrink arcade text; "schoolgirl" flags.
  Halloween seasonal ×4. Length (2026-09-30): `ANIME_NEUTRAL` is 20 words and briefs end with `MANGABOT_LENGTH_RULE`
  (110-150); prompts ~230 words. Isekai no longer uses game status windows or any on-screen UI (Kevin 2026-09-30: they
  render as gibberish text); scene-leaning camera pools cap face-fills-frame close-ups at ~5%.
- **OceanBot**: every seed has a hero (animal or monumental formation); bioluminescence = lighting, aurora = backdrop;
  active behaviour over passive cruising; tiny subjects ≤20%; named iconic coasts. deep-wonder pins `oceanbot_deep_glow`
  with its own `vibesByPath`. Framing pools were hand-purged of scene-dissolving entries (any regen needs the framing sweep
  again). mystical-mermaid is builder-only.
- **OutlawBot**: a dark (not public) western bot, 3 paths (frontier-town, gunslinger-male, gunslinger-female).
- **PixelBot**: pixel PAINTINGS in the style of classic game title/splash/loading screens (Final Fantasy splash, Ultima):
  whimsical, magical, old-school; NOT realistic geology (EarthBot's lane). Farm content belongs to FarmBot. Scene wiring
  derives from ONE map (`scenePaths.js` + `SCENE_PATHS`): medium `pixelbot_painting`, `SCENE_MODELS`, chaos + polish off;
  build with `scripts/_pixelbot-scene-render.js` and never touch shared files; never `--only camera` on scene gens. HARD
  FAIL only for fully smooth painting/vector/photo/3D. Looks = era sub-styles (SNES splash, VGA, Ultima tile, Amiga, HD
  voxel). Text is the #1 risk: keep everything pictorial. floating-market-canal is the GOODS LAW + crosswise reference;
  pixel-ruins holds the safe glowing-relief formula. castle-town-gate DISABLED (trips every Flux checker). volcano-forge
  and pixel-campfire-night exclude ultra. Shadow: cozy-farming-life-sim. Halloween seasonal ×6.
- **StarBot**: cinematic sci-fi awe (vistas, alien worlds and cities, megastructures, ships, explorers, and the ex-MechBot
  cyborg/robot paths). Default medium `starbot_hyperreal` (portrait bias on characters); explorers on `canvas` with
  sealed-armour outfits; space-femme on its own medium with NO artist names; real-space on `real_astro`. cozy-sci-fi-interior
  is the ONE warm path (function form, no epic-awe blocks, 3+ sci-fi anchors so it isn't a cottage). spacewalk: composed
  awe or composed momentum only, bright planet-limb backdrop, no chores/contortions/wires/debris. No "hauling on a wire"
  trope anywhere. space-opera has a 60% BATTLE_DYNAMICS layer. Shadow: space-rogue (painted alien bounty hunter in a
  venue; species noun + role noun, bounty-hunter kit, `shapeKit` silhouette cue; awaiting Kevin's verdict, then scale and
  promote). Gotchas: ship-hull text, first-contact saucers (~1/6), gas-giant cliffs (~1/6).
- **SteamBot**: steampunk Victorian-industrial worlds (Victorian EARTH, so a full visual skin-tone range is correct). 6
  full-colour looks over `steambot_neutral`. Women stay glam but no romance-cover medium and no posed hero shot:
  characters candid mid-task at ~20-35% of frame in a populated, in-focus world. Men "varied, handsome, mixed ages".
  Airships are in the SKY, never age-of-sail ships at sea. steampunk-curio = STILL mechanical automata at rest in a
  lived-in room. brass-glasshouse is pro-only (documented) with its own medium. Crowds on flux-1.1 must be sparse and
  distant. Since 2026-09-30 `steambot_neutral` names no text-shaped objects (no gears, gauges, clockwork); a path whose
  premise is clocks names them in its own text. Chaos skipped on steampunk-labs, steampunk-spectacle, brass-glasshouse.
- **TinyBot**: tiny whimsy SCENES (not macro zoom on one object), strict NO humans (cute critters only; cute-bug
  allow-list, spider words banned; `TINY_CREATURES` is shared by ~8 paths). snow-globe-world (moved from ToyBot) is the
  CONCRETE-BUT-CROPPED reference. Seasonal: Fall ×1 (tiny-pumpkin-patch), Halloween ×4. The macro wrapper ("tilt-shift macro lens") was
  measured 2026-09-30: live posts mostly read as tiny scenes (≤2/10 close-ups); a "whole tiny village" rewording
  drew tiny townspeople, so the wrapper stays.
- **ToyBot**: NOT a no-humans bot (peg-people, tin soldiers, dolls are on-brand). Shallow depth of field is on-register.
  Material-tradition paths name the tradition (Waldorf/Grimm's wood, Masudaya/Yonezawa litho tin). wooden-toy-land
  deactivated. ultra excluded from camera-height/condition paths. Halloween seasonal ×4.
- **YumBot**: kawaii food with faces; strict no humans (residents are food-characters). Look register over
  `yumbot_food_neutral`; function-form paths open with `YUMBOT_LOOK_OVERRIDE`. Shared helpers `YUMBOT_NIGHTTIME_BLOCK` /
  `YUMBOT_LOOK_OVERRIDE`. Locks: mini-chef food wears nothing (no hats/aprons); koi-pond creatures are not foods; the
  coquette palette lock. Storefront/menu scenes leak ~1/6 text. Ban-exempt (gpt-2 + banana via `yumbot_gpt_clean`).
- **Removed**: MechBot and RetroBot (2026-09-24; accounts and storage kept; the 8 MechBot paths live on StarBot). 18 paths
  across 9 bots were cut 2026-09-23 (commit `3c655e0f`); their lessons are kept above.

---

## 11. Open items (Kevin's calls and known debts, as of 2026-09-29)

Kevin's decisions and the work on these are tracked in `BOT_FOLLOWUPS_TRACKER.md`; remove an item here once it's done.

- **Prefix/medium cruft audit is overdue** (last documented 2026-06-02): 38 of 94 `promptPrefixByPath` entries exceed 120
  chars (24 are DragonBot's, incl. the 5-artist ~480-char dragon-scene prefix) and 62 of 114 `mediumStyles` exceed 250.
  Nothing is cut off at the front (prefix and medium always come first); the cost is that the scene starts later. On
  279 of 481 live + seasonal paths the fixed style text alone runs past ~55 words (about CLIP's 77-token window, the
  short reader that only sees the start of the prompt). Separately, FLUX.1 models read only ~512 tokens (~380 words):
  in the two weeks to 2026-09-29, BrickBot 21/62, MangaBot 22/66, FaeBot 13/232, YumBot 8/45 and PixelBot 7/53
  successful prompts ran longer, so their endings (often the suffix) were likely never read.
- **Bot-wide wrapper defects still live**: FaeBot's suffix "dreamy dappled light … no text, no watermarks" (warm cast +
  watermark leak); BloomBot `shared-blocks.js` "lush abundant blooms filling the frame" frame-packing mandate. Pilot any
  fix on ONE path.
- **Fleet `vibeDirective.slice(0, 250)`**: only YumBot was cut to 150; not a fleet rule, noted in case length work resumes.
- **Decided 2026-09-29, leave alone** (tracker D): the AUTHORITY wording in five bots' look blocks (0 refusal-style
  prompts in ~3,000 bot renders over 30 days), the fleet "no text, no watermarks" suffix (inconclusive A/B; revisit
  after the per-bot length clean-ups), two-pass polish on four DragonBot paths (dragon-scene is the hearted reference),
  and DinoBot's flux-2-pro on night/storm paths (check only if a bad night render appears).
