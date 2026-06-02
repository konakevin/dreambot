#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_companion.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} TINY MATSURI COMPANION elements for a kawaii Japanese festival scene. Each entry is ONE small peripheral cute creature or accent that hovers/sits near the foods — NOT the hero, just a tiny accent.

Each entry: 10-18 words. ONE specific tiny accent.

DO write:
- A tiny smiling goldfish wagging its tail nearby
- A small kawaii origami paper-crane perched on a wooden post
- A tiny floating paper-lantern firefly with a glowing kawaii face
- A small kawaii daruma-doll figurine
- A tiny kawaii maneki-neko (lucky cat) waving a paw
- A small kawaii tanuki-statue with smiling face
- A tiny kawaii koi-fish swimming in a small bowl
- A small kawaii kitsune-fox-mask hanging from a peg
- A tiny kawaii origami-frog perched on a stone
- A small kawaii cherry-blossom-pixie with paper wings
- A tiny kawaii teru-teru-bozu rain-doll hanging from a string
- A small kawaii furin wind-bell with smiling face
- A tiny kawaii uchiwa hand-fan with kawaii face printed
- A small kawaii kappa-water-spirit peeking from behind a lantern
- A tiny kawaii butterfly with paper-thin pastel wings
- A small kawaii baby-mochi rolling beside the foods
- A tiny kawaii red-vermilion-tassel decoration hanging
- A small kawaii smiling cloud-spirit drifting nearby
- A tiny kawaii smiling-rice-grain bunch
- A small kawaii smiling-lantern-with-tiny-feet walking past

DO NOT write:
- Human characters / chibi figures
- Foods (those are in food_inhabitants)
- Modern objects
- Large landscape elements

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
