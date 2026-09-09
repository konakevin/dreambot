#!/usr/bin/env node
/**
 * FarmBot — ambient_life shared pool (new, 2026-09-09).
 *
 * Kevin: "the pure scene ones should encourage animals placed into the
 * comfy scene somehow that makes sense, or butterflies, fireflies, etc...
 * something besides just a pure nature or barn scene." A no-character
 * render must never read as a bare, lifeless landscape/interior. This pool
 * is the FALLBACK layer for when a path's own ANIMAL_COMPANIONS roll misses
 * — small, quiet, ever-present life (butterflies, fireflies, bees,
 * dragonflies, ladybugs, moths, a single perched bird, drifting petals) that
 * fits ANY cozy farm scene without needing a dedicated character or a full
 * animal companion. Distinct from GENTLE_MAGIC (rare/whimsical/fantastical,
 * ~15% weight) — this pool is common/mundane/always-plausible, meant to be
 * picked often.
 *
 * Tagged indoor/outdoor/ANY (not density-tagged like ANIMAL_COMPANIONS —
 * this is a single small detail, not a population) PLUS an optional season
 * tag ("warm" or "winter") — see the tagging rules in the meta-prompt below
 * and `pools.js`'s `pickPureSceneLife` JSDoc for why the season tags exist:
 * `filterByTags`/`byTags` OR-match on "ANY" or any allowed tag, so a plain
 * `['outdoor']` filter (what every non-winter path uses) would silently
 * pull in warm-season wildlife on a snow-locked path unless winter entries
 * are tagged ONLY "winter" (deliberately NOT "outdoor", NOT "ANY") — that
 * keeps them invisible to every filter except an explicit
 * `ambientTags: ['outdoor','winter']` opt-in. Warm-season entries stay
 * visible to normal outdoor filters (they keep their "outdoor" tag) but
 * carry an ADDITIONAL "warm" tag so a winter-locked path can explicitly
 * exclude them via `excludeAmbientTags: ['warm']`.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_ambient_life.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL AMBIENT LIFE details for a cozy anime
farm-life illustration. Each is ONE small, quiet, ever-present touch of life that makes a
scene feel warm and inhabited even with no human character present — never a full "animal
companion" (no herds, no pets curled up sleeping, no named creature), just a small living
or floating detail passing through or resting briefly in the frame: a butterfly drifting
between blooms, fireflies blinking at dusk, a bee moving lazily from flower to flower, a
dragonfly resting on a fence post, ladybugs on a leaf, a moth circling a lantern, a single
small bird perched and preening, a trail of drifting flower petals on the breeze, dust
motes drifting in a sunbeam, a grasshopper in the grass, a hoverfly over a bloom, a snail on
a leaf, a caterpillar inching along a stem, a hummingbird at a flower, a spider spinning a
web, geese passing overhead, a lizard sunning on a warm stone, dew beading on a spiderweb, a
cricket on a fence post.

TAGGING — every entry needs a location tag ("outdoor", "indoor", or "ANY") PLUS, for two
specific categories only, an additional season tag. Follow this EXACTLY, it is load-bearing
for a season-safety mechanism downstream:

1. WARM-SEASON WILDLIFE — bees, butterflies, fireflies/lightning bugs, dragonflies,
   damselflies, ladybugs, cherry/plum/apple blossom petals, hummingbirds, or any other
   creature/bloom that reads as specifically spring-or-summer — gets its normal location tag
   (almost always "outdoor") PLUS an additional "warm" tag. Example tags: ["outdoor", "warm"].

2. SPECIFICALLY WINTER phenomena — snow, snowflakes, frost, breath-fog, a robin or chickadee
   perched in snow, paw prints in snow, icicles, a light snow dusting sifting off a branch —
   gets ONLY "winter" as its tag. Do NOT also tag these "outdoor" and do NOT tag them "ANY" —
   "winter" alone, by itself, is correct and intentional so a plain outdoor filter never picks
   one up by accident. Example tags: ["winter"].

3. SEASON-NEUTRAL entries — sparrows and other common year-round birds, dust motes, a moth
   circling a lamp, a spider's web catching light, a snail, a cricket, a lizard on a stone —
   get ONLY their normal location tag ("outdoor", "indoor", or "ANY"), with NO season tag at
   all. Example tags: ["outdoor"] or ["indoor"].

Do not guess or improvise — every entry must fall cleanly into exactly one of these three
buckets. When genuinely unsure whether something is warm-season-specific vs. season-neutral,
default to treating it as season-neutral (no season tag) rather than mis-tagging it "warm."

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["outdoor"], "description": "..."}

Examples (showing all three tagging patterns):
[{"tags": ["outdoor", "warm"], "description": "A pair of butterflies drifting lazily between the blossoms, never quite landing."}, {"tags": ["outdoor", "warm"], "description": "Fireflies just beginning to blink on in the fading light, scattered soft and slow."}, {"tags": ["indoor"], "description": "Dust motes drifting slow and golden through a shaft of afternoon sun."}, {"tags": ["winter"], "description": "A light dusting of snow sifting quietly from an overladen branch as it settles."}, {"tags": ["outdoor"], "description": "A small brown cricket perched motionless on a sun-warmed fence rail."}]

🚫 STRICT BANS: NO personification (no faces, no expressions, no "watching," no implied
awareness on any insect/bird/light detail), NO named individual creatures, NO herds or
groups larger than a small handful, NO metaphorical light-as-object language (no "coins of
light," nothing literalizable), NO signage/readable text/labels of any kind, NO negation
("not X," "no X"), NO ethnic/national/regional language of any kind, NO camera-brand or
photography terms, NO ellipses in the description text itself.

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
