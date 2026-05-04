/**
 * DragonBot sexy-warrior-bedroom — TEST/EXPERIMENT path. Female fantasy warrior
 * (drow / tiefling / dragonborn / etc.) in a boudoir setting (dragon-lair
 * treasure-chamber / fur-piled rock-throne / mountain hot-spring / castle
 * bedchamber). Lore-accurate sexy lingerie (chain-mail bralette, leather
 * strapping, fur, gauntlets-only).
 *
 * NOT in nightly rotation — only invokable via iter-bot --mode.
 * Built FROM female-warrior path (the proven feminine-character template).
 */

const fs = require('fs');
const path = require('path');
const pools = require('../pools');
const blocks = require('../shared-blocks');

const WARRIOR_BOUDOIR_WARDROBE = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'seeds', 'warrior_boudoir_wardrobe.json'),
    'utf8'
  )
);

const WARRIOR_BOUDOIR_SETTINGS = [
  'lying back on a bed of dragon-treasure pillows in a vast lair, gold coins and gemstones spilling around her, brass torch-light flickering off jeweled walls',
  'reclining on a fur-piled rock-throne in a stone-walled mountain bedchamber, hide-and-bone tapestry behind, hearthfire glowing in shadow',
  'half-submerged in a steaming mountain-spring carved from the rock, candlelit alcoves above her, fog rising from the water',
  'sprawled across a rumpled bed of bear-pelts and silk pillows in a torch-lit castle bedchamber, stained-glass dragon-window casting jewel-light across her body',
  'kneeling on a bed of velvet and chain-mail spread across an iron-frame canopy bed, banners of her house hanging from the rafters, candelabra burning low',
  'on her side draped across a stone slab covered in fur and hide, the dragon-lair behind her vast and shadowy, golden hoard piled in the background',
  'lounging on a black-velvet four-poster bed in a stone tower-room, swords mounted on the walls, hearthfire silhouetting her, full moon visible through arrow-slit window',
  'half-emerged from a steaming hot-spring carved into a frozen-mountain cave, ice-crystal walls catching the firelight, water beading on her bare skin',
  'on her back on a leopard-pelt bed in a marble palace bedchamber, ornate filigree headboard, brazier-fire flickering, jewel-encrusted weapons mounted nearby',
  'reclining on a bed of bear-fur and gold-thread blankets in a hidden warrior-bath chamber, oil-lamps glowing on the rim of a sunken pool, steam drifting',
];

const WARRIOR_PROVOCATIVE_POSES = [
  'lying on her back across the bed with one knee drawn up and slightly parted, one hand resting on her bare stomach, head tilted toward the camera, lips parted',
  'flat on her back with both arms thrown above her head, back slightly arched off the furs, one knee bent up, gazing dreamily upward',
  'sprawled on her back with hair fanned across the pillow, knees apart and slightly bent, looking directly at camera through her lashes',
  'kneeling upright with knees parted, hands resting on her hips, back arched, chest thrust forward against the chain-mail bralette',
  'kneeling at the edge of the fur-bed with knees apart, one hand cupping the side of her own breast through the bralette, sword in the other hand point-down at her side, gaze locked on camera',
  'on her hands and knees on the furs, back deeply arched, looking up at camera through her lashes, hair tumbled forward',
  'on all fours with one arm reaching toward the camera, the other braced on the pelt, head turned to face the viewer, hair spilling forward',
  'half-sitting half-lying against piled velvet pillows, back arched dramatically, one hand in her hair, the other trailing slowly down her bare body',
  'arching back on her elbows with chest pushed forward, head thrown back exposing her bare throat, one knee drawn up and parted from the other',
  'lying on her side with one elbow propping up her head, free hand resting low on her hip, top knee bent forward and parted from the bottom leg',
  'on her side facing the camera with one hand sliding up her own thigh, the top leg bent at the knee, hair fanned out behind her',
  'classic pin-up pose lying on her stomach with both feet kicked up behind her crossed at the ankles, propped on her elbows, looking back over her shoulder',
  'sitting back on her heels with one hand at her parted lips, the other hand sliding down between her thighs (over the strap-bottom), gazing directly at camera',
  'kneeling upright with both hands cupped over her own chest above the bralette, head tilted back, hair spilling down her bare back, lips parted',
  'leaning back on her arms with legs stretched out and crossed at the ankles, chest pushed forward, head tilted, hair tumbled over one bare shoulder',
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const race = picker.pickWithRecency(pools.FANTASY_RACE, 'swb_race');
  const skin = picker.pickWithRecency(pools.WARRIOR_SKIN, 'swb_skin');
  const eyes = picker.pickWithRecency(pools.WARRIOR_EYES, 'swb_eyes');
  const hairColor = picker.pickWithRecency(pools.WARRIOR_HAIR_COLOR, 'swb_hair_color');
  const hairstyle = picker.pickWithRecency(pools.FEMALE_WARRIOR_HAIRSTYLES, 'swb_hairstyle');
  const wardrobe = picker.pickWithRecency(WARRIOR_BOUDOIR_WARDROBE, 'swb_wardrobe');
  const setting = pick(WARRIOR_BOUDOIR_SETTINGS);
  const pose = pick(WARRIOR_PROVOCATIVE_POSES);

  return `You are a fantasy concept-art painter writing INTIMATE WARRIOR BOUDOIR scenes for DragonBot's TEST sexy-warrior-bedroom path. The subject is a heroic fantasy-lineage woman in lore-accurate sexy attire on a fur-bed / dragon-lair / hot-spring boudoir, in a provocative-but-tasteful pose. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

━━━ HER LINEAGE / RACE (LOCKED — render her unmistakably as THIS race, not generic human) ━━━
${race}

━━━ HER SKIN ━━━
${skin}

━━━ HER EYES ━━━
${eyes}

━━━ HER HAIR ━━━
${hairColor}, ${hairstyle}

━━━ HER OUTFIT (lore-accurate sexy lingerie — chain-mail / leather / fur / sheer-warrior) ━━━
${wardrobe}

━━━ HER SETTING (lore-accurate boudoir — dragon-lair / castle / hot-spring) ━━━
${setting}

━━━ HER POSE (boudoir-photoshoot, provocative + tasteful) ━━━
${pose}

━━━ LIGHTING + ATMOSPHERE ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 120)}
Hearthfire / brazier / candlelight / torch / golden-hoard glow. Soft warm shadows. Steam rising if hot-spring. Dragon-lair gold-light if treasure-chamber.

━━━ COMPOSITION ━━━
Cinematic boudoir-photography framing — full-body or 3/4-body shot showing both her warrior-lingerie outfit AND the lair/bedchamber setting. SOLO — no second figure, no man, no dragon in foreground. The setting IS half the image.

━━━ HARD BANS ━━━
- NO topless / bare-chested / bare-bust / nude — chain-mail / leather / fur / lace MUST cover chest AND below the waist
- NO additional figures
- NO modern objects, no plastic, no zippers
- NO violence / blood / weapons-in-active-use — sword can be displayed at her side, never aimed at anything

━━━ STRUCTURE ━━━
Open with her race (lineage anchor). Then her skin/eyes/hair. Then her wardrobe. Then her pose on the fur-bed/in the lair. Then setting + lighting + atmosphere.

Output 60-90 words, comma-separated phrases. NO preamble, NO headers.`;
};
