# RELEASE.md — cutting a new iOS build to App Store Connect

The repeatable runbook for building DreamBot and shipping it to App Store Connect.
For the one-time first-launch history and the wider go-live checklist, see
`LAUNCH.md` (this doc is the "do it again" version of its §6-7).

## TL;DR

From a clean, green `main`:

```sh
eas build -p ios --profile production --auto-submit
```

That builds on EAS (auto-incrementing the build number) and uploads straight to
App Store Connect. Then finish in ASC: attach the build, confirm screenshots,
add review notes, Submit for Review.

## Reference (IDs)

- **Bundle ID:** `com.konakevin.radorbad`
- **ASC app ID:** `6761505205`
- **Apple Team ID:** `43VMZ5KMW4`
- **EAS project:** `014926a1-297b-4abf-9184-a01979a83879` (owner `konakevin`)
- **Marketing version:** `app.config.js` -> `expo.version` (currently `1.0.0`)
- **Build number:** owned by EAS (`appVersionSource: remote` in `eas.json`, plus
  `autoIncrement: true` on the production profile). Do NOT set it locally.

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

- **New build of the SAME marketing version** (e.g. resubmitting after a
  rejection, or a TestFlight iteration): change nothing. EAS auto-increments the
  build number on each production build.
- **New marketing version** (user-visible release like `1.0.1` / `1.1.0`): bump
  `expo.version` in `app.config.js`, commit, then build.
- Never hand-edit the iOS `buildNumber` — `appVersionSource: remote` means EAS
  owns it.

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

## 5. Resubmitting after a rejection

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
