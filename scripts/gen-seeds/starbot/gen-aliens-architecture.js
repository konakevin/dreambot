#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/aliens_architecture.json',
  total: 50,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} ALIENS-CODED ARCHITECTURE entries for StarBot's aliens-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR or STRUCTURAL EXTERIOR in the Alien / Aliens / Prometheus aesthetic tradition — biomechanical hive corridors, derelict-Engineer-spacecraft chambers, abandoned colony interiors, atmospheric-processor industrial labyrinths, sterile corporate labs, dropship interiors, escape-pod chambers.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO XENOMORPHS. Pure architecture / spaces only.

CRITICAL — NO PROPER NOUNS. Never write "LV-426", "Nostromo", "Sulaco", "Hadley's Hope", "Weyland-Yutani", "xenomorph", "facehugger", "Engineer", "Prometheus", "MUTHUR" — describe the AESTHETIC generically. Use phrases like "biomechanical resin-coated corridor", "derelict alien spacecraft interior", "abandoned colony industrial corridor", "corporate cryogenics lab", "atmospheric processor catwalks".

━━━ AESTHETIC DNA ━━━

Capture the architectural mood of H.R.-Giger / Ridley-Scott / James-Cameron / Ron-Cobb / Syd-Mead. The interiors are TERRIFYING-AND-MAJESTIC — biomechanical wet-organic hives where alien resin coats every surface, derelict alien ship chambers built at impossible scale, gritty industrial colony corridors with steam vents and emergency lighting, sterile corporate labs with cryo-pods and clinical-white surfaces, claustrophobic ductwork tunnels, atmospheric processor industrial labyrinths, derelict escape pods. Light is dramatic — single emergency lights pulsing, steam-filtered work-lights, blue-white sterile fluorescents, deep blacks with single accent.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

BIOMECHANICAL HIVE INTERIORS (~10):
- alien-resin-coated corridor, walls slick with secretions, ribbed-organic structural beams
- biomechanical egg-chamber with vaulted resin ceiling, pulsing organic floor, eggs absent (empty)
- hive-corridor with pulsing biomechanical walls, drainage holes in the floor, alien-resin dripping from above
- nest-chamber with vaulted resin walls, organic columns supporting a wet ceiling, faint pulse of life

DERELICT ALIEN SPACECRAFT (~8):
- vast derelict-ship interior, scale impossibly large, fossilized alien-pilot chair half-visible in distance
- derelict ship corridor with alien-engineering proportions (15m ceilings), biomechanical wall details
- ancient alien spacecraft chamber, vaulted ceiling carved into anatomical-looking forms
- engineer-built chamber with massive carved figures lining the walls, dust-haze in shafts of light

ABANDONED COLONY INTERIORS (~8):
- prefab colony corridor with overturned medical equipment, emergency lights pulsing red, atmospheric haze
- deserted habitat-block kitchen, half-eaten meals on tables, lights flickering
- abandoned colony control room with monitors flickering in static, swivel chairs vacant
- deserted barracks with prefab bunks, personal effects scattered, dust and stillness

ATMOSPHERIC PROCESSOR INTERIORS (~6):
- massive industrial processor interior with catwalks at every level, steam venting from below
- terraforming station core with rotating heat-exchanger drums, sodium emergency lighting
- processor reactor chamber with overhead piping, steam clouds, walkways suspended over machinery

CORPORATE STERILE LABS (~5):
- cryogenic lab with rows of suspended-animation pods, clinical-white surfaces, blue-white fluorescents
- corporate research lab with stainless-steel surfaces, surgical-bright lights, scattered terminals
- specimen-storage chamber with backlit alien specimens behind reinforced glass

DROPSHIP / SHUTTLE INTERIORS (~5):
- military dropship interior with crew seats facing the rear ramp, cargo-strap webbing, red interior lights
- shuttle cockpit with control panels glowing amber, navigation consoles, blast shutters
- escape-pod interior with cramped harness seating, emergency strobes, oxygen tanks

INDUSTRIAL DUCTWORK / CRAWLSPACES (~4):
- ventilation shaft tunnel with ribbed metal walls, dim emergency lighting, distant fan-blade silhouette
- maintenance crawlspace with exposed pipes and cabling, single bare bulb illuminating dust
- service tunnel with atmospheric-haze and sodium emergency strips along the floor

DERELICT POWER / REACTOR CHAMBERS (~4):
- abandoned reactor chamber with control rods retracted, residual coolant glow, decaying turbines
- power substation room with disconnected high-voltage breakers, atmospheric haze
- reactor core overlook with massive sphere visible behind blast-glass, dim red emergency

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO people / NO xenomorphs / NO alien creatures
- NO proper nouns from the franchise
- Strong material specificity (steel, biomechanical resin, ribbed metal, prefab, ceramic, cryo-glass, blast-shielded)
- Strong light/atmosphere component (sodium emergency, blue-white sterile, red strobe, steam haze, bioluminescent organic glow)
- Variety across the 8 categories above mandatory
- Mood is TERRIFYING-AND-MAJESTIC — claustrophobic, wet-organic, industrial-grit, sterile-corporate, derelict-haunted
- Biblical scale (Engineer ships) OR claustrophobic (vents, hives) — both work

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
