# Location Seed Playbook — how to author a 10/10 location pool

The canonical brain for seeding DreamBot locations (analogous to `BOT_SCENE_QUALITY_PLAYBOOK.md` for
bots). **Read before authoring or seeding any location.** Update with every lesson.
Researched + written 2026-08-24 for Operation Expand Dreams.

---

## The mental model (get this right or nothing else matters)

1. **A seed is a BACKDROP, never a pose.** The "person doing something that belongs" — the thing that
   turns a face-swap from a cardboard cutout into a cinematic scene — is generated at RENDER time by the
   engine (`_shared/locationActionBeat.ts` Option B + the active-pose pools), NOT stored in a seed. So a
   10/10 pool = **great mood-neutral backdrops with a usable foreground**, paired with a real
   `biome_config`, and the integration is QA'd on `ai_generation_log.fallback_reasons`, not baked in.
2. **Nightly quality is driven by `biome_config` + the `location_iconic_spots` pool.** Nightly reads only
   `biome` and `biome_config` off `location_cards` (`nightly-dreams/index.ts:1209-1213`); the six recipe
   phrase-arrays feed the CREATE path (`_shared/essenceCards.ts`), not nightly. So for a nightly-great
   location, the levers are: bespoke `biome_config` (axes + WARDROBE) and the iconic-spot anchor pool.
3. **An un-curated spot is INVISIBLE.** `gen-iconic-spots-50.js` inserts rows with `pure_scene_eligible`
   and `character_eligible` = **NULL** and `spot_kind='vista'`. The engine only picks spots where an
   eligibility column `=true`. NULL ≠ true → the picker never sees it. **Generating spots is step 1 of ~5;
   the curation chain is non-optional.**

---

## Anatomy — the fields and what each controls

### `location_cards`
- **6 phrase-arrays** (`visual_palette`, `atmosphere`, `architecture`, `light_signature`,
  `texture_details`, `cinematic_phrases`) → feed **CREATE** (essenceCards). Author them rich for Create
  quality; they do NOT drive nightly.
- **`biome`** → picks the shared axis class from `_shared/biomeAxes.ts` (TIME/WEATHER/CAMERA/PHENOMENA/
  BANS) + gates content license (fantasy/sci-fi). Classes: tropical_coastal, arctic_polar, ancient_ruins,
  scifi_cosmic, fantasy_imagined, gothic_historic, desert_arid, temperate_forest, alpine_mountain,
  grassland_savanna, wetland_jungle, urban_city, interior_intimate, aquatic_underwater, red_rock_canyon,
  volcanic_geothermal, fjord_coastal, mediterranean_coastal, temperate_coastal, zen_garden.
- **`biome_config` (jsonb)** → the per-location BESPOKE override: TIME/WEATHER/CAMERA/PHENOMENA +
  SUBJECT_RULE + BANS + **WARDROBE** pool. Must pass `isValidBiomeConfig` (needs TIME, WEATHER, CAMERA,
  PHENOMENA, BANS arrays + SUBJECT_RULE string) or it's silently ignored and wardrobe falls to AI-default
  (burgundy). `biome_config.imagined=true` → bans photo mediums (painterly-only). **Set imagined=true for
  fantasy/sci-fi/kawaii; leave FALSE for historical/real (photography is fine there).**
- **`tags`** → biome FALLBACK at runtime if `biome` unset (prevents the beach-everywhere bug).
- **`sub_regions`, `must_include`** → NOT render inputs; authoring HINTS that force the spot generator to
  spread geographically + cover feature categories.
- **`picker_category`** = live-visibility gate. **`admin_only`** = dark-launch gate.

### `location_iconic_spots` (the anchor pool — drives nightly)
Schema: `id, location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible,
character_eligible`.
- **`spot_text`** → the anchor string; lands VERBATIM as the locked subject in the brief.
- **`spot_kind`** ∈ `wide | medium | intimate` (set by `classify-iconic-spots.js`) → drives
  `FRAMING_BY_SCALE` (`index.ts:1295-1304`): wide = epic vast vista (landscape IS subject); medium =
  landmark fills ~50-60%; intimate = subject fills 60-75%, no vast-vista language. Embodied mediums
  (LEGO/pixel) filter to `wide` only.
- **`quality_tier`** `S|A|B` (set by `grade-iconic-spots.js`; B → `is_active=false`). Grading artifact;
  the engine picks on the eligibility booleans, not tier.
- **`pure_scene_eligible`** → gates the no-human `pure_scene` path. "Recognizable beautiful postcard of
  THIS place, no subject but the landscape?"
- **`character_eligible`** → gates the cast (face-swap) paths. "Coherent backdrop that can HOST a
  face-swapped person with a foreground to stand in?" Independent of pure_scene.
- **`is_active`** → hard on/off. Picker filter is always `location_key + is_active + <eligibility>=true`.

### `location_spots` (`kind IN ('spot','activity')`)
Secondary/legacy "things here / things to do" pool. Not the primary nightly anchor.

---

## The 10/10 spot-authoring rules (mood-neutral named backdrops)
1. **SPECIFIC NAMED places only** — "Nā Pali Coast", never "tropical cliffs." A generic feature = a B-grade
   demote. (A named feature is necessary but NOT sufficient — obscure micro-landmarks get demoted too.)
2. **MOOD-NEUTRAL — no baked axes.** NO time-of-day, weather, or light/color words (those are rolled per
   render). "glowing tower at sunset" is rejected. (Exception: `gen-postcard-spots` pure-scene postcards
   may bake light — deliberate, but reduces axis variety; use sparingly.)
3. **No people, no actions in the spot text.** Integration is engine-side.
4. **Exterior/approach views** (interiors recast as the approach) — mostly; interior-only locations
   (speakeasy) lean on `intimate` + interior_intimate biome instead.
5. **No hallucination** for real places; **canon is truth** for fictional worlds.
6. **4-10 words, full dedup, spread across sub_regions + must_include.**

## The eligibility model — the make-or-break curation
- **Character-eligible subset MUST skew `medium`/`intimate` with a CLEAR FOREGROUND.** A wide vista + cast
  = tiny-cutout-against-horizon (the cardboard failure). `qa-character-pool.js` DROPs pure-landscape-with-
  no-foreground ("endless rolling X to the horizon"), vague "X views" plurals, biome-confusion.
- **Pure-scene subset = strict postcards.** `reaudit-pure-scene-spots.js` (location-aware) demotes generic
  essence-scenes + obscure micro-landmarks. RUN IT AFTER ANY new pure-scene seeding.
- A spot can be pure_scene-only, character-only, both, or neither.

## Depth floor + mix (per location)
- **≥15 active spots** (best live locations carry 40-53). Thin pools render samey dreams.
- **Scale mix ≈ 40% wide / 40% medium / 20% intimate** (`gen-postcard-spots.js:70`).
- Author BOTH pools deep enough that recency-dedup (needs ≥2 fresh) never starves.

---

## Reusable seeder — `scripts/seed-category.mjs`
Runs the whole pipeline below for a batch of locations with the lessons baked in (early gate columns;
biome/wardrobe/spots/grade; the two eligibility rules). After recipes exist:
`node scripts/seed-category.mjs <picker_category> <imagined:true|false> <sortStart> "loc=biome" ...`
Then QA-render with `qa-location.js`. The two eligibility rules it enforces (learned in the Through Time
slice, 2026-08-24):
- **`character_eligible` = active & NON-wide** (cast skews medium/intimate; a wide vista or a statue-avenue
  spot → tiny face / multi-face → identity collapse → `pure_scene_fallback`, i.e. the cast render silently
  becomes scene-only).
- **`pure_scene_eligible` = active & NON-intimate** recognizable wide/medium (intimate close-ups render as
  ambiguous generic scenes — e.g. an Egypt sandstone close-up read as a nondescript slot canyon).

## Engine note — `enviro_wide` is OFF for solo cast (2026-08-24)
The Stage-5c expanded solo composition dropped `enviro_wide` (kept `three_quarter`): `enviro_wide` reliably
shrank the face below the swap's identity floor (~0.13 < 0.15) → `pure_scene_fallback`, silently converting
~10% of cast nightlies to scene-only. `enviro_wide` remains reachable only via the `force_solo_comp` test
hook. (`nightly-dreams/index.ts` ~line 1994.)

## The pipeline (in order) — per location unless noted

1. **Recipe:** `node scripts/generate-full-location-card.js "<name>"` (6 arrays + tags + fusions).
   *(Fixed 2026-08-24: dropped the assistant-prefill that claude-sonnet-4-6 rejects.)*
2. **Biome:** set `biome` (class), then `node scripts/gen-location-biome.js --location "<name>"` (bespoke
   biome_config axes). For imagined worlds also set `biome_config.imagined=true`.
3. **Wardrobe:** `node scripts/gen-location-wardrobe.js --location "<name>"` (adds WARDROBE pool). Keep it
   color-DIVERSE (author against the AI's burgundy-noble default; de-burgundy fantasy pools).
4. **Named anchors:** `node scripts/gen-iconic-spots-50.js --location "<name>"` (inert until curated).
5. **Postcards:** `node scripts/gen-postcard-spots.js` (adds ~20 pure_scene_eligible=true, S-tier).
6. **Scale:** `node scripts/classify-iconic-spots.js` (vista/NULL → wide/medium/intimate). [global]
7. **Grade:** `node scripts/grade-iconic-spots.js --location "<name>"` (S/A/B; B→inactive).
8. **Eligibility:** `node scripts/classify-pure-scene-eligible.js` then `node scripts/qa-character-pool.js`
   (set the two booleans). [global] Then `node scripts/reaudit-pure-scene-spots.js --dry-run --sample` →
   `--write` (purge generic/obscure pure-scene anchors).
9. **Thumbnail:** `node scripts/generate-location-thumbnails.js "<name>"`.
10. **QA:** `node scripts/qa-location.js --location "<name>"` → post to Kevin's Dreams album → grade to
    ≥4.5 over the 3-round loop → flip `admin_only=false` when the section is signed off.

> ⚠️ **CURATION-GATE — set the gate columns BEFORE the global steps (learned 2026-08-24, the hard way):**
> The global curation scripts (postcards, classify-scale, classify-pure-scene-eligible, qa-character-pool,
> reaudit) select their work set as **`is_approved=true AND picker_category IS NOT NULL`** — NOT
> `admin_only`. `admin_only=true` does NOT exclude a card. BUT `generate-full-location-card.js` inserts a
> fresh row with `is_approved` UNSET, so a new location is invisible to every global curation script until
> you set BOTH `is_approved=true` AND `picker_category`. **Do this right after the recipe step, before any
> global curation** — otherwise the scripts silently skip the location and you get: spots stuck at
> `spot_kind='vista'`, `pure_scene_eligible=0`, character-eligibility never Sonnet-QA'd. (Visibility is
> still controlled by `admin_only` + the client filter, so `is_approved=true` does NOT un-dark the card.)
> Then still VERIFY the booleans landed (query `location_iconic_spots` by `location_key`).

---

## Failure modes → the engine lever that counters each
| Failure | Lever |
|---|---|
| Cardboard cutout (person pasted, not integrated) | `locationActionBeat.ts` Option B action beat (render-time) + active-pose pools + relaxed characterSlotPrompt framing. Never front-load/amplify the scene on a face-swap prompt (shrinks faces → dual-split fails). |
| Tiny-figure-in-vast-vista | correct `spot_kind` (medium/intimate for cast spots) + `FRAMING_BY_SCALE`; qa-character-pool DROP rule. |
| Arbitrary/unrecognizable anchor | `reaudit-pure-scene-spots.js` location-aware demotion. |
| Wrong/burgundy wardrobe, forced props | bespoke `biome_config.WARDROBE` (color-diverse) + held-props natural-only. |
| Imagined world → bad AI-photo | `biome_config.imagined=true` → painterly medium ban. |
| Thin/samey | depth floor ≥15; recency dedup needs ≥2 fresh. |
| Beach-everywhere | tag-based biome fallback. |

**Verify integration on `ai_generation_log.fallback_reasons` (look for `location_action` / `active_pose`),
NOT by eyeballing the image.**
