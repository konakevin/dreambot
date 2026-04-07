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

export function back() {
  const now = Date.now();
  if (now - lastNavTime < NAV_COOLDOWN) return;
  lastNavTime = now;
  router.back();
}
