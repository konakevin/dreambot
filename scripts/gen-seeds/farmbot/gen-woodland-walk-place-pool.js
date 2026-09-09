#!/usr/bin/env node
/**
 * FarmBot — woodland_walk_place bespoke pool ("Woodland Walk" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE (summer-evening-by-the-pond)
 * and FLOWER_FIELD_PLACE (flower-field-wandering). Must be a small, gentle,
 * FRIENDLY storybook woodland — dappled light through leaves, a winding dirt
 * path, moss-covered stones, small non-threatening woodland creatures woven
 * in as ambient detail (rabbits, birds, squirrels — never anything
 * scary/predatory), the occasional cozy tree-hollow detail.
 *
 * Follows the pond/flower-field pattern of weaving ambient wildlife directly
 * into the PLACE description itself (frogs/dragonflies for the pond,
 * butterflies/bees for the flower field) — the separate shared
 * ANIMAL_COMPANIONS layer is a distinct optional "featured animal moment" on
 * top, not a replacement for this.
 *
 * Kept distinct from any dark/deep/wild-forest imagery — this is always a
 * SMALL, FRIENDLY, storybook-scale woodland a person could happily wander
 * through, not a vast or foreboding forest.
 *
 * Lesson applied (per FARMBOT_PATH_BUILD_STATE.md, orchard-afternoon):
 * metaphorical light language ("coins of light") can render as the LITERAL
 * object — this pool bans that outright and requires literal, non-object
 * phrasing for dappled light ("pools of light," "patches of light," "dappled
 * light," "a warm glow").
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_woodland_walk_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL, FRIENDLY STORYBOOK WOODLAND descriptions for a
cozy countryside bot — a small, gentle woodland as a rich, living little world of its own, entirely
through its physical details. The woodland itself is ALWAYS the grammatical subject named FIRST in
the sentence.

CRITICAL — this is a SMALL, FRIENDLY, storybook-scale woodland, never a vast, dark, or foreboding
forest. Lean into cozy, welcoming hero imagery: sunlight breaking through a leafy canopy in dappled
patches and pools of light on the forest floor, a winding dirt or leaf-strewn path curling between
the trees, moss-covered stones and mossy fallen logs, ferns unfurling low to the ground, dappled
clearings, a cozy hollow at the base of an old tree (sometimes with a tiny painted door or a nest
tucked inside), toadstools and mushrooms clustered at tree roots, a shaft of light landing on a
particular patch of moss, birdsong drifting through the leaves. Weave in small, gentle, NEVER
scary/predatory woodland creatures as ambient detail woven into the scene itself — rabbits pausing
at the path's edge, small birds flitting between branches or perched on a mossy stone, squirrels
darting up a trunk or pausing with an acorn, a chipmunk peeking from a root hollow. Vary time of day
(soft morning light filtering through, warm dappled midday, golden late-afternoon light through the
leaves), angle (looking down the winding path, a wide view of the clearing, close on a mossy stone
or tree-hollow detail), which trees dominate (birch, oak, mossy pine), and which cozy detail leads.

CRITICAL — light/atmosphere language must stay LITERAL, never a figurative object-metaphor. Say
"pools of light," "patches of light," "dappled light," "a warm glow," or similar literal phrasing.
NEVER describe light as "coins," "ribbons," "confetti," "beads," or any other object-noun metaphor —
that language renders as the LITERAL object scattered on the ground, not as light.

CRITICAL — this is a PLACE description with NO humans in it at all, not even implied ones, and NO
scary or predatory animals. Do NOT mention: figures, crowd, riders, children, kids, bystanders,
onlookers, laughter, faces, hands, someone/anyone doing something, footprints (implies a walker
just left), or any other word implying a person is present or was recently present. Do NOT mention
foxes, owls, wolves, hawks, snakes, spiders, bats, or any predator/nocturnal-hunter animal — only
gentle creatures: rabbits, small songbirds, squirrels, chipmunks, butterflies. Describe only the
woodland, path, trees, moss, light, small creatures, and weather — a beautiful, welcoming, friendly
place with nobody in the frame yet.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A small, sun-dappled woodland path winds between mossy birch trunks, warm patches of light
scattered across a carpet of ferns and fallen leaves, a fat grey squirrel pausing mid-trunk with an
acorn while a pair of small birds flit overhead.", "A cozy hollow at the base of an ancient oak
sits half-hidden behind a cluster of toadstools, moss-softened stones scattered along a winding
leaf-strewn path, morning light pooling gently on the forest floor as a rabbit pauses at the path's
edge."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage, NO brand
names, NO photographer/camera-brand names, NO bare/empty woodland lacking a specific tree/moss/
light/creature detail, NO dark/deep/foreboding/wild-forest imagery, NO predator or scary animals
(fox, owl, wolf, hawk, snake, spider, bat), NO figurative object-metaphors for light (coins,
ribbons, confetti, beads — literal "pools"/"patches"/"dappled" language only), NO specific building
as the hero (a tree hollow or mossy stone is fine, a cabin or house is not).

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
