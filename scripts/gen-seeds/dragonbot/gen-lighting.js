#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/lighting.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for DragonBot — cinematic fantasy lighting treatments. LOTR/GoT/Elden-Ring/Warhammer cinematography.

Each entry: 10-20 words. One specific cinematic fantasy lighting.

━━━ CATEGORIES ━━━
- Golden-hour epic (low-angle amber raked across castle ridgeline)
- Blue-hour vast (deep cobalt dusk over battlefield, contrasting torches)
- Lantern-interior warm (hearth-glow cottage, deep shadow outside)
- Dragon-fire glow (molten amber light on figures, bouncing off stone)
- Moon-and-torch (combined silver moon + warm torch, eerie mix)
- Storm-light (dark clouds breaking with single dramatic god-ray)
- Cathedral-light (vast vertical god-rays through stained-glass)
- Forest-dappled (sun-through-canopy pattern on forest floor)
- Cave-glow (luminous crystals or magical moss lighting chamber)
- Peter-Jackson blue-green (cool teal-green LOTR-film grade)
- Low-key-noir-fantasy (deep shadows with single rim-light)
- Rim-light-silhouette (backlit figure against sun / moon / fire)
- Heroic-low-angle (sunset behind hero with up-angle drama)
- Storm-meets-sunset (dark clouds with amber-breakaway light)
- Underground-torchlight (flame-flicker on stone, deep shadows)
- Moonlit-snow (crisp cold silver on winter landscape)
- Volcanic-amber underlight (lava-glow upward on dragon or lair)
- Snow-reflected-soft (cool white bounce, gentle shadows)
- Tavern-firelight-intimate (warm amber interior)
- Spell-cast glow (magical light emitted from hands or staff)
- Dragon-eye gleam (single burning light amidst darkness)
- Morning-mist-sun (pale-gold through fog, ethereal)
- Battlefield-smoke-pierced (sun-shafts through smoke)
- Witch-cottage candles (multi-point warm interior)
- Burial-mound sunset (ancient site in melancholy amber)
- Hero-moment-central-light (single key light on protagonist)
- Full-moon-blue-world (entire scene in moonlight-dominant)
- Dawn-on-snow-peaks (first-rays alpenglow fantasy mountains)
- Elven-bioluminescence (soft cool-white from trees/plants)
- Torch-column marching (chain of torches through dark hall)

━━━ RULES ━━━
- Cinematic fantasy / concept-art lighting
- Named specific treatments
- Emphasize drama, mood, atmosphere

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
