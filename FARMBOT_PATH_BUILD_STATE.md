# FarmBot — path build tracker

**STATUS (2026-09-08): all 22 roster paths + the bonus prototype are built,
QA-signed-off, and SCALED to 120 each** (append-mode, format-drift +
hard-rule scan complete — see below). FarmBot remains fully private
(`is_public=false`, no `bot_schedules` row) throughout, now posting
NORMALLY (see privacy-mechanism fix below) so every render shows up
directly in the app for the supreme admin.

## Scale-up 25→120 (2026-09-08)
All 22 gen-seed scripts flipped to `total: 120, append: true` and re-run
(pool text-generation only — no DB/render load, so no headroom gating
needed). All 22 pools landed at 120 except `farmbot_hero_animal_action.json`
(119 — hit the generator's max-iteration safety cap one entry short of
ceiling, not worth chasing). Full-pool verification scan (word-count
sanity, exact-dup check, signage/human-language re-check on the ENTIRE 120,
not just the original 25) found ONE REAL DEFECT, now fixed:

**`cozy-farm-scene` pool had genuine "hand-painted sign" content baked into
5 of its original 25 entries** (20% — present since before I'd developed
the "never invite literal signage" discipline; its own meta-prompt's
STRICT BANS section literally said "NO readable text beyond a vague
'hand-painted sign'" — an explicit carve-out, not an oversight I'd already
fixed elsewhere) — scaling to 120 proportionally amplified it to 18/120.
Root-cause fixed at the recipe level (removed the carve-out, matched every
other path's "no signage of any kind" ban) and the WHOLE POOL regenerated
clean from scratch (`append: false` this one time) — verified 0/120 sign
hits, 0/120 human-language hits post-fix. Every other pool was clean at
both 25 and 120 (two harmless "signs of life"/"signal the day's end" idiom
false-positives caught and confirmed benign, not real signage).

## Privacy mechanism — CORRECTED to match AlphaBot exactly (2026-09-08)
Originally built using the per-post `shadow=true` dark-launch flag (migration
376) — WRONG mechanism, that's for staging a new path in isolation on an
otherwise-PUBLIC bot (ChibiBot/YumBot), and it means the post's OWN
`is_public/is_posted` are false, so it never appears in a bot's live Bots-tab
feed — only via `useShadowPosts` on the actual profile screen, an extra tap.
Kevin: "I want it to work like alphabot" — AlphaBot posts completely
NORMALLY (`is_public=true, is_posted=true, shadow=false`); privacy is
ENTIRELY account-level (`users.is_public=false` + the migration-116 uploads
RLS, which requires the viewer to FOLLOW a private account to see its
otherwise-normal posts — the supreme admin is the only follower). Fixed:
- `scripts/bots/farmbot/index.js` — all 23 paths moved from `shadowPaths`
  into the normal `paths` array (safe: the dispatcher is `bot_schedules`-row
  driven, not `paths`-driven, and FarmBot has no schedule row).
- All 101 pre-existing uploads retroactively flipped
  (`is_public=true, is_posted=true, shadow=false`).
- Verified end-to-end: a fresh `--post` render now writes normal flags (no
  "SHADOW render" log line); Kevin's RLS-scoped session sees all 102 posts
  directly; anon sees 0.
- Added a generic "View Profile" affordance to the Bots tab (migration 477 —
  `get_bot_users()` now also returns `is_public`) for any PRIVATE bot whose
  live feed IS empty (a defensive fallback, e.g. a brand-new bot with zero
  posts yet) — harmless and inert for FarmBot/AlphaBot now that both have
  real posts, since `ListEmptyComponent` only renders when the feed is
  actually empty.

FarmBot = cozy hybrid of Hay Day (farm-sim subject matter) + cozy "iyashikei" slice-of-life
anime, rendered through a 40-entry multi-media look register (chibi 3D-CGI / kawaii
illustration / anime — deliberately spans 3 media families, approved departure from every
other Medium Looks bot, see shared-blocks.js header). **SECRET BOT** — `is_public=false`,
visible only to the supreme admin, no `bot_schedules` row, never developed under AlphaBot.
Render via `node scripts/iter-bot.js --bot farmbot --mode <path> --count N --post`.

Every path shares: the look register + `FARMBOT_COZY_NEUTRAL` (tone lock + composition-
neutral cast rule) + positive-only phrasing (see "negation leak" lesson below).

## Process per path (Kevin-approved, 2026-09-07)
1. Gen MVP-25 seed pool (`scripts/gen-seeds/farmbot/gen-<path>-pool.js`).
2. Render 3, grade critically against the tone bar — not a strict decimal score.
3. Diagnose any real defect AT THE SOURCE (read actual DB prompt / seed entry), never guess.
4. Fix one variable at a time, re-render 3. Cap 3 rounds, stop earlier the moment it's good.
5. Sign off → later, scale 25→120 via append-mode + format-drift scan (batched separately,
   not done per-path immediately — Kevin: "keep building... get all pools to 25 and QA'd
   past the rounds and ready to scale").
6. Cross-path content bleed (e.g. an incidental animal in a place/mood path) is NOT a defect
   — judge against the overarching cute/cozy/wholesome tone bar first (Kevin 2026-09-07:
   "it's a farm sub, it's ok to have a few of them with animal spillover").

## HARD LESSON — negation leak (root-caused 2026-09-07, migration 475)
`FARMBOT_COZY_NEUTRAL` is concatenated straight into the FINAL FLUX PROMPT, bypassing
Sonnet entirely — no filter step. Any "no X" phrasing that names a concrete noun (figure,
window, doorway, animal, sign, scary, photoreal) puts that literal token in front of Flux,
which doesn't process negation and renders it anyway (same mechanism as
`feedback_negative_prompt_leak` memory, EarthBot 2026-05-22). This explained most of
morning-routine's multi-round saga. Fix: every path template + the bot-wide medium fragment
must be POSITIVE-ONLY — describe what IS there ("the scene is the complete cast list,
nothing beyond it"), never name what to avoid. The universal `promptSuffixByMedium`
("no text, no watermark, no signature...") is the one proven-safe exception — it's used
verbatim fleet-wide; don't duplicate it inside a path's own Sonnet-facing brief.

## Design decisions (Kevin, 2026-09-07, before building the remaining 19)
- **Humans**: written into the seed pool as a deliberate feature on paths where it's
  natural — market-town-square (shoppers/townsfolk), farm-fair-festival (attendees),
  deliveries (a delivery person). All other paths stay animal/place-only unless a specific
  scene calls for one.
- **herd-group-scene vs. farmyard-together**: herd = 2-4 animals of the SAME/similar
  species that would naturally flock together (a small group of sheep, a gaggle of geese).
  farmyard-together = deliberately MIXED species coexisting naturally in one wide shot (a
  goat near chickens near a barn cat) — this is the path that fulfills "intermingle
  naturally, don't strictly segregate species."
- **Blended Places (farmhouse-garden, crop-fields)**: mix separate entries across the 25 —
  some Western-style (clapboard farmhouse / grain-and-vegetable rows), some Japan-rural
  (kominka with engawa / rice paddies) — variety across the pool, each entry internally
  coherent, not fused within a single entry.

## Model notes (2026-09-07)
- FarmBot re-enables gpt-image-2 + Gemini (Nano Banana) via `modelBanExemptions`
  (fleet ban default, same opt-back-in mechanism as ChibiBot/YumBot).
- Head-to-head on farm-stand: Flux had a real, replicated signage-hallucination
  tendency on shop/stand imagery (2/6 renders — garbled shop-name text once, a
  blank sign board once) despite a verified-clean Sonnet-written prompt each
  time. GPT-Image-2 avoided signage (3/3) but drifted photoreal off the
  requested look-register style on 2/3. Gemini went 3/3 clean AND correctly
  rendered each requested style. Kevin's call: lock only the specific
  signage-prone paths to Gemini via `bot.modelByPath`, don't fleet-wide
  reweight — add a path to `modelByPath` the moment its own QA shows the same
  tendency.
- Now locked to Gemini (all confirmed via head-to-head, same protocol):
  farm-stand, farmhouse-garden, market-town-square, countryside-train.
  farmhouse-garden and countryside-train both surfaced a SPECIFIC, notable
  Flux quirk beyond generic signage — Flux literally rendered the word
  "flux" as branded text (once on a plant label, once as bold "FLUX" on a
  vending machine sign) — a self-reference/watermark artifact, not random
  gibberish. Watch for this specifically on any path with a retail/product-
  display/vending-machine-coded element (farm-fair-festival, deliveries are
  the remaining candidates to watch).
- `iter-bot.js --model` fix (2026-09-07): the model-forcing loop iterated
  `bot.paths`, which is empty for a secret bot (paths only reachable via
  `--mode`) — the override silently applied to nothing. Fixed to also force
  the specific `--mode` path when one is given.

## Known cross-path failure mode — occasional "generic tableau" total miss
Observed on farm-stand R1 (a chaotic farmyard, zero stand) and duck-pond R1 (a
farmer + sheep + pig + chickens scene, zero pond/water, uncontrolled human
figure) — roughly 1-in-3 in both rounds. Direct-API testing (10+ samples
across both paths, exact same buildBrief() output) reproduced ZERO instances
— Sonnet's own text output stayed correctly on-scene every time. This means
it is NOT a fixable prompt/template bug (confirmed twice) — it's genuine
stochastic variance somewhere in the production path (possibly Sonnet's own
non-determinism at low sample rates, possibly something in
callModelWithRetry not replicated by a direct fetch call — not yet isolated).
Per Kevin's steer against over-grinding RNG noise: don't spend a QA round
re-templating a path over this — note it, sign off on the strength of the
majority-clean samples, and only escalate to a systemic investigation if the
rate climbs materially higher than ~1-in-3 across several more paths.

UPDATE — ROOT CAUSE NARROWED (2026-09-07): confirmed on farmhouse-garden and
crop-fields too (4 instances, holding ~1-in-3, always a "whimsical generic
village/farmyard tableau ignoring the actual scene," twice with an
uncontrolled human slipping in). Initial direct-API tests used the WRONG
model (`claude-sonnet-4-5-20250929` — production actually uses
`claude-sonnet-4-6`, scripts/lib/models.js:11) — re-tested with the correct
model, 8/8 still on-scene. So this is CONFIRMED NOT a Sonnet text-writing
bug across two model versions. It has also now occurred on both Flux
(farm-stand, crop-fields) AND Gemini (duck-pond) renders — not model-specific
either. This points to genuine IMAGE-GENERATION-level compositional drift on
long, richly-detailed prompts (attention drifting toward the dominant
"cozy farm bot" style/identity framing over the specific, less-repeated
scene details) — a known class of diffusion/multimodal failure, not a
template bug. Treating as accepted stochastic variance per Kevin's steer;
not worth further per-path chasing.

UPDATE — evening-chores R1: same pattern manifested as an uncontrolled HUMAN
figure (a ceramic-figurine child petting a horse at a gate) on a path never
designed for humans. Unlike animal spillover (Kevin: explicitly fine), an
uncontrolled human is a stricter violation — the whole point of the
"controlled, not incidental" human design decision. Still tying this to the
same root cause (image-gen ignoring specific scene content and free-
associating a generic farm tableau, which apparently can include a person
when nothing anchors the scene against it) rather than treating it as a
new, separate bug. Watching whether this recurs at a rate that would
justify designing an explicit anti-human anchor for non-human paths.

## Roster (22 paths + 1 bonus prototype)

### Places — scene-led, the location is the hero, animals optional
| # | Path key | Status |
|---|---|---|
| 1 | farm-stand | **DONE** — signed off R3 (locked to Gemini, see model note below) |
| 2 | red-barn | **DONE** — signed off R2 |
| 3 | farmhouse-garden *(blended clapboard ↔ kominka engawa)* | **DONE** — signed off R2 (locked to Gemini; Flux R1 hallucinated "flux" text on a planter + a watermark strip) |
| 4 | windmill-silo | **DONE** — signed off R1 (2/3 excellent, 1/3 tonally stark not cozy — natural variance) |
| 5 | duck-pond | **DONE** — signed off R1 (2/3 excellent, 1/3 total-miss — see cross-path note) |
| 6 | orchard | **DONE** — signed off R1 (3/3 clean) |
| 7 | crop-fields *(blended grain/veg rows ↔ rice paddies)* | **DONE** — signed off R1 (2/3 stunning, 1/3 total-miss — 4th instance of the cross-path pattern) |
| 8 | decorative-garden-fences | **DONE** — signed off R1 (3/3 flawless) |
| 9 | chicken-coop | **DONE** — signed off R1 (2/3 flawless, 1/3 minor blurry plaque — mild) |
| 10 | market-town-square | **DONE** — signed off R1 (locked to Gemini; Flux render had a chalkboard sign + substituted goats for the required people) |
| 11 | countryside-train *(new — Japan-rural gap fix)* | **DONE** — signed off R2 (locked to Gemini; Flux literally rendered "FLUX" as branded text on a vending machine) |

### Moments — activity/mood-led
| # | Path key | Status |
|---|---|---|
| 12 | harvest-time | **DONE** — signed off R1 (3/3 flawless) |
| 13 | deliveries | **DONE** — signed off R1 (2/3 excellent w/ driver present; 1/3 gorgeous but skipped the human + minor "180" car number) |
| 14 | feeding-time | **DONE** — signed off R1 (3/3 flawless) |
| 15 | laundry-day | **DONE** — signed off R1 (3/3 clean) |
| 16 | quiet-rainy-day | **DONE** — signed off R1 (2/3 good, 1/3 total-miss — cross-path pattern) |
| 17 | morning-routine | **DONE** — signed off R5 (negation-leak fix was the real bug) |
| 18 | evening-chores | **DONE** — signed off R1 (2/3 flawless; 1/3 gorgeous but an uncontrolled human child appeared — generic-tableau pattern, see note) |
| 19 | farm-fair-festival | **DONE** — signed off R1 (2/3 flawless w/ humans present; 1/3 gorgeous but substituted animals for the required humans) |

### Creatures — animal-composition-led, species rolled from shared pool
| # | Path key | Status |
|---|---|---|
| 20 | hero-animal-spotlight | **DONE** — signed off R1 (clean first try) |
| 21 | herd-group-scene | **DONE** — signed off R1 (3/3 flawless, one of the strongest paths yet) |
| 22 | farmyard-together | **DONE** — signed off R1 (3/3 flawless) |

### Bonus (pre-roster prototype, still wired)
- `cozy-farm-scene` — original blended pool, live since before the roster was finalized.

## Look register — CURATED by Kevin's hearts (2026-09-08), 42 → 35
Kevin reviewed renders across all 42 original looks (posted to FarmBot's now-
normal, non-shadow feed — see privacy fix above) and hearted the ones to
keep. Attribution method: each render's stored `ai_prompt` was matched back
to its source look via rarity-weighted (IDF) word overlap against the 42
original texts — Sonnet's rewrite doesn't always preserve the look's literal
name, so a small number of renders (13/105) couldn't be confidently
attributed and were excluded from the count either way (not used as
evidence for keep OR drop). Two passes: 31 hearts → 22-keep list, then a
second broader pass after more hearts → 64 hearts → 34-keep list (a strict
superset of the first 22) + Classic golden-age Disney 2D added explicitly
per Kevin's direct approval of its 3 test renders (its own algorithmic
match was inconclusive — trust the explicit human call over the heuristic
here) = **35 final looks**. 7 dropped (zero hearts across all their
renders): Modern Disney CG fairytale, Risograph print kawaii, Kawaii
paper-cut origami, Vivid kawaii felt embroidery, Vivid kawaii sticker foil
holographic, Loose watercolor-and-ink illustration, Miniature tilt-shift
diorama photography. File: `scripts/bots/farmbot/seeds/farmbot_look_register.json`.

## Manual overrides after the heart-based curation (2026-09-08)
Kevin visually spot-checked the 13 renders my text-matching couldn't
confidently attribute (none flipped any look's keep/drop status — all
matched an already-decided look on inspection, or were pure photoreal-drift
with no specific look at all) — then explicitly overrode two material
categories regardless of hearts already earned: **no felt-type mediums**
(removed "Kawaii felt embroidered handcraft" and "Sackboy-style claymation
kawaii stop-motion" — the latter's primary surface was explicitly "soft
felt and burlap") and **no clay/claymation looks** (removed "Claymation
kawaii stop-motion diorama"). Final count: **32 looks** (down from the
35-look heart-based list, down from 42 original). These overrides beat
heart-signal — a look can have hearts and still get cut on a material
Kevin doesn't want in the register at all.

## Round 2: kawaii category scrapped entirely (2026-09-08)
Kevin: "we need to scrap the kawaii look, it's too much of an overlap of
yumbot" — correct call, the kawaii entries were literally duplicated
verbatim from YumBot's own look register at FarmBot's founding (see
architecture note at top of this file). Removed all 17 entries containing
"kawaii" regardless of hearts already earned (same beats-hearts precedent
as the felt/clay override). **Register now at 15 looks** — purely
chibi/3D-CGI-family (10: Pixar, DreamWorks, Illumination, Spider-Verse,
Cartoon-Saloon, Klaus, Bluey/Hilda, Ghibli-2D, Vintage storybook, Pop-Mart
vinyl) + anime-family (5: Contemporary digital TV anime, Flat gouache
poster, Kyoto Animation, Dreamy pastel anime, Disney 2D).

**Round 2 QA in progress**: Kevin is now bookmarking (NOT hearting) any
render whose LOOK he wants removed — inverted signal from round 1 (heart =
keep, bookmark = cut). Pull his bookmarked FarmBot posts, identify each
one's look (text-match against `recipe.ai_prompt` first, visually inspect
the image if text-matching is inconclusive — same method as the round-1
"13 unmatched" investigation), and remove those looks once he's done
marking. Not yet pulled as of this note — waiting on him to finish
bookmarking.

## Round 3: "bland/not lush" fix + anime/Japan-cozy expansion (2026-09-08)
Kevin reviewed a live 20-post random-rotation batch (simulating the bot's
actual next-20-posts spread) and flagged it as bland/not cute, missing the
anime/Japan-cozy register, and asked for "lush details, trees, plants,
gardens, soft greenery, flowers... magical moment... enchanted... eye
candy." Root cause found: the 7 "Moments" pools (harvest-time, deliveries,
feeding-time, laundry-day, quiet-rainy-day, morning-routine, evening-
chores) anchored every entry on ONE small object (a clothesline, a puddle,
a lantern) without ever asking for the lush environment around it — a
design gap from when these were built (Place paths like orchard/market-
square never had this problem since their whole concept is bigger). Not a
rendering bug — the path templates just faithfully render whatever the
seed text says.

**Fix**: rewrote all 7 Moments meta-prompts to mandate, on every single
entry: a lush surrounding environment (climbing vines, flowering beds,
tall grass, moss) PLUS at least one small whimsical/enchanted detail (a
ladybug, a firefly, a dewdrop about to fall, a butterfly) — "one of the
coziest, prettiest farm scenes imaginable, never a bare or empty
composition." Regenerated all 7 clean (`append: false`), verified
(signage/human checks — 2 benign false-positives: "a child's patchwork
blanket" describes clothing size, not a person). Test-rendered 1 sample
per path — dramatic, confirmed improvement (a moss-roofed cottage with
glowing lanterns in the rain, a ladybug on a blossom-framed clothesline, a
cat silhouette among flowering vines at sunset, a wildflower-ringed
harvest wheelbarrow, a mossy river-delivery dock, a duck-and-hens scene
under dappled light with a butterfly). One sample (morning-routine) hit
the already-documented irreducible "generic tableau" pattern but was still
lush — not a regression.

**Anime/Japan-cozy expansion** (Kevin: "i'd like to do both" — new anime
looks AND more Japan-rural scene content):
- Look register: added 8 fresh, genuinely distinct anime sub-styles (NOT
  reused from MangaBot/YumBot, avoiding the exact overlap that got kawaii
  cut) — Retro 90s cel-anime, Modern theatrical anime, Manga panel-art,
  Anime background-painter, Chibi-anime keychain, Shoujo sparkle-panel,
  Seinen muted-palette anime, Anime visual-novel background. Register now
  **23 entries**, anime/Japanese-animation-coded share roughly doubled.
- Japan-rural scene blending expanded from 3 paths (farmhouse-garden,
  crop-fields, countryside-train) to 7: added duck-pond (Western pond ↔
  Japanese koi-pond-with-bridge), orchard (Western orchard ↔ persimmon/
  mikan/sakura orchard), decorative-garden-fences (Western decor ↔
  bamboo fence/stone lantern/zen garden), market-town-square (Western
  market ↔ shōtengai/michi-no-eki roadside stall — extra-explicit ban on
  readable characters of ANY language, since a Japanese market scene has
  an even higher signage-hallucination risk than the Western version).
  Same "mix separate entries, not fused within one" pattern throughout.
  All 4 regenerated clean (120 each, verified zero real signage/human/CJK
  leakage — only intentional romanized-term diacritics like "tōrō").
  Test-rendered 3 samples each (12 total) — genuinely gorgeous hits on
  both variants (a willow-framed wooden bridge over a duckling stream, a
  persimmon orchard by a kominka cottage, a manga-panel-art vendor square,
  a michi-no-eki roadside stall with daikon and jarred preserves).

## Deferred documentation (once the roster stabilizes, per Kevin)
- Document the "multi-media look mashup" paradigm in `BOT_SCENE_QUALITY_PLAYBOOK.md`.
- Document the generalized "secret/admin-only bot" creation recipe.
- Modernize `BOT_AXIS_REFACTOR_PLAN.md`'s NEW BOT INITIALIZATION CHECKLIST (describes the
  old heavyweight archetype/composer system; actual practice is function-form + Medium
  Looks, see FarmBot/ChibiBot/YumBot/MangaBot/BloomBot).
