# Race & Character Fidelity — status of record (2026-09-01)

**The goal:** a cast member placed in ANY location renders as *themselves* — right
race, skin tone, hair color, likeness — with only the scene/location changing. A
"vacation photo of the real person in that place," never a local of that place.

**Status: SHIPPED and live. Race is solid; hair color is much better but still drifts
intermittently (see "Known remaining").** Pick this doc up if bad race/hair renders
persist. Related: `DUAL_SWAP_QUALITY_INVESTIGATION.md` (degrade rate + gender-swap).

---

## The bug (what users saw)
Cast placed in an ethnicity-loaded location (China, Japan, Jamaica, Egypt, India…)
rendered as **locals** (Asian, etc.), and the face swap inherited the wrong-race
body/features. Confirmed: sunnysteph's white +1 rendered East Asian in a China scene;
his chestnut→ black hair; he didn't read as himself.

## Root causes (all found + addressed)
1. **Front-loaded country noun.** Nightly prepended `set in <country>,` as CLIP's
   first token — on a cast render the COUNTRY became the dominant token and Flux built
   local facial features. (`nightly-dreams/index.ts` front-load guard.)
2. **Skin-tone-only anchor.** The cast carried only a skin *tone* descriptor, no race —
   tone can't beat a country noun (`feedback_ethnicity_noun_beats_visual_descriptors`).
3. **The combined describe is unreliable on traits.** describe-photo's one-shot mega-
   prompt mislabeled a dirty-blonde/greying man "chestnut brown hair." A FOCUSED single-
   trait read on the same photo got "light blonde/gray." **Focused ≫ combined** — the
   single biggest lesson here. Age also reads ~10 yrs young (model bias).
4. **Intermittent Flux adherence.** Even with the right tokens, race/hair drift is
   PROBABILISTIC, not deterministic — worse on dual rolls. Anchoring reduces it; nothing
   makes it a hard guarantee short of a post-render verify+reroll (see future work).

## What shipped
| Fix | Where | Effect |
|---|---|---|
| Drop country front-load on cast renders | `nightly-dreams` front-load guard (`resolvedComposition !== 'character'`) | stops feeding the local-race prior |
| **Ethnicity anchor** on the subject noun ("a White man") | `_shared/characterSlotPrompt.ts` `buildIdentityBlock` + `ethnicityAdjective` | beats the location prior; the core fix |
| **`classifyEthnicity`** (focused, closed 6-bucket, null-safe) | `_shared/vision.ts` | reliable race read (probe below) |
| **Hair-color anchor** ("…with chestnut brown hair", early, positive) | `characterSlotPrompt.ts` `extractHairColor` | restates color early so it survives |
| **`classifyHairColor`** + `replaceHairColorInSummary` (focused read fixes the summary) | `_shared/vision.ts` + `describe-photo` | corrects the unreliable combined-describe color |
| Age: dropped the "lean younger" bias | `_shared/vision.ts` VISION_PROMPTS | stops compounding the model's young read |
| Skin clause kept ALONGSIDE the race anchor | `buildIdentityBlock` | tone + race both carried |
| Client persists `ethnicity` on new casts | `DreamCastStep`, `DreamCastRoster`, `castUpload`, `firstDreamKickoff`, `dreamCastRoster`, `types/vibeProfile` | new uploads carry it |
| describe-photo captures ethnicity + focused hair at upload | `describe-photo/index.ts` | new casts accurate |
| Fleet backfill: ethnicity + hair color | `scripts/backfill-cast-ethnicity.mjs`, `scripts/backfill-cast-haircolor.mjs` | existing casts fixed (ran: 48 hairs / 27 users) |
| 31 slot-prompt unit tests | `__tests__/lib/faceSwapGenderLock.test.ts` | locks: race anchor beats mis-captured skin, skin kept, hair color anchored, positive-only, both dual slots |

**Ethnicity buckets (FINALIZED via a Haiku accuracy probe, `scratchpad/race-probe.mjs`):**
White · Black · East Asian (absorbs Southeast Asian + Pacific Islander — Haiku conflates
them) · South Asian · Hispanic/Latino · Middle Eastern. Else null → skin-tone fallback.
0 refusals with the justification-free closed-set prompt.

## Verification (2026-09-01 render matrix)
15 dual renders — you + your +1 across 10 ethnic locations + sunnysteph ×5 China.
**Race held on every couple** (India/Caribbean/Japan/Shanghai — all rendered white, not
local). Hair color mostly held; sunnysteph's +1 drifted dark-brown on one roll. ~3/15
degraded to a clean solo (normal dual variance). Matrix artifact was published for review.

## Known remaining / future levers (if bad renders persist)
1. **Hair-color still drifts intermittently.** Same Flux-adherence fight as race. Options,
   in rough order of effort: (a) strengthen the hair anchor further (repeat the color in
   the framing block, not just the subject); (b) a **post-render trait verify + re-roll** —
   read the OUTPUT's hair color and re-render if it doesn't match the cast (the robust,
   expensive fix; parallels the gender-consistency idea in the dual investigation);
   (c) medium-aware — some mediums (flat-ink comic) crush hair to dark; bias cast renders
   away from them or add a per-medium hair emphasis.
2. **Age reads ~10 yrs young** (model limitation, even focused). Could add a small upward
   correction offset when storing, or accept it.
3. **Create-path parity.** generate-dream uses `characterSlotPrompt` so the anchors apply
   once its cast carries ethnicity/hair, but it hasn't been render-verified; confirm it has
   no country front-load of its own.
4. **Extend focused reads to more traits.** The combined describe is weak generally; the
   focused-read pattern (proven for ethnicity + hair) could also cover eye color, beard, etc.
5. **Dual degrade ~16–20%** is a separate issue — see `DUAL_SWAP_QUALITY_INVESTIGATION.md`
   (photography-medium ban + the silent gender-swap post-swap check).

## Mental model for whoever picks this up
- The **face swap** is the reliable identity carrier (ArcFace on the real photo). Hair,
  skin, build come from the **base render** (prompt-driven) and are made reliable by
  ANCHORING, never guaranteed.
- **Focused single-trait vision reads beat the combined mega-describe** — every time we
  tested it (ethnicity, hair). When a stored trait looks wrong, re-read it focused before
  blaming the render.
- Drift is probabilistic. The only true guarantee is render → verify-against-cast → re-roll.

## How to resume
- Backfill again: `node scripts/backfill-cast-ethnicity.mjs --write` / `backfill-cast-haircolor.mjs --write` (resumable).
- Accuracy probe: `scratchpad/race-probe.mjs` (Pexels + Haiku confusion matrix).
- Prompt logic + tests: `_shared/characterSlotPrompt.ts` + `__tests__/lib/faceSwapGenderLock.test.ts`.
- Vision reads: `_shared/vision.ts` (`classifyEthnicity`, `classifyHairColor`, `replaceHairColorInSummary`).
