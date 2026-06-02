#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_mech_detail.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} MECH-DETAIL entries for a MangaBot mecha-hangar keyframe. Each entry describes the SURFACE / PAINT / MATERIAL TRUTH of the mech (no posture, no setting). Establishes material reality — chipped enamel, oil-streaked plate, weathered war-paint, scratched bare-metal, biomech gloss, etc.

Each entry: 12-22 words. ONE specific surface/material description. Add visual texture cues + identifying marks (kanji decals, squadron emblem, hazard stripes).

DETAIL VARIETY (this 25-entry pool spreads across materials + condition states):
- CHIPPED INDUSTRIAL PAINT (factory-fresh white-blue with peeled-edge wear at joints, rust-orange hazard stripes, kanji decals)
- OIL-STREAKED SILVER-PLATING (combat-tested, bullet-scars across chest plate, oil-rivulets down the abdomen)
- MATTE-CAMO CARAPACE (weathered war-paint in greys + browns, faded squadron emblem on shoulder)
- GLOSSY WHITE-BLUE-RED enamel (Gundam-fresh, freshly-repainted, hangar reflections in the chest)
- SCRATCHED BARE-METAL (exposed rivets, hydraulic-tubing visible along the limbs, no paint left)
- EVA-STYLE RUBBERY BIOMECH-SKIN (vascular venting, magenta-purple gloss, organic seams)
- PATLABOR YELLOW-GREY INDUSTRIAL (oil-stained, work-worn, scuffed shins, hose-bundles visible)
- KNIGHTMARE WHITE-GOLD enamel (Lancelot-style polish, trim gleaming, ceremonial)
- BLACK-AND-GOLD ART-DECO (Big-O matte black with gold-trim, chrome pistons, fedora-shoulder crown)
- TACHIKOMA CYAN-AND-YELLOW (spider-tank composite, single eye-cluster gleaming, panel-seams visible)
- DESERT-CAMO SAND-WORN (sand-blasted matte, faded paint, sun-bleached patches)
- ARCTIC-CAMO ICE-WORN (white with frost-crystal patterning, frozen condensation on joints)
- COMBAT-FRESH SCORCHED (carbon-scoring on chest, burn-marks at shoulder, repair-patches welded on)
- CEREMONY-POLISHED MIRROR (parade-glossy enamel, reflections of the hangar visible in the surface)
- WEATHERED RX-78 white-blue-red (chipped at the knees, hand-pad worn through, factory decal faded)
- HAZARD-STRIPED YELLOW-BLACK (construction-mech style, danger-stripes on every leading edge)
- BIOMECH-CHITINOUS SHELL (insectoid plate, segmented carapace, oil-slick rainbow sheen)
- HEAVY-INDUSTRIAL GREY-GREEN (NERV blast-marks, sigil on the shoulder, restraint-bar wear)
- MILITARY-GREEN OD-PAINT (Vietnam-era weathering, "DO NOT TOW" stencil on the calf)
- PRISTINE FACTORY-FRESH (paper-tags still attached to a wrist-port, factory wax-coat shine)
- BATTLE-DAMAGED with EXPOSED frame (chest-plate missing, cabling and pistons visible underneath)
- DEEP-RED CHAR-AZNABLE CUSTOM (saturated crimson enamel, gold-trim, custom-officer flair)
- TWO-TONE NAVY-GREY MARITIME (ocean-deployment, salt-corrosion at ankle-joints)
- SHRINE-MEETS-MECH (laquered cinnabar panels with kintsugi gold-seams, prayer-tags hanging from antenna)
- CYBERPUNK NEON-ETCHED (panels engraved with glowing kanji, electric-pink rim-light along the seams)

DO write:
- Chipped industrial paint with kanji decals "03" on the shoulder, rust-orange hazard stripes along the shins
- Oil-streaked silver-plating with bullet-scars across the chest plate, hydraulic oil dripping down the abdomen
- Matte-camo carapace in weathered grey-brown war-paint, faded squadron emblem on the shoulder
- Glossy white-blue enamel with red triangles, freshly-respray, hangar arc-lights gleaming off the chest
- Scratched bare-metal with exposed rivets and hydraulic-tubing visible along the limb-joints
- Eva-style rubbery biomech-skin with vascular venting, magenta-purple gloss, organic seams running torso-to-shoulder
- Patlabor industrial yellow-grey paint, oil-stained shins, hose-bundles taped along the inner thigh

DO NOT write:
- Posture / body position (lives in mech_posture)
- Setting walls (lives in hangar_setting)
- Weapons / tools (lives in mech_weaponry_or_tool)
- Atmospheric vapor (lives in steam_or_spark)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
