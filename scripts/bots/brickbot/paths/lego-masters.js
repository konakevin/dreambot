const compose = require('../compose');

const SUBJECT_INTRO = `LEGO MASTERS FINALE BUILD — a single hero showcase build of the kind featured in finale episodes of the LEGO Masters TV show. Themed narrative builds: "the moment a mountain village erupts into chaos as the dragon lands," "a steampunk submarine breaching the deep with a kraken," "a multi-story doll-house cross-section showing tragedy on each floor," etc. Single dramatic centerpiece, dramatic finale-reveal lighting (theater spotlight + atmospheric haze + base-glow), turntable composition. Minifigs in mid-action telling the build's story.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'lego-masters',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['lego-masters'],
    vibeDirective,
    picker,
  });
