#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mecha_pilots_lighting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING-MODE descriptions for MechBot's mecha-pilots path. Each describes a complete cinematic lighting setup for a PILOT + GIANT-MECH scene — pilot VISIBLE & TINY (scale-ruler dwarfed by their machine) in a hangar / launch-silo / gantry / catwalk / dawn deployment / pre-mission staging / industrial overhaul setting. The scale gap between pilot and mech IS the punchline — lighting must carry that contrast.

Each entry: 28-42 words. Format: "LIGHTING-NAME-IN-CAPS — full multi-clause description of the light situation, how it lands on both the pilot (tiny, often catching one warm interior glow or visor pinprick) and the mech (vast, multi-tier panel-shadow), and the resulting hangar / launch / deployment mood." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must read like a hangar / launch-silo / gantry-catwalk MOVIE-POSTER LIGHT SETUP. The PILOT is tiny (often catching one specific small light — cockpit interior glow, helmet visor, gantry handheld torch); the MECH is massive (long industrial multi-shadow across riveted hull plating, cockpit-dome interior glow). Name BOTH explicitly per entry. NOT active battlefield (that's titan-war / power-armor territory) — this is BEFORE / DURING the deployment ritual.

━━━ VARIETY MANDATE (~14 categories distributed across the batch) ━━━

- HANGAR sodium-amber wash (elevated mast floodlights, hard yellow shadow stretching long behind mech feet)
- LAUNCH-SILO pulsing-orange (rotating amber alert-strobes climbing silo walls, lower pit cold cobalt)
- DAWN-DEPLOYMENT dual-color (cold pre-sunrise blue base + first orange catching only upper mech shoulders + cockpit dome)
- NIGHT MECH-RUNNING-LIGHTS (cold cobalt ambient, chassis running-lights amber + cyan, cockpit interior wash on pilot's access ladder)
- EMERGENCY-RED STROBE pulsing (rotating red beacons firing in rhythm, mech silhouetted between pulses, urgency immediate)
- RAIN-WET PAD night (single elevated backlight cutting through rainfall, wet deck doubling mech in reflection, droplets specular along pilot)
- HARD KEY-LIGHT INSPECTION (single overhead spotlight on mech's forward chassis, pilot + technician in deep surrounding shadow)
- OVERCAST DEPLOYMENT-FIELD (uniform low-cloud blanket, mech formation muted cool-grey, near-zero shadow contrast)
- DUSK FIRE-GLOW POST-COMBAT (burning installation off-frame, warm orange uplight across mech underside + pilot's visor)
- NEON-CYBERPUNK URBAN HANGAR (magenta + cyan commercial signage bleeding through open hangar mouth, wet deck puddles)
- INDUSTRIAL OVERHAUL CRANE-LIGHTS (overhead gantry sodium + handheld arc-welder strobing pilot's silhouette across rivet-fields)
- COCKPIT-DOME INTERIOR PRIMARY (cool blue HUD glow washing pilot's face from inside dome, hangar around in deep ambient)
- VERTICAL LAUNCH-CHAMBER UPLIGHT (lower ignition exhaust glow blooming orange across mech's underside, pilot in cockpit catching the bloom)
- THUNDERSTORM-OVER-DEPLOYMENT-PAD (lightning fork freeze-frame, mech briefly white against black sky, pilot caught mid-board)
- LATE-NIGHT GANTRY WORKLIGHTS (handheld floodlamps in tech-crew hands raking across mech's torso during pre-flight check)
- DAWN-DEPLOYMENT MISSION-LINE (line of mechs at horizon edge-lit warm-amber, pilots boarding via catwalks each catching a single warm cockpit-dome light)

━━━ MUST INCLUDE ELEMENTS in each entry (pick at least 3) ━━━
- Direction + temperature of the dominant light source
- How it lands on the MECH (rivet-detail crisp / hull shadow stretching / chassis underside)
- How it lands on the PILOT (cockpit interior glow / visor pinprick / catwalk handheld / silhouette on access ladder)
- Atmospheric texture (steam / smoke / rain / dust-motes in beams / sodium haze)
- Resulting deployment-ritual mood (mission-ready tense / pre-launch reverence / post-combat weight / hot-stand-by urgency)

━━━ BANS ━━━

- NO active-battlefield muzzle-flash, RPG, plasma-bolt-walls (that's power-armor / titan-war territory)
- NO closeup pilot-face-only setups — pilot is TINY and the mech dominates frame
- NO bland office / lab interior
- NO "stadium floodlights" generic — name HANGAR-MAST or LAUNCH-PIT-ARC specifically
- NO Star Wars / Halo / Mandalorian / Spartan / Boba IP language
- NO scrap-weld rust-tech wasteland DNA (that's rust-apoc territory)
- NO bush-fix improvised lighting — the mecha-pilots setting is INDUSTRIAL + DESIGNED

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full lighting description per string. Each starts with the lighting-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
