-- Migration 198: drop the now-unused allow_upscale_notify RPC.
--
-- Made vestigial when on-demand HD upscales switched to "notify EVERY requester
-- on completion" (upscale-image now inserts upscale_requests with
-- notified_at = NULL). The old design (migration 191) suppressed the push by
-- default (notified_at = now()) and used allow_upscale_notify() to re-enable it
-- when the user dismissed/timed-out the modal — but a KILLED app never sent that
-- signal, so it silently dropped the completion ping for anyone who closed the
-- app mid-upscale. The client caller was removed; this drops the dead function.
--
-- request_dream_notification (same migration 191) is still live (the loading-
-- screen "Queue This" opt-in) and is intentionally left in place.

DROP FUNCTION IF EXISTS public.allow_upscale_notify(uuid);
