#!/usr/bin/env node
/**
 * GOTHBOT_GOTH_CLOSEUP_ACCESSORY — single jewelry/accessory piece worn
 * in the close-up frame of a gothic dark-seductress portrait. Pendants,
 * chokers, lockets, earrings, brooches, hair-combs, veils, religious-icon
 * jewelry corrupted into dark talismans. Castlevania / Crimson-Peak /
 * Bloodborne / Devil-May-Cry painted register. Female-locked (paired with
 * goth-closeup wardrobe + makeup). Note: per playbook accessory pools can
 * cap at 49-98 — accept natural ceiling if Sonnet exhausts.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_goth_closeup_accessory.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACCESSORY entries for GothBot's goth-closeup path — single jewelry / wearable piece visible in a tight gothic close-up (face + throat + one shoulder) of a hauntingly-beautiful dark-seductress. Each entry is one rich descriptive sentence (15-25 words) naming ONE accessory + its material + how it catches the light.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific accessory (pendant / locket / choker / earring / brooch / hair-comb / veil / coronet / signet ring / crucifix / vial / charm / hairpin / fascinator); (2) names its MATERIAL (jet, amethyst, garnet, ruby, onyx, silver, tarnished brass, ivory, pearl, jade, obsidian, gold); (3) shows how it sits on / catches light against / contrasts with skin. Painted Castlevania / Crimson-Peak / Bloodborne / Devil-May-Cry oil register.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Amethyst-and-silver pendant rests cold against pale collarbone, its facets catching candlelight like trapped violet flame."
"Jet-mourning-locket sealed shut forever, engraved initials worn smooth by decades of sorrowful fingertips."
"Antique-brass-cross suspended on tarnished chain, green oxidation creeping into every engraved thorned vine."
"Blood-ruby-choker cinched tight at throat, each dark stone set in blackened silver claws."
"Single teardrop-pearl earring swaying against jawline, ivory surface veined with faint shadow like cracked porcelain."

━━━ VARIETY MANDATE (distribute across these accessory families) ━━━
- ~4 PENDANTS / NECKLACES (amethyst, garnet, ruby, jet, obsidian, pearl, signet) on chains
- ~3 CHOKERS / NECK-RIBBONS (velvet ribbon with cameo, ruby choker, lace ribbon with crucifix)
- ~3 LOCKETS / MOURNING-JEWELRY (Victorian mourning lockets, hair-locket, photo-locket)
- ~3 EARRINGS (teardrop pearl, chandelier-style, ruby drops, gold hoops, single skull stud)
- ~2 BROOCHES / FASCINATORS / FEATHER ORNAMENTS (jet brooch, mourning-feather)
- ~2 HAIR-COMBS / HAIRPINS / HAIR-ORNAMENTS (jeweled comb, raven-feather pin, silver coronet)
- ~2 VEILS / LACE / NETTING covering face/hair (mourning veil, mantilla, fascinator-veil)
- ~2 CROSSES / RELIGIOUS-ICON JEWELRY (Byzantine cross, gothic crucifix, rosary)
- ~1 RING / SIGNET / TALISMAN visible at jaw/cheek
- ~1 BLOOD-VIAL / POTION CHARM / RELIC pendant
- ~1 HAT / SMALL TOP-HAT / CORONET resting at hair-edge

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 15-25 words per entry.
- ONE accessory per entry.
- MUST name material + lightplay/skin-contact detail.
- Painted oil register — never photoreal, never lifestyle-product-shot.

━━━ BANS ━━━
- NO modern jewelry (no diamond engagement rings, no chunky modern statement pieces).
- NO trendy / 2010s-tumblr-goth ("septum ring", "industrial barbells").
- NO entire outfits / wardrobe items — that's the wardrobe pool.
- NO men's jewelry (this pool is female-coded).
- NO playful / silly / kawaii — DARK painted oil register only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
