#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_setting.json',
  total: 150,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} DREAMSCAPE SETTINGS for YumBot rainbow-dreamscape. The wider pastel landscape that the kawaii cup-inhabitants sit in. NO cups, NO rainbows (those come from other pools).

Each entry: 20-35 words. ONE specific landscape.

━━━ REFERENCE — bex.ai ━━━

Wider scenic shots: grass-meadow with cherry-blossom-mountains in distance, valley between pastel hillsides, sunny garden clearing with floating-pollen, mountain-pastel-vista with cotton-candy-clouds, flower-strewn pastel hillside, dewy spring-meadow with dewdrops.

━━━ DISTRIBUTION ━━━

- 25% MEADOW-WITH-MOUNTAINS (pastel-grass meadow with cherry-blossom-mountains rising in the distance / dewy spring-meadow with pastel-rolling-hills behind / flower-meadow with pastel-mountain-peaks in haze)
- 20% VALLEY-FLOOR (a pastel-grass valley between two pastel-hillsides / a sun-dappled valley-floor with cherry-blossom-trees / a low pastel-meadow-valley with mountain-vista)
- 15% HILLSIDE / RIDGE (a pastel-flower-strewn hillside / a soft-grass ridge with valley falling away / a pastel-mountain ridge dotted with flowers)
- 15% GARDEN-CLEARING (pastel-garden-clearing surrounded by flowering trees / sun-dappled garden-glade with floating pollen / pastel-rose-garden clearing)
- 10% PASTEL-FOREST-EDGE (edge of a pastel-forest opening onto a meadow / pastel-pine-and-cherry-blossom forest-edge / dappled-light pastel-forest clearing)
- 5% RIVERSIDE / STREAM (pastel-stream winding through a meadow / glassy-pastel-pond in a meadow / soft riverside-meadow with reflections)
- 5% FAIRYTALE-LAND (pastel-cotton-candy-cloud-floor land / floating-meadow-island in pastel-sky / dream-meadow with iridescent-grass)
- 5% MOUNTAIN-SUMMIT (pastel-mountain-summit overlooking pastel-clouds-below / sky-meadow on a pastel-peak)

━━━ HARD MANDATES ━━━

- PASTEL palette throughout
- WIDER scenic feel — not tabletop
- Painterly hand-illustrated landscape (NOT photoreal)

━━━ HARD BANS ━━━

- NO cups / kawaii foods (those come from inhabitants pool)
- NO rainbows (other pool)
- NO sky-specific (other pool — focus on the LAND here)
- NO indoor / tabletop / industrial

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
