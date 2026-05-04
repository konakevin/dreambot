/**
 * FaeBot sexy-fae-boudoir — TEST/EXPERIMENT path. Boudoir-pose dryad in
 * enchanted-grove "boudoir" (moss-bed / petal-strewn hollow / glowing-spring
 * side / root-canopy alcove / faerie-mushroom circle). Fae-themed lingerie
 * (leaf-vine-petal-moss-dewdrop coverage).
 *
 * NOT in nightly rotation — only invoked manually via iter-bot --mode.
 * Built FROM dryad-portrait path (the proven feminine-character template).
 */

const fs = require('fs');
const path = require('path');
const pools = require('../pools');
const blocks = require('../shared-blocks');

const FAE_BOUDOIR_WARDROBE = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'seeds', 'fae_boudoir_wardrobe.json'),
    'utf8'
  )
);

const FAE_BOUDOIR_SETTINGS = [
  'lying back on a soft moss-bed strewn with bioluminescent flower petals, ferns and vines arching over her like a canopy, dewdrops glistening on the leaves above',
  'reclining in a hollowed-out tree alcove lined with moss and dried flower-petals, root-canopy curving overhead, glowing fairy-pollen drifting in slow shafts of moonlight',
  'kneeling on a velvet-soft moss patch beside a glowing turquoise spring-pool, lotus-pads floating in the water, glow-moths drifting around her',
  'draped across a giant flower-blossom that has cradled her body like a chaise, petals folded around her, dewdrop-curtain hanging from above',
  'lying on her side in a circle of glowing red-and-white toadstools, soft moss bedding, fireflies hovering around her hair',
  'half-sitting half-lying against piled silk-moss pillows in a fern-grove alcove, glowing pollen drifting through the air, moonlit-cool light filtering through the canopy',
  'on her back in a bed of luminous-blue forest flowers, vines tendrils gently looping around her arms and legs, glowing-pollen sparkling in the air',
  'on her knees on a moss-pile beside an ancient root-throne overgrown with flowers, the throne behind her looming like a green velvet headboard',
  'reclining on a giant ivory-white shelf-mushroom serving as her bed, dewdrop-pearl coverlet draped over her hips, glowing-vines hanging like bed-curtains',
  'half-emerged from a glowing pool of milky-iridescent fae water, water-droplets beading on her bare skin, flower-petals floating around her',
];

const FAE_PROVOCATIVE_POSES = [
  'lying on her back on the moss-bed with one knee drawn up and slightly parted, one hand resting on her bare stomach, head tilted toward the camera, lips parted',
  'flat on her back with both arms thrown above her head, back slightly arched off the soft moss, one knee bent up, gazing dreamily up at the canopy',
  'sprawled on her back with hair fanned across the petals, knees apart and slightly bent, looking directly at camera through her lashes',
  'kneeling upright with knees parted slightly, hands resting on her hips, back arched, chest thrust forward against the leaf-bralette',
  'kneeling at the edge of the moss-bed with knees apart, one hand cupping the side of her own breast through the petal-bralette, gaze locked on the camera',
  'on her hands and knees on the moss-bed, back deeply arched, looking up at camera through her lashes, hair tumbled forward',
  'on all fours with one arm reaching toward the camera, the other braced on the moss, head turned to face the viewer, hair spilling forward',
  'half-sitting half-lying against piled moss pillows, back arched dramatically, one hand in her hair, the other trailing slowly down her bare body',
  'arching back on her elbows with her chest pushed forward, head thrown back exposing her bare throat, one knee drawn up and parted from the other',
  'lying on her side with one elbow propping up her head, free hand resting low on her hip, top knee bent forward and parted from the bottom leg',
  'on her side facing the camera with one hand sliding up her own thigh, the top leg bent at the knee, hair fanned out across the moss behind her',
  'classic pin-up pose lying on her stomach with both feet kicked up behind her crossed at the ankles, propped on her elbows, looking back over her shoulder',
  'sitting back on her heels with one hand at her parted lips, the other hand sliding down between her thighs (over the petal-skirt), gazing directly at camera',
  'kneeling upright with both hands cupped over her own chest above the leaf-bralette, head tilted back, hair spilling down her bare back, lips parted',
  'leaning back on her arms with legs stretched out and crossed at the ankles, chest pushed forward, head tilted, vine-hair tumbled over one shoulder',
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.DRYAD_PORTRAITS, 'dryad_portrait');
  const wardrobe = picker.pickWithRecency(FAE_BOUDOIR_WARDROBE, 'sfb_wardrobe');
  const setting = pick(FAE_BOUDOIR_SETTINGS);
  const pose = pick(FAE_PROVOCATIVE_POSES);

  return `You are writing ONE Flux prompt for a SEXY-FAE-BOUDOIR shot. Output ONLY the prompt — comma-separated phrases, 70-95 words, no preamble.

━━━ THE DRYAD (her face / skin / hair / fae-anchor — render her exactly this way) ━━━
${creature}

━━━ HER OUTFIT (fae-themed lingerie — leaves / vines / petals / dewdrops) ━━━
${wardrobe}

━━━ HER SETTING (enchanted-grove boudoir) ━━━
${setting}

━━━ HER POSE (boudoir-photoshoot, provocative + tasteful) ━━━
${pose}

━━━ LIGHTING + MAGIC ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 120)}
Visible magical signature near her — glowing pollen / fireflies / dewdrop-glimmer / soft halo / luminescent moss. Soft golden-hour or moonlit-cool light catching her bare skin and the edges of her plant-coverage.

━━━ COMPOSITION ━━━
Cinematic boudoir-photography framing — full-body or 3/4-body shot showing both her plant-lingerie outfit AND the enchanted-grove setting. SOLO — no second figure. The grove IS half the image.

━━━ HARD BANS ━━━
- NO topless / bare-chested / bare-bust / nude — every entry MUST have leaves / petals / vines / dewdrop-lace covering chest AND below the waist
- NO additional figures
- NO modern objects
- NO violence / aggressive imagery — boudoir-tasteful only
- NO "head-and-shoulders portrait" framing — this is FULL-BODY boudoir

━━━ STRUCTURE ━━━
Open with the dryad (creature description). Then her wardrobe / outfit. Then her pose on the moss-bed / in the grove. Then setting + lighting + magic.

Output 70-95 words, comma-separated phrases.`;
};
