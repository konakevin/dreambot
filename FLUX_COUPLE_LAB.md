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
| R12 | `narrative_fg_beat`, active scenarios forced (every render carries a strong beat) | **8/10 (80%)** | 8 8 9 11 11 13 15 17 (median 11%) | one Fly error (degraded), identity 1 | Hold rate unchanged by the beat placement. The "They …" subject rewrite mangled half the scenario sentences ("They balancing…", "They sun-kissed travelers stride…"); fixed to the verbatim caption sentence. Beat survival judged by eye below. |

R12 by eye: the beats survived — #3 the dog-sled team on a frosted Yukon trail, #6 the Norse mead hall in firelight
and chainmail, #2 balancing on boards in the infinity pool. Two things worth a note: #3 rendered Kevin dark-skinned
under the overcast light (the cast summary's "warm medium skin" again, see the sunflower render earlier tonight;
the fix is the cast description text, not the composer), and the woman there is turned three-quarters away with
the man far behind — a dynamic beat pulls the composition into motion. Both held the swap.

## PROMOTED — 2026-09-18 18:02 UTC (Kevin: "promote it, flip nightly_couple_engine to experimental")

`engine_config.nightly_couple_engine` = experimental. Couples now compose through `coupleComposerX` (default `narrative_fg`; `narrative_fg_beat` is opt-in via
force_couple_variant until a full round proves it), album
fragments on flux couples, no eye colour on the couple lock, flux first → gemini/flex roll. Rollback = the same row
back to `production`, no deploy. First real-user run on it: 2026-09-19 08:00 UTC.

## ⭐ RESTORE POINT — 2026-09-18 evening (Kevin: "the best it's ever been")

"the nightly engine is finally performing at a very high level. it's making very well composed renders, nice styles,
accurate placements, no huge faces, showing the environment well in most photos. it's very good, the best it's ever
been from looking at this current batch."

Exact state captured in `nightly-states/v1.5-narrative.json` (commit, engine_config, policy rows, enabled + retired
looks). Rule: no production nightly change without Kevin's word; further work is opt-in behind request flags.

### Per-look probe (P-*, 2026-09-18 evening): the catalogue's own fragments under `narrative_fg`, five forced flux couples each

| look | held | fails |
|---|---|---|
| canvas | 5/5 | |
| aquarelle_graphite | 5/5 | |
| chromolithograph | 5/5 | faces up to 33% |
| pulp_cover | 4/5 | identity 1 |
| lineless_watercolor | 3/5 | identity 2 |
| classical_oil | 2/5 | identity 2, Fly error 1 |

Pooled 24/30 (80%); with R9, catalogue fragments under the narrative composer = 30/40 (75%) vs the four album
fragments 37/40 (92.5%). The gap is real but far smaller than the 47% the old prompt produced, and every miss is
identity on the woman's side in the softer looks. Kevin's call whether flux couples render the honest look (75-80%)
or the album fragments (92%); nothing changed in production.

## LESSONS LEARNED — composing a render that face-swaps, on a stubborn model (flux-1.1-pro)

Written 2026-09-18/19 after the night the engine went from "complete shit" (Kevin, 03:30) to "the best it's ever
been" (Kevin, 19:00). Every line below was measured, not reasoned. Read this before touching a cast prompt.

1. **Flux ignores camera language.** "Pull the camera back", "full body", "24mm from six metres", the album's
   "environmental two-shot at a natural editorial distance": 7-8% faces with any of them or none, at any position;
   even "tight close-up" only reached 14%. Do not fix framing with distance words.
2. **The strongest cue wins, and the look fragment is usually it.** A photographic fragment ("slide film photograph",
   "portrait") drags a couple to a 50-67% two-face close-up; a painting fragment lets the scene win (backs to the
   camera, or no people at all). Photographic and portrait-shaped looks are retired from cast renders for this reason.
3. **Face words early pull the camera in; face words last do not.** Eye-colour tokens at position one, a
   "faces to camera" block at the front: 22% held (R2) against 70% with the same words at the end (R1). The faces line
   belongs after the scene. Position matters for emphasis, not for distance.
4. **The sentence shape is the lever.** One left-to-right paragraph — fragment, "a three-quarter length two-shot",
   the couple named IN THE FOREGROUND (left person with wardrobe, right person with a clear gap between their heads),
   the beat, "behind and around them, <place>: <scene>", the faces line, mood and vibe — took flux couples from 45%
   first-try holds to 85-92%, faces median 11-14%. The comma-joined fragment list with LEFT/RIGHT markers was the
   regression, not any single clause in it.
5. **Name the people before the scene.** Under a grand-landscape sentence flux painted Giessbach Falls, a canyon
   cascade and the Skein Towers with nobody in them. "In the foreground … behind and around them" is the hinge.
6. **A repeated model is not a fallback.** Flux couple → flux couple again burned the budget the later rungs needed
   and shipped faceless dreams. The retry must move models; flux-2-flex under this composer held 20/20.
7. **Measure delivered, from stamps.** `uploads.model` lies on retries; forced batches overstate failures; ten-render
   rounds swing ±25 points (70 → 22 → 20 → 70) — repeat a winner before building on it; grade the pictures, not the
   swap counters (Kevin 4-4.5 where the counters said 3.8).
8. **Identity failures are one-sided.** The woman's side 9 of 11, on the softer looks. That is a swap/source-photo
   lead, not a prompt lead; do not chase it with prompt words.
9. **What did not help:** contrasting palettes per side (20%); camera clauses (see 1); face-first ordering (see 3).
   JSON prompting works on FLUX.2 (flex 10/10) and is unnecessary on flux-1.1-pro (prose holds the same).
10. **Wardrobe and beats are separate levers.** No plain clothes (validator + costume register steered by scene
    type); no masks over faces; no turned-away beats; water seeds knee-deep. Fix them in the brief and the pools, never
    in the prompt tail.
11. **Every fix must be stamped and counted.** Seven earlier fixes reached zero renders behind a dormant path
    (`looks_minimal:on`). Check the engine stamp (`couple_engine:…`) before believing any batch.
12. **One variable per round.** The 09-13 lesson repeated on 09-17: tier + gate + same-model rung in one night made it
    worse. A switch (production untouched, experimental opt-in) is what made the lab possible.

### Per-look probe, FULL couple catalogue (P-*, P2-*, P3-*, 2026-09-18 19:22-20:00 UTC) — Kevin: "come up with a final list of approved looks based on that probe"

Every look in the couple pool (20 approved on at least one model) plus the two legacy album looks that were never
approved for couples (watercolor_ink, ink_illustration), five forced flux-1.1-pro couples each with the look's OWN
catalogue fragment (`--library=false --look=<key>`, stamped `look_override_library:exempt:force_look`) on the live
`narrative_fg` composer. Rule fixed before the results: approve at 4-5 of 5 first-try holds; 3 of 5 gets five more and
needs 7 of 10; 2 or fewer retires the look from flux couples. 120 renders, 3 concurrent, headroom-gated.

| look | first-try | re-render → couple | solo | verdict |
|---|---|---|---|---|
| adult_cartoon, airbrush_poster, aquarelle_graphite, canvas, chromolithograph, hand_drawn_illustration, ink_illustration, ink_wash_comic, marker, painted_comic_cover, painted_graphic_novel, rotoscope, soft_brush_illustration, watercolor_ink, watercolor_paper | 5/5 each | 0 | 0 | APPROVE (15) |
| digital_painting | 4/5 | 1 | 0 | APPROVE |
| painted_fantasy | 4/5 | 1 | 0 | APPROVE |
| pulp_cover | 4/5 | 1 | 0 | APPROVE |
| soft_comic | 4/5 | 0 | 1 | APPROVE |
| lineless_watercolor | 7/10 | 2 | 1 | APPROVE (at the bar; all three misses = the woman's face dissolving in the wash) |
| colored_pencil | 5/10 | 2 | 3 | RETIRE from flux couples (identity misses both sides + one giant face; #4 a cartoon head) |
| classical_oil | 2/5 | 0 | 3 | RETIRE from flux couples (three big-face solos 28-47%) |

Totals: 120 renders, first-try 105 (88%), delivered couples 112 (93%). Over the 20 approved looks: first-try 98/105
(93%), delivered couples 103/105 (98%) — better than the four album fragments' 37/40 (92.5%) in R11/R12. The old
approval matrix (graded 09-12/13 on the pre-narrative prompt) was stale in BOTH directions: rotoscope (rejected on
flux AND gemini, effectively dead) held 5/5; ink_illustration ("both couples collapsed to faceless scenes") 5/5;
watercolor_ink 5/5; while classical_oil (approved) fails. The composer, not the fragment, was what those grades measured.

Visual pass (montage of all 120): three-quarter framing, the place visible, faces 9-25% nearly everywhere; tightest
held frames were airbrush_poster #1 and chromolithograph #1 at 33% (under the 0.35 gate). Honest looks read MORE varied
than the four album fragments (watercolor paper, marker, rotoscope, pulp all distinct) and the dream's medium label
would finally match the picture.

**Proposed (NOT applied — production frozen):** (1) `nightly_look_approvals` flux-1.1-pro × couple: approved=true for
the 20 (revives rotoscope, adds watercolor_ink + ink_illustration to the couple pool), approved=false for classical_oil
+ colored_pencil (a rejected flux drops flux from that look's model pool → those two render couples on gemini, where
both are approved). (2) An `engine_config.nightly_flux_couple_honest_looks` boolean (default false = today's album
fragments) read at `lookFragmentOverrideFor`'s `fluxCouple` exemption (nightly-dreams/index.ts ~1644) and the
`LOOKS_FLUX_COUPLE_OVERRIDE_LIBRARY` site (~3295), so the flip is one DB row and reversible without a deploy.

### BUILT + LIVE 2026-09-18 ~20:20 UTC — honest looks for flux couples (Kevin: "go ahead, write the approvals and build the switch")

- **Migration 528** `nightly_look_approvals` flux-1.1-pro × couple: the 20 probe-approved looks `approved = true`
  (revives rotoscope; watercolor_ink + ink_illustration join the couple pool), classical_oil + colored_pencil
  `approved = false` (flux leaves their model pool → they render couples on gemini-2-image). Rollback state in the file.
- **Migration 529** `engine_config.nightly_flux_couple_honest_looks` boolean (default false = album fragments).
  Read at both library sites in `nightly-dreams/index.ts` (`lookFragmentOverrideFor` → stamp
  `look_override_library:off:honest_looks`; the `LOOKS_FLUX_COUPLE_OVERRIDE_LIBRARY` branch). QA per request:
  `force_honest_looks` (`lab-couple-round.js --honest=true|false`); `--model=roll` leaves the model to the engine.
- **Flipped to `true`** after the deploy. **Rollback = `UPDATE engine_config SET nightly_flux_couple_honest_looks =
  false`** (album fragments return, no deploy); the approvals stay either way.
- What organic flux couples now do: roll a look from the 20 (family-first, recency 7) → flux at policy weight 100 →
  the look's own fragment in the `narrative_fg` paragraph → the dream's medium label matches the picture. Solos,
  gemini couples and scenes were already honest. The re-render rung still moves to the look chain's next model
  (gemini), unlike the forced-flux probe.
- **Verified after the flip (V1, 20:08-20:12 UTC):** 10 forced couples with the engine rolling look AND model
  (`--model=roll --library=false`, no forced look): 10/10 held first try, faces median 14% (11-21%); every row stamped
  `look_override_library:off:honest_looks`, `model_roll:weighted:100/0` → flux-1.1-pro, and `uploads.dream_medium` ==
  the rolled look (watercolor_paper, ink_wash_comic, hand_drawn_illustration, watercolor_ink ×2, painted_comic_cover,
  ink_illustration, pulp_cover, rotoscope [`weighted:100 look:1` — flux is its only model], painted_fantasy).

### First re-render = the policy's fallback roll (2026-09-18 ~20:40 UTC) — Kevin: "make it roll between flux 2 flex and gemini for the first-try miss fallback … same roll for singles too, go … i trust flex … just enable flex for whatever gemini is enabled for"

- `nightlyStyle.ts forAttempt`: on the looks path, attempt 2 (the one re-render, `maxRerenders: 1`) now draws from
  `nightly_model_policy.<surface>.fallback_models` / `fallback_weights` — configured [flux-2-flex, gemini-2-image]
  50/50 on BOTH the couple and solo rows — instead of walking the graded chain (which sent 19 of 20 looks to gemini).
  The failed model never repeats (not in the row); bans still apply; an empty row (scene) keeps the chain walk.
  Stamp: `policy:<surface>:2:<model>:fallback_roll`. The rolled look is kept (`lockLook`), with its honest fragment.
- **Migration 530**: flux-2-flex mirrors every gemini-2-image approval (couple + solo, source 'override').
- The chain now, in Kevin's form: **couple = flux couple → [flex | gemini 50/50] couple → flux single (rebuild) →
  scene; single = flux single → [flex | gemini 50/50] single → scene.** Tune the split in the policy row's
  `fallback_weights` (100/0 = gemini only = the previous behaviour), no deploy.
- Not render-tested by Kevin's call ("we don't need to test it, i trust flex"); locked by
  `__tests__/lib/nightlyStyle.test.ts` "first re-render = the policy fallback roll".
