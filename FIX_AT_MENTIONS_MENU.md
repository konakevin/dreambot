# Fix: @-Mention Menu — 5-Star UX Plan

**Status:** Plan for review (2026-07-26). Client-only, additive, low-risk. Not yet built.

---

## 1. Context — what exists today

We recently shipped `@`-mentions in **comments and post captions** (commit `7996643c`), which notify the
tagged user (`post_mention` / comment-mention). The autocomplete is built from four shared pieces plus
**four separate host surfaces**, each doing its own positioning:

**Shared logic (good, keep):**
- `lib/mentionAutocomplete.ts` — pure, unit-tested caret math. `detectMention(text, selection)` returns
  `{ active, query, start }` for the `@token` the caret is currently inside (regex
  `/(?:^|\s)@([A-Za-z0-9_]{0,30})$/`). `applyMention()` replaces the token with `@username `.
- `hooks/useMentionCandidates.ts` — the data source. Follows filtered **in-memory instantly**
  (`startsWith(q)`), global username search streams in underneath when follow matches thin out
  (`q.length >= 2`). Max 6, excludes self/blocked/private-bots.
- `components/MentionSuggestions.tsx` — **purely presentational** list of rows (avatar · username ·
  "following"). `maxHeight: 200`. **Position is entirely the caller's responsibility** (a `style` prop).

**Four host surfaces, four different (ad-hoc) placements:**
| Surface | File | How it renders the list today |
|---|---|---|
| New-post caption (single + gallery) | `app/post/new.tsx:414,503` | `<MentionSuggestions>` **inline, above the `TextInput`, inside the scroll**. |
| Comment composer | `app/comments.tsx` | Inline near the `inputBar` under a `KeyboardAvoidingView`. |
| Comment overlay (feed) | `components/CommentOverlay.tsx:488` | Absolute, `zIndex:20`, inside its custom keyboard-pinned pane. |
| Edit-description modal | `components/EditDescriptionModal.tsx:130` | Inline inside a `KeyboardAvoidingView` modal. |

The app already depends on **`react-native-keyboard-controller`** and uses `KeyboardAvoidingView`,
`KeyboardAwareScrollView`, `KeyboardStickyView`, and `useReanimatedKeyboardAnimation` across these screens
— so the primitives for a precise, animation-grade anchored sheet are already in the bundle.

---

## 2. Problem statement (the two bugs)

**Bug A — it fires on the bare `@` with nothing to filter.** The instant you type `@`, the *entire* follow
list drops in. With no query it's noise, and it appears before you've given it any "guidance on what
sublist to show." (Screenshot: `@|` with the full follow list already open.)

**Bug B — it's positioned wrong on every surface.** Because each host renders the list **inline / ad-hoc**,
it:
- **flows *down*** from the input and immediately slides **off-screen behind the keyboard** (new-post
  caption — you lose sight of the caption box you're typing in), and
- **floats *over* the image thumbnail and comment rows** in the comment view (it overlaps content because
  it's rendered into the layout flow / an absolute pane that isn't anchored to the input).

The through-line: **the suggestion list is not a proper floating layer anchored to the composer.** It
should behave like an input-accessory sheet — pinned directly above the text field (which is pinned above
the keyboard), growing **upward**, floating **on top of everything**, so you always see both your text and
the suggestions.

---

## 3. Root-cause analysis (file:line)

| # | Root cause | Evidence |
|---|---|---|
| A | `detectMention` returns `active:true` even with an **empty** query (correct for token tracking), and `useMentionCandidates` does `startsWith('')` → **matches every follow**. So a bare `@` shows the whole list. | `lib/mentionAutocomplete.ts:32-44`; `hooks/useMentionCandidates.ts:44` |
| B | `MentionSuggestions` is **position-agnostic** — every host places it itself, inline, with no shared "anchor above the input, grow up, float above content" contract. Four divergent, buggy placements. | `components/MentionSuggestions.tsx:24-27`; `app/post/new.tsx:414,503`; `app/comments.tsx`; `CommentOverlay.tsx:488`; `EditDescriptionModal.tsx:130` |

**Battle scar to respect (this shapes the fix):** `CommentOverlay.tsx:283-287` documents that
`KeyboardStickyView` **corrupts inside an absolutely-positioned pane** — the shared reanimated keyboard
value "ends up corrupted," so it rolled its own input-accessory keyboard handling. **Lesson: the new sheet
must not drop a fresh `KeyboardStickyView` into an absolute pane; it must ride the *same* keyboard signal
its host input already uses.** Also `app/post/new.tsx:36-38` documents a Touchable that must win the
**first tap while the input is focused** — the sheet rows must reliably receive that first tap
(`keyboardShouldPersistTaps="handled"` + the same Touchable used for the caption's action buttons).

---

## 4. The 5-star UX target

What "5-star" means for this menu, drawn from the best (Instagram / iMessage / Slack / Notion) and our own
constraints:

1. **Anchored to the composer, never covering it.** The sheet sits **directly above the text field**, which
   sits directly above the keyboard. You always see what you're typing *and* the suggestions.
2. **Grows upward.** New matches push the sheet **up**, not down. Its bottom edge is pinned to the input's
   top; it never grows into the keyboard.
3. **A true floating layer.** Renders **on top of all content** (image thumb, rows) — it's an overlay, not
   an inline block, so it never shifts or is clipped by layout.
4. **Rides the keyboard perfectly.** It tracks the keyboard's show/hide/height in lockstep (no jump, no lag)
   using the *same* keyboard signal the host input uses — smooth as an input accessory.
5. **Only appears with intent.** Shows after **≥1 character** past the `@` (Kevin's call), so it always has
   a query to narrow on. Dismisses the instant the token is broken (space/newline), the caret leaves it, the
   field blurs, or you tap outside.
6. **Instant + progressive.** Follows appear immediately (in-memory); global matches stream in underneath —
   already true, keep it.
7. **Legible + scannable.** Avatar · username with the **matched prefix emphasized** (`@**sun**nysteph`) ·
   "following" hint. ~5 rows visible, scrollable if more, bottom-aligned so it grows up.
8. **Feels alive.** A subtle **slide-up + fade-in** on appear, fade-out on dismiss; a light selection
   haptic. A rounded top edge + soft elevation so it reads as a floating sheet distinct from the input bar.
9. **Identical on all four surfaces.** One shared component and behavior — no more four divergent
   placements.
10. **Robust across devices** (SE/mini → Max, iPad) and **accessible** (≥44pt targets, VoiceOver labels,
    taps that don't dismiss the keyboard).

---

## 5. Proposed fix

### Part 1 — Trigger gate: require ≥1 char (small, shared, fixes Bug A)

Gate the *display* on a non-empty query while keeping `detectMention.active` intact (it's still needed so
`applyMention` can replace the token). Two coordinated one-liners in the **shared** layer so all four
surfaces inherit it for free:

- `hooks/useMentionCandidates.ts`: return `[]` when the trimmed query is empty (`q.length < 1`) — no
  candidates on a bare `@`.
- The host "should I show the sheet?" check becomes `mention.active && mention.query.length >= 1` (folded
  into the shared hook below so no host re-implements it).

*(Considered but rejected for v1: showing a "top/recent follows" list on the bare `@` like IG. Kevin's
guidance is explicit — wait for a character. Easy to revisit later as an enhancement.)*

### Part 2 — One shared, keyboard-anchored floating **MentionSheet** (fixes Bug B)

Replace all four ad-hoc inline renders with a single overlay component + a hook that owns trigger-gating,
positioning, and animation. Hosts stop thinking about placement entirely.

**New API:**
```ts
// hooks/useMentionSheet.ts  — one call per composer
const mention = useMentionSheet({ text, selection, onInsert /* (newText, caret) => void */ });
// returns { active, candidates, onPick, sheetProps }  (active already gated on query.length >= 1)

// components/MentionSheet.tsx  — the floating sheet (replaces MentionSuggestions at call sites)
<MentionSheet {...mention.sheetProps} inputBarHeight={INPUT_BAR_H} />
```

**Positioning strategy (the crux — recommended):** render `MentionSheet` as a **screen-root absolute
overlay** (last child of the host's root view, above all content, un-clipped), and drive its vertical
position from **`useReanimatedKeyboardAnimation()`'s `height` shared value**:

> `sheet.bottom = keyboardHeight + inputBarHeight` → the sheet's bottom edge lands exactly on the input's
> top edge, on every surface, and animates in lockstep with the keyboard.

Why this design (vs. the alternatives):
- **Root-level + absolute** → never clipped by a `ScrollView`/pane and always above content (kills the
  "floats over the thumb" overlap and the "flows off-screen" clip in one move).
- **Keyboard-height-driven, not `KeyboardStickyView`** → sidesteps the documented
  `CommentOverlay.tsx:283-287` corruption of a sticky view inside an absolute pane. It uses the same raw
  reanimated keyboard signal, applied as a `translateY`/`bottom`, which is exactly what that overlay's
  hand-rolled input already does — so the sheet and the input share one coherent keyboard motion.
- **Per-host variable is just `inputBarHeight`** (a measured `onLayout` height or a known constant per
  surface). Every host already pins its input just above the keyboard, so this single number places the
  sheet correctly everywhere.
- Content is **bottom-aligned inside a `maxHeight`** so the sheet **grows upward** as rows arrive; scroll
  past ~5 rows with `keyboardShouldPersistTaps="handled"`.

**The one surface that needs real care — `app/post/new.tsx`.** Comments, CommentOverlay, and
EditDescriptionModal already pin their input directly above the keyboard, so for them this is mostly a
swap (render `<MentionSheet>` at the root, feed it the input-bar height). New-post is different: the
caption lives *inside* a `KeyboardAwareScrollView`, so when focused the input is scrolled — not a fixed
bar — and a keyboard-anchored sheet could sit over the caption. **Recommended handling:** when the caption
is focused *and* a mention is active, treat the caption as a pinned composer (or ensure the aware-scroll
offset keeps the caption line above `sheetHeight + keyboardHeight`), so the sheet floats above the caption
line, not over it. This is the single integration detail to nail during build (flagged in §8).

### Per-surface integration recipe (uniform)

For each of the four hosts:
1. Swap `useMentionCandidates(...)` + inline `<MentionSuggestions>` for
   `const m = useMentionSheet({ text, selection, onInsert })`.
2. Render `<MentionSheet {...m.sheetProps} inputBarHeight={H} />` **once at the screen root**
   (as the last sibling, so it overlays everything).
3. Delete the old inline placement + per-host positioning styles.

`MentionSuggestions.tsx` (the row markup) is **reused inside** `MentionSheet` — we keep the row visuals,
only the container/positioning/animation is new.

---

## 6. Interaction details & edge cases

- **Show:** `@` + ≥1 matching char with candidates present → slide-up + fade-in.
- **Dismiss:** on pick (insert `@handle ` + fade-out), on token break (space/newline), on caret leaving the
  token, on blur, on tapping the scrim/outside. All already derivable from `detectMention` going inactive.
- **Pick:** inserts `@username `, moves caret past it (existing `applyMention`), light selection haptic.
- **First-tap-while-focused:** rows use `keyboardShouldPersistTaps="handled"` + the same Touchable pattern
  the caption action buttons use (`app/post/new.tsx:36-38`) so the first tap selects instead of just
  dismissing the keyboard.
- **No matches:** hide the sheet (avoid a lingering empty box) — or a single muted "No people found" row;
  **recommend hide** for cleanliness.
- **Global-search streaming:** follows show instantly; a subtle bottom shimmer/spinner row while the
  debounced global query resolves (optional polish).
- **Rapid typing:** the sheet height animates smoothly as the candidate count changes (layout animation on
  the row container), never a hard jump.
- **Rotation / keyboard type switch (emoji↔text):** keyboard-height-driven positioning handles both.

## 7. Responsive & accessibility

- All new sizes via `@/lib/responsive` (`verticalScale`/`fontScale`); no hardcoded numbers (house rule).
- `maxHeight` clamps to a fraction of the space between the input top and the status bar so it never
  overruns on SE/mini; safe-area aware.
- iPad: constrain the sheet width to the composer's width (don't stretch full-bleed).
- ≥44pt row targets, `accessibilityRole="button"`, VoiceOver label = "Mention @username, following".

## 8. Risks & open questions

1. **New-post caption anchoring (the main one).** The caption isn't a fixed bar. Decide during build:
   pin the caption composer when a mention is active, vs. drive the aware-scroll offset to keep the caption
   line above the sheet. **Recommend: pin/anchor the composer while mentioning** (matches the other three
   surfaces and is the most predictable). *This is the one thing most worth a quick device spike.*
2. **CommentOverlay's custom keyboard pane.** It deliberately avoids `KeyboardStickyView`. The new sheet
   must read the keyboard height from the **same** source that overlay's input uses (or share its
   reanimated value) so the two never fight. Verify they move as one.
3. **zIndex / overflow.** Rendering at the screen root above the thumb (`zIndex:10`) + rows resolves the
   overlap; confirm no `overflow:hidden` ancestor clips the root overlay on any host.
4. **Keyboard-height on Android** (future): `react-native-keyboard-controller` normalizes this, but iOS is
   the only target today — note for parity later.

## 9. Test plan

- **Unit (fast jest):** `useMentionSheet` gating — no candidates on empty query; active only when
  `query.length >= 1`; dismiss on token break. (`detectMention`/`applyMention` already covered.)
- **Manual device matrix (the positioning is device-sensitive):** iPhone SE / 14 / 15 Pro Max + iPad, on
  all four surfaces — verify the sheet sits directly above the input, grows up, floats above the thumb/rows,
  never clips behind the keyboard, tracks the keyboard smoothly, and the first tap selects.
- Verify a mention still links + notifies end-to-end (unchanged pipeline).

## 10. Rollout

Client-only, **additive, low-risk** — no schema, no edge, no economy. The mention *data/notify* pipeline is
untouched; only the composer UI changes. Ships in the next client build. No kill-switch needed, though it
could sit behind a trivial feature check if we want to A/B the new sheet.

## 11. Files touched

- **New:** `hooks/useMentionSheet.ts` (trigger-gate + positioning state), `components/MentionSheet.tsx`
  (the floating keyboard-anchored sheet; reuses `MentionSuggestions` rows).
- **Edit (small):** `hooks/useMentionCandidates.ts` (empty-query → `[]`); the four hosts
  (`app/post/new.tsx`, `app/comments.tsx`, `components/CommentOverlay.tsx`,
  `components/EditDescriptionModal.tsx`) swap inline render → root-level `<MentionSheet>` + delete their
  per-host positioning.
- **Reused as-is:** `lib/mentionAutocomplete.ts`, `components/MentionSuggestions.tsx` (row markup).

---

### TL;DR recommendation
Two moves: **(1)** gate the menu on **≥1 char** (two shared one-liners), and **(2)** replace four ad-hoc
inline lists with **one shared `MentionSheet`** — a root-level floating overlay anchored to the input's top
via the keyboard-height signal, growing **upward**, on top of all content, animated, identical everywhere.
The one spike worth doing first is the **new-post caption anchoring** (§8.1); the other three surfaces
already pin their input above the keyboard, so they're a clean swap.
