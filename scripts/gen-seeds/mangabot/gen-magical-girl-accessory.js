#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_accessory.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} MAGICAL-GIRL ACCESSORY entries — wands / scepters / talismans / mascot-charms / magical-instruments. Her signature object.

Each entry: 12-22 words. Names the accessory + ornate material detail + magical-aura cue.

VARIETY:
- 22% WAND/SCEPTER (crystal-tipped wand / star-shaped scepter / heart-topped wand / moon-crescent wand / flower-bud wand / butterfly-wing wand)
- 16% TALISMAN/AMULET (heart-locket / star-pendant / crystal-orb necklace / rune-engraved choker / clow-card-deck case)
- 14% MASCOT-FAMILIAR-ITEM (talking-cat brooch / floating-fairy ring / mascot-pet companion bag / fox-spirit charm)
- 12% TIARA/CROWN (crescent-moon tiara / star-burst tiara / floral-crown / cosmic-circlet)
- 10% INSTRUMENT (mic-wand / harp-staff / bell-staff / lyre-talisman / tarot-deck)
- 8% WEAPON-CUTE (parasol-sword / bow-staff hybrid / heart-shield / star-shuriken set / ribbon-whip)
- 8% RING/GLOVE-MAGIC (transformation-ring / wand-gauntlet / gem-set glove / cyber-gauntlet)
- 6% BOOK/SCROLL (grimoire / spell-tome / rune-scroll / contract-book)
- 4% CRYSTAL/ORB (floating crystal-shard / orb-of-power / prism-jewel)

DO write:
- Crystal-tipped wand with rose-gold filigree handle and rotating ribbon-trail, emerald-pink aura blooming
- Heart-shaped locket pendant on silver chain, opening to reveal floating crystal-shard inside
- Talking-cat mascot-familiar on shoulder with star-jewel on forehead and crescent-mark
- Crescent-moon tiara with cabochon-pearls and trailing-ribbon attachment catching star-light
- Mic-wand with stage-sparkle base and color-shifting LED, mid-song-spell sparkle drifting

DO NOT write:
- Bare weapons without magical signature
- Photoreal jewelry catalog descriptions
- Multiple accessories per entry — ONE per entry

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
