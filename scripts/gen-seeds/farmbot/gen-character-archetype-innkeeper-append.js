#!/usr/bin/env node
/**
 * FarmBot — character_archetype pool, INNKEEPER APPEND (2026-09-09).
 * Follow-up to gen-character-archetype-fisher-innkeeper-append.js, which
 * only produced fisher entries. Additive only.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_character_archetype.json'),
    total: 39,
    append: true,
    banHumanLanguage: false,
    metaPrompt: (n) => `Generate ${n} distinct CHARACTER descriptions, ALL of them an INNKEEPER
who runs a small, cozy village inn's common room — a warm, approachable, cute young-adult
anime-villager archetype, never a named individual.

Describe ONLY: their outfit (with one small charm-detail), their pose/demeanor, and their
expression. Warm, friendly, approachable: gentle smile, soft kind features, relaxed playful
pose, wholesome charming clothing — never stern, rugged, or intimidating.

CRITICAL — do NOT mention hair color, hairstyle, eye color, or skin tone AT ALL.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["bakery", "leisure", "ANY", "female"], "description": "..."}

Tags — every entry gets "bakery", "leisure", "ANY", plus exactly one gender tag, split evenly.

Examples:
[{"tags": ["bakery", "leisure", "ANY", "female"], "description": "A warm-natured innkeeper in a simple collared dress with a bar towel slung over one shoulder, leaning both palms on the counter edge with a welcoming, easy grin."}, {"tags": ["bakery", "leisure", "ANY", "male"], "description": "A cheerful innkeeper in a well-worn waistcoat over a rolled-sleeve shirt, wiping a mug with a cloth, a relaxed unhurried smile and a friendly nod."}]

🚫 STRICT BANS: NO named individuals, NO stern/rugged/intimidating framing, NO modern clothing,
NO readable text, NO brand names, NO age words of any kind, NO hair color/hairstyle/eye color/
skin tone mentions.

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
