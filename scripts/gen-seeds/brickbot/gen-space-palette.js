#!/usr/bin/env node
/**
 * BRICKBOT_SPACE_PALETTE — themed LEGO Space palettes (Classic-Space, Blacktron, etc).
 * Audit 2026-06-05: 91 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_space_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's space path — themed LEGO Space brick palette stories. Each entry: ONE 14-22 word phrase with palette colors + theme + accent. Format: "<colors>, <faction/theme>"

━━━ THE BAR ━━━
Every entry names a SPECIFIC LEGO Space heritage (Classic-Space, Blacktron-I, M-Tron, Space-Police-I/II, Ice-Planet, Insectoids, Mars-Mission, Galaxy-Squad, etc.) PLUS specific brick colors (yellow + medium-grey + trans-blue / matte-black + neon-yellow / white + neon-orange / etc.). Cohesion-tail naming the theme.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 CLASSIC LEGO SPACE LINES: Classic-Space, Futuron, Space-Police-I, Space-Police-II
- ~5 ANTAGONIST FACTIONS: Blacktron-I, Blacktron-II, Spyrius, UFO
- ~4 PLANETARY EXPLORATION: Ice-Planet, Mars-Mission, Galaxy-Squad
- ~3 EARTH-FUTURE: M-Tron, Aquazone (deep-sea variant), Magma
- ~3 BIOLOGICAL: Insectoids, Life-on-Mars
- ~3 HARD-SF COLOR-STORIES: Expanse-coded grey, Mass-Effect-coded blue+amber, 2001-coded white
- ~3 STAR-WARS-CODED: rebel beige + brown, imperial white + grey
- ~3 LIGHTBLUE / RETROFUTURE: Tintin-coded white + red, Forbidden Planet silver + amber
- ~3 ASTEROID-MINING: orange + dark-grey + iron-rust
- ~3 NEBULA-CRUISER: pearl-silver + trans-magenta + trans-cyan
- ~3 ARMORED ALIEN-CRAFT: matte-black + trans-cyan + dark-grey
- ~2 RESEARCH / SCIENTIFIC: white + dark-grey + trans-cyan
- ~2 LUNAR / MOON-BASE: white + light-grey + trans-yellow
- ~2 COLONY / FRONTIER: rust + tan + dark-bley

━━━ FORMAT ━━━
Each entry: ONE phrase "<color>1 + <color>2 + <color>3 (+ accent), <Theme>". Touchpoints:
"Yellow + medium-grey + trans-blue + white + brushed-aluminium-panel, Classic-Space"
"White + sky-blue + chrome + trans-blue + matte-badge-silver, Space-Police-I"
"Matte-black + neon-yellow + trans-yellow + cool-grey + flat-visor-black, Blacktron-I"

━━━ BANS ━━━
- NO more than 4 main colors + 1 accent
- NO licensed franchise names verbatim (use heritage-coded)
- NO duplicating themes
- NO photoreal vocab

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
