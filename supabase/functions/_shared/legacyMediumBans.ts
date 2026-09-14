/**
 * legacyMediumBans.ts — translate a scenario row's `medium_ban` (and a holiday's `day_of_medium_ban`) from the
 * 1.2.0 MEDIUM vocabulary into the LOOK vocabulary the minimal engine actually rolls.
 *
 * WHY THIS EXISTS. 6,175 enabled `dual_scenarios` / `single_scenarios` rows carry a `medium_ban` written against the
 * old medium keys (`photography`, `film_noir`, `vintage_film`, `double_exposure`, `heirloom`, `glamour`, plus
 * `pencil` / `comics` / `canvas` / `watercolor`). Those rows are the guard that stops a PHOTO-REAL person appearing
 * in a fantastical scene — a photoreal couple in a dwarven hall reads as bad compositing (Kevin, 2026-08-24). Under
 * the looks engine the rolled style is always a `nightly_*` look, never one of those legacy keys, so
 * `bannedMediums.includes(nightlyMedium.key)` can never be true and the guard has been silently OFF.
 *
 * The map is DIRECT-SUCCESSOR ONLY, verified fragment-by-fragment against the live catalog (2026-09-13):
 * `glamour` / `canvas` / `pencil` / `watercolor` have byte-identical successors, and the four photographic tokens
 * cover exactly the six looks in the `photographic` family. `comics` is deliberately NOT mapped to the new
 * `comic_print` family: that family is Kevin's new work and banning ten looks off a legacy token would be a much
 * wider change than the row ever expressed. Pure + table-driven so a new look lands in the right bucket by family.
 */

/** Families whose every member belongs to a legacy register word. */
const BAN_FAMILIES: Readonly<Record<string, readonly string[]>> = {
  // The photo-real register. Every look in `photographic` renders a real photograph of a real person, which is
  // precisely what the imagined-biome guard bans.
  photography: ['photographic'],
  film_noir: ['photographic'],
  vintage_film: ['photographic'],
  double_exposure: ['photographic'],
  heirloom: ['photographic'],
};

/** Explicit key successors for tokens that name ONE style rather than a register. */
const BAN_KEYS: Readonly<Record<string, readonly string[]>> = {
  // Identical fragments in the live catalog — the 1.2.0 medium was copied to a look under a new key.
  glamour: ['nightly_glamour'],
  canvas: ['nightly_canvas'],
  pencil: ['nightly_colored_pencil'],
  watercolor: ['nightly_watercolor_paper'],
  // The 1.2.0 comic mediums; both are already retired from the nightly catalog (Kevin, 2026-09-13: "get rid of the
  // comics and pop art looks"). The new `comic_print` family is NOT included — see the header.
  comics: ['nightly_comics', 'nightly_pop_art'],
};

export interface BanCatalogRow {
  key: string;
  family: string;
}

/**
 * Expand legacy ban tokens into the set of LOOK KEYS to exclude.
 * A token that is already a live look key bans itself (so new rows can be written in the new vocabulary).
 * Unknown tokens are ignored — a stale ban can never break a dream (fail-open, the 1.2.0 contract).
 */
export function expandMediumBans(
  tokens: readonly string[],
  looks: readonly BanCatalogRow[]
): Set<string> {
  const out = new Set<string>();
  const byKey = new Set(looks.map((l) => l.key));
  for (const raw of tokens) {
    const token = raw.trim();
    if (!token) continue;
    if (byKey.has(token)) out.add(token);
    const fams = BAN_FAMILIES[token];
    if (fams) {
      for (const l of looks) if (fams.includes(l.family)) out.add(l.key);
    }
    const keys = BAN_KEYS[token];
    if (keys) {
      for (const k of keys) if (byKey.has(k)) out.add(k);
    }
  }
  return out;
}

/** Every legacy token this module knows how to translate (for tests + the audit script). */
export function knownBanTokens(): string[] {
  return [...new Set([...Object.keys(BAN_FAMILIES), ...Object.keys(BAN_KEYS)])].sort();
}
