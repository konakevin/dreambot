#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_sky.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CANDY-FANTASY SKY/OVERHEAD descriptions for YumBot — the atmosphere above the Sugar Rush world.

Each entry: 12-22 words. ONE specific candy-sky.

━━━ DISTRIBUTION ━━━

- 25% COTTON-CANDY CLOUDS (giant fluffy cotton-candy clouds in pink and pastel-blue drifting overhead / pastel cotton-candy cloud-banks rolling across the sky / billowy pink-and-cream cotton-candy cloud-ridges)
- 20% CANDY-RAINBOW SKY (a vivid candy-rainbow arching across the sky in saturated lush pastel bands / pastel rainbow spectrum stretching from horizon to horizon)
- 15% SUGAR-GLITTER ATMOSPHERE (sugar-glitter dust drifting through the air / iridescent sugar-crystal sparkle floating high / glittering powdered-sugar particles suspended)
- 12% SUNSET-MELTED-CARAMEL (a warm caramel-and-pink sunset sky melting into the horizon / amber-syrup sunset with cotton-candy clouds catching golden light)
- 8% POP-ROCKS STARS (twinkling pop-rocks sparkle-stars in a pastel-twilight sky / candy-jewel-star constellations / fizzing-pop sky-sparkles)
- 8% LOLLIPOP-MOON / DONUT-SUN (a giant lollipop-disc moon hanging in the candy-sky / a donut-shaped sun with sprinkle-rays / a giant macaron-moon)
- 5% RAINBOW SHERBET GRADIENT (a rainbow-sherbet sky gradient from pink to mint to lavender / pastel-rainbow-stripe sky bands)
- 4% BALLOONS-OVERHEAD (cluster of pastel-rainbow balloons drifting / hot-air-balloons made of candy floating / pastel-balloon-cluster)
- 3% SUGAR-CRYSTAL CHANDELIER-CLOUDS (pastel sugar-crystal formations hanging like chandeliers / crystallized-sugar cloud-formations refracting prism-light)

━━━ HARD MANDATES ━━━

- Saturated lush Disney-CGI pastel sky
- Wreck-It-Ralph Sugar Rush register
- Candy elements in the sky

━━━ HARD BANS ━━━

- NO real photoreal cloud / sky textures (must feel candy-confectionary)
- NO dark / stormy / moody atmosphere
- NO industrial / urban skylines
- NO neon-electric colors

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
