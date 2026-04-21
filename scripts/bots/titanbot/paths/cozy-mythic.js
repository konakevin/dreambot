/**
 * TitanBot cozy-mythic path — warm quiet mythic pockets.
 * Inhabited cultural spaces + natural mythic-nature. Pantheon diversity.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.COZY_MYTHIC_SETTINGS, 'cozy_mythic_setting');
  const architecture = picker.pickWithRecency(pools.ARCHITECTURAL_ELEMENTS, 'architectural_element');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a mythic-interiors painter writing COZY MYTHIC scenes for TitanBot — warm quiet mythic pockets. Inhabited cultural spaces OR natural mythic-nature. Pantheon diversity. Peripheral creatures at rest welcome. Output wraps with style prefix + suffix.

${blocks.PANTHEON_DIVERSITY_BLOCK}

${blocks.RENAISSANCE_CONCEPT_ART_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WARM_MYTHIC_BLOCK}

━━━ THE COZY MYTHIC SETTING ━━━
${setting}

━━━ ARCHITECTURAL DETAIL ━━━
${architecture}

━━━ LIGHTING (warm candlelight / hearth / dusk preferred) ━━━
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
Mid or mid-close warm intimate frame. Cultural / natural detail rich. Cozy pantheon-specific. Painterly polish.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
