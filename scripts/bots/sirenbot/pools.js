/**
 * SirenBot — axis pools.
 *
 * All rolled axes are 50-entry Sonnet-seeded pools loaded from seeds/*.json.
 * Regenerate any pool:
 *
 *     node scripts/gen-seeds/sirenbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8')
  );
}

module.exports = {
  RACES: load('races'),
  SCENE_PALETTES: load('scene_palettes'),
  MAGICAL_ATMOSPHERES: load('magical_atmospheres'),
  FEMALE_POSES: load('female_poses'),
  MALE_POSES: load('male_poses'),
  FEMALE_ACTIONS: load('female_actions'),
  MALE_ACTIONS: load('male_actions'),
  EXPRESSIONS: load('expressions'),
  ACCESSORIES_FEMALE: load('accessories_female'),
  ACCESSORIES_MALE: load('accessories_male'),
  WEAPONS: load('weapons'),
  SETTINGS: load('settings'),
  FACIAL_FEATURES: load('facial_features'),
  SEDUCTIVE_MOMENTS: load('seductive_moments'),
};
