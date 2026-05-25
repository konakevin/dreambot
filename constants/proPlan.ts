/**
 * Pro plan definitions — single source of truth for the Pro subscription
 * product IDs, perk amounts, and pricing display strings.
 *
 * Product IDs must match EXACTLY what's in App Store Connect / Google Play
 * and what's attached to the "pro" entitlement in the RevenueCat dashboard.
 *
 * Used by: app/proStore (Get Pro screen UI), revenuecat-webhook (server-side
 * sparkle grant + entitlement update on purchase / renewal), settings copy.
 */

export interface ProPlanTier {
  productId: string;
  /** RevenueCat package identifier — typically '$rc_monthly' or '$rc_annual' */
  packageId: string;
  label: string;
  /** Display price (informational; actual price comes from StoreKit) */
  displayPrice: string;
  /** Renewal period for the human-readable summary */
  period: 'month' | 'year';
  /** Optional savings badge (e.g., "Save 33%") */
  savingsBadge?: string;
}

/** Bundled sparkles granted on each successful Pro INITIAL_PURCHASE + RENEWAL
 *  for the MONTHLY product. Server-side enforcement lives in
 *  revenuecat-webhook. 75 chosen to beat OpenArt Basic ($9.99 → 87 standard
 *  renders) on a comparable price while preserving healthy margin across
 *  the 1-2-3 sparkle tiers. */
export const PRO_SPARKLE_BUNDLE = 75;

/** Bundled sparkles granted on each successful Pro INITIAL_PURCHASE + RENEWAL
 *  for the YEARLY product. 12× the monthly bundle — paid in one lump sum
 *  so the user gets "a year's worth" immediately rather than a trickle.
 *  Refund risk: if a user spends all 900 and then refunds, we eat the
 *  marginal cost (~$54). Apple refund rate on IAP is ~2% historically,
 *  so expected loss is ~$1/yearly-subscriber — well within margin. */
export const PRO_YEARLY_SPARKLE_BUNDLE = PRO_SPARKLE_BUNDLE * 12;

/** Length of the free Pro-features trial granted to every new account.
 *  Mirrored in is_pro_active() Postgres function + store/auth.ts. */
export const PRO_TRIAL_DAYS = 14;

/** Nightly-dreams included in Pro. Used by the nightly-dreams Edge Function
 *  to gate the auto-render frequency for free vs pro users.
 *  Pro = 1 nightly dream per night (~30/month). Free = 2/week if active in
 *  the prior 3-day window. */
export const PRO_NIGHTLY_DREAMS_PER_MONTH = 30;

/** HD download monthly cap. Each unique post is upscaled once on demand (then
 *  cached + free forever), so this bounds a single user's first-downloader
 *  upscales per month — ~100 ≈ 3/day, plenty for real use, and caps worst-case
 *  cost at ~$2-3/user/mo at 2x HD. (Was 500/4K — far too expensive per maxed
 *  user.) Keep in sync with HQ_CAP_PER_MONTH in upscale-image. */
export const PRO_HQ_DOWNLOADS_PER_MONTH = 100;

/** Pro perk list — surface in the Get Pro screen + any "what is Pro?" copy.
 *  Ordered by what users care about most. */
export const PRO_PERKS = [
  {
    icon: 'download-outline',
    title: '100 HD downloads a month',
    sub: 'Save any dream — yours, bots, or other creators — to your photos in crisp HD.',
  },
  {
    icon: 'sparkles',
    title: `${PRO_SPARKLE_BUNDLE} bonus sparkles every month`,
    sub: 'Spend on any model — Flux 2, GPT Image 1, Nano Banana Pro, and more. Refills automatically with each renewal.',
  },
  {
    icon: 'moon',
    title: 'A new dream every night',
    sub: 'Personalized AI dreams generated for you while you sleep — every single night.',
  },
] as const;

// Product IDs use the radorbad bundle prefix because the app's actual
// CFBundleIdentifier is com.konakevin.radorbad (the legacy bundle name
// kept post-launch — see BUNDLE_ID_MIGRATION.md). Apple requires IAP
// product IDs to share the app's bundle prefix. Sparkles follow the
// same convention (com.konakevin.radorbad.sparkles.*).
export const PRO_TIERS: ProPlanTier[] = [
  {
    productId: 'com.konakevin.radorbad.pro.monthly',
    packageId: '$rc_monthly',
    label: 'Monthly',
    displayPrice: '$9.99',
    period: 'month',
  },
  {
    productId: 'com.konakevin.radorbad.pro.yearly',
    packageId: '$rc_annual',
    label: 'Yearly',
    displayPrice: '$79.99',
    period: 'year',
    savingsBadge: 'Save 33%',
  },
];
