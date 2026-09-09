#!/usr/bin/env node
/**
 * FarmBot — hairstyle shared pool (new, 2026-09-08).
 *
 * Atomic appearance axis (style only, no color) — combined with
 * character_archetype + hair_color + eye_color + skin_tone at render time
 * so the cast doesn't collapse into "the same person every time."
 * Gender-tagged so a path can match it to the picked archetype's gender.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_hairstyle.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HAIRSTYLE descriptions for young-adult anime
villager characters — STYLE and LENGTH only, absolutely no color mentioned. Cover a genuinely
wide range for BOTH genders: loose waves, twin braids, a high ponytail, a low bun, a short
tousled crop, shoulder-length hair tucked behind one ear, a messy top-knot, a neat side part,
a single long braid over one shoulder, short and windswept, curly and voluminous, a simple
blunt bob, hair loosely gathered with a ribbon, wavy and just past the chin.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["female"], "description": "..."}

Tags — exactly one of "female", "male", or "ANY" (styles genuinely unisex — short crops, buns,
simple waves) per entry. Aim for roughly a third each.

Examples:
[{"tags": ["female"], "description": "Loose waves falling just past the shoulders, a few soft strands framing the face."}, {"tags": ["male"], "description": "A short, tousled crop, slightly windswept, one lock falling over the forehead."}, {"tags": ["ANY"], "description": "Hair gathered into a simple low bun, a few loose strands escaping at the nape."}]

🚫 STRICT BANS: NO color words of any kind, NO age-coding (no "grey," "silver," "thinning"),
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
