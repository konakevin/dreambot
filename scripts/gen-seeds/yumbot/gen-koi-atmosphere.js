#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_atmosphere.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} ATMOSPHERIC descriptors for a kawaii Japanese koi-pond scene. What's drifting / floating through the AIR.

Each entry: 12-20 words. ONE specific atmospheric condition.

DO write:
- Cherry-blossom petals drifting gently in pink swirl across the pond
- Glowing fireflies floating in warm cloud above the pond
- Wisteria petals raining gently in lavender drift
- Soft mist hovering low across the pond surface
- Floating paper-lantern orbs drifting upward like fireflies
- Sparkle-dust catching warm lantern-light in golden shimmer
- Drifting bamboo-leaves spinning gently through warm air
- Tiny floating-heart sparkles drifting around the creatures
- Soft snowfall of cherry-blossom petals raining down
- Glowing dragonflies hovering with kawaii faces through the scene
- Sparkle-pollen drift from wisteria-blooms catching the light
- Drifting lotus-petals raining gently from above
- Floating paper-cranes drifting through the air on invisible breeze
- Tiny floating origami-butterflies fluttering through the scene
- Soft pastel-rainbow sparkle catching twilight-light in iridescent drift
- Magical-glow orbs floating across the pond in dreamy bokeh
- Drifting maple-leaves spinning in pastel-pink and lavender
- Floating-wish-tags fluttering on invisible breeze through air
- Soft warm sparkle-haze hovering above the pond surface
- Tiny floating-stars drifting through the air at varied heights

DO NOT write:
- Storms / dark / scary weather
- Time-of-day mentions (separate axis)
- Lighting direction (separate axis)
- Ground / pond surface / characters / setting

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
