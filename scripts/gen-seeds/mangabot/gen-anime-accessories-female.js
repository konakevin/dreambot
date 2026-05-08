#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_accessories_female.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME FEMALE ACCESSORY / SIGNATURE-OBJECT descriptions for MangaBot. Each entry is 14-22 words. The accessory is a single distinctive item the character carries / wears that adds personality.

CONTEXT: Slice-of-anime-life details. Each accessory reads as iconic-anime-character-defining. NOT weapons (this is slice-of-life). Wholesome, evocative, story-hinting.

Categories — rotate widely:
- Bags (canvas tote slung over shoulder / leather satchel / crossbody bag / school satchel / vintage backpack with charms)
- Books (a worn paperback novel in hand / a sketchbook tucked under the arm / a notebook with bookmarks / a folktale book / poetry book in a tote)
- Cameras (vintage film camera around her neck / digital camera in hand / Polaroid clipped to her bag)
- Music (over-ear headphones around her neck / earbuds with cord visible / a small speaker clipped to her bag)
- Phones / tech (a phone with a charm-strung dangling from it / handheld game console / e-reader)
- Beverages / food (a takeaway coffee cup / a clear bottle of tea / an ice-cream cone / a pastry in wax paper / a bento box)
- Charms / jewelry (a silver crescent-moon necklace / a beaded bracelet / a small charm tied to her wrist / a vintage hair-clip)
- Umbrellas / weather (a clear plastic umbrella / a pastel parasol / a knitted scarf around her neck)
- Stuffed companions (a small plush keychain hanging from her bag / a plushie tucked under her arm)
- Animals (cradling a small kitten / a puppy on a leash / a cat in a carrier)
- Art supplies (paint-stained smock + tote / pencil case in hand / portable easel)
- Scrolls / fantasy (a sealed letter / a folded paper crane / a folding fan / a jade pendant)
- Idol / pop (a small concert lightstick / a microphone / a portable speaker)
- Cyberpunk (signal-watch / wired earphones / chunky data-pad / VR-glasses around the neck)

EVERY entry must include:
- Specific object (named — film camera / sketchbook / takeaway cup / etc.)
- Position (in hand / slung over shoulder / around neck / tied to wrist / clipped to bag / under arm)
- ONE detail (charm / sticker / engraving / wear-mark / etc.)

ABSOLUTELY BANNED:
- NO weapons / no swords / no firearms (slice-of-life)
- NO sexualized accessories
- NO Western-only generic stuff (lean Japan-coded)

Examples (write fresh):
- "Vintage Pentax film camera hanging on a worn leather strap around her neck, lens cap dangling on a thin cord"
- "Canvas tote slung over her shoulder with a small enamel cat-pin attached, paperback novel half-visible inside"
- "Over-ear headphones around her neck with cord trailing into the pocket of her hoodie, soft music faintly audible"
- "Cradling a sleepy gray kitten in both hands close to her chest, the kitten's eyes half-closed in contentment"
- "Takeaway coffee cup in one hand with a hand-drawn doodle on the cardboard sleeve, the other hand tucked into her cardigan pocket"

Output ONLY a valid JSON array of ${n} strings (14-22 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
