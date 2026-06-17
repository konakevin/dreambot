-- Migration 273: dream_forensics — stitch a failed render back together by jobId.
--
-- A "dream failed" push carries notifications.reference_id (= the job UUID,
-- migration 268). Today reconstructing what happened means hand-joining 5 tables.
-- These RPCs do it in one call, keyed on that UUID:
--
--   dream_forensics(job_id)            → one jsonb blob: queue row (incl. the
--                                        migration-272 current_stage/model
--                                        breadcrumbs), dream_jobs row, every
--                                        ai_generation_log row, the sparkle
--                                        charge+refund ledger, and the failure
--                                        notification (its created_at = when the
--                                        push actually fired, which lags the real
--                                        failure by the retry backoff).
--   dream_forensics_recent(user, hrs)  → the everyday entry point: every recent
--                                        dream_failed notification for a user,
--                                        each already stitched. "I got a push" →
--                                        run this → see the whole story.
--
-- SECURITY DEFINER + EXECUTE restricted to service_role: these read across all
-- users, so they're admin/SQL-editor tools, never exposed to a client JWT.

CREATE OR REPLACE FUNCTION public.dream_forensics(p_job_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'job_id', p_job_id,
    'queue', (
      SELECT to_jsonb(q) FROM (
        SELECT id, user_id, source, status, weight, current_stage, stage_updated_at,
               model, last_error, attempt_count, worker_id,
               created_at, started_at, completed_at, upload_id, payload
        FROM dream_queue WHERE id = p_job_id
      ) q
    ),
    'job', (
      SELECT to_jsonb(j) FROM (
        SELECT id, user_id, status, error, attempt_count,
               result_medium, result_vibe, upload_id, created_at, completed_at
        FROM dream_jobs WHERE id = p_job_id
      ) j
    ),
    'ai_log', (
      SELECT jsonb_agg(to_jsonb(a) ORDER BY a.created_at) FROM (
        SELECT id, status, model_used, error_message, rolled_axes, fallback_reasons,
               replicate_prediction_id, sonnet_brief, vision_description,
               enhanced_prompt, cost_cents, created_at
        FROM ai_generation_log WHERE job_id = p_job_id
      ) a
    ),
    'sparkles', (
      SELECT jsonb_agg(to_jsonb(s) ORDER BY s.created_at) FROM (
        SELECT amount, reason, balance_after, created_at
        FROM sparkle_transactions WHERE reference_id = p_job_id
      ) s
    ),
    'notifications', (
      SELECT jsonb_agg(to_jsonb(n) ORDER BY n.pushed_at) FROM (
        SELECT type, subtype, body, created_at AS pushed_at, seen_at
        FROM notifications WHERE reference_id = p_job_id
      ) n
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.dream_forensics_recent(p_user_id uuid, p_hours int DEFAULT 24)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_agg(row ORDER BY (row->>'pushed_at') DESC), '[]'::jsonb)
  FROM (
    SELECT jsonb_build_object(
      'pushed_at', n.created_at,
      'subtype', n.subtype,
      'body', n.body,
      'job_id', n.reference_id,
      'forensics', CASE WHEN n.reference_id IS NOT NULL
                        THEN public.dream_forensics(n.reference_id)
                        ELSE NULL END
    ) AS row
    FROM notifications n
    WHERE n.recipient_id = p_user_id
      AND n.type = 'dream_failed'
      AND n.created_at >= now() - make_interval(hours => p_hours)
  ) sub;
$$;

REVOKE EXECUTE ON FUNCTION public.dream_forensics(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.dream_forensics_recent(uuid, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dream_forensics(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.dream_forensics_recent(uuid, int) TO service_role;
