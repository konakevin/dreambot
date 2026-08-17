/**
 * FaeBot spirit-beasts — enchanted ANIMALS as heroes (Stage F3). A white stag
 * with blossoming antlers, a moss-backed bear, an ember-tail fox, a luminous
 * owl. NOT beast-men. The kodama law: real animal anatomy carries it (never
 * anthropomorphized, never a face-graft), exactly ONE magical element per beast.
 * The magical_tell axis is the money-shot. Full-bespoke pools.
 */

module.exports = {
  archetype: 'FAEBOT_SPIRIT_BEASTS',
  pools: {
    spirit_beast: 'FAEBOT_SPIRIT_BEASTS_BEAST',
    candid_action: 'FAEBOT_SPIRIT_BEASTS_ACTION',
    beast_domain: 'FAEBOT_SPIRIT_BEASTS_DOMAIN',
    magical_tell: 'FAEBOT_SPIRIT_BEASTS_TELL',
    lighting: 'FAEBOT_SPIRIT_BEASTS_LIGHTING',
    weather: 'FAEBOT_SPIRIT_BEASTS_WEATHER',
    witness: 'FAEBOT_SPIRIT_BEASTS_WITNESS',
  },
};
