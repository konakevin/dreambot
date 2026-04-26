#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_pretty_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PIXEL PRETTY SCENE descriptions for PixelBot's pixel-pretty path — pure pretty scenes in pixel art. NO genre, NO characters, NO action. Just beauty. Flagship-quality.

Each entry: 15-30 words. One specific pretty scene in pixel-art medium.

━━━ CATEGORIES ━━━
- Cherry-blossom path with petals drifting
- Snow-mountain vista at dawn
- Coastal lighthouse at sunset
- Lavender field under pastel sky
- Forest stream with moss-stones
- Tropical beach with palm silhouettes
- Koi pond with lily-pads
- Aurora lake reflection
- Nebula sky over mountain silhouette
- Firefly meadow at dusk
- Cherry-blossom grove at night
- Autumn forest path with fallen leaves
- Waterfall with rainbow-mist
- Rice-paddy terraced landscape
- Desert canyon at sunset
- Bamboo forest with sun-beams
- Misty valley at dawn
- Starfield over still lake
- Rose-garden archway
- Snow-pine forest at twilight
- Ocean cliffs with crashing waves
- Meadow of wildflowers
- Mountain pass through clouds
- Glowing-mushroom grove at night
- Willow-draped riverbank
- Alpine lake with reflection
- Sunset-palm oasis
- Moonlit desert dunes
- Ice-caves with sparkle
- Tropical island at golden hour
- Iceberg in polar twilight
- Sunflower field at summer
- Autumn maple grove peak-color
- Misty rainforest canopy
- Rice field with fireflies
- Seaside village twilight (no figures)
- Snow-covered pine-cone close-up
- Cherry-bloom cave entrance
- Mountain-top observatory at dawn
- Glowing jellyfish at sea
- Sakura-petal waterfall
- Aurora-lit arctic tundra
- Crystal-cave with glimmering light
- Magnolia garden in moonlight
- Foggy-bamboo clearing

━━━ RULES ━━━
- Pure beauty — no characters, no action
- Pixel-art medium IS the hero
- Serene / atmospheric / gallery-quality

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
