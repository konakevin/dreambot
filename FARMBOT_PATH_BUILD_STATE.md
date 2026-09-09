# FarmBot — path build tracker (REWRITTEN 2026-09-09 — see note below)

## ⚠️ Everything below this line replaces the old tracker content

The previous version of this file described a 22-path roster (`farm-stand`,
`red-barn`, `duck-pond`, `crop-fields`, a 15-42-entry named-studio look
register — Pixar/DreamWorks/Ghibli/etc.) that was **entirely discarded**
when Kevin rejected FarmBot's original content wholesale ("throw out what
we have... i hate the renders from the initial batch") and the bot was
rebuilt from scratch against `FARMBOT_CREATIVE_DIRECTION.md`. That old doc
never got updated and was actively misleading — none of paths/pools/looks
it described still exist in the codebase. If you're reading this after a
context compact: **trust this file and the actual code, not any memory of
the old 22-path saga** — it's history, not current state.

## Current architecture (READ THIS FIRST if resuming)

- `scripts/bots/farmbot/index.js` — bot config. `pathBuilders` + `paths[]`
  list the ACTIVE paths (source of truth for what's live).
- `scripts/bots/farmbot/pools.js` — shared cross-path pools (tag-filtered
  via `byTags`/`filterByTags`) PLUS the `pickCharacter(picker, tags, axisPrefix)`
  helper — picks one CHARACTER_ARCHETYPE entry + a GENDER-MATCHED hairstyle
  + hair color + eye color + skin tone, combined into one drop-in string.
  This is how every path gets its character description — never hand-roll
  a character pick, always call `pools.pickCharacter(...)`.
- `scripts/bots/farmbot/shared-blocks.js` — `FARMBOT_COZY_NEUTRAL` (bot-wide
  tone lock, positive-only phrasing) + `lookOverride()` (prepends the
  rolled look-register style — plain cooperative wording, NOT
  authority/override language, see the HARD LESSON in that file).
- `scripts/bots/farmbot/seeds/farmbot_look_register.json` — 5 entries (as of
  the latest fix), ALL pure cel-shaded/flat-color/shoujo/digital/nostalgic
  ANIME technique descriptors. Every entry MUST: repeat "anime"/"cute" 2-3×
  anchored to CHARACTER vocabulary, explicitly mention EYES (not just the
  style-family word), contain ZERO time-of-day/weather/season words, and
  contain nothing that structurally contradicts the bot-wide vibrancy rule
  (e.g. "pastel" = desaturated by definition). Five separate real bugs found
  and fixed this way (time-of-day pollution ×3, missing-eyes flat-color,
  painterly-3D-ambiguity, pastel-vs-vibrancy conflict) — read the "Lessons"
  section below before touching this file again.
- **Shared pools available** (all in `pools.js`, tag-filtered):
  `CHARACTER_ARCHETYPE` (39 as of the latest append — role/outfit/demeanor
  only, gender-tagged; includes fisher/innkeeper/potter/carpenter/weaver
  now, added mid-push after the original creative-direction brief's claims
  about what already existed turned out to be false — verify against the
  actual JSON, never trust the brief's planned list),
  `HAIRSTYLE` (25, gender-tagged), `HAIR_COLOR` (20), `EYE_COLOR` (15),
  `SKIN_TONE` (15, pure visual depth/undertone, NO ethnic/national labels —
  see the standing refusal below), `ANIMAL_COMPANIONS` (25, density-tagged
  low/medium/high/chaos), `ACTIVITY` (25, **phrased as human actions with
  an implied subject — only usable when a character is present**),
  `FOOD_AND_BAKING` (25), `SEASON` (24), `WEATHER_ATMOSPHERE` (25),
  `WORLD_DETAIL_PROPS` (40, tagged indoor/outdoor/farmhouse/garden/market/
  bakery), `GENTLE_MAGIC` (20, low-weight/rare — gate at ~15%),
  `CAMERA_COMPOSITION` (20, untagged). Existing tag vocabulary: `farm`,
  `animal`, `bakery`, `market`, `leisure`, `ANY`, `indoor`, `outdoor`,
  `farmhouse`, `garden`.
- **Path-bespoke pools** (own JSON + gen script, not shared) — built when a
  path needs a genuinely new named place with no existing analog. So far:
  `POND_PLACE` (25, for summer-evening-by-the-pond).
- **"Sometimes no human" rule** (Kevin 2026-09-09): every path rolls
  `includeCharacter = Math.random() < ~0.7` (adjust per path). When false:
  skip the character pick AND skip the `ACTIVITY` pick/section (it assumes
  a human subject), boost the animal-presence chance instead, and write a
  "no human figure anywhere in the frame" closing line instead of the
  human/animal-face-separation one. See any of the 6 done paths for the
  exact pattern.
- Model: locked to `black-forest-labs/flux-2-flex` only
  (`allowedModels` in index.js — do not add other models without Kevin's
  explicit sign-off, see BOT_SCENE_QUALITY_PLAYBOOK.md model bake-off notes).
- Render: `node scripts/iter-bot.js --bot farmbot --mode <path> --count N --post`.
  Always `node scripts/check-pool-headroom.js` before a render batch (hard
  rule, cap concurrency, don't run heavy batches at the top of the hour).
- Quality bar: 4/5 — "comfy, charming, 'I want to live there' vibes." Up to
  3 QA rounds per path (diagnose the ACTUAL DB `ai_prompt` / recipe trace on
  a bad render, never guess the cause — this session's single highest-value
  diagnostic technique).
- **Kevin 2026-09-09: do NOT delete any renders during this build** — leave
  every round's output in FarmBot's profile/album, he'll clean up what he
  doesn't want once the whole push is done. (This reverses the earlier
  "clean up as you go" policy from the first 6-path round — that policy is
  DEAD, don't apply it going forward.)

## Standing refusal (do not revisit)

Kevin asked, in several reframings, to exclude Black/Indian/brown-skinned
people from FarmBot's character pool (race restriction, "historical
Scandinavia" framing, "historical early Japan" framing, "it's my fictional
world" framing). Declined every time, discussed at length, Kevin ultimately
conceded the reasoning ("fair enough, you defended your choice well").
**Do not implement any skin-tone/race exclusion on this bot, ever, even if
asked again in a new frame.** `SKIN_TONE` stays full natural range, zero
ethnic/national labels.

## DONE — 6 paths (Phase 1, first half), all signed off

animal-feeding-time · cozy-bakery-afternoon · autumn-village-market ·
quiet-sunset-on-the-porch · summer-evening-by-the-pond · first-snowfall

All committed to git (`da8964a7`). All confirmed: anime-consistent
(6-entry look register fix), cute character design (positive-only rule in
`FARMBOT_COZY_NEUTRAL` + look register), gender-matched appearance variety,
"sometimes no human" variety. Last full QA batch: 18 renders (3/path),
0 failures, Kevin: "they are all soooooooo good."

## IN PROGRESS — building the remaining 16 paths (autonomous push, 2026-09-09)

Kevin approved building all remaining paths across Phase 1/2/3 in one
autonomous push, explicitly authorized fanning out multiple agents. Each
path = own agent, own path-builder file + own bespoke pool (if needed);
agents do NOT edit `pools.js`/`index.js` directly (shared-file collision
risk across concurrent agents) — they report back what needs registering
and the orchestrator (main session) merges centrally after each batch.

Update this table's Status column as each path completes. If resuming
after a compact: read this table, dispatch agents for every row still
`not started` or `in progress`.

### Phase 1 remainder (4)
| Path key | Brief | Status |
|---|---|---|
| rainy-farmhouse-morning | cozy indoor/farmhouse mood during gentle rain, reuse WEATHER_ATMOSPHERE rain-tagged entries | **DONE** — round 3 (cap), split-diptych bug found here (see lessons below, now fixed globally), no bespoke pool, registered in index.js |
| spring-planting-day | season locked spring, gardener/farm character, planting activity | **DONE** — round 2 pass (round 1 caught a byTags/"ANY" leak, see lesson below), no bespoke pool, registered in index.js |
| harvest-festival | fall harvest celebration — hay bales, pumpkins, apple-picking; keep visually distinct from Phase 3's autumn festival variant | **DONE** — round 1 pass, bespoke `farmbot_harvest_festival_place.json` pool (25), registered in index.js |
| picnic-in-the-meadow | leisure + food combo, open-air meadow setting | **DONE** — round 3 (cap), no bespoke pool, registered in index.js |

### Phase 2 (11)
| Path key | Brief | Status |
|---|---|---|
| orchard-afternoon | needs bespoke ORCHARD_PLACE pool (fruit trees, ladders, baskets) | **DONE** — round 3 (cap), 7/9 renders passed; bespoke `farmbot_orchard_afternoon_place.json` (25), registered in index.js |
| flower-field-wandering | needs bespoke FLOWER_FIELD pool | **DONE** — round 1 pass, bespoke `farmbot_flower_field_place.json` pool (25), registered in index.js |
| woodland-walk | needs bespoke WOODLAND pool | **DONE** — round 2 pass (round 1 caught a "tiny character dissolving into open farmland" drift, see lesson below), bespoke `farmbot_woodland_walk_place.json` pool (25), registered in index.js |
| lakeside-riverside-moment | needs bespoke LAKESIDE pool (distinct mood from POND_PLACE) | **DONE** — round 2 pass, bespoke `farmbot_lakeside_riverside_place.json` (25), registered in index.js |
| village-street-wandering | mostly reuses existing market/village tags, minimal new content | **DONE** — round 2 pass; needed a bespoke `farmbot_village_street_place.json` (25) after all — no reuse candidate existed, registered in index.js |
| flower-shop | needs bespoke FLOWER_SHOP props pool (indoor floral shop) | **DONE** — round 1 pass, bespoke `farmbot_flower_shop_place.json` (25), registered in index.js |
| artisan-workshop | CHARACTER_ARCHETYPE already has potter/weaver/carpenter; needs bespoke workshop props pool | **DONE** — round pass, found potter/carpenter missing from archetype pool and fixed via append; bespoke `farmbot_artisan_workshop_place.json` (25), registered in index.js |
| cozy-inn-interior | CHARACTER_ARCHETYPE already has innkeeper; needs bespoke inn-interior props pool | **DONE** — round pass, worked around missing innkeeper via closest-fit tags (later added via append anyway); bespoke `farmbot_cozy_inn_interior_place.json` (25), registered in index.js |
| fishing-dock | now has real fisher archetypes (4, just added); needs bespoke dock pool | **DONE** — round 2 pass, bespoke `farmbot_fishing_dock_place.json` (25), registered in index.js |
| barn-animal-shelter-interior | reuses ANIMAL_COMPANIONS heavily; check WORLD_DETAIL_PROPS for existing barn-interior coverage first | **DONE** — round 3 (cap) clean pass; bespoke `farmbot_barn_interior_place.json` (25, architecture-only), registered in index.js |
| garden-vegetable-patch-tending | reuses ACTIVITY(chore/farm) + WORLD_DETAIL_PROPS(garden tag) — likely minimal new content | **DONE** — round 2 pass; needed a bespoke `farmbot_vegetable_garden_place.json` (25) after all (WORLD_DETAIL_PROPS's garden tag is decorative-flower, not vegetable), registered in index.js |

### Phase 3 (1)
| Path key | Brief | Status |
|---|---|---|
| seasonal-festival | bespoke rotating pool tagged by season: spring (flower fest/cherry-blossom picnic), summer (strawberry fest/firefly evening), autumn (pumpkin fest/lantern fest), winter (winter market/gingerbread/snowman) | **DONE** — round 3+ (extended verification given it closes the roster), all 8 concepts confirmed covered across 27 test renders, bespoke `farmbot_seasonal_festival_place.json` (57 entries), registered in index.js. **ALL 22 PATHS NOW COMPLETE.** |

## Lessons found during the 16-path autonomous push (2026-09-09)

- **Hue-freedom fix (cross-cutting, affects ALL paths)**: the render grid showed a strong, consistent
  golden/amber wash. Root cause: `FARMBOT_COZY_NEUTRAL` used to say "even where the light is soft, dreamy, or
  gentle, the palette itself stays warm and colorful" — unconditional, applied to every render regardless of
  scene. Compounded by `farmbot_weather_atmosphere.json` skewing 14/25 warm-dominant vs. 5/25 cool. Fixed:
  dropped the hard "stays warm" lock from the bot-wide fragment (kept "vibrant/richly saturated," dropped the
  hue lock); expanded the weather pool 25→55 with dedicated cool-hue (+15) and rain (+15, per Kevin: "we want
  lots of rainy weather") batches — now 22 cool-dominant / 15 warm-dominant / 19 rain-specific out of 55.
  Verified via 3 fresh renders: genuine hue variety confirmed (warm sunset, cool moonlit blue, misty grey-green
  rain scene — three different palette families, not one wash). This benefits every path built before AND
  after this fix automatically (it's a shared fragment + shared pool), no per-path action needed.
- **`banHumanLanguage: true` in `seedGenHelper.js` doesn't catch IMPLIED crowds.** It regex-matches explicit
  age/gender words (man/woman/person) but not "figures," "crowd," "children," "riders," "milling," "faces."
  A bespoke place pool for any gathering/festival-flavored path needs an EXPLICIT ban on implied-person
  language in its own meta-prompt, not just reliance on the shared helper flag (found on `harvest-festival`'s
  first-gen `HARVEST_PLACE` pool — ~12/25 entries smuggled in uncounted background people before the explicit
  ban was added and it was regenerated clean).
- **`runBot()` validates path against `bot.paths`, not just `pathBuilders`.** The standalone test-wrapper
  pattern (see `bot-paths` skill) needs `if (!bot.paths.includes(PATH_KEY)) bot.paths.push(PATH_KEY);` added
  in-memory before the render loop, or it throws "Path not in bot.paths." Already fixed in the skill's
  template.
- **Split-diptych composition bug (cross-cutting, Kevin: "no split frames like this")**: `rainy-farmhouse-morning`
  round 3 posted a render with a literal white-bar-divided two-panel composition (rainy meadow on top, kitchen
  on bottom) — Sonnet's brief-writing sometimes describes an interior+exterior-through-a-window scene as two
  separate "zones" ("a window dominates the upper portion... inside, [X]..."), which Flux renders as literal
  comic panels. Confirmed narrow in scope (DB text-search for the tell-tale phrasing found it ONLY on this
  path, not the original 6). Fixed with a new POSITIVE structural sentence in `FARMBOT_COZY_NEUTRAL` (applies
  to every render): "one single, continuously-composed photograph-like frame... the outside world is glimpsed
  through the opening as part of the very same unbroken shot... never as a separately divided section."
  Verified via 2 fresh renders: 0/2 hard-split, both read as one continuous scene (one a tiered-but-continuous
  vertical composition, one a clean single-depth shot). Benefits every path automatically (shared fragment).
- **Dough-kneading over-repetition ("why so many of people literally rolling a big ball of dough? lol")**:
  `farmbot_activity.json`'s only 3 chore+bakery-tagged entries were all near-duplicate "pressing/kneading a
  round of dough" poses — every bakery-flavored render wanting an active chore pose had literally nowhere
  else to go. Fixed: appended 15 new bakery-chore entries (rolling pastry, piping frosting, pulling rolls
  from the oven, ladling soup, wrapping a warm loaf, etc.) — now 18 bakery+chore entries, only 3/18 (17%)
  dough-specific vs. the prior 3/3 (100%). Verified via a fresh render: genuine new activity ("wraps a warm
  loaf in linen") appeared immediately.
- **"Horse keeper" archetype rendered as an anthropomorphic horse-headed human (Kevin: "perhaps just ban that
  look?")** — found via Kevin's heart-as-pointer on an `orchard-afternoon` render, independently ALSO found
  and flagged by the `orchard-afternoon` build agent on a different render. `CHARACTER_ARCHETYPE` had 3
  entries describing a fully human farmhand as a "horse keeper" — Flux read the leading noun phrase "horse
  keeper" as describing the character's own head/body rather than their occupation (a variant of the
  first-named-noun-lock lesson). All 3 entries removed outright (not reworded — the animal-name-adjacent-to-
  person-noun pattern is the risk, not the specific wording around it). Pool now 27 entries (was 30).
- **"Soft painterly cute anime illustration" rendered as unmistakably 3D-CGI (Kevin: "this look is 3D
  animation, we don't want it in FarmBot")** — found via heart-as-pointer, traced via `scenePalette` to this
  exact look entry. Root cause: "painterly" is genuinely double-meaning in art-style vocabulary (2D gouache/
  watercolor OR 3D-CGI-with-painterly-lighting — a term Pixar/DreamWorks use for their own films). No amount
  of surrounding "anime" words reliably disambiguated it. Cut outright (4th look-register cut this session,
  see `pools.js` comment for the full list + reasoning). Look register now **5 entries** (was 6, started at
  11). Full history: 3 cut for time-of-day pollution, 1 for background-first framing, 1 for the painterly/3D
  ambiguity.
- **`byTags()`'s OR-match logic leaks unrelated entries via ANY shared coarse tag, not just literal "ANY"** —
  broader version of the earlier lesson. `byTags(ACTIVITY, ['chore','farm','leisure'])` on `orchard-afternoon`
  let through every `bakery`-tagged chore entry too, because `'chore'` itself matched — produced a render of
  a character kneading bread dough in the middle of an orchard. Fix: filter manually to the tag COMBINATION
  you actually want, not just "any of these tags."
- **Metaphorical light language can render as the literal object** — 6/25 entries in the new
  `farmbot_orchard_afternoon_place.json` used "coins of afternoon light" / "coin-dappled," which rendered as
  literal gold coins scattered on the ground in one test render. Same token-literalism class as the
  documented "fire"/"herd" traps (CLAUDE.md). Reworded to "pools"/"patches" of light in the pool file (not
  re-rendered — 3-round cap already reached on that path; spot-check next time it renders).
- General "build many bot paths with QA rounds" process is now captured reusably in the `bot-paths` Claude
  Skill (`.claude/skills/bot-paths/SKILL.md`) — load it for any future path-building push on any bot.
- **`pools.byTags()` treats a literal `"ANY"` tag as ALWAYS-passing, regardless of requested filter tags —
  by design, but it can silently defeat a path's intended STRICTER filter.** `spring-planting-day` wanted
  ONLY chore/farm-tagged ACTIVITY entries, but `byTags(ACTIVITY, ['chore','farm'])` also let through the 10
  entries tagged `["leisure","ANY"]` — round 1 got a leisure pose (tea, sunset-watching) instead of a
  gardening action, traced via DB `ai_prompt`, undermining the whole path's premise. Fix when you need a
  STRICT subset: filter manually (`pool.filter(e => e.tags.includes('chore') && e.tags.includes('farm'))`)
  instead of `byTags`. `CHARACTER_ARCHETYPE` (14 ANY entries) and `WORLD_DETAIL_PROPS` (5 ANY entries) have
  the same latent bypass — harmless so far on the paths that use them loosely, but check for this any time a
  path's premise depends on EXCLUDING an axis's ANY-tagged entries, not just preferring certain tags.
- **A place-led path's "hero of the shot" heading can still lose the setting entirely to a generic tableau on
  a stochastic Sonnet draw** — `woodland-walk` round 1 (1/3 renders): Sonnet wrote "the character rendered
  tiny within the gentle rolling landscape... sweeping rolling fields stretching endlessly," which reduced the
  bespoke woodland to a single fir tree in one corner and rendered as an open farmland vista with a
  barely-visible chibi character, not a woodland walk at all. Traced via `ai_prompt` — no pool/tag bug, the
  bespoke `WOODLAND_WALK_PLACE` pool entry itself was fine; this was pure brief-writing drift (not tied to any
  specific look-register entry either — `scene_palette` was the clean "Pastel shoujo-style cute anime
  illustration" entry). Fixed by adding an explicit POSITIVE scale/proximity instruction to the path's own
  closing description (both the with-character and no-character branches): "the trees and leafy canopy
  surround and fill the frame close at hand on every side," and for the character branch specifically, "the
  character walks right among them, within easy reach of the nearest trunks and mossy stones — a figure IN
  the woodland, not a distant tiny speck in an open field or meadow beyond it." Verified via 3 fresh
  round-2 renders: 0/3 recurrence, and one render's `ai_prompt` confirmed the fix language survived
  Sonnet's paraphrase almost verbatim ("trees pressing close on every side filling the frame... the character
  centered warmly in the frame not distant but close and present among the trees"). Any other place-led
  bespoke-pool path that leans on "(the hero of the shot)" phrasing should consider adding the same
  scale/proximity sentence proactively if its QA renders ever show the setting dissolving into a generic
  wide-open landscape.

- **Per-object "agency" framing on round objects risks cute-face rendering under this bot's tone lock** —
  `lakeside-riverside-moment` had 3 pool entries phrasing river current as "eddies spiraling/swirling behind
  EACH rock" (individual-rock framing); combined with `FARMBOT_COZY_NEUTRAL`'s cheerful tone lock, Flux
  rendered the round river stones as personified creatures with faces peeking out of the water. Fixed by
  describing the current holistically ("the current sliding smoothly around them") instead of per-object, and
  "rounded stones" → "flat stones." Cross-bot rule: avoid describing a cluster of round/generic objects with
  individual per-object action verbs — describe the cluster/group holistically instead.
- **A pool's tags describe topic/mood, not physical-setting compatibility** — `village-street-wandering`
  filtered `ACTIVITY` by `['chore','leisure']` (topically reasonable) but one entry ("seated beside a quiet
  stream, trailing fingertips through the water") is setting-incompatible with a paved cobblestone street;
  Sonnet dutifully invented a whole stream running alongside the street to accommodate it. Fixed with a manual
  content-keyword filter excluding stream/hay/rafters/picnic-blanket/fireflies-type entries. Generalizes the
  `byTags` gotcha further: a path whose hero is a specific PLACE may need a manual content filter even when
  the tag combination looks topically correct — tags don't know what physically fits together.

- **"Bright flat-color cute anime illustration" rendered as generic Western storybook-cartoon, not anime
  (Kevin: "hearted this one becuase it's not anime")** — found via heart-as-pointer on a `lakeside-riverside-
  moment` render. Root cause, different from the painterly cut: this was the ONLY surviving look entry that
  never mentioned EYES — every other entry explicitly says "big sparkling anime eyes [with catchlights],"
  the single most anime-diagnostic visual cue; without it, "flat-color/bold outlines/simple shapes" reads as
  generic flat-cartoon. Unlike "painterly," this didn't name a rival medium outright, so REWORDING (not
  cutting) worked — added the same eyes-with-catchlights clause the other 4 already have. Verified via one
  isolated look-matrix render: unmistakably anime afterward. Register stays at 5 entries. Lesson: check every
  look-register entry explicitly mentions eyes, not just that it repeats the style-family word.
- Note: the same heart-flagged render also showed the personified-rock-faces bug from the lesson above — but
  it traced to a ROUND-1 `lakeside-riverside-moment` render (before that path's own fix landed and was
  reverified 0/3 in round 2), so it's old evidence of an already-fixed bug, not a new recurrence.

- **"Pastel shoujo-style cute anime illustration" structurally contradicted the bot-wide vibrancy rule
  (Kevin: "this is vibrant... feels washed out, not quite on brand")** — found via heart-as-pointer on an
  `artisan-workshop` render. Unlike the other 2 look-register fixes tonight (painterly = ambiguous word,
  flat-color = missing eye language), this was a genuine STRUCTURAL conflict: "pastel" means low-saturation
  by definition, directly contradicting `FARMBOT_COZY_NEUTRAL`'s "vibrant and richly saturated... never
  washed out or desaturated." Fixed by rewording (not cutting, register's already thin at 5): "soft pastel
  palette" → "richly saturated vivid palette," keeping the shoujo identity (sparkle/delicate-detail/big
  gentle eyes) since that doesn't require desaturation. Verified via one isolated look-matrix render: vivid
  and richly saturated, sparkle/shoujo charm intact. Lesson: when a look-register word directly names a
  property that conflicts with a bot-wide rule (pastel vs. vibrant, painterly vs. 2D-only, etc.), that's a
  structural conflict worth checking for on every entry, not just a style-strength issue.
- **False assumption in the ORIGINAL Phase-2 checklist**: it claimed `CHARACTER_ARCHETYPE` "already has
  fisher"/"already has innkeeper" — both FALSE. `FARMBOT_CREATIVE_DIRECTION.md`'s planned archetype list
  never fully survived generation. `artisan-workshop`'s agent found the same issue for potter/carpenter and
  fixed it; cozy-inn-interior's agent correctly worked around the missing innkeeper via closest-fit tags
  instead. Proactively fixed before dispatching `fishing-dock`: added fisher + innkeeper archetypes via
  `gen-character-archetype-fisher-innkeeper-append.js` (append-only). **Lesson for future checklists: verify
  a pool claim against the actual generated JSON, never trust the original creative-direction brief's PLANNED
  list as if it were the SEEDED reality.**
- **Watch-item, not yet fixed (low-rate, 1/6 observed)**: `cozy-inn-interior` found a render where the picked
  `SKIN_TONE` description got welded by Sonnet onto only "her hand" instead of the character as a whole,
  producing a disconnected mismatched-tone hand. Traced via DB `ai_prompt`, confirmed it's a
  `pickCharacter()`-adjacent Sonnet-compression issue that could in principle hit any path, not something
  introduced by that specific path's content. Round 2 (3 more renders) came back clean — reads as low-rate
  stochastic noise for now, not fixed. Flag for the orchestrator's attention if it recurs on another path.

- **Even the UNTAGGED `CAMERA_COMPOSITION` pool carries physical-setting assumptions** — `fishing-dock` round 1
  picked "High angle looking softly down over the village rooftops," which combined with the dock-proximity
  anchor to produce a wide aerial village panorama instead of a dock scene. Same class as the tags-describe-
  topic-not-setting lesson, but this pool has no tags at all to even attempt filtering — fixed with a manual
  content-keyword filter dropping incompatible entries (farmhouse window, barn doorway, village lane/rooftops,
  open rolling-fields framings). Any place-led bespoke-pool path should sanity-check `CAMERA_COMPOSITION`
  entries against its own setting, not just the pools it explicitly tag-filters.

- **An object-CONCEPT (not just a metaphor) can invite readable-text hallucination** — `garden-vegetable-
  patch-tending` pool entries mentioning "wooden plant labels" produced a render with literal hallucinated
  numerals ("1. 2. 3...") on the stakes, despite the explicit "no text/no numbers" suffix. Same family as the
  signage-hallucination lesson, but the trigger here was the CONCEPT of a label/marker, not a literal
  "sign" noun. Fixed by rewording to "small blank wooden garden stakes." Any future pool entry implying a
  label/marker/tag/sign of any kind is a signage-hallucination risk, not just literal "sign"/"chalkboard" words.

- **⭐ CROSS-CUTTING: Sonnet's brief-writing call uses a fixed `maxTokens: 400` (`botEngine.js callClaude`),
  and content appearing LATE in a dense input brief gets dropped/thinned first — independent of whether the
  hard token cap is actually hit.** This is the same root mechanism behind TWO separately-diagnosed bugs
  this session: `rainy-farmhouse-morning`'s missing rain (fixed by moving the rain mandate to the very
  first line of the template) and `barn-animal-shelter-interior`'s round-1 "zero animals" renders (fixed
  the same way — moved THE ANIMALS section to the very first line, ahead of even the bespoke place block).
  **Rule going forward: any path stacking two or more "hero" content blocks (a bespoke place pool AND a
  dense character/animal-companion pull) must put whichever block is most essential to the path's premise
  FIRST in the template, not trust it to survive a long brief.** If a render seems to be silently missing a
  described element, this — not a pool/tag bug — is the first thing to suspect; verify via the actual DB
  `ai_prompt` whether Sonnet's own output thinned or dropped the relevant section.

- **Scaling a shared pool can silently re-pollute it with a bug already fixed at the FILTER level in an
  earlier path** — `mango-orchard-harvest` found that the concurrent 120-scale-up agent's freshly-
  generated `CAMERA_COMPOSITION` entries (20→120) reintroduced the "character tiny/dwarfed in a
  sweeping landscape" problem using DIFFERENT wording than what earlier paths' keyword filters caught
  (not just "rolling," but "sky dominating the upper two-thirds," "dwarfed by gentle sweeping hills").
  A path-local `.filter()` that greps for one earlier bad phrase is not durable across a pool
  regeneration/scale-up — any path filtering `CAMERA_COMPOSITION` by keyword should widen its filter to
  `tiny`/`dwarfed`/`sky dominating`/`sweeping`, not just `rolling`, and should re-check its filter
  results after any pool scale-up, not just at initial build time.
- **Sonnet can invent a risky phrase itself, even when every pool entry feeding it is clean** —
  `banana-grove-path`'s round-1 `ai_prompt` contained "The horse keeper stands fully within the
  grove..." even though the picked `CHARACTER_ARCHETYPE` entry (idx 97, "cozy farm boy...") contains
  no such wording, and the live archetype pool at the time had zero "horse" mentions anywhere. Sonnet
  appears to have invented the occupational label itself from farm/hay context during brief-to-Flux-
  prompt rewriting. Didn't manifest visually this time (rendered as a normal boy, no anthropomorphism),
  but it's the same risky token pattern as the documented "horse keeper" archetype bug and isn't
  fixable by editing pool data — it's a Sonnet-composition risk. Watch for it recurring on any
  hay/animal-adjacent path; if it ever DOES manifest visually, the fix is a template-level guard
  (like `seasonal-festival`'s `CONCEPT_GUARD`), not a pool edit.

- **⭐ A "reinforcement" sentence that explicitly ENUMERATES multiple props in parentheses gets
  treated by Sonnet as a checklist to individually expand, bloating the brief and starving later
  sections — a NEW variant of the maxTokens lesson, found on `tropical-stream-crossing`.** Round-1
  template text read "...the farm-edge touches around it (a washing-stone, a water wheel, a laundry
  line, a fishing basket, garden rows just beyond) are lightly tended..." — meant as a light example
  list, but Sonnet expanded EVERY one of those 5 named props into its own full descriptive sentence
  in the final Flux prompt (confirmed via `ai_prompt`), even though the picked bespoke place-pool
  entry itself only ever names 1-3 props per entry by design. This ballooned the brief so much that
  BOTH no-character test renders in round 1 came back with ZERO animal/ambient-life content despite
  `pools.pickPureSceneLife()` guaranteeing a non-null pick — the guaranteed content was getting
  silently dropped by Sonnet's fixed-maxTokens output budget before it ever reached the final prompt,
  even after moving the animal/ambient section earlier in the template (first fix attempt, insufficient
  alone). The SAME enumerated-list sentence was duplicated a second time in the no-character closing
  paragraph, doubling the bloat. Also correlated with a same-round with-character miss: one render's
  `ai_prompt` fully described a character (skin/hair/outfit) but the character never appeared in the
  rendered image at all — plausibly the same budget-starvation mechanism pushing the character
  description too late in Sonnet's own rewritten output for Flux to weight it. Fixed by (1) moving the
  animal/ambient-life section to right after the hero paragraph in the template (before even THE
  CHARACTER) AND (2) removing the explicit per-prop enumeration from both the hero reinforcement
  sentence and the no-character closing paragraph, trusting the place-pool entry's own 1-3-prop pick
  to carry the specific detail instead of re-listing all 5 possible props as a mandate. Round 3
  (post-fix) verified clean: 5/5 renders, including 2 with confirmed animal/ambient content in the
  no-character or with-character branch, no truncation-cut prompts, no missing characters. **Rule
  going forward: when a template's reinforcement/closing text names specific example props, keep it
  to a SHORT generic phrase ("farm-edge touches") rather than a parenthetical list of every possible
  prop — Sonnet will try to individually render everything you name, whether or not that's the
  intent.** This is a candidate root cause worth checking on any other prop-rich place-led path if a
  round ever shows unexpectedly bloated/truncated prompts or content silently missing despite being
  guaranteed in code.

- **⭐ Front-loading a "no human figure" declaration doesn't guarantee it survives Sonnet's brief-
  writing — a NEW, worse variant of the maxTokens lesson: the wrong CAST can result, not just missing
  decoration.** Found on `papaya-guava-orchard` round 1. Original template put the character block 2nd
  (right after the bespoke place block, matching the "place first" convention) but the "no human
  figure..." governing sentence + `pools.pickPureSceneLife()`'s guaranteed ambient-life pick sat dead
  LAST, after camera/magic. One no-character render's Sonnet output cut off mid-sentence before ever
  writing the "no human figure" instruction — the rendered image shows an UNINVITED character (Flux
  defaulted to one anyway, primed by `FARMBOT_COZY_NEUTRAL`'s own "any character in the frame..."
  language). A second render (character branch) also truncated mid-word while describing the
  character. Fixed the same way `barn-animal-shelter-interior.js` fixed its "animals kept vanishing"
  bug: added a short, dedicated `━━━ THE CAST (essential — read first) ━━━` block stated FIRST, ahead
  of even the place block — full content for the no-character branch (cast + guaranteed ambient-life
  detail + an anti-personification guard, see next lesson), a short pointer + "clear, prominent,
  unmistakable presence, never distant or incidental" phrase for the character branch (kept short so
  place still gets primary billing). Verified via 10 more renders (rounds 2+3): 0/10 uninvited
  characters, and Sonnet visibly echoed the "clear, prominent, unmistakable" language into several
  Flux prompts verbatim. **Rule: for any no-character branch, the CAST-DETERMINING sentence itself
  (not just decorative content) is essential and must be front-loaded — losing it doesn't just thin the
  scene, it flips the render's correctness.**
- **⭐ Sonnet can independently generalize the look-register's CHARACTER-eye/proportion language onto
  non-character elements (fruit, ambient-life picks) when no human is present to anchor it — a new
  variant of the "horse keeper" Sonnet-invention-risk class, not a pool-data bug.** `papaya-guava-
  orchard` round 1's no-character render (animal roll fell back to an `AMBIENT_LIFE` ladybug pick) came
  back with EVERY papaya rendered with a drawn cartoon face. Root cause, confirmed via the actual
  `ai_prompt`: Sonnet itself wrote "big bright sparkling cute anime eyes ON THE LADYBUGS, adorable
  rounded cute character proportions THROUGHOUT EVERY ELEMENT OF THE SCENE" — extending look-register
  eye/proportion language (meant only for an actual human character) onto the fruit/animal-life when no
  human was present. The path's own bespoke place pool was already clean (holistic fruit-cluster
  language, no per-object action verbs) — this wasn't a pool bug. Fixed positively in the no-character
  CAST block (never by naming "face"/"eyes" to ban them as a primary instruction — matches the
  established positive-primary + "never..." trailing-qualifier pattern already used throughout
  `FARMBOT_COZY_NEUTRAL` itself, e.g. "never washed out or desaturated"): stated the fruit/creature
  "keeps its own true-to-life shape, color, and texture — the scene's charm comes entirely from its
  warm linework, light, and color, never from any added face or expression drawn onto an object."
  Verified 0/10 recurrences across rounds 2-3 (including a render with real living animals — chicks +
  rabbits — correctly given their OWN natural animal faces, while the fruit around them stayed
  unpersonified). **Flagged for the orchestrator, not fixed at the shared-file level (out of one path's
  scope): this risk is rooted in the SHARED `FARMBOT_COZY_NEUTRAL` fragment + look register (both
  bot-wide), so it could in principle recur on any other path's no-character branch, not just this
  one.**
- **⭐ `pools.pickPureSceneLife()`'s guaranteed non-null pick can still fail to reach the final rendered
  image even when front-loaded and NOT truncated — Sonnet can simply choose to paraphrase it away.**
  After the front-loading fix above, `papaya-guava-orchard` round 2 found 3 of 4 no-character renders
  came back with no visible animal/creature at all, even though every one of Sonnet's outputs completed
  normally (no truncation — full text ending cleanly at "gallery quality"). One render's full `ai_prompt`
  confirmed Sonnet wrote "no human figure anywhere in the frame" but never named what "enlivened by one
  small detail" actually was — it silently dropped that clause during its own paraphrase despite the
  content being first in the input brief. Fixed by strengthening the phrasing to match
  `barn-animal-shelter-interior.js`'s proven "required, concrete, clearly-visible presence, not just
  background mood" framing ("it is not optional background mood, it must actually appear in the
  render"), AND repeating the actual animal/ambient-life content a second time, verbatim, in the
  closing reinforcement line (not just "the detail named above" — restate it). Verified via round 3:
  the one no-character render in that batch showed the guaranteed animal pick (chicks + rabbits)
  vividly and prominently. **Rule: a "guaranteed" pick from `pickPureSceneLife()` (or any similar
  non-null-guarantee helper) is only a code-level guarantee — verify it actually survives into the
  RENDERED IMAGE, not just that the JS returned non-null, and if it doesn't, use forceful
  "required/must appear" language plus repetition, not just ordering, to make it stick.**

## Phase 4 — Tropical Farm (approved 2026-09-09, "continue to the tropical party!")

Kevin approved the full 22-path roster after in-app review, then approved scaling all pools 25→120
(a separate agent is doing that mechanical text-generation-only work concurrently — see its own
report when it lands). Same push, new direction: **tropical/fruit-farm content, same world, same
character system, same look register — just a tropical corner of FarmBot's world, not a separate
universe.** Kevin's explicit constraint: "the important thing is that it still feels like a charming
FARM since this is FarmBot, just a tropical farm" — cultivated/row-planted/personal-scale, tended by
hand, NOT a wild jungle or rainforest-exploration aesthetic. Every tropical path brief must bake this
in explicitly.

Planned roster (8): Pineapple Field Afternoon, Banana Grove Path, Mango Orchard Harvest, Tropical
Flower Garden, Jungle Stream Crossing (rename risk — keep it a farm-adjacent stream, not a jungle
trek), Coconut Palm Grove, Sugarcane Field, Papaya & Guava Orchard.

**Coordination note**: the concurrent 120-scale-up agent is actively editing `farmbot_character_archetype.json`
(and other shared pool files) — tropical path agents must NOT touch any shared pool file while that's in
flight; reuse existing farm/gardener/leisure archetypes only, same as every other path this session.
Also: tropical paths should generally SKIP the `SEASON` pool (temperate 4-season framing doesn't fit a
tropical climate) — let the bespoke tropical place pool carry its own warm/humid atmosphere directly,
filter `WEATHER_ATMOSPHERE` to `ANY`/warm-flavored entries only if used at all.

**2026-09-09 mid-push changes (apply bot-wide, all paths):**
1. **Character/pure-scene ratio standardized to 60/40** (Kevin: "we should flip this to 60/40 character/pure scene for farmbot"). All 24 simple-boolean paths' `includeCharacter = Math.random() < X` (was 0.65-0.75, varied per path) rewritten to a flat `0.6`. The 4 headcount-roll paths (autumn-village-market, harvest-festival, seasonal-festival, village-street-wandering) had their 0-character bucket rescaled to exactly 40%, preserving each path's original relative split between 1-character and 2-character (or 2-and-1, for village-street) proportionally.
2. **New shared pool + helper: guaranteed ambient life in pure-scene renders** (Kevin: "the pure scene ones should encourage animals placed into the comfy scene somehow that makes sense, or butterflies, fireflies, etc... something besides just a pure nature or barn scene"). Added `pools.AMBIENT_LIFE` (`farmbot_ambient_life.json`, 25 entries — butterflies/fireflies/bees/dragonflies/ladybugs/moths/a perched bird/drifting petals/dust motes, tagged outdoor/indoor/ANY, deliberately mundane/common — distinct from the rare/whimsical `GENTLE_MAGIC` pool) + `pools.pickPureSceneLife(picker, {animalPool, animalChance, ambientTags, axisPrefix})`: tries the path's own animal-companion roll first, falls back to an AMBIENT_LIFE pick on a miss, NEVER returns null. A no-character render can no longer come back bare. Retrofit across all 28 existing paths dispatched to a dedicated agent (below); the 2 remaining tropical paths were told to build with this pattern from the start.

| Path key | Status |
|---|---|
| pineapple-field-afternoon | **DONE** — round 1 pass, personally spot-checked (chibi girl with harvest knife/hat on fence, cultivated rows, vibrant sunset, unmistakably a farm), bespoke `farmbot_pineapple_field_place.json` (25), registered in index.js |
| banana-grove-path | **DONE** — round 1 pass, personally spot-checked (cats on a cultivated grove path, farmhouse visible, vibrant sunset), bespoke `farmbot_banana_grove_place.json` (25), registered in index.js |
| mango-orchard-harvest | **DONE** — round 1 pass, personally spot-checked (ladder + harvest baskets + bird, cultivated orchard rows in background, no character this draw — correct per the coin-flip rule), bespoke `farmbot_mango_orchard_place.json` (25), registered in index.js |
| tropical-flower-garden | **DONE** — round 3 pass (found + fixed a real bug: `pickCharacter(['farm','leisure'])` was a no-op since nearly every archetype carries 'ANY', producing a baker with a dough-cutter in a flower garden — fixed with a manual `ARCHETYPE_INCOMPATIBLE` filter + local `pickGardenCharacter()`; 60/116 archetypes survive), bespoke `farmbot_tropical_flower_garden_place.json` (25), registered in index.js |
| **Ambient-life retrofit (all 28 paths)** | in progress (agent afb6518b609c2bb8b) — mechanical wiring of `pools.pickPureSceneLife` into every path's no-character branch, includes required test-and-look-at-renders step per Kevin's explicit ask |
| coconut-palm-grove | **DONE** — round 1 pass (3/3 clean, incl. one no-character variant exercising the coin-flip branch correctly), bespoke `farmbot_coconut_palm_grove_place.json` (25), registered in index.js |
| sugarcane-field | **DONE** — round 1 pass + proactive hardening pass (6 renders total, highest dwarfing-risk path in the roster — moved the scale-safety sentence into the guaranteed-survives-brief opening block per the maxTokens lesson), bespoke `farmbot_sugarcane_field_place.json` (25), registered in index.js |
| papaya-guava-orchard | **DONE** — round 3 (full cap used, see lessons below), bespoke `farmbot_papaya_guava_orchard_place.json` (25), registered in index.js |
| tropical-stream-crossing | **DONE** — round 3 pass (round 1 found + fixed 2 real bugs, see lessons below), renamed from "jungle stream crossing" per the charming-farm-not-jungle constraint, bespoke `farmbot_tropical_stream_crossing_place.json` (25), registered in index.js. **This closes the full 8-path tropical roster (Phase 4).** |

**120-scale-up agent a3704e3cf4d0fd3a9: DONE.** All shared + bespoke pools from the 22-path push
scaled 25→120 (see per-pool table below). SKIN_TONE's ethnic/national/race-label ban scanned across
all 120 final entries post-scale: zero matches, ban held. Two real defects reappeared during scaling
(the *data* fixes from earlier in this doc were never applied back to the *source meta-prompts*, so
regenerating fresh entries regenerated the same bugs) — both caught and fixed by the scale-up agent
itself before landing:
- 4 new "horse keeper" `CHARACTER_ARCHETYPE` entries reappeared (the documented anthropomorphic-
  render bug) — removed outright, same as the original fix. This is why CHARACTER_ARCHETYPE landed
  at 116, not 120.
- 10 new `VEGETABLE_GARDEN_PLACE` entries said "wooden plant labels" (the documented hallucinated-
  numerals bug) — reworded to "small blank wooden garden stakes," the pool's own already-proven-safe
  wording.

**Not yet fixed, flagged for whoever next touches these two gen scripts**: the risky phrasing
(`horse keeper`, `wooden plant labels`) is still baked into `gen-character-archetype-pool.js` and
`gen-vegetable-garden-place-pool.js`'s own meta-prompt text — only the generated JSON was
patched. Any future append run on either script will reintroduce the same bug and need the same
post-hoc filter again unless the source prompt text itself gets corrected.

**New watch-item, not a blocker**: 3 pre-existing `WORLD_DETAIL_PROPS` entries (indices 0/10/24,
predate this task) mention a "hand-painted wooden sign" — only one of the three disclaims "no
legible lettering." Worth a signage-hallucination spot-check next time this pool comes up.

Pool sizes after scaling: CHARACTER_ARCHETYPE 116 (see above), HAIRSTYLE 120, HAIR_COLOR 118,
EYE_COLOR 120, SKIN_TONE 120, ANIMAL_COMPANIONS 120, ACTIVITY 120, FOOD_AND_BAKING 120, SEASON 120,
WEATHER_ATMOSPHERE 120, WORLD_DETAIL_PROPS 120, GENTLE_MAGIC 120, CAMERA_COMPOSITION 120, and all
13 bespoke place pools from the 22-path roster (POND, HARVEST_FESTIVAL, ORCHARD_AFTERNOON,
FLOWER_FIELD, WOODLAND_WALK, LAKESIDE_RIVERSIDE, VILLAGE_STREET, FLOWER_SHOP, ARTISAN_WORKSHOP,
COZY_INN_INTERIOR, FISHING_DOCK, VEGETABLE_GARDEN, BARN_INTERIOR) at 120. SEASONAL_FESTIVAL_PLACE
scaled to exactly 120 (15/concept × 8 concepts), preserving all pre-existing QA'd entries (the
script's `main()` had to be restructured — its original architecture discarded prior entries on
every re-run). `FARMBOT_LOOK_REGISTER` deliberately excluded from scaling (stays small/curated, 5
entries). Zero exact duplicates across all 3,234 scanned entries. Nothing committed — sitting in
the working tree for review. Tropical bespoke pools (pineapple/banana/mango, still at 25 each) were
NOT touched by this agent — they appeared mid-session from concurrent path-building agents and are
still at MVP-25, pending their own scale-up once the full tropical roster is QA'd.

## Tropical + AMBIENT_LIFE scale-up to 120 (Kevin approved full 30-path roster, "all are approved now, including tropical")

**DONE.** All 8 tropical bespoke place pools scaled 25→120 (zero exact duplicates, zero banned-language regressions — unlike the earlier 22-path scale-up which found 2 regressions, all 8 tropical gen scripts' source-level bans held cleanly under scaling). `farmbot_ambient_life.json` scaled 32→120 too (its gen script's meta-prompt was first updated to explicitly codify the warm/winter/neutral tagging rule, previously only applied by hand); one real tagging gap found and fixed proactively (a basking-lizard entry tagged only `outdoor`, missing the `warm` tag it needed to stay out of winter-locked renders — same bug class as the cherry-blossoms-in-snow incident). Final AMBIENT_LIFE distribution: 96 outdoor (60 also `warm`), 17 indoor, 7 `winter`-only. All 30 FarmBot paths now backed by 120-entry pools.

**2026-09-09, later:** `first-snowfall` DEACTIVATED (removed from `index.js`'s `paths[]` array only — still fully intact in `pathBuilders`, its own file, and its bespoke pool) per Kevin: "shut off the snowy paths for farmbot for now — just deactivate, don't delete." Off-season for real-world posting. 29 paths now active. Restore by moving it back into the array whenever seasonally appropriate. Open question to Kevin: whether to also suppress `seasonal-festival`'s 2 winter concepts (winter-market, gingerbread-snowman) out of its 8-concept rotation.

## 2026-09-09 investigations: "anime drift" + "weather variance" (Kevin flagged both)

- **"Two renders drifting from anime look"** — Kevin hearted 2 renders (both `spring-planting-day`, uploads `742470ae` and `a01f7fc7`) to flag them. Traced via `recipe.scene_palette` (not guessed): #1 used **"Soft painterly cute anime illustration"** — a look-register entry ALREADY IDENTIFIED and CUT from the pool earlier this session for producing exactly this 3D-CGI-ambiguous drift (see the look-register lessons above). The render predates that fix (01:44 that night); the entry no longer exists in the current 5-entry pool. #2 used **"Clean cel-shaded cute anime illustration"** — a still-current, valid entry; re-rendered it in isolation just now (`ONLY_INDICES=1` on `gen-farmbot-look-matrix.js`) and got a strongly correct 2D anime result, so this reads as ordinary per-render model variance, not a wording defect. **Also added a defensive fallback** in `index.js`'s `rollSharedDNA` (`|| pools.FARMBOT_LOOK_REGISTER[0]`) so `lookOverride()` can never silently go blank regardless of cause — cheap insurance, not proven to be the actual mechanism here (scene_palette was non-null on both flagged renders, ruling out the "empty pool at roll time" theory).
- **"Not seeing weather/lighting variance"** — `farmbot_weather_atmosphere.json` (120 entries) genuinely has real range: 9 night/moon/starlit, 19 rain, 13 sunset/dusk, 26 morning/dawn entries confirmed via direct scan. The perceived flatness is a SAMPLING artifact of tonight's specific batch, not a pool gap: of the 176 renders in the last 3h, 58 were tropical paths (which deliberately SKIP the shared WEATHER_ATMOSPHERE pool — bespoke place pools carry their own atmosphere per Phase 4 direction), 27 were `seasonal-festival` (bespoke festival-locked atmosphere), and 6 were `first-snowfall` (intentionally locked to snowy) — 91/176 (52%) came from paths that structurally don't roll the diverse shared pool. Nothing to fix here; flag to Kevin that this should resolve naturally once the batch mix returns to normal-path rendering (or point him at a non-tropical, non-locked path like `woodland-walk`/`flower-field-wandering`/`orchard-afternoon` for a fairer look at actual weather variety).

## 2026-09-09, post-1.2.0-submission: two real bugs found in the live 20-post batch (Kevin's own review)

Kevin ran a real 20-post batch through `run-bot.js` (production dispatcher path, real shuffle-bag) to preview live cadence, and caught two real bugs by eye:

- **Back-turned character ("no back turned towards camera")**: root-caused via `ai_prompt` to 11 "Over-the-shoulder [composition/perspective/view/framing]" entries in the shared `farmbot_camera_composition.json` (120 entries) — structurally incompatible with FarmBot's "clearly legible fully visible face" character rule. All 11 removed (120→109). Fixed at the source too: `gen-camera-composition-pool.js`'s meta-prompt no longer lists "an over-the-shoulder view" as a draw-from category, and now has an explicit strict ban on back-facing/rear-view framings — plus, while in there, also removed "a character small within a large gentle landscape" from the draw-from list and added an explicit ban on dwarfing/scale-dissolution framings (the same recurring bug class documented earlier this session, now closed at the source instead of requiring every path to keep manually filtering it out forever).
- **Fake/overcomposed glowing light + literal day/night split ("what's going on with this one? unreadable and that light looks fake and overcomposed")**: root-caused via `ai_prompt` on a `fishing-dock` render to the bespoke pool's own entry "a small gap between the boards showing a dark glint of water below" — Sonnet's rewrite escalated this into "the darkness beneath given a gentle luminous sparkle," which rendered as a glowing vertical beam with visible stars slicing through an otherwise foggy daytime dock scene (a literal split-frame day/night artifact — a new variant of the split-diptych bug class). Fixed: reworded to "a narrow gap between two boards showing calm water below" (no dark/light words at all). Source fixed too: `gen-fishing-dock-place-pool.js` no longer instructs "showing a glint of water below," and gained a new CRITICAL rule banning any pairing of "dark/darkness/shadow" with a light-implying word ("glint/sparkle/shimmer/luminous/glow") describing the same thing — this exact contradictory pairing is now a named, documented trap for future pool-writing.
- **"Always sunny" perception, confirmed real and root-caused with data, not vibes**: scanned all 8 tropical bespoke place pools for warm (afternoon/golden/hazy/sunny/midday/honeyed) vs. cool/varied (morning/dawn/dusk/evening/night/rain/overcast/mist/fog/moon/star/twilight) language. 4 of 8 are badly skewed: **sugarcane-field 81/120 warm vs. 0 cool**, **pineapple-field 79/120 warm vs. 1 cool**, papaya-guava-orchard 69/120 warm vs. 5 cool, coconut-palm-grove 61/120 warm vs. 12 cool. The other 4 tropical pools (mango, banana, tropical-flower-garden, tropical-stream-crossing) are already well-balanced (30-36 cool/varied each) — proof this is fixable pool-content, not a structural limitation. Since all 8 tropical paths deliberately skip the shared `WEATHER_ATMOSPHERE` pool (temperate-specific, setting-incompatible), each bespoke place pool is that path's ONLY source of time-of-day atmosphere. **In progress (agent a5620c0f525e81931)**: appending ~30-40 new predominantly cool/varied entries to each of the 4 lopsided pools, with an explicit new gen-script ban on the dark+light contradictory pairing (the fishing-dock bug) baked in from the start.

## 2026-09-09: tropical rebalancing landed, machete/critter fix, sugarcane-field deactivated

- **Tropical warm/cool rebalancing (from the "always sunny" finding above), COMPLETE**: sugarcane-field 120→155 (0→34 cool), pineapple-field 120→158 (0→38 cool), papaya-guava-orchard 120→150 (5→35 cool), coconut-palm-grove 120→148 (12→40 cool). Zero exact duplicates, zero bug regressions across a full scan of all new entries. Personally verified via 8 real renders (4 sugarcane, 4 pineapple) — genuine night/starlit/overcast/misty variety confirmed, no split-frame or glowing-light artifacts, still reads as cultivated farm.
- **Machete/knife over-representation, FIXED**: Kevin flagged a repeated "fruit field + machete" pattern across renders. Data confirmed it: sugarcane 35%, coconut 22%, pineapple 13% (the other 5 tropical pools 0%). Rewrote the excess entries to critters (gecko, dragonfly, finch, snail, butterfly, ladybug, firefly, crab — 60-70% of replacements per Kevin's steer, "a few cute little critters instead") and static props (rope, gloves, whetstone, straw hat, canteen), landing all 3 pools at ~9%. Gen scripts capped at ~1-in-10 for future scale-ups.
- **`sugarcane-field` DEACTIVATED** (Kevin: "disable the sugarcane path(s) from farmbot") — same deactivate-don't-delete pattern as `first-snowfall`; path builder + pools (including today's machete fix) stay intact in `pathBuilders`, just removed from `paths[]`. **Active regular roster is now 28 paths** (30 built, 2 deactivated: first-snowfall + sugarcane-field).

## 2026-09-09: Fall + Halloween seasonal roster — 9 paths, SHIPPED

Kevin approved a 9-path seasonal roster (mirroring ChibiBot's precedent — each seasonal path gets its own dedicated bespoke pool set, drawn only during its calendar window via `botSeasonal.js`, never mixed into normal `paths[]`). Built via 9 concurrent agents, each independently seeded to full 120-entry depth (corrected mid-build from FarmBot's normal MVP-25 convention — holiday pools follow ChibiBot's own full-depth precedent, not the scale-after-signoff rule), rendered, and QA'd. **I personally re-verified every path myself before merging** (pulled real renders + full `ai_prompt`/`recipe.path`-filtered DB scans) rather than trusting each agent's own self-reported QA — this caught two real bugs the agents' own rounds missed:

- **`farmbot-halloween-scarecrow-building`**: no-character+animal branch let Sonnet costume the animal AS the scarecrow and invent a village costume-parade scene, dropping the actual built scarecrow from frame — traced to pure Sonnet embellishment, not pool text. Sent back; the fix itself needed two more passes (first attempt caused a maxTokens dropout of the guard text, second attempt leaked its own negation language ("no costume, no straw...") into the literal Flux prompt — caught and rewritten positive-only before it shipped). 23 focused re-verification renders, all clean.
- **`farmbot-fall-cider-pressing`**: similarly, a with-character render showed a Halloween ghost-garland-decorated barn party scene with an apple-bobbing tub instead of cider pressing, hero prop entirely absent — again pure Sonnet embellishment, not pool text. Sent back; fixed by anchoring 84 previously-unanchored ACTIVITY entries directly to the press object, rewriting a negation-based template line, and reinforcing press-presence twice. Re-verified 22 renders strictly filtered by `recipe.path` (my first evidence pull for this bug had actually cross-contaminated from a sibling path via a loose keyword search — lesson: always filter by `recipe.path`, never by content keyword match alone, when multiple paths render concurrently).

**Final roster, all merged into `index.js`'s `seasonalPaths` + committed:**
- **Fall** (4): `farmbot-fall-hayride`, `farmbot-fall-corn-maze`, `farmbot-fall-campfire-evening`, `farmbot-fall-cider-pressing`.
- **Halloween** (5): `farmbot-halloween-barn-party`, `farmbot-halloween-costume-parade`, `farmbot-halloween-pumpkin-carving`, `farmbot-halloween-scarecrow-building`, `farmbot-halloween-trick-or-treating` (the last one Kevin specifically requested: "we could add a 'trick-or-treating' one? where we have characters or even animals dressed up in costumes?").

All 157 test-render uploads (106 Halloween + 51 Fall) across all 9 paths were deleted afterward (Kevin: "so we can only have regular posts in there until the holiday window arrives") — storage objects + DB rows both cleaned, verified zero remaining. The path code/pools/registration all stay live; nothing renders again until each holiday's real calendar window opens (`public.holidays`: Fall starts Sept 15, Halloween ~30 days before Oct 31) AND `engine_config.bots_seasonal_enabled` is true (it already is, fleet-wide, from the 6 other bots' existing Halloween content — no separate flip needed for FarmBot).

## 2026-09-09: FarmBot LAUNCHED — public, live in the app

1.2.0 shipped to the App Store. Executed `FARMBOT_GOLIVE_RUNBOOK.md`: `users.is_public = true`, `activate_announcement('farmbot-launch')`. One incident during launch: Kevin didn't see the "Introducing FarmBot" sheet post-launch because his own earlier same-session preview testing had already marked `announcement_seen` for his account — cleared, and this is now a standing step in the new `release` Claude Code skill (`.claude/skills/release/SKILL.md`) for every future gated launch, not just FarmBot's. Also hard-set `engine_config.min_app_version`/`latest_app_version` to `'1.2.0'` (a separate, previously-unarmed app-wide update gate — see the skill for the full disambiguation from the announcement's own per-row version gate).

FarmBot is now a normal live public bot: 28 regular paths + 9 armed-but-dormant seasonal paths, `bot_schedules` posting on the same hourly-checked cadence as every other bot.

## 2026-09-09: `waterfall-glade` — new path, closes the brief's waterfall gap (AlphaBot-tested, NOT yet registered on FarmBot)

Kevin's audit of FarmBot against the original 17-section creative-direction brief found one confirmed gap: section 2 ("THE WORLD") explicitly lists waterfalls among the world locations alongside forests/lakes/rivers, but a full grep of every FarmBot seed pool found zero waterfall content anywhere. Built as a brand-new path per the standing AlphaBot-first rule (FarmBot is live/public now, so no exceptions).

**Concept**: a small, personal-scale, magical-feeling countryside waterfall — a gentle cascade over mossy rocks into a clear pool, never a huge/Niagara-scale feature (per the brief's "personal in scale" rule). Leans lightly on section 14's Gentle Magic register (a faint rainbow in the mist, ~10% of place-pool entries) while staying grounded — no epic-fantasy imagery. Genuinely distinct from every other water-adjacent path: `summer-evening-by-the-pond` = still pond, `lakeside-riverside-moment` = wide open water, `fishing-dock` = dock structure as hero, `woodland-walk` = forest, no water. This path's hero is specifically the FALLING/CASCADING water.

**Files**:
- `scripts/gen-seeds/farmbot/gen-waterfall-glade-place-pool.js` → `scripts/bots/farmbot/seeds/farmbot_waterfall_glade_place.json` (119 entries, target 120)
- `scripts/gen-seeds/farmbot/gen-waterfall-glade-activity-pool.js` → `scripts/bots/farmbot/seeds/farmbot_waterfall_glade_activity.json` (120 entries) — bespoke since the shared ACTIVITY pool has no waterfall-wading content
- `scripts/gen-seeds/farmbot/gen-waterfall-glade-wildlife-pool.js` → `scripts/bots/farmbot/seeds/farmbot_waterfall_glade_wildlife.json` (119 entries) — bespoke since the shared ANIMAL_COMPANIONS pool is farmyard-only, no water-adjacent wildlife
- `scripts/bots/farmbot/paths/waterfall-glade.js` — the path builder

All 3 pools seeded at full 120-entry depth from the start (confirmed against this session's Fall/Halloween 9-path build as the current norm, not the older MVP-25 convention) and baked in every standing ban at the meta-prompt source: no negation, no ethnic/national skin-tone labels, no predator animals, no dark+light contradictory pairing (the fishing-dock bug — this was a live risk here since mist/rainbow/light effects are exactly the content class that trips it), no metaphorical light-as-object language, holistic (not per-object) description of stone/fern clusters, no huge/Niagara-scale imagery, no implied-person language.

**Animal-spotlight lesson applied from the start** (per the barn-animal-shelter-interior.js pattern, generalized as a new standing practice): the ANIMAL COMPANY block is placed BEFORE the CHARACTER block in the template whenever both are present, headed "ANIMAL COMPANY" (not "A VISITOR"/"A COMPANION"), drawn from a pool written with descriptive richness comparable to a character description.

**Camera filter**: `CAMERA_COMPOSITION` manually content-filtered (not pulled raw) — excludes farmhouse/barn/village/rooftop/cottage/interior framings (physically incompatible with an outdoor waterfall glade) plus dwarfing/scale-dissolution language (`tiny`, `dwarfed`, `rolling`, `sweeping`, `sky dominating`, `establishing shot`) per the CLAUDE.md hard rule against character-tiny-in-landscape framing — 41/109 entries survive the filter. Note for whoever builds the next path off this pool: a naive `village (street|lane|rooftops)` bigram regex misses "the village, rooftops and garden patches..." (comma-separated) and "Village-street" (hyphenated) — filter on standalone `\bvillage\b`/`\brooftop\b`/`\bcottage\b` instead of requiring adjacency.

**Tested via AlphaBot** (`scripts/bots/alphabot/index.js` — added `waterfall-glade` to `pathBuilders`, `FARMBOT_DESTINED_PATHS`, `mediumByPath`, `paths[]`, `modelByPath`, and all 3 `skipPaths` lists, cloning FarmBot's real `farmbot_cozy_neutral` medium/flux-2-flex lock byte-identical, mirroring the pattern already wired in by a concurrent agent for `farm-fair-festival`/`duck-pond`/etc.). Rendered 6 via `node scripts/iter-bot.js --bot alphabot --mode waterfall-glade --count 6 --label "auto-qa: waterfall-glade R1" --post`.

**QA R1 — PASS, no re-round needed.** Viewed all 6 images + pulled full `ai_prompt` for all 6 (filtered strictly by `recipe.path`, not keyword search). Results: a no-character chipmunk-at-the-pool shot with a rainbow in the mist and an autumn pumpkin cart; a character + fawn drinking + dog, fawn rendered with real prominence; a character sitting and watching with dragonflies caught in a subtle gentle-magic sparkle ring; a tight macro close-up of a hand catching spray (weakest of the 6 compositionally, but not a rule violation); a no-character pair of rabbits sharing clover at a tiered cascade; a character + pair of rabbits at a tiered waterfall with soft magic light-motes, rabbits given genuine visual prominence in the foreground (animal-before-character ordering working as intended). All personal-scale, all charming, all hit the "I want to live there" bar. Zero predator animals, zero signage, zero race labels, zero back-turned/dwarfed framing, zero negation leaks.

**One real finding, NOT a path-specific defect**: every one of the 6 renders' Sonnet-written Flux prompt is truncated mid-word/mid-sentence right where it meets the code-appended suffix (`botEngine.js callClaude()`'s fixed `maxTokens: 400`). Checked whether this is unique to the new path's density: pulled 8 recent `lakeside-riverside-moment` renders (7/8 truncated) and 8 recent `woodland-walk` renders (8/8 truncated) — both are existing, signed-off, "soooooo good" paths. **This is a pre-existing, cross-cutting characteristic of the whole FarmBot template architecture, not something this path introduced** — every path stacks enough axes (place + character + activity + season + weather + camera + optional magic + closing paragraph) to hit the ceiling on its closing flourish. It never manifested as a visible defect on any of the 6 renders (hero/animal/character content is front-loaded and survives; only the last decorative clause gets clipped) — flagging for whoever next looks at `botEngine.js`'s brief-writing token budget bot-wide, out of scope for a single path.

**NOT registered in `farmbot/index.js`/`pools.js`** — per the standing rule, that's Kevin's call after reviewing. Proposed registration lines (byte-identical pattern to every other FarmBot path):
```js
// pathBuilders:
'waterfall-glade': require('./paths/waterfall-glade'),
// paths[]:
'waterfall-glade',
```
(No `modelByPath`/`mediumByPath` override needed — FarmBot's `index.js` already locks the single `farmbot_cozy_neutral` medium + `flux-2-flex` model bot-wide.)

## Deferred documentation (once the roster stabilizes, per Kevin)
- Document the "multi-media look mashup" paradigm in `BOT_SCENE_QUALITY_PLAYBOOK.md`.
- Document the generalized "secret/admin-only bot" creation recipe.
