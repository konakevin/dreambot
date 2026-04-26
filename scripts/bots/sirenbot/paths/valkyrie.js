/**
 * SirenBot valkyrie path — warrior goddess, battlefields, divine power.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.VALKYRIE_SETTINGS, 'valkyrie_setting');
  const action = picker.pickWithRecency(pools.VALKYRIE_ACTIONS, 'valkyrie_action');

  return `You are a battlefield documentarian who has captured a VALKYRIE carrying out her divine duty. She does NOT know she is being observed. She is a divine warrior — half goddess, half soldier. Winged, armored, wielding legendary weapons. She descends from the sky to choose the worthy dead. She is POWER embodied. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — VALKYRIE / WARRIOR GODDESS ━━━
She is a divine warrior of the sky. Large feathered wings (white, gold, grey, black, or blood-red). Nordic-inspired armor — engraved breastplate, fur-lined pauldrons, runic gauntlets, winged helm. Her weapons are legendary: glowing spear, rune-etched sword, divine shield. She is tall, muscular, battle-ready. Her hair is wild from wind and combat (braided, flowing, cropped). Eyes blaze with divine light. She is terrifying and magnificent — a force of nature, not a decorative figure.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize divine power, wingspan, battlefield grandeur.`;
};
