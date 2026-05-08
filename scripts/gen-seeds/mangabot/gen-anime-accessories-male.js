#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_accessories_male.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME MALE ACCESSORY / SIGNATURE-OBJECT descriptions for MangaBot. Each entry is 14-22 words. The accessory is a single distinctive item the character carries / wears that adds personality.

CONTEXT: Slice-of-anime-life details. Each accessory reads as iconic-anime-character-defining. NOT weapons. Evocative, story-hinting.

Categories — rotate widely:
- Bags (leather messenger bag / canvas backpack / crossbody satchel / vintage briefcase / sport-duffel)
- Books (worn paperback in back pocket / a notebook tucked under the arm / a journal in his bag / a manga volume in hand)
- Music (over-ear headphones around the neck / earbuds with cord visible / a guitar case slung across his back / a small portable speaker)
- Cameras (DSLR slung on a strap / film camera in hand / Polaroid hanging from a wrist strap)
- Phones / tech (a phone with a worn case / a handheld console / a wireless earbud just visible)
- Beverages / food (takeaway coffee cup / canned coffee / steamed bun in wax paper / an apple in hand)
- Watches / jewelry (a vintage analog watch on the wrist / a silver chain necklace / a leather bracelet / a single ear-stud)
- Umbrellas / weather (a black folding umbrella / a knitted scarf around the neck / leather gloves)
- Companions (a small bird perched on his finger / a stray cat on his shoulder / a dog on a leash)
- Sketch / craft (a sketchbook in hand / a pencil tucked behind the ear / a paint-streaked apron)
- Bicycle / mobility (a bicycle leaning beside him / a longboard tucked under his arm / a scooter parked nearby)
- Cyberpunk (signal-watch / wired earphones with chunky connector / data-pad clipped to his belt / wraparound shades pushed up on his head)
- Bento / food-from-home (paper-wrapped onigiri in hand / takeaway noodle cup / a folded handkerchief lunch-cloth)

EVERY entry must include:
- Specific object (named)
- Position (in hand / slung over shoulder / around neck / on wrist / etc.)
- ONE detail (engraving / wear-mark / charm / band / etc.)

ABSOLUTELY BANNED:
- NO weapons / no swords / no firearms (slice-of-life)
- NO Western-business-uniform-coded accessories that read corporate (no briefcases worn formally)
- NO sexualized accessories

Examples (write fresh):
- "Vintage analog watch on his left wrist with a worn leather band, face slightly scratched from years of use"
- "Leather messenger bag slung across his chest with a small enamel pin attached to the strap, notebook half-visible inside"
- "Over-ear headphones around his neck, cord trailing into the pocket of his hoodie, faint music audible"
- "Worn paperback novel in his back pocket, spine cracked from rereading, pages dog-eared at multiple spots"
- "Takeaway coffee cup in one hand with a small sticker stuck to the cardboard sleeve, the other hand tucked into his jacket pocket"

Output ONLY a valid JSON array of ${n} strings (14-22 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
