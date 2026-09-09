const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_windmill_silo_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_windmill_silo_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE LANDMARK (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the landmark standing tall and
unmistakable against the sky described, gallery quality`;
};
