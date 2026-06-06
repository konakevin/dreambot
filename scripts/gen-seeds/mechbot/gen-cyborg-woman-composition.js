#!/usr/bin/env node
/**
 * CYBORG_WOMAN_COMPOSITION — mixed closeup + full-body framings for the
 * MechBot cyborg-woman path. 60% closeup detail-shots / 40% full-body
 * action-shots — Ex Machina / Alita / Ghost in the Shell register.
 * Human face MANDATORY (always part-cyborg, never 100% organic).
 * 50-75 word entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/cyborg_woman_composition.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} COMPOSITION entries for MechBot's cyborg-woman path — camera/framing for a beautiful + terrifying cyborg-woman (Ex Machina / Alita / Ghost in the Shell register). Title-caps prefix is OPTIONAL — the existing entries open directly with descriptive composition language ("Extreme tight on her left temple-port", "Low-angle hero-shot looking up"). Mirror that opening style.

━━━ THE BAR ━━━
Every entry is ONE camera composition for a part-cyborg part-organic woman. Specifies CAMERA distance/angle + ANATOMICAL FOCUS (temple-port / chrome iris / mechanical brow-ridge / hip-joint panels / spine-segment / chest-cavity reveal) + ORGANIC-MECH JUXTAPOSITION (organic eye catching light + chrome aperture, organic skin + servo-port, soft hair + chrome panel). Always preserves the cyborg-reveal mandate (translucent panels / chrome joints / circuit-veins / power-core / temple-ports visible).

━━━ EXAMPLE PHRASINGS (mirror this register exactly — NO title prefix, descriptive opener) ━━━
"Extreme tight on her left temple-port array filling the left two-thirds of frame — four fiber-optic cables exiting rearward into a translucent jaw-panel where chrome servo-motors pulse faintly visible beneath, her organic eye catching amber corridor-light in the upper-right corner, atmospheric condensation blurring the background."
"Low-angle hero-shot looking up past her knees to full height, mechanical hip-joint panels catching overhead arc-light, organic torso above them shadowed and breathing, chrome shoulder-reveals at either side catching rim-light, the industrial vault ceiling receding dramatically behind her silhouette."
"Three-quarter wide mid-stride through a rain-slicked corridor, her chrome knee-joint and articulated hip-panel visible through translucent skin-patches on her left leg, organic torso twisting mid-step, head angled slightly left with temple-ports catching neon-bleed from receding signage behind her."
"Extreme close on her chrome iris — aperture-rings caught mid-rotation, micro-servo adjustors visible at the inner canthus, a ghostly inverted reflection of the burning cityscape visible across the convex chrome surface, organic eyelid half-lowered at the frame edge."

━━━ VARIETY MANDATE (60% closeup detail-shots / 40% full-body action-shots) ━━━

CLOSEUP DETAIL (~60%):
- ~5 TEMPLE / EAR / JAW PORT (temple-port array / fiber-cable exit / chrome jaw-panel / chrome ear-replacement / micro-servo cluster behind ear / spine-port up the neck / cervical-articulator / jaw-hinge mechanical)
- ~5 EYE / IRIS / ORBIT (chrome iris closeup / aperture-rings mid-rotation / mechanical brow-ridge / orbital-socket sensors / eye-glow rim / dual-aperture pupils / under-eye servo-pistons / one organic one chrome iris)
- ~3 MOUTH / TEETH (mouth half-open chrome teeth / chrome lip-line / tongue-articulator visible / chrome-rim of mouth / palate-port behind teeth)
- ~3 SHOULDER / NECK (chrome shoulder-reveal / collarbone-port / neck-vertebrae chrome-spine / shoulder-blade panel-open / cervical hinge open)
- ~3 HAND / WRIST (chrome wrist-port / mechanical fingertips / fingers half-organic-half-chrome / palm-cavity exposed / wrist-cable bundle / finger-tip lens / sensor-pad palm)
- ~3 HEAD / SCALP (cranial-panel scalp-open / fiber-cables exiting hair / hair-and-chrome roots / cranial-port back-of-head / temple-ridge profile / crown-of-head antenna-cluster)
- ~3 TORSO / CHEST (chest-cavity power-core glow / sternum-port / clavicle-mech / breastplate-panel open / spine-port at base / heart-cavity translucent / circuit-veins ribcage)
- ~3 OTHER ANATOMICAL (hip-joint exposed panel / abdominal-port glow / spine-articulator at base of neck / shoulder-blade hinge / forearm-cable bundle / kneecap chrome-plate exposed)

FULL-BODY / ACTION (~40%):
- ~4 LOW-ANGLE HERO-SHOT (looking up past knees / from-floor looking up / kneeling POV / lying-on-back POV looking up)
- ~3 WIDE MID-STRIDE (mid-stride through corridor / mid-stride rain-slicked street / mid-stride alley / mid-stride server-room / mid-stride cathedral)
- ~3 THREE-QUARTER WIDE (three-quarter wide in lab / three-quarter wide on rooftop / three-quarter wide in temple / three-quarter wide ruins)
- ~3 PROFILE / SILHOUETTE (profile against window / silhouette in fog / profile under arc-light / silhouette against city)
- ~3 OVER-SHOULDER / BACK (over-her-shoulder revealing chrome spine-port / back-of-head reveal / over-shoulder looking-back / hunched-over POV from rear)
- ~3 SEATED / KNEELING (seated on chrome bench cables-loose / kneeling in ritual-pose / cross-legged meditation / seated in chair with one leg mechanical extended)
- ~3 FULL-LENGTH STANDING (full-length silhouette doorway / full-length against industrial wall / full-length on cathedral steps / full-length on rooftop edge)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- NO title-caps prefix — open directly with the descriptive composition language.
- ALWAYS specify CAMERA distance/angle (extreme close / tight / mid-shot / three-quarter wide / low-angle / etc.).
- ALWAYS specify the ANATOMICAL FOCUS or full-body composition.
- ALWAYS include ORGANIC-MECH JUXTAPOSITION (organic eye + chrome aperture / soft hair + chrome panel / organic torso + mechanical hip / etc.).
- ALWAYS include lighting / atmospheric cue (rim-light / arc-light / neon-bleed / fog / condensation / corridor-light).
- Body is 50-75 words, single sentence.

━━━ BANS ━━━
- NO 100% organic — every entry must show some chrome / mechanical / translucent-panel / port / cable / servo.
- NO 100% chrome (no skull / skeleton / full-armor) — human face MANDATORY, organic skin patches REQUIRED.
- NO floating objects / high heels / hovering-debris.
- NO sexualization (no underwear-shot, no bikini-pose) — she is BEAUTIFUL + TERRIFYING, not pin-up.
- NO photoreal name-drops (no photographer / camera-brand).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
