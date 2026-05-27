// LEGACY — superseded 2026-05-27 by the BRICKBOT_THEME_PARK axis-system form
// at paths/theme-park.js. Preserved for reference only (not required anywhere).

const compose = require('../../compose');

const SUBJECT_INTRO = `THEME PARK / CARNIVAL — roller coasters mid-loop, ferris wheels lit at dusk, carousels with horse minifigs frozen mid-spin, candy-color food carts, midway games, haunted-house attractions, summer-night neon, fireworks bursts above attractions, cotton-candy stands, mini-golf courses, parade floats, water-park slides, theme park hotels with monorail trains. Tons of crowd minifigs in motion. Palette: neon transparent reds/blues/yellows + candy pink + popcorn cream + carnival-stripe + summer-night navy sky.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'theme-park',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['theme-park'],
    vibeDirective,
    picker,
  });
