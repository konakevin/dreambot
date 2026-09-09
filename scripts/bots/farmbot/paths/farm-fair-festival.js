const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_farm_fair_festival_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_farm_fair_festival_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE FESTIVAL (the hero of the shot) ━━━
${scene}

render every detail named above crisply, any figures small and secondary
to the wider scene, gallery quality`;
};
