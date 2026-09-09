#!/usr/bin/env node
/**
 * FarmBot — halloween_pumpkin_carving_cozy_detail bespoke pool
 * ("Halloween: Pumpkin Carving" SEASONAL path).
 *
 * ONE optional small warm touch (~50% of renders, see path file) — a mug of
 * cider, a knit blanket, roasted seeds, mittens. Deliberately NOT on every
 * render (mirrors chibi-halloween-cozy's optional accessory axis) — a
 * mandatory signature prop on every single render homogenizes the scene.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_pumpkin_carving_cozy_detail.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of ONE small cozy autumn touch near a
pumpkin-carving scene, for a cozy countryside anime Halloween bot — a mug of cider, a blanket, a
small bowl of roasted seeds, and similar small warm details. The object itself is ALWAYS the
grammatical subject named FIRST in the sentence — a PLACE/OBJECT description only, no people
implied, no action verb requiring visible hands.

Vary the touch: a steaming mug of warm apple cider set within easy reach on the step or table edge,
a thermos with its cup-lid set beside it, a small bowl of freshly roasted pumpkin seeds still warm
and lightly salted, a knit blanket or plaid shawl folded over a railing or chair-back, a pair of
knit mittens or gloves set down to one side, a woven basket holding a few extra small gourds, a
plate with a slice of warm spiced cake or a caramel apple resting beside it, a small stack of
folded paper napkins weighted down by a smooth stone, a cinnamon stick resting across the rim of a
mug.

Describe the steam/warmth plainly and literally (a thin curl of steam rising from the mug, gentle
warmth still radiating from the freshly roasted seeds) — never metaphorically.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["A steaming mug of warm apple cider sits within easy reach on the edge of the step, a thin curl of steam rising from it, a cinnamon stick resting across the rim.", "A small bowl of freshly roasted pumpkin seeds sits close by, still faintly warm and lightly salted, beside a folded plaid blanket draped loosely over the porch railing."]

🚫 STRICT BANS: NO named people/characters, NO implied people or hands, NO readable text/signage/
lettering/numbers, NO photographer/camera-brand names, NO gore or scary imagery.

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
