#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/dino_visual_cues.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DINO VISUAL CUE descriptions for DinoBot — species-specific visual details.

Each entry: 6-14 words. One specific dino visual cue.

━━━ CATEGORIES ━━━
- Breath-steam from open jaws
- Dust-from-footfall rising
- Feather-fluff backlit soft
- Scale-highlight catching light
- Wet-shine after swimming
- Mud-on-legs from swamp
- Drool-strand from mouth
- Eye-reflection glow
- Teeth-detail razor-sharp
- Claw-dust-spray lifted
- Frill-blood-vessel detail
- Horn-chip worn battle-scarred
- Tail-mud flick
- Crest-iridescence display
- Wing-membrane translucency
- Feather-barb individual visible
- Scale-color-change subtle
- Plate-armor gleam
- Frill-flare display
- Head-crest-tinted
- Water-drip from beak
- Sand-kicked from run
- Shed-scale fragment nearby
- Pupil-slit predator-eye
- Nostril-flare breathing
- Tongue-flick dart
- Skin-wrinkle detail close
- Cheek-pouch full of vegetation
- Dust-on-feathers
- Muscle-flex underneath skin

━━━ RULES ━━━
- Species-specific visual detail
- Adds realism + closeness

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
