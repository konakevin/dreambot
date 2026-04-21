#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_phenomena.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COSMIC PHENOMENA descriptions for StarBot's cosmic-vista path — FICTIONAL sci-fi space/cosmic marvels. Blade-Runner/Dune/Interstellar style. Pure environment, no characters.

Each entry: 15-30 words. One specific cosmic phenomenon with scale-and-detail context.

━━━ CATEGORIES ━━━
- Nebula skies (impossibly large nebula filling sky, purple-and-gold gas clouds)
- Black-hole event-horizon (Interstellar-Gargantua style, accretion disk glowing, lensed light)
- Pulsar ice-world (frozen planet with pulsing lighthouse-beam in sky)
- Binary-sun sunset (two suns setting over alien landscape, long dual shadows)
- Ringed-planet horizon (standing on moon with massive ringed planet filling sky)
- Star-field infinity (impossible dense starfield, Milky-Way-like arc)
- Wormhole entrance (gravitational lens distorting space visible)
- Galaxy-overhead (massive spiral galaxy overhead from moon-surface)
- Supernova mid-explosion (shockwave frozen, expanding light)
- Quasar distant (blinding bright point with jets)
- Comet close-pass (massive comet with visible ice tail near planet)
- Asteroid belt from inside (rocks tumbling past viewer)
- Solar flare eruption (from close solar orbit, prominences leaping)
- Magnetosphere aurora (planet seen from space with aurora ring)
- Event-horizon from inside (light bending, impossible)
- Fractal-nebula (Mandelbrot-like nebula pattern)
- Plasma-storm sky (colorful plasma discharges in atmosphere)
- Crystal-meteor shower (crystalline rocks refracting as they burn)
- Cosmic string (theoretical gravity-wire visible crossing sky)
- Dark-matter-cloud hinted (invisible mass distorting starlight)
- Dual-galaxy collision (two spirals merging)
- White-hole burst (theoretical reverse-black-hole)
- Brown-dwarf sun (deep-red dim sun with gas-giant orbiting)
- Eclipse-of-nebula (moon passing in front of nebula)
- Ringed-gas-giant with multiple moons aligned
- Hypervelocity-star streaming through cosmos

━━━ RULES ━━━
- FICTIONAL / concept-art sci-fi (real astronomy goes in real_space_subjects)
- Epic scale — composition-worthy
- No characters, no ships (save for other paths)
- Mind-bending + awe-inspiring

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
