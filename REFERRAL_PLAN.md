# Refer a Friend — Implementation Plan

Status: **spec'd, not built** (2026-07-24). This doc captures the full research + design so any
agent can implement it end to end. Nothing here is coded yet.

Decisions already locked by Kevin:
- **Two-sided reward**: the referrer AND the new friend both get sparkles.
- **Amounts**: start **symmetric 25 / 25** (referrer 25, friend 25), both `engine_config`-tunable.
- **Payout milestone**: when the friend **completes onboarding** (`users.has_ai_recipe` flips true),
  i.e. a verified, engaged human. NOT bare account creation.
- **No attribution SDK** (no Branch/AppsFlyer/Adjust). The app deliberately keeps App Privacy
  "Tracking = No" (`app.config.js` disables FB auto-log + advertiser-id collection). Attribution is
  done with a stable referral code + a clipboard bridge, no tracking.

---

## 1. Goal

A referrer shares an invite. When the friend installs the app and **completes onboarding**, the
referrer is credited **25 sparkles** and the friend gets **25 sparkles** on top of their normal
welcome bonus. Fraud-proof, idempotent, server-authoritative. A polished, on-brand experience end
to end.

---

## 2. The 5-star experience (UX)

### 2a. Referrer flow
1. **Entry point**: a "Invite friends, earn sparkles" row in Settings (STORE section, next to the
   Sparkle Shop), gift icon. Optional secondary entry on the profile header action row.
2. **The Referrals screen** (`app/referrals.tsx`, a new top-level screen sibling of
   `app/sparkleStore.tsx` / `app/welcome-gift.tsx` / `app/subscribe.tsx`):
   - Warm hero: "Give your friends dreams. Get 25 sparkles each." Mascot + `SparkleField` flourish.
   - Your invite card: the referral code (or link) on a big tappable card + a prominent **Share**
     button (native `Share.share` with a friendly pre-filled message + link).
   - Status strip: "N friends dreaming, N x 25 = M sparkles earned" + a small list of who joined
     (username + when + +25). This running tally is the reward loop.
   - A quiet "how it works" (1. Share your link  2. They make their first dream  3. You both get 25).
3. **Reward moment**: when a friend completes onboarding, the referrer gets a push + inbox row +
   in-app celebration ("@alex joined with your invite, +25 sparkles"). Fork `app/welcome-gift.tsx`
   and reuse `components/SparkleField.tsx` + the `sparkle_gift`-style notification for a native-feeling
   delight moment with minimal new UI.

### 2b. Friend (referred) flow
1. Taps the invite link, lands on a warm web page (`/invite/<code>` on dreambot-web): "@kevin invited
   you to DreamBot", a short what-is-this, and "Get the app free" (App Store).
2. Installs, opens, onboarding shows a passive **"✨ Invited by @kevin"** acknowledgment (social
   proof, confirms attribution) when the code was auto-detected; otherwise a low-friction
   "Invited by a friend?" step.
3. Completes onboarding, gets welcome bonus + the referral friend bonus (25); the referrer is paid.

### 2c. Copy notes
- No em dashes anywhere in user-facing copy (house rule). Use commas / colons / periods / parens.
- Keep it warm and generous ("Give 25, get 25"), never extractive.

---

## 3. Attribution (the hard part) — phased, no SDK

iOS gives the app nothing about who referred a NEW install (no Android-style Install Referrer, and
we will not add a tracking SDK). Two phases:

### Phase 1 (MVP): manual code / @username entry — reliable, ships without any web changes
- The invite carries a stable `users.referral_code`; the friend can also just enter the referrer's
  **@username** (memorable, verbally shareable).
- A new onboarding step ("Invited by a friend?") accepts a code OR @username and calls
  `claim_referral(p_code)` (below). Reliable; the only cost is the friend types/pastes something.

### Phase 2 (near-seamless): clipboard bridge + web landing
- New `dreambot-web/app/invite/[code]/route.ts` landing page (clone of `app/post/[id]/route.ts`,
  plain-HTML Route Handler, reuse `APP_STORE_URL = https://apps.apple.com/app/id6761505205`). On
  "Get the app" it copies the code to the clipboard.
- The app reads the clipboard **once on first launch** (net-new: `Clipboard.getStringAsync` from
  `expo-clipboard`, already installed) guarded by an **install-level AsyncStorage flag** (mirror the
  `welcome_bonus_reconciled_user` guard in `lib/welcomeBonus.ts`; note `isFirstJsLoad` in
  `modules/dreambot-widget` is per-process, NOT per-install, so it cannot be the guard). If a code is
  found and looks valid, prefill the onboarding step and show the passive "Invited by @X" ack.
- iOS shows a paste banner on read (acceptable). ~80-90% capture; manual entry stays the fallback.
- Optional: universal-link `/invite/*` (only helps when the app is ALREADY installed, not the
  new-install path) — requires adding `/invite/*` to the AASA
  (`dreambot-web/app/.well-known/apple-app-site-association/route.ts`, which today lists
  `/post/* /photo/* /user/* /reset-password`) AND a matcher branch in `app/_layout.tsx`'s `handleUrl`
  (today it only matches `post|photo|user|reset-password` and silently drops anything else, including
  `?ref=`).

### Why no SDK
`package.json` has no Branch/AppsFlyer/Adjust/Firebase Dynamic Links. RevenueCat is subscriptions
only (`lib/revenuecat.ts` sets `appUserID` only, no attribution). FB auto-log + advertiser-id
collection are disabled in `app.config.js` to keep "Tracking = No". A paid SDK would reverse that
privacy posture. The clipboard + manual approach needs no IDFA and no tracking.

---

## 4. Data model

All mirrors existing patterns. New migration (next free prefix; highest today is 397, so this is
**398+**). `users` uses column-level GRANTs (mig 278/280) — economy columns are read via
`get_my_account`, so referral status is exposed via a dedicated RPC, not a direct column read.

```sql
-- 4a. Referral columns on users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by  uuid REFERENCES public.users(id);

-- Backfill codes for existing users (short, unique; retry on collision). New users get a code
-- generated inside handle_new_user() (see 5d).

-- 4b. Tunable amounts + cap (mirror welcome_sparkle_bonus, migration 247_engine_config_phase0.sql:16)
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS referral_reward_sparkles integer NOT NULL DEFAULT 25,  -- referrer
  ADD COLUMN IF NOT EXISTS referral_friend_bonus    integer NOT NULL DEFAULT 25,  -- new friend
  ADD COLUMN IF NOT EXISTS referral_max_per_day     integer NOT NULL DEFAULT 20;  -- per-referrer cap
-- Then add all three to get_engine_config()'s jsonb_build_object (latest def:
-- migration 335_engine_config_gifting_fields.sql:5-28) AND to hooks/useEngineConfig.ts.

-- 4c. Extend the grant idempotency backstop index to cover referral grants.
-- Current: ux_sparkle_tx_grant_reason partial UNIQUE(user_id, reason) covering
-- purchase:% / pro_bundle:% / basic_bundle:% / welcome_bonus (migration 258:89-94).
DROP INDEX IF EXISTS ux_sparkle_tx_grant_reason;
CREATE UNIQUE INDEX ux_sparkle_tx_grant_reason
  ON public.sparkle_transactions (user_id, reason)
  WHERE reason LIKE 'purchase:%' OR reason LIKE 'pro_bundle:%'
     OR reason LIKE 'basic_bundle:%' OR reason = 'welcome_bonus'
     OR reason LIKE 'referral:%';
```

Ledger reason convention (so both grants are idempotent under one index):
- Referrer grant: `referral:<referred_user_id>` on the referrer's row.
- Friend grant:   `referral:friend:<referred_user_id>` on the friend's row (still matches `referral:%`).
Both are unique per `(user_id, reason)`, so neither can ever be double-paid, even if the trigger
fires twice (idempotency is enforced inside `grant_sparkles`, see 5a).

No separate `referrals` table is required for MVP: `users.referred_by` + the ledger fully describe
state (referred = `referred_by` set; rewarded = a `referral:<id>` ledger row exists). A `referrals`
table (referrer_id, referred_id, status, created_at, qualified_at) is an optional Phase 2 nicety for
richer status (pending vs qualified) and auditability.

---

## 5. Server-side payout (idempotent, un-farmable)

### 5a. The grant primitive (existing, do NOT change)
`grant_sparkles(p_user_id uuid, p_amount integer, p_reason text)` — latest def
`migration 258_grant_sparkles_idempotent.sql:27-79`. `SECURITY DEFINER`. Idempotent on
`(user_id, reason)` via a per-user `SELECT ... FOR UPDATE` lock + "already granted this reason?"
early-return. The client can only grant itself `welcome_bonus`; a referral grant to a DIFFERENT user
(the referrer) MUST run under service-role or inside a `SECURITY DEFINER` function. Ledger:
`sparkle_transactions` (058:7-16, +balance_after 185:18).

### 5b. The payout: a SECURITY DEFINER trigger on the completion signal
Cleanest hook: a definer trigger on `users` when `has_ai_recipe` flips false -> true (the canonical
"onboarding done" flag set by `lib/saveVibeProfile.ts`). It runs server-side, so the client can
never trigger or fake it.

```sql
CREATE OR REPLACE FUNCTION public.reward_referral_on_activation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_ref uuid := NEW.referred_by;
  v_cfg record;
  v_today int;
BEGIN
  -- Only the false -> true transition (onboarding just completed).
  IF NEW.has_ai_recipe IS NOT TRUE OR OLD.has_ai_recipe IS TRUE THEN RETURN NEW; END IF;
  IF v_ref IS NULL OR v_ref = NEW.id THEN RETURN NEW; END IF;               -- no self-referral
  PERFORM 1 FROM public.users WHERE id = v_ref AND is_bot = false;          -- referrer real + not a bot
  IF NOT FOUND THEN RETURN NEW; END IF;

  SELECT referral_reward_sparkles, referral_friend_bonus, referral_max_per_day
    INTO v_cfg FROM public.engine_config WHERE id = 1;

  -- Per-referrer daily cap (bounds farming; sparkle_transactions is the source of truth).
  SELECT count(*) INTO v_today FROM public.sparkle_transactions
    WHERE user_id = v_ref AND reason LIKE 'referral:%'
      AND reason NOT LIKE 'referral:friend:%'
      AND created_at > now() - interval '24 hours';
  IF v_today >= v_cfg.referral_max_per_day THEN RETURN NEW; END IF;

  -- Idempotent grants (unique reason per referred user => at most once, ever).
  PERFORM public.grant_sparkles(v_ref,   v_cfg.referral_reward_sparkles, 'referral:'        || NEW.id);
  PERFORM public.grant_sparkles(NEW.id,  v_cfg.referral_friend_bonus,    'referral:friend:' || NEW.id);

  -- Notifications (INSERT auto-fires the send-push trigger + shows in inbox).
  INSERT INTO public.notifications (recipient_id, actor_id, type, subtype, body)
  VALUES
    (v_ref,  NEW.id, 'referral_reward', 'referrer', NULL),
    (NEW.id, v_ref,  'referral_reward', 'friend',   NULL);

  RETURN NEW;
END; $$;

CREATE TRIGGER trg_reward_referral
  AFTER UPDATE OF has_ai_recipe ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.reward_referral_on_activation();
```

Notes:
- Fires again harmlessly if `has_ai_recipe` is ever reset+recompleted (see `287_reset_my_profile.sql`):
  `grant_sparkles`'s reason-dedup means no double pay.
- Email/OAuth verification is implied: you cannot reach `has_ai_recipe = true` without a signed-in,
  confirmed account (`app/(auth)/signup.tsx:49-56`, `mailer_autoconfirm=false`; OAuth is inherently
  verified).
- Mirror the anti-farming guards already in `gift_sparkles` (migration 334_gift_sparkles.sql:96-153):
  recipient exists / not a bot / not self / (optional) block check.

### 5c. `claim_referral(p_code)` — set `referred_by` once (self-only)
```sql
CREATE OR REPLACE FUNCTION public.claim_referral(p_code text)
RETURNS text  -- referrer's username on success (for the "Invited by @X" ack), else NULL
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_me uuid := auth.uid(); v_ref uuid; v_username text;
BEGIN
  IF v_me IS NULL OR p_code IS NULL OR length(btrim(p_code)) = 0 THEN RETURN NULL; END IF;
  SELECT id, username INTO v_ref, v_username FROM public.users
    WHERE (referral_code = btrim(p_code) OR lower(username) = lower(ltrim(btrim(p_code), '@')))
      AND is_bot = false
    LIMIT 1;
  IF v_ref IS NULL OR v_ref = v_me THEN RETURN NULL; END IF;             -- unknown or self
  UPDATE public.users SET referred_by = v_ref
    WHERE id = v_me AND referred_by IS NULL;                             -- one-time, immutable
  RETURN v_username;
END; $$;
GRANT EXECUTE ON FUNCTION public.claim_referral(text) TO authenticated;
```
Accepts a stable code OR an @username. Sets `referred_by` only when currently NULL (immutable), never
self. Called from the onboarding referral step (5e). Timing: must run BEFORE the friend completes
onboarding (so `referred_by` is set when the 5b trigger fires). The onboarding referral step is early
(after `welcome`), so this holds.

### 5d. Generate `referral_code` in `handle_new_user()`
Live trigger fn: `migration 269_username_confirmed_and_dedup.sql:25-69` (fires `on_auth_user_created`
AFTER INSERT ON `auth.users`, created in `001_initial_schema.sql:146-161`). Redefine it (CREATE OR
REPLACE, same signature) to also compute a short unique `referral_code` in the same INSERT (same spot
it dedups the username). Suggested: 7 chars base32 of `gen_random_uuid()` with a uniqueness retry
loop; keep it URL-safe and unambiguous (no 0/O/1/l).

### 5e. `get_my_referrals()` — status screen data
`SECURITY DEFINER`, returns the caller's referral summary (economy columns are not client-readable,
mirror `get_my_account`, `store/auth.ts:101`):
```sql
-- returns: referral_code, referred_count int, sparkles_earned int, and a small list of
-- { username, joined_at } for users WHERE referred_by = auth.uid() ORDER BY created_at DESC LIMIT N.
-- sparkles_earned = sum(amount) from sparkle_transactions WHERE user_id = auth.uid()
--                   AND reason LIKE 'referral:%' AND reason NOT LIKE 'referral:friend:%'.
```

### 5f. `notifications` type
Add a `referral_reward` type (subtype `referrer` | `friend`). The DB trigger on `notifications`
INSERT already fires `send-push` -> Expo, and it shows in the inbox. Wire copy in
`lib/notificationToast.ts` (`toastForNotification`) + `hooks/useInboxGrouped.ts` + `app/inbox.tsx`
subject/subtext, and route the tap to `/referrals` (referrer) or the sparkle balance (friend). If
the referral toast should get the whimsy treatment, branch it in `maybeShowNotificationToast`
(`app/_layout.tsx`).

---

## 6. Fraud prevention + economics

Levers available today (no device id / App Attest exists — `APP_ATTESTATION_PLAN.md` is a plan only):
- **Onboarding-completion gate** (5b): a verified, engaged human, far harder to farm than account
  creation. This is the primary defense.
- **One bounty per referred account, ever**: enforced by the unique `referral:<id>` reason +
  `grant_sparkles` dedup + the DB backstop index (4c).
- **Self-referral blocked**: `referred_by <> self` in both `claim_referral` (5c) and the trigger (5b).
- **Per-referrer daily cap**: `engine_config.referral_max_per_day` (default 20) in the trigger (5b).
- **Server-authoritative**: grants only via the definer trigger, never the client path.
- **Reuse the per-IP free-first-dream cap** (`migration 332_first_dream_ip_rate_limit.sql`,
  `claim_first_dream_ip`, enforced in `supabase/functions/enqueue-dream/index.ts:108`) which already
  throttles the friend's first render per IP. (IP is not available inside a DB trigger, so the
  per-referrer daily cap + completion gate are the trigger-level levers.)

Economics: two-sided = 50 sparkles per successful referral (25 + 25). A sparkle is ~one dream's AI
cost, so referral CAC in sparkles is far below paid acquisition. The completion gate + daily cap +
one-per-account bound the worst case. All amounts are `engine_config`-tunable with no build.

---

## 7. Build checklist

### Phase 1 — MVP (app + DB only, no website changes)
- [ ] Migration (prefix 398+): 4a columns, 4b engine_config knobs, 4c index, 5c `claim_referral`,
      5b trigger + fn, 5d `handle_new_user` redefine (+ backfill existing codes), 5e `get_my_referrals`.
      Apply in the SQL editor (DDL), then regenerate `types/database.ts`
      (`supabase gen types typescript --linked`). Do NOT hand-edit the generated types.
- [ ] `hooks/useEngineConfig.ts`: expose `referralRewardSparkles`, `referralFriendBonus`,
      `referralMaxPerDay`.
- [ ] Onboarding step (5e): new `StepConfig` `referral` inserted after `welcome`
      (`app/(onboarding)/index.tsx:78-106`, `skipInEdit: true`), a component `ReferralStep`
      (InfoStep cadence: purple eyebrow / gradient headline / soft-white body). Input accepts
      @username or code -> `claim_referral`; on success show "Invited by @X ✨". If a pending code was
      captured (Phase 2), prefill + show the passive ack instead of the input.
- [ ] `app/referrals.tsx`: hero + share card + status (`get_my_referrals`). Share via `Share.share`
      (like `app/sharePost.tsx`) with the invite link/code; reuse `SparkleField`.
- [ ] Settings entry: a `SettingsRow` (gift-outline) "Invite friends" in the STORE section
      (`app/settings/index.tsx:505-548`) -> `nav.push('/referrals')`.
- [ ] `referral_reward` notification wiring (5f): toast + inbox + tap routing. Optional celebration
      screen forked from `app/welcome-gift.tsx`.
- [ ] Tests: a dbspec for `claim_referral` (self-block, one-time, unknown code) + the trigger
      (idempotent, cap, self-block, friend + referrer both paid once). Follow `__tests__/db/*.dbspec.ts`.

### Phase 2 — near-seamless + web
- [ ] `dreambot-web/app/invite/[code]/route.ts`: clone `app/post/[id]/route.ts` (plain HTML, App
      Store CTA, og/twitter meta). On "Get the app", copy the code to the clipboard.
- [ ] Clipboard bridge: `Clipboard.getStringAsync` on first launch behind an install-level
      AsyncStorage flag; validate + stash the code; prefill the onboarding step.
- [ ] AASA `/invite/*` + `app/_layout.tsx` matcher for `https://dreambotapp.com/invite/<code>` (only
      helps when the app is already installed).
- [ ] Optional `referrals` table for richer status; leaderboard; milestone nudges.

---

## 8. Key files + patterns to mirror (grounding)

Attribution / deep links:
- `app/_layout.tsx` `handleUrl` (postMatch ~:134, userMatch ~:158, cold-start `isFirstJsLoad` ~:162);
  `app/+native-intent.ts`.
- `app.config.js`: `scheme: 'dreambot'` (:41), `associatedDomains: ['applinks:dreambotapp.com']` (:50),
  `bundleIdentifier com.konakevin.radorbad`, `appleTeamId 43VMZ5KMW4`; FB tracking disabled (:73-75).
- App Store id `6761505205` (dreambot-web `post/[id]/route.ts` `APP_STORE_URL`).
- `dreambot-web/app/post/[id]/route.ts` (plain-HTML landing to clone),
  `dreambot-web/app/.well-known/apple-app-site-association/route.ts` (AASA paths).
- `expo-clipboard` (`package.json`), write used in `app/sharePost.tsx:194`; read is net-new.

Economy / grants:
- `grant_sparkles` latest: `migration 258_grant_sparkles_idempotent.sql:27-79`.
- `sparkle_transactions`: `058:7-16` (+ `185:18`); indexes `258:89-94`, `321`.
- `engine_config`: `247_engine_config_phase0.sql:16`, `get_engine_config()` `335:5-28`,
  `hooks/useEngineConfig.ts`.
- Service-role grant analogs: `dream-queue-worker` `nightly_fail_credit:<job.id>` (:83-86, the twin),
  `revenuecat-webhook` `purchase:<txid>`; fraud template `gift_sparkles` `334:75-179`.
- Welcome bonus: `lib/welcomeBonus.ts`, granted at `lib/firstDreamKickoff.ts:69-84`.
- Reward UX: `app/welcome-gift.tsx`, `components/SparkleField.tsx`, `components/GiftSparklesSheet.tsx`,
  `hooks/useSparkles.ts` (balance via `get_my_account`).

Onboarding / auth:
- New user: trigger `handle_new_user` (`001:146-161`, live `269_username_confirmed_and_dedup.sql:25-69`).
- Onboarding steps: `app/(onboarding)/index.tsx:78-106`; route gate `lib/postAuthRoute.ts` on
  `has_ai_recipe`; completion `components/onboarding/SaveContinueStep.tsx` -> `lib/firstDreamKickoff.ts`
  -> `lib/saveVibeProfile.ts` flips `has_ai_recipe`.
- Share: profile `app/(tabs)/profile.tsx:484-489` (clipboard universal link),
  `components/ProfileHeader.tsx:250-253`.
- Settings: `app/settings/index.tsx` (STORE section :505-548).
- Fraud: per-IP cap `migration 332_first_dream_ip_rate_limit.sql`; economy columns locked
  (`278:56`, `280:60`).

---

## 9. Gotchas / hard rules
- `users` uses **column-level GRANTs** (mig 278/280): a NEW column is invisible/un-writable to the
  client until granted. `referred_by` / `referral_code` are read/written only via the RPCs here
  (definer), so no client grant is needed. If any client code must read them directly, add
  `GRANT SELECT (col) ... TO authenticated` in the same migration.
- Referral grants to the referrer MUST be service-role / definer. The client `grant_sparkles` path
  only allows `welcome_bonus` to self.
- Regenerate `types/database.ts` after the migration is applied (never hand-edit it).
- Deploy no edge functions for Phase 1 (all DB + client). Phase 2 touches only dreambot-web.
- No em dashes in any copy or doc text (house rule).
- Migrations run by hand in the Supabase SQL editor; use the next free prefix (>= 398).

---

## 10. Open decisions (defaults chosen; revisit before launch)
- Friend bonus amount (default 25, symmetric). Could be lower (e.g. 10-15) to reduce cost.
- Per-referrer daily cap value (default 20).
- Whether to add the passive whimsy treatment to the `referral_reward` toast (ties into the separate
  "caught a dream awake" whimsy task).
- Referral code format (7-char base32 suggested) vs allowing @username as the shareable handle.
