#!/usr/bin/env node
/**
 * BRICKBOT_AQUATIC_REGISTER — marine LEGO faction / canon heritage lock.
 * Audit 2026-06-05: 43 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_aquatic_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's aquatic path — a register is the LEGO MARINE faction / canon / era heritage that defines the look (palette + minifig torsos + helmet style + sub silhouette). Each entry: ONE CAPS prefix + em-dash + 25-40 word body describing palette + minifig signature + scene anchor.

━━━ THE BAR ━━━
Every entry names a heritage register (classic LEGO marine faction, hard-canon sci-fi-marine, or coastal/nautical sub-genre) and locks: PALETTE (3-color), MINIFIG (torso prints + helmet + accessory style), and SCENE ANCHOR (one structural / vehicle / location detail unique to that register). Sonnet must produce visibly distinct registers — not interchangeable "marine" beats.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 CLASSIC LEGO MARINE FACTIONS: Atlantis Treasure-Quest, Aquazone Aquanauts, Aquasharks, Aquaraiders, Hydronauts, Stingrays, Deep-Sea Explorers, Atlantis Salvage, City-Deep-Sea
- ~3 LEGO COASTAL / TROPICAL: Pirates-Cove Tropical-Island, Friends-Heartlake Beach, Creator Beach-House, Town/City Coastal-Harbor, Octan-Resort
- ~3 LEGO ARCTIC / POLAR: Arctic-Research, Ice-Planet 2002, Sub-Zero Heroes, Polar Explorers, Frozen-Harbor
- ~3 LEGO MILITARY-MARINE / RESEARCH: Coast-Guard, NOAA-Research, Deep-Sea Salvage-Industrial, Submarine Service, Lighthouse-Keeper
- ~3 HISTORICAL MARITIME: Tall-Ship-Era Whaler, Viking Longship, Polynesian Voyager, Edo-Era Junk, Greek Trireme
- ~3 HARD-SF MARINE-CANON: Abyss-Echo Hydrosphere, BioShock-style Underwater-City, 20000 Leagues, Atlantis-Mythic, Innerspace Submersible
- ~2 CRYPTID / WEIRD-DEEP: Cthulhu R'lyeh, Lovecraft Bathyscape, Bermuda-Triangle Ghost-Wreck
- ~2 ECO / CONSERVATION: Reef-Protection Patrol, Whale-Sanctuary Survey, Coral-Restoration Lab
- ~1 RETRO 50s-FROGMAN
- ~1 PIRATE-SHIP wreck (sunken-galleon)

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (faction name in 2-6 words hyphenated or spaced), em-dash, 25-40 word body. Body must mention PALETTE colors + MINIFIG signature + SCENE ANCHOR (structure/vehicle). Touchpoints:
"ATLANTIS TREASURE-QUEST SIGNATURE — gold + teal + treasure-amber palette, deep-sea diver minifigs with trident + treasure-key accessories and gold-trim helmets, ancient sunken city ruins of pillar-builds and trans-glass dome chambers"
"AQUAZONE AQUANAUTS SIGNATURE — yellow + black + trans-neon-green palette, classic 90s yellow-black scuba minifigs with airtank-elements + clear helmets, retro modular sub-bay with crystal-power reactor cores"
"ARCTIC-RESEARCH-STATION SIGNATURE — safety-orange + white + dark-grey palette, parka-and-goggle scientist minifigs with ice-core drills, modular base-camp with snowmobile + ice-shelter dome"

━━━ BANS ━━━
- NO duplicating heritage already in pool
- NO blank "marine" or "diver" — name the faction
- NO photoreal vocab
- NO licensed franchise IP names verbatim (use generic-coded equivalents)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
