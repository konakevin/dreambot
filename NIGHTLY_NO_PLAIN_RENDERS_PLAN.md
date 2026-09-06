# Nightly: no plain-jane renders (PLAN, 2026-09-06 — Kevin: "very, very, very important")

**Kevin's words:** "these are dreamscapes, the people should be whisked away into an actual dream setting.
closeups are fine if the character is in some crazy outfit or their outfit or style IS the dream — like some
medieval warrior — but these pedestrian looking headshot renders have got to go … fix nightly so it never
produces plain-jane renders like this — without overcorrecting and forcing every render into some crazy setting."
Trigger case: sunnysteph 2026-09-06 (glamour_shot_retro seed → ivory blazer + pinstripe suit in front of an
art-deco backdrop, hands linked, midday light: a clean corporate photo, not a dream).

## 1. The definition (the "dream test")

A render PASSES if either is true:
- **Setting is the dream:** a real or imagined place with wonder — atmosphere, spectacle, scale, striking
  light, weather, time of day, story (a moonlit lane of jack-o-lanterns, the Matterhorn at dawn, a gothic
  ballroom, a pirate ship, a rooftop under a huge moon).
- **Character is the dream:** a transformation — costume, persona or era (medieval warrior, 1920s flapper,
  astronaut, vampire, pirate). A close-up is welcome here.

A render is PLAIN when ALL three hold: ordinary everyday clothes, an ordinary or blank setting (studio backdrop,
office, plain wall, hotel lobby, generic street, empty room, bland interior), and nothing happening (standing,
posing, a snapshot). **Not overcorrecting:** a person in travel clothes at a genuinely spectacular place is a
dream (setting carries it); a warrior in a plain corridor is a dream (character carries it). Only the
ordinary-and-ordinary-and-static combination fails.

## 2. Where plain comes from (evidence from 2026-09-05/06 renders + prompts)

1. **Seeds whose scene IS a plain setting.** glamour_shot_retro (a painted studio backdrop + pedestal, 109
   rows/table), the Beetlejuice office/waiting-room subs (now folded to goofy), some modern_blacktie /
   evening_city / street_cool rows ("hotel lobby", "sidewalk", "graffiti wall"). The brief then says "keep it a
   BELIEVABLE, elegant, real version of the place" — for a plain seed that locks in plainness.
2. **Pedestrian wardrobe on real-world locations** (the traveler rule, needed for race fidelity) — fine when
   the place carries the dream, plain when the place is generic or the card's cinematic phrases are weak.
3. **Static pool poses** on the paths scene-first actions do not cover: rows with a pinned `pose_pool`
   (glamour), active rows are fine (verb in the seed). Location couples are held on the old path.
4. **Two-head close-ups** on painterly flux-1.1-pro couples (SCENE_FIRST_ACTION_PLAN §8): a bust crop of two
   people in a blazer is a cutout even over a good scene.
5. **Flat light / mood words** from seeds ("crisp midday light", "studio") and from photography + flux-dev.

## 3. The fix — four layers, each measured, none forcing "crazy"

- **L1 Seed audit + lint (prevention, biggest lever).** Score every enabled scenario seed (dual + single, all
  pools, ≈14k rows) with a Sonnet text judge on the dream test applied to the SEED (scene + attire): plain
  setting AND ordinary attire → flag. Kevin reviews the flagged list by category; flagged rows are disabled or
  rewritten with a set-dresser pass (light, weather, scale, one spectacle element) that keeps the seed's idea.
  New lint rule in `scripts/lib/holidayPoolLint.js` (+ the seeding scripts): banned plain-setting terms
  (studio backdrop, office, cubicle, waiting room, conference room, parking lot, plain wall, hotel lobby,
  generic street) unless the attire is a persona. Category-level decision for glamour_shot_retro: cut, or
  rebuild so the parody is unmistakable (soft-focus laser backdrop, 1988 mall studio) — Kevin: lean cut.
- **L2 Brief "dream lift" (bias, not force).** In `characterSlotPrompt.ts` scene_description rules, replace
  "keep it a BELIEVABLE, elegant, real version of the place — no whimsical …" with: "This is a DREAM: keep the
  place real and elegant, but give it at least one element of wonder that truly belongs there — the hour of
  light, weather, scale, atmosphere, a striking feature — never a novelty prop." Golden-tested (flag-off path
  for create/DLT stays identical via an `isNightly` input, or Kevin decides create gets it too).
  Also: the pinned-pose-pool exemption in `sceneFirstEligibility` becomes opt-in per row, so glamour-style
  static pools stop overriding scene-first beats.
- **L3 Render gate PLAIN check (safety net).** `_shared/qualityGate.ts` gains a third closed question, PLAIN,
  with the §1 definition (Sonnet vision, fail-open like BROKEN/PROFILE). On PLAIN the render is NOT shipped:
  re-roll ONCE with the plain seed excluded (scenario → a different row; location → force the location
  awe-beat / active pose) — the identity-verified retry path that already exists. Stamps `quality_gate:plain`
  + `plain_reroll:<kind>`; the second render ships regardless (never a missing nightly). Cost ≈ one extra
  render for the plain share only.
- **L4 Framing + model** (already in flight): couple close-ups on 1.1-pro — SCENE_FIRST_ACTION_PLAN §8;
  the nailed-looks research is the long-term answer. Not re-litigated here.

## 4. Measurement (before, during, after)

- **Baseline audit** (this session): every real-user cast render of the last 7 nights judged DREAM/PLAIN with
  the §1 rubric (`scratchpad/plain-audit`) → plain rate by kind / medium / model / couple-vs-solo, with a contact
  sheet of the PLAIN ones for Kevin. This decides where L1 effort goes first.
- **Metric of record:** `quality_gate:plain` rate per nightly (target < 2%), plus a weekly re-audit of 40
  random renders with the same rubric (rubric drift check). A fail-loud monitor derives its threshold from
  config (CLAUDE.md monitor rule).
- **Overcorrection check:** in the same audits, count renders judged "forced / absurd / off-brief for the
  place" — must not rise.

## 5. Order + tests

1. Baseline audit → Kevin sees the PLAIN sheet and the sources table (no code).
2. L1 seed audit script (`scripts/audit-seed-dream-test.js`, Sonnet text judge, paginated, ledgered) → flagged
   list by category → Kevin's cut/rewrite calls → apply (scoped disables + rewrites, lint added, tests).
3. L2 brief line (golden regenerated deliberately; 12-render A/B on the same seeds, judged by the rubric) +
   pose-pool opt-in (eligibility tests).
4. L3 PLAIN gate (unit tests on parse; `scripts/eval-quality-gate.ts` fixtures: sunnysteph's render must be
   PLAIN, the Matterhorn cyclist and the pirate must be DREAM); dark-deploy behind `engine_config.
   quality_gate_plain` (off → on after a 20-render forced batch).
5. Re-audit after one nightly; report the plain rate before/after.

## 6. Baseline audit result (2026-09-06, last 7 nights, real users, cast renders)

26 renders judged with the §1 rubric (Sonnet vision): **3 PLAIN (12%)**, 23 DREAM. By kind: goofy 2/4, location
1/15, elegant 0/2, active 0/4. By model: flux-1.1-pro 2/22, flux-dev 1/1, flux-2-flex 0/3. The three:
goofy glamour-pool solo ("ordinary park, everyday outfit, a goose"), location film_noir solo ("floral blouse,
generic palm atrium" — a bland location card), goofy photography flux-dev couple (sunnysteph: suits in a
gold-panelled interior). Read: the seed layer (L1) is the biggest lever; the location-card layer needs a
per-card dream check too (a card whose essence is "palm atrium" cannot carry a dream); L3 catches the rest.

## 7. Detailed spec (no unknowns; every item has its test)

### L1 — `scripts/audit-seed-dream-test.js` (node, read-only by default)
- Input: every ENABLED row of dual_scenarios + single_scenarios (paginated, PostgREST 1000 cap), all pools
  incl. holiday; plus every `location_cards` row with picker_category (name + cinematic_phrases + atmosphere).
- Judge: Sonnet text, 25 rows per call, JSON out `[{id, verdict: DREAM|PLAIN, why}]`. Rubric = §1 applied to
  the SEED TEXT (scene + attire; for cards: essence). Persona attire rescues a plain setting; a spectacular
  setting rescues plain attire.
- Output: `scratchpad/plain-audit/seeds-<table>.json` + a per-category table (plain / total) printed; `--disable`
  applies scoped disables to PLAIN rows with a ledger (ids + old disabled flag) — only after Kevin's review.
- Lint (`scripts/lib/holidayPoolLint.js`, shared by the seeders): `PLAIN_SETTING` regex (studio backdrop |
  photo studio | office | cubicle | waiting room | conference room | boardroom | parking lot | plain wall |
  blank wall | hotel lobby | generic street | empty room | reception desk) flags a row unless `attire` matches
  `PERSONA_ATTIRE` (costume | armor | gown | cape | robe | uniform | tuxedo | flapper | pirate | warrior | …).
  Tests: `__tests__/lib/holidayPoolLint.test.ts` — plain seed flagged; persona attire rescues; spectacular
  setting not flagged; the sunnysteph seed text flagged.
- Category decision: glamour_shot_retro → Kevin's call (lean cut). Recorded in the ledger either way.

### L2 — brief "dream lift" + pose-pool opt-in
- `characterSlotPrompt.ts` `buildSlotBrief`: new input `dreamLift?: boolean` (nightly sets true). When true the
  scene_description rule reads: "This is a DREAM. Keep the place real and elegant, and give it at least ONE
  element of wonder that truly belongs there — the hour of light, weather, scale, atmosphere, a striking
  natural or architectural feature. Never a novelty prop, never a different place." When unset the text is
  byte-identical (golden fixture). Tests: flag on → line present, anti-oddity line still present; flag off →
  golden unchanged.
- `sceneFirstEligibility.decideSceneFirst`: `bespokePool` no longer blocks by itself; a row blocks only when
  its pool is in `SCENE_FIRST_KEEP_POOLS` (curated pools that must win — today: none; 'glamour' removed).
  Tests: bespoke 'glamour' → rolls; a keep-pool → blocked; existing table unchanged otherwise.
  The resolver keeps the bespoke pose as the FALLBACK action (already how the fallback works).

### L3 — PLAIN check in the render gate + one re-roll
- `_shared/qualityGate.ts`: third closed question PLAIN (§1 text, "answer PLAIN only if ALL THREE hold"); parse
  → flags ['broken','profile','plain']; `engine_config.quality_gate_plain` (mig 466, false) gates whether PLAIN
  is acted on (stamped always → measurable dark).
  Tests: parse fixtures (PLAIN yes/no/missing → fail-open), the flag order, unchanged BROKEN/PROFILE behaviour.
  `scripts/eval-quality-gate.ts` fixtures: sunnysteph's render → PLAIN; Matterhorn cyclist, pirate, hayride →
  not PLAIN (rubric sanity, run live).
- nightly: on PLAIN with the knob on → stamp `quality_gate:plain`, re-roll ONCE: scenario row → `recordPick`
  the plain row and pick again from the same pool (the shuffle-bag excludes it); location → force the location
  awe-beat + the ACTIVE pose roll on the same place (the dream lift bias already applies). The re-render goes
  through the same identity-verified path; the second result ships whatever the gate says (never a missing
  nightly). Stamps `plain_reroll:<kind>`. Tests: a pure `planPlainReroll(state)` helper (which pool, what to
  exclude, which forces) with a branch table.

### L4 — location cards
- Cards flagged PLAIN by the L1 card pass get their `cinematic_phrases` rewritten by a set-dresser pass (one
  Sonnet call per card, reviewed) or are hidden from the picker. Test: every picker card has ≥ 3 phrases and
  none matches `PLAIN_SETTING`.

### Guardrails against overcorrection
- The dream-lift line says "truly belongs there" and "never a different place"; the re-roll uses the SAME
  pools; nothing forces fantasy. Audit metric #2 (forced / absurd) must not rise; Kevin grades the L2 A/B.

## 8. What actually drives the headshots — audit of record (2026-09-06)

Population: 520 nightly cast renders from the last 14 days (real users), each judged by a Sonnet vision
rubric built from Kevin's calibration (close framing is fine when the setting still reads; BAD = tight crop
with an illegible / blurred / blank setting in everyday clothes, or a nonsensical prop). Judge:
`scratchpad/framing-audit/judge.mjs`; results `framing-audit/judged-all.json`.

| measure | result | read |
|---|---|---|
| headshot class (tight + illegible + everyday) | 4 / 520 = 0.8% | the "sunnysteph" class is RARE |
| … of which from the couple-degrade solo rebuild | 3 / 4 | ONE code path owns the class |
| couple-degrade rebuilds (n=75): tight crops | 63% | the tightest population in the engine |
| flux-1.1-pro override fragment renders: tight | 44% (vs 7% on real medium fragments) | the fragment, not the seed |
| flux-1.1-pro: tight | 43% (vs 0% on flex / dev / max) | the model |
| tight but setting legible (the "ok" class) | ~30% | matches calibration: acceptable |
| nonsense prop, non-goofy renders | 10.6% | gag poses leaking from shared pools |
| seed text audit (dual goofy + elegant, Sonnet) | ≈ 6 PLAIN / 2300 | seeds are not the problem |

Root causes, in order of contribution:
1. **The couple-degrade solo rebuild** (`nightly-dreams/index.ts` `rerender` closure): when a couple swap
   fails the +1 gate, the engine rebuilt a solo prompt from the dual slots but kept the couple's model pick
   (flux-1.1-pro) AND the 1.1-pro OVERRIDE fragment (`faceSwapModelOverrides.ts`: the medium's real
   fragment is replaced by "painterly realism" portrait language). Portrait language + 1.1-pro = the
   engine's tightest crops, and the rebuild had no scene-first action of its own.
2. **Gag poses in the shared `candid` / `active` pose pools** (lollipop, ironing board, rubber duck …)
   surfacing in non-playful scenes as the scene-first FALLBACK action → the "nonsensical" class.
3. **`glamour_shot_retro`** — a studio-backdrop pool by construction (painted / seamless backdrop seeds):
   every render passes the framing rubric's "setting: none" test by design.

## 9. Fixes shipped (2026-09-06) — narrow, measured, no main-path prompt text changed

- **F1** 25 gag poses disabled in the shared pools (`is_active=false`, ledger
  `scratchpad/pose-audit/disable-gag-poses-ledger.json`; playful / goofy pools untouched).
- **F3** `glamour_shot_retro` disabled: 100 dual + 109 single rows (ledger
  `disable-glamour-shot-retro-ledger.json`). Reversible.
- **F2** the solo rebuild renders the medium's REAL face-swap fragment (`soloRebuildInput()` in
  `characterSlotPrompt.ts`) on `engine_config.solo_rebuild_model` (mig 466; default
  `black-forest-labs/flux-2-flex`, 0% tight in the audit; `''` = the couple's model, i.e. the old
  behaviour). Stamps `solo_fallback:rebuilt_solo:<model>`; `ai_generation_log.model_used` now records the
  rebuild model when it differs. Tests: `__tests__/lib/dualSoloFallback.test.ts` (22 pass).
- **L1 lint** `lintDreamTest()` in `scripts/lib/holidayPoolLint.js` (PLAIN_SETTING / PERSONA_ATTIRE) + the
  Sonnet seed judge `scripts/audit-seed-dream-test.js` for future pool audits.

## 10. Proof — 40 renders (Kevin's private album: 🧪 F2 · 🎲 NATURAL · 🧪 CANDID · 🧪 F2b)

| batch | n | what it exercises | result |
|---|---|---|---|
| 🧪 F2 + F2b | 22 couples forced to flux-1.1-pro on painterly mediums | provoke degrades → rebuild path | 5 degraded → 5/5 rebuilt on flex, full / three-quarter framing, strong setting (porch at sunset, witch's study, graveyard picnic with ghosts, Hollywood terrace) |
| 🎲 NATURAL | 12, no forces (6 solo / 6 couple) | the "average" nightly | 0 headshot class, 3 tight-but-legible (25%, = baseline), 1 degrade → rebuilt full-body (neon rooftop) |
| 🧪 CANDID | 6 solos on the candid pool | gag leak after F1 | 0 gags; 6/6 full or three-quarter, strong setting |
| **all 40** | | judge rubric | **headshot class 0 / 40** (baseline 0.8%; degraded baseline 63% tight); judge-raw "nonsense" 8 / 40 but on inspection 7 are on-theme seeds (cursed-library flying books, goofy giant burger / feather storm / engine-block desk, roller-disco ball, candy-land post, sci-fi flowers) and 1 is a real oddity (a paper on a terrace) |

Read: the rebuild path is fixed (6/6 vs "63% tight, 3 of 4 headshots"); the average render is unchanged
(same tight-but-legible share, same look, same identity range 0.45-0.79).

## 11. Deliberately NOT changed (overcorrection guard)

- L2 (brief "dream lift"), L3 (PLAIN gate + re-roll), L4 (cards): **deferred**. The audit puts the headshot
  class at 0.8% and inside one code path; a prompt-wide lift would touch the 99% that already works.
- The couple framing block: untouched (width costs identity on 1.1-pro — `dual-framing-width-costs-identity`).
- flux-1.1-pro stays for couples (Kevin 2026-09-06). Its tight-but-legible two-head crops (~25% of couples)
  remain and pass the calibration; the lever for those is the model steer, which is OFF by Kevin's call.
- The 1.1-pro override fragment still applies to the MAIN couple render (only the rebuild dropped it).
