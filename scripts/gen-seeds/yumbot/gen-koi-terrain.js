#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_terrain.json',
  total: 50,
  batch: 18,
  metaPrompt: (n) => `Write ${n} POND-SURFACE / WATER textures for a kawaii koi-pond scene. The creatures are half-submerged in or floating on this surface.

Each entry: 10-18 words. ONE specific water/pond surface.

DO write:
- Glassy still pond water reflecting wisteria blooms above
- Soft pastel-mint-tinted pond water with floating lily-pads
- Shallow pond water with smooth pebbles visible beneath
- Lavender-tinted pond water dotted with floating lotus-petals
- Glassy pond surface with tiny concentric ripples spreading
- Pastel-pink-tinted shallow pond water with pebbles below
- Mossy-edged pond water with reflected pagoda silhouette
- Soft-blue twilight pond water with golden lantern-reflections
- Pond water with floating cherry-blossom petals scattered across
- Shimmering moonlight-touched pond water with pearl reflections
- Pond with smooth river-rocks emerging from shallow water
- Misty pond water with soft fog hovering across the surface
- Lavender-dawn pond water with reflected wisteria blooms
- Pearl-cream pond water under soft warm lantern-light
- Pond with floating lotus-leaves and pink lotus-blooms across surface
- Glassy twilight pond reflecting pastel-pink sky overhead
- Pond water with sparkle-mist drifting just above the surface
- Pebble-bottom shallow pond with shimmering ripples
- Pond water with floating paper-cranes drifting gently
- Soft-aqua pond water under wisteria-shadow dappled patterns

DO NOT write:
- Foreground creatures
- Sharp / receding leading lines into vanishing point
- Modern surfaces
- Dark / scary water

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
