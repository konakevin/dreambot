# Create outfits: per-person colour + honoring what the user asks for

Status: PLAN, decisions in (2026-09-23). Nothing built. Create solo + couples; nightly port later.

Kevin: "can we make each person wear only their own colour, or even mismatched colors and patterns/fabrics
... we can have matchy like that, i like it, but can we also have the post by koi?" and "if the user
specifies their outfits we need to honor their outfit but add in the color and print ... 'show me in a
bikini' we apply our coloring/patterns ... 'show me in a red bikini' we show them in a red bikini."

## What is true today (measured + traced)

Live flags: `create_prompt_scene_split`, `create_activity_wardrobe` on; couples compose via narrative_fg.

1. **The palette is couples-only.** Only a Create COUPLE on a natural medium reaches `buildSlotBrief`
   (`generate-dream/index.ts:1478,1557-1669`). Solo Create uses `buildSingleBrief` (freeform Sonnet, no
   palette, no validator). Dream Art / DLT-solo / reimagine never see a palette.
2. **Why couples look matchy.** One 2-colour palette per couple and ONE cut for both
   (`characterSlotPrompt.ts:870-871,916`). Sonnet is told to "SPLIT it between them", but in 24 of 39
   recent couples (62%) BOTH people wore BOTH colours: the mirrored jacket/trousers swap (michele's
   Niagara renders). Only 8/39 split cleanly. Palettes deliberately name no material, so nothing carries a
   print or pattern; every outfit is two solid colour blocks. Koi's saved post (2026-07-15, before the
   palette existed on 09-21) is the target "independent" look: pink blouse + gingham belt vs a tropical
   print shirt + sage trousers.
3. **User outfits are honored only by luck.**
   - No code detects that the prompt names clothing. The words reach Sonnet only inside the
     `LOCATION:` line (the whole cleaned prompt, `characterSlotPrompt.ts:867,932`), right next to a
     rolled palette that tells it to use other colours.
   - Kevin's "she is wearing a pink bikini and I'm wearing green shorts with flowers" (5 renders): pink
     kept 4/5 (one came back "porcelain white" from the palette), green shorts kept 2/5 (turquoise,
     jet black x2). **6 of 10 user colours survived.**
   - The splitter drops clothing (setting = "never people"), so with narrative_fg the user's clothing
     reaches Flux ONLY through Sonnet's wardrobe fields.
4. **Who wears what is erased.** `cleanSelfReferences` turns me/I into "a person", names and "my wife"
   into "a companion", and deletes "show me" entirely ("Show me and Steph in bikinis" becomes "a companion
   in bikinis"). The slot brief labels people LEFT/RIGHT by gender only, and sides are flipped 50% by
   code (`dualSideOrder.ts`). Also: "I’m" (curly apostrophe) becomes "a person’m".
5. **Latent override bug.** `PLAIN_CLOTHES` (`characterSlotPrompt.ts:1230`) bans jeans, t-shirt,
   hoodie, sweater, chinos, casual, etc. in wardrobe fields, and the brief itself says "NEVER everyday
   basics". A couple asking for "jeans and tees" would be retried twice, then salvaged to the generic
   "striking tailored statement outfit" for BOTH. Not yet hit by a real user (30 days: 7 plain-clothes
   violations, all Sonnet's own choice, all fixed on retry), but it is a guaranteed override when it is.
   The traveler rule similarly bans kimono/sari/etc. even when the user asks (brief-only, no validator).
6. **Real prompt corpus** (all Create in the queue, 420 prompts, 10 users): 16% describe clothing.
   Shapes seen, which the design must handle:
   - explicit colour: "pink bikini", "green shorts with flowers", "pink chanel"
   - garment, no colour: "regency gown", "sleek space suits", "lingerie", "fancy hats"
   - colour IMPLIED by the garment: "Detroit Lions jersey", "Lions cheerleading outfit", "pink chanel",
     "Victorian suffragettes", "Edwardian clothes like Anne of Green Gables", "80's clothes"
   - style, no garment: "dressed up to the nines", "sexy outfit"
   - shared by both: "us wearing Edwardian clothes", "me and Stephie in space suits"
   - per person: "She is wearing X and I'm wearing Y"

## Kevin's decisions (2026-09-23)

1. 50/50 coordinated vs independent colour.
2. "We can always mix and match" (confirmed): colour, cut and pattern roll INDEPENDENTLY per couple.
   Kevin's guard: "if it's two women in a formal scene and one gets a dress and the other a jacket,
   that's weird". So the SCENE sets the garment TYPE and dress level for both people (gala = two gowns,
   or a gown and a tux; beach = swimwear or resort wear); the cut coin only changes the SILHOUETTE within
   that type (a sleek fitted gown vs a soft flowy gown). The user's own request still wins ("me in a tux
   and Steph in a gown").
3. User asks for traditional dress ("me in a kimono in Kyoto") → honor it. The traveler rule stays for
   outfits WE choose.
4. User-coloured item in a patterned roll → keep their colour, add our pattern as TRIM.
5. Solo AND couples in the same build. Test as we go.

## Design

### A. The rolls (per render, all authored pools, all dashboard-tunable)

| Axis                  | Values                                                                                                                                                                 | Start                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Colour mode (couples) | coordinated (one palette, CODE gives colour 1 to one person, colour 2 to the other, never swapped) / independent (each person their own palette, different hue family) | 50/50 (`create_outfit_independent_pct`)      |
| Cut mode (couples)    | shared silhouette / a different silhouette each, WITHIN the garment type the scene sets (never a gown next to a jacket)                                                | 50/50 (`create_outfit_separate_cut_pct`)     |
| Pattern (per person)  | one of ~12 authored patterns, or solid                                                                                                                                 | 50% solid (`create_outfit_pattern_pct` = 50) |

Resulting couple mix at the start values: 12.5% are michele's pure look (coordinated, shared cut, both
solid), 12.5% are koi's full look (independent, separate cuts, both patterned), the rest are blends.
Solo: one palette colour + cut + the same pattern roll.

- `WARDROBE_PALETTES` becomes structured pairs `{a, b, family}` so code splits the colours (the root of
  the mirror). Tonal entries become light/deep pairs; neutral entries stay deliberately monochrome.
- New `WARDROBE_PATTERNS`: tropical print, gingham, floral, pinstripe, bold stripe, check, polka dot,
  geometric print, colour-block, paisley, houndstooth, animal print. Each phrased with its own escape
  hatch ("as a print where the garment can carry one, otherwise as a trim"), so a wetsuit or chef's whites
  never get a literal floral. Locked by tests: no PLAIN_CLOTHES word, no occlusion word, no garment noun.

### B. Outfit extraction (new `_shared/outfitSpec.ts`)

- Prefilter: a broad clothing regex on the sanitized RAW prompt. No hit → no call → rolls only.
- One `callSonnet` (Haiku fallback). Couples: in PARALLEL with `splitPromptScene`
  (`generate-dream/index.ts:1569`), so no added wait. Solo: one extra call, only on the ~16% of prompts
  that mention clothing.
- Input: the sanitized raw prompt (never `cleanedPrompt`, which has lost who is who) plus a legend built
  by code from `detectSelfInsert` + the resolved cast: "PERSON A = the user (me, I, my, myself; a woman).
  PERSON B = Steph (also: my wife; a woman)."
- Output: labelled lines (house style, sanitizer-safe), no JSON:
  `A_GARMENT / A_COLOUR / A_PATTERN / B_GARMENT / B_COLOUR / B_PATTERN / UNASSIGNED`. Values are the
  user's own words or NONE; COLOUR may be `IMPLIED` (team, brand, character, uniform, era). "us / we /
  both" → the same spec on A and B. A phrase the model cannot attribute → `UNASSIGNED` (stays as context,
  never locked to the wrong person).
- Fail-open: any failure → no spec → rolls only. Stamp `outfit_spec:<none|partial|full|fallback>`.

### C. `planOutfits` (pure, rng-injected): rolls + user spec → one plan per person

| User said                                                                          | Garment                    | Colour                                 | Pattern                |
| ---------------------------------------------------------------------------------- | -------------------------- | -------------------------------------- | ---------------------- |
| nothing                                                                            | Sonnet (fits the activity) | our roll                               | our roll               |
| "bikini", "regency gown", "space suits"                                            | **theirs**                 | our roll                               | our roll               |
| "red bikini"                                                                       | **theirs**                 | **theirs**                             | our roll, as TRIM only |
| "floral shorts"                                                                    | **theirs**                 | our roll                               | **theirs**             |
| IMPLIED ("Lions jersey", "Chanel suit", "suffragette whites", "Starfleet uniform") | **theirs**                 | the garment's own                      | none                   |
| style only ("dressed to the nines", "80s clothes")                                 | Sonnet, in that style      | our roll                               | our roll               |
| shared ("us in space suits")                                                       | theirs, both               | our roll, per colour mode              | our roll               |
| shared + colour ("both in pink chanel")                                            | theirs, both               | **theirs, both** (they chose to match) | none                   |

Face occluders (sunglasses, helmet, mask, hood over face) are dropped even when asked (the swap needs the
face); the rest of the outfit is honored. Stamp `outfit_occluder_dropped`.

### D. Couples: brief + enforcement (`buildSlotBrief`, behind `input.outfitPlan`)

- Role → side mapped AFTER the 50% flip (`generate-dream/index.ts:1427`), keyed by role like
  `rollHolidayCostumes` does.
- The wardrobe section prints each side's plan explicitly and drops the "SPLIT it between them"
  sentence. It also replaces today's "pick a different GARMENT for each of them" (written for snow gear;
  in a formal scene it invites a gown next to a jacket) with: "the scene sets the garment type and the
  dress level for BOTH of them; vary colour, silhouette and pattern within it".
  Example: "LEFT (the woman): the user asked for 'a red bikini': keep those words. Add a gingham
  trim. RIGHT (the man): lead colour petrol blue, never the partner's colour; cut: ...; pattern: tropical
  print."
- Traveler rule and "NEVER everyday basics" are suppressed for a side whose garment the user chose.
- `validateSlots` / `describeViolations` / `salvageSlots` take a per-side allowlist: the user's own
  words are exempt from PLAIN_CLOTHES (fixes the jeans/tee override).
- New lock check in the retry loop (`characterSlotPrompt.ts:1920-1954`): each side's wardrobe must contain
  its locked garment noun and colour words. A miss is a named violation ("LEFT dropped 'red'") and gets
  the existing retry. Still missing after 2 attempts → that side's wardrobe becomes the user's phrase plus
  the planned trim clause, by code (a per-side lock, never `applyCostumeLock`'s `lock[1] ?? lock[0]`).
- Stamps: `outfit_colour:<coordinated|independent>`, `outfit_cut:<shared|separate>`,
  `outfit_pattern:<left>|<right>`, `outfit_lock:<side>:<kept|retried|code_applied>`.

### E. Solo (`buildSingleBrief`, behind the same flags)

- An `OUTFIT` block after the SACRED user prompt: garment (theirs or open), colour, cut, pattern/trim.
- Solo has no wardrobe field and no retry loop (Sonnet writes the whole prompt,
  `generate-dream/index.ts:1723-1732`), so the check runs on the FINAL prompt: locked garment + colour
  words present, else append "wearing <user phrase>" through `postProcessPrompt`. Stamp as above.
- Dream Art (embodied) and photo modes are out of scope for this build.

### F. Config (all default OFF; rollback = off, no deploy)

`create_outfit_rolls` (bool: pools + planOutfits for couples and solo), `create_outfit_user_lock` (bool:
extraction + locks), `create_outfit_independent_pct` (50), `create_outfit_separate_cut_pct` (50),
`create_outfit_pattern_pct` (50). Plumbing copies `create_activity_wardrobe` (mig 542 →
`engineConfig.ts:184,278,444` → `castCfg` → slot/compiler input), plus a `createEngineWiring.test.ts` guard.
QA before the flip: an admin-only request override so only Kevin's renders use it (confirm the existing
admin check at build time).

## Build order (test gate after every phase)

| Phase | Build                                                                                                                                                                                                          | Gate before moving on                                                                                                                                                                                                                 |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Text-only harness `scripts/qa-outfit-text.ts` (Deno, imports `_shared` directly, calls Sonnet, NO renders, NO DB). Corpus: the 29 real clothing prompts + ~20 synthetic hard cases. Baseline today's pipeline. | Baseline numbers recorded (expect ~60% user colour kept, 62% mirrored)                                                                                                                                                                |
| 1     | Structured palettes, patterns pool, `planOutfits`                                                                                                                                                              | Unit tests: every override-table row, both colour modes, cut modes, flip mapping, pool locks, hue balance                                                                                                                             |
| 2     | `outfitSpec.ts` extraction + parser                                                                                                                                                                            | Parser unit tests (mocked Sonnet), then the harness on the corpus: attribution correct on every per-person prompt, IMPLIED on the jersey / Chanel / uniform prompts and NOT on "regency gown", no false spec on clothing-free prompts |
| 3     | Couple brief + allowlist + lock check + code-applied fallback                                                                                                                                                  | Unit tests; `slot-golden.json` and all existing wardrobe tests byte-identical with flags off; harness: user garment + colour kept 100%, coordinated never cross-swaps, independent shares no lead colour, jeans/tees honored          |
| 4     | Solo OUTFIT block + final-prompt check                                                                                                                                                                         | Unit tests; harness on solo prompts: same 100% bars                                                                                                                                                                                   |
| 5     | Migration (flags off), `engineConfig` plumbing, generate-dream wiring, admin override; deploy (inert)                                                                                                          | `npm run check` green; CI db-tests green; a Create render with flags off shows no new stamps                                                                                                                                          |
| 6     | Renders into Kevin's private Dreams album with the override: ~12 couples + ~8 solos across the hard cases. Concurrency ≤3, `waitForHeadroom`                                                                   | Kevin's eye; dual-swap hold rate unchanged (`fallback_reasons`: `no_dual_split`, `dual_degrade_single`); wardrobe-side read not worse                                                                                                 |
| 7     | Flip the flags on                                                                                                                                                                                              | 24h of stamps: lock `code_applied` rate, extraction fallback rate, latency                                                                                                                                                            |

## Safety: this never touches the live Create engine until a flip

Kevin: "this work can't interrupt the current create engine". It doesn't, by construction:

- Every new behaviour is behind engine_config switches that default OFF. With them off, the brief, the
  slots and the final prompt are byte-identical to today, locked by the existing golden fixture
  (`__tests__/fixtures/slot-golden.json`) and every existing wardrobe test.
- The text harness never renders and never touches the database: it imports the engine code and
  calls Sonnet directly.
- Deploys ship the code inert. Renders for review use an admin-only override (Kevin's account only).
- Going live = flipping the switches on the dashboard. Rollback = flipping them off: instant, no deploy.

## Phase 0 baseline (2026-09-23, today's pipeline, text only)

Harness: `scripts/qa-outfit-text.ts` (Deno; imports the real `_shared` modules; Sonnet calls only, no
renders, no DB). 34 prompts (14 real + 20 authored) x 3 runs = 102 renders, 0 errors. Synthetic cast
(fixed descriptions), a fixed photographic medium and vibe, no scene expansion on solo, so absolute
numbers run kinder than production (one real prompt measured 6/10 colours kept in production).

| Measure                                                   | Baseline     | Target               |
| --------------------------------------------------------- | ------------ | -------------------- |
| User garment kept                                         | 92/105 (88%) | 100%                 |
| User colour kept                                          | 53/60 (88%)  | 100%                 |
| User pattern kept                                         | 12/12        | 100%                 |
| Palette mirrored, couples with no clothing in the prompt  | 5/13 (38%)   | 0% in coordinated    |
| Dress next to a suit/jumpsuit, same-gender formal couples | 2/9 (22%)    | 0%                   |
| Plain-clothes violations / wardrobe fallbacks             | 5 / 3        | honored, no fallback |

Where it fails, verified by reading the outfits:

- **The palette overrides the user's colour.** "Matching red sweaters": red lost in all 3 (plum, magenta,
  moss). "Lakers jerseys": a magenta-and-pine Lakers jersey, an ochre bomber. "Emerald gowns": one
  magenta. "Yellow sundress": one teal. "Pink chanel": navy and crimson Chanel.
- **Garments get dropped when the palette/cut takes over.** "Fancy hats" at the Derby: hats gone in 2 of 3.
- **Plain clothes are rewritten.** "Jeans and t-shirts": t-shirts in 0 of 3, jeans became culottes once.
- **Dress next to suit** in a formal same-gender scene: a gown next to a blazer suit; a jumpsuit next to a
  ballgown.
- **Solo has no colour at all:** "me in a bikini" → "a vibrant bikini" (3/3). Nothing to rotate.
- **Solo keeps face occluders:** "sunglasses" reached the final prompt in 6 of 6 solo renders ("perched on
  her nose"), a face-swap risk couples already block by validator. The plan's occluder drop covers solo.
- **Validator false positive (new, out of scope):** "whale watching" trips the face-direction rule
  (`watching-staring`), so the scene was replaced by the generic fallback in 3 of 3. Same for "bird
  watching"; "stargazing" likely trips `gazing`. Not seen in production in 30 days, but it will be.
- Kept fine: kimono (solo has no traveler rule), space suits, regency gowns, Lions colours on solo, the
  per-person "pink bikini / green floral shorts" prompt.

## Phase 1 done (2026-09-23): pools + planOutfits

- `supabase/functions/_shared/outfitPlan.ts` (new, imported by nothing yet, so inert):
  `PAIRED_PALETTES` (27 structured pairs, 10 colour families, max 9 of 54 colours in any family, 3
  neutrals), `OUTFIT_SILHOUETTES` (10, silhouette only, no hoods or utility hardware),
  `WARDROBE_PATTERNS` (12, no colour words), `colourFamiliesOf`, `planOutfits`.
- `__tests__/lib/outfitPlan.test.ts`: 32 tests. Pool locks (no garment / material / occluder /
  plain-clothes word, family balance, lexicon agrees with the pool), coordinated never mirrors,
  independent never shares a family, shared vs separate silhouettes, pattern 0/100%, the three rolls land
  at 50% each and all 16 combinations occur, solo, clamping, and every row of the user-wins table
  (bikini, red bikini + trim, floral shorts, implied jersey, shared space suits, both in pink, per-person,
  a two-colour request claiming both families).
- Full gate green: 213 suites / 4,167 tests, tsc, deno check.
- Note for phase 3: a rolled silhouette on a USER garment can read oddly ("full and flared" on a bikini),
  so the brief phrases it "as far as the garment allows".

## Porting to nightly later

`planOutfits`, the pools and the brief wiring live in `_shared`; nightly would pass the same flag with
its own `engine_config` pct. It must skip on holiday `costumeLock`, change only colour/pattern (not the
style register), and keep the traveler rule. Nightly has no user prompt, so only section B applies.
Gate: opt-in QA flag first, measure the swap hold rate, then flip (restore-point rule).

## Also found (not in scope, flagged)

- The brief says "the hero and heroine" for every couple, including two women.
- "I’m" (curly apostrophe) cleans to "a person’m".
- DLT couples lose the style reference (the slot input never gets `style_prompt`).
- `promptSceneSplit` has no timeout; a 529 storm can spend ~44s per model on retries.
- `wardrobeRegister.test.ts` asserts the couple "SPLIT it between them" wording on a single-cast brief.
