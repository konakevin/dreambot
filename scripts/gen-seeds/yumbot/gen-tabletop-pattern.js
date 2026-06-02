#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_pattern.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing \${n} PASTEL CHECKERED/GINGHAM/PLAID TABLECLOTH descriptions for YumBot checkered-tabletop. The signature pattern.

Each entry: 10-18 words.

━━━ REFERENCE — bex.ai ━━━

Pastel pink + soft blue gingham is most common. Variations: pastel pink + yellow plaid, pastel pink + cream checker, pastel mint + pink gingham, pastel rainbow-stripe.

━━━ DISTRIBUTION ━━━

- 35% PASTEL-PINK-BLUE GINGHAM (pastel-pink and soft-blue gingham checkered tablecloth / pastel pink-blue gingham-pattern)
- 25% PASTEL-PINK-YELLOW PLAID (pastel-pink and butter-yellow plaid tablecloth / pink-yellow gingham)
- 15% PASTEL-PINK-CREAM CHECKER (pastel-pink and cream checkered tablecloth / pink-and-cream gingham-pattern)
- 10% PASTEL-MINT-PINK GINGHAM (pastel-mint and pink gingham / mint-pink check)
- 5% PASTEL-LAVENDER-CREAM (pastel-lavender and cream checker / lavender-cream gingham)
- 5% PASTEL-PEACH-CREAM (pastel-peach and cream gingham / peach-pink check)
- 5% PASTEL-RAINBOW-STRIPE (pastel-rainbow striped tablecloth / pastel-multi-stripe pattern)

━━━ HARD MANDATES ━━━

- Pattern is CLEARLY VISIBLE across the surface
- Pastel palette only
- Tablecloth-soft fabric register (slight wrinkle / fabric-texture okay)

━━━ HARD BANS ━━━

- NO solid-pastel (without pattern)
- NO dark / saturated colors
- NO industrial / hard surfaces

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
