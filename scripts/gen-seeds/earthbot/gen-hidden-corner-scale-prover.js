#!/usr/bin/env node
/**
 * EarthBot hidden-corner — SCALE PROVER axis.
 *
 * Tiny wildlife / micro elements that prove the human scale of the
 * intimate pocket. Frog on rock, dragonfly, butterfly, single mushroom,
 * salamander, ladybug, hummingbird, sparrow.
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/hidden_corner_scale_prover.json';
// Append mode — scale R0 50-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SCALE PROVER entries for EarthBot hidden-corner. Each entry names ONE tiny wildlife or micro element — postage-stamp scale in the frame — that proves the intimate pocket is alive. Real Earth ONLY.

━━━ THE BAR — ONE TINY LIVING ELEMENT ━━━

Small specific wildlife or natural micro-element rendered at postage-stamp scale in the frame. A frog on a moss-stone, dragonfly hovering, butterfly on a flower, single salamander on a wet leaf, ladybug on a fern, hummingbird at a bloom, sparrow on a branch, dewdrop catching light.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "description": "<tiny scale-prover, 14-22 words>" }

Bare strings acceptable.

━━━ SCALE PROVER TYPES (vary across these) ━━━

- AMPHIBIANS — small frog, tree frog, salamander, newt on wet stone or moss
- INSECTS — dragonfly, damselfly, butterfly, ladybug, beetle, bee on a flower
- BIRDS — small species — hummingbird at bloom, wren, sparrow, robin, warbler on a low branch
- TINY MAMMALS — chipmunk, squirrel, vole, field mouse (rare — careful)
- MOLLUSKS / SEA LIFE — anemone, sea star, hermit crab (tide-pool subjects)
- BUTTERFLIES — monarch, swallowtail, painted lady, blue morpho (rainforest only)
- AMPHIBIAN EGGS / SPAWN — small clustered detail on a leaf or water surface
- SINGLE BLOOM — one striking wildflower as the "alive" anchor
- WATER STRIDER — small skater on the still water surface

━━━ EXAMPLES ━━━

✓ { "description": "A tiny tree frog perched motionless on a moss-cushioned stone at the foreground edge, eyes catching the dappled light from above" }

✓ { "description": "A blue-banded damselfly hovering still over the foreground pool with iridescent wings catching the filtered light from the canopy gap" }

✓ { "description": "A small spotted salamander resting on a wet rust-colored leaf at the foreground stone, its damp skin glistening in the soft light" }

✓ { "description": "A ruby-throated hummingbird hovering at the lone wildflower bloom in the midground, wings caught in motion-blur against the soft background" }

✓ { "description": "An ochre sea star clinging to the wet wall of the tide pool at the foreground edge, with two anemones flanking it" }

━━━ ABSOLUTELY BANNED ━━━

- Hero-size subjects (must be tiny postage-stamp scale)
- Made-up species (must be real Earth animals)
- Bioluminescent / glowing creatures
- Humans / human elements
- Sci-fi / fantasy
- Multiple scale-provers per entry (ONE per entry)
- Bears / wolves / big predators (too large for intimate scale)
- "Fire" as a noun

━━━ OUTPUT ━━━

JSON array of ${n} entries. ONE tiny living element per entry. Real Earth species. Postage-stamp scale. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
