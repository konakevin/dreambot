#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_outfits_female.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME FEMALE OUTFIT descriptions for MangaBot's character paths. Each entry is 25-40 words. The outfit defines silhouette across the anime genre spectrum.

CONTEXT: Lush, vibrant, anime-stylized fashion. Draw from ALL anime genre wardrobes — slice-of-life / shoujo / shonen / fantasy / cyberpunk / historical. Each entry is a complete outfit description — top, bottom, footwear, optional layer/accessory. NOT just a piece — full silhouette.

VARIETY MANDATE — rotate across these silhouette traditions (cover them all):
- Sailor school uniform (classic seifuku — pleated skirt, sailor collar, knee socks, loafers)
- Modern school uniform (blazer + plaid skirt + knee socks + loafers / oxford shirt + cardigan)
- Casual modern (oversized hoodie + skirt / oversized sweater + jeans / cropped tee + high-waist pants)
- Cozy autumn (chunky cardigan + plaid skirt + tights + ankle boots / oversized scarf + jeans)
- Summer casual (sundress + sneakers / camisole + shorts + sandals / flowy blouse + denim shorts)
- Kimono / yukata (festival yukata with obi sash and geta sandals / formal kimono with obi)
- Shrine maiden (white kosode + crimson hakama + tabi socks + zori sandals)
- Magical girl (themed dress with bows / frilly skirt + thigh-high stockings + ribbon-tied boots)
- Fantasy mage (long robe + leather satchel / hooded cloak + tunic + boots + spell-pouch)
- Cyberpunk (oversized neon jacket + cargo shorts + tech-boots / crop-top + utility-pants + chunky sneakers + signal-watch)
- Idol off-duty (oversized sweater + skirt + thigh-high socks + sneakers / hoodie + denim shorts + chunky sneakers + cap)
- Goth-lolita (black layered dress with lace + petticoat + buckle boots + parasol)
- Bohemian artist (vintage long skirt + denim jacket + canvas sneakers + tote bag)
- Bicycle / sporty (track jacket + cycling shorts + sneakers / jersey + shorts + caps)
- Office-casual (blouse + pencil skirt + flats / cardigan + slacks / blouse + slacks + heels)
- Winter coat (long wool coat + scarf + gloves + boots / parka + jeans + winter boots)

EVERY entry must include:
- Garment 1 (top — uniform / blouse / hoodie / sweater / sundress / kimono / robe / etc.)
- Garment 2 (bottom — skirt / pants / shorts / hakama / etc., OR if dress: continue dress description)
- Footwear (loafers / sneakers / boots / sandals / etc.)
- ONE small detail (ribbon in hair / pin on collar / bow on bodice / charm on bag / patch on jacket / etc.)
- Color anchor (anime-vibrant or stylized — pastel / saturated / pale / etc.)

ABSOLUTELY BANNED:
- NO sexualized / fanservice / barely-there outfits
- NO swimsuits / lingerie / underwear-as-outerwear
- NO armor / battle-gear (this is slice-of-life)
- NO fully-modern Western mass-market only (lean Japan-coded)

Examples (write fresh):
- "Classic sailor seifuku in navy and white with red ribbon at the collar, knee-length pleated skirt, white knee socks, brown loafers, school satchel slung across the shoulder"
- "Oversized cream cardigan with cuffed sleeves over a pale-blue blouse, rust-colored corduroy skirt, ribbed black tights, brown leather ankle boots, small enamel pin on the cardigan"
- "Festival yukata in indigo with white floral pattern, embroidered red obi sash tied at the back, white tabi socks, wooden geta sandals, paper lantern charm hanging from her wrist"
- "Oversized neon-pink graphic hoodie with cyber-glyph print, black cargo shorts with utility pockets, chunky white tech-sneakers, signal-watch on the wrist, small bag clipped to a belt loop"
- "Crimson-and-white shrine maiden outfit — white kosode top, red hakama trousers tied at the waist, white tabi socks, zori sandals, small bell-charm tied at the obi"

Output ONLY a valid JSON array of ${n} strings (25-40 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
