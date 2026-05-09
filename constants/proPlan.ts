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
 *  Server-side enforcement lives in revenuecat-webhook. */
export const PRO_SPARKLE_BUNDLE = 60;

/** Nightly-dreams included in Pro. Used by the nightly-dreams Edge Function
 *  to gate the auto-render frequency for free vs pro users. */
export const PRO_NIGHTLY_DREAMS_PER_MONTH = 30;

/** Pro perk list — surface in the Get Pro screen + any "what is Pro?" copy.
 *  Ordered by what users care about most. */
export const PRO_PERKS = [
  {
    icon: 'download-outline',
    title: 'Unlimited HQ downloads',
    sub: 'Save any dream — yours, bots, or other creators — to your photos in full quality.',
  },
  {
    icon: 'sparkles',
    title: `${PRO_SPARKLE_BUNDLE} bonus sparkles every month`,
    sub: 'On top of any sparkles you already have. Refills automatically with each renewal.',
  },
  {
    icon: 'moon',
    title: `${PRO_NIGHTLY_DREAMS_PER_MONTH} nightly dreams per month`,
    sub: 'Personalized dreams generated for you nightly while you sleep.',
  },
] as const;

export const PRO_TIERS: ProPlanTier[] = [
  {
    productId: 'com.konakevin.dreambot.pro.monthly',
    packageId: '$rc_monthly',
    label: 'Monthly',
    displayPrice: '$9.99',
    period: 'month',
  },
  {
    productId: 'com.konakevin.dreambot.pro.yearly',
    packageId: '$rc_annual',
    label: 'Yearly',
    displayPrice: '$79.99',
    period: 'year',
    savingsBadge: 'Save 33%',
  },
];
