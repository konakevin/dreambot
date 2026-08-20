# Dream Friends — Feature Spec

**Status:** SPEC (not built). Authored 2026-08-11 from a design session with Kevin + four codebase
research passes (cast resolution, enqueue/roll, shared-dream visibility/notifications, social/consent/RLS).

## The concept

Invite someone to be **Dream Friends**. Once you're mutually linked, each of you has a chance to show
up in the other's nightly dreams — as **buddies on an adventure** (pirates, astronauts, explorers, a
giant corgi), never a couple. Behind the scenes it's a dual face-swap of your primary cast pic + their
primary cast pic, and the same dream lands in **both** your albums with a **"Dreamed with @username"**
byline. You never know which night a friend shows up — that surprise, plus the shared artifact ("we had
the same dream"), is the whole magic.

It's cheap to build because the hard parts already exist: nightly **dual face-swap** dreams, the
**adventure scenario buckets** (shipped 2026-08-10, see `NIGHTLY_FUN_SCENARIOS_PLAN.md`), the gender
guarantee, the notification→push path, and a proven **mutual-accept relationship** pattern (the old
`friendships` table). This is mostly product/UX + a thin data model.

---

## Locked decisions (from the design session)

1. **One simple "friend" link** — no relationship labels. Every linked dream is platonic/adventure vibe.
   The `elegant`/romantic scenario pool is **hard-excluded** for friend dreams.
2. **Mutual opt-in** — invite → accept. That accept is what authorizes using each other's cast photo
   cross-user (see Privacy). Either side can unlink anytime → severs future dreams, **keeps** past ones.
3. **One Pro friend is enough.** The Pro side's nightly generates the dual dream; it's inserted for
   **both** users. A **free** friend can be a co-star and **receive** the dream (they just don't
   self-generate) — a clean Pro-conversion hook.
4. **The roll:** ~**25% chance** each night your nightly is a Dream-Friend dual instead of your own cast.
   **Round-robin** through your *active* friends before repeating.
5. **Per-side active/inactive toggle** — mute a friend without unlinking. It's **directional**: it
   controls whether *you generate* dreams with them. If they keep *you* active, they can still generate a
   dream that lands for both of you. Unlink is the full stop.
6. **No cap on received dreams.** If ten friends all dream you in one night, you wake to ten bonus
   adventures. "Let it fall where it may." (Cost note below.)
7. **"Dreamed with @username" byline** on every linked dream — above the caption, tappable to their
   profile. Signals it's a linked dream, credits the friend, and anchors a future "Linked Dreams"
   collection.

---

## User experience

### Invite & accept
- **Entry:** a "Dream with [name]" button on a user's profile, and/or a dedicated **Dream Circle** screen.
- **Flow:** you invite → they get a notification/request → they accept → you're linked. (Reuse the
  `follow_requests` request→accept shape; see Data model.)
- **Manage (Dream Circle screen):** list of linked friends, each with an **active/inactive** toggle and
  an **unlink** action. Shows pending invites (incoming + outgoing).

### The surprise
- On a friend-dream night, the render lands in **both albums** and both users get a push:
  *"✨ You wandered into Alex's dream last night."* Tap → the shared dream, stamped **Dreamed with @alex**.
- Your own nightly still runs separately, so some nights you get **your dream + one or more gift dreams**.

### The byline
- **"Dreamed with @username"** renders above the caption on any linked dream, in album + (if posted) feed.
- Deep-links to the friend's profile. Doubles as the at-a-glance "this is a linked dream" signal and the
  grouping handle for a future **Linked Dreams** collection/filter.

---

## Data model

### `dream_friends` (new table — mutual link + per-side active flag)
Modeled on the proven-but-retired `friendships` table (migration 031) + `follow_requests` (098). House
rules: `user_a < user_b` normalization, RLS both-can-view / initiator-inserts / both-update-delete,
column-level GRANTs (migration 278 — **new columns invisible until granted**), and the
`enforce_insert_rate_limit` trigger (migration 194).

```sql
CREATE TABLE public.dream_friends (
  user_a        uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_b        uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted')),
  initiator_id  uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_a_active boolean NOT NULL DEFAULT true,   -- A: "include B in MY dreams"
  user_b_active boolean NOT NULL DEFAULT true,   -- B: "include A in MY dreams"
  created_at    timestamptz NOT NULL DEFAULT now(),
  accepted_at   timestamptz,
  PRIMARY KEY (user_a, user_b),
  CHECK (user_a < user_b),
  CHECK (initiator_id IN (user_a, user_b))
);
-- indexes: (user_a,status), (user_b,status), partial (user_b,status) WHERE status='pending',
--          (initiator_id, created_at) for the rate-limit check.
-- RLS: SELECT user_a|user_b; INSERT initiator_id=auth.uid(); UPDATE/DELETE user_a|user_b.
-- GRANTs: REVOKE table SELECT; GRANT SELECT/UPDATE on the specific columns.
-- Trigger: enforce_insert_rate_limit('30','1 minute','initiator_id').
```

RPCs (SECURITY DEFINER, gate on `auth.uid()`): `send_dream_friend_request(target)`,
`accept_dream_friend_request(other)` (sets `accepted_at`, notifies), `deny/cancel`, `remove_dream_friend`,
`set_dream_friend_active(other, active)` (writes the caller's side flag).

### `uploads` additions (for the shared dream + byline)
- **`dream_with_user_id uuid NULL`** — the co-star on a linked dream (drives the byline + deep link).
- **`shared_dream_id uuid NULL`** — groups the two rows that share one rendered image (so a future
  "delete/like together" or collection view can join them). Optional for v1 but cheap to add now.
- ⚠️ Both need **column-level GRANTs** in the same migration (migration-278 rule) or the client can't read
  them. `dream_with_user_id` is client-readable; keep it SELECT-granted.

### Round-robin cursor
Reuse an existing shuffle-bag. Two options: the `bot_path_cycle` delete-when-exhausted pattern
(migration 283), or the `pool_pick_history` + `filterUnseen`/`recordPick` helpers (migration 349, already
imported by nightly-dreams). **Recommend `pool_pick_history`** keyed `pool='dream_friend:<userId>'`,
`item_key=<friendId>` — zero new tables, same code the scenario round-robin already uses.

---

## Nightly mechanics

### 1. The friend roll (enqueue-side)
In `scripts/nightly-dreams.js`, per eligible user, after confirming they have ≥1 **accepted** link where
**they've kept that friend active** and the friend has a usable cast:
- Roll **25%** (a new `engine_config.dream_friend_roll_pct`, live-tunable). If it misses, enqueue a normal
  nightly.
- If it hits, pick the next friend via the round-robin cursor (skip inactive-from-your-side, blocked, and
  friends with no usable `self` cast), then enqueue the user's ONE nightly job with
  `payload: { friend_id }` (+ keep `dedup_key = nightly:<user>:<dayKey>`).

Doing it enqueue-side keeps the round-robin state and the eligibility checks in the single cron loop
(which already paginates the 1000-row cap and dedups per-user-per-day).

**No per-pair dedup for v1** (per decision #6). If Alice rolls Bob *and* Bob rolls Alice the same night,
they get two *different-scene* adventures together — abundance, not duplication. The scenario round-robin
guarantees different scenes. (If render cost ever demands it, add a per-pair-per-day claim via a
`dedup_key = friend:<sortedpair>:<dayKey>` UNIQUE — the existing dedup mechanism — later.)

### 2. Cast injection (render-side)
In `nightly-dreams/index.ts`, when `payload.friend_id` is present:
- Load the friend's `user_recipes.recipe`, take their **`self`** cast member, relabel it `role:'plus_one'`,
  `relationship:'friend'`, keep their `storage_path` + `gender` + `description` + `age`/`physical_summary`.
- Force a dual: substitute it as `selectedCast[1]` **before** the dual source-assignment (~`:909`/`:2122`).
  `hydrateCastSources` signs the friend's photo via the **service role** (bypasses the `cast-photos`
  owner-only RLS — this is the deliberate, consent-authorized cross-user read). Pass `storage_path`, not a
  pre-minted URL, so it signs fresh.
- Gender flows through the existing `faceSwapSources[].gender` + the Haiku gender-guarantee unchanged.
- Force the **friend-safe scenario pools** (adventure/`active` + `goofy`); **exclude `elegant`**. Reuse the
  existing `force_*`/scenario-pool machinery.

### 3. Shared insertion (render-side) — the key mechanic
A user's album = "all `uploads` rows where `user_id = me`" (album membership is literally row ownership;
nightly rows are `is_public=false, is_posted=false`). So render **once**, persist the image **once**, then
insert **TWO `uploads` rows** with the same `image_url`/`image_url_display`, one per `user_id`, each with
`dream_with_user_id` = the *other* user and a shared `shared_dream_id`. It lands in both albums with **zero
client changes**. Do the two inserts atomically (or insert-then-verify) so a dream never lands for one and
not the other. (`ai_generation_log` stays single, keyed to the generating user's job.)

Rows are independent going forward (each user owns their copy — likes/deletes don't mirror). That's fine
and arguably correct; `shared_dream_id` is there if we ever want "together" semantics.

---

## Notifications

Insert **two `notifications` rows**, one per `recipient_id`, each pointing at that user's own `uploads.id`,
with a **new `subtype='friend'`** on the existing `type='dream_generated'` (subtype is free-text, no CHECK
— **no migration needed**). Set `actor_id` = the *other* friend so `@username` renders from the recipient's
perspective. Both flow through the existing group-key → push-debounce → `send-push` path automatically; add
one copy branch in `send-push/index.ts` (~`:152`) keyed on `subtype='friend'`.

**Copy (rotate a few, joyful, no em dashes):**
- To the friend who was dreamed in: *"✨ You wandered into @alex's dream last night"* · *"@alex's dream had
  a special guest last night... you 💫"* · *"You and @alex went on an adventure last night ✨"*
- To the person whose roll made it: *"You dreamed up an adventure with @alex last night ✨"*

Both tap through to the shared dream in their album.

---

## Pro logic

- `is_pro_active` / `is_dream_eligible` gate only the **cron enqueue** and the nightly worker's re-check —
  **not** the row writes. A free user gets no self-initiated nightly job, but the service role can insert
  an `uploads` row + `notifications` row into their account with nothing objecting.
- So: at least **one** side must be Pro/trial (to have a nightly that rolls the friend); a free friend
  **receives** the dream as their only nightly-style content → natural upsell ("want your own dreams every
  night? go Pro"). Two free users = no friend dreams (neither generates).

---

## Privacy, consent & safety

- **The one deliberate crossing:** using a friend's cast photo in your dream. There's no technical wall
  (service role bypasses `cast-photos` RLS), so the **mutual accepted link is the authorization** — that's
  why the handshake matters. Only the friend's **`self`** primary is ever used, never arbitrary photos.
- **Blocks:** if either user blocks the other (`blocked_users`), suppress generation and hide/soft-sever
  the link. Check blocks in the enqueue eligibility.
- **Unlink** severs future dreams, keeps past ones (per decision). **Account deletion** cascades
  (`ON DELETE CASCADE`) → link gone; decide keep-vs-purge for already-shared dreams (recommend keep — the
  other user's copy is their memory; the deleted user's face is already rendered/immutable).
- **Public posting of a linked dream** (friend's face goes public) is a **step beyond** private-together.
  **OPEN DECISION** — options: (a) allow, byline credits them; (b) album-only; (c) require the co-star's
  ok. Recommend at least gating behind the byline + a future per-user "allow friends to post our dreams".
- Linked dreams are `is_public=false` by default (album-only), so default exposure is low.

## Edge cases
- Friend has no usable `self` cast (no photo/description) → skip in round-robin, re-roll.
- Friend marked inactive **by you** → excluded from *your* generation; they can still generate you if they
  kept you active (directional, by design).
- Both free → no friend dreams.
- One user deletes their copy of a shared dream → the other keeps theirs (independent rows).
- Gender/age of the friend flow through the normal dual pipeline + gender guarantee.

---

## Key touchpoints (from research, file:line)
- **Cast:** `user_recipes.recipe` JSONB → `dream_cast[]` (`types/vibeProfile.ts:70`); hydrate via
  `_shared/castPhotoUrl.ts:59` (service-role signed URLs, bypasses `cast-photos` RLS, migration 292);
  inject before `nightly-dreams/index.ts:909` / dual source assign `:2122`; dispatch
  `_shared/dualSwapDispatch.ts:47`; gender guarantee `_shared/dualSwapPipeline.ts:192`.
- **Enqueue/roll:** `scripts/nightly-dreams.js` (dedup_key `:232`, eligibility `:187`); roll insertion
  `nightly-dreams/index.ts:447-463`; `rollNightlyDreamType` `_shared/chaosTier.ts:195`; round-robin
  `_shared/poolPickHistory.ts` (`filterUnseen`/`recordPick`).
- **Shared insertion:** single `uploads` insert today at `nightly-dreams/index.ts:2904-2929` → add the
  second row; album = `user_id`-only query.
- **Notifications:** insert at `dream-queue-worker/dispatchers/nightly.ts:128-146`; type list
  `migration 387`; push copy `send-push/index.ts:152-164`; always-push exemption `_shared/notify.ts:154`.
- **Consent tables:** template `friendships` (migration 031, dropped 116) + `follow_requests` (098);
  blocks `blocked_users` (047); grants (278); rate-limit (194).

## Open decisions
1. **Public posting** of a linked dream (friend's face public) — allow / album-only / require co-star ok?
2. **Final notification copy** set + how many variants to rotate.
3. **`dream_friend_roll_pct`** default (25% agreed) and whether to expose per-user frequency later.
4. **`shared_dream_id`** now (cheap) or defer until we want together-semantics.
5. **Account deletion** → keep or purge already-shared dreams (recommend keep).

## Rollout phases
1. **Data + consent:** `dream_friends` table + RPCs + RLS/grants/rate-limit; Dream Circle UI (invite /
   accept / active-toggle / unlink). Ship the social layer first, no dreams yet.
2. **Engine:** friend roll (enqueue) + cast injection + forced friend-safe pools + two-row shared
   insertion + two notifications (subtype `friend`) + the `dream_with_user_id` byline. Behind
   `dream_friend_roll_pct = 0` (dark) until QA.
3. **QA:** force a friend dream to a test pair (a `force_friend_id` QA hook mirroring `qa-nightly-fun.js`);
   verify both albums + both notifications + byline + gender + proximity-safe pose; then dial the pct up.
4. **Polish:** Linked Dreams collection/filter, public-posting decision, frequency controls.
