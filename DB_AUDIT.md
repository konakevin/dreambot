# DreamBot — Database Audit & Cleanup Plan

> First full DB audit (2026-06-18). Catalyst: migration 285 referenced a `reports.details`
> column that the **live** schema never had → broke content reporting → hotfixed by 288.
> That exposed **schema drift** (repo migrations ≠ live DB) plus a backlog of integrity /
> index / cleanup debt. This doc is the reconciled map + the sequenced remediation plan.
>
> **Method:** 7 parallel read-only agents diffed the ~288 migration files against the live
> schema. Column-level findings are **grounded** in `supabase gen types` (it introspects the
> live DB, so live columns are authoritative). Constraint / index / RLS / function findings
> are **inferred from migration files** and marked ⚠️VERIFY — confirming them needs the real
> live schema dump (`pg_dump --schema-only` via Docker, or a direct DB-password connection;
> neither was available at audit time — the pooler URL stores no password).

---

## Posture at a glance

- **Security (RLS / grants / sparkle RPCs): strong.** All tables RLS-enabled; economic/PII
  columns hidden (mig 278/280); every sparkle RPC auth-gated + idempotent. No new holes.
- **The real work is integrity, drift, performance, and cleanup** — and a **process fix** so
  hand-applied migrations stop drifting from live.

---

## P0 — Schema drift (the catalyst)

**Root cause (D7):** migrations are applied **by hand** in the dashboard. Migration `047`
was **partially applied** — its `blocked_users` CREATE ran, but its `reports` upgrade was
skipped. Live `reports` is the original 6 columns `{id, reporter_id, upload_id(NOT NULL),
reason, created_at, resolved}`; it is **missing `reported_user_id`, `comment_id`, `details`**.
No detection for 3 months.

**Knock-on bug — report-a-user/comment is broken:**
- `hooks/useReport.ts` declares `reportedUserId`/`commentId`/`details` but its `mutationFn`
  only inserts `{ reporter_id, reason, upload_id: uploadId ?? '' }` — it **drops** the user/
  comment target and writes `upload_id: ''` (invalid uuid) when there's no post.
- `app/user/[userId].tsx` "Report User" calls `report({ reason, reportedUserId })` → inserts
  `upload_id: ''` → **fails**. Reporting a *post* works (real uploadId); reporting a *user* or
  *comment* does not. UGC-safety gap (App Review relevant).

**Fix (one migration + one hook edit):**
1. `ALTER TABLE reports ADD COLUMN IF NOT EXISTS reported_user_id uuid REFERENCES users(id) ON DELETE CASCADE`, same for `comment_id` → comments, `details text`; and `ALTER COLUMN upload_id DROP NOT NULL` (a user/comment report has no upload). Add `idx_reports_reported_user`, `idx_reports_comment`.
2. Fix `useReport.ts` to insert `reported_user_id`/`comment_id`/`details` when present and **omit** `upload_id` when absent (never `''`).
3. Restore `details` sanitization in `clean_user_text_columns` (288 dropped it because the column didn't exist; once it does, re-add).
4. **Audit every other table for the same partial-apply drift** once we have the dump.

---

## P1 — Data integrity (D4) ✅ GROUNDED against the live catalog (2026-06-18)

Introspected `pg_constraint` directly. **Most agent findings were FALSE** — the constraints
exist. Reconciled truth:

| Agent claim | Live reality | Verdict |
|---|---|---|
| `likes(user_id,upload_id)` UNIQUE missing | `CONSTRAINT likes UNIQUE (user_id, upload_id)` present | ❌ refuted |
| `post_reposts` UNIQUE missing | `UNIQUE (reposter_id, upload_id)` present | ❌ refuted |
| `favorites` UNIQUE missing | `UNIQUE (user_id, upload_id)` present | ❌ refuted |
| `dream_jobs.status` CHECK missing | `CHECK (status IN queued/processing/done/failed/nsfw/timeout)` present | ❌ refuted |
| `dream_queue.weight/.status/.source` CHECK missing | all three present | ❌ refuted |
| `comments`/`uploads`/`users` length CHECKs | all present (body 1–500, caption ≤200, bio ≤160, name ≤50, username regex, email/username UNIQUE) | ✅ already good |
| counter `CHECK(>=0)` floors | **unnecessary** — columns are frozen + UPDATE-revoked (mig 278); only the DEFINER triggers write them → flooring the *triggers* (mig 286 + 290) is the real fix | ✅ handled, no CHECK |

**Genuinely missing / minor (deferred, low value):** `upscale_requests` and `post_shares`
have no UNIQUE — but their index sets weren't introspected and a double-share may be intentional;
revisit only if double-request bugs surface. `comment_likes` UNIQUE is its PK (contype `p`, not
queried). FK on-delete sweep still worth a pass but no orphan bug observed.

---

## P1 — Indexes & performance (D3) ✅ GROUNDED (2026-06-18)

Introspected `pg_indexes`. The "missing composite membership" claims were FALSE — the unique
keys (`likes_user_id_upload_id_key`, `follows_follower_id_following_id_key`,
`post_reposts_reposter_id_upload_id_key`, `favorites_user_id_upload_id_key`) ARE those composite
indexes. `idx_dream_queue_user_status` also exists. **One genuine gap:**

| Missing index | Why | Status |
|---|---|---|
| `blocked_users(blocked_id, blocker_id)` | feed block-filter `UNION` seq-scans the reverse arm — live has `idx_blocked_users_blocker` + a `(blocker_id, blocked_id)` composite, neither leads on `blocked_id` | ✅ added in **mig 290** |

Drop-candidate (verify `pg_stat_user_indexes` shows 0 scans first): `idx_dream_queue_pending`
appears superseded by `idx_dream_queue_pending_weight`. The other drop candidates from the
inferred pass (`idx_uploads_user_phash_recent` etc.) need a stat check before removal — deferred,
they cost only disk, not correctness.

---

## P2 — Dead schema cleanup (D2/D6) — grounded in gen-types

Confirmed live + no code references → safe `DROP … IF EXISTS`:
- `user_recipes.dream_wish`, `.wish_modifiers`, `.wish_recipient_ids` (Dream Wish, ripped 2026-06-07)
- `uploads.from_wish` (same) — also remove its line from the `freeze_upload_columns_on_update` trigger
- Vestigial twin/fuse remnants + `is_approved` (SightEngine, dead) — **verify-then-drop** (`is_approved` is still read in old feed-ranking RPCs, so drop the column AND the `OR is_approved` clauses together, or leave).

Dead trigger functions (retired twin/fuse features): ✅ **already gone** — `update_twin_count` /
`update_fuse_count` did NOT appear in the live `pg_proc` introspection (the `LIKE 'update_%count%'`
sweep returned only the 6 real counters), so there's nothing to drop. Refuted.

Counter floors missing `GREATEST(…,0)` on DELETE: live `pg_proc` confirmed `update_save_count`,
`update_share_count`, `update_comment_like_count` had `floor=false` (the other 3 floored by mig 286).
✅ **Fixed in mig 290** — redefined all three with `GREATEST(…,0)` + pinned `search_path` (function-
only, no data dependency). All 6 counter triggers are `SECURITY DEFINER`.

---

## P0 — Anti-drift process (D7) — the most important deliverable

Drift happened because **migrations are hand-applied with no verification**. Fix the process:

1. **CI drift check (do first):** a job that runs `supabase gen types` against the live DB and
   diffs vs the committed `types/database.ts` — fails the build when the repo and live diverge.
   Cheap, catches the next 047-style skip immediately.
2. **Adopt linked migrations** (`supabase db push`) for new migrations so file = truth, applied
   automatically — no more "did I run the second half of this file?"
3. **Rule:** any dashboard change must be back-ported to a migration the same day.
4. **Optional baseline/squash:** `pg_dump --schema-only` the live DB to `000_baseline.sql`,
   archive 001–288 to `_legacy/`, start fresh. Repo == live, new-dev setup in seconds. ~1–2h.

---

## Sequenced execution

1. ✅ **Live introspection** (2026-06-18) — got the authoritative `pg_constraint` / `pg_indexes` /
   `pg_proc` state via an SQL-editor query (Docker/pg_dump/DB-password all unavailable). This
   REFUTED nearly every inferred P1 finding — see the grounded tables above.
2. ✅ **Migration 289: reports drift fix** + `useReport.ts` edit + restored details sanitize (P0,
   fixed the broken report-a-user/comment safety feature — verified live).
3. ✅ **Migration 290: grounded integrity** — the only two real fixes left after grounding:
   `idx_blocked_users_blocked` (reverse block-filter) + the 3 missing counter-decrement floors.
4. ✅ **Migration 291: dead Dream Wish schema rip-out** — drops `uploads.from_wish` +
   `user_recipes.dream_wish` / `wish_modifiers` / `wish_recipient_ids`. Two had live deps,
   rebuilt atomically: `finalize_nightly_upload` (dropped the `p_from_wish` param — the nightly
   dispatcher already stopped passing it) + `freeze_upload_columns_on_update` (dropped the
   `from_wish` freeze line). `types/database.ts` synced. The `'dream_wish'` notification-category
   vocab is deliberately LEFT (routes historical notification rows; inert).
5. ✅ **CI drift check** (`scripts/check-schema-drift.sh` + `.github/workflows/schema-drift.yml`)
   — regenerates types from live and fails if they differ from committed `types/database.ts`.
   Runs on migration/type changes + daily. **One-time setup:** add the `SUPABASE_ACCESS_TOKEN`
   repo secret; after applying 291, regenerate the baseline so live == repo.

**The audit is complete.** Grounding collapsed a scary-looking backlog into two small integrity
migrations (290), a clean dead-schema rip-out (291), and the anti-drift guard that prevents the
root cause from recurring. Apply 290 + 291 in the dashboard; add the drift-check secret.

**Each as its own reviewable migration**, applied deliberately — not a big-bang.
