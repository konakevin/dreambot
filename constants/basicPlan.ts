/**
 * DreamBot Basic plan definitions — single source of truth for the Basic
 * subscription product IDs, perk amounts, and pricing display strings.
 *
 * Basic sits between Free and Pro ($4.99/mo, $39.99/yr): it turns on the
 * nightly dream engine (the core retention perk, shared with Pro) plus a light
 * sparkle top-up + a small HD-download allowance. The DIFFERENCE from Pro is
 * quantity — Pro gives ~4x the sparkles and 5x the HD cap.
 *
 * Product IDs must match EXACTLY App Store Connect + the "basic" entitlement in
 * RevenueCat. Package IDs match the packages inside the "subscriptions" offering.
 *
 * Used by: app/subscribe (the Free/Basic/Pro paywall), revenuecat-webhook
 * (server-side grant + entitlement flip — those read engine_config, this is the
 * client display copy), settings copy.
 *
 * The authoritative perk amounts live in engine_config
 * (basic_monthly_sparkle_bundle / basic_hd_downloads_per_month, migration 257);
 * the constants here are the display defaults + must be kept in sync.
 */

import type { ProPlanTier } from './proPlan';

/** Bundled sparkles granted on each Basic INITIAL_PURCHASE + RENEWAL (monthly).
 *  Server source of truth: engine_config.basic_monthly_sparkle_bundle (20). */
// DREAMER pivot (Kevin, 2026-09-04): the $4.99 tier is now DREAMS-ONLY —
// display name "DreamBot Dreamer" (product IDs unchanged: still *.basic.*).
// Sparkles + HD moved to Pro-exclusive: the tier's whole story is "a new dream
// every night", and it is profitable at ANY utilization in BOTH periods
// (monthly +$1.90 worst, yearly +$0.49 worst — see the 2026-09-03 tier P&L).
// Server mirrors: engine_config.basic_monthly_sparkle_bundle=0,
// basic_hd_downloads_per_month=0 (HD of one's OWN dreams stays free/uncapped
// by the upscale-image own-dream exemption).
export const BASIC_SPARKLE_BUNDLE = 0;

/** Yearly Basic grants 12x the monthly bundle up front (240). */
export const BASIC_YEARLY_SPARKLE_BUNDLE = BASIC_SPARKLE_BUNDLE * 12;

/** Monthly HD-download cap for Basic. Server source of truth:
 *  engine_config.basic_hd_downloads_per_month (20). Pro = 100. */
export const BASIC_HQ_DOWNLOADS_PER_MONTH = 0;

/** Nightly dreams — Basic gets the same every-night cadence as Pro (it's the
 *  core reason to subscribe). Gating lives in is_dream_eligible() / the cron. */
export const BASIC_NIGHTLY_DREAMS_PER_MONTH = 30;

/** Basic perk list — surfaced on the paywall. Ordered by what matters most. */
export const BASIC_PERKS = [
  {
    icon: 'moon',
    title: 'A new dream every night',
    sub: 'A personalized AI dream, starring you, generated while you sleep — every single night. That is the whole plan, and it is magic.',
  },
] as const;

// Product IDs use the radorbad bundle prefix (see proPlan.ts / BUNDLE_ID_MIGRATION.md).
// Package IDs are the custom packages added to the "subscriptions" offering
// alongside the Pro packages ($rc_monthly / $rc_annual).
export const BASIC_TIERS: ProPlanTier[] = [
  {
    productId: 'com.konakevin.radorbad.basic.monthly',
    packageId: 'basic_monthly',
    label: 'Monthly',
    displayPrice: '$4.99',
    period: 'month',
  },
  {
    productId: 'com.konakevin.radorbad.basic.yearly',
    packageId: 'basic_annual',
    label: 'Yearly',
    displayPrice: '$39.99',
    period: 'year',
    savingsBadge: 'Save 33%',
  },
];
