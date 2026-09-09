#!/usr/bin/env node
/**
 * FarmBot — pond_place bespoke pool (Phase 1, "Summer evening by the pond").
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as any Place path's dedicated pool. Must
 * be lush and richly detailed — the pond is a whole living, cared-for
 * little world, never a bare patch of water.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_pond_place.json'),
    total: 25,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SUMMER POND descriptions for a cozy countryside
bot — the pond and its immediate surroundings as a rich, lived-in little world, always in warm
summer light. The pond itself is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — the pond must never be a bare patch of water. Every entry lushly SURROUNDS it with
rich detail: reeds, cattails, water lilies, dragonflies, a weathered wooden dock or a few
smooth stepping stones, overhanging willow branches, wildflowers crowding the bank, a family of
ducks, frogs on lily pads, fireflies beginning to blink in the evening light. Vary: time within
"summer evening" (golden late-afternoon through soft twilight), angle (a dock reaching out over
the water, a grassy bank, a stone bridge), and which lush details lead.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A still summer pond glows amber in the low evening light, a weathered wooden dock reaching out over lily pads, dragonflies skimming the surface and a family of ducks gliding through the reflected gold.", "A glassy pond rests beneath a canopy of willow branches trailing into the water, smooth stepping stones crossing to a grassy bank thick with wildflowers, fireflies just beginning to blink on in the fading light."]

🚫 STRICT BANS: NO named people/characters, NO readable text, NO brand names, NO
photographer/camera-brand names, NO bare/empty water lacking surrounding detail.

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
