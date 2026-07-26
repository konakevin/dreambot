# Dream Off — Build Plan (implementation)

**Status:** Implementation plan (2026-07-26). Companion to `DREAM_OFF_PLAN.md` (the locked design). This
doc is the **buildable order of operations** — synthesized from 4 parallel implementation-planning
workstreams (backend spine, economy, live-systems safety, client/edge/web), each grounded in the real
codebase. Nothing is built yet.

**The overriding safety principle (Kevin's #1 constraint — do not disrupt live data/users):** the entire
feature is **born dark** behind `engine_config.dream_off_enabled = false`, every change is **additive +
guarded** (fenced on `source='dream_off'` / `payload.game_id` / `dream_off_*` type / the disabled flag),
and the **safe order-of-operations** ensures no runtime that can produce a `dream_off` row/notification
ever exists before the surface that accepts it. A shipped-but-dark client renders **byte-identical to
today** until the flag is flipped server-side.

---

## 0. Blocker & decision checklist — clear these before/while coding

**Product decision needed from Kevin (1 open):**
- [ ] **NSFW-forfeit money handling.** When a game entry is moderated out (`forfeit_nsfw`), do we **refund**
  the sparkles (pot slot restored, or self-payer refunded — matches the existing NSFW dead-letter refund)
  or **forfeit** them as an anti-spam deterrent? **Recommendation: refund** (consistent + kinder). Routes
  through `dream_off_refund_entry` either way. *Awaiting your call.*

**Minor calls made in this plan (flag if you disagree):**
- Topic dealing: v1 = weighted-random with no-immediate-repeat; the full per-group shuffle-bag is a
  fast-follow (low risk).
- Realtime: add **only** the `dream_offs` game row (phase flips) to `supabase_realtime`; `dream_off_entries`
  / `_votes` / `_pot` are **never** in realtime (would leak blind rows). Bind it in a **separate** channel,
  never the `user-${id}` channel (publication-caveat footgun).
- Shareable results URL = `/game/{id}` (the room renders results when `phase='results'`) — no separate
  `/results/{id}` route.

**Cross-workstream seams — resolved (documented so the implementer wires them right):**
- `dream_off_submit_entry(p_game_id, p_user_id, p_entry_job_id, p_model_id)` is the economy RPC the
  `dream-off-submit` edge fn calls after auth; it does the funding decision + tier gate 1.
- Pot settlement: `maybe_advance_dream_off` / `tally_results` **`PERFORM dream_off_settle_pot(game_id)`** at
  the results/cancel transition; the `open→settling` flip is the idempotency key (fires exactly once).
- Dead-letter/fail refund: the `dream_off` dispatcher fail path calls **`dream_off_refund_entry(game_id,
  entry_job_id)`** (pot-aware: restore the slot if a `spend` ledger row exists, else `refund_sparkles` the
  self-payer) — **not** the generic `failQueueJob` refund. Mirrors how nightly/create already branch.
- `notification_category()` + `notification_preferences.category` CHECK + `category_enabled_for` **must**
  map the 6 `dream_off_*` types to a `'Dream Off'` category, or they insert but get filtered out of the
  inbox (the reverse of the nightly bug). Ships in the shared-surface prep migration.
- The `dream_queue.source` CHECK widen is **owned once by the spine** (it's a mechanics table); economy
  references it as a dependency (no duplicate migration).

**Verification action items (do these against the LIVE db before writing the relevant migration):**
- [ ] Confirm the live `dream_queue` source-CHECK constraint name: `SELECT conname,
  pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid='public.dream_queue'::regclass AND
  contype='c';` (expected `dream_queue_source_check`; a hand-rename would make `DROP … IF EXISTS` miss).
- [ ] Confirm the exact `sparkle_transactions` idempotency index names (mig ~321/334) so the pot refund's
  distinct-reference credits provably don't collide.
- [ ] Build a `get_client_flags()` `SECURITY DEFINER` RPC (granted to `authenticated`) exposing
  `dream_off_enabled` — the client **cannot** read `engine_config` directly (service-role-only).
- [ ] Confirm the base32 invite-code alphabet so the deep-link regex `/^join\/([a-z0-9]+)$/i` matches
  exactly and never shadows `/post|photo|user`.
- [ ] AASA `/join/*` add + the `/join/[code]` route deploy in `../dreambot-web` must be verified live
  (`curl` the AASA + a GET on `/join/{code}`) **before** the client build depends on it (Vercel↔GitHub
  disconnect risk).

**Guardrails (do NOT do these):**
- Do **not** add any `dream_off_*` type to `_shared/notify.ts:isAlwaysPushType` — Dream Off nudges RESPECT
  the noise gates (decision #25). Adding one would spam users in-app.
- Do **not** add a `dream_off_*` column to `users`/`uploads` except the one planned `users.last_room_view_at`
  — and that one **must** ship its `GRANT SELECT/UPDATE (col)` in the same migration (column-grant footgun).
- Do **not** add `dream_off_entries`/`_votes`/`_pot` to the realtime publication (blindness leak).
- When rebuilding the `notifications` type CHECK, paste the **full migration-387 list verbatim** then
  append (a stale-list rebuild silently drops a type).

---

## 1. Global safe order-of-operations

Migrations (hand-applied in the dashboard, in prefix order) → edge deploys (`--no-verify-jwt`) → web
deploy → client build → **flip the flag last**. The kill-switch (`dream_off_enabled=false`) is the safety
net across the whole sequence; nothing user-reachable fires until Stage D.

### Stage A — DB (all migrations, one session, in this order)

Renumber to the live max at apply time (highest on disk is 399 → start at 400). Each is additive and
inert-until-consumed; between any two steps nothing breaks (no runtime yet emits `dream_off` rows, flag is
false).

| # | Migration | Contents | Depends on |
|---|---|---|---|
| A1 | `dream_off_shared_surface_prep` | Widen `dream_queue.source` CHECK (+`dream_off`); rebuild `notifications` type CHECK (**full 387 list** + 6 `dream_off_*`); map the 6 types in `notification_category` + `notification_preferences` CHECK + `category_enabled_for`; add `engine_config` columns (`dream_off_enabled` DEFAULT **false**, `dream_off_deadline_hours` 24, `dream_off_slot_price` 1, `dream_off_max_players` 12, `dream_off_donation_max_per_day` = `gift_max_per_day`, `dream_off_donations_enabled` false, `dream_off_prize_enabled` false, `dream_off_max_prefund_slots` 20); `get_client_flags()` DEFINER RPC exposing `dream_off_enabled` → `authenticated`. | — (verify constraint name first) |
| A2 | `dream_off_tiers` | Tier catalog table (public SELECT, service-role write); seed `standard` = the 8 `STANDARD_MODEL_IDS` @ `slot_price=1`; `premium` row `is_active=false`, empty `model_ids` (deferred). | A1 |
| A3 | `dream_off_core_tables` | The 7 mechanics tables (`dream_offs, dream_off_players, dream_off_entries, dream_off_votes, dream_off_events, dream_off_superlatives, dream_off_topics`) + all FKs/ON DELETE/unique/CHECK/indexes; **deny-all RLS** on all 7; the no-self-vote BEFORE-INSERT trigger; add **only `dream_offs`** to `supabase_realtime`. | A1 |
| A4 | `dream_off_pot` | Money tables `dream_off_pot` + `dream_off_pot_ledger`, both **deny-all RLS**, `UNIQUE(game_id,kind,reference_id)`, `balance>=0` CHECK; no FK on `game_id` (decoupled `pot_reference` seam). | A2 |
| A5 | `dream_off_create` | `dream_off_gen_invite_code()`, `create_game` (edge-mediated — sanitizes topic in TS then calls this; + a mig-279-style `sanitize_user_text` trigger on `dream_offs.topic` as storage backstop), `deal_topic`; `dream_off_setup_pot` (freezes tier `slot_price` onto the pot at create). All gate on `dream_off_enabled`. | A3, A4 |
| A6 | `dream_off_roster` | `invite_players`, `join_game_by_code` (the single choke point: roster-lock/cap/approval/idempotent/spectator), `leave_game`, `cancel_game`; insert-rate-limit trigger on `dream_off_players`. | A5 |
| A7 | `dream_off_entry_seam` | Service-role entry-lifecycle RPCs: `dream_off_create_entry` (ON CONFLICT redo), `dream_off_attach_render` (sets submitted_at + `PERFORM maybe_advance`), `dream_off_forfeit_entry`, `dream_off_refund_entry` (pot-aware). | A6 |
| A8 | `dream_off_phase_machine` | `maybe_advance_dream_off` (advisory-lock + status-guard funnel; min-2 divert; `PERFORM dream_off_settle_pot` at results/cancel), idempotent `tally_results` (Winner/Runner-up/Dark-Horse @4+; deterministic tiebreak), owner-guarded `advance_phase`. | A7 (needs entries); A1 (needs notif CHECK for fan-out) |
| A9 | `dream_off_funding` | `dream_off_fund_pot`, `dream_off_donate` (giftable-provenance + daily cap; reuse `charge_sparkles` unmodified). | A4 |
| A10 | `dream_off_submit` | `dream_off_submit_entry` (atomic funding decision under pot lock + tier gate 1). | A9, A7 |
| A11 | `dream_off_settle` | `dream_off_settle_pot` (open→settling idempotency, pro-rata bounded-by-residual), `dream_off_credit` (service-role payout, bounded, escrow-closed). | A10 |
| A12 | `dream_off_reads` | Blinding DEFINER read RPCs: `get_game_room, get_game_gallery` (phase-blind + per-viewer shuffle), `get_my_ballot`, `get_game_activity`, `get_game_results`, `get_my_games`, `get_game_invite_preview` (anon-safe: topic/owner/count/phase only). | A3 |
| A13 | `dream_off_cast_votes` | `users.last_room_view_at` + **its GRANT**; `cast_votes` (structural ballot integrity, member-only, idempotent-replace, `PERFORM maybe_advance`). | A8 |
| A14 | `dream_off_cron` | `advance_expired_dream_offs()` (pg_cron every minute; gates on `dream_off_enabled`; LIMIT/SKIP LOCKED), `dream_off_stuck_count()`. | A8 |

### Stage B — edge deploys (after ALL Stage-A migrations applied)

Deploy together: **`dream-off-submit`** (new; enqueue-dream shape with the charge swapped for
`dream_off_submit_entry`), **`generate-dream`** (additive `payload.game_id` completion hook in a separate
`_shared/dreamOffComplete.ts` + tier gate 2 — reject+refund, not coerce), **`dream-queue-worker`** (additive
`'dream_off'` dispatcher case + `deadLetterAftermath` pot-aware refund), **`send-push`** (additive switch
cases + `reference_id` threading; `notificationRouting` `dream_off_` branch). All `--no-verify-jwt`.
*Deploy the worker + generate-dream as a matched pair (split-dependency guard).*

### Stage C — web + client

- Web (`../dreambot-web`, Vercel): add `/join/*` to AASA `paths`; ship `app/join/[code]/route.ts`
  (plain-HTML Route Handler, **not** RSC) + `opengraph-image.tsx` (branded topic card). Verify live.
- Client build (local EAS): all Room/hub/shelf UI, the `pendingDreamOffEntry` + `pendingInviteCode` store,
  the deep-link regex arms + `PendingInviteReplayer`, the onboarding hand-through — **all gated** behind
  `DREAM_OFF_ENABLED` (build-time) **and** `get_client_flags().dream_off_enabled` (runtime). Ships **dark**
  (no visible UI). Submit to App Store.

### Stage D — flip on

`UPDATE engine_config SET dream_off_enabled=true WHERE id=1;` — the only step that makes the feature
user-reachable. Do it after A–C are all live and the client build is in users' hands.

---

## 2. Shared-surface change register (all additive + guarded)

| Surface | Change | Why existing behavior is untouched |
|---|---|---|
| `dream_queue.source` CHECK (156:27) | Superset widen +`dream_off` | Every existing source still passes; ms-lock, no rewrite. A `dream_off` row still dead-letters until the worker branch ships (B). |
| `notifications` type CHECK (387) | Full-387-list + 6 types | Superset; must paste 387 verbatim (stale-rebuild drops a type). `reference_id`/`subtype` reused, no new column. |
| `notification_category`/prefs (358/205) | Map 6 types → 'Dream Off' | Additive branch; without it the types silently filter out of inbox. |
| `uploads` | **None** | Game entry = a normal `is_public=false, posted_at=NULL` create dream; existing RLS already isolates it. |
| `engine_config` (213/334) | Additive columns, defaulted | Metadata-only on the singleton; readers ignore unknown cols; `dream_off_enabled=false` = born dark. |
| `send-push` / `notificationRouting` | Additive switch/cascade arms | New `dream_off_*` prefix + `reference_id` guard; no existing type re-routes. **`isAlwaysPushType` unchanged** (nudges respect gates). |
| `generate-dream` | `payload.game_id`-fenced completion hook + tier gate | Fires only on game renders; create/nightly/dlt bytes unchanged. Hook in separate `_shared/dreamOffComplete.ts`. |
| `dream-queue-worker` | Additive `'dream_off'` case + pot-aware dead-letter | Slots beside existing cases; `default` throw unchanged. |
| Storage | New `game/` prefix + service-role `storage.copy()` | New prefix in existing bucket; no policy change; served only via blinding RPC. |
| `sparkle_*` RPCs | **None — read-only reuse** | `charge/refund/grant/gift` called unmodified; pot uses its own ledger. |
| Create flow / `store/dream.ts` | Separate `pendingDreamOffEntry` field + new focus-effect branch | Early-returns when null; normal create + `pendingCreatePreset` untouched. |
| `app/_layout.tsx` deep-link | Appended regex arms + `PendingInviteReplayer` | Existing post/photo/user matching unchanged; replayer inert without a stashed code. |

---

## 3. Kill-switch / dark-launch / rollback

- **Master gate `engine_config.dream_off_enabled` (default false).** Every *mutating* RPC returns
  `'disabled'` when false (the `gift_sparkles` pattern); the cron no-ops; the client hides all UI (via
  `get_client_flags()`); a cold deep-link renders the top-level route but shows a calm "not available yet"
  state (never a dead button).
- **Fastest kill (any time):** `UPDATE engine_config SET dream_off_enabled=false` — refuses all mutations,
  no-ops the cron, hides UI at next flag-read, freezes in-flight games harmlessly. No deploy, no build.
- **Rollback:** migrations are supersets/new-objects (leave them; harmless when unused). Edge fns:
  redeploy prior versions (every branch is source/game_id-fenced). Web: `git revert` + redeploy. **Client
  is not App-Store-reversible — which is exactly why it ships dark; the flag is the lever, never a client
  rollback.** Pot/ledger is append-only audited — reconcile via refund, never delete rows.

---

## 4. Test plan (rigor bar = the nightly-notification fix)

**Live-DB `*.dbspec.ts` (CI `db-tests`):** `dreamOffBlindness` (raw-API returns []; gallery phase-blind),
`dreamOffVoteIntegrity` (2-rose cap / no-double / no-self), `dreamOffAdvance` (idempotent + race),
`dreamOffTally` (tie + Dark-Horse @4+), `dreamOffPartialTurnout` (1-entry / 0-entry / min-2), `dreamOffRoster`
(roster-lock / cap / spectator), `dreamOffEntrySeam`, `dreamOffCron`, `dream_off_config`, `dream_off_pot_schema`,
`dream_off_fund` (idempotency / provenance / caps), `dream_off_submit` (double-submit / last-slot race /
tier-reject / insufficient-before-render), `dream_off_settle` (no-mint / escrow-closed / open→settling),
`dream_off_source_check`, + the C2 image-lifecycle spec (game copy survives album-copy + account delete).

**Fast jest (pure logic):** `phaseCta` (every State→UI row), `blindShuffle` (deterministic per-viewer),
`bucketMyGames`, the `joinMatch` regex (rejects post/photo/user), `inviteReplay` state machine, the
`dream-off-submit` payload builder, the `model ∈ tier` predicate (gate 2), the `mcLines` null-safe picker.

Validate dbspecs by pushing + `gh run watch` the `db-tests` job (no local Postgres).

---

## 5. Monitoring (clone existing fail-loud patterns)

- **Stuck games** (15-min, clone `dream-queue-monitor`): games past `phase_expires_at` not advanced, or
  `settling` pots not `settled`.
- **Pot-ledger imbalance** (5-min, clone `refund-stuck-jobs`, highest severity): per game `pot.balance ==
  SUM(ledger.amount)` and settled pots fully refunded — the escrow correctness canary.
- **Failed game renders**: extend `dream-queue-monitor`/`ai-failure-monitor` to include `source='dream_off'`.
- **Synthetic canary** (clone `queue-smoke-monitor`, gated on `dream_off_enabled`): a throwaway 2-account
  game end-to-end, self-cleaning.
- **Post-flip 48h watch:** `dream_off` light-pool contention vs normal create; dead-letter ratio; pushfail.

---

## 6. Build sequencing (dependency order for writing the code)

1. **Backend spine A1-A3 + A12 reads** + economy A2/A4 — the schema + blindness + kill-switch, with
   dbspecs. (The spine; everything hangs off it.)
2. **Economy A9-A11** (funding/submit/settle) + **spine A5-A8, A13-A14** (create→roster→entry→phase→votes→
   cron). Money + mechanics, dbspec-locked.
3. **Edge (Stage B)** — `dream-off-submit` + the `generate-dream`/worker completion + tier gate + send-push.
   The render backbone must work before a Room shows entries.
4. **Client C1-C3** (store + pure primitives + the Room) — depends on the read RPCs + entry pipeline.
5. **Client C5 + Web W1** (invite/deep-link/onboarding + landing page) — depends on the room + join RPC.
6. **Client C4 + W2** (hub/shelf + results card) — last polish/growth.
7. **Flip the flag (Stage D)** after the client build ships.

*Economy can lag: with `dream_off_donations_enabled`/prize off and pot unfunded, a game runs
free-to-owner-funded, so the Room (step 4) can be exercised before the full escrow lands.*

---

*Companion design: `DREAM_OFF_PLAN.md`. This build plan is the safe order-of-operations + the consolidated
blockers. The one open product decision (NSFW-forfeit refund) is the only thing gating a clean start.*
