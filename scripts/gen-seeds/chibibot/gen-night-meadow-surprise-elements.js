#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/night_meadow_surprise_elements.json',
  total: 150,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot night-meadow scenes — tiny secondary subjects or ambient nighttime details the eye finds AFTER the cuddling pair. The pair is the main subject; the surprise element is the second-tier detail that proves there's a bigger magical-nighttime world.

Each entry: 12-25 words. ONE specific surprise element with concrete visual detail.

━━━ WHAT MAKES A GREAT ENTRY ━━━

- Reads as a secondary detail (peeking from behind a tree, sleeping in a flower, drifting past, distant background)
- Specific, picture-able, distinct from any creature / prop / setting entry
- Adds story or scale (proves the bigger nighttime world exists)
- Adorable / wholesome / curious — NEVER threatening

━━━ CATEGORY DISTRIBUTION ━━━

- 25% tiny background creature (sleeping ladybug curled inside a bluebell / lone moth resting on a stem / shy hedgehog peeking from beneath a fern / single firefly resting on a mushroom cap / family of snails leaving silver trails / barn owl silhouette on a far branch)
- 20% firefly / glow-bug drift (chain of fireflies drifting in a slow arc / lone firefly settling on a flower / cluster of glow-worms in the moss / firefly hovering above a paw / single glow-bug forming a heart-glow)
- 15% nature-detail (curled fern unfurling slowly / dew-droplet on a single petal / spider's web caught in moonlight / fallen acorn / moonflower bloom opening / clover three-leaf or four-leaf)
- 15% magical-ambient (will-o-wisp peeking around a tree / floating wishing-petal / sparkle-trail in the air / dandelion-seed-cluster mid-flight / single floating bubble caught in starlight / tiny magic-spell-glow hovering)
- 10% sky / distant-light (distant village with one warm-lit window / single far-off lantern bobbing / lighthouse beam crossing far horizon / shooting-star streak / paper-lantern festival in the distance / fireflies-clustered-tree in middle distance)
- 10% atmospheric (single column of mist rising / drifting milkweed-floss seed / fallen petal slowly drifting / wisp of smoke from a far cottage / dew sliding down a leaf)
- 5% magical-artifact (tiny acorn with a face / floating glowing pebble / wishing-coin glinting in moss / abandoned origami crane / single floating star-shaped paper)

━━━ HARD BANS ━━━

- NO hero creatures
- NO activity verbs that imply main subject
- NO setting language (no "in the meadow" / "at the cliff")
- NO time-of-night / weather
- NO scary / sad / lost-creature undertones
- NO daytime imagery

━━━ DEDUP ━━━

Dedup by: element type + concrete detail. "firefly drifting near pair" and "single firefly hovering near a paw" are duplicates.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
