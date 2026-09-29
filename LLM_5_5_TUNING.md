# Sonnet 5.5 tuning — tracker (status of record)

**Read this first when resuming.** It holds the goal, the "done when" checklist, every phase with its tasks and pass
bars, the frozen 4.6 baselines, a ledger of every attempt, and how to resume. Update it in the same commit as the
work. The migration history before this (the client, the bench, the vote, the canary) is in `LLM_MIGRATION.md`.

Kevin, 2026-09-29: "I'd like to keep going to experiment/tweak the 5.5 side of the engine until we work out the bugs
and it performs just as good as 4.6 within our engine. We spent a long time fine tuning for 4.6, so we probably need
to also fine tune and adjust for 5.5."

## Goal

DreamBot runs entirely on Sonnet 5.5, with dreams at least as good as today's 4.6, and 4.6 comes out of the engine
well before it retires (no sooner than 2027-02-17).

## Done when (all true)

- [ ] **D1. One Sonnet.** Every Sonnet job runs on 5.5 by default and 4.6 is never called (the fallback is 5.5 →
  Haiku). The one exception, the cast race read, uses the replacement Kevin picks (P2.1).
- [ ] **D2. Couples, nightly + Create:**
  - first-try face-swap hold within 2 points of 4.6 (nightly ≥ 93%, Create ≥ 98%);
  - degrades to a solo ≤ 4.6;
  - scenery score ≥ 4.6's;
  - Kevin picks 5.5 in ≥ 45% of blind couple pairs.
- [ ] **D3. Everything else** (solos, text prompts, bots, pure-scene and holiday nightly): truncation, fallbacks,
  refusals and swap hold no worse than 4.6, and ≥ 45% in blind votes.
- [ ] **D4. Cast reads:** hair family ≥ 85%, 0 grey false positives, age ±5y ≥ 75%, each ≥ 4.6; the race
  replacement measured and live.
- [ ] **D5. Holds up live:** 2 weeks after the full move, per-job fallback / refusal / truncation rates within 2 points
  of the 4.6 baseline, and no rise in failed dreams (`scripts/llm-rollout-report.mjs`).
- [ ] **D6. Nightly moved only with Kevin's OK** (restore-point rule).
- [ ] **D7. Cost and speed equal or better.**
- [ ] **D8. Records current:** this doc, `LLM_MIGRATION.md`, code defaults switched, memory.

If a job can't reach its bar, it stays on 4.6 and Kevin hears about it well before the retirement date forces it.

## Rules for every change

- **5.5-only.** Tweaks are rows in `llm_prompt_overlays` (mig 577), applied only to their job + model inside the
  client. The 4.6 request body stays byte-identical, locked by `slot-golden.json` and
  `__tests__/lib/anthropicClient.test.ts`.
- **One variable per round**, on the frozen sets below. Compare against the frozen 4.6 baseline and render only the
  5.5 side.
- **Face-swap rules still hold.** Never front-load or amplify the scene ("fills the background", "rich/dominant") on a
  face-swap prompt. Fuller scenery has to come from concrete place details inside the existing structure.
- **Kevin's eye last,** in small blind batches after the mechanical bars pass. He said individual picks are noise
  ("probably just random variations"); his standing preference is the target: "detailed/full backgrounds",
  "some scenery along with the couples".
- Test renders go to Kevin's private album, as always. At most 2 in flight, and gate on pool headroom.

## Phases

Status: ☐ not started · ◐ in progress · ☑ done (with the commit).

### Phase 0: instruments (no renders)

| # | Task | Pass bar | Status |
|---|---|---|---|
| 0.1 | 5.5-only prompt overlays as data: table `llm_prompt_overlays` (mig 577), `applyOverlays` in `_shared/anthropic.ts`, loader `_shared/llmOverlays.ts`, QA flags `qa_llm_overlays` (Create) / `force_llm_overlays` (nightly) | 4.6 bodies byte-identical with overlays present (tests); a 5.5 fallback to 4.6 gets 4.6's text; deployed; live proof; 0 active overlays | ☑ 2026-09-29: tests 85/85, check 251 suites, 8 fns deployed. Live nightly dry runs: on 5.5 `llm_overlay:nightly_slots:phase0-proof` applied; on 4.6 picked but not applied. Test row deleted. Commit: this one |
| 0.2 | Scenery score: `scripts/lib/sceneryScore.ts` (the production YuNet detector masks the people; Sobel detail on the rest; tallest-face fraction too) + `scripts/qa-scenery-score.ts` | AUC ≥ 0.85, full vs plain, on ≥ 20 renders labelled by eye BEFORE scoring | ◐ scorer written; validation next |
| 0.3 | Frozen tuning sets + 4.6 baselines (see Baselines) | Each set saved, with its 4.6 numbers recorded here | ◐ sets saved to `~/.dreambot-qa/llm-tuning/`; scenery baseline pending 0.2 |
| 0.4 | This tracker | committed, linked from CLAUDE.md + memory | ☑ this commit |

### Phase 1: couples (`create_slots`, `nightly_slots`)

Each round is about 60 renders on the 5.5 side (about $4-5). One overlay per round, kept or rejected on the numbers.

| # | Round (5.5 overlay) | Measures | Status |
|---|---|---|---|
| 1.1 | **Scenery:** the scene description names the place + 2-3 concrete physical features + its light; no abstract or emotional wording ("like a cherished memory") | scenery ≥ 4.6, tallest face unchanged, first-try hold ≥ baseline | ☐ |
| 1.2 | **Faces toward the camera:** no crouching, kneeling, bending, setting things down or reading; plus a 5.5-only validator that rejects those verbs and retries | first-try hold, identity sims | ☐ |
| 1.3 | **Wardrobe fits the era and setting** (e.g. no Regency jabot in a gold-rush town) | outfit harness misfit, eyeballed pairs | ☐ |
| 1.4 | **Props:** 5.5 wrote 0 in 55 couples (4.6: 22) | props share, scenery | ☐ |
| 1.5 | **Effort:** high vs medium vs low on the best variant | all of the above | ☐ |
| 1.6 | **Gate:** re-render the full couple sets on the kept overlays | nightly first-try ≥ 93%, Create ≥ 98%, degrades ≤ 4.6, scenery ≥ 4.6 | ☐ |
| 1.7 | **Kevin blind batch** of about 30 couple pairs | 5.5 ≥ 45% | ☐ |
| 1.8 | Move Create couples (`create_slots`, then `scene_split`, `outfit_reader`); **nightly only on Kevin's word** | rollout report within bars for 48 h | ☐ |

### Phase 2: cast reads

| # | Task | Pass bar | Status |
|---|---|---|---|
| 2.1 | **Race read.** 5.5 declines; no prompt tricks. Measure the replacements on the 27 labelled photos, and Kevin picks: (a) Haiku 4.5; (b) a face-attribute classifier on the Fly image-ops service; (c) skin tone only (the existing fallback), with its render race-fidelity cost | accuracy per option; Kevin's decision recorded | ☐ |
| 2.2 | **Hair colour** on 5.5: a strict-format overlay (5.5 wrote "light blonde, possibly dyed", "grey to white"); 3 reads per photo | hair ≥ 85% and ≥ 4.6, 0 grey false positives | ☐ |
| 2.3 | **Age / describe** on 5.5: an overlay if needed; 3 reads per photo | age ±5y ≥ 75% and ≥ 4.6; header 100% | ☐ |
| 2.4 | Move `cast_hair`, `cast_describe`, and the chosen race path | eval gates + 72 h spot checks of new cast descriptions | ☐ |

### Phase 3: nightly specifics

| # | Task | Pass bar | Status |
|---|---|---|---|
| 3.1 | **Location beats** 8-16 words on 5.5 (median 19 today, 18% over the 20 asked) | in range ≥ 4.6 (93%); safety filters ≥ 95% | ☐ |
| 3.2 | **Pure-scene + holiday nightly:** paired renders (never render-tested). 5.5 already fixes 4.6's 27% truncation there | scenery ≥ 4.6, blind ≥ 45% | ☐ |
| 3.3 | Move the nightly jobs **on Kevin's word** | rollout report | ☐ |

### Phase 4: refusals

| # | Task | Pass bar | Status |
|---|---|---|---|
| 4.1 | A 5.5 system-prompt overlay for the brief jobs: a consumer art app; write a tasteful version of a suggestive request instead of declining. Test set: the real intimate prompts in the logs + the probe set | refusals ≤ 4.6 (0 on the probe set) | ☐ |

### Phase 5: the rest

| # | Task | Pass bar | Status |
|---|---|---|---|
| 5.1 | Restyle rewrite render check | blind ≥ 45% | ☐ |
| 5.2 | MangaBot's named studio on any flux-2 path | 0 safety rejections | ☐ |
| 5.3 | Bots fleet: `bot_prompt` (passed the vote at 51%), starting with one public bot's user id in the preview list | rollout report 48 h | ☐ |
| 5.4 | Judges `quality_gate`, `scene_people` (text evals already better on 5.5) | rollout report 48 h | ☐ |

### Finish

- [ ] F1. Re-run the step 1 bench + step 2 paired renders on the tuned 5.5.
- [ ] F2. Kevin's final blind vote.
- [ ] F3. Every job on 5.5 via `llm_models`, for 2 weeks within bars (D5).
- [ ] F4. Code defaults → 5.5; 4.6 out of the fallback chains; `models.js` SONNET moved; memory + docs updated.

## Baselines (frozen 2026-09-29)

| Measure | 4.6 | 5.5 untuned (high) | Source |
|---|---|---|---|
| Nightly couples, first-try swap hold | 38/40 (95%) | 33/38 (86.8%, 3 Fly 500s excluded) | step 2 |
| Nightly couples, degraded to solo | 2/40 | 1/38 | step 2 |
| Create couples, first-try | 20/20 | 18/19 | step 2 |
| Solos, first-try (nightly + Create) | 23/23 | 23/23 | step 2 |
| Blind vote: 5.5 picked | — | all 47%, bots 51%, Create solos 80%, Create couples 35%, nightly couples 41%, nightly solos 46% | Kevin 2026-09-29 |
| Scenery score (couple renders) | pending 0.2 | pending 0.2 | |
| Couple slots: props written | 22/55 | 0/55 | slot text |
| Cast: ethnicity / hair / grey FP / age ±5y | 100% / 100% / 0 / 88.9% | 0% / 84.6% / 1 / 81.5% | labelled 27 |
| Location beats: median words / in 8-20 | 14 / 93.3% | 19 / 81.7% | text bench |
| Nightly pure-scene/holiday: truncated | 26.7% | 0% | text bench |
| Edgy Create probes answered / element kept | 24/24 / 24/24 | 24/24 / 24/24 | text bench |
| Real intimate couple prompt | written | declined (guard falls back) | text bench |

## Frozen sets and data

Local, in `~/.dreambot-qa/llm-tuning/`. This is outside the repo because it contains other users' logged prompts and
cast descriptions, and the scratchpad gets wiped.

| Path | What |
|---|---|
| `llm-parity/samples.json` | step 1 text inputs (60 slots, briefs, places); **other users' data, never commit** |
| `llm-renders/items-nightly.json`, `llm-renders2/items-nightly.json` | the 40 nightly couple + 13 solo inputs (Kevin's own renders), with their 4.6 + 5.5 results |
| `llm-renders-create/results-create.json` | the 30 Create inputs (the fixed prompts in `lab-llm-render-parity.js`) + results |
| `ab/ab_map.json`, `ab/paste.txt` | blind-vote arm map + Kevin's picks |

In the repo: `__tests__/fixtures/cast/` (27 labelled), `__tests__/fixtures/quality-gate/`,
`__tests__/fixtures/scene-people/` (14 labelled, public bot images).

## How to resume

- **Run a text round:** `deno run -A scripts/qa-llm-parity.ts --out=~/.dreambot-qa/llm-tuning/llm-parity --suites=<s>
  --arms=4.6,5.5@high`.
  - Add `--overlays=<key>` for a QA overlay (to add).
- **Create outfit harness:** `deno run -A scripts/qa-outfit-text.ts --variant=plan --costume=on --garment=on
  --scene-fit=all --llm-model=claude-sonnet-5-5@high --out=…`
- **Paired renders:** `node scripts/lab-llm-render-parity.js --surface=nightly|create --arm55=claude-sonnet-5-5@high
  --out=… [--offset=N] [--skip=…]`.
  - Add `--overlays=<key>` (to add). It sends `force_llm_overlays` / `qa_llm_overlays`.
- **Scenery:**
  - `deno run -A scripts/qa-scenery-score.ts <dir>`
  - `deno run -A scripts/qa-scenery-score.ts --validate=labels.json`
- **Production health:** `node scripts/llm-rollout-report.mjs [--hours=48] [--user=<id>]`.
- **An overlay:** insert a row into `llm_prompt_overlays` (`active = false`), render with the QA flag, and set
  `active = true` only after the round passes. Record each row's key in the ledger.
- **Blind vote:** the render-picker skill (`.claude/skills/render-picker/`), `mode: "pick"`. Keep the arm map off the
  page.

## Ledger

Newest last. Every attempt goes here, kept or rejected, with its numbers.

| Date | Phase | What was tried | Result | Verdict |
|---|---|---|---|---|
| 2026-09-29 | step 1 | Text bench: 9 suites × {4.6, 5.5@high, 5.5@medium} on real inputs | Create / judges / bots / nightly text ≥ 4.6; cast reads worse; 5.5 declines race | → baselines |
| 2026-09-29 | step 1 | Text-refusal guard, lenient slot JSON, essence budget | 0 false positives / 851; parse fix; cards 20/20 | kept (739182a9) |
| 2026-09-29 | step 2 | Paired renders: 40 nightly couples, 13 nightly solos, 20+10 Create, 6 bots | the baselines table | → baselines (1ed8e745) |
| 2026-09-29 | step 2 | Kevin blind vote, 117 pairs | 5.5 loses couples, wins solos | → Phase 1 focus |
| 2026-09-29 | step 3.1 | Canary: Kevin only, `create_brief` + `restyle_brief` on 5.5@high (mig 576) | test dream complete, 15 s against ~20 s | live (9f78025a) |
| 2026-09-29 | diagnosis | Couple slot text: 4.6 vs 5.5 in the voted pairs | 5.5 wrote props 0/55 vs 22/55; wardrobe longer; face-down actions 2/55; saturation equal; 5.5 slightly darker (lightness 0.383 vs 0.416). Kevin: prefers full scenery | → rounds 1.1-1.4 |
| 2026-09-29 | 0.2 | First scenery measure: ImageMagick `-edge 1` mean | returned ~0 for every render: broken | rejected, not used |
| 2026-09-29 | 0.1 | Overlay plumbing + live proof (`phase0-proof` row, deleted) | applied on 5.5 only; 4.6 untouched | ☑ |
