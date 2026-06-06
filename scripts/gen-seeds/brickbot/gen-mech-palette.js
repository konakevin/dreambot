#!/usr/bin/env node
/**
 * BRICKBOT_MECH_PALETTE — 3-4-color themed mech palettes.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_mech_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's mech path — cohesive 3-4-color mech / titan / robot stories. Each entry: ONE 14-22 word phrase: theme + colors + cohesion tail.

━━━ THE BAR ━━━
Every entry names a mech-faction or color-story THEME (Industrial-Grunt / Bionicle-Toa / Hero-Bot / Apex-Predator / etc.) PLUS specific LEGO brick colors (dark-bley / warning-yellow / pearl-silver / trans-neon-green / black / trans-orange / etc.) PLUS short cohesion tail.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 INDUSTRIAL / BATTLE: dark-bley + warning-yellow + trans-cyan / rust + iron-orange / olive + black
- ~5 HERO-FACTORY / BIONICLE: pearl-silver + gold + trans-orange / cobalt-blue + white + trans-yellow
- ~4 STEALTH / NIGHT: matte-black + dark-bley + trans-purple / midnight-blue + dark-red
- ~3 SAMURAI / EASTERN: red + dark-gold + black + white
- ~3 KAIJU-HUNTER / TITAN: dark-bley + trans-cyan + warning-orange
- ~3 ECO / VERDANT: olive + dark-green + sand-tan + trans-light-green
- ~3 ROYAL-MECH / KNIGHT: dark-azure + pearl-gold + white + trans-purple
- ~3 ARCTIC: white + trans-cyan + dark-blue + pearl-silver
- ~3 DESERT: dark-tan + olive + sand-yellow + brown
- ~3 VOLCANIC: dark-red + black + trans-orange + iron-orange
- ~3 CYBERPUNK / NEON: black + magenta + trans-cyan + dark-bley
- ~2 SPORT / RACING: bright-red + white + black + trans-yellow
- ~2 ANCIENT / BRASS: pearl-gold + dark-red + cream + black

━━━ FORMAT ━━━
Each entry: ONE phrase "<Theme> palette — <color>1 + <color>2 + <color>3 (+ <color>4), <cohesion tail>". Touchpoints:
"Industrial-Grunt palette — dark-bley + warning-yellow + trans-cyan + black, the hard-working battle-machine heritage"
"Bionicle-Toa palette — pearl-silver + pearl-gold + trans-neon-green + black, bio-mechanical and mythic elemental warrior"
"Cyberpunk-Stealth palette — matte-black + magenta + trans-cyan + dark-bley, the shadow-hunter night-ops mech"

━━━ BANS ━━━
- NO more than 4 main colors
- NO photoreal vocab
- NO "rainbow" / "any-color"
- NO duplicating themes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
