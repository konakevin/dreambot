const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_market_town_square_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_market_town_square_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE MARKET SQUARE (the hero of the shot, read first) ━━━
Two rules for this scene, essential above everything else described below:
(1) no readable signage of any kind anywhere among the stalls — no price
tags, chalkboards, price boards, or hand-lettered signs. (2) the townsfolk
named in the scene below are a required, clearly visible part of the
shot, not optional background mood — small and secondary to the wider
square, but they must actually appear, unmistakably present.

${scene}

render every detail named above crisply, the square as the unmistakable
hero of the frame. Reminder: the townsfolk must be clearly visible, and
no signage or price tags anywhere, gallery quality`;
};
