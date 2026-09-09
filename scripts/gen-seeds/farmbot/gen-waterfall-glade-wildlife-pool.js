#!/usr/bin/env node
/**
 * FarmBot — waterfall_glade_wildlife bespoke pool ("Waterfall Glade" path).
 *
 * Path-bespoke WILDLIFE set — the shared farmbot_animal_companions.json pool
 * is exclusively farmyard-baby-animal content (calves, baby goats — see
 * barn-animal-shelter-interior.js's header note) with no water-adjacent
 * creatures, and Kevin's brief specifically calls for "animals drinking or
 * playing nearby." Same reasoning as fishing-dock.js's DOCK_WILDLIFE, but
 * built as a FULL 120-entry pool (not a small inline array) per the current
 * fleet convention of full-depth seeding on new content, and used both as
 * the "featured animal moment" pull AND as the animalPool argument to
 * pools.pickPureSceneLife() for the guaranteed-life-in-pure-scene-renders
 * rule.
 *
 * Every entry is written HOLISTICALLY when describing more than one
 * creature (no per-object personification of a cluster), and gives the
 * animal genuinely comparable descriptive weight/detail to a character
 * description — this pool is drawn on to fill the "ANIMAL COMPANY" block,
 * which the path template places BEFORE the character block whenever both
 * are present (2026-09-09 animal-spotlight lesson, mirroring
 * barn-animal-shelter-interior.js's exact pattern).
 *
 * Same non-predator, non-scary-creature rule as woodland-walk-place — this
 * is a cute, gentle, welcoming FarmBot world.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_waterfall_glade_wildlife.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of GENTLE, CUTE ANIMALS drinking, playing,
or resting at a small countryside waterfall's clear pool, for a cozy countryside anime bot. The
animal (or animals) is ALWAYS the grammatical subject named FIRST in the sentence, described with
real, specific, loving detail — comparable in richness to how a human character would be described,
never a throwaway background mention.

Draw from (and vary freely beyond) this range: a young deer or fawn dipping its head to drink at
the pool's edge, a pair of rabbits pausing at the mossy bank, a small family of ducks paddling in
gentle circles on the still water, an otter sliding playfully down a smooth wet rock into the pool,
a fat orange salamander resting on a damp stone, a heron standing statue-still at the shallow edge, small
songbirds splashing and bathing together in a shallow puddle beside the main pool, a squirrel
pausing on an overhanging branch to watch the water below, a cluster of butterflies gathered at a
damp patch of mossy stone, a dragonfly or a pair of dragonflies hovering low over the still water,
a turtle sunning itself on a flat rock at the pool's edge, a family of goats from the nearby farm
having wandered down to drink at the water's edge, a barn cat perched curiously on a mossy stone
watching the fish, koi or small fish visible drifting beneath the clear surface, a chipmunk
crossing a row of stepping-stones.

CRITICAL — describe a GROUP of similar creatures (a family of ducks, a cluster of songbirds, a pair
of butterflies) HOLISTICALLY as one charming arrangement or group in motion — plain, warm physical
description only, never an individual per-creature action verb or personality singled out for any
one member of the group beyond the group's own shared behavior.

CRITICAL — only gentle, non-threatening, non-predatory animals: deer, rabbits, ducks, otters,
salamanders, herons, songbirds, squirrels, butterflies, dragonflies, turtles, farm goats, a barn
cat, fish. NEVER foxes, owls, wolves, hawks, snakes, spiders, bats, bears, or any predator/
nocturnal-hunter animal.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A small family of ducks paddles in slow, gentle circles on the still surface of the pool, their
soft quacking echoing lightly off the mossy rocks as the falling water tumbles behind them.", "A
young fawn dips its head to drink at the shallow edge of the pool, ears flicking, dappled sunlight
scattering across its spotted back where it stands among the smooth wet stones."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage, NO predator or
scary animals (fox, owl, wolf, hawk, snake, spider, bat, bear), NO bare/generic "an animal is here"
description lacking specific species/action/texture detail, NO cartoon face or human expression
drawn onto the animal (describe real, natural animal behavior and features only), NO dark+light
contradictory pairing (never pair "dark"/"shadow" with "glint"/"sparkle"/"shimmer"/"luminous"/
"glow" describing the same thing), NO metaphorical light-as-object language.

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
