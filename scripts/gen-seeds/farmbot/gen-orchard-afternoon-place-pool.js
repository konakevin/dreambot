#!/usr/bin/env node
/**
 * FarmBot — orchard_afternoon_place bespoke pool ("Orchard Afternoon" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE (summer-evening-by-the-pond)
 * and HARVEST_FESTIVAL_PLACE (harvest-festival). Must be a lush, golden,
 * fruit-heavy orchard PLACE — a whole living, cared-for little world, never
 * a bare row of trees.
 *
 * Kept deliberately distinct from harvest-festival (which leans into
 * hay-bale/corn-maze/pumpkin harvest-CELEBRATION imagery, not orchard trees)
 * — this pool is squarely about the fruit orchard itself: rows of apple/
 * pear/peach trees, ladders, baskets of picked fruit, dappled afternoon
 * light through the leaves.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_orchard_afternoon_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct GOLDEN AFTERNOON FRUIT ORCHARD descriptions for a
cozy countryside bot — a lush, well-tended orchard PLACE, rendered as a rich, living little world,
entirely through its physical objects, trees, and light. The orchard itself is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — lean into ORCHARD-SPECIFIC hero imagery, never a bare row of trees and never a
harvest-festival/hay-bale/corn-maze scene (that belongs to a different path). Vary which of these
lead each entry: long rows of apple trees heavy with red and green fruit, pear trees with fruit
dangling low on bowed branches, peach trees glowing fuzzy-gold in the light, a wooden ladder leaned
against a trunk (empty — nobody on it), woven baskets brimming with just-picked fruit resting in
the grass, a wheelbarrow loaded with apples, wooden crates stacked at a row's end, dappled sunlight
falling through the leaf canopy in warm coins of light, a fallen apple or two in the tall grass, a
weathered picking bag hung on a fence post, bees drifting between blossoms or fruit, a checkered
picnic blanket spread beneath a tree, a rustic wooden gate at the orchard's edge, tall grass
between the tree rows, a quiet dirt path receding down the center of a row. Vary time within
"golden afternoon" (bright midday sun through soft late-afternoon glow), which fruit tree leads
(apple/pear/peach), angle, and which lush details lead.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, pickers, riders, children, kids, bystanders, onlookers, laughter, faces,
hands, footsteps, someone/anyone doing something, or any other word implying a person is present
or was recently present (a ladder leaned against a trunk is fine — do NOT say anyone climbed it or
is using it). Describe only the setting, trees, fruit, objects, light, and weather — a fully
lush, ready-to-be-enjoyed orchard place with nobody in the frame yet.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Long rows of apple trees stretch into the golden afternoon light, branches bowed low with red and green fruit, a wooden ladder leaned against the nearest trunk and a woven basket brimming with just-picked apples resting in the tall grass beside it.", "A row of peach trees glows fuzzy-gold in the warm afternoon sun, dappled light falling through the leaf canopy in soft coins across a checkered blanket spread beneath the branches, a few fallen peaches scattered in the grass nearby."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/pickers/riders/
children/kids/bystanders/onlookers/laughter/faces/hands/footsteps), NO readable text/signage, NO
brand names, NO photographer/camera-brand names, NO bare/empty rows lacking orchard detail, NO
hay bales/corn stalks/corn maze/pumpkins/scarecrows/bonfire/hay wagon (that belongs to a different
harvest-festival scene, not this one).

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
