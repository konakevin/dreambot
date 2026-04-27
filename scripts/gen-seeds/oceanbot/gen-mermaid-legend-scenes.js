#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_legend_scenes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} OLD MARITIME LEGEND SCENE descriptions for OceanBot's mermaid-legend path. These are scenes from FABLES — old sailor's tales, age-of-sail mythology, pre-industrial maritime world. Imagine these legends actually happened and someone was there to photograph them.

PERIOD: 1500s-1800s maritime world. Tall ships, wooden boats, stone harbors, oil lanterns, rope and canvas. NO modern anything — no ferries, cargo ships, oil platforms, wind turbines, piers, bungalows, yachts, marinas.

Each entry: 15-25 words. A specific old-world maritime environment where a mermaid legend takes place.

━━━ SETTINGS TO COVER ━━━
- Fog-shrouded rocky coastline at dawn, barnacle-covered boulders rising from churning surf
- Moonlit open ocean with distant tall ship under full sail, silver light on black swells
- Storm-battered headland with lighthouse beam cutting through rain, rocks glistening
- Ancient Mediterranean cove at twilight, crumbling stone steps descending into still water
- Northern sea at dusk, icebergs drifting, aurora shimmering across dark water
- Abandoned old-world harbor, rotting wooden wharves, kelp-draped pilings
- Open ocean at golden hour, endless rolling swells, lone galleon on the horizon
- Sea cave interior, dark water lapping at moss-covered rock walls, dim light from entrance
- Rocky channel between islands, dangerous currents swirling around sea stacks, thick fog
- Shipwreck half-sunk on a reef, broken mast and torn rigging, waves crashing over hull
- Windswept beach after a storm, splintered timber and rope scattered, stars breaking through clouds
- Fjord walls rising from black water, waterfall mist, wooden rowboat far below
- Old stone pier or breakwater, crumbling into the sea, lantern light on wet stone
- Volcanic coast at sunset, black rock meeting turquoise surf, steam rising from tidal pools

━━━ BANNED (breaks the period feel) ━━━
- NO modern vessels (ferries, cargo ships, tankers, motorboats, jet skis)
- NO modern structures (oil rigs, wind turbines, concrete piers, steel bridges, bungalows)
- NO modern references (yachts, marinas, diving equipment, submarines)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: water type (open/coastal/cove/cave) + time of day + weather + geography.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
