/**
 * Pro-subscription state — the single source of truth for "is this user Pro
 * right now?" Pure and dependency-free so it is unit-testable and shared by the
 * client auth store (store/auth.ts). The nightly cron
 * (scripts/lib/nightlyEligibility.js) and the is_pro_active() Postgres function
 * mirror this exact logic in their own runtimes.
 *
 * A user is Pro if EITHER:
 *   1. they have an active PAID subscription — pro_subscription=true AND
 *      (no expiry OR expiry in the future), OR
 *   2. they are within their 14-day Pro-features trial.
 *
 * When a paid subscription's expiry passes (or the trial lapses) the user falls
 * back to the FREE state automatically: every read re-validates the timestamps,
 * so a missed RevenueCat EXPIRATION webhook can never leave a user with
 * permanent Pro access. `now` is injectable for deterministic tests.
 */

export interface EntitlementRow {
  pro_subscription?: boolean;
  pro_subscription_expires_at?: string | null;
  pro_trial_started_at?: string | null;
  // DreamBot Basic (migration 257). No trial of its own — the free trial is the
  // Pro-trial window above.
  basic_subscription?: boolean;
  basic_subscription_expires_at?: string | null;
}

// Default trial length. The AUTHORITATIVE window lives in engine_config.pro_trial_days
// (read by is_pro_active() SQL + the nightly cron); pass `trialDays` to override
// here. The client store uses this default — it's display-only, the server gate
// re-validates every Pro action — so a changed admin window lags the UI at most.
export const TRIAL_DURATION_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Active PAID subscription right now? (false for trial-only users.) */
export function isPaidProActive(row: EntitlementRow | null, now: number = Date.now()): boolean {
  if (!row || !row.pro_subscription) return false;
  const expiresAt = row.pro_subscription_expires_at;
  if (!expiresAt) return true; // no expiry recorded = treat as active
  return new Date(expiresAt).getTime() > now;
}

/** Absolute moment the trial ends, or null if no trial was started. */
export function trialEndsAt(
  row: EntitlementRow | null,
  trialDays: number = TRIAL_DURATION_DAYS
): string | null {
  if (!row || !row.pro_trial_started_at) return null;
  return new Date(new Date(row.pro_trial_started_at).getTime() + trialDays * DAY_MS).toISOString();
}

/** Within an active trial right now? */
export function isTrialActive(
  row: EntitlementRow | null,
  now: number = Date.now(),
  trialDays: number = TRIAL_DURATION_DAYS
): boolean {
  const end = trialEndsAt(row, trialDays);
  return end != null && new Date(end).getTime() > now;
}

/** Effective Pro entitlement: active paid OR active trial. */
export function isProActive(
  row: EntitlementRow | null,
  now: number = Date.now(),
  trialDays: number = TRIAL_DURATION_DAYS
): boolean {
  return isPaidProActive(row, now) || isTrialActive(row, now, trialDays);
}

/** Active PAID Basic subscription right now? Basic has NO trial of its own (the
 *  free trial is the Pro-trial window) — paid + unexpired only. Mirrors
 *  is_basic_active() SQL + nightlyEligibility.js. */
export function isBasicActive(row: EntitlementRow | null, now: number = Date.now()): boolean {
  if (!row || !row.basic_subscription) return false;
  const expiresAt = row.basic_subscription_expires_at;
  if (!expiresAt) return true; // no expiry recorded = treat as active
  return new Date(expiresAt).getTime() > now;
}

/** Eligible for NIGHTLY DREAMS: Pro (paid OR trial) OR Basic (paid). The shared
 *  core perk of both paid tiers. Mirrors is_dream_eligible() SQL +
 *  nightlyEligibility.js. Use this (NOT isProActive) to gate nightly dreams;
 *  keep Pro-EXCLUSIVE perks (75✦ bundle, 100 HD) on isProActive. */
export function isDreamEligible(
  row: EntitlementRow | null,
  now: number = Date.now(),
  trialDays: number = TRIAL_DURATION_DAYS
): boolean {
  return isProActive(row, now, trialDays) || isBasicActive(row, now);
}
