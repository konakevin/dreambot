/**
 * Jest stub for `posthog-react-native` (a native module that can't load in the
 * jest/node env). Analytics is gated OFF in tests anyway (__DEV__ → no client),
 * so these are never actually invoked; the stub just satisfies the import chain
 * (lib/posthog.ts → lib/analytics.ts → many hooks/components).
 */
class PostHog {
  capture() {}
  identify() {}
  reset() {}
  register() {}
  screen() {}
}
const PostHogProvider = ({ children }) => children;

module.exports = { __esModule: true, default: PostHog, PostHog, PostHogProvider };
