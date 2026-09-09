#!/usr/bin/env node
/**
 * FarmBot — character_archetype APPEND: potter + carpenter (2026-09-09).
 *
 * artisan-workshop path build found that despite the original character
 * pool's meta-prompt explicitly listing "weaver, potter, carpenter" as
 * archetype options (see gen-character-archetype-pool.js), the actual
 * generated pool only ever produced ONE matching entry ("weaver," tags
 * ["leisure","ANY","female"]) — zero potter, zero carpenter entries made it
 * through generation/dedup. Confirmed via a full grep of
 * farmbot_character_archetype.json before writing this. Appends exactly 4
 * new entries (potter x2, carpenter x2, one of each gender) so
 * artisan-workshop has real archetype variety to draw from, matching the
 * existing pool's format/tag conventions exactly (outfit + pose + demeanor
 * only, no hair/eye/skin mentions, gender tag + "leisure"/"ANY" like the
 * existing weaver entry). Additive only — does not touch or remove any
 * existing entry.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_character_archetype.json'),
    total: 31, // 27 existing + 4 new (potter x2, carpenter x2)
    append: true,
    banHumanLanguage: false,
    metaPrompt: (n) => `Generate ${n} distinct CHARACTER descriptions for a cozy, idyllic
countryside-village bot. Each is a warm, approachable, cute young-adult anime-villager artisan
archetype — NEVER a named individual, always a type/role. This batch is specifically POTTER and
CARPENTER archetypes only (the pool already has plenty of farm/bakery/market roles, and exactly
one weaver, but zero potter or carpenter entries) — write ONLY potters and carpenters, an even mix
of both roles and both genders across the batch. EVERY character is a YOUNG ADULT — roughly
early-to-mid twenties, the same easy energy as any of the others. Do NOT write elderly/grandma/
grandpa archetypes at all.

Describe ONLY: their outfit (with one small charm-detail — a clay-smudged apron, rolled-up
sleeves, a leather tool belt, sawdust dusting a sleeve), their pose/demeanor (at ease, mid-craft
or paused from it), and their expression. Every character is warm, friendly, approachable: gentle
smile, soft kind features, relaxed playful pose, wholesome charming clothing — never stern,
rugged, or intimidating.

CRITICAL — do NOT mention hair color, hairstyle, eye color, or skin tone AT ALL. Those are
handled by separate axes and combined in afterward — if you mention them here it creates
conflicts. Describe outfit + pose + expression only.

Output a JSON array of ${n} OBJECTS, each shaped exactly like:
{"tags": ["leisure", "ANY", "female"], "description": "..."}

Tags — EVERY entry gets exactly one gender tag, "male" or "female", PLUS "leisure" and "ANY" (same
tag combination as the pool's existing weaver entry — versatile artisan roles fit almost any quiet
scene).

Examples:
[{"tags": ["leisure", "ANY", "female"], "description": "A potter in a clay-smeared canvas apron over a simple linen dress, sleeves pushed past the elbow, a faint smudge of pale clay dust along one forearm, sitting with a relaxed forward lean and a soft, content smile."}, {"tags": ["leisure", "ANY", "male"], "description": "A carpenter in a sturdy canvas work shirt with a leather tool belt slung low on his hips, a light dusting of sawdust across one shoulder, standing with arms loosely crossed and an easygoing, warm grin."}]

🚫 STRICT BANS: NO named individuals, NO stern/rugged/intimidating framing, NO modern clothing (no
jeans, sneakers, baseball caps, sunglasses), NO readable text, NO brand names, NO photographer/
camera-brand names, NO age words of any kind (elderly/grandma/grandpa/young/old/wrinkled/
silver-haired), NO hair color/hairstyle/eye color/skin tone mentions, NO weaver/farmer/baker/other
non-potter-non-carpenter roles.

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} (append) ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
