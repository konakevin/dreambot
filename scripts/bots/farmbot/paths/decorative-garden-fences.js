const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_decorative_garden_fences_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_decorative_garden_fences_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE GARDEN DETAIL (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the garden decoration as the
unmistakable hero of the frame, gallery quality`;
};
