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
// ── Plan DISPLAY names (single source of truth — Kevin 2026-09-04) ──
// Display-only: product IDs / entitlement keys are unchanged. Change these two
// constants and every screen (paywall, gates, home empty-state, upsells)
// follows. basic tier = "Dreamer", pro tier = "Dreamer+".
export const PLAN_NAME_BASIC = 'Dreamer';
export const PLAN_NAME_PRO = 'Dreamer+';

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

/** Nightly dreams are a PRO feature. Pro users (paid OR within the 14-day
 *  trial) get one auto-rendered dream per night (~30/month). Free users
 *  (post-trial) get NONE — they generate manually with sparkles instead.
 *  Cohort gating lives in scripts/nightly-dreams.js (the cron entry). */
export const PRO_NIGHTLY_DREAMS_PER_MONTH = 30;

/** HD download monthly cap. Each unique post is upscaled once on demand (then
 *  cached + free forever), so this bounds a single user's first-downloader
 *  upscales per month — ~100 ≈ 3/day, plenty for real use, and caps worst-case
 *  cost at ~$2-3/user/mo at 2x HD. (Was 500/4K — far too expensive per maxed
 *  user.) Keep in sync with HQ_CAP_PER_MONTH in upscale-image. */
// 100→75 (2026-09-04 tier P&L): trims worst-case perk cost ~63¢/mo; almost no
// user approached 100. Server mirror: engine_config.pro_hd_downloads_per_month.
export const PRO_HQ_DOWNLOADS_PER_MONTH = 75;

/** Pro perk list — surface in the Get Pro screen + any "what is Pro?" copy.
 *  Order MATCHES BASIC_PERKS (nightly dream → sparkles → HD) so the two paywall
 *  cards line up perk-for-perk by position. */
export const PRO_PERKS = [
  {
    icon: 'moon',
    title: 'A new dream every night',
    sub: 'Personalized AI dreams generated for you while you sleep, every single night.',
  },
  {
    icon: 'sparkles',
    title: `${PRO_SPARKLE_BUNDLE} bonus sparkles every month`,
    // Yearly grants the whole year (12x) up front, so the paywall shows the
    // accurate yearly figure when the annual period is selected.
    // DRIP (2026-09-04): yearly subs now receive the bundle MONTHLY (75/mo) —
    // no more 900-up-front lump (refund/burn exposure). Copy matches.
    titleYearly: `${PRO_SPARKLE_BUNDLE} bonus sparkles every month`,
    sub: 'Spend on any model: Flux 2, GPT Image 1, Nano Banana Pro, and more. Refills automatically with each renewal.',
  },
  {
    icon: 'download-outline',
    title: `${PRO_HQ_DOWNLOADS_PER_MONTH} HD downloads a month`,
    note: '(cast photo dreams not supported)',
    sub: 'Save any dream (yours, bots, or other creators) to your photos in crisp HD.',
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
    // $79.99→$99.99 (2026-09-04 tier P&L — yearly was underwater at heavy use).
    // ASC price change is Kevin-side; StoreKit drives the live figure, this is
    // the offline fallback. Build ships only after ASC is switched.
    displayPrice: '$99.99',
    period: 'year',
    savingsBadge: 'Save 17%',
  },
];
