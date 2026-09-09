const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_orchard_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_orchard_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE ORCHARD (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the trees as the unmistakable
hero of the frame, warm dappled light exactly as described, gallery
quality`;
};
