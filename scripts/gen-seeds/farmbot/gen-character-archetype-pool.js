#!/usr/bin/env node
/**
 * FarmBot — character_archetype shared pool (REBUILT 2026-09-08 v2).
 *
 * Split appearance into ATOMIC axes (the SteamBot homogenization-trap fix
 * from BOT_SCENE_QUALITY_PLAYBOOK.md) — this pool is now ROLE + OUTFIT +
 * DEMEANOR only. Hairstyle, hair color, eye color, and skin tone are
 * separate shared pools (hairstyle/hair_color/eye_color/skin_tone),
 * combined at render time so the same archetype never looks like "the
 * same person" twice. Every entry is gender-tagged so a path can pick a
 * matching gendered hairstyle.
 *
 * Young adult only (Kevin 2026-09-08: "no old people over 40") — no
 * grandma/grandpa/elderly archetypes, no age words at all.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_character_archetype.json'),
    total: 120,
    append: true,
    banHumanLanguage: false,
    metaPrompt: (n) => `Generate ${n} distinct CHARACTER descriptions for a cozy, idyllic
countryside-village bot. Each is a warm, approachable, cute young-adult anime-villager
archetype — NEVER a named individual, always a type/role. Draw from: cheerful farm girl, cozy
farm boy, gardener, baker, shepherd, herbalist, village shopkeeper, flower seller, café owner,
innkeeper, weaver, potter, carpenter, fisher, horse keeper, a traveling adventurer who settled
down. EVERY character is a YOUNG ADULT — roughly early-to-mid twenties, the same easy energy as
any of the others. Do NOT write elderly/grandma/grandpa archetypes at all.

Describe ONLY: their outfit (with one small charm-detail — rolled-up sleeves, flour dust on an
apron, a patched hem, mismatched socks), their pose/demeanor, and their expression. Every
character is warm, friendly, approachable: gentle smile, soft kind features, relaxed playful
pose, wholesome charming clothing — never stern, rugged, or intimidating.

CRITICAL — do NOT mention hair color, hairstyle, eye color, or skin tone AT ALL. Those are
handled by separate axes and combined in afterward — if you mention them here it creates
conflicts. Describe outfit + pose + expression only.

Output a JSON array of ${n} OBJECTS, each shaped exactly like:
{"tags": ["farm", "female"], "description": "..."}

Tags — EVERY entry gets exactly one gender tag, "male" or "female", PLUS context tags that
genuinely apply: "farm" (fits a farm/pasture/barn scene), "bakery" (fits a bakery/kitchen
scene), "market" (fits a village market/shop scene), "animal" (naturally pairs with animal
care), "leisure" (fits a quiet porch/leisure scene), "ANY" (versatile, fits almost any scene).

Examples:
[{"tags": ["bakery", "ANY", "female"], "description": "A round-faced baker in a flour-dusted apron, sleeves pushed up past the elbow, warm open smile, a smear of flour brushed across one cheek."}, {"tags": ["farm", "animal", "male"], "description": "A soft-spoken shepherd leaning on a crook, wide-brimmed straw hat, a patient gentle smile, one ankle crossed over the other in a relaxed idle pose."}]

🚫 STRICT BANS: NO named individuals, NO stern/rugged/intimidating framing, NO modern clothing
(no jeans, sneakers, baseball caps, sunglasses), NO readable text, NO brand names, NO
photographer/camera-brand names, NO age words of any kind (elderly/grandma/grandpa/young/old/
wrinkled/silver-haired), NO hair color/hairstyle/eye color/skin tone mentions.

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
