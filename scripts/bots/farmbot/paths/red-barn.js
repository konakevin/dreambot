/**
 * FarmBot — red-barn (Place). The barn is always the hero; an animal may
 * appear incidentally but never upstages it (baked into the seed pool).
 */

const { lookOverride } = require('../shared-blocks');

const SCENES = require('../seeds/farmbot_red_barn_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_red_barn_scene');

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE BARN (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the barn as the unmistakable hero
of the frame, warm and inviting under the light described, no text, no
words, no watermarks, gallery quality`;
};
