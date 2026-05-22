#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_light_quality.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} LIGHT-QUALITY entries for a MangaBot ghibli-countryside keyframe. Each entry is the LIGHTING TREATMENT — soft warm Ghibli light, AMPLIFIED toward dramatic-poster-light registers (god-rays, dappled-sun, sunset-glow, dawn-rim, firefly-glow) while keeping daylight variety.

Each entry: 10-20 words. ONE light quality with direction + warmth + dramatic accent.

DRAMATIC LIGHT BIAS (~55% dramatic, 45% baseline daylight):
DRAMATIC (push these):
- GOD-RAYS THROUGH FOLIAGE (defined sun-shaft beams penetrating canopy)
- GOLDEN-HOUR AMBER WARM (low sun, honey-copper saturation, long shadows)
- DAPPLED FOREST GREEN-GOLD (mottled emerald-gold patches dancing on ground)
- DAWN-RIM PINK-ORANGE-HORIZON (horizontal first-light, sky-blush burning)
- FIREFLY-TWILIGHT WARM-AMBER GLOW (scattered firefly-orbs + horizon ember)
- SUNSET-PEACH WARM (warm peach-orange sky, long dramatic shadows)
- SUN-SHAFT THROUGH WINDOW (interior, dust-motes catching warm beam)
- WARM-LANTERN GLOW SPILLING (cottage lantern washing onto engawa porch)
- MOONLIT-PASTORAL COOL (soft moonlight on countryside, blue-silver wash)
- CHERRY-BLOSSOM DAWN-PINK DIFFUSED (blossoms catching dawn's pink)
- FALL-AFTERNOON DEEP-GOLD (warm yellow-orange autumn light through trees)
- TOTORO-FOREST DEEP-EMERALD-GOLD (deep forest shaft with green-gold dappling)

BASELINE DAYLIGHT (keep these for variety):
- OVERCAST SOFT-DIFFUSE (gentle, shadowless, even)
- MIDDAY CLEAR PASTEL (high sun, sky-blue dominant, soft watercolor shadows)
- FOG-DIFFUSED MORNING (early mist softens edges)
- PRE-RAIN GREY-SOFT (cloudy pre-storm, tonally soft)
- STARLIT-NIGHT GENTLE (clear summer night with stars, soft moonlight)

DO write (lead with the dramatic ones):
- God-rays defined sun-shafts cutting through cedar canopy, golden beams hitting the mossy floor
- Golden-hour amber warm low-sun raking the meadow, honey-copper saturation, long pastoral shadows
- Dappled forest green-gold mottled patches dancing across the path, sun through leaves above
- Dawn-rim pink-orange horizon burning along the mountain ridges, soft cool above
- Firefly-twilight warm-amber glow with scattered firefly-orbs and a thin horizon ember
- Sun-shaft through shoji-screen window, single warm beam crossing tatami, dust-motes catching light
- Warm cottage-lantern glow spilling onto the engawa porch, cool blue evening beyond
- Cherry-blossom dawn-pink diffused light, blossoms catching the dawn glow, soft sky behind
- Overcast soft-diffuse light on a quiet cloudy day, gentle even tones
- Midday clear-pastel light, sky-blue dominant, soft watercolor shadows beneath foliage

DO NOT write:
- Cyberpunk neon palette
- Photoreal tech (f-stops / kelvin)
- Multiple light sources per entry
- Light without color/warmth descriptor

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
