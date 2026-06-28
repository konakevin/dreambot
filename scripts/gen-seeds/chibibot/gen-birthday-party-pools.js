#!/usr/bin/env node
/**
 * ChibiBot creature-birthday-party — bespoke axis pools (2026-06-28).
 *
 * Generates the 4 birthday-party-bespoke pools for the creature-birthday-party
 * path (creature band + lighting/atmosphere come from shared pools):
 *   activity        — creature-agnostic group party verb-phrases
 *   setting_detail  — concrete party elements that build the place
 *   prop            — small charms a creature holds/wears
 *   surprise_element— tucked-away background details
 *
 * MVP sizes here; bump the totals and re-run (append) to scale. Run:
 *   node scripts/gen-seeds/chibibot/gen-birthday-party-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) ACTIVITY — what the band of friends is doing at the party.
  await generatePool({
    outPath: DIR + 'chibibot_birthday_party_activity.json',
    total: 50,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} ACTIVITY phrases for ChibiBot's creature-birthday-party path — what a little band of chibi creature FRIENDS is doing TOGETHER at a festive birthday party. The specific animals come from a SEPARATE axis, so do NOT name any species — use "they / their / the friends" for the group.

Each entry: 12-22 words, an ACTIVE group verb-phrase (mid-action, joyful), naming the SPECIFIC party moment so the celebration reads.

Distribute roughly evenly across these party moments: leaning in to blow out the candles on a little cake, tearing open gift-wrapped presents, swinging a bat at a hanging piñata, playing musical chairs, playing pin-the-tail-on-the-donkey, leading a wiggly conga line, blowing party horns and tossing confetti, diving into a ball pit, posing together in a photo-booth frame, a big group hug around the cake, dancing under a spinning disco ball, lifting a parachute play-canopy together.

Examples (mirror register — NO species named):
"leaning in close together over a candle-topped cake, cheeks puffed, all blowing out the tiny flickering flames at once"
"tearing open gift-wrapped presents in a flurry of ribbon and paper, tiny paws holding up their new treasures"
"swinging a little bat at a hanging piñata, the others cheering and ducking as candy rains down"
"weaving in a wiggly conga line through the party room, each gripping the shoulders of the friend ahead"
"blowing party horns and flinging fistfuls of confetti high into the air, everyone mid-laugh"

HARD BANS: NO species names, NO humans, NO food characters, NO mood/lighting/palette words, NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 2) SETTING DETAIL — concrete party elements (pickN:3 in the template).
  await generatePool({
    outPath: DIR + 'chibibot_birthday_party_detail.json',
    total: 35,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SETTING DETAILS for ChibiBot's creature-birthday-party path — concrete birthday-party elements that build the PLACE in the midground/background (the template stacks THREE per render for a lived-in party room).

Each entry: 6-14 words, a single readable party element. NO characters as the focus. Any distant figures must be explicitly tiny chibi ANIMALS, never people.

Examples:
"balloon arches and streamers draping the party room"
"a long table loaded with wrapped presents"
"a HAPPY BIRTHDAY banner strung across the wall"
"clusters of gold and pink balloons anchored to chairs"
"a candle-topped cake on a decorated table"
"a stack of colorful paper party hats on a side table"
"a few tiny chibi-animal guests chatting by the gift pile"

HARD BANS: NO humans or people anywhere (any background figures are tiny chibi animals), NO food characters, NO mood/lighting/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) PROP — small charm a creature holds/wears.
  await generatePool({
    outPath: DIR + 'chibibot_birthday_party_prop.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} small PROP charms for ChibiBot's creature-birthday-party path — a little object one of the chibi creature friends holds or wears.

Each entry: 4-10 words, a single cute birthday-party charm.

Examples:
"a pointy party hat"
"a party-blower horn"
"a wrapped gift box"
"a fistful of balloon strings"
"a noisemaker"
"a slice of cake on a paper plate"
"a confetti popper"
"a curly ribbon streamer"

HARD BANS: NO humans, NO weapons, NO food characters. Keep it wholesome and tiny. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) SURPRISE — tucked-away background detail.
  await generatePool({
    outPath: DIR + 'chibibot_birthday_party_surprise.json',
    total: 24,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background details for ChibiBot's creature-birthday-party path — a tiny tucked-away delightful detail in the midground/background of a birthday party.

Each entry: 6-14 words, one wholesome surprise.

Examples:
"a runaway balloon drifting up to the ceiling"
"a wrapped present with a bow coming loose"
"confetti still raining in the background"
"a banner letter hanging slightly crooked"
"a tiny chick peeking out from under the gift table"
"a little bird perched on a balloon string"
"a forgotten party hat sitting on a chair"

HARD BANS: NO humans, NO food characters, NO scary/sad imagery. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 birthday-party pools generated.');
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
