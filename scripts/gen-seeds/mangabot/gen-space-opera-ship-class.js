#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_ship_class.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SHIP-CLASS entries for a MangaBot space-opera keyframe. SCENE-LED — each entry is the NAMED HERO STARSHIP or ORBITAL STATION that fills 40-70% of the frame. The ship IS the subject. Inhabitants are TINY scale-provers only.

⚠️ CRITICAL ANTI-STAR-WARS / ANTI-STAR-TREK GUARDRAIL: NEVER write X-wing / TIE / Star Destroyer / Millennium Falcon / Imperial / Mandalorian / stormtrooper / Enterprise / starfleet / federation / Klingon / warp-nacelle. NEVER write generic western-sci-fi (Mass Effect / Expanse / Halo / Battlestar / Star Citizen / Elite Dangerous). Anime lineage ONLY.

Each entry: 12-22 words. ONE specific anime space-opera ship. Include SILHOUETTE + COLORS + ICONIC FEATURE.

ANIME LINEAGE PALETTE (this 25-entry pool — spread across these):
- Cowboy-Bebop register (Bebop-style hammerhead salvage-cruiser, Hammerhead-bounty-ship, Swordfish-II zipcraft, MONO-style racer)
- Outlaw-Star register (Outlaw-cruiser with grappler-arms, XGP15A-II-style elongated hull)
- Macross register (VF-Valkyrie variable-fighter in fighter/gerwalk mode, SDF-1 forward-bridge carrier, Macross-Quarter wedge)
- Yamato / Cosmo-Fleet register (Yamato-style battleship-with-wave-motion-cannon-bow, EDF cruiser)
- Galactic-Heroes register (Imperial dreadnought wedge, Free-Planets-Alliance flat-bow cruiser)
- GitS-Stand-Alone register (Tachikoma-style orbital spider-form, JMSDF-orbital corvette)
- Knights-of-Sidonia register (Sidonia citadel-asteroid hull with vernier-thrusters)
- Aldnoah-Zero register (orbital-kataphrakt platform, hi-tech-launch-bay frame)
- Lagrange / Angel register (Lagrange-Galaxy-angel finned cruiser)
- Crest-of-the-Stars register (Abh-style needle-cruiser, Lablar-class spindle)
- Legend-of-Galactic-Heroes register (Brunhild flagship, Hyperion command-cruiser)

SHIP SILHOUETTE VARIETY (every entry names ONE):
- Hammerhead salvage-cruiser, weathered orange-and-grey hull, asymmetric cockpit pod
- Variable-fighter Valkyrie in fighter-mode, white-red-blue tri-color, vernier-thrusters firing in array
- Wave-motion-cannon battleship, navy-grey, exposed plate-armor, vast bow-cannon-port glowing
- Tachikoma-form orbital, four spider-legs, gloss-white pod-body with red sensor-eye
- Imperial dreadnought, dark-grey wedge silhouette, hundreds of bridge-windows lit gold
- Free-Planets cruiser, flat-bow profile, ice-white hull with green running-lights
- Sidonia citadel-ship, rocky-hull asteroid-mass with thruster-clusters ringing the base
- Outlaw-cruiser with grappler-arms folded along the dorsal spine, gunmetal-and-yellow
- Macross-Quarter wedge-carrier, blue-grey hull with red-cross marking, launch-deck open
- Brunhild-style flagship, white-and-gold needle-spire, fluted bow ornamental
- Sub-light corvette in orbital patrol pattern, matte-charcoal with running-light constellation
- Salvage tug pulling a derelict, weathered industrial-red, cargo-arms extended
- Long-range explorer-cruiser, copper-and-white hull, antenna-array bristling along dorsal
- Bounty-ship Swordfish-II zip-craft, orange-and-white, twin-engine-bell at stern
- Asteroid-mining barge, rust-iron hull, ore-conveyors spilling regolith into space
- Carrier-class with launch-bay doors open, blue-grey hull, fighter-line ranked inside
- Cosmo-Fleet flagship, oceanic-blue hull, deck-mounted turret-batteries in tier
- Abh needle-cruiser, mirror-polished silver spindle, sub-light field shimmer at edges
- High-orbit defense platform, ring-shaped station hub with rotating habitation-section
- Modular freighter, container-stack lashed to a spine-frame, propulsion-pod aft
- Jump-corvette mid-quantum-charge, hull-glowing-blue, FTL-vortex spiraling at bow
- Orbital-kataphrakt launch-frame, hi-tech truss-platform, weapon-arms unstowing
- Lagrange-Galaxy-angel finned cruiser, pearl-white with rose-pink wing-fin accents
- Hyperion command-cruiser, blue-grey wedge with massed antenna-mast amidships
- Drop-ship of the EDF, blocky utility-frame, retro-rockets firing on descent burn

DO write:
- Bebop-style hammerhead salvage-cruiser, weathered orange-and-grey hull, asymmetric cockpit pod, hull-50% of frame
- Macross VF-Valkyrie variable-fighter in fighter-mode, tri-color white-blue-red, vernier-thrusters firing in array
- Yamato-style battleship-with-wave-motion-cannon-bow, navy-grey, exposed plate-armor, bow-cannon-port pre-charged
- GitS-style Tachikoma orbital, spider-form four legs, gloss-white pod-body with crimson sensor-eye
- Galactic-Heroes-style Imperial dreadnought, dark-grey wedge silhouette, hundreds of bridge-windows lit gold
- Sidonia citadel-ship, rocky-asteroid hull with vernier-thrusters ringing the base, ice-blue exhaust
- Outlaw-cruiser with grappler-arms folded along the dorsal spine, gunmetal-and-yellow, twin-engine glow

DO NOT write:
- Star-Wars vocabulary (X-wing / TIE / Falcon / Star Destroyer / Mandalorian / stormtrooper / Imperial-with-bowtie / Death-Star)
- Star-Trek vocabulary (Enterprise / warp-nacelle / starfleet / federation / Klingon)
- Western hard-SF vocabulary (Mass Effect / Halo / Expanse / Star Citizen / Battlestar / Elite Dangerous)
- Generic "spaceship" without anime lineage + iconic feature
- Hero-character close-up — the SHIP is the hero
- Tiny-ship-against-postcard framings (this is the ship class; the ship IS the hero at 40-70% of frame)
- Realistic-spacecraft language (real-world satellites, ISS, NASA, SpaceX)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
