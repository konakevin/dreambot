const compose = require('../../compose');

const SUBJECT_INTRO = `SPACE / SCI-FI — alien worlds, starships in dock, mars colonies, asteroid mining stations, command bridges, hangar bays, alien encounters, EVA spacewalks, lunar bases, cosmic phenomena (nebula skies, ringed-planet horizons), retro-futurism vs hard-sci-fi mix. Classic LEGO Space themes welcome: Blacktron, M-Tron, Ice Planet, Galaxy Squad. Palette: cosmic blues + chrome silver + neon transparent-yellow/red panels + plasma-magenta accents.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'space',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['space'],
    vibeDirective,
    picker,
  });
