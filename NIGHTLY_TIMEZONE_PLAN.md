# Nightly dreams — timezone-aware delivery (plan)

Goal: fire each user's nightly dream during *their* night, not one global 08:00 UTC instant.

## Design (decided in research)
- **Detect** the device IANA timezone with `expo-localization` (already installed):
  `Localization.getCalendars()[0].timeZone` → e.g. `"America/Los_Angeles"`. Store the IANA
  **name** (not a UTC offset — offsets break on DST). Auto-detect + self-correct on launch; no
  onboarding question.
- **Fire** via an **hourly** cron that, each tick, enqueues only users whose *local* time is the
  target hour, deduped on their *local* day. Reuses the whole existing enqueue → queue → worker
  pipeline. Users with no/invalid timezone fall back to the legacy single 08:00 UTC fire (never dropped).
- Target local hour: **4am** (dream renders overnight and is waiting with its push by morning). One
  DB-tunable constant; not hardcoded into logic branches.

## Pieces
1. **Migration 431** — `users.timezone text` (nullable, IANA) + column-level GRANT SELECT/UPDATE to
   `authenticated` (per the users column-grant rule — a new column is invisible/un-writable otherwise).
2. **Pure logic** `scripts/lib/nightlyTimezone.js` — `nightlyDelivery(timezone, nowUtc, opts)` →
   `{ shouldEnqueue, dayKey, mode }`. IANA → DST-correct local hour + local day via `Intl`; null/invalid
   → fallback (UTC hour 8, UTC day). This is the single testable unit that decides who fires when.
3. **Cron script** `scripts/nightly-dreams.js` — select `timezone`; filter the eligible pool through
   `nightlyDelivery`; build `dedup_key = nightly:<user>:<local-day>`.
4. **Cron schedule** `.github/workflows/nightly-dreams.yml` — `0 8 * * *` → `0 * * * *` (hourly).
5. **Client capture** `hooks/useSyncTimezone.ts` + a `<TimezoneSync/>` initializer in `_layout` —
   read the device tz on auth-ready, upsert `users.timezone` only when it changed.
6. **Types** — regenerate `types/database.ts` after the migration is applied (client writes the column).

## QA & tests (explicit, per the ask)
- **Unit tests** `__tests__/lib/nightlyTimezone.test.ts` (fast jest) — prove the decision logic:
  - LA/PDT: `11:00Z` → local 4am → **enqueue**, dayKey `2026-08-04`.
  - Tokyo: only fires when it's 4am there (`19:00Z` prev day → Tokyo 4am next local day; dayKey rolls).
  - **DST correctness**: LA winter (PST) fires at `12:00Z`, LA summer (PDT) at `11:00Z` — same local 4am.
  - **Null / invalid timezone** → fallback: enqueues only at `08:00Z`, dayKey = UTC day.
  - **Local-day rollover** across the date line is correct (idempotency key is the *local* day).
- **DB test** `__tests__/db/usersTimezone.dbspec.ts` (CI db-tests, real Postgres) — **proves the column
  exists and works**: loads migration 431's DDL, inserts a user with a timezone, reads it back
  (round-trip), and asserts it's nullable (a user with no tz). Directly answers "make sure the column
  exists and works as expected."
- **Manual QA**:
  1. After the client build ships, confirm `users.timezone` populates (spot-check rows).
  2. Dry-run the cron logic for a fixed `now` and eyeball who'd be enqueued per timezone.
  3. Verify dedup: two hourly ticks in the same local day never double-enqueue a user.
  4. Verify fallback: a user with `timezone = NULL` still gets exactly one nightly (at 08:00 UTC).

## Apply order (migrations are hand-applied)
1. I implement everything; unit tests + logic verified locally (no DB needed).
2. Kevin applies migration 431 in the SQL editor.
3. I regenerate `types/database.ts`; tsc goes green; commit.
4. CI runs the dbspec (column) + unit tests. Client build picks up tz capture.
