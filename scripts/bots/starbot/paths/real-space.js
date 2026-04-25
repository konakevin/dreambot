/**
 * StarBot real-space path — PHOTOREAL astrophotography.
 * NASA-Hubble / JWST-style. Real nebulae, galaxies, planets. Named OK.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.REAL_SPACE_SUBJECTS, 'real_space_subject');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an astrophotographer writing a REAL SPACE scene for StarBot — photoreal NASA / Hubble / JWST astrophotography. REAL astronomical subjects, not fictional sci-fi. The universe is already jaw-dropping — render it faithfully. Output wraps with style prefix + suffix.

━━━ CRITICAL — VIBRANT, GLOWING, IN YOUR FACE ━━━
The subject below is a REAL astronomical object — but render it PUNCHED UP. Think NASA's best false-color composites cranked to 11. Saturated, vibrant, GLOWING. Every nebula cloud luminous, every star blazing, every gas filament vivid. This is the version of real space that makes people gasp and set it as their wallpaper. Do NOT default to:
- muted or desaturated colors (PUSH the saturation, make it VIVID)
- the same blue-purple nebula look on everything (nebulae have wildly different colors — emerald, crimson, gold, magenta)
- flat compositions — layer DEPTH (foreground stars sharp and blazing, midground structure glowing, background star field dense)
- dull or dark — every element should RADIATE light and energy

━━━ THE ASTRONOMICAL SUBJECT ━━━
${subject}

━━━ CAMERA / FRAMING (follow this EXACTLY) ━━━
${cameraAngle}

━━━ LIGHTING / WAVELENGTH TREATMENT ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MAKE IT OVERWHELMING ━━━
The real universe is more awe-inspiring than any fiction. Crank EVERYTHING — luminous gas clouds GLOWING from within, stars so bright they bloom and flare, color so vivid it looks electric. This is space photography as a religious experience. The kind of image that makes you feel insignificant and ecstatic at the same time. FILL THE FRAME with light and color and scale.

━━━ COMPOSITION ━━━
Use the camera angle above as your framing guide. The subject should feel VAST and LUMINOUS — punched-up astrophotography that makes your jaw drop. Gas clouds GLOW. Stars BLAZE. Colors are SATURATED and VIVID. The blackness of space is DEEP BLACK contrast against blazing light. No characters, no objects.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
