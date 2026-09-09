#!/usr/bin/env node
/**
 * FarmBot — lakeside_riverside_place bespoke pool ("Lakeside / Riverside
 * Moment" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE (summer-evening-by-the-pond),
 * HARVEST_FESTIVAL_PLACE (harvest-festival), and FLOWER_FIELD_PLACE
 * (flower-field-wandering).
 *
 * CRITICAL — this must feel like a GENUINELY DIFFERENT, LARGER, MORE OPEN
 * body of water than POND_PLACE. The pond path is small and intimate
 * (stepping stones, lily pads, a tucked-away backyard-scale pool). This pool
 * is either:
 *   (a) a WIDE LAKE — a distant far shoreline, hills or a tree line mirrored
 *       in still or gently rippled water, open sky reflected across a broad
 *       surface, maybe a small wooden dock or a rowboat tied up, a pier
 *       reaching out into open water; OR
 *   (b) a FLOWING RIVER — visible current, smooth worn stones, a wooden
 *       footbridge, reeds or willows along the bank, a sandbar or gravel
 *       shallows, water audibly moving rather than sitting still.
 * Mix roughly half lake-mood / half river-mood across the pool. Every entry
 * must read as WIDE and OPEN — a far horizon, a long view, room to breathe —
 * never small, tucked-away, or stepping-stone-scale.
 *
 * LIGHT-ON-WATER GOTCHA (see FARMBOT_PATH_BUILD_STATE.md): metaphorical
 * light language can render LITERALLY — "coins of light" rendered as actual
 * gold coins scattered on the ground in a prior pool. This meta-prompt bans
 * object-metaphors for light outright (coins, ribbons, threads, jewels,
 * sequins, discs) — only non-literalizable words for light on water are
 * allowed (shimmer, glimmer, sparkle, glint, dapple, pools/patches of
 * light).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_lakeside_riverside_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct WIDE LAKE or FLOWING RIVER descriptions for a
cozy countryside bot — a large, open body of water as a rich, living little world of its own,
entirely through its physical details. The lake or river itself is ALWAYS the grammatical subject
named FIRST in the sentence.

CRITICAL — this must feel like a GENUINELY DIFFERENT, LARGER, and MORE OPEN body of water than a
small backyard pond. Do NOT write anything that reads as small, tucked-away, or stepping-stone
scale (no lily pads, no stepping stones, no tiny sheltered pool, no "hidden nook"). Every entry
needs a sense of WIDE OPEN SPACE and a FAR HORIZON.

Split roughly half the entries into each of these two moods:
  (a) WIDE LAKE mood — a broad, open expanse of water reaching to a distant far shoreline, hills
      or a tree line mirrored across the still or gently rippled surface, wide open sky reflected
      over a long view, maybe a small weathered wooden dock, a rowboat tied up and drifting
      slightly, a pier reaching out into open water, reeds along a far bank barely visible across
      the distance.
  (b) FLOWING RIVER mood — visible current moving steadily, smooth worn stones breaking the
      surface, a simple wooden footbridge crossing the water, willows or tall reeds leaning along
      the bank, a gravel shallows or small sandbar, the sound of moving water implied through
      visual motion (ripples trailing off stones, small eddies, a current bending around a bend).

Vary time of day (soft early morning mist over the water, high clear midday light, warm late
-afternoon glow, blue dusk), viewpoint (looking straight across the wide water, standing at the
water's edge looking down a long shoreline, looking upstream/downstream along a river bend, from
partway out on a dock or footbridge), and which physical details lead.

LIGHT ON WATER — describe light on the water's surface only with words like shimmer, glimmer,
sparkle, glint, dapple, or "pools/patches of light." Do NOT use any object-metaphor for light on
water — NEVER "coins," "coin-dappled," "ribbons," "threads," "jewels," "sequins," "discs," or any
other phrase that names a physical object standing in for light — these render as the LITERAL
object, not as light.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces,
hands, someone/anyone doing something, footprints (implies a walker just left), or any other word
implying a person is present or was recently present. Describe only the water, shoreline/bank,
structures (dock/pier/footbridge), light, weather, and any wildlife-neutral detail — a beautiful
open place with nobody in the frame yet.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A wide lake stretches to a distant tree-lined shoreline under soft morning mist, hills mirrored
faintly across the still water, a weathered wooden dock reaching out from the near bank with a
rowboat tied loosely alongside.", "A river runs steadily over smooth worn stones, sunlight
glimmering across small ripples trailing each rock, a simple wooden footbridge crossing the
current a little way downstream, willows leaning low along the far bank."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage, NO brand
names, NO photographer/camera-brand names, NO small/intimate/backyard-pond-scale imagery (no
lily pads, no stepping stones, no tiny hidden pool), NO object-metaphors for light (no coins,
ribbons, threads, jewels, sequins, discs), NO specific building as the hero (a dock, pier, or
footbridge is fine, a house or barn is not).

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
