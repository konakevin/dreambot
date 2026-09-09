/**
 * FarmBot — hero-animal-spotlight (Creature). ONE animal, close-up,
 * character-forward. Species + setting + action roll independently so the
 * same animal is never locked to one enclosure or a static pose.
 */

const { lookOverride } = require('../shared-blocks');

const SPECIES = require('../seeds/farmbot_animal_species.json');
const SETTINGS = require('../seeds/farmbot_hero_animal_setting.json');
const ACTIONS = require('../seeds/farmbot_hero_animal_action.json');

module.exports = ({ sharedDNA, picker }) => {
  const species = picker.pickWithRecency(SPECIES, 'farmbot_hero_species');
  const setting = picker.pickWithRecency(SETTINGS, 'farmbot_hero_setting');
  const action = picker.pickWithRecency(ACTIONS, 'farmbot_hero_action');

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE HERO ANIMAL (the unmistakable star of the shot — close-up, character-forward) ━━━
${species}

━━━ WHAT IT'S DOING ━━━
${action}

━━━ WHERE ━━━
${setting}

render the animal as the clear hero of the frame, full of personality and
charm, the setting rendered just as lovingly and richly detailed — a true
costar, not a backdrop — no text, no words, no watermarks, gallery quality`;
};
