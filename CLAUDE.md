# DreamBot — Claude Code Guidelines

## Session Startup

**Before doing anything else, read this entire file.** This is your operating manual for the DreamBot codebase. You are acting as a senior principal engineer on this project. You already know the architecture, the patterns, the 3rd-party services, and the dream engine internals — they are all documented below. Do NOT re-explore the codebase to learn things already written here. Jump straight into whatever Kevin needs.

Do NOT auto-start the dev environment. Let Kevin know he can run `/rad` to spin up the dev tools (simulator check, Xcode, Metro).

---

## What This App Is

DreamBot is an AI-powered dream image generator for iOS. Users create a personal "taste recipe" during onboarding (11-step wizard selecting interests, spirit companion, style axes, moods, etc.), and the app generates unique AI dreams tailored to their personality. Users can also fuse dreams genetically, twin dreams, set dream wishes, and share/comment/like in a social feed. Dark, high-energy aesthetic. Built for fun and delight.

**Key features:**
- Personality-driven AI image generation via a layered prompt engine
- Genetic dream fusion (merge two users' recipes with dominant/recessive genetics)
- Dream twinning (create variations of existing dreams)
- Dream wishes (request specific dream subjects)
- Nightly automatic dream generation (3am UTC Edge Function)
- Social feed with likes, comments, shares, friend system
- Sparkle currency (in-app purchases via RevenueCat)
- Content moderation (SightEngine)

---

## Stack

- **Framework:** React Native + Expo SDK 54, Expo Router v4 (file-based routing)
- **Styling:** NativeWind v4 (Tailwind CSS) — always use className, never StyleSheet
- **State:** Zustand (client state), TanStack Query (server/async state)
- **Backend:** Supabase (Postgres, auth, storage, realtime, Edge Functions)
- **AI Image Gen:** Replicate API (Flux Dev for text-to-image, Flux Kontext Pro for photo-to-image)
- **AI Prompt Enhancement:** Anthropic API (Claude Haiku 4.5) — enhances recipe prompts
- **Moderation:** SightEngine API (NSFW, violence, text profanity)
- **Payments:** RevenueCat (sparkle currency IAP)
- **Auth:** Supabase Auth (email/password, Google, Apple, Facebook OAuth)
- **Animations:** Reanimated 3 + Gesture Handler
- **Images:** expo-image (not react-native-fast-image)
- **Video:** expo-video + react-native-compressor
- **Language:** TypeScript strict mode — no `any`, no `// @ts-ignore`

---

## Architecture & File Structure

```
app/                              # Expo Router (file-based routing)
  _layout.tsx                     # Root — providers, auth init, push, realtime
  (auth)/                         # Auth screens (login, signup)
  (onboarding)/                   # 11-step taste recipe wizard
  (tabs)/                         # Main app — 5 tabs
    index.tsx                     # Home feed (forYou, following, dreamers)
    top.tsx                       # Top posts grid
    upload.tsx                    # Dream generation screen
    inbox.tsx                     # Notifications (comments, shares, likes)
    profile.tsx                   # User profile + settings
  photo/[id].tsx                  # Full-screen dream detail
  user/[userId].tsx               # Other user profiles
  fusion.tsx                      # Dream fusion interface
  sparkleStore.tsx                # Sparkle shop (IAP)
  comments.tsx                    # Comment thread
  sharePost.tsx                   # Share dream with friends
  search.tsx                      # User search
  settings.tsx                    # Account settings
  friendReveal/[uploadId].tsx     # Friend reveal mechanic

components/                       # Shared UI components
  DreamCard.tsx                   # Full-screen image card (double-tap, swipe, pinch)
  FullScreenFeed.tsx              # Vertical scrolling feed container
  PostGrid.tsx / PostTile.tsx     # Grid layouts and thumbnails
  CharacterSheet.tsx              # Displays user's personality recipe
  DreamWishSheet.tsx              # Shows/edits dream wish
  DreamFamilySheet.tsx            # Twin/fusion relationships
  FriendButton.tsx                # Friend request actions
  CommentRow.tsx                  # Comment with nested replies
  Toast.tsx / CustomAlert.tsx     # Feedback UI
  onboarding/*.tsx                # 11 onboarding step components

hooks/                            # TanStack Query hooks (58+ hooks)
  useFeed.ts                      # Feed fetching (calls get_feed RPC)
  useUpload.ts                    # Upload/dream generation
  useToggleLike.ts                # Like/unlike posts
  useComments.ts / useReplies.ts  # Comment threads
  useFriendsList.ts               # Friend management
  useSparkles.ts                  # Sparkle currency
  useDreamWish.ts                 # Dream wish CRUD
  useDreamFamily.ts               # Twin/fusion relationships
  usePushNotifications.ts         # Push token registration
  useSearchUsers.ts               # Username search
  ... (and many more)

store/                            # Zustand stores
  auth.ts                         # Session, user, signOut, initialize
  onboarding.ts                   # Recipe builder state (11 steps)
  feed.ts                         # Feed tokens, pinned post, video mute
  fusion.ts                       # Dream mode (normal/twin/fuse)
  album.ts                        # Generated dream carousel

lib/                              # Core business logic & API clients
  supabase.ts                     # Supabase client (SecureStore for tokens)
  recipeEngine.ts                 # THE DREAM ENGINE — recipe → prompt layers
  enhancePrompt.ts                # Sends recipe to Haiku for creative expansion
  dreamApi.ts                     # Replicate + Haiku API calls
  dreamPost.ts                    # Insert dream into uploads, pin to feed
  geneticMerge.ts                 # Genetic recipe fusion (dominant/recessive)
  recipeRegistry.ts               # Track recipe variants
  moderation.ts                   # SightEngine content moderation
  revenuecat.ts                   # RevenueCat IAP setup
  characterSheet.ts               # Human-readable recipe description
  appleAuth.ts / googleAuth.ts / facebookAuth.ts  # OAuth handlers
  imageLongPress.ts               # Save image to library
  formatCount.ts                  # "1.2K", "45M" formatting
  postAuthRoute.ts                # Route after auth (onboarding or home)
  reportPost.ts                   # Flag inappropriate content

types/
  database.ts                     # Supabase auto-generated DB types
  recipe.ts                       # Recipe, RecipeAxes, Interest, Era, etc.

constants/
  theme.ts                        # Fire palette, dark backgrounds, semantic colors
  onboarding.ts                   # All tile definitions (interests, companions, etc.)
  categories.ts                   # Post categories
  dreamCategories.ts              # Dream-specific categories
  mascots.ts                      # DreamBot mascot URLs
  ratings.ts                      # Rank thresholds and badges
  gestures.ts                     # Gesture config
  wishModifiers.ts                # Dream wish modifiers

supabase/
  migrations/                     # 67+ SQL migrations (run manually in dashboard)
  functions/
    nightly-dreams/index.ts       # Scheduled Edge Function (3am UTC)
    revenuecat-webhook/index.ts   # Purchase event handler
    send-push/index.ts            # Expo Push API dispatcher
    _shared/                      # Shared recipe types for Edge Functions

scripts/
  seed.js                         # Main seed (wipes + recreates test data)
  seed-dreamers.js                # Dream-specific test data
  nightly-dreams.js               # Local test of nightly generation
  generate-ai-content.js          # Batch dream generation
  test-algorithm.js               # Feed algorithm test (28 scenarios)
  test-recipe-variety.ts          # Recipe engine variety tests
  prompt-lab.js                   # Interactive prompt testing
  reset-project.js                # Full DB wipe
  reset-user.js                   # Single user wipe
```

---

## The Dream Engine (lib/recipeEngine.ts) — How Prompts Are Built

This is the core creative engine. It transforms a user's taste recipe into a layered prompt that produces truly random, beautiful, and personalized AI images. Understanding this is critical.

### Recipe Structure (types/recipe.ts)

Every user has a `Recipe` with:
- **8 continuous axes** (0.0-1.0): `color_warmth`, `complexity`, `realism`, `energy`, `brightness`, `chaos`, `weirdness`, `scale`
- **7 discrete arrays**: `interests[]`, `color_palettes[]`, `personality_tags[]`, `eras[]`, `settings[]`, `scene_atmospheres[]`
- **1 spirit companion**: one of 12 creatures (fox, cat, owl, dragon, rabbit, wolf, jellyfish, deer, butterfly, robot, ghost, mushroom_creature)

### Four Prompt Layers

The engine builds prompts in 4 layers, each controlling a different aspect:

1. **TECHNIQUE** (HOW it looks)
   - Selects from 90+ art mediums (Pixar 3D, anime, oil painting, LEGO, Van Gogh, etc.)
   - Each medium has axis tags (realism, complexity, energy, color_warmth, brightness)
   - The engine "rolls dice" on each axis using the user's values as probability biases
   - Then scores all mediums against the rolled axes and picks from the top matches
   - Chaos axis controls wildcard chance (10% at chaos=0, 40% at chaos=1)
   - Also applies: color palette keywords, weirdness modifiers (5 levels from normal to Dali surrealism), scale modifiers (close-up to epic vista)

2. **SUBJECT** (WHAT it shows)
   - Samples 1-2 interests from user's selections (chaos increases chance of 2)
   - Interests expand to specific pop culture flavors (e.g., "gaming" → "Zelda-inspired", "movies" → "Spirited Away")
   - Vague interests ALWAYS expand; concrete ones expand 40% of the time
   - 50% chance of a fantastical dream subject (from 80+ creatures/objects)
   - 10% chance spirit companion is the main subject
   - 40% pure landscape (no subject)
   - Actions only included when energy axis is high (rolled)
   - 30+ scene types ("unexpected discovery", "boss battle", "dream within a dream")

3. **WORLD** (WHERE/WHEN)
   - Era keywords: 10 eras with 4 variations each (e.g., medieval → castle, village, tournament, scriptorium)
   - Setting keywords: 10 settings with 5 variations each
   - Chaos gates bonus eras/settings (pop culture locations, famous landmarks, space/planets)
   - 130+ bonus settings include Hobbit Shire, Hogwarts, Bikini Bottom, real landmarks (Machu Picchu, Santorini, etc.)
   - `pickWithChaos()` — user preferences respected but chaos introduces variety

4. **ATMOSPHERE** (HOW it feels)
   - Mood pool: 30 tagged moods (cozy, ethereal, epic, mysterious, silly, etc.)
   - Lighting pool: 20+ tagged lighting options (candlelight, neon city glow, aurora, underwater caustics)
   - Both filtered using same axis-scoring system as mediums
   - Personality tags sampled (up to 3) from user's selections
   - Scene atmosphere from 8 weather/time combos

### Key Design Principles

- **Every user choice MUST change the output.** If it doesn't reach the prompt, it shouldn't be in onboarding.
- **Axes are probability biases, not fixed values.** A realism of 0.7 means 70% chance of "high" — not guaranteed. This creates natural variety.
- **Complexity is derived, not set by user.** It's calculated from the user's interest/personality/era choices (fantasy, sci_fi, architecture → high; cute, cozy → low).
- **Chaos controls randomness.** Low chaos = stick to preferences. High chaos = wildcards, bonus locations, mixed interests.
- **Spirit companion appears only ~15% of the time** — keeps it special.
- **Compositions are random framing directives** — 40+ options including "bird's eye view", "cross-section cutaway", "miniature world inside a teacup", or nothing (pure AI freedom).

### Two Prompt Paths

1. **Haiku-enhanced (primary):** `buildHaikuPrompt()` sends ALL ingredients to Claude Haiku with instructions to pick the BEST 4-5 elements and weave them into ONE coherent 60-word scene. Haiku is told to DROP competing elements rather than use everything. The prompt includes anti-cliche rules ("no figure standing with back to camera", "no lone silhouette on cliff edge").

2. **Raw fallback:** `buildRawPrompt()` assembles 5 key elements (medium, subject, setting, mood, one spice) into a tight prompt. Used only when Haiku is unavailable. Flux handles short punchy prompts better than walls of text.

### Genetic Dream Fusion (lib/geneticMerge.ts)

`fuseRecipes(parentA, parentB, blend)` merges two recipes:
- **Axes:** Extreme values (far from 0.5) are "dominant" — they pull harder in the blend. ±5% genetic jitter on every axis.
- **Arrays:** Each parent contributes proportional to blend % (both always contribute at least 1 pick). Items are shuffled before slicing.
- **Spirit companion:** Weighted coin flip based on blend ratio.
- **5% mutation chance** per array: a random trait NEITHER parent has gets injected (from the full pool of interests, eras, settings, or companions).
- Blend slider: 0 = 100% parent A, 100 = 100% parent B, 50 = equal.

---

## 3rd Party Services — How to Interact

### Supabase (Backend)

**Client:** `lib/supabase.ts` — created with `@supabase/supabase-js`, auth tokens in Expo SecureStore.

**Env vars:** `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` (client), `SUPABASE_SERVICE_ROLE_KEY` (admin/scripts only, in `.env.local`).

**Auth:** Email/password + OAuth (Google, Apple, Facebook). All route through Supabase Auth. Session auto-refreshes.

**Storage:** `uploads` bucket for all images/videos. Pattern: `{userId}/{timestamp}.jpg`. Public URLs via `supabase.storage.from('uploads').getPublicUrl()`.

**Key RPC functions (called via `supabase.rpc()`):**
- `get_feed(p_user_id, p_limit, p_offset, p_seed)` — main feed algorithm with ranking
- `get_friends_feed(p_user_id)` — friends-only posts
- `get_following_feed(p_user_id)` — following feed
- `get_friend_ids(p_user_id)` — friend ID array
- `get_friend_votes_on_post(p_user_id, p_upload_id)` — which friends liked this
- `get_comments(p_upload_id, p_limit, p_offset)` — comment thread
- `get_replies(p_comment_id, p_limit)` — nested replies
- `get_notifications(p_user_id, p_limit, p_offset)` — inbox
- `get_unread_notification_count(p_user_id)` — badge count
- `spend_sparkles(p_user_id, p_amount, p_reason)` — atomic currency spend
- `grant_sparkles(p_user_id, p_amount, p_reason)` — admin/webhook grant

**Edge Functions (Deno, deployed to Supabase):**
- `nightly-dreams` — pg_cron at 3am UTC. Finds eligible users (onboarded + AI enabled + active in 36h), generates 1 dream each via Flux Dev. $5/day budget cap at 3c/image. Respects dream wishes. Sends notifications.
- `revenuecat-webhook` — validates RevenueCat signature, grants sparkles on purchase success.
- `send-push` — dispatches via Expo Push API using tokens from `push_tokens` table.

**Realtime:** Listener in `app/_layout.tsx` for new notifications (in-app toasts).

### Replicate (AI Image Generation)

**API:** REST at `https://api.replicate.com/v1/`

**Auth:** Bearer token via `EXPO_PUBLIC_REPLICATE_API_TOKEN`

**Models used:**
- **Flux Dev** (text-to-image): `POST /models/black-forest-labs/flux-dev/predictions`
  - Input: `{ prompt, aspect_ratio: '9:16', num_outputs: 1, output_format: 'jpg' }`
  - Returns prediction ID → poll until succeeded/failed
  - Handles 429 rate limits with retry
- **Flux Kontext Pro** (photo-to-image): `POST /models/black-forest-labs/flux-kontext-pro/predictions`
  - Input: `{ prompt, input_image (base64 data URL), aspect_ratio: '9:16', output_format: 'jpg', output_quality: 90 }`
  - Shorter polling timeout (30 polls at 2s)

**Flow:** Create prediction → poll every 1.5-2s → get temp URL → download → upload to Supabase Storage → get permanent URL.

**Cost:** ~3c per image (Flux Dev).

### Anthropic (Prompt Enhancement)

**API:** REST at `https://api.anthropic.com/v1/messages`

**Auth:** `x-api-key` header via `EXPO_PUBLIC_ANTHROPIC_API_KEY`. Also requires `anthropic-dangerous-direct-browser-access: true` header (since called from client).

**Model:** `claude-haiku-4-5-20251001` (Haiku 4.5)

**Usage:**
- `enhanceWithHaiku(brief, fallback, maxTokens=150)` in `dreamApi.ts` — generic enhancement
- `generateDreamPrompt(recipe)` in `enhancePrompt.ts` — full pipeline: buildPromptInput → buildHaikuPrompt → send to Haiku → fallback to buildRawPrompt
- Nightly dreams function also calls Haiku directly

**Key pattern:** Always has a fallback. If Haiku fails, the raw prompt (assembled from recipe engine) is used instead. Haiku's job is to pick the best 4-5 ingredients and weave them into a coherent 60-word scene.

### SightEngine (Content Moderation)

**API:** REST at `https://api.sightengine.com/1.0/`

**Auth:** Query params `api_user` + `api_secret` via `EXPO_PUBLIC_SIGHTENGINE_API_USER` / `EXPO_PUBLIC_SIGHTENGINE_API_SECRET`

**Endpoints:**
- `check.json` — image moderation (nudity-2.1, gore-2.0, weapon, self-harm)
- `video/check-sync.json` — video moderation (same models, checks frames)
- `text/check.json` — text profanity/spam (discriminatory, violent, sexual)

**Thresholds (in lib/moderation.ts):**
- Images: strict on nudity/sexual_display/erotica/gore/weapons, but bikini/lingerie allowed (suggestive excluded from checks)
- Text: blocks discriminatory, violent, sexual (>0.5) but allows casual insults/trash talk
- Provider-agnostic interface: `ModerationProvider` interface, currently using `SightengineProvider`. Swap by implementing new class.

### RevenueCat (In-App Purchases)

**SDK:** `react-native-purchases`

**Config:** iOS key `test_tEeLFdbkOGpyiarJlTELpIFpGAc` (currently test mode). Android key placeholder.

**Setup:** `configureRevenueCat(userId)` called once at app startup after auth. Links purchases to Supabase user ID.

**Offerings:** "sparkles" or "sparkle_packs" — fetched via `getSparklePackages()`.

**Purchase flow:** `purchaseSparklePackage(pkg)` → RevenueCat handles Apple payment → webhook fires → `revenuecat-webhook` Edge Function grants sparkles.

**Sparkle system:**
- `users.sparkle_balance` — current balance
- `sparkle_transactions` — audit log (every spend/grant)
- `spend_sparkles(user_id, amount, reason)` — atomic RPC (fails if insufficient)
- `grant_sparkles(user_id, amount, reason)` — admin/webhook RPC

### Expo Push Notifications

**Flow:** App registers device token via `usePushNotifications()` → stored in `push_tokens` table → `send-push` Edge Function dispatches via Expo Push API.

**Triggers:** Comments, likes, friend requests, shares, dream generation.

---

## Database Schema (Key Tables)

### Core Tables
- **`users`** — id, email, username, avatar_url, critic_level, pro_subscription, skip_tokens, sparkle_balance, user_rank, last_active_at
- **`uploads`** — id, user_id, categories[], image_url, media_type (image|video), width, height, caption, is_ai_generated, ai_prompt, twin_of, fuse_of, from_wish, recipe_id, comment_count, like_count, twin_count, fuse_count, is_active, is_approved, is_moderated, total_votes, rad_votes, bad_votes
- **`user_recipes`** — user_id, recipe (JSONB), onboarding_completed, ai_enabled, dream_wish, wish_recipient_ids, wish_modifiers
- **`recipe_registry`** — tracks all recipe variants ever created

### Social Tables
- **`votes`** — user_id, upload_id, vote_type
- **`favorites`** — user_id, upload_id (bookmarks)
- **`follows`** — follower_id, following_id (unidirectional)
- **`friendships`** — user_id, friend_id, status (mutual, bidirectional)
- **`comments`** — id, upload_id, user_id, body, parent_id (nested)
- **`comment_likes`** — user_id, comment_id
- **`post_shares`** — sender_id, recipient_id, upload_id
- **`blocked_users`** — blocker_id, blocked_id
- **`reported_posts`** — upload_id, reporter_id, reason

### System Tables
- **`notifications`** — recipient_id, actor_id, type, upload_id, body, seen
- **`push_tokens`** — user_id, token, platform
- **`sparkle_transactions`** — user_id, amount, reason, type (spend/grant)
- **`ai_generation_log`** — user_id, recipe_snapshot, enhanced_prompt, model_used, cost_cents, status
- **`ai_generation_budget`** — user_id, date, images_generated, total_cost_cents
- **`achievements`** — user_id, achievement_type
- **`user_category_affinity`** — user_id, category, score
- **`feature_flags`** — name, enabled

### Important Constraints
- `get_feed` RPC must be DROPped before recreating (Postgres can't change return types in-place)
- Friendships are bidirectional — unfriending auto-unfollows both directions
- `is_approved` flag gates feed visibility (moderation/reporting)
- Sparkle spends are atomic RPCs (fail if insufficient balance)

---

## Design System

### Colors (use Tailwind classes)
- Background: `bg-background` (#0F0F1A)
- Surface/cards: `bg-surface` (#1A1A2E)
- Borders: `border-border` (#2D2D44)
- Primary action (Gas): `bg-gas` (#FF4500)
- Fire palette: flame (#FF4500), ember (#FF6B00), spark (#FFB800)
- Primary text: `text-text-primary` (#FFFFFF)
- Secondary text: `text-text-secondary` (#9CA3AF)

### Typography
- Headings: `text-xl font-bold text-text-primary`
- Body: `text-base text-text-primary`
- Captions: `text-sm text-text-secondary`

### Spacing
- Screen padding: `px-4`
- Card padding: `p-4`
- Stack gap: `gap-3` or `gap-4`
- Section gap: `gap-6`

### Component Conventions
- All screens have `bg-background` as root background
- Cards use `bg-surface rounded-2xl p-4`
- Primary buttons: `bg-gas rounded-xl py-3 px-6`
- All text must be inside `<Text>` components
- Use `expo-image` `<Image>` not React Native's built-in Image

---

## Data Flow Patterns

### Standard data flow
```
User Action → TanStack Query Hook (useMutation/useQuery) → Supabase RPC/REST
  → Postgres (with RLS) → Cache invalidation + Zustand store bump → React re-render
```

### Dream generation flow
```
User taps Generate → Recipe from onboarding store
  → recipeEngine.buildPromptInput(recipe) → rolls dice on axes, picks from pools
  → enhancePrompt.generateDreamPrompt(recipe) → sends to Haiku for 60-word scene
  → dreamApi.generateFluxDev(prompt) → Replicate prediction → poll until done
  → dreamApi.persistImage(tempUrl) → download → Supabase Storage upload
  → dreamPost.postDream() → insert into uploads table
  → dreamPost.pinToFeed() → shows as first card in feed
```

### Auth flow
```
SignUp/LogIn → Supabase Auth (email or OAuth) → Session in SecureStore
  → useAuthStore.initialize() listens for changes
  → postAuthRoute: has_ai_recipe? → home : onboarding
```

---

## Key Rules

1. Never use `StyleSheet.create` — always use NativeWind `className`
2. Never use `any` type
3. Always handle loading and error states in UI
4. Supabase queries go in TanStack Query hooks inside `hooks/`
5. Keep screens thin — logic in hooks, UI in components
6. The app is dark-mode only — no light theme logic needed

## iOS UX Principles (Apple HIG)

### Touch targets
- Minimum 44x44pt touch target for all tappable elements (use `min-h-[44px] min-w-[44px]`)
- Never place interactive elements too close together — minimum 8px gap

### Navigation
- Back gestures must always work (don't block swipe-back)
- Bottom tab bar is always visible — never hide it mid-session
- Modals slide up from bottom, never push from side
- Destructive actions always require confirmation

### Feedback & Motion
- Every tap gets immediate visual feedback (opacity or scale change)
- Use `activeOpacity={0.7}` on TouchableOpacity or Reanimated scale for press states
- Animations should be snappy: 200-300ms for transitions, not slow fades
- Add haptic feedback on key actions (Gas/Pass swipe, upload success, achievements)

### Typography & Readability
- Minimum font size 13pt — never smaller
- Line height at least 1.4x font size for body text
- Never put white text on light backgrounds or dark text on dark backgrounds
- Limit lines of text to 60-70 chars wide for readability

### Loading & Empty States
- Every screen needs a loading skeleton or spinner — never show blank white/dark space
- Every empty state needs an illustration or icon + message + action button
- Never show raw error messages to users — translate to plain English

### iOS-Specific Conventions
- Respect safe areas — always wrap screens in `SafeAreaView` or use `safe-area` classes
- Keyboard should push content up, never cover input fields
- Swipe interactions should have rubber-band physics (Reanimated handles this)
- Large title style for main screens, small title for drill-downs
- Use SF Symbols (via `@expo/vector-icons/Ionicons`) for icons — they feel native

---

## Working With Kevin — Session Workflow

### Screenshots
When Kevin **explicitly asks you to view a screenshot** (e.g. "take a look", "last screenshot", "last shot", "check the screenshot", "see what I mean" when referencing a visual), grab the most recent PNG from his Desktop:
```
ls -t ~/Desktop/*.png | head -1
```
Then read that file. Don't ask which screenshot — just go get it.

**Do NOT** trigger a screenshot lookup just because he uses words like "look", "see", or "check" in casual conversation (e.g. "it looks glitchy", "I didn't see the text"). Only fetch when he's clearly directing you to view an image.

### Running the Seed Script
The seed script lives at `scripts/seed.js`. It requires a service role key.

Credentials are in `.env.local` at the project root. The service role key is `SUPABASE_SERVICE_ROLE_KEY`. To run:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && \
  SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2) \
  node scripts/seed.js
```

Run this in the background (`run_in_background: true`) — it takes 2-4 minutes. It wipes all test users and recreates everything from scratch. Kevin's own account is never touched.

**Before reseeding:** check if any new migrations need to be applied in Supabase first. Migrations live in `supabase/migrations/` and are run manually via the Supabase dashboard SQL editor.

### Running Node Scripts Generally
Node is managed via nvm. Always source nvm before running scripts:
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node <script>
```
Or for npx commands (installing packages, running expo CLI):
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx <command>
```

### Dev Build vs Expo Go
This app uses native modules (`react-native-compressor`, `expo-video`) that don't work in Expo Go. Always remind Kevin to use the **dev build** installed via Xcode, not Expo Go. If he reports a "package not linked" error, that's the cause.

To run the dev build:
1. Open `ios/*.xcworkspace` in Xcode
2. Select the booted simulator (check `xcrun simctl list devices available | grep Booted`)
3. Hit play in Xcode
4. Then run `npx expo start` for Metro

### After Adding a Native Package
```bash
cd ios && pod install && cd ..
```
Then rebuild in Xcode. Remind Kevin to do this — he won't always remember.

### Simulator UDID
The booted simulator is usually iPhone 17 Pro. Get its UDID with:
```bash
xcrun simctl list devices available | grep Booted
```

### Database Migrations
- Files live in `supabase/migrations/` numbered sequentially (001, 002, etc.)
- They are NOT auto-applied — Kevin runs them manually in the Supabase dashboard SQL editor
- When adding new columns or changing RPCs, always create a migration file AND remind Kevin to run it before testing
- The `get_feed` RPC must be DROPped before recreating because Postgres can't change return types in-place

### Seed Script Maintenance
The seed script (`scripts/seed.js`) must be kept in sync with the DB schema. Any time a new column is added to `uploads`, add it to the seed insert. The seed is the living example of what complete, correct data looks like.

### Video in the Seed
Video URLs in the seed use Google Cloud Storage public sample videos:
```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/<filename>.mp4
```
These are reliable, no auth required, correct content-type. All are 1920x1080 landscape.
Don't use Mixkit slugs — they're not predictable without checking their site.

### Styling Note
The CLAUDE.md rule says "never use StyleSheet" but several existing components (SwipeCard, PostTile, RankCard, photo/[id].tsx) use StyleSheet.create because they predate or need specific performance characteristics. When editing those files, stay consistent with their existing style rather than mixing NativeWind in.
