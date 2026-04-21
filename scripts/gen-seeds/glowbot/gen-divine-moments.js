#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/divine_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DIVINE-MOMENT scenes for GlowBot — sacred focal-light moments where the LIGHT ITSELF is the hero. A single concentrated luminous phenomenon becomes the subject.

Each entry: 18-32 words. Specific focal-light event + minimal surrounding context.

━━━ CATEGORIES ━━━
- Single sunbeam shafts (hitting forest floor / breaking through cathedral glass / cutting through fog)
- Firefly pillars gathering into columns of light in a meadow
- Glowing doorways opening (ancient archway glowing gold, shrine-door spilling light)
- Orbs of light floating over calm lakes or river bends
- Ancient-gate with dawn-light streaming through
- Single bright star or moon piercing an otherwise dark scene
- Aurora pillar over ice-field
- Lantern-light filling a small space (boat on still water, stone arch, cave mouth)
- God-ray breaking through storm clouds into otherwise-cloudy valley
- Single bioluminescent mushroom cluster or glowing flower in dim forest
- Candle-pillar in still-dark chamber (temple, shrine)
- Light emanating from centerpiece (fountain, altar, crystal, grave)
- Moon rising through tree canopy, single silver shaft
- Light-portal in a meadow (glowing circle, rune-lit ground)
- Campfire alone in a vast meadow at dusk, warm pool of light

━━━ RULES ━━━
- The LIGHT is the subject, the setting is minimal context
- Always peaceful + awe-inspiring + intimate
- Sense of sacredness or quiet wonder
- No characters

━━━ BANNED ━━━
- Multiple competing light sources (focal = single source of drama)
- Dark/menacing atmosphere
- Harsh/electric lighting

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
