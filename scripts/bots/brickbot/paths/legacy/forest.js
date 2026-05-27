// LEGACY — superseded 2026-05-27 by the BRICKBOT_FOREST axis-system form at
// paths/forest.js. Preserved for reference only (not required anywhere).
//
// Why retired: this legacy compose() form rendered PHOTOREAL forests (real
// birch trunks, real leaf-litter — Kevin flagged 2026-05-27). The nature-prose
// SUBJECT_INTRO below + the legacy forest_scenes pool fed Flux real-botanical
// vocabulary that overrode the brick framing. The axis-system migration fixes
// this via per-element brick-mandate + register lock + banned botanical vocab.

const compose = require('../../compose');

const SUBJECT_INTRO = `FOREST / FAIRY — whimsical magical woodland (peaceful, not LOTR-epic — that's fantasy path). Mushroom houses, fairy-light tree hollows, woodland fairies fluttering, moss-covered ruins, deer + owl + fox minifigs, hidden grotto pools, firefly clouds, forest campsites with tents and lanterns, treehouse villages, hobbit-style burrows, bridges over rushing streams, wildflower meadows at edge of forest. Palette: deep forest green + golden dappled light + fairy-glow transparent-cyan + warm tent-canvas + bark brown + mushroom red.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'forest',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['forest'],
    vibeDirective,
    picker,
  });
