# Operation Dream Location Expansion

**Goal:** grow the places users can set their dreams in, well beyond today's mostly-real-Earth catalog.
Add more real locations, plus whole new themed worlds: high fantasy, sci-fi, old west, historical eras,
and "fun" settings (kawaii, princess, hero/adventure, etc.).

**Status:** PLAN + brainstorm (authored 2026-08-24). Nothing built yet. Decisions needed from Kevin (bottom).

---

## 1. Where we are today (grounded analysis of the live catalog)

**105 `location_cards` rows, but only 48 are actually live.** Visibility gate = `picker_category IS NOT NULL`
(the old `is_approved` flag is vestigial; every card with a `picker_category` shows, the rest are hidden).

**Live picker = 3 visible sections, and they are ~100% real Earth:**

| Section (`picker_category`) | Live label | Count | Examples |
|---|---|---|---|
| `iconic_cities` | Cities & Countries | 26 | Tokyo, Paris, NYC, Dubai, Santorini, Rio, Marrakech |
| `epic_nature` | Epic Nature | 16 | Yosemite, Grand Canyon, Iceland, Fjords, Patagonia, Safari |
| `tropical` | Tropical Escapes | 6 | Bali, Maldives, Hawaii, Bora Bora, Caribbean |

**Two big findings that change the shape of this project:**

1. **`fantasy_worlds` has 7 cards but is INVISIBLE.** The picker's section list (`SECTION_META` in
   `components/onboarding/LocationPickerStep.tsx`) only names 3 sections, and `fantasy_worlds` is not one
   of them. So Rose Palace, Cloud Kingdom, Wizard Academy, Fairy Tale Kingdom, Cherry Blossoms, Japanese
   Garden all exist and render nothing. A new user today sees **zero imagined worlds.**

2. **There is a 50-card graveyard of exactly what we want.** The 50 cards with `picker_category = null`
   are the original pre-reorg set, now hidden, and they are FULL of themed/imagined places we can revive:
   *alien planet, cyberpunk megacity, dwarven fortress, ancient elven city, dragon's keep, space station,
   Mars colony, crystal caverns, floating sky islands, princess garden castle, gothic realm, pirate ship,
   noir cityscape, Victorian London, Transylvania, mermaid lagoon, haunted castle, underwater city Atlantis,
   high fantasy, sci-fi worlds.* Many need a refresh, but the recipes and thumbnails are a head start.

**How a location works (the "recipe" model):** each card is a rich scene DNA record. Beyond `name` /
`display_name` / `thumbnail_url` / `picker_category` / `picker_sort_order`, the generative fields are six
phrase-arrays plus a biome:
`visual_palette`, `atmosphere`, `architecture`, `light_signature`, `texture_details`, `cinematic_phrases`,
`biome` (+ `biome_config`, `must_include`, `sub_regions`). Depth comes from two more tables:
- `location_spots` (944 rows: `spot` = specific places, `activity` = things to do there),
- `location_iconic_spots` (9,079 rows: named viewpoints/scenes, tagged `pure_scene_eligible` +
  `character_eligible` + `quality_tier`).

**Depth is very uneven.** Best locations carry 40-50 iconic spots (Barcelona 53, London 43, "high fantasy"
44); many carry 1-3 (Swiss Alps 1, Patagonia 1, Rome 2, San Francisco 2). A thin location renders
repetitive dreams. Any expansion has to fund depth, not just add a tile.

**Architecture cost to add locations:**
- Adding a location to an EXISTING category = data only (INSERT a card + seed its spots). Appears next app load.
- Adding a NEW category = one small code change (append a `SECTION_META` entry: id, title, icon, description)
  in `LocationPickerStep.tsx` (and the Settings locations screen), plus the card data.

So the engine is ready. The work is **authoring quality recipes + depth + thumbnails**, and **a bit of
picker UI** for new sections.

---

## 2. The gaps (vs. the vision)

1. **No imagined worlds are visible at all.** Fantasy is hidden; sci-fi, old west, historical, and "fun"
   are absent from the live set (some exist only in the graveyard).
2. **Real-Earth catalog has holes too** (see §4E) — missing whole regions, landmark/wonder set, seasonal
   and time-of-day variety, US road-trip flavor.
3. **Thin depth** on many live locations means samey dreams.
4. **No taxonomy for "worlds."** Today's 3 sections are all real-Earth flavors. We need a second tier of
   imagined categories, and probably a visual/organizational split so the picker does not become a wall of
   80 tiles.

---

## 3. Category architecture + onboarding UX integration (DECIDED 2026-08-24)

### Cross-examination result (confirmed)
One component, `components/onboarding/LocationPickerStep.tsx`, powers BOTH onboarding and the Settings
locations screen (`app/settings/locations.tsx` just renders it with `isEditing=true`). Its `SECTION_META`
array hardcodes only three sections (`iconic_cities`, `tropical`, `epic_nature`); the render is
`SECTION_META.filter(m => byCategory.has(m.id))`, so any `picker_category` not in `SECTION_META` renders
nothing. `fantasy_worlds` (7 cards) is loaded from the DB (its thumbnails even get cached) and then dropped.
Confirmed: **fantasy is orphaned from the UI in both onboarding and Settings, by that one filter.** It was
hidden at launch for time, not by design. Surfacing it = one `SECTION_META` entry.

### Category set (two meta-groups)
**A) Real Places:** Cities & Countries · Tropical Escapes · Epic Nature · **Landmarks & Wonders** (new)
**B) Imagined Worlds:** **High Fantasy** · **Sci-Fi & Space** · **Old West** · **Through Time** (historical) ·
**Whimsical & Fun** (kawaii/princess) · **Heroes & Adventure** (action/rugged, male-leaning)

Exact labels still Kevin's to tweak (e.g., "High Fantasy" vs "Fantasy Realms"; "Heroes & Adventure" vs a
punchier name).

### Onboarding UX — DECIDED
- **Two-tier layout (Real / Imagined).** A top segmented toggle (or two banners) splits the list into
  Real Places and Imagined Worlds; themed sections group under each tier. Real tier first.
- **Full catalog in BOTH onboarding and Settings.** Nothing hidden on first run; the same complete category
  set shows in onboarding and Settings. (No `isEditing`-based lightening — that option was declined.)
- **Collapse-to-peek sections carry the length.** Because first-run now shows every category, each section
  defaults to header + description + a 4-tile peek + "Show all N" (the collapse affordance already exists;
  flip its default to collapsed). This turns ~10 categories into a short, scannable list of headers instead
  of a 120-tile wall, while keeping everything one tap away.
- **Optional category chip bar** to jump between worlds (All · Cities · Tropical · Nature · Fantasy · Sci-Fi
  · Old West · History · Fun · Heroes). Nice-to-have; the two-tier toggle + collapse already make it usable.

Sketch:
```
  Where do you want to dream?
  [ 🌍 Real Places | ✨ Imagined Worlds ]        ← tier toggle
  ── REAL PLACES ─────────────────────────
  🌆 Cities & Countries      3 selected  ▸ Show all 26
     [Tokyo][Paris][NYC][Dubai]
  🌴 Tropical Escapes                     ▸ Show all 6
  🏔  Epic Nature                          ▸ Show all 16
  🏛  Landmarks & Wonders                  ▸ Show all
  ── IMAGINED WORLDS ✨ ───────────────────
  🐉 High Fantasy                          ▸ Show all
     [Elven City][Dragon's Lair][Sky Isles][Wizard Tower]
  🚀 Sci-Fi & Space   🤠 Old West   ⏳ Through Time   🎀 Whimsical & Fun   🦸 Heroes & Adventure
```

### Code cost of the UX change
- Extend `SECTION_META` from a flat list to tier-tagged entries (add a `tier: 'real' | 'imagined'` field
  + the new sections), render two grouped banners with the toggle, and default `expandedSections` to empty
  (collapsed). All in `LocationPickerStep.tsx`; Settings inherits it for free. No schema change (categories
  are still just `picker_category` strings on the cards). One focused component PR.

---

## 4. The brainstorm — concrete location ideas

Vague categories, never named IP (the disabled "Hogwarts" card shows we already avoid that; use "Wizard
Academy"). Every idea below should place a human character naturally (for "cast me in") AND stand alone as a
scene (for scene-only). One-line vibe each; ★ = revivable from the graveyard.

### 4A. High Fantasy
- ★ **Ancient Elven City** — luminous treetop spires, silver bridges, bioluminescent gardens
- ★ **Dwarven Hold** — vast underground forge-halls, molten gold veins, carved stone kings
- ★ **Dragon's Lair** — a hoard-piled cavern, scorched stone, a sleeping wyrm's glow
- ★ **Floating Sky Islands** — grass-topped isles drifting in cloud, waterfalls into open air
- **Enchanted Forest** — mist, glowing mushrooms, ancient faces in the bark
- **Wizard's Tower** — a spiral study of floating books, orreries, arcane light
- **Fairy Glen** — a dew-lit hollow, toadstool rings, tiny lanterns
- ★ **Crystal Caverns** — geode chambers, refracted rainbows, underground pools
- **Castle Throne Room** — banners, a great hall, shafts of colored window-light
- **Dark Fortress** — obsidian spires, storm and ember, a villain's seat of power
- ★ **Mermaid Lagoon / Sunken Palace** — coral courts, shafts of aqua light, pearl thrones
- **Fantasy Tavern** — a warm crowded inn, hearth, adventurers and lute-song
- **Frost Giant's Peak** — a colossal icy summit, aurora, frozen halls
- **Feywild Meadow** — impossible flowers, floating pollen-light, a dreamlike glade
- **Magic Academy Courtyard** — spellcraft students, moving staircases (not IP), glowing crests

### 4B. Sci-Fi & Space
- ★ **Space Station** — a rotating ring, Earth through the glass, humming corridors
- ★ **Alien Planet** — twin suns, strange flora, ringed skies, unearthly color
- ★ **Cyberpunk Megacity** — neon rain, holo-ads, flying traffic, rooftop noodle bars
- ★ **Mars Colony** — red dust domes, greenhouse bays, rovers at the airlock
- **Generation Starship Interior** — endless bio-decks, a fake sky, cryo bays
- **Neon Space Bazaar** — an alien market station, glowing stalls, a hundred species
- **Moon Base** — low-grav habitats, an Earthrise, boot-prints in gray dust
- **Retro-Future 1950s** — chrome rockets, ray-guns, atomic diners, "World of Tomorrow"
- **Post-Apocalyptic Ruins** — a reclaimed city, vines on skyscrapers, golden overgrowth
- **Robot Foundry** — assembly arms, sparks, a cathedral of machines
- **Orbital Elevator / Skyhook** — a tether to the stars, a glass car above the clouds
- **Wormhole Gate** — a shimmering ring in deep space, a ship poised to jump

### 4C. Old West
- **Frontier Town** — a dusty main street, boardwalks, swinging saloon doors
- **Saloon Interior** — a piano, poker table, brass rail, warm lamplight
- **Desert Canyon Standoff** — red mesas, a lone rider, high noon
- **Gold Rush Camp** — a river claim, panning gold, tents in the pines
- **Cattle Ranch at Golden Hour** — big-sky prairie, corrals, a homestead porch
- **Train Robbery / Steam Depot** — a stopped locomotive, steam, a wooden platform
- **Monument Valley Trail** — iconic buttes, a wagon, endless horizon
- **Border Cantina** — string lights, adobe walls, a warm desert night

### 4D. Through Time (historical eras)
- ★ **Ancient Egypt** — pyramids, temple columns, gold and lapis, torch-lit tombs
- ★ **Ancient Rome / Colosseum** — marble forums, togas, laurel and legion
- **Feudal Japan** — a samurai castle, cherry courtyards, paper lanterns
- **Viking Longhouse** — a firepit hall, shields, mead and fur, a longship shore
- **Medieval Village / Market** — thatched roofs, a bustling square, banners
- **Renaissance Venice** — canals, masquerade, gilded palazzos
- **1920s Speakeasy** — art deco, jazz, gold and green, a secret door
- ★ **Victorian London** — gaslamp fog, cobbles, hansom cabs
- **Golden-Age Pirate Cove** — a hidden harbor, galleons, treasure and palm
- **Aztec / Mayan Temple** — a jungle pyramid, jade and feathers, ceremonial fire
- **Ancient Greece** — white temples, olive groves, an Aegean cliff
- **Silk Road Caravanserai** — a desert trade-stop, spice, camels, lantern night
- **1970s Disco / Roller Rink** — mirror balls, neon, technicolor nostalgia
- **1950s Americana** — a soda fountain, drive-in, chrome and pastel

### 4E. Real Earth fill-ins (expand what already sells well)
- **Landmarks & Wonders (new section):** ★ Taj Mahal, ★ Petra, ★ Machu Picchu, ★ Great Wall, ★ Angkor Wat,
  ★ Colosseum, Christ the Redeemer, Northern Lights over a glacier, Sahara dunes, ★ Roman ruins
- **More cities/regions:** Kyoto, Cairo, Istanbul (have Turkey), Cape Town, Buenos Aires, Reykjavik,
  Edinburgh, Cinque Terre, Swiss village, Provence lavender, Scottish Highlands, Irish coast
- **More nature:** Northern Lights, Antarctica, Serengeti migration, Great Barrier Reef, Amazon river,
  autumn New England, cherry-blossom Japan (seasonal), a lavender field, a redwood fog forest
- **US road-trip flavor:** Route 66, New Orleans French Quarter, Nashville, a national-park lodge, a coastal
  PCH overlook

### 4F. Whimsical & Fun (kawaii / princess)
- **Kawaii Candy Land** — pastel sweets, gumdrop hills, a marshmallow sky
- **Princess Ballroom** — a sparkling gown ball, chandeliers, a grand staircase
- **Princess Garden Castle ★** — turrets, rose topiary, a fairy-tale drawbridge
- **Cottagecore Cottage** — a mossy stone cottage, wildflowers, warm bread and tea
- **Unicorn Meadow** — rainbow light, flower crowns, a pastel dawn
- **Pastel Dreamscape** — cloud castles, floating hearts, cotton-candy color
- **Fairy Tea Party** — tiny lanterns, teacups, a garden under bloom
- **Enchanted Toy Shop** — music boxes, marching toys, warm wooden wonder
- **Mermaid Palace (pastel)** — a sparkling under-sea court, shell thrones, pearl light

### 4G. Heroes & Adventure (the action / rugged, male-leaning bucket)
- **Superhero City Rooftop** — a caped skyline at dusk, a beacon in the clouds
- **Spy Lair / Secret HQ** — sleek tech, a hidden mountain base, gadgets and glass
- **Epic Battlefield** — a heroic last stand, banners, dramatic weather (no gore)
- **Mountain Summit Expedition** — a wind-whipped peak, rope and crampons, above the clouds
- **Race Track / Muscle-Car Garage** — chrome, neon, a starting grid, engine glow
- **Deep-Sea Sub / Ocean Trench** — a research sub, bioluminescence, crushing dark
- **Jungle Temple Expedition** — an Indiana-style ruin (not IP), vines, torchlit traps
- **Fighter-Jet Carrier Deck** — a flight deck at dawn, jets and steam catapults
- **Viking Raid Shore** — longships beaching, a dramatic gray sea (overlaps Through Time)
- **Gladiator Arena** — sand, roaring crowd, sun and dust (overlaps Rome)

---

## 5. Design principles & guardrails

- **Cast-and-scene by construction.** Every location must place ONE human (self face-swap) naturally AND
  work as a no-cast scene. Seed `character_eligible` spots (foreground, human-scale framing) AND
  `pure_scene_eligible` spots (establishing shots). This is the single biggest quality lever.
- **No IP.** Vague categories only. "Wizard Academy" not the named school; "Jungle Temple" not the named
  archaeologist. (We already disabled the literal ones.)
- **All-ages / tasteful.** Princess and kawaii read wholesome; heroes read epic not violent (no gore).
  Everything must survive the NSFW filter and the face-swap.
- **Gendered buckets, inclusive copy.** "Princess" and "Heroes & Adventure" capture the girl-leaning and
  guy-leaning intent without labeling them by gender in the UI. (Copy is Kevin's call — see decisions.)
- **Depth floor.** No location ships with < ~15 iconic spots (mix of scene + character eligible) + a
  `spot`/`activity` pool. Thin locations render repetitive dreams.
- **Thumbnails matter.** The picker is tiles; each card needs a striking `thumbnail_url`. Generating a
  great thumbnail per location is real work and part of "done."
- **Create vs. Nightly scope.** Decide whether imagined worlds flow into NIGHTLY auto-dreams (casting the
  user into a dragon's lair nightly) or Create-only. Nightly inclusion multiplies QA (face-swap in every
  world) and is a bigger commitment. Recommend Create-first, nightly later per-world once proven.

---

## 6. Authoring pipeline (build at quality + scale)

Mirror the discipline that worked for the holiday pools and bot paths:

1. **Recipe generator** (`scripts/gen-location-cards.js`, Sonnet-authored): per location, produce the six
   phrase-arrays + biome + a starter spot/iconic-spot pool, from a short brief (name + vibe + era/world).
2. **Depth seeding:** N iconic spots (tag `pure_scene_eligible` / `character_eligible` / `quality_tier`) +
   `spot`/`activity` rows, gated by a lint (no IP, no NSFW tokens, character-placeable).
3. **Thumbnail:** generate a hero image per location (one render, curated), upload, set `thumbnail_url`.
4. **QA batch:** render several dreams per location (cast self + scene-only), grade to a bar (the same
   ≥4.5 discipline), iterate, then flip `picker_category` to go live.
5. **Category surface:** add the `SECTION_META` entry once per new category (small PR).

Reuse before building: **triage the 50-card graveyard first** — many recipes + thumbnails are 80% there and
just need a refresh pass and a depth top-up. That is the cheapest quality-per-hour in the whole project.

---

## 7. Phased rollout

- **Phase 0 — Quick wins (days):** surface the hidden `fantasy_worlds` section (add `SECTION_META`), and
  triage the graveyard: pick the ~15-20 best imagined cards, refresh + depth-top-up, relight them.
- **Phase 1 — High Fantasy + Sci-Fi:** the most differentiated, highest-demand worlds. Build to the depth
  floor, QA, launch as two new sections.
- **Phase 2 — Through Time + Old West:** historical eras (lots of built-in variety) + the western set.
- **Phase 3 — Whimsical & Fun + Heroes & Adventure:** kawaii/princess and the action/rugged bucket.
- **Phase 4 — Real-Earth fill-ins:** Landmarks & Wonders section + city/nature gaps + depth passes on the
  thin existing locations (Swiss Alps, Patagonia, etc.).

Each phase is flag-free (a location goes live only when its `picker_category` is set), so we ship
incrementally with zero risk to the existing picker.

---

## 8. Decisions

**RESOLVED 2026-08-24:**
- ✅ **Picker layout: two-tier Real / Imagined.**
- ✅ **Full catalog in both onboarding and Settings** (no first-run lightening).
- ✅ Category set per §3 approved (labels still tweakable).

**Still open:**
1. **Target size + ambition.** 48 live today. Aim for ~80 (curated) or ~120 (broad)? Sets the scope.
2. **Section labels:** final names (e.g., "High Fantasy" vs "Fantasy Realms"; "Heroes & Adventure" vs
   something punchier).
3. **Gendered copy:** how explicit? "Princess" + "Heroes & Adventure" as proposed, or something else?
4. **Nightly scope:** imagined worlds in Create only, or nightly auto-dreams too (bigger QA)?
5. **Graveyard:** OK to revive/refresh the good disabled cards (vs. build all-new)?
6. **Kickoff:** start with Phase 0 (surface fantasy + graveyard triage + build the two-tier UX) so you see
   wins this week, or jump straight to building High Fantasy from scratch?

---

## Appendix: the 50-card graveyard (revival candidates)

cozy mountain cabin, pirate ship, salt lake city, tahiti, alien planet, cyberpunk megacity, tuscan villa,
gothic cathedral, underwater city, sea world, great wall of china, rose garden palace, enchanted forest,
parisian cafe, ancient egypt, taj mahal, roman colosseum, hogwarts (IP — do NOT revive), gothic realm,
sci-fi worlds, disneyland (IP — skip), zions national park (dup), dwarven fortress, cherry blossom temple,
petra, underwater city atlantis, angkor wat, sahara desert, fairy cottage, haunted cathedral, ancient rome,
high fantasy, princess garden castle, crystal caverns, greek isles, mars colony, ancient elven city,
dragons keep, space station, aquarium, mermaid lagoon, haunted castle, floating sky islands, arches national
park, transylvania, arctic wilderness, noir cityscape, victorian london, machu picchu, moab utah.
