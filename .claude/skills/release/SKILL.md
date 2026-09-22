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
   produces an identical signed IPA using the same remote credentials).
   **CHECK FREE DISK FIRST — `df -h /System/Volumes/Data`, and do not start under ~15 GB free**
   (2026-09-19: the 1.5.0 build ran the machine to 118 MB and died mid-compile; worse, once the
   volume is full EVERY tool call fails with `ENOSPC` because it cannot write its own output
   file, so you go blind and have to have Kevin run the cleanup by hand). A local iOS build
   needs ~10-15 GB of headroom. Safe reclaims, in order, none of it real data:
   `~/Library/Developer/Xcode/iOS DeviceSupport/*` (re-copied from a device),
   `~/Library/Developer/Xcode/DerivedData/*` (pure cache), `npm cache clean --force`, and the
   dead build's own temp at `$TMPDIR/eas-build-local-nodejs` (several GB — always delete this
   after a failed build). Ask before touching Xcode Archives (dSYMs) or simulators.
   Also `eas` lives in the nvm node path: source nvm first (`export NVM_DIR="$HOME/.nvm" &&
   source "$NVM_DIR/nvm.sh"`) or `npx eas` fails with "could not determine executable to run".
   Launch it detached:
   ```sh
   nohup eas build --local -p ios --profile production --non-interactive \
     --output ./build-<X.Y.Z>.ipa > /tmp/eas-build-<X.Y.Z>.log 2>&1 &
   ```
   A plain `run_in_background` Bash call may be permission-denied for the LAUNCH itself — the
   detached `nohup … &` form launches and returns immediately.

   **Then ARM A WATCH on it and carry straight on to the submit when it lands. Do NOT check
   the log once and hand back a "still building" status** (Kevin, 2026-09-22: "why didn't you
   catch it and auto submit it on your own? this is supposed to happen during the release
   skill process"). The build takes 15-30 min, and a status report parks the pipeline until he
   thinks to ask — the IPA sat finished for minutes that way. Immediately after launching:
   ```sh
   # Bash tool, run_in_background: true — completion re-invokes you
   until ! ps -p <pid> >/dev/null 2>&1; do sleep 5; done; echo DONE; tail -20 /tmp/eas-build-<X.Y.Z>.log
   ```
   Watch the SUBMIT the same way. The whole pipeline through step 7 runs without him prompting
   between steps; the first thing he should have to do is the ASC web UI.
5. **Verify the IPA before submitting** — `unzip` it and confirm `CFBundleShortVersionString`
   is the version you just tagged AND that the env vars actually baked in (a real `phc_…`
   PostHog key and the Supabase project ref present in the bundle, no literal
   `$EXPO_PUBLIC_*`). `eas.json`'s `"$VAR"` form only expands for legacy secrets, and a
   clobber ships analytics dead to a release build with nothing in the log to say so
   (`project_eas_env_literal_clobber`). Takes seconds; catches a whole release.

6. **Submit:**
   ```sh
   eas submit -p ios --profile production --path ./build-<X.Y.Z>.ipa --non-interactive
   ```
7. **Log the row in `RELEASES.md`** — build number from `eas build:list --limit 1`, status
   "Submitted (processing at Apple)" for now.
8. **Write the App Store release notes and hand them to Kevin — every submit, unasked**
   (Kevin, 2026-09-19). The moment the submit lands, produce the "What's New" text for this
   version and print it IN CHAT as a plain bulleted list he can paste straight into ASC. Do not
   bury it in a file, and do not wait to be asked.
   - **Source it from the real diff, not memory:** `git log --format='%h %s' v<prev>..v<new>
     --no-merges`, then keep only what a USER can see in the binary.
   - **Write it user-facing.** Feature name in bold, then one plain sentence about what the
     person can now do. No migration numbers, no table/column names, no internal engine words
     (`narrative_fg`, `dream_queue`, `looks_minimal`), no commit hashes, no percentages from a
     lab round. If a bullet only makes sense to us, cut it.
   - **Server-side work still counts** when the user can SEE it — nightly quality, framing,
     reliability — because it is new to them in this version even though it shipped earlier.
     Fold it into one benefit line ("Better nightly dreams"), never a changelog of the engine.
   - **Length:** 4-7 bullets. Lead with the headline feature, close with a polish/reliability
     line that sweeps up the small stuff.
   - The `RELEASES.md` row (step 7) stays the ENGINEERING record — detailed, internal, with
     migration numbers. These notes are the opposite audience. Never paste one into the other.
9. **Hand off to Kevin, explicitly:** attach the processed build to the version in ASC,
   screenshots (iPhone 6.7" required; iPad 13" required — `supportsTablet: true` — slots only
   appear after an iPad-capable build processes), review notes, **Submit for Review**. Apple's
   24-48h clock doesn't start until that click. Tell him this plainly rather than implying the
   release is "done" — it isn't, until Apple approves.
10. **Once Kevin confirms it's live / "Ready for Sale" in ASC** (you have no way to poll this
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

---

## Go-live runbook: flipping a finished release live (verified end-to-end, v1.4.0, 2026-09-18)

The 1.4.0 ship was a *pure go-live* — the build was already approved and on the App Store, so
none of the build/submit machinery applied. Only DB flips. This section is the exact sequence,
the copy-paste SQL, and the four things that actually had to be looked up because they were not
written down. Read this first when Kevin says "the build is live, flip it on."

### The one-sentence mental model
`engine_config` decides **who may open the app at all**. `announcements` decides **who sees a
what's-new sheet once inside**. They are independent, and an announcement's version floor never
activates anything on its own.

### Step 1 — App update gate (System 1)
```sql
-- HARD (locks out everyone below; Kevin asked for exactly this on 1.4.0)
UPDATE public.engine_config SET min_app_version = '1.4.0', latest_app_version = '1.4.0';
-- SOFT (dismissible nudge only) — leave min_app_version at the previous version
UPDATE public.engine_config SET latest_app_version = '1.4.0';
SELECT min_app_version, latest_app_version FROM public.engine_config;   -- verify
```
⚠️ **Warn Kevin every time on a hard flip:** `ForceUpdateGate` has **no admin exemption**, so if
his own test device is below the new floor he is hard-walled and cannot test anything —
including the announcement he just asked you to set up. Tell him to install the new build from
the App Store *first*. (On 1.4.0 he confirmed "that's the point, to lock everyone out until they
have 1.4.0" — hard is a legitimate ask, just never assume it.)

### Step 2 — Make the right announcement live
**`is_active` is a SEPARATE MANUAL FLIP.** This was the actual point of confusion on 1.4.0:
Kevin assumed an announcement with `min_app_version = '1.4.0'` would start showing once 1.4.0
shipped. It does not. The version floor only decides *who is eligible once the row is already
active*. Something must activate it.

```sql
-- see everything at once before touching it
SELECT id, is_active, audience, existing_users_only, min_app_version, starts_at, title
FROM public.announcements ORDER BY is_active DESC, starts_at DESC;

SELECT activate_announcement('<feature>-launch');  -- atomic: deactivates the current one,
                                                   -- activates this one, resets starts_at = now()
SELECT count(*) FROM public.announcements WHERE is_active = true;  -- must be exactly 1
```
- **Only ONE announcement can be active** (migration 484 unique index). Activating a new one
  **automatically deactivates the previous one** — on 1.4.0 this superseded `farmbot-launch`.
  Say this out loud to Kevin: any existing user who never saw the old sheet now never will. The
  row is deactivated, not deleted, so history is preserved and it could be re-activated.
  Deactivating a *sheet* does not touch the feature/bot itself — FarmBot stayed public and kept
  posting.
- `min_app_version` on an announcement is a **floor (>=), not an exact match**. `'1.4.0'` shows
  to 1.4.0 **and every version above it**. Pre-empt this — Kevin asked "is that not how it's
  working?" about exactly this.
- **Nice property worth pointing out:** once the app gate hard-blocks below X, every user who
  can open the app already passes an announcement floor of X, so the announcement's own version
  gate becomes redundant. The two systems agree, which is the safe direction.

### Step 3 — Clear Kevin's seen row (always, as part of go-live)
Already covered above, but the verified shape:
```sql
SELECT count(*) AS total, count(*) FILTER (WHERE user_id = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec') AS kevins
FROM announcement_seen WHERE announcement_id = '<feature>-launch';
-- total = 1 and kevins = 1 is the EXPECTED pre-consumed-preview case → safe to delete.
-- total > kevins means real users already saw it → STOP and investigate first.
DELETE FROM announcement_seen
WHERE announcement_id = '<feature>-launch' AND user_id = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
```
Activation does **not** clear seen rows — verify the delete still reads 0 *after* activating.

### Step 4 — Verify, and tell Kevin how to test
- Exactly one active announcement, and it is the intended id.
- `starts_at` is the activation moment (not the row's creation date).
- Kevin must be on the new build (Step 1 walls him otherwise), and must **force-quit** —
  `useAnnouncement.ts` caches the eligibility query in-session, so background/foreground can
  serve a stale answer.

### The new-install gate — where it actually lives (asked on 1.4.0; confirm from these, not memory)
It is **server-side RLS**, so no client can bypass it. `lib/announcementEligibility.ts` does
**not** check it — that file's own header says `is_active` / `starts_at` / `ends_at` /
`existing_users_only` are RLS-only.
```sql
-- policy announcements_read (migrations 333, 445)
is_active AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now())
  AND (NOT existing_users_only OR account_created_before(starts_at))

-- public.account_created_before(ts): STABLE SECURITY DEFINER
SELECT COALESCE((SELECT u.created_at FROM public.users u WHERE u.id = auth.uid()) < ts, false)
--                                                        ^ unknown user → FALSE → hide (fails CLOSED)
```
So a brand-new post-launch signup never sees a "new!" sheet, and the failure mode is to hide
rather than leak. Because `activate_announcement` resets `starts_at = now()`, "existing users"
means *everyone who existed at the moment you flipped it*, which is why firing it at the real
go-live moment matters.

### Admin preview: Kevin can test an announcement that is still DARK
RLS policy `announcements_admin_preview` is simply `auth.uid() = '<Kevin>'` — it lets his
account read **any** announcement row regardless of `is_active`, `starts_at`, or
`existing_users_only`. Combined with the client-side admin bypass of the version gates in
`selectEligibleAnnouncement`, this means: **clearing his seen row alone is enough for him to
re-test a sheet without activating it publicly.** Offer that when he wants to preview before
committing to a launch — it has zero blast radius, whereas activating supersedes whatever is
currently live.

### Client-side gate order (`lib/announcementEligibility.ts`, for reference)
1. not already seen · 2. `style === 'sheet'` · 3. audience matches · 4. **admin bypasses 5+6** ·
5. `min_build` · 6. `min_app_version`. Fails **open** on a null/malformed version, and
`build === 0` (unreadable native build) also passes.

### Cheat-sheet additions
- "The build is live, flip it on" → Step 1 (confirm soft vs hard) **+ Step 2** (activate the
  right announcement — it will NOT turn itself on) + Step 3 (clear Kevin's seen row).
- "Only the <X> announcement should be active" → `SELECT activate_announcement('<X>')`; it
  deactivates the other one for you. Then confirm `count(*) WHERE is_active = true` is 1.
- "Why isn't the announcement showing?" → check in this order: `is_active`, then `starts_at <=
  now()`, then `existing_users_only` vs the account's `created_at`, then the seen row, then the
  version floor. Not the version floor first — that is rarely the cause.
