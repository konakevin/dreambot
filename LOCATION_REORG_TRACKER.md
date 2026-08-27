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
category to ≥4.5, everything `admin_only` dark. Currently: **Myrtle Beach pipeline
shakedown** (recipe → seed → QA self+couple → grade) to validate tooling before
scaling to the other 40. Beach Towns batch is first once the shakedown passes.
UI de-tab + reorg is a parallel/after task (independent of seeding).

**Last updated:** 2026-08-27 (seeding run started; dream-shoot skill + playbook loaded)

---

## Phase status
| Phase | Status | Notes |
|---|---|---|
| **1 — UI + Reorg** | ⬜ not started | de-tab, 11-category SECTION_META, DB reclassify |
| **2 — Seeding (41 cards)** | ⬜ not started | per-card table below |
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
| Card | Status | QA avg | Notes |
|---|---|---|---|
| Myrtle Beach | ⬜ | | boardwalk, SkyWheel, pastel cottages, pier, beach houses |
| Outer Banks | ⬜ | | stilt houses, dunes, lighthouses, wild horses |
| Cape Cod | ⬜ | | grey-shingle cottages, lighthouses, lobster shacks |
| Key West | ⬜ | | pastel conch houses, Duval St, sunset pier |
| Santa Monica | ⬜ | | pier + Ferris wheel, boardwalk, palms |
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
