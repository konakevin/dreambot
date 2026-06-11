/**
 * DragonBot magic-unleashed path (2026-06-10, NEW, Tier 2). A colossal spell
 * event — a wizard unleashing world-shaking high-fantasy magic. The arcane
 * spectacle is the hero. Default painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'MAGIC_UNLEASHED',
  pools: {
    spell_event: 'MAGIC_SPELL_EVENT',
    caster: 'MAGIC_CASTER',
    magic_effect: 'MAGIC_EFFECT',
    setting: 'MAGIC_SETTING',
    drama: 'MAGIC_DRAMA', // 40% gated conditional
  },
};
