/**
 * actionRegisters.ts — GENRE action registers (Kevin 2026-09-06: "bespoke actions for certain genres of pools
 * so they always make coherent scenes … standing in a slight posture is still fine, a well composed shot …
 * a nice variety is what we're after"). SCENE_FIRST_ACTION_PLAN.md §10.1 C.
 *
 * One register per genre: `actions` = coherent things people DO in that world; `stills` = composed poses
 * that are welcome too. Nightly hands Sonnet a shuffled handful as "things people do HERE — pick or adapt
 * one, or a composed still". Keys: the 14 Halloween + 8 Fall pools (holidayPools.ts), scenario categories (plus
 * aliases from the single-scenario category names), the 20 location biomes (biomeAxes.ts), and the two
 * generic seeded kinds (goofy / elegant) as the fallback when a row carries no category.
 *
 * EVERY entry must pass actionSafety.validateActionBeat for cast 1 AND 2 — Sonnet often echoes an entry
 * verbatim and a rejected echo would silently fall back to a pool pose. Locked by
 * __tests__/lib/actionRegisters.test.ts, which also fails if a Halloween pool or a biome has no register.
 * Rules of thumb for authoring: no face / eye / camera words, no pronouns, no "reading / studying / admiring",
 * no "arms raised / overhead", no walking-into-each-other proximity, nothing above the head.
 */
export interface ActionRegister {
  actions: string[];
  stills: string[];
}

const R = (actions: string[], stills: string[]): ActionRegister => ({ actions, stills });

export const ACTION_REGISTERS: Record<string, ActionRegister> = {
  // ── Halloween pools ─────────────────────────────────────────────────────────
  halloween_neighborhood: R(
    [
      'carving a pumpkin on the porch steps, seeds scattered on newspaper',
      'handing out full-size candy bars from a big orange bowl at the door',
      'hanging a paper skeleton from the porch light with a bit of twine',
      'setting a lit jack-o-lantern on the top step and nudging it into place',
      'stringing orange lights along the porch railing',
      'sipping hot cider from a mug on the porch swing',
      'holding a candy pail out for a trick-or-treater at the gate',
      'adjusting an inflatable ghost tethered on the lawn',
    ],
    [
      'leaning against a porch post with a mug of cider, one ankle crossed',
      'standing on the steps with hands in coat pockets, a pumpkin at each foot',
    ]
  ),
  pumpkin_patch_night: R(
    [
      'hoisting a fat pumpkin out of the vines with both hands',
      'pulling a red wagon loaded with pumpkins along the row',
      'holding up two pumpkins to pick the better one',
      'lighting a lantern at the corn-maze entrance',
      'steadying a stack of hay bales on the wagon bed',
      'warming both hands on a paper cup of cider by the bonfire',
      'lifting a lit jack-o-lantern onto a fence post',
      'brushing straw off a corduroy jacket beside the wagon',
    ],
    [
      'leaning on the wagon rail under the harvest moon, hands loose',
      'standing between the pumpkin rows with a lantern held at hip height',
    ]
  ),
  witch_cottage: R(
    [
      'stirring the bubbling green cauldron with a long wooden spoon',
      'pouring a glowing potion from a tall bottle into small jars',
      'sprinkling dried herbs into the cauldron from a linen pouch',
      'lifting a black cat off the spellbook shelf',
      'lighting a row of dripping candles with a taper',
      'grinding something in a stone mortar at the workbench',
      'holding a glowing potion bottle up to the candlelight',
      'sweeping the flagstones with a twig broom',
    ],
    [
      'standing beside the cauldron with one hand on its rim, the other holding a ladle',
      'leaning in the crooked doorway with a broom, hat tilted back',
    ]
  ),
  gothic_manor: R(
    [
      'lighting a candelabra on the mantel with a long match',
      'lifting a crystal goblet from a silver tray',
      'drawing back a heavy velvet drape from the window',
      'placing a black rose on the piano lid',
      'descending the grand staircase with one gloved hand on the banister',
      'setting a lantern on the stone balustrade',
      'sweeping a floor-length cape back over one shoulder',
      'pouring dark wine into two goblets on the sideboard',
    ],
    [
      'standing at the foot of the staircase, one hand on the newel post, cape settled',
      'leaning against a marble column in the ballroom with a goblet held at chest height',
    ]
  ),
  haunted_graveyard: R(
    [
      'setting a lantern on a leaning headstone',
      'laying a bundle of black roses at the foot of a crypt',
      'holding a lantern out over the ankle-high fog',
      'brushing moss from the carved name on a tombstone',
      'spreading a checkered blanket between two mossy graves',
      'pushing open the wrought-iron gate with one hand',
      'lifting a raven onto a gloved forearm',
      'pouring wine from a basket beside the crypt steps',
    ],
    [
      'standing among the headstones with a lantern held low, coat collar turned up',
      'leaning on the iron gate with folded arms, fog curling around the boots',
    ]
  ),
  halloween_town_square: R(
    [
      'scooping glowing green water from the fountain with cupped hands',
      'lifting a singing jack-o-lantern off the wall',
      'winding a crank on a crooked music box in the square',
      'setting a lit pumpkin on the fountain rim',
      'holding a bat-shaped kite by its string in the square',
      'tossing candy corn to a pumpkin-headed scarecrow',
      'sweeping the spiral hill path with a crooked broom',
      'holding up a lantern beneath the enormous moon',
    ],
    [
      'leaning on the fountain rim with one hand, hat pushed back',
      'standing on the spiral hill with hands in the pockets of a patchwork coat',
    ]
  ),
  haunted_house_comedy: R(
    [
      'tearing a paper ticket from the take-a-number dispenser',
      'sliding a form across the reception desk',
      'lifting the lid of a dusty attic trunk',
      'setting a tiny model house onto the miniature town',
      'adjusting a striped tie in a cracked mirror',
      'dusting off a striped armchair with a rag',
      'holding a numbered ticket up between two fingers',
      'straightening a crooked framed portrait on the wall',
    ],
    [
      'leaning on the reception counter with a ticket in hand, striped suit buttoned',
      'standing in the mint-green corridor with hands clasped behind the back',
    ]
  ),
  halloween_party: R(
    [
      'lifting a caramel apple from a tray on the counter',
      'clinking two pumpkin-shaped mugs in a toast',
      'scooping a handful of candy from a big glass bowl',
      'plugging in a string of orange party lights',
      'holding a slice of pumpkin pie on a paper plate',
      'shaking a cocktail shaker behind the candy bar',
      'strumming a guitar beside a jack-o-lantern drum kit',
      'passing a bowl of popcorn across the couch',
    ],
    [
      'leaning against the kitchen counter with a mug, party lights behind',
      'sitting on the arm of the couch with a slice of pie on a plate',
    ]
  ),
  haunted_attractions: R(
    [
      'buying two tickets at the cobwebbed booth window',
      'holding a flashlight out into the fog at the entrance',
      'pulling back the velvet rope at the haunted-house door',
      'carrying a bucket of popcorn past the dark carousel',
      'handing a ticket to the ringmaster at the big top',
      'holding onto a carousel pole beside a glowing horse',
      'aiming a ring at the bottle toss under the striped awning',
      'winding cotton candy onto a paper cone',
    ],
    [
      'standing at the ticket booth with a bucket of popcorn, fog around the boots',
      'leaning on the carousel rail with folded arms as the horses glow',
    ]
  ),
  mad_lab_and_monsters: R(
    [
      'pouring a bubbling green liquid from one beaker into another',
      'throwing a big iron switch on the laboratory wall',
      'holding a glowing jar of goo up to the Tesla coil light',
      'scribbling formulas on the chalkboard with a stub of chalk',
      'loading a silver bolt into an ornate crossbow',
      'lighting a lantern at the edge of the pine forest',
      'buckling the straps of a leather monster-hunter satchel',
      'lifting a jar of specimens off the shelf',
    ],
    [
      'standing at the workbench with rubber gloves on and one hand on a beaker',
      'leaning against a pine trunk with a crossbow resting on the shoulder',
    ]
  ),
  ghost_hunting_crew: R(
    [
      'aiming a glowing gadget wand down the library aisle',
      'checking a beeping meter held at chest height',
      'lifting a ghost trap by its handle off the marble floor',
      'wiping green slime off a coverall sleeve',
      'shouldering a glowing backpack in the firehouse garage',
      'sliding a heavy toolbox out of the converted hearse',
      'pointing a flashlight at a book floating off the shelf',
      'pulling on a work glove beside the card catalog',
    ],
    [
      'standing in the tan coveralls with the gadget wand at hip height, backpack glowing',
      'leaning against the hearse fender with folded arms',
    ]
  ),
  seance_parlor: R(
    [
      'resting both hands lightly on the velvet table beside the spirit board',
      'lifting the cloth from a glowing crystal ball',
      'laying a tarot card down on the velvet',
      'lighting the candelabra in the center of the table',
      'holding a candle out toward the drifting curtains',
      'sliding the planchette across the spirit board with two fingertips',
      'pouring tea from a levitating pot into a china cup',
      'drawing the parlor curtains closed with one hand',
    ],
    [
      'standing behind the velvet table with fingertips resting on its edge',
      'sitting at the table with hands folded beside the crystal ball',
    ]
  ),
  cute_halloween: R(
    [
      'holding a plush ghost to the chest with both arms',
      'placing a tiny witch hat on a black cat',
      'holding a candy-corn cupcake up on a small plate',
      'stringing candy-corn bunting across the doorway',
      'setting a row of round mini pumpkins along the windowsill',
      'pouring pastel sprinkles onto a ghost cookie',
      'lifting a lilac lantern shaped like a pumpkin',
      'tying a ribbon around a small pumpkin',
    ],
    [
      'sitting on the pastel doorstep with a plush ghost in the lap',
      'standing in the tiny cafe doorway holding a cupcake on a plate',
    ]
  ),
  ghost_pirate_ship: R(
    [
      'gripping the ship wheel with both hands as fog rolls over the deck',
      'lifting a fistful of cursed gold coins from an open chest',
      'holding a glowing compass out at chest height',
      'hauling on a rope of the torn silver sail',
      'pouring rum from a bottle into a tin cup on a barrel',
      'unrolling a treasure map across a barrel top',
      'lighting a lantern at the ship rail',
      'resting a cutlass across the shoulder at the rail',
    ],
    [
      'standing at the rail with one boot on a coil of rope, tricorn pushed back',
      'leaning against the mast with folded arms as the sails glow',
    ]
  ),
  // ── seeded scenario genres ───────────────────────────────────────────────────
  goofy: R(
    [
      'holding an absurdly oversized prop from the scene with both hands',
      'balancing a stack of something from the scene at chest height',
      'striking a silly superhero pose with fists on hips',
      'high-fiving the air beside the scene prop',
      'pretending to conduct the scene with a spoon',
      'clapping along to unheard music, shoulders swaying',
      'holding a tiny umbrella over the scene prop',
      'giving a double thumbs-up at chest height',
    ],
    [
      'standing with hands on hips in a mock-heroic stance',
      'sitting on the scene prop with arms folded, mock serious',
    ]
  ),
  elegant: R(
    [
      'lifting a champagne flute from a passing silver tray',
      'adjusting a cufflink at chest height',
      'smoothing a lapel with one gloved hand',
      'holding a small clutch at the waist with both hands',
      'offering an arm to escort at a clear step apart',
      'lifting a teacup and saucer from a side table',
      'holding a single rose at chest height',
      'buttoning a jacket with one hand',
    ],
    [
      'standing with weight back on one heel, hands relaxed at the sides',
      'leaning against a marble column with a flute held at chest height',
    ]
  ),
  swashbuckler: R(
    [
      'gripping the ship wheel hard against the storm',
      'resting a cutlass across one shoulder at the rail',
      'lifting a gold coin from the open treasure chest',
      'unrolling a treasure map across a tavern table',
      'planting a dagger into the map with one hand',
      'hauling on a rope as the sail fills',
      'pouring rum into a tin cup on the barrel',
      'holding a lantern out over the black water',
    ],
    [
      'standing at the rail with one boot on a coil of rope',
      'leaning against the mast with folded arms',
    ]
  ),
  artifact_hunter: R(
    [
      'brushing dust from a carved stone idol with a small brush',
      'holding a lantern into the dark tomb entrance',
      'lifting a golden idol from its pedestal with both hands',
      'unrolling a map across a crate in the dig camp',
      'coiling a bullwhip at the hip',
      'prying a stone lid open with a crowbar',
      'holding a compass out at chest height in the jungle',
      'tightening the strap of a leather satchel',
    ],
    [
      'standing at the tomb entrance with a lantern held low, hat brim up',
      'leaning on a crate at the dig camp with folded arms',
    ]
  ),
  evening_city: R(
    [
      'hailing a cab with one hand from the curb',
      'lifting a cocktail from the rooftop bar',
      'holding a takeout coffee under the neon signs',
      'flipping up a coat collar against the night wind',
      'holding an umbrella over the wet sidewalk',
      'buttoning a coat outside the theater',
      'leaning on the railing of the rooftop terrace',
      'holding a small shopping bag at the crosswalk',
    ],
    [
      'standing at the curb with hands in coat pockets under the neon',
      'leaning against a lamppost with a coffee cup',
    ]
  ),
  gatsby_1920s: R(
    [
      'lifting a coupe of champagne from a silver tray',
      'adjusting a beaded headband with one hand',
      'holding a long cigarette holder at chest height',
      'tapping a cane on the marble floor',
      'straightening a bow tie in the ballroom',
      'holding a feathered fan at the waist',
      'clinking coupes in a toast at chest height',
      'lifting a fur stole onto one shoulder',
    ],
    [
      'standing at the top of the ballroom stairs with a coupe in hand',
      'leaning on the piano with one elbow, cane in the other hand',
    ]
  ),
  modern_blacktie: R(
    [
      'adjusting a cufflink at chest height',
      'lifting a flute of champagne from a tray',
      'holding a small clutch at the waist',
      'buttoning a tuxedo jacket with one hand',
      'sweeping a gown train aside with one hand',
      'signing a guest book with a fountain pen',
      'holding a program at chest height on the red carpet',
      'lifting a glass in a toast at chest height',
    ],
    [
      'standing on the red carpet with hands relaxed at the sides',
      'leaning against a marble column with a flute held at chest height',
    ]
  ),
  old_hollywood: R(
    [
      'holding a vintage microphone stand with one hand',
      'lifting a martini glass at the studio bar',
      'draping a fur stole over one shoulder',
      'holding a clapperboard at chest height',
      'signing an autograph on a glossy photo',
      'tipping a fedora brim with two fingers',
      'holding a long cigarette holder at chest height',
      'leaning on a director chair with a script rolled in one hand',
    ],
    [
      'standing under the marquee lights with hands in trouser pockets',
      'leaning against the studio car with one elbow on the roof',
    ]
  ),
  regency: R(
    [
      'lifting a teacup and saucer from the tea table',
      'holding a folded fan at the waist',
      'offering a gloved hand at a clear step apart',
      'placing a book on the pianoforte lid',
      'holding a parasol over one shoulder',
      'smoothing a silk glove up the forearm',
      'lifting a small posy of flowers at chest height',
      'straightening a cravat with one hand',
    ],
    [
      'standing in the drawing room with hands clasped at the waist',
      'leaning on the pianoforte with one hand resting on its lid',
    ]
  ),
  renaissance_baroque: R(
    [
      'lifting a goblet of wine from the banquet table',
      'holding a leather-bound book closed against the chest',
      'plucking a lute string with one hand',
      'holding a quill above a parchment on the desk',
      'lifting a candelabra from the long table',
      'draping a velvet cloak over one shoulder',
      'holding a jeweled fan on a stick at chest height',
      'offering a hand at a clear step apart for a dance',
    ],
    [
      'standing beneath the frescoed ceiling with hands clasped at the waist',
      'leaning on the banquet table with a goblet held at chest height',
    ]
  ),
  romantic_gardens: R(
    [
      'clipping a rose from the arch with garden shears',
      'holding a woven basket of cut lavender at the hip',
      'lifting a watering can over a bed of tulips',
      'holding a single rose at chest height',
      'brushing petals off a stone bench before sitting',
      'lifting a teacup on the garden terrace',
      'tying a ribbon around a bouquet',
      'holding a straw hat by its brim in the breeze',
    ],
    [
      'standing under the rose arch with a basket held at the hip',
      'sitting on the stone bench with hands folded in the lap',
    ]
  ),
  street_cool: R(
    [
      'holding a skateboard by its nose at the hip',
      'flipping up a denim jacket collar',
      'holding an iced coffee at chest height by the mural',
      'leaning against a graffiti wall with one boot up',
      'adjusting a beanie with one hand',
      'holding a boombox on one shoulder',
      'tying a sneaker lace with one foot on a crate',
      'spinning a basketball on one finger at chest height',
    ],
    [
      'standing against the mural with hands in hoodie pockets',
      'leaning on a chain-link fence with folded arms',
    ]
  ),
  victorian: R(
    [
      'lifting a teacup and saucer in the conservatory',
      'holding a parasol over one shoulder',
      'checking a pocket watch on its chain at chest height',
      'holding a top hat by its brim at the hip',
      'placing a gloved hand on the fern stand',
      'holding a small bouquet of violets at chest height',
      'buttoning a frock coat with one hand',
      'lifting a cage of songbirds by its ring',
    ],
    [
      'standing among the ferns with hands clasped in front',
      'leaning on the conservatory doorframe with a top hat in hand',
    ]
  ),
  absurd_everyday: R(
    [
      'holding an oversized version of a household object with both hands',
      'balancing a stack of pancakes on a plate at chest height',
      'pushing a shopping cart full of rubber ducks',
      'holding a leash attached to a very small dog in a big hat',
      'carrying an armful of baguettes',
      'holding a tiny umbrella over a giant sandwich',
      'pouring cereal from a comically large box',
      'holding a garden gnome like a trophy at chest height',
    ],
    [
      'standing in the checkout line with folded arms and a mock-serious stance',
      'sitting on a giant cushion with hands on knees',
    ]
  ),
  animal_mayhem: R(
    [
      'holding a squirming puppy at chest height with both hands',
      'offering a carrot to a goat at arm length',
      'holding a bucket of feed as ducks crowd the boots',
      'balancing a parrot on one forearm',
      'holding a lead as a llama tugs the other way',
      'scooping a kitten out of a basket',
      'holding a bunch of bananas as monkeys reach from the fence',
      'tossing a treat to a dog at hip height',
    ],
    [
      'standing in the petting pen with a bucket held at the hip',
      'sitting on a hay bale with a kitten in the lap',
    ]
  ),
  fun_activities: R(
    [
      'gripping the bumper-car wheel with both hands',
      'holding a bowling ball at chest height on the lane',
      'swinging a mini-golf putter low at the green',
      'holding a paddle at the ping-pong table',
      'gripping the handles of a go-kart at the start line',
      'holding a bow with an arrow nocked at chest height',
      'lifting a trophy from the arcade counter',
      'holding two ice-cream cones at chest height',
    ],
    [
      'standing at the arcade cabinet with hands on the controls',
      'leaning on the go-kart with one hand on the wheel',
    ]
  ),
  party_carnival: R(
    [
      'holding a cone of cotton candy at chest height',
      'tossing a ring at the bottle-toss booth',
      'holding a giant stuffed prize under one arm',
      'gripping the safety bar of the ferris-wheel car',
      'holding a corn dog and a lemonade',
      'aiming a water pistol at the clown target',
      'holding a bunch of balloons by the strings at chest height',
      'clapping along to the carousel organ',
    ],
    [
      'standing at the ring-toss booth with a prize under one arm',
      'leaning on the ferris-wheel fence with a lemonade',
    ]
  ),
  time_travel: R(
    [
      'holding a torch in a castle corridor',
      'gripping the wheel of a vintage roadster',
      'holding a quill above a parchment scroll',
      'lifting a goblet in a medieval great hall',
      'holding a brass spyglass at chest height on deck',
      'adjusting a powdered wig with one hand',
      'holding a disco ball under one arm',
      'cranking the handle of a gramophone',
    ],
    [
      'standing in period dress with hands clasped in front',
      'leaning against the roadster with folded arms',
    ]
  ),
  rich_famous: R(
    [
      'stepping out of a black car onto the red carpet with one hand on the door',
      'lifting a flute of champagne on the yacht deck',
      'holding a small designer bag at the wrist',
      'signing a guest book with a gold pen',
      'lifting a champagne bucket lid at the marble bar',
      'holding a tiny dog under one arm on the terrace',
      'buttoning a tailored jacket at the hotel entrance',
      'holding a boarding pass beside a private jet stair',
    ],
    [
      'standing at the top of the jet stairs with one hand on the rail',
      'leaning against the black car with folded arms',
    ]
  ),
  stage_and_fame: R(
    [
      'holding a vintage microphone stand with one hand',
      'lifting a golden trophy at chest height on the stage',
      'signing an autograph on a program held out by a fan',
      'holding a bouquet of roses at the curtain call',
      'adjusting an in-ear monitor with one hand at the mic',
      'holding a guitar by the neck at the edge of the stage',
      'tipping a top hat at the footlights',
      'holding a script rolled in one hand backstage',
    ],
    [
      'standing at the microphone with both hands on the stand',
      'leaning against the stage-door wall with a bouquet',
    ]
  ),
  out_and_about: R(
    [
      'holding a takeout coffee and a paper bag of pastries',
      'pushing a bicycle by the handlebars along the path',
      'holding a farmers-market tote full of vegetables',
      'holding a leash as a dog tugs toward the park',
      'lifting a slice of pizza from a paper plate',
      'holding a kite string on the green',
      'flipping through vinyl in a crate outside the record shop',
      'holding an ice-cream cone at the corner',
    ],
    ['standing at the corner with hands in jacket pockets', 'sitting on a park bench with a coffee']
  ),
  surreal_absurd: R(
    [
      'holding a floating teacup by its handle at chest height',
      'carrying a door with no house under one arm',
      'holding an umbrella that rains upward',
      'balancing a fishbowl on one palm at chest height',
      'holding a ladder that leads to a cloud',
      'pouring tea into a cup that is also a hat held at chest height',
      'holding a giant key at the hip',
      'winding a pocket watch the size of a dinner plate',
    ],
    [
      'standing calmly inside the absurd scene with hands clasped behind the back',
      'sitting on a floating chair with hands on knees',
    ]
  ),
  // ── location fallback (biome unknown — e.g. a place with no essence card yet) ──
  location: R(
    [
      'holding a takeout coffee at chest height on the walk',
      'shouldering a canvas day bag',
      'holding a folded map at the hip',
      'zipping a light jacket against the breeze',
      'holding a water bottle at chest height',
      'resting a hand on a railing above the view',
      'holding a hat by its brim in the wind',
      'lifting a small souvenir from a market stall',
    ],
    [
      'standing with hands in jacket pockets, weight on one hip',
      'leaning on a railing with folded arms above the view',
    ]
  ),
  // ── location biomes ──────────────────────────────────────────────────────────
  tropical_coastal: R(
    [
      'holding a coconut with a straw at chest height',
      'rinsing sand off the shins at the tide line',
      'carrying a surfboard under one arm on the sand',
      'holding a snorkel by its strap at the hip',
      'shaking out a beach towel',
      'holding a woven hat by its brim in the breeze',
      'lifting a paddle beside a kayak',
      'tossing a shell back into the shallows',
    ],
    [
      'standing at the tide line with hands in shorts pockets',
      'sitting on the edge of a beached outrigger with feet in the sand',
    ]
  ),
  arctic_polar: R(
    [
      'warming both hands on a thermos cup in the snow',
      'holding a pair of snowshoes by the straps',
      'brushing snow off a fur-lined parka sleeve',
      'holding a lantern at the ice edge',
      'gripping the sled handle',
      'scooping a handful of snow with a mitten',
      'holding a pair of ski poles planted in the drift',
      'zipping a parka against the wind',
    ],
    [
      'standing on the ice with mittened hands in parka pockets',
      'leaning on the sled with a thermos cup',
    ]
  ),
  ancient_ruins: R(
    [
      'resting a hand on a fallen column',
      'holding a guidebook closed against the chest',
      'brushing dust from a carved relief with a fingertip',
      'holding a water bottle at chest height in the heat',
      'lifting a straw hat by its brim',
      'holding a rolled map at the hip',
      'stepping up onto a broken stone step',
      'holding a lantern into an arched doorway',
    ],
    [
      'standing between two columns with hands in linen pockets',
      'sitting on a fallen block with elbows on knees',
    ]
  ),
  scifi_cosmic: R(
    [
      'resting a gloved hand on the viewport rail',
      'holding a glowing tablet at chest height',
      'gripping the throttle lever of the shuttle',
      'holding a breather unit by its strap',
      'adjusting a strap on a flight suit',
      'lifting a canister of glowing fuel',
      'pressing a palm to the airlock panel',
      'holding a star chart projected from a wrist device',
    ],
    [
      'standing at the viewport with hands clasped behind the back',
      'leaning against the shuttle bulkhead with folded arms',
    ]
  ),
  fantasy_imagined: R(
    [
      'holding a glowing lantern on a wooden staff',
      'lifting a goblet in the elven hall',
      'holding a carved bow at chest height',
      'resting a hand on the hilt of a sheathed sword',
      'holding a small glowing crystal in cupped hands',
      'feeding a handful of oats to a pony',
      'lifting the lid of a rune-carved chest',
      'holding a scroll case at the hip',
    ],
    [
      'standing on the stone bridge with a staff planted',
      'leaning against a great tree root with folded arms',
    ]
  ),
  gothic_historic: R(
    [
      'lighting a candle in an iron sconce',
      'resting a gloved hand on the stone balustrade',
      'holding a lantern up to a carved gargoyle',
      'pushing open a heavy oak door',
      'holding a cloak closed at the throat against the wind',
      'setting a candle on the chapel step',
      'holding a leather book closed against the chest',
      'tracing nothing, just placing a rose on the stone ledge',
    ],
    [
      'standing under the arch with a cloak settled over the shoulders',
      'leaning on the balustrade with a lantern held low',
    ]
  ),
  desert_arid: R(
    [
      'holding a canteen at chest height',
      'shading nothing, just pulling a scarf loose at the neck',
      'holding the reins of a camel at arm length',
      'brushing sand from a linen sleeve',
      'holding a wide-brim hat by its brim in the wind',
      'lifting a lantern at the dune crest',
      'kneeling to sift sand through the fingers',
      'unrolling a rug beside the campfire',
    ],
    [
      'standing on the dune crest with hands in pockets, scarf loose',
      'sitting on a rug by the campfire with a cup of tea',
    ]
  ),
  temperate_forest: R(
    [
      'holding a walking stick at the trailhead',
      'picking a wild mushroom into a basket',
      'holding a thermos cup by the creek',
      'shouldering a canvas backpack',
      'holding a fern frond at chest height',
      'lacing a hiking boot with one foot on a log',
      'tossing a pinecone from hand to hand',
      'holding a lantern under the canopy at dusk',
    ],
    [
      'standing on the trail with thumbs under the backpack straps',
      'sitting on a mossy log with elbows on knees',
    ]
  ),
  alpine_mountain: R(
    [
      'holding a pair of ski poles planted in the snow',
      'warming hands on a mug at the chalet rail',
      'holding a coil of climbing rope over one shoulder',
      'adjusting a backpack strap at the overlook',
      'holding a trail map at chest height',
      'lifting a thermos from a pack',
      'holding a wooden sled by its rope',
      'zipping a jacket at the summit marker',
    ],
    ['standing at the overlook with hands on hips', 'leaning on the chalet rail with a mug']
  ),
  grassland_savanna: R(
    [
      'holding a pair of binoculars at chest height in the jeep',
      'holding a canteen at the acacia tree',
      'resting a hand on the safari jeep door',
      'holding a wide-brim hat against the wind',
      'pouring tea from a flask at the campsite',
      'holding a field guide closed at the hip',
      'lifting a camp lantern at dusk',
      'brushing grass seeds off khaki trousers',
    ],
    [
      'standing beside the jeep with hands in khaki pockets',
      'sitting on the jeep bonnet with a canteen',
    ]
  ),
  wetland_jungle: R(
    [
      'gripping a paddle in the canoe',
      'holding a machete low at the trail edge',
      'brushing a giant leaf aside with one hand',
      'holding a canteen at chest height in the humidity',
      'holding a lantern on the stilt-house porch',
      'lifting a coil of rope from the dock',
      'holding a rain hat by its brim',
      'tying a canoe to the mangrove root',
    ],
    [
      'standing on the dock with hands on hips as mist rises',
      'sitting in the canoe with the paddle across the knees',
    ]
  ),
  urban_city: R(
    [
      'holding a takeout coffee at the crosswalk',
      'hailing a cab with one hand',
      'holding a paper shopping bag at the hip',
      'leaning on the bridge railing over the river',
      'holding a folded newspaper under one arm',
      'holding an umbrella on the wet sidewalk',
      'holding a slice of pizza on a paper plate',
      'buttoning a coat outside the subway steps',
    ],
    [
      'standing at the crosswalk with hands in coat pockets',
      'leaning against a lamppost with a coffee',
    ]
  ),
  interior_intimate: R(
    [
      'pouring wine into two glasses on the counter',
      'holding a mug of tea in both hands by the window',
      'lighting a candle on the table',
      'pulling a record from its sleeve',
      'holding a stack of plates at chest height',
      'stirring a pot on the stove',
      'placing a vase of flowers on the sill',
      'holding a book closed against the chest by the bookshelf',
    ],
    [
      'leaning against the kitchen counter with a mug',
      'sitting on the arm of the sofa with hands folded',
    ]
  ),
  aquatic_underwater: R(
    [
      'holding a snorkel by its strap at the hip',
      'holding a fin in each hand on the boat deck',
      'gripping the ladder rail at the stern',
      'holding a conch shell up at chest height',
      'lifting a dive tank by its valve',
      'holding a waterproof torch at the reef edge',
      'shaking water from a wetsuit sleeve',
      'holding onto the dock post in the shallows',
    ],
    [
      'standing on the boat deck with a snorkel hooked over the wetsuit shoulder',
      'sitting on the dock edge with feet in the water',
    ]
  ),
  red_rock_canyon: R(
    [
      'holding a canteen at the canyon rim',
      'resting a hand on the warm sandstone wall',
      'holding a wide-brim hat against the wind',
      'shouldering a daypack at the trailhead',
      'holding a trail map at chest height',
      'lacing a boot with one foot on a red rock',
      'holding a walking stick at the switchback',
      'brushing red dust off jeans',
    ],
    ['standing at the rim with hands on hips', 'sitting on a sandstone ledge with elbows on knees']
  ),
  volcanic_geothermal: R(
    [
      'holding a towel over one shoulder at the hot spring',
      'testing the water with one hand at the pool edge',
      'holding a mug of cocoa at the boardwalk rail',
      'holding a lantern as steam rises',
      'zipping a jacket at the crater overlook',
      'holding a thermos at chest height',
      'resting a hand on the wooden rail above the vent',
      'wrapping a robe tighter at the spring',
    ],
    [
      'standing at the boardwalk rail as steam drifts past',
      'sitting on the hot-spring edge with feet in the water',
    ]
  ),
  fjord_coastal: R(
    [
      'holding a mug of coffee at the cabin rail',
      'coiling a rope on the wooden dock',
      'holding a fishing rod at chest height',
      'zipping a wool sweater against the wind',
      'holding a lantern at the boathouse door',
      'lifting a paddle beside the rowboat',
      'holding a knit hat in one hand in the breeze',
      'setting a thermos on the dock post',
    ],
    [
      'standing on the dock with hands in sweater pockets',
      'sitting on the rowboat gunwale with a mug',
    ]
  ),
  mediterranean_coastal: R(
    [
      'holding a glass of wine on the terrace',
      'lifting a straw hat by its brim',
      'holding a basket of lemons at the hip',
      'leaning on the whitewashed wall above the sea',
      'holding a gelato cone at chest height',
      'tying a scarf at the neck in the breeze',
      'holding a bottle of olive oil at the market stall',
      'resting a hand on a blue-painted door',
    ],
    [
      'standing on the terrace with a wine glass at chest height',
      'sitting on the whitewashed steps with a lemon basket',
    ]
  ),
  temperate_coastal: R(
    [
      'holding a takeout coffee on the pier',
      'holding a kite string at chest height on the beach',
      'zipping a windbreaker against the sea breeze',
      'holding a bucket at the tide pools',
      'coiling a rope on the fishing pier',
      'holding an ice-cream cone on the boardwalk',
      'lifting a beach chair by its frame',
      'holding a wool hat in one hand in the wind',
    ],
    [
      'standing at the pier rail with hands in jacket pockets',
      'sitting on the sea wall with a coffee',
    ]
  ),
  zen_garden: R(
    [
      'raking gravel into curves with a wooden rake',
      'holding a tea bowl in both hands on the veranda',
      'placing a stone on the cairn',
      'holding a paper lantern at chest height',
      'lifting a bamboo ladle at the stone basin',
      'holding a folded fan at the waist',
      'brushing a maple leaf off the moss with one hand',
      'tying a sandal strap on the veranda step',
    ],
    ['standing on the veranda with hands folded in front', 'kneeling on the tatami with a tea bowl']
  ),
  // ── Fall pools (Kevin approved 2026-09-07; fallPools.js / FALL_POOLS) — real autumn wardrobe, no costume ──
  golden_foliage: R(
    [
      'catching a drifting maple leaf in one open palm at waist height',
      'brushing fallen leaves off a split-rail fence with one hand',
      'holding a paper cup of cider with both hands on the covered-bridge walkway',
      'tying a boot lace with one foot up on a fallen log',
      'pulling a wool scarf snug with both hands at the collar',
      'scooping a small pile of red leaves and letting it spill from one hand',
      'resting a forearm on the dock post beside a tied canoe',
      'buttoning a wool coat while leaves drift across the trail',
    ],
    [
      'leaning against a maple trunk with hands in coat pockets, one ankle crossed',
      'standing at the bridge rail with a mug held at waist height, leaves drifting past',
    ]
  ),
  orchard_and_cider: R(
    [
      'reaching for a red apple on a low bough, the other hand steadying a woven basket',
      'holding a slatted crate of apples against one hip',
      'polishing an apple on a flannel sleeve',
      'pouring cider from a stoneware jug into a tin cup at the farm-stand counter',
      'steadying a wooden ladder against an apple tree with one hand',
      'setting a potted mum onto a hay bale',
      'turning the iron wheel of a cider press with both hands',
      'hoisting a crate of grapes onto the vineyard cart',
    ],
    [
      'leaning on the farm-stand counter beside crates of apples, a tin cup at hand',
      'standing between vineyard rows with a basket resting on one hip',
    ]
  ),
  cozy_hearth: R(
    [
      'feeding a split log into the stone fireplace',
      'cradling a steaming mug with both hands at the window seat',
      'pulling a wool blanket up around the shoulders by the fire',
      'stacking two worn hardcovers on the side table beside the brass lamp',
      'dusting flour off both hands over the butcher-block island',
      'sliding an apple pie onto the windowsill to cool',
      'stirring a copper pot on the cast-iron stove',
      'wrapping both hands around a paper cup at the fogged bookshop window',
    ],
    [
      'leaning against the mantel with a mug held at waist height, firelight on the wool sweater',
      'standing at the rain-streaked window with a wool throw over one arm',
    ]
  ),
  harvest_table: R(
    [
      'setting a candle down the center of the long table',
      'carrying a basket of crusty bread toward the head of the table',
      'pouring cider into a pewter goblet',
      'laying an oak-leaf garland along the linen tablecloth',
      'lifting the lid off a copper pot of stew, steam rising',
      'placing a pie onto a wooden board among the dishes',
      'straightening a linen napkin beside a place setting',
      'holding a lantern at hip height beside the barn table',
    ],
    [
      'standing at the head of the table with one hand resting on a chair back',
      'leaning against a barn post with a goblet held at waist height, string lights over the table',
    ]
  ),
  autumn_town: R(
    [
      'carrying a paper cup of coffee and a folded newspaper along the brick sidewalk',
      'setting a potted mum on the general-store step',
      'pulling a wool coat collar up against the drizzle under a striped awning',
      'stirring a coffee at a cane cafe table on the cobbled square',
      'hoisting a vintage suitcase onto the station platform',
      'tucking a book into a leather satchel on the quad steps',
      'shaking rain off a closed umbrella at the cafe door',
      'buttoning a peacoat beside an iron lamp post',
    ],
    [
      'leaning against a lamp post with hands in coat pockets, leaves drifting along the cobbles',
      'standing on the platform with a suitcase at one side and a coat over the arm',
    ]
  ),
  autumn_adventure: R(
    [
      'adjusting a daypack strap on the canyon trail',
      'refilling a steel bottle at the edge of the alpine lake',
      'dragging a wooden kayak up the pebble shore by its bow handle',
      "holding a horse's lead rope loosely at the trail edge",
      'stepping onto a flat stone at the river crossing, arms out for balance',
      'brushing bracken off wellies at the stone wall',
      'zipping a fleece vest at the trailhead',
      'planting a trekking pole on the switchback',
    ],
    [
      'leaning on a trekking pole at the canyon rim, a river far below',
      'standing at the lake shore with a paddle held upright at one side',
    ]
  ),
  rainy_day_romance: R(
    [
      'holding a red umbrella at one side on the rain-slick bridge',
      'wiping rain from a greenhouse pane with one sleeve',
      'cradling a mug at the bay window as rain sheets the glass',
      'shaking rain off an umbrella under the greenhouse door',
      'tucking a wool wrap tighter with both hands at the window seat',
      'brushing wet leaves off a wrought-iron bench',
      'pulling a trench-coat belt snug on the bridge steps',
      'setting a candle on the window ledge as the storm rolls in',
    ],
    [
      'leaning on the stone bridge rail with a closed umbrella hooked over one arm',
      'standing among greenhouse ferns with hands in cardigan pockets, rain on the glass',
    ]
  ),
  autumn_wonder: R(
    [
      'gripping the wicker basket rail as the balloon drifts over the valley',
      'holding a lantern at hip height on the rope bridge between treehouses',
      'trailing one hand along the rope-bridge rail',
      'catching a floating golden leaf in one palm at waist height',
      'steadying a lantern on the pier post beside the mirror lake',
      'tying off a balloon mooring rope at the basket',
      'pushing open a treehouse door onto the lantern-lit walkway',
      'holding a paper cup of cider at the end of the pier',
    ],
    [
      'leaning on the basket rail with the foliage valley far below',
      'standing at the end of the pier with hands in coat pockets, the lake mirroring the clouds',
    ]
  ),
  // ── Halloween: enchanted_harvest_court (autumn_fae + harvest_royalty, moved in from Fall 2026-09-07) ──
  enchanted_harvest_court: R(
    [
      'holding a goblet of cider at waist height at the banquet table',
      'resting one hand on the carved back of a throne chair',
      'setting a gilded oak-leaf crown on the table beside a candelabra',
      'trailing one hand along the black-rose trellis',
      'holding a lantern at hip height on the garden path',
      'lifting a bunch of grapes from a silver platter',
      'brushing petals off a velvet sleeve',
      'placing a candle on the cracked fountain rim',
    ],
    [
      'standing at the head of the banquet table with one hand resting on a chair back',
      'leaning against a garden column with a goblet held at waist height, fireflies in the roses',
    ]
  ),
};

/** Single-scenario category names → the shared genre register. */
export const REGISTER_ALIASES: Record<string, string> = {
  gardens_f: 'romantic_gardens',
  gardens_m: 'romantic_gardens',
  gatsby_f: 'gatsby_1920s',
  gatsby_m: 'gatsby_1920s',
  modern_f: 'modern_blacktie',
  modern_m: 'modern_blacktie',
  victorian_f: 'victorian',
  victorian_m: 'victorian',
  dapper_m: 'modern_blacktie',
  cute_chic_f: 'street_cool',
  princess_f: 'renaissance_baroque',
  decade_eras: 'time_travel',
  adorable_swarm: 'animal_mayhem',
  girly_fun: 'fun_activities',
  guy_fun: 'fun_activities',
  old_west: 'time_travel',
  wild_west: 'time_travel',
  fantastical_silly: 'surreal_absurd',
  fantastical: 'surreal_absurd',
  giant_scale: 'surreal_absurd',
  absurd_giant: 'surreal_absurd',
  glamour_shot_retro: 'old_hollywood',
  ballroom_f: 'modern_blacktie',
  coquette_f: 'romantic_gardens',
  pop_princess_f: 'stage_and_fame',
  girly_cute_f: 'fun_activities',
  // 2026-09-06: 7 former Halloween sub-themes folded into elegant / goofy as year-round seeds
  gothic_greenhouse: 'gothic_manor',
  gothic_glam_editorial: 'gothic_manor',
  ghost_hotel_1920s: 'gothic_manor',
  afterlife_waiting_room: 'haunted_house_comedy',
  striped_suit_haunting: 'haunted_house_comedy',
  // location_cards.biome uses a wider vocabulary than biomeAxes.ts keys (live parity script, 2026-09-06)
  alpine_snow: 'alpine_mountain',
  gothic_haunted: 'gothic_historic',
  luxury: 'rich_famous',
  mediterranean: 'mediterranean_coastal',
  prehistoric: 'ancient_ruins',
  scifi_space: 'scifi_cosmic',
  temperate_maritime: 'temperate_coastal',
  temperate_varied: 'temperate_forest',
  tropical: 'tropical_coastal',
  tropical_caribbean: 'tropical_coastal',
  tropical_island: 'tropical_coastal',
  tropical_monsoon: 'tropical_coastal',
};

/** Every enabled non-active scenario category on 2026-09-06 (paginated tally) — parity-tested so a category
 *  can't exist without a register; refresh via `node scripts/check-action-registers.js`. */
export const KNOWN_SCENARIO_CATEGORIES: readonly string[] = [
  'evening_city',
  'gatsby_1920s',
  'modern_blacktie',
  'old_hollywood',
  'regency',
  'renaissance_baroque',
  'rich_famous',
  'romantic_gardens',
  'stage_and_fame',
  'street_cool',
  'victorian',
  'absurd_everyday',
  'adorable_swarm',
  'animal_mayhem',
  'decade_eras',
  'fantastical_silly',
  'fun_activities',
  'giant_scale',
  'glamour_shot_retro',
  'out_and_about',
  'party_carnival',
  'surreal_absurd',
  'time_travel',
  'ballroom_f',
  'coquette_f',
  'cute_chic_f',
  'dapper_m',
  'gardens_f',
  'gardens_m',
  'gatsby_f',
  'gatsby_m',
  'modern_f',
  'modern_m',
  'pop_princess_f',
  'princess_f',
  'victorian_f',
  'victorian_m',
  'absurd_giant',
  'fantastical',
  'girly_cute_f',
  'girly_fun',
  'guy_fun',
  'gothic_greenhouse',
  'gothic_glam_editorial',
  'ghost_hotel_1920s',
  'afterlife_waiting_room',
  'striped_suit_haunting',
];

/** Resolve a register by key (Halloween pool / scenario category / biome / generic kind), alias-aware. */
export function getActionRegister(key: string | null | undefined): ActionRegister | null {
  if (!key) return null;
  const k = REGISTER_ALIASES[key] ?? key;
  return ACTION_REGISTERS[k] ?? null;
}

/** A shuffled handful (default 6: 4 actions + 2 stills when available) for the brief. */
export function sampleRegister(
  reg: ActionRegister,
  n = 6,
  rng: () => number = Math.random
): string[] {
  const shuffle = (a: string[]) => [...a].sort(() => rng() - 0.5);
  const stills = shuffle(reg.stills).slice(0, Math.min(2, n));
  const actions = shuffle(reg.actions).slice(0, Math.max(0, n - stills.length));
  return shuffle([...actions, ...stills]);
}
