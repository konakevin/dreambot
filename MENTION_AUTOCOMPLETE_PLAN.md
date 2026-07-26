# @-Mention Autocomplete — Implementation Plan

**Status: BUILT (2026-07-25).** Inline `@`-mention autocomplete in the comment composer + all three
caption inputs. Candidate scope = **hybrid: follows pinned on top (instant, in-memory), global username
search streams in underneath** (Kevin's confirmed choice — snappy AND covers all users). Shipped files:
`lib/mentionAutocomplete.ts` (pure caret logic + `__tests__/lib/mentionAutocomplete.test.ts`, 13 tests),
`hooks/useMentionCandidates.ts`, `components/MentionSuggestions.tsx`, wired into
`components/CommentOverlay.tsx` (replaced the old naive global one), `app/post/new.tsx` (×2),
`components/EditDescriptionModal.tsx`. No migration, no edge deploy — pure client. The
render/tap/notify half was already live, so mentions link + notify with zero backend work.

Below is the original design for reference. To change candidate scope later, it's the `wantGlobal` block
in `hooks/useMentionCandidates.ts` (§7).

---

## 0. The big picture — most of the pipeline already exists

The `@mention` render → tap → notify chain is **already built and live**. This feature is almost entirely
a **compose-time UI + candidate-source** job. Do NOT rebuild the parts that exist.

| Layer | Status | Where |
|---|---|---|
| Render `@name` as tappable blue link (captions) | ✅ done | `lib/hashtags.ts` `CAPTION_TOKEN_RE` → `components/dreamCardBits/ExpandableDescription.tsx:60-84` |
| Render `@name` as tappable link (comments) | ✅ done | `components/CommentRow.tsx:242-258` (inline `.split(/(@[a-zA-Z0-9_.]+)/g)`) |
| Tap a mention → open that profile | ✅ done | `lib/mentions.ts` `openMentionProfile()` (exact `eq('username')` then case-insensitive `ilike` fallback; blocks private bots) |
| "X mentioned you" notification + push + inbox copy + routing | ✅ done | DB triggers `create_comment_notifications` / `create_post_mention_notifications` (`supabase/migrations/383_post_description_mentions.sql`), types `comment_mention` / `post_mention` already in the `notifications_type_check` (387), push copy in `send-push`, inbox copy in `app/inbox.tsx:229-237` |
| Sanitizer preserves `@username` | ✅ confirmed safe | `_shared/sanitizeUserText.ts` + migration-279 trigger strip control/zero-width/bidi/`{}[]<>` but NOT `@` or `[A-Za-z0-9_]` |
| **Comment composer autocomplete** | ⚠️ exists, wrong shape | `components/CommentOverlay.tsx` `handleTextChange:313`, `completeMention:333`, dropdown `629-651` — but searches **ALL users** (`useSearchUsers`, global substring) and is **caret-naive** (`lastIndexOf('@')`) |
| **Caption/description autocomplete** | ❌ missing | `app/post/new.tsx:397-406` + `:480-489`, `components/EditDescriptionModal.tsx:93` — no autocomplete at all |

**Implication:** no new migration, no new notification type, no render changes. The triggers fire on
whatever `@handle` lands in the stored text. Net-new work is the input-side suggestion UI + follow-scoped
candidates, unified so comments and captions behave identically.

**Dead code note:** `app/comments.tsx` (16.9 KB) has its own copy of a comment mention dropdown but
**nothing routes to `/comments`** — the live composer is `components/CommentOverlay.tsx` (rendered via
`FullScreenFeed`). Confirm `app/comments.tsx` is orphaned and ignore/delete it — do NOT wire the new hook
into it.

---

## 1. Architecture — three new pieces + wiring

### 1a. `hooks/useMentionAutocomplete.ts` (new) — pure caret-aware token logic

Input-agnostic. The caller feeds it the current `text` and `selection` (`{start,end}` from
`onSelectionChange`); it owns all the parsing.

```ts
// Detect an ACTIVE @token whose end is at the caret.
// - '@' must sit at string-start OR be preceded by whitespace/newline
// - token chars: [A-Za-z0-9_] (usernames have NO dots — see §4), 0..30 long
// - the token must END at the cursor (so we edit the token the caret is in,
//   NOT the last '@' in the whole string — the bug in today's CommentOverlay)
const ACTIVE_MENTION_RE = /(?:^|\s)@([A-Za-z0-9_]{0,30})$/;

export function useMentionAutocomplete(text, selection) {
  const before = text.slice(0, selection.start);
  const m = selection.start === selection.end ? before.match(ACTIVE_MENTION_RE) : null;
  const active = !!m;
  const query = m?.[1] ?? '';
  // range = [indexOf '@', caret] for splicing on complete()
  const start = active ? before.length - (query.length + 1) : -1;
  return {
    active,
    query,
    complete(username) {
      // returns { text: nextText, cursor: nextCaretIndex }
      const next = text.slice(0, start) + '@' + username + ' ' + text.slice(selection.start);
      return { text: next, cursor: start + username.length + 2 }; // after "@username "
    },
  };
}
```

Notes:
- Only fires on a **collapsed** caret (`start === end`) — no dropdown mid-selection.
- `complete()` returns the new caret index; the caller sets `selection` to place the cursor after the
  inserted `@handle ` (RN controlled `selection`).

### 1b. `hooks/useMentionCandidates.ts` (new) — follow-scoped suggestion source

```ts
export function useMentionCandidates(query, { active }) {
  const me = useAuthStore.getState().user?.id;
  const { data: following = [] } = useFollowingList(me);      // cached 60s, {id,username,avatar_url,is_bot}
  const blocked = useBlockedIds();
  // 1) in-memory PREFIX filter of who you follow (instant, no network)
  const local = following
    .filter(u => !blocked.has(u.id) && !PRIVATE_BOT_USERNAMES.has(u.username))
    .filter(u => u.username.toLowerCase().startsWith(query.toLowerCase())
             || (u.display_name ?? '').toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 8);
  // 2) [RECOMMENDED SCOPE] broaden to global search only when local is thin
  const needGlobal = active && query.length >= 2 && local.length < 5;
  const { data: global = [] } = useSearchUsers(needGlobal ? query : '', { includeSelf: false });
  // merge: follows first (deduped by id), fill remaining slots with global
  return dedupeFollowsFirst(local, global).slice(0, 8);
}
```

- **Follows-first** is instant + offline-ish (in-memory filter of the already-cached following list).
- The **global fallback** (`useSearchUsers`, existing) only runs when the user has typed ≥2 chars and
  fewer than ~5 follow matches — so you can still `@` someone you don't follow. Toggle this block per §7.
- Excludes self, blocked, and private bots to mirror `openMentionProfile` runtime behavior.

### 1c. `components/MentionSuggestions.tsx` (new) — the dropdown

Purely presentational. Props: `candidates`, `onPick(username)`, positioning. Row = avatar (via
`avatarUrl()` resizer from `lib/imageUrl`, letter fallback) + `@username` + optional `display_name` +
a subtle "following" hint. Mirror the existing dropdown markup at `CommentOverlay.tsx:629-651` /
`components/FollowUserRow.tsx:17-55`. Rendered **above** the comment input bar and **below** the caption
field (keyboard-avoidance already handled by each host).

### 1d. Wire `selection` tracking into the four inputs

Each host adds: `selection` state, `onSelectionChange={e => setSel(e.nativeEvent.selection)}`, controlled
`selection={sel}`, mounts `<MentionSuggestions>` when `active`, and on pick calls
`complete(username)` → `setText(next)` + `setSel({start:cursor,end:cursor})`.

- `components/CommentOverlay.tsx` — **replace** the existing naive autocomplete
  (`handleTextChange` last-`@` logic, `mentionStart` ref, `completeMention`) with the shared hook +
  component. Net simplification.
- `app/post/new.tsx` — both TextInputs (`:397-406` single, `:480-489` gallery) share the one
  `description` state (`:105`).
- `components/EditDescriptionModal.tsx` — RN-core TextInput, already has `inputRef` (`:44`).

---

## 2. Integration risk to verify FIRST

`app/post/new.tsx` and `CommentOverlay.tsx` import `TextInput` from `@/components/AppText` (a styled
wrapper), not RN core. **Confirm the wrapper forwards `onSelectionChange`, `selection`, and `ref`.** If it
spreads `...props` it's fine; if it whitelists props, add these three. `EditDescriptionModal` uses RN core
`TextInput` directly (no risk).

---

## 3. Matching rules (defaults — all cheap to change)

- **Trigger:** `@` at string-start or after whitespace/newline. Show suggestions immediately on `@`
  (0+ chars → top follows), narrowing as they type. Hide on space, on a completed pick, or when the caret
  leaves the token.
- **Match:** **prefix** on `username` (and `display_name`), case-insensitive. Matches Kevin's `@sun` →
  `sunnysteph`/`sunny` example and IG/TikTok. (Substring is a one-word swap if he prefers it.)
- **Insert:** exact-case `username` + trailing space, token shape `@[A-Za-z0-9_]{1,30}`. Exact case means
  the existing `openMentionProfile` `eq('username')` fast-path resolves on the first query.
- **Exclusions:** self, blocked users, private bots (`PRIVATE_BOT_USERNAMES`). Decide whether to include
  followable public **bots** — harmless (a bot mention just no-ops the push to a bot), lean include.

---

## 4. Charset contract (do not drift)

Three regexes must agree so "what you can autocomplete" == "what renders as a link" == "what notifies":
- Usernames are constrained to `^[A-Za-z0-9_]{1,30}$` (`supabase/migrations/279_...:104`); client
  registration is stricter, effectively lowercase `[a-z0-9_]{3,20}` (`components/UsernameNudge.tsx`).
- Existing tappable-token tokenizer allows a trailing dot: `@[a-zA-Z0-9_.]+`
  (`lib/hashtags.ts:13`, and the notify triggers `@([a-zA-Z0-9_.]+)`). The dot is only there so a
  sentence-ending `.` isn't swallowed — **usernames themselves have no dots.**
- ➜ The autocomplete **trigger/insert** regex uses `[A-Za-z0-9_]` (no dot). This is a subset of the
  render/notify charset, so every inserted handle both links and notifies. Safe.

---

## 5. Data layer (all exists — reuse, don't rebuild)

- `hooks/useFollowingList.ts` — `useFollowingList(userId)` → `{id, username, avatar_url, is_bot}`,
  paginated past the PostgREST 1000-row cap, cached 60s, already filters private bots + null joins.
  **Primary candidate source.**
- `hooks/useSearchUsers.ts` — global `ilike('username','%q%')`, `.limit(20)`, ≥2-char gate, trigram
  index `idx_users_username_trgm`. **Global fallback source.** (Note: substring; for prefix-only global,
  change to `${q}%`.)
- Column grants: `username`, `display_name`, `avatar_url`, `is_public`, `is_bot` are granted to
  `anon`/`authenticated` (`280_hide_economic_columns.sql:57-61`). `email` + economic cols are withheld —
  don't touch.
- `follows` table is publicly SELECTable (`003_follows.sql`); pending private-account requests live in
  `follow_requests` and are NOT in `follows`, so "people I follow" is already the correct accepted set.

---

## 6. Testing

- **Unit (fast jest)** for `useMentionAutocomplete` token logic — the highest-value tests, since the caret
  math is where bugs live:
  - `@` at start / after space / after newline → active; `@` mid-word (`a@b`) → inactive.
  - caret in the MIDDLE of text with an earlier completed `@handle` → targets the token under the caret,
    not the last `@`.
  - `complete()` splices at the right range and returns the correct caret index.
  - selection (start≠end) → inactive.
  - 30-char cap; trailing dot/space closes the token.
- **Candidate filter** unit test: prefix match, self/blocked/private-bot exclusion, follows-first dedupe.
- No dbspec needed (no schema change). The existing `__tests__/db/postMentionNotifications.dbspec.ts`
  already locks the notify half.
- Manual: type `@`, mid-string edits, pick via tap, verify the stored comment/caption renders the blue
  link and the mentioned user gets the inbox + push notification (already-built half).

---

## 7. OPEN DECISION — candidate scope

Today's comment autocomplete is **global** (any user). Kevin described **"people they follow."**

| Option | Behavior | Trade-off |
|---|---|---|
| **Follows first, then all (RECOMMENDED / assumed)** | Follows filtered in-memory first; broaden to global search when matches are thin | IG/TikTok feel; can still mention non-followed users; slightly more code (the §1b fallback block) |
| Follows only | Strictly people you follow | Simplest + most private; but you can't autocomplete someone you don't follow (must type the full handle by hand — still links + notifies) |
| All users, follows ranked top | Search everyone, sort follows to top | Widest reach; noisier, surfaces strangers/bots — least like what Kevin described |

To switch: it's the `needGlobal` block in `useMentionCandidates` (§1b) — delete it for "follows only";
always-run + concat for "all, ranked".

---

## 8. Build order

1. Verify `AppText` TextInput forwards `selection`/`onSelectionChange`/`ref` (§2). Patch if needed.
2. `useMentionAutocomplete` + its unit tests.
3. `useMentionCandidates` (follows-first) + filter test.
4. `MentionSuggestions` component.
5. Swap it into `CommentOverlay` (replacing the naive version) — ship + eyeball first.
6. Extend to `app/post/new.tsx` (×2) and `EditDescriptionModal`.
7. Confirm `app/comments.tsx` is dead; delete or leave.

No edge-fn deploy, no migration, no App Store gate — pure client, shippable in a normal build.
