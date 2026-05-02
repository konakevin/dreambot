# DLT Recipe Backfill — Plan

**Status: PLANNING (script not yet written)**

**Goal:** retroactively populate `uploads.recipe` for every bot post that was created before Phase 1 of the DLT recipe architecture shipped, so DLT-replay works against any post in the feed (not just newly-rendered ones).

**Reference:** [DLT_RECIPE_PLAN.md](./DLT_RECIPE_PLAN.md) for the new-post capture flow this is mimicking.

---

## What the live capture does (the target to replicate)

When `botEngine.runBot()` renders a NEW bot post, it captures rolled values verbatim via `buildRecipe()`. The full pipeline:

1. `model` ← `pickModel(...)` or `bot.modelByPath[path]` (Replicate model used for THIS render)
2. `mediumKey` ← `resolveMedium({bot, path})` — `bot.mediumByPath[path]` > weighted-random from `bot.mediums`
3. `vibeKey` ← `resolveVibe({bot, medium, path})` — `vibesByPath[path]` > `vibesByMedium[medium]` > `bot.vibes`
4. `sharedDNA` ← `bot.rollSharedDNA({vibeKey, picker})` → `scenePalette` + `colorPalette`
5. Path-builder rolls internal pools (camera, lighting, action, anchors, etc.)
6. `chaosBlock` ← `buildChaosBriefBlock(rollChaos(...))` — random
7. `sensoryBlock` ← `buildSensoryBriefBlock(rollSensoryAnchors(...))` — random
8. Sonnet → middle prose
9. Optional Haiku polish
10. Compose `finalPrompt = prefix + medium_style + middle + suffix`
11. `buildRecipe()` writes the freeze-frame.

---

## What we CAN recover for an OLD post (per field)

| Recipe field | Live source | Backfill source | Confidence |
|---|---|---|---|
| `version` | constant `1` | constant `1` | 100% |
| `model` | runtime | `ai_generation_log.model_used` (LEFT JOIN on upload_id) if present; else `'black-forest-labs/flux-dev'` default | medium |
| `flux_seed` | Replicate response | NOT in DB anywhere | none — leave `null` |
| `medium_key` | rolled | `uploads.dream_medium` | 100% |
| `vibe_key` | rolled | `uploads.dream_vibe` | 100% |
| `ai_prompt` | composed | `uploads.ai_prompt` | 100% |
| `prompt_prefix` | bot config | re-resolve from bot config NOW (`bot.promptPrefixByMedium?.[medium] ?? bot.promptPrefix`) | high (caveat: bot config drifts over time — see "Config drift" below) |
| `medium_style_override` | `bot.mediumStyles[medium]` | re-resolve from bot config NOW | high (same caveat) |
| `prompt_suffix` | bot config | re-resolve from bot config NOW | high (same caveat) |
| `bot_username` | `bot.username` | derived: look up `users.username` for `upload.user_id`, match against the bot username list | 100% |
| `path` | rolled | NOT in DB | none — leave `null` |
| `camera` | path-builder rolled | NOT in DB | none — leave `null` |
| `lighting` | path-builder rolled | NOT in DB | none — leave `''` |
| `scene_palette` | rolled in `rollSharedDNA` | NOT in DB | none — leave `''` |
| `color_palette` | from `bot.pools.VIBE_COLOR[vibe]` | re-derive from bot's `pools.js` (require it, look up by vibe key) | medium |
| `chaos_block` | rolled | NOT in DB | none — leave `null` |
| `sensory_block` | rolled | NOT in DB | none — leave `null` |
| `blow_it_up_block` | path-builder rolled | NOT in DB | none — leave `null` |

### Why the missing fields are OK for DLT

DLT recipe-replay locks **medium_key + vibe_key + medium_style_override + prefix/suffix** at the consume side. With those captured, the resolved medium identity reproduces correctly. The missing camera/lighting/palette/sensory just mean the DLT result may not match the SPECIFIC atmospheric particulars of the source — but the MEDIUM identity (the load-bearing thing) reproduces.

This is the same trade-off the live capture already accepts for V4-pipeline user posts (Phase 2.2a leaves those fields null too — the V4 compiler doesn't surface them outside its own scope).

---

## Config drift detection

The bot's `mediumStyles[medium]` can change over time. If we re-resolve from the CURRENT bot config and write that value to a recipe whose `ai_prompt` was built from the OLD config, the recipe is internally inconsistent.

**Detection:** verify that `bot.mediumStyles[medium]` (current) appears as a substring in `row.ai_prompt`. If yes, no drift — write the recipe with confidence. If no, the bot config has drifted and we need to be careful.

**Two strategies for drifted rows:**

A. **Skip them** — leave `recipe = NULL`. DLT falls through to the existing style_summary path. Zero regression but no win for this row.

B. **Backfill anyway with a `backfill_status: 'config_drift'` marker** — writes a recipe but flags it so we can audit/revert later. DLT-replay will use the CURRENT mediumStyles override, which may render the source slightly differently than the original did, but still in the right medium family.

**Default: strategy A (skip drifted rows).** Strategy B is opt-in via `--allow-drift`.

---

## Algorithm

```text
Phase 1 — Discovery (read-only):
  bots ← load all scripts/bots/*/index.js
  bot_username_to_module ← { bot.username: bot, ... }
  bot_user_ids ← query users WHERE username IN (Object.keys(bot_username_to_module))
  candidate_rows ← query uploads WHERE
    user_id IN (bot_user_ids)
    AND recipe IS NULL
    AND ai_prompt IS NOT NULL
    AND dream_medium IS NOT NULL
    AND dream_vibe IS NOT NULL
    AND created_at >= '2026-04-15'   -- skip pre-bot-engine-V2 rows; not worth it
  print: per-bot row counts + total
  print: 5 sample row metadata + ai_prompt snippet

Phase 2 — Per-row synthesis:
  for each row in candidate_rows:
    bot ← bot_username_to_module[username_of(row.user_id)]
    medium ← row.dream_medium
    vibe ← row.dream_vibe

    medium_style_override ← bot.mediumStyles?.[medium] ?? ''
    prompt_prefix ← bot.promptPrefixByMedium?.[medium] ?? bot.promptPrefix ?? ''
    prompt_suffix ← bot.promptSuffixByMedium?.[medium] ?? bot.promptSuffix ?? ''
    color_palette ← (try) require(bot/pools.js).VIBE_COLOR?.[vibe] ?? ''

    drift_detected ← (medium_style_override.length > 30) AND
                     !row.ai_prompt.includes(medium_style_override.slice(0, 60))
    if drift_detected and not allow_drift:
      skip row  (status: 'skipped_drift')
      continue

    log_row ← (try) ai_generation_log WHERE upload_id = row.id LIMIT 1
    model ← log_row?.model_used ?? 'black-forest-labs/flux-dev'

    recipe ← {
      version: 1,
      model, flux_seed: null,
      medium_key: medium, vibe_key: vibe,
      prompt_prefix, medium_style_override, prompt_suffix,
      camera: null, lighting: '',
      scene_palette: '', color_palette,
      chaos_block: null, sensory_block: null, blow_it_up_block: null,
      bot_username: bot.username, path: null,
      ai_prompt: row.ai_prompt,
      _backfilled_at: <ISO now>,
      _backfill_version: '1',
      ...(drift_detected ? { _backfill_status: 'config_drift' } : {}),
    }

    UPDATE uploads SET recipe = recipe WHERE id = row.id

Phase 3 — Reporting:
  print final tallies: processed / updated / skipped_drift / errored
```

---

## Safety guards (all enforced)

1. **Dry-run by default.** `--execute` required to actually write.
2. **Scope filter** — only `user_id IN (bot_user_ids)`. User posts are NEVER touched by this script.
3. **Idempotency** — `recipe IS NULL` filter ensures we never overwrite an existing recipe (Phase 1 captures, prior backfill runs).
4. **Per-row UPDATEs**, never bulk UPDATEs. One row failing doesn't cascade.
5. **Per-row try/catch.** Errors are logged + counted, run continues.
6. **Throttle:** small batches (default 25), sleep between (default 500ms). Tunable via flags.
7. **`_backfilled_at` marker** stamped into every backfill recipe → enables revert + audit.
8. **`--limit N` flag** to slice off small subsets for testing.
9. **No external API calls** — no Anthropic, no Replicate. Pure DB + filesystem (bot config require). Cost: zero.

### Revert capability

```sql
-- Audit: how many rows have backfill recipes
SELECT count(*), recipe->>'_backfill_version'
FROM uploads
WHERE recipe->>'_backfilled_at' IS NOT NULL
GROUP BY 2;

-- Revert all backfill recipes (any version)
UPDATE uploads SET recipe = NULL
WHERE recipe->>'_backfilled_at' IS NOT NULL;

-- Revert just one version (if we ship a v2 backfill later)
UPDATE uploads SET recipe = NULL
WHERE recipe->>'_backfill_version' = '1';
```

---

## CLI shape

```
node scripts/backfill-recipe.js                              # dry-run, all candidate rows
node scripts/backfill-recipe.js --limit 10                    # dry-run, slice
node scripts/backfill-recipe.js --bot cuddlebot               # filter to one bot
node scripts/backfill-recipe.js --execute --limit 5           # actually write 5 rows
node scripts/backfill-recipe.js --execute                     # full run
node scripts/backfill-recipe.js --execute --allow-drift       # include drifted rows (flagged)
node scripts/backfill-recipe.js --execute --batch 25 --gap 500
```

---

## Validation steps before declaring success

1. **Dry-run on 10 rows.** Manually verify the synthesized recipe shape per row looks right.
2. **Execute on 5 rows** (`--execute --limit 5`).
3. **Manually DLT one of those rows from the app.** Verify result renders in the source's medium (no canvas fallback).
4. **Audit:** `SELECT count(*) FROM uploads WHERE recipe->>'_backfilled_at' IS NOT NULL` returns 5.
5. **Compare a backfilled row's recipe vs a Phase-1 captured row's recipe** for the same bot — confirm shape parity (sparse fields null, load-bearing fields populated).
6. **Run full execute** only after steps 1-5 pass.
7. **Spot-check 10 random backfilled rows in the app** — DLT each, confirm medium reproduces.

---

## Out of scope (explicit non-goals)

- **User posts.** They have NULL recipe; DLT falls through to existing style_summary. Building a synthesis path for arbitrary user posts requires a different strategy (no bot config to draw from). Future work, separate plan.
- **Recovering camera / lighting / palette / sensory_block / chaos_block.** Those rolled values aren't in the DB. We accept sparse recipes.
- **Re-running Sonnet to reconstruct the middle prose.** ai_prompt already has it.
- **Re-rendering the image.** This is a metadata backfill, not a re-render.

---

## Future extensions

- **Per-bot path inference.** If a bot has stable `mediumByPath` mapping, we could often recover `path` from `dream_medium` (e.g., cuddlebot's `plush_fabric` → `plushie-life`). Adds slight fidelity. Not load-bearing for DLT.
- **Color palette derivation.** Each bot's pools.js exports VIBE_COLOR. We can require those to populate `color_palette`. Already in the algorithm above as best-effort.
- **Heuristic `path` recovery.** Match `ai_prompt` against per-path action pool entries to guess the path. Risky / brittle. Skip for now.
- **Add a `backfilled` boolean column to uploads.** Cheap audit instead of recipe-jsonb introspection. Defer until needed.

---

## Status tracker

- [ ] Plan reviewed and approved by Kevin
- [ ] Script `scripts/backfill-recipe.js` written
- [ ] Dry-run on 10 rows reviewed
- [ ] Execute on 5 rows
- [ ] Manual DLT verification on 1 backfilled row → renders in correct medium
- [ ] Full-run execute
- [ ] Spot-check 10 random rows
- [ ] Marker-based revert plan documented in CLAUDE.md or runbook
