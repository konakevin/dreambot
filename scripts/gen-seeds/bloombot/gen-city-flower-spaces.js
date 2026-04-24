#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/city_flower_spaces.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} URBAN CITY flower-setting descriptions for BloomBot's city-flowers path. Each entry describes a CITY SETTING where flowers are on full display — NO specific flower species or colors (a separate pool handles flowers).

Each entry: 15-25 words. One specific urban setting with atmosphere and camera angle.

━━━ SETTING TYPES (mix evenly) ━━━
- Parisian flower shop exterior — overflowing buckets on cobblestone sidewalk, awning, morning light
- European city window boxes — rows of flower boxes on old stone/brick building facades
- City sidewalk planters — massive stone or concrete planters bursting with blooms on busy avenue
- Flower market stalls — empty wooden stalls piled with buckets and wrapped bouquets, no people
- Brownstone stoop — iron railings, potted flowers cascading down stone steps
- Lamppost hanging baskets — ornate iron lampposts with overflowing flower baskets lining a street
- Cafe terrace — empty bistro tables surrounded by flower boxes and climbing vines on brick
- City park entrance — wrought iron gates framing flower beds, city skyline behind
- Canal-side flower displays — Amsterdam/Venice style, flowers along waterway with bridges
- Balcony garden — multiple floors of iron balconies dripping with flowers, Mediterranean style
- Flower cart — vintage wooden cart overflowing with blooms on a cobblestone street, no vendor
- City rooftop garden — skyline views, industrial planters and trellises covered in blooms
- Train station platform — Victorian iron and glass canopy with hanging baskets and planter boxes
- Bookshop/bakery storefront — charming facade completely framed by climbing flowers and planters

━━━ CAMERA ANGLES (vary across entries) ━━━
- Street-level looking up at flower-covered facade
- Wide establishing shot of flower-lined street
- Through-archway or through-doorway framing
- Low-angle from cobblestone level through flower buckets
- Bird's-eye down onto flower market or rooftop
- Intimate close-in on a specific display (window box, stoop, cart)

━━━ FLOWER INSTRUCTIONS (critical) ━━━
Do NOT name specific flower species or colors. Use only generic terms: "blooms", "flowers", "floral displays", "overflowing bouquets". A separate pool provides the specific flower arrangement.

━━━ ATMOSPHERE (include one per entry) ━━━
Morning golden hour, misty dawn, rain-wet cobblestones, afternoon sun through buildings, blue hour twilight, warm streetlamp glow, autumn light, spring morning dew, overcast soft light, sunset between buildings

━━━ NO PEOPLE ━━━
Absolutely NO people, vendors, shopkeepers, pedestrians, or crowds. Empty scenes only — the flowers are the sole subject.

━━━ DEDUP ━━━
Each entry must be a DIFFERENT setting + angle combo.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
