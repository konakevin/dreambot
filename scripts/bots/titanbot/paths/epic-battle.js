/**
 * TitanBot epic-battle path — cosmic-scale mythic battle.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const battle = picker.pickWithRecency(pools.EPIC_BATTLES, 'epic_battle');
  const landscape = picker.pickWithRecency(pools.MYTHOLOGICAL_LANDSCAPES, 'mythic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a mythic-battle concept-art painter writing COSMIC MYTHIC BATTLE scenes for TitanBot. Sky-splitting scale. By role only. Output wraps with style prefix + suffix.

${blocks.MYTHIC_SCALE_BLOCK}

${blocks.PANTHEON_DIVERSITY_BLOCK}

${blocks.NO_NAMED_DEITIES_BLOCK}

${blocks.RENAISSANCE_CONCEPT_ART_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE EPIC BATTLE ━━━
${battle}

━━━ SETTING ━━━
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
Wide dynamic frame capturing peak battle moment. Cosmic scale — landscapes shattering under the weight of gods. Painterly Renaissance polish.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
