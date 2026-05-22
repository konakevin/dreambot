#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_companion.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} TINY KAWAII COMPANION accents for a kawaii coquette food-party scene. Each entry is ONE small peripheral cute creature or accent.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY.

Each entry: 10-18 words. ONE specific tiny accent.

DO write:
- A tiny kawaii pink-bunny with floppy ears wearing a pink satin bow
- A small pastel-pink butterfly with kawaii face and lavender-tipped wings
- A tiny kawaii heart-cat in pink-velvet fur
- A small kawaii pink-poodle with curly fur and pearl-collar
- A tiny smiling pearl-mouse with a heart-charm on its tail
- A small kawaii pink-flamingo with pearl-tipped feathers
- A tiny ballerina-fairy with pink-tutu and pearl-wand
- A small kawaii pink-hummingbird with lavender wings
- A tiny smiling pearl-fairy with pink-ribbon-trim wings
- A small kawaii pink-piglet with a satin-bow on its head
- A tiny smiling charm-fairy in pink-pearl dress
- A small kawaii lavender-butterfly with pink-pearl wings
- A tiny smiling sugar-mouse with a pink-bow on its head
- A small kawaii pink-kitten with pearl-string necklace
- A tiny smiling-heart-spirit with pink-pearl glow
- A small kawaii pink-lamb with curly white-fleece and bow
- A tiny floating pink-charm-fairy with pearl-wand
- A small kawaii pink-songbird with pearl-tipped wings
- A tiny smiling pearl-bunny with a pink-pearl-collar
- A small kawaii pink-pony with pearl-mane

DO NOT write:
- Any colors outside pink / lavender / white / soft purple
- Human characters / chibi-children
- Foods (separate axis)
- Modern objects

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
