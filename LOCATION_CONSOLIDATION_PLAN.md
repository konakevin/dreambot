# Location Consolidation & Generalization Plan (2026-08-25)

## ⭐ LOCKED IA — 4 + 4 category grouping (2026-08-25, Kevin)

The picker's 12 fine-grained categories collapse into **8 fat ones, a balanced 4 per tab**, so
selecting a place is a quick scan, not a wall of menus. Mock:
`scratchpad/picker-grouping.html` (artifact). The picker UI groups to these 8; all seed-expansion
content slots into them.

**Real World (4):** Cities & Landmarks (Cities+Landmarks) · Around the World (Countries+Tropical) ·
Nature (Epic Nature) · Eras (Through Time).
**Dream Worlds (4):** Fantasy (High Fantasy + Gothic) · Whimsical · Sci-Fi · Adventure (Wild West +
Heroes-broadened-to-6). Whimsical stays separate so cute never sits beside gothic.

### Status (2026-08-25)
- ✅ **Viking Age** — generalized + QUALITY template (see global fixes below).
- ✅ **Whimsical merges** — Rose Palace (35), Storybook Cottage (59); old cards hidden.
- ✅ **Epic Nature** — Cherry Blossoms + Japanese Garden hidden.
- ⏳ **Through Time (3 left):** Speakeasy→Roaring 20s (1 spot!), Pirate Cove→Age of Pirates, Medieval
  Village→Medieval Times.
- ⏳ **Wild West** consolidate 8→5 (Saloon+Depot+Cantina→Frontier Town).
- ⏳ **Gothic** fold Cursed Cathedral(0)+ into Haunted Castle; Transylvania empty(0).
- ⏳ **Heroes** broaden into ~6 power-fantasies (Kevin approved).
- ⏳ **~15 dark-launched cards render EMPTY (0 spots)** — the real go-live blocker: Cyberpunk City,
  Mars Colony, Space Station, Elven City, Enchanted Forest, Dwarven Fortress, Atlantis, Crystal
  Caverns, Mermaid Lagoon, Sky Islands, Cloud Kingdom, Fairy Tea Party, Pastel Dreamscape, Toy Shop,
  Mountain Summit, Border Cantina. **Seed + dedup before flipping visible.**

### GLOBAL quality fixes from the Viking deep-dive (apply to ALL categories, already shipped)
These made per-card work cheap — they're in the shared engine, not per-card:
1. **Poses** — new `dynamic` pool (hero-grade, swap-safe) + gentle prune of chore/farm poses +
   additive reweight (dual 15/40/45 playful/dynamic/classic; solo 40/30/30). `_shared/pools/*`.
2. **Wardrobe** — costume-designer directive in `characterSlotPrompt.ts` ("dress each to look their
   best, never frumpy/villager/drab"); lifts every location's cast wardrobe.
3. **Model** — `flux-2-flex` clamped to `flux-2-pro` on dual swaps (25%→9% fail). `flux-1.1-pro-ultra`
   stays (12.9%, fine — one bad render, not a bad model).
4. **Spot dedup** — the "always touching a rock" bug = 25% of Viking spots were near-duplicate stones.
   **NEW required step:** every seeded/expanded pool gets a SEMANTIC dedup pass (cluster near-dup
   concepts, thin the over-represented one to ≤~8% of the pool). Build an automated sweep across all
   cards. The gen script does NOT semantically dedup on its own.

---

**Goal:** streamline the location picker into fewer, funner, broader themes that are easy to digest
and give varied nightly dreams. Fix cards that were seeded as a single set piece (one building/room),
merge overlapping ones, remove broken ones. Real-world places stay specific on purpose.

**Method per card — the SEED EXPANSION is the work; the rename is cosmetic.** A narrow card renamed
broad without broad content is a missed-expectation trap (a user picking "Viking Age" who only ever gets
the same mead hall). So each generalization must actually deliver the breadth:
1. **Re-theme the recipe** so the brief spans the whole theme, not one structure. Rewrite the
   `SUBJECT_RULE` from "must be THIS one building, dominating the frame" to the theme's full range, AND
   regenerate the recipe arrays (`visual_palette`, `atmosphere`, `cinematic_phrases`) + `WARDROBE` +
   biome axes for the broad concept (`generate-full-location-card.js`). Otherwise Sonnet keeps writing the
   narrow scene even with new spots.
2. **Seed broad COVERAGE, not just volume.** Generate a fresh ~100-spot pool that deliberately spans the
   theme's distinct sub-settings. Viking Age must cover longships AND fjord raids AND mead halls AND shield
   walls AND rune stones AND snowy war camps — each a real chunk of the pool. The old narrow spots fold in
   as ONE facet. (`gen-iconic-spots-50 --fictional` for invented; real-prompt for grounded-historical; use
   the sub-region / must-include hints so coverage is enforced.)
3. **Rename** to the fun general name; classify + eligibility.
4. **Merge** = fold the retired card's spots into the keeper (reassign `location_key`), hide the retired
   card (`picker_category = null`). Nothing wasted.
5. **Acceptance test (non-negotiable):** QA-render 6-8 and confirm the dreams are genuinely VARIED across
   the theme — different sub-settings, not the old set piece on repeat. Only then is the card done.

**Guardrail:** REAL WORLD (Cities, Countries, Tropical, Epic Nature, Landmarks) stays as-is — a real
place being specific IS the point. Only fix the two broken nature cards.

---

## REAL WORLD

### Cities (19), Countries (7), Tropical (6), Landmarks (9) — KEEP AS-IS
Real iconic places, correctly specific. No change.

### Epic Nature (17) — REMOVE 2 BROKEN
- ❌ **Cherry Blossoms** (fantasy_imagined biome, 0 spots) and **Japanese Garden** (zen_garden, 0 spots):
  leftovers from the dissolved fantasy_worlds, mis-binned into Nature, would render nothing. Hide both
  (`picker_category = null`). → Epic Nature becomes 15 clean real-nature cards.

### Through Time (12) — GENERALIZE 4 SET-PIECES, keep the broad eras
Broad already (keep): Ancient Rome, Ancient Greece, Ancient Egypt, Feudal Japan, Renaissance,
Silk Road, Victorian London, 1950s Americana.
Generalize (rename + relax rule + breadth spots):
- **Viking Longhouse → Viking Age** — longships, fjord raids, mead halls, shield walls, rune stones,
  snowy war camps (longhouse = one facet).
- **1920s Speakeasy → Roaring 20s** — speakeasies + jazz clubs + city streets + Model-T era + Art Deco.
- **Pirate Cove → Age of Pirates** — ships at sea, boarding fights, ports, taverns, treasure isles, coves.
- **Medieval Village → Medieval Times** — castles, markets, knights, villages, monasteries (not one village).

---

## DREAM WORLDS

### High Fantasy (10), Sci-Fi (5) — KEEP
Already broad realms (Elven City, Dragon's Keep, Cyberpunk City, Alien Planet…). Good variety, no fix.

### Gothic (4 → 2) — CONSOLIDATE (heavy overlap)
Gothic Realm (umbrella), Cursed Cathedral, Haunted Castle, Transylvania all = "towering gothic stone."
- Keep **Haunted Castle** (broad) + **Transylvania** (distinct region/vibe).
- Fold **Cursed Cathedral** → Haunted Castle; fold **Gothic Realm** (umbrella) → Haunted Castle.
- Optionally rename the pair funner (e.g., "Haunted Castle", "Vampire Country").

### Whimsical (11 → 9) — MERGE the overlaps
- **Rose Garden + Crystal Palace** → merge into one **Rose Palace** (both rose-fantasy). Fold spots.
- **Fairy Cottage + Cottagecore** → merge into one **Storybook Cottage** (both cottages). Fold spots.
- Keep: Cloud Kingdom, Unicorn Meadow, Pastel Dreamscape, Toy Shop (broaden rule to "toy wonderland"),
  Princess Castle, Fairy Tea Party, Kawaii Candy Land.

### Wild West (8 → 5) — CONSOLIDATE the buildings
Landscapes stay distinct (keep): **Monument Valley**, **Canyon Standoff**, **Cattle Ranch**, **Gold Rush Camp**.
Merge the settlement/interior set-pieces into ONE broad town:
- **Saloon Interior + Steam Train Depot + Border Cantina + Frontier Town → "Frontier Town"** — spans
  saloons, depots, cantinas, main streets, jailhouses. Fold all their spots in, relax the rule.

### Heroes & Adventure (9) — the messiest; DECISION NEEDED
A grab-bag of unrelated settings (battlefield, rooftop, arena, summit, sub, temple, carrier, garage,
lair). Two paths — your call:
- **(A) Keep but rename funner + broaden** each into its power-fantasy ("Spy Lair → Secret Agent",
  "Race Track Garage → Motorsport", "Gladiator Arena → Gladiator", "Superhero Rooftop → Superhero",
  "Carrier Deck + Epic Battlefield → Battlefield", "Jungle Temple + Mountain Summit + Deep Sea Sub →
  Explorer/Expedition"). → ~6 broad hero-fantasies. **Recommended.**
- **(B)** Leave as-is (they render fine, just disparate).
- Note: these overlap the ACTIVE scenario buckets (superhero, secret_agent, etc.) — the location and the
  scenario both exist, which is redundant. Worth a look.

---

## Net effect
~116 picker cards → ~95 cleaner, broader, funner ones. Real World stays trustworthy-specific; Dream
Worlds becomes digestible themes instead of a wall of set pieces. Two broken cards gone.

## Suggested execution order (batches, each with QA)
1. Quick wins: hide Cherry Blossoms + Japanese Garden; the Whimsical + Gothic merges (fold spots, hide).
2. Through Time generalizations (4 cards: rename + relax + breadth spots) — do **Viking Age** first as
   the template, QA, then the other 3.
3. Wild West consolidation (merge 4 buildings → Frontier Town).
4. Heroes decision (A or B), then execute.
