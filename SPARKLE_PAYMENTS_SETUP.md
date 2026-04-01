# Sparkle Payments — Remaining Setup Steps

## What's Already Built

- **Supabase migration** (`supabase/migrations/058_sparkles_and_fusion.sql`) — applied
- **Edge function** (`supabase/functions/revenuecat-webhook/index.ts`) — receives RevenueCat webhooks, grants sparkles with idempotency
- **RevenueCat SDK** (`react-native-purchases`) — installed, plugin in app.json
- **SDK wrapper** (`lib/revenuecat.ts`) — configure, purchase, restore helpers
- **SDK initialization** (`app/_layout.tsx`) — `RevenueCatInitializer` configures with Supabase user ID on auth
- **Purchase hooks** (`hooks/useSparkles.ts`) — `useSparklePackages`, `usePurchaseSparkles`, `useRestorePurchases`
- **Sparkle Store screen** (`app/sparkleStore.tsx`) — 3 pack cards, balance display, restore button
- **Settings integration** (`app/settings.tsx`) — "Get Sparkles" row in SPARKLES section
- **"Not enough" flow** (`components/DreamFusionSheet.tsx`) — alerts navigate to store

## Steps To Complete

### 1. Create RevenueCat Project
- Sign up at revenuecat.com
- Create a new project for DreamBot
- Connect your App Store Connect app (needs App Store Connect API key)
- Copy the **iOS Public API Key** from RevenueCat dashboard

### 2. Replace Placeholder API Key
- Open `lib/revenuecat.ts`
- Replace `YOUR_REVENUECAT_IOS_API_KEY` with the real key from step 1
- (Android key too if you want Android support later)

### 3. Create Products in App Store Connect
- Go to App Store Connect > your app > In-App Purchases
- Create 3 **consumable** products:
  - `com.konakevin.radorbad.sparkles.5` — $0.99
  - `com.konakevin.radorbad.sparkles.35` — $4.99
  - `com.konakevin.radorbad.sparkles.85` — $9.99
- Submit for review (Apple reviews IAP products separately)

### 4. Configure RevenueCat Entitlements & Offerings
- In RevenueCat dashboard, create an Entitlement (e.g., "sparkles")
- Create an Offering (e.g., "default") with 3 Packages matching the 3 products
- RevenueCat Packages map to the product IDs above

### 5. Deploy the Webhook Edge Function
```bash
# Install Supabase CLI if needed: brew install supabase/tap/supabase
supabase functions deploy revenuecat-webhook --no-verify-jwt
```
The `--no-verify-jwt` flag is required because RevenueCat sends a plain Authorization header, not a Supabase JWT.

### 6. Configure the Webhook in RevenueCat
- In RevenueCat dashboard > Integrations > Webhooks
- Set URL: `https://<your-project-ref>.supabase.co/functions/v1/revenuecat-webhook`
- Set Authorization header value (this becomes your webhook secret)
- Copy that secret for the next step

### 7. Set Webhook Secret in Supabase
```bash
supabase secrets set REVENUECAT_WEBHOOK_SECRET=<the-secret-from-step-6>
```

### 8. Rebuild the iOS App
New native module (`react-native-purchases`) requires a rebuild:
```bash
cd ios && pod install && cd ..
```
Then open Xcode, select your simulator, and hit play. Then `npx expo start`.

### 9. Test the Purchase Flow
- Use a **Sandbox Apple ID** (create in App Store Connect > Users > Sandbox)
- On the simulator/device, sign into Settings > App Store with the sandbox account
- Open the app, go to Settings > Get Sparkles
- Tap a pack — it should trigger the App Store purchase sheet
- After purchase, balance should update within a few seconds (webhook grants sparkles)

### 10. Optional: Apply for Apple Small Business Program
- https://developer.apple.com/programs/small-business-program
- Drops Apple's commission from 30% to 15%

## Architecture Overview

```
User taps "Buy 35 Sparkles" in app
  -> RevenueCat SDK handles App Store purchase
  -> Apple processes payment
  -> RevenueCat receives receipt
  -> RevenueCat POSTs webhook to Supabase Edge Function
  -> Edge function verifies auth header
  -> Edge function checks idempotency (no double-grants)
  -> Edge function calls grant_sparkles(user_id, 35, 'purchase:<txn_id>')
  -> User's sparkle_balance increases
  -> App polls/refreshes balance via useSparkleBalance hook
```

## Product ID Mapping

| Product ID | Sparkles | Price |
|---|---|---|
| com.konakevin.radorbad.sparkles.5 | 5 | $0.99 |
| com.konakevin.radorbad.sparkles.35 | 35 | $4.99 |
| com.konakevin.radorbad.sparkles.85 | 85 | $9.99 |

This mapping exists in two places (keep in sync):
- `supabase/functions/revenuecat-webhook/index.ts` — `SPARKLE_PACKS` constant
- `app/sparkleStore.tsx` — `PACK_INFO` constant
