#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cuddly_aquatic_surprise_elements.json',
  total: 150,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot cuddly-aquatic scenes — tiny secondary subjects or ambient details the eye finds AFTER the cuddling pair. The pair is the main subject; the surprise element is the second-tier detail that proves there's a bigger aquatic world.

Each entry: 12-25 words. ONE specific surprise element with concrete visual detail.

━━━ WHAT MAKES A GREAT ENTRY ━━━

- Reads as a secondary detail (hiding in a coral crevice, peeking through kelp, drifting past, tucked into a shell)
- Specific, picture-able, distinct from any creature/setting pool entry
- Adds story or scale (proves the bigger aquatic world exists)
- Adorable / wholesome / curious — NEVER threatening

━━━ CATEGORY DISTRIBUTION ━━━

- 25% tiny background creature (single baby clownfish peeking from anemone / shy hermit crab in a tiny shell-home / lone seahorse curling its tail around a sea-fan / lazy starfish on a rock / tiny crab waving claws from a hole / family of sea snails in matching striped shells)
- 20% bubble / particle drift (rainbow-iridescent bubble drifting up / chain of pearl-sized bubbles from below / shimmer of plankton sparkles drifting / sand swirl spiraling up from below / single floating pearl)
- 15% magical-ambient (bioluminescent jellyfish glowing in the distance / a single wishing-pearl hovering / lantern-fish lone light blinking from a crevice / sparkle-cluster in the kelp / will-o-wisp glow inside a clam shell)
- 15% aquatic-flora (sea-fan swaying gently in the current / cluster of pink anemones half-open / lone sea-grape on a vine / cherry-blossom petal drifting at the surface / glowing kelp-frond bending in current)
- 10% mineral / artifact (single pearl in an open clamshell / tiny treasure coin half-buried in sand / glass-bottle on its side with a message / barnacle-encrusted key on a stone / sea-glass shard catching light)
- 10% atmospheric (sun-shaft cutting through the water column / single light-ray finding a particular spot / column of bubbles rising from the floor / curtain of sun-dapples across the sand / aurora reflected on the surface above)
- 5% travel-transient (sea-turtle silhouette passing in the distance / dolphin shadow far above / pelican silhouette diving from the surface / lone seal pup gliding past / school of tiny fish making a heart-shape)

━━━ HARD BANS ━━━

- NO hero creatures
- NO interaction verbs that imply main subject
- NO setting language
- NO time/weather
- NO scary / sad / predator-prey

━━━ DEDUP ━━━

Dedup by: element type + concrete detail. "single firefly in kelp" and "lone bioluminescent jelly glowing distant" are duplicates if both are "glowing thing in distance".

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
