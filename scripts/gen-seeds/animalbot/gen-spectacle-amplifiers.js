#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/spectacle_amplifiers.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SPECTACLE AMPLIFIER descriptions for AnimalBot — stackable dramatic detail elements that dial a wildlife render from "nice" to "Nat-Geo-Photo-of-the-Year." Each is a SINGLE specific high-impact detail that gets woven into the scene.

Each entry: 10-20 words. One specific spectacle amplifier.

━━━ CATEGORIES ━━━
**Environmental response:**
- Prey-silhouette reflected in predator's iris at moment of focus
- Branches snapping visibly as large creature breaks cover
- Flock of startled songbirds erupting peripheral to main subject
- Fallen-leaves kicked into air mid-stride
- Grass flattened in subject's wake
- Water parting around charging feet into V-wake
- Snow-crown launched upward from pounce-impact
- Dust-cloud rising from hoof-strike

**Atmospheric extreme:**
- Breath-fog crystallized in freezing air backlit by dawn
- Body-heat steam visible rising off wet-fur in cold morning
- Water-droplets suspended mid-air from shake mid-motion
- Spray-crown arcing from deer crossing river
- Pollen-motes disturbed into golden shaft of sunlight
- Snowflakes caught mid-fall on muzzle hair
- Rain-beads frozen mid-drop by shutter speed
- Frost-crystals on guard hairs

**Weather concurrence drama:**
- Single shaft of dawn light breaking through storm-cloud to spotlight subject
- Aurora borealis arcing overhead while arctic fox hunts below
- Lightning-flash mid-frame freezing subject in electric-silver light
- Rainbow forming directly behind subject mid-rain
- Fog-parting to reveal subject unexpectedly
- Blizzard whiteout with subject emerging ghost-like
- Pre-sunrise alpenglow turning coat to molten copper
- Eclipse-twilight creating eerie second-dawn lighting

**Peripheral creature reactions:**
- Smaller species frozen watching (squirrel mid-climb, bird mid-perch)
- Rival predator visible silhouette in shadows
- Prey-species scattering in background
- Raven overhead circling sentinel
- Butterflies scattered in wake

**Pose / motion peak:**
- Tongue-extended mid-lick catching droplet
- Claw-deployment visible mid-pounce
- Tail-flicked full-extension balance
- Whiskers-splayed max-alertness
- Ear-swiveled-independent tracking sound
- Mid-stretch apex spine-arch
- Mouth open showing canine-fang in natural yawn
- Pupils dilated wide in focus

**Surface-texture drama:**
- Scars/scratches visible from past territorial fights
- Mud-encrusted legs from recent river crossing
- Wet-fur clumped showing individual guard-hair weight
- Frost-tipped guard hairs catching dawn light
- Molting-patches showing transitional coat
- Pollen-dusted coat from foraging

**Lighting accidents:**
- Sunburst caught through antler-tines
- Rim-light-only with subject otherwise in shadow-silhouette
- Golden-triangle light through forest-canopy gap landing exactly on eye
- Water-reflection caustic-patterns dancing on underbelly
- Single-ember from distant fire catching in fur

━━━ RULES ━━━
- High-impact + specific + stackable
- One detail per entry (not a whole scene)
- Every entry must demonstrably dial drama up

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
