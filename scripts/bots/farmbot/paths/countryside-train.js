const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_countryside_train_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_countryside_train_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE TRAIN / TRACK (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the train or track as the
unmistakable hero of the frame, gallery quality`;
};
