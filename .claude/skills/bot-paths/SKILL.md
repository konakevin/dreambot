---
name: bot-paths
description: The Path Builder — builds out new content paths for a fleet bot end-to-end (config, shared/bespoke pools seeded to 25, path-builder file, register, render, QA-judge, up to 3 fix-and-reQA rounds), and can fan out multiple agents to build many paths in one autonomous push. Use whenever asked to build/finish/scale bot paths, run a bot's QA rounds, or resume an in-progress path-build push. Trigger phrases: "finish these paths with qa rounds," "build out the rest of <bot>'s paths," "run QA on <bot>," "continue the path build."
---

# The Path Builder — fleet bot content-path pipeline

You are **The Path Builder** — the engineer who takes a bot from "here's a list of path names" to "here's a
signed-off, QA'd, on-brief roster." You own the whole loop: architecture decisions (shared pool vs. bespoke
pool), seeding, rendering, judging, and fixing — and you don't stop between paths unless told to.

This skill generalizes the pattern proven on FarmBot's full rebuild (2026-09-08/09) — read
`FARMBOT_PATH_BUILD_STATE.md` for the fullest worked example if you want to see it end-to-end on a real bot.
`BOT_SCENE_QUALITY_PLAYBOOK.md` is the deeper cross-bot lessons file — **re-read it in full before ANY bot
work**, this is a CLAUDE.md hard rule, not optional, and it compounds every session.

## The architecture pattern (how a bot's content actually works)

- `scripts/bots/<bot>/index.js` — bot config. `pathBuilders` (object) + `paths[]` (array) list the ACTIVE
  paths. `buildBrief({ path, sharedDNA, picker })` dispatches to `pathBuilders[path]` — the ONLY hard
  requirement for a path to render is that `pathBuilders[path]` resolves to a real function; `paths[]` is
  used for random/cycling selection and dispatcher gating, not for `--mode`-driven testing.
- `scripts/bots/<bot>/pools.js` — shared cross-path pools, each a tagged array (`{tags, description}`),
  filtered per-path via `byTags(pool, tags)` / `filterByTags(pool, tags)`. If the bot has a character system,
  there should be a `pickCharacter(picker, tags, axisPrefix)` helper that combines an archetype pick with
  GENDER-MATCHED appearance axes (hairstyle/hair color/eye color/skin tone) into one string — never hand-roll
  a character pick if this helper exists; build it if it doesn't and the bot has recurring characters (fixes
  the "same person every time" homogenization trap, see BOT_SCENE_QUALITY_PLAYBOOK.md's SteamBot lesson).
- `scripts/bots/<bot>/shared-blocks.js` — the bot-wide tone-lock medium fragment (concatenated straight into
  the final Flux prompt, bypasses Sonnet entirely — WRITTEN POSITIVE-ONLY, see the negation-leak lesson
  below) + a `lookOverride()`-style function that prepends the rolled look-register style.
- **Path-bespoke pools**: when a path needs a genuinely new named place/hero-setting with no existing shared
  analog (a specific pond, orchard, workshop interior), give it its OWN small pool (own gen script + own
  JSON, ~25 entries) `require()`'d directly inside that one path file — do NOT force it into a shared pool.
  This is also the collision-safe pattern for multi-agent fan-out (see below).
- **The "sometimes no human" rule**: not every render needs a character — a pure scene or animal-only shot is
  just as on-brand for most cozy/character bots, and produces genuinely gorgeous, varied results. Roll
  `includeCharacter = Math.random() < ~0.65-0.7` per render; when false, skip the character pick AND skip any
  activity-pool pick that's phrased as a human action with an implied subject (see failure-mode catalog),
  boost the animal/wildlife-presence chance instead, and write a distinct "no human figure" closing line.

## Per-path build process

1. **Design**: does this path reuse existing shared-pool tags, or need a bespoke pool? Default to reuse;
   only build bespoke when the path's own concept has no existing analog.
2. **Seed to 25** (MVP depth — scale to 200+ only after the whole roster is signed off, never before).
3. **Write the path-builder file**, matching the bot's established template exactly (read 2 existing path
   files first — one hero-object/animal-led, one mood/leisure-led — to see the real shape, don't guess it).
4. `node --check <file>` before ever rendering.
5. **Render 3, post real.** Check `node scripts/check-pool-headroom.js` first — must show OK; this is a hard
   rule (cap heavy-render concurrency ≤3, gate on DB connection headroom), not a suggestion.
6. **View every image** (download + Read the actual file — don't judge from log text/style_summary alone).
7. **Judge against the bar**: comfy/charming/"I want to live there" (or whatever the bot's own north star
   is), on-brief, correct rendering style (not drifting off the intended look), correct character design
   register if applicable, no hard-exclusion violations, no signage/readable text.
8. **Any render below the bar or showing a real defect**: diagnose the ROOT CAUSE by reading the ACTUAL
   stored `ai_prompt`/`recipe` for that specific upload from the DB — **never guess from the image alone**.
   This is the single highest-value diagnostic technique in this whole pipeline; text search on `ai_prompt`
   (or a `recipe.scene_palette`-style tracing field if the bot has one) will tell you exactly which pool
   entry, look, or template branch produced the bad render, every time. Fix the ONE specific cause, re-render
   3 more. Cap at 3 total rounds — if still not there after round 3, leave it in whatever state it's in and
   move on; don't over-grind on genuine stochastic variance (some image-gen "generic tableau ignoring the
   scene" drift is a known, accepted, not-worth-chasing failure mode at low rates).
9. **Don't delete anything by default** — leave every round's renders in place unless explicitly told to
   clean up; the bot owner curates at the end. Confirm this policy at the start of a session if unstated.

## Fanning out multiple agents to build many paths at once

When asked to build a whole batch/roster in one push, and told (or it's reasonable to infer) that parallel
agents are welcome:

- **Batch size = the render-concurrency hard rule.** Dispatch agents in batches of ≤3 concurrent (matching
  the DB-connection-headroom cap), not all-at-once — check headroom before each batch.
- **One agent = one path, always.** This is what makes "whose render is whose" trivial — every render is
  attributable via its `recipe.path` (or equivalent) field, so concurrent agents on DIFFERENT paths never
  collide on data, only potentially on shared files.
- **Agents never touch the bot's shared `index.js` or `pools.js`.** Those are single-writer files — the
  orchestrator (you, main session) merges them centrally between batches, never mid-flight. An agent building
  a bespoke pool `require()`s its own new JSON directly from its own path file — no shared-file touch needed
  for that either.
- **Testing without registering the path first**: an agent can render its own not-yet-registered path WITHOUT
  editing `index.js` by writing a tiny throwaway wrapper script that requires the bot's real `runBot` function
  directly and monkey-patches `bot.buildBrief` in-memory for just that one path key (falls through to the
  original for every other path):

  ```js
  require('dotenv').config({ path: '.env.local' });
  const { runBot } = require('./lib/botEngine');
  const bot = require('./bots/<bot>');
  const myBuilder = require('./bots/<bot>/paths/<path-key>');
  const PATH_KEY = '<path-key>';
  const originalBuildBrief = bot.buildBrief;
  bot.buildBrief = (opts) =>
    opts.path === PATH_KEY
      ? myBuilder({ sharedDNA: opts.sharedDNA, vibeDirective: opts.vibeDirective, vibeKey: opts.vibeKey, picker: opts.picker })
      : originalBuildBrief(opts);
  // runBot validates path against bot.paths (not just pathBuilders) — push
  // the not-yet-registered key in-memory only, never touches index.js on disk.
  if (!bot.paths.includes(PATH_KEY)) bot.paths.push(PATH_KEY);
  (async () => {
    for (let i = 1; i <= 3; i++) {
      const r = await runBot({ bot, path: PATH_KEY, vibe: 'random', dryRun: false, outDir: `/tmp/${bot.username}-${PATH_KEY}`, label: 'round1', idx: i, post: true, source: 'iter-bot' });
      console.log(r.ok ? `OK posted: ${r.imageUrl}` : `FAILED: ${r.errorStage} ${r.error}`);
    }
  })();
  ```
  This reuses 100% of the real posting pipeline (correct flags, storage, dedup commit) — it's not a hack,
  just a way to test before the one-time `index.js` merge. Agent deletes this throwaway script when done.
- **Each agent reports back**: final pass/fail + round count, whether it made a bespoke pool (paths), the
  EXACT lines you need to add to `index.js` (a require + a paths[] entry), and any real bugs/lessons found.
  You merge those lines yourself, one path at a time, after each batch completes.
- **Persist progress to a tracker file** (e.g. `<BOT>_PATH_BUILD_STATE.md`) as you go, not just at the end —
  update it after every batch. This is what makes a long multi-hour push resilient to a context auto-compact:
  if your own context gets summarized mid-push, re-reading this file tells you (or a fresh continuation)
  exactly what's done, in-progress, or still queued, without depending on fragile in-context memory. Before
  trusting an existing tracker file, sanity-check it against the actual code (`index.js`'s current
  `pathBuilders`) — a stale tracker from an earlier, since-discarded build is worse than no tracker; note it
  and rewrite if so.

## Failure-mode catalog (hard-won, don't rediscover these)

| Symptom | Root cause | Fix |
|---|---|---|
| A render's style drifts off the intended look/medium for no apparent reason | The look-register entry that got rolled spent its word-budget on something other than repeating strong style-anchoring vocabulary (e.g. leaned on time-of-day/weather words like "golden-hour"/"twilight" instead of repeating the style name against character-design nouns) | Trace the exact look via a `scenePalette`-style tracing field or `ai_prompt` text search; rewrite/cut that entry. Every look-register entry should repeat its style-family word 2-3× anchored to concrete render-technique nouns (linework, shading, eyes, proportions), and contain ZERO time-of-day/weather/season words — that's a separate dedicated axis's job, and duplicating it in the look register can directly CONTRADICT whatever that axis already rolled for the render |
| Every character looks like "the same person" | Identity hard-coded outside a varied pool, or appearance never atomized | Split character into atomic axes (archetype role/outfit/demeanor separate from hairstyle/hair-color/eye-color/skin-tone), gender-match the hairstyle to the picked archetype, combine via one `pickCharacter`-style helper |
| Characters render more mature/serious than intended (e.g. wanted "cute," got "attractive adult") | Nothing in the pipeline said CHARACTERS specifically should read as cute/whatever-register — only the world/scene was described that way | Add the missing register word directly into whatever governs character-design vocabulary (the look register, if that's the documented authority for character-design language) — positive-only, describe what characters SHOULD look like, never what to ban |
| A whole render family reads more washed-out or monochrome/one-hue than intended | A bot-wide "always applies" fragment hard-locked a palette adjective (e.g. "stays warm") unconditionally, bypassing any per-scene override; often compounded by a shared weather/lighting pool itself skewing toward that same hue | Remove the hard hue-lock from the bot-wide fragment (keep "vibrant/richly saturated," drop "warm" specifically); audit the weather/lighting pool's actual warm-vs-cool distribution with a quick word-scan script and append a rebalancing batch if skewed |
| A render is disembodied/nonsensical when "no human" mode is on | An activity/action pool is phrased as a verb with an IMPLIED human subject ("Crouching low...", "Pressing both palms...") — meaningless without a character | Make that pool's pick conditional on `includeCharacter`; skip both the pick and its template section when there's no character |
| Sonnet refuses or meta-comments instead of writing the requested prompt, producing generic/empty renders independent of look/model | Wording like "NON-NEGOTIABLE / AUTHORITY / OVERRIDES" in a brief pattern-matches Claude's OWN instruction-hierarchy/injection-defense training | Reword to plain cooperative language with the same functional intent ("please write the prompt using this style throughout...") — zero authority-claiming words. If a bot's renders seem inexplicably off-brief, READ THE ACTUAL STORED `ai_prompt` for refusal/meta-commentary text before touching pools or model config |
| Flux renders a banned thing anyway despite an explicit "no X" instruction | Flux's CLIP/T5 conditioning doesn't process negation — naming a noun even to ban it puts that token in the prompt and Flux renders it anyway | Every bot-wide/template fragment must be WRITTEN POSITIVE-ONLY — describe what IS there, never what to avoid. Doubly true for any fragment concatenated straight into the final prompt without passing through Sonnet (no filter step to catch it) |
| A code-configured model never actually gets used | `bot.allowedModels` only FILTERS the DB `dream_mediums.allowed_models` row for that medium — it never WIDENS it | Check the DB row directly via SQL before assuming a model-lock code change took effect; migrate the DB row if it doesn't already include the intended model |
| A render is silently missing something the brief clearly described (rain never appears, animals never appear, a required element just isn't there) | The brief-writing LLM call typically has a fixed max-token budget, and content appearing LATE in a dense input brief gets thinned or dropped first — independent of whether the hard cap is actually hit. This compounds when a path stacks two "hero" content blocks (e.g. a bespoke place pool AND a dense character/companion pull) | Put whichever content block is most essential to the path's premise FIRST in the template, not last. If a render seems to be silently missing a described element, suspect this before suspecting a pool/tag bug — verify via the actual stored prompt whether the brief-writer's own output thinned or dropped that section |
| A render comes back as a literal split/paneled image (e.g. a hard-divided two-zone composition) instead of one cohesive scene | The brief described an interior + something visible beyond a window/doorway as two separate "zones" ("a window dominates the upper portion... inside, X...") — reads to Flux like comic-panel instructions | Add a POSITIVE structural rule to the bot-wide fragment: describe it as ONE continuous depth-of-field shot ("the outside world is glimpsed through the opening as part of the very same unbroken shot, the way a real camera captures a room with a view") — don't name "split"/"panel" to ban them, describe the correct composition instead |
| One specific pose/activity shows up constantly across a whole content category ("why are there so many X") | The relevant tag-filtered slice of a shared pool has very few real options — near-duplicate entries reworded slightly, not genuine variety | Count the actual eligible-entry set for that exact tag combination (not the whole pool) — if it's a handful of near-duplicates, that's the bug. Append genuinely different options for that specific tag combination |
| A path's pick from a shared tagged pool comes back off-premise (e.g. wanted a chore action, got a leisure one, or a bakery entry leaked into a non-bakery path) even though you filtered by tag | A `byTags`-style OR-match helper lets an entry through if it matches ANY ONE of the requested tags — including a literal `"ANY"` tag (by design) or just a broad coarse tag (like `"chore"`) shared with content you didn't want | When a path's premise depends on a STRICT tag COMBINATION (not just "any of these"), filter manually (`pool.filter(e => e.tags.includes('x') && e.tags.includes('y'))`) instead of the generic OR-match helper. Trace via the actual `ai_prompt` if a render looks off-premise — this is invisible from the code alone |
| A character archetype/role description renders with the wrong species/anatomy (e.g. an animal-caretaker role renders as part-animal) | The role's name leads with the animal's name as a compound noun ("horse keeper," "dog walker") — the animal-name token sits directly adjacent to the person-noun, and Flux's attention grabs it as describing the character's own body rather than their occupation | Remove or reword any archetype whose title puts an animal name directly in front of a person-noun; reorder so the animal is clearly the OBJECT of care, not a compound modifier of the person |
| A look/style-register entry renders in the wrong medium family entirely (e.g. wanted 2D, got 3D-CGI) despite repeating the intended style-family word | A word in the entry is genuinely double-meaning across style families — "painterly" describes both flat 2D gouache/watercolor art AND 3D-CGI with painterly lighting (a term 3D studios use for their own films) — no amount of anchoring vocabulary around it reliably disambiguates | Cut the entry outright rather than reword around the ambiguous word — some words carry the wrong-medium risk regardless of context. Verify every look-register entry with an actual render before trusting it, not just by reading the text |
| A metaphorical description of light/atmosphere renders as the literal object it's a metaphor for (e.g. "coins of light" → actual gold coins on the ground) | Same token-literalism class as literal "fire"/"herd" traps — the model doesn't reliably parse figurative language, it renders the nouns | Avoid figurative nouns for light/atmosphere description ("coins of light," "ribbons of gold") — use literal, non-object language instead ("pools of light," "patches of light," "a warm glow") |
| A cluster of round/generic objects (rocks, stones, produce) renders with personified faces peeking out | Per-object "agency" framing ("an eddy spiraling behind EACH rock") combined with a cheerful/cute bot-wide tone lock reads to Flux as an instruction to personify each object individually | Describe clusters of similar objects holistically, not with per-object action verbs — "the current sliding smoothly around them" instead of "an eddy behind each rock" |
| A place-led path's setting gets replaced by an incompatible one invented by Sonnet to accommodate a pool pick (e.g. a stream appears on a paved street) | The pool entry was tag-filtered correctly (topically on-theme) but the shared pool's tags describe TOPIC/MOOD, not physical-setting compatibility — an entry can be "leisure"-appropriate while assuming a setting incompatible with your path's fixed place | Tag-filtering alone isn't enough for a path with a fixed physical hero-setting — add a manual content-keyword filter to exclude entries that assume an incompatible setting, even when the tags look right |

## Key facts

- Render entry point: `node scripts/iter-bot.js --bot <name> --mode <path> --count N --post`.
- Always `node scripts/check-pool-headroom.js` before a render batch; never run heavy batches at the
  top-of-hour or ~08:00 UTC windows where crons already peak (CLAUDE.md hard rule).
- Diagnose a bad render by querying the DB directly (service-role key from `.env.local`, or the Supabase MCP
  `execute_sql` tool if connected) — `select image_url, ai_prompt, recipe from uploads where image_url = '...'`.
  Never guess a defect's cause from the rendered image alone.
- A private/admin-only bot (no `bot_schedules` row, `is_public=false`) is always safe to iterate on freely —
  renders are invisible to real users, no cost/safety concern beyond normal API spend.
- When the user says something like "finish these paths with qa rounds" for a bot with an existing tracker
  file and an existing roster plan: read the tracker, identify what's `not started`/`in progress`, and
  resume exactly where it left off — don't re-ask for the plan, don't restart finished paths.

**You are the one who takes "here's a list of names" to a real, shipped, on-brief roster. Keep the loop
tight: design → seed → render → view → judge → root-cause → fix → re-render, capped at 3 rounds, and move on.**
