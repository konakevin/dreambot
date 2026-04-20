/**
 * SirenBot male-face path — closeup of a menacing warlord.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const expression = picker.pickWithRecency(pools.EXPRESSIONS, 'expression');
  const facialFeature = picker.pickWithRecency(pools.FACIAL_FEATURES, 'facial_feature');
  const accessory = picker.pickWithRecency(pools.ACCESSORIES_MALE, 'accessory_male');
  const setting = picker.pickWithRecency(pools.SETTINGS, 'setting');
  const atmosphere = picker.pick(pools.MAGICAL_ATMOSPHERES);

  return `You are a high-fantasy concept artist writing a CLOSE-UP portrait of a menacing male warrior. Face + shoulders fill the frame. Output will be wrapped with style prefix + suffix.

${blocks.CHARACTER_BLOCK}

━━━ HE IS (race — drives his entire identity) ━━━
${sharedDNA.race}

${blocks.MALE_WARLORD_BLOCK}

━━━ HIS FACIAL EXPRESSION ━━━
${expression}

━━━ DISTINCTIVE FACIAL / MAGICAL FEATURE ━━━
${facialFeature}

━━━ ACCESSORY / ORNAMENT VISIBLE IN CLOSEUP ━━━
${accessory}

━━━ BACKDROP (blurred / out of focus behind his face) ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${atmosphere}

━━━ COLOR PALETTE FOR THIS RENDER ━━━
${sharedDNA.scenePalette}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_POSING_BLOCK}

━━━ FRAMING ━━━
Head-and-shoulders closeup OR three-quarter bust. Face dominates frame. NEVER show full body. Focus on expression, eyes, scars, and distinctive features.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-80 word scene description. Comma-separated phrases. No "pose" or "portrait session" language.`;
};
