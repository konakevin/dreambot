// Fall pool taxonomy — SINGLE SOURCE OF TRUTH (Kevin approved 2026-09-07; HOLIDAY_DREAMS_PLAN.md §8d).
// Sister of halloweenPools.js: 13 main pools × sub-themes (8 approved + 5 dreamy/BloomBot-register pools, 2026-09-07), each pool a palette + signature objects. The
// engine mirror is supabase/functions/_shared/holidayPools.ts (FALL_POOL_OF_SUB, parity-tested).
//
// DEMARCATION (Kevin 2026-09-07): Halloween owns pumpkins, jack-o-lanterns, gourds, costumes and spook.
// Fall owns foliage, orchards, harvest, hearth, rain, flannel and cider. Every Fall pool is therefore
// `lanterns: false` (the lint drops any Fall row that mentions a pumpkin / jack-o-lantern / gourd) and
// `costume` is REAL autumn clothing, never a costume. That keeps the two seasons visually distinct when
// they blend in October (Fall Sept 15 → Thanksgiving, Halloween Oct 1-31, both flat 10%).
//
// Nightly bar (MANTRA): set dresser + costume designer — the dreamer is INTEGRATED into a composed,
// cinematic place; regular places are fine when the setting fills in "is this dreamy" (light, weather,
// scale, atmosphere). Share = ceil(SHARE / subs) per sub, per table.
'use strict';
const SHARE = 70;
const POOLS = {
  golden_foliage: {
    palette: 'fiery maple red, aspen gold, low amber sunbeams, soft morning mist',
    objects:
      'towering maples and oaks in full color, a leaf-carpeted trail, a split-rail fence, a weathered covered bridge, a still lake mirroring the color, drifting leaves caught in low golden light',
    lanterns: false,
    subs: [
      'maple_grove_sunbeams',
      'aspen_gold_high_country',
      'covered_bridge_creek',
      'lakeside_dock_mist',
      'leaf_storm_avenue',
    ],
  },
  orchard_and_cider: {
    palette: 'apple red, hay gold, cider amber, warm weathered barn wood',
    objects:
      'apple boughs heavy with fruit, wooden ladders and slatted crates, a cast-iron cider press, a farm stand stacked with crates and potted mums, a faded red barn, vineyard rows turned crimson',
    lanterns: false,
    subs: [
      'apple_orchard_afternoon',
      'cider_mill_barn',
      'farm_stand_golden_hour',
      'vineyard_harvest_dusk',
    ],
  },
  cozy_hearth: {
    palette: 'firelight amber, wool cream, rain-grey window light, dark oak',
    objects:
      'a stone fireplace with a roaring fire, wool blankets, stacked books, steaming mugs, rain streaking window glass, a farmhouse kitchen with pies cooling, warm lamplight and candle glow',
    lanterns: false,
    subs: ['cabin_fireside', 'reading_nook_rain', 'farmhouse_kitchen_baking', 'bookshop_cafe_rain'],
  },
  harvest_table: {
    palette: 'candle gold, linen white, burgundy, polished copper',
    objects:
      'a long table under old oaks, a candlelit farmhouse feast, garlands of oak leaves and wheat, copper pots, pies and crusty bread, string lights along barn rafters, pewter goblets, wildflower bouquets',
    lanterns: false,
    subs: ['long_table_under_oaks', 'candlelit_farmhouse_feast', 'barn_harvest_dinner'],
  },
  autumn_town: {
    palette: 'brick red, ivy turning gold, lamplight amber, wet-cobble silver',
    objects:
      'brick storefronts with potted mums on the steps, ivy-clad stone halls, a steam train at a platform, a cafe terrace under a striped awning, umbrellas on a rainy boulevard, iron lamp posts, leaf-strewn cobbles',
    lanterns: false,
    subs: [
      'new_england_main_street',
      'cobblestone_cafe_terrace',
      'rainy_boulevard_umbrellas',
      'campus_quad_ivy',
      'steam_train_platform',
    ],
  },
  autumn_adventure: {
    palette: 'canyon rust, alpine gold, river silver, trail dust',
    objects:
      'switchback trails through gold aspens, a red-rock canyon rim, a mirror-still alpine lake, a wooden kayak, a horse on a woodland bridle path, a foggy moor track, a stone river crossing',
    lanterns: false,
    subs: [
      'canyon_fall_hike',
      'alpine_lake_trail',
      'foggy_moor_walk',
      'kayak_mirror_lake',
      'horseback_woodland_trail',
    ],
  },
  rainy_day_romance: {
    palette: 'slate grey, umbrella red, greenhouse-glass green, lamp amber',
    objects:
      'a rain-slick stone bridge, a red umbrella, a Victorian glass greenhouse dripping with rain, a deep window seat in a storm, puddles reflecting lamplight, wet leaves pressed to the pavement',
    lanterns: false,
    subs: ['umbrella_bridge_rain', 'greenhouse_rain_glass', 'window_seat_storm'],
  },
  autumn_wonder: {
    palette: 'dreamlike gold, floating amber leaves, lavender dusk, cloud white',
    objects:
      'hot-air balloons drifting over a foliage valley, a treehouse village in giant golden trees, a cloud-mirror lake at dusk, leaves suspended mid-air in shafts of golden light, rope bridges, lantern-lit walkways',
    lanterns: false,
    subs: ['hot_air_balloons_over_valley', 'treehouse_village_foliage', 'cloud_mirror_lake'],
  },
  // ── Dreamy / BloomBot-register pools (Kevin approved 2026-09-07: "go ham") ──
  autumn_bloom_world: {
    palette: 'rust dahlia, amber chrysanthemum, burgundy amaranth, gold pollen light',
    objects:
      'colossal dahlias and chrysanthemums standing like trees, cascading curtains of amber blooms, a single colossal golden tree, backlit translucent petals, a river of marigolds, terraces dripping with amaranth',
    lanterns: false,
    subs: [
      'giant_dahlia_grove',
      'chrysanthemum_cascade_walk',
      'colossal_gold_tree',
      'sunflower_cathedral_backlit',
      'marigold_river_valley',
      'amaranth_curtain_terrace',
    ],
  },
  enchanted_gold_forest: {
    palette: 'firefly gold, silver moonlight, amber leaf glow, deep teal shadow',
    objects:
      'a birch cathedral lit by fireflies, giant glowing mushrooms in a leaf hollow, moonlit night-bloomers among silvered fall leaves, leaves suspended mid-air in light shafts, seeds drifting through fanned sunbeams',
    lanterns: false,
    subs: [
      'firefly_birch_cathedral',
      'glowing_mushroom_hollow',
      'moonlit_leaf_garden',
      'floating_leaf_light_path',
      'sunbeam_grove_light',
    ],
  },
  sky_and_light: {
    palette: 'aurora green and violet, harvest-moon gold, god-ray amber, cloud-sea rose',
    objects:
      'an aurora over golden larches, an enormous harvest moon over a foliage lake, fanned god-rays through a fog valley, a sea of clouds below a summit at sunset, paper lanterns floating on a lake',
    lanterns: false,
    subs: [
      'aurora_larch_ridge',
      'harvest_moonrise_foliage_lake',
      'fog_valley_god_rays',
      'cloud_sea_summit_sunset',
      'floating_lantern_lake',
    ],
  },
  autumn_storybook: {
    palette: 'storybook gold, moss green, honey stone, painted sky',
    objects:
      'a round-door cottage in a golden hollow, a castle terrace above a fall forest, a stone windmill in amber wheat, a canal town of golden trees and swans, a glass palace conservatory',
    lanterns: false,
    subs: [
      'golden_hollow_cottage',
      'castle_terrace_above_foliage',
      'amber_windmill_fields',
      'canal_town_gold_swans',
      'glass_palace_conservatory',
    ],
  },
  high_peaks_fall: {
    palette: 'larch gold, granite grey, glacier turquoise, first-snow white',
    objects:
      'switchback trails through golden larches, a knife-edge ridge above the clouds, a timber alpine hut at sunrise, a turquoise glacier lake ringed in gold, a wildflower meadow under first snow',
    lanterns: false,
    subs: [
      'larch_valley_switchbacks',
      'ridge_walk_above_clouds',
      'alpine_hut_sunrise',
      'glacier_lake_gold',
      'wildflower_meadow_first_snow',
    ],
  },
};
// `must` (optional) = regexes EVERY generated scene must match (the sub's defining element; each entry must
// match) — the generator drops a row that misses one. Added 2026-09-07 after the pool-objects punch pulled
// sibling subs' places into a sub's rows (windmill rows full of castles, 56 off-brief rows in 26 subs).
// `costume` = WARDROBE (real autumn clothing, never a costume — the generator says so); `setting` =
// the sub's world for the generator. Hats/beanies/scarves are fine (no face occlusion); hoods DOWN.
const SUBS = {
  // ── golden_foliage ──
  maple_grove_sunbeams: {
    pool: 'golden_foliage',
    costume: 'a camel wool coat over a cream cable-knit, a soft scarf, leather boots',
    setting:
      'a cathedral grove of fiery red and gold maples, low sunbeams cutting through drifting leaves, a leaf-carpeted trail, a split-rail fence',
  },
  aspen_gold_high_country: {
    pool: 'golden_foliage',
    costume: 'a shearling-collar jacket, a flannel shirt, dark jeans, hiking boots',
    setting:
      'a high mountain meadow ringed by blazing gold aspens, white trunks in rows, snow-dusted peaks beyond, a still tarn reflecting the gold',
  },
  covered_bridge_creek: {
    pool: 'golden_foliage',
    costume: 'a rust corduroy jacket, a chunky knit sweater, a wool beanie, ankle boots',
    setting:
      'a weathered red covered bridge over a clear creek, banks piled with orange leaves, mist lifting off the water, maples arching overhead',
  },
  lakeside_dock_mist: {
    pool: 'golden_foliage',
    costume: 'a fisherman sweater, a waxed canvas jacket, a plaid blanket scarf',
    setting:
      'a weathered wooden dock on a glassy lake at dawn, mist on the water, the far shore a wall of peak autumn color, a wooden canoe tied at the post',
  },
  leaf_storm_avenue: {
    pool: 'golden_foliage',
    costume: 'a long camel trench coat, a burgundy turtleneck, leather gloves',
    setting:
      'a grand tree-lined avenue in a gust of falling leaves, golden light through the canopy, iron benches drifted with leaves, a distant stone gate',
  },
  // ── orchard_and_cider ──
  apple_orchard_afternoon: {
    pool: 'orchard_and_cider',
    costume: 'a soft knit sweater, a light quilted jacket, a woven harvest basket at the hip',
    setting:
      'a sun-warmed apple orchard, boughs heavy with red apples, wooden ladders against the trees, slatted crates of fruit, dappled golden light',
  },
  cider_mill_barn: {
    pool: 'orchard_and_cider',
    costume: 'a plaid flannel with rolled sleeves, a canvas work apron, a wool cap',
    setting:
      'an old timber cider mill, a cast-iron press, oak barrels, crates of apples, sunlight through dusty rafters, steam rising from a copper kettle',
  },
  farm_stand_golden_hour: {
    pool: 'orchard_and_cider',
    costume: 'a chunky cardigan, a denim shirt, a wide-brim felt hat, boots',
    setting:
      'a roadside farm stand at golden hour, crates of apples and pears, potted mums in every color, hay bales, a faded red barn and rolling amber fields',
  },
  vineyard_harvest_dusk: {
    pool: 'orchard_and_cider',
    costume: 'a tailored tweed jacket, a silk scarf, dark trousers, polished boots',
    setting:
      'vineyard rows turned crimson and gold at dusk, wooden grape crates, a stone winery with lit windows, hills fading into violet haze',
  },
  // ── cozy_hearth ──
  cabin_fireside: {
    pool: 'cozy_hearth',
    costume: 'a chunky wool sweater, a plaid blanket around the shoulders, wool socks',
    setting:
      'a log cabin great room, a roaring stone fireplace, a plaid armchair, stacked firewood, a steaming mug on a side table, foliage glowing through the window',
  },
  reading_nook_rain: {
    pool: 'cozy_hearth',
    costume: 'an oversized cream knit, soft joggers, thick socks, a mug held at the chest',
    setting:
      'a deep window-seat nook piled with cushions, gold maple leaves pressed against the rain-streaked panes, shelves of worn books, a brass reading lamp, a wool throw, apple-cinnamon tea',
  },
  farmhouse_kitchen_baking: {
    pool: 'cozy_hearth',
    costume: 'a linen apron over a rolled-sleeve flannel, hair tied back, a dusting of flour',
    setting:
      'a farmhouse kitchen at golden hour, apple pies cooling on the sill, a butcher-block island of apples and cinnamon, copper pans, a cast-iron stove',
  },
  bookshop_cafe_rain: {
    pool: 'cozy_hearth',
    costume: 'a tweed blazer over a turtleneck, a wool scarf, a paper cup of coffee',
    setting:
      'a cramped bookshop cafe on a rainy autumn evening, floor-to-ceiling shelves, wet maple leaves plastered on the fogged window, a bowl of apples on the counter, a hissing espresso machine, warm pendant lamps',
  },
  // ── harvest_table ──
  long_table_under_oaks: {
    pool: 'harvest_table',
    costume: 'a rust linen dress or an olive corduroy jacket over a cream sweater',
    setting:
      'a long farm table set under ancient oaks at dusk, string lights in the branches, wildflowers and wheat garlands, copper pots, candles down the center',
  },
  candlelit_farmhouse_feast: {
    pool: 'harvest_table',
    costume: 'a burgundy knit dress or a wool blazer over a chambray shirt',
    setting:
      'a farmhouse dining room lit by dozens of candles, a table heaped with pies and bread, oak-leaf garlands, pewter goblets, a fire in the hearth',
  },
  barn_harvest_dinner: {
    pool: 'harvest_table',
    costume: 'a plaid flannel under a quilted vest, a knit beanie, boots',
    setting:
      'a timber barn strung with warm lights along the rafters, hay bales, a long table of harvest dishes, lantern-lit stalls, open doors onto amber fields',
  },
  // ── autumn_town ──
  new_england_main_street: {
    pool: 'autumn_town',
    costume: 'a navy peacoat, a striped scarf, a cream cable-knit, leather boots',
    setting:
      'a brick main street in peak foliage, potted mums on every stoop, a white church steeple, iron lamp posts, a general store with crates of apples',
  },
  cobblestone_cafe_terrace: {
    pool: 'autumn_town',
    costume: 'a camel overcoat, a fine-knit turtleneck, a leather satchel',
    setting:
      'a cafe terrace under a striped awning on a cobbled square, cane chairs, leaves drifting across the stones, a fountain, golden afternoon light',
  },
  rainy_boulevard_umbrellas: {
    pool: 'autumn_town',
    costume: 'a belted trench coat, a wool scarf, a red umbrella held at the side',
    setting:
      'a wide boulevard on a rainy evening, umbrellas along the pavement, plane trees dropping gold leaves, shop windows glowing on wet cobbles',
  },
  campus_quad_ivy: {
    pool: 'autumn_town',
    costume: 'a tweed jacket over a sweater vest, a wool scarf, a leather satchel',
    setting:
      'an ivy-clad stone college quad in full color, gothic arches, a bell tower, leaf-covered lawns, stone benches, warm light in tall windows',
  },
  steam_train_platform: {
    pool: 'autumn_town',
    costume: 'a long wool coat, a felt fedora, leather gloves, a vintage suitcase at the side',
    setting:
      'a small-town station platform, a steam locomotive venting clouds, brass lanterns, luggage carts, forest ablaze in fall color behind the tracks',
  },
  // ── autumn_adventure ──
  canyon_fall_hike: {
    pool: 'autumn_adventure',
    costume: 'a flannel shirt, a fleece vest, hiking pants, boots, a light daypack',
    setting:
      'a red-rock canyon trail lined with flaming cottonwoods, a winding leaf-strewn path, a river glinting far below, warm low sun on the rim',
  },
  alpine_lake_trail: {
    pool: 'autumn_adventure',
    costume: 'a puffer vest over a merino base layer, trail pants, boots',
    setting:
      'a switchback trail above a mirror-still alpine lake, gold larches on the slopes, granite peaks dusted with first snow, crisp blue sky',
  },
  foggy_moor_walk: {
    pool: 'autumn_adventure',
    costume: 'a waxed field jacket, a wool jumper, a tweed flat cap, wellies',
    setting:
      'a heather moor in thick morning fog, russet bracken, a stone wall winding over the hill, a lone bare tree, soft grey light breaking gold',
  },
  kayak_mirror_lake: {
    pool: 'autumn_adventure',
    costume: 'a fleece pullover, a life vest worn open, rolled trousers',
    setting:
      'a wooden kayak pulled onto a pebble shore, a glassy lake mirroring peak foliage, mist on the water, a lone loon, a distant cabin',
  },
  horseback_woodland_trail: {
    pool: 'autumn_adventure',
    costume: 'a waxed riding jacket, a cream sweater, tan breeches, tall leather boots',
    setting:
      'a bridle path through a golden beech wood, a chestnut horse standing at the trail edge, leaves drifting through slanting light, a stone wall',
  },
  // ── rainy_day_romance ──
  umbrella_bridge_rain: {
    pool: 'rainy_day_romance',
    costume: 'a belted trench coat, a knit scarf, a red umbrella held at the side',
    setting:
      'a rain-slick stone bridge over a leaf-strewn river, lamplight in the puddles, a wall of orange trees on the far bank, soft grey drizzle',
  },
  greenhouse_rain_glass: {
    pool: 'rainy_day_romance',
    costume: 'a chunky oatmeal cardigan over a linen shirt, wool trousers',
    setting:
      'a Victorian glass greenhouse in the rain, drops streaking the panes, potted ferns and chrysanthemums, a wrought-iron bench, golden trees blurred outside',
  },
  window_seat_storm: {
    pool: 'rainy_day_romance',
    costume: 'a soft ribbed knit, a wool wrap, thick socks, a mug held at the chest',
    setting:
      'a deep bay window seat during an autumn storm, rain sheeting the glass, a wool throw, a candle, whipping golden maples and drifts of wet leaves in the garden beyond',
  },
  // ── autumn_wonder ──
  hot_air_balloons_over_valley: {
    pool: 'autumn_wonder',
    costume: 'a shearling jacket, a cream scarf, leather gloves',
    setting:
      'a wicker balloon basket at the rail, dozens of striped balloons drifting over a valley of peak foliage, morning mist in the folds, a river of gold below',
  },
  treehouse_village_foliage: {
    pool: 'autumn_wonder',
    costume: 'a forest-green wool coat, a knit beanie, a leather satchel',
    setting:
      'a village of lantern-lit treehouses built into giant golden oaks, rope bridges between the trunks, leaves drifting through shafts of amber light',
  },
  cloud_mirror_lake: {
    pool: 'autumn_wonder',
    costume: 'a long charcoal coat, a burgundy scarf, boots',
    setting:
      'a perfectly still lake at dusk mirroring lavender clouds and a shoreline of fiery maples, a wooden pier vanishing into the reflection, leaves floating in gold light',
  },
  // ── dreamy / BloomBot-register pools (2026-09-07) ──
  giant_dahlia_grove: {
    must: [/dahlia/i],
    pool: 'autumn_bloom_world',
    costume: 'a rust linen dress or a cream fisherman sweater with brown corduroys',
    setting:
      'a grove where every tree is a colossal dahlia in rust and burgundy, petal canopies overhead, a leaf-carpeted path, golden pollen drifting in low light',
  },
  chrysanthemum_cascade_walk: {
    must: [/chrysanthemum|\bmums?\b/i],
    pool: 'autumn_bloom_world',
    costume: 'a camel wool coat, a soft amber scarf, leather boots',
    setting:
      'a walkway beneath an overhead canopy of cascading amber and bronze chrysanthemums, bloom chandeliers hanging into atmospheric depth, petals on the flagstones',
  },
  colossal_gold_tree: {
    must: [/\btree\b/i],
    pool: 'autumn_bloom_world',
    costume: 'a forest-green wool coat, a knit scarf, boots',
    setting:
      'a single colossal golden tree towering over a meadow, its canopy raining amber leaves, a dwarfed split-rail fence and a lit path at its roots, a warm evening sky',
  },
  sunflower_cathedral_backlit: {
    must: [/sunflower/i],
    pool: 'autumn_bloom_world',
    costume: 'a cream knit sweater, a rust corduroy jacket, a wide-brim felt hat',
    setting:
      'a cathedral of towering sunflowers backlit by a low sun, translucent petals glowing gold, a mown aisle between the stalks, a dramatic amber sky',
  },
  marigold_river_valley: {
    must: [/marigold/i],
    pool: 'autumn_bloom_world',
    costume: 'an oatmeal cardigan over a linen shirt, wool trousers',
    setting:
      'a valley where a river of orange marigolds winds between golden hills, a wooden footbridge over the blooms, mist in the folds, warm sidelight',
  },
  amaranth_curtain_terrace: {
    must: [/amaranth|tassel/i, /foliage|vines?|leaf|leaves|autumn/i],
    pool: 'autumn_bloom_world',
    costume: 'a burgundy velvet blazer over a cream turtleneck, dark trousers',
    setting:
      'a stone terrace hung with trailing amaranth flower tassels in burgundy and amber (living blooms, never fabric), autumn vines on the balustrade, a foliage valley below, golden-hour haze',
  },
  firefly_birch_cathedral: {
    must: [/birch/i, /firefl/i],
    pool: 'enchanted_gold_forest',
    costume: 'a charcoal wool coat, a burgundy scarf, leather gloves',
    setting:
      'a cathedral of white birches at dusk, thousands of fireflies drifting between gold leaves, a mossy path, silver moonlight through the canopy',
  },
  glowing_mushroom_hollow: {
    must: [/mushroom|toadstool/i],
    pool: 'enchanted_gold_forest',
    costume: 'a forest-green knit, a waxed jacket, boots',
    setting:
      'a hollow of giant amber-glowing mushrooms among drifts of red leaves, mossy roots, mist hugging the ground, soft gold light from the caps',
  },
  moonlit_leaf_garden: {
    must: [/moon/i],
    pool: 'enchanted_gold_forest',
    costume: 'a silver-grey wool wrap over a cream knit dress, or a charcoal overcoat',
    setting:
      'a moonlit garden of silvered fall leaves and late purple asters, a stone fountain drifted with maple leaves, fireflies, a full moon over a black hedge',
  },
  floating_leaf_light_path: {
    must: [/suspend|float|hang|mid-?air|hover/i, /\bleaves\b|\bleaf\b/i],
    pool: 'enchanted_gold_forest',
    costume: 'a camel trench coat, a soft scarf, boots',
    setting:
      'a forest path where thousands of golden leaves hang suspended mid-air in shafts of amber light, dust motes glowing, a mossy stone stairway ahead',
  },
  sunbeam_grove_light: {
    must: [
      /sunbeam|shafts? of (?:light|sun)|light shafts?|beams? of light|sunlight|sun ?rays?/i,
      /seeds?\b|fluff|dandelion|thistle|spores?/i,
    ],
    pool: 'enchanted_gold_forest',
    costume: 'a cream cable-knit, a tweed jacket, dark jeans',
    setting:
      'a maple grove pierced by fanned sunbeams, dandelion seeds and gold leaves drifting through the light, a leaf-drifted stone wall, mist at the trunks',
  },
  aurora_larch_ridge: {
    must: [/aurora|northern lights/i, /night|stars?\b|starry|midnight/i],
    pool: 'sky_and_light',
    costume: 'a shearling jacket, a cream scarf, leather gloves',
    setting:
      'a mountain ridge of golden larches at NIGHT under a rippling green and violet aurora in a starry sky, a still tarn mirroring the lights, first snow on the peaks',
  },
  harvest_moonrise_foliage_lake: {
    must: [/moon/i, /lake/i],
    pool: 'sky_and_light',
    costume: 'a long wool coat, a burgundy scarf, boots',
    setting:
      'a wooden pier on a foliage-ringed lake as an enormous harvest moon rises, gold light on the water, mist along the shore, a lone canoe',
  },
  fog_valley_god_rays: {
    must: [/fog|mist/i, /rays?\b|beams?\b|shafts?\b/i],
    pool: 'sky_and_light',
    costume: 'a waxed field jacket, a wool jumper, a tweed flat cap',
    setting:
      'a hillside above a fog-filled valley, fanned god-rays breaking through in amber shafts, fiery treetops rising from the mist, a stone wall',
  },
  cloud_sea_summit_sunset: {
    must: [/cloud/i, /summit|peak|crest/i],
    pool: 'sky_and_light',
    costume: 'a puffer vest over a merino base layer, trail pants, boots',
    setting:
      'a rocky summit above a sea of rose-gold clouds at sunset, distant peaks like islands, a stone cairn, a golden larch clinging to the rock',
  },
  floating_lantern_lake: {
    must: [/lantern/i, /lake|water/i],
    pool: 'sky_and_light',
    costume: 'a camel overcoat, a knit scarf, leather gloves',
    setting:
      'a lake at dusk covered in floating paper lanterns, their reflections rippling gold, a wooden dock, fiery maples on the far shore, a lavender sky',
  },
  golden_hollow_cottage: {
    must: [/cottage/i, /round door|arched door|door/i],
    pool: 'autumn_storybook',
    costume: 'a chunky oatmeal cardigan, a linen shirt, wool trousers, boots',
    setting:
      'a round-door cottage tucked into a golden hollow, a mossy roof, smoke from a stone chimney, a lantern by the door, a path of gold leaves',
  },
  castle_terrace_above_foliage: {
    must: [/castle/i, /terrace|balustrade|battlement|parapet/i],
    pool: 'autumn_storybook',
    costume: 'a tailored tweed coat, a silk scarf, leather gloves',
    setting:
      'a stone castle terrace above a sea of fall forest, ivy on the battlements, a fountain, distant towers in golden haze',
  },
  amber_windmill_fields: {
    must: [/windmill|\bmill\b/i, /wheat|field/i],
    pool: 'autumn_storybook',
    costume: 'a rust corduroy jacket, a cream knit, dark jeans, boots',
    setting:
      'a stone windmill in fields of amber wheat under a painted sky, a dirt lane lined with golden poplars, a wooden cart of apples, warm evening light',
  },
  canal_town_gold_swans: {
    must: [/canal/i, /swan/i],
    pool: 'autumn_storybook',
    costume: 'a navy peacoat, a striped scarf, leather gloves',
    setting:
      'a canal town of honey-stone bridges and golden trees, swans on the water, lanterns on the quay, warm light in the windows, leaves on the cobbles',
  },
  glass_palace_conservatory: {
    must: [/conservatory|glass/i],
    pool: 'autumn_storybook',
    costume: 'a burgundy velvet blazer over a cream turtleneck, or a rust silk dress',
    setting:
      'a vast Victorian glass-palace conservatory, iron and glass arches, amber chrysanthemums and ferns in tiers, golden light through the panes, a tiled path',
  },
  larch_valley_switchbacks: {
    must: [/switchback|trail|path/i, /larch/i],
    pool: 'high_peaks_fall',
    costume: 'a fleece vest over a merino base layer, trail pants, boots, a daypack',
    setting:
      'switchback trails climbing through a valley of golden larches, granite peaks above, a turquoise stream below, a crisp blue sky',
  },
  ridge_walk_above_clouds: {
    must: [/ridge|arête|arete|crest/i, /cloud/i],
    pool: 'high_peaks_fall',
    costume: 'a shell jacket over a wool layer, hiking pants, boots, trekking poles at hand',
    setting:
      'a knife-edge ridge trail above a sea of clouds, golden larches on the lower slopes, distant snow peaks, low morning sun',
  },
  alpine_hut_sunrise: {
    must: [/hut|cabin|chalet|refuge|lodge/i, /sunrise|dawn|morning|first light/i],
    pool: 'high_peaks_fall',
    costume: 'a chunky wool sweater, a down vest, wool socks, boots',
    setting:
      'a timber alpine hut on a meadow at sunrise, pink light on the peaks, gold larches below, a steaming mug on the bench, a wooden signpost',
  },
  glacier_lake_gold: {
    must: [/glacier|glacial/i, /lake|tarn|pool/i],
    pool: 'high_peaks_fall',
    costume: 'a puffer jacket, a knit beanie, hiking pants, boots',
    setting:
      'a turquoise glacier lake ringed by golden larches and grey scree, a glacier tongue above, mirror-still water, first snow on the ridges',
  },
  wildflower_meadow_first_snow: {
    must: [/meadow/i, /snow|frost/i],
    pool: 'high_peaks_fall',
    costume: 'a waxed jacket over a fisherman sweater, wool trousers, boots',
    setting:
      'a high meadow of late wildflowers dusted with first snow, gold aspens at the edge, peaks glowing in evening light, a split-rail fence',
  },
};
const POOL_OF_SUB = Object.fromEntries(Object.entries(SUBS).map(([s, d]) => [s, d.pool]));
const shareFor = (main) => Math.ceil(SHARE / POOLS[main].subs.length); // always round UP (Kevin)
module.exports = { SHARE, POOLS, SUBS, POOL_OF_SUB, shareFor };
