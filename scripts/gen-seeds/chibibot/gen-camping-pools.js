#!/usr/bin/env node
/**
 * ChibiBot creature-camping — bespoke axis pools (2026-06-28).
 *
 * Generates the 4 camping-bespoke pools for the creature-camping
 * path (creature band + lighting/atmosphere come from shared pools):
 *   activity        — creature-agnostic group camping verb-phrases
 *   setting_detail  — concrete campsite/woodland elements that build the place
 *   prop            — small camping charms a creature holds/wears
 *   surprise_element— tucked-away background details
 *
 * MVP sizes here; bump the totals and re-run (append) to scale. Run:
 *   node scripts/gen-seeds/chibibot/gen-camping-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) ACTIVITY — what the band of friends is doing while camping in the woods.
  await generatePool({
    outPath: DIR + 'chibibot_camping_activity.json',
    total: 50,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} ACTIVITY phrases for ChibiBot's creature-camping path — what a little band of chibi creature FRIENDS is doing TOGETHER while camping out in the woods. The specific animals come from a SEPARATE axis, so do NOT name any species — use "they / their / the friends" for the group.

Each entry: 12-22 words, an ACTIVE group verb-phrase (mid-action, joyful), naming the SPECIFIC camping activity so the place reads.

Distribute roughly evenly across these activities: roasting marshmallows over the campfire, raising/pitching a tent together, paddling a canoe across a misty lake, fishing from a wooden dock, hiking a forest trail with little backpacks, lying back stargazing on a blanket, telling stories around a lantern, gathering firewood, crossing a log bridge over a creek, lounging in a strung hammock, peering through binoculars at wildlife, making s'mores by the fire.

Examples (mirror register — NO species named):
"huddled around the crackling campfire, each holding a toasting stick out toward the flames, marshmallows browning"
"all heaving on the tent poles together, raising the canvas tent among the tall pines, paws working as a team"
"paddling a little wooden canoe across the misty lake, oars dipping in unison as the water ripples behind them"
"lying back on a checkered blanket, paws behind their heads, gazing up at the wide starry sky together"
"strung out along a forest trail with tiny backpacks, climbing a mossy path single-file between the trees"

HARD BANS: NO species names, NO humans, NO food characters, NO mood/lighting/palette words, NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 2) SETTING DETAIL — concrete campsite/woodland elements (pickN:3 in the template).
  await generatePool({
    outPath: DIR + 'chibibot_camping_detail.json',
    total: 35,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SETTING DETAILS for ChibiBot's creature-camping path — concrete campsite and woodland elements that build the PLACE in the midground/background (the template stacks THREE per render for a lived-in campsite).

Each entry: 6-14 words, a single readable campsite or forest element. NO characters as the focus. Any distant figures must be explicitly tiny chibi ANIMALS, never people.

Examples:
"a glowing canvas tent pitched among tall pines"
"a crackling campfire ringed with smooth stones"
"a misty pine-rimmed lake at the treeline"
"a wooden trail signpost on a mossy path"
"string lights draped between two tree trunks"
"a little wooden canoe pulled up on the shore"
"a few tiny chibi-animal campers tending a distant fire"

HARD BANS: NO humans or people anywhere (any background figures are tiny chibi animals), NO food characters, NO mood/lighting/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) PROP — small charm a creature holds/wears.
  await generatePool({
    outPath: DIR + 'chibibot_camping_prop.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} small PROP charms for ChibiBot's creature-camping path — a little camping object one of the chibi creature friends holds or wears.

Each entry: 4-10 words, a single cute camping charm.

Examples:
"a tiny lit lantern"
"a little rolled sleeping bag on its back"
"a toasting stick over the fire"
"a small fishing rod"
"a tiny compass on a string"
"a mini backpack"
"a flashlight clutched in a paw"
"a folded paper trail map"

HARD BANS: NO humans, NO weapons. Keep it wholesome and tiny. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) SURPRISE — tucked-away background detail.
  await generatePool({
    outPath: DIR + 'chibibot_camping_surprise.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background details for ChibiBot's creature-camping path — a tiny tucked-away delightful detail in the midground/background of a woodland campsite.

Each entry: 6-14 words, one wholesome surprise.

Examples:
"fireflies blinking in the dark trees"
"a curious owl watching from a high branch"
"a shooting star streaking across the night sky"
"a little frog perched on a lakeside rock"
"a raccoon peeking out from behind a tent flap"
"a trail of glowing mushrooms along a fallen log"
"a tiny chibi creature waving from a treehouse window"

HARD BANS: NO humans, NO scary/sad imagery. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 camping pools generated.');
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
