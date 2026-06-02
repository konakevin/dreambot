#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/outdoor_adventure_wilderness.json',
  total: 200,
  batch: 15,
  metaPrompt: (
    n
  ) => `You are writing ${n} WILDERNESS SETTINGS for ChibiBot outdoor-adventure — pure wilderness/open-world scenes where a chibi creature is having an adventure. NO villages, NO cottages, NO architecture. Just nature.

Each entry: 25-40 words. ONE specific wilderness scene. NO creatures, NO time-of-day, NO weather verbs, NO activity verbs.

━━━ THE BAR — WILD OPEN-WORLD LANDSCAPE I WANT TO EXPLORE ━━━

The viewer's reaction: "I want to be there exploring!" Studio Ghibli wilderness / Pokemon-overworld / Pixar adventure / Avatar wilderness register. Pure nature — rocks, water, vegetation, sky, terrain.

━━━ 14 BIOME SUB-TYPES — MUST VARY ACROSS THE POOL — distribute evenly ━━━

- 8% FOREST (sun-dappled mossy forest floor with towering pines / dense fern-glade with sunbeams piercing the canopy / oak-and-birch grove with carpet of wildflowers / redwood-cathedral with shafts of golden light filtering down)
- 8% MOUNTAIN (alpine wildflower-meadow rising toward snow-capped peaks / rocky high-altitude pass with windswept grasses / mountain-saddle overlook with sweeping vista of valley below / scree-slope with patches of alpine flowers)
- 8% CAVE (glowworm-illuminated cavern with constellations of cyan light on the ceiling / crystal-cave with prismatic light refracting / stalactite-strung grotto with reflecting pools / mossy entrance-cave with shafts of daylight piercing the dark)
- 8% CANYON (vast red-rock canyon with layered orange-and-tan walls / slot-canyon with ribbons of sunlight cutting down / mesa-top with sweeping desert vista / canyon-rim trail overlooking dizzying drop)
- 8% RIVER (rapids tumbling over mossy boulders / glassy mountain-stream winding through fern-banks / glittering river-bend with pebble-shore / waterfall-pool with frothy white-water / hot-spring stream with steam-rising)
- 8% CLIFF (cliffside overlook above a sea of clouds / rocky-cliff with crashing waves below / sea-cliff with seabirds circling / pine-clad cliff with crashing surf far below)
- 8% LAKE (mirror-still mountain lake reflecting peaks / foggy lake at dawn with mist rolling / lily-pad-strewn pond with dragonflies / glacial-lake with turquoise water and floating ice)
- 8% HILL / MEADOW-VISTA (rolling green hills with wildflower-meadows / vast sweeping meadow with cosmos and lupines / hillside-pasture with grass bending in the wind / golden wheat-hill with poppies)
- 6% DESERT (sandy dune-sea stretching to the horizon / desert-oasis with palm-clusters / petrified-forest with stone-trees / cactus-flat under vast sky)
- 6% COASTLINE (rocky tidepool coast with crashing waves / pebble-beach with driftwood / sandy beach with seabirds / wave-carved sea-cave at low tide)
- 5% GLACIER / ICE (blue-ice glacier with deep crevasses / frozen waterfall with curtain-icicles / ice-floe lake with floating bergs / snow-blanketed alpine plateau)
- 6% JUNGLE-FLOOR (dense fern-floor jungle with massive leaves / vine-draped canopy clearing / mossy buttress-root forest / mangrove-roots with shallow water)
- 6% WATERFALL (cascading waterfall plunging into a misty pool / multi-tier waterfall with rainbow / waterfall-curtain backlit by sun / hidden waterfall in a mossy grotto)
- 7% MAGICAL-WILDERNESS (bioluminescent forest with glowing mushrooms / firefly-meadow at twilight / glowing-flower-field with magical sparkle / aurora-glade with shimmering sky / floating-petal river)

━━━ MANDATORY: NATURE-DETAIL ELEMENTS IN EVERY ENTRY ━━━

Each entry MUST visibly include at least 3 wilderness elements (rocks / water / trees / vegetation / sky / terrain / weather-feature / atmospheric-detail / wildlife-trace / etc.).

━━━ HARD BANS ━━━

- NO creatures or characters
- NO villages, cottages, huts, buildings of any kind
- NO time / weather / activity verbs
- NO modern manmade objects (cars, lamps, signs)
- NO indoor settings
- NO bare empty backdrops — must be specific natural wilderness

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering. Aim for biome variety across the 14 sub-types.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
