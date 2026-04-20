/**
 * SirenBot male-body path — menacing warlord full-body pose.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const pose = picker.pickWithRecency(pools.MALE_POSES, 'male_pose');
  const accessory1 = picker.pickWithRecency(pools.ACCESSORIES_MALE, 'accessory_male');
  const accessory2 = picker.pick(pools.ACCESSORIES_MALE);
  const weapon = picker.pickWithRecency(pools.WEAPONS, 'weapon');
  const setting = picker.pickWithRecency(pools.SETTINGS, 'setting');
  const atmosphere = picker.pick(pools.MAGICAL_ATMOSPHERES);

  return `You are a high-fantasy concept artist writing a FULL-BODY scene of a menacing male warrior. Output will be wrapped with style prefix + suffix.

${blocks.CHARACTER_BLOCK}

━━━ HE IS (race — drives his entire identity) ━━━
${sharedDNA.race}

${blocks.MALE_WARLORD_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_POSING_BLOCK}

━━━ POSE / STANCE ━━━
${pose}

━━━ HIS ORNATE DETAILS ━━━
- Primary armor / accessory: **${accessory1}**
- Secondary accessory / trophy: **${accessory2}**
- Signature weapon nearby or in hand: **${weapon}**

━━━ SETTING ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${atmosphere}

━━━ COLOR PALETTE FOR THIS RENDER ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. Do NOT use "pose", "posing", "editorial", "photo shoot" — he is in his world, not on a set.`;
};
