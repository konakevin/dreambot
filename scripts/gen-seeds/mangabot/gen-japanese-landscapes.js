#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/japanese_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} JAPANESE LANDSCAPE descriptions for MangaBot's anime-landscape path — pure Japanese environments rendered in anime style. No characters. Setting is hero.

Each entry: 15-30 words. One specific Japanese landscape/setting.

━━━ CATEGORIES ━━━
- Shrine complexes (Inari shrine with rows of red torii, Fushimi-style vermillion tunnels)
- Rice paddies (terraced paddies at sunrise, reflection of sky in water)
- Bamboo forests (Arashiyama-style dense bamboo, filtered green light)
- Cedar forests (ancient cedars with moss, Yakushima-style old-growth)
- Zen gardens (raked gravel, stone lanterns, carefully placed stones)
- Mount Fuji views (distant Fuji across cherry-blossom field, at dawn, reflected in lake)
- Edo-period streets (cobbled, paper-lantern lit, ryokan-frontage)
- Old-Tokyo alleys at night (narrow, neon-sign reflections, rainy cobblestones)
- Tatami rooms (sliding shoji doors, low table, tokonoma with scroll)
- Mountain valleys (misty cedar slopes, small farmhouse in distance)
- Cherry blossom tunnels (sakura trees arching over path)
- Koi ponds (ornate garden, stone bridge, koi visible in clear water)
- Tea houses (traditional wooden structure in garden setting)
- Geisha districts at dusk (Gion-style lantern-lit streets)
- Castle interiors (Osaka-style, dark wood, painted screens)
- Mountain monasteries (old stone steps, cloud-shrouded pagoda)
- Onsen baths (outdoor hot spring with snow falling)
- Samurai training grounds at dawn
- Fishing villages at sunset (traditional boats, wooden houses)
- Paddy-field rice-harvest scenes (workers absent, golden rice)
- Mountain-top pagodas in mist
- Autumn maple groves (momiji-style red canopies)
- Snow-covered temple complexes (zen minimalism in winter)
- Matsuri festival streets (paper lanterns strung, yatai food stalls)

━━━ RULES ━━━
- Pure Japanese environments, no characters
- Traditional / old-Tokyo / rural / countryside (save Neo-Tokyo for its own path)
- Anime-illustration aesthetic
- Include specific cultural + visual detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
