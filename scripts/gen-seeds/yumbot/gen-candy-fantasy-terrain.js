#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_terrain.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CANDY-TERRAIN ground textures for YumBot candy-fantasy — what the ground / floor / path is MADE of in the Sugar Rush world. NOT real soil, NOT real grass.

Each entry: 12-22 words. ONE specific candy-ground texture.

━━━ DISTRIBUTION ━━━

- 18% SPRINKLE-GRASS (a carpet of pastel rainbow-sprinkles in dense ground-cover / sprinkle-confetti grass dotted with jimmie-flowers / colored-jimmie-floor in pastel tones)
- 15% FROSTING-COVERED (a smooth pastel-frosting ground in pearl-pink and cream / royal-icing-glazed surface with subtle ripples / buttercream-frosting blanket)
- 12% CANDY-PEBBLE PATH (a path of pastel-jellybean-pebbles in rainbow colors / candy-rock garden of gumdrop-stones / mint-and-pink jellybean cobblestone)
- 10% SUGAR-DUST / SUGAR-CRYSTAL (a fine sugar-dust ground catching prism-light / sugar-crystal-sparkle dust path / glittering powdered-sugar carpet)
- 10% COOKIE-CRUMB GROUND (a packed cookie-crumb-and-chocolate-chip ground / shortbread-crumb-sand carpet / vanilla-wafer-crumb floor)
- 10% MARSHMALLOW DRIFT (a fluffy marshmallow-snow floor with peppermint-stripe streaks / pillow-soft marshmallow-puff cushion ground / vanilla-cream snowfield)
- 8% ICING-GLAZE PATHS (a glossy-glaze pastel-pink poured-icing path / mirror-shine fondant-glaze surface / pearl-glaze pour-coated walkway)
- 6% WAFFLE-COOKIE TILES (waffle-cone-textured ground tiles / cookie-grid floor with chocolate-chip eyes / honeycomb-wafer floor pattern)
- 6% SUGAR-MEADOW (a candy-grass meadow of pastel-spun-sugar fronds / spun-sugar-fluff carpet with candy-flowers scattered)
- 5% CARAMEL-FLOOR (a glossy caramel-pool floor with golden-amber sheen / butterscotch-poured surface with honey-glaze / molten-caramel landscape)

━━━ HARD MANDATES ━━━

- Sugar Rush candy-world register
- Lush saturated pastel + Disney-CGI palette
- The ground IS made of confectionary material

━━━ HARD BANS ━━━

- NO real grass / soil / dirt / sand / stone (unless they ARE candy versions)
- NO food character creatures
- NO modern tech
- NO neon / electric

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
