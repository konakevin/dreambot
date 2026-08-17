#!/usr/bin/env node
/**
 * ChibiBot creature-school — bespoke axis pools (Stage H4, SHADOW).
 *
 * Interior outing-family clone: a cozy little schoolroom of chibi creature pupils
 * (and a creature teacher) doing a class activity together. 4 bespoke pools:
 *   activity        — creature-agnostic TRIO/class group school verb-phrases
 *   setting_detail  — concrete cozy-classroom interior elements (pickN:3)
 *   prop            — small school charms a creature holds/wears
 *   surprise_element— tucked-away classroom background beats
 *
 * HARD LAWS: teacher is a CREATURE (NO humans ever); "children"/"kids"/"student"(human)
 * words BANNED — creature PUPILS/classmates only (the child-purge law); warm interior light.
 * Lessons from H1/H2: trio-force the activity; lock the cozy warm INTERIOR in the detail pool.
 * Run: node scripts/gen-seeds/chibibot/gen-creature-school-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) ACTIVITY — the class of creature pupils doing a school activity together.
  await generatePool({
    outPath: DIR + 'chibibot_creature_school_activity.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} ACTIVITY phrases for ChibiBot's creature-school path — what a cozy little class of chibi creature PUPILS (and their creature teacher) is doing TOGETHER in a warm little schoolroom. The specific animals come from a SEPARATE axis, so do NOT name any species — use "the little pupils / the classmates / all three / one ... another ... the third / the creature teacher".

Each entry: 14-26 words. MANDATE — every entry shows a GROUP of little creature classmates (3+) visibly engaged in the SAME class activity together, with 2-3 distributed sub-actions so the whole class reads. Warm indoor schoolroom. NEVER a single solo pupil. Name the SPECIFIC school activity so it reads.

⚠️ THE TEACHER (when present) IS A CREATURE, never a human. Use "creature teacher / a little critter at the chalkboard".

Distribute roughly evenly across: an art class all painting at once, a show-and-tell with a glowing pebble passed around the circle, a recess tumble/play-pile, story circle on a rug listening to the creature teacher, a tiny chalkboard lesson led by a creature teacher, music class with little instruments, naptime on floor mats, a science table with a glowing jar, reading picture-books together, a counting lesson with acorns, a crafts table making leaf-collages, singing in a little choir row.

Examples (NO species named, a GROUP of creature pupils, NEVER "children"):
"all three little pupils painting at a shared easel, one dabbing, another mixing colors, the third holding up a dripping masterpiece"
"gathered in a story circle on a woven rug, the little classmates leaning in as the creature teacher reads aloud, eyes wide"
"crowded at the tiny chalkboard, one pupil pointing at chalk squiggles while two classmates copy into leaf notebooks"
"a naptime row of little pupils curled on floor mats, one already snoring, another hugging a plush, the third peeking awake"
"passing a softly glowing pebble around the show-and-tell circle, each little classmate cupping it in turn with a gasp"

HARD BANS: NO species names, NO HUMANS of any kind, the teacher is a CREATURE; NEVER the words "children/kids/child/boys/girls/human students" — use "little pupils / classmates / creatures"; NO single-solo entries; NO food characters; NO mood/lighting/palette words; NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 2) SETTING DETAIL — cozy warm classroom interior (pickN:3, interior-locked).
  await generatePool({
    outPath: DIR + 'chibibot_creature_school_detail.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SETTING DETAILS for ChibiBot's creature-school path — concrete cozy-CLASSROOM INTERIOR elements that build the little schoolroom (the template stacks THREE per render).

⚠️ INTERIOR LOCK — EVERY entry is inside a warm, cozy little schoolroom, whimsically sized for tiny creatures. Name a clear classroom element. NO outdoor scenes, NO landscapes. Elements are creature-scaled and handmade-cute (acorn-cap seats, leaf notebooks, twig easels).

Each entry: 6-14 words, a single readable classroom element. NO characters as the focus. Any distant figures must be explicitly tiny chibi ANIMALS. NO legible text/writing (chalkboard squiggles fine, no real words).

Examples:
"rows of tiny acorn-cap stools at little wooden desks"
"a small chalkboard covered in chalky squiggles and doodles"
"shelves of teeny leaf-bound picture books"
"jars of stubby colorful crayons on a craft table"
"a cozy woven story-rug in a warm pool of lamplight"
"paper-leaf art taped up along a warm timber wall"
"a little window glowing with warm afternoon light"
"a tiny globe and an abacus of acorns on a shelf"

HARD BANS: NO outdoor/landscape, NO humans (background figures are tiny chibi animals), NO food characters, NO legible text, NO mood/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) PROP — small school charm a creature holds/wears.
  await generatePool({
    outPath: DIR + 'chibibot_creature_school_prop.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} small PROP charms for ChibiBot's creature-school path — a little school object one of the chibi creature pupils holds or wears.

Each entry: 4-10 words, a single cute school charm.

Examples:
"a tiny leaf notebook"
"a stubby red crayon"
"a little acorn-cap backpack"
"a paintbrush dripping color"
"a small chalk stub"
"a rolled-up paper-leaf scroll"
"a tiny pointer stick"
"a little apple for the teacher"

HARD BANS: food is a PROP only, never a character. NO humans, NO weapons, NO legible text. Keep it wholesome and tiny. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) SURPRISE — tucked-away classroom background beat.
  await generatePool({
    outPath: DIR + 'chibibot_creature_school_surprise.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background beats for ChibiBot's creature-school path — a tiny tucked-away delightful detail in the cozy schoolroom. Each 6-14 words.

Examples:
"a tiny pupil dozing off at the back desk"
"a paper airplane frozen mid-flight across the room"
"a class pet snail inching along a shelf"
"a crayon rolling off the edge of a desk"
"a wobbly tower of building blocks about to topple"
"a little hand-print painting drying on the wall"
"a ladybug perched on the chalkboard rail"

HARD BANS: NO humans, NO scary/sad, NO legible text. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 creature-school pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
