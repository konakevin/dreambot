#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_outfits_male.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} OUTFIT entries for StarBot's male-explorer path. Each entry is a DENSE phrase (20-35 words) describing his FULL TACTICAL EXPLORER OUTFIT in obsessive material detail.

CRITICAL — NO FRANCHISE NAMES. NEVER write "Mandalorian", "Beskar", "Spartan", "Mjolnir", "N7", "Aeldari", "desert moisture-recycler", "Jedi", "Sith", "Dune", "Halo", or any specific franchise reference. Describe AESTHETIC generically.

AESTHETIC: TACTICAL EXPLORER ready for the unknown. Armored bodysuit + utility pack + hooded cloak / cape / poncho + practical gear. Battle-worn warrior-monk vibes / power-armored super-soldier silhouettes / desert-warrior moisture-recycler suit / hooded mercenary-explorer / cyber-augmented edgerunner.

Helmets / face-masks / respirators OPTIONAL but COMMON.

━━━ ARCHETYPE-MATCHED OUTFITS (enforce variety across ${n}) ━━━

HOODED-CLOAK EXPLORER (5-6):
- dark hooded cloak with chrome-and-leather utility-strap chest harness, sleek armored bodysuit beneath, mech-backpack above the shoulders
- long flowing dark-grey poncho with copper-trim collar over fitted black bodysuit, breathing respirator at the throat (off), tactical pants tucked into mid-calf boots
- weathered leather-and-fabric cloak over fitted dark armor, hood pulled forward casting face in shadow, glowing edges of hood-trim subtle amber
- earth-tone hooded robe over fitted bodysuit beneath, utility belt with multiple pouches, sleek combat boots, weapon hilt at the hip
- midnight-blue armored cloak with star-pattern lining glimpsed when it shifts, hood half-back, tactical body-armor underneath, layered boots
- austere all-black hooded robe with armored under-plate, gauntlets at the wrists, layered military-cut bodysuit beneath, polished boots

ARMORED BODYSUIT (5-6) — mercenary / super-soldier coded:
- sleek black-and-orange armored bodysuit with glowing chest-circuit panels, fitted modular plates at shoulders / forearms / thighs, magnetic boot-clamps
- gunmetal full burnished-steel plate-armor with T-shaped visor helmet (on or off), jetpack mounted on the back, magnetic boots, layered tabard at the hip
- black tactical armor with crimson trim along the collar and forearms, sleek plate-armor at chest/shoulders/thighs, tactical undersuit visible at joints
- heavy power-armor with helmet either on or revealing scarred face, hardpoint-armor at every limb, gauntlets glowing soft amber, AI-glow at the temples
- desert-warrior moisture-recycler suit with sand-cape over the top, fitted dust-toned armor beneath, water-recycler tubes at the throat, hooded for desert work
- olive-and-ash flak-armor with rebreather mask, regimental-patch at the bicep, slung lasrifle-style rifle, mud-stained tactical boots

UTILITY-VEST EXPLORER (4-5):
- tactical scout-vest with dozens of pouches over a fitted bodysuit, tool-belt at the hip, sleek armored greaves, fingerless gloves, optical-scope at temple
- mech-backpack survival-rig with extending camera-arms over fitted exploration-armor, multi-tool at the hip, holstered pulse-pistol, knee-high boots
- explorer's worn leather-and-canvas vest over a tactical bodysuit, expedition-medals pinned to breast, climbing-rope at hip, tactical boots
- ranger-coded hooded poncho over armored bodysuit, sniper-scope holstered over shoulder, multi-tool belt, dust-weathered tactical boots
- bounty-hunter coat over fitted body-armor, double bandolier across the chest, holstered pistols, dust-weathered boots, scarf at the throat

EVA / SUIT-UP (3-4):
- sleek black EVA suit with glowing amber piping along the seams, helmet under one arm or pushed-up-on-brow, magnetic boot-clamps, wrist-display
- charcoal-and-orange exploration suit with tinted-visor helmet (on), sleek armor plates at major joints, utility-belt with thigh-storage
- white-on-white deep-space suit with copper-bronze trim, soft visor pushed back to reveal stubbled jaw, gauntlets folded at elbows, mech-backpack
- pressure-suit with chrome edges and ribbed flexibility-joints, life-support pack on the back, helmet hooked at the hip

CYBERPUNK / AUGMENTED (3-4):
- chrome-and-black tactical body-armor with subdermal LED-tracery glowing along the spine and forearms, fingerless tactical gloves, mil-spec boots
- edgerunner outfit — fitted technical jacket with neon piping, high-waisted utility cargos, tactical boots, retractable cyber-blade housings
- black armored bodysuit with chrome-traced jaw, plate-armor pieces, smartlink visible at the temple, mil-cyber heavy frame
- razor-edge cyber-armor — deconstructed asymmetric jacket-armor, single chrome shoulder-pauldron, technical gloves, knee-high glossy boots

━━━ RULES ━━━
- ABSOLUTELY NO franchise names — describe aesthetic generically
- Each entry is OBSESSIVELY DETAILED — every layer, every plate, every strap
- Aesthetic: TACTICAL / ARMORED / HOODED-SILHOUETTE / READY-FOR-THE-UNKNOWN
- Materials: armored plate, leather, tactical fabric, chrome accents, glowing trim, fitted mesh underneath
- Helmets / face-masks / respirators OPTIONAL but COMMON
- Weapons HOLSTERED, sheathed, slung — never in active use
- Capes / cloaks / ponchos / hoods welcome
- Specific to MALE explorers (masculine cuts, ARMORED, working-deep-space)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. NO franchise names.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
