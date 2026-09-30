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

- [x] **D1.** A database copy lands in R2 every day, and the most we can lose is about 1 day.
- [x] **D2.** Every image in all 4 buckets has a copy in R2 within a day of being created, and a file deleted in
      Supabase can still be recovered for 30 days.
- [x] **D3.** A weekly automatic restore drill passes: the full restore matches the live row counts exactly and
      sampled images are all present.
- [x] **D4.** A failed backup, a stale backup (> 51 h, derived from the schedule in `scripts/backup/lib.js`), or a big
      overnight drop in a table's rows emails Kevin.
- [x] **D5.** The database copies can't be deleted for 30 days (bucket lock), and old copies clean themselves up
      (retention enforced by the jobs, `lib.RETENTION`).
- [x] **D6.** "How to restore" below covers every disaster step by step, including one full rehearsal of a
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

- [x] Hourly wake at :37, the once-a-day guard, the time window, the headroom wait, per-job `concurrency` so two
      runs never overlap, failure → email
- [x] Postgres 17 client installed from the official Postgres apt repo (`pg_dump` must be at least the server's
      version); rclone pinned to 1.75.1 and checked against its published SHA-256
- [x] A jest test locking the alarm rule from CLAUDE.md (`__tests__/lib/backupSchedule.test.ts`, 29 cases): the 51 h
      freshness alarm DERIVES from the schedule, and 30 days of wakes from every start hour never trip it
- **Pass bar:** ✅ with one caveat
  - a forced run on GitHub backed up in 1m03s (pg_dump 17.11 from the Postgres apt repo; secrets masked as `***`);
    an unforced wake right after took 23 s and skipped everything after "Due?";
  - the failure email was NOT forced deliberately: it is GitHub's standard failed-run email, the same mechanism
    every existing monitor relies on.

### Phase 3: Restore drill (`scripts/backup/restore-drill.js`, `.github/workflows/backup-drill.yml`)

- [x] Starts the same Postgres image Supabase runs (`supabase/postgres:17.6.1.084`) in a throwaway container
- [x] Drops the image's early `auth`/`storage` schemas and restores everything from the dump
- [x] Every table's count must equal the manifest; per-schema structure counts (functions, policies, triggers,
      indexes, views, sequences; recorded in each manifest since 2026-09-30) must match
- [x] Rehearses a single-table restore (`bot_seeds`) with `scripts/backup/restore-table.js`, the runbook's tool
- [x] Checks 50 random `storage.objects` rows exist in the mirror with the same size (runs once Phase 4 is live)
- [x] Freshness: fails if the newest database copy or mirror run is older than `STALE_ALARM_HOURS` (51 h)
- **Pass bar:** ✅ the second drill passed in 23 s of restore time: 121/121 tables exact (489,448 rows), structure
  matches in all 4 schemas, rehearsal 861/861 rows with no differences, one harmless error ("schema public already
  exists").
- **Finding from the first drill:** 56 of 57 `public` triggers came back. The missing one,
  `send-push-on-notification` on `notifications` (every push notification), is a Supabase Database Webhook calling
  `supabase_functions.http_request`, which only exists once Database Webhooks are enabled. The drill now creates a
  do-nothing stand-in first; a real rebuild must enable Database Webhooks BEFORE restoring and then repoint the
  webhook's URL at the new project (see "How to restore").

### Phase 4: Image mirror (`scripts/backup/storage-mirror.js`, storage job in `backup.yml`)

- [x] Dry run: 153,699 files, 75.1 GB to copy, 0 errors; listing all of Storage takes 26 s
- [x] Speed probe from the Mac: ~6 files/s at 4 transfers (per-file latency, not bandwidth), so the first copy runs
      on GitHub with `transfers=8`; an unfinished copy resumes on the next due wake (files already there are skipped)
- [x] Safety brake verified on an R2 scratch prefix: `--max-delete` also counts moves to the trash (limit 1 with 2
      vanished files: 1 moved, then stop with exit 7)
- [x] Supervised first copy (Kevin's go): run 36745197482, started 16:34 UTC with 8 transfers, `db_health_log`
      sampled every 2 min from the session (alert at ≥ 75 connections or ≥ 5 lock waiters: never fired)
- [ ] Then nightly incremental through the same hourly wake + guard (first one due ~09:37 UTC 2026-10-01)
- **Pass bar:**
  - ✅ every bucket's mirror holds every file that existed when the listing began: `avatars` 37/37, `cast-photos`
    75/75, `location-thumbnails` 160 (+16 created during the copy), `uploads` 153,669 (+282 created during the
    copy); 153,744 files / 75.26 GB copied, 0 errors, 3h38m;
  - ✅ no rise in connections during the first copy (~30-34 of 90 throughout, 0 lock waiters);
  - ✅ the drill right after (run 36771460353): 50/50 sampled files present with the right size, plus 121/121
    tables exact and the rehearsal;
  - [ ] a nightly incremental run takes under 15 minutes (first one tomorrow).

### Phase 5: Lock it down (Kevin, Cloudflare dashboard; exact values given at the time)

- [x] Bucket lock: rule `db-copies-30d`, prefix `db/`, 30 days (2026-09-30, `npx wrangler r2 bucket lock add
  dreambot-backups db-copies-30d db/ --retention-days 30` after Kevin's `wrangler login`; the backup token can't
      change bucket settings). Check: `npx wrangler r2 bucket lock list dreambot-backups`.
- [x] ~~Lifecycle rules~~ replaced by retention the jobs enforce themselves (`lib.RETENTION`, 2026-09-30): daily copies
      35 days (never fewer than the newest 7), the newest 12 monthly copies, image trash 30 days. Only folders
      whose names parse as backup dates are touched; `__tests__/lib/backupRetention.test.ts` locks it. This makes the
      Privacy Policy's "up to 12 months" true without any bucket setting.
- **Pass bar:** ✅ with the backup key, a new file under `db/` can be written, but overwriting or deleting it is
  refused. The probe `db/_lock-probe-2026-09-30/probe.txt` (a few bytes) stays locked until 2026-10-30; retention
  ignores it (not under `db/daily/` or `db/monthly/`), so delete it by hand any time after that.

### Phase 6: Runbook and handover

- [x] Fill in "How to restore" below, with exact commands
- [x] The secrets inventory (below) filled in, with where each value lives
- [x] One CLAUDE.md index line pointing here; a memory note
- **Pass bar:**
  - [ ] Kevin has read the runbook;
  - [x] a real single-table restore rehearsal has been done (2026-09-30, Kevin's go): the newest copy's
        `bot_seeds` restored into `restore_scratch` in production, 861/861 rows identical column for column
        (`except` both ways = 0), 10 s, scratch schema dropped (0 left).

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

## How to restore

All commands run from the repo root on Kevin's Mac (Postgres 17 client + rclone are installed; credentials come
from `.env.local`). Nothing here runs by itself.

### First: what do we have, and how fresh is it?

```bash
node scripts/backup/restore-drill.js --check        # age of the newest database copy, image mirror and drill
node -e "require('./scripts/backup/lib').rclone(['lsf','r2:dreambot-backups/db/daily/']).then(r=>console.log(r.stdout))"
node -e "require('./scripts/backup/lib').rclone(['lsf','r2:dreambot-backups/db/monthly/']).then(r=>console.log(r.stdout))"
```

Each copy is `db/daily/<stamp>/` (stamp = UTC snapshot time, e.g. `2026-09-30T0937Z`). Pick the newest copy taken
BEFORE the damage happened.

### A. One table lost or damaged (a bad delete, a bad migration, a bad script). The app stays up.

1. Stop whatever did the damage (pause the bot or cron, fix the script) so it doesn't happen again mid-restore.
2. Load the backup's rows next to the live table (live table untouched):
   ```bash
   node scripts/backup/restore-table.js public.<table> --db prod                          # newest copy
   node scripts/backup/restore-table.js public.<table> --db prod --from 2026-09-30T0937Z  # a specific copy
   ```
   It prints the rows in the backup, the rows live now, and by primary key how many exist only in the backup (lost
   since) and only live (added since), plus the SQL to put missing rows back.
3. Look before copying back. The printed `insert ... where (id) not in (...)` restores DELETED rows. Rows that were
   CHANGED need an `update ... from restore_scratch.<table>` written for the case. Triggers on the live table fire on
   the insert (for `uploads`/`notifications` that means counters, realtime and pushes).
4. Run the copy-back and the cleanup through the Management API (the Supabase MCP tool is read-only):
   ```bash
   # write the SQL into a file named NNN_something.sql outside the repo, then:
   node scripts/apply-migration.mjs /path/000_restore_bot_seeds.sql --no-record
   # last statement of the file: drop schema restore_scratch cascade;
   ```

- If a migration DROPPED the table: re-run the migration that creates it (it's in `supabase/migrations/`), then
  step 2.
- Rehearsed for real 2026-09-30: `public.bot_seeds` from the newest copy, 861/861 rows, identical column for column,
  10 s; scratch schema dropped. The weekly drill repeats it against a throwaway database.

### B. Images deleted or overwritten

The mirror keeps everything that was in Supabase at its last run in `storage/current/<bucket>/...`, and every file
deleted or replaced since in `storage/trash/<run stamp>/<bucket>/...` for 30 days. Copying a file back through the
S3 endpoint also recreates its `storage.objects` row. (If the matching `uploads` rows were deleted too, restore them
with A.)

```bash
# everything one mirror run moved to the trash (e.g. after a mass delete):
node -e "require('./scripts/backup/lib').rclone(['copy','r2:dreambot-backups/storage/trash/<stamp>','sb:','--size-only','--transfers','8'],{quiet:false}).then(r=>console.log('exit',r.code))"
# one bucket from the mirror:
node -e "require('./scripts/backup/lib').rclone(['copy','r2:dreambot-backups/storage/current/uploads','sb:uploads','--size-only','--transfers','8'],{quiet:false}).then(r=>console.log('exit',r.code))"
```

If the mirror ever stops with **SAFETY BRAKE** (more than 1,000 files vanished since its last run), don't re-run it
until you know why: the files are still in `storage/current/`.

### C. The whole database is badly damaged, but the project still exists

- **Fastest, loses everything since ~04:00 UTC:** Supabase Dashboard → Database → Backups → restore last night's
  backup. It rewinds EVERY table and the app is offline while it runs.
- **Surgical:** restore the damaged tables one by one with A. Or Dashboard → Database → Backups → "Restore to a new
  project" clones a Supabase nightly backup into a separate project to pull tables from (costs a second project
  while it exists).

### D. The Supabase project or account is gone: rebuild from R2

Expect hours, not minutes, and a new App Store build: the app has the Supabase URL and anon key built in. The drill
proves the copy holds every row and every structure object, but it does NOT rehearse this exact sequence onto a real
new Supabase project. Follow it carefully and check each step.

1. Create a new Supabase project (Pro, Small compute, us-east-2). Note its ref and database connection string.
2. BEFORE restoring:
   - Database → Webhooks → enable (creates `supabase_functions`; the push trigger needs it);
   - enable the extensions listed in the copy's `manifest.json` → `extensions` (pg_cron, pg_net, pg_trgm, pgcrypto,
     uuid-ossp, pg_stat_statements).
3. Download the copy:
   `node -e "require('./scripts/backup/lib').rclone(['copy','r2:dreambot-backups/db/daily/<stamp>','./restore']).then(r=>console.log('exit',r.code))"`
4. Split it into structure and data (Supabase's documented restore shape; `auth` and `storage` tables already exist
   in a new project, so they get data only):
   ```bash
   B=/opt/homebrew/opt/postgresql@17/bin
   $B/pg_restore --schema-only --schema=public --schema=supabase_migrations -f restore/schema.sql restore/dreambot.dump
   $B/pg_restore --data-only --schema=public --schema=supabase_migrations --schema=auth --schema=storage \
     -f restore/data.sql restore/dreambot.dump
   ```
5. In `restore/schema.sql`, replace the OLD project URL (`jimftynwrinwenonjrlj.supabase.co`) with the new one. It
   appears in the `send-push-on-notification` trigger and in any function that calls an edge function.
6. Load it (the `SET` stops triggers firing during the data load):
   ```bash
   $B/psql "$NEW_DB_URL" -v ON_ERROR_STOP=1 -f restore/schema.sql
   $B/psql "$NEW_DB_URL" -v ON_ERROR_STOP=1 -c 'SET session_replication_role = replica' -f restore/data.sql
   ```
   A newer Auth or Storage version may have added columns (they take their defaults) or dropped some (that COPY
   fails; edit it by hand).
7. After loading:
   - re-add each table in `manifest.json` → `realtimeTables` to the `supabase_realtime` publication;
   - recreate the pg_cron jobs from `cron-jobs.json`, with the new project URL;
   - recreate the Vault secret `dream_queue_worker_token`.
8. Images: in the new project, create the buckets (`uploads`, `avatars` and `location-thumbnails` public;
   `cast-photos` private), make an S3 key, then copy `storage/current/<bucket>` into each (same command as B, pointed
   at the new project's S3 endpoint).
9. Edge functions: `supabase link --project-ref <new>`, then deploy all 16 with `--no-verify-jwt` (list in
   CLAUDE.md), and set every secret in the inventory below.
10. Auth:
    - set up Google, Apple and Facebook sign-in, redirect URLs and SMTP;
    - the signing keys differ, so every user has to sign in again.
11. Repoint everything else at the new project:
    - the app (`EXPO_PUBLIC_SUPABASE_URL` + anon key → new build);
    - the website on Vercel;
    - the Fly services' `SUPABASE_URL` + service role key;
    - the RevenueCat webhook URL;
    - GitHub Actions secrets.
12. Check: row counts per table against `manifest.json`, as the drill does.

## Secrets inventory (locations and names only, never values)

| Where                               | What                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.env.local` on Kevin's Mac         | Most of the values below. **Keep a copy in the password manager (K6).**                                                                                                                                                                                                                                                                                                                                                                                                  |
| Supabase → Edge Functions → Secrets | ANTHROPIC*API_KEY, DEVICECHECK_KEY_ID, DEVICECHECK_KEY_P8, DEVICECHECK_TEAM_ID, DREAM_QUEUE_WORKER_TOKEN, DUAL_SWAP_FLY_TOKEN, DUAL_SWAP_FLY_URL, FAL_API_KEY, GEMINI_API_KEY, IDENTITY_MIN_SIM, IMAGE_OPS_FLY_TOKEN, IMAGE_OPS_FLY_URL, OPENAI_API_KEY, POSTHOG_PROJECT_KEY, REPLICATE_API_TOKEN, REVENUECAT_WEBHOOK_SECRET, SENTRY_EDGE_DSN, SIGHTENGINE_API_SECRET, SIGHTENGINE_API_USER, SOLO_PROBE_ENGINE, XAI_API_KEY (the `SUPABASE*\*` ones are set by Supabase) |
| Supabase Vault                      | `dream_queue_worker_token` (same value as DREAM_QUEUE_WORKER_TOKEN)                                                                                                                                                                                                                                                                                                                                                                                                      |
| Supabase → Auth                     | Google / Apple / Facebook client IDs + secrets, redirect URLs, SMTP settings                                                                                                                                                                                                                                                                                                                                                                                             |
| GitHub → Actions secrets            | ANTHROPIC_API_KEY, BOT_PASSWORD_PREFIX, DREAM_QUEUE_WORKER_TOKEN, GEMINI_API_KEY, OPENAI_API_KEY, REPLICATE_API_TOKEN, SUPABASE_ACCESS_TOKEN, SUPABASE_SERVICE_ROLE_KEY, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, SUPABASE_S3_ACCESS_KEY_ID, SUPABASE_S3_SECRET_ACCESS_KEY                                                                                                                                                                                   |
| Fly `dreambot-face-swap-dual`       | REPLICATE_API_TOKEN, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, FLY_AUTH_TOKEN (+ settings DUAL_SWAP_DYNAMIC_SPLIT, IDENTITY_VERIFY)                                                                                                                                                                                                                                                                                                                                       |
| Fly `dreambot-image-ops`            | SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, FLY_AUTH_TOKEN                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Vercel `dreambot-web`               | Supabase URL + anon key (reads the public feed)                                                                                                                                                                                                                                                                                                                                                                                                                          |
| RevenueCat                          | Webhook URL (points at the `revenuecat-webhook` edge function) + REVENUECAT_WEBHOOK_SECRET                                                                                                                                                                                                                                                                                                                                                                               |
| App build (`eas.json` / env)        | EXPO_PUBLIC_SUPABASE_URL + anon key, baked into every build                                                                                                                                                                                                                                                                                                                                                                                                              |
| `~/Vault` + App Store Connect       | Apple .p8 keys (memory: reference_apple_keys_vault)                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Cloudflare R2                       | Bucket `dreambot-backups`; the backup token (R2\_\* above)                                                                                                                                                                                                                                                                                                                                                                                                               |

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
  - Phase 2 + 3 done on GitHub (results under each phase). The first drill found the push-notification webhook
    trigger that a rebuild would silently lose.
  - Phase 4 code in; dry run + speed probe done. `avatars` and `location-thumbnails` already copied by the probe.
  - The first 75 GB copy waits for Kevin: an automated overnight supervisor was declined, so the schedule does NOT
    start the mirror until a first copy has been started by hand (`is-due.js`: storage with no status is never
    due unless forced, and doesn't alarm). To start it: Actions → Backup → Run workflow → only `storage`, force on,
    transfers `8`.
  - Phase 6: runbook + secrets inventory written; production single-table rehearsal passed (see Phase 6).
    Remaining: the first image copy (Kevin picks the time), the bucket lock + lifecycle rules (Kevin, Cloudflare),
    Kevin reading the runbook.
  - Kevin: "use your best judgement" on the open items. First image copy started 16:34 UTC (run 36745197482,
    8 transfers, 60/90 connections free), watched from this session. Retention moved into the jobs (no lifecycle
    rules needed). K4 done: dreambotapp.com/privacy now discloses Cloudflare (encrypted backups) and "up to 12
    months" (dreambot-web 7f41557, live). The bucket lock still needs Kevin's Cloudflare login.
  - Bucket lock set and proven after Kevin's `wrangler login` (Phase 5). First image copy finished 20:15 UTC: 153,744
    files / 75.26 GB, 0 errors, 3h38m, no database impact; completeness check passed per bucket. The drill right
    after passed with the image sample (50/50). All six "Done when" items are met; left: the first nightly
    incremental mirror run (expected ~09:37 UTC 2026-10-01, should take minutes), and Kevin's own items (read this
    runbook, `.env.local` in the password manager).
