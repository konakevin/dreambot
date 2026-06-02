#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_weather.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERIC/WEATHER descriptors for a kawaii Japanese matsuri scene. Each entry describes what's drifting/floating/falling through the AIR.

Each entry: 12-20 words. ONE specific atmospheric condition.

DO write:
- Sakura cherry-blossom petals drifting gently through the air in pink swirl
- Autumn maple-leaves swirling in gold-and-crimson drift
- Soft summer-haze with floating sparkle-orbs catching warm light
- Drifting paper-confetti scattered through the air in pastel-rainbow
- Glowing fireflies floating in soft warm cloud through the air
- Pop-rocks-style sparkler-spray crackling in jewel-tones overhead
- Calm clear matsuri-air with gentle sugar-glitter sparkle drifting softly
- Soft mist-fog drifting low between the wooden architecture
- Floating glowing-paper-lantern petals drifting upward
- Pastel-pink sakura-petal cascade dense across the scene
- Iridescent shimmer in the air catching rainbow refractions
- Gentle warm breeze stirring streamers and paper-flag bunting
- Floating wishing-paper tags fluttering through the air
- Drifting cotton-candy mist hanging low between the foods
- Bubbles of festival-glow floating through the air
- Light sparkler-rain in warm gold drifting down
- Tiny floating paper-doll wind-streamers spinning through air
- Soft warm dust-haze catching shafts of lantern-light
- Festival-snow of pastel-rainbow confetti drifting down
- Floating glowing pearl-orbs at varied heights through the scene

DO NOT write:
- Storms / dark weather / rain / thunder
- Time-of-day mentions (separate axis)
- Lighting direction (separate axis)
- Ground / characters / setting

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
