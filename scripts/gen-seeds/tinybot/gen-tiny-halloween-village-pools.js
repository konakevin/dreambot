#!/usr/bin/env node
// AlphaBot — tiny-halloween-village candidate path (prototyped for eventual
// promotion to TinyBot, per BOT_SCENE_QUALITY_PLAYBOOK.md / ALPHABOT.md).
//
// A miniature Halloween-village diorama sibling to the proven
// tiny-winter-village path: a lantern-lit tiny town square dressed for the
// season, MANDATORY tiny critter residents (mice/hedgehogs/voles) caught
// mid Halloween activity, and a true-to-life-scale everyday object planted
// beside the buildings so the miniature reads unmistakably tiny (the
// money-shot "scale-prover" axis). MVP-25, three generated pools:
//   - scene         : the Halloween-village world (3-clause layered format,
//                     mirrors tiny_winter_village.json)
//   - cast          : critter + Halloween-action entries (mirrors
//                     tiny_winter_village_cast.json)
//   - scale_prover  : one real-world object at true scale beside the village
//
// Run: node scripts/gen-seeds/tinybot/gen-tiny-halloween-village-pools.js
//
// Promoted from AlphaBot to TinyBot (2026-09-07) — approved Halloween
// candidate, mechanical relocation only.
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/tinybot/seeds/';

(async () => {
  await generatePool({
    outPath: DIR + 'tiny_halloween_village_scene.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are a master model-maker writing MINIATURE HALLOWEEN-VILLAGE scenes for TinyBot's tilt-shift diorama style. Each entry is ONE dollhouse-scale Halloween town vignette — a lived-in little world dressed for the season, never a single object on a bare surface. Write ${n} entries.

━━━ FORMAT (mirror exactly) ━━━
Each entry is THREE clauses separated by semicolons, moving foreground → midground → far-distance, ~25-40 words total. Comma-separated phrases within each clause, no full sentences with periods until the very end of the entry.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A carved pumpkin lantern chain lines a crooked cobbled lane; matchbox cottages lean together with candlelit orange windows; thread-thin fairy-bats swing on threads fading into indigo dusk."
"A cauldron of cider steams over a bead-sized bonfire in the square; black-and-orange bunting zigzags between lamp posts and shop awnings; a distant windmill silhouette turns slow against a huge harvest moon."
"A hay-bale maze curls around the chapel steps, one bale crowned with a grinning jack-o-lantern; strings of paper-ghost lanterns sway over the cobblestones; the village rooftops fade into soft violet fog."

━━━ VILLAGE VIGNETTE VARIETY — rotate across ALL of these (never cluster on one) ━━━
1. Crooked cottage lane strung with a jack-o-lantern lantern-chain
2. Cobbled town square with a central bonfire or steaming cauldron
3. Pumpkin-patch edge at the village border, a friendly scarecrow leaning nearby
4. A cheerful clocktower draped loosely in silvery cobweb bunting
5. Candy-corn-striped market stalls lining a lantern-lit street
6. A crooked wooden bridge over a still black-water canal with lily-pad lanterns
7. A witch's-cottage bakery with a crooked chimney puffing lavender smoke
8. A hay-bale maze at the square's edge strung with warm lights
9. A row of gabled houses each with a different grinning pumpkin on the porch
10. A windmill draped in cobweb bunting, a bat-shaped weathervane on top
11. A trick-or-treat lane with paper-lantern ghosts strung overhead between shopfronts
12. A fountain square converted for the season into a bobbing-apple basin
13. A rooftop line of black cats and perched crows silhouetted against the moon
14. A tiny costume-shop window glowing on a village corner
15. A pumpkin-carving contest table set up mid-square with tools and pumpkin shavings
16. An orchard edge with cider-press barrels and a apple-bobbing tub
17. A crooked footbridge to a small gazebo island strung with orange lanterns
18. A cottage porch stacked with carved pumpkins ready for trick-or-treaters
19. A village well decorated with a spiderweb of silver thread and hanging lanterns
20. A crooked signpost square where three lantern-lit lanes converge

━━━ MANDATORY IN EVERY ENTRY ━━━
- Warm jack-o-lantern amber-orange glow as the dominant light source somewhere in the scene
- At least one specific Halloween decoration (bunting, cobweb, carved pumpkin, paper-bat, etc.)
- Foreground / midground / far-distance depth layering (the 3-clause format enforces this)
- Miniature scale language implied by materials/props (matchbox, thumb-sized, thread-thin, bead-sized, sugar-cube, etc.)

🚫 STRICT BANS: NO humans or human silhouettes, NO gore, NO genuine horror/scares, NO real skulls/bones, NO IP-named locations, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing ("not scary" etc — just write it playful).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'tiny_halloween_village_cast.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MANDATORY tiny critter cast for TinyBot's miniature Halloween-village path. Each entry is ONE short sentence: a real small woodland animal caught mid a specific Halloween activity. These critters are the village's inhabitants — never humans, never upright cartoon-mascot "creature-people," always proportioned like an actual small animal (button nose, whiskers, paws, fur/quills). Write ${n} entries, ~10-20 words each.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A mouse in a tiny felt witch-hat carries a candy-corn kernel home in both paws."
"A hedgehog rolls a carved acorn-cap pumpkin down the cobbled lane with its nose."
"A vole strings a cobweb-thin garland of paper bats between two porch posts."

━━━ SPECIES MIX — bias heavily toward the mandatory three, cameo the rest ━━━
~70% of entries: mice, hedgehogs, voles (mix freely, repeat species across different actions)
~30% of entries: chipmunks, red squirrels, rabbits, moles, or shrews (variety cameos)

━━━ HALLOWEEN ACTIVITY VARIETY — rotate across ALL of these ━━━
1. Carving or painting a tiny pumpkin face
2. Trick-or-treating door to door with an acorn-cap basket
3. Lighting a candle stub inside a carved pumpkin lantern
4. Wearing a tiny stitched-leaf cloak or felt costume piece
5. Bobbing for a berry in a thimble of water
6. Stringing cobweb or paper-bat bunting between posts
7. Roasting a chestnut over a bead-sized bonfire
8. Sorting candy corn into little piles
9. Sitting on a porch step handing out treats
10. Perched atop a pumpkin on lookout duty
11. Pulling a candy-corn-kernel cart down the lane
12. Decorating a doorway with dried leaves and berries
13. Popping halfway out of a carved pumpkin hole, startled
14. Riding a twig broom like a hobby-horse
15. Stacking miniature hay bales for the maze
16. Hanging a lantern along a fence line
17. Arranging candy into a bowl by a cottage door
18. Peering into a cauldron of steaming cider
19. Sweeping cobwebs off a porch with a twig broom
20. Racing another critter down the lantern-lit lane, capes fluttering

🚫 STRICT BANS: NO human age/gender words (man/woman/boy/girl/person/etc — these are animals), NO upright human-posed "mascot" framing, NO scary/menacing critter expressions — always warm, cozy-spooky, playful. NO IP-named characters.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'tiny_halloween_village_scale_prover.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MONEY-SHOT "scale-prover" axis for TinyBot's miniature Halloween-village path — the single detail that makes the shot iconic. Each entry describes ONE real-world, everyday, full-size object placed beside or within the tiny village at its TRUE size, so the viewer instantly reads how small everything else is by comparison (the classic "acorn next to a dollhouse" trick). Write ${n} entries, ~15-30 words each, one sentence.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A single fallen oak leaf drapes over one cottage roof like a copper tarp, its veins arcing above the tiny chimney."
"A real acorn cap rests overturned beside the well, repurposed by the village as a small cauldron."
"A dropped copper penny lies flush in the cobblestones at the square's edge, gleaming like a manhole cover."

━━━ OBJECT VARIETY — rotate across ALL of these categories, never repeat the same object twice ━━━
1. A carved jack-o-lantern (real, giant relative to the village) looming at the village edge
2. A fallen autumn leaf (oak/maple) draped over a rooftop like a tarp or awning
3. An acorn or acorn cap repurposed as a cauldron, well-bucket, or barrel
4. A spool of black thread or embroidery floss used as a hitching post or fence coil
5. A dropped coin (penny, button) lying flush in the cobblestones like a manhole cover
6. A single candy-corn kernel the size of a canoe resting against a shop wall
7. A chestnut or walnut shell, overturned, used as a cart-bed or wheelbarrow
8. A real spiderweb strung between two real twigs/branches towering high over the square
9. A crow or blue-jay feather laid across the square like a fallen banner or bridge
10. A dried corn husk stretched as a canopy or awning over a market stall
11. A thimble repurposed as a barrel, planter, or well-bucket
12. A single russet apple resting near the cider stand, bigger than a cottage
13. A twig-broom leaning against a wall, taller than the rooftop beside it
14. A dried thistle-head (on its stem, not a round burr) used as a spiky hedge or garden ornament
15. A pumpkin-seed husk used as a boat hull on the village pond
16. A dewdrop-strung spiderweb strand stretched between two lamp posts like real rope
17. A pinecone repurposed as a lantern-post finial or garden statue
18. A hazelnut or other pointed, non-round nut/seed, unmistakably egg-shaped rather than pumpkin-round

🚫 STRICT BANS: NO humans, NO human-made modern objects (phones, cars, tools branded), NO IP names, NO gore/skulls/bones, NO readable text/labels. The object must read as genuinely full-size/real, not another miniature prop. NO garden-snail shells and NO round burdock-style burrs — both were tested twice (2026-09-06) and reliably vanish or blur away even with correct co-location and focal-plane phrasing; do not reintroduce either without a fresh render proving otherwise.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
