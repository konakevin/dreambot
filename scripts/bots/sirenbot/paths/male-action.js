/**
 * SirenBot male-action path — warlord mid-combat.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const action = picker.pickWithRecency(pools.MALE_ACTIONS, 'male_action');
  const accessory = picker.pickWithRecency(pools.ACCESSORIES_MALE, 'accessory_male');
  const weapon = picker.pickWithRecency(pools.WEAPONS, 'weapon');
  const setting = picker.pickWithRecency(pools.SETTINGS, 'setting');
  const atmosphere = picker.pick(pools.MAGICAL_ATMOSPHERES);

  return `You are a high-fantasy concept artist writing a MID-ACTION scene of a menacing male warrior in dynamic motion. Frozen at the most iconic instant of the moment. Output will be wrapped with style prefix + suffix.

${blocks.CHARACTER_BLOCK}

━━━ HE IS (race — drives his entire identity) ━━━
${sharedDNA.race}

${blocks.MALE_WARLORD_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

━━━ THE ACTION (captured mid-motion) ━━━
${action}

Dynamic motion — NEVER floating, NEVER static hovering. Visceral, mid-swing, mid-strike, mid-push-off. A single moment frozen at peak intensity.

━━━ HIS ORNATE DETAILS ━━━
- Accessory / armor highlight: **${accessory}**
- Weapon in use: **${weapon}**

━━━ SETTING (where the combat happens) ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${atmosphere}

━━━ COLOR PALETTE FOR THIS RENDER ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated. No "pose", no "model" language. Captured moment, not photo shoot.`;
};
