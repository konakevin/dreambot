# Nightly eye contact: faces and eyes to the camera (plan of record, 2026-09-30)

Kevin, 2026-09-30, on two nightly couples: "5.5 keeps posing people looking off all derpy ... our faces and eyes are
looking randomly off camera, i don't like this aspect of it" and "it also poses people in weird side angle renders like
this a lot too, more than i remember 4.5 doing it". Approved: "do both followups please".

## The two failures (Kevin's screenshots)

| Screenshot                 | What is wrong                                                                     | What the prompt said                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Poker table, cowboy hat    | heads face the camera, the EYES wander sideways (his to the left, hers up at him) | an action on handled objects (chips, cards); "their faces turned toward the camera" (heads, not eyes) |
| Vienna lamp, seated couple | both heads turned to each other in profile (the romance prior)                    | idle hands, a gas-lit evening; the same faces line                                                    |

So there are two measures, not one: the head angle (YuNet landmarks, `scripts/qa-face-yaw.ts`) and where the eyes
point (a vision judge; YuNet has no iris points).

## What we know already (measured 2026-09-30, `LLM_5_5_TUNING.md` ledger)

- Same inputs, 4.6 vs 5.5 slot text: heads turned (> 0.25 eye-distances) 9-12% of faces on 4.6, 15-16% on 5.5. Real
  but small (about 1.4 standard errors); the eye direction was never measured.
- Busy-hands poses turned more on 5.5 (18% vs 8%); idle poses about even (14% vs 12%).
- **The prompts themselves allow it, on both models:**
  - Solo (`characterSlotPrompt.ts` single anchor + integration line): "turned naturally toward the viewer at an easy
    three-quarter angle" and "comfortable and natural — looking toward the camera **or gently off into the scene**".
    That line was written on 2026-08-24 to stop a stiff "cardboard cutout" look; Kevin now wants the eyes on camera.
  - Couples (`coupleComposerX.ts`, narrative_fg): "their faces turned toward the camera" names the heads, not the eyes.
  - The action writer (`authorAction`, nightly_slots) is told "no reading / studying / examining" but its own examples
    invite eye-needing tasks: "lifting, stirring, carving, pouring".
  - One authored couple pose asks for it outright: `dual_actions.ts` "one holding something out to inspect it in the
    light" (the worst-turned render of the 5.5 batch).

## Done when

- Eye contact (judge: both eyes toward the camera) rises clearly over the baseline on couples AND solos, and heads
  turned side-on (> 0.4) fall.
- No regression: couple first-try face-swap hold within 2 points of the baseline, face size inside the giant-face
  gate (0.35), scenery score not lower (faces-first wording pulled the camera in on flux in lab round R2).
- Not stiff: Kevin's eye on a 5-dream batch (the 2026-08-24 "cardboard cutout" complaint must not come back).

## Steps

1. **Eye judge** (`scripts/qa-gaze-judge.js`): one vision call per image (Sonnet 4.6 through `scripts/lib/anthropic.js`,
   job `script`), returning per person left to right `{head: frontal | three_quarter | profile, eyes: camera | off |
each_other | down}`. Check it on Kevin's two screenshots (both must fail) and on a dozen renders I label by eye.
2. **Baseline**, no renders:
   - production nightlies on 4.6 (the last 2 weeks, about 60 couples + 60 solos);
   - the paired lab sets (4.6 vs 5.5, same inputs) to answer "is it 5.5?" for the eyes;
   - split by pose source (authored pool, action writer, Option B beat, scenario row) and by busy vs idle hands.
3. **Fixed-seed screen** (same prompts, same seed, flux-1.1-pro, one change at a time), about 16 couples + 16 solos
   drawn from real prompts, half of them known failures:
   - **C1 couples:** the closing line names the eyes: "both looking straight into the camera" (same position, so the
     framing does not move).
   - **C2 couples:** the gaze rides each person in the foreground sentence ("…, looking into the camera, wearing …").
   - **S1 solo:** "looking into the camera with a relaxed, natural expression" replaces "looking toward the camera or
     gently off into the scene", and the anchor drops "at an easy three-quarter angle".
   - **A1 actions:** the action writer's examples become things done without looking at them (toasting, holding
     something up, carrying, a hand resting on a rail), and it is told the eyes stay free for the camera; the authored
     look-at-something poses are reworded to camera-facing versions of the same idea (pool fixes keep each entry's
     kind; the dual-proximity scan runs after).
   - Measured per arm: eye contact, head turn, face size, scenery.
4. **Ship the winners behind a switch**: `engine_config.nightly_eye_contact` (default false) + QA `force_eye_contact`,
   read by the composer and the solo anchor. The action-writer and pool rewording are code for both models (they fix
   a contradiction, not a taste).
5. **Render check** with face swap (Kevin's account, private album): about 12 couples + 6 solos with the switch forced:
   first-try hold, face size, eye contact.
6. **Switch on**, then Kevin's 5-dream batch.

Rollback: `UPDATE engine_config SET nightly_eye_contact = false WHERE id = 1;` (no deploy).

## Guard rails (house rules that apply)

- No negation bans ("not looking at each other"): Flux renders the negated thing (`feedback_negative_prompt_leak`).
- Never move the faces line to the front of the couple prompt (it pulls the camera in, lab R2), never make the scene
  dominant (Hard Rule, 2026-06-19).
- Pose pool edits: unique entries of the same kind, then `node scripts/scan-dual-faceswap-proximity.js` must exit 0.
- Create is out of scope for the first pass: it has its own couple and solo prompts. If the winner holds on nightly,
  Create gets the same switch as a follow-up.

## Ledger

| Date | Step | Result |
| ---- | ---- | ------ |
