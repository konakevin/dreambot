#!/usr/bin/env node
/**
 * FarmBot — skin_tone shared pool (new, 2026-09-08).
 *
 * Atomic appearance axis — combined with character_archetype + hairstyle +
 * hair_color + eye_color at render time so the cast doesn't collapse into
 * "the same person every time." Covers the FULL natural human range by pure
 * visual description (depth + undertone) — deliberately NO ethnic or
 * national labels anywhere in this pool. Not gender-tagged — skin tone
 * doesn't correlate with gender.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_skin_tone.json'),
    total: 15,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SKIN TONE descriptions for young-adult anime
villager characters. Describe purely by VISUAL DEPTH and UNDERTONE — never by ethnicity,
nationality, or region. Cover the FULL natural human range evenly: fair/porcelain, light with
warm undertones, light with cool/pink undertones, light golden-tan, warm tan, medium olive,
medium golden-brown, medium warm-brown, deep warm brown, deep rich brown, deep golden-brown,
very deep brown.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["ANY"], "description": "..."}

Tags — every entry gets "ANY" (skin tone is not gender-specific).

Examples:
[{"tags": ["ANY"], "description": "Fair skin with a warm, sun-kissed flush across the cheeks."}, {"tags": ["ANY"], "description": "Deep rich brown skin with a warm, healthy glow."}, {"tags": ["ANY"], "description": "Medium olive skin, smooth and even-toned."}]

🚫 ABSOLUTE BANS: NO ethnic labels, NO national or regional labels, NO race words of any kind
— describe ONLY depth (fair/light/medium/tan/deep/dark) and undertone (warm/cool/golden/olive/
rosy). NO readable text, NO brand names, NO named people, NO age-coding (no "weathered,"
"wrinkled").

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
