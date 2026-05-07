const compose = require('../compose');

const SUBJECT_INTRO = `MACRO DISPLAY BUILD — pulled-back wide-camera view of an entire LEGO diorama on a tabletop. The kind of build that wins LEGO conventions: ski village, mars colony, ocean port, medieval castle siege, theme park layout, mountain pass with cable car, etc. The whole scene is in frame; you can see the build as a complete miniature world. Edge baseplates often visible. Builder's-eye-view of a finished masterpiece.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'macro-display',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['macro-display'],
    vibeDirective,
    picker,
  });
