#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_atmosphere.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} KITCHEN ATMOSPHERIC descriptors for a kawaii mini-chef scene. Each entry describes what's drifting/floating/rising through the AIR — kitchen-specific atmosphere.

Each entry: 12-20 words. ONE specific atmospheric condition.

DO write:
- Soft flour-dust drifting through the air catching warm window-light
- Soft steam curls rising from a bubbling pot in fluffy clouds
- Sprinkle-confetti drifting through the air in pastel-rainbow
- Warm baking aroma visible as soft golden-glow steam
- Sugar-glitter sparkle drifting in soft warm shimmer
- Tiny floating bubbles drifting up from a whisked bowl
- Soft soap-suds floating up from a sink in pearlescent orbs
- Cinnamon-dust sprinkle drifting through warm light
- Tiny floating-heart sparkles drifting through warm air
- Steam-cloud puffs rising from a kettle in soft white curls
- Bread-aroma swirls visible as warm-amber drift
- Soft cocoa-powder dust scattering through the air
- Floating pastel-rainbow confetti drifting in the kitchen breeze
- Tiny floating-music-notes drifting through warm kitchen-air
- Soft mist of butter-glaze rising from a pan
- Whisked egg-white peaks foaming over a bowl in soft cloud
- Floating sugar-snow drifting down softly across the counter
- Cherry-blossom petals drifting through an open kitchen window
- Soft warm steam curling up from a teapot spout
- Floating pearl-orbs drifting through warm kitchen-air

DO NOT write:
- Storms / dark / cold / scary weather
- Time-of-day mentions
- Lighting direction
- Ground / characters / setting

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
