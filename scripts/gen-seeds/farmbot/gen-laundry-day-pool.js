#!/usr/bin/env node
/**
 * FarmBot — laundry-day path (Moment, MVP-25).
 *
 * Laundry hanging to dry — a classic cozy domestic-farm mood beat. No
 * deliberate human figure.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_laundry_day_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct LAUNDRY-DAY scene descriptions for a cozy
farm-life bot — a clothesline of laundry drying in the yard. Blend TWO
inspirations: (A) Hay Day-style farm-sim domestic iconography — a
clothesline strung between two posts hung with simple linens, quilts, and
patterned shirts, a wicker laundry basket resting in the grass, wooden
clothespins — and (B) cozy iyashikei slice-of-life mood — a breeze
lifting the sheets, dappled sunlight through billowing fabric, the
particular calm of a domestic chore captured mid-moment.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest farm scenes imaginable — never a bare clothesline
against empty sky. The line must be lushly SURROUNDED by rich garden/plant
detail (a flowering hedge or climbing vine behind it, tall grass or
wildflowers at its base, a nearby tree's dappled shade, potted plants by
the posts) PLUS at least one small whimsical, fun detail that makes the
moment feel enchanted — a butterfly resting on a sheet, a ladybug on a
clothespin, sun-catching soap bubbles drifting by, a cat's shadow crossing
the grass, petals drifting onto the linens. Never describe just the
laundry alone — always give it a lush, detailed, whimsical setting around
it. Vary: what's hanging (sheets, quilts, small clothes, dish towels),
season (favor spring/summer greenery), time of day, weather (line drying
works best in sun, but a foggy morning line is lovely too), angle.
CRITICAL: the CLOTHESLINE or the hanging LAUNDRY must ALWAYS be the
grammatical subject named FIRST in the sentence. 25-40 words each.
Examples:
["A clothesline strung between two weathered posts holds a row of pale linen sheets billowing in the afternoon breeze, a climbing rose hedge blooming pink behind it, a butterfly resting on one sunlit corner.", "Patchwork quilts hang heavy and still on a backyard line in the cool morning fog, wooden clothespins catching the first pale light, a flowering lilac bush leaning in and petals scattered across the damp grass below."]

🚫 STRICT BANS: NO named people/characters, NO animals, NO readable text or
signage, NO brand names, NO photographer/camera-brand names, NO bare/empty
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
