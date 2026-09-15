# Dream Cast (multi-cast +1) — go-live runbook

The ordered sequence for launching the new Dream Cast screen and its announcement.
Same shape as `FARMBOT_GOLIVE_RUNBOOK.md`; the generalized pattern lives in the
`release` skill.

---

## What is already live, and what is not

| piece                                                         | state                                                                         |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| The nightly roll (multi-cast, round robin, relationship gate) | **LIVE since 2026-09-15**, edge fn deployed                                   |
| The Dream Cast screen (switches, panels, names, photo tip)    | in `main`, **not in any shipped binary**                                      |
| `dream-cast-launch` announcement row                          | in production, **DARK** (`is_active=false`), gated `min_app_version: '1.4.0'` |

**Nothing about anyone's dreams has changed yet, and that is by design.** `enabled`
can only be written by the new client, so every production user still falls through
the back-compat rule (`p.enabled ?? p.id === active_partner_id`) and their one Dream
Partner remains their only eligible +1. Verified against all 77 production recipes:
every user with a roster resolves to exactly 1 in-dreams member — their current
partner — with the rest backstage, which is precisely the mapping we want. Zero
users lose their +1.

---

## The sequence

1. **Ship 1.4.0.** `./scripts/release.sh 1.4.0` → local build → `eas submit` → attach
   in ASC → Submit for Review. The announcement's version floor is already `1.4.0`,
   so nothing here needs changing when the build number lands.
2. **Wait for Apple to approve and the build to be live** ("Ready for Sale"). There
   is no way to poll this; Kevin says so.
3. **Log the row in `RELEASES.md`.**
4. **App update gate** (`engine_config`, System 1 — NOT the announcement's version
   gate). Soft nudge is the safe default:
   ```sql
   UPDATE public.engine_config SET latest_app_version = '1.4.0';
   -- and only on an explicit call for a hard block:
   -- UPDATE public.engine_config SET min_app_version = '1.4.0';
   ```
5. **Flip the announcement live:**
   ```sh
   node scripts/announce-dream-cast.js --golive
   ```
   That one command does all three things the skill requires, in order, and refuses
   to run if the row went live early:
   - guards on `announcement_seen` (any NON-admin row means it leaked; it stops)
   - `activate_announcement('dream-cast-launch')` — atomically deactivates
     `farmbot-launch`, activates this, and **resets `starts_at`**, which is what makes
     `existing_users_only` mean "everyone who existed at the flip" rather than
     whenever the row was first written
   - deletes Kevin's own `announcement_seen` row
6. **Verify on a real device.** Force-quit, do not background: `useAnnouncement.ts`
   caches the query in-session and will happily serve the stale answer.
   - the sheet shows once on an existing 1.4.0+ account
   - "Set up your cast" routes to `/settings/dream-cast`
   - dismissing marks it seen and it never returns
   - a client below 1.4.0 never sees it
   - a brand-new signup after the flip never sees it

---

## The trap this script exists to avoid

**Every admin preview marks the announcement seen.** The supreme admin is exempt from
the _version_ check (so a preview is possible on an older dev build) but NOT from the
shows-exactly-once check, by design. So a preview from hours or days earlier silently
consumes Kevin's own view of the real sheet, and he opens the app at launch to
nothing. That happened on 2026-09-09 with FarmBot. Step 5 clears it as part of the
flip rather than after someone notices.

---

## Rollback (same day)

```sql
UPDATE public.announcements SET is_active = false WHERE id = 'dream-cast-launch';
```

The feature itself needs no rollback: the screen is in the binary, and the engine's
back-compat rule means a user who never opens it behaves exactly as they do today.

---

## Open

- **No hero image.** `image_url` is null. The obvious hero is a dream starring two
  people, and every real one of those is somebody's actual face, so it needs a
  purpose-made render rather than a borrowed post. One line to add once we have one.
