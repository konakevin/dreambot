#!/usr/bin/env node
// AlphaBot — tiny-pumpkin-patch candidate path (prototyped for eventual
// promotion to TinyBot, per BOT_SCENE_QUALITY_PLAYBOOK.md / ALPHABOT.md).
//
// A miniature Halloween PUMPKIN-PATCH FIELD at golden late-day light — the
// daytime sibling to tiny-halloween-village's night-time town square. The
// money moment: a tiny critter (mouse/hedgehog, biased) caught MID-CARVE,
// turning a real berry or tiny gourd into a jack-o-lantern face right in
// frame. MVP-25, three generated pools:
//   - scene         : the pumpkin-patch field world (3-clause layered format,
//                     mirrors tiny_halloween_village_scene.json's structure
//                     but daytime/golden-hour/field content)
//   - cast          : critter ACTIVELY CARVING a berry/gourd (every entry
//                     shows the carve itself in progress — this path's core
//                     identity, not a generic Halloween-activity grab-bag)
//   - scale_prover  : one real-world FARM/GARDEN everyday object at true
//                     scale beside the patch (the money-shot axis)
//
// Run: node scripts/gen-seeds/tinybot/gen-tiny-pumpkin-patch-pools.js
//
// Promoted from AlphaBot to TinyBot (2026-09-07) — approved Halloween
// candidate, mechanical relocation only.
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/tinybot/seeds/';

(async () => {
  await generatePool({
    outPath: DIR + 'tiny_pumpkin_patch_scene.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are a master model-maker writing MINIATURE PUMPKIN-PATCH FIELD scenes for TinyBot's tilt-shift diorama style. Each entry is ONE dollhouse-scale autumn-harvest-field vignette — a lived-in little patch of vine rows and farm clutter, never a single object on a bare surface. This is a FIELD, not a village street — no cottages, no cobblestones, no town square. Write ${n} entries.

━━━ FORMAT (mirror exactly) ━━━
Each entry is THREE clauses separated by semicolons, moving foreground → midground → far-distance, ~25-40 words total. Comma-separated phrases within each clause, no full sentences with periods until the very end of the entry.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A rustic wooden wheelbarrow tips with a fresh haul of thumb-sized gourds at a row's end; sprawling vines heavy with berries and miniature pumpkins recede in tidy rows; a weathered barn silhouette fades into the hazy golden distance."
"A stack of wicker harvest baskets brims with speckled gourds beside a leaning fence post; a dirt cart-track threads between the vine rows toward a lone scarecrow; a windbreak of bare trees rims the field in soft amber haze."
"A coil of garden twine loops over a split-rail fence beside a half-filled wooden crate; rows of trellised vines climb toward a cluster of stacked hay bales; the far tree line dissolves into a warm golden-hour glow."

━━━ FIELD VIGNETTE VARIETY — rotate across ALL of these (never cluster on one) ━━━
1. A rustic wheelbarrow tipped with a fresh haul of tiny gourds at a row's end
2. A leaning split-rail fence strung with a few dried corn husks
3. A weathered scarecrow on a single post watching over one corner of the field
4. Stacked wicker harvest baskets brimming with berries and small gourds by a fence post
5. A dirt cart-track winding between the rows toward a distant barn silhouette
6. A row of small wooden crates lined up, half-filled with the day's picking
7. A leaning ladder against a fence post, a coil of twine looped over the rail
8. A cluster of hay bales stacked at the field's edge, one crowned with a lone pumpkin
9. A trellis of climbing vine at the patch border, berries dangling in loose clusters
10. A shallow puddle from an earlier rain mirroring the golden sky at a row's end
11. A weathered stone or wood well-marker at the patch's center, moss-softened with age
12. A stack of burlap sacks piled near a gate, ready for the day's haul
13. A rickety farm gate standing ajar at the patch entrance, hinges rust-spotted
14. A single fat, oversized "prize" gourd resting alone in its own worn patch of dirt
15. A cluster of tiny toadstools growing at the base of a fence post, overlooked by the harvest
16. A shallow two-wheeled cart, loaded and waiting at the row's end
17. A line of tall dried cornstalks bundled and leaning together at the field's border
18. A worn dirt path forking between two rows, flanked by low leafy pumpkin vines
19. A low stone wall bordering the field, capped with a row of small ripening gourds
20. A weathered tool shed door standing ajar at the field's far corner
21. A row of upturned wooden buckets used as picking-stools between the vines
22. A bramble of wild berry bushes crowding one corner of the fenced field

━━━ MANDATORY IN EVERY ENTRY ━━━
- A hint of golden late-day sun somewhere in the scene (long shadows, warm amber wash, low sun) — this is a DAYTIME field, never night
- At least a light scatter of fallen autumn leaves somewhere among the rows or fence lines
- Foreground / midground / far-distance depth layering (the 3-clause format enforces this)
- Miniature scale language implied by materials/props (thumb-sized, matchbox, thread-thin, bead-sized, sugar-cube, etc.)
- A FIELD of vine rows, fences, and farm clutter — never a town street, never cottages, never cobblestones

🚫 STRICT BANS: NO humans or human silhouettes, NO gore, NO genuine horror/scares, NO real skulls/bones, NO IP-named locations, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing ("not scary" etc — just write it playful), NO night/dusk/moonlit language (daytime only).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'tiny_pumpkin_patch_cast.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MANDATORY tiny critter carving-cast for TinyBot's miniature Halloween pumpkin-patch path. Each entry is ONE short sentence: a real small woodland animal ACTIVELY CARVING a berry or tiny gourd into a jack-o-lantern face — this carving-in-progress moment is the path's signature money-shot, so EVERY entry must show the carve itself happening (a tool touching the berry/gourd, a curl or sliver of peel coming away, a notch being cut) — never already-finished, never just holding or admiring it. Real small-animal proportions only (button nose, whiskers, paws, fur or quills), never an upright human-posed "mascot" creature, never a human. Write ${n} entries, ~10-20 words each.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A mouse braces a plump rosehip between both paws, carving a gap-toothed grin with a sharpened thorn."
"A hedgehog balances a tiny gourd on its knees, whittling a wink-eyed face with a curved snail-shell sliver."
"A chipmunk kneels over a crabapple, tongue poked out in concentration, notching a crooked smile with a fish-bone shard."

━━━ SPECIES MIX — bias heavily toward the mandatory two, cameo the rest ━━━
~70% of entries: mice and hedgehogs (mix freely, repeat species across different carving details)
~30% of entries: chipmunks, voles, red squirrels, or rabbits (variety cameos)

━━━ CARVING-DETAIL VARIETY — rotate the BERRY/GOURD + TOOL + FACE + POSTURE across ALL of these ━━━
1. A plump rosehip carved with a sharpened thorn
2. A crabapple carved with a fish-bone sliver
3. A tiny ornamental gourd carved with a curved snail-shell sliver
4. A hawthorn berry carved with a sliver of sharp bark
5. A miniature acorn squash carved with a chip of flint
6. A wild rosehip cluster, one berry singled out and carved with a sewing-pin-thin sliver of wood
7. A speckled gourd carved with a filed-down beetle-shell shard
8. A holly berry carved with a curled thorn-tip
9. A small striped gourd carved with a sharp seed-hull edge
10. A crabapple half carved, curls of peel piled beside tiny paws
11. Gap-toothed grinning face being notched
12. A wink-eyed face mid-carve, one eye already cut
13. A silly cross-eyed face taking shape under the tool
14. A gentle round-mouthed smile being carved
15. A surprised open-mouth "O" face mid-cut
16. Tongue poked out in fierce concentration while carving
17. One paw steadying the berry while the other guides the tool
18. Standing on hind legs to carve, braced against the gourd
19. Sitting cross-legged with the berry balanced on both knees, carving
20. A small pile of pulp shavings and seeds growing beside the work

🚫 STRICT BANS: NO human age/gender words (man/woman/boy/girl/person/etc — these are animals), NO upright human-posed "mascot" framing, NO scary/menacing critter expressions — always warm, cozy-spooky, playful, concentrating. NO gore/blood language (just peel curls and seeds). NO IP-named characters. NO entry where the carving is already finished — the tool must be actively touching the berry/gourd.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'tiny_pumpkin_patch_scale_prover.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MONEY-SHOT "scale-prover" axis for TinyBot's miniature Halloween pumpkin-patch path — the single detail that makes the shot iconic. Each entry describes ONE real-world, everyday, FARM-or-GARDEN-themed object placed beside or within the tiny patch at its TRUE size, so the viewer instantly reads how small everything else is by comparison (the classic "acorn next to a dollhouse" trick, but drawn from garden-shed and farmhand clutter rather than generic forest debris). Write ${n} entries, ~15-30 words each, one sentence.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A single canvas gardening glove lies fingers-splayed across two rows like a fallen tarp, its stitching huge as rope."
"A real ball of jute twine rests at the field's edge, taller than the fence posts beside it."
"A dropped copper penny lies flush in the dirt at a row's end, gleaming like a manhole cover."

━━━ OBJECT VARIETY — rotate across ALL of these categories, never repeat the same object twice ━━━
1. A canvas or leather gardening glove, fingers splayed like a fallen tarp
2. A ball of jute twine or garden string, dwarfing the fence posts
3. A wooden clothespin, straddling a row like a fallen beam
4. A dropped coin (penny, nickel, button) lying flush in the dirt like a manhole cover
5. A wristwatch or leather bootlace looped across a row like a fallen cable
6. A blank wooden plant-marker stake (no readable text), towering over the vines
7. A rubber boot's tread-print pressed deep into the dirt beside the patch
8. A brass safety pin, half-open, resting near a fence post like a fallen archway
9. A pencil stub, its graphite tip huge beside a wagon wheel
10. A burlap scrap, torn and draped over a crate corner like a tarp
11. A wooden ruler stub, its markings huge, laid across two rows like a footbridge
12. A rubber band, looped loosely around a fence post like a giant hair-tie
13. A tin jar lid, overturned and repurposed by the scene as a shallow basin
14. A paperclip, bent open and leaned against a crate like scrap metal
15. A single work-boot lace, coiled beside the wheelbarrow like rope
16. A shirt button, four-holed and huge, half-buried in the dirt near a row
17. A bicycle bell, tarnished and huge, resting on its side near the gate
18. A wooden matchstick (unlit), lying across the cart-track like a fallen beam

🚫 STRICT BANS: NO humans, NO branded or IP-named objects, NO gore/skulls/bones, NO readable text/labels, NO electronics/modern-tech objects (phones, chargers). The object must read as genuinely full-size/real, not another miniature prop.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
