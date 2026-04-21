#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/underwater_environments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} UNDERWATER ENVIRONMENT descriptions for OceanBot's underwater-world path — vast underwater ecosystems. Kelp forests / shipwrecks / underwater canyons / cenotes / arctic under-ice / underwater caves.

Each entry: 15-30 words. One specific underwater environment.

━━━ CATEGORIES ━━━
- Giant kelp forest with sunbeams filtering through
- Ancient shipwreck overgrown with coral and sea-life
- Underwater canyon with light-descending
- Mexican cenote with stalactites + freshwater
- Arctic under-ice with pale blue glow
- Underwater cave system with shaft-of-light
- Mangrove-root underwater forest
- Sargasso-sea floating kelp-mat from below
- Volcanic-vent black-smoker with extremophiles
- Deep-trench with bioluminescent snow
- Coral-atoll lagoon floor
- Kelp-stipes forest with rays visible
- Seagrass-meadow with turtle grazing
- Limestone-cave cenote with Mayan-carving visible
- Under-ice shelf with algae underside
- Underwater cathedral-like cave
- Sunken-city ruins overgrown
- Sunken-plane wreck coral-encrusted
- Submarine-wreck with ghost-net
- Underwater-sinkhole vertical
- Blue-hole descent with sharks circling
- Continental-shelf drop-off
- Kelp-cathedral dappled light
- Sunken-temple with pillars overgrown
- Underwater-river in cave
- Deep-sea-trench volcanic
- Hydrothermal-vent chimney with tube-worms
- Underwater-island pedestal
- Coral-amphitheater semicircle
- Submarine-volcano erupting underwater
- Iceberg-underside with penguin tracks
- Fresh-water aquifer underwater
- Underwater forest of sponges
- Silt-silt silty ghost-environment
- Jellyfish-lake fresh-water ecosystem
- Blue-glacier-cave with blue-ice
- Under-ice krill-swarm
- Deep-sea mudflat
- Underwater-dunes rippled sand
- Abyssal plain with scattered creatures

━━━ RULES ━━━
- Vast underwater ecosystem scope
- No characters (pure environment)
- Architectural + geological detail where apt

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
