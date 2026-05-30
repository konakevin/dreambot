-- Migration 204: push debounce — collapse a burst of group-mate notifications
-- into ONE aggregated push instead of one push per row.
--
-- Phase 2 of NOTIFICATIONS_ARCHITECTURE.md §4g.
--
-- Today: trg_notify_send_push (migration 196) fires send-push DIRECTLY on every
-- notifications INSERT. 14 likes on the same post → 14 pushes. Brutal.
--
-- This migration:
--   1. Adds public.pending_push_groups — a per-(recipient, group_key) queue row.
--   2. Replaces notify_send_push() to ENQUEUE into that table instead of
--      hitting net.http_post directly. Insert sets fire_at = now() + 30s;
--      a follow-up row in the same group slides fire_at forward, capped at
--      original_created_at + 2 min so the user is guaranteed a ping inside
--      that window even if the burst never lets up.
--   3. Adds drain_pending_push_groups() — claims due rows (SELECT FOR UPDATE
--      SKIP LOCKED + atomic DELETE RETURNING) and POSTs one send-push request
--      per group with an `aggregated: true` flag. The send-push function
--      computes the per-type "Alice and 12 others …" copy from the group's
--      current state at send time.
--   4. Schedules a pg_cron job to call drain_pending_push_groups() every
--      minute (sub-minute schedules aren't enabled in this project's pg_cron
--      build — see commit log for the switch). With debounce=30s and
--      cadence=60s, worst-case push delivery latency is ~90s.
--
-- Trigger swap is backward-compatible — the existing send-push function still
-- works with non-aggregated payloads (Phase 1 callers), and we keep the same
-- trigger name (trg_notify_send_push) so revert = restore migration 196's
-- function body.
--
-- ── PREREQUISITE ──
-- vault.decrypted_secrets must contain 'dream_queue_worker_token' (already set
-- for migrations 193 + 196 + 197 — no new secret needed). Same edge secret
-- DREAM_QUEUE_WORKER_TOKEN must remain in sync (send-push validates it).

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 1) Queue table — one row per (recipient, group_key) being debounced.
create table if not exists public.pending_push_groups (
  recipient_id uuid not null references public.users(id) on delete cascade,
  group_key text not null,
  latest_notification_id uuid not null references public.notifications(id) on delete cascade,
  fire_at timestamptz not null,
  original_created_at timestamptz not null default now(),
  primary key (recipient_id, group_key)
);

create index if not exists idx_pending_push_groups_fire_at
  on public.pending_push_groups(fire_at);

alter table public.pending_push_groups enable row level security;
-- No policies = service-role only. Triggers + workers are SECURITY DEFINER
-- so they bypass RLS; nothing on the client touches this table.

comment on table public.pending_push_groups is
  'Push debounce queue. One row per (recipient_id, group_key) being aggregated. Drained by drain_pending_push_groups() via pg_cron — migration 204.';

-- 2) Replace notify_send_push() — was fire-and-forget POST to send-push;
-- now enqueues / extends the debounce window for this notification's group.
create or replace function public.notify_send_push()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_debounce constant interval := interval '30 seconds';
  v_max_delay constant interval := interval '2 minutes';
begin
  -- Self-events (recipient == actor) still go through aggregation by group_key;
  -- the send-push function decides whether to suppress them (today: most
  -- self-event types are inserted with actor_id = recipient_id which the
  -- existing send-push filter already drops in dedupe).
  --
  -- group_key is set by the BEFORE INSERT trigger in migration 201, so it's
  -- present here. If it ever comes through NULL (shouldn't), short-circuit
  -- by treating the notification id as its own singleton group to keep push
  -- delivery for that row, rather than dropping silently.
  insert into public.pending_push_groups
    (recipient_id, group_key, latest_notification_id, fire_at, original_created_at)
  values (
    NEW.recipient_id,
    coalesce(NEW.group_key, 'singleton:' || NEW.id::text),
    NEW.id,
    now() + v_debounce,
    now()
  )
  on conflict (recipient_id, group_key) do update
    set fire_at = least(
          now() + v_debounce,
          public.pending_push_groups.original_created_at + v_max_delay
        ),
        latest_notification_id = excluded.latest_notification_id;
  return NEW;
end;
$$;

comment on function public.notify_send_push is
  'BEFORE→AFTER INSERT trigger on notifications. Enqueues into pending_push_groups instead of firing send-push directly (Phase 2 debounce). Replaces migration 196.';

-- (trigger trg_notify_send_push from migration 196 stays as-is — same function name.)

-- 3) Drain function — pg_cron tick. Claims due rows + dispatches one
-- aggregated push per group. Uses pg_net (fire-and-forget HTTP).
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
begin
  select decrypted_secret into v_token
    from vault.decrypted_secrets
    where name = 'dream_queue_worker_token';

  if v_token is null then
    -- No token = a 401 on every POST. Bail loudly via the postgres log
    -- (NOTICE shows up in Supabase logs); we don't drain anything so rows
    -- queue up safely until the token is set.
    raise notice 'drain_pending_push_groups: vault.dream_queue_worker_token missing — skipping drain';
    return;
  end if;

  -- Claim + delete atomically. SKIP LOCKED so two overlapping cron ticks
  -- can't double-fire. LIMIT 100 caps the per-tick blast radius.
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
    -- Build the payload: send-push expects `{ type, table, record }` from
    -- migration 196. We add `aggregated: true` so it knows to compute
    -- per-type group copy from the group's current state instead of
    -- single-actor copy. The record is the LATEST notification in the
    -- group (its actor + body anchor the push title/body).
    select to_jsonb(n) into v_record
      from public.notifications n
      where n.id = v_row.latest_notification_id;

    if v_record is null then
      -- The latest notification was deleted between enqueue and drain — skip.
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
  'pg_cron tick. Claims due rows from pending_push_groups + POSTs one aggregated push per group via send-push. Migration 204.';

-- 4) Schedule. Cadence = 1 min (sub-minute schedules require pg_cron 1.5+
-- with sub-minute interval support enabled at the cluster level — not yet
-- on for this project). Worst-case push latency: debounce(30s) + cadence(60s)
-- = ~90s after a burst settles. Tighten by switching to '30 seconds' once
-- enabled.
select cron.unschedule('drain-pending-push-groups')
where exists (select 1 from cron.job where jobname = 'drain-pending-push-groups');

select cron.schedule(
  'drain-pending-push-groups',
  '* * * * *',
  $$ select public.drain_pending_push_groups(); $$
);
