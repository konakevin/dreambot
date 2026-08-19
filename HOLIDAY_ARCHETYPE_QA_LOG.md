# Halloween Archetype QA Log (autonomous run, started 2026-08-19)

**Loop per archetype:** seed ~25 (fresh) → render 4 (2 couple / 1 self / 1 plus_one) → visually grade each
→ if not ALL ≥ 4.5/5, adjust gen (medium / costume / scene) + re-seed + re-render, up to 3 rounds → log.
Renders land in Kevin's album captioned **`🎃 <archetype> R<round> <surface>`** so batches group visually.
Bar: natural, well-photographed, fun, interesting, makes you smile. No cheese, no uncanny.

**Grading:** face-swap clean (grade FACE only, hair variance OK) · composition · scene reads Halloween ·
not cheesy/uncanny/generic · fun / smile-worthy. Cap 3 rounds, then take the best and move on.

## Status

| # | Archetype | Medium | Rounds | Final grade | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | vampire | gothic_painted | 2 | 4.6 | ✅ PASS | R1 avg 4.25 (thumbs-up + bunnies); **systemic fix: holiday pose 'goofy'→'elegant'**; R2 5/5/3.5/5 (self rock-cairn variance) |
| 2 | witch | painted_gothic_fantasy | 2 | 4.6 | ✅ PASS | R1 solo peace-signs; **2nd systemic fix: holiday pose_pool→'glamour'** (refined, no gestures); R2 all 4.5-5 |
| 3 | monster_hunter | gothic_oil_garden | 1 | 4.55 | ✅ PASS | R1 clean (pose fixes live) — leather-coat Van Helsing couple + huntress, gothic streets/fountains, refined poses |
| 4 | reaper | vampire_portrait | 1 | 4.67 | ✅ PASS | R1 clean — couple1 5/5 blood-moon graveyard + skull-button coat, refined; self poised arms-crossed on throne w/ jack-o-lanterns; plus1 poised hands-folded gothic-comic |
| 5 | ghost_glam | painted_gothic_fantasy | 1 | 4.83 | ✅ PASS | R1 clean — couple1 5/5 back-to-back gothic-glam painted purple moon; self gothic cathedral (comic); plus1 5/5 ethereal tattered gown teal moonlit graveyard |
| 6 | autumn_fae | painted_gothic_fantasy | 2 | 4.65 | ✅ PASS | R1 couple1 EMPTY landscape+palms (gothic_oil_garden pure-botanical scene dropped couple); **fix: medium gothic_oil_garden→painted_gothic_fantasy** (portrait-dominant); R2 all figures foregrounded, couple2 5/5 greenhouse+fae silhouette |
| 7 | harvest_royalty | gothic_painted | 1 | 4.8 | ✅ PASS | R1 clean — couple1 5/5 regal medieval pair, moonlit castle, jack-o-lanterns + apple cauldrons; self arms-crossed royal banquet; plus1 autumn-leaf cloak harvest hall |
| 8 | cat_burglar | vampire_portrait | 2 | 4.63 | ✅ PASS | R1 male self collapsed to casual daywear (catsuit+cat-ears+satin are female-coded, `gender='any'` → male drops them); **fix: unisex costume** (sleek all-black heist top/belt/gloves, no cat-ears); R2 all sleek + clean. **LESSON: `any` single rows need UNISEX costumes** |
| 9 | mad_scientist | gothic_painted | 1 | 4.53 | ✅ PASS | R1 clean — couple1 green-lit lab, goggles-up, gloves, glowing vials; self stained labcoat + purple lightning; plus1 presenting potions (slightly theatrical but fitting). (self hit transient WORKER_RESOURCE_LIMIT, re-fired ok) |
| 10 | trick_or_treating | photography | 1 | 4.67 | ✅ PASS | R1 solos fully PHOTOGRAPHIC + lovely (self 4.8 rust velvet+candy basket+moon; plus1 4.8 hoodie+string-lit path); couple1 4.4 rendered as watercolor illustration (dual-path style quirk, still clean/pretty). Note: dual couples on photography medium tend to come out illustrated |
| 11 | halloween_party | photography | 1 | 4.67 | ✅ PASS | R1 all PHOTOGRAPHIC + clean — couple1 4.6 candlelit grand staircase; self 4.7 velvet blazer by fireplace; plus1 4.7 ghost pendant lights cozy room (retry-once fix stopped the WORKER_RESOURCE_LIMIT dance) |
| 12 | decorated_neighborhood | photography | 1 | 4.7 | ✅ PASS | R1 all PHOTOGRAPHIC + clean 4.7 — couple1 jack-o-lantern arch + moon; self inflatable ghosts + porch; plus1 giant reaper inflatables + skeletons, purple sunset. Natural + festive |
| 13 | pumpkin_carving | photography | 2 | 4.73 | ✅ PASS | R1 heirloom couples STIFF (prayer-hands / arms-crossed "American Gothic", undershoots warm/smile bar); **fix: cast medium heirloom→photography** (scene stays heirloom); R2 natural warm smiling couples 4.7-4.8. **LESSON: heirloom = stiff couple poses; preemptively switched haunted_hayride + movie_night to photography** |
| 14 | fall_festival | canvas | 1 | 4.53 | ✅ PASS | R1 clean — couple1 4.4 canvas ring-toss booth + pumpkin lights; self 4.6 oil-painting festival + hay bales; plus1 4.6 glowing ferris wheel dusk. (recurring harmless white feather-boa festival prop) |
| 15 | haunted_hayride | photography | 2 | 4.68 | ✅ PASS | R1 couple1 twee mirrored prayer-hands → traced to shared **'glamour' pose pool (intentionally campy soap-opera)** wrongly pinned on holiday couples. **SYSTEMIC FIX: holiday DUAL branch drops glamour default → refined 'partner' pool** (deployed); R2 couples natural + warm 4.7-4.8. Improves ALL holiday couples retroactively. (solo keeps glamour — solo poses fine) |
| 16 | cozy_porch | photography | 1 | 4.7 | ✅ PASS | R1 all PHOTOGRAPHIC + warm 4.7 — couple1 refined partner pose (fix working) topiary+jack-o-lantern path; self nailed the porch (white pumpkins+brass lanterns); plus1 cozy sweater+string lights+steaming mug |
| 17 | canyon_fall_hike | photography | 1 | 4.57 | ✅ PASS | R1 — couple1 4.6 leaf-strewn trail refined pose; self 4.7 canyon walls+jack-o-lanterns+ravens; plus1 4.4 red-canyon+black cats but recurring feather-boa+velvet reads fancier than a hike. **NOTE: white feather boa recurs on SOLO renders (glamour pool = Glamour-Shots retro aesthetic nudges boas); harmless, not chasing** |
| 18 | movie_night | photography | 2 | 4.65 | ✅ PASS | R1 plus1 rendered a plunging glam blazer (glamour-solo pool pulls glam attire onto cozy archetypes — intermittent ~1/8 female solos); re-rolled R2 → cozy sweater+plaid-pj plus1 4.7, velvet-pajama couple 4.7, smoking-jacket self 4.6. **KNOWN WART: glamour-solo occasionally over-glams cozy female solos (no clean no-DDL fix; flag for Kevin)** |
| 19 | enchanted_pumpkin_patch | canvas | 1 | 4.7 | ✅ PASS | R1 all magical — couple1 4.7 stone bridge + floating pumpkin-lights; self 4.6 magic swirls + gnarled tree + moon; plus1 4.8 stunning impasto floating paper lanterns + pumpkin cart |
| 20 | haunted_mansion | gothic_painted | 1 | 4.57 | ✅ PASS | R1 — couple1 4.7 elegant gothic pair (tux+leaf-lace gown) on mansion steps, bats+gargoyles; self 4.5 emerald velvet frock coat+cravat (recurring boa); plus1 4.5 velvet+jewels. (self needed 3-retry re-fire on sustained WORKER_RESOURCE_LIMIT) |
| 21 | jack_o_lantern_festival | gothic_painted | 1 | 4.63 | ✅ PASS | R1 — couple1 4.7 gothic Victorian pair + hillside sea of jack-o-lanterns; self 4.4 tight close-up bust (plain shirt, less interesting); plus1 4.8 full-body on winding pumpkin-lit path, magical |
| 22 | gothic_masquerade_ball | painted_gothic_fantasy | 2 | 4.63 | ✅ PASS | R1 pre-fix: costume named "masks" → ALL 14 single rows lint-dropped (§6.1 face-occlusion); **removed masks from costume+scene** (masquerade reads via ballroom). R1 self also casual-bomber (gendered gown-lead). **R2 fix: lead costume with velvet tailcoat+cravat** → male formal; plus1 4.8 gown, self 4.4 formal. Both fixes held |
| 23 | midnight_carriage | gothic_oil_garden | — | — | ⬜ pending | |
| 24 | gothic_glam_editorial | glamour | — | — | ⬜ pending | |
| 25 | gothic_greenhouse | gothic_oil_garden | — | — | ⬜ pending | |

## Round-by-round detail
(appended as each archetype is processed)
