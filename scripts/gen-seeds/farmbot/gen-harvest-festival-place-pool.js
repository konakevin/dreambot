#!/usr/bin/env node
/**
 * FarmBot — harvest_festival_place bespoke pool ("Harvest Festival" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE (summer-evening-by-the-pond).
 * Must be a joyful HARVEST-SPECIFIC community-gathering scene — always a
 * whole living, decorated little world, never a bare field.
 *
 * Kept deliberately distinct from two neighboring paths per Kevin's brief:
 *   - autumn-village-market (market-stall goods for sale — baskets of
 *     produce laid out to buy) — this pool is NOT about a market stall.
 *   - the future Phase-3 seasonal-festival autumn variant (lantern-festival /
 *     pumpkin-festival DECOR imagery) — this pool is NOT about lanterns or
 *     festival decorations.
 * This pool leans into HARVEST-SPECIFIC hero imagery instead: hay bales,
 * corn stalks / corn-maze energy, apple orchards, a wheelbarrow overflowing
 * with squash, scarecrows, a hay-bale maze — the actual work-and-play of
 * gathering the harvest, joyfully.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_harvest_festival_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct AUTUMN HARVEST FESTIVAL scene descriptions for a
cozy countryside bot — a joyful harvest-celebration PLACE, rendered as a rich, lively, decorated
little world, entirely through its physical objects and decorations. The harvest scene itself is
ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — lean into HARVEST-SPECIFIC hero imagery, never a bare field and never a market-stall
display. Vary which of these lead each entry: tall stacked hay bales (sometimes arranged into a
hay-bale maze), tall rustling corn stalks (a corn maze entrance, a corn-stalk archway), a wide
apple orchard with ladders and baskets, a wheelbarrow piled high and overflowing with fat orange
pumpkins and squash, a cheerful patchwork scarecrow standing watch, a hay wagon strung with warm
string lights (empty — no riders), a bonfire pit ringed with log seats, pumpkins scattered across
a field, a barn decorated with garlands of dried corn and gourds. Vary time of day within "autumn"
(golden late-afternoon through soft dusk), angle, and which lush details lead. Convey festivity
entirely through the OBJECTS and LIGHT — string lights glowing, bunting fluttering, woodsmoke
curling, warm golden light — never through depicting a crowd.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces,
hands, someone/anyone doing something, a horse PULLING something (implies a driver), or any
other word implying a person is present or was recently present. Describe only the setting,
objects, decorations, light, and weather — a fully-dressed, ready-for-celebration place with
nobody in the frame yet.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Tall golden hay bales stand stacked into a winding little maze, string lights looped between wooden posts and a wheelbarrow spilling over with fat orange pumpkins parked at the entrance, the low autumn sun turning everything amber.", "A rustling wall of tall corn stalks opens into a rounded archway entrance, dried corn husks and small gourds tied along the frame, an empty hay wagon strung with warm lights waiting just beyond in the golden late-afternoon light."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/onlookers/laughter/faces/hands), NO readable text/banners/signage, NO brand
names, NO photographer/camera-brand names, NO bare/empty field lacking harvest detail, NO
market-stall produce-for-sale displays (baskets of goods laid out to buy — that belongs to a
different scene), NO lanterns or lantern-glow or any festival string-lantern decor (that belongs
to a different scene).

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
