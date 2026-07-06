# EXPAND_BOT_BLINDSPOTS — staged implementation plan (2026-07-04)

**What this is.** The approved build plan for 56 new bot paths across 16 bots, from the 2026-07-04
fleet-wide gap audit (full rationale: `BOT_PATH_GAP_REPORT.md`). Kevin approved ALL proposals.
Work is split into **one STAGE per bot** so each stage can be executed by a separate agent with no
cross-stage file conflicts. Stages are independent — run them in any order, in parallel if desired
(each stage touches ONLY its own bot's directory + its own recipes in that bot's gen script).

**Status legend per path:** `[ ]` not started · `[MVP]` pools at 25 + rendering · `[VERDICT]` awaiting
Kevin · `[SCALED]` production pools · `[LIVE]` committed to main. Update statuses in place as you work.

---

## GLOBAL RULES — read before ANY stage (non-negotiable)

1. **Re-read `BOT_SCENE_QUALITY_PLAYBOOK.md` IN FULL before starting your stage.** Hard CLAUDE.md rule;
   prior session context is not a substitute. Your stage below tells you WHICH proven shape to clone —
   the playbook tells you HOW that shape works and every failure mode it defeated. Update the playbook
   with any new lesson you learn, the moment you learn it.
2. **MVP-25 law.** Every new/changed pool: 25 entries first (~$0.30 + 40s), sample all 25, render-test
   5-6, get Kevin's verdict. NEVER scale to 200 on an unproven recipe. Scale with `--target N --count 50`,
   fan pools out ~6 parallel workers, re-verify every pool count after a parallel run (stragglers happen).
3. **Test renders go to the bot's live account** (`iter-bot.js --bot <bot> --mode <path> --count 5
   --post --label "<path>-r0"`). The LOOK is Kevin's call from the feed — you may verify mechanics only.
   Run render batches in the FOREGROUND (background shells produce nothing).
4. **Going-live semantics.** `iter-bot` refuses a `--mode` path that isn't in `bot.paths[]` — so add the
   path to `paths[]` LOCALLY to test. That is safe: the cron dispatcher runs from committed `main`, so an
   uncommitted local add posts nothing. **Do NOT commit the `paths[]` addition until Kevin approves the
   MVP renders** — committing it puts the path into the live shuffle-bag rotation within hours.
5. **One variable per iteration round.** Grade honestly against the 10/10 bar (visible story / layers /
   entity / genre-specificity / material+light richness). 3 failed rounds on the same idea = stop and
   restructure, don't "fix one more thing."
6. **Pool hygiene at birth** (every new pool, before Kevin ever sees a render):
   - Programmatic dedup is mandatory (signature-based, within + cross batch — all gen scripts have it).
   - Off-genre trope regex sweep (`pirate|tricorn|flintlock|steampunk|clockwork|victorian|pegasus|
     cowboy|samurai|ninja|revolver…` — adapt family to the bot). Sonnet WILL smuggle some in.
   - Camera-framing pools: audit as a SET, not a sample — ZERO entries that subordinate the hero to a
     body-part / object macro / face-portrait / pure texture ("close-detail on hands", "X dissolving
     entirely", "as a jewel" similes). This slop is invisible at MVP and bites under automation.
   - Character pools: no `[age] man/woman` framing (race/species leads), no real-world ethnicity labels,
     no artist name-drops, gender-locked templates (never one neutral template for two genders).
   - Vocabulary-literalization scan: for every noun, ask what Flux's strongest prior is. Terrestrial
     nouns in sky/space scenes (rail/canyon/pillar), rigid-object nouns on clouds/atmospherics
     (disc/plate/dome/metallic/hovering), bird verbs on fish (perched), literary concepts with no visual
     prior (borrower/kodama) — all render the PRIOR, not your scene.
   - Positive-only prefixes and briefs. Never write "NO X" in a prompt-prefix (CLIP renders X — the
     arcane-library lamp bug). No anti-pattern baggage in rewritten metaPrompts. No negation words in
     OUTPUT prompts on photoreal bots (EarthBot law).
   - Multi-sub-theme pools at production scale: one focused Sonnet call per sub-theme, equal share,
     tally after (Kevin hard rule).
7. **Templates.** Lean: state the ONE load-bearing composition mandate as the ABSOLUTE FIRST RULE; one
   money-shot axis; word cap loud and LAST ("85-110 words, count them, name the hero and STOP"). No
   ban-lists that teach the banned noun; no ALLOWED-vocab dumps; no stacked `━━━ NON-NEGOTIABLE ━━━`
   walls (they push Flux to its generic centroid). If Sonnet's `ai_prompt` output exceeds ~160 words,
   fix the brief, not Flux.
8. **Wiring checklist for every new path** (adapt to the bot's architecture — each stage names it):
   archetype + template registered where the bot's existing ones live (watch the cross-bot
   duplicate-archetype-name registry error) → path file → pools registered in the bot's `pools.js`
   (pool JSONs MUST exist on disk before the module loads — run the gen first) → `paths[]` (local only
   until approved) → `mediumByPath` / `modelByPath` / `promptPrefixByPath` (default EMPTY unless the
   stage says otherwise) / `vibesByPath` if needed → `twoPassPolish.skipPaths` (default ON for all
   axis-system paths) → `chaos.skipPaths` during MVP for composed/dense paths → `sensoryAnchors.pathContext`
   entry → sanity-check module loads: `node -e "require('./scripts/bots/<bot>')"`.
9. **Mediums.** A bot-only medium needs NO DB row — define it 100% in code (`mediumStyles` +
   `mediumByPath` + `promptPrefixByMedium` + a `modelByPath` lock) per the dreamscape law. Only add
   `dream_mediums` + `dlt_clean_mediums` rows if Kevin wants the path DLT-eligible (default: no).
10. **Git discipline.** Shared working tree: edit ONLY your stage's bot directory + its gen-script
    recipes. Commit with explicit pathspec, READ the staged diff hunk-by-hunk first, and for a
    mixed-hunk file stage your hunks then commit WITHOUT a pathspec (pathspec commits take working-tree
    content and will sweep other agents' hunks — this bit us 2026-07-03). Never `git add -A`. Commit
    only after Kevin sign-off (see rule 4).
11. **Vibes for new paths.** Follow the 2026-07-03 off-brand audit: no `surreal` on cute/photoreal bots,
    no `voltage` on non-electric worlds, no `macabre` outside GothBot-adjacent registers. When in doubt,
    inherit the bot-wide list; add a `vibesByPath` only when the path needs a narrower palette.
12. **Suggested execution order** (highest-value first): Stage F (FaeBot), J (OceanBot), E (EarthBot),
    D (DinoBot), M (SteamBot), C (DreamBot), I (MangaBot), B (BrickBot), K (PixelBot), A (BloomBot),
    then the rest. Any order is fine.

---

## STAGE A — BloomBot (5 paths)

**Bot context.** Flowers ALWAYS the hero. Declarative archetypes/templates live bot-local
(`scripts/bots/bloombot/`); the Flower Engine (`flowerEngine.js` + `flowerThemes.js`) supplies palette +
species roster per render — new paths should consume it (color comes from the theme system, never from
naming species colors; remember the flower×color render-prior matrix: color-locked species render their
prior color). Look register (12 fine-art looks) + hero-mandate bar are injected centrally in `buildBrief`
— a "composed/designed" path needs its OWN `heroMandate` branch (the hanging-flowers law: the bot-wide
frame-packing mandate is a spam generator for designed paths). Medium `bloom_hyperreal_cgi` (neutralized);
models flux-1.1-pro + ultra; vibe `cinematic`. Gen: the bloombot gen scripts under `scripts/gen-seeds/bloombot/`
(clone `gen-hanging-flowers-pools.js` as the harness). ZERO-HUMANS hoisted block + the "lone figure at
the vanishing point" named ban on every walkway/depth composition.

### A1. `water-garden` — [ ]
- **Identity:** lotus/lily ponds, floating flower rafts, bloom-ringed springs — mirror-still dark water
  DOUBLING the bloom color. Scene-as-hero.
- **Axes (6 + 1 gated):** `water_body` (pond/lake-margin/spring/flooded-garden/canal — 200) ·
  `water_flora` (lotus/lily/floating-heart varieties, engine-species-agnostic phrasing — 150) ·
  `reflection` (MONEY-SHOT: what the mirror doubles — blooms / sky / canopy / lantern-light — 60) ·
  `bank_planting` (pickN 2 — 120) · `lighting` + `atmosphere` (universal) · gated `water_life` ~30%
  (koi flash / dragonfly / heron at distance — fauna co-star precedent: flower-friends).
- **Template hard rules:** water surface visibly STILL (mirror), reflection must read; flowers hero in
  BOTH real and reflected halves; no boats/docks/bridges (built-feature ban); composition-over-density
  heroMandate branch.
- **Watch-fors:** "pond" is safe; avoid "koi pond" in the prefix (subject lock). Species color comes from
  the engine matrix — lotus/lily are color-versatile, verify in `flowers.json` before mandating themes.

### A2. `flower-fields` — [ ]
- **Identity:** the cultivated mega-field — tulip stripes, lavender rows, sunflower seas, poppy hills.
  GEOMETRY is the differentiator vs `landscape` (wild carpet).
- **Axes (5 + 1 gated):** `field_geometry` (MONEY-SHOT: stripes / rows-to-vanishing-point / contour waves
  / patchwork quilt / single-crop sea — 50) · `crop_bloom` (field-scale species families — 100) ·
  `vantage` (ground-level between rows / low aerial / hilltop / drone-high patchwork — 40) ·
  `field_backdrop` (windmill-free horizon: mountains/sea/big sky — 100) · universals · gated
  `field_event` ~35% (petal wind-drift, low mist between rows, golden-hour rim).
- **Template hard rules:** the geometric pattern must read in 1 second; NO humans/tractors/greenhouses;
  vanishing-point compositions get the named "no lone figure walking into the light" ban.
- **Watch-fors:** windmills/barns are Flux's tulip-field prior — crowd out with pure-nature backdrops
  (positive language, never "no windmill").

### A3. `moon-garden` — [ ]
- **Identity:** the bot's first NIGHT register — moonlit garden of white/silver night-bloomers
  (moonflower, night jasmine, white wisteria), fireflies, cool-silver palette.
- **Axes (5 + 1 gated):** `garden_setting` (150) · `night_bloom` (white/pale species, engine WHITE-family
  themes — 120) · `moonlight_effect` (MONEY-SHOT: silvered petal edges / moon-path on water / glow-white
  against blue-dark — 50) · `night_sky` (moon phases + stars, real-sky only — 60) · universals · gated
  `night_life` ~30% (fireflies / luna moth / owl silhouette).
- **Template hard rules:** light is MOON + starlight only (no lamps/lanterns/electricity — positive-only:
  name the moonlight, never "no lamps"); blooms stay luminous-pale against deep-blue dark; never horror.
- **Watch-fors:** "glowing flowers" reads bioluminescent-fantasy — phrase as "moonlit", "silvered",
  "catching the moon." Constrain the engine to WHITE/pale theme families for this path.

### A4. `rain-garden` — [ ]
- **Identity:** storm-light drenched blooms — saturated wet color, droplets, petals on wet stone.
- **Axes (5 + 1 gated):** `garden_scene` (150) · `rain_state` (MONEY-SHOT: fine drizzle / heavy downpour
  / just-after with dripping — 40) · `wet_detail` (pickN 2: droplet-jeweled petals, rain-slick leaves,
  puddle reflections — 80) · `storm_light` (bruised sky + break-light / silver overcast / backlit rain —
  60) · universals · gated `storm_event` ~30% (distant lightning, rainbow after).
- **Template hard rules:** rain must be VISIBLE (streaks/droplets/splash rings); saturated-wet color is
  the point (rain intensifies, never grays out); no umbrellas/figures.

### A5. `great-blossom-tree` — [ ] (spectacle)
- **Identity:** ONE colossal ancient flowering tree as monumental hero (wisteria/magnolia/sakura-giant),
  jack-and-the-giant-flower energy at TREE scale — dwarfed world at its roots.
- **Axes (5 + 1 gated):** `tree_form` (massing + bloom character, conical-collapse lesson: name the
  silhouette per entry — 100) · `bloom_canopy` (MONEY-SHOT: petal-fall / cascading racemes / canopy sky —
  60) · `root_world` (the tiny world below: meadow/pool/stone shrine-free clearing — 100) · `season_light`
  (60) · universals · gated `canopy_event` ~35%.
- **Template hard rules:** needs its own heroMandate branch (open sky + negative space like jack — scale
  via CONTRAST not frame-packing); living tree, never dead/spooky; petals not leaves carry the color.
- **Watch-fors:** clone jack-and-the-giant-flower's `promptPrefixReplaceByPath` mechanism.

**Stage A validation:** each path MVP-25 → 5 posted renders → verdict → scale (`water_body`/`garden_scene`
/`crop_bloom`/`tree_form` to 150-200, money-shot + gated pools 40-60). Update playbook BloomBot section.

---

## STAGE B — BrickBot (4 paths)

**Bot context.** Everything-is-brick LEGO MOC photography; declarative axis composer; clone the
pirates/space/fantasy archetype stack wherever the existing `BRICKBOT_*` archetypes/templates are
registered. Hard rules from the canonical BrickBot playbook section: **NEVER LEGO Star Wars / Harry
Potter; never hard-SF realism registers; camera_framing is a MANDATORY DRIVING AXIS + minifig-pose
variety tied to camera keywords; story-tension (mid-X) in every no-vehicle entry; register pool ~85%
iconic LEGO heritage; "STARSHIP" qualifier on naval-overlap ship-class names; anti-photoreal brick
mandate on all nature elements; tilt-shift is the everything-is-LEGO signal (keep it unless the path
needs wide establishing deep-focus).** Models flux-1.1 pair; vibe `cinematic`; heart-calibrate after
R0-R3. Standard axis set to clone: scene_type / minifig_action / build_technique / camera_framing /
subject_focus-or-vehicle_class / register / scene_props(×2) / lighting / palette + 50%-gated phenomenon.

### B1. `lego-city` — [ ]
- **Identity:** modern LEGO City life — fire station mid-callout, construction site crane-lift, busy
  modular downtown street, harbor docks, police chase, street market.
- **Axes:** standard stack. `register` ~85% City heritage (Fire/Police/Construction/Harbor/Octan/
  City-Square) + ~15% modular-building AFOL register. `vehicle_class` ~50% vehicles (fire truck/crane/
  tram/boat) / ~50% no-vehicle street scenes (each with mid-X tension: mid-rescue / mid-pour /
  mid-market-rush). `build_technique` = modular-street facades, SNOT sidewalks, greebled rooftops.
  Money-shot = the modular facade row with lit interiors.
- **Gated:** `city_event` 50% (fireworks over city hall / burst hydrant spray in trans-blue studs /
  crane load mid-swing).
- **Watch-fors:** modern-city photoreal drift is the risk — the anti-photoreal brick mandate must name
  asphalt/glass/water as brick parts. No real brand logos, no text (suffix already bans).

### B2. `lego-trains` — [ ]
- **Identity:** LEGO trains through all-brick worlds — steam engines on studded viaducts, cargo yards,
  mountain tunnels, crossing gates, stations.
- **Axes:** `train_consist` (hero: engine era + cars — 40-50, expect a natural cap) · `trackwork`
  (MONEY-SHOT: viaduct / horseshoe curve / drawbridge / spiral climb / yard ladder — 40) ·
  `route_biome` (brick landscapes the line crosses — 150) · `station_life` (minifig story-beats at
  platforms/crossings — 150) · camera_framing (MANDATORY) · build_technique · lighting · palette +
  50%-gated `rail_event` (mid-crossing gate-down, steam plume, night mail-run lamps).
- **Differentiation:** vs ToyBot `model-train-world` — this is unmistakably BRICK (studded rolling stock,
  brick terrain per the anti-photoreal mandate), never HO-scale realism. Say so in the template.

### B3. `haunted-brick` — [ ]
- **Identity:** LEGO Creator Haunted-House register — spooky-FUN brick manor, glow-ghost minifigs,
  jack-o-lantern stalls, full-moon bats. Cute-spooky, never horror.
- **Axes:** standard stack; `register` = Creator Haunted House / Hidden Side / Monster Fighters heritage;
  `scene_type` (manor exterior / crooked graveyard-lite / pumpkin patch / haunted fairground) ·
  `apparition` 50%-gated (trans-neon ghost minifigs, glow-in-dark elements). Money-shot = the glow
  elements against warm window light.
- **Watch-fors:** GothBot owns real gothic — keep this Scooby-Doo-fun (bright accents, smiling ghosts).
  `bannedPhrases` note: no "nightmare before christmas" anywhere in pools.

### B4. `micro-skyline` — [ ]
- **Identity:** microscale architecture — whole city skylines / famous-city silhouettes / harbor panoramas
  at micro-build scale, NO minifigs (1 stud = a building floor).
- **Axes (lean, landscape-path shape):** `skyline_subject` (hero: city type/geography — 150) ·
  `micro_technique` (MONEY-SHOT: 1×1-plate windows, cheese-slope roofs, trans-stud rivers — 40) ·
  `water_or_green` (harbor/river/park bands — 60) · camera_framing · lighting · palette + 50%-gated
  `sky_event`. No minifig_action, no register (a skyline has no faction — the landscape-path precedent).
- **Watch-fors:** keep tilt-shift; micro reads as "model on a table," which is exactly right.

**Stage B validation:** R0 5-renders per path; heart-calibration query after; expect register/consist
pools to cap 30-50 (don't fight it).

---

## STAGE C — DreamBot (4 paths)

**Bot context.** Wildcard dream bot; every active path is scene-bespoke with a CODE-ONLY medium (no DB
row), excluded from the look rotation, skips chaos + two-pass polish, and locks models via `modelByPath`
(default: flux-1.1 pair; ultra-only for hyperreal vistas). Bot-local `archetypes.js` /
`archetype-templates.js` / `gen-dreambot-pool.js` recipes / `shared-blocks.js` mediums. Clone shapes:
`dreamscape` (scene-as-hero, 12-family world variety) and the far-eden two-sibling A/B.
**⚠ COORDINATION:** another agent has UNCOMMITTED WIP in this bot (worlds-within + dream-logic —
untracked path files + modified index.js/archetypes/templates/pools/shared-blocks). Before editing any
shared dreambot file, `git status scripts/bots/dreambot/` and merge around their hunks; never revert
their WIP. If their work has landed by the time you start, this warning is moot.

### C1. `pocket-planets` — [ ]
- **Identity:** Little-Prince planetoids — tiny round self-contained mini-worlds floating in soft pastel
  space (one cottage + one tree planet; lighthouse planet; garden planet with its own tiny moon).
- **Axes (6 + 2 gated):** `planet_theme` (the world-on-the-sphere, 12-family variety mandate: cottage /
  garden / lighthouse / orchard / pond / bakery-free village / observatory / winter / lantern / meadow /
  tide-pool / cloud-farm — 200) · `orbit_companion` (MONEY-SHOT: what circles it — ring of ducks, tiny
  moon with its own tree, comet with a ribbon tail — 60) · `space_backdrop` (soft pastel nebula/starfield,
  never hard sci-fi — 80) · `planet_detail` (pickN 2 — 120) · `palette` (60) · `light_mood` (60);
  gated `visitor` ~25% (a tiny non-human traveler figure) · `sky_event` ~30%.
- **Template hard rules:** the SPHERE must read — visible curvature, things standing at angles around it;
  ONE planet dominant (neighbors tiny in distance); soft/gentle register (whimsical, never cold-cosmic).
- **Medium/model:** new code-only `dreambot_pocket` (soft painterly-dimensional, deep focus); flux-1.1 pair.
- **Watch-fors:** "planet" + space backdrop can drift photoreal-astronomy — the medium anchors storybook.
  Avoid "asteroid/moon-surface" nouns (StarBot literalization law).

### C2. `dream-express` — [ ]
- **Identity:** a whimsical train traveling through impossible dreamscapes — sky rails over cloud seas,
  star-bridge crossings, aurora tunnels, lantern-lit carriages (Spirited-Away sea-train register).
- **Axes (6 + 2 gated):** `train_character` (the train itself: brass-and-teal night express / paper-lantern
  local / glass observation car — 80) · `route_wonder` (the impossible landscape crossed: cloud sea /
  mirror-flood plain / star bridge / candy canyon / firefly marsh — 200, 12-family mandate) ·
  `journey_beat` (verb-led: cresting / crossing / departing / gliding-past — tiny-vehicles journey law —
  100) · `rail_path` (MONEY-SHOT: the receding line of track/light — 50) · `light_mood` (60) ·
  `atmosphere` (pickN 2 — 60); gated `passenger_glimpse` ~30% (silhouettes in lit windows, non-human) ·
  `sky_event` ~35%.
- **Template hard rules:** train mid-JOURNEY never parked (anti-catalog law); track recedes but the
  vanishing point is EMPTY of figures (named trope ban); layered depth mandatory.
- **Medium/model:** code-only `dreambot_express` (cinematic painterly, warm-lamp vs cool-night contrast);
  ultra lock.
- **Watch-fors:** "rail/track" literalization is SAFE here (we want rails) — but keep the world impossible
  so it never reads as a real railway; MangaBot's `anime-trains` (Stage I) owns realistic Japan trains —
  keep zero overlap (this one is never Japan, never realistic).

### C3. `cloud-harbor` — [ ]
- **Identity:** ships sailing seas of cloud — lighthouse beacons on cloud reefs, sky-whale silhouettes
  gated, sunset cloud-surf breaking on floating rocks.
- **Axes (5 + 2 gated):** `cloud_sea_state` (rolling swells / mirror calm / breaking cloud-surf — 100) ·
  `vessel` (sail-ships built for sky: lantern-hulled sloops, moth-winged ferries — 100) · `harbor_feature`
  (MONEY-SHOT: lighthouse on a cloud reef / floating breakwater / beacon chain — 60) · `sky_palette` (60)
  · `light_mood` (60); gated `sky_life` ~25% (sky-whale/ray silhouette at distance) · `weather_event` ~35%.
- **Template hard rules:** clouds are CLOUD — soft, moist, feathered (the rigid-object/UFO vocabulary law:
  never disc/plate/metallic/hovering on a cloud); ships lean INTO the cloud-sea like water.
- **Medium/model:** code-only `dreambot_cloudsea` (luminous painterly); flux-1.1 pair.

### C4. `dreamscape-nocturne` — [ ]
- **Identity:** the far-eden two-sibling move applied to dreamscape — the same candy-fantasy world shape
  with the light INVERTED: moonlit candy-worlds, lantern-lit streams, luminous flora, deep-blue skies.
- **Build:** share the `DREAMBOT_DREAMSCAPE` archetype + `dreamscape_*` pools where possible; new pools
  ONLY for `night_light` (moon/lantern/glow sources — 60) and a night-tilted `atmosphere`; new code-only
  medium `dreambot_dreamscape_nocturne` (cool-luminous, warm accents); template stays look-neutral, the
  medium is the whole diff (far-eden law).
- **Watch-fors:** "glowing flora" must stay pretty-magical not radioactive; ultra lock like dreamscape.

**Stage C validation:** MVP each; C4 is cheapest (sibling), do it first as the stage warm-up.

---

## STAGE D — DinoBot (3 paths + 1 revival decision)

**Bot context.** Photoreal Mesozoic; single `render` medium + `cinematic` vibe locked; declarative
composer with universal `lighting`/`PREHISTORIC_ATMOSPHERES`; models = 4 Flux + Nano Banana via clean
medium. Bot-wide laws that apply to EVERY new path: **no humans (positive-only), no gore, Mesozoic-locked
(never reads modern), cattle-lexicon ban (herd/bull/cow/calf/grazing/savanna → gathering/adult/juvenile/
feeding/fern-plain), grounded ban (≥1 foot planted; no floating), no frontal-roar cheese, SPECIES_ANCHOR
template instruction (body-plan + famous look-alike for obscure genera), species + biome variety
mandates.** New pools via the dinobot gen script; 0.8-gated phenomenon is the house pattern.

### D1. `dino-nights` — [ ]
- **Identity:** the nocturnal Mesozoic — moonlit watering holes, hunts by starlight, pre-dawn mist,
  Milky Way over sauropod silhouettes. First night register on the bot.
- **Axes (5 + 1 gated):** `night_scene` (species + nocturnal behavior + setting, fat entries — 200) ·
  `night_light` (MONEY-SHOT: moon phase / starfield / pre-dawn blue / firelight-free — real light
  sources only — 60) · `biome` (reuse tagged settings) · `surprise_element` (150, night-coded) ·
  universals (lighting slot overridden by `night_light`-safe pool) · 0.8-gated `night_phenomenon`
  (meteor streak / moonbow / mist inversion).
- **Template hard rules:** the LAND stays visibly LIT (EarthBot night-landscapes law — moonlight REVEALS,
  never black-silhouette minimalism; cinematic-silhouette already owns silhouettes); eyes may catch
  light naturally, never glow-fantasy; real night sky only.
- **Watch-fors:** clone EarthBot's night sky-variety approach; keep Nano Banana routing (clean medium)
  in mind when checking renders — verify `uploads.model`.

### D2. `storm-season` — [ ]
- **Identity:** dinosaurs in DRAMATIC weather — rain sheeting off a tyrannosaur, lightning over a fleeing
  gathering, monsoon-flooded fern-plains, dust-storm walls. The Jurassic-Park-in-the-rain register.
- **Axes (5 + 1 gated):** `storm_scene` (species + storm-reaction behavior — 200) · `weather_drama`
  (MONEY-SHOT: rain curtain / fork lightning / wall of dust / hail-flattened ferns — 60) ·
  `storm_light` (break-light, bruised sky, lightning-lit instants — 50) · `biome` · `surprise_element` ·
  0.8-gated `peak_event` (strike-moment, flash-flood surge).
- **Template hard rules:** WET-WORLD block cranked (this is its native path); animals REACT to weather
  (mid-flee / hunkered / drinking the flood) — never posed; grounded ban doubly enforced (wind + rain
  invite floaty poses); no gore.
- **Watch-fors:** lightning invites sci-fi glow — keep "one fork, physically lit"; the cloud-vocabulary
  law (no discs/hovering nouns on storm clouds).

### D3. `polar-dinos` — [ ]
- **Identity:** real paleo-accuracy showcase — polar-latitude dinosaurs (Nanuqsaurus, Leaellynasaura,
  Edmontosaurus at high latitude), snow-dusted feathers/hide, aurora skies, ice-edge coasts, months-long
  dusk light. Entirely new palette (bot is all warm).
- **Axes (5 + 1 gated):** `polar_scene` (species + cold-behavior + setting — 200) · `ice_feature`
  (MONEY-SHOT: blue glacier face / frozen lagoon / snow-laden conifers / sea-ice edge — 60) ·
  `polar_light` (aurora / low sun / blue twilight — aurora is real at poles, grounded-photographic — 50)
  · `surprise_element` · universals · 0.8-gated `polar_phenomenon`.
- **Template hard rules:** SPECIES_ANCHOR is load-bearing here (all obscure genera — body-plan + famous
  look-alike leads); feathering described as insulation (positive) — do NOT fight Flux with "feathered
  not scaly" negations, describe the coat; Mesozoic-lock (never reads as Arctic-today: no polar bears,
  no modern coniforest cues — cycad-hardy flora mix).
- **Watch-fors:** this is the riskiest recipe (weak Flux priors + cold biome) — budget 2-3 MVP rounds.

### D4. DECISION — `volcanic-apocalypse` revival — [ ]
Dormant on disk (function-form). If Kevin wants it: rebuild LEAN on the axis system (revival law — never
restore old overblown blocks), distinct from extinction-event (eruption = local drama; extinction = K-Pg
sky). Ice-age megafauna stays OUT unless Kevin rules on the brand question.

---

## STAGE E — EarthBot (3 paths)

**Bot context.** Strict true-to-life fine-art nature photography. Laws on every path: **no humans, no
human-built features (hoisted standalone blocks naming Flux's insertion biases), zero negation words in
OUTPUT prompts, real-Earth phenomena only, biome-agnostic prefixes (region-anchor only), no tourist-coded
vantage names (drama-led morphological prose; broad regions safe), axis-clean stacked-density (dense
inside each axis, pure between axes), cross-axis compatibility clauses (stars+sunset drop rule).**
Medium locked `earthbot_wow` (do NOT amplify it); models flux-1.1 pair; vibe `cinematic`; chaos+polish
off. Clone: the regional 6-axis shape (`subject` toponym-led / `foreground_anchor` / `light_condition` /
`atmosphere` / `sky_layer` / `scale_prover` + 0.25-gated `phenomenon`) or the EPIC_VISTA 6-axis clone
pattern (bespoke subject + reused modifier pools, 0.65 gate).

### E1. `winter-wonder` — [ ]
- **Identity:** deep winter as its own path — hoarfrost forests, frozen waterfalls, rime-crusted pines,
  blue ice caves, snow-laden peaks at alpenglow, frozen lakes with methane-bubble ice.
- **Build:** EPIC_VISTA-clone shape — bespoke `WINTER_WONDER_SUBJECT` (200, biome-tagged, drama-led,
  global: Hokkaido rime / Lapland tykky trees / Alps hoarfrost / Baikal ice / Yosemite winter) + a
  bespoke `ice_feature` money-shot axis (50) + reused EPIC_VISTA lighting/atmosphere/hero_feature/
  sky_layer + 0.65-gated phenomenon (light pillars / diamond dust / sun dogs — all REAL cold-air optics,
  a genuinely fresh phenomenon family).
- **Template hard rules:** snow/ice as brick— no wait, as REAL matter with texture (wind-sculpted
  sastrugi, blue glacial ice density); cold-palette discipline with warm-light counterpoints (alpenglow);
  no ski infrastructure/cabins/tracks (hoisted built-features block extended with winter-specific
  insertions: ski lifts, lodges, fence lines, groomed pistes).
- **Watch-fors:** "crystal" vocabulary drifts fantasy — describe ice as ice.

### E2. `north-wild` — [ ]
- **Identity:** the missing regional — Alaska / Yukon / Canadian Rockies / boreal north: Moraine-blue
  lakes, Denali massif, tundra autumn reds, braided glacier rivers, taiga, coastal fjords, aurora nights.
- **Build:** regional formula verbatim — 6 axes + 0.25 gate; bespoke prefix `North American raw nature,
  photograph` (biome-agnostic — never enumerate lake/peak/tundra in it); toponym-led subject entries
  (Moraine Lake, Denali, Kluane, Tombstone Territorial, Athabasca) with per-biome distribution quotas
  (the african-landscape v2 law).
- **Phenomena:** aurora ALLOWED here (second path after iceland-raw — grounded-photographic mandate),
  plus fog inversions, alpenglow, midnight sun.
- **Watch-fors:** wildlife as postage-stamp scale-provers only (grizzly/moose/caribou at distance —
  african-landscape precedent); NO national-park lodge/canoe/dock insertions (name them in the hoisted
  block).

### E3. `storm-earth` — [ ] (investigate FIRST)
- **Step 0 (mandatory):** `git log --all --oneline -- '*dramatic-sky*' '*weather-drama*'` + read the
  removal commit(s) to learn WHY they were dropped. If it was a taste kill by Kevin — STOP and ask him.
  If it was a quality/architecture kill, proceed: the axis system + phenomenon discipline changed the math.
- **Identity:** severe-weather spectacle — supercell mesocyclones over plains, lightning barrages,
  monsoon walls, mammatus fields, roll clouds, storm-light prairies.
- **Build:** EPIC_VISTA-clone; bespoke `storm_subject` (the storm structure IS the subject — 150) +
  `land_anchor` (what it towers over — 100) + reused modifiers; 0.65-gated `strike_moment`.
- **Template hard rules:** cloud-vocabulary law is CRITICAL (the 2026-07-02 UFO sweep: never disc/plate/
  saucer/metallic/hovering — describe cloud structure as moist layered cloud); real meteorology names OK
  (shelf cloud, mammatus, mesocyclone); no tornadoes-hitting-towns (empty wilderness only), no chasers'
  vehicles.

---

## STAGE F — FaeBot (3 paths)

**Bot context.** Painted-fantasy-novel medium (`painted_fantasy_novel`) on every path; bot-local axis
system; gen via `gen-faebot-pool.js` (weighted `subThemes` + `banHumanLanguage` available). Laws:
**peaceful/enchanted register only (moody painted gravitas, not pastel-cute), anti-cartoon/chibi/anime/
Tinkerbell, kodama/faceless/graft-body creature ban (full beautiful faces, real eyes, real hair), no
real-world ethnicity, standing-stones ban (renders cemeteries), character paths registered in
`nudityCheck` + polish skipPaths.** Models flux-1.1 pair. Crowd machinery proven by `fairy-swarm`
(≥6 figures, verb-led event hero, plural prefix opener). Villages prove the place-hero machinery.

### F1. `goblin-market` — [ ]
- **Identity:** the iconic fae NIGHT MARKET — lantern-lit stalls of potions, trinkets, bottled starlight;
  odd little fae merchants; critter customers; market lanes under great roots.
- **Axes (6 + 1 gated):** `market_event` (verb-led crowd beat: haggling over a glowing jar / a stall
  mobbed for moon-plums / a lantern-lighting at dusk — fairy-swarm recipe — 150) · `market_wares`
  (MONEY-SHOT: the one impossible thing for sale — 80) · `merchant_troupe` (varied small fae species,
  full faces + hair, NO kodama/goblins-as-ugly (keep charming-odd) — 100) · `market_setting` (root-arch
  lanes / mushroom-stall rows / bridge markets — 100) · `critter_guests` (60) · `lighting`
  (lantern/fae-light pool — 60); gated `magical_flavor` ~50%.
- **Template hard rules:** ≥6 figures + plural prefix opener (crowd law); the EVENT is the hero, no
  single centered merchant; every human-scale figure NAMED as fae (the unstated-figure→tourist law);
  warm-lantern vs blue-dusk contrast.
- **Wiring:** nudityCheck + polish skip; MVP with chaos off.

### F2. `frost-court` — [ ]
- **Identity:** winter fae, ALIVE and sparkling (explicitly not GothBot's dead frost-garden) — ice-crystal
  fae in silver birch forests, frost-lace wings, frost-flower gardens, aurora through bare branches.
- **Axes (6 + 1 gated):** `frost_fae` (character pool, species-led, frost-crystal features + full faces —
  100 via subThemes for lineage spread) · `winter_wood` (silver birch / frozen falls / snow-hollow —
  120) · `frost_artistry` (MONEY-SHOT: frost-flowers blooming on bark, ice-lace, breath-sparkle — 60) ·
  `winter_light` (aurora / low gold sun / blue-hour — 60) · `candid_action` (winter beats: skating a
  frozen pool, coaxing frost-blooms — 100) · `foreground_anchor` (60); gated `companion` ~40%
  (winter critters: ermine, snow-owl, white stag).
- **Template hard rules:** ALIVE + warm-spirited despite cold (arctic-village law: warm accents beat
  cold); never cursed/dead/mourning; anti-Elsa (no named-IP resemblance, fae anatomy leads).

### F3. `spirit-beasts` — [ ]
- **Identity:** enchanted ANIMALS as heroes — a white stag with blossoming antlers, moss-backed bear,
  ember-tailed spirit foxes, luminous owls (pure magical animals; NOT beast-men — Kevin's ban was fusing
  animals onto the elder, animal heroes are new ground: confirm with him at MVP verdict).
- **Axes (6 + 1 gated):** `spirit_beast` (species + magical feature, body-plan-anchored per the
  Flux-prior law — real animal anatomy + ONE magical element — 150) · `beast_domain` (its place in the
  forest — 120) · `magical_tell` (MONEY-SHOT: the one supernatural signature — antler-blossoms, mist
  paws, firefly mane — 60) · `candid_action` (drinking at a moon pool, shedding petals mid-stride — 100)
  · `lighting` + `weather` (universals); gated `witness` ~25% (a tiny fae observing at distance).
- **Template hard rules:** REAL animal anatomy carries it (never anthropomorphized, never a face-graft —
  the kodama law); one magical element per beast (restraint = believability).

---

## STAGE G — GothBot (3 paths + 2 config tasks)

**Bot context.** All paths route to `gothbot_neutral` + the rolled look; bot-local archetypes; models
flux-1.1 pair; per-path vibes (dark/nightshade/macabre triad default). Laws: role-only characters, no
gore, elegant-darkness (unsettling but gorgeous), no named IP (bannedPhrases: jack skellington etc.).

### G0. CONFIG FIRST — expand the look register — [ ]
`seeds/gothbot_look_register.json` has only 3 looks (all inked/dark-anime). The bot's painterly-oil,
hyperreal-Weta, and victorian-canvas registers became UNREACHABLE when mediums were retired into the
looks system. Add 3-5 looks (pure rendering-style entries, no subject anatomy — ChibiBot L1b law):
gothic oil-painting (Crimson-Peak richness), hyperreal cinematic (Weta-grade), victorian storybook
ink-wash, candlelit chiaroscuro oil, muted gothic watercolor. MVP: 6 renders across 3 paths per new
look; Kevin verdict; this multiplies every existing path.

### G1. `masquerade-ball` — [ ]
- **Identity:** a grand gothic masquerade — candlelit ballroom, vampires in ornate masks and couture
  frozen mid-waltz, chandeliers, mirrored walls. First crowd/event path.
- **Axes (6 + 1 gated):** `ball_moment` (verb-led ensemble beat: the midnight unmasking, a waltz turn,
  the toast — 120) · `mask_couture` (MONEY-SHOT: mask + gown/frock pairings, wardrobe DNA at ensemble
  scale — 100) · `ballroom` (interior grandeur — 100) · `candle_light` (60) · `crowd_texture` (the
  living mass, not itemized — steambot-spectacle law — 60) · `composition` (40); gated `dark_omen` ~35%
  (a mirror that reflects wrong, bats through a window).
- **Template hard rules:** crowd as textured mass + 2-3 foreground couples readable; every figure masked
  & dressed (unstated-figure law); elegant, never gory; NSFW-clean couture.
- **Vibes:** dark/nightshade/macabre + shimmer (couture glint).

### G2. `dark-familiars` — [ ]
- **Identity:** gothic creatures at beauty-first intimacy — a murder of crows on cathedral gargoyles, a
  raven with jewel eyes on a tombstone, black cats in a witch's window, white wolves in graveyard snow.
- **Axes (5 + 1 gated):** `familiar` (species + striking detail, REAL animal anatomy — 100) ·
  `perch_setting` (gothic staging — 120) · `eye_catchlight` (MONEY-SHOT: the intelligent gleam — 40) ·
  `lighting` + `atmosphere` (universals); gated `omen_detail` ~40% (a dropped key in its beak, a candle
  it watches).
- **Template hard rules:** creature fills 40-60%, beauty-first (glossy feathers, elegant menace);
  front-on bird faces are safe (corvids read well) but verify at MVP (anthropomorphization law).

### G3. `elegy` — [ ]
- **Identity:** intimate cemetery romance — weeping-angel statuary, a veiled mourner at midnight, roses
  on marble, candle offerings, mist between headstones. Moonlit-maiden's mood pointed at a PLACE.
- **Axes (5 + 1 gated):** `elegy_scene` (statuary/grave-garden hero — 120) · `mourning_detail`
  (MONEY-SHOT: the human trace — fresh roses, a burning candle, a letter under stone — 50) ·
  `veiled_figure` 40%-gated (a single distant mourner, always veiled/turned) · `moon_mist_light` (50) ·
  `composition` (40) + universal atmosphere.
- **Template hard rules:** romantic-melancholy, NEVER horror/decay-porn; statuary beautiful not creepy;
  figure optional and small.

### G4. DECISION — revive `the-haunting` — [ ]
The parked wraith/spectre path is the roster's only ghost concept. Flag to Kevin; if yes, rebuild lean
on the looks system (it was the one look-excluded path).

---

## STAGE H — ChibiBot (4 paths)

**Bot context.** Cute critters, NO humans ever; `chibibot_neutral` + 12-look register auto-applies to
new paths (CHIBI_LOOK_PATHS is derived — a new path is look-enabled by default); models default weights
(ultra-lock via `modelByPath` for outing-family paths); vibes = cute list (no surreal). The outing
family shares ONE archetype (`CHIBIBOT_CREATURE_OUTING`) — new outings are 4 bespoke pools + a path
file + wiring. Villages share the 10-axis village shape. Pool entries: activity pools stay
SUBJECT-AGNOSTIC ("they/their", no species) so the cast axis stays free; ambiguous ride-words drift
literal ("teacup-RIDE car"); "distant crowd" → "tiny chibi-ANIMAL visitors".

### H1. `creature-autumn-day` — [ ] (cheapest win — do first)
- **Build:** outing-family clone of `creature-snow-day`: 4 bespoke pools — `activity` (leaf-pile
  jumping, pumpkin-patch picking, apple-basket hauling, acorn-stash races, cider-stand — 60 via bucket
  gen) · `setting_detail` (pickN 3: red-gold canopies, leaf-drifts, pumpkin rows — 60) · `prop` (40) ·
  `surprise_element` (40). Shared `creature_group` pickN 3 from CUTE_CREATURES_UNIFIED. Ultra lock.
- **Mandates:** golden-autumn palette; sweater-weather cozy; real-world place fully built filling frame.

### H2. `creature-lantern-festival` — [ ]
- **Build:** outing-family clone at NIGHT: `activity` (lighting a paper lantern, festival games, sharing
  taiyaki-free festival snacks-as-props, watching the sky-lantern release — 60) · `setting_detail`
  (pickN 3: lantern strings, stall glow, reflections on water — 60) · `prop` (40) · `surprise_element`
  (MONEY-SHOT entries: the mass sky-lantern release, a lantern canal — 40). Ultra lock.
- **Mandates:** warm-lantern vs blue-night contrast (twilight-village palette law); food is PROP never
  cast (YumBot boundary); no legible text on lanterns.

### H3. `sky-village` — [ ]
- **Build:** 7th village — clone the village 10-axis shape with biome = cloud kingdom: `village` (cottages
  on cloud-tufts, rainbow bridges, balloon docks, star-lamp posts — 100) · `village_detail` (pickN 3 —
  60) · resident tags BIRD/FANTASY/ANY · `time_of_day` (50) · `surprise` + `phenomenon` 60%-gated ·
  universals. Wide establishing shot, architecture 70-85%, solo resident 8-15% scale-prover, output
  OPENS with creature (village law).
- **Watch-fors:** clouds-as-ground must read soft-solid-whimsical (storybook physics is fine on this bot);
  no airplanes/tech.

### H4. `creature-school` — [ ]
- **Build:** interior group path cloned from the outing shape pointed indoors: `activity` (art class,
  show-and-tell with a glowing pebble, recess tumble, naptime mats, tiny chalkboard lesson taught BY a
  critter — 60) · `classroom_detail` (pickN 3: acorn desks, leaf notebooks, crayon jars — 60) · `prop`
  (40) · `surprise_element` (40); creature_group pickN 3. Ultra lock.
- **Mandates:** teacher is a CREATURE (no humans law); "children" words banned (creature kids only —
  the CHILD-purge law); warm interior light.

---

## STAGE I — MangaBot (4 paths)

**Bot context.** Anime bot; new paths route to `mangabot_anime_neutral` (look-enabled, 12 anime looks,
`lookOverride()` header) unless their identity IS a style. Laws: **culture-coded pools from gen #1
(named anime-canon touchpoints in recipes, NEVER generic-genre vocabulary), role-only (no named
characters ever, canon names are register anchors in recipes only — never in output), camera-framing
MANDATORY block on every path with a camera axis, anti-back-to-camera, polish OFF for scene paths.**
Models: 5-Flux pool. Scene-led paths clone the anime-village / samurai-era shape.

### I1. `anime-rain` — [ ]
- **Identity:** the Garden-of-Words register — rain-soaked shrine steps, shared-umbrella moments, puddle
  reflections, hydrangeas in June rain, rain on train windows. The RAIN is the hero.
- **Axes (7 + 1 gated):** `rain_scene` (place + rain interplay, canon: Garden of Words / Shinkai / June
  tsuyu — 200) · `rain_play` (MONEY-SHOT: how rain catches light — beads on glass, silver streaks
  against dark green, ripple rings — 60) · `figure_moment` 60%-gated-as-slot (umbrella figure, small,
  engaged not gazing — 80) · `water_reflection` (60) · `weather_air` (50) · `camera_framing` (MANDATORY —
  40, framing-as-LAW audited) · `emotional_dna` (30); gated `rain_event` ~30% (downpour break, sun
  shower).
- **Template hard rules:** lush saturated greens + grey-silver light (the register's signature); figure
  optional and ENGAGED; no sadness-porn (quiet beauty).

### I2. `anime-trains` — [ ]
- **Identity:** THE anime motif — countryside single-car trains at golden hour, level-crossing moments
  (signal lights, wind, held breath), train interiors with sunset windows, sea-side track curves
  (5cm/sec + Spirited-Away sea-train lineage).
- **Axes (7 + 1 gated):** `train_scene` (crossing / interior / platform / coastal curve / rice-field
  line — 200) · `light_moment` (MONEY-SHOT: sunset through windows, crossing-signal red in blue dusk —
  60) · `season_air` (50) · `passenger_glimpse` 50%-gated (a single seated figure, engaged) ·
  `landscape_beyond` (100) · `camera_framing` (MANDATORY — 40) · `emotional_dna` (30); gated
  `train_event` ~30%.
- **Watch-fors:** ZERO overlap with DreamBot `dream-express` (that one is impossible-worlds, never
  Japan-realistic — say so in both templates). Trains are real JR-style rolling stock, no IP liveries.

### I3. `winter-anime` — [ ]
- **Identity:** snow-country anime — first-snow streets, snow festivals with ice lanterns, kotatsu-window
  glow seen from outside, shrine torii in snowfall, breath-clouds under station lights.
- **Axes (7 + 1 gated):** `winter_scene` (200, canon: Erased / Laid-Back Camp winter / Yuru trip) ·
  `snow_state` (MONEY-SHOT: fat flakes in lamplight / fresh powder / blizzard blur — 50) · `warm_glow`
  (the warm-vs-cold contrast source — windows, vending machines, lanterns — 50) · `figure_moment`
  50%-gated · `camera_framing` (MANDATORY) · `emotional_dna` · `weather_air`; gated `winter_event` ~30%
  (festival fireworks over snow, ice-lantern lighting).
- **Note:** shrine/torii allowed here (cultural-respect mandate — reverent, no humans-in-worship
  close-ups); MangaBot's places cluster already permits built Japan.

### I4. `night-touge` — [ ]
- **Identity:** Initial-D lineage — 90s Japanese sports cars drifting mountain passes at night, neon
  wangan highways, vending-machine glow pit stops, headlight trails through hairpins. First vehicle path.
- **Axes (6 + 1 gated):** `touge_scene` (pass / hairpin / tunnel / wangan / parking-area meet — 150) ·
  `hero_car` (era-coded NON-IP descriptions: white coupe with pop-ups, boxy silver sedan — evoke never
  name models? CHECK with Kevin at MVP: real model names (AE86/RX-7) are IP-adjacent; default to
  morphological descriptions — 80) · `motion_signature` (MONEY-SHOT: drift angle + tire smoke + light
  trails — 50) · `night_light` (sodium lamps, dash glow, city bowl below — 50) · `camera_framing`
  (MANDATORY: chase cam / guardrail pan / tunnel burst — 40) · `emotional_dna`; gated `street_detail`
  ~40% (vending machines, kanji-free signage).
- **Template hard rules:** anime cel register (the look system carries it); speed READS (motion lines OK
  in anime idiom); no crashes, no street racing glamorization of danger beyond genre norm; no legible text.

---

## STAGE J — OceanBot (4 paths)

**Bot context.** Lean 4-axis house style (1-2 path slots + `camera_framing` + universal
lighting/atmosphere); every template stamps CAMERA FRAMING (LAW) + a multi-tier composition mandate +
the 60-90-word single-prompt output contract + the anti-anachronism guard. **Framing pools are audited
as a SET at birth (the 2026-06-30 law): zero subject-dissolving entries.** Every scene seed needs a
readable HERO (the subject-less-phenomenon law); recipes must MANDATE the hero or regen reintroduces
dullness. 4 standard mediums rolled; models flux-1.1 pair.

### J1. `kelp-forest` — [ ]
- **Identity:** the third ecosystem register (bright reef / dark abyss / GREEN kelp cathedral) — god-rays
  through giant-kelp columns, sea otters wrapped in fronds, seals weaving, garibaldi flashes, sunlit
  canopy from below.
- **Axes (2 path + LAW + universals):** `kelp_scene` (hero: animal-led moments IN the kelp — otter
  wrapping pup, seal spiral, shark silhouette beyond the fronds — 200; ALWAYS an animal or monumental
  kelp-architecture hero) · `canopy_light` (MONEY-SHOT: god-ray shafts, surface shimmer through canopy,
  green-gold gradients — 50) · `camera_framing` (audited set — 40).
- **Recipe mandates:** favor active behavior over cruising (the OceanBot dullness law); kelp described
  as kelp (columns/fronds/canopy — no "cathedral nave" enumeration that renders architecture: the
  forest-symmetry law applies underwater too).

### J2. `feeding-frenzy` — [ ]
- **Identity:** the sardine-run / bait-ball spectacle — a silver bait-ball sphere with dolphins spiraling,
  sharks rising, gannets plunging in bubble trails, a whale lunge finale. Peak NatGeo action.
- **Axes (3 path + LAW + universals):** `frenzy_event` (hero: the multi-actor beat — engagement-pool law:
  every entry NAMES 2-4 actors + their interaction — dolphins herding while gannets rain in — 200) ·
  `bait_ball_state` (MONEY-SHOT: tight silver sphere / split vortex / raining fish-scales glitter — 40)
  · `water_column_light` (50) · `camera_framing` (40).
- **Template hard rules:** minimum 2 predator species visible + the bait mass; motion everywhere but ONE
  readable focal predator (readable-focus bar); PG nature-doc — feeding not gore (no blood clouds).
- **Watch-fors:** this path lives or dies on the engagement pool — hard-ban solo-hero entries in the
  recipe (mech-skyships law).

### J3. `lighthouse-storms` — [ ]
- **Identity:** the Jean-Guichard register — a lighthouse taking a monster wave, keeper's light glowing
  through spray, wave wrapping the tower, calm-dawn aftermath variants (~25%).
- **Axes (3 path + LAW + universals):** `lighthouse_scene` (hero: tower + sea-state + moment — 150,
  ~75% storm / ~25% calm-after) · `wave_impact` (MONEY-SHOT: the wrap, the detonation, spray over the
  lantern room — 40) · `storm_sky` (50) · `camera_framing` (40).
- **Template hard rules:** the LIGHT stays lit (warm beam vs grey fury — the emotional core); NO keeper
  figure at the door (the famous photo has one — ours stays uninhabited, unstated-figure law); tower
  reads weathered-real, no fantasy.
- **Note:** human-built structure is precedented on the naval-lore side (ships/harbors) — this extends it.

### J4. `sea-caves` — [ ]
- **Identity:** Blue-Grotto register — cathedral sea-cave light beams, hidden lagoons behind rock arches,
  glowing turquoise water-windows, shafts from ceiling skylights. Serene counterpart to coastal-power.
- **Axes (2 path + LAW + universals):** `cave_scene` (hero: cave architecture + water + the light event —
  180; a monumental formation or a creature (seal/rays in the beam) anchors every entry) ·
  `light_window` (MONEY-SHOT: the glowing underwater entrance, the ceiling shaft, the electric-blue
  water-glow — 50) · `camera_framing` (40).
- **Watch-fors:** "glowing water" is REAL here (sunlight through submerged entrances) — phrase physically
  ("sunlight entering below the waterline lights the pool electric blue") so it never drifts biolum-fantasy.

---

## STAGE K — PixelBot (3 paths)

**Bot context.** 16-bit SNES-era pixel screenshot lock (global prefix); NO IP names; declarative
archetype system; per-path `vibesByPath` REQUIRED (this bot is fully per-path); camera locked per genre;
40%-gated 4th slot is the house pattern; two-pass polish ON here (unusual — keep unless renders lose
axis language); 6-Flux model pool. pixel-cyberpunk is DEAD (Flux can't hold 16-bit cyberpunk) — nothing
in these paths may lean cyberpunk.

### K1. `pixel-item-shop` — [ ]
- **Identity:** the beloved genre interior — potion-shop counters (Moonlighter/Recettear), cozy
  tavern/inn common rooms, blacksmith forges, magic libraries; shopkeeper sprite + adventurer customer.
- **Axes (3 + 1 gated):** `shop_locale` (shop type + interior layout — 150) · `shelf_density`
  (MONEY-SHOT: countable readable wares — rows of potions, hanging swords, bread stacks — 50) ·
  `keeper_customer_life` (verb-led exchange: haggling, weighing gold, pouring ale — 120) ·
  gated `cozy_phenomenon` 40% (hearth-flicker, cat on the counter, rain on the window).
- **Camera lock:** interior side-view or 3/4-iso (NEVER first-person). Vibes: nostalgic/cozy/whimsical/
  enchanted.
- **Watch-fors:** NO text/signage/price tags (suffix bans text — keep wares pictorial).

### K2. `retro-racing` — [ ]
- **Identity:** the OutRun register — pixel sports car on a coastal highway at sunset, palm parallax,
  dithered horizon bands, mountain switchbacks, desert straights. A whole genre untouched.
- **Axes (3 + 1 gated):** `route_scene` (coast / canyon / dusk city outskirts / beach straight — 150) ·
  `horizon_bands` (MONEY-SHOT: the dithered sunset gradient + parallax layers — 40) · `race_moment`
  (verb-led: cresting a hill, drifting a sweeper, overtaking — 100) · gated `roadside_detail` 40%
  (palm rows, billboards-without-text, checkpoint arches).
- **Camera lock:** behind-the-car chase view (the genre signature) with occasional side-profile;
  horizontal format energy. Vibes: nostalgic/cinematic/epic/voltage.
- **Watch-fors:** car described morphologically (low red coupe), no real models; NOT MangaBot's
  night-touge (that's anime cel night; this is 16-bit sunset arcade — different bot, different medium,
  say so in the recipe).

### K3. `pixel-overworld` — [ ]
- **Identity:** the classic JRPG world-MAP screen — top-down tile continents, tiny walled towns, mountain
  ranges, forests as tile clusters, a ship sprite on tile sea, cloud shadows.
- **Axes (3 + 1 gated):** `map_region` (the geography composition: archipelago / twin continents /
  inland sea / volcanic isle chain — 150) · `map_features` (pickN 2: walled town, tower, bridge, port —
  60) · `traveler_sprite` (the tiny party/ship/airship crossing it — 60) · gated `map_event` 40%
  (a storm tile cluster, a glowing dungeon entrance).
- **Camera lock:** STRAIGHT top-down world-map view (distinct from classic-jrpg's 3/4 town view and
  epic-vista's side parallax — this is the map SCREEN). Vibes: nostalgic/enchanted/epic.
- **Watch-fors:** the tile-grid must read (chunky repeating terrain tiles); no UI/menus/labels.

---

## STAGE L — StarBot (3 paths)

**Bot context.** Sci-fi awe; new scene paths follow the self-lit pattern (`universal: []`, bespoke
lighting inside the pools) cloned from impossible-sky / ring-habitat; chaos + polish skipped; models
flux-1.1 pair via `modelByPath`; medium `starbot_hyperreal`. THE law for this stage: **vocabulary
literalization** (the spacewalk 10-round lesson) — scan every noun for terrestrial priors.

### L1. `event-horizon` — [ ]
- **Identity:** the black-hole close-pass — Gargantua-style glowing accretion disk, gravitational
  lensing warping the starfield into an Einstein ring, a tiny ship silhouette against the glow.
- **Axes (5 + 1 gated):** `hole_presentation` (disk angle/structure: edge-on lensed arc / face-on spiral
  / polar jet — 80) · `lensing_effect` (MONEY-SHOT: the warped-starfield ring, doubled disk image,
  photon ring — 50) · `witness_scale` (tiny ship / station / probe silhouette — 60) · `disk_light`
  (blazing white-gold inner edge → deep red outer — 40) · `space_backdrop` (60); gated `infall_event`
  ~35% (a star being shredded into a glowing stream).
- **Template hard rules:** physically-inspired grandeur (Interstellar register) — the disk is the ONLY
  light; ship stays tiny (scale-prover law); no cartoon "whirlpool."
- **Watch-fors:** "hole/vortex/whirlpool" literalize badly — lead with "black hole with a blazing
  accretion disk"; "ring" is safe (we want rings).

### L2. `gas-giant-skies` — [ ]
- **Identity:** INSIDE a gas giant's atmosphere — cloud formations at continental scale, floating
  harvester platforms/cities, an Earth-sized storm on the horizon, lightning below the cloud deck.
- **Axes (5 + 1 gated):** `cloudscape` (the formation: banded walls, towering thunderhead ranges,
  clearing shafts down to darker decks — CLOUD-NATIVE vocabulary ONLY — 150) · `float_presence`
  (harvester city / balloon outpost / skimmer fleet, small against the sky — 80) · `storm_titan`
  (MONEY-SHOT: the horizon-filling storm eye / lightning sheet below — 50) · `atmo_light` (amber/rose/
  methane-blue depth lighting — 50) · `sky_above` (thin high haze, a moon through it — 40); gated
  `atmo_event` ~35%.
- **CRITICAL vocabulary law:** NO "canyon/cliff/valley/mountain" nouns (they render ROCK — the spacewalk
  literalization list); say cloud-walls, cloud-chasms→"gaps between cloud banks", thunderhead ranges.
  NO rigid-object nouns on clouds (disc/plate/dome/metallic/hovering → UFO law).
- **Differentiation:** impossible-sky looks UP from a surface; orbital-descent looks DOWN from space;
  this lives IN the weather.

### L3. `first-contact` — [ ]
- **Identity:** the arrival EVENT — a colossal ship hanging over a landscape/city-lights plain, a beam
  of light on a clearing, silhouetted witnesses at civilization scale (Arrival register).
- **Axes (5 + 1 gated):** `arrival_form` (the visitor: monolithic shard, ring slowly turning, seed-pod
  fleet — 100) · `contact_stage` (the moment: first shadow crossing, the beam touching down, the silent
  hover at dawn — 100) · `witness_scale` (MONEY-SHOT: the human-scale witnesses — a road of stopped
  cars' lights, a field of upturned silhouettes at distance — 60) · `earth_setting` (plains / coast /
  city-glow horizon — 80) · `event_light` (50); gated `response_detail` ~30% (searchlights, a lone
  drone rising).
- **Template hard rules:** AWE not invasion (no destruction, no weapons fire); witnesses are distant
  silhouettes (no faces); the SCALE CONTRAST is the whole shot.
- **Watch-fors:** this is StarBot's first path with implied present-day Earth — keep it timeless
  (no logos, no readable tech era).

---

## STAGE M — SteamBot (4 paths)

**Bot context.** All paths route to `steambot_neutral` + the 6-look register (STYLE-AUTHORITY override
in `buildBrief`) — **add each new path to `STEAMBOT_LOOK_PATHS` + `mediumByPath` + `modelByPath`**
(flux-1.1 pair). Lean axis paths (1-3 bespoke slots + universals) are the house style for scene paths.
Laws: gear/rivet/steam surface density is the signature; no named IP; grounded-Victorian (the de-cheese
arc — no romance-cover cheese); scene paths lock vibe `cinematic`.

### M1. `nautilus-depths` — [ ]
- **Identity:** 20,000-Leagues underwater steampunk — an ornate brass submarine gliding past glowing
  jellyfish swarms, great porthole light spilling into dark water, kraken silhouette gated, occasional
  interior porthole-view variants (~25%).
- **Axes (4 + 1 gated):** `submersible` (the vessel: riveted brass hull families, name the massing per
  entry — 100) · `deep_encounter` (what it passes: jelly swarms, whale shadow, drowned ruin, biolum
  reef — 150) · `porthole_glow` (MONEY-SHOT: warm lamplight vs deep teal-black — 50) · `depth_light`
  (50); gated `leviathan_shadow` ~40% (kraken/serpent silhouette at the light's edge).
- **Template hard rules:** brass reads BRASS underwater (specular highlights); ocean depth is co-hero;
  interior variants show the grand salon porthole (Nemo register) with no crew faces.
- **Watch-fors:** OceanBot boundary — this is steampunk MACHINE-in-sea, never NatGeo sealife (the
  encounter pool stays fantastical-Victorian).

### M2. `celestial-observatory` — [ ]
- **Identity:** Victorian astronomy — colossal brass telescope domes open to the night, orrery rooms with
  slow-spinning planet models, star-chart tables under gaslight, a comet visible through the dome slit.
- **Axes (4 + 1 gated):** `observatory_space` (dome hall / orrery room / rooftop terrace array — 120) ·
  `great_instrument` (the hero machine: the long brass refractor, the room-filling orrery — 80) ·
  `sky_through_dome` (MONEY-SHOT: the slit of night — comet, moon, aurora, star field — 50) ·
  `brass_detail` (pickN 2 — 60); gated `astronomer_presence` ~40% (a small figure at the eyepiece,
  from behind).
- **Template hard rules:** interior warmth vs cold night sky contrast; REAL night sky through the slit
  (no fantasy planets — this is Victorian Earth); instrument fills 30-50%.

### M3. `clocktower-heart` — [ ]
- **Identity:** inside a cathedral-scale clock (Hugo register) — giant gears in slow motion, pendulum
  arcs, light through the translucent clock face, catwalks and ladders for scale.
- **Axes (4 + 1 gated):** `mechanism_hall` (the space: behind-the-face gallery, gear canyon→"gear hall",
  pendulum well — 100) · `gear_choreography` (MONEY-SHOT: the one readable motion — a tooth engaging,
  the escapement tick — 50) · `face_light` (glowing translucent dial as the light source — 40) ·
  `scale_prover` (catwalks, a keeper's lantern, pigeons — 40); gated `hour_event` ~35% (the strike:
  bells, everything in motion).
- **Watch-fors:** avoid "canyon" (rock prior); gears must read MECHANICAL not decorative (curio law:
  unmistakably built).

### M4. `skydock-harbor` — [ ]
- **Identity:** the airship PORT — docked fleets at brass gantry towers, cargo cranes swinging crates,
  departure crowds on platforms, lamplit fog rolling through the moorings.
- **Axes (4 + 1 gated):** `harbor_vista` (the dock architecture + fleet arrangement — 120) ·
  `dock_activity` (verb-led multi-actor beats: a liner casting off, cargo net mid-swing — engagement-pool
  law — 100) · `mooring_light` (lamps + fog + dawn/dusk — 50) · `crowd_texture` (living mass, spectacle
  law — 40); gated `departure_event` ~40% (the flagship lifting away, confetti-free steam-whistle send-off).
- **Differentiation:** airship-skies is in-flight; this is the PLACE. Ships at rest + human bustle.

---

## STAGE N — TinyBot (3 paths)

**Bot context.** Function-form paths (NO archetype dir) — each new path = a hand-written builder in
`paths/`, pools registered in `pools.js`, seeds in `seeds/`, wired into `paths[]` + chaos-allow +
sensory `scene` context. Two wings: the tilt-shift stack (TILT_SHIFT + OBSESSIVE_MICRO_DETAIL +
CLEVER_CUTE_WHOA + NO_HUMANS + IMPOSSIBLE_BEAUTY + BLOW_IT_UP + variety axes) and the resin-fairytale
wing (medium-locked handmade-resin, palette-locked, drops variety axes + BLOW_IT_UP). Models flux-1.1
pair. Bug to dodge: `--target N` works, `--total` silently ignored on some gen scripts — verify counts.

### N1. `tiny-winter-village` — [ ]
- **Identity:** the missing village season — snow-dusted miniature village, cotton-drift snowbanks,
  frozen resin pond (skating critter ~35%-gated), warm amber windows vs blue dusk.
- **Build:** resin-wing clone of `enchanted-village`: medium-locked handmade-resin/storybook, 5-layer
  palette architecture inverted for winter (white-blue village body / warm window glow / deep dusk sky /
  snow ground / bare-branch accents); pool `tiny_winter_village` (120) + optional TINY_CREATURES gate.
- **Mandates:** warm-glow-vs-cold contrast is load-bearing (arctic-village law); snow reads as CRAFT
  material (cotton, glitter-frost, resin ice) not photoreal snow.

### N2. `tiny-night-market` — [ ]
- **Identity:** a miniature lantern night-market street — glowing food stalls, string lights, tiny wares
  in countable detail, steam wisps off the stalls.
- **Build:** tilt-shift-wing (full standard stack): pool `tiny_night_market` (150: stall types + lane
  layouts) + `market_glow` money-shot pool (40: lantern strings, paper-lamp rows, stall-light pools) +
  TINY_CREATURES gate ~50% (a critter vendor/customer).
- **Mandates:** commerce density = countable detail (the bot's whole bar); light sources are the craft
  story (LED-wire fairy lights as "lanterns"); no legible signage.

### N3. `tiny-carnival` — [ ]
- **Identity:** handcrafted miniature fairground at dusk — striped big top, tiny ferris wheel, carousel,
  game stalls, popcorn-light glow.
- **Build:** tilt-shift-wing: pool `tiny_carnival` (150: ride + midway compositions) + `ride_motion`
  money-shot pool (40: the wheel mid-turn, carousel blur-frozen) + TINY_CREATURES gate ~45%.
- **Differentiation:** vs BrickBot theme-park (brick) and ChibiBot amusement outings (creature-band
  activity) — this is the CRAFT MODEL of a fairground, materials visible (matchstick struts, foil
  streamers), critters incidental.

---

## STAGE O — ToyBot (3 paths)

**Bot context.** Real physical toys, cinematic story stills; per-path bot-only mediums via
`mediumStyles` + `mediumByPath` (new mediums are code-only, no DB); models locked flux-1.1 pair 50/50.
THE house recipe for any multi-figure path (3 load-bearing layers, all needed): **verb-led pool entries
naming a shared object/event (no pose language) + explicit composition lock ("EXACTLY 3-5 figures…NO
single hero centered") + PLURAL medium opener ("The X's in this scene are…").** STORY_BEAT_MANDATE +
real-world staging + anti-human-leak block on figure paths. Keep new templates lean (the instruction-
bloat law).

### O1. `board-game-world` — [ ]
- **Identity:** toys adventuring ACROSS a giant board game — Candy-Land-style path worlds, chess-piece
  armies mid-clash, dice as boulders, card castles, spinner wheels as rides.
- **Medium:** rotate the mixed roster (toybox-chaos precedent) OR a new `board_game_world` medium
  (glossy cardboard + printed-board textures + molded plastic) — decide at MVP, start with the new medium.
- **Axes (5 + 1 gated):** `board_world` (the game-surface geography: winding path tiles, checkered
  plains, card ramparts — 150) · `toy_cast` (pickN 3-4 from TOYBOX_TOY_BUCKET — interaction mandate) ·
  `game_piece_drama` (MONEY-SHOT: dice mid-tumble as boulders, a chess knight rearing — 60) ·
  `story_beat` (reuse TOYBOX storytelling pool) · `camera` + `lighting`; gated `table_context` ~35%
  (the real tabletop edge, a mug horizon).
- **Mandates:** board-as-terrain must READ (printed path squares, card textures); no readable text on
  the board (blank-face cards/tiles).

### O2. `wooden-toy-land` — [ ]
- **Identity:** vintage wooden toys — block-stack cities, pull-along animals on wheels, peg people,
  Noah's-ark parades, stacking-ring trees; visible wood grain + chipped paint.
- **Medium:** new `wooden_toys` medium (solid turned-and-cut wood, painted detail, grain + wear;
  PLURAL opener: "The wooden toys in this scene are…").
- **Axes (5 + 1 gated):** `wooden_scene` (verb-led group beats in a built block-world — 150) ·
  `block_architecture` (the constructed setting: arch bridges, stacked towers — 80) · `craft_signature`
  (MONEY-SHOT: wheel pegs, grain swirls, paint chips — 40) · `story_beat` · `camera` + `lighting`;
  gated `playroom_context` ~35%.
- **Mandates:** 3-5 figures composition lock; everything WOOD (no plastic/fabric cross-contamination —
  material purity is the identity).

### O3. `tin-toy-parade` — [ ]
- **Identity:** wind-up lithographed tin — retro tin robots mid-march, rocket-ship races, tin animals
  with visible wind-up keys, scratched-litho patina, sparking friction wheels.
- **Medium:** new `tin_toys` medium (lithographed printed-tin surfaces, soldered seams, wind-up keys;
  PLURAL opener).
- **Axes (5 + 1 gated):** `tin_scene` (verb-led: a robot parade crossing the kitchen floor, a rocket
  race down a hallway — 150) · `litho_detail` (MONEY-SHOT: printed-on dials and rivets, patina scratches
  — 40) · `wind_up_motion` (keys turning, sparks from friction drives — 40) · `story_beat` · `camera` +
  `lighting`; gated `retro_context` ~35% (linoleum floors, 50s kitchen edges).
- **Mandates:** 3-5 figures; era register nostalgic-warm (pairs with the bot's nostalgic vibes).

---

## STAGE P — YumBot (3 paths)

**Bot context.** Kawaii food cast — every face is a food; NO humans (hard-banned everywhere); 25-look
register leads every prompt via `YUMBOT_LOOK_OVERRIDE`; two medium anchors: `yumbot_food_neutral`
(face-on-object) and `yumbot_food_character` (embodied chibi bodies, ultra-locked). Bucket paths share
the 8-slot shape (scene / camera / lighting / palette / time_of_day / companion / decor_accents ×3 /
atmospheric_accent) with per-bucket pools; `yumbotBucketGen.js` does equal-share sub-theme seeding.
Gotcha: duplicate `promptPrefixByMedium` keys silently overwrite (merge into one map).

### P1. `kawaii-drinks` — [ ]
- **Identity:** the drink cast takes the lead — boba squad with tapioca-pearl faces, latte-art smiles,
  soda floats with cherry hats, a teapot pouring for teacup kids, smoothie trio, ramune bottles.
- **Build:** bucket-path clone (fast-food/carnival-food model): cast-restricted to DRINKS; 8 bespoke
  pools (`yumbot_drinks_{scenes,cameras,companions,decor,lighting,palettes,time_of_day,
  atmospheric_accent}`), scenes tagged by drink family (boba / coffee / soda / tea / smoothie / floats)
  via bucket gen at `perSubTheme` 4 for MVP. Medium `yumbot_food_neutral`; flux-dev base.
- **Mandates:** cast is DRINKS only (no dessert hosts — the fruits-veggies cast-purity law); condensation
  /steam/fizz are the texture signatures; faces ON the vessels/liquid surfaces.

### P2. `holiday-sweets` — [ ]
- **Identity:** seasonal treats with a rotating `holiday` axis — Christmas cookie decorating, Halloween
  trick-or-treat candies, Valentine chocolates, Easter-egg gardens, birthday-cake fireworks, New-Year
  mochi.
- **Build:** ensemble-path shape (5-friend family portrait cluster, cottagecore-nature clone): pools
  `holiday_scene_type` (tagged per holiday — equal share via subThemes, THE law for this pool) ·
  `food_inhabitants` (×5 from FOOD_CATALOG with a new HOLIDAY tag family) · `holiday_signature`
  (MONEY-SHOT: the decorating moment, the candy pail spill — 60) · backdrop/terrain/sky/camera/lighting/
  time_of_day + `night_mode` gate 0.2 → ultra (Halloween/NYE want night).
- **Mandates:** 5 named food-friends; holiday reads without text (no banners with words); spooky stays
  cute (no horror on Halloween entries).

### P3. `food-village` — [ ]
- **Identity:** place-as-hero food TOWN wide shot — gingerbread cottages, waffle roofs, pretzel bridges,
  frosting-river main street, macaron cobblestones; food-character residents as 8-15% scale-provers.
- **Build:** village shape (ChibiBot village law adapted): `village` (the edible architecture composition
  — 150) · `village_detail` (pickN 3 — 60) · `resident_activity` (small, subject-agnostic — 60) ·
  `time_of_day` (40) · camera/lighting + `night_mode` gate 0.2; medium `yumbot_food_neutral`;
  ultra lock (rich establishing shots).
- **Differentiation vs candy-fantasy:** candy-fantasy is prop-locked compositions with a 5-character
  cast; THIS is a wide establishing VILLAGE (architecture 70-85%, output opens with resident then
  village — the village law). Everything edible (no real wood/stone — candy-fantasy's material law).

---

## Cross-stage boundary contracts (so parallel agents don't collide)

- DreamBot `dream-express` = impossible worlds, never realistic Japan ←→ MangaBot `anime-trains` =
  real-Japan anime, never impossible worlds.
- PixelBot `retro-racing` = 16-bit sunset arcade ←→ MangaBot `night-touge` = anime cel night drift.
- TinyBot `tiny-carnival` (craft model) ←→ BrickBot `theme-park` (brick) ←→ ChibiBot amusement outings
  (creature-band activity).
- FaeBot `frost-court` (alive winter magic) ←→ GothBot `the-frost-garden` (cursed dead frost) ←→
  EarthBot `winter-wonder` (real photography) ←→ TinyBot `tiny-winter-village` (craft miniature).
- SteamBot `nautilus-depths` (Victorian machine fantasy) ←→ OceanBot (NatGeo real sealife + age-of-sail).
- YumBot food is always the CAST ←→ ChibiBot food is always a PROP.

## Definition of done (per stage)

1. Every path: MVP-25 pools, 5-6 posted renders, Kevin verdict logged, pools scaled, path committed
   (explicit pathspec, staged-diff read), `paths[]` entry included ONLY in the post-approval commit.
2. Playbook updated with the stage's lessons (per-bot section + any cross-bot law).
3. This file's status markers updated.
4. `node scripts/verify-bot-cycles.js` sanity after the bot's roster change (shuffle-bag is
   roster-robust by design, but verify).
