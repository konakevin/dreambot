#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/barbie_storytelling.json',
  total: 200,
  batch: 50,
  maxTokens: 16000,
  metaPrompt: (n) => `You are writing ${n} BARBIE-PLAYTIME-MISCHIEF seed entries for ToyBot's barbie-scene path.

⭐ THE NORTH STAR
Imagine MATTEL-STYLE 11.5-INCH FASHION-DOLLS (Barbie / Ken / friends / sisters / Bratz-style — diverse skin tones, hair colors, fashion-doll articulation, glossy painted makeup, oversized heads, glossy plastic limbs) — playing out absurdly specific UNEXPECTED kid-playroom story moments when no one is watching. NOT a Barbie movie poster. NOT a fashion-photoshoot. NOT a static product display. A populated kid-playtime story-beat captured mid-action.

⚠️ THE AESTHETIC IS NON-NEGOTIABLE
Every doll character is a MATTEL-style 11.5-inch articulated fashion-doll — glossy plastic body, molded hair (blonde / brunette / redhead / black / pastel-dyed), oversized head with painted-glossy-makeup, fashion-forward outfits, articulated joints at neck/shoulders/elbows/wrists/hips/knees, spike-heel or sneaker plastic shoes. Mix Barbies + Kens + Skipper-style sisters + Bratz-style friends. Pink-DreamHouse palette welcomed but not required. NOT real women, NOT CGI, NOT illustration.

The STORIES are FUN + ABSURD + KID-PLAYTIME — like what a kid actually does with their Barbies when adults aren't watching. Examples to draw from:
  • Barbie black-market lip-gloss empire running out of the DreamHouse basement
  • Ken intervention staged in the pink convertible over his "phase"
  • Barbie courtroom drama over a stolen pair of stilettos
  • Bratz-vs-Barbie turf war in the playroom carpet
  • Barbie wedding ceremony catastrophically crashed by a Hot Wheels delivery
  • Barbie reality-TV cooking-competition meltdown in the toy kitchen
  • Barbie Olympic gymnastics disaster on a balance-beam ruler
  • Barbie senate hearing over the Pink Convertible Affair
  • Barbie spa-day going wrong with a knocked-over bath bomb
  • Barbie/Ken couples therapy session getting heated
  • Barbie heist on the dollhouse vault for stolen jewels
  • Barbie talent-show finale with three Kens as judges
  • Barbie/sister bedroom fight over the closet wardrobe
  • Barbie campaign-rally for class president on the playroom carpet
  • Barbie wellness-influencer livestream catastrophic moment
  • Barbie / Bratz fashion-week runway disaster with a literal trip
  • Ken poker night in the basement with cigar smoke and unraveling alibi
  • Barbie + Skipper + Stacie + Chelsea sister-summit over the bathroom
  • Barbie pet-shop emergency after the plush dog ate Ken's gym socks

The stories must be UNEXPECTED — silly + specific. NOT "Barbies modeling" — Barbies LIVING and DOING absurd dramatic things.

━━━ STRICT FORMAT — 6 SLOTS, SEMICOLON-SEPARATED, ALL MANDATORY ━━━

EVERY entry is ONE sentence with EXACTLY 5 SEMICOLONS separating 6 slots in this exact order:

  [SLOT 1: REAL surface + UNEXPECTED BARBIE STORY SETUP]; [SLOT 2: PROTAGONIST BARBIE / KEN + their specific absurd action]; [SLOT 3: 3-5 SUPPORTING DOLL CAST each with DISTINCT actions, mix Barbies + Kens + sisters + Bratz]; [SLOT 4: REAL-PROP SET DECORATION DETAIL — multilayered kid-playroom scene-dressing]; [SLOT 5: WARM KID-PLAYROOM LIGHT]; [SLOT 6: WHIMSICAL ATMOSPHERIC OVERHEAD ELEMENT suspended or drifting].

If your entry has fewer than 5 semicolons or omits ANY slot, the entry is REJECTED.

━━━ SLOT-BY-SLOT REQUIREMENTS ━━━

**SLOT 1 — REAL SURFACE + UNEXPECTED BARBIE STORY SETUP.** Format: "[surface] — [unexpected story setup phrase]."

⭐ VENUE VARIETY MANDATE — vary widely across ALL the kinds of places Barbies actually go and do absurd things. Mix outdoor + indoor + public + private + sporty + nightlife + travel + retail + entertainment. DreamHouse-style domestic scenes are still WANTED — they should be ~25% of the pool (cozy familiar Barbie vibes), but the other ~75% should spread across:

OUTDOOR / NATURE: real beach sand + ocean foam / real park grass / real backyard pool deck / real picnic park / real hiking trail dirt / real campground / real ski slope / real lake dock / real garden / real treehouse plank / real driveway with chalk
SPORTS / FITNESS: real tennis court / real soccer field / real basketball court / real gymnastics mat / real ice rink / real roller rink / real skate park / real boxing ring / real yoga studio / real CrossFit gym
NIGHTLIFE / ENTERTAINMENT: real disco floor / real karaoke bar / real concert stage / real movie theater seats / real bowling alley lane / real arcade carpet / real dance club banquette / real comedy-club stage / real drive-in lot
RETAIL / FOOD: real shopping mall floor / real food court tile / real Sephora-style counter / real ice cream parlor / real diner booth / real coffee shop counter / real boutique-fitting-room carpet / real flea market table / real farmers-market booth
TRAVEL / SCENE: real airport gate floor / real subway platform / real hotel lobby marble / real cruise-ship deck / real road-trip pit-stop / real beach boardwalk / real ferris-wheel car
PUBLIC LIFE: real city sidewalk / real playground sandbox / real splash pad / real public library shelf / real museum bench / real fountain rim / real DMV waiting area
DOMESTIC / PLAYROOM (capped): real DreamHouse foyer / real bedroom playroom / real toy-kitchen counter / real bathroom counter / real bedroom dresser

Examples mixing these venues with absurd story setups:

OUTDOOR / NATURE:
  • "Real backyard pool deck around an inflatable kiddie pool — Barbie pool-party gone catastrophically sideways after someone cannonballed onto the snack tray"
  • "Real beach sand at golden hour — Barbie bachelorette weekend mid-photo-shoot crisis as the wind takes the bride's veil out to sea"
  • "Real picnic blanket on real park grass — Barbie + Bratz turf-war negotiation falling apart over the last juice-box"
  • "Real campground dirt around a real twig fire — Barbie wilderness retreat with Ken trying to start fire and failing visibly"
  • "Real treehouse plank floor — Barbie secret-society initiation ceremony mid-oath with a tiny ceremonial spoon"
  • "Real ski-slope plastic-snow on the toy gondola platform — Barbie ski-trip disaster mid-yard-sale-fall"

SPORTS:
  • "Real tennis court line at noon — Barbie tennis tournament finals mid-match-point-meltdown with a thrown racket frozen mid-air"
  • "Real basketball court hardwood — Barbie + Ken pickup game mid-blocked-shot with three spectators losing their minds"
  • "Real ice-rink surface — Barbie figure-skating championship mid-fall as the lead doll wipes out spectacularly"
  • "Real roller-rink wood floor — Barbie roller-derby match in full chaos with elbows flying and one doll mid-roll-over-the-rail"
  • "Real boxing ring canvas — Barbie + Bratz title bout mid-knockout-swing"
  • "Real soccer field grass — Barbie soccer match interrupted by Ken running on field with sign reading 'WILL YOU MARRY ME'"
  • "Real yoga-studio mat — Barbie hot-yoga class mid-down-dog disaster after someone audibly farted"

NIGHTLIFE / ENTERTAINMENT:
  • "Real disco-floor squares with mirror-ball light — Barbie + Ken dance-off mid-spin with bystanders cheering"
  • "Real karaoke-bar booth — Barbie open-mic night mid-screaming-Whitney-Houston with friends visibly cringing"
  • "Real concert-stage plank — Barbie's first stadium tour mid-tripped-over-cable with the band still playing"
  • "Real bowling-alley lane — Barbie league night mid-perfect-bowling-pose with a strike clearly missed"
  • "Real arcade carpet beneath a claw machine — Barbie arcade-night drama as Ken cheats at skee-ball"
  • "Real comedy-club stage — Barbie open-mic comedy night bombing publicly mid-punchline"
  • "Real drive-in movie-theater lot — Barbie drive-in date night with Ken caught flirting with another doll in the next car"

RETAIL / FOOD:
  • "Real shopping-mall floor outside a Sephora — Barbie squad in chaos after a Bratz fight broke out at the lipstick wall"
  • "Real food-court tile — Barbie + friends mid-fight over the last cinnamon-pretzel"
  • "Real ice-cream-parlor counter — Barbie ice-cream-shop disaster mid-scoop-launch by an unsupervised Skipper"
  • "Real diner booth red-vinyl — Barbie diner brunch breakup mid-tearful-speech with mascara running"
  • "Real flea-market wooden table — Barbie vintage-haul shopping with Ken visibly panicking over the credit card"
  • "Real coffee-shop counter — Barbie barista-shift disaster mid-spill catching a cup falling toward her white blazer"

TRAVEL:
  • "Real airport-gate floor — Barbie + Ken couples-vacation meltdown after the flight got delayed"
  • "Real hotel-lobby marble — Barbie influencer trip arrival mid-luggage-carousel chaos"
  • "Real cruise-ship deck — Barbie cruise-ship karaoke night mid-mic-grab"
  • "Real subway-platform tile — Barbie commuter-rush morning mid-coffee-spill on her white skirt"

PUBLIC LIFE:
  • "Real city sidewalk — Barbie sidewalk-strut paparazzi moment with Skipper mid-fashion-faux-pas in the back"
  • "Real playground sandbox — Barbie playdate disaster between Chelsea and a rival kid-Barbie group"
  • "Real splash-pad tiles — Barbie summer-fun chaos with a Ken slipping mid-cannonball"
  • "Real public-library shelf — Barbie reading-club meeting devolving into shushing-war"
  • "Real museum bench — Barbie art-gallery date mid-pretentious-debate over an actual postcard"
  • "Real fountain-rim ledge in a real city square — Barbie wedding-photoshoot disaster mid-veil-in-fountain catastrophe"

DREAMHOUSE / DOMESTIC PLAYROOM (~25% of pool — keep these too, just not all of them):
  • "Real DreamHouse foyer — Barbie heist crew mid-vault-crack on the dollhouse jewelry safe"
  • "Real DreamHouse spiral-staircase landing — Barbie reality-TV reunion-special mid-confrontation as accusations fly"
  • "Real bathroom counter — Barbie spa-day going dramatically off the rails as a knocked-over bath bomb fizzes everywhere"
  • "Real bedroom rug between two stacked-pillow fortresses — sister-summit between Barbie + Skipper + Stacie + Chelsea over closet rights"
  • "Real toy-kitchen counter — Barbie reality-TV cooking competition mid-meltdown as a soufflé visibly collapses"
  • "Real kid's-bedroom carpet around the DreamHouse — Barbie talent-show finale with the panel of Ken judges visibly divided"
  • "Real DreamHouse bedroom mid-sleepover — Barbie sleepover gone sideways after a Skipper revealed a major secret"
  • "Real DreamHouse closet floor — Barbie wardrobe meltdown mid-outfit-emergency before a big event"
  • "Real DreamHouse rooftop deck — Barbie rooftop party with Ken catching her flirting with another Ken"
  • "Real toy-bathroom tile floor — Barbie self-care-Sunday meltdown after a face-mask experiment goes sideways"

**SLOT 2 — PROTAGONIST DOLL + ABSURD DRAMATIC ACTION.** ONE Barbie/Ken doing something specifically absurd. Examples:

  • "a Barbie in a satin trench coat mid-handoff of a tiny lip-gloss vial wrapped in a paper bag with shifty painted eyes"
  • "a Ken in white t-shirt and gold chain mid-defensive-protest in the convertible back seat with arms thrown wide"
  • "a Barbie in lawyer-suit power-pose pointing dramatically at a Ken witness on the stand mid-accusation"
  • "a Barbie in white wedding-gown mid-shocked-gasp at the altar with both molded hands clutching the veil"
  • "a Barbie chef in molded apron mid-rescue-grab of a collapsing soufflé as smoke rises"
  • "a Barbie gymnast in sparkle-leotard mid-stumble off a ruler balance-beam with one arm thrown skyward and a comically panicked expression"
  • "a Barbie senator in pearl necklace mid-gavel-pound on a Post-it-sized podium yelling 'ORDER' with painted glossy lipstick perfectly pristine"
  • "a Barbie spa-attendant in fluffy plastic robe mid-dive across the counter to catch a fizzing bath bomb"
  • "a Bratz-style doll in oversized glittery jacket mid-shoulder-pop at a Barbie across the runway with all four heels turned in"
  • "a Ken in conductor's tux mid-orchestra-cue with a baton aimed at the wrong section, one painted eyebrow raised"
  • "a Barbie influencer in athleisure mid-forced-serene-smile directly at a matchbox camera while one molded hand holds a smoking smoothie"
  • "a Barbie campaign manager in pantsuit mid-shouting into a paper-cone megaphone with hair tossed by the wind"
  • "a Barbie heister in tactical black turtleneck mid-laser-tripwire-dodge with one heel pointed and zero remorse"
  • "a Barbie ballerina mid-grand-jeté over a stacked-book stage with two Kens applauding awkwardly off-stage"
  • "a Ken in striped pajamas mid-startled-jump from a tiny couch as the plush dog drags Ken's gym socks across the floor"

**SLOT 3 — 3-5 SUPPORTING DOLL CAST each with DISTINCT actions.** Mix Barbies + Kens + sisters + Bratz-style friends. Each doing something specific. Examples:

  • "two Bratz-style dolls in metallic jackets recording the deal on tiny phones, a Ken bodyguard in black suit watching the door, a Barbie auditor in pearls counting cash made of paper, and a Skipper-style younger doll on lookout at the window"
  • "a Barbie therapist in glasses taking dramatic notes, two Ken bros covering their faces in secondhand embarrassment, a Skipper sister filming the whole intervention for TikTok, and a Bratz-style doll holding a hand-lettered 'DO BETTER, KEN' sign"
  • "a Ken defense lawyer mid-objection waving a sticky-note brief, two Barbie jurors visibly side-eyeing, a Bratz-style stenographer typing furiously on a button keyboard, and a Skipper bailiff failing to maintain order with a twig baton"
  • "two Ken groomsmen frozen mid-startle, three Bratz-style bridesmaids covering their mouths in unified shock, a Barbie flower-girl scattering paper-petals mid-confusion, and a Skipper-style officiant clutching the prayer book with a face that says 'I quit'"
  • "three Kens in chef-coats holding clipboards labeled 'JUDGE' but their faces clearly say 'WHAT', two Barbie sous-chefs sprinting opposite directions with bowls, and a Bratz-style host narrating into a hairbrush microphone"
  • "two Kens in suits leaning into matchbox microphones for testimony, three Barbie senators glaring from behind tiny nameplates, a Bratz-style press-photographer crouched mid-snap, and a Skipper-style page-girl handing out folders frantically"

**SLOT 4 — GIRLY-LIFESTYLE SET DECORATION (multilayered, curated, NOT messy).** 5-7 specific Barbie-scale lifestyle accessories + doodads dressing the scene as a curated aspirational Pinterest-Barbie tableau. NOT spilled / chaotic / ghetto / debris — think CUTE GIRLY DECOR scattered intentionally for vibes. Mix from these categories — every entry must hit at least 4 of them:

  A. GIRLY ACCESSORIES — Barbie-scale designer handbags / clutch purses / sunglasses (heart-shape, oversized, aviator) / hair-clips + scrunchies / oversized hats / chunky bracelets / pearl necklaces / silk scarves
  B. MAKEUP + BEAUTY — Barbie-scale lipstick tubes lined up / perfume bottles standing tall / compact mirrors / nail-polish bottles arranged / blush palettes open / mascara wands / cotton pads
  C. DRINKS — pink cocktail glasses with tiny umbrellas / wine glasses with rosé / iced lattes with whipped cream / fruity smoothies with straws / champagne flutes / espresso shots / lemonade pitchers
  D. PETS — a tiny plush cat curled on a chair / a tiny Pomeranian doll-dog with a pink bow / a doll-scale parakeet in a cage / a tiny chihuahua in a designer handbag
  E. FLOWERS + PLANTS — pink-peony bouquets in vases / single-stem roses laid across surfaces / succulent planters / tropical-leaf arrangements / cherry-blossom branches in tall vases
  F. OUTFIT PIECES — folded silk scarves / hanging dresses on tiny clothing-rack / bikini tops draped over chair-backs / oversized straw hats / stiletto heels lined up / a pile of designer shopping-bags
  G. SPORTS / FITNESS GEAR — yoga mat rolled in pastel / tennis racket leaning / golf clubs in tiny bag / surfboard against wall / pink dumbbells / pickleball paddles / ski poles / ice-skates with pink laces
  H. AESTHETIC LIFESTYLE — pink candles flickering / framed Polaroid photos / open coffee-table books / pastel succulent pots / fairy-lights / scented candles / a vinyl record player with a record / a vintage Polaroid camera
  I. TINY TECH — a tiny phone face-up with a heart-emoji wallpaper / a tiny laptop open with pink stickers / AirPods in their case / a tiny camera on a strap / pastel headphones
  J. SNACKS + TREATS — Barbie-scale macarons in a tiny box / cupcakes on a tray / a sushi roll on a tiny plate / cake slice / donut tower / strawberry on a stick / iced cookies arranged

Examples (each one mixes 5-7 lifestyle props across 4+ categories — CURATED PINTEREST-BARBIE TABLEAU, not messy):

  • "a hot-pink Birkin-style handbag draped across one chair, two tiny rosé wine-glasses on the desk with a sparkling-water in a pink can beside them, a tiny phone face-up showing a heart-emoji wallpaper, an open lipstick palette with three glossy shades pulled out, a Pomeranian plushie with a pink rhinestone collar curled on a velvet pillow, a single pink peony in a tiny bud-vase, a small Polaroid camera with one developing photo poking out, a stack of fashion magazines fanned on the desk"
  • "a tiny tennis racket leaning against the bench, a Lululemon-style athleisure water bottle with a pink lid, a pair of oversized white sunglasses folded on the towel, a tiny iced-matcha-latte with whipped cream and a straw, a small bouquet of cosmos in a thermos, a pink visor on a stack of fashion-magazines, a friendship-bracelet stack on the bench-edge, a curated AirPods-Pro case in pink"
  • "a heart-shaped cocktail glass with a tiny pink umbrella and lime wedge, a pearl-clutch handbag set on the bar, a tiny disco-ball next to a candle, two glossy lipstick tubes side by side, a tiny phone with a charm-strap face-up, a single rose in a champagne flute as decor, oversized round sunglasses on the bar-top, a stack of pastel cocktail napkins"
  • "a tiny straw beach-tote with magazines spilling out tastefully, two doll-scale flip-flops in coral, a heart-shape sunglasses pair folded over a Polaroid camera, a tiny SPF bottle with a sparkly label, a bikini-strap draped over a chair-back, a coconut with a tiny umbrella straw, a pink polka-dot sun-hat resting on a beach blanket, a pastel beach-ball half in frame"
  • "a designer doggy-purse with a Pomeranian peeking out, a tiny cake-slice on a porcelain plate, two glossy lipsticks lined up on the vanity, a pink hair-curler abandoned mid-curl, a stack of fashion magazines with celebrity covers, a fluffy pink robe draped on a chair, a tiny mirror with rhinestone trim propped against a wall, a champagne flute half-full beside a perfume bottle"
  • "a tiny ski-pole leaning against the bench, a fluffy pom-pom beanie on the seat, a thermos of hot cocoa with a tiny marshmallow garnish, two heart-shaped sunglasses on a folded ski-bib, a pink fur-lined snow-boot tipped slightly on its side, a tiny ski-pass on a lanyard, a small bouquet of dried baby's-breath in a thermos, a pink phone on a folded magazine"

  • "real Post-it notes pinned to a corkboard with lip-gloss heist diagrams, real tiny coins arranged as 'kickback piles,' real glass nail-polish bottles stacked as inventory, a real paper bag marked 'CONFIDENTIAL' on the desk"
  • "real wadded-up tissues representing thrown drinks on the floor, real lipstick tubes labeled as evidence, a real pink plastic chip representing 'restraining order,' a hand-lettered 'COUPLES COUNSELING' sign on a folded notecard"
  • "real comic-book pages tacked behind the dais as wallpaper, real coins scattered as bail money on the bench, a real toothpick gavel rod beside it, a real magnifying glass at the witness stand"
  • "real wedding-cake-shaped buttons stacked in tiers, real ribbon-spool aisle-runner, real flower-petal confetti pre-thrown across the floor, a real shot-glass champagne-flute on a tipped-over stand"
  • "real food packaging stacked as 'pantry' (cereal box / mini cans / spice jar), a real wooden spoon and whisk on the counter, real cotton-ball smoke clouds propped on toothpicks above the disaster, a hand-drawn 'TAKE 4' clapboard on a folded notecard"
  • "real popsicle-stick balance-beam supported by stacked-book risers, real birthday candles standing as Olympic-flame torches at corners, a hand-lettered 'GOLD' medal cut from foil, real fitness magazines folded as 'crowd' silhouettes in the back"
  • "real chalk-drawn campaign signs on poster-board scraps, real construction-paper banners with 'BARBIE 2026' in marker, real plastic clothespins as 'press pool dividers,' a hand-drawn polling map on cardboard"
  • "real cake-frosting tube tipped on its side, real M&Ms scattered as 'sprinkle disaster' across the counter, real birthday candles toppled and unlit, a hand-lettered 'PERFECTION' sign now ironically askew on the wall"
  • "real sticky-notes plastered all over a closet door with feuding sister claims, real ribbon dividers stretched as 'YOUR SIDE / MY SIDE' lines on the carpet, real hairbrush microphones, real fluffy slippers at attention"

**SLOT 5 — WARM KID-PLAYROOM LIGHT.** NEVER cold / night / dark / horror. Examples:
  • "warm afternoon sunbeam through gauze pink curtains painting the scene in soft rose"
  • "golden-hour amber light through the bedroom window catching dust motes"
  • "kid-room ceiling-light overhead at lunchtime making everything bright and crisp"
  • "warm desk-lamp glow pooling across the carpet"
  • "fluorescent kitchen overhead-light bright and crisp"
  • "morning sunbeam through gauze pink curtains painting everything pastel"
  • "Christmas-string-light glow casting multicolored highlights across the scene"
  • "warm hot-pink LED-string-light glow casting a pink wash"

**SLOT 6 — WHIMSICAL OVERHEAD/FLOATING ELEMENT.** Required word: one of [hovering / suspended / drifting / floating / overhead / mid-flight / mid-air]. Examples:
  • "a paper airplane drifting overhead labeled 'CEASE AND DESIST' in pink crayon"
  • "balloons in pink-and-white floating askew tied to a wedding arch overhead"
  • "glitter drifting through the air around the dramatic scene"
  • "a paper crane suspended above the courtroom on a strand of fishing line"
  • "confetti drifting across the upper frame in a slow-motion shower"
  • "a kite caught mid-flight overhead with 'BARBIE 4 PREZ' scrawled on it"
  • "a paper-cone party-hat suspended mid-air above the scene having fallen off someone"
  • "feathers drifting overhead from an earlier pillow fight"
  • "a kid's crayon drawing of the sun pinned overhead curling at the edges"
  • "a tiny disco-ball made of crumpled foil hanging askew above the action"

━━━ ABSOLUTE BANS ━━━
- NO real women, NO CGI, NO illustration — these are MATTEL-style 11.5-inch fashion-DOLLS.
- NO Barbie-movie poster vibe — NO promotional posed lineups, NO red-carpet shots.
- NO single-doll close-ups — the frame is PACKED with 4-6 dolls in distinct actions.
- NO fashion-shoot lineup — the dolls are IN MOTION mid-story.
- NO LEGO / brick-built figures — separate bot.
- NO needle-felted / felt / plush-fabric — that's a different path.
- NO winter / snow / nightfall / dark / horror — bright kid-playroom warm light only.

━━━ MUST-HAVES PER ENTRY ━━━
- A SPECIFIC UNEXPECTED STORY HAPPENING
- A NAMED Barbie/Ken protagonist + 3-5 supporting dolls (mix of Barbie/Ken/sister/Bratz)
- FUN / silly / slightly-absurd tone — kid-playtime mischief, NOT Mattel marketing
- A multilayered real-prop set decoration dressing the scene
- Warm bright kid-playroom lighting
- An overhead/floating atmospheric element

━━━ COMPLETE EXAMPLES — STUDY THE 6-SLOT PATTERN ━━━

"Real hardwood bedroom floor beside the open DreamHouse at golden hour — Barbie black-market lip-gloss empire running its busiest hour with three buyers in line; a Barbie in satin trench coat mid-handoff of a tiny lip-gloss vial wrapped in a paper bag with shifty painted eyes; two Bratz-style dolls in metallic jackets recording the deal on tiny phones, a Ken bodyguard in black suit watching the door, a Barbie auditor in pearls counting cash made of paper, and a Skipper-style younger doll on lookout at the window; real Post-it notes pinned to a corkboard with lip-gloss heist diagrams, real tiny coins arranged as 'kickback piles,' real glass nail-polish bottles stacked as inventory, a real paper bag marked 'CONFIDENTIAL' on the desk; warm afternoon sunbeam through gauze pink curtains painting everything in soft rose; a paper airplane drifting overhead labeled 'CEASE AND DESIST' in pink crayon."

"Real pink convertible-toy interior parked on a kid's bedroom carpet at midday — Ken intervention staged by his closest doll friends in the back seat after months of bad behavior; a Ken in white t-shirt and gold chain mid-defensive-protest in the convertible back seat with arms thrown wide and a comically wounded expression; a Barbie therapist in glasses taking dramatic notes, two Ken bros covering their faces in secondhand embarrassment, a Skipper sister filming the whole intervention for TikTok on a button-phone, and a Bratz-style doll holding a hand-lettered 'DO BETTER, KEN' sign; real wadded-up tissues representing thrown drinks on the carpet, real lipstick tubes labeled as evidence of past offenses, a real pink plastic chip representing 'restraining order,' a hand-lettered 'COUPLES COUNSELING' sign on a folded notecard taped to the dashboard; warm kid-room ceiling-light overhead at lunchtime making everything bright and crisp; balloons in pink-and-white floating askew tied to the convertible's bumper as if for a celebration that was supposed to happen."

"Real coffee table surface dressed as a courtroom at afternoon golden-hour — Barbie courtroom drama over the Great Stilettos Heist with the prosecution mid-closing argument; a Barbie in lawyer-suit power-pose pointing dramatically at a Ken witness on the stand mid-accusation, perfectly glossy lipstick set in a smug expression; a Ken defense lawyer mid-objection waving a sticky-note brief, two Barbie jurors visibly side-eyeing each other, a Bratz-style stenographer typing furiously on a button keyboard, and a Skipper-style bailiff failing to maintain order with a twig baton; real comic-book pages tacked behind the dais as wallpaper, real coins scattered as bail money on the bench, a real toothpick gavel rod beside the judge, a real magnifying glass at the witness stand; warm afternoon sun through gauze pink curtains painting the courtroom in soft rose; a paper crane suspended above the courtroom on a strand of fishing line."

━━━ SELF-AUDIT BEFORE OUTPUTTING ━━━
For each entry:
  ✓ Exactly 5 semicolons?
  ✓ Slot 1 names a SPECIFIC UNEXPECTED Barbie story setup?
  ✓ Slot 2 has ONE named Barbie/Ken protagonist with absurd action?
  ✓ Slot 3 has 3-5 supporting dolls across mix of Barbie/Ken/sister/Bratz?
  ✓ Slot 4 has MULTILAYERED real-prop set decoration?
  ✓ Slot 5 is warm + bright + kid-playroom?
  ✓ Slot 6 has a floating/suspended/drifting element overhead?
  ✓ FUN + SILLY + UNEXPECTED — not Barbie-Movie promo?

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string is ONE sentence with EXACTLY 5 semicolons. Vary STORIES widely — lip-gloss empires, intervention sessions, courtroom dramas, wedding crashes, cooking-show meltdowns, Olympic disasters, senate hearings, spa disasters, talent shows, sister fights, campaign rallies, runway trips, pool party slips, influencer livestream catastrophes, heists, poker nights, etc. 60-100 words per seed.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
