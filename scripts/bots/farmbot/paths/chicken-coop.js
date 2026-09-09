const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_chicken_coop_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_chicken_coop_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE COOP (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the coop as the unmistakable
hero of the frame, warm and inviting under the light described, gallery
quality`;
};
