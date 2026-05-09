# Pro Subscription — Setup Status & Remaining Steps

> Companion to `SPARKLE_PAYMENTS_SETUP.md`. Sparkle packs are **consumables**;
> Pro is an **auto-renewing subscription** with a "pro" entitlement managed
> by RevenueCat. The two flows reuse the same RevenueCat config + webhook
> Edge Function but ship as separate offerings/products in App Store Connect.

---

## Pricing & Perks (locked)

| Tier   | Product ID                                | Price   | Period |
| ------ | ----------------------------------------- | ------- | ------ |
| Monthly | `com.konakevin.dreambot.pro.monthly`      | $9.99   | month  |
| Yearly  | `com.konakevin.dreambot.pro.yearly`       | $79.99  | year (Save 33%) |

**Perks** (source of truth: `constants/proPlan.ts`):

1. **Unlimited HQ downloads** — long-press save of any dream (yours, bots, other users) to Photos
2. **60 bonus sparkles per month** — granted automatically on each purchase + renewal
3. **30 nightly dreams per month** — increased from the free-tier cadence

Profit estimates (after Apple cut + AI costs): ~$2.96/mo Y1, ~$4.46/mo Y2+ for a typical user. See `SHOW_ME_THE_MONEY.md` for the full math.

---

## What's Already Built (shipped on `main`, commit `36bdca9`)

### Database

- **Migration `150_users_pro_subscription.sql`** — adds `users.pro_subscription` + `users.pro_subscription_expires_at`. Applied to production.
- **`types/database.ts`** regenerated from the schema; `pro_subscription` is in the type.

### Server / Edge Function

- **`supabase/functions/revenuecat-webhook/index.ts`** — handles both sparkle-pack consumables AND Pro subscription events. Pro flow:
  - **Grant events** (`INITIAL_PURCHASE`, `RENEWAL`, `PRODUCT_CHANGE`, `UNCANCELLATION`): set `pro_subscription = true`, write `pro_subscription_expires_at`, AND grant 60 bundled sparkles via `grant_sparkles` RPC (idempotent on `transactionId`, reason prefix `pro_bundle:`).
  - **Revoke events** (`CANCELLATION`, `EXPIRATION`): set `pro_subscription = false`, leave expiry timestamp in place.
  - **Info events** (`BILLING_ISSUE`): logged only, no state change (RevenueCat retries).
- **Deployed to production** — `supabase functions deploy revenuecat-webhook --no-verify-jwt`.

### App / Client

- **`constants/proPlan.ts`** — single source of truth: `PRO_TIERS`, `PRO_PERKS`, `PRO_SPARKLE_BUNDLE = 60`, `PRO_NIGHTLY_DREAMS_PER_MONTH = 30`, `PRO_ENTITLEMENT = 'pro'`, `PRO_OFFERING = 'pro'`.
- **`lib/revenuecat.ts`** — `getProPackages()`, `purchaseProPackage()`, `getCustomerInfo()`, `isProActive()`. Existing sparkle helpers untouched.
- **`hooks/useSparkles.ts`** — adds `useProPackages()` + `usePurchasePro()` (the latter calls `useAuthStore.refreshEntitlements()` on success).
- **`store/auth.ts`** — `isPro` field already in the store; new `refreshEntitlements()` action lets the post-purchase flow re-sync without waiting for the next session.
- **`app/proStore.tsx`** — Get Pro screen. Hero, perk list, monthly + yearly tier cards, fine print, restore-purchases button. Same look-and-feel as `sparkleStore.tsx`.
- **`lib/imageLongPress.ts`** — long-press Save-to-Photos gating: own post (or admin) → unrestricted; someone else's content → requires `isPro`. Free users see an upsell modal that routes to `/proStore`.

### Naming cleanup landed in the same commit

- **Pro Mode → Advanced Mode** rename across the Create-screen toggle and `/settings/advanced-mode`. The DB column `users.pro_mode_flux_model` keeps its name for back-compat. Advanced Mode is **free** (one sparkle per render, same as a normal dream); the Pro subscription is the separate paid tier and "Pro Mode unlocked" is no longer in `PRO_PERKS`.

---

## Remaining Setup Steps (none of this is in the repo — all external dashboards)

### 1. App Store Connect — create the auto-renewing subscription products

App Store Connect → your app → **In-App Purchases & Subscriptions** → **Subscriptions**.

1. Create a **Subscription Group** (e.g., "DreamBot Pro"). All Pro tiers belong to the same group so users can upgrade/downgrade between monthly and yearly.
2. Add two products in that group, with these **exact** product IDs:
   - `com.konakevin.dreambot.pro.monthly` — $9.99/month, auto-renewing
   - `com.konakevin.dreambot.pro.yearly` — $79.99/year, auto-renewing
3. Fill in localized display name + description for each (App Review requires this).
4. Add a **review screenshot** for each subscription (App Review requirement — usually a screenshot of the Get Pro screen with the price visible).
5. Submit for review **with the next app build** (subscription products go through review the first time they appear).

**Critical:** the product IDs above must match exactly — they're hard-coded in `constants/proPlan.ts` and used by RevenueCat to map products → entitlement.

### 2. RevenueCat dashboard — wire up the entitlement and offering

RevenueCat dashboard → your DreamBot project. (Already exists for sparkle packs.)

1. **Products** tab → Add the two App Store Connect product IDs from step 1.
2. **Entitlements** tab → Create entitlement named `pro` (must match `PRO_ENTITLEMENT` in `lib/revenuecat.ts`). Attach both Pro products to it.
3. **Offerings** tab → Create offering named `pro` (must match `PRO_OFFERING`). Inside the offering:
   - Add a `$rc_monthly` package referencing the monthly product
   - Add a `$rc_annual` package referencing the yearly product
   - These package identifiers are referenced by `findPackage(packages, tier.packageId)` in `app/proStore.tsx`.
4. Confirm the **iOS API key** in `lib/revenuecat.ts` is the production key (it already is — same key used for sparkles).
5. Confirm the **webhook URL** is set to the deployed `revenuecat-webhook` Edge Function (already configured for the sparkle flow).
6. Confirm the webhook **Authorization header secret** matches `REVENUECAT_WEBHOOK_SECRET` in Supabase Edge Function secrets (already configured).

### 3. (Optional but recommended) Sandbox test the full purchase flow

Before submitting to App Review:

1. Create a **Sandbox Apple ID** in App Store Connect → Users and Access → Sandbox.
2. On a real iOS device, sign out of the App Store, install the dev build, sign in to the sandbox account when prompted by the purchase sheet.
3. Tap a long-press on someone else's post (e.g., a bot post in the feed) as a non-Pro user → should see the "Pro Feature" upsell → tap "See Pro" → should land on `/proStore`.
4. Buy the monthly tier → expect:
   - StoreKit success sheet
   - Toast "You're Pro!" + success haptic
   - `users.pro_subscription = true` in the DB (check via SQL: `SELECT pro_subscription, pro_subscription_expires_at FROM users WHERE id = '<your_user_id>'`)
   - `sparkle_balance` increased by 60 (check via SQL: `SELECT sparkle_balance FROM users WHERE id = '<your_user_id>'`)
   - A row in `sparkle_transactions` with `reason` starting with `pro_bundle:`
5. Force a renewal in sandbox (sandbox subscriptions renew every few minutes for testing) → expect another 60 sparkles and a fresh `pro_bundle:` transaction with a different `transactionId`.
6. Cancel via Settings → Subscriptions on device → after expiry: `pro_subscription = false`, `isPro` flips to false on next `refreshEntitlements()` call (or app restart).

### 4. (Future, not on the critical path) Use 30 nightly dreams perk

The `PRO_NIGHTLY_DREAMS_PER_MONTH = 30` constant is referenced in the perk list copy but **not yet enforced** by the nightly engine. The free-tier cadence is currently the only one. When ready:

- Read `users.pro_subscription` in `supabase/functions/nightly-dreams/index.ts` when picking the nightly cohort.
- Pro users should be eligible every night (cap at ~30/month if needed); free users keep the existing throttle.
- Track per-user nightly count in a new `nightly_dreams_log` table or extend `ai_generation_budget`.

---

## Files Touched in the Pro Subscription Build

| File                                                  | Change                                                                                  |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `app/proStore.tsx`                                    | NEW — Get Pro screen                                                                    |
| `constants/proPlan.ts`                                | NEW — single source of truth for product IDs, perks, bundle amount, tier display       |
| `app/(tabs)/create.tsx`                               | Pro Mode → Advanced Mode rename in toggle + modal                                       |
| `app/settings/advanced-mode.tsx`                      | Renamed from `pro-mode.tsx`; copy updated; column name unchanged                        |
| `app/settings/index.tsx`                              | Section header + row label point to Advanced Mode + new route                           |
| `hooks/useSparkles.ts`                                | + `useProPackages()` + `usePurchasePro()`                                               |
| `lib/imageLongPress.ts`                               | Free-user upsell now routes to `/proStore`                                              |
| `lib/revenuecat.ts`                                   | + `getProPackages()`, `purchaseProPackage()`, `getCustomerInfo()`, `isProActive()`      |
| `store/auth.ts`                                       | + `refreshEntitlements()` action                                                        |
| `supabase/functions/revenuecat-webhook/index.ts`      | + Pro entitlement update + bundled sparkle grant (idempotent)                           |
| `supabase/migrations/150_users_pro_subscription.sql`  | (Already applied in production — earlier session)                                       |
| `types/database.ts`                                   | (Already regenerated — earlier session)                                                 |

---

## Acceptance Checklist (for Apple submission)

- [ ] Both Pro products live in App Store Connect with localized name/description and review screenshot
- [ ] RevenueCat `pro` entitlement + `pro` offering with `$rc_monthly` and `$rc_annual` packages
- [ ] Webhook URL + secret match between RevenueCat and Supabase Edge Function secrets
- [ ] Sandbox INITIAL_PURCHASE → DB: `pro_subscription=true`, `+60 sparkles`, `sparkle_transactions.reason LIKE 'pro_bundle:%'`
- [ ] Sandbox RENEWAL → DB: another `+60 sparkles`, fresh `pro_bundle:` transaction, idempotent if delivered twice
- [ ] Sandbox CANCELLATION + EXPIRATION → DB: `pro_subscription=false`
- [ ] Restore Purchases on a fresh install re-links the entitlement
- [ ] Long-press Save on a bot post: free user sees upsell, Pro user saves successfully, admin always saves
- [ ] App Privacy answers updated to reflect auto-renewing subscription billing
