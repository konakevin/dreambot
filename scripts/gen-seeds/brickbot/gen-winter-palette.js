#!/usr/bin/env node
/**
 * BRICKBOT_WINTER_PALETTE — 3-4-color winter palettes.
 * Audit 2026-06-05: 44 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_winter_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's winter path — cohesive 3-4-color stories for alpine/winter-village/arctic brick dioramas. Each entry: ONE 14-22 word phrase: theme + colors + cohesion tail.

━━━ THE BAR ━━━
Every entry names a winter THEME (Winter-Village holiday / Arctic-explorer / Alpine-resort / Ice-castle / Frozen-pond / Aurora-night / etc.) PLUS specific brick colors (white / festive-red / dark-green + pearl-gold / safety-orange / silver / ice-blue / etc.) PLUS cohesion tail.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 WINTER-VILLAGE HOLIDAY: festive red + dark-green + white + pearl-gold
- ~4 ARCTIC-EXPLORER: safety-orange + white + black + light-bley
- ~4 ALPINE-RESORT: warm-tan + reddish-brown + white + dark-green
- ~3 ICE-CASTLE: white + trans-cyan + pearl-silver + dark-blue
- ~3 AURORA-NIGHT: dark-navy + trans-green + trans-purple + white
- ~3 FROZEN-POND: trans-blue + white + bone + medium-grey
- ~3 NORDIC-VIKING: dark-bley + dark-red + white + reddish-brown
- ~3 SNOWY-FOREST: dark-green + white + dark-tan + pearl-grey
- ~3 BLIZZARD: white + light-bley + black + faint-blue
- ~3 ICE-FISHING: dark-blue + white + reddish-brown + dark-tan
- ~3 SLEIGH-RIDE: dark-green + dark-red + cream + white
- ~2 PENGUIN-COLONY: black + white + warm-orange + cool-grey
- ~2 WHITE-CHRISTMAS: pearl-white + festive-red + dark-green + warm-gold
- ~2 ICE-HOTEL TOURISM: trans-cyan + pearl-silver + white + ice-blue

━━━ FORMAT ━━━
Each entry: ONE phrase "<Theme> palette — <color>1 + <color>2 + <color>3 (+ <color>4), <cohesion tail>". Touchpoints:
"Winter-Village holiday palette — festive red + dark-green + white + pearl-gold, cozy and nostalgic, warm gold window-glow against snow-white roofs"
"Arctic-explorer palette — safety-orange + white + black + light-bluish-grey, crisp and modern, high-visibility gear on a white ice-shelf"
"Aurora-Night palette — dark-navy + trans-green + trans-purple + white, the magical polar-night arc above a sleeping snowfield"

━━━ BANS ━━━
- NO more than 4 main colors
- NO photoreal vocab
- NO "rainbow" / "any-color"
- NO duplicating themes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
