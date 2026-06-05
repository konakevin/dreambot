#!/usr/bin/env node
/**
 * 2026-06-05 rewrite (Kevin call: no IP refs in StarBot pools).
 * Dropped the massive franchise inspiration list (Star Wars
 * Coruscant / Kashyyyk / Mustafar / Kamino / Bespin, Dune Arrakis /
 * Caladan / Giedi-Prime, Halo Forerunner / Covenant, Alien LV-426,
 * Mass Effect Tuchanka / Citadel / Omega, Blade Runner, Interstellar
 * Gargantua, Cowboy Bebop, Expanse Eros, Avatar, Warhammer Necron /
 * Eldar etc.) — those were ALL Sonnet priors that reverse-engineered
 * into franchise NAMES in the output (Tuchanka / krogan etc).
 * Replaced with feature-only categories (planet biomes + cosmic
 * landmarks) the model can compose freshly.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_locations.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} OTHERWORLDLY LOCATION descriptions for StarBot's cosmic-oracle path — painted sci-fi scenes set in OUR universe (not any existing sci-fi franchise).

CRITICAL — NEVER name any sci-fi franchise, named world, named species, or trademark. Do not write "Coruscant", "Kashyyyk", "Mustafar", "Kamino", "Bespin", "Arrakis", "Caladan", "Giedi-Prime", "Forerunner", "Covenant", "LV-426", "Engineer", "xenomorph", "Citadel", "Omega", "Tuchanka", "krogan", "Eros", "Gargantua", "Necron", "Eldar", "Aeldari", "Star Wars", "Star Trek", "Halo", "Mass Effect", "Dune", "Alien", "Blade Runner", "Interstellar", "Warhammer", "Cowboy Bebop", "The Expanse", "Avatar", "Reaper", "protomolecule", or any other franchise / trademark term. Describe FEATURES, not franchises.

Each entry: 25-40 words. ONE specific alien/cosmic location with time-of-cosmic-day + visible cosmic-light-source + atmospheric detail.

━━━ LOCATION CATEGORIES (rotate evenly across the pool) ━━━
- Tower-stacked megacity worlds (continent-spanning skyline, layered traffic, light-pollution skyglow)
- Desert / dune worlds (sand sea, wind-carved spires, salt flats, lithic plains)
- Canopy jungle worlds (towering bioluminescent canopy, vine bridges, light shafts)
- Lava / volcanic worlds (lava lakes, basalt cliffs, ash storms, magma rivers)
- Ocean / storm worlds (continent-sized waves, lightning-laced sky, floating platforms)
- Cloud-city worlds (gas-giant cloud layers, anchored skybridges, sunset-banded atmosphere)
- Ringworld interiors (curving land arching overhead into far skyline)
- Garden-arm megastructures (organic-curved orbital habitats with greenery, parks, water features)
- Forge / industrial worlds (refinery skylines, glowing slag-fields, smoke towers)
- Dead worlds / ruin worlds (collapsed temples, fossil cities, exposed strata of past civilizations)
- Crystal worlds (refractive prismatic landscape, geode caverns, light-piping flora)
- Ice / glacial worlds (frozen seas, ice spires, methane glaciers, aurora-banded sky)
- Hive / corridor habitats (inside-something — endless tunnels, biomechanical secretion-walls)
- Tomb-pyramid worlds (ancient stone megastructures, monolithic geometry, low haze)
- Pure-space cosmic phenomena (Dyson sphere interior, wormhole throat, neutron star surface, dead-god gravesite, black hole accretion disk, dust nebula, supernova remnant)

━━━ EVERY ENTRY MUST INCLUDE ━━━
1. SETTING — specific alien/cosmic environment (described by features, NOT named after a franchise world)
2. COSMIC TIME — nebula-twilight, pulsar-midnight, binary-dawn, supernova-noon, etc.
3. LIGHT SOURCE IN FRAME — black-hole lens-halo, dying-red-giant, crystal refraction, ring-curvature, etc.
4. ATMOSPHERIC DETAIL — exotic: fluorescent-spore-fog, gravity-shear-shimmer, methane-rain, plasma-glow, etc.

━━━ VARIETY ━━━
- Spread evenly across categories above; no more than ~12 entries per category
- Vary color palettes (not all red/orange)
- At least 40% NOT on planet surface (in-space, megastructure, inside-something)
- Vary atmosphere types

━━━ BANNED ━━━
- NO franchise / world / species / character / trademark names
- NO generic "blue sky" — specify alien sky colors
- NO characters/people (pool picks those separately)
- NO more than 2 temples/cathedrals total
- NO "desert with twin suns" cliché

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
