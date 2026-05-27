// LEGACY — superseded 2026-05-27 by the BRICKBOT_MECH axis-system form at
// paths/mech.js. Preserved for reference only (not required anywhere).

const compose = require('../../compose');

const SUBJECT_INTRO = `MECH / GIANT ROBOTS — towering mech suits, transformers, exo-armor pilots, mecha hangars with maintenance crews, battle-damaged mechs in junkyards, classic Bionicle/Hero Factory builds, Pacific-Rim-scale war machines, anime-mecha cockpit reveals, robot uprisings, mech-vs-mech duels, technic-beam framework details visible. Palette: industrial gunmetal + warning-yellow + transparent-cyan power cores + rust accents + neon-orange exhausts + military camo greens.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'mech',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['mech'],
    vibeDirective,
    picker,
  });
