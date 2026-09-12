# Nightly Vibes — audit, proposals, matrix, contract design

**Status (2026-09-11, evening):** four matrix rounds are DONE (A = today's route, B = fragment after the scene,
C = fragment early, D = early + rewritten fragments); results, the mechanism decision and the recommended list are
in §8; the side-by-side page is `~/Desktop/nightly-vibes-compare.html` (also captions `✨ VIBE <key> #1 […]` in
Kevin's Dreams album). Kevin finalises the list from §8; then the vibe is wired into the style contract
(`NIGHTLY_LOOKS_REFACTOR_PLAN.md` Phase 2) before the nightly QA renders.
Companion docs: `NIGHTLY_LOOKS_CATALOG_PLAN.md`, `REAL_FACE_LOOKS_REGISTRY.md`, `NIGHTLY_LOOK_TALLY.md`.

## 1. What a vibe is today (verified in code, not from memory)

- **Row** in `dream_vibes`: `directive` (500-1300 chars of mood prose), `face_swap_directive` (kawaii only),
  `description` (the picker blurb), `client_meta.restyle_fragment` (Create restyle), `is_dream_eligible`
  (= the nightly + first-dream roll pool), `is_active` (Create picker via `get_dream_vibes()`), and since
  mig 503 **`nightly_only`** (usable by the nightly engine, hidden from the Create picker).
- **Roll** (`nightly-dreams/index.ts` ~802): `resolveVibeFromDb('dream_eligible', recentVibes)` = a uniform
  pick over the eligible pool minus the user's last 7 vibes (if fewer than 2 remain, the whole pool). Rolled
  BEFORE and independently of the medium/look. Stamped as `rolled_axes.vibe`.
- **Route to pixels on cast renders** (the `subject_first` composer, `characterSlotPrompt.ts`): the directive
  is handed to Sonnet as `VIBE (use for the mood field)`; Sonnet answers with `mood` = "1-3 short phrases";
  the composer places `slots.mood` near the END of the Flux prompt, after the scene, the identity blocks, the
  action and the framing. Real nightlies from 2026-09-08 carried exactly this much vibe:
  `monumental quiet grandeur, reverent pre-dawn stillness` (epic), `serene suspended stillness, quiet summer
  reverence` (peaceful), `something unsaid hanging in warm golden air` (cinematic).
- **The light belongs to someone else.** Three separately rolled axes (TIME / WEATHER / PHENOMENON) are handed
  to Sonnet as `ATMOSPHERIC CONDITIONS (weave into scene_description, do NOT contradict)`. So `peaceful` can
  meet a storm axis, and a vibe's own light language ("moonlight through fog", "the last hour before sunset")
  never reaches `scene_description`, which is where Flux actually reads the light.
- **Scene-only renders** (no cast) go through `promptCompiler.ts` with the FULL directive inside the Sonnet
  brief, a much stronger route. Nightly is mostly cast renders, so the weak route is the one that matters.
- The looks matrix (rounds 1-3) bypassed all of this: forced slots carried a fixed `mood`, so **vibes have
  never been tested under the looks catalog**. That is what the vibe matrix does.

**Expectation before the renders:** on cast renders a vibe is a whisper by construction (a 700-char mood essay
compressed to three words at the tail of a 280-word prompt, with the light dictated by other axes). The matrix
measures how much survives; §6 is the fix if the answer is "not enough".

## 2. The current nightly pool (5 eligible)

| key | blurb | what the directive asks for | audit |
|---|---|---|---|
| cinematic | Main-character moment | filmic grade, deliberate composition, quiet tension | Composition is locked by code on cast renders, so this reduces to "muted grade + tension". The most generic of the five; likely indistinguishable from no vibe. |
| cozy | Hot-cocoa energy | intimate interiors, candle/lamp light, tactile textures | Location-bound wording ("small rooms, nooks, campfires"); at a glasshouse or on a cliff it can only bring warm light. Fine as an accent, mis-described. |
| epic | Absolutely massive | monumental scale, extreme low viewpoint | The viewpoint is locked by the framing block; scale words push the figure smaller (the same failure the looks matrix found for composition-implying look words). Risky on couples. |
| nostalgic | Rose-tinted yesterdays | soft focus, faded, warm, "through old glass" | A softness/finish instruction, which is a LOOK's job (competes with vintage_film / hand_tinted / kodachrome). Reads as a look, not a mood. |
| peaceful | Pure zen | stillness, dawn, low mist, symmetrical framing | Overlaps cozy and nostalgic in output ("soft, warm, calm"). |

**Redundancy:** three of five are "soft, warm, calm" and two are "grand, meaningful". Nightly effectively has
two moods, and neither is exciting.

## 3. Active Create-only vibes considered for nightly

Proposed for the matrix (they are atmosphere accents that fit any place): **dark** (low-key, one precious
light), **ethereal** (glowing haze), **arcane** (magic motes and lantern colors), **enchanted** (sparkle and
brighter-than-life color), **nightshade** (gothic glamour).

Not proposed, and why: **whimsical / surreal** invent objects (the scene rule forbids "novelty oddities", and a
real-face render with a floating whale is not a nightly dream); **fierce** (motion blur, debris, "cranked to
11" = swap risk); **voltage** (city-bound); **ancient** (ruins-bound); **macabre** (elongated figures, oversized
heads = face damage); **kawaii** (cartoon eyes); **coquette** (gendered restyle, excluded since mig 160);
**high_fantasy** (rewrites the setting, a scene transform not an accent); **shimmer** (a flattering finish,
not a mood, could become an always-on polish later); **minimal** (empties the scene); **psychedelic** (pattern
on every surface). Inactive rows (dreamy, chaos, majestic, ominous, aura) stay inactive.

## 4. Ten proposals (mig 503, `nightly_only`, not yet eligible; render via `force_vibe` only)

| key | blurb | the accent | why it earns a slot |
|---|---|---|---|
| golden_hour | Honey light | low warm raking sun, long shadows, rim glow, peach-gold sky | the single most flattering light there is; distinct from cozy (which is interior lamp light) |
| blue_hour | Twilight blues | cobalt dusk, first warm lights on, reflections | pretty cool-warm duet; the natural partner of golden_hour |
| moonlit | Silver night | bright full moon, silver key, stars, low mist | romantic night without the near-black of `dark` |
| stormlight | Before the storm | thunderheads + sun shafts, wind in fabric, electric color | the exciting one: drama without darkness |
| festive | Party lights | string lights, lanterns, confetti, bokeh | fun; the celebration lives in the decor and light |
| after_rain | Fresh and glistening | wet reflective surfaces, beaded drops, deep greens | pretty and cinematic on any location |
| sun_drenched | High summer | hard bright daylight, deep blue sky, saturated cheer | the bold-and-happy register nightly has never had |
| spotlight | Center stage | one warm stage spot on the person, dark surroundings, colored rim | the "main character" idea done literally; frontal light helps the swap |
| aurora | Northern lights | green-violet curtains overhead spilling color into the scene | pure wonder; written to work through glass or above outdoor scenes |
| prism | Light through crystal | rainbow refractions, iridescent sheen, soft bright light | delight; jewelry-level accents on a clean palette |

Every proposal keeps the incumbents' contract: it colors the scene and the atmosphere only (the shared
`IMPORTANT` skin-tone line is on each row), it names no composition, no finish, no objects that would
land in front of the people, and no token from the known trap list ("fire", "particle", "herd").

## 5. The matrix protocol (round A)

- `scripts/qa-nightly-vibes-matrix.js --round=a`: 20 vibes (5 incumbents + 5 Create-only + 10 new), ONE solo
  render each, Kevin's cast, `black-forest-labs/flux-1.1-pro`, look `nightly_digital_painting` (a neutral
  painted canvas so light and palette show; approved couple+solo on 1.1-pro).
- Same fixed scene as the looks matrix (the Victorian glasshouse, at the railing by the koi pond), wardrobe
  LOCKED to the velvet jacket (`costumeLock`), atmosphere axes BLANK so the vibe owns the light.
- The vibe travels the REAL route: `force_vibe` + the vibe's directive in the forced slot input, no forced
  slots, so Sonnet writes scene_description / mood / props from the directive exactly as in production.
- Persisted to Kevin's private Dreams album, caption `✨ VIBE <key> #1 [digital_painting]`; the page shows the
  image, the stamps (identity, swap), what Sonnet wrote, the directive, and a grade
  (`grades.json`: accent 1-5 = how clearly the vibe reads against the other cards, pretty 1-5, verdict
  KEEP / PROMOTE / CUT / REWORK, note).
- Round B (if needed): the same 20 with the §6 mechanism (vibe fragment placed after the scene) to show what
  each vibe CAN do before the list is cut.

## 6. Design: the vibe as the third axis of the style contract (to confirm against the renders)

1. **Roll order** `resolveNightlyStyle`: surface → model (weighted policy) → look (family-first, approvals)
   → **vibe** (nightly-eligible pool, recency 7, minus the look's banned vibes; a scenario / holiday pin wins;
   `force_vibe` wins everything). Stamps `vibe:<key>`, `vibe_source:roll|pin|force`.
2. **The vibe owns the atmosphere.** On the looks path the three TIME / WEATHER / PHENOMENON rolls are
   replaced by the vibe's light. Special scenes keep their authored lighting (`dualSpecialLighting`), holidays
   keep theirs (the holiday's vibe or none).
3. **Sonnet is told so.** `VIBE (use for the mood field)` becomes: the vibe shapes the LIGHT, PALETTE, WEATHER
   and set dressing of `scene_description` AND the mood field.
4. **A verbatim accent.** Each vibe gets `flux_fragment` (≤ 120 chars, e.g. `low warm golden-hour sun raking
   across the scene, long soft shadows, warm rim light`) that the composer places directly after
   `scene_description`, so the accent no longer depends on Sonnet's compression. This mirrors the looks
   contract (fragment = the contract) and is what the honesty assertion checks.
5. **Per-look bans** (`dream_mediums.client_meta.banned_vibes`): e.g. `spotlight` × `nightly_technicolor`,
   `moonlit` × `nightly_kodachrome`. Empty by default; filled from the QA night.
6. **Create stays untouched** until the Create refactor: `nightly_only` rows never reach `get_dream_vibes()`;
   flipping it exposes a vibe to the picker, and its `restyle_fragment` is already authored for that day.

## 7. Decisions for Kevin after the page

- Which of the 20 stay. Target 10-14 nightly vibes across four registers so the roll has real range:
  soft (2-3), dramatic (2-3), magical (2-3), bright/fun (2-3).
- Whether the five Create-only candidates are promoted (they are already active in Create; nightly just gains
  them via `is_dream_eligible`).
- Round B go/no-go once round A shows how much accent the current route carries.

## 8. Results (rounds A-D, 2026-09-11) and the decision

Same scene, same cast (Kevin solo), same model (flux-1.1-pro), same look (digital painting); one render per vibe
per round. Cell = `accent/pretty · identity` (accent = how clearly the vibe reads, 1-5; pretty = would Kevin want
the dream, 1-5; identity = the solo swap similarity, gate 0.35, comfortable ≥ 0.60). Round D re-ran only the
vibes whose fragments were rewritten after round C.

| vibe | A · v1 today's route | B · v2 fragment after scene | C · v3 fragment early | D · v3 + rewritten fragment |
|---|---|---|---|---|
| cinematic | 1/3 · id 0.73 | 2/4 · id 0.65 | 4/4 · id 0.68 | — |
| cozy | 1/3 · id 0.71 | 4/4 · id 0.72 | 5/4 · id 0.68 | 4/4 · id 0.70 |
| epic | 2/3 · id 0.66 | 2/3 · id 0.72 | 5/2 · id 0.36 | 5/4 · id 0.50 |
| nostalgic | 3/4 · id 0.69 | 2/3 · id 0.70 | 4/5 · id 0.70 | — |
| peaceful | 1/2 · id 0.48 | 3/4 · id 0.68 | 4/4 · id 0.69 | — |
| dark | 2/4 · id 0.74 | 1/3 · id 0.67 | 5/3 · id 0.45 | 5/5 · id 0.66 |
| ethereal | 1/3 · id 0.64 | 2/3 · id 0.60 | 3/4 · id 0.62 | — |
| arcane | 4/4 · id 0.72 | 3/4 · id 0.68 | — | 5/5 · id 0.72 |
| enchanted | 1/3 · id 0.72 | 2/3 · id 0.64 | 3/4 · id 0.72 | — |
| nightshade | 3/3 · id 0.65 | 4/5 · id 0.67 | 5/5 · id 0.68 | — |
| golden_hour | 5/5 · id 0.74 | 3/4 · id 0.67 | 5/5 · id 0.71 | — |
| blue_hour | 2/4 · id 0.70 | 3/4 · id 0.70 | 5/5 · id 0.64 | — |
| moonlit | 1/3 · id 0.69 | 1/3 · id 0.74 | 1/1 · id 0.00 | 5/5 · id 0.73 |
| stormlight | 2/3 · id 0.71 | 1/3 · id 0.67 | 4/4 · id 0.64 | — |
| festive | 1/2 · id 0.71 | 4/4 · id 0.71 | 5/5 · id 0.66 | — |
| after_rain | 2/4 · id 0.76 | 2/3 · id 0.71 | 3/4 · id 0.68 | — |
| sun_drenched | 3/3 · id 0.59 | 3/4 · id 0.71 | 4/4 · id 0.69 | — |
| spotlight | 1/3 · id 0.75 | 1/3 · id 0.69 | 5/4 · id 0.61 | 4/4 · id 0.68 |
| aurora | 1/3 · id 0.71 | 1/3 · id 0.69 | 5/4 · id 0.56 | 5/4 · id 0.64 |
| prism | 1/3 · id 0.71 | 1/3 · id 0.58 | 4/3 · id 0.56 | 3/4 · id 0.57 |

**What the rounds proved**

1. **Today's route is a whisper.** Only 3 of 20 vibes changed the picture (golden_hour, arcane, nostalgic), and
   only because their directives name concrete light objects (lanterns, amber evening light). Every night vibe
   failed the same way: Sonnet wrote the night correctly into scene_description ("Victorian glasshouse at full
   moon, silver light pouring through the panes…"), and Flux rendered daylight, because that text sits ~150 words
   in, after the identity block. Bonus finding: every solo cast render carried a hidden photography prior from the
   framing block ("a relaxed warm editorial photograph … photographic realism, filmic colour"), so the painted
   look never showed on solos.
2. **A fragment placed after the scene (v2) is not enough.** Warm and lantern vibes read (cozy, festive,
   nightshade), night still cannot beat the daylight prior. The look-neutral framing line does give the painted
   look back.
3. **A fragment placed EARLY (v3, right after the place line, before the person) makes the vibe real.** 17 of
   19 rendered vibes read clearly, several at full strength (blue hour, golden hour, festive, nightshade, aurora,
   spotlight). The cost is a failure family: a fragment that names the SKY, a light "from above", or the night
   as a place pulls the camera outside the location and shrinks the face (epic 0.36, dark 0.45) or leaves it
   unreadable (moonlit: identity 0 → the legacy chain fell to a pure-scene fallback and shipped a faceless TV
   studio, `SHIPPED_FACELESS`).
4. **Rewriting those fragments to the rule fixed them (round D):** dark, moonlit, epic, spotlight, cozy, arcane
   all clean at identity 0.50-0.73. Two remain open: **aurora** ages the face under green light (grey hair twice,
   0.56 / 0.64) and **prism** is weak with a drifting face (0.56 / 0.57).

**Decision (the production mechanism)**

- `dream_vibes.flux_fragment` (mig 504/505) placed **EARLY** (`vibeFragmentPosition: 'early'`), plus
  `lookNeutralFraming: true`, plus the Sonnet brief telling the model the vibe owns the light (automatic when a
  fragment is present). The atmosphere axes (TIME / WEATHER / PHENOMENON) are BLANK on the looks path; the vibe is
  the atmosphere. Special scenes keep their authored lighting; holidays keep theirs.
- **Fragment rules** (every row, checked before it ships): ≤ 140 chars; light ON SURFACES AND ON THE SUBJECT;
  name one warm accent light near the person; never a sky / cloud / star / moon-as-object noun; never "from
  above"; never a finish or medium word (the look owns the finish); never composition words; no trap tokens.
- **A new retry rung, not a new gate:** when the base render fails the identity gate or the solo probe finds no
  face, the looks path re-renders ONCE with `vibeFragmentPosition: 'after_scene'` (v2 strength) before any
  degrade, and never falls through to the legacy pure-scene fallback. Stamps `vibe_retry:after_scene`.
- Per-look vibe bans stay available (`dream_mediums.client_meta.banned_vibes`), empty until the QA night says
  otherwise. Couples and the other two models (grok, gemini) have NOT seen the fragment yet: the QA night covers
  them.

**Recommended list (for Kevin to finalise)**

| register | keep | cut (why) |
|---|---|---|
| soft / warm | cozy (lamplight), nostalgic (sunset warmth), peaceful (pale mist) | ethereal (a softer peaceful; 3/4 at best), enchanted (a paler arcane) |
| dramatic | cinematic (misty teal, the "moody" one), epic (sun rays; watch identity), dark, stormlight, spotlight | |
| magical / night | arcane, nightshade, moonlit, blue_hour, aurora (after a face-safe rewrite) | prism (weak accent, face drift twice) |
| bright / fun | golden_hour, festive, sun_drenched, after_rain | |

17 in, 3 out. With recency 7 that is a different mood almost every night for two and a half weeks. The five
incumbents all stay but only because the mechanism changed under them; on today's route four of them were
invisible. `is_dream_eligible` flips for the kept new + Create-only rows once Kevin signs off; the cut rows stay
in the table (nightly_only, not eligible) so nothing is lost.

## 9. Kevin's decisions (2026-09-11, evening) and the versions model

**"I liked every single version of the vibes … can we save all versions of each as a different vibe?"** Done
(mig 506). The recommended-list table in §8 is superseded: nothing is cut. Each version of a vibe is its own
`dream_vibes` row, grouped by `version_of` into a FAMILY, exactly as rendered:

| version | key suffix | accent route | matrix round |
|---|---|---|---|
| subtle | `__subtle` | no fragment; the directive reaches Flux only through Sonnet's mood words (today's route) | A |
| soft | `__soft` | the original (mig 504) fragment placed AFTER scene_description | B |
| bold | `__bold` | the current fragment placed EARLY (the mig 505 rewrite where one exists) | C / D |
| wild | `__wild` | the ORIGINAL sky-naming fragment placed EARLY, for the 6 rewritten vibes (the camera roams) | C |

66 version rows (20 subtle + 20 soft + 20 bold + 6 wild; moonlit's wild card shipped faceless and is omitted).
The 20 base rows stay canonical / Create-facing and are NOT in the pool (their `__bold` twin is).

**Gating, three independent flags:** `is_dream_eligible` = the LEGACY nightly roll (still only the 5 incumbents'
base rows; production tonight is unchanged); `nightly_pool` = the LOOKS-PATH roll (the 66 version rows);
`nightly_only` = hidden from `get_dream_vibes()` (every version row; the Create picker still lists 22).

**The roll (`_shared/nightlyVibes.ts`, wired into `buildStyleContract().vibe`):** family-first like looks:
pick a family the user has not had in the recency window (any version counts as the family), then a version
within it uniformly. Never-empty floor. Stamps `vibe:<key>`, `vibe_family:<base>`, `vibe_version:<tag>`,
`vibe_source:roll|force`, `vibe_pool:<rows>/<families>`. `force_vibe` reaches any active row, pool or not. The
contract exposes `vibe.fragment` + `vibe.position` for the slot input (`vibeFragment`, `vibeFragmentPosition`);
a subtle version sends no fragment, which reproduces round A byte-for-byte.

**"Did we really test all the vibes in the app?"** No. The 20 candidates left 12 ACTIVE Create vibes untested on
my judgment alone (coquette, kawaii, high_fantasy, whimsical, surreal, fierce, voltage, ancient, macabre,
shimmer, minimal, psychedelic). Kevin is right that the vibes work in Create: `promptCompiler.ts` and the
single/dual brief builders hand Sonnet the FULL directive and Sonnet writes the whole prompt. The loss is
specific to nightly's slot pipeline (`characterSlotPrompt.ts`), which asks Sonnet for "1-3 short mood phrases"
and places them at the tail. Correction in flight: mig 507 gives the 12 fragments; rounds e (subtle) / f (bold)
/ g (soft) render them through the same matrix; page `~/Desktop/nightly-vibes-compare-app.html`.

**"Any vibes we have a missing gap on?"** The 32 were heavy on warm and magical, thin on weather, season, pure
light effects and palettes. Mig 508 adds 19 families and revives the 5 inactive rows for the matrix (rounds
h / i / j, same page family):

| gap | new vibes |
|---|---|
| weather | snowfall, fog, rainfall, overcast |
| time of day | sunrise, starlit |
| pure light effects | candlelit, godrays, caustics, stained_glass, noir |
| season | autumnal, blossom |
| palette / world | bioluminescent, synthwave, cotton_candy, opulent |
| event | fireworks, carnival |
| revived (were inactive) | dreamy, chaos, majestic, ominous, aura |

All 24 are `nightly_only`, not eligible, not in the pool until their renders are in and their versions are
added (the mig 506 pattern; any version that ships faceless is omitted, nothing else is).
