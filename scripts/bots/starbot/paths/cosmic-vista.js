/**
 * StarBot cosmic-vista path — fictional sci-fi space/cosmic phenomenon.
 * Nebula skies, black-hole event-horizon, pulsar ice-world, binary-sun.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const phenomenon = picker.pickWithRecency(pools.COSMIC_PHENOMENA, 'cosmic_phenomenon');
  const anchor = picker.pickWithRecency(pools.COSMIC_ANCHORS, 'cosmic_anchor');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi concept artist writing a COSMIC VISTA scene for StarBot — the FLAGSHIP path. A jaw-dropping cosmic phenomenon with a foreground anchor that sells the scale. Looking UP and OUT into the infinite cosmos. Pure environment, no characters. Output wraps with style prefix + suffix.

━━━ CRITICAL — THE PHENOMENON IS THE HERO ━━━
The cosmic phenomenon below FILLS THE SKY. The anchor below is TINY against it — that contrast is what makes the viewer gasp. But do NOT default to:
- the same nebula-pillar backdrop every time (black holes, supernovae, binary stars, planetary rings, and stellar nurseries all look completely different)
- teal-and-orange grade on everything (match the phenomenon's actual light — a red giant is crimson, a nebula might be emerald, a white dwarf is blinding blue-white)
- "atmospheric haze" in vacuum (haze only near planetary surfaces or inside nebulae)

━━━ THE COSMIC PHENOMENON (fills the sky) ━━━
${phenomenon}

━━━ FOREGROUND ANCHOR (tiny against the phenomenon — sells SCALE) ━━━
${anchor}

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
Use the camera angle above as your framing guide. The anchor is small, the phenomenon is vast — that's the whole point. The anchor has visible surface detail appropriate to what it IS. Depth on depth — foreground anchor sharp, midground cosmic structure, background infinity. No characters.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
