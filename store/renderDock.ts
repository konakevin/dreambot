/**
 * renderDock store — the tiny shared state behind the render dock.
 *
 * `dockHeight` is the vertical space the dock occupies above the tab bar (0 when
 * hidden). Every tab surface ADDS `useRenderDockHeight()` to its existing (tuned)
 * bottom padding so content eases up without the dock ever overlapping content —
 * and nothing changes at rest (height 0). `finished` holds recently-completed /
 * failed jobs so the dock can play a per-ring completion (fill + check + pop)
 * before the ring drops off; entries are removed after their animation TTL.
 * See DREAM_TRACKING_PLAN.md.
 */

import { create } from 'zustand';

/** Height of the dock band above the tab bar when visible. */
export const DOCK_HEIGHT = 48;

/** How long a finished ring lingers after completion — long enough for the ring
 *  to deliberately fill to 100% + show its check before it drops off (dock pill)
 *  and, in the album, before the real image is revealed in its place. Shared by
 *  the dock and the Dreams grid so the completing tile and the pill stay in step. */
export const FINISHED_RING_TTL_MS = 1700;

export interface FinishedRing {
  /** dream_queue.id (== job id). */
  jobId: string;
  kind: 'ready' | 'failed';
  /** dream_queue.created_at — used to keep a completing ring in the SAME slot it
   *  held while active (so it doesn't jump position as it finishes). */
  createdAt: string;
  /** dream_queue.upload_id of the finished render (null on failure). The Dreams
   *  album uses it to SUPPRESS the freshly-arrived post while its completing tile
   *  plays the ring finish, so the ring completes in place instead of the image
   *  popping in beside it, then reveals the real post when the entry clears. */
  uploadId?: string | null;
  /** ms timestamp raised (for dedup). */
  at: number;
}

interface RenderDockState {
  dockHeight: number;
  setDockHeight: (h: number) => void;
  finished: FinishedRing[];
  /** Record a terminal transition (dedup by jobId; keeps the most recent few). */
  pushFinished: (f: FinishedRing) => void;
  removeFinished: (jobId: string) => void;
  /** Set when the dock is tapped — Profile consumes it on focus to open the
   *  Dreams sub-tab (where the pending / finished tiles live). */
  wantsDreamsTab: boolean;
  requestDreamsTab: () => void;
  clearDreamsTab: () => void;
}

export const useRenderDockStore = create<RenderDockState>((set) => ({
  dockHeight: 0,
  setDockHeight: (h) => set({ dockHeight: h }),
  finished: [],
  pushFinished: (f) =>
    set((s) => {
      if (s.finished.some((e) => e.jobId === f.jobId)) return s;
      return { finished: [...s.finished, f].slice(-8) };
    }),
  removeFinished: (jobId) =>
    set((s) => ({ finished: s.finished.filter((e) => e.jobId !== jobId) })),
  wantsDreamsTab: false,
  requestDreamsTab: () => set({ wantsDreamsTab: true }),
  clearDreamsTab: () => set({ wantsDreamsTab: false }),
}));

/** Convenience selector: the space the dock currently occupies (px). Add this
 *  to a tab surface's bottom padding so it makes room for the dock. */
export function useRenderDockHeight(): number {
  return useRenderDockStore((s) => s.dockHeight);
}
