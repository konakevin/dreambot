#!/usr/bin/env node
/**
 * FarmBot — character_archetype pool, FISHER + INNKEEPER APPEND (2026-09-09).
 *
 * FARMBOT_CREATIVE_DIRECTION.md's planned archetype list (innkeeper/potter/
 * carpenter/fisher) never fully survived generation — only some made it
 * into the actual seeded pool. The `artisan-workshop` build already found
 * and fixed the potter/carpenter gap; this fixes the remaining two before
 * `fishing-dock` and any future inn-flavored path hit the same false
 * assumption. Additive only (append: true) — does not touch existing entries.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_character_archetype.json'),
    total: 35,
    append: true,
    banHumanLanguage: false,
    metaPrompt: (n) => `Generate ${n} distinct CHARACTER descriptions for a cozy, idyllic
countryside-village bot. Exactly HALF must be a FISHER (someone who tends a fishing dock/boat)
and HALF must be an INNKEEPER (someone who runs a small village inn's common room) — warm,
approachable, cute young-adult anime-villager archetypes, never named individuals.

Describe ONLY: their outfit (with one small charm-detail), their pose/demeanor, and their
expression. Every character is warm, friendly, approachable: gentle smile, soft kind features,
relaxed playful pose, wholesome charming clothing — never stern, rugged, or intimidating.

CRITICAL — do NOT mention hair color, hairstyle, eye color, or skin tone AT ALL. Those are
handled by separate axes and combined in afterward.

Output a JSON array of ${n} OBJECTS, each shaped exactly like:
{"tags": ["market", "leisure", "female"], "description": "..."}

Tags — EVERY entry gets exactly one gender tag ("male" or "female"), split evenly, PLUS
context tags: fisher entries get "market" + "leisure" (or "ANY"); innkeeper entries get
"bakery" + "leisure" (an inn's common room shares bakery's warm-hospitality context) + "ANY".

Examples:
[{"tags": ["market", "leisure", "female"], "description": "A cheerful fisher in a rolled-sleeve canvas shirt and patched waders, a small net looped over one shoulder, standing with an easy relaxed lean and a bright sun-warmed smile."}, {"tags": ["bakery", "leisure", "ANY", "male"], "description": "A warm-natured innkeeper in a well-worn waistcoat over a rolled-sleeve shirt, a bar towel slung over one shoulder, leaning both palms on a counter edge with a welcoming grin."}]

🚫 STRICT BANS: NO named individuals, NO stern/rugged/intimidating framing, NO modern clothing,
NO readable text, NO brand names, NO photographer/camera-brand names, NO age words of any kind
(elderly/grandma/grandpa/young/old/wrinkled/silver-haired), NO hair color/hairstyle/eye color/
skin tone mentions, NO animal-name-leading compound titles (the "horse keeper" pattern — never
lead a title with an animal's name directly before a person-noun).

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
