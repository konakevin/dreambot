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
  <body style="margin:0;padding:0;background-color:#0d0d0f;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0f;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background-color:#161618;border-radius:16px;border:1px solid #262629;">
          <tr><td style="padding:32px 32px 4px;text-align:center;">
            <span style="font-size:26px;font-weight:700;color:#A78BFA;letter-spacing:-0.5px;">DreamBot</span>
          </td></tr>
          <tr><td style="padding:4px 32px;text-align:center;">
            <div style="font-size:40px;line-height:1;">&#128274;</div>
            <h1 style="margin:12px 0 4px;font-size:20px;color:#ffffff;">Reset your password</h1>
            <p style="margin:0;font-size:15px;line-height:1.5;color:#a0a0aa;">
              Tap the button below to choose a new password. This link expires soon and can only be used once.
            </p>
          </td></tr>
          <tr><td style="padding:24px 32px;text-align:center;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;background-color:#A78BFA;color:#0d0d0f;font-size:16px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:999px;">
              Reset password
            </a>
          </td></tr>
          <tr><td style="padding:0 32px 28px;text-align:center;">
            <p style="margin:0;font-size:12px;line-height:1.5;color:#6b6b74;">
              If you didn&#39;t request this, you can safely ignore this email. Your password won&#39;t change.
            </p>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#5a5a62;">DreamBot</p>
      </td></tr>
    </table>
  </body>
</html>
```

> Keep `{{ .ConfirmationURL }}` exactly as-is — Supabase swaps in the real
> recovery link (which redirects to `https://dreambotapp.com/reset-password`).
