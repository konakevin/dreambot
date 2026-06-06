#!/usr/bin/env node
/**
 * CYBORG_WOMAN_MATERIAL — dedicated material/finish axis for the
 * MechBot cyborg-woman path (chrome / brass / pearl / xenomaterial /
 * composite / coral / amber / etc.). Visual surface character of the
 * mechanical panels and structures. 30-50 word descriptions.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/cyborg_woman_material.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MATERIAL entries for MechBot's cyborg-woman path — the visual surface character of her mechanical panels and structural components. Each entry is ONE distinct material/finish that the chrome/mechanical panels are RENDERED IN. No title-caps prefix — open directly with the material descriptor.

━━━ THE BAR ━━━
Every entry is ONE distinct cyborg-panel MATERIAL with specific finish character: SURFACE TYPE (brushed / hammered / polished / lacquered / weathered) + COLOR + SECONDARY DETAIL (grain / glow / inlay / patina / circuit-traces / dust / mirror-reflection). 30-50 words, single sentence/phrase.

━━━ EXAMPLE PHRASINGS (mirror this register exactly — NO title prefix) ━━━
"Brushed gunmetal-titanium with cold blue-grey matte finish, fine horizontal grain running across every panel catching ambient light with military precision and zero reflective glare."
"Antique verdigris-copper steampunk plating with green-patina weathering pooling in every seam, hammered hand-finish, visible rivet heads along every structural joint."
"Bioluminescent-coral organic plating with pulsing soft pink-and-amber glow emanating from within marine-textured structures, organic-tech aesthetic with living-material warmth."
"Pearl-ivory ceramic with hand-painted indigo circuitry traced in fine brushwork across every smooth glaze panel, Wedgwood porcelain aesthetic with cool botanical-tech detailing."
"Matte-black carbon-fiber weave with tight twill texture, light-absorbing surface broken only by glowing cyan energy-conduit seams tracing structural edges between panels."

━━━ VARIETY MANDATE (distribute across these material categories) ━━━

- ~4 CHROME / METAL POLISHED (mirror-chrome / polished platinum / brushed-stainless / mirror-silver / chromed-titanium / cold-blue brushed-steel / polished-pewter / mercury-mirror chrome)
- ~4 MATTE / DARK METAL (gunmetal-titanium matte / matte-black carbon-fiber / matte-charcoal anodized / black-oxide blued steel / matte-bronze tactical / matte-graphite military / matte-blackened nickel)
- ~3 ANTIQUE / WEATHERED (verdigris-copper / antique-brass / aged-bronze patina / oxidized iron-rust / weathered-pewter / hammered-copper / aged-steel forge / oxidized-silver tarnish)
- ~3 LACQUER / ENAMEL (oxblood-burgundy lacquer / jet-black urushi lacquer / red-and-gold cinnabar lacquer / deep-emerald enamel / cobalt-blue enamel / aubergine lacquer / champagne enamel)
- ~3 CERAMIC / PORCELAIN (pearl-ivory ceramic / blue-and-white porcelain / celadon-jade ceramic / Wedgwood-blue porcelain / cracked-glaze ceramic / iron-oxide raku / matte-bisque porcelain)
- ~3 GLASS / CRYSTAL (obsidian-glass / smoky-quartz glass / amber-resin / clear-crystal lattice / opal-iridescent glass / black-tourmaline crystal / spinel-pink glass)
- ~3 BIOLUMINESCENT / ORGANIC (bioluminescent-coral / mycelium-fiber / luminous-jellyfish translucent / sea-anemone tendril / fungal-bracket plate / cell-walled chitin / coral-and-pearl)
- ~3 PRECIOUS METAL (rose-gold / champagne-gold / pale-gold leaf / hammered-platinum / silver-vermeil / palladium-silver / bronze-mosaic gilt)
- ~3 EXOTIC / FANTASTICAL (fossilized-amber resin / opal-iridescent / dichroic-glass shifting / holographic-sheen / iridescent-shell mother-of-pearl / mercury-liquid surface / aurora-shifting alloy)
- ~3 INDUSTRIAL / FUNCTIONAL (riveted-iron plate / hex-bolt panels / oil-stained steel / industrial-aluminum / forge-finished steel / scratched-steel battle-worn / corroded-cast-iron)
- ~3 SOFT / WARM TEXTILE-CODED (felted-fiber composite / woven-aramid lace / silk-wrapped armature / matte-velvet skin-cover / leather-bound armature / silk-and-chrome quilted)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- NO title-caps prefix — open directly with the material descriptor.
- ALWAYS name SURFACE TYPE (brushed / hammered / polished / lacquered / weathered / matte / glossy / etc.).
- ALWAYS name primary COLOR (gunmetal-titanium / pearl-ivory / oxblood-burgundy / etc.).
- ALWAYS include a SECONDARY DETAIL (grain / glow / inlay / patina / circuit-traces / mirror-reflection / brushwork / etc.).
- ALWAYS end with a register/aesthetic tag ("military precision", "antique-finish", "marine-warmth", "Wedgwood porcelain aesthetic", etc.).
- Body is 30-50 words.

━━━ BANS ━━━
- NO photoreal name-drops (no Hasselblad / no Leica / no photographer).
- NO sci-fi technobabble — material descriptors only.
- NO references to the cyborg subject — material register only.
- NO modern-brand names (no specific product names).
- NO repeating exact same material descriptor.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
