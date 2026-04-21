#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/cozy_interiors.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COZY INTERIOR descriptions for BloomBot's cozy path — cottagecore floral interior settings where flowers ARE EVERYWHERE in a warm inviting room. The prettiest interior flower scene you can imagine.

Each entry: 15-30 words. Names the room / space + its cozy features + where the flowers are.

━━━ CATEGORIES ━━━
- Rain-streaked cottage window with wildflower box overflowing
- Farmhouse kitchen table with massive peony vase, linen curtains, morning sun
- Sun-drenched kitchen with sunflowers in mason jars everywhere
- Greenhouse interior with warm golden light + rain on glass
- Victorian conservatory with climbing wisteria + iron chairs
- Cozy reading nook with hanging plants + flower garlands
- Parisian flower shop with buckets spilling onto cobblestones
- Claw-foot bathtub filled with floating petals + candles
- Bedroom nightstand with roses + soft amber lamp glow
- Attic studio with skylight + vases on every surface
- English country parlor with hydrangeas bursting from ornate vases
- Modern white kitchen with cut flowers on marble counter + copper pots
- Sunlit dining room with tablecloth + peonies spilling across
- Antique library with dried flowers tucked into book stacks
- Rustic breakfast nook with tea set + wildflowers in blue-and-white china
- Florist's workshop — wooden table strewn with stems, shears, twine
- Cottagecore bedroom with floral wallpaper + fresh roses on bedside
- Garden shed interior with sunbeams through wood slats + pots of blooms
- Stone-floored mudroom with wellies + gathered wildflower baskets
- Sunroom with rattan furniture + orchids and ferns everywhere
- Warm bathroom with eucalyptus + candles + bouquet in clawfoot tub
- Old-world French kitchen with tarnished copper + roses and lavender
- Windowsill lined with small vases catching afternoon sun
- Country living room with bouquet on piano + oil-lamp glow
- Vintage flower shop with brass watering cans + ribbon rolls
- Boho apartment — macramé, pothos, and dried flower bouquets
- Tea shop interior with orchids + porcelain + steam rising
- Cottagecore stairs with wildflower garlands trailing down banister
- Pantry / stillroom with drying herbs + bundled flowers hanging from beams

━━━ RULES ━━━
- Interior / indoor setting (key differentiator from landscape / garden-walk / cosmic / dreamscape)
- Warm, inviting, cottagecore-leaning (not sterile modern)
- Flowers are VISIBLY abundant in the space
- No people in frame (BloomBot rule)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
