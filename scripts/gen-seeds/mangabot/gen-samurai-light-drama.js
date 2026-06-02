#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_light_drama.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} LIGHT DRAMA entries for a MangaBot samurai-era keyframe. Each entry is the STRONG DIRECTIONAL LIGHT SOURCE that gives the scene its cinematic key — separate from time-of-day (that's a different axis).

Each entry: 10-20 words. ONE specific dramatic lighting effect with direction + quality.

VARIETY across these drama-types:
- Sun-shaft through bamboo (god-ray penetrating the grove)
- Torchlight on a wall (warm flicker, deep shadows beyond)
- Shrine-lantern halo (warm-amber glow against dark surroundings)
- Moonlight on snow (cool-silver from above, blue-shadows below)
- Dawn breaking over mountains (horizontal pink-orange across ridges)
- Sunset blood-red side-light (deep crimson raking the figure)
- Sun through paper-shoji (diffused warm light from indoors)
- Lightning-flash silhouette (figure caught against bright sky-flash)
- Candle in window (single warm dot in dark scene)
- Snow-bounce ambient (cool diffuse from snow ground-reflectance)
- Forest-canopy dapple (mottled green-gold light through leaves)
- Stone-lantern path-light (low warm pools along a temple stair)
- Storm-cloud sun-break (single bright shaft from broken cloud)
- Fire-pit warmth (orange firelight on faces, smoke rising)
- Cherry-blossom dawn-glow (pink ambient bouncing off blossom-canopy)

DO write:
- A single sun-shaft penetrating the bamboo canopy, hitting the figure at three-quarter angle
- Warm-amber lantern-halo against deep blue shadow, glow catching katana-pommel
- Cool moonlight from above-left, silvering shoulders and tracing the snow drifts
- Horizontal dawn-pink raking the mountain ridges, side-lighting the temple gate
- Single broken-cloud sun-shaft punching down on the bridge across the misty gorge

DO NOT write:
- Time-of-day descriptors (that's a separate axis — "golden hour" / "midnight" etc. — keep this focused on the light SOURCE + direction + quality)
- Multiple light sources per entry (keep ONE dominant source)
- Soft "ambient" overall lighting — must be DIRECTIONAL with a clear source
- Photoreal lighting terminology (focal-length / f-stop / etc.)
- Modern artificial lights (LEDs, streetlamps, neon)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
