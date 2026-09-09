const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_duck_pond_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_duck_pond_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE POND (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the water as the unmistakable
hero of the frame, its surface and light exactly as described, gallery
quality`;
};
