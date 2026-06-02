#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_lighting.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING DIRECTION / QUALITY descriptors for YumBot candy-fantasy — Wreck-It-Ralph Sugar Rush world. Each entry describes HOW LIGHT FALLS in the scene — direction, quality, key/fill, accent — NOT what time of day it is.

Each entry: 12-20 words. ONE specific lighting direction/quality.

━━━ DISTRIBUTION ━━━

- 18% WARM RIM-LIGHT SIDE (7) — warm pastel rim-light from camera-left grazing across characters and candy surfaces with gentle pearlescent highlight kicker
- 16% SOFT DIFFUSE TOP-DOWN (6) — soft diffuse top-down key light wrapping every candy surface in even saturated pastel glow, gentle ambient fill
- 14% DRAMATIC SIDE-LIGHT (6) — dramatic three-quarter side-light from camera-right casting soft pastel shadows across the scene with sugar-crystal sparkle in highlights
- 12% BACKLIT GLOW-RIM (5) — backlit subjects with pastel halo glow-rim outlining each character against the candy-backdrop, soft fill from front
- 10% VOLUMETRIC RAY-SHAFTS (4) — volumetric pastel light-shafts filtering through lollipop-tree canopy in visible god-rays catching airborne sugar-particles
- 10% IRIDESCENT RAINBOW-PRISM (4) — iridescent rainbow-prism light refracting in pastel arcs across the scene with subtle chromatic dispersion on glossy surfaces
- 8% LANTERN POOL-LIGHT (3) — warm pool-light from candy-cane lanterns illuminating the immediate cluster, characters lit from below with gentle uplift
- 6% FAIRY-LIGHT STRINGS (3) — string-light bokeh strung overhead casting soft pastel orb-bokeh across the scene with warm magical accent fill
- 6% PEARLY DIFFUSE GLOW (2) — soft pearly diffuse glow filling the entire scene evenly with subsurface scattering through every candy surface, no hard shadows

━━━ HARD MANDATES ━━━

- ONLY LIGHTING DIRECTION / QUALITY — how light falls
- Sugar Rush pastel saturated lush register
- Each entry READS DIFFERENTLY as a lighting setup

━━━ HARD BANS ━━━

- ABSOLUTELY NO time-of-day words (golden hour / dusk / morning / midday / twilight / afternoon / dawn / sunset — those are in time-of-day axis)
- NO weather descriptors
- NO scene/setting/character description
- NO neon-electric lighting — pastel Disney-CGI lush palette only

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
