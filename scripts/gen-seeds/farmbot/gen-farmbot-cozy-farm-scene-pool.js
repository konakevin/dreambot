#!/usr/bin/env node
/**
 * FarmBot prototype (prototyped on AlphaBot) — cozy-farm-scene MVP subject pool.
 *
 * Kevin (2026-09-07): FarmBot's subject matter is a genuine mashup — Hay Day's
 * game content (farm stand/shop, decorations, farmhouse, deliveries) blended
 * with cozy-anime farm slice-of-life (laundry lines, sleepy porch cats, rural
 * bus stops, quiet countryside moments) — NOT two separate categories, one
 * blended pool where any entry can lean either way or both.
 *
 * This is the FIRST prototype path, built specifically to have something real
 * to test the new look-register pool through — not yet the final path roster.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot-cozy-farm-scene_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct COZY FARM SCENE descriptions for a new bot that
blends TWO inspirations into one register: (A) Hay Day-style farm-sim content
— a laden roadside farm stand/shop, decorative fences and flowerbeds, a tidy
farmhouse, a red barn, a windmill or silo, neat crop rows, an orchard, a duck
pond, a boat/train/truck delivery, a lively market-day town square — and (B)
cozy "iyashikei" slice-of-life anime farm content — laundry drying on a line
in the breeze, a cat asleep in a sunbeam on a porch, a quiet rural bus stop,
tea steaming on a veranda, a well in a garden, chickens pecking in a yard, a
scarecrow in golden light, a barn door open to warm hay-dust light. Every
entry should draw from (A), (B), or blend both — vary widely, no two entries
should feel like the same place restated. Each entry is a SCENE/PLACE
description only (structure + mood + one or two evocative details) — NO
mention of specific animals-as-hero or people, those are separate axes
layered in separately. 20-35 words each, warm and inviting, golden-hour or
soft-morning light implied where natural. Examples:
["A wooden roadside farm stand piled with baskets of ripe produce and jars of preserves, cheerful bunting strung overhead, catching the golden afternoon light.", "A quiet garden well beside a red barn, laundry drifting on a line in the breeze, a cat dozing in a warm patch of afternoon sun on the porch steps."]

🚫 STRICT BANS: NO named people/characters, NO specific hero animal (a
separate axis handles that), NO brand names, NO readable text or signage
or price tags or chalkboards of any kind — describe produce and decoration
only, never a sign, NO photographer/camera-brand names.

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
