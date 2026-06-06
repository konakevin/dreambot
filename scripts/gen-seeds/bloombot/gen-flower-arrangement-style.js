#!/usr/bin/env node
/**
 * BLOOMBOT_FLOWER_ARRANGEMENT_STYLE — the compositional STYLE of an
 * ornate florist arrangement. Cascading overflow, pavé dome, Dutch
 * Golden-Age still-life, ikebana sculptural, wild garden-gathered, etc.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_flower_arrangement_style.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ARRANGEMENT STYLE entries for BloomBot's flower-arrangement path — the compositional STYLE of an ornate florist arrangement. Each entry is one descriptive line, 30-50 words. NO leading CAPS NAME — flowing prose. Each describes the COMPOSITION + DENSITY + STRUCTURE + EMOTIONAL REGISTER of the arrangement (cascading / pavé dome / Dutch Master / ikebana / wild garden / etc.).

━━━ THE BAR ━━━
Every entry names a SPECIFIC arrangement compositional style. Cascading overflow. Pavé dome. Dutch Golden-Age still-life. Ikebana sculptural. Wild garden-gathered. Mounded romantic. Hedgerow-style. Hogarth curve. Crescent. Vertical column. Each must specify density (lush / abundant / sparse-deliberate / overflowing) + form (cascading / spherical / asymmetric / vertical / crescent / S-curve) + emotional register (romantic / formal / wild / refined / opulent / minimalist-elegant).

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"A lavish cascading arrangement overflowing the rim in dense, abundant trails spilling far down the vessel sides, blooms tumbling in luxuriant waves, layered and heavy with petals, every tendril packed with lush sculptural mass"
"A full rounded pavé dome packed edge to edge in tight symmetrical abundance, every gap filled flush, a perfect cushion of blooms rising in a smooth, immaculate hemisphere of extraordinary density"
"An opulent Dutch Golden-Age still-life arrangement, asymmetric and deeply layered, blooms thrust forward at dramatic angles and recede into shadowed depth, dimensional and painterly, an old-master composition of breathtaking detail"
"An airy ikebana-inspired sculptural design where deliberate negative space frames elegant asymmetric lines, yet where the blooms gather they mass in genuine lush abundance, architectural and refined"
"A wild garden-gathered arrangement, loose and romantically untamed, stems arching at varied natural heights, blooms nodding and overlapping as if just bundled from a meadow, artfully disheveled and gloriously full"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 CASCADING / OVERFLOW (lavish cascade, spilling waterfall of blooms, descending tendrils, tumbling cascade, abundant overspill)
- ~5 ROUNDED / DOMED / SPHERICAL (pavé dome, biedermeier sphere, posy mound, dome-cushion, perfect-sphere bouquet)
- ~5 DUTCH OLD-MASTER (Dutch Golden-Age still-life, Flemish floral painting, 17th-century Dutch dramatic asymmetric mass)
- ~4 IKEBANA / JAPANESE (airy ikebana sculptural, moribana flat-arrangement, naga-ire tall-vase, sogetsu modern abstract, rikka classical)
- ~4 WILD GARDEN-GATHERED (wild meadow-bouquet, hand-gathered romance, garden-pulled loose mass, just-picked tumble)
- ~3 HOGARTH S-CURVE / CRESCENT (Hogarth S-curve, crescent moon arrangement, asymmetric flowing S, classical crescent)
- ~3 VERTICAL COLUMN (single tall vertical arrangement, linear-vertical column of blooms, towering monumental column)
- ~3 RUSTIC FARMHOUSE (artless farmhouse jug, mason-jar gathering, painted-tin bunch, country-cottage loose)
- ~3 ROMANTIC ENGLISH GARDEN (English garden mass, romantic Constance Spry style, abundant English-country)
- ~3 MODERN MINIMALIST (single sculptural bloom in vase, minimalist negative-space arrangement, modernist single-stem)
- ~3 BIEDERMEIER (concentric Biedermeier rings, tight-spiraled posy, Victorian-era nosegay)
- ~3 BAROQUE / ROCOCO (opulent Baroque composition, rococo curvilinear arrangement, dramatic dark-and-light contrast)
- ~3 OPULENT / EXTRA-LARGE (monumental abundance, ballroom-scale centerpiece, towering hotel-lobby spectacle)
- ~3 HEDGEROW / LOOSE (hedgerow-style loose-gathered, foraged ditchside style, woodland-edge wildness)
- ~3 ASYMMETRIC / SCULPTURAL (asymmetric mass with deliberate negative space, sculptural off-center mass)
- ~3 SEASONAL THEMED (harvest cornucopia, winter evergreen and bloom, spring-pastel posy, autumnal mass)
- ~3 TROPICAL (tropical fruit + flower composition, exotic bird-of-paradise mass, heliconia tropical drama)
- ~3 GARDEN-PARTY (sunny tablecentre, lunch-party loose, brunch-table posy, festival mass)
- ~3 BRIDAL / CEREMONIAL (cascading bridal bouquet, ceremonial altar mass, ceremonial pillar arrangement)
- ~3 MEADOW-LIKE (meadow-recreated loose mass, prairie-arrangement, sloped grass-edge gathering)

━━━ BANS ━━━
- NO sci-fi / no neon / no hologram.
- NO bare "flowers in vase" — name the SPECIFIC composition style + density + emotional register.
- NO color descriptions (let the bloom-mass speak — engine handles color).
- NO leading CAPS NAME — flowing prose only.

━━━ FORMAT ━━━
Each entry: 30-50 words. Flowing prose — NO leading CAPS NAME. Names compositional style + density + form + emotional register.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
