#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_weather.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} WEATHER / ATMOSPHERIC CONDITIONS for YumBot's candy-fantasy Sugar Rush world. Each entry describes the AIR ATMOSPHERIC condition of the scene — what's drifting / floating / falling in the air.

Each entry: 12-20 words. ONE atmospheric condition phrase.

━━━ DISTRIBUTION ━━━

- 30% CLEAR CALM (9) — clear pastel candy-air with mild sugar-glitter sparkle drifting softly, no precipitation, calm and crisp
- 18% SPRINKLE-CONFETTI RAIN (5) — rainbow pastel sprinkles falling gently from the sky like soft confetti, drifting through the air
- 14% SUGAR-DUST DRIFT (4) — fine powdered-sugar crystals drifting horizontally in soft pastel hazes catching the light, gentle airborne shimmer
- 10% RAINBOW SHIMMER (3) — iridescent prism shimmer in the air with rainbow refractions catching every surface, dreamy pastel glow throughout
- 10% COTTON-CANDY MIST (3) — soft pink and lavender cotton-candy mist hanging low across the scene, dreamy diffuse pastel fog
- 8% SUGAR-SNOW FLURRY (2) — light marshmallow-snowflake flurry drifting through the air settling onto candy surfaces in soft white flecks
- 6% POP-ROCKS FIZZ (2) — pop-rocks sparkle-fizz crackling in tiny bursts through the air with pastel jewel-tone twinkles
- 4% BUBBLES DRIFTING (2) — pastel iridescent bubbles drifting lazily through the air, soft pearlescent spheres floating at various heights

━━━ HARD MANDATES ━━━

- ONLY ATMOSPHERIC AIR condition — what is happening in the air / sky
- Sugar Rush pastel register throughout
- Disney-CGI lush saturated colors

━━━ HARD BANS ━━━

- NO time-of-day mention (separate axis)
- NO lighting direction (separate axis)
- NO ground / terrain / character / environment description
- NO photoreal weather effects — kawaii pastel only
- NO dark / stormy / scary atmosphere

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
