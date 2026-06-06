#!/usr/bin/env node
/**
 * BRICKBOT_THEME_PARK_PALETTE — themed 3-4-color theme-park palettes.
 * Audit 2026-06-05: 44 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_theme_park_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's theme-park path — cohesive 3-4-color stories for amusement-park / carnival / midway brick dioramas. Each entry: ONE 14-22 word phrase: theme + colors + cohesion tail.

━━━ THE BAR ━━━
Every entry names a park-theme (Neon-night / Carnival-stripe / Candy / Pirate-cove / Spooky-Halloween / Princess-fairy / Western / Steampunk / etc.) PLUS specific brick colors (trans-red / trans-blue / bright-red / white / dark-blue / bright-pink / etc.) PLUS cohesion tail.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 NEON-NIGHT: trans-element-heavy night palettes, dark + multi-trans
- ~5 CARNIVAL-STRIPE: red + white + barber-pole stripe, bright primary big-top
- ~4 CANDY / SWEET: pink + mint + butter-yellow + cream
- ~3 PIRATE-COVE THEME-ZONE: tan + brown + red + black
- ~3 HALLOWEEN-SPOOKY: black + orange + purple + glow-green
- ~3 PRINCESS / FAIRY: pastel-pink + lavender + cream + gold
- ~3 WESTERN-FRONTIER: rust + tan + barn-red + dark-brown
- ~3 STEAMPUNK / MECHANICAL: brass + bronze + dark-bley + bottle-green
- ~3 JUNGLE / SAFARI: olive + dark-tan + brown + trans-green
- ~3 SCI-FI / FUTURE: chrome + trans-cyan + matte-black + trans-blue
- ~3 ICE-WORLD WINTER: white + ice-blue + trans-cyan + silver
- ~3 SUMMER BEACH: aqua + sand + bright-yellow + coral
- ~2 RAINBOW PARK: muted multicolor festival
- ~2 GOLD-RUSH WESTERN: gold + dark-brown + tan
- ~2 PASTEL-CIRCUS: cotton-candy pink + mint + lavender

━━━ FORMAT ━━━
Each entry: ONE phrase "<Theme> palette — <color>1 + <color>2 + <color>3 (+ <color>4), <cohesion tail>". Touchpoints:
"Neon-night palette — trans-red + trans-blue + trans-yellow over dark-blue, electric and dazzling, rides ablaze against fairground dark"
"Carnival-stripe palette — bright-red + white + bright-light-orange + dark-tan, classic big-top bunting and barber-pole cheer"
"Candy palette — light-purple + mint + tan + bright-pink, sweet and playful, cotton-candy midway warmth"

━━━ BANS ━━━
- NO more than 4 main colors
- NO photoreal vocab
- NO "rainbow" / "any-color"
- NO duplicating themes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
