#!/usr/bin/env node
/**
 * FarmBot — countryside-train path (Place, MVP-25).
 *
 * A rural train / countryside rail crossing as the hero place — the
 * Japan-rural representation gap-fix (2026-09-07). Place/atmosphere only,
 * no deliberate humans on this path.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_countryside_train_scenes.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct COUNTRYSIDE TRAIN scene descriptions for a
cozy farm-life bot, drawing specifically on the Japanese rural-train
iyashikei aesthetic (think a quiet single-track countryside line through
rice paddies, a small unmanned station platform, a level crossing with its
striped barrier). A train, a stretch of rural track, or a small station
platform is ALWAYS the hero of the shot. Vary: (A) a local train (a short
one- or two-car countryside train, pastel or cream-and-green livery)
passing through fields or crossing a small bridge, (B) an empty single
track curving through rice paddies or wildflower meadow toward distant
hills, (C) a small unstaffed platform with a bench and a vending machine
silhouette, (D) a level crossing with its striped barrier down, wildflowers
growing along the rail bed. Cozy iyashikei mood throughout — golden-hour
or blue-hour light, cicada-quiet stillness, the particular charm of rural
rail travel. Vary time of day, season, weather, angle. CRITICAL: the
TRAIN, the TRACK, or the PLATFORM must ALWAYS be the grammatical subject
named FIRST in the sentence. 20-35 words each. Examples:
["A single cream-and-green countryside train glides across a small stone bridge over a quiet river, rice paddies stretching flat and mirror-still on either side in the late afternoon light.", "An empty single rail track curves gently through a meadow of wildflowers toward distant blue hills, the rails catching the last warm light of a summer evening."]

🚫 STRICT BANS: NO named people/characters, NO animals, NO readable text,
station names, or signage of any kind, NO brand names, NO photographer/
camera-brand names.

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
