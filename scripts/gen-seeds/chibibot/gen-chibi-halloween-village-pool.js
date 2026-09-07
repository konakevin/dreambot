#!/usr/bin/env node
// AlphaBot candidate — chibi-halloween-village (destination: ChibiBot).
// A cozy chibi-critter HALLOWEEN VILLAGE: lantern-lit cobblestone street /
// pumpkin-patch fair / town square, wide establishing shot, MULTIPLE cute
// critters trick-or-treating / decorating / gathered together. Playful
// family-friendly Halloween only — grinning jack-o-lanterns + friendly
// ghosts, never real horror or gore. 6 bespoke pools, grown from MVP-25 to
// production depth (target 120, append: true — keeps the tested MVP-25).
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // ─── VILLAGE — the wide establishing stage (always present) ───
  await generatePool({
    outPath: DIR + 'chibi_halloween_village_scene.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} HALLOWEEN VILLAGE staging scenes for a cute chibi-creature Halloween bot. Each is a WIDE establishing shot of a cozy village at Halloween — a lantern-lit cobblestone street, a pumpkin-patch fair, or a town square — caught mid-celebration. The village is the hero: a lived-in little world with foreground / midground / background depth layers, NOT a single object on a bare stage. Playful family-friendly Halloween (grinning jack-o-lanterns, cheerful decor) — never genuine horror or gore. Each entry 30-45 words, dense and specific. NO humans mentioned (this is a creature-only bot — describe architecture/setting only, no people).

━━━ SPAN ACROSS ALL ${n} (don't cluster on one sub-concept) ━━━
- a lantern-lit cobblestone street winding between crooked timber shops strung with garlands
- a bustling pumpkin-patch fair with a hay-bale maze and market stalls
- a town square centered on a fountain draped with cheerful cobwebs
- a covered wooden bridge over a misty creek strung with bat-shaped lanterns
- a harvest market lane lined with cider stalls and stacked pumpkin pyramids
- a hillside orchard path with apple-bobbing barrels and a bonfire glow
- a village green mid-scarecrow-building contest, hay and ribbons scattered about
- a cobblestone plaza ringed by candy-corn-striped shop awnings
- a canal-side lane with little lantern-boats drifting past gabled cottages
- a garden courtyard turned cheerful pumpkin-carving fair, string-lights overhead
- a windmill-topped hillside village mid-harvest-festival
- a covered market hall strung with paper-bat garlands and hanging gourds
- a lantern-lined bridge crossing leading to a bonfire circle
- a cottage row with wraparound porches decorated for trick-or-treat
- a clocktower square mid costume-parade, confetti and bunting overhead
- a barn-and-silo farmstead turned friendly hayride fair
- a lighthouse-village dusk gathering with a pumpkin-lit dock
- a stone-well courtyard ringed with carved pumpkins for a harvest game
- a treehouse village strung with glowing paper-ghost lanterns
- a mill-pond village with lantern-lit rowboats and a floating pumpkin raft

━━━ EXAMPLES (match this format/length/density) ━━━
"A lantern-lit cobblestone street curves between leaning timber-and-stone cottages, warm windows glowing gold, cobweb bunting looped lamppost to lamppost, a market stall of stacked pumpkins in the near foreground, the lane fading into soft autumn-dusk haze."
"A bustling pumpkin-patch fair spreads across a hillside field, a hay-bale maze winding through rows of ripe orange pumpkins, striped market tents glowing warm in the midground, a distant windmill silhouetted against a deepening violet sky."
"A cobblestone town square gathers around a mossy stone fountain draped in glittery cobwebs, candy-corn-striped awnings ringing the plaza, strings of paper-bat lanterns crisscrossing overhead, cottages with lit upstairs windows receding into the misty background."

━━━ RULES ━━━
No brand/real-place names, no readable text, no humans/people/children (creature-only bot). No genuine horror — cheerful and playful only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── CAST — chibi critters mid-Halloween-activity (2-3 picked per render) ───
  await generatePool({
    outPath: DIR + 'chibi_halloween_village_cast.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} CHIBI CREATURE cast entries for a Halloween-village bot. Each entry is ONE small chibi creature (a real animal or cute fantasy critter) wearing its OWN tiny Halloween costume and mid an activity (trick-or-treating, carving, decorating, playing a harvest game). This is the single hardest rule: NEVER use a human age/gender noun ("child," "girl," "boy," "kid," "person") anywhere in the entry — always name the SPECIES first, then its costume, then its activity. A bare "trick-or-treater" reads as a human child; a "hedgehog dressed as a candy-corn cone" reads as the creature it is. Each entry 20-30 words.

━━━ SPAN ACROSS ALL ${n} (vary species AND costume AND activity — don't repeat combinations) ━━━
- hedgehog dressed as a candy-corn cone, carrying a bulging trick-or-treat pail door to door
- fox kit in a tiny witch hat and cape, stirring a bubbling (sparkly, safe) cauldron of cider
- owlet wearing a pumpkin-shaped hood, perched on a lantern-post handing out treats
- bunny in a ghost-sheet costume with cut eye-holes, bobbing for apples in a barrel
- raccoon in a mummy-wrap costume trailing gauze bandages, tail poking through, carrying a candy basket
- field mouse dressed as a black cat with painted-on whiskers, sneaking a candy corn
- badger wearing a tiny vampire cape, carving a pumpkin with a butter knife
- squirrel in a fuzzy spider costume with extra pom-pom legs, stringing cobweb bunting
- hedgehog family trio in matching skeleton onesies, trick-or-treating paw in paw
- otter dressed as a jack-o-lantern, floating on a leaf-boat in a lantern parade
- chipmunk wearing a pointed wizard hat, lighting a row of candle-lit pumpkins
- duckling in a tiny dragon costume, waddling through a hay-bale maze
- porcupine dressed as a scarecrow with straw poking from its sleeves, guarding a pumpkin stand
- rabbit in a soft bat-wing cape, gliding down a hay-bale slide
- fawn wearing a tiny pumpkin-shaped antler cap, nibbling a candy apple at a stall
- weasel dressed as a friendly mad-scientist critter, mixing a glowing (harmless, sparkly) potion
- mole wearing a tiny ghost costume, popping up from a tunnel in the pumpkin patch
- skunk in a candy-striped witch costume, selling caramel apples from a little cart
- squirrel dressed as a knight in acorn-cap armor, guarding a treasure chest of candy
- beaver wearing a pilgrim-style buckle hat, stacking a pyramid of tiny pumpkins

━━━ EXAMPLES (match this format/length) ━━━
"A hedgehog dressed as a candy-corn cone carries a bulging trick-or-treat pail from door to glowing door, quills poking through the costume's felt tip."
"A fox kit in a tiny pointed witch hat and patched cape stirs a bubbling, sparkly cauldron of spiced cider over a cheerful little fire."
"An owlet wearing a soft pumpkin-shaped hood perches on a lantern-post, handing out candy to passing critters with an outstretched wing."

━━━ RULES ━━━
NEVER a human age/gender noun anywhere (no "child/kid/girl/boy/person/lady/gentleman"). Always species-first. Cheerful and playful only, no gore/blood/genuine scares.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── JACKOLANTERNS — the MONEY-SHOT glow composition (~55% of renders) ───
  await generatePool({
    outPath: DIR + 'chibi_halloween_village_jackolantern.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} JACK-O-LANTERN "money shot" compositions for a Halloween-village bot — the ONE glowing detail that makes a render iconic and instantly recognizable as THIS path. Each entry is a SPECIFIC, vivid composition built entirely around carved, glowing jack-o-lanterns (grinning, friendly faces) — never anything else as the subject. Each entry 15-25 words.

━━━ SPAN ACROSS ALL ${n} (vary the composition — line, pile, float, arch, cluster, spiral...) ━━━
- a long row of grinning carved jack-o-lanterns lining both sides of the street, each glowing a different warm hue
- a towering pyramid of lit jack-o-lanterns stacked at the market stall, candlelight flickering through carved grins
- a floating flotilla of tiny jack-o-lanterns drifting down the village canal like little lantern-boats
- an archway woven from vines and dozens of glowing jack-o-lanterns marking the fair's entrance
- jack-o-lanterns perched on every fence-post along the winding lane, grins warm against blue dusk
- one giant hero jack-o-lantern centerpiece in the town square, carved with an elaborate starry face
- jack-o-lanterns nestled in every window box, glowing gold against darkened glass panes
- a spiral staircase of carved, lit pumpkins climbing toward the clocktower
- strings of miniature jack-o-lantern fairy-lights zigzagging between rooftops overhead
- jack-o-lanterns floating in the fountain basin, their glow rippling across the water
- a jack-o-lantern-lined bridge crossing, each pumpkin's grin reflected in the misty water below
- a cascading waterfall staircase of pumpkins, each step lined with a glowing carved face
- jack-o-lanterns hanging from a wagon's sides like glowing lanterns as it rolls through the fair
- a ring of jack-o-lanterns circling the bonfire, their light dancing with the flames

━━━ EXAMPLES (match this format/length) ━━━
"A long row of grinning carved jack-o-lanterns lines both sides of the cobblestone street, each one glowing a different warm hue against the blue dusk."
"A towering pyramid of lit jack-o-lanterns stacks at the market stall, candlelight flickering warm through each carved grinning face."
"An archway woven from autumn vines and dozens of glowing jack-o-lanterns marks the fair's entrance, warm light spilling onto the path below."

━━━ RULES ━━━
Every entry MUST be about carved, glowing, GRINNING/friendly jack-o-lanterns specifically (never a scary carved face). No brand names, no readable text, no humans.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── DECOR — non-pumpkin seasonal village dressing (always present) ───
  await generatePool({
    outPath: DIR + 'chibi_halloween_village_decor.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} HALLOWEEN VILLAGE DECOR details for a chibi-creature bot — small, specific seasonal dressing items scattered through the village that are NOT jack-o-lanterns (those are a separate axis). Each entry 12-20 words, ONE specific decor detail or small cluster of decor.

━━━ SPAN ACROSS ALL ${n} ━━━
- cobweb bunting looped between lampposts, glittering faintly with dew
- corn-stalk bundles tied with orange ribbon flanking every doorway
- hay bales stacked with dried gourds and mini ornamental pumpkins
- candy-corn-striped garlands strung along shopfront eaves
- a black-cat-shaped weathervane spinning gently atop the town hall
- dried-flower harvest wreaths hung on every cottage door
- paper-bat mobiles strung overhead, swaying in the autumn breeze
- striped orange-and-black awnings shading the market stalls
- wicker baskets overflowing with gourds and speckled squash
- a cheerful scarecrow propped beside the market stall, patchwork clothes and a stitched grin
- burlap-sack bunting fluttering from the fair's entrance posts
- apple-crates painted with friendly jack-o-lantern faces stacked by a stall
- a chalkboard sign doodled with a grinning pumpkin advertising cider
- acorn-and-leaf wind chimes tinkling softly from a porch eave
- a signpost carved into the shape of a friendly waving ghost
- pumpkin-spice steam curling from a cider cart's kettle
- a wheelbarrow tipped over with a spill of ornamental gourds
- twine-tied bundles of dried autumn leaves hung beside a doorway
- a friendly witch's-hat weathervane spinning atop a cottage roof
- a row of carved wooden fenceposts topped with tiny painted pumpkins

━━━ EXAMPLES (match this format/length) ━━━
"Cobweb bunting loops between the lampposts, glittering faintly with evening dew."
"Corn-stalk bundles tied with orange ribbon flank every cottage doorway along the lane."
"A cheerful scarecrow leans beside the market stall, patchwork clothes and a stitched-on grin."

━━━ RULES ━━━
NEVER mention jack-o-lanterns or carved pumpkins (separate axis) — pumpkins as whole gourds/decor are fine. No humans, no brand names, no readable text. Cheerful only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── NIGHT_SKY — dusk/night sky + light mood (always present) ───
  await generatePool({
    outPath: DIR + 'chibi_halloween_village_sky.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} NIGHT-SKY / LIGHT-MOOD snippets for a Halloween-village bot — the dusk-to-night sky and ambient light over the village. Each entry 10-18 words, ONE specific sky/light/atmosphere element. Cozy and gentle, never ominous.

━━━ SPAN ACROSS ALL ${n} ━━━
- a full harvest moon glowing amber behind wisps of drifting cloud
- a deep indigo dusk sky pricked with the first few stars
- low ground-mist curling gently between the cobblestones
- bare autumn-tree silhouettes stretching against a fading violet sky
- a scatter of fallen leaves drifting past, lit gold by lantern-light
- a friendly owl silhouette gliding softly across the low moon
- a soft purple twilight deepening toward a star-flecked black
- a gentle autumn breeze rustling strings of paper lanterns overhead
- wisps of chimney smoke curling lazily into the cool night air
- fireflies mixing with drifting embers from a distant bonfire
- a warm orange sunset fading into cool blue at the horizon's edge
- soft golden lantern-glow pooling along the misty cobblestone path
- a scatter of early stars mirrored faintly in a still pond
- a light autumn fog softening every rooftop into gentle silhouette
- the last blush of sunset catching the undersides of drifting clouds

━━━ EXAMPLES (match this format/length) ━━━
"A full harvest moon glows amber behind wisps of slow-drifting cloud."
"Low ground-mist curls gently between the cobblestones, lit warm by nearby lanterns."
"A gentle autumn breeze rustles the strings of paper lanterns overhead."

━━━ RULES ━━━
Cozy and gentle only — no storm, no menace, no darkness-as-threat. No humans, no brand names, no readable text.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ─── SURPRISE — a small charming incidental detail (~50% of renders) ───
  await generatePool({
    outPath: DIR + 'chibi_halloween_village_surprise.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} small CHARMING SURPRISE details for a Halloween-village bot — a tiny incidental found-detail that adds whimsy without being the main subject. Each entry 10-18 words. Every "spooky" icon must read as cute and friendly, never eerie.

━━━ SPAN ACROSS ALL ${n} ━━━
- a friendly ghost peeking cheerfully from an attic window, waving
- a black cat curled up contentedly atop a warm pumpkin
- a broomstick leaning innocently beside a cottage door
- a scarecrow with a wink stitched into its patchwork face
- a spider spinning a glittery, sparkle-dusted web between two lantern-posts
- a small bat family gently swooping over the rooftops together
- a cauldron bubbling with harmless, sparkly candy-colored potion
- a mummy-wrapped teddy bear left propped on a porch step
- a tiny witch's hat blown loose, tumbling playfully down the lane
- a jack-o-lantern with a crooked, extra-goofy grin peeking from a bush
- a string of paper ghosts swinging gently from a porch eave
- a plump black cat batting at a floating candy wrapper
- a friendly skeleton wind chime clinking softly in the breeze
- a pumpkin-shaped kite caught fluttering in a bare tree branch
- a trail of tiny glowing footprints leading toward the bonfire

━━━ EXAMPLES (match this format/length) ━━━
"A friendly ghost peeks cheerfully from an attic window, giving a little wave."
"A plump black cat curls up contentedly atop a sun-warmed pumpkin."
"A spider spins a glittery, sparkle-dusted web strung between two lantern-posts."

━━━ RULES ━━━
Every element reads as cute and harmless, never threatening. No humans, no brand names, no readable text.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
