#!/usr/bin/env node
/**
 * FarmBot — activity shared pool (rebuild, 2026-09-08).
 *
 * Shared across many paths (see FARMBOT_CREATIVE_DIRECTION.md sections 5, 9).
 * Gentle chores AND pure leisure — the emphasis is the cozy moment, never
 * the work itself. "The joy of having nowhere to be" is as valid as a chore.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_activity.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct GENTLE ACTIVITY descriptions for a cozy
countryside bot — what a character might be doing, described as an ACTION/POSE phrase (not a
full scene). Two categories, roughly HALF each:

CHORES (gentle, never labor-intensive): gathering warm eggs into a basket, hanging laundry on
a line, watering flowers, picking strawberries, brushing a pony's mane, feeding chickens,
milking a cow by hand, sweeping a porch, arranging flowers, kneading bread dough, preparing a
picnic basket, filling a bird feeder.

LEISURE ("nothing happening" — the joy of having nowhere to be): sitting on a porch step with
a warm drink, reading beneath a tree, napping in fresh hay, watching the sunset, stargazing,
picking wildflowers, sitting beside a stream, watching fireflies, sharing a picnic blanket.

Every entry should read as ONE small, charming, unhurried moment — never work, always
contentment.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["chore", "farm"], "description": "..."}

Tags — exactly one of "chore" or "leisure", PLUS a context tag where relevant: "farm",
"bakery", "market", or "ANY" if it fits broadly.

Examples:
[{"tags": ["chore", "farm"], "description": "Gathering warm eggs into a wicker basket, one hand cupped protectively around a speckled shell."}, {"tags": ["leisure", "ANY"], "description": "Sitting on a porch step with a steaming mug, watching the light shift slow and golden."}]

🚫 STRICT BANS: NO labor-intensive/exhausting framing, NO readable text, NO brand names, NO
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
