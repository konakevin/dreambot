#!/usr/bin/env node
// CAST axis for TinyBot's tiny-vehicles path — one cute critter caught
// mid-ACTION doing a job, so the journey has characters the eye can follow. The
// path rolls 1-2 of these. Verb-led + plural-friendly (see the multi-figure
// story-render recipe: open with an active verb, name what they're DOING).
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_crew.json',
  total: 200,
  batch: 50,
  banHumanLanguage: true,
  metaPrompt: (n) => `You are writing ${n} TINY CREW members for TinyBot's tiny-vehicle scenes — one adorable critter caught mid-ACTION crewing, riding, or greeting a tiny natural-material vehicle. They give the journey characters to follow.

Each entry: 8-16 words. OPEN WITH THE CRITTER, then an ACTIVE VERB naming what they're DOING right now (steering, hauling, waving, cheering, dozing, lighting a lantern, checking a tiny map).

━━━ THE CAST (cute critters ONLY) ━━━
- Mouse (captain, deckhand, lookout, ferry-passenger)
- Snail (slow dockmaster, harbor-pilot, cargo-hauler)
- Ladybug (deckhand, signal-flag waver, passenger)
- Bumblebee (courier, harbor-buzzer)
- Dragonfly (escort, scout, mooring-guide)
- Frog (jolly passenger, ferryman, dock-lounger)
- Hedgehog (cargo-roller, sleepy passenger)
- Tiny bird (lookout in the rigging, escort overhead)
- Fairy / gnome / pixie (navigator, lamplighter, tiny harbor-keeper)

━━━ WHAT EACH MUST DO ━━━
- A specific ACTION, mid-motion: "leaning into the tiller", "hauling a berry up the gangplank", "waving a leaf-flag from the dock", "dozing on a moss-cushion deck".
- A charm detail (a thimble-helm, a bottle-cap hat, a tiny rope, a sleepy yawn).
- Stay readable at small scale — they're a supporting character, not the hero (the VEHICLE is the hero).

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "a mouse captain in a thimble-helm leaning hard into the tiller, whiskers streaming"
- "a snail dockmaster slowly raising a leaf-flag to wave the little craft in"
- "two ladybug deckhands rolling a dewy raspberry up the gangplank together"
- "a frog passenger lounging on the moss-cushion deck, trailing one toe in the water"
- "a fairy lamplighter perched on the bow, kindling a firefly-lantern at dusk"
- "a tiny wren lookout clinging to the rigging, scanning the far shore"

━━━ ABSOLUTELY BANNED ━━━
- NO humans / people. NO creepy bugs (NO beetle, cricket, spider, ant, centipede, grasshopper, mantis, moth, wasp).
- NEVER write the words "spider", "spider-silk", or "gossamer".
- NO weapons, NO grim / scary. Everything stays cute + jolly + charming.

━━━ DEDUP DIMENSIONS ━━━
Vary the CRITTER + the JOB + the ACTION. Don't repeat the same critter-doing-the-same-thing.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
