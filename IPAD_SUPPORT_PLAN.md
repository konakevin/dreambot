# Plan: Support all Apple device sizes (iPhone SE → iPad), iPad solved

> Status: APPROVED, not yet started. Scoped 2026-06-29; pick up from Phase 0.

## Context

The app currently ships iPhone-only (`app.config.js`: `supportsTablet: false`). App
Store Connect now requires iPad support. The goal is a **"good enough" port, not an
optimized iPad experience** — and explicitly **no re-rendering of images** (the 9:16
renders upscale on iPad acceptably).

Two deep audits established the responsiveness surface:
- **The scale engine (`lib/responsive.ts`) is solid but non-reactive** — `verticalScale`,
  `fontScale`, `horizontalScale`, `space`, `screen`, and the percent helpers are all
  computed **once at module load** from `Dimensions.get('window')` (~23 files also
  capture `Dimensions` directly). On a phone this is fine; it only breaks if the window
  **resizes** (iPad split-screen / rotation).
- **No global width constraint** — the app is edge-to-edge, so content stretches full
  width on iPad. `useDeviceClass()` (with `isTablet`) **exists but is used in only 1 file**.
- **The 3-column photo grid is hardcoded** (`constants/grid.ts`) — looks sparse on iPad.
- **Sheets/overlays stretch full-width** on iPad (e.g. `LikesSheet` = 75% of width).
- **iPhone SE is already fine** — proportional scaling + font clamping; only cosmetic nits.

**Decisions (confirmed with owner):**
1. **Hybrid layout** — feed + image detail stay **centered phone-width**; **grids fill**
   the iPad width with more columns.
2. **iPad = portrait-only + fullscreen** (no split-screen / multitasking).

Decision #2 is the keystone: with the window never resizing, **every existing
non-reactive dimension capture is safe**, so we avoid a ~23-file reactive refactor
entirely. The remaining work is making iPad *look* right, driven mostly at the engine +
container level rather than file-by-file.

## Strategy

"**iPad = a big centered phone, with grids that fill the extra width.**" Three leverage
points do most of the work; a small set of targeted fixes handles the rest.

1. **Lock the foundation** (config) → eliminates the only correctness risk.
2. **Make the scale engine tablet-aware** → all ~90 consumers get phone-sized
   spacing/fonts on iPad with zero per-file edits.
3. **Center content + fill grids** → a `ResponsiveContainer` for the phone-width screens;
   tablet column count for grids.

## Phase 0 — Enable + de-risk (XS, ~1 hr)

- `app.config.js`: set `ios.supportsTablet: true`, `ios.requireFullScreen: true`, keep
  `orientation: 'portrait'`.
- `ios/DreamBot/Info.plist`: set `UIRequiresFullScreen = true`; keep
  `UISupportedInterfaceOrientations` portrait-only (no `~ipad` landscape keys).
- (App Store Connect: add iPad screenshots — store task, not code.)

Outcome: submittable for iPad; split-screen/rotation reactivity problem removed by
construction.

## Phase 1 — Tablet-aware scale engine (`lib/responsive.ts`) (S, ~½ day)

The single highest-leverage change. Today on iPad the helpers balloon (vertical ~1.4×,
horizontal ~2.1×). Fix it at the source:

- Detect tablet at module load (`width >= 600`, mirroring `useDeviceClass`'s threshold).
- When on tablet, **cap the effective dimensions** feeding the helpers to phone maximums
  (height clamped to ~932pt, width to ~440pt) before computing `verticalScale` /
  `horizontalScale` / `fontScale` / `space` / `screen` / `heightPercent` / `widthPercent`.
- Net effect: spacing, fonts, and any `screen.width - X` max-widths render **phone-sized**
  on iPad automatically — no changes in the ~90 consumer files. Safe because
  fullscreen+portrait means the module-load capture never goes stale.
- `useDeviceClass()` stays as-is (it reports the **real** width/height) — it becomes the
  backbone for the grid + sheet branching below.

## Phase 2 — Center the phone-width content: `ResponsiveContainer` (S, ~½–1 day)

- New `components/ResponsiveContainer.tsx`: a transparent, centered wrapper with a
  phone-like `maxWidth` (~500pt) and `alignSelf: 'center'`. No-op on phones.
- Wrap the content root of the **centered** surfaces:
  - Full-screen feed (`components/FullScreenFeed.tsx` / `components/DreamCard.tsx` pager)
    → 9:16 card becomes a centered phone-width column, black side-margins on iPad.
  - Create (`app/(tabs)/create.tsx`), Settings + forms, Onboarding pager + steps
    (`app/(onboarding)/index.tsx`), Paywall / Sparkle / Pro screens.

## Phase 3 — Grids fill the iPad width (S, ~½ day)

- `constants/grid.ts`: derive `NUM_COLUMNS` from device class — **4–5 columns on iPad**,
  3 on phones — using the **real** width (not the Phase-1 capped value). Module-load
  computation is fine (fullscreen+portrait = no resize); expose via the existing
  constants or a tiny `useGridMetrics` helper if cleaner.
- Grids **opt out** of `ResponsiveContainer` (they fill). Consumers inherit the column
  count: `PostGrid*` / `PostTile*`, profile + saved + search grids, plus the photo grids
  in `components/onboarding/DreamCastStep.tsx` and `BotSelectorStep.tsx`.

## Phase 4 — Cap the floaty UI (sheets / overlays) (S, ~½ day)

Absolutely-positioned / portal UI isn't caught by the container, so cap explicitly using
`useDeviceClass().isTablet`:
- `LikesSheet` (75% width → ~400pt), `StylePickerSheet` / `FilterPickerSheet` /
  `ModelPicker` (full-width → ~500pt centered card), `CommentOverlay` (thumbnail
  centering).
- The 6 intro sheets that use `screen.width - X` (`CreateIntroSheet`, `SparkleIntroSheet`,
  `MediumsIntroSheet`, `DreamCastStep`, `BotSelectorStep`, `MoodSlidersStep`) **auto-fix**
  via Phase 1's capped `screen.width` — verify, don't re-edit.

## Phase 5 — Optional polish (defer unless wanted)

- Higher-res mascot/onboarding art for iPad Pro sharpness (current 512px upscales OK).
- SE micro-polish: a couple of hardcoded paddings not currently scaled
  (`MagicalLoadingStage` `paddingHorizontal: 32`, `ScreenLayout` title
  `paddingHorizontal: 60`) → wrap in `horizontalScale`. SE already works; cosmetic only.

## Small-phone (SE) status

Already solid — proportional scaling + font clamping. The Phase-1 cap only affects
tablets, so phones are untouched. No blockers; Phase 5 nits are optional.

## Critical files

- `app.config.js`, `ios/DreamBot/Info.plist` (Phase 0)
- `lib/responsive.ts` (Phase 1 engine cap — reuses existing helpers + `useDeviceClass`)
- `components/ResponsiveContainer.tsx` (new) + the centered screen roots above (Phase 2)
- `constants/grid.ts` + grid consumers (Phase 3)
- `LikesSheet`, `StylePickerSheet`, `FilterPickerSheet`, `ModelPicker`, `CommentOverlay`
  (Phase 4)

## Reuse (don't reinvent)

- `lib/responsive.ts` `useDeviceClass()` already returns `isTablet` — this plan promotes
  it from 1 file to the backbone of grid + sheet branching.
- Scale-helper **signatures stay identical**; only the dimension source they read is
  capped, so call sites don't change.

## Effort

Phases 0–4 = the "good enough, iPad solved, all sizes supported" target ≈ **2–3 days**
including iPad + SE simulator QA (a Small). Phase 5 optional.

## Verification

- **iPad simulator** (iPad 10th gen + iPad Pro 12.9"): feed is a centered phone-width
  column; grids show 4–5 columns filling the width; sheets are centered cards (not
  full-bleed); fonts/spacing read phone-sized (not ballooned); onboarding, create,
  settings, paywall readable with no edge-to-edge stretch and no blank/broken regions.
  Rotate the simulator → app stays portrait.
- **iPhone SE (667pt) simulator**: regression check — no clipping, fonts/spacing
  unchanged from today.
- **iPhone Pro Max (932pt)**: unchanged.
- **Smoke path**: launch → scroll feed → open a post (comments/likes sheets) → profile +
  saved grids → full onboarding flow → create + each picker sheet → paywall.
- **Submission**: `eas build` / archive, validate in App Store Connect that iPad support
  is accepted with the iPad screenshots attached.
