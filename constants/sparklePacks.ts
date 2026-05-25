/**
 * Sparkle pack definitions — single source of truth for product IDs and amounts.
 * Used by: sparkleStore UI, revenuecat-webhook, and anywhere packs are referenced.
 *
 * Product IDs must match EXACTLY what's in App Store Connect + RevenueCat.
 *
 * Pricing locked 2026-05-18 per PRO_SUBSCRIPTION_SETUP.md + SPARKLE_PRICING_
 * STRATEGY.md analysis. Assumes 15% Apple Small Business cut. All tiers
 * profitable at $0.06/sparkle fully-loaded cost (Replicate + Sonnet/Haiku
 * + storage). Margins: 47% → 43% → 36% → 29% → 29% (slides toward floor
 * at the higher tiers to give power users a real volume incentive).
 *
 * Per-sparkle stepladder:
 *   Impulse  15 / $1.99  → $0.133/sparkle (highest, smallest pack)
 *   Starter  40 / $4.99  → $0.125
 *   Popular  90 / $9.99  → $0.111
 *   Value    200 / $19.99 → $0.100 (cleanly better than Popular per unit)
 *   Whale    500 / $49.99 → $0.100 (flat at floor — sells on volume)
 *
 * Popular at $9.99 deliberately collides with Pro subscription at $9.99.
 * Forces the user to compare Popular (75 sparkles one-time, no extras) vs
 * Pro (75 sparkles/mo + nightly + HD downloads + recurring) — Pro is clearly better.
 */

export interface SparklePack {
  productId: string;
  sparkles: number;
  label: string;
  icon: string;
}

// Product IDs use the `_v2` suffix because Apple permanently reserves
// the original .25 / .50 / .100__ / .500 identifiers from earlier
// lineups — even after deletion, those IDs can't be reused. New lineup
// gets a clean _v2 suffix so the entire set is consistent.
export const SPARKLE_PACKS: SparklePack[] = [
  {
    productId: 'com.konakevin.radorbad.sparkles.15_v2',
    sparkles: 15,
    label: 'Impulse',
    icon: 'sparkles-outline',
  },
  {
    productId: 'com.konakevin.radorbad.sparkles.40_v2',
    sparkles: 40,
    label: 'Starter',
    icon: 'star',
  },
  {
    productId: 'com.konakevin.radorbad.sparkles.90_v2',
    sparkles: 90,
    label: 'Popular',
    icon: 'sparkles',
  },
  {
    productId: 'com.konakevin.radorbad.sparkles.200_v2',
    sparkles: 200,
    label: 'Best Value',
    icon: 'diamond',
  },
  {
    productId: 'com.konakevin.radorbad.sparkles.500_v2',
    sparkles: 500,
    label: 'Whale',
    icon: 'rocket',
  },
];

/** Quick lookup: product ID → sparkle amount */
export const PRODUCT_TO_SPARKLES: Record<string, number> = Object.fromEntries(
  SPARKLE_PACKS.map((p) => [p.productId, p.sparkles])
);

/** Quick lookup: product ID → display info */
export const PACK_INFO: Record<string, { sparkles: number; icon: string; label: string }> =
  Object.fromEntries(
    SPARKLE_PACKS.map((p) => [p.productId, { sparkles: p.sparkles, icon: p.icon, label: p.label }])
  );
