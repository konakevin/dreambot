#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/scene_palettes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} COLOR PALETTE descriptions for AncientBot's ancient civilization scenes. Each entry is 10-20 words describing a specific color palette using the pigments and materials of the ancient world. These compose with scene pools — describe ONLY the colors.

━━━ PALETTE SOURCES (mix across all) ━━━
- Egyptian mineral pigments (Egyptian blue/frit, malachite green, ochre yellow, hematite red, carbon black, gypsum white)
- Lapis lazuli blue (deep ultramarine imported from Afghanistan, used in Mesopotamian and Egyptian decoration)
- Gold and bronze (hammered gold leaf, polished bronze surfaces, warm metallic glow)
- Earth tones (raw sienna, burnt umber, ochre, terra cotta, mud-brick warm brown)
- Desert palette (sand-gold, bleached-bone white, deep shadow purple, sunset amber)
- River palette (Nile green, muddy ochre, papyrus pale-gold, deep water blue-brown)
- Glazed brick colors (Babylonian Ishtar Gate — cobalt blue, turquoise, gold, white on dark)
- Minoan fresco palette (warm saffron-red, sky blue, white, black, green)
- Tropical/jungle palette (jade green, volcanic black, earth red, canopy shadow)

━━━ RULES ━━━
- Each entry is ONE cohesive color palette (3-5 colors working together)
- Name the ACTUAL pigments or materials where possible
- These should feel RICH and WARM — ancient civilizations loved vivid color
- 10-20 words
- NO modern color names (no "neon", no "pastel pink", no "electric blue")

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
