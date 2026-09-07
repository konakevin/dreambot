// MIRROR of scripts/lib/halloweenPools.js (parity-locked by __tests__/lib/halloweenPoolsParity.test.ts).
// 2026-09-06: 7 sub-themes folded out to elegant / goofy (see the tooling file header); 13 pools.
// 2026-09-07: + enchanted_harvest_court (autumn_fae + harvest_royalty moved in from Fall) = 14 pools.
// The engine only needs: which MAIN pool a sub_theme belongs to, so holiday draws can pick the pool
// uniformly first (equal airtime, Kevin 2026-09-05) and a row inside it second.
export const HALLOWEEN_POOL_OF_SUB: Record<string, string> = {
  // halloween_day_of — RESERVED day-of pool (HOLIDAY_DAY_OF_PLAN.md): never in the window draw.
  costume_party_barn: 'halloween_day_of',
  masquerade_ball: 'halloween_day_of',
  trick_or_treat_street: 'halloween_day_of',
  haunted_hayride_party: 'halloween_day_of',
  pumpkin_carving_party: 'halloween_day_of',
  bonfire_night: 'halloween_day_of',
  witches_kitchen_party: 'halloween_day_of',
  haunted_house_queue: 'halloween_day_of',
  cemetery_lantern_picnic: 'halloween_day_of',
  halloween_parade: 'halloween_day_of',
  rooftop_skyline_party: 'halloween_day_of',
  monster_hotel_gala: 'halloween_day_of',
  cozy_porch: 'halloween_neighborhood',
  decorated_neighborhood: 'halloween_neighborhood',
  trick_or_treating: 'halloween_neighborhood',
  pumpkin_carving: 'halloween_neighborhood',
  jack_o_lantern_overload: 'halloween_neighborhood',
  suburban_halloween_chaos: 'halloween_neighborhood',
  salem_town_night: 'halloween_neighborhood',
  flashlight_suburbia_80s: 'halloween_neighborhood',
  enchanted_pumpkin_patch: 'pumpkin_patch_night',
  jack_o_lantern_festival: 'pumpkin_patch_night',
  pumpkin_king_patch: 'pumpkin_patch_night',
  haunted_hayride: 'pumpkin_patch_night',
  corn_maze_torchlight: 'pumpkin_patch_night',
  fall_festival: 'pumpkin_patch_night',
  witch: 'witch_cottage',
  witch_sisters_cottage: 'witch_cottage',
  witchy_victorian_house: 'witch_cottage',
  black_cat_alley: 'witch_cottage',
  cursed_library: 'witch_cottage',
  haunted_mansion: 'gothic_manor',
  vampire: 'gothic_manor',
  midnight_carriage: 'gothic_manor',
  gothic_masquerade_ball: 'gothic_manor',
  macabre_family_mansion: 'gothic_manor',
  undead_wedding: 'gothic_manor',
  reaper: 'haunted_graveyard',
  ghost_glam: 'haunted_graveyard',
  graveyard_picnic: 'haunted_graveyard',
  headless_hollow_bridge: 'haunted_graveyard',
  friendly_ghost_manor: 'haunted_graveyard',
  halloween_town_square: 'halloween_town_square',
  stop_motion_whimsy: 'halloween_town_square',
  halloween_party: 'halloween_party',
  movie_night: 'halloween_party',
  skeleton_dance_hall: 'halloween_party',
  candy_store_frenzy: 'halloween_party',
  pumpkin_spice_cafe: 'halloween_party',
  monster_garage_band: 'halloween_party',
  monster_hotel_lobby: 'halloween_party',
  haunted_house_attraction: 'haunted_attractions',
  haunted_amusement_park: 'haunted_attractions',
  dark_carnival: 'haunted_attractions',
  mad_scientist: 'mad_lab_and_monsters',
  monster_hunter: 'mad_lab_and_monsters',
  werewolf_moon_forest: 'mad_lab_and_monsters',
  ghost_hunting_crew: 'ghost_hunting_crew',
  seance_parlor: 'seance_parlor',
  cute_halloween: 'cute_halloween',
  ghost_pirate_ship: 'ghost_pirate_ship',
  autumn_fae: 'enchanted_harvest_court',
  harvest_royalty: 'enchanted_harvest_court',
};
export const HALLOWEEN_POOLS: string[] = [
  'halloween_day_of',
  'halloween_neighborhood',
  'pumpkin_patch_night',
  'witch_cottage',
  'gothic_manor',
  'haunted_graveyard',
  'halloween_town_square',
  'halloween_party',
  'haunted_attractions',
  'mad_lab_and_monsters',
  'ghost_hunting_crew',
  'seance_parlor',
  'cute_halloween',
  'ghost_pirate_ship',
  'enchanted_harvest_court',
];
// MIRROR of scripts/lib/fallPools.js (parity-locked by the same test). 2026-09-07 (Kevin approved): 8 Fall pools + 5 dreamy / BloomBot-register pools = 13.
// Demarcation: Halloween owns pumpkins / jack-o-lanterns / costumes / spook; Fall owns foliage, orchards,
// harvest, hearth, rain, flannel, cider. Sub-theme names never collide across the two maps (parity-tested).
export const FALL_POOL_OF_SUB: Record<string, string> = {
  maple_grove_sunbeams: 'golden_foliage',
  aspen_gold_high_country: 'golden_foliage',
  covered_bridge_creek: 'golden_foliage',
  lakeside_dock_mist: 'golden_foliage',
  leaf_storm_avenue: 'golden_foliage',
  apple_orchard_afternoon: 'orchard_and_cider',
  cider_mill_barn: 'orchard_and_cider',
  farm_stand_golden_hour: 'orchard_and_cider',
  vineyard_harvest_dusk: 'orchard_and_cider',
  cabin_fireside: 'cozy_hearth',
  reading_nook_rain: 'cozy_hearth',
  farmhouse_kitchen_baking: 'cozy_hearth',
  bookshop_cafe_rain: 'cozy_hearth',
  long_table_under_oaks: 'harvest_table',
  candlelit_farmhouse_feast: 'harvest_table',
  barn_harvest_dinner: 'harvest_table',
  new_england_main_street: 'autumn_town',
  cobblestone_cafe_terrace: 'autumn_town',
  rainy_boulevard_umbrellas: 'autumn_town',
  campus_quad_ivy: 'autumn_town',
  steam_train_platform: 'autumn_town',
  canyon_fall_hike: 'autumn_adventure',
  alpine_lake_trail: 'autumn_adventure',
  foggy_moor_walk: 'autumn_adventure',
  kayak_mirror_lake: 'autumn_adventure',
  horseback_woodland_trail: 'autumn_adventure',
  umbrella_bridge_rain: 'rainy_day_romance',
  greenhouse_rain_glass: 'rainy_day_romance',
  window_seat_storm: 'rainy_day_romance',
  hot_air_balloons_over_valley: 'autumn_wonder',
  treehouse_village_foliage: 'autumn_wonder',
  cloud_mirror_lake: 'autumn_wonder',
  giant_dahlia_grove: 'autumn_bloom_world',
  chrysanthemum_cascade_walk: 'autumn_bloom_world',
  colossal_gold_tree: 'autumn_bloom_world',
  sunflower_cathedral_backlit: 'autumn_bloom_world',
  marigold_river_valley: 'autumn_bloom_world',
  amaranth_curtain_terrace: 'autumn_bloom_world',
  firefly_birch_cathedral: 'enchanted_gold_forest',
  glowing_mushroom_hollow: 'enchanted_gold_forest',
  moonlit_leaf_garden: 'enchanted_gold_forest',
  floating_leaf_light_path: 'enchanted_gold_forest',
  sunbeam_grove_light: 'enchanted_gold_forest',
  aurora_larch_ridge: 'sky_and_light',
  harvest_moonrise_foliage_lake: 'sky_and_light',
  fog_valley_god_rays: 'sky_and_light',
  cloud_sea_summit_sunset: 'sky_and_light',
  floating_lantern_lake: 'sky_and_light',
  golden_hollow_cottage: 'autumn_storybook',
  castle_terrace_above_foliage: 'autumn_storybook',
  amber_windmill_fields: 'autumn_storybook',
  canal_town_gold_swans: 'autumn_storybook',
  glass_palace_conservatory: 'autumn_storybook',
  larch_valley_switchbacks: 'high_peaks_fall',
  ridge_walk_above_clouds: 'high_peaks_fall',
  alpine_hut_sunrise: 'high_peaks_fall',
  glacier_lake_gold: 'high_peaks_fall',
  wildflower_meadow_first_snow: 'high_peaks_fall',
};
export const FALL_POOLS: string[] = [
  'golden_foliage',
  'orchard_and_cider',
  'cozy_hearth',
  'harvest_table',
  'autumn_town',
  'autumn_adventure',
  'rainy_day_romance',
  'autumn_wonder',
  'autumn_bloom_world',
  'enchanted_gold_forest',
  'sky_and_light',
  'autumn_storybook',
  'high_peaks_fall',
];
/** The reserved day-of pool key for a holiday — generic: `<holiday>_day_of` (HOLIDAY_DAY_OF_PLAN.md §3.1). */
export function dayOfPoolKey(holiday: string): string {
  return `${holiday}_day_of`;
}
/** True when a row's sub_theme belongs to the holiday's reserved day-of pool. */
export function isDayOfSub(holiday: string, subTheme: string | null | undefined): boolean {
  return holidayPoolOf(subTheme) === dayOfPoolKey(holiday);
}
/** Day-of draw mode for the holiday loaders (HOLIDAY_DAY_OF_PLAN.md §3.2): the window never sees the
 *  reserved day-of subs ('exclude', the default); the day-of branch draws ONLY them ('only'). */
export type DayOfMode = 'only' | 'exclude';
/** Pure: keep the rows the mode allows. A row with no sub_theme is a window row (never day-of). */
export function filterDayOfRows<T extends { subTheme?: string | null }>(
  rows: T[],
  holiday: string,
  mode: DayOfMode
): T[] {
  return rows.filter((r) => isDayOfSub(holiday, r.subTheme) === (mode === 'only'));
}
/** Pure: the rows a day-of draw uses (HOLIDAY_DAY_OF_PLAN.md §3.3 R2). Day-of pool first; if it is
 *  empty, the holiday's window rows (fallback A); if both are empty the caller runs the normal roll
 *  (fallback B). Never a broken render. */
export function selectDayOfRows<T>(
  dayOfRows: T[],
  windowRows: T[]
): { rows: T[]; source: 'day_of' | 'fallback_window' | 'none' } {
  if (dayOfRows.length > 0) return { rows: dayOfRows, source: 'day_of' };
  if (windowRows.length > 0) return { rows: windowRows, source: 'fallback_window' };
  return { rows: [], source: 'none' };
}
/** Main pool for a row's sub_theme (Halloween or Fall); unknown/null sub_theme → its own bucket (never dropped). */
export function holidayPoolOf(subTheme: string | null | undefined): string {
  if (!subTheme) return '__unsorted';
  const p = HALLOWEEN_POOL_OF_SUB[subTheme] ?? FALL_POOL_OF_SUB[subTheme];
  return p ? p : subTheme;
}
