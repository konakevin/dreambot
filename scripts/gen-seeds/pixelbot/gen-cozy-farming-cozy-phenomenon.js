#!/usr/bin/env node
/**
 * PIXELBOT_COZY_FARMING_COZY_PHENOMENON — 40%-gated cozy magical-pastoral
 * phenomenon accent for the cozy-farming-life-sim path. Stardew Valley /
 * Harvest Moon / Spiritfarer / Ooblets register. Drifting petals / fireflies
 * / butterflies / lanterns / leaves / mist / rainbow / snow. ~25-40 words.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_cozy_farming_cozy_phenomenon.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} COZY-PHENOMENON entries for PixelBot's cozy-farming-life-sim path — 40%-gated magical-pastoral atmospheric phenomenon accents. Stardew Valley / Harvest Moon / Story of Seasons / Spiritfarer / Ooblets / Animal Crossing register. Title-caps prefix THEN " — " separator THEN 25-40 word description.

━━━ THE BAR ━━━
Every entry is ONE cozy / magical / pastoral phenomenon (drifting petals / fireflies / butterflies / leaves / smoke / lanterns / rainbow / mist / aurora / snow / etc.). Soft, generous, COZY, slightly magical. Specifies COLOR + DRIFT/MOTION + AMBIENT light + REGISTER. NEVER ominous or weather-disaster — cozy phenomena only.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"CHERRY-BLOSSOM PETAL-DRIFT — soft pink cherry-blossom petals drifting thickly across the farmyard in slow spirals, gentle spring breeze implied, generous magical-spring register"
"FIREFLY-SWARM AT DUSK — warm-yellow firefly-pixels clustering above the pond at twilight, cool-lavender sky behind them, peaceful late-summer magical evening register"
"DAPPLED CANOPY-LIGHT — soft warm-yellow dappled sunlight filtering through the orchard canopy onto grass below, sun-spots dancing slowly across the ground, magical summer register"
"STRUNG-LANTERN GLOW — hand-strung lanterns glowing warm-amber against a deep-blue harvest-evening sky above the barn door, festive deeply cozy register"

━━━ VARIETY MANDATE (distribute across these phenomena) ━━━

- ~4 PETAL / FLORAL (cherry-blossom petal-drift / rose-petal swirl / wisteria-petal cascade / dandelion-fluff drift / pollen-cloud sun-shimmer / sakura-petal-storm / wildflower-petal carpet / camellia-petal puddle)
- ~4 FIREFLY / SPARKLE (firefly-swarm at dusk / glow-bug cluster / will-o-wisp drift / pixie-mote sparkle / dust-mote sunbeam / sparkle-trail drift / starlight-shimmer / dew-shimmer twinkle)
- ~4 BUTTERFLY / BIRD (butterfly-cloud over flowers / monarch-migration drift / hummingbird-pixel hover / dragonfly-shimmer / songbird-swirl / sparrow-flock / cardinal-pair / blue-jay flit)
- ~4 LEAVES / SEASONAL (autumn-leaf-drift / falling-cherry-leaves / spinning-maple-leaves / golden-aspen-leaves / pine-needle drift / oak-leaf swirl / fern-frond breeze-rustle / leaf-whirlwind)
- ~3 LANTERN / GLOW (strung-lantern glow / paper-lantern row / hanging-bulb-string / wind-chime gleam / fairy-light-string / candle-pool-glow / torchlight cluster / lantern-festival rows)
- ~3 MIST / FOG (morning-mist veil / valley-fog low / pond-mist swirl / dew-mist sunrise / orchard-mist soft / forest-mist tendrils / smoke-from-chimney curl / chimney-smoke ribbons)
- ~3 RAINBOW / LIGHT (double-rainbow arc / rainbow-after-rain / aurora-shimmer / sun-shower rainbow / prismatic-spray fountain / sunbeam-pillar / sun-shafts canopy / light-pillar dawn)
- ~3 SNOW / FROST (snow-flake drift / first-snow gentle / snowflake-pixel cluster / frost-glitter dawn / sleet-drift wisp / snow-puffs trees / snow-blanket reveal)
- ~3 WIND / WEATHER (wind-rustle grass / fluttering-banners / fluttering-laundry / billowing-curtains / windswept-wheat / dust-devil tiny / hay-particle drift)
- ~3 ANIMAL ACCENT (chicken-feather drift / sheep-fluff cluster / cat-stretch ripple / dog-bark cloud / honeybee-swarm hover / spider-web shimmer / minnow-school ripple-pond)
- ~3 SPECIAL / FESTIVE (festival-confetti drift / soap-bubble cloud / floating-paper-lanterns sky / kite-string flutter / wishing-paper-tablet float / harvest-shine glow / aurora-ribbon dawn)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- ALWAYS specify COLOR (warm-yellow / soft-pink / cool-lavender / golden-amber / etc.).
- ALWAYS specify DRIFT / MOTION verb (drifting / spiraling / clustering / shimmering / floating / wafting / dancing).
- ALWAYS end with a cozy register tag ("generous magical-spring register", "deeply cozy register", "peaceful late-summer evening register", etc.).
- Body is 25-40 words, single phrase.

━━━ BANS ━━━
- NO ominous / dark / threatening atmospheres — cozy only.
- NO violent weather (storm / lightning / hail / tornado) — gentle only.
- NO characters / NPCs in this pool — phenomenon ONLY.
- NO photoreal — 16-bit pixel-art cozy register.
- NO modern objects in the phenomenon — natural / lantern / festival only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
