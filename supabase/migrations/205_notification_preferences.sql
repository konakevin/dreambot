-- Migration 205: notification preferences — per-category × per-channel toggles
-- plus a master "Pause push" switch. Phase 3 of NOTIFICATIONS_ARCHITECTURE.md.
--
-- D5: 7 categories — Likes / Comments / Mentions / Follows / Shares /
--     Twins & Fuses / Your dreams.
-- D7: 2 channels per category — push, inbox. Independently togglable.
-- D8: "Your dreams" In-app channel is FORCED ON (helper short-circuits).
-- D10: master push pause overrides every per-category push pref.
--
-- Sparse defaults: a missing row = enabled (so we only write on opt-out,
-- and a brand-new user gets everything without bootstrapping 14 rows).
--
-- Pref enforcement points:
--   • push channel — drain_pending_push_groups() skips the pg_net POST when
--                    push_paused OR per-category disabled. Inbox row already
--                    landed (the notifications INSERT trigger is independent).
--   • inbox channel — get_inbox + get_unread_group_count filter the `mine`
--                    rows through category_enabled_for(...,'inbox'). Disabled
--                    categories disappear from the feed + the badge.
--
-- The notifications table itself is untouched — disabled-channel events still
-- insert rows. This means turning a channel back on later instantly resurfaces
-- the missed events in the inbox without a replay (D3's 30-day window still
-- applies to aggregation).

-- ============================================================
-- 1. notification_settings — per-user singleton
-- ============================================================
create table if not exists public.notification_settings (
  user_id     uuid primary key references public.users(id) on delete cascade,
  push_paused boolean not null default false,
  updated_at  timestamptz not null default now()
);

alter table public.notification_settings enable row level security;

drop policy if exists notification_settings_select_own on public.notification_settings;
create policy notification_settings_select_own
  on public.notification_settings
  for select
  using (user_id = auth.uid());

drop policy if exists notification_settings_upsert_own on public.notification_settings;
create policy notification_settings_upsert_own
  on public.notification_settings
  for insert
  with check (user_id = auth.uid());

drop policy if exists notification_settings_update_own on public.notification_settings;
create policy notification_settings_update_own
  on public.notification_settings
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

comment on table public.notification_settings is
  'Per-user notification settings. push_paused = D10 master toggle. Sparse — no row = defaults (push enabled). Migration 205.';

-- ============================================================
-- 2. notification_preferences — sparse per-category × per-channel
-- ============================================================
create table if not exists public.notification_preferences (
  user_id    uuid not null references public.users(id) on delete cascade,
  category   text not null check (category in
    ('Likes','Comments','Mentions','Follows','Shares','Twins & Fuses','Your dreams')),
  channel    text not null check (channel in ('push','inbox')),
  enabled    boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, category, channel)
);

alter table public.notification_preferences enable row level security;

drop policy if exists notification_preferences_select_own on public.notification_preferences;
create policy notification_preferences_select_own
  on public.notification_preferences
  for select
  using (user_id = auth.uid());

drop policy if exists notification_preferences_upsert_own on public.notification_preferences;
create policy notification_preferences_upsert_own
  on public.notification_preferences
  for insert
  with check (user_id = auth.uid());

drop policy if exists notification_preferences_update_own on public.notification_preferences;
create policy notification_preferences_update_own
  on public.notification_preferences
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

comment on table public.notification_preferences is
  'Per-user per-category per-channel notification opt-outs. Sparse — missing row = enabled. Migration 205.';

-- ============================================================
-- 3. category_enabled_for — central pref check (D8 + D10 + sparse default)
-- ============================================================
-- Called by both gating points (drain_pending_push_groups for push,
-- get_inbox + get_unread_group_count for inbox). Encapsulates:
--   • D8: "Your dreams" + inbox → always true regardless of DB
--   • D10: master push_paused → overrides per-category push prefs
--   • sparse default: missing row → true
create or replace function public.category_enabled_for(
  p_user_id  uuid,
  p_category text,
  p_channel  text
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_enabled boolean;
begin
  -- D8: "Your dreams" inbox channel is force-enabled. Users always see their
  -- own dreams in the inbox even if they fat-finger the (hidden) toggle.
  if p_category = 'Your dreams' and p_channel = 'inbox' then
    return true;
  end if;

  -- D10: master push pause overrides every per-category push pref.
  if p_channel = 'push' and exists (
    select 1 from public.notification_settings
    where user_id = p_user_id and push_paused = true
  ) then
    return false;
  end if;

  select enabled into v_enabled
    from public.notification_preferences
    where user_id  = p_user_id
      and category = p_category
      and channel  = p_channel;

  return coalesce(v_enabled, true);  -- sparse default
end;
$$;

comment on function public.category_enabled_for is
  'Resolves whether a (user, category, channel) is enabled. Encodes D8 (Your-dreams-inbox forced on), D10 (push pause overrides), sparse-row default = enabled. Migration 205.';

grant execute on function public.category_enabled_for(uuid, text, text) to authenticated;

-- ============================================================
-- 4. get_notification_settings — single-shot read for the settings screen
-- ============================================================
-- Returns push_paused + the full sparse prefs as a flat object the client can
-- hydrate without N+1 queries. Sparse rows mean the client must treat any
-- missing (category,channel) as enabled — the helper above does the same.
create or replace function public.get_notification_settings(p_user_id uuid default auth.uid())
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'push_paused', coalesce(
      (select push_paused from public.notification_settings where user_id = p_user_id),
      false
    ),
    'prefs', coalesce((
      select jsonb_object_agg(category || '|' || channel, enabled)
      from public.notification_preferences
      where user_id = p_user_id
    ), '{}'::jsonb)
  );
$$;

grant execute on function public.get_notification_settings(uuid) to authenticated;

-- ============================================================
-- 5. set_notification_pref — toggle one (category, channel) cell
-- ============================================================
-- Inserts a sparse row on opt-out / re-enable. Enforces D8 server-side too —
-- you can't disable Your-dreams inbox even by hitting the RPC directly.
create or replace function public.set_notification_pref(
  p_category text,
  p_channel  text,
  p_enabled  boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'authentication required';
  end if;

  if p_category not in ('Likes','Comments','Mentions','Follows','Shares','Twins & Fuses','Your dreams') then
    raise exception 'invalid category: %', p_category;
  end if;

  if p_channel not in ('push','inbox') then
    raise exception 'invalid channel: %', p_channel;
  end if;

  -- D8 server-side guard.
  if p_category = 'Your dreams' and p_channel = 'inbox' and p_enabled = false then
    raise exception 'Your dreams inbox channel cannot be disabled';
  end if;

  insert into public.notification_preferences (user_id, category, channel, enabled, updated_at)
  values (v_uid, p_category, p_channel, p_enabled, now())
  on conflict (user_id, category, channel) do update
    set enabled = excluded.enabled,
        updated_at = now();
end;
$$;

grant execute on function public.set_notification_pref(text, text, boolean) to authenticated;

-- ============================================================
-- 6. set_push_paused — D10 master toggle
-- ============================================================
create or replace function public.set_push_paused(p_paused boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'authentication required';
  end if;

  insert into public.notification_settings (user_id, push_paused, updated_at)
  values (v_uid, p_paused, now())
  on conflict (user_id) do update
    set push_paused = excluded.push_paused,
        updated_at  = now();
end;
$$;

grant execute on function public.set_push_paused(boolean) to authenticated;

-- ============================================================
-- 7. PATCH drain_pending_push_groups — honor per-category push prefs + master pause
-- ============================================================
-- Before each pg_net POST, check category_enabled_for(recipient, category, 'push').
-- Disabled = silently drop the queue row (already deleted by the atomic claim) and
-- skip the POST. Inbox row landed independently via the notifications INSERT, so
-- the user still sees it in-app — only the push banner is suppressed.
create or replace function public.drain_pending_push_groups()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url constant text := 'https://jimftynwrinwenonjrlj.supabase.co/functions/v1/send-push';
  v_token text;
  v_row record;
  v_record jsonb;
  v_type text;
  v_category text;
  v_recipient uuid;
begin
  select decrypted_secret into v_token
    from vault.decrypted_secrets
    where name = 'dream_queue_worker_token';

  if v_token is null then
    raise notice 'drain_pending_push_groups: vault.dream_queue_worker_token missing — skipping drain';
    return;
  end if;

  for v_row in
    with claimed as (
      select recipient_id, group_key, latest_notification_id
      from public.pending_push_groups
      where fire_at <= now()
      order by fire_at
      limit 100
      for update skip locked
    )
    delete from public.pending_push_groups p
    using claimed c
    where p.recipient_id = c.recipient_id and p.group_key = c.group_key
    returning c.recipient_id, c.group_key, c.latest_notification_id
  loop
    select to_jsonb(n), n.type, n.recipient_id
      into v_record, v_type, v_recipient
      from public.notifications n
      where n.id = v_row.latest_notification_id;

    if v_record is null then
      -- Underlying notification deleted between enqueue + drain — skip.
      continue;
    end if;

    -- Phase 3: honor per-category push pref + D10 master pause.
    v_category := public.notification_category(v_type);
    if not public.category_enabled_for(v_recipient, v_category, 'push') then
      -- Push disabled for this category (or master paused). Drop silently —
      -- the queue row is already gone, the inbox row stays.
      continue;
    end if;

    perform net.http_post(
      url := v_url,
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || v_token,
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', 'notifications',
        'record', v_record,
        'aggregated', true,
        'group_key', v_row.group_key
      )
    );
  end loop;
end;
$$;

comment on function public.drain_pending_push_groups is
  'pg_cron tick. Claims due rows from pending_push_groups + POSTs one aggregated push per group. Honors notification_preferences (push channel + push_paused master). Migration 205.';

-- ============================================================
-- 8. PATCH get_inbox — filter by category_enabled_for(..., 'inbox')
-- ============================================================
-- A disabled inbox category disappears from the feed entirely. Re-enabling it
-- instantly resurfaces past events (no replay needed) since notification rows
-- were never filtered at write time. D8 ensures Your-dreams inbox can never
-- actually be disabled, so users always see their own creations.
create or replace function public.get_inbox(
  p_user_id  uuid,
  p_limit    integer default 20,
  p_offset   integer default 0
)
returns table(
  group_key             text,
  type                  text,
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
    -- All this recipient's notifications, filtered by per-category inbox pref.
    -- Filter happens at the source CTE so it cascades through grouped/previews.
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
        (array_agg(m.upload_id   order by m.created_at desc))[1] as upload_id,
        (array_agg(m.comment_id  order by m.created_at desc))[1] as comment_id,
        (array_agg(m.body        order by m.created_at desc))[1] as body
      from mine m
      group by m.group_key
    )
  select
    g.group_key,
    g.type,
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

-- ============================================================
-- 9. PATCH get_unread_group_count — same inbox filter as get_inbox
-- ============================================================
-- Otherwise the badge counts groups the user has hidden from their inbox,
-- forever stuck at "you have unread" with no way to clear them.
create or replace function public.get_unread_group_count(p_user_id uuid)
returns integer
language sql stable security definer
set search_path = ''
as $$
  select count(distinct n.group_key)::int
  from public.notifications n
  where n.recipient_id = p_user_id
    and n.seen_at is null
    and public.category_enabled_for(
          p_user_id,
          public.notification_category(n.type),
          'inbox'
        );
$$;

grant execute on function public.get_unread_group_count(uuid) to authenticated;
