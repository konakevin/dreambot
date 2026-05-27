-- Migration 196: fire send-push on every notifications INSERT
--
-- The send-push Edge Function (a complete Expo push sender) has existed for the
-- whole app lifetime but had ZERO callers — no Database Webhook, no trigger.
-- So NO push banner ever fired for ANY notification type (dreams, comments,
-- likes, follows, shares...). Notifications only ever showed in the in-app
-- inbox. DREAMBOT.md claimed a dashboard webhook existed; it does not (or was
-- lost, exactly like the dream-queue-worker cron was before migration 193).
-- Versioning the trigger here so it can't silently disappear again.
--
-- send-push parses a Supabase Database Webhook shape: { type, table, record }.
-- This trigger reproduces that shape via pg_net so the function is unchanged.
-- pg_net is fire-and-forget: a push-send failure can never roll back the
-- notification row (the in-app inbox entry must persist regardless).
--
-- AUTH: send-push now validates `Authorization: Bearer <DREAM_QUEUE_WORKER_TOKEN>`
-- (see supabase/functions/send-push/index.ts). We reuse the existing Vault
-- secret + edge secret from migration 193 (already in sync) rather than minting
-- a new one. If the Vault secret 'dream_queue_worker_token' is ever rotated,
-- rotate the DREAM_QUEUE_WORKER_TOKEN edge secret to match or push will 401.
--
-- ── DASHBOARD DEDUP CHECK — DO BEFORE RUNNING ──
-- Confirm NO existing Database Webhook on `notifications` (it would DOUBLE-SEND):
--   Dashboard -> Database -> Webhooks  (delete any on `notifications`)
--   select tgname from pg_trigger where tgrelid = 'public.notifications'::regclass;
--   select * from supabase_functions.hooks;   -- legacy webhook storage, if present
-- The repo trigger below is the versioned source of truth.

create extension if not exists pg_net;

create or replace function public.notify_send_push()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token text;
begin
  select decrypted_secret into v_token
    from vault.decrypted_secrets
    where name = 'dream_queue_worker_token';

  perform net.http_post(
    url := 'https://jimftynwrinwenonjrlj.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || coalesce(v_token, ''),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'notifications',
      'record', to_jsonb(NEW)
    )
  );
  return NEW;
end;
$$;

-- Idempotent: drop any prior trigger before (re)creating.
drop trigger if exists trg_notify_send_push on public.notifications;

create trigger trg_notify_send_push
  after insert on public.notifications
  for each row
  execute function public.notify_send_push();

comment on function public.notify_send_push is
  'Fires the send-push Edge Function (Expo push) on every notifications INSERT via pg_net. Migration 196 — replaces the missing/lost Database Webhook. Fire-and-forget: push failure never rolls back the inbox row.';
