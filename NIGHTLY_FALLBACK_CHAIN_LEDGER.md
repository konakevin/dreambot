# Nightly fallback chain — ledger (2026-09-17 overnight)

**Read this before touching the nightly ladder, the model split, or anything that "moves to gemini."**
Everything below was measured, not guessed. Numbers are from `ai_generation_log.fallback_reasons` (the
stamps). Never read the delivered model from `uploads.model` — see §3.

## 1. The objective (frozen by Kevin, 2026-09-17)

```
Couple:  flux couple → flux couple AGAIN → flux single → gemini couple → gemini single → nobody   (2026-09-17 late: one couple re-render before the solo rung — see §5c)
Single:  flux single → flux single again → gemini single → nobody
```
Each arrow = "if that fails." "flux" = whatever the roll picked (85/15 flux/gemini). "flux single" after
a failed couple = a **genuine single rebuilt from the cast** (partner dropped, look + vibe kept) — never a
face pasted onto the failed two-person render.

**Success bar for a round of 10:** delivered ≈ 80/20 flux/gemini; every gemini is either (a) a genuine
gemini roll or (b) chain step 3 after the flux single was *tried and refused*; zero "silent" gemini
(rolled flux, delivered gemini, no stamp explaining it); zero faceless.

## 2. Every gemini replacement point found, and its status

| # | mechanism | measured | status |
|---|---|---|---|
| 1 | **Look eligibility**: 19 of 33 couple looks had flux *rejected*, so the pool was gemini alone | 58% of couple looks forced gemini before the roll | FIXED — mig 523 (36 couple + 14 solo flux rejections archived to `nightly_look_approvals_archive`) |
| 2 | **Album (legacy) prompt order for flux couples** — my fix for composition | first-try dual success **56% → 4%**; 19 of 24 couples bounced to gemini | REVERTED (`a7b1a3c2`). Wider framing shrinks faces below what the split can separate. Composition lever = pose pools, NOT prompt order |
| 3 | **Dead solo rung**: degrade guard had `maxRerenders: 0`, so it probed the failed *couple* image (2 faces), refused, and moved to gemini | 5 of 5 couples, identical stamps | FIXED (`081ef539`) — 0→1, rebuild now fires |
| 4 | **Identity-failure branch skipped the solo rung** (`continue` jumped past it) | identity 0.069 / −0.017 couples went straight to gemini | FIXED (`621a5847`) — gated on `identityDegradeFloor` |
| 5 | **Rebuild model** was `engine_config.solo_rebuild_model` (flux-2-flex) because `forRebuild()` was gated on `activeStyle` (dormant path) | every rebuilt single was flux-2-flex | FIXED (`f75651ac`) — model from `forRebuild()` on both paths; config also set to flux-1.1-pro |
| 6 | **Look-ban refit re-rolled the model** (holiday/scenario bans the look → contract rebuilt → second unstamped 85/15 roll) | 19 of 430 renders / 7d took it; 4 rolled flux → gemini silently (AB-CHAIN 2) | FIXED (`9654f0f8`) — `restrictModels: [minimalModel]`; nofit fails open on the original look; changes stamped `look_medium_ban_model:` |
| 7 | `pin_model_fit` — a pinned holiday look clipped to its own model list | 5 of 434 / 7d, 2 flux→gemini | LEFT — by design, stamped, ~0.5% |
| 8 | **Empty model pool crash** — `nightly_rotoscope`/couple rejected both primaries after mig 522 removed seedream | ~1% of renders died (`reading 'replace'`) | FIXED (`31cfa893`) — returns null → legacy chain |
| 9 | **Stale catalog cache** — 60 s in-isolate; renders in the minute after mig 523 still saw the old approvals | 1 render | nothing to do |

**The model ROLL itself is exact**: 20,000 simulated rolls of the real `buildStyleContract` at 85/15
delivered 84.9/15.1 (couple) and 85.9/14.1 (solo). `scripts/sim-look-model-roll.ts` (Deno). The gemini
over-representation was never the roll — it was #1 (before tonight) and #2–#6 (after).

## 3. How to read a render (the thing that misled me for hours)

`uploads.model` and `ai_generation_log.model_used` record the model that was **picked**, not the one that
rendered the shipped image. On a chain retry the column says flux while gemini rendered. Read the stamps:

- `dual_attempts:1` — couple held on the first swap
- `rebuilt_solo:<model>` — dropped to a single, rebuilt on `<model>`
- `chain_2of2` / `chain_2of3` / `look_model_exhausted` — moved to the next model (gemini)
- `solo_model_move:<model>` — a single moved model on attempt 2
- `SHIPPED_FACELESS` — nobody
- `dual_degrade_single:attempt1` / `:identity1` — the solo rung was tried (`…_refused_gender` = it refused)
- `look_medium_ban:a->b` — look re-rolled; `look_medium_ban_model:x->y` — and the model changed too
- `pin_model_fit:x->y` — holiday pin clipped the model

`node scripts/_tmp-batch-audit.js <ARM>` prints all of this per render for a batch captioned `AB-<ARM> n`
and flags **⚠ SILENT GEMINI** for any gemini not explained by a roll or the chain.

## 4. Other things learned tonight (don't re-derive)

- **`LOOKS_MINIMAL = true` is a fix graveyard.** `looksPath` is always false; the style contract is built
  then discarded (`shadowStamp`). Four shipped fixes were found dead behind it: vibe fragment,
  `lookNeutralFraming`, `looksCouplePromptStyle`, `forRebuild()`. `activeStyle` is assigned only in the
  dormant branch, so anything gated on it is dead too. Tripwire: `dormantPathTripwire.test.ts` pins the
  `looksPath`/`activeStyle` reference counts. A fifth gate (~4711, retry-time vibe reposition) is known and
  untouched. The real fix is to delete the dormant path — needs Kevin's go.
- **Full looks path (arm B of the A/B)** degrades couples 5/11 vs 1/9 on minimal — `lookNeutralFraming` on
  couples breaks the split. Better look fidelity, worse swaps. Not flipped.
- **The 546s in my batches are a harness artefact.** Direct back-to-back calls with no retry. Production
  (queue) last 7 days: 524/524 nightly jobs completed, 0 lost, 31 needed retries. Run QA through the queue
  (`qa-nightly-exact.js`) if the failure profile matters.
- **A male cast member came back in an off-shoulder blouse** (AB-CHAIN 3). Prompt was correct (doublet,
  pauldrons); `salon_realism`'s fragment ("satin lace and brocade, porcelain-smooth skin") at position 2
  beat the wardrobe at word 180. Flux obeys POSITION. The gender guard read the face correctly (it was a
  man) — it checks face gender, not presentation. Removed from nightly via config: looks `salon_realism`,
  `glamour` (`nightly_enabled=false`); vibes `coquette`×4, `ethereal`×4 (`nightly_pool=false`). Borderline,
  NOT touched, Kevin's call: `dreamy`, `blossom`, `baroque_oil`.
- **Open design item**: a wardrobe/presentation gender check on the solo rebuild (the couples have a
  second signal, `classifyWardrobeSides`; the solo guard has only the face read). Not built — new vision
  probe on the safety path, wants a design pass, not a 1am patch.
- **Open rule**: a weak couple swap (both faces, likeness 0.25–0.35) currently ships as the couple rather
  than dropping to the flux single. Kevin hasn't ruled.
- The couple composition ask (posed inside the scene, album-style) is real and **unsolved**. Prompt order
  is a dead end (measured). Next lever: pose pools (`dual_stances`, scenario actions), one variable, judged
  by first-try dual success ≥ 50% AND a posed-vs-side-by-side count.

## 5. Round log (10 renders each, up to 6)

| round | delivered flux/gemini | gemini explained? | couples: held / →flux single / →gemini | silent | verdict |
|---|---|---|---|---|---|
| Q1 | 7 / 2 (78/22), 1×546 | yes — both genuine gemini rolls | 3 / 2 / 0 | 0 | PASS (first-try 3/5 = baseline) |
| Q2 | 7 / 1 (88/13), 2×546 | yes — genuine gemini roll | 1 / 4 / 0 | 0 | PASS |
| Q3–Q6 | not run | | | | stopped early — bar met on Q1+Q2 |

**Combined Q1+Q2: 17 renders, flux 14 (82%) / gemini 3 (18%); all 3 geminis genuine rolls; 0 via the
chain; 0 silent; 0 faceless. The chain is nailed.** Pushed after Q2.

## 7. TOMORROW'S FIRST ITEM — flux couples survive the first dual only 2 of 8

Across Q1+Q2, 8 flux couples: 2 held, 6 dropped to a flux single. Baseline (7 days before tonight,
174 flux couples) was 56%. The CHAIN handles it correctly — every one became a flux single, none went to
gemini — but that is a lot of couples losing their +1. n=8, so treat as a strong lead, not a verdict.

The six failures, by look (all flux-1.1-pro, subject_first order):

| render | look | why the dual failed | first identity | look was flux-rejected before mig 523? |
|---|---|---|---|---|
| Q1 4 | watercolor_paper | wrong face (one side collapsed) | L0.388 / R0.146 | no |
| Q1 7 | digital_watercolor | no split — `giant_face` | — | **yes** |
| Q2 2 | aquarelle_graphite | no split — `giant_face` | — | **yes** |
| Q2 3 | kodachrome | wrong face (one side collapsed) | L−0.004 / R0.75 | no |
| Q2 5 | pulp_cover | no split — `giant_face` | — | no |
| Q2 6 | hand_drawn_illustration | no split — `lt2_faces` (rendered one person) | — | no |

So I was only partly right. **Mig 523 explains 2 of 6** — and both failed for exactly the reason they had
been rejected (giant heads), so those two rejections are *earned* and could be restored. But 4 of 6 are on
looks flux was always allowed on, failing the two documented flux ways: it renders one giant head or one
person (`no_split`), or one side's likeness collapses (`identity`). That is the flux couple problem itself
(memory: `flux-couple-night-vibe-swap-failure`, `dual-framing-width-costs-identity`), not a 523 artefact.

**The decision Kevin has to make, not me:** restoring a rejection re-creates a gemini-only pool on that
look, i.e. more delivered gemini on couples — the exact thing he told me to remove ("just make flux enabled
for anything gemini is"). The two levers pull against each other:
  - flux eligible everywhere → the split reads 85/15, more couples drop to flux singles;
  - restore earned rejections → fewer drops, more gemini couples.
There is no prompt-side fix: order and framing changes were measured tonight to break the split (§2 #2).
The real lever for flux couple survival is the POSE pools (heads apart, both frontal), one variable per
batch, judged by first-try success — and that is a daytime job with Kevin grading.

## 5b. Morning additions (2026-09-17, Kevin awake)

**Ultra probe — 10 couples forced to flux-1.1-pro-ultra, 4.2 MP confirmed on the base render.**
held 3 · → flux single 7 · → gemini 0 · **546s 0** · latency median 60 s / max 90 s. First-try 30%,
below pro's 56%. The 90-day "77%" for ultra was measured on an earlier engine state and does not
reproduce. Verdict: ultra does not buy the split; it did not hit the resource ceiling in ten either.

**546s are CPU, not memory.** Supabase logs, 24 h, `nightly-dreams`: 25 of 319 requests (7.8%), every
limit error "CPU Time exceeded", zero "Memory limit". The isolate decodes the full render to RGBA
(`imageCodec.ts`, jsquash/upng in wasm), computes a thumbhash and re-encodes a display JPEG
(`persistence.ts`), and `faceSwap.ts` encodes perturbed source / L/R halves / stitched output — all
inside a 2 s CPU budget. Limits are platform-fixed (256 MB, 2 s CPU, no dial). The solution is
architectural: no pixel work in the isolate — one Fly `persist` endpoint (URL in → display JPEG +
thumbhash → Storage → URLs out). Fixes the 7.8% on pro as well as enabling 4 MP. A day, not a night.

**The "huge face" solos (Kevin hearted 3: ULTRA 1, 6, 9).** All three were failed couples rebuilt as
singles. Root: every solo prompt carries "shown from the knees up…" in the TAIL (~1,430 chars in), where
flux-1.1-pro ignores it; the round-16 measured fix (`framingInAnchor`, distance line in the anchor before
the face clause) was dormant — set only in `looksSlotInputFields`. Sixth casualty. Fixed on the minimal
hatch for solos AND in `assembleSoloFallbackFromDual` (the rebuild spreads the couple's input, which never
carries the flag). A behavioural test found and closed a second hole: with the flag set and
`lookNeutralFraming` off, the clause vanished from both anchor and tail. Commit follows. NOT deployed to
`generate-dream` (shares the file) — deliberate decision pending.

**Solo framing fix VERIFIED (batch `SOLO`, 10 forced solos on the deployed fix, commit `c35e46b7`).**
5 rendered, 5 of 5 show the scene — full figure in a cavern, knees-up at an aqueduct, three-quarter at a
canyon railing, waist-up in a gallery, seated full-length on rocks. Zero headshots. Distance clause now at
char ~700-850, BEFORE the face clause (was ~1,600-1,975, after it). Identity 0.43-0.72, floor 0.35; the
0.43 is the widest shot. **5 of 10 died with 546.** The ultra COUPLE probe in the same hour: 0 of 10.
Couples swap on Fly; solos still run the single face-swap encodes (perturbed source, L/R halves, stitched
output — `faceSwap.ts` via `encodeJpeg`) inside the isolate. That is the CPU hog and the first target of
the no-pixels-in-the-isolate plan. It also means the 7.8% production 546 rate is mostly solos.

**The "detached heads" couples (underwater, canyon).** Land on looks that were flux-REJECTED before mig
523 for exactly this. 23 archived rows carry notes naming it ("giant floating heads", "bobbleheads",
"tight two-face crop", "profiles facing each other, faces too small"). Restoring them re-creates
gemini-only pools on those looks (more gemini couples; gemini holds 88% first-try, 2% giant_face).
Kevin's trade to call — list is one query away: `archived_by = 523 AND note ~* 'giant|floating|bobble|
tight two|profile|small face|faceless'`.

**Quality gate cannot catch face size** by Kevin's own 2026-09-03 rule (taste is out of scope, no new
criteria without a labelled calibration run). A measured bbox-fraction gate from the Fly detector
(`bboxFrac` already exists in `analyzeCastPhoto.ts`) would be a measurement, not a Haiku judgement —
but it still needs the calibration run first. Not built.

**`flux-2-flex 80.5% couple degrade` in the 7-day table was an attribution artefact**: `model_used` is
overwritten with the REBUILD model on a degraded couple, so flex (the old rebuild model) inherited every
flux couple that degraded. flex's own 30-day first render: 73 of 77 held. Same lie as `uploads.model`.

**No pixels in the isolate — phases 1-3a SHIPPED and measured** (plan + inventory: `NO_PIXELS_IN_ISOLATE_PLAN.md`).
Fly app `dreambot-image-ops` (`services/image-ops`, `/persist` modes final | temp | hash); the secret
`IMAGE_OPS_FLY_URL` is the switch (unset → every function back on the old path, no deploy). Fail-open client
`_shared/imageOps.ts`. Measured: `nightly-dreams` 10 organic renders (6 solo, 4 couple) 10/10, **0 × 546**, hash
0.3-1.7 s + persist 0.9-1.8 s per render; `generate-dream` cloned Create job on gemini-3 (base64 provider)
`image_ops:fly:1180`, display + thumbhash inline, 50 s, no 546. Read a render's `image_ops_hash:*` / `image_ops:*`
stamps to see which path it took. STILL in the isolate (phase 3b/4): `ensureHttpsImageUrl`'s atob loop on swap
targets, `perturbSourceImage`, the legacy non-Fly dual split, holiday-postcard compositing, the upscale cache write,
and `first-dream-render` is not on the client yet.

**Later the same day — phases 3b / 4a / 4b + the monitor.** `first-dream-render` was never a separate case: it renders
THROUGH `nightly-dreams` per cascade tier. The solo 546 root cause, quantified by the smoke: a cast photo is
1943×1958 (3.8 MP) at 435 KB — UNDER the isolate's 1.2 MB perturb guard, so every solo swap decoded + re-encoded
3.8 MP in-isolate (Fly clocks that at 2.1 s of CPU; the budget is 2 s). Now `perturbSourceImage` → Fly
`mode:perturb`, `ensureHttpsImageUrl` (both swap paths) + generate-dream's swap source → `mode:temp`, holiday
postcards → `/composite`. **Batch `SOLO2` (10 forced solos, same shape as this morning's 5-of-10 casualty): 10/10,
0 × 546, 41-57 s each, flux 9 / gemini 1, all `single held`; edge logs show all ten `[perturbSource]
image_ops:fly:1654-2460`.** Guards: `noPixelsInIsolateTripwire.test.ts` pins every remaining decode/encode/atob
site (fallbacks only); `edge-546-monitor.yml` (6 h) fails above a fixed 3% 546 rate per function.

**Phase 5 (Kevin: "delete the legacy dual split").** The in-isolate 55/55 crop-and-stitch engine (`dualFaceSwap` +
helpers, 254 lines of `_shared/faceSwap.ts`), its only host (the in-Supabase `face-swap-dual` function, undeployed)
and `DUAL_SWAP_FANOUT` are gone. `dualSwapDispatch.ts` is Fly-only: no `DUAL_SWAP_FLY_URL` → `dual_swap_error` →
the gender-safe solo rebuild (the frozen chain), never in-isolate pixels. Chain semantics unchanged: the Fly engine
was already the only reachable one. Guarded by the phase-5 describe in `noPixelsInIsolateTripwire.test.ts`.

**Paired geometry test, flux-1.1-pro vs flux-1.1-pro-ultra (2026-09-17, batch `PAIR2`; harness
`scripts/_tmp-paired-pro-ultra.js` + `_tmp-paired-post.js`, untracked).** 18 real couple prompts taken from
`rolled_axes.observability.couplePrompt` — NOT `enhanced_prompt`, which on a degraded couple is the SOLO rebuild's
prompt (the first run was contaminated that way: 8 of 20 "pairs" rendered one man on both models; discarded, rows
deleted). Each prompt rendered on both models with the SAME seed straight against Replicate with the engine's inputs,
and every output judged by the Fly engine's own YuNet + `planDualSplit`, run locally. Swappable = `ok` + `overlap`
(overlap → the per-face composite path). **pro 10 of 18 (56%), ultra 5 of 16 (31%)** — the same two numbers the
album-order A/B and the morning probe gave. 16 complete pairs: both 4 · pro only 5 · ultra only 1 · neither 6.
Ultra's signature on identical seeds: tighter framing (`giant_face` 7/16 vs 4/18, faces 45-85% of frame height) and
dropping the people entirely (3 pairs rendered the station / cliff / gravestone with nobody in it). Detector recall is
NOT the cause: re-judging every `lt2_faces` render after a Lanczos downscale recovered 0 of 8. Replicate's NSFW filter
refused 2 of 18 ultra renders (0 pro) on innocuous prompts. **The reclaimable class is `giant_face`**: two frontal faces
present, rejected only because the ~128 px swap output smears above 0.4×H (2026-09-02 guard) — pro 4, ultra 7; a
higher-resolution face pass would lift BOTH models to ~75-78% swappable. The residual (no people / tiny / turned away:
4 per model) is composition, and only a re-render fixes it. All 34 renders are in Kevin's private Dreams album with
the verdict in the caption (`PAIR2 nn · pro|ultra · reason · faces · h%`).

**Big-face reclaim, Phase 0 DONE (2026-09-17) → GO.** `BIG_FACE_RECLAIM_PLAN.md`. The 11 giant renders from `PAIR2`, the
Fly engine's own per-face swap driven locally with the guard lifted: the smear was never resolution — the per-face
path's crop (2.4× pad clamped to the frame) and paste (box+30% + feather) both cross into the neighbouring face on
giant couples. With a full-frame swap, the neighbour painted out, and paste masks bounded at the neighbour, both faces
swap on 9 of 11 (identity 0.59-0.73, the normal band); faces above ~0.60×H get "no face found" from every swap
model. Restore is not the lever (0.9 ≈ raw; 0.7/0.5 waxy, −0.1 to −0.2 identity). Phase 1 = engine tier behind
`engine_config.dual_big_face_max_hfrac` (default 0.40 = today), ~half a day. Review rows: album captions `BIGFACE …`.

**Big-face tier SHIPPED (Phase 1, 2026-09-17; ceiling 0.60 for the measurement, then 0.50 on Kevin's taste call — faces above half the frame are re-rendered).** Fly engine: faces in (0.40, ceiling] swap on the
full-frame per-face path (neighbour painted out, restored after, neighbour-bounded pastes); above the ceiling stays
`giant_face`. Ceiling = `engine_config.dual_big_face_max_hfrac` (mig 524, default 0.40 = off; set 0.60), passed per
request by all four dispatch sites. Batch `BF` (20 couples): tier reclaimed 4, all held, identity 0.63-0.73; the
chain is unchanged otherwise. Stamps `big_face:` / `giant_face_hfrac:`. Guards: `bigFaceWiring.test.ts`,
`dualBigFaceMaxHFrac.dbspec.ts`, 5 engine tests in `faceDetect.test.ts`.

**Replacement point 10 — a below-floor SOLO went straight to a pure scene (found 2026-09-17 night, `bf50 #2`).**
Flux drew the person as carved stone heads on a tower; the swap pasted Kevin onto the stonework; identity −0.03;
the one permitted rescue (a re-SWAP on the same render) cannot help a base render with no face; the 0.15 floor
then re-rendered the scene with people cleared. The frozen single chain says flux → flux again → gemini → nobody,
so two rungs were skipped. Root cause: the fresh-render rescue (`solo_floor_rerender`, parity round 10) was gated
on the looks-path flag — the SEVENTH fix found dead under LOOKS_MINIMAL. Fix: un-gated, and it now walks the
chain (rung 1 the rolled model, rung 2 `styleContract.forAttempt(2)`, each through the gender guard + swap +
identity ≥ 0.35) before pure scene; stamps `solo_floor_rerender:<rung>:<model>` / `_ok` / `_low` / `_unsafe`.
Rate on real users' last 30 days: 1 of 208 solos (0.5%). Guarded by `looksMinimalInertFixGuard.test.ts` #4 and the
dormant-path pin (33 → 32).

## 5c. The chain gains a rung (2026-09-17, late — Kevin: "yeah, try that")

A true 20-night run (`bf50`, no forcing) and the stamps of 09-14..16 vs today: the 09-14..16 engine re-rendered
EVERY failed couple as a couple before degrading (17 of 17; 9 held) and delivered 96% of couples as couples
(197); the frozen chain's immediate solo rung converted 25 of 45 failed couples to solos in one day, on the same
looks and the same composer text. My forced batches overstate first-render failures (30% vs 9% on true rolls) —
forcing `dual` skips the roll's own medium/scene selection. New chain: flux couple → flux couple AGAIN (same
model, `couple_retry:1:same_model`) → flux single → gemini couple → gemini single → nobody. Implementation:
`soloFromAttempt` in dualSwapPipeline (default 0 keeps Create/onboarding as they were), nightly passes
`maxRerenders: 2, soloFromAttempt: 1`, and the re-render walks `forAttempt(attempt)` from attempt 2. Measured on
the next true 20-night run (round `chain6`).

## 5d. Composition gate (2026-09-17, late — Kevin: "i am so beyond sick of these closeup framings")

Three renders from the chain6 run: a couple with two detached heads (first render 0.67 of frame, re-render 0.43 —
SHIPPED by the big-face tier at 0.50), a close-up couple at 0.37 (below every guard), and a floating head in a melt
pool (the scene seed said "chest-deep"). Every prompt carried "from mid-thigh up" / "knees up" ~20-35% in; flux
ignores it. Kevin chose options 2+3+4: (2) tier back to 0.40 = off; (3) a COMPOSITION GATE, `engine_config.
nightly_max_face_hfrac` (mig 525, default 0.35): solos — after the gender verdict, the Fly detector's tallest face
fraction (`flyFaceHFrac`); too big = a hard verdict → the guard's ladder re-renders; couples — the engine's
`maxFaceHFrac` after a held swap → re-render down the chain. At exhaustion the SMALLEST ships (stamps
`face_gate:*` / `solo_face_gate:*`), never a faceless scene; a failed probe fails open. Nightly only. (4) seed
hygiene: 229 + 224 enabled scenario seeds mention water/submersion (~120 genuinely put the body in water above the
waist); rewording awaits Kevin's approval.

## 5e. Chain v2 stopgap (2026-09-18 ~04:30 UTC) — flux couple → NEXT model couple → single → pure scene

chain6 (20 real nightlies) shipped 2 FACELESS dreams (#19, #20): flux couple (0/1 faces) → flux couple AGAIN
(the 09-17 rung) → `recover_budget_exhausted` at 91 s → the gemini rungs never ran → flux solo rebuild ×2
(no face / 4 faces) → `SHIPPED_FACELESS`. Kevin: "i refuse to believe … if that's true then our engine is
complete shit". It was true. Every rung was flux-1.1-pro on the same wide scene.

Stopgap so tonight's 08:00 UTC run is not that (the full chain is NIGHTLY_CHAIN_V2_DESIGN.md):
- `nightly_model_policy` couple + solo: primary flux-1.1-pro 100 / gemini-2-image 0 (gemini stays a primary so
  its cast ban stays lifted); fallback flux-2-flex 50 / gemini-2-image 50 (used by chain v2).
- `nightly-dreams`: the same-model branch deleted; the first re-render asks the contract for RENDER 2
  (`chainAttempt = attempt + 1` — the pipeline counts re-renders from 1, the contract counts renders from 1,
  so `forAttempt(attempt)` on the first re-render returned the SAME model); `maxRerenders: 1`; the
  reuse-single rung (`soloBetweenAttempts` / `soloFromAttempt`) removed.
- Expected stamps on a failed couple: `rerender_for_dual` → `policy:couple:2:gemini-2-image:chain_2of2`.

## 6. State deployed tonight (Kevin: leave it for users)

Commits `31cfa893`, `081ef539`, `621a5847`, `f75651ac`, `a7b1a3c2`, `9654f0f8` — all deployed to
`nightly-dreams`. Config: weights 85/15 both cast surfaces; `solo_rebuild_model` = flux-1.1-pro;
`couple_prompt_style` = subject_first; looks/vibes above removed from nightly. Push on success or after Q6.
