#!/usr/bin/env node
/**
 * FarmBot — camera_composition shared pool (rebuild, 2026-09-08).
 *
 * Shared across every path (see FARMBOT_CREATIVE_DIRECTION.md section 15).
 * Framing only, no scene content — plain strings (no tags, applies
 * universally) so not every render becomes the same character portrait.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_camera_composition.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct CAMERA/COMPOSITION instructions for a cozy
countryside bot — how the shot is FRAMED, not what's in it. Draw from: a wide countryside
establishing shot, a character small within a large gentle landscape, a medium character-
focused scene, an intimate close-up, an over-the-shoulder view, looking through a farmhouse
window, framed through a barn doorway, soft foreground foliage framing the shot, a cozy
interior composition, a village-street perspective, a low-angle scenic view, a high-angle view
over the village.

Each entry is a short framing PHRASE only (no subject, no scene content) — e.g. "wide
establishing shot, the scene small and inviting within a huge soft sky."

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.

Examples:
["Wide establishing shot, the subject small and warm within a huge gentle sky.", "Close, intimate framing, soft background blur, the small charming detail in sharp focus."]`,
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
