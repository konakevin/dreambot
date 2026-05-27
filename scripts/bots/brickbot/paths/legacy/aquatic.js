// LEGACY — superseded 2026-05-27 by the BRICKBOT_AQUATIC axis-system form at
// paths/aquatic.js. Preserved for reference only (not required anywhere).

const compose = require('../../compose');

const SUBJECT_INTRO = `BEACH / AQUATIC — tropical paradise vibes (no pirates — that's its own path). Snorkelers exploring coral reefs, scuba divers among kelp forests, beach bonfires, surf shacks, lighthouse cliffs, sea turtles + manta rays + mermaids in the deep, beach volleyball, palm-tree boardwalks, sunset beach proposals, dolphins jumping in surf, beach bonfire under stars. Palette: turquoise + coral + ivory sand + jade palm + sunset gold.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'aquatic',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['aquatic'],
    vibeDirective,
    picker,
  });
