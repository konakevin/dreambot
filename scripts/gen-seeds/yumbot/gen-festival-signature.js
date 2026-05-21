#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_signature.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} ICONIC MATSURI SIGNATURE elements for a kawaii Japanese festival render. Each entry is ONE specific iconic matsuri prop or decorative element that anchors the scene as a Japanese festival.

Each entry: 12-22 words. ONE specific element. Traditional Japanese matsuri register.

DO write:
- A row of glowing chochin paper-lanterns strung between bamboo poles
- A tall vermilion torii gate
- A wooden yatai food-stall with red-and-white striped awning
- A taiko festival drum on a wooden stand with thick rope binding
- A kingyo-sukui goldfish-scoop tank with paper-poi nets resting beside
- A tanzaku wish-card tree with rainbow-paper wish-tags fluttering
- A wooden mikoshi portable shrine with gold-trim and red-rope handles
- A pastel paper-streamer arch in red and white
- A festival happi-coat hanging from a wooden peg
- A bamboo windbell (furin) wind chime suspended
- A row of festival-banner noren curtains in red and indigo
- A glowing stone-toro lantern with mossy base
- A wooden temple veranda with curving roof tiles
- A bamboo grove with leaf-shadows dappling the ground
- A wooden festival cart with vermillion-trimmed wheels
- A paper-mache demon-mask stall
- A wooden uchiwa hand-fan rack
- A small mochi-pounding mortar and kine wooden mallet
- A row of dango-skewer display sticks in a wooden caddy
- A wooden festival yagura drum tower with rope-lashed scaffolding

DO NOT write:
- Modern objects / electronics / cars / phones
- Western festival elements (Ferris wheel, carnival rides, balloons)
- Real kanji or Japanese-text characters — keep all signage as decorative-pattern
- Foods (those are in food_inhabitants axis)
- Pathway / lane / alley RECEDING into vanishing point — keep elements as standalone props
- Large landscape descriptions (mountains, sky) — those are in other axes

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
