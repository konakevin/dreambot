#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/warrior_boudoir_wardrobe.json',
  total: 50,
  append: false,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} EXTREMELY-SEXY FANTASY-WARRIOR BOUDOIR WARDROBE entries for DragonBot's TEST sexy-warrior-bedroom path. Each entry: 22-35 words.

━━━ THE VIBE ━━━
Fantasy warrior woman (drow / tiefling / dragonborn / blood elf / dwarf / etc.) in INTIMATE BOUDOIR attire. Lore-accurate (NOT generic Victorian lingerie). Her "outfit" is warrior-coded but stripped down to minimum coverage: chain-mail bralette, leather-strap bikini, fur-and-bone wrap, gauntlets-and-bra-only, sword-belt + thigh-highs. Boudoir-photoshoot in a dragon-lair / treasure-chamber / castle-bedchamber / mountain-hot-spring setting.

━━━ CATEGORIES ~equal distribution ~10 each ━━━

- CHAIN-MAIL BRALETTE — woven chain-mail bra-cups with leather-thong straps, matching chain-mail thong below, leather thigh-garters holding chain-mail thigh-highs, gauntlets at wrists, sword-belt slung low across bare hips.

- LEATHER-STRAP BIKINI — thin black-leather strapping forming a barely-there bralette across her chest, matching leather strap-thong below, brass-buckle boots to mid-thigh, fur-pelt slung over one shoulder.

- FUR-AND-BONE BARBARIAN — fur-trimmed bralette of cured pelt and bone-clasps, matching fur-trim panties with bone-tooth garters, fur-pelt around bare hips, mammoth-tusk neck-torque, bare arms and thighs.

- GAUNTLETS-AND-BRA-ONLY — full plate-gauntlets to the elbow on both arms but ONLY a metal-cup bralette and metal panties otherwise (no armor on torso/legs), sword in hand or belt across bare hips, thigh-high greaves.

- SHEER WARRIOR-PRINCESS — fitted brass-and-jewel bralette with sheer Edwardian-fantasy chemise overlay, sheer silk wrap-skirt slit hip-high, brass-thigh-garter, tiara of fantasy-flower jewels.

━━━ EVERY ENTRY MUST INCLUDE ━━━
1. Outfit type — chain-mail / leather / fur / armor / sheer (warrior-coded, never modern lingerie)
2. EXTREMELY revealing — bare midriff, bare back, bare thighs, bare shoulders, narrow strapping
3. Warrior identity preserved — sword / dagger / chain-mail / fur / bone / bracer / gauntlet visible
4. Coverage minimum: bra-form covering chest, panties/strap-form covering crotch (NEVER full nudity — Flux 1.1 Pro will reject)

━━━ FLUX BANS — DO NOT WRITE (100% rejection) ━━━
- "Topless" / "bare-chested" / "bare bust" / "uncovered chest" / "nude" / "naked" / "nipple"
- Below-the-waist nudity
- Every entry MUST cover both the chest and the crotch with SOMETHING (chain-mail / leather / fur / metal / sheer-with-cup)

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Woven chain-mail bra-cups with leather-thong straps and matching chain-mail thong, leather thigh-garters holding chain-mail thigh-highs, gauntlets at wrists, sword-belt slung low across bare hips"
- "Thin black-leather strapping forming a barely-there bralette, matching leather strap-thong below, brass-buckle thigh-boots, fur-pelt slung over one shoulder"
- "Fur-trimmed bralette of cured wolf-pelt and bone-clasps, matching fur panties with bone-tooth garters, mammoth-tusk neck-torque, bare arms and thighs ready for the cold"
- "Plate-gauntlets to the elbow on both arms with only a polished-steel bra-cup bralette and matching steel panties otherwise, sword in hand, thigh-high steel greaves"
- "Fitted brass-and-jewel bralette with sheer ivory chemise overlay clinging to her warrior body, sheer silk wrap-skirt slit hip-high, brass thigh-garter, fantasy-tiara"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
