# Analytics Instrumentation Plan — reliable, comprehensive PostHog coverage

**Goal (Kevin, 2026-07-17):** track every meaningful user action so we can see *what people do and how often* — and make sure the **eventual event fires even when the user isn't on screen** (queued dreams, background renders, purchases completed after the app is closed). This supersedes the event table in `ANALYTICS_PLAN.md` (kept as the high-level intent doc) with a concrete, reliability-classified implementation spec.

Backed by a full audit (four parallel interaction-path sweeps + live PostHog data). The evidence of the problem:
- **86% of PostHog persons are anonymous hashes** (128 of 148 in 9 days never identified).
- `dream_created` **82 vs 488** `dream_create_started`; `first_dream_generated` **1 in 30 days**; `onboarding_completed` **1 in 9 days** — all real completions the client missed.

---

## The two root causes (and the two-part fix)

1. **Identity fragments.** `AnalyticsIdentity` (`app/_layout.tsx:640-642`) calls `posthog.reset()` whenever `userId` is falsy — including the transient pre-hydration window on **every cold start** — minting a fresh anonymous id each launch and orphaning any session that ends before identify re-runs. → **Fix A: identity.**
2. **Completions are client-side on async pipelines.** Dreams, purchases, and upscales finish **server-side, seconds-to-minutes later**, often after the user has left. Every completion/milestone event fires from a client screen that's frequently gone. → **Fix B: emit completions server-side.**

### The dividing line (the core principle)
- **Synchronous taps** (like, comment, follow, view, screen open, store open, button taps) → **client-immediate**. The user is present at the tap; the client SDK is reliable. Just fill the gaps.
- **Asynchronous completions / server-authoritative facts** (dream rendered, purchase granted, upscale done, sparkles charged, subscription renewed/cancelled/expired, nightly dreams) → **emit from the server** at the source of truth, keyed to the user id. Independent of whether the app is open.

Both halves share **one identity**: server events use `distinct_id = <supabase user id>`, and the client's `identifyUser(userId)` uses the same id — so server + client events land on the **same PostHog person**. This only works once Fix A stops fragmenting that id.

---

## Fix A — Client identity (P0, contained, no secret needed)

`app/_layout.tsx` `AnalyticsIdentity`:
- **Do not `reset()` on the transient undefined session.** Track auth hydration; only call `resetAnalytics()` on a real **authed→unauthed transition** (actual logout), never on the initial "session not yet restored" state.
- **Identify immediately.** Call `identifyUser(userId)` as soon as `userId` is known (synchronously), then enrich the `username` person-property when the Supabase fetch returns — instead of blocking the identify on a network round-trip (which widens the anonymous pre-identify window every launch).
- Keep the admin opt-out (`setAnalyticsOptOut(isAdmin)`) exactly as is.

Expected result: the anonymous-person count collapses to genuine logged-out/pre-onboarding sessions; returning users keep a stable person across launches; server events attach to that same person.

---

## Fix B — Server-side capture (P1, the reliability backbone)

### The helper — `supabase/functions/_shared/posthogCapture.ts`
A tiny fire-safe emitter every edge function can call:
```ts
// POST ${POSTHOG_HOST}/capture/  with the PUBLIC project key.
// No-op if POSTHOG_PROJECT_KEY is unset (mirrors the client's __DEV__ gate).
export async function captureServer(
  userId: string,
  event: string,
  properties: Record<string, unknown> = {},
  opts: { insertId?: string } = {}
): Promise<void> {
  const key = Deno.env.get('POSTHOG_PROJECT_KEY');
  if (!key || !userId) return;
  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: userId,                 // == the client's identify id → same person
        properties: { ...properties, environment: 'production', $lib: 'edge' },
        uuid: opts.insertId,                 // dedup key so a render RETRY can't double-count
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.warn(`[posthog] capture ${event} failed: ${(e as Error).message}`); // never throw
  }
}
```
Notes:
- **Key**: `POSTHOG_PROJECT_KEY` = the project's **public** write key (`phc_…`, the same value already shipped in the client bundle as `EXPO_PUBLIC_POSTHOG_KEY`) — set as a Supabase **edge secret**. Not a private key; `/capture/` only accepts the public project key.
- **`uuid`/insert_id** = the `jobId` (or `event:jobId`) so idempotency-retried renders and at-least-once webhooks don't double-count.
- **Awaited but never throws** — a failed analytics POST must never break a render/webhook (same discipline as the `style_summary` distill).
- Deployed as part of each edge function that imports it (`supabase functions deploy <fn> --no-verify-jwt`).

### Server emission points (the authoritative sources — verified)
| Event | Emit from (file:line) | Covers |
|---|---|---|
| `dream_created {source, medium, vibe, model}` | `_shared/dreamQueueLifecycle.ts:92` `completeQueueJob` (look up user_id + `source`/medium from the `dream_queue`/`uploads` row) | create · dlt · first_dream · restyle (all call it) |
| `dream_created {source:'nightly', …}` | the worker nightly completion `dream-queue-worker/dispatchers/nightly.ts` (nightly doesn't route through completeQueueJob) | nightly |
| `dream_failed {reason, source}` | `_shared/dreamQueueLifecycle.ts:113` `failQueueJob` (dead-letter branch — has `userId`) + nightly `deadLetterAftermath` (`dream-queue-worker/index.ts:103-149`) | all failures |
| `sparkles_spent {amount, reason, dream_id}` | `enqueue-dream/index.ts:297-302` (after `charge_sparkles`) | every paid dream |
| `hd_download_completed {cached:false}` / `hd_download_failed` | `upscale-image/index.ts:260-293` / `295-308` | HD upscale done/failed |
| `sparkles_purchased {pack, amount, transaction_id}` | `revenuecat-webhook/index.ts:352-364` (`NON_RENEWING_PURCHASE`→`grant_sparkles`) | pack purchase COMPLETE |
| `pro_subscribed {tier, period}` | `revenuecat-webhook/index.ts:370-467` (`INITIAL_PURCHASE`) | sub start |
| `pro_renewed` / `pro_cancelled` / `pro_expired` | webhook `417-454` / `497-515` / `471-484` | sub lifecycle |
| `sparkles_refunded {amount}` | webhook `254-334` (support refund) | clawback |
| `onboarding_completed` | `enqueue-dream/index.ts` first_dream branch (`79-99`) — the server-authoritative "just finished onboarding" signal | onboarding done |

`first_dream_generated` becomes **derivable** from `dream_created {source:'first_dream'}` (server) — keep the client event for back-compat, but the server one is authoritative.

**Idempotency for webhooks:** RevenueCat delivers at-least-once — use the RevenueCat event id as the `uuid` so a redelivery doesn't double-count revenue.

---

## The complete event taxonomy

Legend — **Source:** `C` = client-immediate (reliable, user present) · `S:<fn>` = server-side emit. **Status:** ✓ exists & reliable · ⚠ exists but unreliable/misplaced · ✗ missing. **Pri:** P0-P3.

### Session & identity
| Event | When | Source | Status | Pri |
|---|---|---|---|---|
| `Application Opened` / `Became Active` / `Backgrounded` | app lifecycle | C (PostHog autocapture) | ✓ | — |
| `$screen {pathname}` | every route change | C (`_layout.tsx:623`) | ✓ | — |
| `$identify {username}` | on auth | C (`_layout.tsx:656`) | ⚠ churned by reset | **P0** (Fix A) |

### Auth (all currently ✗ untracked)
| Event | When | Source | Pri |
|---|---|---|---|
| `signup_started` / `signup_completed {method}` | email/Google/Apple/Facebook signup | C (`(auth)/signup.tsx`, `(auth)/index.tsx`) | P1 |
| `login_completed {method}` | login success | C (`(auth)/login.tsx`, `(auth)/index.tsx`) | P1 |
| `logout` | sign out | C (`settings/index.tsx:230`) | P2 |
| `account_deleted` | delete account | C before RPC (`settings/index.tsx:312`) | P2 |

### Onboarding
| Event | When | Source | Status | Pri |
|---|---|---|---|---|
| `onboarding_started` | first onboarding screen | C (`(onboarding)/index.tsx`) | ✗ | P2 |
| `onboarding_step_completed {step}` | each step advance | C (`(onboarding)/index.tsx:163`) | ✓ | — |
| `onboarding_completed` | onboarding finished | **S: enqueue-dream first_dream branch** | ⚠ (1 in 9d) | **P1** |
| `first_dream_generated {medium,vibe}` | first dream renders | **S: completeQueueJob (source=first_dream)** | ⚠ (1 in 30d) | **P1** |
| `onboarding_reveal_action {action:post|skip}` | reveal CTA | C (`RevealStep.tsx:298-327`) | ✗ | P3 |

### Dream cast (all ✗)
| Event | When | Source | Pri |
|---|---|---|---|
| `cast_photo_added {slot:self|plus_one|roster}` | upload a cast photo | C (`DreamCastStep.tsx`, `DreamCastRoster.tsx:115`) | P2 |
| `cast_member_removed` / `cast_relationship_set` | roster edits | C (`DreamCastRoster.tsx:203/222`) | P3 |

### Dream lifecycle (the crown jewel — completions go server-side)
| Event | When | Source | Status | Pri |
|---|---|---|---|---|
| `dream_create_started {mode, medium, vibe, model, has_photo, has_cast}` | tap Dream / generate() | C (`useDreamCreate.ts:268`) | ✓ | (enrich props) |
| `dream_created {source, medium, vibe, model}` | render actually completes | **S: completeQueueJob + nightly dispatcher** | ⚠ 83% missed | **P1** |
| `dream_failed {reason, source}` | terminal failure / dead-letter | **S: failQueueJob + nightly deadLetter** | ✗ in queue path | **P1** |
| `sparkles_spent {amount, reason, dream_id}` | sparkles charged | **S: enqueue-dream:297** | ✗ | P1 |
| `dlt_started {source_post_id}` | Dream-Like-This initiated | C (`FullScreenFeed.tsx`) — **flag OFF** (`DLT_ENABLED=false`) | inert | P3 |
| `hd_download_tapped {cached}` | HD long-press | C (`imageLongPress.ts:90`) | ✓ | — |
| `hd_download_completed` / `hd_download_failed` | upscale finishes | **S: upscale-image:260/295** | ✗ | P2 |
| `dream_deleted {is_album}` · `dream_visibility_toggled {to}` · `dream_pinned {pinned}` · `dream_again_loaded` | manage own dream | C (`useDeletePost.ts`, `usePinPost.ts`, `imageLongPress.ts`) | ✗ | P3 |

### Monetization (completions server-side — this is the revenue funnel)
| Event | When | Source | Status | Pri |
|---|---|---|---|---|
| `sparkle_store_opened` · `sparkle_purchase_tapped {pack}` | store intent | C (`sparkleStore.tsx`) | ✓ | — |
| `pro_store_opened` · `pro_subscribe_tapped {period}` | sub intent | C (`subscribe.tsx`) | ✓ | — |
| `sparkles_purchased {pack, amount}` | pack purchase GRANTED | **S: revenuecat-webhook:352** | ✗ | **P1** |
| `pro_subscribed {tier, period}` · `pro_renewed` · `pro_cancelled` · `pro_expired` · `sparkles_refunded` | sub lifecycle | **S: revenuecat-webhook** | ✗ | **P1** |
| `restore_purchases_tapped` · `gift_sent {recipient_count}` | store extras | C (`sparkleStore.tsx`) | ✗ | P3 |

### Content consumption
| Event | When | Source | Status | Pri |
|---|---|---|---|---|
| `feed_tab_selected {tab}` | forYou/following/bots switch | C (`(tabs)/index.tsx`) | ✓ | — |
| `post_viewed {is_own, is_bot, source}` | open a post | C (`photo/[id].tsx:56`) | ✓ | — |
| `profile_viewed {is_self}` | open a profile | C (`profile.tsx`, `user/[userId].tsx`) | ✓ | — |
| `bot_viewed {bot_id, bot_name}` | select a bot | C (`(tabs)/bots.tsx`) | ✓ | — |
| `search_initiated {type}` · `search_result_tapped {type}` | search | C (`(tabs)/top.tsx`) | ✗ | P2 |
| `hashtag_viewed {tag}` | open a hashtag page | C (`hashtag/[tag].tsx`) | ✗ | P3 |
| `feed_refreshed` | pull-to-refresh | C (`(tabs)/index.tsx:304`) | ✗ | P3 |
| `inbox_opened` | open inbox | C (`inbox.tsx`) | ✗ | P2 |
| `push_opened {type}` | tap a push notification | C (`lib/notificationRouting.ts`) | ✗ | **P2** (attribution) |

> Note: post **impressions** already flow server-side via `record_impression` (`FullScreenFeed.tsx:495`, mig 090). Leave those in the DB; don't double-emit to PostHog (volume + cost). Consumption depth is already answerable from `$screen` + `post_viewed`.

### Social engagement (synchronous taps → client-immediate; add the missing halves)
| Event | Source | Status | Pri |
|---|---|---|---|
| `post_liked` / **`post_unliked`** | C (`useToggleLike.ts`) | ✓ / ✗ | P2 |
| `comment_added {is_reply}` / **`comment_deleted`** | C (`useAddComment.ts`, `useDeleteComment.ts`) | ✓ / ✗ | P2 |
| **`comment_liked` / `comment_unliked`** | C (`useToggleCommentLike.ts`) | ✗ | P2 |
| `follow_added {target_is_bot}` / **`follow_removed`** / **`follow_request_sent`** | C (`useToggleFollow.ts`) | ✓ / ✗ / ✗ | P2 |
| `post_reposted` / **`post_unreposted`** | C (`useToggleRepost.ts`) | ✓ / ✗ | P3 |
| **`post_saved` / `post_unsaved`** | C (`useToggleFavorite.ts`) | ✗ | P2 |
| `post_shared {recipient_count}` | C (`useSendShare.ts`) | ✓ | — |
| **`user_blocked` / `content_reported {reason, target_type}`** | C (`useBlockUser.ts`, `useReport.ts`) | ✗ | P2 (safety) |

### Settings / profile / notifications (all ✗)
| Event | Source | Pri |
|---|---|---|
| `profile_updated {fields}` · `avatar_uploaded` | C (`edit-profile.tsx`, `useAvatarUpload.ts`) | P3 |
| `notification_pref_changed {category, on}` · `push_permission {granted}` | C (`settings/notifications.tsx`) | P3 |

---

## Implementation phases

- **P0 — Identity (client).** Fix A in `app/_layout.tsx`. Ship in the next build. Immediately fixes anonymous-hash inflation + makes every later event attributable. *(No secret, no edge deploy.)*
- **P1 — Server completions (the reliability core).** `_shared/posthogCapture.ts` + `POSTHOG_PROJECT_KEY` edge secret, then wire: `dream_created`/`dream_failed` (queue lifecycle + nightly), `sparkles_spent` (enqueue-dream), the full **revenuecat-webhook** money set, and `onboarding_completed`. Deploy the touched edge fns. This is what fixes "saylor / first_dream / dreams-created" — the events you flagged.
- **P2 — High-value client gaps.** Auth (signup/login), `push_opened`, `inbox_opened`, search, the missing social halves (unlike, comment-like, save, block, report), `hd_download_completed`. Ships with a build.
- **P3 — Long tail.** Management actions, cast edits, settings toggles, reveal/gift extras.
- **P4 (insurance) — reconciliation sweep.** An hourly cron that finds `dream_queue`/`upscale_jobs`/purchases with a terminal state but no matching PostHog event and backfills — a completeness net so a missed emit is self-healing. Build only if P1 shows residual gaps.

## Conventions
- **Names:** `snake_case`, `noun_verb` past tense for completed facts (`dream_created`), `noun_verb` for taps (`sparkle_purchase_tapped`). All events routed through typed wrappers in `lib/analytics.ts` (client) — no magic strings at call sites; server events go through `captureServer`.
- **Standard props** on every event where relevant: `source` (create/nightly/dlt/first_dream), `medium`, `vibe`, `model`, `is_bot`, plus `environment` (super-property). Money events carry `amount` + `pack`/`period` + a transaction id.
- **`distinct_id` = the Supabase user id, everywhere** (client identify + server capture) — the single rule that keeps a user one person across client and server.

## Validation
1. After P0: re-run the anonymous-vs-identified query (target: `never_identified` drops sharply; new sessions attach to stable persons).
2. After P1: **reconciliation check** — `count(dream_queue where status=completed, last 24h)` should ≈ `count(dream_created events, last 24h)` (was 82 vs 488). Same for `revenuecat` grants vs `sparkles_purchased`.
3. Per-event smoke: trigger each in a release build, confirm arrival in PostHog Activity within a minute (filter `environment=production`).
4. Lock the money-event emit points with a note in the webhook so a future edit can't silently drop them.

## Privacy
Third-party analytics must stay declared in the App Store privacy nutrition label + the `dreambot-web` privacy policy. Events are behavioral, keyed to the app user id; **no new PII** beyond what the app already holds. Server-side capture sends only `user_id` + behavioral props to PostHog (no email/photos).

## Open decisions for Kevin
1. **Server emit style:** the `captureServer` helper at ~7 call sites (recommended — explicit, rich props, testable) **or** a single `dream_queue` DB trigger via `pg_net` (one point, impossible to miss, but unconventional + needs a vault secret + bot exclusion). *Recommend the helper; add P4 reconciliation as the safety net.*
2. **Scope now:** do P0+P1 first (fixes everything you've flagged), then batch P2/P3 — or instrument everything in one pass?
3. **Impressions:** leave server-side `record_impression` as-is (recommended) or also mirror a sampled `post_impression` to PostHog for funnels?
