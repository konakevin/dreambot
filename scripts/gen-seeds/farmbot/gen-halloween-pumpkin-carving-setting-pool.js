#!/usr/bin/env node
/**
 * FarmBot — halloween_pumpkin_carving_setting bespoke pool
 * ("Halloween: Pumpkin Carving" SEASONAL path).
 *
 * The small, personal porch/table nook where the carving happens. CRITICAL
 * distinction from seasonal-festival.js's "pumpkin-festival" concept: this
 * is ONE home's own quiet corner — porch steps, a small garden table, a
 * back stoop — never a public gathering space. No bunting, no game booths,
 * no contest tables, no crowd-scale decoration.
 *
 * Deliberately avoids any "looking through a window" framing (split-diptych
 * bug risk, FARMBOT_PATH_BUILD_STATE.md) — every entry stays a single,
 * continuous exterior nook, never an interior-plus-window-view composition.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_pumpkin_carving_setting.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of a SMALL, PERSONAL outdoor nook where
a pumpkin gets carved, for a cozy countryside anime Halloween bot. The nook itself (steps, a small
table, a bench, a low wall) is ALWAYS the grammatical subject named FIRST in the sentence — a PLACE
description only, no people implied.

CRITICAL — this is ONE home's own small, quiet corner, at PERSONAL scale, never a public gathering
space. Vary the nook: a farmhouse's own worn wooden porch steps, a small round garden table on a
patio, a low wooden picnic-style table tucked near a garden shed, a broad flat porch railing, a
low mossy stone garden wall, a wooden porch swing's little side table, a low wooden crate turned on
its side as a makeshift table, a flat garden stone or tree stump used as a little tabletop. Do NOT
use hay bales as the nook/table itself — hay-bale imagery belongs to the separate harvest-festival
path, not this one. Dress each with light, personal autumn touches: a scatter
of fallen leaves across the boards or stone, a small stack of extra mini pumpkins or gourds set to
one side, a folded knit throw draped over a railing or chair-back, a woven basket, a low wooden
crate used as a stool. Keep every setting believably small enough for one or two people sitting or
standing close together, never a space built to hold a crowd.

Vary time of evening lightly through the description (late golden afternoon settling toward dusk,
the blue hour just after sunset, fully fallen dark with just the nook itself lit) — but keep the
FOCUS on the physical setting itself, not on any single light source (a separate part of this bot's
content handles the candle/lantern glow).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A farmhouse's worn wooden porch steps hold a folded knit throw draped over the railing beside them, a scatter of fallen amber leaves swept into the corner where the steps meet the clapboard wall.", "A small round garden table sits on a flagstone patio, a low wooden crate pulled up beside it as a stool, a woven basket of extra mini pumpkins tucked just beneath the tabletop."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/hands/someone/anyone/
footprints), NO readable text/signage/lettering/numbers of any kind, NO photographer/camera-brand
names, NO looking-through-a-window or interior-plus-window-view framing (keep it one continuous
exterior nook), NO festival/contest/booth/bunting/game/public-gathering language, NO crowd or
multi-family-scale space (this belongs to a small personal moment, not a public festival), NO hay
bales as the table/nook itself (that belongs to the separate harvest-festival path).

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
