# Rad or Bad — Claude Code Guidelines

## Session Startup
Do NOT auto-start the dev environment. Instead, let Kevin know he can run `/rad` to spin up the dev tools (simulator check, Xcode, Metro). Jump straight into whatever he needs.

## What This App Is
Binary swipe rating app — users upload photos of anything (cars, fits, setups, etc.), others swipe Rad 🔥 or Bad 👎. Must rate 10 others to unlock your own score. Dark, high-energy aesthetic.

## Stack
- **Framework:** React Native + Expo SDK 54, Expo Router v4 (file-based routing)
- **Styling:** NativeWind v4 (Tailwind CSS) — always use className, never StyleSheet
- **State:** Zustand (client state), TanStack Query (server/async state)
- **Backend:** Supabase (Postgres, auth, storage, realtime)
- **Animations:** Reanimated 3 + Gesture Handler
- **Images:** expo-image (not react-native-fast-image)
- **Language:** TypeScript strict mode — no `any`, no `// @ts-ignore`

## Design System

### Colors (use Tailwind classes)
- Background: `bg-background` (#0F0F1A)
- Surface/cards: `bg-surface` (#1A1A2E)
- Borders: `border-border` (#2D2D44)
- Primary action (Gas): `bg-gas` (#FF4500)
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

## File Structure
```
app/
  (tabs)/         # Main tab screens
  (auth)/         # Auth screens (login, signup)
  photo/[id].tsx  # Photo detail modal
components/       # Shared UI components
lib/
  supabase.ts     # Supabase client
store/            # Zustand stores
hooks/            # Custom React hooks
types/
  database.ts     # Supabase DB types
```

## Routing (Expo Router)
- File-based, like Next.js App Router
- `(tabs)` and `(auth)` are route groups (don't appear in URL)
- `[id]` is a dynamic segment
- Navigate with `router.push('/photo/123')` or `<Link href="/photo/123">`

## Key Rules
1. Never use `StyleSheet.create` — always use NativeWind `className`
2. Never use `any` type
3. Always handle loading and error states in UI
4. Supabase queries go in TanStack Query hooks inside `hooks/`
5. Keep screens thin — logic in hooks, UI in components
6. The app is dark-mode only — no light theme logic needed

## iOS UX Principles (Apple HIG)
Follow these in every screen and component:

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

Run this in the background (`run_in_background: true`) — it takes 2–4 minutes. It wipes all test users and recreates everything from scratch. Kevin's own account is never touched.

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
These are reliable, no auth required, correct content-type. All are 1920×1080 landscape.
Don't use Mixkit slugs — they're not predictable without checking their site.

### Styling Note
The CLAUDE.md rule says "never use StyleSheet" but several existing components (SwipeCard, PostTile, RankCard, photo/[id].tsx) use StyleSheet.create because they predate or need specific performance characteristics. When editing those files, stay consistent with their existing style rather than mixing NativeWind in.
