# Auth Provider Configuration

Reference for all third-party auth credentials and where they live. **No secrets in this file** — just identifiers, locations, and troubleshooting notes.

---

## Apple Sign-In

| Field | Value |
|-------|-------|
| Bundle ID / Client ID | `com.konakevin.radorbad` |
| Team ID | `43VMZ5KMW4` |
| Key ID | `23586D7YPP` |
| Key File | `~/Vault/Rad_or_Bad_AuthKey_23586D7YPP.p8` (never commit this) |

### Where credentials are configured:
- **Supabase Dashboard** → Authentication → Providers → Apple
  - Client ID: `com.konakevin.radorbad` (must be the bundle ID, NOT a Service ID)
  - Secret Key: JWT generated from the `.p8` key (expires every 180 days)
  - Skip nonce check: enabled
- **Apple Developer Portal** → Certificates, Identifiers & Profiles
  - App ID: `com.konakevin.radorbad` with "Sign in with Apple" capability enabled
  - Key: `Rad_or_Bad_AuthKey_23586D7YPP` with "Sign in with Apple" enabled
  - Service ID: `com.konakevin.radorbad.auth` (for web OAuth, not used by native app)
- **Xcode** → RadorBad.entitlements includes `com.apple.developer.applesignin`
- **App code** → `lib/appleAuth.ts` uses `expo-apple-authentication`

### JWT Renewal (every ~5 months):
```bash
node -e "
const jwt = require('jsonwebtoken');
const fs = require('fs');
const token = jwt.sign({}, fs.readFileSync('$HOME/Vault/Rad_or_Bad_AuthKey_23586D7YPP.p8', 'utf8'), {
  algorithm: 'ES256', expiresIn: '180d',
  audience: 'https://appleid.apple.com',
  issuer: '43VMZ5KMW4', subject: 'com.konakevin.radorbad', keyid: '23586D7YPP',
});
console.log(token);
"
```
Paste the output into Supabase → Apple → Secret Key.

### Common errors:
- **"Unacceptable audience in id_token"** → Client ID in Supabase must be `com.konakevin.radorbad` (the bundle ID), not the Service ID
- **"provider is not enabled"** → Toggle Apple on in Supabase Dashboard
- **"Secret key should be a JWT"** → You pasted the raw `.p8` contents instead of the generated JWT

---

## Google Sign-In

| Field | Value |
|-------|-------|
| iOS Client ID | `523080499421-ct234o3eo93kuakii3df5j29apa61j5h.apps.googleusercontent.com` |

### Where credentials are configured:
- **Supabase Dashboard** → Authentication → Providers → Google
  - Enabled, with the iOS Client ID in "Authorized Client IDs"
  - Skip nonce check: enabled
- **Google Cloud Console** → APIs & Services → Credentials
  - OAuth 2.0 Client ID (iOS type) for `com.konakevin.radorbad`
- **`.env.local`** → `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- **`app.json`** → `@react-native-google-signin/google-signin` plugin
- **`ios/RadorBad/Info.plist`** → URL scheme for Google reversed client ID
- **App code** → `lib/googleAuth.ts` uses `@react-native-google-signin/google-signin`

### Common errors:
- **"Unacceptable audience in id_token"** → iOS Client ID must be in Supabase's "Authorized Client IDs"
- **App crashes / no Google UI** → Missing URL scheme in Info.plist or needs Xcode rebuild
- **QR code on simulator** → Google Sign-In requires a real device for native account picker

---

## Facebook / Meta Login

| Field | Where to find it |
|-------|-------|
| App ID | `.env.local` → `FACEBOOK_APP_ID` (read by `app.config.js` at build time) |
| Client Token | `.env.local` → `FACEBOOK_CLIENT_TOKEN` (read by `app.config.js` at build time) |
| App Secret | Supabase Dashboard → Auth → Providers → Facebook (server-side only) |

The App ID is public by design (embedded in every installed app binary).
The Client Token also ships in client binaries, but rotate it via
**Meta Developer Dashboard → App Settings → Advanced → Reset Client Token**
if it's ever exposed in places it shouldn't be (e.g. flagged by GitGuardian).

After rotating:
1. Update `.env.local` with the new value
2. Update the EAS secret: `eas secret:create --scope project --name FACEBOOK_CLIENT_TOKEN --value <new>` (or `eas secret:push` from `.env.local`)
3. Rebuild — `expo prebuild --clean` for local, `eas build` for cloud

The Client Token never enters git — `app.json` was replaced with `app.config.js`
which reads the value from process.env.

### Where credentials are configured:
- **Supabase Dashboard** → Authentication → Providers → Facebook
  - App ID and App Secret (the secret is server-side only, in Supabase)
- **Meta Developer Dashboard** → App Settings → Basic
  - App ID, App Secret, Client Token
  - App is in Development mode (only admins/testers can log in)
  - Business verification + App Review needed before public launch
- **`app.json`** → `react-native-fbsdk-next` plugin with appID, clientToken, scheme
- **App code** → `lib/facebookAuth.ts` uses `react-native-fbsdk-next`

### Common errors:
- **App crashes on Facebook button** → Needs Xcode rebuild after installing `react-native-fbsdk-next`
- **Login fails for non-admin users** → App is in development mode; add testers in Meta Dashboard → App Roles
- **"User is not authorized"** → Need Business Verification + App Review for public access

---

## General Notes

- All three providers use **native SDKs** (not web OAuth redirects) for the best UX
- All exchange tokens with Supabase via `signInWithIdToken()`
- The `handle_new_user` Postgres trigger auto-creates a `public.users` row on first sign-in
- Username defaults to email prefix for social sign-ins (e.g. `konakevin` from `konakevin@gmail.com`)
- If a user signs in with Google/Apple using an email that already has an account, Supabase merges the identities (same account, multiple sign-in methods)
- Environment variables are in `.env.local` (never committed)
