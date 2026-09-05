# Holiday Dreams — Plan & Design

**Status:** DESIGN (2026-08-18). Halloween ships first; the system is built for N holidays from day one.
**Owner:** Kevin + Claude. **Scope:** nightly dreams only (Pro/trial users). Bots + Create are out of scope.

---

## 0. The feel we're building

For a window leading up to each holiday, DreamBot's nightly dreams turn festive: the dreamer gets
**cast as the holiday's characters** (you as a vampire aristocrat, a glamour witch, a monster hunter)
in bespoke holiday scenes, with a generous helping that **ramps up as the day approaches**. It should
feel like the app itself put on a costume. Bold, fun, a genuine splash of atmosphere. Edgy is welcome;
nothing that trips the image models' NSFW filters.

Every holiday carries the full emotional range so it never feels one-note: **cozy · scary ·
sexy (tasteful) · funny · nostalgic · pretty**.

---

## 1. Locked decisions (from Kevin)

| Decision | Choice |
|---|---|
| Intensity | **Gentle background echo, NOT a takeover** (2026-08-18 pivot — don't wear people out). Fall ~10% flat; Halloween ramps ~6% → ~25%, a small nudge to ~35% on the night. All catalog-tunable. |
| Two kinds of window | **Ramped holidays** climb to a peak day (Halloween, Christmas). **Flat seasons** hold a steady low level, no ramp (Fall = all September). `ramp_style` column. |
| Overlap + mix | Windows **may overlap**; multiple active seasons **mix**, weighted by pct (early Oct = Fall + Halloween blended). Replaces the old "one active, soonest-peak wins." |
| Fall vs Halloween | Halloween is split: **Fall season** (`category='fall'`, cozy-autumn, Sept 1–Oct 7, flat) + **Halloween** (`category='halloween'`, costumed spooky, Oct 1–31, ramped). |
| Scope | Holiday themes **face-swap** nightlies (cast-in-costume) AND **pure-scene** nightlies (scene-only atmosphere); embodied/dream-art stay normal |
| Who gets what | Cast users: mostly cast-in-costume + a sprinkle of scene-only holiday. No-cast users: scene-only holiday. **Everyone gets the season.** |
| Couples | **Yes** — cast the user + their plus-one as a costumed pair (dual pools, head-apart, proximity-scanned) |
| Spicy tier | **Cast, tasteful pin-up** — flirty/glam, fully costumed, tuned to never trip model NSFW |
| Medium | **Per-theme, my call** — cozy-fall photoreal-friendly, spooky/fantastical painterly |
| Roadmap | **US major set** — Halloween, Christmas, New Year's, Valentine's, Thanksgiving, July 4th, St. Patrick's, Easter |
| "Christmas" | It's **Christmas**, said out loud — Santa, reindeer, trees, stockings, elves, the works (not sanitized "winter holidays") |
| Default state | **All holidays enabled for everyone**; per-holiday opt-out in Settings |

---

## 2. How nightly works today (the two facts that shape this)

1. **Live scene pools are `dual_scenarios` / `single_scenarios`** (the old `nightly_seeds` table is dead).
   A row carries `pool` (`goofy` / `elegant` / `active`), `scene` (pure environment text), `attire`
   (costume/wardrobe words), optional `pose_pool` / `medium_key` / `medium_ban`, and `category`
   (a sub-bucket). "Roll B" picks a `pool` per the live `engine_config` percentages; within a pool,
   rows are drawn uniformly (shuffle-bag de-duped). This is exactly how the "active" fun-scenarios
   shipped — **seeding or culling a bucket is pure data, zero code deploy**.

2. **The cast pipeline is `_shared/characterSlotPrompt.ts`.** It does NOT paste the face here; it builds
   a prompt that makes Flux render a big, frontal, cleanly-separated face that the downstream ArcFace
   swap can replace. That imposes hard rules on how a holiday row must be written (§6).

**The Halloween feature = a new `pool='holiday'` on those two tables, sub-keyed by `category='halloween'`,
drawn only when Halloween's date-window is live, at a percentage that ramps to the day, minus anyone who
opted out.** The cast path (Roll B) reuses machinery that already works; the one genuinely new branch is
the scene-only pure-scene path (§3.4 Path 2).

---

## 3. Architecture

### 3.1 Holiday is a new scene-TYPE pool
- Extend the `pool` CHECK on both scenario tables to allow `'holiday'`.
- All Halloween rows: `pool='holiday'`, `category='halloween'`. Christmas rows: `category='christmas'`. Etc.
- **The holiday KEY == the `category` value == the config-table key.** One string ties it all together.

### 3.2 The draw differs from "active" in exactly one way
`active` draws uniformly across *all* its buckets. `holiday` must **filter to the currently-active
holiday's category** — only Halloween rows fire during the Halloween window. New loader:
`loadHolidayScenarios(supabase, category)` → `pool='holiday' AND category=<activeHoliday> AND disabled=false`,
paginated + isolate-cached like the existing loaders, MVP-array fallback if a holiday has < 10 rows.

### 3.3 The two window kinds (gentle background echo — 2026-08-18)
Each season's percentage is **computed from its window position** by `holidayWindow.ts`. There are two
kinds, chosen per-row by `ramp_style`:

**Flat seasons (`ramp_style='flat'`, e.g. Fall)** — a constant low ambient level across the whole window,
no ramp, no surge. `peak_pct` is the flat level; the ramp knobs are ignored. The "peak" date is just the
window END. Fall = a steady **~10%** from Sept 1 → Oct 7.

**Ramped holidays (`ramp_style='ramp'`, e.g. Halloween, Christmas)** — climb gently to a modest peak on the
day, with a small nudge on the day itself. Deliberately gentle now (was 30/80/100; the pivot dropped it to
a background echo):
```
daysUntil = peak - today            (0 on the peak day)
if before the window opens:                 pct = 0
elif daysUntil <= final_days - 1:           pct = final_pct   ← small nudge on the day
elif daysUntil <= peak_lead_days:           pct = peak_pct    ← gentle plateau
else (early window):                        linear ramp_start_pct → peak_pct
```

Concretely for **Halloween** (`ramp`, peak 10/31, `window_days=30` → opens **Oct 1**, `ramp_start=6`,
`peak_pct=25`, `peak_lead=7`, `final_pct=35`, `final_days=1`):

| Dates | holiday_pct |
|---|---|
| Oct 1 → ~Oct 24 (early window) | linear **6% → 25%** |
| Oct 24 → Oct 30 (plateau) | **25%** |
| **Oct 31** (the night) | **35%** — a small nudge, not a takeover |
| Nov 1+ | 0% |

- Outside every window → `pct = 0` (dormant). All knobs live per-row in the catalog, live-tunable, no deploy.
- **Overlap + mix:** `resolveActiveHolidays` returns EVERY season active today; the render **sums** their
  pcts (`combineHolidayPct`, capped) for the roll and **picks one weighted by pct** (`pickWeightedHoliday`)
  when holiday fires. So early October blends Fall + Halloween: e.g. Oct 3 ≈ Fall 10% + Halloween ~8% =
  ~18% holiday, of which fall/halloween are drawn in proportion.

`holiday_pct` (the combined total) is holiday's cut of the **face-swap** scene-type roll (§3.4), renormalized
in (§3.3a). A gentle echo — most nights are still the user's normal dream.

#### 3.3a Composing the holiday cut — RENORMALIZE, do not prepend an absolute cut
⚠️ **The naïve implementation is wrong and fails silently.** `_shared/sceneTypeRoll.ts` builds *absolute*
cumulative cuts (`goofyCut=goofy/100`, `elegantCut=+elegant/100`, `activeCut=+active/100`, plain = the
leftover). The live values are **goofy 15 / elegant 15 / active 40 / plain 30** (pull `engine_config`
before coding — earlier docs' "20/30" is stale). If you just prepend a 4th absolute `holiday_pct` cut, at
`holiday_pct=80` the cuts sum to 1.5 → `activeCut` overflows past 1.0, active + plain **never fire**, and
elegant is silently truncated. Garbage mix, no error.

**Correct composition — squeeze the existing distribution into the *remaining* probability space:**
```
holidayCut = holiday_pct / 100
scale      = 1 - holidayCut                                  // room left for the normal roll
goofyCut   = holidayCut + (goofy/100)              * scale
elegantCut = goofyCut   + (elegant/100 + lean/2)   * scale    // preserve existing lean / gendered-boost terms
activeCut  = elegantCut + (active/100  + lean/2)   * scale    // active still gated on pool >= 10
// roll r:  r < holidayCut → HOLIDAY ; else fall through to the existing goofy/elegant/active/plain ladder
```
At `holiday_pct=100`, `scale=0` → everything is holiday. At 30, the 15/15/40/30 shrinks proportionally to
~10.5/10.5/28/21 of the remaining 70%. Monotonic, no truncation. Implement by extending `sceneTypeCuts`
to take `holidayPct` (applying `scale`), NOT by adding a 4th raw pct. **Unit-test boundaries 0/30/80/100**
asserting the four normal cuts stay proportional and the ladder sums to 1.0.

### 3.4 Scope: holiday themes TWO render paths (so everyone gets the season)
Holiday hooks into two existing paths, both gated by the same `holiday_pct` ramp + active-holiday + opt-out:

**Path 1 — face-swap dreams (cast-in-costume).** In the scene-type roll ("Roll B", the "you, cast into a
scene" dreams), `holiday_pct` is holiday's cut, taken **first**; the remainder splits across
goofy/elegant/active/plain. On a holiday hit it draws from the **cast** holiday pool
(`dual_scenarios`/`single_scenarios`, `pool='holiday'`) → `attire` (costume) + `scene` through the slot
pipeline. At the gentle peak (~25-35%) a costumed holiday dream is a frequent-but-not-dominant guest in
the face-swap rotation — a background echo, never a takeover.

**Path 2 — pure-scene dreams (scene-only atmosphere).** When a nightly is a pure-scene type (a no-cast
user's dream, or a cast user's occasional non-face-swap nightly), `holiday_pct` also applies: on a holiday
hit it draws from the **scene-only** holiday pool (`holiday_scenes` table, §3.5b) → a rich standalone
festive scene with no person composited in. **This is genuinely new control flow, not a config toggle:**
the existing pure-scene path assembles a scene from biome axes + the user's location card, then briefs
Sonnet ("JAW-DROPPING postcard, LOCKED SUBJECT"). Path 2 must **replace that assembly** with a
`holiday_scenes.scene` row. Two specifics: (a) the holiday scene text still goes **through the Sonnet
postcard brief** (for tone/quality consistency with normal pure-scene dreams), just with the holiday scene
as the locked subject instead of the biome-built one; (b) a **new `force_holiday_scene` QA flag must be
built** — the existing `force_scene_category` only covers the face-swap path (`nightly-dreams:1259`, gated
on `isDualFaceSwap || isSingleHumanFaceSwap`), so it cannot QA scene-only holiday. Both are real work items
(§10), not free.

Result:
- **Self-only cast users** → mostly costumed holiday dreams, with a natural **sprinkle** of scene-only
  holiday (whenever Roll A lands them on a pure-scene nightly during the window).
- **Cast users WITH a plus-one** → costumed **couple** holidays when holiday fires, essentially no
  scene-only sprinkle: live `face_swap_share_with_plus_one=1.0` means a plus-one user gets ~zero pure-scene
  nightlies. (Corrects an earlier overstatement that "all cast users" get the sprinkle.)
- **No-cast users** → scene-only holiday dreams (their nightlies are pure-scene anyway).
- **Embodied / dream-art** nightly types stay normal. With the gentle pcts, most nights are the user's
  normal dream regardless — the holiday is a recurring garnish, not the meal.

Path 1 genuinely reuses the slot pipeline (a small branch in the existing Roll B). Path 2 is a new,
well-contained branch on the pure-scene path (§ above). Neither needs a pre-roll or a rewrite of the
type roll — but Path 2 is real new code, not a toggle.

> **Product note (M6), now mild:** a holiday cast dream's `scene` replaces the user's saved location
> (you're in a gothic ballroom, not your kitchen). With the gentle pcts this only touches a minority of
> nights, so "a dream of your places" mostly stays intact — the concern that motivated M6 is largely
> defused by the background-echo pacing. (A subset of holiday scenes could still be phrased to drop into
> the user's own location later, if we want.)

#### 3.4b Fault-tolerance guards (fail to a normal nightly, never to a broken render)
- **Window-membership is the OUTER gate (N5).** The ramp math only runs when the user-local date is inside
  `[window_open, peak]`. Structure it as `if (!activeHoliday) → normal roll` *first*, then compute
  `holiday_pct`. The ramp function is never asked for a pct outside a window (no negative/overflow days).
- **Empty-pool fall-through (N2).** If a holiday is active but its pool is empty or fully culled
  (`disabled=true`) — Path 1 (cast) or Path 2 (scene-only) — **degrade to a normal nightly**, not a broken
  render. The loaders already return `[]` on an empty pool; the roll must treat "holiday won but nothing to
  draw" as a miss and fall through to the ordinary goofy/elegant/active/plain path (cast) or the ordinary
  biome pure-scene assembly (scene-only). This is the foolproof bar: a bad seed state can never produce a
  failed dream, only a normal one. Log it (dev) so a silently-empty holiday pool is visible.

### 3.5 Config: a `holidays` catalog table (recurring, floating-peak-aware)
Dream Off hardcoded `2026-10-31`-style dates (one-shot). We store a **peak-date RULE + a window length**,
so windows recur yearly, follow **floating holidays** (Easter is lunar; Thanksgiving is the 4th Thursday),
and cross year boundaries (New Year's) via real date arithmetic instead of fragile month/day math:

```sql
CREATE TABLE public.holidays (
  key            text PRIMARY KEY,          -- 'halloween'  (== scenario category)
  display_name   text NOT NULL,             -- 'Halloween'
  emoji          text NOT NULL,             -- '🎃'
  ramp_style     text NOT NULL DEFAULT 'ramp',   -- 'ramp' (peaks on a day) | 'flat' (steady season, no ramp)
  peak_rule      text NOT NULL DEFAULT 'fixed',  -- 'fixed' | 'nth_weekday' | 'easter'
  peak_month     int,                       -- fixed/nth_weekday: month of the peak (or flat window END)
  peak_day       int,                       -- fixed: day-of-month (or flat window END, e.g. Fall 10/7)
  peak_nth       int,                       -- nth_weekday: which occurrence (Thanksgiving = 4)
  peak_weekday   int,                       -- nth_weekday: 0=Sun..6=Sat (Thanksgiving = 4 = Thu)
  window_days    int NOT NULL,              -- days BEFORE the peak/end the window opens (Halloween = 30)
  ramp_start_pct int NOT NULL DEFAULT 6,    -- % at window open (ramp only)
  peak_pct       int NOT NULL DEFAULT 25,   -- ramp: plateau %.  flat: the constant ambient level.
  peak_lead_days int NOT NULL DEFAULT 7,    -- ramp: reach & hold the plateau this many days before the peak
  final_pct      int NOT NULL DEFAULT 35,   -- ramp: small nudge on the day
  final_days     int NOT NULL DEFAULT 1,    -- ramp: last N days (incl. the peak) at final_pct
  is_active      boolean NOT NULL DEFAULT false, -- per-holiday gate; flip on at each launch
  sort_order     int NOT NULL DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);
```

**Why a peak RULE, not start/end dates (fixes M1):** the window is always `[peak - window_days, peak]`.
`holidayWindow.ts` resolves the peak for a given year:
- `fixed` → `(year, peak_month, peak_day)` (Halloween 10/31, Christmas 12/25, Valentine's 2/14, …).
- `nth_weekday` → the Nth `<weekday>` of `peak_month` (Thanksgiving = 4th Thu of Nov). Ramp peaks on the
  real Thursday, not a hardcoded 27.
- `easter` → computus for that year (2027 Mar 28, 2028 Apr 16 …). One small pure function, unit-tested.
Then `window_open = peak - window_days`. Because we subtract days from a real `Date`, **New Year's
(peak Jan 1, window_days 5) opens Dec 27 of the prior year automatically** — no month/day wrap bug.

**Compute against the USER'S LOCAL date, not server UTC (fixes H2):** nightly renders at each user's local
night, and the render already knows the user's tz (it builds the per-user dedup dayKey). If the window/pct
were computed from server `current_date`, a user whose local Halloween-night render runs after UTC ticked
to Nov 1 would get `holiday_pct=0` and a **normal dream on Halloween** — the promise breaks exactly at the
peak. So: the RPC/config returns only the **catalog rows** (cached, cheap); the render computes the active
holiday + `holiday_pct` locally via `holidayWindow.ts(userLocalDate, catalogRows)`. Pure, per-user-correct,
fully unit-tested.

**Short-window ramp clamp (fixes M1's second half):** the default knobs (`peak_lead_days=7`,
`final_days=3`) suit long windows; a 5-day New Year's window would otherwise skip the ramp entirely.
`holidayWindow.ts` clamps: `effectivePeakLead = min(peak_lead_days, window_days)`, and short holidays set
their own knobs in the catalog (NYE: `window_days=5, ramp_start_pct=60, peak_lead_days=2, final_days=1`).
(We keep Kevin's absolute "last 3 days / week before" model for the marquee long-window holidays rather
than switching to window-fractions — the per-holiday knobs + clamp give short windows a sane curve without
losing the crisp "exactly the last 3 days" for Halloween/Christmas.)

- **Overlap = MIX (revised 2026-08-18, supersedes N1's soonest-wins):** windows overlap **by design** now
  (Fall × Halloween in early October; also Easter × St. Patrick's in some years). `resolveActiveHolidays`
  returns EVERY active season; the render sums their pcts and picks one **weighted by pct** per holiday
  roll, so overlapping windows blend rather than one winning. Deterministic order (sooner peak first,
  tie-break `sort_order`) only affects display, not correctness.
- **Year + year+1 resolution (N4):** to find the active window near a year boundary, the peak resolver must
  test **both the current year's and next year's** peak (New Year's peak 1/1 with `window_days=5` is active
  from Dec 27 — on Dec 28 the *relevant* peak is next January's, not this one). `holidayWindow.ts` resolves
  each holiday's peak for `year` and `year+1` and picks whichever window contains the user-local date.
- Master switch: `engine_config.holidays_enabled boolean DEFAULT true` (kills the whole feature instantly).

### 3.5b The scene-only pool: `holiday_scenes`
Cast holiday rows live in the scenario tables (strict face-swap-safe constraints). Scene-only holiday
content has NO such constraints (no face to protect), so it gets its own table and can be rich, full,
atmospheric — a whole festive tableau, incidental silhouettes welcome, "fills the frame" is fine:

```sql
CREATE TABLE public.holiday_scenes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday    text NOT NULL,          -- 'halloween'  (== holidays.key / category)
  scene      text NOT NULL,          -- a rich standalone festive scene, no cast
  tone       text,                   -- cozy | scary | funny | nostalgic | pretty (for QA/balance)
  medium_key text,                   -- optional forced medium (per-theme, my call)
  medium_ban text,                   -- optional medium re-roll
  disabled   boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX ON public.holiday_scenes (holiday) WHERE disabled = false;
```

Loaded by `holidayScenarioLoader.ts` (or a sibling) on Path 2, filtered to the active holiday, uniform
shuffle-bag draw. Seed/cull is pure data, same as everything else here.

### 3.6 Opt-out storage (everyone enabled, no backfill)
Add `holiday_optouts jsonb NOT NULL DEFAULT '[]'` to **`user_recipes`** (array of disabled holiday keys).
- `user_recipes` is RLS row-level (own-row read/write) — **no migration-278 column grant needed**, unlike
  a `users` column.
- It's already loaded per-user at render; we just extend the `select('recipe')` to
  `select('recipe, holiday_optouts')`.
- New users: column default `'[]'` → all holidays enabled automatically. **No onboarding code change** —
  the default does it (the `user_recipes` row is created lazily on onboarding's first upsert).
- Opting out is not a skip: it sets that user's `holiday_pct = 0` for the active holiday → they get a
  normal nightly instead. (Alternative considered: a sparse `user_holiday_optouts` table mirroring
  notification prefs. The JSONB column wins on fewer moving parts + already-loaded. Recommending it.)

### 3.7 Roll integration points (files)
- New `_shared/holidayWindow.ts` — pure date→active-holiday + piecewise-ramp math (unit-testable, no I/O).
  The single source of truth for §3.3; fully covered by unit tests.
- New `_shared/pools/holidayScenarioLoader.ts` — the category-filtered loader (`pool='holiday'` + category).
- `_shared/sceneTypeRoll.ts` — add a `holiday` cut ahead of goofy/elegant/active, sized by `holiday_pct`.
- `_shared/engineConfig.ts` — add `holidays_enabled` (master switch).
- `supabase/functions/nightly-dreams/index.ts` — inside the existing Roll-B block (both dual + solo
  branches): compute active holiday + holiday_pct + opt-out, apply the renormalized cut (§3.3a), and on a
  holiday roll pick from the holiday loader and route `attire`/`scene` through the slot pipeline like any
  scenario. Also the new Path-2 branch on the pure-scene path (§3.4) + the `force_holiday_scene` QA flag.
- `scripts/nightly-dreams.js` (enqueue) — no change needed (opt-out is a render-side roll change, not a skip).
- **Shuffle-bag scoping (L2):** the anti-repeat bag (`pool_pick_history`) keys by `pool`. Since all
  holidays share `pool='holiday'`, key the holiday bag by **`holiday:<category>`** instead, so each
  holiday's anti-repeat memory is independent (a bag reset for one holiday doesn't wipe the others').
  Harmless if missed (windows don't overlap, scene text is unique) but cleaner.

---

## 4. Data model / migration checklist

1. `ALTER TABLE dual_scenarios / single_scenarios` — widen the `pool` CHECK to include `'holiday'`.
   **(L5)** DROP+ADD of a CHECK constraint briefly scans the table (~2.5k + 5.1k rows) and takes an
   `ACCESS EXCLUSIVE` lock — trivial at this size, but sequence it **before** any holiday seeding, and
   update any content/dbspec test that asserts the allowed `pool` set.
2. `CREATE TABLE holidays` (§3.5, with `peak_rule` + `window_days`) + seed the 8 holiday rows (§9).
   `GRANT SELECT` for the read RPC.
3. `CREATE TABLE holiday_scenes` (§3.5b) — the scene-only pool.
4. `get_holidays_catalog()` SECURITY DEFINER RPC returning the catalog rows (deterministic `ORDER BY
   sort_order`). The active-holiday + `holiday_pct` are computed **in the render from the user's local
   date** (§3.5, H2) via `holidayWindow.ts`, not in SQL from `current_date`.
5. `ALTER TABLE user_recipes ADD COLUMN holiday_optouts jsonb NOT NULL DEFAULT '[]'`.
6. `ALTER TABLE engine_config ADD COLUMN holidays_enabled boolean DEFAULT true` (master kill switch).
7. `ALTER TABLE uploads ADD COLUMN holiday text` + `GRANT SELECT (holiday) ON public.uploads TO anon,
   authenticated` (the 🎃 marker, L4 — remember uploads is column-grant-gated).
8. Regenerate `types/database.ts` after the DDL (never hand-edit).
9. Seed Halloween **cast** rows (§8): MVP-25 across the 20 sub-themes → QA → scale to ~160 (solo + dual
   couples). Run `scan-dual-faceswap-proximity.js` (exit 0) before shipping any dual rows.
10. Seed Halloween **scene-only** rows (§8c): MVP-25 across tones → QA → scale to ~80.

---

## 5. Delight touches (pure joy, no upsell)
- ~~Holiday-aware bot message~~ — **CUT 2026-09-04 (Kevin): not needed.** The Haiku inbox title stays
  place-only for holiday dreams too.
- **A subtle 🎃 marker** on the dream so the dreamer knows it's a special. **Storage (L4):** the render
  already writes an `ai_generation_log` / `uploads` row — stamp the holiday key on the dream (a
  `holiday text` column on `uploads`, or a `metadata.holiday` field if we use a JSONB blob there), then the
  feed/dream tile reads it and shows the catalog emoji. Name it now so it actually renders: `uploads.holiday`
  (needs the migration-278 column grant: `GRANT SELECT (holiday) ON public.uploads TO anon, authenticated`).
  **Thread it end-to-end (N3):** a new column is invisible to the client unless it's SELECTed by the feed
  RPC(s) and mapped in `lib/mapPost.ts` → `DreamPostItem` — the exact shape of the `is_liked` bug we just
  fixed. Add `holiday` to `get_feed`/profile-feed selects + `mapToDreamPost` in the same change, or the
  marker silently never appears.
- These are flavor only — never a paywall or metric nudge.

---

## 6. Face-swap safety rules for holiday pools (NON-NEGOTIABLE)

The dreamer's real face gets swapped in. A holiday row breaks the swap unless it obeys all of these:

1. **Costume rides `attire` as CLOTHING WORDS ONLY.** Cape, high collar, frock coat, knit sweater,
   witch hat, tricorn, crown, cat-ear headband. **NEVER** a mask, hood-up-over-face, face paint,
   fangs/prosthetics over the face, sunglasses, veil, or anything that occludes or recolors the face
   (ArcFace can't detect it → swap fails or lands on the wrong face). Hats/crowns/headbands are fine as
   long as the face is clear; hoods only "hood DOWN off the face."
2. **Setting rides `scene` as PURE ENVIRONMENT, 25–40 words.** No people, no pose, no camera/lens/framing
   words, no face/eye words, no pronouns, and **never** a "fills the background / rich / layered /
   dominant" size cue (that shrinks the faces and breaks the dual split).
3. **No face-bearing décor in-scene** (no statues/portraits/masks staring out) — the detector grabs them.
4. **Dual rows keep heads apart.** Couple costumes must be side-by-side with a clear gap between heads,
   both facing camera — no cheek-to-cheek / embrace / lean-in. Must pass
   `node scripts/scan-dual-faceswap-proximity.js` (exit 0) before shipping.
5. **`gender` column** on `single_scenarios` lets male/female costumes match the gender-locked body;
   use `'any'` for gender-neutral costumes.
6. **DUAL rows have ONE `attire` field for the whole couple (M4) — never write a single-gender costume.**
   `dual_scenarios` has no per-side gender column (couples are intrinsically mixed), and the slot pipeline
   derives left/right wardrobe from that one anchor via Sonnet. A row that just says "off-shoulder purple
   gown" will put a man in a gown. So every dual holiday `attire` must be **gender-neutral** ("flowing dark
   witch robes") **or an explicitly paired costume** ("she in a flowing gown, he in a matching frock
   coat"). Before authoring, check how the live `pool='active'` dual rows phrase gendered themes and mirror
   that exactly.
7. **Every holiday row PINS its medium register (L7).** Don't let a gothic-vampire row inherit the general
   medium roll and land on an incongruous look. Every cast holiday row sets `medium_key` (and/or
   `medium_ban='photography'` where photoreal reads creepy — mirror the `fantastical_silly` precedent);
   every `holiday_scenes` row sets its medium too. Medium is per-theme, my call, but it is always set.
8. **Spicy = tasteful pin-up:** fully-costumed, flirty pose via `pose_pool='glamour'`; never explicit,
   never "nude/naked" (the final `sanitizePrompt` strips those anyway). Author tasteful by contract.

---

## 7. Opt-out UX + onboarding
> **CUT 2026-09-04 (Kevin): no opt-out screen.** The storage column + render-side skip stay (harmless,
> default `[]` = everyone in); no UI ships. Don't re-propose.

- **New screen `app/settings/holidays.tsx`**, mirroring `app/settings/notifications.tsx`: one toggle per
  holiday from the `holidays` catalog (ordered by `sort_order`, with emoji + display name). Enabled =
  key NOT in `holiday_optouts`. Writes `user_recipes.holiday_optouts`.
- **Row in `app/settings/index.tsx`** → `/settings/holidays`. Copy (append-style, joyful):
  > **Holiday Dreams 🎃🎄** — Your nightly dreams get festive during Halloween, Christmas, and more.
  > Turn off any holiday you'd rather sit out.
- **Onboarding:** nothing to add — the `'[]'` default means new users start with every holiday on.

---

## 8. Fall + Halloween pool spec 🍂🎃

**Split into two seasons (2026-08-18):** the costumed spooky sub-themes below (§8a) are the **Halloween**
season (`category='halloween'`, Oct, ramped); the cozy-autumn cluster (§8b) is the **Fall** season
(`category='fall'`, Sept→early-Oct, flat). Scene-only (§8c) likewise splits `holiday='fall'` (cozy autumn)
vs `holiday='halloween'` (spooky). Their windows overlap in early October → a blended mix.

**Tone legend:** 🎀 pretty · 🕯️ cozy · 😱 scary · 💋 sexy-tasteful · 😂 funny · 📼 nostalgic
Each sub-theme is authored for **solo** (`single_scenarios`) and **dual** (`dual_scenarios`, heads-apart).

### 8a. Halloween season (costumed) — `category='halloween'`

| # | Sub-theme | Tones | Attire (costume = clothing only) | Scene (pure environment) |
|---|---|---|---|---|
| 1 | **Vampire Aristocrat** | 💋😱🎀 | floor-length black opera cape, high stand-up collar, deep-crimson silk lining, sharp Victorian formalwear, onyx throat brooch | a candlelit gothic manor ballroom, dripping candelabra, cobwebbed crystal chandelier, tall arched windows spilling moonlight, blood-red velvet drapes |
| 2 | **Glamour Witch** | 🎀💋🕯️ | flowing off-shoulder midnight-purple gown, trailing chiffon sleeves, wide-brim pointed hat tilted back off the face, silver star pendants | an enchanted cottage kitchen, a copper cauldron glowing green, floating candles, shelves of bottled starlight, a black cat on a spellbook |
| 3 | **Graveyard Ghost-Glam** | 🎀😱 | a tattered gossamer white-grey gown trailing into mist, pale ribbons, a dulled silver locket | a moonlit fog-drenched graveyard, leaning mossy headstones, a wrought-iron gate, bare twisted trees, drifting will-o-wisps |
| 4 | **Monster Hunter** (Van Helsing) | 😱💋📼 | long weathered leather coat, buckled waistcoat, a crossbow strap across the chest, fingerless gloves, tall travel boots | a fog-drowned cobblestone village square at midnight, guttering lanterns, a crooked apothecary, bats against a full moon |
| 5 | **Pumpkin-Patch Scarecrow** | 😂🕯️📼 | patchwork earth-toned costume, straw-trimmed collar and cuffs, a floppy brimmed hat pushed back, plaid flannel underneath | a golden pumpkin patch at dusk, rows of fat pumpkins, glowing carved jack-o-lanterns, a rustic fence, crows on a rail, hay bales |
| 6 | **Cozy Costume-Party Host** | 🕯️📼😂 | a chunky cream cable-knit sweater with felt bat-and-ghost pins, a soft plaid scarf | a warm candlelit porch strung with orange fairy-lights, carved pumpkins on the steps, a candy bowl, an autumn wreath, amber dusk |
| 7 | **Autumn Fae / Dark Enchantress** | 🎀💋 | a gown of deep-plum and black petals, gossamer dark wings, a delicate thorn-and-berry crown resting back off the brow | a moonlit haunted rose garden, black roses, a cracked marble fountain, glowing fireflies, ivy-choked statues |
| 8 | **Retro Mad Scientist** | 😂📼 | a slightly-too-big white lab coat over a rumpled shirt and skinny tie, rubber gloves, brass goggles pushed up onto the forehead | a retro laboratory crackling with Tesla coils, bubbling green and violet beakers, a chalkboard of wild equations, jars of glowing goo |
| 9 | **Cat-Burglar Prowl** | 💋😂 | a sleek matte-black catsuit, a slim belt, a soft cat-ear headband, elbow-length gloves | a moonlit city rooftop, a glowing skylight, bats wheeling past a huge low harvest moon, string-lit water towers, the skyline below |
| 10 | **Trick-or-Treat Pirate** | 📼😂🕯️ | a classic pirate costume, a plumed tricorn hat pushed back, a red sash, a ruffled shirt and long coat, a toy cutlass | a 1950s suburban street at dusk, jack-o-lanterns on every porch, drifts of fallen leaves, warm windows, a harvest moon over the rooftops |
| 11 | **Grim Reaper (elegant, hood-down)** | 😱🎀 | an ornate flowing black robe, wide sleeves, silver-embroidered hem, **hood down off the face**, a tall ornate scythe held to one side | a windswept moonlit cliff cemetery, mist rolling over old crypts, a lone dead tree, ravens, a blood-orange harvest moon |
| 12 | **Autumn Harvest Royalty** | 🎀🕯️ | a regal cloak-gown of amber, russet, and gold autumn-leaf brocade, a crown of gilded oak leaves and acorns, topaz jewels | a candlelit harvest banquet hall, a long table of gourds and grapes, iron chandeliers of dripping candles, tapestries, a roaring hearth |

### 8b. Fall / Autumn Americana cluster (cozy · nostalgic · pretty)

The warm heart of the season — fun **fall** scenes that need little or no spook. The dreamer is cast
right into them in cozy real autumn clothes (no costume required), so these read as "you, on the most
perfect fall afternoon." Same `pool='holiday'`, `category='halloween'`. These deliberately weight the
window toward cozy/nostalgic so it isn't all vampires and graveyards.

| # | Sub-theme | Tones | Attire (cozy fall, clothing only) | Scene (pure environment) |
|---|---|---|---|---|
| 13 | **Corn Maze at Dusk** | 🕯️📼😂 | a soft flannel shirt, a chunky knit scarf, a denim jacket, a slouchy beanie | a golden corn maze at dusk, towering dry cornstalks, warm string lights overhead, a hay-bale archway, carved jack-o-lanterns at the entrance, a harvest moon rising |
| 14 | **Leaf-Pile Afternoon** | 📼🕯️😂 | a warm rust-orange sweater, a corduroy jacket, a cozy scarf, a knit hat | a sun-dappled park path buried in red-and-gold maple leaves, a big raked leaf pile, a wooden rake against a bench, low golden light, bare branches above |
| 15 | **Golden Maple Grove** | 🎀🕯️ | an oversized cozy cardigan, a soft scarf, an autumn-toned wool coat | a breathtaking grove of fiery red, orange, and gold maple trees, a winding leaf-strewn trail, warm low sunbeams through the canopy, a rustic split-rail fence |
| 16 | **Trick-or-Treat Twilight** | 📼🕯️😂 | a cozy hooded coat (hood down), a warm scarf, mittens, a candy pail in hand | a classic tree-lined neighborhood street at twilight, jack-o-lanterns glowing on every porch, warm-lit windows, drifting leaves, a big low harvest moon |
| 17 | **Pumpkin Farm Golden Hour** | 🕯️📼🎀 | a plaid flannel, a cozy quilted vest, a wide-brim felt hat, work gloves | a rustic pumpkin farm at golden hour, a wooden wagon heaped with pumpkins, a faded red barn, hay bales, spent sunflowers, rolling orange hills |
| 18 | **Apple Orchard Afternoon** | 🎀🕯️📼 | a soft knit sweater, a light autumn coat, a woven harvest basket | a sun-warmed apple orchard, boughs heavy with red apples, wooden ladders, crates of fruit, dappled golden light, a rustic cider stand in the distance |
| 19 | **Cozy Cabin Porch** | 🕯️📼 | a chunky wool sweater, a plaid blanket around the shoulders, wool socks, a steaming mug in hand | a rustic cabin porch in the woods at dusk, a glowing lantern, a carved pumpkin, an autumn wreath, a forest of fiery foliage beyond, soft woodsmoke |
| 20 | **Bonfire Night** | 🕯️😂📼 | a warm denim jacket, a cozy oversized scarf, a knit beanie | a crackling autumn bonfire in an open field at night, sparks rising toward the stars, hay bales as seats, string lights, a harvest moon, a marshmallow stick |

Face-swap notes for this cluster: hats/beanies/scarves are fine (no face occlusion); keep held props
(mug, basket, candy pail, marshmallow stick) at chest/hand level so they never rise in front of the
face; hoods stay **down**. These are prime **dual** material too (a couple on the cabin porch / at the
bonfire, side by side with a clear gap between their heads).

**Spicy (💋) sub-themes** — Vampire, Glamour Witch, Autumn Fae, Cat-Burglar, Monster Hunter — get
`pose_pool='glamour'` and tasteful flirty framing; still fully costumed, still face-swap-clean.

**Coverage check (all 20 sub-themes):**
- cozy ✅(2,5,6,12,13,14,15,16,17,18,19,20)
- scary ✅(1,3,4,11)
- sexy ✅(1,2,4,7,9)
- funny ✅(5,8,9,10,13,14,16,20)
- nostalgic ✅(4,5,6,10,13,14,16,17,18,19,20)
- pretty ✅(1,2,3,7,11,12,15,17,18)

The 8b cluster deliberately tips the balance toward **cozy / nostalgic / pretty** so the window feels
like a warm fall, not just a haunted house. Roughly half the pool is gentle fall; half is costumed spook.

**Seeding plan:** 20 sub-themes. MVP-25 first (a spread across all sub-themes, weighted toward the
cozy-fall cluster since that's the backbone), QA via `force_scene_category='halloween'`, run the
proximity scan, grade in-app on AlphaBot / a test user, then scale to ~160 (Sonnet-authored,
per-sub-theme, solo + dual, mirroring the "active" bucket generators). Suggested split at scale:
~55% fall/cozy (8b), ~45% costumed (8a).

### 8c. Scene-only Halloween pool 🎃 (no cast — benefits ALL users)

Rich standalone festive scenes with **no person in them** — these render on the pure-scene path (§3.4
Path 2) for no-cast users, and sprinkle into cast users' feeds too. No face-swap constraints apply, so
these can be full, lush, "fills-the-frame" tableaux (incidental silhouettes/figures welcome). This is
where the season gets to be as big and cinematic as it wants. Stored in `holiday_scenes`, `holiday='halloween'`.
(Sexy doesn't apply here — no person — so tones are cozy · scary · funny · nostalgic · pretty · awe.)

| Tone | Scene ideas (each a rich standalone environment) |
|---|---|
| 🕯️ **cozy** | a candlelit living room decked for Halloween — carved jack-o-lanterns on the mantel, a cauldron of candy, cobweb garlands, a black cat on a pumpkin rug, firelight · a window seat with a mug of cider, a blanket, a carved pumpkin, rain streaking the glass, fiery trees outside · a warm porch at twilight strung with orange fairy-lights, jack-o-lanterns down the steps, an autumn wreath, a candy bowl |
| 📼 **nostalgic** | a small-town Main Street decorated for Halloween at dusk, shop windows glowing, paper bats, hay bales, string lights · a golden pumpkin patch at sunset, a red wagon, hay bales, a friendly scarecrow, a harvest moon rising · a 1950s neighborhood street lined with jack-o-lanterns, drifting leaves, warm-lit windows, kids' chalk on the sidewalk |
| 🎀 **pretty** | a fiery maple forest trail buried in red-and-gold leaves, a little wooden bridge, low golden sunbeams · a misty apple orchard at golden hour, ladders and crates, boughs heavy with red apples · a breathtaking harvest moon over a misty autumn valley, orange-and-violet sky, silhouetted bare trees |
| 😱 **scary** (awe, not gore) | a haunted Victorian mansion on a hill under a full moon, glowing windows, twisted trees, wrought-iron gate, rolling fog · a moonlit graveyard wreathed in fog, leaning headstones, a lone dead tree, drifting will-o-wisps, a raven · a witch's candlelit cottage interior, a bubbling green cauldron, shelves of potions, floating candles, a black cat · a spooky forest path lined with glowing jack-o-lanterns, mist, a distant lit cabin |
| 😱 **eerie-beautiful** | an abandoned carnival at midnight, a rusted ferris wheel under a blood-orange moon, flickering string lights, fog · a candlelit crypt with cobwebs, an ornate coffin, guttering candles, a shaft of moonlight through a grate · a stormy night over a haunted lighthouse, forked lightning, crashing waves, a flickering beam |
| 😂 **funny / whimsical** | a house buried under gloriously over-the-top Halloween decorations — giant inflatable ghosts, a skeleton band, tangled orange lights, too many pumpkins · a witches' midnight tea party in a clearing, floating teacups, parked broomsticks, a cauldron of glowing punch, jack-o-lanterns (no people needed) · a black cat knocking a whole shelf of tiny pumpkins over in a cozy cluttered kitchen |
| ✨ **awe / spectacle** | a jack-o-lantern festival — a whole hillside of thousands of carved glowing pumpkins at night, a river of light · floating paper lanterns and glowing pumpkins drifting over a still lake reflecting a huge moon · a giant harvest moon rising enormous behind a silhouetted haunted town, bats streaming across it |

**Seeding plan:** MVP-25 across these tones, QA on the pure-scene path (a no-cast test user + a
`force_holiday_scene` flag), grade in-app, then scale to ~80. Medium per-theme (cozy-fall and Main-Street
photoreal-friendly; haunted/witch/awe scenes painterly-cinematic — my call).

---

## 9. Holiday roadmap (recurring; peak-rule + window_days model, §3.5)

Each season is one `holidays` catalog row: a `ramp_style` (**flat** ambient season vs **ramp** to a peak
day), a **peak rule** (fixed / nth_weekday / easter), the **days before the peak/end** the window opens,
and its own gentle pcts (a background echo — §3.3). Windows may overlap and mix (§3.4). All start
`is_active=false`; flip on at each launch.

| Key | Name | 😀 | style | peak_rule | Peak/end | window_days | pcts | Tone lean & bespoke hooks |
|---|---|---|---|---|---|---|---|---|
| `fall` | Fall | 🍂 | **flat** | fixed | 10/7 (end) | 36 (→ Sep 1) | flat **10** | the cozy-autumn cluster (§8b): corn maze, leaf pile, maple grove, pumpkin farm, apple orchard, cabin porch, bonfire, trick-or-treat |
| `halloween` | Halloween | 🎃 | ramp | fixed | 10/31 | 30 (→ Oct 1) | `6→25`, 35 on the night | the costumed spooky sub-themes (§8a): vampire, glamour witch, ghost-glam, monster-hunter, reaper, cat-burglar, mad scientist, harvest royalty |
| `christmas` | Christmas | 🎄 | ramp | fixed | 12/25 | 24 | `6→25`, 35 | **say it loud:** Santa, reindeer & sleigh, elf in the workshop, decorated tree & stockings, snow-globe village, caroler, ugly-sweater party, cocoa by the fire, Nutcracker, ice-skating, Mrs. Claus glam |
| `thanksgiving` | Thanksgiving | 🦃 | ramp | **nth_weekday** (4th Thu Nov) | ~11/26 | 12 | `6→25`, 35 | harvest-table feast, cozy autumn plaid, pilgrim-nostalgic, pie-baking funny, golden-hour gratitude, football-tailgate |
| `new_years` | New Year's | 🎉 | ramp | fixed | 1/1 | 5 | `15→25`, 35 | black-tie gala, confetti & fireworks rooftop, champagne toast, sequin-glam countdown, midnight ballroom |
| `valentines` | Valentine's | 💘 | ramp | fixed | 2/14 | 7 | `6→25`, 35 | rose-petal dinner, cupid glam, candy-heart pastel, vintage valentine, love-letter cozy, masquerade romance (mask held, not worn) |
| `st_patricks` | St. Patrick's | ☘️ | ramp | fixed | 3/17 | 7 | `6→25`, 35 | emerald finery, leprechaun-dapper, rainbow-and-gold, cozy Irish pub, misty green hills, festive parade |
| `easter` | Easter | 🐰 | ramp | **easter** (computus) | floats Mar 22–Apr 25 | 14 | `6→25`, 35 | pastel spring-Sunday best, bunny-ear headband (no mask), flower-crown, egg-hunt garden, meadow picnic, chick-yellow whimsy |
| `july_4th` | 4th of July | 🎆 | ramp | fixed | 7/4 | 7 | `6→25`, 35 | red-white-blue glam, firework night sky, backyard BBQ, boardwalk-Americana retro, sparkler cozy, small-town parade |

The future "Winter" or "Spring" ambient seasons can mirror Fall (flat) around Christmas / Easter the same
way Fall wraps Halloween. All pcts are one-line catalog-tunable — start gentle, dial to taste.

**Floating peaks are handled by the `peak_rule` (M1):** Thanksgiving resolves the real 4th-Thursday each
year (not a hardcoded 11/27); Easter runs the computus (2027 Mar 28, 2028 Apr 16, 2029 Apr 1) — an
`nth_weekday` helper alone can't do Easter, so `holidayWindow.ts` has a small dedicated `easter(year)`
function. Each new holiday = seed rows (`pool='holiday'`, `category=<key>`) + one catalog row. No code
after the foundation ships.

---

## 10. Rollout phases

1. **Foundation (ship dark, `holidays_enabled=false`)** — migrations (§4), `holidayWindow.ts` (peak-rule
   resolution incl. `easter(year)` + `nth_weekday`, window-open, renormalized ramp, short-window clamp,
   user-local date), the loaders, the Roll-B renormalized cut (§3.3a), the Path-2 pure-scene branch (§3.4),
   and the `force_holiday_scene` QA flag. All behind the master switch.
2. **Halloween MVP-25** — seed 25 cast rows across the 20 sub-themes + 25 scene-only rows; QA the cast path
   via `force_scene_category='halloween'` and the scene-only path via `force_holiday_scene='halloween'`
   (solo + dual), run the proximity scan, grade in-app on AlphaBot / a test user. Fix wording, re-roll.
3. **Scale** — grow cast to ~160 / scene-only to ~80; wire the
   `uploads.holiday` 🎃 marker.
4. **Capacity pre-check (M5)** — the holiday peak is a **synchronized spike**: every Pro user, the same
   final 3 days, at 100%, skewed toward **heavy dual face-swaps** (couples). The heavy path is capped at
   `dream_queue_max_concurrent_heavy` (10) and bottlenecked on the Fly.io `face-swap-dual` service. Before
   go-live, estimate worst-case heavy volume for the final nights and **pre-scale Fly (`fly scale count N`)
   + raise the heavy cap for the window** (runbook: `QUEUE_WORKERS_REFACTOR.md`), so dreams land overnight
   and not after users' local mornings. Late = the magic misses the moment.
5. **Go live** — seed the `holidays` catalog (Halloween: `peak_rule='fixed'`, peak 10/31, `window_days=46`,
   `ramp_start_pct=30`, `peak_pct=80`, `peak_lead_days=7`, `final_pct=100`, `final_days=3`), then flip
   `holidays_enabled=true`. Verify the ramp with a local-date-override test before Sep 15.
6. **Christmas next** — repeat with Christmas pools well before Dec 1.

**Testing the ramp without waiting for October:** `holidayWindow.ts` takes the date as a parameter, so
unit tests assert the exact pct at each boundary, and the `force_holiday_scene` / `force_scene_category`
QA flags render Halloween dreams any day.

### 10a. Regression locks (so this can't silently rot)
- **`holidayWindow.ts` unit tests:** exact `holiday_pct` at window-open / mid-ramp / plateau / each of the
  final 3 days / day-after (0); the **renormalized cut** (§3.3a) at 0/30/80/100 (normal cuts stay
  proportional, ladder sums to 1.0, nothing truncates); **year-wrap** (New Year's, peak 1/1 → window opens
  Dec 27 prior year, `daysUntil` correct across the boundary); **short-window** holidays (ramp doesn't
  collapse under their knobs); **floating peaks** (`easter(2027)=Mar 28`, `easter(2028)=Apr 16`;
  Thanksgiving = 4th Thu); **user-local vs server date** (a +14h-tz user on local-Halloween-night still
  gets 100%); opted-out user → 0.
- **dbspec:** the `pool` CHECK includes `'holiday'`; `holiday_scenes` + `holidays` exist; the catalog RPC
  returns rows deterministically.
- **Content lock:** CI / the seed workflow fails if any `pool='holiday'` dual row trips
  `scan-dual-faceswap-proximity.js` (mirror the existing gate).

**Known non-goal (L6):** the shuffle-bag dedupes exact *scenes*, not *tones*, so a user could still draw a
couple of spooky nights in a row by chance. The cozy/fall weighting makes it unlikely; tone-aware
anti-clustering is gold-plating we're explicitly not building for v1.

### 10b. Beyond the math — the seams + content DreamBot bugs actually live in (T1–T4)
§10a locks the pure math + schema. These four close the render-integration and hand-authored-content gaps:
- **T1 — behavioral render-branch test (HIGH value).** A harness/dbspec test of the render *decision* (not
  the image), with the roll + loaders stubbed (mirror how `chaosTier`/`dualSwapPipeline` are tested): given
  (holiday active, high `holiday_pct`, not opted out) → the holiday cut is taken and a holiday row drawn;
  given (opted out) → `holiday_pct=0`, normal pools; Path 2 → selects a `holiday_scenes` row and routes it
  through the Sonnet postcard brief. This is the `is_liked`-shape gap: logic that "works" but has no lock.
- **T2 — holiday-seed CONTENT LINTER (do this one for sure).** Only 1 of the 8 §6 rules is automated today
  (proximity). Build `scripts/scan-holiday-pools.js` (shared pure `holidayPoolLint`, unit-tested, mirrors
  `posePoolLint`) that gates the seed workflow + CI, exit non-zero on any violation, checking every
  `pool='holiday'` row: **attire** — no face-occlusion tokens (mask/hood-up/face paint/fangs/prosthetic/
  veil/sunglasses); **scene** — 25–40 words, no people/pose/camera/lens/face/eye/pronoun words, no
  size-dominance cue (fills the background / rich / layered / dominant); **medium** — `medium_key` or
  `medium_ban` is set; **dual attire** — flag unpaired single-gender garment words (gown/dress/tux/suit) for
  human review. `holiday_scenes` rows skip the face rules but still get the medium-set check. "CI proves 240
  rows obey the rules" beats "we hope they do."
- **T3 — fault-path tests (N1, N2).** Empty-pool fall-through (loader returns 0 → normal roll, no throw);
  overlap resolution (soonest-peak wins, deterministic — already in `holidayWindow.test.ts`).
- **T4 — capacity dry-run before go-live.** Don't just "pre-scale": compute worst-case heavy-dual jobs/hour
  for the peak nights vs `dream_queue_max_concurrent_heavy × Fly count`, write the number down, and do a
  small-cohort or date-override dry run confirming the heavy queue drains within the overnight window.
  `queue-smoke-monitor` stays green throughout.

---

## 11. Decisions — all locked ✅
- **Ramp:** ~30% at window open → linear to 80% by the week before → hold 80% → **100% the final 3 days**,
  ending on the holiday.
- **Scope:** face-swap nightlies (cast-in-costume) + pure-scene nightlies (scene-only). Embodied/dream-art normal.
- **Everyone gets the season:** cast users → costumes + scene-only sprinkle; no-cast users → scene-only.
- **Couples:** yes (dual pools, proximity-scanned).
- **Spicy:** cast, tasteful pin-up.
- **Medium:** per-theme, my call.
- **Roadmap:** US major set; **Christmas said out loud**.
- **Default:** all holidays on; per-holiday opt-out in Settings.

**Only remaining optional nicety (not a blocker, revisit later):** extending holiday flavor to the
embodied / dream-art nightly types too, for total immersion. Not needed for a great v1.

---

## 12. Implementation checklist (Round-2 residuals — verify each is coded)
- [ ] **N1 — overlap priority:** `holidayWindow.ts` prefers the sooner-peak holiday when two windows are
  active (Easter vs St. Patrick's), tie-break `sort_order` (§3.5). Unit-test the Mar-2027 overlap.
- [ ] **N2 — empty-pool fall-through:** active-but-empty holiday pool degrades to a normal nightly, both
  paths, logged in dev (§3.4b). Unit/integration test: cull the pool, assert a normal dream renders.
- [ ] **N3 — marker threading:** `uploads.holiday` is SELECTed by the feed RPC(s) + mapped in
  `mapToDreamPost`, not just written (§5). (The `is_liked` failure mode.)
- [ ] **N4 — year/year+1 peak resolution:** the resolver tests both years so the Dec→Jan New Year's window
  is found (§3.5). Unit-test Dec 28 → next-Jan peak.
- [ ] **N5 — window-membership outer gate:** `if (!activeHoliday) return normalRoll` *before* any ramp
  math; the ramp is never called out-of-window (§3.4b).
- [ ] The §10a regression locks (renormalized cut, timezone, computus, short-window, proximity content lock).
- [ ] **T1** behavioral render-branch test · **T2** `scan-holiday-pools.js` content linter (highest value) ·
  **T3** fault-path tests · **T4** capacity dry-run (§10b).

### Build progress
- [x] `_shared/holidayWindow.ts` — peak resolution (fixed/nth_weekday/easter computus), **flat vs ramp**
  styles, window membership (year + year+1), short-window clamp, **multi-active overlap + weighted mix**
  (`resolveActiveHolidays` / `combineHolidayPct` / `pickWeightedHoliday`). **24 unit tests green.**
- [x] `_shared/sceneTypeRoll.ts` — renormalized holiday cut (§3.3a), backward-compatible (`holidayPct` default 0).
- [x] Migration `437` **applied** (dark). Migration `438` (ramp_style + Fall season + gentle pcts) **written — needs applying** + types regen.
- [x] `_shared/engineConfig.ts` — `holidaysEnabled` master switch (default false).
- [x] `scripts/lib/holidayPoolLint.js` + `scripts/scan-holiday-pools.js` (T2) + **15 unit tests green**; scanner verified against live tables.
- [x] `_shared/pools/holidayScenarioLoader.ts` — category-filtered cast + scene-only loaders (Deno-clean).
- [x] `_shared/holidayWindow.ts` glue: `mapHolidayCatalogRow` + `localDateInTz` (H2), unit-tested.
- [x] **nightly-dreams Path 1 (cast: dual + solo)** — active-holiday compute (local date, opt-out, master
  switch, `force_holiday_scene` QA), multi-active combined cut + weighted pick, N2 empty-pool fall-through.
  Deno-clean; dark-safe (empty when disabled). *(deployed)*
- [x] **nightly-dreams Path 2 (pure-scene / scene-only)** — a pure-scene nightly rolls the active seasons'
  `holiday_scenes` (N2), and on a hit builds a locked-subject holiday brief with the row's pinned medium
  (`resolveMediumFromDb`). Deno-clean, dark-safe. *(deployed)*
- [x] `uploads.holiday` marker stamped on the main insert (both paths → `holidayCategory`).
- [x] **Explicit season start** (mig 456): Fall = Sept 15 → Thanksgiving Day; overlapping seasons mix.
  38 window tests incl. a two-year day-by-day sweep ("no Christmas in July"); `scripts/check-holiday-windows.mjs`
  sweeps the LIVE catalog through the production math (exit 1 on any out-of-window eligibility).
- [x] **Day-of HERO** (mig 457/458 + render integration + `scripts/qa-holiday-hero.js` + diversity gate) — §13.
- [x] **POSTCARD overlay** (mig 459 + `holiday-postcard` fn + artwork generator) — §14.
- [x] Eerie COUPLE hero: A/B proved the medium, not the scene — painterly dual swaps fail the +1 identity
  gate (mig 455 floor, newer than the Aug-19 QA) ~85% of the time; the same scenes on photography passed
  3/3. v4: couple (both registers) + male eerie = photography; female eerie stays painterly.
- [ ] **Everyday Halloween COUPLE pools under the identity gate:** regression check 3/5 painterly couples
  survive (masquerade 1/2, vampire 2/2, ghost_glam 0/1) → degrade to solo. Review the 25 archetypes' couple
  mediums (photography passes cleanly) or the gate floor BEFORE scaling past MVP.
- [ ] N3: thread `uploads.holiday` through `get_feed` + `mapPost` so the tile shows the emoji.
- [ ] T1 behavioral test of the render branches (roll + loaders stubbed).
- [ ] Fall + Halloween seed generators (Sonnet-authored, lint-gated) → MVP-25 (cast + scene-only) → QA on a test user.

---

## 13. The day-of "hero" dream — BUILT 2026-09-04 (migrations 457/458, no pools)

Kevin's call (2026-09-04): **no day-of seed pools.** On the holiday itself every nightly user gets ONE
guaranteed, grand, on-brand hero dream — **the couple if they have a +1, else themselves** — built from
a single curated, honed recipe per surface, personalized so no two are clones.

### Mechanic (live in `nightly-dreams`)
- `holiday_hero_prompts` (mig 457): one row per `(holiday, surface ∈ couple|male|female, register ∈
  cozy|eerie|default)` with `attire`, `scene`, a pinned face-swap-safe `medium_key`, `pose_pool`, and an
  `axes` JSON of placeholder → candidate phrases. Halloween's 6 rows = mig 458 (re-runnable, tune → `--force`).
- **Three personalizers, in order of visual weight:** (1) their face(s); (2) the **register** from the
  Vibe Profile Cute↔Terrifying slider (`moods.cute_terrifying` < 0.5 → cozy, else eerie); (3) **axes**
  `{setting}` (6) · `{attire}` (4) · `{palette}` (4, DECOR colour, never light on faces) · `{flourish}` (6) ·
  `{time}` (3), each picked by `fnv1a+fmix32(userId:holiday:year:axis) % n` — stable per user, evenly
  spread, different next year. 1728 combos per row; 500 users → 438 distinct heroes, 94% of the prompt
  text varies (`scripts/simulate-holiday-hero.mjs` is the gate; it exits 1 on a pigeonhole).
- **Render flow:** `activeHolidays` is computed ABOVE the chaos pre-roll; if a holiday has
  `daysUntilPeak === 0` and hero rows exist and the user has a self photo, the pre-roll is forced to
  `face_swap_dual` (with a +1) or `face_swap_self`; the scenario block then injects the filled recipe
  (bypassing the roll + shuffle-bag) with `dualSceneKind='elegant'` (couples → refined `partner` poses,
  solos → `glamour`). No-cast users get the **scene-only hero**: Path 2 fires at 100% from the day-of
  holiday. Any missing piece falls through to the everyday holiday pool — never a broken render.
  Forensics: `fallback_reasons` carries `holiday_hero_preroll:…` + `holiday_hero:<key>:<surface>:<register>:<axis picks>`.
- **QA off-season:** `force_day_of=<key>` (+ `force_hero_register`, `force_hero_seed`);
  `scripts/qa-holiday-hero.js` renders surfaces × registers × seeds to Kevin's album captioned
  `🎃 HERO <surface> <register> s<n> R<round>` and asserts the response's `hero: true`.

### Recipe rules (learned the hard way, 2026-09-04)
- **Scene = PURE ENVIRONMENT.** A "the couple standing side by side … as the guests of honor" clause made
  8/9 couple heroes fail the +1 identity gate (Flux adds figures the dual detector latches onto). v3 dropped
  it (and the `role` axis); cozy couples went 0/3 → 4/4.
- Every `{setting}` LEADS with its Halloween noun (CLIP first-noun lock) — "A ring of floating candles
  around a glowing green cauldron in a moonlit clearing", not "A moonlit clearing …".
- Attire = clothing only, nothing at the jawline (hats only "tilted back off the face"); no negations.
- Mediums: cozy → `photography` (passes cleanly); eerie → `painted_gothic_fantasy` (`gothic_painted`
  rendered a torn-edge watercolor and lost the wardrobe).

## 14. The holiday POSTCARD overlay — BUILT 2026-09-04 (migration 459)

Decorative "Happy Halloween" / "Merry Christmas" lettering composited onto the render so it lands like
a holiday postcard — Kevin's "wow" feature for everyone who gets a nightly.
- **Artwork:** `scripts/gen-holiday-postcard.mjs --holiday <key> --variants 3` → GPT Image (transparent
  PNG, ornate lettering + ornaments), trimmed, previewed on a real render; `--set <png> [--width 70
  --margin 4 --anchor bottom]` uploads to `uploads/assets/holiday/` and points `holidays.postcard_overlay_url`
  (+ `postcard_anchor/width_pct/margin_pct/scrim`) at it — all dashboard-tunable. Halloween: 3 variants
  uploaded (ornate gothic = LIVE, playful retro, elegant script); switching = one UPDATE.
- **Compositing:** the `holiday-postcard` Edge Function (its OWN isolate — never pixel work in the render):
  jsquash decode → `_shared/postcardComposite.ts` (bilinear resize to `width_pct`, smoothstep scrim band,
  straight-alpha blend; 10 unit tests) → JPEG q92 → storage upsert to the SAME object path (image_url
  unchanged; uploads are drafted before the client sees them). ~2.2 s. Auth = service-role key (the
  render) or the queue worker token (QA: `gen-holiday-postcard.mjs --test <url>` runs it on a COPY).
- **Hook:** nightly-dreams calls it right after persist; `engine_config.holiday_postcard_scope` =
  `off | day_of (default — the hero only) | window (every in-season holiday dream)`. Best-effort: any
  failure keeps the clean image; the outcome is re-stamped into `fallback_reasons` (`postcard:<key>:ok:<ms>`).
- **Pool sizing (Kevin 2026-09-04):** holiday pools seed at **25** (MVP) and, once a pool survives the
  matrix, scale to a **50 cap** — never 100. Holidays are in rotation for a short window, so 50 × the
  number of pools is plenty. Nothing scales until Kevin has graded the matrix.

## FINAL Halloween pool list — 14 pools (Kevin, 2026-09-05; supersedes the 48-pool sprawl)

Why: the 2026-09-04 matrix showed heavy overlap (seven porch/yard pools) and jack-o-lanterns
spammed into pools that should be purple/black/green. Fix = consolidate to 14 distinct worlds, give
each its own PALETTE + SIGNATURE OBJECTS, allow jack-o-lanterns only where they belong, enforce it in
the linter, scrub existing rows, and draw pools with EQUAL AIRTIME (pick the pool, then a row).

| # | pool key | palette | signature objects | folds in (old sub_themes → relabelled) |
|---|---|---|---|---|
| 1 | `halloween_neighborhood` | orange/amber cozy | porches, cul-de-sacs, inflatables, yard skeletons, string lights, jack-o-lanterns | cozy_porch, decorated_neighborhood, trick_or_treating, pumpkin_carving, jack_o_lantern_overload, suburban_halloween_chaos, salem_town_night, + 80s flashlight suburbia |
| 2 | `pumpkin_patch_night` | orange/amber | pumpkin fields, hayride wagon, corn-maze torches, harvest moon, scarecrows | enchanted_pumpkin_patch, jack_o_lantern_festival, pumpkin_king_patch, haunted_hayride, corn_maze_torchlight, fall_festival |
| 3 | `witch_cottage` | purple/green | cauldron, spell books, black cats, brooms, candles, herbs | witch, witch_sisters_cottage, witchy_victorian_house, black_cat_alley, + cursed library |
| 4 | `gothic_manor` | black/violet/candle | candelabra, ballroom, velvet, carriage, vampire aristocrat, undead wedding, greenhouse | haunted_mansion, vampire, midnight_carriage, gothic_masquerade_ball, gothic_glam_editorial, gothic_greenhouse, macabre_family_mansion, undead_wedding, + 1920s ghost hotel |
| 5 | `haunted_graveyard` | blue/black/fog | tombstones, fog, ravens, blood moon, reaper, headless rider, translucent ghosts | reaper, ghost_glam, graveyard_picnic, headless_hollow_bridge, friendly_ghost_manor |
| 6 | `halloween_town_square` | purple/green whimsy | crooked spires, spiral hill, green fountain, huge moon, pumpkin-headed scarecrows | halloween_town_square, + stop-motion whimsy-creepy |
| 7 | `haunted_house_comedy` | b/w stripes, mint, green | striped suits, waiting room, floating dinner party, cobwebbed attic + model town (NO sandworms/desert) | afterlife_waiting_room, striped_suit_haunting |
| 8 | `halloween_party` | orange/black party | costume party, disco ball, dance hall, candy, café, garage band | halloween_party, movie_night, skeleton_dance_hall, candy_store_frenzy, pumpkin_spice_cafe, monster_garage_band, + monster hotel lobby |
| 9 | `haunted_attractions` | carnival red/strobe | haunted-house walkthrough, abandoned carnival, dark big top, haunted carousel, fortune booth | haunted_house_attraction, haunted_amusement_park, + dark carnival |
| 10 | `mad_lab_and_monsters` | green glass/silver moon | bubbling lab, monster-hunter kit, werewolf moon forest | mad_scientist, monster_hunter, werewolf_moon_forest |
| 11 | `ghost_hunting_crew` | tan/brick/slime green | jumpsuits, glowing gadget packs, firehouse HQ, haunted library, ghost trap | NEW |
| 12 | `seance_parlor` | violet velvet/candle | crystal ball, tarot, spirit board, levitating table, drifting curtains | NEW |
| 13 | `cute_halloween` | pastel orange/lilac | plush ghosts, cats in witch hats, candy-corn palette, tiny pumpkin cafés | NEW |
| 14 | `ghost_pirate_ship` | moonlit silver/gold | galleon, torn sails, fog, cursed gold, skeleton crew | NEW |

- **Killed:** `cat_burglar` (rows disabled). **Moved to Fall** (`category='fall'`): `canyon_fall_hike`,
  `autumn_fae`, `harvest_royalty`.
- **Jack-o-lanterns** allowed as a signature object ONLY in pools 1, 2, 8 (light) and 13; the linter
  bans pumpkin/jack-o-lantern/gourd nouns in every other pool (`holidayPoolLint` per-pool ban list).
- **Equal airtime:** the engine picks a `sub_theme` uniformly, then a row within it (holiday paths only),
  so a pool's row count no longer sets its share.
- **Palette** is part of each pool's setting family in the generator; the old blanket "crimson/violet/
  emerald + hundreds of lanterns" punch is retired.
- Existing rows are relabelled (ledger in the session scratchpad), then scrubbed: eerie-pool rows that
  mention pumpkins are rewritten into the pool's own objects; pure lantern filler is disabled.
- Production sizing unchanged: 25 to start, 50 cap per pool after the matrix.
- **Even sizing (Kevin 2026-09-05):** every final pool targets **50 dual + 50 single**. Folded pools
  above 50 are TRIMMED to 50 by disabling (never deleting) in this order: palette violators (pumpkin
  nouns in eerie pools) → near-duplicates (60-char key) → proportional trim across the pool's
  sub-pools so each fold keeps its share. Pools below 50 (the 4 new ones at 25, town square at 25)
  seed up to 50 only after the matrix sign-off. Projected pre-trim dual counts from the relabel:
  neighborhood 127, party 126, gothic manor 125, graveyard 103, pumpkin patch 102, witch 88,
  comedy 50, attractions 50, mad lab 51, town square 25.
- **Implementation (2026-09-05, commit 5d3554ba):** taxonomy = `scripts/lib/halloweenPools.js` (single
  source of truth; engine mirror `_shared/holidayPools.ts`, parity-tested). Share = **70 per table**,
  per sub = ceil(70 / subs) — always round up (Kevin). Seeding: `node scripts/gen-holiday-archetypes.js
  --holiday halloween --pool <main|all> --to-share --kind cast` tops every sub up to its share with the
  pool's palette + objects; the linter drops pumpkin/jack-o-lantern rows outside the 4 lantern pools.
  Draw: `pickHoliday()` picks a MAIN pool uniformly, then a row (equal airtime). Eerie + new pools
  were RESEEDED fresh (old rows disabled after the new ones landed; ledgers in the session
  scratchpad); lantern pools were deduped + trimmed to share (newest kept), then topped up.
- **FOLLOW-UP (Kevin asked to be reminded):** the scene-only "postcard" holiday rows (`holiday_scenes`,
  14 for all of Halloween) are still one loose pile, not organized by the 14 pools. Decide whether to
  author ~10 empty-scene rows per pool so no-people Halloween dreams also land in the 14 worlds.
