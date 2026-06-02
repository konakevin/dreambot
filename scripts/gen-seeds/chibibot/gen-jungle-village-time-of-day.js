#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_village_time_of_day.json',
  total: 50,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} TIME-OF-DAY phrases for ChibiBot jungle-village — drowsy / golden / candlelit / sunlight-filtering times in a cozy jungle. The jungle canopy filters all light into dappled patterns.

Each entry: 8-15 words.

━━━ DISTRIBUTION ━━━

- 25% GOLDEN-HOUR (peach-amber low-angle sun filtering through canopy / honey-gold late-afternoon dappling the village / warm sunset slanting between trees)
- 20% MIDDAY-FILTERED (warm midday sun dappling through giant leaves / bright canopy-light pooling on walkways / clear sky overhead with deep green shadows)
- 15% BLUE-HOUR TWILIGHT (gentle blue-hour with lantern-flowers lighting on / lavender pre-dusk with first warm lamps glowing / cool twilight with warm village-glow)
- 15% CANDLELIT EVENING (warm lantern-light at deep evening / village glowing amber against deep green night-jungle / paper-lantern festival glow at night)
- 10% DAWN (pearl-grey dawn with mist still in the canopy / pre-dawn with first golden hint filtering / cool-blue dawn with first villagers awake)
- 10% MOONLIT NIGHT (silvery-blue moonlight through canopy gaps / bioluminescent night with mushroom-glow / starlit jungle with single moonbeam)
- 5% MAGICAL-TIME (rainbow-mist after warm rain / golden god-rays piercing the canopy / aurora-faint through canopy / first-light-of-spring breaking through)

━━━ HARD BANS ━━━

- NO setting / village language
- NO creatures or activity
- NO weather
- NO bright direct daylight without filter (jungle canopy ALWAYS filters)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
