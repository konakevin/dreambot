# Sparkle Pricing & Monetization Strategy

How to think about pricing, unit economics, and profit projections for DreamBot's sparkle packs + free-trial-then-pay model. Last updated 2026-05-02.

This is the **business model** doc — for IAP/RevenueCat technical wiring see `SPARKLE_PAYMENTS_SETUP.md`.

---

## TL;DR

- **Cost per dream:** ~$0.045 marginal at scale, ~$0.06-0.08 fully-loaded pre-scale (includes Replicate + Anthropic + Supabase storage + amortized fixed costs).
- **Apple's cut:** 30% standard, **15% if enrolled in Small Business Program** (auto-qualify if under $1M annual proceeds — enroll before launch).
- **Pricing should target ~50% net margin** at current cost levels, designed to compound as scale lowers per-dream cost.
- **Free nightly dream is a trial perk, not a permanent free tier** (2-4 weeks per new user). After trial, users must pay (sparkles or subscription) to keep getting personal nightly dreams. The bot feed remains free forever.
- **Trial-and-pay model wins:** at 50K MAU it nets ~$156K/year. At 100K MAU, ~$313K/year. At 500K MAU (Apple Small-Business cap exceeded), ~$1.19M/year.

---

## Cost Stack — what every dream actually costs you

### Variable per dream (~$0.045)

| Service | Cost | Notes |
|---|---|---|
| Replicate (Flux Dev / 1.1 Pro) | $0.025-0.030 | Core text-to-image generation |
| Replicate (face-swap, when applicable) | +$0.013 | ~30% of dreams have face-swap |
| Anthropic Sonnet (concept generation) | $0.003-0.006 | Pass 1 of two-pass engine |
| Anthropic Haiku (prompt polish) | $0.001-0.002 | Pass 2 of two-pass engine |
| Anthropic Haiku (bot message) | $0.001 | Whimsical message per dream |
| Supabase storage egress | $0.001-0.002 | Image bytes served to clients |
| **Variable subtotal** | **~$0.04-0.05** | Use **$0.045** as planning number |

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

### Subscriptions are different

For subscription products (not relevant if you're sparkles-only):
- Year 1 of customer's subscription: 30%
- Year 2+ of same customer's subscription: 15% automatically
- Small Business Program drops Year 1 to 15% as well

---

## Pricing Tiers — Recommended

### Targets

- **At 15% Apple cut + $0.06/dream cost:** target 40-65% margin per pack
- **Per-sparkle gross price tiers DOWN as packs get bigger** (incentivize larger purchases without bleeding margin)
- **Margin floor: 25%** so a 20% cost spike doesn't go negative

### Recommended packs (assumes 15% Small Business cut)

| Pack | Sparkles | Price | Net (×0.85) | Cost @ $0.06 | Profit | Margin % | $/sparkle gross |
|---|---|---|---|---|---|---|---|
| **Impulse** | 12 | $1.99 | $1.69 | $0.72 | **+$0.97** | 57% | $0.166 |
| **Starter** | 30 | $4.99 | $4.24 | $1.80 | **+$2.44** | 58% | $0.166 |
| **Popular** | 75 | $9.99 | $8.49 | $4.50 | **+$3.99** | 47% | $0.133 |
| **Value** | 175 | $19.99 | $16.99 | $10.50 | **+$6.49** | 38% | $0.114 |
| **Whale** | 450 | $49.99 | $42.49 | $27.00 | **+$15.49** | 36% | $0.111 |

**Gross-per-sparkle waterfall:** $0.17 → $0.17 → $0.13 → $0.11 → $0.11 — bigger packs = better deal for users without giving up margin.

### Pricing if you DON'T enroll in Small Business (30% Apple cut)

| Pack | Sparkles | Price | Net (×0.70) | Cost @ $0.06 | Profit | Margin % |
|---|---|---|---|---|---|---|
| Impulse | 10 | $1.99 | $1.39 | $0.60 | +$0.79 | 57% |
| Starter | 25 | $4.99 | $3.49 | $1.50 | +$1.99 | 57% |
| Popular | 60 | $9.99 | $6.99 | $3.60 | +$3.39 | 49% |
| Value | 130 | $19.99 | $13.99 | $7.80 | +$6.19 | 44% |
| Whale | 350 | $49.99 | $34.99 | $21.00 | +$13.99 | 40% |

You give fewer sparkles per pack at the 30% rate to maintain margin. **Enrolling in Small Business is roughly equivalent to giving users 25-30% more sparkles for the same price** — meaningful product advantage.

### Margin behavior as scale lowers cost

Same pack prices, lower marginal cost. At $0.045/dream (10K+/month volume):

| Pack | Margin @ $0.06 (now) | Margin @ $0.045 (at scale) |
|---|---|---|
| 12 / $1.99 | $0.97 (57%) | $1.15 (68%) |
| 30 / $4.99 | $2.44 (58%) | $2.89 (68%) |
| 75 / $9.99 | $3.99 (47%) | $5.12 (60%) |
| 175 / $19.99 | $6.49 (38%) | $9.12 (54%) |
| 450 / $49.99 | $15.49 (36%) | $22.24 (52%) |

**Set prices once, watch margins compound as volume grows.**

### Killed packs (mathematically impossible to profit at current cost)

- **Old: 100 / $7.99** — barely profitable at 30% Apple cut. Lift to $9.99 OR shrink to 75 sparkles.
- **Old: 500 / $24.99** — **lost $7.50 per sale at 30% Apple cut**. The $24.99 price point can't fit 500 sparkles profitably under any cost model. New whale tier is $49.99 / 450.

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

## Reference Numbers (May 2026)

- Anthropic spend last 5 weeks: **$359.54** (~$10/day average)
- Replicate spend last 5 weeks: **$395.42** (paid in credit purchases)
- Total AI spend: **$754.96**
- Posts in database: **8,787** (as of 2026-05-02)
- Effective fully-loaded cost per dream: **$0.085** (includes heavy QA/dev burn)
- Steady-state marginal cost: **$0.045** (no QA churn, no seed-pool generation)
- Recommended planning cost: **$0.06** (conservative pre-scale)

These numbers reflect heavy development iteration. Steady-state production-only operation will be cheaper.
