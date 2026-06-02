#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/creature_portrait_backgrounds.json',
  total: 150,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} DREAMY BACKGROUND MOODS for ChibiBot creature-portrait. The background is SOFT BOKEH MOOD ONLY — never a recognizable setting. The CREATURE fills the frame; this background is just a pretty melt of color and light.

Each entry: 12-22 words. ONE specific dreamy bokeh-mood. NO recognizable architecture, NO villages, NO specific locations.

━━━ FORMAT — SOFT DREAMY BOKEH-MOOD ━━━

Examples:
✓ "Soft pastel-pink bokeh haze with floating sparkle-particles drifting in warm rim-light"
✓ "Dreamy lavender-violet melt with floating petal-blossoms blurred into bokeh-orbs"
✓ "Warm honey-amber gradient bokeh with sun-shaft-haze and dust-motes catching light"
✓ "Mint-and-blush pastel cloud-cushion melt, soft-focus with iridescent sparkle"
✓ "Cool teal-and-pearl shimmer with floating bubble-pearls melting into the background"
✓ "Golden-hour-gradient melt from peach to magenta, soft bokeh-orbs throughout"
✓ "Bioluminescent-cyan-blue haze with floating glow-particles like fairy-dust"
✓ "Cherry-blossom-petal-drift blurred into pastel-pink bokeh-cushion"
✓ "Dreamy white-and-cream bokeh with floating snowflake-glitter blur"
✓ "Soft sage-and-lavender mist with cottage-garden bokeh hint (no buildings, just color-melt)"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% PASTEL-BOKEH (soft pastel-pink / pastel-mint / pastel-lavender / pastel-peach bokeh melt)
- 15% GOLDEN-WARM (warm honey-amber / golden-hour-gradient / warm sunset-gradient bokeh)
- 15% PETAL-BLOSSOM-DRIFT (cherry-blossom blur / rose-petal drift / wisteria-petal cloud / dandelion-seed drift)
- 10% BIOLUMINESCENT-MAGIC (cyan-blue bioluminescent haze / glow-particle drift / faint-aurora shimmer)
- 10% SPARKLE-PARTICLES (floating glitter / fairy-dust / iridescent sparkle / pearl-bead blur)
- 10% MIST / HAZE (soft pastel mist / dreamy-fog blur / cotton-candy-cloud / atmospheric haze)
- 10% RAINBOW-PRISM (rainbow-shimmer prism / pearlescent-rainbow gradient / iridescent-shimmer melt)
- 5% NATURE-HINT-BLUR (wildflower-meadow blur / forest-canopy-bokeh / sky-gradient blur — NO specific architecture)
- 5% SNOWY-WINTER-MAGIC (snowflake-glitter blur / soft-snow-mist / white-pearl haze)

━━━ HARD MANDATES ━━━

- ALWAYS soft-focus / bokeh / dreamy — NEVER a recognizable setting
- Pastel or warm-golden register
- Pretty but NEVER competing with the creature

━━━ HARD BANS ━━━

- NO villages / cottages / buildings / architecture (this is bokeh-mood, not a setting)
- NO specific environments (no "forest" — only "forest-canopy-bokeh-blur")
- NO sharp focus / clear details in background
- NO creatures (other than the hero, which the template handles)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
