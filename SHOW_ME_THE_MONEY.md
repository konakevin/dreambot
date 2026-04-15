# Show Me The Money — DreamBot Financial Model

## Per-Dream Generation Costs

### Nightly Dream (auto-generated, user doesn't pay)

| Step | Service | Cost |
|------|---------|------|
| Medium/vibe resolution | DB query | free |
| Dream algorithm roll | Code | free |
| Essence card fetch | DB query (pre-built) | free |
| Scene engine assembly | Code | free |
| buildRenderEntity | Code (regex) | free |
| Sonnet writes Flux prompt | Anthropic Sonnet | ~$0.003-0.005 |
| Flux Dev renders image | Replicate | ~$0.025 |
| Face swap (fires ~50%) | Replicate | ~$0.013 |

- Without face swap: **~$0.028**
- With face swap: **~$0.041**
- **Average nightly dream: ~$0.035**

### User-Created Dream (V2 — costs sparkles)

| Path | Steps | Cost |
|------|-------|------|
| Text + medium + vibe | Sonnet + Flux Dev | ~$0.028 |
| Photo restyle (Kontext Max) | Kontext Max | ~$0.08 |
| Photo restyle (Flux Dev, e.g. LEGO) | Vision + Haiku + Flux Dev | ~$0.036 |
| Self-insert ("put me in...") | Sonnet + Flux Dev + face swap | ~$0.041 |
| Surprise (medium showcase) | Sonnet + Flux Dev | ~$0.028 |

**Weighted average user-created dream: ~$0.045**
(60% text/surprise, 30% photo restyle, 10% self-insert)

### Dream Like This (DLT)

| Step | Cost |
|------|------|
| Sonnet merges style + subject | ~$0.003 |
| Flux Dev renders | ~$0.025 |

**Total DLT: ~$0.028**

### Bot Dreams (daily content, fixed cost)

- 19 image bots × $0.028/day = $0.53/day
- 2 content bots × ~$0.01/day = $0.02/day
- **Total: ~$0.55/day = ~$16.50/month**

Fixed overhead regardless of user count. Keeps the social feed alive with fresh content.

---

## Monetization Model

### User Journey

**Week 1-2: Free Trial (hook them)**
- Nightly dreams every night (14 free nightly dreams)
- 25 free sparkles dripped: 10 on day 1, 10 on day 5, 5 on day 10
- Full access to create, DLT, photo restyle
- Your cost per new user: ~$0.94 (14 nightlies + ~10 user dreams)

**Drip messaging:**
- Day 1: 10 sparkles arrive automatically
- Day 5: "Your DreamBot learned more about you 🌙 Here's 10 more sparkles to dream with"
- Day 10: "4 nights left of free dreams ✨ 5 bonus sparkles to make them count"
- Day 14: "Your free dreams are over — but your DreamBot is still dreaming about you 💭 Subscribe to keep waking up to new dreams"
- Day 16 (if no conversion): "You missed 2 dreams this week 🌙" with blurred preview of what would have generated

**After trial: Free tier (forever)**
- 1 auto-generated dream per week (keeps them engaged, keeps app installed)
- Browse social feed, like, comment, share
- No user-created dreams without sparkles
- Sees ads (rewarded video + native in-feed)
- Cost: ~$0.15/user/month

**Subscriber ($5.99/month or $39.99/year)**
- Nightly dreams every night
- 10 sparkles/month included
- Ad-free experience
- Priority generation
- Cost: ~$1.28/user/month (nightly + sparkle usage)

**Sparkle packs (available to everyone)**
- Purchasable anytime, no subscription needed
- For users who want to create their own dreams without subscribing

### Sparkle Pack Pricing

At $0.045 average cost per dream, 1 sparkle = 1 dream:

| Pack | Sparkles | Your AI Cost | Price | After Apple (70%) | Real Margin |
|------|----------|-------------|-------|-------------------|-------------|
| Small | 25 | $1.13 | $2.99 | $2.09 | 46% |
| Medium | 50 | $2.25 | $4.99 | $3.49 | 36% |
| Large | 100 | $4.50 | $8.99 | $6.29 | 28% |
| XL | 250 | $11.25 | $19.99 | $13.99 | 20% |

No 500 pack — it's a money loser after Apple's cut at any reasonable price.

### Who Sees Ads

| User Type | Ads? | Ad Types |
|-----------|------|----------|
| Trial (week 1-2) | No | Clean experience during trial |
| Free (post-trial) | Yes | Rewarded video + native in-feed |
| Subscriber | Never | Ad-free is a subscription perk |

### Ad Placements

| Placement | Type | Trigger |
|-----------|------|---------|
| "Earn a sparkle ✨" button on create screen | Rewarded video | User-initiated |
| Every 8th post in social feed | Native in-feed | Passive scrolling |
| After viewing weekly free dream | Interstitial | "Want more? Watch or subscribe" |

**Never:** banner ads (destroy the premium aesthetic).

### Ad Revenue Estimates

Assuming 35% DAU/MAU ratio for free users:

| Metric | Per Free User/Month |
|--------|-------------------|
| In-feed impressions | ~600 (20/day × 30 days × 35% DAU) |
| In-feed revenue at $5 eCPM | ~$0.003/impression = ~$1.06 |
| Rewarded video views | ~9 (30% watch rate × 30 days × 35% DAU) |
| Rewarded video at $20 eCPM | ~$0.18 |
| **Total ad revenue per free user** | **~$1.12/month** |

Each rewarded video earns you ~$0.02 in ad revenue but costs you ~$0.045 in AI (they earn a sparkle). Net cost per rewarded view: ~$0.025. Acceptable because it drives engagement and eventual conversion.

---

## Revenue Projections

### Fixed Monthly Overhead (all scales)

| Expense | Monthly |
|---------|---------|
| Bot dreams (21 bots daily) | $16.50 |
| Supabase Pro | $25-75 |
| Apple Developer ($99/yr) | $8.25 |
| Domain/misc | ~$10 |
| **Total fixed** | **~$60-110** |

### Assumptions

- Subscription conversion: 10% of MAU
- Sparkle buyer conversion: 5% of MAU (non-overlapping with subscribers)
- Average sparkle purchase: $4.99, 1.5x/month
- DAU/MAU ratio: 35% for free users
- Ad eCPM: $5 in-feed, $20 rewarded video

### Projections by Scale

| | 1K MAU | 10K MAU | 100K MAU |
|---|---|---|---|
| **Subscribers** | 100 | 1,000 | 10,000 |
| **Sparkle buyers** | 50 | 500 | 5,000 |
| **Free users** | 850 | 8,500 | 85,000 |
| | | | |
| **Revenue** | | | |
| Subscriptions (after Apple) | $419 | $4,190 | $41,900 |
| Sparkle packs (after Apple) | $87 | $870 | $8,700 |
| Ads (free users) | $954 | $9,540 | $95,400 |
| **Total revenue** | **$1,460** | **$14,600** | **$146,000** |
| | | | |
| **Costs** | | | |
| Subscriber nightly dreams | $105 | $1,050 | $10,500 |
| Subscriber sparkle usage | $23 | $230 | $2,300 |
| Sparkle buyer dream costs | $17 | $170 | $1,700 |
| Free user weekly dreams | $128 | $1,275 | $12,750 |
| Rewarded video sparkle costs | $6 | $60 | $600 |
| Bot dreams | $17 | $17 | $17 |
| Fixed overhead | $75 | $100 | $200 |
| **Total costs** | **$371** | **$2,902** | **$28,067** |
| | | | |
| **Net profit** | **$1,089** | **$11,698** | **$117,933** |
| **Annual profit** | **$13,068** | **$140,376** | **$1,415,196** |
| **Profit margin** | 75% | 80% | 81% |

### Sensitivity: What If Subscription Conversion Changes?

At 100K MAU:

| Sub Rate | Annual Profit |
|----------|--------------|
| 5% | ~$900K |
| 10% | ~$1.4M |
| 15% | ~$1.9M |
| 20% | ~$2.4M |

Every 1% subscription conversion at 100K MAU ≈ **$100K/year**.

### Sensitivity: What If Ad eCPM Changes?

At 100K MAU, 10% sub rate:

| eCPM (in-feed) | Annual Ad Revenue | Annual Profit |
|----------------|-------------------|--------------|
| $3 | $686K | ~$1.1M |
| $5 | $1.14M | ~$1.4M |
| $8 | $1.83M | ~$2.1M |

---

## Key Decisions

1. **2-week free trial** with nightly dreams + 25 dripped sparkles (10/10/5)
2. **Post-trial free tier** with 1 dream/week (retention, not cutoff)
3. **$5.99/month subscription** for nightly dreams + 10 sparkles + ad-free
4. **$39.99/year subscription** option (discount for annual commitment)
5. **Sparkle packs** at $2.99/$4.99/$8.99/$19.99
6. **Ads for free users only** — rewarded video + native in-feed, never banners
7. **Ad-free for subscribers** — part of the value proposition
8. **Launch without ads** — add rewarded video month 2-3, in-feed month 4-6

## Unit Economics Summary

| Metric | Value |
|--------|-------|
| Cost per nightly dream | $0.035 |
| Cost per user-created dream | $0.045 |
| Customer acquisition cost (trial) | $0.94 |
| Revenue per subscriber/month (after Apple) | $4.19 |
| Cost per subscriber/month | $1.28 |
| Profit per subscriber/month | $2.91 |
| Subscriber payback period | ~10 days |
| Ad revenue per free user/month | ~$1.12 |
| Cost per free user/month | ~$0.15 |
| Profit per free user/month (with ads) | ~$0.97 |

**The insight:** with ads, free users are profitable. Without ads, they're a loss leader. The subscription is high-margin. The combination of both makes the business work at every scale.
