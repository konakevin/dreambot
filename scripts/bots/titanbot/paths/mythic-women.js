/**
 * TitanBot mythic-women path — mythic female in candid unsuspecting moment.
 * REALLY FUCKING SEXY + cool-looking. Voyeuristic "caught her" angle. Solo.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.MYTHIC_WOMEN_CANDID_MOMENTS, 'mythic_woman_moment');
  const landscape = picker.pickWithRecency(pools.MYTHOLOGICAL_LANDSCAPES, 'mythic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a mythic-portrait painter writing MYTHIC WOMAN CANDID scenes for TitanBot. Any mythic female in candid unsuspecting moment, doing a specific action. Sexy + cool-looking via CANDID composition (not posed). SOLO. Output wraps with style prefix + suffix.

${blocks.MYTHIC_SCALE_BLOCK}

${blocks.PANTHEON_DIVERSITY_BLOCK}

${blocks.NO_NAMED_DEITIES_BLOCK}

${blocks.RENAISSANCE_CONCEPT_ART_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.MYTHIC_WOMAN_CANDID_BLOCK}

━━━ THE CANDID MOMENT ━━━
${moment}

━━━ SETTING ━━━
${landscape}

━━━ LIGHTING (classical-painterly preferred) ━━━
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
Voyeuristic "caught-her" framing. She is DOING a specific action, unaware of viewer. Candid not posed. Classical oil-painting nude tradition (tasteful, painterly). Solo — no men, no second figure.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
