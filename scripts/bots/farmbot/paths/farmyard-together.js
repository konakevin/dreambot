const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_farmyard_together_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_farmyard_together_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE FARMYARD TOGETHER (the hero of the shot) ━━━
${scene}

render every animal named above crisply, each one clearly itself, sharing
the frame naturally, gallery quality`;
};
