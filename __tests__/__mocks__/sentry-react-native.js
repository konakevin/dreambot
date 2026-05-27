/**
 * Jest stub for `@sentry/react-native` (native module; can't load in jest).
 * Sentry is gated OFF in tests (no DSN / __DEV__), so these never fire — the
 * stub just satisfies the import chain (lib/sentry.ts → AppErrorBoundary, etc.).
 */
module.exports = {
  __esModule: true,
  init: () => {},
  wrap: (c) => c,
  captureException: () => {},
  captureMessage: () => {},
};
