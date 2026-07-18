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

---

## Copy-paste values

**URL Configuration**
- Redirect URL: `https://dreambotapp.com/reset-password`
- Site URL: `https://dreambotapp.com`

**SMTP (Gmail)**
- Host: `smtp.gmail.com`  ·  Port: `587`
- Username: `<your-gmail-address>`
- Password: `<google-app-password>` (myaccount.google.com → Security → 2-Step
  Verification must be ON → App passwords → generate one for "Mail")
- Sender name: `DreamBot`
- Sender email: `<your-gmail-address>`

**Reset Password template — Subject**
```
Reset your DreamBot password
```

**Reset Password template — Message body (HTML, email-safe)**
```html
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#0b0a0f;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0a0f;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background-color:#15131c;border-radius:20px;border:1px solid #2a2733;">
          <tr><td style="padding:28px 32px 0;text-align:center;">
            <span style="font-size:13px;font-weight:700;letter-spacing:2px;color:#C4B5FD;text-transform:uppercase;">&#10024; DreamBot</span>
          </td></tr>
          <tr><td style="padding:16px 32px 0;text-align:center;">
            <img src="https://dreambotapp.com/mascot.png" width="132" height="132" alt="DreamBot, a little dreaming robot" style="width:132px;height:132px;border-radius:26px;display:inline-block;" />
          </td></tr>
          <tr><td style="padding:16px 32px 0;text-align:center;">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">Let&#39;s get you back to dreaming</h1>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#b7b3c4;">
              Looks like you&#39;re locked out. Tap below to set a fresh password and get right back to painting your dreams.
            </p>
          </td></tr>
          <tr><td style="padding:24px 32px 4px;text-align:center;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;background-color:#A78BFA;color:#0b0a0f;font-size:16px;font-weight:800;text-decoration:none;padding:15px 34px;border-radius:999px;">
              Reset my password &#10024;
            </a>
          </td></tr>
          <tr><td style="padding:8px 32px 0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#6f6b7d;">This magic link only works once, and not for long, so use it soon.</p>
          </td></tr>
          <tr><td style="padding:20px 32px 28px;text-align:center;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#6f6b7d;border-top:1px solid #2a2733;padding-top:18px;">
              Didn&#39;t ask for this? You can ignore it and drift back to sleep. &#127769; Nothing changes.
            </p>
          </td></tr>
        </table>
        <p style="margin:18px 0 0;font-size:12px;color:#57545f;">Sweet dreams, DreamBot &#127769;</p>
      </td></tr>
    </table>
  </body>
</html>
```

> Keep `{{ .ConfirmationURL }}` exactly as-is — Supabase swaps in the real
> recovery link (which redirects to `https://dreambotapp.com/reset-password`).
