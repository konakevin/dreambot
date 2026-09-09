#!/usr/bin/env node
/**
 * FarmBot — orchard path (Place, MVP-25).
 *
 * Rows of fruit trees as the hero place — blossom, fruit, dappled light.
 * Blended concept (2026-09-08, Japan-rural expansion pass) — MIX separate
 * Western orchard entries and Japanese orchard entries across the pool
 * for variety (not fused within one entry), same pattern as
 * farmhouse-garden/crop-fields/duck-pond.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_orchard_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct ORCHARD scene descriptions for a cozy
farm-life bot. Rows of fruit trees are ALWAYS the hero of the shot.
Generate roughly HALF the entries as (A) Western orchard style — neat rows
of apple, pear, cherry, or peach trees heavy with fruit, a wicker basket
resting at the base of a trunk, a wooden ladder leaned against a branch,
fallen fruit scattered in the grass — and HALF as (B) Japanese orchard
style — a persimmon (kaki) orchard with strings of hoshigaki (dried
persimmons) hanging under an eave nearby, a mikan (mandarin) grove on a
terraced hillside, or a sakura orchard with a stone path and a small
stream. Each individual entry should be internally coherent to ONE of
these two styles, not mixed. Both share cozy iyashikei slice-of-life
mood — dappled sunlight through leaves, drifting blossom petals, the
particular hush of an orchard at golden hour.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest farm scenes imaginable — never a bare row of
trees. SURROUND the hero trees with rich detail (wildflowers or moss at
the roots, climbing vines, a garden path, dappled light shafts) PLUS at
least one small whimsical, fun detail — a butterfly among the blossoms, a
bird mid-song on a branch, a single perfect piece of fruit dangling in the
light, drifting petals catching a sunbeam. Vary: season (spring blossom,
summer green, heavy autumn fruit — keep bare winter branches rare and
still richly detailed with frost-jeweled twigs), time of day, weather,
angle (looking down a long row, close on one fruit-heavy branch, wide shot
of the whole orchard). An animal MAY appear incidentally (a cat weaving
between trunks, a bird on a branch) in roughly a quarter of entries — never
the hero. CRITICAL: the ORCHARD or a TREE detail must ALWAYS be the
grammatical subject named FIRST in the sentence; an incidental animal may
appear ONLY in a trailing clause. 25-40 words each. Examples:
["Rows of apple trees stretch into the distance, their branches heavy with red fruit and wildflowers blooming at their roots, a wicker basket resting half-full in the grass as a butterfly drifts between the low branches.", "A persimmon orchard glows amber in autumn light, strings of hoshigaki drying under a nearby eave, fallen leaves scattering across a mossy stone path as a small bird sings from a fruit-heavy branch."]

🚫 STRICT BANS: NO named people/characters, NO hero animal (incidental
only, per above), NO readable text or signage, NO brand names, NO
photographer/camera-brand names, NO bare/empty compositions lacking
surrounding plant detail.

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
