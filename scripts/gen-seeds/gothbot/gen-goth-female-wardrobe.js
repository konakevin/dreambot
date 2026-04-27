#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/goth_female_wardrobe.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GOTHIC FEMALE WARDROBE descriptions for GothBot's goth-closeup and goth-full-body paths. Each entry is ONE specific outfit described in 12-20 words. These compose with separate archetype/makeup/hair pools.

These outfits are DARK, SEXY, POWERFUL — period-gothic with attitude. She dresses like she's attending her own coronation in hell. NOT modern fashion, NOT casual — these are dramatic gothic costumes with presence.

━━━ VARIETY SPREAD ━━━
- CORSETED / STRUCTURED (5-6) — black brocade underbust corset over sheer lace chemise, steel-boned leather corset with ornate silver clasps over flowing skirt, velvet overbust corset with bone-button spine, corseted jacket with high military collar and silver braiding
- FLOWING / DRAMATIC (5-6) — floor-length black velvet gown with plunging neckline and bell sleeves, tattered silk mourning dress with layers of black lace, sheer black organza over dark satin with trailing hem, high-collared cape over bare shoulders and dark fitted dress
- ARMORED / WARRIOR (4-5) — black leather brigandine over dark chainmail with silver buckles, dark plate pauldrons over corseted leather with weapon belt, ornate black breastplate etched with sigils over flowing dark skirt, gauntleted hands with leather straps up the forearm
- OCCULT / RITUALISTIC (4-5) — hooded dark ceremonial robe with silver thread embroidery, ritual-stained apron over dark fitted dress with bone toggles, layered dark fabrics with talisman chains and herb pouches, sheer black veil over bare shoulders with rune-marked choker
- MINIMAL / STRIKING (3-4) — simple black slip dress with one dramatic accessory (bone crown / silver collar / chain harness), bare shoulders with ornate dark choker and nothing else visible, dark fur stole over one shoulder with nothing beneath implied

━━━ RULES ━━━
- Describe the SPECIFIC outfit, not the mood or the woman
- Include materials (velvet, leather, lace, silk, chainmail), colors (mostly blacks/darks with metal accents), and construction details
- SEXY but not trashy — dark elegance with power
- No modern clothes (no jeans, t-shirts, sneakers)
- Each entry is a different outfit — variety in silhouette, material, era

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
