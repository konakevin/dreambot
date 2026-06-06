#!/usr/bin/env node
/**
 * BRICKBOT_MACRO_DISPLAY_PALETTE — cohesive color stories for the whole
 * complete-diorama brick build. Audit 2026-06-05: existing 16 entries —
 * undersized. Target 200.
 *
 * Each entry is a 3-4-color palette tied to a theme — works as a unified
 * COLOR-STORY across the whole build (terrain + structures + accents).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_macro_display_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's macro-display path — cohesive 3-4-color stories unifying an entire COMPLETE-DIORAMA brick build (terrain + structures + accents reading as one harmonious color world). Each entry is ONE 12-22 word phrase naming a themed palette + its colors + a one-phrase tail explaining the cohesion.

━━━ THE BAR ━━━
Every entry must name a theme (alpine / port / castle / city / fantasy / steampunk / desert / volcano / arctic / savanna / neon-city / etc.) PLUS the specific brick color names (sand-green / dark-bley / trans-cyan / olive / bley / sand-blue / aqua / dark-tan / dark-red / etc.) PLUS a short cohesion tail. The palette must read CLEAN and UNIFIED — 3-4 main colors max so the whole world hangs together.

━━━ VARIETY MANDATE (distribute roughly across these theme categories) ━━━
- ~5 NATURAL BIOME palettes (alpine / desert / jungle / arctic / savanna / coastal / volcanic / forest / tundra / wetland)
- ~5 BUILT-WORLD palettes (port / city / castle / town / village / market / harbor / fairground / industrial / steampunk)
- ~4 SCI-FI / FUTURE palettes (mars / lunar-base / orbital / cyberpunk / underwater-base / arctic-research / asteroid / off-world / neon-city / spaceport)
- ~3 HISTORICAL palettes (medieval / pirate / wild-west / Victorian / ancient-Egyptian / classical-Greek / Edo-Japan / colonial / ancient-Maya / Norse)
- ~3 SEASONAL / WEATHER palettes (winter-village / autumn-harvest / spring-bloom / monsoon / dust-storm / heat-wave / aurora / blizzard / mist-dawn / sunset-strip)
- ~2 GENRE palettes (haunted / fairy-tale / wartime / festival / carnival)
- ~2 ARCHITECTURAL palettes (red-brick-industrial / whitewashed-Mediterranean / black-and-glass-modernist / pagoda-cinnabar / adobe-pueblo / log-cabin / wattle-and-daub / stone-keep)
- ~1 MONOCHROME-WITH-ACCENT palettes (grey + one trans-color / sand + one trans-color / earth-tones + one trans-color)
- ~1 HIGH-CONTRAST DUAL-TONE palettes (black + white + one accent / red + cream + one accent)

━━━ FORMAT ━━━
Each entry: ONE phrase "<Theme> palette — <color>1 + <color>2 + <color>3 (+ <color>4), <cohesion phrase>". Use legitimate LEGO color names where natural (light-bley / dark-bley / sand-green / dark-tan / olive / sand-blue / aqua / earth-orange / dark-red / trans-cyan / trans-orange / trans-clear / pearl-gold). Touchpoint examples:
"Alpine palette — snow-white + timber-brown + pine-green + slope-grey, a crisp cohesive mountain-resort color-story"
"Mars palette — rust-red + clean-white + trans-cyan + dark-bley, the off-world colony look"
"Port palette — harbor-blue + sandstone-tan + weathered-timber + grey, a coherent maritime color-story"
"Steampunk palette — brass + bronze + rust + bottle-green, a cohesive retro-industrial metropolis"
"Neon-city palette — black + dark-bley + trans-neon-orange + trans-neon-green, a cohesive cyberpunk nightscape read"

━━━ BANS ━━━
- NO photoreal language
- NO more than 4 main colors per palette — the build must read CLEAN
- NO "rainbow" / "any-color" palettes — every entry is THEMED
- NO mood-modifiers as colors ("happy-yellow") — name a real brick color
- NO duplicating themes already in pool — vary the theme + color story

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
