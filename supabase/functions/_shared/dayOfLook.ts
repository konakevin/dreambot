/**
 * dayOfLook.ts — the holiday DAY-OF LOOK pick (HOLIDAY_DAY_OF_PLAN.md §5d, mig 478): the day-of cast
 * render draws its MEDIUM from the holiday's curated look set (`holidays.day_of_look_keys` → dream_mediums
 * rows in the `<holiday>_` namespace the app never lists) instead of the normal nightly roll. The picked
 * key rides the existing scenario-pin route (`dualSceneMediumKey` → resolveMediumFromDb → the model is
 * re-picked from the LOOK's smart_dream_models = per-look model membership) and the flux-1.1-pro override
 * library is exempted (the look IS the curated fragment). Pure by design — locked by
 * __tests__/lib/dayOfLook.test.ts. Uniform pick: a user gets ONE day-of render per holiday, so recency
 * weighting buys nothing.
 */
export function pickDayOfLook(
  keys: readonly string[],
  forceKey: string | null = null,
  rng: () => number = Math.random
): string | null {
  if (forceKey) return forceKey;
  if (keys.length === 0) return null;
  return keys[Math.floor(rng() * keys.length)];
}

/** Comma list → trimmed set (the `holidays.day_of_medium_ban` column). */
export function parseMediumBan(ban: string | null | undefined): Set<string> {
  return new Set(
    String(ban ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  );
}
