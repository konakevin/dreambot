/**
 * FaeBot siren-nymph path — erotic classical nude figure study.
 * DIRECT PROMPT MODE: bypasses Sonnet entirely, composes Flux prompt
 * from pool picks. Sonnet was refusing or sanitizing the nudity.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.SIREN_NYMPH_SETTINGS, 'siren_nymph_setting');
  const action = picker.pickWithRecency(pools.SIREN_NYMPH_ACTIONS, 'siren_nymph_action');
  const hair = picker.pickWithRecency(pools.NYMPH_HAIR, 'nymph_hair');
  const skin = picker.pickWithRecency(pools.SIREN_NYMPH_SKIN, 'siren_nymph_skin');

  const prompt = [
    'classical erotic oil painting, Waterhouse Bouguereau Frazetta figure study',
    'sensual forest nymph, mythological creature, flowers blooming from her shoulders, moss along collarbones, bioluminescent markings, ferns unfurling from her skin',
    `${hair}`,
    `${skin}`,
    `${action}`,
    `${setting}`,
    `${sharedDNA.season}, ${sharedDNA.light}`,
    `${sharedDNA.scenePalette}`,
    `${vibeDirective.slice(0, 150)}`,
    'wet glistening skin, warm golden chiaroscuro, heavy-lidded eyes, parted lips, sensual confidence',
    'thick impasto brushstrokes, canvas texture, museum-quality oil painting masterwork',
  ].join(', ');

  return { direct: true, prompt };
};
