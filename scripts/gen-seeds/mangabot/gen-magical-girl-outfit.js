#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_outfit.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} MAGICAL-GIRL OUTFIT entries. Frilly mahou-shoujo silhouettes — sailor seifuku magical / pastel-puff / witch-cape / idol-stage / cardcaptor-academy / madoka-style. ALWAYS CUTE, NEVER cheesecake.

Each entry: 18-30 words. Names the outfit silhouette + materials + magical accents + color palette.

VARIETY MANDATE:
- 16% SAILOR-FUKU MAGICAL — sailor-collar top + pleated skirt + thigh-highs + magical bow accent
- 14% PUFFY-PASTEL DRESS — full skirt + petticoat + bodice ribbons + lace trim
- 12% WITCH-MAGE — robe or cape + pointed hat + crystal pendant
- 10% IDOL-STAGE — sequined leotard + cape + glittering boots + stage gloves
- 10% MADOKA-DARK — dark-frilly with subtly grim accents (still cute, melancholy register)
- 10% CARDCAPTOR-ACADEMY — academy uniform with magical battle-accessories
- 8% PRINCESS-COURT — gown silhouette + tiara + magical ornate gloves
- 8% TEAM-COLOR PRECURE — specific color-block precure-style fighter outfit
- 6% FOREST-NATURE — leaf-trim dress + flower-crown + nature-tone palette
- 6% PUNK-REBEL — magical-girl with leather-trim, ripped tights, edgier register but still cute

DO write:
- Sailor seifuku in pearl-white with pastel-pink collar, full pleated skirt, white thigh-highs, magical-rose bow at chest, silver-laced ankle boots, glitter-trim
- Puffy lavender dress with cream petticoat, satin bow at waist, ruffle-trim sleeves, lace gloves, crystal-pendant necklace
- Black-and-purple witch ensemble — cropped jacket + tutu skirt + pointed-hat with dark-pink ribbon, fingerless lace gloves
- Idol-stage leotard in glittering cyan with cape, knee-high boots with star-buckles, gauntlet wand-bracers

DO NOT write:
- "form-fitting" / "skin-tight" / "minimal coverage" / "exposed midriff" / "low-cut" / "sultry"
- Photoreal fabric descriptions
- Multiple outfits per entry — ONE silhouette
- Sexualized framings

Outfit reads FRILLY-CUTE + magical-detail-rich, ALWAYS covered/age-appropriate.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
