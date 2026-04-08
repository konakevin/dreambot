# SHIP IT — DreamBot App Store Launch Checklist

Master checklist for shipping DreamBot to the Apple App Store. Work through items in order — each section builds on the previous one.

---

## Phase 1: Code Fixes (Do First)

These are code changes that must be made before building.

### 1.1 Fix IAP Product IDs
- [ ] Decide on final product IDs (current code has `sparkles.100__` with a double underscore — likely a typo)
- [ ] Update `constants/sparklePacks.ts` with correct IDs
- [ ] Update `supabase/functions/revenuecat-webhook/index.ts` product map to match
- [ ] Reconcile with `SPARKLE_PAYMENTS_SETUP.md` (docs say 5/35/85 sparkles, code says 25/50/100/500)

### 1.2 Make Terms & Privacy Links Tappable
- [ ] In `app/(auth)/index.tsx`, replace plain text "By continuing you agree to our Terms of Service and Privacy Policy" with tappable links
- [ ] Link to `https://dreambotapp.com/privacy` and `https://dreambotapp.com/terms`
- [ ] Use `Linking.openURL()` or expo-web-browser

### 1.3 Remove Microphone Permission
- [ ] Check if any plugin or SDK actually requires microphone access
- [ ] If not needed, remove `NSMicrophoneUsageDescription` from `ios/DreamBot/Info.plist`
- [ ] Verify `expo-video` plugin isn't injecting it (if it is, and video isn't used, remove the plugin)

### 1.4 Fix Push Notification Entitlement
- [ ] Verify EAS production builds override `aps-environment` from `development` to `production` automatically via provisioning profile
- [ ] If not, update `ios/DreamBot/DreamBot.entitlements` to set `aps-environment` to `production`
- [ ] Note: EAS managed builds typically handle this — test with a production build to confirm

### 1.5 Improve Permission Strings
- [ ] Camera: already good in app.json ("DreamBot uses your camera to capture photos for AI dream generation")
- [ ] Verify EAS build uses the app.json string, not the generic Info.plist one ("Allow $(PRODUCT_NAME) to access your camera")
- [ ] Photo Library: already good ("Allow DreamBot to save photos to your library")

### 1.6 Move Facebook Client Token to Env Var
- [ ] Move `clientToken: '479742805ecbd92874db6a2544e2d61c'` from app.json to `EXPO_PUBLIC_FB_CLIENT_TOKEN` env var
- [ ] Update app.json to read from env var
- [ ] Add to EAS environment variables

---

## Phase 2: App Store Connect Setup

These are done in the browser at [App Store Connect](https://appstoreconnect.apple.com).

### 2.1 Decide on Bundle ID
- [ ] Current bundle ID is `com.konakevin.radorbad` (legacy from Rad or Bad era)
- [ ] **Decision needed:** Keep it (if ASC app already exists) or change to `com.konakevin.dreambot` (if starting fresh)
- [ ] If changing: update `app.json`, `ios/DreamBot.xcodeproj`, and all RevenueCat product IDs
- [ ] Cannot change after first submission

### 2.2 Create App in App Store Connect
- [ ] Create new app with chosen bundle ID
- [ ] Set primary language: English (U.S.)
- [ ] Set category: Entertainment (or Lifestyle)
- [ ] Set subcategory: (optional)

### 2.3 Create IAP Products
- [ ] Create 4 consumable products matching `constants/sparklePacks.ts` IDs exactly
- [ ] Set prices for each ($2.99 / $4.99 / $7.99 / $24.99)
- [ ] Add display names and descriptions
- [ ] Submit products for review (can be done with the app submission)
- [ ] Screenshot of IAP in action required for each product

### 2.4 Configure RevenueCat
- [ ] Verify RevenueCat project exists and iOS app is connected
- [ ] Create entitlement (e.g., `sparkles`)
- [ ] Create offering named exactly `sparkle_packs` (code expects this name)
- [ ] Add all 4 products to the offering
- [ ] Configure the RevenueCat webhook URL pointing to `{SUPABASE_URL}/functions/v1/revenuecat-webhook`
- [ ] Set `REVENUECAT_WEBHOOK_SECRET` in Supabase secrets (must match what the Edge Function checks)

### 2.5 Fill In App Store Metadata
- [ ] App name: DreamBot
- [ ] Subtitle: (25 chars max, e.g., "AI Dreams Made For You")
- [ ] Description: Write compelling description highlighting personalized AI art, nightly dreams, social feed
- [ ] Keywords: `ai art, dream, ai image, personalized, nightly, creative, social, generate, art styles`
- [ ] Support URL: `https://dreambotapp.com/support`
- [ ] Privacy Policy URL: `https://dreambotapp.com/privacy`
- [ ] Age Rating: complete the questionnaire (likely 12+ for user-generated content)
- [ ] Copyright: `2026 Kevin McHenry`

---

## Phase 3: Web Properties

### 3.1 Host Privacy Policy & Terms
- [ ] Create `https://dreambotapp.com/privacy` — privacy policy page
- [ ] Create `https://dreambotapp.com/terms` — terms of service page
- [ ] Both must be publicly accessible (Apple reviewers will check)
- [ ] Privacy policy must cover: data collected, how it's used, third parties (Supabase, Replicate, Anthropic, SightEngine, RevenueCat)

### 3.2 Host Apple App Site Association File
- [ ] Create `https://dreambotapp.com/.well-known/apple-app-site-association`
- [ ] Content:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.konakevin.radorbad",
        "paths": ["/post/*", "/user/*"]
      }
    ]
  }
}
```
- [ ] Must be served with `Content-Type: application/json` (no redirect)
- [ ] Replace `TEAM_ID` with your Apple Developer Team ID

### 3.3 Support Page
- [ ] Create `https://dreambotapp.com/support` — support contact page
- [ ] At minimum: an email address (e.g., support@dreambotapp.com)
- [ ] Apple requires a way for users to contact you

---

## Phase 4: Screenshots & Assets

### 4.1 Take App Store Screenshots
- [ ] Need screenshots for 6.7" display (iPhone 15 Pro Max / 16 Pro Max) — required
- [ ] Recommended: also 6.1" display
- [ ] Minimum 3 screenshots, recommended 6-8
- [ ] Suggested screens to capture:
  1. Home feed (Explore tab with dreams)
  2. Create screen (prompt + medium/vibe pickers)
  3. Dream reveal (full-screen generated dream)
  4. Onboarding (Vibe Profile setup)
  5. Dream Cast (photo upload)
  6. Inbox (nightly dream notification with bot message)
- [ ] Use iPhone 15 Pro Max simulator or device
- [ ] Consider adding marketing text overlays (optional but recommended)

### 4.2 App Preview Video (Optional)
- [ ] 15-30 second video showing the dream generation flow
- [ ] Shows well in App Store search results
- [ ] Can be done later — not required for v1

---

## Phase 5: Environment & Build

### 5.1 Set EAS Environment Variables
- [ ] Go to [expo.dev](https://expo.dev) → project → Environment Variables
- [ ] Add for production profile:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
  - `EXPO_PUBLIC_FB_CLIENT_TOKEN` (if moved to env var in Phase 1)

### 5.2 Verify Supabase Secrets
- [ ] All Edge Function secrets are set via `supabase secrets set`:
  - `REPLICATE_API_TOKEN`
  - `ANTHROPIC_API_KEY`
  - `SIGHTENGINE_API_USER`
  - `SIGHTENGINE_API_SECRET`
  - `REVENUECAT_WEBHOOK_SECRET`
- [ ] Verify with `supabase secrets list`

### 5.3 Build for Production
- [ ] Run `eas build --platform ios --profile production`
- [ ] Wait for build to complete on EAS servers
- [ ] Download the `.ipa` for local testing if needed

### 5.4 Submit to TestFlight
- [ ] Run `eas submit --platform ios --profile production`
- [ ] Or configure ASC API key in `eas.json` for automated submission:
```json
"submit": {
  "production": {
    "ios": {
      "ascApiKeyIssuerId": "YOUR_ISSUER_ID",
      "ascApiKeyId": "YOUR_KEY_ID",
      "ascApiKeyPath": "./path-to-key.p8"
    }
  }
}
```
- [ ] Build appears in TestFlight after Apple processing (5-30 minutes)

---

## Phase 6: TestFlight Testing

### 6.1 Core Functionality
- [ ] Sign up with new account (email + Apple + Google + Facebook)
- [ ] Complete onboarding (all 7 steps)
- [ ] Generate a dream from Create tab (prompt, photo, surprise)
- [ ] Post a dream, verify it appears in feed
- [ ] Like, comment, share, save a post
- [ ] Follow a user, send friend request
- [ ] Verify nightly dream appears (trigger manually or wait)

### 6.2 Push Notifications
- [ ] Verify push token is registered on real device
- [ ] Trigger a notification (have another user like/comment)
- [ ] Verify notification appears and tapping navigates correctly
- [ ] Test nightly dream notification

### 6.3 In-App Purchases
- [ ] Create a Sandbox Apple ID in App Store Connect → Users and Access → Sandbox
- [ ] Sign into sandbox account on test device (Settings → App Store → Sandbox Account)
- [ ] Purchase each sparkle pack, verify balance updates
- [ ] Verify RevenueCat webhook fires and `grant_sparkles` RPC runs
- [ ] Test "Not enough sparkles" flow

### 6.4 Deep Links
- [ ] Test `dreambotapp.com/post/{id}` universal link (requires AASA file hosted)
- [ ] Test `dreambot://photo/{id}` custom scheme link
- [ ] Verify both navigate to the correct post

### 6.5 Edge Cases
- [ ] Test with no internet connection — graceful errors
- [ ] Test with 0 sparkles — proper alert with "Get Sparkles" button
- [ ] Kill app during dream generation — no stuck state on relaunch
- [ ] Test content moderation — submit a prompt that should be blocked

---

## Phase 7: App Store Submission

### 7.1 Final Pre-Submit Checklist
- [ ] All TestFlight tests pass
- [ ] Screenshots uploaded to App Store Connect
- [ ] All metadata filled in (description, keywords, category, age rating)
- [ ] Privacy policy URL works and is accurate
- [ ] Support URL works
- [ ] IAP products are in "Ready to Submit" state
- [ ] Build is selected in App Store Connect

### 7.2 Submit for Review
- [ ] In App Store Connect, select the build
- [ ] Add App Review notes:
  - Test account credentials (create a demo account)
  - Explain that AI-generated content is personalized to user taste
  - Note that IAP uses consumable sparkles for dream generation
  - Mention content moderation via SightEngine
- [ ] Submit for review
- [ ] Expected review time: 24-48 hours

### 7.3 Post-Submission
- [ ] Monitor App Store Connect for review status
- [ ] If rejected: read the rejection reason carefully, fix, resubmit
- [ ] Common rejection reasons for AI apps:
  - Missing content moderation disclosure
  - IAP not working in review environment
  - Privacy policy doesn't mention AI/third-party APIs
  - Permission strings too generic

---

## Phase 8: Post-Launch

### 8.1 Monitor
- [ ] Watch for crash reports in Xcode Organizer / EAS
- [ ] Monitor Supabase Edge Function logs for errors
- [ ] Monitor RevenueCat dashboard for purchase events
- [ ] Check SightEngine moderation logs

### 8.2 Iterate
- [ ] Collect user feedback
- [ ] Monitor App Store reviews
- [ ] Plan v1.1 with fixes for any issues found

---

## Quick Reference

| Item | Value |
|------|-------|
| Bundle ID | `com.konakevin.radorbad` (or `com.konakevin.dreambot` if changing) |
| EAS Project ID | `315a034e-ee26-4d53-9dc3-e3c5078b4b3c` |
| App Scheme | `dreambot://` |
| Associated Domain | `applinks:dreambotapp.com` |
| RevenueCat Offering | `sparkle_packs` |
| RC iOS Key | `appl_gDwFXEmOsQLWUTUndcldpmruekW` |
| Supabase Project | `jimftynwrinwenonjrlj` |
| Min iOS Version | 12.0 |
