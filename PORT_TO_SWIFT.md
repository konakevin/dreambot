# PORT_TO_SWIFT.md — Porting DreamBot's UI to Native Swift/SwiftUI

**Status:** Planning / implementation guide (v1, 2026-07-23). Not yet started.
**Audience:** Any engineer (human or agent) picking up the native rewrite. Read this whole file
before writing code. It is grounded in a full read of the current RN/Expo codebase; every
subsystem below was mapped from the actual source.

**Scope:** Replace **100% of the React Native client UI** with a native Swift/SwiftUI app. The
Supabase backend, the 18 server-side bots, the edge functions, RLS, migrations, and the marketing
website **do not change** (with ONE backend exception: push delivery — see §12).

---

## 0. The one insight that shapes everything

**DreamBot's backend is already a clean, frozen, battle-tested API contract, and the client is the
only thing being rewritten.**

- The app is 100% Supabase: Postgres + RLS, Auth (GoTrue), Storage, Realtime, and Edge Functions.
- The 18 image-gen bots are **server-side Node scripts** (GitHub Actions cron) — untouched.
- The website (`dreambot-web`, Vercel) is a **separate repo** serving marketing + deep-link share
  targets off the same Supabase project — untouched.
- All generation, moderation, sparkle economy, face-swap, and feed-ranking logic lives in edge
  functions and Postgres RPCs — **untouched**.

So the port is **purely a client-UI swap against a stable API**. The Swift app talks to the exact
same Supabase project (`jimftynwrinwenonjrlj`) via `supabase-swift`, sends identical request shapes
to the same edge functions, and reads the same tables/RPCs. This de-risks the entire project and
defines the strategy below.

**Corollary — where the real work is.** Because the backend is fixed, ~90% of the effort is:
1. Re-implementing the **~75 TanStack-Query hooks + 7 Zustand stores** as a Swift repository/cache
   layer + `@Observable` view models (the business logic surface).
2. Rebuilding the **two hand-rolled interruptible feed pagers** and the **image pipeline** at native
   quality (this is 80% of the *perceived* performance win — the reason to port at all).
3. Migrating **push delivery** from Expo tokens to raw APNs (the only backend change).

Everything else (auth, payments, analytics, the widget) is a near-1:1 SDK swap.

---

## Table of contents

1. Recommended architecture & target
2. Scope fence — what does NOT change
3. Tech stack & dependency → native map
4. Xcode project structure
5. The data layer (replacing TanStack Query + supabase-js)
6. State management (replacing Zustand)
7. Design system (tokens, typography, components)
8. Navigation & deep links
9. Feature port guides (auth, onboarding, create, feed, social, commerce)
10. The hard parts / risk register
11. Parity-locked shared logic (must match the server)
12. Push notifications migration (backend change)
13. Build, signing, widget & CI pipeline
14. Testing strategy
15. Phased implementation plan & effort estimate
16. Cutover & migration strategy
17. Open decisions for Kevin
18. Appendix A — complete backend endpoint reference
19. Appendix B — complete screen inventory

---

## 1. Recommended architecture & target

| Decision | Recommendation | Why |
|---|---|---|
| **App model** | **Greenfield native app**, same bundle id `com.konakevin.radorbad`, same Supabase backend. Build to parity in a new Xcode project, ship as an in-place App Store update. | Brownfield (embedding SwiftUI into the RN shell) keeps the RN runtime + nav and defeats the performance purpose. A clean native app is simpler and is the whole point. |
| **UI framework** | **SwiftUI-first**, with **UIKit interop for the two feed pagers** (and anything else that needs frame-perfect gesture/scroll control). Use `UIViewControllerRepresentable`. | SwiftUI gets you 90% of the screens fast. The vertical feed pager's exact physics (interruptible 170 ms snaps, cell reuse at 120 fps) is the one place SwiftUI's paging scroll won't match — do it in `UICollectionView`. See §10.1. |
| **Min iOS** | **iOS 17.0** (matches the existing widget target). | Unlocks the Observation framework (`@Observable`), modern `ScrollView` APIs, `.sensoryFeedback`, `ContentUnavailableView`, `PhaseAnimator`. iOS 17 is a safe reach floor in 2026. (Current app: iOS 16 app / iOS 17 widget.) Going iOS 18 buys more but 17 is the pragmatic choice; revisit against live install-base analytics. |
| **Concurrency** | **Swift Concurrency** (async/await, actors for the cache, `@MainActor` view models). | Matches supabase-swift's async API; actors give safe concurrent cache access. |
| **Pattern** | **MVVM + a Repository/Cache layer.** Views are dumb; `@Observable` view models hold UI state; repositories own all Supabase I/O + caching. | Mirrors the current split (components ← hooks/stores ← supabase). Keeps business logic testable and out of views. |
| **Dependency mgmt** | **Swift Package Manager**. | All required SDKs (Nuke, supabase-swift, purchases-ios, sentry-cocoa, posthog-ios, GoogleSignIn, FBSDK) ship as SPM packages. |
| **Data models** | **Hand-written `Codable` structs** derived from `types/database.ts` + `types/vibeProfile.ts`. | 63 tables / ~58 RPCs but the client only touches a subset directly; most rows arrive via RPC (`get_feed`, `get_inbox`) and map into a few UI structs (`DreamPostItem`, `InboxGroup`, `VibeProfile`). Model those precisely; don't blindly mirror all 63 tables. |

---

## 2. Scope fence — what does NOT change

Do not touch, re-implement, or "improve" any of these while porting:

- **Supabase Postgres schema, RLS policies, column grants, migrations** (`supabase/migrations/`, 394+).
- **Edge functions** (`supabase/functions/*`) — `generate-dream`, `enqueue-dream`, `restyle-photo`,
  `classify-photo`, `describe-photo`, `nightly-dreams`, `dream-queue-worker`, `face-swap-dual`,
  `first-dream-render`, `revenuecat-webhook`, `refund-*`, `upscale-image`. The **only** edge fn that
  changes is `send-push` (§12).
- **The 18 bots** (`scripts/bots/`) and their dispatcher/cron.
- **The website** (`../dreambot-web`).
- **RevenueCat dashboard config** — entitlements `pro`/`basic`, offerings `subscriptions` +
  `sparkle_packs`, all product ids. The native app authenticates to the SAME RevenueCat project with
  the SAME iOS API key, keyed by Supabase user id — **so existing subscribers keep their entitlements
  automatically** (this is critical for cutover; see §16).
- **`engine_config` and all DB-driven config tables** — the native app reads them via the same RPCs.
- **Analytics event taxonomy** — reuse identical event names/props (§9.6, Appendix A). The
  **server-side** completion events (`_shared/posthogCapture.ts`) already fire regardless of client
  platform and must be left alone.

**The API contract is frozen.** If you find yourself wanting to change an edge function's request or
response shape, stop — the RN app is still shipping against it in parallel until cutover.

---

## 3. Tech stack & dependency → native map

Full mapping of every runtime dependency. **Bold = must port. Struck reasoning = skip.**

### 3.1 SDK swaps (near 1:1)

| RN package | Native replacement (SPM) | Notes |
|---|---|---|
| `@supabase/supabase-js` | **supabase-swift** (`Auth`, `PostgREST`, `Realtime`, `Storage`, `Functions`) | The backbone. Verify Realtime v2 + Functions modules cover everything in Appendix A. |
| `react-native-purchases` (RevenueCat) | **purchases-ios** | iOS key `appl_gDwFXEmOsQLWUTUndcldpmruekW`; entitlements `pro`/`basic`; offering `subscriptions` + `sparkle_packs`; configure with Supabase user id as `appUserID`. |
| `@sentry/react-native` | **sentry-cocoa** | `SentrySDK.start`; `environment` from build config; `tracesSampleRate 0.1`; dSYM upload replaces JS sourcemaps. |
| `posthog-react-native` | **posthog-ios** | Same key `phc_CvFb9zvmKupjsgkZKQuaaWNCb7DQPxPpGjaL4AV4arnf`, project 442133. **No autocapture on iOS** — instrument `capture`/`screen` calls manually at every screen/interaction. |
| `@react-native-google-signin/google-signin` | **GoogleSignIn-iOS** | URL scheme already reserved: `com.googleusercontent.apps.523080499421-ct234o3eo93kuakii3df5j29apa61j5h`. Exchange the ID token via Supabase `signInWithIdToken(.google)`. |
| `expo-apple-authentication` | **AuthenticationServices** (`ASAuthorizationAppleIDProvider` / `SignInWithAppleButton`) | Nonce is load-bearing: raw nonce → SHA-256 to Apple, raw nonce to Supabase. Capture `fullName` only on first sign-in → write username. |
| `react-native-fbsdk-next` | **FBSDKLoginKit** | Login only. URL scheme `fb<APP_ID>`. Auto-event-logging + advertiser-ID collection **OFF** (App Privacy "Tracking: No"). Exchange the access token via Supabase `signInWithIdToken(.facebook)`. |
| `expo-notifications` | **UNUserNotificationCenter + APNs** | Major migration — see §12. |
| `expo-image` + `thumbhash` | **Nuke** (`LazyImage`/`FetchImage`) + a **thumbhash Swift decoder** | `AsyncImage` is insufficient (no disk cache). Thumbhash placeholders are used across the whole feed — port the decoder. See §10.4. |
| `expo-image-picker` | **PHPickerViewController** (+ `UIImagePickerController` only if live camera is ever wanted) | PHPicker needs no permission prompt — a nice simplification. |
| `expo-image-manipulator` | **Core Image** + **ImageIO** (`CGImageDestination`) | Resize + 9:16 center-crop + JPEG re-encode + base64. The widget already does ImageIO downsampling — copy that. |
| `expo-media-library` | **PHPhotoLibrary** (`PHAssetCreationRequest`) | Needs `NSPhotoLibraryAddUsageDescription`. |
| `expo-haptics` (74 files) | **UIImpact/UINotification/UISelectionFeedbackGenerator** or `.sensoryFeedback` | Pervasive — bake into the component library. |
| `expo-linear-gradient` | SwiftUI **`LinearGradient`** | — |
| `expo-blur` | **`.ultraThinMaterial`** / `UIVisualEffectView` | — |
| `@react-native-masked-view/masked-view` | `Text.foregroundStyle(LinearGradient…)` or `.overlay(gradient).mask(Text)` | Native makes gradient text trivial. |
| `react-native-reanimated` (40 files) | SwiftUI `withAnimation` / `matchedGeometryEffect` / `PhaseAnimator` / `Canvas`+`TimelineView` | No 1:1 lib; reimplement per animation (§7.4). |
| `react-native-gesture-handler` | SwiftUI `DragGesture` + custom, or UIKit `UIPanGestureRecognizer` | Axis-lock swipe-back + sheet-dismiss are bespoke; reimplement (§10.5). |
| `react-native-keyboard-controller` (14 files) | `@FocusState` + `.ignoresSafeArea(.keyboard)` + `ScrollViewReader` | SwiftUI keyboard avoidance is mostly automatic; the sticky comment/share bars need manual work (§10.6). |
| `@react-native-community/slider` | SwiftUI **`Slider`** (but onboarding uses a custom pan slider — §9.2) | — |
| `expo-symbols` / `@expo/vector-icons` | **SF Symbols** (`Image(systemName:)`); bundle the glyph font only where no SF equivalent | Prefer SF Symbols. |
| `@react-native-async-storage/async-storage` | **Keychain** (tokens) + **UserDefaults**/file (prefs, cache) | Supabase-swift defaults to Keychain — better than the AsyncStorage the RN app was forced into by a 2 KB SecureStore limit (that RN chunking bug does not exist natively). |
| `expo-clipboard` | **UIPasteboard** | — |
| `expo-web-browser` / `expo-auth-session` | **ASWebAuthenticationSession** | Only if a web OAuth fallback is needed; the three providers use native SDKs. |
| `expo-crypto` | **CryptoKit** (`SHA256`) | Apple nonce. |
| `expo-file-system` | **FileManager** + `URLSession` | Widget image downloads into the App Group. |
| `expo-font` + google-fonts | Bundle TTFs, `UIAppFonts` | DM Sans + Quicksand (§7.3). |
| `expo-application`/`device`/`constants`/`localization` | `Bundle.main`, `UIDevice`, `Locale.current` | — |
| `expo-splash-screen` | Launch Screen storyboard | — |

### 3.2 Reimplement in Swift (pure JS logic — no native module)

- **7 Zustand stores** → `@Observable` view models (§6).
- **~75 hooks** → repository methods + view models (§5, Appendix A).
- **Navigation** (`expo-router`) → `NavigationStack` + `TabView` + route enum (§8).
- **Pure helpers** that must stay in server lockstep (§11): `proStatus`, `firstDreamReady`,
  `dreamSmartModel`/`imageModels` pricing, `feedDiversity`, `mentions`/`hashtags` parsing,
  `notificationRouting`, `appVersion` gate.

### 3.3 Do NOT port (unused-at-runtime or backend-only)

- **`expo-video` / `expo-video-thumbnails`** — the "Animate" video feature is **parked, not shipped**
  (see `VIDEO_ANIMATION_PLAN.md`). No runtime imports. When built later → AVKit/`VideoPlayer`.
- **`expo-camera`** — plugin + permission string declared, but **no runtime import**; all photo input
  is via the picker. `NSCameraUsageDescription` is currently vestigial.
- **`expo-secure-store`** — only referenced in a code comment; the RN app moved off it. Use Keychain.
- **`react-native-compressor`** — declared, zero runtime imports.
- **`@tensorflow/tfjs-node`, `@vladmandic/face-api`, `sharp`, `pg`, `@anthropic-ai/sdk`** — these are
  in `scripts/`/backend only. **The app does no ML** — face detect/swap runs server-side. Skip all.

---

## 4. Xcode project structure

```
DreamBot.xcworkspace
├── DreamBot            (app target, iOS 17)
│   ├── App/            AppDelegate/SceneDelegate bits, DI container, RootView
│   ├── DesignSystem/   DesignTokens.swift, Typography, GradientText, GradientButton,
│   │                   BrandSpinner, Toast, OverlayPill, ScreenLayout, sheets
│   ├── Networking/     SupabaseClient wrapper, EdgeFunctionClient (proactive-refresh+401 retry),
│   │                   Repositories (Feed, Social, Create, Auth, Notifications, Profile, Commerce)
│   ├── Cache/          QueryCache actor, persisted-subset store, ImagePipeline (Nuke config)
│   ├── State/          AppState @Observable stores (auth, feed, dream, album, explore, onboarding, drafts)
│   ├── Models/         Codable structs (DreamPostItem, VibeProfile, InboxGroup, EngineConfig, ...)
│   ├── Features/
│   │   ├── Auth/  Onboarding/  Create/  Feed/  Social/  Profile/  Commerce/  Settings/  Notifications/
│   ├── Feed/           UIKit VerticalFeedController (UIViewControllerRepresentable), BotsHPager
│   ├── Shared/         parity-locked pure functions (ProStatus, FirstDreamReady, ModelPricing, ...)
│   └── Resources/      fonts, notification.wav, assets, Localizable
├── DreamBotWidget      (WidgetKit extension, iOS 17 — REUSE existing Swift, see §13.4)
└── Packages (SPM):     supabase-swift, Nuke, purchases-ios, sentry-cocoa, posthog-ios,
                        GoogleSignIn, FBSDK, ThumbHash
```

App Group `group.com.konakevin.radorbad` shared by app + widget.

---

## 5. The data layer (replacing TanStack Query + supabase-js)

This is the single largest reimplementation. The RN app uses `@tanstack/react-query` for a keyed,
persisted, optimistic cache over ~75 hooks. Rebuild its **capabilities**, not its API.

### 5.1 Transport

- **`SupabaseClient`** (supabase-swift) configured with `EXPO_PUBLIC_SUPABASE_URL` + anon key, session
  persisted to **Keychain**. Enable auto-refresh.
- **`EdgeFunctionClient`** — port `lib/edgeFunction.ts`: proactively refresh the token if within 60 s
  of expiry, then `POST {url}/functions/v1/<name>` with `apikey` + `Authorization: Bearer`, and
  **retry once on 401** after a forced refresh. This wrapper is required because iOS throttles
  background refresh; every edge call must present a fresh token.

### 5.2 The cache/repository layer — required capabilities

Build a bespoke `QueryCache` (an `actor`) + per-domain repositories. It must provide:

1. **Keyed entries** with a composite key (root + scoping args), mirroring the RN query keys
   (Appendix A). E.g. feed key = `("dreamFeed", tab, userId, feedSeed, feedShuffle, botUserId)`.
2. **Infinite/cursor pagination** — keyset cursor `{score, id}` for feeds; append pages; terminate
   **only on a genuinely empty page** (an undersized page ≠ end — server-side filters like blocks,
   hidden posts, and dedup legitimately return fewer than `PAGE_SIZE=20`).
3. **Session-frozen reads** — the feed uses `staleTime: Infinity` + no refetch-on-focus so live
   `feed_score` never reshuffles rows mid-scroll. Freshness comes from a **new random `feedSeed` per
   launch** (TikTok cold-open) + pull-to-refresh + a >60 s-background reseed. Key the cache on the
   seed; refetch on reseed, not on staleness.
4. **Persisted subset across cold launch** — ONLY these roots survive on disk (SwiftData or a small
   Codable-to-disk store), with an **app-version buster**: `inboxGrouped`, `newNotificationCount`,
   `dreamMediums`, `dreamVibes`. **The feed is deliberately NOT persisted** (cold open). Everything
   else is memory-only and cleared on sign-out.
5. **Synchronous optimistic writes with snapshot/rollback** — see 5.3; this is the flagship pattern.
6. **Prune-by-predicate** — on reseed, drop previous-seed feed/explore entries whose observer count
   is 0 (the RN app accumulated ~1,600 orphaned entries → multi-second like-sweep stalls). Keep an
   observer count per entry.
7. **Clear-on-sign-out** — wipe the whole cache + persisted store + reset all `@Observable` stores.
8. **Foreground behavior** — on background: cancel in-flight fetches (iOS suspends them and would
   deadlock dedup on resume). On foreground after >60 s: reseed the feed + invalidate scoped queries.
9. **Invalidation fan-out** — mutations invalidate scoped keys (e.g. follow → both profiles +
   followers/following/followingIds/outgoingRequests + feed-stale-without-refetch).

> Consider an existing Swift async-query library, but the optimistic semantics below are bespoke
> enough that a purpose-built `QueryCache` you fully control is the safer call.

### 5.3 The optimistic-update pattern (must replicate exactly)

Reference: `hooks/useToggleLike.ts`. This governs likes, reposts, favorites, follows, comments. The
sequence:

1. **Flip the membership set SYNCHRONOUSLY before any `await`** (e.g. `likeIds: Set<UUID>`) so the
   heart lights instantly, in parallel with the burst animation.
2. Cancel in-flight queries for that membership key.
3. **Bump the count across ALL feed caches** that could contain the post — roots `dreamFeed`,
   `userContextFeed`, `searchPosts`, `my-dreams`, `favoritePosts`, `userPosts`,
   `publicProfilePosts`, `explore` — handling both `{rows}` and flat-array page shapes, with a cheap
   **contains-guard** that skips entries not holding the post (a miss is an id scan, not a page copy —
   this was the multi-second-stall fix).
4. **Patch the `@Observable` stores too** (`AlbumState.posts`, `FeedState.pinnedPost`) with explicit
   rollbacks — the cache and the stores must stay coherent.
5. On error, restore every snapshot + run every rollback.
6. **No settle-time invalidate** (read-after-write race). Membership syncs from the dedicated
   `likeIds`/`repostIds` query, refetched on mount for cross-session correctness.

Reposts go through the RPC `toggle_repost` (server-authoritative `{reposted, repost_count}`) and
reconcile membership to the server's answer on success.

### 5.4 Realtime — exactly two channels

supabase-swift Realtime v2 `postgres_changes`. **Both need catch-up reads** because iOS drops the
socket in background and Postgres-changes does not replay missed events.

1. **`user-<uid>`** (app-lifetime, in the root): binds
   - `notifications` INSERT filter `recipient_id=eq.<uid>` → in-app toast + invalidate inbox/badge +
     dreams-tab auto-ack.
   - `uploads` `*` filter `user_id=eq.<uid>` → invalidate `userPosts`/`my-dreams`.
   - **Publication caveat:** only `notifications, uploads, user_recipes, dream_queue` are in the
     `supabase_realtime` publication; binding an unpublished table kills the whole channel.
2. **`dream_queue:<queueId>`** (transient, on the loading screen): `dream_queue` UPDATE filter
   `id=eq.<id>` to watch a render finish, plus a catch-up `.select().maybeSingle()` on subscribe and
   a backstop poll (the render can complete before the subscription attaches). See §9.3.

### 5.5 Models to define first

- **`DreamPostItem`** — the canonical post/feed model (from `DreamCard.tsx`, mapped from `get_feed`
  rows by `lib/mapPost.ts`). Fields include `id`, `userId`, image variants (`imageUrl`,
  `imageUrlDisplay` ~150 KB feed, `imageUrlThumb` ~35 KB grid, `imageUrlHq` 4× upscale), `thumbhash`
  (~25-byte blur), `media[]`/`mediaCount` (galleries), caption/description, `username`/`avatarUrl`,
  like/comment/repost counts, `allowReposts`/`allowDownloads`, `pinnedAt`, `isPublic`/`postedAt`,
  `surfaceType` + reposter attribution, `dreamMedium`/`dreamVibe`/`model`/`faceSwapMode`.
- **`VibeProfile`** (v2 JSONB in `user_recipes.recipe`) — `moods` (4 bipolar 0–1 axes), `dreamSeeds`
  (`places`, `characters` vestigial), `dreamCast[]` (`role: self|plus_one|pet`, `storagePath`,
  `description`, `gender`, `age`, `physicalSummary`, `relationship`), `partnerLibrary[]` (roster ≤5),
  `activePartnerId` (mirrored into `dreamCast.plus_one`), `avoid`. Reimplement
  `migrateLegacyPlusOne`/`syncActivePartnerMirror`.
- **`InboxGroup`**, **`EngineConfig`**, **`ImageModel`**, **`DreamMedium`/`DreamVibe`**,
  **`SparklePack`**, **`Comment`**, plus thin structs for the RPC returns in Appendix A.

---

## 6. State management (replacing Zustand)

All 7 stores are pure in-memory (no persistence middleware) and reset on sign-out. Map each to an
`@Observable` class injected via the environment.

| Zustand store | Swift `@Observable` | Key state |
|---|---|---|
| `auth.ts` | `AuthState` | `session`, `user`, `isAdmin`, `isSuperAdmin` (sync from user id), `isPro/isPaidPro/isBasic/proTrialEndsAt/isDreamEligible` (from `get_my_account` via `ProStatus`), `initialized`. Owns `signOut` (which wipes all other stores + cache). |
| `dream.ts` | `DreamState` | `DreamConfig` (the create form: mode, photo, medium/vibe, model, dreamSmart, useExactPrompt, tier…), `result`, `activeJobId`, `activeJobFailure`, `pendingCreatePreset`, `photoClassification`. Ephemeral staging. |
| `onboarding.ts` | `OnboardingState` | `step`, `isEditing`, `isHydrated`, `profile: VibeProfile`, `castUploadsInFlight` (kickoff waits for 0), `scrollLocked`, `chromeHidden`, `firstDreamJobId`, `firstDreamStatus`. |
| `feed.ts` | `FeedState` | `pinnedPost`, `feedSeed` (random per launch), `feedShuffle` (0.15), reset tokens, `homeFeedRefreshing`, `hudVisible`, `viewingOwnDreams`, `pendingPostId`/`pendingNotificationData`. |
| `album.ts` | `AlbumState` | `ids`, `posts` (grid snapshot for instant detail mount), `albumSource`, `currentPostId`. Patched by optimistic mutations. |
| `explore.ts` | `ExploreState` | `pendingMedium`, `pendingVibe`, `searchActive`. |
| `commentDrafts.ts` | `CommentDraftsState` | `drafts: [postId: String]` WIP text; `clearExcept`. |

Store super-property `environment` and reset semantics must match: sign-out clears session + wipes
feed/onboarding/dream/album/explore stores + clears the cache + persisted store.

---

## 7. Design system (tokens, typography, components)

### 7.1 `DesignTokens.swift`

Port `constants/theme.ts` verbatim. Dark-only app.

- **Colors:** `background #000000`, `surface #0F0F14`, `card #1A1A24`, `border #2A2A3A`; accent
  `#A78BFA` (+ `accentLight #C4B5FD`, `accentDark #7C5CD8`, `accentBg`, `accentBorder`); `like/error
  #E8485F`, `success #4CAA64`, `warning #FFB800`; text `#FFFFFF / #8E8E9E / #3E3E4E / #6E6E7E`,
  `bodyOnDark rgba(255,255,255,0.88)`, `subtleOnDark 0.68`; overlays as listed in theme.ts:36-42.
- **Gradients:** `dream [#FFD700,#FF8C00,#FF4500]`, `bot [#44DDCC,#6699EE,#BB88EE]`, `accent
  [#A78BFA,#7C5CD8]`, and **THE brand gradient `[#A78BFA,#F9A8D4,#5EEAD4]`** (moon-purple → cloud-pink
  → star-teal) used on every wordmark/hero/premium CTA. Medium badges: Real Face teal `#5EEAD4`,
  Dream Art pink `#F9A8D4`.
- **Timing/gesture:** `HUD_FADE_MS 120`; swipe `DISMISS_THRESHOLD 40`, `VELOCITY_THRESHOLD 300`.
- **`ui` fragments** (theme.ts:83-233) → SwiftUI `ViewModifier`s: `buttonPrimary` (accent, radius 14,
  padV 16), `pill`/`pillActive` (radius 20), `tile`/`tileSelected` (radius 16, border 1.5),
  `sideButton`/`sideIcon`/`sideCount` (feed rail with text shadows), `iconCircle` (88pt accent).
  Corner radius convention: 12–20 cards/pills, 28–999 CTAs.

### 7.2 Responsive scaling

The RN app scales everything against an iPhone-14 base (844×390) via
`verticalScale`/`fontScale`/`horizontalScale`. **In SwiftUI, mostly discard this.** Use Dynamic Type,
`@ScaledMetric`, and adaptive layout. Provide a `useDeviceClass()` equivalent
(`isSmall h<700`, `isLarge h≥900`, `isTablet w≥600`) for the few branch points. iPad shows the
fullscreen phone layout (`supportsTablet: true`); iPad branches are minimal.

### 7.3 Typography

- **Display/wordmark:** Quicksand (SemiBold 600 / Bold 700). **Body:** DM Sans (400/500/600/700).
  Bundle the TTFs, register in `UIAppFonts`.
- The RN `AppText` wrapper maps `fontWeight` → the right DM Sans face (custom fonts bake weight into
  the family name). In SwiftUI, define `Font` extensions per weight; use a `BrandText` view if you
  want the same drop-in convenience.
- **Gradient wordmark quirk:** the RN gradient titles hard-set `allowFontScaling={false}` because the
  fixed mask height clipped descenders under OS "Larger Text". In SwiftUI, render brand wordmarks with
  a **fixed/ capped Dynamic Type size** (`.dynamicTypeSize(...DynamicTypeSize.large)` or a fixed
  frame) so glyphs never outgrow the gradient mask.

### 7.4 Component library (~18 foundational primitives)

Build these first; the rest of the app composes from them:

- `BrandText` (Quicksand/DM Sans wrappers), **`GradientText`** (static) + **`AnimatedGradientText`**
  (flowing — a scrolling `LinearGradient` masked to text via `Canvas`+`TimelineView`; normalize speed
  to ~32 px/s so every word flows at the same rate), **`GradientButton`** (brand-gradient pill,
  near-black `#08080F` text, Quicksand semibold, purple glow).
- **`BrandSpinner`** — 8 dots sampled from the brand gradient orbiting a ring rotating 360° over
  1540 ms, each dot's opacity waving on a staggered phase (`Canvas`+`TimelineView` or a `ZStack` of
  8 `Circle`s with `.rotationEffect`). `WaveLoader` (5 lavender dots, traveling wave), `Skeleton`
  (shimmer), `SparkleField` (decorative twinkle).
- `OverlayPill` (dark translucent pill; active bg `rgba(0,0,0,0.6)`), `Toast`/`ToastHost` (top gradient
  banner, imperative `show`, swipe-dismiss), `ScreenLayout` (back/title/right-action scaffold).
- Global imperative sheets: **`PremiumGateSheet`**, `CustomAlert`, `ConfirmDialog`,
  `AvatarConfirm` — mounted app-level, above navigation.
- Feed/media: `PostTile`, `PostGrid`, `GalleryCarousel`, `DreamCard`, plus the pagers (§10).

Haptics to preserve: `.selection` on toggles, `.impact(.light/.medium)` on taps/CTAs, `.success` on
purchase/gift completion.

---

## 8. Navigation & deep links

### 8.1 Structure

- Root: a router view that branches on auth/onboarding state (port `app/index.tsx` gating):
  `!initialized` → StartupLogo; `!session` → Auth; else read `users.has_ai_recipe` **with 5-attempt
  backoff and NEVER route an established user to onboarding on a transient read failure** → Onboarding
  if false, else the tab bar.
- **`TabView`** with 5 tabs: Home / Bots / Create / Search(Top) / Profile. Re-tap behaviors: Home →
  scroll-to-top + quiet reshuffle; Bots → reset to "All" + refetch; Search → close search or
  reshuffle grid; Profile → reset. Tab bar fades with `hudVisible`; press "squish" to 0.92.
- **`NavigationStack`** per tab for pushes; separate presentation for modals/sheets.

### 8.2 Presentation-style map (port `constants/navigationPresets.ts`)

| RN preset | SwiftUI equivalent |
|---|---|
| `MODAL_SWIPEABLE` (card + full edge swipe-back) | pushed `NavigationStack` destination (interactive pop) — settings, sparkleStore, inbox, welcome-gift, photo/[id], user/[userId] |
| `SHEET_DISMISSIBLE` (formSheet, swipe-down) | `.sheet` with detents — comments |
| `MODAL_LOCKED` (card, no swipe-back) | `.fullScreenCover` (no interactive dismiss) — dream/loading, dream/reveal, reset-password |
| `FLOW_LOCKED` (linear, no back) | a controlled pager with disabled back — onboarding |
| `OVERLAY_TRANSPARENT` (transparent, fade) | `.fullScreenCover` with clear background + internal slide-up — sharePost |

**Important:** `photo/[id]` and `user/[userId]` **disable the system interactive-pop gesture** because
it fights in-screen vertical paging/scroll — they implement a custom **axis-locked swipe-back**
(§10.5). Reproduce this, don't rely on `NavigationStack`'s default pop for those two.

### 8.3 Deep links

- URL scheme `dreambot://`; Universal Links `applinks:dreambotapp.com` (AASA served by the website).
- Handle via `onOpenURL` / `NSUserActivity`. Port the routing in `lib/notificationRouting.ts` +
  `AuthInitializer` (`app/_layout.tsx`): auth callbacks (PKCE `?code=` → `exchangeCodeForSession`;
  implicit `#access_token` → `setSession`), password recovery (`reset-password` / `type=recovery`),
  `post|photo/<id>` → `photo/[id]` (warm push vs cold "pin in feed"), `user/<id>`. Widget deep-links:
  `dreambot://photo/<id>` and `dreambot://create`.
- Cold vs warm matters: warm links push directly; cold links stash a pending id the feed consumes.

---

## 9. Feature port guides

Each subsection: what to build, the data it touches, and the non-obvious gotchas.

### 9.1 Auth

- **Screens:** Welcome (`(auth)/index` — social buttons Apple/Google/Facebook), Login (email/password
  + compact social row + forgot-password), Signup (username + email + password ≥8, username moderated
  pre-signup). Email confirmation is REQUIRED in prod (`mailer_autoconfirm=false`) → signup returns no
  session until the emailed link is tapped ("check your email" + 30 s resend cooldown).
- **OAuth (all native SDK + ID/access-token exchange, NOT web redirect):**
  - Google: GoogleSignIn SDK → `signInWithIdToken(.google, idToken)`.
  - Apple: `ASAuthorization` with FULL_NAME+EMAIL, SHA-256 nonce → `signInWithIdToken(.apple,
    identityToken, nonce: rawNonce)`; on first sign-in capture `fullName` → derive + write username.
  - Facebook: FBSDK LoginKit (`public_profile`,`email`) → `signInWithIdToken(.facebook, accessToken)`.
- **Post-auth routing:** read `users.has_ai_recipe` → tabs if true else onboarding, BEFORE navigating.
- **Password:** reset lands via the recovery deep link (top-level route, not inside the auth group);
  in-app change re-auths with the current password first, then `updateUser(password:)`.
- **Session:** persist to Keychain (supabase-swift default). AppState observer to resume auto-refresh
  on foreground.

### 9.2 Onboarding

The whole flow is a single controlled pager that **mounts all steps** but gates side-effects on an
`isActive` flag (critical — the reveal's first-dream kickoff must never fire on an off-screen mount,
or it burns the one free first dream on a faceless render).

- **Step order:** Welcome → InfoNightly → Locations → InfoCast → DreamCast → InfoMood → MoodSliders →
  **SaveContinue (the cutoff)** → MeetBots → Reveal. Info + cutoff/bots/reveal are `skipInEdit`.
- **Locations:** DB `location_cards` (grouped by `picker_category`), min 1, 2-col tile grid,
  select-all per section. **MoodSliders:** 4 bipolar 0–1 axes from `get_mood_axes` (custom pan slider,
  not a stock control — port the drag → value + lock the pager during drag). **DreamCast:** self +
  plus_one photo slots (library-only, no crop); see §9.3 cast pipeline. **MeetBots:** follow ≥3 bots
  (`useBotUsers`/`useFollowingIds`); regenerate feed seed on Next.
- **Lock rules:** forward-only region at cutoff/bots/reveal; `save-continue` allows Back, `meet-bots`/
  `reveal` do not; pager scroll disabled during slider drags and cast uploads.
- **The first-dream cutoff race (port faithfully):** on "Let's go", detached async: poll every 150 ms
  until `castUploadsInFlight==0` AND `isCastReadyForKickoff(dreamCast)` (capped at 30 s; if not ready,
  DEFER kickoff to the foreground reveal — prevents faceless enqueue). If ready:
  `describeCastPhotos()` (re-describe any missing), `saveVibeProfile`, fire-and-forget
  `finalizeOnboarding` (welcome bonus + `welcome_gift` notification), then `enqueueFirstDream`
  (`fetchEdge('enqueue-dream', {first_dream:true, vibe_profile})`; 409/`first_dream_already_claimed`
  → treat as already-claimed). Advance to MeetBots so the render happens during bot selection.
- **Reveal:** decide via a pure function (`decideRevealAction`) → `noop` (off-screen guard) /
  `route_feed` / `show_error` / `await_job` (poll `dream_jobs` by id every 2.5 s, 5-min ceiling) /
  `show_loader` / `kickoff` (foreground start). On success: "Post to my feed" → `/post/new` (the render
  already persisted a PRIVATE upload; Post flips it public) or "Skip" → welcome-gift.
- **`isCastReadyForKickoff` MUST match the server** (`_shared/firstDreamTiers.ts`) — parity-locked
  (§11).

### 9.3 Create & dream pipeline

- **Create screen:** header (sparkle pill → store, camera/pick), photo card, **Style + Vibe pickers**
  (with a live FACE/DREAM-ART badge + face-swap lamp), collapsible controls that fold in lockstep with
  the keyboard (New Scene / Restyle toggle, quality tier, **ModelPicker**, **Mode toggle
  DreamBot/Direct**), prompt textarea (max = `engineConfig.promptMaxLength`, 2000), sticky Dream CTA.
- **Modes:** surprise / prompt / Direct (verbatim, no medium/vibe/face-swap) × New Scene / Restyle
  (photo) × DLT / "Dream this again" presets. There is no separate "Chaos"/"Cinematic" client mode —
  those are server vibe concepts. Sticky prefs (medium/vibe/exact-prompt/dreamSmart) → `UserDefaults`;
  sticky model is DB-backed (`users.pro_mode_flux_model`).
- **DreamSmart:** when ON and not exempt (Direct/Restyle/New Scene), if the current model isn't in the
  style's `smart_dream_models`, swap to the cheapest in-set model and **commit it forward**. Cost
  display uses the same pricing table the server charges (`imageModels`/`modelPricing`) — **parity-
  locked** so shown price == charged price. Server is the authoritative charge (client only pre-gates).
- **Enqueue + loading (the async queue path, gated by `EXPO_PUBLIC_DREAM_QUEUE_ENABLED`):** generate a
  client UUIDv4 `job_id`, call `enqueue-dream` (`{dream_id}` back). `job_id == dream_queue.id ==
  dream_jobs.id == sparkle ledger reference_id`. **Generation is triggered by the loading screen's
  appear, not the Dream button.** The loading screen: subscribe to `dream_queue:<id>` realtime UPDATE
  → on `completed` read the `uploads` row → reveal; on `dead_letter` → failure card (already refunded).
  Plus a **catch-up fetch on subscribe** and a **backstop poll**, and a **`dream_jobs` polling
  fallback** (AppState-active, transport-failure, 5 s interval, 90 s hard timeout) — port all of it;
  realtime alone is not reliable on iOS. Errors: 402 insufficient (no refund, back to gate), 429
  too-many-inflight, pre-flight moderation (calls `refund-self-moderation`), transport (refund pending;
  server `refund-stuck-jobs` backstops within 5 min).
- **Reveal:** full-bleed image (memory-disk cache, 600 ms crossfade), pinch-zoom + two-finger pan,
  tap-to-toggle HUD, "Post to my feed" (saves private upload → `/post/new`) / "Skip". Sync the widget
  on mount.
- **Photo input:** PHPicker (+ optional camera), Core Image/ImageIO resize (1024w, q0.8, JPEG) + 9:16
  center-crop + base64; sent inline as a data URL in the edge payload (not pre-uploaded).
  `classify-photo` at attach time for New Scene. **Cast photos DO upload** to the private
  `cast-photos` bucket + signed URL + `describe-photo` (needs an HTTP-reachable URL, not base64).
- **`extract-style` has no client caller** — DLT reads the frozen recipe off the `uploads` row. Skip.

### 9.4 Feed (the crown jewel — see §10.1 for the pager)

- **Data:** RPC `get_feed(p_user_id, p_limit=20, p_seed, p_tab['forYou'|'following'|'bots'], p_shuffle,
  p_cursor_score/id, p_bot_user_id?, p_medium?/p_vibe?)`. Keyset pagination. Per-page **diversity**
  (max 2 consecutive same-user, max 3 same-medium; bots tab skips). Session-frozen; reseed for
  freshness. Prefetch both home tabs + all bot feeds + first-N image bytes on mount.
- **Home:** Following / Explore(forYou) via `OverlayPill`. Pinned post (deep-link/just-created) prepends
  forYou. Re-tap reshuffle = new seed + prune + remount the pager (one clean frame).
- **Impression loop (load-bearing for variety):** on each settle, after a **1 s dwell**, call RPC
  `record_impression(userId, uploadId)` — deduped per-mount. Fire the **landing card once explicitly**
  on mount (the pager only emits on change; without this the top posts escape the seen-penalty).

### 9.5 Social

- **Post card (`DreamCard`):** hero image (`expo-image` → Nuke, `contentFit cover`, memory-disk, per-id
  recycling key, high priority for the visible card, thumbhash placeholder, auto-retry on error);
  pinch-zoom + swipe-left-to-profile; single-tap HUD, double-tap like with heart burst; gallery
  edge-tap paging; HUD (author row + follow pill + timestamp + `ExpandableDescription` rendering
  @mentions/#hashtags + owner-only model badge); side action rail (like/long-press→likers, comment,
  repost [hidden when disallowed/private], save, share, fit toggle, admin variants); long-press →
  action sheet.
- **Grid tile (`PostTile`):** `tileImageUrl` (prefers the static thumb variant to spare Supabase
  transform quota), thumbhash, memo'd; tap stashes album source into `AlbumState` and pushes
  `photo/[id]`.
- **Interactions:** likes/reposts/favorites/comments/follows via the optimistic pattern (§5.3).
  Reposts via `toggle_repost`. Comments: standalone sheet route (`comments`) + the inline
  **`CommentOverlay` morph** (image shrinks to a top thumbnail while the comment pane slides up — a
  single `progress` 0→1 driving `matchedGeometryEffect` + `.move(.bottom)`) with swipe-down dismiss
  and a **custom keyboard-tracking sticky input** (§10.6), @mention autocomplete, replies, optimistic
  append + count bumps + moderation. Share sheet (`sharePost`) grows above the keyboard. Block/report
  via `block_user` (atomic — severs follows both ways) + `reports`.
- **Notifications inbox:** `get_inbox` grouped rows; ~25 notification types with per-type icon/copy;
  swipe-to-delete rows; inline follow-request Accept/Accept&Follow-Back/Deny; badge from
  `get_new_notification_count` ("viewed=read" after `last_inbox_view_at`) driving the app-icon badge +
  profile-tab dot + inbox pip identically; actor sheet for aggregable groups; "N dreams ready" opens a
  scoped album; realtime toast on new notification.
- **Profiles:** own (Posts/Dreams/Saved/Reposts grids + Followers/Following, dreams filter
  persisted, multi-select bulk actions, sticky collapsing header) and public (`get_public_profile`,
  visibility gate `!blocked && (public || following || own)`, avatar-zoom, "•••" gift/block/report,
  axis-lock swipe-back). Follow via `useToggleFollow` (public instant / private → request + notify),
  **feed marked stale with no refetch** (a live refetch reshuffles the card under the thumb).

### 9.6 Commerce

- **RevenueCat (purchases-ios):** configure once post-auth with Supabase user id as `appUserID`.
  Entitlements `pro`/`basic`; offering `subscriptions` (all 4 sub packages) + `sparkle_packs`.
  - **Sparkle packs** (product ids `com.konakevin.radorbad.sparkles.{15,40,90,200,500}_v2`): 15/$1.99,
    40/$4.99, 90/$9.99, 200/$19.99, 550/$49.99.
  - **Pro:** `.pro.monthly` $9.99 / `.pro.yearly` $79.99; perks: nightly dream, 75 sparkles/mo
    (yearly 900), 100 HD/mo, 14-day trial.
  - **Basic:** `.basic.monthly` $4.99 / `.basic.yearly` $39.99; perks: nightly, 20 sparkles/mo, 20 HD/mo.
  - **Model costs** (`imageModels`, mirrors server `modelPricing`): 1/2/3/5 scale; default Flux 1.1
    Pro = 1. Auto-select cheapest via `lowestPricedModel` + `MODEL_DISPLAY_ORDER` tie-break.
- **Pro status (`ProStatus` — parity-locked, §11):** Pro if active-paid OR active-trial; re-validate
  timestamps on every read so a missed EXPIRATION webhook can't leave permanent Pro. Trial length from
  `engine_config.pro_trial_days`.
- **Paywalls:** `subscribe` (Free/Basic/Pro, billing toggle, mandatory auto-renew legal footer),
  `sparkleStore` (packs + gift flow), and ONE global imperative `PremiumGateSheet` (reasons
  `sparkles|hd_premium|hd_cap|nightly_premium` → route to store/subscribe). `welcome-gift` +
  `giftUnwrap` celebratory screens.

---

## 10. The hard parts / risk register

Ranked by risk. These are where a naive port fails.

### 10.1 The two custom interruptible feed pagers (HIGHEST RISK — the reason to port)

The RN app hand-rolls two pagers because native FlatList gives you *fast-non-interruptible* XOR
*slow-interruptible*, never both. The whole "native feels better" thesis rests on nailing these.

- **VerticalPager** (home/album/detail feed): absolute-positioned strip driven by one offset value;
  drag 1:1; on release, advance if `velocity < -350 px/s` OR drag > 18% page height; **snap =
  `withTiming` 170 ms `easeOut(quad)`** with NO long deceleration tail; **interruptible** — a new
  touch cancels the running animation and takes over from the current position; edge rubber-band
  (0.4, or 0.85 at the pull-to-refresh edge); **id-anchoring** (if the data prefix shifts, re-align to
  the anchored item's new index with no animation); pull-to-refresh at >110 px or a downward flick;
  imperative `scrollToIndex`/`refresh`.
- **BotsHorizontalPager:** the same on X; a vertical drag must FAIL immediately so the inner vertical
  pager takes over with zero wait.
- **Deferred hydration:** on first mount render ONLY the active card, expand the window (±2) on the
  FIRST of {interactions settle, a 600 ms fallback timer} — the timer prevents a wedged-feed bug.
- **Surgical cell re-render:** per-cell `isActive/isLiked/isSaved` primitive flags so a like re-renders
  ONE card, a swipe two — never the whole window.

**Recommendation:** build the vertical feed as a **`UICollectionView`** (paging, custom layout, cell
reuse) wrapped in `UIViewControllerRepresentable`, with a **custom pan + `UIViewPropertyAnimator`**
snap you can interrupt (`UIViewPropertyAnimator` is pausable/reversible — ideal). Do NOT assume
SwiftUI `ScrollView(.paging)` matches the physics; prototype it, but plan for UIKit. This is the one
component to build and profile FIRST (spike it in Phase 0) — if it doesn't beat the RN feel on a real
device, the whole project's premise needs re-examination.

### 10.2 Realtime reliability on the loading screen

iOS drops the websocket in background and `postgres_changes` doesn't replay. The dream loading screen
already compensates with subscribe-time catch-up + backstop poll + a full `dream_jobs` polling fallback
with lifecycle recovery. **Port all layers** — do not ship realtime-only. Same for the `user-<uid>`
channel (foreground invalidation covers missed events).

### 10.3 Push migration (backend change) — §12.

### 10.4 Image pipeline (the other half of the perf win)

Memory+disk cache (Nuke), thumbhash blur placeholders decoded natively, per-id recycling keys,
**distinct size variants per surface** (thumb → grid, display → feed, hq → save), elevated download
priority for the on-screen card, next-3 prefetch on each settle + adjacent-tab/bot fan-out prefetch.
Supabase image-transform quota is TINY (100/cycle) — **serve pre-generated static variants, never
on-the-fly transforms** (there's a documented incident where transforms tripped a spend cap and
restricted the whole project). See `tileImageUrl`/`imageUrl.ts`.

### 10.5 Gesture-composed overlays & axis-lock swipe-back

The comment morph, likes sheet, share sheet, avatar zoom, and the axis-locked swipe-back all run
gestures **simultaneously** with the pager pan (a back-gesture must never hold the vertical swipe
undecided). `photo/[id]` and `user/[userId]` disable the system pop and implement their own axis-lock.
Reproduce with `UIPanGestureRecognizer` + `simultaneous` recognition, or SwiftUI `.simultaneousGesture`
with careful `.highPriorityGesture` ordering.

### 10.6 Keyboard-tracking sticky inputs

The comment overlay and share sheet ride a sticky input bar above the keyboard continuously (the RN
app hand-rolled this because `KeyboardStickyView` corrupted in absolutely-positioned panes). Native is
easier (`keyboardLayoutGuide` / `@FocusState` + `.safeAreaInset`) but still needs care for the
morph/grow-sheet cases and the "swipe-down closes keyboard first, then the sheet" behavior.

### 10.7 Session continuity across the RN→native cutover — §16.

---

## 11. Parity-locked shared logic (must match the server)

These pure functions exist in the client AND are mirrored server-side. If the Swift port drifts, you
get wrong prices, faceless dreams, or wrong Pro state. Reimplement faithfully and, ideally, test
against the same fixtures the RN unit tests use.

| Logic | Client source | Server mirror | Consequence if it drifts |
|---|---|---|---|
| Pro/trial/basic status | `lib/proStatus.ts` | `is_pro_active()` SQL + `scripts/lib/nightlyEligibility.js` | Wrong entitlement UI / gating |
| First-dream cast readiness | `lib/firstDreamReady.ts` | `_shared/firstDreamTiers.ts` | Faceless first dream (burns the free render) |
| Model pricing / cheapest pick | `constants/imageModels.ts` (`lowestPricedModel`) | `_shared/modelPricing.ts` + `_shared/smartDream.ts` | Shown price ≠ charged price |
| DreamSmart model constraint | `lib/dreamSmartModel.ts` | server roll | Charge ≠ render |
| Feed diversity | `lib/feedDiversity.ts` | (client-only, per page) | Clumpy feed |
| @mention / #hashtag parsing | `lib/mentions.ts` / `lib/hashtags.ts` | trigger `sanitize`/link tables | Broken links |
| App-version gate | `lib/appVersion.ts` + `engine_config.min/latest_app_version` | `engine_config` | Force-update fails |
| Vibe-profile migration | `lib/dreamCastRoster.ts` (`migrateLegacyPlusOne`, `syncActivePartnerMirror`) | reads `user_recipes.recipe` | Wrong partner in dream |

Also note: **all user text still routes through the server sanitizer** (`_shared/sanitizeUserText.ts`)
because edge functions do it — the client doesn't need to re-implement injection neutralization, but
display-side @mention/hashtag parsing must match.

---

## 12. Push notifications migration (the one backend change)

**Current:** `hooks/usePushNotifications.ts` gets an **Expo push token** (`ExponentPushToken[...]`) and
upserts it into `push_tokens(user_id, token, platform, updated_at)`. The `send-push` edge function
reads those tokens and POSTs to `https://exp.host/--/api/v2/push/send`.

**Native reality:** a Swift app registers with APNs and gets a **raw APNs device token** (hex) — a
different format. Expo's relay won't take that cleanly without the Expo notifications native pieces.

**Recommended: migrate `send-push` to APNs directly.**
1. **Client (Swift):** `UNUserNotificationCenter.requestAuthorization`, `registerForRemoteNotifications`,
   upload the **raw APNs device token** (hex) to `push_tokens.token` (platform `ios`). Implement tap
   routing via `UNUserNotificationCenterDelegate` (foreground suppression, warm tap, cold-start launch
   options) → port `lib/notificationRouting.ts`. Badge from RPC `get_new_notification_count`.
2. **Backend (`send-push` edge fn):** change ONLY the final delivery — POST to Apple's HTTP/2 endpoint
   `api.push.apple.com` with a **token-based (.p8) APNs auth key** (JWT `ES256`), header
   `apns-topic: com.konakevin.radorbad`. The whole decisioning layer (activity/view/sibling gates,
   aggregation copy in `_shared/notify.ts`) is transport-agnostic and stays. `DeviceNotRegistered`
   pruning → APNs `410 Unregistered`. `data` payload / `badge` / `sound: notification.wav` map to APS
   fields.
3. **Coexistence during cutover:** while both apps ship, `push_tokens` will hold both Expo tokens (RN)
   and APNs tokens (native). Either (a) add a `token_type` column and branch in `send-push`, or (b)
   detect format (`ExponentPushToken[` prefix → Expo, else APNs). Keep both delivery paths until the
   RN app is retired.

You'll need an **APNs Auth Key (.p8)** in the Apple Developer portal (may already exist for Expo's
setup) and the key stored as a Supabase edge secret.

---

## 13. Build, signing, widget & CI pipeline

### 13.1 Project & dependencies
- Committed `.xcworkspace` with app + widget targets; SPM for all SDKs (§3.1).
- **Signing:** reuse the existing Apple Distribution cert + App Store provisioning profiles (Team
  `43VMZ5KMW4`, bundle ids `com.konakevin.radorbad` + `.widget`). **fastlane match** recommended to
  manage certs across both targets. Export from Expo/EAS credentials or regenerate from the portal.

### 13.2 Capabilities / Info.plist (from `app.config.js`)
- Associated Domains `applinks:dreambotapp.com`; App Group `group.com.konakevin.radorbad`; Push
  Notifications + APNs; Sign in with Apple; In-App Purchase; WidgetKit extension.
- `ITSAppUsesNonExemptEncryption=false`; `FacebookAutoLogAppEventsEnabled=false` +
  `FacebookAdvertiserIDCollectionEnabled=false` (App Privacy "Tracking: No");
  `NSPhotoLibraryAddUsageDescription`; URL schemes (`dreambot`, Google reversed-client-id,
  `fb<APP_ID>`); bundle `notification.wav`; `UIAppFonts` (DM Sans, Quicksand); portrait-only;
  `supportsTablet` (iPad 13" screenshots required).

### 13.3 Versioning & submission
- Replace EAS remote autoIncrement with **`agvtool`/fastlane `increment_build_number`**; **bump the
  widget's `CFBundleVersion` in lockstep** with the app (a mismatch fails validation).
- Build/submit via **fastlane `gym` → `pilot`/`deliver`** with the ASC API key (.p8), ASC app id
  `6761505205`. Or Xcode Organizer.
- Keep a `release.sh`-equivalent (bump version + tag `vX.Y.Z` + push). Log builds in `RELEASES.md`.
- Sentry **dSYM upload** (`sentry-cli upload-dif` / SPM build phase) replaces JS sourcemaps.

### 13.4 Widget — already native, reuse verbatim
The WidgetKit widget (`targets/widget/DreamWidget.swift`) is **already Swift and reusable** — add it as
an extension target in the new project (drop the `@bacons/apple-targets` generation). The app-side
bridge (`DreamBotWidgetModule.swift`) is replaced by calling `UserDefaults(suiteName:
group.com.konakevin.radorbad)` + `WidgetCenter.shared.reloadAllTimelines()` directly from Swift.
Reimplement `lib/widgetSync.ts` (query latest 6 uploads → download `image_url_display` into the App
Group `widget/` dir → prune → commit `{dreams:[{id,file}]}` JSON) using supabase-swift + FileManager.
Data contract stays identical.

### 13.5 In-app force-update gate
Port `ForceUpdateGate` + `lib/appVersion.ts`: read `engine_config.min_app_version`/`latest_app_version`
via `get_engine_config`, compare with the bundle version, gate/nudge. Server-driven, independent of the
App Store — keep it.

### 13.6 CI
Replace the `npm run check` gate with **`xcodebuild test` + SwiftLint/SwiftFormat** in
`.github/workflows/`. The backend CI (dbspec, edge-fn deploys, bots) is unchanged.

---

## 14. Testing strategy

- **XCTest** for the parity-locked pure functions (§11) — port the existing jest fixtures so the Swift
  math provably matches the server (pricing, pro-status, first-dream readiness, feed diversity,
  mention parsing).
- **XCTest** for the `QueryCache` optimistic/rollback/prune semantics (the RN app has dedicated tests
  for the like-sweep and cache pruning — replicate them).
- **Snapshot tests** (e.g. swift-snapshot-testing) for the design-system components + key screens.
- **Manual device matrix** for the feed pager physics (the one thing you can't unit-test) — profile
  with Instruments on a low-end device; target 120 fps on ProMotion, zero dropped frames on scroll.
- The **backend dbspec + edge-fn tests stay in the RN/backend repo** — they validate the unchanged API.

---

## 15. Phased implementation plan & effort estimate

Build to parity behind TestFlight; keep shipping the RN app until cutover (§16). Each phase has a
demoable outcome and acceptance criteria.

| Phase | Scope | Outcome / acceptance | Rough size (1 senior iOS eng) |
|---|---|---|---|
| **0. Foundations + feed spike** | Xcode project, SPM, DesignTokens + core components, SupabaseClient + EdgeFunctionClient, Codable models, `QueryCache` skeleton, navigation shell, **and a throwaway spike of the vertical pager on real data** to validate the physics. | App launches, authenticates a test user, renders one live feed card in the custom pager at 120 fps. **Go/no-go on the pager approach.** | 3–4 wks |
| **1. Auth + onboarding** | All sign-in providers, session persistence, the full onboarding pager + first-dream cutoff/reveal race + vibe-profile save. | A brand-new user can sign up, complete onboarding, and get their first dream. | 3–4 wks |
| **2. Feed + post card + pager (the hard one)** | Production VerticalPager (UIKit), DreamCard, image pipeline (Nuke+thumbhash), impressions, home tabs, pull-to-refresh, deferred hydration. | Home feed scrolls buttery, likes are instant, impressions fire. | 5–7 wks |
| **3. Create + dream loading + reveal** | All create modes, ModelPicker/DreamSmart, enqueue, the realtime loading screen + polling fallback, reveal, photo pipeline. | A user can create every mode of dream and watch it render reliably (incl. backgrounded). | 3–4 wks |
| **4. Social** | Likes/reposts/favorites/comments (overlay morph + keyboard), follows, notifications inbox + badge, profiles (own + public), block/report. | Full social loop at parity, optimistic + realtime. | 4–6 wks |
| **5. Commerce** | RevenueCat wiring, subscribe + sparkleStore paywalls, PremiumGateSheet, welcome-gift/giftUnwrap, sparkle balance/gating. | Purchases work; existing subscribers retain Pro. | 2 wks |
| **6. Bots / explore / search / album / share** | BotsHorizontalPager, explore grid + search (people/tags/dreams), album viewer (3 modes), share sheet. | Discovery surfaces at parity. | 3–4 wks |
| **7. Polish** | Animations (BrandSpinner, morphs, toast), haptics, widget integration + widgetSync, deep links, analytics instrumentation, force-update gate, settings sub-screens, iPad. | Feels finished; analytics + widget live. | 3–4 wks |
| **8. Push migration + QA + beta + cutover** | `send-push`→APNs, coexistence, parity audit, TestFlight soak, App Store submission. | Native binary ships as the update. | 3–4 wks |

**Total ≈ 29–41 weeks solo (~7–10 months).** With 2–3 iOS engineers working in parallel across
phases 2–7, **~3–4 months** is realistic. The feed pager (Phase 0 spike + Phase 2) is the critical
path and the highest variance — de-risk it first.

**Reality check (architect's note):** the backend being clean means the RN app isn't architecturally
broken — the port buys you (a) feed scroll/animation performance and (b) native affordances (Live
Activities, App Intents, better memory, tighter widget/Control Center integration). ~80% of the
*perceived* win is the feed pager + image pipeline. If timeline pressure hits, consider shipping those
two natively first (a hybrid is possible but adds bridge complexity) — but the user's stated goal is a
full native app, so this plan delivers that.

---

## 16. Cutover & migration strategy

- **Same bundle id** → it's an in-place App Store update; users get the native app automatically.
- **Subscriptions continue automatically** — RevenueCat is keyed by Supabase user id (`appUserID`), so
  existing Pro/Basic subscribers keep their entitlement on first native launch. **Verify this in
  TestFlight with a real sandbox subscriber before cutover.**
- **Widget data continues** — same App Group.
- **Session continuity is the sharp edge (§10.7).** The RN app stores the Supabase session in
  AsyncStorage (app sandbox); a native app using Keychain **cannot easily read it**, so users would be
  **logged out on update**. Options:
  1. **Accept re-login** (simplest) — one-tap OAuth/Apple/Google; ship a warm "Welcome back, sign in"
     screen. Acceptable but adds friction for email/password users.
  2. **Bridge the session** — ship one final RN build that writes the refresh token into a Keychain
     item or the App Group in a known location; the native app reads + imports it on first launch for
     a seamless hand-off. More work, best UX. **Recommended if seamless continuity matters.**
- **Parallel operation:** keep shipping the RN app until the native app passes a parity audit + a
  TestFlight soak. Do not delete the RN repo — it stays the reference and the fallback.
- **`push_tokens` coexistence** during overlap (§12) — support both token formats in `send-push`.

---

## 17. Open decisions for Kevin

1. **Minimum iOS version** — recommend iOS 17 (matches widget, unlocks Observation). iOS 18 buys more
   modern APIs at some reach cost. Decide against live install-base analytics (PostHog device data).
2. **Session continuity on cutover** — accept re-login (simple) vs bridge the session (seamless, more
   work)? (§16)
3. **Team size / timeline** — solo (~7–10 mo) vs 2–3 engineers (~3–4 mo)?
4. **Push:** confirm we have (or can mint) an APNs Auth Key (.p8) for the `send-push` migration.
5. **Full native now vs feed-first hybrid** — the plan assumes full native (your stated goal). Flag if
   you'd consider shipping the native feed inside the RN shell first to bank the perf win sooner.
6. **Query layer:** bespoke `QueryCache` (recommended) vs adopt a community Swift async-query library?
7. **Video "Animate" feature** is parked — confirm it stays out of the initial native scope.

---

## 18. Appendix A — complete backend endpoint reference

The Swift app must speak exactly this surface. (Client-touched only; server-internal RPCs omitted.)

**Edge functions (client-invoked):** `enqueue-dream`, `generate-dream`, `restyle-photo`,
`classify-photo`, `describe-photo`, `refund-self-moderation`, `upscale-image`, `first-dream-render`
(via enqueue), and `send-push` (server-triggered). *(Server-only: `nightly-dreams`,
`dream-queue-worker`, `face-swap-dual`, `extract-style`, `refund-stuck-jobs`, `revenuecat-webhook`.)*

**RPCs (client-called):** `get_feed`, `get_shared_post`, `get_inbox`, `get_new_notification_count`,
`mark_inbox_viewed`, `delete_group`, `get_group_actors`, `get_comments`, `get_replies`,
`get_public_profile`, `get_bot_users`, `get_bot_thumbnails`, `get_dream_mediums`, `get_dream_vibes`,
`get_image_models`, `get_mood_axes`, `get_engine_config`, `get_my_account`, `get_reposters`,
`toggle_repost`, `get_shareable_vibers`, `search_hashtags`, `get_notification_settings`,
`set_notification_pref`, `set_push_paused`, `approve_follow_request`, `deny_follow_request`,
`approve_follow_and_follow_back`, `pin_post`, `unpin_post`, `block_user`, `get_blocked_users`,
`report_*`/`reports` insert, `request_dream_notification`, `record_impression`, `touch_last_active`,
`get_giftable_balance`, `gift_sparkles`, `get_gift`, `thank_gift`, admin: `admin_list_reports`,
`admin_resolve_report`, `admin_hide_upload`, `admin_delete_upload`, `admin_delete_comment`,
`admin_ban_user`, account: `delete_own_account`, `reset_my_profile`, `list_my_upload_paths`.

**Tables (direct client read/write, RLS-scoped):** `uploads`, `upload_media`, `users`, `user_recipes`,
`likes`, `favorites`, `follows`, `follow_requests`, `comments`, `comment_likes`, `post_reposts`,
`post_shares`, `post_hashtags`, `notifications`, `blocked_users`, `reports`, `push_tokens`,
`sparkle_packs`, `announcements`, `announcement_seen`, `dream_queue`, `dream_jobs`, `location_cards`,
`image_models`, `mood_axes`.

**Realtime channels:** `user-<uid>` (notifications INSERT + own uploads); `dream_queue:<id>` (render
completion). Publication includes only `notifications, uploads, user_recipes, dream_queue`.

**Storage buckets:** `uploads` (public dream images + size variants), `avatars` (public),
`cast-photos` (private — signed URLs).

**Analytics events (reuse names):** client taps — `dream_create_started`, `dream_created`,
`dream_failed`, `dlt_started`, `feed_tab_selected`, `bot_viewed`, `profile_viewed`, `post_viewed`,
`onboarding_step_completed`, `onboarding_completed`, `first_dream_generated`, `post_liked/unliked`,
`comment_added`, `comment_liked/unliked`, `post_shared`, `post_reposted`, `post_saved/unsaved`,
`follow_added/removed`, `comment_deleted`, `user_blocked`, `content_reported`, `sparkle_store_opened`,
`sparkle_purchase_tapped`, `pro_store_opened`, `pro_subscribe_tapped`, `hd_download_tapped`,
`signup_completed`, `login_completed`, `push_opened`, `inbox_opened`, `search_initiated`,
`search_result_tapped`, `dream_deleted`, `dream_pinned`. **Server completion events fire regardless of
client — leave them.**

**Key env/config:** `EXPO_PUBLIC_SUPABASE_URL`/`ANON_KEY`, `EXPO_PUBLIC_DREAM_QUEUE_ENABLED`,
`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, `EXPO_PUBLIC_POSTHOG_KEY`/`HOST`, `EXPO_PUBLIC_SENTRY_DSN`,
`EXPO_PUBLIC_APP_ENV`. `engine_config` UI-shaping fields: `pro_trial_days`, `base_sparkle_cost`,
`welcome_sparkle_bonus`, `new_scene_max_people`, `new_scene_price_standard/best`, `gallery_max_images`,
`prompt_max_length`, `photo_preprocess_width/quality`, cast-detection regex/word lists,
`min_app_version`/`latest_app_version`, `gifting_enabled` (+ gift caps).

---

## 19. Appendix B — complete screen inventory (45 routes)

**Auth:** `(auth)/index` (welcome + social), `login`, `signup`.
**Onboarding:** `(onboarding)/index` (single-route pager: Welcome→InfoNightly→Locations→InfoCast→
DreamCast→InfoMood→MoodSliders→SaveContinue[cutoff]→MeetBots→Reveal).
**Tabs:** `index` (Home feed), `bots` (bot feeds H-pager), `create`, `top` (Search+Explore), `profile`.
**Dream:** `dream/loading` (locked, realtime), `dream/reveal` (locked).
**Post/Photo:** `photo/[id]` (album viewer, 3 data modes, axis-lock back), `post/[id]` (redirect
alias), `post/new` (posting flow).
**Social:** `comments` (sheet), `inbox` (grouped notifications), `user/[userId]` (public profile,
axis-lock back), `hashtag/[tag]`.
**Settings:** `settings/index` + `edit-profile`, `dream-cast`, `locations`, `mood`, `bots`,
`notifications`, `blocked-users`, `change-password`, `about`, `acknowledgements`, `reports` (admin).
**Commerce:** `sparkleStore`, `subscribe`, `welcome-gift`, `giftUnwrap`.
**Misc:** `modal`, `sharePost` (transparent overlay), `dreamLikeThis`, `dreamTest`, `reset-password`,
`+native-intent` (deep-link pre-nav hook — reimplement as `onOpenURL` logic).

Counts to size the effort: **45 routes, 89 components, 75 hooks, 72 lib modules, 7 stores, 63 tables,
~58 RPCs.**

---

*End of guide. Keep this file updated as the port progresses — treat §15's phases as living
checkboxes and record deviations in §17.*
