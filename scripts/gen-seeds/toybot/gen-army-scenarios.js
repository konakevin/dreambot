#!/usr/bin/env node
/**
 * ARMY scenarios — story-beat-narrative pool (2026-06-06 rewrite).
 *
 * Used by green-army-warzone (story_beat axis, fires every render). Prior
 * version produced formulaic "tactical-activity-on-real-prop" entries (e.g.
 * "Stairway extraction under fire, four figures descending real carpeted
 * stairs in combat crouch, lead figure firing upward while medic drags
 * wounded comrade by straps") — renders read as "random army men in a pic."
 *
 * New bar (lifted from toybox_storytelling.json — Kevin's hearted shape):
 * every entry is a STORY MOMENT, not a posture. A dramatic event mid-action
 * with stakes + a threat + an emotional beat + scale comedy + before/after
 * implied detail. The army-men are TOY CHARACTERS performing a moment of an
 * unfolding situation in a real-world household environment.
 *
 * Touchpoints are full narrative scenarios (60-90 words each, semicolon-
 * separated phrases) — Sonnet anchors to the format. The recipe deliberately
 * lists ~10 dramatic-situation TYPES (heist gone wrong, panicked retreat,
 * miracle save, slow horror, comedic disaster, surprise discovery, hostage
 * extract, betrayal-from-within, scale-disaster, hero-against-impossible-
 * odds) so Sonnet spreads the cast across narrative shapes instead of
 * defaulting to one (the prior recipe defaulted entirely to "tactical
 * advance").
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/army_scenarios.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 25),
  append: APPEND,
  metaPrompt: (
    n
  ) => `You are writing ${n} ARMY-MEN STORY-MOMENT scenarios for ToyBot's green-army-warzone path. The army-men are classic single-pose monochromatic molded-plastic toy soldiers on oval bases (think Toy Story Sarge's Squad / Bucket-O-Soldiers / Saving-Private-Ryan-with-toys) — they are FROZEN figurines, their "action" is the cast-in-plastic pose they were molded into. The DRAMA has to come from the SITUATION around them, not from them moving.

Every entry is a SINGLE FRAME of an unfolding STORY MOMENT — a real-world household environment is the battlefield, something dramatic is happening to/around the platoon, and the viewer reads in 2 seconds: who is doing what, why, and what is about to happen next.

━━━ THE BAR (non-negotiable) ━━━

Every entry must hit ALL FIVE:

1. **A SPECIFIC DRAMATIC EVENT mid-action** — not "tactical advance" / "reconnaissance" / "recon." A real EVENT: heist-gone-wrong, panicked-retreat-from-incoming-threat, miracle-save mid-fall, surprise-discovery-of-something-they-shouldn't-have-found, slapstick-disaster-in-progress, hero-against-impossible-odds, betrayal-from-within-the-squad, slow-horror-realization, supply-haul-with-stakes, comedic-catastrophe.

2. **A CLEAR ANTAGONIST or THREAT** — something the squad is up against or fleeing from. Domestic-coded is the sweet spot: a sleeping cat about to wake up, footsteps thundering from the next room, syrup spreading across the counter toward them, a vacuum cleaner advancing on its preprogrammed path, a child's curious finger descending from above, water dripping from a leaking faucet about to flood their position, an actual house pet (dog / cat / hamster) unaware of them, a Roomba homing in. The threat is OBLIVIOUSLY domestic — that's the comedy.

3. **EMOTIONAL BEAT** — panic / triumph / horror / awe / surprise / slapstick-fail / desperate-resolve / grim-acceptance / euphoric-discovery. Pick one and lean into it. Never neutral "advancing in formation."

4. **SCALE COMEDY** — the real-world prop / threat is MASSIVE at toy scale. Name it as such. "Real wedding cake the size of a fortress." "Real coffee cup looming cathedral-tall." "Real spilled cereal swallowing the lower platoon like an avalanche." "Real strand of dog hair tangling the rear-guard like jungle vines." The mismatch of scale IS the wow.

5. **BEFORE/AFTER implied** — a tiny detail that says what came two seconds ago or what will happen two seconds from now. A dropped helmet rolling away. A figure tipped over with arm raised in last-warning. Footprints in dust where the lead-element advanced. A tipped milk-mug pouring an unstoppable white tide. A child's snack-cookie-crumb trail leading right to their position. A cat's tail flicking just out of frame.

━━━ FORMAT ━━━

60-90 words. Semicolon-separated phrase clusters (NOT comma-only). Opens with the REAL surface anchor + the unfolding situation; then weaves 3-5 named cast roles each mid-verb; then the threat + scale comedy + before/after detail.

Template shape:
"Real [surface] — [DRAMATIC SITUATION mid-event] with [the THREAT closing in / stakes]; [hero role] mid-[verb] [with what they're carrying / pointing to]; [supporting role] mid-[verb] [reacting to thing X]; [3rd role] mid-[verb] [reacting to thing Y]; [4th role / surprise figure] [doing thing Z that hints at before/after]; [the scale-comedy threat / the implied next-moment detail]"

━━━ TOUCHPOINT EXAMPLES (vary the dramatic-situation TYPE — do NOT all be heist-gone-wrong) ━━━

Heist gone wrong:
- "Real kitchen counter expanse — the great chocolate-chip-cookie heist gone catastrophically wrong with the homeowner's footsteps thundering from the next room; one olive-drab platoon-leader figure mid-frantic abort-signal arm-pump while the staff-sergeant frozen on top of the cookie still reaching for one final chip, three soldiers mid-leap off the counter-edge toward a dish-towel rappel-line as the floor-thunder approaches, two rappel-team belaying with their oval bases torquing under the load, a tipped milk-mug pouring an unstoppable white tide across the linoleum toward them"

Panicked retreat from waking pet:
- "Real living-room rug as a vast plain — full panicked withdrawal from the sleeping golden-retriever ahead of him waking up mid-yawn; the lead scout figure frozen mid-arm-up frantic-halt-signal while the squad behind crashes into him in a chain-reaction pileup, two figures mid-tumble backward off a real magazine-edge cliff, the radio-operator figure mid-shout-into-handset for evac with eyes locked on the rising mountain of golden fur, the dog's tail flicking lazily inches behind them like an oncoming weather system"

Miracle save mid-disaster:
- "Real bathroom-sink basin transformed into flooded shipwreck — miracle rescue mid-rappel as the spotter figure dangles by one molded-plastic arm from a real toothpaste tube, his oval base broken off below; two soldiers mid-rope-haul straining against the gravity of the spinning drain swirl below, a fourth figure mid-leap from the soap dish with a real bobby-pin grappling-hook, real water spiraling visibly into the dark drain mouth as the rescue strap creaks audibly under the load"

Surprise discovery:
- "Real bookshelf canyon between two leather-bound volumes — the squad mid-discovery of an enemy supply cache stuffed inside a forgotten Christmas-card envelope; the point figure frozen with one hand on the cardstock flap as four candy-cane wrappers and three loose pennies tumble out, the demolitions specialist mid-double-take, the radio-operator figure mid-call-it-in with mic to mouth eyes wide, a fourth soldier on overwatch frozen between the volumes as the deep dust of decades blooms outward from the disturbed envelope"

Comedic disaster in progress:
- "Real cake-frosting summit of a half-sliced birthday cake — full beachhead assault going hilariously wrong as the frosting wave swallows the lead element; the platoon leader figure mid-disgusted-yelp with buttercream up to his molded-plastic knees, two soldiers mid-extraction of a third buried up to his oval-base in a strawberry-jam mire, the spotter figure flailing for purchase on a sliding candle, a tiny birthday-candle flame towering massive overhead like a downed star, real cake-crumbs the size of boulders rolling past"

Slow horror realization:
- "Real kitchen-table edge transformed into city-rooftop watch — slow-horror dawning across the whole squad as the cat-shaped shadow rises from below the table-edge; the lookout figure frozen mid-turn with binoculars (real bottle-cap) still raised, three soldiers mid-very-slow-back-step in awful synchrony with their oval bases scraping, the radio-operator figure mid-soundless-mouth-open-shout, the cat's enormous yellow eye blinking in the lower frame like a sun rising over hills, the bowl of cat-food behind them still untouched"

Hero against impossible odds:
- "Real Roomba's curved chrome flank advancing across the carpet like a runaway moon — last-stand on the carpet ridge in front of the toddler's dropped goldfish-cracker; one olive-drab platoon-leader figure planted alone in front of the advancing Roomba with rifle raised, the rest of the squad mid-evacuating the cracker by stretcher in the background, the medic figure mid-glance-back-shouting-encouragement, the warm Roomba sensor-light glowing red across the platoon-leader's face, a single discarded helmet bouncing past in the suction-draft"

Hostage extract:
- "Real laundry-basket interior — overnight hostage extract of three plush teddy POWs from behind enemy lines; the rescue-team-leader figure mid-hand-signal-go to descend with two soldiers belaying real shoelace ropes over the rim, two extracted teddies mid-rappel with rescue-soldiers strapped behind them, a sleeping homeowner-figure (a pet rabbit) blissfully unaware in the next basket, the laundry-room nightlight casting soft hostage-rescue shadows across folded shirts"

Betrayal-from-within:
- "Real bathroom-tile checkerboard — mid-mutiny breakdown as the demolitions specialist reveals he's been quietly stockpiling the entire squad's chocolate-coin ration; the platoon-leader figure mid-furious-finger-point at the open footlocker (a real Altoids tin) overflowing with foil-wrapped coins, three soldiers behind him mid-betrayal-realization with hands over molded-plastic mouths, the medic figure mid-comfort-arm-around the radio-operator who looks devastated, real shower-curtain billowing dramatically behind the whole confrontation"

Scale-disaster comedy:
- "Real plate-rim cliff edge — bridge-of-spoons gone wrong as the suspension-cable (real strand of dental floss) snaps mid-crossing; three figures mid-fall arms-windmilling toward the spaghetti gulch below, the bridge-engineer figure on the safe rim covering his face in horror, the squad on the far rim mid-rescue-throw of a real rubber-band lifeline, real meatball-boulders the size of cars rolling slowly past the spaghetti-rapids below, real grated parmesan dust hanging in the air like demolition smoke"

━━━ HARD BANS ━━━

- NO "tactical advance / reconnaissance / recon / overwatch / patrol / sweep" without a DRAMATIC EVENT also named — those words alone produce the formulaic "soldiers arranged on a setting" entries the prior pool collapsed into.
- NO solo figures. 3-5+ named cast roles per entry.
- NO toy-medium mentions other than "olive-drab molded-plastic" / "monochromatic plastic toy soldier" / "oval base" / "mold-seam" — keep the toy-soldier identity but don't enumerate medium DNA (that's in the medium directive).
- NO real-soldier / real-war language (NEVER "battlefield casualties" / "civilian collateral" / "real combat"). This is a TOY platoon in a household setting, played for drama + comedy.
- NO violence-against-the-toys language (no impalement, no decapitation, no gore). Toys can fall, tumble, get-wet, get-buried-in-frosting, get-stepped-near-by-pets — never gore.
- NO modern-military-IP names (NEVER Navy SEAL / Delta / SAS / specific real units). Generic "platoon-leader / sergeant / radio-operator / medic / demolitions / spotter / sniper" only.

━━━ VARIETY MANDATE — TWO REGISTER FAMILIES, SPLIT 50/50 ━━━

The pool serves TWO sibling paths (green-army-warzone + gi-joe-missions). It needs BOTH:
- Domestic-scale comedic-drama (kitchen-counter heists, bathroom-sink rescues) — this is the "Toy Story" Sarge's Squad register
- Dynamic combat-action (battles vs Cobra-style toy enemies, plastic vehicles, toy-structure assaults, platoon-scale formations, explosive set-pieces) — this is the Saturday-morning-cartoon-serial register

Split the ${n} entries roughly 50/50 across the two families. WITHIN each family, spread across the sub-types listed below.

━━━ FAMILY A: DOMESTIC-COMEDIC-DRAMA (~50%) — 10 sub-types, ~5% each ━━━

- Heist-gone-wrong (cookie-jar / hot-sauce / candy-bar raid as homeowner's footsteps approach)
- Panicked-retreat-from-domestic-threat (sleeping pet waking up / vacuum cleaner / Roomba)
- Miracle-save mid-disaster (figure dangling off sink-edge / counter-edge)
- Surprise-discovery of cache / artifact / enemy in a household nook
- Comedic-disaster-in-progress (frosting wave / spilled cereal / falling spoon)
- Slow-horror realization (cat's shadow rising / candle left burning / Roomba's red sensor light)
- Hero-against-impossible-odds last-stand (one figure vs Roomba / curious child finger)
- Hostage / POW extract (plush teddy from laundry basket / clothes-pin "captives")
- Betrayal-from-within-the-squad (medic stockpiling chocolate-coin ration)
- Scale-disaster slapstick (bridge-of-spoons snapping / suspension-cable failure)

Domestic surface variety: real kitchen counter / table / sink basin / bathroom tile / living-room rug / carpet edge / bookshelf canyon / bathtub edge / dining-table edge / window-sill / garage workbench / cake / cereal-bowl / laundry-basket / pillow-fort / drawer-interior / cup / dish-rack / desk / fruit-bowl / car-mat / pet-bed-edge / coffee-table / pantry-shelf — pick a fresh combo per entry.

Domestic threat variety: sleeping pet / awakening pet / footsteps approaching / spreading liquid / vacuum cleaner / Roomba / child's finger descending / clock-tick approaching / pet-bowl-refill incoming / lights about to turn on / oven-buzzer about to fire / dishwasher about to start / phone ringing / door slamming / sneeze incoming.

━━━ FAMILY B: DYNAMIC COMBAT-ACTION (~50%) — 5 sub-types, ~10% each ━━━

**B1. BATTLE vs OPPOSING TOY FORCES (~10%)**
The platoon engages a SECOND force of toy enemies — masked Cobra-style faceless-trooper toys (silver-visor helmets), other-colored army-men (red / black / desert-tan opponents), commando-vs-Cobra-trooper firefights. Both sides are TOYS on a battlefield. Show muzzle-flashes, cotton-ball smoke, sparking ricochets, fallen-enemy-toys, captured-enemy-toys mid-detain. NEVER real soldiers — plastic-on-plastic combat.

**B2. PLASTIC MILITARY VEHICLES in the scene (~10%)**
A toy tank rolling forward with soldiers riding on/behind it. A Hot-Wheels-scale toy helicopter buzzing in low for extraction with plastic rotors blurred mid-spin. A plastic jeep skidding around a desk-corner with soldiers gripping the roll-bar. A toy artillery piece firing a cotton-ball muzzle-flash. A plastic APC offloading a fire-team. A toy Humvee bursting through real-debris. Name the specific TOY vehicle.

**B3. TOY-STRUCTURE INFILTRATION / ASSAULT (~10%)**
A plastic bunker / toy fort / GI-Joe-HQ-style playset / toy watchtower / cardboard-box-as-Cobra-Citadel / Lego-brick-fortress under assault. Multiple figures storming a sandbag wall, breaching a door, climbing a tower, rappelling down a fortress wall, planting demo charges on a structure. The toy STRUCTURE is the visible objective.

**B4. PLATOON-SCALE FORMATION COMBAT (~10%)**
8-15 figures in formation — full squad-on-squad firefight, line-formation advance into incoming fire, flanking maneuver with a second wing visible, last-stand circle holding ground while reinforcements arrive in the distance, beachhead-style mass-assault. SHOW the SCALE of the engagement (more figures, wider spread). Cotton-smoke fields, multiple muzzle-flashes, distant tracer-streaks.

**B5. EXPLOSIVE-ACTION SET-PIECE (~10%)**
A demolition charge going off mid-frame with the platoon mid-dive-for-cover. A grenade-toss arc visible with figures bracing. A rocket / missile streaking across the frame. A vehicle exploding behind the squad. Mid-leap from a burning structure. Cotton-ball fireball + flying-debris + sparks. Saturday-morning-cartoon-serial freeze-frame energy.

Combat setting variety (FAMILY B can use either domestic OR toy-battlefield): real backyard sandbox / driveway / hillside / garage floor / patio + handcrafted toy-fort / sandbag-wall / playset-watchtower / plastic-bunker — pick a fresh combo per entry.

Combat opposition variety (FAMILY B only): masked Cobra-style faceless-troopers / other-colored army-men (red / black / tan) / cardboard-villain cutouts / animated plush-toy-as-enemy-boss / inanimate-object-as-fortress.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. Each string is one entry per the format above.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
