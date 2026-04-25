#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/cute_creatures.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} CUTE CREATURE descriptions for CuddleBot — the adorable stylized creatures that are the hero subjects. Mix of exaggerated-real + fantasy-cute. Pixar / Sanrio / Totoro energy. BIG eyes, soft round shapes, infinite cuteness.

Each entry: 10-20 words. One adorable creature with identifying cute details.

━━━ CATEGORIES ━━━
- Exaggerated-real baby animals (tiny sloth with giant dewy eyes, puffy round bunny, fluff-cloud kitten, marshmallow panda cub, chubby baby dragon stylized)
- Fantasy-cute creatures (moss-sprite with leaf-cap, cloud-kitten with fluff-paws, tiny flower-dragon with petal-wings, star-bunny with constellation-freckles, tea-drop spirit)
- Forest sprites (mushroom-fairy, acorn-hedgehog, ivy-sprite with leaf-ears)
- Mythical cute (baby unicorn round-bodied, pastel baby phoenix, starfall fox)
- Tiny puffy birds (round chickadee with enormous eyes, storybook owl, giant-eyed hummingbird)
- Puff-ball creatures (soft moss-ball with face, cloud-blob with stubby legs)
- Oversize-head storybook proportions (chibi proportions — big head, tiny body, giant eyes)
- Fluff creatures (bunny with impossible fluff, fluff-cat, fluff-fox)
- Tiny water-spirits (bubble-bub with big eyes, droplet-spirit)
- Pastel dragon hatchlings (pink egg-hatchling, mint-green baby with curl-tail)
- Seasonal cute (pumpkin-spice fox, gingerbread-bun creature, cotton-candy sheep)
- Cozy cute (scarf-wearing bunny, blanket-burrito kitten, mitten-clad hamster)

━━━ RULES ━━━
- ALWAYS stylized/illustrative — NEVER photoreal
- BIG eyes, soft round shapes, exaggerated cute proportions
- No dark/edgy/creepy — pure wholesome delight
- Include 2-3 specific cute details per entry (eye type, fur, accessories, size, etc.)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
