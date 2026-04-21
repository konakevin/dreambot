#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} PIXEL LIGHTING descriptions for PixelBot — pixel-rendered lighting treatments.

Each entry: 10-20 words. One specific pixel lighting treatment.

━━━ CATEGORIES ━━━
- Torch-glow (warm pixel-amber from flame)
- Sunset-pixel (pink + orange pixel-horizon)
- Neon-pink (cyberpunk pink glow)
- Moonlit-blue (cool silver-pixel)
- Dragon-fire (orange + red dragon breath)
- CRT-scanline-overlay (classic CRT feel)
- Pixel god-rays (rays piercing clouds)
- Pixel twilight (deep-blue-to-amber gradient)
- Pixel dawn (soft pink-to-gold)
- Pixel fireplace (warm indoor orange)
- Pixel lantern-cluster (multi-warm)
- Pixel electric-arc (blue crackle)
- Pixel magical aura (soft rainbow glow)
- Pixel-crystal refraction (prismatic)
- Pixel sunset through trees (dappled amber)
- Pixel full-moon rising
- Pixel candle-single flicker
- Pixel storm with lightning
- Pixel aurora-borealis
- Pixel volcanic-red underglow
- Pixel underwater-blue light-rays
- Pixel strobe disco
- Pixel streetlamp alley
- Pixel ring-of-fire
- Pixel-stained-glass colored-rays
- Pixel-forest-filtered dappled
- Pixel-cave-torch-pool
- Pixel-starfield bright points
- Pixel-nebula glow-cloud
- Pixel-sunbeam-morning
- Pixel-spotlight-drama
- Pixel-bioluminescent-green
- Pixel-sunset-orange-sky
- Pixel-blue-hour-dusk
- Pixel-warm-hearth-interior
- Pixel-winter-soft-pale
- Pixel-magic-portal-glow
- Pixel-deep-sea-dark
- Pixel-golden-hour-warm
- Pixel-overcast-even-grey

━━━ RULES ━━━
- Pixel-art-rendered lighting
- Named specific effects

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
