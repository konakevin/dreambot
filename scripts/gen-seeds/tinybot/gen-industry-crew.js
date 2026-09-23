#!/usr/bin/env node
// CAST axis for TinyBot's miniature-industry path — one critter craftsman working the shop.
//
// WHY THIS POOL EXISTS: the path's own DNA says "The workspace feels ACTIVE — mid-project, not
// museum-clean" and then puts NOBODY in it. An empty workshop cannot read as mid-project; it reads
// as exactly the museum shot the DNA is trying to avoid. Same fix as tiny-vehicles/TINY_CREW and
// pastel-village/TINY_VILLAGE_FOLK: a mandatory verb-led cast. Bespoke to this path per the
// no-shared-pools rule — village folk hang laundry, these ones run machines.
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_industry_crew.json',
  total: 200,
  batch: 25,
  append: true, // grow-to-N. WITHOUT this, generatePool OVERWRITES the pool.
  banHumanLanguage: true,
  metaPrompt: (n) => `You are writing ${n} WORKSHOP CREW for TinyBot's miniature-industry scenes — one adorable critter caught mid-JOB running a dollhouse-scale workshop, factory, train yard, clockwork repair bench or construction site. They are the proof that someone is mid-project instead of the shop being museum-clean.

Each entry: 8-16 words. OPEN WITH THE CRITTER, then an ACTIVE VERB naming the job they're doing right now (hammering, cranking, soldering, hauling, measuring, oiling, stoking, sanding, checking, signalling).

━━━ THE CREW (cute critters ONLY) ━━━
- Mouse (machinist, foreman, apprentice, signalman)
- Hedgehog (carpenter, sander, crate-hauler)
- Mole (digger, tunnel-foreman, coal-shoveller)
- Beaver (sawyer, timber-framer)
- Squirrel (rigger, high-shelf climber, parts-fetcher)
- Ladybug or bumblebee (inspector, tiny welder, courier of parts)
- Frog (bellows-pumper, boiler-watcher)
- Gnome / pixie (clockmaker, watch-repairer, lamplighter)
- Tiny bird (crane-spotter, blueprint-holder)

━━━ WHAT EACH MUST DO ━━━
- A specific TRADE action, mid-motion, with the actual TOOL or MACHINE named: a thimble-sized crucible, a matchstick-lumber saw, a pin-vice, a bellows, a gear-train, a rivet-press, a chalk line, a hand-crank, a coal scoop, a signal lever.
- A USE detail that shows the job is really happening — sawdust in the fur, an oil-smudged paw, a pencil behind the ear, goggles pushed up, a chalk-marked plank, a curl of solder-smoke.
- Stay readable at small scale — they're a supporting character, not the hero (the WORKSHOP and its CRAFTSMANSHIP are the hero).
- Working, not posing. Nobody stands still holding a tool for the camera.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "a mouse machinist cranking a thimble-sized lathe, brass shavings curling onto the bench"
- "a hedgehog carpenter running a tiny saw through matchstick lumber, sawdust caught in his quills"
- "a mole foreman chalking a cut-line along a plank, pencil tucked behind one ear"
- "two squirrel riggers hauling a crate up a pulley-line, one paying out the rope"
- "a gnome clockmaker bent over a gear-train with a pin-vice, loupe strapped to his head"
- "a frog boiler-watcher pumping the bellows, ember-glow lighting his face from below"
- "a ladybug inspector walking a rivet seam, ticking off a tiny clipboard"

━━━ ABSOLUTELY BANNED ━━━
- NO humans / people. NO creepy bugs (NO beetle, cricket, spider, ant, centipede, grasshopper, mantis, moth, wasp).
- NEVER write the words "spider", "spider-silk", or "gossamer".
- NO weapons, NO grim / scary / injury / danger. Everything stays cute + industrious + charming.
- NO purely static poses ("perched", "sitting", "standing", "posed", "holding") — every entry is someone DOING the job.

━━━ DEDUP DIMENSIONS ━━━
Vary the CRITTER + the TRADE + the ACTION + the TOOL or MACHINE. Don't repeat the same critter at the same kind of bench.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
