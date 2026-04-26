/**
 * StarBot cyborg-woman path — half-human half-machine beauty.
 * Ex Machina / Alita energy. Terrifying and magnetic. Hyper-real cinematic 3D.
 * 40% closeup detail shots, 60% full-body action shots.
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

This is a DETAIL SHOT — the camera is close enough to see individual gears spinning, fiber-optic cables pulsing, tiny servo motors adjusting. Fill the frame with her face and the ornate mechanical detail at her neck, jaw, temples, shoulders. The beauty is in the TRANSITION where organic skin meets chrome.`
    : `━━━ FULL-BODY ACTION (NON-NEGOTIABLE — she is DOING something) ━━━
${picker.pickWithRecency(pools.CYBORG_ACTIONS, 'cyborg_action')}

She is caught MID-MOTION in this action. She is NOT standing still, NOT posing, NOT facing camera, NOT modeling, NOT walking towards camera. Her body is engaged — weight shifted, muscles tensed, limbs in motion. The action defines the composition. Camera catches her from the SIDE or at an angle — NOT head-on walking toward the viewer.

━━━ CAMERA / FRAMING ━━━
${picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle')}`;

  return `You are a cinematographer writing a CYBORG WOMAN scene for StarBot — a half-human half-machine being rendered in hyper-real cinematic 3D. She is simultaneously the most beautiful and most terrifying thing in the frame. Output wraps with style prefix + suffix.

━━━ CRITICAL — HER FACE IS HUMAN (NON-NEGOTIABLE) ━━━
Her face is FULLY ORGANIC and VISIBLE — beautiful human or alien-skinned face with real eyes, lips, expressions. NO helmet, NO visor, NO mask, NO faceplate, NO full-head covering. Her face is the one part that stays completely human — that contrast between her pretty organic face and her mechanical body IS the point. You MUST see her face clearly.

━━━ MATCH HER IDENTITY ━━━
READ the character description below and render THAT specific cyborg with OBSESSIVE MECHANICAL DETAIL — every servo joint, every translucent panel, every glowing conduit. Do NOT default to:
- helmet or mask covering her face (her face is ALWAYS bare and organic)
- the same chrome-and-teal cyborg every time (she can be brass, carbon fiber, ceramic, obsidian glass, rose-gold, matte black)
- teal-and-orange lighting on every scene (use the palette below)
- smooth sealed bodysuit or armor plating — she has real SKIN showing, with cyborg elements breaking through at joints, panels, and seams
- "pretty woman with a couple glow patches" — WRONG. The machine breaks through her beauty in MULTIPLE places: translucent panels, exposed chrome joints, circuit veins under skin, mechanical seams. At least 3-4 distinct cyborg reveals visible

━━━ HER IDENTITY ━━━
${sharedDNA.characterBase}

━━━ HER BODY ━━━
- Skin (organic parts only): **${sharedDNA.skin}**
- Body silhouette: **${sharedDNA.bodyType}**
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

━━━ WOMAN AND MACHINE — SKIN SHOWING ━━━
She is a cyborg from any walk of life — assassin, diplomat, surgeon, pilot, scholar, dancer, soldier, engineer, oracle, priestess. Whatever her purpose, she is BEAUTIFUL — striking face, feminine figure, real organic skin. But the human exterior BREAKS in places, revealing ornate machinery beneath:
- TRANSLUCENT SKIN PATCHES where you can see gears, wires, and a glowing reactor core through her body like frosted glass
- SEAMS where organic skin ends in clean lines, showing chrome structure and fiber-optic cables just beneath
- EXPOSED MECHANICAL JOINTS at shoulders, elbows, wrists — ornate and intricate, not industrial
- CIRCUIT-LIGHT VEINS pulsing faintly under organic skin, betraying the machine beneath the beauty
- A POWER CORE glowing from inside her torso, visible through translucent chest or belly sections

She shows SKIN — real organic skin on her face, neck, décolletage, curves. The cyborg reveals are the cracks in the human exterior: a forearm that's clearly chrome and servo beneath the skin, a transparent panel at her sternum showing clockwork, a jaw hinge visible at the temple. She is 60% beautiful woman, 40% ornate exposed machine — and the contrast is what makes her mesmerizing.

NOT a full robot chassis. NOT a skeleton. NOT armor or a bodysuit. NOT head-to-toe plating. She is a beautiful woman with machine underneath — skin and chrome, not a suit of armor.

━━━ BANNED IMAGERY ━━━
NO skulls, NO skeletons, NO floating skulls, NO skull motifs, NO bone imagery. NO full body armor, NO iron man, NO mech suit, NO power armor, NO robotic torso, NO full plating, NO head-on-robot-body. NO high heels, NO stilettos — she wears boots, flats, or bare mechanical feet. Also NO floating objects in the sky, NO random symbolic imagery hovering around her.

━━━ SOLO COMPOSITION ━━━
She is the ONLY figure in the frame. No other person, no companion, no victim, no crowd.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
