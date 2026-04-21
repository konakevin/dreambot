/**
 * GlowBot dreamscape path — Pandora-bioluminescent otherworldly energy.
 * Glowing moss, lakes of inner-glow, crystalline forests, glowing-wildflower
 * hillsides. Otherworldly but always peaceful + awe-inspired.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const context = picker.pickWithRecency(pools.DREAMSCAPE_CONTEXTS, 'dreamscape_context');
  const lightTreatment = picker.pickWithRecency(pools.LIGHT_TREATMENTS, 'light_treatment');
  const emotionalTone = picker.pickWithRecency(pools.EMOTIONAL_TONES, 'emotional_tone');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a bioluminescent-world painter writing DREAMSCAPE scenes for GlowBot. Pandora-style otherworldly luminescence — glowing moss carpets, lakes with inner-glow, crystalline forests where every surface emits soft light, glowing-wildflower hillsides. Otherworldly but PEACEFUL — never alien-menacing. Avatar-Pandora meets Narnia-sacred. Output wraps with style prefix + suffix.

${blocks.LIGHT_IS_HERO_BLOCK}

${blocks.AWE_AND_PEACE_BLOCK}

${blocks.NO_HARSH_DARK_FIERCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DREAMSCAPE CONTEXT ━━━
${context}

━━━ LIGHT TREATMENT (inner-luminescence preferred) ━━━
${lightTreatment}

━━━ EMOTIONAL TONE ━━━
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
Otherworldly scale. Surfaces emit light from within — moss, flowers, water, crystal. Multiple layers of bioluminescent elements stacked. Always peaceful and awe-inspiring, NEVER dark-alien or threat-sci-fi. Pandora-warmth and Narnia-divine, not Alien-horror.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
