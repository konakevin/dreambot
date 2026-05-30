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
- Inbox unread badge counts distinct *groups*, not raw rows.

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

| Type | Trigger | Recipient | Notes |
|---|---|---|---|
| `post_like` | `likes` INSERT → `trg_notify_post_like` (066) | post owner | skip self |
| `post_comment` | `comments` INSERT → `create_comment_notifications` (039, 068) | post owner | partly broken — see §2b |
| `comment_reply` | same | parent comment author | **0 ever fired — broken** |
| `comment_mention` | same (`@username` regex) | mentioned user, ≤10 per comment | **0 ever fired — broken** |
| `post_share` | `post_shares` INSERT (039) | receiver | |
| `friend_request` | `friendships` INSERT pending (041) | non-requester | |
| `friend_accepted` | `friendships` UPDATE pending→accepted | requester | |
| `follow_request` | *(no trigger; not wired)* | — | **missing — needs adding** |
| `follow_accepted` | `approve_follow_request` RPC + `on_user_goes_public` trigger (098) | requester | |
| `post_milestone` | `votes` INSERT thresholds (045) | post owner | thresholds: 5/10/25/50/100/250/500/1000 |
| `post_twin` | `uploads` INSERT `twin_of` (067) | original owner | |
| `post_fuse` | `uploads` INSERT `fuse_of` (067) | original owner | |
| `dream_generated` | Edge inserts (generate-dream / restyle / nightly) | dreamer + wish recipients | opt-in via `notify_on_complete` |
| `dream_failed` | Edge insert | dreamer | |
| `download_ready` | `upscale-image` Edge insert | requester | opt-in via `notified_at IS NULL` |

Missing entirely: **comment likes** (existing trigger only updates `comments.like_count`, no notification).

### 2b. Latent bugs (silently broken in production)

1. **Comment replies + mentions never fire.** `create_comment_notifications` (migration 068) inserts type `'reply'` and `'mention'`, but the `notifications.type` CHECK constraint only allows `comment_reply` / `comment_mention`. Every reply or mention silently violates the constraint and is dropped. Live counts confirm `comment_reply=0`, `comment_mention=0` across all time, even though the client has a real `@`-typeahead in `CommentOverlay.tsx`.
2. **Follow requests don't notify.** Inserting a `follow_requests` row creates no notification; only acceptance (`approve_follow_request`) does. IG/TikTok always notify on the *request*.
3. **Comment likes don't notify.** Only the count column is updated.

### 2c. What's *missing* vs IG/TikTok

| Gap | Where we are | What we need |
|---|---|---|
| Aggregation | every event = one row | group-by-target, "X and N others" cards |
| Push fan-out control | every row fires a push | per-group debounce (1 push per group event) |
| User preferences | none | per-category Push + In-app toggles |
| Categories | flat `type` enum | bucket into Likes / Comments / Mentions / Follows / Shares / Twins&Fuses / Your dreams |
| Group read state | per-row `seen_at` | `mark_group_seen` marks all rows in the group |
| Group-aware badge | counts rows | counts distinct unread groups |

---

## 3. Design decisions (locked)

| # | Decision |
|---|---|
| D1 | Comments + replies + mentions + shares + dream events → **individual rows** (content matters). |
| D2 | Likes + comment-likes + twins + fuses + follow-accepted → **aggregated** by event target. |
| D3 | Aggregation window: **30 days** (older events freeze into stale groups; no new joins). |
| D4 | Push debounce: **30 s sliding** window with a **2 min** cap (longest a user waits for a ping). |
| D5 | Categories (7): **Likes / Comments / Mentions / Follows / Shares / Twins & Fuses / Your dreams**. |
| D6 | Unread badge: **distinct unread groups** (1 like card on one post = 1, regardless of liker count). |
| D7 | Channels per category: **Push + In-app**, independently togglable. |
| D8 | "Your dreams" In-app channel is **forced on** (your own events should always show somewhere). |
| D9 | Mentions default **on** for push (more personal than a like). |
| D10 | Always-on global: a master "Pause push" toggle at the top of settings. |

Skipped for v1: IG's "From people I follow / Everyone" filter (overkill at our scale); quiet hours / DND schedule (v2); email digests (don't apply).

---

## 4. Architecture

### 4a. The grouping primitive — `group_key`

A deterministic `text` column on `notifications`, computed at INSERT. Encodes "what this aggregates around":

| Type | `group_key` pattern | Behavior |
|---|---|---|
| `post_like` | `like:post:{upload_id}` | aggregate |
| `comment_like` | `clike:comment:{comment_id}` | aggregate |
| `post_twin` | `twin:post:{upload_id}` | aggregate |
| `post_fuse` | `fuse:post:{upload_id}` | aggregate |
| `follow_accepted` | `follow:{recipient_id}` | aggregate (per recipient) |
| `friend_accepted` | `friend:{recipient_id}` | aggregate |
| `post_milestone` | `milestone:post:{upload_id}` | aggregate |
| `post_comment` | `comment:{notification.id}` | individual (unique per row) |
| `comment_reply` | `reply:{notification.id}` | individual |
| `comment_mention` | `mention:{notification.id}` | individual |
| `post_share` | `share:{notification.id}` | individual |
| `follow_request` | `freq:{notification.id}` | individual (each is a decision) |
| `friend_request` | same pattern | individual |
| `dream_*`, `download_ready` | `system:{notification.id}` | individual (self-events) |

Computed by a `BEFORE INSERT` trigger so every row gets a key without callers needing to know the rules.

### 4b. Grouped inbox — `get_inbox(p_user_id, p_limit, p_offset)`

Returns one row per group, ordered by the *latest* event time in the group:

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

`send-push` extended to accept `{recipient_id, group_key, latest_notification_id}` and build copy from the *current group state* (so the push is fresh even after debounce).

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

| Channel | Check point |
|---|---|
| `inbox` | `get_inbox` filters: `WHERE category_enabled_for(user, category, 'inbox')` |
| `push` | `pending_push_groups` worker: if `push_paused` OR `not enabled(user, category, 'push')` → drop the push (notification still lands in inbox; only the push is suppressed) |

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

### Phase 2 — Push debounce
5. `pending_push_groups` table + pg_cron worker.
6. `send-push` extended to accept `(recipient_id, group_key, latest_id)` and build aggregated payload.
7. Switch the existing per-INSERT trigger from "fire push directly" to "enqueue into `pending_push_groups`". Old direct-fire path preserved behind an env flag for emergency revert.

### Phase 3 — Preferences
8. `notification_preferences` + `notification_settings` migrations.
9. `app/settings/notifications.tsx` UI + hooks.
10. Pref checks in `get_inbox` (inbox channel) and in the push worker (push channel + `push_paused`).

### Phase 4 — Cleanup
11. Replace the body-prefix parsing hack (`wish:` / `welcome:` / `dream:` / `download:` magic strings) with a proper `subtype text` column.
12. Drop legacy `get_notifications` once the client is fully on `get_inbox`.

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
- 10 rapid likes on one post → exactly 1 push to the post owner ("Alice and 9 others liked …").
- Single trickle event → push within ≤ 30 s.

**Phase 3:**
- Toggle "Likes / Push" off → next like still lands in inbox, no push.
- "Push notifications" master off → nothing pushes; inbox unaffected.
- "Your dreams / In-app" toggle is disabled in UI (forced on).

---

## 8. Notes / non-goals

- Email/SMS channels are **out of scope** (DreamBot is iOS-only push + in-app).
- Read receipts ("seen by") on notifications are not a feature.
- Notification history retention: keep all rows; aggregation just groups them in reads.
- "From people I follow" granularity is **deferred** (revisit if spam becomes an issue).
- The `Cache-Control: no-cache` Supabase platform behavior on `/object/public/` is orthogonal — not a notification concern.

---

*Commits tied to this doc:*
- Phase 1: TBD
- Phase 2: TBD
- Phase 3: TBD
- Phase 4: TBD
