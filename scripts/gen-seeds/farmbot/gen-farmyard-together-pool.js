#!/usr/bin/env node
/**
 * FarmBot — farmyard-together path (Creature, MVP-25).
 *
 * Deliberately MIXED species coexisting naturally in one wide farmyard
 * shot (Kevin 2026-09-07: "intermingle naturally... without strictly
 * enforcing species segregation"). One coherent-scene pool (not
 * independent axes) since a believable multi-species vignette needs to be
 * written as a whole, not assembled from unrelated parts.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_farmyard_together_scenes.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct MIXED-SPECIES FARMYARD scene descriptions
for a cozy farm-life bot — 2-4 DIFFERENT farm animal species coexisting
naturally together in one place (a goat and a couple of hens sharing a
sunny patch, a cat dozing near a napping lamb, a duck waddling past a
grazing pony, a pig and a cluster of chicks sharing a mud puddle's edge).
The animals should feel like natural farmyard neighbors, not staged —
describe a believable shared moment (sharing a patch of shade, gathered
near the same fence, crossing paths on a path) in a specific farmyard
setting (a sunny paddock corner, beside a fence, near a barn door, in a
garden bed). Vary: which species combination, season, time of day,
weather, angle. 20-35 words each. Examples:
["A speckled goat naps in dappled shade beside the fence, two rust-feathered hens pecking quietly nearby while a curious duckling waddles past on its way to the pond.", "A gray tabby barn cat stretches out on a sun-warmed stone step, a woolly lamb dozing an arm's length away, a trio of chicks scratching in the dust between them."]

🚫 STRICT BANS: NO named people/characters, NO readable text or signage,
NO brand names, NO photographer/camera-brand names.

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
