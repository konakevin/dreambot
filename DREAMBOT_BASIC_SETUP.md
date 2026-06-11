# DreamBot Basic — Setup & Build Plan

A new **$4.99/mo subscription tier** that sits between Free and Pro: it turns the
**nightly dream engine** back on (the core retention feature) plus a light sparkle
top-up and a few HD downloads. This doc is the step-by-step checklist — **Kevin's
dashboard tasks** (App Store Connect / RevenueCat) and the **code tasks** — in
dependency order. Work top-to-bottom; check items off as we go.

Background + economics: see the proposal in chat (2026-06-11). Existing Pro impl is the
template throughout — mirror it. Reference: `PRO_SUBSCRIPTION_SETUP.md`.

---

## ✅ STATUS (2026-06-11) — code-complete, pre-commit gate green

- ✅ **Phase 0** locked (both plans, 20✦, 20 HD, no Basic trial, mirror-Pro columns)
- ✅ **Phase 1** ASC products created · **Phase 2** RevenueCat (`basic` entitlement + `subscriptions` offering w/ all 4 packages)
- ✅ **Phase 3** migration 257 applied + verified · ✅ **Phase 4** `revenuecat-webhook` tier-aware + deployed
- ✅ **Phase 5** the 3 eligibility runtimes (SQL `is_dream_eligible`, cron, client store) · ✅ **Phase 6** `upscale-image` per-tier HD cap + client gate, deployed
- ✅ **Phase 7** new `app/subscribe.tsx` Free/Basic/Pro paywall + `constants/basicPlan.ts`; old `proStore` deleted, all CTAs → `/subscribe`
- ✅ **Phase 8** tests — proStatus/nightlyEligibility/imageLongPress/webhook-audit Basic cases + `isDreamEligible.dbspec.ts` (730 jest pass; dbspec validates in CI)
- ⏳ **Phase 9** sandbox QA (needs a real test purchase) · ⏳ **Phase 10** launch

Deferred polish (non-blocking): tier-specific analytics events (reused `trackProSubscribeTapped` period-only); `get_engine_config` RPC not extended for the Basic HD cap (client uses the code constant; server reads the column directly).

---

## Phase 0 — Lock the config (DO FIRST — blocks everything)

These numbers get hard-coded into ASC, RevenueCat, DB defaults, and copy. Lock them once.

| Knob | Recommended | Status |
|---|---|---|
| Tier name | **DreamBot Basic** (parallel to "DreamBot Pro") | ☐ |
| Monthly price | **$4.99/mo** | ☐ |
| Yearly price | **$39.99/yr** (save 33%) — *or* monthly-only at launch | ☐ |
| Nightly dreams | **every night (~30/mo)** — the core | ☐ |
| Monthly sparkle bundle | **15 ✦/mo** (your 10–20 range; 5× gap to Pro's 75) | ☐ |
| HD downloads/mo | **15** (Pro = 100) | ☐ |
| Intro free trial on Basic | **none** — the existing 14-day free nightly trial IS the funnel (avoid double-trial). *Decision.* | ☐ |
| Entitlement name | **`basic`** (separate from `pro`) | ☐ |
| Subscription group | **SAME group as Pro** — so Apple treats Basic↔Pro as upgrade/downgrade crossgrades (one active sub per group) | ☐ |
| Product IDs | `com.konakevin.radorbad.basic.monthly` / `.basic.yearly` | ☐ |

**Tier precedence rule (used everywhere):** a user is **dream-eligible** if `basic OR pro OR in-trial`. If somehow both entitlements are active, **Pro wins** (higher caps). HD cap = `pro?100 : basic?15 : 0-for-others`.

---

## Phase 1 — Kevin: App Store Connect

> All in App Store Connect → your app → **Subscriptions**.

- ☐ **1.1** Open the EXISTING subscription group that holds DreamBot Pro (do NOT make a new group — same group = clean up/downgrade between Basic and Pro).
- ☐ **1.2** Create **DreamBot Basic (Monthly)** auto-renewable subscription:
  - Product ID: `com.konakevin.radorbad.basic.monthly`
  - Subscription duration: 1 month
  - Price: **$4.99** (US tier) → set all territories
  - Subscription level/rank: **below** Pro (Basic = lower tier in the group)
- ☐ **1.3** Create **DreamBot Basic (Yearly)** *(skip if launching monthly-only)*:
  - Product ID: `com.konakevin.radorbad.basic.yearly`
  - Duration: 1 year · Price: **$39.99** · same level as Basic monthly
- ☐ **1.4** Localizations (display name "DreamBot Basic", description) for each.
- ☐ **1.5** Intro offer: **none** (per Phase-0 decision) — leave blank.
- ☐ **1.6** Review info: screenshot of the Basic paywall (can't submit for review until the paywall screen exists — circle back after Phase 7), review notes.
- ☐ **1.7** Confirm **App Store Small Business Program** enrollment (15% cut vs 30%) — if not already enrolled, do it before launch. Single biggest margin lever.
- ☐ **1.8** Products will sit in "Missing Metadata" / "Ready to Submit" until attached to a build for review — that's fine for sandbox testing.

---

## Phase 2 — Kevin: RevenueCat

> RevenueCat dashboard → your project.

- ☐ **2.1** **Products** → add `com.konakevin.radorbad.basic.monthly` (+ `.basic.yearly`) — RevenueCat auto-imports from ASC once they exist.
- ☐ **2.2** **Entitlements** → create a new entitlement **`basic`**. Attach both basic products to it. (Leave `pro` entitlement as-is.)
- ☐ **2.3** **Offerings** → add Basic packages to the **default offering** so the paywall can show Free / Basic / Pro together:
  - Package `$rc_monthly` already used by Pro — so add Basic as custom packages, e.g. `basic_monthly` / `basic_annual`, OR create a dedicated offering `default_v2` with all four packages. **Decision: extend the current offering with `basic_monthly`/`basic_annual` custom packages.**
- ☐ **2.4** Webhook: **already configured** (`REVENUECAT_WEBHOOK_SECRET` → `revenuecat-webhook` Edge function). No new webhook — the same endpoint will receive Basic events once the code handles them (Phase 4).
- ☐ **2.5** Note the exact product identifiers + package identifiers and paste them into `constants/basicPlan.ts` (Phase 7).

---

## Phase 3 — Code: DB migration (`supabase/migrations/NNN_dreambot_basic.sql`)

> `ls supabase/migrations/ | grep ^NNN` first for the next free prefix. Run via dashboard SQL editor (DDL). Then regen types.

- ☐ **3.1** `ALTER TABLE users` add: `basic_subscription boolean NOT NULL DEFAULT false`, `basic_subscription_expires_at timestamptz`. (Mirror the `pro_subscription` columns — minimal blast radius vs a tier-enum refactor.)
- ☐ **3.2** **Freeze these columns on user UPDATE** — extend the `freeze_*_columns_on_update` trigger (ref `migrations/108_uploads_rls_lockdown.sql` pattern) so a user can't self-grant Basic; only the webhook (service role) writes them. **Critical — Postgres doesn't enforce `WITH CHECK` for you.**
- ☐ **3.3** `CREATE FUNCTION is_basic_active(uid uuid) RETURNS boolean` — `basic_subscription = true AND (basic_subscription_expires_at IS NULL OR basic_subscription_expires_at > now())`. (No trial component — Basic has no intro trial.)
- ☐ **3.4** `CREATE FUNCTION is_dream_eligible(uid uuid) RETURNS boolean` — `is_pro_active(uid) OR is_basic_active(uid)`. (`is_pro_active` already includes the 14-day trial.) **This becomes the nightly gate.** `DROP FUNCTION IF EXISTS` first if re-running.
- ☐ **3.5** `engine_config` new columns + defaults: `basic_monthly_sparkle_bundle int DEFAULT 15`, `basic_hd_downloads_per_month int DEFAULT 15`. (Pro's `pro_monthly_sparkle_bundle`=75 stays; add a `pro_hd_downloads_per_month` if you want HD caps fully DB-driven too — currently `PRO_HQ_DOWNLOADS_PER_MONTH` is a code const = 100.)
- ☐ **3.6** `grant_basic_sparkles(uid, amount, txn)` RPC — idempotent on `basic_bundle:<txnId>` (clone `grant_sparkles` / the pro bundle grant). Or reuse `grant_sparkles` with a `basic_bundle` reason.
- ☐ **3.7** Update `get_engine_config()` RPC to surface the two new fields (so client `useEngineConfig` + Edge `_shared/engineConfig.ts` see them). `DROP FUNCTION` first (return-shape change → 42P13).
- ☐ **3.8** Run migration in dashboard → `supabase gen types typescript --linked > types/database.ts` → `npx jest __tests__/lib/migrations.test.ts` (unique-prefix check).

---

## Phase 4 — Code: `revenuecat-webhook` Edge function

> `supabase/functions/revenuecat-webhook/index.ts`. Deploy with `--no-verify-jwt`.

- ☐ **4.1** Map the `basic` entitlement / basic product IDs in the event → on `INITIAL_PURCHASE`, `RENEWAL`, `PRODUCT_CHANGE`, `UNCANCELLATION`: set `basic_subscription=true` + `basic_subscription_expires_at` = event expiry.
- ☐ **4.2** On `INITIAL_PURCHASE` + `RENEWAL`: grant `engine_config.basic_monthly_sparkle_bundle` (15) via `grant_basic_sparkles`, idempotent on `basic_bundle:<txnId>`. (Yearly: grant 15×12 upfront if yearly ships — mirror Pro's `PRO_YEARLY_SPARKLE_BUNDLE`.)
- ☐ **4.3** On `EXPIRATION`: set `basic_subscription=false`.
- ☐ **4.4** **Crossgrade handling (same group):** `PRODUCT_CHANGE` from basic→pro must set `pro_subscription=true` + clear/keep basic correctly, and pro→basic the reverse. Drive it off the entitlement in the event payload, not the product id, so the active entitlement is the source of truth. Ensure only ONE tier flag is true at a time (or Pro-wins if both).
- ☐ **4.5** Refund clawback: extend the existing `CANCELLATION` + `cancel_reason=CUSTOMER_SUPPORT` path to also revoke basic + claw back the basic bundle.
- ☐ **4.6** Deploy: `supabase functions deploy revenuecat-webhook --no-verify-jwt`.

---

## Phase 5 — Code: the three dream-eligibility gates (keep them in sync!)

> CLAUDE.md: "Pro-state is one rule across three runtimes." Basic adds a 4th eligibility input. **All three must agree.**

- ☐ **5.1** **SQL** — done in Phase 3 (`is_dream_eligible`). Point the nightly render path at it: `supabase/functions/nightly-dreams` + `dream-queue-worker` use `is_dream_eligible` instead of `is_pro_active` for the "should this user get a nightly dream" check. Deploy both.
- ☐ **5.2** **Nightly cron enqueue** — `scripts/nightly-dreams.js` enqueues one `dream_queue` job per eligible user. Change its gate (currently Pro/trial) to **basic OR pro OR trial** via `scripts/lib/nightlyEligibility.js`.
- ☐ **5.3** **`scripts/lib/nightlyEligibility.js`** — add `isBasicActive` + make the exported eligibility = pro OR trial OR basic.
- ☐ **5.4** **Client `lib/proStatus.ts`** — add `isBasicActive(user)` + `isDreamEligible(user)` (basic OR pro OR trial). Keep `isProActive` for Pro-only perks (the 75 bundle, 100 HD).
- ☐ **5.5** Grep for every call site that currently gates nightly/“can I get dreams” on `isProActive` and switch those (and ONLY those) to `isDreamEligible`. Pro-EXCLUSIVE perks (big sparkle bundle, 100 HD) stay on `isProActive`.

---

## Phase 6 — Code: HD download gate (per-tier cap)

> `supabase/functions/upscale-image` (`HQ_CAP_PER_MONTH`) + the client long-press save.

- ☐ **6.1** Make the monthly HD cap **tier-aware**: `pro → 100`, `basic → 15` (from `engine_config.basic_hd_downloads_per_month`), `free → 0` for others' content (own posts already free). Replace the single `HQ_CAP_PER_MONTH` const with a per-tier lookup.
- ☐ **6.2** Client: the long-press "Save HD to Photos" path (currently Pro-gated) must allow **basic** within its cap. Update `lib/proStatus.ts` HD check + the save UI's gate/upsell copy ("X HD saves left this month").
- ☐ **6.3** Deploy `upscale-image --no-verify-jwt`.

---

## Phase 7 — Code: constants, paywall & client UI

- ☐ **7.1** `constants/basicPlan.ts` (or extend `constants/proPlan.ts`) — source of truth: product IDs, package IDs, price strings, perks list, copy. Mirror `proPlan.ts`.
- ☐ **7.2** Subscription-status hook — generalize `useProStatus` → a tier-aware `useSubscriptionStatus` returning `{ tier: 'free'|'basic'|'pro', isDreamEligible, hdCap, ... }`. Read RevenueCat entitlements (`basic` / `pro`).
- ☐ **7.3** **Paywall / store screen** — a Free vs **Basic** vs Pro comparison. Extend `app/proStore.tsx` (or a new `basicStore`/unified `subscribe` screen). Show Basic perks + an "Upgrade to Pro" CTA from Basic.
- ☐ **7.4** Purchase flow: wire the Basic packages through the RevenueCat SDK `purchasePackage` (same path as Pro).
- ☐ **7.5** Settings → show current tier + manage subscription + upgrade path.
- ☐ **7.6** Upsell placements: after the 14-day free-nightly trial ends, surface "Keep your nightly dreams — DreamBot Basic $4.99/mo" (the core conversion moment). Also when a free user hits an HD-download wall.
- ☐ **7.7** PostHog: track `basic` paywall view / purchase / upgrade-to-pro, and tier in user props.

---

## Phase 8 — Tests (CI gates)

- ☐ **8.1** `__tests__/db/isProActive.dbspec.ts` → add `is_basic_active` + `is_dream_eligible` dbspec cases (paid/unexpired/expired/both-active→pro-wins).
- ☐ **8.2** `__tests__/lib/proStatus.test.ts` → basic + dream-eligible + HD-cap-per-tier cases.
- ☐ **8.3** `__tests__/lib/nightlyEligibility.test.ts` → basic user is nightly-eligible; expired basic is not.
- ☐ **8.4** `npm run check` green; push + `gh run watch` the `db-tests` job.

---

## Phase 9 — Sandbox QA (end-to-end, before launch)

- ☐ **9.1** ASC sandbox tester → buy **Basic monthly** → confirm webhook sets `basic_subscription=true` + grants 15 ✦ (check `users` row + a sparkle ledger entry).
- ☐ **9.2** Confirm the sandbox user becomes **nightly-eligible** (enqueued by `scripts/nightly-dreams.js` / appears in `dream_queue`).
- ☐ **9.3** HD download: basic user can save others' content up to 15/mo; 16th is blocked with upsell.
- ☐ **9.4** **Crossgrade:** Basic → Pro (and Pro → Basic) in sandbox → webhook flips tiers correctly, no double-grant, caps update.
- ☐ **9.5** Expiration: let a sandbox sub lapse → `basic_subscription=false` → nightly stops.
- ☐ **9.6** Refund clawback path.
- ☐ **9.7** Idempotency: replay a webhook event → no double sparkle grant.

---

## Phase 10 — Launch

- ☐ **10.1** Attach the Basic products to the next app build; submit subscriptions for review with the paywall screenshot (Phase 1.6).
- ☐ **10.2** Ship the client build with the paywall + gates.
- ☐ **10.3** Monitor: conversion (free→basic), basic→pro upgrades, churn, per-user COGS vs the 47–56% margin model.
- ☐ **10.4** Update `SPARKLE_PRICING_STRATEGY.md` + `PRO_SUBSCRIPTION_SETUP.md` to reflect the 3-tier ladder. Add a `DreamBot Basic` note to `CLAUDE.md` (the "one rule across three+ runtimes" now includes basic).

---

## Dependency order (the critical path)

```
Phase 0 (lock config)
  └─ Phase 1 (ASC products) ──┐
  └─ Phase 2 (RevenueCat) ────┤  (Kevin — can run in parallel with code)
                              │
Phase 3 (DB) ─ Phase 4 (webhook) ─ Phase 5 (gates) ─ Phase 6 (HD)
  └─ Phase 7 (constants/UI, needs product IDs from Phase 1/2)
       └─ Phase 8 (tests) ─ Phase 9 (sandbox QA, needs Phase 1/2 live) ─ Phase 10 (launch)
```

- **Kevin's Phases 1–2 and the code Phases 3–6 can proceed in parallel.** Phase 7 (paywall) needs the product/package IDs from Phases 1–2. Phase 9 (sandbox) needs both halves done.
- **Don't deploy the webhook (Phase 4) to prod before the DB columns exist (Phase 3)** — an INSERT/UPDATE on missing columns will fail (same ordering rule as the notifications Phase-4 migration).

## Definition of done
A free user, after their trial, can subscribe to DreamBot Basic for $4.99/mo and (a) start receiving nightly dreams again, (b) get 15 ✦ on purchase + each renewal, (c) HD-save up to 15 dreams/mo, (d) upgrade to Pro cleanly — all three eligibility runtimes agree, the webhook is idempotent, and CI is green.

## Phase 0 — LOCKED ✅ (2026-06-11)
- **Plans:** ship **BOTH** — monthly **$4.99/mo** + yearly **$39.99/yr** (save 33%).
- **Monthly sparkle bundle: 20 ✦/mo** (yearly = 20×12 = **240 ✦ upfront**). → `engine_config.basic_monthly_sparkle_bundle = 20`.
- **HD downloads: 20/mo** → `engine_config.basic_hd_downloads_per_month = 20`.
- **Intro trial: NONE** on Basic — the existing free 14-day nightly IS the funnel (no double-dip).
- **users columns:** **mirror Pro** (`basic_subscription` + `basic_subscription_expires_at`), not a tier-enum refactor.
- Name **"DreamBot Basic"**, entitlement **`basic`**, **same subscription group as Pro**, product ids `…basic.monthly` / `…basic.yearly`.

*(The "15" example values in Phases 3/4/6 above are superseded by 20/20.)*
