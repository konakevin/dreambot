#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_village_scenes.json',
  total: 200,
  append: true,
  batch: 25,
  maxTokens: 4000,
  metaPrompt: (n) => `You are writing ${n} AQUATIC-VILLAGE SCENE descriptions for CuddleBot's aquatic-village path. Cozy underwater / surface-water / tide-pool / lily-pond / coastal-harbor VILLAGES + COTTAGES + COMMUNITIES that the viewer wants to move into. The ARCHITECTURE and ATMOSPHERE are the hero — not the creatures. Pixar / Sanrio / Studio Ghibli / Finding-Nemo aesthetic. NEVER photoreal, NEVER documentary nature.

Each entry: 18-28 words. ONE specific aquatic-village scene with COZY ARCHITECTURE detail.

━━━ CRITTER RULE — NON-NEGOTIABLE ━━━
EVERY entry MUST include at least one cute baby aquatic creature in the scene — sea otter pup paddling home, hermit crab sweeping a doorstep, baby seal peeking from a porch, jellyfish drifting past a window, dumbo octopus hanging laundry. The CRITTER + the COZY VILLAGE together = the cute. Architecture alone is not cute — the critter adds the soul. Critter is peripheral (small in frame, not center) but ALWAYS PRESENT.

━━━ VILLAGE TYPES (mix broadly across all entries) ━━━
- Anemone-cottage harbor — anemone-fronds as cottages with shell doorways, sea-glass-pebble harbor, conch-tower at the entrance
- Coral-cottage town — pastel-coral towers as multi-story cottages, sea-fan balconies, pearl-bead window-boxes
- Hermit-crab shell-house cluster — spiral-shell-houses scattered along a sand path, tiny driftwood doors, kelp-string-light strands between
- Seashell-row street — row of cottages built from giant scallop / nautilus / cowrie shells, lantern-jellyfish overhead
- Lily-pad-village (surface) — giant lily-pads as floating cottages with twig-bridges between, lotus-blossom-lanterns
- Kelp-forest treehouse-village — woven-kelp huts in a kelp-canopy, vine-stair connectors, glow-fish lanterns
- Tide-pool tea-village — tiny tide-pool cottages rimmed by smooth pebbles, dewdrop-arches, conch-bell-tower
- Mangrove-root harbor — cottages built on mangrove roots above shallow water, rope-bridge connectors, dock-pilings
- Reef harbor at sunset — pastel-coral harbor with little fish-shaped boats moored, dock-net-floats stacked, gull-shaped clouds
- Sunlit shallows hamlet — cottages in clear shallow water on white sand, sun-beam-pillars from above, sea-glass mosaics on walls
- Bioluminescent night village — village lit only by glow-fish + glow-jellyfish + bioluminescent-coral, soft pink+aqua glow
- Moonlit lake hamlet (freshwater) — cottages along a calm freshwater lake reflecting moon + stars, lily-blossom-lanterns
- Underwater grotto town — village inside a glowing-coral grotto, crystal stalactites overhead, soft caustic-light from a surface-vent
- Pearl-glow harbor — village lit by giant glowing pearls strung between rooflines, soft pearl-pink + cream + mint palette
- River-stream village — cottages on stilts along a gentle freshwater stream, water-wheel of woven reeds turning, ducklings-on-water
- Island-cottage cluster — small cluster of cottages on a tiny coral-island, sand paths, palm-frond-arches
- Submarine-bell village — village of round bell-shaped diving-bell cottages, brass details, kelp-rigging connecting

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Architecture rendered with obsessive cozy detail: shell-doorways, kelp-window-boxes, sea-glass mosaics, conch-shell chimneys (with bubble-smoke if underwater), driftwood signs, anemone awnings, pearl-bead-window-glow
- Pearl-pink + mint-sea + lemon-fish-scale + lavender-bubble + warm window-amber palette
- Soft caustic-light dapples, sun-beam-pillars, drifting bubbles, kelp-string-lights, lantern-jellyfish glow
- The village feels LIVED IN — kelp-laundry on lines, tiny shell-baskets at doors, dock-net-floats stacked, coral-mailboxes, fish-shaped boats moored at dock
- Optional small peripheral creature (sea otter, crab, seahorse, baby fish, jellyfish) doing something cute in the village

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary deep-sea / NO dark abyss / NO predator-with-teeth
- NO trash / pollution / oil-spill (this is a magical happy-place)
- NO realistic murky water — water always reads CLEAN + JEWEL-CLEAR
- NO identifiable humans / NO human-built modern infrastructure (no docks-with-cars, no factory-buildings)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: village-type + key-architectural-feature + time-of-day + creature-vs-empty. Vary VILLAGE-TYPE + LIGHT-CONDITION + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Anemone-cottage harbor at golden-hour, anemone-frond cottages with pearl-glowing windows, sea-glass-pebble lanes, conch-tower at the entrance, sunlit caustic dapples"
- "Empty hermit-crab shell-village at dawn, spiral-shell-houses scattered along a sand path, tiny driftwood doors, kelp-string-lights still lit, mist drifting"
- "Sea otter pup paddling home down a moonlit lily-pad village street, giant lily-pads as cottages with lotus-lanterns, twig-bridges between, water reflects moon"
- "Bioluminescent night village, cottages lit only by glow-jellyfish and glow-coral, soft pink+aqua glow on coral lanes, peaceful, no creatures, just the glow"
- "Tiny crab sweeping a doorstep at sunset, anemone-cottage on a tide-pool plaza, conch-bell-tower behind, dewdrop-arches catching the warm light"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
