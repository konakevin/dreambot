# Trial-Farming Gate (DeviceCheck) — Rollout Checklist

Living checklist to take the DeviceCheck trial-farming gate from "built, inert"
to "100% live and enforcing". Tick boxes as we go. Owner tags: **[C]** = Claude,
**[K]** = Kevin (Apple console / build / metadata are your hands).

Background + design: `TRIAL_FARMING_PREVENTION.md`. Memory: `project_trial_farming_devicecheck`.

> ▶️ **STATUS: ACTIVATING (2026-08-05).** Secrets are set and VALIDATED against Apple's
> real servers (JWT auth accepted; only the fake device token rejected → `.p8` +
> Key ID `7XAW2V8232` + Team ID `43VMZ5KMW4` all correct). Server gate is armed but
> still dormant until a native build ships (current apps send no token → fail-open
> grant), so STILL zero user impact right now. Only the native build + App Store
> metadata remain.

**Progress: 15 / 20 complete.** Server gate armed + credential-verified, privacy
manifest + privacy-policy done. **Only TWO things left before it enforces:** (1) the
native EAS build [K], and (2) the App Store Connect App Privacy label toggle [K].
Then on-device verification. Nothing can block a real user until the build ships,
and even then it's fail-open.

---

## Phase 1 — Code (shipped) ✅
- [x] **[C]** Pure fail-open decision `decideTrial` (`_shared/trialEligibility.ts`)
- [x] **[C]** Apple DeviceCheck REST client `_shared/deviceCheck.ts` (ES256 JWT, query/update bits, prod→dev fallback, 3s timeout, never throws)
- [x] **[C]** Gate wired into `enqueue-dream` first-dream branch (stamp trial / deny / burn bit0) with belt-and-suspenders try-catch that grants on any error
- [x] **[C]** Client wrapper `lib/deviceCheck.ts` + token sent from `lib/firstDreamQueue.ts`
- [x] **[C]** Native module `modules/expo-device-check/` (Swift `DCDevice.generateToken`)
- [x] **[C]** Unit tests: `decideTrial` (5) + I/O client all fail-open paths incl. real timeout (9)
- [x] **[C]** Deployed `enqueue-dream`; committed + pushed
- [x] **[K]** Migration 432 applied (unrelated audit item, done)

## Phase 2 — Apple key + secrets  ✅
- [x] **[K]** DeviceCheck `.p8` created (`AuthKey_7XAW2V8232.p8`); Key ID `7XAW2V8232`, Team ID `43VMZ5KMW4`
- [x] **[C]** Set `DEVICECHECK_KEY_P8` (escaped `\n`, never printed)
- [x] **[C]** Set `DEVICECHECK_KEY_ID`
- [x] **[C]** Set `DEVICECHECK_TEAM_ID`
- [x] **[C]** Credentials smoke-tested against Apple (prod + dev both returned 400 "bad device token" → JWT auth accepted). enqueue-dream redeployed to pick up the secrets.

## Phase 3 — Native build  **[K]**
- [ ] New dev/EAS build that includes the `expo-device-check` native module (DeviceCheck can't ship OTA)
- [ ] On a REAL device, confirm `getDeviceCheckToken()` returns non-null (nil on Simulator is expected and safe → fail open)

## Phase 4 — Privacy & App Store metadata  **[K]**  (drafts in the Appendix)
- [ ] App Store Connect → App Privacy: add **Identifiers → Device ID**, purpose **App Functionality** (fraud prevention), **not** linked to identity, **not** used for tracking. (Editable without a new binary.)
- [x] **[C]** `NSPrivacyCollectedDataTypeDeviceID` entry added via `app.config.js` `ios.privacyManifests` (Expo writes `PrivacyInfo.xcprivacy` on prebuild — ships automatically in the next build)
- [x] **[C]** Fraud-prevention section added to `dreambotapp.com/privacy` (dreambot-web `bfde818`, Vercel auto-deploys)
- [x] **[C]** Confirmed: NOT declared as tracking, NO ATT prompt added, NO third-party sharing (exchange is with Apple; `FacebookAdvertiserIDCollectionEnabled:false` keeps Tracking=No truthful)

## Phase 5 — Activation & verification  **[C]** + **[K]**
- [ ] With secrets + a real build live, run one real onboarding on a **fresh** device → confirm log `first-dream trial gate … reason=fresh_device (grantTrial=true)` and the bit gets set
- [ ] Delete that account, re-onboard on the **same** device with a new email → confirm `reason=device_already_trialed (grantTrial=false)` AND the account is still usable / can subscribe
- [ ] Confirm a Simulator / no-token onboarding still logs a fail-open grant
- [ ] Watch the gate logs for ~1 week; track the `fail_open_*` rate (expected low once real builds dominate)

## Phase 6 — Harden to fail-closed  **[C]**  (after the soak)
- [ ] Once the `fail_open_*` rate is trusted, flip fail-open → fail-closed for the attested-capable population (one-variable change, reversible). Leave Simulator/older-OS on fail-open.
- [ ] Re-verify no valid new user is blocked after the flip

## Deferred / optional (not blocking 100%)  **[C]**
- [ ] Device-gate the 25-sparkle **welcome bonus** too (needs a small `grant_sparkles` money-RPC change + a server-only `users` flag). Non-cashable, low priority.
- [ ] Consider Android **Play Integrity** equivalent if/when Android ships.

---

## Definition of "100% done"
Phases 1–5 all checked, verified on a real device both ways (fresh grants, same-device
re-signup denies), privacy metadata live, and no valid-user block observed for a week.
Phase 6 (fail-closed) is the final tightening once we trust the data.

---

## Appendix — ready-to-drop-in privacy assets

### A. Privacy-policy sentence (for `dreambot-web` `/privacy`)
> **Fraud and abuse prevention.** To keep free trials and promotional offers fair,
> DreamBot uses Apple's DeviceCheck to note, at the device level, whether a device
> has already used a free trial. This relies on an Apple-provided device token and a
> small flag stored on Apple's servers. We use it only to prevent abuse of trials and
> offers. We do not use it to track you, and we do not use it for advertising.

### B. `PrivacyInfo.xcprivacy` collected-data entry
Add inside `NSPrivacyCollectedDataTypes` (the manifest purpose enum is coarse — it has
no "fraud prevention" value, so App Functionality is the correct purpose here; the finer
"fraud prevention" wording lives in the App Store Connect questionnaire in C):
```xml
<key>NSPrivacyCollectedDataTypes</key>
<array>
  <dict>
    <key>NSPrivacyCollectedDataType</key>
    <string>NSPrivacyCollectedDataTypeDeviceID</string>
    <key>NSPrivacyCollectedDataTypeLinked</key>
    <false/>
    <key>NSPrivacyCollectedDataTypeTracking</key>
    <false/>
    <key>NSPrivacyCollectedDataTypePurposes</key>
    <array>
      <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
    </array>
  </dict>
</array>
```
Note: DeviceCheck is **not** a "Required Reason API", so it needs **no**
`NSPrivacyAccessedAPITypes` entry. `Linked=false` is defensible because we do not store
a device-to-user mapping (the bits live at Apple, keyed by device, not by our account).

### C. App Store Connect → App Privacy answers
- Data type: **Identifiers → Device ID**
- Used for: **App Functionality** (select "Fraud Prevention / Security" wording where offered)
- Linked to the user's identity: **No**
- Used for tracking: **No**
- Not third-party advertising, not developer advertising/marketing.

> Judgment-call caveat: App Store privacy classification is not black-and-white. This is
> the conservative, defensible position (declare a device identifier used only for fraud
> prevention). The authoritative source is Apple's "App privacy details" guidance in App
> Store Connect Help. Under-disclosing is what gets flagged in review, so we disclose.
