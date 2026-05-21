/**
 * yumbot archetypes — path-bespoke archetype definitions.
 *
 * Each archetype declares which axis slots the path requires + how many
 * to pick per slot. The composer reads this and assembles a brief per
 * the corresponding archetype template in ./archetype-templates.js.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new archetype: add an entry here + the matching template
 * function in ./archetype-templates.js + reference it from one of the
 * bot's path files via { archetype: 'YOUR_NAME', pools: {...} }.
 */

module.exports = {
  YUMBOT_FLORAL_GARDEN_CUP: {
  description: 'PATH-BESPOKE — YumBot floral-garden-cup (2026-05-20). bex.ai-modeled. Kawaii-faced vessel (teacup / takeout-cup / mug / bowl) OVERFLOWING with a magical bouquet of pastel flowers, cherry-blossom sprigs, sphere-flowers, pearls. Cherry-blossom branches arching from corners. Painterly-illustration-fusion. 7 path-bespoke axes. SISTER PATH: floral-garden-scene (multi-planter garden composition).',
  slots: {
    universal: [],
    bot: [],
    path: [
      'vessel',
      'overflowing_flora',
      'tabletop_scatter',
      'frame_branches',
      'palette',
      'background',
      'lighting'
    ]
  },
  pickN: { overflowing_flora: 4, tabletop_scatter: 3 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  YUMBOT_FLORAL_GARDEN_SCENE: {
  description: 'PATH-BESPOKE — YumBot floral-garden-scene (2026-05-21). Rich kawaii multi-planter garden scene — 3+ kawaii-faced planters/vessels clustered together in an indoor (potting shed / sunroom / windowsill / tea-time table / fireplace mantle / bookshelf) or outdoor (cottage patio / greenhouse / balcony / picnic-in-garden / garden bench / gazebo) setting, overflowing flowers, scattered kawaii treats, magical accents (butterflies, pearl-orbs, sparkle motes, fairy lights). 8 path-bespoke axes. SISTER PATH: floral-garden-cup (single-vessel-hero composition).',
  slots: {
    universal: [],
    bot: [],
    path: [
      'scene_type',
      'vessel',
      'overflowing_flora',
      'tabletop_scatter',
      'frame_branches',
      'palette',
      'background',
      'lighting'
    ]
  },
  pickN: { overflowing_flora: 4, tabletop_scatter: 3 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  YUMBOT_RAINBOW_DREAMSCAPE: {
  description: 'PATH-BESPOKE — YumBot rainbow-dreamscape (2026-05-20 v3 shared-catalog refactor). bex.ai-modeled. 5 MIXED kawaii food-creatures picked uniform-random from FOOD_CATALOG with RAINBOW_DREAMSCAPE tag, inhabiting a lush pastel dreamscape with 3 substantial landscape features + 3 decor items + 2 tiny companions (all tag-filtered from shared catalogs). Rainbow density + cherry-blossom mountains + balloons + sunny pastel sky. Wider lush scenic composition. 9 path-bespoke axes.',
  slots: {
    universal: [],
    bot: [],
    path: [
      'food_inhabitants',
      'dreamscape_setting',
      'rainbow_element',
      'sky_atmosphere',
      'environment',
      'decor',
      'companions',
      'camera',
      'lighting'
    ]
  },
  pickN: { food_inhabitants: 5, environment: 3, decor: 3, companions: 2 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  YUMBOT_CANDY_FANTASY: {
  description: 'PATH-BESPOKE — YumBot candy-fantasy (2026-05-21 R8 scene-axis + composition-lock). Candy-fantasy world; scene-type axis locks character placement (table/campfire/bridge/ledge/cake-tier/treehouse/etc) so renders are not generic candy meadows. 11 axes: candy_scene_type (composition lead), candy_world_signature (1 pick, standalone vertical landmark), candy_terrain, candy_sky, candy_camera, candy_lighting, candy_time_of_day, candy_weather, food_inhabitants (5), companions (1), decor_accents (1). Path prefix puts rich candy-world backdrop language; medium prefix is slim aesthetic-only so other yumbot paths inherit clean kawaii DNA.',
  slots: {
    universal: [],
    bot: [],
    path: [
      'candy_scene_type',
      'candy_world_signature',
      'candy_terrain',
      'candy_sky',
      'food_inhabitants',
      'companions',
      'decor_accents',
      'candy_camera',
      'candy_lighting',
      'candy_time_of_day',
      'candy_weather'
    ]
  },
  pickN: { candy_world_signature: 1, food_inhabitants: 5, companions: 1, decor_accents: 1 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  YUMBOT_JAPANESE_FESTIVAL: {
  description: 'PATH-BESPOKE — YumBot japanese-festival (2026-05-21 R7 11-axis + pose-variation). Kawaii matsuri scenes — 5 kawaii Japanese festival foods composed cleanly with NATURAL POSE VARIATION (one peeking forward, one tilted, one leaning back, one looking up, one tallest at center) — natural family-portrait cluster, NOT identical lineup, NOT chaotic acrobatics. Full 11-axis architecture: scene_type (pose-varied cluster), market_backdrop (yatai-lane / shrine courtyard / fish market / Edo street / hanami grove / etc.), signature (2 picks — chochin / torii / yatai / taiko / etc.), terrain, sky, camera, lighting, time_of_day, weather, food_inhabitants (5 from FOOD_CATALOG tagged FESTIVAL), companion (1 — firefly / goldfish / origami-crane / etc.). All pools at 200 entries.',
  slots: {
    universal: [],
    bot: [],
    path: [
      'scene_type',
      'market_backdrop',
      'signature',
      'terrain',
      'sky',
      'camera',
      'lighting',
      'time_of_day',
      'weather',
      'food_inhabitants',
      'companion'
    ]
  },
  pickN: { signature: 2, food_inhabitants: 5 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  YUMBOT_MINI_CHEF: {
  description: 'PATH-BESPOKE — YumBot mini-chef (2026-05-21 R2 no-human-apparel + 12-axis + 200-pool). Kawaii kitchen scenes — 5 kawaii food-characters (the foods themselves are the cooks — NO human/chibi-human chef figures, NO chef hats/aprons/neckerchiefs/uniforms) gathered in a kawaii kitchen preparing a kawaii dish. Natural family-portrait cluster with slight pose variation. Full 12-axis architecture: scene_type, kitchen_backdrop, 2 signatures, terrain, sky, camera, lighting, time_of_day, atmosphere, foods (5 from FOOD_CATALOG tagged BAKERY), companion (1), dish_being_prepared (1 centerpiece). All pools at 200 entries.',
  slots: {
    universal: [],
    bot: [],
    path: [
      'scene_type',
      'kitchen_backdrop',
      'signature',
      'terrain',
      'sky',
      'camera',
      'lighting',
      'time_of_day',
      'atmosphere',
      'food_inhabitants',
      'companion',
      'dish_being_prepared'
    ]
  },
  pickN: { signature: 2, food_inhabitants: 5 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  YUMBOT_COTTAGECORE_NATURE: {
  description: 'PATH-BESPOKE — YumBot cottagecore-nature (2026-05-21 12-axis + 200-pool). Kawaii cottagecore countryside-nature scenes — 5 kawaii food-characters gathered in cottagecore settings (wildflower meadow / cottage garden / woodland clearing / orchard / picnic in nature / etc.) with natural family-portrait cluster, slight pose variation. Full 12-axis architecture: scene_type, backdrop, 2 signatures, terrain, sky, camera, lighting, time_of_day, atmosphere, foods (5 from FOOD_CATALOG tagged COTTAGECORE), companion (1), nature_element (1 featured natural detail). All 11 pools at 200 entries.',
  slots: {
    universal: [],
    bot: [],
    path: [
      'scene_type',
      'backdrop',
      'signature',
      'terrain',
      'sky',
      'camera',
      'lighting',
      'time_of_day',
      'atmosphere',
      'food_inhabitants',
      'companion',
      'nature_element'
    ]
  },
  pickN: { signature: 2, food_inhabitants: 5 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  YUMBOT_CHECKERED_TABLETOP: {
  description: 'PATH-BESPOKE — YumBot checkered-tabletop (2026-05-20). bex.ai-modeled. Kawaii food/drink hero on a pastel gingham/checkered tablecloth, cluster of smiling mini-food-friends piled around AND ON TOP. 3/4 tabletop or overhead-flatlay. Pop-Mart-collectible-grid/sticker-card feel. 7 path-bespoke axes.',
  slots: {
    universal: [],
    bot: [],
    path: [
      'vessel_hero',
      'mini_creature_pile',
      'tablecloth',
      'scattered_minis',
      'decor_clusters',
      'camera',
      'lighting'
    ]
  },
  pickN: { scattered_minis: 5, decor_clusters: 2 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},
};
