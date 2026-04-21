/**
 * TitanBot mythic-creature path — GNARLY visceral mythic creatures.
 * Never cute — always ancient + powerful + gnarly.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.MYTHIC_CREATURES, 'mythic_creature');
  const landscape = picker.pickWithRecency(pools.MYTHOLOGICAL_LANDSCAPES, 'mythic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a mythic creature concept-art painter writing GNARLY MYTHIC CREATURE scenes for TitanBot. Ancient + powerful + visceral. Bloodborne-meets-myth. Never cute. Output wraps with style prefix + suffix.

${blocks.MYTHIC_SCALE_BLOCK}

${blocks.PANTHEON_DIVERSITY_BLOCK}

${blocks.RENAISSANCE_CONCEPT_ART_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MYTHIC CREATURE (hero) ━━━
${creature}

━━━ SETTING CONTEXT ━━━
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
Mid or mid-close frame. Creature dominates. Scale communicated via landscape. Painterly detail on skin / scales / fur / features. Gnarly but beautifully rendered.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
