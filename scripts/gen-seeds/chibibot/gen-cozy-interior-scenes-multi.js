#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_interior_scenes.json',
  total: 400,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MULTI-CHARACTER COZY INTERIOR scenes for ChibiBot's cozy-interior path. The pool already has 200 single-creature scenes — your job is to add PAIR + TRIO scenes for character variance.

Pixar / Sanrio / Studio Ghibli STYLIZED. NEVER photoreal. Mix baby + adult creatures freely. Cozy lived-in INTERIOR rooms — snug cottage living rooms, library nooks, kitchens, bedrooms, attic studios.

Each entry: 18-28 words.

━━━ COUNT MIX ━━━
~60% PAIR / ~40% TRIO. Force "TWO DISTINCT chibi figures equally prominent" / "TRIO of chibi" / "all three visible" composition language. DIFFERENT species per character.

━━━ INTERIOR TYPES (mix broadly) ━━━
Sun-warmed cottage living room / cozy reading nook with bay window / kitchen with fresh bread / attic studio with skylight / wood-stove parlor / firelit bedroom with patchwork quilt / fern-filled conservatory / pottery studio with kiln / tea-room with floral wallpaper / library with cascading shelves / kitchen breakfast nook / window-seat with cushions / quilted bedroom / writing desk by window / pantry with hanging herbs / armchair by hearth

━━━ MULTI-SPECIES COMBOS ━━━
Pairs: hedgehog + mouse / fox + bunny / cat + sparrow / squirrel + chipmunk / badger + mole / kitten + duckling / rabbit + dormouse / fox + owl
Trios: three siblings / parent + two young / two friends + a tea-bird / mixed-species reading group

━━━ COZY OVERLAY (every entry) ━━━
- Densely cluttered interior: stacked books, plants, knit blankets, hot drinks, lit candles, wildflowers, accumulated mementos, framed photos, postcards, brass lamps, ceramic mugs, embroidered cushions
- Warm amber-tungsten light pooling, golden-hour through window, brass lamp glow, candle-flicker
- Multi-character RELATIONAL — reading together / sharing tea / napping piled on chair / cooking together / window-watching / playing chess / sharing a quilt / one comforting another

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO sterile / minimalist / IKEA-bare interiors
- NO identifiable humans
- NO single-creature entries (multi only)

━━━ DEDUP DIMENSIONS ━━━
UNIQUE interior-type + species-combination + activity per entry.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "TWO DISTINCT chibi figures equally prominent: hedgehog reading book and mouse pouring tea in cozy reading nook, bay-window with golden-hour glow, plants cascading"
- "TRIO of chibi siblings — three round kittens piled on a wing-back armchair by the hearth, all three visible, knit blankets and brass lamp glow"
- "TWO DISTINCT chibi figures: fox at desk writing letter, owl perched on lamp watching, cozy attic studio with skylight and starry sky behind"
- "TRIO of chibi creatures around kitchen breakfast nook — squirrel pouring milk, chipmunk holding muffin, sparrow on teapot — all three foregrounded, fresh bread cooling"
- "TWO DISTINCT chibi figures equally prominent: badger and mole sharing pottery wheel in studio with kiln glow, both equally lit, shelves of finished mugs behind"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
