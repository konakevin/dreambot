/**
 * dreamsSeen store — the "session baseline" for the Dreams album's per-tile New
 * markers.
 *
 * `viewBaseline` is the server timestamp of `users.last_dreams_view_at` as it was
 * BEFORE the user opened the album this visit (returned by mark_dreams_viewed).
 * A Dreams-grid tile whose `created_at` is newer than the baseline shows a "New"
 * pill. It's captured once when the user enters the Dreams sub-tab (not on every
 * focus) so bouncing into a dream's detail view and back doesn't wipe the markers
 * you're looking at; it's re-captured on the next real visit. In-memory only —
 * markers are ephemeral session UI; on cold start nothing is flagged until a new
 * render lands. Reset on sign-out (store/auth.ts). See migration 397.
 */

import { create } from 'zustand';

interface DreamsSeenState {
  viewBaseline: string | null;
  setViewBaseline: (ts: string | null) => void;
}

export const useDreamsSeenStore = create<DreamsSeenState>((set) => ({
  viewBaseline: null,
  setViewBaseline: (ts) => set({ viewBaseline: ts }),
}));
