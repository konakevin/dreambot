-- 500_nightly_look_enabled_big_head_reserved.sql — Kevin 2026-09-12: "keep the approved bighead entries, but push
-- them out to the create screen … let's not use the big head looks in nightly, but save the approved looks for
-- future use as a 'big head' medium in create later."
--
-- `nightly_enabled` is the explicit "may nightly roll this look" switch, separate from is_active (row exists / can be
-- forced for QA) and from the per-model approvals (the graded evidence, which stays for the Create day). The
-- nightly resolver's loader passes only rows with nightly_enabled = true; a reserved look keeps its approvals rows.
ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS nightly_enabled boolean NOT NULL DEFAULT true;
UPDATE public.dream_mediums
   SET nightly_enabled = false,
       client_meta = COALESCE(client_meta, '{}'::jsonb) || '{"reserved_for":"create","reserved_note":"Big Head: approved couple+solo on grok and gemini, couple on flux (2026-09-12 matrix); reserved for a future Create medium, excluded from nightly per Kevin"}'::jsonb
 WHERE key = 'nightly_big_head';
