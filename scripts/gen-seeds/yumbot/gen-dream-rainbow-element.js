#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_rainbow_element.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} RAINBOW ELEMENT descriptions for YumBot rainbow-dreamscape. The literal rainbow visible in each render — pouring out of a cup, arching overhead, or cascading down. NO cup descriptions (other pool).

Each entry: 12-22 words.

━━━ REFERENCE — bex.ai ━━━

Rainbows literally POUR out of cups like spillover (with rainbow candy-balls or pastel-frosting cascading out as a vivid rainbow). Or arch across the sky behind the cups. Or cascade in waterfall from cup-rim down to the ground.

━━━ DISTRIBUTION ━━━

- 35% RAINBOW POURING FROM CUP (a vivid rainbow pouring out of the hero cup like spillover with pastel-candy-balls cascading / rainbow-frosting cascading out of the cup like a waterfall / rainbow-stream pouring from the cup's spout)
- 25% RAINBOW ARCHING OVERHEAD (a perfect rainbow arching across the pastel sky behind the cup-inhabitants / a double-rainbow stretching from horizon to horizon / a soft pastel-rainbow-band painted across the sky)
- 15% RAINBOW CASCADE (a rainbow cascading down from the cup-rim onto the meadow / rainbow-droplets falling from above / rainbow-stream flowing across the grass)
- 10% RAINBOW REFLECTION (rainbow reflected in a stream / rainbow-prism-light glinting off dewdrops / rainbow-spectrum scattered on the grass)
- 5% PARTIAL RAINBOW (a partial rainbow forming behind the cups / a rainbow just beginning to arch / a fading rainbow gradually appearing)
- 5% MULTI-RAINBOW (multiple small rainbows pouring out of each cup simultaneously / rainbow-spaghetti cascading from cluster of cups)
- 5% RAINBOW-CONFETTI (rainbow-confetti raining gently / rainbow-pollen drifting in the air / rainbow-mist hovering)

━━━ HARD MANDATES ━━━

- LITERAL rainbow visible in the render
- Vivid rainbow colors against pastel backdrop
- Painterly-illustration register

━━━ HARD BANS ━━━

- NO cup-descriptions (other pool handles)
- NO landscape (other pool)
- NO no-rainbow (every entry MUST have a rainbow)

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
