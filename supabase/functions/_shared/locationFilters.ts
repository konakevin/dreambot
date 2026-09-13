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
  // 2026-09-13 (Kevin: "i don't really see many whimsical, fantasy, or sci-fi renders, but i think i have all those
  // locations saved"): the 19 imagined-world picker cards this list used to name (sci-fi worlds, high fantasy, fairy
  // cottage, dragons keep, cyberpunk megacity, mars colony, …) were re-approved with real spot pools in August, yet
  // this June safety net still stripped them from every user's place pool before the roll — ~24 of Kevin's 163
  // saved places never rendered. Only the free-text / trademark junk that never became a picker card stays banned.
  'gothic realm',
  'cherry blossom temple',
  "dragon's keep",
  'pirate ship',
  'rose palace',
  'hogwarts',
  'disneyland',
  'fairy tale kingdom',
  'cherry blossoms',
  'sea world',
  'aquarium',
  'underwater city',
  'atlantis',
  'paris cafe',
  'parisian cafe',
  'cozy mountain cabin',
  'tuscan villa',
]);

/** Biome classes that are imagined / non-real. Any location_cards row
 *  with these biomes is refused at resolution time regardless of the
 *  is_approved flag. */
export const BANNED_LOCATION_BIOMES = new Set<string>([
  // 2026-09-13: emptied — fantasy_imagined / scifi_cosmic / aquatic_underwater are live picker categories
  // (high_fantasy, scifi_space, whimsical_fun, heroes_adventure) with seeded spot pools; refusing them at card
  // resolution silently degraded those dreams to place-less renders.
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
