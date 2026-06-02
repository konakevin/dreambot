#!/usr/bin/env node
/**
 * EarthBot hidden-corner — LIGHTING axis.
 *
 * Intimate diffused / dappled / shaft-filtered light. NEVER flat
 * overcast. Light is part of the magic of the hidden pocket.
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/hidden_corner_lighting.json';
// Append mode — scale R0 50-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING entries for EarthBot hidden-corner. Each entry names ONE specific intimate-scene lighting condition — dappled canopy light, sun shaft piercing through gap, fog-filtered diffuse, golden-hour glow, overcast soft, dawn mist, etc. Real Earth ONLY. NEVER flat overcast — light always has character.

━━━ THE BAR — ONE INTIMATE LIGHTING CONDITION ━━━

The light that creates the magic of the hidden pocket. Dappled canopy patterns falling across the moss, shaft of light piercing through a canopy gap, fog-filtered diffuse glow, soft golden-hour warmth, overcast diffuse for richer color, dawn mist with rising light.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "description": "<intimate lighting condition, 16-28 words>" }

Bare strings acceptable.

━━━ LIGHTING TYPES (vary across these) ━━━

- DAPPLED CANOPY — patches of sun and shade through dense leaves overhead
- SUN-SHAFT PIERCING — single dramatic beam through a canopy gap into the pocket
- GODRAYS / MULTIPLE SHAFTS — several light shafts plural fanning through the canopy
- FOG-FILTERED DIFFUSE — soft glow from morning fog overhead, scene diffuse-lit
- GOLDEN HOUR — warm low-angle sidelight raking through the foreground
- DAWN MIST — soft pale light rising through mist clinging to the scene
- OVERCAST SOFT — cool diffuse light bringing out moss and leaf saturation
- BLUE HOUR — soft cool blue-violet ambient before sunrise / after sunset
- BACKLIT FROM ABOVE — sun behind the canopy with rim-light edges on the leaves
- WET-SURFACE GLEAM — light reflecting off water and wet stones throughout

━━━ EXAMPLES ━━━

✓ { "description": "Dappled canopy light scattering patches of warm sun and cool shadow across the mossy stones and pool surface throughout the scene" }

✓ { "description": "A single dramatic sun-shaft piercing through a canopy gap above and falling vertically into the hidden pocket, lighting the foreground moss in golden light" }

✓ { "description": "Multiple atmospheric godrays plural fanning down through the dense canopy, lighting drifts of fog at the midground in soft volumetric beams" }

✓ { "description": "Soft fog-filtered morning light diffusing through mist clinging to the scene, every wet surface glistening in muted pale-warm tones" }

✓ { "description": "Warm golden-hour sidelight raking across the foreground at a low angle, lighting every dew droplet and leaf edge in amber" }

━━━ ABSOLUTELY BANNED ━━━

- Flat overcast / lifeless / boring lighting — light must have character
- Bioluminescent / aurora / cyan-wash / fantasy-coded color
- Single beam / single shaft / single column as the ONLY descriptor (use "shafts plural fanning" if multiple to avoid laser-beam Flux trigger)
- Aurora-borealis / nacreous / iridescent / sun-dogs
- Sci-fi / fantasy / portal / impossible-light
- Architecture-coded light (chandelier / spotlight / studio)
- "Fire" as a noun

━━━ OUTPUT ━━━

JSON array of ${n} entries. ONE intimate lighting condition per entry. Real-Earth, varied across types. No preamble, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
