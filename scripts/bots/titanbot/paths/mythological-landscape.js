/**
 * TitanBot mythological-landscape path — sacred mythic realm, no characters.
 * Pantheon diversity.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.MYTHOLOGICAL_LANDSCAPES, 'mythic_landscape');
  const architecture = picker.pickWithRecency(pools.ARCHITECTURAL_ELEMENTS, 'architectural_element');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a mythic landscape painter writing MYTHOLOGICAL LANDSCAPE scenes for TitanBot — sacred mythic realms. No characters. Pantheon-diverse. Output wraps with style prefix + suffix.

${blocks.MYTHIC_SCALE_BLOCK}

${blocks.PANTHEON_DIVERSITY_BLOCK}

${blocks.RENAISSANCE_CONCEPT_ART_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS ━━━
Pure mythic realm. No figures. Landscape is hero.

━━━ THE MYTHIC REALM ━━━
${landscape}

━━━ ARCHITECTURAL ELEMENT (pantheon-specific) ━━━
${architecture}

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
Wide or mid-wide mythic vista. Architecture anchors. Cosmic scale. Renaissance-oil-painting polish.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
