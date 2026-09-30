# Backups: plan and status of record

**Read this first when resuming backup work.** It holds the goal, the "done when" checklist, the design, every
phase with its tasks and pass bars, the decisions Kevin owns, the risks, and a ledger. Update it in the same commit
as the work. Once the build is finished, the "How to restore" section becomes the runbook.

Kevin, 2026-09-29: "we need to make sure we have a fault tolerant backup system for our data ... so we always have a
rollback option if some catastrophe."

## Goal

Every piece of DreamBot data (users and logins, posts, dreams, seeds, bot configs, engine config, the image files)
has an off-site copy with another company, taken once a day, that we have PROVEN we can restore, and a restore can
bring back one table in minutes without taking the app down.

## Glossary (plain words)

- **Dump**: a file containing a copy of the database, made with `pg_dump` (Postgres's own export tool).
- **Snapshot**: a frozen view of the database at one instant, so a copy taken over several minutes is still
  consistent (no half-written changes).
- **Off-site**: stored with a different company than the live data, so one company's problem can't take out both.
- **Bucket lock**: an R2 setting that makes files undeletable for a set number of days, even by someone holding our
  keys.
- **Recovery point**: the most recent data you'd lose in a disaster. Daily backups = up to 1 day.
- **Restore drill**: an automatic test that restores the latest backup into a throwaway database and checks that
  everything came back.

## Where we are today (measured 2026-09-29)

| What                                      | Size                                                                | Protected today?                                  |
| ----------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| Database (all tables)                     | 4.9 GB, of which `ai_generation_log` is 3.6 GB (a 30-day debug log) | Supabase nightly backup, 7 days, **same project** |
| `uploads` bucket (dream images)           | 70 GB, 153,414 files, growing ~15 GB/month                          | **No**                                            |
| `cast-photos` bucket (users' face photos) | 105 MB, 75 files                                                    | **No**                                            |
| `avatars` + `location-thumbnails`         | 27 MB, 197 files                                                    | **No**                                            |

Gaps: images are not backed up anywhere; Supabase's backups are deleted if the project is deleted; the only
restore rewinds the whole database and takes the app offline; no restore has ever been tested.

## Done when (all true)

- [ ] **D1.** A database copy lands in R2 every day, and the most we can lose is about 1 day.
- [ ] **D2.** Every image in all 4 buckets has a copy in R2 within a day of being created, and a file deleted in
      Supabase can still be recovered for 30 days.
- [ ] **D3.** A weekly automatic restore drill passes: the full restore matches the live row counts exactly and
      sampled images are all present.
- [ ] **D4.** A failed backup, a stale backup (> 51 h, derived from the schedule in `scripts/backup/lib.js`), or a big
      overnight drop in a table's rows emails Kevin.
- [ ] **D5.** The database copies can't be deleted for 30 days (bucket lock), and old copies clean themselves up
      (lifecycle rules).
- [ ] **D6.** "How to restore" below covers every disaster step by step, including one full rehearsal of a
      single-table restore.

## Design

### Pieces

```
            GitHub Actions (wakes hourly, backs up once a day)
                 │
   ┌─────────────┼───────────────────────────┐
   │ db job      │ storage job               │ drill job (weekly)
   │ pg_dump ────┤ rclone sync ──────────────┤ restore latest dump into a throwaway
   │ (read-only) │ (only new files)          │ Postgres, compare row counts, sample images
   ▼             ▼                           ▼
 Supabase DB   Supabase Storage          Cloudflare R2 bucket `dreambot-backups`
```

### What goes where in R2 (`dreambot-backups`)

```
db/daily/2026-09-30/dreambot.dump     the database copy (pg_dump custom format: restorable one table at a time)
db/daily/2026-09-30/manifest.json     exact row count of every table (from the same snapshot), sizes, versions
db/daily/2026-09-30/cron-jobs.json    the 11 pg_cron job definitions
db/monthly/2026-10/...                the first good copy of each month
storage/current/<bucket>/<path>       mirror of all 4 buckets
storage/trash/<date>/<bucket>/<path>  files deleted or replaced in Supabase, kept 30 days
status/db.json, status/storage.json, status/drill.json   last success of each job (read by the guards + alarms)
```

### The database copy

- **What's in it:** everything in `public` (all app tables), `auth` (user accounts and logins), `storage` (the file
  records), and `supabase_migrations` (the migration ledger).
- **What's left out:**
  - the ROWS of `ai_generation_log` (3.6 GB of 30-day debug logs; the table's structure is kept);
  - Supabase's own internals, which every new project comes with;
  - the one Vault secret (`dream_queue_worker_token`). It is encrypted with a key Supabase holds, so it can't be
    exported; the rebuild steps re-enter it.
- **How it logs in:**
  - The Supabase Management API hands out a short-lived database login, the same way the Supabase CLI already
    does. It uses the `SUPABASE_ACCESS_TOKEN` already in GitHub secrets, so no database password is stored
    anywhere.
  - It reads as `supabase_read_only_user`, which can read every table (it bypasses row-level security) but can't
    write anything.
- **How it stays consistent:** the job opens one transaction, exports its snapshot, runs `pg_dump` on that snapshot,
  and counts every table's rows inside the same snapshot. The manifest's counts therefore match the dump exactly,
  and the drill can demand an exact match.
- **Protecting the app while it runs:**
  - it waits for spare database connections first (`waitForHeadroom`, per the CLAUDE.md hard rule);
  - it uses 2 connections;
  - it wakes at :37 past the hour, away from the :00 cron bursts.
- **Early warning of data loss:** after uploading, it compares each table's rows with the previous day's copy. If a
  core table (users, uploads, seeds, configs, auth users) lost a lot of rows overnight, it keeps the copy but fails
  the run, which emails Kevin. The April seed wipe would have been flagged the next morning. Tables that are pruned
  on purpose (logs, finished queue rows) are exempt.

### The image mirror

- `rclone sync` from Supabase Storage (through its S3 endpoint) into `storage/current/`, all 4 buckets.
- Files deleted or replaced in Supabase are MOVED to `storage/trash/<date>/`, not erased, so they can be undone for
  30 days (then the lifecycle rule purges them, which also honours account deletions).
- It compares file sizes only (dream images never change in place), so a nightly run is just two file listings plus
  the new files, about 2 GB.
- **Gentle on the database:** every Supabase Storage request also queries the database, so the mirror uses low
  parallelism (4 transfers) and waits for connection headroom first.
- **Safety brake:** if more than 1,000 files vanished from Supabase since the last run, it stops before touching the
  mirror and emails Kevin. A mass delete should never flow into the backup unnoticed.
- **First copy:** 70 GB / 153k files, run by hand at a quiet time and watched (see Phase 4). If it hits GitHub's
  6-hour job limit, the next run continues where it stopped.

### Schedule and triggers

- GitHub only fires this repo's scheduled runs about 1 time in 4 (measured 2026-09-29: the hourly workflows ran ~6×
  a day, not 24×; see memory `project_gh_actions_scheduled_workflow_dropout`). So `backup.yml` WAKES every hour at
  :37 and backs up only when the last success is over 20 hours old; otherwise it exits in seconds. The chance of a
  whole day with no wake is about 1 in 700.
- The backup time drifts to the first wake after the chosen window opens (decision K2).
- `backup-drill.yml` wakes every 6 hours: each wake checks freshness (cheap); a full drill runs when the last one is
  over 7 days old.
- Both workflows also have a "Run workflow" button (manual dispatch).
- Two independent workflows each check freshness, so backups silently stopping needs both to fail for 2 days.
- ⚠️ GitHub switches off scheduled workflows in a public repo after 60 days with no commits. Not a risk while we
  commit daily, but it's the first thing to check if backups ever go quiet.

### Credentials

| Secret                                                      | Lives in                     | Can do                                                                 | Why that's acceptable                                                       |
| ----------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` (existing)                          | GitHub secrets               | Manage the Supabase account                                            | Already there; the backup only uses it to get a short-lived read-only login |
| `SUPABASE_S3_ACCESS_KEY_ID` / `_SECRET_ACCESS_KEY`          | `.env.local`, GitHub secrets | Read, write and delete in every bucket (Supabase has no read-only key) | The job only reads; revocable any time in Storage → S3                      |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_ENDPOINT` | `.env.local`, GitHub secrets | Read/write/delete in `dreambot-backups` only                           | The bucket lock makes `db/` undeletable for 30 days even with this key      |

The repo is PUBLIC, so anyone can read the run logs. The jobs print only counts, sizes and durations: never file
names (storage paths contain user IDs), never row data, never the manifest.

### Cost

| Item                                                                                         | Monthly                  |
| -------------------------------------------------------------------------------------------- | ------------------------ |
| R2 storage (~80 GB now; first 10 GB free, then $0.015/GB; downloading for a restore is free) | ~$1 now, ~$3 at 250 GB   |
| Supabase downloads (~35 GB/month + the one-time 70 GB first copy; Pro includes 250 GB)       | $0 (worst case ~$6 once) |
| GitHub Actions (public repo)                                                                 | $0                       |

## Phases

Each phase ends with its proof, and a commit + push (the workflows only run once they're on `main`).

### Phase 0: Setup

- [x] R2 bucket `dreambot-backups` (Standard class, automatic location: western North America, a different region
      from Supabase's Ohio) (Kevin, 2026-09-29)
- [x] R2 Account API token, Object Read & Write, this bucket only; saved in `.env.local` (Kevin)
- [x] Supabase Storage S3 access key `r2-backups`; saved in `.env.local` (Kevin)
- [x] Install Postgres 17 client tools + rclone on Kevin's Mac (`brew install postgresql@17 rclone`: pg_dump 17.11,
      rclone 1.75.1). Client tools only: Kevin declined running a local Postgres SERVER, so restores are tested on
      GitHub's machines (Phase 3).
- [x] Verify both keys: list the R2 bucket and one Supabase bucket, printing only success or failure
- [x] Verify the short-lived read-only login: connect, count one table, and prove a write is REFUSED
- [x] Copy the 5 new secrets from `.env.local` into GitHub secrets (never printed)
- **Pass bar:** all three verifications succeed. ✅ `node scripts/backup/verify-access.js`: 7/7 OK (R2 list/write/
  read/delete; Storage sees 4 buckets and reads files; DB login is `supabase_read_only_user`, and an UPDATE was
  refused with "permission denied").

### Phase 1: Database backup script (`scripts/backup/db-backup.js`, `scripts/backup/lib.js`)

- [x] Snapshot + dump + in-snapshot row counts + manifest + cron-job export
- [x] Upload to `db/daily/<stamp>/` (a timestamp, not a date, so a second run the same day never tries to overwrite a
      locked copy); copy to `db/monthly/<month>/` on the month's first success; write `status/db.json`
- [x] Row-drop early warning against the previous manifest (a watched table that had ≥ 200 rows and lost ≥ 50%)
- [x] Run it once from the Mac, watching `db_health_log`
- [x] K5: `apply-migration.mjs` prefixes every run with `SET LOCAL lock_timeout = '10s'` (verified live: the setting
      is 10s inside the migration's query and back to 0 in the next query, so it never leaks onto the pooled
      connection)
- **Pass bar:** ✅ (the restore into a real server moves to Phase 3)
  - the copy is in R2 (`db/daily/2026-09-30T0600Z/`, also kept as the 2026-09 monthly copy);
  - row counts from the dump itself (`pg_restore --data-only`, one line per row) equal the manifest for 121/121
    tables (489,400 rows);
  - 139 MB dump of a 4.9 GB database, 1m40s end to end;
  - `db_health_log` over the run: connections 37 → 28 (normal churn), 0 lock waiters, the one idle-in-transaction
    connection was the backup's own counting transaction.

### Phase 2: The daily workflow (`.github/workflows/backup.yml`, db job)

- [ ] Hourly wake at :37, the once-a-day guard, the time window, the headroom wait, `concurrency` so two runs never
      overlap, failure → email
- [ ] Postgres 17 client installed from the official Postgres apt repo (`pg_dump` must be at least the server's
      version), rclone pinned
- [ ] A jest test locking the alarm rule from CLAUDE.md: the freshness alarm DERIVES from the backup interval, and
      on-schedule backups never trip it
- **Pass bar:**
  - the first scheduled wake makes exactly one copy, and later wakes that day skip;
  - a deliberately broken manual run sends the failure email.

### Phase 3: Restore drill (`scripts/backup/restore-drill.js`, `.github/workflows/backup-drill.yml`)

- [ ] Starts the same Postgres image Supabase runs (`supabase/postgres:17.6.1.084`, which already has the `auth` and
      `storage` schemas, roles and extensions)
- [ ] Restores the latest copy: `public` structure + data, then `auth` + `storage` + `supabase_migrations` rows
- [ ] Every table's count must equal the manifest; a few sanity queries (a user with their uploads, `engine_config`
      present)
- [ ] Rehearses a single-table restore (`bot_seeds`) exactly as the runbook describes it
- [ ] Checks 50 random `storage.objects` rows exist in the mirror with the same size (once Phase 4 is live)
- [ ] Freshness: fails if the newest database copy or mirror run is older than `STALE_ALARM_HOURS` (51 h)
- **Pass bar:** the first drill passes end to end in under 20 minutes.

### Phase 4: Image mirror (`scripts/backup/storage-mirror.js`, storage job in `backup.yml`)

- [ ] Dry run: counts only, nothing copied
- [ ] Supervised first copy by manual dispatch at a quiet hour; watch `db_health_log` and the app while it runs
- [ ] Then nightly incremental through the same hourly wake + guard
- **Pass bar:**
  - file count and total bytes per bucket in R2 equal `storage.objects`;
  - a nightly run takes under 15 minutes;
  - no rise in connections during the first copy.

### Phase 5: Lock it down (Kevin, Cloudflare dashboard; exact values given at the time)

- [ ] Bucket lock: prefix `db/`, retain 30 days
- [ ] Lifecycle rules:
  - `db/daily/`: delete after 35 days;
  - `db/monthly/`: delete after 400 days (see decision K3);
  - `storage/trash/`: delete after 30 days.
- **Pass bar:** deleting a `db/` file with the backup key is refused.

### Phase 6: Runbook and handover

- [ ] Fill in "How to restore" below, with exact commands
- [ ] The secrets inventory (below) filled in, with where each value lives
- [ ] One CLAUDE.md index line pointing here; a memory note
- **Pass bar:**
  - Kevin has read the runbook;
  - a real single-table restore rehearsal has been done: yesterday's `bot_seeds` restored into a scratch schema,
    compared, and the scratch schema dropped.

## Decisions for Kevin

| #   | Decision                                                                                                                                                                                                                                                                                                                                                                  | My recommendation                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| K1  | Commit + push at the end of each phase (the workflows only run from `main`)                                                                                                                                                                                                                                                                                               | Yes                                                                                        |
| K2  | Backup time of day                                                                                                                                                                                                                                                                                                                                                        | I pick the quietest hours from `db_health_log` (hourly connection history) and report them |
| K3  | Retention: 30 daily copies, 12 monthly copies, 30-day image trash                                                                                                                                                                                                                                                                                                         | Yes, but see K4                                                                            |
| K4  | Privacy: deleted accounts' rows stay in monthly copies up to 12 months, and deleted images in the trash up to 30 days. Add one Privacy Policy line: "Deleted data may remain in encrypted backups for up to 12 months before it is permanently erased." (Or keep monthly copies only 90 days and say 90 days.)                                                            | Add the line, keep 12 months                                                               |
| K5  | `apply-migration.mjs` sets `lock_timeout = '10s'`. The dump holds light table locks for a few minutes; a migration that changes a table during that window would queue behind it, and every app query on that table would queue behind the migration. With the timeout, the migration fails fast (it's all-or-nothing, so nothing half-applies) and you simply re-run it. | Yes (a two-line change that is safer in general)                                           |
| K6  | Keep a copy of `.env.local` in your password manager. Rebuilding after losing Supabase needs those values.                                                                                                                                                                                                                                                                | Yes (your item)                                                                            |

## Risks and how the plan handles them

- **Load on the live database:**
  - waits for connection headroom;
  - 2 connections for a few minutes;
  - low parallelism for images;
  - off-peak wake;
  - the first image copy is supervised.
- **Migration during a dump:** decision K5.
- **Read-only temporary login not available through the API:** fallbacks, in order:
  1. the CLI's temporary `postgres` login, then switch to the read-only role;
  2. Supabase's "temporary access" feature (an access token as the database password);
  3. a database password in GitHub secrets.
- **Restoring into a brand-new Supabase project needs manual fixups:** Supabase documents some, e.g. `supabase_admin`
  owner lines. The drill uses the same Postgres image as production to surface them early; the runbook records every
  fixup the drill needed.
- **The storage key is all-powerful:** stored only in `.env.local` and GitHub secrets, and it can be revoked.
- **A leaked R2 key could delete the image mirror** (it has to be deletable so the trash rotation works), but the
  originals would still be in Supabase. The database copies are locked.
- **Public logs:** jobs print counts, sizes and durations only.

## How to restore (filled in during Phase 6)

- **One table lost or damaged** (a bad delete or migration): restore that table from last night's copy into a
  scratch schema in production, compare, copy the rows back, drop the scratch schema. The app stays up.
- **Images deleted:** copy them back from `storage/current/` or `storage/trash/<date>/`.
- **Whole database corrupted:** Supabase's own nightly restore (Dashboard → Database → Backups; it rewinds
  everything and takes the app offline), or restore our copy into a new project.
- **Supabase project or account lost:**
  - create a new project and restore our copy (structure, then data);
  - copy the images back;
  - redeploy the edge functions from git;
  - re-enter the secrets (inventory below) and repoint the app, website, Fly services and webhooks.
- Supabase's "Restore to a new project" (Dashboard → Database → Backups) works today as a stopgap: it clones last
  night's database into a separate project to pull tables from.

## Secrets inventory (filled in during Phase 6; locations only, never values)

Supabase edge function secrets; GitHub Actions secrets; Fly secrets (`face-swap-dual`, `image-ops`); RevenueCat
webhook secret; Apple keys (`~/Vault`); OAuth providers in Supabase Auth (Google, Apple, Facebook); the Vault secret
`dream_queue_worker_token`; `.env.local`.

## How to resume

Read "Done when", find the first unchecked phase, and do its next unchecked task. The ledger says what was measured
last. Nothing in this plan changes app behaviour; everything runs outside the app, reading only.

## Ledger

- 2026-09-29: Plan written. Measured the starting point (table above). Kevin created the R2 bucket, the R2 token
  and the Supabase S3 key. The Homebrew install of the tools did not complete (to redo in Phase 0).
- 2026-09-30: Phase 0 + 1 done.
  - K2 (time of day) from 14 days of `db_health_log`: quietest 09:00-13:00 UTC (avg 26-27 of 90 connections), busiest
    03:00-08:00 (nightly drain + Supabase's own 04:00 backup). Rule: due after 20 h, never 03:00-08:59 UTC, so
    successes settle at ~09:37 UTC. The freshness alarm derives from that: 20 + 6 + 1 + 24 = 51 h.
  - The short-lived login's first connection intermittently fails "password authentication failed" (1 in 3 fresh
    logins), and the same password works seconds later. `lib.connectReadOnly` retries the same password with backoff,
    then a newer login; `pg_dump` retries on the same snapshot.
  - First copy: 121 tables, 139 MB, 1m40s, counts match the manifest exactly (Phase 1 pass bar).
