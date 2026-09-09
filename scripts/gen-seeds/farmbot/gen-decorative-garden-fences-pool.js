#!/usr/bin/env node
/**
 * FarmBot — decorative-garden-fences path (Place, MVP-25).
 *
 * Decorative garden beds, fences, trellises, and yard ornaments as the
 * hero — the Hay Day "decorate your farm" impulse. Blended concept
 * (2026-09-08, Japan-rural expansion pass) — MIX separate Western-decor
 * entries and Japanese-garden entries across the pool for variety (not
 * fused within one entry), same pattern as farmhouse-garden/crop-fields/
 * duck-pond/orchard.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_decorative_garden_fences_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct DECORATIVE GARDEN / FENCE scene descriptions
for a cozy farm-life bot. A decorated stretch of garden, fence, or trellis
is ALWAYS the hero — the "decorate your farm" impulse. Generate roughly
HALF the entries as (A) Western-decor style — a white picket fence strung
with fairy lights or bunting, a flower-box-lined fence rail, a trellis
heavy with climbing roses or morning glories, a whimsical garden gate, a
row of painted wooden planters — and HALF as (B) Japanese-garden style —
a bamboo fence (kenninji-gaki) beside clipped azaleas, a stone lantern
(tōrō) half-hidden in moss, a shishi-odoshi bamboo water fountain, a small
zen gravel garden raked in careful lines beside stepping stones. Each
individual entry should be internally coherent to ONE of these two
styles, not mixed. Both share cozy iyashikei slice-of-life mood — dappled
afternoon light, butterflies drifting past, the particular charm of a
well-tended garden corner.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest garden scenes imaginable — never a bare fence with
nothing on it. The hero fence/trellis/lantern/garden-bed must always be
richly decorated or plant-covered PLUS carry at least one small whimsical,
fun detail — a butterfly or ladybug, dewdrops catching light, a single
perfect bloom just opening, moss glowing green in a sunbeam. Vary: season
(favor spring/summer greenery — a rare autumn or frost-rimmed winter entry
must still be richly detailed, never bare), time of day, weather, angle
(straight-on a fence stretch, close on one trellis, wide shot of a garden
corner). CRITICAL: the FENCE, TRELLIS, LANTERN, or GARDEN BED must ALWAYS
be the grammatical subject named FIRST in the sentence. 25-40 words each.
Examples:
["A white picket fence overflows with climbing morning glories in shades of violet and blue, strings of small fairy lights woven between the pickets, a ladybug pausing on one dew-bright petal in the late afternoon sun.", "A mossy stone lantern stands half-hidden among clipped azaleas beside a bamboo fence, a shishi-odoshi fountain mid-tip with a bright droplet catching the light, morning mist still clinging to the gravel path."]

🚫 STRICT BANS: NO named people/characters, NO animals (beyond a tiny
incidental butterfly/ladybug/bird per above), NO readable text or signage,
NO brand names, NO photographer/camera-brand names, NO bare/empty
compositions lacking rich decoration or plant detail.

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
