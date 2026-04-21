#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for StarBot — sci-fi + real-astronomy lighting treatments.

Each entry: 10-20 words. One specific sci-fi lighting treatment.

━━━ CATEGORIES ━━━
- Single-star illumination (lone sun cast light)
- Binary-sun double-light (two light sources, dual shadows)
- Planet-glow backlighting (planet disc illuminates foreground)
- Neon-reflected Blade-Runner (wet surfaces reflecting neon signs)
- Ion-glow (electric-blue illumination)
- Nebula-backlight (gas clouds glow behind subject)
- Industrial-strobe (intermittent emergency light)
- JWST-infrared mapped-color (orange-teal treatment)
- Hubble-visible-light (natural blue-amber)
- H-alpha red (hydrogen-line wavelength)
- False-color science mapping (purple-orange mapped data)
- Ultraviolet-imaged (UV-filter look)
- X-ray-mapped (cold-color high-contrast)
- Dune-orange desert (warm stark shadow)
- Interstellar-gargantua disc light (lensed accretion)
- 2001-jupiter-and-beyond (cosmic mystery lighting)
- Arrival-alien-ship underglow
- Annihilation-shimmer refraction
- Foundation-amber sepia-future
- Emergency-red interior (red-alert lighting)
- Cryo-blue interior (cold blue sleep-chamber)
- Sunrise-from-orbit (atmospheric band sunrise)
- Eclipse-corona ring-light
- Supernova-flash stark-white burst
- Nebula-curtain multi-color wash
- Ship-interior fluorescent
- Starship-emergency lighting
- Monolith-stark-geometric
- Alien-bioluminescence gentle-glow
- Gas-giant-reflected warm-cream
- Volcanic-planet underlight (lava glow)
- Magnetic-field aurora-cast
- Plasma-shield blue-ring
- Warp-tunnel streaked-light
- Cybercity-neon-saturation
- Dyson-sphere glow-from-inside-out
- Space-station-command-dim
- Jupiter-storm-bands golden-amber
- Ice-world-twin-moon silver

━━━ RULES ━━━
- Sci-fi specific named treatments
- Include real-astronomy lighting terms for real-space path
- Cinematic / production-art oriented

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
