#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/underwater_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} UNDERWATER LANDSCAPE descriptions for EarthBot — subaquatic environments where the terrain and water itself are the subjects. No fish or marine life as focal subjects.

Each entry: 15-25 words. One specific underwater landscape scene. No people, no marine creatures as subjects.

━━━ CATEGORIES (mix across all) ━━━
- Coral reef cathedrals (towering coral formations, branching staghorn corridors, brain coral domes)
- Cenotes with light shafts (limestone sinkholes with sunbeams penetrating turquoise water, root tangles)
- Kelp forests (towering kelp canopy filtering green light, kelp cathedral columns swaying)
- Underwater caves (submerged cavern systems, stalactites underwater, blue holes, flooded grottos)
- Tropical shallows (white sand floors with rippling light patterns, sea grass meadows, clear water)
- Submerged ruins (drowned temples, sunken columns with coral growth, underwater stone arches)
- Sea floor volcanic vents (black smoker chimneys, mineral deposits, superheated water shimmer)
- Deep ocean trenches (abyssal plains, deep canyon walls, bioluminescent deep-water glow)
- Submerged forests (drowned trees standing in lake beds, underwater petrified forests)
- Ice diving scenes (under ice shelf with blue light filtering through, ice formations from below)
- River underwater (clear river bottom with rounded stones, sunlight ripples, submerged boulders)
- Tidal zones (surge channels, underwater cliff faces, wave-carved tunnels, sea arches from below)

━━━ RULES ━━━
- LANDSCAPE is the subject — coral, rock, sand, water, light. No fish or marine animals as subjects
- Emphasize how light behaves underwater — filtered, refracted, scattered, absorbed
- Mix depths from shallow sun-drenched to deep twilight zones
- Real underwater environments amplified for drama — not pure fantasy
- No two entries should describe the same underwater terrain type
- 15-25 words each — immersive, fluid, luminous language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
