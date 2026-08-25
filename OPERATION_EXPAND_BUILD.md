# Operation Expand Dreams — BUILD MANIFEST & TRACKER

The execution tracker for building out **all** remaining location categories. Companion to the strategy
doc `OPERATION_DREAM_LOCATION_EXPANSION.md` and the QA tracker `LOCATION_EXPANSION_CHECKLIST.md`.

**Kickoff:** 2026-08-24, Kevin said "all of it." Autonomous build; make every call; post QA renders to
Kevin's private Dreams album; keep this tracker current.

## Locked decisions (2026-08-24)
- **Target ~120 locations (broad).**
- **Nightly scope = Create-first.** Imagined/new worlds are Create-only; they do NOT enter nightly
  auto-dreams yet (avoids per-world face-swap QA blowup). Real Landmarks may join nightly like existing
  real places. Nightly-per-world is a later, per-world decision.
- **Labels** as below (tweakable). **Neutral section names** — no gender labels in UI.
- **Revive graveyard recipes** where they exist (cheapest quality/hour); build new otherwise.
- **Sequencing:** prove the full pipeline on ONE fresh category (Through Time) → dark → QA → flip live,
  THEN batch the remaining categories. **One category fully finished before the next** (Kevin, 2026-08-24).
- **QA-SIZED POOLS FIRST (Kevin, 2026-08-24 — our "seed 25 to test, scale after sign-off" rule):**
  - **Phase A (QA seed, small):** recipe + biome config + wardrobe + a SHALLOW starter spot pool + quick
    thumbnail. QA-render (cast self + scene) to Kevin's private Dreams album; iterate to the bar.
  - **Phase B (scale, after sign-off):** top up depth to the full ~50-spot floor, finalize thumbnails,
    flip `admin_only=false` live.
  - First loop of a new category = a **representative 2-3 location slice** to prove recipe/biome/wardrobe/
    medium, THEN complete the rest of the category, THEN Phase B.

## Per-location pipeline (8 steps)
1. `node scripts/generate-full-location-card.js "<name>"` — recipe (6 phrase-arrays + tags)
2. set `biome` (from tags) → `node scripts/gen-location-biome-configs.js --only "<name>" --apply` — axes
   (TIME/WEATHER/CAMERA/PHENOMENA/BANS/SUBJECT_RULE) so `isValidBiomeConfig` passes
3. wardrobe pool (`set-imagined-wardrobe.js` pattern or `gen-location-wardrobe.js`)
4. `node scripts/gen-iconic-spots-50.js --location "<name>"` — 50 depth pillars
5. `node scripts/classify-iconic-spots.js` — tag pure_scene / character eligible + quality_tier
6. `node scripts/generate-location-thumbnails.js "<name>"` — tile image
7. set `picker_category = '<section>'` + `admin_only = true` (dark launch to admins)
8. QA: `node scripts/qa-location.js --location "<name>"` → grade → flip `admin_only=false` per section

---

## Category roster (build targets)

### ✅ Already live (55): iconic_cities 26 · epic_nature 16 · tropical 6 · fantasy_worlds 7

### 🏗 Dark, QA in progress (21): high_fantasy 9 · scifi_space 5 · gothic_haunted 4 · whimsical_fun 3
(See LOCATION_EXPANSION_CHECKLIST.md for per-card grades. Finish QA → flip live.)

### 🔨 TO BUILD

**Through Time** (`through_time`, imagined tier) — historical eras. Photography allowed (no imagined ban).
1. ancient egypt ★rev · 2. ancient rome ★rev · 3. victorian london ★rev · 4. feudal japan ·
5. viking longhouse · 6. medieval village market · 7. renaissance venice · 8. 1920s speakeasy ·
9. golden-age pirate cove · 10. ancient greece · 11. silk road caravanserai · 12. 1950s americana

**Old West** (`old_west`, imagined tier) — build-from-scratch.
1. frontier town · 2. saloon interior · 3. desert canyon standoff · 4. gold rush camp ·
5. cattle ranch golden hour · 6. steam train depot · 7. monument valley trail · 8. border cantina

**Heroes & Adventure** (`heroes_adventure`, imagined tier) — action/rugged, male-leaning.
1. superhero city rooftop · 2. spy lair secret hq · 3. epic battlefield · 4. mountain summit expedition ·
5. race track garage · 6. deep-sea research sub · 7. jungle temple expedition · 8. carrier flight deck ·
9. gladiator arena

**Whimsical & Fun — expand** (`whimsical_fun`, add to existing 3) — kawaii/cute. Painterly (imagined ban).
1. kawaii candy land · 2. unicorn meadow · 3. cottagecore cottage · 4. pastel dreamscape ·
5. fairy tea party · 6. enchanted toy shop

**Landmarks & Wonders** (`landmarks_wonders`, REAL tier — new SECTION_META entry) — nightly-eligible.
1. taj mahal ★rev · 2. petra ★rev · 3. machu picchu ★rev · 4. great wall of china ★rev ·
5. angkor wat ★rev · 6. christ the redeemer · 7. sahara dunes · 8. northern lights glacier

★rev = revive/refresh from the 50-card graveyard (recipe head-start).

**Total new/revived: ~43** → live target ≈ 119 (~120 broad). ✓

---

## Build log
| Date | Category | Step | Status |
|---|---|---|---|
| 2026-08-24 | Through Time (slice: egypt/feudal japan/1920s speakeasy) | recipes | ✅ done (prefill bug fixed) |
| 2026-08-24 | Through Time slice | biome_config + wardrobe + 100 iconic anchors/loc + grade | ✅ done |
| 2026-08-24 | Through Time slice | curation-gate bug: global steps skipped new cards (is_approved unset) | ✅ fixed → set is_approved=true, re-running scale+pure-scene classify |
| 2026-08-24 | Through Time slice | Round 1 QA renders | ⏳ next |

**Lesson captured in LOCATION_SEED_PLAYBOOK.md:** set `is_approved=true` + `picker_category` right after
the recipe step, BEFORE any global curation script, or they skip the new location.

| 2026-08-24 | Through Time slice | Round 1 QA (9 renders) | 5/6 cast @4.5+; 1 cast misfire (egypt_plus1) + weak scenes |
| 2026-08-24 | ENGINE fix (all nightly) | dropped `enviro_wide` from solo-cast composition roll | ✅ deployed — enviro_wide shrank faces < identity floor → pure_scene_fallback |
| 2026-08-24 | Through Time slice | eligibility rules: wide→not-cast, intimate→not-scene | ✅ applied |
| 2026-08-24 | Through Time slice | Round 2 QA | ✅ misfire fixed (person back), egypt scene now Avenue of Sphinxes; Kevin: "looks good, keep going" |
| 2026-08-24 | Through Time (remaining 9) | recipes + `seed-category.mjs` (reusable seeder) | 🔨 running |

**Reusable seeder: `scripts/seed-category.mjs`** — runs the whole pipeline for a category with all lessons
baked in (early gate columns, biome/wardrobe/spots/grade, wide→not-cast + intimate→not-scene eligibility).
Usage: `node scripts/seed-category.mjs <picker_category> <imagined> <sortStart> "loc=biome" ...` (recipes
must exist first).

**Engine wins this session (help production too):** dropped `enviro_wide` from the solo-cast composition
roll (was silently converting ~10% of cast nightlies to scene-only); wardrobe burgundy fix; medium
affinity for imagined worlds.
