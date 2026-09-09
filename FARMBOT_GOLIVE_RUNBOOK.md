# FarmBot — Go-Live Runbook (announcement + public flip)

The step-by-step for taking FarmBot from private (current state) to public, tied to
the **1.2.0** App Store release, with the "Introducing FarmBot" announcement showing
exactly once to every existing user who hasn't seen it. Mirrors
`LOCATION_GOLIVE_RUNBOOK.md`'s pattern (that launch is the precedent this one
copies). Everything below is service-key SQL / node — no new migration needed at
go-live time, the announcement system (migrations 333 + 445 + 483 + 484 + 487) is
already fully built AND already gated.

Design/state: `FARMBOT_PATH_BUILD_STATE.md` (roster + pool status) ·
`FARMBOT_CREATIVE_DIRECTION.md` (spec of record).

---

## The version gate is ALREADY set — nothing to look up at go-live

`scripts/announce-farmbot.js` already sets `min_app_version: '1.2.0'` on the
`farmbot-launch` row (migration 487, 2026-09-09). Unlike the locations launch
(which used `min_build`, a native build number that can only be known AFTER EAS
mints it), `min_app_version` is a marketing version STRING — known in advance,
compared client-side against `Constants.expoConfig.version` (`hooks/
useAnnouncement.ts`, via `lib/appVersion.ts`'s fail-open `isUpdateRequired`). So no
client below 1.2.0 can ever see this announcement, and there is **no "look up the
build number" step** in this runbook — that whole class of go-live risk is closed
ahead of time, not handled reactively.

(The supreme admin — `lib/superAdmin.ts` — is exempt from this gate client-side too,
so it can be previewed on your own current dev build at any time; see the preview
note near the bottom.)

---

## Preconditions
- [ ] `app.config.js`'s `expo.version` is bumped to `'1.2.0'` and that build is
      **Ready for Sale** in App Store Connect (approved + released). This is the
      step that actually arms the gate above — until real users are running a
      `Constants.expoConfig.version >= '1.2.0'` build, the announcement can't reach
      them no matter what else is flipped.
- [x] All 30 FarmBot paths built + signed off, all pools scaled to 120 entries
      each (roster + status: `FARMBOT_PATH_BUILD_STATE.md`) — done 2026-09-09.
      Note: `first-snowfall` is currently DEACTIVATED (off-season, see the
      tracker) — 29 paths actively in rotation. Re-check this checkbox / the
      active roster right before go-live in case the season has changed.
- [ ] Profile picture finalized (`users.avatar_url` for FarmBot) — pending
      Kevin's pick from the current concept batch as of 2026-09-09.
- [x] Announcement copy + hero image finalized in `scripts/announce-farmbot.js`
      (title "Introducing FarmBot 🌾", Harvest Festival hero image — Kevin's
      picks as of 2026-09-09).
- [x] Announcement version gate already armed (`min_app_version = '1.2.0'`,
      migration 487) — done 2026-09-09, nothing left to do here at go-live.
- [ ] You can reach the Supabase SQL editor + run `node` locally (`.env.local`
      present).

---

## Step 1 — Flip FarmBot's account public
```sql
UPDATE public.users SET is_public = true WHERE username = 'FarmBot';
```
Confirm:
```sql
SELECT id, username, is_public FROM public.users WHERE username = 'FarmBot';
```
This alone is what makes FarmBot discoverable — `is_bot=true` is already set
(migration 127, verified live), and the Bots-tab RPC `get_bot_users()` (migration
477) already returns any bot with `is_public=true` unconditionally; there is no
separate registry/allowlist to update. Client-side hide-lists in
`hooks/useBotUsers.ts` (`HIDDEN_BOT_USERNAMES`, `PRIVATE_BOT_USERNAMES`) do NOT
include FarmBot, so no client code change is needed for it to surface.

---

## Step 2 — Add the bot_schedules row (read this whole step — 3 real gotchas)

FarmBot currently has **no** `bot_schedules` row by design (private bots never
auto-post — the dispatcher is schedule-row-driven, not `bot.paths`-driven, see
`index.js`'s header comment). `posts_per_day = 2` is the correct value — verified
live across all 19 existing rows, zero exceptions, as of 2026-09-09.

**Gotcha 1 — casing.** `bot_schedules.bot_name` must be **lowercase** `'farmbot'`
(matches `scripts/bots/farmbot/index.js`'s `username: 'farmbot'` and how
`run-bot.js` resolves the module path) — NOT `'FarmBot'`, which is only the
`users.username` casing used in Step 1. Easy to typo across these two steps.

**Gotcha 2 — a bare INSERT never sets `next_due_at`, and the dispatcher silently
ignores a NULL forever.** There is no `BEFORE INSERT` trigger on this table (only
`BEFORE UPDATE`) — verified in `supabase/migrations/177_bot_schedules.sql`.
`compute_bot_next_due()` only runs on a subsequent UPDATE (or via the
`rebalance_bot_schedules()` function). The dispatcher's query is
`.eq('active', true).lte('next_due_at', now)` — a NULL `next_due_at` never
satisfies that, with no error surfaced anywhere. Insert INACTIVE, then flip active
in a separate statement (exact precedent: `scripts/create-oceanbot-account.js`):
```sql
INSERT INTO public.bot_schedules (bot_name, posts_per_day, active, phase_seed)
VALUES ('farmbot', 2, false, floor(random() * 1440)::int);

UPDATE public.bot_schedules SET active = true WHERE bot_name = 'farmbot';
```
`phase_seed` must satisfy `0 <= x < 1440` (a real CHECK constraint) — use
`floor(random() * 1440)::int` in SQL, not `Math.random() * 2000` (the
create-oceanbot-account.js precedent script actually has this off-by-a-lot bug;
don't copy it).

Confirm `next_due_at` actually populated and lands somewhere sane (not months out):
```sql
SELECT bot_name, posts_per_day, active, phase_seed, next_due_at, created_at
FROM public.bot_schedules WHERE bot_name = 'farmbot';
```

**Gotcha 3 — a 6-hour never-posted auto-deactivate can silently kill this before
its first post.** `scripts/dispatch-bots.js`: once a bot becomes due
(`next_due_at <= now()`) with `last_posted_at IS NULL`, if
`now() - bot_schedules.created_at > 6h` the dispatcher deactivates it WITHOUT ever
attempting a run (writes a note, no error/alert). With `posts_per_day=2` (12h
between slots) and a random `phase_seed`, the first computed slot can land
anywhere up to ~12h out — i.e. it's genuinely possible for this row to silently
deactivate itself before ever posting once. Two ways to avoid it:
- Manually trigger the first post right after Step 2 so `last_posted_at` gets set
  immediately: `node scripts/run-bot.js --bot farmbot` (uses the real dispatcher
  path, not `iter-bot.js`'s dev/QA path).
- Or just watch `next_due_at` after inserting and confirm it's comfortably under
  6h out before walking away.

---

## Step 3 — Re-run announce-farmbot.js if copy/image changed since last run
Only needed if the title/body/hero image were touched after the last time this ran
(safe to re-run any time regardless — it upserts, ships `is_active: false`):
```sh
node scripts/announce-farmbot.js
```
Confirm the row looks right:
```sql
SELECT id, title, min_app_version, is_active, existing_users_only, priority
FROM public.announcements WHERE id = 'farmbot-launch';
```
Expect `min_app_version = '1.2.0'`, `is_active = false` (still dark — Step 4 flips it).

---

## Step 4 — Activate (atomically retires whatever's currently live)
Migration 484's `activate_announcement` RPC deactivates any other currently-active
announcement AND activates this one, in one transaction, AND resets `starts_at` to
`now()` as part of the same call — so this single step replaces the locations
launch's separate "reset starts_at" step:
```sql
SELECT activate_announcement('farmbot-launch');
```
Why `starts_at = now()` matters: the `existing_users_only` RLS gate is
`users.created_at < announcements.starts_at` (migration 445). If `starts_at` were
left at whenever the row was first upserted (long before go-live), anyone who
signed up between then and now would be wrongly excluded from ever seeing it.
Firing the RPC at the actual go-live moment makes "existing users" = everyone who
existed before the flip; brand-new post-go-live signups correctly never see a
"new!" sheet for something that was always part of their app.

---

## Step 5 — Verify
- [ ] `SELECT is_active, min_app_version, starts_at FROM announcements WHERE id = 'farmbot-launch';`
      → `is_active = true`, `min_app_version = '1.2.0'`, `starts_at` ≈ now.
- [ ] `SELECT count(*) FROM announcements WHERE is_active = true;` → **1** (the
      migration-484 unique index enforces this can never be more than 1, but
      confirm the RIGHT one is live).
- [ ] Open the app on a real 1.2.0 build, on an account that existed before go-live:
      the "Introducing FarmBot" sheet appears once, CTA routes to FarmBot's profile,
      dismissing (or tapping the CTA) marks it seen — reopening the app never shows
      it again.
- [ ] Confirm a client still on 1.1.0 (an old TestFlight build, if you have one
      handy) does NOT show the sheet — this is the one check that actually proves
      the version gate works, not just the seen-tracking.
- [ ] Confirm a BRAND NEW signup (post-go-live) does NOT see the sheet
      (`existing_users_only` working as intended).
- [ ] Confirm FarmBot is now visible in the public feed / Bots tab like any other
      bot, and its first scheduled post fires within the `bot_schedules` cadence.

---

## Previewing the sheet ANY TIME before go-live (including right now)

Two separate mechanisms stack to make this safe and reliable for the admin account
only (`eab700d8-f11a-4f47-a3a1-addda6fb67ec`, `lib/superAdmin.ts`):
- **Server-side (migration 483):** an RLS carve-out lets the admin read this row
  regardless of `is_active`/`starts_at`/`existing_users_only`.
- **Client-side (`useAnnouncement.ts`, 2026-09-09):** the admin is also exempted
  from the `min_build`/`min_app_version` checks — otherwise a version-gated draft
  would be invisible even to the admin's own preview while running an older dev
  build (which is exactly the situation before 1.2.0 actually ships).

So the sheet is fully previewable on your CURRENT dev build, at any point, just by
clearing your own seen row:
```sql
DELETE FROM announcement_seen
WHERE announcement_id = 'farmbot-launch'
  AND user_id = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
```
Then force-quit and reopen the app (the client caches this query for 10 minutes and
shows at most one announcement per session).

---

## Rollback (if something looks wrong post-flip)
- **Kill the announcement:** `UPDATE announcements SET is_active = false WHERE id = 'farmbot-launch';`
- **Stop it posting:** `UPDATE public.bot_schedules SET active = false WHERE bot_name = 'farmbot';`
  (deactivating, not deleting, mirrors the standing "deactivate don't delete"
  convention — preserves `phase_seed`/history for a clean re-activation later).
- **Re-privatize the bot:** `UPDATE public.users SET is_public = false WHERE username = 'FarmBot';`
  — note this alone does NOT hide FarmBot's *existing* posts from anyone who
  followed it in the meantime (the MechBot decommission, migration 308,
  needed a separate `uploads.is_public=false` sweep for that); it does stop
  new/future visibility going forward, which is what a same-day rollback needs.
- Neither of these touches render history — every render stays in the account
  either way (nothing here deletes uploads).

---

## One-liner summary
1. `users.is_public = true` for FarmBot (already `is_bot=true`, no registry to
   touch — Bots tab picks it up automatically)  →
2. `bot_schedules`: INSERT with `active=false` + a `phase_seed` in `[0,1440)`,
   THEN a separate `UPDATE ... SET active=true` (fires the trigger that actually
   computes `next_due_at` — a bare INSERT never does), THEN either watch
   `next_due_at` lands well under 6h out or just run
   `node scripts/run-bot.js --bot farmbot` once to set `last_posted_at`
   immediately and sidestep the 6h never-posted auto-deactivate entirely  →
3. re-run `announce-farmbot.js` only if copy/image changed  →
4. `SELECT activate_announcement('farmbot-launch');`  →
5. verify: sheet shows once on 1.2.0+ existing accounts, never on 1.1.x or new
   signups; confirm `bot_schedules.next_due_at` is populated and FarmBot's first
   scheduled post actually lands. (The `min_app_version = '1.2.0'` gate itself
   needed zero go-live-time setup — it was set the moment this runbook was
   written.)
