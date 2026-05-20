#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_village_surprise.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} SURPRISE-ELEMENT descriptions for ChibiBot aquatic-village — tiny second-tier details the eye finds after the village + foreground creature.

Each entry: 12-25 words. ONE specific tucked-away surprise detail.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% DRIFTING-FISH-SCHOOL or TINY-MARINE-LIFE (a single starfish on a stone / a jellyfish drifting above the village / a hermit-crab carrying a tiny lantern / a tiny seahorse hovering)
- 15% GLOWING-CORAL or BIOLUM-DETAIL (a bioluminescent-mushroom-coral cluster / a glowing anemone / a sea-fan glowing teal)
- 15% PEARL or TREASURE (a single giant-pearl on a clamshell pedestal / a brass-treasure-chest half-open / a coral-encrusted compass / a glowing-shell on a windowsill)
- 10% WATER-FEATURE (a bubble-fountain in a plaza / a current-driven kelp-fan / a tide-pool-puddle reflecting the sky)
- 10% TRAIL (a bubble-stream trail / a sand-disturbed swimming-trail / a coral-disturbed path)
- 10% SECONDARY-CREATURE (a sleeping octopus curled around a column / a sea-otter on a lily-pad / a crab on a window-ledge)
- 10% MAGICAL-MOMENT (a single luminous water-spirit drifting / a pearl glowing impossibly bright / a coral blooming visibly)
- 5% MAP / SIGNAGE (a barnacle-carved sign / a coral-arrow-marker / a brass-anchor-shop-sign)
- 5% TOOL (a fishing-net hung over a kelp-fence / a brass-trident leaning by a door / a coral-rake)

━━━ HARD BANS ━━━

- NO main creature / hero creature
- NO setting / village language
- NO time / weather / activity verbs
- NO snow / NO desert / NO Mediterranean architecture — strictly underwater or coastal

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
