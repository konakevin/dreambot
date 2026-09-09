#!/usr/bin/env node
/**
 * FarmBot — season shared pool (rebuild, 2026-09-08).
 *
 * Shared across many paths (see FARMBOT_CREATIVE_DIRECTION.md section 10).
 * A short seasonal-signature detail, evenly split across all 4 seasons, so
 * paths can lock a season (e.g. "Autumn village market") or roll freely.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_season.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SEASONAL DETAIL descriptions for a cozy
countryside bot — a short phrase capturing one season's signature look, EVENLY split across
all 4 seasons (${n / 4} each).

Spring: cherry blossoms, baby animals, seedlings, wildflowers, fresh green fields.
Summer: sunflowers, strawberries, tall grass, warm sunlight, lakeside greenery.
Autumn: pumpkins, apples, falling leaves, harvest baskets, hay, warm golden fields.
Winter: soft snow, frost, warm farmhouse glow against the cold, bare gentle branches.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["autumn"], "description": "..."}

Tags: exactly ONE season tag per entry from "spring", "summer", "autumn", "winter".

Examples:
[{"tags": ["spring"], "description": "Cherry blossom petals drifting past a row of tiny green seedlings just breaking soil."}, {"tags": ["winter"], "description": "Soft snow blanketing every rooftop, a warm window glowing gold against the white."}]

🚫 STRICT BANS: NO readable text, NO brand names, NO photographer/camera-brand names, NO named
people, NO harsh/bleak winter framing (cozy snow, never a blizzard or storm).

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
