#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/atmospheres.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PIXEL ATMOSPHERE descriptions for PixelBot — pixel atmosphere particles.

Each entry: 6-14 words. One specific pixel atmospheric element.

━━━ CATEGORIES ━━━
- Pixel-rain (falling pixel-droplets)
- Pixel-snow (pixel-flakes drifting)
- Pixel-embers (orange-pixel-sparks rising)
- Pixel-fog (pixelated-haze drifting)
- Pixel-dust (pixel-motes in sunbeam)
- Pixel-fireflies (pixel-cluster of yellow-dots)
- Scanline-glow (CRT-feel overlay)
- Pixel-petals (drifting pixel-blossom)
- Pixel-leaves falling
- Pixel-magical-sparkle
- Pixel-steam rising
- Pixel-bubbles underwater
- Pixel-mist-curtain
- Pixel-dragon-smoke
- Pixel-lightning-arcs
- Pixel-butterflies drifting
- Pixel-pollen motes
- Pixel-sparkle-rain
- Pixel-blood-red ember-rain
- Pixel-glitter-motes
- Pixel-ice-crystals
- Pixel-rainbow-particles
- Pixel-aurora-wisp
- Pixel-starfall
- Pixel-heart-particles (cute)
- Pixel-soul-wisp
- Pixel-energy-arcs
- Pixel-sparks-from-fire
- Pixel-fog-low-lying
- Pixel-cherry-blossom-storm
- Pixel-sand-storm
- Pixel-ash-fall
- Pixel-dew-drops on flowers
- Pixel-sunbeam-dust
- Pixel-moth-cluster

━━━ RULES ━━━
- Pixel-art atmospheric elements
- Visual / renderable as pixels

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
