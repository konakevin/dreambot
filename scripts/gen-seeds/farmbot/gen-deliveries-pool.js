#!/usr/bin/env node
/**
 * FarmBot — deliveries path (Moment, MVP-25).
 *
 * A delivery arriving by boat/train/truck — a deliberate, expected
 * stylized delivery-person feature (Kevin 2026-09-07). Avoid retail/
 * product-display coding (vending-machine-style Flux self-branding risk).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_deliveries_scenes.json'),
    total: 120,
    append: false,
    metaPrompt: (n) => `Generate ${n} distinct FARM DELIVERY scene descriptions for a cozy
farm-life bot — a delivery arriving BY BOAT, TRAIN, or TRUCK. A stylized
delivery figure (1 person — a driver, a boat captain, a train conductor)
IS a deliberate, expected part of this scene in EVERY entry — describe
them briefly and warmly (a cap, an apron, a friendly wave), always
secondary to the vehicle and its cargo. Blend TWO inspirations: (A) Hay
Day-style farm-sim delivery iconography — a small red pickup truck loaded
with crates, a little delivery boat docking with barrels on deck, a
miniature cargo train car full of sacks — and (B) cozy iyashikei
slice-of-life mood — warm morning light, the particular cheer of a
delivery arriving, steam rising from a thermos.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest farm scenes imaginable — never a bare road or dock
against empty background. SURROUND the vehicle with rich environmental
detail (a flowering hedge along the drive, mossy stones and reeds at the
dock, wildflowers along the rail line, overhanging blossom branches) PLUS
at least one small whimsical, fun detail — a butterfly following the
truck, a duck paddling past the boat, steam curling prettily from a
thermos, morning glory climbing the mailbox post. Vary: vehicle type
(rotate boat/train/truck across entries), cargo, season (favor
spring/summer greenery), time of day, weather, angle. CRITICAL: the
VEHICLE (truck, boat, or train car) must ALWAYS be the grammatical subject
named FIRST in the sentence; the person appears only in a trailing clause.
25-40 words each. Examples:
["A round-fendered red pickup truck rolls up a dirt drive lined with blooming hedgerows loaded with wooden crates of vegetables, the driver leaning out the window with a friendly wave as petals drift past.", "A small wooden delivery boat docks at a mossy, reed-fringed pier stacked with barrels, its captain in a striped cap tying off the rope as a duck paddles curiously past in the early morning mist."]

🚫 STRICT BANS: NO named people/characters (describe them generically —
"a driver", "a captain" — never a proper name), NO readable text, license
plates, or signage of any kind, NO brand names or logos on the vehicle, NO
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
