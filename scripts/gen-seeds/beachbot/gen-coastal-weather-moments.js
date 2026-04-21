#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/coastal_weather_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COASTAL WEATHER MOMENT descriptions for BeachBot.

Each entry: 10-20 words. One specific coastal weather/time-of-day moment.

━━━ CATEGORIES ━━━
- Golden-hour warm amber across sand
- Blue-hour post-sunset cobalt
- Storm rolling in from sea
- Mist lifting off water at dawn
- Moonlit silver-path on ocean
- Post-rain rainbow arcing over water
- Aurora over arctic beach
- Golden-hour mist-rising (combo)
- Fog-bank rolling over coast
- Heavy-rain sheeting onto beach
- Hailstorm brief over coast
- Thunderstorm with lightning-at-sea
- Sun-dappled post-storm clearing
- Tropical-squall sudden
- Monsoon-curtain rain-line
- Waterspout distant over sea
- Noon-stark high-sun tropical
- Pre-dawn pink strip-of-light
- Mid-morning bright clear
- Afternoon haze warm
- Late-afternoon side-lit
- Evening glow on horizon
- Blue-hour first stars appearing
- Starlit-ocean calm
- Overcast grey-diffuse
- High-clouds thin-streaky
- Cumulus-towers over water
- Mammatus-cloud display
- Lightning-arc over distant sea
- Rainbow-after-shower
- Ice-fog on cold-sea
- Low-fog drifting across sand
- Sand-storm on beach
- Rain-on-warm-sand steaming
- Crepuscular-ray through clouds
- Virga-streaks over sea
- Wild surf with wind-spray
- Calm glass water at sunrise
- Full-moon rising over sea
- Sunset-with-cloud-bank drama

━━━ RULES ━━━
- Weather + time-of-day combinations
- Coastal specific

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
