// LEGACY — superseded 2026-05-27 by the BRICKBOT_GIRLY axis-system form at
// paths/girly.js. Preserved for reference only (not required anywhere).

const compose = require('../../compose');

const SUBJECT_INTRO = `GIRLY / PASTEL TAKEOVER — LEGO Movie ending vibe where the Duplo girls + LEGO Friends + DUPLO Princess sets take over. Pink hearts, unicorns, princesses, ponies, ice-cream parlors, fashion boutiques, sparkle towers, candy castles, pet stores, mermaids, fairy ballerinas. Pastel pinks, lavenders, mint greens, butter yellows, princess golds. Whimsical, joyful, ultra-cute. Friends mini-doll style minifigs allowed alongside regular minifigs.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'girly',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['girly'],
    vibeDirective,
    picker,
  });
