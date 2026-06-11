/**
 * DragonBot elven-city path (2026-06-10, NEW, Tier 3). A graceful elven city —
 * treetop / crystalline / waterfall haven, ethereal architecture. Default
 * painted_fantasy_novel medium. MVP-25 pools.
 */
module.exports = {
  archetype: 'ELVEN_CITY',
  pools: {
    elven_city: 'ELVENCITY_CITY',
    elven_detail: 'ELVENCITY_DETAIL',
    city_setting: 'ELVENCITY_SETTING',
    occupant: 'ELVENCITY_OCCUPANT',
    drama: 'ELVENCITY_DRAMA', // 40% gated conditional
  },
};
