/**
 * StarBot sexy-cyborg-bedroom — TEST/EXPERIMENT path. Cyborg woman in
 * a sci-fi boudoir setting (cryo-pod / cybernetic chamber / starship suite /
 * neon zero-G alcove). Lore-accurate sexy cyber-lingerie.
 *
 * NOT in nightly rotation — only invokable via iter-bot --mode.
 * Built FROM cyborg-woman path (the proven cyborg template).
 */

const fs = require('fs');
const path = require('path');
const pools = require('../pools');

const CYBORG_BOUDOIR_WARDROBE = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'seeds', 'cyborg_boudoir_wardrobe.json'),
    'utf8'
  )
);

const CYBORG_BOUDOIR_SETTINGS = [
  'lying back inside an open chrome cryo-pod with glowing turquoise life-support gel, neon-blue medbay lights flickering across her body, cables and tubes draped around her',
  'reclining on a holographic-floor bed in a neon-lit starship cabin, projection-window showing a nebula spinning outside, fiber-optic ceiling glowing soft cyan',
  'half-submerged in a glowing biomech-fluid tank, glowing turquoise liquid lapping at her hips, exposed servo-cables draped over the rim, neon-strip lighting around the chamber',
  'sprawled on a leather-and-chrome lounger in a private penthouse cyberpunk suite, neon-pink and electric-blue cityscape glowing through floor-to-ceiling windows, hologram orchids drifting',
  'kneeling on a circuit-pattern bedspread in a starship officer-quarters bedroom, navigation hologram floating above her shoulder, soft amber lamplight from a chrome desk lamp',
  'on her side draped across a magnetic-levitation bed floating six inches above the floor, cyan glow from beneath, neon-edge ceiling shadows playing across her skin',
  'lounging in a translucent biomech regeneration tube, glowing healing-fluid swirling around her, tube-walls projecting soft neon-data-stream patterns',
  'half-emerged from a chrome-and-glass cyber-spa bath chamber, holographic petal-drift floating across the steam, neon-edge lighting tracing every chrome surface',
  'on her back on a circuit-fiber bedsheet in a private cybernetic boudoir, holographic constellation rotating slowly above her, neon-glow trim along the bed-frame, fiber-optic curtains',
  'reclining on a black-leather chaise in a neon-lit cyberdeck lounge, holographic projection screens flickering on the walls behind her, electric-blue ambient glow',
];

const CYBORG_PROVOCATIVE_POSES = [
  'lying on her back across the bed with one knee drawn up and slightly parted, one mechanical hand resting on her bare stomach, head tilted toward the camera, lips parted',
  'flat on her back with both arms thrown above her head, back slightly arched, one knee bent up, gazing dreamily upward, glowing eyes half-lidded',
  'sprawled on her back with hair fanned across the pillow, knees apart and slightly bent, looking directly at camera through her glowing-aperture eyes',
  'kneeling upright with knees parted, hands resting on her hips, back arched, chest thrust forward against the chrome bralette, glowing core visible through translucent abdomen',
  'kneeling at the edge of the bed with knees apart, one mechanical hand cupping the side of her own breast through the bralette, gaze locked on camera',
  'on her hands and knees on the circuit-bedspread, back deeply arched, looking up at camera through her lashes, fiber-optic cables in her hair glowing',
  'on all fours with one arm reaching toward the camera, the other braced on the bed, head turned to face the viewer, hair spilling forward, glowing temple-port visible',
  'half-sitting half-lying against piled silk pillows, back arched dramatically, one hand in her hair, the other trailing slowly down her bare body past the chrome panels',
  'arching back on her elbows with chest pushed forward, head thrown back exposing her bare throat and neural-jack port, one knee drawn up and parted',
  'lying on her side with one elbow propping up her head, free mechanical hand resting low on her hip, top knee bent forward, glowing circuit-veins pulsing',
  'on her side facing the camera with one hand sliding up her own thigh past the chrome thigh-plate, top leg bent at the knee, hair fanned across the pillow',
  'classic pin-up pose lying on her stomach with both feet kicked up behind her crossed at the ankles, propped on her elbows, looking back over her shoulder',
  'sitting back on her heels with one mechanical hand at her parted lips, the other hand sliding down between her thighs (over the strap-bottom), gazing at camera',
  'kneeling upright with both hands cupped over her own chest above the bralette, head tilted back, hair spilling down her bare back, glowing circuit-spine visible',
  'leaning back on her arms with legs stretched out and crossed at the ankles, chest pushed forward, head tilted, hair tumbled over one bare shoulder, exposed servo-shoulder catching light',
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const cyborgFeature = picker.pickWithRecency(pools.CYBORG_FEATURES, 'cyborg_feature');
  const wardrobe = picker.pickWithRecency(CYBORG_BOUDOIR_WARDROBE, 'scb_wardrobe');
  const setting = pick(CYBORG_BOUDOIR_SETTINGS);
  const pose = pick(CYBORG_PROVOCATIVE_POSES);

  return `You are a cinematographer writing INTIMATE CYBORG BOUDOIR scenes for StarBot's TEST sexy-cyborg-bedroom path. Half-human half-machine cyborg woman in lore-accurate sexy attire on a cyber-bed / cryo-pod / starship suite, in a provocative-but-tasteful pose. Hyper-real cinematic 3D. Output wraps with style prefix + suffix.

━━━ CRITICAL — HER FACE IS HUMAN BUT PART CYBORG (NON-NEGOTIABLE) ━━━
Her face is BEAUTIFUL with real eyes (or one real + one mechanical), expressive features. NO helmet, NO visor, NO mask. AT LEAST ONE prominent cyborg integration on the face/head: chrome temple-port, fiber-optic cables, glowing iris/aperture, neural-jack, glowing circuit-veins, partial chrome plate. NEVER 100%-organic flesh face on a cyborg body.

━━━ HER IDENTITY (cyborg DNA) ━━━
${sharedDNA.characterBase}

━━━ HER BODY ━━━
- Skin: **${sharedDNA.skin}**
- Body: **${sharedDNA.bodyType}**
- Eyes (burn in glow color): **${sharedDNA.eyes}**
- Hair: **${sharedDNA.hair}**
- Internal exposure (translucent panels, visible workings): **${sharedDNA.internal}**
- GLOW COLOR (eyes, power core, circuit veins ALL glow this color): **${sharedDNA.glowColor}**

━━━ DOMINANT MECHANICAL FEATURE ━━━
${cyborgFeature}

━━━ HER OUTFIT (lore-accurate cyber lingerie — chrome/holo/neon/biomech) ━━━
${wardrobe}

━━━ HER SETTING (cyber boudoir — cryo-pod/starship-suite/biomech-tank) ━━━
${setting}

━━━ HER POSE (boudoir-photoshoot, provocative + tasteful) ━━━
${pose}

━━━ LIGHTING + ATMOSPHERE ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 120)}
Neon glow / cyber-amber lamplight / holo-projection light / glowing circuit-vein highlights. Soft cyber shadows.

━━━ COMPOSITION ━━━
Cinematic boudoir-photography framing — full-body or 3/4-body shot showing both her cyber-lingerie outfit AND the cyber-boudoir setting. SOLO — no second figure. The setting IS half the image. AT LEAST 3-4 distinct cyborg reveals visible (translucent panels, exposed servo, circuit-vein glow, chrome jaw-panel, neural-jack).

━━━ HARD BANS ━━━
- NO topless / bare-chested / bare-bust / nude — chrome / holo / neon / biomech-mesh MUST cover chest AND below the waist
- NO additional figures
- NO full body armor / mech suit / iron-man / power-armor / robotic-chassis (she's CYBORG with skin showing, not robot)
- NO skulls / skeletons / bone imagery
- NO violence / blood / aggressive imagery — boudoir-tasteful only

━━━ STRUCTURE ━━━
Open with her cyborg identity (face + body). Then her wardrobe (cyber lingerie). Then her pose on the cyber-bed/in the suite. Then setting + lighting + cyborg-feature reveals.

Output 60-90 words, comma-separated phrases. NO preamble.`;
};
