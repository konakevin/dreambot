#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/dino_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DINO ACTION descriptions for DinoBot's dino-action path — dynamic frozen action moments. Species-agnostic.

Each entry: 10-20 words. One specific action beat.

━━━ CATEGORIES ━━━
- Mid-roar with breath-steam
- Mid-chase pursuit
- Mid-hunt stalking
- Mid-dive from cliff
- Splashing through water
- Tail-swing defensive
- Eye-to-camera intense stare
- Emerging from water predator
- Clashing horns confrontation
- Breathing mist in cold air
- Running full-speed flock
- Leaping mid-jump
- Mid-bite strike
- Head-tossing display
- Wing-spread large pterosaur
- Mid-flight over landscape
- Fighting stance pre-strike
- Stomping ground with dust
- Drinking mid-motion
- Mother defending young
- Pack-surround tactic (prey implied off-frame)
- Bellowing herd call
- Digging nest
- Frill-flare defensive
- Club-tail swing armored
- Neck-swing sauropod
- Raptor-leap peak
- Diving pterosaur at sea
- Scratching territory mark
- Climbing slope uphill
- Mid-sneeze moment
- Mid-shake water off
- Stretching awake
- Rolling in dust-bath
- Displaying-plumage courtship
- Crest-inflation
- Wing-flap pterosaur
- Hunting-ambush emerging from vegetation
- Mid-leap between trees
- Charging-forward
- Calling for young
- Sun-basking pose
- Playing-juvenile tumble

━━━ RULES ━━━
- Frozen peak action
- No gore / dismemberment
- Dynamic composition

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
