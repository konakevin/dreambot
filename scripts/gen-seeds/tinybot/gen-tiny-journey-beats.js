#!/usr/bin/env node
// STORY-BEAT axis for TinyBot's tiny-vehicles path — the narrative MOMENT the
// little craft is caught in, so a render reads as a journey, not a parked
// product shot. Vehicle/element-agnostic: the path supplies the specific
// vehicle (boat / balloon / cart / glider / submarine) and tells Sonnet to
// adapt the beat to its element.
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_journey_beats.json',
  total: 200,
  batch: 50,
  banHumanLanguage: true,
  metaPrompt: (n) => `You are writing ${n} STORY-MOMENT beats for TinyBot's tiny-vehicle scenes — the candid narrative moment a tiny natural-material vehicle is caught in. Each beat turns "a little vehicle" into "a tiny journey with something happening."

Each entry: 12-22 words. OPEN WITH AN ACTIVE VERB (a gerund: "casting off…", "cresting…", "pulling up to…", "racing…"). Something is HAPPENING that the eye reads in 2 seconds.

━━━ WHAT EACH BEAT MUST DO ━━━
- Name a STORY SITUATION (a departure, arrival, cargo run, encounter, rest-stop, race, homecoming, discovery, delivery, rescue, parade, getting caught in gentle weather).
- Be VEHICLE- and ELEMENT-AGNOSTIC: it must work whether the craft is a boat, a balloon, a cart, a glider, or a submarine. Refer to it generically ("the little craft", "the tiny vehicle") or just describe the world + event around it. The path supplies the actual vehicle.
- Stay CUTE + tongue-in-cheek + charming. Tiny stakes at most (a looming raindrop, a friendly race, a wobble) — never real peril, never scary.
- Often include a CUTE companion reacting (a snail waving goodbye, mice cheering, a ladybug deckhand, a frog passenger) — but keep it brief; the beat is the MOMENT, not a full cast list.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "casting off from a mossy twig-dock at golden hour as a snail-friend waves a tiny farewell flag"
- "pulling up to a bustling acorn-cap harbor, other little craft bobbing alongside as dockhands catch the line"
- "being loaded with a heap of dewy blackberries by a cheerful mouse crew before the long trip home"
- "racing a rival down a winding course, neck-and-neck, a checkered-leaf finish flag fluttering ahead"
- "drifting home at dusk past a row of lantern-lit cottages, a sleepy ladybug curled by the lamp"
- "caught in a sudden flurry of cherry petals, rigging straining, a passenger clutching their tiny hat"
- "arriving at a firefly-lit floating market where vendors call out over baskets of seeds and berries"
- "pausing mid-journey at a dewdrop spring while the crew refills tiny acorn-cap canteens"

━━━ ABSOLUTELY BANNED ━━━
- NO humans / people of any kind. NO modern machinery, motors, or engines.
- NO creepy bugs as crew or company (NO beetle, cricket, spider, ant, centipede, grasshopper, mantis, moth, wasp). Cute critters only: mouse, snail, ladybug, bumblebee, dragonfly, frog, fairy, gnome, hedgehog, tiny bird.
- NEVER write the words "spider", "spider-silk", or "gossamer".
- NO grim / scary / horror. Everything stays cute + cozy + charming.

━━━ DEDUP DIMENSIONS ━━━
Vary the SITUATION (departure / arrival / cargo / race / encounter / rest / homecoming / market / discovery / weather) + the DESTINATION + the companion. Don't repeat the same situation back-to-back.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
