/**
 * FaeBot nymph path — lifted directly from SirenBot's forest-nymph.
 * Woodland spirits in enchanted groves, living nature, the generalist forest being.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.NYMPH_SETTINGS, 'nymph_setting');
  const action = picker.pickWithRecency(pools.NYMPH_ACTIONS, 'nymph_action');
  const hair = picker.pickWithRecency(pools.NYMPH_HAIR, 'nymph_hair');
  const skin = picker.pickWithRecency(pools.NYMPH_SKIN, 'nymph_skin');

  return `You are a nature cinematographer who has captured a FOREST NYMPH in her woodland habitat. She does NOT know she is being filmed. She is a spirit of the forest — part woman, part living nature. She is the forest made conscious. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — FOREST NYMPH ━━━
She is NOT a human woman. She is a forest CREATURE — her body is literally made of living nature. Flowers blooming from her shoulders and spine, delicate moss along her collarbones, bioluminescent markings that glow, tiny ferns unfurling from her skin. She is as much plant as she is flesh. Beautiful, feminine, stunning — but unmistakably inhuman. The forest grows FROM her, not just around her.

━━━ HER SPECIFIC HAIR + EYES (use EXACTLY as written) ━━━
${hair}

━━━ HER SPECIFIC SKIN + GLOW + COVERINGS (use EXACTLY as written) ━━━
${skin}

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

${blocks.LIVING_NATURE_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ SEASON ━━━
${sharedDNA.season}

━━━ FOREST LIGHT ━━━
${sharedDNA.light}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize living nature textures, dappled forest light, organic beauty.`;
};
