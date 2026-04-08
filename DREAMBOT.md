# DreamBot

DreamBot is an AI-powered dream image generator for iOS. Users build a personal taste profile during onboarding — art styles, aesthetics, mood sliders, dream ingredients, and optional photos of themselves, a partner, and a pet. The app uses that profile to generate unique AI art personalized to their taste, delivered nightly while they sleep and on-demand whenever they want. Social feed, likes, comments, shares, friends. Dark theme, high-energy aesthetic. Built for fun and delight.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Stack](#stack)
- [App Architecture](#app-architecture)
- [Vibe Profile](#vibe-profile)
- [Dream Generation Engine](#dream-generation-engine)
- [Nightly Dreams](#nightly-dreams)
- [Feed Algorithm](#feed-algorithm)
- [Social System](#social-system)
- [Sparkle Economy](#sparkle-economy)
- [Content Moderation](#content-moderation)
- [Auth](#auth)
- [Push Notifications](#push-notifications)
- [Realtime](#realtime)
- [Image Storage](#image-storage)
- [Backend (Edge Functions)](#backend-edge-functions)
- [Database Schema](#database-schema)
- [File Structure](#file-structure)
- [Third-Party Services](#third-party-services)

---

## How It Works

1. **Onboarding** — New users build a Vibe Profile: pick art styles, aesthetics, tune 4 mood sliders, add dream seed ingredients (characters, places, things), and optionally upload photos of themselves, a partner, and a pet. Each photo is described by AI once and the text description is reused forever.

2. **Nightly dreams** — Every night, a cron job generates a personalized dream for each active user. It picks a mood-weighted template, fills it with the user's ingredients, optionally includes their dream cast, writes a Flux prompt via Claude Sonnet, generates the image via Replicate Flux Dev, and delivers it with a playful bot message. Users wake up to a new dream in their feed.

3. **On-demand creation** — Users can generate dreams anytime from the Create tab. Type a prompt, attach a photo, pick a medium and vibe, or leave everything blank for a surprise. Costs 1 sparkle per dream.

4. **Social feed** — Three feed tabs: Explore (algorithmic), Following (lightly ranked), Dreamers (friends, reverse-chrono). Like, comment, share, save, follow, friend. Full-screen vertical paging like TikTok.

5. **Sparkle economy** — In-app currency purchased via Apple IAP (RevenueCat). 1 sparkle per dream, 3 per fusion. 25 welcome bonus on signup.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 54, Expo Router v4 (file-based routing) |
| Styling | NativeWind v4 (Tailwind CSS via className) |
| Client state | Zustand |
| Server state | TanStack Query |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions, Realtime) |
| AI image gen | Replicate API (Flux Dev text-to-image, Flux Kontext Pro photo-to-image) |
| AI prompt engine | Anthropic API (Claude Sonnet for prompt writing, Haiku for bot messages) |
| Photo description | Replicate (Llama 3.2 Vision 90B) |
| Moderation | SightEngine API |
| Payments | RevenueCat (iOS IAP) |
| Auth | Supabase Auth (Apple, Google, Facebook OAuth + email/password) |
| Animations | Reanimated 3 + Gesture Handler |
| Images | expo-image |
| Language | TypeScript strict mode |

---

## App Architecture

### Navigation

Expo Router with file-based routing. Root Stack contains auth, onboarding, tabs, and standalone screens.

```
Root Stack (app/_layout.tsx)
├── index                → gateway: checks session → redirects
├── (auth)/              → login, signup, OAuth
├── (onboarding)/        → 7-step profile builder (horizontal pager)
├── (tabs)/              → 5 bottom tabs
│   ├── index            → Home Feed (Following / Explore / Dreamers)
│   ├── top              → Explore grid with medium/vibe filter pills
│   ├── create           → Dream creation (prompt, photo, medium, vibe)
│   ├── inbox            → Notifications
│   └── profile          → Own profile, posts, saved, friends
├── dream/loading        → Generation loading screen
├── dream/reveal         → Full-screen dream reveal (post / save / discard)
├── photo/[id]           → Full-screen post detail / album view
├── user/[userId]        → Public profile
├── comments             → Comment thread (form sheet)
├── sharePost            → Share to friends (transparent modal)
├── search               → User search
├── sparkleStore         → IAP purchase screen
├── settings             → Account settings + profile editing
├── dreamLikeThis        → Generate in the style of another dream
└── dreamTest            → Admin-only dream engine test tool
```

### Stores (Zustand)

| Store | Purpose |
|-------|---------|
| `auth` | Session, user, sign-out. Initialized from SecureStore on app launch. |
| `feed` | Feed seed, pinned post, active tab, HUD visibility, deep-link pending post ID. |
| `dream` | Ephemeral creation flow state: photo, prompt, medium, vibe, generation result. |
| `onboarding` | Step counter, isEditing flag, full VibeProfile being built. |
| `explore` | Pending medium/vibe filter for the Explore tab. |
| `album` | Upload IDs for multi-select album view. |

### Data Layer

All server data flows through TanStack Query hooks in `hooks/`. Each hook wraps a Supabase query or RPC call, handles caching, pagination, and optimistic updates. ~50 hooks cover every data need.

Key patterns:
- **Infinite scroll** — `useInfiniteQuery` with cursor-based pagination for feeds and comments
- **Optimistic updates** — likes, follows, favorites update the UI instantly and revert on error
- **ID sets** — `useLikeIds`, `useFavoriteIds`, `useFollowingIds` fetch the current user's full ID sets for instant UI state without per-item queries
- **Query invalidation** — mutations invalidate related queries by key prefix

---

## Vibe Profile

Every user has a `VibeProfile` (version 2) stored as JSONB in `user_recipes.recipe`:

```typescript
{
  version: 2,
  aesthetics: Aesthetic[],      // cyberpunk, cozy, liminal, dreamy... (min 3)
  art_styles: ArtStyle[],       // anime, watercolor, oil_painting... (min 2)
  moods: {
    peaceful_chaotic: number,   // 0.0 – 1.0
    cute_terrifying: number,
    minimal_maximal: number,
    realistic_surreal: number,
  },
  dream_seeds: {
    characters: string[],       // "my cat", "astronauts", "tiny monsters"
    places: string[],           // "tokyo alleyways", "mountain cabin"
    things: string[],           // "vinyl records", "old books"
  },
  dream_cast: DreamCastMember[],  // self, plus_one, pet — each with AI text description
  avoid: string[],                // things to never include
}
```

The profile drives everything: which art styles the engine can use, what mood the dreams have, what subjects appear, and whose face shows up. Users edit their profile freely from Settings (auto-saves on every change).

Legacy users with a v1 `Recipe` still work through `lib/recipeEngine.ts`. Migration helper exists at `lib/migrateRecipe.ts`.

---

## Dream Generation Engine

### Two-Pass Prompt Engine

All dream generation goes through the `generate-dream` Edge Function.

**Pass 1 — Concept Generator:** Claude Haiku receives the user's vibe profile + medium directive + vibe directive + weighting rules. Outputs a structured JSON concept: subject, environment, lighting, camera, style, palette, twist, composition, mood.

**Pass 2 — Prompt Polisher:** Takes the concept JSON and formats it into an optimized 50-70 word Flux prompt. Comma-separated phrases, starts with art style, ends with quality terms.

**Fallbacks:** If Pass 1 fails (bad JSON), `buildFallbackConcept()` constructs mechanically. If Pass 2 fails, `buildFallbackFluxPrompt()` concatenates fields.

### Dream Composition Algorithm (`lib/dreamAlgorithm.ts`)

For dreams that include the user's cast (photos), the algorithm decides:

| Decision | Weights |
|----------|---------|
| Cast vs. pure scene | 75% cast / 25% scene (when cast exists) |
| Who appears (singles) | Me 15%, +1 10%, Pet 10% |
| Who appears (duos) | Me+partner 40%, Me+pet 15% |
| Who appears (group) | All three 10% |
| Composition (singles) | 60% character / 40% epic_tiny |
| Composition (duos/groups) | Always character |

Scene-only mediums (oil_painting, embroidery, vaporwave, pop_art, pixel_art, fantasy) always use pure scene. Character mediums (claymation, lego, funko_pop, disney, sack_boy) always use character composition.

### Mediums and Vibes

29 curated mediums and 11 vibes defined in `constants/dreamEngine.ts`. Each has:
- `key` — identifier
- `label` — display name
- `directive` — instruction for Claude on how to brief this style
- `fluxFragment` — comma-separated style prefix injected into the Flux prompt

### Photo Dreams

When a user attaches a photo, Flux Kontext Pro handles photo-to-image transformation. Two modes:
- **Restyle** — keep the subject, change the art style
- **Reimagine** — transform the entire scene around the subject

### Dream Like This

Users can generate a new dream in the style of any existing post. The `extract-style` Edge Function pulls the visual style from the original prompt, then the engine generates fresh content in that style.

---

## Nightly Dreams

**Trigger:** GitHub Actions cron at 1am MST + random 0-3 hour delay. Runs `scripts/nightly-dreams.js`.

**Flow for each eligible user:**

1. Check eligibility: onboarding complete, AI enabled, active in last 36 hours, no dream today
2. Roll the dream algorithm (cast vs. scene, who appears, composition path)
3. Pick a mood-weighted template category (31 categories: cosmic, microscopic, impossible_architecture, underwater_worlds, etc.)
4. Fetch a template from `dream_templates` table, fill slots with user's dream seeds
5. Optionally inject dream cast member descriptions and dream wish text
6. Pick a random cinematic shot direction (15 options: low angle, tilt-shift, silhouette, aerial, etc.)
7. Build a structured brief and send to Claude Sonnet → 60-90 word Flux prompt
8. Generate image via Replicate Flux Dev (9:16 portrait, JPG)
9. Download image, upload to Supabase Storage
10. Generate a bot message via Claude Haiku (8-15 words, playful, references the dream content)
11. Insert into `uploads` table with `is_approved: true`
12. Insert `dream_generated` notification (triggers push via database webhook)
13. If a wish was used: notify wish recipients, clear the wish
14. Log to `ai_generation_log`, update `ai_generation_budget`

**Budget:** $5/night cap, $0.03/image. Batches of 5 in parallel with 2-second pause between batches.

**Realtime delivery:** The `uploads` INSERT fires a Supabase Realtime event → client invalidates feed queries → dream appears in the user's feed automatically.

---

## Feed Algorithm

### Explore Tab (forYou)

Production-grade scoring algorithm (migration 092):

```
feed_score =
  Freshness (25%) — exponential decay, peaks at 0h, ~0.1 at 48h
  + Engagement velocity (25%) — weighted engagement per hour, logarithmic
  + Engagement rate (10%) — engagement / unique views
  + Absolute engagement (15%) — lets older viral content resurface
  + Following boost (15%) — posts from followed users rank higher
  + Seeded randomness (10%) — prevents stale ordering within a session
  + Cold start bonus (+0.20 for posts < 4 hours old)
```

Engagement weights: likes=1, comments=2x, fuses=3x, shares=2x, saves=1.5x.

**Cursor-based pagination** using `feed_score` + `id` as composite cursor. New posts don't shift existing results during infinite scroll.

**Content diversity** (client-side post-processing): no 2+ consecutive same-user posts, no 3+ consecutive same-medium posts. Deferred posts appended at end.

### Following Tab

Light ranking: posts from last 24 hours appear first (chronological feel), older posts ranked by engagement. Still feels chronological but hot posts bubble up.

### Dreamers Tab

Pure reverse-chronological. Friends feed is intimate — ranking feels wrong here.

### Impression Tracking

`FullScreenFeed` records an impression when a post is visible for >1 second. Calls `record_impression` RPC which upserts into `post_impressions` and increments `view_count` on uploads (unique viewers only). View count feeds the engagement rate calculation in the feed algorithm.

---

## Social System

### Follows

One-directional. Follow anyone. Following feed shows their posts with light ranking. `follows` table with `follower_id` / `following_id`.

### Friends (Dreamers)

Mutual connection. Send request → accept/decline. Friends appear in the Dreamers feed tab and are eligible for dream sharing. `friendships` table with `user_a`, `user_b`, `status`, `requester`.

### Likes

Single-tap heart or double-tap on feed card. Optimistic UI with heart burst animation. Trigger-maintained `like_count` on uploads.

### Comments

Threaded (one level deep). Rate-limited (trigger). `@mention` autocomplete. Text moderation before submit. Trigger-maintained `comment_count` on uploads. Comment likes tracked separately.

### Shares

Share a dream with friends. Multi-select friend grid. Also supports native share (copy link). Trigger-maintained `share_count` on uploads. Creates `post_share` notification.

### Favorites

Save/bookmark posts for later. Trigger-maintained `save_count` on uploads.

### Block & Report

Block hides all content from that user across all feeds. Report submits to `reports` table.

---

## Sparkle Economy

### Costs

| Action | Cost |
|--------|------|
| Dream (any type) | 1 sparkle |
| Fusion | 3 sparkles |
| Nightly dreams | Free |
| Welcome bonus | 25 sparkles |

### IAP Packs (RevenueCat)

| Pack | Sparkles | Price |
|------|----------|-------|
| Starter | 25 | $2.99 |
| Popular | 50 | $4.99 |
| Best Value | 100 | $7.99 |
| Mega Pack | 500 | $24.99 |

### Purchase Flow

1. User taps pack in Sparkle Store → RevenueCat SDK → Apple payment sheet
2. Apple confirms → RevenueCat webhook → `revenuecat-webhook` Edge Function
3. Edge Function validates, maps product to sparkle amount, calls `grant_sparkles` RPC
4. RPC atomically updates `users.sparkle_balance` and logs to `sparkle_transactions`
5. Client polls balance, UI updates

### Spending

`spend_sparkles` RPC is atomic — returns false if insufficient balance. Called before every generation. NSFW rejections trigger a `grant_sparkles` refund.

---

## Content Moderation

### Text Moderation

Client calls `moderateText()` → `moderate-content` Edge Function → SightEngine text API.

Thresholds: discriminatory > 0.5, violent > 0.5, sexual > 0.7 = blocked.

Applied to: dream prompts, dream wishes, usernames, comments.

### Image Moderation

SightEngine image API checks nudity, gore, weapons, self-harm.

Replicate also has its own NSFW filter — rejects prompts it deems unsafe.

### Flow

1. Text moderation before generation (client-side gate)
2. Replicate's built-in NSFW filter during generation
3. Image moderation before posting (optional)
4. Nightly dreams bypass client moderation (trusted server-side pipeline, inserted with `is_approved: true`)

---

## Auth

### Providers

| Provider | SDK | Exchange |
|----------|-----|----------|
| Apple | `expo-apple-authentication` | `signInWithIdToken({ provider: 'apple' })` with SHA256 nonce |
| Google | `@react-native-google-signin/google-signin` | `signInWithIdToken({ provider: 'google' })` |
| Facebook | `react-native-fbsdk-next` | `signInWithIdToken({ provider: 'facebook' })` |
| Email | Supabase Auth | `signInWithPassword()` / `signUp()` |

All OAuth flows use native SDKs to obtain a provider token, then exchange for a Supabase session.

### Session Management

- Tokens persisted in `expo-secure-store`
- Auto-refresh enabled
- `useAuthStore.initialize()` called once on app mount — restores session and subscribes to `onAuthStateChange`
- Post-auth routing: checks `users.has_ai_recipe` → onboarding or main tabs

---

## Push Notifications

### Registration

On auth, `usePushNotifications` hook requests permissions, gets an Expo push token, and upserts into `push_tokens` table.

### Sending

Database Webhook on `notifications` INSERT → `send-push` Edge Function → looks up recipient's Expo token(s) → maps notification type to title/body → POSTs to Expo Push API.

### Notification Types

`post_comment`, `comment_reply`, `comment_mention`, `post_share`, `friend_request`, `friend_accepted`, `dream_generated`, `post_like`, `post_fuse`

### Deep Links

Push payload includes `uploadId` or `userId`. Tapping navigates to `/photo/{id}` or `/user/{id}`.

---

## Realtime

One Supabase Realtime channel per authenticated user (`user-{userId}`), opened in `_layout.tsx`.

Three subscriptions:
1. **`notifications` INSERT** → invalidates inbox and unread count queries (instant notification badge)
2. **`user_recipes` UPDATE** → invalidates dream wish query (fires when nightly engine clears wish)
3. **`uploads` INSERT** → invalidates feed, userPosts, my-dreams queries (fires when nightly dream arrives or user posts)

Fallback: `useUnreadCount` polls every 2 minutes.

---

## Image Storage

**Bucket:** `uploads` in Supabase Storage (public).

**Path:** `{userId}/{timestamp}.jpg`

**URL variants** (via Supabase image transform API in `lib/imageUrl.ts`):
- Feed card: `?width=900&resize=contain`
- Grid thumbnail: `?width=400&height=711&resize=contain`
- Avatar: `?width=128&height=128&resize=cover`

**Upload sources:**
- User dreams: `persistImage()` downloads from Replicate temp URL, detects format, uploads to Storage
- Nightly dreams: Edge Function downloads and uploads directly via service role
- Avatars: Uploaded to the same bucket via `useAvatarUpload`
- Cast photos: Uploaded to `avatars` bucket for AI description

---

## Backend (Edge Functions)

All in `supabase/functions/`. Deployed with `supabase functions deploy <name> --no-verify-jwt`.

### `generate-dream`

Main dream generation. Receives creation params, builds Flux prompt via two-pass Haiku engine, calls Replicate, returns image URL + prompt. Handles text-to-image (Flux Dev), photo-to-image (Flux Kontext Pro), and surprise mode (DB templates + Sonnet). Budget tracking via `ai_generation_budget`.

### `nightly-dreams`

Scheduled generation for all eligible users. Sonnet prompt writing, Flux Dev generation, bot message via Haiku, notification insertion. $5/night budget cap.

### `send-push`

Dispatches Expo push notifications. Triggered by database webhook on `notifications` INSERT.

### `revenuecat-webhook`

Handles IAP purchase events. Validates webhook secret, maps product IDs to sparkle amounts, calls `grant_sparkles` RPC. Idempotent via transaction ID check.

### `moderate-content`

Content moderation via SightEngine. Supports image, text, and combined upload checks.

### `describe-photo`

One-time photo-to-text description via Llama 3.2 Vision 90B on Replicate. Used for dream cast member descriptions during onboarding.

### `extract-style`

Extracts visual art style from a dream prompt via Claude Haiku. Used by "Dream Like This" feature.

### Shared Modules (`_shared/`)

| File | Purpose |
|------|---------|
| `dreamEngine.ts` | Mediums, vibes, subject invention, dream scene building. NOT a copy of `constants/dreamEngine.ts` — has Edge-specific helpers. |
| `dreamAlgorithm.ts` | Cast probability, WHO weights, composition splits. Synced from `lib/dreamAlgorithm.ts`. |
| `dreamTemplates.ts` | Template category definitions, mood-weight functions, slot filling. |
| `vibeEngine.ts` | Two-pass concept generator + prompt polisher. |
| `vibeProfile.ts` | VibeProfile type definitions for Edge runtime. |
| `photoPrompts.ts` | Photo restyle/reimagine prompt builders. |
| `recipe.ts` / `recipeEngine.ts` | Legacy v1 recipe support. |

**Edge Function Gotcha:** Never use optional chaining (`?.`) in top-level module expressions in `_shared/` files. Deno Edge runtime crashes with BOOT_ERROR. Use explicit null checks.

---

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | id, email, username, avatar_url, sparkle_balance, has_ai_recipe, is_admin, last_active_at |
| `uploads` | Dreams/posts. image_url, ai_prompt, ai_concept, bot_message, dream_medium, dream_vibe, like_count, comment_count, fuse_count, share_count, save_count, view_count, is_active, is_approved, visibility |
| `user_recipes` | user_id → recipe (JSONB VibeProfile), onboarding_completed, ai_enabled, dream_wish, wish_modifiers, wish_recipient_ids |

### Social Tables

| Table | Purpose |
|-------|---------|
| `likes` | user_id + upload_id (unique) |
| `favorites` | user_id + upload_id (unique, bookmarks) |
| `follows` | follower_id + following_id (one-directional) |
| `friendships` | user_a + user_b + status + requester (mutual) |
| `comments` | upload_id, user_id, parent_id, body, like_count, reply_count |
| `comment_likes` | user_id + comment_id |
| `post_shares` | sender_id + receiver_id + upload_id |
| `blocked_users` | blocker_id + blocked_id |
| `reports` | reporter_id, upload_id or user_id, reason |

### System Tables

| Table | Purpose |
|-------|---------|
| `notifications` | recipient_id, actor_id, type, upload_id, body, seen_at |
| `push_tokens` | user_id + Expo push token |
| `sparkle_transactions` | Audit log for all sparkle grants/spends |
| `ai_generation_log` | Audit log for all AI generations |
| `ai_generation_budget` | Daily per-user generation count + cost |
| `post_impressions` | user_id + upload_id view tracking (unique views) |
| `dream_templates` | Nightly dream scene templates by category |
| `dream_archetypes` | Interest/mood-triggered dream archetypes |
| `user_archetypes` | User-archetype assignments |

### Key RPCs

| RPC | Purpose |
|-----|---------|
| `get_feed` | Algorithmic feed with per-tab scoring, cursor pagination |
| `get_comments` | Paginated comment tree |
| `get_notifications` | Paginated notification inbox |
| `get_unread_notification_count` | Badge count |
| `get_friend_ids` | Friend ID list for Dreamers tab |
| `get_pending_requests` | Incoming friend requests |
| `get_public_profile` | Profile data + follow/friend counts |
| `get_shareable_vibers` | Friends eligible for sharing, sorted by interaction |
| `spend_sparkles` | Atomic balance deduction |
| `grant_sparkles` | Balance addition + audit log |
| `record_impression` | Upsert view tracking |
| `send_friend_request` | Rate-limited friend request |
| `respond_friend_request` | Accept/decline |
| `remove_friend` | Unfriend |
| `delete_own_account` | Full account deletion |

### Active Triggers

Triggers auto-maintain denormalized counts: `like_count`, `comment_count`, `fuse_count`, `share_count`, `save_count` on uploads. Also: comment rate limiting, share rate limiting, notification creation (comments, likes, fuses, friendships), moderation enforcement on upload insert.

---

## File Structure

```
app/                          # Expo Router screens
  _layout.tsx                 # Root: providers, auth, push, realtime
  (auth)/                     # Login, signup, OAuth
  (onboarding)/               # 7-step profile builder
  (tabs)/                     # 5 bottom tabs (home, explore, create, inbox, profile)
  dream/                      # loading.tsx, reveal.tsx
  photo/[id].tsx              # Post detail
  user/[userId].tsx           # Public profile

components/                   # Shared UI components
  DreamCard.tsx               # Full-screen feed card (gestures, actions)
  FullScreenFeed.tsx          # Vertical paging container (prefetch, impressions)
  CommentOverlay.tsx          # Inline comment sheet
  StylePickerSheet.tsx        # Medium/vibe bottom sheet picker
  onboarding/*.tsx            # 7 onboarding step components

hooks/                        # TanStack Query hooks (~50 hooks)
store/                        # Zustand stores (auth, feed, dream, onboarding, etc.)

lib/
  supabase.ts                 # Supabase client (SecureStore auth)
  dreamApi.ts                 # Edge Function client wrappers
  dreamAlgorithm.ts           # Cast/scene composition logic
  dreamSave.ts                # Post-generation save/pin helpers
  vibeEngine.ts               # Two-pass concept engine (client copy)
  moderation.ts               # SightEngine client
  revenuecat.ts               # RevenueCat IAP wrappers
  mapPost.ts                  # Supabase row → DreamPostItem mapper
  imageUrl.ts                 # URL transform helpers (thumbnail, feed, avatar)
  navigate.ts                 # Debounced router wrappers
  appleAuth.ts                # Apple Sign-In
  googleAuth.ts               # Google Sign-In
  facebookAuth.ts             # Facebook Login
  migrateRecipe.ts            # v1 Recipe → v2 VibeProfile migration

types/
  vibeProfile.ts              # VibeProfile, MoodAxes, DreamSeeds, DreamCastMember
  recipe.ts                   # Legacy v1 Recipe types
  database.ts                 # Supabase auto-generated DB types

constants/
  dreamEngine.ts              # All mediums + vibes (directives, fluxFragments)
  theme.ts                    # Colors, gradients, shared styles
  sparklePacks.ts             # IAP product IDs (source of truth)
  onboarding.ts               # Tile definitions, limits
  wishModifiers.ts            # Wish mood/weather/energy/vibe options

supabase/
  migrations/                 # 93 SQL migrations
  functions/
    generate-dream/           # Main dream generation
    nightly-dreams/           # Scheduled nightly generation
    send-push/                # Push notification dispatcher
    revenuecat-webhook/       # IAP purchase handler
    moderate-content/         # Content moderation
    describe-photo/           # Cast photo AI description
    extract-style/            # Art style extraction
    _shared/                  # Shared Edge Function modules

scripts/
  nightly-dreams.js           # Node.js nightly cron (GitHub Actions)
```

---

## Third-Party Services

| Service | Use | Cost Model |
|---------|-----|-----------|
| Supabase | Postgres, Auth, Storage, Realtime, Edge Functions | Free tier + usage |
| Replicate (Flux Dev) | Text-to-image generation | ~$0.025/image |
| Replicate (Flux Kontext Pro) | Photo-to-image transformation | ~$0.04/image |
| Replicate (Llama 3.2 Vision) | Cast photo descriptions | ~$0.01/description |
| Anthropic (Claude Sonnet) | Nightly dream prompt writing | ~$0.003/prompt |
| Anthropic (Claude Haiku) | Concept generation, bot messages, style extraction | ~$0.001/call |
| SightEngine | Text + image moderation | Per-check pricing |
| RevenueCat | IAP management, webhooks | Free tier + revenue % |
| Expo | Push notifications, build service | Free tier |
| GitHub Actions | Nightly dream cron | Free tier |

---

## Environment Variables

### Client (Expo)
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

### Edge Functions (Supabase Secrets)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`
- `REPLICATE_API_TOKEN`
- `ANTHROPIC_API_KEY`
- `SIGHTENGINE_API_USER`, `SIGHTENGINE_API_SECRET`
- `REVENUECAT_WEBHOOK_SECRET`

### GitHub Actions Secrets
- `SUPABASE_SERVICE_ROLE_KEY`
- `REPLICATE_API_TOKEN`
- `ANTHROPIC_API_KEY`
