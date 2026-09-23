#!/usr/bin/env node
// CAST axis for TinyBot's contained-worlds path — one critter USING the little world it lives in.
//
// WHY THIS POOL EXISTS: this path already rolled a creature on every render, so unlike its three
// siblings it was never empty. The problem was the pool: TINY_CREATURES is static poses ("perched
// on a rose petal", "dozing on a sunflower"), so the frame had an inhabitant and still had nothing
// happening. This pool keeps the inhabitant and gives it something to DO, specifically something
// that only makes sense INSIDE a terrarium or a jar — which is also what sells the scale-play the
// path is built on. Bespoke per the no-shared-pools rule. The path's dead "OPTIONAL" header is
// corrected at the same time: the roll was never optional.
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_terrarium_dwellers.json',
  total: 200,
  batch: 25,
  append: true, // grow-to-N. WITHOUT this, generatePool OVERWRITES the pool.
  banHumanLanguage: true,
  metaPrompt: (n) => `You are writing ${n} CONTAINED-WORLD DWELLERS for TinyBot's contained-worlds scenes — one adorable critter living inside a terrarium, bottle, teacup, lantern, jar, snow-globe or other object-container, caught mid-ACTION treating that container as its whole world. They are what turns a pretty glass object into a place somebody lives.

Each entry: 8-16 words. OPEN WITH THE CRITTER, then an ACTIVE VERB naming what they're doing right now (climbing, tending, paddling, peering, sweeping, planting, hauling, swinging, hanging washing).

━━━ THE DWELLERS (cute critters ONLY) ━━━
- Tiny frog (pond-paddler, lily-pad hopper, rain-catcher)
- Mouse (gardener, ladder-climber, jar-lid opener)
- Snail (slow surveyor, glass-wall traveller, moss-grazer)
- Ladybug or bumblebee (flower-tender, dome-top visitor)
- Hedgehog (leaf-sweeper, moss-bed maker)
- Tiny bird (branch-perched singer, twig-carrier)
- Fairy / gnome / pixie (keeper of the little world, lamplighter, glass-polisher)
- Axolotl or tadpole (if the container holds water)

━━━ WHAT EACH MUST DO ━━━
- An action that USES THE CONTAINER ITSELF, and name the part: the curve of the glass, the cork, the rim, the lid, the moss slope, the pebble shore, the condensation on the inside wall, the rope handle, the spout, the little door in the side, a stem grown up to the opening.
- Treat the container as a WORLD with geography — climbing its slope, crossing its pond, sweeping its floor, tending its garden, reaching its ceiling, watching the giant world through the glass.
- A charm detail (an acorn-cap bucket, a leaf-umbrella, a dewdrop mirror, a twig ladder, a bottle-cap boat).
- Stay readable at small scale — they're a supporting character, not the hero (the CONTAINED WORLD is the hero).
- Cute + clever energy. Never sci-fi, never dark, never horror, never a creature trapped or distressed — this is a happy home, not a specimen jar.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "a tiny frog paddling a bottle-cap boat across the terrarium's pebble-shore pool"
- "a mouse gardener on a twig ladder, pruning the fern that has grown up to the cork"
- "a snail tracking slowly up the inside of the glass, leaving a shine-trail behind him"
- "a pixie polishing a fogged patch of the dome from the inside with a leaf"
- "a hedgehog sweeping fallen moss into a neat pile with a pine-needle broom"
- "a ladybug climbing the curved wall toward the open jar-mouth and the light above"
- "a tiny frog sheltering under a leaf-umbrella as condensation rains from the lid"

━━━ ABSOLUTELY BANNED ━━━
- NO humans / people. NO creepy bugs (NO beetle, cricket, spider, ant, centipede, grasshopper, mantis, moth, wasp).
- NEVER write the words "spider", "spider-silk", or "gossamer".
- NO weapons, NO grim / scary / trapped / suffocating / dying. Everything stays cute + clever + charming.
- NO purely static poses ("perched", "sitting", "resting", "posed") — every entry is someone DOING something with their world.

━━━ DEDUP DIMENSIONS ━━━
Vary the CRITTER + the ACTION + the PART OF THE CONTAINER they use. Don't repeat the same critter climbing the same glass.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
