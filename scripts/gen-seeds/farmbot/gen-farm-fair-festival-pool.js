#!/usr/bin/env node
/**
 * FarmBot — farm-fair-festival path (Moment, MVP-25).
 *
 * A harvest/county-fair celebration — a deliberate, expected stylized-
 * attendee feature (Kevin 2026-09-07). High signage risk (fairs commonly
 * imply banners/ribbons/booths) — avoid readable-text-baiting elements,
 * describe decoration only.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_farm_fair_festival_scenes.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct FARM FAIR / HARVEST FESTIVAL scene
descriptions for a cozy farm-life bot. A small country fair or harvest
festival is ALWAYS the hero of the shot. A small handful of stylized
attendees (1-3 people — a child holding a balloon, a couple admiring a
prize pumpkin, someone on a hay-bale seat) ARE a deliberate, expected part
of this scene in EVERY entry — describe them briefly and warmly, never
the sole focus, always part of the wider festival. Blend TWO
inspirations: (A) Hay Day-style farm-sim festival iconography — a giant
prize pumpkin on display, strings of paper lanterns or bunting overhead,
a hay-bale maze, a small carousel or ferris wheel silhouette, apple-
bobbing barrels, a bonfire — and (B) cozy iyashikei slice-of-life mood —
the particular warm chaos of a small local festival, string lights at
dusk, the cheerful bustle of a celebration. Vary: which festival element
leads, time of day, season (harvest through early winter), weather,
angle. CRITICAL: the festival element (pumpkin display, lanterns, hay
maze, carousel) must ALWAYS be the grammatical subject named FIRST in the
sentence; people appear only in a trailing clause. 20-35 words each.
Examples:
["A giant prize pumpkin sits on a hay-bale pedestal at the festival's center, strings of warm paper lanterns crisscrossing overhead as a couple pauses to admire it.", "A small wooden carousel turns slowly under strings of dusk-lit bulbs, a child clutching a red balloon watching wide-eyed from a nearby hay bale."]

🚫 STRICT BANS: NO named people/characters (describe them generically),
NO readable text, banners, ribbons with text, signage, ticket booths with
signs, or price boards of any kind — describe decoration and lights only,
NO brand names, NO photographer/camera-brand names.

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
