/**
 * renderDock store — the tiny shared state behind the render dock pill.
 *
 * `dockHeight` is the vertical space the dock currently occupies above the tab
 * bar (0 when hidden). Every tab surface ADDS `useRenderDockHeight()` to its
 * existing (tuned) bottom padding so content eases up to make room without the
 * dock ever overlapping post metadata / the Create footer / a grid's last row —
 * and so nothing changes at rest (height 0). `flash` is the transient "a dream
 * just finished / failed" beat the pill shows before decrementing or dismissing.
 * See DREAM_TRACKING_PLAN.md.
 */

import { create } from 'zustand';

/** Height of the pill band above the tab bar when the dock is visible. */
export const DOCK_HEIGHT = 44;

export interface DockFlash {
  kind: 'ready' | 'failed';
  /** The finished dream's upload id — the ready flash taps to its reveal. */
  uploadId: string | null;
  /** ms timestamp the flash was raised (for TTL). */
  at: number;
}

interface RenderDockState {
  dockHeight: number;
  setDockHeight: (h: number) => void;
  flash: DockFlash | null;
  setFlash: (flash: DockFlash) => void;
  clearFlash: () => void;
  /** Set when the dock is tapped — the Profile screen consumes it on focus to
   *  open the Dreams sub-tab (where the pending/finished tiles live). */
  wantsDreamsTab: boolean;
  requestDreamsTab: () => void;
  clearDreamsTab: () => void;
}

export const useRenderDockStore = create<RenderDockState>((set) => ({
  dockHeight: 0,
  setDockHeight: (h) => set({ dockHeight: h }),
  flash: null,
  setFlash: (flash) => set({ flash }),
  clearFlash: () => set({ flash: null }),
  wantsDreamsTab: false,
  requestDreamsTab: () => set({ wantsDreamsTab: true }),
  clearDreamsTab: () => set({ wantsDreamsTab: false }),
}));

/** Convenience selector: the space the dock currently occupies (px). Add this
 *  to a tab surface's bottom padding so it makes room for the dock. */
export function useRenderDockHeight(): number {
  return useRenderDockStore((s) => s.dockHeight);
}
