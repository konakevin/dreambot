#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_companion.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} TINY COTTAGECORE COMPANION accents for a kawaii cottagecore-nature scene. Each entry is ONE small peripheral cute creature near the foods.

Each entry: 10-18 words. ONE specific tiny accent.

DO write:
- A tiny kawaii bunny with floppy ears peeking from behind a tuft of grass
- A small smiling honeybee hovering with a kawaii face
- A tiny pastel-blue songbird perched on a twig
- A small kawaii ladybug nestled on a flower petal
- A tiny smiling field-mouse with a tiny acorn-hat
- A small pastel-yellow butterfly with kawaii face
- A tiny smiling snail with a flower-painted shell
- A small kawaii hedgehog with apple-leaf nestled in its spines
- A tiny smiling squirrel holding a hazelnut
- A small pastel-pink dragonfly hovering at eye-level
- A tiny smiling acorn with a kawaii face peeking from the moss
- A small kawaii frog with a tiny lily-pad hat
- A tiny smiling fawn peeking from behind a fern
- A small kawaii cottage-cat curled at the foods' feet
- A tiny smiling baby-chick with a soft yellow fluff
- A small pastel-lavender moth with kawaii face
- A tiny smiling toad sitting on a mossy stone
- A small kawaii sheep with curly wool peeking nearby
- A tiny smiling spider in a perfectly-dewed web
- A small pastel-pink piglet with a clover in its mouth

DO NOT write:
- Human characters / chibi-children
- Foods (separate axis)
- Modern objects
- Large landscape elements

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
