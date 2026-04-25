#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/rainy_day_scenes.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} RAINY DAY SCENE descriptions for CuddleBot's rainy-day-cozy path — cozy scenarios involving gentle rain. Species-agnostic (creature placed later).

Each entry: 15-25 words. One specific rainy-day cozy scenario.

━━━ CATEGORIES ━━━
- Window watching (paws on foggy glass, rain streaking down, warm room behind)
- Mushroom umbrella (sheltering under giant mushroom cap, droplets rolling off edges)
- Puddle splashing (tiny rain boots, jumping in reflective puddle, water sprays)
- Shared umbrella (oversized umbrella, two creatures huddled underneath)
- Leaf umbrella (holding giant leaf overhead, rain beading on surface)
- Rainy picnic (under covered porch, watching rain with hot cocoa)
- Rain-boot parade (marching through puddles in oversized colorful boots)
- Cozy indoor reading (by window, rain outside, blanket and book)
- Paper boat sailing (launching tiny paper boat in rain-stream gutter)
- Flower-petal rain shelter (hiding under giant flower)
- Steamy window drawing (drawing hearts/faces in foggy window glass)
- Rainy garden watering (holding watering can, confused because rain already doing it)
- Cozy porch swing (swinging gently, watching rain fall on garden)
- Rain-soaked mailbox check (peeking out of tiny mailbox door)
- Dripping awning cafe (sitting at tiny outdoor table under dripping striped awning)
- Catching raindrops on tongue
- Building tiny dam in rain-stream with pebbles
- Under upturned teacup shelter
- Peering from tree hollow at falling rain
- Rain-sparkle dancing (twirling in light drizzle with joy)

━━━ RULES ━━━
- Rain is GENTLE and PRETTY — never stormy, dark, or threatening
- Every scene has a warm-vs-rain contrast (cozy shelter vs soft rain)
- NO thunder, lightning, or scary weather
- Describe the rainy scenario, not the creature

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
