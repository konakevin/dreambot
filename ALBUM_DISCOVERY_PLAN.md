# Album navigation & discovery plan

Status: **SHIPPED in 1.9.0 (build 61), live on the App Store 2026-09-27** with a hard update gate at 1.9.0, so
every user has it. Decisions are Kevin's, from the 2026-09-26 brainstorm. Server pieces (migrations 557-562 +
558a, 561a) went live before the build; the app pieces are commit 0a522252.
Concept renders: the "DreamBot Browsing Concepts" artifact (interactive phone mockups of every piece below).

## The problem, measured (2026-09-26)

- Albums are big. StarBot has 3,633 public posts, GothBot 2,919, DragonBot 2,371, all going back to March.
  Kevin's own Dreams album has 10,579 dreams.
- Every grid loads 18 at a time (`useMyDreams`, `usePublicProfilePosts`, both `PAGE_SIZE = 18`). Reaching
  StarBot's March posts is ~200 loads in a row, and leaving the album loses your place.
- Most bot work is never seen again after its first day.

## Scope (decided)

| #   | Feature                                                                      | Where                                                                     | Decision                                                                                    |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | **Sort: Newest ↓ / Oldest ↑**                                                | your Dreams album (All/Public/Private), your Posts, bot + member profiles | YES (Kevin asked twice, incl. private albums)                                               |
| 2   | ~~Timeline scrubber~~                                                        |                                                                           | built, then REMOVED (Kevin: the calendar months view is enough)                             |
| 3   | **Months view** (pinch out → one tile per month, tap to jump)                | same grids                                                                | YES                                                                                         |
| 4   | **"12 new" badges** on the Bots tab bot pills + a "You're caught up" line    | Bots tab, bot profiles                                                    | YES                                                                                         |
| 5   | **Haven't seen** filter                                                      | bot profiles                                                              | YES                                                                                         |
| 6   | ~~Explorer progress~~                                                        |                                                                           | built, then REMOVED (Kevin: the progress bar is overwhelming)                               |
| 7   | ~~🎲 Shuffle~~ (random 12 from the whole history)                            |                                                                           | built, then REMOVED 2026-09-27 (Kevin)                                                      |
| 8   | **Search**: your own dreams (incl. private), bots, and members' public posts | Search tab                                                                | YES                                                                                         |
| –   | Remember my place in an album                                                |                                                                           | skipped for now                                                                             |
| –   | Hall of Fame / Deep Cuts                                                     |                                                                           | skipped                                                                                     |
| –   | Time machine / "On this day"                                                 |                                                                           | skipped                                                                                     |
| –   | Theme collections per bot                                                    |                                                                           | skipped (posts don't record their path: only 74 of 3,633 StarBot posts match `bot_run_log`) |

**Hard constraint (Kevin 2026-09-26): search must NEVER match people's physical characteristics.**

## What exists today (verified 2026-09-26)

- **Grids**: `components/PostGrid.tsx` is shared by `app/(tabs)/profile.tsx`, `app/user/[userId].tsx`, and
  `app/hashtag/[tag].tsx`. Own Dreams = `useMyDreams(filter)` (created_at DESC, offset pages of 18);
  profiles = `usePublicProfilePosts` (pinned_at DESC, posted_at DESC).
- **Indexes**: `uploads (user_id, created_at DESC)` (+ an `is_active` partial) and
  `uploads (user_id, posted_at DESC) WHERE is_public`. A btree reads both directions, so Oldest-first and
  "jump to a date" (keyset `created_at < X`) are index scans with no new index.
- **Seen tracking**: `post_impressions (user_id, upload_id, view_count, first_seen, last_seen)`, 52k rows
  since 2026-04-11, **never pruned**. Written by `record_impression` from `components/FullScreenFeed.tsx`
  (dwell timer), which powers the Home feed, the Bots tab pager (`BotsHorizontalPager`) and the full-screen
  post view (`app/photo/[id].tsx`). So "seen" = looked at full size; grid thumbnails don't count.
- **Random draw**: `get_header_suggestions(p_source 'bot', p_bot_id, p_limit, p_exclude)` already returns a
  random set of one bot's public posts (plpgsql, force_custom_plan, migration 554a). Client helper
  `fetchHeaderDraw(source, exclude, limit)` (limit param added for the profile-picture picker).
- **Search**: Search tab = `app/(tabs)/top.tsx`. People = `useSearchUsers` (username ILIKE). Posts =
  `useSearchPosts`: full-text on `uploads.search_tsv` (migration 103: `ai_prompt + caption + dream_medium +
dream_vibe`, english, GIN, BEFORE trigger), **public posts only**, users and bots mixed, newest first.
- **⚠ Live privacy problem**: 488 of 934 public member posts (52%) have person descriptors in `ai_prompt`
  (age, skin tone, beard, freckles…), so today's search can surface someone's face-swapped dreams by their
  looks. `caption` is NOT safe either: for 14,046 of 14,741 member uploads it holds engine text (look
  fragments, lab labels), not something the member wrote. Only `description` (126 rows, member-written),
  `dream_medium` and `dream_vibe` are person-free today.
- **Bots tab**: `BotPillRow` (horizontal bot pills) over `BotsHorizontalPager` (one FullScreenFeed per bot).

## Design

### Phase 0 — privacy fix (server only, live for every app version)

- Replace the `uploads_search_tsv_trigger` body: for **bot** authors keep `ai_prompt + caption + medium +
vibe`; for **member** authors index only `description + dream_medium + dream_vibe` (+ `scene_summary` once
  phase 1 lands). Decide bot-ness via `users.is_bot` inside the trigger.
- Recompute `search_tsv` for the 14,741 member rows in throttled batches (pool headroom gate, ≤3 concurrent,
  avoid :00 and ~08:00 UTC) — `UPDATE ... SET search_tsv = ...` per batch of ~500.
- Effect: members' public posts become searchable only by medium/vibe/description until summaries exist.
  Bots unchanged.

### Phase 1 — quick wins

**Sort (1).** A `↓ Newest / ↑ Oldest` button beside the filter pill. `useMyDreams(filter, sort)` and
`usePublicProfilePosts(userId, sort)` gain an ascending mode (query key includes sort). Oldest-first ignores
pins (pins are a newest-first concept). Default Newest; not persisted across launches.

**Shuffle on bot profiles (7).** A 🎲 segment in the bot profile's new filter pill (`All · Haven't seen · 🎲`,
same pattern as the profile-picture picker). Draw = `fetchHeaderDraw({kind:'bot', botId}, onScreen, 12)`,
tap again = redraw excluding the set on screen. No server change.

**Search (8).**

- New column `uploads.scene_summary text`: one short, person-free sentence per MEMBER dream ("a moonlit
  castle courtyard, lanterns, oil painting"). Written by Haiku at render time going forward, with an explicit
  instruction to describe place / action / objects / style and never anyone's appearance (people only as
  "a person" / "two people"). Backfill the existing 14,741 member dreams once (batched, throttled).
  Estimated ~$0.001 per dream → ~$15 backfill, ~0.1¢ per new dream. Bots don't need it.
- Add a guard test that the member branch of the search text never includes `ai_prompt` or `caption`.
- New RPC `search_dreams(p_query text, p_scope text, p_cursor ..., p_limit int)` (plpgsql +
  `SET plan_cache_mode = force_custom_plan` + `#variable_conflict use_column`, per the hard rules), scopes:
  `mine` (auth.uid()'s dreams, private included, matched on the member-safe text), `bots` (bot authors, full
  prompt), `people` (members' public posts, member-safe text), `all` (bots ∪ people ∪ mine). Rank by
  `ts_rank` then recency. Keep the last-token prefix match (`word:*`) the current hook uses.
- Search tab UI: scope chips `All · My dreams · Bots · People` under the search bar; username results stay.
- Keyword matching (as today), not meaning-based; see open question 4.

### Phase 2 — bot tracking (4, 5, 6)

- New table `bot_visits (user_id, bot_id, last_visited_at)` PK (user_id, bot_id), own-row RLS. **Only one FK
  to users** (user_id); store `bot_id` without a second FK, or hint every embed (hard rule: a second FK
  between two tables breaks un-hinted PostgREST embeds).
- RPC `mark_bot_visited(p_bot_id)` — called when a bot's page in the Bots tab or its profile is LEFT (so the
  caught-up line stays put during the visit).
- RPC `get_bot_new_counts()` → per public bot: public posts with `posted_at > last_visited_at` and NOT in the
  caller's `post_impressions`. Baseline: every (user, bot) starts at the ship date (a first call seeds rows
  with `now()`), so nobody sees "3,600 new". Display caps at "99+".
- RPC `get_bot_unseen_posts(p_bot_id, p_cursor, p_limit)` for Haven't seen (NOT EXISTS against
  `post_impressions`; there is a unique (user_id, upload_id) to probe — verify the index before building).
- ~~RPC `get_bot_explorer(p_bot_id)` → `{seen, total}` for the progress card~~ (removed with the card; see
  `get_bot_visit` below).
- UI: count badges on `BotPillRow`; on the bot profile, the filter pill,
  NEW marks + a "You're caught up" divider in the newest-first grid.

### Phase 3 — time travel (2, 3)

- RPC `get_album_months(p_user_id, p_scope)` → `month, count, cover_url`. Own albums (`p_user_id =
auth.uid()`) may include private; everyone else public-only, not shadow, not quarantined. SECURITY DEFINER
  with that caller check, plpgsql per the hard rules.
- Grid paging moves from offset to **keyset** (cursor = date + id) so a jump can start mid-album: load older
  pages below and newer pages above (prepend with `maintainVisibleContentPosition`). Month header rows mark
  each month's start.
- Scrubber: right-edge handle shown while scrolling; dragging shows month ticks + a bubble ("July 2026 ·
  1,902 dreams"); release jumps. Months view: pinch out (or a Grid/Months toggle) → 2-column month tiles;
  tap jumps into the grid at that month.
- Riskiest piece (bidirectional FlatList + pinned posts on profiles) — build behind a flag and test on the
  largest albums (Kevin's 10.6k, StarBot 3.6k).

## Order of work

0. Privacy fix (server only) — first, it's live today.
1. Sort everywhere · Shuffle on bot profiles · search scopes + scene summaries (+ backfill).
2. Bot tracking: NEW badges + caught-up line, Haven't seen. (Explorer: built, removed.)
3. Months RPC → scrubber → months view.

Server pieces (migrations, RPCs, backfills) can land ahead of each app build; UI ships in app builds.

## Decisions (Kevin, 2026-09-26) and what was built

1. **Scene summaries: scrapped for now.** Members' dreams are searchable only by what's person-free: their own
   written description, the medium and the vibe. "My dreams" search is therefore thin until summaries return.
   **The search scope chips were removed 2026-09-27** (Kevin: "beach" found one of his dreams under My dreams,
   "feels broken"; then "remove all those sub filter buttons and just force search to search ALL"). Search always
   runs the `all` scope, which includes your own dreams; `search_dreams` keeps `p_scope` for 1.9.0 clients.
2. **Privacy fix: done.** Migration 557 (members' search text never includes the engine prompt or caption; the
   trigger also fires on `is_public`, so going public always rewrites it). The 950 public member posts were
   recomputed at once. The private rows were NOT all rewritten: the throttled backfill caused an incident (below),
   and it isn't needed because `search_dreams` computes members' text from the row (`member_search_tsv`), never
   from stored text. Guard: `__tests__/lib/searchNeverMatchesPeopleGuard.test.ts`.
3. **Keyword search now,** meaning-based later.
4. Profile-picture work committed first (9c97559a).

**Incident, 2026-09-26 03:03-03:35 UTC:** the private backfill rewrote ~50 of Kevin's rows per batch; every row
fired a realtime event and `app/_layout.tsx` refetches all the owner's grids per event (~28k requests), so the
Home feed came up empty. Stopped; recovered within seconds. Memory `feedback_bulk_uploads_update_realtime_storm`.
Follow-up still open: make that realtime handler coalesce bursts (one refetch per 1-2 s).

**Server (live):**

- 557 search text never matches people · 558 `search_dreams` (SECURITY DEFINER with the uploads SELECT policies
  applied by hand: own rows, public posts of public accounts, of private accounts you follow, nothing blocked
  either way; verified 0 → 1 → 0) + `get_random_posts` (INVOKER) · 558a expression GIN index on
  `member_search_tsv` (public rows, built CONCURRENTLY, applied --no-record) · 559 `bot_visits` +
  `get_bot_new_counts` / `mark_bot_visited` / `get_bot_visit` / `get_bot_unseen_posts` (definer, public bots
  only; `get_bot_visit` replaced `get_bot_explorer` when the Explorer card was removed: 5 ms vs 35 ms) · 560 `get_album_months` (INVOKER).
- Search timings as a real member: bots 17 ms, people 2 ms, mine ~125 ms, All ~0.4 s (was 16 s before the rewrite).

**App:**

- `lib/albumNav.ts` (months, month offsets incl. floating pins, month-header / caught-up rows; tested),
  `lib/albumPaging.ts` (offset paging with a start + previous pages), `hooks/useAlbumDiscovery.ts`.
- `useMyDreams` / `useUserPosts` / `usePublicProfilePosts` take `{ sort, start }` (defaults = old behaviour).
- `PostGrid` opt-in `albumControls`: one fixed-height controls row (caller's pill, Newest/Oldest, calendar button),
  a continuous grid (no month headers), and the months view (calendar button or pinch). **A month tile opens THAT
  month as its own album** (hooks' `month` option: a UTC range matching the tile's bucket; counts verified equal),
  with the "‹ August 2026 · 77 posts" breadcrumb (or pinch in) back to the tiles.
- **Removed on Kevin's call (2026-09-27):** the bot profile's NEW marks and "You're caught up" line ("it's
  really confusing what that's even showing … just show their album grid"). Bot profiles show the plain grid.
  Kept: the All · Haven't seen pill, the Bots-tab new-count badges, and `mark_bot_visited` on leave (it
  resets those badges). `get_bot_visit` (mig 559) is no longer called by the app.
- **Removed on Kevin's call (2026-09-27):** the 🎲 shuffle segment (and `useRandomProfilePosts`, the `user`
  source's `shuffle` mode and `draw`). `get_random_posts` (mig 558) stays in the DB because 1.9.0 calls it; drop
  it once the min-version gate is past the first build without the dice. Same day: the tappable "Just viewed"
  jump pill (the tile's "Just viewed" overlay stays).
- **Removed on Kevin's call (2026-09-26):** the Explorer progress card (seen views are still recorded and still
  drive Haven't seen, NEW marks, the caught-up line and the Bots-tab badges), the timeline scrubber (right-edge drag), month headers in the main grid,
  and the jump-to-month / load-newer-above paging they needed. "The calendar picker screen is sufficient and easier." and `botDiscovery` (NEW marks + "You're caught up"); `user` source
  modes `all | unseen | shuffle`.
- Wired: your Posts + Dreams (the All/Public/Private pill moved into the controls row), every bot/member profile
  (bots: All · Haven't seen, visit recorded on leave), Bots tab pill badges (visits recorded
  when you move off a bot or leave the tab), Search tab (one search over everything; the scope chips were removed 2026-09-27).
- Newest/Oldest AND the calendar on Saved (Bookmarked · Hearted) and Reposts too, yours and anyone's (Kevin
  2026-09-26). These sort, open a month and count month tiles by when YOU saved, hearted or reposted, not the
  post's date (migration 562 adds the `saved` / `hearted` / `reposts` scopes; Saved and Hearted refuse anyone
  but you, since likes are world-readable). Your 5,645 hearts: months 120 ms, a month album page 5 ms, page 100
  of Oldest 11 ms. The Bookmarked · Hearted pill moved into the controls row (`SegmentedPill` takes icons).
- The grid's `view` (grid / months) and sort deliberately CARRY ACROSS albums when you switch tabs (Kevin loved
  it); only the drilled-in month resets.
- Fullscreen viewer fix: a tile tap hands the viewer the grid's sort + month (`useAlbumStore.albumOpts`) and the
  viewer pages the SAME query (`lib/albumSources.ts` `viewerQuery`). Before, it paged the default Newest list, so
  swiping from an Oldest / month / Dreams-filter / Haven't seen / 🎲 grid could jump to a different list.

**Tests (2026-09-26):**

- Fast (pre-commit): `albumSources.test.ts` (which albums sort / have the calendar; which query the viewer
  pages), `store/album.test.ts` (sort + month travel with the source), `albumDateColumnGuard.test.ts` (Saved /
  Hearted / Reposts use one date for sort, month albums and month tiles; Saved/Hearted refuse others; INVOKER),
  `searchNeverMatchesPeopleGuard.test.ts`, `albumNav.test.ts`.
- Live DB (CI `db-tests`): `albumMonths.dbspec.ts` (562), `botVisits.dbspec.ts` (559), `searchDreams.dbspec.ts`
  (557/558). All validated on a throwaway local Postgres 16 before pushing.

## Hard rules that apply

- New RPCs with optional filters / RETURNS TABLE: plpgsql + `SET plan_cache_mode = force_custom_plan` +
  `#variable_conflict use_column`; smoke as a real user after applying.
- No second FK between two tables without hinting every client embed (outage of 2026-09-25).
- New `users` / `uploads` columns need their column-level GRANTs (migration 278).
- Backfills: gate on pool headroom, cap concurrency ≤ 3, avoid :00 and ~08:00 UTC.
- PostgREST caps reads at 1000 rows: counts come from RPCs, never client-side counting.
