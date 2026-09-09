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
establishing shot, a medium character-focused scene, an intimate close-up, looking through a
farmhouse window, framed through a barn doorway, soft foreground foliage framing the shot, a
cozy interior composition, a village-street perspective, a low-angle scenic view, a high-angle
view over the village.

Each entry is a short framing PHRASE only (no subject, no scene content) — e.g. "wide
establishing shot, the scene small and inviting within a huge soft sky."

🚫 STRICT BANS:
- NO back-facing / rear-view framings of any kind — no "over-the-shoulder," "from behind,"
  "rear view," "back turned," "facing away," "walking away from camera." FarmBot's character
  design rule requires every character's face to be clearly visible and legible in every
  render; a camera angle that puts a character's back to the viewer directly contradicts that
  and must never be generated.
- NO "character small/tiny/dwarfed within a landscape" framings — no "the subject small and
  warm within a huge gentle sky," nothing implying the character is minor/distant/scale-
  dissolved against a sweeping backdrop. Every framing keeps the character (when one is
  present) a clear, present, appropriately-scaled part of the shot, never diminished by it.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.

Examples:
["Medium character-focused framing, warm and intimate, the cozy setting filling the space around them.", "Close, intimate framing, soft background blur, the small charming detail in sharp focus."]`,
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
