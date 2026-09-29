# LLM migration: Sonnet 4.6 → 5.5 (status of record)

Plan: `~/.claude/plans/soft-wiggling-moon.md` (approved 2026-09-28). Each job moves to 5.5 only after its own measured
parity gate; nightly moves last and only on Kevin's word. A job that fails a gate stays on 4.6, which is supported
until at least 2027-02-17.

## Status

| Step | State |
|---|---|
| 0. One client per runtime, every production call on it, still 4.6 | **Deployed 2026-09-29 ~03:45 UTC** (mig 574). The 48h production smoke is running. |
| 1. Text parity bench (QA override only) | Not started |
| 2. Render parity + blind A/B | Not started |
| 3. Staged rollout by config | Not started |
| 4. Cleanup (defaults → 5.5, offline scripts) | Not started |

## How switching works

Callers name a **job**, never a model. The model for a job comes from, highest first:

1. **QA override**, per request: Create body `qa_llm_model`, nightly `force_llm_model`, scripts `--llm-model` or
   `LLM_MODEL_OVERRIDE`. The value is `"model"` or `"model@effort"`. It swaps only the jobs whose default is Sonnet 4.6.
   Haiku jobs (the swap probes, the polish pass) keep Haiku, so a parity render changes one variable.
2. **`engine_config.llm_preview_models`**, for an account in `llm_preview_user_ids`. A bot is a user, so AlphaBot
   canaries a model this way.
3. **`engine_config.llm_models[job]`**
4. The job's **code default**, which is the model that call used before the client existed.

```sql
-- move one job (live within the 60 s config cache, no deploy)
UPDATE public.engine_config SET llm_models = llm_models || '{"create_brief": "claude-sonnet-5-5@medium"}' WHERE id = 1;
-- roll it back
UPDATE public.engine_config SET llm_models = llm_models - 'create_brief' WHERE id = 1;
-- everything back to code defaults
UPDATE public.engine_config SET llm_models = '{}', llm_preview_models = '{}' WHERE id = 1;
```

A configured model the client has no profile for is ignored (the default runs) and stamped `llm_config_invalid`.

## The clients

- Edge: `supabase/functions/_shared/anthropic.ts` (`callClaude`). `callSonnet` (`llm.ts`) is a thin wrapper that
  keeps its old contract: the 1/3/10/30 s retry ladder, the 10-character floor, and the Haiku fallback.
- Node: `scripts/lib/anthropic.js`, a mirror. `__tests__/lib/anthropicClientParity.test.ts` fails CI if the two
  send different bodies or read replies differently.
- **Model profiles** own the request body.
  - 4.6 and Haiku send byte-for-byte the old bodies (locked in `__tests__/lib/anthropicClient.test.ts`).
  - 5.5 adds `thinking: {type: "between_tools"}` and `output_config.effort`, and scales `max_tokens` ×1.35.
  - No profile sends a prefill or sampling params.
- **Replies** are every `text` block joined, never `content[0]`. A refusal, an empty reply, or a reply under the
  call's minimum fails that model, and the chain moves on: routed model → the job's default → its fallbacks.

## Jobs

| Job | Default | Fallback | Where |
|---|---|---|---|
| `create_brief` | 4.6 | Haiku | generate-dream: description / new scene / dual / solo / text |
| `create_slots` / `nightly_slots` | 4.6 | Haiku | characterSlotPrompt, picked by surface |
| `nightly_brief` | 4.6 | Haiku | nightly-dreams legacy brief |
| `outfit_reader`, `scene_split`, `location_beat`, `restyle_brief` | 4.6 | Haiku | outfitSpec, promptSceneSplit, locationActionBeat, restyle-photo |
| `essence_card` | 4.6 | none | essenceCards (behind `essence_card_generation`, off) |
| `quality_gate`, `scene_people` | 4.6 | none | qualityGate (fail-open) |
| `cast_describe`, `cast_ethnicity`, `cast_hair` | 4.6 | none | describe-photo |
| `pet_describe`, `photo_describe`, `photo_classify`, `probe_genders`, `probe_wardrobe`, `style_distill`, `style_extract`, `inbox_title`, `prompt_enhance` | Haiku | none | not migrating |
| Node `bot_prompt` | 4.6 | Haiku | botEngine brief |
| Node `bot_polish`, `bot_nudity`, `bot_style_distill` | Haiku | (polish → 4.6) | botEngine two-pass, nudityCheck, styleDistiller |

`style_extract` and `inbox_title` have no request context, so only their code default applies.

## Stamps

Edge stamps go to `ai_generation_log.fallback_reasons`; bot stamps go to `bot_run_log.llm_models`, space-separated.

- `llm:<job>:<model>`: who answered.
- `llm_fallback:<job>:<from>→<to>:<kind>`: a model failed and a later one in the chain answered.
- `llm_refusal:<job>:<model>:<category>`: the model refused.
- `llm_truncated:<job>:<model>`: `stop_reason` was `max_tokens`.
- `llm_failed:<job>:<kind>`: every model in the chain failed.
- `llm_config_invalid:<job>:<value>`: a configured model id with no profile, ignored.
- `qa:llm_model:<model>` or `qa:llm_model_ignored:<value>`: a QA override was applied, or rejected.
- `llm_preview`: this account got the preview routing.

`check-ai-failures.js` leaves the routine `llm:` stamp out of its top-reasons tally.

## Step 0 verification (2026-09-29)

- `npm run check` green: 249 suites, 4,795 tests. The Deno check is clean on all 17 functions and `slot-golden.json`
  is unchanged.
- Real API, through the client:
  - 4.6 default and 5.5 (override, `medium` and `high`) both answered with text. No fallback; 5.5 was faster
    (1.5 s against 2.2 s).
  - The quality gate read the same on both models.
- Deployed functions:
  - Nightly dry runs are stamped on every call: `llm:nightly_slots`, and `llm:location_beat` where a beat ran. All
    on 4.6, no fallbacks.
  - `force_llm_model` routes `nightly_slots` to 5.5 cleanly.
  - The Create queue canary passes 2 of 2 with `llm:create_brief:claude-sonnet-4-6`.
- Bots: an AlphaBot dry run on 4.6 and on `--llm-model claude-sonnet-5-5`; the wrapper returned the right models and
  stamps.
- Not exercised live: describe-photo needs a user JWT. It is covered by the unit tests, and Kevin's next cast upload
  is its first live run.

## Findings the stamps surfaced

1. **Create plain-text briefs truncate on 4.6 today.** `promptCompiler.ts:614` caps the text-prompt brief at
   `maxTokens: 200`, while the solo and couple builders get 450 and 500. The canary hit `llm_truncated:create_brief`
   2 of 2 times (a ~940-character prompt, with the last clause lost). This is pre-existing and not changed in step 0.
2. **Essence cards have been dead since 2026-05-11.** The generator pre-filled the reply with `{`, and 4.6 rejects
   that with a 400. The fixed generator ships behind `engine_config.essence_card_generation` (off). Turning it on
   changes nightly, so it's Kevin's call.

## Deviations from the plan

- HumanBot and GlowBot are retired (their workflow has been manual-only since 2026-05-22), so they keep their own
  fetch, pinned to 4.6 through `models.js`.
- Offline helpers (`seedGenHelper.generatePool`, `reseed/lib/core.js`) keep their own retry loops. They build the
  body through the model profile and read every text block, so `--llm-model claude-sonnet-5-5` works offline.
