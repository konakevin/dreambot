# Dream Off — Master Plan

**Status:** Design spec (2026-07-25; **all product decisions locked 2026-07-26 — see §10**). Synthesized
from 7 parallel research workstreams (room UX, DreamBot voice, backend schema, economy/fairness, image
lifecycle, invite/deep-links, + a shelved bots workstream). Not yet built. This is the canonical, buildable
reference; per-workstream deep-dives live in the session scratchpad.

**Scope for v1 (locked with Kevin):** an **async**, **bot-free**, **2-to-N-player** social party game.
Owner creates a Dream Off, picks a funny topic, invites **N ≥ 1** friends via a shareable link, everyone
writes an AI-image prompt and generates a **blind entry**, then everyone **blind-votes** (2 roses), and
DreamBot reveals a **winner + superlatives** in a permanent, shareable **archive**.

**Naming normalization:** all tables/RPCs use the `dream_off_*` prefix (the research used mixed
`games`/`dream_off_*` names; this doc standardizes on `dream_off_*`).

---

## 1. The concept and core loop

A Dream Off is one topic, N players, one blind image each, one vote, one reveal.

```
SETUP  →  SUBMISSION  →  VOTING  →  RESULTS  →  ARCHIVE (permanent)
                                      └ + CANCELLED / NO_CONTEST terminal branches
```

It is **fully async** — players come and go over hours/days, almost never present at once. A render takes
~20s but people check back ~20h later, so there is **no live presence**. Every phase advances on the
**first of**: (a) everyone's done, (b) the owner taps advance, (c) a deadline expires (default 24h,
`engine_config`-tunable). The game **always resolves and never rots**, and resolves cleanly on **partial
turnout** (need ≥2 entries to hold a vote).

**Why it fits DreamBot:** AI renders are a comedy generator by default; the topic manufactures divergence
(five people → five wildly different images); DreamBot is the irreverent MC. It's pure joy, inherently
shareable, and the invite link is a viral acquisition loop.

---

## 2. The Room (UX)

**First principle:** the Room is a **persistent, addressable screen = "ground zero"** for one game. It is a
**cold-open state machine**, not a live session. On *every* open (people land after long gaps) one
authoritative server read yields `(phase, myStatus, counts, deadline, recentActivity, roster)`, and the
screen is deterministic from there. It always answers three questions:

1. **"What do I do now?"** — exactly ONE full-width primary CTA, its verb a pure function of
   `(phase, myStatus)`. If there's nothing to do, the slot shows a calm status line ("Waiting on 2 · voting
   ends in 9h"), never a dead button.
2. **"What's happened?"** — a reverse-chron activity readout (joined / submitted / voted / advanced),
   each `actor + verb + timeAgo`. Rows newer than your `last_room_view_at` get a "New" pip.
3. **"Who's here?"** — a roster strip with **async** status (In / Not-yet + relative timestamp, **never**
   live presence).

After results it **freezes into a permanent Archive**, revisitable forever.

**Common chrome:** pinned top bar (topic as gradient title + `⋯` menu) · a phase ribbon
(SETUP·SUBMISSION·VOTING·RESULTS·ARCHIVE) · a live **deadline countdown chip** (the async pressure valve) ·
the topic rendered large · a **DreamBot MC line** keyed to phase.

### State → UI

| Phase | Viewer | Primary CTA | MC anchor |
|---|---|---|---|
| SETUP | owner | `Start Dream Off` (gated: topic + ≥1 invitee) | "What are we tormenting your friends with?" |
| SUBMISSION | not submitted | `Write your entry →` | "Everyone's writing blind." |
| SUBMISSION | submitted | (owner) `Advance to voting` else `Nudge who's left` | "Locked in. We wait on stragglers." |
| VOTING | member, not voted | `Submit votes` (2 roses) | "You've got 2 roses. No mercy." |
| VOTING | member, voted | (owner) `Reveal results` else status line | "Now we wait." |
| VOTING | late link-tapper (post-lock) | none (spectate results only) | "You missed the window, but watch." |
| RESULTS | first open | choreographed reveal → `Share results card` | drumroll → crown |
| RESULTS | repeat | `Share results card` / `Rematch` | crown line |
| ARCHIVE | any | `Rematch` | nostalgic |

- **Entry creation** hands off to the existing Create flow **pre-loaded with the topic** (mirror the
  `pendingCreatePreset` store pattern), tags the `dream_queue` render as a game entry, and returns it as
  your blind entry. Render progress reuses `lib/dreamStageLabels.ts` ("Painting your dream").
- **Voting** is blind: entries shown with **no ownership**, order **randomized per viewer** (stable seed =
  `hash(gameId+viewerId)`), your own entry marked "Yours" and rose-disabled. **All roster members vote** —
  everyone who joined before the voting lock, whether or not they submitted (a non-submitting member is a
  "spectator" who still gets 2 roses). A late link-tapper who arrives after the lock is **results-only**.
- **Results reveal** (first open only, choreographed): DreamBot drumroll → places counted bottom-up →
  **winner big, author unmasked**, confetti + success haptic → superlatives dealt one-by-one → settles into
  the static board. Every later open shows the static board (tracked via `results_seen_at`).
- **Superlatives (v1):** **rank-derived, no extra voting** — **Winner** (most roses) + **Runner-up** +
  **Dark Horse** (an entry with a passionate minority of roses), awarded only at **4+ players** (a 2-3
  player game just crowns a Winner). Themed reaction-tap awards (Funniest / Most Cursed, via a one-tap
  reaction alongside roses) are a **fast-follow**, not v1.

### Games hub + profile shelf

- **Profile Games shelf** — a horizontal **Instagram-Story-Highlights-style** row in the profile header
  (rendered under `ProfileHeader`, above the album tabs, inside the FlashList header so it scrolls away).
  **NOT a 5th grid tab.** Own profile: `+ New Dream Off` · active games (turn badges) · past-game covers.
  Other profile: **`Challenge [name]`** button (a killer invite hook) + their past games (discovery).
  Cover tile = the winning image (or a branded topic card pre-results), color-coded ring by state.
- **Games hub** (`app/dreamoff/index.tsx`) — a vertical status-card list, sectioned **Your move / Waiting /
  Finished**, reached from "See all". The active-turn *nagging* lives in **inbox + push**, never an
  interstitial (delight, not funnel).

### Cold-open / deep-link hardening

Room is a **top-level route** `app/game/[gameId].tsx` (NOT under `(tabs)`) so a cold universal link renders
it directly even logged-out (same reason `/photo/[id]` works). Back uses `safeBack()` (fallback to hub/home).

---

## 3. Backend data model & architecture

Reuses the async render backbone verbatim: `dream_queue` + `dream-queue-worker`, one UUID across
queue/entry/ledger, adding `source='dream_off'`. Atomic advancement copies the migration-275 pattern
(`pg_advisory_xact_lock` + status-guarded `UPDATE`).

### Tables (core mechanics)

- **`dream_offs`** — `id, owner_id (ON DELETE SET NULL — archive survives owner deletion), topic,
  topic_source, phase, phase_expires_at, tier_key, invite_code (unique), invite_revoked_at, max_players,
  join_approval, pot_reference (decoupled, no FK), settings, created/updated`. Partial index on
  expiring/active games.
- **`dream_off_players`** — membership + per-player state: `game_id, user_id, status
  (invited|active|pending|removed|left), joined_via, submitted_at, voted_at`. PK `(game_id, user_id)`.
- **`dream_off_entries`** — `id, game_id, author_id (ON DELETE SET NULL), author_name_snapshot, upload_id,
  game_image_ref, blind_order_seed, render_status, moderation_status, payment_reference, completed_at`.
  **UNIQUE(game_id, author_id)** = one entry/player (the all-done + ballot anchor).
- **`dream_off_votes`** — `game_id, voter_id, entry_id, rose_index`. **PK(game_id, voter_id, rose_index)**
  structurally caps 2 roses; **UNIQUE(game_id, voter_id, entry_id)** blocks double-dipping; a CHECK/guard
  blocks self-vote. Its own table — **never the public `likes` table** (which permits forged inserts).
- **`dream_off_events`** — activity readout feed.
- **`dream_off_superlatives`** — `PK(game_id, key, entry_id)` (stores ties).
- **`dream_off_topics`** — the topic deck (see §6): `pack, topic_text, is_active, season_window`.

### Phase state machine

**One funnel** `maybe_advance_dream_off(game_id, force, reason)` is the ONLY writer of `phase`. All three
triggers (all-done / owner / deadline) call it under a **per-game advisory lock + status guard**, so
concurrent advances collapse to a no-op. Rules:
- SUBMISSION → VOTING when all submitted OR owner OR deadline; **&lt;2 entries diverts to CANCELLED/NO_CONTEST**.
- VOTING → RESULTS always resolves (partial turnout OK) and calls **idempotent `tally_results`**.
- **A pure-SQL `advance_expired_dream_offs()` on pg_cron every minute** drives deadlines (no edge fn/token
  needed — tally + notifications are all in-DB), plus a 15-min fail-loud "stuck game" monitor.

### Blindness (the hard security part)

`dream_off_entries` and `dream_off_votes` get **RLS enabled with NO client read/write policy** (deny-all;
service role bypasses). A hostile `curl /rest/v1/dream_off_entries?select=*` returns `[]`. The **only** read
path is `SECURITY DEFINER` RPCs that **blind on phase**:
- `get_game_gallery` → image + `is_mine`, but **never** `author_id`/`prompt`/vote counts before RESULTS;
  full unmasked board after. Per-viewer stable shuffle.
- `get_my_ballot` → self-votes only. A who-voted-for-whom breakdown is **never** emitted (only aggregate
  counts). Attack defended: reading entry ownership or ballots before results via the raw API.

### RPCs / edge functions

`create_game, deal_topic, invite_players, join_game_by_code, get_game_invite_preview, rotate_game_invite,
add_player, submit_entry, cast_votes (entrants-only + phase + ≤2 distinct roses + no-self-vote + idempotent
replace-under-lock), advance_phase (owner-guarded), leave_game, cancel_game, tally_results (idempotent via
winner-row guard; deterministic tiebreak: roses → earliest `completed_at` → entry_id)`. Reads:
`get_game_room, get_game_gallery, get_my_ballot, get_game_activity, get_game_results, get_my_games`.
One new edge fn: **`dream-off-submit`** (service role) — atomic entry-create + funding decision + enqueue.

---

## 4. Economy — funding + model-tier fairness

**Two requirements from Kevin:** (a) the **app never foots the render bill** — users fund it; (b) players
compete on a **level model playing field** — no winning by spending on a premium model.

### A. Funding / escrow (money-integrity-critical)

The **pot is a real escrow account**, not a promise: money moves *in* up front, renders *draw down*. There
is never a "render against uncollected funds" state.

- **New money tables (own ledger, decoupled from the game mechanics tables):**
  - `dream_off_pot` — per-game escrow: `game_id, tier_key, balance (CHECK ≥0), funded_slots, slot_price
    (frozen at setup), prize_balance, status (open|settling|settled)`.
  - `dream_off_pot_ledger` — append-only audit: `kind (fund|donate|spend|refund|prize_*), amount (signed),
    balance_after, reference_id, entry_id`, **UNIQUE(game_id, kind, reference_id)** idempotency backstop.
  - Rationale: pooled multi-debits would collide on the existing user-ledger unique indexes
    (`ux_sparkle_tx_charge_ref`); the pot needs its own ledger. Refunds move residual back to funders in a
    few distinct-reference user credits (no collision).
- **Submit-time precedence (atomic, under `FOR UPDATE` on the pot):** (1) game pot if funded → player pays
  nothing; (2) else `charge_sparkles(entrant, slot_price, ...)` on their own balance; (3) else **reject
  `insufficient` before any render enqueues** (paywall). Pot funding is all-or-nothing per slot.
- **Owner pre-funds N slots** (`dream_off_fund_pot`) and **members donate** (`dream_off_donate`) — both
  reuse the hardened `gift_sparkles` shape: **giftable (purchased) sparkles only** (kills free-account
  farming), idempotent on reference, per-day caps, `engine_config` kill-switch.
- **Refunds** (`dream_off_settle_pot`, service-role only, fired once at RESULTS/CANCEL via the phase
  transition): residual returns to funders **pro-rata by net contribution, bounded by residual** (can't
  mint), idempotent via the `open→settling` flip. Never reuse `refund_sparkles` for pot payouts (its
  "refund actual spend for this ref" semantics don't model a pool); use a dedicated `dream_off_credit` that
  decrements the pot in the same tx. Every value-moving op is caller-gated + reference-keyed + `FOR UPDATE`
  before check+move (the exploit table from the economy research is the build reference).
- **Prize pot: OFF in v1** (build the hook, `engine_config.dream_off_prize_enabled=false`). A sparkle prize
  turns a party game into a gambling-adjacent wager (App Store review risk, collusion incentive, against
  the "pure joy, not a metric" rule). Winner reward is **social/cosmetic** + optionally a small fixed
  celebratory grant *we* fund.
- **Pro users pay the same `slot_price`** — no free/discounted game renders (in a competition that's an
  economic or quality asymmetry). One flat price per game.

### B. Model-tier fairness

A **tier** = a named allowed model set + a `slot_price`, **frozen onto the pot at setup** (an admin
retuning tiers mid-game can't change an in-flight game).
- **Default `standard`** = `STANDARD_MODEL_IDS` (all 1✦, inherently cost-flat), `slot_price=1`.
- **`premium`** ("higher sparkle game") = a curated same-cost subset of `PREMIUM_MODEL_IDS`, `slot_price=2`.
  Owner picks at setup; everyone in that game uses it. **Deferred past v1 — ship Standard-only to start; add
  Premium once the model set is curated.**
- **The invariant:** fairness is about the **model used**, independent of who pays. Even a Pro user or an
  owner-funded free render is locked to the game's tier. Enforced **server-side at BOTH** the submit RPC and
  the `generate-dream` render branch (defense in depth). Unlike Smart Dream (which silently *coerces* a bad
  model cheaper — benign for solo), a game **hard-rejects + refunds** a tampered out-of-tier model, so
  cheating yields nothing.
- Tiers stored in a small `dream_off_tiers` config table (DB-tunable, no build). Within a tier all models
  are the same `slot_price` (keeps pot math to `slot_price × slots`, removes any "pick the priciest model
  to drain the pot" micro-exploit). **Players pick within the tier** (agency = joy; members are
  quality-comparable by curation).

---

## 5. Image lifecycle & persistence

Each entry render produces **two** durable artifacts:
1. **Private album copy** — a normal `uploads` row, `is_public=false, posted_at=NULL`, in the entrant's own
   Storage folder. Protected at the RLS layer (SELECT policies + the repost trigger) so it **can't leak**
   into feed/explore/hashtags until the user explicitly shares it.
2. **Permanent game copy** — a service-role `storage.copy()` of the render into a **game-owned folder**
   (`game/{game_id}/{entry_id}.…`), recorded in **`dream_off_entry_images`** with the archive-durable facts
   frozen in (topic, prompt, model, `author_name_snapshot`). Nothing prunes it → the archive lives forever.

- **Deletion semantics:** user deletes their album copy → **game copy persists** (different folder/table).
  User deletes their **account** → `author_id ON DELETE SET NULL` + the name snapshot → **keep the image,
  drop the identity** (archive never breaks).
- **No face-swap / Dream-Cast on game entries** (fairness + simplicity; keeps renders `light`-weight).
- The permanent copy is a **byte-copy** of the render (zero extra model cost).
- **Pipeline tagging:** add `'dream_off'` to `dream_queue.source`; carry `game_id`/`entry_id` in payload;
  the completion branch does the `storage.copy()` + `dream_off_entry_images` insert + attaches the entry +
  advances the game. A moderated-out render writes a `moderation_status='forfeit_nsfw'` marker so the game
  **forfeits that entry** rather than it silently vanishing.

---

## 6. DreamBot's voice, orchestration & topic decks

DreamBot is the **MC** — a warm friend hosting game night; mischievous, gassed-up, quick, **never cruel**
(roasts target the *situation/absence*, never a person's taste or output). No em dashes. Votes are **roses
🌹** (a consistent, warm token). Emoji sparing.

- **Message taxonomy** (~24 moments): invite, challenge, topic reveal, submission-waiting, "someone
  submitted", nudges (owner + auto-near-deadline), voting-open, voting-waiting, winner reveal, per-superlative,
  tie, absentee/staller roast, partial-turnout, archive, rematch, zero-vote softening. Each mapped to a
  channel (PUSH / ROOM / RESULTS / INBOX).
- **Generation strategy — default static.** Most lines are static templates or `S+slot` (a
  **sanitized** name/topic interpolated into a static skeleton, **no LLM** → zero injection surface). Reserve
  **Haiku** for a few high-delight low-frequency beats (winner reveal, superlative announcements batched in
  ONE call, waiting banter), each with a static fallback (`null`-safe, mirroring `generateBotMessage`).
  **Never generate PUSH copy** (fragment/latency/moderation risk — same rule `send-push` already follows).
  Cost ≈ under a cent per game.
- **Static line pool sizes** (freshness): high-frequency moments (waiting/nudge/submitted) ~20-30 variants;
  medium (voting-open/results) ~10-15; rare (tie/sweep/zero-vote/no-contest) ~5-8. Marquee beats are
  Haiku-generated → never repeat.
- **Safety:** the topic + display names route through `_shared/sanitizeUserText.ts` (add `topic:120`,
  `display_name:40` to `TEXT_CAPS`) before any LLM/Flux/storage, and are `esc()`'d on the public landing
  page. Custom owner topics also pass the SightEngine text gate before becoming publicly link-addressable.
- **Zero-vote softening is the load-bearing tone rule:** a shut-out player gets a **gentle, affirming,
  inbox-private** line ("not your night, but your dream was genuinely unhinged, next topic's yours"), never
  a public "nobody voted for you."

### Topic decks (the "ideas per game")

- **Structure:** 6 **evergreen packs** always on — **Cursed · Wholesome · Chaotic · Us/Roast (name-free
  templates) · Character · Worlds** — plus **seasonal/holiday packs** (Halloween 🎃, Winter 🎄, New Year,
  Valentine's, Summer, …) that **auto-activate on a date window** (DB-driven, no build) and are the natural
  "come back and play" heartbeat. A **Spicy** tone is opt-in per game, SFW.
- **Getting a topic at setup, three ways:** the owner can (a) **pick a pack** and deal a topic, (b)
  **surprise me** (deal from all active packs), or (c) **type their own freeform topic** — the custom topic
  routes through the same safety gate (sanitize + SightEngine text moderation) before it's stored or shown.
- **Sizing:** ~**100 topics per evergreen pack** (a per-group no-repeat shuffle-bag → 1yr+ before any
  repeat for an active group; only the *accepted* topic consumes the bag, re-deals are free), seasonal
  ~30-50.
- **Authoring:** one **Sonnet** call **per pack** (equal-share rule; cross-batch dedup), stored in the
  `dream_off_topics` table, human/QA-gated before going live, top-up-able via a script mirroring
  `generate-bot-seeds.js`. Authoring objective = **divergence** (topics that make different people imagine
  completely different images) + safety.

---

## 7. Invite links, deep linking & the landing page (growth)

The biggest acquisition surface. **Clone the existing universal-link chain** (posts/users already work this
way) rather than invent one.

- **Link:** `https://dreambotapp.com/join/{code}` — **one reusable invite code per game** (natural for
  "text the group chat"; per-invitee attribution tokens are an additive v2). Code = ~10-char base32,
  server-generated (`gen_random_bytes`), unguessable, stored `dream_offs.invite_code`. It is **not** an API
  bearer token — it only resolves to the game + lets you request to join (all reads/writes still go through
  RLS + the join RPC).
- **Installed path:** universal link → top-level `app/game/[gameId].tsx`. A `joinMatch` regex in
  `AuthInitializer.handleUrl` + a `join_game_by_code` RPC (the single choke point: roster-lock, cap,
  approval, idempotent) route by state — member (straight in), non-member (join or spectator if locked/full),
  logged-out (stash code → auth → replay), cold-start (`getInitialURL`). The universal-link chain **already
  exists and works** (posts/users use it); the only build step for invites is **adding `/join/*` to the
  existing AASA route's `paths`** (currently `/post/*`, `/photo/*`, `/user/*`). No bundle-ID concern today —
  the shipping AASA already matches the build; the two only need to stay in sync *if* the planned
  `radorbad → dreambot` rename ever happens.
- **Join model:** pre-invited friends (existing users the owner picks) are auto-members. **Link-join is
  open during SETUP/SUBMISSION** (frictionless for the group-chat share) and the **roster locks at VOTING**
  — so an "original member" is anyone who joined **before the lock**, pre-invited *or* via link (including a
  brand-new user who installed just to join). You **cannot** distinguish a new-user-invitee from a random
  link-tapper by identity (a new invitee has no account to pre-register), so identity-gating is impossible;
  instead: a leaked link can't recruit voters mid-vote (roster lock), and **blind voting** makes any stray
  joiner's rose just noise (they can't target a friend's entry). Backstops: `max_players` cap, owner
  **kick**, and an optional **"Approve who joins"** toggle (link-joiners land `pending` for tight games) —
  the owner is the human differentiator the system can't be. **Default is open-join**; approval is opt-in.
- **Not-installed path:** a **plain-HTML Route Handler** `dreambot-web/app/join/[code]/route.ts` (cloned
  from `/post/[id]` — **NOT** an RSC page, per the Vercel bug). Reads only public-safe fields via
  `get_game_invite_preview` (topic, owner, player count, phase — **never** entries/votes). DreamBot-voice
  copy ("*{owner} dares you to dream: {topic}*"), a "Get DreamBot — Free" App Store button, and — critically
  — a **rich iMessage/OG unfurl card** (the single biggest conversion multiplier) built from a generated
  **branded topic OG image** (gradient wordmark + the funny topic on black; no image leak, blind-safe).
- **Deferred deep link:** **REJECT a Branch/Adjust SDK** — fingerprint tracking would break DreamBot's
  deliberately-clean "no tracking" App Privacy label and force an ATT prompt. **v1 = "tap the link again
  after install"** (the invite lives permanently in their Messages thread; once installed, re-tapping the
  universal link opens the app with the code). Zero SDK, privacy-clean, high-intent installers convert. The
  pending-code stash is designed so a future Branch add would only *pre-fill* the code, no logic change.
- **Onboarding hand-through:** stash `pendingInviteCode` (reuse the `PendingNotificationReplayer` pattern),
  ride it through the whole onboarding pager + background first-dream, then a `PendingInviteReplayer` runs
  `join_game_by_code` at reveal-finish and `router.replace('/game/{gameId}')` — so a brand-new invited
  user's first sight after their first dream is the game they were invited to. A contextual onboarding
  banner ("{owner} is waiting for you in a Dream Off") turns the wait into anticipation. Don't fork
  onboarding (the Vibe Profile makes prompts good).
- **Security:** unguessable code, expiry = lifecycle (joinable only SETUP/SUBMISSION), owner revoke/rotate,
  `max_players` cap + optional owner-approval (bound the open link), auth-required-to-act, rate limits,
  kick/block integration, and never leak private game data on any code-addressable surface. Sanitize +
  `esc()` the topic.

---

## 8. Notifications (reuse the hardened inbox + push system)

New `notifications` types (`dream_off_invite`, `dream_off_your_turn`, `dream_off_voting_open`,
`dream_off_results`, `dream_off_nudge`, `dream_off_pot_refund`) with `reference_id = game_id`, added to the
migration-387 type CHECK, routed in `send-push` + `notificationRouting`. Fan-out fires inside
`maybe_advance_dream_off` / `tally_results`. **Turn-nags keep the standard noise gates** (they're social,
not a paid deliverable) — open question on whether the last-call nudge bypasses them. Deep-link straight
into the room.

---

## 9. Corner cases / stalling matrix (v1, bot-free, 2-to-N)

| Case | Resolution |
|---|---|
| Never submits | Excluded from the pool at deadline; phase advances with whoever entered (if ≥2). No block. |
| Never votes | Results compute from votes cast; roses forfeit. No block. |
| Owner abandons | Deadlines + the cron advance regardless; owner deletion `SET NULL`. Never freezes. |
| **1 entry** (common in 2-player games) | Skip VOTING → RESULTS "wins by default 🏆", DreamBot roasts the no-show. Archived. |
| 0 entries | NO_CONTEST board ("nobody dreamed anything"), offer Rematch. Never rots. |
| Ties | Deterministic tiebreak (roses → earliest submit → entry_id); a single winner is always named; MC leans into it. |
| Entry fails / moderated out | Retry state before deadline; NSFW → "too spicy, tweak it"; else excluded like a no-show; sparkles handled by the refund path. |
| Deadline hits mid-render | Grace: let an in-flight render that started before the deadline finish, else exclude. |
| Everyone done early | Auto-advance immediately (don't wait out the clock). |
| Late joiner | Joins during SUBMISSION → full member (can submit + vote). Arrives after the VOTING lock → results-only spectator. |

---

## 10. Decisions (resolved 2026-07-26)

**Economy & fairness**
1. Entries cost sparkles — **yes, tier-based; Standard = 1✦/entry.**
2. Tier — **Standard-only for v1;** Premium ("higher sparkle") deferred until the model set is curated.
3. Model choice within a tier — **players pick** (tier members are quality-comparable).
4. Prize pot — **no** (social/cosmetic reward only; hook built, gated off).
5. Donation daily cap — **mirror the existing gift-sparkles cap.**

**Gameplay**
6. Redo an entry before the deadline — **allowed.**
7. Roses per voter — **fixed 2.**
8. Who votes — **all roster members** (everyone who joined before the voting lock, whether or not they
   submitted; a non-submitting member is a "spectator" who still gets 2 roses). Roster is dynamic
   (pre-invited + link-joiners during submission) and **locks at VOTING**; a post-lock link-tapper is
   results-only.
9. Default deadline — **24h, `engine_config`-tunable.**
10. Superlatives — **v1 rank-derived: Winner + Runner-up + Dark Horse, awarded at 4+ players;** themed
    reaction-tap awards (Funniest / Most Cursed) are a fast-follow.
11. Owner abandonment — **deadline auto-advance is enough** (no host-promotion in v1).

**Topics & voice**
12. Getting a topic — **pick a pack / surprise me / type your own freeform topic.**
13. MC tone — **warm host with a mischievous streak.**
14. Public roast pushes — **name-free;** name freely in-room.
15. Custom-topic safety — **sanitize + SightEngine** (no extra Haiku mean-spirited check for v1).

**Privacy & sharing**
16. Games — **invite-only** (not publicly browsable) for v1.
17. Results — **vote totals only** (never who-voted-for-whom).
18. Post-lock link-tapper — **spectator (results-only).**

**Invite & technical**
19. Invite code — **one shared code per game;** per-invitee attribution later.
20. Join model — **default open-join during SETUP/SUBMISSION + optional "Approve who joins" toggle;** roster
    locks at VOTING; blind-vote + `max_players` cap + owner-kick backstops.
21. Deferred deep link — **"tap again after install"** (no tracking SDK).
22. AASA — **no bundle-ID concern today** (the shipping AASA already matches the build, which is why link
    sharing works); the only step is **adding `/join/*` to the existing AASA `paths`.** Keep AASA + bundle
    in sync only if the `radorbad → dreambot` rename ever happens.

**Build-detail decisions**
23. **Dark Horse** = the top entry *outside* the top two (3rd by roses, tie-break earliest submit), framed
    with underdog flavor by the MC.
24. **Donation cap** = `engine_config.dream_off_donation_max_per_day`, seeded to the existing
    `gift_max_per_day` value (inherited, independently tunable).
25. **Last-call nudge** = **respects** the standard push noise gates (NOT the nightly always-push
    exemption) — it's a social ping, not a paid deliverable.

*Only genuinely deferred item: the exact Premium model set (ships with the Premium tier, post-v1).*

---

## 11. Suggested build sequencing

1. **Schema + phase machine + blindness RLS + cron** (the spine; everything hangs off it).
2. **Entry pipeline** (`dream_queue source='dream_off'` + image lifecycle + private-album/game-copy).
3. **The Room** (SETUP→SUBMISSION→VOTING→RESULTS states) with static MC copy.
4. **Economy** (tiers + funding/escrow + refunds) — gated behind a kill-switch so the game can ship
   free-to-owner-funded first if desired.
5. **Topic decks** (Sonnet generation + QA) + Haiku marquee lines.
6. **Invite links + landing page + onboarding hand-through** (the growth loop).
7. **Profile shelf + Games hub + shareable results card.**

**Shelved (post-v1):** bots as players (topic-injection into a bot's style, private sink, anti-sweep clamp
— all researched and documented for when we want them).

---

*Every user-authored string (topic, display name) routes through `sanitizeUserText.ts` before any LLM/Flux/
storage and is `esc()`'d on web. Every value-moving RPC is caller-gated, idempotent, reference-keyed, and
`FOR UPDATE`-locked. Blind integrity is enforced server-side (deny-all RLS + phase-blinding RPCs), not in
the client.*
