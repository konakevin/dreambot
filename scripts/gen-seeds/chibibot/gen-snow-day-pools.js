#!/usr/bin/env node
/**
 * ChibiBot creature-snow-day — bespoke axis pools (2026-06-28).
 *
 * Generates the 4 snow-day-bespoke pools for the creature-snow-day
 * path (creature band + lighting/atmosphere come from shared pools):
 *   activity        — creature-agnostic group snow-play verb-phrases
 *   setting_detail  — concrete winter elements that build the place
 *   prop            — small winter charms a creature holds/wears
 *   surprise_element— tucked-away background snow details
 *
 * MVP sizes here; bump the totals and re-run (append) to scale. Run:
 *   node scripts/gen-seeds/chibibot/gen-snow-day-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) ACTIVITY — what the band of friends is doing in the snow.
  await generatePool({
    outPath: DIR + 'chibibot_snow_day_activity.json',
    total: 50,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} ACTIVITY phrases for ChibiBot's creature-snow-day path — what a little band of chibi creature FRIENDS is doing TOGETHER playing in the snow. The specific animals come from a SEPARATE axis, so do NOT name any species — use "they / their / the friends" for the group.

Each entry: 12-22 words, an ACTIVE group verb-phrase (mid-action, joyful), naming the SPECIFIC snow activity so the play reads.

Distribute roughly evenly across these activities: sledding down a snowy hill, skiing a slope, snowboarding off a little jump, building a snowman together, a snowball fight from behind a snow fort, ice skating on a frozen pond, making snow angels, sliding down on a round saucer, packing a snow fort wall, catching snowflakes on tongues, snow-tubing down a run, a wobbly chain of skaters holding paws.

Examples (mirror register — NO species named):
"whooping with joy as their wooden sled rockets down a steep snowy hill, paws flung up and scarves streaming"
"crouched behind a lumpy snow fort, all winding up to lob fat snowballs across the white yard"
"wobbling in a long chain across a frozen pond, holding paws so nobody tips over on the ice"
"piling and patting the last big snowball onto a snowman together, reaching up on tiptoe to set its head"
"tilting forward on tiny skis as they zigzag down a gentle slope, all giggling and slightly off-balance"

HARD BANS: NO species names, NO humans or people anywhere (any background figures are tiny chibi animals), NO food characters, NO mood/lighting/palette words, NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 2) SETTING DETAIL — concrete winter elements (pickN:3 in the template).
  await generatePool({
    outPath: DIR + 'chibibot_snow_day_detail.json',
    total: 35,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SETTING DETAILS for ChibiBot's creature-snow-day path — concrete winter elements that build the PLACE in the midground/background (the template stacks THREE per render for a lived-in snow day).

Each entry: 6-14 words, a single readable winter element. NO characters as the focus. Any distant figures must be explicitly tiny chibi ANIMALS, never people.

Examples:
"snow-laden pine trees lining the slope"
"a cozy wooden ski lodge with a smoking chimney"
"a frozen pond ringed with snowbanks"
"a chairlift rising over the white hillside"
"candy-cane trail markers in the snow"
"a row of icicles hanging from a snowy fence rail"
"a few tiny chibi-animal skiers cresting a distant ridge"

HARD BANS: NO humans or people anywhere (any background figures are tiny chibi animals), NO food characters, NO mood/lighting/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) PROP — small winter charm a creature holds/wears.
  await generatePool({
    outPath: DIR + 'chibibot_snow_day_prop.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} small PROP charms for ChibiBot's creature-snow-day path — a little winter object one of the chibi creature friends holds or wears.

Each entry: 4-10 words, a single cute winter charm.

Examples:
"a striped knitted scarf"
"tiny mittens"
"a little wooden sled"
"a pom-pom beanie"
"ski goggles"
"a snowball cupped in both paws"
"tiny earmuffs"
"a pair of little snowshoes"

HARD BANS: NO humans, NO weapons. Keep it wholesome and tiny. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) SURPRISE — tucked-away background detail.
  await generatePool({
    outPath: DIR + 'chibibot_snow_day_surprise.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background details for ChibiBot's creature-snow-day path — a tiny tucked-away delightful detail in the midground/background of a snowy scene.

Each entry: 6-14 words, one wholesome surprise.

Examples:
"a tiny snowman waving a twig arm in the background"
"fresh paw-prints winding across the snow"
"a robin perched on a snowy branch"
"a sled abandoned mid-hill"
"a single mitten dropped in the snow"
"a little bird hopping along a snowbank"
"snowflakes drifting past a frosted lantern"

HARD BANS: NO humans, NO scary/sad imagery. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 snow-day pools generated.');
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
