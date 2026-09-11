# Nightly LOOKS Catalog — the plan of record (2026-09-11)

**Kevin's direction (2026-09-11):** "start using more of a 'looks' system how MangaBot, FarmBot and a few other
bots have a predefined set of styles/looks that we use to render different 'mediums' using just one model.
flux 1.1 pro is our best candidate for our nightly model … draft up a catalog of looks that fill all the same
looks as the current medium list for nightly … a proposal/plan on how to convert nightly into our own curated
list of looks that are tested and proven — all styles we love … brainstorm cool looks … converting to looks
gives us more predictable and tighter control over how nightly dreams look, avoiding one-off random renders."

Predecessors (read, not repeated): `NIGHTLY_NAILED_LOOKS_RESEARCH.md` (charter), `NIGHTLY_LOOKS_FEASIBILITY.md`
(touch-point inventory, catalog shape, resolver, risks — still accurate), `HOLIDAY_DAY_OF_PLAN.md` §5d/§5e
(the LIVE pilot: 11 `halloween_*` look rows + the pin route). This doc is the build plan on top of them.

---

## 1. How the looks system works (what I learned, translated for nightly)

**In the bots** (5 proven bots — YumBot, MangaBot, ChibiBot, BloomBot, DinoBot; FarmBot is the 6th):

| Ingredient | Bot mechanism | What it buys |
|---|---|---|
| A hand-curated **look register** (6-25 entries) | `scripts/bots/<bot>/seeds/<bot>_look_register.json` — PURE rendering style: palette / linework / shading / finish / studio-family; never subject anatomy, never time-of-day / weather / lighting (2nd amendment, 2026-09-09) | one identity, many treatments; every look is one Kevin has seen and kept |
| A **neutral medium** | locks the CAST/composition, carries no style words | the look is the ONLY style text, so it always wins CLIP |
| **Look leads the prompt** | Sonnet is told to open the Flux prompt with the look tokens (plain cooperative wording — "AUTHORITY / NON-NEGOTIABLE" triggers Sonnet refusals, 1st amendment) | CLIP anchors on the look |
| **Recency picker** | `picker.pickWithRecency(pool, 'look_register')` per bot | no same-look-twice clustering |
| **Model pin + heart = ban** | `modelByPath` / `allowedModels` from the HTML-matrix review | a look only runs on a model that renders it |

**In nightly the pieces already exist — and the day-of pilot is running them in production:**

- The **catalog** = rows in `dream_mediums` under a namespace the app never lists (`is_public=false`,
  `is_dream_eligible=false`, `nightly_skip=true`, own `client_meta.smart_dream_models`). Eleven `halloween_*`
  rows exist today (6 cast looks with swap-safe fragments, 5 scene-only craft looks).
- The **neutral medium** is unnecessary: the nightly prompt is ASSEMBLED, not Sonnet-written, for cast
  renders — `characterSlotPrompt.ts` puts the medium fragment at position 2 (after the gender lock, before the
  people line) and nothing downstream carries style words. The look's fragment IS the style text.
  Scene-only renders pass the medium's `directive` into the Sonnet brief as `STYLE GUIDE` + `MEDIUM:` — so a
  scene look needs a `directive` too (every pilot row has one).
- The **pin route** = `dualSceneMediumKey → resolveMediumFromDb(key)` → the model is re-picked from the LOOK's
  `smart_dream_models`, the flux-1.1-pro override library is bypassed, the solo rebuild inherits the look's
  real fragment. `pickDayOfLook()` is the resolver at 1/20 scale.
- **Recency** = the existing `recentMediums` (last 7 per user from `ai_generation_log`) — it keys on the
  medium key, so look keys ride it unchanged.
- **Model pin** = `nightly_model_policy` (couple / solo / solo_rebuild / scene) — 1.1-pro primary everywhere
  except solo (1.1-pro or flex) and solo_rebuild (flex). Still `model_policy_mode = shadow` (matching:
  `policy_shadow:faceswap_pick:match` on every sampled row).

**The one thing missing is the ROLL SITE:** replace `resolveMediumFromDb('dream_eligible…')` with a catalog
roll, and retire the override library for nightly. Everything else is wiring the pilot already proved.

---

## 2. What nightly renders TODAY (live DB + 30-day log, 2026-08-12 → 2026-09-11, ≈ 2,970 renders)

**Mix:** cast/face-swap **87 %** (dual 1,479 · self 161 · plus-one 62 · untyped 894) · pure scene **11 %**
(327, incl. 42 holiday scenes) · embodied "Dream Art" **1 %** (31) · epic_tiny 6.

**Cast pool** (`is_dream_eligible ∧ face_swaps ∧ natural`, 10 mediums) and what actually rendered:

| medium | 1.1-pro renders | other models | dual degrades on 1.1-pro | note |
|---|---:|---:|---:|---|
| canvas | 348 | flex 114 · grok 119 · f2-pro 87 · gemini 46 · gpt 43 · ultra 34 | 20 (6 %) | the workhorse; has a swap fragment |
| illustration | 123 | flex 43 · grok 12 | 10 (8 %) | no swap fragment |
| glamour | 115 | flex 21 | 9 (8 %) | photo-family ("airbrushed glamour shot") |
| watercolor | 112 | flex 43 · grok 16 | 12 (11 %) | no swap fragment |
| film_noir | 111 | grok 14 | 6 (5 %) | photo-family; best like-rate of the set |
| photography | 111 | flex 48 · flux-dev 47 · grok 20 · gemini 11 · gpt 10 | 17 (15 %) | Kevin's standing rule: no photography in nightly |
| vintage_film | 110 | flex 16 · grok 16 | 15 (14 %) | photo-family |
| comics | 100 | flex 34 · grok 10 · f2-pro 8 | 13 (13 %) | swap fragment |
| pencil | 93 | flex 52 · grok 14 · gemini 9 | 11 (12 %) | swap fragment |
| pop_art | 71 | flex 30 | 10 (14 %) | swap fragment |
| *(scenario pins)* painted_gothic_fantasy · gothic_painted · gothic_oil_garden · heirloom · vampire_portrait | 31 · 16 · 9 · 8 · 0 | ultra 17 · 16 · 10 · — · 8 | | `dual_scenarios.mediumKey` pins — already look-shaped |

**The label lies on 1.1-pro.** `pickFaceSwapModelOverride` replaces EVERY 1.1-pro cast fragment with one of
4 curated art fragments (watercolor-ink / crisp-ink illustration / polished digital painting / semi-real
comic) regardless of the rolled medium. So a "photography" or "glamour" render on 1.1-pro is actually one of
those four; the card says Photography. The visible 1.1-pro variety today is **4 looks**, and the 6 non-1.1-pro
models render the raw fragments (photography IS photography on flex / flux-dev / grok).

**Scene pool** (`is_scene_eligible`): canvas, cinematic, dreamscape, gouache, illustration, photography,
watercolor (+ lego / pixels / handcrafted via the embodied sub-roll on mid/high chaos tiers).
**Embodied** (`embodied_mediums_mid = {lego,pixels}`, `_high = {lego,pixels,handcrafted}`): 1 % of volume.
**Vibes** (dream-eligible 5): cinematic, cozy, epic, nostalgic, peaceful — untouched by this plan (v1).

**Evidence limits.** Likes on nightly renders average 0.02-0.23 per render and quarantines are 0-2 per
medium, so the data cannot rank "what nails" — Kevin's graded grid (§5) is the ranking. The data DOES say:
dual degrades run 5-15 % per medium on 1.1-pro with no medium clearly worse, i.e. the swap constraint is
model-bound, not medium-bound (consistent with `project_dual_framing_width_costs_identity`).

---

## 3. Catalog v1 — every current nightly look mapped to a curated look (flux-1.1-pro)

Authoring rules (from the bots + our own swap lessons): pure rendering technique; **no** time-of-day / weather
/ season / lighting words; **no** artist, studio or photographer names; positive-only (no "no X"); a cast
look carries the proven swap-safety clause *"with lifelike adult faces, realistic human facial proportions with
true-to-life eyes at natural size and spacing"*; ≤ 350 chars; one row = one frozen version (a change = a new
row, never an edit). Every row: `key`, `label` (what the card shows), `flux_fragment` (scene use),
`face_swap_flux_fragment` (cast use), `directive` (scene brief), `smart_dream_models`, `weight`.

### 3a. Cast looks (face-swap; the 87 %) — 12 rows

| # | key · label | Covers today | Source / status | Fragment (cast, swap-safe) |
|---|---|---|---|---|
| C1 | `nightly_classical_oil` · **Classical Oil** | canvas | `halloween_classical_oil` verbatim — PROVEN on day-of couples | classical oil painting with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, smooth refined brushwork, softly blended tones, rich luminous color, warm chiaroscuro modelling, smooth glazed skin, clean clearly-readable features, elegant oil-on-canvas finish |
| C2 | `nightly_watercolor_ink` · **Watercolor & Ink** | watercolor | override #1 / `halloween_watercolor_ink` — PROVEN | loose watercolor and ink painting with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, transparent pigment washes on textured watercolor paper, soft feathered bleeding edges, visible brushstrokes and fine ink linework, a luminous palette taking its colours from the scene, painterly realism |
| C3 | `nightly_ink_illustration` · **Ink Illustration** | illustration | override #2 / `halloween_ornate_ink` — PROVEN | crisp ink illustration with bold confident linework and lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, clean intricate line art, rich saturated color, masterwork hand-drawn editorial illustration, illustrated realism, gallery-quality detailed drawing |
| C4 | `nightly_graphic_novel` · **Graphic Novel** | comics | override #4 (`bannedVibes: epic`) — proven in rotation | grounded semi-realistic comic-book illustration, painted graphic-novel art with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, bold confident ink linework and rich saturated flat color, detailed hand-painted character art, illustrated realism |
| C5 | `nightly_pop_art` · **Pop Art** | pop_art | pop_art swap fragment — GATE (1.1-pro may flatten to photo) | premium pop-art illustration with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, crisp clean outlines, Ben-Day halftone dot shading on clothing and environment, rich saturated retro palette, layered textured scene, vintage print poster texture |
| C6 | `nightly_colored_pencil` · **Colored Pencil** | pencil | pencil swap fragment — GATE | colored pencil drawing with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, visible pencil strokes, directional hatching, paper tooth showing through, layered transparent color, waxy pencil sheen, confident hand-drawn linework |
| C7 | `nightly_storybook_gouache` · **Storybook Gouache** | *(new — the day-of hero look, de-Halloweened)* | `halloween_storybook_gouache` minus pumpkin/violet palette — PROVEN mechanism | rich gouache and ink storybook painting with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, opaque matte color fields, painterly textured brushwork, whimsical illustrated realism, hand-painted picture-book plate |
| C8 | `nightly_painted_fantasy` · **Painted Fantasy** | scenario pins painted_gothic_fantasy / gothic_painted | `halloween_dark_fantasy_oil` generalized (drop "gothic / dark-paperback") | painted fantasy concept art with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, oil-painted brushwork, dramatic chiaroscuro modelling, deep saturated jewel tones with painted shadow, rich painterly texture, illustrated-cover realism |
| C9 | `nightly_digital_painting` · **Digital Painting** | (override #3) | `halloween_digital_painting` — its day-of row EXCLUDES 1.1-pro (flex/gemini/grok only) → GATE on 1.1-pro; else flex-only (the solo/rebuild model) | polished digital painting with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, professional concept art, smooth painterly surfaces with crisp detail, vibrant saturated colors, fine art digital painting |
| C10 | `nightly_film_noir` · **Film Noir** | film_noir | photo-family — **Kevin decides** (§7 Q1); highest like-rate today | dramatic black and white film noir photograph with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, rich high-contrast monochrome, deep inky blacks and luminous highlights, bold directional chiaroscuro, fine film grain, dramatic tonal depth |
| C11 | `nightly_vintage_film` · **Vintage Film** | vintage_film | photo-family — **Kevin decides** | nostalgic vintage analog film photograph with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, 35mm look, warm faded color, soft film grain, gentle halation, muted contrast, aged color cast |
| C12 | `nightly_pastel_chalk` · **Pastel Chalk** | *(new)* | AUTHOR + GATE | soft pastel chalk drawing on toned paper with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, velvety blended pigment, visible chalk strokes and paper grain, luminous layered color, hand-drawn portrait realism |

**Dropped from the cast roll:** `photography` (standing rule; on 1.1-pro it never rendered as photography
anyway), `glamour` (the "airbrushed glamour shot" register = plain-portrait risk; `glamour_shot_retro` was
already turned off in the no-plain-renders work). Both stay available to Create untouched.

### 3b. Scene-only looks (no swap constraint, richer allowed; the 11 %) — 12 rows

| # | key · label | Covers today | Source |
|---|---|---|---|
| S1 | `nightly_oil_landscape` · Classical Oil | canvas (scene) | canvas fragment, no face clause |
| S2 | `nightly_watercolor_scene` · Watercolor | watercolor (scene) | watercolor fragment |
| S3 | `nightly_gouache_poster` · Gouache Poster | gouache | gouache fragment ("bold opaque color fields, poster-like saturation, clean graphic shapes") |
| S4 | `nightly_dreamscape` · Dreamscape | dreamscape | dreamscape fragment (soft painterly, luminous, blooming color) |
| S5 | `nightly_ink_wash` · Ink & Wash | *(new)* | "sumi-style ink and wash painting, confident brush calligraphy strokes, graded ink washes, generous unpainted paper, restrained accent color" |
| S6 | `nightly_linocut` · Linocut | *(new)* | "linocut block print, bold carved linework, flat inked color layers with slight misregistration, visible relief texture, poster composition" |
| S7 | `nightly_risograph` · Risograph | *(new)* | "risograph print, two or three spot-color layers with grainy halftone texture, slight misregistration, flat matte inks, zine-poster feel" |
| S8 | `nightly_paper_diorama` · Paper Diorama | `halloween_papercut` generalized | layered cut-paper planes, visible paper edges, backlit depth, theatrical shadows |
| S9 | `nightly_stop_motion` · Stop Motion | `halloween_stop_motion` generalized | hand-built miniature set, wire-jointed puppets, painted backdrops, tilt-shift depth |
| S10 | `nightly_felted_wool` · Felted Wool | `halloween_felt` generalized | needle-felted wool diorama, embroidered stitch details, macro depth |
| S11 | `nightly_claymation` · Claymation | claymation / `halloween_claymation` | plasticine forms, thumbprints and tool marks, tabletop set |
| S12 | `nightly_stained_glass` · Stained Glass | *(new)* | "stained-glass window panel, bold leaded outlines, jewel-toned translucent glass segments, backlit glow, mosaic composition" |

**Dropped from the scene roll:** photography; `cinematic` (a film still = photography with a color grade —
**Kevin decides**, §7 Q1). `halloween_marigold_folk` stays Halloween-only.

### 3c. Embodied "Dream Art" (lego / pixels / handcrafted, 1 %) — **not converted in v1**
One variable at a time. v2 adds a `surface = embodied` axis and folds them in (or Kevin drops the tier).

---

## 4. Brainstorm — new looks worth a QA round (beyond v1)

Cast candidates (must pass the couple gate; painted realism survives the swap, flat/cartoon eyes do not):
- **Pulp Adventure Cover** — painted pulp-magazine cover realism, dramatic brushwork, saturated poster color.
- **Fresco** — matte painted-plaster fresco, soft mineral pigments, gentle craquelure, mural composition.
- **Charcoal & Sepia Wash** — monochrome charcoal drawing with sepia wash, smudged tonal modelling.
- **Impressionist Oil** — broken brushstrokes, dappled color, thick paint (faces at risk → gate decides).
- **Tempera Panel** — egg-tempera flat luminous color, fine hatching, gilt-panel feel.
- **Painted Cel** — animation-film painted backgrounds with painted characters (big-eye drift risk → likely scene-only).

Scene candidates (no gate beyond taste):
- **Ukiyo-e Woodblock**, **Isometric Diorama**, **Low-Poly Paper World**, **Cross-Stitch Sampler**,
  **Mosaic Tile**, **Vintage Travel Poster** (flat litho, big shapes), **Chalk Pastel Landscape**,
  **Ink-Lined Watercolor Map**, **Marquetry Wood Inlay**, **Embroidery Hoop**.

Rule for adding any of them: author the row → 4 fixed couple seeds on 1.1-pro (cast) or 4 fixed scenes →
Kevin's grid → heart = ban → weight 1 → in.

---

## 5. Conversion plan — from the medium lottery to the catalog (flux-1.1-pro first)

**Sequencing rule (feasibility §6.0):** flip `model_policy_mode` shadow → on FIRST and delete the legacy model
layers (policy Phase 3). It has shadow-matched since 2026-09-07. Looks sit on top of the policy; interleaving
them makes two systems fight over the model.

| Phase | What | Test / gate | Rollback |
|---|---|---|---|
| **0. Policy on** | `model_policy_mode = on`; delete the 8 legacy model layers; Kevin's final rows (1.1-pro primary; flex solo/rebuild) | `check-model-policy-shadow.js` clean the night before | `mode = legacy` |
| **1. Catalog rows** (migration) | `dream_mediums.nightly_look boolean` + `weight numeric` + check constraint `nightly_look → NOT is_public AND NOT is_dream_eligible`; insert §3a + §3b rows (`nightly_*`), `smart_dream_models = ['flux-1.1-pro']` (+ flex where the gate passes); `dlt_clean_mediums` rows via `scripts/distill-clean-mediums.js --missing` | dbspec: every active look has both fragments + directive + ≥1 model in the policy chain; CI: looks ∩ app-eligible = ∅ | rows are inert until the mode flips |
| **2. Resolver** | `_shared/nightlyLooks.ts` `resolveLook({surface, model, recentLookKeys, forcedLook})` (pure, unit-tested: membership, recency-7 with the ≥2 floor, keep-across-attempts, weighted pick); loader 60 s TTL, fail-open to legacy; `engine_config.nightly_looks_mode` off · shadow · on; QA flag `force_look`; stamps `look:<key>` / `look_shadow:<surface>:<key>`; override library bypassed when a look is live (same exemption as day-of); solo rebuild inherits the look's real fragment | jest on the resolver; `no-hardcoded-look` grep | `nightly_looks_mode = off` |
| **3. Reliability gate** (≈ 100 renders, ≤3 concurrent, headroom-gated) | each cast look × 4 fixed couple seeds on 1.1-pro → first-try swap ≥ 3/4, identity ≥ 0.50 median (stamps, never by eye); failures → solo-only or cut | script `qa-nightly-looks.js --gate` writes `NIGHTLY_LOOK_TALLY.md` | — |
| **4. Kevin's grid** (≈ 100 renders) | survivors × 3 surfaces (couple / solo / scene) × 3 seed kinds (location / goofy-elegant / holiday) → Dreams album captions `✨ LOOK <key> <surface>` + the grid page; heart = ban; labels chosen here | Kevin's sign-off | — |
| **5. Shadow night → 30 % → 100 %** | `check-nightly-looks-night.js`: per-look first-try / degrade / faceless / quality-gate / identity vs the legacy baseline, exit 1 if worse; thresholds DERIVE from `engine_config` (hard rule) | two weeks at 100 % → hearts per 100 by look → weights v2, retire losers | percentage down |
| **6. Delete legacy** | nightly never reads `is_dream_eligible`; `pickFaceSwapModelOverride` + the library removed from nightly; scenario/holiday pins remapped to look keys (`painted_gothic_fantasy → nightly_painted_fantasy`, …) | grep test | git revert |

**Estimated effort:** engine ≈ 1 day (resolver + roll site + stamps + tests, the day-of code is the template);
catalog authoring ≈ ½ day; renders ≈ 200 (≈ $16) over two sessions; rollout ≈ 2 weeks of nights.

**What "tighter control" concretely means after this:** every nightly render's style is one of N frozen rows
Kevin graded; a bad style is retired by flipping one row; a new style enters only through the gate + grid; the
card label is the look's real name; the override library's invisible repaint is gone; app mediums can be tuned
freely without touching nightly.

---

## 6. Guardrails (unchanged, restated so nobody re-learns them)
- Looks are PURE rendering style — no anatomy, no composition, no "fills the frame / dominant" (the face-swap
  hard rule), no time-of-day / weather / lighting (FarmBot 2nd amendment), no artist / studio / photographer names.
- Judge swap health by `ai_generation_log.fallback_reasons` stamps over ≥ 10 couples, never by eye.
- A look never edits a frozen row; a change is a new row + tally entry.
- Cast renders keep the v3 subject-first order with the look at position 2; scene renders keep the Sonnet
  brief with the look's `directive` as STYLE GUIDE.
- Nothing rolls to users until Kevin has graded the grid.

---

## 7. Decisions Kevin owns (each changes what gets built)
1. **Photo-family looks** — Film Noir, Vintage Film, Cinematic (scene): in v1, or out under the no-photography rule? (Noir has the best like-rate in the set today.)
2. **One model** — v1 authored and gated for flux-1.1-pro only, with flex just for the solo rebuild (and the day-of digital-painting row that excludes 1.1-pro)? Or keep grok / gemini fallbacks with their own subsets now?
3. **Embodied Dream Art (1 %)** — leave outside the catalog in v1 (recommended), fold in v2, or drop the tier?
4. **Labels + Dream Again** — show the look's label on the card ("Storybook Gouache") and let Dream Again render it in Create at the normal price (feasibility §4.1 recommends yes)?
5. **Size** — 12 cast + 12 scene for v1 (above), equal weights, recency 7? Or smaller/larger?
6. **Sequence** — flip the model policy on first (recommended), then build looks.
