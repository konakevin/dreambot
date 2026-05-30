-- Migration 206: notifications.subtype column — replaces the body-prefix hack.
--
-- Phase 4 of NOTIFICATIONS_ARCHITECTURE.md.
--
-- Background: `notifications.body` was being used as BOTH free-text (comment
-- bodies, dream messages) AND a typed-event discriminator via magic-prefix
-- strings ('wish:', 'welcome:', 'dream:', 'download:'). The inbox screen
-- parsed `body.startsWith('wish:')` etc. to route display copy. Fragile,
-- couples the renderer to the writer's body format, and uses string concat
-- on free text the user might one day see if a strip ever fails.
--
-- This migration:
--   1. Adds `subtype text` (nullable, no CHECK — open-ended for future tags).
--   2. Backfills `subtype` from existing prefixes AND strips the prefix from
--      `body` so body is just clean message text.
--   3. Patches get_inbox to surface `subtype` (the inbox UI will read it
--      instead of parsing body).
--   4. Drops the legacy get_notifications RPC — Phase 1 already migrated the
--      client to get_inbox; no remaining callers (Explore-agent audit
--      2026-05-29 confirms zero non-internal call sites).
--
-- Idempotent: the subtype-IS-NULL guard on each backfill UPDATE means a
-- re-run is a no-op once subtype is populated.
--
-- ── SUBTYPE TAXONOMY ──
--   wish      — dream_generated, body holds a wish-derived message
--   welcome   — dream_generated, first-dream onboarding ping
--   failed    — dream_failed
--   download  — download_ready, HD download is ready
--   (NULL)    — plain dream_generated / friend events / likes / etc.

-- 1) Column
alter table public.notifications
  add column if not exists subtype text;

comment on column public.notifications.subtype is
  'Optional discriminator for fine-grained type variants (wish/welcome/failed/download). Set by the writer; read by the inbox UI for display routing. Migration 206.';

-- 2) Backfill — parse the magic prefix off body, set subtype, strip prefix.
--    Guarded by subtype IS NULL so re-runs are safe.

-- 'wish:' → dream_generated with wish text
update public.notifications
   set subtype = 'wish',
       body    = substring(body from 6)   -- skip 'wish:' (5 chars)
 where subtype is null
   and type = 'dream_generated'
   and body like 'wish:%';

-- 'welcome:' → dream_generated onboarding ping
update public.notifications
   set subtype = 'welcome',
       body    = substring(body from 9)   -- skip 'welcome:' (8 chars)
 where subtype is null
   and type = 'dream_generated'
   and body like 'welcome:%';

-- 'dream:' on dream_generated → no subtype (default kind), just strip prefix
update public.notifications
   set body = substring(body from 7)      -- skip 'dream:' (6 chars)
 where subtype is null
   and type = 'dream_generated'
   and body like 'dream:%';

-- 'dream:' on dream_failed → subtype='failed', strip prefix
update public.notifications
   set subtype = 'failed',
       body    = substring(body from 7)
 where subtype is null
   and type = 'dream_failed'
   and body like 'dream:%';

-- 'download:' → download_ready
update public.notifications
   set subtype = 'download',
       body    = substring(body from 10)  -- skip 'download:' (9 chars)
 where subtype is null
   and type = 'download_ready'
   and body like 'download:%';

-- 3) Patch get_inbox — surface `subtype` so the client can route on it.
-- Returns the LATEST row's subtype within the group (same pattern as `body`
-- and `type` — for aggregating types every row has the same subtype anyway;
-- for individual types each row is its own group).
--
-- DROP first: CREATE OR REPLACE can't change a function's RETURNS TABLE
-- signature, and we're adding the new `subtype` column to it.
drop function if exists public.get_inbox(uuid, integer, integer);

create function public.get_inbox(
  p_user_id  uuid,
  p_limit    integer default 20,
  p_offset   integer default 0
)
returns table(
  group_key             text,
  type                  text,
  subtype               text,
  category              text,
  preview_actor_ids     uuid[],
  preview_usernames     text[],
  preview_avatars       text[],
  actor_count           integer,
  upload_id             uuid,
  comment_id            uuid,
  upload_image_url      text,
  body                  text,
  last_at               timestamptz,
  any_unseen            boolean
)
language sql stable security definer
set search_path = ''
as $$
  with
    mine as (
      select *
      from public.notifications n
      where n.recipient_id = p_user_id
        and public.category_enabled_for(
              p_user_id,
              public.notification_category(n.type),
              'inbox'
            )
    ),
    actor_latest as (
      select group_key, actor_id, max(created_at) as latest_for_actor
      from mine
      group by group_key, actor_id
    ),
    actor_top3 as (
      select group_key,
             actor_id,
             latest_for_actor,
             row_number() over (partition by group_key order by latest_for_actor desc) as rn
      from actor_latest
    ),
    actor_previews as (
      select
        a.group_key,
        array_agg(a.actor_id   order by a.latest_for_actor desc) filter (where a.rn <= 3) as preview_actor_ids,
        array_agg(u.username   order by a.latest_for_actor desc) filter (where a.rn <= 3) as preview_usernames,
        array_agg(u.avatar_url order by a.latest_for_actor desc) filter (where a.rn <= 3) as preview_avatars
      from actor_top3 a
      left join public.users u on u.id = a.actor_id
      group by a.group_key
    ),
    grouped as (
      select
        m.group_key,
        max(m.created_at)                                       as last_at,
        bool_or(m.seen_at is null)                              as any_unseen,
        count(distinct m.actor_id)                              as actor_count,
        (array_agg(m.type        order by m.created_at desc))[1] as type,
        (array_agg(m.subtype     order by m.created_at desc))[1] as subtype,
        (array_agg(m.upload_id   order by m.created_at desc))[1] as upload_id,
        (array_agg(m.comment_id  order by m.created_at desc))[1] as comment_id,
        (array_agg(m.body        order by m.created_at desc))[1] as body
      from mine m
      group by m.group_key
    )
  select
    g.group_key,
    g.type,
    g.subtype,
    public.notification_category(g.type)                        as category,
    p.preview_actor_ids,
    p.preview_usernames,
    p.preview_avatars,
    g.actor_count::int                                          as actor_count,
    g.upload_id,
    g.comment_id,
    coalesce(up.image_url_display, up.image_url)                as upload_image_url,
    g.body,
    g.last_at,
    g.any_unseen
  from grouped g
  left join actor_previews p on p.group_key = g.group_key
  left join public.uploads up on up.id = g.upload_id
  order by g.last_at desc
  limit p_limit
  offset p_offset;
$$;

grant execute on function public.get_inbox(uuid, integer, integer) to authenticated;

-- 4) Drop legacy get_notifications — Phase 1 migrated the client to get_inbox.
-- Zero callers remain (Explore-agent audit 2026-05-29). DROP IF EXISTS so the
-- migration is safe even if the function was already removed manually.
drop function if exists public.get_notifications(uuid, integer, integer);
drop function if exists public.get_notifications(uuid, integer, integer, timestamptz);
drop function if exists public.get_notifications(uuid);
