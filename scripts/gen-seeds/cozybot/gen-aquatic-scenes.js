#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cozybot/seeds/aquatic_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CUDDLY AQUATIC SCENE descriptions for CuddleBot's cuddly-aquatic path. Adorable underwater / surface-water / tide-pool / coral-reef / kelp-forest / lily-pond / freshwater settings where cute baby aquatic creatures live. SUPER OVERLAY CUTE — Pixar / Sanrio / Studio Ghibli / Finding-Nemo aesthetic. NEVER photoreal, NEVER documentary nature.

Each entry: 15-25 words. ONE specific cuddly-aquatic scene with HABITAT details + cute interaction hint.

━━━ HABITAT TYPES (mix broadly across all entries) ━━━
- Coral-reef cute-village (pastel-coral-towers, anemone-cottages, shell-doorways, sea-glass-pebble paths)
- Kelp-forest dreamscape (towering kelp-fronds, dappled-sun-beams, glittering bubbles)
- Tide-pool village (tiny pools rimmed with cute shells, dewdrop-arches, hermit-crab homes)
- Lily-pond surface (giant lily-pad rafts, lotus-blossom umbrellas, dragonfly-arches)
- Freshwater stream (smooth pebbles, water-flowers, tiny waterfall, mossy banks)
- Underwater grotto (glowing coral-walls, crystal stalactites, soft caustic light)
- Arctic ice-water cove (pearl-white ice-edge, calm baby-blue water, snow-flakes drifting in)
- Ice-floe nursery (cute baby-creatures on a floating ice-floe with tiny snow-pile pillows)
- Tropical lagoon (turquoise water, coral-pink-sand, palm-frond-arches)
- Mangrove-roots playground (root-ladders, dappled-sun, hidden tide-pools)
- Sea-grass meadow underwater (waving sea-grass like wheat, sun-beams down)
- Bubble-cave (curtain-of-bubbles, glow-fish-lanterns, soft dreamy interior)
- Lotus-blossom flotilla (open lotus blossoms as baby-boats, dragonflies above)
- Mountain-lake at dawn (mist on water, baby-creatures peeking from a fern-cove)
- Sunlit shallows (warm shallow water, sandy floor with cowrie shells, sun-beam pillars)
- Glowing bioluminescent reef at night (soft blue+pink glow on sea-fans, tiny glow-fish stars)
- Sea-otter raft on kelp (otters wrapped in kelp ribbons, holding paws across)
- Aquatic tea room (anemone-fronds as curtains, pearl-cups, kelp-string-lights)

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Soft caustic-light dapples on the water-floor / soft sun-beams overhead
- Pastel-pearl + coral-pink + mint-sea + lemon-fish-scale palette dominant
- Bubbles as drifting sparkle, kelp as ribbon, anemone as flower
- Optional cute habitat-details (string-lights of bubbles, garlands of kelp, lily-pad rafts, sea-glass-pebble paths)
- The scene ANTICIPATES creatures — leave room for the rendered creature pair to do something cute (cuddle, share, peek, splash)

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary deep-sea / NO dark abyss / NO predator-with-teeth
- NO trash / pollution / oil-spill (this is a magical happy-place)
- NO realistic murky water — water always reads CLEAN + JEWEL-CLEAR
- NO identifiable humans

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: habitat-type + key-feature + time-of-day. "Coral reef village" and "anemone village on coral" are TOO SIMILAR. Vary HABITAT + LIGHT-CONDITION + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Pastel-coral village at sun-dapple noon, anemone-cottages with shell-doors, sea-glass-pebble lanes, drifting sparkle bubbles, dreamy mint+pink palette"
- "Lily-pond surface at golden hour, giant lily-pad rafts with lotus-umbrellas, tiny dragonflies hovering, gilded reflections, frog-friendly perches"
- "Bioluminescent reef at twilight, soft pink+aqua glow on sea-fan curtains, tiny glow-fish like stars, dreamy galaxy-underwater feel"
- "Ice-floe nursery at dawn, pearl-white ice-edges, soft baby-blue water, snowflake-drift, cozy snow-pile pillow on the floe"
- "Sea-otter kelp-raft at sunset, kelp ribbons wrapping the otter pair, sun-glittering water, gull-shaped cloud above"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
