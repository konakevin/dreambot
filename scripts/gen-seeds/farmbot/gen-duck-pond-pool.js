#!/usr/bin/env node
/**
 * FarmBot — duck-pond path (Place, MVP-25).
 *
 * A farm pond or creek as the hero place — water, reflections, reeds.
 * Unlike red-barn/windmill-silo, waterfowl are an EXPECTED (not purely
 * incidental) element here since it's literally "the duck pond" — but the
 * WATER/POND stays the named-first grammatical subject; ducks/geese trail.
 * Blended concept (2026-09-08, Japan-rural expansion pass) — MIX separate
 * Western farm-pond entries and Japanese garden-pond entries across the
 * pool for variety (not fused within one entry), same pattern as
 * farmhouse-garden/crop-fields.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_duck_pond_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct FARM POND / CREEK scene descriptions for a
cozy farm-life bot. A still pond or a gently moving creek is ALWAYS the
hero place — its water, its reflections, its edges. Generate roughly HALF
the entries as (A) Western farm-pond style — a round farm pond ringed by
reeds and a low wooden fence, a small dock or stepping stones, lily pads,
a rustic footbridge — and HALF as (B) Japanese garden-pond style — a koi
pond with a curved wooden bridge, a stone lantern at the water's edge,
maple trees trailing red leaves over the surface, smooth mossy stones.
Each individual entry should be internally coherent to ONE of these two
styles, not mixed. Both share cozy iyashikei slice-of-life mood — mirror-
still water holding a perfect reflection of the sky, dragonflies, the
particular hush of water at dawn or dusk.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest scenes imaginable — never a bare pond with nothing
around it. SURROUND the water with rich plant detail (flowering reeds,
overhanging blossom or maple branches, mossy stones, lily pads, ferns)
PLUS at least one small whimsical, fun detail — a dragonfly mid-hover, a
koi breaking the surface, a single falling leaf about to land, sunlight
scattering in dappled coins on the water. In roughly half the entries
(either style), a duck, goose, or koi is an EXPECTED part of the scene
(this is literally the pond path) — in the other half the water is
undisturbed. Vary: time of day, season (favor spring/summer greenery — an
autumn maple-leaf pond is lovely too; keep winter entries rare and still
richly detailed with frost-jeweled reeds, not bare), weather, angle.
CRITICAL: the POND or WATER (or a water detail — its surface, its edge,
its reflection) must ALWAYS be the grammatical subject named FIRST in the
sentence; a duck, goose, or koi may appear only in a trailing clause,
NEVER as the sentence's opening subject. 25-40 words each. Examples:
["A round farm pond lies mirror-still at dawn, its surface holding a perfect reflection of pink clouds and blooming water lilies, a pair of white ducks drifting near the reed-lined bank as a dragonfly hovers just above.", "A koi pond glows beneath a curved wooden bridge, maple leaves drifting onto its mirror-calm surface where a stone lantern stands mossy at the water's edge, a flash of orange as a koi rises to the light."]

🚫 STRICT BANS: NO named people/characters, NO hero animal beyond the
allowed incidental duck/geese/koi (per above — never the sole subject of
the sentence), NO readable text or signage, NO brand names, NO
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
