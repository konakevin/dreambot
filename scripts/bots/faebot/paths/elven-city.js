/**
 * FaeBot elven-city path (2026-06-10, recreated from DragonBot's elven-city —
 * Kevin hearted those white ethereal elven castles). A graceful white elven
 * spired city with a FAE touch (fairy-motes, glowing lanterns, sprites among
 * the elves), in FaeBot's painterly register. Self-contained axes. MVP-25.
 */
module.exports = {
  archetype: 'FAEBOT_ELVEN_CITY',
  pools: {
    elven_city: 'FAEBOT_ELVEN_CITY_CITY',
    elven_detail: 'FAEBOT_ELVEN_CITY_DETAIL',
    city_setting: 'FAEBOT_ELVEN_CITY_SETTING',
    fae_inhabitants: 'FAEBOT_ELVEN_CITY_INHABITANTS',
    fae_lighting: 'FAEBOT_ELVEN_CITY_LIGHTING',
    drama: 'FAEBOT_ELVEN_CITY_DRAMA', // 40% gated conditional
  },
};
