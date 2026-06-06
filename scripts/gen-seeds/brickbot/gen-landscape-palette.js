#!/usr/bin/env node
/**
 * BRICKBOT_LANDSCAPE_PALETTE — themed 3-4-color palettes for epic vistas.
 * Audit 2026-06-05: 43 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_landscape_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's landscape path — cohesive 3-4-color stories for epic NATURAL-VISTA brick diorama (mountains / glaciers / canyons / coastal / deserts). Each entry: ONE 12-22 word phrase: theme + colors + cohesion tail.

━━━ THE BAR ━━━
Every entry names a vista THEME (Golden-Hour / Blue-Hour / Alpine / Glacier / Volcanic / Canyon / Coastal / Aurora / etc.) PLUS specific LEGO brick colors (Warm Gold / Dark Tan / Dark Azure / Sand Green / Pearl-Silver / Dark Red / Tan / Light Bluish Grey / etc.) PLUS short cohesion tail. CLEAN 3-4 colors max.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 TIME-OF-DAY: Golden-Hour, Blue-Hour, Midday-Crisp, Sunrise-Pink, Dusk-Violet, Alpenglow
- ~5 BIOMES: Alpine snow, Tropical jungle, Desert mesa, Arctic ice, Volcanic, Coastal cliffs, Savanna, Rainforest, Boreal forest, Tundra
- ~3 GEOLOGIC: Red-rock canyon, Granite-mountain, Limestone-cliff, Glacier-blue, Volcanic-black
- ~3 SEASONAL: Autumn-russet, Spring-blossom, Winter-monochrome, Summer-emerald, Monsoon-grey
- ~3 WEATHER: Storm-grey, Aurora-cool, Rainbow-burst, Fog-mist, Sandstorm-haze
- ~3 NATIONAL-PARK ICONS: Yosemite-granite, Patagonia-spire, Grand-Canyon-rust, Banff-glacier, Iceland-volcanic
- ~3 SUNSET-WARM: warm orange + cream + dark red + sky
- ~3 NIGHT / MOONLIT: silver + dark navy + bone-white + pearl
- ~2 RAINBOW-AFTER-RAIN: muted multi-tone
- ~2 GOLDEN PRAIRIE: sand + warm-gold + dark-tan + sky-blue
- ~1 AURORA-SKY palette

━━━ FORMAT ━━━
Each entry: ONE phrase "<Theme> palette — <color>1 + <color>2 + <color>3 (+ <color>4), <cohesion tail>". Touchpoints:
"Golden-Hour palette — Warm Gold + Dark Tan + Tan + Dark Azure shadow-strip, late amber glow gilding the brick mesa peaks"
"Blue-Hour palette — Dark Blue + Dark Bluish Grey + Warm Gold window-glow + Medium Blue, quiet dusk settling over the brick range"
"High-Noon palette — Bright Green + Medium Azure + White + Light Bluish Grey rock, the crisp saturated midday vista"

━━━ BANS ━━━
- NO more than 4 main colors
- NO photoreal vocab
- NO "rainbow" / "any-color"
- NO duplicating themes
- NO mood-modifier as color

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
