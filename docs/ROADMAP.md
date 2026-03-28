# Product Roadmap Ideas — Social & Dopamine Loop

*Captured 2026-03-28 after building the streak system, milestone celebrations, and friends feed.*

## TL;DR

This doc contains 11 feature ideas, a competitive analysis, and a prioritized roadmap for making Rad or Bad's social layer stronger.

**Features:** Richer match/mismatch celebrations, post-vote friend reveal in the Everyone feed, head-to-head vote comparison view, friend discovery & invite flow, category-specific streaks & taste profiles, streak notifications, live vote activity feed, viral challenge deep links, weekly taste reports, streak break FOMO notifications, and vote similarity discovery.

**Competitive landscape:** No existing app combines public content voting + friend vote comparison + streak gamification. Hot or Not, Gas, BeReal, TikTok, and Hinge each have pieces but none have the full loop.

**Two critical gaps:** Cold start (social features are invisible without friends) and content supply (empty feeds kill retention).

**Core insight:** The app doesn't need more features — it needs the existing social moments to be louder and more shareable. Moments that make you want to text a friend are what drive growth.

**Priority:** Tier 1 (ship first) = friend reveal in Everyone feed, richer celebrations, viral invite flow. Tier 2 (social depth) = friend discovery, head-to-head view, weekly taste report. Tier 3 (polish) = category streaks, FOMO notifications, live activity.

---

## Background

The app's core loop is strong: upload photos, strangers swipe Rad/Bad, scores computed, users ranked. The milestone celebration system (confetti, gold number punch, twinkle stars) adds surprise dopamine hits at vote thresholds. The streak system creates a reason to care about friends' votes.

The gap: the social layer exists but requires intentional discovery. Users need to know about Streak mode, switch to it, and already have mutual follows. The bridge between "vote on stuff from strangers" and "compare with friends" should be seamless, not tab-dependent.

---

## Ideas

### 1. Richer Streak Match/Mismatch Celebrations

**Why:** The moment you find out you matched (or didn't) with a friend is THE dopamine hit of the social feature. Right now it's text-only in the footer. That moment deserves the same energy as the milestone celebration.

**How:**
- **Match**: Celebration animation on the card — friend's avatar flies in, both avatars connect with a lightning bolt or high-five visual, confetti burst, "Streak +1!" with the friend's name
- **Mismatch**: Funny/playful animation — screen crack effect, sad trombone haptic pattern, streak counter breaking apart. Should feel comedic, not punishing. "You and @sarah couldn't be more different" type energy
- Scale the celebration intensity with streak length — a 2-streak match is a small flash, a 10-streak match is a full party

### 2. Post-Vote Friend Reveal (Everyone Feed)

**Why:** This is the biggest lever for connecting the two halves of the app. Users voting in the Everyone feed don't see the social dimension at all. Revealing friend activity after voting ties discovery to social comparison without requiring a tab switch.

**How:**
- After voting on any post in the Everyone feed, if mutual follows also voted on it, show a brief reveal: "3 friends also voted on this" with tiny avatars
- Tapping it could show who matched and who didn't (only revealed after you vote, so it doesn't influence your choice)
- This turns every vote into a potential social moment, not just the Streak feed
- Implementation: the main `get_feed` RPC could optionally return friend vote counts, or a lightweight client-side check post-vote

### 3. Head-to-Head Comparison View

**Why:** The streaks tab shows numbers but doesn't tell a story. The fun isn't "streak: 7" — it's "we agree on food but disagree on art." A visual comparison is the "have a good time comparing votes" moment.

**How:**
- Tap a friend on the streaks tab to open a head-to-head view
- Shows a scrollable list of every post you both voted on
- Each post shows both votes side by side — matching votes highlighted in green/gold, mismatches in red/purple
- Category breakdown at the top: "You agree 80% on animals, 30% on art"
- Could show "taste compatibility" percentage as the hero stat
- Data source: query votes table joined on both user IDs + upload, grouped by category. Computed on-read, cached.

### 4. Friend Discovery & Invite Flow

**Why:** If someone downloads this alone, the social features are dead. The entire streak + friends feed system only works if you have mutual follows. This is the critical path to making the social layer function.

**How:**
- **Contact sync**: "Find friends" that checks phone contacts against registered emails/usernames
- **Share link**: "Challenge a friend" — deep link that opens the app to a specific post with "Your friend wants you to vote on this"
- **Suggested follows**: Based on vote similarity — "Users who vote like you" surfaced after the caught-up state or on the profile
- **Post-signup prompt**: After creating an account, prompt to follow people or invite friends before entering the main feed

### 5. Category-Specific Streaks & Taste Profiles

**Why:** "You and @sarah agree on food but disagree on art" is more interesting than a flat streak number. It adds personality and gives users something to talk about.

**How:**
- Track streaks per-category per-pair (extension of `vote_streaks` table with a category column)
- Display on the head-to-head view as a radar chart or category breakdown
- Could feed into a "taste profile" on the user's own profile: "Your strongest taste: Animals (92% agreement with friends)"
- The cron job would need a slight extension to group by category when computing streaks

### 6. Streak Notifications

**Why:** Streaks create FOMO. "Your 12-streak with @sarah is about to expire!" (if neither votes for X days) is a powerful re-engagement hook. Also: "You matched with @mike! Streak is now 5!" brings people back.

**How:**
- Push notifications via Expo push tokens
- Triggered by the streak cron job: if a streak hasn't been updated in 48 hours and both users have been active, send a nudge
- Match notifications sent immediately (or via the cron) when a new streak increment is detected
- User preference to opt out in settings

### 7. Live Vote Activity Feed

**Why:** Seeing real-time activity ("@sarah just voted rad on a post in Animals") creates a sense of liveness and social presence. It makes the app feel active even when you're not voting.

**How:**
- Supabase Realtime subscription on the votes table, filtered to mutual follows
- Small activity ticker at the top of the Friends feed or as a notification dot
- Doesn't reveal how they voted — just that they're active, which prompts you to go vote too
- Lightweight: Supabase Realtime is already in the stack, just not used yet

### 8. Viral Challenge / Invite Flow

**Why:** Every streak is a potential invite. This is the primary growth mechanic.

**How:**
- "Challenge a friend" deep link that opens to a specific post: "Your friend wants you to vote on this"
- After voting, reveal if you matched — instant social moment even for new users
- Share via native share sheet (iMessage, WhatsApp, etc.)

### 9. Weekly Taste Report

**Why:** Gives a reason to come back even during low-activity periods. Shareable and screenshottable — free marketing.

**How:**
- Push notification: "Your weekly taste report is ready"
- "You agreed with friends 73% this week. Your most controversial vote was [photo]. You and @sarah are 89% taste twins."
- Rendered as a shareable card/image

### 10. Streak Break FOMO Notifications

**Why:** The highest-leverage re-engagement tool. FOMO drives action.

**How:**
- "@sarah just broke your 12-streak!" — triggers immediate action
- "Your streak with @mike expires in 24 hours" — creates urgency
- Requires push notification infrastructure (Expo push tokens)

### 11. Vote Similarity Discovery

**Why:** Bridges the cold start gap without requiring contact sync. Creates social connections for solo users.

**How:**
- "Users who vote like you" feed or suggested follows
- Could surface after the caught-up state: "While you wait — people who think like you"
- Computed from vote overlap on shared posts, cached periodically

---

## Competitive Landscape

### What Exists
- **Hot or Not / Photofeeler** — binary voting, zero social layer. Vote and leave.
- **Gas** — social dopamine via anonymous compliments. Similar energy, different mechanic. Acquired by Discord.
- **BeReal** — friends-only content, social comparison angle. No voting, no gamification.
- **TikTok** — algorithmic discovery, passive consumption. No binary judgment or friend comparison.
- **Hinge/Tinder** — swipe mechanics on people, not content.

### What's Genuinely Unique About Rad or Bad
The combination of *public content voting + friend vote comparison + streak gamification* doesn't exist anywhere. Each piece exists separately but the loop — discover stranger content, vote, find out friends voted too, build streaks, compete — is novel. The three-feed structure (Everyone/Following/Streak) gives users three distinct engagement modes from one core mechanic.

### Critical Gaps

**1. Cold Start Problem**
If someone downloads with zero friends, the social features (streaks, match reveals, friends feed) are invisible. Those are the differentiators. Solutions: viral invite mechanic, algorithmic suggested friends, or enough content volume that the Everyone feed alone is worth daily opens.

**2. Content Supply**
The app is only as good as what's in the feed. Empty or mediocre feeds kill retention. Solutions: creator partnerships, the "must rate 10 to see your score" gate (already built), category-specific content challenges.

### The Core Insight

The app doesn't need more features. It needs the existing social moments to be **louder and more shareable**. The streak match reveal, the head-to-head comparison, the "you both voted rad!" moment — those are screenshot-worthy, text-your-friend moments. The more visible and frequent those are, the more the app markets itself through social proof.

Mechanics don't draw people in. *Moments that make you want to text a friend* do.

---

## Priority Recommendation

**Tier 1 — Ship These First:**
1. **Post-Vote Friend Reveal in Everyone feed** (#2) — ties both halves together, zero tab switching
2. **Richer Match/Mismatch Celebrations** (#1) — makes streaks feel rewarding
3. **Viral Challenge/Invite Flow** (#8) — the growth engine

**Tier 2 — Build the Social Depth:**
4. **Friend Discovery / Vote Similarity** (#4, #11) — solves cold start
5. **Head-to-Head Comparison View** (#3) — deepens engagement
6. **Weekly Taste Report** (#9) — retention + shareability

**Tier 3 — Polish & Re-engagement:**
7. **Category Streaks & Taste Profiles** (#5) — adds personality
8. **Streak Break Notifications** (#6, #10) — FOMO-driven re-engagement
9. **Live Activity Feed** (#7) — social presence
