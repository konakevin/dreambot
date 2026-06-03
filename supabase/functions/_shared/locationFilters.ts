/**
 * Location safety net — prevents fantasy/sci-fi/imagined places from ever
 * reaching the nightly render pipeline.
 *
 * Background (2026-06-03): the location_cards table had 5 cards under the
 * "fantasy_worlds" picker category (sci-fi worlds, gothic realm, fairy
 * cottage, high fantasy, princess garden castle). Renders against these
 * came back incoherent — the engine stacks one anchor + one biome + many
 * surprise axes, and for fantasy/sci-fi anchors the result reads as a
 * messy collage rather than a place. Kevin: "completely unreadable."
 *
 * Three-layer cleanup landed together:
 *   1. picker — those 5 cards flipped to is_approved=false +
 *      picker_category=NULL so onboarding no longer surfaces them.
 *   2. user recipes — scrubbed any stale entries from
 *      user_recipes.recipe.dream_seeds.places[] for existing users.
 *   3. engine safety net — THIS MODULE. Even if a banned name sneaks
 *      back into a recipe (free-text path, manual DB edit, future
 *      migration), the engine refuses to resolve it AND refuses any
 *      card whose biome falls in the banned list.
 *
 * If you ever want to re-enable a fantasy location, re-approve the card
 * in the DB AND remove the name + biome from these lists.
 */

/** Names we never want to render as a dream location. Match is
 *  case-insensitive, trimmed; covers the 5 hidden picker entries plus
 *  common free-text variants we've seen in the field. */
export const BANNED_LOCATION_NAMES = new Set<string>([
  // The 5 cards hidden 2026-06-03
  'sci-fi worlds',
  'gothic realm',
  'fairy cottage',
  'high fantasy',
  'princess garden castle',
  // Other fantasy/sci-fi cards that exist in the DB unapproved — listed
  // here as belt+suspenders in case is_approved gets flipped back.
  'cherry blossom temple',
  'ancient elven city',
  'floating sky islands',
  'dragons keep',
  "dragon's keep",
  'pirate ship',
  'rose garden palace',
  'rose palace',
  'hogwarts',
  'disneyland',
  'cloud kingdom',
  'crystal caverns',
  'dwarven fortress',
  'enchanted forest',
  'fairy tale kingdom',
  'wizard academy',
  'cherry blossoms',
  'mermaid lagoon',
  'sea world',
  'aquarium',
  'underwater city',
  'underwater city atlantis',
  'atlantis',
  'cyberpunk megacity',
  'mars colony',
  'space station',
  'alien planet',
  'paris cafe',
  'parisian cafe',
  'cozy mountain cabin',
  'tuscan villa',
]);

/** Biome classes that are imagined / non-real. Any location_cards row
 *  with these biomes is refused at resolution time regardless of the
 *  is_approved flag. */
export const BANNED_LOCATION_BIOMES = new Set<string>([
  'fantasy_imagined',
  'scifi_cosmic',
  'aquatic_underwater', // underwater cities / mermaid lagoons / atlantis
]);

/** Case-insensitive trimmed lookup against BANNED_LOCATION_NAMES. */
export function isBannedLocationName(rawName: string | null | undefined): boolean {
  if (!rawName) return false;
  return BANNED_LOCATION_NAMES.has(String(rawName).toLowerCase().trim());
}

/** True if the location_cards.biome is in our refusal set. */
export function isBannedLocationBiome(biome: string | null | undefined): boolean {
  if (!biome) return false;
  return BANNED_LOCATION_BIOMES.has(biome);
}
