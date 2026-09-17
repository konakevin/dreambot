# Nightly fallback chain — ledger (2026-09-17 overnight)

**Read this before touching the nightly ladder, the model split, or anything that "moves to gemini."**
Everything below was measured, not guessed. Numbers are from `ai_generation_log.fallback_reasons` (the
stamps). Never read the delivered model from `uploads.model` — see §3.

## 1. The objective (frozen by Kevin, 2026-09-17)

```
Couple:  flux couple → flux single → gemini couple → gemini single → nobody
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

## 6. State deployed tonight (Kevin: leave it for users)

Commits `31cfa893`, `081ef539`, `621a5847`, `f75651ac`, `a7b1a3c2`, `9654f0f8` — all deployed to
`nightly-dreams`. Config: weights 85/15 both cast surfaces; `solo_rebuild_model` = flux-1.1-pro;
`couple_prompt_style` = subject_first; looks/vibes above removed from nightly. Push on success or after Q6.
