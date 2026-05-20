#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/plush_storytelling.json',
  total: 200,
  batch: 10,
  maxTokens: 4500,
  metaPrompt: (n) => `You are writing ${n} PLUSH-STORYBOOK-MISCHIEF seed entries for ToyBot's plush-world path.

⭐ THE NORTH STAR
Imagine CUTE Squishmallow-style fluffy huggable plushies — oversized round-pudgy fiberfill bodies, soft visible plush-fur, big adorable embroidered or button eyes, floppy limbs — living out absurdly specific UNEXPECTED storybook moments when no one is watching. Coraline-set-build meets cozy mischief.

⚠️ THE PLUSH AESTHETIC IS NON-NEGOTIABLE
Every plush character is a CUTE Squishmallow-style fluffy huggable plushie — oversized round-pudgy fiberfill body, big adorable embroidered or button eyes, soft fluffy fur coating the whole body, sewn-on muzzle, floppy limbs. NOT needle-felted Etsy handcraft, NOT small felt cutouts, NOT craft-y figurines, NOT Sylvanian / Calico Critter flocked figurines, NOT realistic stuffed-animal collector pieces. CUTE HUGGABLE plushies at full plush-toy scale — the kind a kid wants to squeeze.

The vibe is CHILDREN'S STORYBOOK DIORAMA — but the stories are FUN, surprising, slightly silly, full of unexpected scenarios. NOT just "stuffies having tea." Think:
  • A plush sloth running a black-market honey-jar trade out of a hollow log
  • Stuffed foxes hosting a podcast in a fabric blanket-fort recording booth
  • Plush bears competing in an underground knitting contest with a judging panel of owls
  • A felt-dragon mid-fire-extinguisher emergency after a marshmallow incident
  • Plush bunnies running an illegal carrot-trading-floor in an attic basement
  • A stuffed owl detective interrogating a plush mouse over stolen acorns
  • Plush kittens running a backyard fight-club beneath the porch
  • A felt raccoon staging a one-raccoon Broadway musical in a closet
  • A plush hedgehog running a tiny acupuncture clinic for stressed plush clients
  • Stuffed otters operating a tiny gondola taxi service in a kitchen sink

The stories must be UNEXPECTED — silly + specific. NOT generic "tea party / picnic / campfire." Surprising scenarios that make the viewer go "wait WHAT?"

━━━ STRICT FORMAT — 6 SLOTS, SEMICOLON-SEPARATED, ALL MANDATORY ━━━

EVERY entry is ONE sentence with EXACTLY 5 SEMICOLONS separating 6 slots in this exact order:

  [SLOT 1: REAL surface + UNEXPECTED STORYBOOK STORY SETUP]; [SLOT 2: PROTAGONIST PLUSH + their specific tender or absurd action]; [SLOT 3: 3-5 SUPPORTING PLUSH CAST each with DISTINCT actions, mixed plush archetypes]; [SLOT 4: REAL-PROP SET DECORATION DETAIL — multilayered scene-dressing with kid-found household objects]; [SLOT 5: WARM COZY STORYBOOK LIGHT]; [SLOT 6: WHIMSICAL ATMOSPHERIC OVERHEAD ELEMENT suspended or drifting].

If your entry has fewer than 5 semicolons or omits ANY slot, the entry is REJECTED.

━━━ SLOT-BY-SLOT REQUIREMENTS ━━━

**SLOT 1 — REAL SURFACE + UNEXPECTED STORYBOOK SETUP.** Pick the cozy-storybook surface AND name a SURPRISINGLY-SPECIFIC absurd scenario. Format: "[surface] — [unexpected story setup phrase]."

  • "Real moss-covered tree stump — black-market honey-jar trade in full-swing with sketchy buyers and a lookout"
  • "Real attic floorboards under a slanted roof — underground knit-club championship match in the final round"
  • "Real kitchen tile beneath the cupboard — emergency response after a plush dragon set a marshmallow on fire"
  • "Real bookshelf ledge — secret midnight book-borrowing operation with a plush owl librarian asleep at the desk"
  • "Real garden gnome statue beside a flowerbed — gnome-statue therapy session with three plush clients lined up"
  • "Real coffee-mug interior with a tea-bag rope ladder — emergency tea-bag rescue mission underway"
  • "Real bathtub edge tile — plush spa day going off the rails as a bath bomb explodes"
  • "Real porch with autumn leaves — emergency carrot-summit between rival plush bunny crews"
  • "Real fireplace mantel — plush comedy-club open-mic night with terrible plush comedians bombing"
  • "Real picnic blanket on real grass — plush wedding ceremony being officiated by a cheese wedge for unclear reasons"
  • "Real kitchen sink filled with bubbles — gondola-taxi service in operation through the suds"
  • "Real closet floor with hanging shoes overhead — one-raccoon Broadway musical performance in progress"
  • "Real bedroom windowsill at golden hour — plush book-club discussion getting heated over a controversial chapter"
  • "Real garden bench under a flowering branch — plush detective interrogating a suspect plush mouse over stolen acorns"
  • "Real treehouse plank floor — plush hedgehog acupuncture clinic with stressed clients waiting in plush armchairs"
  • "Real living-room rug — plush bear yoga class in chaotic disarray after someone broke the meditation"
  • "Real garage workbench — plush inventor's lab going dramatically wrong with sparks and steam"
  • "Real picnic-table wood-grain — plush courtroom in session, the plush judge holding a tiny twig gavel"
  • "Real bathroom counter beside the sink — plush salon-day disaster after a hair-curl experiment"
  • "Real garden mulch beneath a real flowerpot — plush archeological dig discovering an actual sock"
  • "Real backyard sandbox — plush construction-site disaster, the sand-castle has fully collapsed"
  • "Real bookcase top shelf — plush stargazers' society meeting interrupted by a plush UFO sighting"

**SLOT 2 — PROTAGONIST PLUSH + SPECIFIC ACTION.** ONE plush hero doing something specific. Use CUTE FLUFFY HUGGABLE plush language, NOT knit / felt / handcraft language. Examples:

  • "a fluffy plush sloth in tiny suspenders mid-handoff of a honey jar wrapped in a bandana"
  • "a fluffy plush bear in spectacles paw-raised mid-aggressive-knit-stitch with two knitting needles crossed defensively"
  • "a huggable plush dragon mid-fire-extinguisher-spray with foam everywhere and scorch marks on his sweater"
  • "a fluffy plush owl in a tiny detective hat slamming a paw down on a sticky-note evidence pile"
  • "a plush mama bear in a tiny apron mid-stir of a tiny iron pot with a wooden spoon held aggressively"
  • "a fluffy plush fox in a tiny podcast headset leaning into a microphone mid-shocked-gasp"
  • "a button-eyed plush bunny in tiny round glasses pounding the table with both paws insisting on more carrots"
  • "a fluffy plush owl in tiny robes raising a twig-gavel mid-verdict with stern judicial energy"
  • "a plush hedgehog in a tiny doctor's coat mid-acupuncture-needle-insert into another plush patient's back"
  • "a fluffy plush raccoon mid-musical-number-belt with arms thrown wide on a closet-stage"
  • "a plush otter in tiny gondolier outfit mid-pole-push through bubble water"
  • "a plush sheep in beret mid-paint-stroke at an easel with a thoughtful tilt of the head"
  • "a fluffy plush kitten in tiny boxing gloves mid-victorious-paw-raise after winning a backyard fight"
  • "a plush penguin in a tiny conductor's coat mid-orchestra-cue with a sewing needle baton"

**SLOT 3 — 3-5 SUPPORTING PLUSH CAST with DISTINCT actions across DIFFERENT plush archetypes.** Mix plush types widely. Each character does something specific. Examples:

  • "two plush bunnies dressed as customs-inspectors checking honey-jar credentials, a plush fox lookout perched on a higher branch with binoculars, a plush squirrel buyer holding cash made of dried-leaf scraps, and a plush owl auditor frantically scribbling in a tiny ledger"
  • "three plush bears competing in distinct knit styles — one cable-knit, one fair-isle, one moss-stitch — a plush owl judge holding a tiny scorecard, two plush rabbit spectators munching tiny popcorn, and a plush squirrel scorekeeper mid-update on a chalkboard"
  • "a plush mouse holding a tiny fire-blanket already three sizes too small, two plush bunny medics dragging an oversized first-aid kit, a plush cat foreman shouting orders through a paper cone, and a plush hedgehog reporter snapping photos on a button camera"
  • "a plush raccoon witness on the stand looking suspiciously guilty, two plush rabbit jurors whispering and side-eyeing, a plush owl bailiff with a tiny baton, and three plush squirrel spectators leaning forward with rapt attention"
  • "two plush bunnies seated in plush armchairs cradling tiny teacups for their plush acupuncture pre-session, a plush bear in workout gear stretching his back which clearly needs the most help, a plush deer receptionist on a tiny phone, and a plush owl waiting in line gripping a yoga mat"
  • "a plush sheep mid-podcast-yell mouth wide, three plush cats holding 'IT WAS YOU' signs in the audience, a plush fox sound-engineer working a yarn-string mixing board, and a plush bunny producer pacing nervously offstage"
  • "two plush squirrels carrying ledgers to and from the trading-floor pit, a plush fox CEO in a tiny suit pounding the desk for an opening bell, three plush rabbits hugging carrots like portfolio stocks, and a plush owl pit-boss watching with hawk-like attention"
  • "two plush dragon fire-marshals inspecting fabric-scorch evidence with tiny clipboards, a plush bunny bystander filming on a tiny smartphone, a plush mama cat holding her plush kittens away from danger, and a plush badger inspector mid-disapproving-headshake"

**SLOT 4 — REAL-PROP SET DECORATION (multilayered scene-dressing).** The frame is DRESSED — multiple visible real-world props/scenery elements. Format: "[3-4 specific real-prop details]." Examples:

  • "stacks of real glass honey-jars in the background, real twine bundles, a real wooden crate marked 'CONTRABAND' in marker, real moss flooring, a real branch wedged between two stumps as a counter"
  • "real knitting needles abandoned at half-knit projects scattered around, real balls of yarn in a basket, a real chalkboard hung from twine, real cookies on tiny tin trays, a hand-drawn 'KNIT-OFF FINALS' banner on torn paper"
  • "real charred marshmallow remnants on a real chopstick, a real sippy-cup of water tipped over leaking, real wooden block 'fire trucks' in the background, a real felt extinguisher prop, a smoke-blackened napkin draped over a chair"
  • "real Post-it notes pinned to a corkboard with case details written in crayon, a real magnifying glass on the desk, real coins scattered as 'evidence,' real chalk outline of a tiny missing acorn"
  • "real glass marbles arranged as 'crystal balls' on a velvet cloth, real tea-light candles, a real tarot-card-sized piece of cardstock spread out, real lavender sprigs in tiny vases, a real incense-stick ribbon trail"
  • "real teabag-strings rigged as climbing ropes, real sugar-cubes stacked as supply crates, a real spoon laid as a bridge, real dried-mint leaves serving as foliage, a real coaster as the floor"
  • "real bubble bath foam piled high, a real loofah pillar in the background, real bath-bomb fizzy remnants in pink, real rubber-duck floats scattered, real soap-shavings drifting in the suds"
  • "real autumn leaves arranged as a 'rug,' real acorns clustered as 'campaign donations,' real twigs lashed as podiums, a real hand-drawn 'NEGOTIATIONS' sign on a leaf, real pine needles fringing the edge"
  • "real comic-book pages tacked to the wall behind the stage, real toothpick microphones on tiny matchbox stages, real Goldfish crackers strewn as 'munchies,' a real folded napkin curtain, real coaster spotlights"
  • "real wedding-cake-shaped buttons stacked in tiers, real ribbon spool aisle-runner, real flower-petal confetti pre-thrown, real wedge-of-cheese officiant on tiny pedestal, real shot-glass champagne flutes"
  • "real sponge gondolas afloat in the suds, real toothpick oars, real twist-tie streetlamps along the sink's edge, a real chip-clip arched as a bridge, real packing-foam buildings in the distance"

**SLOT 5 — WARM COZY STORYBOOK LIGHT.** Storybook-warm light only. NEVER cold / dark / nightmare. Examples:
  • "warm honey-yellow firelight from a tiny tealight pooling across the scene"
  • "golden afternoon sunbeam through a real window catching dust motes in the warm air"
  • "soft lantern-glow from a tiny camping lantern casting amber pools"
  • "twinkly fairy-light string overhead reflecting in tiny mirrors and button-eyes"
  • "morning sunbeam through gauze curtains painting everything in pastel apricot"
  • "candlelight from a real tea-light on a wooden block making everything storybook-warm"
  • "Christmas-string-light glow casting multicolored shadows across the cozy scene"
  • "warm orange-pink dusk light through a real bedroom window"
  • "fireplace-glow flickering across plush-fiber fur and knit-textures"

**SLOT 6 — WHIMSICAL ATMOSPHERIC OVERHEAD ELEMENT.** Required signal-word: one of [hovering / suspended / drifting / floating / overhead / mid-flight / mid-air]. Examples:
  • "a paper airplane drifting overhead with 'URGENT' scrawled across one wing"
  • "balloons tied to the rafters floating askew in a cluster"
  • "soap bubbles floating around the chaos in slow drifting clusters"
  • "glitter dust drifting through the warm air around the scene"
  • "a kite caught mid-flight overhead on invisible thread"
  • "fireflies hovering in a slow constellation above the action"
  • "snowflakes of cotton-batting drifting overhead (NOT actual snow — the cotton is the joke)"
  • "petals drifting in a slow-motion shower across the upper frame"
  • "a tiny paper hot-air balloon hanging suspended from above on thread"
  • "feathers drifting overhead from an unseen pillow fight earlier"
  • "a kid's crayon drawing of the sun pinned overhead curling at the edges"
  • "moths fluttering toward the lantern in a soft drifting halo"

━━━ ABSOLUTE BANS ━━━
- NO LEGO / Lego / brick-built / studded / blocky-limb minifigs — separate bot.
- NO needle-felted / Etsy-handcraft / felt-cutout / craft-figurine language. The plush MUST read as CUTE fluffy huggable Squishmallow-style plushies.
- NO single-medium ensembles. EVERY scene mixes 3-5 DIFFERENT plush archetypes (bear / bunny / fox / cat / owl / sloth / dragon / hedgehog / penguin / sheep / squirrel / mouse / raccoon / otter / kitten / deer / badger / etc.) — but ALL render with the SAME fluffy-huggable plush quality.
- NO Sackboy burlap-with-zipper aesthetic — that's a separate path.
- NO real animals, NO CGI, NO illustration — these are FLUFFY HUGGABLE stuffed-animal toys.
- NO serious / somber / dark / nightmare / horror tones. FUN + COZY + SLIGHTLY-MISCHIEVOUS-STORYBOOK.
- NO snow / winter / nightfall / dark / cold / storm settings. Always warm + cozy + bright.
- NO "diorama" / "model railroad" / "tilt-shift" — although the SCENE is staged like a diorama, NEVER use the word.
- NO single-character compositions. The frame is PACKED with 4-6 plush characters in distinct actions.
- NO posed lineups. Toys IN MOTION mid-action.

━━━ MUST-HAVES PER ENTRY ━━━
- A SPECIFIC UNEXPECTED STORY HAPPENING (not "stuffies having tea" — "stuffies running a black-market honey trade" / "underground knit-off finals" / etc.)
- A NAMED plush protagonist + 3-5 supporting plush across DIFFERENT plush archetypes
- FUN / silly / slightly-absurd tone — cozy mischief, unexpected scenarios
- A multilayered real-prop set decoration that DRESSES the scene with kid-found household objects
- Warm cozy storybook lighting
- An overhead/floating atmospheric element

━━━ COMPLETE EXAMPLES — STUDY THE 6-SLOT PATTERN ━━━

"Real moss-covered tree stump in a real garden bed — black-market honey-jar trade in full swing with sketchy buyers and a lookout posted; a knitted-fleece plush sloth in tiny suspenders mid-handoff of a honey jar wrapped in a bandana with shifty button-eyes scanning the area; two plush bunnies dressed as customs-inspectors checking honey-jar credentials with tiny clipboards, a plush fox lookout perched on a higher branch with binoculars trained on the trail, a plush squirrel buyer holding cash made of dried-leaf scraps, and a plush owl auditor frantically scribbling in a tiny ledger; stacks of real glass honey-jars in the background with real twine bundles, a real wooden crate marked 'CONTRABAND' in marker, real moss flooring, a real branch wedged between two stumps as a counter; warm honey-yellow afternoon sunbeam catching dust motes through the canopy; fireflies hovering in a slow constellation above the action."

"Real attic floorboards under a slanted roof beam — underground knit-club championship match in the final round; a stitched plush bear in spectacles paw-raised mid-aggressive-knit-stitch with two knitting needles crossed defensively over his project; three plush bears competing in distinct knit styles (one cable-knit, one fair-isle, one moss-stitch), a plush owl judge holding a tiny scorecard, two plush rabbit spectators munching tiny popcorn, and a plush squirrel scorekeeper mid-update on a chalkboard; real knitting needles abandoned at half-knit projects scattered around, real balls of yarn in a basket, a real chalkboard hung from twine, real cookies on tiny tin trays, a hand-drawn 'KNIT-OFF FINALS' banner on torn paper; warm lantern-glow from a hanging tiny camping lantern casting amber pools; a paper airplane drifting overhead with 'URGENT' scrawled across one wing."

"Real kitchen tile beneath the cupboard at noon — emergency response after a plush dragon set a marshmallow on fire; a felt-and-yarn plush dragon mid-fire-extinguisher-spray with foam everywhere and fabric scorch marks on his sweater; a plush mouse holding a tiny fire-blanket already three sizes too small, two plush bunny medics dragging an oversized first-aid kit, a plush cat foreman shouting orders through a paper cone, and a plush hedgehog reporter snapping photos on a button camera; real charred marshmallow remnants on a real chopstick, a real sippy-cup of water tipped over leaking, real wooden block fire trucks in the background, a real felt extinguisher prop, a smoke-blackened napkin draped over a chair; warm noon sunbeam through the kitchen window painting everything bright; balloons tied to a chair-leg floating askew in a guilty-looking cluster."

"Real fireplace mantel above the hearth at dusk — plush comedy-club open-mic night with terrible plush comedians bombing onstage; a felt plush raccoon mid-musical-number-belt with arms thrown wide on a closet-stage and zero self-awareness; a plush sheep heckler mid-yell with a hoof cupped to mouth, three plush cats holding 'IT WAS YOU' signs in the audience, a plush fox sound-engineer working a yarn-string mixing board, and a plush bunny producer pacing nervously offstage; real comic-book pages tacked to the wall behind the stage, real toothpick microphones on tiny matchbox stages, real Goldfish crackers strewn as 'munchies,' a real folded napkin curtain, real coaster spotlights; warm fireplace-glow flickering across plush-fiber fur and knit-textures; a tiny paper hot-air balloon hanging suspended from above on thread."

"Real bathtub edge tile mid-afternoon — plush spa day going off the rails as a bath bomb explodes catastrophically; a button-eyed plush bunny in a tiny robe arms thrown wide in pink-fizz horror as the bomb peaks; a plush bear in a tiny shower-cap holding a loofah defensively, two plush kittens hiding behind a rubber duck, a plush sloth peacefully unconscious in a soap-suds dome on the other side, and a plush owl spa-attendant mid-dive for the emergency drain plug; real bubble-bath foam piled high, a real loofah pillar in the background, real bath-bomb fizzy remnants in pink, real rubber-duck floats scattered, real soap-shavings drifting in the suds; warm afternoon sunbeam through the bathroom window painting everything in pastel-pink; soap bubbles floating around the chaos in slow drifting clusters."

━━━ SELF-AUDIT BEFORE OUTPUTTING ━━━
For each entry:
  ✓ Exactly 5 semicolons?
  ✓ Slot 1 names a SPECIFIC UNEXPECTED story setup (not just a setting)?
  ✓ Slot 2 has ONE named plush protagonist with a specific tender or absurd action?
  ✓ Slot 3 has 3-5 supporting plush across DIFFERENT plush archetypes (bear, bunny, fox, cat, owl, sloth, dragon, hedgehog, sheep, squirrel, mouse, raccoon, otter, kitten, deer, badger, etc.)?
  ✓ Slot 4 has MULTILAYERED real-prop set decoration (3-4 specific kid-found household objects)?
  ✓ Slot 5 is warm + cozy + bright (NEVER dark / night / cold)?
  ✓ Slot 6 has a floating/suspended/hovering/drifting element overhead?
  ✓ The scene is FUN + UNEXPECTED + SLIGHTLY-ABSURD (not "stuffies having tea")?
  ✓ No LEGO, no Sackboy burlap-with-zipper, no real animals?

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string is ONE sentence with EXACTLY 5 semicolons. Vary STORIES widely — black markets, knit-offs, fire emergencies, courtroom dramas, comedy clubs, spa disasters, gondola taxis, archeological digs, acupuncture clinics, podcast bombings, construction disasters, Olympic events, wedding crashes, magic-show failures, etc. Vary plush archetypes widely across each slot. 60-90 words per seed.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
