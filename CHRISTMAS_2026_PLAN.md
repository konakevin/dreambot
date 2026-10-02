# Christmas 2026: nightly pools, bot sets and the build plan

**Status (2026-10-01): brainstorm complete, nothing built.** Christmas has ZERO rows in every holiday table and no bot
has a `seasonalPaths.christmas` set. This doc carries every idea, the audit behind it, the rules it must follow and
the build order, so the next agent can start building without re-deriving anything.

**Kevin's picks board:** https://claude.ai/artifact/J6Ss8tE2rrrPvUmTR8vQeE (private, Kevin's). Every idea below has
the same id as on the board. Kevin marks each Keep / Maybe / Cut and can leave a note. Read his picks back with the
`ArtifactData` tool: `action: "list"`, `url: <board>`, `collection: "picks"`. Each document id is the idea id
(`n-lights--house-lit`), with fields `vote` (`keep` | `maybe` | `cut` | null) and `note` (string). **Report the
result first** ("Keep 61, Maybe 20, Cut 14") before acting on it. Ideas Kevin hasn't marked are undecided, not
approved.

Id prefixes: `n-` nightly pool idea, `d-` Christmas Day (Dec 25), `b-` bot path, `q-` decision.

---

## 0. Start here (next agent)

1. Read this whole doc, then `CLAUDE.md`. Before ANY bot work, read `BOT_SCENE_QUALITY_PLAYBOOK.md` in full (CLAUDE.md
   STOP rule).
2. Read Kevin's picks from the board (above). Only build what he kept; ask about the Maybes.
3. Read `HOLIDAY_DAY_OF_PLAN.md` §5 and §8 (the new-holiday checklist and how Halloween's day-of was built) and
   `HOLIDAY_DREAMS_PLAN.md` §3, §6, §8 and §9 (pool architecture, the face-swap safety rules, the Halloween pool spec,
   the holiday roadmap row for Christmas).
4. Settle the open decisions in §8 with Kevin before seeding (two of them change how rows are written).
5. Follow the build plan in §9. **Deadline: seeded and render-tested by ~Nov 20**, live Dec 1.

### Kevin's direction, verbatim (2026-10-01)

- "so when seeding there are two sides - bots and then nightly dreams. i want to brainstorm ideas for each. for bots,
  we need to run through and decide which ones make good candidates for chrismtas posts. i think we could be pretty
  liberal on which ones qualify - to me, seeing some deep space scene with a christmas tree would be funny/cool."
- "we also then want to ideate what categories of christmas posts/scenes we want for nightly - we want pretty, cozy,
  nostalgic, bright, merry, etc... all the attributes that make christmas so special for visitors of this app."
- His own nightly ideas: christmas lights scenes (house lit up in the background, in front of a christmas tree in the
  city or in a park), christmas tree hunting (chopping down a tree, walking through a tree farm choosing your favorite
  tree with lights strung up above), cozy nights in by the fire, stockings, sleigh rides, caroling, cute cozy
  neighborhoods and yards with decorations, hanging christmas lights, inside a cute house with decorations all around,
  ice skating with lights strung up, sledding, building a snowman, making snow angels, snowball fight, wrapping
  presents.
- "we should pull any seeds that are christmas related into new pools so that christmas stays focused during the
  holiday window"
- "i want to hit the ground running with all the ideas already thought out"

---

## 1. Facts as of 2026-10-01 (verified)

**The `holidays` row for `christmas`** (already exists): `is_active = false`, `peak_rule = fixed` Dec 25,
`window_days = 24` (window Dec 1 to Dec 25), `ramp_style = 'ramp'`, `ramp_start_pct = 6`, `peak_pct = 25`,
`peak_lead_days = 7`, `final_pct = 35`, `final_days = 1`, `day_of_enabled = true`, `day_of_look_keys = []` (empty),
`day_of_medium_ban = 'photography'`, `day_of_model_ban = ['bytedance/seedream-4']`, `postcard_overlay_url = null`.
Fall runs Sept 15 to Nov 26 and Halloween Oct 1 to 31, so nothing overlaps Christmas. Thanksgiving and New Year's rows
exist, both inactive. For comparison, Fall and Halloween run FLAT at 30% each.

**Live `engine_config` holiday switches (read 2026-10-01):** `holidays_enabled = true`, `holiday_stack_cap_pct = 100`
(no cap), `bots_seasonal_enabled = true`, `bots_seasonal_pct = 50`, `day_of_costume_pct = 100`,
`day_of_evening_cutoff_hour = 20`, `holiday_postcard_scope = 'day_of'`. Nothing here needs changing for Christmas;
flipping `holidays.is_active` for `christmas` is the only switch.

**Nightly pools:** `dual_scenarios` / `single_scenarios` rows with `pool = 'holiday'`, `category = 'christmas'`: 0.
`holiday_scenes` with `holiday = 'christmas'`: 0. Nothing to audit, everything to build.

**How a holiday draw works** (`_shared/pools/holidayScenarioLoader.ts` `pickHoliday`): pick one of the holiday's MAIN
pools at equal odds, then one row inside it. A main pool is a group of sub-themes, mapped in
`scripts/lib/halloweenPools.js` / `scripts/lib/fallPools.js`, mirrored in `supabase/functions/_shared/holidayPools.ts`
(parity test `__tests__/lib/halloweenPoolsParity.test.ts`). **`holidayPoolOf()` only knows the Halloween and Fall maps
today**: a Christmas map (`CHRISTMAS_POOL_OF_SUB`, `CHRISTMAS_POOLS`) must be added there, or every Christmas
sub-theme becomes its own pool and `isDayOfSub()` never finds `christmas_day_of`. That is an additive engine change
(restore-point rule: tell Kevin).

**Two holiday render paths** (both live):
- Scene-type roll (the holiday competes with goofy / elegant / active / location for the slot): the row's attire goes
  to the brief as "On-location inspiration ... Borrow only its colours, textures and accessories, never its garments";
  each person's garment and look come from the live outfit roll (`nightly_garment_roll`, mig 563).
- Embodied path (the holiday replaces the location spot): the row's attire goes in as "OUTFIT ... dress them in this",
  for a solo always, for a couple only when it is a woman + man (`nightly-dreams` ~L2965).
- So in the window, couples wear rolled seasonal styles, not Christmas outfits, unless §8 decision 1 changes that.

**Day-of (Dec 25):** every eligible nightly draws 100% from the reserved `christmas_day_of` pool (sub-themes mapped to
`christmas_day_of`), in a pinned look from `holidays.day_of_look_keys`, with a costume per person when
`engine_config.day_of_costume_pct` rolls (`_shared/holidayCostumes.ts`, gendered, test-locked) and the postcard
overlay. Recipe and every gotcha: memory `project_holiday_day_of_overhaul`, `HOLIDAY_DAY_OF_PLAN.md`.

**Bots:** a bot's holiday set is `seasonalPaths.christmas = [...]` in `scripts/bots/<bot>/index.js`, never in
`paths[]`. `scripts/lib/botSeasonal.js` keys off the same `holidays` row (window + `is_active`) and draws
`engine_config.bots_seasonal_pct` (50) of posts from a separate shuffle-bag `<bot>::seasonal::christmas`, behind
`engine_config.bots_seasonal_enabled`. No engine change needed. Existing sets for reference: Fall (ChibiBot 2, TinyBot 1,
BloomBot 1, FarmBot 6), Halloween (BloomBot 4, ChibiBot 5, FarmBot 5, MangaBot 4, PixelBot 6, TinyBot 4, ToyBot 4).

**Seeding tools that already exist:** `scripts/gen-holiday-pools.js` (seeded Fall + Halloween: Sonnet-authored,
linted by `scripts/lib/holidayPoolLint.js`; its pool list is fall/halloween only, so add Christmas pools),
`scripts/gen-holiday-archetypes.js --holiday <key> --pool day_of --to-share` (day-of seeds), `scripts/scan-holiday-pools.js`,
`scripts/scan-dual-faceswap-proximity.js` (hard rule after any couple seeding), `scripts/gen-holiday-postcard.mjs`,
`scripts/check-holiday-windows.mjs`, `scripts/check-holiday-day-of.js`, `scripts/qa-holiday-renders.js` (`--mode
window|day-of --season christmas --sub-theme <x> --surfaces dual-cast,solo-cast,scene-only`). From the 2026-10-01
fall/Halloween audit: `scripts/fill-holiday-themes.js`, `scripts/fix-couple-attire.js`, `scripts/check-holiday-fit.js`,
`scripts/tag-scenario-gender.js`, `scripts/clean-scenario-pools.js --holidays <keys>` (see
`NIGHTLY_POOL_CLEANUP_PLAN.md` phase 5).

---

## 2. Pull first: Christmas seeds hiding in year-round pools

Kevin: move every Christmas seed out of year-round rotation into the new Christmas pools, so Christmas only shows in
its window (and the new pools start with a head start). Counts are word matches; **read every entry before moving
it** (a sweep is a reading list, playbook §3.4). Three verdicts:

- **MOVE**: a Christmas scene. It leaves the year-round pool and seeds the matching Christmas pool/path.
- **REWORD**: a year-round entry that only borrows Christmas as a light or prop. Reword in place (keep the entry).
- **STAY**: a real name or a non-Christmas meaning.

### 2a. Nightly

| Where | What | Verdict |
|---|---|---|
| `dual_scenarios` `category = 'christmas'` (goofy 12, elegant 2, active 4) | yeti in an ugly sweater on a lodge porch; couple tangled in Christmas lights; couple inside a giant roll of wrapping paper; cartoon yeti in a Santa hat at a ski-lodge fireplace; baby dragon in a Santa hat in a snowy yard; giant unicorn in fairy lights in a town square; colossal house-cat at a Christmas market; Victorian London street at Christmas | MOVE all 18 (re-tag `pool = 'holiday'`, `category = 'christmas'`, set a Christmas `sub_theme`; check `location_keys` and `pose_pool` still make sense) |
| `single_scenarios` `category = 'christmas'` (goofy 5, elegant 1) | laundry-basket luge; three near-identical "desk inside a giant snow globe" office gags (dedupe to one); Tallinn old-town Christmas market; Viking beside a tiny pinecone Christmas tree | MOVE all 6 (dedupe the snow globes) |
| `single_scenarios` 127ade1e (goofy/absurd_giant) | person beside a life-size gingerbread house in a festive exhibition hall | MOVE |
| `single_scenarios` 0cc348a8 (goofy/time_travel) | cardboard rocket with "blinking Christmas-light controls" | REWORD to "blinking string-light controls" |
| `single_scenarios` 419990e2 (active/street_racer_m) | "Christmas-tree race lights" (the real drag-strip name, but Flux paints a Christmas tree) | REWORD to "the drag strip's starting-light tower" |
| dual 5e4519ee, dual 685be614, single 02160e1e (active/mythic_legend) | druids with mistletoe at a stone circle | STAY (Celtic, not Christmas) |
| `holiday_scenes` 2b014b3b (halloween/candy_store_frenzy) | skeleton conducting "with a candy cane baton" | REWORD to "a licorice-whip baton" (Halloween row) |
| `holiday_scenes` 8954fd36 (halloween/witches_kitchen_party) | "mistletoe and hemlock bundles" drying | STAY (witch's herbs) |
| `location_iconic_spots` (7 hits) | Martha's Vineyard gingerbread cottages, Cañón del Sumidero's "Christmas Tree" waterfall, candy land's candy-cane forest + gingerbread village, the toy shop's Nutcracker gate + parade | STAY (real names; year-round fantasy worlds) |

Also remove the now-unused `christmas` category from the everyday scenario pickers if it is wired anywhere (check
`category` handling and any `engine_config` pct that references it).

### 2b. Bots (files under `scripts/bots/<bot>/seeds/`)

Confirmed MOVE (read, real Christmas scenes):

| Bot | File | What | Count | Destination |
|---|---|---|---|---|
| BrickBot | `brickbot_winter_register.json` | Santa's workshop interior, sleigh launch pad, Christmas-tree squares, winter-village market | 27 of 200 | `b-brickbot--winter-village`, `--santas-workshop`, `--sleigh-launch` |
| BrickBot | `brickbot_macro_display_diorama_theme.json` | complete brick Christmas villages | 4 of 200 | `b-brickbot--winter-village` |
| BrickBot | `winter_scenes`, `winter_lighting`, `brickbot_winter_palette`, `brickbot_winter_phenomenon` (Santa ×6), `brickbot_winter_camera_framing`, `brickbot_winter_subject_focus`, `favorite_towns_scenes`, `macro_display_scenes`, `girly_scenes` | scattered Christmas entries and Christmas palettes inside the year-round winter path | ~25 | read each: MOVE scenes, REWORD palette/light words to plain winter |
| ChibiBot | `arctic_village_scenes.json` | "Holiday-twinkle village ... Christmas cottages, candy-cane streetlamps" | 30 of 546 | `b-chibibot--village` |
| ChibiBot | `cozy_interior_scenes` (2), `heartwarming_activities` (gingerbread house 1), `cozy_miniature_worlds` (gingerbread 2), `cozy_interior_details` (nutcracker 1), `creature_portrait_outfits` (Santa 1), `scene_palettes` / `sensory_creature_smell` (candy cane) | small Christmas touches in cozy pools | ~8 | read: MOVE scenes, REWORD props/smells |
| YumBot | path `holiday-sweets` (in `paths[]`, year-round) + `yumbot_holiday_sweets_scenes.json` (18 hits) + `yumbot_holiday_sweets_treats.json` (30 hits) | a year-round path mixing Christmas, Halloween, Easter and Valentine treats | 1 path | take the path OUT of `paths[]`; Christmas treats/scenes seed `b-yumbot--*`; split the other holidays into their own seasonal sets |
| YumBot | `yumbot_kawaii_drinks_scenes.json` | cocoa scenes with a decorated tree, candy canes, snow at a frosted window | 10 of 120 | `b-yumbot--cocoa-cabin` |
| YumBot | `yumbot_food_village_scenes.json` | "A gingerbread village dusted in powdered snow" (near-duplicates) | 5 of 120 | `b-yumbot--gingerbread-village` (dedupe) |
| YumBot | `candy_fantasy_scene_type` (gingerbread cottage, candy canes), `chef_scene_type` (Christmas 1), `yumbot_food_adventures_scenes` (candy cane 2), `yumbot_scale_scenes` (Santa 1) | | ~6 | read each |
| FarmBot | `farmbot_seasonal_festival_place.json` (year-round `seasonal-festival` path) | gingerbread-house builds on farmhouse tables | 8 of 120 | `b-farmbot--baking` |
| ToyBot | `hotwheels_scenes` (6), `hotwheels_landscapes` (Christmas 6, nutcracker 2), `hotwheels_scenarios` (nutcracker 1), `hotwheels_lighting` (3) | cars circling the Christmas tree, chase down a hallway of Christmas lights | ~15 | `b-toybot--under-tree` |
| ToyBot | `dollhouse_life_scenes` (2), `sackboy_scenes` (2), `barbie_landscapes` (2), `blockbuster_setting` (2), `plush_storytelling` scenes, `train_consists` (Santa 2), `train_unusual_cargo` (1), `shortcake_scenes` (mistletoe 1) | dollhouse Christmas morning, Sackboy's felt tree, Barbie's pink tree | ~12 | MOVE to the matching `b-toybot--*` path |
| TinyBot | `tiny_food_world` (5) | Stollen-village Christmas market, powdered-sugar Christmas snow | 3-5 | `b-tinybot--gingerbread-town` / `--village` |

Confirmed REWORD:

| Bot | File | What |
|---|---|---|
| ToyBot | `toybox_storytelling.json` (19 of 200), `plush_storytelling.json` (4) | "warm Christmas-tree string-light glow" used as the LIGHT for unrelated toy scenes: reword to "warm string-light glow" so a July toy scene doesn't read as Christmas |
| ToyBot | `sensory_scene_lightcolor`, `sensory_figure_lightcolor` (Christmas ×6 each), `scene_palettes`, `plush_lighting`, `atmospheres`, `sensory_scene_air` | Christmas used as a colour/light/smell word: reword to plain warm/winter words |
| TinyBot | `sensory_scene_lightcolor` (8), `tilt_shift_lighting` (2), `atmospheres`, `scene_palettes`, `sensory_scene_smell`, `contained_worlds`, `cottage_village`, `dollhouse_dioramas`, `miniature_urban_scenes` (2, Christmas decorations in a pub window/atrium) | same: reword, or MOVE where the whole entry is a Christmas scene |
| DreamBot | `bubble_world_tinybot` (Christmas 1), `sensory_*` (gingerbread, nutcracker, candy cane) | reword |
| MangaBot | `scene_palettes` (Christmas 2) | reword |
| GothBot | `cozy_goth_settings` (Christmas 1) | read: MOVE to `b-gothbot--*` if it is a Christmas scene |
| BloomBot | `bloombot_desert_bloom_bloom_explosion` (Christmas 2) | read (Santa ×8 there are Santa Rita cactus: STAY) |

STAY (not Christmas): reindeer as arctic animals (ChibiBot, EarthBot, StarBot ring habitats, DragonBot outfits = reindeer
hide/fur), the Santa Rita prickly pear (BloomBot), Christmas fern (EarthBot `hidden_corner_*`, a real plant), Christmas
tree worms (ChibiBot aquatic, a real reef animal), mistletoe in forests and fae courts (FaeBot, BrickBot forest,
GothBot), "north pole" on StarBot (a planet's pole), PixelBot's haunted gingerbread cottage (Halloween set).

AlphaBot holds a copy of ChibiBot's arctic pools (`scripts/bots/alphabot/seeds/arctic_village_scenes.json` etc.): it is
private; mirror the ChibiBot change only if the AlphaBot copy is still used.

Full scan command (re-run before moving; it is cheap):

```sh
for f in scripts/bots/*/seeds/*.json; do case "$f" in *backup*|*.bak*) continue;; esac
  w=$(grep -o -i -E "\b(christmas|xmas|santa|yuletide|gingerbread (house|man|men|village|cottage)|candy canes?|reindeer|nutcrackers?|mistletoe|north pole)\b" "$f" | tr A-Z a-z | sort | uniq -c | awk '{printf "%s %s, ", $2" "$3, $1}')
  [ -n "$w" ] && echo "$f | $w"; done
```

---

## 3. Ground rules every idea must follow

From the couple face-swap work and Halloween. Ideas that bend a rule carry a `risk` note.

1. **Couples need light on their faces.** On flux-1.1-pro, dark night couples held the dual swap 1 in 10 times vs 16 in
   28 in good light (memory `project_flux_couple_night_vibe_swap_failure`). Couple rows are blue hour, snowy dusk, or
   lit by the lights themselves ("faces warmly lit by the string lights"). True night goes to solos and scene-only
   rows. `FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES` already blocks night vibes on flux couples; the SCENE text must not
   undo that.
2. **Faces stay clear** (HOLIDAY_DREAMS_PLAN §6): no Santa beards, scarves over the mouth or nose, hoods up, ski
   goggles over the eyes, masks, face paint, red noses, veils. Hats, crowns, antler headbands and earmuffs are fine
   above the brow. No face-bearing decor staring out (nutcracker faces, Santa statues, portraits) near the cast: the
   detector grabs them.
3. **Two heads, two places.** Side by side with a clear gap between the heads. A snowball fight is ideal. Never a
   mistletoe kiss, cheek-to-cheek, embrace, one shared sled, or one person up a ladder (one-high-one-low broke
   Halloween couples). Run `node scripts/scan-dual-faceswap-proximity.js` (exit 0) after any couple seeding (CLAUDE.md
   hard rule) and check it actually reads DB holiday rows; if it only scans `_shared/pools/dual_*.ts`, add a DB pass.
4. **Couple attire** is gender-neutral or written "She in ..., he in ..." (HOLIDAY_DREAMS_PLAN §6 rule 6); a man never
   lands in a gown. Solo rows set `gender` (`female` / `male` / `any`). Tools: `scripts/fix-couple-attire.js`,
   `scripts/tag-scenario-gender.js`.
5. **Scene text is pure environment** (25-40 words): no people, pose, camera or face words; never "fills the
   background / rich / layered / dominant" (CLAUDE.md hard rule: it shrinks the faces).
6. **No text-shaped objects** in any row: no song sheets, signs, banners, letters to Santa, labels, storefront names,
   advent-calendar numbers (they render as gibberish). Storefront scenes leak ~1 in 6.
7. **No franchise names in nightly rows.** `holidayPoolLint.js` already bans Burton / Nightmare Before Christmas /
   "christmas town" and friends; extend it with Christmas IP (Grinch, Rudolph, Frosty, Polar Express, Elf, Home Alone,
   Charlie Brown, Rankin-Bass, Hallmark). Describe the look instead ("1960s felt-and-clay TV-special puppets"). Bots
   may use pop culture (Kevin 2026-09-22), nightly may not.
8. **Season locked in every row**: snow, frost or lights named in the entry itself (playbook §4.8: season-neutral
   entries drift).
9. **Secular unless Kevin says otherwise** (§8 decision 2).
10. **The motto** (`feedback_dreambot_motto_whimsy_delight_bar`): playful, vivid, clever, one charm detail. A plain
    "couple stands in front of a tree" is a miss; give every row a moment.
11. **A solo row opens on a SPOT, never a route** (migs 657/658, 2026-10-02). The early "set at" line is the row's
    first comma-clause, and flux stages the person on what it names: "Snowy village lane lined with lanterns" renders
    the same woman centred on a receding lane every time (fall + Halloween: 16 of 24 real nightlies did). Open on a
    noun phrase for a spot ("Lantern-hung gate of a snowy cottage", "Bench beside the skating pond"), and keep paths,
    lanes, streets, rows, aisles and markets-as-corridors out of the text or once after the first clause ("beside
    the market lane"). After seeding, run `node scripts/fix-holiday-corridor-seeds.js --holidays christmas --out
    <dir>` and read what it flags.

---

## 4. Nightly: main pools and sub-themes

Each block is one MAIN pool (equal airtime). Each idea is a sub-theme. A pool needs rows on all three surfaces:
couples (`dual_scenarios`), solos (`single_scenarios`, gendered attire) and scene-only (`holiday_scenes`: no people, a
moment with a hook and a non-human cast, like Halloween's fun register). Halloween ran ~14 pools at ~10-24 rows per
sub-theme; Christmas below is 18 pools. Ideas marked **(Kevin)** are his.

Suggested taxonomy key for each pool is the block's id; sub-theme keys are the idea ids with `-` turned into `_`.

### `lights`: Christmas lights. The glow everyone waits for all year.
- `n-lights--house-lit` **Our house, all lit up (Kevin).** A snowy front yard at blue hour, the whole house outlined
  in warm lights behind them.
- `n-lights--city-tree` **Under the city tree (Kevin).** A towering decorated tree in a city plaza, snow just starting.
- `n-lights--park-tree` **The big tree in the park (Kevin).** A lit evergreen in a snowy park, lights wound through the
  bare trees around it.
- `n-lights--light-tunnel` **Tunnel of lights.** Walking through an arched tunnel of lights at a botanical-garden
  light show.
- `n-lights--overboard-house` **The over-the-top house** (goofy). Every inch blazing: a herd of light-up reindeer,
  inflatable snowmen, a Santa on the roof.
- `n-lights--boat-parade` **Lighted boat parade.** A harbor at dusk, sailboats strung with lights from bow to masthead.
- `n-lights--drive-thru` **Drive-through light show.** Leaning out of a vintage car crawling through a light display.
- Seeding note: every couple row at blue hour with the lights lighting their faces; the darkest versions are
  solo/scene only.
- Voice example (couple): scene "Snow-covered front lawn at blue hour, a white clapboard house outlined in warm
  bulb lights, glowing candy-cane stakes lining the path, a lit wreath on the red door, snow falling softly";
  attire "She in a cranberry wool swing coat and cream cable-knit scarf, he in a camel peacoat over a forest-green
  roll-neck".

### `decking`: Decking the halls. Getting the house ready.
- `n-decking--untangle` **Untangling the lights.** On the porch with a giant knot of lit string lights between them.
  (Seeds: the moved "tangled in Christmas lights" goofy row.)
- `n-decking--hang-lights` **Hanging the lights (Kevin).** Along the porch rail and the front windows, both at the same
  height. Risk: no ladders.
- `n-decking--trim-tree` **Trimming the tree.** Hanging ornaments together, the star still waiting in its box.
- `n-decking--wreath-door` **The wreath goes up.** A giant wreath going onto a red front door, garland on the railings.
- `n-decking--yard-display` **Building the yard display (Kevin).** Setting up light-up reindeer and a candy-cane path in
  fresh snow.
- `n-decking--gingerbread-build` **Gingerbread construction.** A gingerbread house mid-build on the kitchen table, icing
  everywhere.

### `tree-hunt`: The tree hunt. Finding the one.
- `n-tree-hunt--tree-farm` **Choosing the tree (Kevin).** Walking the rows of a tree farm under strung lights.
- `n-tree-hunt--chop-tree` **Chopping it down (Kevin).** Sawing down the chosen fir in a snowy forest.
- `n-tree-hunt--tree-on-car` **Tied to the roof.** Strapping the tree onto a vintage pickup.
- `n-tree-hunt--sled-haul` **Dragging it home.** Hauling the tree home on a wooden sled through deep snow.
- `n-tree-hunt--tree-lot` **The sidewalk tree lot.** A city tree lot under bulb lights, trees leaning in rows.
- Seeding note: daytime and golden hour work here, a good bright counterweight to the night-heavy pools.

### `cozy`: Cozy nights in. Fire, blankets, cocoa.
- `n-cozy--fireside` **By the fire (Kevin).** Stockings on the mantel, the fire crackling, blankets and cocoa.
- `n-cozy--decorated-home` **The house is ready (Kevin).** A cute house decorated top to bottom, garland on every
  banister, the tree in the window.
- `n-cozy--wrapping` **Wrapping presents (Kevin).** Paper, ribbon and tape all over the living-room floor. (Seeds: the
  moved "giant roll of wrapping paper" goofy row.)
- `n-cozy--window-cocoa` **Snow past the window.** A window seat with cocoa, heavy snow falling outside.
- `n-cozy--movie-night` **Christmas movie night.** On the couch under a quilt, the tree glowing, threading popcorn
  garland. (No screen with a picture on it: a TV renders noise or text.)
- `n-cozy--cat-in-tree` **The cat got in the tree** (goofy). A cat halfway up the tree, ornaments swinging.
- Seeding note: interiors must name their own light sources (tree lights, fire, candles) landing on the faces.

### `snow-day`: Snow day. Outside till our fingers freeze.
- `n-snow-day--snowball` **Snowball fight (Kevin).** Mid-throw across a snowy yard, a snow fort on each side. The best
  couple pose there is.
- `n-snow-day--snowman` **Building a snowman (Kevin).** Rolling the last big snowball, carrot nose and scarf ready.
- `n-snow-day--snow-angels` **Snow angels (Kevin).** Lying in fresh snow making angels, seen from above. Risk: a lying
  pose seen from overhead is untested for the swap; render-test before scaling, and keep a standing-up "just made
  them" variant as the fallback.
- `n-snow-day--sledding` **Sledding the big hill (Kevin).** Two sleds racing side by side (separate sleds: one shared
  sled stacks the heads).
- `n-snow-day--snow-fort` **The snow fort.** A fort with turrets and a lantern in the window.
- `n-snow-day--tubing` **Tubing at dusk.** Spinning down a tubing hill with lights along the run.
- Seeding note: bright daylight, the best swap conditions of the whole holiday. Pose clarity (playbook §5.6): feet
  planted or seated, no airborne bodies.

### `sleigh`: Sleigh rides. Dashing through the snow.
- `n-sleigh--horse-sleigh` **Dashing through the snow (Kevin).** An open one-horse sleigh through a snowy birch
  forest, lanterns swinging.
- `n-sleigh--carriage` **Carriage through the park.** A horse-drawn carriage in falling snow through a city park.
- `n-sleigh--reindeer-sleigh` **Reindeer sleigh.** A reindeer-drawn sleigh across a snowfield at twilight.
- `n-sleigh--husky` **Husky team.** A husky sled run through a snowy spruce forest.
- Seeding note: couples sit side by side in the sleigh facing forward; keep the heads apart.

### `carols`: Carols and music. Singing in the snow.
- `n-carols--door-caroling` **Caroling door to door (Kevin).** Lanterns raised at a snowy front door. No song sheets
  (gibberish text).
- `n-carols--dickens-carolers` **Victorian carolers.** A gas-lit street, top hats and muffs, singing in the snow.
- `n-carols--piano` **Around the piano.** Singing at an upright piano by the tree (no sheet music on the stand).
- `n-carols--brass-band` **Town brass band.** A little brass band in a snowy town square.

### `skating`: Ice skating. Lights strung overhead.
- `n-skating--rink-lights` **Skating under the lights (Kevin).** An outdoor rink with strings of lights overhead.
- `n-skating--frozen-pond` **The frozen village pond.** A bonfire on the bank, the village beyond.
- `n-skating--city-rink` **The rink under the big tree.** A city rink beneath a giant tree, towers all around.
- `n-skating--palace-rink` **Skating at the palace.** A rink in front of a lit palace or castle.
- Seeding note: skating side by side, not hand-in-hand twirls (the twirl pulls the heads together).

### `markets`: Christmas markets. Wooden stalls and warm mugs.
- `n-markets--market` **The Christmas market.** Wooden stalls, steaming mugs, gingerbread hearts, roasting chestnuts.
  (Seeds: the moved Tallinn market and house-cat market rows.)
- `n-markets--carousel` **The market carousel.** A vintage carousel spinning at the heart of the market.
- `n-markets--lantern-market` **Lantern market in the snow.** A small market lit only by lanterns and candles.
- `n-markets--cocoa-stall` **The cocoa stall.** Warming hands at a hot-chocolate stall, marshmallows piled high.
- Seeding note: stalls carry goods, never signs (the GOODS LAW, playbook §7.1).

### `city`: Christmas in the city. Windows, bags and big trees.
- `n-city--windows` **Holiday windows.** Department-store windows full of animated displays. Risk: storefront text
  ~1 in 6.
- `n-city--shopping` **Shopping in the snow.** Arms full of bags on a snowy avenue under strung lights (plain bags, no
  logos).
- `n-city--famous-cities` **Famous city Christmases.** New York's big tree and rink, London's light canopies over the
  shopping streets, the Paris department-store dome tree, Vienna's Rathaus market, Tokyo's winter illuminations,
  Quebec's old town. Depends on §8 decision 3.
- `n-city--rooftop-view` **Rooftop over the lights.** A rooftop at dusk above a city glittering with holiday lights.

### `small-town`: Small-town Christmas. The movie-town version.
- `n-small-town--tree-lighting` **The tree lighting.** The moment the town tree switches on and the crowd lights up.
- `n-small-town--gazebo` **The gazebo.** A lit gazebo in a snowy square, a wreath on every post.
- `n-small-town--parade` **The Christmas parade.** Floats, a marching band and Santa's float on Main Street.
- `n-small-town--main-street` **Main Street in the snow.** Garlands across the street, bakery windows glowing.
- Seeding note: crowds stay sparse, small and distant (crowd density trips flux-1.1, playbook §3.3).

### `cabin`: Cabin and chalet. Snowed in, happily.
- `n-cabin--snowed-in` **Snowed in.** A log cabin glowing in deep snow, smoke from the chimney.
- `n-cabin--chalet` **Chalet balcony.** An alpine chalet balcony at dusk, the village lights below.
- `n-cabin--lodge` **The lodge.** A great room with a two-storey stone fireplace and a giant tree.
- `n-cabin--porch-cocoa` **Cocoa on the porch.** Wrapped in blankets on a snowy cabin porch.
- (Seeds: the moved yeti-at-the-ski-lodge goofy rows could live here or in `north-pole`.)

### `baking`: Christmas baking. Flour on everything.
- `n-baking--cookies` **Cookie decorating.** Frosting cookies, sprinkles everywhere.
- `n-baking--flour-fight` **Flour everywhere** (goofy). A baking session gone wrong, both dusted head to toe (keep the
  flour off the faces).
- `n-baking--dinner-table` **The big dinner.** A candlelit table with a roast, crackers and a centerpiece.
- `n-baking--santa-plate` **Cookies for Santa.** Setting out cookies and milk by the tree.

### `elegant`: Elegant Christmas. Velvet, sequins and a very tall tree.
- `n-elegant--ball` **The Christmas ball.** A palace ballroom with a giant tree.
- `n-elegant--hotel-tree` **The grand hotel tree.** A grand hotel lobby with a thirty-foot tree and a champagne tower.
- `n-elegant--nutcracker` **Nutcracker night.** A box at the ballet, the Nutcracker on stage (dancers small and distant).
- `n-elegant--terrace` **Champagne on the terrace.** Black tie on a terrace above the city lights. (Seeds: the moved
  elegant rows.)
- Seeding note: `pose_pool` = the refined partner pool, like every holiday row; attire is the point here, so this
  pool depends most on §8 decision 1.

### `nostalgic`: Nostalgic Christmas. The Christmas of old cards and movies.
- `n-nostalgic--fifties` **1950s Christmas.** An aluminum tree, bubble lights, a station wagon with a tree on the roof.
- `n-nostalgic--dickens` **A Dickens Christmas.** A snowy Victorian street, gas lamps, shop windows. (Seeds: the moved
  Victorian London row.)
- `n-nostalgic--toy-store` **The old toy store.** A vintage toy shop with a model train in the window.
- `n-nostalgic--train-home` **Coming home for Christmas.** A snowy train platform, steam, wreaths on the lamps.

### `north-pole`: North Pole magic. The dream version of Christmas.
- `n-north-pole--santas-village` **Visiting the North Pole.** Santa's village, striped poles, the workshop glowing.
- `n-north-pole--stables` **The reindeer stables.** Feeding the reindeer in their stalls.
- `n-north-pole--sleigh-flight` **Riding in Santa's sleigh.** Flying over a sleeping town across a huge moon. Risk:
  night, so solo and scene-only (or a twilight couple version, render-tested).
- `n-north-pole--snow-globe` **Inside a snow globe.** A snow-globe village, curved glass and drifting snow around
  them. (Seeds: one of the moved snow-globe rows.)
- `n-north-pole--express` **The North Pole express.** A magic steam train through a snowy forest at dusk (never named
  after the film).
- `n-north-pole--ice-palace` **The ice palace.** A glittering ice palace with a tree of frozen ornaments.
- `n-north-pole--ornament-forest` **The ornament forest.** Walking among house-sized glass ornaments in a snowy wood.
- `n-north-pole--yeti` **A Christmas yeti** (goofy). A friendly yeti in an ugly sweater joins the scene. (Seeds: the
  moved yeti rows.)
- `n-north-pole--giant-friends` **Giant holiday friends.** A baby dragon in a Santa hat, a giant cat at the market, a
  unicorn in fairy lights. (Seeds: the moved active rows; they follow the active-pool companion rules.)

### `tropical`: Tropical Christmas. The bright, sunny end of the mix.
- `n-tropical--beach` **Christmas on the beach.** Palm trees in lights, a sandman, Santa hats in the sun.
- `n-tropical--palm-tree` **The palm-tree Christmas tree.** A palm decorated as a tree on a white beach at sunset.
- Seeding note: no swimwear (keep it summer-dress / linen festive), bright daylight.

### `scene-worlds`: Scene-only stylized worlds. No people; each pins its own look.
Like Halloween's `stop_motion_halloween_town` / `land_of_the_dead_marigold` pools: `holiday_scenes` rows only, each
pool pins a look through `holiday_scenes.medium_key` → a `christmas_*` `dream_mediums` row (mig 481 is the model).
- `n-scene-worlds--stop-motion` **Stop-motion Christmas town.** The 1960s TV-special look: felt, wood and clay puppets
  in a snowy town (never named).
- `n-scene-worlds--storybook` **Vintage storybook Christmas.** Mid-century picture-book illustration, flat colour,
  sweet and graphic.
- `n-scene-worlds--gingerbread-kingdom` **The gingerbread kingdom.** Everything edible: icing snow, candy windows,
  peppermint roads.
- `n-scene-worlds--ornament-worlds` **Worlds inside ornaments.** A snowy village inside a glass bauble on the tree.
- `n-scene-worlds--felted` **Felted wool village.** Needle-felted houses, wool snow, little felt critters.
- `n-scene-worlds--victorian-card` **Victorian Christmas card.** An embossed-card look: robins, holly, glitter frost.
- `n-scene-worlds--paper-cut` **Paper-cut winter village.** White paper-cut houses with warm light glowing behind.
- `n-scene-worlds--under-tree` **The village under the tree.** A model village and train circling the base of the tree.
- `n-scene-worlds--pets` **Pets' Christmas.** Dogs in Christmas sweaters, a cat asleep in the tree skirt.

Every main pool above also gets scene-only rows in its own sub-themes (fun register: a moment with a hook, a
non-human cast such as a fox stealing a cookie at the market, a robin on the snowman's hat).

---

## 5. December 25 (the reserved day-of pool)

### 5a. Christmas Day scenes (`christmas_day_of` sub-themes)
- `d-d25--morning` **Christmas morning.** Matching pajamas, tearing open presents by the tree in morning light.
- `d-d25--stockings` **Stocking reveal.** Pulling surprises out of overflowing stockings.
- `d-d25--breakfast` **Christmas breakfast.** Cinnamon rolls and cocoa by the tree.
- `d-d25--walk` **Christmas Day walk.** A quiet snowy walk through a decorated neighborhood.
- `d-d25--he-came` **He came!** Santa's sleigh just lifting off the roof, presents under the tree.
- `d-d25--dinner` **Christmas dinner.** The big table, crackers popped, paper crowns on.
- Plus a day-of activity register with its own STANCES (Halloween's had 9 stances + 23 beats, all same-plane and
  same-height; see `HOLIDAY_DAY_OF_PLAN.md` §5c): unwrapping, pulling a cracker together, hanging the last stocking,
  toasting cocoa mugs, holding up a gift.
- Halloween's day-of pool was 16 subs, 160 couple / 160 solo / 192 scene rows. Aim for the same depth.

### 5b. Christmas Day costumes (`HOLIDAY_COSTUMES.christmas` in `_shared/holidayCostumes.ts`)
One distinct costume per person (`rollHolidayCostumes`, distinct keys per render, variant by the person's gender),
written as a character concept with a twist (Kevin finds plain archetypes bland), clothing/headwear/props only, nothing
over the face, no hair change; the costume test locks those rules. The file's format is
`C(key, vibe, [femaleLabel, femaleAttire], [maleLabel, maleAttire])` with `vibe` one of `fun | sexy | cool | scary |
classic`; the label is what the dreamer "went as" (caption / notification). Ready to paste:

| Board id | key, vibe | Female [label, attire] | Male [label, attire] |
|---|---|---|---|
| `d-costumes--claus` | `claus`, classic | "Mrs. Claus", "Mrs. Claus's crimson velvet coat-dress with a white faux-fur hem, a sleigh-bell choker, candy-striped gloves" | "Santa off duty", "Santa's red velvet smoking jacket with white faux-fur cuffs, black satin lapels, a candy-cane pocket square" (no beard) |
| `d-costumes--elves` | `workshop_elf`, fun | "a workshop elf", "a red-and-white striped felt dress with pointed cuffs, a jingle-bell collar, a ribbon-spool bandolier" | "a workshop elf", "a green felt tunic with a jingle-bell collar, striped scarf, a tool belt of wrapping-tape rolls" |
| `d-costumes--nutcracker-pair` | `nutcracker`, classic | "the Sugar Plum Fairy", "a plum tulle gown with a sugared-crystal bodice and a glittering tiara" | "the Nutcracker prince", "a red-and-gold toy-soldier jacket with gold frogging, white cross-belts, a tall shako hat" |
| `d-costumes--frost-royals` | `frost_royal`, cool | "the Snow Queen", "an ice-white gown with a frosted cape and a crystal crown" | "Jack Frost", "a frost-blue velvet frock coat traced with silver ice-crystal embroidery, a frosted silver circlet" |
| `d-costumes--gingerbread` | `gingerbread`, fun | "a gingerbread girl", "a gingerbread-brown fitted dress with white icing-piped trim and gumdrop buttons" | "a gingerbread man", "a gingerbread-brown three-piece suit with white icing-piped trim and gumdrop buttons" |
| `d-costumes--ugly-sweater` | `ugly_sweater`, fun | "the ugly-sweater champion", "a light-up knitted reindeer sweater with tinsel trim and pom-pom ornaments" | "the ugly-sweater champion", "a light-up knitted snowman sweater with tinsel trim and jingle bells" |
| `d-costumes--reindeer` | `reindeer`, fun | "a reindeer", "a brown faux-fur coat, velvet antler headband, a red ribbon collar with a gold bell" | "a reindeer", "a brown faux-fur jacket, velvet antler headband, a harness-style leather sash with sleigh bells" (no red nose) |
| `d-costumes--tree-costume` | `christmas_tree`, fun | "the Christmas tree", "a tiered green velvet dress strung with tiny glass ornaments and a gold star headband" | "the Christmas tree", "a green velvet tailcoat strung with tiny glass ornaments and a gold star lapel pin" |
| `d-costumes--toy-soldiers` | `toy_soldier`, classic | "a tin soldier", "a red tin-soldier jacket-dress with gold buttons, white cross-belts, a tall black shako" | "a tin soldier", "a red tin-soldier uniform with gold buttons, white cross-belts, a tall black shako" |
| `d-costumes--grinch` | `holiday_thief`, fun | "a holiday thief", "a green faux-fur coat-dress, a slouched Santa hat, a sack of stolen ornaments" | "a holiday thief", "a green faux-fur suit, a slouched Santa hat, a sack of stolen presents" (never named; no face paint) |

Halloween's pool has 34 concepts; aim for ~20 for Christmas (add: snow angels in white feathered capes, Victorian
carolers, nutcracker ballerinas, a candy-cane couple, North Pole pilots in aviator jackets with goggles UP on the hat,
Mrs. Claus's bakery, a sugar plum and a peppermint, Krampus-free).

### 5c. Christmas Day looks (`holidays.day_of_look_keys` → `christmas_*` `dream_mediums` rows)
Pattern: mig 478 (`halloween_*` rows, `is_public = false`, `nightly_skip = true`, per-look `smart_dream_models`).
`day_of_medium_ban` is already `photography`.
- `d-looks--look-card` **Vintage holiday card.** Mid-century card illustration, warm and graphic.
- `d-looks--look-stop-motion` **Stop-motion special.** Felt-and-clay puppet animation look.
- `d-looks--look-watercolor` **Cozy watercolor.** Soft watercolor with warm window light.
- `d-looks--look-storybook-oil` **Golden storybook oil.** A rich painted storybook plate.
- `d-looks--look-snow-globe` **Snow-globe glow.** A dreamy painted look with a soft glow and drifting snow.
- Check each look on flux-1.1-pro couples before approving it (some looks reject flux couples; see the per-look pins
  in CLAUDE.md, mig 536).

### 5d. Postcard
A "Merry Christmas / DreamBot 2026" overlay in the same brand style as Halloween's (gradient DreamBot wordmark + mascot,
one stored PNG, Kevin loved Halloween's). `scripts/gen-holiday-postcard.mjs`; upload to
`uploads/assets/holiday/christmas_postcard_<ts>.png`; set `postcard_overlay_url` + anchor/width/margin/scrim on the
row; verify with `force_day_of=christmas` on Kevin's account. Add Dec 25 to the day-of monitor's schedule.

---

## 6. Bots

Every bot gets a `seasonalPaths.christmas` set, built per the playbook (§2): design on AlphaBot (private), seed each
pool to 25, dry-run the brief, shadow renders, Kevin's sign-off, then the destination bot's `seasonalPaths.christmas`.
Halloween sets were 4-6 paths per bot. New-path model default: 50/50 flux-1.1-pro / ultra unless measured otherwise.
OutlawBot is a hidden bot and is left out.

**Ready-made winter content (no build needed, Kevin to confirm):**
- FarmBot `first-snowfall`: built, pools seeded, QA'd, DEACTIVATED 2026-09-09 (Kevin: "shut off the snowy paths for
  farmbot for now - just deactivate, don't delete"; off-season). It can go straight into `seasonalPaths.christmas`.
- Year-round winter paths that could ALSO be listed in a bot's Christmas set to give it volume on day one (a path can
  sit in two lists): BrickBot `winter`, ChibiBot `creature-snow-day` + `arctic-village`, TinyBot `tiny-winter-village`
  + `snow-globe-world`, MangaBot `winter-anime`, EarthBot `winter-wonder`, FaeBot `frost-court`, GothBot
  `the-frost-garden`, DinoBot `polar-dinos` + `snowline-forest`. Listing one in `seasonalPaths.christmas` while it
  stays in `paths[]` raises its share during December; leave them out if the Christmas sets should be Christmas only.

### StarBot (great fit; Kevin's own example)
Posts now: cinematic sci-fi, 31 paths (vistas, alien cities, megastructures, ships, explorers, cyborgs).
- `b-starbot--deep-space-tree` **Christmas tree in deep space (Kevin).** A decorated tree on a starship observation
  deck, a nebula filling the window. Sibling: `cozy-sci-fi-interior` (the one warm path). Risk: terrestrial nouns
  drift space scenes (playbook §7.5); keep the window the only "outside".
- `b-starbot--spacewalk-ornament` **The last ornament.** An astronaut hanging a glowing ornament on the station
  antenna, Earth's bright limb behind. Sibling: `spacewalk` (composed awe only, no wires or chores).
- `b-starbot--ring-christmas` **Christmas on the ring.** A ring-habitat town square with a mile-tall tree, the ring
  curving up into the sky. Sibling: `ring-habitat`.
- `b-starbot--moonbase` **Moonbase Christmas.** A lunar base window, a little tree inside, Earthrise outside.
- `b-starbot--robot-tree` **Robot's first Christmas.** A maintenance robot decorating a tiny tree on an asteroid.
  Sibling: `robot-moment`.
- `b-starbot--alien-festival` **An alien winter festival.** An alien city celebrating its own festival of lights under
  twin moons. Sibling: `alien-city`.

### SteamBot (great fit; a Dickens Christmas is home turf)
Posts now: steampunk Victorian worlds, 17 paths.
- `b-steambot--airship-presents` **The present airship.** An airship laden with presents over a snowy Victorian city,
  garland on the rigging. Sibling: `airship-skies` (airships in the SKY, never ships at sea).
- `b-steambot--arcade-market` **Market under the glass arcade.** A gas-lit market of brass toy stalls and chestnut
  roasters. Risk: stall signs; goods only.
- `b-steambot--toymaker` **The toymaker's Christmas Eve.** Brass automaton toys at rest around a tree in a toymaker's
  shop. Sibling: `steampunk-curio` (automata STILL, at rest). Risk: no clocks, gauges or dials (text-shaped).
- `b-steambot--snowbound-square` **Snowbound Victorian square.** Carolers and a brass-and-glass tree lit with gas
  flames. Characters candid mid-task at 20-35% of frame.

### ToyBot (great fit; Christmas is the toy holiday)
Posts now: toys in every tradition, 23 paths. Halloween set of 4.
- `b-toybot--under-tree` **Toys under the tree.** Christmas morning floor, the toys come alive among wrapped presents.
  (Seeds: the moved Hot Wheels tree-circling entries.)
- `b-toybot--nutcracker-battle` **The Nutcracker battle.** Nutcracker soldiers against the Mouse King across the
  parlor rug. Sibling: `green-army-warzone` energy.
- `b-toybot--tin-parade` **Tin-toy Christmas parade.** Litho tin Santas, sleighs and reindeer. Sibling:
  `tin-toy-parade` (name the tradition: Masudaya/Yonezawa litho tin).
- `b-toybot--train-tree` **The train around the tree.** A model train circling the tree through a snowy model village.
  Sibling: `model-train-world`.
- `b-toybot--vintage-box` **Vintage Christmas toybox.** Mid-century ornaments and toys. Sibling:
  `vintage-halloween-toybox`.
- Risk: branded-object text (playbook §7.1): no boxes with printing, no tags.

### FarmBot (great fit)
Posts now: cozy farm life with animals and people at equal spotlight, 32 paths. Fall set of 6, Halloween set of 5.
Function-form paths, flux-2-flex only, `FARMBOT_LENGTH_RULE`.
- `b-farmbot--tree-farm` **Cutting the tree.** A horse-drawn wagon hauling trees, a dog leading the way.
- `b-farmbot--barn` **Christmas in the barn.** A lantern-lit barn with wreaths, cows and goats in the stalls.
- `b-farmbot--sleigh` **Sleigh across the fields.** Draft horses pulling a sleigh through snowy fields.
- `b-farmbot--baking` **Farmhouse Christmas baking.** Pies and cookies in the farmhouse kitchen, a cat on the sill.
  (Seeds: the 8 gingerbread-house builds moved out of `seasonal-festival`.)
- `b-farmbot--caroling` **Caroling at the farmhouse.** Lanterns at the door, sheep watching from the fence.
- `b-farmbot--market` **Village Christmas market.** Stalls in the village square, a goat in a red bow.

### ChibiBot (great fit)
Posts now: adorable critters, villages, cozy scenes, 28 paths, strictly no humans. Fall 2, Halloween 5.
- `b-chibibot--village` **Christmas critter village.** Critters in a decorated village. (Seeds: the 30 moved
  arctic-village Christmas cottages.)
- `b-chibibot--tree-trim` **Trimming the tree.** Critter friends decorating the tree, one lifting the star.
- `b-chibibot--cookie-day` **Cookie day.** Critters baking and frosting cookies, flour everywhere.
- `b-chibibot--burrow-morning` **Christmas morning in the burrow.** An avalanche of wrapping paper.
- `b-chibibot--workshop` **The critter workshop.** Penguins and fox kits wrapping gifts on a conveyor.
- `b-chibibot--sleigh` **The sleigh ride.** Critters in a little sleigh pulled by a baby reindeer.
- Sibling for outings: the `CHIBIBOT_CREATURE_OUTING` archetype (trio-forced entries, season locked in the detail
  pool). Looks apply automatically (`CHIBI_LOOK_PATHS`).

### TinyBot (great fit)
Posts now: tiny whimsy scenes with critters, 19 paths, strictly no humans. Fall 1, Halloween 4.
- `b-tinybot--village` **Tiny Christmas village.** Mice and critters on string-light streets.
- `b-tinybot--tree-village` **The village in the tree.** A whole tiny village living in the branches of a Christmas
  tree, ornaments as lanterns.
- `b-tinybot--gingerbread-town` **Gingerbread town.** Critters living in gingerbread houses under icing snow. (Seeds:
  the moved Stollen-village entries.)
- `b-tinybot--ornament-world` **World inside an ornament.** A snowy village inside a glass bauble. Sibling:
  `snow-globe-world` (the CONCRETE-BUT-CROPPED reference) / `contained-worlds`.
- Risk: "whole tiny village" wording drew tiny townspeople (2026-09-30); every resident is a named critter.

### YumBot (great fit)
Posts now: kawaii food with faces, 31 paths, strictly no humans; includes `holiday-sweets` year-round (moves out, §2b).
- `b-yumbot--gingerbread-village` **Gingerbread village.** Gingerbread-house characters in an icing-snow village.
- `b-yumbot--cocoa-cabin` **Cocoa cabin.** Hot-cocoa mugs and marshmallow friends by a fire. (Seeds: the 10 moved
  kawaii-drinks Christmas scenes.)
- `b-yumbot--cookie-kitchen` **Cookie decorating day.** Christmas cookies with faces getting frosted.
- `b-yumbot--candy-cane-land` **Candy Cane Land.** A candy-cane forest, a peppermint river, sugar-plum residents.
- `b-yumbot--cake-party` **Christmas cake party.** Strawberry Christmas cake, bûche de Noël and panettone at a
  festive table. (Seeds: the holiday-sweets Christmas treats.)
- Locks: mini-chef foods wear nothing; storefront/menu scenes leak text ~1 in 6.

### PixelBot (great fit)
Posts now: pixel paintings in classic game splash-screen style, 20 paths. Halloween set of 6. Scene wiring from
`scenePaths.js`; build with `scripts/_pixelbot-scene-render.js`.
- `b-pixelbot--rpg-town` **Christmas in the RPG town.** A tree in the town square, snowy rooftops. Sibling:
  `cozy-rpg-town`.
- `b-pixelbot--snow-level` **The snow level.** A side-scroller snow world, presents as collectibles, an ice palace far
  off. Sibling: `side-scroller-world` (no HUD, no score text).
- `b-pixelbot--cozy-room` **Cozy Christmas room.** Tree, fireplace and a sleeping cat, in pixels. Sibling:
  `pixel-cozy-room`.
- `b-pixelbot--sleigh-overworld` **Sleigh over the overworld.** Santa's sleigh crossing a pixel world map.
- `b-pixelbot--ice-boss` **Ice palace boss.** A snow-golem boss in a frozen palace. Sibling: `boss-arena`.

### MangaBot (great fit; Christmas Eve is a big anime moment)
Posts now: anime and Japanese-culture scenes, 26 paths. Halloween set of 4. `MANGABOT_LENGTH_RULE`, no on-screen UI.
- `b-mangabot--illuminations` **Winter illuminations.** Blue-lit avenues and light tunnels in Tokyo.
- `b-mangabot--christmas-eve` **Christmas Eve under the tree.** The romance beat: snow starting under a giant tree.
  Sibling: `cherry-blossom-romance`.
- `b-mangabot--kotatsu-party` **Kotatsu Christmas party.** Friends, strawberry shortcake and presents around the
  kotatsu.
- `b-mangabot--santa-magical-girl` **Santa magical girl.** A magical girl in Santa red flying over the city. Sibling:
  `magical-girl`.

### BrickBot (great fit; LEGO's own Winter Village line is the canon)
Posts now: LEGO MOC diorama photography, 19 paths (`pools.PATHS`; go-live trap `SKIP_LEGACY_PER_PATH`, playbook §2.5).
- `b-brickbot--winter-village` **Brick Winter Village.** Toy shop, bakery, skating rink and tree square. (Seeds: the
  31 moved entries.)
- `b-brickbot--santas-workshop` **Santa's brick workshop.** Elf minifigs, a conveyor of gifts.
- `b-brickbot--holiday-train` **The holiday train.** A brick train circling a brick tree through a snowy village.
- `b-brickbot--sleigh-launch` **North Pole airfield.** A sleigh on the launch ramp, a reindeer runway lit up. Sibling:
  `airfield-biplanes` (hand-authored camera pool).
- `b-brickbot--space-christmas` **Classic Space Christmas.** Classic spacemen decorating a tree on a moon base.
- Snow and ice are strong photoreal priors: reuse the winter path's `snow_ice_build_technique` axis. Never name a
  product line (it prints).

### GothBot (great fit)
Posts now: Castlevania / Bloodborne / Crimson Peak / Berserk / Burton gothic, 22 paths. Romantic-melancholy, never
horror.
- `b-gothbot--krampus` **Krampus night.** Krampus with bells and chains in a lantern-lit alpine village.
- `b-gothbot--halloween-town` **Christmas comes to Halloween Town.** The Burton lineage: a spiral hill strung with
  Christmas lights (pop culture allowed on bots).
- `b-gothbot--vampire-ball` **The vampire's Christmas ball.** A black tree with crimson baubles, candelabras, snow at
  the gothic windows.
- `b-gothbot--snowbound-manor` **Snowbound manor.** A gothic manor at Christmas, black wreaths and candlelight.

### FaeBot (great fit)
Posts now: painted fairy and druid worlds, 27 paths, including `frost-court`. Bot medium names artists, so no flux-2;
"tiny" renders naked cherubs (state adult proportions).
- `b-faebot--yule-market` **Midwinter goblin market.** Sugared plums, glass baubles and candle-lantern stalls.
  Sibling: `goblin-market` family.
- `b-faebot--sugar-plum` **Land of the Sugar Plum fairies.** The Nutcracker's Land of Sweets: a snowflake waltz, candy
  meadows.
- `b-faebot--holly-king` **The Holly King's court.** Yule folklore: holly crowns and a midwinter court in the snow.
  Sibling: `fae-court`.
- `b-faebot--great-fir` **Fairies trim the great fir.** Fairies hanging dewdrop lights and frost baubles on a giant
  fir.

### BloomBot (good fit)
Posts now: flowers as the hero, 24 paths. Fall 1, Halloween 4. A named species renders in its PRIOR colour.
- `b-bloombot--poinsettia-glasshouse` **Poinsettia glasshouse.** A Victorian glasshouse overflowing with poinsettias,
  snow on the glass. Sibling: `conservatory`.
- `b-bloombot--christmas-roses` **Christmas roses in the snow.** Hellebores and red winterberry through fresh snow
  under fairy lights.
- `b-bloombot--amaryllis-window` **Amaryllis window.** Amaryllis and paperwhites on a frosted sill, a lit village
  beyond. Risk: split-panel frame (one continuous space with a bright window in it).
- `b-bloombot--living-wreath` **The living wreath.** A door-sized wreath of living flowers and holly on a snowy street.
  Risk: product shot (open with its attachment: hung on a red door).

### DragonBot (good fit; Midwinter and Yule, never the word "Christmas")
Posts now: strict high fantasy, 38 paths. No modern nouns.
- `b-dragonbot--yule-tree-dragon` **The dragon and the Yule tree.** A dragon coiled around a giant evergreen in a snowy
  mountain town, villagers stringing lanterns on it. Sibling: `dragon-scene` (the subject-as-hero reference).
- `b-dragonbot--dwarven-yule` **Yule in the dwarven hold.** A great hall, a yule log the size of a trunk, a mountain fir
  hung with gold. Sibling: `dwarven-hold`.
- `b-dragonbot--elven-midwinter` **Elven midwinter festival.** A silver-lantern procession through an elven city in
  snow. Sibling: `elven-city`.
- `b-dragonbot--wizard-midwinter` **Wizard's Midwinter.** A tower study, candles and enchanted ornaments floating.
  Sibling: `cozy-arcane` / `arcane-library` (candle and fey light only).

### DreamBot (great fit)
Posts now: the bubble-bot in dream worlds, 18 paths including the bot crossovers. The DOME is the variety lever;
dome-mirrors-world is a template mandate. Mascot lore: `MASCOT_LORE.md` (Bot & Taco, a buddy comedy; Taco doesn't know
he isn't real).
- `b-dreambot--bot-christmas` **Bubble-bot's Christmas.** The bot in a knit scarf decorating a tree, its dome
  reflecting a snowy Christmas world.
- `b-dreambot--bot-delivers` **Bot delivers.** Delivering presents across the rooftops in a rocket-sleigh.
- `b-dreambot--taco-reindeer` **Taco the reindeer.** Taco in antlers, convinced he's one of Santa's reindeer; the bot
  untangling lights, unimpressed.

### OceanBot (good fit)
Posts now: ocean worlds, 17 paths. Every seed has a hero.
- `b-oceanbot--tree-reef` **Christmas tree reef.** Real Christmas tree worms in red and green, sea fans, white sea stars
  like snowflakes.
- `b-oceanbot--sunken-cargo` **The sunken Christmas cargo.** A wreck spilling glass ornaments and glowing light strands
  across a reef, fish nosing the baubles. Sibling: `shipwreck-kingdom`.
- `b-oceanbot--polar-seas` **Polar Christmas seas.** Narwhals and belugas under a red-and-green aurora. Sibling:
  `polar-seas`.

### EarthBot (stretch: nature's Christmas card only)
Posts now: real Earth landscapes, 29 paths, zero humans and nothing human-built.
- `b-earthbot--natures-card` **Nature's Christmas card.** Snow-crowned spruces in Lapland, frosted red winterberries,
  aurora over a snowy fir forest. No lights, no ornaments. Sibling: `winter-wonder`.

### DinoBot (stretch: nature only, it bans anything human)
Posts now: photoreal prehistoric wildlife, 21 paths.
- `b-dinobot--polar-yule` **Cretaceous Christmas card.** Polar dinosaurs in snowfall among conifers with red berries,
  an aurora overhead. Sibling: `polar-dinos`.
- `b-dinobot--first-snow` **First snow.** Hatchlings seeing their first snow under a snow-dusted fir.

---

## 7. Volume targets

- Nightly window pools: 18 main pools; ~10-15 couple, ~10-15 solo (split female/male/any) and ~12-15 scene rows per
  sub-theme, MVP 3 per sub-theme first for Kevin's review (the Halloween route: MVP → review → scale to share).
- Day-of: ~16 subs, ~160 couple / 160 solo / 190 scene rows; 10 costume concepts × 2 variants; 5 looks.
- Bots: 3-6 seasonal paths per bot, each pool seeded to 25 (MVP), scaled after sign-off only if the window is long
  enough to need it (24 days × ~1 seasonal post/day per bot ≈ 24 renders per bot; 25-50 entries per subject pool is
  plenty).

---

## 8. Decisions for Kevin (board ids `q-decisions--*`; Keep = yes, Cut = no)

1. `q-decisions--festive-outfits` **Festive outfits all December?** Today in-window couples wear the rolled seasonal
   styles and a holiday row's outfit is only colour inspiration, so ugly sweaters, matching pajamas and velvet party
   looks would only appear on Dec 25. Options: (a) let Christmas rows dress the cast in the window (engine change to
   the garment-roll demotion; needs Kevin's word under the restore-point rule), or (b) add window-gated Christmas
   looks to the outfit catalog (velvet party, ugly sweater, cozy knits, matching pajamas), DB-only. Recommendation: (b)
   for the scene-type path, plus (a) only for `elegant` and the pajama sub-themes.
2. `q-decisions--secular` **Keep it secular?** Keep = trees, lights, Santa and snow only. Cut = also nativity scenes,
   candlelit church exteriors, midnight mass. Recommendation: secular.
3. `q-decisions--real-cities` **Real famous city Christmases?** A pool of real cities at Christmas (New York, London,
   Paris, Vienna, Tokyo, Quebec). Recommendation: yes; it is the richest variety source.
4. `q-decisions--your-places` **Christmas comes to your places.** Dress the dreamer's own picked places for Christmas
   (Paris at Christmas if they picked Paris). Needs engine work (a Christmas overlay on the location path). Worth a
   plan after the pools ship; probably not for 2026.
5. `q-decisions--new-years` **New Year's Eve right after?** The `new_years` row exists (window 5, `15→25`, 35). It
   would follow Dec 26 to Jan 1 with its own small pool (black-tie gala, rooftop fireworks, confetti countdown).

Also confirm: the window intensity (the row says ramp 6% → 25%, 35% on the day; Fall/Halloween run flat 30%), and
whether `bots_seasonal_pct` stays 50 for Christmas.

---

## 9. Build plan

| Step | What | Notes |
|---|---|---|
| 0 | Read Kevin's picks from the board; settle §8 | report the tally first |
| 1 | **Pull** (§2): move/reword the nightly rows (one guarded migration), the bot seed entries (per bot, explicit paths) and take YumBot `holiday-sweets` out of `paths[]` | nightly moves are `UPDATE ... WHERE id = ... AND category = 'christmas'`; never an unscoped delete; keep `.bak` copies of seed files |
| 2 | **Taxonomy**: `scripts/lib/christmasPools.js` (window pools + `christmas_day_of`), mirror `CHRISTMAS_POOL_OF_SUB` / `CHRISTMAS_POOLS` in `_shared/holidayPools.ts`, wire `holidayPoolOf()`, extend the parity test, `actionRegisters.ts` entries, lint additions (Christmas IP) | engine code, additive: tell Kevin; deploy `nightly-dreams` |
| 3 | **Seed MVP**: extend `gen-holiday-pools.js` with christmas pools; 3 rows per sub-theme per surface; `scan-holiday-pools.js` + `scan-dual-faceswap-proximity.js` + `fix-couple-attire.js` + gender tags | Kevin reviews a sample before scaling |
| 4 | **Render test** with `qa-holiday-renders.js --season christmas --sub-theme <x>` on Kevin's account (couples + solos + scenes), ≤3 concurrent, headroom-gated | check couple swap hold on every night-leaning pool |
| 5 | **Scale** to share; dedupe with `clean-scenario-pools.js --holidays christmas`; fit check with `check-holiday-fit.js` (add a Christmas definition) | |
| 6 | **Day-of**: `christmas_day_of` subs + register + stances, costumes in `holidayCostumes.ts` (+ test), `christmas_*` looks rows + `day_of_look_keys`, postcard PNG + row, monitor date; `qa-holiday-renders.js --mode day-of --season christmas` | `force_day_of=christmas` |
| 7 | **Bots**: per bot, AlphaBot → 25-entry pools → shadow renders → Kevin's sign-off → `seasonalPaths.christmas` | read the playbook first; one bot's pattern proven before siblings |
| 8 | **Go-live Dec 1**: `UPDATE holidays SET is_active = true WHERE key = 'christmas'` (both nightly and bots key off it), confirm `bots_seasonal_enabled`, `node scripts/check-holiday-windows.mjs` | before Dec 1 UTC; nightly runs at each user's local 4am |
| 9 | Docs + memory: `HOLIDAY_DREAMS_PLAN.md` roadmap row, `BOT_SCENE_QUALITY_PLAYBOOK.md` §4.8 seasonal sets, memory `project_holiday_2026_readiness` | |

Hard rules that bite here (CLAUDE.md): throttle renders (≤3, `waitForHeadroom`), explicit-path commits (`git commit -m
... -- <paths>`), migrations via `node scripts/apply-migration.mjs NNN`, edge functions deployed with `--no-verify-jwt`,
no unscoped deletes on seed tables, no change to the production nightly engine without Kevin's word.

---

## 10. Reference: how holiday pools work (nightly and bots)

Everything a builder needs to know about the machinery, verified against the code on 2026-10-01.

### 10.1 Nightly data model

| Table | Holiday columns | Notes |
|---|---|---|
| `dual_scenarios` | `pool = 'holiday'`, `category = <holiday key>`, `sub_theme`, `scene`, `attire`, `disabled`, `pose_pool`, `medium_key`, `medium_ban`, `action`, `relationship_scope = 'any'`, `day_of` (false; unused) | one `attire` for the couple: gender-neutral or "She in ..., he in ..." |
| `single_scenarios` | same + `gender` (`female` / `male` / `any`) | the engine draws `any` ∪ the dreamer's gender (`holidaySingleCandidates`) |
| `holiday_scenes` | `holiday`, `sub_theme`, `scene` (50-80 words of prose), `tone`, `medium_key`, `medium_ban`, `disabled`, `day_of` | scene-only dreams (no cast) |
| `holidays` | catalog row per holiday (§1) | window + ramp + day-of config + postcard |
| `user_recipes.holiday_optouts` | jsonb array of holiday keys | an opted-out user gets a normal nightly |

- `medium_key` is **NULL by design** on cast rows (Kevin 2026-09-04: holiday rows roll the same looks as every other
  dream). Only the scene-only stylized worlds pin a look (`holiday_scenes.medium_key` → a `christmas_*` look row). This
  supersedes rule 7 in `HOLIDAY_DREAMS_PLAN.md` §6.
- The `day_of` column is false on every row: the day-of pool is keyed by SUB-THEME (subs mapped to
  `<key>_day_of` in the taxonomy).
- Rows are switched off with `disabled = true`, never deleted.

### 10.2 The taxonomy module (single source of truth per holiday)

`scripts/lib/halloweenPools.js` is the model (`fallPools.js` the same shape). Exports
`{ SHARE, SHARE_DAY_OF, POOLS, SUBS, POOL_OF_SUB, SCENE_ONLY_POOLS, shareFor, dayOfPoolKey }`:

```js
const SHARE = 70;          // rows per main pool per table, split across its subs (ceil(share / subs))
const SHARE_DAY_OF = 160;  // the reserved day-of pool seeds deeper
const POOLS = {
  christmas_day_of: { palette: '...', objects: '...', share: SHARE_DAY_OF, subs: ['christmas_morning', ...] },
  lights: { palette: 'warm bulb amber and candle gold against deep blue dusk and fresh white snow',
            objects: 'string lights, lit wreaths, candy-cane stakes, glowing windows, snow-laden evergreens',
            subs: ['house_lit', 'city_tree', ...] },
  stop_motion_world: { sceneOnly: true, sceneMedium: 'christmas_stop_motion', palette: '...', objects: '...', subs: [...] },
};
const SUBS = {
  house_lit: { pool: 'lights', costume: 'cozy wool coats and knit scarves',
               setting: 'a snowy front yard at blue hour, the whole house outlined in warm bulb lights, ...' },
  // a sub may carry its own palette / objects, overriding its pool's
};
```

- The generator writes rows from each sub's `costume` + `setting` hints and its pool's `palette` + `objects`, so the
  hints ARE the creative brief: write them as carefully as seeds (the ideas in §4 are the raw material).
- Mirror the map in `supabase/functions/_shared/holidayPools.ts` (`CHRISTMAS_POOL_OF_SUB`, `CHRISTMAS_POOLS`,
  `CHRISTMAS_SCENE_ONLY_POOLS`), add it to `holidayPoolOf()`, extend the parity test.
- Add the taxonomy to the `TAXES` maps in `scripts/lib/holidayPoolLint.js` and `scripts/gen-holiday-archetypes.js`,
  and to anything else that `require`s `halloweenPools` (grep for it).
- Lint additions for Christmas: a `CHRISTMAS_ANCHOR` (a Christmas scene must name a Christmas element, like Fall's
  `FALL_ANCHOR`, which was added after 17-19% of cozy Fall scenes carried no fall word), Christmas IP terms, and the
  existing occlusion / scene-person / size-cue / gendered-garment rules unchanged.
- Day-of register: `supabase/functions/_shared/actionRegisters.ts` gets a `christmas_day_of` register with its OWN
  stances (Halloween's: 9 activity stances + 23 beats, all same plane and same height).

### 10.3 How a nightly render rolls a holiday

- Gate: `engine_config.holidays_enabled`, the `holidays` row (`is_active` + window), the user's opt-outs. Per-holiday
  percentage from the ramp (`_shared/holidayWindow.ts`: `combineHolidayPct`, `pickWeightedHoliday`; JS mirror
  `scripts/lib/holidayWindow.js`, parity-tested), capped by `holiday_stack_cap_pct` when several holidays overlap.
- Three entry points:
  1. **Scene-type roll** (cast renders): the holiday competes with goofy / elegant / active / location; the cut is
     renormalized (`sceneTypeCuts`). A win → `pickHoliday` → `applySceneRow(row, 'elegant', key)` (refined partner
     pose). Stamps `holiday_roll:couple|solo:pct=..:roll=..:pools=..`, `holiday:<key>`.
  2. **Embodied path** (Dream Art and location dreams; the holiday replaces the location spot): stamps
     `holiday_roll:embodied:...`, `holiday_embodied:<key>`. Attire goes in verbatim ("dress them in this") for a solo,
     and for a couple only when woman + man.
  3. **Scene-only** (`pure_scene`, no cast): `holiday_scenes`; stamps `holiday_scene:<key>`,
     `holiday_scene_medium:<key>` when the row pins a look.
- Draw: `pickHoliday` = one MAIN pool at equal odds, then a row in it. Per-user shuffle bag: `filterUnseen(...,
  'holiday:<key>', ...)` + `recordPick`, so a user doesn't repeat a row until the pool is exhausted.
- Outfits: on the scene-type path the row's attire is colour inspiration only ("never its garments"); the live outfit
  roll (`nightly_garment_roll`, gendered card wardrobes, outfit plan) dresses each person. See §8 decision 1.
- Day-of: `dayOfCalendarDate(now, users.timezone, day_of_evening_cutoff_hour)`; on the day, 100% from
  `<key>_day_of` (`loadHolidayDual(..., 'only')`), falling back to window rows if empty. Stamps
  `holiday_day_of:<key>:<source>:<sub>`, `holiday_day_of_preroll:...`, `costume:<left>/<right>`, `costume_lock`,
  `day_of_look:<key>`, `postcard:<key>:ok|backfilled`. Nightly enqueues at each user's LOCAL 4am.
- Loader cache: rows are cached per edge isolate, keyed by holiday (or holiday:sub when a sub-theme is forced). A
  failed read is never cached (fixed 2026-09-29). Rows seeded mid-day reach a cached key only when the isolate
  recycles; before a QA round that must see brand-new rows, redeploy `nightly-dreams` (`--no-verify-jwt`) or force
  the sub-theme.

### 10.4 Bots

- `scripts/bots/<bot>/index.js`: the path file goes in `pathBuilders` and its name in `seasonalPaths.christmas`,
  never in `paths[]`. `scripts/bots/farmbot/paths/farmbot-fall-hayride.js` is the template for a seasonal path file
  (its header explains the pattern).
- `scripts/lib/botSeasonal.js`: master switch `engine_config.bots_seasonal_enabled` (true), flat rate
  `bots_seasonal_pct` (50), WHEN from the `holidays` row (window + `is_active`), its own shuffle-bag
  `<bot>::seasonal::christmas` in `bot_path_cycle`. With two holidays in season it picks one by calendar weight.
- Render on demand: `node scripts/iter-bot.js --bot <bot> --mode <path> --count 6 --label "<path> R1" --post --shadow`
  (`--post` without `--shadow` PUBLISHES on a live bot).
- Build route (playbook §2): AlphaBot first (`ALPHABOT.md`), clone the destination's per-path config byte-identical,
  seed each pool to 25, dry-run the composed brief, `node scripts/audit-bot-pool-wiring.js --bot <bot>`, shadow QA
  rounds (≤3, one variable each), Kevin's sign-off, promote into the destination's `seasonalPaths.christmas`.
- Hard-lock the season inside EVERY place-building entry (snow, lights, a tree named in the entry itself).
- Halloween bot sets were built 2026-09-07 (7 bots) and Fall sets 2026-09-09/29; the per-bot playbook profiles (§10)
  list each bot's locks.

---

## 11. How to build and QA a nightly seed pool (the method, and what it cost to learn)

This is the working method from the nightly engine work (Sept-Oct 2026): the location-pool cleanup, the scenario and
holiday dedupe, the drift repair, the gendered wardrobes, the couple-backdrop rounds and the fall/Halloween audit.
Every rule here was paid for with a wasted round. Follow it in order.

### 11.1 The loop

1. **Define** each pool and sub-theme in words before writing any seeds (11.2).
2. **Draft** an MVP: ~3 rows per sub-theme per surface (11.3).
3. **Check** mechanically: lint, scans, attire and gender checks (11.4). Fix before rendering.
4. **Render** a small round on the real engine (11.5) and view every image.
5. **Diagnose** at the source: the row, the brief, the prompt, the stamps (11.6).
6. **Iterate** one variable per round, capped (11.7). Kevin reviews a sample.
7. **Scale** to share with the same recipe; then **dedupe** (11.8), **fit-check** (11.9) and **backfill** thin
   themes (11.10).
8. **Apply** with guarded migrations and verify every row landed (11.11).
9. **Final render round**, then go live; watch the stamps on the first nights.

### 11.2 Define the pool before seeding

- **Each sub-theme has a promise**: what its name guarantees in every row. `harvest_moonrise_foliage_lake` means a
  harvest moon rising over a lake ringed by autumn foliage, every time. A refill that dropped the lake (an orchard, a
  barn loft, a vineyard) passed every automated check and was still wrong; it was caught only by reading. Write the
  promise into the generator prompt ("every row keeps EVERY element the sub-theme name promises").
- **Write the holiday's definition AND its off-list** (what it is not). The fit checker and the writer both read
  them. Fall's definition says a dusting of snow on high peaks is still autumn; Halloween's says Christmas or a snowy
  winter scene is off.
- **The definition leaks into the writer.** Halloween's definition mentioned Día de Muertos, so the refill writer put
  marigolds, charro suits and sombreros into haunted-house, rooftop and graveyard themes (14 of 110 rows). Tell the
  writer to stay inside the sub-theme and never bring in another sub-theme or tradition the holiday covers.
- **Never a real culture's traditional dress** on a non-culture theme (Kevin's costume-card rule).
- **The bar is the motto**: playful, vivid, clever, one charm detail. "A couple stands in front of a tree" is a miss;
  give every row a moment. Outfits daring over cute, never plain everyday basics (memory
  `feedback_outfits_daring_and_varied`, `feedback_no_plain_clothes_wardrobe`).
- **Variety comes from authored rows**, never from LLM freedom at render time (memory
  `feedback_no_llm_freedom_authored_pools_only`).

### 11.3 Drafting seeds

- Use the generator (`gen-holiday-archetypes.js`), not hand-typed SQL; it lints each row at insert time.
- Give the writer ALL existing rows of the sub-theme (live and removed) as do-not-repeat, and a handful as voice
  examples. Ask for a few more than needed; drop extras after the duplicate read.
- **Check that your filters aren't eating the output.** A 12-word cap in the location refill silently dropped every
  long candidate, so one card got 0 new spots and nobody noticed until counts were read; raised to 16. After any
  generator run, compare asked vs written vs kept per theme.
- Keep scene text short and environmental (25-40 words for cast rows); long setting hints make Sonnet overshoot the
  scene cap on couple rows (keep day-of hints ≤ ~30 words).
- Camera words in seeds ("seen from above", "a wide shot of") fight the engine's framing; write the place itself
  (`scripts/reword-camera-spots.js` has the opener regexes).
- Solo rows: write the outfit for the gender and set `gender`. Couple rows: "She in ..., he in ...".
- Read every generated row. Generators drift, repeat, and invent; a 110-row refill had 14 drift rows and one typo in
  Cyrillic letters.

### 11.4 Mechanical checks (all cheap, all before any render)

- `node scripts/scan-holiday-pools.js` (the lint over DB rows) and `node scripts/scan-dual-faceswap-proximity.js`
  (exit 0; CLAUDE.md hard rule after any couple seeding).
- Couple attire: no womenswear in the man's half. Split each line on `\bshe in\b` / `\bhe in\b` WITH word boundaries:
  a plain "he in" matches inside "She in" and gave 37 false alarms in one check. `scripts/fix-couple-attire.js`
  rewrites unlabelled gendered lines.
- Solo gender: every holiday solo row was once `any`, so a man drew "a shredded ivory wedding dress";
  `scripts/tag-scenario-gender.js` tags women-only / men-only attire (then read its calls; it needed ~10 hand
  corrections in 6,151).
- Face occlusion (masks, face paint, veils, hoods up, goggles, sunglasses, red noses, beards on costumes). Goggles
  with no position ("brass goggles") render over the eyes: write "pushed up on the forehead".
- Text-shaped objects (signs, song sheets, letters, labels, screens, menus) and franchise names.
- Season anchor: the holiday is named in the row itself.
- **A sweep is a reading list, not a delete queue.** False positives run high ("Christmas fern" is a plant, "Santa
  Rita" is a cactus, "advent" matches "adventure", "Christmas-tree race lights" is the drag-strip name). Read every
  hit before acting.

### 11.5 Render testing

- **Harnesses:**
  - Holiday pools: `node scripts/qa-holiday-renders.js --mode window --season christmas --sub-theme <sub>
    --surfaces dual-cast,solo-cast,scene-only --tag <name>`; `--mode day-of` for Dec 25. It writes
    `~/Desktop/holiday-qa-<tag>.html` + `.json` with the drawn scene and the final prompt per render.
  - Exact production behaviour: `node scripts/qa-nightly-exact.js --round=rN --count=14` (enqueues real
    `dream_queue` jobs like the cron, drains them with the real worker; never pin models or force cast roles in a
    benchmark round: Kevin wants "bit for bit the same as what will drive users' nightly dreams").
  - Location cards: `node scripts/qa-location.js` (`--with-holiday` restores the holiday mix; off by default).
  - Cheap A/B on one variable: direct fixed-seed flux-1.1-pro renders via the Replicate API (same seed per arm, 9:16),
    which isolates a wording or a fragment without touching the engine or anyone's album.
- **Who and where:** renders run on Kevin's account and land in his private album (captioned `QA <tag>`); never a
  real user's account (diagnose a user's renders offline). Throttle: ≤3 concurrent, `waitForHeadroom` before each,
  avoid :00 and ~08:00 UTC.
- **Confirm the engine you think ran.** `looks_minimal:on` must be in the stamps. Never pass `force_look` (it is
  `force_medium` and drops the style contract) or `force_face_swap_eligible` (it turns the render into a first dream
  with 7 curated styles); use `force_cast_role` / `force_day_of_look`. Both traps each cost a full batch.
- **Confirm the row you meant was drawn and reached the prompt.** Read `rolled_axes.seedSource` and the
  `enhanced_prompt`; a forced-entry harness once passed "[object Object]" and 0 of 16 prompts carried the entry
  while the verdict said "modest gain". Forcing a sub-theme still draws any row in it: in the fall/Halloween test, 3
  of 6 renders drew an original row, not a new one.
- **Read the brief**, not just the prompt: `ai_generation_log.sonnet_brief` shows how a row's text was used (that is
  how the "attire is only colour inspiration" behaviour was found).
- **View every image.** Contact sheet: `magick a.png b.png -resize x900 +append sheet.png` (or `montage`); ImageMagick
  here has no default font, so pass `-font /System/Library/Fonts/Helvetica.ttc` for labels; PIL is not installed.
- For Kevin's review, the render-picker skill (`.claude/skills/render-picker/`) builds a private vote page; read his
  votes with `ArtifactData list` and report the tally first.

### 11.6 Diagnosing a bad render

Check in this order before changing anything:

1. **Stamps** (`ai_generation_log.fallback_reasons`): which path, which holiday roll, which look/model, swap outcome
   (`chain_2of2`, `rebuilt_solo:`, `solo_model_move:`, `SHIPPED_FACELESS`, `dual_degrade_single`). `node
   scripts/check-forensics.js [userId]` stitches a failure to its stage. Diagnose swap failures from the stamps, never
   by eyeballing the image.
2. **Measure the delivered outcome, not the picked one.** `uploads.model` records the PICKED model; after a chain
   retry it says flux while gemini rendered. `node scripts/_tmp-batch-audit.js` reads the real chain.
3. **Bucket by environment before blaming the row.** Couple swap failures were LIGHTING (night couples 1/10 vs bright
   16/28), not the look or pose; check light, distance and framing first.
4. **Know what a row can and cannot control** (each was probed; do not re-run):
   - Position-1 tokens set concrete visual attributes (eye colour, hair) but NOT relationships ("TWO FRIENDS" and
     "PARTNERS" posed identically) and not facts that fight a strong prior (clean-shaven older men failed 12/12).
   - Flux ignores camera-distance words (no clause 8% face size, "camera far back" 7%); the LOOK fragment decides
     framing (one fragment swap turned a close-up into a couple seen from behind).
   - The prompt cannot enforce head geometry on flux couples (a "clear gap between their heads" still rendered
     cheek-to-cheek); a full day was lost rediscovering it (`COUPLE_SWAP_RELIABILITY_PLAN.md`).
   - A look ignored because the framing said "photograph" 3× after naming it (2/9 → 7/9 with neutral framing).
   - Plain couple backdrops (~1 in 10, watercolour/ink looks) are seed luck in a paper-vignette style, not the row;
     accepted after 2 probe rounds.
5. **Only then** change the row, then the generator recipe, and last the engine (and the engine needs Kevin's word).

### 11.7 Iterating

- **One variable per round.** A multi-variable round hides which lever worked; shipping the album prompt order on 9
  couples took first-try dual success from 56% to 4%.
- **Same-length null first.** Before blaming a wording for a composition change, render a meaningless edit of the
  same length in the same spot. Every gaze wording "lowered scenery" on the same seeds, and so did a hyphen edit: the
  base seeds were a lucky draw (cost two rounds).
- **Know the resolution.** 3 renders per arm form a hypothesis; confirm on ≥6 before shipping; a 1-2 in 6 effect
  needs ~40 per arm to see.
- **Cap the rounds.** After two visibly bad rounds the next one must be structural. Kevin's rule for engine limits:
  "if after a few rounds of tweaking you can't get it to work, just accept it as a model limitation and move on" (he
  allowed up to 5 on the couple backdrops; it closed after 2).
- **Never say "fixed" before the batch says so**, and report both arms with numbers.
- **Never show Kevin renders a known defect spoils**: if an upstream layer decides the picture whatever the row
  says, fix that first or label the batch a plumbing proof.
- **A taste remark is a question, not a change request.** Liking one render ≠ make every render like it.
- **Render every candidate** when building a catalog; let Kevin cut, don't prefilter.

### 11.8 Dedupe

- `node scripts/clean-scenario-pools.js --holidays <keys> --out <dir> [--tables dual,single,scenes]` groups rows per
  sub-theme, asks for same-picture groups in one read, then confirms every pair one by one (the group read alone is
  wrong ~1 in 10: it paired the Arch of Constantine with the Arch of Janus). Only confirmed pairs are disabled; the
  best of each group is kept.
- Check precision by hand: sample 40 confirmed pairs (fall/Halloween: 40/40 the same dream; scenario pools 40/40).
- The judge prompt must say that sharing the sub-theme is never sameness on its own, or it groups a whole theme.
- Measure depth where the draw happens: the MAIN pool (after the fall/Halloween dedupe every cast main pool kept 50+
  rows, largest drop 29%). The automated idea-similarity measure (`scripts/lib/ideaSimilarity.js`) is wrong in both
  directions: never use it as an acceptance gate.

### 11.9 Fit and drift

- `node scripts/check-holiday-fit.js --holidays <keys> --out <dir>`: a first read flags per sub-theme, a
  keep-by-default second read confirms, and only rows both reads call off reach review. Then decide each by hand:
  disable, reword in place (keep the row), or keep.
- **Never auto-cull drift** (Kevin's rule). On the location cards a first read flagged 5,714, the confirm kept 2,203
  for review, and hand review still kept some.
- Reword rather than disable when the row is good apart from one off item (candy-cane jars on a Halloween row →
  glass candy jars).

### 11.10 Backfill

- `node scripts/fill-holiday-themes.js --groups <dir>/groups --out <dir> [--floor 8] [--target 10] [--only <theme>]
  [--sql <file>]` refills sub-themes left under the floor in their own format, with live AND removed rows as
  do-not-repeat and a duplicate read against them. It never refills `unsorted` (rows with no sub-theme; an early run
  mistook those 10 rows for an empty theme).
- Read every new row. Drop drift; redo a theme whose rows lost its promise (`--only <theme>`); hand-fix wrong-gender
  garments and typos.
- Re-run the mechanical checks (11.4) on the new rows before applying.

### 11.11 Applying and verifying

- One guarded migration per batch: `UPDATE ... SET disabled = true WHERE id IN (...) AND disabled = false AND pool =
  'holiday' AND category IN (...)`; text edits guarded on the old text (`AND attire = '<old>'`); inserts in plain
  `INSERT`. The header records every decision and number (it is the audit trail). `node scripts/apply-migration.mjs
  NNN --dry-run`, then apply.
- **Count before and after** and check the arithmetic (2,191 − 348 = 1,843). Then verify every text edit landed by
  reading each row back (66 of 66): a guard on old text skips silently when the text didn't match.
- Paginate every count (PostgREST caps reads at 1000 rows silently; an unpaginated count once undercounted Fall).
- Never an unscoped delete on any seed table (CLAUDE.md hard rule); disable, never delete.
- After applying, one render round on the changed themes (11.5), then commit with explicit paths.

### 11.12 Gotchas that cost time

- zsh does not word-split `$VAR`: a file list in one variable runs as ONE argument (a "clean" sweep that checked
  nothing). Use bash arrays or list paths explicitly.
- Scratch scripts outside the repo can't find `dotenv` / `@supabase/supabase-js`: set
  `NODE_PATH=$PWD/node_modules` (or use `createRequire` pointed at the repo's `package.json`).
- `git commit` of an untracked file with a pathspec fails: `git add -N <file>` first, then `git commit -m ... --
  <paths>` (never `git add -A`; read the staged diff).
- Prettier reformats `.md` tables; it only gates ts/tsx here, so don't run it on docs.
- A QA render right after seeding may serve cached rows (10.3).
- The holiday rows seeded so far have `location_keys = null`; check how the scenario-location scope
  (`SCENARIO_LOCATION_SCOPE.md`) treats holiday rows before giving Christmas rows location keys.

### 11.13 What "good" looked like for Fall and Halloween

- Kevin's bar: on theme at a glance, vivid, a moment rather than a pose, faces swapped, men in menswear, no text,
  no franchise names.
- Final fall/Halloween state (2026-10-01): 1,051 duplicates off, 3 off-holiday off, 39 couple outfit lines rewritten,
  25 goggles pushed up, 96 refill rows, every sub-theme ≥ 8 rows, every cast main pool ≥ 50, render test 6/6 swaps
  held. Full record: `NIGHTLY_POOL_CLEANUP_PLAN.md` phase 5, migrations 653-655.
