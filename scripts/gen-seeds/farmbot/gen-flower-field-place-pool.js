#!/usr/bin/env node
/**
 * FarmBot — flower_field_place bespoke pool ("Flower Field Wandering" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE (summer-evening-by-the-pond)
 * and HARVEST_FESTIVAL_PLACE (harvest-festival). Must be a wide, open,
 * wildflower field — waves of blooms, a meandering path through them,
 * butterflies and bees, wind moving through the flowers — a pure
 * "wandering" leisure PLACE, never tied to a specific structure or building.
 *
 * Kept distinct from WORLD_DETAIL_PROPS's scattered flower mentions (those
 * are small garden/farmhouse accents, never a whole flower FIELD as the
 * hero of a shot) and from garden-vegetable-patch-tending (a tended,
 * cultivated garden bed) — this pool is a wild/semi-wild open MEADOW OF
 * FLOWERS, not a garden plot.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_flower_field_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct WIDE OPEN WILDFLOWER FIELD descriptions for a
cozy countryside bot — a wide, open field of wildflowers as a rich, living little world of its
own, entirely through its physical details. The flower field itself is ALWAYS the grammatical
subject named FIRST in the sentence.

CRITICAL — this is a whole FIELD, not a garden bed or a few flowers by a fence. Lean into
WIDE-OPEN hero imagery: waves of wildflowers rolling into the distance, a narrow meandering dirt
or grass path winding away through the blooms, tall grasses swaying, butterflies drifting between
blossoms, bees working the flowers, wind visibly moving through the field in rippling waves,
scattered wildflower colors (poppies, daisies, lupine, cosmos, cornflowers, buttercups), maybe a
distant tree line, a weathered wooden fence post or two at the field's edge, low stone wall,
far-off rolling hills, a single old apple tree standing alone in the blooms. Vary time of day
(soft morning light, high golden afternoon, warm early-evening glow), angle (looking down the
meandering path, a wide sweeping view across the whole field, close along the path's edge), which
wildflower colors dominate, and which lush details lead.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces,
hands, someone/anyone doing something, footprints (implies a walker just left), or any other word
implying a person is present or was recently present. Describe only the field, path, flowers,
insects, light, and weather — a beautiful open place with nobody in the frame yet.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A wide field of wildflowers ripples in waves of poppy-red and daisy-white under high golden
afternoon light, a narrow dirt path winding away through the blooms toward a distant tree line,
butterflies drifting lazily between the flower heads.", "Tall swaying grasses and drifts of
lupine and cornflower roll toward far-off hills in soft morning light, a weathered wooden fence
post leaning at the field's near edge, bees working steadily from bloom to bloom along a
grass-worn meandering path."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage, NO brand
names, NO photographer/camera-brand names, NO bare/empty field lacking flower/insect/wind detail,
NO tended garden-bed imagery (rows, raised beds, garden tools — that belongs to a different
scene), NO specific building or structure as the hero (a distant fence post or lone tree is fine,
a barn or house is not).

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
