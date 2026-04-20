/**
 * SirenBot female-seductive path — female warrior in a sensual fantasy moment.
 * Mythic fine-art aesthetic, never pornographic. Rated R tasteful fantasy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.SEDUCTIVE_MOMENTS, 'seductive_moment');
  const accessory = picker.pickWithRecency(pools.ACCESSORIES_FEMALE, 'accessory_female');
  const setting = picker.pickWithRecency(pools.SETTINGS, 'setting');
  const atmosphere = picker.pick(pools.MAGICAL_ATMOSPHERES);

  return `You are a high-fantasy concept artist writing a SENSUAL-MYTHIC scene of a dangerous fantasy woman. Think Pre-Raphaelite painting, Frank Frazetta barbarian-queen art, Magic: the Gathering card art. Beautiful, mysterious, dangerous. Never pornographic. Output will be wrapped with style prefix + suffix.

${blocks.CHARACTER_BLOCK}

━━━ SHE IS (race — drives her entire identity) ━━━
${sharedDNA.race}

${blocks.FEMALE_HOTNESS_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

━━━ THE MOMENT ━━━
${moment}

━━━ HER ORNATE DETAILS ━━━
Accessory / armor visible: **${accessory}**

━━━ SETTING ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${atmosphere}

━━━ COLOR PALETTE FOR THIS RENDER ━━━
${sharedDNA.scenePalette}

━━━ COVERAGE — STRICT ━━━

Scantily clad is fine (fantasy bikini armor, silk drapery, chainmail-and-lace, diaphanous robes). ALWAYS covered enough to avoid nudity. NO nipples, NO bare breasts, NO exposed genitals. Fantasy-art decorum — suggestive via silhouette, never explicit. Think mythic fine-art oil painting, NOT adult content. Rated R tasteful, not X.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No "pose", "modeling", "editorial". She is living this moment.`;
};
