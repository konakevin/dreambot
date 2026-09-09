#!/usr/bin/env node
/**
 * FarmBot — windmill-silo path (Place, MVP-25).
 *
 * A windmill and/or grain silo as the hero landmark of the shot — Hay Day's
 * classic tall farm landmark silhouette against open sky.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_windmill_silo_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct WINDMILL / GRAIN SILO scene descriptions for a
cozy farm-life bot. A windmill (classic wooden or wire-wheel farm windmill,
NOT a Dutch tourist windmill) or a grain silo is ALWAYS the hero landmark,
standing tall against open sky. Blend TWO inspirations: (A) Hay Day-style
farm-sim iconography — a tidy red-and-white or weathered wooden windmill
with turning blades, a rounded metal or wooden silo beside a field, a
cluster of grain sacks nearby — and (B) cozy iyashikei slice-of-life mood —
long shadows at golden hour, a wide open sky with drifting clouds, the
particular hush of a landmark standing alone in a field. Vary: time of day
(dawn, midday, dusk, starry night), season (a snow-dusted windmill, one
ringed by summer wildflowers, one beside autumn wheat), weather, distance
(a wide shot with the windmill small against a huge sky, a close shot on
its turning blades or the silo's curved wall). CRITICAL: the WINDMILL or
SILO must ALWAYS be the grammatical subject named FIRST in the sentence.

CRITICAL: even in a wide shot, the windmill or silo must never stand
completely bare — every entry ALSO gives it a lush base or immediate
surround (tall wildflowers or grass at its foot, a cluster of grain sacks
and climbing vines, a low stone wall softened by moss, a scatter of poppies
or clover) PLUS one small whimsical, fun detail (a pair of birds circling
its blades, a butterfly on a nearby sunflower, a string of pennant flags,
lanterns hung along a fence). The setting is just as much a star of the
shot as the landmark itself — never a stark or empty composition. 25-40
words each. Examples:
["A weathered wooden windmill turns slowly against a huge dawn sky streaked pink and gold, wild poppies and tall grass swaying at its base, its blades casting long shadows across a dew-silvered wheat field.", "A rounded silver grain silo stands beside a sea of golden wheat at high summer noon, morning glory vines climbing its base, a handful of white clouds drifting overhead and a pair of swallows circling."]

🚫 STRICT BANS: NO named people/characters, NO animals of any kind (this
path is landmark/atmosphere only), NO readable text or signage of any kind,
NO brand names, NO photographer/camera-brand names, NO bare/empty
compositions lacking surrounding plant detail.

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
