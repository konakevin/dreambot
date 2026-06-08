# Show Me The Money — DreamBot Financial Model

**Last refreshed: 2026-06-08.** Numbers reconciled against the live code
(`constants/sparklePacks.ts`, `constants/proPlan.ts`,
`supabase/functions/_shared/modelPricing.ts`) and independently verified
provider pricing (Replicate / OpenAI / Google). Companion doc:
`SPARKLE_PRICING_STRATEGY.md` (strategy + scaling). For per-pack margin tables
see that doc; this one is the operating P&L model.

> ⚠️ **What changed in this refresh:** the prior version assumed a $5.99 sub,
> 10 sparkles/mo, old packs (25/50/100/250), a permanent free *weekly* dream,
> and — most importantly — a **rewarded-video + in-feed ad business that does
> not exist** (no ad SDK is installed). Removing the phantom ad revenue is the
> single biggest correction: free users are a (small) cost, not a profit
> center. The model below reflects reality: **IAP sparkles + Pro subscription
> only.**

---

## 1. What every render actually costs us (validated 2026-06-08)

Per-image API cost at the resolutions/qualities we actually render (Replicate
defaults ~1MP; OpenAI medium/1024×1536; Gemini Pro pinned to 1K). These match
`modelPricing.ts` and were re-verified against live provider pricing.

| Model | Sparkles charged | API cost/img |
|---|---|---|
| Flux Schnell | 1 | $0.003 |
| Flux Krea | 1 | ~$0.004 |
| Flux 2 Dev | 1 | $0.025 |
| Flux 1 Dev | 1 | $0.030 |
| Flux 2 Pro | 1 | $0.031 |
| Nano Banana (Gemini 2.5 Flash) | 1 | $0.039 |
| **Flux 1.1 Pro (default)** | **1** | **$0.040** |
| Flux 1.1 Pro Ultra | 2 | $0.060 |
| GPT Image 2 | 2 | $0.060 |
| Flux 2 Flex | 2 | $0.063 |
| GPT Image 1 (deprecating Oct '26) | 3 | $0.070 |
| Flux 2 Max | 3 | $0.073 |
| Nano Banana Pro (Gemini 3 Pro) | 5 | $0.134 |

**Pipeline adders (on top of model cost):** Sonnet brief ~$0.004–0.006; face
swap +$0.013 (fires on ~30% of dreams → ~$0.004 amortized); on-demand HD
upscale +$0.008–0.03 (Pro only, capped 100/mo). All-in a typical user render ≈
**model + ~$0.006**.

### Cost per dream by path

| Path | Typical model | All-in cost |
|---|---|---|
| Nightly dream (auto) | Flux 2 Dev + brief, ~30% face swap | **~$0.035** |
| User text dream | Flux 1.1 Pro (default) + brief | **~$0.046** |
| User "put me in" (face swap) | Flux + brief + swap | **~$0.058** |
| DLT (Dream Like This) | Flux 2 Dev + brief | **~$0.031** |
| Photo restyle (Kontext) | Kontext Pro/Max | **~$0.046–0.056** |

**Planning numbers:** nightly **$0.035**, user-created **$0.045**.

### The 1-sparkle margin spread (important)

The 1-sparkle tier covers a **15× cost range** — Flux Schnell ($0.003) to the
default Flux 1.1 Pro ($0.040) / Nano Banana ($0.039), all charged the same 1
sparkle. So **worst-case cost per sparkle ≈ $0.046** (default model + pipeline).
Higher tiers are *more* efficient per sparkle (Nano Banana Pro: $0.134 / 5 =
$0.027/sparkle). Use **$0.046/sparkle worst-case, ~$0.03 blended** for planning.

---

## 2. What we charge

### Sparkle packs (`sparkle_packs` table, migration 255)

| Pack | Sparkles | Price | $/sparkle | Net @15% | Net @30% |
|---|---|---|---|---|---|
| Impulse | 15 | $1.99 | $0.133 | $0.113 | $0.093 |
| Starter | 40 | $4.99 | $0.125 | $0.106 | $0.087 |
| Popular | 90 | $9.99 | $0.111 | $0.094 | $0.078 |
| Best Value | 200 | $19.99 | $0.100 | $0.085 | $0.070 |
| Whale | 500 | $49.99 | $0.100 | $0.085 | $0.070 |

**Worst-case pack margins** (every sparkle spent on the $0.046 default model):
46–59% @15%, 34–50% @30%. Typical usage is better. All tiers profitable under
every cost/cut combination.

### Pro subscription (`proPlan.ts`)

| Plan | Price | Eff./mo | Sparkles | Other perks |
|---|---|---|---|---|
| Monthly | $9.99/mo | $9.99 | 75/mo | 30 nightly dreams, 100 HD downloads/mo, 14-day trial |
| Yearly | $79.99/yr | $6.67 | 900 upfront | same |

**Cost to serve a Pro user/month:**

| Scenario | Nightly (30×$0.035) | Sparkles spent | HD | **Total** |
|---|---|---|---|---|
| Typical | $1.05 | ~50 × $0.04 = $2.00 | $0.20 | **~$3.25** |
| Maxed | $1.05 | 75 × $0.046 = $3.45 | ~$2.00 | **~$6.50** |

| Plan / cut | Net rev/mo | Typical profit | Maxed profit |
|---|---|---|---|
| Monthly @15% | $8.49 | **+$5.24** | +$1.99 |
| Monthly @30% | $6.99 | **+$3.74** | +$0.49 |
| Yearly @15% | $5.67 | **+$2.42** | −$0.83 |
| Yearly @30% | $4.67 | **+$1.42** | **−$1.83** |

⚠️ **Yearly Pro is the thin SKU** — a maxed yearly power-user at 30% loses
~$1–2/mo. Mitigated by: most users don't max, the 100-HD cap, and ~2% Apple
refund rate. The 100-HD cap (`PRO_HQ_DOWNLOADS_PER_MONTH`) is load-bearing.

---

## 3. Operating model — 10,000 MAU (5% sparkle buyers + 3% Pro)

The scenario you asked to model. Stated assumptions so it's auditable.

### Assumptions

- **10,000 MAU**
- **3% Pro = 300 users** (blend 70% monthly @ $9.99 + 30% yearly @ $6.67/mo →
  **$8.99/mo blended gross** per Pro user)
- **5% sparkle buyers = 500 users** (non-overlapping with Pro). **$7.50/mo
  blended gross** per buyer (mix of packs, not every buyer every month)
- **92% = 9,200 free users** (post-trial: browse feed + bots; **no** nightly
  dreams, **no** ads)
- **1,000 new trials/mo** (10% of MAU — sustains the base against churn). Each:
  14-day Pro trial (nightly + 25 welcome sparkles + free first dream)
- Apple **15%** primary (Small Business Program); 30% shown as sensitivity

### Monthly revenue

| Source | Gross | Net @15% | Net @30% |
|---|---|---|---|
| Pro (300 × $8.99) | $2,697 | $2,292 | $1,888 |
| Sparkles (500 × $7.50) | $3,750 | $3,188 | $2,625 |
| **Total net revenue** | | **$5,480** | **$4,513** |

### Monthly costs

| Cost | Calc | Monthly |
|---|---|---|
| Pro serving | 300 × $3.25 | $975 |
| Sparkle-buyer serving | 500 × ~$2.72 | $1,360 |
| Free users (storage egress) | 9,200 × ~$0.02 | $184 |
| Acquisition (trials) | 1,000 × ~$1.53 | $1,530 |
| Bot content | 18 bots × 4/day × $0.028 | $60 |
| Fixed infra (Supabase + misc) | — | $100 |
| **Total costs** | | **$4,209** |

### Net profit @ 10K MAU

| Apple cut | Net revenue | Costs | **Profit/mo** | **Annual** | Margin |
|---|---|---|---|---|---|
| **15%** | $5,480 | $4,209 | **+$1,271** | **~$15.3K** | 23% |
| **30%** | $4,513 | $4,209 | **+$304** | **~$3.6K** | 7% |

**Read:** profitable, but **thin** at 10K MAU on this conversion mix — and
**near break-even at the 30% rate.** The dominant variable cost is
**acquisition** (the free 14-day Pro trial + 25 welcome sparkles), not serving.
This is the honest picture once the phantom ad revenue is removed.

### Per-paying-user contribution margin (the number that scales)

| User | Net @15% − cost | Net @30% − cost |
|---|---|---|
| Pro (blended) | $7.64 − $3.25 = **+$4.39/mo** | $6.29 − $3.25 = +$3.04 |
| Sparkle buyer | $6.38 − $2.72 = **+$3.66/mo** | $5.25 − $2.72 = +$2.53 |

Each paying user nets ~$3.5–4.4/mo @15%. Fixed + bot costs are flat, so
**profit scales faster than MAU above ~10K** — the thinness here is a
small-base + acquisition-drag effect, not a broken unit economic.

---

## 4. Sensitivity — what moves the needle at 10K MAU

| Lever | Change | Profit impact (@15%) |
|---|---|---|
| Pro conversion 3% → 5% | +200 Pro | +$878/mo |
| Sparkle buyers 5% → 8% | +300 buyers | +$1,098/mo |
| Apple 30% → 15% (enroll) | rate | +$967/mo |
| Default model → Flux 2 Dev ($0.025) | −$0.015/sparkle | +$300–500/mo |
| Add rewarded-video ads to free tier | new line | +$1–3K/mo (requires building it) |

The two biggest *free* levers: **enroll in Small Business (15%)** and **make
the default model cheaper** (Flux 1.1 Pro is the worst cost/sparkle you sell).

---

## 5. Unit economics summary

| Metric | Value |
|---|---|
| Cost per nightly dream | $0.035 |
| Cost per user-created dream | ~$0.045 |
| Worst-case cost per sparkle | $0.046 |
| Blended cost per sparkle | ~$0.03 |
| Trial CAC (14-day Pro trial) | ~$1.53 |
| Pro contribution margin @15% | ~$4.39/mo |
| Sparkle-buyer contribution @15% | ~$3.66/mo |
| Pack margins (worst case) @15% / @30% | 46–59% / 34–50% |
| Free-user cost (no ads) | ~$0.02/mo |

**The insight:** with no ads, the business is **paid-conversion-driven**, not
ad-driven. Profit at any scale is `(paying users × ~$4 contribution) − (trial
CAC + flat costs)`. Levers that matter, in order: **conversion rate**, **Apple
cut (enroll in Small Business)**, **default model cost**, **trial generosity**.
Free users are cheap to keep but contribute nothing until ads exist or they
convert.
