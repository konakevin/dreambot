-- Migration 195: make request_dream_notification race-proof (upsert form)
--
-- BUG: the loading-screen "Queue This" button is tappable at T=0
-- (app/dream/loading.tsx), but the dream_jobs row is inserted SERVER-SIDE
-- ~150-550ms into the request (generate-dream/index.ts, restyle-photo/index.ts,
-- after auth + a budget query). The old RPC was UPDATE-only:
--
--   UPDATE dream_jobs SET notify_on_complete=true WHERE id=p_job_id AND user_id=auth.uid();
--
-- An early tap UPDATEd 0 rows (the row didn't exist yet) and SILENTLY did
-- nothing -> notify_on_complete stayed false -> no completion notification.
-- Observed in the wild: a Create dream lost this race (no notification) while a
-- DLT tapped a beat later won it.
--
-- FIX: UPSERT. The client knows the jobId before the Edge call (it generates it
-- and passes it as the job row id), so the RPC can pre-create a minimal
-- dream_jobs row with notify_on_complete=true if the server hasn't inserted it
-- yet, or flip the flag on an existing row. The companion Edge-function change
-- makes the server-side insert non-clobbering (upsert ignoreDuplicates) so it
-- can't reset the flag back to false. Either race ordering now lands true.
--
-- SUPPRESSION PRESERVED: the flag only becomes true when the user actively taps
-- "Queue This" (the sole caller of this RPC). A user who WAITS on the loading
-- screen never calls it, so no row is pre-created with notify=true and the
-- server insert defaults notify_on_complete=false -> shouldSendCompletionNotification
-- (_shared/notify.ts) returns false -> no notification. Unchanged.

CREATE OR REPLACE FUNCTION public.request_dream_notification(p_job_id uuid)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$
  INSERT INTO public.dream_jobs (id, user_id, status, notify_on_complete)
  VALUES (p_job_id, auth.uid(), 'processing', true)
  ON CONFLICT (id) DO UPDATE
    SET notify_on_complete = true
    WHERE public.dream_jobs.user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.request_dream_notification(uuid) TO authenticated, service_role;

COMMENT ON FUNCTION public.request_dream_notification IS
  'Opt a queued dream into a dream_generated notification (set by the loading screen Queue button). Race-proof upsert (migration 195): pre-creates the dream_jobs row if the server has not inserted it yet, or flips the flag on the existing row, guarded to the caller''s own jobs. Default is no notification — a user who waits on the loading screen is not pinged.';
