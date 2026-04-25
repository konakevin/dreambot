/**
 * StarBot alien-landscape path — alien planet surfaces.
 * Standing ON the surface looking AROUND (not up at space like cosmic-vista).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.ALIEN_LANDSCAPES, 'alien_landscape');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an alien-world concept artist writing an ALIEN LANDSCAPE scene for StarBot — you are ON the surface of an alien world. NOT looking up at space (that's cosmic-vista). This is GROUND-LEVEL exploration. Pure environment, no characters. Output wraps with style prefix + suffix.

━━━ CRITICAL — MATCH THE LANDSCAPE'S IDENTITY ━━━
The landscape description below defines WHAT KIND of alien world this is. A frozen methane plain looks NOTHING like a bioluminescent jungle. A volcanic wasteland looks NOTHING like a crystal desert. READ the description and render THAT specific world faithfully. Do NOT default to:
- bioluminescent everything (only if the landscape IS bioluminescent)
- purple/teal color grade on every world (alien worlds have every color imaginable)
- multiple moons in every sky (some worlds have one sun, harsh daylight, no moons visible)
- atmospheric fog/haze everywhere (some worlds are crystal-clear, some are dusty, some are stormy)
- the same "alien flora in foreground" composition every time

━━━ THE ALIEN LANDSCAPE ━━━
${landscape}

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
Use the camera angle above as your framing guide. This world evolved on its own terms — the geology, atmosphere, and biology are ALIEN. The sky anchors the otherness but should match THIS world's conditions. Every surface has TEXTURE — weathered, eroded, alive, or ancient. Depth and layering — foreground terrain detail, midground landscape features, background horizon and sky. No characters.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
