const compose = require('../compose');

const SUBJECT_INTRO = `LANDSCAPE / EPIC SCENERY — EarthBot-style natural vistas rendered entirely in brick. Mountain ranges with snowcaps and clouds, glacier-carved valleys, redwood old-growth forests, desert canyons at golden hour, coastal cliffs above crashing surf, alpine meadows with wildflower carpets, stormy ocean from a beach, sequoia groves, plateau mesas, river deltas, savanna at sunrise, frozen waterfalls. The world is the subject; minifigs (if present) are scale references — tiny hikers, photographers, climbers — never the focus. Brick rocks, brick water, brick clouds, all built from real LEGO pieces.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'landscape',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['landscape'],
    vibeDirective,
    picker,
  });
