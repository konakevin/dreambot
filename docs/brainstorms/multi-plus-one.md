# Multi plus_one feature — brainstorm

**Started:** 2026-04-19 (Kevin + Claude)
**Status:** open — needs decisions on the questions at the bottom before scoping a ship plan

---

## The feature

Allow users to upload more than one plus_one (up to 5 total), so nightly dreams have more cast variety. Each plus_one has their own photo, description, display name, and relationship type. When the nightly cast roll lands on "plus_one," pick randomly (with recency filter) from the user's roster. Same idea for V4 ("put me with Sarah" vs "put me with my brother").

## Why it's worth doing

- More cast = more personalization = stickier users
- Each plus_one unlocks a new tone of dream (wife romantic, friend playful, parent familial, child warm)
- Natural monetization lever (free 1 plus_one, paid for more)
- Doesn't require rebuilding the engine — the relationship tone system (Fix 7) already handles the range

---

## Part 1 — NSFW validation on upload

### Current state

- Photo upload on onboarding/settings → Llama/Haiku vision describe → save description + thumb
- Vision model has built-in safety — will refuse NSFW images
- We likely **fail silently** (no clean error path shown to user) when vision refuses
- `lib/moderation.ts` is wordlist text-only — no image NSFW check
- `classify-photo` Edge Function classifies subject type but doesn't explicitly gate NSFW

### Proposal

Extend `classify-photo` (or add a dedicated pre-upload check) with an explicit `is_nsfw: boolean` in the response.

**On NSFW detected:**
- Do NOT save the thumb to storage
- Do NOT generate a text description
- Return a friendly error to the client ("This photo can't be used — please upload a different one")

**Cheap implementation:** one extra line in the classify prompt asking for NSFW tag + parse it out. No new API call.

### Open questions

- Do we check moderating BOTH for sexual content AND violence/gore/weapons? The latter would matter if someone uploads a photo with, say, a gun.
- Does the onboarding flow already use `classify-photo`? If not, we need to wire it in.
- What's the error UX — alert + photo reset, or inline red message?

---

## Part 2 — UX for the cast roster

### Approach: "Add another" button (preferred over progressive auto-reveal)

Familiar pattern (iOS contacts, Airbnb guests, Notion rows). Doesn't surprise users with auto-appearing rows. Lets users stop at 2 without confusion.

### Suggested layout for `DreamCastStep` + Settings

```
┌─ Your Cast ────────────────────────┐
│  [📷] You (self)            [Edit] │  ← always first
│                                     │
│  [📷] Sarah, Wife          [Edit✎] │  ← first plus_one filled
│  [📷] Mike, Best Friend    [Edit✎] │  ← optional extras
│                                     │
│  + Add another (2 of 5 filled)     │  ← button (hidden when cap hit)
└─────────────────────────────────────┘
```

### Per-row display

- Thumbnail (48×48)
- Display name ("Sarah")
- Relationship subtitle ("Wife" / "Best Friend" / "Mom")
- Edit icon → opens an edit sheet (photo + relationship + name)
- Delete → swipe OR inside the edit sheet. Confirmation prompt: "Remove Sarah from your cast?" (losing someone they uploaded is emotional — worth the confirm)

### Per-person form fields

- **Photo** — required
- **Display name** — **required** (need it to distinguish Sarah from Mike)
- **Relationship** — probably required for tone routing to work; default dropdown (significant_other/friend/sibling/parent/child/grandchild) + maybe an "other" bucket

### Ordering

- Self always first (not draggable)
- Plus_ones in order-of-add (simple)
- Future: drag-to-reorder is nice-to-have but not MVP

---

## Part 3 — Free vs paid gating

### Option A — Sparkle unlock (one-time, per-slot) — **recommended to start**

Buy each slot with sparkles. Permanent unlock.

Pricing instinct (sparkles @ ~$0.12 each at cheap pack):
- Slot 2 (1st extra plus_one): **25 sparkles** (~$3) — low barrier, converts quickly
- Slot 3: **50 sparkles** (~$6)
- Slot 4: **75 sparkles** (~$9)
- Slot 5: **100 sparkles** (~$12)

Total to go from 1 → 5: 250 sparkles (~$30). Rising-price curve rewards committed users without overpricing the entry.

**Pros:**
- Fits existing sparkle economy (uses `spend_sparkles` RPC, no new infra)
- Incremental commitment — user can stop at 2
- Reversible mental model (feels like unlocks, not subscriptions)
- No recurring billing to manage

**Cons:**
- Not recurring revenue
- Users who unlock all 5 early have nothing more to buy in this feature
- Revenue per user caps at ~$30

### Option B — Subscription tier

"Upgrade to DreamBot+" for $X/mo. Unlocks all 4 extra slots + other perks (priority generation, exclusive styles, higher daily cap, etc.).

**Pros:**
- Recurring revenue (predictable)
- Bundles cleanly with other premium perks
- Stickier (canceling means losing access to cast members, perks)

**Cons:**
- Subscription infra (RevenueCat integration, cancellation flow, grace period on downgrade)
- Higher friction ("$X/month forever" vs "$6 one-time")
- If we downgrade someone, what happens to their existing plus_ones beyond slot 1?

### Recommendation

Start with **Option A (sparkle unlock)**. Simpler, incremental, fits existing UX. If adoption is strong and users want even more perks, add a subscription tier later that bundles slots + other premium features. Subscription-first is harder to undo.

---

## Part 4 — Open questions

1. **Pets vs plus_ones:** pets were removed from cast earlier. If multi-plus_one lands, does "pet" come back as its own role (probably cleaner), or fold pets into plus_one with `relationship: 'pet'` (awkward)?
2. **Face-swap limitation:** Replicate's face-swap model is 1:1 today. Multi-cast face-swap scenes ("me + wife in photography") would require sequential swaps (slow) or a model change. For MVP, multi-cast scenes = non-face-swap mediums only.
3. **Edit-after-onboarding:** Settings screen needs the same roster UI. One reusable component, probably `CastRosterEditor`.
4. **Feed display:** when a dream features "Mike + you," does the reveal screen say "featuring Mike"? Small but matters for the payoff moment — without it, users may not realize why their friend is in a dream.
5. **Relationship tone edge case:** self + plus_one(significant_other) + plus_one(friend) → current Fix 7 defaults to playful (platonic wins). Is that right? Or should the romantic tone still apply if the SO is there and Flux can render 3 characters?
6. **Force-pick flow for V4:** "put me with Sarah" — how does the client detect which plus_one the user means? Name matching seems like the answer, but needs UX for ambiguity ("did you mean Sarah your sister or Sarah your coworker?").
7. **Account state:** what happens to a user's 4 extra plus_ones if they somehow go back to "free tier"? Currently not applicable (sparkle unlocks are permanent), but worth defining.
8. **Default photo validation:** some users upload photos of kids — should that be flagged or allowed as-is? (NSFW check likely catches actual NSFW, but minors in photos is its own question.)
9. **Cast limit for bots:** bots have their own "about" content. Does any of this touch them? Probably not — bots are a different system.
10. **Rate-limit abuse:** if upload is cheap, what prevents someone from spamming 50 upload attempts to fill a slot with 1 photo? Probably rate-limit the upload+classify endpoint per user per minute.

---

## Phasing (revised when scope solidifies)

- **Phase 1 — Data model & server** (~4-6h): allow multi plus_one in `dream_cast[]`, add `display_name`, add recency filter on plus_one sub-pick, update rollDream / castResolver
- **Phase 2 — Client UX** (~6-10h): DreamCastStep + Settings reusable component, add/edit/delete flows, name + relationship + photo
- **Phase 3 — Sparkle gating** (~2-4h): slot unlock UI, `spend_sparkles` integration, limit check in server endpoints
- **Phase 4 — NSFW validation** (~2-3h): extend classify-photo or dedicated check, wire into upload flow, error UX
- **Phase 5 — V4 self-insert by name** (~3-5h): detect "my wife" / "Sarah" in user prompts, map to the right plus_one, default to random if ambiguous
- **Phase 6 — Validation** (~2h): 20-night sim with 5 plus_ones, feed display check, edit/delete regression

**Total effort estimate:** 20-30 hours of engineering work spread across server + client + UX.

---

## Decisions needed before Phase 1 starts

- [ ] Sparkle unlock pricing (25/50/75/100 or different curve?)
- [ ] Pets as separate role vs folded
- [ ] Relationship field required or optional
- [ ] Display name required or optional (strongly leaning required)
- [ ] NSFW check extends classify-photo vs dedicated endpoint
- [ ] Face-swap multi-cast handling (single swap per render vs sequential vs punt)
- [ ] Edit-after-onboarding scope (basic edit/delete vs full drag-to-reorder)
