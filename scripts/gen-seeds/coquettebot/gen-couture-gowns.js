#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/couture_gowns.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} COUTURE GOWN descriptions for CoquetteBot — jaw-droppingly beautiful, ornate, bridal-level coquette dresses and gowns. These are the centerpiece of oil-painting portraits. Think haute couture runway meets fairy tale wedding meets coquette princess.

Each entry: 12-25 words. One specific stunning gown described in obsessive textile detail.

━━━ GOWN TYPES (vary across all entries) ━━━
- Ball gowns (cascading tulle, cathedral trains, voluminous skirts, corseted waists)
- Bridal-inspired (but NOT literal wedding dresses — coquette fantasy bridal)
- Princess gowns (Disney-princess energy — layered, flowing, impossibly romantic)
- Haute couture (runway-level construction, architectural details, show-stopping silhouettes)
- Fairy tale gowns (enchanted, sparkle-dusted, seemingly made of moonlight/petals/starlight)
- Regency/period (empire waists, puffed sleeves, Jane Austen romance)
- Debutante (sweetheart necklines, satin gloves, pearl buttons down the back)
- Fantasy armor-gowns (delicate chainmail in rose-gold, crystal-studded bodice, warrior-princess)
- Petal gowns (made of real flower petals, living roses climbing the bodice)
- Celestial gowns (star-embroidered, galaxy-dyed silk, constellation beading)

━━━ TEXTILE DETAILS (vary per entry) ━━━
- Fabrics: silk organza, duchess satin, French lace, Chantilly lace, tulle, chiffon, velvet, brocade, taffeta, charmeuse, mikado silk
- Embellishments: hand-sewn pearls, crystal beading, seed-pearl clusters, sequin cascades, gold-thread embroidery, floral appliqué, ribbon rosettes
- Construction: boned corset, drop waist, sweetheart neckline, off-shoulder, cap sleeves, bishop sleeves, fitted bodice, A-line, mermaid silhouette
- Trains: chapel-length, cathedral, watteau, detachable cape-train
- Finishing: hand-rolled hems, scalloped edges, petal-cut layers, raw-edge tulle

━━━ COLOR PALETTE (coquette pastels) ━━━
- Blush, rose, ballet-pink, champagne, ivory, cream, soft gold
- Lavender, powder-blue, mint, peach, dusty-rose, pearl-white
- Rose-gold metallic, opalescent, iridescent, moonstone shimmer

━━━ RULES ━━━
- Each gown should make someone gasp — "I WANT that dress"
- Describe the GOWN in obsessive detail, not the wearer
- Every entry must specify fabric + color + at least one embellishment + silhouette detail
- No two entries should describe the same type of gown
- Bridal energy but NOT literal wedding dresses — coquette fantasy, not registry
- These are paintings, not photos — gowns can be impossibly detailed and magical

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
