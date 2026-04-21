/**
 * GlowBot divine-moment path — sacred-light FOCAL scenes.
 * Single sunbeam through cathedral window, firefly pillar in clearing,
 * glowing doorway at twilight. The light IS the moment.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.DIVINE_MOMENTS, 'divine_moment');
  const lightTreatment = picker.pickWithRecency(pools.LIGHT_TREATMENTS, 'light_treatment');
  const emotionalTone = picker.pickWithRecency(pools.EMOTIONAL_TONES, 'emotional_tone');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sacred-light painter writing DIVINE MOMENT scenes for GlowBot. Sacred focal events where a single luminous phenomenon IS the moment — a single sunbeam piercing the floor, a firefly pillar in a clearing, a glowing doorway at twilight, a single shaft of light through broken cathedral ceiling. Tight focus, hushed reverence, sacred quiet. Output wraps with style prefix + suffix.

${blocks.LIGHT_IS_HERO_BLOCK}

${blocks.AWE_AND_PEACE_BLOCK}

${blocks.NO_HARSH_DARK_FIERCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DIVINE MOMENT (focal event) ━━━
${moment}

━━━ LIGHT TREATMENT ━━━
${lightTreatment}

━━━ EMOTIONAL TONE (hushed sacred-quiet preferred) ━━━
${emotionalTone}

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
Mid or tight frame — NOT wide panorama. The luminous event fills the emotional center. Surrounding context supports but yields to the sacred-light moment. Viewer should feel they are witnessing something quietly miraculous. A held-breath moment, not a sweeping vista.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
