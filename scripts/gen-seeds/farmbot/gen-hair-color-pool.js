#!/usr/bin/env node
/**
 * FarmBot — hair_color shared pool (new, 2026-09-08).
 *
 * Atomic appearance axis (color only, no style) — combined with
 * character_archetype + hairstyle + eye_color + skin_tone at render time
 * so the cast doesn't collapse into "the same person every time."
 * Not gender-tagged — hair color doesn't correlate with gender.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_hair_color.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HAIR COLOR descriptions for young-adult anime
villager characters — COLOR only, no style or length mentioned. Cover a genuinely wide, natural
range: warm honey-blonde, deep chestnut brown, rich chocolate brown, soft caramel, copper-red,
strawberry-blonde, warm auburn, jet black, soft charcoal-black, ash brown, golden blonde,
sandy brown, deep burgundy-brown, warm dark brown with reddish undertones.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["ANY"], "description": "..."}

Tags — every entry gets "ANY" (hair color is not gender-specific).

Examples:
[{"tags": ["ANY"], "description": "Warm honey-blonde, catching the light with soft golden highlights."}, {"tags": ["ANY"], "description": "Deep chocolate brown, rich and even in tone."}, {"tags": ["ANY"], "description": "Copper-red with warm auburn undertones."}]

🚫 STRICT BANS: NO style or length words (no "wavy," "long," "braided" — that's a separate
axis), NO age-coding (no "grey," "silver," "white"), NO ethnic or national labels of any kind,
NO readable text, NO brand names, NO named people.

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
