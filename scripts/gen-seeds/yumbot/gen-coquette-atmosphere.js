#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_atmosphere.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} ATMOSPHERIC descriptors for a kawaii coquette food-party scene. What's drifting / floating / sparkling through the AIR.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY.

Each entry: 12-20 words. ONE specific atmospheric condition.

DO write:
- Tiny pink heart-shaped confetti drifting through the air in soft swirl
- Pink-rose petals raining gently across the scene
- Pink-pearl orbs floating lazily through warm air
- Floating pink-pearl-charm sparkle hovering through the air
- Tiny pink-bow ribbons drifting through the warm air
- Pink-glitter sparkle drifting in dreamy shimmer
- Lavender-petal drift through warm pink-tinted air
- Tiny floating pink-lavender soap-bubbles drifting upward
- Pink-cherry-blossom petals raining gently down
- Floating pearl-orbs in dreamy bokeh through warm air
- Pink-pearl sparkle dust hovering in pearl shimmer
- Tiny pink heart-shaped bubble-orbs floating gently
- Pink-pastel confetti raining playfully across the tabletop
- Floating pink-ribbon-bows drifting through the warm air
- Lavender-petals drifting through soft pink mist
- Pink-pastel snowflakes drifting in dreamy fall
- Tiny floating pink-charm sparkles drifting through warm air
- Soft pink-cream haze with floating pearl-orbs catching warm light
- Pink-rose-petal cascade drifting across the scene
- Pink-feather-tuft drift through warm coquette air

DO NOT write:
- Any colors outside pink / lavender / white / soft purple
- Storms / dark / scary weather
- Time-of-day mentions (separate axis)
- Lighting direction (separate axis)
- Foods / characters / setting

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
