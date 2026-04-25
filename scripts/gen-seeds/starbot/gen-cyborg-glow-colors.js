#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_glow_colors.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} GLOW COLOR descriptions for StarBot's cyborg-woman path. Each describes the color of light emitting from a cyborg's eyes, power core, circuit veins, and internal energy systems. This glow is the single unifying light source across her whole body — eyes, chest core, veins under skin ALL glow this color.

Each entry: 2-6 words. A specific, evocative color description.

━━━ WHAT MAKES A GOOD ENTRY ━━━
- Specific enough that Flux renders a DISTINCT color (not just "blue" — "deep cobalt blue" or "flickering teal-white")
- Each entry should produce a visibly DIFFERENT result from every other entry
- Include the quality of the light where it helps: molten, electric, pulsing, cold, warm, bioluminescent, neon, plasma, spectral

━━━ COLOR FAMILIES TO COVER (spread across all) ━━━
- Cyans / teals / aquas (cold electric vs warm tropical)
- Blues (cobalt, sapphire, midnight, ice)
- Greens (toxic neon, emerald, seafoam, bioluminescent)
- Reds / crimsons (blood, infrared, cherry, ember)
- Oranges / ambers (molten, copper, sunset, candlelight)
- Golds (liquid gold, champagne, bronze, honey)
- Pinks / magentas (hot pink, rose, plasma magenta, bubblegum neon)
- Purples / violets (ultraviolet, plum, lavender, deep amethyst)
- Whites / silvers (mercury, moonlight, phosphor, chrome-white)
- Unusual / alien (bioluminescent seafoam, spectral prismatic, black-light UV)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: base hue + warmth/coolness + intensity. "Electric cyan" and "cold teal" are too similar. "Electric cyan" and "deep midnight blue" are distinct enough.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
