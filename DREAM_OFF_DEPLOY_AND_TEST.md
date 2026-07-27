# Dream Off — Deploy, Test & Launch Runbook

**Audience:** the engineer (human or agent) taking Dream Off from "built + committed" to "live."
Everything below is on `main` and CI-green as of 2026-07-27. Born dark behind
`engine_config.dream_off_enabled` (currently **false**).

> Companion docs: `DREAM_OFF_CLIENT_PLAN.md` (client architecture), `DREAM_OFF_REMAINING_WORK.md`
> (backend rollout), `DREAM_OFF_PLAN.md` (product spec). Memory pin:
> `memory/project_dream_off_game_plan_state.md`.

---

## 0. TL;DR checklist to go live

1. `node scripts/check-dream-off-ready.js` → all ✅ (deck/config sane).
2. **Deploy the 5 edge functions** (§2) — safe anytime, inert until the flag is on.
3. **Test in the simulator** with the flag temporarily on (§4) — safe pre-launch (no shipped build
   has the client yet).
4. **Render-QA the cast (face-swap) entry** once for real (§7, item 2).
5. Ship an **App Store build** (born dark).
6. Add the **dreambot-web `/join/[code]`** landing + AASA path (§7, item 3).
7. After the build is live: **flip the flag** (§5) + run `scripts/smoke-dream-off-live.js` (§6).

---

## 1. What's built (and where)

**DB (migrations 400–422, all applied):** 7 mechanics tables (deny-all RLS), economy (tiers/pot/
ledger), the phase machine, the entry seam, blinding read RPCs, the DB-driven **pack catalog**
(`dream_off_packs`, 48 packs), and `get_game_players`. The topic deck is **7,300 topics** in
`dream_off_topics` (scene + cast).

**Edge (committed, NOT yet deployed):** `dream-off-submit` (new); `dream-queue-worker`, `generate-dream`,
`restyle-photo`, `send-push` carry Dream Off branches (all source-fenced on `source='dream_off'`).

**Client (`main`, born dark):**
- `components/dreamOff/*` — GoldStar (tactile foil vote sticker), StarMeter, Medal, PhaseCountdown,
  TopicBanner, PlayerAvatars, EntryCard, PhaseCta, ActivityFeed, DreamOffProfileEntry.
- `lib/dreamOffApi.ts` (I/O) + `lib/dreamOffParse.ts` (pure parsers) + `lib/dreamOffVote.ts`.
- `hooks/useDreamOff.ts` (queries + `dream_offs`-row realtime + mutations), `hooks/useDreamOffEnabled.ts`.
- `store/dreamOff.ts`, `types/dreamOff.ts`.
- Routes: `app/game/_layout.tsx`, `app/game/create.tsx`, `app/game/[id]/index.tsx` (the Room),
  `app/game/[id]/entry.tsx`.
- Entry points: profile header block + Settings "PLAY" row; deep links (`game/{id}`, `join/{CODE}`) +
  push routing in `app/_layout.tsx` / `lib/notificationRouting.ts`.

---

## 2. Why it's idle until you flip it (the gating model)

Two independent gates; **nothing runs on its own**:

- **Server:** `create_game` refuses (`dream_off: disabled`) while the flag is false → no games exist →
  the per-minute crons (`advance_expired_dream_offs`, `dream_off_send_nudges`) are no-ops on zero rows,
  and the edge functions are source-fenced so they only do Dream Off work when a `source='dream_off'`
  job flows through (impossible without a game).
- **Client:** every entry point gates on `useDreamOffEnabled()` (→ `get_client_flags()`), so the UI is
  invisible until the flag is true.

**The flag is GLOBAL** (one `engine_config` row — no per-user gate). Flipping it on turns Dream Off on
for **everyone who has a build containing the client**. Pre-launch, no shipped build has the client, so
flipping it on only affects a local dev/TestFlight build — which is exactly what makes sim testing safe.

### Deploy the edge functions

Deploy as a **matched set** (the 4 existing fns re-bundle the shared `_shared/dreamQueueLifecycle.ts`
that got the Dream Off branches; `dream-off-submit` is new). No new secrets — reuses the existing
`SERVICE_ROLE_KEY` / `ANON_KEY` / `DREAM_QUEUE_WORKER_TOKEN`.

```bash
supabase functions deploy dream-off-submit    --no-verify-jwt
supabase functions deploy dream-queue-worker  --no-verify-jwt
supabase functions deploy generate-dream      --no-verify-jwt
supabase functions deploy restyle-photo       --no-verify-jwt
supabase functions deploy send-push           --no-verify-jwt
```

---

## 4. Test in the simulator BEFORE launch

The button won't show until **(a)** the build contains the new code **and (b)** the flag is on.

```bash
# 1. Confirm the deck is ready
node scripts/check-dream-off-ready.js

# 2. Flip the flag ON (safe now — no public build has the client)
#    Supabase SQL editor:  UPDATE public.engine_config SET dream_off_enabled = true WHERE id = 1;

# 3. Deploy the edge fns (needed to SUBMIT a dream; §2)

# 4. Rebuild so the sim has the Dream Off client code
dreambot            # Debug + Metro
```

Then: Profile shows **Start a Dream Off** (and Settings → **PLAY**). `get_client_flags` is cached ~5 min
client-side, so a fresh app launch picks up the flag immediately.

To play the multiplayer loop in the sim you need **two accounts** (two simulators, or a sim + your
phone, or a sim + the live smoke script standing in as player 2). A **scene** pack needs no Dream Cast;
a **cast** pack needs the account to have completed onboarding (a Dream Cast).

**When done testing, flip the flag back OFF** before shipping the store build, then flip it on for real at
launch.

> Tip: there is no per-user flag. If you want a repeatable local-only toggle without touching the DB flag,
> add a `__DEV__`-gated override to `hooks/useDreamOffEnabled.ts` (e.g. honor `EXPO_PUBLIC_DREAM_OFF_DEV=1`).
> Note that only reveals the UI — `create_game` still checks the DB flag, so the DB flag must be on to
> actually create a game.

---

## 5. The flip (Stage D) + rollback

```sql
-- go live
UPDATE public.engine_config SET dream_off_enabled = true WHERE id = 1;
-- instant kill (rollback)
UPDATE public.engine_config SET dream_off_enabled = false WHERE id = 1;
```

Allow ~60s for edge module caches (per-isolate TTLs) + the client flag cache to catch up.

---

## 6. Scripts

| Script | What | When |
|---|---|---|
| `scripts/check-dream-off-ready.js` | Read-only: catalog / topics / tiers / RPC sane | Before the flip |
| `scripts/smoke-dream-off-live.js` | Drives the REAL stack with 2 test users: create → join → room reads → roster → advance → owner-guard → cancel (self-cleaning; no render) | After deploy + flip |
| `scripts/check-dream-off-health.js` | Overdue games / unsettled pots / ledger imbalance | Ongoing (also the hourly monitor) |

`smoke-dream-off-live.js` needs the flag on + two existing test accounts:
`DREAM_OFF_SMOKE_EMAIL_1/PW_1` and `_2/PW_2` in `.env.local`. It cancels the game it creates (refunds),
so it leaves no live game. It deliberately does **not** render (no cost / no dependency beyond the RPCs).

---

## 7. Automated test coverage (the safety net)

**CI `db-tests` (real SQL, throwaway Postgres) — 20 dbspecs:** create, phase-machine, reads, cast-votes,
entry-seam, settle, funding, submit, roster, cron, nudges, fail-entry, vote-integrity, economy,
shared-surface, pack-category, pack-catalog, get-game-players, and **`dreamOffFullLoop`** — a full-
lifecycle integration test (submission → voting → results across `advance_phase` + `cast_votes` + the
read RPCs, asserting blindness during voting and reveal at results). *This is the seam net: rename an RPC
field or break a transition and a spec fails.*

**CI `check` (fast jest) — 30 client tests:**
- `dreamOffParse.test.ts` (20) — every RPC payload → domain-type mapping, incl. malformed/partial
  payloads degrading to safe defaults. **A migration that renames a field breaks a test here instead of
  a screen.**
- `dreamOffTopicWording.test.ts` — the "Show me…" / "You as…" framing + medal/superlative maps.
- `dreamOffVote.test.ts` — the ≤2-star toggle rule.

Run locally: `npm run test` (fast jest) · dbspecs validate on push (`gh run watch`).

**Still worth adding later:** a render-path assertion (dream-off-submit → worker → completion attaches the
entry) — currently exercised only end-to-end/manually because it costs a real render.

---

## 8. Manual 2-account test (the real multiplayer pass)

1. Profile shows **Start a Dream Off**; Settings has the **PLAY** row.
2. Create a **scene** game → lobby shows the invite **code**; packs appear in the picker.
3. Account 2 opens `dreambot://join/<CODE>` (cold, pre-install → post-install re-tap) → lands in the
   lobby; owner sees **2 players** + avatars.
4. Owner **Start** → both **Make your dream** → renders land ("your dream's in ✓"; avatars un-dim).
5. Owner **Start voting** → both **slap gold stars** (≤2, re-tappable) → owner **Reveal** →
   **gold/silver/bronze** podium with Winner / Runner-up / Dark Horse labels.
6. **Cast game:** repeat with a cast pack → confirm the face-swap casts you in.
7. **Push:** a `dream_off_your_turn` / `voting_open` push opens the Room at the right phase.
8. **Economy:** `select * from dream_off_pot_ledger where game_id = '<id>'` — pot debits on submit,
   refunds pro-rata at settle; a cancel refunds everyone.

---

## 9. Remaining before public launch

1. **Deploy the 5 edge functions** (§2). ← do first
2. **Render-QA the cast (face-swap) entry** — `app/game/[id]/entry.tsx` builds the render body by
   mirroring the create path (worded "You as…" prompt + `vibe_profile`). Per CLAUDE.md hard rules,
   face-swap prompts are sensitive; run one real cast render and confirm the swap before launch. Scene
   entries (no face) are the safe default.
3. **dreambot-web `/join/[code]`** landing page (plain HTML Route Handler, NOT RSC — see
   `project_dreambot_web_post_deeplink_metadata`) calling `get_game_invite_preview`, + add `/join/*` to
   the AASA paths, so the universal invite link works for users without the app. The `dreambot://` scheme
   + in-app routing already work.
4. **Stage D flip** (§5).

---

## 10. Monitoring & diagnostics

- **`dream-off-monitor.yml`** (hourly) → `scripts/check-dream-off-health.js`: overdue games, unsettled
  pots, pot-ledger imbalance. Fails loud (GitHub failure email).
- Render failures: the shared queue forensics — `dream_queue.current_stage` breadcrumbs +
  `ai_generation_log`; `node scripts/check-forensics.js [userId]`.
- Realtime: only the `dream_offs` ROW is published (entries/votes NEVER — the blindness guarantee). If
  you ever touch the realtime publication, do not add entries/votes.

---

## 11. Handoff notes / gotchas

- **Migrations run by hand** in the Supabase SQL editor; each ships a `*.dbspec.ts`. After applying a
  migration that adds/changes an RPC, **regenerate types**:
  `supabase gen types typescript --project-id jimftynwrinwenonjrlj > types/database.ts` — the client
  RPC calls won't compile until the RPC name is in the generated Functions union.
- **Shared-CI-DB gotcha:** all dbspecs share one Postgres, so a function defined by two specs with
  different signatures collides (this bit `create_game`'s 6-arg vs 8-arg — both specs now drop both
  signatures first). If you add a spec that (re)defines an existing function with a new signature, drop
  the other signatures in its `beforeAll`.
- **One id threads everything:** `dream_queue.id == entries.payment_reference == pot-ledger reference_id
  == sparkle reference_id`. Don't break that.
- **Never front-load/amplify the scene on the cast face-swap prompt** (CLAUDE.md) — keep the couple
  side-by-side with a clear gap between faces (dual-swap detector).
