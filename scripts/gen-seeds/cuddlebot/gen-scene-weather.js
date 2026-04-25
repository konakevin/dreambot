#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/scene_weather.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SCENE WEATHER descriptions for CuddleBot's outdoor-adventure path — weather conditions that set the mood for an outdoor scene. Each describes the weather and how it affects the atmosphere.

Each entry: 10-20 words. One specific weather condition with atmospheric detail.

━━━ CATEGORIES ━━━
- Sunny golden hour (warm late-afternoon sun, long shadows, golden everything)
- Gentle rain (soft drizzle, puddles forming, droplets on leaves, grey-pink sky)
- After the rain (rainbow arcing, wet surfaces glistening, fresh smell, puddle reflections)
- Light snow (soft flurries drifting, dusting on surfaces, breath visible, cozy cold)
- Misty morning (low fog rolling through, dewdrops on everything, soft diffused light)
- Breezy autumn (leaves swirling, crisp air, warm-cool contrast, scarves fluttering)
- Warm summer (hazy heat shimmer, bright blue sky, lazy clouds, cicada energy)
- Spring bloom (pollen floating, cherry petals drifting, fresh green everywhere, gentle breeze)
- Sunset / magic hour (orange-pink-purple sky, silhouette lighting, warm glow on everything)
- Overcast cozy (soft grey sky, diffused even light, no harsh shadows, intimate feeling)
- Starry night (clear sky full of stars, moonlight casting silver, fireflies, cool air)
- Twilight / blue hour (deep blue sky, first stars appearing, warm lights turning on)
- Rainbow weather (sun breaking through rain, double rainbow, prismatic light on wet surfaces)
- Windy day (clouds racing, hair/fur ruffling, kites pulling, leaves tumbling past)
- Frost morning (ice crystals on grass, frozen dewdrops, breath clouds, warming sunrise)

━━━ RULES ━━━
- Weather is ALWAYS pleasant or charming — never threatening or dangerous
- Rain is gentle and cozy, never stormy
- Snow is light and magical, never blizzard
- Include how the weather FEELS (cozy, refreshing, magical, warm)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
