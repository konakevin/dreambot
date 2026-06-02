#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunsets_accessory.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ROOFTOP-ACCESSORY entries — objects character is using/carrying ON the rooftop. Anchors them ENGAGED at the rooftop (not staring at vista).

Each 10-18 words. Object + use-detail.

VARIETY:
- 16% FOOD/DRINK (bento-box mid-eat / canned-coffee from vending / boba-cup mid-sip / ramen-cup mid-slurp / sandwich mid-bite)
- 14% PHONE/DEVICE (smartphone scrolling / earbuds in / camera mid-photo / sketching-tablet)
- 12% INSTRUMENT (acoustic guitar mid-strum / harmonica mid-blow / portable piano-keys / shamisen)
- 10% BOOK/PAPER (paperback novel / notebook + pen / sketchbook with charcoal / homework-binder)
- 10% TOOL-OF-TRADE (chef's tongs / paintbrush mid-stroke / camera-tripod / fishing-rod / knitting-needles)
- 8% PET (cat in lap / dog at side / bird-on-shoulder / kitten in arms)
- 6% PARTY-DRINK (cup-of-soda / red-cup / mug-of-beer / juice-box)
- 6% UMBRELLA-OR-FAN (uchiwa-fan mid-wave / paper-parasol / kite-string / umbrella-shaped lantern)
- 6% PLANT-CARE (watering-can mid-pour / pruning-shears / sapling-pot in hand / herb-bunch held)
- 6% WORK-DOC (clipboard / folder of papers / blueprint roll / printout-stack)
- 6% LIGHT-SOURCE (lantern in hand / sparkler mid-light / phone-flashlight / candle in jar)

DO write:
- Steaming canned-coffee held warm in both hands, faint lip-mark on rim
- Smartphone with scrolling pose, earbud in one ear, music-app visible
- Acoustic guitar held against chest mid-strum, fingers on E-chord
- Worn paperback novel open mid-page, finger marking spot, bookmark dangling
- Chef's tongs in hand mid-flip of skewer over rooftop-grill

DO NOT: weapons / dramatic / multiple per entry.

Object MUST anchor character ENGAGED at rooftop, not staring out.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
