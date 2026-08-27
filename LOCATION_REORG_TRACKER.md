# Location Reorg + Expansion — LIVE TRACKER

> **This is the STATUS OF RECORD for execution.** Design/decisions live in
> `LOCATION_REORG_PLAN.md`; this doc tracks what's DONE / IN-PROGRESS / LIVE.
> A big multi-session effort — agents MUST maintain this across compactions.

## 📌 How agents use this doc
1. Read `LOCATION_REORG_PLAN.md` first (the plan), then this (the state).
2. Update statuses the moment work lands. Keep **Last updated** + **▶ NEXT ACTION** current.
3. Per-card status legend: `⬜ todo` → `🔵 recipe` → `🟡 seeded+spots` → `🟠 QA rounds` → `✅ approved (dark, admin_only)` → `🟢 LIVE (admin_only=false)`.
4. Nothing goes `🟢 LIVE` without Kevin sign-off + a client build out.
5. Log every session in the Change Log at the bottom.

---

## ▶ NEXT ACTION
**SEEDING RUN IN PROGRESS (autonomous, Kevin 2026-08-27).** Grinding category-by-
category to ≥4.5, everything `admin_only` dark. Phase 1 UI+reorg = DONE + committed
(`c5f92b0d`). ⛔ NO per-location medium narrowing — every card `imagined=false`,
all nightly mediums fire (Kevin). **Scene-only surface is NOT a priority (Kevin
2026-08-27)** — new location pools graded on the 3 CAST surfaces (self/plus1/couple)
only; render with `qa-location.js --location "<x>" --no-scene`.

**Beach Towns: 5/9 PASS (dark).** ✅ Myrtle Beach 4.7 · Outer Banks 4.7 · Key West 4.6
· Cape Cod ~4.4 · Santa Monica 4.53. **Next: seed the 4 remaining** — Coney Island,
30A, Malibu, The Hamptons (recipes generating, job `b4z5fgzeh`). Pipeline per new
town below. Then Tropical Escapes → Countries → the rest.

### 🔧 New beach-town pipeline (per town)
1. `seed-category.mjs beach_towns false <sortStart> "<town>=<biome>"` → biome_config + wardrobe + 25 spots + gate cols (admin_only).
2. Apply a template to override SUBJECT_RULE + Americana wardrobe + town spots:
   - **generic candy-cottage town** (30A) → `_tmp-beachtown.mjs "<town>" "<SUBJECT_RULE>" "<hints>"`
   - **specific-identity town** (Coney Island boardwalk/coaster, Malibu cliffs/PCH, Hamptons shingle) → `_tmp-iconictown.mjs "<town>" "<SUBJECT_RULE>" "<register brief>"`
3. `_tmp-sunnyaxes.mjs "<town>"` → hard-set bright TIME/WEATHER (REQUIRED — recipe TIME axis is night/fog-dominant).
4. `qa-location.js --location "<town>" --no-scene` → download + grade 3 cast surfaces to ≥4.5.

### ⚠️ Beach-town render LESSONS (learned Myrtle→Santa Monica)
- **Recipe TIME axis is DARK-dominant** (pre-dawn marine layer / June Gloom / blue hour / post-sunset / late-night) → scenes AND cast renders roll dark/foggy. ALWAYS run `_tmp-sunnyaxes.mjs` (hard-sets 4 bright TIME + 3 bright WEATHER + strips dark PHENOMENA).
- **The word "glamour" (or glam/editorial/chic) in SUBJECT_RULE → fashion costumes** (open blazers over bare chest, epaulette shirts). Keep SUBJECT_RULE positive-casual; describe the PLACE, let the Americana WARDROBE pool carry the outfits. NO negation (it leaks).
- **Spots with "safety barrier" / "bluff edge / overlook" → barbed-wire fences + scrubby rural fields.** Avoid; use pier decks, promenades, porches, bungalow corners, boardwalks.
- **Lifeguard-tower spots + open-shirt wardrobe → Baywatch beefcake.** Skip lifeguard towers for iconic-place towns.
- Specific iconic places (SM pier, Malibu) are NOT generic-cottage towns — use `_tmp-iconictown.mjs` with a real register brief, not the candy-cottage template.

**Last updated:** 2026-08-27 (5/9 beach towns PASS; scene-only deprioritized; sunny-axes + iconic-town templates added; 4 remaining towns' recipes generating)

---

## Phase status
| Phase | Status | Notes |
|---|---|---|
| **1 — UI + Reorg** | ✅ DONE | committed `c5f92b0d`; DB reclassify applied; de-tab + 11-cat SECTION_META live in code |
| **2 — Seeding (41 cards)** | 🔨 in progress | Myrtle Beach shakedown first; per-card table below |
| **3 — Go-live** | ⬜ not started | flip `admin_only=false` per category after sign-off + build |

---

## Phase 1 — UI + Reorg checklist
**DB reclassification (service-key script, no DDL):**
- [ ] `Northern Lights` + `Sahara Dunes`: `landmarks_wonders` → `epic_nature`
- [ ] `Santorini`: `iconic_cities` → `tropical`
- [ ] World Wonders consolidation (repurpose `Ancient Wonders` card; null the 6 individual landmark cards' `picker_category`; ensure 8 wonder spots)
- [ ] register `beach_towns` as a picker_category value

**Code — `components/onboarding/LocationPickerStep.tsx`:**
- [ ] `SECTION_META` → 11 categories (5 real / 6 dream) with new mappings
- [ ] remove segmented tab control + `activeTier` state
- [ ] two labeled sections (REAL WORLD / DREAM WORLDS) in one scroll
- [ ] section-header styling (neutral eyebrow vs brand-gradient eyebrow)
- [ ] QA in simulator (sections, drill-in, back chevron, leave prompt)
- [ ] commit + deployed to prod

---

## Picker UX improvements (log)
| Improvement | Status | Deployed |
|---|---|---|
| Selected state = badge only (removed teal glow/outline) | ✅ done | ⬜ uncommitted |
| Reset + Select-all → real button styling | ✅ done | ⬜ uncommitted |
| Single context-aware back chevron (`handleBack` handle) | ✅ done | ⬜ uncommitted |
| Leave-with-zero-places gentle confirm | ✅ done | ⬜ uncommitted |
| Announcement → seat Profile→Edit Profile chain on back | ✅ done | ⬜ uncommitted |
| Segmented tab control | ⚠️ superseded | replaced by de-tab two-section (Phase 1) |
| **De-tab → two labeled sections** | ⬜ todo | Phase 1 |
| Category reorg 4→11 | ⬜ todo | Phase 1 |

> ⚠️ All picker/announcement UX work above is CODE-COMPLETE but UNCOMMITTED +
> undeployed as of 2026-08-27. Files: `components/onboarding/LocationPickerStep.tsx`,
> `app/settings/locations.tsx`, `components/ConfirmDialog.tsx`, `components/AnnouncementSheet.tsx`.

---

## Phase 2 — Seeding tracker (41 net-new cards)

### 🌍 Around the World — Countries (11)
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Japan | ⬜ | | Fuji, Kyoto temples, torii, Tokyo, blossoms |
| Italy | ⬜ | | Colosseum, Venice, Tuscany, Cinque Terre, Dolomites |
| Egypt | ⬜ | | Pyramids, Nile, Karnak, Abu Simbel, desert |
| Greece | ⬜ | | Acropolis, cliff villages, ruins, olive groves |
| France | ⬜ | | Provence, Riviera, châteaux, vineyards, Alps |
| Spain | ⬜ | | Alhambra, Gaudí, flamenco, Seville, coast |
| Ireland | ⬜ | | Cliffs of Moher, castles, emerald hills, pubs |
| Germany | ⬜ | | Neuschwanstein, Bavaria, Black Forest, markets |
| Vietnam | ⬜ | | Ha Long Bay, Hoi An lanterns, rice terraces |
| Brazil | ⬜ | | Amazon, Iguazu, Carnival, rainforest |
| Scotland | ⬜ | | Highlands, lochs, clifftop castles, tartan |

### 🌍 Around the World — City + Wonders (2)
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Sydney | ⬜ | | Opera House, Harbour Bridge, Bondi, skyline |
| World Wonders | ⬜ | | Phase-1 structural; spots = 8 wonders |

### 🏖️ Tropical Escapes (4)
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Amalfi Coast | ⬜ | | Positano cliffs, pastel villages, boats |
| Fiji | ⬜ | | overwater bungalows, coral lagoons |
| Cancún | ⬜ | | turquoise Caribbean, cenotes, beach clubs |
| Tahiti | ⬜ | | jade lagoons, volcanic peaks, black sand |

### 🏝️ Beach Towns (9) — SEED FIRST (new category)
> ⭐ **BEACH TOWNS TEMPLATE (learned on Myrtle Beach R1→R2, from Kevin's favorited refs):**
> Beach towns = the CHARMING DREAM version, NOT the literal resort strip.
> - **SUBJECT** = candy-colored pastel raised beach cottages (teal/coral/yellow/mint),
>   palm-lined sandy lanes, hibiscus/bougainvillea, striped-awning boardwalk shops,
>   fishing piers, wide sunny beach + sea-oat dunes. Feature colorful beach houses +
>   the beach. Do NOT emphasize high-rise resort towers.
> - **WARDROBE** = casual-cute Americana (Hawaiian/camp shirts, denim rompers,
>   sundresses, cutoffs+tee). NOT exotic beach-glam gowns / shirtless-tiny-shorts.
> - **WEATHER/PHENOMENA** = sunny + golden + pastel-sunset dominant; NO storms,
>   waterspouts, thunderheads.
> - **Spots** = hand-curate cottage/beach scene-types (the auto-gen pulls resort
>   landmarks + brand names like "Hard Rock Cafe" → IP leak; scrub brands).
> - Refs: Kevin's 2 favorited Myrtle Beach dreams (colorful cottages, palm lanes,
>   casual wardrobe) — the target look for the whole category.

> **Reusable Americana WARDROBE pool** (paste into each beach town's biome_config.WARDROBE):
> sundress (floral/gingham) + straw hat + sandals · tropical camp/Hawaiian shirt + shorts +
> sneakers · denim romper/overall-shorts + striped tee + tote · cutoffs + knotted gingham top +
> fedora · gauze cover-up over tasteful swimsuit + floppy hat · pastel camp-collar shirt + linen
> shorts + boat shoes · flowy sundress/linen jumpsuit + gold jewelry · graphic tee + cuffed denim.
> **Axes:** filter WEATHER/PHENOMENA to drop `thunderstorm|nor'easter|hurricane|squall|waterspout|
> thunderhead|foam surge|post-storm|heat pillar`; add sunny + pastel-sunset. **Spots:** hand-curate
> cottage/beach scene-types; scrub brand names (Hard Rock, Ripley's, SkyWheel→generic).

| Card | Status | QA avg | Notes |
|---|---|---|---|
| Myrtle Beach | ✅ 4.7 (dark) | R2: self 4.6 / plus1 4.8 / couple 4.7 / scene 4.8 | LOCKED TEMPLATE. cottage-dream + Americana wardrobe + sunny. 20 spots/16 cast (QA size; scale to 100 post-signoff) |
| Outer Banks | ✅ 4.7 (dark) | R1: self 4.6 / couple 4.7 / scene 4.8 | teal surf shack, coral cottage porch, stilt cottage + rainbow. PASS R1 |
| Key West | ✅ 4.6 (dark) | R1: self 4.7 / couple 4.6 / scene 4.8 / plus1 4.0 | coral conch cottage + bougainvillea, turquoise dock, sunset marina. PASS. (plus1 rolled an awkward squat-on-surfboard pose — pose-pool, not location) |
| Cape Cod | ✅ ~4.4 (dark) | R2: self 4.7 / couple 4.3 / scene 3.8 | R2 re-theme (sunnier, grey-shingle+lighthouse+marsh) worked. Self is a distinctly-Cape-Cod knockout; cast surfaces avg 4.5. PASS. (scene surface occasionally rolls a moody dusk aerial — acceptable variety) |
| Santa Monica | ✅ 4.53 (dark) | R3 cast-only: self 4.4 / plus1 4.7 / couple 4.5 | R1 FAIL (Baywatch beefcake + decor-wall). R2 partial (pier showed but "glamour" word → blazer/editorial costumes; barbed-wire "safety barrier" spot). R3 fix: dropped "glamour" from SUBJECT_RULE (positive casual, no negation), reworded barbed-wire spot, sunny-axes. PASS — all cast surfaces casual/sunny/on-place. |
| Coney Island | ⬜ | | retro boardwalk, coaster, Americana |
| 30A / Seaside | ⬜ | | candy-colored beach town, cruisers, picket fences |
| Malibu | ⬜ | | glass beach houses, surf, cliffs, sunset |
| The Hamptons | ⬜ | | grey-shingle estates, hedgerows, dunes |

### ⛰️ Nature & Wild (1) · ⏳ Through Time (1)
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Mount Everest / Himalayas | ⬜ | | snow peaks, prayer flags, glaciers, base camp |
| Prehistoric (Dinosaurs) | ⬜ | | primeval jungle, volcanic valleys, dinosaurs |

### 🦇 Gothic & Haunted (7)
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Haunted Mansion | ⬜ | | decaying manor, cobwebs, candlelight, portraits |
| Vampire Castle | ⬜ | | cliff castle, blood moon, crypts, bats |
| Foggy Graveyard | ⬜ | | misty tombstones, iron gates, gnarled trees |
| Gothic Cathedral | ⬜ | | vaulted stone, stained glass, gargoyles |
| Witch's Cottage | ⬜ | | twisted woods, cauldron, lanterns, ravens |
| Catacombs | ⬜ | | bone tunnels, torchlight, arches |
| Ghost Town | ⬜ | | abandoned frontier buildings, dust, moonlight |

### 🚀 Sci-Fi & Space (3) · 🤠 Wild West (3)
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Moon Base | ⬜ | | lunar surface, domes, Earthrise, rovers |
| Starship Bridge | ⬜ | | command deck, viewscreen, consoles |
| Robot City | ⬜ | | android metropolis, chrome towers, neon |
| Saloon | ⬜ | | swinging doors, poker, piano, gunslingers |
| Outlaw Hideout | ⬜ | | canyon camp, wanted posters, campfire |
| Railroad Town | ⬜ | | steam depot, frontier main street |

---

## Phase 3 — Prod deployment log
| What | Committed | admin_only flipped (LIVE) | Client build |
|---|---|---|---|
| De-tab UI + reorg | ⬜ | n/a | ⬜ |
| Reclassifications (Santorini/NL/Sahara/Wonders) | ⬜ | ⬜ | ⬜ |
| (per seeded category, added as they complete) | | | |

---

## Change Log
- **2026-08-27** — Plan (`LOCATION_REORG_PLAN.md`) + this tracker created. Taxonomy
  decided: 11 categories, no tabs, beaches split, landmarks→World Wonders, overlap
  OK. 41 net-new cards scoped. Picker UX polish (badge-only, buttons, single
  chevron, leave-prompt, announcement back-chain) code-complete but uncommitted.
  Nothing seeded or deployed yet.
