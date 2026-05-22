/**
 * YumBot rainbow-dreamscape path — v3 shared-catalog refactor (2026-05-20).
 *
 * Kawaii-faced food/drink containers SITTING IN A wider pastel dreamscape
 * landscape with rainbows pouring out of cups or arching overhead.
 *
 * v3 refactor: food / environment / decor / companions now sourced from
 * shared YUMBOT catalogs with WORLD_FIT tag filter. Uniform random per
 * render — no Sonnet bias.
 *
 * 9 path-bespoke axes. 5 foods + 3 environment + 3 decor + 2 companions
 * picked per render; rest are single-pick path-bespoke pools.
 */

module.exports = {
  archetype: 'YUMBOT_RAINBOW_DREAMSCAPE',
  pools: {
    // Shared catalogs — filtered by RAINBOW_DREAMSCAPE tag
    food_inhabitants: { name: 'FOOD_CATALOG', tags: ['RAINBOW_DREAMSCAPE'] },
    environment: { name: 'LANDSCAPE_FEATURES', tags: ['RAINBOW_DREAMSCAPE'] },
    decor: { name: 'DECOR_ITEMS', tags: ['RAINBOW_DREAMSCAPE'] },
    companions: { name: 'TINY_COMPANIONS', tags: ['RAINBOW_DREAMSCAPE'] },

    // Path-bespoke pools (rainbow-dreamscape-specific)
    dreamscape_setting: 'DREAM_SETTING',
    rainbow_element: 'DREAM_RAINBOW_ELEMENT',
    sky_atmosphere: 'DREAM_SKY_ATMOSPHERE',
    camera: 'DREAM_CAMERA',
    lighting: 'DREAM_LIGHTING',
    night_mode: 'KAWAII_NIGHT_AUGMENT',
  },
};
