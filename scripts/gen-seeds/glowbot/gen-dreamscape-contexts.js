#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/dreamscape_contexts.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} BIOLUMINESCENT / PANDORA-DREAMSCAPE scenes for GlowBot — peaceful otherworldly settings where everything INNER-GLOWS. Avatar-Pandora-energy meets gentle peaceful beauty.

Each entry: 18-32 words. Specific glowing natural setting — inner-luminance is the aesthetic.

━━━ CATEGORIES ━━━
- Bioluminescent moss forests (trees/floor/canopy glowing from within)
- Lakes of inner-glow water (peaceful, reflecting sky, glowing softly)
- Crystalline forests humming with inner light (crystal-trees, refracting rainbow)
- Glowing-wildflower hillsides stretching to horizon under twilight
- Fields of luminous mushrooms under starfield
- Underground caverns with glowing crystal formations + still-water reflection
- Firefly-filled meadow at twilight, drifting slow
- Glowing-tide shores where waves are inner-cyan
- Enchanted grove where every leaf emits soft light
- Twilight canyon with glowing river cutting through
- Floating bioluminescent pollen fields
- Oasis of glowing flora in desert dusk
- Moss-covered ruins with inner-glow seeping from cracks
- Alien-peaceful valley with glowing ferns + floating light-orbs
- Drifting glowing jellyfish-meadow (over water or in mid-air dreamlike)
- Rainbow-gradient bioluminescent reef visible above water (emerging into air)
- Glowing-creek with soft cyan-silver water flowing through forest
- Night-garden where every flower emanates its own glow

━━━ RULES ━━━
- Peaceful / gentle / awe-inspiring always (NEVER Pandora's-dangerous-animals — just Pandora's PEACEFUL forest)
- Inner-luminance is the primary aesthetic
- Otherworldly but serene
- No humans; small magical creatures (fairies, butterflies, fireflies) OK peripheral

━━━ BANNED ━━━
- Dangerous / menacing / monster wildlife
- Dark/moody atmosphere
- Sci-fi technology elements

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
