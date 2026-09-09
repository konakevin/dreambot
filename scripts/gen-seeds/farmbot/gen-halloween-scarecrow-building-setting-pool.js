#!/usr/bin/env node
/**
 * FarmBot — SEASONAL (Halloween) bespoke pool: SETTING
 * ("farmbot-halloween-scarecrow-building" path). See the sibling
 * gen-halloween-scarecrow-building-scarecrow-pool.js header for the full
 * architecture note (seasonal path, 4 bespoke axis pools).
 *
 * The specific quiet outdoor spot where the scarecrow is being built/dressed
 * — a single intimate location, NOT a wide community-gathering scene (that
 * register belongs to harvest-festival's own bespoke place pool) and NOT an
 * ornamental flower/cottage garden (WORLD_DETAIL_PROPS already owns that
 * register) and NOT the established, ripe, leafy vegetable-row register
 * VEGETABLE_GARDEN_PLACE already owns.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_scarecrow_building_setting.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct AUTUMN FARM SETTING descriptions for a cozy
countryside anime bot — the specific quiet outdoor spot where a scarecrow is being built or dressed
for the season. The setting itself is ALWAYS the grammatical subject named FIRST in the sentence.

Vary which of these leads each entry: the edge of a golden cornfield with tall dry stalks rustling
just beyond, a small pumpkin patch with pumpkins still resting on the vine nearby, a fenced garden
plot at the edge of a farmhouse yard, a stretch of stubbled harvested field with a bare wooden
crossbar post waiting to be dressed, a sunny barnyard corner near an open barn door, a quiet spot
along a low picket fence bordering a vegetable row, a grassy patch beside a weathered toolshed. Ground
each setting with concrete physical detail: a wooden crossbar or fence post sunk into the earth, a
basket of loose golden straw and a folded burlap sack waiting nearby, a scatter of fallen autumn
leaves, a nearby wheelbarrow or garden cart, sunlit or dappled grass underfoot, a low stone or picket
fence line, a distant rooftop or barn silhouette at the edge of view. Vary time of day within early-to-
mid autumn (crisp golden midday, soft warm late-afternoon, cool grey overcast, misty early morning,
early cool-blue dusk — mix WARM and COOL/OVERCAST light roughly evenly, not just sunny) and viewpoint
(close on the post and its waiting materials, a wider view across the field toward the spot, low
across the grass).

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands,
someone/anyone doing something, or any other word implying a person is present or was recently
present. A basket of straw or a leaning fence post is fine (an object simply there) — do not describe
anyone having just set it down.

CRITICAL — describe any cluster of similar small objects (a scatter of fallen leaves, a run of fence
posts) HOLISTICALLY as one arrangement, never with an individual per-object action verb or
personality given to any single piece.

CRITICAL — describe light in plain, literal terms only (a warm glow, soft grey daylight, cool misty
air, golden light) — NEVER a metaphorical object-noun standing in for light (no "coins of light,"
"ribbons of gold"). NEVER pair "dark"/"darkness"/"shadow" with a light-implying word ("glint,"
"sparkle," "shimmer," "luminous," "glow") describing the same thing in one entry.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["The edge of a golden cornfield opens onto a small cleared patch of stubbled grass, a bare wooden
crossbar post already sunk upright into the earth, a woven basket of loose straw resting at its base
in the crisp midday light.", "A quiet corner of the farmhouse yard sits along a low picket fence, a
folded burlap sack and a coil of twine set on an overturned crate beside a fence post, fallen orange
leaves scattered loosely across the grass under a soft grey overcast sky."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/lettering/numbers of
any kind, NO brand names, NO photographer/camera-brand names, NO ornamental flower/cottage-garden
framing (lavender/roses/foxglove/wind chimes — that belongs to a different pool), NO full
festival/crowd-decor imagery (a hay-bale maze, a corn-maze archway, a bonfire, a string-light-hung
wagon — that belongs to harvest-festival, a different path); keep this a single quiet, intimate spot,
never a wide community-gathering scene. NO metaphorical light-as-object language, NO per-object
personification, NO dark+light contradictory pairing.

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
