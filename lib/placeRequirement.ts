/**
 * At least one location is REQUIRED, in onboarding and in Settings (Kevin 2026-09-30): every nightly is set
 * in a place the user chose, so a profile with no places has nothing to set a dream in. Onboarding's
 * Continue stays disabled below this; Settings' Locations screen will not let you leave, and never SAVES an
 * empty list, so the last real list stays in the database even if the app is closed mid-edit.
 */
export const MIN_PLACES = 1;

export function hasRequiredPlaces(places: readonly string[] | null | undefined): boolean {
  return (places?.length ?? 0) >= MIN_PLACES;
}
