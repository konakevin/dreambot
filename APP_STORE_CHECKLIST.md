# App Store Submission Checklist

## Code ✅ Done
- [x] Sign in with Apple
- [x] Sign in with Google
- [x] Sign in with Facebook
- [x] Account deletion (Settings → Delete account)
- [x] Content moderation (Sightengine — images, videos, text)
- [x] Report posts (flag icon on cards + detail view)
- [x] Report users (... menu on profiles)
- [x] Block users (... menu on profiles, filters from feed)
- [x] Push notifications
- [x] Privacy policy (radorbad.co/privacy)
- [x] Terms of service (radorbad.co/terms)
- [x] App icon (1024x1024)

## Still Needed

### 1. Support Email
Set up `support@radorbad.co` (or use konakevin@gmail.com temporarily).
Options: Wix email, Google Workspace ($6/mo), or Cloudflare Email Routing (free forwarding).

### 2. App Store Connect Setup
Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com):
- Create a new app
- **Bundle ID:** com.konakevin.radorbad
- **App name:** Rad or Bad
- **Subtitle:** Rate anything. Get rated.
- **Category:** Social Networking
- **Age rating:** 17+ (user-generated content with suggestive themes)
- **Privacy policy URL:** https://radorbad.co/privacy
- **Support URL:** https://radorbad.co

### 3. App Description
Draft (edit as you like):
```
Post whatever you want. Others vote Rad or Bad.

Find your vibers — people who vote like you. Build streaks.
Discover your weird little corner of the internet.

Features:
• Swipe Rad 🔥 or Bad 👎 on photos and videos
• Upload your own content across 12 categories
• Find Vibers who share your taste
• Build vote streaks with friends
• Comment, share posts, and interact
• Vibe Score shows your taste compatibility
• Custom feed filtering by category
• Push notifications for votes, comments, and milestones
```

### 4. Keywords
```
rate, rating, vote, photo, social, vibes, streak, rad, bad, swipe, hot or not
```

### 5. Screenshots
Need minimum 3 screenshots for each required size:
- **6.7" (iPhone 15 Pro Max)** — 1290 × 2796 px
- **6.1" (iPhone 15 Pro)** — optional but recommended

Best screens to capture:
1. Feed with a card being voted on (shows core mechanic)
2. Vote result with score badge
3. Profile with vibe streaks
4. Comments section
5. Category filter
6. Login screen (shows branding)

**How to take them:**
- Use the iPhone 15 Pro Max simulator in Xcode
- Cmd+S to save screenshot
- Or use a tool like Fastlane snapshot for automation

### 6. Build & Upload
1. In Xcode: set scheme to **Release**
2. Select **Any iOS Device (arm64)** as the build target (not a simulator)
3. **Product → Archive**
4. When archive completes, click **Distribute App**
5. Choose **App Store Connect** → **Upload**
6. Wait for processing in App Store Connect (~15 min)

### 7. Submit for Review
1. In App Store Connect, select the build
2. Fill in all metadata (description, screenshots, etc.)
3. Answer the export compliance question (No encryption beyond standard HTTPS = select No)
4. Answer the content rights question (all content is user-generated)
5. Submit for review

### Expected Timeline
- Archive + upload: 15 min
- App Store Connect processing: 15-30 min
- Review: 24-48 hours (usually faster for first submission)
- Common first rejection: missing screenshots, unclear content policy, or moderation concern → fix and resubmit (24h turnaround)

### TestFlight (Optional but Recommended)
Same upload process, but in App Store Connect mark the build for TestFlight instead of App Store Review. This lets you:
- Test push notifications on real devices
- Share with beta testers via invite link
- Verify the release build works end-to-end before going public
