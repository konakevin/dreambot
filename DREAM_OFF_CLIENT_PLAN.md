# Dream Off — Client (UI) Build Plan

**Status: 2026-07-26.** The backend is complete (DB 400–417, edge code, 7,300-topic deck, monitoring —
all born dark). This plan is the **full client build**: every screen, every phase/state, every scenario,
built to a **5-star bar** by matching DreamBot's existing design language exactly. Companions:
`DREAM_OFF_PLAN.md` (design), `DREAM_OFF_REMAINING_WORK.md` (rollout), `DREAM_OFF_BUILD_PLAN.md`.

Everything ships **dark** — gated on `get_client_flags().dream_off_enabled` (runtime) + a build const —
so the app is byte-identical to today until Stage D.

---

## 0. Design language (match these exactly — this is what makes it "native")

Sources: `constants/theme.ts`, `constants/fonts.ts`, `lib/responsive.ts`.

- **Color:** bg `#000`, surface `#0F0F14`, card `#1A1A24`, border `#2A2A3A`; accent `#A78BFA`
  (`accentLight #C4B5FD`); text `#FFF` / `#8E8E9E`; body-on-black `rgba(255,255,255,0.88)`.
- **Signature gradient:** `gradients.brand = ['#A78BFA','#F9A8D4','#5EEAD4']` — headlines + primary CTAs only.
- **Type:** `GradientTitle` (Quicksand, brand gradient) for hero/section headers; `@/components/AppText`
  `Text`/`TextInput` everywhere else (auto DM Sans). The **locked InfoStep cadence** for any teaching/intro
  screen: purple uppercase eyebrow (letterSpacing 2.5) / gradient headline / `bodyOnDark` body / accent footnote.
- **Buttons:** `GradientButton` (pill, purple glow) = primary; outline/surface pill = secondary.
- **Responsive:** author at iPhone-14 base, run every size through `verticalScale`/`fontScale`/
  `verticalScaleClamped`; `useDeviceClass()` for SE/iPad; NO hardcoded sizes (lint-enforced). NativeWind
  exists but **new code uses `StyleSheet.create` + scale helpers** (house convention).
- **Loading:** `WaveLoader` (dot wave) for full-screen waits; `ProgressRing` (determinate arc) for the
  entry render + countdowns.
- **Sheets:** RN `Modal` `presentationStyle='pageSheet'` (iPhone) / `'fullScreen'` (iPad) + `SafeAreaView`;
  or the animated-overlay pattern (`EditDescriptionModal`) for centered cards. Tap-scrim to dismiss.
- **Grids:** `FlashList` (perf). Reuse `PostGrid`/tile patterns for the voting gallery + results.
- **Delight (memory: pure joy):** DreamBot voice in every empty state + micro-copy; a shimmer/confetti beat
  on the gold reveal; playful "waiting" states. Never metric-y.
- **Design ethos (Kevin, 2026-07-26): "shimmer, yet calm and bright."** Beautiful to sit in, never noisy.
  The vote token is a **tactile gold-foil star sticker** — glossy, faintly domed, hand-placed tilt, with a
  satisfying **peel-&-stick** micro-animation when you slap it on an entry (not a flat emoji). Light catches
  on the gold winner + the medals; the rest of the surface stays quiet #000 so the dreams are the color.

---

## 1. Foundations (build first)

- **`lib/dreamOffApi.ts`** — typed wrappers for every RPC + the `dream-off-submit` edge call, returning
  the jsonb shapes the backend defines. Single source for the client↔backend contract.
- **`hooks/useDreamOffEnabled.ts`** — reads `get_client_flags()` once (TanStack Query, long staleTime),
  returns `enabled`. Every Dream Off entry point + route guards on it. Off → render nothing (or a calm
  "not available yet" for a cold deep-link).
- **`store/dreamOff.ts`** (Zustand) — `pendingInviteCode` (deep-linked code awaiting auth),
  `pendingEntryDraft` (in-flight entry params). Kept SEPARATE from create's `pendingCreatePreset`.
- **TanStack Query keys** — `['dreamOff','room',id]`, `['dreamOff','gallery',id]`, `['dreamOff','myGames']`,
  etc. Invalidate room+gallery on any realtime phase flip.
- **`components/dreamOff/`** — shared primitives: `PhaseCountdown` (chip ticking to `phase_expires_at`),
  `PlayerAvatars` (row of joined players, dimmed = not-yet-acted), `StarMeter` (★★/★☆ — gold-foil stickers,
  "2 stars left"), `GoldStar` (the reusable tactile foil-star sticker w/ peel-&-stick placement anim),
  `TopicBanner` (the big dealt topic, gradient), `EntryCard` (image tile w/ optional author + star count),
  `PhaseCta` (the one big action per phase). All theme-native.

**Small backend addition (migration 418, pairs with the create flow):** `dream_offs.pack_category`
(`scene`|`cast`), `dream_offs.cast_mode` (`single`|`couple`|null); `create_game` accepts them; `deal_topic`
filters `dream_off_topics` by (category, chosen pack). The **you / you+1 wording is applied client-side**
at display time (stored cast topic is the bare scenario). + `get_game_room` returns pack_category/cast_mode.

---

## 2. Navigation & file structure

```
app/game/
  _layout.tsx          # Dream Off stack (dark, native header)
  create.tsx           # Create-a-Dream-Off flow (stepped)
  [id].tsx             # THE ROOM (phase-aware) — the heart
  [id]/entry.tsx       # Entry compose (pick model → submit) — or a sheet
```
- Entry render reuses **`app/dream/loading.tsx`** verbatim (dedicated `dream_queue:${jobId}` realtime
  channel + catch-up + 6s poll), pointed at `dream-off-submit`.
- **Deep links** (`app/_layout.tsx`): add `join/([A-Z0-9]{10})` → stash `pendingInviteCode` → after auth a
  `PendingInviteReplayer` calls `join_game_by_code` → route to `/game/{id}`. Add `game/([a-f0-9-]+)` →
  `/game/{id}`. Must not shadow post/photo/user.
- **Push routing** (`lib/notificationRouting.ts`): `dream_off_*` → `/game/${referenceId}` (reference_id =
  game_id); the Room shows the correct phase on load. Reuse the pre-auth stash/replay.
- **Entry points (NOT the Create tab — Kevin, 2026-07-26):** Create's job is getting to the prompt; a
  Dream Off card there adds a tap and muddies it. Dream Off lives on the **Profile**:
  - (a) **Profile is the home** — the header grows (above the album tabs/grid) to hold a one-tap
    **"Start a Dream Off"** gradient button, and directly below it the **"Your Dream Offs"** shelf
    (horizontal `FlashList` of active games, `get_my_games`, "your turn"-badged) as part of the
    `ListHeaderComponent`. Starting or resuming is always one tap.
  - (b) **Settings** — an always-there "Start a Dream Off" row (secondary discovery path).
  - No `create.tsx`-tab card.

---

## 3. The Create flow (`app/game/create.tsx`) — stepped, InfoStep-cadence

`create_game` is called once the topic is committed (Step 2) so we have a game + invite code to share; the
rest configures it in `setup`.

- **Step 1 — Who's in the picture?** Two big tiles (OnboardingTileScreen style): **🎨 Scene** ("the dream
  is the star — no faces") / **🪞 Cast** ("you're in it"). Cast → a second row: **Just me** / **Me + my +1**.
  Sets `pack_category` + `cast_mode`.
- **Step 2 — Pick your topic.** A grid of theme pills w/ emoji (Cute, Cursed, Chaotic, Epic, Glam, Hot
  Summer, Anime, Movies, Video Games, Sci-fi, Era, Cozy; + in-season holiday packs with a ✨ badge; Roast
  cast-only, Worlds scene-only auto-filtered by category). Three ways: **Deal me one** (`deal_topic` →
  `TopicBanner` + "Deal again"), **Surprise me** (deal across all in-category), **Write your own** (input,
  sanitized). Cast topics render pre-worded ("you as …" / "you and your +1 as …").
- **Step 3 — Set it up.** Max players (stepper, default 12), "Require my approval to join" toggle,
  (optional/gated) "Cover everyone's dreams" pot prefund. Invite friends (friend picker → `invite_players`)
  + **Copy invite link** / native share (`dreambotapp.com/join/{code}`).
- **Step 4 — Start.** Summary card, big **"Start the Dream Off"** (`advance_phase` → submission) → Room.
  (Or "invite more later from the Room.")

---

## 4. The Room (`app/game/[id].tsx`) — phase-aware, the heart

**Shell (all phases):** `TopicBanner` header, `PhaseCountdown` chip, `PlayerAvatars`, owner ⋯ menu
(Invite · Advance now · Cancel). Subscribes to a dedicated **`dream_off_room:${id}` realtime channel** on
`dream_offs` (phase flips only — entries/votes are deny-all/off-publication for blindness); on any phase
change (or screen focus) → invalidate + refetch `get_game_room` + the phase's data. 6s poll backstop.

**Phase: setup**
- Owner: topic, big **Invite** (link + share), players filling in live, **Start the Dream Off**
  (`advance_phase`, enabled ≥1 other player), approve-pending list (if `join_approval`), "Deal a new topic".
- Joiner: "You're in 🎉 — waiting for {host} to start" + topic teaser + players.

**Phase: submission** (`get_game_room` + your entry state)
- Big topic + countdown.
- **Not submitted:** hero **"Make your dream"** → §5 entry pipeline.
- **Submitted:** your entry thumb + "Your dream's in ✓", + "waiting on {N}" (`PlayerAvatars` dimmed).
- Owner: "Start voting early" when everyone's in.
- Optional light activity line (`get_game_activity`): "Alex joined · Sam's dream is in".

**Phase: voting** (`get_game_gallery` blind + `get_my_ballot`)
- "Star your favorites" + `StarMeter` (2 gold stars) + countdown.
- Blind gallery grid of `EntryCard`s (image only, author hidden, per-viewer shuffle). Your own entry marked
  "yours" + non-votable (dimmed).
- Tap a card → a **gold foil star peels & sticks** onto it (tactile placement anim, slight tilt);
  `cast_votes` fires (debounced) with the current 2-max selection; re-tappable until close. "Stars left" state.
- Owner: **"Reveal the results"** (`advance_phase`) when all voted.

**Phase: results** (`get_game_results` + revealed `get_game_gallery`)
- Celebratory reveal: **podium with medals** — the tally's top 3 map to **🥇 Gold** (winner, spotlight +
  shimmer/confetti beat), **🥈 Silver** (runner-up), **🥉 Bronze** (3rd; shown at 3+ players). Superlative
  badges. No backend change — `tally_results` already ranks winner/runner_up/dark_horse → gold/silver/bronze.
- All entries revealed, ranked, with author avatars/names + gold-star counts.
- **Share** (game link → the `/join/{code}` results landing) + **Rematch** (new `create_game`,
  same pack/players prefilled).

**Phase: no_contest** — "Not enough dreamers made it this round 🌙" + Rematch.
**Phase: cancelled** — "{host} called off this Dream Off."

---

## 5. Entry pipeline (`app/game/[id]/entry.tsx` or a sheet)

- Show the fully-worded topic (`TopicBanner`).
- **Pick a model** — `ModelPicker` restricted to the game's tier set (8 standard models). Topic = the prompt
  (optionally a small "add a twist" hint field, sanitized).
- **Dream it up** → `dream-off-submit` (game_id, force_model, hint/prompt) → `{dream_id}` → navigate to the
  **reused loading screen** (`dream_queue:${dream_id}` realtime) → on complete, the entry is attached
  server-side; return to the Room ("Your dream's in ✓").
- Status handling: `insufficient_sparkles` → paywall (`/subscribe` / sparkle purchase); `already_submitted`
  → back to Room; `submission_closed`/`disabled` → toast + Room; `model_not_allowed` → (UI prevents; reselect).

---

## 6. Invites, deep links, notifications

- **Share:** owner copies/shares `dreambotapp.com/join/{code}` (mirrors `sharePost`).
- **Join flow** (`join_game_by_code`) — friendly state per status: joined/already_member → Room;
  spectator → Room (results-only, "you're watching"); pending_approval → "waiting for {host} to let you in";
  full → "this game's full"; revoked → "this invite expired"; removed → "you're not in this game";
  not_found → "we couldn't find that game"; disabled → "Dream Off isn't live yet".
- **Deep link** (cold + warm): `join/{code}` → auth-gated replay → Room. `game/{id}` → Room.
- **Push:** `dream_off_invite` / `voting_open` / `results` / `your_turn` / `nudge` / `pot_refund` →
  `/game/{game_id}` (Room resolves phase). Copy already lives in `send-push`.

---

## 7. Profile as the Dream Off home (enlarged header) + Settings

- **Enlarged profile header** (own profile only): avatar/name/stats, then a prominent one-tap
  **"Start a Dream Off"** gradient button, then the **"Your Dream Offs" shelf** — all inside the
  `ListHeaderComponent` above the album tabs/grid. Gate the whole block on `useDreamOffEnabled`
  (renders nothing when dark, so the header stays its normal size pre-launch).
- **Shelf:** `get_my_games` → horizontal `FlashList` of game cards. Card: `TopicBanner`-mini, phase chip,
  countdown, **"Your turn" badge** (unsubmitted in submission / unvoted in voting). Tap → Room.
  Bucket order: Your Turn → Live → Results. Empty (no games yet) → hide the shelf, keep the Start button.
- **Settings row:** a "Start a Dream Off" row (secondary path), same `useDreamOffEnabled` gate.
- (Optional `users.last_room_view_at` for unseen badging — deferred.)

---

## 8. Scenarios & edge states (each gets a real, designed state)

Insufficient sparkles · already submitted · deadline expiry mid-view (realtime flips the Room) ·
forfeited/NSFW entry ("your entry got moderated — {refund}") · spectator (results-only) · owner tools
(advance/cancel/approve/kick) · not-enough-entries (no_contest) · feature-dark cold-deep-link ("not live
yet") · offline/refetch-fail (retry) · you're the only player (start still allowed → resolves to
no_contest/win-by-default).

---

## 9. Build order

1. ✅ **Migrations 420 + 421** (both APPLIED) — 420 `pack_category`/`cast_mode` on games (create_game
   made re-runnable via CREATE OR REPLACE) + deal_topic category filter + get_game_room surfaces the pair;
   421 the DB-driven **pack catalog** (`dream_off_packs`, 48 packs, `get_dream_off_packs`, deal_topic v3
   gating season on the catalog). dbspecs written (CI lane blocked by unrelated repost `bulk_unrepost` tsc).
2. **Foundations** — ✅ `store/dreamOff.ts`, ✅ full `components/dreamOff/*` (GoldStar tactile foil sticker,
   StarMeter, Medal, PhaseCountdown, TopicBanner, PlayerAvatars, EntryCard, PhaseCta, wordTopic) + barrel,
   ✅ `types/dreamOff.ts` (RPC wire contracts). ⏳ `lib/dreamOffApi.ts` + `hooks/useDreamOffEnabled.ts`
   **BLOCKED on `types/database.ts` regen** (RPC names must be in the generated Functions union to compile).
3. **Room shell + realtime** + the 6 phase screens (start with submission→voting→results core loop).
4. **Entry pipeline** (reuse loading screen).
5. **Create flow** (pack picker reads `get_dream_off_packs`).
6. **Invites + deep links + join flow + notification routing.**
7. **Profile entry** — enlarged header (Start button + "Your Dream Offs" shelf) + Settings row.
8. **Polish pass** — the tactile gold-foil star (peel-&-stick) + shimmer, medals reveal, empty states,
   copy, iPad, SE, a11y, the gold confetti.

**UNBLOCK for 3–7:** `supabase gen types typescript --project-id jimftynwrinwenonjrlj > types/database.ts`
(all Dream Off migrations 400–421 are applied, so this is safe and pulls in every table + RPC).
9. **QA** — full loop on 2 sims (create → invite → both submit → both vote → results), each edge state.

---

## 10. Gating / launch (Stage C→D)

- Edge deploy (the 5-fn set) done by Kevin.
- Web `/join/{code}` live (done).
- Client ships dark (flag off), submitted to App Store.
- Verify AASA `/join/*` + a live `/join/{code}` before the client relies on it.
- **Stage D:** `UPDATE engine_config SET dream_off_enabled=true` — the only step that lights it up.

---

*Every screen above is designed to the 5-star bar: native design language, a clear single action per state,
delightful DreamBot voice, and a real state for every scenario — nothing half-baked.*
