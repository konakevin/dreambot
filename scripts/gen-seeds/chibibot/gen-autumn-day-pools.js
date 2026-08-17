#!/usr/bin/env node
/**
 * ChibiBot creature-autumn-day — bespoke axis pools (Stage H1, SHADOW).
 *
 * Outing-family clone of creature-snow-day: 4 autumn-bespoke pools for the
 * creature-autumn-day path (creature band + lighting/atmosphere from shared pools):
 *   activity        — creature-agnostic group autumn-play verb-phrases
 *   setting_detail  — concrete golden-autumn elements that build the place
 *   prop            — small cozy autumn charms a creature holds/wears
 *   surprise_element— tucked-away background autumn details
 *
 * MVP sizes; bump totals + re-run (append) to scale. Run:
 *   node scripts/gen-seeds/chibibot/gen-autumn-day-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) ACTIVITY — what the band of friends is doing on the autumn day.
  await generatePool({
    outPath: DIR + 'chibibot_autumn_day_activity.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} ACTIVITY phrases for ChibiBot's creature-autumn-day path — what a little band of THREE chibi creature FRIENDS is doing TOGETHER on a cozy golden-autumn day out. The specific animals come from a SEPARATE axis, so do NOT name any species — use "they / the three friends / all three / one ... another ... the third" for the group.

Each entry: 14-26 words. MANDATE — every entry must show ALL THREE friends visibly engaged in the SAME activity together, with 2-3 distributed sub-actions so the whole band reads (e.g. "one leaps, another tumbles, the third flings leaves"). High-energy, joyful, mid-action, cozy. Name the SPECIFIC autumn activity so the play reads. NEVER a single solo creature — always the trio, all busy.

Distribute roughly evenly across these activities: all three cannonballing into a huge pile of raked leaves, the trio picking pumpkins across a pumpkin patch, three friends hauling a wagon of apples through an orchard, a three-way acorn-stashing race, crowding together at a little cider stand, piling onto a hay wagon, chasing through a corn maze in a line, raking leaves into a shared mountain, roasting things around a tiny campfire, all building one little scarecrow, taking turns bobbing for apples, carving one pumpkin together, stringing a long leaf-garland between them, tumbling down a hay-bale slope one after another.

Examples (mirror register — NO species named, ALL THREE always doing it together):
"all three cannonballing into an enormous pile of red-and-gold leaves at once, paws flung wide, leaves bursting up around every one of them"
"the three friends heaving a little red wagon heaped with shiny apples down an orchard row, two pulling in front while the third pushes hard behind"
"spread across the pumpkin patch, one hugging a fat pumpkin, another rolling a bigger one, the third pointing at the biggest of all, cheeks rosy"
"crowded shoulder to shoulder at a tiny cider stand, all three clutching warm paper cups, blowing on the steam and grinning at each other"
"racing through a golden corn maze in a giggling line, one leading with a map held upside-down, the second close behind, the third bringing up the rear"

HARD BANS: NO species names, NO single-solo-creature entries (always the trio together), NO humans or people anywhere (any background figures are tiny chibi animals), NO food characters, NO mood/lighting/palette words, NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 2) SETTING DETAIL — concrete golden-autumn elements (pickN:3 in the template).
  await generatePool({
    outPath: DIR + 'chibibot_autumn_day_detail.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SETTING DETAILS for ChibiBot's creature-autumn-day path — concrete golden-AUTUMN elements that build the PLACE in the midground/background (the template stacks THREE per render for a lived-in autumn day).

⚠️ SEASON LOCK — EVERY entry must EXPLICITLY read as deep AUTUMN / FALL. Name the autumn cue in the phrase itself (fallen leaves, red-and-gold/amber/russet foliage, bare or half-bare branches, harvest, pumpkins). NEVER a season-neutral element (a plain "barn" or "hay bale" alone lets the image drift to spring or winter) — always tie it to autumn (e.g. "hay bales among drifts of fallen autumn leaves"). ABSOLUTELY NO snow, NO frost, NO winter, NO cherry blossoms, NO spring flowers, NO green summer foliage.

Each entry: 6-14 words, a single readable AUTUMN element. NO characters as the focus. Any distant figures must be explicitly tiny chibi ANIMALS, never people.

Examples (every one explicitly autumn):
"red-and-gold maple canopies blazing overhead, leaves raining down"
"deep drifts of crisp fallen autumn leaves along the path"
"long rows of fat orange pumpkins in the harvest patch"
"golden hay bales half-buried in drifts of fallen leaves"
"a russet apple orchard, branches heavy with red fruit and turning leaves"
"a rustic cider stand ringed with scattered amber leaves"
"bare and half-bare autumn branches against a warm hazy sky"
"a few tiny chibi-animal visitors wandering the far pumpkin rows"

HARD BANS: NO snow/frost/winter, NO cherry-blossom/spring, NO green-summer foliage, NO humans or people (any background figures are tiny chibi animals), NO food characters, NO lighting/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) PROP — small cozy autumn charm a creature holds/wears.
  await generatePool({
    outPath: DIR + 'chibibot_autumn_day_prop.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} small PROP charms for ChibiBot's creature-autumn-day path — a little cozy autumn object one of the chibi creature friends holds or wears.

Each entry: 4-10 words, a single cute autumn charm.

Examples:
"a chunky knitted sweater"
"a tiny woolen scarf"
"a little wicker basket of apples"
"a single big maple leaf held like an umbrella"
"a small carved pumpkin"
"a cozy plaid beanie"
"a warm paper cup of cider"
"a bundle of wheat stalks"

HARD BANS: NO humans, NO weapons. Keep it wholesome, cozy and tiny. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) SURPRISE — tucked-away background autumn detail.
  await generatePool({
    outPath: DIR + 'chibibot_autumn_day_surprise.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background details for ChibiBot's creature-autumn-day path — a tiny tucked-away delightful detail in the midground/background of a golden-autumn scene.

Each entry: 6-14 words, one wholesome surprise.

Examples:
"a tiny squirrel peeking out from behind a pumpkin"
"a scarecrow leaning crookedly in the field"
"a single red leaf spiraling down through the air"
"a wheelbarrow tipped over spilling apples"
"a little bird perched on a fence post"
"a trail of acorns leading off into the leaves"
"a cluster of orange gourds stacked by a barn door"

HARD BANS: NO humans, NO scary/sad imagery. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 autumn-day pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
