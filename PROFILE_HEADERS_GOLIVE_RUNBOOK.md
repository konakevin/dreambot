# Profile headers (Dreamscape) — go-live runbook

The ordered sequence for launching profile headers in 1.8.0. **No announcement sheet**
(Kevin, 2026-09-25): people discover headers through their own profile (the "Add a
header" strip, tapping the header), Edit Profile, the dream long-press menu, and the
bots' profiles, which already show headers.

---

## What is already live, and what is not

| piece                                                                                               | state                                                                                                            |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| DB: header columns, `get_header_suggestions`, quarantine cleanup trigger (migs 554, 554a, 555, 556) | **LIVE**                                                                                                         |
| Edge fn `set-profile-header` (validates, COPIES the picture into the member's folder)               | **LIVE**, deployed `--no-verify-jwt`                                                                             |
| The 18 bot headers (copies) + bot taglines (`users.bio`)                                            | **LIVE** in the DB. The taglines already show on today's profiles.                                               |
| `engine_config.profile_headers_enabled`                                                             | **true** since 2026-09-25 (flipped before App Review so the reviewer sees the feature; only 1.8.0+ has the code) |
| The app code (banner, picker, Edit Profile panel, long-press rows, bot-header prefetch)             | committed `bf03fce7`; ships in **1.8.0 build 60** (submitted 2026-09-25)                                         |

Flipping the flag early changes nothing for users, because builds below 1.8.0 have no header code.

---

## The sequence

1. **Commit the header work to `main`.** Stage explicit paths only, and read `git diff --cached` first. The shared tree also holds other sessions' WIP. `release.sh` refuses a dirty tree, so that WIP has to be committed or cleared by its owners first.
2. **Ship 1.8.0.** Run `./scripts/release.sh 1.8.0`, then the local build, then the direct `altool` upload (DONE: build 60, 2026-09-25). Kevin then attaches the build in ASC and taps Submit for Review.
3. **(DONE 2026-09-26: live on the App Store)** **Wait for Apple to approve and the build to be live** ("Ready for Sale"). Kevin reports this.
4. **Log the row in `RELEASES.md`.**
5. **App update gate** (`engine_config`). (DONE 2026-09-26: Kevin chose the HARD gate, `min_app_version = latest_app_version = 1.8.0`.) A soft nudge is the safe default:
   ```sql
   UPDATE public.engine_config SET latest_app_version = '1.8.0';
   -- and only on an explicit call for a hard block:
   -- UPDATE public.engine_config SET min_app_version = '1.8.0';
   ```
6. **Turn the feature on** (DONE 2026-09-25, before review):
   ```sql
   UPDATE public.engine_config SET profile_headers_enabled = true;
   SELECT profile_headers_enabled FROM public.engine_config;   -- verify
   ```
7. **Verify on a real 1.8.0 device**, with a non-admin account if possible (the admin sees everything regardless of the flag):
   - bot profiles show their headers
   - your own profile shows the "Add a header" strip, and Edit Profile shows the header panel
   - the picker sets a header
   - long-press on a dream or a bot post shows "Use as profile header"
   - a header survives its source post being deleted (it's a copy)

## Rollback (same day, no deploy)

```sql
UPDATE public.engine_config SET profile_headers_enabled = false;  -- hides banner, picker, entry points
```

Headers people already set stay in the DB and reappear if the flag is turned back on.
