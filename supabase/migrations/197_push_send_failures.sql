-- Migration 197: audit table for SYSTEMIC push-send failures
--
-- send-push (the Expo push sender, fired by the migration 196 trigger) now
-- records failures it can't shrug off — non-ok HTTP from Expo (outage / bad
-- request), and ticket errors that are NOT routine stale tokens. Routine
-- DeviceNotRegistered errors are PRUNED (the dead push_tokens row is deleted),
-- NOT logged here, so this table stays a clean signal of real problems.
--
-- The push-failure CI monitor (scripts/check-push-failures.js +
-- .github/workflows/push-failure-monitor.yml) queries this table over a rolling
-- window and fails the workflow (loud GitHub email) when failures spike —
-- catching Expo outages, rate-limit storms, or a credentials/token-guard break.
--
-- net._http_response (pg_net's response log) can't be filtered to send-push, so
-- this app-written audit is the precise data source. Service-role only (no RLS
-- policy = clients get nothing; service role bypasses RLS).

create table if not exists public.push_send_failures (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid,
  notification_type text,
  error_kind text, -- 'http_<status>' | 'ticket_error'
  detail text,
  created_at timestamptz not null default now()
);

alter table public.push_send_failures enable row level security;

create index if not exists push_send_failures_created_idx
  on public.push_send_failures (created_at desc);

comment on table public.push_send_failures is
  'Systemic push-send failures recorded by the send-push Edge Function (migration 197). Excludes routine DeviceNotRegistered (those tokens are pruned). Read by the push-failure CI monitor. Service-role only.';
