#!/usr/bin/env node
/**
 * GOTHBOT_GOTH_CLOSEUP_MAKEUP — visible makeup look in the tight close-up
 * of a gothic dark-seductress. Heavy black eyeliner, smoky kohl, dark lip
 * colors, dramatic brows, eyeshadow palettes that read painted-oil (not
 * modern beauty-blogger). Castlevania / Crimson-Peak / Bloodborne /
 * Devil-May-Cry painted register. Female-locked.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_goth_closeup_makeup.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MAKEUP entries for GothBot's goth-closeup path — the visible makeup look on a hauntingly-beautiful dark-seductress in a tight gothic close-up. Each entry is one rich descriptive sentence (18-30 words) naming THE EYE LOOK + LIP COLOR + ONE accent detail (brow, blush, glitter, smudge).

━━━ THE BAR ━━━
Every entry: (1) names ONE specific eye look (sharp winged liner, smudged smoky kohl, smoldering cut-crease, bare-with-kohl, glittered-black, jewel-tone shadow); (2) names ONE specific lip color (blood-red, matte black, deep burgundy, plum, blackberry, oxblood); (3) names ONE accent detail (brow shape, blush absence, glitter speck, smear, dripping mascara). Painted oil register — never modern beauty-vlogger / Instagram-makeup.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Razor-sharp black eyeliner extended into aggressive wings, blood-red lip stained like a dare, heavy mascara spiked to absolute extremes."
"Smudged charcoal smoke bleeding deliberately past her lash line, matte black lip chosen cold and final, dramatic arched brow commanding silence."
"Deep burgundy cut-crease sliced with surgical precision, black-lined waterline drowning in darkness, matching blood-plum lip painted like a slow threat."
"Bare porcelain skin untouched except for devastatingly smudged kohl smoke pooling at her eyes, every shadow placed with ruthless intention."
"Black glitter crushed across heavy-lidded smoky eyes, pencil-thin brow arched in permanent skepticism, dark plum lip sealed matte and merciless."

━━━ VARIETY MANDATE (distribute across these makeup register families) ━━━
- ~4 SHARP-WINGED LINER + DARK LIP (cat-eye + matte black / blood-red / oxblood)
- ~4 SMOKY KOHL / SMUDGED CHARCOAL (bleeding past lash line, soft drama)
- ~3 CUT-CREASE EYESHADOW (burgundy, plum, jewel-tone cut-crease + matching lip)
- ~3 MATTE BLACK / OXBLOOD / BLOODY LIPS (the lip is the focal point)
- ~2 BARE-FACE + INTENSE EYES ONLY (porcelain skin, no blush, kohl only)
- ~2 GLITTERED / METALLIC ACCENT (crushed black glitter, silver-pigment tear-line)
- ~2 DRIPPING / SMEARED MAKEUP (smeared mascara from one tear, lipstick smudged at corner)
- ~2 BLOOD / TEAR / DARK-SUBSTANCE STAINING (single drop at lip, tear track of black tears)
- ~1 PAINTED ACCENT (rune at temple, sigil at cheekbone, mask of black paint across eyes)
- ~1 OMBRE / GRADIENT LIP (red fading to black, plum fading to oxblood)
- ~1 GOLDEN ACCENT (gold liner, gold smudge, gold-flecked eyeshadow)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 18-30 words per entry.
- MUST name eye look + lip color + one accent.
- Painted-oil register words ("smoldering", "smeared", "drowning", "merciless", "razor-sharp").

━━━ BANS ━━━
- NO modern beauty-blogger language ("blended seamlessly", "snatched", "snatched brow", "highlighted cheekbone").
- NO Sephora-product names.
- NO playful / pastel / kawaii / Y2K-glitter-stickers.
- NO men's makeup (this pool is female-coded).
- NO entire skin descriptions — skin lives in its own pool.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
