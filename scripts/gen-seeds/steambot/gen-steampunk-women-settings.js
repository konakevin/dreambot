#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_settings.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK SETTING / BACKGROUND descriptions for SteamBot's sexy-steampunk-woman path. Each entry is JUST the environment around her — what's behind / framing her in the portrait. NO action. NO outfit. NO character description. Just the setting.

Each entry: 12-22 words. ONE specific steampunk environment with atmospheric detail.

━━━ SETTING CATEGORIES (mix broadly) ━━━
INTERIOR — WORKING:
- Inventor's cluttered workshop with brass-tool-rack and copper-coil shelves
- Airship engine-room with pulsing pistons and pressure-gauges
- Telegraph station with brass-key-row and ticker-tape baskets
- Alchemist's lab with bubbling alembics and copper-tube spirals
- Watchmaker's bench with hundreds of tiny gears under loupe-lamp
- Cartographer's drafting room with scrolled maps and brass-protractors
- Gunsmith's armory with rifle racks and brass-cartridge bins

INTERIOR — DOMESTIC / OPULENT:
- Victorian parlor with brass gaslamp sconces and burgundy velvet wallpaper
- Mahogany-paneled study with leather books and brass globe
- Conservatory with brass-framed glass and orchid hothouse beyond
- Boudoir vanity with brass-framed mirror and crystal perfume bottles
- Library with brass spiral-stair and floor-to-ceiling tomes
- Tea-room with copper samovar and lace curtains
- Music room with brass-pipe organ and crystal chandelier

INTERIOR — INDUSTRIAL:
- Factory floor with overhead brass conveyor-belts and steam-vents
- Forge with red-glowing coal-furnace and bronze-anvil
- Submarine pressure-chamber with brass portholes and oxygen-valves
- Locomotive cab with brass throttle-levers and pressure-dial wall
- Boiler-room with copper-pipe maze and dripping condensation

EXTERIOR — VEHICLE / DECK:
- Dirigible upper deck with brass railings and rope-rigging
- Train-station platform with steam-billowing locomotive
- Cargo-airship gangway with brass winches and crane-hooks
- Sky-pirate's wheelhouse with brass instruments and storm-clouds beyond
- Submarine deck under starlit sky with brass searchlight
- Gondola of moored airship with horizon-vista beyond

EXTERIOR — STREET / URBAN:
- Cobblestone alley with overhead brass-pipe network and gaslamp halos
- Victorian-industrial market square with brass-stalls and crowd
- Foggy harbor pier with brass-lanterns on iron posts
- Rooftop garden among brass-spire skyline at dusk
- Boulevard outside opera house with horse-drawn brass-trim carriages

EXTERIOR — WILDERNESS / EXPEDITION:
- Desert dig-site with canvas tent and brass excavation-tools
- Polar expedition camp with brass cooking-stove and sled-dogs
- Jungle ruin overgrown with vines and brass surveying-tripod
- Mountain pass with brass-fitted compass and pack-mule beyond
- Dusty plains with steam-vehicle parked behind

EXTERIOR — FANTASTICAL:
- Cliff-edge observatory with brass telescope under stars
- Floating-island library bridge with chains anchoring to cloud
- Crystal-cave laboratory with luminous mineral-formations
- Underground vault with brass-locked door and torch-light
- Clock-tower interior with massive brass cogs turning

━━━ HARD BANS ━━━
- NO actions / verbs (the action pool handles that)
- NO outfit / character description (other pools)
- NO "she", "her" — just describe the setting itself
- NO heavy fog / haze / mist (we want atmosphere, not obscuring fog)
- ONE setting per entry

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Inventor's cluttered brass workshop, copper coils stacked on shelves, gear-train wall, gaslamp pooling warm light"
- "Dirigible upper deck at golden hour, brass railings polished, rope-rigging silhouette against burning sky"
- "Foggy cobblestone alley after rain, brass overhead-pipe network, gaslamp halos in puddle reflections"
- "Mahogany-paneled Victorian study, leather books wall-to-ceiling, brass globe on desk, fireplace embers"
- "Crystal-cave laboratory deep underground, luminous mineral-formations casting blue-violet glow, brass instruments on stone-table"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
