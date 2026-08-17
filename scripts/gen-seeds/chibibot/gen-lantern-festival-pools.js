#!/usr/bin/env node
/**
 * ChibiBot creature-lantern-festival — bespoke axis pools (Stage H2, SHADOW).
 *
 * Outing-family clone of creature-snow-day, at NIGHT: a little band of THREE chibi
 * creature friends at a warm-lantern-lit night festival. 4 bespoke pools:
 *   activity        — creature-agnostic TRIO group festival verb-phrases (night)
 *   setting_detail  — concrete warm-lantern night elements (NIGHT-LOCKED)
 *   prop            — small festival charms a creature holds/wears (food = PROP not cast)
 *   surprise_element— MONEY-SHOT background beats (mass sky-lantern release, lantern canal)
 *
 * Lessons from H1: trio-force the activity (or the solo-prone looks drop to 1 hero);
 * hard-lock the NIGHT in the detail pool (season-neutral entries drift to daytime).
 * Run: node scripts/gen-seeds/chibibot/gen-lantern-festival-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) ACTIVITY — the trio at the night lantern festival, all three together.
  await generatePool({
    outPath: DIR + 'chibibot_lantern_festival_activity.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} ACTIVITY phrases for ChibiBot's creature-lantern-festival path — what a little band of THREE chibi creature FRIENDS is doing TOGETHER at a warm-lantern-lit NIGHT festival. The specific animals come from a SEPARATE axis, so do NOT name any species — use "they / the three friends / all three / one ... another ... the third".

Each entry: 14-26 words. MANDATE — every entry shows ALL THREE friends visibly engaged in the SAME night-festival activity together, with 2-3 distributed sub-actions so the whole band reads. It is NIGHT and the scene is lit by warm paper lanterns. NEVER a single solo creature — always the trio, all busy. Name the SPECIFIC festival activity so the play reads.

Distribute roughly evenly across: all three lighting a paper lantern together, the trio releasing a glowing sky-lantern into the night, three friends playing a lantern-lit festival game (ring toss / goldfish scoop / bell game), crowding at a glowing food stall sharing festival snacks, carrying paper lanterns on sticks down a lantern-strung lane, watching the mass sky-lantern release with heads tilted up, floating little lantern-boats on a dark canal, winding through a lantern-lit night market in a line, tracing a lantern maze, cupping a tiny glowing lantern between all their paws.

Examples (NO species named, ALL THREE, at night by lantern-light):
"all three huddled together cupping a single paper lantern as its warm glow flickers to life in their paws under the dark sky"
"the three friends letting a glowing sky-lantern rise into the night, heads tilted back, faces lit warm gold from below"
"spread along a lantern-strung lane, one carrying a lantern on a stick, another pointing up, the third steadying a wobbly paper lamp"
"crowded at a glowing night stall, all three leaning in over warm festival snacks, faces lit amber against the blue dark"
"crouched at a dark canal edge, the trio nudging little glowing lantern-boats out onto the black water together"

HARD BANS: NO species names, NO single-solo entries (always the trio), NO daytime/bright-sky (it is NIGHT), NO humans or people (any background figures are tiny chibi animals), food is a PROP only NEVER a character, NO legible text/writing on lanterns, NO mood/palette words, NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 2) SETTING DETAIL — warm-lantern NIGHT elements (pickN:3, night-locked).
  await generatePool({
    outPath: DIR + 'chibibot_lantern_festival_detail.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SETTING DETAILS for ChibiBot's creature-lantern-festival path — concrete warm-lantern NIGHT elements that build the PLACE (the template stacks THREE per render for a lived-in night festival).

⚠️ NIGHT LOCK — EVERY entry must EXPLICITLY read as NIGHT lit by warm lanterns. Name the night/lantern cue in the phrase (glowing paper lanterns, dark-blue night sky, warm stall-glow, reflections on dark water, string-lights against the dark). NEVER a daytime or season-neutral element. ABSOLUTELY NO daylight, NO bright blue sky, NO sun.

Each entry: 6-14 words. NO characters as the focus. Any distant figures must be explicitly tiny chibi ANIMALS, never people. NO legible text/writing on the lanterns.

Examples (every one a warm-lantern night):
"rows of glowing red-and-orange paper lanterns strung overhead against the dark"
"warm amber stall-lights glowing along a night market lane"
"hundreds of sky-lanterns drifting up into the deep-blue night"
"lantern reflections shimmering on the black water of a canal"
"a deep indigo night sky scattered with a few soft stars"
"strings of tiny warm fairy-lights zigzagging between dark stalls"
"a glowing lantern-lit bridge arching over a dark stream"
"a few tiny chibi-animal festival-goers silhouetted against the lantern glow"

HARD BANS: NO daylight/bright-sky/sun, NO legible text on lanterns, NO humans or people (background figures are tiny chibi animals), NO food characters, NO mood/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) PROP — small festival charm a creature holds/wears (food = prop).
  await generatePool({
    outPath: DIR + 'chibibot_lantern_festival_prop.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} small PROP charms for ChibiBot's creature-lantern-festival path — a little festival object one of the chibi creature friends holds or wears at the night festival.

Each entry: 4-10 words, a single cute festival charm.

Examples:
"a small glowing paper lantern on a stick"
"a tiny paper pinwheel"
"a little candied-fruit skewer"
"a paper festival mask pushed up on the head"
"a mini goldfish-scoop paddle"
"a tiny wrapped festival snack"
"a little folded paper fan"
"a small glowing lantern cupped in both paws"

HARD BANS: food is a PROP only, NEVER a character. NO humans, NO weapons, NO legible text. Keep it wholesome and tiny. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) SURPRISE — MONEY-SHOT night background beats.
  await generatePool({
    outPath: DIR + 'chibibot_lantern_festival_surprise.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background beats for ChibiBot's creature-lantern-festival path — a tucked-away delightful NIGHT detail (some are money-shot scale). Each 6-14 words.

Lead heavily with the two money-shot beats: the MASS SKY-LANTERN RELEASE filling the night sky, and a LANTERN CANAL of little glowing boats on dark water. Then smaller beats.

Examples:
"a whole sky filled with rising glowing sky-lanterns"
"a dark canal covered in little glowing lantern-boats"
"a single sky-lantern drifting past a soft moon"
"warm lantern-light rippling across dark water"
"a tiny chibi-animal juggling glowing lanterns at a distant stall"
"a paper lantern snagged glowing in a dark tree"
"fireflies mingling with the lantern glow in the dark"

HARD BANS: NO humans, NO scary/sad, NO daylight, NO legible text. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 lantern-festival pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
