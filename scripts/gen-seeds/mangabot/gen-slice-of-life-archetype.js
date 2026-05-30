#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_archetype.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SLICE-OF-LIFE ARCHETYPE entries — everyday character roles in K-On / Tamako Market / Aria / Mushishi / Aggretsuko / Yotsuba / Hyouka tradition.

Each entry: 12-22 words. Role + everyday-domain + tone + signature visual.

VARIETY:
- 16% STUDENT (high-schooler walking home / cram-school student / college kid / club-member / library-studier)
- 14% OFFICE-WORKER (tired salaryman / OL with bento / web-developer at desk / startup employee / overtime engineer)
- 12% FOOD-WORKER (cafe barista / izakaya server / convenience-store clerk / ramen-shop cook / boba-shop staff)
- 10% RETIREE (grandmother knitting / grandfather fishing / old neighbor tending plants / community elder)
- 8% YOUNG-PARENT (mom with stroller / dad with toddler / new-parent at park / school-pickup parent)
- 8% TRADESPERSON (carpenter / fishmonger / bookstore-owner / florist / postal worker / mechanic)
- 8% ARTIST (mangaka at desk / animator / illustrator / musician / busker)
- 6% ATHLETE-CASUAL (jogger / cyclist commuter / yoga-class / skateboarder / surfer)
- 6% TRAVELER (backpacker on trains / commuter on platform / weekend hiker / festival-goer)
- 6% PET-OWNER (dog-walker / cat-cafe regular / aquarium-tender / bird-watcher)
- 6% TWEEN/CHILD (younger sibling drawing / kid playing in park / tween-on-bike)

DO write:
- High-school student walking home with bag slung, slight smile, register: shy bookish
- Tired salaryman with loosened tie after late shift, register: weary content
- Cafe barista mid-pour with focused half-smile, register: serene craftsperson
- Mangaka at desk with manuscript spread, register: focused-creative
- Grandmother knitting on engawa porch with cat at feet, register: peaceful warm

DO NOT: dramatic/heroic roles (those go to other paths) / combat-coded / magical-coded / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
