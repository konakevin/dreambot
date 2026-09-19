# Boot Stall Detection, Escalating Splash Copy, and Outage Alarm

**Status:** BUILT 2026-09-18 (client code + tests; uncommitted pending Kevin's review). Researched
against commit `483da02e`; sections 1-2 are the design of record, section 3 is now the file list
as built, sections 4-5 are the tests (54, all green in the fast lane) and the device QA still to run.

**What is built (see §3 for the exact files):** the thresholds + copy, the pure phase/copy logic,
the reachability probe, the bounded has_ai_recipe resolver, a pure STATE MACHINE
(`lib/bootStallMachine.ts`) that owns every decision (once-per-launch alarm, online-only, retry
semantics) so the hook is a thin timer/effect runner, `captureMessage` in `lib/sentry.ts`, the three
analytics events, the StartupLogo status block, the Settings "Preview boot stall (QA)" tour, and the
`app/index.tsx` rewiring. Ships in the next binary (client-only).

**Still manual / not done:** (a) the Sentry alert rule (§2.5, one-time UI setup); (b) the on-device
QA script in §5, especially step 3 (black-hole simulation) and step 7 (the Stage 1 / auth-js
question); (c) the `RELEASES.md` note when it ships; (d) Phase 2 §8.1 is NOT built.

**Kevin's ask (verbatim intent):** "once in a while the db or some system will have a problem and it
causes the app to just sit on the splashscreen for a long time. add something at startup that
measures the time it's sitting on the splashscreen, and if it goes over a certain threshold, update
the splashscreen with some sort of notification text ('still trying / loading'). we have some final
threshold where we consider it failure, and if that happens, it calls some other backend service to
trigger an alert that app loading time is currently impacted for users, and updates the splash screen
to an error state: try again later, we have been notified."

---

## 1. What actually happens today (verified)

### 1.1 The "splash" the user is stuck on is NOT the native splash

- The native splash (`expo-splash-screen`, black + 220pt wordmark) is hidden the moment fonts load:
  `app/_layout.tsx:875-878` (`if (fontsLoaded) SplashScreen.hideAsync()`). Fonts are bundled, so
  this is sub-second and can never stall on the backend.
- What the user then sees is `components/StartupLogo.tsx`, a JS screen deliberately built to be
  **pixel-identical** to the native splash (same asset, same 220pt width, same black). The handoff is
  invisible, which is why Kevin perceives it as "stuck on the splash."
- **Constraint to preserve:** the header comment in `StartupLogo.tsx` explains that the wordmark
  must stay at exactly 220pt and must not move or resize (a prior text version popped in size at
  handoff, Kevin 2026-07-10). Any status text we add goes BELOW the wordmark, absolutely positioned,
  so the wordmark never shifts.

### 1.2 The two places boot can hang, both in `app/index.tsx`

```
if (!initialized) return <StartupLogo />;                // STAGE 1: auth init
if (!session)     return <Redirect href="/(auth)" />;
if (hasRecipe === null) return <StartupLogo />;          // STAGE 2: route resolution
```

**Stage 1, `initialized === false`** (`store/auth.ts:181-262`, `initialize()`):
- `supabase.auth.getSession()` is normally a local AsyncStorage read. BUT if the stored access token
  is expired (or within the 90s margin), auth-js calls `_callRefreshToken()` over the network
  (`node_modules/@supabase/auth-js/dist/main/GoTrueClient.js:1380-1408`). Auth-js retries network
  failures up to `NETWORK_FAILURE.MAX_RETRIES = 10` with backoff. During an Auth outage this stage can
  sit for a long time with nothing rendered but the logo.
- There is no abort handle on `getSession()`. Recovery is automatic: when Auth comes back, the pending
  refresh resolves, or the auto-refresh ticker (30s) fires `TOKEN_REFRESHED` -> `onAuthStateChange`
  -> `initialized: true`.
- auth-js in React Native uses `lockNoOp` (no `navigator.locks`), so re-entrant calls do not deadlock.

**Stage 2, `hasRecipe === null`** (`app/index.tsx:17-49`, `resolveRecipe()`):
- Reads `users.has_ai_recipe` via PostgREST. **No per-request timeout.** iOS's default URLSession
  request timeout is 60s, so a single hung attempt can take a full minute.
- Retries 5 times with 200/400/800/1600ms backoff, then **gives up silently and stays on the logo
  forever**. The comment says "a fresh app open re-runs this cleanly," meaning the user's only way
  out is to force-quit. Even if the backend recovers 10 seconds later, that user stays stuck.
- This "never guess" behavior is DELIBERATE and must be preserved: a transient read failure must
  never route an established user into onboarding (it would overwrite their Vibe Profile; real
  incident, user sunnysteph, 2026-07-10). **Invariant: on any error, `hasRecipe` stays `null`; it is
  only ever set from a CONFIRMED successful read.**

### 1.3 Why the normal alerting path is dead exactly when we need it

- Everything in the app, every script, and every edge function routes through Supabase. A Supabase
  outage means we cannot insert a `notifications` row, cannot call `send-push`, cannot write a log
  table. The alarm channel MUST be independent of Supabase.
- Earlier this session (2026-09-18) Kevin hit this live: `engine_config`, `dream_mediums`, AND Auth
  all timed out at 20s. It was a Supabase API-gateway outage, not pool saturation (26/90 connections,
  status page showed the gateway degraded). Recovery flapped: timeout, 503, 200, 200, 200. This is
  the exact scenario to design for.
- The other recurring cause is PostgREST connection-pool saturation (`DB_CONNECTION_SATURATION_PLAN.md`,
  memory `project_db_unhealthy_connection_saturation`). In that mode Auth and Storage stay fast and
  only PostgREST chokes, so the stall lands in **Stage 2**. Note the 2026-08-25 finding: during
  saturation the server-side `db-health-monitor` itself locks out (an 11-minute forensics blackout).
  A client-side beacon is the missing user-impact signal.

### 1.4 What already exists that we reuse

| Thing | Where | Relevance |
|---|---|---|
| Sentry client | `lib/sentry.ts` (`initSentry`, `captureException`, `Sentry` export) | Live in production since 2026-05-27 (DSN in all EAS envs, org `kevin-mchenry`, project `dreambot`). `enabled: !__DEV__`. Sentry ingest is sentry.io, fully independent of Supabase. **This is the "other backend service."** |
| PostHog | `lib/posthog.ts` (`capture(event, props)`), typed wrappers in `lib/analytics.ts` | `!__DEV__`-gated. Independent of Supabase. Use for the funnel metric (how often and how long users wait), not for paging. |
| Admin QA preview pattern | `components/ForceUpdateGate.tsx:39-45` (`showForceUpdatePreview`) wired at `app/settings/index.tsx:409` | Copy this pattern for a "Preview boot stall (QA)" row so Kevin can eyeball every phase without breaking his network. |
| Error-state screen styling | `components/AppErrorBoundary.tsx` | Same visual language for the hard-fail state: `Ionicons cloud-offline`, title, message, `GradientButton "Try Again"`, `colors` from `@/constants/theme`, `fontScale`/`verticalScale`. |
| Responsive helpers | `@/lib/responsive` | Required for all new UI (CLAUDE.md). |
| Fast jest for `@/lib` | pattern: `__tests__/lib/announcementEligibility.test.ts` | Pure-logic tests, run by husky + CI. |
| supabase-js / postgrest-js 2.100.0 | `node_modules/@supabase/postgrest-js/dist/index.d.mts` | `.abortSignal(signal)` IS available on the query builder. |
| `expo-updates` | NOT installed | No `Updates.reloadAsync()`. "Try again" must be a soft in-app retry, not a JS reload. |
| NetInfo / expo-network | NOT installed | Reachability is done with a plain `fetch` probe (no native module, no dev-build churn). |

---

## 2. Design

### 2.1 One sentence

A boot clock starts when JS starts; while `app/index.tsx` is still showing `StartupLogo`, the phase
escalates quiet -> soft -> medium -> hard on fixed thresholds; at medium we probe whether the
DEVICE is online; at hard, if the device is online, we fire ONE Sentry event (which a Sentry alert
rule turns into an email/push to Kevin) and show an honest error state with a Try again button.

### 2.2 Phase state machine

| Phase | Enter at | What the user sees | Side effects |
|---|---|---|---|
| `quiet` | 0s | Wordmark only, exactly as today | none |
| `soft` | 6s | Wordmark + one short line fades in below it | PostHog `boot_stall` {phase:'soft'} |
| `medium` | 15s | Line changes to "taking longer, still trying" | reachability probe starts; PostHog {phase:'medium', reachability} |
| `hard` | 45s | Error state: title + body + **Try again** button (+ small hint) | if online: Sentry `boot_stall_hard` ONCE per launch + PostHog {phase:'hard'}; if offline: offline copy, NO Sentry |
| (booted) | any | screen routes away | if phase was ever > quiet: PostHog `boot_recovered` {elapsed_ms, max_phase} |

Rules:
- Phases only move forward within one attempt. **Try again** resets the clock to `quiet` and starts
  a new attempt (attempt counter increments).
- The Sentry alarm fires **at most once per app launch** (module-level flag), regardless of how many
  Try-again attempts follow. PostHog events are per phase transition (cheap, useful).
- "We've been notified" copy is shown **only if the alarm was actually sent** (device online AND
  Sentry enabled). Never claim notification we did not send. Offline gets the offline copy; a build
  with Sentry disabled (no DSN / dev) gets the generic "try again in a few minutes" copy.

### 2.3 Thresholds and retry policy (client constants, deliberately NOT `engine_config`)

CLAUDE.md's default is "new UX constant -> engine_config field." **This is the exception, on purpose:**
these values must work when the database is unreachable, so they are baked into the client. Put them
in `constants/bootStall.ts`:

```ts
export const BOOT_STALL = {
  SOFT_MS: 6_000,
  MEDIUM_MS: 15_000,
  HARD_MS: 45_000,
  RECIPE_READ_TIMEOUT_MS: 10_000,   // per attempt abort on the users.has_ai_recipe read
  RECIPE_RETRY_BACKOFF_MS: [1_000, 2_000, 4_000, 8_000], // then 8s + jitter until HARD
  PROBE_TIMEOUT_MS: 5_000,
} as const;
```

Rationale for the numbers (Kevin can tune; state them in the PR):
- Normal boot resolves Stage 2 in well under 3s even on LTE, so 6s never flashes text on a healthy
  boot. If QA shows the soft line appearing on a normal cold start, raise SOFT_MS before shipping.
- The 2026-09-18 incident had every endpoint timing out at 20s. HARD at 45s is past one full
  server-side timeout plus retries, so it is a real outage signal, not a slow-network false alarm.
- **Thundering-herd guard:** the recurring pool-saturation failure gets WORSE if every stuck client
  retries aggressively. So: bounded backoff, one in-flight read at a time (abort before retrying),
  and **after HARD there are no automatic retries at all**, only the manual Try again. A test locks
  this.
- Invariant to lock in a test: `SOFT_MS < MEDIUM_MS < HARD_MS`, and
  `HARD_MS > RECIPE_READ_TIMEOUT_MS + RECIPE_RETRY_BACKOFF_MS[0]` (at least one full timed-out
  attempt plus a retry happens before we declare failure).

### 2.4 Reachability probe (device offline vs our backend down)

Pure `fetch`, no native module. Distinguishes "you're on airplane mode" (no alarm, offline copy)
from "our backend is down" (alarm, notified copy). New `lib/reachability.ts`:

```ts
// Race two independent, non-Supabase endpoints; any 2xx/3xx = online.
// Primary is OUR site on Vercel (separate infra from Supabase): proves internet AND
// that "not Supabase" is up. Secondary is a tiny always-on 204.
const PROBES = ['https://dreambotapp.com/', 'https://www.gstatic.com/generate_204'];
export async function probeReachability(timeoutMs): Promise<'online' | 'offline'>
```
- Use `method: 'HEAD'`, `cache: 'no-store'`, an `AbortController` + `setTimeout` (do NOT rely on
  `AbortSignal.timeout`; Hermes support is not guaranteed).
- Any thrown error / timeout on BOTH = `offline`. One success = `online`.
- Runs once when entering `medium`; re-run on every Try again. Result cached for the attempt.

### 2.5 The alarm: Sentry is the independent backend

Kevin asked for "some other backend service." Sentry is already wired, already in the native
build, already independent of Supabase, and already emails Kevin. No new endpoint, no new secret,
no abuse surface. (An alternative, a Vercel route on `dreambot-web` that emails/pushes, is listed in
§8 as a later option; it needs new infra and rate-limiting and is not needed for v1.)

Add to `lib/sentry.ts`:
```ts
/** Report a non-exception signal. Groups by fingerprint so an alert rule can count it. */
export function captureMessage(
  message: string,
  opts: { level?: 'info' | 'warning' | 'error'; tags?: Record<string, string>;
          extra?: Record<string, unknown>; fingerprint?: string[] }
): boolean  // returns whether it was actually sent (DSN present AND enabled)
```
The `boolean` return is what the copy selector uses to decide whether it may say "we've been
notified." Implement as: `if (!DSN || __DEV__) return false; Sentry.withScope(...)`.

The client fires, once per launch, only when `reachability === 'online'`:
```ts
captureMessage('boot_stall_hard', {
  level: 'error',
  fingerprint: ['boot-stall-hard'],           // one Sentry issue, so frequency alerts work
  tags: { boot_stall: 'hard', stage, reachability: 'online', app_version },
  extra: { elapsed_ms, attempts, last_error_class },   // no PII, no user id needed
});
```

**Sentry alert rule (one-time setup, Sentry UI, org `kevin-mchenry`, project `dreambot`):**
- Alerts -> Create Alert -> Issues.
- Environment: `production` (the SDK tags builds from `EXPO_PUBLIC_APP_ENV`; local release builds
  report as `local`, keep them out of the paging rule).
- Conditions: "The issue is seen more than **3** times in **5 minutes**" (a rate, so a single flaky
  phone never pages). Filter: tag `boot_stall` equals `hard`.
- Action: email Kevin (and the Sentry mobile app for push if installed). Optional second rule at
  "more than 10 in 1 hour" as a slow-burn catch.
- Name it `Boot stall (users cannot load the app)`. Record the rule in `RELEASES.md` or the
  observability memory so the next agent knows it exists.

### 2.6 Copy (Kevin asked for options; pick one per tier, all in `constants/bootStall.ts`)

Voice: calm, honest, short, a little DreamBot-deadpan. No em dashes. Never blame the user's phone
unless the probe says offline.

**Soft (6s), one line under the wordmark:**
1. "Still waking up…"  ← recommended
2. "Warming up the dream engine…"
3. "One sec, stretching…"

**Medium (15s):**
1. "Taking longer than usual. Still trying…"  ← recommended
2. "Our servers are a little sleepy. Still trying…"
3. "Hang tight, still connecting…"

**Hard, backend down, alarm SENT:**
- Title: "We can't reach DreamBot right now"
- Body: "Our servers aren't responding. We've been notified and are on it. Please try again in a
  few minutes."  ← recommended
- Alt body: "DreamBot is having a moment. Our team has been alerted. Try again shortly."
- Button: "Try again"
- Small hint under the button: "If this keeps happening, close the app fully and reopen it."

**Hard, backend down, alarm NOT sent (Sentry off, e.g. dev / no DSN):**
- Same title. Body: "Our servers aren't responding. Please try again in a few minutes."
  (No "notified" claim.)

**Hard, device OFFLINE (probe failed):**
- Title: "You're offline"
- Body: "Check your connection and try again."
- Button: "Try again". No Sentry event.

### 2.7 UI

`components/StartupLogo.tsx` gains an optional prop:
```ts
type BootStatus =
  | { phase: 'quiet' }
  | { phase: 'soft' | 'medium'; line: string }
  | { phase: 'hard'; title: string; body: string; cta: string; hint?: string; onRetry: () => void };
export function StartupLogo({ status }: { status?: BootStatus })
```
- Wordmark block is UNCHANGED (220pt, centered, black). Do not wrap it in anything that changes its
  layout.
- Status block is `position: 'absolute'`, anchored below center (`top: '50%'` +
  `verticalScale(...)`), full width, centered text, so the wordmark never moves. Fade in with
  Reanimated `FadeIn` (already a dependency).
- soft/medium: one `AppText` line, `colors.textSecondary`, `fontScale(14)`.
- hard: title `fontScale(20)` 800-weight, body `fontScale(15)` with lineHeight, `GradientButton`
  labelled "Try again", hint `fontScale(12)` `textSecondary`. Mirror `AppErrorBoundary` styles.
- iPad: text block `maxWidth` ~ `horizontalScale(360)`, centered.
- Use `@/lib/responsive` for every number. No hardcoded pixel values in new styles.

Admin QA preview (mirror `ForceUpdateGate`):
```ts
let _setPreview: ((s: BootStatus | null) => void) | null = null;
export function showBootStallPreview(phase: 'soft' | 'medium' | 'hard-online' | 'hard-offline' | null)
```
Wire a `SettingsRow` in `app/settings/index.tsx` next to "Preview update gate (QA)" (~line 404).
The preview renders a full-screen `StartupLogo` in a `Modal` with the chosen status (tap backdrop or
"Close preview" to exit), so it is inspectable from inside the running app. Admin-only, like the
existing rows.

### 2.8 Wiring in `app/index.tsx`

Replace the inline `resolveRecipe` loop with two pieces:

**`lib/bootRecipeResolver.ts`** (pure, injectable, fully unit-tested):
```ts
export async function resolveHasRecipe(opts: {
  read: (signal: AbortSignal) => Promise<{ data: { has_ai_recipe: boolean } | null; error: unknown }>;
  isCancelled: () => boolean;
  deadlineMs: number;                // = BOOT_STALL.HARD_MS - elapsed so far
  timeoutMs: number;                 // BOOT_STALL.RECIPE_READ_TIMEOUT_MS
  backoffMs: readonly number[];      // BOOT_STALL.RECIPE_RETRY_BACKOFF_MS
  now: () => number; sleep: (ms) => Promise<void>;   // injectable for fake timers
  onAttempt?: (n: number, err: unknown) => void;
}): Promise<boolean | null>          // null = never confirmed (sunnysteph invariant)
```
- Each attempt: new `AbortController`, `setTimeout(abort, timeoutMs)`, `await read(signal)`, clear
  the timer.
- Success -> return `data?.has_ai_recipe ?? false` (a CONFIRMED read may say false).
- Error -> backoff (array, then last value + 0..1000ms jitter) and retry **only while
  `now() < deadline`** and not cancelled. Past the deadline -> return `null`. No further automatic
  attempts. (Thundering-herd guard.)

In `index.tsx`, the `read` is:
```ts
(signal) => supabase.from('users').select('has_ai_recipe').eq('id', user.id).single().abortSignal(signal)
```
The effect depends on `[user, attempt]` so Try again re-runs it.

**`hooks/useBootStall.ts`:**
```ts
export function useBootStall(stage: 'auth' | 'route' | null): {
  status: BootStatus; attempt: number; retry: () => void;
}
```
- `BOOT_T0 = Date.now()` at MODULE scope (JS start, which is what the user perceives after the native
  splash). On retry, T0 for the new attempt = now.
- While `stage !== null`: schedule three `setTimeout`s at SOFT/MEDIUM/HARD relative to attempt T0
  (no polling interval; no re-render until a phase flips). Clear them all on unmount / when
  `stage` becomes null.
- On `medium`: `probeReachability()` -> store result.
- On `hard`: if reachability is still `unknown` (probe pending), await it (bounded by
  PROBE_TIMEOUT_MS) before choosing copy. If `online` and not yet alarmed this launch:
  `captureMessage(...)` -> `alarmSent = true|false`. Choose copy via `lib/bootStall.ts`.
- When `stage` flips to null and max phase reached was > quiet: `trackBootRecovered({ elapsed_ms,
  max_phase, attempts })`.
- `retry()`: increments `attempt`, resets phase to quiet and T0, clears reachability, re-arms timers.
  It does NOT call `initialize()` again (that would double-subscribe `onAuthStateChange`). For Stage 1
  the pending `getSession()` / auto-refresh ticker resolves on its own when Auth recovers; the retry
  is about giving the user agency and a fresh clock. For Stage 2 the `attempt` bump re-runs the
  resolver.

**`lib/bootStall.ts`** (pure): `phaseForElapsed(ms)`, `maxPhase(a,b)`, and
`copyFor({ phase, reachability, alarmSent })` returning the exact strings from the constants file.

`index.tsx` becomes:
```ts
const stage = !initialized ? 'auth' : !session ? null : hasRecipe === null ? 'route' : null;
const { status, attempt, retry } = useBootStall(stage);
...
if (!initialized) return <StartupLogo status={status} />;
if (!session) return <Redirect href="/(auth)" />;
if (hasRecipe === null) return <StartupLogo status={status} />;
```
(where `status.onRetry` is `retry`).

### 2.9 Analytics (PostHog, `lib/analytics.ts`)

Add typed wrappers and list them in `ANALYTICS_PLAN.md`'s event map:
- `boot_stall` `{ phase: 'soft'|'medium'|'hard', stage: 'auth'|'route', elapsed_ms, reachability,
  attempt }`
- `boot_recovered` `{ elapsed_ms, max_phase, attempts }`   ← the "loading time impacted" metric
- `boot_retry_tapped` `{ attempt, phase_at_tap }`

These give a funnel: how many launches ever show soft copy, how many reach hard, and recovery times,
which is the thing to check the morning after any incident.

---

## 3. Implementation checklist (file by file): AS BUILT 2026-09-18

1. `constants/bootStall.ts` (NEW): thresholds + all copy strings + probe URLs.
2. `lib/bootStall.ts` (NEW): `phaseForElapsed`, `copyFor`, `shouldAlarm`, `recipeDeadline`, the types.
2b. `lib/bootStallMachine.ts` (NEW, added during the build): the pure state machine , `step(state,
    event) → {state, effects}` + `statusFor`. Every timing/alarm/retry decision lives here so it is
    unit-tested instead of hand-tested inside a hook. The hook only arms timers and runs effects.
3. `lib/reachability.ts` (NEW): `probeReachability(timeoutMs)`.
4. `lib/bootRecipeResolver.ts` (NEW): `resolveHasRecipe(...)` as specified in §2.8.
5. `lib/sentry.ts` (MOD): add `captureMessage(...)` returning `boolean`.
6. `lib/analytics.ts` (MOD): `trackBootStall`, `trackBootRecovered`, `trackBootRetryTapped`.
7. `hooks/useBootStall.ts` (NEW): the timer/state hook; single `alarmSent` module flag.
8. `components/StartupLogo.tsx` (MOD): `status` prop + absolutely-positioned status block +
   `showBootStallPreview` QA hook. Keep the wordmark block byte-identical.
9. `app/index.tsx` (MOD): wire hook + resolver; keep the sunnysteph comment and invariant.
10. `app/settings/index.tsx` (MOD): "Preview boot stall (QA)" `SettingsRow` (cycles phases on tap
    or opens a tiny picker; admin-only block).
11. Tests (NEW): `__tests__/lib/bootStall.test.ts`, `bootRecipeResolver.test.ts`, `reachability.test.ts`,
    `bootStallMachine.test.ts`: 54 tests, see §4. The jest Sentry stub gained `withScope`.
12. `ANALYTICS_PLAN.md` (MOD): add the three events to the call-site map.
13. Sentry alert rule (UI, §2.5). Note it in the observability memory / `RELEASES.md`.
14. Ships in the next App Store build (client code, no OTA). Log it in `RELEASES.md` when released.

TypeScript strict: no `any` / `as unknown as`. Prettier + lint + tsc + jest run in the husky
pre-commit; never `--no-verify`. Explicit-path `git add` only (shared tree).

---

## 4. Tests (fast jest lane, must be green in husky + CI)

`__tests__/lib/bootStall.test.ts`
- phase boundaries: 0 -> quiet, SOFT_MS-1 -> quiet, SOFT_MS -> soft, MEDIUM_MS -> medium,
  HARD_MS -> hard, and monotonic.
- threshold invariants: `SOFT < MEDIUM < HARD`; `HARD > RECIPE_READ_TIMEOUT + backoff[0]`.
- copy selection: hard+online+alarmSent -> contains "notified"; hard+online+!alarmSent -> does NOT
  contain "notified"; hard+offline -> offline copy and never "notified"; soft/medium -> single line,
  no CTA.
- copy has no em dashes (Kevin's house rule; regex `/\u2014/` must not match any string).

`__tests__/lib/bootRecipeResolver.test.ts` (jest fake timers, injected `now`/`sleep`/`read`)
- clean `true` read resolves `true` on attempt 1; clean `false` read resolves `false` (a confirmed
  false is allowed).
- **sunnysteph invariant:** any sequence of errors never resolves `false`; past the deadline it
  resolves `null`.
- a read that never settles is aborted at `timeoutMs` (assert the `AbortSignal` was aborted) and a
  retry follows after backoff.
- backoff schedule follows the array then plateaus (with jitter within 0..1000ms).
- **thundering-herd guard:** no attempt starts once `now() >= deadline`; count attempts.
- `isCancelled()` true mid-backoff -> stops, resolves `null`, no further `read` calls.
- recovery: errors on attempts 1-3, success on 4 -> resolves the read value (the "backend came back
  20s later" case that today strands the user forever).

Hook/UI are verified manually (§5); render-time behavior has no automated coverage in this repo
(memory: `feedback_render_crashes_uncovered_prefer_core_apis`), so keep the hook thin and the logic
in the tested pure modules.

---

## 5. QA and simulation (do all of these before calling it done)

1. **Healthy boot never shows text.** Cold-start the release build 5 times on Wi-Fi and 5 on LTE.
   The soft line must never appear. Take a screenshot at handoff and compare the wordmark position
   pixel-for-pixel against the native splash (the `StartupLogo.tsx` constraint).
2. **Admin preview.** Settings -> "Preview boot stall (QA)" -> cycle soft / medium / hard-online /
   hard-offline. Check iPhone and iPad layouts, Dynamic Type at the largest setting, and that the
   wordmark does not move between phases.
3. **Real Stage 2 stall (backend black-hole, device online).** Run `dreambot` with
   `EXPO_PUBLIC_SUPABASE_URL=https://10.255.255.1` (a non-routable IP so requests hang, not fail
   fast). Expect: soft at ~6s, medium at ~15s, probe returns `online`, hard at ~45s with the
   "notified" copy in a release build (`dreambot --release`, Sentry on) or the non-notified copy in
   Debug. Try again restarts the clock and a new read attempt. Restore the URL after.
4. **Alarm lands in Sentry.** From the `--release` run in step 3, confirm one `boot_stall_hard` issue
   in sentry.io with environment `local`, tags `boot_stall=hard`, `stage=route`, `reachability=online`.
   Tap Try again twice more: still exactly ONE event for the launch.
5. **Device offline.** Airplane mode ON, cold start. Expect offline copy at hard and **no** Sentry
   event. Airplane mode OFF, tap Try again: app boots, `boot_recovered` fires in PostHog.
6. **Recovery without retry.** Airplane mode ON at launch, wait ~20s (medium phase), airplane mode
   OFF, do nothing. Expect the in-flight retry loop to succeed on its own before hard and the screen
   to route away. (Proves the "backend comes back later" fix.)
7. **Stage 1 stall.** Force an expired token (set the device clock forward past token expiry, or
   wait one out) then black-hole Auth. Expect the same phases with `stage=auth`. Restore. Then verify
   with a debug log whether auth-js's auto-refresh ticker is actually running at cold start in RN
   (the `AppState` listener in `lib/supabase.ts` only calls `startAutoRefresh()` on a state CHANGE).
   If it is not running, Stage 1 self-heal relies solely on the pending `getSession()` resolving;
   document what you find in this section.
8. **Thundering herd.** In step 3, count network attempts (Metro log or Charles): bounded backoff
   until hard, then zero automatic attempts until Try again is tapped.
9. `npm run check` green; commit with explicit paths.

---

## 6. Rollout

- Client-only change, ships with the next binary (no OTA in this app). Create the Sentry alert rule
  any time before that build is live.
- No `engine_config` flag by design (§2.3). If Kevin wants a kill switch for the ALARM only, the
  safe place is a persisted `engineConfig` boolean read from the TanStack persisted cache (last known
  value), defaulting to ON. Not needed for v1.
- Post-ship check, next incident: PostHog `boot_stall` / `boot_recovered` counts and the Sentry issue
  timeline should match the incident window. Add that to the outage triage memory.

---

## 7. Non-goals (do not build without a separate go from Kevin)

- No global fetch timeout on the Supabase client. Long-running direct calls exist (`restyle-photo`,
  `describe-photo`, `upscale-image`); a global timeout would break them. Timeouts here are scoped to
  the boot read only.
- No change to `lib/postAuthRoute.ts` (the post-login `has_ai_recipe` read). Different surface, not
  the splash.
- No maintenance-mode banner / status message from the DB (cannot be read when the DB is down).
- No new server endpoint for the alarm (§8).

---

## 8. Phase 2 options (recommended, decide separately)

**8.1 Don't strand established users at all (self-healing, the UX Kevin prefers).** Cache a CONFIRMED
`has_ai_recipe === true` in AsyncStorage keyed by user id. On a Stage 2 stall, if the cache says
true, route to `/(tabs)`: the feed is persisted (`lib/queryClient.ts` `PERSISTED_ROOTS`) so the app
opens read-only-ish on cached content instead of a logo. Never cache `false`. Invalidate on: the
server-side profile reset (`app/settings/index.tsx:444`), sign-out, account deletion. Set it in
`lib/saveVibeProfile.ts:31` (the only client write of `true`). Risk to weigh: a user who reset their
profile on another device gets routed to tabs once until a clean read corrects it.

**8.2 A second alarm channel on our own infra.** A `dreambot-web` Vercel route (`/api/boot-alarm`)
that emails/pushes Kevin. Needs rate-limiting (public endpoint), a secret, and email infra; Sentry
already does this job. Only worth it if Sentry paging proves unreliable.

**8.3 A server-side boot canary.** A GitHub Actions monitor doing an anon PostgREST read of
`engine_config` every 5 minutes, failing loud. `db-health-monitor.yml` already effectively does this
(it reads through PostgREST and fails on error), so verify that first rather than adding another.

---

## 9. Open decisions for Kevin (defaults are chosen; change them in `constants/bootStall.ts`)

1. Copy: recommended lines are marked in §2.6.
2. Thresholds: 6 / 15 / 45 seconds. If he wants the hard state sooner, 30s is the floor I would go to
   (one full server timeout plus one retry).
3. Whether to also build Phase 2 §8.1 (routing established users to cached content during an outage).
