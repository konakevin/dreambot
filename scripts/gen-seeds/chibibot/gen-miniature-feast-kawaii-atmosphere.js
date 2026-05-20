#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/miniature_feast_kawaii_atmosphere.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} KAWAII ATMOSPHERIC layers for ChibiBot miniature-feast — the magical environmental effect that amplifies cute-maxxing. Pop-Mart designer-vinyl pastel kawaii register.

Each entry: 12-22 words. ONE specific atmospheric layer. NO chibis, NO food, NO scene.

━━━ EVERY ENTRY ━━━

A specific atmospheric effect that adds magic to the kawaii scene — pastel bokeh, rainbow sparkles, cherry-blossom petals floating, mini-confetti rain, soft mist, sugar-glitter dust, etc.

━━━ FORMAT ━━━

Examples:
✓ "Pastel bokeh-orbs floating in the soft-blurred background, mint and blush and lavender, dreamy depth"
✓ "Cherry-blossom petals drifting gently through the entire frame like cute confetti"
✓ "Rainbow sparkle-dust shimmering in the air like magical fairy-dust"
✓ "Pastel rain of tiny heart-confetti and star-confetti falling slowly throughout"
✓ "Soft pastel mist haze in the background giving a dreamy soft-focus depth"
✓ "Sugar-glitter dust catching the light around the food hero like a magical sparkle"
✓ "Steam-curls with tiny smiling faces curling upward from the warm food hero"
✓ "Bubble-pearls floating gently in the air around the scene like soft balloons"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% PASTEL BOKEH (pastel-bokeh-orbs / mint-blush-lavender bokeh / dreamy-pastel-bokeh-depth)
- 15% PETAL-RAIN (cherry-blossom petals drifting / rose-petal-snow / pressed-flower-confetti)
- 15% RAINBOW-SPARKLE (rainbow sparkle-dust / rainbow gradient-mist / rainbow-aura)
- 10% MINI-CONFETTI-RAIN (heart-confetti rain / star-confetti rain / pastel jimmie-rain)
- 10% SUGAR / GLITTER (sugar-glitter dust / pearlescent-glitter / fairy-dust glow / sparkle-snow)
- 10% MIST / HAZE (soft pastel mist / dreamy haze / pastel-fog dreamscape / cotton-candy mist)
- 10% STEAM-WITH-FACES (steam-curls with tiny smiling faces / cocoa-steam-cute / wispy-cute-vapor)
- 5% BUBBLES (floating bubble-pearls / soap-bubble drift / pastel bubble-rain)
- 5% LIGHT-RAYS (pastel god-rays / soft sunbeams / glittery light-beams)

━━━ HARD MANDATES ━━━

- PASTEL palette
- Soft / dreamy / kawaii register
- ATMOSPHERIC (floats / drifts / haze / mist / glow — NOT solid decor)

━━━ HARD BANS ━━━

- NO chibis / creatures
- NO food hero
- NO dark / moody / scary atmosphere
- NO sci-fi / cyberpunk / neon atmosphere

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
