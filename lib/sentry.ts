/**
 * Sentry crash reporting — the production-error observability the app was
 * missing (AppErrorBoundary previously only console.error'd in __DEV__, so
 * release crashes were invisible).
 *
 * Gated on EXPO_PUBLIC_SENTRY_DSN: with no DSN set (local dev, or before a
 * Sentry project is wired) every entry point here is a no-op, so the app runs
 * exactly as before. To activate: create a Sentry project, set
 * EXPO_PUBLIC_SENTRY_DSN, and rebuild the native app (Sentry is a native module
 * — it ships with the next EAS build, not an OTA/Expo Go).
 */
import * as Sentry from '@sentry/react-native';

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

// Distinguishes builds in Sentry's `environment` filter. Each EAS profile sets
// EXPO_PUBLIC_APP_ENV in eas.json (production / preview / development); a LOCAL
// release build (`dreambot --release`, `expo run:ios`) doesn't set it, so it
// falls back to 'local'. Lets you separate real production crashes from local
// test events (which otherwise both report as 'production' since __DEV__ is
// false in any release build).
const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV ?? 'local';

/** Initialize Sentry. No-op without a DSN; never sends in __DEV__. */
export function initSentry(): void {
  if (!DSN) return;
  Sentry.init({
    dsn: DSN,
    environment: APP_ENV,
    enabled: !__DEV__, // don't ship dev noise to the project
    tracesSampleRate: 0.1, // crashes are the priority; sample perf lightly
  });
}

/** Report a caught error (with optional context). No-op when Sentry is off. */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!DSN) return;
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

export { Sentry };

export type MessageLevel = 'info' | 'warning' | 'error';

export interface CaptureMessageOptions {
  level?: MessageLevel;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  /** Group all occurrences into ONE Sentry issue so a frequency alert rule can count them. */
  fingerprint?: string[];
}

/**
 * Report a non-exception signal (e.g. the boot-stall alarm, BOOT_STALL_PLAN.md).
 * Returns whether it was ACTUALLY sent — false without a DSN or in __DEV__ (the
 * same gate as `enabled: !__DEV__` in initSentry). Callers use the return to
 * decide whether they may tell the user "we've been notified".
 */
export function captureMessage(message: string, opts: CaptureMessageOptions = {}): boolean {
  if (!DSN || __DEV__) return false;
  Sentry.withScope((scope) => {
    if (opts.level) scope.setLevel(opts.level);
    if (opts.tags) scope.setTags(opts.tags);
    if (opts.extra) scope.setExtras(opts.extra);
    if (opts.fingerprint) scope.setFingerprint(opts.fingerprint);
    Sentry.captureMessage(message);
  });
  return true;
}
