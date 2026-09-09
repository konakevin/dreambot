#!/usr/bin/env node
/**
 * FarmBot — halloween_pumpkin_carving_glow bespoke pool (Halloween SEASONAL
 * path, `farmbot-halloween-pumpkin-carving`). MONEY SHOT axis — the exact
 * way warm candle / jack-o-lantern / string-light glow washes this small,
 * intimate evening scene. Always rolled (never conditional) — mirrors the
 * proven "glow" axis design on chibi-halloween-cozy.js and
 * anime-halloween-cozy.js (both AlphaBot Halloween candidates).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_pumpkin_carving_glow.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct GLOW-DETAIL snippets for a cozy anime farm-life
illustration bot's intimate Halloween pumpkin-carving path. This is the SIGNATURE money-shot
detail of the whole scene: the exact way warm light (a lit candle, a glowing carved jack-o-
lantern, a small string of warm lights) plays across a small, quiet, personal evening scene, often
set against a cooling autumn dusk or early-evening sky for a gentle warm/cool contrast. Each entry
16-30 words, vivid and specific about light behavior (color, flicker, exactly where it lands, what
it contrasts with) — never just "warm lighting."

━━━ FORMAT (match this exactly) ━━━
"A lit candle nestled beside the pumpkin sends a warm amber flicker up across curls of pumpkin
peel, the cooling blue dusk settling softly behind it."
"A single string of small orange lights loops along the railing, glowing steadily warm against the
graying evening sky just beginning to deepen overhead."
"The carved pumpkin's own candlelit face throws a warm, jagged glow across the tabletop, catching
on scattered seeds and the edge of a waiting mug."

━━━ SPREAD ACROSS ALL ${n} — vary the light SOURCE and what it plays against ━━━
a candle set beside the pumpkin, the pumpkin's own carved face glowing warm from within once lit,
a small string of warm lights along a railing or shelf edge, a single lantern set on the table, a
porch light left on overhead, warm kitchen light spilling out through an open door onto the porch,
a cluster of small candles in jars, warm light catching on a steaming mug of cider, dusk deepening
to blue-grey behind a warm-lit table, the last low gold of sunset fading behind a warmly lit porch.

━━━ CRITICAL RULES ━━━
Always keep the warm light as the dominant, hero light of the scene, even when set against a
cooling dusk sky. Describe light literally and concretely — NEVER metaphorical light-as-object
language ("coins of light," "ribbons of gold"). NEVER pair "dark," "darkness," or "shadow" with a
light-implying word ("glint," "sparkle," "shimmer," "luminous," "glow") describing the same thing —
use "dusk," "evening," "blue," or "cooling" for the darkening sky instead. No text, no brand names,
no people/figures described here (the light and its source only).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
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
