# Password Reset Email — Setup & Remaining Work

The logged-out **"Forgot password"** flow (login screen) emails a recovery link.
Goal: the email is sent **from DreamBot** (not "Supabase Auth") and the link
**actually opens the app** to set a new password.

> Note: the logged-IN **"Change password"** (Settings) is already fully done and
> needs **no email** — it verifies the current password and updates inline.

---

## ✅ DONE (code — committed, pushed, CI-green, website live)

- **App** (`app/(auth)/login.tsx`): forgot-password now redirects to the https
  universal link `https://dreambotapp.com/reset-password` (was the fragile
  `dreambot://` scheme). — commit `6509563d`
- **Website** (`../dreambot-web`): `/reset-password` landing/bounce page + the
  `/reset-password` path registered in the AASA. — **live** at dreambotapp.com
  (verified: AASA lists the path, page returns 200). — commit `9920e14`
- **App deep-link handler** (`app/_layout.tsx`): already exchanges the recovery
  code and routes to the set-new-password screen. No change needed.

---

## ⬜ REMAINING — all config, no code (what YOU do)

### 1. Supabase — make the link resolve
Dashboard → **Authentication → URL Configuration**:
- [ ] **Redirect URLs**: add `https://dreambotapp.com/reset-password`
- [ ] **Site URL**: `https://dreambotapp.com`

*(Without the redirect allow-listed, Supabase ignores it and falls back to the
Site URL — this is why the link previously dead-ended.)*

### 2. Supabase — send from DreamBot (custom SMTP)
Dashboard → **Authentication → Emails → SMTP Settings** → enable custom SMTP:
- [ ] **Gmail**: host `smtp.gmail.com`, port `587`, username = your Gmail,
      password = a Google **App Password** (enable 2FA first: myaccount.google.com
      → Security → App passwords)
- [ ] **Sender name** `DreamBot`, sender email = that Gmail address
- [ ] **Email Templates → Reset Password**: brand the subject
      ("Reset your DreamBot password") + body; keep `{{ .ConfirmationURL }}` intact

### 3. Deliverability (avoid spam)
- Gmail sender: Google handles SPF/DKIM for `gmail.com` — usually fine as-is.
- Only if you later send as `support@dreambotapp.com`: add the Google/Resend
  SPF + DKIM records in **Wix DNS**.

### 4. Ship the app change
- [ ] The `redirectTo` change is JS — get a build/OTA that includes commit
      `6509563d`. The installed app keeps sending the old `dreambot://` link until
      a build has this.

### 5. iOS universal-link caching (testing gotcha)
- iOS caches the AASA. If, after setup, the link opens Safari instead of the app,
  **reinstall the app** (or wait) so iOS refetches the AASA. Either way the
  website `/reset-password` page's "Open DreamBot" button is the fallback.

### 6. Test end-to-end
- [ ] On a device with the new build: Login → Forgot password → email arrives
      **from "DreamBot"** → tap link → app opens on **"Set a new password"** →
      set it → sign in with the new password.

---

## Flow (reference)

`resetPasswordForEmail(redirectTo: https://dreambotapp.com/reset-password)`
→ Supabase sends the (branded, once SMTP is set) email
→ user taps link → Supabase verifies the token, 302 →
`https://dreambotapp.com/reset-password?code=…`
→ **app installed:** iOS opens the app directly via universal link;
  **else:** the website bounce page → `dreambot://reset-password?code=…`
→ `app/_layout.tsx` exchanges the code → set-new-password screen →
`updateUser({ password })`.

## Optional upgrade (better branding than Gmail)

**Resend**: add `dreambotapp.com` + a couple DNS records, send from
`support@dreambotapp.com` — real branded sender + better deliverability. Free
tier easily covers reset volume. Swap this in for SMTP step 2 whenever you want.
