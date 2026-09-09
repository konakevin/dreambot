const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_quiet_rainy_day_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_quiet_rainy_day_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE RAINY MOMENT (the hero of the shot) ━━━
${scene}

render every detail named above crisply, gallery quality`;
};
