const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_crop_fields_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_crop_fields_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE FIELD (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the field as the unmistakable
hero of the frame, its light and texture exactly as described, gallery
quality`;
};
