#!/usr/bin/env node
/**
 * FarmBot — animal_companions shared pool (rebuild, 2026-09-08).
 *
 * Shared across many paths (see FARMBOT_CREATIVE_DIRECTION.md section 4).
 * Animals as a MAJOR SIGNATURE — density-tagged clusters with real behavior
 * and personality, baby-animal-biased. Animals as characters, not scenery.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_animal_companions.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct ANIMAL-COMPANION descriptions for a cozy
countryside bot. Each describes one cluster of farm/companion animals with a DENSITY level and
real BEHAVIOR — animals as characters with personality, never just background scenery.

Density tiers (roughly EVEN split across the ${n} entries):
- "low" — 1-2 animals
- "medium" — 3-5 animals
- "high" — 6-10 animals
- "chaos" — an entire menagerie, comically abundant ("why are there twelve animals here")

Draw species from: cows, calves, sheep, lambs, goats, baby goats, pigs, piglets, horses,
ponies, chickens, chicks, roosters, ducks, ducklings, geese, rabbits, bunnies, farm dogs,
puppies, farm cats, kittens — bias HEAVILY toward BABY animals (chicks, ducklings, lambs,
piglets, calves, baby goats, kittens, puppies, baby rabbits).

Give each cluster real BEHAVIOR and personality (curious, playful, sleepy, mischievous,
affectionate, shy, excited, gentle): nuzzling, following, peeking through a window, chasing
butterflies, sleeping in hay, playing together, wandering through a garden, gathering at
feeding time.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["medium"], "description": "..."}

Tags: exactly ONE density tag per entry from "low", "medium", "high", "chaos".

Examples:
[{"tags": ["low"], "description": "A single fluffy lamb trotting alongside, one ear flopped over, nuzzling in for attention."}, {"tags": ["chaos"], "description": "A dozen animals — piglets, chicks, a calf, two kittens — trailing behind in a chaotic, delighted parade, tumbling over each other to keep up."}]

🚫 STRICT BANS: NO aggressive or wild animals, NO readable text, NO brand names, NO
photographer/camera-brand names, NO named people.

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
