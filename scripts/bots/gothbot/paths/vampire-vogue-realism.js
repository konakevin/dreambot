/**
 * GothBot vampire-vogue-realism path — hyperreal cinematic vampire portraits.
 *
 * Path-locked: medium=gothic-painted (hyperreal cinematic film-still),
 * model=flux-1.1-pro.
 *
 * AXIS POOLS (all injected into the brief as AUTHORITATIVE over the look):
 *   - VAMPIRE_ARCHETYPES — who she IS (role/age/energy/story) (25 entries)
 *   - VAMPIRE_WARDROBE — chest-up visible outfit (25 entries)
 *   - VAMPIRE_MAKEUP — avant-garde makeup looks (25 entries)
 *   - VAMPIRE_CANDID_MOMENTS — micro-actions caught mid-moment (25 entries)
 *   - HAIR_COLORS + FEMALE_HAIRSTYLES — shared character pools
 *   - VAMPIRE_ETHNICITIES — ethnic features OVERRIDE (30 entries)
 *   - VAMPIRE_EYE_COLORS — glowing iris hue + glow quality + pupil (30 entries)
 *   - VAMPIRE_LIGHTING — hue + shadow + direction composition (25 entries)
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const CROPS = [
  'SINGLE EYE DOMINANT — one glowing eye fills 50-60% of the frame, the other eye is in deep shadow or cropped out entirely. We see: one massive glowing iris + cheekbone + side of nose + part of lips. The visible eye IS the image.',
  'BOTH EYES — face framed edge-to-edge showing both glowing eyes with nose between them, cropped at forehead and chin. Classic macro face-portrait.',
  'HALF-FACE SHADOW — one half of her face is lit, the other half in near-total darkness. The lit side shows one glowing eye + cheekbone + half of lips. Split lighting.',
  'DIAGONAL TILT — face at a strong diagonal angle across the frame, forehead in one corner, chin in the opposite. Both eyes visible but at dramatic angle.',
  'EXTREME LOW ANGLE — looking UP at her from below chin level. Both glowing eyes looking down at camera. Jawline and nostrils prominent. Menacing.',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const crop = CROPS[Math.floor(Math.random() * CROPS.length)];
  const archetype = picker.pickWithRecency(pools.VAMPIRE_ARCHETYPES, 'vampire_archetype');
  const wardrobe = picker.pickWithRecency(pools.VAMPIRE_WARDROBE, 'vampire_wardrobe');
  const makeup = picker.pickWithRecency(pools.VAMPIRE_MAKEUP, 'vampire_makeup');
  const candidMoment = picker.pickWithRecency(pools.VAMPIRE_CANDID_MOMENTS, 'vampire_candid_moment');
  const hairColor = picker.pickWithRecency(pools.HAIR_COLORS, 'vampire_hair_color');
  const hairstyle = picker.pickWithRecency(pools.FEMALE_HAIRSTYLES, 'vampire_hairstyle');
  const facialFeatures = picker.pickWithRecency(pools.FACIAL_FEATURES, 'vampire_facial_features');
  const lightingPool =
    pools.VAMPIRE_LIGHTING && pools.VAMPIRE_LIGHTING.length > 0
      ? pools.VAMPIRE_LIGHTING
      : pools.LIGHTING;
  const lighting = picker.pickWithRecency(lightingPool, 'vampire_lighting');
  const eyeColor =
    pools.VAMPIRE_EYE_COLORS && pools.VAMPIRE_EYE_COLORS.length > 0
      ? picker.pickWithRecency(pools.VAMPIRE_EYE_COLORS, 'vampire_eye_color')
      : null;
  const ethnicity =
    pools.VAMPIRE_ETHNICITIES && pools.VAMPIRE_ETHNICITIES.length > 0
      ? picker.pickWithRecency(pools.VAMPIRE_ETHNICITIES, 'vampire_ethnicity')
      : null;
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing ONE hyperreal cinematic vampire-portrait scene description for GothBot's vampire-vogue-realism path. Hyperreal film-still quality, photographic skin fidelity, but surreal-glowing-eye + extreme-makeup + deathly-pale details carry the "something is wrong with her" unreal tension.

TASK: write ONE vivid close-portrait scene description (60-80 words, comma-separated phrases). The output will be wrapped with style prefix + suffix — you produce ONLY the middle scene section.

═══════════════════════════════════════════════════════════════════
THE FOUR AUTHORITATIVE AXES — USE THESE SPECIFIC PICKS, DO NOT INVENT
═══════════════════════════════════════════════════════════════════

${ethnicity ? `▌ HER ETHNIC / CULTURAL FEATURES (BAKE IN AS THE CHARACTER'S IDENTITY)
${ethnicity}

Use THESE specific features — bone structure, eye shape, nose, lip shape, hair texture, underlying skin undertone. This is who she is. Her vampire-pallor washes her skin corpse-pale, but her UNDERLYING ethnic features + undertone show through. DO NOT default to a generic face. NAME her ethnicity explicitly in the output.

` : ''}${eyeColor ? `▌ HER GLOWING IRIS (USE THIS EXACT COLOR + GLOW + PUPIL — NO OTHER)
${eyeColor}

Use THIS specific iris color + glow quality + pupil style. DO NOT swap to a different color. DO NOT use "crimson" or "amber" or "ember" if the pool says something else. NAME the specific iris color explicitly in the output.

` : ''}▌ WHO SHE IS (her archetype — bake this into her ENERGY, not her appearance)
${archetype}

This is her STORY, not her look. Let this color her gaze, her posture, her energy — an ancient aristocrat carries herself differently than a feral newborn.

▌ HER FACE STRUCTURE (use these EXACT bone structure / proportions — this is what makes her face UNIQUE)
${facialFeatures}

Render THIS specific face geometry. This determines her jawline, nose shape, cheekbone prominence, brow, chin, lip shape. Do NOT default to a generic pretty face. If it says "crooked nose" or "square jaw" or "hollow cheeks" — THAT is what she looks like.

▌ HER HAIR
Color: ${hairColor}
Style: ${hairstyle}

▌ HER WARDROBE (chest-up visible only — neckline / collar / shoulders)
${wardrobe}

▌ HER MAKEUP (extreme avant-garde — Pat-McGrath / McQueen / Isamaya-Ffrench level)
${makeup}

▌ WHAT SHE'S CAUGHT DOING (candid micro-moment — NOT a pose)
${candidMoment}

Use this as the mid-moment verb/action. She was caught doing THIS when the camera fired.

▌ LIGHTING ON HER FACE (use this specific lighting composition)
${lighting}

═══════════════════════════════════════════════════════════════════

━━━ FRAMING — THIS SPECIFIC CROP IS MANDATORY ━━━
${crop}

This is a MACRO close-up. Her face fills the ENTIRE frame. Wet rain-soaked skin with water droplets visible. Dark atmosphere pressing in from edges. NEVER a full head-and-shoulders shot. NEVER space above her head. NEVER her neck or chest visible. The face IS the entire image. USE THE CROP DESCRIBED ABOVE EXACTLY.

MANDATORY VARIED ANGLE — rotate per entry:
- 3/4 profile turn
- FULL SIDE PROFILE
- LOOKING-OVER-HER-SHOULDER (chin tucked over shoulder)
- CHIN-TILTED-UP (low-angle looking up at her)
- CHIN-TILTED-DOWN (high-angle, she looks up through lashes)
- LOOKING-PAST-CAMERA (eyes focused off-frame)
- HEAD-COCKED at unnaturally still angle
- Rarely: straight-on centered

━━━ CANDID — NOT POSING ━━━
She is caught mid-moment — mid-turn / mid-exhale / mid-tilting-her-head / mid-looking-over-her-shoulder / mid-glancing-up / mid-small-sigh. NEVER glamour-shot. NEVER magazine-cover-centered-pose. NEVER fashion-shoot-staged.

━━━ FANGS ARE MANDATORY — SHARP FANGS VISIBLE IN EVERY RENDER ━━━
NON-NEGOTIABLE. Her lips are PARTED with TWO CLEARLY VISIBLE SHARP ELONGATED UPPER CANINE FANGS extending noticeably past her lower lip. Explicitly name the fangs: "lips parted revealing sharp elongated upper fangs" / "two long ivory upper canines extending past her lower lip" / "fang-tips catching the key light as her mouth sits slightly open" / "an unnaturally-long upper canine grazing her lower lip".

Her mouth is parted because she is mid-exhale, mid-cold-breath, mid-lip-lick, mid-small-smirk, mid-quiet-snarl, mid-tongue-grazing-fang, mid-pre-yawn. ALWAYS lips parted, ALWAYS fangs unmistakable.

━━━ DEATHLY VAMPIRE PALLOR (MANDATORY) ━━━
Her skin reads DEAD. Use multiple descriptors: corpse-white / bone-white / bloodless / deathly-pale / drained-of-blood / ashen-ivory / dead-white / porcelain-corpse / moonstone-pallid / paper-pale / ghost-white / waxy-translucent / blue-tinged / violet-tinted / cold-corpse-blue-tinge. Pale enough that faint blue veins show at temples. DEAD-LOOKING-BUT-ALIVE — skin reads corpse, eyes glow ancient. Name at least 2 pallor descriptors explicitly.

━━━ MAKEUP — USE THE POOL PICK AS THE AUTHORITATIVE LOOK ━━━
Render the MAKEUP-FROM-POOL entry FAITHFULLY — it describes a SPECIFIC look with specific colors, specific techniques, specific finish. DO NOT override it with generic "heavy black smoky eye." If the pool says "silent-film enormous eyes ringed in heavy black" that's DIFFERENT from "smeared kohl reapplied in layers" which is DIFFERENT from "bruise-tones in plum and green-black."

The makeup should look WET — rain-soaked, dripping slightly, lived-in. But the SPECIFIC look comes from the pool, not from a default.
NEVER face-paint patterns, NEVER clown/ICP, NEVER ghost-skull underlayers.

━━━ EVIL PREDATOR GAZE ━━━
Cold, knowing, unblinking, unnaturally still. The gaze reads like something ancient deciding whether to bother with you. NOT flirty. NOT doe-eyed. NOT seductive-inviting. Predator-bird-calm. Name her gaze quality explicitly: "cold unblinking predator stare" / "unnaturally still knowing gaze" / "empty ancient stare" / "looking through you with bored menace".

━━━ ABSOLUTE SOLO ━━━
ONE WOMAN. NO ONE ELSE. NO male figures. NO second figure. NO hand of another person. NO victim in frame. NO background crowd. NO hinted silhouette. She is alone.

━━━ HARD BANS ━━━
- NO devil horns / horn-headpieces / horn-crowns
- NO gore, NO explicit blood-splatter, NO visible wound, NO throat-bite-in-frame
- NO anime-smooth / YA-fantasy-prom-queen / Halloween-costume read
- NO pentagrams, NO satanic iconography
- NO magazine-cover-polish / Steven-Meisel-editorial-photo look

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ STRUCTURE — START WITH ETHNICITY, FOLLOW EXACT ORDER ━━━

Your output MUST start with the ETHNICITY from the pool (first 5-10 words). Then the rest follows. Example opening: "Korean vampire woman with delicate oval face and monolid almond eyes, bone-white corpse-drained skin..." — the ethnicity name + features ANCHORS Flux before anything else.

Write in this exact order (do NOT deviate):
1. [ETHNICITY-FROM-POOL — 5-10 words at the very start: "{region} vampire woman with {bone structure} {eye shape} {nose} {lips}"]
2. [FACIAL-FEATURES-FROM-POOL — her unique face geometry: jaw, nose shape, cheekbone prominence, brow, chin]
3. [DEATHLY PALLOR with COLD BLUE-TEAL CAST — "corpse-pale skin with cold blue-teal color grade, wet rain-soaked, water droplets on cheekbone"]
4. [SPECIFIC IRIS-FROM-POOL — MASSIVE GLOWING with fire-like volcanic inner detail, radiating light onto surrounding skin]
5. [MAKEUP-FROM-POOL — render the SPECIFIC look faithfully, make it WET and rain-soaked]
6. [HAIR — color + style from pools, wet rain-soaked]
7. [FANGS — if visible in crop, "sharp upper fangs visible through parted lips"]
8. [USE THE MANDATORY CROP from above — compose EXACTLY as described]
9. [LIGHTING-FROM-POOL — low-key, glowing eye as primary light source, most of face in shadow]

Output ONLY the 60-80 word scene description, comma-separated phrases. Begin with the ETHNICITY. No preamble, no titles, no headers, no ━━━ or ═══ markers, no **bold**, no "render as" suffix.`;
};
