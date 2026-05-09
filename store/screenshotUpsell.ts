import { create } from 'zustand';

/**
 * Tracks whether the screenshot upsell modal has fired in the current
 * session. We never want to show it twice in one session even if the
 * user takes 10 screenshots in a row — that's nagware.
 *
 * The 7-day cooldown after a "Not now" dismissal lives separately in
 * AsyncStorage (see hooks/useScreenshotUpsell.ts), since it must
 * survive app restarts. This in-memory flag is the per-session guard.
 */
interface ScreenshotUpsellState {
  firedThisSession: boolean;
  markFired: () => void;
  reset: () => void;
}

export const useScreenshotUpsellStore = create<ScreenshotUpsellState>((set) => ({
  firedThisSession: false,
  markFired: () => set({ firedThisSession: true }),
  reset: () => set({ firedThisSession: false }),
}));
