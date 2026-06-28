#!/usr/bin/env node
/**
 * ChibiBot creature-amusement-park — bespoke axis pools (2026-06-28).
 *
 * Generates the 4 amusement-park-bespoke pools for the creature-amusement-park
 * path (creature band + lighting/atmosphere come from shared pools):
 *   activity        — creature-agnostic group ride/attraction verb-phrases
 *   setting_detail  — concrete park elements that build the place
 *   prop            — small charms a creature holds/wears
 *   surprise_element— tucked-away background details
 *
 * MVP sizes here; bump the totals and re-run (append) to scale. Run:
 *   node scripts/gen-seeds/chibibot/gen-amusement-park-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) ACTIVITY — what the band of friends is doing on a ride/attraction.
  await generatePool({
    outPath: DIR + 'chibibot_amusement_park_activity.json',
    total: 50,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} ACTIVITY phrases for ChibiBot's creature-amusement-park path — what a little band of chibi creature FRIENDS is doing TOGETHER on an amusement-park ride or attraction. The specific animals come from a SEPARATE axis, so do NOT name any species — use "they / their / the friends" for the group.

Each entry: 12-22 words, an ACTIVE group verb-phrase (mid-action, joyful), naming the SPECIFIC ride/attraction so the place reads.

Distribute roughly evenly across these attractions: roller coaster, carousel, spinning teacup-ride cars, bumper cars, drop tower, log flume, Ferris wheel, swing-chair ride, haunted dark-ride, sky gondola, tilt-a-whirl, fun-slide.

Examples (mirror register — NO species named):
"screaming with joy in the front car as their roller-coaster crests the first towering loop, paws thrown skyward"
"spinning wildly inside an oversized pastel teacup-ride car, all gripping the center wheel and laughing"
"bouncing in a bumper car mid-collision, tiny paws yanking the wheel, sparks of fun flying"
"clinging to the rail of a drop-tower car at the very top, cheeks puffed, the park shrinking far below"
"riding a painted carousel horse each, waving to one another as the platform turns"

HARD BANS: NO species names, NO humans, NO food characters, NO mood/lighting/palette words, NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 2) SETTING DETAIL — concrete park elements (pickN:3 in the template).
  await generatePool({
    outPath: DIR + 'chibibot_amusement_park_detail.json',
    total: 35,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SETTING DETAILS for ChibiBot's creature-amusement-park path — concrete amusement-park elements that build the PLACE in the midground/background (the template stacks THREE per render for a lived-in park).

Each entry: 6-14 words, a single readable park element. NO characters as the focus. Any distant figures must be explicitly tiny chibi ANIMALS, never people.

Examples:
"a towering candy-striped Ferris wheel turning slowly against the sky"
"rows of ring-toss booths hung with fluffy plush prizes"
"a glittering carousel with hand-painted horses and gold poles"
"a winding wooden roller-coaster track looping overhead"
"strings of colorful pennant flags crisscrossing the midway"
"a neon-lit game booth with flashing bulbs"
"a few tiny chibi-animal visitors browsing a distant booth"

HARD BANS: NO humans or people anywhere (any background figures are tiny chibi animals), NO food characters, NO mood/lighting/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) PROP — small charm a creature holds/wears.
  await generatePool({
    outPath: DIR + 'chibibot_amusement_park_prop.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} small PROP charms for ChibiBot's creature-amusement-park path — a little object one of the chibi creature friends holds or wears.

Each entry: 4-10 words, a single cute amusement-park charm.

Examples:
"a giant plush prize tucked under one arm"
"a balloon on a string bobbing overhead"
"a paper ride-ticket clutched in a tiny paw"
"a colorful spinning pinwheel"
"tiny round heart-shaped sunglasses"
"a swirl of cotton candy on a paper cone"
"a little crossbody backpack with a cartoon patch"
"a glowing light-up wand"

HARD BANS: NO humans, NO weapons. Keep it wholesome and tiny. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) SURPRISE — tucked-away background detail.
  await generatePool({
    outPath: DIR + 'chibibot_amusement_park_surprise.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background details for ChibiBot's creature-amusement-park path — a tiny tucked-away delightful detail in the midground/background of an amusement park.

Each entry: 6-14 words, one wholesome surprise.

Examples:
"a runaway balloon drifting up past the Ferris wheel"
"a tiny chick waving from the very top of the coaster"
"a little bird perched on a striped booth awning"
"a forgotten plush toy sitting on a bench"
"the first sparkles of evening fireworks blooming over the park"
"a trail of dropped popcorn leading off-frame"
"a chibi creature peeking out of a ride-photo booth"

HARD BANS: NO humans, NO scary/sad imagery. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 amusement-park pools generated.');
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
