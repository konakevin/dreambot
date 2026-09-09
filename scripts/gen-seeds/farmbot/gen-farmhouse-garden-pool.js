#!/usr/bin/env node
/**
 * FarmBot — farmhouse-garden path (Place, MVP-25).
 *
 * A farmhouse exterior + its garden/veranda as the hero place. Blended
 * concept — MIX separate Western clapboard-farmhouse entries and Japanese
 * kominka-with-engawa entries across the 25 for variety (not fused within
 * one entry, per Kevin 2026-09-07).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_farmhouse_garden_scenes.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct FARMHOUSE + GARDEN scene descriptions for a
cozy farm-life bot. The farmhouse and its immediate garden/porch area is
ALWAYS the hero of the shot. Generate roughly HALF the entries as (A)
Western clapboard farmhouse style — a tidy clapboard or stone farmhouse
with a covered porch, flower boxes under the windows, a cottage garden of
mixed blooms, a picket fence, climbing vines — and HALF as (B) Japanese
countryside kominka style — a traditional wooden kominka farmhouse with a
low tiled or thatched roof, a covered engawa veranda, a small tsuboniwa
garden with stepping stones and clipped shrubs, shoji screens glimpsed
through an open doorway, a stone lantern. Each individual entry should be
internally coherent to ONE of these two styles, not mixed. Both styles
share cozy iyashikei slice-of-life mood — soft afternoon light, the
particular hush of a home at rest. Vary: time of day, season, weather,
angle (straight-on the porch/engawa, close on a garden bed, wide shot
including both house and garden). CRITICAL: the HOUSE or a house detail
(its porch/engawa, its windows, its doorway) must ALWAYS be the
grammatical subject named FIRST in the sentence. 20-35 words each.
Examples:
["A tidy white clapboard farmhouse porch overflows with pink geraniums in weathered flower boxes, a climbing rose vine framing the open front door in warm afternoon light.", "A low wooden kominka farmhouse opens onto its engawa veranda, morning mist drifting across a small moss garden where a stone lantern stands among clipped azaleas."]

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
