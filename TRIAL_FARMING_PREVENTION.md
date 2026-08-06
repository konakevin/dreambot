# Trial & Welcome-Bonus Re-Farming — Deep Dive

**Question (Kevin, 2026-08-05):** how do we stop a user whose trial expired from
just signing back up with another throwaway email to get a fresh trial?

**Status:** **Anchor A (DeviceCheck) chosen + BUILT, shipping inert/fail-open**
pending Kevin's Apple key + a native build. Phase 0 (interim) was declined. See
"Implementation status" at the bottom.

Companion doc: `APP_ATTESTATION_PLAN.md` (bot/headless-signup protection). **These
are different problems** — see "Why App Attest is not enough" below.

---

## 1. What exactly gets farmed

Every new account today grants, per account:

- a **fresh 14-day Pro trial** — `pro_trial_started_at` is stamped on the user
  INSERT (trigger, migration 176) and reset at the first dream (migration 377).
  `is_pro_active()` = paid OR within `engine_config.pro_trial_days` of that stamp.
- **25 welcome sparkles** (`grant_sparkles('welcome_bonus')`, idempotent per account).
- one **free first dream** (~$0.50 Fly face-swap compute).

The trial and the welcome bonus are keyed to the **account**. A new email = a new
account = the whole bundle again. Trial expiry → new throwaway email → repeat.

The cost isn't the 25 sparkles (they can't be cashed out — only spent on more
compute); it's that **an expired-trial user reclaims full Pro (nightly dreams,
HD, pre-upscale) indefinitely for the price of a new inbox address.**

## 2. Why today's mitigations don't stop RE-farming

| Control | Stops | Doesn't stop re-farming because |
|---|---|---|
| Email confirmation (`mailer_autoconfirm=false`) | headless bots with no inbox | temp-email mills (10minutemail, guerrillamail, +alias tricks) issue unlimited real inboxes |
| Per-IP first-dream cap (8/24h, mig 332) | one machine spamming first-dreams | a returning user isn't spamming — they make **one** new account, occasionally; and a VPN/cellular re-IP defeats it anyway |
| App Attest (planned) | `curl`/emulator signups | a real human on the real app re-registering IS the genuine app — attestation passes every time |

**The gap is identity, not authenticity.** We can prove the request came from the
real app (App Attest) and throttle per-IP, but nothing today says *"this **device
/ person** already used its free trial."* That's the missing primitive.

## 3. Why App Attest is not enough (the key distinction)

App Attest / Play Integrity answer **"is this the genuine, unmodified app?"** They
do **not** answer **"is this a new device/person, or the same one coming back?"**
A farmer using the real app on their real phone passes attestation on every
re-signup. So attestation is necessary for bot defense but **orthogonal** to
re-farming. Re-farming needs a *persistent, per-device (or per-Apple-ID)
eligibility signal that survives account deletion and app reinstall.*

## 4. The solution space (three anchors, layered)

Anchor trial/bonus eligibility to something the farmer **can't cheaply rotate**:

### Anchor A — Apple **DeviceCheck** bits  ★ recommended durable fix
Apple's `DCDevice` gives every physical device **2 bits of server-settable state**
that:
- persist across **app deletion + reinstall**,
- persist across account deletion and a new Apple ID sign-in on the device,
- survive a factory reset (tied to hardware + Apple's servers, not local storage),
- are **stored on Apple's servers** and read/written by *our* server via the
  DeviceCheck API with a `.p8` key (like APNs) — the client can't forge them.

Use **bit0 = "this device has consumed its free trial"** (optionally bit1 =
"welcome bonus consumed"). At trial-grant time the server queries the bit; if set,
the account starts **already-expired** (still fully usable, still can *pay* — we
just don't hand out a second free trial). Set the bit the first time a device is
granted a trial.

- **Kills the 80% case** (same phone, new email) at zero user friction — it's
  invisible.
- **Residual:** a farmer with N physical devices, or who buys/resells devices, can
  still farm at real hardware cost. That's an acceptable economic floor — we've
  turned "free forever" into "buy a phone per trial."
- **Edge cases:** a legitimately new owner of a *used* iPhone could see "trial
  consumed." Denial is **soft** (they browse + can subscribe; they just don't get
  the free trial), so this is tolerable and rare. Simulators return no device
  token → treat as unattested (see fail-open policy).

### Anchor B — **StoreKit / RevenueCat intro-offer eligibility**  ★ highest leverage, product change
Apple **already** enforces **one introductory (free-trial) offer per Apple ID per
subscription group**, for free, at the StoreKit level. If the Pro trial were a
**StoreKit-managed free-trial intro offer** (an auto-renewing sub that starts with
14 days free) instead of our app-level `pro_trial_started_at`, then:
- Apple blocks a second free trial for the **same Apple ID** automatically —
  throwaway *email* is irrelevant because the Apple ID on the device is the same.
- We get **card-on-file at trial start** → materially better trial→paid conversion.
- RevenueCat already models this (`introEligibility` / `checkTrialOrIntroductoryPriceEligibility`).

**Tradeoff (Kevin's call):** it changes the trial UX from "silent 14 days" to
"Start Free Trial (auto-renews at $X unless cancelled)" behind the StoreKit sheet.
Higher friction to *start*, but far stronger anti-farm **and** better monetization.
This is a product decision, not just an eng one.

### Anchor C — coarse signals (cheap, ship now, defense-in-depth)
- **Disposable-email blocklist** at signup (a maintained list of temp-email
  domains; reject or mark `low_trust`). Blocks the laziest mills; trivially
  bypassed by good throwaways, but raises effort.
- **Normalize `+alias` / dots** on gmail-style addresses before the per-account
  idempotency checks so `me+1@`, `me+2@` collapse to one identity for
  trial/bonus purposes.
- **Per-IP + per-device-fingerprint signup velocity** (a few signups / IP / day),
  as an anomaly tripwire feeding the existing monitors.
- **Delay the welcome bonus + first dream to first authenticated app-open
  post-confirm** (already partly true) so headless mints get nothing.

No single anchor is complete; **A + C now, consider B strategically** gives strong
coverage. B alone (if adopted) is the cleanest because Apple owns enforcement.

## 5. Recommended architecture (Anchor A, concrete)

```
Client (real app, dev build)
  └─ lib/deviceCheck.ts → DCDevice.generateToken()  (null on simulator)
        │  base64 device token
        ▼
Edge fn `claim-trial-eligibility` (--no-verify-jwt, authenticates the user JWT)
  1. verify user
  2. POST token → Apple DeviceCheck /v1/query_two_bits  (JWT signed with our .p8)
  3. if bit0 already set  → return { trial: false }  (account starts expired)
     else                 → /v1/update_two_bits set bit0
                          → stamp pro_trial_started_at = now() (service role,
                             bypasses the frozen-column guard like today's path)
                          → grant welcome bonus (bit1 gate optional)
                          → return { trial: true }
```

- **Where it plugs in:** the first-dream / onboarding path (`enqueue-dream` first
  branch) already owns "start of a user's life" — the eligibility claim happens
  there, before `pro_trial_started_at` is stamped and before the welcome grant.
- **Pro-state stays single-sourced.** `is_pro_active()` is unchanged; we only
  change *whether `pro_trial_started_at` gets stamped at all* for a device that
  already trialed. The three-runtime pro rule (client/cron/SQL) is untouched.
- **Server owns eligibility.** DeviceCheck bits live on Apple's servers, set via
  our key — a modified client can't grant itself a trial by faking a response.
- **Data:** no new table strictly required (Apple stores the bits). Optionally a
  `trial_device_claims` audit row (hashed token → user_id, ts) for forensics —
  never the raw token.

### Fail-open → fail-closed rollout (matches the beta posture)
Ship **fail-open**: no device token (simulator, older OS, transient Apple error)
→ still grant the trial, log `unattested`. Watch the `unattested` rate + re-trial
metrics for a week, then flip to **fail-closed** for the attested-capable
population once we trust it. One-variable, reversible.

## 6. Prerequisites (Kevin)
- Apple Developer: **DeviceCheck** is available to all paid Apple Developer
  accounts (no special entitlement UI like App Attest, but you generate a
  **DeviceCheck `.p8` key** in the developer portal — Keys → new key → DeviceCheck).
- Store the `.p8` + key id + team id as **Supabase edge secrets**.
- A **dev/EAS build** with the native DeviceCheck module (not Expo Go). If we also
  do App Attest (companion plan), one native module can expose both.
- If pursuing Anchor B: define the Pro sub's **intro free-trial offer** in App
  Store Connect + wire RevenueCat `introEligibility`.

## 7. Phasing

| Phase | Work | Stops | Native? |
|---|---|---|---|
| 0 (now) | Anchor C: disposable-email blocklist + email normalization + signup velocity + delay bonus to post-confirm | casual/lazy farming, temp-email mills | no |
| 1 | Anchor A: DeviceCheck trial-eligibility gate (fail-open) | same-device re-farming (the 80% case) | small module + `.p8` |
| 2 | flip Anchor A fail-closed once metrics are clean | tightens Phase 1 | no |
| 3 (strategic) | Anchor B: move Pro trial to a StoreKit intro offer | per-Apple-ID re-trial, for free, + conversion lift | product/UX change |

## 8. What I recommend
1. **Do Phase 0 now** (pure code — I can build it this session): disposable-email
   domain blocklist + gmail-alias normalization on the welcome/trial idempotency
   + a per-IP signup-velocity tripwire. Low friction, immediate blunting.
2. **Green-light Phase 1 (DeviceCheck)** as the durable fix — it's the smallest
   durable lever and invisible to honest users. Needs the `.p8` key + a native
   module (pairs with the App Attest module in the companion plan).
3. **Decide on Phase 3 (Anchor B)** as a product question: are we willing to move
   to a "Start Free Trial (auto-renews)" flow? If yes, it's the strongest and
   cheapest-to-maintain anti-farm *and* lifts conversion — arguably it supersedes
   much of Phase 1. If we want to keep the frictionless silent trial, Phase 1 is
   the answer.

Open decision for Kevin: **keep the silent frictionless trial + add DeviceCheck
(Phase 1),** or **move to a StoreKit card-on-file trial (Phase 3, Apple enforces
it)?** That fork determines the native work.

---

## Implementation status (Anchor A — built 2026-08-05)

**Shipped (live in prod, but INERT + fail-open until the key + native build land):**
- `_shared/trialEligibility.ts` — the pure fail-open decision (`decideTrial`),
  unit-tested (`__tests__/lib/trialEligibility.test.ts`).
- `_shared/deviceCheck.ts` — Apple DeviceCheck REST client (ES256 JWT from the
  `.p8`, `query_two_bits` / `update_two_bits`, prod→dev fallback). Never throws;
  missing secrets → `apple_error` → fail open, so the gate does nothing until
  `DEVICECHECK_*` secrets exist.
- `enqueue-dream` first-dream branch — queries the signal, `decideTrial`, then
  stamps `pro_trial_started_at = now()` (eligible) or `NULL` (already trialed →
  no second free trial; account still fully usable + can subscribe), and burns
  bit0 only on a genuine fresh-device grant. Deployed.
- Client: `lib/deviceCheck.ts` (fail-open wrapper) + `lib/firstDreamQueue.ts`
  passes `device_check_token`; native module `modules/expo-device-check/`
  (Swift `DCDevice.generateToken`).

**Remaining (Kevin — the gate stays inert until all three are done):**
1. **DeviceCheck `.p8` key** — Apple Developer → Keys → + → enable DeviceCheck →
   download once; note Key ID + Team ID.
2. **Supabase edge secrets:** `DEVICECHECK_KEY_P8` (paste the .p8 body; literal
   `\n` escapes are handled), `DEVICECHECK_KEY_ID`, `DEVICECHECK_TEAM_ID`.
3. **A new dev/EAS build** so the native `expo-device-check` module is included
   (DeviceCheck can't ship OTA). Verify `getDeviceCheckToken()` returns non-null
   on a real device (nil on Simulator is expected → fail open).

**Not done (deliberately scoped out):** the 25-sparkle **welcome bonus** is still
account-idempotent only, not device-gated — it's non-cashable and gating it means
modifying the (CI-only-testable) `grant_sparkles` money RPC + a `users` flag
column. Worth a separate reviewed change; the trial (the recurring-value prize)
is the fix that matters. Also **fail-open → fail-closed** flip after watching the
`fail_open_*` reason rate for a week.
