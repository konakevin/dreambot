/**
 * DragonBot mythic-bestiary path (2026-06-10, NEW, Tier 2). A hero portrait of
 * ONE great non-dragon mythic creature (griffon, kraken, phoenix, hydra, etc.).
 * Default painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'MYTHIC_BESTIARY',
  pools: {
    creature: 'BESTIARY_CREATURE',
    creature_action: 'BESTIARY_ACTION',
    habitat: 'BESTIARY_HABITAT',
    encounter: 'BESTIARY_ENCOUNTER',
    drama: 'BESTIARY_DRAMA', // 40% gated conditional
  },
};
