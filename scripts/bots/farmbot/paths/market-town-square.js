const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_market_town_square_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_market_town_square_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE MARKET SQUARE (the hero of the shot) ━━━
${scene}

render every detail named above crisply, the square as the unmistakable
hero of the frame, any figures small and secondary to the wider scene,
gallery quality`;
};
