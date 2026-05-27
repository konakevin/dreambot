// LEGACY — superseded 2026-05-27 by the BRICKBOT_WESTERN axis-system form at
// paths/western.js. Preserved for reference only (not required anywhere).

const compose = require('../../compose');

const SUBJECT_INTRO = `WESTERN / FRONTIER — cowboys, sheriffs, outlaws, prospectors, native scouts, stagecoaches, steam locomotives, saloons, ghost towns, mining camps, badlands canyons, mesa formations, dusty cattle drives, gunfights at high noon, train robberies, gold rush boom-towns. Earth-tone palette: rust, ochre, sun-bleached wood, dusty leather, sagebrush green. Brick desert terrain with cactus pieces, sandstone canyon walls.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'western',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['western'],
    vibeDirective,
    picker,
  });
