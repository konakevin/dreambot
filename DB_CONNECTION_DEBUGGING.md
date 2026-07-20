# DB Connection Gridlock — Debugging Runbook

The recurring Supabase "Unhealthy" incidents are **connection exhaustion** (the 60-conn
Micro ceiling fills, queries queue, everything times out). With ~20 users this should
NEVER happen — so it's a **leak / accumulation**, not organic load. This is how to catch
it. Root-cause forensics: `db_health_log` (migrations 372 + 381).

## The one fact that shapes everything
Every normal tool (dashboard SQL editor, `check-db-health.js`, PostgREST) goes through the
**same connection path that saturates** — so mid-incident they all time out. Two things beat
that: the **direct probe** (a superuser connection uses reserved slots) and the **flight
recorder** (per-minute snapshots written from *inside* the DB, readable after recovery).

## Incident playbook (in order)

1. **Live look, even while wedged** — `node scripts/db-direct-probe.js`
   Direct Postgres connection (bypasses PostgREST). Shows every connection: app, user,
   client IP, state, how long open, how long idle, last query, + aggregates by app and IP.
   A leak = one app/IP holding many `idle` connections with a large "oldest-idle".
   - Needs `DATABASE_URL` in `.env.local` (dashboard → Connect → Session pooler → the URI
     *with* password). Set this up NOW, before the next incident.

2. **Targeted recovery (no full restart)** — `node scripts/db-direct-probe.js --kill-stale=600`
   Terminates only connections idle > 600s, freeing slots while leaving active work alone.
   Prefer this over a full DB restart (which drops everything). If even the direct connect
   fails, the DB is past connection-exhausted (CPU/mem pegged) → restart it.

3. **Reconstruct what led up to it** — read the flight recorder:
   ```sql
   select captured_at, total_conn, idle_conn, oldest_idle_secs, by_application, by_client_addr, connections
   from db_health_log order by captured_at desc limit 60;
   ```
   The `connections` column is the top-25 connections in full detail at each minute — the
   rows leading up to the wedge show exactly which connections piled up (even though we
   couldn't read anything live during the wedge).

4. **On-demand while healthy** — `node scripts/db-connections.js`
   Same per-connection view via the `admin_db_connections()` RPC (no password needed).
   Run it periodically to watch the idle count creep between incidents.

## Standing protections (migration 381)
- **Idle reaper**: `idle_session_timeout = 10min` — forgotten idle connections die and free
  their slot automatically. Healthy pooling and realtime streaming are unaffected.
- **Creep alarm**: `check-db-health.js` pages us when the oldest idle connection exceeds
  ~25min (the leak *onset*, hours before it wedges) — via `db-health-monitor.yml`.
- **Flight recorder**: `capture_db_health()` snapshots the top-25 connections every minute.

## Likely leak sources to check once we have the per-connection detail
- A specific `application_name` / `client_addr` holding growing `idle` connections.
- The `(unknown)` connections (no app name) — the direct probe shows their `backend_type`
  + `client_addr` to identify them (pooler? an external client? a script?).
- Realtime channels not torn down on unmount (though realtime multiplexes, so watch the
  `realtime_*` app counts, not just channel count).
- Compute headroom: bumping Micro→Small (60→90 conn) buys room, but is a MASK, not the fix —
  find the leak first.
