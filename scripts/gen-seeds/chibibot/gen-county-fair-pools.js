#!/usr/bin/env node
/**
 * ChibiBot creature-county-fair — bespoke axis pools (2026-06-28).
 *
 * Generates the 4 county-fair-bespoke pools for the creature-county-fair
 * path (creature band + lighting/atmosphere come from shared pools):
 *   activity        — creature-agnostic group fair-game/ride verb-phrases
 *   setting_detail  — concrete fair elements that build the place
 *   prop            — small charms a creature holds/wears
 *   surprise_element— tucked-away background details
 *
 * MVP sizes here; bump the totals and re-run (append) to scale. Run:
 *   node scripts/gen-seeds/chibibot/gen-county-fair-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) ACTIVITY — what the band of friends is doing at a fair game/ride.
  await generatePool({
    outPath: DIR + 'chibibot_county_fair_activity.json',
    total: 50,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} ACTIVITY phrases for ChibiBot's creature-county-fair path — what a little band of chibi creature FRIENDS is doing TOGETHER at a sunny DAYTIME county fair, focused on game booths, midway rides, and prizes. The specific animals come from a SEPARATE axis, so do NOT name any species — use "they / their / the friends" for the group.

Each entry: 12-22 words, an ACTIVE group verb-phrase (mid-action, joyful), naming the SPECIFIC fair game or ride so the place reads.

Distribute roughly evenly across these games/rides: riding a Ferris-wheel gondola, tossing rings at a ring-toss booth, knocking down a stack of milk bottles, swinging the mallet at a high-striker bell game, riding a painted carousel, throwing darts at a balloon-pop booth, the duck-pond fishing game, hauling a giant won plush prize, a gentle hayride on a straw wagon, riding the bumper cars, the swing-chair carousel, gently petting a friendly fair animal at the pen.

Examples (mirror register — NO species named):
"leaning together in a Ferris-wheel gondola, tiny paws on the rail as the wheel lifts them up over the fairground"
"tossing wooden rings at a ring-toss booth, one ring sailing perfectly onto a bottleneck while the friends cheer"
"swinging a wooden mallet at the high-striker bell game, all eyes up as the puck rockets toward the bell"
"hauling an enormous won plush prize between them, four little paws gripping it, grinning at their lucky win"
"hand-feeding a friendly fair animal through the pen rail, holding out a tuft of hay with gentle wonder"

HARD BANS: NO species names, NO humans, NO food characters, NO mood/lighting/palette words, NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 2) SETTING DETAIL — concrete fair elements (pickN:3 in the template).
  await generatePool({
    outPath: DIR + 'chibibot_county_fair_detail.json',
    total: 35,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SETTING DETAILS for ChibiBot's creature-county-fair path — concrete county-fair elements that build the PLACE in the midground/background (the template stacks THREE per render for a lived-in fair).

Each entry: 6-14 words, a single readable fair element. NO characters as the focus. Any distant figures must be explicitly tiny chibi ANIMALS, never people.

Examples:
"a sunny midway lined with red-and-white striped game booths"
"a tall Ferris wheel turning against a blue sky"
"rows of plush prizes dangling from a booth"
"bunting and pennant flags strung overhead"
"a red barn and hay bales at the fairground edge"
"a painted carousel spinning slowly at the end of the lane"
"a few tiny chibi-animal fairgoers browsing a distant booth"

HARD BANS: NO humans or people anywhere (any background figures are tiny chibi animals), NO food characters, NO mood/lighting/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) PROP — small charm a creature holds/wears.
  await generatePool({
    outPath: DIR + 'chibibot_county_fair_prop.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} small PROP charms for ChibiBot's creature-county-fair path — a little object one of the chibi creature friends holds or wears.

Each entry: 4-10 words, a single cute county-fair charm.

Examples:
"a giant plush prize hugged tight"
"a strip of game tickets"
"a colorful spinning pinwheel"
"a balloon animal on a string"
"a little prize ribbon"
"a tiny stuffed bear"
"a bag of kettle corn"
"a small paper bag of fair winnings"

HARD BANS: NO humans, NO weapons, NO food characters (kettle corn as a held prop is fine, never a food CHARACTER). Keep it wholesome and tiny. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) SURPRISE — tucked-away background detail.
  await generatePool({
    outPath: DIR + 'chibibot_county_fair_surprise.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background details for ChibiBot's creature-county-fair path — a tiny tucked-away delightful detail in the midground/background of a sunny daytime county fair.

Each entry: 6-14 words, one wholesome surprise.

Examples:
"a runaway balloon drifting over the Ferris wheel"
"a tiny duck bobbing in the pond-game trough"
"a prize ribbon pinned to a booth post"
"a string of fairy lights just flickering on"
"a little bird perched on a striped booth awning"
"a forgotten plush toy sitting on a hay bale"
"a chibi creature peeking out from behind a game booth"

HARD BANS: NO humans, NO food characters, NO scary/sad imagery. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 county-fair pools generated.');
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
