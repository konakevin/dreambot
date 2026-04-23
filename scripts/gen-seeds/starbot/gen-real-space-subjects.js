#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/real_space_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} REAL SPACE SUBJECT descriptions for StarBot's real-space path — photoreal astrophotography. NASA-Hubble / JWST-style REAL space. Real nebulae, galaxies, planets, star-clusters. Named real astronomical objects OK. Distinct from fictional cosmic-vista.

Each entry: 15-30 words. One specific real astronomical subject with wavelength-color treatment.

━━━ CATEGORIES ━━━
- Orion Nebula (M42) in JWST-infrared orange-teal, stellar nursery detail
- Eagle Nebula Pillars of Creation in Hubble blue-amber visible-light
- Horsehead Nebula in red-H-alpha wavelength
- Carina Nebula cosmic cliffs in JWST infrared, cliff-structure detail
- Crab Nebula supernova remnant with pulsar at center
- Andromeda Galaxy in visible-light wide-field
- Whirlpool Galaxy (M51) with companion galaxy
- Pinwheel Galaxy (M101) spiral structure
- Saturn rings close-up with Cassini-division visible
- Jupiter storm-bands with Great Red Spot
- Mars surface from orbit with polar ice cap
- Venus clouds in ultraviolet
- Great Attractor region deep-field
- Tarantula Nebula in Large Magellanic Cloud
- Helix Nebula eye-like planetary nebula
- Ring Nebula (M57) in JWST infrared
- Southern Ring Nebula
- Butterfly Nebula with twin wings
- Bubble Nebula blown by hot star
- Lagoon Nebula with dust lanes
- Trifid Nebula three-lobed red-and-blue
- NGC 1300 barred-spiral galaxy
- Sombrero Galaxy with dust lane
- Antennae Galaxies collision in progress
- Stephan's Quintet five-galaxy group
- Cartwheel Galaxy ring structure
- Hubble Deep Field ultra-distant galaxies
- Hubble Ultra Deep Field even deeper
- Cosmic-dust pillars in Carina
- Eagle Nebula full view
- Pillars of Creation in JWST recent reprocessing
- Saturn with Enceladus geyser backdrop
- Jupiter's moon Europa surface cracks
- Io volcanic activity visible
- Titan surface with methane lakes
- Pluto surface with heart feature
- Comet 67P close-up
- Aurora-from-ISS orbital perspective
- Earth-from-orbit half-day half-night
- Solar eclipse totality corona
- Supernova 1987A remnant expanding
- Veil Nebula filaments
- Wizard Nebula open-cluster
- Cat's Eye Nebula intricate structure
- Tarantula Nebula 30 Doradus detail
- Cocoon Nebula
- Thor's Helmet Nebula
- Jellyfish Nebula supernova remnant

━━━ RULES ━━━
- REAL astronomical subjects (named)
- Include specific wavelength/treatment (JWST-infrared, Hubble-visible, H-alpha)
- Photoreal astrophotography aesthetic
- Real-facts accurate

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
