const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_laundry_day_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_laundry_day_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ LAUNDRY DAY (the hero of the shot) ━━━
${scene}

render every detail named above crisply, gallery quality`;
};
