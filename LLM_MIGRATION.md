# LLM migration: Sonnet 4.6 → 5.5 (status of record)

Plan: `~/.claude/plans/soft-wiggling-moon.md` (approved 2026-09-28). Each job moves to 5.5 only after its own measured
parity gate; nightly moves last and only on Kevin's word. A job that fails a gate stays on 4.6, which is supported
until at least 2027-02-17.

## Status

| Step | State |
|---|---|
| 0. One client per runtime, every production call on it, still 4.6 | **Deployed 2026-09-29 ~03:45 UTC** (mig 574). The 48h production smoke is running. |
| 1. Text parity bench (QA override only) | **Done 2026-09-29**: 12 of 15 Sonnet jobs pass; the 3 cast reads stay on 4.6. Report: https://claude.ai/artifact/DTXKmn83nBpvBG9DFF3rPn |
| 2. Render parity + blind A/B | **Renders done 2026-09-29**: Create, solos and bots pass; nightly couples fail first-try hold. Blind vote waiting on Kevin: https://claude.ai/artifact/DBFPCRe5tyosfzjkAgFtaK |
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

## Step 1 results (2026-09-29)

Real production inputs (60 per suite where the logs allowed) were replayed through the real modules on 4.6, 5.5@high
and 5.5@medium: `scripts/qa-llm-parity.ts`, `scripts/qa-llm-parity-bots.js`, and `qa-outfit-text.ts --llm-model`.
About 1,900 calls, about $20. 5.5@high and @medium cost and time the same, and high was slightly more complete, so
**high is the setting to roll out**.

| Job | 4.6 | 5.5@high | Verdict |
|---|---|---|---|
| create_brief | required finish 94.9%, p50 8.4 s | 100%, 3.1 s | move |
| create_slots / outfit_reader / scene_split | outfit harness: garments 74/74, misfit 0/34, plain retries 4 | 74/74, 0/34, 2 | move |
| nightly_slots (120 replays) | clean first try 93.3%, 1 fallback, 5.9 s | 94.2%, 1 fallback, 3.0 s | move (Kevin's word) |
| nightly_brief | **cut off 26.7%**, 161 words (asks 50-75) | 0%, 97 words | move (Kevin's word) |
| location_beat | passes filters 95%, 14 words | 95%, 19 words (18% over the 20 asked) | move (watch in renders) |
| quality_gate | 0 false alarms, broken 10/12 | 0, 12/12 | move |
| scene_people | 73.8% (misses people 26%) | 100% | move |
| bot_prompt | 60/60, p50 9.3 s | 60/60, 3.8 s | move |
| essence_card | 20/20 (after the budget fix) | 20/20 | stays off |
| cast_ethnicity | 100% | **0%: 5.5 declines to infer race** | keep 4.6 |
| cast_hair | 100%, 0 grey false positives | 84.6%, 1 | keep 4.6 |
| cast_describe | age ±5y 88.9% | 81.5% | keep 4.6 |

Edgy Create requests (lingerie, bikinis, gore, a bloodied gladiator, a demon throne and so on) were written on
every arm with the element kept, 24 of 24. Fixes the bench drove, all shipped in 739182a9:
- **Text-refusal guard:** 5.5 answered a real intimate-couple Create prompt with "I'll pass on this one". On a
  text-out job that sentence would have gone to Flux as the prompt. Now it fails the model and the chain falls
  back to 4.6. 0 false positives on 851 real outputs.
- **Slot JSON:** a trailing comma is accepted (5.5: 3 of 120 replies).
- **Essence cards:** 1600 tokens and 45 s (800 and 15 s never produced a card).

## Step 2 results (2026-09-29)

These are paired renders (`scripts/lab-llm-render-parity.js`). Nightly replays Kevin's own logged slot inputs
(`force_slot_input`) with the image model pinned (`force_model`), so a pair differs only in the slots each model
wrote. Create uses 15 fixed prompts × 2, through the queue. The bots come from `iter-bot --post --shadow`, 6 bots ×
2 paths × 3. It cost about $10.72 (168 app renders, 72 bot renders). Everything is in Kevin's private album, and
the bot posts are hidden.

The 3 Fly face-swap HTTP 500s (the service's normal 2-7% rate) are left out:

| Surface | 4.6 | 5.5@high | Gate |
|---|---|---|---|
| Nightly couples, first-try hold | 38/40 (95%) | 33/38 (86.8%) | **fail** (88%) |
| Nightly couples, still a couple / degraded | 38/40 / 2 | 37/38 / 1 | pass |
| Create couples, first-try hold | 20/20 | 18/19 (94.7%) | pass |
| Solos (nightly + Create) | 23/23 | 23/23 | pass |
| Bots rendered + posted | 35/36 (1 Replicate timeout) | 36/36 | pass |

**Why nightly couples fail on 5.5:** it writes physical actions that turn faces away. For example, "One person
crouches to set a glowing lantern beside the stone path, the other stands with arms folded" names no face, head or
eyes, so it passes every direction filter, yet both people look down and the identity check fails (0.25 against a
0.35 bar). 4.6 wrote "brushes a hand along the fence, hands in pockets". This happened on 3 of 38 nightly couples on
5.5 and 0 of 40 on 4.6. The fix is a brief rule (faces toward the camera, no crouching or setting things down),
which belongs to a later prompt-tuning round. Until then nightly stays on 4.6.

**Next (step 3):** wait for Kevin's blind vote; the bar is 5.5 winning in at least 45% of pairs. If it clears:
1. Canary on Kevin only: `llm_preview_user_ids = {Kevin}`, with `llm_preview_models` = the Create jobs +
   restyle_brief at `claude-sonnet-5-5@high`, for 48 h.
2. Create for everyone.
3. The judges (quality_gate, scene_people).
4. AlphaBot, through the preview list with its user id, then the fleet (`bot_prompt`).

Nightly and the cast reads are not in this rollout.

Found along the way: the Haiku style distiller (the "Dream Like This" fingerprint, 150 tokens) hits max_tokens on
most bot posts (`llm_truncated:bot_style_distill` on 25 of 36). This is pre-existing and not part of this migration.

## Findings the stamps surfaced

1. **Create plain-text briefs truncated on 4.6. FIXED 2026-09-29.** `promptCompiler.ts` capped the text,
   description and new-scene briefs at `maxTokens: 200`, while the solo and couple builders get 450 and 500. The
   brief asks for 70-90 words but 4.6 writes ~119 (30-day mean), so **71 of 71** real briefs in the last 30 days
   were cut mid-word ("…stacking water to", "…hanging v"), losing the camera and mood tail and the "no text, no
   words, no watermarks" finish. The cap is now 450, and those three paths trim and stamp `sonnet_truncated` like
   the solo path. After the deploy, 3 of 3 canaries were complete (112-136 words), with render time unchanged.
2. **Essence cards have been dead since 2026-05-11.** The generator pre-filled the reply with `{`, and 4.6 rejects
   that with a 400. The fixed generator ships behind `engine_config.essence_card_generation` (off). Turning it on
   changes nightly, so it's Kevin's call.

3. **Nightly pure-scene and holiday prompts are cut off on 4.6 26.7% of the time** (the step-1 bench, 60 real
   briefs). They ask for 50-75 words, 4.6 writes about 161, and the 300-token budget ends mid-phrase. 5.5 writes
   about 97 and never ran out. Not changed: nightly, Kevin's call (a budget raise on 4.6, or the move to 5.5).
4. **The empty-scene people judge misses people 26% of the time on 4.6** (14 labelled images × 3). 5.5 got 100%.

## Deviations from the plan

- HumanBot and GlowBot are retired (their workflow has been manual-only since 2026-05-22), so they keep their own
  fetch, pinned to 4.6 through `models.js`.
- Offline helpers (`seedGenHelper.generatePool`, `reseed/lib/core.js`) keep their own retry loops. They build the
  body through the model profile and read every text block, so `--llm-model claude-sonnet-5-5` works offline.
