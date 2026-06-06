#!/usr/bin/env node
/**
 * BRICKBOT_WESTERN_PALETTE — 3-4-color western palettes.
 * Audit 2026-06-05: 44 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_western_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's western path — cohesive 3-4-color stories for Wild-West frontier brick dioramas. Each entry: ONE 14-22 word phrase: theme + colors + cohesion tail.

━━━ THE BAR ━━━
Every entry names a western THEME (Classic-Cowboys / Cavalry / Gold-Rush / Frontier-town / Spaghetti-Western / Mexican-Border / etc.) PLUS specific brick colors (reddish-brown / dark-tan / sand-blue / dark-red / pearl-gold / tan / olive / dark-brown / etc.) PLUS cohesion tail.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 CLASSIC COWBOYS: rust + tan + barn-red + reddish-brown
- ~4 CAVALRY / FRONTIER FORT: sand-blue + tan + dark-tan + reddish-brown
- ~4 GOLD-RUSH MINING: pearl-gold + reddish-brown + dark-tan + light-bley
- ~3 OUTLAW / BANDIT: dark-grey + dark-red + black + tan
- ~3 SHERIFF / LAW-AND-ORDER: dark-blue + gold-star + tan + white
- ~3 SPAGHETTI-WESTERN SUNSET: warm-amber + dark-red + dusty-rose + black
- ~3 BORDERLANDS / MEXICAN-FRONTIER: terracotta + dark-tan + dark-red + olive
- ~3 RANCH / RANCHER: olive + dark-tan + dark-brown + barn-red
- ~3 NATIVE-FRONTIER (generic-coded): tan + dark-tan + red-clay + dark-brown
- ~3 GHOST-TOWN ABANDONED: bleached-grey + dark-tan + faded-red + brown
- ~3 MOUNTAIN-WESTERN: dark-bley + dark-tan + dark-green + brown
- ~3 RAILROAD / IRON-HORSE: black + iron-orange + dark-brown + sand
- ~2 DESERT-SUN HARSH: bleached-tan + dark-brown + dusty-red + sky-blue
- ~2 SALOON-INTERIOR WARM: dark-brown + reddish-brown + warm-tan + pearl-gold

━━━ FORMAT ━━━
Each entry: ONE phrase "<Theme> palette — <color>1 + <color>2 + <color>3 (+ <color>4), <cohesion tail>". Touchpoints:
"Classic-Cowboys palette — reddish-brown + dark-tan + dark-red + tan, the dusty main-street frontier-town iconic look"
"Cavalry palette — sand-blue + tan + dark-tan + reddish-brown, the frontier-fort garrison heritage"
"Gold-Rush palette — pearl-gold + reddish-brown + dark-tan + light-bluish-grey, the boomtown-mining color story"

━━━ BANS ━━━
- NO more than 4 main colors
- NO photoreal vocab
- NO "rainbow" / "any-color"
- NO duplicating themes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
