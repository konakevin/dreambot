/**
 * TitanBot deity-moment path — god/titan in divine-action moment.
 * Pantheon-diverse, never named.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const deity = picker.pickWithRecency(pools.DEITIES, 'deity');
  const regalia = picker.pickWithRecency(pools.PANTHEONS_AND_REGALIA, 'regalia');
  const landscape = picker.pickWithRecency(pools.MYTHOLOGICAL_LANDSCAPES, 'mythic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a mythology concept-art painter writing DEITY MOMENT scenes for TitanBot — god/titan in divine-action moment. Pantheon-diverse, by role only. Output wraps with style prefix + suffix.

${blocks.MYTHIC_SCALE_BLOCK}

${blocks.PANTHEON_DIVERSITY_BLOCK}

${blocks.NO_NAMED_DEITIES_BLOCK}

${blocks.RENAISSANCE_CONCEPT_ART_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DEITY ━━━
${deity}

━━━ REGALIA / CULTURAL ANCHOR ━━━
${regalia}

━━━ MYTHIC SETTING ━━━
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
Mid-close heroic frame. Deity dominant at cosmic scale. Action-moment captured. Divine lighting + atmosphere. Painterly Renaissance polish.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
