/**
 * FaeBot fairy path — tiny winged creatures at flower/mushroom scale.
 * MINIATURE — she is inches tall among enormous flowers and insects.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.FAIRY_SETTINGS, 'fairy_setting');
  const action = picker.pickWithRecency(pools.FAIRY_ACTIONS, 'fairy_action');

  return `You are a macro-lens nature photographer who has captured a TINY FAIRY at flower-and-mushroom scale. She is INCHES TALL — the camera is at her level, making flowers tower above her and dewdrops look like crystal balls. She does NOT know she is being filmed. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — FAIRY (MINIATURE SCALE) ━━━
She is TINY — 3-6 inches tall. The camera is at HER scale, so everything around her is massive: flower petals are platforms, mushroom caps are shelters, dewdrops are her size, insects are companion animals. Her wings are gossamer — dragonfly, butterfly, or moth-patterned, translucent, catching light. She wears petal-dresses, seed-pod armor, spider-silk wraps, acorn caps as helmets, thorn swords. Her skin has a faint shimmer. She leaves a trail of tiny sparks or dust motes.

SCALE IS EVERYTHING — if the scene doesn't read as MINIATURE, it fails. Include scale references: flower stems as thick as her arm, a ladybug nearby for size comparison, sitting on a mushroom cap.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ SEASON ━━━
${sharedDNA.season}

━━━ FOREST LIGHT ━━━
${sharedDNA.light}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize miniature scale, gossamer wings, macro-lens depth of field.`;
};
