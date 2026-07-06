# Gift Sparkles — implementation plan (2026-07-06)

Users can gift sparkles to other users. Phase 1 = transfer from your own purchased balance
(the feature users asked for). Phase 2 = buy a pack *as* a gift (new-money gifting) + the
content-moment entry point. Status: PLANNED, not built.

## 0. Decisions already made (rationale in session notes 2026-07-06)

- **Model A first (balance transfer), with provenance guardrails.** Model B (gift-a-pack
  IAP) is Phase 2, additive.
- **Only purchased sparkles are giftable.** Free grants (welcome bonus, refunds, promos)
  and received gifts are spendable but non-transferable. This kills new-account farming
  outright: a farm of free accounts has zero giftable sparkles by construction.
- **No cash-out, ever.** Sparkles only spend on renders. Keeps us squarely inside App
  Review guideline 3.1.1 ("Apps may enable gifting of items that are eligible for in-app
  purchase... may only be refunded to the original purchaser and may not be exchanged").
  No special Apple approval needed, just normal review.

## 1. Economy + abuse model

Ledger = `sparkle_transactions (id, user_id, amount, reason, reference_id, created_at,
balance_after)`. Purchases land as `reason = 'purchase:<storeTransactionId>'`. New reasons:

| reason | amount | who |
|---|---|---|
| `gift_sent` | negative | sender row |
| `gift_received` | positive | recipient row |
| `purchase_refund:<tid>` | negative | clawback on RevenueCat REFUND webhook |

**Giftable balance** (computed in the RPC, no schema change):

```
lifetime_purchased  = SUM(amount) WHERE reason LIKE 'purchase:%' AND amount > 0
lifetime_gifted_out = SUM(-amount) WHERE reason = 'gift_sent'
lifetime_clawed     = SUM(-amount) WHERE reason LIKE 'purchase_refund:%'
giftable = GREATEST(0, LEAST(current_balance,
                             lifetime_purchased - lifetime_gifted_out - lifetime_clawed))
```

Attack walkthrough:
- N free accounts × welcome bonus → `lifetime_purchased = 0` → giftable 0. Dead.
- Mule chains (gift → re-gift) → received gifts aren't `purchase:%` → giftable 0 at every
  hop after the first. Dead.
- Buy → gift → Apple refund → webhook clawback drives sender balance negative; negative
  balance blocks gifting AND rendering until topped up. Bounded by daily caps meanwhile.
- Stolen card / bulk purchase abuse → daily send cap (engine_config) bounds blast radius.

## 2. Phase 1 — balance transfer

### 2.1 Server (one migration + one webhook edit)

**Migration `NNN_gift_sparkles.sql`:**
- `gift_sparkles(p_sender uuid, p_recipient uuid, p_amount int, p_message text,
  p_reference_id uuid) RETURNS text` — SECURITY DEFINER, auth.uid() must equal p_sender.
  Atomic (row-lock sender balance): validates recipient exists, is not a bot, is not the
  sender, no block either direction (`block_exists`), `p_amount BETWEEN 1 AND
  engine_config.gift_max_per_send`, daily-cap check (`SUM(gift_sent) today <
  gift_max_per_day`), giftable-balance check (formula above), then writes both ledger rows
  (idempotent on p_reference_id, same discipline as charge_sparkles) and updates both
  balances. Returns 'ok' | 'insufficient_giftable' | 'daily_cap' | 'blocked' |
  'invalid_recipient' so the client can message precisely.
- `get_giftable_balance(p_user uuid) RETURNS TABLE(balance int, giftable int)` — powers
  the sheet header.
- Notification insert inside the RPC: `type='sparkle_gift', subtype='received',
  recipient_id, actor_id=sender, body=message-or-default` → push rides the existing
  notifications INSERT trigger.
- `engine_config` additions: `gifting_enabled bool` (kill switch), `gift_max_per_send`
  (default 100), `gift_max_per_day` (default 200), `gift_message_max_len` (default 100).
- Message text: run through the migration-279 sanitize trigger path (stored on the
  notification row only; no new table needed — reference_id links the ledger rows).

**`revenuecat-webhook`:** handle `REFUND` events for sparkle packs → `purchase_refund:<tid>`
negative ledger row (idempotent on the store transaction id). Today we only handle grants
+ sub state; this is the clawback half.

**send-push:** copy for `sparkle_gift` ("🎁 kevin gifted you 20 sparkles").
**computeNotificationRoute:** `sparkle_gift` → open the unwrap sheet (deep param), fallback
inbox.

### 2.2 Client

New pieces (all NativeWind-era styling, scale helpers, no hardcoded sizes):

1. **`components/GiftSparklesSheet.tsx`** — the core sheet (Modal, matches
   RestyleModelPicker/sheet conventions):
   - recipient header (avatar + username)
   - "X of your Y sparkles are giftable" (`get_giftable_balance`) + rule one-liner
   - amount chips 5 / 10 / 25 + custom stepper (clamped to giftable + per-send cap)
   - optional message field (maxLength from engine_config)
   - CTA "Send N ✨" → `gift_sparkles` RPC → success haptic + "Sent ✨" toast →
     invalidate `sparkleBalance`
   - **giftable = 0 state**: upsell body ("Grab a pack and share the magic") + CTA →
     `/sparkleStore?giftFor=<userId>` so the store can bounce back into the sheet after
     purchase (recipient remembered via param, not global state)
   - error states mapped from RPC statuses (friendly copy, no em dashes)
2. **Profile entry point** — `app/user/[userId].tsx`: "Gift sparkles" row in the existing
   ••• sheet (low chrome; a header icon can come later if discovery is weak). Hidden for
   bots/self/blocked, and behind `gifting_enabled`.
3. **Store section** — `app/sparkleStore.tsx`: "Gift to a friend" card under the pack grid
   ("Sparkles make someone's day ✨"), engine_config-gated "NEW" pill. Tap → friend picker
   (following list + username search; reuse SearchRow visuals) → GiftSparklesSheet.
   Honors `?giftFor=` return-path from the sheet's upsell.
4. **Unwrap moment** — `components/GiftUnwrapSheet.tsx`: celebratory sheet on notification
   tap (confetti treatment cribbed from welcome-gift), gifter avatar, amount, message,
   balance tick-up, **"Say thanks"** button → inserts a `sparkle_gift/thanks` notification
   back to the gifter (no push-storm: thanks sends at most once per gift reference_id).
5. **Inbox** — subject copy for both subtypes in `get_inbox`/app/inbox.tsx mapping.

### 2.3 Analytics + monitoring

- PostHog: `gift_sheet_opened` (source: profile|store|upsell), `gift_sent` (amount),
  `gift_upsell_store_opened`, `gift_thanks_sent`. Funnel: sheet → (upsell → purchase) → sent.
- Reconciliation: gifts are zero-sum ledger pairs sharing reference_id — add a check to the
  existing economy sanity queries (SUM(gift_sent) + SUM(gift_received) = 0).

### 2.4 QA checklist

- Send happy path (balance moves both sides, notification + push, unwrap, thanks)
- giftable math: fresh account (0), purchased+spent mix, received-gift-only account (0)
- caps: per-send, per-day, insufficient, self/bot/blocked targets
- idempotency: double-tap send (same reference_id) charges once
- refund clawback: sandbox refund → negative balance → gifting + rendering blocked
- kill switch: `gifting_enabled=false` hides all entry points (client) AND hard-blocks RPC

## 3. Phase 2 — additive follow-ups

### 3.1 Gift a pack (new-money gifting, Discord model)

"For a friend" toggle on the Sparkle Store purchase flow → friend picker → normal IAP
purchase, but sparkles land in the recipient's balance.

- Purchase stays on the BUYER's Apple account (guideline-clean); attribution is ours:
  before purchase, stash `{giftRef, recipientId}` in a `pending_gift_purchases` row keyed
  by an idempotent client ref; pass the ref through RevenueCat purchase metadata
  (attributes) so `revenuecat-webhook` grants to the RECIPIENT (`gift_pack_received`) and
  writes the sender a zero-amount `gift_pack_sent` receipt row. Fallback: if metadata is
  missing at webhook time, grant to buyer (never lose paid sparkles).
- Refund: clawback from the RECIPIENT (they got the sparkles); same negative-balance rules.
- These arrive as received gifts → not re-giftable (consistent provenance).
- Unwrap/notification/thanks: identical surfaces, different copy ("kevin bought you the
  100 pack 🎁").
- Store copy: pack cards gain "or send as a gift" affordance only while toggle is on.

### 3.2 Content-moment entry point

- "Gift sparkles to @user" row in the post long-press sheet (`buildPostActionRows`) and on
  the fullscreen card's ••• — the TikTok "reward this dream" impulse. Same sheet,
  source='post' analytics. Gate behind Phase 1 metrics (ship only if gifting shows legs).

### 3.3 Deliberately NOT planned

- Cash-out / creator payouts (regulatory + guideline cliff)
- Gift leaderboards or public gift counts (whale-pressure dynamics we don't want)
- Real-money tipping outside IAP (different 3.1.1 clause, 100% pass-through requirement)

## 4. Build order + estimate

1. Migration + webhook clawback + send-push/route copy (~half day) → Kevin applies →
   types regen
2. GiftSparklesSheet + profile entry + store section + friend picker (~1 day)
3. Unwrap sheet + thanks + inbox copy (~half day)
4. QA pass + analytics (~half day)

**Phase 1 total: ~2.5 days.** Phase 2 gift-a-pack: ~1.5 days (mostly webhook attribution
care + sandbox testing). No App Store review dependency beyond shipping the client build;
server half is deployable immediately behind `gifting_enabled=false`.

## 5. Decisions (Kevin, 2026-07-06)

1. **Profile entry: ••• sheet row only.** No visible gift icon in v1.
2. **Caps: 200/day** (gift_max_per_day), 100 max per single send (gift_max_per_send)
   under it. Both live-tunable in engine_config.
3. **Totally private.** No public surface for gifts anywhere; the message is visible only
   in the recipient's unwrap sheet.
4. Launch beat: staged rollout via the new announcements system (ANNOUNCEMENTS_PLAN.md):
   ship quiet for a few days as a soft canary, then activate the 'gift-sparkles-launch'
   announcement row (in-app sheet + optional push companion) + DreamBot bot feed post +
   store "NEW" pill once real gifts look clean in the ledger. Announcement system should
   land in the same client build as (or before) gifting Phase 1.
