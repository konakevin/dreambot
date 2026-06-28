/**
 * ChibiBot creature-amusement-park path (2026-06-28).
 *
 * One of 6 per-setting "creature-outing" paths promoted from the creature-
 * adventures catch-all. A band of chibi creature friends out at a real-world
 * amusement park (rides, game booths, midway). Full bespoke multi-axis system
 * via the shared CHIBIBOT_CREATURE_OUTING archetype/template: the creature band
 * rolls from the shared unified pool; activity / setting_detail / prop / surprise
 * are amusement-park-bespoke.
 */

module.exports = {
  archetype: 'CHIBIBOT_CREATURE_OUTING',
  pools: {
    creature_group: { name: 'CUTE_CREATURES_UNIFIED' },
    activity: 'CHIBIBOT_AMUSEMENT_PARK_ACTIVITY',
    setting_detail: 'CHIBIBOT_AMUSEMENT_PARK_DETAIL',
    prop: 'CHIBIBOT_AMUSEMENT_PARK_PROP',
    surprise_element: 'CHIBIBOT_AMUSEMENT_PARK_SURPRISE',
  },
};
