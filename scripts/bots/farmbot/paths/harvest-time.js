const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_harvest_time_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_harvest_time_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE HARVEST (the hero of the shot) ━━━
${scene}

render every detail named above crisply, gallery quality`;
};
