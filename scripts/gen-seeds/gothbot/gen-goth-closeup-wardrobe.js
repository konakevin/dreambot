#!/usr/bin/env node
/**
 * GOTHBOT_GOTH_CLOSEUP_WARDROBE — top-portion clothing visible in the
 * close-up frame (collar / neckline / shoulder / bodice top). Victorian
 * lace collars, brocade jackets, mourning veils, velvet gowns, leather
 * harnesses, gothic minimalism. Castlevania / Crimson-Peak / Bloodborne /
 * Devil-May-Cry painted oil register. Female-locked. NSFW-clean
 * (no nipple/cleavage emphasis).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_goth_closeup_wardrobe.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} WARDROBE entries for GothBot's goth-closeup path — the visible top-portion clothing in a tight gothic close-up (collar, neckline, shoulder, bodice top) of a hauntingly-beautiful dark-seductress. Each entry is one rich descriptive sentence (15-25 words) naming the silhouette/material/cut at the neckline+shoulder.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific silhouette / garment (high collar, off-shoulder, turtleneck, mourning veil, gothic brocade jacket, lace bodice, leather harness top, velvet gown top); (2) names MATERIAL + COLOR (black silk, deep midnight velvet, mourning crepe, oxblood satin, blood-red lace, blackened leather); (3) shows how the fabric sits at neckline + shoulder. Painted Castlevania / Crimson-Peak / Bloodborne / Devil-May-Cry register. NSFW-clean — no nipple/cleavage emphasis.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"High Victorian lace collar rising to jawline, intricate black needlepoint pattern layered over a fitted velvet bodice, utterly structured."
"Black silk turtleneck, seamlessly smooth, razor-edge neckline hugging the throat with cold minimalist elegance against pale skin."
"Velvet off-shoulder gown, deep midnight black, wide neckline draped across collarbones with brocade trim edging each shoulder curve."
"Gothic brocade jacket, mandarin collar buttoned to the throat, silver damask pattern woven through black fabric at the shoulder seam."
"Mourning veil descending from an ornate jet-black fascinator, sheer black silk pooling over collar and shoulder in dark cascading folds."

━━━ VARIETY MANDATE (distribute across these wardrobe families) ━━━
- ~4 HIGH-COLLAR / VICTORIAN-COLLAR (lace collar, ruff, mandarin, choker-collar, ascot)
- ~3 OFF-SHOULDER / WIDE-NECKLINE (velvet gown, brocade gown, satin off-shoulder)
- ~3 TURTLENECK / RAZOR-EDGE MINIMAL (silk turtleneck, mock-neck, knit black turtleneck)
- ~3 BROCADE / JACQUARD JACKET top (mandarin-collar jacket, riding jacket, military-cut blazer)
- ~2 LACE / NEEDLEPOINT BODICE (Victorian lace bodice, blood-red lace overlay, mourning lace)
- ~2 MOURNING VEIL / FASCINATOR / HEADPIECE (jet veil, mantilla, fascinator with veil)
- ~2 LEATHER HARNESS / BUCKLE / STRAP TOP (modern-gothic harness over black tee, dueling-strap)
- ~2 CAPE / CLOAK / FUR COLLAR (fox-fur collar, gothic cape, mourning shawl)
- ~1 SHEER / TRANSPARENT NECKLINE (black mesh, gauze layer over throat)
- ~1 SILK ROBE / KIMONO neckline draped open
- ~1 ARMOR / METAL SHOULDER (gothic pauldron, scaled gorget, etched chestplate top)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 15-25 words per entry.
- ONE garment per entry (no two-piece descriptions).
- Material + color + how it sits at neckline/shoulder.

━━━ BANS ━━━
- NO modern streetwear / fast-fashion / Y2K cliches.
- NO nipple / cleavage / bare-breast emphasis — NSFW-clean.
- NO entire outfit descriptions (head-to-toe) — close-up frame only shows collar/shoulder.
- NO men's wardrobe (this pool is female-coded).
- NO playful / kawaii / pastel goth.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
