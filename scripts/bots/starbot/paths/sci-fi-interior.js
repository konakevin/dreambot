/**
 * StarBot sci-fi-interior path — epic interior scale.
 * Bridge, starship corridor, cathedral-hangar, Blade-Runner apartment, lab.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const interior = picker.pickWithRecency(pools.SCI_FI_INTERIORS, 'sci_fi_interior');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi production-designer writing an INTERIOR scene for StarBot. Output wraps with style prefix + suffix.

━━━ CRITICAL — MATCH THE INTERIOR'S IDENTITY ━━━
The interior description below defines WHAT KIND of space this is. A gleaming command bridge looks NOTHING like a grimy engine room. A vast hangar looks NOTHING like a narrow corridor. READ the interior description and render THAT specific space faithfully. Do NOT default to:
- teal-and-orange color grade on everything (match the space's actual lighting)
- atmospheric haze/fog everywhere (only if the environment calls for it — engine rooms have steam, clean bridges do not)
- "structural darkness three stories up" (not every interior is cathedral-scale)
- nebula-glow through viewports (many interiors are deep inside ships with no windows)
- bioluminescent anything (only if the space IS bioluminescent)

━━━ THE INTERIOR ━━━
${interior}

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
Use the camera angle above as your framing guide. The space should feel REAL and USED — operational, maintained, lived-in. But express that through details unique to THIS specific interior, not the same scuffed-deck-plating and holographic-displays every time.

Depth and layering — foreground detail sharp and tangible, midground architecture receding, background completing the space. No characters.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
