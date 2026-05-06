#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/cozybot/seeds/cozy_window_views.json',
  total: 60,
  batch: 20,
  metaPrompt: (n) => `You are writing ${n} COZY WINDOW-VIEW descriptions for CozyBot — what the viewer sees through a window in an interior scene. The window is the cozy contrast — warm inside, cool/wild outside. 15-30 words each.

━━━ THE FORMULA ━━━
Each entry describes a view OUTSIDE a window — usually cold, wet, or wintry — that makes the warm interior feel safer by comparison.

━━━ CATEGORIES (distribute across ${n}) ━━━
- Rain-on-glass (~25%): rain streaking down panes / heavy rain drumming / sheeting rain warping a wet street / condensation fogging corners
- Snow scenes (~25%): heavy snowfall falling thick / snow piled on outer sill / blizzard against the glass / pine boughs heavy with snow / lone street-lamp lit through snow
- Twilight / dusk (~15%): deep cobalt sky transitioning to violet / first stars appearing / silhouette of distant trees / low autumn sun setting
- Forest / nature views (~10%): birch grove at dusk / pine forest deep with snow / autumn maples in peak color / fern-and-moss garden / Japanese garden with stones
- Old streets / villages (~10%): wet cobblestones reflecting lamps / quiet alley / distant gabled rooflines / old-Europe night street empty
- Lakes / water (~5%): frozen lake reflecting twilight / lake mist rising at dawn / dock with snow piled / autumn lake reflecting flame-trees
- Mountain / horizon (~5%): distant snow-capped peaks / fog rolling through valleys / dawn light on mountain ridge
- Dramatic weather (~5%): lightning flash distant / thunderstorm rolling in / wind moving the trees / fog dense enough to obscure

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. Specific named view (street / forest / mountain / etc.)
2. Specific weather / time-of-day (rain / snow / dusk / fog / etc.)
3. Color temperature outside (cool blue / silver-grey / violet-twilight / etc.)
4. ONE evocative detail (a single street-lamp lit / pine bough heavy / star appearing)

━━━ HARD BANS ━━━
- NO bright midday sun
- NO summer beach scenes
- NO surreal / impossible (no aurora, no planets, no fantasy creatures)
- NO people visible outside

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "Heavy rain sheeting down the leaded-glass panes, distorting the dim grey street beyond, single street-lamp casting wavering yellow into the wet"
EX-2: "Thick snow falling silently outside the window, piled three inches deep on the outer sill, distant pine boughs sagging heavy with snow, deep blue twilight"
EX-3: "Dusk forest beyond the window, birch trunks pale against violet sky, first star appearing, leaf-litter on the ground turning indigo as light fails"
EX-4: "Old European cobblestone alley wet from earlier rain, distant gabled rooflines, single gas-lamp glowing yellow, mist rising from the warming stones"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
