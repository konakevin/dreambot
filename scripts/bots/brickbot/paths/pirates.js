const compose = require('../compose');

const SUBJECT_INTRO = `PIRATES — ships, treasure, swashbuckling. Galleons under full sail, pirate captains crossing swords on deck mid-storm, kraken tentacles wrapping around masts, treasure caves with jeweled chests, mutiny scenes, walk-the-plank moments, harbor docks at sunrise, parrot-shoulder portraits, treasure maps with X-marks, ghost ships in fog, harbor ports with smugglers' coves. Palette: weathered wood brown + sail white + gold doubloon + pirate red + tropical turquoise + storm-dark navy.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'pirates',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['pirates'],
    vibeDirective,
    picker,
  });
