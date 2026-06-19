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

## P1 — Data integrity (D4) ⚠️VERIFY against the dump

Adding a UNIQUE/CHECK fails if existing data violates it, so each needs a pre-check (or
`ADD … NOT VALID` then `VALIDATE`). Candidates (confirm present-or-missing on live first):

| Gap | Table | Risk | Fix |
|---|---|---|---|
| UNIQUE missing? | `likes(user_id,upload_id)` | double-like → 2× count + 2× push | `CREATE UNIQUE INDEX IF NOT EXISTS … ` after dedupe |
| UNIQUE missing? | `upscale_requests(user_id,upload_id)` | double HD request | same |
| UNIQUE missing? | `post_shares(sender_id,receiver_id,upload_id)` | double share | same |
| CHECK missing | `dream_jobs.status`, `upscale_jobs.status`, `dream_queue.weight` | invalid status stored | `ADD CONSTRAINT … CHECK (… IN (…))` |
| floor (`>=0`) | `users.sparkle_balance`, `uploads.*_count`, `comments.*_count` | negative via direct UPDATE (freeze-trigger guards economic ones, but counters not) | `ADD CONSTRAINT … CHECK (col >= 0)` |
| FK on-delete | sweep all FKs for orphan-causing (no FK) vs over-cascade | data orphans / surprise deletes | per-FK fix |

> Note: `dream_queue.dedup_key` UNIQUE (idempotency) + the `sparkle_transactions` grant-dedup
> partial index are **present** (mig 259/258) — those are good.

---

## P1 — Indexes & performance (D3) ⚠️VERIFY

`CREATE INDEX IF NOT EXISTS` is always safe (additive). Confirmed-good: all rate-limit count()
queries are indexed; queue-claim, notifications, ai_generation_log are indexed.

| Missing index | Why | DDL |
|---|---|---|
| `blocked_users(blocked_id)` (reverse) | feed block-filter `UNION` seq-scans the reverse arm (`blocker_id` is indexed, `blocked_id` is not) | `CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON blocked_users(blocked_id, blocker_id);` |
| `dream_queue(user_id,status)` partial | per-user in-flight cap check on every create | `… (user_id) WHERE status IN ('queued','in_progress');` |
| composite membership | `likes`/`follows`/`post_reposts`/`favorites` use two single-col indexes for a 2-col equality | `(user_id, upload_id)` etc. |

Drop **after `pg_stat_user_indexes` confirms 0 scans**: `idx_uploads_user_phash_recent`,
`idx_uploads_user_hash_recent`, `idx_uploads_view_count`, `idx_object_cards_name`,
`uploads_image_url_hq_present_idx`, and the superseded `idx_dream_queue_pending` (replaced by
`idx_dream_queue_pending_weight`, mig 265).

---

## P2 — Dead schema cleanup (D2/D6) — grounded in gen-types

Confirmed live + no code references → safe `DROP … IF EXISTS`:
- `user_recipes.dream_wish`, `.wish_modifiers`, `.wish_recipient_ids` (Dream Wish, ripped 2026-06-07)
- `uploads.from_wish` (same) — also remove its line from the `freeze_upload_columns_on_update` trigger
- Vestigial twin/fuse remnants + `is_approved` (SightEngine, dead) — **verify-then-drop** (`is_approved` is still read in old feed-ranking RPCs, so drop the column AND the `OR is_approved` clauses together, or leave).

Dead trigger functions (retired twin/fuse features): `update_twin_count`, `update_fuse_count`
are `SECURITY INVOKER` + missing `search_path` + no floor — but they fire on dropped columns,
so they're dead → **drop the triggers + functions** rather than fix.

Counter floors still missing `GREATEST(…,0)` on DELETE (minor drift risk): `update_save_count`,
`update_share_count`, `update_comment_like_count`. Redefine (function-only, no data dependency).

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

1. **Pull the authoritative live dump** (needs Docker running, or the DB password) — grounds P1.
2. **Migration: reports drift fix** + `useReport.ts` edit + restore details sanitize (P0, fixes a broken safety feature). *(Grounded now — does not need the dump.)*
3. **Migration: missing indexes** (P1, all `IF NOT EXISTS` — safe now; drop-unused waits for dump).
4. **Migration: integrity constraints** (P1 — needs dump + per-constraint data pre-check).
5. **Migration: dead-schema cleanup** (P2 — grounded in gen-types).
6. **CI drift check** (P0 process).

**Each as its own reviewable migration**, applied deliberately — not a big-bang.
