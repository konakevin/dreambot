/**
 * Pure decision: should the screenshot-upsell modal fire?
 *
 * Lives in lib/ (not hooks/) so the unit test can import it without
 * pulling in native React Native modules (expo-router, expo-screen-
 * capture, etc.) — those crash under jest.
 */

export const SCREENSHOT_UPSELL_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface ScreenshotUpsellGateInputs {
  isPro: boolean;
  isAdmin: boolean;
  currentUserId: string | null;
  postOwnerId: string | null | undefined;
  firedThisSession: boolean;
  lastDismissedAt: number | null;
  now: number;
}

/**
 * Free users get the upsell when they screenshot another creator's
 * dream (bot or other user). Pro users, admins, post owners, callers
 * already inside the per-session lock, and callers inside the 7-day
 * dismiss cooldown are all silent.
 */
export function shouldShowScreenshotUpsell(input: ScreenshotUpsellGateInputs): boolean {
  if (input.firedThisSession) return false;
  if (input.isPro) return false;
  if (input.isAdmin) return false;
  if (!input.postOwnerId) return false; // no post in view
  if (input.currentUserId && input.currentUserId === input.postOwnerId) return false;
  if (input.lastDismissedAt && input.now - input.lastDismissedAt < SCREENSHOT_UPSELL_COOLDOWN_MS) {
    return false;
  }
  return true;
}
