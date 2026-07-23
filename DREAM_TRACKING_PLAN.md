# DREAM_TRACKING_PLAN.md — Progress bar, pending tiles & the render dock

**Status:** Planned, not started (2026-07-23). Design settled with Kevin.
**Owner surface:** client only (React Native). **No backend, no native, no APNs.**
**One-line:** give queued/in-progress dreams a visible, robust in-app presence — a progress bar
while you watch, live "pending" tiles in your Dreams album while you browse, and an ambient dock
pill that keeps you aware and one tap from either.

---

## 0. Why (the gap this closes)

Between "I tapped Dream" and "the photo appears in my Dreams album," an in-flight dream is **invisible
inside the app.** The only feedback is a push notification, which `send-push` can legitimately suppress
(active-in-app / already-viewed / sibling-seen gates), and there's no way to re-check a dream you
queued and walked away from. A **failed/dead-lettered dream has no in-app home at all** — it silently
never appears. Users can queue up to 5 dreams at once (the in-flight cap), so this is a real blind spot.

This feature makes in-flight dreams first-class and glanceable, and it does so entirely by **reading
`dream_queue` data the backend already writes** — no new backend work.

**Explicitly out of scope / parked:** the iOS **Live Activity** (Lock Screen / Dynamic Island). It
needs a native ActivityKit module + a direct-APNs backend migration; park it for whenever native APNs
happens (see the reasoning in prior discussion and, tangentially, `PORT_TO_SWIFT.md` §12). The in-app
tracker below covers the functional need; the Live Activity would be pure delight on top.

---

## 1. The three pieces

1. **Progress bar** on the dream loading screen — staged status ("Dreaming up your scene → Painting →
   Finishing"), robust to leaving and returning to the app.
2. **Pending tiles** in the Dreams album — the actual tracker: each in-flight dream shows live stage,
   morphs into the finished image when done, shows a retry/refunded state on failure.
3. **The dock pill** — an ambient, layout-participating status bar above the tab bar: "N dreams
   painting…", tap → Dreams album, a brief "ready ✨" flash on completion. Visible on the 5 tabs only.

All three read from **one shared source of truth** (§2). Build that first.

---

## 2. Shared foundation — the in-flight dreams source

Everything hangs off a single hook/store: **`useInFlightDreams()`** — the current user's
`dream_queue` rows in a non-terminal state, kept live.

- **Query:** `dream_queue` where `user_id = auth.uid()` AND `status IN ('queued','in_progress')`,
  selecting `id, status, current_stage, stage_updated_at, model, created_at, attempt_count`. RLS
  already scopes rows to the user (no policy change). TanStack key `['inFlightDreams', userId]`,
  `staleTime` short (it's realtime-backed; a mount refetch covers cold start).
- **Realtime:** **extend the existing `user-<uid>` channel** in `app/_layout.tsx` (it already binds
  `notifications` INSERT + `uploads` `*`). Add a `dream_queue` binding, `event: '*'`, filter
  `user_id=eq.<uid>` → upsert/remove rows in the `['inFlightDreams']` cache. `dream_queue` is already
  in the `supabase_realtime` publication, so no migration. **Do NOT create a new channel** — binding an
  unpublished table would kill the channel, and one channel is cheaper.
  - On a row going `completed`/`dead_letter`, remove it from the in-flight set (it transitions to the
    finished/failed presentation — §4).
- **Terminal transitions also arrive via the `uploads` binding** (a completed dream inserts an
  `uploads` row → already invalidates `my-dreams`), so the pending→finished morph is driven by data
  the channel already delivers.
- **Cold-start / catch-up:** iOS drops the socket in background and `postgres_changes` doesn't replay,
  so `useInFlightDreams` must **refetch on mount and on foreground** (the app already reseeds/invalidates
  on >60 s background — hook into that). This is the same catch-up discipline the loading screen uses.

**Stage → label mapping — define ONCE, in a shared module** (`lib/dreamStageLabels.ts`), consumed by
the loading bar, the pending tiles, and the pill. From the backend (`_shared/dreamQueueLifecycle.ts`,
verified): the only stages that actually fire are `claimed`, `resolve`, `flux_render`, `face_swap`
(conditional), `upload`. Map to a small user-facing set:

| `status` / `current_stage` | User-facing label | Checkpoint (for the bar fill) |
|---|---|---|
| `queued`, no stage | "In line…" | 0.05 |
| `claimed` / `resolve` | "Dreaming up your scene" | 0.20 |
| `flux_render` | "Painting your dream" | 0.55 |
| `face_swap` (only if present) | "Adding you in" | 0.80 |
| `upload` | "Finishing up" | 0.92 |
| `completed` | done → reveal | 1.0 |
| `dead_letter` | "Couldn't render" | — |

**Honesty about granularity (from the research):** renders are fast (~13–23 s typical, 140 s ceiling)
and `flux_render` dominates the wall-clock, so there are really only ~3 always-present transitions.
**Do NOT fake a precise percentage** — use these checkpoints as targets and **animate a gentle
asymptotic "creep"** toward the next checkpoint (never quite reaching it until the stage advances) so
the bar always feels alive and never stalls on a hard number. Use `stage_updated_at` to drive the creep
rate. This reads as progress without lying about it.

---

## 3. Piece 1 — Progress bar on the loading screen

**File:** `app/dream/loading.tsx` + `components/MagicalLoadingStage.tsx`.

Today the loading screen shows `MagicalLoadingStage` (mascot + WaveLoader + "Dreaming…" title), a
"Queue This" button, and already has robust recovery (`tryRecover`, AppState-foreground re-check,
90 s hard timeout, `DreamResumer` cold-start recovery). It subscribes to `dream_queue:<id>` but only
reacts to `completed`/`dead_letter`. **`current_stage` is currently ignored.**

**Changes:**
1. **Surface the stage.** In the existing `dream_queue:<id>` realtime handler and the `dream_jobs`
   poll, read `current_stage` (+ `status`) on every UPDATE and store it in local state.
2. **Render the bar.** Add a slim progress bar + the stage label (from `lib/dreamStageLabels.ts`) into
   `MagicalLoadingStage` (or just above the "Queue This" hint). Brand-gradient fill, the asymptotic
   creep from §2. Keep the mascot/WaveLoader — the bar augments, doesn't replace.
3. **Leave/return contract (the robustness Kevin asked for):**
   - **Background → foreground (same screen):** `tryRecover` already fires on AppState active; also
     re-read the `dream_queue` row's `current_stage`/`status` there and re-sync the bar. The bar must
     reflect reality on return, not a frozen pre-background stage.
   - **Cold launch mid-render:** `DreamResumer` already recovers the in-flight dream on app start; the
     resumed loading screen reads the current stage and shows the bar mid-progress.
   - **Completed while backgrounded:** on return, the completion catch-up (already present) routes to
     the reveal; the bar snaps to 1.0 then transitions.
4. **No change to "Queue This"** — leaving still requests the completion push. The bar is only for the
   "watching it" case.

> The loading screen keeps its own per-job subscription (battle-tested, handles the completion race);
> it does NOT need to read `useInFlightDreams`. It only needs to start reading `current_stage` from the
> payload it already receives.

---

## 4. Piece 2 — Pending tiles in the Dreams album

**Files:** `app/(tabs)/profile.tsx` (Dreams tab), `components/PostGrid.tsx`, a new
`components/PendingDreamTile.tsx`, `hooks/useInFlightDreams.ts`.

The Dreams tab renders `<PostGrid source={{ type: 'dreams', dreamsFilter }} />` (flattens
`useMyDreams` infinite pages). Inject the in-flight dreams as a **pending section prepended to the
Dreams grid** (own profile, Dreams tab only — not other PostGrid uses).

**Rendering:**
- Add pending items (from `useInFlightDreams`) as a **grid header / prepended rows** above the finished
  dreams, styled as tiles matching the grid metrics (`constants/grid.ts`). Simplest: render a
  `PendingDreamRow` as the FlatList `ListHeaderComponent` in the Dreams source, OR prepend synthetic
  items with a `kind: 'pending'` discriminator into the grid data (cleaner ordering, but touch
  PostGrid's item typing). Recommend the header approach first (isolated, no PostGrid surgery).
- Only when `dreamsFilter` includes private/all (a pending dream is a not-yet-saved private render;
  hide pending tiles under the "Posted" filter).

**`PendingDreamTile` state machine:**
- **Queued** — shimmer skeleton + "In line…".
- **Rendering** — shimmer + a small progress ring + the stage label (shared mapping), gently creeping.
- **Completed** — the tile **morphs into the finished image** in place: when the matching `uploads`
  row arrives (via the `uploads` realtime binding → `my-dreams` invalidation), remove the pending item
  and let the real grid tile take its place, with a crossfade + a one-time sparkle. Match pending↔real
  by the shared job UUID (`dream_queue.id == dream_jobs.id == uploads` linkage — the render writes the
  upload with the job id).
- **Failed (dead_letter)** — a "Couldn't render ✕ · sparkles refunded" tile. Tap → detail/dismiss.
  (Refund is automatic server-side; the tile is about *visibility*, not the refund.) See the retry
  caveat below.

**Tapping a pending tile:** non-interactive while queued/rendering (or a subtle "still cooking…"
tooltip); once it morphs to a finished tile it behaves like any Dreams tile (tap → fullscreen).

**Retry caveat (be honest):** a failed dream's original input (prompt/medium/model/photo) is **not
guaranteed to be recoverable** — `dream_jobs`/`dream_queue` don't store the full enqueue payload, and
there's no `uploads` row for a failed render. So one-tap "retry with same settings" is **not free**.
Options: (a) failed tile → "Create another" routing to a fresh Create screen (no prefilled inputs), or
(b) add input persistence to enable true retry (a small backend/enqueue change — **out of this plan's
no-backend scope**; mark as a future enhancement). Ship (a) first.

---

## 5. Piece 3 — The dock pill

### 5.1 The prerequisite: centralize the bottom inset (audit result)

The bottom inset is **scattered today** (verified):
- `app/(tabs)/_layout.tsx:115` — `tabBarBottomPad = insets.bottom > 0 ? insets.bottom : vs(8)`.
- `app/(tabs)/profile.tsx:359,451` — `useBottomTabBarHeight()` → `bottomInset` prop; `:787` selection
  bar `bottom: tabBarHeight + vs(12)`; `:939` hardcoded `paddingBottom: vs(90)`.
- `app/(tabs)/create.tsx:220,1032,1795,1921` — `useBottomTabBarHeight()` + hardcoded `+vs(16)` and a
  `KeyboardStickyView offset`.
- `components/FullScreenFeed.tsx:545` — **hardcoded** `bottomPadding = hideTabBar ? 16+insets.bottom :
  60+insets.bottom`.
- `components/PostGrid.tsx:424` — **hardcoded** `paddingBottom: vs(90)`.
- `app/(tabs)/top.tsx:580` — **hardcoded** `paddingBottom: vs(90)`.

**Refactor:** introduce **`useAppBottomInset()`** = `useBottomTabBarHeight() + dockHeight` where
`dockHeight` is an animated shared value (0 when the dock is hidden). Store `dockHeight` in a small
`@observable`/Zustand slice (`store/renderDock.ts`) or a context, animated with the app's standard HUD
easing. Migrate the ~6 call sites above to read `useAppBottomInset()` for their bottom padding /
`bottomInset` prop. This is the **only** structural work; after it, the dock appearing is one animated
value change and every tab surface eases up automatically. Bound and enumerable — do it first, verify
each of the 5 tabs still lays out correctly with the dock at height 0 (no visual change), THEN wire the
dock.

> Note: the feed keeps the **image full-bleed**; the inset lifts the **HUD metadata** (username/caption
> bottom offset), not the pager page height — do not resize pager pages (they re-snap on height change).
> On grids/Create the inset simply grows the scroll content padding / lifts the sticky footer.

### 5.2 The dock component

**File:** `components/RenderDock.tsx`, mounted at the app shell (in `app/(tabs)/_layout.tsx`, rendered
just above `<BottomTabBar>` inside the same `hudVisible`-driven `Animated.View` so it fades with the
tab bar on the immersive feed).

- **Visibility:** shown only when `useInFlightDreams().length > 0` (or during the ready-flash). Because
  it's mounted in the tab layout, it's inherently only on the 5 tabs — modals/sheets/loading/reveal/
  settings present over the tab bar and never show it. Fades with `hudVisible` on the feed; solid on
  grid/Profile/Create.
- **Height feeds `dockHeight`** (§5.1) so content eases up.

### 5.3 Pill state machine & interactions (settled with Kevin)

- **Hidden** — no in-flight dreams (and no pending ready-flash).
- **Rendering** — 1 dream: "✦ {stage label}…" (e.g. "Painting your dream…"); N dreams: "✦ {N} dreams
  rendering". **Tap → Profile ▸ Dreams**, scrolled to / highlighting the pending tiles. **Consistent
  for 1 or N** (Kevin's call — the loading screen is the only "watch it" surface; the pill never
  re-opens it).
- **Ready flash** — when a dream completes: "✨ Dream ready — tap to view" for ~3–4 s. **Tap → the
  finished dream's fullscreen reveal** (fast path). If more are still rendering, revert to Rendering
  (count−1). If it was the last, auto-dismiss after the flash. A minimum on-screen dwell + this flash
  prevent a single fast render from just blinking in and out.
- **Failed flash** — "Couldn't render — tap to check" → Profile ▸ Dreams (the failed tile).

**The pill is awareness + a shortcut, NOT a second tracker.** No in-place expanding list — the album's
pending tiles are the detail view. Build the per-dream UI once (§4), not twice.

---

## 6. Robustness / recovery contract (the whole point)

All three pieces must survive the app being backgrounded, killed, and the socket dropping. The rules:

- **Single source of truth:** `useInFlightDreams` (pill + album) + the loading screen's own per-job sub
  (bar). All read `current_stage` through the shared label module so they never disagree.
- **Catch-up on every entry:** refetch `useInFlightDreams` on mount + on foreground (>60 s background
  reseed hook). The loading screen re-reads its row on foreground (`tryRecover` already does the job
  half; add the stage read).
- **Cold start:** `DreamResumer` already resumes an in-flight dream; `useInFlightDreams` refetches on
  launch so the pill + album are correct immediately.
- **Missed realtime events:** the foreground refetch reconciles; never rely on realtime alone (iOS drops
  it). This mirrors the existing loading-screen + `user-<uid>` discipline.
- **Terminal reconciliation:** completed → the `uploads` row + `my-dreams` invalidation drive the tile
  morph; failed → `dead_letter` removes from in-flight and flips the tile to the failed state.

---

## 7. Edge cases

- **Multiple in-flight (up to 5):** pill summarizes; album shows all pending tiles; each morphs
  independently. Ready-flash queues (show one at a time, ~3 s each) or collapses to "2 ready ✨".
- **Dream completes while on the Dreams tab:** the pending tile morphs in place live (no navigation).
- **Dream completes while on the loading screen (foreground):** unchanged — the reveal shows; the pill
  never appeared (you didn't leave).
- **User signs out mid-render:** `useInFlightDreams` cleared with all caches on sign-out (existing
  behavior); dock hides.
- **Fast render (<3 s) while browsing:** pill respects a minimum dwell so it doesn't flicker; if it
  finishes before the dwell, show the ready-flash directly.
- **`dreamsFilter = 'posted'`:** hide pending tiles (they're unposted private renders).
- **Stuck/timed-out dream:** the queue re-queues (`attempt_count++`) or dead-letters at 5 attempts;
  the pending tile reflects `queued` (re-queued) vs `dead_letter` (failed). The `stage_updated_at`
  staleness can drive a subtle "taking longer than usual…" copy after N seconds.

---

## 8. Build order & phasing

1. **Foundation** — `lib/dreamStageLabels.ts`, `hooks/useInFlightDreams.ts`, extend the `user-<uid>`
   realtime channel with the `dream_queue` binding + catch-up refetch. (½–1 day)
2. **Progress bar** (Piece 1) — surface `current_stage` in the loading screen, add the bar + creep,
   foreground re-sync. Self-contained, shippable alone. (1–2 days)
3. **Bottom-inset refactor** (Piece 3 prerequisite) — `useAppBottomInset()` + migrate the ~6 call
   sites; verify no visual change at dock height 0. (1 day)
4. **Dock pill** (Piece 3) — `RenderDock` + `store/renderDock` + the state machine + tap routing +
   ready-flash. (1–2 days)
5. **Pending tiles** (Piece 2) — `PendingDreamTile` + inject into the Dreams grid + morph + failed
   state. (2 days)

Each phase is independently shippable and testable. Recommended order: 1 → 2 (visible win fast) → 3 →
4 → 5. **Total ≈ 1 week, all RN, no backend.**

---

## 9. Testing / QA checklist

- Unit: the stage→label + creep math (pure function, jest); `useInFlightDreams` cache upsert/remove on
  realtime events; sign-out clears it.
- Manual device matrix:
  - Queue a dream, stay on loader → bar advances through stages → reveal.
  - Queue, background the app mid-render, return → bar re-syncs to the real stage.
  - Queue, kill the app mid-render, relaunch → `DreamResumer` + pill + pending tile all correct.
  - Queue 3 dreams → pill "3 rendering", 3 pending tiles, each morphs independently, ready-flashes.
  - Force a failure (NSFW/dead-letter) → failed tile + refund visible + pill failed-flash.
  - Verify dock inset: all 5 tabs lift content correctly; feed image stays full-bleed, metadata lifts;
    no overlap with post metadata, the Create sticky footer, or grid last row.
  - Feed immersive mode: dock fades with the HUD; no clutter over images.

---

## 10. Open decisions

1. **Failed-dream retry:** ship "Create another" (fresh) now, or invest in input persistence for true
   one-tap retry later? (Recommend fresh now.)
2. **Ready-flash for multiple completions:** one-at-a-time queue vs "N ready ✨" collapse? (Recommend
   collapse to a count if >1 finishes near-simultaneously.)
3. **Pending-tile injection:** grid `ListHeaderComponent` (isolated) vs synthetic prepended items
   (cleaner ordering, touches PostGrid typing)? (Recommend header first.)
4. **"Taking longer than usual" copy** threshold on `stage_updated_at` staleness — worth it, or noise?
5. **Dock minimum dwell** duration for fast renders (e.g. 2.5 s) — tune on device.

---

*All client-side. Reads `dream_queue` / `current_stage` the backend already writes. No migrations, no
edge-function changes, no native code. The Live Activity remains parked.*
