#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SLICE-OF-LIFE SETTING entries — everyday Tokyo/Japan contexts where character is engaged. Anti-back-to-camera.

Each entry: 14-22 words. Setting + tactile everyday-foreground + midground depth + engagement-context.

VARIETY:
- 16% CONVENIENCE-STORE/CAFE (konbini interior late-night with shelves close / cafe-corner-booth with magazines / boba-shop window-counter / coffee-shop with latte-art)
- 14% TRANSIT (train-platform with vending-machine close / inside subway-car / station-bench with sliding doors / bicycle-along-canal path)
- 14% APARTMENT-INTERIOR (kotatsu-room with manga spilled / kitchen-counter with cooking-mid / small bedroom desk / engawa-porch with sliding-door)
- 12% SCHOOL-CAMPUS (classroom-desk with chalk / library-nook with stacks / club-room with snacks / hallway-locker with shoes)
- 10% RAINY-TOKYO (umbrella-shelter at bus-stop / convenience-store doorway / cafe-window with rain-streaks / underpass with puddles)
- 8% PARK/GARDEN-CASUAL (cherry-blossom park-bench / community garden with herbs / playground swing / riverside path with grass)
- 8% MARKET/SHOP (fish-market stall / vegetable-stand close-up / tatami-shop with weaving / bookstore-aisle with stacks)
- 6% CRAFTSPERSON-WORKSHOP (carpenter's bench with sawdust / pottery-wheel with clay / sewing-room with bolts / kitchen-station with knives)
- 6% PUBLIC-BATH/ONSEN (sento-bathhouse with wooden ledge / onsen-rim with steam / changing-room with lockers)
- 6% NATURE-CASUAL (riverside fishing-spot / mountain-trail rest-stop / beach-promenade walk / quiet shrine-grounds)

DO write:
- Konbini late-night with magazine-rack close foreground, fluorescent-light glow, snack-shelves receding — she stands AT register paying
- Train-platform at dusk with vending-machine glow close foreground, station-clock midground, departing train deep — he stands BY machine mid-glance-at-phone
- Apartment kotatsu-room with manga + tea-cup close foreground, sliding-shoji receding, evening light beyond — she sits AT kotatsu mid-read
- Cafe corner-booth with latte-art close on table, lattice-window midground, street-lamps beyond — they sit FACING camera mid-sip

DO NOT: "standing at window looking out at Tokyo" — back-to-camera trap. Photoreal cinematography.

Every setting affords ENGAGED-WITH-EVERYDAY-AT-HAND.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
