#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_interior_time_of_day.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY phrases for ChibiBot rainy-interior — when this rainy day is happening. The interior is always warm-amber-lit; the exterior is dim/blue-grey from the rain regardless.

Each entry: 8-15 words. ONE time-of-day moment that emphasizes the cozy-warm vs stormy-cool contrast.

━━━ DISTRIBUTION ━━━

- 25% overcast afternoon (grey overcast afternoon with steady rain and ambient diffuse blue-grey light outside / dreary mid-afternoon rain with cool light through the window)
- 20% dusk / twilight (early-dusk blue-hour rain with the room glowing warm and the outside indigo / late-twilight rain with first lamps lighting / soft-pink-and-grey dusk with rain still falling)
- 20% candlelit / lamplit evening (warm candlelit interior at night with rain drumming the window / lamplit room at deep evening with rain on the glass / fireplace-glow at night with rain-streaked window)
- 15% rainy morning (overcast morning rain with pearl-grey light / pre-dawn rain with the first light just creeping in / drizzly morning with warm interior lamp still lit)
- 10% stormy midnight (deep-night rain with only candles and oil-lamps for interior light / late-night storm with rain drumming windows / midnight with a single lamp still on)
- 5% magical-time (rainbow-breaking-after-rain moment / steam-rising-from-thawed-windows / lightning-flash-illuminating-the-room briefly)
- 5% golden-hour-breaking-through-clouds (the room lit by a single golden god-ray breaking through clouds at sunset / brief warm orange-light moment between storm clouds)

━━━ HARD BANS ━━━

- NO bright sunny midday (this is RAINY — overcast at brightest)
- NO setting or window-view language
- NO creatures or activity

━━━ DEDUP ━━━

Dedup by time + ambient quality + signature detail.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
