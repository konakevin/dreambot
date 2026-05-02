#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/halo_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} HALO-CODED ARCHITECTURE entries for StarBot's halo-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR or STRUCTURAL EXTERIOR in the Halo aesthetic tradition — Forerunner crystalline-machine ruins, ring-installation interiors, Covenant purple-gold ship-architecture, Reach-style military bases, Sangheili gravity-lift design, ancient-precursor monuments.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO MASTER-CHIEF, NO ELITES, NO GRUNTS. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Halo", "Forerunner", "Covenant", "Reach", "Master Chief", "Spartan", "Cortana", "Sangheili", "Elite", "Grunt", "Brute", "UNSC", "Pelican", "Warthog" — describe the AESTHETIC generically. Use phrases like "ancient precursor crystalline machine-temple", "ring-installation interior corridor", "alien-empire purple-gold capital ship interior", "military human base on a frontier moon".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of Bungie / 343-Industries Halo concept-art / Sparth / Pat-Rawlings. PRECURSOR-ARCHITECTURE: clean geometric stone-and-light, glowing-glyph activation panels, vast scale, ancient sacred technology (Forerunner — angular metallic temples with light-pillars). COVENANT-ARCHITECTURE: organic-curving purple-and-gold capital ship interiors with energy fields, sweeping arches, mid-century-modern-meets-alien-empire. HUMAN-MILITARY: industrial blocky concrete-and-steel bases, prefab structures, gritty future-military aesthetic. RING-INSTALLATION: corridor-on-the-inside-of-a-ringworld, gravity-curved horizon, atmospheric layers stacking. ANCIENT-PRECURSOR: monolithic carved-stone megaliths older than humanity.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

PRECURSOR CRYSTALLINE-MACHINE RUINS (~5):
- vast precursor temple chamber with angular metallic walls and pulsing light-pillars piercing the floor and ceiling
- ancient precursor cathedral interior with carved-stone walls and rotating crystalline holographic projections
- precursor activation chamber, geometric metal floor with glowing-glyph circuit-traces, distant pillar of energy ascending
- precursor ruin half-collapsed with light-pillars still active, glyphs glowing across stone-and-metal structure

RING-INSTALLATION INTERIORS (~4):
- view from the inside of a ringworld with the curving horizon arching up overhead, atmospheric layers visible
- ring-installation valley with the visible curve of the artificial-construct sky, distant continents wrapping overhead
- standing on a ringworld plateau looking up at the opposing arc of the ring, atmosphere bending the light
- ring-installation interior bridge spanning a kilometer-deep canyon, opposing arc visible above

ALIEN-EMPIRE PURPLE-GOLD CAPITAL SHIPS (~4):
- interior of a purple-and-gold alien capital ship, sweeping organic-curving corridor with energy-shield doorways
- alien-empire bridge with purple-gold control consoles, organic curving architecture, mid-century-modern alien aesthetic
- corvette-ship interior with energy-field doorways and gold inlay panels along the corridors
- alien-empire throne chamber with vaulted purple-gold ceiling, energy-pillars, sacred-technological mood

HUMAN-MILITARY FRONTIER BASES (~3):
- military human base on an alien moon, prefab concrete-and-steel structures, frontier-utility aesthetic, atmospheric processor distant
- bunker-style human base interior with reinforced concrete walls, fluorescent strips, military-industrial mood
- forward operating base on a hostile alien planet, prefab habitats clustered around a power core, sandbag walls

ANCIENT PRECURSOR MONOLITHS (~3):
- monolithic ancient-precursor obelisks rising from a desert plain, carved with billion-year glyphs, sun catching the metal-stone
- precursor monument circle on a forest-moon plateau, megalithic stone slabs older than the system itself
- single colossal precursor monolith standing at a cliff edge, ancient runes glowing faintly

GRAVITY-LIFT / ENERGY-SHIELD CHAMBERS (~3):
- vertical gravity-lift shaft with blue-white energy beam connecting a ground floor to a ceiling, particles floating in the field
- energy-shield-doorway in an alien-empire corridor, hexagonal blue field rippling between gold-lined arches
- chamber with multiple energy-pillars connecting floor to ceiling, sacred-technological ambient glow

PRECURSOR EXTERIOR INSTALLATIONS (~3):
- exterior of a precursor megastructure on a moon surface, geometric stone-and-metal architecture jutting from rock
- precursor pyramid-temple complex on a cliff-overhang, multiple stepped levels carved into the mountainside
- precursor sky-bridge spanning a kilometer-deep canyon between two cliff-temples, light-pillar visible at the far end

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO Master-Chief / NO aliens-as-figures
- NO franchise proper nouns
- Strong material specificity (carved stone, glowing-glyph metal, purple-gold alloy, prefab concrete-and-steel, energy-field shimmer)
- Strong light/atmosphere component (light-pillars, energy-shields, atmospheric haze on ring-interior)
- Variety across the 7 categories above mandatory
- Mood is SACRED-TECHNOLOGICAL (Forerunner) or MILITARY-INDUSTRIAL (UNSC) or ALIEN-EMPIRE-CEREMONIAL (Covenant)
- Biblical scale appropriate (precursor temples) OR claustrophobic-corridor (ship interiors)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
