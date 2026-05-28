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
// Must register AFTER ready(): the RN SDK hydrates persisted super-properties
// from storage asynchronously in the constructor, and that hydration clobbers a
// register() made synchronously at module load — which silently dropped the
// `environment` tag from every event after the first cold-start lifecycle event.
// ready() resolves once hydration completes, so the property persists from then
// on (the handful of pre-ready cold-start events stay untagged — acceptable).
if (posthog) {
  const client = posthog;
  client
    .ready()
    .then(() => client.register({ environment: APP_ENV }))
    // Best-effort tag: never crash the app or leak an unhandled rejection over it.
    .catch(() => undefined);
}

export const analyticsEnabled = posthog != null;

// Admin opt-out: admins do a lot of repetitive in-app testing, so their usage
// would pollute the product reports. When the signed-in user is an admin we opt
// them out of ALL analytics. The SDK's optOut() is the only thing that can stop
// PostHogProvider autocapture (taps), and it also suppresses screen/capture/
// identify + persists locally across launches. We ALSO keep a local flag and
// guard our explicit entry points, so suppression is immediate + deterministic
// and doesn't rely on opt-out timing. Wired from app/_layout.tsx on auth change.
let adminOptedOut = false;

/** Opt the current user in/out of analytics (admins are opted out). */
export function setAnalyticsOptOut(optOut: boolean): void {
  adminOptedOut = optOut;
  if (!posthog) return;
  if (optOut) posthog.optOut();
  else posthog.optIn();
}

// Our event props are JSON-safe scalars; cast at this single boundary to
// PostHog's expected property shape so call sites stay simple.
type EventProps = Record<string, string | number | boolean> | undefined;

/** Capture a product event. No-op when analytics is off or the user is opted out. */
export function capture(event: string, properties?: Record<string, unknown>): void {
  if (adminOptedOut) return;
  posthog?.capture(event, properties as EventProps);
}

/** Fire a screen view. No-op when analytics is off or the user is opted out. */
export function screen(name: string): void {
  if (adminOptedOut) return;
  posthog?.screen(name);
}

/** Tie subsequent events to a user (call on login). No-op when off or opted out. */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (adminOptedOut) return;
  posthog?.identify(userId, properties as EventProps);
}

/** Clear the identity link (call on logout). */
export function resetAnalytics(): void {
  posthog?.reset();
}

export { PostHogProvider };
