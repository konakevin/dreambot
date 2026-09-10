-- Architect security audit (2026-09-10), S3 finding 1 (CRITICAL) + finding 5 (HIGH).
--
-- The "Dream Off" party-game feature (11 tables, ~17 functions) was applied by hand
-- via the SQL editor and never went through supabase/migrations/ — it's schema drift,
-- confirmed via pg_proc/pg_class against the live DB, not present in any prior
-- migration file. Because it skipped every security-hardening pass the rest of the
-- schema went through, it shipped with real holes:
--   - dream_off_credit: SECURITY DEFINER, granted to `anon`, ZERO auth check. A fresh
--     random p_reference_id each call mints unlimited sparkles to any account with
--     nothing but the public anon key — full compromise of the sparkle economy,
--     no login required.
--   - dream_off_create_entry / dream_off_attach_render / dream_off_forfeit_entry /
--     dream_off_refund_entry / dream_off_submit_entry: all trust a caller-supplied
--     p_author_id/p_user_id with no ownership check (auth.uid() is never read),
--     letting one player hijack or wipe another player's contest entry, or submit
--     pot-funded content "as" someone else.
--
-- Kevin confirmed (2026-09-10): Dream Off is not a live feature and has no client-
-- side code anywhere (app/, components/, hooks/, lib/, store/ — grepped, zero
-- references; it was never wired into the RN app). It's on the back burner —
-- no ETA on if/when it comes back. Rather than reverse-engineer the full game-flow
-- to safely rewrite each RPC's identity model now, the correct move for a dormant
-- feature is to fully lock it down: revoke client EXECUTE on every dream_off_*
-- function (and its maybe_advance_dream_off helper) and flip the master
-- kill-switch. This closes every finding in this family at once.
--
-- NOT dropping the functions/tables — only revoking client reachability — this is
-- the DB-level equivalent of "commented out": the code stays intact, unreachable,
-- for whenever (if ever) this gets picked back up. At that point each RPC still
-- needs a real auth.uid()-based ownership rewrite (mirroring the correct pattern
-- already used by dream_off_donate/dream_off_fund_pot in this same function
-- family, which both derive the actor from auth.uid() rather than trusting an
-- argument) before re-granting anything.

revoke execute on function public.dream_off_attach_render(uuid, uuid, uuid, text) from anon, authenticated;
revoke execute on function public.dream_off_clean_topic() from anon, authenticated;
revoke execute on function public.dream_off_create_entry(uuid, uuid, uuid) from anon, authenticated;
revoke execute on function public.dream_off_credit(uuid, integer, text, uuid) from anon, authenticated;
revoke execute on function public.dream_off_donate(uuid, integer, uuid) from anon, authenticated;
revoke execute on function public.dream_off_fail_entry(uuid, uuid) from anon, authenticated;
revoke execute on function public.dream_off_forfeit_entry(uuid, uuid) from anon, authenticated;
revoke execute on function public.dream_off_fund_pot(uuid, integer, uuid) from anon, authenticated;
revoke execute on function public.dream_off_gen_invite_code() from anon, authenticated;
revoke execute on function public.dream_off_refund_entry(uuid, uuid) from anon, authenticated;
revoke execute on function public.dream_off_send_nudges() from anon, authenticated;
revoke execute on function public.dream_off_settle_pot(uuid) from anon, authenticated;
revoke execute on function public.dream_off_setup_pot(uuid, text) from anon, authenticated;
revoke execute on function public.dream_off_stuck_count() from anon, authenticated;
revoke execute on function public.dream_off_submit_entry(uuid, uuid, uuid, text) from anon, authenticated;
revoke execute on function public.dream_off_votes_no_self_vote() from anon, authenticated;
revoke execute on function public.maybe_advance_dream_off(uuid, boolean, text) from anon, authenticated;

-- Master kill-switch, defense in depth (some of the above ALSO check this, but
-- dream_off_credit/create_entry/attach_render/forfeit_entry/refund_entry never did —
-- the REVOKEs above are what actually closes those; this just makes intent explicit
-- and stops the config-gated call sites too).
update public.engine_config set dream_off_enabled = false where id = 1;
