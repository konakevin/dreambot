#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_outfits_female.json',
  total: 25,
  batch: 10,
  metaPrompt: (
    n
  ) => `You are writing ${n} OUTFIT entries for StarBot's female-explorer path. Each entry is a DENSE phrase (20-35 words) describing her FULL TACTICAL EXPLORER OUTFIT in obsessive material detail.

CRITICAL — NO FRANCHISE NAMES. NEVER write "Mandalorian", "Beskar", "Spartan", "Mjolnir", "N7", "Aeldari", "stillsuit", "Jedi", "Sith", "Dune", "Star Trek", "Mass Effect", "Halo", "Cyberpunk", "Edgerunner", "Netrunner", "Fremen", "Twi'lek", "Vulcan", or any specific franchise / trademark / species term. Describe the AESTHETIC generically using FEATURES only.

AESTHETIC: TACTICAL EXPLORER ready for the unknown. Armored bodysuit + utility pack + hooded cloak / cape / poncho + practical gear. Battle-worn warrior-monk vibes / power-armored super-soldier silhouettes / desert-warrior with breathing tubes and dust wrap / hooded mercenary-explorer / chrome-augmented cyber-tactical. Mysterious. Capable. Cool.

NOT puffy NASA. NOT fashion-show officer-dress. NOT exposed-tease.

Helmets / face-masks / respirators OPTIONAL but COMMON — sometimes covering the face, sometimes pulled-down-to-throat, sometimes pushed-up-on-the-brow.

━━━ ARCHETYPE-MATCHED OUTFITS (enforce variety across ${n}) ━━━

HOODED-CLOAK EXPLORER (5-6) — silhouette-first:
- dark hooded cloak with chrome-and-leather utility-strap chest harness, sleek armored bodysuit beneath, mech-backpack visible above the shoulders
- long flowing dark-grey poncho with copper-trim collar over fitted black bodysuit, breathing respirator at the throat (off), tactical pants tucked into mid-calf boots
- weathered leather-and-fabric cloak over fitted dark armor, hood pulled forward casting face in shadow, glowing edges of the hood-trim subtle cyan
- earth-tone hooded robe over fitted bodysuit beneath, utility belt with multiple pouches, sleek combat boots, sheathed weapon-hilt at the hip
- midnight-blue armored cloak with star-pattern lining glimpsed when it shifts, hood half-back, tactical body-armor underneath, layered boots
- weathered explorer-cape with deep cowl and storm-warrior layered armor underneath, tool-belt at the waist, knee-high boots

ARMORED BODYSUIT (4-5) — mercenary / super-soldier coded:
- sleek black-and-orange armored bodysuit with glowing chest-circuit panels, fitted modular plates at shoulders / forearms / thighs, magnetic boot-clamps, helmet under one arm
- gunmetal full burnished-steel plate-armor with vertical-slit visor helmet (on or off), jetpack mounted on the back, magnetic boots, layered tabard at the hip — race-as-uniform
- black tactical armor with crimson trim along collar and forearms, sleek plate-armor at chest/shoulders/thighs, tactical undersuit visible at joints, mil-grade boots
- heavy power-armor with integrated AI-glow at the temples, hardpoint-armor at every limb, gauntlets glowing soft from internal lights, helmet either on or revealing the face
- desert-warrior bodysuit with dust-toned armor, breathing tubes at the throat, hooded for desert work, sand-cape catching wind

UTILITY-VEST EXPLORER (4-5) — scout / ranger coded:
- tactical scout-vest with dozens of pouches over a fitted bodysuit, tool-belt at the hip, sleek armored greaves, fingerless gloves, optical-scope at the temple
- mech-backpack survival-rig with extending camera-arms over fitted exploration-armor, multi-tool at the hip, holstered pulse-pistol, knee-high boots
- explorer's leather-and-canvas vest over a tactical bodysuit, expedition-medals pinned to one breast, climbing-rope coiled at the hip, tactical boots
- ranger-coded hooded poncho over armored bodysuit, sniper-scope holstered over the shoulder, multi-tool belt, dust-weathered tactical boots
- bounty-hunter coat over fitted body-armor, double bandolier across the chest, holstered pistols, dust-weathered boots, scarf at the throat

EVA / SUIT-UP (3-4):
- sleek black EVA suit with glowing teal piping along the seams, helmet under one arm or pushed-up-on-brow, magnetic boot-clamps, integrated wrist-display
- charcoal-and-orange exploration suit with tinted-visor helmet (on), sleek armor plates at major joints, utility-belt with thigh-storage
- white-on-white deep-space suit with copper-bronze accents, soft visor pushed back to reveal the face, gauntlets folded at the elbows, mech-backpack
- form-fitting vacuum suit with chrome edges, ribbed flexibility-joints, life-support pack on the back, helmet beside on a low shelf

CYBER / AUGMENTED FASHION (3-4):
- chrome-and-black tactical body-armor with subdermal LED-tracery glowing along the spine and forearms, fingerless tactical gloves, knee-high glossy combat boots
- chrome-cyber outfit — fitted graphic crop-armor, high-waisted utility cargos, tactical boots, neon-piped jacket, retractable mantis-blade housings (sheathed)
- black armored bodysuit with chrome-traced cheekbones, plate-armor pieces, smartlink visible at the temple, mil-cyber heavy frame
- razor-edge cyber-armor — deconstructed asymmetric plate-armor, single chrome shoulder-pauldron, technical gloves, knee-high glossy boots

━━━ RULES ━━━
- ABSOLUTELY NO franchise / species / trademark names (no Mandalorian / Beskar / Spartan / Mjolnir / N7 / Jedi / stillsuit / edgerunner / Twi'lek / etc.) — describe AESTHETIC generically using features only
- Each entry is OBSESSIVELY DETAILED — every layer, every plate, every strap
- Aesthetic: TACTICAL / ARMORED / HOODED-SILHOUETTE / READY-FOR-THE-UNKNOWN
- Materials: armored plate, leather, tactical fabric, chrome accents, subtle glowing trim, fitted mesh underneath
- Helmets / face-masks / respirators OPTIONAL but COMMON
- Weapons can be HOLSTERED, sheathed, slung — never in active use
- Capes / cloaks / ponchos / hoods welcome and create SILHOUETTE
- Specific to FEMALE explorers (feminine cuts, fitted bodysuits, ARMORED not lingerie-coded)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. NO franchise names.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
