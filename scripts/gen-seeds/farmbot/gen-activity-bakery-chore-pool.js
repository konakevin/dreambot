#!/usr/bin/env node
/**
 * FarmBot — activity pool, BAKERY-CHORE VARIETY (2026-09-09).
 *
 * Kevin: "why so many of people literally rolling a big ball of dough? lol"
 * Root cause: farmbot_activity.json had only 3 entries tagged chore+bakery,
 * and ALL THREE were near-duplicate "pressing/kneading a round of dough"
 * poses — zero real variety in the only "active baking" activity slot any
 * bakery-flavored path can draw from. This appends genuine variety: other
 * real baking/kitchen actions besides kneading, so the same pose stops
 * dominating every bakery render.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_activity.json'),
    total: 40,
    append: true,
    banHumanLanguage: false,
    metaPrompt: (n) => `Generate ${n} distinct ACTIVITY descriptions for a cozy countryside
bot — gerund-phrase actions with an IMPLIED human subject (no name, no pronoun needed, just
the action itself, same style as: "Hanging freshly washed linens on a line, smoothing each
fold with a gentle pat before letting the breeze take over."). This batch is specifically
BAKERY/KITCHEN chore variety — the pool already has 3 near-identical "kneading a round of
dough" entries, so NONE of these may be about kneading or pressing dough. Draw from other real
baking/kitchen actions: rolling out pastry with a wooden pin, glazing the top of a cake with
a brush, carefully piping frosting along the edge of a cake, pulling a tray of golden rolls
from the oven with mitted hands, ladling soup into a bowl, stirring a simmering pot slowly,
arranging fresh-baked bread on a cooling rack, dusting powdered sugar over a finished pastry,
crimping the edge of a pie crust, sliding a tray into the oven, whisking batter in a large
bowl, sorting fresh berries into a basket for a pie, wrapping a warm loaf in a cloth, sealing
a jar of fresh preserves.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["chore", "bakery"], "description": "..."}

Every entry gets exactly these two tags: "chore" and "bakery".

Examples:
[{"tags": ["chore", "bakery"], "description": "Rolling out a sheet of pastry dough with a wooden pin, the motion slow and even, flour dusting the air with each pass."}, {"tags": ["chore", "bakery"], "description": "Carefully piping a ribbon of frosting along the top edge of a layer cake, tongue caught between teeth in concentration."}, {"tags": ["chore", "bakery"], "description": "Pulling a tray of golden rolls from the oven with a pair of thick mitts, steam curling up into the warm kitchen air."}]

🚫 STRICT BANS: NO kneading/pressing dough (that's already covered), NO named individuals, NO
readable text, NO brand names, NO photographer/camera-brand names, NO age words.

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
