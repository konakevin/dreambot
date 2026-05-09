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
  'com.konakevin.radorbad.sparkles.25': 25,
  'com.konakevin.radorbad.sparkles.50': 50,
  'com.konakevin.radorbad.sparkles.100__': 100,
  'com.konakevin.radorbad.sparkles.500': 500,
};

// Pro subscription product IDs. Match these in App Store Connect /
// Google Play and attach to the "pro" entitlement in RevenueCat.
const PRO_SUBSCRIPTION_PRODUCTS = new Set([
  'com.konakevin.dreambot.pro.monthly',
  'com.konakevin.dreambot.pro.yearly',
]);

// Bundled sparkles granted with each Pro INITIAL_PURCHASE + RENEWAL.
// SOURCE OF TRUTH: constants/proPlan.ts:PRO_SPARKLE_BUNDLE — keep in sync.
const PRO_SPARKLE_BUNDLE = 60;

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

    // ── ROUTING ────────────────────────────────────────────────────────
    // Determine whether this event is for sparkle packs or Pro subscription.
    const isSparklePack = SPARKLE_PACKS[productId] !== undefined;
    const isProSubscription = PRO_SUBSCRIPTION_PRODUCTS.has(productId);

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
        // Idempotent on transactionId — if the same renewal event is
        // delivered twice, the second grant is skipped.
        let sparklesGranted = 0;
        if (PRO_SPARKLE_GRANT_EVENTS.has(eventType)) {
          const reason = `pro_bundle:${transactionId}`;
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
              p_amount: PRO_SPARKLE_BUNDLE,
              p_reason: reason,
            });
            if (grantError) {
              console.error(`[RevenueCat] Pro bundle grant failed for ${appUserId}:`, grantError);
              // Don't fail the whole webhook — entitlement already set,
              // sparkle grant retry can be handled separately.
            } else {
              sparklesGranted = PRO_SPARKLE_BUNDLE;
              console.log(
                `[RevenueCat] Granted ${PRO_SPARKLE_BUNDLE} bundled sparkles to ${appUserId}`
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
