# Nightly LOOK tally — Phase A matrix, round 1 (2026-09-11)

**What ran.** 26 candidate looks (`dream_mediums` rows `nightly_*`, mig 494) × 2 couples × 2 solos = 104 renders,
flux-1.1-pro, vibe cozy, ONE fixed scene (the Victorian glasshouse, couple in a slow dance by the koi pond, solo at
the railing) held byte-identical by `force_slot_input` + `force_dual_slots` / `force_single_slots`; only the look's
swap fragment changed (position 2 of the prompt). Every render is honest: `force_look` pinned the row, the 1.1-pro
override library was exempt, `dream_medium` = the look key, caption `✨ LOOK <key> <surface> #<n>` in Kevin's private
Dreams album, stamps `look:<key>` / `look_source:force` / `look_override_library:exempt` in `ai_generation_log`.
Runner: `scripts/qa-nightly-looks-matrix.js`. Page: `~/Desktop/nightly-looks-matrix.html` (rows = looks; columns =
couple #1, #2, solo #1, #2; stamp verdict + Claude's grade per row).

**Three verdicts per look.** *Stamps* = both couples `dual-success` and median identity ≥ 0.50. *Claude* = a
visual grade of the four renders: does the swapped face blend into the medium (the "pasted-on" test), does the
identity hold, is the look distinct. *Kevin* = hearts in the album (heart = ban). The stamp verdict alone is NOT
sufficient — see finding 1.

## Result: 8 pass · 7 review · 11 fail (Claude) — stamps alone would have passed 17

| Look | key | Claude | stamps | dual ok | median id | face | look | notes |
|---|---|---|---|---|---|---|---|---|
| Classical Oil | `nightly_classical_oil` | **PASS** | PASS | 2/2 | 0.71 | 5/5 | 5/5 | Painted skin continuous with the oil world; no pasted-on edge; both couples and solos clean. The benchmark. |
| Digital Painting | `nightly_digital_painting` | **PASS** | PASS | 2/2 | 0.67 | 4/5 | 4/5 | Glossy digital-painting realism, faces natural. Tends to frame the couple wide (small faces) under this look; watch swap size. |
| Painted Fantasy | `nightly_painted_fantasy` | **PASS** | PASS | 2/2 | 0.67 | 4/5 | 4/5 | Faces integrate; strong jewel palette. The fantasy prior drifts wardrobe into costume (open shirt + chest tattoo, military coats). |
| Baroque Oil | `nightly_baroque_oil` | **PASS** | PASS | 2/2 | 0.69 | 5/5 | 5/5 | Both couples and solos superb: painted skin, deep grounds, velvet. The look pulls period costume (frock coats, gowns), which reads as a feature. Distinct from Classical Oil by darkness and grandeur. |
| Salon Realism | `nightly_salon_realism` | **PASS** | PASS | 2/2 | 0.70 | 5/5 | 4/5 | Refined, bright, smooth realism; faces natural in all four. Cousin of Classical/Baroque but lighter and more finished; keep if room. |
| Hand-Tinted Photograph | `nightly_hand_tinted_photo` | **PASS** | PASS | 2/2 | 0.66 | 4/5 | 5/5 | Distinct period tinted-photo look, faces blend as photographs do; couple #2 goes dark sepia Victorian. Kevin reads a touch heavier in the solos. |
| Chromolithograph | `nightly_chromolithograph` | **PASS** | PASS | 2/2 | 0.61 | 4/5 | 5/5 | The most distinct new look: Victorian printed illustration realism. Both couples natural, both solos good. A real gap filled. |
| Technicolor | `nightly_technicolor` | **PASS** | PASS | 2/2 | 0.68 | 4/5 | 3/5 | All four natural; saturated dye-transfer color reads. Overlaps Vintage Film / Kodachrome; keep one or two of the three. |
| Vintage Film | `nightly_vintage_film` | **REVIEW** | PASS | 2/2 | 0.70 | 3/5 | 4/5 | Photographic base blends faces with no pasted edge, but couple #1 rendered Kevin as a grey-haired older man (identity drift the stamps let through). Couple #2 and both solos are lovely period photos. |
| Jewel Realism | `nightly_jewel_realism` | **REVIEW** | REVIEW | 1/2 | 0.64 | 3/5 | 4/5 | Couple #1 collapsed to a faceless pure-scene fallback that ignored the scene (a neon waterfront with a MARINA sign). Couple #2 and both solos are good, saturated, faces fine. |
| Magazine Cover | `nightly_magazine_cover` | **REVIEW** | REVIEW | 1/2 | 0.65 | 3/5 | 3/5 | Couple #2 degraded to Kevin alone. Couple #1 is a stiff painted illustration; solos read as ordinary photos. Weak identity as a look. |
| Pulp Adventure Cover | `nightly_pulp_cover` | **REVIEW** | REVIEW | 1/2 | 0.57 | 3/5 | 4/5 | Couple #2 degraded to Kevin alone; couple #1 landed but small. Solos are excellent: rugged painted-realism adventurer, faces integrated. Worth a re-gate with tighter framing. |
| Cinematic Still | `nightly_cinematic_still` | **REVIEW** | PASS | 2/2 | 0.56 | 3/5 | 4/5 | Couple #2 and solo #2 are the most natural faces in the whole matrix (a real photo). But couple #1 turned the pair into profiles at the table and solo #1 drifted to an older man. |
| Kodachrome Slide | `nightly_kodachrome` | **REVIEW** | PASS | 2/2 | 0.64 | 4/5 | 4/5 | Both couples natural with true retro color (plus-one's hair went blonde-curly in #1). Solo #1 drifted to an older grey-bearded man again. |
| Oil Pastel | `nightly_oil_pastel` | **REVIEW** | PASS | 2/2 | 0.61 | 3/5 | 4/5 | Couple #1 a fine pastel painting; couple #2 turned the pair into profiles. Solo #1 came out as a plain photo, solo #2 a rich textured painting. |
| Watercolor & Ink | `nightly_watercolor_ink` | **FAIL** | PASS | 2/2 | 0.69 | 1/5 | 3/5 | Textbook pasted-on: photographic faces on a watercolor world; couple #2 body dissolves into the path; solos drift identity (grey hair, a different older man). Stamps passed, eyes do not. |
| Ink Illustration | `nightly_ink_illustration` | **FAIL** | FAIL | 0/2 | 0.50 | 0/5 | 2/5 | Both couples degraded all the way to faceless pure-scene fallbacks (easel in mountains, silhouettes on cliffs). Solos render but the ink look barely shows. |
| Storybook Gouache | `nightly_storybook_gouache` | **FAIL** | REVIEW | 1/2 | 0.65 | 1/5 | 3/5 | Couple #1 bobblehead caricature proportions; couple #2 faceless pure-scene fallback. Solos fine but generic. Storybook language = cartoon proportions, as feared. |
| Film Noir | `nightly_film_noir` | **FAIL** | REVIEW | 1/2 | 0.48 | 2/5 | 3/5 | Couple #2 degraded to a solo with selective color (koi and orchids in color, everything else grey), not noir at all. Solo #2 drifted to an older grey-bearded man. Monochrome + swap is unreliable. |
| Retro Movie Poster | `nightly_movie_poster` | **FAIL** | PASS | 2/2 | 0.51 | 2/5 | 3/5 | The poster prior turns the couple to face EACH OTHER in profile with small faces (both couples), so the swap has little to land on (median identity 0.51, the lowest pass). Solos are fine but the look is not distinct. |
| Sci-Fi Paperback | `nightly_scifi_paperback` | **FAIL** | FAIL | 0/2 | 0.66 | 2/5 | 4/5 | Both couples degraded to Kevin alone (the second face never split). Ironically the only look that honored the green velvet jacket. Solo #2 shrank him into a wide vista. |
| Matte Painting | `nightly_matte_painting` | **FAIL** | FAIL | 0/2 | 0.48 | 2/5 | 4/5 | Both couples degraded to Kevin alone: 'sweeping painted environment' shrinks the people, exactly the face-swap hard rule. Pretty renders, unusable for couples. |
| Fresco | `nightly_fresco` | **FAIL** | PASS | 2/2 | 0.71 | 0/5 | 2/5 | Couple #1 sepia bobblehead caricatures; couple #2 giant floating faces over tiny bodies (the swap pasted full-size faces onto a wide scene). Solo #1 is a plain photo with the wrong hair. Cut. |
| Pastel Chalk | `nightly_pastel_chalk` | **FAIL** | PASS | 2/2 | 0.71 | 1/5 | 4/5 | Couple #1 is a genuinely pretty pastel painting but the plus-one drifted blonde; couple #2 giant floating heads; solo #1 an older grey-bearded stranger. Lovely look, unsafe swap. |
| Alla Prima Oil | `nightly_alla_prima` | **FAIL** | REVIEW | 1/2 | 0.61 | 2/5 | 4/5 | Couple #1 degraded to Kevin alone; solo #1 drifted to an older grey-bearded stranger. Couple #2 and solo #2 are handsome loose-brush paintings. Two failures of four. |
| Encaustic | `nightly_encaustic` | **FAIL** | PASS | 2/2 | 0.75 | 0/5 | 3/5 | Couple #1 giant floating heads over a landscape, couple #2 bobblehead caricatures. Solos fine. The wax language reads as 'craft' and shrinks the people. |

## Proposed v1 (pending Kevin's hearts)

**In:** Classical Oil, Digital Painting, Painted Fantasy, Baroque Oil, Salon Realism, Hand-Tinted Photograph, Chromolithograph, Technicolor.
**Kevin decides (one strong render, one weak):** Vintage Film, Jewel Realism, Magazine Cover, Pulp Adventure Cover, Cinematic Still, Kodachrome Slide, Oil Pastel.
**Out:** Watercolor & Ink, Ink Illustration, Storybook Gouache, Film Noir, Retro Movie Poster, Sci-Fi Paperback, Matte Painting, Fresco, Pastel Chalk, Alla Prima Oil, Encaustic.

That is 8 sure looks across four families (oil painting ×3 cousins, concept/digital painting ×2, printed
illustration ×1, photographic ×2) plus up to 7 more from the review set. Recency-7 over 8-15 looks, combined with
the scene / action / wardrobe variety nightly already has, is more visible variety than today's four repainted
styles.

## Findings that change the plan

1. **The stamp gate is necessary, not sufficient.** Identity ≥ 0.50 passed renders that are visually broken:
   giant floating heads over a landscape (encaustic 0.75, fresco 0.71, pastel 0.71) and solo renders where Kevin
   became an older grey-bearded stranger (identity 0.65-0.70). The gate catches degrades and no-face; it does not
   catch age drift or a pasted composite. **Phase A4/A5 must be stamps + a visual grade**, and the monitor in
   Phase 5 needs a visual sample, not only stamps.
2. **Looks whose words imply a wide or craft composition shrink the couple, and the swap then pastes full-size
   faces onto tiny bodies.** Encaustic, fresco, storybook gouache, matte painting, sci-fi paperback, movie poster
   all did it. Same family as the face-swap hard rule (never make the scene dominant): a LOOK can do it too.
   Authoring rule for the catalog: describe surface and finish only; never "sweeping", "diorama", "cover", "plate",
   "storybook", "poster composition".
3. **Line-art and wash looks are the pasted-on look Kevin described.** Watercolor & ink and ink illustration (two
   of the four styles the override library uses tonight) fail the visual test even when the stamps pass; storybook
   gouache collapses to caricature. These three should leave the override rotation now, not at cutover.
4. **Photographic looks blend faces best when the composition lands** (cinematic #2, kodachrome, vintage #2,
   hand-tinted, technicolor), but they are the most prone to the "faces each other in profile" composition and to
   the older-stranger solo drift. They belong in v1 only with a second gate round.
5. **1.1-pro under a painted look ignores wardrobe colors and the dance** (tux + gown instead of green velvet +
   emerald; standing instead of dancing) on 25 of 26 looks. Constant across looks, so not a comparison problem,
   but it means wardrobe locks (costumes) will need the position-2 treatment the looks get.
6. **Model-side reliability is fine:** 104/104 renders completed (three transient 546s retried), 40-50 s each.

## Next
- Kevin hearts in the album → the review set resolves; the tally freezes v1 (keys + labels + fragments by row id).
- Re-gate the survivors on 4 more couples each with a different fixed scene (an exterior) — the glasshouse is one
  data point.
- Pull watercolor-ink / ink-illustration / storybook-gouache from `faceSwapModelOverrides.ts` (finding 3) as a
  standalone commit; the override library dies at cutover anyway.
- Phase 1 (behavior-neutral style contract) proceeds in parallel; Phase 2 seeds from this tally.


## Round 1 regraded PER SURFACE (Kevin 2026-09-11: "for solo every look was good; for couples it was different")

Page: `~/Desktop/nightly-looks-verdicts.html`. Same renders, graded by eye per surface; every rejection carries its reason.

**Pass both (8):** Classical Oil, Digital Painting, Painted Fantasy, Baroque Oil, Salon Realism, Hand-Tinted Photograph, Chromolithograph, Technicolor.
**Pass solo (20 of 26).** The six solo failures are ONE defect: one of the two solos came back as an older grey-bearded
man instead of Kevin (identity 0.65-0.70, so the floor let it through). It appears on photographic and loose-brush
looks (noir, kodachrome, cinematic, alla prima, pastel, watercolor) — a solo-swap / base-render age-prior issue to
investigate on its own, not a reason to drop those looks for solos yet.
**Pass couple (9 of 26).** Couple failures fall into four buckets: lost her (degraded to Kevin alone) ×7, faceless
or caricature (floating heads / bobbleheads / no people) ×6, faces turned into profiles ×3, pasted-on / identity ×2.

| Look | key | solo | why | couple | why |
|---|---|---|---|---|---|
| Classical Oil | `nightly_classical_oil` | **PASS** |  | **PASS** |  |
| Digital Painting | `nightly_digital_painting` | **PASS** |  | **PASS** | Frames the couple wide; faces smaller. |
| Painted Fantasy | `nightly_painted_fantasy` | **PASS** | Costume drift (frock coats), face fine. | **PASS** |  |
| Watercolor & Ink | `nightly_watercolor_ink` | **FAIL** | Solo #2 came back as an older white-bearded man, not Kevin. Solo #1 greyed the hair. | **FAIL** | Photo faces pasted on a watercolor world; couple #2 bodies dissolve into the path. |
| Ink Illustration | `nightly_ink_illustration` | **PASS** | Face fine; the ink look barely shows. | **FAIL** | Both couples collapsed to faceless scenes (no people at all). |
| Storybook Gouache | `nightly_storybook_gouache` | **PASS** |  | **FAIL** | Couple #1 bobblehead caricatures; couple #2 a faceless scene. |
| Film Noir | `nightly_film_noir` | **FAIL** | Solo #2 came back as an older grey-bearded man, not Kevin. | **FAIL** | Couple #2 lost her: Kevin alone with odd selective color. |
| Vintage Film | `nightly_vintage_film` | **PASS** |  | **FAIL** | Couple #1 rendered Kevin as an older grey-haired man. Couple #2 is lovely. |
| Baroque Oil | `nightly_baroque_oil` | **PASS** |  | **PASS** |  |
| Salon Realism | `nightly_salon_realism` | **PASS** |  | **PASS** |  |
| Jewel Realism | `nightly_jewel_realism` | **PASS** |  | **FAIL** | Couple #1 collapsed to a faceless scene of the wrong place. |
| Magazine Cover | `nightly_magazine_cover` | **PASS** | Reads as a plain photo; weak as a look. | **FAIL** | Couple #2 lost her: Kevin alone. Couple #1 stiff. |
| Retro Movie Poster | `nightly_movie_poster` | **PASS** |  | **FAIL** | Both couples turned to face each other in profile; faces too small to swap. |
| Sci-Fi Paperback | `nightly_scifi_paperback` | **PASS** | Solo #2 shrank him into a wide vista. | **FAIL** | Both couples lost her: Kevin alone. |
| Matte Painting | `nightly_matte_painting` | **PASS** | Scene-heavy framing. | **FAIL** | Both couples lost her: the sweeping scene shrinks the people. |
| Pulp Adventure Cover | `nightly_pulp_cover` | **PASS** |  | **FAIL** | Couple #2 lost her: Kevin alone. Couple #1 faces small. |
| Fresco | `nightly_fresco` | **PASS** | Solo #1 is a plain photo with the wrong hair; the fresco look disappears. | **FAIL** | Couple #1 bobbleheads; couple #2 giant floating heads. |
| Pastel Chalk | `nightly_pastel_chalk` | **FAIL** | Solo #1 came back as an older grey-bearded man, not Kevin. | **FAIL** | Couple #2 giant floating heads; couple #1 her hair drifted blonde. |
| Alla Prima Oil | `nightly_alla_prima` | **FAIL** | Solo #1 came back as an older grey-bearded man, not Kevin. | **FAIL** | Couple #1 lost her: Kevin alone. |
| Cinematic Still | `nightly_cinematic_still` | **FAIL** | Solo #1 came back as an older grey-bearded man, not Kevin. | **FAIL** | Couple #1 profiles facing each other at the table. Couple #2 is the best photo in the set. |
| Kodachrome Slide | `nightly_kodachrome` | **FAIL** | Solo #1 came back as an older grey-bearded man, not Kevin. | **PASS** | Her hair went curly-blonde in #1; faces fine. |
| Hand-Tinted Photograph | `nightly_hand_tinted_photo` | **PASS** |  | **PASS** |  |
| Chromolithograph | `nightly_chromolithograph` | **PASS** |  | **PASS** |  |
| Oil Pastel | `nightly_oil_pastel` | **PASS** | Solo #1 is a plain photo; the pastel look shows only on #2. | **FAIL** | Couple #2 profiles facing each other. |
| Technicolor | `nightly_technicolor` | **PASS** |  | **PASS** |  |
| Encaustic | `nightly_encaustic` | **PASS** |  | **FAIL** | Couple #1 giant floating heads; couple #2 bobbleheads. |

## Architecture applied (2026-09-11, mig 495) + round 2 plan

The per-surface verdicts above are now DATA on the rows: `nightly_surfaces` = {couple,solo} (8), {solo} (12),
{couple} (1: kodachrome), {} parked (5: watercolor_ink, film_noir, pastel_chalk, alla_prima, cinematic_still, kept
inactive for re-testing). A look is approved per surface, and the resolver rolls only looks approved for the render's
surface. `scripts/qa-nightly-looks-matrix.js --model=<id>` re-runs the identical matrix (same scene, cast, forced
slots) on another model, rendering each look only on its approved surfaces (`--all` re-tests every row on both).

**Round 2 candidates (cost per image from `image_models`; couple first-pass dual success over the last 30 nights of
real users, `ai_generation_log`):** flux-1.1-pro 4¢ · 57 % (baseline) · xai/grok-imagine-image 2¢ · 67 % (and 8/8 in
the 2026-09-07 bake-off) · google/gemini-2-image 4¢ · 58 % · bytedance/seedream-4 3¢ · 21/21 (small n; 2K PNGs) ·
flux-2-pro 3¢ · 57 % · flux-1.1-pro-ultra 6¢ · 89 % (same family; heavier swap memory) · flux-2-flex 6¢ · 19 % (no).


## Rounds 2 + 3 — three models, 42 looks (2026-09-11/12)

Round 2 re-ran the 21 approved looks on **grok-imagine-image** (2 ¢) and **gemini-2-image** (4 ¢), approved surfaces
only; round 3 added 17 comic-family / watercolor-adjacent / big-head candidates (migs 496-497) on all three models,
both surfaces. Same fixed scene, same cast, same forced slots. Graded by eye per surface with Kevin's integration
criterion. Page: `~/Desktop/nightly-looks-compare.html`; registry block regenerated in `REAL_FACE_LOOKS_REGISTRY.md`.

**Per model (looks passing / looks graded):** flux-1.1-pro couples 11/43 · solos 33/43 ·
grok couples 26/26 · solos 37/37 ·
gemini couples 25/26 · solos 36/36.

**Headline:** the couple problem is a MODEL problem, not a look problem. grok and gemini landed every couple on
every look they rendered (23 looks pass both surfaces on both), honored the wardrobe and the pose, integrated
the people (contact shadows, hands on the world), and showed no identity or age drift. flux-1.1-pro passed
11 of 43 couple looks and produced every failure class in the catalog (profiles, floating heads,
caricature, lost partner, age drift). The comic and watercolor families that fail on flux (Soft Pop Art, Marker,
Ink-Wash Comic, Lineless Watercolor, Digital Watercolor, Rotoscope on grok) are real, distinct, swap-safe looks on
grok and gemini. The exceptions on the two cheaper models: gemini's Rotoscope couples came back with cartoon-
enlarged eyes (the big-eye failure), and the Big Head solo on flux aged into a white-haired stranger. Trade-off:
grok flattens several painted registers into one "painted realism" (Jewel, Magazine, Movie Poster, Matte, Pulp,
Encaustic read alike), gemini keeps them more distinct and is the most consistent compositionally (nearly the same
pose every render). Costs: grok 2 ¢, gemini 4 ¢, flux 4 ¢ per base render.

**Passing both surfaces on all three models (9):** Classical Oil, Digital Painting, Painted Fantasy, Baroque Oil, Salon Realism, Hand-Tinted Photograph, Chromolithograph, Technicolor, Watercolor Portrait.

| Look | key | flux-1.1-pro | grok-imagine-image | gemini-2-image |
|---|---|---|---|---|
| Classical Oil | `nightly_classical_oil` | **couple + solo** | **couple + solo** | **couple + solo** |
| Digital Painting | `nightly_digital_painting` | **couple + solo** | **couple + solo** | **couple + solo** |
| Painted Fantasy | `nightly_painted_fantasy` | **couple + solo** | **couple + solo** | **couple + solo** |
| Watercolor & Ink | `nightly_watercolor_ink` | none | — | — |
| Ink Illustration | `nightly_ink_illustration` | solo | solo | solo |
| Storybook Gouache | `nightly_storybook_gouache` | solo | solo | solo |
| Film Noir | `nightly_film_noir` | none | — | — |
| Vintage Film | `nightly_vintage_film` | solo | solo | solo |
| Baroque Oil | `nightly_baroque_oil` | **couple + solo** | **couple + solo** | **couple + solo** |
| Salon Realism | `nightly_salon_realism` | **couple + solo** | **couple + solo** | **couple + solo** |
| Jewel Realism | `nightly_jewel_realism` | solo | solo | solo |
| Magazine Cover | `nightly_magazine_cover` | solo | solo | solo |
| Retro Movie Poster | `nightly_movie_poster` | solo | solo | solo |
| Sci-Fi Paperback | `nightly_scifi_paperback` | solo | solo | solo |
| Matte Painting | `nightly_matte_painting` | solo | solo | solo |
| Pulp Adventure Cover | `nightly_pulp_cover` | solo | solo | solo |
| Fresco | `nightly_fresco` | solo | solo | solo |
| Pastel Chalk | `nightly_pastel_chalk` | none | — | — |
| Alla Prima Oil | `nightly_alla_prima` | none | — | — |
| Cinematic Still | `nightly_cinematic_still` | none | — | — |
| Kodachrome Slide | `nightly_kodachrome` | couple | couple | couple |
| Hand-Tinted Photograph | `nightly_hand_tinted_photo` | **couple + solo** | **couple + solo** | **couple + solo** |
| Chromolithograph | `nightly_chromolithograph` | **couple + solo** | **couple + solo** | **couple + solo** |
| Oil Pastel | `nightly_oil_pastel` | solo | solo | solo |
| Technicolor | `nightly_technicolor` | **couple + solo** | **couple + solo** | **couple + solo** |
| Encaustic | `nightly_encaustic` | solo | solo | solo |
| Painted Comic Cover | `nightly_painted_comic_cover` | none | **couple + solo** | **couple + solo** |
| Soft-Shaded Comic | `nightly_soft_comic` | solo | **couple + solo** | **couple + solo** |
| Rotoscoped Animation | `nightly_rotoscope` | solo | **couple + solo** | solo |
| Painted Animation Frame | `nightly_painted_animation` | none | **couple + solo** | **couple + solo** |
| Retro Airbrush Poster | `nightly_airbrush_poster` | solo | **couple + solo** | **couple + solo** |
| Marker Illustration | `nightly_marker` | solo | **couple + solo** | **couple + solo** |
| Ink-Wash Comic | `nightly_ink_wash_comic` | solo | **couple + solo** | **couple + solo** |
| Soft Pop Art | `nightly_soft_pop_art` | solo | **couple + solo** | **couple + solo** |
| Painted Graphic Novel | `nightly_painted_graphic_novel` | solo | **couple + solo** | **couple + solo** |
| Lineless Watercolor | `nightly_lineless_watercolor` | solo | **couple + solo** | **couple + solo** |
| Watercolor Portrait | `nightly_watercolor_portrait` | **couple + solo** | **couple + solo** | **couple + solo** |
| Digital Watercolor | `nightly_digital_watercolor` | solo | **couple + solo** | couple |
| Gouache Portrait | `nightly_gouache_portrait` | solo | **couple + solo** | **couple + solo** |
| Aquarelle over Graphite | `nightly_aquarelle_graphite` | none | **couple + solo** | **couple + solo** |
| Soft Brush Illustration | `nightly_soft_brush_illustration` | solo | **couple + solo** | **couple + solo** |
| Pastel Portrait | `nightly_pastel_portrait` | solo | **couple + solo** | **couple + solo** |
| Big Head | `nightly_big_head` | couple | **couple + solo** | **couple + solo** |

**Recommendation for the final approval matrix:** approve per (look × model × surface) exactly as the table
says, and let the nightly model policy decide the model: with grok or gemini as the couple primary, the couple
catalog is 25+ looks instead of 9; with flux-1.1-pro it is 9. Kevin's hearts in the album finalize it.
