# FarmBot — Go-Live Runbook (announcement + public flip)

**✅ EXECUTED 2026-09-09.** FarmBot is public, `farmbot-launch` announcement is
active. One incident during launch, fixed and documented: the admin's own
`announcement_seen` row (from earlier same-day preview testing) silently
blocked Kevin from seeing the real live sheet — cleared, and this is now a
standing step in the `release` Claude Code skill
(`.claude/skills/release/SKILL.md`) for every future gated launch. Kept below
as the worked reference for the next bot/feature launch.

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
- [x] `app.config.js`'s `expo.version` bumped to `'1.2.0'`, tagged `v1.2.0`
      (commit `eec14c70`), build 50 uploaded + processed at Apple — done
      2026-09-09. **Still open:** attach build 50 to the 1.2.0 version row in
      App Store Connect (App Store tab → version → attach build → screenshots
      + review notes → **Submit for Review**) — this is a manual ASC web-UI
      step, no API/browser tool available to do it from here, so this one
      needs a human. Apple's 24-48h review clock doesn't start until that
      button is clicked. **This is the ONLY thing actually blocking go-live
      right now** — once Apple approves and the version shows "Ready for
      Sale," jump straight to the copy-paste block below.
- [x] All 30 FarmBot paths built + signed off, all pools scaled to 120 entries
      each (roster + status: `FARMBOT_PATH_BUILD_STATE.md`) — done 2026-09-09.
      Note: `first-snowfall` is currently DEACTIVATED (off-season, see the
      tracker) — 29 paths actively in rotation. Re-check this checkbox / the
      active roster right before go-live in case the season has changed.
- [x] Profile picture finalized (`users.avatar_url` for FarmBot) — "Chick with
      Sunhat" concept, set 2026-09-09.
- [x] Announcement copy + hero image finalized in `scripts/announce-farmbot.js`
      (title "Introducing FarmBot 🌾", Harvest Festival hero image — Kevin's
      picks as of 2026-09-09).
- [x] Announcement version gate already armed (`min_app_version = '1.2.0'`,
      migration 487) — done 2026-09-09, nothing left to do here at go-live.
- [ ] You can reach the Supabase SQL editor + run `node` locally (`.env.local`
      present).

---

## ⚡ THE MOMENT 1.2.0 SHOWS "READY FOR SALE" — run this, copy-paste, no thinking required

Everything else in this runbook (Steps 2-5 below) is already done or is just the
detailed explanation of what this block does and why. This is the ONLY thing left
to actually execute. One node one-liner, service-key, does the whole flip in order:

```sh
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node -e "
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const { error: pubErr } = await sb.from('users').update({ is_public: true }).eq('username', 'FarmBot');
  if (pubErr) { console.error('FLIP PUBLIC FAILED:', pubErr); process.exit(1); }
  console.log('✅ FarmBot is now public.');

  const { error: annErr } = await sb.rpc('activate_announcement', { p_id: 'farmbot-launch' });
  if (annErr) { console.error('ACTIVATE ANNOUNCEMENT FAILED:', annErr); process.exit(1); }
  console.log('✅ farmbot-launch announcement is now live.');

  const { data: u } = await sb.from('users').select('is_public').eq('username', 'FarmBot').single();
  const { data: a } = await sb.from('announcements').select('is_active, min_app_version, starts_at').eq('id', 'farmbot-launch').single();
  const { data: s } = await sb.from('bot_schedules').select('active, next_due_at, last_posted_at, consecutive_failures').eq('bot_name', 'farmbot').single();
  console.log('users.is_public:', u.is_public);
  console.log('announcement:', a);
  console.log('bot_schedules:', s);
})();
"
```

This does exactly Step 1 + Step 4 below in one shot, then prints the final state of
all three tables for a quick eyeball-check. **Only re-run Step 3
(`node scripts/announce-farmbot.js`) first if the copy or hero image changed since
2026-09-09** — otherwise skip straight to the block above. After running it, work
through Step 5's verification checklist on a real device.

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

## Step 2 — ✅ ALREADY DONE (2026-09-09): the bot_schedules row, added WHILE STILL PRIVATE

**Deliberately decoupled from the public flip** (Kevin, 2026-09-09: "can you add
farmbot to the actively posting schedule now? before we flip it live... so that it
starts auto posting along with the other bots, it'll just be hidden until we flip
it"). Adding this row does NOT expose FarmBot to anyone — `bot_schedules` only
controls the render-and-post cadence; visibility is governed entirely by
`users.is_public` (Step 1, still unflipped) and the RLS/feed-candidacy rules
verified earlier (`get_feed`, `get_bot_users` — see `FARMBOT_PATH_BUILD_STATE.md`).
So FarmBot now posts automatically every ~12h via the real cron
(`.github/workflows/bots-dispatcher.yml`, every 15 min), building up a real,
naturally-varied post history under real production conditions, while remaining
visible only to the supreme admin (the single existing follow) until Step 1 runs.
This is a genuine pre-launch soak — the exact same cadence machinery every other
live bot uses, just with the account still dark.

**Executed row** (`bot_name='farmbot', posts_per_day=2, phase_seed=1244`):
`next_due_at` computed to `2026-09-09T08:36:00Z` (~2h out from creation at
`06:32:05Z` — comfortably under the 6h auto-deactivate window, gotcha 3 below).
Re-check `bot_schedules` before go-live to confirm it's still `active=true` with a
healthy `consecutive_failures` count and no `last_failure_reason`.

FarmBot currently has **no** `bot_schedules` row by design (private bots never
auto-post — the dispatcher is schedule-row-driven, not `bot.paths`-driven, see
`index.js`'s header comment). `posts_per_day = 2` is the correct value — verified
live across all 19 existing rows, zero exceptions, as of 2026-09-09.

**The 3 gotchas below are kept as reference** (for the next bot that needs this
same treatment) — they don't need re-doing for FarmBot, this step is done.

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
1. ✅ DONE (2026-09-09) `bot_schedules`: INSERT with `active=false` + a
   `phase_seed` in `[0,1440)`, THEN a separate `UPDATE ... SET active=true`
   (fires the trigger that actually computes `next_due_at` — a bare INSERT
   never does), THEN confirm `next_due_at` lands well under 6h out — FarmBot is
   now posting automatically every ~12h, exactly like every other bot, while
   staying fully hidden (posting cadence and public visibility are independent
   knobs — see Step 2 above)  →
2. `users.is_public = true` for FarmBot (already `is_bot=true`, no registry to
   touch — Bots tab picks it up automatically) — the remaining step that
   actually makes it visible  →
3. re-run `announce-farmbot.js` only if copy/image changed  →
4. `SELECT activate_announcement('farmbot-launch');`  →
5. verify: sheet shows once on 1.2.0+ existing accounts, never on 1.1.x or new
   signups; confirm FarmBot's next scheduled post lands and is now publicly
   visible. (The `min_app_version = '1.2.0'` gate itself needed zero
   go-live-time setup — it was set the moment this runbook was
   written.)
