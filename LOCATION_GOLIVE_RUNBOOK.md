# Location Expansion — Go-Live Runbook (post-1.0.17)

The step-by-step for lighting up the expanded location pools once **v1.0.17 is
approved and live** on the App Store. Everything below is service-key SQL / node
(no DDL, no new migration). Run the steps **in order** — the ordering is the whole
point.

Design/context: `LOCATION_REORG_PLAN.md` · state: `LOCATION_REORG_TRACKER.md` ·
pool depth proof: `BACKFILL_SEED_STATE.md`.

---

## Why the order matters (read once)

The new picker UI (whole-category tile selection + the new `SECTION_META`
groupings) ships in **1.0.17**. The 115 expanded pools are currently **dark**
(`admin_only = true`). If we flip them live while users are still on 1.0.16, their
OLD picker sees the new `picker_category` values it doesn't know how to group.

So the gate is: **get everyone onto 1.0.17 first, THEN flip.** That's Step 1.

---

## Preconditions
- [ ] 1.0.17 shows **Ready for Sale** in App Store Connect (approved + released).
- [ ] You can reach the Supabase SQL editor + run `node` locally (`.env.local` present).
- [ ] Pool depth already verified done: 115 cards at production depth, Phase B polish
      applied (see `BACKFILL_SEED_STATE.md`). Nothing to seed at go-live.

---

## Step 1 — Force the update gate to 1.0.17
So every user is on the new picker before any card goes live.

```sql
UPDATE engine_config
SET min_app_version = '1.0.17',
    latest_app_version = '1.0.17';
```
Then give it a beat for users to update (the app shows the update wall). You can
proceed to Step 2 immediately if you're comfortable that old-build users simply
won't see the new cards until they update — but forcing min is the clean guarantee.

---

## Step 2 — Flip the expanded pools live
115 dark in-picker cards → live. Scoped to `picker_category IS NOT NULL` so it
**never** touches the 37 pulled cards (robot city, etc. — those stay dark on purpose).

```sql
-- sanity FIRST (expect 115)
SELECT count(*) FROM location_cards
WHERE picker_category IS NOT NULL AND admin_only = true;

-- flip
UPDATE location_cards
SET admin_only = false
WHERE picker_category IS NOT NULL AND admin_only = true;

-- confirm 0 dark in-picker cards remain
SELECT count(*) FROM location_cards
WHERE picker_category IS NOT NULL AND admin_only = true;   -- expect 0
```

---

## Step 3 — Remap existing users into the new categories
Rounds every user's **partial** section selection up to the **whole** section
(Kevin's rule: any child selected → select the entire section) and drops orphan /
pulled-card refs. Run **right after** Step 2 (running it before the flip would
surface still-dark cards early).

```sh
node scripts/migrate-user-locations.mjs            # DRY RUN — review the counts
node scripts/migrate-user-locations.mjs --write    # apply
```
The client-side normalization in `LocationPickerStep` is the ongoing safety net
(fires when a user opens the picker); this script does it for everyone at once so
their nightly dreams draw from the expanded categories immediately.

> `heal-orphan-locations.mjs` is **not needed** — the migrate script already drops
> orphans. Keep it only as a standalone orphan-only tool.

---

## Step 4 — Fire the announcement
The "We redecorated ✨" sheet (id `80e7b01c-30bd-4780-a1c3-ba74e549fda6`) is already
configured: `is_active = true`, `audience = all`, `existing_users_only = true`, and
**`min_build = 47`** (set 2026-08-31 to stop it leaking on 1.0.16). So it will only
surface on the 1.0.17 build — nothing to change here at go-live *except* the seen-reset
below.

**Reset seen state so EVERY user gets it fresh on 1.0.17.** `announcement_seen` is
permanent (first view writes a row, it never re-shows). ~57 users saw it early while
`min_build` was null; wipe all seen rows so they — and everyone — get it once on the
new build:
```sql
DELETE FROM announcement_seen
WHERE announcement_id = '80e7b01c-30bd-4780-a1c3-ba74e549fda6';
```
> Do this AT go-live (after Steps 1-3), not before — otherwise a still-1.0.16 user
> could re-see it, except `min_build = 47` now prevents that, so timing is safe either
> way. Running it at go-live is cleanest.

To re-preview on your own account only (instead of the full wipe):
```sql
DELETE FROM announcement_seen
WHERE announcement_id = '80e7b01c-30bd-4780-a1c3-ba74e549fda6'
  AND user_id = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
```

---

## Step 5 — Verify
- [ ] `SELECT count(*) FROM location_cards WHERE picker_category IS NOT NULL AND admin_only = true;` → **0**
- [ ] Re-run `node scripts/migrate-user-locations.mjs` (dry) → **0 users changed** (idempotent).
- [ ] Open the app on a real 1.0.17 build: the new sections render, tiles select
      whole categories, the "We redecorated" sheet appears once.
- [ ] Spot-check a few users' nightly rolls the next morning (or check
      `ai_generation_log`) — the orphan guard already blocks any dead seed, so
      nightly can't roll a card that isn't live.

---

## Rollback (if something looks wrong)
- **Un-flip the pools:** `UPDATE location_cards SET admin_only = true WHERE picker_category IS NOT NULL;`
  Safe even after Step 3 — the nightly **orphan guard** silently skips any saved
  place that no longer resolves to a live picker card, so expanded user selections
  just go dormant rather than erroring.
- **Kill the announcement:** `UPDATE announcements SET is_active = false WHERE id = '80e7b01c-30bd-4780-a1c3-ba74e549fda6';`
- The Step 3 user remap is **not** auto-reversible (it rewrote `recipe.places`), but
  it's harmless while pools are dark (orphan guard). No action needed.

---

## One-liner summary
1. `min_app_version = '1.0.17'` (force update)  →
2. flip 115 cards `admin_only = false` (picker_category NOT NULL only)  →
3. `migrate-user-locations.mjs --write`  →
4. reset `announcement_seen` for the "We redecorated" sheet (already min_build 47 + active) so all users get it fresh  →
5. verify 0 dark cards + idempotent re-run.
