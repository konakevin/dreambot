#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/fantasy_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} FANTASY LANDSCAPE descriptions for DragonBot — the FLAGSHIP path. Stunning fantasy-world vistas with or without architecture. LOTR/GoT/Elden-Ring/Warhammer scale. No characters.

Each entry: 15-30 words. One specific dramatic fantasy landscape.

━━━ CATEGORIES ━━━
- Castle vistas (vast mountain fortress on cliff, white citadel in valley with banners, ruined castle reclaimed by forest)
- Floating islands (aerial archipelago with cascading waterfalls, sky-city platforms connected by bridges)
- Ancient ruins (overgrown city reclaimed by moss and vines, fallen obelisk in jungle, amphitheater in twilight)
- Elven forests (cathedral trees with platforms in canopy, luminous root-glow forest, seasonal-moon elven realm)
- Volcanic peaks (obsidian mountain with lava rivers, dragon-peak with smoke, shadow-forge volcano)
- Frozen tundra (crystal-spired ice wasteland, frost giant's valley, aurora over ice-field)
- Sunken kingdoms (underwater ruins, flooded cathedral, drowned archway — above-water scale)
- Enchanted lakes (mirror-still lake with rising mist, lake bordered by ancient stones, lake with hovering lantern lights)
- Dwarven halls (vast underground city with cavern-ceiling, lava-lit forges, stone-carved throne room)
- Sky cities (clouds-wreathed city on mountaintop, aerial kingdom with towers piercing clouds)
- Dark forests (black-trunked woods with glowing eyes, primeval cursed grove, barrow-wood)
- Mage towers (solitary wizard tower on clifftop, leaning tower of scrolls, spiral-chamber library)
- Drowned crypts (sunken tomb on dark lake, foggy graveyard with cathedral ruin)
- Dragon lairs (mountain cave with hoard gleaming, volcanic lair with smoke, ice-dragon cavern)
- Holy sites (pilgrim's temple on peak, sunlit monastery, star-aligned stone circle)
- Battle scars (epic battlefield aftermath, broken siege weapons, ruined-gate courtyard)
- Steppes (vast fantasy grasslands with horse-lords' standards, nomad-encampment)
- Swamplands (misty bog with lit-windows hut, crocodile-king's drowned temple)
- Seaside cliffs (fantasy lighthouse on jagged cliff, pirate-cove with galleon)
- Market cities (bustling-vista fantasy city at sunset, spice-market canal)
- Jungle temples (stepped pyramid reclaimed by jungle, vine-wrapped statuary)
- Desert kingdoms (crescent-moon palace, sun-scorched obelisk ruins)
- Watchtowers on cliff-edges with banners
- Bridge-across-canyon archways with torches
- Wizard-school castles on island
- Orc-strongholds on rocky outcrops

━━━ RULES ━━━
- No characters (they go on other paths)
- Epic scale + painterly rendering
- Include specific architectural or geological detail
- Fantasy / mythic — not real-world Earth (that's EarthBot)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
