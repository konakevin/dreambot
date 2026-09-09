#!/usr/bin/env node
/**
 * FarmBot — evening-chores path (Moment, MVP-25).
 *
 * The wind-down of the day — tools put away, lanterns lit, animals settled
 * in for the night. No deliberate human figure.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_evening_chores_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct EVENING-CHORES scene descriptions for a
cozy farm-life bot — the wind-down of the day, dusk settling in. Blend
TWO inspirations: (A) Hay Day-style farm-sim evening iconography — a
lantern hung glowing by a barn door, tools leaned neatly against a wall
at day's end, a gate latched for the night, a wheelbarrow parked beside
the shed — and (B) cozy iyashikei slice-of-life mood — the particular
deep blue-gold of dusk, the first star, the hush of a farm settling down
for the night.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest farm scenes imaginable — never a bare or empty
composition. The hero lantern/gate/tool/structure must be lushly
SURROUNDED by rich garden and plant detail (climbing vines on the wall,
flowering shrubs by the gate, tall grass swaying, moss on old wood, a
nearby tree in silhouette) PLUS at least one small whimsical, fun detail
that makes the moment feel enchanted — fireflies beginning to glow, a moth
circling the lantern light, the first star reflected in a dew drop, a cat
silhouette on a fence post, string lights softly on. Never describe just
the bare object — always give it a lush, detailed, whimsical setting
around it. Vary: which chore-evidence is shown (a latched gate, a lit
lantern, put-away tools, a closed coop door), season (favor spring/summer
greenery), exact dusk light, weather, angle. CRITICAL: the LANTERN, GATE,
TOOL, or structure detail must ALWAYS be the grammatical subject named
FIRST in the sentence. 25-40 words each. Examples:
["A single lantern glows warm gold beside the barn's closed door, its light framed by a climbing vine in first bloom, a moth circling lazily as the last blue light of dusk fades behind the hills.", "A latched wooden gate stands quiet at the edge of a flowering hedge, the first pale star appearing above as fireflies begin to blink through the tall grass in the deep indigo dusk."]

🚫 STRICT BANS: NO named people/characters, NO readable text or signage,
NO brand names, NO photographer/camera-brand names, NO bare/empty
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
