/**
 * PostHog product analytics — screen views, time-on-screen, tap/feature usage.
 *
 * Same gating model as lib/sentry.ts: a single client, created ONLY when
 * EXPO_PUBLIC_POSTHOG_KEY is set AND we're not in __DEV__ (so local dev / debug
 * builds send nothing and the app is unchanged). Every helper no-ops when off,
 * and the provider renders children straight through. Activation needs the key
 * + a release build (native module → ships with the next build, not OTA).
 *
 * Screen tracking is wired manually in app/_layout.tsx (Expo Router + usePathname)
 * since autocapture's screen tracking doesn't hook Expo Router reliably; tap
 * autocapture IS enabled via PostHogProvider. The standalone client here lets us
 * capture() product events from anywhere (hooks, non-component code).
 */
import PostHog, { PostHogProvider } from 'posthog-react-native';

const KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV ?? 'local';

/** The analytics client, or null when analytics is disabled. */
export const posthog: PostHog | null = KEY && !__DEV__ ? new PostHog(KEY, { host: HOST }) : null;

// Tag every event with the build environment (local / preview / production) so
// local test events stay out of production dashboards — same scheme as Sentry.
if (posthog) posthog.register({ environment: APP_ENV });

export const analyticsEnabled = posthog != null;

// Our event props are JSON-safe scalars; cast at this single boundary to
// PostHog's expected property shape so call sites stay simple.
type EventProps = Record<string, string | number | boolean> | undefined;

/** Capture a product event. No-op when analytics is off. */
export function capture(event: string, properties?: Record<string, unknown>): void {
  posthog?.capture(event, properties as EventProps);
}

/** Tie subsequent events to a user (call on login). No-op when off. */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  posthog?.identify(userId, properties as EventProps);
}

/** Clear the identity link (call on logout). */
export function resetAnalytics(): void {
  posthog?.reset();
}

export { PostHogProvider };
