#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/bath_time_scenes.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} BATH TIME SCENE descriptions for CuddleBot's bath-time path — adorable bathing and spa scenarios. Species-agnostic (creature placed later).

Each entry: 15-25 words. One specific bath/spa cozy scenario.

━━━ CATEGORIES ━━━
- Clawfoot tub (tiny vintage clawfoot bathtub overflowing with rainbow bubbles)
- Rubber duck fleet (surrounded by rubber ducks of various sizes in sudsy water)
- Foam hat (bubble-foam piled into ridiculous hat/crown shapes on head)
- Towel turban (wrapped in fluffy towel after bath, tiny slippers)
- Bubble beard (foam arranged as silly beard, looking in tiny mirror)
- Candlelit bath (tiny candles around tub rim, rose petals floating)
- Outdoor hot spring (natural tiny pool among mossy rocks, steam rising)
- Shower singing (behind shower curtain, paw holding tiny shampoo)
- Sink bath (bathing in bathroom sink, faucet as waterfall)
- Spa day (cucumber eye-slices, face mask, robe, relaxation pose)
- Waterfall shower (under tiny garden-hose waterfall, eyes scrunched)
- Rain barrel bath (soaking in wooden rain barrel, wildflowers around base)
- Puddle bath (happily splashing in perfect round puddle, soap bubbles)
- Teapot shower (water pouring from teapot spout as shower head)
- Bubble blowing (blowing soap bubbles from tub, iridescent spheres floating)
- Bath toy chaos (overflowing tub of bath toys, creature barely visible)
- Post-bath fluff (freshly dried, impossibly fluffy fur poofed out everywhere)
- Watering-can rinse (friend pouring watering can over head, eyes closed)
- Flower-petal bath (floating in bath of colorful flower petals)
- Steamy mirror (drawing smiley face on steamed-up bathroom mirror)

━━━ RULES ━━━
- Every scene is WARM, STEAMY, and WHOLESOME
- Bubbles and foam are abundant and playful
- NO scary water, no deep water, no drowning risk vibes
- Describe the bath/spa scenario, not the creature

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
