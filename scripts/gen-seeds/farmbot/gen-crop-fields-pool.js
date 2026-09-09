#!/usr/bin/env node
/**
 * FarmBot — crop-fields path (Place, MVP-25).
 *
 * Rows of crops as the hero place. Blended concept — MIX separate Western
 * grain/vegetable-row entries and Japanese rice-paddy entries across the 25
 * for variety (not fused within one entry, per Kevin 2026-09-07).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_crop_fields_scenes.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct CROP FIELD scene descriptions for a cozy
farm-life bot. Rows of crops are ALWAYS the hero of the shot. Generate
roughly HALF the entries as (A) Western grain/vegetable-row style — neat
rows of wheat, corn, sunflowers, or leafy vegetables stretching to the
horizon, a weathered wooden fence post, a scarecrow silhouette far in the
distance — and HALF as (B) Japanese rice-paddy style — flooded rice
paddies in neat terraced steps, their still water holding a mirror
reflection of the sky, a narrow raised footpath between paddies, distant
low hills. Each individual entry should be internally coherent to ONE of
these two styles, not mixed. Both share cozy iyashikei slice-of-life mood —
long golden-hour shadows, a light breeze moving through the crop, the
particular hush of open farmland. Vary: time of day, season, weather,
angle (low along a row, wide over the whole field, close on the crop
texture). CRITICAL: the FIELD or a field detail (the rows, the paddies,
the crop itself) must ALWAYS be the grammatical subject named FIRST in the
sentence. 20-35 words each. Examples:
["Rows of golden wheat sway gently under a wide summer sky, a weathered wooden fence post leaning at the field's edge where wildflowers push through the grass.", "Terraced rice paddies step down a gentle hillside, their flooded surfaces holding a perfect mirror of the pale dawn sky, a narrow footpath winding between them."]

🚫 STRICT BANS: NO named people/characters, NO animals, NO readable text or
signage, NO brand names, NO photographer/camera-brand names.

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
