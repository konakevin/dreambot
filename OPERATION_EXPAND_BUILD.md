# Operation Expand Dreams — MASTER IMPLEMENTATION PLAN

<!-- ============================================================================ -->
## ▶ RESUME HERE (read first on any new session / after compaction)

**ACTIVE: autonomous OVERNIGHT run** (Kevin went to bed 2026-08-24; see
[[project_expand_dreams_autonomous_run]]). Task: seed + QA **every new location category**, then it's ready
for Kevin's review tomorrow.

**THE RULES (do not violate):**
1. Per category: seed a QA-size batch → **up to 3 QA rounds, stop early if the test batch averages ≥4.5/5.**
2. **Post every test render to Kevin's PRIVATE Dreams album** (uid `eab700d8-f11a-4f47-a3a1-addda6fb67ec`)
   via `qa-location.js`. Grade each render myself (download + view) vs the integration+cinema bar.
3. **DO NOT GO LIVE. Everything stays `admin_only=true` dark. Never set `admin_only=false` in this run.**
4. Full quality per location (autonomous ≠ rushed). Can't reach 4.5 in 3 rounds → 🚩 Return-to, move on.
5. Keep this doc's progress board + per-location tables current as each item moves.
6. ★ **SET-DRESSER + COSTUME-DESIGNER mantra** ([[feedback_dream_shoot_set_dresser_costume_designer]]):
   every shot = a composed masterpiece; cool/fun/sexy/interesting/cute/pretty/beautiful/rugged/badass,
   NEVER plain/pedestrian/frumpy. Wardrobe = dream-wear (generator elevated). Discerning artistic eye:
   backgrounds must look great AND naturally weave the swapped hero into the scene (not a cutout).
7. ★ **`qa-location.js` now renders 4 surfaces: self, plus_one, COUPLE (dual face-swap), scene.** Couples
   (dual self+plus_one) are core — QA them for every location (`force_cast_role:'dual'`).
8. Wild West = Red Dead vision ([[project_wild_west_red_dead_vision]]); renamed old_west→wild_west.

**HOW TO RESUME (post-compaction procedure):**
1. Read this block + the Progress board below to see which category is in flight.
2. Check in-flight background jobs / query DB for seed state:
   `node -e` on `location_cards` (biome_config present?) + `location_iconic_spots` per `location_key`.
3. Continue the per-category loop (bottom of doc): recipes → `seed-category.mjs` → `qa-location.js` →
   grade → tweak → next. Categories left = any row on the board not ✅/🟢/🚩.

**⏱ LIVE STATE — OVERNIGHT RUN ESSENTIALLY COMPLETE (2026-08-25):**
> ALL categories seeded + QA-rendered to Kevin's album, ALL DARK (`admin_only=true`, nothing live):
> **Through Time** ✅ (9 @4.5+) · **Wild West** ✅ (8, recalibrated gritty-authentic even-mix + couples) ·
> **Heroes** ✅ (7/9) · **Whimsical expand** ✅ (5/6) · **Landmarks & Wonders** ✅ (8) · dark **High
> Fantasy** ✅ (9, wardrobe refreshed + re-rendered) · **Sci-Fi** ✅ (5) · **Gothic** ✅ (4). Couples (dual
> face-swap) added as a 4th QA surface across the board. Register-aware wardrobe (grounded=authentic vs
> fantastical=glam) validated. Seeder = QA-25 spots (scale to ~100+ post sign-off).
> **AWAITING KEVIN'S REVIEW.** Then per section: fix 🚩 Return-to items, scale spot pools to production, add
> SECTION_META for through_time/wild_west/old_west→wild_west/heroes_adventure/landmarks_wonders, flip live.
> **REMAINING BUILD:** Wild West raw-nature/activity expansion (Return-to). Renders killed frequently late
> in the run (infra) → some locations have partial surfaces; re-roll/complete as needed.
> --- older ---
> 2026-08-25 early: **Through Time ✅ DONE R1** (all 4.5+, dark). **WILD WEST (renamed from old_west)** in
> heavy iteration: Kevin wants Red Dead/Tombstone — first wardrobe elevation over-fashioned it (fringe
> dresses/turquoise/no hats = "costumes, didn't believe them"). RECALIBRATED to gritty-authentic EVEN-MIX
> (½ weathered real gear + ½ sexy-authentic; saloon=full burlesque glam; hats FREQUENT not mandatory) —
> hand-authored pools on the 8. **Validated:** frontier couple now gritty-authentic, on horseback, hats,
> believable town ✅; settings believable ✅. Canyon couple = dual no_split→scene fallback (wide-vista
> dual limit). Couples ADDED to qa-location (4th surface). NOW: re-rendering rest of WW (gold rush+cattle
> job bnqxxoid5) → then ADD wild-nature/activity locs (wild frontier, mountain wilderness, outlaw camp,
> burlesque hall, shootout) → then Heroes → Whimsical expand → Landmarks → finish dark HF/SciFi/Gothic.
> ⚠️ REGISTER LESSON: for gritty-real worlds (WW, Heroes, Landmarks, real) author AUTHENTIC-cool wardrobe,
> NOT fantasy-fashion (only fantasy/kawaii/gothic get fantastical). [[feedback_dream_shoot_set_dresser_costume_designer]]
<!-- ============================================================================ -->

**THE single source of truth for all remaining Operation Expand Dreams work.** Following this doc top to
bottom = complete implementation. Update it as every item moves.

- **Why** (strategy, category rationale, ~90 ideas): `OPERATION_DREAM_LOCATION_EXPANSION.md`
- **How** (the 10/10 seed authoring pipeline + rules): `LOCATION_SEED_PLAYBOOK.md`
- **What + status** (this doc). *(`LOCATION_EXPANSION_CHECKLIST.md` is now SUPERSEDED by this doc.)*
- **Working mode:** autonomous, no per-category approval gates, FULL quality bar per location
  ([[project_expand_dreams_autonomous_run]]).

---

## ✅ Definition of DONE (per location, then per category)
A location is DONE when ALL are true:
1. **Recipe** authored (`generate-full-location-card.js`).
2. **Seeded** to the playbook bar (`seed-category.mjs`): valid `biome_config` + WARDROBE, ≥15 curated
   cast spots (medium/intimate), recognizable scene spots (wide/medium), imagined flag correct.
3. **QA ≥4.5** across cast (self+plus_one) + scene, over ≤3 rounds — OR flagged 🚩 Return-to.
4. **Thumbnail** set (`thumbnail_url`).
A category is DONE when all its locations are DONE, its **`SECTION_META` entry exists** in
`LocationPickerStep.tsx`, and it's **flipped live** (`admin_only=false`) — or its failures are on Return-to.

---

## 📊 Progress board (update every move)
Status: ⬜ not started · 🔨 seeding · 🔎 QA · ✅ passed (≥4.5, dark) · 🟢 live · 🚩 return-to

| Category | picker_category | SECTION_META | # | Status |
|---|---|---|---|---|
| Cities & Countries | iconic_cities | ✅ | 26 | 🟢 live |
| Epic Nature | epic_nature | ✅ | 16 | 🟢 live |
| Tropical Escapes | tropical | ✅ | 6 | 🟢 live |
| Fantasy Worlds | fantasy_worlds | ✅ | 7 | 🟢 live |
| High Fantasy | high_fantasy | ✅ | 9 | 🔎 QA (slice ~4.5) |
| Sci-Fi & Space | scifi_space | ✅ | 5 | 🔎 QA (2 ✅) |
| Gothic & Haunted | gothic_haunted | ✅ | 4 | 🔎 QA |
| Whimsical & Fun | whimsical_fun | ✅ | 3→9 | 🔎 QA + expand |
| **Through Time** | through_time | ❌ TODO | 12 | ✅ passed R1 (dark) — all 4.5+ except 1920s speakeasy 4.0 |
| Old West | old_west | ❌ TODO | 8 | 🔨 seeding |
| Heroes & Adventure | heroes_adventure | ❌ TODO | 9 | ⬜ |
| Landmarks & Wonders | landmarks_wonders | ❌ TODO (real tier) | 8 | ⬜ |

---

## Work breakdown (per-location status)
Cols: R=recipe · S=seeded · Q=QA grade · T=thumb · St=status(⬜/🔎/✅/🚩)

### High Fantasy (`high_fantasy`) — dark, finish QA + flip
| Location | R | S | Q | T | St |
|---|---|---|---|---|---|
| ancient elven city | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| dwarven fortress | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| dragons keep | ✅ | ✅ | ~4.5 (thin scene DNA) | ✅ | 🔎 |
| crystal caverns | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| enchanted forest | ✅ | ✅ | — | ✅ | ⬜ |
| floating sky islands | ✅ | ✅ | — | ✅ | ⬜ |
| underwater city atlantis | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| mermaid lagoon | ✅ | ✅ | ~4.5 | ❌ | 🔎 |
| high fantasy (umbrella) | ✅ | ✅ | ⚠️ goofy scene | ✅ | 🔎 |

### Sci-Fi & Space (`scifi_space`)
| alien planet | ✅ | ✅ | 4.5 | ✅ | ✅ |
| cyberpunk megacity | ✅ | ✅ | 4.75 | ✅ | ✅ |
| mars colony | ✅ | ✅ | — | ✅ | ⬜ |
| space station | ✅ | ✅ | — | ✅ | ⬜ |
| sci-fi worlds (umbrella) | ✅ | ✅ | — | ✅ | ⬜ |

### Gothic & Haunted (`gothic_haunted`)
| transylvania | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| haunted cathedral | ✅ | ✅ | — | ✅ | ⬜ |
| haunted castle | ✅ | ✅ | — | ❌ | ⬜ |
| gothic realm (umbrella) | ✅ | ✅ | — | ✅ | ⬜ |

### Whimsical & Fun (`whimsical_fun`) — 3 seeded + build 6
| princess garden castle | ✅ | ✅ | ~4.5 | ✅ | 🔎 |
| rose garden palace | ✅ | ✅ | ~4.5 | ❌ | 🔎 |
| fairy cottage | ✅ | ✅ | — | ✅ | ⬜ |
| kawaii candy land | ⬜ | ⬜ | — | ⬜ | ⬜ |
| unicorn meadow | ⬜ | ⬜ | — | ⬜ | ⬜ |
| cottagecore cottage | ⬜ | ⬜ | — | ⬜ | ⬜ |
| pastel dreamscape | ⬜ | ⬜ | — | ⬜ | ⬜ |
| fairy tea party | ⬜ | ⬜ | — | ⬜ | ⬜ |
| enchanted toy shop | ⬜ | ⬜ | — | ⬜ | ⬜ |

### Through Time (`through_time`) — imagined=false (photography OK)
| ancient egypt | ✅ | ✅ | 4.5 (R2) | ✅ | ✅ |
| feudal japan | ✅ | ✅ | 4.5 (R2) | ✅ | ✅ |
| 1920s speakeasy | ✅ | ✅ | 4.0 (garbled signage) | ✅ | 🔎 |
| victorian london | ✅ | 🔨 | — | ⬜ | 🔨 |
| ancient rome | ✅ | 🔨 | — | ⬜ | 🔨 |
| viking longhouse | ✅ | 🔨 | — | ⬜ | 🔨 |
| medieval village | ✅ | 🔨 | — | ⬜ | 🔨 |
| renaissance venice | 🔨 | 🔨 | — | ⬜ | 🔨 |
| pirate cove | ⬜ | 🔨 | — | ⬜ | 🔨 |
| ancient greece | ⬜ | 🔨 | — | ⬜ | 🔨 |
| silk road | ⬜ | 🔨 | — | ⬜ | 🔨 |
| 1950s americana | ⬜ | 🔨 | — | ⬜ | 🔨 |

### Old West (`old_west`) — build from scratch, imagined=false
frontier town · saloon interior · desert canyon standoff · gold rush camp · cattle ranch golden hour ·
steam train depot · monument valley trail · border cantina — all ⬜

### Heroes & Adventure (`heroes_adventure`) — build, imagined=false (real-ish, some imagined)
superhero city rooftop · spy lair secret hq · epic battlefield · mountain summit expedition ·
race track garage · deep-sea research sub · jungle temple expedition · carrier flight deck ·
gladiator arena — all ⬜

### Landmarks & Wonders (`landmarks_wonders`) — REAL tier, nightly-eligible, revive graveyard
taj mahal · petra · machu picchu · great wall of china · angkor wat · christ the redeemer ·
sahara dunes · northern lights glacier — all ⬜

---

## Cross-cutting tasks (don't forget these)
- [ ] **SECTION_META entries** in `components/onboarding/LocationPickerStep.tsx` for the new categories:
      `through_time`, `old_west`, `heroes_adventure`, `landmarks_wonders` (real tier). *(The 4 imagined
      ones — high_fantasy/scifi_space/gothic_haunted/whimsical_fun — are already added.)*
- [ ] **Thumbnails** for cards missing them: haunted castle, mermaid lagoon, rose garden palace + every
      new build (`generate-location-thumbnails.js`).
- [ ] **Flip live** per section (`UPDATE location_cards SET admin_only=false WHERE picker_category='…'`)
      once the section clears 4.5.
- [ ] **Landmarks nightly-eligibility** — real landmarks may enter nightly (unlike imagined); verify.
- [ ] Watch: profile-face on action beats (monitor at scale; nudge only if frequent).

## 🚩 Return-to (couldn't hit 4.5 after 3 rounds)
- **Heroes › superhero city rooftop** — HARD FAIL: recipe/fusions are IP-magnetic (rendered a **Batman
  logo + "GOTHAM"** on a jet-ski) + off-concept (jet-ski on water, not a rooftop) + beachwear not heroic.
  Needs a no-IP recipe rework (strip named-hero refs, re-anchor to a caped-vigilante rooftop silhouette) OR
  replace the location. Do NOT ship until IP is gone.
- **Heroes › race track garage** — very thin pool (5 active) + weak recipe; likely needs a richer recipe.
- **Whimsical › kawaii candy land** — recipe came out as a generic garden (mood-neutral recipe stripped the
  "candy"); rendered a gardener in overalls in a weird tube-garden, not a sweets/gumdrop candy land. Needs a
  candy-specific recipe + cute wardrobe. (unicorn meadow ✅ on-concept, so it's kawaii-specific.)
- **Wild West raw-nature/activity expansion** (deferred): wild frontier, mountain wilderness, outlaw camp,
  burlesque hall, wild west shootout. [[project_wild_west_red_dead_vision]]
- **1920s speakeasy** (Through Time) — 4.0, garbled signage.
- Wide-vista couples (canyon, etc.) — dual `no_split`→scene fallback risk; re-roll.

---

## ⚙️ Ops constraint (learned 2026-08-24)
Background jobs get **killed at ~30 min**. So: generate recipes in batches of **≤5 locations**, render QA
in batches of **≤4-5 locations** (~15-20 min each). Seeds (`seed-category.mjs`) for ~8-9 locations run
~15 min and complete fine as one job. **Do NOT use chained `until`-wait loops** — if the upstream job is
killed, the waiter hangs until it's killed too. Instead: kick a batch, wait for ITS completion
notification, then start the next stage as its own job.

## Per-category loop (the process I follow)
1. `generate-full-location-card.js "<loc>" ...` (recipes).
2. `seed-category.mjs <picker_category> <imagined> <sortStart> "loc=biome" ...` (full seed).
3. `generate-location-thumbnails.js` for the new locs.
4. 3-round QA: `qa-location.js --location "<loc>"` → post to Kevin's Dreams album → grade each render vs
   the integration+cinema 4.5 bar → fix the SPECIFIC cause → re-render. Cap 3 rounds → else 🚩 Return-to.
5. Add `SECTION_META` entry if new category. Flip `admin_only=false` when the section passes.
6. Update this doc + move to next category. No approval gate.

## Locked decisions (2026-08-24)
- Target ~120 (broad). Nightly scope = Create-first (imagined Create-only; real Landmarks may go nightly).
- Neutral section labels (tweakable), no gender in UI. Revive graveyard recipes where they exist.
- Autonomous, full quality bar per location, flag failures rather than stall.

## Build log
| 2026-08-24 | Slice (egypt/japan/speakeasy) | seed → R1 (5/6 cast @4.5, 1 misfire) → engine fix (dropped enviro_wide) + eligibility rules → R2 ✅ | Kevin: "looks good, keep going" |
| 2026-08-24 | Engine (prod) | dropped enviro_wide from solo-cast comp (was silently scene-only-ing ~10% of cast nightlies); wardrobe de-burgundy; imagined medium affinity | committed 615cd7b2 |
| 2026-08-24 | Through Time (9) | recipes + seed-category.mjs | 🔨 running |
