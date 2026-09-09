#!/usr/bin/env node
/**
 * FarmBot — world_detail_props shared pool (rebuild, 2026-09-08).
 *
 * Shared across many paths (see FARMBOT_CREATIVE_DIRECTION.md section 13).
 * The small charming details that make a setting feel dense, lived-in, and
 * cared for — "high environmental richness without visual clutter."
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_world_detail_props.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct INDOOR/COZY-INTERIOR-DETAIL descriptions for a
cozy countryside bot — the small charming details that make an INDOOR setting (a bakery
kitchen, a farmhouse room, a cottage interior) feel dense, lived-in, and cared for. EVERY
single entry must be tagged "indoor" — this batch is specifically filling a gap in an existing
pool that skewed entirely outdoor. Draw from: a warm brick hearth, copper pots hanging on a
rail, a flour-dusted wooden countertop, shelves of jam jars catching window light, a basket of
fresh eggs on a windowsill, a quilt draped over a rocking chair, a string of dried herbs
hanging from a beam, a kettle steaming on a stove, a cozy reading nook by a window, a wooden
shelf of teacups, a butter churn in a corner, a basket of yarn beside a spinning wheel.

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["indoor", "bakery"], "description": "..."}

Tags — EVERY entry gets "indoor". ALSO add "bakery" if it fits a bakery/kitchen, "farmhouse"
if it fits a general farmhouse room, or "ANY" if it could fit either.

Examples:
[{"tags": ["indoor", "bakery", "ANY"], "description": "A row of copper pots hanging above a warm brick hearth, gleaming softly."}, {"tags": ["indoor", "farmhouse"], "description": "A patchwork quilt draped over a rocking chair beside a sunlit window."}]

🚫 STRICT BANS: NO readable text on signs (describe a sign as hand-painted or weathered WITHOUT
specifying legible words), NO brand names, NO photographer/camera-brand names, NO named people.

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
