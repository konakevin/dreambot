#!/usr/bin/env node
/**
 * Generate an OutlawBot pool using Sonnet (via the shared seedGenHelper).
 *
 * OutlawBot aesthetic — the American Old West made VIVID and EXCITING: a painted
 * picture-book of the frontier. Red Dead Redemption / Tombstone / Sergio Leone /
 * Remington / Wyeth. The per-render WESTERN-ART LOOK owns the render STYLE, so
 * these pools carry SCENE CONTENT ONLY (never rendering-style / medium words).
 *
 * Usage:
 *   node scripts/gen-outlawbot-pool.js --pool outlawbot_frontier_town_town --total 25
 *   node scripts/gen-outlawbot-pool.js --pool outlawbot_frontier_town_town --total 200 --append
 *   node scripts/gen-outlawbot-pool.js --all-frontier-town --total 25
 */

const path = require('path');
const { generatePool } = require('./lib/seedGenHelper');

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);

const SEED_DIR = 'scripts/bots/outlawbot/seeds';
const NUMBERED = 'Output as a NUMBERED list, one entry per line. No preamble, no headers.';

// Each recipe: metaPrompt(perBatchCount) => brief string returning N entries.
const RECIPES = {
  // ─── frontier-town (scene-as-hero) ────────────────────────────────────────
  outlawbot_frontier_town_town: (n) =>
    `You are writing ${n} short scene-setting phrases describing THE KIND OF OLD-WEST FRONTIER TOWN for OutlawBot's frontier-town path. Each entry is ONE vivid frontier town / main-street setting, 22-38 words. SCENE CONTENT ONLY — describe the PLACE (its character, layout, materials, setting), NEVER the rendering style, medium, camera, or art-look.

VARIETY MANDATE — spread WIDELY across the kinds of Old-West towns (do not repeat a type):
dusty desert main-street town · muddy rain-churned boomtown · gold-rush mining town clinging to a steep hillside · cattle-town railhead with stockyards · sun-baked adobe pueblo town of the Southwest · weathered clapboard town alone on the open plains · town at a canyon mouth under red cliffs · river-crossing town with a ferry landing · snowbound mountain mining camp · sun-blasted Mexican-border town · lawless crossroads trading post / outpost · prosperous brick-and-timber boomtown at its peak.

Each: name the town TYPE + its setting + 2-3 concrete material/layout details (false-front buildings, a wide rutted main street, boardwalks, a water trough, distant terrain). VIVID and characterful, a real place.

✅ "a sun-baked desert main-street town, a single wide rutted street of weathered false-front timber buildings, boardwalks sagging in the heat, a lone water trough, hard-packed dust drifting between the hitching rails"

${NUMBERED}`,

  outlawbot_frontier_town_structures: (n) =>
    `You are writing ${n} short phrases, each describing ONE false-front building that lines an Old-West town's main street, for OutlawBot's frontier-town path. Each entry is ONE building, 14-26 words. SCENE CONTENT ONLY — no rendering-style / medium / camera words.

VARIETY MANDATE — span the buildings of a frontier town (one per entry):
saloon with batwing doors and a long porch · general store / mercantile with goods stacked on the boardwalk · sheriff's office and jail · livery stable and corral · bank with a heavy door · hotel / boarding house with a second-floor balcony · blacksmith's forge glowing inside · white-steepled frontier church · telegraph / stage office · barber shop with a striped pole · undertaker's parlor · gunsmith · dance-hall / parlor house · feed-and-grain warehouse.

Each: the building + 1-2 concrete details (weathered timber, a sun-faded blank sign-board with NO legible text, shuttered windows, a lamplit interior, a hitching rail out front). Materially true.

✅ "a corner saloon with worn batwing doors and a sagging covered porch, a blank weather-faded sign-board above, warm lamplight glowing in its windows"

${NUMBERED}`,

  outlawbot_frontier_town_street_life: (n) =>
    `You are writing ${n} short phrases describing CANDID STREET LIFE — the living narrative moment on an Old-West town's main street — for OutlawBot's frontier-town path. Each entry is ONE candid moment, 18-32 words. The people and horses are PART OF THE SCENE and act as scale and story (faces need not be detailed). SCENE CONTENT ONLY — no rendering-style / camera words.

VARIETY MANDATE — span the life of a frontier street (one moment per entry):
horses tied dozing at the hitching rail · a six-horse stagecoach rolling in trailing dust · cowboys loitering and talking on the boardwalk · a loaded supply wagon and ox-team hauling through · a card game spilling onto a saloon porch · a lone rider walking his horse down the center of the street · cattle being driven through the street in a haze of dust · a blacksmith working at his forge · women in long dresses crossing the street with parcels · a Native rider passing through unhurried and dignified · a peddler's wagon drawing a small crowd · a horse rearing and a hand grabbing the reins · a quiet tense moment, two figures sizing each other up at a distance.

Render people as candid LIFE, mid-moment, never posed portraits. Keep the Native rider dignified and authentic, never caricature.

✅ "a six-horse stagecoach rolls in at the far end of the street trailing a long banner of golden dust, two cowboys turning to watch from the saloon boardwalk"

${NUMBERED}`,

  outlawbot_frontier_town_surround: (n) =>
    `You are writing ${n} short phrases describing THE LAND BEYOND an Old-West town — the frontier landscape framing it — for OutlawBot's frontier-town path. Each entry is ONE surrounding-terrain treatment, 14-26 words. SCENE CONTENT ONLY.

VARIETY MANDATE — span the western terrain that frames a town (one per entry):
red-rock mesas and buttes rising behind · distant blue mountain ranges · open rolling prairie grassland · saguaro-and-scrub desert flats · pine-clad foothills · a river valley with a green ribbon of cottonwoods · golden wheat-and-sage plains · badlands of eroded clay ridges · snow-capped peaks far off · a dry wash and rocky arroyo · endless flat horizon with nothing but sky.

Each: the terrain + how it frames/dwarfs the town (proves the isolation and scale of the West).

✅ "great red-rock mesas rise behind the town, their flat tops catching the last light while the little street sits small and alone beneath them"

${NUMBERED}`,

  outlawbot_frontier_town_atmosphere: (n) =>
    `You are writing ${n} short phrases describing ATMOSPHERE — dust, weather, and light-quality — on an Old-West main street, for OutlawBot's frontier-town path. Each entry is ONE atmospheric treatment, 14-26 words. SCENE CONTENT ONLY (light QUALITY + air, not a specific art medium).

VARIETY MANDATE — span the moods of the frontier (one per entry):
golden dust hanging thick in low raking sunlight · shimmering heat-haze over the street at high noon · a dust-devil spinning down the empty street · a gathering thunderstorm darkening the sky · soft golden-hour light gilding the false fronts · cool blue dusk with lamps coming lit in the windows · pale morning mist burning off the street · wind-driven grit and a tumbleweed bouncing past · the red-gold blaze of sunset flooding the street · a sudden rain turning the street to mud and reflection · still, hot, dead-quiet midday silence.

Each: the atmosphere + how the LIGHT behaves on the dust / timber / street.

✅ "low golden sunlight rakes straight down the street, every hoof-kicked puff of dust lit like amber smoke, long shadows reaching from the boardwalk posts"

${NUMBERED}`,

  outlawbot_frontier_town_sky: (n) =>
    `You are writing ${n} short phrases describing THE BIG WESTERN SKY over an Old-West town, for OutlawBot's frontier-town path. Each entry is ONE sky treatment, 14-26 words. SCENE CONTENT ONLY.

VARIETY MANDATE — span the great skies of the West (one per entry):
towering white thunderheads stacked over the plains · a vast clear cobalt sky with a few high clouds · a blazing orange-and-magenta sunset · a pale lavender dawn · a dramatic dark monsoon sky with distant rain-curtains · a star-strewn deep-blue night with a bright moon · a hot bleached-white noon sky · streaky golden-hour cloud bands · a sky full of wheeling birds at dusk · low dramatic storm light with a break of sun.

Each: the sky + its scale and how it dominates / frames the small town below.

✅ "a vast cobalt sky stacked with towering sunlit thunderheads dwarfs the little town, their shadows sliding slow across the open country"

${NUMBERED}`,

  outlawbot_frontier_town_composition: (n) =>
    `You are writing ${n} short phrases describing CAMERA FRAMING / COMPOSITION for an Old-West town scene, for OutlawBot's frontier-town path. Each entry is ONE framing, 14-26 words. Describe the SHOT (angle, vantage, foreground-to-background depth) — NOT the art medium. The goal is ANTI-MONOTONY: never the same shot twice.

VARIETY MANDATE — span dramatic western framings (one per entry):
wide establishing shot straight down the main street to the horizon · low boardwalk-level angle looking up the street · high vantage from the surrounding hills looking down on the town · a shot framed through a foreground hitching rail and dozing horses · three-quarter angle across the street with deep receding boardwalks · a lone rider's-eye view approaching the town from the open trail · tight canyon-mouth framing with cliffs flanking the street · over-the-shoulder of a figure on the boardwalk surveying the street · a sweeping diagonal with the false-fronts leading the eye to a distant mountain.

Each: the framing + the foreground / midground / background depth it builds.

✅ "a low wide establishing shot straight down the rutted main street, weathered false-fronts receding in tight perspective to a tiny figure and the open horizon beyond"

${NUMBERED}`,

  // ─── gunslinger — shared ENVIRONMENT pools ────────────────────────────────
  outlawbot_gunslinger_setting: (n) =>
    `You are writing ${n} short phrases describing THE WESTERN SETTING around a single Old-West gunslinger, for OutlawBot's gunslinger paths. Each entry is ONE setting, 16-28 words. SCENE CONTENT ONLY — the place behind/around the figure, never the art medium or the figure themselves.

VARIETY MANDATE — span where a gunslinger stands (one per entry):
a dusty town main street at the ready · open desert flats under a huge sky · a rocky red canyon · a dim lamplit saloon interior · a windswept prairie · a campfire on the open range at night · a homestead porch and corral · a river crossing with cottonwoods · an eroded badlands ridge · a high mesa overlook · a cattle range with distant herd · beside a railroad track on the plains · a sun-baked border-town plaza · a rocky mountain pass.

Each: the setting + 1-2 depth/detail notes so it recedes behind the figure (distant buildings, mesas, herd, horizon).

✅ "a dusty town main street stretching behind, weathered false-fronts and a few horses at the rail receding to a hazy golden horizon"

${NUMBERED}`,

  outlawbot_gunslinger_atmosphere: (n) =>
    `You are writing ${n} short phrases describing ATMOSPHERE + LIGHT around an Old-West gunslinger, for OutlawBot's gunslinger paths. Each entry is ONE light/weather treatment, 12-22 words. SCENE CONTENT ONLY (light QUALITY + air), never a specific art medium.

VARIETY MANDATE (one per entry): low golden-hour rake · blazing high-noon heat-haze · kicked-up dust drifting in the light · a gathering thunderstorm and dramatic clouds · red-gold sunset blaze · cool blue dusk with lantern glow · pale morning mist · wind-driven grit and a tumbleweed · a starlit night with firelight · harsh bleached midday glare · long dramatic shadows at day's end.

Each: the atmosphere + how the light falls on the figure and the dust.

✅ "low golden sunlight rakes across the scene, dust hanging like amber smoke, a long hard shadow thrown across the ground"

${NUMBERED}`,

  outlawbot_gunslinger_composition: (n) =>
    `You are writing ${n} short phrases describing CAMERA FRAMING for a single full-body Old-West gunslinger, for OutlawBot's gunslinger paths. Each entry is ONE framing, 12-22 words. Describe the SHOT (angle/vantage/depth) — NOT the art medium. ANTI-MONOTONY: never the same shot twice. Always full-body or three-quarter, the figure mid-action, planted with ground contact.

VARIETY MANDATE (one per entry): low hero angle looking up at the full-body figure · wide environmental shot, figure small against a vast setting · three-quarter draw-stance framing · dramatic silhouette against a bright sky · over-the-shoulder from behind the figure surveying the scene · from slightly below mid-stride · centered standoff framing down the street · a riding figure coming toward camera in a dust cloud · a campfire-lit close three-quarter at night.

Each: the framing + the foreground-to-background depth.

✅ "a low hero angle looking up at the full-body figure mid-stride, the western setting falling away behind to a distant horizon"

${NUMBERED}`,

  // ─── gunslinger — MALE figure pools ───────────────────────────────────────
  outlawbot_gunslinger_male_archetype: (n) =>
    `You are writing ${n} short phrases, each describing WHO a male Old-West gunslinger IS, for OutlawBot's gunslinger-male path. Each entry is ONE character archetype, 14-24 words. Describe the MAN — his TYPE, build, age, skin/weathering, eyes, and any scars. Do NOT describe his hair or facial hair (a separate HAIR axis owns that) and do NOT describe his clothes (separate axis). NOT the art medium. CAPABLE, real, never caricature.

⚠️ DESCRIBE TRAITS DIRECTLY — NEVER use any nationality, ancestry, ethnicity, or place word. Build the man from concrete physical traits only (build, skin tone, eyes, scars). Keep the trait range to fair-to-lightly-tanned/sun-browned skin.
⚠️ AGE late teens through about FIFTY, leaning 20s–40s — NEVER elderly/old, never past ~50 (hard cap 60). Light sun-weathering is fine; ancient/grizzled-old is not.

VARIETY MANDATE (one per entry): a weathered lone outlaw · a bounty hunter · a stoic sheriff · a sharp-eyed gambler · a hardened gunfighter · a sun-browned cattle rancher · a lean young drifter · a steady lawman · a scarred mercenary · a quiet retired gunhand · a dust-caked stagecoach guard · a young hot-headed desperado · a broad-shouldered ranch foreman · a wiry trail scout.

Each: the man-type + build + age (≤ ~50) + skin/light-weathering + eyes + bearing (NO hair, NO facial hair, NO clothing).

✅ "a hardened gunfighter in his late thirties, broad and unhurried, sun-browned skin, hard pale eyes, a knife scar across one cheekbone, a quiet dangerous calm"

${NUMBERED}`,

  outlawbot_gunslinger_male_hair: (n) =>
    `You are writing ${n} short phrases describing the HAIR + FACIAL HAIR of a male Old-West gunslinger, for OutlawBot's gunslinger-male path. Each entry is ONE hair treatment, 12-22 words. Hair COLOR + style (length, how it sits under/around the hat) + facial hair ONLY — not the clothes, not the art medium. This is the axis that makes each man a DISTINCT individual, so vary it BOLDLY.

VARY COLOR widely (do not default to brown): jet black · dark brown · chestnut · sandy blond · ash blond · auburn / red · light salt-and-pepper · sun-bleached dirty blond. (No fully grey/silver/white — keep it ≤ ~50.)
VARY FACIAL HAIR widely: clean-shaven · heavy stubble · a thick mustache · a long drooping gunslinger mustache · a full beard · a short trimmed beard · a goatee · mutton-chop sideburns · a soul patch and stubble · a grizzled unkempt beard.
VARY HAIRSTYLE: short-cropped · slicked back · shaggy collar-length · long and tied back · tousled and dusty · receding and close · wavy under the hat brim.

Each: ONE coherent combo (color + style + facial hair).

✅ "jet-black hair slicked back collar-length under the hat, and a long drooping black gunslinger mustache over heavy stubble"
✅ "iron-grey hair cropped short, a thick weathered salt-and-pepper full beard, brushed back at the temples"

${NUMBERED}`,

  outlawbot_gunslinger_male_wardrobe: (n) =>
    `You are writing ${n} short phrases describing the WARDROBE (period Old-West clothing + hat) of a male gunslinger, for OutlawBot's gunslinger-male path. Each entry is ONE outfit, 16-26 words. Clothing + hat ONLY — not the man, not the weapon, not the art medium. Authentic 1800s frontier dress, dusty and worn and real — grounded and lived-in, NOT a theatrical or over-styled costume.

VARIETY MANDATE — vary the outfit AND the hat (one per entry): a long trail-worn duster coat + wide-brim Stetson · a serape poncho + sombrero · a leather vest and chaps + weathered slouch hat · a sheepskin-collar coat + flat-brim hat · dusty shirt-sleeves, suspenders, a knotted bandana + battered hat · a dark frock coat and brocade vest (gambler) + bowler · fringed buckskin + fur cap · a cavalry-surplus coat + campaign hat · a denim work shirt and trousers + worn felt hat.

Each: the outfit + hat + 1-2 texture notes (dust, sweat-stain, frayed hem, worn leather).

✅ "a long oilcloth duster coat caked with trail dust, a faded blue bandana at the throat, leather gloves, and a sweat-stained wide-brim Stetson pulled low"

${NUMBERED}`,

  outlawbot_gunslinger_male_weapon: (n) =>
    `You are writing ${n} short phrases describing the WEAPON / GEAR a male Old-West gunslinger carries, for OutlawBot's gunslinger-male path. Each entry is ONE weapon/gear treatment, 12-22 words. The iron and gear ONLY — not the man, not the art medium. Period-accurate.

VARIETY MANDATE (one per entry): a pair of holstered revolvers on a worn gun belt · a lever-action repeating rifle slung across the back · a sawed-off coach shotgun · a single revolver drawn and leveled · a rifle cradled across the saddle · a bowie knife and a holstered six-shooter · a coiled lasso and a revolver · a bandolier of cartridges and a carbine · a holstered revolver with the hand hovering near it.

Each: the weapon + a concrete detail (worn grip, gleaming barrel, cartridge loops, holster leather).

✅ "a pair of pearl-gripped revolvers riding low in a tooled-leather gun belt heavy with brass cartridges, one hand hovering near the worn walnut grip"

${NUMBERED}`,

  outlawbot_gunslinger_male_action: (n) =>
    `You are writing ${n} short phrases describing the ACTION / candid MOMENT a male Old-West gunslinger is caught in, for OutlawBot's gunslinger-male path. Each entry is ONE mid-action moment, 14-24 words. The VERB/moment ONLY — never a stiff posed portrait. SCENE CONTENT, not art medium.

VARIETY MANDATE (one per entry): squared up and ready to draw · riding hard through dust · standing tall surveying the horizon · leaning on a porch post watching the street · crouched at a campfire · walking slow down the center of the street · rolling a cigarette in the shade · reloading his revolver · tipping his hat, eyes shadowed · swinging up into the saddle · drawing fast, coat flaring · cresting a ridge on horseback.

Each: the action + the body language / motion that makes it a captured MOMENT.

✅ "squared up in the middle of the street, weight settled, coat pushed back from the holster, one hand loose and ready, eyes fixed and cold"

${NUMBERED}`,

  // ─── gunslinger — FEMALE figure pools ─────────────────────────────────────
  outlawbot_gunslinger_female_look: (n) =>
    `You are writing ${n} short phrases, each describing the COMPLETE PHYSICAL LOOK of a DISTINCT female Old-West gunslinger, for OutlawBot's gunslinger-female path. Each entry is ONE specific woman's appearance, 22-34 words. This axis EXISTS to defeat same-face sameness, so make every entry a CLEARLY DIFFERENT WOMAN. BEGIN every entry by naming her ("a young woman" / "a woman in her thirties" etc.). Appearance ONLY (age, skin, exact facial features, eyes, hair) — NOT clothes, weapon, or art medium.

⚠️ DESCRIBE TRAITS DIRECTLY — NEVER use any nationality, ancestry, ethnicity, or place word (no "Irish", "German", "Swedish", "European", "settler", etc.). Those collapse into a generic AI average. Build each face from concrete PHYSICAL TRAITS only. Keep the trait range to fair-to-lightly-tanned skin and natural red/blonde/brown/black hair.

⚠️ AGE — span late teens through about FIFTY, with a REAL share in their 30s and 40s (do NOT make them all early-twenties). NEVER elderly, NEVER old, NEVER past ~50 (hard cap 60). No grey-white-haired old women, no deeply-aged faces. Light sun-weathering / a few faint lines on the older ones is fine; ancient is not.

⚠️ NO MODERN GLAMOUR — these are working frontier women with BARE, NATURAL faces: NO lipstick, NO eyeliner, NO eyeshadow, NO modern makeup or styling. Vary ATTRACTIVENESS and face SHAPE hard — ordinary, plain, handsome, striking, weather-touched — NOT the same flawless dewy fashion-model every time. Real faces with real bone-structure differences.

VARY EACH TRAIT HARD so no two women look alike:
  • SKIN: fair and clear · pale · fair with freckles · lightly sun-browned · rosy and ruddy · faintly sunburnt · light golden-tan.
  • EYES: pale blue · green · hazel · grey · light brown · dark brown.
  • NOSE: small and snub · straight · slightly upturned · narrow · sharp aquiline · softly rounded.
  • FACE/JAW: square strong jaw · soft round face · sharp high cheekbones · heart-shaped · a firm chin · delicate.
  • LIPS / BROWS / EXTRAS: thin or full lips; arched, fine, or heavy brows; freckles across the nose; a light scar; a small beauty mark; a faint gap in the teeth; a sun-squint.
  • HAIR COLOR: coppery red · auburn · strawberry-blonde · golden blonde · honey blonde · ash blonde · light brown · chestnut · dark brown · black.
  • HAIR STYLE: a single braid · two braids · a low bun · a ponytail · pinned up · a short crop · wind-loose · coiled under the hat. (Only a touch of early grey at ~45-50, never white old hair.)

Each entry = ONE coherent young-to-middle-aged woman: age + skin + 2-3 distinct facial features + eyes + hair (color + style). Real and characterful, not the same flawless model every time.

✅ "a young woman in her twenties, fair skin freckled across a small snub nose, sharp green eyes, coppery-red hair in a loose braid"
✅ "a woman around forty, fair skin lightly sun-weathered, a sharp aquiline nose and high cheekbones, cool grey eyes, dark-brown hair pinned under the hat"
✅ "a woman near thirty, rosy ruddy skin, a soft round face and full lips, pale-blue eyes, ash-blonde hair in two braids"
✅ "a young woman, mid-twenties, pale clear skin, a strong square jaw and arched brows, hazel eyes, black hair tied back in a low knot"

${NUMBERED}`,

  outlawbot_gunslinger_female_archetype: (n) =>
    `You are writing ${n} short phrases, each describing the ROLE + BEARING of a female Old-West gunslinger, for OutlawBot's gunslinger-female path. Each entry is ONE role + attitude, 10-18 words. Her TYPE and DEMEANOR ONLY — do NOT describe her face, age, skin, hair (a separate LOOK axis owns all of that) or her clothes. NOT the art medium. CAPABLE, strong; never sexualized; authentic dignity, never caricature.

VARIETY MANDATE (one per entry): a steely-eyed outlaw · a relentless bounty huntress · a sharp saloon-owner · a tough rancher · a deadly desperada · a cool gambler · a hardened homesteader · a crack travelling sharpshooter · a proud vaquera · a dignified rider · a fearless stagecoach driver · a widow turned gunhand · a quiet drifter · a wanted fugitive.

Each: the role + a few words of BEARING/attitude (level gaze, unhurried menace, fearless calm). NO physical description.

✅ "a relentless bounty huntress, cold and unhurried, carrying herself like she has all the time in the world"

${NUMBERED}`,

  outlawbot_gunslinger_female_hair: (n) =>
    `You are writing ${n} short phrases describing the HAIR of a female Old-West gunslinger, for OutlawBot's gunslinger-female path. Each entry is ONE hair treatment, 12-22 words. Hair COLOR + style (length + how it's worn, practical for riding, often under/around a hat) ONLY — not the clothes, not the art medium. This is the axis that makes each woman a DISTINCT individual, so vary it BOLDLY. Practical frontier hair, never a glamour blow-out.

VARY COLOR widely (do not default to brown): jet black · dark brown · chestnut · auburn / coppery red · honey blond · ash blond · iron grey · silver-streaked · sun-bleached.
VARY STYLE: a long thick single braid · two braids · a low practical bun · a tied-back ponytail · pinned up under the hat · a loose windblown mane · a short rough crop · a braid wrapped at the nape · waves escaping a knot.

Each: ONE coherent combo (color + style), worn practically.

✅ "a long copper-red braid pulled over one shoulder, loose strands escaping under the hat brim"
✅ "iron-grey hair scraped back into a tight low bun, weathered and practical"

${NUMBERED}`,

  outlawbot_gunslinger_female_wardrobe: (n) =>
    `You are writing ${n} short phrases describing the WARDROBE (period Old-West clothing + hat) of a female gunslinger, for OutlawBot's gunslinger-female path. Each entry is ONE outfit, 16-26 words. Clothing + hat ONLY — period-true, dusty and real, grounded and lived-in (NOT a theatrical or over-styled costume), NEVER revealing or fanservice (buttoned shirts, fully covered). Not the woman, not the weapon, not the art medium.

⚡ A touch more CHIC, but authentically: well-fitted, put-together, effortlessly stylish — yet still grounded, worn and real. Lean TROUSERS-AND-BOOTS forward: most entries are fitted denim/canvas/leather trousers (or dungarees) tucked into worn riding boots, not skirts. Skirts and dresses are still WELCOME but a MINORITY (~1 in 4).

VARIETY MANDATE — vary the outfit AND hat (trousers-forward; one per entry):
fitted denim trousers tucked into worn riding boots + a tucked buttoned shirt + flat-brim hat · slim canvas trousers + a fitted leather vest + wide-brim hat · leather trousers + a short fitted jacket + tilted hat · a long riding duster over trousers and boots + weathered Stetson · a serape over trousers + sombrero · fringed buckskin trousers and jacket + fur cap · a sharp tailored vest, trousers and boots (chic gambler) + feathered hat · a buttoned work shirt, suspenders, trousers, bold bandana + battered hat · a fitted canvas coat over trousers + flat-brim hat · (minority) a practical split riding skirt with a gun belt + wide-brim hat · (minority) a saloon-owner's high-necked buttoned dress + feathered hat.

Each: the outfit + hat + 1-2 texture notes (trail dust, worn leather, well-fitted cut, frayed hem). Stylish, practical, covered.

✅ "fitted dark denim trousers tucked into scuffed riding boots, a crisp tucked-in buttoned shirt, a snug leather vest, gun belt, a rust bandana, and a flat-brim hat tipped low"

${NUMBERED}`,

  outlawbot_gunslinger_female_weapon: (n) =>
    `You are writing ${n} short phrases describing the WEAPON / GEAR a female Old-West gunslinger carries, for OutlawBot's gunslinger-female path. Each entry is ONE weapon/gear treatment, 12-22 words. The iron and gear ONLY — period-accurate, not the woman, not the art medium.

VARIETY MANDATE (one per entry): a holstered revolver on a worn gun belt · a lever-action rifle held ready · a derringer drawn from a sleeve · twin revolvers riding low · a sawed-off shotgun cradled · a rifle across the saddle · a coiled lasso and a six-shooter · a bandolier and carbine · a hand resting easy on a holstered revolver.

Each: the weapon + a concrete detail (worn grip, brass cartridges, holster leather, gleaming barrel).

✅ "a single nickel-plated revolver riding in a worn gun belt of brass-looped leather, her gloved hand resting easy on the grip"

${NUMBERED}`,

  outlawbot_gunslinger_female_action: (n) =>
    `You are writing ${n} short phrases describing the ACTION / candid MOMENT a female Old-West gunslinger is caught in, for OutlawBot's gunslinger-female path. Each entry is ONE mid-action moment, 14-24 words. The VERB/moment ONLY — never a stiff posed portrait, never a glamour pose. SCENE CONTENT, not art medium.

VARIETY MANDATE (one per entry): squared up and ready to draw · riding hard through dust · standing defiant surveying the land · dealing cards with a level stare · aiming a rifle steady · hand resting ready on her holster · walking slow down the street · crouched at a campfire · reloading without looking up · swinging up into the saddle · cresting a ridge on horseback · turning sharp, duster flaring.

Each: the action + the body language / motion that makes it a captured MOMENT. Capable and grounded.

✅ "standing defiant on the open range, feet planted, duster snapping in the wind, one hand resting ready on her holstered revolver, eyes hard on the horizon"

${NUMBERED}`,
};

const FRONTIER_TOWN_POOLS = Object.keys(RECIPES).filter((k) => k.startsWith('outlawbot_frontier_town_'));
const GUNSLINGER_POOLS = Object.keys(RECIPES).filter((k) => k.startsWith('outlawbot_gunslinger_'));

async function genOne(pool, total, batch, append) {
  const metaPrompt = RECIPES[pool];
  if (!metaPrompt) {
    console.error(`Unknown pool "${pool}". Known: ${Object.keys(RECIPES).join(', ')}`);
    process.exit(1);
  }
  console.log(`\n===== GEN ${pool} (total ${total}, append ${append}) =====`);
  await generatePool({
    outPath: path.join(SEED_DIR, `${pool}.json`),
    total,
    batch,
    append,
    metaPrompt,
  });
}

(async () => {
  const total = parseInt(flag('total', '25'), 10);
  const batch = parseInt(flag('batch', '25'), 10);
  const append = has('append');

  if (has('all-frontier-town')) {
    for (const pool of FRONTIER_TOWN_POOLS) {
      await genOne(pool, total, Math.min(batch, total), append);
    }
    console.log('\nALL frontier-town pools done.');
    return;
  }

  if (has('all-gunslinger')) {
    for (const pool of GUNSLINGER_POOLS) {
      await genOne(pool, total, Math.min(batch, total), append);
    }
    console.log('\nALL gunslinger pools done.');
    return;
  }

  const pool = flag('pool', null);
  if (!pool) {
    console.error('Usage: --pool <name> --total <N> [--append] | --all-frontier-town --total <N>');
    process.exit(1);
  }
  await genOne(pool, total, Math.min(batch, total), append);
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
