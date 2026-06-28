#!/usr/bin/env node
/**
 * ChibiBot creature-beach-day — bespoke axis pools (2026-06-28).
 *
 * Generates the 4 beach-day-bespoke pools for the creature-beach-day
 * path (creature band + lighting/atmosphere come from shared pools):
 *   activity        — creature-agnostic group beach verb-phrases
 *   setting_detail  — concrete beach elements that build the place
 *   prop            — small charms a creature holds/wears
 *   surprise_element— tucked-away background details
 *
 * MVP sizes here; bump the totals and re-run (append) to scale. Run:
 *   node scripts/gen-seeds/chibibot/gen-beach-day-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) ACTIVITY — what the band of friends is doing out at the beach.
  await generatePool({
    outPath: DIR + 'chibibot_beach_day_activity.json',
    total: 50,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} ACTIVITY phrases for ChibiBot's creature-beach-day path — what a little band of chibi creature FRIENDS is doing TOGETHER at a real-world beach. The specific animals come from a SEPARATE axis, so do NOT name any species — use "they / their / the friends" for the group.

Each entry: 12-22 words, an ACTIVE group verb-phrase (mid-action, joyful), naming the SPECIFIC beach activity so the place reads.

Distribute roughly evenly across these activities: building a sandcastle, surfing a wave, beach volleyball over a net, floating on an inner tube in the shallows, snorkeling in a tide pool, chasing/fleeing the foamy waves, digging a big sand hole, flying a kite on the shore, paddleboarding, collecting seashells in a bucket, burying a friend up to the neck in sand, boogie-boarding a small wave.

Examples (mirror register — NO species named):
"patting the last turret onto a tall sandcastle together, tiny paws smoothing the damp golden walls"
"riding the crest of a curling wave on a little surfboard, arms flung wide for balance"
"leaping over the net for a beach-volleyball spike, sand kicking up around their happy paws"
"bobbing together on a striped inner tube in the gentle shallows, paddling with their feet"
"shrieking and scampering back up the sand as a foamy wave chases their little heels"

HARD BANS: NO species names, NO humans or people anywhere (background figures are tiny chibi animals), NO food characters, NO mood/lighting/palette words, NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 2) SETTING DETAIL — concrete beach elements (pickN:3 in the template).
  await generatePool({
    outPath: DIR + 'chibibot_beach_day_detail.json',
    total: 35,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SETTING DETAILS for ChibiBot's creature-beach-day path — concrete beach elements that build the PLACE in the midground/background (the template stacks THREE per render for a lived-in beach).

Each entry: 6-14 words, a single readable beach element. NO characters as the focus. Any distant figures must be explicitly tiny chibi ANIMALS, never people.

Examples:
"a row of striped beach umbrellas planted in golden sand"
"gentle turquoise waves rolling onto the shore"
"a sandy boardwalk with little flag-topped huts"
"circling seagulls over a distant pier"
"a lifeguard tower on the dune"
"a scattering of colorful towels spread across the sand"
"a few tiny chibi-animal beachgoers paddling in the distant shallows"

HARD BANS: NO humans or people anywhere (any background figures are tiny chibi animals), NO food characters, NO mood/lighting/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) PROP — small charm a creature holds/wears.
  await generatePool({
    outPath: DIR + 'chibibot_beach_day_prop.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} small PROP charms for ChibiBot's creature-beach-day path — a little object one of the chibi creature friends holds or wears.

Each entry: 4-10 words, a single cute beach charm.

Examples:
"a tiny bucket and spade"
"round swim goggles"
"a beach ball under one arm"
"a floppy sun hat"
"a seashell pressed to one ear"
"tiny heart sunglasses"
"an inflatable arm-ring"
"a little snorkel and mask"

HARD BANS: NO humans, NO weapons. Keep it wholesome and tiny. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) SURPRISE — tucked-away background detail.
  await generatePool({
    outPath: DIR + 'chibibot_beach_day_surprise.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background details for ChibiBot's creature-beach-day path — a tiny tucked-away delightful detail in the midground/background of a beach.

Each entry: 6-14 words, one wholesome surprise.

Examples:
"a tiny crab scuttling across the foreground sand"
"a message in a bottle half-buried at the waterline"
"a sandcastle flag fluttering in the breeze"
"a beach ball bouncing away down the shore"
"a little starfish resting in a shallow tide pool"
"a trail of tiny paw-prints leading down to the water"
"a chibi creature peeking out from behind a beach umbrella"

HARD BANS: NO humans, NO scary/sad imagery. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 beach-day pools generated.');
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
