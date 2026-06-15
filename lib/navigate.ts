/**
 * Debounced navigation — prevents double-tap from pushing two screens.
 * Use this instead of router.push/router.navigate for user-triggered navigation.
 */

import { router } from 'expo-router';

let lastNavTime = 0;
const NAV_COOLDOWN = 500;

export function push(href: string) {
  const now = Date.now();
  if (now - lastNavTime < NAV_COOLDOWN) return;
  lastNavTime = now;
  router.push(href as never);
}

export function navigate(href: string) {
  const now = Date.now();
  if (now - lastNavTime < NAV_COOLDOWN) return;
  lastNavTime = now;
  router.navigate(href as never);
}

export function replace(href: string) {
  const now = Date.now();
  if (now - lastNavTime < NAV_COOLDOWN) return;
  lastNavTime = now;
  router.replace(href as never);
}

/** The home tab — the universal fallback when a back/dismiss has nowhere to go. */
export const HOME_HREF = '/(tabs)';

/**
 * Go back, or fall back to the home tab when there's no in-app history.
 *
 * A bare `router.back()` is a NO-OP at a stack root — which is exactly what a
 * cold-start deep link produces (tap a push from outside the app → the target
 * screen mounts as the root, so the header chevron / custom swipe-back do
 * nothing and the user is stranded). Routing to home on an empty stack turns
 * that dead-end into a sane escape. Pass a different fallback for a non-home
 * landing.
 *
 * NOTE: this only governs JS-driven back actions (header buttons + the custom
 * useStandardSwipeBack gesture). The native iOS edge-swipe on a `card` screen
 * is handled inside react-navigation and can't be intercepted here — those
 * screens rely on the header button as the guaranteed escape.
 */
export function safeBack(fallbackHref: string = HOME_HREF) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallbackHref as never);
  }
}

export function back(fallbackHref: string = HOME_HREF) {
  const now = Date.now();
  if (now - lastNavTime < NAV_COOLDOWN) return;
  lastNavTime = now;
  safeBack(fallbackHref);
}
