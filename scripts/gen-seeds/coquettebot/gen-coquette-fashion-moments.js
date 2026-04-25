#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/coquette_fashion_moments.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COQUETTE FASHION MOMENT descriptions for CoquetteBot's coquette-fashion path — ONE young woman, SOLO, in editorial fashion moments. Ribbon-corsets, ballet slippers, silk bows, tulle, lace, pearls. Precious / dreamy / romantic editorial.

Each entry: 15-30 words. One specific fashion-moment with setting + pose + outfit category.

━━━ CATEGORIES ━━━
- Girl in tulle gown sitting on vintage garden swing, rose petals drifting
- Ballerina in tutu mid-pose on pink-bar studio
- Girl in pearl-ribbon bodice dress stepping through rose-archway
- Girl in lace bridal gown on pink-sanded beach at sunset
- Girl in ribbon-corset dress in ivy courtyard
- Girl in flower-crown + cream dress in cherry-blossom path
- Girl in silk-bow slip dress reclining on velvet chaise
- Girl in feather-trim pastel coat in Parisian street
- Girl in organza gown in Victorian conservatory
- Girl in ballet flats + tulle skirt on rooftop
- Girl in lace veil + cream gown in rose-garden dusk
- Girl in pink-satin gloves + pearl dress in candle-lit boudoir
- Girl in rose-embroidered dress in wheat field at golden hour
- Girl in cloud-layer tutu in misty meadow
- Girl in butterfly-wing cape in fairy-forest glade
- Girl in bow-laden gown on marble staircase
- Girl in pastel tea-dress at vintage table
- Girl in white lace dress on marble balcony at sunrise
- Girl in chiffon gown dancing alone in soft-lit ballroom
- Girl in pink-ribbon hair + silk slip in vanity mirror
- Girl in petal-strewn meadow in pastel jumpsuit
- Girl in delicate lace underdress in golden-hour glass conservatory

━━━ RULES ━━━
- SOLO young woman ONLY — never male figures, never two-figure shots
- Ages: young adult — never girls as children (adult-feminine-pastel lane)
- Editorial / precious / dreamy
- Outfit + setting + pose per entry
- Pink / pastel palette dominant

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
