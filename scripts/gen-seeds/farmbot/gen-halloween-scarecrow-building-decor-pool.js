#!/usr/bin/env node
/**
 * FarmBot — SEASONAL (Halloween) bespoke pool: DECOR
 * ("farmbot-halloween-scarecrow-building" path). See the sibling
 * gen-halloween-scarecrow-building-scarecrow-pool.js header for the full
 * architecture note (seasonal path, 4 bespoke axis pools).
 *
 * ONE small playful Halloween-season touch visible near the scarecrow-
 * building spot — a friendly grinning jack-o-lantern or two, a bundle of
 * cornstalks, a scatter of pumpkins, a leaf-and-pumpkin garland — never a
 * whole second scene competing with the scarecrow itself, and never
 * anything sinister (playful family-friendly Halloween only, matching the
 * whole fleet's Halloween content).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_scarecrow_building_decor.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct ONE-SMALL-TOUCH Halloween-season decor descriptions
for a cozy countryside anime bot — a single playful autumn/Halloween detail visible near a spot where
a scarecrow is being built, described entirely through its own physical presence. The decor item
itself is ALWAYS the grammatical subject named FIRST in the sentence.

Vary which of these leads each entry: a cluster of two or three grinning carved pumpkins with
triangle eyes and a jagged smile, a small wheelbarrow holding a few round orange pumpkins and pale
gourds, a bundle of dry cornstalks tied together with twine and leaned against a post, a short garland
of little fabric leaf-and-pumpkin shapes strung along a fence rail, a loose scatter of fallen
red-and-orange leaves, a wicker basket brimming with striped gourds and small pumpkins, a row of tiny
carved pumpkins with candle-glow lined along a fence top, a bale of hay with a single carved pumpkin
resting on top, a cluster of dried corn husks and a few acorns tucked at the base of a post. Every
carved-pumpkin face is cheerful and friendly — simple triangle or round eyes, a wide toothy or
scalloped grin, NEVER a scary or menacing expression. Vary time of day and light (warm golden
afternoon, soft grey overcast, cool early dusk with a warm candle-glow from within a pumpkin) roughly
evenly between warm and cool/overcast.

CRITICAL — this is a decor-item description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces (other
than a carved pumpkin's own painted/carved face), hands, someone/anyone doing something, or any other
word implying a person is present or was recently present.

CRITICAL — describe any cluster of similar objects (a group of pumpkins, a row of carved
jack-o-lanterns, a scatter of leaves) HOLISTICALLY as one arrangement, never with an individual
per-object action verb or personality given to any single piece within the cluster.

CRITICAL — describe light in plain, literal terms only (a warm glow, soft candle-glow from within,
cool grey daylight) — NEVER a metaphorical object-noun standing in for light. NEVER pair
"dark"/"darkness"/"shadow" with a light-implying word ("glint," "sparkle," "shimmer," "luminous,"
"glow") describing the same thing in one entry.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["A small cluster of grinning carved pumpkins sits in a row along the base of a fence post, each one
wearing a cheerful triangle-eyed, jagged-toothed smile in the warm afternoon light.", "A short garland
of little fabric leaf-and-pumpkin shapes is strung loosely along a weathered fence rail, swaying
gently under a soft grey overcast sky."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/hands/footprints), NO readable text/signage/lettering/numbers/carved
words of any kind, NO brand names, NO photographer/camera-brand names, NO scary/menacing/sinister
carved-pumpkin expressions — every face is cheerful and friendly, NO metaphorical light-as-object
language, NO dark+light contradictory pairing, NO per-object personification within a cluster, NO
whole competing second scene (a full festival/market/crowd-decor tableau — keep this to ONE small
touch, not a wide scene).

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
