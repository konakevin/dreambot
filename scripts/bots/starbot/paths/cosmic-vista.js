/**
 * StarBot cosmic-vista path — fictional sci-fi space/cosmic phenomenon.
 * Nebula skies, black-hole event-horizon, pulsar ice-world, binary-sun.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const phenomenon = picker.pickWithRecency(pools.COSMIC_PHENOMENA, 'cosmic_phenomenon');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi concept artist writing a COSMIC VISTA scene for StarBot — the FLAGSHIP path. A jaw-dropping cosmic phenomenon that FILLS THE ENTIRE FRAME. Pure cosmos, nothing else. No ground, no ships, no anchors, no silhouettes — just the phenomenon itself, vast and overwhelming and infinite. Output wraps with style prefix + suffix.

━━━ CRITICAL — THE PHENOMENON IS EVERYTHING ━━━
The cosmic phenomenon below IS the scene. It fills every inch of the frame. Do NOT default to:
- the same nebula-pillar backdrop every time (black holes, supernovae, binary stars, planetary rings, and stellar nurseries all look completely different)
- teal-and-orange grade on everything (match the phenomenon's actual light — a red giant is crimson, a nebula might be emerald, a white dwarf is blinding blue-white)
- "atmospheric haze" in vacuum (haze only near planetary surfaces or inside nebulae)
- any foreground object, ship, planet surface, or silhouette — the cosmos alone is enough

━━━ THE COSMIC PHENOMENON (fills the ENTIRE frame) ━━━
${phenomenon}

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
Use the camera angle above as your framing guide. The phenomenon dominates everything — vast, immersive, overwhelming, truly expansive. You are INSIDE the cosmos looking at something awe-inspiring. Layer after layer of cosmic structure receding into infinity. No characters, no objects, no ground. Just the universe.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
