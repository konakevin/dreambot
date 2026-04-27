/**
 * SirenBot dragon-woman path — half-dragon hybrids, scales and wings, volcanic lairs.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.DRAGON_WOMAN_SETTINGS, 'dragon_woman_setting');
  const action = picker.pickWithRecency(pools.DRAGON_WOMAN_ACTIONS, 'dragon_woman_action');

  return `You are a field researcher who has documented a DRAGON-WOMAN in her volcanic territory. She does NOT know she is being observed. She is a half-dragon hybrid — human torso and face with dragon features woven throughout. Scales, horns, wings, claws, slit-pupil eyes, possibly a tail. She radiates HEAT and POWER. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — DRAGON WOMAN / HALF-DRAGON ━━━
She is a dragon-human hybrid. Her skin transitions between smooth and scaled — patches of iridescent dragon scales across shoulders, spine, hips, forearms. She has small to medium horns (curved, ridged, jewel-toned), slit-pupil eyes (gold, ember, green, violet), sharp features, and clawed fingertips. Wings are optional but when present they are leathery and detailed. Her natural coverings are scale-armor that grows from her own body, supplemented with forged metal and gemstones. She emanates faint heat shimmer. Powerful, proud, primal.

${blocks.BEAUTY_BLOCK}

${blocks.ORNATE_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${sharedDNA.atmosphere}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize scale textures, heat shimmer, draconic power.`;
};
