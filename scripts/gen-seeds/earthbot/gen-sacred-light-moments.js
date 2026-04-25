#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/sacred_light_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SINGLE DIVINE LIGHT MOMENT descriptions for EarthBot — scenes where one dramatic shaft or source of light creates a sacred, breathtaking focal point.

Each entry: 15-25 words. One specific moment of extraordinary light in a specific setting. No people.

━━━ CATEGORIES (mix across all) ━━━
- Sunbeam through ruins (single shaft piercing ruined cathedral nave, light through crumbling arch)
- Firefly pillars (column of synchronized fireflies in forest clearing, vertical glow shaft)
- Glowing cave entrances (brilliant daylight flooding into dark cave mouth, silhouetted entrance)
- Single shaft through forest canopy (one sunbeam hitting forest floor through dense canopy gap)
- Light through stained glass into overgrown chapel (colored light on moss-covered stone)
- Spotlight breaks in storm clouds (single hole in overcast illuminating one meadow patch)
- Light columns in slot canyons (noon beam cutting through narrow canyon to sandy floor)
- Lighthouse beams cutting fog (single rotating beam sweeping through dense coastal fog)
- Moonbeam through cloud break (silver shaft illuminating one tree, one rock, one clearing)
- Volcanic glow illuminating cavern (lava-light casting red-orange on cave ceiling and walls)
- Bioluminescent focal point (one glowing pool in dark forest, single luminous waterfall)
- Dawn first-light moments (very first ray of sunrise hitting one peak, one temple, one tree)

━━━ RULES ━━━
- ONE dominant light source or shaft — composition is about the SINGLE moment of illumination
- Contrast is key — surrounding darkness or shadow makes the light sacred
- Mix natural and architectural settings but light is always the subject
- Real or plausibly real phenomena — no magic beams, no fantasy portals
- No two entries should use the same light source in the same setting type
- 15-25 words each — reverent, hushed, awe-struck language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
