/**
 * SteamBot sexy-bedroom-test — TEST/EXPERIMENT path. Bedroom + provocative-pose
 * + explicit-lingerie wardrobe pool. Used to find Flux 1.1 Pro's NSFW ceiling.
 *
 * NOT in nightly rotation — only invoked manually via iter-bot --mode.
 * Uses a separate STEAMPUNK_WOMEN_WARDROBE_BEDROOM pool (steampunk_women_wardrobe_BEDROOM.json).
 */

const fs = require('fs');
const path = require('path');
const pools = require('../pools');

// Load the bedroom-only wardrobe pool (separate from main wardrobe pool).
const BEDROOM_WARDROBE = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'seeds', 'steampunk_women_wardrobe_BEDROOM.json'),
    'utf8'
  )
);

const BEDROOM_SETTINGS = [
  'lying back on a brass four-poster bed with red-velvet sheets and copper-trim bedposts, candles flickering on the nightstand',
  'kneeling on a brass-canopied bed surrounded by silk pillows and tangled brass-lace coverlet, gaslamp glow on her skin',
  'draped across a velvet fainting couch in a candlelit Victorian boudoir, brass mirrors reflecting from every angle',
  'reclining on her back on a brass-railed bed with white-lace sheets pulled half off her, brass clockwork lamp glowing amber',
  'propped on her elbows on a velvet-upholstered chaise lounge, candelabra burning low behind her, brass mirror to one side',
  'seated at her brass-and-mahogany Victorian vanity in a candlelit boudoir, brushing her hair, the bed visible reflected in the mirror',
  'on her stomach on a brass bed with one foot kicked up behind her, gaslamp shadows playing across her body',
  'half-sitting half-lying against piled red-velvet pillows on a brass-canopied four-poster, the silk sheets puddled at her hips',
  'kneeling at the edge of a velvet-upholstered Victorian bed with brass-rail frame, looking back over her shoulder at the camera',
  'lounging in a deep brass-clawfoot bathtub filled with steaming water and rose petals, candles flickering at the rim',
];

const PROVOCATIVE_POSES = [
  // LYING ON BACK
  'lying on her back across the rumpled bed, one knee drawn up and slightly parted from the other, one hand resting on her bare stomach, head tilted toward the camera, lips parted',
  'flat on her back with both arms thrown above her head, back slightly arched off the silk sheets, one knee bent up, gazing dreamily up at the ceiling',
  'sprawled on her back with hair fanned across the pillow, one hand at her collarbone, one hand at her hip, knees apart and slightly bent, looking directly at camera',
  // KNEELING
  'kneeling upright on the bed with knees parted slightly, hands resting on her hips, back arched, chest thrust forward, looking sultrily over her shoulder',
  'kneeling at the foot of the bed with knees apart, one hand cupping the side of her own breast through the lingerie, the other hand at her thigh, gaze locked on the camera',
  'on her knees facing camera with knees spread slightly and back arched, both hands sliding up her own ribs toward her chest, head tilted back, hair tumbling',
  // ON HANDS AND KNEES
  'on her hands and knees on the bed facing camera, back deeply arched, chest pressed low and hips raised high, looking up through her lashes',
  'on all fours with one arm reaching toward the camera, the other braced on the bed, head turned to look directly at the viewer, hair spilling forward',
  // ARCHED BACK
  'half-sitting half-lying against piled velvet pillows, back arched dramatically, one hand in her hair, the other trailing slowly down her body to her hip',
  'arching back on her elbows with her chest pushed forward, head thrown back exposing her bare throat, one knee drawn up and parted from the other',
  // ON SIDE
  'lying on her side with one elbow propping up her head, free hand resting low on her hip, top knee bent forward and parted from the bottom leg',
  'on her side facing the camera with one hand sliding up her own thigh, the top leg bent at the knee, hair fanned out behind her',
  // PIN-UP
  'classic pin-up pose lying on her stomach with both feet kicked up behind her crossed at the ankles, propped on her elbows, looking back over her shoulder',
  'sitting at the edge of the bed with legs crossed at the knee, leaning back on her arms, chest pushed forward, head tilted, hair tumbled over one shoulder',
  // HANDS-ON-CHEST / SELF-TOUCH
  'kneeling upright with both hands cupped over her own chest above the lingerie, head tilted back, hair spilling down her bare back, lips parted',
  'sitting back on her heels with one hand at her parted lips, the other hand sliding down between her thighs (over the lingerie), gazing directly at camera',
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const skin = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_SKIN, 'spw_skin');
  const eyes = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_EYES, 'spw_eyes');
  const makeup = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_MAKEUP, 'spw_makeup');
  const hairColor = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_HAIR_COLOR, 'spw_hair_color');
  const hairstyle = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_HAIRSTYLES, 'spw_hairstyle');
  const wardrobe = picker.pickWithRecency(BEDROOM_WARDROBE, 'sbt_wardrobe');
  const setting = pick(BEDROOM_SETTINGS);
  const pose = pick(PROVOCATIVE_POSES);

  return `You are a Victorian-boudoir photographer writing INTIMATE BEDROOM SCENES for SteamBot's TEST sexy-bedroom path. The subject is a stunning steampunk woman in lingerie / partially-undressed / boudoir attire on a bed or in a Victorian boudoir, in a provocative-but-tasteful pose. Output wraps with style prefix + suffix.

━━━ HER SKIN ━━━
${skin}

━━━ HER EYES ━━━
${eyes}

━━━ HER MAKEUP (smoky / sultry / boudoir-appropriate) ━━━
${makeup}

━━━ HER HAIR (tousled / undone / loose / boudoir-coded) ━━━
${hairColor}, ${hairstyle}

━━━ HER OUTFIT (lingerie / partially-undressed / bedroom intimate) ━━━
${wardrobe}

━━━ THE SETTING (bedroom / boudoir — render distinctly) ━━━
${setting}

━━━ HER POSE (provocative, tasteful) ━━━
${pose}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic boudoir-photography framing — full-body or 3/4-body shot showing both her full outfit AND the bed/boudoir setting. Warm gaslamp / candlelight / amber-glow lighting. Soft shadows. SOLO — no second figure, no man, no couple-pose. The bedroom IS half the image.

━━━ HARD BANS ━━━
- NO bare nipples / bare breasts / bare crotch — the lingerie/coverage from the wardrobe pool MUST cover those zones (sheer-with-pasties / lace-cups / brass-mesh-coverage is fine, full bare is not)
- NO second figure / no man / no couple
- NO ropes / bondage / blood / aggressive imagery — sultry-tasteful only
- NO modern items, no plastic, no photo-studio backdrops — fully Victorian-boudoir setting

━━━ STRUCTURE (write in this order) — CRITICAL OPENING ━━━
The FIRST 4-6 words of your output MUST be: [SKIN-COLOR-ADJECTIVE]-skinned [ETHNICITY-NOUN] woman. Examples: "deep ebony-skinned Senegalese woman", "warm caramel-skinned Persian woman", "rich terracotta-skinned Mexican mestiza woman". Lead with COLOR, then NATIONALITY.
Then: [her face — eyes + makeup], [her hair — exact color and style], [HER POSE — what she's doing on the bed], [HER OUTFIT — material detail], [HER SETTING — bedroom/boudoir], [lighting + atmosphere]

Output ONLY the 60-90 word scene description, comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases.`;
};
