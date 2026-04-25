#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/lighting.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SPECIFIC LIGHTING CONDITION descriptions for EarthBot — precise descriptions of how light behaves in a landscape, defining the quality, direction, color, and character of illumination.

Each entry: 15-25 words. One specific lighting condition applied to a landscape. No people.

━━━ CATEGORIES (mix across all) ━━━
- Golden hour side-light (low sun raking across terrain, long shadows, warm amber glow on faces of cliffs)
- Blue hour afterglow (deep cobalt sky after sunset, cool ambient light, no direct sun)
- Backlit mist (sun behind fog creating bright white haze, silhouettes emerging from glow)
- Split lighting through clouds (dramatic chiaroscuro, one patch of sun on dark landscape)
- Reflected light off water (bounced lake light on cliff faces, river reflections on overhangs)
- Dappled shade through canopy (coin-sized light spots on forest floor, shifting leaf shadows)
- Moonlight silver wash (full moon painting landscape in cold silver, deep blue shadows)
- Overcast diffused light (flat soft light, no shadows, saturated colors, moody even illumination)
- Rim lighting on edges (sun behind subject creating bright outline, haloed silhouettes)
- Sunrise first-rays (horizontal pink-orange beams, first contact with mountain peaks)
- Stormy dramatic light (dark sky with single bright break, spotlight on one feature)
- Reflected sunset glow (warm light bouncing off clouds onto landscape below, indirect golden wash)

━━━ RULES ━━━
- LIGHTING QUALITY is the subject — direction, color temperature, intensity, character
- Each entry describes how the light transforms a specific landscape element
- Real lighting physics only — no fantasy glow or impossible light sources
- Mix warm/cool, harsh/soft, direct/reflected across entries
- No two entries should describe the same lighting type on the same terrain
- 15-25 words each — precise, photographic, painterly language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
