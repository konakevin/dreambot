// Minimum time a pull-to-refresh stays open so it visibly "rests" as loading.
// The query invalidations resolve in a few ms (often cached), so without a floor
// the native RefreshControl snaps shut before the user perceives any load — it
// just slides down and straight back up (Kevin 2026-07-11). Await this alongside
// the real refresh work (Promise.all) so the control holds ~this long minimum.
export const MIN_REFRESH_HOLD_MS = 600;

export const minRefreshHold = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, MIN_REFRESH_HOLD_MS));
