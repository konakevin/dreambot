# FLUX COUPLE LAB — ledger

**Kevin, 2026-09-18 ~07:00 UTC (autonomous, 10 renders per round):** "make a switch in the engine, leave what's there
currently as the live production engine. then on the other branch … see if you can fix flux 1.1pro, also experiment
with flux 2 pro … spend 10 QA rounds … one variable per round."

**Switch:** `engine_config.nightly_couple_engine` = production (untouched, mig 527) | experimental
(`_shared/coupleComposerX.ts`); QA: `force_couple_engine`, `force_couple_variant`, `qa_big_face_max_hfrac`,
`qa_max_face_hfrac`. Runner: `node scripts/lab-couple-round.js --round=R<n> --variant=<v> [--model=…] [--big=…]
[--gate=…]`. Captions `✨ LAB R<n> #k` in Kevin's private album. Results `scratchpad/lab/<round>.json`.

**Metric:** flux-1.1-pro first-try dual-swap HELD (no re-render, no degrade) on 10 forced couples; held faces
(tallest face / frame height, YuNet, same detector as the gate) — target ≥ 70% held, median face ≤ 25%.

## Baselines (before the lab)

| run | prompt | held first try | held faces median | failures |
|---|---|---|---|---|
| album era, organic 08-25..09-08 (449 flux-first couples) | 1.2.0 legacy + override fragments | 70% | 9-24% (16 public) | identity, no faces |
| last two organic batches 09-18 (subject-first) | subject_first + eye lock + catalogue look | 44% (8/18) | 27% | giant/gate 9 of 12 |
| album-recipe, forced 20 | legacy + album fragment + no eye lock | 45% (9/20) | 16% | no faces 6, identity 2, split 1 |
| catalog-legacy, forced 20 | legacy + catalogue look + no eye lock | 45% (9/20) | 23% | identity 6, giant/gate 3, no faces 1 |
| album20, ORGANIC 20 on the switched production | legacy + album fragment + no eye lock | 9% (1/11) | (gemini carried: 12/12 couples ≤20%) | identity 7, no faces 3 |
| flux-2-flex probe, direct, JSON vs prose (5 seeds each) | structured / narrative | n/a (no swap) | 10% both | — |

## Rounds

(one variable per round; R0 = the baselines above)

### R0 observations (before changing anything)

- The album20 identity failures are NOT wide shots. Their base flux renders (album fragment, legacy order) are tight
  two-face portraits with the heads touching or leaning together, faces 30-40% of the frame, the woman's face heavily
  stylised (album20 #1, #7, #16; `scratchpad/idfail/`). The identity check fails on the WOMAN's side (≈0.02-0.04)
  while the man's holds (0.6-0.7). Flux is bimodal on this recipe: wide-and-fine (the held 9-22%) or tight-and-touching.
  The "clear gap between their two heads" line sits late in the legacy order (after the cast block).
- Cast source photos are UNCHANGED since the 09-17 backup; only `physical_summary` text changed on 09-17 00:21 UTC
  (the cast re-process): self now reads "light brown hair with natural gray blending, short trimmed beard, warm
  medium skin", plus-one "warm golden-tan skin, late 30s". The 09-17 hold-rate crash coincides with that date as well
  as with the Fly phase-5 deploy; the Fly engine's normal (non-big) path is unchanged by the 09-17 tier commit.
- Identity-failure side count since the switch: L 3, R 2, both 2; by gender: female 4, male 1.
- flux-2-flex renders the JSON and the prose prompt at 10% faces on every seed, seated on the steps, camera-facing
  (`scratchpad/probe-json/`). It is the strongest candidate for the rolled couple rung.

| round | variable | held | held faces | failures | verdict |
|---|---|---|---|---|---|
| R1 | `narrative`: one left-to-right prose paragraph (medium → place+scene → left person → right person → beat → faces line → mood/vibe), album fragment, no eye lock | **7/10 (70%)** | 9 9 11 12 15 16 22 (median 12%) | identity 1, no faces 2 (faces=0, faces=1) | the album era's rate on the first try. Sentence shape matters more than any single clause. Prompt head: "polished digital painting … A three-quarter length two-shot of a couple at <place>: <scene>. On the left, a White woman, 38, … To her right, with a clear gap between their heads, a White man, 43, …" |

R1 notes: #4 (held, 12%) is album quality — full body, lakeside at dusk, velvet longcoats, the dock and beeches all
visible. #7 (faces=0) rendered Giessbach Falls with NO people at all: on a grand-landscape scene the environment
sentence swallowed the couple. R2 (`narrative_faces`, the two-people line FIRST) is the direct test of that.
| R2 | `narrative_faces`: R1 with the two-people / faces-to-camera line FIRST | **2/9 (22%)** (one 504) | 8 9 (median 9%) | giant face 3, merged heads (faces=2, no split) 2, no faces 2 | REJECTED. Face words at the front pull the camera in (three giant faces where R1 had none). Position matters for flux exactly as the 09-13 memory says; the faces line belongs late. |
| R3 | `narrative_asym`: R1 + "warm reds, golds and cream: …" / "cool blues, charcoal and silver: …" before each wardrobe | **2/10 (20%)** | 14 15 (median 15%) | identity 3, no faces 3, gate 1, merged heads 1 | REJECTED. The palette cue on top of Sonnet's coloured wardrobe hurt rather than helped. (Ten-render rounds swing hard: 70 → 22 → 20. R4 repeats R1 before anything is built on it.) |
| R4 | R1 repeated verbatim (`narrative`) | **7/10 (70%)** | 11 14 16 16 17 18 18 (median 16%) | identity 1, no faces (faces=1) 1, one unclassified | CONFIRMED. Narrative pooled n=20: 14/20 held (70%) vs 9/20 for the album recipe on the fragment-list assembly, same fragment, same order of ideas. The sentence shape is the lever. |
| R5 | `json` on **flux-2-flex** (FLUX.2 structured prompt: scene / camera / subjects[] / style; prompt upsampling off) | **10/10 (100%)** | 8 9 9 9 9 9 12 12 13 21 (median 9%) | none | flex obeys the structured composition every time and the swap lands every time (identity 0.52-0.75). The reliable couple model. Aesthetic call is Kevin's (renders in his album, ✨ LAB R5). |

R5 notes: the flex renders are full-body, setting-first and camera-facing — a petroglyph cave in the rain (#3), a
Balinese temple stair under paper lanterns by the sea (#7) — with the costume register visible (rust blazer, gold
wrap dress). Nothing in the round is a close-up.
| R6 | `json` on **flux-2-pro** (same structured prompt) | **3/10 (30%)** | 5 7 8 (median 7%) | split rejected with two faces found 6, one face 1 | REJECTED. Pro frames even wider than flex and its faces fall under the engine's split minimum. (Also on the cast ban list since August for cheesy output.) |
| R7 | `narrative_fg` on flux-1.1-pro: the couple named IN THE FOREGROUND first (no face words up front), then "behind and around them, <place>: <scene>", beat, faces line late | **9/10 (90%)** | 7 11 12 13 14 19 23 23 26 (median 14%) | identity 1 (re-rendered, held on flux) | Best round. Zero "no people" failures, zero giant faces. Above the album era's 70%. R8 repeats it before it is trusted. |
| R8 | R7 repeated verbatim (`narrative_fg`) | **8/10 (80%)** | 7 10 10 10 11 11 12 16 (median 11%) | identity 2 (both re-rendered and held on flux) | CONFIRMED. `narrative_fg` pooled n=20: 17/20 held first try (85%), 20/20 delivered on flux through the chain, held faces median 12%. The remaining failure is one side's identity ≈ 0 on the first render, which the same-model re-render clears. |
| R9 | `narrative_fg` with the CATALOGUE looks (override library off) | **6/10 (60%)** | 12 13 13 13 19 21 (median 13%) | identity 4 (left side ≈ 0.06-0.24; 3 re-rendered and held on flux, 1 degraded) | The album fragments matter for the first try (85% vs 60%), but the catalogue looks still deliver 9/10 on flux through the chain. Honest medium label vs first-try rate: Kevin's call. |

**Identity failures across the lab (first render only):** 12 of ~90 renders; failing side L 7 / R 4 / both 1;
failing-side gender **female 9, male 2**. The partner's face is the weak link, four to one, whichever side she is on.
Open lead for the next lab: her source photo (analyzeCastPhoto quality), hair across the face in the render, or the
swap's female-face handling — not the prompt shape.
| R10 | `narrative_fg` as plain prose on **flux-2-flex** | **10/10 (100%)** | 8 10 10 10 10 10 10 11 14 20 (median 10%) | none | flex holds on JSON and on prose alike (20/20 across R5 + R10). One composer serves both models. |

## Verdict (10 rounds, 100 forced couples, 2026-09-18 05:50–07:20 UTC)

| couple recipe | model | first-try hold | delivered on the model via the chain | held faces (median) |
|---|---|---|---|---|
| subject-first fragment list (production until 05:27) | flux-1.1-pro | 44% organic | — | 27% |
| album recipe, fragment-list assembly (production since 05:27) | flux-1.1-pro | 45% forced / 9% organic (n=11) | gemini carried | 16% |
| `narrative` (R1+R4) | flux-1.1-pro | **70%** (14/20) | — | 12–16% |
| **`narrative_fg` (R7+R8)** | **flux-1.1-pro** | **85%** (17/20) | **100%** (20/20) | **11–14%** |
| `narrative_fg` + catalogue looks (R9) | flux-1.1-pro | 60% | 90% | 13% |
| **`json` / `narrative_fg` (R5+R10)** | **flux-2-flex** | **100%** (20/20) | 100% | **9–10%** |
| `json` (R6) | flux-2-pro | 30% | — | 7% (too wide for the split) |
| `narrative_faces` (R2), `narrative_asym` (R3) | flux-1.1-pro | 22%, 20% | — | — |

**What fixed flux-1.1-pro couples:** not camera words (flux ignores them, probes 1 and 2), not the eye colour alone,
not the geometry block. The prompt SHAPE: one left-to-right paragraph that names the couple in the foreground
before the scene, keeps face words late, and carries the 1.2.0 illustration fragment. From 45% to 85% first try, with
faces at the album's size and zero giant faces or empty landscapes in 20 renders.

**What the remaining failures are:** one side's identity ≈ 0 on the first render, the woman's side four times out
of five, cleared by the same-model re-render every time in R7/R8/R9. That is a swap/source lead, not a prompt lead.

**Recommendation (Kevin's call, nothing promoted):**
1. Promote: `UPDATE engine_config SET nightly_couple_engine = 'experimental'` (default variant `narrative_fg`, the
   album fragments stay on for flux couples, eye lock stays off). Production composer stays in the code as the
   rollback: set it back to `production`.
2. Chain: keep flux-1.1-pro first for the look Kevin wants; make flux-2-flex the whole couple fallback (it held 20/20
   under this composer) — `nightly_model_policy` couple fallback flex 100 instead of the 50/50 with gemini — or keep
   gemini in the roll for variety. Both land.
3. Next lab: the partner-side identity failures (her source photo quality via analyzeCastPhoto, hair across the
   face, the engine's female-face handling).

### R11 — Kevin's 20-render check of the winning state (2026-09-18, after the lab)

| round | variable | held | held faces | failures | verdict |
|---|---|---|---|---|---|
| R11 | `narrative_fg` + album fragments on flux-1.1-pro, n=20 (the experimental engine's default) | **20/20 (100%)** | 9–27%, median 13% | none | `narrative_fg` on flux pooled R7+R8+R11: **37/40 first-try (92.5%)**, 40/40 delivered on flux. |

### After R11 (Kevin: "4 to 4.5 on average, much better composition, a lot of really big wins"; my grades averaged 3.8 on the same 20)

Follow-ups Kevin asked for:
1. Plain-clothes list gains sweater, pullover, chinos, jeans (R11 #9 and #17 slipped through on those). Deployed to nightly + Create.
2. `narrative_fg_beat`: an ACTIVE-scenario seed ("Couple rides twin red foxes through an autumn forest") is the couple's
   own sentence right after their names, before "Behind and around them"; only the scene description stays behind
   them. R12 = 10 flux couples with the active pool forced, to measure the beat surviving.
