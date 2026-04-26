#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/contained_worlds.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CONTAINED WORLD descriptions for TinyBot's contained-worlds path — any contained miniature world. Terrariums + object-containers (teacup/eggshell/book/kettle/lunchbox/perfume-bottle/music-box) + surreal-tiny juxtapositions.

Each entry: 15-30 words. One specific contained-world with surreal-cute idea.

━━━ CATEGORIES (mix classic terrariums + objects + juxtapositions) ━━━
- Classic glass terrarium with moss-path + tiny lizard
- Teacup with tiny beach inside + umbrella + lounger
- Eggshell with tiny pond + swan + willow-tree
- Open book with tiny picnic on pages
- Kettle-top with tiny garden growing
- Lunchbox with tiny room layout
- Perfume-bottle with tiny miniature floating-island
- Music-box with tiny ballet-scene
- Tiny climbers scaling croissant like mountain
- Beach-scene inside clam-shell
- Snow-globe with tiny cabin inside
- Mason-jar with tiny firefly meadow
- Clock-face with tiny city built on numbers
- Acorn with tiny library inside
- Walnut-shell with tiny ship in it
- Teapot with tiny dragon sleeping inside
- Piano-keys as city-street with tiny cars
- Cup-of-coffee with tiny rowboat on surface
- Donut-hole with tiny world inside
- Mushroom-cap with tiny cottage on top
- Gramophone-horn with tiny figures descending into
- Pumpkin-interior with tiny rooms carved
- Cereal-bowl with tiny swimmers
- Cupcake with tiny picnic on top
- Stamped-envelope with tiny people emerging
- Lightbulb with tiny sun inside
- Honeycomb-cell with tiny bee-society apartment
- Leaf-cup with tiny rainwater and boat
- Crystal-ball with tiny city visible
- Tiny mountaineer-climbing-stack-of-books
- Sushi-roll with tiny surfer on top
- Espresso-cup with tiny waterfall pouring in
- Seashell with tiny mermaid-lounge
- Cheese-wheel with tiny apartment-building
- Slice-of-cake with tiny library inside
- Matchbox with tiny bedroom inside
- Chess-piece with tiny castle-interior
- Donut-with-tiny-roller-coaster
- Tiny hikers on ice-cream-cone mountain
- Spoon with tiny sleeping figure
- Ball-of-yarn with tiny house-inside

━━━ RULES ━━━
- Cute + clever
- Container or juxtaposition (flexible definition)
- NEVER sci-fi / dark / horror
- Surreal-tiny energy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
