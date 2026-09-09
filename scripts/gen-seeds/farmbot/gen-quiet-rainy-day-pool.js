#!/usr/bin/env node
/**
 * FarmBot — quiet-rainy-day path (Moment, MVP-25).
 *
 * The mood of a rainy day on the farm — puddles, a covered porch, rain on
 * a roof. No deliberate human figure.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_quiet_rainy_day_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct QUIET RAINY-DAY scene descriptions for a
cozy farm-life bot — the hush of rain on the farm. Blend TWO inspirations:
(A) Hay Day-style farm-sim rainy iconography — rain pattering on a barn's
tin roof, puddles forming in a cart track, a covered porch keeping dry
under the downpour, raindrops on a window overlooking the fields — and
(B) cozy iyashikei slice-of-life mood — the particular gray-green light of
a rainy afternoon, the sound implied by ripples on a puddle, steam on a
window from warmth inside.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest farm scenes imaginable — never a bare or plain
composition. The hero structure/puddle/window must be lushly SURROUNDED by
rich plant life and garden detail (dripping ferns, rain-beaded flowers or
climbing vines, glossy wet leaves, moss on old wood, tall rain-bent grass,
a garden bed visible nearby) PLUS at least one small whimsical, fun detail
that makes the moment feel enchanted — a snail on a leaf, a single perfect
raindrop about to fall from a petal, a rainbow-sheen puddle, a curl of
steam from a warm window, fireflies just visible in the dusk-grey light,
a butterfly sheltering under a leaf. Never describe just the bare anchor —
always give it a lush, detailed, whimsical setting around it. Vary: which
structure/spot is sheltering, light (soft overcast, a break of sun through
cloud, dusk rain), season (favor spring/summer greenery — a rare autumn or
winter entry must still be richly detailed: frost-beaded evergreen boughs,
holly, not bare branches), the specific rain detail (mist, drizzle, a real
downpour), angle. CRITICAL: the STRUCTURE, PUDDLE, or WINDOW must ALWAYS
be the grammatical subject named FIRST in the sentence. 25-40 words each.
Examples:
["Rain patters steadily on a red barn's tin roof, streaming off the eaves in silver threads past a climbing rose vine heavy with rain-beaded blooms, a snail inching along one glossy leaf, the puddle below mirroring the gray sky.", "A farmhouse window fogs gently at the edges, framed by dripping ferns and a window box of rain-soaked geraniums, a single perfect droplet trembling on a petal about to fall in the soft grayish afternoon light."]

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
