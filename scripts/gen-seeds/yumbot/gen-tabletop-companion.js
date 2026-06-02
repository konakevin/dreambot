#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_companion.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} TINY KAWAII COMPANION accents for a kawaii checkered-tabletop scene. Each entry is ONE small peripheral kawaii creature or accent near the tabletop.

Each entry: 10-18 words. ONE specific tiny accent.

DO write:
- A tiny smiling sugar-mouse with a heart-shaped nose nestled near the vessel
- A small pastel-pink butterfly with kawaii face floating above
- A tiny kawaii honeybee with a smiling face hovering nearby
- A small kawaii ladybug with kawaii face perched on the cloth
- A tiny floating kawaii cloud-spirit with smiling face
- A small kawaii sparrow with a tiny ribbon-bow perched on the edge
- A tiny smiling-strawberry with kawaii face peeking out
- A small kawaii pastel-blue mochi-spirit floating in mid-air
- A tiny kawaii hummingbird with rainbow wings hovering
- A small kawaii bunny with floppy ears peeking from behind
- A tiny floating heart-spirit with kawaii face
- A small kawaii origami-crane perched on the tabletop
- A tiny pastel-yellow chick with kawaii face standing nearby
- A small kawaii cupcake-fairy with paper-wings hovering
- A tiny floating-firefly with a glowing kawaii face
- A small smiling teddy-bear figurine in pastel-cream
- A tiny kawaii kitten with pastel-pink fur curled at the edge
- A small kawaii smiling cloud puff drifting gently
- A tiny pastel-lavender moth with kawaii face floating
- A small kawaii heart-balloon with kawaii face floating up

DO NOT write:
- Human characters / chibi-children
- Foods that should be in food_inhabitants
- Modern objects
- Large landscape / backdrop elements

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
