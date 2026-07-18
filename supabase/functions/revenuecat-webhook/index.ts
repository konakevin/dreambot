// Supabase Edge Function: revenuecat-webhook
// Receives purchase + subscription events from RevenueCat. Routes by event
// type + product ID:
//   - Sparkle pack consumables → grant sparkles (NON_RENEWING_PURCHASE)
//   - Subscription tiers (Pro / Basic) → flip users.<tier>_subscription +
//     expires_at + grant the tier's sparkle bundle
//     (INITIAL_PURCHASE / RENEWAL / PRODUCT_CHANGE / CANCELLATION /
//      UNCANCELLATION / EXPIRATION / BILLING_ISSUE)
//
// Pro and Basic share ONE App Store subscription group, so a user can hold at
// most one at a time. A PRODUCT_CHANGE between tiers (upgrade Basic→Pro or
// downgrade Pro→Basic) sets the new tier's flag AND clears the other tier's —
// see the SUBSCRIPTION_TIERS handling below.

import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
// Constant-time comparison for the webhook bearer secret. Was a byte-identical
// local copy (timingSafeEqualStr); de-duped to the shared helper 2026-07-10
// (Architect audit A7) so the two can't drift.
import { timingSafeEqual } from '../_shared/timingSafe.ts';
import { captureServer } from '../_shared/posthogCapture.ts';

// Product ID → sparkle amount FALLBACK. Source of truth is the sparkle_packs DB
// table (migration 255), loaded per-request below; this fallback only kicks in if
// that lookup fails/returns nothing, so a grant is never silently zero.
const FALLBACK_SPARKLE_PACKS: Record<string, number> = {
  'com.konakevin.radorbad.sparkles.15_v2': 15,
  'com.konakevin.radorbad.sparkles.40_v2': 40,
  'com.konakevin.radorbad.sparkles.90_v2': 90,
  'com.konakevin.radorbad.sparkles.200_v2': 200,
  'com.konakevin.radorbad.sparkles.500_v2': 500,
};

// Resolve a product's sparkle amount from the DB (sparkle_packs), falling back to
// the constant. Returns undefined for non-pack products (used as the is-pack test).
async function resolvePackSparkles(
  supabase: SupabaseClient,
  productId: string
): Promise<number | undefined> {
  const { data, error } = await supabase
    .from('sparkle_packs')
    .select('sparkles')
    .eq('product_id', productId)
    .eq('is_active', true)
    .maybeSingle();
  if (error) {
    console.warn('[RevenueCat] sparkle_packs lookup failed, using fallback:', error.message);
    return FALLBACK_SPARKLE_PACKS[productId];
  }
  return data ? Number(data.sparkles) : FALLBACK_SPARKLE_PACKS[productId];
}

// ── SUBSCRIPTION TIER PRODUCTS ───────────────────────────────────────────
// Match these in App Store Connect / Google Play and attach to the matching
// entitlement in RevenueCat ("pro" / "basic"). The radorbad prefix matches the
// app's bundle identifier (com.konakevin.radorbad) — Apple requires IAP product
// IDs to share the app's bundle prefix.
const PRO_MONTHLY_PRODUCT = 'com.konakevin.radorbad.pro.monthly';
const PRO_YEARLY_PRODUCT = 'com.konakevin.radorbad.pro.yearly';
const BASIC_MONTHLY_PRODUCT = 'com.konakevin.radorbad.basic.monthly';
const BASIC_YEARLY_PRODUCT = 'com.konakevin.radorbad.basic.yearly';

// Sparkle-bundle FALLBACKS. Source of truth is engine_config
// (pro_monthly_sparkle_bundle / basic_monthly_sparkle_bundle); yearly = 12×.
const FALLBACK_PRO_MONTHLY_SPARKLE_BUNDLE = 75;
const FALLBACK_BASIC_MONTHLY_SPARKLE_BUNDLE = 20;

async function resolveMonthlyBundle(
  supabase: SupabaseClient,
  column: string,
  fallback: number
): Promise<number> {
  const { data, error } = await supabase.from('engine_config').select(column).eq('id', 1).single();
  // Single dynamic column — read the one value without dynamic string-indexing
  // (which trips noImplicitAny now that supabase is typed, not `any`).
  const value = data ? Object.values(data)[0] : null;
  if (error || value == null) {
    return fallback;
  }
  return Number(value);
}

// Tier descriptors — Pro and Basic share identical subscription lifecycle
// logic, differing only in product set, DB columns, bundle config, and the
// sparkle-ledger reason prefix. Order doesn't matter; productId resolves the tier.
interface TierConfig {
  name: 'pro' | 'basic';
  monthlyProduct: string;
  yearlyProduct: string;
  products: Set<string>;
  flagColumn: 'pro_subscription' | 'basic_subscription';
  expiresColumn: 'pro_subscription_expires_at' | 'basic_subscription_expires_at';
  // will_renew is Pro-only for now (drives the "your Pro ends soon" reminders in
  // nightly-dreams.js, migration 215). Basic has no such column yet → null.
  willRenewColumn: 'pro_subscription_will_renew' | null;
  bundleReasonPrefix: 'pro_bundle' | 'basic_bundle';
  bundleColumn: 'pro_monthly_sparkle_bundle' | 'basic_monthly_sparkle_bundle';
  bundleFallback: number;
}

const SUBSCRIPTION_TIERS: TierConfig[] = [
  {
    name: 'pro',
    monthlyProduct: PRO_MONTHLY_PRODUCT,
    yearlyProduct: PRO_YEARLY_PRODUCT,
    products: new Set([PRO_MONTHLY_PRODUCT, PRO_YEARLY_PRODUCT]),
    flagColumn: 'pro_subscription',
    expiresColumn: 'pro_subscription_expires_at',
    willRenewColumn: 'pro_subscription_will_renew',
    bundleReasonPrefix: 'pro_bundle',
    bundleColumn: 'pro_monthly_sparkle_bundle',
    bundleFallback: FALLBACK_PRO_MONTHLY_SPARKLE_BUNDLE,
  },
  {
    name: 'basic',
    monthlyProduct: BASIC_MONTHLY_PRODUCT,
    yearlyProduct: BASIC_YEARLY_PRODUCT,
    products: new Set([BASIC_MONTHLY_PRODUCT, BASIC_YEARLY_PRODUCT]),
    flagColumn: 'basic_subscription',
    expiresColumn: 'basic_subscription_expires_at',
    willRenewColumn: null,
    bundleReasonPrefix: 'basic_bundle',
    bundleColumn: 'basic_monthly_sparkle_bundle',
    bundleFallback: FALLBACK_BASIC_MONTHLY_SPARKLE_BUNDLE,
  },
];

function resolveTier(productId: string): TierConfig | undefined {
  return SUBSCRIPTION_TIERS.find((t) => t.products.has(productId));
}

/** The sparkle grant for a subscription product. Yearly subscribers receive
 *  12× the monthly bundle in one lump sum at each billing cycle. */
function bundleSize(tier: TierConfig, productId: string, monthly: number): number {
  return productId === tier.yearlyProduct ? monthly * 12 : monthly;
}

// Subscription events that should trigger the bundled-sparkle grant.
// PRODUCT_CHANGE / UNCANCELLATION extend access but don't grant new sparkles —
// only first purchase + each renewal does.
const SUB_SPARKLE_GRANT_EVENTS = new Set(['INITIAL_PURCHASE', 'RENEWAL']);

// Sparkle-pack purchase events (one-time consumables)
const SPARKLE_PURCHASE_EVENTS = new Set(['NON_RENEWING_PURCHASE']);

// Subscription lifecycle events that grant or extend tier access
const SUB_GRANT_EVENTS = new Set([
  'INITIAL_PURCHASE', // first subscribe
  'RENEWAL', // auto-renew charged successfully
  'PRODUCT_CHANGE', // upgrade/downgrade (monthly↔yearly OR Basic↔Pro crossgrade)
  'UNCANCELLATION', // user changed mind before period ended
]);

// Subscription lifecycle events that revoke tier access
const SUB_REVOKE_EVENTS = new Set([
  'EXPIRATION', // grace period ended; access removed
]);

// Subscription lifecycle events that are informational only (log + ack)
const SUB_INFO_EVENTS = new Set([
  'CANCELLATION', // user intent to cancel; access remains until EXPIRATION
  'BILLING_ISSUE', // card failed; Apple retries during grace
]);

Deno.serve(async (req) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Verify authorization header matches our webhook secret (constant-time).
  const authHeader = req.headers.get('authorization') ?? '';
  const webhookSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  const providedToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!webhookSecret || !timingSafeEqual(providedToken, webhookSecret)) {
    console.error('[RevenueCat] Unauthorized request');
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const event = body.event;

    if (!event) {
      return new Response(JSON.stringify({ message: 'No event in payload' }), { status: 400 });
    }

    const eventType: string = event.type;
    const appUserId: string = event.app_user_id;
    const productId: string = event.product_id;
    const transactionId: string = event.transaction_id ?? event.id;
    const environment: string = event.environment ?? 'PRODUCTION';
    // RevenueCat puts the entitlement expiration timestamp in expiration_at_ms
    // for subscription events. Used to set users.<tier>_subscription_expires_at.
    const expirationAtMs: number | undefined = event.expiration_at_ms;
    // Cancel reason is set on CANCELLATION events. CUSTOMER_SUPPORT means
    // Apple processed a refund — we need to claw back any sparkles that
    // were granted at INITIAL_PURCHASE / RENEWAL for this transaction.
    const cancelReason: string | undefined = event.cancel_reason;

    console.log(
      `[RevenueCat] ${eventType} | user=${appUserId} | product=${productId} | env=${environment}`
    );

    // Skip anonymous RevenueCat IDs — we need a real Supabase user ID
    if (appUserId.startsWith('$RCAnonymousID:')) {
      console.error(`[RevenueCat] Anonymous user, ignoring: ${appUserId}`);
      return new Response(JSON.stringify({ error: 'Anonymous user ID' }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify the appUserId resolves to a real Supabase user. If it
    // doesn't, RevenueCat is pushing a transaction we can't link to an
    // account — likely a stale anonymous ID or a user that's been
    // deleted. Return 200 so RevenueCat doesn't retry forever, but log
    // it loudly so we notice.
    {
      const { data: userExists, error: userLookupError } = await supabase
        .from('users')
        .select('id')
        .eq('id', appUserId)
        .maybeSingle();
      if (userLookupError) {
        console.error(`[RevenueCat] User lookup failed for ${appUserId}:`, userLookupError);
        return new Response(JSON.stringify({ error: userLookupError.message }), { status: 500 });
      }
      if (!userExists) {
        console.error(`[RevenueCat] Unknown app_user_id, dropping event: ${appUserId}`);
        return new Response(JSON.stringify({ message: 'Unknown user, dropped' }), { status: 200 });
      }
    }

    // ── ROUTING ────────────────────────────────────────────────────────
    // Determine whether this event is for sparkle packs or a subscription tier.
    const packSparkles = await resolvePackSparkles(supabase, productId);
    const isSparklePack = packSparkles !== undefined;
    const tier = resolveTier(productId);
    const isSubscription = tier !== undefined;

    // ── APPLE REFUND CLAWBACK ──────────────────────────────────────────
    // When Apple Support refunds a purchase, RC sends CANCELLATION with
    // cancel_reason=CUSTOMER_SUPPORT. We need to revoke whatever sparkles
    // we granted at the original transactionId so users can't keep the
    // value after getting their money back. Apple handles the dollar-side
    // clawback automatically (deducted from your next payout); we just
    // need to handle the sparkle-side clawback.
    //
    // Idempotent: if the same refund event is delivered twice, we only
    // claw back once (checked via the `refund:<tier>_bundle:<txid>` or
    // `refund:purchase:<txid>` row in sparkle_transactions).
    if (eventType === 'CANCELLATION' && cancelReason === 'CUSTOMER_SUPPORT') {
      let originalReason: string | null = null;
      if (isSubscription) {
        originalReason = `${tier.bundleReasonPrefix}:${transactionId}`;
      } else if (isSparklePack) {
        originalReason = `purchase:${transactionId}`;
      }

      if (originalReason) {
        const refundReason = `refund:${originalReason}`;

        // Idempotency check — has this refund already been processed?
        const { data: alreadyRefunded } = await supabase
          .from('sparkle_transactions')
          .select('id')
          .eq('reason', refundReason)
          .limit(1);
        if (alreadyRefunded && alreadyRefunded.length > 0) {
          console.log(`[RevenueCat] Duplicate refund event, skipping: ${refundReason}`);
          return new Response(JSON.stringify({ message: 'Already refunded' }), { status: 200 });
        }

        // Find the original grant amount. If no grant row exists, it
        // means we never credited this transaction in the first place
        // (could happen if the webhook fix landed AFTER the purchase).
        // Skip with a warning rather than fail.
        const { data: grantRow } = await supabase
          .from('sparkle_transactions')
          .select('amount')
          .eq('user_id', appUserId)
          .eq('reason', originalReason)
          .maybeSingle();
        const clawbackAmount = grantRow?.amount ?? 0;

        if (clawbackAmount > 0) {
          // grant_sparkles accepts negative amounts — passing -75/-20 etc
          // subtracts from sparkle_balance and records a negative row in
          // sparkle_transactions for the audit trail. Users with positive
          // balance go down to (potentially) negative; spend_sparkles
          // already rejects spends when balance < amount so they can't
          // dig deeper into the hole.
          const { error: clawbackErr } = await supabase.rpc('grant_sparkles', {
            p_user_id: appUserId,
            p_amount: -clawbackAmount,
            p_reason: refundReason,
          });
          if (clawbackErr) {
            console.error(`[RevenueCat] Sparkle clawback failed:`, clawbackErr);
            // Don't fail the webhook — Apple's already refunded the user.
            // We'll have a stale credit but it's better than blocking RC's retries.
          } else {
            console.log(
              `[RevenueCat] Refund clawback: revoked ${clawbackAmount} sparkles from ${appUserId} (${refundReason})`
            );
          }
        } else {
          console.warn(
            `[RevenueCat] Refund event with no matching grant row for ${originalReason} — skipping clawback`
          );
        }

        // For subscription refunds, also flip the tier flag off immediately.
        // (Normal CANCELLATION leaves access until EXPIRATION; refunds
        // should be instant since the user got their money back.)
        if (isSubscription) {
          await supabase
            .from('users')
            .update({ [tier.flagColumn]: false })
            .eq('id', appUserId);
        }

        // Refund/clawback completed (Apple Support) — revenue accuracy + churn.
        await captureServer(
          appUserId,
          'purchase_refunded',
          {
            kind: isSubscription ? 'subscription' : 'sparkle_pack',
            sparkles_revoked: clawbackAmount,
          },
          { dedupKey: `refund:${transactionId}` }
        );
        return new Response(
          JSON.stringify({
            refunded: true,
            sparkles_revoked: clawbackAmount,
            entitlement_revoked: isSubscription ? tier.name : false,
          }),
          { status: 200 }
        );
      }
    }

    // ── SPARKLE PACK PURCHASE (consumable) ─────────────────────────────
    if (SPARKLE_PURCHASE_EVENTS.has(eventType) && isSparklePack) {
      const sparkleAmount = packSparkles ?? 0; // defined here (isSparklePack guard)

      // Idempotency: check if this transaction was already processed
      const { data: existing } = await supabase
        .from('sparkle_transactions')
        .select('id')
        .eq('reason', `purchase:${transactionId}`)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`[RevenueCat] Duplicate sparkle txn, skipping: ${transactionId}`);
        return new Response(JSON.stringify({ message: 'Already processed' }), { status: 200 });
      }

      const { error } = await supabase.rpc('grant_sparkles', {
        p_user_id: appUserId,
        p_amount: sparkleAmount,
        p_reason: `purchase:${transactionId}`,
      });

      if (error) {
        console.error(`[RevenueCat] grant_sparkles failed:`, error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }

      console.log(`[RevenueCat] Granted ${sparkleAmount} sparkles to ${appUserId}`);
      // AUTHORITATIVE sparkles_purchased — the pack grant landed (server-side, so
      // it fires even if the app was closed after the Apple sheet). Dedup on the
      // RC transaction id against at-least-once webhook redelivery.
      await captureServer(
        appUserId,
        'sparkles_purchased',
        { pack: productId, amount: sparkleAmount },
        { dedupKey: `sparkles_purchased:${transactionId}` }
      );
      return new Response(JSON.stringify({ granted: sparkleAmount }), { status: 200 });
    }

    // ── SUBSCRIPTION EVENTS (Pro / Basic) ──────────────────────────────
    if (isSubscription) {
      // Grant or extend tier access
      if (SUB_GRANT_EVENTS.has(eventType)) {
        // A subscription grant MUST carry an expiration. A missing
        // expiration_at_ms would set expires_at = null → permanent entitlement
        // with no time-based revalidation backstop (all three Pro readers treat
        // null expiry as active). RevenueCat always sends it for subscription
        // events, so a missing value is a malformed payload — reject rather than
        // mint indefinite access.
        if (!expirationAtMs) {
          console.error(
            `[RevenueCat] ${tier.name} ${eventType} for ${appUserId} missing expiration_at_ms — rejecting to avoid permanent entitlement`
          );
          return new Response(
            JSON.stringify({ error: 'missing expiration_at_ms on subscription grant' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        const expiresAt = new Date(expirationAtMs).toISOString();

        // INITIAL_PURCHASE / RENEWAL / PRODUCT_CHANGE / UNCANCELLATION all
        // mean the user has an active, auto-renewing subscription right now.
        // Set THIS tier active + reset its will_renew (Pro only, migration 215),
        // and CLEAR every other tier — Pro & Basic share one subscription
        // group, so holding this tier means any other is no longer active
        // (handles a Basic↔Pro crossgrade in a single update).
        // deno-lint-ignore no-explicit-any
        const updates: Record<string, any> = {
          [tier.flagColumn]: true,
          [tier.expiresColumn]: expiresAt,
        };
        if (tier.willRenewColumn) updates[tier.willRenewColumn] = true;
        for (const other of SUBSCRIPTION_TIERS) {
          if (other.name !== tier.name) updates[other.flagColumn] = false;
        }

        const { error } = await supabase.from('users').update(updates).eq('id', appUserId);
        if (error) {
          console.error(`[RevenueCat] ${tier.name} grant failed for ${appUserId}:`, error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        // Grant the bundled sparkles on INITIAL_PURCHASE + each RENEWAL.
        // Monthly subscribers get the configured monthly bundle per billing
        // cycle; yearly subscribers get 12× in one lump sum per yearly cycle
        // (engine_config.<tier>_monthly_sparkle_bundle).
        // Idempotent on transactionId — if the same event is delivered
        // twice, the second grant is skipped.
        let sparklesGranted = 0;
        if (SUB_SPARKLE_GRANT_EVENTS.has(eventType)) {
          const reason = `${tier.bundleReasonPrefix}:${transactionId}`;
          const monthly = await resolveMonthlyBundle(
            supabase,
            tier.bundleColumn,
            tier.bundleFallback
          );
          const bundleAmount = bundleSize(tier, productId, monthly);
          const { data: existing } = await supabase
            .from('sparkle_transactions')
            .select('id')
            .eq('reason', reason)
            .limit(1);
          if (existing && existing.length > 0) {
            console.log(
              `[RevenueCat] Duplicate ${tier.name} sparkle bundle, skipping: ${transactionId}`
            );
          } else {
            const { error: grantError } = await supabase.rpc('grant_sparkles', {
              p_user_id: appUserId,
              p_amount: bundleAmount,
              p_reason: reason,
            });
            if (grantError) {
              console.error(
                `[RevenueCat] ${tier.name} bundle grant failed for ${appUserId}:`,
                grantError
              );
              // Don't fail the whole webhook — entitlement already set,
              // sparkle grant retry can be handled separately.
            } else {
              sparklesGranted = bundleAmount;
              console.log(
                `[RevenueCat] Granted ${bundleAmount} bundled sparkles to ${appUserId} (${tier.name} ${productId === tier.yearlyProduct ? 'yearly' : 'monthly'})`
              );
            }
          }
        }

        console.log(
          `[RevenueCat] ${tier.name} entitlement set for ${appUserId} (${eventType}, expires ${expiresAt}, sparkles ${sparklesGranted})`
        );
        // AUTHORITATIVE subscription grant — the ONLY reliable purchase signal
        // (the client's pro_subscribe_tapped is intent, not completion; the Apple
        // sheet often outlives the app foreground). Distinct event per lifecycle
        // moment; tier + period as props so Pro/Basic + monthly/yearly are one funnel.
        await captureServer(
          appUserId,
          eventType === 'INITIAL_PURCHASE'
            ? 'subscription_started'
            : eventType === 'RENEWAL'
              ? 'subscription_renewed'
              : 'subscription_changed',
          {
            tier: tier.name,
            period: productId === tier.yearlyProduct ? 'yearly' : 'monthly',
            event: eventType,
            sparkles_granted: sparklesGranted,
          },
          { dedupKey: `sub_grant:${eventType}:${transactionId}` }
        );
        return new Response(
          JSON.stringify({
            tier: tier.name,
            active: true,
            expires_at: expiresAt,
            sparkles_granted: sparklesGranted,
          }),
          { status: 200 }
        );
      }

      // Revoke tier access
      if (SUB_REVOKE_EVENTS.has(eventType)) {
        const { error } = await supabase
          .from('users')
          .update({ [tier.flagColumn]: false })
          .eq('id', appUserId);
        if (error) {
          console.error(`[RevenueCat] ${tier.name} revoke failed for ${appUserId}:`, error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        console.log(
          `[RevenueCat] ${tier.name} entitlement revoked for ${appUserId} (${eventType})`
        );
        // Churn signal — access actually ended (EXPIRATION / grace-period end).
        await captureServer(
          appUserId,
          'subscription_expired',
          { tier: tier.name, event: eventType },
          { dedupKey: `sub_expired:${transactionId}` }
        );
        return new Response(JSON.stringify({ tier: tier.name, active: false }), { status: 200 });
      }

      // Informational only — access state unchanged. CANCELLATION = user
      // tapped cancel but keeps access until EXPIRATION fires.
      // BILLING_ISSUE = card failed; Apple is retrying within grace period.
      //
      // Migration 215: for Pro, CANCELLATION flips pro_subscription_will_renew
      // to false so nightly-dreams.js knows to send the "your Pro ends in 3
      // days" + "tonight is your last Pro nightly dream" reminders. The user
      // keeps access until expires_at. BILLING_ISSUE is NOT a cancellation
      // (Apple is retrying the charge) — don't flip the flag so we don't
      // false-alarm a recoverable card issue. Basic has no will_renew column
      // yet (willRenewColumn null) → just log.
      if (SUB_INFO_EVENTS.has(eventType)) {
        if (eventType === 'CANCELLATION' && tier.willRenewColumn) {
          const { error } = await supabase
            .from('users')
            .update({ [tier.willRenewColumn]: false })
            .eq('id', appUserId);
          if (error) {
            console.error(
              `[RevenueCat] ${tier.name} will_renew=false failed for ${appUserId}:`,
              error
            );
            // Don't fail the webhook — the cancel is acked at the source
            // of truth (RC); worst case we send one false-alarm reminder
            // next cron, which is recoverable.
          }
        }
        console.log(`[RevenueCat] ${tier.name} info event for ${appUserId}: ${eventType}`);
        // Cancel INTENT (access remains until EXPIRATION) — the leading churn
        // indicator. Only CANCELLATION, not BILLING_ISSUE (a recoverable retry).
        if (eventType === 'CANCELLATION') {
          await captureServer(
            appUserId,
            'subscription_cancelled',
            { tier: tier.name },
            { dedupKey: `sub_cancelled:${transactionId}` }
          );
        }
        return new Response(JSON.stringify({ message: `Logged ${eventType}` }), { status: 200 });
      }
    }

    // Unknown / unhandled — ack so RevenueCat doesn't retry forever.
    console.log(`[RevenueCat] Unhandled event: ${eventType} / product=${productId}`);
    return new Response(JSON.stringify({ message: `Ignored: ${eventType}` }), { status: 200 });
  } catch (err) {
    console.error('[RevenueCat] Error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
