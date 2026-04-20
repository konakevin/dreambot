/**
 * SirenBot female-face path — closeup portrait of a dangerous fantasy woman.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const expression = picker.pickWithRecency(pools.EXPRESSIONS, 'expression');
  const facialFeature = picker.pickWithRecency(pools.FACIAL_FEATURES, 'facial_feature');
  const accessory = picker.pickWithRecency(pools.ACCESSORIES_FEMALE, 'accessory_female');
  const setting = picker.pickWithRecency(pools.SETTINGS, 'setting');
  const atmosphere = picker.pick(pools.MAGICAL_ATMOSPHERES);

  return `You are a high-fantasy concept artist writing a CLOSE-UP portrait of a dangerous fantasy woman. Face + shoulders fill the frame. Output will be wrapped with style prefix + suffix.

${blocks.CHARACTER_BLOCK}

━━━ SHE IS (race — drives her entire identity) ━━━
${sharedDNA.race}

${blocks.FEMALE_HOTNESS_BLOCK}

━━━ HER FACIAL EXPRESSION ━━━
${expression}

━━━ DISTINCTIVE FACIAL / MAGICAL FEATURE ━━━
${facialFeature}

━━━ ACCESSORY / ORNAMENT VISIBLE IN CLOSEUP ━━━
${accessory}

━━━ BACKDROP (blurred / out of focus behind her face) ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${atmosphere}

━━━ COLOR PALETTE FOR THIS RENDER ━━━
${sharedDNA.scenePalette}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_POSING_BLOCK}

━━━ FRAMING ━━━
Head-and-shoulders closeup OR three-quarter bust. Face dominates frame. NEVER show full body. No legs, no hips. Focus on expression, eyes, and magical features.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-80 word scene description. Comma-separated phrases. No "pose", no "portrait session", no "fashion shoot" — she is simply there and we are close.`;
};
