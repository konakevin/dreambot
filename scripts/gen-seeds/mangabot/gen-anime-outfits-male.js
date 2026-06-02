#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_outfits_male.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} ANIME MALE OUTFIT descriptions for MangaBot's character paths. Each entry is 25-40 words. The outfit defines silhouette across the anime genre spectrum.

CONTEXT: Lush, vibrant, anime-stylized fashion for male characters. Draw from ALL anime genre wardrobes — slice-of-life / shoujo / shonen / fantasy / cyberpunk / historical. Complete outfit descriptions — top, bottom, footwear, optional layer/accessory.

VARIETY MANDATE — rotate across these silhouette traditions:
- School uniform (gakuran black-button uniform / blazer + tie + slacks + loafers / oxford shirt + sweater-vest + slacks)
- Casual modern (oversized hoodie + jeans / graphic tee + cargo pants / button-down + chinos)
- Cozy autumn (chunky knit + slacks + boots / wool coat + scarf + jeans / oversized cardigan + dark jeans)
- Summer casual (linen shirt + shorts + sandals / tank top + cargo shorts / open-button-up + tee + jeans)
- Kimono / yukata (festival yukata with obi sash and geta sandals / formal kimono with hakama / casual happi coat)
- Samurai / ronin (worn kimono + hakama + sandals / haori coat + obi sash / wandering-monk robe)
- Cyberpunk (utility jacket with neon details + cargo pants + tech-boots / hooded jacket + ripped jeans + chunky sneakers + signal-watch)
- Office-casual (button-down + slacks + leather shoes / blazer + open-collar shirt + slacks)
- Bohemian artist (oversized cardigan + vintage tee + jeans / paint-stained shirt + chinos)
- Sporty (track jacket + joggers + sneakers / jersey + shorts + sneakers + cap)
- Mage / fantasy (long robe + boots / hooded cloak + tunic + leather satchel)
- Winter coat (long wool overcoat + scarf + slacks + boots / parka + jeans + winter boots)
- Streetwear (oversized graphic hoodie + skinny jeans + chunky sneakers + chain necklace)
- Café-worker / barista (apron over button-down + slacks / black tee + apron + jeans + sneakers)
- Idol-band off-duty (leather jacket + skinny jeans + boots / oversized sweater + jeans + sneakers)
- Detective / journalist (trench coat + button-down + slacks + leather shoes)

EVERY entry must include:
- Garment 1 (top — uniform / button-down / hoodie / sweater / kimono / robe / jacket / etc.)
- Garment 2 (bottom — slacks / jeans / shorts / hakama / cargo / etc.)
- Footwear (loafers / sneakers / boots / sandals / etc.)
- ONE small detail (watch / pendant / earring / patch / pin / scarf / cap / glasses / etc.)
- Color anchor (anime-stylized — saturated or muted, named)

ABSOLUTELY BANNED:
- NO bare-torso / shirtless / pin-up framing
- NO armor / battle-gear (slice-of-life only)
- NO loincloths / impractical exposed-flesh
- NO Western military uniforms

Examples (write fresh):
- "Black gakuran school uniform with high-collar gold-button jacket, matching slacks, brown leather loafers, school bag slung across one shoulder, small pin on the lapel"
- "Oversized cream cable-knit sweater with cuffed sleeves over a dark t-shirt, slim charcoal slacks, scuffed brown leather Chelsea boots, vintage watch on the wrist"
- "Indigo yukata with subtle white wave pattern, dark-grey obi sash, white tabi socks, wooden geta sandals, small folding fan tucked into the obi"
- "Black graphic hoodie with cyber-glyph print, distressed jeans, chunky white tech-sneakers, signal-watch on the wrist, silver-chain necklace visible at the collar"
- "Worn brown haori coat over a faded indigo kimono, charcoal hakama trousers, straw sandals, wooden hairpin holding back loose strands at the temples"

Output ONLY a valid JSON array of ${n} strings (25-40 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
