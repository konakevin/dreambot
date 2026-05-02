#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/mass_effect_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MASS-EFFECT-CODED ARCHITECTURE entries for StarBot's mass-effect-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR in the Mass Effect aesthetic tradition — Citadel Council chamber, Normandy ship interiors, asari floating-temple chambers, krogan brutalist bunkers, geth-platform synthetic interiors, Reaper-coded biomechanical ship-corridors, Salarian science labs, Cerberus sterile labs.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO ALIENS-AS-FIGURES. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Citadel", "Normandy", "Tuchanka", "Thessia", "Reaper", "Sovereign", "Geth", "Quarian", "Krogan", "Asari", "Salarian", "Cerberus", "Mass Effect" — describe the AESTHETIC generically.

━━━ AESTHETIC DNA ━━━

Capture the mood of BioWare-Mass-Effect / Sparth / Matt-Rhodes. CLEAN-FUTURE-MEETS-DISTINCT-ALIEN. Controlled palettes, never gaudy. Each species/world has its own architectural language readable at a glance.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

GALACTIC-CAPITAL CURVED-CLASSICAL HALLS (~4):
- vast curved-metallic council chamber with multi-tier seating, panoramic window overlooking station-arm cityscape
- elegant curved-classical promenade with skybridges, polished floor, controlled-blue ambient light
- galactic-capital atrium with vaulted ceiling and curving walls, multi-tier balconies, atmospheric scale
- council audience chamber with elevated podium, controlled-purple accent light, distant viewing windows

NORMANDY-STYLE SHIP INTERIORS (~3):
- modern military-spacecraft bridge with controlled-orange console glow, central command podium, viewport ahead
- ship-cargo bay with industrial floor grating, mech-frame on lift, controlled-blue work-light
- ship-medbay with sterile-white surfaces, surgical lights, scanning equipment, controlled-cyan accents

ASARI FLOATING-TEMPLE INTERIORS (~3):
- ancient asari-style temple interior with pastel-violet walls, ivory columns, soft purple-blue ambient
- floating-city sanctuary chamber with arched windows showing pastel ocean horizon, classical-organic architecture
- crystalline goddess-temple interior with gemstone inlay, organic-gothic spires, hazy violet light

KROGAN BRUTALIST BUNKERS (~3):
- brutalist warrior-clan bunker with reinforced concrete walls, exposed pipes, rust-orange accent lighting
- ravaged clan-stronghold interior with cracked stone walls, tribal banners, dim ember-light from braziers
- post-apocalyptic warrior-empire chamber with broken floor, scattered weapons-on-racks (no figures), heavy mood

GETH-PLATFORM SYNTHETIC INTERIORS (~3):
- synthetic-collective platform interior with smooth chrome walls, exposed cabling running in geometric patterns
- machine-civilization data-chamber with vertical light-pillars, sterile blue ambient, modular wall panels
- geth-style platform corridor with single optical-sensor lens at the far end, no organic curves

REAPER BIOMECHANICAL SHIP-CORRIDORS (~3):
- vast biomechanical Reaper-style ship-interior with bone-and-metal vaulted ceiling, pulsing organic floor
- ancient biomechanical-vessel corridor with rib-arched walls and dim red ambient pulsing
- Reaper-style chamber with vaulted bone-vault ceiling, biomechanical conduits, deep-shadow ominous

SALARIAN/CERBERUS STERILE LABS (~3):
- sterile science lab with white-clinical surfaces, blue-LED equipment, scanning consoles, no figures
- corporate-research lab with scattered datapads, holographic displays, controlled-cyan ambient
- specimen-storage chamber with backlit alien specimens behind reinforced glass walls

GALACTIC-COMMERCIAL CONCOURSE (~3):
- station promenade with curving walkway, holographic shop displays, atmospheric haze, no figures
- station market with elevated walkways, neon shop-signs in alien scripts, atmospheric scale
- station-bar interior with controlled-blue ambient, scattered tables, atmospheric haze

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO aliens-as-figures
- NO franchise proper nouns
- CLEAN-FUTURE-MEETS-DISTINCT-ALIEN mood, controlled palettes
- Variety across the 8 categories above mandatory
- Strong material specificity per faction (curved-metallic / pastel-ivory / brutalist-concrete / chrome-synthetic / bone-and-metal biomech / sterile-white)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
