const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_feeding_time_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_feeding_time_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ FEEDING TIME (the hero of the shot) ━━━
${scene}

render every detail named above crisply, gallery quality`;
};
