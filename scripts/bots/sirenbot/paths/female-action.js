/**
 * SirenBot female-action path — fantasy woman mid-combat / spellcasting.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const action = picker.pickWithRecency(pools.FEMALE_ACTIONS, 'female_action');
  const accessory = picker.pickWithRecency(pools.ACCESSORIES_FEMALE, 'accessory_female');
  const weapon = picker.pickWithRecency(pools.WEAPONS, 'weapon');
  const setting = picker.pickWithRecency(pools.SETTINGS, 'setting');
  const atmosphere = picker.pick(pools.MAGICAL_ATMOSPHERES);

  return `You are a high-fantasy concept artist writing a MID-ACTION scene of a female warrior in dynamic motion. Frozen at the most iconic instant of the moment. Output will be wrapped with style prefix + suffix.

${blocks.CHARACTER_BLOCK}

━━━ SHE IS (race — drives her entire identity) ━━━
${sharedDNA.race}

${blocks.FEMALE_HOTNESS_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

━━━ THE ACTION (captured mid-motion) ━━━
${action}

Dynamic motion — NEVER floating, NEVER static hovering. The moment must feel like a single instant frozen at its peak.

━━━ HER ORNATE DETAILS ━━━
- Accessory / armor highlight: **${accessory}**
- Weapon / focus in use: **${weapon}**

━━━ SETTING (where the action happens) ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${atmosphere}

━━━ COLOR PALETTE FOR THIS RENDER ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. Do not use "pose", "posing", "model", "editorial" — this is a captured MOMENT, not a photo shoot.`;
};
