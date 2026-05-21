#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_terrain.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} GROUND-TEXTURE descriptors for a Japanese matsuri (festival) scene. Each entry describes ONLY the ground/floor texture under the kawaii foods — what they're standing/sitting/perched on.

Each entry: 10-18 words. ONE specific ground/floor texture.

DO write:
- Worn cobblestone matsuri-path with mossy-edges
- Wooden boardwalk planks weathered by festival foot-traffic
- Gravel shrine-path dotted with white pebbles
- Tatami-mat floor woven in pale-cream rice-straw
- Stone-tile temple-courtyard with mossy seams
- Red-painted lacquer wooden cart-deck
- Paper-confetti-strewn matsuri ground in pastel-rainbow
- Sakura-petal carpet over soft moss
- Hardpacked-dirt matsuri square with scattered pebbles
- Wooden veranda planks in warm cedar-gold
- Stone-lantern paving with weathered moss between blocks
- Polished-wood festival-stage flooring
- Bamboo-mat festival picnic-ground
- Sun-bleached stone temple-steps
- Soft sand-and-pebble matsuri foreground
- Tatami-edged wooden flooring with kimono-rope detail
- Wooden shrine-gate paving with worn stone edges
- Patterned-tile matsuri courtyard
- Red velvet picnic blanket on tatami
- Maple-leaf carpet over stone matsuri-paving

DO NOT write:
- Modern surfaces (asphalt, concrete, tile flooring of mall, etc.)
- Pathway / lane RECEDING into distance — terrain is a CARPET / SURFACE not a leading line
- Foods, characters, atmosphere — terrain only

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
