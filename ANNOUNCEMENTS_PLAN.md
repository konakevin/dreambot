# In-app Announcements — implementation plan (2026-07-06)

A DB-driven announcement system: put a branded screen/banner in front of users (feature
launches, downtime notices, promos) WITHOUT shipping a client build. Client code is built
once; every future announcement is an INSERT from the dashboard. Status: PLANNED.

## 0. What exists today (audit 2026-07-06)

- **No announcement/takeover system.** Nothing DB-flagged, nothing version-gated.
- Channels that DO work with no client deploy, both per-user-row based:
  - mass-INSERT into `notifications` → inbox rows + push ride the existing trigger
  - a DreamBot bot post to the public feed
- `user_first_run` = account-bound one-time intro flags, but column-per-intro (migration
  each time) — a precedent for seen-tracking, not a general system.
- `engine_config` = DB-driven config singleton the client already polls.

## 1. How other apps do it

| Pattern | Examples | Notes |
|---|---|---|
| Remote-config "What's New" takeover | most big apps (Firebase Remote Config style) | server-defined content + audience + version window; client renders a generic sheet; seen-tracking per announcement id |
| In-feed announcement card | IG/TikTok | native-feeling; we get this free via the DreamBot bot account |
| Mailbox/inbox message | games, Duolingo | we get this free via mass-insert notifications |
| Force-update gate | everyone | `min_supported_build` in remote config → blocking screen; worth adding while we're here |

Takeaway: the missing piece is the FIRST one. Build the generic client renderer once;
announcements become pure data.

## 2. Design

### 2.1 Schema (one migration)

```sql
CREATE TABLE public.announcements (
  id          text PRIMARY KEY,              -- slug, e.g. 'gift-sparkles-launch'
  title       text NOT NULL,
  body        text NOT NULL,
  image_url   text,                          -- optional hero (uploads bucket / CDN)
  cta_label   text,                          -- e.g. 'Try it'
  cta_route   text,                          -- nav.push target, e.g. '/sparkleStore'
  style       text NOT NULL DEFAULT 'sheet', -- 'sheet' (takeover) | 'banner' (home strip)
  audience    text NOT NULL DEFAULT 'all',   -- 'all' | 'pro' | 'free'
  min_build   int,                           -- hide from clients too old to have the feature
  starts_at   timestamptz NOT NULL DEFAULT now(),
  ends_at     timestamptz,                   -- NULL = until deactivated
  priority    int NOT NULL DEFAULT 0,        -- highest active wins; one at a time
  is_active   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);
-- RLS: SELECT for authenticated WHERE is_active AND now() within window. No client writes.

CREATE TABLE public.announcement_seen (
  user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  announcement_id text NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  seen_at         timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, announcement_id)
);
-- RLS: own-row SELECT/INSERT. Account-bound like user_first_run (survives reinstall,
-- fresh accounts see current announcements) + doubles as a view-rate metric.
```

### 2.2 Client (built once)

1. **`hooks/useAnnouncement.ts`** — on home mount + app foreground: fetch active
   announcements minus seen (one joined query or two cheap ones), filter audience
   (isPro from auth store) + `min_build <= nativeBuildVersion`, pick highest priority.
   Max ONE shown per session (in-memory latch) so stacked announcements can't spam.
2. **`components/AnnouncementSheet.tsx`** — branded takeover sheet (matches
   welcome-gift / intro-sheet conventions): optional hero image (expo-image), white bold
   title, body, CTA button (`nav.push(cta_route)`), "Not now" dismiss. Both CTA and
   dismiss mark seen (INSERT announcement_seen). No-image and no-CTA layouts degrade
   gracefully so one component covers everything.
3. **`components/AnnouncementBanner.tsx`** (style='banner') — slim dismissible strip at
   the top of the home feed for low-key notices (e.g. "Renders are slower than usual
   tonight"); same seen semantics. Can ship in a later build; 'sheet' covers v1.
4. Mount point: home screen (`app/(tabs)/index.tsx`) so it never interrupts onboarding,
   create-flow, or a fullscreen dream.

### 2.3 Push companion (optional per announcement, already-working infra)

For big beats, pair the in-app sheet with a push: `scripts/send-announcement.js
--id <slug>` mass-inserts `notifications` rows (type='announcement', body/title from the
announcements row, PAGINATED per the PostgREST 1000-row lesson, bots excluded, batched
for Expo push limits). `send-push` gets an 'announcement' copy case;
`computeNotificationRoute` routes type='announcement' → cta_route (fallback: open the
sheet). The sheet exists whether or not they came from the push.

### 2.4 Force-update gate (cheap add-on while we're here)

`engine_config.min_supported_build int` + a tiny check in `_layout`: if
`nativeBuildVersion < min_supported_build`, render a blocking "Please update" screen
(App Store link). Zero cost now; the day we need it, it's a dashboard edit instead of an
emergency.

### 2.5 Authoring workflow

INSERT via dashboard SQL editor (or the admin settings screen later — add to
ADMIN_CONFIG_PLAN backlog):

```sql
INSERT INTO announcements (id, title, body, cta_label, cta_route, is_active, priority)
VALUES ('gift-sparkles-launch', 'Gift sparkles 🎁',
        'Make someone''s day: send sparkles to any dreamer from their profile.',
        'Send a gift', '/sparkleStore', true, 10);
-- Turn off: UPDATE announcements SET is_active = false WHERE id = '...';
```

## 3. QA checklist

- Sheet shows once, never again after dismiss (reinstall included — DB-backed seen)
- CTA routes correctly; dismiss-only announcements (no CTA) render clean
- Audience filter (pro/free), min_build filter, starts/ends window
- Two active announcements → only highest priority shows; second shows NEXT session
- One-per-session latch (dismiss → no other announcement until next launch/foreground)
- Kill: is_active=false hides immediately on next fetch

## 4. Estimate + relationship to Gift Sparkles

~1 day: migration + hook + sheet (+ half day for the push script + banner variant when
wanted). **Build order note:** ship the announcement system in the same client build as
(or before) Gift Sparkles Phase 1, then the gift launch beat (GIFT_SPARKLES_PLAN §5.4)
becomes: quiet canary days → INSERT the announcement row + optional push + DreamBot feed
post, all with zero additional deploys.
