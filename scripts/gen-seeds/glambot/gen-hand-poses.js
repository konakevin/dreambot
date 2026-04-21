#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/hand_poses.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} HAND POSE descriptions for GlamBot's nail-and-hand path — editorial hand poses.

Each entry: 10-20 words. One specific editorial hand pose.

━━━ CATEGORIES ━━━
- Holding champagne flute (nails prominent)
- Adjusting earring (hand at ear)
- Fanning playing-cards
- Cradling jewel (single gem in palm)
- Holding long-stemmed rose
- Resting chin in hand
- Tracing lip with finger
- Held-out to show nails
- Gripping edge of table
- Running-fingers through hair
- Holding cigarette holder vintage
- Clasped in lap with rings visible
- Raised in "stop" gesture
- Holding pearl necklace
- Holding perfume-bottle
- Touching ornate ring on other hand
- Tearing petal from rose
- Dropping key into palm
- Holding silk scarf draped
- Pinch-and-pull gesture
- Holding phone (iPhone-era)
- Running finger along jawline
- Snapping fingers
- Holding tiny tweezers
- Finger-tip touch (point)
- Holding champagne-bottle neck
- Gripping gold chain-strap purse
- Playing-cards-splayed
- Holding makeup-compact open
- Holding-fan (traditional fan)
- Holding lipstick-tube applying
- Pouring-tea elegantly
- Holding umbrella at angle
- Caressing piano-keys
- Holding paintbrush
- Holding dagger-ornate
- Holding ornate mirror
- Holding feathered-quill
- Holding a single long-stem lily
- Pinching chocolate-truffle
- Gesturing open-palm upward
- Holding tarot-card
- Gripping gold-leash of invisible companion
- Knuckle-at-lip (thoughtful)
- Cradling jeweled-goblet

━━━ RULES ━━━
- Editorial / magazine-pose quality
- Shows hand + nails + jewelry prominently
- Narrative-implied

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
