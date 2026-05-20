#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/train_world_real.json',
  total: 30,
  batch: 10,
  maxTokens: 4000,
  metaPrompt: (n) => `You are writing ${n} TOY-TRAIN-PLAYTIME-SCENE seed entries for ToyBot's model-train-world path.

⭐ THE EXEMPLAR ENERGY (Kevin hearted this — every seed must hit this vibe):
The scene reads "TOY PLAYTIME SCENE FIRST that happens to have a train in it" — NOT a model railroad. A populated kid's-playtime moment with named toys + flowers as architecture + a tiny real critter + warm natural light + a whimsical floating element overhead.

The setting can be ANYWHERE a kid could plausibly set up an elaborate train playtime moment: beach, backyard sandbox, park picnic blanket, forest floor, campsite, garden bed, pool deck, sidewalk, garage, treehouse, kid's bedroom, living-room rug, kitchen counter, coffee table. Mix outdoor + indoor widely.

━━━ STRICT FORMAT — 6 SLOTS, SEMICOLON-SEPARATED, ALL MANDATORY ━━━

EVERY entry is ONE sentence with EXACTLY 5 SEMICOLONS separating 6 slots in this exact order:

  [SLOT 1: opener + REAL PLAYTIME SURFACE]; [SLOT 2: REAL FLORAL ARCHITECTURE along tracks]; [SLOT 3: NAMED TOY CHARACTER + their action beside the rails]; [SLOT 4: TINY REAL CRITTER at real scale on/near the rails]; [SLOT 5: WARM NATURAL LIGHT — daylight/golden-hour/warm interior]; [SLOT 6: WHIMSICAL FLOATING/ATMOSPHERIC EXTRA suspended or drifting overhead].

If your entry has fewer than 5 semicolons or omits ANY slot, the entry is REJECTED. There is no partial credit.

━━━ SLOT-BY-SLOT REQUIREMENTS ━━━

**SLOT 1 — OPENER + PLAYTIME SURFACE.** Pick from:
  • Opener: "Toy train rolling across a real..." / "Tiny toy locomotive winding through a real..." / "Kids' toy train weaving over a real..." / "Lionel-style toy train circling a real..." / "Small toy train chugging along a real..."
  • Surface: real sandy beach / real backyard sandbox / real grass at a park / real picnic blanket on park grass / real forest floor with pine needles / real campsite log + dirt path / real garden bed mulch / real pool deck concrete / real sidewalk chalk drawing / real treehouse plank floor / real flowerbed soil / real picnic table wood-grain / real braided rug / real patchwork quilt / real chenille throw / real felt play mat / real wool kitchen rug / real coffee table wood / real wooden porch / real linoleum kitchen floor

**SLOT 2 — REAL FLORAL ARCHITECTURE.** Real flowers/plants arranged like buildings, walls, arches, tunnels, hedgerows beside the rails. Required word: "real". Examples:
  • "real lavender sprigs between rail ties forming a purple hedgerow"
  • "real daisies lined like fenceposts along the platform"
  • "real ivy curling overhead like a tunnel mouth"
  • "real cherry blossom petals heaped at a curve like a snowdrift"
  • "real wildflower bouquet in a jar towering as a clock tower"
  • "real fern fronds arching over the rails like jungle canopy"
  • "real rose petals scattered as confetti on the platform"
  • "real dandelion puffs at intervals along the tracks like streetlamps"
  • "real moss carpet between the ties as a green lawn"
  • "real sunflowers towering beside the train like colossal sun-trees"
  • "real beach-roses tucked along the rail ties as a coral hedgerow"

**SLOT 3 — TWO OR THREE NAMED TOY CHARACTERS scattered through the scene, each with a DISTINCT action.** Must NAME real toy brands. Mix different brands per entry — vary widely across the 50 seeds. Format: "[Toy A doing action A] alongside [Toy B doing action B] (optionally: and [Toy C doing action C])."

⭐ DRAW CHARACTER DNA from ToyBot's own bot cast — the bot already renders these characters in OTHER paths, so they should appear as drop-in extras in train scenes. Use phrasing LIKE these:

VINYL FUNKO POP characters (cube-headed glossy collectibles):
  • "a Funko Pop wizard in tall star-printed hat and flowing robe"
  • "a Funko Pop pirate with tricorn hat and tiny vinyl sword"
  • "a Funko Pop monster with neck bolts and stitched scars"
  • "a Funko Pop astronaut with bubble helmet and chrome boots"
  • "a Funko Pop chef in tall hat clutching a vinyl baguette"
  • "a Funko Pop superhero with cape mid-flutter"
  • "a Funko Pop sushi-chef holding tiny vinyl maki rolls"

BARBIE-line fashion dolls (11.5-inch articulated, rooted hair, painted face):
  • "a Barbie in shimmering pink evening gown with platinum bob"
  • "a Barbie in striped swimsuit lounging on a tiny plastic cabana cushion"
  • "a Barbie in beach windbreaker holding a tiny clipboard"
  • "a Barbie astronaut in silver vinyl spacesuit"
  • "a Ken doll in tuxedo mid-bow beside the rails"
  • "a Barbie driver gripping a glitter steering wheel"

G.I. JOE-style 3.75-inch action figures (articulated, sculpted gear):
  • "an articulated jungle-specialist action figure mid-swing on plastic rope"
  • "a gruff-sergeant figure providing covering fire from the embankment"
  • "a demolitions-expert commando crouched at a glowing detonator"
  • "a masked-operative figure covering a doorway"
  • "a pilot-ace 3.75-inch figure with flight-helmet tucked under arm"

DOLLHOUSE / CALICO / SYLVANIAN FAMILY characters (flocked-velvet animals):
  • "a Calico Critter bunny family of three at a tiny tea table"
  • "a flocked-velvet Sylvanian mother holding a scale teapot"
  • "a Lori-doll in rooted-hair pajamas mid-laugh on a sleeping bag"
  • "a vintage wooden mom figure mid-stir of a tiny soup pot"

PLUSH-FRIEND characters (soft fabric, button eyes, knitted scarves):
  • "a plush teddy-bear strumming a felt guitar"
  • "a plush fox in a knitted-scarf saluting at the platform"
  • "a plush owl-pirate at a felt helm with stitched eye-patch"
  • "a plush bunny holding a tiny basket of felt strawberries"

SACKBOY-style stitched-burlap figures (button eyes, sewn seams):
  • "a stitched-Sackboy with button-eyes spreading a gingham picnic blanket"
  • "a felt-Sackboy in knit-scarf climbing a stacked-book stairway"

GREEN ARMY MEN (olive-green molded plastic, visible mold-seams, oval bases):
  • "an olive-green plastic soldier in bayonet-charge across the embankment"
  • "a prone-rifleman flat on a leaf-lip with painted-shine helmet"
  • "an officer-figure waving the platoon forward with painted hand raised"

VINTAGE KENNER 3.75-INCH SPACE-SAGA figures (sandy-paint detail, blaster props):
  • "a vintage 3.75-inch space-knight in white tunic with utility belt and blaster pistol"
  • "a Kenner-style scoundrel with hand-painted vest mid-quick-draw"
  • "a vintage astronaut figure in white insulated jumpsuit climbing the engine ladder"

GENERIC TOY VOCAB (rounds out variety):
  • LEGO minifig knight / pirate / astronaut / scuba-diver / chef
  • Hot Wheels race car / Hot Wheels monster truck / Matchbox dump truck
  • Polly Pocket figure / Strawberry Shortcake figure / Shopkins figure
  • plastic toy dinosaur (T-rex / triceratops / brachiosaurus) / plastic farm animal
  • Power Ranger / Transformer mid-conversion / Buzz Lightyear / Pez dispenser
  • My Little Pony / Lalaloopsy doll / Bratz doll / rubber duck

Examples of MULTI-TOY entries (note 2-3 characters mixed across brand families):
  • "a Barbie in shimmering pink gown stepping off the caboose alongside a Funko Pop wizard with vinyl star-hat raising a tiny wand, and a LEGO minifig knight saluting the locomotive"
  • "two G.I. Joe articulated commandos crouched at a wooden-block bunker alongside a Calico Critter bunny family of three having tea on a daisy, and a plush teddy-bear in knit-scarf as the conductor"
  • "an olive-green plastic soldier in bayonet-charge along the rails alongside a Buzz Lightyear with raised arm directing the engine, and a row of plastic T-rex figures roaring at the boxcar"
  • "a vintage 3.75-inch space-knight with utility belt at the railroad crossing alongside three Polly Pocket figures waving from a sandcastle station, and a Funko Pop pirate with vinyl tricorn perched on a coffee mug"
  • "a stitched-Sackboy with button-eyes spreading a gingham blanket alongside a Strawberry Shortcake figure scattering felt petals, and a Hot Wheels monster truck parked at the crossing"
  • "a Funko Pop chef in tall hat clutching a vinyl baguette alongside a Barbie in beach windbreaker with tiny clipboard, and a plastic toy triceratops grazing at the embankment"

⚠️ EVERY ENTRY for slot 3 MUST include at least TWO distinct named-toy characters joined by "alongside" or "AND". Mix DIFFERENT brand-families per entry (don't always pair LEGO+LEGO — vary Funko + Barbie + G.I. Joe + plush + Sylvanian + plastic dinosaur freely). Single-toy entries are REJECTED.

**SLOT 4 — TINY REAL CRITTER.** A real living creature at REAL scale. Required word: "real". Examples:
  • "a real ladybug perched on the rail ahead of the locomotive"
  • "a real ant trail crossing the rails like commuters"
  • "a real garden snail slow-crossing the tracks"
  • "a real grasshopper mid-leap above the rails"
  • "a real butterfly resting on the smokestack"
  • "a real bee buzzing around the headlamp"
  • "a real songbird perched on a twig telegraph pole"
  • "a real dragonfly skimming above the cars"
  • "a real chipmunk peeking from a real hollow log"
  • "a real moth fluttering near the lit headlamp"
  • "a real house cat batting at a railcar from above"
  • "a real spider on a fresh web stretched between the ties"
  • "a real hermit crab crossing the tracks"

**SLOT 5 — WARM NATURAL LIGHT.** Daylight, golden hour, dusk, or warm domestic interior. NEVER night, NEVER cold, NEVER stormy. Examples:
  • "midday sun dappled through tree canopy"
  • "golden hour light raking across the sand"
  • "warm afternoon sun on the grass"
  • "dusk orange-pink sky behind the trees"
  • "morning sunbeam through forest mist"
  • "campfire glow flickering off the rails at twilight"
  • "summer-vacation midday brightness"
  • "autumn dusk orange-gray light through curtained window"
  • "warm yellow lamplight pooling around the platform"
  • "morning sunbeam through gauze curtains catching dust motes"
  • "twinkly fairy lights overhead reflecting on brass"

**SLOT 6 — WHIMSICAL FLOATING/ATMOSPHERIC EXTRA.** Something suspended above, drifting overhead, or floating through the frame. Required signal-word: one of [hovering / suspended / drifting / floating / overhead / mid-flight / mid-air]. Examples:
  • "a hovering UFO toy suspended on fishing line drifting slowly above"
  • "a paper airplane drifting overhead on invisible thread"
  • "balloons tied to the caboose floating skyward"
  • "glitter fragments drifting around the smokestack like a comet trail"
  • "a tiny paper hot-air balloon hanging from above"
  • "soap bubbles floating around the locomotive"
  • "a vinyl Astro Boy figure hovering in flight pose above the train"
  • "confetti drifting across the frame in slow-motion shower"
  • "a kite caught mid-flight overhead"
  • "a remote-control plane buzzing low across the frame"
  • "dandelion seeds drifting through the air around the train"
  • "a paper crane suspended above the platform on thread"
  • "a model airship floating above the treetops"

━━━ ABSOLUTE BANS ━━━
- NO "HO-scale" / "N-scale" / "1:87" / "1:160" / "scale-figure" / "model train" / "model locomotive" / "model railroad"
- NO "diorama" / "scratch-built" / "ground-foam" / "lichen" / "plaster-rock" / "static-grass" / "baseboard" / "tilt-shift"
- NO "town square" / "town" / "city skyline" / "village" / "downtown" / "main street"
- NO snow / winter / blizzard / ice / frost / cold / sleet
- NO night / midnight / dark / nightfall / shadow-only / moonlit
- NO "stuffed animal" alone — must NAME a specific toy brand/type

━━━ COMPLETE EXAMPLES — STUDY THE STRUCTURE (note the 5 semicolons, note 2-3 named toys in slot 3) ━━━

OUTDOOR:
"Toy train chugging along a real sandy beach at low tide; real beach-roses tucked along the rail ties as a coral hedgerow; a Barbie doll in a swimsuit cross-legged on a fabric beach blanket alongside a LEGO minifig surfer holding a tiny surfboard, and a Polly Pocket figure waving from a sandcastle 'station'; a real hermit crab crossing the tracks ahead of the locomotive; golden-hour light glinting off wet sand; a kite caught mid-flight on invisible thread above the scene."

"Tiny toy locomotive winding through a real backyard sandbox; real dandelion puffs at intervals along the tracks like streetlamps; two G.I. Joe action figures crouched with binoculars behind a wooden block fort alongside a Buzz Lightyear figure with raised arm directing the locomotive, and a plastic dinosaur lurking near the curve; a real ladybug perched on the cowcatcher; warm midday summer sun on white sand; a paper airplane drifting overhead on thread."

"Kids' toy train weaving over a real forest-floor of pine needles and moss; real fern fronds arching over the rails like jungle canopy; a Lego pirate planking off the caboose with sword raised alongside a Power Ranger action figure in fighting stance defending the engine, and a Strawberry Shortcake figure peeking from behind a pinecone; a real grasshopper mid-leap above the rails; dappled afternoon sun through tree canopy; a vinyl Astro Boy figure hovering in flight pose above the train on fishing line."

"Small toy train rolling across a real picnic blanket on park grass; real wildflower bouquet in a jar towering as a clock tower; a Polly Pocket figure waving from atop a wooden alphabet block platform alongside a vinyl Funko Pop perched on a juice box observing, and a Hot Wheels race car parked at the railroad crossing waiting; a real bee buzzing around the smokestack; golden hour light raking across the blanket; balloons tied to the caboose floating skyward on thread."

"Lionel-style toy train circling a real campsite log beside a dirt path; real moss carpet between the ties as a green lawn; a Buzz Lightyear figure with raised arm directing the locomotive past a tiny lantern alongside two plastic green army figures crouched in formation along the rails, and a Sylvanian Family rabbit holding a tiny picnic basket; a real chipmunk peeking from a real hollow log; campfire glow flickering off the rails at twilight; soap bubbles floating around the locomotive."

INDOOR:
"Toy train rolling across a real braided living-room rug; real lavender sprigs between rail ties forming a purple hedgerow; a Barbie doll cross-legged on a fabric blanket mid-picnic alongside a LEGO minifig knight in silver armor saluting beside the rails, and a tiny Shopkins figure waving from atop a wooden alphabet block platform; a real ladybug perched on the rail ahead; autumn dusk orange-gray light through curtained window; a hovering UFO toy suspended on fishing line drifting above."

"Tiny toy locomotive winding through a real patchwork quilt on a child's bed; real daisies in tiny vases lining the platform like clock towers; a LEGO minifig knight in silver armor saluting beside the rails alongside two Lalaloopsy dolls watching from a pillow embankment, and a Hot Wheels car parked at the bedside-table 'crossing'; a real moth fluttering near the lit headlamp; warm yellow lamplight from a bedside lamp; balloons tied to the caboose floating skyward."

"Kids' toy train weaving across a real chenille throw blanket draped over a sofa; real cherry blossom petals heaped at a curve like a pink snowdrift; a Polly Pocket figure waving from atop a wooden alphabet block platform alongside a plastic toy dinosaur with arms raised at the boxcar, and a Funko Pop perched on the sofa armrest observing; a real curious house cat batting at the caboose from above; golden hour amber light through gauze curtains; a paper airplane drifting overhead on invisible thread."

"Lionel-style toy train circling a real felt play mat on a carpeted bedroom floor; real ivy curling overhead forming a tunnel mouth; two G.I. Joe action figures crouched behind a real wooden block fortress alongside a Buzz Lightyear figure scaling the side of a stacked-book skyline, and a row of plastic dinosaurs lined up watching the locomotive pass; a real ant trail crossing the rails; warm afternoon sunbeam through window catching dust motes; glitter fragments drifting around the smokestack like a comet trail."

"Toy train rolling across a real wool kitchen-rug in cream and sage; real wildflower bouquet in a glass jar towering as a clock tower; a vinyl Funko Pop perched on a real coffee mug observing the train pass alongside a Barbie doll cross-legged with a tiny picnic basket on the rug, and a Strawberry Shortcake figure scattering 'flower petals' along the platform; a real housefly perched on a flat-car; morning sunbeam through a kitchen window; a tiny paper hot-air balloon hanging on thread above."

━━━ SELF-AUDIT BEFORE OUTPUTTING ━━━

For each entry you write, BEFORE adding it to the output array, mentally check:
  ✓ Exactly 5 semicolons?
  ✓ Slot 2 contains "real" + a real flower/plant?
  ✓ Slot 3 names a specific toy brand (Barbie / LEGO / G.I. Joe / Polly Pocket / Funko / Hot Wheels / Buzz / Shopkins / etc.)?
  ✓ Slot 4 contains "real" + a real critter (ladybug / ant / snail / butterfly / bee / songbird / cat / spider / moth / etc.)?
  ✓ Slot 5 is warm/daylight (NOT night / cold / snow)?
  ✓ Slot 6 contains a floating/suspended/hovering/drifting element overhead?

If ANY check fails, REWRITE that entry before outputting.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string is ONE sentence with EXACTLY 5 semicolons separating the 6 slots. Mix outdoor + indoor settings widely. 35-50 words per seed.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
