#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/sleepy_nap_spots.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SLEEPY NAP SPOT descriptions for CuddleBot's sleepy-naptime path — impossibly cozy places where a tiny creature has fallen asleep. Species-agnostic (creature placed later).

Each entry: 15-25 words. One specific cozy nap spot with sleeping-cozy details.

━━━ CATEGORIES ━━━
- Flower-petal beds (curled inside a giant rose, tulip hammock, sunflower cradle)
- Teacup naps (asleep in oversized teacup, saucer as blanket)
- Cloud pillows (dozing on a tiny cloud, cloud-stuffed hammock)
- Mushroom cap beds (under a spotted mushroom, mushroom-top mattress)
- Book naps (fallen asleep on open storybook, using bookmark as blanket)
- Yarn ball beds (nestled in soft yarn, knitting-basket cocoon)
- Leaf hammocks (strung between branches, acorn-cap pillow)
- Windowsill naps (on cushion by rain-streaked window, afternoon sun patch)
- Nest naps (cozy bird-nest lined with cotton, feather blanket)
- Blanket forts (tiny pillow fort, draped-fabric cave)
- Crescent moon perch (asleep on crescent moon tip)
- Pocket naps (asleep in coat pocket, mitten sleeping bag)
- Fruit-half beds (inside a hollowed peach, strawberry cradle)
- Seashell beds (curled in spiral shell, pearl pillow)
- Lantern-lit treehouse loft (tiny bed with glowing lantern)
- Cloud-island floating bed
- Acorn-shell cradle rocking gently
- Inside a warm bread loaf (cartoon-cozy)
- On a stack of tiny pancakes as mattress
- In a tiny boat drifting on still pond

━━━ RULES ━━━
- Every spot must be IMPOSSIBLY COZY — the viewer whispers "shhh"
- Describe the spot and its cozy details, not the creature
- NO dark or scary spots — warm, safe, wholesome only
- Include sleeping-comfort details (tiny blanket, pillow, warmth source)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
