#!/usr/bin/env node
/**
 * FarmBot — food_and_baking shared pool (rebuild, 2026-09-08).
 *
 * Shared across many paths (see FARMBOT_CREATIVE_DIRECTION.md section 6).
 * Visually abundant, ridiculously inviting homemade food — warmth,
 * abundance, home.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_food_and_baking.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct FOOD/BAKING descriptions for a cozy countryside
bot — visually abundant, warm, ridiculously inviting homemade food and fresh ingredients. Draw
from: fresh bread, apple/berry/pumpkin pie, pancakes, waffles, jam, honey, cheese, butter,
vegetable soup, fruit tarts, cookies, cakes, tea, lemonade, hot cocoa — and fresh ingredients:
strawberries, apples, peaches, cherries, blueberries, carrots, tomatoes, pumpkins, herbs,
mushrooms, honey, fresh eggs.

Every entry should communicate warmth, abundance, and home — steam curling off something warm,
jars catching the light, a basket overflowing, a lattice crust just out of the oven.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["bakery"], "description": "..."}

Tags — pick ALL that apply from: "bakery", "market", "farmhouse", "ANY".

Examples:
[{"tags": ["bakery", "ANY"], "description": "A fresh-baked loaf cooling on a windowsill, steam still curling off the golden crust."}, {"tags": ["market"], "description": "A neat row of honey jars catching the light on a rustic market-stall shelf."}]

🚫 STRICT BANS: NO readable text/labels, NO brand names, NO photographer/camera-brand names,
NO named people.

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
