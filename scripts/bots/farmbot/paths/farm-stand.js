const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_farm_stand_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_farm_stand_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE FARM STAND (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the stand as the unmistakable
hero of the frame, warm and inviting under the light described, gallery
quality`;
};
