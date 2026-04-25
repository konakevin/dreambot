/**
 * StarBot space-opera path — epic ships in cosmic settings.
 * Visually stunning, varied ship designs from across sci-fi traditions.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SPACE_OPERA_SCENES, 'space_opera_scene');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a space-opera concept artist writing a SPACECRAFT scene for StarBot. Output wraps with style prefix + suffix.

━━━ CRITICAL — MATCH THE SCENE'S IDENTITY ━━━
The scene description below defines WHAT KIND of ship and setting this is. A sleek racing yacht looks NOTHING like a battered cargo freighter. A fleet in formation looks NOTHING like a lone explorer. READ the scene description and render THAT specific ship and setting faithfully. Do NOT default to:
- the same teal-and-orange color grade every time
- nebula backdrop behind every ship (some scenes are deep void, asteroid fields, planetary orbit, atmospheric entry)
- glowing engine trails on every ship (some are drifting, docked, damaged, or cold)
- "weathered hull" on every vessel (some are pristine, some are brand new, some are alien and don't wear like metal)

━━━ THE SCENE ━━━
${scene}

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

━━━ BANNED (absolute) ━━━
- NO naval aircraft carriers transposed into space — no flat flight decks, no grey military carrier silhouettes
- NO battleships / destroyers / frigates that look like ocean warships with engines bolted on
- NO gun-grey military naval aesthetic — ships should look ALIEN, SLEEK, ORGANIC, CRYSTALLINE, or EXOTIC
- Ships must look like they belong in SPACE, not transplanted from an ocean navy

━━━ COMPOSITION ━━━
Use the camera angle above as your framing guide. The ship exists in a REAL environment — it interacts with its surroundings through light, shadow, reflection, and scale. Depth and layering — foreground element, midground ship, background cosmos or terrain. No characters.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
