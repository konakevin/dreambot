#!/usr/bin/env node
/**
 * BRICKBOT_GIRLY_PALETTE — pastel 3-4-color cohesive palettes for ultra-cute.
 * Audit 2026-06-05: 42 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_girly_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's girly path — cohesive 3-4-color pastel-cute palettes for candy-castle / boutique / mermaid / unicorn / ballet-stage / bakery brick dioramas. Each entry: ONE 14-22 word phrase: theme + colors + cohesion tail.

━━━ THE BAR ━━━
Every entry names a sweet THEME (candy castle / boutique / ice-cream parlor / mermaid lagoon / fairy-meadow / cupcake bakery / etc.) PLUS specific pastel LEGO colors (bright-pink / medium-lavender / light-aqua / sand / mint / butter-yellow / trans-pink / trans-clear / pearl-white / coral-pink / etc.) PLUS short cohesion tail. EVERY entry must read pastel-cute.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 FRIENDS-HEARTLAKE STYLE: bright-pink + mint + lavender + sand
- ~4 CANDY / BAKERY: bubblegum-pink + mint + butter-yellow + cream / cupcake / lollipop
- ~4 BOUTIQUE / FASHION: lavender + cream + rose-gold + trans-pink / Parisian salon
- ~3 MERMAID / OCEAN-PASTEL: aqua + trans-clear + pearl + coral-pink
- ~3 UNICORN / RAINBOW-SUBTLE: pastel-rainbow muted across pink/violet/sky/mint
- ~3 FAIRY / FAE-MEADOW: lavender + trans-cyan + trans-pink + cream
- ~3 BALLET / STAGE: blush-pink + cream + soft-gold + lavender
- ~3 PRINCESS / CASTLE: pearl-pink + cream + warm-gold + lavender
- ~2 SLUMBER-PARTY / SPA: peach + cream + lavender + mint
- ~2 SPRINGTIME / GARDEN: rose + spring-green + cream + butter-yellow
- ~2 CARNIVAL / PASTEL-CIRCUS: cotton-candy pink + mint + lavender + soft-tan
- ~1 PASTEL-WINTER / SNOW-PRINCESS: pearl + ice-blue + lavender
- ~1 PASTEL-SUNSET: peach + coral + lavender + trans-pink

━━━ FORMAT ━━━
Each entry: ONE phrase "<Theme> palette — <color>1 + <color>2 + <color>3 (+ <color>4), <cohesion tail>". Touchpoints:
"Friends palette — bright-pink + medium-lavender + light-aqua + sand, the cheerful Heartlake-City girls' hangout look"
"Candy palette — bubblegum-pink + mint-green + cream + butter-yellow, the sweet-shop sugary-treat look"
"Mermaid Lagoon palette — aqua + trans-clear + pearl + coral-pink, ocean-princess shimmer beneath warm tropical sun"

━━━ BANS ━━━
- NO more than 4 main colors
- NO masculine vocab
- NO harsh / dark / grim colors
- NO photoreal vocab
- NO duplicating themes
- NO "rainbow" / "any-color"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
