#!/usr/bin/env node
/**
 * FarmBot — gentle_magic shared pool (rebuild, 2026-09-08).
 *
 * Shared, LOW-WEIGHT/rare pool (see FARMBOT_CREATIVE_DIRECTION.md section
 * 14). Subtle enchantment only — never epic fantasy. A fairytale hint, not
 * a fantasy-adventure bot.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_gentle_magic.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct GENTLE MAGIC descriptions for a cozy countryside
bot — a small, rare, subtle enchantment, NEVER epic fantasy. Draw from: a firefly glowing a
beat too long, a pond's surface holding a faint impossible shimmer, a flower slightly larger
and more luminous than it should be, a tiny glimpse of something forest-spirit-like just out of
focus, a lantern that seems to glow warmer than its flame explains, moonlight pooling somewhere
it shouldn't.

Every entry must stay GROUNDED and SUBTLE — a fairytale hint, never a spell, creature, or
magical event. The feeling is "did I just see that?" not "this is a fantasy world."

Output a JSON array of ${n} OBJECTS shaped exactly like:
{"tags": ["ANY"], "description": "..."}

Tags: "ANY" for most entries, or a season tag if it's genuinely season-specific.

Examples:
[{"tags": ["ANY"], "description": "A firefly pausing to glow, just a beat too long, on an outstretched fingertip."}, {"tags": ["ANY"], "description": "A pond's still surface holding a faint, impossible shimmer beneath the lily pads."}]

🚫 STRICT BANS: NO spells, NO visible magical creatures, NO fantasy weapons/armor, NO dark or
ominous magic, NO readable text, NO brand names, NO named people.

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
