const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_evening_chores_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_evening_chores_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE EVENING MOMENT (the hero of the shot) ━━━
${scene}

render every detail named above crisply, gallery quality`;
};
