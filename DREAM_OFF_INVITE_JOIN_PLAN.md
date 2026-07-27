# Dream Off — Invite & Join Experience Plan

**Goal:** getting friends into a game is the make-or-break moment. It must be **delightful,
low-friction, and idiot-proof** — every path is few taps, every state is obvious, and **there are no
dead-ends** (every "can't" has a plain-language reason + an obvious next step). This is the build spec.

**North-star:** *from "let's play" to "we're all in the lobby" in the fewest taps, no matter how the
invitee got the invite (push, link, or a code read aloud), and no matter whether they have the app yet.*

---

## 1. Principles (the bar)

1. **Every vector converges on the Room.** Push, link, and code all land the player in the same Room,
   which renders the correct state for their role. One destination, no divergent flows.
2. **≤2 taps to joined** on the happy paths (push→Join = 2; link = 1).
3. **Forgiving input.** The code accepts lowercase, trims spaces, ignores ambiguous glyphs, and pastes
   cleanly. You can't "type it wrong" in a way that silently fails.
4. **No dead-ends.** Not-found / full / already-started / cancelled / removed each get a warm, specific
   message and a next step — never a blank screen or a raw error.
5. **Redundant discovery.** If a push is missed, the game still appears in the profile "Your Dream Offs"
   shelf with an "Invited" badge. If a link doesn't deep-link (Android/deferred-install quirks), the code
   is shown so they can type it. Belt + suspenders everywhere.
6. **DreamBot voice + delight.** Personal, funny copy; a satisfying join beat (avatars pop, haptic).

---

## 2. The invite code — shorten to **6 chars**

Currently 10 chars (`ABCDEFGHJKMNPQRSTVWXYZ23456789`, no I/L/O/U/0/1). The code is **not a secret** — it
only lets you *request* to join a friendly game, gated by RLS + rate limits. 10 is Jackbox-overkill.

**→ 6 chars = ~594M combos** — ample vs. lifetime game count, far nicer to read/type/say. One migration
redefines `dream_off_gen_invite_code`; existing games keep their codes; the deep-link regex
(`{6,16}`) + `join_game_by_code` already accept any length. Displayed as 6 chunky tap-to-copy tiles.

---

## 3. Owner: three invite affordances (priority order), all in the lobby

1. **Invite friends (primary, in-app):** `InvitePeopleSheet` — your mutual-follow friends as tappable
   avatars, **closest first** (`useShareableVibers` vibe score), multi-select → `invite_players` →
   `dream_off_invite` push. Haptic per tap; "Invited N ✓" confirm; friends already in are filtered out.
   *Lowest friction for people already on DreamBot.*
2. **Share link (anyone):** OS share sheet with `https://dreambotapp.com/join/<CODE>` + a fun message.
   Works to iMessage/WhatsApp/etc., and for friends who aren't mutuals or aren't on the app yet.
3. **The code (in-person / voice):** shown big, tap-to-copy. For "just type ABC123."

Roster avatars fill in **live** as people join (realtime on the `dream_offs` row + a 12s poll on
`get_game_players`). Owner sees "3 in" with faces; **Start** enables at ≥2 players.

---

## 4. Invitee: the three join vectors

| # | Vector | Flow | Status |
|---|--------|------|--------|
| A | **Invite push** (owner picked them in-app) | push → Room (`/game/{id}`) → seated `invited` → **"Join the Dream Off"** button → `accept_invite(game_id)` → `active` | ⚠️ needs `accept_invite` RPC (code-less) |
| B | **Share link** (iMessage etc.) | universal link → app `/join/CODE` → `join_game_by_code` → `active` → Room (1 tap) | ✅ built (client + RPC) |
| C | **Typed code** (voice / text / post-install) | profile **"Join with a code"** → sheet → `join_game_by_code` → `active` → Room | 🔨 to build |

### Why `accept_invite` is needed (the one real gap)
`join_game_by_code` already flips `invited → active` — **but requires the code.** The invite *push*
routes to `/game/{id}` (reference_id = game_id), and `get_game_room` deliberately hides the code from
non-owners. So a push-invited friend has no code to accept with. `accept_invite(p_game_id)` closes it:
invited-or-new → `active` (or `pending` if `join_approval`), code-less, owner-vouched, respecting phase
(setup/submission), `max_players`, and `removed`. It mirrors `join_game_by_code`'s invited branch keyed
by game_id.

---

## 5. Room lobby states by role (exact copy)

- **Owner (setup):** topic · roster avatars · **Invite friends** / Share / code · **Start the Dream Off**
  (disabled < 2 with "You need at least 2 players").
- **Active member (setup):** topic · roster · "You're in — waiting for **{owner}** to start 🎬".
- **Invited, not yet accepted:** topic peek · "**{owner}** invited you to a Dream Off" · **Join the
  Dream Off** (`accept_invite`) · a subtle "Not now" (leaves; no guilt).
- **Pending** (only if `join_approval` on — off by default in v1): "Waiting for {owner} to let you in…".
- **Non-member, private/live game:** "This Dream Off is invite-only" (+ a way back).

---

## 6. The idiot-proof matrix — every failure has a warm message + next step

| Situation | What the player sees | Next step |
|---|---|---|
| Code not found | "Hmm — no game with that code. Double-check it with your friend?" | stay on sheet, code cleared |
| Game already in voting/results | "This Dream Off already kicked off — you *juuust* missed it 😅" | offer "Start your own" |
| Game full (`max_players`) | "This one's full! (max {N} dreamers)" | offer "Start your own" |
| Already a member | *(no error)* silently opens the Room at the right state | — |
| Cancelled / no-contest | "This Dream Off was called off." | offer "Start your own" |
| Invite revoked | "This invite link's no longer active." | offer "Start your own" |
| Removed by host | "The host removed you from this game." | back to profile |
| Not signed in (link/push pre-auth) | sign-up flow, then **auto-lands in the game** (PendingInviteReplayer) | — (already built) |
| Offline / fetch fail | "Couldn't reach the game — tap to retry." | retry button |

Code input is **forgiving**: uppercases, trims, strips spaces/dashes, paste-friendly, 6 chunky boxes,
auto-submits on the 6th char, disabled Join until 6 valid chars.

---

## 7. Delight touches

- **Invite push copy** (DreamBot voice): `🎭 {owner} pulled you into a Dream Off — "{worded topic}". You in?`
- **Join beat:** on accept/join, the roster avatar pops in with a spring + a light haptic; a tiny "You're
  in!" flourish.
- **Closest friends first** in the picker (vibe score) — feels personal, not a raw contact dump.
- **Live roster:** faces fill in as people arrive; "waiting on 2" reads at a glance.
- **The code as 6 gold-tinted tiles**, tap anywhere to copy → "Copied ✓" + haptic.
- **Empty friend list** → gentle: "No mutuals yet — share the link and rope someone in 😈".

---

## 8. `join_approval` — default OFF in v1

The schema supports host-approval (`pending` state), but for max low-friction v1 ships with
`join_approval = false` (create flow never sets it). The `pending` UI state is spec'd above so it's ready,
but no owner-facing toggle in v1. (Fast-follow if griefing ever shows up.)

---

## 9. Build checklist

**Backend (2 small migrations, hand-applied + dbspec each):**
- `dream_off_gen_invite_code` → 6 chars.
- `accept_invite(p_game_id)` RPC — invited/new → active (or pending), code-less, owner-vouched, phase +
  cap + removed guards; returns a status the client maps to §6 messaging. Fires the `joined` event.

**Client:**
- Wire `InvitePeopleSheet` (built) into the lobby behind an **Invite friends** button.
- `app/game/join.tsx` — the forgiving 6-char code sheet → `join_game_by_code` → Room, with the §6 status
  → copy mapping.
- Profile **"Join with a code"** secondary button (under "Start a Dream Off") → opens the code sheet.
- Room: the **invited** "Join the Dream Off" state → `accept_invite` (+ `useAcceptInvite` hook + api).
- Status→copy helper (`lib/dreamOffJoinStatus.ts`, pure + unit-tested) so both the code sheet and the
  push-accept share one mapping. (Testable safety net.)

**Web (dreambot-web, separate repo):**
- `/join/[code]` landing (plain HTML Route Handler, NOT RSC) → `get_game_invite_preview` → "{owner}
  invited you to a Dream Off: '{topic}'" + App Store button + **the code shown big** (so post-install
  they can type it if the deep link doesn't auto-replay). Add `/join/*` to AASA.

**Tests:** `dreamOffJoinStatus` unit test; `accept_invite` + shortened-code-gen dbspecs; extend the live
smoke to exercise `accept_invite`.

---

## 10. Already built (holding for this plan)
- `components/dreamOff/InvitePeopleSheet.tsx` (mutual-follow multi-select picker) — needs wiring.
- `join_game_by_code` RPC + `useJoinGame` hook + the deep-link `/join/CODE` auto-join + PendingInviteReplayer.
- `invite_players` RPC + `useInvitePlayers` hook + `dream_off_invite` push.

---

## 11. Open decisions (confirm before build)
1. **Code length = 6** — good? (or 4 for Jackbox-max-short, accepting a smaller lifetime space.)
2. **`accept_invite` RPC** — approved to add?
3. **`join_approval` OFF in v1** — agreed (no approval friction)?
4. **Invite push copy** — the voice above land, or tweak?
