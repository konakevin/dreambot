#!/usr/bin/env node
/**
 * One-time append: balance aquatic_village_scenes.json with ADULT-creature
 * scenes. Existing 200 entries are 98% baby-creature scenes; target = 392
 * total (~50/50 after append).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_village_scenes.json',
  total: 392,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} AQUATIC-VILLAGE SCENE descriptions for CuddleBot's aquatic-village path. The existing pool features baby creatures in nearly every scene — your job is to add ADULT-creature scenes (and some empty-architecture scenes) to balance.

Cozy underwater / surface-water / tide-pool / lily-pond / coastal-harbor VILLAGES + COTTAGES + COMMUNITIES. Pixar / Sanrio / Studio Ghibli / Finding-Nemo STYLIZED — never photoreal, never documentary.

Each entry: 18-28 words. ONE specific aquatic-village scene with COZY ARCHITECTURE detail.

━━━ ABSOLUTE AGE RULE — NON-NEGOTIABLE ━━━
BANNED creature-words: baby, cub, kit, pup, chick, kitten, puppy, duckling, fawn, joey, calf, piglet, fledgling, nestling, hatchling, juvenile, infant, newborn, tiny, fry.
EVERY creature must be ADULT — mature, weathered, full-grown, elder, patriarch, matriarch.

━━━ CRITTER MIX RULE ━━━
- ~75% of entries: scene includes ONE adult creature doing village life (peripheral)
- ~25% of entries: PURE architecture, no creature

━━━ VILLAGE TYPES (mix broadly) ━━━
- Anemone-cottage harbor — anemone-fronds as cottages, shell doorways, sea-glass-pebble harbor, conch-tower
- Coral-cottage town — pastel-coral towers as cottages, sea-fan balconies, pearl-bead window-boxes
- Hermit-crab shell-house cluster — spiral-shell-houses scattered along sand path, driftwood doors
- Seashell-row street — cottages built from giant scallop / nautilus / cowrie shells, lantern-jellyfish overhead
- Lily-pad-village (surface) — giant lily-pads as floating cottages, twig-bridges, lotus-blossom-lanterns
- Kelp-forest treehouse-village — woven-kelp huts in kelp-canopy, vine-stair connectors, glow-fish lanterns
- Tide-pool tea-village — tide-pool cottages rimmed by smooth pebbles, dewdrop-arches, conch-bell-tower
- Mangrove-root harbor — cottages on mangrove roots above shallow water, rope-bridge connectors
- Reef harbor at sunset — pastel-coral harbor, fish-shaped boats moored, dock-net-floats stacked
- Sunlit shallows hamlet — cottages in clear shallow water on white sand, sun-beam-pillars from above
- Bioluminescent night village — village lit only by glow-fish + jellyfish + bioluminescent-coral
- Moonlit lake hamlet (freshwater) — cottages along calm freshwater lake, lily-blossom-lanterns
- Underwater grotto town — village inside glowing-coral grotto, crystal stalactites, soft caustic-light
- Pearl-glow harbor — village lit by giant glowing pearls strung between rooflines
- River-stream village — cottages on stilts along gentle freshwater stream, water-wheel of woven reeds
- Submarine-bell village — village of round bell-shaped diving-bell cottages, brass details, kelp-rigging

━━━ ADULT AQUATIC CREATURES (when present) ━━━
mature sea otter floating with crossed paws, harbor seal elder, walrus patriarch, octopus matriarch in cave, sea-turtle elder paddling, dolphin elder mid-leap, manatee grazing, leafy sea-dragon ancient, weathered crab matriarch, hermit-crab patriarch in nautilus shell, lobster patriarch, seahorse with curled tail, mature mahi-mahi, koi grandmother, frog elder by lily-pad, mature beaver building dam, river-otter patriarch, parrotfish elder grazing coral, angelfish ancient with flowing fins, clownfish patriarch in anemone, jellyfish matriarch with long flowing tendrils, weathered horseshoe-crab patriarch, mermaid elder with silver scales, water-nymph ancient, river-spirit grandmother, frog-king with gold crown, turtle-sage with mossy shell

━━━ COZY OVERLAY (every entry) ━━━
- Architecture rendered with obsessive cozy detail: shell-doorways, kelp-window-boxes, sea-glass mosaics, conch-shell chimneys (with bubble-smoke if underwater), driftwood signs, anemone awnings, pearl-bead-window-glow
- Pearl-pink + mint-sea + lemon-fish-scale + lavender-bubble + warm window-amber palette
- Soft caustic-light dapples, sun-beam-pillars, drifting bubbles, kelp-string-lights, lantern-jellyfish glow
- Village feels LIVED IN — kelp-laundry on lines, shell-baskets at doors, dock-net-floats stacked, coral-mailboxes, fish-shaped boats moored
- Adult creature (when present) doing village life — paddling home with goods, mending a sail, tending a kelp-garden, drying coral-baskets, returning from a fish-market

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary deep-sea / NO predator-with-fangs
- NO trash / oil-spill / pollution / murky water (always JEWEL-CLEAR)
- NO modern human infrastructure
- NO identifiable humans
- NO baby creatures
- NO chibi tropes (oversized dewy eyes, blushing, stubby paws)

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
Deduplicate by: village-type + key-architectural-feature + creature-species (or empty) + time-of-day. Vary VILLAGE-TYPE + ADULT-SPECIES + UNIQUE-DETAIL. Scan "ALREADY GENERATED" — those are baby versions; yours use DIFFERENT adult species and DIFFERENT activities.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Mature sea otter floating belly-up at sunset in an anemone-cottage harbor, anemone-frond cottages with pearl-window-glow, conch-tower at entrance"
- "Empty hermit-crab shell-village at dawn, spiral-shell-houses along a sand path, driftwood doors, kelp-string-lights still lit, mist drifting"
- "Octopus matriarch tending a kelp-garden in a kelp-forest treehouse-village, woven-kelp huts in canopy, vine-stair connectors above"
- "Lobster patriarch returning to a coral-cottage town at golden-hour, coral towers with pearl-window-glow, sea-fan balconies overhead"
- "Bioluminescent night village empty, cottages lit only by glow-jellyfish and glow-coral, soft pink+aqua glow on coral lanes, peaceful"
- "Sea-turtle elder paddling past a sunlit shallows hamlet at noon, cottages in clear shallow water, sun-beam-pillars from above, sand-paths"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
