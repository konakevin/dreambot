#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/sky_phenomena.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SKY PHENOMENA descriptions for EarthBot's "sky" path. SKY IS THE SUBJECT; ground is peripheral context. Rare + exotic + atmospheric spectacles from Earth's actual sky physics.

Each entry: 15-30 words. One specific sky event with brief ground-context.

━━━ CATEGORIES TO DRAW FROM ━━━
- Aurora borealis / aurora australis (green / pink / violet over tundra / ice / forest)
- Supercell thunderstorm cloud structure (rotating mothership, anvil top)
- Mammatus clouds (pouch-like under thunderstorm base)
- Lenticular clouds (UFO-shaped over mountain peak)
- Altocumulus wave clouds (repeating ripples overhead)
- Milky Way arch (terrestrial star-field stretching horizon-to-horizon)
- Lightning fork / ribbon / cloud-to-cloud
- God-rays piercing storm clouds
- Sun-dog / parhelion (rainbow-like spots flanking sun)
- Moon-halo / lunar halo (ring around moon)
- Iridescent clouds (pearl-rainbow sheens)
- Noctilucent clouds (electric-blue wisps at dusk)
- Volcanic eruption cloud / pyrocumulonimbus
- Rainbow after storm (primary / double / full-arc)
- Sunset from plane-window altitude (cloud-carpets below)
- Fog-bow (white arc in fog)
- Crepuscular rays (god-rays from behind distant clouds at sunset)
- Cirrus streamers at high altitude
- Monsoon rain curtain visible from distance
- Noctilucent blue-glow clouds at twilight
- Sandstorm wall approaching across plain (sky-dominated)
- Ice-fog tundra phenomena (low sun + ice crystals)

━━━ RULES ━━━
- SKY IS SUBJECT — ground is just context
- NO humans
- NO animal subjects
- Earth-plausible atmospheric physics only
- NO fantasy, NO cosmic (no nebulas, no planets — that's StarBot)
- Rare/exotic/dramatic — not "blue sky with clouds"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
