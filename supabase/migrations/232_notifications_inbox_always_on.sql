-- Migration 232: Notifications settings simplified to push-only (inbox always on)
--
-- The Settings → Notifications screen dropped the per-category INBOX column —
-- the in-app inbox now always receives every category (you manage it by
-- clearing rows, not prefs). Per-category control is push-only.
--
-- Existing users who turned an inbox category OFF in the old Push×Inbox grid
-- would otherwise be stranded: the category would stay hidden from their inbox
-- with no UI to restore it. Clear those inbox opt-outs so the new
-- "inbox always on" invariant holds for everyone.
--
-- Scoped to channel = 'inbox' — push prefs are untouched. No schema/RPC change:
-- get_inbox + the unread-badge RPCs already honor prefs, so with zero inbox
-- opt-outs every category surfaces. Server-side inbox-channel SUPPORT is left
-- in place (future cleanup); we simply stop writing inbox opt-outs from the UI.

DELETE FROM public.notification_preferences WHERE channel = 'inbox';
