#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_outfit.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SHONEN HERO OUTFIT entries. CHEST-COVERED combat gear in shonen tradition. NEVER shirtless / oiled / bare-chested.

Each entry: 18-30 words. Outfit silhouette + materials + combat-detail + chest-covering item explicitly named.

VARIETY:
- 18% SHINOBI ROBES — black-banded ninja gear with mesh underlayer, flak jacket, leg-bandages
- 16% SCHOOL-HERO UNIFORM — torn gakuran or MHA-style hero costume with bracers
- 14% SAMURAI / DEMON-SLAYER — haori coat + hakama + bandaged chest under tunic
- 12% SORCERER UNIFORM — jujutsu uniform black-cuffed jacket + slacks + tabi-boots
- 10% MARTIAL GI — weighted training gi (torn at sleeves but chest sealed) + sash + sweatband
- 8% SOUL-REAPER — black shihakusho with white obi + sandals + cape
- 8% MECH PILOT SUIT — pressure-suit with chest-plate + helmet at hip + life-line
- 6% EXORCIST ROBES — talisman-trimmed kimono + tabi + offering-pouch
- 4% YAKUZA STREET — leather jacket + dress-shirt + dark slacks + tattoo-trim at collar
- 4% MAGITECH ARMOR — segmented runic plate + arm-gauntlets + tabard

DO write:
- Black-banded shinobi robes with mesh underlayer fully chest-covered, flak jacket with shuriken-pockets, leg-bandages, fingerless leather gloves
- Torn academy gakuran black uniform with chest visibly buttoned, dust-streaked, bracer-wraps at forearms
- Crimson haori coat with sealed chest-tunic underneath, dark hakama, ankle-tabi, sword-sash with kanji-charm
- Jujutsu uniform jacket black with white-cuff lining fully chest-covered, dark slacks, tabi-boots
- Weighted training gi torn at sleeves with chest sealed by tight undershirt, white sash, sweatband

DO NOT — STRICT (R1 reinforced 2026-05-29 after acm-R0 showed leak):
- "shirtless" / "bare-chested" / "oiled" / "sweat-gleaming chest"
- "torn at chest" / "torn open" / "ripped open" / "shredded across torso"
- "open-vest" / "open-front" / "vest-only" / "loose-tied at chest" / "loosely-tied gi"
- "exposed chest" / "exposed abs" / "exposed pec" / "visible muscle definition through gap"
- "deep-V" / "low-cut tunic" / "open haori" / "open kimono"
- "battle-damaged at chest" / "scorched away at chest" / "burned through at torso"
- loincloth / leather-shorts / breechcloth
- Photoreal fabric descriptions. Multiple outfits per entry.

EVERY entry NAMES a chest-covering item explicitly + chest-covering must be INTACT (not torn / open / loose / battle-damaged at chest). Damage can be at SLEEVES, SHOULDERS, HEM, BACK — never at the chest. Even mid-combat the chest stays fully sealed.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
