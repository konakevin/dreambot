#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_signature.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ICONIC COQUETTE SIGNATURE PROPS for a kawaii coquette food-party scene. Each entry is ONE specific coquette prop — a hero accent that anchors the coquette aesthetic.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY.

Each entry: 10-18 words. ONE specific prop.

DO write:
- A large pink satin ribbon-bow with cascading streamers
- A string of pearl-beads draped across the surface
- A heart-shaped charm pendant on a delicate pink chain
- A vintage pink-and-white china teacup with gold-trim
- A round lace doily in cream-white under the centerpiece
- A pink-rose bouquet in a crystal vase wrapped with lavender ribbon
- A pink-pearl tiara nestled beside the cake
- A satin sash in pastel-pink tied in a bow
- A pearl-encrusted hand-mirror laid on its back
- A pink-feather plume in a crystal holder
- A vintage pink-floral teapot with gold accents
- A lavender silk-fan partially unfurled
- A pearl-pendant earring pair on a velvet display
- A pink crystal-glass champagne flute with sugar-rim
- A heart-shaped jewelry box in pink-velvet open with pearls inside
- A vintage pink-pearl music-box with a tiny ballerina figurine
- A satin pink-bow choker laid beside the cake
- A pink-tulle ribbon-rosette in three-dimensional bloom
- A vintage cream-and-pink cake-stand with scalloped lace edge
- A pearl-chain bracelet draped artfully across the cloth

DO NOT write:
- Any colors outside pink / lavender / white / soft purple
- Modern objects (phones, electronics, plastic)
- Foods (separate axis)
- Whole-scene descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
