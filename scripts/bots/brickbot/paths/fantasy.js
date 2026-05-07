const compose = require('../compose');

const SUBJECT_INTRO = `FANTASY / EPIC ADVENTURE — Lord-of-the-Rings / Witcher / Elder Scrolls scale. Castle keeps, wizard towers, ancient ruins, cursed dungeons, ranger encampments, elven cities in trees, dwarven mines, dragon lairs, troll bridges, market squares with fantasy-race vendors, knights questing through dark forests, wizards casting spells, dragons besieging fortresses. Medieval-fantasy palette: muted earth, deep forest greens, candlelit gold, dragon-fire orange, magical transparent-blue glows.`;

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) =>
  compose({
    pathName: 'fantasy',
    subjectIntro: SUBJECT_INTRO,
    sharedDNA,
    pathPools: pools.PER_PATH['fantasy'],
    vibeDirective,
    picker,
  });
