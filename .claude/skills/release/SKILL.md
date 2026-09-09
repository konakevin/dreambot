---
name: release
description: The full DreamBot release playbook — version bump/tag/build/submit to App Store Connect, the TWO different "min version" gates (don't confuse them), the announcements system for launch sheets, and the admin-account reset step that prevents the agent's own preview testing from silently blocking a real launch. Use whenever Kevin says "cut a build," "ship it," "get a build ready for ASC," "bump the required version," "commence launch operation for <feature>," or asks to release a new version / launch a gated feature/bot.
---

# Release Captain — DreamBot's full ship-to-ASC + feature-launch playbook

You run releases end-to-end without asking Kevin to run steps himself (standing directive,
`RELEASE.md`) — he does not want to hand-run builds/submits or re-explain this. The one
thing genuinely outside your reach: the App Store Connect web UI (attach build, screenshots,
review notes, **Submit for Review**) — no ASC API/browser tool exists here, so that click is
always Kevin's. Everything else — version bump, tag, local build, submit, DB flips,
announcement activation, RELEASES.md logging — is yours.

Deep reference for the raw build/submit mechanics (local-build gotchas, FB URL scheme fix,
Sentry source maps, EAS quota): `RELEASE.md`. This skill is the actionable playbook,
including the two things that actually caused real incidents (2026-09-09, FarmBot launch):
confusing the two "min version" systems, and not resetting the admin's own preview state
before flipping a feature live.

## ⚠️ There are TWO unrelated "min version" systems — never conflate them

This is the single most likely point of confusion, and it already caused real breakage
once. When Kevin says "bump the required version," **ask yourself which one he means** —
usually it's #1, but a feature launch needs #2 as well, and they are set completely
differently.

| | System 1: the APP update gate | System 2: an ANNOUNCEMENT's version gate |
|---|---|---|
| **Table/column** | `engine_config.min_app_version` / `engine_config.latest_app_version` (ONE row, singleton) | `announcements.min_app_version` (per-row, one per announcement) |
| **What it gates** | The WHOLE APP — `components/ForceUpdateGate.tsx`, root-mounted, reads `Constants.expoConfig.version` vs these two columns | ONE promotional sheet's eligibility — `hooks/useAnnouncement.ts` + `lib/announcementEligibility.ts` |
| **Effect when triggered** | `min_app_version`: blocking, non-dismissible "Update Required" wall, no admin exemption. `latest_app_version`: dismissible "Update available" nudge. | The sheet just doesn't show to that client. No blocking, no wall. |
| **When to set it** | AFTER Apple approves and the build is live ("Ready for Sale") — never before, or you nudge users toward a version they can't download yet. `min_app_version` especially: never set it ahead of the version actually being live, or you lock everyone out with no upgrade path. | Can be set WAY ahead of time — it's just a string comparison baked into the announcement row at creation. FarmBot's was set via migration days before the actual launch. |
| **Who's exempt** | Nobody. Not even the supreme admin (`lib/superAdmin.ts`) — confirmed by reading the component, no `isSupremeAdmin` check anywhere in `ForceUpdateGate.tsx`. If your own dev device is below `min_app_version`, YOU get hard-blocked too. | The supreme admin IS exempt (migration 483 RLS carve-out + a client-side exemption in `useAnnouncement.ts`, added 2026-09-09) — lets you preview a version-gated announcement on your own older dev build. |
| **How to bump** | `UPDATE public.engine_config SET latest_app_version = '1.2.0', min_app_version = '1.2.0';` (decide soft-only vs hard — see below) | Set once in the announcement's own creation script (e.g. `scripts/announce-<feature>.js`), not something you "bump" at ship time. |

**Soft vs hard on the app update gate — ask, don't assume:**
- `latest_app_version` only (leave `min_app_version` behind) → dismissible nudge, nobody locked out. Safe default right after shipping, in case something needs a fast rollback.
- Both set to the new version → immediate hard block on everyone below it. Only do this on explicit request — it has zero escape hatch, not even for the admin.

## The core version release (every release, whether or not it launches a gated feature)

1. **Green `main`.** Clean tree (explicit-path check — `git status --porcelain`; `release.sh`
   refuses on a dirty tree, including another agent's untracked WIP), pushed, CI green.
2. **DB migrations applied** (`node scripts/apply-migration.mjs <NNN>`) and **edge functions
   deployed** (`supabase functions deploy <name> --no-verify-jwt`) if this release depends on
   either — neither ships inside the binary, so land them before or alongside the build, not
   after.
3. **Bump + tag + push:** `./scripts/release.sh <X.Y.Z>` — bumps `app.config.js`'s
   `expo.version` (the single source of truth; `package.json`'s version field is unused,
   kept aligned best-effort only), runs `npm run check`, commits `Release vX.Y.Z`, creates an
   **annotated** tag (`git tag -a`, not lightweight), pushes both commit and tag.
   - **Tag timing (Kevin, 2026-09-09): the tag should mark a build actually shipped to ASC,
     not just a version bump.** `release.sh` currently tags at bump-time, before the build
     even exists — treat the tag as provisional until the build lands; if a build fails or
     you need to change something before submitting, it's fine that the tag already exists on
     that commit, just don't treat "tagged" as "shipped." `RELEASES.md`'s own row is the real
     record of what actually reached ASC and its status.
4. **Build locally, in the background** (the Expo Free plan caps cloud builds/month; local
   produces an identical signed IPA using the same remote credentials):
   ```sh
   nohup eas build --local -p ios --profile production --non-interactive \
     --output ./build-<X.Y.Z>.ipa > /tmp/eas-build-<X.Y.Z>.log 2>&1 &
   ```
   Poll the log until the IPA lands (~15-30 min). A plain `run_in_background` Bash call may be
   permission-denied here — the detached `nohup … &` form launches and returns immediately.
5. **Submit:**
   ```sh
   eas submit -p ios --profile production --path ./build-<X.Y.Z>.ipa --non-interactive
   ```
6. **Log the row in `RELEASES.md`** — build number from `eas build:list --limit 1`, status
   "Submitted (processing at Apple)" for now.
7. **Hand off to Kevin, explicitly:** attach the processed build to the version in ASC,
   screenshots (iPhone 6.7" required; iPad 13" required — `supportsTablet: true` — slots only
   appear after an iPad-capable build processes), review notes, **Submit for Review**. Apple's
   24-48h clock doesn't start until that click. Tell him this plainly rather than implying the
   release is "done" — it isn't, until Apple approves.
8. **Once Kevin confirms it's live / "Ready for Sale" in ASC** (you have no way to poll this
   yourself — wait for him to say so): update the `RELEASES.md` row status to "Released," then
   run the app update gate decision above (soft nudge is the safe default), then continue to
   the feature-launch section below if this release ships a gated feature.

## Launching a gated feature/bot alongside a release (the announcements system)

This is the pattern behind FarmBot's launch (`FARMBOT_GOLIVE_RUNBOOK.md`) and the locations
launch before it (`LOCATION_GOLIVE_RUNBOOK.md`) — write a fresh `<FEATURE>_GOLIVE_RUNBOOK.md`
for any future one, following this same shape, and this skill is the generalized version of
that pattern.

**Design the announcement well BEFORE the version ships**, so nothing is a scramble at
go-live:
- `scripts/announce-<feature>.js` upserts one row into `public.announcements`: `id`, `title`,
  `body`, `cta_label`/`cta_route`, `style: 'sheet'`, `audience` ('all' or 'pro'),
  `existing_users_only` (true = only users who existed before go-live ever see it —
  brand-new post-launch signups never see a "new!" sheet for something that was always in
  their app), and **`min_app_version`** (System 2 above — the marketing-version string floor,
  known ahead of the actual build, unlike `min_build` which needs EAS to mint a real build
  number first). Ships with `is_active: false` — dark until go-live.
- Confirm client-side eligibility is correct with real tests, not just re-explained logic —
  see `lib/announcementEligibility.ts` + `__tests__/lib/announcementEligibility.test.ts` for
  the pattern: shows-exactly-once, version-gated both directions, admin-preview-bypasses-
  version, audience gating, fails open on a null/malformed version.

**At the actual go-live moment** (after Apple approves AND the feature/bot itself is fully
QA'd and ready):
1. Flip the feature public (e.g. `UPDATE public.users SET is_public = true WHERE username =
   '<Bot>';` for a bot launch, or whatever the feature's own visibility flag is).
2. `SELECT activate_announcement('<feature>-launch');` — migration 484's RPC atomically
   deactivates whatever announcement is currently live and activates this one, AND resets
   `starts_at = now()` in the same transaction. That `starts_at` reset matters: the
   `existing_users_only` gate is `users.created_at < announcements.starts_at`, so firing this
   at the real go-live moment (not whenever the row was first upserted, maybe days earlier) is
   what makes "existing users" actually mean "everyone who existed before the flip."
3. **⚠️ CLEAR THE ADMIN'S OWN `announcement_seen` ROW — do this as part of step 2, not after
   Kevin reports it's broken.** This is the actual incident (2026-09-09): the supreme admin's
   version/build exemption in `useAnnouncement.ts` lets Kevin preview the sheet on his own dev
   build ANY TIME before go-live — but every preview marks `announcement_seen`, and the
   "shows exactly once" logic (correctly, by design) has NO admin exemption on the seen-check,
   only on the version-check. So a preview from hours or days before the real launch silently
   pre-consumes Kevin's own view of the REAL live sheet, and he sees nothing when he opens the
   app post-launch expecting to. Fix as part of the go-live script, always:
   ```sql
   DELETE FROM announcement_seen
   WHERE announcement_id = '<feature>-launch'
     AND user_id = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'; -- Kevin's user id
   ```
   Sanity-check first with a `SELECT count(*) FROM announcement_seen WHERE announcement_id =
   '<feature>-launch';` — if it's more than 1 (i.e. more than just Kevin's own preview
   activity), STOP and investigate before deleting anything; a nonzero count from other real
   users this early is a different problem (the row went live prematurely) and needs a
   different fix than a delete.
4. Verify: `SELECT is_active, min_app_version, starts_at FROM announcements WHERE id =
   '<feature>-launch';` and `SELECT count(*) FROM announcements WHERE is_active = true;` (the
   migration-484 unique index caps this at 1 — confirm it's the RIGHT one).
5. On a real device: sheet shows once on an existing 1.x.y+ account, CTA routes correctly,
   dismiss/tap marks it seen and it never reappears; an old-version client never sees it; a
   brand-new post-launch signup never sees it.
6. **Force-quit, not just background, to see a fresh eligibility check** — `useAnnouncement.ts`
   caches the query in-session; a background/foreground cycle may serve the cached (stale)
   answer instead of re-querying.

**Rollback** (same-day, if something looks wrong post-flip): deactivate the announcement
(`UPDATE announcements SET is_active = false ...`), stop the feature posting/being visible
(deactivate, don't delete — preserves history for a clean re-enable), re-privatize if it's a
bot. None of this touches render/content history.

## Quick disambiguation cheat-sheet (say this back to Kevin if a request is ambiguous)

- "Bump the required version" (no other context) → almost always System 1, the app update
  gate (`engine_config`). Confirm soft vs hard before running it.
- "Set up the version gate for the <feature> announcement" → System 2
  (`announcements.min_app_version`), set once at announcement-creation time, no run-time
  "bump" needed at ship time.
- "Launch <feature>" / "commence launch operation" → the full feature-launch section above:
  public flip + `activate_announcement` + **the admin seen-row clear** + device verification.
  Don't stop at just the public flip.
