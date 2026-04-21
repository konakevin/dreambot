#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/tender_pairings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} TENDER PAIRING descriptions for AnimalBot's tender path — intimate emotional pair / parent-child moments that trigger AWW. Described as pairing type + emotional beat.

Each entry: 15-30 words. One specific tender pair-moment type.

━━━ CATEGORIES ━━━
- Mother + newborn cuddling (lion cub nursing, bear cub on mother's back, wolf pup against flank)
- Parent grooming offspring (chimpanzee mother combing fur, macaque grooming)
- Cub climbing on sleeping parent (playful intrusion)
- Pair of adults touching foreheads (gorilla couple, elephant trunks touching)
- Pair preening each other (parrots, crows, swans)
- Duckling row following mother on ground (geese, quail)
- Fox kits play-wrestling while mother watches
- Penguin parent sheltering chick between feet (emperor penguin style — land context)
- Wolf pup nose-to-nose with parent
- Elephant calf beneath mother's belly
- Juveniles play-fighting (lion cubs, bear cubs, deer fawns)
- Otter family bundled (but river otters only — no sea otters)
- Monkey juvenile clinging to mother's back
- Bird parent feeding chick at nest
- Rabbit kits in burrow huddle
- Sleeping pair spooning (big cats, wolves)
- Grooming session between bonded pair
- Foal standing under mother in meadow
- Tiger cubs tumbling around lying mother
- Red panda mother + cub on branch

━━━ RULES ━━━
- Pair or parent-child types only (solo exception to normal rule)
- Land animals only — no marine
- Emotional / tender / "awww" targeted
- Include the specific interaction beat + emotional cue

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
