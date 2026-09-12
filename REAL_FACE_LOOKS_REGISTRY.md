# Real-Face LOOKS Registry — proven look × model × surface results (LIVE doc)

**Why this exists (Kevin, 2026-09-11):** the nightly looks research is producing a proven set of rendering styles
that survive the face-swap pipeline with a natural, non-pasted face. That same evidence is the foundation for a
LATER initiative: refactoring the mediums the app offers for "real face" Create dreams (single self and dual /
new-scene). When that work starts, this registry is the shortlist — which looks and which models do well for
SINGLE vs DUAL — so the Create refactor begins from proven rows instead of a blank page.

**Scope:** every look × model combination that has been through the fixed-scene matrix (§2) and graded. The
runtime copy of these verdicts is the `nightly_look_approvals` table (mig 498: look × model × surface → approved,
source matrix | override); nightly's resolver reads it, Create will read it later. Nightly
consumes it through `dream_mediums` rows (`nightly_look`, `nightly_surfaces`, mig 494/495). Create does NOT read
it yet; the mapping is §5.

**Rule of the doc:** the approval matrix (§3) is GENERATED — never edit it by hand. After grading a round, run
`node scripts/qa-nightly-looks-compare.js --registry` and it rewrites the block between the markers from the
per-model `grades_by_surface.json` files. Prose sections (§1, §2, §4, §5, §6) are edited by hand.

---

## 1. Definitions

- **Look** = a frozen rendering-style fragment (surface, finish, palette; never subject, composition, lighting or
  time of day). Two texts per look: the cast fragment (carries the swap-safety clause *"with lifelike adult faces,
  realistic human facial proportions with true-to-life eyes at natural size and spacing"*) and the scene fragment
  (the same without the clause). Rows live in `dream_mediums` with keys `nightly_*`.
- **Surface** = `solo` (one real face swapped) or `couple` (two faces, the dual swap). A look is approved PER
  surface; scene-only renders (no cast) can use any active look.
- **Verdict** = PASS / FAIL by EYE per surface on the matrix renders, on four questions: does the swapped face
  blend into the medium; does the identity hold; is the look distinct; and **is the person INTEGRATED into the
  scene** (Kevin 2026-09-11: "we want to avoid the strong cardboard-cutout look… there's a difference between
  standing straight together vs looking pasted in"). Standing straight or side by side is fine; floating on top
  of the scene with mismatched light, scale or shadow is a FAIL. The reason is written on every FAIL. The pipeline's identity score is
  recorded but is NOT the verdict (§4.1).

## 2. The method (repeatable; the "fixed-scene matrix")

`scripts/qa-nightly-looks-matrix.js --model=<image_models.id> [--all] [--count=2]`

- ONE scene held byte-identical across every render (forced slot input + forced Sonnet slots): the Victorian
  glasshouse, couple mid-dance beside the koi pond, solo at the railing, vibe cozy. Only the look fragment and the
  model change, so renders compare apples to apples.
- ONE cast: Kevin + plus-one photos (the real swap, real identities).
- Every render honest: `force_look` pins the row and bypasses the 1.1-pro override library; `dream_medium`, the
  album caption `✨ LOOK <key> <surface> #<n> [<model>]` and the log stamps all name the same look.
- N = 2 per surface per look per model (round 1 also ran the 5 parked looks). ≈ 45 s and 2-6 ¢ per render.
- Grading: side-by-side sheets per look per surface, graded by eye; Kevin hearts in the album; verdicts stored as
  `grades_by_surface.json` beside each model's `report.json`; pages `nightly-looks-matrix[-model].html`,
  `nightly-looks-verdicts.html`, `nightly-looks-compare.html` on the Desktop.
- Full round-1 write-up: `NIGHTLY_LOOK_TALLY.md`.

## 3. Approval matrix — GENERATED (look × model → approved surfaces)

<!-- approval-matrix:start -->
_Generated 2026-09-12 from flux-1.1-pro (172 renders, 43 graded), grok-imagine-image (125 renders, 38 graded), gemini-2-image (126 renders, 38 graded). Verdicts by eye per surface; reasons in each model's grades_by_surface.json and the Desktop pages._

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
| Pulp Adventure Cover | `nightly_pulp_cover` | **couple + solo** | **couple + solo** | **couple + solo** |
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
<!-- approval-matrix:end -->

## 4. Findings that any real-face initiative must carry (learned 2026-09-11)

1. **The identity score is not a quality gate.** Identity ≥ 0.50 passed giant floating heads (0.71-0.75) and solos
   where the subject became an older grey-bearded stranger (0.65-0.70). Gate = stamps AND a visual grade.
2. **Look words that imply a composition shrink the people.** "sweeping environment", "diorama", "cover",
   "poster composition", "storybook plate", "fresco/mural wall" all produced tiny bodies + pasted full-size faces
   or bobblehead caricatures on couples. Author looks as surface + finish only.
3. **Line-art and wash looks produce the pasted-on face** (watercolor-and-ink, ink illustration, storybook
   gouache) even when the swap "succeeds". Painted realism (oil, salon, baroque, digital painting, concept art)
   and photographic registers blend best.
4. **Solo age drift:** on photographic and loose-brush looks, 1 in 2 solos on flux-1.1-pro rendered an older
   grey-bearded man instead of the subject (noir, kodachrome, cinematic, alla prima, pastel, watercolor). A
   solo-swap / base-render age-prior issue to investigate on the pipeline, separate from look approval.
5. **Couples fail four ways:** lost the partner (degraded to a solo), faceless or caricature, faces turned to
   profiles (the poster / cinematic priors), pasted-on or identity drift. Solos pass far more often than couples;
   hence per-surface approval.
6. **Wardrobe and action are ignored under strong painted looks on 1.1-pro** (period costume instead of the
   specified green velvet / emerald satin; standing instead of dancing). Costume locks need the same prompt
   position the look has.
7. **Integration vs pose.** Natural, integrated poses are preferred (a hand on the railing, an arm around
   a waist, contact shadows, light from the room on the clothes). A stiff pose is acceptable; a "cardboard
   cutout" (the pair floating over the scene, no contact, mismatched light/scale) is not, and is graded as
   such even when the face blends. Round 2: grok integrated on every render; 1.1-pro's painted looks tended
   toward the frontal cutout.
8. **Reliability by model, 30 nights of real couple renders (first-pass dual success):** flux-1.1-pro 57 % ·
   grok-imagine 67 % · gemini-2-image 58 % · seedream-4 21/21 · flux-2-pro 57 % · flux-1.1-pro-ultra 89 % ·
   flux-2-flex 19 %. Costs: 2 ¢ grok · 3 ¢ seedream / flux-2-pro · 4 ¢ 1.1-pro / gemini · 6 ¢ ultra / flex.

## 5. How Create will consume this (the future initiative, not started)

- Create's "real face" mediums = the looks approved for the surface the user is rendering: **single self** →
  looks with `solo` in `nightly_surfaces`; **dual / new-scene two-person** → looks with `couple`. Same rows, a
  second consumer; no new fragment authoring.
- Create already has the honest per-(model × medium) override table (`face_swap_model_overrides`, mig 266). A
  look row IS that shape, so a look can be exposed to Create by (a) a public alias medium that points at the
  look's fragments, or (b) letting `get_dream_mediums` list approved looks under a "Real face" group. Decide then.
- Model choice in Create is the user's (DreamSmart); the matrix tells which models a look is approved on, so the
  DreamSmart membership for a real-face medium = the models with PASS on that surface.
- Open questions for that day: labels users see, price tier per model, whether parked looks get a second gate on
  other models before being offered.

## 5b. Nightly keeps EVERY approved look; consolidation happens when Create adopts them (Kevin 2026-09-12)

**Decision:** for nightly, near-duplicate looks stay in the pool — users neither see nor care which medium a night
was, and subtle variety is fine. "Once we offer these to the create screen as official mediums, we should
consolidate them at that point." The only thing to manage in nightly is ROLL SKEW: six oil cousins at equal weight
make "an oil painting" six times as likely as a chromolithograph. The resolver therefore rolls a **family** first
(equal shares across families) and a look inside the family second (`dream_mediums.nightly_family`, refactor plan
§2), so the week varies across families while each night can still be a slightly different oil.

**The consolidation shortlist for the Create day** (the compaction Kevin reviewed 2026-09-12 but chose NOT to apply
to nightly): 43 → 22 unique menu tiles.

| Keep (the strongest of its cluster) | Folds in |
|---|---|
| Classical Oil | Salon Realism, Painted Animation Frame |
| Baroque Oil | — |
| Painted Fantasy | Jewel Realism |
| Digital Painting | Matte Painting, Soft Brush Illustration |
| Oil Pastel | Pastel Portrait, Pastel Chalk |
| Sci-Fi Paperback | — |
| Pulp Adventure Cover | Magazine Cover, Painted Comic Cover |
| Retro Airbrush Poster | Retro Movie Poster |
| Ink Illustration | — |
| Storybook Gouache | Gouache Portrait |
| Painted Graphic Novel | Soft-Shaded Comic |
| Rotoscoped Animation | — |
| Marker Illustration | — |
| Ink-Wash Comic | — |
| Soft Pop Art | — |
| Chromolithograph | — |
| Big Head | — |
| Watercolor Portrait | Lineless Watercolor, Digital Watercolor, Watercolor & Ink |
| Aquarelle over Graphite | — |
| Vintage Film | — |
| Technicolor | Kodachrome Slide |
| Hand-Tinted Photograph | — |

Retire outright (never read as their medium or parked): Fresco, Encaustic, Alla Prima Oil, Film Noir, Cinematic Still.

## 6. How to add or re-test a look (the process)

1. Insert the row (`nightly_*` key, both fragments, directive, `nightly_look=true`, `nightly_surfaces={}` until
   graded) — see mig 494 for the shape and the authoring rules in the header of that file.
2. `node scripts/qa-nightly-looks-matrix.js --only=<key> --all --model=<model>` (2 couples + 2 solos).
3. Grade by eye per surface; write the verdict + reason into that model's `grades_by_surface.json`.
4. Set `nightly_surfaces` on the row (a migration, so the repo stays the source of truth).
5. `node scripts/qa-nightly-looks-compare.js --registry` → §3 updates; commit the doc with the grades.
