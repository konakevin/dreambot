#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_village_settings.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} AQUATIC-VILLAGE SETTINGS for ChibiBot aquatic-village — cozy aquatic-biome villages that are the HERO of the frame. NOT a single cottage — a VILLAGE (cluster of multiple dwellings).

Each entry: 25-40 words. ONE specific village. NO creatures, NO time-of-day, NO weather verbs.

━━━ THE BAR — CHIBI-SCALE COZY AQUATIC VILLAGE I WANT TO LIVE IN ━━━

The viewer's reaction: "I want to move into that aquatic village." Cluster of multiple dwellings. Heavily detailed lived-in. Studio Ghibli / Ponyo / Atlantis / Finding-Nemo aesthetic.

━━━ 11 SUB-TYPES — MUST VARY ACROSS THE POOL — distribute roughly evenly ━━━

- 10% CORAL-TOWER VILLAGE (cluster of branching coral-towers grown together as cottages, each glowing pink/orange/purple from within with warm interior light, suspended walkways between towers, drifting fish schools)
- 10% KELP-FOREST COTTAGES (cluster of cottages nestled in a swaying kelp-forest, kelp-thatched roofs, fronds drifting overhead, bioluminescent kelp-tip lanterns, sun-dappled water-light from above)
- 10% PEARL-SHELL HAMLET (cluster of giant nautilus-shell cottages and abalone-cottage rooftops glowing pearlescent, pearl-bead lantern strands, scallop-shell windows, mother-of-pearl pavement)
- 10% SUBMARINE-PORT (cluster of brass-portholed submarine-cottages docked at a coral-pier, brass-pipe walkways, glowing porthole-windows, ship-lantern strands, anchor-rope decorations)
- 10% TIDEPOOL VILLAGE (cluster of small tidepool-set cottages built on a rocky shore at low-tide, kelp-roofed huts, anemone-flower gardens, seashell-mosaic pavement, distant rolling waves)
- 10% SEA-CAVE DWELLINGS (cluster of cave-mouth cottages carved into a glowing sea-cave wall, bioluminescent ceiling, lantern-glow from each cave-mouth, stalactite-icicles overhead, calm water reflection)
- 10% FLOATING LILY-PAD CLUSTER (cluster of cottages built on giant lily-pad rafts on a calm sea-surface, lotus-flower lanterns, suspended-rope-bridge connectors, water-lily petal pavement, surface-water reflections)
- 10% KRAKEN-SHELL COTTAGES (cluster of giant nautilus-and-conch-shell cottages with brass-spiral chimney-pipes, glowing porthole-lit interiors, anchor-fence decor, kelp-rope walkways, seafarer-charm)
- 5% BIOLUMINESCENT GROTTO (cluster of cottages in an enclosed glowing cavern with bioluminescent coral and glow-jellyfish floating, soft turquoise ambient glow, crystal walls catching light, rope-bridge connectors)
- 5% STARFISH-BRIDGE TOWN (cluster of cottages connected by stone bridges shaped like starfish or coral-arches, hanging starfish-lanterns, mosaic-tile pavement with shells, drifting water-light)
- 10% SHIPWRECK-CORAL HAMLET (cluster of cottages built into a colorful shipwreck overgrown with coral, brass-cannon planters, mast-pole lampposts, sail-canvas awnings, treasure-chest seating)

━━━ MANDATORY: COZY-DECOR ELEMENTS IN EVERY ENTRY ━━━

Each entry MUST visibly include at least 3 village elements that establish the biome (architecture / lighting / flora / atmosphere / props).

━━━ HARD BANS ━━━

- NO creatures or characters
- NO time / weather / activity verbs
- NO single solo cottage — must be a VILLAGE (cluster of multiple dwellings)
- NO dark / moody / abandoned villages
- NO snow / NO desert / NO Mediterranean architecture — strictly underwater or coastal

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
