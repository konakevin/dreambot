// LEGACY — superseded 2026-05-27 by the BRICKBOT_WINTER axis-system form at
// paths/winter.js. Preserved for reference only (not required anywhere).

const compose = require('../../compose');

const SUBJECT_INTRO = `SNOW / WINTER — ski lodges, alpine villages, frozen lakes, blizzard rescues, ice castles, snowman-building scenes, ice-fishing huts, skiers on powder slopes, hot-cocoa-by-the-fire interiors, husky-pulled sleds, frozen waterfalls, polar research stations, igloo encampments, transparent-blue ice pieces, white snow drifts on every surface. Palette: ice blue + silver + snow white + pine green + cabin red + warm hearth-amber.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'winter',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['winter'],
    vibeDirective,
    picker,
  });
