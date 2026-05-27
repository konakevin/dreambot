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

/** Initialize Sentry. No-op without a DSN; never sends in __DEV__. */
export function initSentry(): void {
  if (!DSN) return;
  Sentry.init({
    dsn: DSN,
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
