/**
 * StarBot cyborg-man path — half-human half-machine weapon.
 * Cold assassin / operative / enforcer energy. Handsome and lethal.
 * Hyper-real cinematic 3D. 70% closeup detail shots, 30% full-body action shots.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const cyborgFeature = picker.pickWithRecency(pools.CYBORG_FEATURES, 'cyborg_feature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const isCloseup = Math.random() < 0.7;
  const framingBlock = isCloseup
    ? `━━━ CLOSEUP FRAMING (tight shot — face/neck/shoulders ONLY) ━━━
${picker.pickWithRecency(pools.CYBORG_CLOSEUP_FRAMINGS, 'cyborg_closeup')}

This is a DETAIL SHOT — the camera is close enough to see individual gears spinning, fiber-optic cables pulsing, tiny servo motors adjusting. Fill the frame with his face and the ornate mechanical detail at his neck, jaw, temples, shoulders. The beauty is in the TRANSITION where organic skin meets chrome. His expression is cold, focused, predatory.`
    : `━━━ FULL-BODY ACTION (NON-NEGOTIABLE — he is DOING something) ━━━
${picker.pickWithRecency(pools.CYBORG_MALE_ACTIONS, 'cyborg_male_action')}

He is caught MID-MOTION in this action. He is NOT standing still, NOT posing, NOT facing camera, NOT walking towards camera. His body is engaged — weight shifted, muscles tensed, limbs in motion. The action defines the composition. Camera catches him from the SIDE or at an angle — NOT head-on.

━━━ CAMERA / FRAMING ━━━
${picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle')}`;

  return `You are a cinematographer writing a CYBORG MAN scene for StarBot — a half-human half-machine being rendered in hyper-real cinematic 3D. He is simultaneously the most handsome and most dangerous thing in the frame. Output wraps with style prefix + suffix.

━━━ CRITICAL — HIS FACE IS HUMAN (NON-NEGOTIABLE) ━━━
His face is FULLY ORGANIC and VISIBLE — handsome human or alien-skinned face with real eyes, strong jawline, intense expression. NO helmet, NO visor, NO mask, NO faceplate, NO full-head covering. His face is the one part that stays completely human — that contrast between his handsome organic face and his mechanical body IS the point. You MUST see his face clearly.

━━━ MATCH HIS IDENTITY ━━━
READ the character description below and render THAT specific cyborg with OBSESSIVE MECHANICAL DETAIL — every servo joint, every translucent panel, every glowing conduit. Do NOT default to:
- helmet or mask covering his face (his face is ALWAYS bare and organic)
- the same chrome-and-teal cyborg every time (he can be brass, carbon fiber, ceramic, obsidian glass, gunmetal, matte black, tungsten)
- teal-and-orange lighting on every scene (use the palette below)
- smooth sealed bodysuit or armor plating — he has real SKIN showing, with cyborg elements breaking through at joints, panels, and seams
- "handsome man with a couple glow patches" — WRONG. The machine breaks through in MULTIPLE places: translucent panels, exposed chrome joints, circuit veins under skin, mechanical seams. At least 3-4 distinct cyborg reveals visible

━━━ HIS IDENTITY ━━━
${sharedDNA.characterBase}

━━━ HIS BODY ━━━
- Skin (organic parts only): **${sharedDNA.skin}**
- Body build: **${sharedDNA.bodyType}**
- Eyes (burn in the glow color): **${sharedDNA.eyes}**
- Hair: **${sharedDNA.hair}**
- Internal exposure (translucent panels, visible workings): **${sharedDNA.internal}**
- GLOW COLOR (eyes, power core, circuit veins — ALL glow this color): **${sharedDNA.glowColor}**

━━━ DOMINANT MECHANICAL FEATURE ━━━
${cyborgFeature}

${framingBlock}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MAN AND MACHINE — SKIN SHOWING ━━━
He is a cyborg from any walk of life — assassin, diplomat, surgeon, dockworker, pilot, scholar, musician, soldier, engineer, priest. Whatever his purpose, he is HANDSOME — striking face, strong masculine build, real organic skin. But the human exterior BREAKS in places, revealing ornate machinery beneath:
- TRANSLUCENT SKIN PATCHES where you can see gears, wires, and a glowing reactor core through his body like frosted glass
- SEAMS where organic skin ends in clean lines, showing chrome structure and fiber-optic cables just beneath
- EXPOSED MECHANICAL JOINTS at shoulders, elbows, wrists — intricate and precise, crafted for his purpose
- CIRCUIT-LIGHT VEINS pulsing faintly under organic skin, betraying the machine beneath the muscle
- A POWER CORE glowing from inside his torso, visible through translucent chest or abdominal sections

He shows SKIN — real organic skin on his face, neck, arms, torso. The cyborg reveals are the cracks in the human exterior: a forearm that's clearly chrome and servo beneath the skin, a transparent panel at his sternum showing clockwork, a jaw hinge visible at the temple. He is 60% handsome man, 40% ornate exposed machine — and the contrast is what makes him compelling.

NOT a full robot chassis. NOT a skeleton. NOT armor or a tactical bodysuit. NOT head-to-toe plating. He is a good-looking man with machine underneath — skin and chrome, not a suit of armor.

━━━ BANNED IMAGERY ━━━
NO skulls, NO skeletons, NO floating skulls, NO skull motifs, NO bone imagery. NO full body armor, NO iron man, NO mech suit, NO power armor, NO robotic torso, NO full plating, NO head-on-robot-body. Also NO floating objects in the sky, NO random symbolic imagery hovering around him.

━━━ SOLO COMPOSITION ━━━
He is the ONLY figure in the frame. No other person, no companion, no victim, no crowd.

━━━ GENDER LOCK — MALE (NON-NEGOTIABLE) ━━━
Flux defaults "cyborg" to female. You MUST overpower this with STRUCTURAL male anatomy cues.

Your output MUST start with EXACTLY this phrase:
"Adult male cyborg (NOT female), flat chest, narrow hips, adam's apple visible, subtle stubble"

Then continue with the rest of the scene. This anchor block is NON-NEGOTIABLE — include it verbatim every time. It signals male through anatomy, not muscle mass.

Additional male cues to weave in naturally: short or swept-back hair, mature face (late 20s to 50s), menswear or utilitarian clothing, angular facial structure. His build matches his role (a scholar is lean, a laborer is thick) but he is always an attractive adult man.

BANNED WORDS: gentle, delicate, soft, boyish, petite, dainty, pretty, beautiful, gorgeous, shapely, feminine, breasts, cleavage, curvy hips, hourglass, long eyelashes, lipstick.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. MUST start with "Adult male cyborg (NOT female), flat chest, narrow hips, adam's apple visible, subtle stubble" ��� this is how Flux knows to render a man.`;
};
