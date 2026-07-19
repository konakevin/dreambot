# Domain Move (Wix → Porkbun) + Branded Reset Email

**Goal:** send the password-reset email from DreamBot (fast, branded) instead of
"Supabase Auth". This required getting off Wix's DNS.

## Why we're moving off Wix
- Wix's DNS can't create **subdomain MX** records, which Resend (transactional
  email) requires.
- Wix also **won't let you change nameservers** without transferring the domain away.
- So the fix is to move the domain to a registrar with real DNS. **Porkbun** (chosen)
  includes full DNS that supports subdomain MX, so once we're there, Resend just works
  and no extra provider is needed.

## Decision log
- ❌ **Cloudflare DNS** — abandoned. Cloudflare Registrar requires the domain to be
  "Active" (nameservers already pointing at Cloudflare) *before* it will accept a
  transfer, but Wix won't let us change nameservers. Chicken-and-egg. The Cloudflare
  zone that was set up (`naya`/`rory.ns.cloudflare.com`) is unused and can be deleted.
- ✅ **Porkbun** — transfer the registration off Wix, use Porkbun's own DNS. One
  provider for registration + DNS. No Cloudflare needed.

## Status (2026-07-18)
- ✅ **App code** — forgot-password redirects to `https://dreambotapp.com/reset-password`
  (commit `6509563d`). Inline "Change password" in Settings (no email) also shipped.
- ✅ **Website** — `/reset-password` landing page + AASA path, live on dreambotapp.com.
- ✅ **Reset email works today via Gmail SMTP** — Supabase is configured with
  `dreambotapp@gmail.com` SMTP + the branded template. Sends work (verified: recover
  API returns 200). Just **slow**, which is why we're moving to Resend.
- 🔄 **IN PROGRESS: domain transfer Wix → Porkbun** — initiated 2026-07-18 (EPP auth
  code used at Porkbun). ICANN transfers take up to ~5 days; approving the Wix
  confirmation email speeds it up. **No downtime during transfer** — DNS keeps
  resolving through Wix until we switch to Porkbun's DNS.

## Current DNS inventory (recreate EXACTLY in Porkbun after transfer)

| Type  | Name  | Value                                             | Priority |
|-------|-------|---------------------------------------------------|----------|
| A     | `@`   | `216.198.79.1`                                    | —        | (Vercel)
| CNAME | `www` | `28b2891e7cf3981a.vercel-dns-017.com`             | —        | (Vercel)
| MX    | `@`   | `mx1.improvmx.com`                                | 10       | (ImprovMX email)
| MX    | `@`   | `mx2.improvmx.com`                                | 20       | (ImprovMX email)
| TXT   | `@`   | `v=spf1 include:spf.improvmx.com ~all`            | —        | (SPF)
| TXT   | `@`   | `google-site-verification=uMuklZd69g2AjAJYaJh98lQ9iMpyoJxMZk2KEn79Dvk` | — | (Google verify)

Old Wix nameservers (for reference/rollback): `ns14.wixdns.net`, `ns15.wixdns.net`

## Remaining steps (once Porkbun shows the domain transferred in)
1. In Porkbun, make sure the domain uses **Porkbun's DNS** (their nameservers /
   default DNS management).
2. **Recreate the 6 records above** in Porkbun DNS.
3. Verify site + email still resolve (Claude will `dig` to confirm A/CNAME → Vercel,
   MX → ImprovMX, TXT intact).
4. **Resend:** add `dreambotapp.com` → copy its records (DKIM TXT + SPF/MX on a
   `send.` subdomain) → add them in Porkbun DNS (subdomain MX works here) → Verify.
5. **Resend:** create an API key (`re_...`).
6. **Supabase → Auth → SMTP:** host `smtp.resend.com`, port `465`, user `resend`,
   pass = `re_...`, sender name `DreamBot`, sender email `support@dreambotapp.com`.
7. Test — Claude re-runs the recover call; expect a fast 200 from the branded sender.

## Interim
Leave **Gmail SMTP** in place as the working (slow) sender until Resend is live.
Nothing to do; password resets function in the meantime.
