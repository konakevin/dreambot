# FIX: "Just Viewed" album highlight + album-grid scroll performance

**Status:** Plan / handoff doc (2026-07-23). NOT started. Self-contained so a future agent can pick
this up cold. Two intertwined problems on the same surface — the profile/album grid
(`components/PostGrid.tsx` + `components/PostTile.tsx`):

1. **"Just viewed" is flaky** — the badge/anchor that marks the post you came from shows
   inconsistently.
2. **Fast-scrolling an album is clunky/slow** — scrolling down quickly appears to force every
   thumbnail that flies past to load *before* the tiles you actually stop on render.

The two fixes reinforce each other (a reliable jump + load-only-what-rests kills both the flaky
anchor and the clunk), so they're planned together. **Read this whole doc before touching code.**
Line numbers below were accurate on 2026-07-23 but WILL drift — grep by the named symbol.

---

## 0. Desired behavior (the spec, from Kevin)

- When a user opens someone's profile **from a feed card** — taps the **username** OR **swipes into
  their profile** — the profile's album grid should show a **"Just viewed" badge** over the tile of
  the post they just came from.
- If that tile is **below the fold** (an older post far down the album), show a small **"Just
  viewed" anchor** pill at the top; tapping it **scrolls down to that post's position and reveals
  it** — exactly how TikTok does it.
- The jump to a far-down tile must be **fast and smooth** — it must NOT stall while every tile it
  scrolls past loads first. Programmatic or fast manual scrolling should **skip loading tiles that
  only flash through the viewport** and load only what comes to rest in view.

---

## 1. Where everything lives (current implementation map)

### Components / state
- **`components/PostGrid.tsx`** — the FlatList grid. Owns ALL the "just viewed" state + scroll logic.
  Key symbols: `storeCurrentPostId`, `effectiveHighlightId`, `highlightIndex`, `scrollToHighlightRow`,
  `showJustViewedButton`, `scrollToHighlight`, `pendingAutoAnchor`, `highlightDismissed`,
  `badgeTapped`, `isFetchingHighlight`, `onGridViewableChanged`, `prefetchedRef`.
- **`components/PostTile.tsx`** — one grid cell. Renders the `<Image>` (expo-image) + the
  `isHighlighted` badge. `handlePress` stashes album context into the store before navigating.
- **`store/album.ts`** (`useAlbumStore`) — `{ ids, posts, albumSource, currentPostId }` + setters.
  `currentPostId` is the "just viewed" post for the STORE-driven path.
- **`constants/grid.ts`** — `NUM_COLUMNS` (3 phone / 5 iPad), `TILE_WIDTH`, `PORTRAIT_RATIO=5/4`,
  `TILE_HEIGHT`, **`ROW_HEIGHT = TILE_HEIGHT + TILE_GAP`** (exact + uniform — see §3).
- **`lib/imageUrl.ts`** — `tileImageUrl(display, original, thumb)` → `thumb ?? display ??
  transform`. `image_url_thumb` (~35 KB, 400×500) is populated by `scripts/backfill-grid-thumbs.js`
  and is null until that runs.

### Consumers / navigation
- **`app/(tabs)/profile.tsx`** — own profile. Renders `PostGrid` per tab; clears
  `store.currentPostId` on tab switch (~`:695`).
- **`app/user/[userId].tsx`** — someone else's profile. Reads `?viewedPost=` URL param (~`:62`),
  passes it as `highlightPostId` to `PostGrid` (~`:656`), and **nulls `store.currentPostId`** so it
  doesn't auto-scroll (~`:80-84`, comment "should NOT trigger auto-scroll").
- **`components/DreamCard.tsx`** — a feed card. Username tap AND swipe-into-profile both do
  `nav.push('/user/<uid>?viewedPost=<postId>')` (~`:357`, also `:355/:631`).
- **`app/photo/[id].tsx`** — the full-screen detail pager. On swipe between posts, updates
  `store.currentPostId` via `onIndexChange` (~`:267`). Clears album store only when
  `albumSource === null` (~`:71-76`).
- **`components/FullScreenFeed.tsx`** — the pager; prefetches the next few cards' `image_url_display`
  (~`:498-500`).

### The TWO highlight mechanisms (this is the crux)
1. **URL-param path** (what the spec §0 describes): `?viewedPost=` → `highlightPostId` **prop**.
   Drives the **tile badge** (`PostGrid.tsx` `renderItem`: `item.id === highlightPostId`, ~`:493`)
   and the **anchor button** (`showJustViewedButton`, ~`:392-399`). Does NOT auto-scroll.
2. **Store path** (drill into a tile *inside* an album → detail → back): `PostTile.handlePress`
   sets `store.currentPostId` (~`:106`); detail pager updates it. Drives a **silent auto-scroll**
   back to your place (`pendingAutoAnchor`, ~`:342-374`). Does NOT show a badge.

`effectiveHighlightId = storeCurrentPostId ?? highlightPostId` (~`:237`) is used for the SCROLL,
but the BADGE uses only the prop and the ANCHOR uses only the prop. That split is the root of the
inconsistency.

### Scroll math (no getItemLayout today)
`scrollToHighlightRow(idx)` (~`:288-313`): `targetRow = floor(idx/NUM_COLUMNS)`; `targetOffset =
headerHeight + targetRow*ROW_HEIGHT - (visibleArea-ROW_HEIGHT)/2`; `listRef.scrollToOffset({offset,
animated})`. There is **NO `getItemLayout`** (deliberate — see the comment at ~`:420`) and
`scrollToIndex` is never used.

### Image load (per tile)
`PostTile.tsx` ~`:146-161`: `<Image source={{uri: tileImageUrl(...)}} contentFit="cover"
transition={0} cachePolicy="memory-disk" recyclingKey={item.id} placeholder={thumbhash}/>`. **No
`priority`, no viewability gating.** `PostGrid` prefetches on `onViewableItemsChanged` at 30%
visibility (~`:269-286`) and sets `removeClippedSubviews={false}`, `windowSize={7}`,
`maxToRenderPerBatch={6}`, `initialNumToRender={12}` (~`:433-436`). expo-image is `~3.0.11`
(package.json). FlashList is **not** installed.

---

## 2. Root causes — "Just viewed" flakiness (ranked)

1. **Badge bound to the wrong id.** Tile badge uses the `highlightPostId` **prop** (`PostGrid.tsx`
   `renderItem`), while scroll uses `effectiveHighlightId = store ?? prop`. The store path therefore
   shows NO badge; the two ids can disagree. → sometimes shows, sometimes not, depending on entry.
2. **URL-param path never paginates to find the post.** Only the store path runs the "fetch pages
   until the post is loaded" loop (`PostGrid.tsx` ~`:358-364`). When you open a profile from a card
   and the origin post is **beyond page 1** (`PAGE_SIZE = 18`), `highlightIndex` stays `-1`, the
   tile never renders, and the badge can't show. The anchor's *tap* handler paginates (~`:404`), but
   nothing does so proactively — so the below-fold decision is made against incomplete data.
3. **Fold decision races layout.** `showJustViewedButton` needs `containerHeight > 0` and a
   `maxVisibleIndex` derived from measured `containerHeight`/`headerHeight` (~`:388-399`). Both are
   `0` until `onLayout` fires (~`:413`, `:449`), so on first mount it flickers / mis-decides above-
   vs-below fold for a frame.
4. **Flag soup, no atomicity.** `highlightDismissed` (blur listener ~`:252`, reset on store change
   ~`:344`), `badgeTapped` (~`:310`), `isFetchingHighlight` (~`:405/:317`) toggle from independent
   effects and land in contradictory combinations (badge visible while `dismissed`; anchor hidden
   while `highlightIndex ≥ 0`).
5. **Blur listener not re-scoped per id.** Registered once per `highlightPostId` change (~`:249-254`);
   rapid profile→profile navigation can fire a stale listener and leak/clear state into the wrong
   context.
6. **Far scroll clamps (under-shoots).** Without `getItemLayout`, FlatList's content height only
   covers *measured* rows. `scrollToOffset(bigOffset)` for a just-loaded-but-not-yet-laid-out far
   row **clamps short**, so the jump lands above the target — today masked by a fragile
   `requestAnimationFrame` (~`:373`).
7. **No cleanup on delete / reorder / cap.** Deleting the viewed post, a pull-refresh reorder (pins
   move to top), or a network stall leaves the highlight at a stale/missing index; the paginate loop
   has no page cap and can run unbounded.

---

## 3. Root causes — fast-scroll clunk

1. **Fly-by prefetch flood.** `onViewableItemsChanged` fires for **every** tile crossing 30%
   visibility *during the fling* and calls `ExpoImage.prefetch()` for each (~`:269-286`). A fast
   scroll queues a prefetch for every tile it passes — they enter expo-image's shared, roughly-FIFO
   load queue **ahead of** the tiles you stop on.
2. **No cancellation.** `removeClippedSubviews={false}` + `windowSize={7}` keep ~7 viewports of
   tiles mounted; each mounted `<Image>` starts its load and it is **never cancelled** when the tile
   leaves the viewport (the cell stays mounted; only `recyclingKey` changes). expo-image cancels on
   full unmount only.
3. **No priority tiering.** Nothing tells expo-image "the tile at rest is urgent, the fly-by ones
   are not." → the tiles you land on wait behind everything that scrolled past. Exactly the report.

**Crucial enabling fact:** `ROW_HEIGHT` is **exact and uniform** — tiles are always `TILE_WIDTH ×
5/4`, `contentFit:"cover"`, and the grid renders **no captions/variable height** (badges are
absolute overlays with `pointerEvents:"none"`). So a fixed-size virtualization + exact
`getItemLayout` is valid; the only reason it isn't used is the `numColumns` inflation trap (§5).

---

## 4. The plan — two tracks, three phases

### TRACK 1 — TikTok-style loading (load only what comes to rest). **Ship first.**
Independent of the "just viewed" logic, biggest felt win, no structural change, no new dependency.

**Mechanism:** a tiny shared **"load set"** of post ids allowed to fetch their image. Every other
tile shows only its thumbhash placeholder (instant, zero network).

- **1a. Viewability-gated source in `PostTile`.** Set `<Image source>` only when the tile's id is in
  the load set; otherwise `source={null}` (thumbhash placeholder still renders). A tile that only
  flashes past during a fling never starts a load. Track the load set in a small Zustand store (e.g.
  `store/gridVisibility.ts` with a `Set<string>`), or push a boolean prop from `PostGrid`
  (prop is simpler but must stay memo-safe — pass a primitive `shouldLoad` boolean, NOT an object,
  or PostTile's `React.memo` breaks — see the 2026-07-18 memo lesson already in this file's history).
- **1b. Compute the load set on SETTLE, not during the fling.** Update the set from
  `onViewableItemsChanged` **only when not actively flinging**, and always on `onMomentumScrollEnd`.
  Set = currently-viewable ids **+ a one-screen landing window** on each side. During a fast scroll
  the set doesn't churn → nothing loads until you stop → the moment you stop, the ~2 screens around
  you load together (small, fast). Detect "flinging" via scroll velocity in `handleScroll`
  (`onScroll`, `scrollEventThrottle={16}` is already set) or simply: don't add to the load set inside
  `onViewableItemsChanged`, only inside `onMomentumScrollEnd` + `onScrollEndDrag` (covers slow drags
  that don't fling).
- **1c. Priority + small thumbs.** Pass expo-image `priority="high"` on in-view tiles. Ensure
  `image_url_thumb` backfill is 100% (`node scripts/backfill-grid-thumbs.js`) so tiles fetch the
  ~35 KB thumb, not the ~150 KB display variant.
- **Keep `removeClippedSubviews={false}`** — the source-gating gives us the cancellation we want
  WITHOUT the unmount/remount flicker that flipping it to `true` would introduce.

**Result:** fast scroll shows a smooth field of thumbhash blurs → crisp thumbs the instant you rest.
An anchor-jump (Track 2) loads only the landing screen, never the rows it flew over.

**Risk:** a tile scrolled fully off then back reloads — cheap, `memory-disk` cache keeps it warm
after first load. Verify thumbhash is present on most posts (`uploads.thumbhash`); where absent the
fly-by tile is a flat color, still fine.

### TRACK 2 — "Just viewed" correctness + reliable jump

- **2a. One highlight, one source of truth.** Collapse `highlightPostId` prop + `store.currentPostId`
  into a single `effectiveHighlightId` and drive **badge, anchor, AND scroll all from it** (fix the
  tile badge to read `effectiveHighlightId`, not the prop). Badge then shows on **both** entry
  paths, per the spec.
- **2b. Proactive locate.** On any highlight id (URL-param included), run ONE "paginate until the
  post is in the loaded set" loop with a **hard page cap** (e.g. ≤ 6 pages) and **clear-the-highlight
  on not-found**. Makes the below-fold decision + the badge reliable no matter how deep the post is.
  (Today only the store path paginates; unify it.)
- **2c. Deterministic jump via row-restructured `getItemLayout`.** See §5 — restructure the FlatList
  data into **rows** so `getItemLayout` is exact and quirk-free, then use
  `scrollToIndex({ index: rowIndex, viewPosition: 0.5 })` + an `onScrollToIndexFailed` fallback. The
  far jump lands exactly, even for a just-loaded row, with no `requestAnimationFrame` guesswork
  (fixes root cause §2.6).
- **2d. Gate fold decision on measured layout.** Don't compute below-fold until `containerHeight > 0`;
  render nothing (not a wrong guess) until then.
- **2e. Replace flag soup with an explicit status.** `idle → locating → ready(onScreen | belowFold)
  → dismissed`. Badge shows in `ready`; anchor shows in `ready:belowFold`; one transition owns each
  change. Re-scope the blur listener per id; clear the highlight on tab switch (already done in
  profile.tsx), on post delete, and on a refresh that reorders.
- **2f. Add a dev-only trace** of the status transitions (`if (__DEV__) console.log(...)`) so a
  future "it didn't show" report is diagnosable in one read.

---

## 5. THE `getItemLayout` TRAP (read before doing §2c)

`PostGrid.tsx` ~`:420` has a comment explaining why `getItemLayout` was removed:

> No getItemLayout: with numColumns the only way to express "items in the same row share an offset"
> is per-item length = ROW_HEIGHT with shared offsets, which makes FlatList compute sum-of-lengths
> total content height as N_items × ROW_HEIGHT (3× actual at numColumns=3). That inflated total
> breaks virtualization windowing — in-viewport tiles get spuriously evicted and remounted during
> slow drags.

This is a **real** RN quirk **specific to `getItemLayout` + `numColumns`** (per-item lengths get
summed → 3× content height → windowing math breaks). **The fix is to stop using `numColumns` and
render ROWS instead:**

- Chunk `posts` into `rows: DreamPostItem[][]` of `NUM_COLUMNS` each (memoized).
- FlatList `data={rows}`, each `renderItem` renders one `<View style={row}>` containing up to
  `NUM_COLUMNS` `<PostTile>`s (drop `numColumns` + `columnWrapperStyle`).
- Now `getItemLayout = (_, index) => ({ length: ROW_HEIGHT, offset: index*ROW_HEIGHT, index })` is
  **exact** (each item IS a row) — no inflation, correct content height, correct windowing.
- `scrollToIndex({ index: rowIndex, viewPosition: 0.5, animated })` is now reliable to ANY row,
  including a just-loaded far row (offset is known without measuring intervening rows). Keep an
  `onScrollToIndexFailed` fallback that does the old `scrollToOffset` estimate.
- **Watch-outs when restructuring:** keep the flat `selection` primitives + `selectionOrder`
  working (map still keyed by post id); keep `keyExtractor` stable per row (e.g. first tile's id);
  `initialNumToRender` / `maxToRenderPerBatch` / `windowSize` now count ROWS (roughly divide by
  `NUM_COLUMNS`); ensure the header (`ListHeaderComponent`) still measures `headerHeight`; the
  `onViewableItemsChanged` `viewableItems` are now rows, so the load-set logic (Track 1) must expand
  each viewable row to its tile ids.

---

## 6. Considered & explicitly deferred
- **`@shopify/flash-list`** — NOT installed. FlashList v2 is Fabric-only and DreamBot IS on RN 0.81
  New Arch, so it's viable. It would give view **recycling** (free image-load cancellation on
  recycle) + reliable `scrollToIndex` in one move. Deferred because it's a native dependency + a
  rebuild + re-validating every accumulated grid fix (refresh gap, selection memo, prefetch,
  RefreshControl-Fabric workaround). The Track-1/2 plan reaches the same outcome with no native
  change. **Revisit FlashList only if the grid still janks after Track 1.**
- **Server-side post-position RPC** (return a post's exact grid index so you can jump without
  paginating) — correct only at thousands-of-posts-per-user scale. Not needed now; the paginate-then-
  `scrollToIndex` path is fine for current album sizes.
- **`removeClippedSubviews={true}`** — would cancel off-screen loads via unmount, but reintroduces
  remount flicker on slow nets and fights the prefetch lifecycle. The source-gating (Track 1) is
  better. Leave it `false`.

---

## 7. Suggested phasing & touched files
- **Phase 1 — perf loading (ship first, highest user-visible win, low risk):**
  `components/PostTile.tsx` (gated source + `priority`), `components/PostGrid.tsx` (load-set +
  settle-gated computation), maybe `store/gridVisibility.ts` (new). Confirm
  `scripts/backfill-grid-thumbs.js` has run for all rows.
- **Phase 2 — reliable jump:** row-restructure `components/PostGrid.tsx` + `getItemLayout` +
  `scrollToIndex`/`onScrollToIndexFailed` (§5).
- **Phase 3 — state machine:** unify the highlight, proactive locate + cap, layout-gated fold,
  status enum, cleanups. Touches `components/PostGrid.tsx`, `components/PostTile.tsx` (badge id),
  `store/album.ts`, `app/user/[userId].tsx`, `app/photo/[id].tsx`, `app/(tabs)/profile.tsx`.

Phases 1 and 2/3 are independent — Phase 1 can ship alone. Phase 2 (`getItemLayout`) underpins the
Phase 3 reliable anchor jump, so do 2 before/with 3.

---

## 8. Validation checklist
**Perf:** fast-fling a long album on a device — thumbhash field during the fling, crisp thumbs on
rest, NO "load everything first" stall. Anchor-jump to a far post loads only the landing screen.
Scroll back up: warm/instant.
**Correctness:** from a feed card, BOTH username-tap and swipe-into-profile → badge over the origin
tile every time; below the fold → anchor appears and jumps precisely to it. Exercise: origin post
beyond page 1; origin post deleted while in detail; pull-refresh reorder (pinned post moves);
rapid profile→profile→profile; tab switch on own profile; iPad (`NUM_COLUMNS=5`). The dev trace
(§2f) should explain every "didn't show".
**Regression:** multi-select mode still scrolls smoothly (the memo primitive props); pull-to-refresh
gap + spinner still correct (Fabric RefreshControl workaround); detail→back auto-anchor (store path)
still lands on your row.

---

## 9. Related history / memory (context that bit us before)
- Grid tiles must serve the STATIC `image_url_display` / `image_url_thumb` variant, **never**
  Supabase `/render/image` transforms — the transform quota incident restricted the whole project
  (`memory/project_image_transform_quota`).
- Supabase CDN caches image GETs fine (a prior "no-cache" finding was a `curl -I` HEAD artifact) —
  don't chase CDN caching as the cause (`memory/project_supabase_cdn_no_cache_ticket`).
- Seed-keyed feed caches + optimistic sweeps caused universal button lag once — be careful adding
  per-tile store subscriptions that patch on every scroll (`memory/project_feed_cache_seed_bloat_lesson`).
- PostTile `React.memo` is defeated by passing per-tile OBJECT props — pass PRIMITIVES only
  (2026-07-18 lesson, already noted in `PostTile.tsx` selection props).
- Fabric RefreshControl is unreliable — the grid renders its own spinner in a self-held gap
  (`useRefreshGap`); don't "simplify" that away.
- The album-store `ids` reset in `PostTile.handlePress` (`store.setAlbum([])`) fixes the
  "Search/Browse opens the wrong post" bug — don't remove it.
