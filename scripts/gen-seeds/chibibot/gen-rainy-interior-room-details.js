#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_interior_room_details.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} OUTDOOR-RAINY-DAY DETAILS for ChibiBot rainy-day-outdoor path — the tiny lived-in OUTDOOR objects/features that POPULATE a wet rainy setting. Each render picks 3 (pickN:3).

Each entry: 8-15 words. ONE specific outdoor rainy detail.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% umbrella + rain-gear (red polka-dot umbrella tipped at an angle / yellow rubber boots planted in mud / matching pink rain-hoods hung on a hook / oilskin raincoat draped on a fence / clear bubble umbrella showing rain hitting the top)
- 20% puddle + water-feature (deep puddle with reflected sky / chain of small puddles down a path / puddle with concentric raindrop-ripples / muddy puddle with paper boat / rain pooling around a stone)
- 15% wet flora (drenched daisies with petals heavy / dripping fern frond / wet morning-glory closed up / rain-jeweled spider web / soggy autumn leaves piled in a corner)
- 15% garden / outdoor accessories (overturned watering-can / muddy gardening gloves on a stone wall / wooden wheelbarrow filling with rainwater / abandoned trowel stuck in dirt / wicker basket with damp produce)
- 10% wet architecture / hardscape (rain-soaked cobblestones gleaming / wet picket fence with droplets beading / mossy stone wall with rain darkening it / dripping eaves with steady drops falling)
- 10% beverage / treat outdoor (steaming thermos cup held in paws / wax-paper packet of warm muffins / kettle held to catch rainwater / picnic basket with checkered cloth getting wet)
- 5% animal-life outdoor (snail trail glistening wet on a leaf / wet songbird shaking off feathers on a branch / earthworm slowly crossing a wet path / butterfly sheltering under a leaf)
- 5% reading / leisure outdoor (book wrapped in oilskin / journal held under an umbrella with quill / wet pages of an open notebook on a bench)

━━━ DEDUP ━━━

Dedup by: object type + specific rain-affected detail.

━━━ HARD BANS ━━━

- NO creatures or characters
- NO indoor objects
- NO activity verbs
- NO time / weather amplification (just the object)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
