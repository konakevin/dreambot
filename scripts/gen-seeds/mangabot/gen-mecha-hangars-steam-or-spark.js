#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_steam_or_spark.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} STEAM-OR-SPARK entries for a MangaBot mecha-hangar keyframe. Each entry describes the atmospheric vapor / electrical / particulate detail that gives the hangar its mechanical aliveness. Steam, sparks, dust, vapor, engine-glow, weld-arcs, etc.

Each entry: 12-20 words. ONE specific atmospheric phenomenon. Always READABLE (light-catching particles).

STEAM/SPARK VARIETY:
- WHITE STEAM-PLUME venting from leg-hydraulics in foreground (catching arc-light)
- BLUE ARC-SPARK cascade from overhead welder onto shoulder (showering down past the chest)
- CHEMICAL-VAPOR MIST pooling at mech's feet from coolant-line (low-lying ground fog)
- DUST-SHAFT BEAM through open hangar-doors (illuminating particles, god-rays angled)
- HARSH SODIUM-VAPOR LIGHTING cutting hard shadows across the deck (no soft fog)
- ENGINE-GLOW UNDER-THRUSTER ember-orange (radiating warm light up the calf)
- BATTLEFIELD SMOKE drifting through bay-doors at distance (silhouetting the mech's profile)
- MORNING-MIST OVER SCRAP-YARD catching first light (cool blue, drifting between girders)
- TORCH-CUTTER SPARK-SHOWER from a welder mid-repair (gold-orange spray across the shin)
- DRIPPING-COOLANT POOL on the hangar floor (mirror-puddle catching overhead lights)
- ANTI-GRAVITY DUST suspended in the cage (particles floating mid-air, slow-motion feel)
- VENTING-WHITE-STEAM from shoulder-port (gentle constant exhalation)
- ENGINE-EXHAUST RIPPLE-HEAT above thrusters (visible distortion line over the deck)
- ARC-WELD STROBE-FLASH from upper scaffold (intermittent blue burst into the bay)
- POWDER-PAINT MIST from cherry-picker spray-job (orange paint cloud at the shoulder)
- LUBRICATION-OIL DRIP from elbow-joint (single golden bead falling slowly)
- LASER-ALIGNMENT GRID projected onto chest-plate (thin red lattice across the armor)
- ELECTRICAL DISCHARGE crackling between two diagnostic-probes (purple-pink arc)
- KEROSENE FUEL-VAPOR shimmer at the refuel port (heat-distortion line under the cap)
- HYDRAULIC-SPRAY MIST from a ruptured line (high-pressure cone of vapor at the hip)
- COMBUSTION-FLARE briefly visible at thruster-test (sharp orange burst, fading)
- DUST-DEVIL stirred by deck-fans circulating air around the mech's legs
- DRYWALL/CONCRETE PARTICLES drifting after a wall-impact-test
- COLD-CONDENSATION drip from fuel-line freeze (clear droplets at the underside)
- BACK-LIT FOG-GLOW behind the mech (silhouetting the entire body in light-fog)

DO write:
- White steam-plume venting from the leg-hydraulics in the foreground, catching arc-light cones overhead
- Blue arc-spark cascade from the overhead welder onto the shoulder, showering down past the chest plate
- Chemical-vapor mist pooling at the mech's feet from a leaking coolant-line, low ground-fog
- Dust-shaft beams through open hangar-doors, illuminating airborne particles at god-ray angles
- Engine-glow under-thruster ember-orange, radiating warm light up the inside of the calf
- Battlefield smoke drifting through the bay-doors at distance, silhouetting the mech's profile
- Torch-cutter spark-shower from a welder mid-repair, gold-orange spray across the shin armor

DO NOT write:
- Setting structure (lives in hangar_setting)
- Mech surface (lives in mech_detail)
- "no fog" / "no haze" negative phrases (Flux renders banned terms)
- Heavy volumetric whiteout (atmospheric, not floor-to-ceiling fog)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
