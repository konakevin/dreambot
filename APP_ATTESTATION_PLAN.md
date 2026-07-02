# Signup Bot-Protection (App Attestation) — Plan

**Status:** NOT IMPLEMENTED. Flagged by both the 2026-07-01 Architect audit (S4)
and the external review as the single most economically-relevant gap. This is a
native + infra task that needs Kevin's hands (Apple/Google console + EAS build +
one server verification step); it can't be a pure-code edit.

## The gap

Email confirmation is enforced (`mailer_autoconfirm=false`), which raises the
bar but doesn't stop a determined farmer with a temp-email mill: each minted
account gets **one free first-dream (~$0.50 Fly face-swap compute) + 25 welcome
sparkles**. At scale that's a real daily drain, and nothing today proves a
signup came from the genuine app rather than `curl` against Supabase Auth.

`enqueue-dream/index.ts` already *references* attestation as the bounding
mechanism ("bounded by email-confirm + app attestation") — but attestation was
never built. This plan closes that.

## Approach — Apple App Attest + Google Play Integrity, verified server-side

The client obtains a platform attestation token and passes it to a gate the
signup path calls; the server verifies the token with Apple/Google before the
account is allowed to do anything expensive (first-dream / welcome bonus).

### 1. Native token acquisition (client)
- iOS: **App Attest** (`DCAppAttestService`) — via `expo-app-integrity` or a
  small native module. Needs a dev build (not Expo Go).
- Android: **Play Integrity API** — same lib or `react-native-google-play-integrity`.
- Wrap in `lib/appAttestation.ts` → `getAttestationToken(): Promise<string|null>`
  (returns null on simulator/unsupported → server treats as "unattested").

### 2. Server verification (new edge fn `verify-attestation` OR inline in the
   first-value gate)
- iOS: validate the App Attest assertion against Apple's public keys + your
  team/bundle id; check the nonce you issued.
- Android: call the Play Integrity `decodeIntegrityToken` endpoint with your
  Google service account; assert `appRecognitionVerdict == PLAY_RECOGNIZED` +
  correct package name.
- Store a short-lived "attested" marker (e.g. `users.attested_at` or a signed
  claim) so the first-dream / welcome-bonus grant can require it.

### 3. Gate the expensive first-value actions on attestation
- `first-dream-render` / the welcome `grant_sparkles('welcome_bonus')` path
  should require a valid attestation marker for the account. Unattested accounts
  can still browse, but don't get the free heavy render + 25 sparkles until
  attested. (Fail-open for a grace window if you want to avoid blocking real
  users during rollout, then flip to fail-closed.)

## Console / infra prerequisites (Kevin)
- Apple Developer: enable App Attest capability on the app id; add the
  entitlement to the EAS build profile.
- Google Play Console + Google Cloud: enable Play Integrity API; create a
  service account + key for the edge fn to call `decodeIntegrityToken`.
- Store the Google service-account key as a Supabase edge secret.
- New EAS build with the native module.

## Cheaper interim mitigations (do NOW if attestation is weeks out)
- **Per-IP signup velocity limit** (edge middleware or a Supabase Auth hook) —
  blunts a temp-email mill without native work.
- **Delay the free first-dream + welcome bonus until first app open post-confirm**
  (already partly true) and require the confirmed session — reduces headless
  farming.
- Monitor: alert on signup spikes / first-dream volume per hour (a farm shows up
  as an anomaly the existing monitors would surface).

## Why it's not in tonight's batch
Every other audit item was a code/migration fix validated by the check suite.
This one needs Apple/Google console changes, edge secrets, and a native build —
Kevin-driven. Tracked here so it isn't lost.
