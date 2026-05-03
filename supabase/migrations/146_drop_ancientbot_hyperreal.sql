-- 146 — Drop ancientbot_hyperreal medium row.
--
-- AncientBot was completely removed from the system 2026-05-03 (user
-- account, all uploads, code, seeds, gen scripts, workflow). Migration
-- 145 added two bot-only mediums (ancientbot_hyperreal + starbot_hyperreal).
-- The ancientbot one is now orphaned — drop it.
-- The starbot_hyperreal medium remains active.

DELETE FROM public.dream_mediums WHERE key = 'ancientbot_hyperreal';
