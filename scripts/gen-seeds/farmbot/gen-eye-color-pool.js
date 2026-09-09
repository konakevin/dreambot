#!/usr/bin/env node
/**
 * FarmBot — eye_color shared pool (new, 2026-09-08).
 *
 * Atomic appearance axis — combined with character_archetype + hairstyle +
 * hair_color + skin_tone at render time so the cast doesn't collapse into
 * "the same person every time." Not gender-tagged — eye color doesn't
 * correlate with gender.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_eye_color.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct EYE COLOR descriptions for young-adult anime
villager characters. Cover a genuinely wide, natural range: warm brown, deep hazel, soft amber,
warm honey-brown, forest green, soft moss-green, warm blue, soft grey-blue, deep chestnut,
warm olive-green, dark brown, warm caramel-brown.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["ANY"], "description": "..."}

Tags — every entry gets "ANY" (eye color is not gender-specific).

Examples:
[{"tags": ["ANY"], "description": "Warm hazel, flecked with soft gold near the center."}, {"tags": ["ANY"], "description": "Deep forest green, calm and bright."}, {"tags": ["ANY"], "description": "Soft amber-brown, warm and expressive."}]

🚫 STRICT BANS: NO ethnic or national labels of any kind, NO readable text, NO brand names, NO
named people, NO fantastical colors (no violet, no red, no glowing).

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
