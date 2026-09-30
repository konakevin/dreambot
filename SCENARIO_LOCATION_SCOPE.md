# Scenario Location Scope — every nightly from the dreamer's chosen places

Status of record for moving the shared nightly scenario pools onto location cards. Started 2026-09-30.

## Goal (Kevin, 2026-09-30)

> "i don't like people getting surprised by types of dreams they don't want. i want all dreams to be intentional
> from the users chosen locations - so we are trying to migrate the public nightly seed pools into existing
> locations or establish new 'locations' that we can assign them into."

**Holidays are exempt** (Kevin, same day): "holiday scenes are an exception … all users are opted into holiday pools
during holiday windows, so keep only holiday pools separate." Nothing here touches `pool = 'holiday'` rows,
`holiday_scenes`, or the holiday roll.

## Decisions (Kevin, 2026-09-30)

1. Less variety for dreamers who pick few places is fine: "users can learn to go choose more locations".
2. At least one location is required in onboarding AND Settings (done, below).
3. New location categories: go with the proposal (below), built through the normal location pipeline.
4. A first dream always honours a place from onboarding, holidays included (done, below).
5. Fold in the surreal `nightly_seeds` if they are good enough, as a new category if needed (audit below).

## The problem, measured (2026-09-30)

- 288 nightlies in 14 days: 183 at the dreamer's own place, 59 Fall holiday, **46 from the shared goofy / elegant /
  active scenario pools** (20% of non-holiday dreams). A scenario row REPLACES the place outright
  (`nightly-dreams/index.ts`, `applySceneRow` → `userPlace`/`iconicAnchor`), and no row carried a location link.
- Live shares `dual|single_scene_goofy/elegant/active_pct` = 6 / 6 / 8. `adaptiveScenePcts` grows the scenario
  window for dreamers with few picks (1 pick = 80%, 0 picks = 100% + the full-catalogue place fallback).
- `nightly_seeds` (6,665 surreal templates) is not read by any engine code: only its two generator scripts write it.

## Design

- **Tags, not moves.** A scenario row fuses a place with an action/pose authored to be face-swap safe, so rows stay
  in `dual_scenarios` / `single_scenarios` and gain tags (mig 591):
  - `location_keys text[]`: `location_cards.name` values the scene genuinely belongs to.
  - `location_categories text[]`: whole picker categories, only for generic scenes (a neon crosswalk → `iconic_cities`).
  - `proposed_location text`: a NEW category the row belongs to that isn't built yet (`carnival_fun`, …).
- **The filter** (`_shared/scenarioScope.ts`): a row reaches a dreamer when one of its keys is a card they picked, or
  one of its categories is the picker category of a card they picked. Untagged rows reach nobody. It fails CLOSED:
  no match → no scenario → the dream stays at their place. The scope is built from the places they CHOSE, before
  the zero-pick catalogue fallback.
- **Share rule:** a scene kind (goofy / elegant / active) needs `MIN_SCOPED_POOL` (10) matching rows to roll at all,
  so nobody sees the same 3 scenes on repeat; below that its share goes to the place. Applied before
  `adaptiveScenePcts`, so only kinds with matches grow for few-pick dreamers.
- **The switch:** `engine_config.nightly_scenarios_location_scoped` (default **false**). Off = today's behaviour
  exactly. QA: `force_scenario_scope: true|false` on a nightly request. A QA pool pin (`force_playful`,
  `force_single_active`, …) keeps the whole pool. Stamp: `scenario_scope:couple|solo:goofy=N:elegant=N:active=N`.
- **Rollback:** `UPDATE engine_config SET nightly_scenarios_location_scoped = false;` No deploy.

## Tagging (offline classifier)

Every live non-holiday row (14,008: couple + solo) is classified by Sonnet against the 163 live pickable cards and the
proposed categories. Rules that mattered in the pilot: Around Town is everyday MODERN LOCAL places only; wilderness
with no named place → the `epic_nature` category; eras → their era card; palaces/ballrooms by era or fairy tale;
precision over coverage (an empty result beats a wrong tag). Results are JSONL, then written in batched UPDATEs.

**Results (2026-09-30, two passes, Sonnet 4.6).** Pass 1 was strict (7,121 placed). Pass 2 re-read only the unplaced
rows with the "would the picker be surprised?" test and fixed group keys (+1,432). Written to the rows (batched
UPDATEs, headroom-checked; holiday rows untouched):

| Pool | Rows | Placed |
|---|---|---|
| goofy | 2,735 | 659 (24%) |
| elegant | 2,731 | 1,834 (67%) |
| active | 8,542 | 6,060 (71%) |
| **all** | **14,008** | **8,553 (61%)** |

Unplaced rows by proposed group (`proposed_location`): just_for_fun 2,716 · sports_arenas 521 · stage_spotlight 509 ·
adventure_sports 420 · surreal_absurd 296 · winter_wonderland 251 · retro_decades 249 · gardens_romance 229 ·
noir_1940s 142 · regency_era 106 · other 15. Pass 2 is looser, so its tags get a review before the switch goes on.

Dry run as Kevin, switch forced on: couple goofy 50 / elegant 17 / active 718 matching rows; solo (male) 50 / 4 / 954.

## Plan approved by Kevin (2026-09-30)

- **New tiles:** Just for Fun (goofy + everyday + carnivals), Sports & Arenas, Stage & Spotlight, Surreal Dreams, and
  World Traveler split into Europe / Asia & Pacific / The Americas / Middle East & Africa.
- **New cards inside existing tiles where they fit:** Winter Wonderland (Nature & Wild), Regency England, 1940s Noir,
  Retro Decades (Through Time), Gardens & Romance (Jet Set).
- **The tile list moves into the database**, so tiles change without an app release.
- **Surreal seeds:** keep only the good ones; the rest of `nightly_seeds` can be cleaned out.

## Done

| What | Where | State |
|---|---|---|
| First dream never rolls a holiday | `nightly-dreams` holiday resolve (`isFirstDream`), `firstDreamNoHoliday.test.ts` | Deployed 2026-09-30, dry-run proof: first dream `holiday_active:none:first_dream`, control `fall=50` |
| At least one place required | `lib/placeRequirement.ts`, `LocationPickerStep.tsx`, `useAutoSaveProfile({ requirePlace })`, `settings/locations.tsx`, `placeRequirement.test.ts` | Code done, ships with the next app build |
| Tags + switch | mig 591 (applied), loaders, `scenarioScope.ts`, `nightly-dreams`, `scenarioScope.test.ts` | Deployed with the switch OFF; dry runs: default unchanged, forced-on with no tags → 0 matches → place |
| Tags written | 14,008 rows, 8,553 placed | Verified by count; dry run sees them (above) |
| Regional wonders | mig 593 (applied): 4 cards (`wonders_regional`, admin-only), region-filtered sub_regions / must_include / TIME / WEATHER / PHENOMENA / SUBJECT_RULE, site-naming BANS dropped; 259 of World Wonders' 309 spots copied by region (EU 70, Asia 62, Americas 55, ME&A 72; 50 placeless stay behind). 44 of the 62 World Wonders scenario rows re-tagged with their regional card (the 18 no-site fantasy rows stay on World Wonders) | Dry runs: Asia scene → Ahu Tongariki moai; Europe solo → Skara Brae with the new Orkney squall weather; the colossal-face spot filter still applies |
| Scenario cards | mig 594 (applied): `location_cards.content_kind` ('place' / 'scenarios'); 9 cards, admin-only: Just for Fun (every goofy row + just_for_fun/carnival/around_town; 1,709 couple / 2,416 solo), Sports & Arenas, Adventure Sports, Stage & Spotlight, Winter Wonderland (Nature & Wild), Regency England, 1940s Noir, Retro Decades (Through Time), Gardens & Romance (Jet Set). Engine: a place roll landing on one draws a tagged scenario for a face-swap cast on the "stay at the place" outcome (holidays and the scenario shares still roll first) or for a forced first-dream place; anything else, or fewer than 10 scenarios for this cast, re-rolls to a real pick, else the catalogue; never an essence card | Deployed; dry runs: JFF couple → goofy draw; JFF scene-only → re-rolled to "high fantasy"; Regency / Winter solo and Stage / Sports couple → card draws; normal couple unchanged |
| Surreal Dreams | mig 597 (applied): 4 place cards in the Surreal Dreams tile (admin-only, biome fantasy_imagined, imagined=true): Land of Giants (`land of giants`, 65 spots), Gravity's Off (`gravity-free realm`, 73), Glowing Elements (`luminous realm`, 137), Impossible Whimsy (`impossible wonderland`, 91 + the 319 surreal-absurd scenario rows). Spots: the audit's 14 keep/mine categories (3,010 templates) rewritten by Sonnet to 4-10 word backdrops (1,453 kept), strictly re-graded, S only (+14 hand-checked A-grade medium spots for Land of Giants' cast pool). Recipes generated under a descriptive name, then renamed; biome_config + WARDROBE regenerated after seeding sub_regions / must_include from the spot pool (the first pass, name-only, wrote "megaliths" for Land of Giants and bans that contradicted the spots). Thumbnails for these 4 and the 9 scenario cards (`generate-location-thumbnails.js` now has prompts for the scenario cards) | QA round 1 (Kevin's Dreams album, captions "🌍 <key> — …"): Glowing Elements strong (solo 4 / 4, scene 4.5); Impossible Whimsy good (solo 3 / 4, scene 3.5-4); Gravity's Off mixed (+1 4 with floating café tables, self 2.5, scene 3: weightlessness barely reads); Land of Giants weak (the object doesn't read: a corkscrew became a spiral tower, a record player a speck). 3 of 4 couples rendered as plain portraits (the known illustrated-look couple plainness; the spot was in the prompt, after the couple as required) and Land of Giants' couple degraded to one face. Round 1 scene-only renders were all swallowed by the Fall roll, hence `force_no_holiday` |
| Tag verification | every classifier tag (11,241 card + category pairs) re-judged ("would the picker be surprised?"); 1,356 dropped (pass 1 kept 90%, pass 2 kept 78%); 604 rows lost every place tag | 13,521 of 14,008 rows reachable through some card; 8,247 at a real place; 487 dormant |
| Sports & Adventure rehomed (Kevin: "move the adventure part into nature and wild"; rehome over removal) | migs 598 + 599 (applied): tile retired; Adventure Sports dissolved into category tags where it happens (Nature & Wild 301, Tropical 74, Beach Towns 57; 79 dormant); Sports & Arenas → **Champions**, a scenario card in Heroes (482); motorsport → Race Track Garage (120); 77 dormant. 598's generator matched the table names wrong and added no tags; 599 adds them (1,034 rows, count-checked) | Dry run: Champions couple → "a World Cup goal in a packed stadium" |
| Stage & Spotlight rehomed (Kevin: "too thin of a niche for an entire tile ... some could probably move to LA or Hollywood"; remove what fits nowhere: "they sound lame") | mig 600 (applied): tile retired, card deleted; 691 scenes Sonnet-sorted: Los Angeles 69 (all film and TV sets), Las Vegas 127 (arena and pop stages), New York 13 (named only), Paris 24, London 11, Red Carpet 73, Roaring 20s 36, Retro Decades 29, 1950s 3; 306 removal candidates (unnamed opera houses + no stage identity) disabled only where no other place held them: 241 disabled, 65 stayed | 13,767 live shared scenarios; 599 live rows still fit no card (earlier steps) |
| Tiles in the database + World Traveler split | mig 592 (applied): `picker_tiles` (19 rows: 15 live, 4 new admin-only and empty), `location_cards.picker_tile`; `lib/pickerSections.ts`, `LocationPickerStep.tsx`, `pickerSections.test.ts` | DB live (old apps unaffected: they group by `picker_category`); the picker change ships with the next build. Anonymous read OK, anonymous write 401 |

## Next

1. **Go-live of the tiles (with the app build):** flip the 4 regional wonders cards `admin_only = false` and add them to
   the 41 users who have World Traveler saved (Kevin: "set them to have all the new locations"); the other 42 places
   need nothing, since picks are saved by name and every one of those users has all 43. World Wonders stays in their
   lists so the current app version keeps rendering it.
3. Scenario-backed cards for the tone/venue groups (the card's content IS its tagged scenarios), then point each
   group's `proposed_location` rows at the new card's `location_keys`.
4. Surreal Dreams: grade QA round 1 (up to 3 rounds to the 4.5 bar, LOCATION_SEED_PLAYBOOK.md); then retire the
   unused `nightly_seeds` rows (disabled, not deleted).
5. Kevin reviews the tags; app build (place requirement + DB tiles); switch on.

## Surreal seeds (`nightly_seeds`) audit, 2026-09-30

6,665 templates (31 categories × 215), generated 2026-04-14 and never read by the engine (the Scene DNA engine replaced
them that day: "literary, not visual"). Read 25 random rows per category (775):

- **Hygiene:** every row ends in `\r` (4,548 also in a stray `"`); `${thing}` (925 rows) has had no source since user
  objects were removed 2026-06-02; ~623 rows misuse `${place}` as a building type; 35 brand/artist/real-landmark hits.
- **Content:** 20% usable as a face-swap backdrop after a rewrite, 18% scene-only, 62% reject. 17 categories are dread,
  grief or body horror by design, or change the person (ageing, skin, doubles), which breaks the swap.
- **Keep (9):** peaceful_absurdity, giant_objects, broken_gravity, wrong_materials, bioluminescence, impossible_weather,
  cosmic, machines, impossible_architecture. **Mine (5):** music_sound, overgrown, childhood, decay_beauty,
  joyful_chaos. **Drop (17):** the rest.
- **Plan:** ~970 rows rewritten to the spot contract (4-10 words, no people, the place only; the interaction becomes an
  authored scenario action) → a **Surreal Dreams** tile with 4 cards: Land of Giants, Gravity's Off, Glowing Elements,
  Impossible Whimsy. The `surreal_absurd` scenario rows (296) belong there too. Per-category rates are ±19 points
  (25-row samples); the overall 20% is ±3.
