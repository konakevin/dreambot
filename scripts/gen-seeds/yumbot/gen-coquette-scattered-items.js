#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_scattered_items.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CUTE GIRLY ACCESSORY items for a kawaii coquette food-party scene. These are SCATTERED DECOR items splashed into the scene alongside the foods — DIFFERENT from the prop-style signature pieces.

These are GIRLY ACCESSORIES: lipsticks, perfume bottles, hair-clips, mini bow-charms, pink hand-mirrors, pearl-chain bracelets, miniature ballet-flats, plushy teddy-bears, hair-ribbons, lip-gloss tubes, jewelry charms, perfume atomizers, makeup compacts, hand creams in pink jars, etc.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY.

Each entry: 8-16 words. ONE specific cute girly accessory.

DO write:
- A pastel-pink tube of lip-gloss with a tiny heart-charm on the cap
- A vintage pink-glass perfume atomizer with pearl-tassel
- A miniature pink ballet-slipper laid on its side
- A pink-pearl makeup compact open with a tiny mirror
- A small plushy pink teddy-bear with a satin-bow neck-tie
- A pink-pearl hair-clip with a butterfly motif
- A pink-rose-print silk hair-scrunchie
- A pearl-bead bracelet curled on the surface
- A miniature pink champagne-glass with a strawberry rim
- A pink-pearl-charm necklace draped artfully
- A vintage pink-and-cream lipstick tube
- A tiny pink hand-mirror with a heart-shaped handle
- A pink-tulle hair-bow on a velvet hair-clip
- A miniature ballerina figurine in pink-tutu
- A pearl-pink nail-polish bottle with floral label
- A pink-velvet jewelry-pouch tied with a pearl-ribbon
- A pink-pastel pillbox compact-mirror open
- A pink-rose handcream-jar with pearl-trim lid
- A miniature pink lace-trim parasol propped open
- A pearl-charm earring pair on a velvet display-stand

DO NOT write:
- Any colors outside pink / lavender / white / soft purple
- Modern electronics (phones, tablets)
- Foods (separate axis)
- Whole-scene descriptions
- Real text / labels — decorative-pattern only

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
