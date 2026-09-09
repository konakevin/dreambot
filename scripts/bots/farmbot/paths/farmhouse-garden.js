const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_farmhouse_garden_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_farmhouse_garden_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE FARMHOUSE (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the house as the unmistakable
hero of the frame, warm and inviting under the light described, gallery
quality`;
};
