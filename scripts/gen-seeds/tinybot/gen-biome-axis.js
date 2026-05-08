#!/usr/bin/env node
/**
 * BIOME axis pool — 40 entries.
 *
 * Each entry overrides the path's implied location. Forces TinyBot OUT of
 * its default cottage/village/dollhouse loop into deserts, oceans, alpine,
 * jungles, canyons, etc. Pairs with WEATHER + LIGHTING + ENERGY as the
 * "splash" axes that bend renders away from warm-cozy-twilight.
 *
 * Each entry: 8-18 words. One concrete biome with signature visual.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 40;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/tinybot/seeds/biome_axis.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 20),
  append: APPEND,
  metaPrompt: (n) => `You are writing ${n} BIOME-OVERRIDE descriptions for TinyBot — concrete ecosystems that the miniature scene will be transplanted INTO.

Each entry: 8-18 words. One specific biome with its signature visual element so Flux locks the look. The biome is the TERRAIN/ECOLOGY context — the path's scene seed (cottage / dollhouse / vehicle / mushroom) gets dropped into THIS biome at miniature scale.

━━━ CATEGORIES (span ALL of these — never cluster on one) ━━━
- DESERT (red rock canyon, white gypsum dunes, sand-sea, mesa, painted desert, badlands)
- COASTAL (rocky tidepool, kelp-strewn beach, dramatic cliff coast, sea caves, lighthouse rocks)
- DEEP OCEAN (coral reef, kelp forest, underwater shipwreck, abyssal trench, glowing bioluminescent depth)
- ALPINE/ARCTIC (snowy peak, glacial crevasse, ice cave, frozen lake, blizzard tundra, aurora steppe)
- TROPICAL JUNGLE (rainforest canopy, vine-tangled ruin, monsoon valley, mangrove swamp, banana grove)
- TEMPERATE FOREST (redwood grove, autumn maple wood, birch grove, mossy fern hollow, fairy ring)
- WETLAND (cypress bayou, marsh reed, river delta, foggy swamp, peat bog)
- GRASSLAND (savannah, prairie, alpine meadow, wildflower field, golden-wheat plain)
- VOLCANIC (lava field, obsidian ridge, geothermal pool, sulfur spring, ash plain)
- CANYON/BADLAND (slot canyon, layered sandstone, hoodoo formation, painted hill, rainbow canyon)
- KARST/CAVE (limestone karst, crystal cave, bioluminescent cavern, stalactite chamber, sinkhole)
- POLAR (iceberg field, sea ice, penguin coast, polar twilight, midnight sun tundra)
- RIPARIAN (river bend, waterfall pool, mountain stream, creek through forest, oxbow lake)
- ROOFTOP/URBAN (rooftop garden over city, skyline canyon, rooftop water tower, fire escape jungle)
- AGRICULTURAL (terraced rice paddy, sunflower field, vineyard, lavender row, autumn pumpkin patch)

━━━ FORMAT ━━━
"{BIOME-TYPE}, {signature visual element}, {scale or distance cue}"

Examples:
- "Red-rock slot canyon, layered sandstone walls glowing rust-orange, ribbon of sky overhead"
- "Coral reef shallows, branching staghorn coral and electric-blue tang fish darting"
- "Glacial crevasse, deep ice walls turning sapphire-blue, snowmelt dripping into emerald pool"
- "Mangrove swamp, twisted dark roots arching over still tannin-stained water"
- "Lava field, fresh black basalt with cracks of glowing red molten rock"
- "Slot canyon at midday, vertical sandstone striations in mauve and cream"

━━━ HARD RULES ━━━
- NEVER cottages, villages, dollhouse interiors, cobblestone streets, gardens (those are the path's job).
- NEVER warm cozy mood — biome is RAW NATURE / ENVIRONMENT, not "cozy at golden hour".
- NEVER mention tilt-shift, miniature, scale (those are added by the prompt prefix).
- Variety axis: span ALL 15 categories above. Not just forest + ocean.
- Each entry stands alone — no "and / with elaborate descriptions".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
