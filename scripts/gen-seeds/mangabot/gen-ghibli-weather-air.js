#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_weather_air.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} WEATHER + AIR entries for a MangaBot ghibli-countryside keyframe. Each entry is the AIR-MOTION — what's drifting, swaying, dappling through the frame. Ghibli's air is ALIVE — wind in grass, dappled-shadow, mist, petals, fireflies.

Each entry: 10-20 words. ONE specific weather/air condition with sensory drift detail.

GHIBLI AIR-MOTION VARIETY:
- SUMMER BREEZE GRASS-WAVE (wind rolling across tall grass in visible waves)
- DAPPLED FOREST SUN (sun-dappling through foliage onto ground)
- DRIFTING CHERRY-BLOSSOM PETAL-RAIN (sakura petals carried sideways)
- AUTUMN MAPLE LEAF-DRIFT (red-and-gold leaves swirling across path)
- MORNING MIST RISING (low fog lifting from valley at dawn)
- SOFT DRIZZLE-SHIMMER (light rain making everything dewy)
- FIREFLY-DUSK DRIFT (warm-yellow firefly motes rising through twilight)
- DRAGONFLIES IN AIR (slow-flying summer dragonflies, iridescent wings)
- POLLEN-MOTES IN SUN-SHAFT (golden specks in light-beam)
- CUMULUS-CLOUDS BUILDING (slow-rolling fluffy clouds, summer afternoon)
- WIND-CHIME TINKLING AIR (visible breeze, hanging chimes moving)
- FIRST-SNOW SOFT-DRIFT (light first-snow falling on warm landscape)
- WATER-LILY POND-STILL (calm air, mirror-still water reflecting sky)
- BIRDS IN FLIGHT (cranes / sparrows / swallows wheeling through air)
- DRYING-LAUNDRY BILLOW (white sheets billowing on line in breeze)
- HEAT-HAZE SUMMER (warm-air shimmer rising from hot midday road)

DO write:
- Summer breeze rolling across the tall grass in visible waves, wildflowers bobbing in unison
- Dappled forest sun penetrating the foliage canopy, golden-yellow patches dancing on the ground
- Cherry-blossom petal-rain drifting sideways across the scene, pink sakura settling on hat-brim and shoulders
- Autumn maple leaves swirling around the figure's footfall, crimson and gold lifted by the wind
- Morning mist rising slowly from the valley below, low fog clinging to the grass at knee-height
- Warm-yellow firefly motes rising through the twilight air, dozens of glowing points drifting lazily
- Iridescent-winged dragonflies hovering slowly above the iris pond, slow-figure-eights in the still air
- Golden pollen-motes drifting through a sun-shaft, suspended specks catching the light
- Slow-rolling cumulus clouds building tower-shapes overhead, summer afternoon haze
- White laundry-sheets billowing on a line in the breeze, casting moving shadows across the grass

DO NOT write:
- Cyberpunk / urban weather (neon-streaks / acid-rain)
- Dramatic storm / lightning / apocalyptic
- Indoor air (must affect outdoor scene)
- Multiple weather types per entry — ONE
- Static / lifeless descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
