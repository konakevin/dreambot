/**
 * SirenBot mermaid-siren path — coastal sirens on moonlit rocks, wild ocean haunts.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.MERMAID_SIREN_SETTINGS, 'mermaid_siren_setting');
  const moment = picker.pickWithRecency(pools.MERMAID_SIREN_MOMENTS, 'mermaid_siren_moment');
  const features = picker.pickWithRecency(pools.MERMAID_FEATURES, 'mermaid_features');
  const water = picker.pickWithRecency(pools.WATER_CONDITIONS, 'water_condition');

  return `You are a wildlife documentary cinematographer who has captured a SIREN in her natural coastal habitat — moonlit rocks, ocean mist, wild beauty. She does NOT know she is being filmed. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — MERMAID/SIREN ━━━
She is a mermaid — half-woman, half-sea-creature. Her tail is ALWAYS visible and detailed. Hair drifts naturally in water or wind. She is otherworldly — not a woman in a costume, but a being who belongs to the ocean.

━━━ HER FEATURES ━━━
${features}

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${moment}

━━━ SETTING ━━━
${setting}

━━━ WATER + ATMOSPHERE ━━━
${water}

Caustic light ripples, volumetric light shafts, suspended particles, hair drifting in current, soft refraction glow on scales.

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MAGICAL ATMOSPHERE ━━━
${sharedDNA.atmosphere}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble.`;
};
