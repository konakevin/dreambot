/**
 * Dual character action pools — relationship-aware pose seeds for two-person renders.
 *
 * COMPANION: universal pool for any two people sharing a scene.
 * PARTNER: additional pool for romantic partners only — comfortable intimacy, not cheesy.
 * DYNAMIC: movement + contact poses (piggyback, dance, dip, lift) — unlocked by the
 *   per-face composite swap (2026-06-16).
 *
 * The COMPANION/PARTNER entries are STATIONARY + roughly SIDE BY SIDE — but that's
 * now a STYLISTIC choice (calm, posed look), NOT a face-swap safety rule. The swap
 * engine handles any layout where the two heads are distinct (not cheek-pressed),
 * so DYNAMIC entries move/contact freely. The only hard rule across all pools: keep
 * the two HEADS readable as separate (no cheek-to-cheek), face direction set by the
 * shared pose contract (dualSwapContract.ts).
 */

export const DUAL_ACTIONS_COMPANION: string[] = [
  'both standing still, one with hands at their sides, the other with one hand resting on their hip',
  'one reaching up toward a high object, the other standing nearby with arms folded',
  'both standing in a wide open space, one with hands on hips, the other shielding their eyes',
  'both resting against opposite sides of a pillar or structure',
  'one reaching into a bag or container, the other standing by with hands ready to help',
  'one stretching or rolling their shoulders, the other standing still with arms crossed',
  'both standing at a balcony railing, one with elbows on the rail, the other standing upright with hands in pockets',
  'both seated on a bench, one with legs crossed, the other leaning forward with elbows on knees',
  'one standing with a bag slung over one shoulder, the other beside them stretching one arm overhead',
  'both standing in waist-deep grass or flowers, one brushing a hand through the plants, the other standing still',
  'one holding a lantern or light source at their side, the other standing nearby with hands in jacket pockets',
  'one with their hands behind their head stretching, the other standing with arms crossed',
  'both standing under a large tree, one leaning against the trunk, the other standing free with a hand on their chin',
  'both standing at the edge of water, one with hands in pockets, the other bending slightly to look at the surface',
  'one holding something up for the other to see, both standing a couple feet apart',
  'both leaning on opposite ends of the same fence or railing',
  'one standing with their weight on one leg, the other nearby with feet planted and arms crossed',
  'both standing under an archway, one with their back against the pillar, the other with a hand resting on the stone',
  'one shielding their eyes from light, the other standing beside them with arms at their sides',
  'one holding something up to inspect it in the light, the other standing nearby with a hand on their chin',
  'both standing at a window, one with their hands on the sill, the other standing beside them arms crossed',
  'one pointing something out low and to the side, the other standing beside them looking where they point',
  'one standing with one hand in their pocket and the other gesturing, the second person standing with both hands in pockets',
  'one rolling up their sleeves, the other standing beside them with thumbs hooked in their belt',
  'both standing under an awning or shelter, one leaning on a support beam, the other standing free',
  'one tapping their foot while standing, the other beside them rolling up their sleeves',
  'one standing with hands clasped behind their back, the other nearby wiping their hands on a cloth',
  'both leaning against separate trees or posts, one with ankle crossed, the other standing straight',
  'both standing in an open area, one scratching their head, the other with hands in back pockets',
  'both standing under cover, one brushing dust off their clothes, the other standing with hands free',
  'both positioned near a fence, one gripping the rails, the other standing back with crossed ankles',
  'both standing on uneven ground, one with hand on knee for balance, the other stable with arms crossed',
  'both standing near a vertical surface, one with palm pressed against it, the other arms crossed',
  'both standing near a boundary or edge, one closer with hand extended, the other back with arms down',
  'one standing while opening a container, the other nearby with hands clasped in front',
  'one standing on tiptoes reaching for something, the other nearby with hands behind their head',
  'both near a large opening or doorway, one in it, the other beside it with shoulder against frame',
  'one standing while tucking something into their belt, the other beside them drinking from bottle',
  'both standing in dappled light, one wiping their brow, the other standing still with hands down',
  'one standing while fastening something at their neck, the other beside them with thumbs in pockets',
  'both near a workspace or table, one leaning over it, the other standing upright beside it',
  'one standing while shaking out a piece of clothing, the other nearby with hands interlocked behind back',
  'both in an open area, one bending to touch the ground, the other standing straight with relaxed shoulders',
  'one balancing on a log or beam, the other standing on solid ground with arms at their sides',
  'both standing at different elevations, one step higher with hand on railing, the other below with crossed arms',
  'one standing while sharpening a tool on a stone, the other beside them wiping their hands',
  'one perching on a fence post, the other standing beside the fence with hands in back pockets',
  'one standing while threading something through a loop, the other nearby tapping their fingers on their leg',
  'both near exercise equipment, one using it, the other standing beside it with water bottle',
  'one standing while peeling fruit with a knife, the other beside them holding a plate',
  'one standing while applying something to their skin, the other nearby holding a tube or bottle',
  'one sitting on a blanket with arms relaxed at sides, the other sitting cross-legged beside the blanket',
  'both near a fountain or water feature, one trailing fingers in water, the other standing dry',
  'both near a statue or monument, one touching its base, the other standing back respectfully',
  'one digging in soil with a small shovel, the other standing beside them holding seeds',
  'one standing while testing the weight of an object, the other beside them with arms relaxed',
  'both near a rope swing, one testing the knot strength, the other standing back with hands on hips',
  'one standing while threading a needle, the other beside them holding a spool of thread',
  'both near a wooden crate, one prying it open with a crowbar, the other standing ready with gloves',
  'one standing while blowing on something hot in their hands, the other nearby fanning themselves with a hat',
  'both near a wooden post, one hammering a nail into it, the other standing back covering their ears',
  'one standing while polishing something shiny with a rag, the other beside them holding cleaning supplies',
  'one standing while filing the edge of a metal tool, the other beside them testing its sharpness carefully',
  'one standing while pressing flowers between book pages, the other beside them selecting specimens',
  'one standing while lacing up tall boots, the other beside them brushing mud off their own shoes',
  'one standing while folding a letter, the other beside them melting wax for a seal',
  'both near a tall ladder, one holding it steady, the other standing back with hands ready to help',
  'one standing while measuring fabric with a ruler, the other beside them marking measurements with chalk',
  'both near a pulley system, one pulling the rope, the other standing ready with outstretched arms',
  'one standing while balancing a stick on their finger, the other beside them clapping encouragement',
  'one standing while binding pages together, the other beside them holding the finished sections',
  'one standing while practicing balance on one foot, the other beside them ready to steady if needed',
  'both near a wooden lever, one preparing to push it, the other standing ready to catch the result',
  'one standing while testing the flexibility of a thin branch, the other beside them holding similar twigs',
  'both near a rope and pulley, one threading the rope, the other standing back ensuring it runs smoothly',
  'one standing while practicing hand shadows, the other beside them positioning a light source',
  'one standing while practicing whistling bird calls, the other beside them cupping their ear to listen',
  'one standing while practicing origami folds, the other beside them smoothing out practice papers',
  'one standing while practicing card shuffling, the other beside them ready to help gather any dropped cards',
  'both standing in an open space, one with hands clasped in front, the other with thumbs hooked in belt loops',
  'both positioned around a pillar, one touching it with fingertips, the other standing away with arms down',
  'both near a post, one leaning sideways against it, the other standing perpendicular with hands at sides',
  'both standing at different angles, one facing left with hands down, the other angled right with crossed arms',
  'one standing while tapping their fingers against their leg, the other beside them standing perfectly still',
  'both standing in morning light, one yawning with hand over mouth, the other beside them stretching their arms overhead',
  'both sitting on separate rocks, one with hands on ankles, the other leaning back with palms flat',
  'one standing while pulling something from their pocket, the other beside them wiping their nose with back of hand',
  'one standing while tucking hair behind their ear, the other beside them standing with feet shoulder width apart',
  'one standing while lifting something light overhead, the other beside them standing with feet planted wide',
  'one standing while smoothing down their shirt, the other beside them standing with hands near their sides',
];

// Partner pool — 200 Sonnet-generated romantic-couple poses.
// Romantic feel through synchronized/mirrored body language.
// Heads/faces stay on separate sides (dual face swap requirement).
// Body proximity is fine — only face/head proximity breaks the swap.
export const DUAL_ACTIONS_PARTNER: string[] = [
  'sitting close on a low wall, one with hands folded in lap, the other with palms resting on the wall',
  'both leaning back against a fence, shoulders nearly touching, arms hanging naturally at their sides',
  'sitting together on a bench, one with ankle crossed over knee, the other with feet planted on ground',
  'both standing close, one brushing something off their own shirt, the other with arms folded loosely',
  'sitting close together, one with hands pressed between their knees, the other with arms wrapped around their own waist',
  'both standing near a post, one with elbow resting on it, the other standing close with hands behind back',
  'one sitting cross-legged, the other kneeling beside them with hands resting on their own thighs',
  'both standing quietly, one rolling up their sleeves, the other with arms crossed loosely over their chest',
  'sitting together on grass, one with legs stretched out, the other sitting with knees bent to one side',
  'both leaning against a low barrier, one with hands gripping the edge, the other with arms folded',
  'both standing close, one adjusting their collar, the other with thumbs tucked into their waistband',
  'sitting side by side on steps, one with hands flat on the step, the other with fingers interlaced',
  'both standing near a pillar, one with shoulder against it, the other standing close with arms at sides',
  'sitting together on a log, one with hands resting on their ankles, the other with palms on their knees',
  'both leaning against a wall, one with arms crossed, the other with hands tucked into jacket pockets',
  'both standing side by side, one smoothing down their shirt, the other with hands clasped behind their back',
  'sitting close on a curb, one with elbows on knees, the other with hands flat beside their legs',
  'both standing near a fence post, one with hand resting on it, the other standing close with arms folded',
  'both standing quietly, one fastening a button, the other with thumbs hooked in their front pockets',
  'sitting together on a blanket, one with legs crossed, the other sitting with legs stretched to one side',
  'both leaning against a railing, one with both hands gripping it, the other with arms hanging loose',
  'both standing close, one zipping up their jacket, the other with arms wrapped loosely around their own waist',
  'sitting side by side on a bench, one with hands tucked under their legs, the other with arms at sides',
  'both standing near a tree trunk, one with palm flat against it, the other standing close with arms crossed',
  'one sitting on ground with legs straight, the other kneeling beside them with hands on their own knees',
  'sitting together on rocks, one with hands gripping the edges, the other with arms resting on their knees',
  'both leaning on a low wall, one with chin in palm, the other with both hands flat on the surface',
  'both standing side by side, one stretching their neck, the other with arms folded across their chest',
  'sitting close on a step, one with hands between their knees, the other with palms flat on the step',
  'both standing near a post, one with back against it, the other standing close with weight on one foot',
  'both standing quietly, one loosening their scarf, the other with thumbs in belt loops',
  'sitting together on grass, one with hands supporting them behind, the other with arms around their own shins',
  'both leaning against a barrier, one with elbows on top, the other standing close with arms at sides',
  'both standing close, one brushing hair away from their own face, the other with hands in pockets',
  'sitting side by side on a ledge, one with legs swinging, the other with feet firmly planted',
  'both standing near a column, one with shoulder touching it, the other standing close with arms loosely folded',
  'sitting together on a wall, one with hands gripping the edge, the other with arms wrapped around waist',
  'both leaning on a fence, one with both elbows resting, the other standing close with one arm folded',
  'sitting close on ground, one with knees up, the other sitting with legs crossed at ankles',
  'sitting together on steps, one with hands flat behind them, the other with elbows resting on knees',
  'both leaning against a wall, one with hands pressed flat against it, the other with arms crossed',
  'sitting side by side on a curb, one with arms around their own knees, the other with hands beside legs',
  'both standing near a lamppost, one with elbow against it, the other standing close with arms folded',
  'both standing quietly, one smoothing their hair, the other with hands deep in jacket pockets',
  'sitting together on a log, one with hands on their ankles, the other with arms crossed loosely',
  'both leaning on a bridge rail, one with fingers drumming, the other standing still beside them',
  'both standing side by side, one stretching their shoulders, the other with arms wrapped around themselves',
  'sitting close on a bench, one with legs tucked up, the other with feet planted wide',
  'both standing near a pillar, one with back to it, the other standing close with slight angle',
  'both leaning against a low fence, one with arms draped over, the other standing close with arms folded',
  'both standing close, one buttoning their coat, the other with hands tucked into back pockets',
  'sitting side by side on rocks, one with hands gripping sides, the other with arms around their shins',
  'both standing near a tree, one with palm against bark, the other standing close with arms crossed',
  'sitting together on a wall, one with hands tucked under legs, the other with palms flat down',
  'both leaning on a railing, one with chin resting on arms, the other standing close with hands free',
  'both standing close, one rolling their shoulders, the other with thumbs in front pockets',
  'sitting side by side on a step, one with hands between knees, the other with arms at sides',
  'both standing near a fence, one with shoulder blade against it, the other standing close with arms loose',
  'sitting together on ground, one with legs straight out, the other with knees pulled up slightly',
  'both leaning against a barrier, one with both hands on top, the other standing close with arms folded',
  'both standing close, one untangling their earphones, the other with hands deep in pockets',
  'sitting side by side on a curb, one with elbows on thighs, the other with hands flat beside them',
  'both standing near a post, one with forearm against it, the other standing close with arms crossed',
  'both standing quietly, one straightening their shirt hem, the other with thumbs hooked in belt',
  'sitting together on a bench, one with ankle on opposite knee, the other with both feet down',
  'both leaning on a wall, one with hands spread flat, the other standing close with arms at sides',
  'sitting side by side on grass, one with hands supporting behind, the other with arms around knees',
  'both standing near a column, one with elbow resting on it, the other standing close with hands clasped',
  'both standing close, one retying their hair, the other with thumbs in back pockets',
  'sitting side by side on steps, one with hands flat on thighs, the other with arms crossing chest',
  'both standing near a rail, one with both hands gripping it, the other standing close with arms loose',
  'sitting together on a wall, one with legs hanging freely, the other with feet touching ground',
  'both leaning on a bridge railing, one with elbows wide, the other standing close with arms crossed',
  'sitting side by side on a bench, one with hands tucked under thighs, the other with arms at sides',
  'both standing near a tree trunk, one with shoulder against it, the other standing close with arms folded',
  'both leaning against a low wall, one with hands behind them, the other standing close with arms crossed',
  'both standing close, one adjusting their hood, the other with arms wrapped loosely around themselves',
  'sitting side by side on a curb, one with hands on their ankles, the other with palms beside legs',
  'both standing near a lamppost, one with back to it, the other standing close with arms folded',
  'sitting together on a log, one with hands gripping the bark, the other with arms around their shins',
  'both leaning on a railing, one with arms stretched wide, the other standing close with arms at sides',
  'sitting side by side on ground, one with knees drawn up, the other with legs crossed at ankles',
  'sitting together on a bench, one with hands between their knees, the other with arms at sides',
  'both leaning against a fence, one with chin on folded arms, the other standing close with hands free',
  'sitting side by side on steps, one with elbows on knees, the other with hands flat on the step',
  'sitting together on grass, one with hands flat for balance, the other with arms wrapped around waist',
  'both leaning on a barrier, one with both elbows resting, the other standing close with arms crossed',
  'sitting side by side on a wall, one with hands gripping the sides, the other with palms flat down',
  'both leaning against a wall, one with hands pressed back, the other standing close with arms at sides',
  'sitting side by side on a ledge, one with legs swinging gently, the other with feet firmly planted',
  'both standing near a column, one with elbow resting casually, the other standing close with arms crossed',
  'both leaning on a fence rail, one with arms draped over, the other standing close with hands free',
  'sitting together on a wall, one with hands tucked under their legs, the other with arms at their sides',
  'sitting side by side on a bench, one with palms pressed down, the other with hands resting on their thighs',
  'sitting together on grass, one with knees up and arms around them, the other with legs stretched out',
  'both leaning on a low fence, one with both hands gripping the top, the other standing close with arms loose',
  'sitting side by side on a curb, one with hands on their shins, the other with palms flat beside them',
  'sitting side by side on steps, one with arms wrapped around their waist, the other with hands on the step',
  'sitting together on a bench, one with hands between their knees, the other with feet planted wide',
  'both leaning on a railing, one with chin on their hands, the other standing close with arms free',
  'sitting side by side on grass, one with palms flat for support, the other with arms around their shins',
  'sitting together on a bench, one with fingers drumming on their knee, the other with arms crossed at their chest',
  'both standing near a mailbox, one with hand resting on top, the other standing close with thumbs in loops',
  'one sitting on grass with legs straight ahead, the other kneeling beside them with hands on their own thighs',
  'both leaning on a dock railing, one with wrists crossed, the other standing close with arms hanging loose',
  'sitting side by side on a step, one picking at their shoelaces, the other with hands folded in lap',
  'both standing close, one wiping their hands on their pants, the other with arms wrapped around their middle',
  'sitting together on a wall, one with hands gripping their ankles, the other with palms pressed down',
  'both leaning against a car hood, one with arms spread wide, the other standing close with hands free',
  'sitting side by side on a curb, one with fingers interlaced behind neck, the other with hands beside legs',
  'both standing close, one pulling up their socks, the other with thumbs hooked in back pockets',
  'sitting together on a log, one with hands pressed into bark, the other with arms around their calves',
  'both standing near a trash can, one with elbow resting on rim, the other standing close with arms crossed',
  'both leaning on a bridge rail, one with palms flat down, the other standing close with arms at sides',
  'sitting side by side on grass, one with hands covering their ears briefly, the other with arms loose',
  'sitting together on steps, one with hands rubbing their knees, the other with arms crossed over chest',
  'both standing near a bike rack, one with hand on the metal, the other standing close with arms folded',
  'both leaning against a storefront, one with back flat against glass, the other standing close with arms loose',
  'sitting side by side on a bench, one stretching their arms overhead, the other with hands on their thighs',
  'both standing close, one blowing on their hands, the other with thumbs tucked into front pockets',
  'sitting together on a wall, one with palms rubbing together, the other with hands flat beside them',
  'both standing near a water fountain, one with hand touching the edge, the other standing close with arms crossed',
  'sitting side by side on a curb, one with hands clapping together softly, the other with arms around waist',
  'both standing close, one flexing their fingers, the other with hands deep in jacket pockets',
  'sitting together on a step, one with hands covering their eyes briefly, the other with arms at their sides',
  'both standing near a parking meter, one with palm against it, the other standing close with arms folded',
  'both leaning against a fence gate, one with hands gripping the bars, the other standing close with arms loose',
  'sitting side by side on a bench, one with hands massaging their temples, the other with palms on knees',
  'both standing close, one cracking their knuckles, the other with arms wrapped around their own shoulders',
  'sitting together on grass, one with hands scratching their arm, the other with arms around their knees',
  'both standing near a telephone pole, one with forehead against it, the other standing close with arms crossed',
  'both leaning on a concrete barrier, one with elbows wide apart, the other standing close with arms at sides',
  'sitting side by side on steps, one with hands warming under their legs, the other with arms loose',
  'both standing close, one shaking out their hands, the other with thumbs hooked in belt loops',
];

/**
 * DYNAMIC pool — movement + physical CONTACT poses (piggyback, dance spin, dip,
 * lift, carry, jump). Unlocked 2026-06-16 by detection + the per-face composite
 * swap: each person is placed on their OWN detected face, so the swap no longer
 * needs the two people standing apart at the same height.
 *
 * The two HARD rules detection still imposes, baked into every entry:
 *   - the two HEADS stay clearly SEPARATED (a gap / different heights) — NEVER
 *     cheeks pressed together (that IoU-fails the per-face crop → re-render)
 *   - body language ONLY — both faces are turned toward the camera by the brief
 * Bodies may touch, move, and sit at different heights — that's the whole point.
 */
export const DUAL_ACTIONS_DYNAMIC: string[] = [
  "one giving the other a piggyback ride, the rider perched high with hands on the carrier's shoulders, the carrier holding the rider's knees, their two faces at clearly different heights and well apart",
  "mid-dance spin, one twirling the other out by the hand, an arm's length of space opening between them, both heads turned out toward the camera",
  'one dipping the other in a playful dance dip, the dipped partner lower and angled to the side, both faces tilted up and clearly separated',
  "walking forward together in stride, one with an arm slung loosely around the other's shoulders, a gap kept between their heads",
  'one lifting the other in a side hug just off the ground, bodies close but heads angled apart',
  'both mid-stride walking ahead together, one gesturing forward, shoulders near but faces well apart',
  'one hopping up onto a low ledge while the other steadies them by the hand, the climber higher, the helper lower, faces at different heights',
  "one carrying the other bridal-style, the carried partner's head resting back and to the side, both faces up and clearly separate",
  "jumping into the air together mid-leap with knees bent, an arm's length apart, both faces toward the camera",
  'one spinning the other under a raised joined hand like a dance turn, a clear gap between their heads',
  'one tugging the other forward by the hand in a happy run, the leader a step ahead and turned back, faces apart',
  'one boosting the other up to sit on a high wall, the seated partner above with feet dangling, the booster below, faces stacked and separate',
  'mid high-five with their free arms raised, bodies angled in, heads kept well apart',
  'one swinging the other around by both hands, both leaning back with the motion, a wide gap between their heads',
  "sharing an umbrella and leaning together, shoulders touching, heads kept a hand's width apart, both looking out",
  "climbing a few steps together, one a step higher reaching back for the other's hand, faces at clearly different heights",
  'one scooping the other up in a side-lift, both laughing, heads angled apart',
  "a playful dance hold at arm's length, hands joined and leaning back away from each other so the heads are well apart",
  'walking forward in step with hands swinging joined between them, a comfortable gap between their heads',
  'one twirling in place while the other reaches to spin them, bodies a step apart, both faces to the camera',
  'one lifting the other onto their shoulders, the lifted partner high above with arms out, the two heads stacked vertically and well separated',
  'leaning back-to-back then turning their heads to look out over their own shoulders, heads clearly apart',
  'one pulling the other up from sitting by both hands, one rising and one braced, faces at different heights',
  'skipping forward together hand in hand, a clear gap between their two heads',
];

/**
 * Pick a dual action seed based on the plus_one's relationship.
 * Partner/significant_other: dynamic-contact + romantic + companion.
 * Everyone else: dynamic-contact + companion.
 *
 * The DYNAMIC pool (movement + contact poses) is mixed in for everyone — the
 * per-face composite swap makes piggyback / dance / lift poses swap-safe.
 *
 * `forcePool` overrides the relationship roll — used for QA testing of
 * specific pools.
 */
export function pickDualAction(
  relationship: string | undefined,
  forcePool?: 'partner' | 'companion' | 'dynamic'
): string {
  if (forcePool === 'dynamic') {
    return DUAL_ACTIONS_DYNAMIC[Math.floor(Math.random() * DUAL_ACTIONS_DYNAMIC.length)];
  }
  if (forcePool === 'partner') {
    return DUAL_ACTIONS_PARTNER[Math.floor(Math.random() * DUAL_ACTIONS_PARTNER.length)];
  }
  if (forcePool === 'companion') {
    return DUAL_ACTIONS_COMPANION[Math.floor(Math.random() * DUAL_ACTIONS_COMPANION.length)];
  }
  const roll = Math.random();
  const isPartner = relationship === 'partner' || relationship === 'significant_other';
  if (isPartner) {
    // 40% dynamic-contact, 25% romantic-static, 35% companion-static
    if (roll < 0.4)
      return DUAL_ACTIONS_DYNAMIC[Math.floor(Math.random() * DUAL_ACTIONS_DYNAMIC.length)];
    if (roll < 0.65)
      return DUAL_ACTIONS_PARTNER[Math.floor(Math.random() * DUAL_ACTIONS_PARTNER.length)];
    return DUAL_ACTIONS_COMPANION[Math.floor(Math.random() * DUAL_ACTIONS_COMPANION.length)];
  }
  // Companions (friends/family): 30% dynamic-contact, 70% companion-static
  if (roll < 0.3)
    return DUAL_ACTIONS_DYNAMIC[Math.floor(Math.random() * DUAL_ACTIONS_DYNAMIC.length)];
  return DUAL_ACTIONS_COMPANION[Math.floor(Math.random() * DUAL_ACTIONS_COMPANION.length)];
}
