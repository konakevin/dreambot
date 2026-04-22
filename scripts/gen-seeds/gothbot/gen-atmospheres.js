#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/atmospheres.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for GothBot — gothic atmospheric elements. Fog / rain / bats / ravens / falling-ash / blood-mist / moths / candles-flicker / cobweb-drift.

Each entry: 6-14 words. One specific gothic atmospheric element.

━━━ CATEGORIES ━━━
- Fog tendrils (creeping fog rolling through cemetery or courtyard)
- Heavy rain (vertical gothic rain with visible droplets)
- Bats in silhouette (swirling bat cloud against moon)
- Ravens circling (pair of ravens in silhouette)
- Falling ash (soft ash-flakes drifting from pyre or sky)
- Crimson blood-mist (barely-visible red haze, atmospheric not gory)
- Moth flurry (moths around candle or lantern)
- Candle-flicker shadows (wall-dancing flame-shadows)
- Cobweb drift (ancient cobwebs catching candle-light)
- Torch-smoke (black smoke trailing from torch)
- Stained-glass color-shafts (colored light rays through stained glass)
- Moonbeam through cracked ceiling (single silver ray)
- Snow-drift gothic (light snow falling on cathedral)
- Rose-petal drift (black-rose petals falling)
- Mist rising from graveyard
- Light-flickering through rain (gas-lamp wavering)
- Ravens at dusk (circling cluster against crimson sky)
- Feathers falling (black feathers drifting)
- Mist-curtain in forest
- Smoke from incense (spiral rising against shadow)
- Spider-silk strands visible in light
- Wind-whipped torn banner
- Rippling candle-flame in draft
- Steam from hot-tea in cold air
- Dust-motes in shaft of window-light
- Mourning-lilies scattered on ground
- Fallen autumn leaves in wind
- Bats emerging from cathedral spire
- Moonlit cobweb on iron gate
- Dust cloud rising from ancient tome

━━━ RULES ━━━
- Gothic atmospheric elements
- Elegant / ornate / never cheap-horror
- Mood-setters for ornate gothic rendering

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
