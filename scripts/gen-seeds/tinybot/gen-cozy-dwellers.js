#!/usr/bin/env node
// CAST axis for TinyBot's tiny-cozy path — one critter at home, living in the room.
//
// WHY THIS POOL EXISTS: the path's composition asks for "Lived-in quality. Viewer wants to shrink
// down and live there" and then nobody lives there. A beautifully dressed empty room is the
// measured defect class (a hero object in shallow DOF with nothing happening). Same fix as
// tiny-vehicles/TINY_CREW. Bespoke to this path per the no-shared-pools rule: these are HOME
// moments, quieter and slower than the village folk's chores or the workshop crew's jobs.
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_cozy_dwellers.json',
  total: 200,
  batch: 25,
  append: true, // grow-to-N. WITHOUT this, generatePool OVERWRITES the pool.
  banHumanLanguage: true,
  metaPrompt: (n) => `You are writing ${n} COZY DWELLERS for TinyBot's tiny-cozy scenes — one adorable critter at home in a warm dollhouse-scale interior, caught in the middle of a slow, comfortable domestic moment. They are what makes the room LIVED-IN instead of a beautifully dressed empty set.

Each entry: 8-16 words. OPEN WITH THE CRITTER, then a VERB naming the small comfortable thing they're doing right now (curling up, turning a page, stirring, dozing off, toasting, knitting, peering, stretching).

━━━ THE DWELLERS (cute critters ONLY) ━━━
- Chubby bunny (reader, nap-taker, tea-drinker)
- Round hedgehog (knitter, fireside dozer)
- Plump mouse (cocoa-stirrer, pantry-raider, letter-writer)
- Dormouse (champion napper, blanket-burrower)
- Tiny cat or kitten (windowsill watcher, lap-warmer, yarn-tangler)
- Ladybug or bumblebee (lampshade visitor, teacup-rim perch)
- Tiny bird (windowsill guest, kettle-watcher)
- Gnome / pixie (bookshelf dweller, candle-tender)

━━━ WHAT EACH MUST DO ━━━
- A specific COMFORT action, mid-moment, with the actual piece of FURNITURE or HOMEWARE named: the armchair, the window seat, the hearth, the quilt, the kettle, the teacup, the bookshelf, the rug, the stair, the lamp, the pantry shelf, the bread board.
- A cosy detail that sells the warmth — a book fallen open on the chest, steam off a thimble mug, one ear flopped over, a half-eaten biscuit, knitting slipped to the floor, sock-feet toward the fire.
- Stay readable at small scale — they're a supporting character, not the hero (the ROOM is the hero).
- SLOW energy. This path is not busy: it is comfortable. Nobody is working hard or rushing.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "a chubby bunny curled into the armchair turning a page with one paw, quilt slipping"
- "a dormouse fast asleep in the bread basket, one ear flopped over his eyes"
- "a plump mouse stirring cocoa in a thimble mug, steam curling past his whiskers"
- "a round hedgehog knitting by the hearth, the ball of yarn escaping down the rug"
- "a tiny kitten stretched flat along the sunlit window seat, tail hanging off the edge"
- "a gnome tending a candle-stub on the bookshelf, wax pooling on a saucer"
- "a bunny on tiptoe at the pantry shelf, reaching for a jam jar just out of reach"

━━━ ABSOLUTELY BANNED ━━━
- NO humans / people. NO creepy bugs (NO beetle, cricket, spider, ant, centipede, grasshopper, mantis, moth, wasp).
- NEVER write the words "spider", "spider-silk", or "gossamer".
- NO weapons, NO grim / scary / sad / lonely. Everything stays cute + warm + comfortable.
- NO blank static poses ("perched", "posed", "sitting still", "looking at the camera") — a nap counts as a moment, but it must be a SPECIFIC nap in a SPECIFIC spot.

━━━ DEDUP DIMENSIONS ━━━
Vary the CRITTER + the COMFORT + the piece of furniture or homeware. Don't repeat the same critter in the same chair.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
