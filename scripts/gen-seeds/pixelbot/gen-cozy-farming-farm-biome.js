#!/usr/bin/env node
/**
 * PIXELBOT_COZY_FARMING_FARM_BIOME — season + time + atmosphere combo
 * for the 16-bit cozy life-sim path. Stardew Valley / Harvest Moon /
 * Story of Seasons / Animal Crossing pixel register. Title-caps prefix
 * matching the existing pool. ~35-50 word entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_cozy_farming_farm_biome.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} FARM-BIOME entries for PixelBot's cozy-farming-life-sim path — 16-bit Stardew Valley / Harvest Moon / Story of Seasons / Animal Crossing / Spiritfarer pastoral register. Each entry combines SEASON + TIME-OF-DAY + WEATHER/ATMOSPHERE + PALETTE for a cozy farm biome state. Title-caps prefix THEN " — " separator THEN 35-50 word description.

━━━ THE BAR ━━━
Every entry is ONE distinct seasonal-cozy moment on a pixel-art farm. Specifies SEASON (spring/summer/autumn/winter or in-between), TIME (dawn/morning/noon/afternoon/twilight/dusk/night), a WEATHER signal (sun/rain/mist/snow/fog/wind/clear/storm), the PALETTE (named colors), and a MOOD register. Generous, cozy, magical-pastoral SNES-era register. NEVER dark/grim.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"SPRING-RAIN MORNING — soft spring morning with light drizzle falling steady and gentle, cool-grey-and-green palette, wet reflective surfaces catching pale sky, sprouting greens vibrant under the rain, fresh pastoral mood"
"GLOWING SUMMER SUNSET — summer evening with sun sinking low on the horizon, warm-orange-and-coral-pink palette flooding the entire scene, long soft pixel-shadows, gorgeous golden-hour register"
"CHERRY-BLOSSOM SPRING — spring afternoon with cherry-blossoms at peak bloom, drifting soft-pink petals filling the air, warm-pastel palette of rose and cream, golden-soft side-light, generous dreamy-spring register"
"FIREFLY DUSK SUMMER — summer dusk with cool-blue twilight settling softly, warm-yellow firefly-pixels drifting and blinking through the dimming air, magical late-summer evening register"

━━━ VARIETY MANDATE (distribute across all four seasons + atmospheric phenomena) ━━━

Distribute roughly evenly across:
- ~25% SPRING (rain / mist / dew / cherry-blossom / fresh-sprout / mud-puddle / soft-pastel / sun-shower / pollen-drift / new-leaf)
- ~25% SUMMER (golden-noon / firefly-dusk / lazy-haze / coastal-breeze / sunflower-glow / monsoon-rain / heat-shimmer / picnic-light / lantern-night / starlit)
- ~25% AUTUMN (golden-leaves / harvest-amber / morning-frost / pumpkin-fog / honey-light / crisp-noon / wood-smoke / chestnut-glow / hay-bale / scarecrow-dusk)
- ~25% WINTER (snow-fall / frost-morning / blue-twilight / fireside-warmth / aurora-night / soft-blizzard / icicle-glint / cocoa-cabin / lantern-snow / silent-deep-blue)

Across all seasons, cover variety on:
- TIMES: dawn, morning, noon, afternoon, twilight, dusk, evening, night, deep-night
- WEATHER: sunny, drizzle, rainshower, mist, fog, snow, wind, clear-stars, golden-haze, post-rain
- COZY PALETTE: warm-amber, soft-pink, golden-yellow, cool-mint, peach-cream, silver-frost, deep-indigo-twilight, mossy-emerald

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then the description.
- Body is one sentence, 35-50 words.
- ALWAYS specify SEASON + TIME-OF-DAY explicitly.
- ALWAYS specify PALETTE in named colors (warm-yellow / cool-blue / coral-pink / etc.).
- ALWAYS end with a register tag ("cozy register", "pastoral mood", "generous evening register", etc.).
- Tone: cozy, magical, generous. NEVER grim, dark, ominous.

━━━ BANS ━━━
- NO grim / dark / ominous / threatening atmospheres — this is a COZY life-sim.
- NO modern objects (cars, phones, electric lights — only lanterns / oil-lamps / candles).
- NO character/NPC content — biome only (NPCs go in farmer_villager_life pool).
- NO crops/structures named — biome only (locales/crops go in farm_locale pool).
- NO photoreal language — this is 16-bit pixel-art register.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string in the "TITLE-CAPS — body" format.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
