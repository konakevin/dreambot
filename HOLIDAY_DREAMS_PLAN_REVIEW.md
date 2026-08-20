# Holiday Dreams Plan — Remaining Items Before/During Implementation

**Reviewer:** Claude. **Status:** Plan is **APPROVED for implementation.** Round-1 findings (the two HIGH
footguns + all MEDIUM/LOW) were addressed correctly in the revision and are **closed** — H1's renormalization
math is verified correct (sums to exactly 1.0 at every `holiday_pct`), H2/M1 are sound. This doc contains
**only what's left**: a few residual design items and the testing gaps to close. None require another review
cycle — fold them in and build.

---

## Residual design items

### 🟠 N1 (MEDIUM — roadmap only, not a Halloween blocker): Easter's window collides with St. Patrick's.
The floating-Easter fix (`window_days=14`) means Easter's window opens `peak − 14`. **Easter 2027 = Mar 28 →
window opens Mar 14**, overlapping **St. Patrick's (Mar 10–17)** on Mar 14–17 (verified). Easter's date
swings a full month, so this recurs. "At most one active, windows don't overlap" is therefore false for
Easter × St. Patrick's. The `ORDER BY sort_order LIMIT 1` guard prevents a crash but will silently show one
holiday for the whole overlap.
**Do:** make `holidayWindow.ts` resolve overlaps by **soonest peak wins** (St. Patrick's owns through 3/17,
Easter takes over 3/18+), not raw `sort_order`. One rule in the resolver. Decide now; only bites when Easter
ships.

### 🟠 N2 (MEDIUM — applies to Halloween v1; this is the "foolproof/fault-tolerant" guard): empty holiday pool must fall through.
If a holiday's catalog row is active and its window is live but the pool is **empty** (not yet seeded, or all
rows `disabled` by a cull), a holiday hit has nothing to draw → broken/empty render.
**Do:** if `loadHolidayScenarios(category)` (or the `holiday_scenes` load on Path 2) returns **< 1 usable
row**, treat `holiday_pct` as 0 for that render and fall through to the normal roll. A data-entry mistake
then degrades to a normal nightly instead of a broken one.

### 🟡 N3 (LOW-MEDIUM): the `uploads.holiday` marker needs `get_feed` + `mapPost` to carry it.
Adding the column + grant (plan §4.7) is not enough for the client to *see* it — same shape as the `is_liked`
bug we just fixed (a column the client reads that the RPC didn't return).
**Do:** add `holiday` to the `get_feed` RPC `SELECT` (and any profile/dream-detail read) and to `mapPost`,
or the tile never renders the emoji. Add this to §5.

### 🟡 N4 (LOW): the peak resolver must try year *and* year+1.
For a late-December render, the active peak (New Year's Jan 1) is *next* year and the window spans the
boundary.
**Do:** `holidayWindow.ts` must resolve each holiday's peak for **both the current and next year** and check
both windows — not just `current_year`. (Otherwise a resolver that only works mid-year still passes a naive
test.)

### 🟡 N5 (LOW): make window-membership the outer gate so the ramp never runs out-of-window.
The §3.3 ramp pseudocode has no `daysUntil < 0` branch. That's fine **iff** `holidayWindow.ts` first asks
"is today within `[peak − window_days, peak]`?" and returns no-active-holiday (→ 0) otherwise.
**Do:** make that membership check the outer gate (it also resolves N4). Unit-test "day after peak → 0".

### Prose nit (no action): Path-2 "sprinkle" is self-only-cast, not all cast users.
Live `face_swap_share_with_plus_one = 1.0` → a user **with a plus-one gets zero pure-scene nightlies**, so
zero scene-only sprinkle (they get 100% costumed *couple* holidays at peak, which is the goal). Only
**self-only** cast users get the scene-only sprinkle. Behavior is correct; §3.4's wording just slightly
overstates it.

---

## Testing strategy — gaps to close (the plan's §10a is strong on math + schema, thin on the seams + content)

The plan unit-tests the pure ramp math and the schema well (the highest-risk logic — keep all of it). But it
leaves the two places DreamBot bugs actually live — **render integration and hand-authored seed content** —
mostly to *manual* QA. Close these four:

### T1 (HIGH-value): behavioral test of the render's holiday branches (both paths).
Today the holiday cut, the holiday loader draw, and especially **Path 2 (the new pure-scene branch)** are
covered only by the manual `force_scene_category` / `force_holiday_scene` flags. That's the exact gap the
/audit flagged (A6): `nightly-dreams` orchestration has content-lock tests but no *behavioral* tests, so a
future edit can silently break the holiday branch. (The `is_liked` bug we just fixed was this shape — logic
that "worked" but had no behavioral lock.)
**Add:** a dbspec / harness test asserting the render decision, not the image — e.g. given (holiday active,
`holiday_pct` high, user **not** opted out) the code takes the holiday cut and draws from the holiday pool;
given (user **opted out**) `holiday_pct` is forced 0 and it draws from the normal pools; Path 2 selects a
`holiday_scenes` row and routes it through the Sonnet postcard brief. Test the branch logic with the roll and
loaders stubbed (mirror how `dualSwapPipeline`/`chaosTier` are unit-tested) so it runs without live models.

### T2 (HIGH-value): a holiday-seed CONTENT LINTER — machine-check the §6 safety rules, not just proximity.
Only **1 of the 8** §6 face-swap safety rules is automated today (rule 4, the proximity scan). Rules 1–3, 6,
7 are pure authoring discipline across ~240 hand-authored rows — a single "wearing a mask", a 60-word
`scene`, a face-bearing décor word, an unpinned medium, or a single-gender `dual` attire silently breaks the
swap and nothing flags it.
**Add** (extend the `posePoolLint` / `scan-dual-faceswap-proximity` pattern into a `scan-holiday-pools.js`
that gates the seed workflow + CI, exit non-zero on any violation), checking every `pool='holiday'` row:
- **attire**: no face-occlusion tokens (`mask`, `masked`, `hood up`, `face paint`, `fangs`, `prosthetic`,
  `veil`, `sunglasses`, full-face anything) — mirror §6.1.
- **scene**: word count in **25–40**; no people/pose/camera/lens/face/eye/pronoun words; **no size-dominance
  cue** (`fills the background`, `rich`, `layered`, `dominant`) — mirror §6.2/§6.3.
- **medium**: `medium_key` (or `medium_ban`) is **set** on every holiday row — mirror §6.7.
- **dual attire**: flag single-gender garment words (`gown`, `dress`, `tux`, `suit`) not paired/neutralized —
  mirror §6.6 (heuristic is fine; a flagged-for-human-review list beats nothing).
- (`holiday_scenes` rows skip the face rules but still get the medium-set check.)
This is the difference between "we hope 240 rows obey the rules" and "CI proves they do." Highest-value add.

### T3 (MEDIUM): tests for the fault-tolerance paths (N1, N2).
- **Empty-pool fall-through (N2):** holiday active but loader returns 0 rows → render falls through to the
  normal roll (holiday_pct treated as 0). Assert no throw, normal pool used.
- **Overlap resolution (N1):** two overlapping windows → resolver returns the soonest-peak holiday
  deterministically (add to the `holidayWindow.ts` unit tests).

### T4 (MEDIUM): validate the synchronized capacity spike before go-live (don't just "pre-scale").
Plan §10 phase 4 says estimate + pre-scale Fly, but there's no *check* that the overnight drain actually
absorbs the peak-night heavy-dual volume — the classic "invisible in testing, on fire in production" case.
**Add:** a staged pre-go-live check — e.g. temporarily set the Halloween window/`holiday_pct` high for a
**small cohort** (or a date-override dry run against the queue with the real heavy cap + Fly count) and
confirm the heavy queue drains within the overnight window before the real final-3-days. At minimum, compute
worst-case heavy-dual jobs/hour for the peak nights against `dream_queue_max_concurrent_heavy` × Fly count
and write the number down. The `queue-smoke-monitor` canary should stay green throughout the window.

---

## Summary
Design is sound and **approved**. Before/during implementation: fold in **N1** (overlap = soonest-peak wins)
and **N2** (empty-pool fall-through) as one-line rules; add the four testing pieces — **T1** (behavioral
render-branch test), **T2** (holiday-seed content linter — do this one for sure), **T3** (fault-path tests),
**T4** (capacity dry-run). Treat **N3–N5** as an implementation checklist. No further review cycle needed.
