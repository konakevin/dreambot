# Dream Off — Remaining Work & Rollout Plan

**Status: 2026-07-26.** The **entire backend is built + validated** (DB, economy, edge code, topic
deck, monitoring). The feature is **born dark** (`engine_config.dream_off_enabled = false`) — nothing is
user-reachable. What remains is: **deploy the edge functions**, **build the client UI**, verify the web
landing, then **flip the flag**. Companion docs: `DREAM_OFF_PLAN.md` (design, 25 locked decisions) and
`DREAM_OFF_BUILD_PLAN.md` (the original staged build order).

---

## 1. DONE — what's already shipped (backend)

### Stage A — DB (migrations 400–414, all applied + CI-`db-tests`-green, each with a `*.dbspec.ts`)

| #   | Migration      | What                                                                                                                                                               |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 400 | core schema    | 7 deny-all-RLS tables, no-self-vote trigger, kill-switch (`dream_off_enabled` default false), realtime = only `dream_offs`                                         |
| 401 | shared surface | `dream_queue.source` + `notifications.type` CHECK widen (6 `dream_off_*` types), notification category mapping                                                     |
| 402 | economy tables | `dream_off_tiers` (standard = 8 STANDARD_MODEL_IDS @1✦), `dream_off_pot`, `dream_off_pot_ledger`                                                                   |
| 403 | create         | `dream_off_gen_invite_code` (base32, `random()`), `create_game`, `deal_topic`, `dream_off_setup_pot`                                                               |
| 404 | roster         | `invite_players`, `join_game_by_code` (the join choke point), `leave_game`, `cancel_game`                                                                          |
| 405 | phase machine  | `maybe_advance_dream_off` (guarded funnel), `tally_results` (winner + superlatives), `advance_phase`                                                               |
| 406 | entry seam     | `dream_off_create_entry` / `attach_render` / `refund_entry` (pot-aware) / `forfeit_entry` (service-role)                                                           |
| 407 | funding        | `dream_off_fund_pot` (owner prefund), `dream_off_donate` (member, dark)                                                                                            |
| 408 | submit         | `dream_off_submit_entry` (pot-debit-vs-self-pay + tier gate 1; service-role)                                                                                       |
| 409 | settle         | `dream_off_credit`, `dream_off_settle_pot` (pro-rata residual) — wired into `maybe_advance` + `cancel_game`                                                        |
| 410 | reads          | `get_game_room` / `get_game_gallery` (blind) / `get_my_ballot` / `get_game_activity` / `get_game_results` / `get_my_games` / `get_game_invite_preview` (anon-safe) |
| 411 | cast_votes     | the ballot RPC (≤2 roses, no-self-vote, idempotent-replace, member+voting-gated)                                                                                   |
| 412 | cron           | `advance_expired_dream_offs` (pg_cron minute sweep) + `dream_off_stuck_count`                                                                                      |
| 413 | fail entry     | `dream_off_fail_entry` (non-NSFW dead-letter seam)                                                                                                                 |
| 414 | client flags   | `get_client_flags()` → `{dream_off_enabled}` (anon+authenticated; the client's UI gate)                                                                            |

**Identity contract (locked in code):** an entry's dream_queue `job_id` == `dream_off_entries.payment_reference`
== the pot-ledger `reference_id` == the `charge_sparkles`/`refund_sparkles` `reference_id`. One id threads
render + payment across every seam.

### Stage B — edge code (committed, **NOT deployed** — see §2)

- **`dream-off-submit`** (new) — the entry enqueue endpoint (calls `dream_off_submit_entry`, enqueues
  `source='dream_off'`, pot-aware refund on enqueue failure).
- **`_shared/dreamQueueLifecycle.ts`** — fenced on `source='dream_off'`: `completeQueueJob` → `attach_render`;
  `failQueueJob` dead-letter → pot-aware refund (`forfeit_entry`/`fail_entry`) + skip the wrong-copy push.
  **`generate-dream`'s body was NOT touched** — it already delegates to these.
- **`dream-queue-worker`** — `dream_off` in the source type + dispatch (renders like `create`) + the
  already-completed guard + a `dream_off` branch in `deadLetterAftermath`.
- **`send-push`** — 6 `dream_off_*` push-copy cases + `reference_id`→`data.gameId` deep-link threading
  (NOT in `isAlwaysPushType` — nudges respect the noise gates).

### Data + ops

- **Topic deck** — `dream_off_topics`: **600 topics, 100 per pack × 6 evergreen packs** (Cursed, Wholesome,
  Chaotic, Us/Roast, Character, Worlds), all SFW/active, 0 dups, roast is name/gender-free. Regenerate/top-up
  with `node scripts/generate-dream-off-topics.js` (dedup-as-you-go; `--count`/`--pack`/`--dry-run`).
- **Monitor** — `scripts/check-dream-off-health.js` + `.github/workflows/dream-off-monitor.yml` (hourly):
  overdue games / unsettled pots / **pot-ledger imbalance** (escrow canary). No-ops green while dark.
- **Web** — `dreambotapp.com/join/[code]` landing (plain-HTML) + `/join/*` in the AASA — **live on Vercel**.

---

## 2. ⚠️ GATING STEP — deploy the edge functions (Kevin)

`_shared/dreamQueueLifecycle.ts` is bundled per-function, so redeploy this **matched set together** (all
`--no-verify-jwt`). Safe to do anytime — everything is fenced on `source='dream_off'`, so a partial/early
deploy is byte-identical for create/nightly/DLT/restyle:

```
supabase functions deploy generate-dream --no-verify-jwt
supabase functions deploy restyle-photo --no-verify-jwt
supabase functions deploy dream-queue-worker --no-verify-jwt
supabase functions deploy dream-off-submit --no-verify-jwt
supabase functions deploy send-push --no-verify-jwt
```

Until this runs, a `dream_off` queue row would render but never attach to its entry. **Do it before any
end-to-end client testing.**

---

## 3. Remaining backend — polish + hardening (NOT blocking a first playable)

None of these block a working game; they're quality/robustness for launch.

1. **Permanent game-image copy (build plan C2).** Today `dream_off_attach_render` stores the entry image as
   the upload's public `image_url`. If the user deletes that upload, the game/archive image breaks. Harden:
   in the completion hook (or a small follow-up edge step) `storage.copy()` the render into a permanent
   `game/{game_id}/{entry_id}` prefix and store THAT path in `game_image_ref`. **Edge change** → deploy with
   the set above. _Priority: before public launch._
2. **`dream_off_pot_refund` notification.** `dream_off_settle_pot` credits funders silently. Add a
   notification insert (type `dream_off_pot_refund`, `reference_id = game_id`) so the owner learns their
   leftover pot sparkles came back. **Migration** (CREATE OR REPLACE `dream_off_settle_pot`) — push-copy
   already exists in `send-push`. _Priority: nice-to-have._
3. **`dream_off_your_turn` / `dream_off_nudge` reminders.** A "make your entry / voting closes soon" heartbeat
   (design §6). Needs a small cron + insert logic (respect the noise gates). Push-copy already exists.
   _Priority: engagement, post-MVP._
4. **Spicy tone deck + seasonal packs.** `dream_off_topics.tone='spicy'` (per-game opt-in) and
   Halloween/Winter/New-Year packs are fast-follows — the generator + schema already support them (add packs
   to `scripts/generate-dream-off-topics.js`, run with a `season_start/season_end`). _Priority: post-MVP._
5. **Synthetic canary** (clone `queue-smoke-monitor`, gated on the flag) — a throwaway 2-account game
   end-to-end. _Priority: after launch._

---

## 4. Stage C — the CLIENT build (the bulk of what's left)

**Everything ships DARK**: gate all UI on a runtime read of `get_client_flags().dream_off_enabled`
(cache it in a hook/store) AND a build-time `DREAM_OFF_ENABLED` constant. With the flag false the app is
byte-identical to today.

### C1 — store + primitives

- `store/dreamOff.ts` (or extend an existing store): `pendingDreamOffEntry` (the render params for an
  in-flight entry), `pendingInviteCode` (a deep-linked code awaiting auth). Keep SEPARATE from the normal
  create `pendingCreatePreset` (early-return when null).
- Pure helpers (fast-jest-testable): `phaseCta(state)` → the room's primary CTA per phase; `blindShuffle`
  (deterministic per-viewer, but the server already shuffles — client just renders order); `bucketMyGames`
  (group `get_my_games` by active/voting/results); the `join` deep-link regex (must reject `post/photo/user`);
  the `dream-off-submit` payload builder; the `model ∈ tier` predicate (gate-2 mirror).

### C2 — the Room screen (`app/game/[id].tsx`)

The heart. Subscribes to the `dream_offs` row via **realtime** (phase flips) — bind it on a SEPARATE channel,
never the `user-${id}` channel (publication-caveat footgun). Reads (all via the DEFINER RPCs, never raw
tables — they're deny-all):

- `get_game_room(id)` — header: topic, phase, countdown to `phase_expires_at`, owner/invite code (owner only),
  player + entry counts, my_status/my_submitted/my_voted.
- `get_game_gallery(id)` — phase-blind: submission → your entry only; voting → all entries author-hidden +
  which you roses'd; results → authors + rose counts + superlatives.
- `get_game_activity(id)` — the event feed.
- `get_game_results(id)` — the podium (results/terminal).
- Phase-specific UI: **setup** (owner: pick topic via `deal_topic`/pack/custom, invite, "Start" →
  `advance_phase`), **submission** (make your entry → C3), **voting** (rose up to 2 → `cast_votes`),
  **results** (podium + superlatives + "Share"), **no_contest/cancelled** states.

### C3 — the entry pipeline

Reuse the create loading screen. Flow: player picks a **model from the game's tier** (show the 8 standard
models) → POST `dream-off-submit` with `{game_id, force_model, ...render params}` → get `{dream_id}` →
navigate to the existing loading screen, subscribing to the `dream_queue` row (identical to a normal create).
On completion the entry attaches server-side; the room shows it. Handle the submit error statuses
(`already_submitted`, `insufficient_sparkles`, `model_not_allowed`, `submission_closed`, `dream_off_disabled`).

### C4 — hub + profile "Games" shelf

- `get_my_games()` → a hub list bucketed by phase, with "your turn" badges (needs entry/vote state — already
  in the payload). Design decided this lives NOT as a 5th profile grid tab but as a shelf/entry point
  (see `DREAM_OFF_PLAN.md`). Optional `users.last_room_view_at` for unseen-activity badging (deferred at the
  DB layer — add the column + its GRANT + a tiny setter RPC when building this, mindful of the freeze trigger).

### C5 — invites + deep links + onboarding hand-through

- Share sheet: the owner shares `https://dreambotapp.com/join/{invite_code}` (landing is live).
- `app/_layout.tsx`: append `dreambot://join/{code}` to the deep-link matcher (don't shadow post/photo/user);
  a `PendingInviteReplayer` that, once authed, calls `join_game_by_code(code)` and routes into the room
  (handle the statuses: joined/already_member/spectator/full/revoked/pending_approval/not_found/disabled).
- `notificationRouting`: `dream_off_*` push → `data.gameId` → open `app/game/[id]`.
- Owner tools in-room: `invite_players`, approve/kick (if `join_approval`), `advance_phase`, `cancel_game`.

### C6 — create-flow entry point

A "Start a Dream Off" affordance (in create, or the hub) → `create_game(topic, source)` → the Room in setup.

---

## 5. Rollout sequence (the order to go live)

1. **Deploy edge functions** (§2) — safe now, do early to verify clean bundles.
2. **(Optional) land backend polish** §3.1 (image copy) + §3.2 (pot_refund) before public launch.
3. **Build the client** (§4) DARK; submit to App Store; get it in users' hands.
4. **Verify the web join path live** once more (`curl` the AASA `/join/*` + a real code) — already deployed.
5. **Flip the flag:** `UPDATE engine_config SET dream_off_enabled = true WHERE id = 1;` — the ONLY step
   that makes it user-reachable. Do it after 1–3 are live and the client build is out.
6. **Post-flip 48h watch:** the Dream Off monitor (hourly), `dream_off` dead-letter ratio, light-pool
   contention vs normal create, pushfail. Run the synthetic canary (§3.5).

---

## 6. Kill-switch / rollback

- **Fastest kill (any time, no deploy/build):** `UPDATE engine_config SET dream_off_enabled = false`. Every
  mutating RPC returns `'disabled'`, the cron no-ops, the client hides all UI at next flag-read, in-flight
  games freeze harmlessly.
- **Edge rollback:** redeploy prior versions (every branch is `source`/`game_id`-fenced).
- **Web:** `git revert` + push (Vercel auto-deploys).
- **Client is not App-Store-reversible** — which is why it ships dark; the flag is the lever.
- **Money:** the pot/ledger is append-only + monitored (imbalance canary). Reconcile via refund RPCs, never
  delete ledger rows.

---

## 7. Test / monitoring status

- **Live-DB dbspecs** (CI `db-tests`): every migration 400–414 is locked by a `*.dbspec.ts` (blindness,
  vote integrity, phase advance/tally, roster, entry seam, funding, submit, settle, reads, cast_votes, cron,
  fail_entry, client_flags). All green.
- **Edge:** validated by `deno check` only (no dbspec lane for edge fns) — exercise end-to-end after deploy.
- **Monitor:** `dream-off-monitor.yml` hourly (dark-safe). Add the synthetic canary post-launch.
