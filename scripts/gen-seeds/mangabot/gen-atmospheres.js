#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/atmospheres.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for MangaBot — anime-typical atmospheric particles and effects. Petal-rain, firefly, pollen, rain, fog, snow-drift, spirit-wisps.

Each entry: 6-14 words. One specific anime-atmospheric element.

━━━ CATEGORIES ━━━
- Cherry-blossom rain (sakura petals drifting)
- Autumn maple-leaf drift (red momiji)
- Firefly cloud (hotaru in summer night)
- Pollen-gold backlit (summer haze Shinkai-style)
- Rain sheets (heavy rain, anime slanted)
- Rain puddle-ripples (on concrete, slow-mo)
- Fog-curtain (mountain valley mist)
- Snow-drift (falling snow anime-slow)
- Spirit-wisps (faint floating spirit-orbs, Ghibli)
- Paper-lantern-light drift (festival atmosphere)
- Smoke-from-incense (shrine setting)
- Steam-rising (from onsen, ramen, kettle)
- Cyberpunk-rain neon (heavy rain + neon reflections)
- Holographic-glitch particles (Neo-Tokyo)
- Sparkle-effect anime-magic
- Wind-swept-grass motion
- Dust-motes in shaft of sunlight
- Fireworks-ash drift (festival)
- Petal-wind-gust (intense sakura flurry)
- Mist-rising-from-water (morning lake)
- Snow-on-pagoda-roofs
- Cat-paw-print-in-fresh-snow
- Umbrellas in rain-crowd (overhead view atmosphere)
- Lantern-light-fog combo
- Spirit-orbs around night-forest

━━━ RULES ━━━
- Anime-specific atmospheric details
- Visual / renderable / painterly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
