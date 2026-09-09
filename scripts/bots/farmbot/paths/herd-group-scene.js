const { lookOverride } = require('../shared-blocks');
const SPECIES_GROUPS = require('../seeds/farmbot_herd_group_species.json');
const SETTINGS = require('../seeds/farmbot_hero_animal_setting.json');

module.exports = ({ sharedDNA, picker }) => {
  const group = picker.pickWithRecency(SPECIES_GROUPS, 'farmbot_herd_group_species');
  const setting = picker.pickWithRecency(SETTINGS, 'farmbot_herd_group_setting');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE HERD (the hero of the shot) ━━━
${group}

━━━ WHERE ━━━
${setting}

render the group as the clear hero of the frame, full of charm and gentle
character, the setting rendered just as lovingly and richly detailed — a
true costar, not a backdrop — gallery quality`;
};
