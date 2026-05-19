// Supabase Edge Function: revenuecat-webhook
// Receives purchase + subscription events from RevenueCat. Routes by event
// type + product ID:
//   - Sparkle pack consumables → grant sparkles (NON_RENEWING_PURCHASE)
//   - Pro subscription → flip users.pro_subscription + expires_at
//     (INITIAL_PURCHASE / RENEWAL / PRODUCT_CHANGE / CANCELLATION /
//      UNCANCELLATION / EXPIRATION / BILLING_ISSUE)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Product ID → sparkle amount mapping
// SOURCE OF TRUTH: constants/sparklePacks.ts — keep in sync
const SPARKLE_PACKS: Record<string, number> = {
  // Locked 2026-05-18 per SPARKLE_PRICING_STRATEGY.md. All tiers
  // profitable at 15% Apple Small Business cut + $0.06/sparkle cost.
  // _v2 suffix because Apple reserves the original .25 / .50 / .100__ /
  // .500 product IDs from the earlier lineup — they can't be reused.
  // Keep in sync with constants/sparklePacks.ts.
  'com.konakevin.radorbad.sparkles.15_v2': 15,
  'com.konakevin.radorbad.sparkles.40_v2': 40,
  'com.konakevin.radorbad.sparkles.90_v2': 90,
  'com.konakevin.radorbad.sparkles.200_v2': 200,
  'com.konakevin.radorbad.sparkles.500_v2': 500,
};

// Pro subscription product IDs. Match these in App Store Connect /
// Google Play and attach to the "pro" entitlement in RevenueCat.
// Use radorbad prefix to match the app's actual bundle identifier
// (com.konakevin.radorbad). Sparkles use the same prefix above —
// Apple requires IAP product IDs to share the app's bundle prefix.
const PRO_MONTHLY_PRODUCT = 'com.konakevin.radorbad.pro.monthly';
const PRO_YEARLY_PRODUCT = 'com.konakevin.radorbad.pro.yearly';
const PRO_SUBSCRIPTION_PRODUCTS = new Set([PRO_MONTHLY_PRODUCT, PRO_YEARLY_PRODUCT]);

// Bundled sparkles granted with each Pro INITIAL_PURCHASE + RENEWAL.
// SOURCE OF TRUTH: constants/proPlan.ts:PRO_SPARKLE_BUNDLE (monthly) and
// PRO_YEARLY_SPARKLE_BUNDLE (yearly = 12× monthly). Keep in sync.
const PRO_MONTHLY_SPARKLE_BUNDLE = 75;
const PRO_YEARLY_SPARKLE_BUNDLE = PRO_MONTHLY_SPARKLE_BUNDLE * 12; // 900

/** Returns the right sparkle grant for a given Pro product ID. Yearly
 *  subscribers receive 12× the monthly bundle in one lump sum at each
 *  billing cycle. */
function proBundleSize(productId: string): number {
  return productId === PRO_YEARLY_PRODUCT ? PRO_YEARLY_SPARKLE_BUNDLE : PRO_MONTHLY_SPARKLE_BUNDLE;
}

// Subscription events that should trigger the bundled-sparkle grant.
// PRODUCT_CHANGE / UNCANCELLATION extend access but don't grant new sparkles —
// only first purchase + each renewal does.
const PRO_SPARKLE_GRANT_EVENTS = new Set(['INITIAL_PURCHASE', 'RENEWAL']);

// Sparkle-pack purchase events (one-time consumables)
const SPARKLE_PURCHASE_EVENTS = new Set(['NON_RENEWING_PURCHASE']);

// Subscription lifecycle events that grant or extend Pro access
const PRO_GRANT_EVENTS = new Set([
  'INITIAL_PURCHASE', // first subscribe
  'RENEWAL', // auto-renew charged successfully
  'PRODUCT_CHANGE', // upgrade/downgrade between monthly/yearly
  'UNCANCELLATION', // user changed mind before period ended
]);

// Subscription lifecycle events that revoke Pro access
const PRO_REVOKE_EVENTS = new Set([
  'EXPIRATION', // grace period ended; access removed
]);

// Subscription lifecycle events that are informational only (log + ack)
const PRO_INFO_EVENTS = new Set([
  'CANCELLATION', // user intent to cancel; access remains until EXPIRATION
  'BILLING_ISSUE', // card failed; Apple retries during grace
]);

Deno.serve(async (req) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Verify authorization header matches our webhook secret
  const authHeader = req.headers.get('authorization');
  const webhookSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');

  if (
    !webhookSecret ||
    (authHeader !== `Bearer ${webhookSecret}` && authHeader !== webhookSecret)
  ) {
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
    // for subscription events. Used to set users.pro_subscription_expires_at.
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
    // Determine whether this event is for sparkle packs or Pro subscription.
    const isSparklePack = SPARKLE_PACKS[productId] !== undefined;
    const isProSubscription = PRO_SUBSCRIPTION_PRODUCTS.has(productId);

    // ── APPLE REFUND CLAWBACK ──────────────────────────────────────────
    // When Apple Support refunds a purchase, RC sends CANCELLATION with
    // cancel_reason=CUSTOMER_SUPPORT. We need to revoke whatever sparkles
    // we granted at the original transactionId so users can't keep the
    // value after getting their money back. Apple handles the dollar-side
    // clawback automatically (deducted from your next payout); we just
    // need to handle the sparkle-side clawback.
    //
    // Idempotent: if the same refund event is delivered twice, we only
    // claw back once (checked via the `refund:pro_bundle:<txid>` or
    // `refund:purchase:<txid>` row in sparkle_transactions).
    if (eventType === 'CANCELLATION' && cancelReason === 'CUSTOMER_SUPPORT') {
      let originalReason: string | null = null;
      if (isProSubscription) {
        originalReason = `pro_bundle:${transactionId}`;
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
          // grant_sparkles accepts negative amounts — passing -75/-900 etc
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

        // For Pro refunds, also flip pro_subscription off immediately.
        // (Normal CANCELLATION leaves access until EXPIRATION; refunds
        // should be instant since the user got their money back.)
        if (isProSubscription) {
          await supabase.from('users').update({ pro_subscription: false }).eq('id', appUserId);
        }

        return new Response(
          JSON.stringify({
            refunded: true,
            sparkles_revoked: clawbackAmount,
            entitlement_revoked: isProSubscription,
          }),
          { status: 200 }
        );
      }
    }

    // ── SPARKLE PACK PURCHASE (consumable) ─────────────────────────────
    if (SPARKLE_PURCHASE_EVENTS.has(eventType) && isSparklePack) {
      const sparkleAmount = SPARKLE_PACKS[productId];

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
      return new Response(JSON.stringify({ granted: sparkleAmount }), { status: 200 });
    }

    // ── PRO SUBSCRIPTION EVENTS ────────────────────────────────────────
    if (isProSubscription) {
      // Grant or extend Pro access
      if (PRO_GRANT_EVENTS.has(eventType)) {
        const expiresAt = expirationAtMs ? new Date(expirationAtMs).toISOString() : null;
        const { error } = await supabase
          .from('users')
          .update({
            pro_subscription: true,
            pro_subscription_expires_at: expiresAt,
          })
          .eq('id', appUserId);
        if (error) {
          console.error(`[RevenueCat] Pro grant failed for ${appUserId}:`, error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        // Grant the bundled sparkles on INITIAL_PURCHASE + each RENEWAL.
        // Monthly subscribers get PRO_MONTHLY_SPARKLE_BUNDLE per billing
        // cycle. Yearly subscribers get PRO_YEARLY_SPARKLE_BUNDLE (12×)
        // in one lump sum per yearly billing cycle.
        // Idempotent on transactionId — if the same event is delivered
        // twice, the second grant is skipped.
        let sparklesGranted = 0;
        if (PRO_SPARKLE_GRANT_EVENTS.has(eventType)) {
          const reason = `pro_bundle:${transactionId}`;
          const bundleAmount = proBundleSize(productId);
          const { data: existing } = await supabase
            .from('sparkle_transactions')
            .select('id')
            .eq('reason', reason)
            .limit(1);
          if (existing && existing.length > 0) {
            console.log(`[RevenueCat] Duplicate Pro sparkle bundle, skipping: ${transactionId}`);
          } else {
            const { error: grantError } = await supabase.rpc('grant_sparkles', {
              p_user_id: appUserId,
              p_amount: bundleAmount,
              p_reason: reason,
            });
            if (grantError) {
              console.error(`[RevenueCat] Pro bundle grant failed for ${appUserId}:`, grantError);
              // Don't fail the whole webhook — entitlement already set,
              // sparkle grant retry can be handled separately.
            } else {
              sparklesGranted = bundleAmount;
              console.log(
                `[RevenueCat] Granted ${bundleAmount} bundled sparkles to ${appUserId} (${productId === PRO_YEARLY_PRODUCT ? 'yearly' : 'monthly'})`
              );
            }
          }
        }

        console.log(
          `[RevenueCat] Pro entitlement set for ${appUserId} (${eventType}, expires ${expiresAt}, sparkles ${sparklesGranted})`
        );
        return new Response(
          JSON.stringify({ pro: true, expires_at: expiresAt, sparkles_granted: sparklesGranted }),
          { status: 200 }
        );
      }

      // Revoke Pro access
      if (PRO_REVOKE_EVENTS.has(eventType)) {
        const { error } = await supabase
          .from('users')
          .update({ pro_subscription: false })
          .eq('id', appUserId);
        if (error) {
          console.error(`[RevenueCat] Pro revoke failed for ${appUserId}:`, error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        console.log(`[RevenueCat] Pro entitlement revoked for ${appUserId} (${eventType})`);
        return new Response(JSON.stringify({ pro: false }), { status: 200 });
      }

      // Informational only — access state unchanged. CANCELLATION = user
      // tapped cancel but keeps access until EXPIRATION fires.
      // BILLING_ISSUE = card failed; Apple is retrying within grace period.
      if (PRO_INFO_EVENTS.has(eventType)) {
        console.log(`[RevenueCat] Pro info event for ${appUserId}: ${eventType}`);
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
