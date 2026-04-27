/**
 * SirenBot archangel path — Diablo Angiris Council energy.
 * Female warrior angel of light. Wings of pure luminous energy tendrils,
 * ornate golden armor, divine radiance. Tyrael/Auriel/Imperius aesthetic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.ARCHANGEL_SETTINGS, 'archangel_setting');
  const action = picker.pickWithRecency(pools.ARCHANGEL_ACTIONS, 'archangel_action');

  return `You are a celestial cinematographer capturing an ARCHANGEL in her domain of light. She is a warrior angel in the tradition of Diablo's Angiris Council — Tyrael, Auriel, Imperius — but FEMALE. Divine radiance, ornate armor, wings of pure light. She does NOT know she is being filmed. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — ARCHANGEL OF LIGHT ━���━
She is an archangel — a divine warrior of heaven. Her wings are NOT feathered — they are TENDRILS OF PURE LIGHT radiating from her back, like Tyrael's wings in Diablo: luminous ethereal energy streams, flowing and flickering. Her armor is ornate celestial plate — gold, silver, pearl-white — with glowing runes and divine filigree. She may wear a hood or cowl (Tyrael-style) with glowing eyes beneath, or her face may be fully visible with a radiant halo.

She is BEAUTIFUL and POWERFUL — divine feminine warrior, not a gentle cherub. She carries holy weapons: flaming swords, spears of light, shields inscribed with celestial script. Her presence radiates light — everything near her glows.

NOT feathered bird wings. NOT a Victoria's Secret angel. NOT a cute cherub. Her wings are ENERGY — luminous tendrils, streams of holy light radiating outward like solar flares.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MAGICAL ATMOSPHERE ━━━
${sharedDNA.atmosphere}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

━━━ CELESTIAL PALETTE RULES ━━━
Dominant golds, radiant whites, warm amber light. Accent with silver, pearl blue, divine violet. Her light BLEEDS into the environment — volumetric god-rays, lens flare, bloom. Dark environments get illuminated BY her presence.

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize divine radiance, light-tendril wings, celestial armor.`;
};
