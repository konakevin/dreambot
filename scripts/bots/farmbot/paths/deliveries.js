const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_deliveries_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_deliveries_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE DELIVERY (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the vehicle as the unmistakable
hero of the frame, the figure small and secondary, gallery quality`;
};
