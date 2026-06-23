# Sparkle Pricing & Monetization Strategy

How to think about pricing, unit economics, and profit projections for DreamBot's sparkle packs + Pro subscription + free-trial-then-pay model. Last updated 2026-06-08 (cost stack + pack lineup + Pro section reconciled against live code and verified provider pricing).

This is the **business model** doc — for IAP/RevenueCat technical wiring see `SPARKLE_PAYMENTS_SETUP.md`; for the operating P&L + scenario model see `SHOW_ME_THE_MONEY.md`. Per-model API costs live in `supabase/functions/_shared/modelPricing.ts`.

---

## TL;DR

- **Sparkle cost is model-tiered (1/2/3/5), not flat.** A render costs us $0.003–$0.134 depending on the model; the user pays 1–5 sparkles to match. Default model (Flux 1.1 Pro) = 1 sparkle, $0.040. Worst-case cost **$0.046/sparkle**, blended ~$0.03.
- **Cost per dream:** nightly **~$0.035**, user-created **~$0.045** all-in (model + Sonnet brief + amortized face swap). Validated 2026-06-08 against provider pricing.
- **Apple's cut:** 30% standard, **15% if enrolled in Small Business Program** (qualify under $1M annual proceeds). This is the biggest single margin lever — confirm enrollment.
- **Two paid products:** consumable **sparkle packs** (15/40/90/200/550) + a **Pro subscription** ($9.99/mo or $79.99/yr) bundling 75 sparkles/mo + 30 nightly dreams + 100 HD downloads.
- **No ads exist** (no ad SDK installed). Free users (post-trial) cost ~$0.02/mo and contribute nothing until they convert. The business is **paid-conversion-driven**.
- **Pack margins (worst case):** 46–59% @15%, 34–50% @30% — profitable under every cost/cut combination.

---

## Cost Stack — what every dream actually costs you

### Model cost is tiered — the user picks the model, the model sets the cost

Per-image API cost at the sizes/qualities we render (validated 2026-06-08).
The sparkle charge tracks cost monotonically (1/2/3/5), so a cheaper model
never costs more sparkles than a pricier one.

| Sparkles | Models | API cost/img |
|---|---|---|
| 1 | Flux Schnell ($0.003), Krea ($0.004), Flux 2 Dev ($0.025), Flux Dev ($0.030), Flux 2 Pro ($0.031), Nano Banana ($0.039), **Flux 1.1 Pro default ($0.040)** | $0.003–0.040 |
| 2 | Flux 1.1 Pro Ultra ($0.060), GPT Image 2 ($0.060), Flux 2 Flex ($0.063) | ~$0.06 |
| 3 | GPT Image 1 ($0.070), Flux 2 Max ($0.073) | ~$0.07 |
| 5 | Nano Banana Pro ($0.134) | ~$0.134 |

⚠️ These hold **only at our pinned resolutions** (Replicate ~1MP default,
OpenAI medium/1024×1536, Gemini Pro 1K). Flux 2 / GPT Image / Nano Banana Pro
price by megapixel/quality — render bigger and costs jump (Flux 2 Max → $0.19
at 4MP; Nano Banana Pro → $0.24 at 4K). Don't unpin without repricing.

### Variable per dream (~$0.045)

| Service | Cost | Notes |
|---|---|---|
| Model render (default Flux 1.1 Pro) | $0.040 | See tier table above; varies by model |
| Replicate (face-swap, when applicable) | +$0.013 | ~30% of dreams → ~$0.004 amortized |
| Anthropic Sonnet (brief) | $0.003-0.006 | Flux-prompt authoring |
| Anthropic Haiku (polish + bot message) | $0.001-0.002 | |
| Supabase storage egress | $0.001-0.002 | Image bytes served to clients |
| **Variable subtotal** | **~$0.045** | Worst-case cost **$0.046/sparkle** |

### Fixed monthly overhead (~$30-50/month)

| Service | Cost/month | Notes |
|---|---|---|
| Supabase Pro | $25 | Required for Edge Functions + RLS at scale |
| Apple Developer Program | $8 | $99/year amortized |
| Domain (dreambotapp.com) | $1 | $12/year amortized |
| RevenueCat | $0 | Free under $10K MTR (Monthly Tracked Revenue) |
| Vercel (Hobby — OG images for deeplinks) | $0 | Free tier handles social-share unfurls |
| EAS Build (pay-per-build) | $0-30 | Variable based on release cadence |
| GitHub Actions (nightly cron) | $0 | Free tier |
| **Fixed subtotal** | **~$34-50/month** | Roughly volume-independent |

### Fully-loaded cost per dream at different scales

Variable + fixed-allocated:

| Monthly dreams | Variable cost | Fixed allocated | **Total per dream** |
|---|---|---|---|
| 1,000 | $45 | $0.034 | **~$0.079** |
| 2,500 | $113 | $0.014 | **~$0.059** |
| 10,000 | $450 | $0.003 | **~$0.048** |
| 50,000 | $2,250 | $0.001 | **~$0.046** |

**Use $0.06/dream for conservative pricing decisions** until you hit ~10K dreams/month.

---

## Apple's IAP Cut

### Standard rate: 30% on consumables (sparkles)

For every $1 a user pays, Apple keeps $0.30 and you get $0.70.

### Small Business Program: 15% (you qualify pre-launch)

If your Apple Developer organization earns under **$1,000,000 USD in proceeds** (the 70% you'd get) per calendar year, you qualify for the **App Store Small Business Program** — drops the IAP cut from 30% → **15%**.

**Eligibility for DreamBot pre-launch:** trivial — you have $0 in proceeds for the prior year.

**How to enroll:**
1. App Store Connect → Agreements, Tax, and Banking
2. App Store Small Business Program section → Set Up
3. Review terms → Agree → Submit
4. Apple confirms within ~5 business days
5. **Do this BEFORE launching DreamBot** to capture all sales at 15% from day one (rate doesn't backdate)

### What happens when you cross $1M

- The 15% rate stays in effect **for the rest of the calendar year you cross** the threshold
- The **next calendar year** you flip back to 30%
- Approximate threshold: ~196K MAU at 5% conversion × $10 ARPPU/mo (= $1.18M annual gross → $1M proceeds)
- Re-enroll if you drop back under $1M in a future year

### Subscriptions are different (and this helps Pro)

For auto-renewing subscriptions (Pro), Apple's cut steps down with tenure:
- Year 1 of a customer's subscription: 30%
- **Year 2+ of the same subscription: 15% automatically** (loyalty discount,
  independent of Small Business)
- Small Business Program drops Year 1 to 15% as well

So a retained Pro subscriber is **always at 15% from year 2** even past the
$1M threshold — which is exactly the cohort (long-tenured yearly power-users)
where margin is thinnest. Retention is a margin lever, not just a revenue one.

---

## Pricing Tiers — Recommended

### Targets

- **At 15% Apple cut + $0.06/dream cost:** target 40-65% margin per pack
- **Per-sparkle gross price tiers DOWN as packs get bigger** (incentivize larger purchases without bleeding margin)
- **Margin floor: 25%** so a 20% cost spike doesn't go negative

### Shipped packs (source of truth: `sparkle_packs` table, migration 255)

Margins below use the **worst case** — every sparkle spent on the $0.046
default model. Real blended usage (~$0.03/sparkle) runs higher.

| Pack | Sparkles | Price | $/sparkle | Net @15% | Cost (worst) | Profit | Margin |
|---|---|---|---|---|---|---|---|
| **Impulse** | 15 | $1.99 | $0.133 | $1.69 | $0.69 | **+$1.00** | 59% |
| **Starter** | 40 | $4.99 | $0.125 | $4.24 | $1.84 | **+$2.40** | 57% |
| **Popular** | 90 | $9.99 | $0.111 | $8.49 | $4.14 | **+$4.35** | 51% |
| **Best Value** | 200 | $19.99 | $0.100 | $16.99 | $9.20 | **+$7.79** | 46% |
| **Whale** | 550 | $49.99 | $0.091 | $42.49 | $25.30 | **+$17.19** | 40% |

**Gross-per-sparkle waterfall:** $0.133 → $0.125 → $0.111 → $0.100 → $0.091 —
every step down is a real per-sparkle discount, none below the 25% floor. (The
Whale was bumped 500 → 550 sparkles on 2026-06-23, migration 304, so it's a
genuine volume discount instead of flat at $0.100 vs the 200.)

### Same packs at the 30% Apple cut (over $1M proceeds)

| Pack | Net @30% | Cost (worst) | Profit | Margin |
|---|---|---|---|---|
| Impulse 15 / $1.99 | $1.39 | $0.69 | +$0.70 | 50% |
| Starter 40 / $4.99 | $3.49 | $1.84 | +$1.65 | 47% |
| Popular 90 / $9.99 | $6.99 | $4.14 | +$2.85 | 41% |
| Best Value 200 / $19.99 | $13.99 | $9.20 | +$4.79 | 34% |
| Whale 550 / $49.99 | $34.99 | $25.30 | +$9.69 | 28% |

Every tier clears the 25% floor even at 30% + worst-case model. **Enrolling in
Small Business (15%) is the single biggest margin lever** — see below.

---

## Pro Subscription

The doc originally predated Pro; it now exists alongside packs. Source of truth:
`constants/proPlan.ts`.

| Plan | Price | Eff./mo | Sparkles | Perks |
|---|---|---|---|---|
| Monthly | $9.99/mo | $9.99 | 75/mo | 30 nightly dreams, 100 HD downloads/mo, 14-day trial |
| Yearly | $79.99/yr | $6.67 | 900 upfront | same |

**Cost to serve** (typical / maxed): ~$3.25 / ~$6.50 per Pro user/month
(nightly $1.05 + sparkles $2.00 + HD $0.20 typical).

| Plan / cut | Typical profit/mo | Maxed profit/mo |
|---|---|---|
| Monthly @15% | +$5.24 | +$1.99 |
| Monthly @30% | +$3.74 | +$0.49 |
| Yearly @15% | +$2.42 | −$0.83 |
| Yearly @30% | +$1.42 | **−$1.83** |

⚠️ **Yearly Pro is the thin SKU** — a maxed yearly power-user at 30% loses
~$1–2/mo. Held in check by the 100-HD-download cap, ~2% Apple refund rate, and
the fact that most users don't max all three perks. If yearly power-users
become common, raise the yearly price or trim the 900-sparkle grant.

**Popular pack vs Pro collision (intentional):** Popular is 90 sparkles for
$9.99 one-time; Pro is $9.99/mo for 75 sparkles **+ nightly + HD + recurring**.
The comparison is designed to push undecided users toward Pro.

### Killed packs (historical — don't reintroduce)

- **100 / $7.99** — barely profitable at 30%. Replaced by 90 / $9.99.
- **500 / $24.99** — lost money per sale at 30%. The current Whale is 550 /
  $49.99 ($0.091/sparkle, 40% margin @15%, 28% @30%) — bumped from 500 on
  2026-06-23 (migration 304) so it's a real volume discount over the 200.

---

## The Free Nightly Dream — Trial, Not Permanent

### The model

- New user signs up → enters **21-day free trial** (or 14-28, dial in via experimentation)
- Each night during trial: free personalized nightly dream lands in inbox
- After trial: nightly dream STOPS unless user pays (buys sparkles or subscribes)
- After trial regardless of conversion: user can still browse the bot feed for free (~zero cost, retention surface)

### Why this works

The free nightly dream is **acquisition cost** disguised as a retention perk:

- **21 days × $0.045 = $0.95 per new user** in pure AI cost
- Compare to typical mobile-app paid acquisition: $3-10 per install
- Your trial dreams are **4-10× cheaper than paid ads** AND have higher product-market-fit value (users get to experience the actual product, not just see an ad)

### Per-user lifetime value (LTV)

Assumptions: 5% trial → paying conversion, $10/mo ARPPU, ~12 month average paying retention.

| User type | Cost | Revenue | Net |
|---|---|---|---|
| Trial-only (didn't convert) | $0.95 one-time | $0 | **−$0.95** |
| Trial → paying ($10 × 12 × 0.85) | $0.95 + (12 × $1.35) = $17.15 | $102 | **+$84.85 LTV** |

Per 100 trials: 5 converters × $84.85 = $424; 95 non-converters × −$0.95 = −$90. **Net per 100 trials: +$334 = $3.34/signup expected lifetime profit.**

### Trial length levers

- **14 days:** $0.63 trial cost. Cheaper but less habit-formation time.
- **21 days:** $0.95. Default recommendation. Roughly 3 weeks = enough for daily habit formation.
- **28 days:** $1.26. Slightly higher conversion (more habit), CAC still tiny.

Mobile-app subscription benchmarks suggest **14+ days minimum** for habit formation. Shorter than that converts before the user is hooked.

---

## Profit Projections at User Scales

### Assumptions

- 10% monthly user growth (new signups = 10% of MAU)
- 5% trial → paying conversion
- $10/month ARPPU per active paying user
- 30 dreams/month per paying user
- 21-day free trial
- 15% Apple Small Business cut (until $1M proceeds threshold)

### Growth curve

| MAU | New signups/mo | Paying users (5%) | Trial cost | Paying dream cost | Net revenue | Bot+infra | **Profit/mo** | **Annual** |
|---|---|---|---|---|---|---|---|---|
| 1,000 | 100 | 50 | $95 | $68 | $425 | $100 | **+$162** | $1,944 |
| 5,000 | 500 | 250 | $475 | $338 | $2,125 | $100 | **+$1,212** | $14,544 |
| 10,000 | 1,000 | 500 | $950 | $675 | $4,250 | $100 | **+$2,525** | $30,300 |
| 25,000 | 2,500 | 1,250 | $2,375 | $1,688 | $10,625 | $100 | **+$6,462** | $77,544 |
| 50,000 | 5,000 | 2,500 | $4,750 | $3,375 | $21,250 | $100 | **+$13,025** | **$156,300** |
| 100,000 | 10,000 | 5,000 | $9,500 | $6,750 | $42,500 | $200 | **+$26,050** | **$312,600** |
| 150,000 | 15,000 | 7,500 | $14,250 | $10,125 | $63,750 | $250 | **+$39,125** | **$469,500** |
| **196,000** | 19,600 | 9,800 | $18,620 | $13,230 | $83,300 | $300 | **+$51,150** | **$613,800** |

### Apple Small Business cap inflection (~196K MAU)

You cross $1M annual proceeds around 196K MAU. The year after, Apple bumps you to 30% — margins compress but you're at hyper-scale.

| MAU | Apple cut | Net revenue | **Profit/mo** | **Annual** |
|---|---|---|---|---|
| 250,000 | 15% (year you cross) | $106,250 | **+$65,325** | **$783,900** |
| 250,000 | 30% (next year) | $87,500 | **+$46,575** | **$558,900** |
| 500,000 | 30% | $175,000 | **+$99,000** | **$1.19M** |
| 1,000,000 | 30% | $350,000 | **+$202,000** | **$2.42M** |

---

## Sensitivity Analysis — Key Levers

The three biggest swing factors on profitability:

| Lever | Pessimistic | Base | Optimistic |
|---|---|---|---|
| Trial → paying conversion | 2% | 5% | 10% |
| Monthly ARPPU | $5 | $10 | $20 |
| Paying user retention (months) | 6 | 12 | 24 |

### LTV per converter at each scenario

- **Pessimistic** (2% × $5 × 6mo): LTV = $25.50, per-trial expected value = $0.49 — barely break-even on trials
- **Base** (5% × $10 × 12mo): LTV = $102, per-trial expected value = $4.16 — strong unit economics
- **Optimistic** (10% × $20 × 24mo): LTV = $408, per-trial expected value = $39.85 — exceptional unit economics

At optimistic case, 50K MAU = $204K/month profit (~$2.4M/year). Hyper-growth territory.

### Things that move conversion (and ARPPU)

- **Time-bounded scarcity** in trial: countdown timer "you have 5 days left" creates urgency
- **Highlight what they'll lose**: surface their trial-period dreams in a "your dreams" gallery so the loss-aversion framing hits when trial ends
- **Bot feed as retention surface** post-trial: even if they don't pay, they keep coming back — re-trigger via "your favorite bot just dropped 5 new dreams"
- **Personalization shows value**: nightly dream actually uses their vibe profile, location, cast photos — feels like the app KNOWS them
- **Gift sparkles**: cheap retention/reactivation lever — give 5 free sparkles to lapsed users
- **Whale-targeting**: deep value packs at $19.99 and $49.99 tiers convert spend-curious users
- **Subscription tier as upsell**: $4.99/mo unlimited for users who want predictable cost — captures users who'd otherwise churn after one big sparkle pack

---

## Decision Framework — When Setting Final Pricing

Before locking pricing, confirm:

1. **Apple Small Business Program enrollment status.** Enroll BEFORE launch to capture early sales at 15%.
2. **Real measured cost per dream over a recent month.** Pull Replicate + Anthropic billing, divide by `count(*) from uploads where created_at > now() - interval '30 days'`. Use that as your real cost number, not the conservative $0.06 placeholder.
3. **Trial length A/B test post-launch.** Start at 21 days. Ship with experiment infrastructure to test 14 vs 21 vs 28 with conversion-rate measurement.
4. **Subscription option vs sparkle-only.** If your retention data after launch shows whales burning through $20+/mo in sparkles, introduce a $9.99/mo subscription as a cheaper-per-dream option for them — captures whale revenue you'd otherwise lose to occasional purchase fatigue.
5. **Pack-tier psychology testing.** $1.99 vs $0.99 impulse pack — A/B test 30 days. $0.99 may convert higher even at slimmer margin.

---

## Hard Rules

- **Don't ship with a 500 / $24.99 pack** at any cost level you've measured — math is impossible. The 500-pack must be ≥$49.99 OR fewer sparkles.
- **Don't drop margin below 25% on any tier** to give users "more value" — that 25% absorbs cost spikes (Replicate price hike, model upgrades, etc.) without going negative.
- **Don't keep free nightly dreams permanent.** Caps the trial at 14-28 days so it's CAC, not COGS.
- **Don't forget to enroll in Small Business Program before launch.** Roughly doubles per-pack profit margin. Free 5-minute action with massive multiplier.
- **Recompute pricing quarterly.** Both real cost-per-dream and conversion rates drift with scale and product changes. Set a recurring calendar reminder.

---

## Reference Numbers (refreshed 2026-06-08)

- Model costs **validated 2026-06-08** against live Replicate / OpenAI / Google
  pricing — `modelPricing.ts` estimates are accurate at our pinned resolutions.
- Worst-case cost per sparkle: **$0.046** (default Flux 1.1 Pro + pipeline).
- Blended cost per sparkle: **~$0.03** (most renders use cheaper models / higher
  tiers that are more efficient per sparkle).
- Planning costs: nightly **$0.035**, user-created **$0.045**.
- ⚠️ Pull a real monthly cost: `SELECT model, count(*), avg(cost_cents) FROM
  ai_generation_log WHERE created_at > now() - interval '30 days' GROUP BY
  model;` and reconcile against Replicate / OpenAI / Google invoices. Adjust
  `image_models` (DB overlay) if any model diverges >20%.

These reflect production rendering. Heavy dev/QA iteration runs higher.
