#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_companion.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} TINY KAWAII COMPANION accents for a kawaii Japanese koi-pond scene. Each entry is ONE small peripheral cute creature or accent near the pond — DIFFERENT from the main pond-creature cast.

Each entry: 10-18 words. ONE specific tiny accent.

DO write:
- A tiny smiling pink dragonfly hovering above the pond with kawaii face
- A small kawaii origami-crane perched on a stepping-stone
- A tiny pastel-blue butterfly with kawaii face floating above water
- A small kawaii bamboo-spirit with floppy ears peeking from grass
- A tiny smiling firefly with a glowing kawaii face
- A small kawaii pink-bird perched on a wisteria branch above
- A tiny smiling lily-pad with a kawaii face floating beside the others
- A small kawaii sparrow with pearl-tipped wings perched nearby
- A tiny smiling raindrop with kawaii face hanging from a leaf
- A small kawaii moth with pastel-rainbow wings hovering
- A tiny smiling water-droplet sprite with kawaii face on the pond surface
- A small kawaii cherry-blossom petal with a smiling face drifting past
- A tiny smiling-cloud-spirit drifting low near the water
- A small kawaii tanuki-figurine sitting at the pond's edge
- A tiny smiling-lotus-bud creature curled at the edge of a lily-pad
- A small kawaii frog-fairy with pearl-wand perched on a stone
- A tiny smiling paper-lantern-orb with kawaii face floating up
- A small kawaii crane figurine with a smiling face
- A tiny smiling-koi-baby with kawaii face peeking from a lily-pad
- A small kawaii pastel-snake spirit gently swimming through water

DO NOT write:
- Human characters / chibi-children
- Main cast creatures (separate axis — those are the 5 main koi/blob/axolotl)
- Modern objects
- Large landscape elements
- Scary / aggressive creatures

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
