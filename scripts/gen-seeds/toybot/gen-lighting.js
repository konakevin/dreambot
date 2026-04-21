#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for ToyBot — cinematic toy-photography lighting treatments.

Each entry: 10-20 words. One specific toy-photography lighting treatment.

━━━ CATEGORIES ━━━
- Dramatic studio (key-light + rim-light + fill)
- Explosion lighting (orange-flash from offstage)
- Warm practical lamp (toy-scale lamp lit)
- Tabletop daylight (soft window-through-scene)
- Atmospheric dust-motes in beam
- Spotlight key (single tight pool)
- Backlit rim-light silhouette
- Low-angle heroic
- Overhead stark-drama
- Rainy-window diffuse
- Fire-light orange-flicker
- Moonlight silver-cool
- Fluorescent-workshop flat
- Neon-toy-diorama saturated
- Lightning-strike bright-flash
- Sunset amber raking through toy-set
- Sunrise pale-peach toy-set
- Teal-and-orange cinematic
- Emergency-red strobe
- Cave-torch warm
- Underwater-blue cool
- Street-lamp warm-alley
- Muzzle-flash from toy-weapon
- Campfire dancing warm
- Christmas-lights strung
- Gaslight warm-amber
- Candle-cluster intimate
- Chandelier-crystal refracted
- Spotlight-through-curtain-gap
- Lantern-carried (handheld warm pool)
- Strobe-light disco
- Searchlight from above
- Backlit-from-behind-figure
- Dramatic-silhouette key
- Top-down studio
- Shaft-through-blinds
- Tiny-flashlight pool
- Lava-glow warm-orange
- Ice-cave blue-white
- Electric-arc blue

━━━ RULES ━━━
- Cinematic toy-photography orientation
- Named specific treatments

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
