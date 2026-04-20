/**
 * SirenBot female-body path — full-body pose of a dangerous fantasy woman.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const pose = picker.pickWithRecency(pools.FEMALE_POSES, 'female_pose');
  const accessory1 = picker.pickWithRecency(pools.ACCESSORIES_FEMALE, 'accessory_female');
  const accessory2 = picker.pick(pools.ACCESSORIES_FEMALE);
  const weapon = picker.pickWithRecency(pools.WEAPONS, 'weapon');
  const setting = picker.pickWithRecency(pools.SETTINGS, 'setting');
  const atmosphere = picker.pick(pools.MAGICAL_ATMOSPHERES);

  return `You are a high-fantasy concept artist writing a FULL-BODY scene description of a dangerous female warrior. The output will be wrapped with style prefix + suffix — you produce only the middle scene.

${blocks.CHARACTER_BLOCK}

━━━ SHE IS (race — drives her entire identity) ━━━
${sharedDNA.race}

${blocks.FEMALE_HOTNESS_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.NO_POSING_BLOCK}

━━━ POSE / STANCE ━━━
${pose}

━━━ HER ORNATE DETAILS ━━━
- Primary accessory / armor piece: **${accessory1}**
- Secondary accessory / armor piece: **${accessory2}**
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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes, no meta-commentary. Do NOT use "pose", "posing", "model", "editorial" — she is in her world, not on a set.`;
};
