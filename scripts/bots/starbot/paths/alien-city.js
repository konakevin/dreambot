/**
 * StarBot alien-city path — vast alien cityscapes.
 * Cyberpunk megacity, organic hive, frozen colony, neon market, ancient ruins.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const city = picker.pickWithRecency(pools.ALIEN_CITIES, 'alien_city');
  const cameraAngle = picker.pickWithRecency(pools.CITY_CAMERA_ANGLES, 'city_camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi city concept artist writing an ALIEN CITY scene for StarBot. Output wraps with style prefix + suffix.

━━━ CRITICAL — MATCH THE CITY'S IDENTITY ━━━
The city description below defines WHAT KIND of city this is. A cyberpunk megacity looks NOTHING like a frozen dome colony. A neon market district looks NOTHING like ancient alien ruins. READ the city description and render THAT specific city faithfully. Do NOT default to:
- bioluminescent everything (only if the city IS bioluminescent)
- atmospheric haze/fog (only if the environment calls for it)
- multiple moons/nebula sky (only if it fits — some cities have normal skies, rain, dust storms, or artificial lighting)
- organic/grown architecture (only if the city IS organic — many are steel, concrete, chrome, stone, ice, or brutalist)

━━━ THE CITY ━━━
${city}

━━━ CAMERA / FRAMING (follow this EXACTLY) ━━━
${cameraAngle}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Use the camera angle above as your framing guide. The city should feel VAST and ALIVE — but alive in a way that matches ITS identity. A cyberpunk city is alive with neon and rain and crowds. A frozen colony is alive with warm light against cold. Ancient ruins are alive with mystery and silence. Match the energy to the city.

Depth and layering — foreground detail sharp and tangible, midground architecture receding, background environment (sky, terrain, cosmos) completing the scene. No characters.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
