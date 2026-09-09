#!/usr/bin/env node
/**
 * FarmBot — SEASONAL (Halloween) bespoke pool: ATMOSPHERE (money-shot light)
 * ("farmbot-halloween-scarecrow-building" path). See the sibling
 * gen-halloween-scarecrow-building-scarecrow-pool.js header for the full
 * architecture note (seasonal path, 4 bespoke axis pools).
 *
 * This path deliberately SKIPS the shared SEASON pool (its entries each
 * describe a different whole temperate landscape that would compete with
 * the bespoke scarecrow/setting content, same reasoning as
 * garden-vegetable-patch-tending/orchard-afternoon) — this ATMOSPHERE pool
 * carries the autumn/Halloween light signal directly instead, matching
 * chibi-halloween-cozy's own "glow" money-shot axis.
 *
 * HUE-FREEDOM lesson baked in from the start (FARMBOT_PATH_BUILD_STATE.md —
 * 4 of 8 tropical place pools ended up badly warm-skewed because each was
 * that path's ONLY atmosphere source): explicitly instructed to mix WARM and
 * COOL/OVERCAST light roughly evenly, not "always sunny."
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_scarecrow_building_atmosphere.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct AUTUMN/HALLOWEEN-SEASON LIGHT AND ATMOSPHERE
descriptions for a cozy countryside anime bot — the exact quality of light and air washing over an
outdoor autumn-farm scene. This is atmosphere ONLY (light, sky, air, temperature-feel) — no scene
objects, no characters. The light/sky itself is ALWAYS the grammatical subject named FIRST.

Vary EVENLY across roughly half WARM and half COOL/OVERCAST entries — do not skew mostly sunny/warm.
WARM options: golden midday sun, warm honeyed late-afternoon light, a soft warm amber glow low on the
horizon. COOL/OVERCAST/VARIED options: soft grey overcast sky, cool misty early-morning air with dew
still on the grass, a crisp pale-blue autumn sky with high thin clouds, a cool early-dusk with the
first hint of blue shadow, a light autumn breeze carrying a few drifting leaves through cool air, a
faint ground mist curling low across a stubbled field at dawn. Vary which sensory detail leads: the
sky's color, the quality/direction of the light, the air's temperature-feel, a few drifting leaves or
a light breeze moving through the scene, the long or short shadows on the ground.

CRITICAL — describe light in plain, literal terms only (a warm glow, soft light, cool grey daylight,
misty air) — NEVER a metaphorical object-noun standing in for light (no "coins of light," "ribbons of
gold," "scattered gems of sun"). NEVER pair "dark"/"darkness"/"shadow" with a light-implying word
("glint," "sparkle," "shimmer," "luminous," "glow") describing the same thing in one entry.

CRITICAL — this is atmosphere only, with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, children, hands, someone/anyone doing something, footprints.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 15-30 words each.

Examples:
["Warm honeyed late-afternoon light slants low across the field, turning every dry leaf and stalk a
deep amber-gold.", "A soft grey overcast sky hangs low and even, the cool autumn air carrying the
faint crisp smell of fallen leaves.", "A faint ground mist curls low across the stubbled field at
dawn, the pale light still cool and soft before the sun fully clears the horizon."]

🚫 STRICT BANS: NO people/implied people of any kind, NO readable text/signage of any kind, NO brand
names, NO photographer/camera-brand names, NO metaphorical light-as-object language, NO dark+light
contradictory pairing, NO scene objects or characters (this pool is atmosphere/light only), NO winter
snow imagery (this is autumn, not winter).

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
