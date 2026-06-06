#!/usr/bin/env node
/**
 * BLOOMBOT_FLOWER_ARRANGEMENT_VESSEL — heroic decorative vessels that
 * hold an ornate florist arrangement. Bronze urn, ginger jar, willow
 * basket, baroque vase, cut-crystal vase, terracotta planter, silver
 * trophy urn, hand-tied bouquet in kraft paper.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_flower_arrangement_vessel.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} VESSEL entries for BloomBot's flower-arrangement path — a heroic decorative vessel that holds an ornate florist arrangement at center-stage. Each entry is one descriptive line, 25-45 words, starting with a CAPS NAME, em-dash, then body describing the vessel's archetype, material, finish, form/proportion, surface detail, and emotional register.

━━━ THE BAR ━━━
Every entry names a SPECIFIC vessel ARCHETYPE (urn / vase / jar / planter / bowl / basket / bucket / tureen / amphora / footed-bowl / pitcher / cauldron / cloche / decanter / chalice / lantern) + a specific MATERIAL (bronze, porcelain, willow, gilded baroque, cut crystal, terracotta, silver, kraft paper, copper, hand-glazed earthenware, mercury-glass, pewter, alabaster) + surface detail (verdigris patina, chinoiserie scrollwork, sun-bleached weave, gold-leaf burnished, leaded geometric facets, mineral efflorescence, foliate cartouches) + a FORM qualifier (stately, generous, rustic, opulent, formal, weather-beaten, heirloom-weight).

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"FOOTED BRONZE URN — a tall classical urn cast in bronze, deep verdigris patina worn to soft green-brown at the curves, fluted body, twin scrolled handles, raised acanthus band at the shoulder, stately"
"BLUE-AND-WHITE PORCELAIN GINGER JAR — hand-painted chinoiserie scrollwork covering every surface, lidless and wide-mouthed, the glaze brilliant and slightly pooled at the base, a generous rounded form"
"WOVEN WILLOW BASKET — a sturdy hand-woven basket with a broad arched handle, loose open weave sun-bleached to pale honey and silver, a wide flat base and gently flared sides, rustic and harvest-generous"
"GILDED BAROQUE VASE — gold leaf burnished and worn at every high curve, rococo embossed flourishes cascading down the body, a wide flared mouth and pinched waist, the surface a patchwork of glinting gold"
"TALL CUT-CRYSTAL VASE — heavy leaded crystal with a dense geometric facet pattern, prismatic and light-catching, a slightly tapered form on a thick flat base, formal and brilliant"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 URN / FOOTED-VESSEL (bronze urn, marble urn, silver trophy urn, footed pewter urn, alabaster urn, footed cast-iron urn)
- ~5 JAR (porcelain ginger jar, stoneware crock, hand-glazed apothecary jar, mercury-glass jar, salt-glazed Bellarmine jug)
- ~5 VASE / GLASS (cut-crystal vase, hand-blown glass vase, ribbed bud-vase, milk-glass vase, opaline-glass vase, frosted-glass column, etched-glass tulip vase)
- ~5 BAROQUE / DECORATIVE (gilded baroque vase, rococo porcelain centerpiece, hand-painted Sevres urn, gilt-and-ormolu candelabra-urn, repousse silver vase)
- ~4 WOVEN / BASKET (willow basket, rattan trug, French-market basket, wicker hand-basket, oak-splint berry basket, twined sweetgrass basket)
- ~4 TERRACOTTA / EARTHENWARE (weathered terracotta planter, Etruscan amphora, hand-thrown stoneware bowl, salt-glazed crock, Spanish olive jar)
- ~3 INDUSTRIAL / RUSTIC (zinc bucket, hammered copper pot, galvanized milk-can, wooden trug, weathered tin pail)
- ~4 CHINA / PORCELAIN (Spode bone-china tureen, Limoges footed bowl, Wedgwood Jasper urn, Delft blue-and-white pitcher, Imari-pattern ginger jar)
- ~3 KRAFT / WRAPPED (hand-tied bouquet in kraft paper, hand-tied posy in muslin, French-market wrap-bouquet, twine-tied burlap bundle)
- ~3 BRASS / METAL (polished brass jardiniere, hammered-copper centerpiece, pewter ewer, antiqued-silver compote, repousse brass urn)
- ~3 STONE / MARBLE (carved marble compote, alabaster footed bowl, soapstone hand-carved planter, granite mortar)
- ~3 LANTERN / CLOCHE (glass cloche over arrangement, lantern with glass panels, hurricane-glass dome, antique birdcage stand)
- ~3 WOOD / CARVED (carved walnut compote, painted Tole-ware urn, hand-carved bowl on stand, wooden trough)

━━━ BANS ━━━
- NO photographer-name drops.
- NO modern plastic / acrylic / clear-plastic vessels — these are CRAFTED, weathered, heirloom register.
- NO blooms in the entry — just the EMPTY vessel. (Blooms come from other axes.)
- NO bare "vase" — name the MATERIAL + finish + form.
- NO action — the vessel is static at rest.

━━━ FORMAT ━━━
Each entry: 25-45 words. Format: "NAME CAPS — body text naming archetype + material + finish + form qualifier + emotional register".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
