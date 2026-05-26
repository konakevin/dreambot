-- 193_schedule_dream_queue_worker.sql
--
-- Wire the dream-queue-worker to run on a schedule via pg_cron + pg_net.
--
-- The worker had been DORMANT since 2026-05-10 — its trigger lived only in the
-- Supabase dashboard (not the repo) and was lost. The nightly-dreams migration
-- (192 + commit bb730eae) makes the queue live: the GH Actions cron ENQUEUES one
-- job per eligible user and the worker DRAINS them. So this trigger is now
-- load-bearing — without it, nightly dreams never render. Versioning it here so
-- it can't silently disappear again.
--
-- ── ONE-TIME PREREQUISITE (run BEFORE this migration, in the SQL editor) ──
-- Store the worker token in Vault so it never lands in git. Use the SAME value
-- as the DREAM_QUEUE_WORKER_TOKEN edge-function secret:
--
--   select vault.create_secret(
--     '<DREAM_QUEUE_WORKER_TOKEN value>',
--     'dream_queue_worker_token'
--   );
--
-- (If the cron is scheduled before the secret exists, the POSTs will 401 until
-- you add it — the schedule itself still succeeds.)
--
-- Cadence: every minute. MAX_JOBS_PER_TICK=10 per tick + overlapping ticks
-- (SKIP LOCKED) drain the nightly burst; tighten to '30 seconds' or raise
-- MAX_JOBS_PER_TICK if drain latency matters as the user base grows.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Idempotent: drop any prior schedule with this name before (re)creating.
select cron.unschedule('dream-queue-worker')
where exists (select 1 from cron.job where jobname = 'dream-queue-worker');

select cron.schedule(
  'dream-queue-worker',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://jimftynwrinwenonjrlj.supabase.co/functions/v1/dream-queue-worker',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'dream_queue_worker_token'
      ),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
