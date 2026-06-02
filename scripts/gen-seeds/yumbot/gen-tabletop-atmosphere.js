#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_atmosphere.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERIC descriptors for a kawaii checkered-tabletop scene. What's drifting / floating / sparkling through the AIR around the tabletop.

Each entry: 12-20 words. ONE specific atmospheric condition.

DO write:
- Soft sparkle-dust drifting through the air catching warm light
- Tiny pastel-rainbow confetti drifting around the tabletop
- Soft floating heart-bokeh drifting above the scene
- Warm sugar-glitter sparkle hovering through the air
- Cherry-blossom petals drifting through the soft-focus background
- Pastel-pink bubble-orbs floating lazily through the scene
- Gentle pollen-dust catching warm window light
- Soft cinnamon-dust drift through warm tabletop air
- Tiny floating stars drifting at varied heights through the scene
- Sparkle-snow drifting gently across the tabletop
- Floating pastel-cream cream-puff-spores drifting through air
- Tiny floating ribbon-bows drifting through the scene
- Soft warm window-light catching dust motes in golden shafts
- Pastel-rainbow soap-bubbles drifting up softly through the air
- Tiny floating macaron-shells drifting playfully through air
- Soft confetti-petal-rain drifting across the tabletop
- Warm honey-glow steam curls rising from a teapot
- Tiny floating-fireflies in warm bokeh through the air
- Floating sugar-snowflake drift gently through the warm scene
- Sparkle-air-glow drifting across the tabletop in soft warm shimmer

DO NOT write:
- Storms / dark / scary weather
- Time-of-day mentions (separate axis)
- Lighting direction (separate axis)
- Foods / vessels / characters / setting

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
