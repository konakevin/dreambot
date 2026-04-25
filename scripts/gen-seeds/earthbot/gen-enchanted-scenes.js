#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/enchanted_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ENCHANTED FANTASY LANDSCAPE descriptions for EarthBot — Ghibli/Narnia/Rivendell-inspired landscapes that feel like stepping into a fantasy world. Landscapes only, no characters.

Each entry: 15-25 words. One specific enchanted landscape scene. No people, no creatures as subjects.

━━━ CATEGORIES (mix across all) ━━━
- Floating islands (levitating rock formations with waterfalls pouring off edges, vine bridges between)
- Cloud palaces (structures formed from solidified clouds, mist architecture, sky terraces)
- Moss-draped temples (ancient overgrown stone temples swallowed by jungle, tree roots splitting walls)
- Elvish bridges (impossibly graceful arched bridges over misty chasms, living-wood spans)
- Ancient overgrown ruins (crumbling towers with trees growing through windows, vine-covered colonnades)
- Magical waterfalls (waterfalls flowing upward, rainbow-mist falls, falls into bottomless chasms)
- Crystal grottos (geode caves with amethyst walls, crystal pillars, prismatic light refractions)
- Enchanted forests (trees with glowing sap, spiral-trunk groves, canopies forming cathedral arches)
- Hidden valleys (mist-shrouded valleys visible only from above, secret meadows behind waterfalls)
- Fairy-tale gardens (impossibly lush gardens with oversized flowers, spiral topiaries, petal paths)
- Ancient tree cities (massive hollow trees with carved windows, root-system villages, trunk staircases)
- Mythic mountain passes (dragon-scale ridgelines, passes guarded by stone sentinels, cloud-wreathed peaks)

━━━ RULES ━━━
- FANTASY landscapes only — these should feel magical, impossible, wondrous
- Ghibli warmth + Tolkien grandeur + Narnia wonder as tonal references
- LANDSCAPES only — no characters, creatures, or people populating the scenes
- Rich in texture and detail — moss, vines, water, light, stone, crystal
- No two entries should describe the same type of enchanted setting
- 15-25 words each — wondrous, lush, painterly language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
