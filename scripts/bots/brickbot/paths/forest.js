const compose = require('../compose');

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
