#!/usr/bin/env node
/**
 * FarmBot — farm-stand path (Place, MVP-25).
 *
 * A roadside farm stand / produce shop as the hero of the shot — the single
 * most Hay Day-coded location (unlocking the shop, decorating the stand).
 * No readable text/signage/price tags — never mention them, positive-only.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_farm_stand_scenes.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct ROADSIDE FARM STAND scene descriptions for a
cozy farm-life bot. The stand itself is ALWAYS the hero — a small wooden
roadside stall or shop-front piled with produce and decoration. Blend TWO
inspirations: (A) Hay Day-style farm-sim iconography — tidy wooden crates
stacked with colorful vegetables and fruit, hanging bundles of dried herbs
or flowers, a striped awning, wicker baskets overflowing with produce, a
row of jam jars or honey pots — and (B) cozy iyashikei slice-of-life mood —
warm afternoon light, a light breeze stirring bunting, the particular
stillness of a stand between customers. Vary: time of day, season's produce
(spring flowers, summer berries, autumn pumpkins/gourds/corn), weather,
angle (straight-on, three-quarter, close on one crate). An animal MAY
appear incidentally (a cat napping under the counter, a hen pecking nearby)
in roughly a quarter of entries — never the hero. CRITICAL: the STAND (or a
stand detail — its counter, its crates, its awning) must ALWAYS be the
grammatical subject named FIRST in the sentence; an incidental animal may
appear ONLY in a trailing clause, NEVER as the sentence's opening subject.
20-35 words each. Examples:
["A weathered wooden farm stand piled high with striped pumpkins and bundled corn husks, a faded red-and-white awning fluttering overhead in the autumn breeze.", "Crates of glossy red tomatoes and bunched basil line the farm stand's counter, morning light catching the dew still beaded on the leaves."]

🚫 STRICT BANS: NO named people/characters, NO hero animal (incidental
only, per above), NO readable text or signage or price tags or chalkboards
of any kind — describe produce and decoration only, never a sign, NO brand
names, NO photographer/camera-brand names.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.`,
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
