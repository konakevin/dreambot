#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_epic_backdrops.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} EPIC BACKDROP entries for StarBot's female-explorer and male-explorer paths. Each entry is a DENSE phrase (20-35 words) describing a MASSIVE structure / scale-defining element that DOMINATES the backdrop of a deep-space scene and DWARFS the human character standing in front of it.

CRITICAL: SCALE. The character will be SMALL relative to this thing. The backdrop is the HERO of the composition. Atmospheric haze and depth-perspective should be implied — kilometer-scale stuff fading into mist or distant orbit.

Reference imagery: a hooded explorer dwarfed by a mile-long alien dreadnought looming overhead through fog. A small figure on a cliff facing a sphere-megastructure with descending light-trails. A cosmonaut walking through a canyon with a moon filling 40% of the sky. A figure in front of a colossal Halo-ring or Dyson-segment. A character mid-pause as a capital ship descends through the atmosphere behind them.

━━━ BACKDROP CATEGORIES (enforce variety across ${n}) ━━━

MEGASHIP / CAPITAL SHIP (5-6):
- mile-long alien dreadnought looming overhead through atmospheric fog, hull plating receding into mist, glowing engine ports the size of buildings
- titanic capital ship descending through clouds, atmospheric heat-trails curling around its kilometer-long hull, smaller escort ships flanking
- alien generation-ship the size of a mountain hanging in the lower atmosphere, observation pods winking with light along its length, distant fleet beyond
- massive battle-cruiser parked low against the horizon, hull-lights twinkling like a small city, descending dropships visible as silhouettes
- titanic broken cruiser-wreck half-buried in alien terrain, hull plating stretching for kilometers, light beaming through broken viewports
- military supercarrier filling the frame upper-third, hull-lights stretching in geometric patterns, smaller fighters streaming from launch bays

PLANET / MOON / RINGED-WORLD (4-5):
- enormous moon dominating 40% of the sky, surface craters visible in detail, faint atmospheric ring catching the local star
- gas giant filling the upper half of the sky with swirling crimson-and-gold storms, multiple smaller moons in foreground orbit, atmospheric haze on the horizon
- ringed planet rising at horizon, ring-system catching twin-star light into a glowing arc, planet's rim glowing soft orange
- twin-star binary system at horizon with planets-of-different-colors hanging in the void between them
- crescent of a colossal alien-world filling the entire sky behind, atmosphere glowing thin blue along the limb, micro-debris drifting

MEGASTRUCTURE / ALIEN ARCHITECTURE (4-5):
- sphere-megastructure suspended in the sky with descending column-beams of light reaching toward the surface, atmospheric haze around it
- Halo-ring section curving across the entire sky, surface terrain visible on the inner curve, atmospheric haze filling the lower frame
- Dyson-segment partial-construction visible in orbit, kilometer-spanning girders in mid-assembly, distant star peeking through
- titanic alien obelisk reaching from the surface into low orbit, glyph-engravings visible at human-scale base, atmospheric haze surrounding
- massive vault-door alien architecture set into a cliff, easily 100 meters tall, ancient runic glyphs glowing softly along the seams

CITYSCAPE / MEGACITY (3-4):
- alien megacity stretching to the horizon with kilometer-tall spires piercing low atmospheric clouds, distant flying-craft like dust-motes
- vast cyberpunk-megacity below the camera with neon canyons stretching forever, fog haze with twinkling lights, advertising-blimps drifting at level
- ruins of a colossal alien city dwarfing the camera, ancient towers leaning at angles, atmospheric haze with strange flying-creatures
- distant city-spire complex on the horizon at dawn, kilometer-tall towers catching first-light, layered city-haze receding to vanishing point

NATURAL EXTREME-SCALE (3-4):
- kilometer-tall canyon walls towering on both sides of the frame, character walking the canyon floor, distant alien sun cresting between the walls
- alien mountain peak the size of an Earth-continent rising from the horizon, atmospheric haze making it look like a distant god, sky filling above
- titanic crystalline structure rising from a valley like a frozen god-tooth, kilometers tall, surface refracting starlight into rainbows
- vast alien glacier in mid-collapse, walls of glowing ice receding into atmospheric haze, soft alien sun lighting the high crystalline rim

COSMIC / SPACE-SCENE (3-4):
- character standing on a hangar-bay edge with a vast nebula filling the open void beyond, smaller patrol-craft like dots in the foreground
- distant fleet of alien ships in formation across a starlit void, character on a viewing-platform, individual ships visible at human-scale of perception
- supernova explosion at the horizon, expanding shockwave visible against deep void, character on a viewing-pad with the light catching their face
- spiral galaxy edge-on in the upper sky, billions of stars visible, character on a planetary surface looking up

━━━ RULES ━━━
- Each entry is a SCALE-DEFINING backdrop — kilometer-and-up scale stuff that DWARFS the character
- 20-35 words — paint the backdrop vividly with sense of MASSIVE size and atmospheric depth
- Atmospheric haze / mist / fog / distance-particles encouraged in many entries
- The backdrop is the HERO of the composition — the character will be SMALL in front of this
- Suitable for both male and female explorers
- Variety across all 6 categories above mandatory
- Cinematic / awe-inspiring / Halo-Mass-Effect-Star-Wars-Dune-coded scale

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
