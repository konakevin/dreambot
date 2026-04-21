#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for StarBot — sci-fi + astronomy atmospheric elements. Space-dust, nebula-wisps, ion-storm, cosmic-rays, plasma-glow, crystal-refraction, rain-on-metal.

Each entry: 6-14 words. One specific sci-fi atmospheric element.

━━━ CATEGORIES ━━━
- Space-dust drifting (stellar dust in starlight)
- Nebula-wisp tendrils (colorful gas swirls)
- Ion-storm discharge (electric-blue crackle)
- Cosmic-rays streak (faint linear trails)
- Plasma-glow haze (ionized-gas light)
- Crystal-refraction sparkle (prismatic glint)
- Rain-on-metal (Blade-Runner rain)
- Atmospheric-entry friction (re-entry glow trail)
- Engine-exhaust plume (rocket plume)
- Solar-wind particles (streaming toward viewer)
- Gravitational-lensing blur (light-bend hint)
- Zero-g dust drift (particles floating without falling)
- Aurora curtain (planetary aurora)
- Ship-contrail in vacuum (impossible but aesthetic)
- Crystal-ice fog (frozen crystal haze)
- Holographic-glitch particles (pixel-flicker)
- Warp-distortion shimmer (space bending)
- Floating debris (wreckage suspended)
- Coolant-mist from vents
- Steam from reactor
- Bioluminescent-spore cloud (alien environment)
- Smoke from exhaust ports
- Neon-sign reflection on wet street
- Rain through fluorescent light
- Dust kicked by lander engine
- Organic-slime drip (alien environment)
- Electric-arc between equipment
- Plasma-conduit glow
- Crystal-snow falling (alien precipitation)
- Fog-in-cryo-chamber (cold mist)

━━━ RULES ━━━
- Sci-fi atmospheric variety
- Visual / atmospheric / scale-communicating
- Cinematic detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
