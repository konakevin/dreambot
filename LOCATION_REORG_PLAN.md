# Location Reorg + Expansion Plan (2026-08)

Status of record for the location taxonomy overhaul + seed expansion. Supersedes
the earlier 4+4 grouping in `LOCATION_CONSOLIDATION_PLAN.md`.

## Guiding principle (the whole reason for this)
A **selectable location must be a place deep enough to dream in forever** — a
country, a major city, or a broad theme (dozens of distinct scenes). A single
landmark is NOT a location; it's a **spot** inside one. (Machu Picchu is a spot in
Peru / a spot in the World Wonders card, never its own pickable card.) This is what
lets every card seed with real variety.

## Decisions (locked with Kevin, 2026-08)
- **No tabs.** One scrolling page, two labeled sections (Real World / Dream Worlds).
- **11 categories:** 5 Real World + 6 Dream Worlds.
- **Overlap is fine** — Amalfi (beach) and Italy (country) coexist; different vibe,
  different dream (same logic as Tokyo vs Feudal Japan).
- **Landmarks dissolve** → one **World Wonders** card (wonders become its spots).
- **Beaches split** into **Tropical Escapes** (exotic) + **Beach Towns** (Americana
  boardwalks / beach houses) — genuinely different vibes, both well-stocked.
- **Iceland** stays a Nature card (not promoted to a country).

## Final structure → picker_category mapping

### 🌍 REAL WORLD (5)
| Category | picker_category(ies) |
|---|---|
| **Around the World** | `iconic_cities` + `countries_cultures` + the **World Wonders** card |
| **Tropical Escapes** | `tropical` |
| **Beach Towns** | `beach_towns` (NEW) |
| **Nature & Wild** | `epic_nature` |
| **Through Time** | `through_time` |

### 🐉 DREAM WORLDS (6)
| Category | picker_category |
|---|---|
| **Fantasy** | `high_fantasy` |
| **Gothic & Haunted** | `gothic_haunted` |
| **Whimsical** | `whimsical_fun` |
| **Sci-Fi & Space** | `scifi_space` |
| **Wild West** | `wild_west` |
| **Heroes & Adventure** | `heroes_adventure` |

---

## PHASE 1 — UI + Reorg (code + light DB; ships first, no new renders)

### 1a. DB reclassification (service-key script, no DDL)
- `Northern Lights`, `Sahara Dunes`: `picker_category` `landmarks_wonders` → `epic_nature` (they're landscapes, not built wonders).
- `Santorini`: `iconic_cities` → `tropical` (Tropical Escapes).
- **World Wonders consolidation:**
  - Repurpose the existing **`Ancient Wonders`** card → rename display to **World Wonders**; keep `picker_category` in the Around-the-World set (`landmarks_wonders` can be retired or reused as the single wonders home — simplest: set the World Wonders card to `iconic_cities` so it sits in Around the World, OR keep `landmarks_wonders` but map that pc into "Around the World" in SECTION_META and ensure only the one card carries it).
  - Ensure its `location_iconic_spots` cover all 8 wonders (Taj Mahal, Great Wall, Machu Picchu, Petra, Angkor Wat, Christ the Redeemer, Colosseum, Pyramids) — seed any missing spots.
  - **Deactivate the 6 individual landmark cards** (Taj Mahal, Petra, Machu Picchu, Great Wall, Angkor Wat, Christ Redeemer): set `picker_category = NULL` so they vanish from the picker. Keep the rows (don't delete — avoid breaking refs); their spots are orphaned but harmless. (Optionally salvage their best spots into World Wonders first.)
- Add `beach_towns` as a recognized `picker_category` value (no cards yet — the Beach Towns category simply won't render until seeded, per the empty-section rule).

### 1b. Code — `components/onboarding/LocationPickerStep.tsx`
- Rewrite `SECTION_META`: 11 entries with the mappings above (labels, tier, icon, `categories[]`).
- **Remove the segmented tab control + `activeTier` state.**
- `renderBrowse` → a single `ScrollView` with TWO labeled sections:
  - Section header "REAL WORLD" (neutral eyebrow + hairline rule) → grid of the 5 real cards.
  - Section header "DREAM WORLDS" (brand-gradient eyebrow + gradient rule, extra top margin) → grid of the 6 dream cards.
- Keep the global summary bar (count + Reset) pinned above both sections.
- Keep everything already built: drill-in detail, single context-aware chevron (`handleBack`), leave-with-zero confirm, badge-only selected state, button-styled Reset/Select-all.
- Empty categories still auto-hide (Beach Towns hidden until its cards seed).

### 1c. QA the UI in the simulator (both sections, drill-in, back chevron, leave prompt). Ship — this works with the CURRENT cards immediately; new cards fill in over Phase 2.

---

## PHASE 2 — Seed the 41 net-new cards (the real work)

Per-card pipeline (see `LOCATION_SEED_PLAYBOOK.md` + dream-shoot skill):
`generate-full-location-card.js` (recipe + fusion anchors) → `seed-category.mjs`
(gate cols + biome_config + **register-aware wardrobe** + 25 iconic spots + grade)
→ `qa-location.js` (self / plus_one / couple / scene into Kevin's PRIVATE Dreams
album) → 1–3 QA rounds to ≥4.5 avg → leave `admin_only=true` (dark) until sign-off.

### The 41 (+ 3 reshuffles handled in Phase 1)
| Category | New cards | n |
|---|---|---|
| Around the World — countries | Japan · Italy · Egypt · Greece · France · Spain · Ireland · Germany · Vietnam · Brazil · Scotland | 11 |
| Around the World — city | Sydney | 1 |
| Around the World — wonders | World Wonders (consolidated; Phase 1 structural) | 1 |
| Tropical Escapes | Amalfi Coast · Fiji · Cancún · Tahiti | 4 |
| Beach Towns | Myrtle Beach · Outer Banks · Cape Cod · Key West · Santa Monica · Coney Island · 30A/Seaside · Malibu · The Hamptons | 9 |
| Nature & Wild | Mount Everest / Himalayas | 1 |
| Through Time | Prehistoric (Dinosaurs) | 1 |
| Gothic & Haunted | Haunted Mansion · Vampire Castle · Foggy Graveyard · Gothic Cathedral · Witch's Cottage · Catacombs · Ghost Town | 7 |
| Sci-Fi & Space | Moon Base · Starship Bridge · Robot City | 3 |
| Wild West | Saloon · Outlaw Hideout · Railroad Town | 3 |
| **Total** | | **41** |

### Suggested batch order
1. **Beach Towns (9)** — new category, Kevin's most excited; seed first so it's not empty.
2. **Tropical Escapes (4)**.
3. **Countries (11)** — biggest; sub-batch ≤5 recipes at a time.
4. **World Wonders + Sydney (2)**.
5. **Gothic & Haunted (7)**.
6. **Sci-Fi (3) + Wild West (3)**.
7. **Everest + Dinosaurs (2)**.

### Register / vibe notes (get these right at the seed source)
- ⛔ **NO medium narrowing by location (Kevin, 2026-08-27).** Seed EVERY card
  `imagined=false` so ALL approved nightly mediums stay eligible — even fantasy /
  sci-fi / gothic. Do NOT set `biome_config.imagined=true` (it bans photo mediums).
  Face swaps look good across all approved mediums; if a specific location genuinely
  reads bad in one medium at QA, FLAG it for Kevin — never pre-ban per location.
- **Beach Towns = American nostalgia** — pastel cottages, boardwalks, stilted beach
  houses, piers, sunset. NOT exotic-tropical. Grounded-real register wardrobe.
- **Countries carry their landmarks as spots** — Japan (Fuji, Kyoto temples, torii,
  Tokyo), Egypt (Pyramids, Nile, Karnak), Italy (Colosseum, Venice, Tuscany), etc.
- Grounded worlds = authentic wardrobe (weathered real gear, not costume);
  fantastical worlds = full glam. Register-aware `gen-location-wardrobe.js` handles
  this (wardrobe register ≠ medium restriction — wardrobe still varies by world).

### Hard-rule gotchas (from CLAUDE.md + memory)
- **Throttle:** `waitForHeadroom({min:25})`, cap ≤3, avoid `:00` + ~08:00 UTC.
- Batch recipes ≤5, renders ≤2–4 (bg jobs die ~30 min; chunk after first OOM).
- Curation gate: set `is_approved=true` + `picker_category` + `admin_only=true`
  BEFORE global curation steps (seed-category does this).
- Wardrobe applies only when `biome_config` passes `isValidBiomeConfig`.
- QA renders → Kevin's PRIVATE Dreams album (`is_public=false`), reviewed in-app.
  Never /tmp/HTML.
- After ANY dual pose/scene pool seeding: run `scan-dual-faceswap-proximity.js`.

---

## PHASE 3 — Go-live
- New cards stay `admin_only=true` (dark) until Kevin signs off per category.
- The **de-tab UI + reorg can ship independently** of the seeding (it reorganizes
  the EXISTING cards immediately).
- When ready + a client build is cut: flip `admin_only=false` on approved cards.

## Open decisions (confirm before Phase 1 code)
1. **World Wonders home** — repurpose the `Ancient Wonders` card, and which
   picker_category does it carry so it lands in "Around the World"? (Recommend:
   keep `landmarks_wonders` on JUST the World Wonders card and map that pc into the
   Around-the-World section; null it on the 6 individual landmarks.)
2. **Section labels** — "Real World" / "Dream Worlds" final, or more flavor?
3. Salvage the 6 landmark cards' existing spots into World Wonders, or seed fresh?

## References
- `LOCATION_SEED_PLAYBOOK.md` — the 10/10 seed brain (read before seeding).
- `OPERATION_EXPAND_BUILD.md` — pipeline + progress board pattern.
- dream-shoot skill — Director-of-Photography role + QA bar.
