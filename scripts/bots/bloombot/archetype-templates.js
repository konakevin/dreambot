/**
 * bloombot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

module.exports = {
  BLOOMBOT_GIANT_FLOWER: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, giant_form, base_surround, sky_ascent } = slots;
    // 50/50 — a FOREST of giant flowers, or a lone colossal one.
    const forest = Math.random() < 0.5;

    const ascentSection = sky_ascent
      ? `
━━━ THE SKY / CANOPY ABOVE ━━━
${sky_ascent}

`
      : '';

    return `You are a fantasy concept-art painter writing GIANT-FLOWER scenes for BloomBot — a single flower grown impossibly tall, as TALL as a giant redwood, but the stalk is a LUSH GREEN FLOWERING VINE-STEM, not a tree. (A "Jack and the Beanstalk" nod — but NO Jack, NO human.) Output 90-130 words, comma-separated phrases for Flux. NO preamble, NO labels.

━━━ THE #1 RULE — MONUMENTAL SCALE, SHOT FROM FAR BACK (READ FIRST) ━━━
This is a WIDE LANDSCAPE SHOT, never a close-up flower portrait. The giant flower TOWERS HIGH above a TINY DWARFED WORLD far below, with LOTS OF OPEN SKY around and above it. The whole point is SCALE CONTRAST: the colossal flower + its long stem fill the vertical frame, while the ground world (trees, hills, the whole biome) is shrunk to a tiny strip at the very bottom. The camera is pulled FAR BACK and low, looking up — you can see the entire towering stem from the tiny ground to the bloom high in the sky. If the ground world isn't clearly tiny and far below, the scale has failed. NEVER a botanical specimen study, NEVER a cropped close-up of the bloom.

━━━ THE FLOWER ON A COLOSSAL FLOWERY VINE-STEM ━━━
A SINGLE giant flower towers redwood-tall on a thick, soft, GREEN FLOWERING VINE-STEM — a giant beanstalk-like stalk that is leafy and viny, wrapped in tendrils, climbing-leaves and small buds, CURVING and twisting organically as it climbs (never a straight rigid pole). The stem MUST read as a living flower-stem / vine, NEVER a woody tree-trunk, NEVER bark. One enormous bloom crowns it, high overhead. ${
      forest
        ? 'COMPOSITION = FOREST: a GROVE of these colossal flowering vine-stems, twisting up in receding ranks into misty distance, shafts of light falling between them.'
        : 'COMPOSITION = SOLO: ONE lone colossal flowering vine-stem, curving up tree-tall, dwarfing the ordinary forest and world around its base.'
    }

━━━ THE GIANT FLOWER + ITS FLOWERY STEM (the hero — the ROSTER HERO species) ━━━
${giant_form}

Render the HERO species from the roster below as the colossal bloom crowning a towering, thick, GREEN, leafy, twisting FLOWER-VINE-STEM in the hero's theme color. ${
      forest
        ? 'Multiple such flowering vine-stems form the grove — the nearest fully detailed, others receding into mist.'
        : 'One dominant flowering vine-stem, with ordinary normal-size trees and ferns dwarfed at its base.'
    }

━━━ THE GROUND WORLD AT THE BASE (normal-scale — proves the scale) ━━━
${base_surround}

Render the dwarfed ground world EXACTLY as described just above — whatever biome + tiny details it names — all DWARFED so the giant reads as monumental. Do NOT default to a pine forest. NO humans, and NEVER a person for scale (any scale-prover animal comes ONLY from the description above, if it names one).
${ascentSection}━━━ AMBIENT LIGHTING ━━━
${lighting}

Soft misty light — shafts of god-rays falling around the towering flower-stem, gentle atmospheric depth.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

The HERO is the giant flower on its colossal flowery vine-stem. Supporting + filler species grow at the base at normal scale. Every bloom strictly within the palette colors.

━━━ COMPOSITION CRAFT ━━━
  • Looking UP at, or across at, a flower towering on a thick GREEN FLOWERY VINE-STEM that CURVES and twists as it climbs — organic, leafy, never a straight rigid pole
  • Strong scale contrast: the colossal leafy stem vs the dwarfed normal-scale ground world at the base
  • ${forest ? 'Receding ranks of giant flowering vine-stems + light-shafts + mist = grove depth' : 'ONE monumental flowering vine-stem + a dwarfed normal world at its base'}
  • Open sky / canopy light far above

━━━ HARD BANS ━━━
NO humans / figures / Jack / people-for-scale anywhere. NO tunnel / wormhole / 360° engulfment / kaleidoscope / wall of flowers. The stalk MUST be a LUSH GREEN LEAFY FLOWER-VINE-STEM — NEVER a woody tree-trunk, NEVER bark, NEVER a straight rigid column.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[${
      forest
        ? 'a grove of flowers towering on thick GREEN FLOWERY VINE-STEMS curving up into misty light-shafts'
        : 'ONE colossal flower towering on a thick GREEN leafy FLOWERY VINE-STEM that curves and twists upward, dwarfing the world at its base'
    }, NO humans], [the giant flower + its lush green leafy twisting vine-stem in the hero color], [the dwarfed normal-scale ground world at the base for scale, as described], [god-ray light-shafts + mist]${sky_ascent ? ', [sky / canopy above]' : ''}, [palette colors strictly + mood]

CRITICAL — a giant flower on a LUSH GREEN LEAFY FLOWERY VINE-STEM that curves organically as it climbs, redwood-tall. NEVER a woody tree-trunk, NOT a tunnel, NOT a wall, NO humans / NO person for scale.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },
  BLOOMBOT_FLOWER_FRIENDS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, flower_focal_cluster, hero_pollinator, magical_particles } = slots;

    const particlesSection = magical_particles
      ? `
━━━ MAGICAL PARTICLES — render visibly in the scene ━━━
${magical_particles}

A specific atmospheric detail adding magic-pretty texture (NOT competing with the insect or flower).

`
      : '';

    return `You are a fantasy-realism concept-art painter writing WHIMSICAL ENCHANTED FLOWER + CUTE POLLINATOR-CAST scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — ENCHANTED MULTI-FLOWER GARDEN WITH A CAST OF CUTE INSECTS ━━━

The unifying mandate: a WHIMSICAL ENCHANTED garden vignette with MULTIPLE pretty hero flowers + MULTIPLE cute pleasant pollinators (3-6+ insects across the scene). PULLED-BACK framing — a wider garden-vignette view, NOT a tight macro close-up of a single bloom. Multiple flower species blooming together; multiple butterflies / bumblebees / dragonflies / ladybugs / fireflies / moths flying / landed / hovering throughout. Happy enchanted fairytale storybook energy.

THE LOOK — Studio Ghibli enchanted garden / Disney secret-garden discovery / Beatrix Potter watercolor / IG vivid-pollinator-cast / Pinterest enchanted-flower-meadow:
- MULTIPLE HERO FLOWERS (3-5+ different species blooming together as co-hero) — SOFT PASTEL color register (varied across the FULL color spectrum, not biased toward pinks/purples/reds), varied shapes, fills the scene with floral abundance
- A CAST OF 3-6+ CUTE PLEASANT POLLINATORS — flying / landed / hovering THROUGHOUT the scene at different positions, different species, multiple sizes
- CUTE-RENDERED INSECTS — friendly, charming, slightly storybook-charming-cute (NOT scary, NOT menacing, NOT realistic-creepy-detailed) — bigger soft eyes, fuzzier rounder bodies, friendly poses
- PULLED-BACK GARDEN VIGNETTE — a wider intimate-garden view (NOT macro single-flower close-up — that's the closeup path)
- WHIMSICAL ENCHANTED AMBIENT — vivid soft pastel light, magical-pretty atmosphere, optional particles, fairytale storybook feel
- CRISP SHARP-LAYERED BACKGROUND — more blooms / soft sky / pastel wash in crisp tack-sharp detail

━━━ COLOR REGISTER — SOFT WATERCOLOR PASTEL (MANDATORY) ━━━

Every visible flower is rendered in a SOFT PASTEL color register — soft watercolor hues, NOT vivid saturated jewel-tones. Think:
  - PALE PINK / SOFT CORAL / DUSTY PEACH (not hot-pink / magenta)
  - SOFT LAVENDER / PALE VIOLET / PERIWINKLE (not deep-purple / electric-violet)
  - PALE BABY-BLUE / SKY-BLUE / SOFT CORNFLOWER (not cobalt / electric-blue)
  - SOFT BUTTERCUP-YELLOW / PALE GOLD / CREAM (not vivid sunflower-yellow)
  - PALE APRICOT / SOFT TANGERINE / DUSTY ORANGE (not vivid neon-orange)
  - PALE TURQUOISE / SEAFOAM / MINT (refreshing soft additions)
  - SOFT IVORY / OFFWHITE / CREAM
  - DUSTY ROSE / PALE MAUVE / BLUSH

The whole image reads as a soft watercolor painting / pastel-color-palette / IG vivid-magical-hour register. NEVER vivid saturated jewel-tone / electric / neon.

⚠️ COLOR DISTRIBUTION MANDATE — across the pool of 25, the dominant flower colors must distribute evenly:
  - ~4 BLUE-DOMINANT (soft baby-blue / periwinkle / pale-cornflower / pale-turquoise)
  - ~4 VIOLET-DOMINANT (soft lavender / pale-violet / pale-lilac)
  - ~4 YELLOW-DOMINANT (soft buttercup / pale-gold / pale-cream)
  - ~4 WHITE/CREAM-DOMINANT (ivory / offwhite / cream / soft-white)
  - ~3 ORANGE-DOMINANT (pale apricot / soft tangerine / dusty orange)
  - ~3 PINK-DOMINANT (pale-pink / dusty-rose / blush)
  - ~3 MULTI-COLOR-RAINBOW (mixed soft-pastel across the spectrum)

NEVER bias toward pink/purple/red. The full spectrum is in play, soft-pastel registers only.

━━━ HARD MANDATES (every render) ━━━

1. **MULTIPLE HERO FLOWERS** — 3-5+ different flower species blooming together as co-hero. Mix shapes (dahlias / cosmos / peonies / daisies / tulips / lupines / etc.) and colors for whimsical floral abundance. NEVER a single hero — the scene is FULL OF FLOWERS.

2. **A CAST OF 3-6+ CUTE POLLINATORS WITH A FOCAL HERO** — describe MULTIPLE pleasant insects at different positions and actions. CRITICAL — ONE of the cast is the FOCAL POLLINATOR rendered FRONT-AND-CENTER, larger and more prominent (sharp focus + vivid color contrasting against the soft pastel background + crisp wing-pattern / fuzzy-body detail), so the viewer's eye lands on it first. The supporting 2-4+ insects fill the scene with life — smaller, in midground, hovering in the background, perched on leaves — without competing with the focal hero.

3. **CUTE-RENDERED, NOT MENACING** — every insect rendered in a charming storybook-cute way. Soft fuzzy bodies, friendly proportions, slightly-stylized cute eyes, friendly poses (drinking nectar peacefully, gently hovering, sleepy-cozy landed). NEVER detailed-realistic-creepy / menacing / scary / oversized / aggressive. Think Disney secret-garden cute, not nature-documentary realistic.

4. **PLEASANT INSECTS ONLY** — bumblebees / honeybees / carpenter-bees / monarch butterflies / swallowtail butterflies / blue morpho butterflies / painted lady butterflies / pink-purple butterflies / fritillary butterflies / luna moths / hummingbird hawkmoths / dragonflies (blue / green / red) / damselflies / ladybugs / fireflies / lacewings. NEVER spiders / wasps / hornets / flies / mosquitoes / centipedes / earwigs / cockroaches / beetles-other-than-ladybugs / any creepy-crawly.

5. **PULLED-BACK GARDEN VIGNETTE — NOT MACRO** — the framing is a wider intimate-garden view where you can see multiple flower clusters and multiple insects all in the same scene. NOT extreme macro (that's closeup's territory) — pulled back enough to see a full whimsical multi-flower multi-insect tableau.

6. **CRISP SHARP-LAYERED BACKGROUND** — crisp floral mass / sky / pastel wash behind, tack-sharp detail.

7. **ENCHANTED HAPPY MOOD** — fairytale storybook joy. Soft pastel magical light bathing everything. Happy, peaceful, welcoming, magical-pretty. NEVER moody / dark / dramatic / harsh / scary.

🚫 KEY GUARDS:
  • MULTIPLE flowers + MULTIPLE cute storybook insects — never a single-flower-single-insect macro, never realistic-creepy bugs (no spiders / wasps / flies)
  • Flowers growing in the wild — never interior / vase / cut-flower
  • Soft enchanted magical-pretty light — never harsh / moody / dark
  • 🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO HANDS, NO BODY PARTS anywhere in frame 🚫🚫🚫

━━━ THE MULTI-FLOWER FOCAL SCENE (3-5+ hero flowers + supporting cluster) ━━━
${flower_focal_cluster}

━━━ THE POLLINATOR CAST (3-6+ cute pleasant insects at different positions) ━━━
${hero_pollinator}

The insects are CUTE-rendered (charming storybook-friendly, NOT realistic-creepy), positioned throughout the scene (landed / hovering / flying / perched), each interacting with flowers or air around them.
${particlesSection}━━━ COMPOSITION CRAFT — WHIMSICAL ENCHANTED GARDEN VIGNETTE ━━━

  • PULLED-BACK GARDEN VIEW — wider intimate-garden vignette, NOT a tight macro close-up
  • FOREGROUND: 3-5+ different flower species clustered together as co-hero, filling the lower 50-65% of frame
  • MIDDLE/AROUND: 3-6+ cute pollinators positioned at different spots in the scene (some on flowers, some hovering, some flying in the background space)
  • BACKGROUND: crisp sharp layers of more blooms / soft sky / pastel wash in tack-sharp detail
  • DEPTH: foreground-sharp flowers + sharp insects in middle / crisp sharp-layered background
  • COLOR: rich saturated multi-color foreground (mix flower colors freely), crisp sharp-layered pastel background
  • MOOD: enchanted happy fairytale storybook — whimsical, peaceful, welcoming, magical-pretty

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting as SOFT ENCHANTED MAGICAL light bathing the scene — warm pastel ambient, gentle warm-pink or warm-amber or soft-cream or pale-lavender wash. The light is whimsical and fairytale-pretty, NOT harsh / dramatic / moody / dark. Think Studio Ghibli enchanted garden + Disney secret-garden discovery + IG vivid-magical-hour.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 3-5 species from the roster as multi-hero blooming together. Mix shapes (large bloom + medium bloom + delicate bloom) and colors freely for whimsical floral abundance.

━━━ DEFAULTS TO RESIST ━━━
MULTI flowers + MULTI cute insects (not single-flower-single-insect, not realistic-creepy bugs); pulled-back vignette not macro; soft-pastel light; only roster species; ABSOLUTE HARD BAN on humans / figures / silhouettes / hands.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[WHIMSICAL ENCHANTED garden vignette PULLED-BACK composition with 3-5+ multi-species flowers blooming together filling lower 50-65% of frame], [the 3-6+ cute pollinator cast at different positions throughout the scene — landed / hovering / flying / perched — explicit species + positions], [supporting crisp sharp-layered background of more soft blooms / pastel sky-wash]${magical_particles ? ', [magical particles drifting in the air]' : ''}, [soft enchanted magical pastel ambient light bathing the scene], [storybook-cute insect rendering — friendly charming NOT realistic-creepy], [shallow DOF, tack-sharp detail, fairytale-storybook aesthetic — Studio Ghibli / Disney secret-garden / IG vivid-magical-hour]

CRITICAL — MULTIPLE pretty flowers + MULTIPLE cute storybook insects in a PULLED-BACK enchanted-garden VIGNETTE. Happy welcoming whimsical mood. CUTE not menacing insects. ABSOLUTE HARD BAN ON HUMANS.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_FLOWER_HUMMING_BIRDS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, flower_focal_cluster, hummingbird_cast, magical_particles } = slots;

    const particlesSection = magical_particles
      ? `
━━━ MAGICAL PARTICLES — render visibly in the scene ━━━
${magical_particles}

A specific atmospheric detail adding magic-pretty texture (NOT competing with the hummingbirds or flowers).

`
      : '';

    return `You are a fantasy-realism concept-art painter writing VIBRANT ENCHANTED HUMMINGBIRD-AND-FLOWER scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — VIBRANT ENCHANTED GARDEN WITH A CAST OF IRIDESCENT HUMMINGBIRDS ━━━

The unifying mandate: a VIBRANT ENCHANTED garden vignette with MULTIPLE hummingbird-attracting flowers (trumpet vine, fuchsia, salvia, hibiscus, bee balm, columbine, butterfly bush, cardinal flower, lupine, foxglove, petunia, lantana, agastache, penstemon, etc.) + 2-4+ iridescent jewel-tone HUMMINGBIRDS positioned dynamically throughout the scene. PULLED-BACK framing — a wider garden-vignette view, NOT a tight macro. Vibrant saturated jewel-tone color register — the flowers and birds wear their natural bold colors.

THE LOOK — Audubon-meets-Studio-Ghibli enchanted garden / National-Geographic hummingbird-magazine spread / IG vivid-hummingbird-feeder / vibrant tropical-garden energy:
- MULTIPLE HERO FLOWERS (3-5+ different hummingbird-attracting species blooming together) — vibrant saturated jewel-tone colors (red trumpet vine, fuchsia, vivid magenta bee balm, scarlet salvia, hot-pink fuchsia, bright orange hibiscus, deep purple lupine)
- A CAST OF 2-4+ IRIDESCENT HUMMINGBIRDS — hovering / sipping nectar / mid-flight throughout the scene at different positions, varied species, varied poses
- IRIDESCENT JEWEL-TONE PLUMAGE — ruby-throated / emerald-back / blue-violet crown / fiery-orange / magenta / metallic-green / sapphire — each hummingbird with a distinctive iridescent jewel-tone color story, wings often in motion-blur showing rapid flight
- ONE FOCAL HUMMINGBIRD — front-and-center, larger, sharply rendered with crisp iridescent detail, the viewer's eye lands here first
- PULLED-BACK GARDEN VIGNETTE — wider intimate-garden view (NOT extreme macro close-up — that's the closeup path)
- CRISP SHARP-LAYERED BACKGROUND — crisp floral mass / sky / leaves in shallow DOF
- VIBRANT NATURAL LIGHT — warm sunlight / dappled light / golden-hour ambient with rich saturated color story

━━━ HARD MANDATES (every render) ━━━

1. **HUMMINGBIRDS ARE THE PRIMARY HERO — FLOWERS ARE SUPPORTING BACKDROP** — the hummingbirds are the focal subject of every render. The flowers are the supporting garden context they're interacting with. The viewer's eye lands on the FOCAL HUMMINGBIRD first, then notices the flowers second. NEVER make the flowers the visual subject with hummingbirds as tiny accents. Hummingbirds are FRONT-CENTER and large; flowers fill the foreground beautifully but as backdrop.

2. **A CAST OF 2-4+ IRIDESCENT HUMMINGBIRDS WITH A LARGE FOCAL HERO** — describe 2-4+ hummingbirds at different positions and poses. CRITICAL — ONE is the FOCAL HUMMINGBIRD rendered FRONT-AND-CENTER, LARGE (occupying meaningful frame real estate — clearly visible and recognizable, NOT a tiny dot lost in flowers), sharply detailed with vivid iridescent jewel-tone plumage popping against the scene. Supporting hummingbirds in midground / hovering at other blooms / mid-flight in soft sharp-layered depth. The focal hummingbird is the FIRST thing the viewer sees.

3. **HUMMINGBIRD-ATTRACTING FLOWERS AS SUPPORTING BACKDROP** — 3-5+ different hummingbird-magnet species in vibrant saturated jewel-tone colors (trumpet vine / fuchsia / salvia / hibiscus / bee balm / columbine / butterfly bush / cardinal flower / lupine / foxglove / petunia / lantana / agastache / penstemon / honeysuckle / morning glory). The flowers fill the foreground/midground as gorgeous garden context but DO NOT compete with the hummingbirds — they're the stage, not the star. NO soft-pastel — vibrant saturated jewel-tone colors.

3. **IRIDESCENT JEWEL-TONE PLUMAGE** — describe each hummingbird's iridescent color story explicitly (ruby-throated / emerald-back / blue-violet crown / magenta-throat / metallic-green-and-fiery-orange / sapphire-throated / iridescent-coppery / etc.). Iridescent metallic shimmer is the signature.

4. **DYNAMIC HUMMINGBIRD POSES** — hovering with wings in rapid motion-blur, sipping nectar from a tubular bloom with long beak inserted, hovering mid-flight, banking sideways, tail-feathers spread, beak-to-flower drinking. The scene is ALIVE with rapid hummingbird movement.

5. **PULLED-BACK GARDEN VIGNETTE — NOT MACRO** — wider intimate-garden view where you can see multiple flower clusters and multiple hummingbirds all in the same scene. NOT extreme macro.

6. **VIBRANT SATURATED JEWEL-TONE COLOR REGISTER** — vivid bold saturated colors throughout, NOT soft-pastel (that's flower-friends' territory). Audubon-painting + tropical-garden + IG-vibrant-hummingbird-feeder palette.

7. **CRISP SHARP-LAYERED BACKGROUND** — crisp floral mass / sky / leaves in shallow DOF.

8. **NATURAL VIBRANT LIGHT** — warm sunlight / dappled light / golden-hour ambient with rich saturated color. Pretty and magical but NOT soft-pastel.

🚨 HUMMINGBIRD-PRESENCE — THIS IS THE WHOLE POINT: every render contains AT LEAST 2 LARGE clearly-visible iridescent hummingbirds, ONE focal hummingbird LARGE + FRONT-AND-CENTER as the primary hero (never a tiny dot lost in the flowers), the others populating the scene. The hummingbirds MUST be NATURALISTIC real-world species (Audubon-level anatomy + iridescent plumage) — never fantasy crowns / tiaras / cartoony rendering, never insects, never other birds (songbird / parrot / bird-of-paradise).

🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS / FIGURES / SILHOUETTES / FACES / BUST-PORTRAITS anywhere; the garden is empty of any human presence 🚫🚫🚫

━━━ THE MULTI-FLOWER FOCAL SCENE (3-5+ hummingbird-attracting blooms) ━━━
${flower_focal_cluster}

━━━ THE HUMMINGBIRD CAST (2-4+ iridescent hummingbirds with focal hero) ━━━
${hummingbird_cast}

The focal hummingbird is rendered FRONT-AND-CENTER with crisp iridescent jewel-tone detail. Supporting hummingbirds fill the scene at different positions.
${particlesSection}━━━ COMPOSITION CRAFT — VIBRANT ENCHANTED HUMMINGBIRD GARDEN VIGNETTE ━━━

  • PULLED-BACK GARDEN VIEW — wider intimate-garden vignette, NOT a tight macro close-up
  • FOREGROUND: 3-5+ different hummingbird-attracting flower species in vibrant saturated jewel-tone colors filling the lower 50-65% of frame
  • MIDDLE: 2-4+ iridescent hummingbirds positioned dynamically (focal hero front-and-center + supporting cast hovering / sipping / mid-flight)
  • BACKGROUND: crisp sharp layers of more vibrant blooms / soft sky / leaves in tack-sharp detail
  • DEPTH: sharp foreground flowers + sharp focal hummingbird / crisp background
  • COLOR: rich vibrant saturated jewel-tone foreground (NOT soft-pastel), crisp sharp-layered background
  • MOOD: vibrant enchanted magical-pretty — Audubon-meets-Studio-Ghibli, lively, magical

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting as VIBRANT WARM NATURAL light bathing the scene — warm sunlight / dappled light / golden-hour ambient with rich saturated color story. NOT harsh / dramatic / moody / dark. Think Audubon-painting + tropical-garden + IG-vibrant-hummingbird-feeder.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 3-5 hummingbird-attracting species from the roster as multi-hero blooming together. Vibrant saturated jewel-tone colors.

━━━ DEFAULTS TO RESIST ━━━
2+ hummingbirds (not single) in a pulled-back garden vignette (not macro); vibrant saturated jewel-tone (not soft-pastel); hummingbirds only (no insects / other birds); flowers growing in the wild; pretty enchanted vibrant light (not harsh / moody / dark); only roster species; ABSOLUTE HARD BAN on humans / figures / silhouettes.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order (HUMMINGBIRDS LEAD) ━━━
[the LARGE FOCAL HUMMINGBIRD front-and-center — primary hero of the frame — explicit species + iridescent jewel-tone plumage + dynamic pose (hovering / sipping / mid-flight) + wings in motion-blur + beak-to-flower or beak-extended detail — VIEWER'S EYE LANDS HERE FIRST], [the 1-3 supporting hummingbirds at different positions throughout the scene — hovering at other blooms / mid-flight in midground / banking sideways in sharp-layered depth — also with iridescent plumage], [the vibrant saturated jewel-tone hummingbird-attracting flowers as garden BACKDROP — 3-5+ species blooming together filling foreground/midground as supporting context (NOT competing with the hummingbirds)], [crisp sharp-layered background of soft vibrant blooms / leaves]${magical_particles ? ', [magical particles drifting in the air]' : ''}, [vibrant warm natural ambient light bathing the scene — golden-hour or dappled sunshine], [shallow DOF with hummingbirds in sharpest focus, tack-sharp detail, Audubon-meets-Studio-Ghibli aesthetic]

CRITICAL — LARGE FOCAL HUMMINGBIRD primary hero (NOT a tiny dot lost in flowers) + 1-3 supporting hummingbirds + vibrant jewel-tone flowers as BACKDROP (not the hero). The hummingbird is the WHOLE POINT. Naturalistic hummingbird species — no fantasy crowns. ABSOLUTE HARD BAN ON HUMANS.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_FLOWER_FANTASY: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, scale_form, floor_carpet, atmospheric_magic } = slots;

    const atmosphereSection = atmospheric_magic
      ? `
━━━ ATMOSPHERIC MAGIC — render visibly in the scene ━━━
${atmospheric_magic}

A specific atmospheric detail amplifying the surreal-magical-realism mood (NOT competing with the hero form).

`
      : '';

    return `You are a surreal-magical-realism painter writing SCALE-INVERSION FLOWER-FANTASY landscape scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — NATURAL FORMS REIMAGINED THROUGH FLOWERS + INVERTED SCALE ━━━

The unifying mandate: a surreal natural-world landscape (forest / valley / hillside / riverbed / glade / meadow) where the NATURAL ELEMENTS are CONSTRUCTED FROM FLOWERS or scale is wildly inverted. A giant flower-mushroom standing alone in a meadow, a forest where every tree is an oversized overgrown flower, a river of petals flowing through a glade, pine-trees-that-are-flowers, a hillside of tulip-mountains. The viewer's reaction: "wait, those trees are actually flowers" or "that mushroom is made of flowers."

THE LOOK — surreal-magical-realism / Studio Ghibli + Salvador Dali botanical + Yayoi Kusama meadow + Pinterest-magical-dreamscape:
- ONE hero SURREAL FLOWER-FORM dominating the frame (giant flower-mushroom / forest of flower-trees / river of petals / hillside of bloom-mountains / etc.)
- Naturalistic LANDSCAPE context — meadow, forest, valley, glade, riverbed, hillside, mountainside — but with the SCALE INVERSION as the wow-moment
- SUPPORTING FLOOR-CARPET — meadow of smaller flowers carpeting the ground around the hero form, providing the supporting bloom-mass
- vivid PASTEL DEPTH — soft pastel background with gentle depth-falloff, often with smaller versions of the hero form visible in the deep distance (implying a whole world of these surreal flower-forms)
- SOFT MAGICAL LIGHT — pretty pastel ambient, warm golden-hour or soft pastel light, surreal-vivid register

━━━ HARD MANDATES (every render) ━━━

1. **ONE SURREAL FLOWER-FORM AS PRIMARY HERO** — describe the specific scale-inversion or flower-construction explicitly (e.g., "giant flower-mushroom 30 feet tall with a cap made entirely of pink rose blooms and a stem of cascading peonies" / "forest where every tree is an oversized overgrown lupine 50 feet tall" / "river of pink-and-white petals flowing through a glade replacing where water would be"). The form is the FOCAL SUBJECT.

2. **CONSTRUCTED FROM FLOWERS OR SCALE-INVERTED** — every render's hero is EITHER (a) a natural form (tree / mushroom / hill / mountain / waterfall / etc.) constructed entirely from flowers, OR (b) a regular flower scaled up to landscape-form size (e.g., a single oversized cherry-blossom-tree-sized tulip), OR (c) a natural element replaced by flowers (river of petals / hill of blooms / lake of floating petals).

🚨 **INDIVIDUAL-FLOWER VISIBILITY (CRITICAL)** — the trees / mushrooms / forms must look like they are COVERED IN HUNDREDS OF INDIVIDUAL VISIBLE FLOWERS, NOT trees with monochrome colored leaves. Every individual flower must be recognizable as a flower (petals + center + form visible). The canopy / surface is a DENSE MASS OF DISTINCT INDIVIDUAL BLOOMS — you can count many separate flowers in the cluster.
🚫 NEVER render as "colored leaves / colored foliage / monochrome canopy / red-leaved tree" — every flower stays a visible distinct flower.

3. **NATURAL-WORLD LANDSCAPE CONTEXT** — the scene is set in a recognizable natural landscape (forest / valley / meadow / glade / hillside / riverbed / mountainside) — NOT a manmade setting. The hero form lives in this natural context.

4. **SUPPORTING FLOOR-CARPET OF SMALLER FLOWERS** — the ground around the hero form is carpeted with smaller flowers (wildflowers, mixed meadow blooms, cosmos / daisies / forget-me-nots / poppies / etc.) — providing the "flowers everywhere" foundation that supports the surreal scale-inversion.

5. **vivid PASTEL DEPTH** — soft pastel background with gentle depth-falloff. Smaller versions of the hero form often visible in the deep distance (e.g., 3-4 smaller flower-mushrooms soft on the horizon implying a whole forest of them) — this reinforces the surreal-magical-realism that this is a WORLD of these flower-forms, not just one anomaly.

6. **NATURAL FORMS ONLY** — natural landscape forms only (trees, mushrooms, hills, mountains, rivers, waterfalls, valleys, glades, meadows). NEVER animals (no flower-deer / flower-rabbit), humans, or manmade objects (no flower-houses / flower-clocks / flower-cathedrals).

7. **SOFT SURREAL-vivid LIGHT** — warm pastel ambient, golden-hour glow, surreal-magical-realism register. NOT harsh / dramatic / moody.

🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS / FIGURES / SILHOUETTES / FACES anywhere (even a tiny distant figure on a path); the flower-fantasy landscape is empty of any human presence 🚫🚫🚫

━━━ THE HERO SURREAL FLOWER-FORM ━━━
${scale_form}

This is the visual hero of the frame. The scale-inversion or flower-construction is the wow-moment.

━━━ THE FLOOR-CARPET (supporting meadow of smaller flowers) ━━━
${floor_carpet}

A dense carpet of smaller wildflowers covers the ground around the hero form, providing the "flowers everywhere" foundation.
${atmosphereSection}━━━ COMPOSITION CRAFT — SURREAL NATURAL LANDSCAPE WITH SCALE-INVERTED FLOWER-FORM ━━━

  • HERO PLACEMENT — the surreal flower-form is the FOCAL SUBJECT, centered or off-center as the dominant landscape element
  • SCALE — the hero form fills meaningful frame real-estate so the inversion reads instantly (NOT a tiny dot in the distance — but ALSO NOT macro close-up; landscape scale)
  • FOREGROUND: floor-carpet of smaller wildflowers + supporting bloom-mass
  • MIDGROUND: the hero surreal flower-form rising dominantly from the carpet
  • BACKGROUND: soft pastel depth with smaller versions of the hero form visible in the deep distance, fading away
  • DEPTH: clear foreground (sharp wildflower carpet) → midground (sharp hero form) → crisp pastel background
  • MOOD: surreal-magical-realism — naturalistic but with a wow-moment of scale-inversion

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting as SOFT SURREAL-MAGICAL-REALISM light — warm pastel ambient, soft pastel light, golden-hour glow with vivid depth. Studio Ghibli + Salvador Dali botanical + Yayoi Kusama meadow + Pinterest-magical-dreamscape register.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 2-4 species from the roster — ONE primary species that makes up the hero form + 1-3 supporting species for the floor-carpet.

━━━ DEFAULTS TO RESIST ━━━
Natural landscape forms only (no animals / manmade objects / ruins / urban / interior); landscape scale needed (not macro); the floor-carpet of smaller flowers is mandatory; soft surreal-vivid painterly light (not harsh / moody / sci-fi / neon); only roster species; ABSOLUTE HARD BAN on humans / figures / faces.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[the HERO SURREAL FLOWER-FORM dominating the frame — explicit scale-inversion or flower-construction (giant flower-mushroom / forest-of-flower-trees / river-of-petals / etc.) + made-from-flowers detail], [the natural-world landscape context (forest / valley / meadow / glade / riverbed / hillside) the form lives in], [the floor-carpet of smaller wildflowers carpeting the ground around it], [crisp pastel background with smaller versions of the hero form receding in crisp sharp overlapping layers, implying a whole world of these surreal flower-forms]${atmospheric_magic ? ', [atmospheric magic detail amplifying the surreal mood]' : ''}, [soft surreal-magical-realism pastel ambient light], [Studio Ghibli + Salvador Dali botanical + Yayoi Kusama meadow + Pinterest-magical-dreamscape aesthetic register]

CRITICAL — ONE surreal scale-inverted FLOWER-FORM is the hero. Natural landscape context. Floor-carpet of smaller flowers. NO animals / NO humans / NO manmade objects. Soft surreal-magical-realism mood.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_FLOWER_GROVE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, grove, ground, whimsy } = slots;
    const whimsySection = whimsy
      ? `
━━━ WEIRD WONDER — MANDATORY CO-HERO, RENDER IT BIG + OBVIOUS ━━━
${whimsy}

This is the WHOLE POINT of this path. Render it LARGE and UNMISTAKABLE — a true "wait, WHAT?!" moment sharing the frame with the grove, NEVER a tiny background detail. Push it to the edge of physics: gravity flipped, things floating, trees looping, scale gone wild — genuinely surreal and delightfully unhinged. If it wouldn't make a viewer do a double-take, it's TOO TAME — crank it further.

`
      : '';
    return `You are a whimsical surreal painter writing FLOWER-GROVE scenes for BloomBot — the FUN, CRAZY path. Output a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — A LORAX-TRUFFULA FOREST, BUT ENTIRELY OF FLOWERS ━━━

A Dr-Seuss / Lorax-style whimsical grove where the "trees" are giant FLUFFY POM-POM FLOWER-TREES — slender trunks crowned with enormous round downy bloom-puff canopies — joined by house-sized oversized single flowers and gleefully weird scenarios. EVERYTHING is made of flowers. Take flower-fantasy's scale-inversion and BLOW IT UP: bigger, fluffier, weirder, more fun. Nothing is too strange. Viewer's reaction: "this is a crazy-beautiful flower-Seuss world."

━━━ HARD MANDATES (every render) ━━━

1. **GIANT FLOWER-TREES AS HERO — A WILD MIX OF SHAPES + SIZES** — the beloved fluffy ROUND pom-pom Truffula trees (thin trunk, huge soft round crown) are a staple, but MIX IN MANY silhouettes in the same grove: tall narrow COLUMNAR spires, CROOKED gnarled twisted trunks, impossibly TALL beanstalk trees vanishing into the sky (dramatic look-straight-up perspective), WEEPING droopers, broad flat UMBRELLA canopies, CORKSCREW spirals, CANDELABRA branchers, tiered stacks, squat fat bonsai/baobab ones. Vary the heights wildly too. Every canopy — whatever its shape — is still built from hundreds of individual visible flowers.
2. **SOME FLOWERS GROW AS BIG AS TREES — MIND-BENDING SCALE** — in this world a single flower can tower like an oak: one colossal bloom the size of a hot-air balloon on a trunk-thick stem, an individual mega-flower standing tall as a tree. CLASH the scales in one frame — monstrous tree-sized single flowers rising among NORMAL palm-sized flowers carpeting the ground for scale. Fantastical, jaw-dropping, "how is that flower that big?!"
🚨 **INDIVIDUAL-FLOWER VISIBILITY** — the fluffy canopies must read as a DENSE MASS OF HUNDREDS OF DISTINCT INDIVIDUAL BLOOMS (petals + centers visible), NEVER monochrome fuzz or colored foliage. You can count many separate flowers in each puff.
3. **SOFT TUFTED WHIMSICAL GROUND** — rolling, bouncy, cushiony hills carpeted in tufted blooms.
4. **WEIRD IS THE POINT** — push HARD into odd, gravity-defying, impossible, surreal, unhinged territory: bend physics, flip gravity, float things, loop the trees, scale gone wild, full Dr-Seuss-on-a-bender. The crazier + more delightful, the better — tame = failure.
5. **VIVID SATURATED REAL-FLOWER COLOR** — rich saturated jewel-tone flower color in the scene's chosen theme. Soft FLUFFY TEXTURE only — NOT candy / cotton-candy / sugary / confectionery. These are REAL flowers, just oversized and fluffy.
6. **LUSH + FLOWER-FILLED** — flowers fill the whole frame, no empty space; background hills dotted with more fluffy flower-trees receding in crisp sharp layers under a clean clear sky.
7. **PURE FLOWER-WORLD** — trees, hills, and blooms only: no animals (or flower-animals), no humans, no manmade objects.

ONE positive guard: fluffy TEXTURE with real-flower COLOR (never candy / cotton-candy / lollipop language); whimsical LANDSCAPE scale (not macro); individual flowers always visible (no monochrome-fuzz canopy); no sci-fi / neon / dark / hazy. 🚫🚫 ABSOLUTE HARD BAN on humans / figures / silhouettes anywhere.

━━━ THE HERO FLOWER-GROVE (fluffy Truffula flower-forms) ━━━
${grove}

The visual hero — giant fluffy pom-pom flower-trees and/or oversized blooms, built from hundreds of distinct individual flowers.

━━━ THE SOFT TUFTED GROUND ━━━
${ground}
${whimsySection}━━━ COMPOSITION ━━━
  • HERO: the fluffy flower-tree grove (or colossal bloom) dominates the frame at whimsical landscape scale
  • FOREGROUND: soft tufted bloom-ground + the bases of the giant stems
  • MIDGROUND: towering fluffy flower-trees / oversized blooms rising over rolling hills
  • BACKGROUND: more fluffy flower-trees dotting receding hills in crisp sharp layers, clean clear sky
  • DEPTH: sharp foreground → sharp hero grove → crisp colored distance

━━━ AMBIENT LIGHTING ━━━
${lighting}

Render the rolled lighting as bright, clear, whimsical-cheerful storybook light — sunny and fresh, saturated and crisp.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Build the fluffy flower-tree canopies + oversized blooms FROM these exact species in these theme colors.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_TROPICAL_GROVE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, canopy, setting, foliage, atmosphere, whimsy } = slots;
    const whimsySection = whimsy
      ? `
━━━ HAWAIIAN DR-SEUSS WONDER — MANDATORY CO-HERO, RENDER IT BIG + OBVIOUS ━━━
${whimsy}

This is the WHOLE POINT of this path. Render it LARGE and UNMISTAKABLE — a true "wait, WHAT?!" tropical moment sharing the frame. Push to the edge of physics: gravity flipped, things floating, vines looping, scale gone wild — genuinely surreal and delightfully unhinged Hawaiian Dr-Seuss. If it wouldn't make a viewer do a double-take, it's TOO TAME — crank it further.

`
      : '';
    return `You are a whimsical surreal painter writing TROPICAL-GROVE scenes for BloomBot — the FUN, CRAZY Hawaiian path. Output a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — A HAWAIIAN DR-SEUSS JUNGLE WONDERLAND OF GIANT TROPICAL FLOWERS ━━━

A Dr-Seuss-meets-Hawaii tropical paradise where GIANT oversized tropical flowers tower like trees — blown-up whimsical scale, gleefully weird, lush and exotic. Same crazy-fun energy as the flower-grove path, but TROPICAL: hibiscus / bird-of-paradise / heliconia / plumeria / orchid blooms scaled enormous, framed by lush green monstera + palm foliage, set in a volcanic / jungle / lagoon / beach paradise. Viewer's reaction: "this is a crazy-beautiful Hawaiian flower-Seuss world."

━━━ HARD MANDATES (every render) ━━━

1. **GIANT TROPICAL FLOWER-FORMS AS HERO — WILD MIX OF SHAPES + SIZES** — oversized tropical blooms tower like trees: broad hibiscus/plumeria flower-trees, towering heliconia/ginger spires, giant bird-of-paradise fans, colossal mega-blooms, cascading vine-curtains. Mix silhouettes + heights wildly. Each is built from real, distinct tropical blooms (petals + centers visible), NEVER fuzz.
2. **SOME BLOOMS GROW AS BIG AS TREES — MIND-BENDING SCALE** — a single tropical flower can tower like a palm; clash the scales — monstrous tree-sized blooms rising among normal blooms for scale.
3. **LUSH GREEN TROPICAL FOLIAGE** — big monstera / palm / banana / fern greenery frames the scene (the Hawaiian green signature, abundant and lush).
4. **TROPICAL PARADISE SETTING** — volcanic slopes / jungle / lagoon / waterfall / beach — never temperate fields or rolling hills.
5. **WEIRD IS THE POINT** — push HARD into odd, gravity-defying, impossible, surreal Hawaiian Dr-Seuss territory. The crazier + more delightful, the better — tame = failure.
6. **VIVID SATURATED TROPICAL COLOR** — rich hot saturated jewel-tone tropical color in the scene's chosen theme. Real flowers, just oversized and lush — NOT candy / cotton-candy / sugary.
7. **LUSH + FRAME-FILLING** — flowers + foliage fill the whole frame, packed and exotic, receding in crisp sharp layers under a clean clear tropical sky.

ONE positive guard: real-flower COLOR with lush TEXTURE (never candy / cotton-candy / lollipop language); whimsical jungle LANDSCAPE scale (not macro); individual flowers always visible (no monochrome-fuzz); tropical not temperate (no rolling pom-pom hills — that's flower-grove); no sci-fi / neon / dark. 🚫🚫 ABSOLUTE HARD BAN on humans / figures / silhouettes; no animals / birds.

━━━ THE HERO GIANT TROPICAL FLOWER-FORMS ━━━
${canopy}

The visual hero — giant oversized tropical blooms + flower-trees, built from distinct individual tropical flowers.

━━━ THE TROPICAL SETTING ━━━
${setting}

━━━ THE LUSH GREEN FOLIAGE FRAMING IT ━━━
${foliage}

━━━ TROPICAL ATMOSPHERE ━━━
${atmosphere}
${whimsySection}━━━ COMPOSITION ━━━
  • HERO: the giant tropical flower-forms dominate the frame at whimsical landscape scale
  • FOREGROUND: lush green foliage + the bases of the giant stems
  • MIDGROUND: towering oversized tropical blooms rising over the paradise setting
  • BACKGROUND: more giant tropical flowers + foliage receding in crisp layers, clean clear tropical sky
  • DEPTH: sharp foreground → sharp hero blooms → crisp colored distance

━━━ AMBIENT LIGHTING ━━━
${lighting}

Render the rolled lighting as bright, clear, sunny tropical-paradise light — warm, vivid, saturated and crisp.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Build the giant tropical flower-forms FROM these exact species in these theme colors (green foliage is the framing context).

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_FLOWER_ARRANGEMENT: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, vessel, style, setting, whimsy } = slots;
    // ADDITIVE contrast mode (~50% gate, tunable). HALF the renders keep the
    // harmonious tonal/mono look (arrangement + garden share the theme); the
    // other half make the backdrop GREENERY-dominant + quieter so the vivid
    // arrangement POPS against it. Preserves the existing mono scenes, adds
    // contrast variety. Green is palette-safe (foliage is the allowed exception).
    const contrast = Math.random() < 0.5;
    const bgMandate = contrast
      ? `2. **GREEN, CONTRASTING BACKDROP — MAKE THE ARRANGEMENT POP** — the garden behind is LUSH and GREEN: rich verdant foliage, leaves, ferns, hedges and climbing greenery dominate the backdrop, with only soft, sparse, muted blooms tucked among the green. It is deliberately quieter, greener and lower-key than the arrangement so the vivid, saturated arrangement LEAPS forward as the unmistakable focal hero — strong contrast between the bold colorful arrangement and the leafy green backdrop. Still lush and full, just GREEN-led.`
      : `2. **LUSH FLOWER-GARDEN BACKDROP** — behind and around, a garden FULL of blooms (beds, borders, climbing flowers) in the same harmonious theme colors so the whole frame is packed with flowers, tonal and lush. The garden supports in softer, slightly-receding focus — it NEVER competes with or overwhelms the hero arrangement.`;
    const bgBuildLine = contrast
      ? `Build the hero ARRANGEMENT from these exact species in these theme colors, vivid and saturated. Render the garden backdrop as LUSH GREEN foliage + greenery with only sparse muted blooms tucked in — so the arrangement stands out in strong contrast against the green.`
      : `Build BOTH the hero arrangement AND the lush garden backdrop FROM these exact species in these theme colors.`;
    // TROPICAL MODE (~35%, set by rollSharedDNA): a lush Hawaiian/tropical
    // arrangement variant — tropical blooms + tropical garden backdrop, overriding
    // the temperate cottage/English-garden cues. Flower engine already supplied
    // tropical species (biome=tropical) for the roster.
    const tropicalSection = sharedDNA.tropical
      ? `
━━━ TROPICAL VARIANT — render this as an UNMISTAKABLY HAWAIIAN / TROPICAL arrangement ━━━
This MUST read as tropical AT A GLANCE. FEATURE the big, bold, iconic tropical blooms prominently as the hero — bird-of-paradise, hibiscus, heliconia, plumeria, anthurium, torch ginger (these loud Hawaiian flowers up front and unmissable) — with dramatic glossy MONSTERA + PALM + fern FOLIAGE woven through and framing it. Keep the rolled vessel + placement, but set the whole scene in a LUSH TROPICAL paradise — a lanai / jungle / glasshouse bursting with monstera, palm fronds and tropical blooms. Vivid, hot, saturated tropical color. Make it pure Hawaii.

`
      : '';
    const whimsySection = whimsy
      ? `
━━━ A WILD "POP" — GORGEOUS SURREAL FLOURISH (render it boldly) ━━━
${whimsy}

Channel flower-grove's playful "wait, WHAT?!" energy INTO this arrangement — push it bold and obvious, BUT keep the arrangement exquisitely beautiful and well-designed. The pop ELEVATES the arrangement, never wrecks it.

`
      : '';
    return `You are an ornate floral still-life painter / editorial-florist photographer writing FLOWER-ARRANGEMENT scenes for BloomBot. Output a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — A LAVISH FLORIST ARRANGEMENT AS THE HERO, IN A LUSH FLOWER GARDEN ━━━

An exquisitely-designed, ornate flower arrangement in a beautiful vessel is the unmistakable FOCAL HERO, set against a lush flower-garden backdrop bursting with blooms everywhere. Dutch Golden-Age still-life (van Huysum / Bosschaert) meets high-end editorial florist couture — abundant, layered, museum-quality. The whole frame is flowers: the ornate arrangement up front, the flower-packed garden behind.

━━━ HARD MANDATES (every render) ━━━

1. **THE ORNATE ARRANGEMENT IS THE HERO** — a lavish, densely-packed, exquisitely-composed flower arrangement in the vessel dominates the frame (60%+), the sharp focal point. Multi-tier depth WITHIN the arrangement itself — blooms at many heights, depths and angles. Gallery still-life quality: every bloom distinct, rich, deliberate.
${bgMandate}
3. **THE VESSEL + PLACEMENT** — render the rolled vessel and its placement exactly; the arrangement sits IN/ON it, in the rolled garden setting.
4. **INDIVIDUAL-FLOWER VISIBILITY** — every bloom reads as a distinct flower (petals + centers visible), in the arrangement AND the garden — never a blurry mass or colored fuzz.
5. **VIVID SATURATED REAL-FLOWER COLOR** — rich jewel-tone color strictly in the scene's chosen theme; ornate, beautiful, full.
6. **LUSH + FRAME-FILLING** — no empty/barren space; the arrangement overflowing and abundant, the garden dense behind, a clean clear sky/light above.

ONE positive guard: always lush and abundant (never sparse / thin / minimal); show the WHOLE ornate arrangement in its garden setting (not a macro of 2-3 blooms); no sci-fi / neon / dark. 🚫🚫 ABSOLUTE HARD BAN on humans / faces; no animals / insects. (The vessel + a table / pedestal / bench / garden wall are REQUIRED and allowed — not "manmade objects" to avoid here.)

━━━ THE VESSEL ━━━
${vessel}

━━━ THE ARRANGEMENT DESIGN ━━━
${style}

The arrangement is built in this design style, lush and abundant, the clear focal hero.

━━━ THE PLACEMENT + LUSH GARDEN BACKDROP ━━━
${setting}
${tropicalSection}${whimsySection}━━━ COMPOSITION ━━━
  • HERO: the ornate flower arrangement in its vessel, dominant + sharp in the foreground/center
  • MIDGROUND: the vessel base + the surface it rests on (table / steps / ground / pedestal) + the nearest garden blooms
  • BACKGROUND: the lush flower garden receding in soft layered depth, packed with blooms, clean clear sky/light above
  • DEPTH: sharp hero arrangement → softer garden layers → crisp colored distance

━━━ AMBIENT LIGHTING ━━━
${lighting}

Render the rolled lighting as soft, beautiful, editorial still-life light — luminous and flattering on the blooms, gently dappled garden light, saturated and crisp.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

${bgBuildLine}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_DESERT_BLOOM: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, desert_anchor, bloom_explosion, atmospheric_magic } = slots;

    const magicSection = atmospheric_magic
      ? `
━━━ ATMOSPHERIC MAGIC — render visibly in the scene ━━━
${atmospheric_magic}

A specific atmospheric detail amplifying the southwest-desert mood (NOT competing with the desert + bloom explosion).

`
      : '';

    return `You are a desert-southwest concept-art painter writing CACTUS-AND-WILDFLOWER-EXPLOSION landscape scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — DESERT LANDSCAPE JUXTAPOSED WITH AN EXPLOSION OF WILDFLOWERS ━━━

The unifying mandate: a vivid southwest-desert landscape (saguaro / joshua-tree / agave / mesa / red-rock / sand-dune) with a DRAMATIC SUPERBLOOM EXPLOSION of vivid wildflowers carpeting the desert floor, climbing the rocks, blooming between and through the cactus arms. Dry-desert texture + lush flower-abundance = the surreal juxtaposition that makes every render pop.

THE LOOK — Sonoran-superbloom / Arizona-after-spring-rain / IG-magical-desert-magazine:
- A RECOGNIZABLE southwest desert anchor (saguaro / joshua-tree / agave / yucca / prickly-pear / barrel-cacti / red-rock canyon / mesa / sand dunes)
- A DRAMATIC EXPLOSION OF WILDFLOWERS carpeting the desert floor + rocky crevices + climbing around cactus bases — vivid saturated jewel-tone colors (red / orange / coral / magenta / vivid pink / yellow-gold / sapphire / royal-purple)
- SOUTHWEST PALETTE — terracotta red-rock + golden-amber sand + deep cobalt desert sky + warm tan + vivid wildflower jewel-tones — NOT soft pastel
- DRY-DESERT TEXTURE — visible saguaro ribs, agave-spike detail, sand-grain dunes, weathered red-rock surface (the desert reads as REAL desert)
- MULTI-TIER DEPTH — sharp foreground bloom-explosion + midground desert anchors + deep distance with mesa / mountain silhouettes receding in soft depth
- VIVID NATURAL LIGHT — bright southwest sun, golden-hour or strong midday-amber, vivid saturated color story

━━━ HARD MANDATES (every render) ━━━

1. **DESERT ANCHOR IS RECOGNIZABLE** — explicitly name + describe the southwest desert anchor (e.g., "towering saguaro cacti 20-30 ft tall with visible vertical ribs and outstretched arms," "joshua-tree grove with spiky branched silhouettes," "agave-and-yucca field with bayonet-spike leaves," "red-rock canyon walls with sandstone striations"). The desert anchor reads as REAL desert geography.

2. **DRAMATIC WILDFLOWER EXPLOSION** — describe a dense vivid carpet of wildflowers exploding around / between / through the desert anchor — specific desert-bloom species (desert-marigold / Indian-paintbrush / desert-mariposa / desert-globemallow / lupine / California-poppy / Ocotillo-bloom / Cholla-flower / desert-rose / Prickly-pear-flower / Cardinal-flower / desert-sage / brittlebush / penstemon / chuparosa / desert-bluebell / Mojave-aster). Vivid saturated colors.

3. **VIVID SATURATED SOUTHWEST PALETTE** — terracotta + golden + deep-cobalt + warm-tan + vivid wildflower jewel-tones (red / coral / magenta / orange / pink / yellow / sapphire / purple). NOT soft-pastel (that's flower-friends' territory) — bold and saturated.

4. **DRY-DESERT TEXTURE PRESERVED** — the desert anchors retain their desert nature — visible saguaro ribs, weathered red-rock striations, sand-grain dunes, agave bayonet-spikes, dusty texture. The wildflowers EXPLODE AROUND the dry desert, they don't transform it into a lush meadow.

5. **MULTI-TIER DEPTH** — clear foreground (sharp bloom-explosion) + midground (desert anchors) + deep distance (mesa silhouettes receding in soft depth).

6. **VIVID NATURAL LIGHT** — bright southwest sun, golden-hour amber, or warm midday. NOT moody / dark / soft-pastel.

ONE positive guard: vibrant saturated southwest jewel-tone (not soft-pastel); desert stays recognizable desert — cacti / red-rock / sand (not a lush-temperate-meadow, not surreal flower-construction); landscape scale (not macro); vivid southwest sun (not moody / dark / storm). 🚫🚫🚫 ABSOLUTE HARD BAN on humans / figures / faces; no animals (distant bird silhouette OK).

━━━ THE DESERT ANCHOR ━━━
${desert_anchor}

This is the recognizable southwest desert landform that grounds the scene.

━━━ THE WILDFLOWER EXPLOSION ━━━
${bloom_explosion}

The dramatic vivid wildflower carpet that EXPLODES around / between / through the desert anchor. Specific species + vivid saturated colors.
${magicSection}━━━ COMPOSITION CRAFT — SOUTHWEST DESERT + WILDFLOWER EXPLOSION ━━━

  • FOREGROUND: dense bloom-explosion of vivid desert wildflowers carpeting the ground, climbing the rocks, blooming around the cactus bases
  • MIDGROUND: the desert anchor (saguaro / joshua-tree / agave / red-rock / mesa) — recognizable, sharp, vivid
  • BACKGROUND: distant mesa silhouettes / mountain ridges / sand dunes receding in soft depth with deep cobalt sky above
  • DEPTH: sharp bloom-foreground + sharp desert-midground + soft distant atmospheric depth
  • COLOR: vivid saturated southwest palette — bold reds + corals + magentas + jewel-yellows + sapphire-blues against terracotta + golden desert
  • MOOD: vibrant, dramatic, surprising — the joy of desert SUPERBLOOM after spring rain

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting as VIVID SOUTHWEST natural light — bright midday sun, golden-hour amber, or warm desert glow. NOT moody / dark / soft-pastel. Think Sonoran-superbloom / Arizona-after-spring-rain / IG-magical-desert-magazine.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 3-5 species from the roster — vivid saturated colors. Combine roster species with desert-specific bloom-types (desert-marigold / Indian-paintbrush / lupine / poppy / penstemon / cactus-blooms).

━━━ DEFAULTS TO RESIST ━━━
Vibrant southwest jewel-tone (not soft-pastel); recognizable desert (not temperate-meadow / surreal scale-inversion / urban / ruins); landscape scale (not macro); vivid southwest sun (not moody / dark / storm); only roster species; ABSOLUTE HARD BAN on humans / figures / faces.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[the RECOGNIZABLE southwest desert anchor (saguaro / joshua-tree / agave / red-rock / mesa / dunes) dominating the midground — explicit dry-desert texture + species + features], [the DRAMATIC WILDFLOWER EXPLOSION carpeting the foreground around / between / through the desert anchor — specific desert-bloom species in vivid saturated jewel-tone colors], [multi-tier depth with distant mesa silhouettes / mountain ridges receding in soft depth, deep cobalt desert sky above]${atmospheric_magic ? ', [atmospheric magic detail amplifying the southwest mood]' : ''}, [vivid bright southwest natural light bathing the scene — bright sun / golden-hour amber / warm desert glow], [vibrant Sonoran-superbloom / Arizona-magical-desert aesthetic — bold saturated southwest palette]

CRITICAL — RECOGNIZABLE SOUTHWEST DESERT (cacti / red-rock / sand) + DRAMATIC WILDFLOWER EXPLOSION. Vivid saturated SOUTHWEST palette (NOT soft-pastel). ABSOLUTE HARD BAN ON HUMANS.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_SUNSET_FLOWERS: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      hero_flower,
      landscape_backdrop,
      sunset_sky,
      sun_position,
      atmospheric_phenomenon,
    } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the scene ━━━
${atmospheric_phenomenon}

A specific atmospheric moment supporting the sun-backlit-flower aesthetic.

`
      : '';

    return `You are a fantasy-realism concept-art painter writing SUN-BACKLIT-FLOWER + EPIC-LANDSCAPE + SUNSET-SKY scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — SUN-BACKLIT FLOWERS AGAINST EPIC SUNSET LANDSCAPE ━━━

The unifying mandate: the VISIBLE SUN in the frame backlights / rim-lights the foreground flowers — petal EDGES catch a gentle warm rim-light, the blooms are naturally lit from behind with soft golden-hour warmth — set against a wide gorgeous landscape that recedes into the distance under a soft pretty sunset sky. NATURALISTIC photography backlight — the flowers are NOT internally glowing bulbs. The viewer's reaction: "look at the way the sun is lighting up those flowers."

THE LOOK — soft naturalistic golden-hour / pretty-sunset photograph:
- The SUN is visible IN the frame (low disc cresting a horizon / setting behind a ridge / bursting through trees / peeking over hills / rising over a lake) — soft glowing, atmospheric, NOT a sharp burning sphere
- The HERO FLOWERS in foreground/midground are NATURALLY BACKLIT / RIM-LIT by the sun — petal EDGES catch a gentle warm rim-light, soft natural backlight, photographic register — NOT internally-glowing bulbs — THIS IS THE STAR OF THE SHOW
- A WIDE GORGEOUS LANDSCAPE recedes behind (mountains / hills / forest / lake / coast / meadow) — gives epic scale and depth
- A PRETTY GOLDEN-HOUR / SUNSET SKY in soft warm tones (warm amber / soft pink / peach / coral / pale lavender / cream) — pretty and atmospheric, NOT burning-dramatic

━━━ THE SUNSET SKY — SOFT GOLDEN-HOUR, NOT BURNING DRAMA ━━━

The upper 30-45% of every render is a pretty golden-hour / sunset sky — warm, atmospheric, naturalistic. SOFT and PRETTY, not burning-fiery-competition-grade. The flowers are the hero; the sky is the pretty warm light source that makes them glow.

RIGHT register:
  - Soft warm cloud-bands (warm amber / soft pink / peach / coral / pale lavender / cream), gentle cumulus or cirrus catching the warm light
  - The sun-disc visibly present but SOFT — glowing soft, not a sharp burning sphere; subtle warm golden-hour rays + lens-flare, not blazing god-rays
  - Pretty, calm, atmospheric, "actual sunset photograph" feel — the light WRAPS the scene in warm-gold ambient, petals glow softly

ONE guard: keep it soft and pretty — NEVER fiery / apocalyptic / blood-orange burning, hot-pink-magenta drama, storm-boiling, or a sky that competes with the flowers.

Think: pretty golden-hour photograph from a hike / Instagram nature-feed soft-sunset / the moment 30-60 minutes before actual sundown when the warm light is just right and the flowers glow.

━━━ HARD MANDATES (every render) ━━━

1. **VISIBLE SUN IN FRAME** — the sun-disc / golden-hour rays / sunset-source is clearly visible in the frame. Describe its position explicitly (cresting the mountain ridge / setting behind the hill / peeking through pine canopy / sitting low on the meadow horizon / rising over the lake).

2. **HERO FLOWERS STRONGLY BACKLIT BY THE SUN** — describe the foreground flowers as STRONGLY catching the warm sun-light from behind. The sun's light visibly FLOODS THROUGH the scene and BATHES the flowers in warm golden-amber backlight — the petal edges show a STRONG bright warm rim-glow, the whole bloom is warm-bathed and luminous, the back-lit-by-sun look is OBVIOUS and PRONOUNCED. Think National Geographic / IG backlit-hibiscus / National-Park golden-hour magazine-cover shots — the sun is BEHIND the flowers and they GLOW with the warmth flooding through them. Use phrases like "petal edges blazing with warm sun-rim-light," "the sun pouring its warm light through the bloom," "every petal-edge brilliantly outlined in golden warm-amber rim-glow," "the flower silhouette burning warm against the sun," "strong photographic backlight bathing the bloom in golden warmth," "the warm sun-light pouring through the petals making them glow." AVOID ONLY: "every petal a tiny lamp/bulb/lantern from within" — that triggers fake neon-bulb petals. STRONG sun-backlight where the sun is OBVIOUSLY behind the bloom is exactly the goal.

3. **EPIC LANDSCAPE BACKDROP** — a wide gorgeous natural setting recedes behind (mountains / hills / forest / lake / coast / valley / canyon / cliffs / wildflower-meadow). Multi-tier depth: foreground flowers + midground terrain + receding distance. NEVER a flat or featureless backdrop.

4. **PRETTY GOLDEN-HOUR SKY — 30-45% OF THE FRAME** — the upper 30-45% of the frame is filled with a soft pretty golden-hour / sunset sky in warm naturalistic tones (warm amber / soft pink / peach / coral / pale lavender / cream). Gentle cumulus or cirrus clouds catching the warm light, sun-disc visibly present but soft (glowing gently, NOT a sharp burning sphere). The sky SUPPORTS the flowers — it's the warm light source, not the hero. NEVER burning-fiery / storm-dramatic / hot-pink-saturated / cinematic-apocalyptic. NEVER plain blue / overcast / clear noon either. Aim for "pretty golden-hour photograph" not "competition-grade sunset banger."

5. **NATURALISTIC REAL-WORLD REGISTER** — this is naturalistic nature-photography aesthetic, NOT surreal / magical-portal / sci-fi / cartoony. National Geographic golden-hour landscape photography meets Pinterest-magical-hour Instagram. Real flowers, real mountains, real sun.

ONE positive guard: naturalistic real-world golden-hour scene — sunset sky + wide gorgeous landscape mandatory (no plain blue / overcast / midday, no flat backdrop); the sun MUST be lighting through the petals (no flowers without visible sun-backlight); no surreal / interior / archways / city / ruins / macro / sci-fi bloom-glow. 🚫🚫🚫 ABSOLUTE HARD BAN on humans / figures / silhouettes anywhere.

━━━ THE HERO FLOWER (foreground / midground) ━━━
${hero_flower}

━━━ THE LANDSCAPE BACKDROP (wide gorgeous recession behind) ━━━
${landscape_backdrop}

━━━ THE GOLDEN-HOUR SKY — soft pretty sunset, upper 30-45% of the frame ━━━
${sunset_sky}

This is the warm-light support, NOT a burning showpiece. Render the sky soft, pretty, naturalistic — gentle cumulus or cirrus catching warm-amber / soft-pink / peach / coral light. The flowers are the hero — the sky bathes them in warmth.

━━━ THE VISIBLE SUN POSITION ━━━
${sun_position}

The sun-disc must be VISIBLE in frame at this position — large enough to be unmistakable, glowing, with golden-hour rays / lens-flare radiating outward.
${phenomenonSection}━━━ COMPOSITION CRAFT — HERO-FLOWER + EPIC-LANDSCAPE + SUNSET-SKY ━━━

  • FOREGROUND: hero flower-cluster occupying the lower 40-60% of the frame — petal EDGES BLAZING with strong warm sun-rim-light, whole bloom WARM-BATHED in the sun's backlight pouring through (naturalistic photographic STRONG backlight, NOT bulb-like inner glow)
  • MIDGROUND: wide gorgeous landscape (mountain ridges / forested hills / meadow / lake / coast) receding deeper
  • UPPER FRAME: dramatic sunset sky filling 30-50% — orange / pink / gold cloud-bands
  • SUN POSITION: visible in mid-to-upper frame — cresting ridge / setting behind hill / bursting through trees / peeking over hills / sitting low on horizon
  • SUN-LIGHT TRANSMISSION: explicitly describe the sun-light SHINING THROUGH the foreground flowers — backlight, rim-light, petal-translucency, golden-hour glow on every visible bloom
  • DEPTH: clear foreground/midground/background separation — multi-tier depth with soft distance recession

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting to support GOLDEN-HOUR / SUNSET / MAGIC-HOUR — strong warm directional light from the visible sun POURING into the scene. The ENTIRE foreground/midground should be bathed in warm golden-amber sun-light — every petal-edge, every grass-blade, every leaf glowing with caught warmth. Pronounced lens-flare, warm light pouring through the air. The sun is the primary light story; ambient amplifies it (warm light / lens-flare / ray-streaks / soft cloud-filtered warmth flooding the whole frame).

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 1-2 species from the roster for the hero foreground — describe each with PETAL EDGES CATCHING WARM SUN-RIM-LIGHT from the sun behind/beside, naturalistic golden-hour photographic backlight (NOT internally-glowing bulbs).

━━━ DEFAULTS TO RESIST ━━━
Sunset sky + wide landscape mandatory (no plain blue / overcast / midday / flat backdrop); the sun MUST backlight the petals; no surreal / interior / archways / city / ruins / macro / sci-fi-glow; only roster species; ABSOLUTE HARD BAN on humans / figures / silhouettes.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[the hero foreground flower-cluster + PETAL EDGES CATCHING WARM SUN-RIM-LIGHT from the visible sun behind/beside — naturalistic photographic backlight, NOT internally-glowing bulb petals], [the wide gorgeous landscape recession behind — mountains / hills / forest / lake / coast], [the visible sun-disc position in frame — soft and gently glowing], [soft pretty golden-hour sky in upper 30-45% — gentle cumulus / cirrus in warm-amber / soft-pink / peach / coral / pale-lavender], [warm golden-hour ambient wrapping the entire scene]${atmospheric_phenomenon ? ', [atmospheric phenomenon supporting the soft-golden-hour aesthetic]' : ''}, [naturalistic real-world register — pretty golden-hour photograph, NOT cinematic-apocalyptic-burning-sunset, NOT bulb-glowing-flowers]

CRITICAL — the SUN is VISIBLE IN FRAME and NATURALLY RIM-LIGHTING THE FLOWER PETAL EDGES (NOT internally-glowing bulbs). Wide gorgeous landscape behind. Soft pretty sunset sky above. ABSOLUTE HARD BAN ON HUMANS.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { landform, scale_prover, surprise_element, sky, phenomenon } = slots;
    const phenomenonSection = phenomenon
      ? `\n━━━ ATMOSPHERIC PHENOMENON — render visibly ━━━\n${phenomenon}\n\n`
      : '';
    return `You are a fine-art floral landscape painter writing AWE-INDUCING SCENE DESCRIPTIONS for BloomBot. Output is a 70-100 word comma-separated phrase string for Flux.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes. (Tiny scale-prover wildlife OK.)

━━━ THE BLOOM-CARPET IS THE HERO ━━━
The LANDFORM is the canvas, the BLOOMS are the hero. Multi-tier scale.

━━━ LANDFORM ━━━
${landform}

━━━ SCALE-PROVER ━━━
${scale_prover}
${phenomenonSection}━━━ SKY ━━━
${sky}

━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ PALETTE ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES ━━━
${sharedDNA.roster}

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Output 70-100 words. Comma-separated phrases. NO headers, NO bullets. Just the prose.`;
  },

  BLOOMBOT_CLOSEUP: ({ slots, sharedDNA, vibeDirective }) => {
    const { bloom_wall_type, growing_context, macro_phenomenon } = slots;

    const phenomenonSection = macro_phenomenon
      ? `
━━━ MACRO MAGIC MOMENT — render visibly in the foreground ━━━
${macro_phenomenon}

`
      : '';

    return `You are a fine-art floral macro painter writing JEWEL-TONE CLOSEUP scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ MACRO VIEW pressing INTO living blooms GROWING IN PLACE ━━━
A macro closeup pressing INTO a dense bloom wall in its NATURAL OUTDOOR ENVIRONMENT — the blooms are growing on the plant, never cut/picked/arranged. Stand close enough to count petals on the front-most blooms; shallow focal plane; bloom-mass fills frame edge-to-edge receding into softly-blurred sharp-layered depth. No dark studio backdrop.

━━━ HERO BLOOM AMONGST MANY — NON-NEGOTIABLE COMPOSITION ━━━
ONE specific HERO species DOMINATES the frame at its OWN natural form and scale. Hero silhouette is whatever the rolled species naturally is — broad face, deep cup, pompom dome, hanging raceme, umbel, trumpet, ruffled rosette, daisy-face, or tall spike. The hero pushes into the foreground focal plane. The other 2-3 species act as SUPPORTING CAST at SMALLER visual weight — carpeting gaps, threading through, drifting in midground softness — NEVER competing with the hero.

⚠️ CRITICAL — DO NOT default the hero to tall spires / vertical towers / tall spike-shaped blooms every render. Vary by what the rolled roster offers:
  • Broad-faced (peony / dahlia / sunflower / gerbera / cosmos / poppy) → FACE fills foreground
  • Deep-cup (tulip / magnolia / lotus / crocus) → CUP-MOUTH dominates, light pools inside
  • Pompom / dome (allium / hydrangea / dahlia / chrysanthemum) → round mass as sphere of florets
  • Hanging cluster (wisteria / fuchsia / bleeding-heart / orchid) → pendant blooms AT viewer level
  • Umbel (queen-annes-lace / agapanthus) → parasol-cluster fills foreground
  • Trumpet (lily / daffodil / morning-glory / brugmansia) → open trumpet-mouth frontal
  • Tall spike (foxglove / delphinium / lupine / snapdragon) → spires rise ONLY when species naturally is

━━━ DRAMATIC LIGHTING HIERARCHY — WARM HERO / COOL BACKGROUND ━━━
SINGLE DOMINANT light source catches HERO blooms WARM in foreground; supporting cast and receding bloom-mass sit COOLER ambient or BLUE-SHADOW. NEVER flat even illumination. NEVER cool-on-cool or warm-on-warm.

━━━ MOVIE-POSTER COMPOSITION — POSTER-GRADE FRAMING ━━━
Poster-grade framing — every quadrant earns its space, the framing feels INTENTIONAL, not a flat eye-level center snapshot. Pick ONE framing mode per render and vary across renders: LOW-ANGLE HERO (blooms rising into upper frame from a strong lower anchor) / OVERHEAD CANOPY (looking up at hanging pendant clusters at viewer level) / DIAGONAL LEAD-LINE (supporting threads leading to the hero at rule-of-thirds).

━━━ MATERIAL POETRY at petal-scale ━━━
"Petals countable and cold to the touch", "waxy surfaces catching slanted light", "pollen-dust on the anthers", "fine fuzz on stems", "dew-beads on leaves", "stamen-shadows on petals", "translucent veining lit from behind".

━━━ THE BLOOM-WALL ━━━
${bloom_wall_type}

━━━ THE GROWING CONTEXT ━━━
${growing_context}
${phenomenonSection}━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 3-4 species from the roster — ONE as HERO, others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
No dark studio backdrop; no pink/rose unless the palette names it.

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[poster-grade composition mode], [macro closeup pressing INTO [bloom-wall type] where [HERO SPECIES] dominates at its OWN natural silhouette], [supporting species carpeting/threading], [growing context implied through blur], [warm-hero/cool-background lighting]${macro_phenomenon ? ', [the macro magic moment as a specific small detail]' : ''}, [material poetry at petal-scale]

CRITICAL — POSTER-COMPOSITION + HERO + SUPPORTING CAST. Hero shape follows the rolled species — DO NOT default to tall spires.

Output ONLY 85-115 words. Comma-separated. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_TROPICAL_PARADISE: ({ slots, sharedDNA, vibeDirective }) => {
    const { tropical_setting, vegetation_anchor, surprise_creature } = slots;

    const creatureSection = surprise_creature
      ? `
━━━ SURPRISE CREATURE — render at peripheral scale ━━━
${surprise_creature}

The creature is SMALL relative to the scene — never the primary subject. Place at midground or deep distance as a scale-prover / second-look reward.

`
      : '';

    return `You are a fine-art tropical landscape painter writing JUNGLE-SCENE descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people, NO travelers, NO explorers. The jungle is the subject. (Small wildlife — toucan / butterfly / poison-frog / monkey / iguana — only when the surprise_creature slot calls for it.)

━━━ TROPICAL PARADISE — NON-NEGOTIABLE ━━━
This is a TROPICAL PARADISE scene — beach + lagoon + coastal cove + waterfall pool + atoll + rainforest + cloud-forest are ALL valid registers. RENDER WHATEVER THE SETTING SLOT BELOW NAMES — if the setting is a palm-fringed white-sand beach, that's the scene; if it's a turquoise lagoon, that's the scene; if it's a rainforest understory, that's the scene. The setting is identifiably tropical — palms / coconut grove / hibiscus / plumeria / frangipani / banana / banyan / heliconia / sea-grass / mangrove / ferns / moss / vines, plus open water / coastal sand / atoll edge when called for. Wide cinematic shot showing DEPTH: foreground saturated and crisp, midground softening, deep distance softening with natural depth (humid-jungle air / salt-haze / waterfall-spray ONLY when the specific scene genuinely calls for it). This is NEVER a temperate meadow, NEVER an alpine landscape, NEVER a desert, NEVER an urban scene.

━━━ MASSIVE SHOWY TROPICAL FLOWERS — THE HERO ━━━
The flowers are MASSIVE and SHOWY at tropical-paradise scale — torch ginger, heliconia, plumeria, jade vine cascades, cattleya orchid, bird-of-paradise (strelitzia), passion-flower, anthurium, hibiscus, frangipani, ylang-ylang, bougainvillea, plumeria cascade, lotus, water-lily. Use the roster's named species — never generic "tropical flowers". The blooms dominate the foreground at saturated, vivid scale; supporting blooms thread through the vegetation behind or carpet the coastal sand or ring the lagoon edge.

━━━ THE TROPICAL SETTING (the biome canvas) ━━━
${tropical_setting}

━━━ THE VEGETATION ANCHOR (the paradise scaffolding) ━━━
${vegetation_anchor}

The vegetation scaffolds the bloom hero — palms / banana / banyan / philodendron / ferns / vines / hibiscus / plumeria / sea-grape / mangrove — never replacing the blooms as the subject, but giving the paradise its identifiable structure.
${creatureSection}━━━ TROPICAL ATMOSPHERIC PERSPECTIVE ━━━
Foreground, midground and deep distance ALL stay crisp and sharp through clear bright tropical air — depth comes from overlapping layers and diminishing scale, never from softening. Beaded condensation on broad leaves and fine crisp waterfall spray are welcome as sharp physical detail; the air over the water and into the distance stays clear and crisp. NEVER alpine.

━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE the way a fine-art print or magazine cover does. NEVER a flat eye-level center-of-frame snapshot. The viewer should GASP / stop mid-scroll / want to save the image / want to print and frame it.

Pick ONE deliberate framing mode per render (vary across them — match the framing to whatever the setting slot describes):
  A. **PALM-FRINGED BEACH WIDE** — palm-fringed white-sand beach in golden-hour light with bloom-laden coastal vegetation at one frame edge, turquoise water filling the open frame, distant island silhouette
  B. **LAGOON-EDGE REFLECTION** — turquoise lagoon foreground with bloom-laden inner shore reflecting in the still water, distant coastal cliff or atoll edge crisp and sharp against clear sky
  C. **WATERFALL-PLUNGE-POOL** — tropical waterfall plunging into a bloom-ringed pool, bloom-laden mossy boulders at viewer level, crisp spray rising
  D. **CANOPY DAPPLED LIGHT** — crisp dappled sunlight falling through the rainforest canopy onto specific bloom patches below
  E. **POOL-EDGE REFLECTION** — jungle pool or stream foreground reflecting bloom-laden canopy above
  F. **THROUGH-THE-VINE-CURTAIN** — natural archway from hanging vines and lianas framing a clearing beyond
  G. **BANYAN-ROOT TUNNEL** — banyan / strangler-fig root-curtain in foreground framing the deep scene beyond
  H. **CLIFF-ABOVE-LAGOON** — volcanic-island cliff descending to turquoise water below, bloom-laden cliff-edge
  I. **MANGROVE-TIDAL** — mangrove tidal-swamp with floating blooms and stilt-roots
  J. **BROAD-LEAF-OVERHEAD** — broad banana / heliconia / philodendron leaves arching overhead, bloom-floor below
  K. **TIDE-POOL EDGE** — tropical tide-pool foreground with reflected sky, bloom-clusters massing at the rock-edge behind, ocean horizon line in distance
  L. **COVE OVERLOOK** — overlook of a hidden tropical cove ringed by bloom-cliffs, turquoise water below, palms at the rim

DELIBERATE COMPOSITION CRAFT:
- Rule-of-thirds: hero element at a rule-of-thirds intersection, not centered (unless intentional symmetry like a path leading dead-center)
- Lead-lines: path / stream / palm-trunk / wave-line / vine-curtain pulling the eye INTO the deep frame
- Multi-tier depth: tactile foreground detail (bloom cluster / wet sand / petal-strewn path / dew-beaded leaf) → midground scene → deep distance softening with depth
- Intentional negative space: one quadrant has sharp-layered-quiet / clear-sky / gentle sky-glow breathing room as counterweight to the bloom-dense quadrant
- Light hierarchy: warm hero blooms in golden / amber / rim light, cooler ambient / blue shadow in the deep distance
- Depth recession: foreground saturated and crisp, midground softening, deep distance receding with natural depth

THINK Hawaiian / Tahitian / Bali / Maldivian / Polynesian fine-art tropical photography + Avatar Way-of-Water establishing shots + Planet Earth tropical-coast slow-zoom-out + Endless Summer cinematography (without surfers) + Princess Mononoke ocean + Roger Deakins tropical wides + National Geographic cover shots + travel-magazine fine-art prints. Every render = the COVER SHOT, not a snapshot. The kind of image someone would print poster-size and hang on a wall.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

Render the palette EXACTLY as named — those are the only colors in the scene. The deep-green humid tropical ambient is the foundation; the named bloom colors overlay.

━━━ FLOWER SPECIES — STRICT TROPICAL ROSTER ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species that fit the palette — ONE as HERO at MASSIVE jungle scale, the others as SUPPORTING CAST threading through the vegetation. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
This is JUNGLE — no "soft pastels" / cottagecore / english-garden, no temperate / alpine / desert / arctic vocabulary; no pink/rose/blush dominance unless the palette names it; let depth recede naturally (humid haze only when the scene genuinely calls for it); NO people / figures / silhouettes.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[wide cinematic framing mode (canopy-shafts / pool-reflection / vine-archway / banyan-tunnel / cliff-lagoon / waterfall / mangrove / broad-leaf-overhead)], [the tropical setting + vegetation anchor establishing the dense jungle], [3-4 named tropical species in the palette colors with HERO + SUPPORTING distribution], [natural depth perspective with foreground saturated and deep distance softening]${surprise_creature ? ', [surprise creature at peripheral scale]' : ''}, [lighting bringing the canopy + bloom-mass to life]

CRITICAL — every render reads as TROPICAL JUNGLE — palms / banana / banyan / ferns visible, lush natural depth-recession, massive showy named tropical blooms. NEVER temperate, NEVER alpine, NEVER desert.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the framing + setting.`;
  },

  BLOOMBOT_COZY: ({ slots, sharedDNA, vibeDirective }) => {
    const { interior_setting, furniture_anchor, atmospheric_moment } = slots;

    const momentSection = atmospheric_moment
      ? `
━━━ ATMOSPHERIC MOMENT — render visibly ━━━
${atmospheric_moment}

This is the "warm magic moment" detail that elevates the cozy scene — render as a specific small element in the foreground or focal plane.

`
      : '';

    return `You are a fine-art interior painter writing COZY-OVERGROWN-ROOM scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people, NO hands. The empty cozy room is the subject — its absent owner felt only through tactile signs (a teacup, a half-finished page, a draped quilt). Wildlife (curled cat / sleeping dog / songbird at the window) ONLY when the atmospheric_moment slot calls for it.

━━━ COZY = WARM HUMBLE DOMESTIC — NON-NEGOTIABLE ━━━
This is a WARM HUMBLE DOMESTIC space — sunroom / breakfast nook / writing desk / arched window seat / attic dormer / stairwell landing / kitchen corner / fireside reading chair / window-side bed. NEVER a palace, NEVER a ballroom, NEVER a grand interior, NEVER a cathedral, NEVER a corporate / hotel / commercial interior. Think: someone's beloved home that the garden has consumed.

━━━ FLOWERS BLANKETING / CASCADING / CONSUMING — THE HERO ━━━
The flowers DOMINATE half the frame. They CASCADE from the ceiling, CLIMB the walls, DRAPE across furniture, FILL every vase + jug + bowl. Vines in profusion across every horizontal and vertical surface. The interior architecture is visible and recognizable but the flowers are CLEARLY the dominant subject — the architecture is the framework / scaffold holding the bloom-mass up.

━━━ HERO BLOOM AMONGST MANY — NON-NEGOTIABLE COMPOSITION ━━━
ONE specific HERO species DOMINATES the foreground focal plane at its OWN natural form and scale — broad face, deep cup, pompom dome, hanging raceme, umbel, trumpet, ruffled rosette, daisy-face, or tall spike. Let the rolled species choose. The other 2-3 species act as SUPPORTING CAST cascading from the ceiling, threading through the furniture, filling the vases and jugs, draping over the windowsill. NEVER a uniform wall of equally-weighted blooms. HERO + SUPPORTING.

⚠️ DO NOT default the hero to "tall spires" or "vertical towers" every render — vary by what the rolled roster offers (broad face / cup / pompom / hanging / umbel / trumpet / spike).

━━━ DRAMATIC WARM LIGHT HIERARCHY — WARM HERO / COOL INTERIOR ━━━
Light pours in through the window at a dramatic angle (golden-hour rake, slanting morning shaft, late-afternoon amber, dappled curtain-broken light, single candle pool, lamp-glow). It catches the HERO blooms WARM in the foreground; the supporting cast and the rest of the room sit COOLER ambient or in soft shadow. The warm/cool split builds the visual hierarchy.

━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE the way a fine-art print or magazine cover does. NEVER a flat eye-level center-of-frame snapshot. The viewer should GASP / want to save the image / want to print and frame it.

Pick ONE framing mode per render (vary):
  A. **THROUGH-THE-WINDOW** — interior foreground with bloom-laden windowsill, light pouring in, garden / sky / snow / forest beyond visible through the panes
  B. **DOOR-AJAR PEEK** — interior scene viewed from an open doorway, bloom-cascade in foreground framing the room beyond
  C. **CORNER-AT-REST** — quiet corner with the hero bloom-arrangement on a table or sill, anchored by one furniture piece, room receding into soft cooler shadow
  D. **READING-NOOK INTIMATE** — close on a reading chair / window-seat / bed with bloom-mass cascading down behind it, lap-detail like an open book / quilt / tea
  E. **OVERHEAD WINDOW BEAM** — vertical light-shaft from a tall window or skylight onto the bloom-arrangement, room around in cool ambient
  F. **STAIRWELL UPVIEW** — looking up a stairwell or balcony with hanging blooms cascading from the railing, light spilling from above
  G. **TEA-TABLE STILL-LIFE** — bloom-laden tea-table or breakfast-nook with china / teapot / open book / honey jar, garden visible through the window beyond
  H. **WRITING-DESK MOMENT** — writing desk with typewriter / quill / candle / open journal, bloom-mass cascading from a shelf above and a vase beside

━━━ MATERIAL POETRY — WARM DOMESTIC TEXTURES ━━━
"Sun-warmed wood floorboards", "faded quilt with hand-stitched seams", "moss-velvet armchair cushion", "fragrant tea steam rising from a chipped china cup", "candle-wax pooled on a brass holder", "sun-bleached linen curtains", "worn leather-bound book left open", "honey-amber afternoon light through dust motes", "single petal fallen on the windowsill". Render the front-plane blooms + furniture with material poetry.

━━━ THE INTERIOR SETTING ━━━
${interior_setting}

━━━ THE FURNITURE ANCHOR ━━━
${furniture_anchor}

The furniture anchors the scene as a structural element — never replaces the blooms as the subject. It catches the bloom-cascade and provides the tactile counterweight (the worn-wood / mossed-velvet / hand-stitched texture against the bloom softness).
${momentSection}━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

Render the palette EXACTLY as named — those are the only colors in the scene. The warm-amber domestic ambient is the foundation; the named bloom colors overlay.

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — ONE as HERO at the foreground focal plane, the others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
HUMBLE DOMESTIC, not palace / ballroom / grand / cathedral / commercial; soulful weathered lived-in, not "cottagecore" / shabby-chic; no pink/rose/blush dominance unless the palette names it; only roster species; there IS a hero (not equal-weight); keep the warm-hero/cool-interior light hierarchy.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[postcard / gallery framing mode], [interior setting + furniture anchor establishing the warm humble domestic space], [HERO species dominating the foreground focal plane at its natural silhouette + supporting cascade cascading / threading / filling], [warm window-light catching the hero blooms in the foreground, supporting and room beyond in cooler ambient]${atmospheric_moment ? ', [the atmospheric moment as a specific small detail]' : ''}, [material poetry — sun-warmed wood, faded quilt, fragrant tea steam, worn leather]

CRITICAL — establish POSTCARD COMPOSITION + WARM HUMBLE DOMESTIC + HERO + SUPPORTING. NEVER palace / ballroom / grand. NEVER a flat eye-level snapshot. Hero shape follows the rolled species — DO NOT default to tall spires.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the framing mode + the cozy interior + hero bloom.`;
  },

  BLOOMBOT_DREAMSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { impossibility_type, world_element, atmospheric_halo } = slots;

    const haloSection = atmospheric_halo
      ? `
━━━ ATMOSPHERIC HALO — render visibly as part of the impossibility ━━━
${atmospheric_halo}

This is the surreal-lighting / atmospheric magic element that amplifies the dreamscape's impossibility. Render as a visible quadrant-dominant detail.

`
      : '';

    return `You are a fine-art surrealist painter writing IMPOSSIBLE FLORAL DREAMSCAPE scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO floating bodies, NO faces. The dreamscape is empty of people — the flowers and the impossible-geometry world are the subject. (Tiny wildlife — a single butterfly mid-flight, a hummingbird against an upside-down sky — only when atmospheric_halo calls for it.)

━━━ SURREAL DREAMSCAPE — NON-NEGOTIABLE ━━━
This is a SURREAL FLORAL DREAMSCAPE — a physically IMPOSSIBLE composition rendered with HYPERREAL / PHOTOREAL precision. The render technique is fine-art-painting / photoreal — the IMPOSSIBILITY is in the LAYOUT, NOT in any "alien flower" detail. Treat it like a Magritte / Dali / Beksinski / Storm Thorgerson album-cover painting that happens to be impossible.

━━━ REAL EARTH SPECIES — STRICT ━━━
The flowers are REAL EARTH-BOUND species (roses, peonies, lilies, lotus, hibiscus, sunflowers, foxglove, etc. from the roster). NEVER alien / glowing-bioluminescent / fictional / Photoshop-glitch flowers. The species are 100% real; their arrangement breaks physics.

━━━ THE IMPOSSIBILITY (the layout that breaks physics) ━━━
${impossibility_type}

━━━ THE WORLD ELEMENT (the physical object the impossibility breaks) ━━━
${world_element}

The world-element is rendered with HYPERREAL physical precision — real stone, real water, real glass, real architecture — but its behavior breaks physics in the way the impossibility describes. The viewer accepts the impossibility because every individual texture and material reads as TRUE.

━━━ HERO BLOOM AMONGST MANY — NON-NEGOTIABLE COMPOSITION ━━━
ONE specific HERO species DOMINATES the foreground focal plane at its OWN natural form and scale — broad face, deep cup, pompom dome, hanging raceme, umbel, trumpet, ruffled rosette, daisy-face, or tall spike. The other 2-3 species act as SUPPORTING CAST woven into the impossible composition.

⚠️ DO NOT default the hero to "tall spires" or "vertical towers" — vary by what the rolled roster offers.

━━━ DRAMATIC LIGHT HIERARCHY — IMPOSSIBLE SOURCE ━━━
The light source is itself part of the impossibility — sun from below, light flowing horizontally, a glowing aperture in mid-air, a Magritte-evening-sun lighting the entire dreamscape in unreal gold. The hero blooms catch this impossible light warm; the rest sits in cooler ambient or surreal-shadow.
${haloSection}━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP / pause / want to print and frame the image.

DELIBERATE COMPOSITION CRAFT:
- Symmetric / centered for Magritte-style frames, off-center rule-of-thirds for Dali-style frames — match the impossibility's nature
- The impossibility is the EYE'S DESTINATION — the composition draws the eye to it
- Multi-tier depth: tactile foreground bloom-detail (still real) → midground impossibility (the world-element being broken) → deep distance receding in crisp sharp overlapping layers or surreal-glow
- Light hierarchy: warm hero blooms / cooler ambient or surreal-shadow
- Frame-within-frame welcomed (Magritte-style windows / portals / doorways into other realities)

━━━ MATERIAL POETRY — HYPERREAL TEXTURES ━━━
"Petal-veins lit from within", "stone weight rendered impossibly buoyant", "glass that ripples like water", "water suspended in mid-air with surface-tension visible", "shadow that falls UPWARD", "reflection that shows a different scene than the viewer", "individual pollen-grain visible on a stamen suspended in zero-g". Render every texture with hyperreal precision so the impossibility is felt MORE strongly.

━━━ THE BLOOM-ARRANGEMENT INTEGRATION ━━━
The blooms are NOT separate from the impossibility — they ARE the impossibility's central subject. They float / spiral / hang / rain / mirror / contain the dreamscape. The composition is BLOOM + IMPOSSIBILITY as one inseparable concept.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT REAL EARTH ROSTER ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — ONE as HERO, the others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
Real species in impossible arrangement (no alien / bioluminescent / fictional flowers); the impossibility is COMPOSITIONAL only — photoreal-painting technique, no cartoon / sticker / glitch effects; no pink/rose/blush dominance unless the palette names it; only roster species; there IS a hero (not equal-weight).

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[postcard composition mode appropriate to the impossibility — Magritte-symmetric or Dali-off-center], [the impossibility type + world element being broken — described with hyperreal precision], [HERO species dominating the foreground at its natural silhouette + supporting cast woven into the impossible composition], [hyperreal material poetry — real textures rendered with impossible physics]${atmospheric_halo ? ', [the atmospheric halo / surreal-light element]' : ''}, [warm hero light / cool surreal ambient]

CRITICAL — establish POSTCARD COMPOSITION + REAL EARTH SPECIES + IMPOSSIBLE LAYOUT + HYPERREAL PRECISION + HERO + SUPPORTING. The render is a PAINTING that happens to be impossible. NEVER alien flowers, NEVER cartoon glitch effects.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the composition mode + the impossibility.`;
  },

  BLOOMBOT_GARDEN_WALK: ({ slots, sharedDNA, vibeDirective }) => {
    const { archway_type, path_material, destination_glimpse, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the passage ━━━
${atmospheric_phenomenon}

This is the "magic-moment" detail that elevates the passage — render as a specific visible element within the archway opening or the foreground bloom-mass.

`
      : '';

    return `You are a fine-art floral painter writing INVITING WALKABLE-PASSAGE scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people, NO hooded figures at the archway. The passage is empty and inviting — the viewer is about to step into it. (Tiny wildlife — songbird perched on the arch / butterfly mid-passage / firefly cloud — only when atmospheric_phenomenon calls for it.)

━━━ WALKABLE FLORAL PASSAGE — NON-NEGOTIABLE ━━━
This is a WALKABLE FLORAL PASSAGE inviting the viewer IN. There is a clear PATH leading from the foreground into the deep frame, and an ARCHWAY framing the eye's destination. The viewer stands at the entrance about to walk through.

━━━ SYMMETRIC PORTRAIT COMPOSITION — NON-NEGOTIABLE ━━━
The composition is SYMMETRIC PORTRAIT — the archway is CENTERED in the frame, the path leads DEAD-CENTER from the bottom of the frame into the depths beyond. The frame divides into:
  • FOREGROUND BLOOM-MASS on EACH SIDE (left and right) — overlapping bloom-clusters at viewer eye level, draped from above, cascading from the arch
  • THE ARCHWAY at midground center — the architectural framing entity (stone arch / pergola / iron arbor / temple-ruin doorway / forest-branch arch / ivy gateway)
  • GLOWING DEPTH-OF-FIELD at the path's far end — the destination, lit warmer than the foreground, the eye's destination
The viewer's eye must travel: foreground bloom-mass → through the archway → INTO the glowing depth. NEVER an off-center shot. NEVER a wide horizontal landscape. ALWAYS the inviting symmetric portrait.

━━━ THE ARCHWAY (the architectural framing entity at midground center) ━━━
${archway_type}

The archway is HALF-CONSUMED by climbing blooms — the architecture is visible and recognizable but the flowers wrap and drape over it. The arch is the focal entity, the gateway from the viewer's foreground to the destination beyond.

━━━ THE PATH (leading dead-center into the frame) ━━━
${path_material}

The path is VISIBLE from the bottom-center of the frame, leading through the archway into the depths. The path-material is tactile — the viewer can almost feel it under their feet.

━━━ THE DESTINATION GLIMPSE (what lies beyond the archway) ━━━
${destination_glimpse}

The destination is glimpsed through the arch's opening, lit WARMER than the foreground, glowing like a doorway to somewhere magical. NEVER a blank backdrop. Always implies a wider bloom-world receding in crisp sharp overlapping layers.

━━━ HERO BLOOM AMONGST MANY — NON-NEGOTIABLE ━━━
ONE specific HERO species dominates the foreground bloom-mass at its OWN natural form and scale — broad face, deep cup, pompom dome, hanging raceme, umbel, trumpet, ruffled rosette, daisy-face, or tall spike. Let the rolled species choose. The other 2-3 species act as SUPPORTING CAST cascading from the archway, threading through the foreground mass, drifting in midground.

⚠️ DO NOT default the hero to "tall spires" or "vertical towers" — vary by what the rolled roster offers.

━━━ DRAMATIC WARM LIGHT THROUGH THE OPENING ━━━
Light streams through the archway opening from the destination side — warm golden / amber / honey light catches the hero blooms framing the arch and pours down the path toward the viewer. The viewer's foreground sits in cooler ambient shadow. The arch reads as a DOORWAY TO SOMEWHERE MAGICAL.
${phenomenonSection}━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP / want to step INTO the frame / want to print and frame the image.

DELIBERATE COMPOSITION CRAFT:
- Strict symmetric portrait — archway centered, path dead-center, balanced bloom-mass left/right
- Lead-lines: the path itself is THE lead-line, pulling the eye through the arch into the glowing distance
- Multi-tier depth: tactile foreground bloom-mass + path stones → midground archway + climbing blooms → deep distance warm destination glow
- Light hierarchy: warm destination glow through the arch, foreground in cooler ambient
- Frame-within-frame: the archway IS the frame-within-frame, creating two depths of "frame"

━━━ MATERIAL POETRY at archway and path ━━━
"Weathered stone with moss-and-lichen patina", "wisteria racemes hanging at viewer's brow-height", "petals scattered across the flagstones", "iron-arbor rust-streaked under the bloom-mass", "stepping-stones half-sunk in moss", "fallen petal carpet shifting underfoot", "morning-dew on the leaves of the archway climbers".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — ONE as HERO at the foreground / arch frame, the others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
The composition IS symmetric portrait, full stop (no off-center / landscape framing); the destination beyond the arch implies a continuing bloom-world (no blank backdrop); natural / weathered / handmade arch only (no modern / corporate); no pink/rose/blush dominance unless the palette names it; only roster species; there IS a hero.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[symmetric portrait composition with centered archway and dead-center path], [the archway type at midground center half-consumed by climbing blooms], [HERO species dominating the foreground bloom-mass at its natural silhouette + supporting cast cascading from arch], [the path material leading dead-center into the frame], [warm destination glow through the arch — the doorway-to-somewhere-magical light], [destination glimpse beyond the arch implying a continuing bloom-world]${atmospheric_phenomenon ? ', [the atmospheric phenomenon as a visible element within the passage]' : ''}, [material poetry at archway + path]

CRITICAL — SYMMETRIC PORTRAIT composition is THE RULE. The archway is the eye's destination, the path the lead-line. NEVER an off-center shot, NEVER a wide landscape.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the symmetric portrait + archway + path.`;
  },

  BLOOMBOT_HANGING_FLOWERS: ({ slots, sharedDNA, vibeDirective }) => {
    const { setting, hanging_pieces, walkway_accent, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the passage ━━━
${atmospheric_phenomenon}

This is the "magic-moment" detail that elevates the walkway — render as a specific visible element among the hanging blooms or along the path.

`
      : '';

    return `You are a fine-art floral painter writing HANGING-FLOWER-CANOPY WALKWAY scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people anywhere. ⚠️ CRITICAL: the far end / vanishing point of the path is EMPTY — do NOT place a lone person walking away into the misty distance, NO silhouette at the end of the walkway, NO figure on the platform or track. This exact composition (a path receding into glowing haze) tempts a "someone walking into the light" figure — there is NONE. The walkway is completely DESERTED and serene, the viewer themself about to step into it. (Tiny wildlife — a butterfly / songbird / firefly cloud — only when the atmospheric phenomenon calls for it.)

━━━ THE LOOK — DREAMY HANGING-FLOWER WALKWAY RECEDING INTO MISTY DEPTH (NON-NEGOTIABLE) ━━━
The hero is a COMPOSED overhead arrangement of pretty HANGING FLOWERS — the species + colors come from the rolled roster/palette (VARY them; this is NOT a wisteria-only look). It combines:
  1. A COHESIVE OVERHEAD CANOPY of the rolled dominant flowering species — abundant blooms crowning the top and framing the sides (cascading, draping or massed, whatever suits the species), a lush designed ceiling you walk beneath.
  2. A RHYTHMIC RECEDING LINE of DISCRETE, ORNATE HANGING FLOWER-ARRANGEMENTS — ornate hanging baskets / flower chandeliers / suspended bloom-orbs / pendant flower-lanterns on VISIBLE CHAINS at varying heights — distinct, designed pieces that march INTO THE DISTANCE, getting smaller and softer as they recede. These discrete hanging arrangements on chains are the DESIGNED SIGNATURE of this shot — they read as separate, intentional, ornate pieces hung in a row, not dissolved into the canopy.
Beneath both layers, a PATH / LANE / TRAIN-TRACK / WALKWAY curves from the foreground and vanishes into a luminous, dreamy depth, its edges lined with lush, colorful flowers. Mood: magical, serene, dreamlike — a pretty scene you long to walk into.

━━━ ATMOSPHERIC MISTY DEPTH — NON-NEGOTIABLE ━━━
Strong AERIAL PERSPECTIVE. The walkway and the receding hanging arrangements DISSOLVE into a soft, glowing, luminous depth toward the center / far end — dreamy haze, soft glow or golden backlight (let the lighting set the exact mood), gentle bokeh. This atmospheric depth is what makes the shot magical: crisp, saturated hanging flowers + path in the FOREGROUND, fading to a pale, glowing vanishing point where the walkway and the last little hanging pieces disappear. NEVER a flat, evenly-lit, depthless scene; NEVER a blank backdrop — always the receding row of hanging pieces fading into soft luminous depth.

━━━ COMPOSITION — portrait, leading INTO depth ━━━
Portrait composition. The path/track curves from the bottom of the frame deep into the distance, drawing the viewer in as the lead-line. The overhead canopy drapes the top + sides like a living proscenium; the receding line of ornate hanging arrangements marches down the corridor into the luminous depth. The whole thing is COMPOSED and DESIGNED — a cohesive dominant species overhead, ornate discrete hanging pieces in a deliberate rhythm — never a chaotic wall of mixed strands. NEVER a flat horizontal landscape, NEVER a single centered bloom — this is a dreamy passage you walk into.

━━━ THE SETTING (the walkway environment the canopy hangs over) ━━━
${setting}

Establish this real, specific place — its architecture, surfaces and mood — but keep it the BACKDROP that the flowers dress; the hanging blooms + accents are the hero. The walkway of this setting leads dead into the frame's depth.

━━━ THE HANGING PIECES (the suspended overhead arrangement — THE HERO) ━━━
${hanging_pieces}

These hang DOWN FROM ABOVE over the walkway, lush and alive but DELIBERATELY COMPOSED — the cohesive cascade curtain plus a rhythmic RECEDING LINE of discrete ornate hanging baskets/lanterns on visible chains, marching into the misty depth and getting smaller as they recede. Negative space and luminous haze between them. They are the unmistakable hero, designed like a high-end floral installation, NEVER a spammy chaotic jumble.

━━━ THE WALKWAY ACCENTS (lush living flowers lining the path) ━━━
${walkway_accent}

These dress the ground and edges of the walkway at eye/foot level, so the path feels embraced by flowers on every side — overflowing and alive, never sparse.

━━━ HERO FORMS — cohesive CASCADING / PENDANT shapes, designed not jumbled ━━━
The OVERHEAD hanging arrangement favors blooms that read as HANGING — long cascading racemes, trailing sprays, pendant bells, draping clusters, overflowing basket-mounds. For COHESION, let ONE (at most two) dominant flowering species carry the hanging arrangement — a unified, designed look — NOT five different flower types tangled together overhead. Use the other roster species for the path-edge accents below. Each hanging piece is full and lush, but the arrangement stays composed, spaced and intentional — never a chaotic mass of mixed strands everywhere.

━━━ DRAMATIC ATMOSPHERIC LIGHT DOWN THE WALKWAY ━━━
Soft directional light filters DOWN THROUGH the hanging canopy and pours along the walkway toward a glowing far end — dappled light through the blooms above, the path lit warmer in the distance, a dreamy luminous depth (gentle haze / god-rays / soft glow). The hanging blooms catch the light in tack-sharp detail; the air is clear and alive.
${phenomenonSection}━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP / want to step INTO the frame / want to print and frame the image.

DELIBERATE COMPOSITION CRAFT:
- Portrait passage — hanging canopy overhead + down the sides, walkway leading dead into the depth as the lead-line
- Multi-tier depth: tactile hanging blooms + path edge in the foreground → midground canopy + setting → glowing atmospheric far end
- Light hierarchy: warm glow at the walkway's far end, dappled light through the canopy, cooler ambient near the viewer
- Frame-within-frame: the hanging-flower canopy IS the living proscenium framing the depth beyond

━━━ MATERIAL POETRY at the canopy + walkway ━━━
"Cascading racemes hanging at brow-height", "wet cobblestones reflecting the blooms overhead", "petals scattered across the path", "a hanging basket overflowing on a rusted chain", "moss between the paving-stones", "morning-dew beading on the trailing flowers", "warm lamplight glowing among the hanging blooms".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 2-3 species total — ONE dominant species for the hanging overhead arrangement (cohesion; whatever the roster rolls — it need NOT be a cascading/pendant species, vary it), the other 1-2 for the path-edge accents. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
COMPOSED and DESIGNED, never spammy — no chaotic wall of mixed flowers hanging down all over the top of the frame, no many-species tangle overhead, no packing every inch (let it breathe with negative space + rhythm). The hanging arrangement hangs from ABOVE (no scene of flowers only growing up from the ground); ALWAYS a walkway leading into depth (no flat landscape / no single centered bloom); the far end glows with atmospheric depth (no blank backdrop); no pink/rose/blush dominance unless the palette names it; only roster species; the composed overhead hanging flowers ARE the hero.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[portrait walkway passage with COMPOSED hanging flowers overhead and the path leading dead into the depth], [the setting established as a clean backdrop — its architecture/surfaces/mood], [the HANGING PIECES — designed, spaced, cohesive (one dominant species or discrete chandeliers/baskets at rhythmic intervals) — crowning the upper frame with breathing room between], [the lush walkway accents lining the path at ground/edge level], [soft light filtering down through the arrangement and glowing at the walkway's far end]${atmospheric_phenomenon ? ', [the atmospheric phenomenon as a visible element in the passage]' : ''}, [material poetry at the hanging pieces + path]

CRITICAL — a COMPOSED, DESIGNED arrangement of overhead hanging flowers over a walkway leading INTO depth is THE RULE. Curated and cohesive with negative space + rhythm — NEVER a spammy chaotic wall of mixed flowers hanging down all over. The hanging flowers are the hero; the walkway is the lead-line.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the portrait walkway + composed overhead hanging flowers.`;
  },

  BLOOMBOT_CONSERVATORY: ({ slots, sharedDNA, vibeDirective }) => {
    const { conservatory_type, structural_anchor, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the conservatory ━━━
${atmospheric_phenomenon}

This is the magic-moment detail that amplifies the conservatory mood — render as a specific element within the space.

`
      : '';

    return `You are a fine-art interior painter writing OVERGROWN-CONSERVATORY scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO botanists, NO gardeners. The conservatory is empty of people. Wildlife — a single peacock / hummingbird / butterfly / songbird — only when atmospheric_phenomenon calls for it.

━━━ VICTORIAN GLASS-AND-IRON CONSERVATORY — NON-NEGOTIABLE ARCHITECTURE ━━━
The architecture is VISIBLE and RECOGNIZABLE: arched glass dome above, white-painted or rust-patinaed wrought-iron framework, wrought-iron columns, geometric leaded-glass panes, tile or flagstone floor. This is a Victorian / Edwardian-era glass-and-iron conservatory — Kew Gardens / Royal Greenhouse of Laeken / Crystal Palace lineage. NEVER a modern glass building, NEVER a plastic greenhouse, NEVER a wood-and-glass garden room (that's cozy).

━━━ OBSESSIVE BLOOM-DENSITY — BLOOMS CONSUME THE FRAME ━━━
The conservatory is COMPLETELY OVERTAKEN by blooms — bloom-mass occupies 75-85% of the frame, architecture occupies 15-25%. This is NOT half-and-half — this is a FLORAL EXPLOSION inside a glass-and-iron skeleton. The iron architecture is barely visible THROUGH the bloom-curtain that consumes it.

OBSESSIVE-DENSITY MANDATE — every horizontal and vertical surface BURIED in bloom-mass:
- EVERY iron column completely wrapped — only glints of rust-patina iron visible through the climbing-vine spirals
- EVERY arch / rafter / beam draped in pendant bloom-cascades hanging to head-height
- EVERY flagstone tile of the floor covered in a thick PETAL-CARPET — NEVER bare stone visible
- EVERY planter / urn / pot OVERFLOWING — bloom-mass spilling onto the floor and up the walls
- UPPER rafters CASCADING with vine-curtains that DRAPE down past the lower iron framework
- BLOOM-MASS in the frame's foreground EDGES — petal-cluster spilling out of frame at the corners
- BLOOM-CARPET tapering up the iron columns from the floor and meeting the cascading vines from above
- DEW-AND-POLLEN catching the light EVERYWHERE — no empty air, every quadrant alive with bloom-detail
- MINIMAL bare ground, MINIMAL empty rafter-air, MINIMAL exposed iron — if you can see clean architecture without a bloom-cluster, ADD MORE BLOOMS

If a render reads as "elegant Victorian interior with some flowers", the density failed. The target is "a Victorian conservatory in mid-meltdown from a floral explosion — architecture surviving as a skeleton while the garden takes over completely".

━━━ THE CONSERVATORY TYPE ━━━
${conservatory_type}

━━━ THE STRUCTURAL ANCHOR (the central focal piece) ━━━
${structural_anchor}

The anchor sits in the heart of the conservatory — the central focal-point element around which the bloom-mass arranges itself.

━━━ BLOOM-MASS — NO SINGLE HERO, DISTRIBUTED CARPET ━━━
The blooms are a DISTRIBUTED MASS across the entire conservatory — there is NO single hero species dominating the foreground. 3-4 species rolled from the roster are MASSED IN EQUAL WEIGHT across every surface: climbing the iron columns, draping the rafters, cascading from the dome, blanketing the flagstones, overflowing every planter. The composition is a FLORAL EXPLOSION of mixed species, NOT a single hero bloom.

The STRUCTURAL HERO of the conservatory is the ARCHITECTURE (the glass dome + iron framework + structural anchor) — the BLOOMS are the DISTRIBUTED ENVIRONMENTAL MASS that consumes it. Render them as countless individual blooms at countless points across the frame.

⚠️ DO NOT render a single oversized bloom centered in the frame. DO NOT render only one type of bloom dominating. Each of the 3-4 species appears in MULTIPLE locations across the frame — climbing, draping, cascading, carpeting — distributed in every quadrant.

━━━ WARM DIRECTIONAL SUN THROUGH THE GLASS ━━━
Crisp warm directional sunlight pours through the glass dome at a dramatic angle, landing sharp and clear on the bloom-clouds and flagstones below. The hero blooms catch the warm light in tack-sharp detail; the rest of the conservatory sits in cooler glass-filtered light, the air clear and crisp throughout.
${phenomenonSection}━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP / want to step INTO the conservatory / want to print and frame the image.

Pick ONE wide-interior composition per render (vary):
  A. **DOWN-CENTRAL-AXIS** — wide-angle shot down the central axis of the conservatory, glass-dome rising above, anchor at the focal point ahead
  B. **UPWARD-DOME-VIEW** — camera low, looking UP at the glass-dome canopy, iron-framework radiating, bloom-cascades hanging from above
  C. **CORNER-OVERLOOK** — diagonal corner view showing both the depth of the conservatory and the height of the dome, anchor at the visual focal point
  D. **THROUGH-IRON-COLUMNS** — view through a colonnade of iron columns wrapped in climbing-bloom, depth receding into the bloom-mass
  E. **STAIRCASE-VANTAGE** — view from atop the iron staircase looking down at the bloom-filled floor and across to the dome wall
  F. **FOUNTAIN-EDGE** — view from the edge of the central fountain / reflecting pool, water in the foreground reflecting the dome above
  G. **MEZZANINE-WALKWAY** — view from a wrought-iron mezzanine walkway looking down into the central bloom-mass, depth and verticality together
  H. **THROUGH-FERN-CURTAIN** — wide shot through a cascade of fern-fronds + climbing-vine curtains, deep conservatory visible behind

━━━ MATERIAL POETRY — GLASS / IRON / BLOOM ━━━
"Wrought-iron with rust-patina under climbing-rose vines", "leaded-glass panes scattering sun in geometric patterns onto the flagstones", "moss-and-lichen accumulating in the iron joints", "petals fallen on the tile floor", "crisp warm sunlight raking across the flagstones", "weathered terracotta planters overflowing with bloom-mass".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — ONE as HERO, the others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
Victorian glass-and-iron ONLY (no modern glass building / plastic greenhouse / wooden-frame garden room — that's cozy); INTERIOR with glass roof (no outdoor scene); no pink/rose dominance unless the palette names it; only roster species; distributed bloom-mass across every surface (architecture is the structural hero, not a single bloom).

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[wide-interior composition mode], [Victorian glass-and-iron conservatory architecture established — dome / framework / leaded-glass / flagstone floor barely visible THROUGH the bloom-curtain], [conservatory-type detail + structural anchor at the focal point], [OBSESSIVE distributed bloom-mass — 3-4 named species massed in EQUAL WEIGHT across every iron column, every arch, every rafter, every flagstone, every planter — NOT a single hero, a FLORAL EXPLOSION], [petal-carpet covering the floor wall-to-wall / pendant cascades from rafters to head-height / climbing-bloom spirals wrapping every column], [warm sun-shafts diagonal through the glass]${atmospheric_phenomenon ? ', [atmospheric phenomenon as visible element]' : ''}, [material poetry — rust-patina iron glints through the bloom-curtain, leaded-glass scattering geometric light onto the petal-carpet, weathered terracotta overflowing]

CRITICAL — Victorian glass-and-iron architecture is NON-NEGOTIABLE. Wide-angle interior with visible glass-dome and iron-framework. Warm directional sun through glass. HALF-architectural / HALF-jungle balance.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the composition mode + the conservatory.`;
  },

  BLOOMBOT_CITY_FLOWERS: ({ slots, sharedDNA, vibeDirective }) => {
    const { city_setting, architectural_detail, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the bloom-city scene ━━━
${atmospheric_phenomenon}

A magical atmospheric detail that elevates the scene — render as a specific element within the frame.

`
      : '';

    return `You are a fantasy concept-art painter writing MAGICAL BLOOM-CITY scene descriptions for BloomBot. Output is an 95-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ FLOWERS FIRST AND FOREMOST — read this FIRST ━━━

EVERY render is OVERWHELMINGLY FLOWERS — scale, density, color, amount, variety. Flowers do ALL the heavy lifting. The flowers ARE the city. Architecture is barely visible scaffolding, dwarfed and consumed by the bloom-mass.

🚫 The flowers do the work through SCALE + DENSITY — never through light-spectacle / sci-fi compensation (no glowing bloom-cores / bioluminescence / will-o-wisps / god-rays / prismatic-refraction / aurora / impossible double-suns / fairy-dust / neon accents).

✓ LET THE FLOWERS DO THE WORK — the heavy lifting comes from:
  • SCALE — kilometer-tall flower-walls, building-sized single blossoms, hundred-meter rose-cascades
  • DENSITY — packed so thick you can't see the architecture underneath, layered hundreds of flowers deep
  • AMOUNT — millions of blooms in frame, every quadrant filled with blossom
  • VARIETY — many flower species in painterly equal weight, rich color stacking
  • COLOR — saturated jewel-tones across the full spectrum, painterly chromatic richness
  • NATURAL CINEMATIC LIGHT — golden hour / dawn / dusk / soft daylight / gentle backlight (NOT magical glow)

🚫 NO REAL-WORLD TOURIST CITIES — Mediterranean alleyways, Parisian boulevards, Lisbon staircases, Marrakech courtyards, Tokyo back-streets, Cinque Terre, Venice, Cuba, Greek islands, Cotswolds, Stockholm, Tuscany, Pueblo, Jaipur, Hoi An, Kyoto — EXPLICITLY BANNED.

━━━ LIGHTING / WEATHER / TIME-OF-DAY VARIETY — MANDATORY ━━━

The rolled lighting axis is the AUTHORITY for the scene's light/weather/time. Render it FAITHFULLY. Do NOT default to "soft painted golden-hour mist with atmospheric haze" on every render — that's the homogenization trap.

USE THE FULL LIGHTING SPECTRUM (the lighting axis rotates across these — RENDER what it rolls):
  • Bright clear noon — sharp midday daylight, deep shadow, crisp clean color, sunny day, NO mist
  • Sharp golden-hour rake — low-angle warm-sun cutting horizontal across scene, long crisp shadows, NO haze
  • Blue-hour twilight — cool deep-blue light just before dawn or after dusk, no mist, soft moody clarity
  • Night / moonlit — silver moonlight on the blooms, blue-violet shadows, starlit-clear
  • Stormy / dramatic — heavy storm-clouds overhead, single sun-shaft breaking through, dark moody chiaroscuro
  • Overcast diffuse — flat soft cloudy daylight, no shadows, even color across the scene
  • Crisp dawn-pink — sharp pink-coral dawn light, clear air, no fog
  • Hot afternoon glare — bright sun overhead, blooms in full color saturation, crisp shadows
  • Rain — fresh rain wetting every petal, glistening surfaces, light through rain-streaks
  • Snow — fresh snow drifting onto blossom-mass, cold bright clarity
  • Chiaroscuro Rembrandt — directional light from one side, deep velvet shadow on the opposite, dramatic
  • Dappled canopy — leaf-shadows fragmenting light into shifting patches on bloom-carpet
  • Magic-hour painted glow — warm late-afternoon backlight (the OLD default — use SPARINGLY, 1-in-5 max)
  • Crystalline clarity — exceptionally clear sharp air, every depth layer crisp edge-to-edge, vivid saturated detail to the far distance

⚠️ Render whatever the lighting axis ROLLED. Do NOT default to atmospheric haze / painted-gold mist / soft natural light EVERY render (the homogenization trap) — use the FULL spectrum, so across a batch of 5 we see at least 3-4 distinct lighting/weather/time-of-day modes.

✓ FANTASY FLOWER-CITY LINEAGE — but the FLOWERS dominate, not the architecture:
  • Mountains of cascading flowers with fantasy spires barely poking through
  • Kilometer-high flower-cliffs with hint of carved architecture half-buried in bloom
  • Endless flower-meadows stretching to fantasy spires on the horizon
  • Flower-canyons with walls of bloom hundreds of meters tall
  • Mallorn-tree fantasy citadels SO consumed by flowers the trees are barely visible
  • Sky-floating fantasy spires SO bloom-covered they read as floating bouquets
  • Fantasy ruins SO claimed by flowers they read as flower-mountains
  • Endless cherry-blossom forests with fantasy spires emerging from the canopy
  • Vine-cathedrals of overlapping wisteria-cascades draped from kilometer-tall fantasy spires
  • Flower-flooded valleys where blooms drown everything except distant fantasy spires

━━━ BLOOMS ARE 80-90% OF THE FRAME — FLOWERS DO ALL THE WORK ━━━

This is NOT a fantasy-city with flowers as decoration. This IS flowers — flowers as the entire visible world, with hints of fantasy-architecture half-buried in the bloom-mass. Blooms fill 80-90% of every render. Every quadrant is packed dense with blossom — building-scale petal-cascades, mountain-scale flower-cliffs, sky-filling petal-storms, valley-deep flower-canyons.

The fantasy-architecture is BARELY VISIBLE — a spire-tip emerging from the bloom-mountain, a hint of a tower-window through cascading petals, a fantasy bridge half-buried in blossom-snow. The flowers OVERWHELM, the architecture is a small clue that this is a city.

FLOWER-SCALE EXAMPLES (push every entry toward this scale):
  • Kilometer-tall flower-cliffs of overlapping rose-cascades pouring hundreds of meters
  • Building-sized single peonies the size of cathedrals
  • Sky-filling cherry-blossom canopy spanning the entire upper-frame
  • Mountain-scale wisteria-curtains draping from invisible spires above
  • Flower-canyons where you can't see the walls for the blooms
  • Mountains of blossom obscuring everything beneath
  • Endless meadows of waist-high blooms stretching to the horizon

🚫 NO "flower-decoration on architecture." The flowers ARE the scene. Architecture is a glimpse, not a stage.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people, NO pedestrians. The empty fantasy bloom-city is the subject. (A sleeping faerie-creature / sleeping pixie-flock / distant elven-spirit at scale-prover scale — only when atmospheric_phenomenon calls for it.)

━━━ THE FANTASY BLOOM-CITY SETTING ━━━
${city_setting}

━━━ THE ARCHITECTURAL DETAIL (the fantasy city's signature element) ━━━
${architectural_detail}

The architectural detail is the fantasy city's signature — render it with painterly precision so the impossible-fantasy-city style is unmistakable. The bloom-cascade GROWS FROM / WRAPS / DRAPES the detail as if the detail itself is made of flowers.
${phenomenonSection}━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST HAVE SOMETHING STRIKING ━━━
Every render is a JAW-DROPPING EPIC CINEMATIC MOVIE-POSTER / GALLERY-PIECE FRAME. Every quadrant earns its space. Stack 5+ visually-arresting elements simultaneously:

  1. **THE FANTASY BLOOM-CITY** as the dominant hero — impossible architecture overgrown / consumed / formed BY flowers
  2. **OVERWHELMING BLOOM-MASS** — building-scale cascades, sky-filling petal-storms, vine-bridges, flower-cathedrals
  3. **DRAMATIC FANTASY SKY** — aurora / sunset / dawn / cloud-layers / impossible double-sun / starfield / floating moon
  4. **MAGICAL ATMOSPHERIC LAYER** — drifting petal-snow / crisp glinting pollen-flecks / sharp floating sparkles / clear warm directional light
  5. **SENSE OF VAST SCALE** — multi-tier vertical depth from foreground bloom-cascade to deep-distance fantasy spires receding in crisp sharp overlapping layers

THINK: Tolkien-illustrated-edition / Pre-Raphaelite painted-bloom-fields / Studio-Ghibli cherry-blossom-canopy / Lothlorien-from-Fellowship (the FLOWERS, not the architecture) / Brian-Froud-faerie-realm painted-flower-density / classical-painted "Garden of Earthly Delights" flower-mass / Monet-water-lily-immersive panels (BUT fantasy scale).

Pick ONE composition per render (FLOWER-DOMINATED, vary):
  A. **FLOWER-CANYON DEPTH** — walls of cascading flowers hundreds of meters tall on both sides, narrow path winding through, fantasy spires hint at the canyon-end
  B. **KILOMETER-CASCADE WALL** — wall of overlapping rose / peony / wisteria cascades pouring down from above, fantasy architecture barely glimpsed at the top
  C. **BLOOM-MOUNTAIN VISTA** — mountain made entirely of flowers, fantasy spires barely emerging from the bloom-mass, dawn/dusk light
  D. **ENDLESS FLOWER-MEADOW** — vast painted-meadow stretching to a fantasy citadel on the distant horizon, foreground is waist-high blooms in every direction
  E. **CHERRY-BLOSSOM CANOPY** — looking up at endless cherry-blossom canopy filling 80%+ of frame, fantasy spire-tips poking through at the top
  F. **VINE-CATHEDRAL FROM BELOW** — looking up at overlapping wisteria-cascades draping kilometer-deep from invisible fantasy structures above
  G. **FLOWER-FLOODED VALLEY** — fantasy spires emerging from a valley flooded knee-deep in floating blossoms, painted-gold light
  H. **BLOSSOM-DROWNED RUIN** — fantasy ruins so claimed by flowers they read as flower-mountains, only the tip of a spire visible
  I. **PETAL-SNOW DEPTH** — fantasy spires barely visible through dense falling petal-snow filling the entire frame
  J. **BLOOM-AVENUE TUNNEL** — viewer inside a tunnel of overlapping bloom-cascades, fantasy spire-tips poking through at the far end
  K. **FLOWER-CLIFF HORIZON** — sheer flower-cliff dominating the frame, hint of fantasy architecture half-buried near the top, soft natural light
  L. **MALLORN-CANOPY OVERWHELM** — golden mallorn-tree fantasy citadel SO covered in flowers the trees are barely visible, painted-gold light

DELIBERATE COMPOSITION CRAFT — FLOWER-DOMINATED CINEMATIC SHOT:
- Strong LEAD-LINES into flower-depth (bloom-canyon recede / cherry-canopy verticality / flower-cliff horizon-line)
- CINEMATIC POV — fantasy scale, NOT pedestrian
- Multi-tier depth: foreground tactile bloom-detail → midground bloom-mass → deep-distance fantasy spires barely visible in soft depth
- NATURAL CINEMATIC LIGHT ONLY — golden-hour sun / dawn / dusk / soft daylight / gentle backlight. NEVER magical glow / bioluminescence / sci-fi god-rays.
- Sky is small or implied — the FLOWERS fill the frame, not a dramatic sky

━━━ MATERIAL POETRY — FLOWER-DOMINATED TEXTURES ━━━
"Hundred-meter rose-cascade pouring down a hidden cliff-face in overlapping petal-waves", "wall of cherry-blossoms so dense the trunks are invisible behind the bloom-mass", "thousands of overlapping peonies stacked deep enough to drown a spire", "cascading wisteria-curtains hanging hundreds of meters from invisible structures above", "valley flooded knee-deep in floating blossoms with only a spire-tip visible", "endless meadow of layered wildflowers stretching to the horizon".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — mass them at FANTASY SCALE across the bloom-city (building-scale cascades, sky-filling storms, full-facade waterfalls of blossom).

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
NO real-world tourist cities / historic architecture (Mediterranean / Parisian / Tokyo / Venetian / colonial / half-timber etc.) — this is FANTASY; no "postcard with extra flowers" energy, no pedestrian tourist-eye POV / cobblestone textures, no modern / corporate architecture. The FLOWERS dominate (80-90% of frame) — fantasy-architecture is barely-visible scaffolding, never the focal subject (the architecture-decoration trap). Natural cinematic light only — no sci-fi / magic-light compensation (glowing cores / bioluminescence / god-rays / aurora / neon). No pink/rose/blush dominance unless the palette names it; only roster species; no people / vehicles / market-stalls.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[cinematic fantasy-bloom-city composition mode], [specific fantasy bloom-city setting + signature fantasy architectural detail rendered with painterly precision], [OVERWHELMING bloom-mass at fantasy scale — building-scale cascades, sky-filling petal-storms, vine-bridges, multi-species in equal weight, 60-70% of frame], [cinematic establishing POV with multi-tier depth into fantasy distance], [dramatic fantasy sky + magical atmospheric layer]${atmospheric_phenomenon ? ', [atmospheric phenomenon as visible magical detail]' : ''}, [material poetry — mallorn-bark / crystalline bloom / bioluminescent moss / vine-grown rampart]

CRITICAL — cinematic fantasy-bloom-city establishing shot. BLOOMS are the OVERWHELMING SUBJECT (60-70% of frame), fantasy-architecture is SCAFFOLD. NO real-world tourist cities. NEVER a pedestrian eye-level snapshot.

Output ONLY 95-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the composition mode + the fantasy bloom-city.`;
  },

  BLOOMBOT_RECLAIM: ({ slots, sharedDNA, vibeDirective }) => {
    const { ruin_type, decay_anchor, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the ruin ━━━
${atmospheric_phenomenon}

This is the magic-moment detail that amplifies the awe-mood — render as a specific element within the frame.

`
      : '';

    return `You are a fine-art ruin painter writing ABANDONED-STRUCTURE-RECLAIMED-BY-FLOWERS scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO ghost-figures, NO hooded silhouettes in the doorway. The structure is ABANDONED — long since left by its inhabitants. (Tiny wildlife — a single deer / fox / owl / butterfly / bird-cluster — only when atmospheric_phenomenon calls for it.)

━━━ ABANDONED STRUCTURE — RECOGNIZABLE BUT IN DEEP DISREPAIR ━━━
This is a specific recognizable ABANDONED HUMAN STRUCTURE — Greek temple / Mayan pyramid / Roman aqueduct / abandoned cathedral / forgotten library / derelict lighthouse / amusement-park carousel / shipwreck / castle ruin / amphitheatre / etc. The structure is in DEEP DISREPAIR — cracked, mossy, half-fallen, vine-strangled, time-worn — BUT it's still IDENTIFIABLE as the specific kind of place it was. The viewer recognizes "that's a Greek temple" / "that's a cathedral" immediately.

━━━ FLOWERS CONSUMING THE RUIN — DISTRIBUTED MASS ━━━
Flowers have CONSUMED the ruin — climbing vines wrap every column / standing stone, blooms blanket every fallen stone and broken stair, root systems crack the masonry from inside (visible roots in the walls), petals carpet the floor wall-to-wall, vines drape from every broken arch and crumbled window.

The blooms are a DISTRIBUTED MASS — 3-4 species from the roster massed IN EQUAL WEIGHT across the entire structure. There is NO single hero bloom — the ARCHITECTURE (the ruin) is the structural hero, the blooms are the environmental overflow consuming it.

⚠️ DO NOT default to one giant bloom. DO NOT concentrate blooms in one corner. DISTRIBUTE the bloom-mass across every quadrant — the ruin is BURIED in blooms.

━━━ AWE + MELANCHOLY + TRIUMPHANT-NATURE — MOOD MANDATE ━━━
The mood is AWE + MELANCHOLY + TRIUMPHANT NATURE. NEVER horror. NEVER ominous. NEVER spooky / haunted / creepy. NEVER dark-fantasy. The mood is "nature has won, in beauty" — the human structure is being lovingly consumed by life. The viewer feels REVERENCE, not dread.

━━━ THE RUIN TYPE ━━━
${ruin_type}

━━━ THE DECAY ANCHOR (the specific decay focal-point) ━━━
${decay_anchor}

The decay anchor is rendered with hyperreal precision — the specific way time has marked the structure (the cracked column / collapsed dome / fallen statue / shattered window / etc.). The bloom-mass converges around the decay-anchor as the visual focal point.
${phenomenonSection}━━━ WARM DIRECTIONAL SUN THROUGH BROKEN ARCHITECTURE ━━━
Crisp warm directional sunlight pours through the BROKEN parts of the structure — through the collapsed roof / shattered windows / cracked dome / fallen wall section — landing sharp and clear on the bloom-mass where it pools; the rest sits in cooler shadow, the air clear and crisp.

━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP at the beauty of nature's reclamation / want to print and frame the image.

Pick ONE wide cinematic composition per render (vary):
  A. **CENTERED RUIN HERO** — the ruin centered in the frame at midground, bloom-mass radiating outward from it, sky visible through broken roof
  B. **THROUGH-A-DOORWAY** — view through a broken doorway / archway / window of the ruin INTO the bloom-filled interior beyond
  C. **WIDE EXTERIOR ESTABLISHING** — wide cinematic establishing shot of the ruin in its landscape, fully consumed by blooms, distant horizon
  D. **INTERIOR-UPWARD** — interior view looking UP through the collapsed roof / broken dome at sky, blooms hanging from rafters
  E. **STAIRCASE OF DECAY** — broken stone staircase leading INTO the ruin, bloom-mass on every step
  F. **COLUMN-COLONNADE** — view down a colonnade of broken columns wrapped in climbing-bloom, vanishing point in the deep distance
  G. **APPROACH AT GOLDEN HOUR** — golden-hour exterior approach to the ruin, bloom-meadow leading to the structure entry
  H. **PARTIAL-COLLAPSE FRAMING** — partial-collapse of one wall framing the bloom-filled interior visible beyond, ruin-as-frame-within-frame
  I. **WATER-EDGE RUIN** — ruin half-sunken in a pond / lagoon / sea-edge, water reflecting the bloom-mass + ruin
  J. **OVERGROWN INTERIOR** — interior view of the ruin's main hall fully reclaimed, blooms cascading from every rafter, fallen stones carpeted in bloom

DELIBERATE COMPOSITION CRAFT:
- Multi-tier depth: tactile foreground bloom-detail + crumbled stone → midground ruin → deep distance warm depth
- Strong leading-lines (column-colonnade / staircase / path / fallen wall)
- Light hierarchy: crisp warm directional sun pours through broken architecture, cool ambient shadow elsewhere
- Architecture frames the shot (broken arch / collapsed dome / column-row framing)
- Intentional negative-space (sky through broken roof / open horizon / quiet shadow quadrant)

━━━ MATERIAL POETRY — TIME-WORN TEXTURES ━━━
"Moss-and-lichen patina on every cracked stone", "weathered marble with bloom-vines threading the joints", "rust-streaked iron leaning against a collapsing wall", "root systems visibly cracking the masonry from inside", "petal-carpet covering the fallen stones wall-to-wall", "weathered carved-stone inscriptions still legible through the bloom-curtain".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species, mass them in EQUAL WEIGHT consuming the ruin (climbing columns / blanketing fallen stones / draping arches / carpeting floors).

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
AWE + MELANCHOLY + TRIUMPHANT-NATURE — NEVER horror / ominous / spooky / dark-fantasy; historic / ancient / classical ruins only (no modern / corporate); the ruin stays RECOGNIZABLE (don't let blooms hide what it was); distribute the bloom-mass (no single hero bloom); no pink/rose dominance unless the palette names it; only roster species; no people / figures.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write in this exact order ━━━
[wide cinematic composition mode], [specific ruin type + decay anchor rendered with hyperreal time-worn precision — the structure is recognizable but in deep disrepair], [bloom-mass DISTRIBUTED across every column / fallen stone / broken arch — 3-4 species in equal weight consuming the ruin], [sun-shafts pouring through broken roof / wall / window]${atmospheric_phenomenon ? ', [atmospheric phenomenon as visible element]' : ''}, [material poetry — moss-patina, weathered stone, vine-cracked masonry, petal-carpet], [AWE + MELANCHOLY + TRIUMPHANT-NATURE mood — reverent not ominous]

CRITICAL — Architecture-as-structural-hero + bloom-as-distributed-mass + AWE-NOT-HORROR mood. NEVER horror / ominous / spooky. NEVER a single hero bloom dominating.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the composition mode + the ruin.`;
  },
};
