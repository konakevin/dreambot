/**
 * Dual character action pools — relationship-aware pose seeds for two-person renders.
 *
 * COMPANION: universal pool for any two people sharing a scene.
 * PARTNER: additional pool for romantic partners only — comfortable intimacy, not cheesy.
 *
 * Every entry must:
 *   - Describe what BOTH characters are doing (left person + right person)
 *   - Keep heads on separate sides (no leaning into each other)
 *   - Describe BODY POSE only — face direction is overridden by the brief
 *   - Both characters STATIONARY — no walking, stepping, navigating, arriving
 *   - Both characters roughly SIDE BY SIDE — not one behind the other
 *   - Scene-neutral — body poses must work in ANY setting
 */

export const DUAL_ACTIONS_COMPANION: string[] = [
  'both standing still, one with hands at their sides, the other with one hand resting on their hip',
  'one reaching up toward a high object, the other standing nearby with arms folded',
  'both standing in a wide open space, one with hands on hips, the other with arms folded',
  'both resting against opposite sides of a pillar or structure',
  'one reaching into a bag or container, the other standing by with hands ready to help',
  'one stretching or rolling their shoulders, the other standing still with arms crossed',
  'both standing at a balcony railing, one with elbows on the rail, the other standing upright with hands in pockets',
  'both seated on a bench, one with legs crossed, the other leaning forward with elbows on knees',
  'one standing with a bag slung over one shoulder, the other beside them stretching one arm overhead',
  'both standing in waist-deep grass or flowers, one brushing a hand through the plants, the other standing still',
  'one holding a lantern or light source at their side, the other standing nearby with hands in jacket pockets',
  'one with their hands behind their head stretching, the other standing with arms crossed',
  'both standing under a large tree, one leaning against the trunk, the other standing free with arms folded',
  'both standing at the edge of water, one with hands in pockets, the other bending slightly to look at the surface',
  'one holding something up for the other to see, both standing a couple feet apart',
  'both leaning on opposite ends of the same fence or railing',
  'one standing with their weight on one leg, the other nearby with feet planted and arms crossed',
  'both standing under an archway, one with their back against the pillar, the other with a hand resting on the stone',
  'one with hands resting on their hips, the other standing beside them with arms at their sides',
  'one holding something out to inspect it in the light, the other standing nearby with arms folded',
  'both standing at a window, one with their hands on the sill, the other standing beside them arms crossed',
  'one pointing something out low and to the side, the other standing beside them looking where they point',
  'one standing with one hand in their pocket and the other gesturing, the second person standing with both hands in pockets',
  'one rolling up their sleeves, the other standing beside them with thumbs hooked in their belt',
  'both standing under an awning or shelter, one leaning on a support beam, the other standing free',
  'one tapping their foot while standing, the other beside them rolling up their sleeves',
  'one standing with hands clasped behind their back, the other nearby wiping their hands on a cloth',
  'both leaning against separate trees or posts, one with ankle crossed, the other standing straight',
  'both standing in an open area, one with hands on their hips, the other with hands in back pockets',
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
  'one perching on a fence post, the other standing beside the fence with hands in back pockets',
  'both near exercise equipment, one using it, the other standing beside it with water bottle',
  'one standing while applying something to their skin, the other nearby holding a tube or bottle',
  'one sitting on a blanket with arms relaxed at sides, the other sitting cross-legged beside the blanket',
  'both near a fountain or water feature, one trailing fingers in water, the other standing dry',
  'one standing while testing the weight of an object, the other beside them with arms relaxed',
  'both near a rope swing, one testing the knot strength, the other standing back with hands on hips',
  'both near a wooden crate, one prying it open with a crowbar, the other standing ready with gloves',
  'one standing while holding something hot out to cool in their hands, the other nearby fanning themselves with a hat held low',
  'both near a wooden post, one hammering a nail into it, the other standing back with arms crossed',
  'both near a tall ladder, one holding it steady, the other standing back with hands ready to help',
  'both near a pulley system, one pulling the rope, the other standing ready with outstretched arms',
  'one standing while balancing a stick on their finger, the other beside them clapping encouragement',
  'one standing while binding pages together, the other beside them holding the finished sections',
  'one standing while practicing balance on one foot, the other beside them ready to steady if needed',
  'both near a wooden lever, one preparing to push it, the other standing ready to catch the result',
  'one standing while testing the flexibility of a thin branch, the other beside them holding similar twigs',
  'both near a rope and pulley, one threading the rope, the other standing back ensuring it runs smoothly',
  'both standing in an open space, one with hands clasped in front, the other with thumbs hooked in belt loops',
  'both positioned around a pillar, one touching it with fingertips, the other standing away with arms down',
  'both near a post, one leaning sideways against it, the other standing perpendicular with hands at sides',
  'both standing at different angles, one facing left with hands down, the other angled right with crossed arms',
  'one standing while tapping their fingers against their leg, the other beside them standing perfectly still',
  'both standing in morning light, one stretching their arms out wide, the other beside them stretching their arms overhead',
  'both sitting on separate rocks, one with hands on ankles, the other leaning back with palms flat',
  'one standing while pulling something from their pocket, the other beside them wiping their hands on a cloth',
  'one standing while smoothing down their sleeve, the other beside them standing with feet shoulder width apart',
  'one standing while lifting something light overhead, the other beside them standing with feet planted wide',
  'one standing while smoothing down their shirt, the other beside them standing with hands near their sides',
];

// Partner pool — 200 Sonnet-generated romantic-couple poses.
// Romantic feel through synchronized/mirrored body language.
// Heads/faces stay on separate sides (dual face swap requirement).
// Body proximity is fine — only face/head proximity breaks the swap.
export const DUAL_ACTIONS_PARTNER: string[] = [
  'sitting apart on a low wall, one with hands folded in lap, the other with palms resting on the wall',
  'both leaning back against a fence with a clear gap between them, arms hanging naturally at their sides',
  'sitting together on a bench, one with ankle crossed over knee, the other with feet planted on ground',
  'standing a step apart, one brushing something off their own shirt, the other with arms folded loosely',
  'sitting side by side with a gap between them, one with hands pressed between their knees, the other with arms wrapped around their own waist',
  'both standing near a post, one with elbow resting on it, the other a step apart with hands behind back',
  'one sitting cross-legged, the other kneeling beside them with hands resting on their own thighs',
  'both standing quietly, one rolling up their sleeves, the other with arms crossed loosely over their chest',
  'sitting together on grass, one with legs stretched out, the other sitting with knees bent to one side',
  'both leaning against a low barrier, one with hands gripping the edge, the other with arms folded',
  "standing a comfortable arm's length apart, one adjusting their collar, the other with thumbs tucked into their waistband",
  'sitting side by side on steps, one with hands flat on the step, the other with fingers interlaced',
  'both standing near a pillar, one with shoulder against it, the other a step apart with arms at sides',
  'sitting together on a log, one with hands resting on their ankles, the other with palms on their knees',
  'both leaning against a wall, one with arms crossed, the other with hands tucked into jacket pockets',
  'both standing side by side, one smoothing down their shirt, the other with hands clasped behind their back',
  'sitting apart on a curb, one with elbows on knees, the other with hands flat beside their legs',
  'both standing near a fence post, one with hand resting on it, the other a step apart with arms folded',
  'both standing quietly, one fastening a button, the other with thumbs hooked in their front pockets',
  'sitting together on a blanket, one with legs crossed, the other sitting with legs stretched to one side',
  'both leaning against a railing, one with both hands gripping it, the other with arms hanging loose',
  'standing side by side with a clear gap between them, one zipping up their jacket, the other with arms wrapped loosely around their own waist',
  'sitting side by side on a bench, one with hands tucked under their legs, the other with arms at sides',
  'both standing near a tree trunk, one with palm flat against it, the other a step apart with arms crossed',
  'one sitting on ground with legs straight, the other kneeling beside them with hands on their own knees',
  'sitting together on rocks, one with hands gripping the edges, the other with arms resting on their knees',
  'both leaning on a low wall, one with both forearms resting on top, the other with both hands flat on the surface',
  'both standing side by side, one stretching their neck, the other with arms folded across their chest',
  'sitting apart on a step, one with hands between their knees, the other with palms flat on the step',
  'both standing near a post, one with back against it, the other a step apart with weight on one foot',
  'both standing quietly, one loosening their scarf, the other with thumbs in belt loops',
  'sitting together on grass, one with hands supporting them behind, the other with arms around their own shins',
  'both leaning against a barrier, one with elbows on top, the other a step apart with arms at sides',
  'standing a comfortable arm-length apart, one brushing something off their own sleeve, the other with hands in pockets',
  'sitting side by side on a ledge, one with legs swinging, the other with feet firmly planted',
  'both standing near a column, one with shoulder against it, the other a step apart with arms loosely folded',
  'sitting together on a wall, one with hands gripping the edge, the other with arms wrapped around waist',
  'both leaning on a fence, one with both elbows resting, the other a step apart with one arm folded',
  'sitting apart on ground, one with knees up, the other sitting with legs crossed at ankles',
  'sitting together on steps, one with hands flat behind them, the other with elbows resting on knees',
  'both leaning against a wall, one with hands pressed flat against it, the other with arms crossed',
  'sitting side by side on a curb, one with arms around their own knees, the other with hands beside legs',
  'both standing near a lamppost, one with elbow against it, the other a step apart with arms folded',
  'both standing quietly, one smoothing their shirt front, the other with hands deep in jacket pockets',
  'sitting together on a log, one with hands on their ankles, the other with arms crossed loosely',
  'both leaning on a bridge rail, one with fingers drumming, the other standing still beside them',
  'both standing side by side, one stretching their shoulders, the other with arms wrapped around themselves',
  'sitting apart on a bench, one with legs tucked up, the other with feet planted wide',
  'both standing near a pillar, one with back to it, the other a step apart with slight angle',
  'both leaning against a low fence, one with arms draped over, the other a step apart with arms folded',
  'standing side by side with a clear gap between them, one buttoning their coat, the other with hands tucked into back pockets',
  'sitting side by side on rocks, one with hands gripping sides, the other with arms around their shins',
  'both standing near a tree, one with palm against bark, the other a step apart with arms crossed',
  'sitting together on a wall, one with hands tucked under legs, the other with palms flat down',
  'both leaning on a railing, one with forearms resting along the top, the other a step apart with hands free',
  'standing a step apart, one rolling their shoulders, the other with thumbs in front pockets',
  'sitting side by side on a step, one with hands between knees, the other with arms at sides',
  'both standing near a fence, one with shoulder blade against it, the other a step apart with arms loose',
  'sitting together on ground, one with legs straight out, the other with knees pulled up slightly',
  'both leaning against a barrier, one with both hands on top, the other a step apart with arms folded',
  'standing with clear space between them, one untangling their earphones, the other with hands deep in pockets',
  'sitting side by side on a curb, one with elbows on thighs, the other with hands flat beside them',
  'both standing near a post, one with forearm against it, the other a step apart with arms crossed',
  'both standing quietly, one straightening their shirt hem, the other with thumbs hooked in belt',
  'sitting together on a bench, one with ankle on opposite knee, the other with both feet down',
  'both leaning on a wall, one with hands spread flat, the other a step apart with arms at sides',
  'sitting side by side on grass, one with hands supporting behind, the other with arms around knees',
  'both standing near a column, one with elbow resting on it, the other a step apart with hands clasped',
  'standing a comfortable arm-length apart, one retying their shoelace while crouched, the other with thumbs in back pockets',
  'sitting side by side on steps, one with hands flat on thighs, the other with arms crossing chest',
  'both standing near a rail, one with both hands gripping it, the other a step apart with arms loose',
  'sitting together on a wall, one with legs hanging freely, the other with feet touching ground',
  'both leaning on a bridge railing, one with elbows wide, the other a step apart with arms crossed',
  'sitting side by side on a bench, one with hands tucked under thighs, the other with arms at sides',
  'both standing near a tree trunk, one with shoulder against it, the other a step apart with arms folded',
  'both leaning against a low wall, one with hands behind them, the other a step apart with arms crossed',
  'standing side by side with a clear gap between them, one adjusting their hood, the other with arms wrapped loosely around themselves',
  'sitting side by side on a curb, one with hands on their ankles, the other with palms beside legs',
  'both standing near a lamppost, one with back to it, the other a step apart with arms folded',
  'sitting together on a log, one with hands gripping the bark, the other with arms around their shins',
  'both leaning on a railing, one with arms stretched wide, the other a step apart with arms at sides',
  'sitting side by side on ground, one with knees drawn up, the other with legs crossed at ankles',
  'sitting together on a bench, one with hands between their knees, the other with arms at sides',
  'both leaning against a fence, one with folded arms resting on the top rail, the other a step apart with hands free',
  'sitting side by side on steps, one with elbows on knees, the other with hands flat on the step',
  'sitting together on grass, one with hands flat for balance, the other with arms wrapped around waist',
  'both leaning on a barrier, one with both elbows resting, the other a step apart with arms crossed',
  'sitting side by side on a wall, one with hands gripping the sides, the other with palms flat down',
  'both leaning against a wall, one with hands pressed back, the other a step apart with arms at sides',
  'sitting side by side on a ledge, one with legs swinging gently, the other with feet firmly planted',
  'both standing near a column, one with elbow resting casually, the other a step apart with arms crossed',
  'both leaning on a fence rail, one with arms draped over, the other a step apart with hands free',
  'sitting together on a wall, one with hands tucked under their legs, the other with arms at their sides',
  'sitting side by side on a bench, one with palms pressed down, the other with hands resting on their thighs',
  'sitting together on grass, one with knees up and arms around them, the other with legs stretched out',
  'both leaning on a low fence, one with both hands gripping the top, the other a step apart with arms loose',
  'sitting side by side on a curb, one with hands on their shins, the other with palms flat beside them',
  'sitting side by side on steps, one with arms wrapped around their waist, the other with hands on the step',
  'sitting together on a bench, one with hands between their knees, the other with feet planted wide',
  'both leaning on a railing, one with hands resting on the top rail, the other a step apart with arms free',
  'sitting side by side on grass, one with palms flat for support, the other with arms around their shins',
  'sitting together on a bench, one with fingers drumming on their knee, the other with arms crossed at their chest',
  'both standing near a mailbox, one with hand resting on top, the other a step apart with thumbs in loops',
  'one sitting on grass with legs straight ahead, the other kneeling beside them with hands on their own thighs',
  'both leaning on a dock railing, one with wrists crossed, the other a step apart with arms hanging loose',
  'sitting side by side on a step, one picking at their shoelaces, the other with hands folded in lap',
  'standing a step apart, one wiping their hands on their pants, the other with arms wrapped around their middle',
  'sitting together on a wall, one with hands gripping their ankles, the other with palms pressed down',
  'both leaning against a car hood, one with arms spread wide, the other a step apart with hands free',
  'sitting side by side on a curb, one with fingers interlaced behind neck, the other with hands beside legs',
  'standing with clear space between them, one pulling up their socks, the other with thumbs hooked in back pockets',
  'sitting together on a log, one with hands pressed into bark, the other with arms around their calves',
  'both standing near a trash can, one with elbow resting on rim, the other a step apart with arms crossed',
  'both leaning on a bridge rail, one with palms flat down, the other a step apart with arms at sides',
  'sitting side by side on grass, one with hands resting on their knees, the other with arms loose',
  'sitting together on steps, one with hands rubbing their knees, the other with arms crossed over chest',
  'both standing near a bike rack, one with hand on the metal, the other a step apart with arms folded',
  'both leaning against a storefront, one with back flat against glass, the other a step apart with arms loose',
  'sitting side by side on a bench, one stretching their arms overhead, the other with hands on their thighs',
  'standing side by side with a clear gap between them, one rubbing their hands together down low, the other with thumbs tucked into front pockets',
  'sitting together on a wall, one with palms rubbing together, the other with hands flat beside them',
  'both standing near a water fountain, one with hand touching the edge, the other a step apart with arms crossed',
  'sitting side by side on a curb, one with hands clapping together softly, the other with arms around waist',
  'standing a comfortable arm-length apart, one flexing their fingers, the other with hands deep in jacket pockets',
  'sitting together on a step, one with hands resting flat on the step, the other with arms at their sides',
  'both standing near a parking meter, one with palm against it, the other a step apart with arms folded',
  'both leaning against a fence gate, one with hands gripping the bars, the other a step apart with arms loose',
  'sitting side by side on a bench, one with hands resting on their thighs, the other with palms on knees',
  'standing with clear space between them, one cracking their knuckles, the other with arms wrapped around their own shoulders',
  'sitting together on grass, one with hands scratching their arm, the other with arms around their knees',
  'both standing near a telephone pole, one with a hand flat against it, the other a step apart with arms crossed',
  'both leaning on a concrete barrier, one with elbows wide apart, the other a step apart with arms at sides',
  'sitting side by side on steps, one with hands warming under their legs, the other with arms loose',
  'standing a comfortable arm-length apart, one shaking out their hands, the other with thumbs hooked in belt loops',
];

// PLAYFUL pool — fun/goofy/tongue-in-cheek poses for unconventional couple photos.
// SWAP-SAFE by construction, same hard rules as the other pools: the two HEADS
// stay clearly apart (a gap between them), faces are set by the brief (to camera),
// body language ONLY, NO contact / lift / dip / piggyback / cheek-to-cheek. The
// fun is in the gesture + attitude, never in pulling the faces together. (2026-06-16)
export const DUAL_ACTIONS_PLAYFUL: string[] = [
  'both throwing up peace signs with both hands, standing a shoulder-width apart with a clear gap between their heads',
  'both giving a big enthusiastic two-handed thumbs up, arms out, heads kept apart',
  "one holding up two fingers as bunny ears from a step to the SIDE of the other's head, both heads still clearly apart",
  'both in a matching superhero power stance, fists planted on hips and chests out, a clear gap between them',
  'both pointing finger-guns toward the camera, leaning back slightly, heads apart',
  'both throwing exaggerated jazz hands, leaning slightly outward away from each other',
  'both flexing their biceps side by side with mock-serious bravado, a gap between their heads',
  'one sweeping a grand "ta-da" presentation gesture toward the other who stands proudly, both a step apart',
  'both throwing their hands up wide in exaggerated mock-surprise, elbows out, heads apart',
  'both blowing a kiss toward the camera with one hand, standing apart with a clear gap between their heads',
  'both crossing their arms in a mock-tough cool-guy pose facing forward, a gap between them',
  'both pointing across the gap at each other with playful "this one!" grins, faces still toward camera',
  'both making finger-hearts up near their own shoulders, standing a step apart',
  'both mid-shrug with palms up and goofy "who knows" looks, heads apart',
  'both throwing up rock-on horns with both hands, big grins, heads kept apart',
  'one taking a dramatic theatrical bow with a flourish while the other gives a grand curtsy, a clear step apart',
  'both doing a cheesy synchronized double-point up toward the sky, leaning slightly outward',
  'both standing crisply at attention side by side with arms straight at their sides and mock seriousness, a gap between their heads',
  'both holding up matching shaka signs (thumb and pinky out, three fingers curled into the palm), heads apart',
  'both striking a confident catalog-model pose with hands in pockets and chins up, a clear gap between them',
  'both pretending to lean an elbow casually on thin air, mirrored, kept apart with heads separated',
  'both holding an invisible tiny object up to inspect with mock concentration, a gap between them',
  'both giving an exaggerated over-the-top wink with finger-guns, leaning slightly apart',
  'both flashing double "OK" hand signs out at chest level with proud grins, heads kept apart',
  'both planting hands on hips like proud heroes surveying the horizon but heads turned to camera, gap between them',
  "both mid-laugh with a clear gap between their heads, one lightly nudging the other's shoulder",
  'standing side by side with space between heads, both giving enthusiastic thumbs up to camera',
  'both pointing at each other with arms extended, heads apart, sharing a playful grin',
  'standing a step apart, both mid-clap with hands meeting at center, faces clearly separated',
  'both striking superhero poses with fists on hips, standing apart with heads clearly visible',
  'standing separately with space between, both shrugging with exaggerated confused expressions toward camera',
  'side by side with clear head gap, both blowing playful kisses forward with hands extended',
  'both doing peace signs at different heights, standing apart with big smiles facing camera',
  'standing with space between heads, one pointing forward while other points upward playfully',
  'both mid-stride walking forward separately, clear gap between their heads, arms swinging naturally',
  'side by side with heads apart, both holding invisible binoculars up to eyes looking outward',
  'standing separately, both doing exaggerated thinking poses with fingers on chins, faces visible',
  'both waving hello with opposite hands raised high, clear space between their separated heads',
  "standing apart, one giving gentle high-five to other's raised hand, both faces toward camera",
  'side by side with gap between, both flexing arms playfully with mock-serious faces forward',
  'both standing separately doing finger guns pointed forward, heads clearly apart and faces visible',
  'standing with space between heads, both crossing arms with playful smirks facing the camera',
  'both mid-jump separately with arms up, clear gap maintained between their heads in air',
  'side by side with heads apart, both saluting playfully with hands to foreheads facing forward',
  'standing separately, both doing enthusiastic jazz hands at chest level, faces clearly visible apart',
  "both looking at camera with space between heads, one arm around other's shoulder lightly",
  'standing apart, both making heart shapes with hands at chest level, faces separated and visible',
  'side by side with clear gap, both pointing enthusiastically in same direction with big smiles',
  'standing with space between, both holding up okay signs at different levels, faces visible',
  'both in athletic ready stances separately, knees bent, clear gap between heads facing camera',
  'side by side with heads apart, both doing slow motion run poses frozen mid-step',
  'standing separately, both tipping invisible hats forward with playful grins, faces clearly visible',
  'both posing with hands in pockets standing apart, casual lean, clear space between their heads',
  'standing with gap between heads, both doing excited claps at chest level facing camera',
  'side by side separately, both looking at camera doing exaggerated surprised expressions with hands out',
  'standing with space between, both mid-laugh holding stomachs, heads clearly separated and visible forward',
];

// DYNAMIC pool — cinematic, powerful, energetic stances for HERO-grade cast
// renders. Same hard swap rules as every other pool: the two HEADS stay clearly
// apart (a gap between them), faces are set forward by the brief, body language
// ONLY, NO contact / lean-into / lift / dip / cheek-to-cheek. Unlike COMPANION,
// motion is allowed — but ONLY camera-facing motion (turning toward the camera,
// striding forward, leaning into wind) so faces stay frontal for the swap; never
// walking away, turning to profile, or one behind the other. Scene-NEUTRAL and
// prop-free on purpose: the wardrobe + setting carry the theme, so a wide power
// stance reads as a warlord in Viking gear and a hero on a rooftop. This is the
// pool that kills the "posed costume-rental photo" look. (2026-08-25, Kevin)
export const DUAL_ACTIONS_DYNAMIC: string[] = [
  'both planted in a wide, grounded power stance squared to the camera, shoulders back and chins raised, arms crossed with quiet authority, a clear gap between their heads',
  'one with a boot planted up on a raised rock or ledge and a forearm resting across the knee, the other standing tall beside them with hands on hips, heads kept well apart',
  'both leaning back with easy confidence, arms loosely folded and mid-laugh with faces to the camera, a clear gap between them',
  'both standing with feet planted wide and fists loosely clenched at their sides like they own the ground, chests out, heads clearly apart',
  'one throwing an arm out in a broad sweeping gesture across the view while the other stands firm with arms crossed, both faces to the camera, a gap between their heads',
  'both windswept and leaning slightly into a strong gust, cloaks and hair streaming to one side, jaws set and eyes forward, a clear gap between their heads',
  'both mid-turn toward the camera as if just called, weight shifting onto the back foot, arms swinging naturally out to their own sides, heads apart',
  'one with a single fist raised high in triumph, the other with both arms flung wide in victory, both facing forward, a clear gap between their heads',
  'both with arms spread wide and open as if taking in a vast view, chests lifted, faces to the camera, heads kept well apart',
  'one standing with weight cocked to one hip and a hand raised in a confident beckon, the other with arms crossed and chin up, heads apart',
  'both squared to the camera with arms folded and feet set, radiating calm command, a clear gap between their heads',
  'one with hands on hips and elbows out, the other with arms crossed and a boot forward, both squared off and commanding, a gap between their heads',
  'both raising open hands toward the sky as if calling down the storm, chests lifted, faces forward, a clear gap between their heads',
  'one leaning forward with fists set on a rail or ledge glaring boldly ahead, the other standing tall beside them with arms crossed, heads clearly apart',
  'both striding forward toward the camera side by side with a wide gap between them, confident purposeful gait, arms swinging, heads clearly apart',
  'one flinging an arm skyward in a rallying cry, the other with a fist pressed to the chest, both fierce and forward, heads clearly apart',
  'both standing broad and still like carved warrior statues, arms crossed and jaws set, faces to the camera, a clear gap between them',
  'one gesturing grandly outward with an open hand presenting the scene, the other standing proud with hands clasped behind the back, heads apart',
  'both mid-cheer with arms thrown up and mouths open in a shout of triumph, a clear gap between their heads',
  'one arm raised and flexed in a triumphant strongman pose, the other with hands on hips and a fierce grin, heads kept apart',
  'both bracing low with weight set and arms out as if against motion, eyes blazing forward, a clear gap between their heads',
  'one striking a confident contrapposto with a hand on the hip, the other mirrored on the opposite hip, both proud and forward, heads apart',
  'both throwing their heads back mid-laugh with hands on their own hips, joyful and open, a clear gap between their heads',
  'one with an arm extended pointing boldly off to the side, the other tracking the gesture with a firm confident stance, heads apart',
  'both planted with legs apart and hands clasped in front at the waist like commanders at ease, chests out, a clear gap between them',
  'one leaning a shoulder back in a cocky half-turn to the camera, the other standing straight and proud, a clear gap between them',
  'both standing tall with one arm raised overhead in a bold hail to the camera, feet planted wide, heads clearly apart',
  'one pressing a fist into an open palm in front of the chest, the other with arms crossed high, both resolute and facing forward, a gap between their heads',
  'both crouched in low athletic ready stances with hands braced on the knees, chins up and eyes locked to the camera, a clear gap between their heads',
  'one with both arms raised wide and fists clenched in exultation, the other pumping a single fist, both triumphant and forward, heads apart',
];

/**
 * Pick a dual action seed based on the plus_one's relationship.
 *
 * Default nightly roll (no forcePool): 15% PLAYFUL (fun/goofy) + 40% DYNAMIC
 * (hero-grade cinematic) + 45% CLASSIC (chore-pruned). Within the classic slice,
 * partner/significant_other → 30% romantic / 70% companion; everyone else →
 * companion. Additive: dynamic joins the rotation strongly without erasing the
 * good existing poses; cast dreams read epic, not like a posed costume photo.
 *
 * `forcePool` overrides the relationship roll — used by QA + by CREATE (which
 * forces partner/companion so a user's specific prompt never gets a random goofy
 * or heroic pose).
 */
export interface DualActionPools {
  companion: string[];
  partner: string[];
  playful: string[];
  dynamic: string[];
}

export function pickDualAction(
  relationship: string | undefined,
  forcePool?: 'partner' | 'companion' | 'playful' | 'dynamic',
  // DB-loadable arrays (POSE_POOLS_DB_MIGRATION_PLAN.md). Default = the code
  // arrays. The DISTRIBUTION below never moves to the DB.
  pools: DualActionPools = {
    companion: DUAL_ACTIONS_COMPANION,
    partner: DUAL_ACTIONS_PARTNER,
    playful: DUAL_ACTIONS_PLAYFUL,
    dynamic: DUAL_ACTIONS_DYNAMIC,
  }
): string {
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  if (forcePool === 'playful') return pick(pools.playful);
  if (forcePool === 'partner') return pick(pools.partner);
  if (forcePool === 'companion') return pick(pools.companion);
  if (forcePool === 'dynamic') return pick(pools.dynamic);

  const r = Math.random();
  if (r < 0.15) return pick(pools.playful); // 15% fun/goofy
  if (r < 0.55) return pick(pools.dynamic); // 40% hero-grade cinematic
  // 45% CLASSIC slice (pruned of chores): partners get a 30/70 romantic/companion split.
  const isPartner = relationship === 'partner' || relationship === 'significant_other';
  if (isPartner && Math.random() < 0.3) return pick(pools.partner);
  return pick(pools.companion);
}
