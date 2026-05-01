/**
 * GothBot vampire-girls-2 — modern stylized fantasy vampire character art.
 *
 * AESTHETIC TARGET (Kevin's reference screenshots): stylized dark-fantasy
 * vampire character art / dark gothic horror splash painting / dramatic
 * heavy-shadow stylization. NOT old-master oil portrait, NOT aged canvas,
 * NOT museum patina, NOT smooth-digital-art, NOT pretty-girl-in-dress.
 *
 * BRIEF STRUCTURE: 5 sections. THE VAMPIRE is ONE UNIFIED paragraph weaving
 * ethnicity + makeup + glow + hair + wardrobe + posture into a single
 * coherent vampire description — no separate fields for Sonnet to summarize.
 */

const pools = require('../pools');

const COMPOSITIONS = [
  'bust portrait, frontal, head and shoulders centered, eyes meeting camera with confident predator gaze',
  'three-quarter bust, face turned 30-40 degrees, dramatic confident pose',
  'bust at the left third, face turned right, dramatic backdrop unfolding',
  'chin-up heroic bust, head tilted up, throat exposed, regal posture',
  'window-framed bust by a tall arched gothic window, dramatic backlight',
  'over-shoulder turn-back, face in 3/4 looking past camera with cold confidence',
];

// MENACE_FEATURES — HEAVY theatrical-vampire-club-goth-stage-makeup. NOT
// subtle, NOT model-light. Caked-on dramatic dark vampire makeup is the
// PRIMARY visual character — heavy blackened eye-sockets blown across the
// orbital bone, painted-on dark eyebrows, theatrical blood-red or jet-black
// matte lips, heavy contour. Plus the GLOWING inhuman iris radiating light.
// DEAD-BEAUTIFUL DEMONIC vampire formula:
//   1. DEAD-PALE corpse-skin (pallid / blue-tinted / ash-grey — undead, NOT alive-healthy)
//   2. HEAVY DARK GOTH MAKEUP (caked-on jet-black eyeshadow, dark brow, oxblood/jet-black lips)
//   3. BEAUTIFUL bone structure preserved (she's a beautiful corpse, NOT a skeleton)
//   4. DEMONIC EDGE (one inhuman tell: single fang visible at lip, clawed fingertip, predator pupil)
//   + glowing eye color radiating light
const MENACE_FEATURES = [
  'glowing crimson eyes radiating inner red light, HEAVY caked-on jet-black eyeshadow piled thick on the lid, severe dark eyebrow, oxblood matte lips, DEAD-PALE corpse-blue-tinted skin, single sharp fang visible at her lip',
  'glowing sapphire-blue eyes radiating cold luminous light, HEAVY thick jet-black smoky-eye on the lid, severe dark brow, oxblood matte lips, ASH-GREY corpse-pallid skin, single sharp fang visible at her lip',
  'glowing amber-gold eyes with hourglass-slit pupils radiating molten light, HEAVY caked-on charcoal eyeshadow, severe dark eyebrow, blood-red matte lips, DEAD-PALE alabaster corpse-skin, clawed black-lacquered fingertips',
  'glowing fel-green witch-fire eyes radiating green light, HEAVY thick jet-black eyeshadow piled on the lid, severe dark brow, jet-black matte lips, ASH-GREY corpse-skin with faint translucence, single sharp fang at her lip',
  'glowing magenta-red eyes radiating crimson inner light, HEAVY caked-on dark-violet eyeshadow, severe dark brow, blood-red matte lips, DEAD-PALE blue-tinted corpse-skin, predator-still gaze',
  'glowing void-violet eyes with no whites (full void-black sclera with iris centers radiating violet light), HEAVY thick jet-black smoky-eye, severe dark brow, jet-black matte lips, ASH-PALE corpse-skin',
  'glowing crimson eyes with hourglass-slit pupils radiating predator light, HEAVY caked-on jet-black eyeshadow piled thick, severe dark brow, oxblood matte lips, DEAD-PALE alabaster corpse-skin, two sharp fangs visible against the lip',
  'glowing necrotic-white eyes radiating pale luminescence, HEAVY thick charcoal eyeshadow on the lid, severe dark brow, blood-red matte lips, ASH-GREY corpse-skin with sickly undertone, demon-slit pupil',
  'glowing ember-gold eyes with vertical-slit demon pupils radiating molten light, HEAVY caked-on dark-violet eyeshadow, severe dark brow, oxblood matte lips, DEAD-PALE corpse-skin',
  'glowing electric-purple eyes radiating violet light, HEAVY thick jet-black eyeshadow piled on the lid, severe dark brow, jet-black matte lips, DEAD-PALE corpse-blue-tinted skin, single fang visible at her lip',
  'glowing mercury-silver eyes with star-shaped pupils radiating unnatural light, HEAVY caked-on jet-black eyeshadow, severe dark brow, oxblood matte lips, DEAD-PALE corpse-skin, clawed fingertips',
  'glowing cyan-deep-ocean eyes with hourglass-slit pupils radiating blue inner light, HEAVY thick jet-black eyeshadow on the lid, severe dark brow, jet-black matte lips, ASH-PALE corpse-skin',
  'glowing bright-yellow eyes radiating molten light visible across a dark room, HEAVY caked-on charcoal eyeshadow, severe dark brow, blood-red matte lips, DEAD-PALE corpse-skin, single sharp fang at the lip',
  'glowing violet eyes with thin gold-rim iris radiating inner light, HEAVY thick jet-black eyeshadow piled on the lid, severe dark brow, oxblood matte lips, ASH-GREY corpse-pallid skin, demon-slit pupil',
  'glowing crimson eyes radiating visible inner fire, HEAVY caked-on jet-black eyeshadow, severe dark brow, oxblood matte lips, DEAD-PALE corpse-skin, two sharp upper fangs unmistakably visible against the lip',
  'glowing rose-quartz eyes radiating luminous pink light, HEAVY thick charcoal eyeshadow on the lid, severe dark brow, jet-black matte lips, DEAD-PALE corpse-blue-tinted skin, demon pupil',
  'glowing emerald eyes with hourglass-slit pupils radiating green inner light, HEAVY caked-on jet-black eyeshadow, severe dark brow, blood-red matte lips, ASH-PALE corpse-skin, single fang visible',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // Pool-first with inline fallback. Pools were Sonnet-scaled to 100 entries
  // each, calibrated to the inline reference entries that drove the QA-loop
  // wins. Keep inline arrays as safety fallback.
  const composition = pools.VAMPIRE_COMPOSITIONS && pools.VAMPIRE_COMPOSITIONS.length > 0
    ? picker.pickWithRecency(pools.VAMPIRE_COMPOSITIONS, 'vg2_composition')
    : COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)];
  const menaceFeature = pools.VAMPIRE_MENACE_FEATURES && pools.VAMPIRE_MENACE_FEATURES.length > 0
    ? picker.pickWithRecency(pools.VAMPIRE_MENACE_FEATURES, 'vg2_menace')
    : MENACE_FEATURES[Math.floor(Math.random() * MENACE_FEATURES.length)];

  const scenario = pools.VAMPIRE_SETTINGS && pools.VAMPIRE_SETTINGS.length > 0
    ? picker.pickWithRecency(pools.VAMPIRE_SETTINGS, 'vg2_setting')
    : 'a vast moonlit cathedral nave with massive rose window blazing crimson light';
  const killerDetail = pools.VAMPIRE_KILLER_DETAILS && pools.VAMPIRE_KILLER_DETAILS.length > 0
    ? picker.pickWithRecency(pools.VAMPIRE_KILLER_DETAILS, 'vg2_killer_detail')
    : 'an ornate vampire-queen crown of dark gold and obsidian set high on her hair';
  const hair = pools.VAMPIRE_HAIR && pools.VAMPIRE_HAIR.length > 0
    ? picker.pickWithRecency(pools.VAMPIRE_HAIR, 'vg2_hair')
    : `${picker.pickWithRecency(pools.HAIR_COLORS, 'vg2_hair_color')}, ${picker.pickWithRecency(pools.FEMALE_HAIRSTYLES, 'vg2_hairstyle')}`;
  const wardrobe = picker.pickWithRecency(pools.VAMPIRE_WARDROBE, 'vg2_wardrobe');
  const archetype = picker.pickWithRecency(pools.VAMPIRE_ARCHETYPES, 'vg2_archetype');
  const ethnicity =
    pools.VAMPIRE_ETHNICITIES && pools.VAMPIRE_ETHNICITIES.length > 0
      ? picker.pickWithRecency(pools.VAMPIRE_ETHNICITIES, 'vg2_ethnicity')
      : null;
  const lightingPool =
    pools.VAMPIRE_LIGHTING && pools.VAMPIRE_LIGHTING.length > 0
      ? pools.VAMPIRE_LIGHTING
      : pools.LIGHTING;
  const lighting = picker.pickWithRecency(lightingPool, 'vg2_lighting');

  // UNIFIED VAMPIRE DESCRIPTION — single paragraph weaving every axis. Sonnet
  // reads this as ONE coherent description of the vampire, not a list of
  // separate fields. The glow-anchor sentence at the end is a redundant
  // emphasis that survives Sonnet compression — duplicates the glow signal
  // so even if Sonnet compresses the menace_feature's first mention, the
  // second one lands.
  const ethnicityClause = ethnicity ? `${ethnicity} ` : '';
  const unifiedVampire = `A confident ${ethnicityClause}vampire woman with ${hair}, ${menaceFeature}. She wears ${wardrobe}. Her eyes are visibly GLOWING with luminous unnatural inner light radiating outward — this glow is the most important visual element and must be unmistakably rendered, not a subtle tint.`;

  return `You are writing ONE Flux prompt for a horrifyingly beautiful vampire portrait. Output ONLY the prompt — comma-separated phrases, 65-90 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE anything else about her face or wardrobe or setting. They are CENTER STAGE.

1. GLOWING eyes — her eyes glow with inhuman color, light radiating outward from the iris. Words "glowing" + "radiating" (or "casting light") MUST appear.
2. DARK DRASTIC eye shadow AND liner — heavy, blown out, dramatic gothic vampire makeup CAKED ON THE EYES. Words "heavy" + "dark" + "smoky-eye" + "sharp dark eyeliner" (or equivalent: "blown-out black eyeshadow" + "thick kohl eyeliner") MUST appear.

Open your prompt with the eye + makeup description in this format (or equivalent):
"[color] glowing eyes radiating inhuman light, heavy blown-out black smoky-eye with sharp dark kohl eyeliner, ..."

THEN describe the rest (skin, lips, hair, wardrobe, setting). The eyes-and-makeup are the OPENER and the focal point.

ALSO BANNED: NO elf ears. NO pointed ears. NO fantasy-creature ear shapes. She is human-shaped.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


━━━ 1. THE SCENE (gothic backdrop behind her) ━━━
${scenario}
Composition: ${composition}.
Lighting: ${lighting}.

━━━ 2. THE VAMPIRE (one unified description — render her exactly this way) ━━━
${unifiedVampire}

She is a DEAD-PALE corpse-vampire with HEAVY DARK GOTH MAKEUP — beautiful bone structure preserved BENEATH the deadness, but the skin reads as undead-corpse-pale (NOT alive-pretty), the makeup is HEAVY caked-on gothic (NOT subtle), the eyes are GLOWING with inhuman color, and a DEMONIC tell (visible fang, clawed fingertip, slit pupil) marks her as not-human. She is human-shaped — NO elf ears, NO pointed ears, NO fantasy-creature features beyond the vampire markers. She is BEAUTIFUL but DEAD — almost a demon. Expression both seductive and terrifying — ancient and inhuman presence. Her face is the focal point — bust framing 40-50% of frame.

━━━ 3. THE HERO ELEMENT (the unforgettable focal piece on her) ━━━
${killerDetail}. Render this clearly and prominently.

━━━ 4. PALETTE & MOOD ━━━
${sharedDNA.scenePalette}. ${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 120)}

The painting feels DARK, OMINOUS, GOTHIC. Heavy shadow dominates. Single dramatic candlelit key-light cuts through deep velvet darkness. Atmosphere heavy with dread.

━━━ 5. HARD BANS ━━━
NO second figures, NO animals, NO blood splatter, NO bodies, NO clown-stripe painted color streaks beneath the eye, NO ritual face-paint stripes, NO photoreal/cinematic/film-still aesthetic, NO modern fashion photography, NO bare black-void background — the gothic setting MUST be visible behind her, NO bright cheerful colors.

━━━ OUTPUT ━━━
Write 65-90 words, comma-separated phrases. The unified vampire description in section 2 is the primary face description — preserve the HEAVY MAKEUP, GLOWING EYE, DEAD-PALE skin, and DEMONIC tell language unmistakably. The gothic setting fills the rest of the frame as the dramatic painted backdrop. NO preamble, NO headers.`;
};
