> **ARCHIVED 2026-10-02.** Superseded by `NIGHTLY_RULE_BOOK.md` (the official nightly rule book: the current state, the rules and every lesson). Kept as history for its measurements and decisions. Do NOT follow it as the current state; when it disagrees with the rule book or the code, it is wrong.

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

| Date       | Step                                                                                                                                                                                                                                                                                                                              | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-30 | Judge built (`scripts/qa-gaze-judge.js`, Sonnet 5.5; 4.6 missed the poker man's drifting eyes, 5.5 caught both screenshots). Kevin, mid-run: "i don't care if characters are looking straight at the camera or not, i just don't want those blank stare, dead eye looks … a more straight on look is favored" (for the face swap) | The judge will not call "vacant" on its own; "eyes off to the side at nothing" is the usable signal, plus my own look at every image                                                                                                                                                                                                                                                                                                                                                         |
| 2026-09-30 | Baseline (eyes on camera, per person)                                                                                                                                                                                                                                                                                             | production nightlies on 4.6 (60 couples + 60 solos): **87% / 87%**, every person on camera in 83% of couple images. Paired lab couples, same inputs: 4.6 85% and 78%, 5.5 72% and 75% (every person on camera 76/70% vs 66/60%). So 5.5 drifts more, as Kevin saw                                                                                                                                                                                                                            |
| 2026-09-30 | Round 1, same-seed screen (`scripts/lab-eye-contact-screen.mjs`, 23 real 5.5 couples + 16 solos, flux-1.1-pro, no swap)                                                                                                                                                                                                           | c1 (eyes named in the closing faces line): 72% → 72%, no effect. **c2 ("…, looking into the camera, wearing …" on each person): 85%, heads turned 19% → 2%, side-on 6% → 0%**, faces 13.3% → 14.5%. Solos: s1 (drop "gently off" + three-quarter) 71% → 75%; c2 wording on the solo 81%                                                                                                                                                                                                      |
| 2026-09-30 | Built behind `nightly_eye_contact` (mig 587, off) + QA `force_eye_contact`; tests `eyeContact.test.ts`; deployed                                                                                                                                                                                                                  | switch off = byte-identical prompts                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2026-09-30 | Round 2, full production renders with the switch forced (10 couples + 5 solos, Kevin's private album)                                                                                                                                                                                                                             | face swap clean first try **10/10 couples, 5/5 solos**; eyes on camera 80% couples, 80% solos; no side-on heads; poses still natural (pointing, holding hands, seated)                                                                                                                                                                                                                                                                                                                       |
| 2026-09-30 | Scenery check on round 1 pairs (`qa-scenery-score.ts`)                                                                                                                                                                                                                                                                            | **c2 costs couple scenery**: paired median 14.6 → 12.8, plain backdrops 2 → 6 of 23, c2 higher in only 6/23 (Flux crops closer: waist-up, bigger faces, a mountain or an arch disappears). Solos unaffected (12.0 → 11.9, 10/16 higher)                                                                                                                                                                                                                                                      |
| 2026-09-30 | Round 3 screen, same 23 couples                                                                                                                                                                                                                                                                                                   | c3 ("looking out at the viewer", same place): eyes 87%, scenery 13.6, plain 6. c4 (gaze AFTER each wardrobe): **eyes 91%, every person on camera 83% (= production 4.6)**, scenery 12.8, plain 5. Every gaze wording so far costs scenery on the same fragile seeds                                                                                                                                                                                                                          |
| 2026-09-30 | Round 4 screen: candid wording                                                                                                                                                                                                                                                                                                    | c6 ("glancing at the camera" after each wardrobe): eyes 77%; c8 ("Both glance at the camera mid-moment." after the beat): 75%. Both cost the same scenery as c2-c4, which pointed at the edit itself                                                                                                                                                                                                                                                                                         |
| 2026-09-30 | Round 5 screen: null controls                                                                                                                                                                                                                                                                                                     | n1 (a hyphen, no meaning): scenery 14.6 → 13.9, plain 2 → 3, eyes 72%. **n2 ("in the moment", same place and length as c4): scenery 13.2, plain 5, eyes 67%, heads turned 27%, faces 14.9%**. So the scenery drop and the slightly bigger faces come from inserting words there (the original seeds were a lucky draw), not from the gaze. Against n2, c4 costs nothing: plain 5 vs 5, median 12.8 vs 13.2, and gets eyes 91% vs 67%, heads turned 2% vs 27%                                 |
| 2026-09-30 | **Engine moved to c4** (the gaze after each couple's wardrobe; solos unchanged: after the medium) + deployed 07:39                                                                                                                                                                                                                | tests updated; 260 suites green                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2026-09-30 | Round 6, full production renders with the c4 engine forced (8 couples + 3 solos at rolled places, 5 Fall couples)                                                                                                                                                                                                                 | face swap clean first try **13/13 couples, 3/3 solos**; couples eyes on camera 88%, every person on camera 88% (production 4.6: 87% / 83%), heads turned 0% (4.6 production 7%), faces median 13.3% (same as 5.5 without the change). By eye: natural mid-moment poses (a hot dog on the boardwalk, a railway platform with a suitcase, seated on a summit cairn), nothing frozen. Solos: gaze + dropping "gently off" (s2) = 81%, the same as the gaze alone, so solos keep the softer line |
| 2026-09-30 | **Switched ON** (mig 588, 07:48 UTC), then round 7: 5 real nightlies through the queue, no QA flags (3 couples, 2 solos, 4 Fall rows)                                                                                                                                                                                             | all 5 completed with no swap failure; eyes on camera 88% (7/8 people), every person on camera 4/5 images; the one miss is a solo on the pulp-cover look ("solemn monumental atmosphere", "at an easy three-quarter angle") gazing off. Autumn looks landed on 3/5 (camel coat + blanket scarf, fringed 1970s suede, cable cardigan)                                                                                                                                                          |
| 2026-09-30 | Round 8 solo screen (all 25 solo prompts)                                                                                                                                                                                                                                                                                         | eyes on camera: base 73%, **shipped wording (after the medium) 80%**, after the wardrobe 83%, plus no three-quarter line 84% (one person in 25 each: noise). Scenery: the shipped wording is the best (higher in 17/25, plain 3 → 3). Solos stay as shipped. **Stopped here: fixed** (couples 88-91% eyes on camera, heads turned ~0%, every full render's face swap clean first try)                                                                                                        |
