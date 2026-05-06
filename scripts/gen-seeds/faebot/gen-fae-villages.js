#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/fae_villages.json',
  total: 200,
  batch: 25,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} unified descriptions of ENCHANTED FAE DWELLINGS — homes, villages, halls grown from the forest itself. Each entry: 40-65 words, ONE paragraph (not a field list).

━━━ THE TARGET ━━━
A glimpse of an exotic, magical, lived-in fae home that grew from the forest itself. Manchess + Giancola + Bonner + NC Wyeth + Frazetta + Eyvind Earle painted-fantasy lineage. The kind of dwelling that, glimpsed in a clearing, makes you stop and think "elves and woodfolk LIVE there."

━━━ ORGANIC ONLY — NEVER BUILT, ALWAYS GROWN ━━━
Made entirely of LIVING FOREST MATERIALS that blend INTO the forest:
- Living bark grown into walls / arches / doorways
- Mushroom caps as roofs (toadstool / bracket-fungi / chanterelle)
- Hollowed roots, hollowed-stump dwellings, hollowed-trunk homes
- Vine-woven walls, bramble-thatch, willow-stem framing
- Layered leaf-thatched roofs (mega-fern / oak / willow)
- Moss-carpets, lichen-skinned walls, fungi-shelved walls
- Spider-silk drapes, cobweb curtains
- Honeycomb-wax windows that glow amber from within
- Petal-shingled roofs, woven-grass mats
- Naturally-shed antlers / bones / pinecones / seeds as accents
- Acorn-cap stools, walnut-shell bowls
- Glow-fungus sconces, firefly chandeliers, glowworm-string lights, dewdrop chandeliers

ABSOLUTELY BANNED: stone, brick, masonry, milled lumber, sawn planks, metal hardware, glass windows, modern construction. Use organic equivalents only.

━━━ STACK 5+ EXOTIC FEATURES PER ENTRY ━━━
Every entry must include 5+ of:
- Specific living material (oak-bark / mushroom-cap / hollowed root / vine-woven / honeycomb-wax)
- Magical lighting signature (firefly chandelier / glow-fungus sconces / dewdrop-pearl strings / glowworm porches)
- Surrounding context (rooted into mega-tree / hidden in fern-glade / floating on lily-pond / clustered in canopy / dug into hill)
- Architectural detail (spiraling moss-stair / vine-curtain doorway / antler-eaves / acorn-cap chimney / honey-amber porthole)
- Magical atmosphere (pollen-dust drifting / dewdrop-rain / dapple-light through canopy / firefly-cloud orbiting eaves)
- Sign of habitation (woven-grass welcome mat / lit windows / smoke-feather rising though no fire / garlands of flowers / tiny tools left out)

━━━ DWELLING TYPE VARIETY (rotate broadly) ━━━
- SINGLE FAE HOME (lone dwelling — dryad's bramble-arbor, naiad's reed shrine, fox-spirit's hollow-tree)
- VILLAGE CLUSTER (mushroom hamlet, treehouse settlement, fairy-mound burrow community)
- COURT HALL (Tylwyth Teg moss-throne hall, leshy's antler-vault, kodama tree-shrine)
- HIDDEN BURROW (hill-mound, hollow-log home, between-roots chamber)
- CANOPY VILLAGE (vine-bridge platforms, lantern-lit walkways)
- POND DWELLINGS (lily-pad villages, naiad shrines)
- MUSHROOM HAMLET (toadstool homes around a glow-fungus center)

━━━ SAMPLE ━━━
"A hollowed ancient oak with bark-arch entrance grown into a doorway, layered fern-frond shingled roof, honey-amber honeycomb-wax windows glowing warm from within, dewdrop chandelier hanging in the porch, firefly-cloud orbiting the eaves, woven-vine ladder spiraling around the trunk to a higher chamber, fern-fronds curtaining the lower entrance like a living door, glow-mushroom sconces lighting a moss-pathway leading away into deeper forest, painted in golden afternoon light."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown code fences. Just the array.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
