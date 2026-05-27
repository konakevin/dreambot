# Analytics Plan (PostHog)

Product analytics for DreamBot. Goal: understand **what people use, where they go, where they drop off** — screen/page hotspots, feature usage, funnels.

## Architecture

- **SDK:** `posthog-react-native` (US Cloud `https://us.i.posthog.com`).
- **Gating:** `lib/posthog.ts` — single client, active only when `EXPO_PUBLIC_POSTHOG_KEY` is set AND not `__DEV__`. No-op otherwise (same model as `lib/sentry.ts`). Every event tagged with `environment` (`local` / `preview` / `production`) so test data stays separate.
- **Events:** all explicit events live as typed functions in `lib/analytics.ts` — no magic strings at call sites.
- **Activation:** key in `.env.local` (local) + EAS env (`EXPO_PUBLIC_POSTHOG_KEY`, all profiles); native module → needs a release build (`dreambot --release`) since it's off in `__DEV__`.

## Auto-captured (no per-call code)

- **Screen views + time-on-screen** — `app/_layout.tsx` `ScreenTracker` fires `screen(pathname)` on every Expo Router change → most-visited pages (Bots tab, Top/Search, Profile, Create), time per screen, nav flow.
- **Tap autocapture** — `PostHogProvider autocapture={{ captureTouches: true }}` → which buttons/elements get pressed, app-wide.
- **User identify** — `AnalyticsIdentity` ties events to the signed-in user; `reset()` on logout.

## Explicit events → call sites

| Event `{props}`                                           | File:fn                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| `dream_create_started {mode}`                             | `hooks/useDreamCreate.ts` (generate start)                   |
| `dream_created {mode, medium, vibe, has_photo, has_cast}` | `hooks/useDreamCreate.ts` (success)                          |
| `dream_failed {mode, reason}`                             | `hooks/useDreamCreate.ts` (catch)                            |
| `dlt_started {source_post_id}`                            | `components/FullScreenFeed.tsx` (onFamily)                   |
| `feed_tab_selected {tab}`                                 | `app/(tabs)/index.tsx` (FeedTabs onChange)                   |
| `bot_viewed {bot_id, bot_name}`                           | `app/(tabs)/bots.tsx` (onSelectedBotChange)                  |
| `profile_viewed {is_self}`                                | `app/(tabs)/profile.tsx` + `app/user/[userId].tsx` (mount)   |
| `post_viewed {is_own, is_bot}`                            | `app/photo/[id].tsx` (mount)                                 |
| `onboarding_step_completed {step}`                        | `app/(onboarding)/index.tsx` (goNext)                        |
| `onboarding_completed`                                    | `components/onboarding/RevealStep.tsx` (handleCreateBot)     |
| `first_dream_generated {medium, vibe}`                    | `components/onboarding/RevealStep.tsx` (after upload insert) |
| `post_liked`                                              | `hooks/useToggleLike.ts` (like branch)                       |
| `comment_added {is_reply}`                                | `hooks/useAddComment.ts` (onSuccess)                         |
| `post_shared {recipient_count}`                           | `app/sharePost.tsx` (send success)                           |
| `follow_added {target_is_bot}`                            | `hooks/useToggleFollow.ts` (follow branch)                   |
| `sparkle_store_opened`                                    | `app/sparkleStore.tsx` (mount)                               |
| `sparkle_purchase_tapped {pack}`                          | `app/sparkleStore.tsx` (purchase tap)                        |
| `pro_store_opened`                                        | `app/proStore.tsx` (mount)                                   |
| `pro_subscribe_tapped {period}`                           | `app/proStore.tsx` (handlePurchase)                          |
| `hd_download_tapped {cached}`                             | `lib/imageLongPress.ts` (saveHd)                             |

## Questions this answers

- Bots-page popularity → `$screen` (bots tab) + **which bot** via `bot_viewed`.
- Following vs Explore → `feed_tab_selected`.
- Own-dream browsing → profile `$screen` + `post_viewed{is_own}`.
- DLT usage → `dlt_started`.
- Onboarding drop-off → the `onboarding_*` funnel.
- Creation-mode mix + success rate → `dream_create_started` / `dream_created` / `dream_failed`.
- Pre-paywall funnel → the monetization-intent events (RevenueCat has actual purchases).

## Privacy

Third-party analytics → must be declared in the App Store privacy nutrition label + the privacy policy (`dreambot-web`). Events are behavioral, tied to the app user id (no extra PII collected beyond what the app already has).
