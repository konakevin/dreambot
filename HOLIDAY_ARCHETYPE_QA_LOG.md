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
| 10 | trick_or_treating | photography | — | — | ⬜ pending | |
| 11 | halloween_party | photography | — | — | ⬜ pending | |
| 12 | decorated_neighborhood | photography | — | — | ⬜ pending | |
| 13 | pumpkin_carving | heirloom | — | — | ⬜ pending | |
| 14 | fall_festival | canvas | — | — | ⬜ pending | |
| 15 | haunted_hayride | heirloom | — | — | ⬜ pending | |
| 16 | cozy_porch | photography | — | — | ⬜ pending | |
| 17 | canyon_fall_hike | photography | — | — | ⬜ pending | |
| 18 | movie_night | heirloom | — | — | ⬜ pending | |
| 19 | enchanted_pumpkin_patch | canvas | — | — | ⬜ pending | |
| 20 | haunted_mansion | gothic_painted | — | — | ⬜ pending | |
| 21 | jack_o_lantern_festival | gothic_painted | — | — | ⬜ pending | |
| 22 | gothic_masquerade_ball | painted_gothic_fantasy | — | — | ⬜ pending | |
| 23 | midnight_carriage | gothic_oil_garden | — | — | ⬜ pending | |
| 24 | gothic_glam_editorial | glamour | — | — | ⬜ pending | |
| 25 | gothic_greenhouse | gothic_oil_garden | — | — | ⬜ pending | |

## Round-by-round detail
(appended as each archetype is processed)
