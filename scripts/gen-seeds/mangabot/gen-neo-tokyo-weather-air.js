#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_weather_air.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} WEATHER + AIR entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry is the ATMOSPHERIC TREATMENT — what's falling, drifting, steaming, hazing through the air. Rain is dominant (Blade-Runner standard) but not always; vary the air-treatments.

Each entry: 10-20 words. ONE specific weather/air condition with sensory drift detail.

WEATHER-AIR VARIETY:
- POURING RAIN with neon-streaks (heavy vertical rain, neon-reflection streaks)
- DRIZZLE-MIST (light rain, surface-wet but not pouring, mist between buildings)
- STEAM from manholes / kitchens (vertical steam-pillars rising)
- DRONE-BLUR TRAFFIC (light-trail blur from hovercars/drones overhead)
- FOG WITH NEON PENETRATION (low fog, neon rays cutting through)
- ACID-RAIN SHIMMER (slightly toxic-shimmer rain, pavement-pooling iridescence)
- DUST-STORM YELLOW HAZE (post-apocalyptic-bleed air, yellow-tinged haze)
- TYPHOON HORIZONTAL RAIN (sideways rain, slanted, wind-whipped)
- MIST-POOL AT STREET-LEVEL (low fog hovering ankle-knee height)
- SMOG OVERCAST (no rain, just heavy gray-pink smog ceiling)
- CHERRY-BLOSSOM AMID KANJI (rare — petals mixing with cyberpunk signage)
- BLACK-RAIN FROM ABOVE (Akira-style — oily dark rain hinting at disaster)
- DRONE-WIND DRAFT (hovercar passes leave visible wind-streak in puddles)
- POST-EXPLOSION DEBRIS DRIFT (faint ash falling like snow — apocalyptic register)

DO write:
- Pouring vertical rain with neon-streaks etched against the dark backdrop, puddles erupting at every drop
- Light drizzle making the pavement glassy, mist hovering between megabuildings, distant signage diffused
- Vertical steam-pillars rising from manholes and ramen-stall kitchens, mixing with the cool wet air
- Hovercar light-trails arcing across the upper frame in motion-blur streaks, slow drift across the night
- Low cyan fog penetrated by hot-pink neon rays from above, beams cutting visible through the haze
- Acid-rain shimmer makes the pavement-pools iridescent, surface tension catching the magenta sign-reflections
- Typhoon-grade horizontal rain whipping sideways, hatching neon-streaks across the entire frame

DO NOT write:
- Sunny / clear / pleasant weather (neo-tokyo skies are dark/wet/hazed)
- Pastoral nature elements (no falling cherry-blossoms without cyberpunk context)
- Multiple weather effects per entry — ONE clear treatment
- Indoor-only effects (must affect the outdoor scene visibly)
- Pastel-colored air (must be neon-tinted or noir-dark or smog-haze)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
