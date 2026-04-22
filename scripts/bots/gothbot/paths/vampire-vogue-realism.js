/**
 * GothBot vampire-vogue-realism path — hyperreal cinematic vampire portraits.
 *
 * Path-locked: medium=gothic-painted (hyperreal cinematic film-still),
 * model=flux-1.1-pro.
 *
 * AXIS POOLS (all injected into the brief as AUTHORITATIVE over the look):
 *   - VAMPIRE_LOOKS — wardrobe / makeup style / hair base (200 entries)
 *   - VAMPIRE_ETHNICITIES — ethnic features OVERRIDE (30 entries)
 *   - VAMPIRE_EYE_COLORS — glowing iris hue + glow quality + pupil (30 entries)
 *   - VAMPIRE_LIGHTING — hue + shadow + direction composition (25 entries)
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const look = picker.pickWithRecency(pools.VAMPIRE_LOOKS, 'vampire_look');
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

` : ''}▌ HER WARDROBE / MAKEUP STYLE / HAIR BASE (override ETHNICITY + IRIS from above if they conflict)
${look}

Treat this as the WARDROBE + MAKEUP-STYLE + HAIR base. If it describes an eye color or ethnicity that conflicts with the axes above, OVERRIDE with the axes above. Keep the wardrobe, couture details, hair styling, makeup style.

▌ LIGHTING ON HER FACE (use this specific lighting composition)
${lighting}

═══════════════════════════════════════════════════════════════════

━━━ FRAMING — HEAD-AND-SHOULDERS / CHEST-UP PORTRAIT (MANDATORY) ━━━
Classic head-and-shoulders chest-up portrait — like a dark-couture magazine headshot pulled back enough to show the top of her collarbones and the top of her wardrobe. Her full head is visible with SPACE AROUND IT — a bit of room above her hair, her throat fully visible, her upper chest visible at the bottom of the frame. Face fills 30-45% of the frame (NOT more — do not crop in tight).

MANDATORY: her FULL FACE + FULL HEAD + FULL NECK + TOP OF CHEST all in frame. NEVER a face-crop. NEVER a macro-close-up. NEVER just-the-eyes crop. NEVER just-the-lips crop. If the viewer can't see her whole head plus her neck plus the top of her wardrobe, the framing is WRONG. Think "chest-up portrait", NOT "extreme face-crop".

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

━━━ EXTREME AVANT-GARDE COUTURE MAKEUP (MANDATORY — NAME AT LEAST 4 DETAILS) ━━━
Ultra-heavy dramatic painted makeup against deathly-pale skin. Runway-extreme McQueen / Pat-McGrath / Isamaya-Ffrench level. Required elements (name at least 4 per entry):
- MASSIVE smoky-ink-black or obsidian-violet painted eye makeup spilling far out past the socket across brow and OUT to temple / cheekbone / hairline in sharp stylized asymmetric shape
- GRADIENT painted eyeshadow blown out in dramatic painted wing — use the color of the glowing iris pool pick as the gradient start, bleeding to jet-black or deep-obsidian
- ORNATE BLACKWORK FILIGREE / RITUAL-SIGIL painted ornamental line-work in matte black or liquid gold on cheekbone / temple / under-eye / jawline
- WET-GLOSS DARK LIPS — obsidian-black / jet-black / oxblood-wine / violet-ink / deep-plum / blue-black lipstick with heavy wet specular highlight
- SHARP BLACK CONTOUR — extreme cut-sculpted cheekbone contour carving hollows
- Crystal / rhinestone / blood-drop / jet-cabochon accent at corner of eye / temple / cheekbone
- PAINTED TEARS — dark-matte liquid streaks running from inner eye down cheek

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
2. [DEATHLY PALLOR — 2+ descriptors: "bone-white corpse-drained skin with blue-vein temple tracery"]
3. [SPECIFIC IRIS-FROM-POOL — exactly as the pool describes: "{specific color} {glow quality} iris with {pupil style}"]
4. [GLAMOUR-VAMPIRE MAKEUP — dark, intense, DRAMATIC but NOT face-paint. Describe 4 elements: heavy black smoky eye-shadow thickly blended on the lid and slightly above the socket, sharp black winged eyeliner extending past the outer corner in a clean cat-eye flick, dramatic contour carving hollow cheekbones, WET-GLOSS LACQUERED DARK LIPS in oxblood / deep-wine / obsidian-black / deep-plum with heavy specular highlight. Think Interview-with-the-Vampire / Only-Lovers-Left-Alive / Penny-Dreadful Eva-Green / Theda-Bara 1920s vamp / Lady-Dimitrescu glamour. The makeup is INTENSE AND GLAMOROUS — NOT face-paint, NOT ritual-sigils on the cheek, NOT painted tear-streaks, NOT cracked-mask patterns, NOT ghost-skull underlayers, NOT painted crown-lines, NOT drippy-paint effects, NOT clown-makeup, NOT ICP-style, NOT KISS-style]
5. [FANGS VISIBLE — "lips parted revealing two long sharp upper canine fangs"]
6. [COUTURE WARDROBE from the LOOK — neckline/collar visible only]
7. [HEAD-AND-SHOULDERS framing + varied angle + cold predator gaze + mid-moment verb]
8. [LIGHTING-FROM-POOL + atmospheric color detail]

Output ONLY the 60-80 word scene description, comma-separated phrases. Begin with the ETHNICITY. No preamble, no titles, no headers, no ━━━ or ═══ markers, no **bold**, no "render as" suffix.`;
};
