#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/toybox_chaos_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TOYBOX-CHAOS scene descriptions for ToyBot's toybox-chaos path. The toybox got dumped — multiple TOY TYPES coexist in ONE scene at REAL-WORLD SCALE on a real-world surface (kid's bedroom floor, coffee table, playmat, garage floor, picnic blanket). The size mismatch IS THE POINT. Mixed-medium toy-universe ensemble. Each toy renders in its OWN native style.

Each entry: 18-28 words. ONE specific scene with multiple toy types interacting on a real-world surface at their actual physical scale.

━━━ THE TOY ROSTER (mix and match per scene, never unified style) ━━━
- LEGO minifigs (visible studs, blocky limbs, ~1.5-inch)
- 3.75-inch action-figures (joint-articulation, multicolor wardrobe)
- plush teddies / stuffed animals (fabric texture, button eyes, 6-12-inch)
- Hot-Wheels die-cast cars (chrome, oversized wheels, 3-inch)
- Barbie fashion-dolls (11.5-inch, molded hair)
- green army-men (single-pose, oval-base, 2-inch)
- mech-toys (chrome, transformation seams, 4-6-inch)
- Sylvanian-style flocked-animal figurines (3-inch, flocked velvet)
- vinyl designer-toys (oversized-head, ~4-inch)
- claymation puppets (clay-fingerprints, ~5-inch)

━━━ THE SURFACES (real-world household scale) ━━━
Kid's bedroom floor, coffee-table, playmat, garage floor, picnic-blanket, kitchen-counter, hardwood-floor, rug-pattern (geometric / persian / shag), couch-cushion, blanket-fort, wood-deck, basement-concrete, bathtub-edge, kitchen-table, garden-stones, sandbox, driveway, stair-step, bookshelf-top, windowsill, dining-table, coffee-mug-fortress (mugs scaled up), book-stack mountain, sock-pile mountain, slipper-bridge, pencil-canyon.

━━━ SCENE CATEGORIES (rotate, don't cluster — each scene mixes 3-5 toy types) ━━━
- LEGO knights raiding plush picnic — minifigs charging across red-checkered blanket toward teddy-bear holding tea-cup, knit-blanket terrain
- Hot-Wheels chase through army-men trench — die-cast car cutting through formation of green-army-men in mid-charge, dust-puff
- Mech-toy defending Barbie tea-party — chrome mech kneeling protectively beside Barbie at miniature tea-set, plush-bunny watching
- LEGO + action-figure raid on stuffed teddy fort — minifigs and 3.75-inch G.I.-Joe-style storming sock-pile fortress
- Hot-Wheels parked outside Sylvanian dollhouse — die-cast muscle-car at miniature flocked-animal home, plush-fox peeking
- Mech vs army-men kitchen-counter standoff — chrome humanoid-mech blocking row of green-army-men with weapons drawn
- Plush teddies surrounding crashed Hot-Wheels — concerned stuffed-animal cluster around overturned die-cast on coffee-table
- LEGO + Barbie dance-party rooftop — minifigs and 11.5-inch fashion-doll dancing on coffee-table with mini disco-ball
- Action-figure leading mixed-toy charge — 3.75-inch GI-Joe pointing forward as LEGO knights, army-men, plush-foxes follow
- Hot-Wheels jumping Lego brick canyon — die-cast car mid-flight over LEGO-built ramp, army-men cheering below
- Vinyl-toy hosting tea-party for plush-animals — oversized-head Dunny-style figure pouring tiny teapot for stuffed-bear and bunny
- Claymation-puppet vs mech-toy face-off — clay-fingerprint character squared off against chrome mech on garage-floor
- LEGO city under Barbie giant — Barbie towering over LEGO town, army-men firing tiny rifles in panic, Hot-Wheels evacuating
- Toybox aftermath panorama — wide pull-back of bedroom floor scattered with toys mid-scattered-action, dramatic lighting
- Sylvanian-bunny driving Hot-Wheels — flocked-animal in driver-seat of chrome muscle-car, mech-passenger riding shotgun
- LEGO minifig pilot in Hot-Wheels cockpit — minifig at wheel of die-cast car barreling toward army-men picket-line
- Plush bear-leader rallying mixed-toy army — stuffed-teddy with tiny knit-cape pointing forward, army-men + LEGO + Barbies behind
- Mech-toy delivering pizza to plush-fort — chrome mech holding pizza-box at sock-pile fortress door, plush-bear opening
- Action-figure climbing stack of books — 3.75-inch GI-Joe scaling encyclopedia-tower, LEGO climbers and Hot-Wheels at base
- Barbie + plush-bunny tea-party crashed by army-men — green army-men charging picnic-blanket where Barbie pours tea, bunny startled
- Hot-Wheels demolition-derby on coffee-table — multiple die-cast cars crashing center-table, LEGO-spectators surrounding
- Mech-toy scaling encyclopedia tower with army-men climbers — chrome mech climbing book-stack with green-army-men climbing legs
- Plush teddy hosting LEGO + army-men dinner-party — stuffed-bear at miniature dining-table with mixed minifigs and soldiers seated
- Vinyl-toy DJ-set on bookshelf — oversized-head designer-toy at mini turntables, LEGO + plush-animal crowd watching
- Claymation-character commanding mech-army — clay-figurine pointing across kitchen-counter at chrome mech-formation
- LEGO + plush-animal fishing-trip on bathtub-edge — minifigs holding fishing-rods over tub-water, plush-bear baiting hook
- Hot-Wheels race through Barbie DreamHouse — die-cast cars zipping past pink-mansion with Barbies cheering, plush-bunny mascot
- Mech-toy guarding plush-village — chrome mech standing sentinel at edge of stuffed-animal-village, sunset on chrome
- Army-men + LEGO joint-defense of teddy-bear queen — green-soldiers and minifigs forming circle around plush-bear with crown
- Sylvanian-bunny conducting Hot-Wheels orchestra — flocked-animal at podium with die-cast cars arranged as instruments
- Action-figure rappelling off bookshelf — 3.75-inch GI-Joe descending on string-rope while LEGO + Barbies watch from below
- Plush-bear bartender serving mech-toys — stuffed-bear behind tiny bar, chrome mechs at stools, LEGO + army-men at tables
- Claymation-character riding Hot-Wheels — clay-figurine in driver-seat of die-cast car at mid-skid through bedroom-floor
- Toybox dump-out moment — toys frozen mid-cascade pouring out of toybox onto floor, LEGO + plush + army-men + Hot-Wheels mixed
- Mech-toy chess-game vs vinyl-toy — chrome mech and oversized-head designer-toy at mini chess-board with mixed-toy spectators
- LEGO knights jousting Hot-Wheels — minifig-knight with lance charging die-cast car with lance-fork, army-men spectating
- Plush-fox running concession at LEGO carnival — stuffed-fox at miniature popcorn-stand, LEGO + Barbies + army-men in line
- Action-figure + mech-toy rescue of plush-civilian — 3.75-inch GI-Joe and chrome mech carrying stuffed-bunny from rubble
- Sylvanian-bear-cubs riding Hot-Wheels rollercoaster — flocked-animal cubs in die-cast cars on LEGO-track, screaming
- Barbie commanding army-men squad — 11.5-inch fashion-doll with map pointing as green-army-men in formation salute
- Mech-toy babysitting Sylvanian-bunny-kids — chrome mech kneeling protectively as flocked-animals swarm with toys
- Plush-bear referee at LEGO + army-men football — stuffed-bear with whistle, minifigs on one side and soldiers on other
- Hot-Wheels semi-truck delivering LEGO supplies — die-cast semi parked at LEGO-construction-site, minifigs unloading bricks
- Action-figure leading mixed-toy parade — 3.75-inch GI-Joe with flag at front, LEGO + army-men + plush + Barbies marching behind
- Vinyl-toy + claymation-character art-show opening — designer-toy and clay-figurine standing before tiny canvas, LEGO + Barbies viewing

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- AT LEAST 3 different toy types in the scene (LEGO + plush + army-men, etc.)
- Real-world surface anchor (bedroom-floor / coffee-table / playmat / garage-floor / picnic-blanket / etc.)
- Each toy described in its OWN native medium language (LEGO stays LEGO with studs, plush stays plush with fabric)
- Mid-action narrative — interaction across toy-tribes, not static lineup
- Mention of SCALE MISMATCH being visible (giant teddy vs tiny LEGO, oversized Barbie vs small army-men, etc.)

━━━ BANNED ━━━
- NO unifying art style across the toys (each toy keeps its own medium signature)
- NO scaling toys to be the same size (size mismatch IS the point)
- NO real-world children / hands / humans in scene (toys are autonomous)
- NO fantasy-world / sci-fi-world settings (always real-world household surface)
- NO CGI / illustration / digital-render language
- NO single-toy-type scenes (this is the CHAOS pool — must be ensemble)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
