-- ══════════════════════════════════════════════════════════════════════════════
-- 304 — bump the top sparkle pack from 500 → 550 sparkles (same $49.99 price).
--
-- The 500/$49.99 pack was $0.100/sparkle — IDENTICAL per-sparkle to the 200/$19.99
-- pack, so it offered no volume incentive (the per-sparkle stepladder went
-- 0.133 → 0.125 → 0.111 → 0.100 → 0.100, flat at the top). Bumping to 550 sparkles
-- at the same $49.99 restores a real ~9% volume discount: $0.091/sparkle.
--
-- Economics (worst-case cost $0.046/sparkle, the priciest default model):
--   cost 550 × $0.046 = $25.30 ; net @15% = $42.49 → 40% margin (≥61% at blended
--   ~$0.03/sparkle). Survives a future flip to 30% too: net $34.99 → 28% margin.
-- Both clear the 25% floor. Kevin is enrolled in Apple Small Business (15%).
--
-- DB-driven (migration 255): the store UI reads sparkle_packs via useSparklePacks
-- and revenuecat-webhook grants from the same row, so this takes effect with NO
-- app build. Keep constants/sparklePacks.ts (offline fallback) in sync.
--
-- ⚠️ App Store Connect: update the IAP DISPLAY NAME for com.konakevin.radorbad.
-- sparkles.500_v2 to "550 Sparkles" so Apple's purchase sheet matches the grant.
-- (Price stays $49.99; product identifier is permanent and unchanged.)
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE public.sparkle_packs
SET sparkles = 550
WHERE product_id = 'com.konakevin.radorbad.sparkles.500_v2';
