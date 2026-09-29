-- 578_look_approvals_archive_rls.sql — turn on RLS for nightly_look_approvals_archive.
--
-- WHY. Migration 523 created this archive table without ENABLE ROW LEVEL SECURITY, so the default public-schema
-- grants let anyone with the anon key read, edit and delete its rows through PostgREST (Supabase security advisor
-- rls_disabled_in_public, emailed 2026-09-27). It holds the 50 look-approval rows 523 removed, kept so that grading
-- decision can be restored; nothing in the app, scripts or edge functions reads it, only 523's rollback SQL.
--
-- FIX. Same shape as its parent nightly_look_approvals (mig 498) and every other engine table: RLS on, no policies,
-- so only service_role (which bypasses RLS) can touch it. The explicit REVOKE removes the anon/authenticated table
-- grants as well, so the table stays closed even if RLS is ever switched off by mistake.
--
-- ROLLBACK: ALTER TABLE public.nightly_look_approvals_archive DISABLE ROW LEVEL SECURITY; (re-opens it; don't).

BEGIN;

ALTER TABLE public.nightly_look_approvals_archive ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.nightly_look_approvals_archive FROM anon, authenticated;

COMMIT;
