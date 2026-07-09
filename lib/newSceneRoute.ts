/**
 * Client mirror of the New Scene solo-swap fork in
 * supabase/functions/_shared/newSceneDirective.ts (routeNewSceneSubject).
 *
 * The Create screen needs the branch BEFORE submit (the Quality tier only
 * exists on the reference path; solo-swap renders identically on both tiers,
 * so the toggle hides and the price is always Standard). The edge functions
 * keep their own routing + a price backstop — this mirror only drives UI.
 *
 * KEEP IN SYNC with routeNewSceneSubject's solo_swap condition. Locked by
 * __tests__/lib/newSceneRoute.test.ts, which imports the engine source via
 * @engine/* and asserts equality across the full signal grid.
 */

export interface NewSceneRouteSignals {
  num_people: number;
  num_animals: number;
  face: string; // clean | multi | none | unclear
}

/** True when the photo takes the exact-face solo-swap path (one clean human,
 *  no competing pet) — the branch where the Quality tier does nothing. */
export function isSoloSwapPhoto(sig: NewSceneRouteSignals): boolean {
  const people = Math.max(0, sig.num_people || 0);
  const animals = Math.max(0, sig.num_animals || 0);
  return people === 1 && animals === 0 && sig.face === 'clean';
}
