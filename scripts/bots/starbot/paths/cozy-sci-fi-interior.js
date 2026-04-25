/**
 * StarBot cozy-sci-fi-interior path — the ONE warm path.
 * Varied cozy sci-fi pockets: greenhouses, labs, bridges, quarters, gardens.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const interior = picker.pickWithRecency(pools.COZY_SCI_FI_INTERIORS, 'cozy_sci_fi_interior');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a cozy-sci-fi interior painter writing COZY INTIMATE scenes for StarBot — warm, inviting corners of the SAME universe as our cosmic vistas and megastructures. Zoomed into the WARM PRIVATE SPACES where pilots decompress after a nebula run, where engineers tinker with personal projects after shift, where someone left a steaming mug on the navigation console and forgot about it three jumps ago. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ COZY EXCEPTION ━━━
This is the ONE warm path on StarBot. Cozy + warm + intimate in a sci-fi setting.

━━━ THE COZY SPACE IS LIVED IN — THIS IS NON-NEGOTIABLE ━━━
These spaces are not showrooms — someone LIVES here and you can FEEL it:
- PERSONAL TRACES: evidence of the occupant's life — their hobbies, their routines, their personality written into the space. Invent UNIQUE details each time, never repeat the same props across renders
- WARMTH SOURCES: every cozy space has its own specific warmth — could be machinery heat, grow-lamp glow, cooking steam, bioluminescence, warm console light, body heat in a small space. Pick ONE dominant warmth and commit
- WORN WITH USE: surfaces shaped by habitual touch, materials aged by daily life, repairs that show care rather than neglect
- AMBIENT SOUND MADE VISIBLE: the texture of background noise — machinery rhythm, air circulation, distant activity — expressed through visual cues like vibrating surfaces or condensation patterns

━━━ THE COZY SCI-FI INTERIOR ━━━
${interior}

━━━ LIGHTING (warm cozy with cosmic accent) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ CAMERA / FRAMING (follow this EXACTLY) ━━━
${cameraAngle}

━━━ COMPOSITION ━━━
Use the camera angle above as your framing guide. These are INTIMATE spaces — not cathedral hangars. The viewer should want to CURL UP here.
- NO VIEWPORT DEFAULT: do NOT include a window or porthole unless the pool entry specifically mentions one. The coziness comes from the space itself, not from looking at space through glass
- STILL SCI-FI: this is a corner of a starship, space station, alien dwelling, or orbital habitat — NOT a cabin on Earth. Technology is present even in the coziest corners
- HUMAN PRESENCE: occasionally include a single person naturally inhabiting this space — seen from behind or in partial view, absorbed in activity. They are NOT the subject — the SPACE is. Most renders should be empty, but a human detail is welcome when it feels natural

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
