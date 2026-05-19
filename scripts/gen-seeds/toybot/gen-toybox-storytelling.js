#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/toybox_storytelling.json',
  total: 50,
  batch: 10,
  maxTokens: 4500,
  metaPrompt: (n) => `You are writing ${n} TOY-MISCHIEF-STORYTELLING seed entries for ToyBot's toybox-chaos path.

⭐ THE NORTH STAR
Imagine what TOYS would do if they were dicking off the way humans do when no one is watching. STORY first, scene second. Every render is a SINGLE-FRAME COMEDY MOMENT from a longer absurd toy-story — heist, talent show, wedding crash, mosh pit, rescue mission, tea party gone wrong, escape attempt, courtroom drama, magic show disaster, construction-site collapse. NOT a static "toys on the floor." A SCENE with a STORY playing out.

FUN > SERIOUS. Funny because they're toys doing absurd grown-up things. A LEGO knight charging on a Hot Wheels monster truck. Plush bears moshing while army-men try to break it up. Calico Critters hosting tea when a T-rex barges in. Barbies in tactical gear robbing the piggy-bank vault. Funko Pops conducting a courtroom drama. The HUMOR is non-negotiable.

━━━ STRICT FORMAT — 6 SLOTS, SEMICOLON-SEPARATED, ALL MANDATORY ━━━

EVERY entry is ONE sentence with EXACTLY 5 SEMICOLONS separating 6 slots in this exact order:

  [SLOT 1: REAL surface + THE STORY SETUP]; [SLOT 2: PROTAGONIST + their dramatic absurd action]; [SLOT 3: 3-5 SUPPORTING CAST each with distinct mischief action across different toy-brand families]; [SLOT 4: ABSURD VISUAL GAG / COMEDY PROP DETAIL]; [SLOT 5: WARM PLAY LIGHT]; [SLOT 6: ATMOSPHERIC OVERHEAD CHAOS ELEMENT suspended or drifting through].

If your entry has fewer than 5 semicolons or omits ANY slot, the entry is REJECTED.

━━━ SLOT-BY-SLOT REQUIREMENTS ━━━

**SLOT 1 — REAL SURFACE + STORY SETUP.** Pick the kid-playtime surface AND name the absurd story unfolding. Format: "[surface] — [story setup phrase]." Examples:
  • "Real hardwood bedroom floor — emergency rescue mission underway after a plush teddy got stuck inside the dollhouse chimney"
  • "Real coffee table — wedding ceremony in progress between a Barbie and a LEGO knight, with VIPs seated on stacked books"
  • "Real kitchen counter beside a fruit bowl — full talent-show finale with the toys performing their best acts in front of a jury"
  • "Real garage floor — high-stakes piggy-bank-vault heist with army-men cracking the safe while lookouts watch the door"
  • "Real attic floorboards — courtroom drama mid-verdict, judge bear about to gavel down"
  • "Real living-room rug — plush-bear rave at peak chaos with the bass drop just hit"
  • "Real picnic blanket on park grass — Calico Critter tea party getting crashed by a plastic T-rex bursting through the daisies"
  • "Real bathroom floor — Olympic-style diving event off the toilet rim with toys mid-jump"
  • "Real kid's-bedroom carpet — construction site disaster, the LEGO tower has just collapsed and chaos reigns"
  • "Real basement concrete — underground fight club between a plush bear and a Funko Pop wrestler, crowd gathered in a circle"
  • "Real dining table — birthday party in full swing with toys raiding the present pile and a candle-flame fight in progress"
  • "Real garage workbench — mad-scientist lab where a LEGO inventor's experiment is going dramatically wrong"
  • "Real porch wood-planks — paparazzi photo-op disaster, Barbie tripping over a Hot Wheels in front of flash bulbs"
  • "Real bedroom desk — final exam in session, toys frantically copying off each other while a stern teacher Barbie patrols"
  • "Real bathtub edge tile — pool-party pre-game with toys mid-cannonball into the suds"
  • "Real coffee table — magic show in progress, the magician's hat is releasing way more rabbits than expected"
  • "Real bookshelf ledge — sky-high rooftop dance party with toys getting wild near the edge"
  • "Real game-room rug — high-stakes poker tournament with toys clutching tiny playing cards and stacking gum-ball poker chips"

**SLOT 2 — PROTAGONIST + ABSURD DRAMATIC ACTION.** ONE hero toy doing something hilariously dramatic / silly. Examples:
  • "a LEGO minifig knight in shining armor charging on the back of a Hot Wheels monster truck with sword raised heroically"
  • "a Barbie in evening gown crowd-surfing across a sea of plush teddies with her arms spread wide"
  • "a G.I. Joe commando rappelling down from the ceiling fan on a kite string with binoculars pressed to his eyes"
  • "a Funko Pop wizard wand-raised mid-spell with a comically large explosion frozen behind him"
  • "an olive-green plastic army general standing on a tissue-box podium gesturing dramatically with a paperclip-sword"
  • "a plush teddy DJ behind a turntable made of a CD case, headphones on, paw raised mid-drop"
  • "a Polly Pocket figure mid-microphone-drop after delivering a devastating talent-show roast"
  • "a Calico Critter bunny mom in apron mid-strangle of a plastic T-rex with a wooden-spoon weapon"
  • "a Hot Wheels Camaro doing a smoky burnout in the middle of a tea-party, donut-tracks scorched into the blanket"
  • "a vintage 3.75-inch space-knight mid-lightsaber-duel with a stuffed unicorn that's clearly winning"
  • "a Power Ranger mid-flying-kick at a stacked-block tower toppling in slow motion"
  • "a stitched-Sackboy with button-eyes mid-running-broad-jump over a yogurt-cup canyon, scarf trailing"
  • "a Buzz Lightyear figure pointing at the chaos with raised arm yelling 'TO INFINITY' to no one in particular"
  • "a Sylvanian Family raccoon father mid-piggy-bank-smash with a tiny crowbar in paw"
  • "a Lego pirate mid-walking-the-plank off a stacked-book diving board"

**SLOT 3 — 3-5 SUPPORTING CAST each with DISTINCT mischief action across DIFFERENT brand families.** Mix toy types. Each character does something specific. Examples:
  • "two G.I. Joe paramedics dragging a stretcher made of a Hot Wheels chassis, a Calico Critter bunny family of three holding tiny 'GET WELL' sticky-note signs, a Funko Pop wizard waving a wand trying to fix things, and an olive-green army-medic frantically taking notes on a paper-airplane clipboard"
  • "a plush bear bartender mixing juice-box cocktails alongside three Polly Pocket figures cheering on bar stools, a vintage 3.75-inch Kenner space-pilot dancing badly on the makeshift dance floor, and a Hot Wheels limo idling outside the 'club entrance'"
  • "a row of plastic toy dinosaurs roaring spectator-style from the rug edge, two Barbies in tactical gear flanking a stacked-block fortress, a Funko Pop monster wielding a tiny vinyl chainsaw, and a Polly Pocket holding a tiny smartphone livestreaming the action"
  • "a stitched-Sackboy holding a tiny scoreboard, three LEGO minifig referees blowing tiny whistles, a plush owl-judge on a stacked-book bench, and four green army-men forming a cheerleading pyramid"
  • "an olive-green army-officer with megaphone shouting 'STAND DOWN', a Calico Critter family of four arranged at a tea table totally oblivious, a Strawberry Shortcake figure scattering felt petals as confetti, and a Buzz Lightyear figure photobombing in the background"

**SLOT 4 — ABSURD VISUAL GAG / COMEDY PROP DETAIL.** ONE specific tiny detail that makes the scene FUNNIER. Examples:
  • "a sticky-note sign on a wooden block reading 'WE TRIED'"
  • "a tiny cardboard sign held by one character reading 'I CAN EXPLAIN'"
  • "a yogurt-cup volcano erupting raspberry sauce in the corner of the frame"
  • "a popsicle melting into a puddle with a tiny inflatable pool-toy floating in the syrup"
  • "a tipped-over juice-box leaking apple-juice river across the rug"
  • "a Hot Wheels ambulance with tissue-paper sirens flashing as it speeds in"
  • "a wadded-up sock thrown across the frame mid-flight like a meteor"
  • "a tiny disco ball made of crumpled foil hanging askew above the dance floor"
  • "a 'WANTED' poster made from a torn-out coloring-book page stuck to the wall"
  • "a tiny LEGO 'PLEASE DON'T' tower stacked behind the chaos as a passive-aggressive warning"
  • "an action-figure boot abandoned mid-frame with a tiny banana peel beside it"
  • "a Pez dispenser dispensing pez at random intervals nobody is collecting"
  • "a 'CAUTION WET FLOOR' sign drawn on a Post-it next to a knocked-over water glass"
  • "a tiny stuffed bear holding a placard reading 'SEND HELP' with a sad embroidered face"
  • "a paper crown that fell off someone mid-chaos, abandoned and dented"

**SLOT 5 — WARM PLAY LIGHT.** Kid's-room lamp / window sun / fairy-lights / candle. NEVER cold / night / storm. Examples:
  • "warm yellow lamplight from a desk lamp pooling across the rug"
  • "golden afternoon sunbeam through a bedroom window catching dust motes"
  • "twinkly fairy lights overhead reflecting off chrome accents"
  • "morning sunbeam through gauze curtains painting everything in pastel"
  • "warm tea-light candle glow from a nearby coffee mug"
  • "Christmas-tree string-light glow casting multicolored shadows"
  • "kitchen overhead light at lunchtime making everything bright and crisp"
  • "late-afternoon golden hour through a sliding-glass door"

**SLOT 6 — ATMOSPHERIC OVERHEAD CHAOS ELEMENT.** Something suspended above, drifting overhead, or floating through the upper frame. Required signal-word: one of [hovering / suspended / drifting / floating / overhead / mid-flight / mid-air]. Examples:
  • "a paper airplane drifting overhead spelling 'HELP' in red marker"
  • "balloons tied to the chandelier floating skyward in a cluster"
  • "glitter dust drifting through the air around the scene"
  • "a kite caught mid-flight overhead on invisible thread"
  • "a remote-control plane buzzing low across the frame in chaos"
  • "a vinyl Astro Boy figure hovering in flight pose on fishing line"
  • "confetti drifting across the frame in a slow-motion shower"
  • "a tiny paper hot-air balloon hanging from above"
  • "a kid's crayon drawing pinned overhead drifting on a tape edge"
  • "a beach ball suspended mid-bounce above the dance floor"
  • "soap bubbles floating around the chaos in slow clusters"

━━━ ABSOLUTE BANS ━━━
- NO single-medium scenes. EVERY scene mixes 4-6+ DIFFERENT toy mediums (LEGO + plush + Hot Wheels + Barbie + Funko Pop + GI Joe + army-men + Calico Critter + plastic dinosaur).
- NO serious / somber / dark / nightmare / horror tones. FUN-FIRST. Slapstick-comedy / sitcom / saturday-morning-cartoon energy.
- NO snow / winter / night / nightfall / dark / cold / storm. Always warm + cozy + bright.
- NO "diorama" / "model railroad" / "tilt-shift" / "scratch-built" — these aren't model dioramas. Real kids' real playtime moments.
- NO single-character compositions. The frame is PACKED with toys (5-8 visible) in distinct mischief actions.

━━━ MUST-HAVES PER ENTRY ━━━
- A SPECIFIC STORY HAPPENING (not "toys on a rug" — "toys mid-rescue-mission" / "mid-talent-show" / "mid-heist" / "mid-wedding-crash")
- A NAMED protagonist + 3-5 named supporting cast across DIFFERENT brand families
- FUNNY / SILLY tone — the toys are dicking off, not posing seriously
- A specific COMEDY PROP DETAIL that makes the scene MORE absurd
- Warm playtime lighting
- An overhead/floating chaos element

━━━ COMPLETE EXAMPLES — STUDY THE 6-SLOT PATTERN ━━━

"Real hardwood bedroom floor — emergency rescue mission underway after a plush teddy got stuck inside the dollhouse chimney; a LEGO firefighter minifig charging up a tissue-paper ladder with a wooden-block axe raised heroically; two G.I. Joe paramedics dragging a stretcher made of a Hot Wheels chassis alongside a Calico Critter bunny family of three holding 'GET WELL' sticky-note signs, an olive-green army-medic taking frantic notes on a paper-airplane clipboard, and a Funko Pop wizard waving his wand trying to fix things; a sticky-note sign reading 'WE TRIED' propped on a wooden block in the corner; warm yellow lamplight from a desk lamp pooling across the floor; a paper airplane drifting overhead in 'HELP' formation."

"Real coffee table — wedding ceremony in full swing between a Barbie bride and a LEGO knight groom with VIPs seated on stacked-book pews; a Hot Wheels monster truck barging through the back of the venue with a Barbie in tactical gear leaning out the window screaming 'OBJECTION'; a plush teddy officiant frozen mid-sentence holding a tiny prayer book, three Polly Pocket bridesmaids covering their mouths in shock, a Funko Pop drummer accidentally hitting a cymbal mid-chaos, and an olive-green army-photographer still snapping flash photos through the disaster; a paper crown abandoned mid-aisle, dented and tipped over; warm afternoon sun through a window catching dust motes; balloons tied to the chandelier floating askew skyward in a cluster."

"Real kitchen counter beside a fruit bowl — talent-show finale with toys taking turns performing their acts; a stitched-Sackboy with button-eyes mid-running-broad-jump over a yogurt-cup canyon with scarf trailing dramatically; a Calico Critter bunny mom in apron juggling tiny fabric vegetables, a row of plastic toy dinosaurs roaring as enthusiastic spectators, a vintage 3.75-inch space-knight playing a tiny ukulele, and a Polly Pocket holding a tiny smartphone livestreaming everything; a tipped-over juice-box leaking apple-juice river across the counter; warm kitchen overhead light at lunchtime making everything bright; a tiny paper hot-air balloon hanging from above on thread."

"Real living-room rug — plush-bear rave at peak chaos with the bass drop just hit; a plush teddy DJ behind a turntable made of a CD case with paw raised mid-drop; three Barbies dancing in choreographed unity on a stacked-book stage, two olive-green army-men working security trying to break up a mosh pit, a Funko Pop bouncer at the 'door' with arms crossed, and a Calico Critter bunny passed out on a tiny couch in the corner; a tiny disco ball made of crumpled foil hanging askew above; twinkly fairy lights overhead reflecting off chrome accents; soap bubbles floating around the chaos in slow clusters."

"Real garage floor — high-stakes piggy-bank-vault heist with army-men cracking the safe; a Sylvanian raccoon father mid-piggy-bank-smash with a tiny crowbar in paw; two G.I. Joe commandos rappelling from a tool-bench shelf on kite-string ropes, a Hot Wheels getaway car idling with engine smoke, a Funko Pop lookout watching from a paint-can tower, and a plush owl-pirate at the makeshift command center with a stitched eye-patch; a tiny cardboard sign held by one character reading 'I CAN EXPLAIN'; warm afternoon golden-hour light slanting through the garage window; a remote-control plane buzzing low across the frame in surveillance pass."

━━━ SELF-AUDIT BEFORE OUTPUTTING ━━━
For each entry:
  ✓ Exactly 5 semicolons?
  ✓ Slot 1 names a SPECIFIC STORY SETUP (not just a setting)?
  ✓ Slot 2 has ONE named protagonist with a dramatic absurd action?
  ✓ Slot 3 has 3-5 supporting characters across DIFFERENT brand families?
  ✓ Slot 4 has a SPECIFIC COMEDY PROP DETAIL?
  ✓ Slot 5 is warm + cozy + bright?
  ✓ Slot 6 has a floating/suspended/drifting element overhead?
  ✓ The scene is FUN — silly + slapstick, not serious?

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string is ONE sentence with EXACTLY 5 semicolons. Vary STORIES widely — heists, weddings, talent shows, mosh pits, rescue missions, tea parties crashed, courtroom dramas, escape attempts, magic shows, construction disasters, fight clubs, Olympic events, pool parties, mad scientist labs, etc. Vary toy-brand mixes widely. 50-75 words per seed.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
