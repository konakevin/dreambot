#!/usr/bin/env node
/**
 * FarmBot — halloween_pumpkin_carving_activity bespoke pool (Halloween
 * SEASONAL path, `farmbot-halloween-pumpkin-carving`). Character-only
 * (skipped on the no-character branch, same convention as pools.ACTIVITY).
 * Subject-free gerund/verb phrasing (no "she/he/they" noun) so a single
 * entry fits EITHER one character carving alone OR two characters sharing
 * the moment together — mirrors chibi-halloween-cozy.js's ACTIVITIES /
 * anime-halloween-cozy.js's ACTIVITIES design.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_pumpkin_carving_activity.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} ACTIVITY entries for a cozy anime farm-life illustration
bot's intimate Halloween pumpkin-carving path. Each entry is ONE specific pumpkin-carving gesture
or small related action, written WITHOUT naming the subject (no "she/he/they", no noun for the
person) so it fits EITHER a single character working alone OR two characters sharing the moment
together. Each entry 14-26 words, comma-separated phrasing, concrete tactile/sensory detail.

━━━ FORMAT (match this exactly — no subject noun, just the action + sensory detail) ━━━
"Carefully pressing a small carving knife along a curved line, tongue caught between teeth in
concentration, one triangle eye already cut into the rind."
"Scooping a handful of stringy pulp and seeds into a waiting bowl, fingers sticky with pumpkin,
orange peel curling loose on the table."
"Holding the finished lid up to check the fit, a pleased smile at the crooked but charming grin
now cut into the rind."

━━━ SPREAD ACROSS ALL ${n} — vary the specific moment, don't repeat only carving itself ━━━
carving a curved line into the rind with a small knife, scooping stringy pulp and seeds into a
bowl, sketching a simple grinning face onto the rind with a marker before cutting, sorting seeds
from pulp with careful fingers, lifting a freshly-cut lid to peer inside, brushing loose seeds off
the table into a small bowl for roasting, wiping sticky orange hands on a nearby cloth, holding the
pumpkin steady while carving the last curve of the grin, admiring the finished carved face by
tilting it gently in the light, setting a small candle carefully inside the finished pumpkin,
sprinkling a pinch of cinnamon into a mug of cider set within reach of the work, sharing the same
knife between two sets of hands, guiding a hand gently along the same curved cut together, pausing
to blow loose seeds off a sleeve, laughing softly at a wobbly first cut before steadying the blade.

━━━ RULES ━━━
Every action stays warm, cheerful, and gentle — never anything sharp-edged or worrying about the
knife itself (no blood, no injury, no danger). No text, no brand names, no subject noun (start
with the gerund/participle).

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
