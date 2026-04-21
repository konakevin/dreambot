#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/venusbot/seeds/glow_colors.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} GLOW COLOR descriptions for a cyborg woman's eyes + internal core + circuit patterns. Each names the dominant glow color for a render with texture/quality.

Each entry: 5-14 words. Specific color with texture/quality qualifier.

━━━ MIX COLORS ━━━
- Blues (electric cyan, arctic ice, deep cobalt, turquoise plasma, neon sapphire)
- Reds (blood crimson, ember-red, molten ruby, rose-quartz pink, coral-pink)
- Oranges/ambers (molten amber, ember-orange, tangerine plasma, gold-honey)
- Yellows/golds (molten gold, champagne-gold, buttercup-yellow, toxic yellow)
- Greens (toxic acid green, poison-chartreuse, emerald plasma, moss-green, malachite)
- Purples/violets (ultraviolet, deep amethyst, lavender bloom, magenta plasma)
- Pinks (hot magenta, coral glow, bubblegum plasma, rose-gold shimmer)
- Whites/silvers (mercury silver, chrome-white, pearl glow, ivory light)
- Blacks/shadows (void-black-with-star-pinpricks, obsidian-with-glowing-edges)
- Prismatic (rainbow shifting, opalescent, nacre, heat-shimmer)

━━━ QUALITY QUALIFIERS ━━━
- Plasma / molten / liquid / crystalline / holographic / frosted / blazing / smoldering / pulsing / flickering

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
