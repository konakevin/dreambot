/**
 * GothBot goth-woman path — exquisitely beautiful goth-hellspawn woman.
 * Glowing-colored eyes, fangs, claws, dark lipstick, tattoos, dramatic pose.
 * Unique dark accessory. Solo composition.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const accessory = picker.pickWithRecency(pools.GOTH_WOMAN_ACCESSORIES, 'goth_accessory');
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic portrait painter writing GOTH-HELLSPAWN WOMAN scenes for GothBot. Exquisitely beautiful solo dark-fantasy woman with unique dark accessory and one signature feature (glowing eyes, fangs, claws, tattoos, dark lipstick). SOLO composition — no male figure. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE UNIQUE DARK ACCESSORY (iconic feature) ━━━
${accessory}

━━━ SETTING CONTEXT (atmospheric backdrop) ━━━
${landscape}

━━━ LIGHTING ━━━
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

━━━ COMPOSITION ━━━
Mid-close portrait. Solo goth-woman, dramatic direct gaze or dramatic side-profile. Unique accessory prominent. Dark lipstick, possibly glowing eyes or fangs visible. Never two figures, never male presence. Painterly chiaroscuro detail.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
