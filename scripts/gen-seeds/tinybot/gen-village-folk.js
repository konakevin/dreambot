#!/usr/bin/env node
// CAST axis for TinyBot's pastel-village path — one chubby critter caught mid-ACTION
// living in the village, so the frame has a story instead of an empty building.
//
// WHY THIS POOL EXISTS: pastel-village mandated "the architecture is the hero; the world
// dissolves into pink-pastel bokeh around it" and made its inhabitant OPTIONAL (55%). That is
// the measured defect class — a single object in heavy blur with nothing happening, which flags
// at 8/24 with no living subject vs 4/24 with one. tiny-vehicles fixed the same problem with
// TINY_CREW (verb-led cast, rolled 1-2, mandatory). This is that fix for the village: village
// LIFE, not a village PORTRAIT. TINY_CREATURES could not be reused — its entries are static
// poses ("perched on a rose petal", "dozing on a sunflower"), so even when it fired the frame
// still had nothing happening in it.
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_village_folk.json',
  total: 200,
  batch: 25,
  append: true, // grow-to-N. WITHOUT this, generatePool OVERWRITES the pool.
  banHumanLanguage: true,
  metaPrompt: (n) => `You are writing ${n} VILLAGE FOLK for TinyBot's pastel fairy-tale village scenes — one adorable chubby critter caught mid-ACTION living an ordinary day in a handmade-resin pastel village of turreted pink cottages, lilac mushroom-houses and warm-golden windows. They give the village a story instead of being an empty building.

Each entry: 8-16 words. OPEN WITH THE CRITTER, then an ACTIVE VERB naming what they're DOING right now (sweeping, hanging, sliding, watering, hauling, kindling, leaning out, trotting home).

━━━ THE CAST (cute + CHUBBY critters ONLY — chubby bunny is the house favourite) ━━━
- Chubby bunny (baker, shopkeeper, window-gardener, laundry-hanger, sleepy neighbour) — use most often
- Round hedgehog (post-carrier, lamplighter, stoop-sweeper)
- Plump mouse (greengrocer, window-leaner, basket-hauler)
- Fat dormouse / chipmunk (jam-maker, market-stall keeper)
- Ladybug or bumblebee (flower-tender, doorstep visitor, tiny courier)
- Tiny bird (chimney-perched singer, washing-line visitor)
- Fairy / gnome / pixie (lamplighter, cottage-keeper, bell-ringer)

━━━ WHAT EACH MUST DO ━━━
- A specific VILLAGE-LIFE action, mid-motion, that only makes sense in a little town: tending a window-box, sweeping blossom off a stoop, pegging laundry, sliding a tray out a bakery window, watering a doorstep pot, carrying a parcel up a spiral stair, kindling the street-lantern, leaning out an upper window to chat.
- A named piece of VILLAGE FABRIC they're touching — the specific door, stoop, window-box, laundry-line, garden gate, lantern, bakery window, letter-slot, balcony rail, stair. This is what ties them into the architecture instead of floating in front of it.
- A charm detail (a flour-dusted apron, an acorn-cap bucket, a petal-broom, a thimble watering-can, a rolled-leaf letter).
- Stay readable at small scale — they're a supporting character, not the hero (the ARCHITECTURE is the hero).
- The palette is pink / lavender / lilac / magenta / pearl-white with warm-golden window-glow. Anything they wear or carry sits in that palette. NO brown, NO red, NO tan/beige, NO blue.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "a chubby bunny baker sliding a tray of pink acorn-buns out through the lit bakery window"
- "a round hedgehog postman pushing a rolled-leaf letter through a lilac cottage's letter-slot"
- "a plump mouse greengrocer stacking dewy raspberries on a petal-awning market stall"
- "a chubby bunny in a flour-dusted apron sweeping fallen blossom off her pink front stoop"
- "a fairy lamplighter hovering at the street-lantern, kindling it as dusk turns rosy"
- "two chubby bunnies pegging tiny lavender laundry along a line strung between two balconies"
- "a fat dormouse leaning out an upper window to water a magenta window-box"

━━━ ABSOLUTELY BANNED ━━━
- NO humans / people. NO creepy bugs (NO beetle, cricket, spider, ant, centipede, grasshopper, mantis, moth, wasp).
- NEVER write the words "spider", "spider-silk", or "gossamer".
- NO realistic woodland animals (no lean foxes, deer, realistic rabbits) — everything is chubby, round, storybook-soft.
- NO weapons, NO grim / scary. Everything stays cute + cosy + charming.
- NO purely static poses ("perched", "sitting", "resting", "posed") — every entry is someone DOING something.

━━━ DEDUP DIMENSIONS ━━━
Vary the CRITTER + the JOB + the ACTION + the piece of village fabric they touch. Don't repeat the same critter doing the same thing at the same kind of door.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
