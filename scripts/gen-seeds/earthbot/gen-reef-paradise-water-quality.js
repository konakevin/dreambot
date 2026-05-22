#!/usr/bin/env node
/**
 * EarthBot reef-paradise — WATER QUALITY axis (R2 PIVOT).
 *
 * The water aesthetic itself — clarity, color gradient, surface texture,
 * reflections, caustics. Generic descriptors only.
 *
 * MVP at 40.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/reef_paradise_water_quality.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} WATER QUALITY entries for EarthBot reef-paradise (R2 pivot — pretty island-bay aesthetic). Each entry describes ONE water-aesthetic moment — the CRYSTAL WATER itself as a protagonist. Clarity, color gradient, surface texture, reflections, caustics. NOT the bay shape. NOT the shoreline. NOT the sky. ONLY the water.

━━━ THE BAR — THE WATER AS THE PROTAGONIST ━━━

Crystal-clear tropical water — turquoise, cobalt, sapphire, aquamarine. Surface mirror-glass or gently rippled. Light caustics dancing beneath. Sun-glint sparkle. Reflections of the sky. The water is the SECOND HERO of the frame (after the bay shoreline).

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one water-quality description, 14-26 words.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **A CLARITY DESCRIPTOR** (the transparency of the water):
   - "crystal-clear visibility to the sandy bottom"
   - "mirror-glass crystal clarity"
   - "tack-sharp visibility through the surface"
   - "translucent crystal turquoise"
   - "perfect crystal clarity to thirty feet"
   - "glass-like transparency"

2. **A COLOR GRADIENT** (the saturation + transition):
   - "gradient brilliant turquoise edges fading to deep sapphire center"
   - "saturated cobalt-to-aquamarine gradient"
   - "deep cobalt center transitioning to brilliant turquoise shallows"
   - "sapphire-to-turquoise gradient across the bay"
   - "saturated aquamarine throughout"
   - "deep ultramarine fading to pale turquoise at the edge"

3. **A SURFACE TEXTURE** (what the surface is doing):
   - "mirror-glass surface, no wind ripples"
   - "gentle ripple-pattern crossing the surface"
   - "soft glass-like surface with tiny shimmer flickers"
   - "delicate ripples catching the light"
   - "perfectly flat mirror surface reflecting the sky"
   - "sun-glint sparkle across the upper-water surface"

4. **OPTIONAL — CAUSTIC LIGHT or REFLECTION** (most entries should include one):
   - "caustic light-patterns dancing under the surface"
   - "sky reflected perfectly in the mirror surface"
   - "sun-glint scatter sparkling across the surface"
   - "clouds reflected in the mirror surface"
   - "moving caustic ribbons just below the surface"

━━━ HARD BANS ━━━

NEVER include:
- Bay shape / setting words
- Shoreline / palm / cliff / mountain words
- Sky / cloud / sun-ray detail
- Coral / fish / underwater wildlife
- Composition / camera words
- Humans / boats
- Storm / dark / muddy water
- Named places
- Murky / sediment / cloudy water

━━━ EXAMPLES ━━━

✓ "Crystal-clear turquoise water with gradient brilliant turquoise edges fading to deep sapphire center, mirror-glass surface reflecting the sky"

✓ "Saturated cobalt-to-aquamarine gradient across the bay, gentle ripple-patterns crossing the surface, caustic light-patterns dancing just below"

✓ "Deep cobalt center transitioning to brilliant turquoise shallows, sun-glint sparkle scattering across the gentle surface, tack-sharp visibility through"

✓ "Mirror-glass crystal clarity, saturated turquoise gradient, perfectly flat surface reflecting the sky and clouds above"

✓ "Translucent crystal turquoise water, gentle ripples catching the light in flickers, soft caustic ribbons moving below the surface"

✓ "Glass-like transparency to the bottom, sapphire-to-turquoise gradient across the bay, sun-glint sparkle dancing across the gentle ripples"

✓ "Perfect crystal clarity, saturated aquamarine throughout the bay, mirror-glass surface reflecting cloud highlights from above"

✓ "Tack-sharp clarity through the surface, deep ultramarine fading to pale turquoise at the edge, sun-glint scatter sparkling across the upper-water"

✓ "Saturated turquoise crystal water, soft glass-like surface with tiny shimmer flickers, caustic light-ribbons moving below the surface"

✓ "Crystal-clear visibility, brilliant turquoise gradient across the bay, gentle ripples crossing the surface, sun-glint sparkle dancing"

✗ BAD — bay shape: "Crystal water filling a horseshoe cove" (BANNED — bay_setting owns shape)
✗ BAD — shoreline: "Turquoise water below palm-fringed cliffs" (BANNED — shoreline_drama)
✗ BAD — sky: "Water reflecting sun-bursting clouds" (allowed in moderation, but sky_drama owns sky detail — focus on water)
✗ BAD — coral: "Water with coral visible below" (BANNED — coral identity dead)

━━━ DISTRIBUTION ━━━

Mix across entries:
- ~40% mirror-glass surface (calm)
- ~35% gentle-ripple surface (slight motion)
- ~25% sun-glint sparkle surface (light scattering)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Crystal water with clarity + color gradient + surface texture. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
