#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/beauty_faces.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} BEAUTY FACE descriptions for GlamBot's beauty-portrait path — distinctive face/feature combos. The face IS the art.

Each entry: 15-30 words. One specific beauty portrait with distinctive features.

━━━ CATEGORIES ━━━
- Sharp cheekbones with piercing green eyes and freckles
- Full lips, dewy dark skin, wide-set brown eyes
- Pixie-cropped redhead with copper lashes and pale freckled skin
- Almond-eyed Asian beauty with glossy black hair and crimson lip
- Dark-skinned beauty with platinum-blonde halo curls
- Mixed-Latina with warm golden skin and defined jawline
- South-Asian beauty with gold septum ring and dewy skin
- Tall Black beauty with shaved head and crystal earrings
- Androgynous face with sharp jaw and plum lip
- Middle-Eastern beauty with dark brows and gold jewelry
- Pacific-Islander beauty with warm bronze skin and full brows
- Indigenous beauty with long braids and turquoise accents
- Freckled auburn-haired beauty with hazel eyes
- East-Asian beauty with short bob and winged liner
- Blue-eyed platinum-blonde with pale cool skin and frost-lip
- 50s beauty with silver-grey hair and smoky eye
- Curvy brunette with full cheek and bold red lip
- Gap-toothed smile beauty with amber eyes and caramel skin
- Muscular androgynous beauty with shaved sides
- Pregnant-belly beauty portrait with glowing skin
- Mature 40s beauty with laugh lines and confidence
- South-East-Asian beauty with flower-adorned hair
- Albino beauty with white lashes and pale-violet eyes
- Tattooed face-and-neck beauty with architectural cheekbones
- Vitiligo beauty with multi-tone skin as art
- Shaven-headed beauty with geometric face paint
- Lacquer-lash Black beauty with bold gold highlight
- Butterfly-freckle Hispanic beauty with dewy cheeks
- Plus-size beauty with full cheeks + crimson lip
- Transgender-feminine beauty with soft features + strong jaw
- Amazonian-tall beauty with dark skin + dramatic cheekbones
- Gamine-short beauty with cropped pixie + big eyes
- Warrior-face beauty with scar + bold liner
- Older beauty (60s) with silver-crowned hair + warm skin
- Red-head Irish beauty with freckles across cheeks
- Burmese beauty with thanaka-paint on cheeks
- Ethiopian beauty with traditional shuruba hairstyle
- Mongolian beauty with sun-kissed cheeks + dark braids
- Persian beauty with jeweled nose-ring + eyeliner
- Nigerian beauty with gele head-wrap + bold beauty

━━━ RULES ━━━
- Explicit diversity — ethnicity, age, body-type, style
- Distinctive specific features per entry
- Editorial beauty-portrait orientation

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
