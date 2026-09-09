#!/usr/bin/env node
/**
 * FarmBot — hero-animal-spotlight path (Creature, MVP-25).
 *
 * ONE animal as the close-up character-forward hero. Three axes combine so
 * the SAME animal never feels locked to one enclosure/pose — species,
 * setting, and action are all independently rolled:
 *   - farmbot_animal_species (BOT-WIDE, shared) — which animal + a brief
 *     physical/character descriptor. Also feeds herd-scene and
 *     farmyard-together once those are built, so this pool is written to be
 *     reused, not path-specific.
 *   - farmbot_hero_animal_setting (path-level) — WHERE, varied (never just
 *     "standing in a pen").
 *   - farmbot_hero_animal_action (path-level) — WHAT it's doing, for real
 *     dynamism instead of a static portrait.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_animal_species.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct FARM ANIMAL descriptions for a cozy farm-life bot —
each entry names ONE specific farm animal (a real species/breed, not generic
"animal") with a brief physical/character descriptor that gives it
personality. Rotate widely across: goats, cows, chickens/hens/roosters, pigs,
sheep/lambs, ducks, rabbits, horses/ponies, farm cats, farm dogs, geese,
turkeys, donkeys, and honeybees — vary breed/color/marking within each
species too (a floppy-eared brown-and-white goat vs a shaggy black-and-white
one), so no two entries feel like the same animal restated. Each entry names
the animal + ONE vivid physical/character detail (markings, expression,
texture, size) — NOT a setting, NOT an action, those are separate axes.
15-25 words each. Examples:
["A floppy-eared brown-and-white nubian goat with curious amber eyes and a small tuft of chin fur.", "A round, dozy Jersey cow with soft caramel fur and long dark lashes framing gentle eyes."]

🚫 STRICT BANS: NO named people, NO setting/place words, NO action verbs
(save those for the action axis), NO brand names, NO photographer names.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_hero_animal_setting.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SETTING descriptions for a hero-animal close-up
shot on a cozy farm-life bot — WHERE the animal is, not what it's doing or
which animal it is. Vary widely so a hero animal is NEVER locked to one kind
of place: a sunny pasture corner, a barn doorway with light spilling out, a
garden path between flowerbeds, the edge of a duck pond, a patch of clover
in dappled shade, a hayloft window, a rustic wooden fence line, a dirt path
through crop rows, a porch step, the shade of a big farm tree. Blend Hay Day
tidiness with cozy-anime softness (mist, golden light, quiet). 15-30 words
each, structure/place only. Examples:
["A sunlit corner of a fenced pasture, wildflowers dotting the grass, a weathered wooden fence post nearby.", "The open doorway of a red barn, warm hay-dust light spilling out onto the yard."]

🚫 STRICT BANS: NO animal names, NO action verbs, NO people, NO brand names.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_hero_animal_action.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct ACTION/POSE descriptions for a hero-animal close-up
shot on a cozy farm-life bot — WHAT the animal is doing, written generically
enough to apply to any farm animal (no species named). Vary widely for real
dynamism, not a static portrait: mid-hop or mid-trot, curiously peering
toward the viewer, napping in a warm sunbeam, nose-deep in a flower or patch
of clover, shaking off water, stretching, playfully nudging something,
watching something just out of frame with ears perked, mid-yawn, rolling in
soft grass. 10-20 words each, action/pose only — no setting, no species.
Examples:
["mid-hop over a low fence rail, ears flopping, one back leg still lifted", "curled up napping in a warm patch of sunlight, one ear twitching"]

🚫 STRICT BANS: NO animal names, NO setting words, NO people, NO brand names.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.`,
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
