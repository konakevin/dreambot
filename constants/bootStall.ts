/**
 * Boot stall — thresholds, retry policy, and copy (BOOT_STALL_PLAN.md).
 *
 * These live in the CLIENT on purpose, not `engine_config`: they have to work at
 * the exact moment the database is unreachable. That is the one deliberate
 * exception to the "new UX constant → engine_config field" default.
 *
 * Timeline (per attempt; "Try again" starts a fresh attempt):
 *   0s      quiet   wordmark only, byte-identical to the native splash
 *   6s      soft    one quiet line fades in under the wordmark
 *   15s     medium  "taking longer" line + a reachability probe (is the PHONE online?)
 *   45s     hard    error state + Try again; if the phone is online, ONE Sentry
 *                   event per launch → Sentry alert rule → Kevin is paged
 *
 * Thundering-herd guard: the has_ai_recipe read retries with bounded backoff
 * only until HARD, then NEVER automatically again — a stuck fleet hammering a
 * saturated PostgREST pool is the failure mode we are trying not to worsen
 * (DB_CONNECTION_SATURATION_PLAN.md). Only the manual button retries.
 */
export const BOOT_STALL = {
  SOFT_MS: 6_000,
  MEDIUM_MS: 15_000,
  HARD_MS: 45_000,
  /** Per-attempt abort on the users.has_ai_recipe read (iOS default is 60s). */
  RECIPE_READ_TIMEOUT_MS: 10_000,
  /** Backoff between read attempts; the last value repeats (+ jitter) until HARD. */
  RECIPE_RETRY_BACKOFF_MS: [1_000, 2_000, 4_000, 8_000],
  RECIPE_RETRY_JITTER_MS: 1_000,
  /** Reachability probe (both endpoints raced; any answer = online). */
  PROBE_TIMEOUT_MS: 5_000,
} as const;

/**
 * Where the reachability probe looks. NEVER Supabase — the whole point is to
 * tell "the phone is offline" from "our backend is down". The first is our own
 * site on Vercel (separate infrastructure from Supabase); the second is a tiny
 * always-on 204 that also happens to be what Android uses for captive-portal
 * detection.
 */
export const REACHABILITY_PROBES = [
  'https://dreambotapp.com/',
  'https://www.gstatic.com/generate_204',
] as const;

/**
 * Copy. Calm, honest, short. "We've been notified" is only ever shown when the
 * Sentry event was ACTUALLY sent (see lib/bootStall.ts copyFor) — never claim a
 * notification that did not happen. Offline copy never blames our servers.
 */
export const BOOT_STALL_COPY = {
  soft: 'Still waking up…',
  medium: 'Taking longer than usual. Still trying…',
  hardOnlineNotified: {
    title: "We can't reach DreamBot right now",
    body: "Our servers aren't responding. We've been notified and are on it. Please try again in a few minutes.",
    cta: 'Try again',
    hint: 'If this keeps happening, close the app fully and reopen it.',
  },
  hardOnlineSilent: {
    title: "We can't reach DreamBot right now",
    body: "Our servers aren't responding. Please try again in a few minutes.",
    cta: 'Try again',
    hint: 'If this keeps happening, close the app fully and reopen it.',
  },
  hardOffline: {
    title: "You're offline",
    body: 'Check your connection and try again.',
    cta: 'Try again',
  },
} as const;
