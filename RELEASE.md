# RELEASE.md — cutting a new iOS build to App Store Connect

The repeatable runbook for building DreamBot and shipping it to App Store Connect.
For the one-time first-launch history and the wider go-live checklist, see
`LAUNCH.md`. The shipped-build ledger (tag ↔ build ↔ commit) is `RELEASES.md`.

## TL;DR

**New marketing version** (user-visible, e.g. `1.0.1` → `1.0.2`) — let the helper
do the bump + tag + push, then build:

```sh
./scripts/release.sh 1.0.2          # bumps app.config.js, runs checks, commits, tags v1.0.2, pushes
eas build -p ios --profile production --auto-submit
```

**New build of the SAME version** (resubmit after a rejection / TestFlight iter) —
no bump, no helper, just rebuild (EAS auto-increments the build number):

```sh
eas build -p ios --profile production --auto-submit
```

Then finish in ASC (attach build, screenshots, review notes, Submit), bump the
`engine_config` update gate, and add a row to `RELEASES.md`. Full ordered
checklist below.

## Local build + submit (when the EAS cloud quota is exhausted)

The Expo account is on the **Free plan**, which caps **iOS CLOUD builds per
month**. When it's used up, `eas build -p ios ...` fails at scheduling with:

```
This account has used its iOS builds from the Free plan this month,
which will reset in N days (on the 1st).
Error: build command failed.
```

That is NOT a code failure. Build LOCALLY instead — same pipeline, same signing,
runs on this Mac instead of Expo's servers. It produces the identical
App-Store-signed IPA (it uses the SAME remote credentials — the Distribution
Certificate + provisioning profiles pulled from the Expo server — and resolves
the SAME `production` EAS environment).

```sh
# One-time prereq: eas build --local needs fastlane on PATH, or it dies with
# "spawn fastlane ENOENT". Homebrew installs a self-contained copy (no sudo):
brew install fastlane

# Build the signed IPA locally (~15-30 min: prebuild → pods → archive → export).
# The Facebook app id resolves from .env.local automatically (see the FB gotcha
# below) — no manual env export needed.
eas build --local -p ios --profile production --non-interactive --output ./build-<X.Y.Z>.ipa

# Upload that IPA to App Store Connect (stored ASC API key, no Apple prompts):
eas submit -p ios --profile production --path ./build-<X.Y.Z>.ipa --non-interactive
```

Make sure `.env.local` has real `FACEBOOK_APP_ID` + `FACEBOOK_CLIENT_TOKEN`
values (it does on Kevin's Mac) — the local build reads them from there.

Then finish in ASC exactly as with a cloud build (§4), bump the update gate (§5),
and log it in `RELEASES.md` (§ How to add a row).

Notes / gotchas for the local path:
- **The FB URL scheme (root-caused + fixed 2026-07-20; know why it took 5 builds).**
  `FACEBOOK_APP_ID` / `FACEBOOK_CLIENT_TOKEN` were EAS **secret** env vars,
  referenced in `eas.json` as `"$FACEBOOK_APP_ID"`. Two problems stacked:
  (a) EAS **secrets can't be read by `eas build --local`** (only on the cloud
  builder), and (b) even after fixing (a), eas.json's build-profile `env` block
  **overrides** the environment var with its own value — and `"$FACEBOOK_APP_ID"`
  does NOT interpolate locally, so it stayed the literal string. Either way the
  build baked the URL scheme `fb$FACEBOOK_APP_ID`; the build + signing SUCCEED but
  `eas submit` fails at Apple validation (409: *"URL schemes … not in the correct
  format: [fb$FACEBOOK_APP_ID]"*). **The actual fix (two parts, both done):**
  1. Changed both vars from **secret → sensitive** on EAS (a FB App ID is public —
     it's in the app binary — so it never needed to be secret). Secrets can't be
     downgraded in place, so it was `eas env:delete` + `eas env:create --visibility
     sensitive` across production/preview/development. Now readable by local builds.
  2. **Removed** the `FACEBOOK_APP_ID` / `FACEBOOK_CLIENT_TOKEN` lines from all three
     `eas.json` `env` blocks, so the real EAS-stored values flow through instead of
     being clobbered by the un-interpolated `"$..."` literal (cloud + local both).
  `app.config.js` also has a `.env.local` fallback for pure local dev, but the two
  changes above are what make `eas build --local` produce a submittable IPA.
  (Exporting the vars into the shell does NOT help — eas.json's env wins over it.)
- **Build number still auto-increments** from the remote source (`appVersionSource:
  remote`). A FAILED cloud attempt ALSO increments it, so the number can jump
  (1.0.9 landed on build 27 after the quota-failed cloud attempt + retries bumped
  it past 25/26). Harmless — ASC only needs each upload's build number to be
  higher than the last one it accepted.
- **Ignore the transient widget-version warning** during the build:
  `The CFBundleVersion of an app extension ('1') must match that of its
  containing parent app ('27')`. It fires mid-build BEFORE the version-sync step;
  the final signed IPA has the app AND the `DreamBotWidget.appex` at the SAME
  build number (verify if paranoid: `unzip -p build-<ver>.ipa
  'Payload/*.app/PlugIns/*.appex/Info.plist'` → CFBundleVersion). Not fatal; the
  archive that gets signed is correct.
- **Sentry source-maps**: a local build may SKIP the debug-symbol upload
  (`SENTRY_DISABLE_AUTO_UPLOAD=true` in the gitignored `ios/.xcode.env.local`, or
  a missing auth token), so crash traces FROM A LOCAL BUILD are less symbolicated
  in Sentry. Signing / App Store validity / runtime behavior are unaffected — this
  is purely internal crash-report readability. Cloud builds upload maps reliably.
- The `.ipa` (~35 MB) lands at `./build-<ver>.ipa` and is **gitignored**
  (`build-*.ipa`) — don't commit it; delete it after submitting if you like.

## The full ordered checklist (a new marketing version)

1. **Green `main`.** Clean tree, pushed, CI green. The build bakes COMMITTED code.
2. **DB migrations applied** in the Supabase dashboard SQL editor (they are NOT in
   the binary — apply before the build goes live if the release depends on them).
3. **Edge functions deployed** (`supabase functions deploy <name> --no-verify-jwt`)
   — also not in the binary; ship them first.
4. **Bump + tag + push:** `./scripts/release.sh <X.Y.Z>` (see §1). This is the ONE
   command that changes the version, commits `Release vX.Y.Z`, creates the
   annotated tag on that commit, and pushes both.
5. **Build + submit:** `eas build -p ios --profile production --auto-submit`.
6. **In App Store Connect** (§4): attach the processed build, screenshots, review
   notes, Submit for Review.
7. **Bump the update gate** in `engine_config` (§5) once the version is live —
   `latest_app_version` so older clients get the "update available" nudge.
8. **Log it:** add a row to `RELEASES.md` with the build number
   (`eas build:list --limit 1`) and ASC status.

## Git tags — the release demarcation points

Every SHIPPED build (submitted for App Store review — not every TestFlight iter)
gets an **annotated** git tag so the exact commit is a permanent, findable point.

- **Convention:** `v<marketing-version>` on the commit the build was cut from
  (`scripts/release.sh` creates it). e.g. `v1.0.2`.
- **Multiple builds of one version** (a resubmission after rejection): the extra
  builds get `v<version>-build<N>`, and `v<version>` stays on the build that was
  ultimately **approved**. Tag a resubmission by hand:
  `git tag -a v1.0.2-build11 <commit> -m "resubmit: <what changed>" && git push origin v1.0.2-build11`.
- **See what shipped:** `git tag -n1 -l 'v*'` (list + first message line), or
  `git show v1.0.1` (the tagged commit + full message). The build↔commit map is
  authoritative in `eas build:list` and mirrored in `RELEASES.md`.
- **The tag is annotated, not lightweight** — it carries date, message, and the
  build/ASC context. Don't use `git tag v1.0.2` (lightweight); the helper uses
  `git tag -a`.
- **Retroactive tags** for 1.0.0 (build 8, `9feb0c42`) and 1.0.1 (build 9,
  `80551918`) were created 2026-07-06 from `eas build:list`; that command is the
  source of truth if you ever need to tag an old build.

## Reference (IDs)

- **Bundle ID:** `com.konakevin.radorbad`
- **ASC app ID:** `6761505205`
- **Apple Team ID:** `43VMZ5KMW4`
- **EAS project:** `014926a1-297b-4abf-9184-a01979a83879` (owner `konakevin`)
- **Marketing version:** `app.config.js` -> `expo.version` (bump via
  `scripts/release.sh`; current value is whatever the latest `RELEASES.md` row says)
- **Build number:** owned by EAS (`appVersionSource: remote` in `eas.json`, plus
  `autoIncrement: true` on the production profile). Do NOT set it locally.
- **Release helper:** `scripts/release.sh <X.Y.Z>` — bump + check + commit + tag + push.
- **Release ledger:** `RELEASES.md` — every shipped build (tag ↔ build ↔ commit ↔ ASC status).
- **Latest shipped:** see `RELEASES.md` (top row). Tags: `git tag -n1 -l 'v*'`.

## 0. Pre-flight (before building)

- On `main`, working tree clean, and pushed. The build bakes whatever is
  committed, so `git status` clean + CI green first.
- Any new DB migrations applied in the Supabase dashboard SQL editor.
- Any changed edge functions deployed (`supabase functions deploy <name>
--no-verify-jwt`). Edge functions are NOT part of the app binary; they ship
  independently, so deploy them before the build goes live if a release depends
  on them.
- Logged into EAS: `eas whoami` (else `eas login` — interactive, needs the Expo
  account password, so run it yourself via `! eas login`).
- Production env vars present: `eas env:list --environment production` (Supabase
  URL + anon key, Google iOS client ID, PostHog, Sentry, Facebook).

## 1. Version vs build number

- **Marketing version** (`1.0.2`) is what users see (Settings → About reads
  `Constants.expoConfig.version`). It lives in **`app.config.js` → `expo.version`
  — the single source of truth.** `package.json` `version` is an npm field the app
  never reads; `scripts/release.sh` keeps it aligned best-effort, but it doesn't
  matter functionally.
- **Build number** is owned by EAS (`appVersionSource: remote` + `autoIncrement:
  true` on the production profile). Never set or hand-edit the iOS `buildNumber`.
- **New build of the SAME marketing version** (resubmit / TestFlight iter): change
  nothing, just rebuild — EAS bumps the build number.
- **New marketing version:** run `./scripts/release.sh <X.Y.Z>` (bumps
  `app.config.js`, runs `npm run check`, commits `Release vX.Y.Z`, tags, pushes).
  Do NOT hand-edit the version + forget the tag — that's exactly what the helper
  prevents.

## 2. Build

```sh
eas build -p ios --profile production
```

- Runs on EAS servers (~10-20 min). Signing credentials are EAS-managed, so no
  local certificates and no interactive prompts.
- The production profile hard-sets `EXPO_PUBLIC_APP_ENV=production` and pulls the
  rest of the env from `eas.json` + EAS secrets.
- Watch progress in the terminal or at the EAS build URL it prints. `eas
build:list` shows recent builds.

## 3. Submit to App Store Connect

```sh
eas submit -p ios --profile production
```

- Uses the stored ASC API key (APP_MANAGER role) plus the `submit.production`
  block in `eas.json` (team + `ascAppId`). No Apple password prompts.
- Or do build + submit in one shot: append `--auto-submit` to the build command
  (step 2).
- After upload the build shows as "Processing" in ASC for ~5-30 min before it is
  attachable to a version.

## 4. In App Store Connect

- App Store tab -> the version row (create a new version if this is a new
  marketing version).
- Attach the processed build.
- Screenshots: iPhone 6.7" is required; **iPad 13" is required because we support
  iPad** (`supportsTablet: true`). The iPad screenshot slots only appear after an
  iPad-capable build has been processed.
- App Review notes (+ demo account if needed).
- Export compliance: auto-handled by `ITSAppUsesNonExemptEncryption: false`.
- Submit for Review. First-pass turnaround is typically 24-48h.

## 5. Post-release: the in-app update gate (`engine_config`)

`components/ForceUpdateGate.tsx` compares the running app's version against two
`engine_config` columns (via `useEngineConfig`) — this is how you nudge or force
users off old builds WITHOUT an App Store change:

- **`latest_app_version`** — clients below this get a **dismissible** "Update
  available" nudge. Bump it to the new version AFTER the build is live on the App
  Store (not before — you'd nudge users toward a version they can't download yet).
- **`min_app_version`** — clients below this get a **blocking, non-dismissible**
  "Update Required" wall. Only raise this to kill a genuinely broken/unsafe old
  build. Leave it well behind `latest` normally.

Current values (2026-08-10): **`min_app_version = '1.0.14'`** and
**`latest_app_version = '1.0.14'`** — every client below 1.0.14 is HARD-blocked
(forced upgrade to the latest build). Set them from the dashboard SQL editor:

```sql
UPDATE public.engine_config SET latest_app_version = '1.0.14';  -- after 1.0.14 is live
UPDATE public.engine_config SET min_app_version   = '1.0.14';   -- forces the upgrade
```

⚠️ `min_app_version` must never exceed the version actually LIVE on the App Store,
or users are locked out with no upgrade path. Revert with `= '<prev>'` (e.g. `'1.0.9'`).

Version strings are compared with `lib/appVersion.ts` (`parseVersion` →
dotted-digit runs; `v`-prefix and pre-release suffixes are rejected, so use a
bare `1.0.2`).

## 6. Resubmitting after a rejection

1. Fix the flagged issues, commit to `main`, push.
2. `eas build -p ios --profile production --auto-submit` (same `version`, new
   build number).
3. In ASC, attach the new build to the existing (rejected) version, update
   screenshots / review notes, Submit for Review.
4. Reply in Resolution Center summarizing what changed (one line per guideline).

## Gotchas

- **iPad support is decided by the BINARY** (the `UIDeviceFamily` produced by
  `supportsTablet: true`), not by any App Store Connect toggle. Flipping the code
  flag does nothing until a NEW build is uploaded and processed.
- **`appVersionSource: remote`** means the build number lives on EAS, not in
  `app.config.js`. Don't try to set or read it locally.
- The pre-commit hook validates the WORKING TREE, not the commit, and the build
  bakes COMMITTED code, so make sure `main` is pushed and green before building.
- The local `dreambot` / `dreamphone` / `dreamkev` zsh functions are
  simulator/device DEV builds via Xcode — never App Store builds. Only `eas build
--profile production` produces a submittable binary.
- **Local Release-to-device builds need `SENTRY_DISABLE_AUTO_UPLOAD=true` (already
  set in `ios/.xcode.env.local`).** The Sentry org/token live ONLY as EAS env
  secrets, so a LOCAL Xcode Release build can't authenticate — `sentry-cli
  react-native xcode` aborts with "An organization ID or slug is required" BEFORE
  Metro bundles the JS, so no `main.jsbundle.map` is written, then
  `collect-modules.sh` fails with "Source map file does not exist" and `exit 1`,
  killing the build. The flag makes the Sentry phase skip the upload and run the
  plain RN bundler. **This does NOT affect App Store builds:** `ios/.xcode.env.local`
  is gitignored and never leaves this Mac; EAS production builds run in the cloud
  from a fresh checkout with the real Sentry secrets, so they still upload source
  maps. (Found 2026-06-30: local Release build to iPhone failed here while the
  prior EAS App Store build succeeded — same Sentry phase, different env.)
