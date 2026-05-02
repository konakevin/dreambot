/**
 * StarBot robot-moment path — solo ornate robot in a living environment.
 * Visually stunning machines with intricate detail, caught mid-action.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const robot = picker.pickWithRecency(pools.ROBOT_TYPES, 'robot_type');
  const moment = picker.pickWithRecency(pools.TRANQUIL_MOMENTS, 'tranquil_moment');
  // Roll setting: 50% interior (dune palace / aliens biomech / corridors),
  // 50% planet wilderness (alien biome). Robots can be anywhere.
  const isInterior = Math.random() < 0.5;
  const setting = isInterior
    ? picker.pickWithRecency(pools.CHARACTER_INTERIOR, 'robot_interior')
    : picker.pickWithRecency(pools.PLANET_SETTING, 'robot_planet');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi character-painter writing a ROBOT MOMENT scene for StarBot — a solo ornate machine doing something visually compelling in a living environment. The robot is a SHOWPIECE — every surface tells a story. Output wraps with style prefix + suffix.

━━━ CRITICAL — MATCH THE ROBOT'S IDENTITY ━━━
The robot description below defines WHAT KIND of machine this is. READ it and render THAT specific robot with OBSESSIVE SURFACE DETAIL — every engraving, every patina layer, every glowing element, every scratch and modification. Do NOT default to:
- the same weathered-paint-and-panel-seams on every robot (some are pristine, some are crystalline, some are alien-organic, some are armored, some are skeletal)
- teal-and-orange lighting on every scene
- nebula backdrop behind every robot (some are in forests, cities, deserts, interiors, ruins)
- "poignant" mood every time (some robots are working, some are dangerous, some are playful)
- generic smooth metal — every surface has TEXTURE (engravings, patina, oxidation, rust, glow, filigree, scarring, plate-stress)

━━━ ABSOLUTE BANS — DROID-ONLY, NO MEGASTRUCTURE / NO FANTASY DRIFT ━━━

The subject is a DROID — a CHARACTER-SCALE autonomous robot, between 0.5m (utility / mouse droid) and 3m (large combat droid) tall. A thing a person could STAND NEXT TO. NOT a megastructure, NOT a vehicle, NOT a building, NOT a sentinel-construct.

NEVER render as:
- a kilometer-tall walker, a thirty-meter serpent, a building-sized titan, a hundred-meter sentinel
- a dreadnought / warship / submarine / aquatic-titan / hull-with-mechanical-arms (those are vehicles, not droids)
- a cathedral / temple / monolith / fortress / chapel / monastery (those are architecture, not droids)
- carved stone / limestone / sandstone / rock-body / stained-glass body parts
- gargoyle / statue / idol / totem / sphinx / any architectural-creature
- a chandelier-shaped sentinel, a coiling thirty-meter construct, or any abstract-large-mechanical-art-installation
- biomechanical organisms with hydraulic muscle fibers and arterial coolant (cyborg territory, not droid)
- mossy-ruins-overgrown-with-vines bodies, wooden bodies, organic plant-grown frames
- fairy-tale, medieval, or ancient-mythology aesthetic — droids are sci-fi, not fantasy

The droid reads as a STANDALONE ROBOT-CHARACTER you'd encounter in a sci-fi film — bipedal / quadrupedal / spherical-rolling / hovering / boxy-utility / insectile / wheeled. Recognizable AT A GLANCE as an autonomous machine. Not a building. Not a vehicle. Not a kilometer-scale anything.

If the seeded description uses ambiguous language ("ancient" / "ornate" / "weathered"), interpret it as ALIEN-ANCIENT, INDUSTRIAL-ANCIENT, or POST-APOCALYPTIC-ANCIENT droid — never as gothic-cathedral-ancient.

━━━ NO CYBORG WOMEN ━━━
Never render a sexy/feminine cyborg or android woman — that's VenusBot's territory. StarBot robots are MACHINES — industrial, military, scientific, ceremonial, or alien. They can be humanoid in shape but should read as MECHANICAL, not human.

━━━ THE ROBOT (solo subject — render every detail) ━━━
${robot}

━━━ THE ACTION ━━━
${moment}

━━━ CAMERA / FRAMING (follow this EXACTLY) ━━━
${cameraAngle}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ THE SETTING (where this droid is — render this environment) ━━━
${setting}

Render the setting with full depth: foreground environment detail, midground droid sharp and ornate, background space receding into atmospheric haze. The droid is IN this place, doing something connected to this environment.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ THE ENVIRONMENT IS ALIVE ━━━
The world around this robot is NOT a blank backdrop. It REACTS to the robot's presence — displaced debris, reflected light, heat shimmer, footprints, disturbed dust, bent vegetation, melted frost, scattered wildlife. The environment has its own texture and life independent of the robot.

━━━ COMPOSITION ━━━
Use the camera angle above as your framing guide. ONE robot, no companions. The robot is the focal point — render it with the detail of a museum piece. Body language tells the story. Depth and layering — foreground environment detail, midground robot sharp and ornate, background world stretching out.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
