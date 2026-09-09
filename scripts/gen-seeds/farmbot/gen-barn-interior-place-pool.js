#!/usr/bin/env node
/**
 * FarmBot — barn_interior_place bespoke pool ("Barn / Animal Shelter
 * Interior" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE, FLOWER_FIELD_PLACE,
 * HARVEST_FESTIVAL_PLACE, VILLAGE_STREET_PLACE, ARTISAN_WORKSHOP_PLACE.
 * Checked WORLD_DETAIL_PROPS directly first (per
 * FARMBOT_PATH_BUILD_STATE.md's "verify against the actual JSON, don't
 * trust a claim" lesson) — only 3/40 entries even mention "barn," and all
 * three describe rain barrels sitting BESIDE a barn door from the outside,
 * zero genuine interior detail (no hay loft, no stalls, no tools on the
 * wall, no slatted light) — confirming a bespoke pool is genuinely needed,
 * same reasoning documented on artisan-workshop.js/village-street-
 * wandering.js.
 *
 * The warm INTERIOR of a barn or animal shelter is the hero — hay lofts,
 * wooden stalls, tools hung on the wall, dappled light through slats. This
 * pool is 100% animal-free and people-free ON PURPOSE: the path's own
 * ANIMAL_COMPANIONS pick(s) and pickCharacter() pick carry all the living
 * content, composed at render time (same architecture as
 * village-street-wandering.js) — this pool is pure ARCHITECTURE/atmosphere.
 *
 * TWO EXTRA BANS baked in from the start (both discovered as bugs on OTHER
 * paths tonight, applied here proactively rather than found the hard way):
 *   1. Metaphorical light-as-object language ("coins of light") — found on
 *      orchard-afternoon's place pool, where "coin-dappled light" rendered
 *      as literal gold coins scattered on the ground. A barn interior's
 *      whole premise is dappled/slatted light, so this risk is unusually
 *      relevant here — banned any countable-object noun standing in for
 *      light (coins, beads, jewels, confetti, ribbons-as-objects); light
 *      must always be described as a continuous shaft/stripe/beam/pool
 *      falling across a surface, never as scattered discrete objects.
 *   2. Per-object personification of a REPEATED row of identical items
 *      (found on lakeside-riverside-moment: "eddies spiraling behind EACH
 *      rock" rendered as personified rock-faces peeking out of the water).
 *      A barn interior's own repeated elements — a row of stall doors, a
 *      row of tools on pegs, a row of hooks — carry the same risk if
 *      described with individual per-item agency verbs. Banned describing
 *      any repeated row of identical objects one-by-one with its own action;
 *      describe repeated elements collectively/holistically instead.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_barn_interior_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct WARM BARN / ANIMAL SHELTER INTERIOR descriptions for a
cozy countryside bot — the inside of a small, old, well-loved wooden barn or animal shelter as a rich,
living little world of its own, entirely through its physical details. The barn interior itself (a
stretch of it — the loft, a row of stalls, a corner with tools) is ALWAYS the grammatical subject
named FIRST in the sentence.

CRITICAL — this is about the BARN INTERIOR AND ITS ATMOSPHERE as the hero, not the animals inside it
and not any person. Lean into INTERIOR-hero imagery: a hay loft above with loose golden hay spilling
over its edge, a wooden ladder leaning up to the loft, rows of wooden stalls with half-doors and
worn iron latches, tools hung neatly on wall pegs (a pitchfork, a coiled rope, a lantern, a horse
brush, a scythe), a weathered wooden wheelbarrow, a stack of hay bales, a wooden feed trough or water
trough, a saddle or leather harness draped over a rail, horseshoes nailed above a doorway, warm
wooden support beams overhead, a broom leaned in a corner, a woven basket of eggs on a shelf, dust
motes drifting visibly in the light, worn floorboards scattered with loose straw. Vary time of day
and light quality (soft early-morning light, warm midday light, golden late-afternoon light, a single
lantern glowing at dusk), angle (looking down a row of stalls, close on the loft ladder and hay, a
corner with tools on the wall), and which lush details lead.

LIGHT LANGUAGE — the barn's dappled, slatted light is central to this pool's mood. Always describe it
as a CONTINUOUS shaft, stripe, beam, or pool of light falling across the floor, hay, or wall — NEVER
as a countable, scattered, or stackable object (do not write "coins of light," "beads of light,"
"jewels of light," "confetti of light," or similar noun-metaphors that name a physical object standing
in for light). "Long stripes of golden light fall across the straw-scattered floor" is correct;
"coins of light scatter the floor" is not.

REPEATED ELEMENTS — when a stretch of the barn shows several of the same thing in a row (stall doors,
tools on pegs, hooks, hay bales), describe that row COLLECTIVELY as one unified image, never by giving
each individual item its own separate action or personality ("a row of stall doors, latches worn
smooth by years of use" is correct; "one stall door creaks open eagerly, its neighbor waits patiently"
is not — objects in a row do not get individual agency).

CRITICAL — this is a PLACE description with NO people and NO animals in it at all, not even implied
ones. Do NOT mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces,
hands, someone/anyone doing something, footprints (implies a walker just left), or any animal by name
(no cow, goat, sheep, chicken, horse, pony, cat, dog, or any other creature) — the animals and any
person are added separately at render time; this pool is architecture and atmosphere only. A
harness/saddle/horseshoe/horse-brush hung on the wall as a TOOL is fine (it describes the space, not
a living animal); do not describe an animal actually present.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A hay loft opens above a row of worn wooden stalls, loose golden hay spilling gently over its edge, a weathered ladder leaning against the beam beside it, long stripes of soft morning light falling across the straw-scattered floorboards below.", "A corner of the barn holds a neat row of tools hung on wall pegs — a pitchfork, a coiled length of rope, an old tin lantern — their handles worn smooth, warm afternoon light pooling across the wooden floor beneath them."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO animals of any kind (cow/goat/sheep/chicken/
horse/pony/cat/dog/any creature — even implied ones like "hoofprints" or "feathers"), NO readable
text/signage/lettering/numbers of any kind, NO brand names, NO photographer/camera-brand names, NO
bare/empty barn lacking hay-loft/stall/tool/light detail, NO countable-object metaphors standing in
for light (coins/beads/jewels/confetti of light — light is always a continuous shaft/stripe/beam/
pool), NO describing a repeated row of identical objects with individual per-item agency or
personality (describe rows collectively).

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
