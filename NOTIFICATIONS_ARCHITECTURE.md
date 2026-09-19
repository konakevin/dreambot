# DreamBot Notifications — Unified Architecture

**Status:** design locked 2026-05-29 (Kevin + Claude). Phase 1 in progress.
**Source-of-truth doc.** Read before touching any notification-related file.

---

## 1. What we ship for (the bar)

Instagram/TikTok-quality notifications for a small flowery-AI app:

- Every event a user cares about lands in the inbox + (if enabled) a push.
- Aggregated by event-target — "Alice, Bob and 12 others liked your dream" expands to the full actor list.
- Per-category user preferences (Push + In-app columns).
- One push per group event (not 14), via a short debounce window.
- Inbox unread badge counts distinct _groups_, not raw rows.

---

## 2. Current state (audit, 2026-05-29)

Schema + plumbing is largely in place:

- `notifications(id, recipient_id, actor_id, type, upload_id, comment_id, body, created_at, seen_at)` (migration 039).
- DB trigger on INSERT → `pg_net` → `send-push` Edge Function (migration 196).
- `push_tokens` (044), `push_send_failures` + CI monitor (197).
- In-app inbox: `get_notifications` RPC + `useInbox` + `app/inbox.tsx`.
- Unread count + iOS badge sync (`useUnreadCount`, `useBadgeSync`).
- Foreground push suppression (the app shows in-app indicators instead of an OS banner).
- Two explicit opt-in gates for noisy self-events: `dream_generated` (via `request_dream_notification`) and `download_ready` (via `allow_upscale_notify`).

### 2a. Notification types in use

| Type              | Trigger                                                            | Recipient                       | Notes                                                         |
| ----------------- | ------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------- |
| `post_like`       | `likes` INSERT → `trg_notify_post_like` (066)                      | post owner                      | skip self                                                     |
| `post_comment`    | `comments` INSERT → `create_comment_notifications` (039, 068)      | post owner                      | partly broken — see §2b                                       |
| `comment_reply`   | same                                                               | parent comment author           | **0 ever fired — broken**                                     |
| `comment_mention` | same (`@username` regex)                                           | mentioned user, ≤10 per comment | **0 ever fired — broken**                                     |
| `post_share`      | `post_shares` INSERT (039)                                         | receiver                        |                                                               |
| `friend_request`  | `friendships` INSERT pending (041)                                 | non-requester                   |                                                               |
| `friend_accepted` | `friendships` UPDATE pending→accepted                              | requester                       |                                                               |
| `follow_request`  | _(no trigger; not wired)_                                          | —                               | **missing — needs adding**                                    |
| `follow_accepted` | `approve_follow_request` RPC + `on_user_goes_public` trigger (098) | requester                       |                                                               |
| `post_milestone`  | `votes` INSERT thresholds (045)                                    | post owner                      | thresholds: 5/10/25/50/100/250/500/1000                       |
| `post_repost`     | `toggle_repost` RPC (242)                                          | original owner                  | (replaced the removed `post_twin`/`post_fuse`, migration 254) |
| `dream_generated` | Edge inserts (generate-dream / restyle / nightly)                  | dreamer + wish recipients       | opt-in via `notify_on_complete`                               |
| `dream_failed`    | Edge insert                                                        | dreamer                         |                                                               |
| `download_ready`  | `upscale-image` Edge insert                                        | requester                       | opt-in via `notified_at IS NULL`                              |

Missing entirely: **comment likes** (existing trigger only updates `comments.like_count`, no notification).

### 2b. Latent bugs (silently broken in production)

1. **Comment replies + mentions never fire.** `create_comment_notifications` (migration 068) inserts type `'reply'` and `'mention'`, but the `notifications.type` CHECK constraint only allows `comment_reply` / `comment_mention`. Every reply or mention silently violates the constraint and is dropped. Live counts confirm `comment_reply=0`, `comment_mention=0` across all time, even though the client has a real `@`-typeahead in `CommentOverlay.tsx`.
2. **Follow requests don't notify.** Inserting a `follow_requests` row creates no notification; only acceptance (`approve_follow_request`) does. IG/TikTok always notify on the _request_.
3. **Comment likes don't notify.** Only the count column is updated.

### 2c. What's _missing_ vs IG/TikTok

| Gap                  | Where we are           | What we need                                                                       |
| -------------------- | ---------------------- | ---------------------------------------------------------------------------------- |
| Aggregation          | every event = one row  | group-by-target, "X and N others" cards                                            |
| Push fan-out control | every row fires a push | per-group debounce (1 push per group event)                                        |
| User preferences     | none                   | per-category Push + In-app toggles                                                 |
| Categories           | flat `type` enum       | bucket into Likes / Comments / Mentions / Follows / Shares / Reposts / Your dreams |
| Group read state     | per-row `seen_at`      | `mark_group_seen` marks all rows in the group                                      |
| Group-aware badge    | counts rows            | counts distinct unread groups                                                      |

---

## 3. Design decisions (locked)

| #   | Decision                                                                                           |
| --- | -------------------------------------------------------------------------------------------------- |
| D1  | Comments + replies + mentions + shares + dream events → **individual rows** (content matters).     |
| D2  | Likes + comment-likes + reposts + follow-accepted → **aggregated** by event target.                |
| D3  | Aggregation window: **30 days** (older events freeze into stale groups; no new joins).             |
| D4  | Push debounce: **30 s sliding** window with a **2 min** cap (longest a user waits for a ping).     |
| D5  | Categories (7): **Likes / Comments / Mentions / Follows / Shares / Reposts / Your dreams**.        |
| D6  | Unread badge: **distinct unread groups** (1 like card on one post = 1, regardless of liker count). |
| D7  | Channels per category: **Push + In-app**, independently togglable.                                 |
| D8  | "Your dreams" In-app channel is **forced on** (your own events should always show somewhere).      |
| D9  | Mentions default **on** for push (more personal than a like).                                      |
| D10 | Always-on global: a master "Pause push" toggle at the top of settings.                             |

Skipped for v1: IG's "From people I follow / Everyone" filter (overkill at our scale); quiet hours / DND schedule (v2); email digests (don't apply).

---

## 4. Architecture

### 4a. The grouping primitive — `group_key`

A deterministic `text` column on `notifications`, computed at INSERT. Encodes "what this aggregates around":

| Type                        | `group_key` pattern          | Behavior                        |
| --------------------------- | ---------------------------- | ------------------------------- |
| `post_like`                 | `like:post:{upload_id}`      | aggregate                       |
| `comment_like`              | `clike:comment:{comment_id}` | aggregate                       |
| `post_repost`               | `repost:post:{upload_id}`    | aggregate                       |
| `follow_accepted`           | `follow:{recipient_id}`      | aggregate (per recipient)       |
| `friend_accepted`           | `friend:{recipient_id}`      | aggregate                       |
| `post_milestone`            | `milestone:post:{upload_id}` | aggregate                       |
| `post_comment`              | `comment:{notification.id}`  | individual (unique per row)     |
| `comment_reply`             | `reply:{notification.id}`    | individual                      |
| `comment_mention`           | `mention:{notification.id}`  | individual                      |
| `post_share`                | `share:{notification.id}`    | individual                      |
| `follow_request`            | `freq:{notification.id}`     | individual (each is a decision) |
| `friend_request`            | same pattern                 | individual                      |
| `dream_*`, `download_ready` | `system:{notification.id}`   | individual (self-events)        |

Computed by a `BEFORE INSERT` trigger so every row gets a key without callers needing to know the rules.

### 4b. Grouped inbox — `get_inbox(p_user_id, p_limit, p_offset)`

Returns one row per group, ordered by the _latest_ event time in the group:

```sql
RETURNS TABLE(
  group_key       text,
  type            text,
  category        text,         -- maps from type (one of the 7 categories)
  preview_actor_ids   uuid[],   -- 3 most recent actors
  preview_usernames   text[],
  preview_avatars     text[],
  actor_count     integer,      -- distinct actor count (for "X and N others")
  upload_id       uuid,         -- canonical target
  comment_id      uuid,
  upload_image_url text,        -- thumbnail
  body            text,         -- for individual types (comment body, etc.)
  last_at         timestamptz,  -- newest event in the group (for ordering)
  any_unseen      boolean       -- true iff any row in group is unread
);
```

A group is `(recipient_id, group_key)` with the latest event ≤ 30 days old. Older events stay queryable as separate groups but don't aggregate new actors.

### 4c. Expand — `get_group_actors(group_key, limit, offset)`

Paginated actor list for one group: `[{actor_id, username, avatar_url, created_at}, ...]`. Tap a group card → fetch & list.

### 4d. Mark read — `mark_group_seen(group_key)`

Sets `seen_at = now()` on every row in the group for the calling user. Per-row state remains the source of truth.

### 4e. Unread badge — `get_unread_group_count()`

Returns `count(distinct group_key) where seen_at is null and recipient_id = me`.

### 4f. Categories (computed)

Server-side `notification_category(type) → text`:

- `Likes`: `post_like`, `post_milestone`, `comment_like`
- `Comments`: `post_comment`, `comment_reply`
- `Mentions`: `comment_mention`
- `Follows`: `follow_request`, `follow_accepted`, `friend_request`, `friend_accepted`
- `Shares`: `post_share`
- `Twins & Fuses`: `post_twin`, `post_fuse`
- `Your dreams`: `dream_generated`, `dream_failed`, `download_ready`

### 4g. Push debounce

New table `pending_push_groups(id, recipient_id, group_key, fire_at, notification_id_latest)`. On `notifications` INSERT:

1. Upsert a row by `(recipient_id, group_key)`. Set `fire_at = now() + 30s`, but **cap** the slide forward at `original_created_at + 2 min` so frequent events still ship within 2 min.
2. A pg_cron worker (every ~15 s) selects rows where `fire_at < now()`, deletes them atomically, and calls `send-push` once per group with the latest aggregated payload.

`send-push` extended to accept `{recipient_id, group_key, latest_notification_id}` and build copy from the _current group state_ (so the push is fresh even after debounce).

Push copy templates per category, parameterized by `(actor_count, latest_actor)`:

- 1: `"Alice liked your dream"`
- 2: `"Alice and Bob liked your dream"`
- 3+: `"Alice, Bob and 12 others liked your dream"`

### 4h. Preferences schema

```sql
create table public.notification_preferences (
  user_id     uuid not null references public.users(id) on delete cascade,
  category    text not null check (category in
    ('Likes','Comments','Mentions','Follows','Shares','Twins & Fuses','Your dreams')),
  channel     text not null check (channel in ('push','inbox')),
  enabled     boolean not null default true,
  updated_at  timestamptz not null default now(),
  primary key (user_id, category, channel)
);

create table public.notification_settings (
  user_id     uuid primary key references public.users(id) on delete cascade,
  push_paused boolean not null default false,    -- D10 master push pause
  updated_at  timestamptz not null default now()
);
```

Defaults: rows omitted = `enabled=true` (sparse, only writes on user opt-out). `push_paused=false`.

### 4i. Where prefs are checked

| Channel | Check point                                                                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `inbox` | `get_inbox` filters: `WHERE category_enabled_for(user, category, 'inbox')`                                                                                               |
| `push`  | `pending_push_groups` worker: if `push_paused` OR `not enabled(user, category, 'push')` → drop the push (notification still lands in inbox; only the push is suppressed) |

"Your dreams" In-app channel is force-enabled at the RPC level (D8). Mentions default-on (D9).

---

## 5. Settings UI (proposed)

`app/settings/notifications.tsx`:

```
─────────────────────────────────
 Notifications
─────────────────────────────────
 Push notifications         [ON]   ← master toggle (push_paused)
                                      when OFF, no pushes; inbox still works
─────────────────────────────────
                       Push   Inbox
 Likes                  [✓]    [✓]
 Comments               [✓]    [✓]
 Mentions               [✓]    [✓]
 Follows                [✓]    [✓]
 Shares                 [✓]    [✓]
 Twins & Fuses          [✓]    [✓]
 Your dreams            [✓]   [✓ locked]
─────────────────────────────────
 Your dreams stay in your inbox so
 you don't miss your own creations.
```

Discovery: link from Settings index ("Notifications") + a one-time prompt the first time we'd otherwise have asked for OS push permission, surfacing this screen.

---

## 6. Phased rollout

### Phase 1 — Foundation (this PR set)

1. **Migration 200** — Fix `create_comment_notifications` (canonical type names — fixes replies + mentions silent breakage). Add `comment_like` trigger. Add `follow_request` notification on `follow_requests` INSERT.
2. **Migration 201** — Add `group_key text` column to `notifications` + `BEFORE INSERT` trigger to populate it from the type-to-pattern table in §4a. One-time backfill for existing rows.
3. **Migration 202** — New RPCs: `get_inbox`, `get_group_actors`, `mark_group_seen`, `get_unread_group_count`. Helper `notification_category(text) → text`. Old `get_notifications` left in place during cutover.
4. **Client** — Rewire `useInbox` to `get_inbox`; replace `useUnreadCount` with `get_unread_group_count`; add group-tap-to-expand UX in `app/inbox.tsx`; rewire `useMarkAllSeen` and per-group read.

### Phase 2 — Push debounce ✅ SHIPPED (migration 204 + send-push v2)

5. **Migration 204** — `pending_push_groups(recipient_id, group_key, latest_notification_id, fire_at, original_created_at)`. Primary key (recipient_id, group_key) so each in-flight group is a single row.
6. **`notify_send_push()` rewritten** — was pg_net POST to send-push; now UPSERTs into `pending_push_groups` with `fire_at = now() + 30s`. On conflict, slides `fire_at` to `LEAST(now() + 30s, original_created_at + 2 min)` — a sustained burst still pings within ~2 min.
7. **`drain_pending_push_groups()` + pg_cron** — every minute, claims due rows (SELECT FOR UPDATE SKIP LOCKED + atomic DELETE RETURNING, LIMIT 100/tick), POSTs one `aggregated: true` payload per group to send-push via pg_net. Worst-case delivery latency: debounce(30s) + cadence(60s) = **~90s**. (Sub-minute cron schedule strings aren't enabled on this project's pg_cron build; flip to `'30 seconds'` to cut latency once available.)
8. **`send-push` extended** — when `aggregated: true`, queries the group's current unread state for `actor_count` + the second-most-recent actor's username, then `getAggregatedNotificationContent(type, latestActorName, secondActorName, actorCount, body)` builds the right copy line (`Alice liked` / `Alice and Bob liked` / `Alice and 12 others liked`). Self-events (`dream_generated`, `download_ready`) skip aggregation. Also fixed: `post_like` / `post_favorite` / `comment_like` previously fell through to `"New notification"` in the single-actor switch — now have proper titles.
9. **Revert plan** — restore migration 196's `notify_send_push()` body (single CREATE OR REPLACE) and the trigger fires send-push directly again; `pending_push_groups` becomes a quiet unused table.

### Phase 3 — Preferences ✅ SHIPPED (migration 205 + settings screen)

10. **Migration 205** — `notification_settings(user_id PK, push_paused, updated_at)` + `notification_preferences(user_id, category, channel, enabled, updated_at, PK(user_id, category, channel))`. Both tables RLS-enabled, owner-only select/upsert/update.
11. **Helper `category_enabled_for(user_id, category, channel) → boolean`** — encodes D8 (`Your dreams` + inbox → always true), D10 (master `push_paused` → overrides every per-category push pref), and the sparse-default rule (missing row → enabled).
12. **Public RPCs** — `get_notification_settings(user_id?) → jsonb` (single-shot read for the settings screen, sparse `{ push_paused, prefs: { "<cat>|<chan>": bool, ... } }`), `set_notification_pref(category, channel, enabled)` (upsert + D8 server-side reject), `set_push_paused(paused)` (upsert into notification_settings).
13. **`drain_pending_push_groups()` patched** — before each pg_net POST, calls `category_enabled_for(recipient, notification_category(type), 'push')`. Disabled = silently drop the POST (queue row already deleted by atomic claim); inbox row landed independently.
14. **`get_inbox` + `get_unread_group_count` patched** — both filter through `category_enabled_for(p_user_id, notification_category(n.type), 'inbox')`. Disabled inbox categories disappear from the feed AND the badge. Notification rows are NOT filtered at write time, so re-enabling instantly resurfaces past events.
15. **Client** — `useNotificationSettings`, `useToggleNotificationPref`, `useTogglePushPaused` (all optimistic, settle-time invalidates `notificationSettings` + `inboxGrouped`/`unreadGroupCount` on inbox-channel changes). New screen `app/settings/notifications.tsx` — master "Push notifications" switch (inverted from `push_paused`) + 7×2 toggle grid with "Your dreams" inbox visually locked + footer copy. Linked from `app/settings/index.tsx`.

### Phase 4 — Cleanup ✅ SHIPPED (migration 206 + 5 edge deploys + legacy hook purge)

11. **Migration 206** — `notifications.subtype text` (nullable, open-ended). Backfilled from existing `body` prefixes (`wish:`/`welcome:`/`dream:`/`download:`) AND stripped the prefix from `body` so it's just clean message text. Subtype taxonomy: `wish` (dream_generated w/ wish), `welcome` (onboarding first dream), `failed` (dream_failed), `download` (download_ready), `NULL` (plain dream_generated / friend events / likes / etc.). `get_inbox` patched to surface `subtype`. Legacy `get_notifications` RPC dropped (zero callers — Explore-agent audit 2026-05-29 confirmed).
12. **7 writers updated** to set `subtype` directly + write `body` as plain message text (no prefix concat): `dream-queue-worker/dispatchers/nightly.ts`, `components/onboarding/RevealStep.tsx`, `upscale-image/index.ts`, `generate-dream/index.ts`, `restyle-photo/index.ts`, `refund-stuck-jobs/index.ts`, `scripts/sweep-stuck-upscales.js`. 5 Edge Functions redeployed.
13. **`app/inbox.tsx` reader patched** — `getGroupText` routes `dream_generated` on `g.subtype === 'wish' / 'welcome'` instead of `body.startsWith('wish:')` etc. `body` is now displayed raw — no `.replace(/^(wish|dream|welcome):/)` strip. `InboxGroup` type gains `subtype: string | null`.
14. **Legacy hooks deleted** — `hooks/useInbox.ts`, `hooks/useUnreadCount.ts`, `hooks/useMarkShareSeen.ts`, `hooks/useDeleteShare.ts`. `useMarkAllSeen` simplified to drop the dead `['inbox']` / `['unreadNotificationCount']` cache flips + `NotificationItem` import. Profile-tab badge migrated `useUnreadCount → useUnreadGroupCount`.
15. **Bulk cache-key rewire** — 7 sites in `app/_layout.tsx` + `hooks/useFollowRequests.ts` + `hooks/useSendShare.ts` + `hooks/useDeleteAllNotifications.ts` were invalidating dead legacy cache keys (`['inbox']` + `['unreadNotificationCount']`). All swapped to live keys (`['inboxGrouped']` + `['unreadGroupCount']`). Comment in `usePushNotifications.ts` updated to reference `useUnreadGroupCount`.

---

## 7. Acceptance criteria

**Phase 1:**

- Reply to a comment → recipient sees a `comment_reply` row in their inbox.
- `@mention` a user in a comment → mentioned user sees a `comment_mention` row.
- Like a comment → comment author sees `comment_like` (new type).
- Send a follow request to a private account → target sees a `follow_request` row.
- Existing notifications all have a `group_key` populated; new ones get one on insert.
- `get_inbox` returns aggregated groups for likes/twins/fuses; individual rows for comments/replies/mentions/shares.
- Inbox UI shows "Alice and N others liked …" + tap expands to actor list.
- Unread badge counts distinct unread groups.
- Old `get_notifications` still returns the row-level shape (kept for safety, no callers after rewire).

**Phase 2:**

- 10 rapid likes on one post → exactly 1 push to the post owner ("Alice and 9 others liked …"). ✅
- Single trickle event → push within ≤ ~90 s (debounce 30 s + cron cadence 60 s). ✅
- `pending_push_groups` queue depth stays at 0 between bursts (drain runs cleanly). ✅ verified post-deploy.

**Phase 3:**

- Toggle "Likes / Push" off → next like still lands in inbox, no push. ✅ (drain checks `category_enabled_for`).
- "Push notifications" master off → nothing pushes; inbox unaffected. ✅ (helper short-circuits push channel).
- "Your dreams / In-app" toggle is disabled in UI (forced on). ✅ (Switch `disabled` + lock icon; `set_notification_pref` raises on the server).
- Disable an inbox category → groups disappear from `get_inbox` + badge drops; re-enable → instantly resurfaces. ✅ (no write-time filtering).

---

## 8. Notes / non-goals

- Email/SMS channels are **out of scope** (DreamBot is iOS-only push + in-app).
- Read receipts ("seen by") on notifications are not a feature.
- Notification history retention: keep all rows; aggregation just groups them in reads.
- "From people I follow" granularity is **deferred** (revisit if spam becomes an issue).
- The `Cache-Control: no-cache` Supabase platform behavior on `/object/public/` is orthogonal — not a notification concern.

---

_Commits tied to this doc:_

- Phase 1: see `git log -- supabase/migrations/{200,201,202,203}_notifications_*.sql`
- Phase 2: `cf810d93` (migration 204 + send-push v2)
- Phase 3: `b2a37d66` (migration 205 + settings screen + 3 hooks)
- Phase 4: see migration 206 commit (subtype col + writer rewrites + legacy-hook purge)

---

## 9. The fullscreen inbox + share batches (shipped 2026-09-18)

Kevin: "if someone sends you multiple posts, it's awkward to tap into one, tap back, tap into the next…" and, after
a first cut that treated the inbox as an album of posts: "it's not an album, I want the ability to swipe up and down
in the inbox while in fullscreen … even ones like 'That dream couldn't render' still show up."

**Share batches (migration 533).** `post_share` rows group PER SENDER PER DAY: `group_key =
'share:<actor_id>:<yyyy-mm-dd>'`, set by the BEFORE INSERT trigger `set_notification_group_key()` (special-cased
there because the generic `notification_group_key()` does not take the actor). The live 30-day window was backfilled
(158 rows → 59 groups, 30 of them batches). `get_inbox` needs no change: `event_count` (unseen rows) drives the copy
"<sender> sent you N posts" (`lib/inboxGroupText.ts getGroupText`), and send-push says "sent you N posts" for a
single-sender batch (`getAggregatedNotificationContent` gained `eventCount`).

**The fullscreen inbox (`app/inboxFeed.tsx`, `lib/inboxPages.ts`, `components/InboxCardPage.tsx`).** Tapping ANY
inbox row opens `/inboxFeed?start=<groupKey>`: the same cached `useInboxGrouped()` rows, one PAGE per row in inbox
order, on the app's vertical pager (swipe up = next row; a horizontal swipe or the top-left chevron = back).

- **Post page** — a row that points at a post (`POST_PAGE_TYPES`: likes, comment likes, reposts, milestones, shares,
  comments, replies, mentions, dreams, HD downloads). The post fills the screen via the feed's own `FeedCard`
  (exported from FullScreenFeed: like / save / comments / likes overlay / delete / admin quarantine). A share batch
  and a day's pooled dreams expand into one page per member (one `notifications` query for all such groups; shares
  oldest → newest, dreams newest first). A post that is gone (pruned / deleted) renders as a card saying so, so the
  count stays honest. Nothing is deduped — a post in two rows is two pages with two contexts.
- **Card page** — every other row (follow / friend requests with Accept / Accept & Follow Back / Deny; failed dreams
  with Tweak it / Try again; gifts with Unwrap; accepted follows with View profile; reminders, cast-photo nudges,
  reports with Open). Avatar or the DreamBot mascot, the row's subject + full body, time ago, actions.
- **Pill** (top centre, hides with the HUD): the WHOLE-INBOX position only ("5 of 23"). The CONTEXT line for post pages sits in its own pill just above the username at the bottom-left, with the inbox row's own filled type badge (heart / green repost / purple moon…) — ("From sunnysteph",
  "sunnysteph reposted this", "bob and 2 others liked this", "Nightly dream"; `pageContext`) over the WHOLE-INBOX
  position ("5 of 23") that never restarts inside a batch. Card pages show the position only (the card is the text).
- **Seen** — every row is marked seen (`mark_group_seen`) as its page becomes visible, including the landing page;
  the inbox + badge queries are invalidated once on unmount. A comment row opens its thread on arrival.
- **Back re-anchors the list** on the row you were on (`store/inboxFeed.ts currentGroupKey` → the inbox FlatList
  `scrollToIndex`, with an offset fallback for unmeasured rows).
- **Hint** — a one-time "Swipe up for the next one" (account-bound `user_first_run.seen_inbox_strip_hint`,
  `FirstRunFlag 'inboxStrip'`), when there are ≥ 2 pages; fades on the first swipe or after 3.5 s.
- A tap ANYWHERE on a row opens the fullscreen inbox at that row — the inline text expansion and the actor sheet
  ("who else liked this") are gone (Kevin 2026-09-18: the sheet took ~1 s to open, and the additional actors are
  display-only: "sunnysteph +2" in the row, "sunnysteph and 2 others liked this" in the fullscreen badge).
  `photo/[id]` is untouched (its old scoped "N dreams are ready" pager was replaced by this).

Locked by `__tests__/lib/inboxPages.test.ts`.
