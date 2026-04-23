#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_locations.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} OTHERWORLDLY LOCATION descriptions for StarBot's cosmic-oracle path — painted sci-fi scenes. Draw from the vast catalog of sci-fi cinema, games, and novels. Reference the AESTHETIC of these worlds, never character names.

Each entry: 25-40 words. ONE specific alien/cosmic location with time-of-cosmic-day + visible cosmic-light-source + atmospheric detail.

━━━ WORLD AESTHETICS TO DRAW FROM (rotate evenly, max 2 per franchise) ━━━
Star Wars worlds (Coruscant megacity, Kashyyyk canopy, Mustafar lava, Kamino storm-ocean, Bespin clouds), Dune worlds (Arrakis dunes, Caladan cliffs, Giedi-Prime black-sun), Halo ringworlds (Forerunner interior curving skyward, Covenant spires, shield-worlds), Alien/Prometheus (LV-426 basalt storm-moon, Engineer monoliths, xenomorph hive), Mass Effect (Citadel garden-arms, Omega neon, Tuchanka badlands), Blade Runner (rain-neon perpetual-night, orange-dust Vegas), Interstellar (water-world tsunami, ice-planet, Gargantua accretion-disk), Cowboy Bebop (Martian shanty-domes, Venusian cloud-cities), The Expanse (Eros corridors, protomolecule ruins), Avatar (bioluminescent jungle, floating mountains), Warhammer 40K (hive-city spires, Necron tomb-pyramids, Eldar craftworld), cosmic-creative originals (Dyson spheres, ringworld interiors, wormhole throats, neutron star surfaces, dead-god gravesites)

━━━ EVERY ENTRY MUST INCLUDE ━━━
1. SETTING — specific named alien/cosmic environment
2. COSMIC TIME — nebula-twilight, pulsar-midnight, binary-dawn, supernova-noon, etc.
3. LIGHT SOURCE IN FRAME — black-hole lens-halo, dying-red-giant, crystal refraction, ring-curvature, etc.
4. ATMOSPHERIC DETAIL — exotic: fluorescent-spore-fog, gravity-shear-shimmer, methane-rain, plasma-glow, etc.

━━━ VARIETY ━━━
- Max 2 entries per franchise, rotate through ALL sources
- Vary color palettes (not all red/orange)
- At least 40% NOT on planet surface (in-space, megastructure, inside-something)
- Vary atmosphere types

━━━ BANNED ━━━
- NO character names from any franchise
- NO generic "blue sky" — specify alien sky colors
- NO characters/people (pool picks those separately)
- NO more than 2 temples/cathedrals total
- NO "desert with twin suns" cliché

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
