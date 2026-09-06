// MIRROR of scripts/lib/halloweenPools.js (parity-locked by __tests__/lib/halloweenPoolsParity.test.ts).
// 2026-09-06: 7 sub-themes folded out to elegant / goofy (see the tooling file header); 13 pools.
// The engine only needs: which MAIN pool a sub_theme belongs to, so holiday draws can pick the pool
// uniformly first (equal airtime, Kevin 2026-09-05) and a row inside it second.
export const HALLOWEEN_POOL_OF_SUB: Record<string, string> = {
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
  reaper: 'haunted_graveyard',
  ghost_glam: 'haunted_graveyard',
  graveyard_picnic: 'haunted_graveyard',
  headless_hollow_bridge: 'haunted_graveyard',
  friendly_ghost_manor: 'haunted_graveyard',
  halloween_town_square: 'halloween_town_square',
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
};
export const HALLOWEEN_POOLS: string[] = [
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
];
/** Main pool for a row's sub_theme; unknown/null sub_theme → its own bucket (never dropped). */
export function holidayPoolOf(subTheme: string | null | undefined): string {
  if (!subTheme) return '__unsorted';
  const p = HALLOWEEN_POOL_OF_SUB[subTheme];
  return p ? p : subTheme;
}
