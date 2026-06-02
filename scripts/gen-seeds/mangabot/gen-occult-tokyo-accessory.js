#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_accessory.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} OCCULT-TOKYO ACCESSORY entries — Japanese occult tools/objects the character is wielding or carrying. STRICTLY Japanese vocabulary, NO western occult.

Each 10-18 words. Object + use-detail anchoring character in occult-engagement.

VARIETY:
- 16% OFUDA / PAPER-CHARMS (ofuda paper-talisman pinched between fingers mid-throw / fan of ofuda spread in hand / talisman-strip stuck to palm)
- 14% PRAYER-BEADS / JUZU (juzu prayer-beads wrapped around fist mid-mantra / beads slung over wrist / mala beads gripped at chest)
- 10% KUJI-HAND-SIGNS (fingers locked in rin-pyo-toh kuji-mudra / both hands shaping cursed-energy sign / one hand mid-zai sign)
- 10% CURSED-WEAPON (modernized katana with sigil-engraved blade / cursed-tanto in reverse-grip / wakizashi at hip with talisman-cord)
- 8% KANJI-SIGIL-DRAWN (mid-draw of kanji-sigil in air with glowing-finger / chalk-kanji mid-stroke on ground / sigil-brush mid-paint)
- 8% YOKAI-CONTRACT-SCROLL (rolled spirit-contract scroll mid-unroll / kakemono hanging scroll being held / brush-and-paper for sigil-writing)
- 8% SHIKIGAMI-FAMILIAR (paper-shikigami fluttering near hand / origami-crane-spirit on shoulder / paper-doll familiar floating beside)
- 6% SMARTPHONE-OCCULT (phone with cursed-app glowing on screen / phone mid-photo of spirit / charm-strap dangling from device)
- 6% LANTERN / CHOCHIN (paper-chochin lantern held aloft with kanji glowing / electric-lantern with sigil-glass / pocket-lantern at hip)
- 6% INCENSE / OFFERING (incense-stick mid-burn between fingers / offering-bowl with rice held forward / sake-cup mid-pour for spirit)
- 4% CURSED-MASK (oni-hannya half-mask pushed up on forehead / fox-kitsune-mask in hand / kabuki-spirit-mask at hip)
- 4% SHIMENAWA-ROPE (shimenawa straw-rope coiled around forearm mid-binding / rope-cord wrapped at wrist / sacred-rope dangling with shide-paper)

DO write:
- Ofuda paper-talisman pinched between two fingers mid-throw, kanji glowing pale-cyan
- Juzu prayer-beads wrapped around right fist with mala-thread visible
- Fingers locked in rin-pyo-toh kuji-hand-mudra with faint cursed-energy traces
- Modernized katana with sigil-engraved blade unsheathed in reverse-grip
- Paper-shikigami spirit-familiar fluttering near outstretched palm
- Pocket smartphone glowing with cursed-app interface and dangling charm-strap

DO NOT: weapons-only-no-occult / western tools (pentagrams / wands / crystal-balls / robes) / multiple per entry.

Object MUST keep character actively engaged with the occult, NOT idle.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
