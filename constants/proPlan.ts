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

/** Bundled sparkles granted on each successful Pro INITIAL_PURCHASE + RENEWAL.
 *  Server-side enforcement lives in revenuecat-webhook. 75 chosen to beat
 *  OpenArt Basic ($9.99 → 87 standard renders) on a comparable price while
 *  preserving healthy margin across the 1-2-3 sparkle tiers. */
export const PRO_SPARKLE_BUNDLE = 75;

/** Length of the free Pro-features trial granted to every new account.
 *  Mirrored in is_pro_active() Postgres function + store/auth.ts. */
export const PRO_TRIAL_DAYS = 14;

/** Nightly-dreams included in Pro. Used by the nightly-dreams Edge Function
 *  to gate the auto-render frequency for free vs pro users.
 *  Pro = 1 nightly dream per night (~30/month). Free = 2/week if active in
 *  the prior 3-day window. */
export const PRO_NIGHTLY_DREAMS_PER_MONTH = 30;

/** HQ download monthly cap — "unlimited" in marketing copy, capped server-
 *  side at this number to block bot/scraper abuse without affecting any
 *  real user (a 500/mo cap = ~17 unique posts/day every single day). */
export const PRO_HQ_DOWNLOADS_PER_MONTH = 500;

/** Pro perk list — surface in the Get Pro screen + any "what is Pro?" copy.
 *  Ordered by what users care about most. */
export const PRO_PERKS = [
  {
    icon: 'download-outline',
    title: 'Unlimited 4K downloads',
    sub: 'Save any dream — yours, bots, or other creators — to your photos in 4K.',
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
