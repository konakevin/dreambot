# PostGrid → FlashList v2 Migration Plan

**Status:** Plan for review (2026-07-24). NOT started. Goal: replace the FlatList in
`components/PostGrid.tsx` with **`@shopify/flash-list` v2** to fix the album fast-scroll clunk
("render the whole path to reach the far rows / pause-at-boundary / loads the world on the way down").
FlatList mounts a growing window of cells and (without exact geometry) renders incrementally;
**FlashList recycles cells** (RecyclerView-style) and renders only what's near the viewport — the
correct tool for a TikTok/IG-style image grid. Self-contained so a build session can start cold.

> ⚠️ **Test in a RELEASE build on a real device.** FlashList's own docs: "test performance in
> release mode, as JS dev mode can skew results." The prior jank was measured on the **iOS Simulator
> in a dev build** — the worst case for any list. Confirm the problem still exists release+device
> before/after; the win will be far larger there than in the Simulator.

---

## 0. Prerequisite — satisfied
FlashList v2 **throws at runtime on the old architecture** (hard requirement). DreamBot has
`app.config.js → newArchEnabled: true` (+ Reanimated 4, which is New-Arch-only), so v2 is supported.
Install: `npx expo install @shopify/flash-list` (pulls the SDK-54-compatible version). It ships
**native code** → a **native rebuild** is required (`dreambot` rebuild / `cd ios && pod install`),
NOT a Metro reload.

---

## 1. What PostGrid does today (everything that must survive)

`components/PostGrid.tsx` is a heavily-tuned FlatList. The migration must preserve ALL of:
1. **Data is a `GridItem` union** — `PendingSlot` ("cooking" dream tiles) woven at the TOP + finished
   `DreamPostItem`s. `gridData = [...pendingSlots, ...visiblePosts]`, `suppressedUploadIds`,
   `finishedRings` completion beat. (Dream-tracking feature — recent, Kevin cares.)
2. **Two cell types** — `PendingDreamTile` (a ring, no image) vs `PostTile` (the image). Both are
   exactly `TILE_WIDTH × TILE_HEIGHT` (uniform).
3. **`numColumns`** = 3 phone / 5 iPad (`NUM_COLUMNS`), 1px `TILE_GAP` via
   `columnWrapperStyle={{ gap, marginBottom }}`.
4. **Multi-select** — flat primitive props to keep `PostTile`'s `React.memo`; `extraData` = selection
   set + `dreamsViewBaseline` (New markers).
5. **Pull-to-refresh** — custom: `refreshing` pinned FALSE (Fabric RefreshControl unreliable,
   react-native#56343), a **self-held gap** (`Animated.View` height in `ListHeaderComponent` via
   `useRefreshGap`) + our own absolute spinner; the RefreshControl exists only for the pull GESTURE.
   `handleRefresh` trims the query to page 1 then invalidates.
6. **"Just viewed" highlight + auto-anchor scroll** — `scrollToOffset(headerHeight + row*ROW_HEIGHT −
   center)` offset math (`scrollToHighlightRow`), offset by `pendingCount`; paginate-until-found;
   the "Just viewed" anchor button.
7. **`ListHeaderComponent`** measured via `onLayout` → `headerHeight` (used by the scroll math + the
   sticky-topbar reveal in profile/user screens via `onScrollProgress`).
8. **Viewability prefetch** — `onViewableItemsChanged` (30% threshold) prefetches the display variant
   for tap-into-detail.
9. **`onEndReached`** infinite pagination (PAGE_SIZE 18) across 6 query sources
   (own/saved/dreams/reposts/user/hashtag).
10. **`scrollToTopToken`** — imperative scroll-to-top (tab re-tap).
11. **Consumers (3):** `app/(tabs)/profile.tsx` (selection, tabs, pendingDreams, scrollToTopToken,
    onScrollProgress, onRefreshExtra), `app/user/[userId].tsx` (highlightPostId, scrollToTopToken,
    onScrollProgress), `app/hashtag/[tag].tsx` (bare).

---

## 2. Prop-by-prop mapping (FlatList → FlashList v2)

| FlatList today | FlashList v2 | Notes / action |
|---|---|---|
| `<FlatList<GridItem>>` | `<FlashList<GridItem>>` | Import from `@shopify/flash-list`. |
| `ref` (`FlatList`) | `useRef<FlashListRef<GridItem>>` | `scrollToOffset` + `scrollToIndex` both exist. Update the type. |
| `data`, `renderItem`, `keyExtractor` | same | Keep `keyExtractor` (`pending-<id>` / `id`) — **v2 strongly recommends a valid keyExtractor**. |
| `numColumns` | `numColumns` | Supported. |
| `columnWrapperStyle={{ gap, marginBottom }}` | **NOT supported** | Move the 1px gap to per-cell styling (see §3c). |
| `getItemLayout` | **remove** | FlashList auto-sizes + recycles; no manual geometry. |
| `windowSize` / `maxToRenderPerBatch` / `initialNumToRender` / `removeClippedSubviews` | **remove** | FlatList-only knobs; recycling replaces them. |
| `extraData` | `extraData` | Supported; **memoize** (v2 is stricter). Keep `gridExtraData`. |
| `ListHeaderComponent` (+ onLayout) | same | Supported; onLayout on the wrapped header still measures `headerHeight`. |
| `ListEmptyComponent` / `ListFooterComponent` | same | Supported. |
| `onScroll` + `scrollEventThrottle` | same | Keep (drives `onScrollProgress`). |
| `onEndReached` + `onEndReachedThreshold` | same | Keep pagination. |
| `onViewableItemsChanged` + `viewabilityConfig` | same | Supported. **Must be stable identity** (keep the `useRef` fn). |
| `refreshControl={<RefreshControl refreshing={false} …/>}` | verify (see §3e) | v2 documents `onRefresh`/`refreshing`; confirm it also accepts a custom `refreshControl` element. Fallback in §3e. |
| `contentContainerStyle={{ paddingBottom }}` | `contentContainerStyle` | v2 `ContentStyle` allows **padding only** (no margin) — `paddingBottom` is fine. |
| `directionalLockEnabled` | passes through to the inner ScrollView | Keep. |
| (new) | **`getItemType`** | Return `'pending'` vs `'post'` so FlashList recycles the two cell types separately (heterogeneous-view perf). |
| (new, default ON) | **`maintainVisibleContentPosition`** | On by default in v2 — big interaction, see §3f. |

---

## 3. The tricky bits — dotted i by i

### 3a. Recycling + local cell state (the #1 gotcha)
FlashList **recycles** a cell component across different items. Any `useState` inside a cell must
reset when the cell is reused, or it leaks state to the next item.
- **`PostTile`** holds `useState(actionsOpen)` (long-press sheet) + the EditDescription modal open
  state. On recycle these must reset. Fix: swap to **`useRecyclingState(false, [item.id], …)`** (from
  `@shopify/flash-list`) so the sheet/modal auto-close when the cell rebinds to a new post. (In
  practice the sheet is a full-screen Modal opened while stationary, but recycling correctness still
  demands this.)
- **`PendingDreamTile`** runs a ring animation keyed on the dream — verify its animated values reset
  on recycle (use `useRecyclingState`/`useLayoutState` or key it so a rebind restarts cleanly). Since
  pending tiles are few and short-lived, low risk, but check.
- **`useMappingHelper`** is only needed if a cell does `.map()` with keys — PostTile/PendingDreamTile
  don't, so N/A. Also **remove any explicit `key=` inside the renderItem hierarchy** (none today).

### 3b. Heterogeneous cells → `getItemType`
```ts
getItemType={(item) => (isPending(item) ? 'pending' : 'post')}
```
Lets FlashList keep separate recycle pools for the ring tiles vs image tiles (no cross-type reuse
glitches, better perf).

### 3c. Column spacing (no `columnWrapperStyle`)
Today: `TILE_WIDTH = (SCREEN_WIDTH − TILE_GAP*(cols−1)) / cols` and a `columnWrapperStyle` gap of 1px.
FlashList has no `columnWrapperStyle`. Options (pick in build):
- Keep `TILE_WIDTH` as-is and add the 1px gap as **cell padding** — but padding shrinks the image, so
  wrap: render each cell as `<View style={{ paddingRight: gap, paddingBottom: gap }}>` with the tile
  at full `TILE_WIDTH` inside, and recompute `TILE_WIDTH` to include the gap. OR
- Simplest: since `TILE_GAP` is **1px**, consider dropping the inter-tile gap entirely (edge-to-edge,
  IG-style) — visually near-identical and removes the whole spacing problem. Confirm with Kevin.
Get the math exactly right so 3 tiles + gaps == screen width (no wrap/overflow).

### 3d. The "Just viewed" highlight scroll → `scrollToIndex` (a WIN)
Replace the fragile `scrollToOffset(ROW_HEIGHT math)` with FlashList's reliable
**`scrollToIndex({ index, viewPosition: 0.5, animated })`** — `viewPosition: 0.5` centers the row, and
FlashList's `firstItemOffset` already accounts for the header, so we can drop the manual
`headerHeight`/`ROW_HEIGHT` arithmetic. Index mapping: the highlight lives in `posts` (`highlightIndex`)
but the list renders `gridData` (pending first), so the FlashList index is
**`highlightIndex + pendingCount`** (same offset the code already computes). Keep the
paginate-until-found loop (the post must be in `data`); once present, `scrollToIndex` lands exactly —
no `getItemLayout`/`requestAnimationFrame` timing dance. Add `viewOffset` only if a residual header
nudge is needed. (This also directly delivers Phase 2 of `FIX_JUST_VIEWED_AND_ALBUM_SCROLLING.md`.)

### 3e. Pull-to-refresh (Fabric-unreliable spinner + self-held gap)
Confirm whether v2 accepts a custom `refreshControl` element (like FlatList) or only
`onRefresh`+`refreshing`. Either path preserves our approach:
- If custom `refreshControl` is accepted → pass `<RefreshControl refreshing={false} onRefresh={handleRefresh}/>`
  exactly as today; keep the self-held `Animated.View` gap in `ListHeaderComponent` + our own spinner.
- If only `onRefresh`/`refreshing` → set `onRefresh={handleRefresh} refreshing={false}` and keep the
  self-held gap + our spinner (the gap lives in the header, which FlashList renders normally). Re-test
  whether FlashList's RefreshControl is more reliable on Fabric than FlatList's was — if so we may be
  able to simplify `useRefreshGap` away later (not in scope for the migration).

### 3f. `maintainVisibleContentPosition` (ON by default) — biggest behavioral change
v2 enables mVCP by default: when items are inserted/removed **above** the viewport, your scroll
position stays anchored instead of jumping. Interactions to verify/handle:
- **Pending tiles woven at TOP (Dreams tab):** when a new dream starts cooking, a tile inserts at
  index 0. With mVCP **on**, a user scrolled down won't get yanked — arguably BETTER than today. But
  it may fight the "cooking tile should be visible" intent when at/near the top. Verify both.
- **Pull-to-refresh page-1 trim + reorder:** confirm mVCP doesn't freeze the view oddly after a
  refresh replaces the data.
- **`scrollToTopToken` + highlight `scrollToIndex`:** ensure explicit scrolls still win over mVCP.
- If any of these misbehave, mVCP is **configurable** (pass a config object / disable). Decision: keep
  default ON first, test the four cases, tune only if needed.

### 3g. Header measurement + sticky top bar
`onScrollProgress(contentOffset.y)` (profile/user sticky-topbar reveal) works via `onScroll` — keep.
`headerHeight` via the header's `onLayout` still works (FlashList renders `ListHeaderComponent`
normally). It's still needed for the profile sticky-bar threshold even after `scrollToIndex` removes
its use in the scroll math.

### 3h. Viewability prefetch
Keep `onViewableItemsChanged` (stable ref) + `viewabilityConfig` (30%) → prefetch display variant.
(Do NOT reintroduce the load-gating that broke image loading; FlashList's recycling already avoids
loading a huge mounted window — that was the real goal.)

### 3i. `extraData` + memoization
v2 re-renders are more sensitive to prop identity. Keep `gridExtraData` memoized (selection set +
baseline). Ensure `renderItem` and all cell props stay reference-stable (they already are — the
flat-primitive selection props + memoized `allPosts`).

---

## 4. Consumers — near-zero change
Props are unchanged (`source`, `highlightPostId`, `scrollToTopToken`, `onScrollProgress`,
`onRefreshExtra`, `selection`, `extraBottomInset`, `pendingDreams`). Only PostGrid-internal changes.
The one thing to check: any caller reading the ref type (none pass a ref in — PostGrid owns `listRef`).

## 5. Risks & rollback
- **Isolated blast radius:** the change lives in `components/PostGrid.tsx` (+ `useRecyclingState` in
  `PostTile`/`PendingDreamTile`). Rollback = revert those files + `npx expo install` removal.
- **Native rebuild needed to test** — Kevin rebuilds locally; budget for that.
- **Recycling state bugs** (§3a) are the main risk — the sheet/modal showing for the wrong tile. The
  `useRecyclingState` fix + a focused test kills it.
- **mVCP surprises** (§3f) — enumerated; tune if needed.
- **Spacing math** (§3c) — get the 3-up width exact.

## 6. Validation checklist (release build, real device)
- Fast-fling a long album (e.g. a bot profile like OceanBot): **smooth, no pause-at-boundary**; tiles
  you rest on load promptly; scrolling back is instant.
- Dreams tab: a **cooking pending tile** appears at top, ring animates, finishes, and the real image
  takes its cell (no double-image / no stuck ring) — recycling-safe.
- **Multi-select**: long-press enters, tiles toggle, numbered badges correct, scroll smooth in select
  mode, bulk delete/make-private work.
- **Pull-to-refresh**: gap + spinner render, data refreshes, no stuck-pulled state, scroll position
  sane afterward.
- **"Just viewed"**: from a feed card → profile, badge shows; below-fold → anchor jumps precisely
  (`scrollToIndex` centered); detail→back auto-anchor lands on your row (store path).
- **Sticky top bar** on profile/user reveals on scroll (onScrollProgress).
- **Pagination**: scroll deep, next pages load, no dupes.
- **iPad** (`NUM_COLUMNS=5`) grid + spacing correct.
- All 6 sources: own / saved / dreams (all/posted/private) / reposts / user / hashtag.
- Long-press sheet + EditDescription open on the CORRECT tile after heavy recycling.

## 7. Build steps
1. `npx expo install @shopify/flash-list`; prebuild/rebuild native (`cd ios && pod install`).
2. Migrate `components/PostGrid.tsx` (§2–3), add `getItemType`, swap the ref type, `scrollToIndex`.
3. `useRecyclingState` in `PostTile` (+ `PendingDreamTile` if needed).
4. Resolve column spacing (§3c) — confirm gap-vs-edge-to-edge with Kevin.
5. `npm run check`; rebuild; run the §6 checklist on device (release).

## 8. Open decisions for Kevin
1. **Column gap:** keep the 1px inter-tile gap (needs the per-cell wrapper), or go **edge-to-edge**
   (simpler, IG-style)?
2. **Confirm the jank on a release device build** first (Simulator+dev overstates it) — still want the
   migration regardless (right tool for scale), or gate on that check?
3. OK to fold in the **`scrollToIndex` "just viewed" jump** (Phase 2 of the other plan) as part of
   this, since FlashList makes it reliable — or keep this migration purely perf and do that after?
