#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_atmosphere.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERIC/WEATHER descriptors for a kawaii cottagecore-nature scene. What's drifting/floating/falling through the AIR.

Each entry: 12-20 words. ONE specific atmospheric condition.

DO write:
- Dandelion seedheads drifting gently through the air in soft golden swirl
- Cherry-blossom petals raining down in soft pink drift
- Sun-warmed pollen dust catching warm afternoon light in golden shimmer
- Tiny butterflies drifting through the meadow in pastel flutter
- Honeybees floating between wildflowers in soft golden hum
- Soft summer-haze with floating sparkle-orbs catching warm light
- Apple-blossom petals drifting through warm light
- Lavender-pollen dust drifting in soft purple-tinged shimmer
- Tiny floating-fireflies drifting through warm cottagecore-air
- Pollen-dust catching afternoon shafts of light
- Fluffy seedheads of cottongrass drifting through warm summer air
- Soft mist-fog rising from a meadow in pearl-white wisps
- Pastel-rainbow soap-bubbles drifting from a children's wand
- Tiny rose-petal drift through warm garden-air
- Wildflower-pollen sparkle catching sunlight in golden shimmer
- Soft warm summer-breeze stirring grass blades and pollen
- Fluffy pussy-willow tufts drifting through soft breeze
- Tiny floating clover-leaves drifting through warm light
- Bramble-blossom petals raining down in pink-and-cream drift
- Soft glow of fairy-dust sparkle drifting through dappled light

DO NOT write:
- Storms / dark / scary weather
- Time-of-day mentions (separate axis)
- Lighting direction (separate axis)
- Ground / characters / setting

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
