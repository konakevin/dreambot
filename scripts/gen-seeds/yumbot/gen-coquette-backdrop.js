#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_backdrop.json',
  total: 100,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} ultra-coquette SURROUNDING SETTING BACKDROP descriptions for a kawaii coquette food-party scene. Each entry is the SURROUNDING coquette setting that frames the foreground.

Palette LOCKED: pinks (blush, dusty-rose, bubblegum, coral-pink) + lavenders + whites + soft purples (lilac, mauve, periwinkle) ONLY. NO yellows, blues outside soft-purple, greens, oranges, reds, browns, blacks, neons.

Each entry: 18-30 words. ONE specific coquette setting. Atmospheric.

DO write:
- A pink boudoir with satin-canopy bed, pink-rose wallpaper, vintage vanity mirror with lavender silk curtains
- A Marie-Antoinette-style pink salon with rococo gilded mirrors, lavender silk wallpaper, pink chandelier
- A ballerina dressing-room with pink tulle costumes hanging, lavender powder puffs, pearl-string mirrors
- A coquette bakery interior with pink macaron-tower displays, lavender lace curtains, pearl-pendant lights
- A pink rose garden patio with white-painted iron furniture, lavender wisteria draping, pearl-glass lanterns
- A vintage tea-parlor with pink-floral wallpaper, lace doilies, lavender velvet chairs
- A pink princess-style vanity nook with mirror, pearl-jewelry stand, lavender silk runner
- A coquette cafe corner with pink-marble counter, lavender-rose bouquets, pearl-strung chandelier
- A pink-tulle ballroom with chiffon drapes, lavender ribbon-bunting, pearl-crystal chandelier overhead
- A pink dollhouse interior with miniature-furniture, lavender wallpaper, pearl-trim accents
- A vintage Victorian sitting-room in pink-and-lavender, with lace antimacassars and pearl-frame photos
- A coquette boudoir nook with pink-canopy daybed, lavender-pillow cluster, pearl-charm-curtains
- A pink-marble patisserie counter with lavender cake-display domes, pearl-charm shelf-edging
- A coquette garden gazebo with white-lattice frame, pink-rose climbing vines, lavender bunting
- A Parisian pink-pastel boutique window with lavender-ribbon racks, pearl-string ceiling
- A pink-cream Regency-era parlor with lavender-toile wallpaper, pearl-trimmed silk-pillows
- A coquette balcony with pink-rose climbing vines, white-iron railings, lavender silk-tassel pull-curtains
- A pink princess-room dressing-corner with vanity, lavender perfume bottles, pearl-charm-chain decor
- A vintage pink-rose tea-room with lavender lace tablecloths, pearl-string chandelier overhead
- A pink-cream cottage parlor with lavender-floral wallpaper, pearl-frame mirrors, satin-bow valances

DO NOT write:
- Foreground characters / foods (separate axis)
- Modern industrial / mall / commercial / dark scenes
- Any colors outside pink / lavender / white / soft purple
- Real text / kanji / labels
- Pathway / lane RECEDING into vanishing point — keep clustered/wide

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
