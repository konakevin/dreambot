#!/usr/bin/env node
/**
 * Generate a BloomBot axis pool using Sonnet.
 *
 * Mirrors the gen-mechbot-pool.js / gen-gothbot-pool.js infrastructure:
 * signature-based dedup, --target iterative gen+dedup loop, append-mode
 * preservation of existing entries. Pool recipes are BloomBot-bespoke.
 *
 * Usage:
 *   node scripts/gen-bloombot-pool.js --pool bloombot_landscape_landform --target 30
 *   node scripts/gen-bloombot-pool.js --pool bloombot_landscape_scale_prover --target 30
 *
 * Output: scripts/bots/faebot/seeds/<pool>.json
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : fb; };
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '30'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// BloomBot-shared aesthetic vocabulary (used across all pool recipes)
// ─────────────────────────────────────────────────────────────
//
// BloomBot's identity: pure-scenery bot where FLOWERS are the hero. Every
// entry should imply flowers but NOT name specific species (species come
// from the per-render regional roster). Hyperreal CGI register — think
// "the turtle aesthetic" — saturated, jewel-toned, multi-tier depth,
// cinematic. NO PEOPLE in any entry, ever. Wildlife only as peripheral
// accent (hummingbird / bee / butterfly / small lizard).
//
// Cross-path bans (so each path stays in its lane):
//   - NO interiors/rooms/sunrooms (cozy's territory)
//   - NO archways/passages/tunnels (garden-walk's territory)
//   - NO surreal/gravity-defying/impossible (dreamscape's territory)
//   - NO glass-and-iron conservatory architecture (conservatory's territory)
//   - NO city streets/urban architecture (city-flowers' territory)
//   - NO ruins/abandoned structures (reclaim's territory)
//   - NO macro/closeup framing (closeup's territory)

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — BloomBot bespoke (landscape path, 2026-05-16)
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ─── flower-fairy path (R11 reset): creature DNA + scene setting ───
  flower_fairy_creatures: {
    format: 'simple',
    theme: `FLOWER-FAE CREATURE DESCRIPTIONS for the FaeBot flower-fairy path. Each entry is ONE unified mythic fae creature whose entire body is made-of / merged-with / built-from FLOWERS. Same vibe + structure as FOREST_CREATURES (dryad / naiad / fox-spirit) but here every creature is a FLOWER-fae. Each entry 40-80 words, comma-separated descriptive clauses.

⚠️ MANDATORY (stack 4+ exotic flower-fae features per entry):
  • Skin-tone made of flowers (petal-skin, blossom-tinted, pollen-dusted, dewdrop-translucent)
  • Hair made of flowers (rose-cascade hair, wisteria-trail hair, peony-bloom hair, etc.)
  • Garment / wrap made of flowers (petal-bodice, leaf-skirt of woven blooms, vine-and-flower wrap)
  • Wings made of flowers (butterfly-wings of poppy petals, gossamer-wings of jasmine blooms, etc.) OR fae-antennae of stamens / fae-horns of bloom-clusters
  • Eye color (jewel-tone — amber, violet, emerald, sapphire, pearl-white, glowing) + pointed elf-ears
  • Magical signature near her (glowing pollen-cloud, firefly-trail, will-o-wisp, drifting petals, glow-veins under skin)
  • Candid posture caught mid-action (sipping nectar, weaving petals, cupping pollen, perched on a stamen, kneeling among blooms, etc.)

⚠️ POOL VARIETY — distribute across:
  Different flower-types per creature (rose-fae / wisteria-fae / poppy-fae / lily-fae / sunflower-fae / cherry-blossom-fae / lotus-fae / morning-glory-fae / tulip-fae / orchid-fae / jasmine-fae / marigold-fae / dahlia-fae / iris-fae / chrysanthemum-fae / sweet-pea-fae / etc.)
  Different ethnicities (European / Mediterranean / Latin-American / Asian / African-American — distribute evenly)
  Different color palettes (sunset-coral / twilight-purple / blush-pink / monochrome-white / rainbow / etc.)

🚫 STRICT BANS:
  • NO human-model language (no "stunning" / "beautiful" / "model")
  • NO sexual / suggestive language
  • NO posed-for-camera (always candid posture)
  • NO mention of plain fabric / tulle / silk`,
    touchpoints: [
      'A rose-fae with petal-soft pink-blushed skin and waist-long hair of cascading garden-rose blooms, wearing a bodice of woven crimson petals and skirt of overlapping rose-leaves, butterfly-wings constructed entirely of layered red-rose petals spread wide, pointed elf-ears, large jewel-violet eyes with sparkle catchlights, kneeling among wild roses with cupped palms catching drifting petals, soft golden-pollen cloud halo around her.',
      'A wisteria-sprite with lavender-glowing skin and trailing hair of cascading purple wisteria racemes, draped petal-shawl of pale-violet blossoms over a vine-and-leaf bodice, gossamer wings of stitched wisteria petals, pointed elf-ears, large amber eyes with golden inner light, perched on a vine-swing weaving a small wisteria-crown with her fingertips, soft silver pollen drifting around her.',
      'A poppy-fae with sun-warmed skin tinted coral-blush and hair of cascading red-poppy blooms threaded with black-anemone centers, vine-wrap bodice of woven poppy petals, dramatic butterfly-wings made of alternating red-poppy and black-anemone petals, pointed elf-ears, large saturated-amber eyes, standing waist-deep in a poppy-field with hands lifted catching golden pollen-cloud rising from her palms.',
      'A cherry-blossom-fae with pale porcelain-glowing skin and silk-black hair threaded with hundreds of pink-and-white cherry-blossom petals, petal-soft wrap of overlapping sakura blooms, translucent wings of woven pink-cherry-petals, pointed elf-ears, large jewel-violet eyes, seated on a giant cherry-blossom branch with petals falling around her in slow snow, soft luminous halo from her body.',
      'A morning-glory-fae with translucent skin showing tiny blue constellations beneath and hair of cascading blue-and-purple morning-glory trumpets, draped petal-shawl of indigo morning-glory blooms over a vine-leaf bodice, gossamer wings of stitched indigo petals, pointed elf-ears, large emerald-jewel eyes, sipping dewdrop nectar from a giant morning-glory cup, glowing fireflies in slow orbit around her shoulders.',
      'A sunflower-fae with golden-bronze skin dusted with sun-gold pollen and hair of vibrant yellow-and-amber sunflower-petals woven through, woven petal-bodice of golden sunflower-rays and brown-seed-center detail, large butterfly-wings of layered golden-sunflower-petals spread wide, pointed elf-ears, large saturated amber-jewel eyes, kneeling at the base of a giant sunflower-stalk with one palm pressed to its trunk, golden pollen-cloud halo glowing around her.',
      'A lotus-fae with dewdrop-translucent skin glowing pearl-pink and hair of cascading pink-and-white lotus-petals flowing past her waist, petal-wrap bodice of pale-pink lotus blooms over a leaf-skirt of jade water-leaves, gossamer wings of woven pink-lotus petals, pointed elf-ears, large pearl-white eyes radiating gentle light, seated cross-legged on a giant lotus-pad with cupped palms holding glowing dewdrop, soft golden pollen drifting around her.',
      'A tulip-fae with porcelain-blush skin and hair of cascading multi-color tulip blooms in coral + yellow + magenta + violet, woven petal-bodice of overlapping tulip-petals in coordinated rainbow palette, large butterfly-wings of layered tulip-petals, pointed elf-ears, large jewel-violet eyes with sparkle catchlights, kneeling inside a giant tulip-bell as if it were a room, glowing fireflies in slow orbit around her.',
      'An orchid-fae with deep-bronze-glowing skin and hair of cascading deep-purple-and-magenta orchid blooms, petal-wrap bodice of velvety orchid blooms in dramatic plum-and-pearl gradient, gossamer wings of stitched orchid-petals, pointed elf-ears, large amber-and-gold eyes, perched on a mossy orchid-branch with one hand lifted weaving a magical sigil, drifting pollen-cloud halo and small purple-glow will-o-wisps floating around her.',
      'A daisy-fae with peach-cream skin and white-blonde hair threaded with cascading white-daisy blooms and small yellow stamens, petal-bodice of overlapping white-daisy petals over a leaf-skirt, butterfly-wings made of layered daisy-petals with golden-pollen wing-tips, pointed elf-ears, large sky-blue eyes with crystal catchlights, dancing barefoot through a meadow of daisies with skirt swirling, drifting petals trailing behind her.',
      'A peony-fae with warm-olive-glowing skin and hair of cascading blush-pink peony blooms threaded with cream-roses, petal-wrap bodice of pale-pink peony-petals over a leaf-skirt, large butterfly-wings of overlapping pink-peony-petals spread wide, pointed elf-ears, large hazel-amber eyes, seated on a giant peony-bloom as if it were a throne, soft silver pollen-cloud halo around her.',
      'A marigold-fae with warm-bronze-glowing skin and hair of cascading orange-and-gold marigold-blooms, woven petal-bodice of orange-and-gold marigold-petals, large butterfly-wings made of layered marigold-petals in fire-and-amber palette, pointed elf-ears, large saturated-amber eyes, kneeling in a marigold-meadow with cupped palms releasing a golden pollen-explosion, fireflies in slow orbit.',
      'A jasmine-fae with luminous pearl-fair skin and silver-white hair threaded with cascading white-jasmine blooms, gossamer wings of stitched jasmine-petals with pearl-glow, pointed elf-ears, large violet-jewel eyes, draped petal-shawl of white-jasmine blooms, kneeling under a jasmine-vine-arbor sipping nectar from a tiny jasmine-cup, soft moonlight-cool atmosphere with silver pollen drifting.',
      'A dahlia-fae with deep-ebony-and-gold-glowing skin and hair of cascading deep-magenta-and-burgundy dahlia blooms in dense cluster, woven petal-bodice of overlapping wine-burgundy dahlia-petals, large butterfly-wings of layered magenta-dahlia-petals spread wide, pointed elf-ears, large golden-amber eyes with star catchlights, dancing through a dahlia-field at twilight with petals trailing behind, glowing fireflies around her.',
      'An iris-fae with cool olive-glowing skin and hair of cascading deep-purple-and-blue iris blooms threaded with golden-yellow stamens, petal-wrap bodice of velvety violet-and-cobalt iris-petals, gossamer wings of stitched iris-petals with golden vein-glow, pointed elf-ears, large emerald-green eyes with crystal catchlights, perched on a mossy log among iris-clumps with one palm catching drifting golden pollen.',
      'A chrysanthemum-fae with warm-caramel-glowing skin and hair of cascading rust-and-bronze chrysanthemum blooms in massive volume, woven petal-bodice of overlapping rust-russet chrysanthemum-petals, large butterfly-wings of layered chrysanthemum-petals in autumn-amber palette, pointed elf-ears, large warm-hazel eyes, seated on a moss-and-bloom stump weaving a flower-spell with her fingertips, drifting autumn petals.',
      'A sweet-pea-fae with porcelain-blush skin and hair of cascading pastel-pink-and-lavender sweet-pea blooms in fluttering clusters, draped petal-wrap of soft-pink sweet-pea blooms, gossamer wings of stitched sweet-pea petals with pearl-glow, pointed elf-ears, large sky-blue eyes with sparkle catchlights, sipping dewdrop from a sweet-pea-flower with butterflies circling her shoulders.',
      'A lily-fae with luminous fair-porcelain skin and hair of cascading white-tiger-lily blooms threaded with orange-stamen accents, woven petal-bodice of overlapping white-and-orange lily-petals, large butterfly-wings of layered white-lily petals with orange-pollen tips, pointed elf-ears, large violet-jewel eyes, kneeling beside a pond of giant water-lilies with one finger trailing through the water, dragonflies hovering near.',
      'A magnolia-fae with caramel-glowing skin and hair of cascading cream-and-pink magnolia blooms in soft volume, draped petal-shawl of pale-cream magnolia-petals, gossamer wings of stitched magnolia-petals in pearl-glow, pointed elf-ears, large hazel-amber eyes, seated under a magnolia-tree-canopy with petals falling around her, fireflies in slow orbit.',
      'A hibiscus-fae with deep-bronze-glowing skin and hair of cascading hot-pink hibiscus blooms with yellow stamens, woven petal-bodice of overlapping hibiscus-petals in tropical hot-pink, large butterfly-wings of layered hibiscus-petals with magenta-and-gold gradient, pointed elf-ears, large saturated-amber eyes, dancing in a tropical-bloom meadow with arms outstretched, glowing fireflies trailing.',
      'A foxglove-fae with sun-warmed skin and hair of cascading purple-and-cream foxglove bells with cream-throat detail, vine-wrap bodice of woven foxglove-stems with foxglove-bells, gossamer wings of foxglove-petals with delicate purple-glow, pointed elf-ears, large amber eyes, perched on a foxglove-tower with one foxglove-bell in her cupped palm, drifting pollen-cloud halo.',
      'A bluebell-fae with translucent skin showing tiny blue constellations beneath and silver-white hair threaded with cascading blue-bluebell-clusters, draped petal-shawl of blue bluebell-blooms, gossamer wings of stitched bluebell-petals with silver-glow, pointed elf-ears, large emerald-jewel eyes, kneeling in a bluebell-forest understory with one palm lifted catching falling bluebell-petals, magical silver-glow halo.',
      'A buttercup-fae with cream-fair skin and golden-blonde hair threaded with cascading yellow-buttercup blooms in dense clusters, woven petal-bodice of overlapping yellow-buttercup petals, butterfly-wings of layered yellow-buttercup-petals with sunshine-glow, pointed elf-ears, large sky-blue eyes with crystal catchlights, dancing through a buttercup-meadow with skirt swirling, drifting golden pollen around her.',
      'A camellia-fae with porcelain-fair skin and silk-black hair threaded with cascading deep-red-and-pink camellia blooms, petal-wrap bodice of velvety red-camellia petals, gossamer wings of stitched camellia-petals with crimson-glow, pointed elf-ears, large jewel-violet eyes with sparkle catchlights, seated on a camellia-branch with cupped palms holding glowing dewdrop, fireflies in slow orbit.',
      'A snapdragon-fae with warm-olive-glowing skin and hair of cascading multi-color snapdragon blooms in coral-pink-and-yellow rainbow, woven petal-bodice of overlapping snapdragon-petals in vibrant palette, large butterfly-wings of layered snapdragon-petals in rainbow gradient, pointed elf-ears, large warm-hazel eyes, perched on a giant snapdragon-stalk with one hand lifted weaving a magical sigil, drifting pollen halo.',
      'A cosmos-fae with deep-bronze-glowing skin and hair of cascading deep-magenta-and-pink cosmos blooms with yellow centers, draped petal-shawl of magenta cosmos blooms, gossamer wings of stitched cosmos-petals with pink-glow, pointed elf-ears, large amber-and-gold eyes, kneeling in a cosmos-meadow at golden-hour with cupped palms releasing a pink pollen-storm, butterflies circling.',
      'A dandelion-seed-fae with translucent pale skin and silver-white hair fragmenting at the edges into drifting seed-clocks, draped soft-petal wrap of cream-yellow dandelion blooms, gossamer wings of dandelion-clock-membrane with seeds visibly detaching, pointed elf-ears, large pearl-white eyes, blowing on a dandelion-clock with one hand, magical seed-cloud trailing into the air around her.',
      'A pansy-fae with porcelain-blush skin and dark-brown hair threaded with cascading multi-color pansy blooms in deep-violet-yellow-and-orange palette, woven petal-bodice of overlapping velvety pansy-petals, gossamer wings of stitched pansy-petals with vivid-jewel glow, pointed elf-ears, large saturated-amber eyes, perched on a moss-and-pansy stump with one finger tracing a magical sigil in the air, glowing fireflies.',
      'An anemone-fae with luminous cool-fair skin and silver-white hair threaded with cascading purple-and-pearl anemone blooms with black centers, draped petal-shawl of velvety violet-anemone petals, butterfly-wings of layered anemone-petals with black-center detail and silver-glow, pointed elf-ears, large emerald-green eyes, seated on a moss-bench in an anemone-meadow with petals falling around her, magical silver-glow halo.',
      'A ranunculus-fae with warm-bronze-glowing skin and hair of cascading soft-pink-and-cream ranunculus blooms in dense layered clusters, woven petal-bodice of overlapping pink ranunculus-petals, gossamer wings of stitched ranunculus-petals with pearl-blush glow, pointed elf-ears, large warm-hazel eyes with golden catchlights, kneeling in a ranunculus-meadow at golden-hour with hands cupping a glowing seed, fireflies trailing.',
    ],
    instructions: `Each entry is ONE FLOWER-FAE creature unified description, 40-80 words. Format: "A [flower-type]-fae with [skin-tone] skin and [hair-color] hair of [cascading specific flowers], [petal-bodice / vine-wrap garment], [wing-type made of specific flower petals], [pointed elf-ears], [eye-color], [candid pose interacting with their flower-environment], [magical signature]". Stack 4+ exotic flower-fae features per entry. Distribute across 30+ flower-types and 5 ethnicities. Output as a NUMBERED list, one per line.`,
  },

  flower_fairy_scenes: {
    format: 'simple',
    theme: `FLOWER-FAIRY SCENE SETTINGS for the FaeBot flower-fairy path. Each entry describes ONE specific fairy-in-flowers setting where she fills 40-55% of the frame. Same vibe + structure as FOREST_FAIRY_SCENES (Hamadryad emerging from oak, Leshy leaning against birch trunk) but here every scene is FLOWER-saturated. Each entry 30-60 words.

⚠️ MANDATORY — every scene establishes:
  • The fairy interacting with flowers (emerging from a giant bloom, perched on a stamen, dancing in a flower-field, sipping from a bloom-cup, sleeping on a lotus-pad, etc.)
  • The flower-environment wrapping around her (field of wildflowers, wisteria-pergola, lotus-pond, cherry-blossom grove, peony-cluster, etc.)
  • Atmospheric depth (foreground tactile bloom-detail / midground fairy / background fading bloom-mist)
  • Magic creature/light element (fireflies, drifting petals, glowing pollen, will-o-wisps)

⚠️ POOL VARIETY — distribute across these scene types:
  Field-of-flowers (wildflowers / poppies / lavender / sunflowers / daisies / cosmos)
  Garden architecture (wisteria-pergola / rose-arch / lotus-pond / cherry-blossom grove)
  Living-in-flowers (inside giant tulip-bell / peeking from peony / curled in lotus-pad / perched on stamen)
  Bloom-interaction (sipping nectar / weaving petal-crown / cupping pollen / blowing dandelion-seeds)
  Magical bloom-event (giant bloom opening for her / petal-storm carrying her / glowing-bloom sharing nectar)

🚫 STRICT BANS:
  • NO modern / urban / industrial setting
  • NO ruins / abandoned (different territory)
  • NO interior rooms (different territory)
  • NO additional human figures
  • NO violent / scary / edgy mood`,
    touchpoints: [
      'fairy half-emerged from a giant blooming peony as if it were her home, fingers pressed to glowing pollen-runes on the petals, soft golden pollen-motes drifting around her face, fern-fronds and rose-vines cascading over the ground',
      'fairy perched on a giant sunflower stamen as if it were a balcony, one foot dangling over the bloom-disk, glowing pollen catching the warm sunlight, vine-curtain hanging from above, drifting butterflies',
      'fairy wading waist-deep in a field of wild poppies that comes up to her waist, hands brushing the bloom-tops, butterflies trailing past her in slow motion, soft golden-hour light',
      'fairy nestled inside a giant tulip-bell as if it were her bedroom, head resting against the curl of the petal, soft pearl-glow from her body lighting the inner-bell, fireflies in slow orbit outside',
      'fairy seated cross-legged on a giant lotus-pad floating on a moonlit pond, cupped palms holding glowing liquid-starlight, surrounding pond surface dotted with smaller lotus-pads and water-lilies',
      'fairy dancing barefoot through a meadow of buttercups and daisies, skirt and petals swirling outward, drifting golden pollen trailing behind her in slow-motion',
      'fairy kneeling beneath a wisteria-pergola in full lavender bloom, hanging racemes brushing her shoulders, one palm reaching upward to catch a falling cluster, soft violet-twilight glow',
      'fairy emerging from the heart of a giant blooming rose as if born from it, head tilted back with eyes closed, petals fragmenting at the edges of her form into drifting petal-snow',
      'fairy curled up sleeping on the cupped surface of a giant magnolia bloom, hair cascading over the petal-edge, soft pearl-glow halo, dewdrops on every nearby leaf',
      'fairy whispering to a small fae-creature (mouse / butterfly / hummingbird) perched on her finger, body tilted close, soft glow from her cheek lighting the creature',
      'fairy walking through a cherry-blossom grove at peak bloom, pink-and-white petals raining down around her in slow motion, body in soft 3/4 turn with one hand lifted to catch petals',
      'fairy kneeling at the edge of a hidden pond ringed with iris and water-lily, fingers trailing in the water, magical glowing rings spreading outward where she touches',
      'fairy seated on a moss-and-bloom stump in a clearing of wildflowers, weaving a flower-crown with her fingertips, drifting golden pollen halo, small butterflies in slow orbit',
      'fairy hovering just above the bloom-tops of a sunflower field at golden hour, wings fully spread, hands cupped releasing a golden pollen-cloud, body in candid mid-flight pose',
      'fairy peeking from behind a curtain of hanging foxglove-bells, only her face + one hand visible, candid playful moment, glowing fireflies drifting nearby',
      'fairy seated at the base of a giant blooming dahlia as if she were sheltering under it, head tilted up to gaze into the petals, magical glow from her halo lighting the underside of the bloom',
      'fairy mid-leap over a flower-stream of cascading blooms, body airborne with wings flared, drifting petals trailing behind her, soft warm side-light gilding the scene',
      'fairy curled up inside a giant lotus-bloom as if it were her bed, one hand draped over the petal-edge holding a glowing dewdrop, soft pearl-glow halo, fireflies hovering above',
      'fairy walking through a tunnel of climbing-roses on a stone trellis, blooms hanging in cascade above + beside her, dappled rose-petal-light on her face and shoulders, drifting petals',
      'fairy seated on a giant blooming chrysanthemum at twilight, soft violet-purple glow lighting her face from below, fireflies in dense orbit around her, drifting petals trailing into the air',
      'fairy crouched beside a magical bloom that has opened to release a stream of glowing pollen-stars rising into the air around her face, candid wonder, soft pearl-glow halo',
      'fairy dancing through a field of cosmos blooms at golden hour, body in mid-spin with skirt and petals swirling, drifting pink pollen trailing behind her in a slow ribbon',
      'fairy perched on a giant blooming snapdragon as if it were her swing, one hand lifted catching a drifting butterfly, soft warm side-light, fireflies in slow orbit',
      'fairy half-hidden inside the bell of a giant morning-glory at dawn, only her face + cupped palms visible, glowing dewdrop held in her hands, soft warm-pink light spilling from the bloom',
      'fairy walking knee-deep through a bluebell-forest understory with vertical sun-shafts piercing the canopy above, drifting bluebell-petals trailing behind her, magical silver-glow halo',
      'fairy kneeling among a thicket of wild orchids weaving a magical sigil in the air with her fingertip, soft purple-glow trail following her motion, fireflies in slow orbit nearby',
      'fairy seated on a moss-cushioned root inside a hidden garden-grove, surrounded by walls of blooming wildflowers, head bowed gazing down at a small magical seed in her cupped palms, soft golden-glow halo',
      'fairy mid-flight just above a pond of giant water-lilies with wings fully spread, body in candid hover-pose, glowing pollen-cloud trailing from her body, fireflies in slow orbit around her',
      'fairy emerging through a curtain of cascading wisteria in full bloom, one hand parting the racemes, body in soft 3/4 turn, drifting violet-petals trailing in the air around her',
      'fairy curled around the trunk of a flowering cherry tree at peak bloom, body wrapped between branches, head resting against the bark, pink-petals raining down in slow-motion around her',
    ],
    instructions: `Each entry is ONE FLOWER-FAIRY SCENE SETTING, 30-60 words. Format: "fairy [verb] [interacting with specific flower or environment], [atmospheric detail], [magical element]". Distribute across field-of-flowers / garden-architecture / living-in-flowers / bloom-interaction / magical-bloom-event scene types. Output as a NUMBERED list, one per line.`,
  },


  // ─── flower-fairy path: wings (the centerpiece — flower-fairy wings) ───
  faebot_flower_fairy_wings: {
    format: 'simple',
    theme: `FLOWER-FAIRY WINGS for the FaeBot flower-fairy path. Each entry is ONE specific FANTASTICAL FAIRY-WING design where the wings are MADE OF FLOWERS, CARRYING FLOWERS, or TRANSFORMING into / from flowers. Each entry 30-60 words.

⚠️ ABSOLUTE WING CENTERPIECE MANDATE — wings are NOT a side accent. The wings are a DRAMATIC FOCAL ELEMENT spread wide behind her, visible at FULL SCALE. Every entry has wings that ARE flowers, CARRY flowers, or TRANSFORM between flowers and wings.

⚠️ FANTASTICAL TRANSFORMATION MANDATE — fairy wings made of MAGICAL FLORAL FORMS:
  • Petal-wings (wings entirely constructed from overlapping flower petals)
  • Flower-grown wings (translucent wings with flowering vines growing along/through them)
  • Bloom-cluster wings (wings formed of densely-clustered blooms in wing-shape silhouette)
  • Transformation wings (petals fluttering off wing-edges as if mid-bloom, wings dissolving into flower-clouds, wings emerging from flower-clusters)
  • Iridescent + floral hybrid (gossamer fairy wings with flowers visible woven through transparent membrane)

✓ WING SHAPES (vary):
  Butterfly | Dragonfly (quadruple-pair) | Damselfly | Moth | Hummingbird | Petal-shaped | Leaf-shaped | Wing-budded-from-back | Spectral / luminous

✓ COLOR THEMES (match across wings to fit the bloom-spirit/dress):
  SUNSET orange-pink | TWILIGHT purples-blues | BLUSH pink-cream | RAINBOW spectrum | MONOCHROME white | MAGENTA-BOLD | EMERALD-FOREST | IRIDESCENT pearl

🚫 BANNED:
  • Plain wings (no flower integration) — wings MUST integrate with flowers
  • Tiny wings — wings are DRAMATIC and FULL-SCALE
  • Mundane butterfly wings without floral element

Channel: Pre-Raphaelite fairy paintings + Brian Froud fae illustrations + Nene Thomas fairy art + Pinterest "fairy wings made of flowers" + Disney Tinker Bell × fantasy oil painting.`,
    touchpoints: [
      'BUTTERFLY WINGS MADE OF ROSE PETALS — translucent butterfly-shaped wings constructed entirely from overlapping pink and cream rose petals, each petal individually painted, wings spread wide showing every petal-vein, soft sunset-pink glow through the membrane',
      'WISTERIA-WING DRAGONFLY — quadruple-pair dragonfly wings veined with hanging wisteria racemes, lavender flowers cascading along each wing-edge, iridescent purple membrane visible between the floral wing-bones',
      'CHERRY-BLOSSOM PETAL FLUTTER — fairy wings made of cherry blossom petals mid-flutter, petals visibly dissolving off the wing-edges into a cloud of falling pink petals, transformation in mid-motion',
      'GOSSAMER WINGS WITH BLUEBELL VINES — translucent gossamer fairy wings with bluebell vines growing visibly along the wing-membrane, deep-blue bluebells trailing from wing-tips',
      'BLOOM-CLUSTER PETAL WINGS — wings entirely formed from densely-clustered peony and dahlia blooms in coral and pink, wings spread in a butterfly-silhouette but made of solid flower-clusters',
      'IRIDESCENT FAIRY-PETAL HYBRID — gossamer iridescent fairy wings with hundreds of tiny daisies and forget-me-nots woven through the transparent membrane, light catching every petal',
      'MAGNOLIA-PETAL SWAN WINGS — large swan-shaped wings made of overlapping white-and-cream magnolia petals, dramatically wide and full-scale, painted with Pre-Raphaelite tenderness',
      'JASMINE-VINE WING-BUDS — wing-budded-from-back fairy wings formed of jasmine vines growing in wing-spread shape, hundreds of tiny white-jasmine-stars cascading down wing-arc',
      'FORGET-ME-NOT BUTTERFLY — butterfly wings constructed of clustered blue forget-me-nots in butterfly-silhouette, sky-blue-on-white pattern across the wing-spread',
      'TROPICAL BLOOM HYBRID — wings made of tropical hibiscus + plumeria + bird-of-paradise petals woven into wing-membrane, vibrant fuchsia + orange + yellow tropical wing-spread',
      'LAVENDER MOTH-WING — moth-shaped wings made of clustered lavender florets, soft purple wing-pattern with darker velvet centers, dramatic moth-silhouette spread wide',
      'POPPY-PETAL BUTTERFLY — butterfly wings made of red and orange poppy petals overlapping in scale-like pattern, dramatic fire-colored wing-spread',
      'HYDRANGEA-CLUSTER WINGS — wings formed of clustered blue and pink hydrangea blooms in butterfly-silhouette, pastel cloud-like wing-spread',
      'IRIS-FALL WING — fairy wings dissolving into falling iris petals at the wing-edges, gossamer membrane with iris-purple gradient, transformation in mid-motion',
      'GARDENIA-PETAL SCALES — wings made of overlapping white gardenia petals arranged scale-like, butterfly-silhouette, pearl-glow through each petal',
      'BOUGAINVILLEA-BRACT WINGS — bright magenta bougainvillea bracts forming dragonfly-pair wings, tropical paper-thin bract texture, sun-warm color',
      'PEONY-WING DRAMATIC — wings entirely made of overlapping peony petals in cream-pink, dramatically wide butterfly-silhouette, painted with rich oil-on-canvas depth',
      'WILDFLOWER-MEADOW WINGS — wings formed of clustered wildflowers (daisies, cosmos, cornflowers, poppies) in butterfly-shape, rainbow wildflower-spectrum wing-spread',
      'CAMELLIA-PETAL ROUND-WING — moth-shaped round wings made of overlapping white-and-pink camellia petals, soft luminous glow through the wing-membrane',
      'CALLA-LILY WING — sculptural callusing wings formed by curling calla-lily-petal shapes in white-and-cream, elegant minimalist wing-silhouette',
      'PETAL-STORM TRANSFORMATION — wings caught mid-transformation, hundreds of mixed petals visibly fluttering off wing-edges in a swirling cloud, wing-shape only suggested by petal-motion',
      'ROSE-VINE WING-FRAME — translucent fairy wings with a frame of climbing rose vines + hundreds of small roses growing along the wing-arc, gossamer membrane between',
      'COSMOS-AND-DAISY WING — butterfly wings made of cosmos and daisy blooms in pink-and-white, scale-like pattern, gentle floral wing-spread',
      'DAHLIA-CLUSTER WING — wings formed of densely-clustered dahlias in coral and burgundy, butterfly-silhouette, dramatic full-scale spread',
      'RANUNCULUS-WING SOFT — wings made of overlapping ranunculus blooms in soft pinks and corals, ruffled-petal texture creating a soft-edge wing-spread',
      'AUTUMN-BLOOM WING — wings made of chrysanthemums and rust-dahlias in autumn colors, butterfly-silhouette with russet and amber tones',
      'SNOWDROP + LILY-OF-VALLEY — delicate fairy wings made of snowdrop and lily-of-the-valley clusters, white-and-cream butterfly-shape, ethereal soft wing-spread',
      'POPPY-ANEMONE WING — wings made of red poppies + black-centered anemones, dramatic red-and-black wing-pattern',
      'AMARANTH-CASCADE WING — wings formed of cascading amaranth flowers in wine and crimson, drooping-vine wing-shape with hanging floral tails',
      'IRIDESCENT MOTH + PEARL WING — moth-shaped wings with iridescent membrane and pearl-white blooms scattered across them, soft luminous magical glow',
      'BLUEBELL-CASCADE WINGS — fairy wings made of cascading bluebells in deep blue, the bluebells hanging down from wing-arc like floral wing-tails',
      'YELLOW DAFFODIL WING — wings made of clustered daffodils in butter-yellow, large trumpet-shapes forming the wing-spread, sun-bright wing-color',
      'PURPLE FOXGLOVE-TOWER WING — wings forming a tall spike-tower from foxglove bells, dramatic vertical wing-spread, purple-and-cream gradient',
      'AMETHYST-WIST-WING — wings formed of dangling amethyst-violet wisteria-and-iris cascading from a wing-arc, dramatic floral curtain',
      'TROPICAL ORCHID WING — wings made of tropical orchids of mixed colors, exotic intricate orchid-blossom wing-spread, fantasy-spectrum colors',
      'PRIMROSE-AND-PANSY WING — wings made of primrose and pansy blooms in soft pastels, cottage-flower butterfly-silhouette',
      'SUNFLOWER WING DRAMATIC — wings made of clustered sunflowers (small to medium), large golden wing-spread, sun-bright fairy energy',
      'LISIANTHUS-WING SOFT — wings formed of soft-petal lisianthus in cream-and-pink, butterfly-silhouette with ruffled-edge wing-spread',
      'HELLEBORE WING — wings made of overlapping hellebore blooms in soft greens and creams, woodland-fairy wing-spread',
      'CHRYSANTHEMUM POMPOM WING — wings formed of pompom chrysanthemums in mixed autumn colors, dense round-bloom wing-spread',
      'PASSION-FLOWER WING — wings made of exotic passion flowers with intricate centers, dramatic detailed-bloom wing-spread, fantasy purple-and-white',
      'BIRD-OF-PARADISE TROPICAL — wings made of bird-of-paradise + heliconia + ginger blooms, tropical orange-and-yellow dramatic wing-spread',
      'ALLIUM-POMPOM WING — wings formed of clustered allium spheres in pale lavender, geometric round-bloom wing-spread',
      'SWEET-PEA RUFFLE WING — wings made of clustered sweet-pea blooms in mixed pastels, ruffled-petal wing-spread, cottage-garden fairy wing',
      'PEONY-AMARYLLIS WING — wings formed of peony + amaryllis in cream-and-coral, dramatic large-bloom wing-spread, oil-painted texture',
      'FROZEN-BLOOM CRYSTAL WING — wings made of crystallized frozen flowers, iridescent ice-and-bloom hybrid, magical winter-fairy wing-spread',
      'EMERALD GREEN-BLOOM WING — wings made of green hellebore and emerald succulents, fresh forest-fairy wing-spread, fantasy-green spectrum',
      'WHITE-LILY-CASCADE WING — wings cascading with white calla lilies trailing down from wing-arc, elegant tall lily wing-spread',
      'PEACH RANUNCULUS-CLUSTER WING — wings made of clustered peach ranunculus, soft warm wing-spread with ruffled-petal edges',
      'MIXED MEADOW-FLORAL WING — wings made of mixed cottage-garden florals (delphinium + foxglove + roses + delphinium + daisies), rich English-garden wing-spread',
    ],
    instructions: `Each entry is ONE specific FANTASTICAL FAIRY-WING design where wings ARE / CARRY / TRANSFORM-INTO flowers, 30-60 words. Format: "WING NAME CAPS — wing shape + flower species/color theme + wing-arc + transformation detail". Wings are FULL-SCALE DRAMATIC centerpiece. Vary wing shapes + color themes + transformation moments. Output as a NUMBERED list, one per line.`,
  },

  // ─── landscape path: landform (the dominant terrain canvas) ───
  bloombot_landscape_landform: {
    format: 'simple',
    theme: `EPIC FLORAL LANDSCAPE LANDFORMS for the BloomBot landscape path. Each entry is ONE specific dramatic terrain on which a vast bloom-carpet is the hero. Each entry 30-60 words.

⚠️ MANDATORY — every entry must convey EPIC SCENERY where the LANDFORM is recognizable, dramatic, and deep — the bloom-blanket carpets it from foreground to horizon. The terrain is the CANVAS, blooms are the CARPET. Multi-tier depth implied (foreground tier + midground tier + receding horizon).

🚫 STRICT BANS — these belong to other paths:
  • NO interiors / rooms / sunrooms / breakfast nooks → cozy
  • NO archways / passages / pergolas / tunnels → garden-walk
  • NO surreal / floating / gravity-defying / Magritte / impossible → dreamscape
  • NO glass-and-iron conservatories / Victorian greenhouses → conservatory
  • NO city streets / urban / Mediterranean alleys / Parisian / Lisbon → city-flowers
  • NO ruins / abandoned structures / temples-overgrown / cathedrals → reclaim
  • NO macro / closeup / "into the bloom wall" framing → closeup
  • NO tropical jungle understory (banyan / banana / heliconia) → tropical-paradise

🚫 ALSO BANNED:
  • NO people / humans / figures / silhouettes / shadows of people
  • NO generic "wildflower meadow" or "field of flowers" — name the LANDFORM specifically (mountain valley / cliff coast / glacial cirque / lake basin / etc.)
  • NO "pink rolling hills" / "blush meadow" / "cottagecore" / "english garden"
  • NO "soft pastels" / "feminine" / "dreamy" as primary aesthetic descriptors

✓ MANDATORY VARIETY — distribute across these LANDFORM CATEGORIES (~3-4 per category in a 30-entry pool):
  A. **ALPINE / MOUNTAIN** — meadow valleys below jagged peaks, ridge-line traverses, hanging valleys above tree-line, glacial cirques, snow-rimmed bowls
  B. **COASTAL / SEA-CLIFF** — bloom-blanketed sea cliffs above crashing surf, beach dunes carpeted in coastal blooms, tide-pool flats, sea stacks rising from bloom-meadow
  C. **DESERT / CANYON** — bloom-saturated desert canyon floors, slot-canyons with hanging-wall blooms, mesa-tops in superbloom, badlands washes
  D. **HILL / DOWNLAND** — rolling chalk downs in spring superbloom, terraced hillsides, patchwork field-quilt receding to blue distance, lavender-purple downlands (not lavender-as-species, terrain mood)
  E. **VOLCANIC / GEOTHERMAL** — caldera-floor superblooms, lava-field cracks reclaimed by pioneers, steam-vent meadows, ash-soil bloom-fields ringed by black rock
  F. **WETLAND / RIVER / LAKE** — lake-shore bloom-belts, water-meadow flooded floodplains, oxbow-river bends with bloom-laden banks, alpine tarn reflecting blooms
  G. **GLACIAL / ARCTIC** — fellfield blooms on tundra slopes, retreating-glacier moraine in pioneer bloom, midnight-sun fields, edge-of-ice meadow
  H. **FOREST-EDGE / CLEARING** — large bloom-meadow ringed by ancient forest, glade openings in old-growth, deciduous-forest spring carpet, savanna-grassland mosaic
  I. **ISLAND / ARCHIPELAGO** — Mediterranean island terrace blooms, basalt-headland bloom-shoulders, Faroe-style cliff turf, atoll-edge bloom-belts (NOT tropical jungle understory)
  J. **STEPPE / HIGH-PLATEAU** — Tibetan high-plateau bloom-belt, Andean altiplano, Mongolian steppe spring, Patagonian estancia in flower

Lineage to channel: National Geographic landscape photography + Planet Earth establishing shots + Roger Deakins location work + Annie Leibovitz outdoor portraiture (just the BACKDROPS) + Ansel Adams scale. Saturated jewel-tone cinematic register.`,
    touchpoints: [
      'ALPINE MEADOW VALLEY BELOW JAGGED SNOW PEAKS — wide U-shaped glacial valley floor blanketed in spring bloom, jagged granite snow-peaks rising abruptly behind, foreground tier of carpet-blooms / midground tier of clustered bloom-massing / horizon receding to blue snow-line',
      'COASTAL CLIFF ABOVE CRASHING OCEAN — wave-battered headland edge with bloom-turf sweeping to a sheer drop, white surf detonating against black-rock base far below, salt-spray haze softening the deep distance, multi-tier bloom-carpet across the rounded cliff-top',
      'DESERT CANYON SUPERBLOOM — wide red-rock canyon floor in once-a-decade superbloom, vertical sandstone walls glowing burnt-orange in the upper frame, river meandering through the bloom-saturated floor, distant mesas blue with atmospheric haze',
      'ROLLING HILLS RECEDING TO BLUE DISTANCE — patchwork quilt of bloom-fields tumbling across rounded downs in tier after tier, hedgerows zigzagging between, distant blue ridges fading into atmospheric perspective, lone tree-clump silhouetted on a far ridge',
      'GLACIAL CIRQUE BOWL — semi-circular alpine amphitheatre rimmed by sheer rock walls, snow-meltwater stream wandering through the bloom-carpeted floor, cirque tarn reflecting the rock-walls, scree-slopes rising to the rim',
      'VOLCANIC CALDERA SUPERBLOOM — vast circular caldera floor carpeted in pioneer blooms after spring rain, black-rock crater rim ringing the horizon, steam-vents puffing in midground, ash-cone visible at one edge',
      'LAKE-SHORE BLOOM-BELT — long crescent of bloom-blanketed lake-shore curving into the deep distance, glassy mountain lake reflecting peaks and blooms equally, scattered conifer-clusters punctuating the bloom-carpet, mountain backdrop',
      'ROLLING CHALK DOWNS IN SPRING SUPERBLOOM — undulating chalk downland bloom-carpet, ancient hill-fort earthwork visible on a distant rise, dewpond catching sky, sheep-track threading the bloom, English atmospheric haze at the horizon',
      'BASALT HEADLAND BLOOM-SHOULDER — Faroe-style stepped basalt cliffs draped in turf-bloom, North Atlantic surf battering the rock-base, sea-stacks rising from a heaving steel sea, low cloud catching on the cliff-top',
      'TIBETAN HIGH-PLATEAU BLOOM-BELT — vast high-altitude bloom-plain stretching to horizon, snow-capped 7000m peaks rising in deep distance, prayer-flag string fluttering in midground for scale, yak-herd tiny on the bloom-meadow',
      'TUNDRA FELLFIELD IN MIDNIGHT-SUN BLOOM — low-Arctic tundra slope in midnight-sun summer bloom, cushion-plants and dwarf-bloom turf, distant glacier-tongue descending from white peaks, sun grazing the horizon, long warm shadows',
      'BADLANDS WASH SUPERBLOOM — striped-strata badland gulches with bloom-carpet between, dry stream-bed snaking through the foreground, eroded buttes rising in pink-and-amber midground, sky filling upper third with weather',
      'OXBOW RIVER BEND BLOOM-BANKS — meandering oxbow lake with reflective water curving through bloom-laden banks, tall reed-clusters along the water-line, distant hills, golden sandbar accenting the bend, atmospheric haze',
      'MOUNTAIN PASS HANGING VALLEY — high pass between two peaks with a hanging valley below, bloom-carpet covering the valley floor, scree-cones descending from the walls, glacier-toe visible in deep upper background',
      'ANCIENT FOREST CLEARING — large bloom-meadow ringed by old-growth fir-and-cedar, sunbeams filtering through forest edge, mossy boulders studding the clearing, stag tiny in the deep background for scale',
      'PATAGONIAN ESTANCIA WIDE PLAIN — vast Andean foreland plain in spring bloom, gauchos-and-horses tiny silhouettes in deep midground for scale, granite spires of distant Andes piercing storm-cloud, wind-bent grass',
      'MEDITERRANEAN TERRACED HILL-BLOOM — ancient stone-terraced hillside cascading in bloom from ridge to coast, distant azure sea filling the lower frame, cypress-clusters punctuating the terraces, low golden Mediterranean light',
      'TIDAL WATER-MEADOW FLOODPLAIN — broad flooded river floodplain with islands of bloom-tussocks rising from shallow water, distant cathedral-tower or hill in deep horizon, low water-mirror reflecting the bloom and sky equally',
      'ANDEAN ALTIPLANO BLOOM-PLAIN — vast high-altitude altiplano in seasonal bloom, distant snow-capped volcanoes rising from the plain, llama-herd tiny in midground for scale, salt-pan glinting on one horizon',
      'SAVANNA-GRASSLAND BLOOM-MOSAIC — broad grassland in seasonal bloom dotted with flat-crowned acacias, distant escarpment receding to blue haze, scattered termite-mounds catching late light, sky filling upper half',
    ],
    instructions: `Each entry is ONE specific dramatic LANDFORM CANVAS for a bloom-blanket scene, 30-60 words. Format: "LANDFORM NAME CAPS — primary terrain features + multi-tier bloom description + horizon/depth note". Vary across the 10 landform categories above. NEVER use generic "wildflower meadow" — name the LANDFORM specifically. NO people, NO interiors, NO archways, NO ruins, NO urban, NO macro framing. NO pink/cottagecore/feminine palette references. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── landscape path: scale_prover (gives the landscape scale) ───
  bloombot_landscape_scale_prover: {
    format: 'simple',
    theme: `SCALE-PROVERS for the BloomBot landscape path. Each entry is ONE specific tiny element (or natural feature) that PROVES the epic scale of the landform. Each entry 20-40 words.

⚠️ MANDATORY — every entry must make the landscape feel BIGGER through scale-contrast. The element is small / distant / dwarfed by the landform. NEVER the primary subject — always peripheral.

🚫 STRICT BANS:
  • NO humans / people / figures / silhouettes / shadows of people
  • NO buildings / houses / cottages / castles as the scale-prover (architecture would compete with the landscape)
  • NO interiors / passages / urban / ruins
  • NO floating / surreal / impossible elements (dreamscape's territory)
  • NO "tiny figure" anywhere — even hooded silhouettes

✓ ALLOWED SCALE-PROVER CATEGORIES:
  A. **WILDLIFE — TINY** — single hummingbird / bee / butterfly / dragonfly in the foreground bloom
  B. **WILDLIFE — DISTANT HERD** — deer / elk / caribou / horse / sheep / yak / llama herd dotted across the midground for scale
  C. **WILDLIFE — RAPTOR / BIRD ABOVE** — eagle / hawk / kite / heron / crane / stork / albatross gliding in the upper sky
  D. **TREE / ANCIENT GROVE** — single ancient tree / lone copse / windswept oak / bristlecone pine standing alone on the bloom-carpet for scale-anchor
  E. **WATER FEATURE** — distant waterfall ribbon / glacial meltwater stream / mountain tarn catching the sky / sand-bar of a river bend
  F. **GEOLOGY — DISTANT** — distant sea-stack / mesa / butte / glacier-toe / arête ridge / rock pinnacle on the horizon
  G. **WEATHER FEATURE — DISTANT** — distant lightning fork / rain-curtain / waterspout / dust-devil / rainbow / mountain-wave cloud
  H. **PATH / TRACK** — bloom-track winding through the landform (a worn ribbon of crushed-bloom path, no humans on it)
  I. **STONE WITNESS** — single standing stone / glacial erratic / cairn / boulder-pile resting on the bloom-carpet
  J. **MIGRATION-MOMENT** — pollinator-cloud / butterfly migration column / bee-swarm / monarch wave / starling murmuration in midground

Each entry should be a small, specific, naturally-occurring element that creates an "oh — that's how big this is" moment. Channel: Planet Earth establishing shots, BBC natural-history slow zoom-outs, Roger Deakins location wides.`,
    touchpoints: [
      'TINY HUMMINGBIRD HOVERING — solitary jewel-iridescent hummingbird hovering at a foreground bloom-cluster, wings a transparent blur, scale-prover for the vast bloom-carpet behind it',
      'DEER HERD TINY IN MIDGROUND — small herd of mule-deer or red-deer dotted across the bloom-meadow at middle-distance, each barely larger than a brushstroke, scale-prover for the landform behind them',
      'EAGLE GLIDING UPPER SKY — golden eagle gliding on a thermal in the upper-third of the frame, wings outstretched, tiny against the snow-peaks behind, scale-prover for the alpine drama',
      'LONE ANCIENT WINDSWEPT OAK — single ancient gnarled oak standing alone on a bloom-knoll, hundreds of years old, anchor of scale for the rolling hill-country receding behind it',
      'DISTANT WATERFALL RIBBON — single thin waterfall ribbon descending a sheer cliff in deep background, a white thread on the dark rock-wall, scale-prover for the cliff and the bloom-carpet at its base',
      'GLACIAL MELTWATER STREAM WANDERING — silver thread of meltwater stream winding through the bloom-meadow from a high snow-saddle, catches the light, gives the eye a depth-line into the scene',
      'DISTANT SEA-STACK — solitary basalt sea-stack rising vertically from the offshore swell, white surf detonating at its base, scale-prover for the coastal cliff and the bloom-shoulder',
      'DISTANT LIGHTNING FORK — single dramatic lightning fork striking a distant ridge under a storm-cell, briefly silhouetting the bloom-meadow against the flash, atmospheric weather drama',
      'BLOOM-CARPET PATH WINDING — worn ribbon of crushed-bloom path threading the meadow into the deep distance, lead-line for the eye, scale-prover for the carpet through which it cuts',
      'SINGLE GLACIAL ERRATIC BOULDER — house-sized erratic boulder resting on the bloom-carpet alone, ice-age witness, scale-prover for the bloom-field surrounding it',
      'BUTTERFLY MIGRATION COLUMN — vertical column of migrating butterflies (monarch or painted-lady) rising from the meadow in a swirling helix, hundreds visible, scale-spectacle plus scale-prover',
      'GRAZING CARIBOU HERD — small dispersed caribou herd grazing across the tundra fellfield in deep midground, antlers catching the low sun, scale-prover for the Arctic bloom-belt',
      'DOUBLE RAINBOW ARCH — full double-rainbow arching across the deep midground from one cloud-bank to another, ground-end touching the distant bloom-ridge, scale-prover for the storm-drama',
      'LONE CAIRN ON BLOOM-RIDGE — single weathered stone cairn standing on a high bloom-ridge, anchor of human-scale-ABSENCE against the vastness, scale-prover for the ridge-line',
      'STARLING MURMURATION TWISTING — vast cloud-formation of starlings twisting in the upper sky over the bloom-plain, organic shape morphing, scale-prover for the open sky-volume above',
      'DRAGONFLY IN FOREGROUND — single iridescent dragonfly hovering at a foreground bloom-stem, wings transparent and frozen, body anchoring the macro-end of the scale spectrum',
      'DISTANT GLACIER-TOE — terminal moraine of a distant alpine glacier descending from snow-peaks, ice-cliff-edge tiny in the deep background, scale-prover for the entire valley',
      'HORSE HERD GALLOPING DISTANT — small wild-horse herd galloping across the steppe-bloom in midground, dust-trail behind them catching the light, scale-prover for the Mongolian plain',
      'TINY BEE ON FOREGROUND BLOOM — single bumblebee or honeybee landing on a specific named foreground bloom, fur-on-thorax visible, scale-prover for the bloom-carpet behind it',
      'WIND-RIPPLE THROUGH BLOOM-FIELD — visible wind-wave rippling across the surface of a vast bloom-field like wind on water, the eye reads the scale through the wave',
    ],
    instructions: `Each entry is ONE specific tiny / distant element that gives scale to the landform, 20-40 words. Format: "SCALE-PROVER NAME CAPS — primary element + secondary detail + how it conveys scale". Vary across the 10 categories above. The element is ALWAYS peripheral — never primary. NO humans, NO buildings, NO interiors. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── landscape path: surprise_element (small unexpected secondary subject) ───
  bloombot_landscape_surprise_element: {
    format: 'simple',
    theme: `SURPRISE ELEMENTS for the BloomBot landscape path. Each entry is ONE small, unexpected secondary detail that rewards a second look at the bloom-landscape. Each entry 20-45 words.

⚠️ MANDATORY — every entry must be SECONDARY and SMALL — never compete with the bloom-carpet or the landform. Each is a "did you spot this?" moment that elevates the scene from "pretty landscape" to "memorable poster".

🚫 STRICT BANS:
  • NO humans / figures / silhouettes
  • NO buildings / castles / ruins / cottages / urban architecture
  • NO surreal / floating / impossible (dreamscape's job)
  • NO competing with the landform — must be small
  • NO duplication of scale-prover content (deer / waterfall / etc. — those go in scale_prover pool)

✓ SURPRISE-ELEMENT CATEGORIES:
  A. **POLLINATOR DETAIL** — single bee in mid-air pollen-cloud / butterfly opening wings on a specific bloom / hummingbird tongue extended / dragonfly back-lit
  B. **LIGHT MAGIC** — sun-flare through one specific bloom petal / dewdrop refracting a tiny rainbow / a single sun-ray catching one cluster
  C. **WATER DETAIL** — single dew-drop hanging from a bloom-stem / mist-droplet catching light / petal floating on a still pond / spider-web with water-beads
  D. **NEST / EGG** — tiny hidden bird-nest in foreground brush / cluster of speckled eggs visible / mouse-nest tucked under bloom-cluster
  E. **WIND-MOMENT** — single petal mid-fall / pollen-cloud dispersing in wind / spider-silk strand crossing the frame catching light
  F. **DIMENSIONAL HINT** — single mossy boulder / fallen branch / clump of crystal-bearing rock / a piece of antler / a worn deer-skull (memento mori, naturally occurring)
  G. **MICRO-WILDLIFE** — chameleon on a stem / gecko on a rock / vole peeking from foliage / chipmunk frozen on a stem / tree-frog on a leaf
  H. **PEACEFUL CREATURE-MOMENT** — fox sleeping in a sunny patch / hare frozen in alert / rabbit nibbling / songbird perched mid-song / hedgehog asleep
  I. **NATURAL DEBRIS** — single bleached antler / cluster of seed-pods bursting / sun-bleached driftwood / coral-of-color autumn leaf in the spring scene
  J. **OPTICAL MAGIC** — a perfectly heart-shaped dewdrop / a bloom whose color exactly matches the sunset / a bloom-cluster reflecting in the eye of a deer (subtle)

Channel: Spielberg's "small magic moment in the wide shot" framing + Studio Ghibli's "look closer" details + macro-photography sensibility scaled down into a wide landscape.`,
    touchpoints: [
      'SINGLE BUTTERFLY OPENING WINGS — solitary butterfly mid-emerge on a foreground bloom, wings half-open showing the iridescent inner surface, dust of pollen drifting from the cluster, magic-moment detail',
      'DEW-DROP RAINBOW REFRACTION — single tear-shaped dew-drop hanging from a bloom-petal in foreground, refracting a tiny full spectrum within itself, sunlight passing through, jewel-detail',
      'FOX SLEEPING IN SUNLIT PATCH — solitary red fox curled asleep in a small sun-warmed patch among the blooms in midground, ears relaxed, almost invisible until the eye finds it',
      'HIDDEN BIRD-NEST WITH EGGS — small cup-nest tucked low in the foreground brush, three speckled blue eggs visible inside, scale-perfect grass woven around it, subtle reward',
      'POLLEN-CLOUD DISPERSING IN WIND — visible cloud of golden pollen-dust drifting horizontally from a bloom-cluster, caught mid-air in the side-light, transient atmospheric magic',
      'BLEACHED ANTLER ON BLOOM-CARPET — single sun-bleached deer-antler resting on the bloom-meadow in midground, contour catching light, memento-mori beauty natural to the meadow',
      'SPIDER-WEB WITH WATER-BEADS — perfect orb-web stretched between two foreground bloom-stems, hundreds of water-beads on the silk catching the light like beaded pearls',
      'HARE FROZEN ALERT — solitary hare standing frozen-alert in midground bloom-cover, ears upright, body sideways, blending almost invisibly into the meadow until the eye spots it',
      'SINGLE PETAL MID-FALL — solitary detached petal caught mid-air in side-light, suspended in the moment before it touches the bloom-carpet below, motion-frozen',
      'SONGBIRD PERCHED MID-SONG — solitary songbird (warbler / lark / robin) perched on a tall bloom-stalk in midground, beak open mid-song, head tilted skyward',
      'CHIPMUNK FROZEN ON STEM — solitary chipmunk frozen mid-climb on a tall bloom-stalk in foreground, tail balanced behind, cheeks full, alert ears',
      'SUN-FLARE THROUGH ONE PETAL — sun-ray hitting one specific bloom-petal in foreground at a glancing angle, the petal glowing translucent like stained glass, halo on the back',
      'MOSSY FOREGROUND BOULDER — single moss-and-lichen-covered boulder in foreground, scale-anchor for the bloom-carpet, weathered surface catching low light, textural reward',
      'TINY TREE-FROG ON A LEAF — solitary jewel-green tree-frog on the underside of a large leaf in foreground, eyes catching the light, tiny but vivid color-pop',
      'BIRDS-NEST OF GRASS WITH DOWN — single nest of woven grass and downy feathers visible low in foreground bloom-cover, abandoned or freshly-built, intimate detail',
      'GECKO ON A SUN-WARMED STONE — solitary gecko basking on a sun-warmed stone in midground, body camouflaged but visible to the eye that finds it, scale-perfect detail',
      'DRAGONFLY BACK-LIT TRANSLUCENT — solitary dragonfly perched on a foreground stem, body back-lit by the low sun making the abdomen and wings glow translucent amber',
      'BURSTING SEED-POD CLUSTER — cluster of bloom seed-pods caught mid-burst in the foreground, fluffy seeds drifting horizontally in side-light, the future-of-the-meadow detail',
      'HEDGEHOG ASLEEP IN HOLLOW — solitary hedgehog curled asleep in a hollow at the base of a bloom-stalk in foreground, spines catching light, tiny but unmistakable',
      'PERFECT HEART-SHAPED DEWDROP — single dew-drop hanging from a leaf-tip in foreground, naturally shaped exactly like a heart, sun catching it, jewel-perfect detail',
    ],
    instructions: `Each entry is ONE small, unexpected secondary detail in a landscape, 20-45 words. Format: "SURPRISE-ELEMENT NAME CAPS — primary detail + secondary feature + position in frame". Vary across the 10 categories above. ALWAYS secondary and small — never competes with landform or bloom-carpet. NO humans, NO buildings, NO surreal. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── landscape path: sky (atmospheric sky layer) ───
  bloombot_landscape_sky: {
    format: 'simple',
    theme: `SKY LAYERS for the BloomBot landscape path. Each entry is ONE specific dramatic sky / atmospheric upper-frame condition that crowns the bloom-landscape. Each entry 20-40 words.

⚠️ MANDATORY — every entry covers the UPPER THIRD of the frame and is CINEMATIC. The sky is the lid on the scene — it should never be a blank pale-blue default.

🚫 STRICT BANS:
  • NO flat featureless blue sky / no "clear sky" / no negative-space sky
  • NO surreal / floating / impossible sky (dreamscape's job)
  • NO city-light / urban-pollution sky (city-flowers' job)
  • NO interior ceilings / glass-domes (cozy / conservatory)

✓ MANDATORY SKY VARIETY — distribute across:
  A. **GOLDEN-HOUR DAWN** — first-light pink / amber / rose gradient with low warm rays
  B. **GOLDEN-HOUR DUSK** — sun-at-horizon orange / crimson / purple gradient with long warm rays
  C. **DRAMATIC STORM** — towering cumulus / anvil thunderhead / dark storm-shoulder / rain-curtain in deep distance
  D. **POST-STORM RAINBOW** — fresh clearing sky with a full or double rainbow arching across, last storm-cloud retreating
  E. **HIGH-NOON BLUE** — deep cerulean sky with sculpted cumulus, hard white sunlight, classic Ansel Adams blue
  F. **OVERCAST DRAMATIC** — silver overcast with break-of-light / hole-of-blue / volumetric god-rays piercing through
  G. **TWILIGHT GRADIENT** — post-sunset deep-blue-to-purple gradient with first stars / Venus / moon-rise
  H. **NIGHT WITH MOON** — moonlit landscape with full / crescent / blood / supermoon, soft silver wash on the bloom-carpet
  I. **AURORA** — green-and-violet aurora curtains rippling across an upper-latitude bloom-tundra
  J. **MIST / FOG / VOLUMETRIC** — low ground-fog hugging the bloom-carpet with clear sky above / mountain-mist hugging peaks / cloud-inversion above bloom-valley

Channel: Roger Deakins atmospheric work + Storm Thorgerson album-cover skies + Ansel Adams cloud studies + National Geographic golden-hour wides + Studio Ghibli sky-poetry.`,
    touchpoints: [
      'GOLDEN-HOUR DUSK AMBER GRADIENT — sky filling upper frame with horizon-to-zenith gradient from molten-amber at the bloom-line through coral-pink to deep-violet at zenith, sun a hand-width above the bloom-meadow casting long rake-light shadows',
      'TOWERING STORM-FRONT CUMULUS — vast sculpted cumulus-anvil rising into the upper sky over the bloom-plain, lit golden on the sun-facing side, dark grey on the shadow side, rain-curtain trailing from its base in deep distance',
      'DOUBLE-RAINBOW POST-STORM — fresh-cleared sky with a full double-rainbow arching across the upper third, primary bow vivid, secondary bow softer outside it, last storm-cloud retreating left, rain-glistened bloom-carpet below',
      'HIGH-NOON SCULPTED CUMULUS — deep cerulean sky filled with sculpted white cumulus-castles, hard mid-day sun creating crisp shadow-undersides on the clouds, classic-photo blue, every cumulus reading three-dimensional',
      'AURORA CURTAINS OVER TUNDRA-BLOOM — green-and-violet aurora curtains rippling across an upper-latitude night sky, magnetic-field bands stretching from horizon to horizon, soft glow on the snow-rimmed bloom-tundra below',
      'TWILIGHT BLUE WITH FIRST STARS — post-sunset upper-frame in deep-blue-to-purple gradient, Venus bright at the edge of the gradient, first stars just visible at zenith, bloom-meadow below in cooling shadow',
      'OVERCAST WITH GOD-RAY BREAK — silver overcast sheet covering most of the upper frame, single break of brilliant sun piercing through, volumetric god-rays beaming down onto a specific patch of bloom-meadow in midground',
      'BLOOD-MOON RISING — full crimson lunar disk rising above a distant ridge, twilit purple sky filling the upper frame, moonlight tinting the bloom-carpet rose-amber',
      'PURPLE THUNDERHEAD DOMINATING — vast deep-purple thunderhead occupying half the upper frame, lightning-flash internal pulse just visible, edge lit by sun escaping under, theatrical contrast',
      'AMBER DAWN MIST WITH PEAKS — golden-amber dawn sky filling the upper frame, first sun-rays just touching the highest snow-peaks, low mist coiling above the bloom-meadow at peak-elevation, alpenglow drama',
      'LENTICULAR CLOUD STACK — stack of UFO-shaped lenticular clouds glowing apricot at sunset, lined up above a distant mountain ridge, otherworldly atmospheric phenomenon',
      'MOON HALO COMPLETE RING — full lunar halo ring around the moon in a thin-cirrus night sky, soft silver light on the bloom-meadow below, atmospheric ice-crystal magic',
      'MAMMATUS-CLOUD DUSK CEILING — rare mammatus-cloud underside (bubbled grey-pink pendulous cloud-bottoms) filling the upper frame at dusk, eerie textural beauty, storm just-passed',
      'GROUND-FOG WITH SUNRISE TOPS — low ground-fog hugging the bloom-carpet to knee-height with clear amber-dawn sky above, distant ridges rising above the fog, bloom-tops poking through the mist',
      'PINK-CIRRUS HAIR — high pink-cirrus streaks combed across the dusk sky, no other clouds, gradient gold-to-magenta-to-violet from horizon to zenith, atmospheric perfection',
      'SUPERMOON OVER MOUNTAIN-PASS — oversized full moon rising in the saddle between two peaks, bloom-pass in the foreground softly lit, twilight blue around the moon',
      'ALPENGLOW ON HIGH PEAKS — last-light alpenglow making the highest snow-peaks blaze magenta-rose against a cooling deep-blue sky, valley below the bloom-meadow in twilight blue shadow',
      'COTTON-CANDY CIRROCUMULUS — high cirrocumulus mackerel-sky filling the upper frame at sunset, individual cells lit pink-and-gold, full horizon-spanning textural marvel',
      'CRIMSON-DUSK ON STORM-EDGE — sky split in half: storm-cell on left with rain-curtain and dark shoulder, clear crimson dusk on right, the boundary itself a sharp wall, dramatic',
      'MIDNIGHT-SUN ARCTIC HAZE — Arctic midnight-sun glow filling the upper frame in soft pink-and-amber, never setting below horizon, bloom-tundra in eternal golden hour',
    ],
    instructions: `Each entry is ONE specific cinematic sky / atmospheric upper-frame, 20-40 words. Format: "SKY MODE NAME CAPS — primary sky condition + color/light note + how it interacts with the bloom-landscape below". Vary across the 10 categories above. NEVER blank-blue or featureless. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── closeup path: bloom_wall_type (what the macro bloom-mass is) ───
  bloombot_closeup_bloom_wall_type: {
    format: 'simple',
    theme: `MACRO BLOOM-WALL TYPES for the BloomBot closeup path. Each entry is ONE specific kind of living bloom-mass that fills the macro frame in its natural outdoor growth pattern. Each entry 25-50 words.

⚠️ MANDATORY — every entry must imply LIVING FLOWERS GROWING IN PLACE (vine / bush / climbing / cascading / blanketing). NEVER cut flowers, NEVER a bouquet, NEVER a vase, NEVER a studio backdrop. The macro view sees petals on the front blooms and the rest of the wall receding into shallow-DOF blur.

🚫 STRICT BANS:
  • NO cut flowers / bouquets / arrangements / vases / baskets / bowls / shelves
  • NO studio backdrops / dark backgrounds / wooden surfaces / "against a wall"
  • NO still-life / florist / market / table-top / gift-shop scenes
  • NO interiors (cozy's territory)
  • NO architecture / archways / pergolas / passages (garden-walk / conservatory)
  • NO urban / city / Mediterranean alley (city-flowers)
  • NO ruins / abandoned structures (reclaim)
  • NO landform-as-canvas (landscape's territory) — this is MACRO, not vista
  • NO surreal / floating / impossible (dreamscape)
  • NO tropical jungle understory (tropical-paradise)

✓ BLOOM-WALL CATEGORIES — distribute across these:
  A. **CLIMBING-VINE WALL** — climbing-vine wall thick with hanging racemes (clematis / wisteria / morning-glory style)
  B. **HEDGEROW CURTAIN** — densely-flowered hedgerow curtain (hawthorn / rhododendron / rose-hedgerow style)
  C. **MEADOW AT PETAL-LEVEL** — wildflower meadow viewed from petal-level with tall species filling vertical
  D. **CASCADING-CLIFF WALL** — bloom-mass cascading off a stone or cliff face (alpine cliff / coastal cliff garden)
  E. **CLIMBING-WALL OF AN OLD BUILDING** — bloom-clad wall of an old stone building (cottage wall / chapel wall / etc.)
  F. **TANGLED-BRAMBLE THICKET** — bramble-thicket interior with overlapping climbing-blooms and thorned stems
  G. **POND'S-EDGE WATER-FLOWER MASS** — water-flower mass at a pond's edge with reflective water visible at frame edge
  H. **FOREST UNDERSTORY BLOOM-CARPET** — at-floor view of a forest-floor bloom-carpet under canopy (bluebells / lily-of-valley / etc. style)
  I. **PERGOLA-DRIPPING UNDERSIDE** — view UP at the underside of a wisteria or jasmine-laden pergola, blooms dripping inward
  J. **MOSSY-BOULDER CREVICE BLOOMS** — alpine-style flowers cascading from mossy boulder crevices, dense at front blooming out
  K. **DUNE-EDGE COASTAL CLUMP** — coastal bloom-clump at the edge of a dune, sea-grass visible behind in blur
  L. **GARDEN-BORDER MASS** — perennial garden-border bloom-mass at petal-level, structure plants behind in blur

Channel: macro botanical illustration + Roger Deakins natural-light close-work + Studio Ghibli petal-level magic + National Geographic macro features.`,
    touchpoints: [
      'CLIMBING-VINE WALL THICK WITH HANGING RACEMES — vertical climbing-vine wall in full bloom, long pendant racemes hanging at viewer eye-level, individual front-most flowers in jewel-saturated focus, the rest of the vine-curtain receding into shallow-DOF blur',
      'HEDGEROW CURTAIN IN FULL FLOWER — dense flowering hedgerow viewed from petal-level, structure shrubs woven through with bloom-bursts, thorned stems and glossy leaves overlapping, hedgerow continuing on either side into the blur',
      'WILDFLOWER MEADOW AT PETAL-LEVEL — wildflower meadow viewed from camera-at-bloom-height, tall species filling the upper frame, mid-height blooms massed across the lower frame, the rest of the meadow receding into golden shallow-DOF blur',
      'CASCADING-CLIFF BLOOM-WALL — bloom-mass cascading down a stone-and-moss cliff face, fern-fronds and lichen-patches between the bloom-clusters, sky-glow at the top edge, cliff continuing down into the blur',
      'BLOOM-CLAD COTTAGE WALL — bloom-clad weathered stone or whitewashed cottage wall viewed from petal-level, climbing roses or jasmine in mass, the wall texture barely visible behind the bloom-curtain',
      'TANGLED-BRAMBLE THICKET INTERIOR — viewer INSIDE a thicket of climbing-bloom brambles, thorned stems woven across the frame, overlapping clusters of blooms catching shafts of light through the tangle',
      "POND'S-EDGE WATER-FLOWER MASS — water-flowers and reed-blooms at a pond's edge viewed from low petal-level, glossy water visible at the bottom frame edge, dragonflies-or-fish hinted in the blur behind",
      'FOREST-FLOOR BLOOM-CARPET — at-floor camera view of a forest-floor bloom-carpet, fern-fronds and moss between bloom-clusters, dappled sunbeams hitting the carpet, trees barely visible in soft upper blur',
      'PERGOLA-DRIPPING UNDERSIDE — view UP at the underside of a bloom-laden pergola, blooms dripping inward in pendant clusters at viewer level, structure barely visible behind the bloom-curtain, sky glimpsed at top edge',
      'MOSSY-BOULDER CREVICE BLOOMS — bloom-clusters cascading from mossy crevices in a granite boulder face, alpine micro-environment, ferns and lichens woven between, boulder continuing out of frame on all sides',
      'COASTAL DUNE-EDGE BLOOM-CLUMP — coastal bloom-clump at the edge of a sand-dune, salt-tolerant species in dense cluster at viewer level, sea-grass and beach-grass in blur behind, distant sea-glow at frame edge',
      'PERENNIAL GARDEN-BORDER MASS — perennial garden-border at petal-level, mass of structure-plants behind, taller spike-blooms in upper frame, low ground-cover at the base, garden continuing into blur',
      'WISTERIA-CURTAIN HANGING — vertical wisteria-curtain or jasmine-curtain of hanging blooms viewed from inside the curtain, fragrant racemes at viewer level, garden glow behind the curtain in shallow blur',
      'MEADOW-EDGE BLOOM-SPILL — wild meadow-edge where bloom-mass spills out into open ground, structure grasses behind, mixed species in clumpy distribution, meadow receding into golden blur',
      'CLIMBING-ROSE WALL ARCH — climbing-rose wall covering an old garden arch, rose-clusters at viewer eye-level, thorned stems woven through, the arch barely visible behind the rose-curtain, garden behind in blur',
    ],
    instructions: `Each entry is ONE specific KIND of macro bloom-wall in its NATURAL GROWING CONTEXT, 25-50 words. Format: "BLOOM-WALL TYPE CAPS — primary structure + macro front-plane detail + shallow-DOF blur context". ALWAYS living and growing-in-place. NEVER cut / bouquet / vase / studio. Vary across the 12 categories above. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── closeup path: growing_context (where the bloom-wall lives) ───
  bloombot_closeup_growing_context: {
    format: 'simple',
    theme: `GROWING CONTEXTS for the BloomBot closeup path. Each entry is ONE specific natural-or-rustic environment in which a macro bloom-wall lives. Each entry 20-40 words.

⚠️ MANDATORY — every entry implies a wider OUTDOOR / NATURAL ENVIRONMENT that the bloom-wall is rooted in. The viewer reads this through the shallow-DOF blur behind the front-most blooms. The context grounds the macro in a living place — never a void, never a studio.

🚫 STRICT BANS:
  • NO studio / backdrop / void / "isolated"
  • NO interiors / rooms (cozy's job)
  • NO urban architecture (city-flowers)
  • NO ruins / cathedrals (reclaim)
  • NO surreal / impossible (dreamscape)
  • NO landform-as-hero vista (landscape)

✓ GROWING-CONTEXT CATEGORIES:
  A. **COTTAGE GARDEN** — rustic cottage garden borders, weathered fence-posts, gravel paths
  B. **WILD MEADOW** — wild meadow with distant tree-line, golden grass receding
  C. **WOODLAND EDGE** — woodland edge with old-growth canopy receding behind
  D. **COASTAL HEADLAND** — coastal headland with sea-glow and distant horizon at frame edge
  E. **ALPINE SLOPE** — alpine mountain slope with distant snow-peak in soft blur
  F. **OLD STONE WALL** — old stone garden wall or chapel wall with weathered texture behind the bloom-curtain
  G. **POND OR STREAM EDGE** — reflective pond or stream edge with water visible at frame edge
  H. **WALLED-GARDEN INTERIOR** — old walled-garden interior with stone or brick walls in soft blur
  I. **HEDGEROW PATH** — country hedgerow with a path threading the bloom-curtain
  J. **GREENHOUSE-FREE GLASS-FRAME EDGE** — old wooden cold-frame or greenhouse edge (peripheral structure, NOT the focus — bloom-wall fills frame)
  K. **HILLSIDE TERRACE** — terraced hillside step with old retaining stone, distant valley in soft blur
  L. **WOODLAND CLEARING** — sunlit clearing within old-growth forest, trees in soft blur all around

Channel: BBC natural-history macro work + Studio Ghibli "in the garden" magic + cottagecore-but-not-twee.`,
    touchpoints: [
      'COTTAGE GARDEN BORDER — rustic cottage garden border behind the bloom-wall, weathered fence-posts and gravel path glimpsed in shallow blur, hint of an old apple-tree or potting-shed at the far edge of focus',
      'WILD MEADOW STRETCHING BEHIND — golden wild meadow stretching behind the bloom-wall into shallow-DOF blur, distant tree-line at the horizon edge of focus, midday or golden-hour glow softening the depth',
      'WOODLAND EDGE WITH OLD-GROWTH CANOPY — woodland edge behind the bloom-wall, old-growth trees with dappled sunbeams falling through canopy in shallow blur, forest-floor moss and ferns hinted between trunks',
      'COASTAL HEADLAND WITH SEA-GLOW — coastal headland behind the bloom-wall, distant sea-glow visible at frame edge through the shallow-DOF blur, hint of cliff-face and sea-grass between the bloom-clusters',
      'ALPINE SLOPE WITH DISTANT PEAK — alpine mountain slope behind the bloom-wall, distant snow-rimmed peak in soft blur, scree-cones and cushion-plants barely visible between the bloom-clusters',
      'OLD STONE WALL OF AN ABBEY — weathered stone wall of an old abbey or chapel barely visible behind the bloom-curtain, mossy stone and ivy-thread hinted between bloom-clusters, no other structure',
      'POND EDGE WITH REFLECTIVE WATER — pond edge behind the bloom-wall, glossy water at the bottom of the frame catching sky-light, dragonflies hinted in the soft blur, reed-clusters at the water-line',
      'WALLED-GARDEN INTERIOR — old walled-garden interior behind the bloom-wall, weathered brick or stone wall in soft blur, perhaps a wrought-iron gate or sundial barely visible between the bloom-clusters',
      'HEDGEROW PATH WINDING — country hedgerow path winding behind the bloom-wall, packed earth and grass-strip path threading the bloom-curtain into the deep distance, distant hedgerow continuing into blur',
      'OLD POTTING-SHED CORNER — weathered wooden potting-shed corner behind the bloom-wall, cracked terracotta pots and a watering can hinted in soft blur, garden tools faintly visible',
      'TERRACED HILLSIDE STEP — terraced hillside step behind the bloom-wall, old retaining stone of the next-up terrace barely visible in soft blur, distant valley glow at frame edge',
      'WOODLAND CLEARING SUN-DAPPLED — sun-dappled woodland clearing behind the bloom-wall, old-growth trees in soft blur all around, sunbeams piercing canopy onto the clearing-floor',
      'COTTAGE-CHIMNEY-CORNER — old cottage-corner stone visible behind the bloom-wall, climbing rose attached, lichen-patched chimney in soft blur, peaceful domestic edge implied',
      'CHURCHYARD-WALL — old churchyard wall behind the bloom-wall, weathered headstones in soft blur, mossy stone and ivy threading between the bloom-clusters, peaceful sanctuary mood',
      'DRY-STONE WALL FIELD-EDGE — dry-stone wall field-edge behind the bloom-wall, irregular weathered stones in soft blur, distant field receding behind the wall into golden blur',
    ],
    instructions: `Each entry is ONE specific OUTDOOR / NATURAL growing context that grounds the macro bloom-wall, 20-40 words. Format: "GROWING-CONTEXT NAME CAPS — primary environment + secondary natural detail + how it reads through the shallow-DOF blur". Vary across the 12 categories above. NEVER void / studio / interior. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── closeup path: macro_phenomenon (60%-gated magic moment) ───
  bloombot_closeup_macro_phenomenon: {
    format: 'simple',
    theme: `60%-GATED MACRO PHENOMENA for the BloomBot closeup path. Each entry is ONE specific small magic-moment detail in the foreground that elevates the macro view. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon is SMALL, FOREGROUND, SPECIFIC. It's the second-look detail that makes the macro frame memorable. Sized for macro framing — single subject, jewel-detail.

🚫 STRICT BANS:
  • NO humans / hands / figures
  • NO architectural elements (bowls / vases / etc.)
  • NO surreal / impossible (dreamscape)
  • NO duplicate of growing_context content (no "distant horizon" — that's context)
  • NO wide-frame phenomena (rainbows / waterfalls / etc. — those belong in landscape path)

✓ MACRO-PHENOMENON CATEGORIES:
  A. **POLLINATOR** — hummingbird hovering / bee landing / butterfly mid-emerge / dragonfly perched / moth caught in light
  B. **WATER MAGIC** — single dew-drop hanging / dew-drop refracting rainbow / pollen-laden bead / mist-droplet on petal
  C. **LIGHT MAGIC** — sunbeam through one petal / halo on one cluster / back-lit translucent petal / golden-hour edge-glow on one bloom
  D. **MICRO-DETAIL** — pollen dust on petals / spider-web with beads / silk thread crossing frame / individual stamen / individual filament
  E. **PETAL-MOMENT** — single petal detached mid-fall / petal opening / bud half-bursting / wilted petal still attached for poignant contrast
  F. **TINY CREATURE** — ladybug on a stem / tiny tree-frog on a leaf / snail on a stem / chameleon clinging / gecko basking
  G. **WIND-MOMENT** — pollen-cloud dispersing from one bloom in side-light / petal-spiral mid-air / silk-strand catching light
  H. **POLLEN-COLOR** — visible pollen-mass on a stamen / pollen-dust on a bee's back / pollen-coated petal
  I. **NEST / EGG** — tiny hidden bird-nest at base of stem with speckled eggs / cocoon attached to a stem / abandoned chrysalis
  J. **OPTICAL** — dew-drop refracting full spectrum / one bloom mirror-perfect reflected in a dew-bead / heart-shaped dewdrop

Channel: macro-photography sensibility + David Attenborough close-up reverence + Studio Ghibli "look closer" detail magic.`,
    touchpoints: [
      'TINY HUMMINGBIRD HOVERING — solitary jewel-iridescent hummingbird hovering at one specific foreground bloom, wings a transparent blur, beak just touching the bloom, scale-perfect for the macro frame',
      'SINGLE DEW-DROP REFRACTING RAINBOW — solitary tear-shaped dew-drop hanging from one foreground petal, refracting a tiny full spectrum within itself, sunlight passing through, jewel-perfect detail',
      'SUNBEAM PIERCING ONE PETAL — single sun-ray hitting one specific foreground bloom-petal at a glancing angle, petal glowing translucent like stained glass, halo on the back, magic moment',
      'BUMBLEBEE LANDING ON CLUSTER — solitary fuzzy bumblebee landing on one foreground bloom-cluster, pollen-dust on its back, fur-on-thorax visible at macro scale, mid-motion',
      'BUTTERFLY OPENING WINGS — solitary butterfly mid-emerge on one foreground bloom, wings half-open showing the iridescent inner surface, dust of pollen drifting from the cluster, magic-moment',
      'DRAGONFLY BACK-LIT TRANSLUCENT — solitary dragonfly perched on one foreground stem, body back-lit by low sun making the abdomen and wings glow translucent amber, frozen mid-rest',
      'POLLEN-CLOUD DISPERSING IN WIND — visible cloud of golden pollen-dust drifting horizontally from one foreground bloom-cluster, caught mid-air in side-light, transient atmospheric magic',
      'SPIDER-WEB WITH WATER-BEADS — perfect orb-web stretched between two foreground bloom-stems, hundreds of water-beads on the silk catching the light like beaded pearls, jewel-detail',
      'SINGLE PETAL MID-FALL — solitary detached petal caught mid-air in side-light, suspended in the moment before it touches the bloom-mass below, motion-frozen, poetic',
      'LADYBUG ON A STEM — solitary scarlet-and-black ladybug on a foreground bloom-stem, individual spots crisp at macro scale, the bloom-mass behind in shallow blur',
      'TINY TREE-FROG ON LEAF — solitary jewel-green tree-frog on the underside of a leaf in the foreground bloom-cluster, eyes catching the light, tiny but vivid color-pop',
      'SNAIL ON A STEM — solitary snail mid-climb on a foreground bloom-stem, shell spiral crisp at macro scale, slime-trail catching light behind, scale-perfect detail',
      'INDIVIDUAL STAMEN AND POLLEN — single bloom in foreground with stamens prominently extended, pollen-mass visible on the anther-tips, filament shadows crossing the petals',
      'BUD HALF-BURSTING OPEN — solitary bloom-bud mid-burst in foreground, half-open showing the layered inner petals just unfurling, anticipation moment captured',
      'HEART-SHAPED DEWDROP — single dew-drop hanging from a foreground leaf-tip, naturally shaped exactly like a heart, sun catching it from behind, jewel-perfect detail',
      'POLLEN-MOTE CLOUD IN SUNBEAM — visible suspended pollen-motes drifting in a side-lit sunbeam crossing the foreground, hundreds of tiny golden points caught in the volumetric beam',
      'BEE BACK COVERED IN POLLEN — solitary honeybee on a foreground stamen, golden pollen-dust thick on its back and legs, individual pollen-grains visible at macro scale',
      'TINY HIDDEN NEST WITH EGGS — small cup-nest of woven grass tucked low in the foreground bloom-mass, three speckled eggs visible inside, intimate reward for the looking eye',
      'COCOON ATTACHED TO STEM — solitary moth-cocoon attached to a foreground bloom-stem, silk-fibers catching light, transformation-in-progress detail',
      'PETAL EDGE-LIT GOLDEN-HOUR — single foreground bloom with petal-edges lit by golden-hour rim-light, edge-amber glowing translucent against the soft-blur background',
    ],
    instructions: `Each entry is ONE specific SMALL FOREGROUND MAGIC-MOMENT detail for a macro frame, 20-40 words. Format: "PHENOMENON NAME CAPS — primary subject + macro detail + lighting/position note". Vary across the 10 categories above. ALWAYS small / foreground / specific. NO humans, NO architecture, NO wide-frame elements. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cozy path: interior_setting (the room canvas) ───
  bloombot_cozy_interior_setting: {
    format: 'simple',
    theme: `COZY INTERIOR SETTINGS for the BloomBot cozy path. Each entry is ONE specific WARM HUMBLE DOMESTIC interior space where flowers cascade / climb / drape / fill the architecture. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a WARM HUMBLE DOMESTIC space. Think: someone's beloved home that the garden has consumed. The interior architecture is visible and recognizable — but the flowers will dominate when rendered.

🚫 STRICT BANS:
  • NO palace / ballroom / grand interior / cathedral / chapel
  • NO commercial / hotel / corporate / shop / store
  • NO outdoor / garden / archway / pergola (garden-walk's territory)
  • NO conservatory / glass-and-iron greenhouse (conservatory's territory)
  • NO macro / closeup framing — this is INTERIOR scene with multi-tier depth
  • NO landscape / vista / beach / lagoon (other paths' territory)
  • NO ruins / abandoned crumbling structures (reclaim's territory)
  • NO surreal / floating / impossible (dreamscape)
  • NO humans / figures / hands / silhouettes

✓ INTERIOR-SETTING CATEGORIES — distribute across these:
  A. **SUNROOM / GLASSED CORNER** — sunroom with wicker chair / cushioned daybed, garden visible through panes
  B. **BREAKFAST NOOK** — breakfast nook with cushioned bench / checkered tablecloth / window light
  C. **WRITING DESK / STUDY** — writing desk under a window with typewriter / quill / open journal / candle
  D. **ARCHED-WINDOW READING SEAT** — window-seat bay with arched-window light and cushion-pile
  E. **ATTIC DORMER** — slope-ceiling attic dormer with skylight or dormer-window, brass-hook coat-rack, trunks
  F. **STAIRWELL LANDING** — carved-wood-banister stairwell landing with light spilling from above
  G. **KITCHEN CORNER** — vintage kitchen corner with copper pans / open shelves / herb-jars / sun-faded recipe-cards
  H. **FIRESIDE READING CHAIR** — armchair beside a stone or brick fireplace with mantelpiece detail
  I. **BEDROOM WINDOW SEAT** — bedroom window-seat or bedside with iron-frame bed / quilt cascading
  J. **CLAWFOOT-BATH ALCOVE** — clawfoot-bathtub alcove with brass faucet, window beyond, cascading bloom-vine
  K. **PARLOR CORNER** — Victorian parlor corner with horsehair settee / lace doily / brass lamp / wallpaper
  L. **GARRET / TURRET ROOM** — small turret or garret room with curved walls / one window / desk
  M. **POTTING ROOM / MUDROOM** — country potting-room or mudroom with terracotta pots / hung baskets / coat hooks
  N. **LIBRARY ALCOVE** — small library alcove with floor-to-ceiling bookshelves / brass reading lamp / leather chair
  O. **GREENHOUSE-DOOR THRESHOLD** — interior doorway leading INTO the garden / glasshouse, threshold scene

Lineage to channel: Wes Anderson interior frames + Studio Ghibli "Whisper of the Heart" / "Kiki's Delivery Service" bedrooms + Anne-Brontë cottage interiors + Pinterest "old soul home" boards + Pre-Raphaelite parlor stagings + Beatrix Potter cottage interiors + Vermeer light-through-window painterly grounding.`,
    touchpoints: [
      'SUNROOM WITH WICKER DAYBED — bright sunroom corner with white wicker daybed and ticking-stripe cushions, garden visible through tall multi-pane windows, terracotta floor-tiles, hanging-basket overhead, dust-motes in the slanting morning light',
      'BREAKFAST NOOK WITH CHECKERED CLOTH — breakfast nook with cushioned bench beneath a leaded-glass window, checkered tablecloth with china teapot and honey-jar, faded wallpaper visible behind, golden-hour light raking across the cloth',
      'WRITING DESK UNDER ARCHED WINDOW — wooden writing desk under a tall arched window with leaded-glass panes, vintage typewriter on the desk, brass candlestick, open leather-bound journal, scattered papers, late-afternoon light slanting in',
      'ARCHED-WINDOW READING SEAT — deep window-seat in a stone arch with cushion-pile and folded quilt, leaded-glass window, garden glow beyond, side-table with a stack of weathered books and reading lamp',
      'ATTIC DORMER WITH SKYLIGHT — slope-ceiling attic dormer room with a small dormer-window and skylight above, brass coat-hooks, leather steamer-trunk, wide-plank wood floor, light catching the dust',
      'CARVED-WOOD STAIRWELL LANDING — turn in a carved-wood-banister stairwell with a landing window, light spilling from above onto the worn runner, pewter-handled cabinet against the wall',
      'COUNTRY KITCHEN COPPER CORNER — vintage country-kitchen corner with hanging copper pans, open shelves of mismatched china, herb-jars, sun-faded recipe-cards on the wall, white-painted cupboards, brass tap above a porcelain sink',
      'FIRESIDE LEATHER ARMCHAIR — worn leather armchair beside a stone fireplace with brass andirons and a mantelpiece holding clay pots, sun-bleached photograph, side-table with a kerosene lamp',
      'IRON-FRAME BEDROOM WINDOW SEAT — bedroom with iron-frame bed and patchwork quilt cascading off the side, window-seat at the foot of the bed with a folded shawl, lace curtain stirring at the open window',
      'CLAWFOOT-BATH ALCOVE — vintage clawfoot bathtub on lion-claw feet in a tiled alcove, brass cross-handle faucet, hexagonal floor-tiles, tall window with leaded-glass behind, cake of soap in a porcelain dish',
      'VICTORIAN PARLOR CORNER — Victorian parlor corner with green velvet horsehair settee, lace antimacassar, brass-shaded reading lamp, William Morris wallpaper, ornate side-table with daguerreotype frame',
      'TURRET STUDY WITH CURVED WALL — small circular turret-room study with curved stone walls, one tall arched window, wooden writing desk, candle in pewter holder, leather-bound atlas open on the desk',
      'COUNTRY POTTING ROOM — country potting-room with rough-plank shelves of terracotta pots, hanging woven baskets, coat-hooks with garden-aprons, weathered watering-can, cracked clay tile floor',
      'LIBRARY ALCOVE WITH BRASS LAMP — small library alcove with floor-to-ceiling oak bookshelves on three walls, leather wingback chair, brass-shaded reading lamp, side-table with a porcelain tea-cup',
      'GREENHOUSE-DOOR THRESHOLD — interior threshold of a stone-floored room opening through wood-and-glass doors INTO a sunlit garden room beyond, terracotta pots flanking the doorway',
      'WINDOW-CORNER POTTING TABLE — small interior potting-corner with a rough wooden table beneath a window, terracotta pots stacked beside trowel and twine, water-pitcher, light streaming through the wavy glass',
      'STUDIO CORNER WITH EASEL — small painter studio corner with an easel by a north-facing window, jars of brushes, palette on a side-table, paint-stained wood floor, canvases stacked against the wall',
      'COTTAGE LOFT BED — cottage loft bedroom with a low-ceiling alcove bed under a sloped beam roof, a tiny window with garden view, hand-stitched quilt, oil-lamp on a wall-shelf',
      'TEA-ROOM ALCOVE — cozy tea-room alcove with a round table, bentwood chairs, pressed-tin ceiling, tall window with leaded glass, vase-and-pot collection on a sideboard',
      'WRITING-ROOM ARMCHAIR + DESK — writing-room scene with an armchair pulled up to a roll-top desk, brass-shaded lamp, fountain pen, stack of letters tied with ribbon, embroidered footstool',
    ],
    instructions: `Each entry is ONE specific COZY INTERIOR SETTING, 25-50 words. Format: "SETTING NAME CAPS — primary room features + furniture detail + window/light note". Vary across the 15 categories above. ALWAYS warm humble domestic — NEVER palace / ballroom / grand / commercial / outdoor. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cozy path: furniture_anchor (the structural piece) ───
  bloombot_cozy_furniture_anchor: {
    format: 'simple',
    theme: `COZY FURNITURE ANCHORS for the BloomBot cozy path. Each entry is ONE specific WARM DOMESTIC furniture piece or built-in element that anchors the bloom-cascade. Each entry 20-40 words.

⚠️ MANDATORY — every entry is a TACTILE WARM-DOMESTIC piece — worn-wood / cast-iron / brass / wicker / linen / mossed-velvet / hand-stitched. Real-world humble materials that read "someone's lived-in beloved home". The piece is what the bloom-mass cascades around / through / over / off.

🚫 STRICT BANS:
  • NO ornate-palace furniture (gilded thrones / marble pedestals / chandelier-arms)
  • NO commercial / corporate / sleek-modern furniture
  • NO architectural elements that are the SETTING (those are interior_setting territory) — this is specific PIECES
  • NO humans / hands / figures / silhouettes
  • NO duplication of interior_setting content

✓ FURNITURE-ANCHOR CATEGORIES:
  A. **SEATING** — wicker chair / cushioned bench / leather armchair / window-seat with cushion-pile / horsehair settee / bentwood chair / rocking chair / clawfoot tub
  B. **TABLE / DESK** — writing desk / tea-table / kitchen table / potting bench / round bistro table / roll-top desk / sewing table
  C. **BED / SLEEPING** — iron-frame bed / four-poster / loft bed / window-bed / quilted bed / sleigh bed
  D. **STORAGE** — wooden shelf / open cupboard / pewter-handled cabinet / leather-trunk / book-shelf / china-cabinet / curio shelf
  E. **WALL ARCHITECTURE** — carved-wood banister / brass coat-hooks / mantelpiece with brass andirons / window-sill with cushion / floor-to-ceiling bookshelves
  F. **VESSEL / OBJECT** — terracotta pots / china teapot / brass watering-can / wicker basket / leather-bound book / oil-lamp / candle in pewter holder / kerosene lamp / typewriter / brass-shaded reading lamp
  G. **TEXTILE** — patchwork quilt / hand-stitched runner / faded ticking-stripe cushion / lace doily / linen curtains / William Morris wallpaper / embroidered footstool / shawl on a hook
  H. **VINTAGE INSTRUMENT** — Singer sewing-machine / Underwood typewriter / brass clock / phonograph horn / Victrola / kerosene lamp / piano upright / fountain pen on a desk

Channel: Pinterest "old soul home" boards + Beatrix Potter cottages + Anne Brontë parsonage + Vermeer interiors + Wes Anderson set-design + Studio Ghibli "Whisper of the Heart" bedrooms + Anthropologie home catalog (without the brand) + estate-sale finds.`,
    touchpoints: [
      'WORN LEATHER WINGBACK ARMCHAIR — sun-aged tobacco-brown leather wingback armchair with a folded woolen throw on the arm, brass studs along the seams, a stack of books on the floor beside it',
      'IRON-FRAME BED WITH PATCHWORK QUILT — black wrought-iron-frame bed with brass finials on the corners, patchwork quilt with hand-stitched seams cascading off the side, embroidered pillow at the head',
      'CARVED-WOOD BANISTER — turn in a hand-carved oak banister polished smooth by generations, brass acorn finial at the newel post, worn floral runner beneath',
      'BRASS-SHADED READING LAMP — brass-shaded reading lamp on a small side-table beside an armchair, the bulb casting a warm pool of amber light onto an open leather-bound book',
      'PATCHWORK QUILT CASCADING — patchwork quilt with hand-stitched seams cascading off the side of an unmade bed, layered with a folded shawl and a sleeping cat shape (if implied)',
      'WICKER ROCKING CHAIR — white wicker rocking chair beside a window, a folded crochet blanket on the seat, a basket of yarn beside it, slanting sunlight catching the weave-pattern',
      'OAK ROLL-TOP DESK — oak roll-top desk with a tarnished brass key in the lock, fountain pen and ink-bottle on the writing surface, tilted brass desk-lamp, stack of letters tied with red ribbon',
      'CLAWFOOT BATHTUB — vintage white clawfoot bathtub on cast-iron lion-claw feet, brass cross-handle faucet, cake of soap in a porcelain dish on the rim, folded linen towel hung on a brass rail',
      'COPPER POT-HANG RAIL — overhead iron pot-rail with hanging copper pans of graduated size, copper measuring-cups, brass ladles, soft glow on the bronze metal',
      'TERRACOTTA POT COLLECTION — collection of weathered terracotta pots of graduated size on a rough-plank shelf, with stamps of old nurseries visible, dust patina, garden-trowel propped beside',
      'OAK BOOKSHELF FLOOR-TO-CEILING — floor-to-ceiling oak bookshelf with leather-bound spines, brass library ladder leaning against it, framed botanical prints on a corner panel',
      'CHIPPED ENAMEL FARMHOUSE SINK — chipped enamel farmhouse sink with brass cross-handle taps, draining board with china cups upended, lace curtain at the window above',
      'WROUGHT-IRON DAYBED — wrought-iron daybed with a striped-ticking mattress and pile of mis-matched throw cushions in soft faded patterns, a folded linen sheet at the foot',
      'ROUND BISTRO TABLE — small round wrought-iron bistro table with a chipped marble top, two bentwood chairs pulled up, a china teapot and two cups, a folded napkin',
      'STONE FIREPLACE WITH ANDIRONS — stone-built fireplace with brass andirons, woven-rush mat on the hearth, a worn leather chair pulled close, a copper kettle on a hob',
      'CHURCH-PEW BENCH — old church-pew bench against a wall, polished smooth by years of sitting, a folded crochet blanket on it, a basket of pinecones beside',
      'VINTAGE UNDERWOOD TYPEWRITER — vintage Underwood typewriter on a wooden desk, half-typed page in the carriage, fountain pen beside it, brass desk-lamp tilted toward the page',
      'WALL OF FRAMED BOTANICALS — wall covered in framed antique botanical prints in mismatched brass and wooden frames, faded matting, a brass-armed reading lamp jutting from the wall below',
      'CAST-IRON STOVE — old cast-iron stove with brass handles, copper kettle on top, brass scuttle of coal beside it, wood-stacked alcove with a folded blanket on top',
      'POTTING-TABLE WITH TROWELS — rough-plank potting table with terracotta pots, garden trowels, twine on a hook, a wide-mouthed glass jar of seeds, soil-dust on the surface',
    ],
    instructions: `Each entry is ONE specific COZY FURNITURE ANCHOR PIECE, 20-40 words. Format: "FURNITURE NAME CAPS — primary piece + material + tactile detail + position-hint". Vary across the 8 categories above. NEVER ornate-palace / commercial. ALWAYS warm-domestic-lived-in tactile materials. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cozy path: atmospheric_moment (60%-gated warm magic) ───
  bloombot_cozy_atmospheric_moment: {
    format: 'simple',
    theme: `60%-GATED COZY ATMOSPHERIC MOMENTS for the BloomBot cozy path. Each entry is ONE specific small warm-domestic magic-moment detail in the foreground. Each entry 20-40 words.

⚠️ MANDATORY — every moment is SMALL, FOREGROUND, SPECIFIC. It's the second-look detail that makes the room feel ALIVE without humans being present. The room reads inhabited / loved / recently-departed.

🚫 STRICT BANS:
  • NO humans / hands / figures in the moment
  • NO architectural elements (those are interior_setting territory)
  • NO duplication of furniture_anchor content
  • NO outdoor / wide-frame phenomena
  • NO surreal / impossible

✓ COZY MOMENT CATEGORIES:
  A. **LIGHT MAGIC** — slanting sunbeam catching dust-motes / sunbeam pooling on a chair / golden-hour rake across a quilt / candle-flicker shadow / lamp-glow halo
  B. **SLEEPING ANIMAL** — curled cat on a sun-patch on a cushion / dog asleep on a rug / songbird perched at the window / canary in a brass cage
  C. **STEAM / VAPOR** — fragrant tea steam rising from a chipped china cup / coffee-pot steam / cake-cooling steam from a kitchen towel-bundled loaf / candle smoke
  D. **TEXTURE DETAIL** — folded-edge of a hand-stitched quilt / brass-tarnish patina / wax-pool on a candle-holder / dew on a windowsill / book-spine cracks
  E. **JUST-LEFT** — open book half-read on the chair / unfinished embroidery in a hoop / cup of tea half-drunk / a knitted scarf draped mid-row / a half-eaten cookie
  F. **WINDOW-LIFE** — songbird at the window / hummingbird at a hanging bloom / curtain breathing in the breeze / rain-streaks on the pane / snowflakes drifting past
  G. **PETAL DETAIL** — single petal fallen on the windowsill / petal drift on a polished tabletop / pollen-dust on a brass surface
  H. **OBJECT WARMTH** — single brass key on a desk / a single fountain pen with the cap off / a stack of letters tied with ribbon / a pressed flower in an open book
  I. **SOUND IMPLIED** — kettle on the verge of whistling / clock-pendulum hovering at full swing / phonograph needle resting on a record
  J. **SCENT IMPLIED** — vanilla candle freshly extinguished / cinnamon-spice from a baking dish / pine-bough on the mantel

Channel: Studio Ghibli "Whisper of the Heart" detail framing + Vermeer light-on-domestic-object + Wes Anderson props + Anne Brontë parsonage + Anthropologie still-life vignettes + cozy-cottage-cinema. The "someone just stepped out of frame" mood.`,
    touchpoints: [
      'SLANTING SUNBEAM WITH DUST MOTES — single golden-hour sunbeam slanting through a window onto a cushion, individual dust-motes suspended in the light, the only thing moving in the still room',
      'CURLED CAT ON SUN-PATCH — solitary tabby cat curled asleep in a sun-warmed patch on a faded cushion, tail tucked around its body, breathing implied, only one ear visible in the soft sun',
      'STEAM FROM A CHIPPED CHINA CUP — wisp of fragrant tea steam rising from a chipped china cup on a small side-table, the cup half-full, a single tea-leaf settling at the bottom',
      'OPEN BOOK ON A CHAIR — leather-bound book left open face-down on an armchair seat, page-marker ribbon hanging, reading glasses folded beside it on the cushion',
      'PATCHWORK QUILT FOLD DETAIL — close detail of a folded edge of a hand-stitched patchwork quilt, individual cross-stitches visible in faded thread, one corner pulled slightly back',
      'HUMMINGBIRD AT WINDOW BLOOM — solitary hummingbird hovering at a bloom-cluster spilling from the windowsill, wings a transparent blur, jewel-iridescent body catching the window-light',
      'UNFINISHED EMBROIDERY IN HOOP — solitary embroidery hoop with half-finished floral pattern, needle pinned at the edge mid-stitch, a small basket of colored threads beside it',
      'SONG-BIRD AT THE WINDOW — solitary songbird (sparrow / wren / robin) perched at the windowsill from the outside, head tilted, looking IN through the leaded glass',
      'CANDLE-WAX POOL ON BRASS HOLDER — solitary candle in a brass holder, the candle low and the wax pooled around the base in soft creamy ridges, flame implied or just extinguished',
      'PRESSED FLOWER IN AN OPEN BOOK — pressed flower visible between the pages of an open weathered book, single petal slightly raised, the ink of the page faded',
      'PETAL FALLEN ON WINDOWSILL — single fallen petal resting on a sun-warmed windowsill, dust-motes in the slanting light around it, the only fallen element in the otherwise tidy frame',
      'CURTAIN BREATHING IN BREEZE — sun-bleached linen curtain stirred slightly by a breeze through an open window, garden visible just beyond in soft-focus',
      'WAX-POOLED CANDLE ON A DESK — single low candle in a pewter holder on the corner of a desk, wax pooled in soft drips around the base, recently lit with a faint after-smoke',
      'RAIN-STREAKS ON WINDOW — leaded-glass window with rain-streaks tracing the panes, the warm interior reflected faintly in the wet glass, lamp-glow hazing across the streaks',
      'KETTLE NEAR WHISTLE — copper kettle on a cast-iron stove just at the moment before it whistles, a thin curl of steam beginning to escape the spout',
      'LETTERS TIED WITH RIBBON — neat stack of weathered letters tied with a faded red ribbon on a writing desk, top envelope addressed in faded ink, sealing-wax on the back',
      'POLLEN ON BRASS SURFACE — fine pollen-dust on the brass surface of a candleholder or lamp-base, evidence the blooms above have shed in the still air',
      'SLEEPING DOG ON RUG — solitary dog asleep on a worn rug beside a fireside chair, paws tucked, snout on the front paws, soft breathing implied',
      'CINNAMON-SPICE FROM A DISH — implied warm cinnamon-spice from a small baking-dish cooling on a kitchen counter, towel-wrapped, the kitchen window beyond with garden glow',
      'FOUNTAIN PEN UNCAPPED — fountain pen with the cap off on a writing desk, ink-bead at the nib, fresh inkwell beside it, a sheet of paper with the first line just written',
    ],
    instructions: `Each entry is ONE specific SMALL WARM-DOMESTIC magic-moment detail, 20-40 words. Format: "MOMENT NAME CAPS — primary subject + tactile detail + lighting/position note". Vary across the 10 categories above. ALWAYS small / foreground / specific. NO humans. NO architecture (interior territory). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── garden-walk path: archway_type (architectural framing entity) ───
  bloombot_garden_walk_archway_type: {
    format: 'simple',
    theme: `GARDEN-WALK ARCHWAY TYPES for the BloomBot garden-walk path. Each entry is ONE specific architectural framing entity that forms a walkable passage HALF-CONSUMED by climbing blooms. The archway is the eye's destination, centered in a symmetric portrait composition. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a NATURAL or HANDMADE WEATHERED structure (stone / iron / wood / living vegetation). The arch's silhouette is CLEAR but the bloom-mass wraps and drapes over it. NEVER modern / commercial / sleek / corporate.

🚫 STRICT BANS:
  • NO modern / commercial / corporate architecture
  • NO interiors / rooms / sunrooms (cozy)
  • NO open landscapes without a framing entity (landscape)
  • NO conservatory glass-and-iron (conservatory)
  • NO urban architecture / city alley (city-flowers)
  • NO ruins as PRIMARY subject (reclaim) — but vine-curtained ruin doorway as archway is FINE
  • NO surreal / floating / impossible (dreamscape)
  • NO tropical jungle vine-curtain that fills the frame (tropical-paradise) — narrow arched passage only
  • NO people / hands / figures / silhouettes / hooded figures at the arch

✓ ARCHWAY CATEGORIES:
  A. **STONE ARCH** — gothic stone archway / Roman arch / weathered chapel doorway / abbey ruin arch / castle wall postern
  B. **WROUGHT-IRON ARBOR** — wrought-iron rose-arbor / Victorian iron arch / decorative iron rose-trellis arch
  C. **WOODEN-PERGOLA TUNNEL** — wisteria pergola tunnel / hop-pergola / vine-pergola with weathered posts / cedar-beam arch
  D. **LIVING VEGETATION ARCH** — gnarled branch arch / two trees grown together / hedgerow gap arched naturally
  E. **TEMPLE-RUIN DOORWAY** — Khmer / Mayan / Roman / Norse / Celtic vine-curtained temple ruin
  F. **HEDGEROW TUNNEL** — formal hedgerow tunnel / yew-tunnel / boxwood-arch
  G. **STEPPED DOORWAY** — cottage stone-stepped doorway / Mediterranean blue-painted door / Provence courtyard gate
  H. **CRUMBLED GATE** — old garden gate left ajar / iron-gate gone to rust / wooden-gate with peeling paint
  I. **OAK BRANCH ARCH** — two ancient oaks bowed over a path / cathedral of branches / forest-glade arch
  J. **MOSSY-STONE GATEWAY** — mossy-stone gateway / lichen-covered wall opening / dry-stone wall arch
  K. **FAIRY-TALE DOORWAY** — round hobbit-hole-style doorway / carved garden-fairy doorway / arched cottage door
  L. **STREAM-CROSSED BRIDGE-ARCH** — small stone bridge with arch over a stream, blooms cascading from above
  M. **VINE-CURTAIN TUNNEL** — ivy or jasmine vine-curtain forming a hanging-vegetal tunnel
  N. **FOREST-GLADE OPENING** — natural break between forest-canopy trees forming an arch overhead

Lineage to channel: Princess Mononoke ancient-forest gates + Studio Ghibli secret-garden archways + Pre-Raphaelite tunnel-of-roses paintings + Frances Hodgson Burnett "The Secret Garden" door + Tasha Tudor cottage-garden gates + Beatrix Potter mossy doorways.`,
    touchpoints: [
      'GOTHIC STONE ARCHWAY SMOTHERED IN ROSES — pointed gothic stone archway half-consumed by climbing roses and vine-curtains, weathered stone with moss-and-lichen patina visible between the bloom-clusters, deep recess in the stone framing the passage beyond',
      'WISTERIA-PERGOLA TUNNEL — wooden pergola tunnel with weathered cedar beams supporting a dense wisteria roof of hanging racemes, pendant blooms dangling at viewers brow-height, dappled light through the canopy',
      'WROUGHT-IRON ROSE-ARBOR — wrought-iron rose-arbor with curling Victorian scrollwork rusted to a warm patina, climbing roses spiraling up both sides, arched top dense with bloom-clusters',
      'GNARLED BRANCH ARCH — two ancient gnarled trees grown together overhead forming a natural arch, branches woven and bark-textured, lichen-and-moss on the trunks, blooms massed at the base of each trunk',
      'KHMER VINE-CURTAINED TEMPLE DOORWAY — ancient Khmer-style stone temple doorway half-collapsed and entirely vine-curtained, weathered carvings visible between the climbing blooms, jungle threshold beyond',
      'YEW-HEDGE TUNNEL OPENING — formal yew-hedge tunnel with arched opening, walls of dense dark-green yew on both sides, climbing-bloom mass at the entry-point, glowing light at the tunnel far-end',
      'COTTAGE-STONE STEPPED DOORWAY — weathered stone-stepped cottage doorway with painted blue door cracked open, climbing roses and clematis on either side of the frame',
      'OLD GARDEN-GATE GONE TO RUST — old iron garden-gate left ajar at a stone wall opening, hinges rusted to amber-and-orange, climbing-bloom mass spilling through the gap',
      'OAK CATHEDRAL OF BRANCHES — two ancient oak trees grown together with branches arched overhead forming a cathedral of branches, leaf-and-bloom canopy filtering light, mossy trunks framing the passage',
      'MOSSY-STONE WALL GATEWAY — opening in a moss-covered dry-stone wall, lichen-patterns on the stones, climbing-bloom mass at the entry, sun-glow beyond',
      'ROUND HOBBIT-DOORWAY GATE — round wooden door in a stone-framed earthen wall, climbing-flowers around the frame, the door slightly ajar revealing the path beyond',
      'STONE-BRIDGE ARCH WITH BLOOMS — small stone bridge with low arched span over a stream, climbing-blooms cascading from the bridge balustrade, water visible passing underneath',
      'IVY VINE-CURTAIN TUNNEL — vertical ivy vine-curtain forming a hanging-vegetal tunnel, blooms threaded through the ivy mass, dappled light through the curtain breaks',
      'FOREST-GLADE NATURAL OPENING — natural opening between forest-canopy trees forming an arched silhouette overhead, bloom-laden branches at the entry-point, sunlit glade beyond',
      'ABBEY-RUIN STONE ARCH — half-collapsed abbey ruin stone arch with broken capitals and ivy curtains, weathered carved-stone detail visible, hush of sacred-overgrown atmosphere',
      'MEDITERRANEAN BLUE-PAINTED DOOR — Mediterranean blue-painted wooden door in a whitewashed stone arch, bougainvillea climbing the frame, sun-bleached threshold with petals scattered at the base',
      'CHURCHYARD-WALL GATE — weathered churchyard-wall gate of black iron, lichen on the stone posts, climbing-roses and ivy threading the bars, sunlit graveyard glow beyond',
      'CELTIC-RUIN DOORWAY ARCH — Celtic standing-stone doorway arch with weathered carvings, ivy and bloom-vines softening the stones, the path leading to a sacred grove beyond',
      'PROVENCE COURTYARD GATE — weathered Provence courtyard gate of old wood and iron hinges, lavender-and-rose climbing both posts, sun-warmed terracotta path beyond',
      'BAMBOO-AND-VINE TUNNEL — bamboo-pole tunnel with arched canopy of woven-bamboo and climbing-vine, dappled light through the bamboo verticals, soft glow at the tunnel exit',
    ],
    instructions: `Each entry is ONE specific ARCHWAY ENTITY half-consumed by climbing blooms, 25-50 words. Format: "ARCHWAY NAME CAPS — primary structure + material + bloom-consumption note + framing implication". Vary across the 14 categories above. ALWAYS natural / handmade / weathered. NEVER modern / commercial / sleek. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── garden-walk path: path_material (the path leading dead-center) ───
  bloombot_garden_walk_path_material: {
    format: 'simple',
    theme: `GARDEN-WALK PATH MATERIALS for the BloomBot garden-walk path. Each entry is ONE specific tactile path-surface visible from the bottom-center of the frame leading dead-center into the archway depths. Each entry 15-30 words.

⚠️ MANDATORY — every entry is a TACTILE NATURAL or HANDMADE path surface that the viewer could almost FEEL underfoot. The path is VISIBLE from the foreground, leading IN.

🚫 STRICT BANS:
  • NO modern paving / asphalt / concrete / commercial walkway
  • NO sidewalks / urban paths (city-flowers territory)
  • NO interior floors (cozy territory)
  • NO duplication of archway content — this is just the PATH SURFACE
  • NO humans / footprints implying recent passage (the path is undisturbed and inviting)

✓ PATH-MATERIAL CATEGORIES:
  A. **STONE FLAGSTONES** — flagstone path / cobblestone / cracked-flag with moss in the joints / weathered slate steps
  B. **PACKED EARTH** — packed-earth path / dirt path with grass-edges / sun-warmed clay
  C. **PETAL CARPET** — carpet of fallen petals / petal-strewn earth / petal-and-moss layered floor
  D. **MOSSY STEPS** — mossy stone steps / fern-edged stone treads / lichen-covered steps
  E. **STEPPING-STONES** — round stepping-stones across moss / stepping-stones over a shallow stream / flat-stones placed in grass
  F. **WOODEN BOARDS** — weathered wooden-board path / decking with grass between / cedar-plank walkway
  G. **GRAVEL** — pea-gravel path / crushed-shell path / weathered crushed-brick path
  H. **GRASS-PATH** — mowed grass path / mowed-grass corridor between bloom-beds / sun-warmed turf
  I. **CRUSHED-STONE** — crushed-stone path / pebble-and-sand walkway
  J. **WATER-CROSSING** — stepping-stones over a small stream / wooden plank over a brook
  K. **BRICK** — old red-brick path / herringbone-brick / weathered brick with moss-joints
  L. **SAND-AND-PETAL** — sandy-earth path with petal scatter / golden sand strewn with fallen blooms

Channel: Burnett "The Secret Garden" path + Studio Ghibli garden paths + Tasha Tudor cottage-garden walks + Beatrix Potter mossy steps.`,
    touchpoints: [
      'WEATHERED FLAGSTONE PATH — weathered grey flagstone path with moss-and-lichen-filled joints leading from foreground dead-center into the archway depths, fallen petals scattered across the stones',
      'MOSSY STONE STEPS ASCENDING — series of mossy stone steps rising slightly into the archway, fern-fronds spilling from the step-edges, individual stones visible at the foreground',
      'PETAL-CARPET EARTH PATH — packed-earth path almost entirely covered in a thick carpet of fallen petals in mixed soft colors, the path-form visible by the slight depression in the petal layer',
      'STEPPING-STONES OVER SHALLOW STREAM — round flat stepping-stones placed across a shallow stream that crosses the path, clear water flowing visibly between the stones, mossy edges',
      'PACKED-EARTH PATH WITH GRASS EDGES — packed-earth dirt path with grass and tiny wildflower edges where the path meets the bloom-beds, footworn smooth in the center',
      'WEATHERED WOODEN-BOARD WALKWAY — weathered wooden-board walkway with grass growing in the seams, the boards sun-faded silver-grey, leading into the arch',
      'PEA-GRAVEL CRUNCH PATH — pea-gravel path with the slight depression of frequent walking, individual stones visible at the foreground, slight petal scatter on the gravel',
      'GRASS PATH MOWED THROUGH MEADOW — mowed grass corridor cutting through a wild bloom-meadow on both sides, the grass softer than the surrounding tall flowering plants',
      'OLD RED-BRICK HERRINGBONE — old red-brick path in herringbone pattern, individual bricks weathered with moss-and-lichen at the joints, brick-edges slightly worn',
      'COBBLESTONE WITH MOSS-JOINTS — old cobblestone path with deep moss-filled joints, rounded individual stones polished smooth by years of walking',
      'CRACKED SLATE PATH — cracked slate path with darker slate steps rising into the arch, lichen on the slate, individual cracks visible in the foreground',
      'SAND-AND-PETAL PATH — golden sandy-earth path strewn with fallen blooms and pollen-dust, the path slightly depressed where walked, leading dead-center',
      'WHITE CRUSHED-SHELL PATH — white crushed-shell path leading from the foreground into the arch, shell-fragments individually visible, slight depression where walked',
      'MOSSY-STONE STEPS WITH FERN EDGES — moss-covered stone steps ascending into the arch with fern-fronds spilling from every step-edge, deep green and earth-toned',
      'CEDAR-PLANK WALKWAY — weathered cedar-plank walkway with grass between the planks, the wood sun-bleached silver-grey, leading into the archway',
    ],
    instructions: `Each entry is ONE specific TACTILE PATH SURFACE leading dead-center into the arch, 15-30 words. Format: "PATH MATERIAL NAME CAPS — primary surface texture + secondary detail + leading-into-arch implication". Vary across the 12 categories. NEVER modern paving / sidewalk / urban. NO humans / footprints. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── garden-walk path: destination_glimpse (what lies beyond the arch) ───
  bloombot_garden_walk_destination_glimpse: {
    format: 'simple',
    theme: `GARDEN-WALK DESTINATION GLIMPSES for the BloomBot garden-walk path. Each entry is ONE specific glimpse of what lies BEYOND the archway opening — lit warmer than the foreground, glowing like a doorway to somewhere magical. Each entry 20-40 words.

⚠️ MANDATORY — every entry implies a CONTINUING BLOOM-WORLD beyond the arch (never a blank backdrop). The destination is GLIMPSED through the arch — soft-focus / glowing / atmospheric / inviting. The warm light at the destination contrasts the cooler foreground.

🚫 STRICT BANS:
  • NO blank backdrop / void / studio
  • NO urban / city / corporate (city-flowers)
  • NO interiors (cozy territory)
  • NO ruins as PRIMARY (reclaim)
  • NO surreal / impossible (dreamscape)
  • NO humans / figures in the destination
  • NO duplication of archway content — this is what's BEYOND the arch

✓ DESTINATION-GLIMPSE CATEGORIES:
  A. **BLOOM-MEADOW** — sun-drenched bloom-meadow / wildflower field / cottage-garden border
  B. **FOREST CLEARING** — sunlit forest clearing / glade with shafts of light / bluebell carpet
  C. **POND / WATER** — small pond with lily-pads / reflective pool / stream-bend with bloom-banks
  D. **DISTANT COTTAGE** — distant stone cottage with smoking chimney / tudor cottage / fairy-tale dwelling glimpsed
  E. **SECRET-GARDEN INTERIOR** — secret-garden interior with central fountain / sundial / arbor
  F. **HEDGEROW MAZE** — hedgerow maze opening / formal-garden parterre / topiary chamber
  G. **CLIFF / OVERLOOK** — overlook to distant valley / cliff-top with sea / mountain-pass view
  H. **WALLED GARDEN** — walled-garden interior with old stone walls / espaliered fruit / cottage garden
  I. **SUNLIT TUNNEL CONTINUATION** — the path continues into another tunnel of blooms / another archway in deep distance
  J. **GLOWING BLOOM-AMPHITHEATRE** — natural amphitheatre of blooms / circular bloom-clearing
  K. **STREAM CORRIDOR** — stream corridor with blooms on both banks / shaded waterway
  L. **GROVE OF ANCIENT TREES** — grove of ancient trees with blooms at the trunks / cathedral of trees
  M. **HIDDEN POND** — circular pond with lily-pads and bloom-edged banks
  N. **MEADOW WITH DEER / WILDLIFE** — meadow beyond with deer / herd in soft-focus distance

Channel: Burnett "Secret Garden" reveal + Studio Ghibli secret-place reveals + Tasha Tudor secret-cottage glimpse + fairy-tale-illustrated path-destinations.`,
    touchpoints: [
      'SUN-DRENCHED BLOOM-MEADOW — sun-drenched wildflower meadow stretching beyond the arch, golden-hour light pouring across the blooms, atmospheric haze in deep distance softening into glow',
      'SUNLIT FOREST CLEARING — sunlit forest clearing visible beyond the arch with vertical sun-shafts through tall trees, ferns and bluebells carpeting the clearing floor, soft warm glow',
      'POND WITH LILY-PADS — small reflective pond with lily-pads visible beyond the arch, water mirroring the canopy above, bloom-edged banks softly visible at the pond rim',
      'DISTANT STONE COTTAGE — distant stone cottage with a smoking chimney visible beyond the arch, glowing windows lit warm, surrounded by garden-mass softly visible',
      'SECRET-GARDEN WITH SUNDIAL — secret-garden interior beyond the arch with a central stone sundial, low boxwood-edged beds of blooms, paths radiating from the center',
      'WALLED-GARDEN COTTAGE INTERIOR — walled-garden interior beyond the arch with old stone walls draped in espaliered fruit trees, perennial beds in full bloom',
      'PARTERRE GARDEN WITH FOUNTAIN — formal parterre garden beyond the arch with low hedges in geometric patterns, central stone fountain bubbling, sunlit and warm',
      'CLIFF OVERLOOK TO DISTANT SEA — cliff overlook beyond the arch revealing a distant sea-and-sky vista, bloom-edge at the cliff brim, warm horizon glow',
      'ANOTHER ARCH IN DEEP DISTANCE — the path continues into another archway visible in the deep distance, another tunnel of blooms beyond, soft-focus and glowing',
      'GLOWING BLOOM-AMPHITHEATRE — natural circular amphitheatre of blooms beyond the arch, light pooling at the center, bloom-walls rising on all sides',
      'STREAM CORRIDOR WITH BLOOM-BANKS — stream corridor beyond the arch with blooms massing on both banks, water visible flowing into deep distance, dappled canopy above',
      'CATHEDRAL OF ANCIENT TREES — grove of ancient trees beyond the arch with blooms at the trunks, vertical sun-shafts piercing the high canopy, cathedral-like and reverent',
      'CIRCULAR LILY-POND — circular lily-pond beyond the arch with concentric ripples, bloom-edged banks, distant trees reflecting on the still water',
      'MEADOW WITH DISTANT DEER — bloom-meadow beyond the arch with a small herd of deer grazing in soft-focus midground, golden light catching the antlers',
      'HEDGEROW MAZE OPENING — hedgerow maze opening beyond the arch with formal yew-hedge corridors visible, statuary at the maze-center, sun-glow above',
      'TIERED COTTAGE GARDEN — tiered cottage garden beyond the arch with stone-terraced beds rising into the deep distance, blooms cascading over every retaining wall',
      'ORCHARD WITH BLOOM-TREES — orchard beyond the arch with blooming fruit-trees in deep rows, fallen petals on the grass, sunlit warm depth',
      'FAIRY-TALE TURRET GLIMPSE — fairy-tale stone turret with conical slate roof visible beyond the arch, ivy-covered base, glowing window high up',
      'POOL WITH SWANS — quiet bloom-edged pool beyond the arch with a pair of swans gliding on the still water, warm golden light',
      'SECRET MEADOW WITH BUTTERFLIES — secret meadow beyond the arch with a cloud of butterflies in soft-focus midground, blooms catching the warm light',
    ],
    instructions: `Each entry is ONE specific DESTINATION GLIMPSE through the arch, 20-40 words. Format: "DESTINATION NAME CAPS — primary destination + warm-glow quality + soft-focus implying continuing world". Vary across the 14 categories. NEVER blank backdrop. NO people. NO duplicate archway. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── garden-walk path: atmospheric_phenomenon (60%-gated magic) ───
  bloombot_garden_walk_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED GARDEN-WALK ATMOSPHERIC PHENOMENA for the BloomBot garden-walk path. Each entry is ONE specific magic-moment element rendered within the archway passage. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon AMPLIFIES the doorway-to-somewhere-magical mood. Render within the foreground bloom-mass, the arch opening, or the destination glow. Always implies LIFE / MAGIC / ATMOSPHERE.

🚫 STRICT BANS:
  • NO humans / figures / hooded silhouettes at the arch
  • NO architectural elements (those are archway territory)
  • NO duplicate destination_glimpse content
  • NO surreal physics
  • NO wide-frame phenomena (rainbows / aurora — those don't fit the portrait framing)

✓ PHENOMENON CATEGORIES:
  A. **LIGHT-SHAFT** — vertical sun-shaft falling through the arch onto the path / volumetric god-ray through the opening
  B. **FALLING PETALS** — petal-fall drifting from the arch / petals mid-air through the opening
  C. **FIREFLY CLOUD** — firefly-cloud at dusk in the archway / glow-cloud of tiny lights
  D. **MIST / VAPOR** — low ground-mist hugging the path / vapor coiling around the arch / pollen-haze in light
  E. **BUTTERFLY CLUSTER** — butterfly cluster in the arch opening / monarch wave passing through
  F. **HUMMINGBIRD** — solitary hummingbird hovering at a bloom on the arch
  G. **BIRD AT ARCH** — songbird perched on the arch top / robin/wren at the bloom-mass
  H. **DEWDROP / PEARLS** — dewdrops on every petal / pearl-beads on a spider-web at the arch
  I. **POLLEN-CLOUD** — golden pollen-dust dispersing in side-light through the arch
  J. **CANDLE-GLOW** — single candle in a niche by the arch / lantern hanging from the arch with soft warm glow
  K. **DOUBLE LIGHT-SHAFTS** — paired sun-shafts through the arch symmetric to the framing
  L. **MAGIC-DUST SPARKLES** — suspended dust-mote sparkles caught in side-light through the arch

Channel: Princess Mononoke kodama-spirits + Studio Ghibli light-shaft moments + Burnett "Secret Garden" robin / magic-bird reveal + Disney Sleeping-Beauty fairy-dust + Tasha Tudor candle-in-cottage warm moments.`,
    touchpoints: [
      'VERTICAL SUN-SHAFT THROUGH ARCH — single vertical sun-shaft falling through the archway opening onto the path stones at the center, vapor and dust-motes suspended in the volumetric beam',
      'FALLING PETALS THROUGH THE ARCH — drifting petal-fall caught mid-air through the archway opening, petals from the climbing-bloom canopy above slowly descending toward the path',
      'FIREFLY CLOUD AT DUSK — soft cloud of fireflies suspended in the archway opening at dusk, hundreds of green-pulse lights stereo-arranged through the depth',
      'LOW GROUND-MIST HUGGING PATH — low ground-mist coiling along the path through the archway, vaporous and luminous in the destination glow, foreground crisp and the mist softening backward',
      'BUTTERFLY CLUSTER IN ARCH — small cluster of butterflies suspended in the archway opening mid-passage, wings catching the back-light through the arch, jewel-iridescent',
      'HUMMINGBIRD AT ARCH BLOOM — solitary jewel-iridescent hummingbird hovering at a bloom on the archway frame, wings a transparent blur, beak just touching the flower',
      'SONGBIRD ON ARCH TOP — solitary songbird (robin / wren / nightingale) perched on the top of the archway, head tilted toward the viewer, the empty path inviting beyond',
      'DEWDROP CASCADE ON ARCHWAY — fine dewdrop beads on every petal of the climbing-bloom mass around the archway, the archway scintillating with reflected light',
      'POLLEN-CLOUD GOLDEN DUST — golden pollen-cloud dispersing in side-light through the archway, the entire passage hazy with suspended dust-motes catching gold',
      'CANDLE LANTERN HANGING AT ARCH — single candle-lit lantern hanging from the top of the archway, soft amber glow pooling on the foreground bloom-mass and the path-stones',
      'PAIRED SUN-SHAFTS THROUGH ARCH — two paired vertical sun-shafts falling symmetrically through the archway opening, creating a halo-of-light at the path-center',
      'DOUBLE-RAINBOW DEW-WEB — perfect spider-web spanning the archway frame, hundreds of dewdrops on the silk catching light like double-beaded pearls',
      'PETAL-SPIRAL MID-AIR — single petal caught mid-air in a slow upward spiral through the archway, frozen in side-light, magic-moment frame',
      'GLOWING POLLEN-MIST — golden pollen-mist suspended in the entire archway passage, dust-motes individually visible in the slanting destination light',
      'WHITE-MOTH MIGRATION — small cluster of white moths passing through the archway opening in soft fluttering motion, individual wings translucent in the back-light',
      'FROST-SHIMMER ON ARCH BLOOMS — early-morning frost shimmer on the climbing-bloom mass around the archway, sun catching individual ice-crystals in pinpoints of light',
      'DRAGONFLY HOVERING — solitary jewel-iridescent dragonfly hovering in the foreground bloom-mass beside the path, body back-lit translucent amber',
      'TWILIGHT GLOW BEYOND — soft twilight glow at the destination end of the passage, the path leading toward warm sunset light, foreground blooms in cool blue-shadow',
      'PINK-MOON RISING BEYOND — full pink-moon rising behind the destination, soft pink-amber halo around the moon-disk visible through the arch opening',
      'GLOW-DUST SPARKLES IN AIR — suspended dust-mote sparkles caught in side-light through the archway, the entire passage shimmering with tiny pinpoints of light',
    ],
    instructions: `Each entry is ONE specific magic-moment phenomenon rendered within the garden-walk passage, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position within the passage + lighting/depth note". Vary across the 12 categories. NO humans, NO duplicates of archway / destination content. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── dreamscape path: impossibility_type (the physics break) ───
  bloombot_dreamscape_impossibility_type: {
    format: 'simple',
    theme: `SURREAL FLORAL DREAMSCAPE IMPOSSIBILITIES for the BloomBot dreamscape path. Each entry is ONE specific way that PHYSICS BREAKS in the floral composition — gravity / scale / reflection / containment / direction / continuity. The composition is impossible; the render technique is hyperreal/photoreal painting. Magritte / Dali / Beksinski / Storm Thorgerson lineage. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a COMPOSITIONAL impossibility, not a "weird flower" impossibility. The flowers are REAL earth species. The LAYOUT breaks physics — gravity inversion / scale-shift / spatial recursion / mirror-divergence / floating-mid-air / impossible-container / etc.

🚫 STRICT BANS:
  • NO alien flowers / fictional species / bioluminescent invented blooms
  • NO cartoon / sticker / glitch / Photoshop-glitch visual effects
  • NO humans / faces / figures floating in the scene
  • NO duplicate of world_element content — this is the PHYSICS BREAK, not the object being broken
  • NO surreal that lacks coherent impossibility (random absurdity is not the goal)

✓ IMPOSSIBILITY CATEGORIES — distribute across these:
  A. **GRAVITY-INVERTED** — flowers growing DOWN from the sky / a meadow on the underside of a cloud / rain falling UPWARD as blooms
  B. **FLOATING / SUSPENDED** — bloom-constellation suspended at multiple altitudes / floating sphere of blooms in mid-air / blooms hovering in zero-g
  C. **SCALE-SHIFT** — a single oversized bloom inside which a smaller bloom-world exists / Alice-in-Wonderland blooms ten times normal size / human-scale petals
  D. **MIRROR-DIVERGENCE** — a lake reflecting a different bloom-scene than the one above it / mirror showing a parallel bloom-world / shadow falling at impossible angle showing different blooms
  E. **MAGRITTE-WINDOW** — a Magritte-style window opening in the air onto another bloom-scene / a doorway leading INTO a bloom-storm / a picture-frame containing a real bloom-world
  F. **CONTAINER-WORLD** — a single oversized bloom inside which a smaller bloom-world exists / a bell-jar containing a meadow / a snowglobe of blooms
  G. **DIRECTIONAL-DEFY** — a river flowing UPWARD through the air carrying blooms / petals falling sideways in still air / wind blowing in two directions at once
  H. **HELICAL / SPIRAL** — a spiral helical bloom-staircase ascending into nothing / Penrose stairs of blooms / Möbius strip of cascading flowers
  I. **PORTAL-OPENING** — a hole in a stone wall opening onto a different bloom-meadow / a tunnel through nothing leading to a bloom-grotto / an aperture in the sky
  J. **DUPLICATION / REPETITION** — same bloom-cluster recursively reflected at multiple scales / kaleidoscope of one bloom / a row of identical impossible mirrors
  K. **MATERIAL-INVERSION** — stone that flows like water / clouds that hold blooms like soil / water that hangs in droplet-form / glass that ripples
  L. **TIME-INVERSION** — a bloom in three life-stages simultaneously (bud / open / wilted) on the same stem / dawn and dusk in the same sky

Channel: Magritte "Le Blanc-Seing" / "L\\'Empire des Lumières" + Dali "Persistence of Memory" + Beksinski post-apocalyptic dreamscapes + Storm Thorgerson Pink Floyd album covers + Surrealism + Roger Dean fantasy landscapes.`,
    touchpoints: [
      'GRAVITY-FLIPPED BLOOM-RAIN — flowers growing DOWNWARD from the sky in vertical bloom-cascades, roots gripping cloud-soil overhead, petals falling UPWARD toward the ground in slow-motion gravity-inversion',
      'FLOATING BLOOM-CONSTELLATION — blooms suspended in mid-air at multiple altitudes like a constellation, each bloom turning slowly in space with stems trailing weightlessly, ground far below visible through the gaps',
      'OVERSIZED CONTAINER BLOOM — a single oversized bloom (rose / peony / lotus) at the foreground center, opened to reveal a smaller bloom-world inside its petals — a complete meadow rendered at miniature scale within the cup',
      'MIRROR LAKE DIVERGENCE — a perfectly still lake reflecting a COMPLETELY DIFFERENT bloom-scene than the one above it, the reflection shows a winter-cherry-blossom canopy while the real above is a summer-meadow',
      'MAGRITTE-WINDOW ONTO BLOOM-STORM — a Magritte-style window-frame hovering in mid-air, the window opening onto a different bloom-scene — a swirling bloom-storm visible through the panes',
      'RIVER FLOWING UPWARD — a clear water-river flowing UPWARD through the air, carrying blooms WITH it as it ascends, the stream defying gravity in a continuous arc into the sky',
      'HELICAL BLOOM-STAIRCASE — spiral helical staircase made of stone slabs floating in the void, each step blanketed in flowers, the spiral ascending into nothing at the top',
      'PORTAL THROUGH STONE WALL — circular hole in a weathered stone wall opening onto a completely different bloom-meadow, the portal-edge crisply defined, two worlds visible at once',
      'KALEIDOSCOPE BLOOM-REPETITION — same bloom-cluster recursively reflected at multiple scales radiating outward from a central focal point, kaleidoscope geometry, impossible self-similarity',
      'STONE FLOWING LIKE WATER — a stone arch that flows visibly like water, ripples and droplets falling from its surface, blooms growing from the rippling stone',
      'TIME-INVERSION ON ONE STEM — a single bloom-stem showing three life-stages simultaneously: bud at the bottom, fully-open at the middle, wilted petals falling at the top — time collapsed into one form',
      'PENROSE BLOOM-STAIRS — Penrose-impossible-staircase made of bloom-covered stone, ascending and descending in the same direction simultaneously, optical-illusion geometry',
      'DOORWAY IN THE SKY — a single freestanding doorway hovering at the horizon, blooms cascading from its frame, the door opening onto an upside-down bloom-meadow visible through it',
      'PETALS FALLING SIDEWAYS — petals in mid-air falling SIDEWAYS in still air, defying gravity in a horizontal cascade, no wind visible but the petals moving in coherent direction',
      'BELL-JAR MEADOW — large glass bell-jar in the foreground containing a complete miniature bloom-meadow with its own sky / clouds / atmospheric perspective, real-scale outside the jar',
      'CLOUD MEADOW — a meadow on the UNDERSIDE of a cloud, blooms growing downward from the cloud-soil, viewer looking up at the impossible inverted garden',
      'PARALLEL-MIRROR BLOOM — a hand-mirror in the foreground showing a completely different bloom-world than what is reflected behind, two realities visible in the same frame',
      'SHADOW-AT-IMPOSSIBLE-ANGLE — blooms casting shadows at an impossible angle showing entirely different species in shadow than in solid form, shadow-blooms diverging from real ones',
      'FLOATING ISLAND OF BLOOMS — fragment of meadow-and-stone broken free from the ground floating in mid-air, roots dangling, blooms continuing to grow normally on the floating fragment',
      'PETALS FORMING WORDS — fallen petals on water arranged to spell a word or phrase visible from above, the message itself flower-formed, water-still around them',
    ],
    instructions: `Each entry is ONE specific COMPOSITIONAL IMPOSSIBILITY for a floral dreamscape, 25-50 words. Format: "IMPOSSIBILITY NAME CAPS — primary physics-break + how blooms are arranged in the impossibility + hyperreal-precision quality". Vary across the 12 categories. ALWAYS real earth species in impossible LAYOUT (never alien flowers). NO humans. NO cartoon glitch effects. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── dreamscape path: world_element (the physical object the impossibility breaks) ───
  bloombot_dreamscape_world_element: {
    format: 'simple',
    theme: `WORLD ELEMENTS for the BloomBot dreamscape path. Each entry is ONE specific physical object / environment / structure that is rendered with HYPERREAL PRECISION and provides the canvas the impossibility breaks. Each entry 20-40 words.

⚠️ MANDATORY — every world-element is a REAL physical thing rendered with TRUE materials and textures. It will be subjected to the impossibility (gravity-flipped / scale-shifted / mirrored / etc.) but the element ITSELF is real.

🚫 STRICT BANS:
  • NO architectural elements that ARE the impossibility (those are impossibility_type territory)
  • NO humans / figures / hands
  • NO duplicate of impossibility content
  • NO surreal materials (no glowing-fictional / alien-material) — the impossibility is in the BEHAVIOR not the substance

✓ WORLD-ELEMENT CATEGORIES:
  A. **NATURAL LANDFORM** — a single mountain peak / cliff / valley / cave entrance / waterfall / standing stone / boulder
  B. **WATER FEATURE** — a still pond / a meandering stream / an ocean horizon / a lake / a fountain
  C. **ARCHITECTURAL FRAGMENT** — a single doorway / archway / staircase / window / pillar / wall section / bridge — usually IN ISOLATION
  D. **SKY / CLOUD** — a single cloud / a clear sky / a stormy sky-shoulder / a horizon-line / a moon / a sun-disk
  E. **OBJECT** — a single picture-frame / mirror / bell-jar / snowglobe / floating sphere / hovering book / suspended chair
  F. **ROOM FRAGMENT** — an empty room interior / a tilted floor / a corridor / a window-seat / a fireplace alcove
  G. **GROUND FRAGMENT** — a single piece of meadow / a fragment of beach / a stretch of sidewalk / a section of garden-bed
  H. **GEOMETRIC FORM** — a perfect cube / sphere / spiral staircase / impossible cube / Möbius strip
  I. **HORIZON-LINE** — distant mountain horizon / distant sea horizon / distant city silhouette / vanishing-point road

Channel: Magritte "L\\'Empire des Lumières" / "Le Château des Pyrénées" + Dali landscape backgrounds + Storm Thorgerson album-cover landscapes + Beksinski stone formations + Penrose impossible-geometry diagrams.`,
    touchpoints: [
      'MAGRITTE FLOATING STONE-BOULDER — a single massive stone boulder hovering in mid-air at midground, surface rendered with hyperreal texture — moss, lichen, weather-stains — defying gravity in clear sky',
      'STILL POND MIRROR-PERFECT — a perfectly still pond at the foreground, water surface like dark glass with mirror-perfect reflection, every ripple absent, edge clearly defined',
      'WEATHERED STONE ARCHWAY ISOLATED — a freestanding weathered stone archway in midground, no walls attached, the arch alone in an open space, hyperreal stone texture',
      'SINGLE CLOUD IN CLEAR SKY — a single perfectly-rendered cumulus cloud in an otherwise empty clear sky, cloud-form crisp, every shadow-and-highlight detailed',
      'PICTURE-FRAME HOVERING — a single ornate picture-frame hovering in mid-air at viewer level, no canvas inside, the frame edges crisp against the dreamscape',
      'BELL-JAR ON A TABLE — a large glass bell-jar on a stone table, perfectly clear glass with the maker-marks visible, table rendered with weathered-wood texture',
      'WEATHERED SPIRAL STAIRCASE — a freestanding weathered stone spiral staircase ascending into open air, each step rendered with crisp moss-and-stone detail, no walls or framework',
      'FLOATING DOORWAY FRAME — a single freestanding doorway-frame in mid-air, the door slightly ajar, no walls, the frame crisp and weathered',
      'CLIFF EDGE WITH HORIZON — a single cliff-edge at the foreground bottom, distant horizon visible far below, sky vast above, cliff-surface hyperreal-textured',
      'OPEN BOOK ON A PEDESTAL — a single open book floating in mid-air on an invisible pedestal, pages crisp and hyperreal, text visible',
      'STONE WELL WITH WATER — a freestanding stone well rim with dark water visible inside, no surrounding ground, well-wall hyperreal-textured stone',
      'SINGLE TREE IN AN EMPTY PLAIN — a single ancient tree standing alone in an empty plain, tree rendered with hyperreal bark-and-leaf detail, no other vegetation',
      'IRON BIRDCAGE HANGING — a single ornate iron birdcage hanging in mid-air with no chain visible, cage-bars hyperreal-detailed, no bird inside',
      'CHESS-BOARD ON A TABLE — a single chess-board with pieces mid-game on a stone table, board hyperreal-detailed, table weathered',
      'MOON OVER A HORIZON — a single full moon hovering above a distant flat horizon, moon crisp and detailed, sky-gradient hyperreal',
      'A SINGLE STONE STEP — a single stone step floating in mid-air, no surrounding stairs, the step hyperreal-textured with moss-and-lichen',
      'CARRIAGE WHEEL LEANING — a single weathered wooden carriage-wheel leaning against nothing in mid-air, individual spokes and iron-rim crisp',
      'STREAM IN MID-AIR — a section of clear running water flowing through mid-air with no banks, the water-form held together by impossible cohesion',
      'CATHEDRAL WINDOW HOVERING — a single stained-glass cathedral-window-frame hovering in mid-air, the glass impossibly intact, no walls',
      'WROUGHT-IRON GATE FLOATING — a single ornate wrought-iron gate hanging open in mid-air with no fence attached, gate rendered with rust-patina hyperreal detail',
    ],
    instructions: `Each entry is ONE specific PHYSICAL WORLD ELEMENT rendered with HYPERREAL PRECISION, 20-40 words. Format: "ELEMENT NAME CAPS — primary object + material/texture detail + hovering / freestanding / isolated quality". Vary across the 9 categories. ALWAYS real / physical / hyperreal-textured. NO humans. NO duplicate of impossibility. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── dreamscape path: atmospheric_halo (60%-gated surreal lighting) ───
  bloombot_dreamscape_atmospheric_halo: {
    format: 'simple',
    theme: `60%-GATED ATMOSPHERIC HALOS for the BloomBot dreamscape path. Each entry is ONE specific surreal-lighting / atmospheric phenomenon that amplifies the dreamscape's impossibility. Each entry 20-40 words.

⚠️ MANDATORY — every halo is a SURREAL LIGHTING / ATMOSPHERIC element that fits the Magritte/Dali/Beksinski/Thorgerson register. NEVER realistic-weather (those belong in landscape). The halo IS the impossibility's atmospheric expression.

🚫 STRICT BANS:
  • NO realistic weather (rain / snow / wind / storm — too earthly)
  • NO humans / figures
  • NO duplicate of impossibility / world_element content
  • NO cartoon / glitch / sticker effects
  • NO architectural elements

✓ HALO CATEGORIES:
  A. **MAGRITTE-EVENING-SUN** — a single warm sun-disk in an otherwise empty sky / sun lighting the dreamscape in unreal gold / Magritte-style impossible-evening light
  B. **DUAL LIGHT-SOURCE** — two suns at impossible angles / two moons / sun and moon simultaneously / dawn and dusk in the same sky
  C. **HORIZONTAL LIGHT-FLOW** — light flowing horizontally instead of from above / sideways sunbeam / lateral god-rays
  D. **APERTURE IN THE AIR** — a glowing aperture / portal of light in mid-air with no source / a hole in the sky pouring warm light through
  E. **PETAL-STORM** — petals raining through the air in surreal density / blizzard of petals with no flowers visible / petal-cloud hovering still
  F. **BLOOM-CONSTELLATION** — blooms suspended like stars at night-sky scale / a constellation made of blooms / bloom-galaxy in deep space
  G. **DUST / POLLEN-CLOUD** — golden pollen-cloud suspended in surreal stillness / dust-motes frozen in mid-fall / pollen-galaxy in space
  H. **REFLECTION-RIPPLES** — water-ripples in mid-air with no water / reflective surface that ripples without disturbance / mirage of bloom-ripples
  I. **SHADOW-PARADOX** — shadows falling in impossible directions / multiple shadows from one object / shadow that grows blooms
  J. **AURORA-DREAMSCAPE** — aurora-like color-band drifting across the surreal sky / impossible color-curtain / fractal-aurora

Channel: Magritte sky-and-cloud paintings + Dali "Sleep" desaturated dreamscapes + Beksinski post-apocalyptic atmospheres + Storm Thorgerson "Wish You Were Here" surreal-light + Roger Dean Yes-album-cover atmospheres.`,
    touchpoints: [
      'MAGRITTE EVENING-SUN — a single warm Magritte-style evening-sun hovering low in an otherwise empty sky, lighting the entire dreamscape in unreal gold, no clouds, perfect rendering',
      'TWO SUNS AT IMPOSSIBLE ANGLES — two warm suns at opposite quadrants of the sky lighting the dreamscape from contradictory directions, double-shadow on every surface',
      'HORIZONTAL LIGHT-FLOW — golden light flowing horizontally across the dreamscape from one side, casting upward shadows that point at the sky, gravity-defying illumination',
      'APERTURE-IN-AIR LIGHT-POUR — a glowing hexagonal aperture in mid-air with no apparent source, warm light pouring through it onto the dreamscape, the rest of the sky in cool blue',
      'PETAL-STORM SUSPENDED — a blizzard of petals suspended in mid-air motionless, hundreds of petals frozen at every depth, no flowers visible to have shed them',
      'BLOOM-CONSTELLATION NIGHT-SKY — blooms suspended like stars at night-sky scale across a deep-violet sky, each bloom small but distinct, distance-perspective making them constellation-like',
      'POLLEN-CLOUD SUSPENDED STILL — vast cloud of golden pollen-motes suspended in surreal stillness across the dreamscape, each mote individually visible in deep light',
      'WATER-RIPPLES IN MID-AIR — concentric water-ripples expanding in mid-air with no water visible, the ripples perfect circles propagating through empty space',
      'IMPOSSIBLE DOUBLE-SHADOW — every element casting two shadows in opposite directions, one warm-amber-edged and one cool-blue-edged, both clearly defined',
      'AURORA COLOR-CURTAIN — aurora-like color-band drifting diagonally across the surreal sky in green and violet, impossible at this latitude, the dreamscape painted in the colored light',
      'BLOOM-GALAXY IN DEEP SPACE — bloom-petals arranged in a galactic-spiral pattern across the sky, individual blooms forming the spiral arms, vast cosmic scale',
      'PETALS RISING FROM EARTH — petals rising upward from the ground in slow-motion against gravity, hundreds visible at every depth, no source visible',
      'WARM-LIGHT WITHIN A SHADOW — a shadow zone that contains its OWN sun-glow, the shadow-area paradoxically lit warmer than the sun-area outside it',
      'SOFT MIST WITH NO SOURCE — soft pearl-mist hovering in still air with no source visible, the mist softening the impossibility into dream-haze',
      'TEMPORAL DOUBLE-EXPOSURE — the entire dreamscape rendered as if two moments are visible simultaneously, ghost-edge on every element, doubled position by slight shift',
      'MAGRITTE-CLOUD WITH HOLE — a Magritte-style cloud with a perfectly circular hole cut through it, the sky beyond visible through the cloud-hole, surreal architectural quality',
      'REFLECTION-WITHOUT-WATER — a perfect reflection of the upper dreamscape on a non-existent surface at the foreground bottom, no water actually visible',
      'IMPOSSIBLE COLOR-GRADIENT SKY — the sky shifts through impossible colors (turquoise to mauve to amber to rose) in a continuous gradient, dreamlike palette',
      'STILL-LIFE LIT FROM WITHIN — every bloom in the dreamscape glowing softly from within with internal light, soft halo around each, no external light source',
      'FRACTAL-AURORA — aurora-like color-curtain folding fractally into itself across the sky, impossible mathematical pattern, surreal beauty',
    ],
    instructions: `Each entry is ONE specific SURREAL ATMOSPHERIC HALO, 20-40 words. Format: "HALO NAME CAPS — primary surreal-lighting element + how it amplifies the impossibility + rendering detail". Vary across the 10 categories. ALWAYS surreal / dream / Magritte register. NEVER realistic weather. NO humans. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── conservatory path: conservatory_type (the architectural shell) ───
  bloombot_conservatory_conservatory_type: {
    format: 'simple',
    theme: `VICTORIAN CONSERVATORY TYPES for the BloomBot conservatory path. Each entry is ONE specific Victorian / Edwardian glass-and-iron conservatory interior — overgrown by climbing blooms and cascading vines. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a Victorian / Edwardian glass-and-iron architecture (Kew Gardens / Royal Greenhouse of Laeken / Crystal Palace / Crystal Court / 19th-century botanical garden) lineage. NEVER modern glass building, NEVER plastic greenhouse, NEVER wood-and-glass garden room.

🚫 STRICT BANS:
  • NO modern / contemporary / sleek glass architecture
  • NO plastic / vinyl / commercial greenhouse
  • NO wood-and-glass garden room (cozy)
  • NO outdoor scene (this is INTERIOR)
  • NO archways/passages (garden-walk territory)
  • NO ruins (reclaim territory)
  • NO humans / figures

✓ CONSERVATORY TYPE CATEGORIES:
  A. **SMALL PRIVATE GREENHOUSE** — small estate-house Victorian conservatory attached to a country house, single-room with curved glass roof
  B. **PALM-HOUSE / KEW-SCALE** — large palm-house with multi-tier glass dome, soaring iron columns, central avenue, towering vegetation
  C. **VICTORIAN ORANGERY** — orangery-style structure with tall arched windows / iron-and-glass ceiling, slate-tile floor, formal arrangement
  D. **OCTAGONAL CONSERVATORY** — octagonal Victorian conservatory with eight-sided glass dome converging at peak, leaded-glass panels, central focal point
  E. **VICTORIAN BOTANIC HOTHOUSE** — botanical-garden hothouse with rising-glass roof, multiple-aisle nave structure, walkways between bloom-beds
  F. **CRYSTAL-PALACE-SCALE** — vast Crystal-Palace-scale conservatory with cathedral-volume interior, soaring iron framework, multiple floors of vegetation
  G. **CONSERVATORY ANNEX** — small annex-conservatory attached to a brick mansion, asymmetric shape, single tall window-wall of glass
  H. **TOWER GLASS-DOME** — tower-shaped glass-dome conservatory with circular base and conical peak, spiral iron-staircase, single central space
  I. **HALF-DOME WALL** — half-dome glass-and-iron wall against a brick or stone wall, like an attached observatory, curved glass dominating
  J. **TROPICAL PAVILION** — Victorian tropical-pavilion with humidity-misting / fountain-and-pool / palm-and-fern jungle below glass dome
  K. **ROUND ROTUNDA GLASS-HOUSE** — circular rotunda glass-house with central pool / sundial / statue, glass-dome above, peripheral iron walkway
  L. **BARRED-PROMENADE GLASS-CORRIDOR** — long Victorian glass-corridor connecting two buildings, iron-arched ceiling, full of cascading climbers

Lineage to channel: Kew Gardens Palm House + Royal Greenhouse of Laeken + Crystal Palace + Edwardian glasshouses + Victorian botanical pavilions + Schönbrunn Palm House.`,
    touchpoints: [
      'KEW-SCALE PALM HOUSE — vast palm-house with multi-tier glass dome rising overhead, soaring rust-patina iron columns, central avenue between bloom-beds, towering palm-trees and tree-ferns reaching toward the dome',
      'VICTORIAN ORANGERY — orangery with tall arched windows along one wall, iron-and-glass ceiling overhead, slate-tile floor in geometric pattern, formal arrangement with citrus-trees and bloom-beds',
      'OCTAGONAL GAZEBO CONSERVATORY — octagonal Victorian gazebo conservatory with eight-sided glass dome converging at a finial peak, leaded-glass panels framing the panes, central reflecting pool',
      'BOTANIC GARDEN HOTHOUSE — botanical-garden hothouse with steeply-rising glass roof, multi-aisle nave structure, wrought-iron walkways between bloom-beds, central avenue receding into deep distance',
      'CRYSTAL-PALACE-SCALE PAVILION — vast Crystal-Palace-scale conservatory with cathedral-volume interior, soaring rust-patina iron framework, multiple floors of vegetation visible through the glass walls',
      'COUNTRY-HOUSE ANNEX CONSERVATORY — small annex-conservatory attached to a brick country-house mansion, asymmetric shape with curved glass roof on one side, single-pane Victorian glazing',
      'GLASS-DOME TOWER — tower-shaped glass-dome conservatory with circular base, conical peak overhead, spiral wrought-iron staircase ascending to a mezzanine walkway',
      'HALF-DOME LEAN-TO — half-dome glass-and-iron wall attached to a brick country-mansion wall, like an attached observatory, curved glass dominating the upper register',
      'TROPICAL HUMID PAVILION — Victorian tropical-pavilion with visible humidity-haze, central fountain spraying mist, palm-and-fern jungle below the soaring glass dome, banana-leaves arching overhead',
      'ROTUNDA GLASS-HOUSE — circular rotunda glass-house with central reflecting pool, sundial statue, glass-dome above, peripheral wrought-iron walkway encircling the central space',
      'PROMENADE GLASS-CORRIDOR — long Victorian glass-corridor with iron-arched ceiling, climbing-bloom cascades from every iron-rib, depth receding into deep humid glow at the far end',
      'GLASS PEACH-HOUSE — Victorian wall-attached peach-house with sloped glass roof, espaliered fruit-trees on the back wall, central bloom-bed beneath, sun-warmed atmosphere',
      'LEAN-TO ESTATE CONSERVATORY — lean-to estate conservatory built against a south-facing brick wall, sloped glass roof, single-room with central potting-bench and bloom-cascades',
      'TWO-STORY VICTORIAN CONSERVATORY — two-story Victorian conservatory with iron mezzanine walkway encircling the second floor, glass dome above, central column rising through both floors',
      'BUTTERFLY HOUSE — Victorian butterfly-house with low glass-dome and tropical-humidity, cascading climbing-bloom mass, small central pool, butterflies suggested in the warm humid air',
      'CHAPEL-NAVE CONSERVATORY — chapel-nave-shape conservatory with high nave of glass-and-iron, side-aisle bloom-beds, central altar-like fountain at the apse end',
      'AMPHITHEATRE GLASS-HOUSE — Victorian amphitheatre glass-house with tiered bloom-beds radiating from a central pool, glass-dome converging overhead, iron walkways at each tier',
      'RUSTED-PATINA OLD GREENHOUSE — old long-neglected Victorian greenhouse with rust-patinaed iron framework, some glass panes cracked, bloom-mass having consumed most of the architecture, slightly wild atmosphere',
      'CHATEAU GLASS-WING — French-chateau-style glass-wing with elaborate wrought-iron scrollwork in the framework, opera-house-curved ceiling, formal central walkway',
      'GLASS DOME CATHEDRAL — cathedral-scale glass-dome single-room conservatory with iron ribs radiating from a central oculus, leaded-glass panels in geometric mandala pattern overhead',
    ],
    instructions: `Each entry is ONE specific VICTORIAN GLASS-AND-IRON CONSERVATORY INTERIOR, 25-50 words. Format: "CONSERVATORY NAME CAPS — primary architecture type + glass-and-iron detail + overgrown-vegetation note". Vary across the 12 categories. ALWAYS Victorian / Edwardian glass-and-iron. NEVER modern / plastic / wood-frame. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── conservatory path: structural_anchor (the central focal piece) ───
  bloombot_conservatory_structural_anchor: {
    format: 'simple',
    theme: `CONSERVATORY STRUCTURAL ANCHORS for the BloomBot conservatory path. Each entry is ONE specific central focal-piece element around which the bloom-mass arranges itself. Each entry 20-40 words.

⚠️ MANDATORY — every anchor is a TACTILE structural piece typical of Victorian conservatory interiors. The anchor reads as the heart of the conservatory.

🚫 STRICT BANS:
  • NO modern / contemporary furniture
  • NO architectural elements that ARE the conservatory shell (those are conservatory_type)
  • NO humans / figures
  • NO duplicate of conservatory_type content

✓ STRUCTURAL ANCHOR CATEGORIES:
  A. **WATER FEATURE** — circular reflecting pool with lily-pads / Victorian fountain with marble basin / wrought-iron-edged pond / central marble lily-pool
  B. **STAIRCASE / WALKWAY** — curving wrought-iron staircase to a mezzanine / spiral iron staircase / iron-railed mezzanine walkway
  C. **STONE BENCH / SEATING** — stone bench under the dome / wrought-iron Victorian garden-bench / marble loveseat / curved-stone seat at the pool edge
  D. **SUNDIAL / STATUE** — tall sundial in the center / weathered marble statue / botanical sculpture / armillary sphere
  E. **BIRD CAGE / VOLIERE** — ornate Victorian birdcage suspended from rafters / large wrought-iron voliere / golden birdcage hanging
  F. **PLANTER / URN** — colossal Victorian terracotta urn at the center / ornate planter with cascading bloom / stone-carved urn with overflow
  G. **CENTRAL TREE** — a single ancient palm / tree-fern / banana-tree as the central anchor, towering toward the dome
  H. **POTTING BENCH** — long wrought-iron potting-bench with terracotta pots / Victorian gardeners table with copper watering-cans
  I. **CHANDELIER / LANTERN** — Victorian crystal chandelier hanging from the dome / cast-iron lantern hanging at center / brass-and-glass pendant
  J. **WROUGHT-IRON ARCH** — central wrought-iron archway draped in climbing-bloom inside the conservatory, smaller-arch-within-the-larger-dome
  K. **TIERED FOUNTAIN** — Victorian tiered fountain with multiple basins, water cascading down through bloom-edged tiers
  L. **MARBLE COLUMN / OBELISK** — central marble column with Corinthian capital / ornate stone obelisk / sculpted column-and-vase

Channel: Kew Gardens interior props + Royal Greenhouse central fountains + Victorian botanical-garden ornament + estate-house conservatory interiors + Crystal-Palace centerpieces.`,
    touchpoints: [
      'CIRCULAR REFLECTING POOL WITH LILY-PADS — large circular reflecting pool at the conservatory center with white-and-pink water-lilies covering the surface, low stone rim, bloom-mass cascading from above into the still water',
      'CURVING WROUGHT-IRON STAIRCASE — elegant curving wrought-iron staircase with floral scrollwork railings spiraling up to a mezzanine walkway, climbing-bloom mass spiraling up along with the steps',
      'VICTORIAN FOUNTAIN WITH MARBLE BASIN — Victorian three-tier fountain at the center with marble basin and water cascading down through smaller-and-smaller upper bowls, bloom-edge around the basin',
      'STONE BENCH UNDER THE DOME — single weathered stone bench centered under the glass dome, climbing-rose vines curving over and around it, light-shaft pouring down onto the bench at golden-hour',
      'TALL BRASS SUNDIAL — tall brass-and-stone sundial in the center of the conservatory, gnomon casting precise shadow, bloom-mass surrounding the base in a perfect circle',
      'ORNATE VICTORIAN BIRDCAGE — ornate Victorian wrought-iron birdcage suspended from the dome rafters, cage-bars wrapped in climbing-bloom vines, empty or with a single bird-form glimpsed',
      'COLOSSAL TERRACOTTA URN — colossal weathered Victorian terracotta urn at center on a stone pedestal, bloom-mass overflowing the rim and cascading down the sides, urn-rim moss-and-lichen-patinated',
      'ANCIENT PALM AS CENTRAL TREE — single ancient palm-tree at the conservatory center, fronds reaching toward the glass dome, climbing-bloom vines twined up the trunk',
      'POTTING-BENCH WITH COPPER PANS — long wrought-iron potting-bench against one wall with copper watering-cans and weathered terracotta pots, gardening tools hung on the wall, bloom-mass spilling from the pots',
      'CRYSTAL CHANDELIER HANGING — Victorian crystal chandelier hanging from the glass dome center on a long chain, bloom-mass surrounding the chandelier in mid-air, sunlight scattering through the crystals',
      'WROUGHT-IRON ARCHWAY INSIDE — central wrought-iron archway draped in climbing-rose vines inside the conservatory, framing a path through the bloom-mass, smaller arch nested within the dome',
      'TIERED MARBLE FOUNTAIN — Victorian tiered marble fountain at the center with three graduated basins, water cascading musically, bloom-edged each tier',
      'CORINTHIAN MARBLE COLUMN — single Corinthian marble column at the conservatory center bearing a vase or stone fruit-basket, climbing-bloom vines spiraling up the column',
      'WROUGHT-IRON CONSERVATORY TABLE — round wrought-iron table at the center with three chairs around it, bloom-mass cascading from a central planter, set for a forgotten tea',
      'WEATHERED MARBLE STATUE — single weathered marble statue (classical female / cherub / muse) at the conservatory center on a stone pedestal, climbing-bloom vines partially obscuring the figure',
      'ARMILLARY SPHERE — large brass armillary sphere on a stone pedestal at the conservatory center, brass-rings catching the light, bloom-mass surrounding the base',
      'IRON-RAILED MEZZANINE WALKWAY — wrought-iron mezzanine walkway encircling the conservatory at second-floor height, railings draped in climbing-bloom cascades, lower floor visible below',
      'STONE WELL-EDGE PLANTER — central stone well-edge planter (oversized circular stone planter) overflowing with bloom-mass, cascading vines spilling onto the flagstone floor',
      'BRASS PEDESTAL VOLIERE — large brass voliere (decorative cage) on a stone pedestal at the conservatory center, bloom-vines threaded through the bars, occupied by suggestion only',
      'STONE OBELISK ENCLOSURE — central stone obelisk rising from a circular bloom-bed, weathered carvings on the obelisk face, climbing-vines spiraling up to a height the dome',
    ],
    instructions: `Each entry is ONE specific CENTRAL FOCAL-PIECE structural anchor inside a Victorian conservatory, 20-40 words. Format: "ANCHOR NAME CAPS — primary structure + material + bloom-interaction note". Vary across the 12 categories. NEVER modern / contemporary furniture. NO duplicate of conservatory shell. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── conservatory path: atmospheric_phenomenon (60%-gated magic) ───
  bloombot_conservatory_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED CONSERVATORY ATMOSPHERIC PHENOMENA for the BloomBot conservatory path. Each entry is ONE specific magic-moment element rendered within the glass-and-iron conservatory interior. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon amplifies the conservatory atmosphere (humid / glass-filtered light / Victorian botanical mood). Renders as a visible element within the space.

🚫 STRICT BANS:
  • NO humans / figures
  • NO architectural elements (those are conservatory_type / structural_anchor)
  • NO outdoor weather (this is interior)
  • NO duplicate of conservatory shell content

✓ PHENOMENON CATEGORIES:
  A. **GOD-RAY DRAMA** — volumetric god-rays through the glass dome at dramatic angle / multiple sun-shafts piercing the bloom-mass / single column of light onto the anchor
  B. **HUMIDITY-MIST** — visible humidity-mist coiling near the dome / fine vapor rising from the fountain / steam from a heating-pipe / condensation droplets on the glass
  C. **HUMMINGBIRD / POLLINATOR** — solitary hummingbird hovering at a bloom-cluster / butterfly cloud above the central fountain / bee-cluster at a flowering vine
  D. **EXOTIC BIRD** — peacock standing on the flagstone / single tropical bird (parrot / toucan) perched on the iron framework / songbird at the dome
  E. **POLLEN-CLOUD** — golden pollen-cloud dispersing in side-light through the glass / pollen-dust visible in the god-rays
  F. **PETAL-FALL** — petal-fall drifting from the upper bloom-cascades to the flagstone floor / petal-mass on the floor
  G. **WATER-RIPPLES** — concentric ripples expanding in the central pool / water-drop falling into the fountain / lily-pad-edge ripples
  H. **CRYSTAL-LIGHT SCATTER** — leaded-glass panes scattering sun in geometric patterns onto the flagstones / kaleidoscope-light on the walls / chandelier-prism rainbows
  I. **DAPPLED CANOPY LIGHT** — broken light through the leaf-canopy of climbing vines, dappled patterns on the flagstones below
  J. **OCULUS LIGHT-CIRCLE** — circle of light from the central glass-dome oculus pooled on the flagstone floor at the conservatory center
  K. **CONDENSATION RUN** — beads of condensation on the glass panes catching light / water-droplets running down the glass-and-iron joints
  L. **EVENING TWILIGHT GLASS-GLOW** — late-afternoon honey-amber light bathing the entire conservatory through the west-facing glass

Channel: Kew Gardens interior atmospheric moments + estate-conservatory golden-hour scenes + Vermeer-light-through-leaded-glass + Singer Sargent botanical-greenhouse paintings.`,
    touchpoints: [
      'VOLUMETRIC GOD-RAYS THROUGH DOME — multiple volumetric god-ray sun-shafts diagonally piercing the glass dome at dramatic angles, vapor-laden beams visible in the humid air, pooling onto specific bloom-patches below',
      'HUMIDITY-MIST NEAR THE DOME — visible humidity-mist coiling near the upper rafters of the glass dome, soft vapor obscuring the iron-framework slightly, creating atmospheric depth',
      'HUMMINGBIRD AT A BLOOM — solitary jewel-iridescent hummingbird hovering at a specific bloom-cluster in the conservatory, wings a transparent blur, beak just grazing the bloom',
      'PEACOCK ON THE FLAGSTONE — solitary peacock standing on the flagstone floor near the central fountain, tail-feathers spread in display, iridescent blue-and-green catching the glass-filtered light',
      'POLLEN-CLOUD IN GOD-RAYS — golden pollen-cloud dispersing in the god-ray sun-shafts, individual pollen-motes visible in the volumetric beams, the dust catching the warm light',
      'PETAL-FALL FROM UPPER CASCADES — drifting petal-fall from the upper climbing-bloom cascades toward the flagstone floor, petals suspended at every depth, falling in slow-motion through the still air',
      'WATER-DROP RIPPLES IN POOL — concentric ripples expanding from a single water-drop in the central reflecting pool, lily-pad edges briefly disturbed, the rest of the surface mirror-still',
      'LEADED-GLASS LIGHT-PATTERN — leaded-glass panes scattering sun in geometric stained-glass pattern onto the flagstones, the iron grid casting precise shadow-lines on the floor',
      'DAPPLED CANOPY-LIGHT PATTERN — broken sunlight through the climbing-vine leaf-canopy, dappled patterns of light-and-shadow on the flagstones below, painterly effect',
      'OCULUS LIGHT-CIRCLE — perfect circle of light from a central glass-dome oculus pooled directly on the flagstone floor at the conservatory center, the rest of the floor in cooler shadow',
      'CONDENSATION ON THE GLASS — beads of condensation on the glass panes catching the light, water-droplets running slowly down the glass-and-iron joints, humid atmosphere visible',
      'EVENING GLASS-GLOW HONEY — late-afternoon honey-amber light bathing the entire conservatory through west-facing glass panes, every surface catching warm gold, deep shadows in opposite corners',
      'BUTTERFLY CLOUD AT FOUNTAIN — small cluster of butterflies above the central fountain, wings catching the glass-filtered light, sipping at the water-edge',
      'CHANDELIER PRISM-RAINBOWS — Victorian crystal chandelier suspended from the dome scattering prism-rainbows across the bloom-mass below, multiple small rainbow-patches on the walls',
      'PARROT ON IRON ARCH — solitary tropical parrot perched on a wrought-iron arch overhead, bright color-pop against the green-and-iron mass, head tilted toward the viewer',
      'FOUNTAIN STEAM IN COLD MORNING — visible steam rising from the central fountain in early morning when the air outside the glass is cold, vapor caught in cross-light from the dome',
      'SWALLOW DARTING THROUGH SPACE — solitary swallow caught mid-flight across the conservatory interior, wings spread in motion, depth-of-field blurring the bloom-mass behind it',
      'POLLINATOR-BEE AT A SUNLIT BLOOM — solitary fuzzy bumblebee on a sunlit foreground bloom, pollen-dust on its back, sun-shaft catching the bee in golden light',
      'TWILIGHT MOON THROUGH GLASS — early-evening moon visible through the glass-dome panes, soft blue light entering from above, the conservatory mostly in golden lamp-glow',
      'LANTERN-GLOW WARM POOL — single Victorian lantern hanging from a wrought-iron hook glowing soft amber, pooling warm light on a bloom-cluster nearby, the rest of the conservatory in cool blue shadow',
    ],
    instructions: `Each entry is ONE specific CONSERVATORY ATMOSPHERIC magic-moment, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position in conservatory + light/depth note". Vary across the 12 categories. NO humans. NO architectural duplicates. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── city-flowers path: city_setting (the urban canvas) ───
  bloombot_city_flowers_city_setting: {
    format: 'simple',
    theme: `URBAN-OVERGROWN-BY-FLOWERS SETTINGS for the BloomBot city-flowers path. Each entry is ONE specific real-world historic urban setting where the city's signature architecture is HALF-CONSUMED by floral overgrowth. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a recognizable HISTORIC / PICTURESQUE / WEATHERED urban setting. The city's specific style is UNMISTAKABLE. Wide street-photography composition with pedestrian POV.

🚫 STRICT BANS:
  • NO modern / contemporary / corporate / sleek architecture
  • NO American urban / Manhattan / LA / suburban
  • NO interiors / rooms (cozy)
  • NO landscapes / vistas / open countryside (landscape / tropical)
  • NO conservatory / glass-and-iron greenhouse (conservatory)
  • NO archways/passages as the FRAMING (garden-walk) — but city archways as PART of the urban scene are FINE
  • NO ruins / abandoned (reclaim)
  • NO humans / pedestrians / figures in the scene
  • NO surreal / impossible

✓ CITY-SETTING CATEGORIES:
  A. **MEDITERRANEAN** — Cinque Terre cliff-village stairway / Amalfi coast village / Greek-island white-and-blue / Provence stone-village / Italian hill-town
  B. **PARISIAN HAUSSMANN** — Paris cobblestone street / Haussmann boulevard / Montmartre stairway / Marais alley / Saint-Germain courtyard
  C. **PORTUGUESE / LISBON** — Lisbon tile-fronted staircase / Alfama alley / Porto azulejo-clad street
  D. **MOORISH / MARRAKECH** — Marrakech blue-painted courtyard / Andalusian whitewashed alley / Chefchaouen blue town / Granada Albaicín alley
  E. **VENETIAN / CANAL CITY** — Venetian canal-side palazzo / Bruges canal / Amsterdam canal-house / Annecy canal-edge
  F. **CUBAN / COLONIAL** — Havana old-town colonial street / colonial Caribbean / Cartagena Colombian
  G. **TOKYO BACK-STREET** — Tokyo wooden-and-paper back-street / Kyoto Gion-district lane / Hanoi narrow alley
  H. **BRITISH COTTAGE** — Cotswolds stone-cottage village / Cornish fishing-village / Welsh slate-roof lane
  I. **SCANDINAVIAN** — Stockholm Gamla Stan alley / Bergen wooden-house wharf / Copenhagen colored-house row
  J. **TUSCAN / UMBRIAN** — Tuscan hill-town alley / Umbrian medieval village / San Gimignano
  K. **PUEBLO / SOUTHWEST** — Santa Fe adobe street / Mexican colonial town / New Mexico pueblo
  L. **NORTH AFRICAN** — Fez medina alley / Casablanca old-quarter / Tunis souk-edge
  M. **INDIAN PALACE-TOWN** — Jaipur pink-city alley / Udaipur palace-town / Jodhpur blue-city
  N. **EAST ASIAN VILLAGE** — Hoi An Vietnamese lantern-street / Bagan Burmese village / Luang Prabang Laos
  O. **MEDIEVAL EUROPEAN** — German half-timber town / Czech medieval village / French medieval cité

Lineage to channel: National Geographic city-street photography + Travel + Leisure cover shots + Pinterest "European cities" boards + Studio Ghibli "Kiki's Delivery Service" old-world cities + Wes Anderson European set design.`,
    touchpoints: [
      'CINQUE TERRE CLIFFSIDE STAIRWAY — pastel-painted Cinque Terre cliff-village stairway climbing between tile-roof houses, bloom-cascades from every windowsill, sea visible far below at the cliff-edge, golden-hour light',
      'PARISIAN HAUSSMANN BALCONY STREET — narrow Parisian Haussmann street with cream-stone facades, iron Juliet balconies tier upon tier on both sides, bloom-cascades from every railing, cobblestone street below',
      'LISBON AZULEJO STAIRCASE — Lisbon staircase climbing between azulejo-tile-fronted houses, blue-and-white tile patterns visible through climbing-bloom vines, brass street-lamp, sun-bleached white plaster',
      'MARRAKECH BLUE COURTYARD — Marrakech / Chefchaouen blue-painted courtyard with central fountain or well, bloom-cascade from upper balconies on all sides, deep ultramarine walls, geometric tile floor',
      'VENETIAN CANAL PALAZZO — Venetian canal-side palazzo with weathered stone-and-stucco facade, bloom-cascades from arched-window balconies, dark canal water in the foreground reflecting the architecture',
      'HAVANA OLD-TOWN STREET — Havana old-town colonial street with peeling pastel-painted walls, ornate iron grilles at the windows, bloom-cascades from every balcony, classic-car-style cobblestone street',
      'TOKYO WOODEN BACK-STREET — Tokyo wooden-and-paper back-street with sliding doors and lanterns, bloom-cluster pots at every doorstep, weathered wood walls, paper-lantern glow at dusk',
      'COTSWOLDS STONE-COTTAGE LANE — Cotswolds stone-cottage village lane with honey-colored stone walls, climbing roses on every cottage, thatched roofs, dry-stone walls, sun-warmed gravel road',
      'STOCKHOLM GAMLA STAN ALLEY — Stockholm Gamla Stan medieval alley with cobblestone street rising between tall colored-stucco houses (ochre / red / yellow), shutters and iron-lamps, climbing-bloom vines',
      'TUSCAN HILL-TOWN ALLEY — Tuscan hill-town alley with sun-baked terracotta walls, weathered wooden shutters, climbing wisteria from every window, stone steps rising into the village',
      'SANTA FE ADOBE STREET — Santa Fe / New Mexico adobe-street with sun-bleached pink-and-tan walls, blue-painted doors and shutters, climbing-bougainvillea cascade, weathered wooden vigas overhead',
      'FEZ MEDINA ALLEY — Fez medina narrow alley with ochre-and-amber plaster walls, ornate carved-wood doors, brass lanterns, climbing-bloom vines, distant minaret silhouette',
      'JAIPUR PINK-CITY ALLEY — Jaipur Old City pink-stucco alley with carved-stone windows (jharokhas), ornate balconies, climbing-bloom cascades from upper-story windows, dusty street below',
      'HOI AN LANTERN STREET — Hoi An Vietnamese ancient-town street with hanging silk-lanterns of every color, bloom-pot clusters at every shop entry, weathered yellow plaster walls, cobblestone',
      'BRUGES CANAL EDGE — Bruges canal-edge street with stepped-gable houses on the opposite bank, swans on the water, bloom-cascades from every balcony, weathered brick-and-stone facades',
      'CHEFCHAOUEN BLUE-CITY ALLEY — Chefchaouen Moroccan blue-city alley with ALL walls painted ultramarine, climbing-rose cascades on the blue walls, white-painted stone steps, weathered wooden doors',
      'AMALFI COAST VILLAGE — Amalfi coast village stairway climbing between yellow-and-orange painted houses, sea visible far below, ceramic-tile street signs, climbing-bougainvillea cascade',
      'BAGAN VILLAGE STREET — Bagan Burmese village street with golden-stupa silhouette in distance, weathered teak-wood houses with bloom-vine-covered porches, dusty unpaved street',
      'GREEK ISLAND ALLEY — Greek-island whitewashed alley with vivid blue-painted doors and shutters, bougainvillea-cascade in fuchsia tumbling over the white walls, paving-stone street',
      'KYOTO GION LANE — Kyoto Gion-district lane with traditional wooden machiya houses, bamboo blinds (sudare) at every window, bloom-pot clusters at every door, paper lanterns glowing at dusk',
    ],
    instructions: `Each entry is ONE specific HISTORIC URBAN SETTING with signature architecture, 25-50 words. Format: "CITY SETTING NAME CAPS — primary architectural style + city-signature detail + bloom-overgrowth note". Vary across the 15 categories. ALWAYS historic / picturesque / weathered. NEVER modern / corporate / American. NO people. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── city-flowers path: architectural_detail (the city's signature element) ───
  bloombot_city_flowers_architectural_detail: {
    format: 'simple',
    theme: `CITY ARCHITECTURAL SIGNATURE DETAILS for the BloomBot city-flowers path. Each entry is ONE specific architectural element typical of historic urban settings — rendered with hyperreal precision and wrapped/draped in bloom-mass. Each entry 20-40 words.

⚠️ MANDATORY — every entry is a TACTILE WEATHERED architectural detail typical of historic urban architecture. The detail is what the bloom-cascade wraps around / drapes over / climbs.

🚫 STRICT BANS:
  • NO modern / contemporary / corporate elements
  • NO duplicate of city_setting (this is specific PIECES, not the whole street)
  • NO humans / figures / hands
  • NO interior elements (cozy territory)

✓ ARCHITECTURAL-DETAIL CATEGORIES:
  A. **BALCONY / RAILING** — wrought-iron Juliet balcony / iron Parisian railing / ornate Mughal jharokha / Andalusian wood-railed balcony
  B. **WINDOW** — weathered wooden shutters / leaded-glass casement / azulejo-tiled window-frame / carved-stone Moorish window
  C. **DOOR** — weathered wooden door with brass knocker / blue-painted Greek door / ornate Moorish carved door / pueblo blue door
  D. **STAIRCASE** — Lisbon tile-fronted staircase / Mediterranean stone steps / Andalusian whitewashed steps / Italian terracotta steps
  E. **ARCH / GATEWAY** — Moorish horseshoe arch / Italian Renaissance arch / cobblestone arched alley / wooden Vietnamese gate
  F. **WALL** — sun-bleached plaster wall / azulejo-tiled wall / weathered brick wall / adobe wall with viga ends
  G. **FOUNTAIN / WELL** — Mediterranean central fountain / Andalusian patio fountain / Moroccan tiled well / Italian marble fountain
  H. **STREET LIGHT** — Parisian gas-lamp / Italian wrought-iron lamp-bracket / Moroccan brass-lantern / Japanese paper-lantern
  I. **PAVEMENT** — cobblestone street / terracotta-tile pavement / azulejo-tile floor / sandstone-cobble / patterned-stone plaza
  J. **AWNING / OVERHANG** — striped fabric awning / wooden-board overhang / canvas market-awning / paper-and-wood eaves
  K. **DETAIL** — brass doorknob / cast-iron grille / wooden-trellis / weathered street-sign / chipped wall-mosaic
  L. **PLANTER / POT** — weathered terracotta pot / hand-painted ceramic planter / wooden window-box / wrought-iron planter

Channel: National Geographic city-detail photography + Wes Anderson set props + Travel + Leisure architecture shots + estate-sale European antiques.`,
    touchpoints: [
      'WROUGHT-IRON JULIET BALCONY — wrought-iron Juliet balcony with curling Victorian scrollwork, climbing-rose vines completely wrapped around the railings, paint-flaking dark-green, French casement-windows behind',
      'WEATHERED WOODEN SHUTTERS — pair of weathered louvered wooden shutters partially closed across a window, paint-peeling sage-green or sun-bleached blue, climbing-bloom vines threading the louvers',
      'BLUE-PAINTED GREEK DOOR — vivid blue-painted wooden Greek-island door with white-painted stone frame, brass knocker tarnished, climbing-bougainvillea in fuchsia cascade around the doorway',
      'LISBON AZULEJO STAIRCASE — Lisbon tile-fronted staircase with blue-and-white azulejo tiles in geometric patterns, climbing-jasmine vines softening the edges of the steps',
      'MOORISH HORSESHOE ARCH — carved-stone Moorish horseshoe-arch entry to a courtyard, intricate geometric carving, climbing-bloom vines on both sides, sun-glow visible through the arch',
      'AZULEJO-TILED WALL — wall of blue-and-white azulejo tiles with intricate hand-painted patterns, weathered with age, climbing-bloom vines partially covering the tiles, a few tiles cracked',
      'ANDALUSIAN PATIO FOUNTAIN — small octagonal Andalusian patio fountain with blue-and-yellow tiled basin, water bubbling gently, climbing-bloom vines on the courtyard walls behind',
      'PARISIAN GAS-LAMP — black wrought-iron Parisian gas-lamp post with curling top, glass globe warm-amber, climbing-bloom vines spiraling up the post, evening glow on cobblestones',
      'COBBLESTONE STREET — wet cobblestone street with petals scattered in the joints, individual rounded stones polished smooth by centuries, soft puddles reflecting the sky',
      'STRIPED-FABRIC AWNING — striped red-and-white fabric awning above a small shop-front, weathered and slightly torn, climbing-bloom vines on the building wall behind the awning',
      'BRASS DOORKNOB ON WEATHERED DOOR — antique brass doorknob on a weathered wooden door, tarnish-patina, a single bloom-petal stuck to the brass, the door slightly ajar',
      'WEATHERED TERRACOTTA POT — large weathered terracotta planter on a stone doorstep, climbing-bloom mass overflowing the pot in a thick cascade, hairline cracks in the terracotta',
      'CHEFCHAOUEN BLUE WALL — ultramarine-blue painted stone wall (Chefchaouen-style) with bloom-cascade in fuchsia tumbling down the wall, white-painted stone steps at the base',
      'CARVED-STONE JHAROKHA — Indian jharokha (overhanging enclosed balcony) of carved pink sandstone with intricate latticework, climbing-bloom vines softening the carving',
      'WROUGHT-IRON GRILLE — wrought-iron security-grille on a narrow window, ornate scrollwork, climbing-jasmine vines threading the bars, weathered Spanish colonial style',
      'PAPER LANTERN HANGING — single red-and-yellow Japanese paper lantern hanging from a weathered wooden eave, soft glow at dusk, climbing-bloom vines on the surrounding wood',
      'PUEBLO BLUE DOOR — sky-blue painted wooden door in a sun-bleached adobe wall, weathered wood, climbing-bougainvillea in coral cascade around the door-frame',
      'CINQUE TERRE PASTEL FACADE — section of a Cinque Terre pastel-painted house facade (peach / coral / butter-yellow) with green wooden shutters, bloom-cascade from a small balcony',
      'BRASS BISTRO TABLE — small wrought-iron bistro table on a Mediterranean cobblestone street, two bentwood chairs, china-cup left behind, climbing-bloom on the wall behind',
      'STONE WELL-EDGE — old stone well-edge in a Mediterranean courtyard, sun-bleached limestone with moss-and-lichen in the cracks, climbing-bloom vines on the surrounding wall',
    ],
    instructions: `Each entry is ONE specific CITY ARCHITECTURAL SIGNATURE DETAIL wrapped in bloom, 20-40 words. Format: "DETAIL NAME CAPS — primary architectural element + material/weathering + bloom-interaction". Vary across the 12 categories. NEVER modern / contemporary. NO duplicate of city_setting. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── city-flowers path: atmospheric_phenomenon (60%-gated city magic) ───
  bloombot_city_flowers_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED CITY ATMOSPHERIC PHENOMENA for the BloomBot city-flowers path. Each entry is ONE specific magic-moment element rendered within the historic city street scene. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon amplifies the city's atmosphere (lived-in / picturesque / atmospheric). Renders as a visible element within the urban frame.

🚫 STRICT BANS:
  • NO humans / pedestrians / figures
  • NO architectural elements (those are city_setting / architectural_detail)
  • NO duplicate of urban content

✓ PHENOMENON CATEGORIES:
  A. **LIGHT MAGIC** — golden-hour rake across the city alley / lamp-glow on cobblestones / sunset light pouring down the staircase / dappled light through awning
  B. **SLEEPING ANIMAL** — sleeping cat curled on a doorstep / dog asleep in a sun-patch / pigeon cluster on a cobblestone / cat on a windowsill
  C. **PARKED OBJECT** — vintage bicycle leaning against a wall / weathered scooter / wooden cart / classic Vespa / old wooden boat (canal city)
  D. **CITY-LIFE-IMPLIED** — laundry hung between balconies / linens on a clothesline / open shutters / market-stall awaiting / cafe-chairs and umbrellas
  E. **WEATHER** — after-rain wet cobblestones reflecting the lights / morning mist in the alley / dew on the bloom-cascades / soft snow on the rooftops
  F. **SOUND IMPLIED** — fountain bubbling visibly / shop-bell hanging silent / wind-chime / phonograph music spilling from an open window
  G. **WINDOW-LIFE** — songbird at a windowsill / canary in a brass cage / open window with curtain breath / bloom on a windowsill from inside
  H. **PETAL / POLLEN** — fallen petals on the cobblestones / petal-trail down a staircase / pollen-cloud in the side-light / petal-fall from a balcony
  I. **REFLECTION** — wet street reflecting the bloom-laden facades / puddle reflecting the architecture / canal reflection / window-glass reflection
  J. **WAITING MOMENT** — bistro table set for two outdoors / market-stall mid-set-up / chair pulled up to a step / two bicycles leaning together
  K. **EVENING-WARM** — golden lantern-glow / candle in a window / cafe-string-light / Vespa headlamp glow at dusk
  L. **POLLINATOR** — solitary hummingbird at a balcony bloom / butterfly in the sunbeam / bee at a windowsill flower

Channel: Wes Anderson set-prop moments + Studio Ghibli Kiki's Delivery Service city details + Pinterest "European charm" boards + Singer Sargent city paintings + Doisneau street-photography moments.`,
    touchpoints: [
      'GOLDEN-HOUR RAKE DOWN ALLEY — late-afternoon golden-hour sunlight raking down the city alley at a low angle, individual cobblestones casting long shadows, bloom-cascades catching the warm glow',
      'SLEEPING CAT ON DOORSTEP — solitary tabby cat curled asleep on a weathered stone doorstep, sun-warmed patch under it, brass doorknob just above it, bloom-cascade around the door-frame',
      'VINTAGE BICYCLE LEANING — single vintage Italian bicycle with woven basket leaning against a sun-bleached pastel wall, climbing-bloom vines on the wall behind it, cobblestones below',
      'LAUNDRY BETWEEN BALCONIES — colorful laundry hanging on a clothesline strung between two balconies across the alley, gentle breeze implied, bloom-cascades from both balconies',
      'AFTER-RAIN WET COBBLESTONES — wet cobblestones reflecting the bloom-laden facades and warm street-lamp glow, individual stones glistening, soft puddles in the joints',
      'FOUNTAIN BUBBLING VISIBLY — small Mediterranean / Andalusian fountain bubbling water visibly in the courtyard center, ripples on the basin surface, blooms around the rim',
      'SONGBIRD AT WINDOWSILL — solitary songbird (warbler / sparrow / European robin) perched on a windowsill in a pause, head tilted, looking at the street below, blooms in a pot beside it',
      'PETAL-TRAIL DOWN STAIRCASE — trail of fallen petals scattered down a Lisbon-tile staircase, individual petals visible on each tread, a few stuck to the riser-tiles',
      'WET-STREET REFLECTION — wet cobblestone street reflecting the bloom-laden facade and warm gas-lamp glow, the reflection slightly blurred by puddle ripples, atmospheric',
      'BISTRO TABLE SET FOR TWO — small bistro table on the cobblestones outside a cafe, two bentwood chairs, espresso cups on the table, bloom-cascade from the wall behind',
      'GOLDEN LANTERN GLOW AT DUSK — single Parisian / Moroccan / Japanese lantern glowing warm-amber against the dusk-blue sky, bloom-cascade around the lantern bracket',
      'HUMMINGBIRD AT BALCONY BLOOM — solitary jewel-iridescent hummingbird hovering at a bloom-cluster spilling from a wrought-iron balcony, wings a transparent blur',
      'PIGEON CLUSTER ON COBBLES — small cluster of pigeons gathered in a sun-patch on the cobblestones, individual birds slightly out of focus, the rest of the street empty',
      'OPEN WINDOW WITH CURTAIN BREATH — open window with a lace curtain stirring gently in the breeze, glimpse of interior beyond, bloom-cluster on the windowsill in foreground',
      'CLASSIC VESPA PARKED — classic mint-green Vespa scooter parked at the edge of a Mediterranean cobblestone street, weathered chrome details, bloom-cascade from the wall behind',
      'WOODEN BOAT IN CANAL — small weathered wooden boat moored at the bottom of a Venetian / Bruges canal-side staircase, water reflecting the bloom-cascaded palazzo above',
      'MORNING MIST IN ALLEY — soft morning mist hanging low in the city alley between bloom-laden walls, atmospheric depth softening the deep end, sun starting to break through',
      'CAT ON WINDOWSILL — solitary cat sitting on a window-sill watching the empty street below, ears alert, sun-warmed patch on the sill, bloom-pot beside the cat',
      'WIND-CHIME IN SUN — wind-chime hanging from a wooden-eave catching the sun, soft tinkle implied, bloom-cascade from the eave around it',
      'TWO BICYCLES LEANING TOGETHER — two vintage bicycles leaning against each other propped against a sun-bleached plaster wall, climbing-bloom vines on the wall behind',
    ],
    instructions: `Each entry is ONE specific CITY ATMOSPHERIC magic-moment, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position in city scene + lighting/sensory detail". Vary across the 12 categories. NO humans. NO architectural duplicates. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── reclaim path: ruin_type (abandoned structure being reclaimed) ───
  bloombot_reclaim_ruin_type: {
    format: 'simple',
    theme: `ABANDONED-STRUCTURE RECLAIM SETTINGS for the BloomBot reclaim path. Each entry is ONE specific historic / ancient ABANDONED HUMAN STRUCTURE in deep disrepair, being consumed by flowers. Mood is AWE + MELANCHOLY + TRIUMPHANT NATURE — NEVER horror. Each entry 25-50 words.

⚠️ MANDATORY — every entry is a RECOGNIZABLE abandoned structure (the viewer instantly knows what it WAS) in deep disrepair. NEVER ominous / spooky / horror — the mood is reverent / awe-struck / nature-has-won-in-beauty.

🚫 STRICT BANS:
  • NO modern / corporate / sleek buildings
  • NO ominous / spooky / haunted / horror / dark-fantasy vocabulary
  • NO active / inhabited buildings (these are ABANDONED)
  • NO conservatory glass-and-iron (conservatory)
  • NO living cities (city-flowers)
  • NO interiors that aren't ruined (cozy)
  • NO landscapes without architecture (landscape)
  • NO archways/passages as the FRAMING (garden-walk) — but ruin-archways as the SCENE are FINE
  • NO surreal / impossible
  • NO humans / ghosts / hooded figures

✓ RUIN-TYPE CATEGORIES:
  A. **CLASSICAL TEMPLE / TEMPLE-RUIN** — Greek temple half-collapsed / Roman temple / Egyptian colonnade
  B. **CATHEDRAL / ABBEY** — half-sunken Gothic cathedral / abandoned abbey / roofless chapel
  C. **MAYAN / KHMER / ANGKOR** — Mayan pyramid cracked open / Angkor temple / Khmer jungle temple
  D. **CASTLE / FORTRESS** — moss-covered castle ruin / abandoned tower / collapsed keep
  E. **GREENHOUSE / CONSERVATORY (rusted)** — rusted abandoned greenhouse with broken panes / collapsed Victorian glasshouse
  F. **LIBRARY / SCHOOL** — forgotten library with collapsed walls / abandoned schoolhouse with overgrown desks
  G. **AMUSEMENT / CARNIVAL** — abandoned amusement-park carousel / overgrown ferris-wheel / abandoned theatre
  H. **MARITIME** — wrecked ocean liner on a beach / shipwreck on rocks / abandoned lighthouse on a cliff
  I. **INDUSTRIAL** — abandoned factory / overgrown train station / Soviet-era industrial complex / abandoned bridge
  J. **AQUEDUCT / INFRASTRUCTURE** — Roman aqueduct / abandoned viaduct / overgrown stone bridge
  K. **PALACE / MANSION** — abandoned palace / forgotten mansion / overgrown stately home
  L. **AMPHITHEATRE / COLISEUM** — overgrown Roman amphitheatre / abandoned Greek theatre
  M. **VILLAGE / TOWN** — abandoned medieval village / overgrown stone-village / forgotten hamlet
  N. **WATCHTOWER / OBSERVATORY** — abandoned watchtower / overgrown observatory / forgotten beacon
  O. **MILL / WINDMILL** — abandoned stone mill / overgrown windmill / forgotten gristmill

Lineage to channel: Studio Ghibli "Castle in the Sky" reveal + Ta Prohm jungle temple (Angkor) + Pripyat Chernobyl reclamation (without the disaster mood) + Greek archaeological-photography + Roman ruin paintings by Piranesi + cottagecore-meets-ruin Pinterest boards.`,
    touchpoints: [
      'GREEK MARBLE TEMPLE HALF-COLLAPSED — half-collapsed Greek marble temple with three columns still standing and the pediment broken, climbing-rose vines consuming the columns, fallen drum-segments scattered in a bloom-meadow',
      'ANGKOR-STYLE JUNGLE TEMPLE — Angkor-style stone temple with massive strangler-fig roots embracing the carved-stone walls, climbing-bloom vines softening the apsara-carvings, sunlight streaming through cracked tower-roof',
      'MAYAN PYRAMID CRACKED OPEN — Mayan stepped-pyramid with one wall collapsed showing the interior, climbing-bloom vines spilling from the crack, jungle-mass at the base, sun-shafts through the opening',
      'HALF-SUNKEN GOTHIC CATHEDRAL — Gothic cathedral with the roof collapsed and the eastern wall fallen, climbing-bloom vines wrapping the remaining columns and arches, sky visible through the open roof',
      'RUSTED ABANDONED GREENHOUSE — Victorian-era greenhouse with rusted iron framework, many glass panes shattered or missing, bloom-mass having consumed the interior and spilled out through the broken panes',
      'FORGOTTEN LIBRARY WITH COLLAPSED WALLS — forgotten library with two walls collapsed, books still on the shelves visible through bloom-cascades, fallen books on the floor, climbing-vines on the remaining shelves',
      'ABANDONED CAROUSEL — abandoned amusement-park carousel with the horses still on it but rust-streaked, the canopy fabric tattered, climbing-bloom vines wrapping every horse, bloom-mass at the base',
      'WRECKED OCEAN LINER ON BEACH — wrecked early-20th-century ocean liner half-sunk in beach-sand, hull rust-streaked and barnacle-encrusted, climbing-bloom vines on the upper decks, dune-grass at the base',
      'ABANDONED LIGHTHOUSE ON CLIFF — abandoned stone lighthouse on a cliff-edge, the upper structure cracked, climbing-bloom vines spiraling up the tower, sea-mist around the base, gulls overhead',
      'ROMAN AQUEDUCT IN BLOOM-MEADOW — section of Roman aqueduct stretching across a sunlit bloom-meadow, several arches collapsed, climbing-bloom vines on the standing arches, sun-shafts through the gaps',
      'MOSS-COVERED CASTLE RUIN — moss-covered medieval castle ruin with one tower still standing tall, walls partially collapsed, climbing-bloom vines on the stone, drawbridge gone',
      'ROOFLESS ABANDONED ABBEY — abandoned abbey with the roof completely gone but the nave-columns still standing, climbing-bloom vines on the columns, sky visible above, fallen stones on the floor',
      'OVERGROWN ROMAN AMPHITHEATRE — overgrown Roman amphitheatre with the seating-tiers cracked and bloom-mass filling the rows, the arena-floor a bloom-meadow, sky visible above the open structure',
      'ABANDONED STONE MILL — abandoned stone mill with the waterwheel half-rotted, climbing-bloom vines on the mill-stone walls, stream still flowing past the silent wheel, bloom-meadow surrounding',
      'FORGOTTEN PALACE INTERIOR — forgotten palace interior with collapsed ceiling, bloom-mass cascading from above, chandelier still hanging twisted, ornate floor-tiles visible through petal-carpet',
      'OVERGROWN WATCHTOWER — abandoned medieval stone watchtower with the upper crenellations crumbled, climbing-bloom vines spiraling up the tower-walls, sky visible through arrow-slits',
      'ABANDONED MEDIEVAL VILLAGE — abandoned medieval stone-village with several houses still standing in disrepair, cobblestone street overgrown, climbing-bloom vines on every house',
      'SHIPWRECK ON ROCKS — wooden-hulled shipwreck on rocks with sea-mist around the hull, climbing-vines on the deck visible above the waterline, sun-shafts through broken sails-rigging',
      'KHMER VINE-CURTAINED TEMPLE — Khmer-style stone temple with vine-curtains entirely covering the carvings, strangler-fig roots embracing the structure, jungle-mass closing in',
      'OVERGROWN VICTORIAN MANSION — abandoned Victorian mansion with the roof partially collapsed, climbing-bloom vines on the ornate facade, broken windows with bloom-cascades spilling out',
    ],
    instructions: `Each entry is ONE specific ABANDONED HUMAN STRUCTURE being reclaimed by flowers, 25-50 words. Format: "RUIN NAME CAPS — primary structure + decay signature + bloom-consumption note + awe-mood". Vary across the 15 categories. ALWAYS reverent / awe-struck mood, NEVER ominous / horror. NO humans. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── reclaim path: decay_anchor (specific decay focal-point) ───
  bloombot_reclaim_decay_anchor: {
    format: 'simple',
    theme: `DECAY ANCHORS for the BloomBot reclaim path. Each entry is ONE specific decay focal-point detail within an abandoned structure — rendered with hyperreal time-worn precision. Each entry 20-40 words.

⚠️ MANDATORY — every entry is a TACTILE DECAY DETAIL typical of long-abandoned structures. The detail is the bloom-mass's visual focal-point convergence.

🚫 STRICT BANS:
  • NO humans / figures / skeletons / corpses (this is NOT horror)
  • NO active human presence (no fresh trash / vandalism / modern objects)
  • NO duplicate of ruin_type content (this is specific DETAIL not whole structure)
  • NO ominous / spooky / horror elements (no gravestones, no skulls in the foreground)

✓ DECAY-ANCHOR CATEGORIES:
  A. **CRACKED COLUMN** — broken marble column / cracked stone pillar / collapsed Doric column with capital fallen beside
  B. **FALLEN STATUE** — weathered marble statue toppled on its side / broken angel sculpture / weathered carving partial
  C. **SHATTERED WINDOW** — empty stained-glass window-frame with no glass / shattered Gothic rose-window / broken arched window
  D. **CRACKED-OPEN DOME** — collapsed dome with sky visible / cracked vaulted ceiling / shattered cupola
  E. **GROWING-IN-MASONRY ROOTS** — visible roots cracking the masonry from inside / tree-root splitting a stone wall / fig-root strangling a column
  F. **WEATHERED INSCRIPTION** — barely-legible carved-stone inscription / weathered Latin text / faded carved-name
  G. **OVERTURNED FURNITURE** — overturned wooden chair / collapsed library shelf with books / fallen chandelier / rotted bench
  H. **RUSTED METAL** — rusted iron gate hanging on one hinge / rust-streaked metal railing / weathered iron grille
  I. **CRACKED FLAGSTONES** — cracked-flagstone floor with bloom-mass growing through the cracks / broken mosaic floor / weathered tile-pattern emerging
  J. **CRUMBLED ARCH** — half-collapsed arch with the keystone fallen / partial arch with broken voussoirs / Roman arch in decay
  K. **STAIRCASE OF DECAY** — broken stone staircase with risers crumbled / spiral-staircase missing treads / collapsed mezzanine stairs
  L. **HOLLOW OBJECT** — empty rusted bell / silent pipe-organ pipes / rusted machinery / weathered statue niche
  M. **WEATHERED RELIEF** — high-relief carving worn smooth by centuries / bas-relief with bloom-vines softening the figures / weathered frieze

Channel: Piranesi etchings of Roman ruins + Caspar David Friedrich romantic-ruin paintings + Studio Ghibli ruin-detail framing + cottagecore-meets-archaeology Pinterest details.`,
    touchpoints: [
      'BROKEN MARBLE COLUMN — single broken Doric marble column with the capital fallen beside it, weathered chunks scattered, climbing-rose vines wrapping the standing portion, bloom-meadow surrounding',
      'TOPPLED MARBLE STATUE — weathered marble statue (classical female / cherub / muse) toppled on its side in the foreground, half-buried in bloom-mass, face still serene and intact',
      'EMPTY ROSE-WINDOW FRAME — empty Gothic rose-window with no glass remaining, climbing-rose vines threading the stone tracery, sky visible through the opening, sun-shafts pouring through',
      'COLLAPSED DOME WITH SKY — cracked-open dome of the structure with sky visible through the gap, climbing-bloom vines spilling from the broken ribs of the dome',
      'TREE-ROOT SPLITTING STONE — visible massive tree-root splitting a stone wall from inside, the masonry cracked outward by the root pressure, climbing-bloom vines around the crack',
      'WEATHERED LATIN INSCRIPTION — weathered carved-stone Latin inscription on a stone block, the letters barely legible through moss and bloom-vines, the rest of the block half-buried',
      'OVERTURNED WOODEN CHAIR — overturned weathered wooden chair in the ruins interior, half-buried in petal-carpet, climbing-bloom vines threading the legs',
      'RUSTED IRON GATE — rusted wrought-iron gate hanging on one hinge at the ruins entrance, climbing-rose vines on the bars, the gate frozen mid-swing',
      'CRACKED-FLAGSTONE FLOOR — broken-flagstone floor of the ruin with bloom-mass growing through the cracks between stones, individual flagstones rendered with hyperreal weathering',
      'HALF-COLLAPSED ARCH — half-collapsed stone arch with the keystone fallen and visible on the ground, broken voussoirs in the bloom-mass, climbing-vines on the remaining portion',
      'BROKEN STAIRCASE — broken stone staircase with several risers crumbled or missing, climbing-bloom vines on every standing step, fallen stones at the base',
      'EMPTY RUSTED BELL — empty rusted bronze bell hanging silent in a broken belltower, climbing-vines threading the bell-mouth, sun-shafts through the broken belltower roof',
      'WEATHERED FRIEZE — high-relief carved frieze worn smooth by centuries, bloom-vines softening the figures, the carving still legible enough to recognize the subject',
      'COLLAPSED LIBRARY SHELF — collapsed wooden library shelf with books fallen in a pile, several books still on the floor with bloom-vines threading them, weathered leather bindings',
      'PARTIAL-MOSAIC FLOOR — partial mosaic floor emerging through the bloom-mass and dirt, intricate tile-pattern visible in patches, climbing-bloom vines softening the edges',
      'FALLEN BELL — single fallen bronze bell on the cobblestones beside the broken belltower, the bell cracked open from the fall, bloom-vines around it',
      'CHANDELIER TWISTED ON FLOOR — collapsed crystal chandelier twisted on the ruined floor of a palace interior, individual crystals still glinting, climbing-bloom vines threading the frame',
      'RUSTED MACHINERY HALF-BURIED — rusted abandoned industrial machinery half-buried in the bloom-overgrowth, individual gears and pipes visible through the green-and-bloom mass',
      'WEATHERED STATUE NICHE EMPTY — empty stone wall-niche where a statue once stood, now occupied by a thick bloom-cluster overflowing, the niche-frame weathered and cracked',
      'COLLAPSED WOODEN BEAM — fallen weathered wooden roof-beam lying diagonal across the ruins interior, climbing-bloom vines on the beam, mossy at the joints',
    ],
    instructions: `Each entry is ONE specific TACTILE DECAY DETAIL within a ruin, 20-40 words. Format: "DECAY ANCHOR NAME CAPS — primary decay element + material/weathering + bloom-interaction note". Vary across the 13 categories. ALWAYS reverent (never horror). NO humans / skeletons. NO active vandalism. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── reclaim path: atmospheric_phenomenon (60%-gated magic) ───
  bloombot_reclaim_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED RECLAIM ATMOSPHERIC PHENOMENA for the BloomBot reclaim path. Each entry is ONE specific awe-amplifying magic-moment element rendered within the ruin scene. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon amplifies the AWE + MELANCHOLY + TRIUMPHANT-NATURE mood. Never ominous / horror. The reclaiming life is the subject.

🚫 STRICT BANS:
  • NO humans / figures / ghosts
  • NO architectural elements (those are ruin_type / decay_anchor territory)
  • NO ominous / spooky / horror elements
  • NO duplicate of ruin content
  • NO surreal physics

✓ PHENOMENON CATEGORIES:
  A. **GOD-RAYS THROUGH BROKEN ROOF** — volumetric sun-shafts pouring through the collapsed dome / broken roof onto specific bloom-patches
  B. **MIST / VAPOR** — soft morning mist in the ruin interior / vapor rising from the bloom-mass / atmospheric haze
  C. **PEACEFUL WILDLIFE** — single deer grazing in the ruin / fox sleeping in a sun-patch / owl in a broken window / butterfly on a fallen statue
  D. **POLLINATOR** — hummingbird hovering at a column-bloom / bee-cluster at a fallen stone / butterfly migration through the broken arch
  E. **FIREFLY-CLOUD** — soft cloud of fireflies at dusk in the ruin interior / glow-cloud
  F. **GOLDEN-HOUR-DRAMA** — late-afternoon golden-hour light setting the ruin ablaze / sunset light through broken windows
  G. **TWILIGHT-MOON** — full moon rising visible through the broken roof / first stars through the open dome
  H. **PETAL-FALL** — petal-fall drifting from the upper bloom-cascades into the ruin interior
  I. **POLLEN-CLOUD** — golden pollen-cloud dispersing in the god-ray sun-shafts
  J. **REFLECTION** — water-pool reflection in the ruin interior reflecting the bloom-laden architecture
  K. **DEW-CASCADE** — fine dewdrops on every petal of the climbing-bloom cascades around the ruin, sun catching them
  L. **SEED-DOWN DRIFT** — seed-pod fluff (dandelion / cottonwood / milkweed) drifting through the ruin in slow-motion

Channel: Studio Ghibli "Castle in the Sky" ruin-reveal moments + Caspar David Friedrich romantic-ruin painting atmosphere + Tarkovsky "Stalker" wonder-not-dread + David Attenborough nature-reclamation footage.`,
    touchpoints: [
      'VERTICAL GOD-RAYS THROUGH COLLAPSED ROOF — multiple vertical sun-shafts pouring through the collapsed roof of the ruin onto specific bloom-patches below, vapor-laden beams visible in the still air',
      'MORNING MIST IN RUIN INTERIOR — soft morning mist coiling through the ruin interior in still air, vapor softening the depth, sun starting to break through the broken roof',
      'SINGLE DEER GRAZING IN RUIN — single solitary deer grazing in the ruins nave / interior, head down on the bloom-meadow floor, peaceful, the only living motion in the frame',
      'OWL IN BROKEN WINDOW — solitary owl perched in a broken arched window of the ruin, eyes facing the viewer, head tilted, blooms cascading around the window-frame',
      'FIREFLY CLOUD AT DUSK — soft cloud of fireflies suspended at dusk within the ruin interior, hundreds of green-pulse lights at every depth between the columns',
      'GOLDEN-HOUR FIRE-LIGHT — late-afternoon golden-hour light setting the ruins remaining walls ablaze with warm-amber glow, every weathered stone catching gold',
      'FULL MOON THROUGH BROKEN ROOF — full silver moon visible through the broken roof of the ruin, soft moonlight bathing the bloom-mass below, the rest in cool blue-shadow',
      'PETAL-FALL DRIFTING INSIDE — drifting petal-fall from the upper climbing-bloom cascades into the ruins interior, petals suspended at every depth in the still air',
      'POLLEN-CLOUD IN GOD-RAYS — golden pollen-cloud dispersing in the volumetric god-ray sun-shafts, individual pollen-motes visible in the warm light',
      'WATER-POOL REFLECTION INTERIOR — small water-pool in the ruins interior reflecting the bloom-laden architecture above, mirror-still surface broken by a single drop',
      'DEW-CASCADE EVERYWHERE — fine dewdrops on every petal of the climbing-bloom cascades wrapping the ruin, the entire structure scintillating with reflected morning light',
      'SEED-DOWN DRIFT — cottonwood / dandelion seed-down drifting through the ruin in slow-motion, hundreds of seed-fluff suspended in the air',
      'HUMMINGBIRD AT COLUMN-BLOOM — solitary jewel-iridescent hummingbird hovering at a bloom-cluster on a ruined column, wings a transparent blur',
      'BUTTERFLY ON FALLEN STATUE — solitary butterfly perched on the cheek of a fallen marble statue half-buried in bloom, wings catching the sun',
      'SOFT-VAPOR FROM POOL — soft vapor rising from a small reflecting pool in the ruin interior, the steam curling through the volumetric light',
      'FOX ASLEEP IN SUN-PATCH — solitary red fox curled asleep in a sun-warmed patch on the ruins floor, surrounded by bloom-mass, ears relaxed',
      'TWILIGHT FIRST-STAR — first star of evening visible through the open broken dome of the ruin, twilight sky filling the opening, blooms below in cool shadow',
      'BUTTERFLY CLOUD THROUGH ARCH — cloud of butterflies passing through a broken arch of the ruin in soft fluttering motion, wings catching the back-light',
      'POLLEN-MOTE GALAXY — vast suspended pollen-mote galaxy filling the entire ruin interior, dust-motes individually visible in slanting light, dreamlike density',
      'BIRD-FLOCK ROOSTING — small flock of small birds (sparrows / starlings) roosting on the upper ledge of a broken wall, evening light, the rest of the ruin quiet',
    ],
    instructions: `Each entry is ONE specific RECLAIM ATMOSPHERIC magic-moment, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position in ruin + lighting note". Vary across the 12 categories. ALWAYS reverent (never horror / spooky). NO humans / ghosts. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── bloom-spirit DNA: hair_floral (lush flower-waterfall through hair) ───
  bloombot_bloom_spirit_hair_floral: {
    format: 'simple',
    theme: `COLOR-THEMED HAIR-FLORAL ARRANGEMENTS for the BloomBot bloom-spirit path. Each entry is ONE specific COLOR-THEMED MULTI-SPECIES floral arrangement OVERWHELMING her hair. Each entry 30-70 words.

⚠️ ABSOLUTE VOLUME MANDATE — every entry describes an EXTREME LUSH OVERWHELMING quantity (HUNDREDS to THOUSANDS) of MULTIPLE different flower species in a coordinated COLOR THEME — like a master Pre-Raphaelite painter spent days arranging an entire flower-shop's worth of blooms into one woman's hair. The hair-flower volume EXCEEDS the dress-flower volume. The hair is a CASCADING FLOWER-WATERFALL.

⚠️ MULTI-SPECIES MANDATE — every entry uses 3-6 DIFFERENT flower species woven together (NEVER a single-species entry like 'just dahlias'). Mix species for visual richness.

⚠️ COLOR-THEME MANDATE — every entry has a clear COLOR THEME pulling the flowers together:
  • SUNSET — red + orange + pink + coral + gold + amber
  • TWILIGHT PURPLES — lavender + violet + blue + periwinkle + indigo
  • BLUSH PINKS — soft pink + blush + cream + ivory + pale-rose
  • MONOCHROME WHITE — white + cream + ivory + pearl + soft-blush hints
  • RAINBOW EXPLOSION — full spectrum (red/orange/yellow/green/blue/purple) wildly mixed
  • PINK + WHITE COTTAGE — soft pinks + whites + creams
  • PURPLE + WHITE ROYAL — purples + whites + violet accents
  • CORAL + PEACH PARADISE — corals + peaches + warm sunset tones
  • DEEP BURGUNDY + WINE — burgundy + plum + maroon + dark crimson
  • GOLD + AMBER + COPPER — golds + ambers + coppers + warm bronze
  • OCEAN COOL — aqua + teal + ice-blue + seafoam + pearl-white
  • EMERALD FOREST — green-flowers + white + pale-yellow + soft lavender
  • MAGIC PASTEL CANDY — pastel pink + lilac + mint + butter-yellow + sky-blue
  • TROPICAL BOLD — hot pink + tropical-orange + magenta + bright-yellow
  • AUTUMN HARVEST — rust + russet + ochre + burnt-orange + ruby
  • DUSK FIRE — deep red + orange + crimson + gold

✓ EXAMPLE FORMAT:
"SUNSET FIRE HAIR — OVERWHELMING cascade of hundreds of red roses, coral peonies, orange ranunculus, yellow daisies, and golden marigolds woven from crown to tips, sunset-spectrum cascading through every wave, hair barely visible under the warm tidal-wave of color"

🚫 BANNED:
  • Single-species arrangements (boring)
  • The phrase "flower crown" / "halo" / "wreath" / "thick cap" / "floral hat" — all FORBIDDEN
  • "Minimal" / "delicate" / "subtle" / "few" — FORBIDDEN
  • Any language suggesting fewer than HUNDREDS of flowers

Channel: Pre-Raphaelite Persephone-buried-in-flowers + Pinterest "extreme lush floral bridal hair" + multi-color floral-explosion editorial + Frida Kahlo headpieces × 100x volume.`,
    touchpoints: [
      'SUNSET FIRE OVERWHELMING — cascade of hundreds of red roses + coral peonies + orange ranunculus + yellow daisies + golden marigolds woven from crown to tips, sunset spectrum cascading through every wave, hair buried under warm tidal-wave',
      'TWILIGHT PURPLE STORM — hundreds of lavender + violet wisteria + blue bluebells + periwinkle + indigo iris woven through every braid, deep twilight purple-blue tidal-wave cascading from crown to waist',
      'BLUSH PINK CASCADE — overwhelming arrangement of soft pink peonies + blush roses + cream ranunculus + ivory jasmine + pale rose-cabbage roses cascading through every section, hair drenched in blush florals',
      'MONOCHROME WHITE FLOOD — hundreds of white roses + cream gardenias + ivory peonies + pearl-white jasmine + pale-blush hellebore plastered through every wave, snow-white floral cascade',
      'RAINBOW EXPLOSION — wild rainbow of hundreds of red poppies + orange marigolds + yellow daisies + green hellebore + blue cornflowers + purple anemones + violet sweet-pea woven through every inch, full-spectrum mass cascade',
      'PINK AND WHITE COTTAGE — soft pink garden roses + cream-white peonies + pale blush ranunculus + white jasmine + tiny pink gypsophila woven in extreme abundance from crown to tips',
      'PURPLE AND WHITE ROYAL — hundreds of royal purple irises + white roses + violet anemones + pearl gardenias + lavender sweet-pea cascading through every braid, dramatic purple-and-white tidal-wave',
      'CORAL PEACH PARADISE — overwhelming coral peonies + peach garden roses + apricot ranunculus + warm sunset dahlias + golden marigolds woven through hair, warm tropical paradise cascade',
      'DEEP BURGUNDY WINE STORM — hundreds of burgundy dahlias + plum cosmos + maroon roses + dark-crimson ranunculus + black-purple calla cascading from crown to tips, dramatic wine-spectrum tidal-wave',
      'GOLD AMBER COPPER FIRE — golden marigolds + amber rudbeckia + copper dahlias + warm yellow daisies + bronze-orange chrysanthemums woven in massive abundance through every wave',
      'OCEAN COOL CASCADE — aqua hydrangeas + teal sea-holly + ice-blue forget-me-nots + seafoam-green hellebore + pearl-white roses plastered through hair, cool ocean-spectrum tidal-wave',
      'EMERALD FOREST HAIR — green hellebore + white daisies + pale-yellow primrose + soft lavender sweet-pea + emerald-green succulents woven in extreme abundance, forest-spirit floral cascade',
      'PASTEL CANDY EXPLOSION — pastel pink + lilac + mint + butter-yellow + sky-blue tiny blooms in OVERWHELMING density through every braid, soft cotton-candy floral cascade',
      'TROPICAL BOLD STORM — hot pink hibiscus + tropical orange marigolds + magenta bougainvillea + bright yellow plumeria + saturated coral ginger woven in tropical floral-storm density',
      'AUTUMN HARVEST CASCADE — rust chrysanthemums + russet dahlias + ochre marigolds + burnt-orange roses + ruby-wine cosmos in massive autumn cascade through hair',
      'DUSK FIRE BLAZE — deep red roses + orange peonies + crimson ranunculus + gold marigolds + warm-amber dahlias woven in extreme dusk-fire spectrum cascade',
      'BLUE AND WHITE COASTAL — sky-blue hydrangeas + white roses + ice-blue forget-me-nots + pearl-white jasmine + soft cornflower-blue cascading in coastal-spectrum overwhelming mass',
      'PINK AND GOLD ROMANCE — soft pink garden roses + gold-amber ranunculus + cream peonies + pale rose-gold dahlias + pearl-pink sweet-pea woven in romantic overwhelming cascade',
      'VIOLET AND CREAM ETHEREAL — violet iris + cream-white roses + lavender peonies + pearl-white anemones + soft violet sweet-pea overwhelming through every section',
      'CHERRY BLOSSOM EXPLOSION — pink + white cherry blossom petals in MASSIVE thousand-petal cascade through every wave, supplemented with rose-pink camellias + cream magnolias',
      'RED AND BURGUNDY DRAMA — deep red roses + burgundy dahlias + crimson peonies + dark-wine cosmos + black-red ranunculus woven in dramatic wine-cascade',
      'YELLOW MEADOW SUN — yellow daisies + golden marigolds + butter-yellow ranunculus + cream-yellow daffodils + sunshine-yellow chrysanthemums in massive sun-spectrum cascade',
      'LILAC AND BABY-BLUE SPRING — lilac + baby-blue + pale-lavender + soft periwinkle + sky-blue forget-me-nots woven in soft-pastel spring cascade through hair',
      'TEAL AND ROSE-GOLD VINTAGE — teal hydrangeas + rose-gold dahlias + dusty-pink roses + warm copper ranunculus + cream-white peonies woven in vintage-romantic cascade',
      'BLACK ROSE AND WHITE GOTH — dark-burgundy black-roses + white roses + deep-violet anemones + ivory gardenias + pearl-pink hellebore in dramatic goth-romance cascade',
      'PEACH AND CREAM SOFT — peach garden roses + cream peonies + soft apricot ranunculus + pearl-white jasmine + warm-cream camellias in extreme soft-peach cascade',
      'MAGENTA AND ORANGE BOLD — hot magenta dahlias + bright orange marigolds + fuchsia peonies + coral ranunculus + saturated tropical bougainvillea in extreme bold cascade',
      'COOL MINT AND WHITE — mint-green hellebore + white roses + pale-green succulents + ivory jasmine + soft seafoam ranunculus in cool mint cascade',
      'BUTTER YELLOW AND BLUSH — butter-yellow daisies + blush garden roses + cream-yellow ranunculus + soft pink peonies + pearl-yellow chrysanthemums woven in soft pastel cascade',
      'INDIGO AND VIOLET DEEP — indigo irises + violet wisteria + deep-purple anemones + dark-violet sweet-pea + plum dahlias in dramatic deep-purple cascade',
      'ORANGE AND CORAL TROPICAL — bright orange marigolds + coral hibiscus + tropical-peach plumeria + warm orange-yellow ranunculus + sunset-spectrum bougainvillea in tropical cascade',
      'BLUSH AND DUSTY-PINK ROMANCE — soft blush garden roses + dusty-pink peonies + pale pink ranunculus + cream-blush cabbage roses + delicate baby-pink sweet-pea in romantic overwhelming cascade',
      'WHITE AND CHAMPAGNE BRIDAL — white roses + cream peonies + champagne-blush ranunculus + ivory dahlias + pearl-white gardenias woven in bridal cascade with rose-gold highlights',
      'EMERALD AND GOLD LUXE — emerald-green hellebore + golden marigolds + amber dahlias + cream-gold ranunculus + green-and-gold succulents in luxe cascade',
      'PEACH AND LAVENDER DREAM — peach garden roses + lavender sweet-pea + apricot ranunculus + soft pale-purple anemones + cream-peach peonies in dreamy pastel cascade',
      'CRIMSON AND BLACK DRAMATIC — crimson roses + dark-burgundy dahlias + black-purple anemones + deep red ranunculus + dark crimson peonies in dramatic crimson cascade',
      'POWDER BLUE AND PINK FAIRY — powder-blue forget-me-nots + soft pink peonies + pale-rose ranunculus + cream-white roses + baby-blue hydrangeas in soft fairy cascade',
      'AMBER AND COPPER METALLIC — amber dahlias + copper-orange chrysanthemums + warm-bronze ranunculus + gold-amber marigolds + russet roses in metallic warm cascade',
      'NEON PINK AND PURPLE — bright neon-pink garden roses + electric-purple anemones + magenta dahlias + hot-pink peonies + saturated-violet sweet-pea in vibrant neon cascade',
      'CHARCOAL AND IVORY GOTHIC — charcoal-grey hellebore + ivory roses + black-violet anemones + cream-grey ranunculus + pale-ivory dahlias in gothic-romantic cascade',
      'TURQUOISE AND CORAL TROPICAL — turquoise hydrangeas + coral hibiscus + aqua-blue forget-me-nots + warm coral peonies + bright sea-glass green succulents in tropical cascade',
      'PALE PINK AND GREEN GARDEN — pale-pink garden roses + emerald-green hellebore + soft mint succulents + cream-pink peonies + leafy-green eucalyptus accents in fresh garden cascade',
      'RUBY AND GOLD ROYAL — ruby-red roses + gold-amber dahlias + crimson ranunculus + warm-gold marigolds + dark-red peonies in royal cascade',
      'MIDNIGHT BLUE AND SILVER — midnight-blue irises + silver-grey hellebore + dark-violet anemones + ice-blue forget-me-nots + pearl-silver ranunculus in mystical cascade',
      'CANDY APPLE RED AND CREAM — candy-apple red roses + cream-white peonies + crimson ranunculus + ivory gardenias + pearl-pink sweet-pea in classic romance cascade',
      'SUNRISE PEACH GOLD ROSE — sunrise-peach garden roses + golden-amber dahlias + rose-pink peonies + cream-white ranunculus + warm-peach plumeria in sunrise cascade',
      'NAVY AND BURGUNDY AUTUMN — navy-blue irises + burgundy dahlias + dark-violet anemones + deep-crimson ranunculus + maroon peonies in autumn-evening cascade',
      'BABY PINK AND CREAM SOFT — baby-pink roses + cream peonies + pale-blush ranunculus + ivory ranunculus + pearl-pink hellebore in soft cottage cascade',
      'BRONZE AND PLUM AUTUMN — bronze-orange chrysanthemums + plum dahlias + ruby-wine cosmos + amber ranunculus + dark-russet peonies in deep autumn cascade',
      'IRIDESCENT FAIRY PASTEL — iridescent pastel mix of mint + lavender + baby-blue + cream-yellow + pearl-pink in extreme fairy-cascade with hundreds of tiny glistening blooms',
    ],
    instructions: `Each entry is ONE COLOR-THEMED MULTI-SPECIES OVERWHELMING HAIR-FLORAL arrangement, 30-70 words. Format: "COLOR-THEME NAME CAPS — overwhelming cascade of [3-6 named flower species] in [color theme], cascading through every section of hair, hair buried under the floral mass". MULTI-SPECIES + COLOR-THEMED + OVERWHELMING density. Never single-species. The phrase "flower crown" is FORBIDDEN. Output as a NUMBERED list, one per line.`,
  },

  bloombot_bloom_spirit_skin_tone: {
    format: 'simple',
    theme: `SKIN TONE DESCRIPTORS for the BloomBot bloom-spirit path. Each entry is ONE specific skin tone description that can pair with any race. 15-30 words.

⚠️ MANDATORY — full range from fair to ebony, anime-painterly register (cel-shaded painted skin treatment, glow accents allowed). NEVER realistic-photoreal-skin-pore description.

🚫 STRICT BANS:
  • NO photoreal-pore description
  • NO race-specific (race is a separate axis)
  • NO face-feature description (just SKIN tone)
  • NO body-shape description

✓ TONE RANGE — DISTRIBUTE EVENLY across the full spectrum:
  • Fair: porcelain / ivory / rose-pale / cream
  • Light: peach / wheat / warm-fair / cool-fair
  • Olive: olive-warm / olive-cool / golden-olive
  • Tan: warm-tan / golden-tan / sun-kissed
  • Brown: caramel / cocoa / warm-brown / golden-brown
  • Deep brown: rich-brown / espresso / mahogany / chestnut
  • Ebony: deep-ebony / luminous-ebony / midnight-velvet

Anime-painterly register: cel-shaded, soft glow accents, smooth painted treatment.`,
    touchpoints: [
      'PORCELAIN-FAIR — porcelain-fair skin with soft rose-undertones, anime-painterly cel-shading, gentle peach glow on cheekbones',
      'CREAM-IVORY — cream-ivory skin with warm peach undertones, anime-painterly soft painted treatment, subtle glow accents',
      'WARM-PEACH — warm-peach skin with golden undertones, anime cel-shaded register, soft glow on cheeks',
      'ROSE-PALE — rose-pale skin with cool undertones, anime-painterly delicate cel-shading, pink-glow cheek accents',
      'OLIVE-WARM — warm-olive skin with golden undertones, anime cel-shaded painted treatment, honey-glow accents',
      'GOLDEN-OLIVE — golden-olive skin with sun-warmed undertones, anime-painterly soft cel-shading, amber glow accents',
      'SUN-KISSED TAN — sun-kissed tan skin with warm bronze undertones, anime cel-shaded painted register, golden glow',
      'WARM-CARAMEL — warm-caramel skin with honey undertones, anime-painterly soft cel-shading, golden-amber glow accents',
      'COCOA-BROWN — cocoa-brown skin with rich undertones, anime cel-shaded painted register, copper glow accents',
      'GOLDEN-BROWN — golden-brown skin with warm sun undertones, anime-painterly cel-shaded register, soft amber glow',
      'RICH-BROWN — rich-brown skin with mahogany undertones, anime cel-shaded painted treatment, warm copper glow',
      'CHESTNUT-BROWN — chestnut-brown skin with warm autumn undertones, anime-painterly cel-shading, glowing warm highlights',
      'ESPRESSO-DARK — espresso-dark skin with depth, anime cel-shaded painted register, jewel-tone highlight accents',
      'MAHOGANY-DEEP — mahogany-deep skin with rich red undertones, anime-painterly cel-shading, copper-gold accents',
      'LUMINOUS-EBONY — luminous-ebony skin with deep midnight undertones, anime cel-shaded painted register, gold-and-pearl glow accents',
      'DEEP-EBONY — deep-ebony skin with velvety smoothness, anime-painterly cel-shading, pearl-and-gold highlight accents',
      'MIDNIGHT-VELVET — midnight-velvet ebony skin with iridescent undertones, anime cel-shaded register, jewel-tone glow accents',
      'WHEAT-WARM — wheat-warm skin with subtle peach undertones, anime cel-shaded painted register, soft amber glow',
      'FAIR-COOL — fair-cool skin with subtle blue undertones, anime-painterly cel-shading, pearl-glow cheek accents',
      'PEACH-GOLD — peach-gold skin with warm sun undertones, anime cel-shaded painted register, golden glow accents',
      'BRONZE-WARM — warm-bronze skin with golden undertones, anime-painterly cel-shading, amber-copper glow accents',
      'HONEY-GOLDEN — honey-golden skin with warm autumn undertones, anime cel-shaded painted register, soft golden glow',
      'AMBER-WARM — warm-amber skin with sun-kissed undertones, anime-painterly cel-shading, warm-bronze accents',
      'OLIVE-COOL — cool-olive skin with subtle green undertones, anime cel-shaded painted register, soft pearl accents',
      'TOAST-WARM — warm-toast skin with golden honey undertones, anime-painterly cel-shading, soft glow accents',
      'COFFEE-MEDIUM — coffee-medium skin with warm undertones, anime cel-shaded painted register, golden-copper glow',
      'CINNAMON-WARM — warm-cinnamon skin with rich autumn undertones, anime-painterly cel-shading, copper-amber accents',
      'WALNUT-DEEP — walnut-deep skin with rich brown undertones, anime cel-shaded painted register, warm copper glow',
      'TAUPE-WARM — warm-taupe skin with subtle olive undertones, anime-painterly cel-shading, soft golden accents',
      'COPPER-RICH — rich-copper skin with metallic undertones, anime cel-shaded painted register, gold-and-amber glow accents',
    ],
    instructions: `Each entry is ONE specific skin tone descriptor, 15-30 words. Format: "TONE NAME CAPS — primary tone + undertone + anime cel-shading note + glow accent". DISTRIBUTE EVENLY across the full spectrum from porcelain to ebony. NEVER race-specific. NEVER photoreal-pore. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── bloom-spirit DNA: eyes (30 entries, all colors + shapes) ───
  bloombot_bloom_spirit_eyes: {
    format: 'simple',
    theme: `EYE COLOR + SHAPE DESCRIPTORS for the BloomBot bloom-spirit path. Each entry is ONE specific anime-stylized eye description. 15-30 words.

⚠️ MANDATORY — LARGE STYLIZED ANIME-PAINTERLY eyes (always). Variety across all natural colors + fantasy jewel-tone colors. NEVER photoreal eye description.

🚫 STRICT BANS:
  • NO photoreal eye-iris-detail description
  • NO race-specific (race is a separate axis)
  • NO duplicate of skin / hair content
  • NO realistic-shape descriptions like "small" or "narrow" — always LARGE stylized anime

✓ EYE COLOR CATEGORIES — DISTRIBUTE EVENLY:
  Natural: brown / amber / hazel / green / blue / grey / black
  Jewel-tone fantasy: violet / aqua / silver / pink / gold / mint / rose / lavender / sapphire
  Heterochromia: two-different-colors

Anime register: large + stylized + expressive + sparkly with star-shaped highlights / multiple light catchlights / jewel-glint.`,
    touchpoints: [
      'LARGE VIOLET-JEWEL — large stylized violet-jewel anime eyes with star-shaped highlights, sparkly fantasy register',
      'LARGE AMBER-GOLD — large stylized amber-gold anime eyes with multiple catchlights, warm honey depth',
      'LARGE EMERALD-GREEN — large stylized emerald-green anime eyes with jewel sparkle, expressive painterly',
      'LARGE SAPPHIRE-BLUE — large stylized sapphire-blue anime eyes with bright catchlights, jewel-tone depth',
      'LARGE CHOCOLATE-BROWN — large stylized chocolate-brown anime eyes with warm catchlights, soft expressive',
      'LARGE ICE-BLUE — large stylized ice-blue anime eyes with silver catchlights, cool jewel depth',
      'LARGE HAZEL-WARM — large stylized hazel anime eyes with green-amber gradient, warm catchlights',
      'LARGE AQUA-TURQUOISE — large stylized aqua-turquoise anime eyes with bright sparkle, jewel register',
      'LARGE DEEP-AMBER — large stylized deep-amber anime eyes with copper catchlights, intense gaze',
      'LARGE LAVENDER-VIOLET — large stylized lavender-violet anime eyes with pearl catchlights, soft jewel',
      'LARGE FOREST-GREEN — large stylized forest-green anime eyes with golden catchlights, deep wood',
      'LARGE GOLDEN-AMBER — large stylized golden-amber anime eyes with sun-glint catchlights, warm gold',
      'LARGE SILVER-GREY — large stylized silver-grey anime eyes with bright catchlights, moonlight depth',
      'LARGE ROSE-PINK FANTASY — large stylized rose-pink fantasy anime eyes with jewel sparkle (fantasy color)',
      'LARGE MINT-GREEN FANTASY — large stylized mint-green fantasy anime eyes with bright sparkle (fantasy)',
      'LARGE ELECTRIC-BLUE — large stylized electric-blue anime eyes with intense glow, jewel-bright',
      'LARGE COPPER-AMBER — large stylized copper-amber anime eyes with metallic glint, warm depth',
      'LARGE STORMY-GREY — large stylized stormy-grey anime eyes with silver catchlights, expressive',
      'LARGE ROYAL-PURPLE — large stylized royal-purple anime eyes with bright catchlights, jewel depth',
      'LARGE OCEAN-BLUE — large stylized ocean-blue anime eyes with multi-tone gradient, deep sparkle',
      'LARGE MOSS-GREEN — large stylized moss-green anime eyes with subtle gold flecks, warm depth',
      'LARGE TIGER-AMBER — large stylized tiger-amber anime eyes with copper catchlights, intense gaze',
      'LARGE BLACK-OBSIDIAN — large stylized obsidian-black anime eyes with bright catchlights, mysterious',
      'LARGE PEARL-WHITE FANTASY — large stylized pearl-white fantasy anime eyes with iridescent shimmer',
      'HETEROCHROMIA BLUE-GREEN — large stylized anime eyes with one blue and one green eye, jewel sparkle',
      'HETEROCHROMIA AMBER-VIOLET — large stylized anime eyes with one amber and one violet eye, fantasy',
      'LARGE TWILIGHT-PURPLE — large stylized twilight-purple anime eyes with star-shaped catchlights',
      'LARGE CORAL-PINK FANTASY — large stylized coral-pink fantasy anime eyes with bright sparkle',
      'LARGE SUNSET-AMBER — large stylized sunset-amber anime eyes with gradient color, warm catchlights',
      'LARGE CRYSTAL-CLEAR FANTASY — large stylized crystal-clear fantasy anime eyes with iridescent prism-glow',
    ],
    instructions: `Each entry is ONE specific eye descriptor, 15-30 words. Format: "EYE NAME CAPS — large stylized [color] anime eyes with [catchlight/highlight] note". ALWAYS large + stylized + anime. DISTRIBUTE across natural + jewel-tone + heterochromia. Output as a NUMBERED list, one per line.`,
  },

  // ─── bloom-spirit DNA: hair_color (30 entries, natural + fantasy) ───
  bloombot_bloom_spirit_hair_color: {
    format: 'simple',
    theme: `HAIR COLOR DESCRIPTORS for the BloomBot bloom-spirit path. Each entry is ONE specific hair color description. 10-25 words.

⚠️ MANDATORY — full range of natural hair colors PLUS pastel-fantasy colors. NEVER photoreal-detail description (just color + tone notes).

🚫 STRICT BANS:
  • NO photoreal individual-strand description
  • NO race-specific (race is separate axis)
  • NO hairstyle description (hairstyle is separate axis)
  • NO duplicate of other DNA axes

✓ COLOR CATEGORIES — DISTRIBUTE EVENLY:
  Natural: jet-black / dark-brown / chestnut / auburn / red-copper / honey-blonde / platinum-blonde / silver / wheat-blonde
  Fantasy: silver-white / lavender / pastel-pink / mint-green / rose-gold / sky-blue / honey-amber / sunset-orange / ocean-teal / pearl / iridescent

Anime-painterly register — soft painted color with subtle gradient.`,
    touchpoints: [
      'JET-BLACK SILK — jet-black anime-painterly hair with subtle blue-purple highlights',
      'DARK-CHOCOLATE — dark-chocolate anime hair with warm caramel highlights, soft painted',
      'RICH-CHESTNUT — rich-chestnut anime hair with auburn highlights, warm depth',
      'AUBURN-COPPER — auburn-copper anime hair with golden-red highlights, warm autumn',
      'RED-COPPER — vibrant red-copper anime hair with golden ember highlights, fiery painted',
      'HONEY-BLONDE — honey-blonde anime hair with golden warm highlights, soft painted',
      'PLATINUM-BLONDE — platinum-blonde anime hair with cool silver highlights, painterly',
      'STRAWBERRY-BLONDE — strawberry-blonde anime hair with pink-rose-gold tones, soft painted',
      'WHEAT-BLONDE — wheat-blonde anime hair with warm golden highlights, sun-kissed',
      'SILVER-GREY — silver-grey anime hair with cool moonlight highlights, ethereal painted',
      'WHITE-PEARL FANTASY — pearl-white fantasy anime hair with iridescent shimmer highlights',
      'LAVENDER-PURPLE FANTASY — lavender-purple fantasy anime hair with violet highlights, painted',
      'PASTEL-PINK FANTASY — pastel-pink fantasy anime hair with rose highlights, soft painted',
      'MINT-GREEN FANTASY — mint-green fantasy anime hair with seafoam highlights, painted',
      'ROSE-GOLD FANTASY — rose-gold fantasy anime hair with metallic warm highlights, painted',
      'SKY-BLUE FANTASY — sky-blue fantasy anime hair with crystal highlights, painted',
      'HONEY-AMBER FANTASY — honey-amber fantasy anime hair with golden glow, painted',
      'SUNSET-ORANGE FANTASY — sunset-orange fantasy anime hair with red-gold gradient, painted',
      'OCEAN-TEAL FANTASY — ocean-teal fantasy anime hair with aqua highlights, painted',
      'IRIDESCENT FANTASY — iridescent rainbow-shimmer fantasy anime hair, painterly',
      'COCOA-BROWN — cocoa-brown anime hair with warm caramel highlights, painted',
      'ESPRESSO-DARK — espresso-dark anime hair with cool blue undertones, painted',
      'MAHOGANY-RED — mahogany-red anime hair with deep auburn tones, warm painted',
      'COOL-ASH BROWN — cool-ash-brown anime hair with subtle grey-undertone highlights',
      'WARM-CARAMEL — warm-caramel anime hair with golden honey highlights, painted',
      'CHARCOAL-BLACK — charcoal-black anime hair with subtle grey highlights, painted',
      'TWILIGHT-VIOLET FANTASY — twilight-violet fantasy anime hair with star-shimmer highlights',
      'PERIWINKLE FANTASY — periwinkle fantasy anime hair with crystal-blue tones, painted',
      'BUTTER-YELLOW FANTASY — butter-yellow fantasy anime hair with cream-gold tones, painted',
      'CORAL-PEACH FANTASY — coral-peach fantasy anime hair with rose-amber tones, painted',
    ],
    instructions: `Each entry is ONE specific hair color descriptor, 10-25 words. Format: "COLOR NAME CAPS — [color] anime-painterly hair with [highlight/tone] note". DISTRIBUTE across natural + pastel-fantasy. Output as a NUMBERED list, one per line.`,
  },

  // ─── bloom-spirit DNA: hairstyle (50 entries, length + texture + styling) ───
  bloombot_bloom_spirit_hairstyle: {
    format: 'simple',
    theme: `HAIRSTYLE DESCRIPTORS for the BloomBot bloom-spirit path. Each entry is ONE specific hair length + texture + styling description. 15-30 words.

⚠️ MANDATORY — describes hair STRUCTURE (length / texture / cut / styling) WITHOUT mentioning flowers (flowers are handled by template). The hair must read AS HAIR clearly visible.

🚫 STRICT BANS:
  • NO color description (hair_color is separate axis)
  • NO race-specific
  • NO flower / floral / bloom references (template handles that)
  • NO hat / crown / wreath / cap mentions

✓ HAIRSTYLE CATEGORIES — DISTRIBUTE across:
  Length: pixie / chin-bob / shoulder-length / mid-back / waist-length / floor-length
  Texture: straight / wavy / curly / coily / kinky / box-braided / cornrowed / loc'd
  Styling: loose / half-up / updo / braided crown / side-swept / french-braid / fishtail / dutch-braid / waterfall-braid / chignon / messy bun / sleek / voluminous / topknot

Anime-painterly register — hair painted with flowing dynamic motion, soft sheen, painterly highlights.`,
    touchpoints: [
      'LONG FLOWING WAVES — long mid-back flowing soft waves cascading freely, anime-painterly dynamic motion, soft sheen',
      'WAIST-LENGTH STRAIGHT — sleek waist-length straight hair with soft anime painted sheen, flowing down her back',
      'LONG CURLY MASS — long voluminous curly hair past shoulders, painted spiral curls in anime register',
      'BOX-BRAIDS SHOULDER — long box-braided hair past shoulders, each braid individually painted, anime register',
      'BOX-BRAIDS WAIST — long box-braided hair to the waist, each braid distinct, painted anime register',
      'CORNROWS CROWN — intricate cornrow braids forming a crown pattern, painted anime register',
      'LOCS LONG — long locs cascading past shoulders, individually painted twist-and-coil, anime register',
      'AFRO ROUND — beautiful round afro hairstyle, voluminous painted curls, anime register',
      'PIXIE CUT TEXTURED — chic pixie cut with textured side-sweep, painted anime register with soft sheen',
      'CHIN BOB SLEEK — sleek chin-length bob with smooth sheen, painted anime register, soft flowing edges',
      'SHOULDER BLUNT — shoulder-length blunt cut with subtle waves, painted anime register, smooth sheen',
      'ELEGANT UPDO — elegant chignon updo with soft tendrils framing the face, painted anime register',
      'BRAIDED CROWN UPDO — braided-crown updo with the braid wrapping the head, painted anime register',
      'HALF-UP HALF-DOWN — half-up half-down style with twisted upper crown and flowing lower waves, painted anime',
      'SIDE-SWEPT WAVES — side-swept long waves flowing over one shoulder, painted anime register, dynamic motion',
      'FRENCH-BRAID — single French braid down the center back, anime painted register, structured',
      'FISHTAIL-BRAID — long fishtail braid over one shoulder, intricately painted anime register',
      'DUTCH-BRAID DOUBLE — two Dutch braids running parallel down both sides, painted anime register',
      'WATERFALL-BRAID — waterfall-braid framing the face with loose ends cascading, painted anime register',
      'MESSY BUN — soft messy bun atop the head with tendrils framing the face, painted anime register',
      'TOPKNOT ELEGANT — elegant topknot with smooth pulled-back styling, painted anime register',
      'VOLUMINOUS CURLS — voluminous curls past shoulders with bouncy dynamic painted motion, anime',
      'TIGHT-COILS NATURAL — tight natural coils framing the face, voluminous painted anime register',
      'BANTU KNOTS — Bantu knots styled across the crown, painted anime register, structured',
      'SLEEK PONYTAIL LOW — sleek low ponytail flowing down the back, painted anime register, smooth',
      'HIGH PONYTAIL VOLUMINOUS — high ponytail with voluminous waves cascading, painted anime register',
      'CROWN BRAID INTRICATE — intricate crown braid wrapping around the head, painted anime register',
      'PRINCESS UPDO — princess-style updo with twists and curls, painted anime register, elegant',
      'LOOSE BEACH WAVES — loose beach waves flowing freely, painted anime register, soft windswept motion',
      'STRAIGHT SLEEK MID-BACK — straight sleek hair to mid-back with glossy painted sheen, anime register',
      'WAVY MID-BACK PARTED — wavy mid-back hair parted in the middle, painted anime register, soft motion',
      'CURLY SHOULDER-LENGTH — shoulder-length curly hair with bounce, painted anime register',
      'BRAIDED LOW BUN — low braided bun at the nape with elegant smooth styling, painted anime register',
      'TWISTED-BACK — back-twisted style with loose tendrils framing the face, painted anime register',
      'SLEEK MIDDLE-PART LONG — sleek middle-part long hair flowing down the back, painted anime register',
      'CURLY UPDO TENDRILS — curly updo with cascading tendrils, painted anime register, soft and dynamic',
      'BRAIDED HEADBAND — braided-headband style framing the hairline, rest flowing free, painted anime',
      'TWO BRAIDS PIGTAIL — two long pigtail braids one on each side, painted anime register, sweet',
      'CURLY HALF-UPDO — curly half-updo with the upper section twisted up, painted anime register',
      'WAVY HIGH-PONYTAIL — wavy high-ponytail with bouncy painted curls cascading, anime register',
      'SLEEK TOPKNOT — sleek high topknot with smooth pulled-back styling, painted anime register',
      'BRAIDED PIGTAILS LOW — two low braided pigtails framing the face, painted anime register',
      'LOOSE PARTED MID-BACK — loose middle-parted mid-back hair, painted anime register, soft and flowing',
      'TWIST-OUT NATURAL — natural twist-out style with defined coils, painted anime register, voluminous',
      'SIDE-PART LONG-WAVES — side-parted long-wavy hair flowing over one shoulder, painted anime register',
      'CURLY ASYMMETRICAL — curly asymmetrical cut with one side longer, painted anime register, edgy',
      'BRAIDED HALO — single thick braid wrapped around the crown like a halo (no flowers), painted anime',
      'LOOSE WAVY UNDONE — loose wavy hair undone and free-flowing, painted anime register, romantic',
      'STRAIGHT WITH WISPS — straight hair with face-framing wisps, painted anime register, soft',
      'CURLY UPSWEPT — curly hair swept up on one side with cascading other side, painted anime register',
    ],
    instructions: `Each entry is ONE specific HAIRSTYLE descriptor (length + texture + styling), 15-30 words. Format: "STYLE NAME CAPS — [length] [texture] hair with [styling note], painted anime register". NEVER color / flower / race specific. Output as a NUMBERED list, one per line.`,
  },

  // ─── bloom-spirit path: woman_archetype (diverse beautiful young women) ───
  // ─── bloom-spirit path: woman_archetype (diverse beautiful young women) ───
  bloombot_bloom_spirit_woman_archetype: {
    format: 'simple',
    theme: `WOMAN ARCHETYPES for the BloomBot bloom-spirit path. Each entry is ONE specific beautiful young woman described by ethnicity / skin tone / hair color + texture / eye color + features — for an anime-painterly fantasy portrait. Each entry 20-40 words.

⚠️ MANDATORY — DIVERSITY across all ethnicities, all skin tones, all hair colors (natural + pastel-fantasy), all eye colors (natural + jewel-tone fantasy), all hair textures. Every render is a beautiful YOUNG WOMAN — never men, never children, never elders.

🚫 STRICT BANS:
  • NO men / boys / male figures
  • NO children / babies / toddlers / teens
  • NO elders / old women
  • NO multiple figures (always single solo subject)
  • NO realistic-fashion-editorial register — this is fantasy painterly anime
  • NO horror / dark-fantasy / ominous features
  • NO specific real-people / celebrity references

✓ ETHNICITY / SKIN-TONE CATEGORIES — DISTRIBUTE EVENLY (~8% each):
  A. EAST ASIAN — Japanese / Korean / Chinese features, fair-to-tan skin
  B. SOUTHEAST ASIAN — Thai / Vietnamese / Filipino / Indonesian features
  C. SOUTH ASIAN — Indian / Pakistani / Bangladeshi features, olive-to-brown skin
  D. MIDDLE EASTERN — Persian / Arab / Lebanese / Egyptian features
  E. NORTH AFRICAN — Moroccan / Algerian / Egyptian features
  F. WEST AFRICAN — Nigerian / Ghanaian / Senegalese features, deep-brown to ebony skin
  G. EAST AFRICAN — Ethiopian / Eritrean / Somali features, tall + slender
  H. MEDITERRANEAN — Italian / Spanish / Greek / Maltese features
  I. NORTHERN EUROPEAN — Scandinavian / British / Irish / German features, fair skin
  J. LATIN AMERICAN — Mexican / Colombian / Brazilian / Argentine features
  K. PACIFIC ISLANDER — Polynesian / Hawaiian / Samoan / Maori features
  L. MIXED / FANTASY — mixed-heritage or fantasy-styled with silver / lavender / pastel-pink hair

✓ HAIR TEXTURE VARIETY — distribute across:
  • Straight long / wavy long / curly long / box-braids / cornrows / locs / afro / sleek-bob / pixie-with-detail / updo / braided crown

Anime-painterly fantasy register — describe each woman with stylized large jewel-tone eyes, glitter-and-sparkle face accents possible, painterly skin treatment, soft lush features.

Channel: anime fantasy portrait painters + Disney concept art diversity + Pinterest 'diverse beauty' boards + romantic-fantasy book covers.`,
    touchpoints: [
      'JAPANESE-FEATURED LONG-WAVY — fair-skinned Japanese-featured young woman with jet-black long-wavy hair flowing, large stylized violet-jewel eyes, soft glitter on cheekbones, delicate anime-fantasy features',
      'SOUTH ASIAN AMBER + CURLS — South Asian young woman with rich amber-tan skin, lustrous black long-curly hair, large stylized golden-amber eyes, gold-glitter on brow and collarbone',
      'WEST AFRICAN BOX-BRAIDS — West African young woman with luminous deep-ebony skin, long box-braids cascading, large stylized emerald-green eyes, gold-jewel glitter on cheekbones, regal painterly',
      'POLYNESIAN WAVY-BLACK — Polynesian young woman with golden-tan skin, long jet-black wavy hair with subtle warm-brown highlights, large stylized chocolate-amber eyes, pearl-glitter accents',
      'MEDITERRANEAN AUBURN-CURLY — Mediterranean young woman with olive-toast skin, long auburn curly hair, large stylized hazel-green eyes, soft rose-glitter cheek accents',
      'NORTHERN EUROPEAN PLATINUM — Northern European young woman with porcelain-fair skin, long platinum-blonde flowing hair, large stylized ice-blue eyes, silver-glitter face accents',
      'KOREAN SLEEK-BLACK — fair-skinned Korean-featured young woman with sleek straight black bob, large stylized doe-brown eyes, soft pink-glitter cheek accents',
      'PERSIAN DARK-WAVY — Persian young woman with warm olive-tan skin, long dark wavy hair, large stylized hazel-amber eyes with depth, gold-glitter on collarbone',
      'MOROCCAN CURLY-BROWN — North African young woman with golden-tan skin, long dark-brown curly hair, large stylized hazel-green eyes, henna-style accents on temples',
      'MEXICAN WAVY-CHOCOLATE — Latin American young woman with rich tan skin, long dark-brown wavy hair, large stylized chocolate-brown eyes, soft coral-glitter cheek accents',
      'ETHIOPIAN BRAIDED-CROWN — East African young woman with luminous brown skin, tall + slender, dark hair in braided crown, large stylized dark-amber eyes, gold-glitter accents',
      'FANTASY SILVER-WHITE — fantasy-styled young woman with porcelain skin, long silver-white flowing hair, large stylized violet-jewel eyes, silver-pearl glitter face accents',
      'PASTEL-PINK FANTASY — fantasy-styled young woman with fair skin, long pastel-pink curly hair, large stylized aqua-blue eyes, pearl-pink glitter accents',
      'SOUTH INDIAN DEEP-BROWN — South Indian young woman with deep-brown skin, long wavy black hair, large stylized amber-brown eyes, gold-tikka on forehead, henna accents',
      'BRAZILIAN BIG-CURLY — Brazilian young woman with golden-brown skin, long voluminous curly dark-brown hair, large stylized hazel-green eyes, sunkissed glow',
      'MAORI DARK-WAVY — Maori young woman with warm golden-brown skin, long dark wavy hair, large stylized dark-brown eyes, subtle traditional accents softly painted',
      'SCANDINAVIAN WHEAT-BRAID — Scandinavian young woman with fair-rose skin, long wheat-blonde braided hair, large stylized cornflower-blue eyes, silver-glitter accents',
      'EGYPTIAN ALMOND-DARK — Egyptian young woman with warm olive-amber skin, long dark hair with subtle waves, large stylized almond-shaped dark-amber eyes, gold-glitter on eyelids',
      'INDONESIAN GOLDEN-TAN — Indonesian young woman with warm golden-tan skin, long dark wavy hair, large stylized chocolate-brown eyes, soft pink-pearl glitter accents',
      'FANTASY LAVENDER-FLOWING — fantasy-styled young woman with porcelain skin, long flowing lavender-purple hair, large stylized violet-pink-jewel eyes, pearl-lavender glitter accents',
      'NIGERIAN CORNROWS — Nigerian young woman with luminous ebony skin, intricate cornrow braids forming a crown, large stylized amber eyes, gold-jewel glitter accents',
      'GREEK CHESTNUT-CURLY — Greek young woman with olive skin, long chestnut-curly hair, large stylized warm-hazel eyes, soft glitter on cheekbones',
      'CHINESE STRAIGHT-BLACK-UPDO — fair-skinned Chinese-featured young woman with sleek black hair in elegant updo, large stylized doe-brown eyes, jade-green glitter accents',
      'IRISH RED-CURLS — Irish young woman with pale-rose skin and freckles, long red-copper curls, large stylized emerald-green eyes, gold-glitter freckle-highlighting',
      'SOMALI TALL-SLENDER — Somali young woman with luminous medium-brown skin, tall + slender, long dark hair in loose-curl crown, large stylized golden-amber eyes',
      'JAMAICAN LOCS — Jamaican young woman with rich brown skin, long locs cascading, large stylized warm-amber eyes, soft pearl-glitter face accents',
      'FILIPINO WAVY-DARK — Filipino young woman with golden-tan skin, long dark-brown wavy hair, large stylized warm-brown eyes, soft pink-pearl glitter accents',
      'PUERTO-RICAN DARK-WAVY — Puerto-Rican young woman with golden-tan skin, long dark wavy hair, large stylized warm-amber eyes, sunset-glitter cheek accents',
      'ICELANDIC PLATINUM-STRAIGHT — Icelandic young woman with porcelain-fair skin, long platinum-blonde straight hair, large stylized pale-blue-grey eyes, silver-frost glitter accents',
      'INDIAN-WITH-HENNA — South Asian young woman with warm caramel skin, long dark wavy hair with floral accent, large stylized amber-brown eyes, henna-pattern on hands suggested',
    ],
    instructions: `Each entry is ONE specific beautiful young woman for the bloom-spirit portrait, 20-40 words. Format: "ETHNICITY/STYLE CAPS — primary ethnicity + skin tone + hair color/texture + eye color/feature + glitter accent". DISTRIBUTE EVENLY across the 12 ethnicity categories AND the 11 hair-texture types. Anime-painterly register. NEVER men / children / elders / multiple figures. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── bloom-spirit path: bloom_gown (couture floral dress + matching hair-floral) ───
  bloombot_bloom_spirit_bloom_gown: {
    format: 'simple',
    theme: `COLOR-THEMED COUTURE FLORAL GOWNS for the BloomBot bloom-spirit path. Each entry is ONE COLOR-THEMED MULTI-SPECIES gown design where the entire dress is DRENCHED/PLASTERED/SUBMERGED in overwhelming bloom-mass. DESCRIBES ONLY THE DRESS. Each entry 30-70 words.

⚠️ EXTREME OVERWHELMING DENSITY — every gown is so DRENCHED in flowers the fabric silhouette is BARELY VISIBLE beneath the floral mass. From neckline to hem to train — thousands of overlapping blooms.

⚠️ MULTI-SPECIES MANDATE — every entry uses 3-6 DIFFERENT flower species mixed in a coordinated COLOR THEME (never a single-species gown).

⚠️ COLOR-THEME MANDATE — use these themes:
  • SUNSET (red/orange/pink/coral/gold) | TWILIGHT PURPLES | BLUSH PINKS | MONOCHROME WHITE
  • RAINBOW EXPLOSION | PINK + WHITE COTTAGE | PURPLE + WHITE ROYAL | CORAL + PEACH PARADISE
  • DEEP BURGUNDY + WINE | GOLD + AMBER + COPPER | OCEAN COOL | EMERALD FOREST
  • MAGIC PASTEL CANDY | TROPICAL BOLD | AUTUMN HARVEST | DUSK FIRE
  • BLUE + WHITE COASTAL | PINK + GOLD | VIOLET + CREAM | NAVY + BURGUNDY

✓ GOWN SILHOUETTE VARIETY (rotate across):
  Strapless ball / Off-shoulder / Halter-neck / Corset + layered skirt / A-line / Mermaid / Empire-waist / Backless / Caped overlay / Sleeved ball / High-neck choker / Princess full-skirt

🚫 STRICT BANS:
  • NO hair / hair-crown / matching hair references (hair is separate axis)
  • NO single-species gowns
  • NO modern / corporate / casual fashion
  • NO 'some flowers on a dress' — every inch DRENCHED`,
    touchpoints: [
      'SUNSET BALL GOWN — strapless couture bodice DRENCHED with overlapping red roses + coral peonies + orange ranunculus + yellow daisies + golden marigolds, full ball-skirt cascading sunset-spectrum florals to the floor in extreme density',
      'TWILIGHT PURPLE MERMAID — mermaid silhouette PLASTERED with lavender wisteria + violet anemones + blue bluebells + periwinkle iris + indigo sweet-pea, every inch of fabric buried beneath twilight floral cascade',
      'BLUSH PINK PRINCESS — princess full-skirt gown DRENCHED in soft pink peonies + blush roses + cream ranunculus + ivory jasmine + pale-blush cabbage roses, fabric barely visible under blush cascade',
      'MONOCHROME WHITE BRIDAL — strapless couture ball PLASTERED in white roses + cream gardenias + ivory peonies + pearl-white jasmine + pale-blush hellebore, snow-white floral overwhelming cascade',
      'RAINBOW EXPLOSION GOWN — A-line gown DRENCHED with rainbow of red poppies + orange marigolds + yellow daisies + green hellebore + blue cornflowers + purple anemones, vibrant full-spectrum cascade',
      'PINK + WHITE COTTAGE BALL — off-shoulder ball PLASTERED with soft pink garden roses + white peonies + pale blush ranunculus + jasmine + tiny pink gypsophila in cottage-romantic overwhelming cascade',
      'PURPLE + WHITE ROYAL GOWN — backless gown DRENCHED in royal purple irises + white roses + violet anemones + pearl gardenias + lavender sweet-pea in dramatic purple-and-white cascade',
      'CORAL PEACH PARADISE MERMAID — mermaid silhouette PLASTERED with coral peonies + peach garden roses + apricot ranunculus + warm sunset dahlias + golden marigolds in warm tropical cascade',
      'BURGUNDY WINE BALL — corset + layered skirt DRENCHED in burgundy dahlias + plum cosmos + maroon roses + dark-crimson ranunculus + black-purple calla in dramatic wine-spectrum cascade',
      'GOLD AMBER COPPER COUTURE — halter-neck gown PLASTERED with golden marigolds + amber rudbeckia + copper dahlias + warm yellow daisies + bronze chrysanthemums in massive metallic cascade',
      'OCEAN COOL EMPIRE — empire-waist gown DRENCHED in aqua hydrangeas + teal sea-holly + ice-blue forget-me-nots + seafoam hellebore + pearl-white roses in cool ocean-spectrum cascade',
      'EMERALD FOREST GOWN — A-line gown PLASTERED with green hellebore + white daisies + pale yellow primrose + lavender sweet-pea + emerald succulents in forest-spirit cascade',
      'PASTEL CANDY EXPLOSION — princess full-skirt DRENCHED in pastel pink + lilac + mint + butter-yellow + sky-blue tiny blooms in cotton-candy overwhelming cascade',
      'TROPICAL BOLD STORM GOWN — mermaid silhouette PLASTERED with hot pink hibiscus + tropical orange marigolds + magenta bougainvillea + bright yellow plumeria + saturated coral ginger',
      'AUTUMN HARVEST GOWN — off-shoulder ball DRENCHED in rust chrysanthemums + russet dahlias + ochre marigolds + burnt-orange roses + ruby-wine cosmos in autumn cascade',
      'DUSK FIRE COUTURE — strapless ball DRENCHED in deep red roses + orange peonies + crimson ranunculus + gold marigolds + warm-amber dahlias in dusk-fire spectrum cascade',
      'BLUE + WHITE COASTAL — caped overlay gown PLASTERED with sky-blue hydrangeas + white roses + ice-blue forget-me-nots + pearl-white jasmine + soft cornflower-blue in coastal cascade',
      'PINK + GOLD ROMANCE — corset gown DRENCHED in soft pink garden roses + gold-amber ranunculus + cream peonies + pale rose-gold dahlias + pearl-pink sweet-pea in romantic cascade',
      'VIOLET + CREAM ETHEREAL — empire-waist gown PLASTERED with violet iris + cream-white roses + lavender peonies + pearl-white anemones + soft violet sweet-pea',
      'CHERRY BLOSSOM PRINCESS — princess ball PLASTERED with pink + white cherry blossom petals + pink camellias + cream magnolias in cherry-blossom overwhelming cascade',
      'RED + BURGUNDY DRAMA GOWN — corset gown DRENCHED in deep red roses + burgundy dahlias + crimson peonies + dark-wine cosmos + black-red ranunculus in dramatic cascade',
      'YELLOW MEADOW SUN GOWN — A-line gown PLASTERED with yellow daisies + golden marigolds + butter-yellow ranunculus + cream-yellow daffodils + sunshine chrysanthemums',
      'LILAC + BABY-BLUE SPRING — off-shoulder gown DRENCHED in lilac + baby-blue + pale-lavender + soft periwinkle + sky-blue forget-me-nots in soft-pastel spring cascade',
      'TEAL + ROSE-GOLD VINTAGE — caped overlay gown PLASTERED with teal hydrangeas + rose-gold dahlias + dusty-pink roses + warm copper ranunculus + cream-white peonies',
      'BLACK ROSE + WHITE GOTH — strapless corset DRENCHED in dark-burgundy black-roses + white roses + deep-violet anemones + ivory gardenias + pearl-pink hellebore',
      'PEACH + CREAM SOFT — empire-waist gown PLASTERED with peach garden roses + cream peonies + soft apricot ranunculus + pearl-white jasmine + warm-cream camellias',
      'MAGENTA + ORANGE BOLD — mermaid silhouette DRENCHED with hot magenta dahlias + bright orange marigolds + fuchsia peonies + coral ranunculus + saturated tropical bougainvillea',
      'COOL MINT + WHITE — A-line gown PLASTERED with mint-green hellebore + white roses + pale-green succulents + ivory jasmine + soft seafoam ranunculus',
      'BUTTER YELLOW + BLUSH — princess ball DRENCHED in butter-yellow daisies + blush garden roses + cream-yellow ranunculus + soft pink peonies + pearl-yellow chrysanthemums',
      'INDIGO + VIOLET DEEP — corset gown PLASTERED with indigo irises + violet wisteria + deep-purple anemones + dark-violet sweet-pea + plum dahlias in dramatic deep-purple cascade',
      'ORANGE + CORAL TROPICAL — halter-neck gown DRENCHED in bright orange marigolds + coral hibiscus + tropical-peach plumeria + warm orange-yellow ranunculus + sunset bougainvillea',
      'BLUSH + DUSTY-PINK ROMANCE — caped overlay gown PLASTERED with soft blush garden roses + dusty-pink peonies + pale pink ranunculus + cream-blush cabbage roses + baby-pink sweet-pea',
      'WHITE + CHAMPAGNE BRIDAL — strapless ball DRENCHED in white roses + cream peonies + champagne-blush ranunculus + ivory dahlias + pearl-white gardenias with rose-gold highlights',
      'EMERALD + GOLD LUXE — empire-waist gown PLASTERED with emerald-green hellebore + golden marigolds + amber dahlias + cream-gold ranunculus + green-and-gold succulents',
      'PEACH + LAVENDER DREAM — off-shoulder ball DRENCHED with peach garden roses + lavender sweet-pea + apricot ranunculus + soft pale-purple anemones + cream-peach peonies',
      'CRIMSON + BLACK DRAMATIC — backless corset PLASTERED with crimson roses + dark-burgundy dahlias + black-purple anemones + deep red ranunculus + dark crimson peonies',
      'POWDER BLUE + PINK FAIRY — princess ball DRENCHED in powder-blue forget-me-nots + soft pink peonies + pale-rose ranunculus + cream-white roses + baby-blue hydrangeas',
      'AMBER + COPPER METALLIC — high-neck choker gown PLASTERED with amber dahlias + copper-orange chrysanthemums + warm-bronze ranunculus + gold-amber marigolds + russet roses',
      'NEON PINK + PURPLE — mermaid silhouette DRENCHED in bright neon-pink garden roses + electric-purple anemones + magenta dahlias + hot-pink peonies + saturated violet sweet-pea',
      'CHARCOAL + IVORY GOTHIC — empire-waist gown PLASTERED with charcoal-grey hellebore + ivory roses + black-violet anemones + cream-grey ranunculus + pale-ivory dahlias',
      'TURQUOISE + CORAL TROPICAL — caped overlay DRENCHED with turquoise hydrangeas + coral hibiscus + aqua-blue forget-me-nots + warm coral peonies + bright sea-glass succulents',
      'PALE PINK + GREEN GARDEN — A-line gown PLASTERED with pale-pink garden roses + emerald-green hellebore + soft mint succulents + cream-pink peonies + leafy eucalyptus',
      'RUBY + GOLD ROYAL — corset + layered skirt DRENCHED in ruby-red roses + gold-amber dahlias + crimson ranunculus + warm-gold marigolds + dark-red peonies',
      'MIDNIGHT BLUE + SILVER — strapless ball PLASTERED with midnight-blue irises + silver-grey hellebore + dark-violet anemones + ice-blue forget-me-nots + pearl-silver ranunculus',
      'CANDY APPLE RED + CREAM — princess full-skirt DRENCHED in candy-apple red roses + cream-white peonies + crimson ranunculus + ivory gardenias + pearl-pink sweet-pea',
      'SUNRISE PEACH GOLD ROSE — empire-waist gown PLASTERED with sunrise-peach garden roses + golden-amber dahlias + rose-pink peonies + cream-white ranunculus + warm-peach plumeria',
      'NAVY + BURGUNDY AUTUMN — backless gown DRENCHED in navy-blue irises + burgundy dahlias + dark-violet anemones + deep-crimson ranunculus + maroon peonies',
      'BABY PINK + CREAM SOFT — off-shoulder princess gown PLASTERED with baby-pink roses + cream peonies + pale-blush ranunculus + ivory ranunculus + pearl-pink hellebore',
      'BRONZE + PLUM AUTUMN — corset gown DRENCHED with bronze-orange chrysanthemums + plum dahlias + ruby-wine cosmos + amber ranunculus + dark-russet peonies',
      'IRIDESCENT FAIRY PASTEL — caped overlay gown PLASTERED with iridescent pastel mix of mint + lavender + baby-blue + cream-yellow + pearl-pink in extreme fairy-cascade',
    ],
    instructions: `Each entry is ONE COLOR-THEMED MULTI-SPECIES COUTURE FLORAL GOWN, 30-70 words. Format: "COLOR-THEME + SILHOUETTE NAME CAPS — gown silhouette DRENCHED/PLASTERED with [3-6 named flower species] in [color theme], fabric barely visible under floral cascade". MULTI-SPECIES + COLOR-THEMED + OVERWHELMING density. Never single-species. NEVER mention hair. Output as a NUMBERED list, one per line.`,
  },

  bloombot_bloom_spirit_garden_backdrop: {
    format: 'simple',
    theme: `BEAUTIFUL FLOWER-GARDEN BACKDROPS for the BloomBot bloom-spirit path. Each entry is ONE specific lush, magical, dreamy garden / courtyard / pergola setting that sits in SOFT-FOCUS BOKEH behind the portrait subject. Each entry 20-40 words.

⚠️ MANDATORY — every backdrop is BEAUTIFUL + LUSH + dreamy. Rendered in SOFT-FOCUS BOKEH (shallow depth-of-field) so it inspires the mood without competing with the woman for focus.

🚫 STRICT BANS:
  • NO modern / corporate / urban backdrops
  • NO horror / dark / morbid settings
  • NO empty / desolate / minimalist
  • NO ruins / abandoned structures (reclaim's territory)
  • NO interiors / rooms (cozy's territory)
  • NO additional humans / figures in the backdrop

✓ BACKDROP CATEGORIES:
  A. WISTERIA PERGOLA — hanging racemes overhead in soft bokeh
  B. ROSE GARDEN — formal rose-garden cascading rose-walls
  C. BLUEBELL FOREST — bluebell forest understory with shafts of light
  D. CHERRY-BLOSSOM GROVE — full bloom, petals falling
  E. LILAC GROVE — purple cone-clusters overhead
  F. TROPICAL LAGOON GARDEN — palms + tropical-bloom edges
  G. WALLED GARDEN — old walled-garden with climbing-bloom
  H. MEADOW WILDFLOWER — wildflower meadow stretching back in golden bokeh
  I. JAPANESE GARDEN — cherry blossom + koi pond
  J. MOROCCAN COURTYARD — central fountain + bloom-mass on walls
  K. MEDITERRANEAN VILLA — bougainvillea cascades + cypress
  L. HYDRANGEA GARDEN — massive blue-and-pink blooms
  M. MAGICAL FAIRY GLEN — soft-glowing bioluminescent-style blooms
  N. DAHLIA GARDEN — massive blooms of all colors
  O. JASMINE PERGOLA — white-cascade trailing

All backdrops in DREAMY SOFT-FOCUS — never sharp / detailed, always blur-bokeh that suggests rather than declares.

Channel: Pinterest 'fairy garden' boards + Studio Ghibli garden backdrops + bridal-photography garden venues + Pre-Raphaelite painted-garden backgrounds.`,
    touchpoints: [
      'WISTERIA-PERGOLA TUNNEL — wisteria-pergola tunnel with hanging purple racemes overhead in soft-bokeh blur, dappled light filtering through, romantic depth-of-field background',
      'BLUEBELL-FOREST UNDERSTORY — bluebell-forest floor in soft-bokeh blur, vertical sun-shafts piercing the canopy, deep-blue carpet receding into dreamy haze',
      'CHERRY-BLOSSOM GROVE — cherry-blossom tree grove in full pink-bloom, petals falling through the air in soft-bokeh, magical romantic backdrop',
      'LILAC GROVE — lilac-tree grove with massive purple cone-clusters hanging overhead in soft-bokeh, dreamy lavender backdrop',
      'TROPICAL LAGOON GARDEN — tropical lagoon edge with palm-fronds and tropical-bloom cascades in soft-bokeh haze, turquoise water glimpsed in deep blur',
      'WALLED-GARDEN STONE — old walled-garden interior with climbing-rose mass on weathered stone walls in soft-bokeh, sun-warmed atmosphere',
      'WILDFLOWER-MEADOW GOLDEN — wildflower meadow stretching into soft-golden bokeh behind, golden-hour light, dreamy depth-of-field',
      'JAPANESE-GARDEN CHERRY + KOI — Japanese garden with cherry-blossom and koi-pond in soft-bokeh, traditional stone-lantern glimpse, magical hush',
      'MOROCCAN COURTYARD FOUNTAIN — Moroccan courtyard with central tile-fountain and bougainvillea cascade on walls in soft-bokeh, warm amber atmosphere',
      'MEDITERRANEAN BOUGAINVILLEA VILLA — Mediterranean villa with cascading magenta-bougainvillea + cypress silhouette in soft-bokeh, sun-warmed golden light',
      'HYDRANGEA GARDEN MASS — formal hydrangea garden with massive blue-and-pink blooms in soft-bokeh blur, dreamy floral wall',
      'MAGICAL FAIRY GLEN — soft-glowing magical fairy glen with bioluminescent-style blooms in soft-bokeh, fireflies, ethereal lighting',
      'DAHLIA GARDEN MULTI-COLOR — dahlia garden with massive blooms of coral / amber / wine / cream in soft-bokeh, dreamy floral abundance',
      'JASMINE PERGOLA TUNNEL — jasmine-pergola with white-jasmine cascades trailing overhead in soft-bokeh, romantic moonlit atmosphere',
      'PEONY GARDEN ABUNDANCE — formal peony garden with massive cabbage-rose-style peonies in pink-and-white in soft-bokeh blur',
      'TUSCAN HILL-GARDEN — Tuscan hill-garden with terraced bloom-beds and distant cypress in soft-bokeh, warm Italian-light',
      'BRITISH COTTAGE-GARDEN — British cottage-garden with delphiniums + foxgloves + roses in soft-bokeh, romantic English-garden mood',
      'GREEK ISLAND TERRACE — Greek-island terrace with whitewashed walls + bougainvillea cascade + sea-glimpse in soft-bokeh',
      'BAMBOO-GROVE ZEN — bamboo-grove zen garden with dappled light through canes in soft-bokeh, serene atmosphere',
      'AURORA NIGHT-GARDEN — magical night-garden under aurora-like color-curtain in soft-bokeh, glowing bioluminescent blooms',
    ],
    instructions: `Each entry is ONE specific BEAUTIFUL GARDEN / COURTYARD BACKDROP in soft-focus bokeh, 20-40 words. Format: "BACKDROP NAME CAPS — primary garden setting + lush bloom features + soft-bokeh / dreamy depth-of-field note". Vary across the 15 categories. ALWAYS dreamy / lush / magical mood. NO modern / urban / horror. NO additional figures. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── bloom-spirit path: atmospheric_phenomenon (60%-gated magic) ───
  bloombot_bloom_spirit_atmospheric_phenomenon: {
    format: 'simple',
    theme: `60%-GATED BLOOM-SPIRIT ATMOSPHERIC PHENOMENA. Each entry is ONE specific magic-moment element rendered within the painted portrait. Each entry 20-40 words.

⚠️ MANDATORY — every phenomenon AMPLIFIES the magical/dreamy mood. Sparkle / glitter / firefly / butterfly / petal-fall / pollen — never harsh or realistic-weather.

🚫 STRICT BANS:
  • NO humans / additional figures
  • NO horror / ominous elements
  • NO realistic-weather (rain / snow / wind) — too earthly
  • NO duplicate of woman / gown / backdrop content
  • NO cartoon / sticker / glitch effects

✓ PHENOMENON CATEGORIES:
  A. SPARKLE / GLITTER — floating around her / on her shoulders / magical-particle halo
  B. BUTTERFLY — perched on shoulder / mid-flight near face / cluster in backdrop
  C. HUMMINGBIRD — hovering at a bloom on her dress / flower in her hair
  D. FIREFLY — floating around her at twilight / glow-cloud around her hair
  E. PETAL-FALL — drifting around her / petal-rain from bloom-canopy
  F. POLLEN-GLOW — golden pollen-cloud in the side-light
  G. MAGICAL LIGHT-RIM — soft luminous halo glow / rim-light from behind
  H. SOFT FOCUS BOKEH-LIGHT — soft bokeh-light circles in backdrop / magic-light
  I. DEW-PETAL — fine dewdrops on the gown petals / morning-dew sparkle
  J. AURORA GLOW — soft aurora-like color-glow in upper backdrop
  K. MOONBEAM — soft moonbeam falling on her face / moonlight halo
  L. FIRE-GLOW LANTERN — soft warm lantern-glow / candle-glow on face

Channel: Disney 'Cinderella' magical-fairy-dust + Studio Ghibli 'Howl's Moving Castle' sparkle moments + Pinterest 'magical fantasy portrait' boards.`,
    touchpoints: [
      'SOFT GLITTER-CLOUD HALO — soft magical glitter-cloud floating around her in suspended sparkle-particles, individual gold-and-silver glints catching the cinematic light',
      'BUTTERFLY ON SHOULDER — solitary jewel-iridescent butterfly perched delicately on her bare shoulder, wings catching the soft light, magical-realism moment',
      'HUMMINGBIRD AT DRESS-BLOOM — solitary jewel-iridescent hummingbird hovering at a specific bloom on her gown, wings a transparent blur, intimate moment',
      'FIREFLY CLOUD AT TWILIGHT — soft cloud of fireflies floating around her at twilight, hundreds of green-pulse lights at every depth, magical glow',
      'PETAL-RAIN FROM ABOVE — gentle petal-rain drifting from a bloom-canopy above her, individual petals suspended in slow-motion through the soft light',
      'GOLDEN POLLEN-CLOUD — visible golden pollen-cloud dispersing in side-light around her, individual pollen-motes catching the warm light',
      'MAGICAL RIM-LIGHT HALO — soft luminous halo glow outlining her silhouette from behind, ethereal back-light creating a magical-aura',
      'BOKEH-LIGHT CIRCLES — soft dreamy bokeh-light circles floating in the deep backdrop, depth-of-field magic-light pattern, romantic atmosphere',
      'DEW-PETAL SPARKLE — fine morning-dewdrops on every petal of her bloom-gown catching the light in glittering points',
      'AURORA COLOR-GLOW — soft aurora-like color-glow in the upper backdrop above her, ethereal magic-light register, painted register',
      'MOONBEAM ON FACE — soft moonbeam falling on her face from above, the rest of the scene in cool twilight blue, moonlit-magic portrait',
      'WARM LANTERN-GLOW — soft warm Moroccan-lantern glow from a nearby lantern catching one side of her face in amber, the other side in cool shadow',
      'BUTTERFLY-CLUSTER BACKDROP — small cluster of butterflies in soft-bokeh the backdrop behind her, wings catching the light, magical realism',
      'SPARKLE-DUST IN HAIR — sparkle-dust scattered through her hair-flower-mass, individual glitter-points catching the light at every wave',
      'FROZEN PETAL MID-FALL — single petal frozen mid-fall in front of her face in the foreground, motion-frozen by the painter, romantic moment',
      'ETHEREAL MIST DRIFT — soft ethereal mist drifting around her ankles / lower bodice in slow-motion, the upper portrait in clear focus',
      'GOLDEN-HOUR FIRE-RAY — single warm golden-hour fire-ray slanting from the upper-left across her face, jewel-tone glow on her cheek',
      'MAGICAL-DUST GALAXY — vast suspended magical-dust galaxy around her with thousands of tiny sparkle-points at every depth, dreamlike density',
      'WHITE-MOTH NIGHT MOMENT — solitary white-moth perched on a bloom in her hair at night, wings translucent in the moonlight, intimate detail',
      'CRYSTAL-PRISM LIGHT — small crystal-prism light fragments scattered across her face from an off-frame source, rainbow-glints',
    ],
    instructions: `Each entry is ONE specific MAGIC-MOMENT atmospheric phenomenon for the bloom-spirit portrait, 20-40 words. Format: "PHENOMENON NAME CAPS — primary element + position in scene + lighting note". Vary across the 12 categories. ALWAYS magical / dreamy / soft register. NO humans / horror / harsh weather. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── tropical-paradise path: tropical_setting (the biome canvas) ───
  bloombot_tropical_paradise_tropical_setting: {
    format: 'simple',
    theme: `TROPICAL PARADISE SETTINGS for the BloomBot tropical-paradise path. Each entry is ONE specific tropical paradise biome where massive showy flowers thrive — beach, lagoon, coastal cove, waterfall pool, atoll, jungle, cloud-forest, or any other paradise context where tropical blooms are the hero. Each entry 30-60 words.

⚠️ MANDATORY — every entry must be IDENTIFIABLY TROPICAL PARADISE — palms / sea / lagoon / waterfall / jungle / coastal-sand / coconut-grove / bloom-laden vegetation. NOT exclusively rainforest. Wide cinematic shot showing deep recession (humid jungle haze OR salt-haze over open water OR mist around waterfalls). Massive showy tropical flowers are the heroes; the setting is the canvas they grow against.

🚫 STRICT BANS — these belong to other BloomBot paths or are wrong for tropical-paradise:
  • NO temperate / alpine / desert / arctic / tundra / mediterranean cottage / english garden
  • NO urban / city streets / Mediterranean alleys (city-flowers)
  • NO ruins / abandoned structures as PRIMARY subject (reclaim) — Mayan/Khmer ruin HINTS are FINE
  • NO interiors / rooms (cozy)
  • NO conservatory architecture / glass-and-iron (conservatory)
  • NO archways/pergolas as the FRAMING (garden-walk) — natural lagoon arches / banyan tunnels are FINE
  • NO surreal / floating / gravity-defying (dreamscape)
  • NO macro / closeup framing (closeup) — this is WIDE cinematic
  • NO landform-as-canvas WITHOUT tropical vegetation (landscape territory)
  • NO humans / figures / silhouettes / shadows of people / boats with sailors / hands

✓ MANDATORY VARIETY — distribute roughly across these PARADISE CATEGORIES (REBALANCE — don't over-index on rainforest understory):
  • **BEACH + COAST (~30% of entries)** — palm-fringed white-sand beach with bloom-edge / coconut grove sloping to sea / tropical sea-cliff with hibiscus + plumeria-tree / atoll-edge with frangipani / coastal-cove with bloom-shrubs at the tide line / volcanic-black-sand beach with tropical blooms / sand-dune transition to jungle / palm-shaded beach-cove / tropical-strand with sea-grape and beach morning-glory / tide-pool edge with bloom-cluster behind / coral-island white-sand spit
  • **LAGOON + WATER PARADISE (~25%)** — turquoise lagoon with bloom-laden inner shore / volcanic crater-lagoon / over-water bloom-bungalow scene (NO bungalow, just the water-and-bloom setting) / atoll lagoon with mangrove-and-bloom edge / hidden lagoon ringed by bloom-cliffs / coral lagoon with bloom-island in the middle / tidal-pool with tropical blooms massed at edge
  • **WATERFALL + POOL (~20%)** — tropical waterfall plunging into bloom-ringed pool / cascading multi-tier waterfall with bloom on every shelf / hidden grotto-waterfall with bloom-cliffs / cenote with bloom-edges and waterfall feeding it / cloud-forest waterfall / volcanic hot-spring with tropical blooms / freshwater jungle pool with hanging vines and lily-pads
  • **RAINFOREST + JUNGLE (~15%)** — rainforest understory with canopy shafts / banyan-clearing / heliconia thicket / banana-grove / cloud-forest ridge / jungle-stream-bend
  • **MIXED / MANGROVE / OTHER (~10%)** — mangrove tidal swamp / bromeliad-laden old-growth tree / philodendron-covered cliff / jungle-ruin bloom-reclaim / sunlit clearing / waterlily-lagoon / palms-and-passion-vine grove

⚠️ DO NOT OVER-INDEX on rainforest understory / banyan / banana-grove — those are ONE FIFTH of the variety. Beach + coast + lagoon + waterfall scenes are the MAJORITY.

Lineage to channel: Hawaiian / Tahitian / Maldivian / Bali / Caribbean / Polynesian / Costa Rican paradise photography + Planet Earth tropical-coast scenes + Avatar Pandora establishing shots + Studio Ghibli ocean-and-jungle magic + National Geographic tropical-paradise features + James Cameron's Avatar Way of Water + Endless Summer surf-cinematography (without the surfers).`,
    touchpoints: [
      'RAINFOREST UNDERSTORY WITH CANOPY SHAFTS — dense rainforest floor under towering buttress-root tree canopy, vertical sun-shafts piercing the green gloom and pooling on specific bloom-patches below, ferns and moss carpeting the floor, atmospheric haze in the deep distance',
      'JUNGLE POOL WITH HANGING VINES — freshwater jungle pool surrounded by hanging vines and giant philodendron leaves, water-lilies covering the surface, bloom-laden vegetation crowding the edges, reflection of canopy above',
      'VOLCANIC-ISLAND CLIFF ABOVE LAGOON — basalt sea-cliff descending to turquoise lagoon below, bloom-laden cliff-edge with frangipani and bird-of-paradise, palms tilting from the rim, distant volcanic peak in deep haze',
      'BANYAN-ROOT CLEARING — old banyan clearing with massive aerial-root columns descending from the canopy to the floor, strangler-fig curtains, dappled understory light through high canopy openings, bloom-mass between the root pillars',
      'MANGROVE TIDAL SWAMP — mangrove forest in tidal salt water with stilt-roots descending into the shallows, floating blooms drifting on the brackish water, low tropical haze, mud-flats glistening at edge',
      'CLOUD-FOREST WATERFALL WITH MOSSY BOULDERS — high-elevation cloud-forest waterfall cascading over moss-covered boulders, mist-saturated air, hanging orchids on the cliff-walls, foreground ferns soaked in spray',
      'BANANA-GROVE PATH — banana-grove with massive broad-green banana-leaves arching overhead into a leaf-tunnel, bloom-clusters between the smooth banana-trunks, dappled canopy-light filtering through the broad foliage',
      'HELICONIA THICKET AT VIEWER LEVEL — dense heliconia and torch-ginger thicket at viewer eye-level, jungle wall receding into deep humid blur, fern-fronds and broad leaves overlapping foreground, sun catching the petal-edges',
      'STREAM-EDGE TROPICAL — clear jungle stream flowing over mossy rocks with tropical blooms massing on both banks, dappled canopy-light above, ferns and palms framing the water-corridor, atmospheric haze in deep distance',
      'CENOTE TROPICAL SPRING — natural cenote / tropical hot-spring with steam rising from turquoise water, tropical bloom-edges, hanging vines descending from the rim, light shafts piercing the steam',
      'EPIPHYTE-LADEN OLD-GROWTH TREE — single massive old-growth tropical tree trunk in foreground, covered with epiphytes / bromeliads / hanging orchids / mosses / lichens, jungle receding behind into humid haze',
      'JUNGLE-RUIN BLOOM-RECLAIM — moss-covered Mayan / Khmer / Angkor-style stone block partially visible at the jungle floor in midground, blooms and vines reclaiming the carved surface, dense tropical canopy above',
      'OPEN-CANOPY SUNBEAM CATHEDRAL — large break in the rainforest canopy where vertical sun-shafts bloom down onto a bloom-rich forest-floor opening, vapor-laden beams visible in the humid air, ferns and orchids in the gold',
      'PHILODENDRON-COVERED CLIFF — vertical cliff-wall draped in massive philodendron + monstera + climbing-vine mass, hanging orchids and bromeliads on the rock, jungle floor below in soft humid blur',
      'CLOUD-FOREST RIDGE — cloud-forest ridge in early morning with low mist drifting through the canopy, orchid-laden epiphytes on every branch, blooms catching first light at the ridge-top, valley below disappearing into mist',
      'WATERLILY-LAGOON — wide tropical lagoon completely covered in giant water-lilies and lotus, tropical bloom-edge on the banks, palms tilted at the water-line, distant rainforest receding into haze',
      'SUNLIT JUNGLE CLEARING — bright sunlit clearing in the rainforest with grass + flowering shrubs at ground level, towering rainforest wall surrounding the clearing on all sides, butterflies in the warm air, broad-leaf canopy framing above',
      'PALMS-AND-PASSION-VINE — palm grove with passion-flower vines spiraling up the trunks, broad ferns at the base, dappled canopy light, distant rainforest wall in deep humid blur',
      'BROMELIAD-CHANDELIER OLD GROWTH — old-growth rainforest tree with bromeliads forming chandelier-clusters at branch joints, hanging orchids cascading, epiphyte-mass at every fork, jungle floor below in shadow',
      'TROPICAL-RIVER BEND — tropical river bend with sand-bank in midground, dense rainforest descending to the water on both banks, blooms massing at the water-edge, low river-mist hugging the surface',
    ],
    instructions: `Each entry is ONE specific TROPICAL PARADISE SETTING, 30-60 words. Format: "SETTING NAME CAPS — primary paradise biome features + identifiable tropical vegetation OR coastal/water features + atmospheric depth-recession (humid haze OR salt-haze OR mist)". REBALANCE — ~30% beach/coast, ~25% lagoon/water, ~20% waterfall/pool, ~15% jungle/rainforest, ~10% mangrove/mixed. ALWAYS identifiably tropical (palms / hibiscus / plumeria / frangipani / banana / sea-grass / coconut-grove / mangrove / etc.). NEVER temperate / alpine / desert / arctic. NO people, NO boats with sailors, NO huts with hands. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── tropical-paradise path: vegetation_anchor (the paradise scaffolding) ───
  bloombot_tropical_paradise_vegetation_anchor: {
    format: 'simple',
    theme: `TROPICAL PARADISE VEGETATION ANCHORS for the BloomBot tropical-paradise path. Each entry is ONE specific tropical-vegetation scaffolding element that gives the paradise scene its identifiable tropical structure — coastal palms, beach flora, jungle vegetation, lagoon plants, anything that reads "tropical paradise". Each entry 20-40 words.

⚠️ MANDATORY — every entry implies a TROPICAL VEGETATION TYPE that scaffolds the bloom hero. Not the blooms themselves — the surrounding green that says "tropical paradise". Cover BOTH coastal/beach contexts AND jungle contexts.

🚫 STRICT BANS:
  • NO temperate trees (oak / pine / birch / maple) — except where mentioned as a contrast
  • NO buildings / architecture / sails / boats (not the paradise's job)
  • NO people / hands / figures
  • NO duplication of tropical_setting content — this is about specific PLANT FORMS not the whole biome

✓ VEGETATION-ANCHOR CATEGORIES — REBALANCE for coast + jungle:
  • **COASTAL PALMS (~25%)** — coconut palm / royal palm / fishtail palm / fan palm / date palm / sea-palm / areca palm / palm-grove fringing a beach
  • **COASTAL / BEACH FLORA (~20%)** — frangipani tree / plumeria / hibiscus shrub / sea-grape / beach morning-glory / sea-grass / pandanus screw-pine / oleander / bougainvillea cascade over coastal wall
  • **JUNGLE PALMS + BANANA + GINGER (~15%)** — banana plant / heliconia clump / bird-of-paradise plant / ginger plant / canna / strelitzia
  • **JUNGLE VEGETATION (~15%)** — banyan tree / strangler-fig / aerial-root curtain / buttress-root tree / climbing philodendron / monstera / split-leaf foliage
  • **EPIPHYTE / ORCHID / BROMELIAD (~10%)** — moss-covered branches / epiphyte-laden tree / bromeliad-clusters / hanging orchid mass
  • **FERN + CYCAD + BAMBOO (~10%)** — tree-fern grove / staghorn fern / bromeliad-pineapple / pandanus / bamboo thicket
  • **MANGROVE + AQUATIC (~5%)** — mangrove stilt-roots / mangrove pneumatophores / lotus-and-waterlily mats / coastal sea-grass beds

Channel: Hawaiian / Tahitian / Bali / Caribbean / Polynesian tropical-paradise plantings + Planet Earth tropical-paradise close-ups + James Cameron's Avatar Way of Water + Endless Summer beach-fringe vegetation + Studio Ghibli paradise plants.`,
    touchpoints: [
      'COCONUT PALMS TILTING — cluster of coconut palms tilting outward at varying angles, fronds catching dappled sun, trunks ringed with old leaf-bases, distant jungle in soft humid blur',
      'BANANA-GROVE WITH BROAD LEAVES — banana-plant grove with massive broad-green leaves arching overhead and to the sides, smooth pale trunks visible behind, dappled canopy-light filtering through the broad foliage',
      'BANYAN AERIAL ROOTS — massive banyan tree with aerial roots descending in vertical columns to the jungle floor, strangler-fig curtains, dappled understory light, blooms between the root pillars',
      'MONSTERA-CLAD TRUNK — old-growth trunk in foreground completely clad in climbing monstera-and-philodendron with split-leaf foliage and aerial roots, the trunk barely visible behind the vine-curtain',
      'TREE-FERN GROVE — Jurassic-feel grove of old tree-ferns with massive umbrella-fronds arching overhead and surrounding the camera, cool dappled understory light, mossy boulders at the base',
      'HANGING LIANA CURTAIN — vertical curtain of hanging lianas and vines descending from canopy to the jungle floor, swaying slightly in humid air, blooms threaded through the curtain, atmosphere in the deep behind',
      'EPIPHYTE-LADEN OLD BRANCH — single massive horizontal branch in foreground covered with bromeliads / hanging orchids / mosses / staghorn ferns at every fork, jungle below in soft shadow',
      'BROMELIAD-CHANDELIERS — bromeliad-cluster chandeliers at every branch joint of an old-growth rainforest tree, water pools visible in some bromeliad rosettes, hanging orchids cascading from the same fork',
      'BAMBOO GROVE — dense bamboo grove with tall green canes filling the frame, gentle bamboo-rustle in tropical breeze implied, dappled canopy light filtering through the cane-tops',
      'MANGROVE STILT-ROOTS — mangrove stilt-roots descending into shallow tidal water, mud-flats glistening between the roots, mangrove canopy above in soft humid haze',
      'GIANT KAPOK TREE — towering jungle kapok / ceiba / silk-cotton tree with massive buttress-roots, the trunk continuing upward beyond the upper frame, smaller jungle vegetation at the buttress-base',
      'CYCAD-AND-BROMELIAD GARDEN — primordial cycad-and-bromeliad garden floor, leathery cycad fronds and rosette-bromeliads massing at ground level, larger jungle vegetation looming above in shallow blur',
      'PANDANUS SCREW-PINE — pandanus / screw-pine cluster with spiral leaves and stilted prop-roots, distinctively tropical silhouette, jungle wall behind in soft humid blur',
      'STAGHORN FERN COLONY — staghorn-fern colony attached to a vertical tree-trunk, antler-shaped fronds extending outward, smaller epiphytes at the base of the colony',
      'COCONUT-PALM CANOPY — view UP at a coconut-palm canopy with green-and-yellow fronds radiating outward like a wheel, coconuts clustered at the crown, sky glimpsed between the fronds',
    ],
    instructions: `Each entry is ONE specific TROPICAL VEGETATION TYPE that scaffolds the jungle scene, 20-40 words. Format: "VEGETATION NAME CAPS — primary plant form + secondary detail + how it sits in the jungle frame". Vary across the 12 categories above. ALWAYS tropical. NEVER temperate / alpine / arctic / desert. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── tropical-paradise path: surprise_creature (60%-gated wildlife) ───
  bloombot_tropical_paradise_surprise_creature: {
    format: 'simple',
    theme: `60%-GATED TROPICAL WILDLIFE SURPRISES for the BloomBot tropical-paradise path. Each entry is ONE specific small tropical creature that adds life to the jungle scene as a peripheral subject. Each entry 20-40 words.

⚠️ MANDATORY — every creature is SMALL relative to the scene, peripheral, second-look reward — NEVER primary subject. Must be IDENTIFIABLY TROPICAL.

🚫 STRICT BANS:
  • NO humans / figures
  • NO temperate wildlife (deer / squirrel / fox / hawk — wrong biome)
  • NO predator-of-people / big cats stalking the frame (too dramatic)
  • NO duplication of vegetation_anchor content — this is creature, not plant

✓ TROPICAL-CREATURE CATEGORIES:
  A. **TROPICAL BIRD** — toucan / parrot / macaw / hummingbird / hornbill / quetzal / lorikeet / bird-of-paradise (bird) / kingfisher / hoatzin
  B. **POISON-DART FROG / TREE-FROG** — neon-blue poison-dart frog / red-eyed tree-frog / glass-frog / golden-frog
  C. **REPTILE** — iguana / chameleon / gecko / anole / basilisk-lizard
  D. **INVERTEBRATE — INSECT** — blue morpho butterfly / atlas moth / orchid mantis / leaf insect / stick insect / glass-wing butterfly
  E. **INVERTEBRATE — ARACHNID** — peacock spider / colorful jumping spider / pink-toed tarantula (peripheral only)
  F. **SMALL MAMMAL** — tree-frog small monkey peeking / sloth on a branch / coati / agouti / kinkajou
  G. **POLLINATOR — TROPICAL BEE** — orchid bee / stingless bee / sweat bee
  H. **AQUATIC** — koi at pond's edge / tropical fish glimpsed under water-lilies / freshwater turtle / small caiman at water's edge
  I. **HUMMINGBIRD-AT-BLOOM** — solitary tropical hummingbird hovering at a heliconia / hibiscus / passion-flower
  J. **PARROT-ON-BRANCH** — solitary parrot / lorikeet / cockatoo perched at a branch with bloom-clusters nearby

Channel: Planet Earth tropical close-ups + David Attenborough macro reverence + nature-photography hero shots.`,
    touchpoints: [
      'HUMMINGBIRD HOVERING AT HELICONIA — solitary jewel-throated tropical hummingbird hovering mid-air at a foreground heliconia bloom, wings a transparent blur, beak just grazing the bract, body iridescent emerald and ruby',
      'BLUE MORPHO BUTTERFLY MID-FLIGHT — solitary blue morpho butterfly caught mid-flight in midground, wings electric-cobalt with translucent edges, body in motion-blur, jungle backdrop in soft humid haze',
      'POISON-DART FROG ON LEAF — solitary neon-blue poison-dart frog on the underside of a broad foreground leaf, body crisp at macro scale, fluorescent skin catching dappled light',
      'TOUCAN PERCHED ON BRANCH — solitary keel-billed toucan perched on a midground branch, oversized rainbow beak crisp, body in soft shallow-DOF, jungle canopy behind in humid blur',
      'RED-EYED TREE-FROG — solitary red-eyed tree-frog clinging to a foreground stem, green body with red eyes and orange feet, sticky toe-pads visible, leaf-edge catching light',
      'ORCHID MANTIS ON BLOOM — solitary orchid mantis mimicking an orchid bloom in foreground, pale-pink body with petal-shaped legs, eyes barely visible, perfect camouflage',
      'PARROT CLUSTER ON BRANCH — small cluster of bright-colored parrots / lorikeets on a midground branch with bloom-clusters nearby, vivid color-pop against the jungle green',
      'IGUANA SUNNING ON BRANCH — solitary green iguana sunning on a horizontal branch in midground, body crisp with reptile-detail, dewlap relaxed, distant jungle in humid blur',
      'TROPICAL SLOTH ON BRANCH — solitary three-toed sloth slowly moving on a horizontal branch in midground, fur algae-tinged green, single eye visible, slow motion implied',
      'GLASS-FROG ON LEAF — solitary glass-frog on the underside of a foreground leaf, transparent skin showing internal organs faintly, eyes catching light',
      'KINGFISHER AT WATER-EDGE — solitary tropical kingfisher perched at a water-edge in midground, body iridescent blue-and-orange, water glistening below, ready to dive',
      'CHAMELEON ON BRANCH — solitary tropical chameleon clinging to a small foreground branch, body color-shifted to match the bloom-mass, swiveled eye catching light',
      'KOI BELOW WATER-LILIES — golden koi visible just below the water surface among foreground water-lily pads, scales catching dappled light, water-distortion adding mystery',
      'GECKO ON SUN-WARMED ROCK — solitary brightly-patterned gecko basking on a sun-warmed rock in midground, camouflaged but visible to the eye that finds it',
      'PEACOCK SPIDER ON LEAF — solitary tiny peacock spider on a foreground leaf, body iridescent-jewel-toned, scale-perfect macro detail, jungle backdrop in soft blur',
      'BUTTERFLY MIGRATION CLUSTER — small cluster of tropical butterflies gathered on a foreground bloom-cluster sipping nectar, varied species, iridescent wings catching light',
      'HOATZIN PERCHED — solitary hoatzin (prehistoric-looking tropical bird) perched on a midground branch, mohawk crest visible, distant rainforest in humid blur',
      'POISON-FROG ON BROMELIAD — solitary tropical poison frog cupped in a bromeliad-rosette in midground, water pool visible in the bromeliad center, jewel-detail',
      'PARROT TAKING FLIGHT — solitary parrot caught mid-takeoff from a midground branch, wings spread, motion-blur on the wingtips, bloom-cluster left behind on the branch',
      'TREE-FROG IN BLOOM-CUP — solitary tropical tree-frog tucked into a foreground bloom-cup, eyes peeking out over the petal-edge, body camouflaged against the cup interior',
    ],
    instructions: `Each entry is ONE specific SMALL TROPICAL CREATURE as a peripheral / second-look reward, 20-40 words. Format: "CREATURE NAME CAPS — primary creature + macro detail + position in frame". Vary across the 10 categories above. ALWAYS small / peripheral / never primary. ALWAYS tropical. NO humans, NO temperate wildlife. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── landscape path: phenomenon (80%-gated conditional drama) ───
  bloombot_landscape_phenomenon: {
    format: 'simple',
    theme: `80%-GATED ATMOSPHERIC PHENOMENA for the BloomBot landscape path. Each entry is ONE specific dramatic moment that CRANKS the scene from beautiful to unforgettable. Each entry 25-50 words.

⚠️ MANDATORY — every phenomenon AMPLIFIES the bloom-landscape's drama. The phenomenon is the "wow moment" — the thing that would stop a viewer mid-scroll. It dominates a quadrant of the frame but doesn't replace the bloom-carpet.

🚫 STRICT BANS:
  • NO humans / vehicles / planes / drones / spaceships
  • NO surreal physics / floating / gravity-defying (dreamscape's job)
  • NO architecture / buildings / ruins
  • NO duplication of sky-layer content (rainbow / aurora / storm — those are sky, not phenomenon)
  • NO "rain falling" alone (too quiet) — must be a SPECIFIC visible drama

✓ MANDATORY VARIETY — distribute across:
  A. **VOLUMETRIC LIGHT MAGIC** — fire-ray god-rays piercing storm-clouds onto a specific bloom-patch, sunbeams through forest-edge mist, light-pillars in cold air
  B. **DRAMATIC WEATHER MOMENT** — distant lightning fork striking a ridge / mountain-wave cloud over a peak / waterspout offshore / dust-devil dancing across the meadow / hail-curtain in midground
  C. **POLLINATOR SPECTACLE** — butterfly migration cloud / bee-swarm column / monarch wave / starling murmuration twisting / firefly cloud at dusk
  D. **WILDLIFE-EVENT** — bird-flock taking off from the bloom-carpet en masse / wild-horse stampede / deer-herd in motion / whale breach offshore (coastal landform) / wolf-pack crossing
  E. **GEOLOGIC MOMENT** — distant volcanic eruption with ash-column / geyser eruption in the meadow / rockfall down a cliff / glacier-calving / steam-vents in active eruption
  F. **HYDROLOGIC SPECTACLE** — flash-flood ribbon wall of water descending a canyon / waterfall-roar visible in spray / river-bend mirror-perfect / wave-set detonating in synchrony on a coast / spring meltwater explosion
  G. **CELESTIAL EVENT** — meteor / shooting-star streak / comet visible in dusk sky / solar-eclipse halo (corona) / planetary-conjunction line
  H. **THERMAL / OPTICAL** — heat-shimmer visible across the meadow / fata-morgana mirage on the horizon / dust-storm wall in deep distance / fire-rainbow / circumzenithal arc
  I. **FROST / ICE MOMENT** — first frost crystals on bloom-petals / hoar-frost on every stem / ice-storm coating bloom-stalks / frozen-fog rime on the meadow
  J. **WIND-EVENT** — visible wind-wave rolling across the bloom-field / dust-devil column dancing / cottonwood-fluff blizzard in mid-air / pollen-cloud explosion

Channel: Planet Earth slow-motion drama + Storm-chaser cinematography + BBC natural-event captures + Roger Deakins atmospheric setpieces.`,
    touchpoints: [
      'FIRE-RAY GOD-RAYS PIERCING STORM-EDGE — volumetric warm-amber god-rays piercing through a storm-cloud break onto a specific patch of bloom-meadow in midground, the patch glowing hot-gold while the rest is in storm-shadow',
      'BIRD-FLOCK MASS TAKE-OFF — vast flock of birds (starlings / grackles / waxwings) lifting off the bloom-carpet en masse, hundreds of wings beating, a shadow-cloud rising into the sky',
      'WILD-HORSE STAMPEDE CROSSING — small wild-horse herd at full gallop crossing the midground bloom-meadow from left to right, dust-and-petal trail behind them catching the light, mane-and-tail in motion',
      'DISTANT VOLCANIC ERUPTION — distant volcano in deep background mid-eruption, ash-column rising vertically into the upper sky, lava-glow on the cone, bloom-meadow in foreground under amber ash-light',
      'BUTTERFLY MIGRATION CLOUD — vast cloud of migrating monarchs passing through the meadow in dense flickering profusion, the air thick with wings, individual butterflies visible at every depth',
      'FLASH-FLOOD CANYON RIBBON — vertical ribbon of fast water descending a canyon side-wall in deep midground from a distant cloudburst, white spray-bloom at the impact zone, dramatic hydrologic moment',
      'SHOOTING-STAR DUSK STREAK — single bright meteor-streak crossing the dusk sky in a quick diagonal, leaving a glowing trail across upper frame, bloom-meadow in twilight blue below',
      'HEAT-SHIMMER ACROSS MEADOW — visible heat-shimmer wave distorting the air above the bloom-carpet in midground, distant ridges wobbling, summer-noon thermal magic',
      'FIRST-FROST CRYSTALS ON PETALS — first hoar-frost crystals on the bloom-petals catching the first morning sun in glittering points, the meadow transformed from soft to sharp, optical magic',
      'VISIBLE WIND-WAVE ACROSS FIELD — visible wind-gust rolling across the bloom-field like wind on water, hundreds of stems bending in a single moving wave, the eye reads scale through the wave',
      'WHALE-BREACH OFFSHORE — humpback whale breach visible offshore from a coastal bloom-cliff, full-body launch from the swell, splash-explosion in deep midground, scale-moment for the cliff',
      'METEOR-SHOWER MULTIPLE STREAKS — multiple shooting-stars streaking simultaneously across the night sky over the bloom-meadow, persistent trails marking each path, dark-sky magic',
      'POLLEN-CLOUD EXPLOSION — visible dense cloud of golden pollen-dust erupting from a bloom-cluster mid-frame in a gust of wind, the air thick with floating pollen catching the side-light',
      'FROZEN-FOG RIME ON MEADOW — meadow coated in white frozen-fog rime crystals on every blade and stem, the entire bloom-carpet glittering white, sun catching it in a million sparkle-points',
      'GEYSER ERUPTION IN MEADOW — natural geyser eruption from the bloom-meadow itself in midground, vertical steam-and-water column rising 30 metres, hot springs in the surrounding ground',
      'WATERFALL ROAR WITH SPRAY-CROWN — major waterfall in deep midground in full-flow, spray-cloud crowning above it catching a rainbow in the sun-mist, bloom-meadow in foreground misted by the spray',
      'CIRCUMZENITHAL ARC — rare upside-down rainbow (circumzenithal arc) high in the upper sky above the bloom-meadow, vivid spectrum arc, atmospheric ice-crystal magic',
      'WOLF-PACK CROSSING MEADOW — small wolf-pack crossing the bloom-meadow in line in midground, alpha leading, ears-forward, scale-prover plus dramatic predator-moment',
      'DISTANT WATERSPOUT — single waterspout twisting from a coastal storm-cloud down to the offshore swell in deep midground, mariner-spectacle, the bloom-cliff in foreground under stormlight',
      'FIREFLY CLOUD AT DUSK — vast cloud of fireflies suspended over the bloom-meadow at dusk, hundreds of green-pulse lights in stereo through the depth of the meadow, twilight magic',
    ],
    instructions: `Each entry is ONE specific dramatic atmospheric / wildlife / geologic / hydrologic / celestial PHENOMENON, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visible drama + secondary detail + position in frame". Vary across the 10 categories above. Each phenomenon is the "stop-the-scroll wow moment" but doesn't replace the bloom-carpet. NO humans, NO vehicles, NO architecture, NO surreal physics. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },
  // ─── forest-fairy-scene path (2026-05-20 axis-system migration, 10 axes) ───
  faebot_forest_fairy_scene_creature: {
    format: 'simple',
    theme: `STACKED-EXOTIC MYTHIC FOREST CREATURE for FaeBot's forest-fairy-scene path. Each entry is ONE unified description of a single mythic plant-merged forest spirit — dryad / naiad / Leshy / kodama / fox-spirit / glow-moth fairy / vine-nymph / hamadryad / forest queen / pixie / green-man / meliae / etc. Each entry 50-90 words. 5+ stacked exotic features per creature.

⚠️ THE BAR: each creature reads as a SINGLE coherent mythic being. NOT a list — a unified painted-fantasy character description. Otherworldly mythic-creature beauty, NEVER human-model beauty. Hidden-camera candid posture — NEVER posing, NEVER eye-contact, NEVER pinup.

⚠️ EVERY ENTRY MUST include AT LEAST 5 of these stacked exotic feature categories:
  - SPECIES LINEAGE — dryad / naiad / Leshy / kodama / hamadryad / pixie-sprite / fae queen / nymph / fox-spirit / glow-moth-fae / vine-nymph / green-man / meliae / sidhe / banshee-spirit / etc.
  - SKIN TREATMENT — translucent with constellations / bark-textured / moss-tinted olive / bioluminescent-freckled / mottled green-flecked / luminous pearl / silver-bark patches / lichen-detail / pale-jade / etc.
  - PLANT-MERGED HAIR — living vines woven with blooms / river-water flowing / pale willow-fronds / wisteria-petals cascading / moss tendrils with asphodel / dark pine-needles crowned with antlers / silver-leaf cascade / cherry-blossom braided / autumn-leaf flowing / etc.
  - PLANT-MERGED GARMENT — petal-shawl / leaf-bodice woven of ferns / vine-skirt / silk-petal wrap / overlapping rose-petals / moss-skirt with woven ivy / cape of willow-leaves / draped garland of clematis / birch-bark tunic / overlapping calla-lily / etc.
  - ANATOMICAL EXTRAS — small antlers branching with leaves / luna-moth wings / dragonfly wings veined with sap / three fox-tails / multiple delicate gills / third eye glowing / pointed feathered ears / vertical-slit pupils / branching deer-antlers / bird-spine / etc.
  - MAGICAL SIGNATURE — glowing pearl-iris eyes / glowing vein-patterns under skin / soft halo of pollen-light / will-o-wisp hovering nearby / luminescent freckles / glowing-amber eyes / pale luminous-aura / fingertips trailing sparkles / etc.
  - CANDID POSTURE/MOMENT — kneeling pressing palm to roots / crouched over a tiny mushroom / standing waist-deep in a moonlit pool / half-emerged from ancient trunk / sitting cross-legged on fern-cushion / perched on moss-covered stone / side-profile leaning against bark / etc.

⚠️ SPECIES DISTRIBUTION (across 25 entries):
  • ~5 DRYADS (oak / birch / rowan / willow / ash / cherry-blossom / pine)
  • ~3 NAIADS (river / pond / waterfall / brook / spring)
  • ~3 LESHY / GREEN-MAN (forest-spirit elders, masculine register OK)
  • ~3 NYMPHS (moonlight / vine / flower / forest)
  • ~3 PIXIE / FAE-COURT (queen / sidhe / Tylwyth Teg)
  • ~3 ANIMAL-MERGED SPIRITS (fox-spirit / owl-fae / deer-spirit / swan-maiden)
  • ~2 INSECT-FAE (glow-moth / pixie-dragonfly / firefly-fae)
  • ~2 KODAMA / WOODLAND-SPRITE (smaller mythic beings)
  • ~1 RARE / OTHERWORLDLY (Meliae / hamadryad / banshee-spirit)

🚫 ABSOLUTE BANS:
  • NO human-model beauty / NO pin-up / NO sexualized framing
  • NO posing for camera / NO direct eye-contact with viewer
  • NO modern attire / NO contemporary references
  • NO scared / angry / edgy / dark moods (peaceful-fairy register only)
  • NO "small figure in distance" — she's the focal subject
  • NO ethnic-codes from real-world cultures — fantasy-canon only
  • NO closed-eyes (she's awake and present in the moment)`,
    touchpoints: [
      'An oak-dryad with bark-textured shoulders fading to smooth moss-tinted skin and long hair of living vines woven with tiny yellow blossoms, leaf-petal bodice and moss-skirt of woven ferns, small antlers branching with fresh oak-leaves, kneeling with one palm pressed to ancient roots as soft amber light filters from her veins, glowing-amber eyes lowered to the earth in quiet blessing',
      'A naiad with translucent skin showing tiny constellations beneath and hair of river-water flowing slowly past her waist, draped petal-shawl over a band of folded leaves, softly glowing pearl-iris eyes radiating gentle light, standing waist-deep in a moonlit pool with cupped palms holding liquid starlight, delicate gills along her neck shimmering faintly',
      'A Leshy lord with bark-textured skin showing faint glowing vein-patterns and hair of dark pine-needles crowned with branching antlers sprouting tiny oak-leaves, loose tunic woven of birch-bark strips, eyes like deep forest amber, half-emerged from an ancient trunk with one shoulder merged into bark, weathered face turned in profile',
      'A fox-spirit with mottled green-flecked skin like dappled forest light and hair of pale willow-fronds threaded with foxglove blooms, thin wrap of silk-petal across chest with vine-skirt, three fox-tails tipped in silver, luminous amber eyes with vertical-slit pupils, crouched over a tiny mushroom-cluster in candid examination',
      'A moonlight nymph with bioluminescent freckles tracing her collarbone and hair of moss tendrils with white asphodel buds, shoulder-strap of woven vine and skirt of overlapping calla-lily petals, third eye glowing softly on her forehead, perched on moss-covered stone with a will-o-wisp hovering above her cupped hand',
      'A glow-moth fairy with pale luminescent pearl skin and wisteria-petal hair cascading past her waist, translucent luna-moth wings folded against shoulder-blades, snug bodice of overlapping rose-petals fading to gauzy mist below hip, sitting cross-legged on a fern-cushion with softly glowing pollen-motes drifting from her fingertips',
      'A swan-maiden with translucent skin showing tiny constellations and hair of pale willow-fronds woven with single white moonflowers, cape of overlapping willow-leaves draped across shoulders, delicate gills along her graceful neck, luminous pearl-iris eyes lowered, standing at water-edge with a halo of soft pollen-light',
      'A vine-nymph with lichen-detail on cheekbones and moss-tinted gold-olive skin, hair of living vines woven with tiny purple clematis blooms, draped garland of ivy across torso with low vine-skirt, tall pointed ears feathered with down, half-turned profile leaning against moss-covered bark, vine-tendrils sprouting from her wrist',
      'A rowan-dryad with bark-textured shoulders fading to smooth moss-tinted skin and hair of living vines woven with tiny crimson rowan berries, draped garland of ivy across collarbone, small antlers branching with autumn leaves, head bowed as she gathers fallen berries into her cupped palm, autumn light filtering through her hair',
      'A birch-hamadryad with mottled green-flecked skin like dappled forest light and waist-long hair of pale willow-fronds threaded with white moonflowers, thin wrap of pale silk-petal across her chest, third eye glowing softly on her forehead, side-profile leaning her cheek against ancient birch bark in silent communion',
      'A cherry-blossom dryad with porcelain-pale skin showing the faintest pink undertones and hair of dark moss threaded with pink cherry-blossom branches, draped bodice of overlapping silk-petals, small antlers crowned with cherry-blossom buds, branching from her temples, sitting on a moss-cushion catching a drifting petal',
      'A willow-dryad with silver-bark patches on her arms and hair of pale willow-fronds cascading past her waist, draped cape of overlapping willow-leaves, glowing-amber eyes lowered, kneeling beside a slow brook with one palm dipped into the water, weeping-willow tendrils framing her face like a curtain',
      'A pixie-sprite of small stature with translucent dragonfly wings veined with sap-gold, hair of pale silk threaded with dewdrop-pearls, leaf-petal bodice and moss-skirt of woven ferns, softly glowing amber eyes, perched on a toadstool rim within a fairy-circle, fingertips trailing tiny sparkles',
      'A fae queen with skin like luminous pearl and subtle vine-pattern marks, floor-length hair of living vines woven with hundreds of tiny white flowers, flowing gown of woven petals with long trailing fern-fronds at the hem, regal cape of fern-fronds and antler-crown woven with honeysuckle, seated upon a moss-throne, gaze cast downward in benediction',
      'A sidhe noblewoman with porcelain-pale skin with bioluminescent freckles tracing her collarbone, elaborate braided hair of dark moss with violet wisteria flowing past her waist, regal cloak of fern-fronds over a layered robe of overlapping willow-leaves, vine-belted waist, walking slowly through a sacred stone-circle at twilight',
      'A green-man with face composed entirely of overlapping oak leaves and moss-beard cascading to his chest, bark-textured shoulders fading into moss-tinted skin, half-hidden among a fern-grotto wall, tiny white wildflowers blooming from his temples, luminescent moss glow emanating from his eye-hollows, lichen detail covering his skin',
      'A meliae ash-tree nymph with silver-bark patches on her arms and small sprouting leaves emerging from her cheekbones, hair of dark moss with violet wisteria, draped garland of ash-leaves, crouched over a tiny seedling to whisper blessing as soft violet-twilight magic glows from her hands, wisteria draping her shoulders',
      'An owl-fae with mottled bark-textured skin and feathered hair of pale willow-fronds with single white moonflowers, owl-feather cape draped across shoulders, large pearl-iris eyes with horizontal-slit pupils, sitting motionless on a high mossy branch in profile, weathered face turned to one side listening to forest sounds',
      'A deer-spirit with mottled green-flecked skin and hair of dark moss threaded with autumn-leaves, draped cape of overlapping willow-leaves, large branching deer-antlers crowning her head, soft fawn-marks dotting her shoulders, kneeling at the edge of a forest-pool with one hand brushing the water',
      'A firefly-fae with luminous pearl skin and hair of silver-leaf cascading past her waist, translucent dragonfly wings veined with gold, snug bodice of overlapping luminescent petals, softly glowing fingertips trailing fairy-light, sitting on a moss-stone with her cupped palm holding a cluster of fireflies',
      'A kodama tree-spirit with round white head and gentle painted eyes, slender translucent body merging with mossy bark, bobbing politely beside a mushroom ring, tiny violets blooming where its translucent feet touch moss, soft pearl-glow haloing its small form, ancient lichen detail on its small hands',
      'A Tylwyth Teg sidhe with cascading silver hair threaded with gold-leaf and dewdrop-pearls, layered robe of overlapping willow-leaves with vine-belted waist and floor-length train, porcelain skin with faint constellation freckles, walking slowly through a moonlit wisteria-archway in regal procession',
      'A banshee-spirit with translucent silver-grey skin and hair of cool mist flowing past her waist, draped cape of woven cobweb and willow-leaves, ghost-white pearl-iris eyes, hovering just above ground in a misty pine-grove, fingertips trailing slow-drifting cold-pollen, mournful gentle bearing not aggressive',
      'A flower-dryad with porcelain skin showing faint pink undertones and hair of cherry-blossom branches with single white moonflowers woven through, draped bodice of overlapping rose-petals, small antlers crowned with foxglove-bells, kneeling in a meadow with palm extended to a hovering will-o-wisp, soft pollen-light haloing her face',
      'A pine-dryad with bark-textured shoulders and hair of dark pine-needles woven with pine-cones, draped cape of pine-bough, weathered amber eyes, small antlers branching with fresh pine-sprouts, standing tall against an ancient pine trunk with one shoulder merged into bark, weathered hands resting at her sides',
    ],
    instructions: `Each entry is ONE unified mythic forest creature description, 50-90 words. Format: prose, comma-separated phrases. MANDATORY — 5+ stacked exotic features (species + skin + plant-merged hair + plant-merged garment + anatomical extras + magical signature + candid posture). NO human-model beauty. NO posing. NO eye-contact. NO modern attire. NO scared/edgy moods. NO real-world ethnic codes. NO closed-eyes. NO "small figure in distance". Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_forest_fairy_scene_biome: {
    format: 'simple',
    theme: `FOREST BIOME for FaeBot's forest-fairy-scene path. Each entry describes ONE specific forest setting type with its signature features — pure WHERE (the wrapping backdrop). Each entry 30-55 words.

⚠️ THE BAR: each biome reads as a distinct deep-wild-forest environment with painted-fantasy gallery-tier visual richness. Multi-tier depth (foreground tactile detail + midground holding her + background fading into atmospheric depth). NEVER generic "forest" — always a specific type with named features.

⚠️ BIOME CATEGORIES (across 25 entries):
  • ~4 ANCIENT OAK GROVE / SUN-CATHEDRAL — soaring oak cathedrals with god-ray-piercing canopy, massive twisted roots, emerald moss-covered floor
  • ~3 FERN GROTTO — moss-covered boulders cradling a hidden grove, tall fern-fronds, dripping springs
  • ~3 WILLOW THICKET — cascading willow-trees along a slow stream, dappled water reflections, weeping-branch curtains
  • ~3 BIRCH GLADE — pale-bark birch grove with delicate canopy, scattered fairy-rings of mushrooms
  • ~3 REDWOOD / PINE CATHEDRAL — towering trunks reaching impossible heights, deep needle-carpet, soaring scale
  • ~2 BLUE-GROTTO / BIOLUMINESCENT GLEN — bioluminescent moss + glowing mushrooms + cave-mouth grotto
  • ~2 AUTUMN-BLAZE MAPLE GROVE — orange/red/gold canopy, falling leaves, golden afternoon light
  • ~2 SNOWY PINE FOREST — frost-dusted pines, gentle snow on forest floor, breath-mist atmosphere
  • ~2 MOSS-CANYON / OLD-GROWTH RAVINE — moss-covered cliff walls, vertical scale, hidden grotto feel
  • ~1 CHERRY-BLOSSOM GROVE — pink-blossom canopy, drifting petal-snow, ethereal magical register

⚠️ EVERY entry MUST include:
  - SPECIFIC FOREST TYPE (named tree species + structural register)
  - 2+ SIGNATURE FEATURES (mossy stream / fairy-ring / fern-grotto / ancient roots / canopy detail)
  - MULTI-TIER DEPTH implied (foreground / midground / background)

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO lighting / weather description (separate axes)
  • NO modern setting / urban elements
  • NO IP / pop-culture references
  • NO "small figure" — biome is pure environment`,
    touchpoints: [
      'Ancient oak sun-cathedral with massive twisted gnarled roots like sleeping dragons across the foreground earth, towering oak trunks rising impossibly tall to a vaulted canopy of layered emerald leaves, soft amber-and-emerald painted depth fading into atmospheric background mist, mossy boulder clusters and lichen-rich bark patterns',
      'Fern-grotto cradled by moss-covered boulders, tall lacy fern-fronds dominating the foreground at chest-height, a quiet spring trickling between the rocks midground, ancient ferns layered in painted depth fading into soft green mist, painted gallery-tier richness',
      'Willow-thicket along a slow forest stream, cascading weeping-willow branches creating natural curtains in the foreground, dappled water reflections shimmering midground, distant willow-grove fading into soft pearl-mist, painted-fantasy reflective register',
      'Birch glade with pale-bark slender trunks rising tall and graceful, scattered mushroom fairy-ring at her feet, lacy birch canopy creating dappled light patterns across the moss-floor, distant birches fading into atmospheric haze, ethereal painted register',
      'Redwood cathedral with massive ridged ancient trunks rising into a soaring canopy 100 feet above, deep cinnamon-red needle-carpet across the forest-floor, painted gallery-tier scale, distant trunks receding into soft red-brown atmospheric depth',
      'Pine cathedral with towering ancient pine trunks creating natural columns, deep needle-carpet softening every step, single pine-bough drooping across the foreground frame, distant pine-trunks fading into soft blue-green mist, soaring scale painted register',
      'Blue grotto with bioluminescent moss covering ancient cave-walls in soft cyan glow, cluster of glowing mushroom-spires emerging from the moss, hidden grotto-pool reflecting the bioluminescent light, painted gallery-tier magical register',
      'Bioluminescent glen with glowing moss carpeting the forest-floor in soft cyan-and-violet, cluster of pearl-glowing mushrooms ringing a small pool, ancient ferns silhouetted by the soft glow, magical painted depth fading into deep-blue forest beyond',
      'Autumn-blaze maple grove with brilliant orange-red-gold canopy overhead, scattered fallen leaves carpeting the forest-floor in painted depth, ancient maple trunks rising in painted silhouette, distant trunks fading into warm-amber atmospheric haze',
      'Autumn oak grove with russet-and-gold canopy filtering golden light, fallen acorns and oak-leaves carpeting the forest-floor, gnarled oak roots crossing the foreground, distant grove fading into warm amber-painted depth, autumn-storybook register',
      'Snowy pine forest with frost-dusted pine boughs draped overhead, gentle snow blanket across the forest-floor and ancient stumps, single pine-bough heavy with snow drooping across the foreground, distant pines silhouetted in soft cool-blue mist',
      'Winter birch glade with snow softening every surface, pale birch-bark silhouettes ringing a small frozen pool, scattered winter-berries dotting the snow, distant birches fading into pearl-grey winter mist, hushed painted register',
      'Moss-canyon with vertical moss-covered cliff walls towering on either side, ancient ferns clinging to the cliff faces, hidden grotto-pool at the canyon-floor, single shaft of green-filtered light from above, painted vertical-scale register',
      'Old-growth ravine with moss-covered ancient roots clinging to the ravine walls, dripping ferns cascading from above, hidden grotto floor with a small stream, single shaft of warm light from the canopy gap, painted gallery-tier richness',
      'Cherry-blossom grove with pink-blossom canopy creating a painted ceiling overhead, drifting petals filling the air across the painted depth, single mossy stump at her feet, distant blossom-grove fading into soft pearl-pink mist, ethereal magical register',
      'Wisteria-cathedral archway with cascading violet wisteria clusters draping overhead like a natural cathedral, moss-grown path leading into the depth, dappled violet-and-gold light filtering through, distant wisteria fading into soft pearl-mist',
      'Mushroom-ring grotto with massive ancient mushroom-spires ringing the forest clearing, soft pearl-glow emanating from their gills, deep moss-carpet across the forest-floor, distant mushroom-spires fading into atmospheric depth, magical painted register',
      'Hidden glen with a small forest-pool reflecting the canopy, mossy boulders ringing the pool, ancient ferns cascading from the surrounding bank, deep emerald-and-amber painted depth, gallery-tier reflective register',
      'Forest waterfall grotto with a soft cascading waterfall in the midground over moss-covered rocks, hidden grove-pool at the base, fern-fronds arching across the foreground, distant grotto fading into soft mist, painted depth richness',
      'Beech grove with smooth grey-bark beech-trunks rising tall, scattered beech-nuts on the forest-floor, dappled canopy creating intricate light patterns, distant beech grove fading into warm amber-green mist, painted register',
      'Ancient yew grove with twisted dark-green yew-trees ringing a sacred clearing, weathered standing-stones half-buried in moss, fern-cluster at the foreground, distant yew grove fading into deep blue-green mystery',
      'Aspen grove with pale-bark slender aspens trembling in the air, golden-yellow autumn leaves carpeting the forest-floor, distant aspens fading into soft golden mist, painted golden register',
      'Hemlock cathedral with towering ancient hemlock trees forming natural columns, deep needle-carpet across the forest-floor, hanging-moss curtains draping from the branches overhead, distant hemlocks fading into deep emerald-shadow depth',
      'Cedar-grove with soaring cedar trunks rising into a layered canopy, deep cedar-needle carpet, scattered fern-fronds emerging through the needles, distant cedar grove fading into rich brown-green painted depth',
      'Magnolia grove in early spring with large white magnolia-blossoms suspended overhead like painted lanterns, soft fallen petals on the forest-floor, distant magnolias fading into soft pearl-pink mist, painted gallery-tier spring register',
    ],
    instructions: `Each entry is ONE specific FOREST BIOME, 30-55 words. Format: prose, comma-separated phrases. MANDATORY — (a) named forest type with tree species, (b) 2+ signature features, (c) multi-tier depth implied (foreground/midground/background). NO creature description. NO lighting/weather. NO modern. NO IP. NO small-figure. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_forest_fairy_scene_lighting: {
    format: 'simple',
    theme: `LIGHTING (time-of-day + light drama) for FaeBot's forest-fairy-scene path. Each entry describes ONE specific time-of-day + light moment combination. Each entry 25-45 words.

⚠️ THE BAR: each entry establishes a SPECIFIC light moment with dramatic potential — NOT generic "soft light". Painted-fantasy lighting drama: god-rays piercing canopy, moonlit silver shafts, blue-hour warm under-light, pearl-mist dawn beams, bioluminescent ambient. Light is its own character in the frame.

⚠️ LIGHTING CATEGORIES (across 25 entries):
  • ~5 GOLDEN-HOUR — afternoon god-rays / late-afternoon warm sidelight / golden-amber painted light
  • ~4 BLUE-HOUR / TWILIGHT — cool-blue twilight with warm under-light / blue-hour magical glow
  • ~3 DAWN — pearl-mist dawn beams / soft-pink dawn / golden dawn light filtering
  • ~3 MIDDAY GOD-RAYS — midday sun piercing canopy in dramatic shafts / harsh god-ray contrast
  • ~3 MOONLIT — silver moonlight shafts cutting through canopy / blue-moon ambient
  • ~3 BIOLUMINESCENT — soft cyan glow from bioluminescent moss / pearl-glow from mushrooms ambient
  • ~2 STORM-LIT — dramatic dark-grey-blue lighting with pixel-lightning illumination
  • ~2 AURORA-LIT — aurora ambient filtering through canopy

⚠️ EVERY entry MUST include:
  - SPECIFIC TIME-OF-DAY
  - SPECIFIC LIGHT QUALITY (god-rays / shafts / ambient / sidelight / etc.)
  - PALETTE CUE (warm-amber / cool-blue / pearl-pink / cyan-glow / etc.)
  - DIRECTION OR DRAMA (from above / sidelight / under-light / piercing / etc.)

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome description (separate axis)
  • NO weather (separate axis)
  • NO modern light sources (no lamps / no neon / no LED)
  • NO photographic technique language`,
    touchpoints: [
      'Golden afternoon god-rays piercing the canopy in dramatic shafts of warm-amber light, dust-motes catching the beams, soft warm-glow saturating the lower canopy, painted gallery-tier light drama',
      'Late-afternoon warm sidelight raking across the forest from a low angle, long painted shadows stretching across the moss-floor, warm-amber palette with cool-blue shadows, dramatic painted light register',
      'Magic-hour golden light filtering through the canopy with dappled warm patterns across every surface, painted-storybook softness, warm-amber-and-gold palette saturating the painting',
      'Golden afternoon warm sidelight from a low angle creating long painted shadows, warm halo-glow around her hair, cool-blue shadows pooling in the negative space, painted gallery-tier light',
      'Late-afternoon backlight piercing through the canopy behind her creating warm halo-glow on every leaf-edge, soft warm-amber painted register, atmospheric backlit depth',
      'Cool-blue twilight with warm-yellow under-light from glowing moss illuminating the forest-floor, cool-blue ambient overhead, warm-blue contrast painted register, magical twilight drama',
      'Blue-hour twilight with the last warm-orange of sunset bleeding through distant trunks, cool-blue overhead transitioning to warm-amber at the horizon, painted magical twilight register',
      'Magical violet-twilight glow saturating the forest in soft lavender-and-blue, faint pollen-light particles catching the ambient, dreamy painted-fantasy twilight palette',
      'Blue-hour low warm under-light from will-o-wisps illuminating her face from below, cool-blue ambient overhead, dramatic painted-fantasy underlight register',
      'Pearl-mist dawn beams angling low through the canopy in shafts of soft white-gold, drifting mist catching the beams, fresh morning painted register, cool-warm contrast',
      'Soft-pink dawn light filtering through the canopy with rose-gold-and-lavender palette, gentle peaceful painted-storybook register, early-morning warmth',
      'Golden dawn beams angling through the canopy from a low east angle, drifting dust-motes catching the beams, warm-gold painted register, fresh-morning hopeful drama',
      'Midday god-rays piercing the canopy in dramatic vertical shafts of brilliant white-gold, harsh painted contrast between shafted-light and deep-shadow, soaring drama',
      'High-noon canopy-filter with dappled bright-gold patches across every surface, harsh-amber-with-cool-shadow painted contrast, bright midday painted register',
      'Strong midday backlight piercing through the upper-canopy creating dramatic silhouette-edges, warm-gold-and-shadow painted register, dramatic high-contrast lighting drama',
      'Silver moonlight shafts cutting through the canopy creating cool-blue painted shafts illuminating the mossy floor, deep-blue shadow ambient, magical night painted register',
      'Blue-moon ambient flooding the forest with cool silver-blue painted light, soft white-glow on every leaf-edge, magical hushed nighttime register',
      'Moonlit silver-and-violet ambient with distant moon visible through the canopy gap, scattered pixel-stars beyond, deep-blue painted ambient saturating the scene',
      'Soft cyan-glow ambient from bioluminescent moss carpeting the forest floor, gentle teal-and-violet painted illumination, magical bioluminescent register',
      'Pearl-glow from cluster of glowing mushrooms casting soft cyan-warm light onto the surrounding moss, magical bioluminescent painted register with warm-cool contrast',
      'Bioluminescent ambient with the entire forest faintly glowing in soft pearl-cyan from glowing fungi clusters, magical magical painted depth, ethereal register',
      'Dramatic dark-grey-blue storm-lit forest with distant lightning-flash illuminating the canopy in silver flash, dramatic painted-storm register, tension-and-peace contrast',
      'Pre-storm dim painted-amber light with low storm clouds darkening the upper canopy, warm forest-floor still catching gentle light, atmospheric storm-approach register',
      'Aurora-lit canopy with magical green-pink aurora filtering through the upper-pines, painted multi-color ambient on the forest-floor, magical arctic-painted register',
      'Soft aurora ambient with pink-and-green painted curtains visible through the canopy gap, magical northern-forest painted register, mystical color drama',
    ],
    instructions: `Each entry is ONE specific LIGHTING moment, 25-45 words. Format: prose, comma-separated phrases. MANDATORY — (a) time-of-day, (b) light quality (god-rays / shafts / ambient / sidelight), (c) palette cue, (d) direction or drama. NO creature. NO biome. NO weather. NO modern. NO photographic language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_forest_fairy_scene_weather: {
    format: 'simple',
    theme: `WEATHER (air condition + particle motion) for FaeBot's forest-fairy-scene path. Each entry describes ONE specific atmospheric air condition + particle motion. Each entry 20-40 words.

⚠️ THE BAR: each entry establishes a SPECIFIC air condition with particle motion adding painted-storybook depth. NEVER generic "atmospheric" — always named particles + air quality. Weather is its own character contributing depth and motion.

⚠️ WEATHER CATEGORIES (across 25 entries):
  • ~4 MIST / FOG — dawn mist drifting / low fog blanket / pearl-mist haze
  • ~3 RAIN — gentle rain dripping from leaves / soft drizzle / post-rain wet shimmer
  • ~3 SNOW — gentle snow flurries / light snow blanket / drifting snowflakes
  • ~3 AUTUMN-LEAF DRIFT — red-orange-gold leaves drifting / settled leaf carpet stirring
  • ~3 PETAL DRIFT — cherry-blossom petal-snow / wildflower petals / wisteria-petals drifting
  • ~3 CLEAR / STILL — clear painted-still air with crisp visibility / motionless forest hush
  • ~2 POLLEN-HAZE — drifting golden pollen-motes / floating spore-light / dust-motes catching beams
  • ~2 DEW-GLINTS — glistening dew on every leaf / shimmering droplets / wet-glistening fresh
  • ~2 BREEZE — gentle breeze waving foliage / soft wind moving hair and fabric

⚠️ EVERY entry MUST include:
  - SPECIFIC AIR CONDITION (mist / rain / snow / clear / haze / breeze)
  - PARTICLE MOTION (drifting / settling / glistening / haze)
  - PALETTE / TEMPERATURE CUE (cool / warm / pearl / etc.)

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome description (separate axis)
  • NO lighting (separate axis)
  • NO catastrophic weather (no hurricanes / no destructive storms — peaceful register)
  • NO modern weather references (no rainbows-from-prisms / etc.)`,
    touchpoints: [
      'Soft dawn mist drifting slowly through the lower forest in pearl-grey wisps, atmospheric depth softening every silhouette, fresh painted-morning hush',
      'Low fog blanket settled across the forest-floor at knee-height, painted pearl-grey atmospheric depth, painted softness with edges fading into haze',
      'Pearl-mist haze drifting through the upper canopy in soft cool-grey wisps, painted depth with multiple parallax layers, ethereal painted register',
      'Soft drifting mist threading between trunks in painted whisps, atmospheric depth softening distant trees into silhouette, magical hushed register',
      'Gentle rain dripping from leaves with painted water-droplets visible on every leaf-edge, soft pattering atmosphere, wet-shimmer painted register',
      'Soft drizzle painting every surface with a wet shimmer, gentle rain-pixels suspended in painted depth, fresh peaceful register',
      'Post-rain wet shimmer with every leaf glistening with dew-and-rain droplets, painted reflective register, freshly-washed painted softness',
      'Gentle snow flurries drifting through the painted air in soft white-pixel motes, light snow-blanket softening the forest-floor, painted winter-hush register',
      'Light snow blanket settled across moss and ancient roots in soft pearl-white, drifting flakes still falling through the painted air, hushed winter register',
      'Drifting snowflakes catching the canopy light in soft sparkling painted motes, fresh snow-dust on every leaf-edge, magical winter register',
      'Red-orange-gold autumn leaves drifting through the painted air in slow-motion seasonal motion, settling carpet stirring underfoot, magical autumn register',
      'Settled autumn-leaf carpet stirring with gentle motion as a soft breeze lifts a few back into the air, warm-amber-and-russet palette, autumn painted register',
      'Slow falling autumn-leaves filling the painted depth in red-orange-yellow drifting flakes, warm seasonal palette, magical autumn painted register',
      'Drifting cherry-blossom petals filling the painted air in soft pink-snow, settled petal-carpet underfoot, ethereal painted-spring register',
      'Wildflower petals drifting through the painted air on a gentle breeze, soft warm color palette, magical spring-meadow register',
      'Wisteria petals drifting in painted violet-clusters from overhead, soft pearl-violet palette, magical spring painted register',
      'Clear painted-still air with crisp visibility into the forest depth, painted gallery-tier clarity, motionless hush register',
      'Motionless forest hush with crystalline clear air, every leaf-edge sharply painted, painted gallery-tier stillness register',
      'Crisp clear painted air with gentle dust-motes suspended in light beams, painted-still register',
      'Drifting golden pollen-motes catching the canopy-filtered light, soft painted golden-warm haze, magical painted register',
      'Floating spore-light particles drifting through the painted depth in soft white-glow, magical fae register',
      'Glistening dew on every leaf, painted reflective droplet detail on fern-fronds and bark, fresh-morning painted register',
      'Shimmering dew-droplets catching the canopy light in painted pearl-glints, fresh-morning crystal register',
      'Gentle breeze waving the foliage in soft painted motion, her hair and fabric drifting in the same breeze, magical painted-life register',
      'Soft wind moving hair and fabric with painted flow, leaves stirring overhead in synchronized painted motion, magical alive-forest register',
    ],
    instructions: `Each entry is ONE specific WEATHER condition, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) air condition, (b) particle motion, (c) palette/temperature cue. NO creature. NO biome. NO lighting. NO catastrophic weather. NO modern references. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_forest_fairy_scene_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHOR (closest depth element bringing true 3-tier depth) for FaeBot's forest-fairy-scene path. Each entry describes ONE specific tactile foreground element that sits between the camera and the creature. Each entry 20-40 words.

⚠️ THE BAR: each entry adds proper 3-tier composition depth (foreground / midground her / background fading). Without this, renders feel flat. NEVER blocks her — frames her. Painted-storybook tactile detail.

⚠️ FOREGROUND CATEGORIES (across 25 entries):
  • ~5 HANGING VINES / WILLOW CURTAINS — vine-curtain in foreground-left / weeping willow draping
  • ~4 MOSSY BOULDER / STONE — moss-covered boulder cluster crowding lower frame
  • ~4 FERN CLUSTER — tall fern-fronds arching across bottom of frame
  • ~3 MUSHROOM CLUSTER — cluster of mushrooms in lower-frame carpet
  • ~3 WILDFLOWER CARPET — wildflower carpet at her feet
  • ~3 DRIFTING PETAL / LEAF CLUSTER — drifting cherry-blossom petals / autumn-leaf cluster in foreground
  • ~2 ANCIENT ROOT — gnarled ancient root crossing the foreground
  • ~1 FALLEN LOG — moss-covered fallen log across the foreground

⚠️ EVERY entry MUST include:
  - SPECIFIC TYPE
  - POSITION IN FRAME (foreground-left / lower-right / arching across / etc.)
  - TACTILE DETAIL (moss-covered / leaf-veined / bloom-laden / etc.)

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome / setting (separate axis)
  • NO weather (separate axis)
  • NO modern objects
  • NO blocking the creature — element frames her, not obscures her`,
    touchpoints: [
      'Hanging vine-curtain in foreground-left with bloom-laden tendrils cascading from above, leaf-veined translucent detail catching the light, framing her without blocking',
      'Weeping willow branches draping in foreground-right with delicate willow-leaves shimmering in painted motion, framing her face like a curtain of green-gold',
      'Cluster of hanging ivy-vines threading across the upper-left foreground with painted leaf-veining detail, painted depth between camera and her',
      'Bloom-laden hanging vine-cluster in foreground-right with foxglove-bells dangling, painted detail catching the light, magical framing register',
      'Wisteria-cascade hanging in foreground-left with painted violet petals catching the light, framing her in painted spring drape',
      'Moss-covered boulder crowding the lower-right foreground with thick painted moss texture, lichen-rich detail, painted tactile depth',
      'Boulder cluster with moss-and-fern cascading down the painted stone faces in foreground-left, painted tactile depth, anchored base for the composition',
      'Mossy stone outcrop dominating foreground-right with painted lichen-detail and small flowers blooming from cracks, anchored depth',
      'Ancient stone with deep moss-coat in foreground-left, painted weathered texture, anchored painted depth',
      'Tall fern-cluster arching across the bottom of the frame with lacy painted fronds, painted tactile foreground detail',
      'Fern-fronds in foreground-left with painted leaf-veining detail, soft cool-green palette, painted depth',
      'Cluster of unfurling fern-fronds in foreground-right with painted spiral-detail, fresh-spring painted register',
      'Tall fern-grass cluster across the lower painted depth with delicate leaf-edge detail, painted gallery-tier richness',
      'Cluster of mushrooms in lower-frame painted carpet with red-and-white spotted painted detail, magical painted register',
      'Painted mushroom-ring in foreground-right with small fairy-ring of round mushrooms, magical fae register',
      'Cluster of glowing mushrooms in lower foreground with soft pearl-glow on their painted gills, magical bioluminescent register',
      'Wildflower carpet at her feet with painted bluebells / foxgloves / wood-anemones in foreground depth, painted storybook detail',
      'Foreground carpet of bluebells in painted-spring pearl-violet, painted carpet of color leading the eye to her',
      'Wildflower foreground cluster with painted daisies / forget-me-nots / wild-rose in painted soft palette, magical meadow register',
      'Drifting cherry-blossom petal-cluster filling the foreground in painted pink-snow, soft motion captured, magical spring register',
      'Autumn-leaf drift in foreground with painted red-orange-gold leaves cascading through painted depth, magical autumn register',
      'Drifting petal-cluster across the painted foreground in soft pearl-pink, painted depth with motion, magical register',
      'Gnarled ancient root crossing the foreground earth like a sleeping serpent, painted tactile bark-detail, painted depth anchor',
      'Massive root system crossing the foreground in painted twisted forms, painted tactile depth, anchored compositional weight',
      'Moss-covered fallen log across the foreground with painted weathered bark, small mushrooms emerging, painted tactile depth',
    ],
    instructions: `Each entry is ONE specific FOREGROUND ANCHOR, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific type, (b) position in frame, (c) tactile detail. NO creature. NO biome. NO weather. NO modern. NO blocking. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_forest_fairy_scene_botanical_accent: {
    format: 'simple',
    theme: `BOTANICAL ACCENT (signature bloom cluster) for FaeBot's forest-fairy-scene path. Each entry describes ONE specific named-species bloom cluster near her in the scene. Each entry 20-40 words.

⚠️ THE BAR: each entry is a SPECIFIC named bloom species painted with species-specific detail — painted-storybook chromatic pop. NEVER generic "wildflowers" — always the exact species cluster with its characteristic shape and color.

⚠️ BLOOM CATEGORIES (across 25 entries — vary species):
  Spring blooms: bluebells / foxgloves / wood-anemones / lily-of-the-valley / primrose / forget-me-nots / wisteria / wild-rose / dogwood / magnolia
  Summer blooms: honeysuckle / jasmine / wild-iris / columbine / harebells / meadowsweet / wild-lupine / clematis
  Autumn blooms: asters / wild-chrysanthemum / autumn-anemones / autumn-crocus / rowan-berries
  Year-round: moss-rose / fairy-rose / fern-spore / glowing-fungus / luminous-mushroom-cluster

⚠️ EVERY entry MUST include:
  - SPECIFIC NAMED SPECIES (NEVER generic "wildflowers" / "flowers")
  - COLOR detail (the species' characteristic palette)
  - POSITION RELATIVE TO HER (at her feet / behind her / beside her / hanging above / crowning her / etc.)
  - CLUSTER SIZE (small cluster / dense carpet / scattered / overflowing)

🚫 STRICT BANS:
  • NO generic "flowers" / "wildflowers" — must be species-named
  • NO creature description (separate axis)
  • NO biome (separate axis)
  • NO lighting / weather`,
    touchpoints: [
      'Cluster of indigo-blue bluebells carpeting the forest-floor at her feet in a painted-spring overflow, soft pearl-violet bell-shapes catching the light, painted-storybook richness',
      'Tall foxglove-spires blooming behind her in painted pink-and-purple bell-shaped clusters, fairy-thimble detail, magical painted register',
      'Wood-anemones scattered across the moss at her feet in painted white-petal clusters with golden centers, fresh-spring painted register',
      'Lily-of-the-valley clusters at her feet with delicate painted white bell-shapes on slender green stems, gentle painted-spring register',
      'Primrose cluster crowning the mossy ground beside her with painted pale-yellow petal-rosettes, fresh-morning register',
      'Forget-me-nots scattered through the moss in painted soft-blue clusters with golden centers, gentle painted-spring register',
      'Wisteria-cascade hanging in painted violet-clusters above her like a natural cathedral ceiling, ethereal painted register',
      'Wild-rose bramble blooming beside her shoulder in painted pink-and-cream cluster with painted thorny vines, romantic painted register',
      'Dogwood-blossom branch overhanging her with painted white-and-pink four-petal blooms, ethereal painted-spring register',
      'White-magnolia blossoms suspended overhead like painted lanterns, large luminous painted petals, magical spring register',
      'Honeysuckle-cluster trailing through painted depth behind her in painted yellow-and-cream trumpet-blooms, summer painted register',
      'Jasmine-cluster nearby with painted white-star blooms scattered through painted green-leaves, magical summer register',
      'Wild-iris cluster in painted purple-and-yellow blooms emerging from the painted moss, magical late-spring register',
      'Columbine-cluster blooming beside her in painted red-and-yellow nodding bell-shapes, magical painted register',
      'Harebells nodding gently in painted blue clusters from a mossy rock, magical fae register',
      'Meadowsweet bloom-spires nearby in painted creamy-white plume-clusters, magical summer-meadow register',
      'Wild-lupine spires blooming behind her in painted violet-and-pink upright clusters, magical meadow register',
      'Clematis-blossoms cascading through painted depth in soft pearl-purple star-shaped clusters, magical painted register',
      'Wild-aster cluster blooming at her feet in painted violet-and-pink star-shaped blooms, magical autumn register',
      'Autumn-anemones blooming in painted pink-and-white clusters scattered through the mossy ground, painted autumn register',
      'Autumn-crocus emerging from painted moss in delicate pale-violet cluster, magical seasonal register',
      'Rowan-berry cluster hanging in painted crimson-orange beside her, painted autumn-amber register',
      'Moss-rose cluster blooming from the painted mossy ground in soft pearl-pink rosettes, magical painted-fae register',
      'Glowing-fungus cluster emerging from painted moss in soft pearl-cyan glow-shapes, magical bioluminescent register',
      'Luminous-mushroom cluster ringing her painted feet in soft pearl-glow shapes, magical fae register',
    ],
    instructions: `Each entry is ONE specific BOTANICAL ACCENT cluster, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific named species, (b) color detail, (c) position relative to her, (d) cluster size. NO generic "flowers". NO creature. NO biome. NO lighting/weather. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_forest_fairy_scene_candid_action: {
    format: 'simple',
    theme: `CANDID ACTION + COMPOSITION (the captured moment) for FaeBot's forest-fairy-scene path. Each entry describes ONE specific candid moment with composition framing baked in. Each entry 30-50 words.

⚠️ THE BAR: each entry describes a SPECIFIC captured-on-camera moment with the composition spec baked in. NEVER posing for camera, NEVER looking at viewer. Caught-in-the-act, off-center via rule-of-thirds, the forest wrapping around her like a frame.

⚠️ ACTION + COMPOSITION CATEGORIES (across 25 entries):
  • ~5 NATURE INTERACTION — cupping water / pressing palm to bark / brushing mossy stone / etc.
  • ~5 INSPECTING / EXAMINING — kneeling over mushroom / examining a leaf / looking at a small creature
  • ~4 LISTENING / STILL — listening to forest sounds / motionless watching / pausing mid-walk
  • ~3 BLESSING / TENDING — whispering blessing over seedling / weaving a vine / planting a seed
  • ~3 CARRYING / GATHERING — holding a basket of moss / cradling a small bloom / gathering pollen
  • ~3 RESTING — sleeping in moss-hollow / leaning against ancient tree / sitting cross-legged
  • ~2 MOVEMENT — gentle walking / mid-step in stream / drifting through ferns

⚠️ COMPOSITION SPEC must be baked in per entry — choose ONE per entry:
  - medium-shot off-center via rule-of-thirds, body fills 40-55% of frame, face in 3/4 profile
  - close medium-shot, waist-up to thigh-up framing, anchored at left or right third, head turned in candid profile
  - eye-level full-figure framing, seated or kneeling, body fills 45-60% of frame, intimate distance like wildlife photography
  - three-quarter rear angle, half-turned away revealing back/shoulder details, head in soft profile
  - low-angle medium shot, on moss-covered log or root, body 40-50% of frame, framed by hanging vines in foreground
  - high-angle medium shot looking down, crouched or seated, body 40-55% of frame, surrounded by ferns and wildflowers
  - side-profile medium shot, in stillness with one shoulder forward, hair and limbs draping naturally
  - slight low-angle close, standing waist-deep in pool or among tall ferns, body 50-65% of frame

🚫 STRICT BANS:
  • NO posing for camera / NO eye-contact with viewer
  • NO sexualized framing
  • NO centered hero-shot (always off-center)
  • NO "small figure in distance" — she's the focal subject
  • NO violence / NO scared / NO edgy moods (peaceful candid only)
  • NO creature description (separate axis)
  • NO biome description (separate axis)`,
    touchpoints: [
      'Kneeling at a pond-edge to cup forest-water in her palms, captured eye-level full-figure framing with body filling 45-60% of frame, intimate wildlife-photography distance, off-center via rule-of-thirds',
      'Pressing one open palm to ancient bark in silent communion, captured low-angle medium shot with body 40-50% of frame, framed by hanging vines in foreground, candid 3/4 profile',
      'Brushing a moss-covered stone with reverent fingertips, captured high-angle medium shot looking down at body 40-55% of frame, surrounded by ferns and wildflowers, off-center',
      'Dipping fingertips into a forest-stream to catch a single floating petal, captured close medium-shot waist-up framing at the left third, head turned in candid profile',
      'Trailing one hand along a stream-bank as she walks, captured side-profile medium shot in motion with one shoulder forward, hair and limbs draping naturally, painted candid register',
      'Kneeling over a tiny mushroom-cluster in candid examination, captured high-angle medium shot at body 40-55% of frame, surrounded by ferns, head bowed in soft 3/4',
      'Examining a single leaf in cupped palms, captured close medium-shot waist-up framing at the right third, head bowed in candid profile, painted intimate register',
      'Watching a small forest creature in motionless absorption, captured medium-shot off-center at body 40-55% of frame, face in 3/4 profile, candid wildlife register',
      'Inspecting a glowing-mushroom cluster at her feet, captured eye-level full-figure framing, seated or kneeling, body 45-60% of frame, intimate distance',
      'Studying a small bird perched on her shoulder, captured close medium-shot at the left third, head turned to face the bird in candid 3/4',
      'Standing motionless mid-listen with head tilted to one side, captured slight low-angle close with body 50-65% of frame, framed by tall ferns',
      'Pausing mid-walk to listen to a distant sound, captured side-profile medium shot in stillness with one shoulder forward, hair drifting in painted motion',
      'Motionless watching a deer cross a distant clearing, captured three-quarter rear angle half-turned away revealing back/shoulder details, head in soft profile',
      'Leaning her cheek against ancient tree-bark in silent listening, captured side-profile medium shot at the right third, painted intimate register',
      'Whispering a blessing over a tiny sprouting seedling at her feet, captured high-angle medium shot looking down, body 40-55% of frame, head bowed in tender candid',
      'Weaving a delicate vine into a small circle in her cupped palms, captured close medium-shot waist-up framing at the left third, head bowed over hands in candid 3/4',
      'Planting a seed in the painted moss with one outstretched palm, captured eye-level full-figure framing, kneeling, body fills 45-60% of frame, off-center',
      'Cradling a basket of soft moss against her hip as she walks, captured medium-shot off-center via rule-of-thirds, body 40-55% of frame, face in 3/4 profile',
      'Holding a single delicate bloom in her cupped palms, captured close medium-shot waist-up framing at the right third, head bowed over the bloom',
      'Gathering golden pollen-motes onto her fingertips with one outstretched hand, captured slight low-angle close, body 50-65% of frame, framed by ferns in foreground',
      'Sleeping curled in a moss-hollow with one cheek pressed to moss, captured high-angle medium shot looking down, body 40-55% of frame, surrounded by ferns and wildflowers',
      'Leaning against an ancient tree-trunk with one shoulder forward, captured side-profile medium shot in stillness, hair and limbs draping naturally, painted intimate register',
      'Sitting cross-legged on a moss-cushion in quiet contemplation, captured eye-level full-figure framing, body fills 45-60% of frame, intimate distance',
      'Walking gently between ferns mid-step, captured medium-shot off-center via rule-of-thirds, body 40-55% of frame, face in soft 3/4 profile, painted motion register',
      'Standing waist-deep in a moonlit pool with arms lifted in a candid magical gesture, captured slight low-angle close, body 50-65% of frame, painted intimate register',
    ],
    instructions: `Each entry is ONE specific candid action moment with composition spec baked in, 30-50 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific candid action, (b) composition spec, (c) body % of frame, (d) face/posture detail. NO posing. NO eye-contact. NO centered. NO small-figure. NO violence/scared/edgy. NO creature description. NO biome description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_forest_fairy_scene_magical_flavor: {
    format: 'simple',
    theme: `MAGICAL FLAVOR (supernatural atmospheric accent) for FaeBot's forest-fairy-scene path. Each entry describes ONE specific magical accent visible in the scene. Each entry 15-35 words.

⚠️ THE BAR: each entry is a SPECIFIC magical detail painted as luminous painted register, NEVER crude particle-effect. Range from subtle (pollen-haze) to dramatic (will-o-wisp cluster). Always-on but pool curated low-to-high drama.

⚠️ MAGIC CATEGORIES (across 25 entries):
  • ~5 SUBTLE / AMBIENT — soft pollen-haze drifting / faint pearl-aura / subtle glow under skin
  • ~5 WILL-O-WISPS — single will-o-wisp / cluster / drifting trail
  • ~4 FAIRY-DUST / SPARKLES — spiral of fairy-dust / glittering trail / sparkle-fingertips
  • ~4 GLOWING POLLEN — drifting golden pollen-glow / pollen-mote swarm
  • ~3 FIREFLIES — firefly-swarm / single firefly / firefly-cluster trail
  • ~2 BIOLUMINESCENT FUNGUS — glowing-mushroom-circle / fungus-glow ambient
  • ~2 MAGIC AURA — soft halo around her / glowing veins under skin

⚠️ EVERY entry MUST include:
  - SPECIFIC MAGIC TYPE
  - POSITION OR INTERACTION (around her / drifting from her / cluster nearby / etc.)
  - LIGHT QUALITY (luminous / glowing / sparkling / etc.)

🚫 STRICT BANS:
  • NO crude particle-effect language
  • NO modern-CGI references
  • NO creature description (separate axis)
  • NO violence / NO threatening magic (peaceful register only)`,
    touchpoints: [
      'Soft pollen-haze drifting through the painted air around her in faint golden-warm motes, magical subtle ambient register',
      'Faint pearl-aura surrounding her painted silhouette in soft warm-glow, magical ambient register',
      'Subtle glow beneath her painted skin pulsing faintly with magical light, gentle painted register',
      'Soft warm-glow ambient drifting from her painted form into the surrounding mossy air, magical subtle register',
      'Faint magical shimmer painted across the forest-air near her, subtle painted-ambient register',
      'Single bright will-o-wisp hovering near her cupped palm in painted soft golden-warm glow, magical fae register',
      'Cluster of three-four small will-o-wisps drifting through the painted depth around her, magical painted register',
      'Will-o-wisp trail drifting in a soft painted curve through the forest-air around her, magical fae register',
      'Two larger will-o-wisps orbiting her painted face in soft pearl-glow, magical intimate register',
      'Small cluster of will-o-wisps suspended in painted depth near her shoulder, magical fae register',
      'Spiral of fairy-dust rising from her painted fingertips in soft sparkle-glow, magical painted register',
      'Glittering fairy-dust trail drifting from her painted hand into the surrounding air, magical sparkle register',
      'Sparkle-fingertips trailing painted-gold light as she moves, magical painted-motion register',
      'Painted fairy-dust scattering around her painted form in soft glittering motes, magical fae register',
      'Drifting golden pollen-glow filling the painted air around her in soft warm-light motes, magical magical register',
      'Pollen-mote swarm catching the canopy light in painted golden-warm specks, magical painted register',
      'Soft pollen-light particles drifting through the painted forest-depth around her, magical ambient register',
      'Painted pollen-glow saturating the forest-air with warm-golden ambient, magical register',
      'Firefly-swarm drifting through the painted depth around her in soft warm-yellow points, magical evening register',
      'Single firefly hovering near her cheek in painted soft warm-glow, magical intimate register',
      'Firefly-cluster trail drifting through the painted forest-depth around her, magical fae register',
      'Glowing-mushroom-circle ringing her painted feet in soft pearl-cyan glow, magical bioluminescent register',
      'Bioluminescent fungus-glow ambient illuminating her painted face from below, magical glow register',
      'Soft halo around her painted head in luminous painted golden-warm glow, magical sacred register',
      'Glowing veins beneath her painted skin pulsing faintly with magical light, magical painted register',
    ],
    instructions: `Each entry is ONE specific MAGICAL FLAVOR accent, 15-35 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific magic type, (b) position or interaction, (c) light quality. NO crude particle-effect. NO modern-CGI. NO creature description. NO violence. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_forest_fairy_scene_scale_prover: {
    format: 'simple',
    theme: `SCALE PROVER (environmental scale element establishing her scale) for FaeBot's forest-fairy-scene path. Each entry describes ONE specific environmental element that establishes her scale and the soaring or intimate quality of the space. Each entry 20-40 words.

⚠️ THE BAR: each entry adds a SPECIFIC scale-prover that makes the scene feel epic or intimate. Playbook component — without scale-provers, scenes feel flat. Choose either MAJESTIC scale (she's small in soaring space) or INTIMATE scale (she's normal in cozy detail).

⚠️ SCALE CATEGORIES (across 25 entries):
  • ~5 MASSIVE ROOTS — ancient roots like sleeping dragons / serpent-roots dwarfing her / root-cathedral
  • ~5 SOARING CANOPY — cathedral canopy 100 feet above / towering trunks vanishing into mist / vertical scale
  • ~4 OVERSIZED FLORA — mushroom-cap larger than her head / fern-fronds arching above her / giant-bloom
  • ~3 ANCIENT TREE — massive ancient-tree-trunk filling background / wider than three of her
  • ~3 INTIMATE DETAIL — leaf-veining at painted human-eye-level / lichen-detail at intimate scale
  • ~3 STONE / ROCK SCALE — boulder larger than her / cliff-face soaring above / standing-stone ancient
  • ~2 WATER SCALE — small pool reflecting upward / waterfall dwarfing her / glistening dewdrop close

⚠️ EVERY entry MUST include:
  - SPECIFIC SCALE ELEMENT
  - SCALE RELATIONSHIP TO HER (dwarfing her / at her shoulder / overhead / at her feet / etc.)
  - PAINTED TACTILE DETAIL

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome / setting (separate axis)
  • NO modern references
  • NO breaking the painted-fantasy register`,
    touchpoints: [
      'Massive gnarled ancient root like a sleeping serpent arching across the painted foreground earth in painted twisted form, wider than her entire body, painted dwarfing scale',
      'Cluster of ancient roots like sleeping dragons painted across the foreground, painted bark-detail at intimate human-eye-level, dwarfing painted scale',
      'Ancient root-cathedral arching over her painted form like a natural ceiling, painted depth between roots and her, soaring painted scale',
      'Single massive root-tendril crossing the painted depth behind her, wider than her shoulders, painted tactile bark detail',
      'Painted root-system carpeting the foreground in painted twisted forms, painted dwarfing texture, anchored painted scale',
      'Cathedral canopy 100 feet above her painted head with soaring vertical scale, painted trunks rising into atmospheric depth, painted majestic scale',
      'Towering ancient trunks vanishing into painted upper-mist, soaring vertical painted scale dwarfing her, painted gallery-tier depth',
      'Painted vertical scale of soaring trunks rising above her painted form into deep painted mist, painted majestic dwarfing register',
      'Massive tree-canopy painted overhead like a painted ceiling 80 feet up, painted dwarfing scale, painted soaring register',
      'Painted vertical depth of trunks ascending into the canopy-mist above her, painted majestic register',
      'Single oversized mushroom-cap painted larger than her head crowning a moss-covered stump, painted scale-contrast detail',
      'Tall fern-fronds painted arching protectively over her painted shoulders, painted intimate-yet-soaring scale',
      'Giant painted bloom (foxglove-spire / lupine) standing taller than her at her shoulder, painted dwarfing detail',
      'Cluster of oversized painted mushrooms ringing her painted feet, painted cap-larger-than-head scale-contrast',
      'Massive ancient tree-trunk filling the painted background, wider than three of her painted form, painted texture detail',
      'Painted ancient-tree-trunk dominating the midground at painted intimate scale, painted bark-detail at painted human-eye-level',
      'Wide-ridged painted ancient-trunk behind her in painted depth, painted bark-detail revealing painted scale',
      'Painted leaf-veining at intimate scale catching the painted light, painted gallery-tier botanical detail at painted human-eye-level',
      'Lichen-detail on painted bark at painted intimate scale, painted texture richness at painted human-eye-level',
      'Painted dewdrop-cluster larger than painted intimate scale on painted leaf-edges, painted gallery-tier detail',
      'Painted boulder painted larger than her in painted foreground, painted moss-and-lichen texture at painted human-eye-level',
      'Painted cliff-face soaring above her painted form in painted depth, painted dwarfing register',
      'Ancient painted standing-stone painted half-buried in painted moss, painted dwarfing scale-prover',
      'Painted small pool painted reflecting the canopy painted upward, painted scale element with painted reflection',
      'Painted waterfall painted dwarfing her painted in painted background, painted soaring scale-prover',
    ],
    instructions: `Each entry is ONE specific SCALE PROVER, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific scale element, (b) scale relationship to her, (c) painted tactile detail. NO creature. NO biome. NO modern. NO breaking painted-fantasy register. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_forest_fairy_scene_companion: {
    format: 'simple',
    theme: `COMPANION (small woodland animal sharing the moment with her) for FaeBot's forest-fairy-scene path. Each entry describes ONE specific small companion animal woven naturally into the scene. Each entry 15-35 words.

⚠️ THE BAR: companion is at HER SCALE OR SMALLER, NEVER a competing focal subject. The eye still lands on the creature first; the companion adds story-warmth + scale-prover. Woven naturally — fox-cub at her feet, robin on her shoulder, glow-moth circling.

⚠️ COMPANION CATEGORIES (across 25 entries):
  • ~5 BIRD — robin / sparrow / hummingbird / owl / wren on her shoulder or nearby branch
  • ~4 FOX / FOX-CUB — fox-cub at her feet / fox watching from ferns
  • ~3 DEER / FAWN — spotted-fawn beside her / doe in distant midground
  • ~3 RABBIT / HARE — hare watching from ferns / rabbit at her feet
  • ~3 BUTTERFLY / MOTH — luna-moth perched on her finger / butterfly-cluster circling
  • ~2 SQUIRREL / SMALL MAMMAL — squirrel on a branch / weasel pausing
  • ~2 OWL / RAPTOR — owl on nearby branch / hawk perched in midground
  • ~2 GLOW-MOTH / FIREFLY-COMPANION — glow-moth circling her / firefly orbiting
  • ~1 RARE — turtle / frog / dragonfly / small fawn

⚠️ EVERY entry MUST include:
  - SPECIFIC ANIMAL SPECIES (NEVER generic "bird" or "small animal")
  - POSITION RELATIVE TO HER (at her feet / on her shoulder / in nearby ferns / etc.)
  - POSTURE / ACTION (watching / pausing / mid-flight / etc.)
  - SCALE CUE (her scale or smaller)

🚫 STRICT BANS:
  • NO competing focal subject — companion is secondary
  • NO predator-prey moments (peaceful register only)
  • NO creature description (separate axis)
  • NO modern or fantasy hybrids (real woodland animals only)`,
    touchpoints: [
      'A small painted robin with crimson breast perched on her painted shoulder, head tilted in candid watching, painted intimate scale',
      'A painted sparrow pausing on a painted fern-frond beside her, painted soft-brown plumage, candid woodland register',
      'A painted hummingbird hovering near her painted cupped palm, painted iridescent wing-blur, magical fae register',
      'A painted owl on a nearby painted branch in watchful stillness, painted soft-grey plumage and large luminous eyes, magical companion register',
      'A small painted wren perched on her painted finger, painted tiny brown form with bright eye, painted intimate register',
      'A painted fox-cub sitting at her painted feet in candid trust, painted russet fur and bright amber eyes, magical companion register',
      'A painted red fox pausing beside her painted form, painted curious head-tilt, soft-russet painted fur',
      'A painted fox-cub watching from painted ferns nearby, painted bright amber eyes peering out, magical companion register',
      'A painted silver-fox crouched beside her in painted candid presence, painted soft silver-grey fur, magical fae register',
      'A painted spotted-fawn beside her in painted candid attention, painted soft white-spotted brown fur, magical companion register',
      'A painted doe pausing in painted midground watching her, painted gentle eyes, candid wildlife register',
      'A painted young-fawn at her painted side, painted small white-spotted form, magical intimate register',
      'A painted hare watching from painted ferns nearby, painted long ears and bright eye, candid woodland register',
      'A painted rabbit pausing at her painted feet in painted candid presence, painted soft fur and gentle eyes, magical companion register',
      'A painted snow-hare crouched in painted nearby ferns, painted soft white fur, magical winter register',
      'A painted luna-moth perched on her painted fingertip with painted iridescent green wings spread, magical intimate register',
      'A painted butterfly-cluster circling her painted form in soft painted motion, painted orange-and-yellow wings, magical painted register',
      'A painted monarch butterfly perched on her painted hand, painted orange-and-black wings spread, magical painted register',
      'A painted red-squirrel pausing on a painted branch above her, painted bright orange fur and bushy tail, candid woodland register',
      'A painted weasel pausing in painted ferns nearby, painted soft brown fur and bright eyes, candid wildlife register',
      'A painted owl on a painted high branch behind her, painted soft brown plumage and large round eyes, magical companion register',
      'A painted hawk perched in painted midground, painted majestic stillness, painted candid wildlife register',
      'A painted glow-moth circling her painted form in soft pearl-glow, painted magical wing-motion, magical fae register',
      'A painted firefly orbiting her painted cupped palm in soft warm-glow, magical intimate register',
      'A painted small turtle pausing at painted stream-edge nearby, painted weathered shell-detail, candid woodland register',
    ],
    instructions: `Each entry is ONE specific COMPANION animal, 15-35 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific species, (b) position relative to her, (c) posture/action, (d) scale cue (her scale or smaller). NO competing focal subject. NO predator-prey. NO creature description. NO modern or fantasy hybrids. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },


  // ─── flower-fairy path (2026-05-20 axis-system migration, 10 axes) ───
  faebot_flower_fairy_creature: {
    format: 'simple',
    theme: `STACKED-EXOTIC FLOWER-MERGED FAIRY for FaeBot's flower-fairy path. Each entry is ONE unified description of a single mythic flower-merged fairy creature — rose-fae / wisteria-fae / sunflower-fae / lotus-fae / cherry-blossom-fae / morning-glory-fae / etc. Each entry 50-90 words. 5+ stacked exotic features per fairy. SHE HAS WINGS.

⚠️ THE BAR: each fairy reads as a SINGLE coherent mythic flower-merged being. NOT a list — a unified painted-fantasy character description. Otherworldly mythic-fairy beauty, NEVER human-model beauty. Hidden-camera candid posture — NEVER posing, NEVER eye-contact, NEVER pinup.

⚠️ CRITICAL: SHE HAS WINGS — butterfly / gossamer / sakura-petal / luna-moth / dragonfly. Specify wing-type per fairy.

⚠️ EVERY ENTRY MUST include AT LEAST 5 of these stacked exotic feature categories:
  - FLOWER-SPECIES LINEAGE — rose-fae / wisteria-fae / sunflower-fae / lotus-fae / cherry-blossom-fae / morning-glory-fae / peony-fae / iris-fae / poppy-fae / orchid-fae / lily-fae / tulip-fae / dahlia-fae / hibiscus-fae / jasmine-fae / etc.
  - PETAL-SKIN — petal-soft blushed skin / dewdrop-translucent skin / luminous pearl-glowing / petal-tinted / iridescent shimmer
  - BLOSSOM-HAIR — cascading rose-blooms / cascading wisteria-racemes / dense sunflower-ray petals / cascading lotus-petals / pink-sakura petals / blue morning-glory trumpets / etc. — hair MADE OF her flower-species
  - PETAL-GARMENT — woven rose-petal bodice / cascading wisteria petal-shawl / golden sunflower-ray bodice / lotus-petal wrap / sakura-petal layered / etc.
  - WINGS (CRITICAL — every fairy has them) — butterfly-wings of layered rose-petals / gossamer wings stitched with wisteria / large butterfly-wings of sunflower-rays / luna-moth wings veined with sap / dragonfly-wings of golden-mesh / sakura-petal wings / etc.
  - POLLEN-GLOW SIGNATURE — gold pollen dusted on shoulders / luminous lavender-glow / sun-gold pollen heavy on her / dewdrop-pearl glow / golden-stamen detail / pollen-mote halo
  - CANDID POSTURE/MOMENT — perched on a giant petal / nestled inside a bloom / wading through poppies / cupping pollen-light / sitting on lotus-pad / sleeping in tulip-bell / etc.

⚠️ FLOWER-SPECIES DISTRIBUTION (across 25 entries):
  • ~3 ROSE-FAMILY (rose / wild-rose / dog-rose / hybrid-rose)
  • ~3 TRUMPET / BELL (morning-glory / tulip / foxglove / bluebell)
  • ~3 CASCADING (wisteria / jasmine / honeysuckle / clematis)
  • ~3 SUNFLOWER / LARGE-DISK (sunflower / daisy / coneflower / dahlia)
  • ~2 LOTUS / WATER (lotus / water-lily / lily-pad / lotus-bud)
  • ~2 CHERRY-BLOSSOM / DELICATE (cherry-blossom / magnolia / dogwood / plum-blossom)
  • ~2 IRIS / ORCHID (iris / orchid / lily / amaryllis)
  • ~2 POPPY / WILDFLOWER (poppy / cornflower / lupine / harebell)
  • ~2 PEONY / RUFFLED (peony / dahlia / camellia / chrysanthemum)
  • ~2 EXOTIC (bird-of-paradise / hibiscus / passionflower / lotus-bud)
  • ~1 RARE / SEASONAL (snowdrop / autumn-crocus / forget-me-not)

🚫 ABSOLUTE BANS:
  • NO human-model beauty / NO pin-up / NO sexualized framing
  • NO posing for camera / NO direct eye-contact with viewer
  • NO modern attire / NO contemporary references
  • NO scared / angry / edgy / dark moods (peaceful-fairy register only)
  • NO "small figure in distance" — she's the focal subject
  • NO wings missing — every fairy has wings
  • NO human-scale fairy (she's smaller than human)
  • NO ethnic-codes from real-world cultures — fantasy-canon only`,
    touchpoints: [
      'A rose-fae with petal-soft rose-blushed skin dusted in gold pollen and waist-long hair of cascading deep-crimson garden-rose blooms threaded with pearl-white buds, woven bodice of overlapping crimson rose-petals over a leaf-skirt of dark rose-foliage, butterfly-wings of layered red-rose petals with gold veining, golden-amber eyes lowered to a single bloom in her cupped palm, perched on a curled rose-petal',
      'A wisteria-fae with luminous lavender-glowing skin and trailing hair of cascading deep-purple wisteria racemes brushing her ankles, draped petal-shawl of pale-violet wisteria blooms over a vine-and-leaf bodice woven with twisting green tendrils, gossamer wings of stitched wisteria-petals with silver veining, head tilted up to catch wisteria petals drifting down',
      'A sunflower-fae with deep-golden-bronze skin dusted heavily in sun-gold pollen and hair of vibrant yellow-and-amber sunflower-ray petals arranged in a dense corona, woven petal-bodice of golden sunflower-rays with brown seed-center medallion detail, large butterfly-wings of layered golden sunflower-petals, perched on a giant sunflower stamen with bare feet dangling',
      'A lotus-fae with dewdrop-translucent pearl-pink-glowing skin and hair of cascading pale-pink and ivory lotus-petals flowing past her waist in soft waves, petal-wrap bodice of blush-pink lotus blooms layered over a skirt of jade water-lily leaves, gossamer wings of woven pink lotus-petals with luminous golden veining, seated cross-legged on a giant lotus-pad cupping liquid-starlight',
      'A cherry-blossom-fae with pale porcelain-glowing skin and ink-black hair threaded throughout with hundreds of pale-pink-and-white sakura petals in soft clusters, petal-wrap of overlapping sakura blooms with tiny golden-stamen detail, translucent wings of layered cherry-blossom petals with soft pink veining, head tilted as a single petal lands on her open palm',
      'A morning-glory-fae with translucent cool-fair skin showing tiny blue constellations visible beneath the surface and hair of cascading blue-and-indigo morning-glory trumpets still curled at the edges, draped petal-shawl of deep-indigo morning-glory blooms over a vine-tendril bodice, gossamer wings of stitched morning-glory petals with silver veining, perched on a tulip-bell',
      'A peony-fae with petal-soft pink-glowing skin and waist-long hair of overlapping ruffled peony-blooms cascading in pearl-pink and cream tones, woven petal-bodice of overlapping peony petals fading into a skirt of green peony-foliage, butterfly-wings of layered ruffled peony-petals, half-emerged from the heart of a giant blooming peony, fingers pressed to glowing pollen-runes',
      'An iris-fae with iridescent purple-tinted skin and elaborate hair of cascading deep-violet bearded-iris blooms with golden falls visible at intervals, draped iris-petal cape with woven leaf-belt, gossamer wings of stitched iris petals with golden veining, three-quarter rear angle with her face in soft profile listening to the breeze',
      'A poppy-fae with petal-soft warm-cream skin dusted in red pollen and hair of cascading scarlet poppy-petals with dark seed-pod centers visible at her temples, woven petal-bodice of overlapping red poppy-petals, large butterfly-wings of layered scarlet poppies, wading waist-deep through a wild poppy field with hands trailing over the bloom-tops',
      'An orchid-fae with luminous pearl-white skin with faint magenta blush and hair of cascading exotic-orchid blooms in soft pink-and-white with magenta veining, draped petal-shawl of layered orchid-blooms with green-leaf-trim, gossamer wings of stitched orchid-petals with iridescent shimmer, perched on a hanging orchid-bough in candid stillness',
      'A jasmine-fae with luminous pearl-skin glowing faintly and hair of cascading white-jasmine star-blooms with green-leaf threading, draped petal-shawl of layered jasmine blossoms over a green-leaf bodice, gossamer wings of woven jasmine-petals with silver veining, sitting cross-legged on a jasmine-vine with hands cupping drifting pollen',
      'A tulip-fae with petal-soft warm-blushed skin and hair of cascading striped-tulip petals in soft pearl-pink-and-cream tones, woven petal-bodice of overlapping tulip-petals fading to a leaf-skirt, butterfly-wings of layered tulip-petals with subtle striping, nestled inside a giant tulip-bell with head resting against the curled inner petal-edge',
      'A dahlia-fae with petal-soft deep-pink-glowing skin and hair of cascading ruffled dahlia-blooms in painted layered pink-and-purple, woven petal-bodice of overlapping dahlia-petals with golden-stamen detail, butterfly-wings of layered ruffled dahlia-petals with iridescent shimmer, half-turned profile inspecting a tiny falling petal in her palm',
      'A hibiscus-fae with petal-soft warm-coral-glowing skin and hair of cascading large-bloom hibiscus-petals in vivid coral-and-pink with prominent red-stamens visible, draped petal-shawl of overlapping hibiscus-blooms with green-leaf trim, large butterfly-wings of layered hibiscus-petals with golden veining, perched on a hibiscus-stem with one knee drawn up',
      'A daisy-fae with porcelain-glowing skin and hair of cascading white-daisy-petals with bright-yellow center-disks visible at intervals, woven petal-bodice of overlapping white-daisy petals with golden-center detail, gossamer wings of stitched daisy-petals with green veining, walking gently through a meadow of buttercups and white daisies',
      'A foxglove-fae with porcelain-glowing skin and hair of cascading pink-and-purple foxglove-bell blooms with mottled-throat detail visible, draped petal-shawl of overlapping foxglove-bells, gossamer wings of stitched foxglove-petals with mottled veining, perched on a foxglove-spire with hands cupping a single bell',
      'A bluebell-fae with translucent skin showing tiny constellations beneath and hair of cascading indigo-bluebell blooms in soft pearl-violet clusters, draped petal-shawl of overlapping bluebells over a green-leaf bodice, gossamer wings of stitched bluebell-petals with silver veining, sitting cross-legged in a sea of bluebells',
      'A water-lily-fae with dewdrop-translucent skin and hair of cascading white-and-cream water-lily petals with golden-stamen-centers visible, woven petal-bodice of overlapping water-lily-petals fading to a skirt of jade lily-pad leaves, gossamer wings of woven water-lily petals with luminous golden veining, kneeling at a pond-edge dipping fingertips',
      'A magnolia-fae with luminous-pearl skin and hair of cascading large-bloom magnolia-petals in cream and soft-pink with subtle veining, draped petal-shawl of overlapping magnolia blooms over a green-leaf bodice, gossamer wings of stitched magnolia-petals with golden veining, head bowed in candid contemplation of a magnolia-bough',
      'A clematis-fae with iridescent purple-tinted skin and hair of cascading purple-and-pink clematis-star-blooms threaded with green tendrils, draped petal-shawl of overlapping clematis blooms with green-leaf-trim, gossamer wings of stitched clematis-petals with silver veining, perched on a clematis-vine inspecting a single bloom',
      'A honeysuckle-fae with petal-soft warm-amber-glowing skin and hair of cascading yellow-and-cream honeysuckle-trumpet blooms with subtle nectar-glints, woven petal-bodice of overlapping honeysuckle blossoms, gossamer wings of stitched honeysuckle-petals with iridescent shimmer, sitting cross-legged on a honeysuckle-vine with hands cupping nectar-light',
      'A bird-of-paradise-fae with iridescent warm-bronze skin and elaborate hair of cascading orange-and-purple bird-of-paradise blooms with sharp-spike-detail, draped petal-shawl of overlapping bird-of-paradise blooms, large butterfly-wings of layered bird-of-paradise petals with metallic shimmer, perched on a bloom-stem in candid profile',
      'A passionflower-fae with petal-soft magenta-glowing skin and hair of cascading exotic-purple passionflower-blooms with intricate central-corona detail, draped petal-shawl of overlapping passionflower blossoms, gossamer wings of stitched passionflower-petals with silver veining, sitting cross-legged on a passionflower-vine inspecting a single bloom',
      'A snowdrop-fae with translucent pearl-white-glowing skin and hair of cascading delicate snowdrop-bell blooms with green-tip details, draped petal-shawl of overlapping snowdrop blossoms over a green-leaf bodice, gossamer wings of stitched snowdrop-petals with silver veining, perched on a snowdrop-stem in early-spring candid',
      'A forget-me-not-fae with translucent soft-fair skin and hair of cascading tiny-blue forget-me-not blooms with golden-center detail, draped petal-shawl of overlapping forget-me-nots over a green-leaf bodice, gossamer wings of stitched forget-me-not petals with silver veining, walking gently through a forget-me-not meadow with hands trailing',
      'A camellia-fae with luminous-pearl skin and hair of cascading deep-pink camellia-blooms with golden-center detail, draped petal-shawl of overlapping camellia blossoms over a glossy green-leaf bodice, gossamer wings of stitched camellia-petals with iridescent shimmer, perched on a camellia-bough cupping a fallen petal',
    ],
    instructions: `Each entry is ONE unified mythic flower-merged fairy description, 50-90 words. Format: prose, comma-separated phrases. MANDATORY — 5+ stacked exotic features (species + petal-skin + blossom-hair + petal-garment + WINGS + magical signature + candid posture). NO human-model beauty. NO posing. NO eye-contact. NO modern attire. NO scared/edgy moods. NO wings missing. NO human-scale fairy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_flower_fairy_biome: {
    format: 'simple',
    theme: `ENCHANTED-FOREST BIOME (flower-saturated) for FaeBot's flower-fairy path. Each entry describes ONE specific enchanted-forest setting where FLOWERS are the dominant flora — the fairy's home is the magical wild forest, with flowers integrated into mossy clearings, fern-grottos, ancient-oak groves, willow-thickets, birch-glades. NEVER open meadows or garden-fields. ALWAYS a forest-context with flower species as the dominant flora layer. Each entry 30-55 words.

⚠️ THE BAR: each biome reads as a deep enchanted forest setting WITH flowers as the dominant flora — ancient bark, moss-covered stones, fern-fronds, woven canopy, dappled forest-floor — but the flora species are FLOWERS (foxgloves, bluebells, lotuses, peonies, wisteria) rather than just ferns. Multi-tier depth: foreground tactile forest-and-flower detail / midground holding her / background fading into enchanted bloom-mist.

⚠️ BIOME CATEGORIES (across 25 entries):
  • ~4 ANCIENT OAK GROVE with flower-carpet — bluebell carpet at oak-roots, wild-rose-bramble climbing trunks
  • ~3 FERN-GROTTO with bloom-cluster — moss-grotto with giant peony cluster at center, fern-fronds dripping
  • ~3 BIRCH-GLADE with wildflowers — pale birch trunks with foxglove-spires + lily-of-the-valley carpet
  • ~3 WISTERIA-CASCADE WOODLAND — violet wisteria draping from ancient oak canopy, moss-grown path below
  • ~3 SAKURA-GROVE FOREST — cherry-blossom canopy with mossy forest-floor, drifting petals
  • ~2 LOTUS-POND IN FOREST — hidden grotto-pool with lotus floating, surrounded by ancient ferns
  • ~2 WILLOW-THICKET WITH IRIS — weeping-willows over a hidden iris-meadow at the bank
  • ~2 MOSS-CANYON with BLOSSOMS — moss-cliff walls with foxgloves clinging, hanging-vine-blooms
  • ~2 REDWOOD CATHEDRAL with WILDFLOWERS — soaring redwood canopy above carpeted forest-floor of wood-anemones
  • ~1 ENCHANTED-MUSHROOM GROVE with bloom-accent — fairy-circle with glowing fungus + bluebell cluster

⚠️ EVERY entry MUST include:
  - SPECIFIC FOREST CONTEXT (named tree species + structural feature like trunk / canopy / grotto / glade)
  - DOMINANT FLOWER SPECIES integrated into the forest setting
  - MOSS / FERN / BARK / CANOPY detail (forest-grounding cues)
  - MULTI-TIER DEPTH implied (foreground / midground / background)
  - "Enchanted" register cue — dappled god-rays / soft bloom-mist / ancient grove / hidden glen

🚫 STRICT BANS:
  • NO open meadows / garden fields / cultivated landscapes
  • NO "wildflower meadow stretching to horizon" (read as garden)
  • NO creature description (separate axis)
  • NO lighting / weather description (separate axes)
  • NO modern setting / urban elements
  • NO IP / pop-culture references`,
    touchpoints: [
      'An ancient oak grove with a thick carpet of indigo-blue bluebells covering the moss-floor at the gnarled roots, dappled god-rays piercing the canopy, scattered fern-fronds at the foreground, mossy boulder clusters nestled between trunks, painted multi-tier enchanted-forest depth',
      'A hidden fern-grotto with a giant peony-cluster blooming at the center between moss-covered boulders, soaring fern-fronds in the foreground, ancient bark-textured stone walls surrounding, dappled forest-light filtering from above, painted gallery-tier register',
      'A birch-glade with pale slender birch-trunks rising tall, foxglove-spires blooming in pink-and-purple between the trunks, lily-of-the-valley carpet across the moss-floor, dappled light, soft bloom-mist receding into the background',
      'A wisteria-cascade woodland with violet-wisteria racemes draping from ancient oak-branches overhead like a natural cathedral, moss-grown forest-path winding through, fern-fronds at the foreground, dappled twilight filtering through',
      'A sakura-grove forest with pink cherry-blossom canopy overhead creating a natural ceiling, mossy forest-floor carpeted with fallen petals, ancient trunks weathered with lichen, drifting petals through dappled god-rays, ethereal painted-spring register',
      'A hidden lotus-pond grotto in the deep forest with floating lotus-blooms and water-lilies on still water, surrounded by ancient ferns and moss-covered stones, willow-branches dipping low into the pool, painted reflective register',
      'A willow-thicket with weeping-willow branches forming natural curtains above a hidden iris-meadow at the stream-bank, mossy stones along the water-edge, distant willow-trunks dissolving into pearl-mist',
      'A moss-canyon with vertical moss-covered cliff walls towering on either side, foxgloves clinging to the cliff faces in pink-purple clusters, hanging-vine-blooms cascading from above, hidden grotto-floor below, painted vertical-scale richness',
      'A redwood cathedral with massive ridged ancient trunks rising into a soaring canopy 100 feet above, deep cinnamon-red needle-carpet across the forest-floor woven through with wood-anemones and forget-me-nots, painted gallery-tier scale',
      'An enchanted mushroom-grove forest clearing with glowing-fungus mushroom-cluster ringing a small mossy hollow, bluebell carpet at the center, fern-fronds at the edges, ancient yew-trees framing the clearing, soft pearl-glow magical register',
      'An ancient oak grove with wild-rose-bramble climbing the trunks in painted pink-and-cream cluster, gnarled twisted roots crossing the foreground earth, mossy ground beneath, dappled afternoon god-rays piercing the canopy, painted enchanted register',
      'A fern-grotto with a hidden giant magnolia-tree at the center, white-and-cream magnolia blooms suspended like lanterns overhead, dripping ferns from moss-cliffs around, painted multi-tier ethereal register',
      'A birch-glade with wildflowers — pale birch trunks with painted cluster of cornflowers and harebells dotting the mossy floor, soft pearl-mist receding between the trunks, dappled filtered light',
      'A wisteria-draped ancient-oak grove with violet wisteria racemes hanging from gnarled oak-limbs overhead, moss-grown forest-path winding through, scattered ferns at the foreground, painted enchanted-cathedral register',
      'A sakura-grove forest with pink-blossom branches arching overhead, mossy carpet of fallen petals on the forest-floor, ancient lichen-rich trunks dissolving into pearl-pink mist, soft dappled register',
      'A hidden lotus-pool in a fern-grotto with pink lotus-blooms on still water, surrounded by ancient ferns and dripping moss-cliffs, willow-branches reaching down to the surface, soft-cyan magical reflective register',
      'A weeping-willow thicket with cascading branches above a hidden meadow of wild-iris and forget-me-nots, mossy stones at the bank of a stream below, painted dappled register',
      'A moss-canyon enchanted glen with foxgloves clinging to the moss-cliffs, hanging-honeysuckle-vines cascading from above, hidden grotto-floor of fern-fronds, painted vertical-scale enchanted register',
      'A redwood-cathedral forest interior with massive ancient trunks rising tall, painted carpet of trillium and bleeding-heart blooms across the forest-floor, painted gallery-tier soaring scale, soft amber light',
      'An enchanted yew-grove clearing with a fairy-circle of glowing pearl-mushrooms in the moss, painted indigo bluebell-cluster at one edge, ancient twisted yew-trees framing the painted clearing, magical pearl-glow register',
      'An ancient mossy oak-grove with hanging-ivy and a cluster of giant peony-blooms emerging from a hollow at the trunk base, painted multi-tier depth, dappled forest-light, painted enchanted register',
      'A birch-glade with a foxglove-spire-cluster rising from the mossy floor, painted scattered pale-violet harebells around, soft dappled forest-light filtering through pale birch-canopy, painted ethereal register',
      'A wisteria-cascade canopy above a winding moss-grown forest-path with painted scattered fallen wisteria-petals on the path below, ancient lichen-rich trunks flanking, painted gallery-tier register',
      'A sakura-grove forest with a hidden mossy stump in the painted depth, painted pink-blossom canopy above, drifting petals filling the painted enchanted air, soft pearl-pink mist beyond, ethereal painted register',
      'An enchanted hidden glen with a small mossy hollow ringed by painted giant white-magnolia blooms suspended overhead like painted lanterns, painted lily-of-the-valley carpet at the floor, soft pearl-glow ambient',
    ],
    instructions: `Each entry is ONE specific ENCHANTED-FOREST + FLOWER biome, 30-55 words. Format: prose, comma-separated phrases. MANDATORY — (a) named tree species + forest structural feature, (b) dominant flower species woven into forest, (c) moss / fern / bark / canopy detail, (d) multi-tier depth, (e) enchanted register cue (dappled / hidden / ancient / mossy). NO open meadows / garden fields. NO creature description. NO lighting/weather. NO modern. NO IP. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_flower_fairy_lighting: {
    format: 'simple',
    theme: `LIGHTING (time-of-day + light drama) for FaeBot's flower-fairy path. Each entry describes ONE specific time-of-day + light moment combination. Each entry 25-45 words.

⚠️ THE BAR: each entry establishes a SPECIFIC light moment with dramatic potential — NOT generic "soft light". Painted-fantasy lighting drama specifically suited to flower-garden contexts: golden-hour through petals, dawn-pink on dewy blooms, twilight blue-hour with firefly accents, moonlit silver-glow on pond blooms.

⚠️ LIGHTING CATEGORIES (across 25 entries):
  • ~7 GOLDEN-HOUR — afternoon warm-amber through petals / late-afternoon backlight gilding her
  • ~4 DAWN — soft-pink dawn / golden dawn beams / pearl-mist dawn / fresh-spring morning light
  • ~4 BLUE-HOUR / TWILIGHT — cool-blue twilight / magical-violet twilight / blue-hour with firefly accents
  • ~3 MIDDAY — bright midday light through petal-cluster / harsh-light filtering through canopy
  • ~3 MOONLIT — silver-moonlight on dewy blooms / blue-moon ambient on pond
  • ~4 BIOLUMINESCENT — soft pollen-light ambient / glowing-bloom register / enchanted fairy-light shafts

⚠️ EVERY entry MUST include:
  - SPECIFIC TIME-OF-DAY
  - SPECIFIC LIGHT QUALITY
  - PALETTE CUE
  - DIRECTION OR DRAMA (through petals / from above / sidelight / etc.)

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome description (separate axis)
  • NO weather (separate axis)
  • NO modern light sources
  • NO photographic technique language`,
    touchpoints: [
      'Golden afternoon warm-amber light filtering through painted overlapping petals creating painted dappled bloom-shadows, painted gallery-tier warm-golden register',
      'Late-afternoon backlight piercing through bloom-cluster creating painted halo-glow on every petal-edge, painted soft warm-amber register, atmospheric backlit depth',
      'Magic-hour golden light gilding the painted blooms with warm-amber-and-gold palette saturating the painted scene, painted-storybook softness',
      'Golden warm sidelight raking across the painted bloom-field from a low angle, painted long shadows stretching across the painted petals, painted gallery-tier register',
      'Late-afternoon warm light filtering through petal-cluster creating painted golden-pink dappled patterns on her painted form, painted-storybook register',
      'Golden-hour through wisteria-cascade creating painted warm-golden-and-violet dappled pattern on the painted ground, painted gallery-tier register',
      'Soft-pink dawn light filtering through the painted blooms with rose-gold-and-lavender palette, gentle painted-storybook register, early-morning warmth',
      'Golden dawn beams angling through the painted blooms from a low east angle, painted drifting dust-motes catching the painted beams, fresh-morning register',
      'Pearl-mist dawn beams angling low through the painted blooms in painted shafts of soft white-gold, painted drifting mist catching the beams, fresh painted-morning register',
      'Fresh-spring morning light with painted soft cool-warm palette and painted gentle dappled patterns on the painted blooms, painted hopeful register',
      'Cool-blue twilight with painted warm-yellow accents from fireflies, painted twilight magical register, soft pearl-violet bloom-tint',
      'Blue-hour twilight with the last warm-orange of sunset bleeding through painted distant blooms, cool-blue overhead, painted magical twilight register',
      'Magical violet-twilight glow saturating the painted bloom-garden in soft lavender-and-blue, painted faint pollen-light particles, dreamy painted-fantasy register',
      'Blue-hour low warm under-light from fireflies illuminating her painted face from below, cool-blue ambient overhead, painted magical underlight register',
      'Midday god-rays piercing the painted bloom-canopy in painted vertical shafts of brilliant white-gold, painted harsh contrast between shafted-light and painted shadow',
      'High-noon bloom-canopy filter with painted dappled bright-gold patches across painted petals, painted harsh-amber-with-cool-shadow contrast',
      'Strong midday backlight piercing through painted blooms creating dramatic painted silhouette-edges, painted warm-gold-and-shadow register',
      'Silver moonlight on painted dewy blooms creating painted cool-blue glints across every painted petal, painted hushed magical register',
      'Blue-moon ambient on painted pond with painted moonlit reflection of lotus-blooms, painted silver-and-blue magical register',
      'Moonlit silver-and-violet ambient with painted blooms catching painted silver-edge light, painted deep-blue painted ambient saturating the scene',
      'Soft pollen-light ambient illuminating her painted form with painted warm-golden glow, painted bioluminescent register',
      'Bioluminescent ambient with painted glowing-blooms casting soft warm-pink painted light, painted gallery-tier magical register',
      'Magical pollen-light suffusing the painted scene with painted soft warm-glow on every painted petal, painted ethereal register',
      'Dramatic dark-grey-blue storm-lit garden with painted distant lightning-flash illuminating the painted blooms in silver flash, painted dramatic-storm register',
      'Pre-storm dim painted-amber light with low storm clouds darkening the painted upper-canopy, painted blooms still catching gentle light',
    ],
    instructions: `Each entry is ONE specific LIGHTING moment, 25-45 words. Format: prose, comma-separated phrases. MANDATORY — (a) time-of-day, (b) light quality, (c) palette cue, (d) direction or drama. NO creature. NO biome. NO weather. NO modern. NO photographic language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_flower_fairy_weather: {
    format: 'simple',
    theme: `WEATHER (air condition + drifting accents) for FaeBot's flower-fairy path. Each entry describes ONE specific atmospheric air condition + drifting accents suited to flower-garden contexts. Each entry 20-40 words.

⚠️ THE BAR: each entry establishes a SPECIFIC air condition with drifting accents adding painted-storybook depth. ALWAYS petal-friendly weather — no destructive storms. Drifting accents often petal-themed (drifting petals dominant).

⚠️ WEATHER CATEGORIES (across 25 entries):
  • ~5 PETAL-DRIFT — drifting petals from blooms / falling petal-snow / scattered settled petals
  • ~3 MIST / FOG — dawn mist drifting through blooms / low pearl-mist / soft bloom-mist
  • ~3 RAIN — gentle rain on petals / soft drizzle on blooms / post-rain wet-glistening blooms
  • ~3 POLLEN-HAZE — drifting golden pollen-motes / floating pollen-clouds / pollen-snow
  • ~3 DEW-GLINTS — glistening morning dew on blooms / pearl-dew droplets / dew-soaked
  • ~3 BREEZE — gentle bloom-bobbing breeze / petals stirring on breeze / soft wind moving foliage
  • ~2 CLEAR / STILL — clear painted-still air with crisp bloom visibility
  • ~2 BUTTERFLY-CLOUD — butterfly swarm drifting through / butterfly-cloud filling air
  • ~1 SNOW-PETAL — winter petal-snow / first-frost on petals

⚠️ EVERY entry MUST include:
  - SPECIFIC AIR CONDITION
  - DRIFTING ACCENTS
  - PALETTE / TEMPERATURE CUE

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome description (separate axis)
  • NO lighting (separate axis)
  • NO catastrophic weather
  • NO modern weather references`,
    touchpoints: [
      'Drifting cherry-blossom petals filling the painted air in soft pink-snow, painted gentle motion captured, magical painted-spring register',
      'Falling petal-snow through the painted air in painted pearl-pink drift, painted settled petal-carpet underfoot, magical painted register',
      'Wisteria petals drifting in painted violet-clusters from overhead, painted soft pearl-violet palette, magical spring register',
      'Painted drifting rose-petals through the painted air in soft crimson-and-cream cascade, magical painted register',
      'Drifting magnolia-petals through painted depth in painted large pearl-cream petals, painted gallery-tier register',
      'Soft dawn mist drifting slowly through the painted blooms in pearl-grey wisps, painted depth softening the bloom-silhouettes, fresh painted-morning hush',
      'Low pearl-mist settled across the painted bloom-meadow at knee-height, painted depth with edges fading into haze, magical painted register',
      'Soft bloom-mist drifting through painted depth in painted soft cool-pink-grey wisps, painted gallery-tier ethereal register',
      'Gentle rain dripping from painted petal-edges with painted water-droplets visible on every bloom, painted soft pattering atmosphere, wet-shimmer register',
      'Soft drizzle painting every painted bloom with wet shimmer, painted gentle rain-pixels suspended, painted fresh peaceful register',
      'Post-rain wet shimmer with every painted bloom glistening with painted dew-and-rain droplets, painted reflective register',
      'Drifting golden pollen-motes catching the painted bloom-light in painted soft warm-light specks, painted magical register',
      'Floating pollen-clouds drifting through the painted depth around the painted blooms, painted soft warm-glow, magical register',
      'Pollen-snow drifting through the painted air in painted golden-warm motes, painted magical register',
      'Glistening morning dew on painted blooms, painted reflective droplet detail on petal-edges, fresh-morning painted register',
      'Pearl-dew droplets on painted bloom-petals catching the painted light in painted pearl-glints, fresh-morning crystal register',
      'Dew-soaked painted bloom-garden with painted shimmering droplets across every petal-edge, painted fresh peaceful register',
      'Gentle bloom-bobbing breeze with painted blooms swaying in painted soft synchronized motion, magical painted-life register',
      'Petals stirring on a painted gentle breeze with painted soft-motion drift through painted depth, magical painted register',
      'Soft wind moving painted foliage with painted bloom-cluster swaying gently, magical alive-garden register',
      'Clear painted-still air with crisp painted bloom-visibility into the depth, painted gallery-tier clarity, motionless hush register',
      'Motionless painted bloom-garden hush with crystalline clear painted air, every painted petal sharply painted, painted gallery-tier stillness register',
      'Painted butterfly-swarm drifting through the painted depth in painted colorful clusters, painted soft motion, magical register',
      'Painted butterfly-cloud filling the painted air around painted blooms in painted orange-and-yellow flight, magical painted-spring register',
      'Painted first-frost dusting painted petal-edges in soft pearl-white, painted gentle winter-petal-snow drifting through painted air, magical register',
    ],
    instructions: `Each entry is ONE specific WEATHER condition, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) air condition, (b) drifting accents, (c) palette/temperature cue. NO creature. NO biome. NO lighting. NO catastrophic weather. NO modern references. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_flower_fairy_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHOR (closest depth element bringing true 3-tier depth) for FaeBot's flower-fairy path. Each entry describes ONE specific tactile foreground element. Each entry 20-40 words.

⚠️ THE BAR: each entry adds proper 3-tier composition depth (foreground / midground her / background fading). NEVER blocks her — frames her. Painted-storybook tactile detail. Often flower-themed for flower-fairy context.

⚠️ FOREGROUND CATEGORIES (across 25 entries):
  • ~5 OVERSIZED BLOSSOM — giant bloom in foreground / large petal-curtain crowding lower frame
  • ~4 BLOOM-CLUSTER — cluster of small blooms / wildflower carpet at her feet
  • ~4 VINE / TENDRIL — hanging-vine cluster with blooms / trailing tendril
  • ~3 BUTTERFLY / INSECT CLUSTER — butterfly cluster mid-flight / dragonfly hovering
  • ~3 DEW / DROPLET — glistening dewdrops on petal-cluster / wet-petal cluster
  • ~3 PETAL-DRIFT — drifting petal-cluster filling foreground / cascade of falling petals
  • ~2 LILY-PAD / WATER ELEMENT — lily-pad edge / water-bloom reflection
  • ~1 FALLEN-PETAL CARPET — painted petal-carpet across foreground

⚠️ EVERY entry MUST include:
  - SPECIFIC TYPE
  - POSITION IN FRAME
  - TACTILE DETAIL

🚫 STRICT BANS:
  • NO creature description
  • NO biome / setting (separate axis)
  • NO weather (separate axis)
  • NO modern objects
  • NO blocking the creature`,
    touchpoints: [
      'Giant peony-bloom crowding the foreground in painted ruffled pink-and-cream petals, painted tactile petal-veining detail, painted depth between bloom and her',
      'Large magnolia-bloom dominating foreground-left in painted cream-and-pink with painted golden-stamen-center, painted gallery-tier tactile detail',
      'Oversized sunflower-disk crowding lower-right foreground with painted golden-ray petals and painted brown seed-center, painted dramatic scale-contrast',
      'Painted large blooming hibiscus in foreground-right with painted coral-and-pink petals and painted red-stamens visible, painted gallery-tier tactile detail',
      'Petal-curtain of cascading wisteria-racemes in foreground-left with painted hanging violet-petal clusters, painted gallery-tier framing',
      'Cluster of small bluebells in painted carpet across the lower painted foreground, painted soft-violet bell-shapes catching the light',
      'Wildflower carpet at her feet with painted overlapping clusters of foxgloves, wood-anemones, and daisies, painted storybook detail',
      'Painted foreground cluster of poppies in painted scarlet-and-black, painted seed-pod detail visible at painted intimate scale',
      'Painted forget-me-not cluster across the painted foreground in soft pearl-blue, painted carpet of color leading to her',
      'Hanging-vine cluster with painted blooms (clematis / honeysuckle) cascading from above in painted foreground-left, painted leaf-veined detail',
      'Trailing tendril of jasmine-vine in painted foreground-right with painted white-star blooms, painted framing detail',
      'Painted clematis-vine in painted foreground draped across the lower-edge of the frame with painted purple star-blooms, painted gallery-tier detail',
      'Painted honeysuckle-vine in painted foreground with painted yellow-and-cream trumpet-blooms cascading, painted tactile detail',
      'Painted butterfly-cluster mid-flight in painted foreground in painted orange-and-yellow swarm, painted motion captured',
      'Painted dragonfly hovering in painted foreground-right with painted iridescent wing-blur, painted magical register',
      'Painted bee-cluster in painted foreground moving between blooms in painted soft motion, painted gallery-tier detail',
      'Painted glistening dewdrops on painted petal-cluster in painted foreground, painted reflective detail at painted human-eye-level',
      'Painted dew-soaked petal-cluster in painted foreground with painted shimmering droplets, painted gallery-tier tactile register',
      'Painted wet petal-cluster in painted foreground with painted pearl-dew detail, painted reflective fresh-morning register',
      'Painted drifting petal-cluster filling painted foreground in painted pearl-pink snow, painted soft motion captured',
      'Painted cascade of falling petals in painted foreground in painted soft cherry-blossom drift, painted magical register',
      'Painted scattered fallen petals in painted foreground carpet in painted pearl-cream cascade, painted gallery-tier detail',
      'Painted lily-pad edge in painted foreground with painted jade leaves and painted pink-edged lotus-blooms, painted tactile detail',
      'Painted water-bloom reflection in painted foreground pond with painted lotus visible above and painted reflection below, painted gallery-tier register',
      'Painted fallen-petal carpet across painted foreground in painted soft pearl-pink, painted carpeted depth leading to her',
    ],
    instructions: `Each entry is ONE specific FOREGROUND ANCHOR, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific type, (b) position in frame, (c) tactile detail. NO creature. NO biome. NO weather. NO modern. NO blocking. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_flower_fairy_botanical_accent: {
    format: 'simple',
    theme: `BOTANICAL ACCENT (signature secondary-bloom cluster near her) for FaeBot's flower-fairy path. Each entry describes ONE specific named-species bloom cluster painted nearby — DIFFERENT from the primary flower-biome so it adds chromatic variety. Each entry 20-40 words.

⚠️ THE BAR: each entry is a SPECIFIC named bloom species painted with species-specific detail — painted-storybook chromatic pop. NEVER generic "wildflowers". Species cluster complements (not duplicates) the primary flower-biome.

⚠️ BLOOM SPECIES VARIETY (across 25 entries — chromatic complements):
  Spring: bluebells / foxgloves / wood-anemones / lily-of-the-valley / primrose / forget-me-nots / wisteria / dogwood / magnolia / wild-rose
  Summer: honeysuckle / jasmine / wild-iris / columbine / harebells / clematis
  Autumn: asters / wild-chrysanthemum / autumn-anemones / autumn-crocus
  Year-round: moss-rose / fern-frond / glowing-fungus / luminous-mushroom-cluster

⚠️ EVERY entry MUST include:
  - SPECIFIC NAMED SPECIES
  - COLOR DETAIL
  - POSITION RELATIVE TO HER
  - CLUSTER SIZE

🚫 STRICT BANS:
  • NO generic "flowers" / "wildflowers"
  • NO creature description
  • NO biome
  • NO lighting / weather`,
    touchpoints: [
      'Cluster of indigo-blue bluebells carpeting the painted ground beside her in painted-spring overflow, painted soft pearl-violet bell-shapes',
      'Tall foxglove-spires blooming behind her in painted pink-and-purple bell-shaped clusters, painted fairy-thimble detail',
      'Painted wood-anemones scattered across the painted ground at her feet in painted white-petal clusters with painted golden centers',
      'Painted lily-of-the-valley clusters at her feet with painted delicate white bell-shapes on painted slender green stems',
      'Painted primrose cluster painted beside her with painted pale-yellow petal-rosettes, fresh-morning register',
      'Painted forget-me-nots scattered through the painted ground in painted soft-blue clusters with painted golden centers',
      'Painted wisteria-cascade hanging in painted violet-clusters above her like painted natural ceiling, ethereal register',
      'Painted dogwood-blossom branch overhanging her with painted white-and-pink four-petal blooms, painted ethereal register',
      'Painted white-magnolia blossoms painted suspended overhead like painted lanterns, painted large luminous petals',
      'Painted wild-rose bramble blooming beside her in painted pink-and-cream cluster with painted thorny vines',
      'Painted honeysuckle-cluster trailing through painted depth behind her in painted yellow-and-cream trumpet-blooms',
      'Painted jasmine-cluster nearby with painted white-star blooms scattered through painted green-leaves',
      'Painted wild-iris cluster in painted purple-and-yellow blooms painted emerging from the painted ground',
      'Painted columbine-cluster blooming beside her in painted red-and-yellow nodding bell-shapes',
      'Painted harebells nodding gently in painted blue clusters from a painted mossy rock, magical fae register',
      'Painted clematis-blossoms cascading through painted depth in painted soft pearl-purple star-shaped clusters',
      'Painted wild-aster cluster blooming at her feet in painted violet-and-pink star-shaped blooms, painted autumn register',
      'Painted autumn-anemones blooming in painted pink-and-white clusters scattered through the painted ground',
      'Painted autumn-crocus emerging from painted ground in painted delicate pale-violet cluster',
      'Painted wild-chrysanthemum cluster in painted golden-yellow ruffled blooms, painted autumn register',
      'Painted moss-rose cluster blooming from painted painted ground in painted soft pearl-pink rosettes',
      'Painted fern-fronds painted unfurling beside her in painted spiral pattern with painted soft green-detail, fresh-spring register',
      'Painted glowing-fungus cluster painted emerging from painted moss in painted soft pearl-cyan glow-shapes',
      'Painted luminous-mushroom cluster painted ringing her painted feet in painted soft pearl-glow shapes, magical fae register',
      'Painted small-toad-stool cluster painted at her feet in painted red-and-white spotted painted detail, magical painted register',
    ],
    instructions: `Each entry is ONE specific BOTANICAL ACCENT cluster, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific named species, (b) color detail, (c) position relative to her, (d) cluster size. NO generic "flowers". NO creature. NO biome. NO lighting/weather. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_flower_fairy_candid_action: {
    format: 'simple',
    theme: `CANDID ACTION + COMPOSITION (the captured moment) for FaeBot's flower-fairy path. Each entry describes ONE specific candid moment with composition framing baked in. Each entry 30-50 words.

⚠️ THE BAR: each entry describes a SPECIFIC captured-on-camera moment with composition spec baked in. NEVER posing, NEVER eye-contact. Caught-in-the-act, off-center via rule-of-thirds. Often exploits the flower-as-home scale (nestled in tulip-bell / perched on sunflower-stamen / cupping pollen-light).

⚠️ ACTION + COMPOSITION CATEGORIES (across 25 entries):
  • ~5 LIVING-IN-FLOWERS — nestled inside tulip-bell / nestled inside peony / perched on sunflower / on lotus-pad
  • ~4 BLOOM-INTERACTION — cupping pollen-light / cradling fallen petal / inspecting bloom / brushing petal-edge
  • ~3 GATHERING / TENDING — gathering pollen / weaving petal-crown / planting seedling
  • ~3 MOVEMENT — wading through poppies / dancing through daisies / drifting through bloom-field
  • ~3 RESTING — sleeping in lotus / leaning against bloom-stalk / sitting cross-legged on petal
  • ~3 LISTENING / WATCHING — head tilted listening / watching butterfly / motionless absorption
  • ~2 MID-FLIGHT — wings spread mid-hover / mid-flight between blooms
  • ~2 GESTURE — open palm catching petal / hand raised in benediction

⚠️ COMPOSITION SPEC must be baked in per entry — same options as forest-fairy-scene.

🚫 STRICT BANS:
  • NO posing for camera / NO eye-contact with viewer
  • NO sexualized framing
  • NO centered hero-shot
  • NO "small figure in distance"
  • NO violence / NO scared / NO edgy moods
  • NO creature description
  • NO biome description`,
    touchpoints: [
      'Nestled inside a giant tulip-bell with head resting against curled inner petal-edge, captured eye-level full-figure framing, body fills 45-60% of frame, intimate painted register, off-center via rule-of-thirds',
      'Half-emerged from the heart of a giant blooming peony as if it were her home, captured medium-shot off-center, body fills 40-55% of frame, face in 3/4 profile',
      'Perched on a giant sunflower stamen with one bare foot dangling over the bloom-disk, captured close medium-shot at the right third, head turned in candid profile',
      'Seated cross-legged on a giant lotus-pad floating on a moonlit pond, captured eye-level full-figure framing, body fills 45-60% of frame, intimate painted distance',
      'Curled inside a giant rose-bloom as if it were her bedroom, captured high-angle medium shot looking down, body 40-55% of frame, surrounded by overlapping rose-petals',
      'Cupping pollen-light in her painted hands, captured close medium-shot waist-up framing at the left third, head bowed over hands in candid 3/4',
      'Cradling a single fallen petal in cupped palms, captured close medium-shot waist-up framing at the right third, head bowed over the petal',
      'Inspecting a single bloom in candid examination, captured medium-shot off-center at body 40-55% of frame, face in 3/4 profile',
      'Brushing a painted petal-edge with reverent fingertips, captured high-angle medium shot looking down at body 40-55% of frame, surrounded by blooms',
      'Gathering golden pollen-motes onto her fingertips with one outstretched hand, captured slight low-angle close, body 50-65% of frame',
      'Weaving a painted petal-crown in painted cupped palms, captured close medium-shot waist-up framing, head bowed over hands in candid 3/4',
      'Planting a tiny seedling in the painted earth with one outstretched palm, captured eye-level full-figure framing, kneeling, body fills 45-60% of frame',
      'Wading waist-deep through a painted wild poppy field with both hands trailing over the bloom-tops, captured slight low-angle close, body 50-65% of frame',
      'Dancing barefoot through a painted meadow of buttercups and white daisies, captured medium-shot off-center, body 40-55% of frame, painted motion register',
      'Drifting through a painted bloom-field with wings half-spread, captured side-profile medium shot in painted motion, hair and fabric drifting in painted breeze',
      'Sleeping curled inside a painted lotus-bloom with one cheek pressed to petal, captured high-angle medium shot, body 40-55% of frame, painted intimate register',
      'Leaning against a painted bloom-stalk with one shoulder forward, captured side-profile medium shot in painted stillness, painted intimate register',
      'Sitting cross-legged on a painted petal-cushion in quiet painted contemplation, captured eye-level full-figure framing, body fills 45-60% of frame',
      'Standing motionless mid-listen with painted head tilted to one side, captured slight low-angle close, body 50-65% of frame, framed by painted blooms',
      'Watching a painted butterfly land on a nearby bloom, captured medium-shot off-center at body 40-55% of frame, face in 3/4 profile',
      'Motionless watching a painted bee gather pollen, captured three-quarter rear angle half-turned away, head in soft profile',
      'Mid-hover between painted blooms with wings spread in painted soft motion, captured slight low-angle close, body 50-65% of frame, painted magical register',
      'Mid-flight between painted blooms with wings spread, captured side-profile medium shot in painted motion, painted magical register',
      'Open palm catching a painted falling petal in painted candid moment, captured close medium-shot at the left third, head turned to follow the petal',
      'Hand raised in painted benediction over a painted seedling, captured eye-level full-figure framing, body 45-60% of frame, head bowed in painted tender register',
    ],
    instructions: `Each entry is ONE specific candid action moment with composition spec baked in, 30-50 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific candid action, (b) composition spec, (c) body % of frame, (d) face/posture detail. NO posing. NO eye-contact. NO centered. NO small-figure. NO violence/scared. NO creature description. NO biome description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_flower_fairy_magical_flavor: {
    format: 'simple',
    theme: `MAGICAL FLAVOR (pollen-glow / supernatural atmospheric accent) for FaeBot's flower-fairy path. Each entry describes ONE specific magical accent visible in the scene. Each entry 15-35 words.

⚠️ THE BAR: each entry is a SPECIFIC magical detail painted as luminous painted register. Range from subtle (pollen-haze) to dramatic (fairy-dust trail). Pollen-glow is the DOMINANT magical signature for flower-fairy.

⚠️ MAGIC CATEGORIES (across 25 entries):
  • ~7 POLLEN-GLOW — drifting golden pollen / pollen-cloud / silver pollen-motes / glowing pollen-trail
  • ~5 FAIRY-DUST / SPARKLES — spiral of fairy-dust / glittering trail / sparkle-fingertips
  • ~4 BUTTERFLY / INSECT MAGIC — luminous butterfly cluster / firefly orbit / glowing-bee-trail
  • ~3 GLOWING WINGS — glowing wing-edges / luminous wing-trail / wing-light
  • ~2 GLOWING BLOOM — bloom glowing with magical light / pulsing-petal glow
  • ~2 MAGIC AURA — soft halo around her / glowing veins beneath skin
  • ~2 WILL-O-WISPS — single will-o-wisp / wisp orbiting her

⚠️ EVERY entry MUST include:
  - SPECIFIC MAGIC TYPE
  - POSITION OR INTERACTION
  - LIGHT QUALITY

🚫 STRICT BANS:
  • NO crude particle-effect language
  • NO modern-CGI references
  • NO creature description
  • NO violence`,
    touchpoints: [
      'Drifting golden pollen-motes filling the painted air around her in painted soft warm-light specks, painted magical register',
      'Painted pollen-cloud drifting lazily past her in painted golden-warm haze, painted magical register',
      'Painted silver pollen-motes drifting upward from her hands into the painted night air, painted magical register',
      'Painted glowing pollen-trail trailing behind her like painted slow embers, painted magical motion register',
      'Painted soft pollen-light particles drifting through the painted depth around her, painted magical ambient register',
      'Painted golden pollen-ribbon trailing behind her through the air in painted slow motion, painted magical register',
      'Painted scattered pollen-sparks around her hands in painted golden glints, painted magical register',
      'Painted spiral of fairy-dust rising from her painted fingertips in painted soft sparkle-glow, painted magical register',
      'Painted glittering fairy-dust trail drifting from her painted hand into the surrounding air, painted magical register',
      'Painted sparkle-fingertips trailing painted-gold light as she moves, painted magical motion register',
      'Painted fairy-dust scattering around her painted form in painted soft glittering motes, painted magical register',
      'Painted glittering pollen-and-fairy-dust mix drifting around her in painted golden glow, painted magical register',
      'Painted luminous butterfly cluster circling her painted form in painted soft warm-glow, painted magical register',
      'Painted firefly orbit around her in painted soft warm-yellow points at painted dusk, painted magical register',
      'Painted glowing-bee-trail trailing behind a painted bee gathering pollen, painted magical register',
      'Painted dragonfly-glow trailing painted iridescent light through painted depth, painted magical register',
      'Painted glowing wing-edges with painted soft golden-warm light tracing her wings, painted magical register',
      'Painted luminous wing-trail trailing behind her in painted soft sparkle-glow, painted magical motion register',
      'Painted wing-light radiating soft painted golden-warm glow from her wings, painted magical register',
      'Painted bloom near her glowing with painted magical pearl-light, painted magical register',
      'Painted pulsing-petal glow on painted nearby bloom with painted soft warm-light pulsing, painted magical register',
      'Painted soft halo around her painted head in painted luminous golden-warm glow, painted sacred register',
      'Painted glowing veins beneath her painted skin pulsing faintly with painted magical light, painted magical register',
      'Painted single bright will-o-wisp hovering near her painted cupped palm in painted soft golden-warm glow, painted fae register',
      'Painted wisp orbiting her painted face in painted soft pearl-glow, painted intimate register',
    ],
    instructions: `Each entry is ONE specific MAGICAL FLAVOR accent, 15-35 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific magic type, (b) position or interaction, (c) light quality. NO crude particle-effect. NO modern-CGI. NO creature description. NO violence. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_flower_fairy_scale_prover: {
    format: 'simple',
    theme: `SCALE PROVER (giant-flower-as-home element establishing her sub-human scale) for FaeBot's flower-fairy path. Each entry describes ONE specific scale-contrast element that establishes the fairy is SMALLER THAN HUMAN — flowers are her home, her room, her platform. Each entry 20-40 words.

⚠️ THE BAR: each entry adds a SPECIFIC giant-flower-as-home element that makes her scale read as sub-human. CRITICAL for path identity — without it, she just looks like a human in a flower garden. The flower must be the SCALE-PROOF (bigger than her body).

⚠️ SCALE CATEGORIES (across 25 entries):
  • ~5 GIANT BLOOM AS HOME — peony as bedroom / tulip-bell as room / magnolia as bedchamber
  • ~5 BLOOM AS PLATFORM — sunflower-disk as balcony / lotus-pad as raft / lily-pad as seat
  • ~4 OVERSIZED PETAL — single petal larger than her body / petal-curtain dwarfing her
  • ~3 STEM SCALE — bloom-stalk tall as a tree above her / vine-pillar dwarfing her
  • ~3 LEAF SCALE — single leaf larger than her body / leaf as umbrella overhead
  • ~3 BUTTERFLY / INSECT SCALE — butterfly at her scale or larger / bee her size
  • ~2 DEWDROP SCALE — single dewdrop the size of her head / pearl-droplet larger than her hand

⚠️ EVERY entry MUST include:
  - SPECIFIC SCALE ELEMENT
  - SCALE RELATIONSHIP TO HER (larger than her body / her room / her platform)
  - PAINTED TACTILE DETAIL

🚫 STRICT BANS:
  • NO creature description
  • NO biome / setting (separate axis)
  • NO modern references
  • NO breaking the painted-fantasy register
  • NO human-scale fairy reads — she MUST be sub-human scale`,
    touchpoints: [
      'A painted giant peony-bloom forming her painted bedroom, painted ruffled pink-and-cream petals dwarfing her painted form, painted overlapping bloom-layers creating a painted natural hollow',
      'A painted giant tulip-bell forming her painted room, painted curled inner petals taller than her painted body, painted striped-petal walls creating a painted natural chamber',
      'A painted giant magnolia-bloom as her painted bedchamber, painted large cream-and-pink petals dwarfing her painted form, painted overlapping bloom-layers creating a painted natural alcove',
      'A painted giant blooming rose forming her painted home, painted overlapping crimson rose-petals taller than her painted body, painted natural-hollow chamber',
      'A painted giant blooming lotus as her painted home, painted pink-and-cream petals dwarfing her painted form, painted hollow center as her painted chamber',
      'A painted giant sunflower-disk as her painted balcony, painted golden-ray petals fanning out around her painted form, painted brown seed-center as her painted seat',
      'A painted floating lotus-pad as her painted raft, painted jade pad larger than her painted body, painted overlapping nearby lily-pads',
      'A painted water-lily pad as her painted seat, painted jade leaf-platform larger than her painted body, painted floating on painted reflective water',
      'A painted giant fern-frond as her painted platform, painted unfurling spiral larger than her painted body, painted gallery-tier scale-contrast',
      'A painted giant leaf as her painted platform, painted broad leaf-surface larger than her painted body, painted natural perch',
      'A painted single oversized rose-petal larger than her painted body curving around her painted form, painted tactile petal-veining detail at painted intimate scale',
      'A painted single oversized magnolia-petal painted dwarfing her painted form, painted cream-and-pink petal-surface in painted intimate scale',
      'A painted petal-curtain of oversized falling petals painted dwarfing her painted form, painted cascade of large petals',
      'A painted single oversized lotus-petal larger than her painted body, painted pearl-pink-and-cream petal at painted intimate scale',
      'A painted oversized cherry-blossom-petal painted larger than her painted hand, painted soft pink-and-white at painted intimate scale',
      'A painted sunflower-stalk rising painted tall as a tree above her painted form, painted ribbed-green stem at painted intimate scale',
      'A painted bloom-stalk rising painted tall as a tree above her painted form, painted ridged stem and overhanging painted bloom',
      'A painted vine-pillar painted dwarfing her painted form, painted thick painted vine-trunk wrapping painted overhead',
      'A painted oversized fern-frond painted arching above her painted form like painted umbrella, painted lacy painted detail at painted intimate scale',
      'A painted single oversized leaf as painted umbrella overhead, painted broad leaf-surface painted dwarfing her painted form',
      'A painted painted leaf-canopy painted formed by painted oversized leaves dwarfing her painted form, painted natural-ceiling register',
      'A painted butterfly painted at her painted scale or painted larger, painted iridescent wings painted catching painted light, painted scale-prover',
      'A painted bee painted her painted size painted gathering pollen, painted intimate scale-contrast detail',
      'A painted single painted dewdrop painted the painted size of her painted head, painted pearl-glistening painted droplet at painted intimate scale',
      'A painted pearl-droplet painted larger than her painted hand painted on a painted petal-edge, painted reflective painted detail at painted intimate scale',
    ],
    instructions: `Each entry is ONE specific SCALE PROVER, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific scale element, (b) scale relationship to her, (c) painted tactile detail. NO creature. NO biome. NO modern. NO breaking painted-fantasy register. NO human-scale fairy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_flower_fairy_companion: {
    format: 'simple',
    theme: `COMPANION (small flower-garden animal sharing the moment with her) for FaeBot's flower-fairy path. Each entry describes ONE specific small companion woven naturally into the scene. Each entry 15-35 words.

⚠️ THE BAR: companion is at HER SCALE OR SMALLER (which means TINY — butterfly / bee / hummingbird / dragonfly / ladybug since she's sub-human scale). NEVER a competing focal subject. The eye lands on the fairy first; the companion adds story-warmth.

⚠️ COMPANION CATEGORIES (across 25 entries):
  • ~6 BUTTERFLY — monarch / swallowtail / blue morpho / luna-moth / sphinx-moth
  • ~4 HUMMINGBIRD — ruby-throated / iridescent green / mid-hover near bloom
  • ~4 BEE — honeybee / bumblebee / pollen-gathering bee
  • ~3 DRAGONFLY — iridescent dragonfly / damselfly / mid-flight
  • ~3 LADYBUG / SMALL BEETLE — ladybug on petal / iridescent beetle
  • ~2 GLOW-MOTH / FIREFLY — glowing-moth / single firefly orbit
  • ~2 SMALL FROG / TADPOLE — lily-frog / tiny tree-frog
  • ~1 BIRD (TINY) — tiny wren / small finch

⚠️ EVERY entry MUST include:
  - SPECIFIC ANIMAL SPECIES (NEVER generic "insect" or "butterfly")
  - POSITION RELATIVE TO HER (at her feet / on her hand / mid-hover near bloom / etc.)
  - POSTURE / ACTION
  - SCALE CUE (her scale or smaller)

🚫 STRICT BANS:
  • NO competing focal subject
  • NO predator-prey moments
  • NO creature description
  • NO modern or fantasy hybrids
  • NO larger-than-fairy companions (forest animals don't fit her sub-human scale)`,
    touchpoints: [
      'A painted monarch butterfly perched on her painted finger with painted orange-and-black wings spread, painted intimate scale',
      'A painted swallowtail butterfly hovering near her painted shoulder with painted yellow-and-black wing-pattern, painted soft motion captured',
      'A painted blue morpho butterfly perched on a nearby painted bloom with painted iridescent blue wings spread, painted magical register',
      'A painted luna-moth perched on her painted fingertip with painted iridescent green wings spread, painted magical register',
      'A painted sphinx-moth hovering near a painted bloom with painted soft brown wing-pattern, painted intimate register',
      'A painted small painted cabbage-white butterfly on a painted nearby bloom, painted simple painted white wing-pattern, painted intimate register',
      'A painted ruby-throated hummingbird hovering near her painted cupped palm, painted iridescent wing-blur, painted magical register',
      'A painted iridescent-green hummingbird mid-hover near a painted bloom, painted long-beak detail, painted intimate register',
      'A painted hummingbird mid-flight between painted blooms, painted iridescent wing-detail, painted magical register',
      'A painted small painted hummingbird painted sipping painted nectar from a painted bloom, painted intimate register',
      'A painted honeybee pausing on a painted bloom near her, painted soft yellow-and-black painted fur-detail, painted intimate register',
      'A painted bumblebee mid-hover near her painted shoulder, painted soft yellow-and-black painted fur, painted soft motion captured',
      'A painted pollen-gathering bee on a painted bloom near her, painted pollen-glints on its painted legs, painted intimate register',
      'A painted painted bee painted resting on a painted petal at her feet, painted intimate register',
      'A painted iridescent dragonfly perched on a painted bloom-stalk near her, painted iridescent wing-detail catching painted light, painted magical register',
      'A painted damselfly mid-flight between painted blooms, painted thin elongated body with painted iridescent wings, painted intimate register',
      'A painted dragonfly mid-hover with painted iridescent wings spread, painted magical register',
      'A painted ladybug on a painted petal at her feet, painted bright red-and-black dotted painted shell, painted intimate scale',
      'A painted iridescent beetle painted resting on a painted leaf near her, painted soft metallic-shimmer painted shell, painted intimate register',
      'A painted small painted bug on a painted bloom near her, painted intimate scale-contrast detail',
      'A painted glowing-moth circling her painted form in painted soft pearl-glow, painted magical wing-motion, painted fae register',
      'A painted firefly orbiting her painted cupped palm in painted soft warm-glow, painted intimate register',
      'A painted lily-frog at painted painted pond-edge nearby, painted soft green-and-yellow painted skin, painted intimate register',
      'A painted tiny tree-frog on a painted leaf near her, painted intimate scale-contrast, painted magical register',
      'A painted tiny wren perched on a painted bloom-stalk near her, painted tiny brown form with painted bright eye, painted intimate register',
    ],
    instructions: `Each entry is ONE specific COMPANION animal, 15-35 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific species, (b) position relative to her, (c) posture/action, (d) scale cue (her scale or smaller). NO competing focal subject. NO predator-prey. NO creature description. NO modern or fantasy hybrids. NO larger-than-fairy companions. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },


  // ─── tiny-fae path (2026-05-21 axis-system migration, 10 axes) ───
  faebot_tiny_fae_creature: {
    format: 'simple',
    theme: `STACKED-EXOTIC PALM-SIZED FAE for FaeBot's tiny-fae path. Each entry is ONE unified description of a single palm-sized (3-8 inches tall) winged mythic fae creature — willow-fae / moss-fae / dragonfly-fae / luna-fae / petal-fairy / thistle-fae / etc. Each entry 50-90 words. 5+ stacked exotic features per fae. SHE HAS WINGS.

⚠️ THE BAR: each fae reads as a SINGLE coherent palm-sized winged being. Painterly-real beauty at FAIRY-SCALE (3-8 inches). NEVER chibi, NEVER anime, NEVER Disney, NEVER Tinkerbell, NEVER mascot — Brian Froud + Charles Vess + painted-fantasy-novel-cover lineage. Slender elegant proportions. Hidden-camera candid — NEVER posing, NEVER eye-contact.

⚠️ CRITICAL: PALM-SIZED — every entry MUST explicitly note "palm-sized" / "3 inches" / "hand-sized" / "tiny" so Flux locks her sub-human scale. SHE HAS WINGS — specify wing-type per entry (dragonfly / luna-moth / damselfly / butterfly / hummingbird-blur / spun-glass / iridescent-petal).

⚠️ EVERY ENTRY MUST include AT LEAST 5 of these stacked exotic feature categories:
  - SPECIES LINEAGE — willow-fae / moss-fae / dragonfly-fae / luna-fae / petal-fairy / thistle-fae / dewdrop-fae / firefly-fae / birch-fae / wisteria-fae / cherry-blossom-fae / pollen-fae / dandelion-fae / sprite / pixie / glow-fae / etc.
  - PETAL-SKIN / SKIN TREATMENT — luminescent pearl / translucent constellation-freckled / bioluminescent / moss-tinted gold-olive / luminous porcelain / etc.
  - PLANT-MERGED HAIR — moss-green hair woven with tiny wildflowers / hair of pale willow-fronds / cascading wisteria petals / pale silk threaded with dewdrop-pearls / river-water hair / etc.
  - PETAL-GARMENT — leaf-petal bodice and moss-skirt of woven ferns / single-leaf-strip tunic / overlapping calla-lily-petal skirt / wisteria-petal wrap / draped ivy garland / etc.
  - WINGS (CRITICAL — every fae has them) — translucent dragonfly wings veined with sap-gold / luna-moth wings with iridescent silver veining / monarch butterfly wings folded / damselfly wings shimmering pale-blue / hummingbird-blur wings / spun-glass wings / etc.
  - MAGICAL SIGNATURE — softly glowing amber eyes / bioluminescent freckles / softly glowing skin / pollen-trail-trailing-fingertips / glowing-seed cupped in her palm / sparkle-wing-trail
  - CANDID POSTURE/MOMENT — perched on a fox-snout / riding a robin / kneeling on squirrel-tail / balanced on a hedgehog's quills / stepping out of a foxglove-bell / drinking from dewdrop / etc.

⚠️ FAE-SPECIES DISTRIBUTION (across 25 entries — fae-archetype variety):
  • ~4 PLANT-NAMED — willow-fae / moss-fae / birch-fae / thistle-fae / petal-fairy
  • ~4 INSECT-CODED — dragonfly-fae / damselfly-fae / luna-moth-fae / firefly-fae
  • ~3 BLOOM-NAMED — wisteria-fae / cherry-blossom-fae / dandelion-fae / pollen-fae
  • ~3 LIGHT-CODED — luna-fae / glow-fae / dewdrop-fae / star-fae / aurora-fae
  • ~3 GENERIC FAE — sprite / pixie / hand-sized-fae / palm-sized-fae / forest-sprite
  • ~3 MOOD-CODED — autumn-fae / winter-fae / spring-fae / dusk-fae
  • ~3 RARE / SPECIFIC — flame-fae / ice-fae / crystal-fae / fern-fae
  • ~2 ELEMENTAL — water-fae / wind-fae / mist-fae

🚫 ABSOLUTE BANS:
  • NO chibi / NO anime / NO Disney / NO Tinkerbell / NO mascot / NO cartoon
  • NO oversized-head proportions — painterly-real slender anatomy ONLY
  • NO regular-sized fairy (PALM-SIZED MANDATORY)
  • NO human-model beauty / NO pin-up / NO sexualized framing
  • NO posing for camera / NO direct eye-contact with viewer
  • NO bare chest, NO nipples, NO topless
  • NO modern attire / NO contemporary references
  • NO scared / angry / edgy / dark moods (peaceful-fairy register only)
  • NO wings missing — every fae has wings`,
    touchpoints: [
      'A palm-sized willow-fae with slender willowy proportions and translucent dragonfly wings veined with sap-gold, hair of pale silk threaded with dewdrop-pearls, leaf-petal bodice and moss-skirt of woven ferns, softly glowing amber eyes lowered to her cupped palms, painterly-real beauty at 3-inch scale',
      'A tiny moss-fae with luminescent pearl skin and luna-moth wings with iridescent silver veining, hair of moss-green leaves cascading down her back, draped garland of ivy across her torso, hand-sized at 5 inches tall, glowing-amber eyes lowered in soft contemplation',
      'A hand-sized petal-fairy with elegant graceful body, monarch butterfly wings folded against her back, hair of wisteria-petals flowing, snug rose-petal bodice fading to gauzy mist below the hip, softly glowing amber eyes, painterly-real fae at 4 inches tall',
      'A small dragonfly-fae with bioluminescent freckles tracing her collarbone and translucent skin showing tiny constellations beneath, gossamer fairy wings catching golden light, river-water hair flowing slowly, thin wrap of pale silk-petal with vine-skirt, painterly-real tiny scale',
      'A tiny luna-fae with luminescent pearl skin and translucent damselfly wings shimmering pale blue, hair of pale willow-fronds threaded with dewdrop-pearls, leaf-petal bodice, palm-sized at 5 inches tall, glowing-blue eyes in candid downward gaze',
      'A palm-sized forest-sprite with delicate athletic build and iridescent hummingbird-blur wings, wild moss-green hair woven with tiny wildflowers, shoulder-strap of woven vine and skirt of overlapping calla-lily petals, moss-tinted gold-olive skin, 4 inches tall painterly-real',
      'A tiny thistle-fae with softly curved feminine form and lacy translucent wings like spun glass, fern-frond hair fanning behind her, loose tunic woven of single-leaf strips, luminous violet eyes radiating gentle light, 3-inch palm-sized scale',
      'A hand-sized birch-fae with slender willowy proportions and twin damselfly wings, long flowing hair of pale silk threaded with tiny dewdrop-pearls, petal-shawl over a band of folded leaves, translucent skin glowing softly, 5 inches tall painterly-real',
      'A palm-sized firefly-fae with bioluminescent amber-glowing skin and translucent gossamer wings, hair of dark willow-fronds threaded with tiny golden sparks, leaf-bodice with vine-skirt, glowing-amber palm cradling a tiny firefly, 4-inch hand-sized scale',
      'A tiny dandelion-fae with porcelain-glowing skin and lacy spun-glass wings, hair of cascading white dandelion-tufts with tiny seed-pearls, draped petal-shawl of overlapping seed-puff blossoms over a green-stem bodice, palm-sized 3-inch scale, gentle candid pose',
      'A hand-sized wisteria-fae with luminous lavender-glowing skin and cascading hair of tiny purple wisteria-clusters brushing her ankles, gossamer wings of stitched wisteria-petals with silver veining, draped petal-shawl, palm-sized 5-inch painterly-real fae',
      'A palm-sized cherry-blossom-fae with porcelain-glowing skin and ink-black hair threaded with hundreds of pale-pink sakura petals, translucent wings of layered cherry-blossom petals with soft pink veining, petal-wrap bodice, 4-inch tall painterly-real fae',
      'A tiny pollen-fae with luminous golden-glowing skin and twin damselfly wings shimmering pale-amber, hair of cascading golden pollen-tendrils, leaf-petal bodice and moss-skirt, hand-sized at 5 inches tall, golden pollen-motes orbiting at her scale',
      'A palm-sized aurora-fae with iridescent shifting-color skin (pale-pink-to-violet-to-cyan) and translucent gossamer wings catching opalescent light, hair of cascading pearl-silver strands threaded with stars, draped silk-petal shawl, 4-inch painterly-real fae',
      'A hand-sized glow-fae with luminescent pearl-yellow skin radiating soft warm light from her core, gossamer wings catching golden ambient, hair of pale silk-and-dewdrop strands, leaf-petal bodice with vine-belt, 5-inch palm-sized scale, candid pose',
      'A palm-sized sprite with athletic slender form and twin transparent dragonfly wings, wild moss-green hair pinned with tiny bluebells, snug leaf-petal bodice and woven-vine skirt, moss-tinted gold-olive skin, 3-inch tiny scale, candid mid-action',
      'A tiny pixie with mischievous-but-gentle expression, lacy spun-glass wings, hair of bright-orange marigold-petals with seed-cluster detail, leaf-tunic with vine-belt, palm-sized at 4 inches, candid downward glance, painterly-real',
      'A palm-sized autumn-fae with petal-soft warm-amber skin and twin damselfly wings shimmering rust-and-copper, hair of cascading autumn-leaves in painted red-orange-gold tones, draped petal-shawl of overlapping autumn-leaf-petals, 5-inch scale',
      'A hand-sized winter-fae with translucent pale-pearl skin and gossamer wings catching cold-silver light, hair of cascading snow-white pale strands threaded with tiny ice-crystals, draped silk-petal shawl over snow-fern-bodice, palm-sized 4-inch scale',
      'A tiny spring-fae with porcelain-pink-glowing skin and twin damselfly wings shimmering pearl-pink, hair of cascading pink-blossom petals threaded with tiny green leaves, woven petal-bodice over fresh-green leaf-skirt, palm-sized 3-inch painterly-real',
      'A palm-sized dusk-fae with translucent pale-violet skin and gossamer wings catching twilight-purple-amber light, hair of cascading deep-indigo strands with tiny star-points threaded, draped petal-shawl, 4-inch scale, gentle candid contemplation',
      'A hand-sized fern-fae with moss-tinted olive-glowing skin and twin transparent dragonfly wings, hair of unfurling green fern-fronds threaded with tiny seeds, leaf-petal bodice with green-vine-skirt, palm-sized 5-inch painterly-real fae',
      'A palm-sized water-fae with luminous pale-blue skin and lacy spun-glass wings, hair of cascading flowing river-water strands with dewdrop-pearls, draped silk-petal shawl of water-lily-petals, 4-inch tiny scale, candid pose',
      'A tiny mist-fae with translucent silver-grey skin and gossamer wings catching cool-pearl light, hair of cascading misty pale strands almost dissolving at the edges, draped silk-petal shawl, palm-sized 3-inch painterly-real fae, gentle candid pose',
      'A palm-sized star-fae with iridescent constellation-freckled skin and translucent gossamer wings catching cosmic-blue light, hair of cascading pearl strands with tiny star-points scattered through, draped silver-petal shawl, 4-inch scale, candid downward glance',
    ],
    instructions: `Each entry is ONE unified mythic palm-sized fae description, 50-90 words. Format: prose, comma-separated phrases. MANDATORY — 5+ stacked exotic features (species + skin + plant-merged hair + petal-garment + WINGS + magical signature + candid posture) AND explicit "palm-sized" / "3-inch" / "5-inch" / "hand-sized" / "tiny" scale note. NO chibi/anime/Disney/Tinkerbell/mascot. NO posing. NO eye-contact. NO bare chest. NO regular-sized fairy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_tiny_fae_scale_anchor_companion: {
    format: 'simple',
    theme: `SCALE-ANCHOR COMPANION (DWARFING) for FaeBot's tiny-fae path. Each entry describes ONE specific normal-sized forest creature that DRAMATICALLY DWARFS the palm-sized fae in the same frame. Each entry 30-55 words.

⚠️ THE BAR: each entry MUST show the fae UNDER / DWARFED-BY / FITTING-ON-A-SINGLE-FEATURE of a creature that is MUCH LARGER than her. This is the PATH IDENTITY — without dramatic dwarfing, Flux renders a regular-sized fairy and the path fails.

⚠️ DWARFING POSITIONS — every entry MUST use ONE of these (NEVER "beside" / "equal-scale"):
  - The fae stands UNDER the looming face of the creature, the creature's NOSE / SNOUT / BEAK fills half the frame above her
  - The fae perches ON a single feature (on the creature's NOSE / SNOUT / BACK / PAW / EAR / ANTLER / WING / HORN), the creature's body fills the rest of the frame
  - The fae mid-flight near the creature's MASSIVE HEAD, the creature fills most of the frame
  - The fae fits INSIDE a single body-part curl (cupped in a paw / sleeping in a hoof-print / curled in an ear)
  - The creature LOOMS OVER her from above (looking down at her from massive face)

⚠️ COMPANION CATEGORIES (bias toward LARGER creatures that dwarf better):
  • ~5 LARGER MAMMALS — fox (adult) / deer / fawn / rabbit (adult) / hare / wolf-pup / bear-cub
  • ~4 MEDIUM MAMMALS — squirrel / chipmunk / hedgehog / dormouse / pine-marten / mole
  • ~4 BIRDS — robin / wren / chickadee / blue-tit / sparrow / hummingbird / owl-fledgling
  • ~3 LARGE INSECTS — stag-beetle / large-dragonfly / large-moth (she rides ON them, dwarfed)
  • ~3 BUTTERFLY — monarch / swallowtail (she rides ON the back, butterfly LARGER than her)
  • ~2 AMPHIBIANS — large-toad / tree-frog / salamander (only positions where she's CLEARLY smaller)
  • ~2 OWLS — small-owl / barn-owl-juvenile (she fits in a talon-curl)
  • ~1 RARE LARGE — stag-with-antlers / great-horned-owl (dramatic dwarfing)
  • ~1 RARE GENTLE — small-hare-doe / vixen

⚠️ EVERY entry MUST include:
  - SPECIFIC ANIMAL SPECIES
  - DWARFING POSITION (under its looming face / perched on its nose / fits in its paw / etc.)
  - PAINTED TACTILE DETAIL (fur / feathers / whisker / breath-mist / etc.)
  - EXPLICIT SCALE-CONTRAST PHRASE ("the fae is half the length of its whisker" / "the fae fits in the curl of its tail" / "the creature's nose is wider than her entire body" / "she would fit in its closed paw")
  - The fae is SMALL relative to the creature in the frame

🚫 STRICT BANS:
  • NO "beside it" / "next to" / "equal scale" — only DWARFING positions
  • NO creature description of the fae (separate axis)
  • NO additional fae figures
  • NO predatory / aggressive postures (creature is gentle / sleeping / curious / playful)
  • NO oversized cartoonish proportions on the companion`,
    touchpoints: [
      'A massive sleeping fox-cub curled in moss with soft russet fur filling the painted frame, painted gentle breathing, the palm-sized fae perched on its snout no taller than the bridge of its painted nose, the cub\'s nose alone wider than her body, dramatic dwarfing scale',
      'A spotted fawn lying gentle in moss with soft white-spotted brown fur dominating the painted background, painted long-lashed gentle eyes half-closed, the palm-sized fae perched on the curve of its raised hoof — fae fits inside a single hoof print, scale-dwarf register',
      'A red squirrel pausing on a thick branch with painted bright orange fur, its bushy tail curled forward like an enormous painted plume, the palm-sized fae sitting in the curve of its tail no taller than the tail-tuft itself, dramatic dwarfing scale',
      'A large hedgehog pauses on the moss with painted spiked-quill detail dominating the frame, the palm-sized fae balanced on the curve of its back atop the quills, fae barely as tall as a single quill, painted dramatic scale-proof',
      'A massive sleeping bear-cub curled in painted soft brown fur filling the painted frame, painted gentle breathing, the palm-sized fae perched on its paw between two toes, fae would fit inside the cub\'s closed paw, dramatic dwarfing register',
      'A hare-doe sitting motionless with painted soft brown-and-grey fur and tall ears upright dominating the painted frame, the palm-sized fae sitting on the curve of its back between the painted ears, the hare\'s ear alone twice her height, dramatic dwarfing scale',
      'A red-fox kit pausing curious with painted soft russet fur, its massive face filling the painted upper frame, the palm-sized fae standing on its outstretched paw at the bottom of the frame, the kit\'s eye alone larger than her entire body',
      'A wolf-pup lying playful with painted soft grey-and-cream fur dominating the painted frame, painted gentle eyes lowered, the palm-sized fae perched on its painted ear-tuft, the ear alone twice the fae\'s height, dramatic dwarfing scale',
      'A massive painted red robin perched dominating the frame with painted feathered orange-red breast, the palm-sized fae fits on its back like a saddle her body half the length of a single wing, the robin\'s eye larger than her face',
      'A painted chickadee on a fern-frond with painted black-and-white feather-pattern, the painted chickadee dominating the frame at its scale, the palm-sized fae standing on the bird\'s painted back her body fitting between two feathers, dramatic dwarfing scale',
      'A wren mid-pause on a twig dominating the frame with painted soft brown plumage and bright eye, the palm-sized fae sitting on its painted shoulder, fae no taller than the wren\'s beak, painted intimate dwarfing register',
      'A blue-tit perched on a hanging vine dominating the frame with painted soft-blue and yellow feathers, the palm-sized fae perched on its back her body the length of a single feather, the bird\'s eye larger than her face, dramatic dwarfing register',
      'A hummingbird mid-hover with painted iridescent green-and-ruby plumage dominating the painted frame, the palm-sized fae mid-flight beneath its painted belly, the hummingbird three times her height, dramatic dwarfing scale',
      'A massive painted sparrow on a fern-frond, painted soft brown plumage dominating the frame, the palm-sized fae standing on its painted talon, fae the size of a single sparrow-toe, dramatic scale-dwarf',
      'A chipmunk crouched in painted leaves with painted brown-and-cream stripes dominating the frame, the palm-sized fae sitting in the curve of its tail, fae no taller than its painted tail-tuft, dramatic dwarfing scale',
      'A dormouse curled asleep in a painted hollow with painted soft golden-fur filling the painted frame, painted gentle breathing, the palm-sized fae sitting beside its closed eye almost touching its painted whisker, the whisker thicker than her arm',
      'An owl-fledgling perched on a thick branch dominating the painted frame with painted fluffy gray-down feathers, painted large round eyes half-closed, the palm-sized fae standing on its talons her body fitting inside one painted talon-curl',
      'A pine-marten pausing on a branch with painted soft brown fur dominating the painted frame, the palm-sized fae perched on its painted shoulder her body the size of a single painted ear, dramatic dwarfing scale',
      'A massive stag-beetle climbing a fallen-log with painted iridescent-blue carapace dominating the painted frame, the palm-sized fae riding on its back her body the length of a single painted mandible-tooth, dramatic dwarfing register',
      'A large dragonfly hovering with painted iridescent green-and-blue wing-detail dominating the painted frame, the palm-sized fae mid-flight at its painted abdomen-base her body the length of a single painted wing-vein, dramatic dwarfing',
      'A monarch butterfly with painted orange-and-black wing-detail spread filling the painted frame, the palm-sized fae riding on its painted thorax between the wings, fae the length of a single painted wing-cell, dramatic scale-dwarf register',
      'A swallowtail butterfly hovering near a bloom with painted yellow-and-black wing-pattern dominating the painted frame, the palm-sized fae riding on its painted back her body fitting between two wing-veins, dramatic dwarfing',
      'A large luna-moth perched on a leaf with painted iridescent green-and-pearl wing-pattern dominating the painted frame, the palm-sized fae standing on the moth\'s back her body the length of a single painted wing-tip, dramatic dwarfing',
      'A painted barn-owl-juvenile perched on a branch dominating the painted frame with painted pale heart-shaped face and dark eyes, the palm-sized fae standing on its talons her body fitting inside one painted talon-curl, dramatic dwarfing scale',
      'A great-horned-owl looms over her from above with painted tufted ears and massive yellow eyes filling the painted upper frame, the palm-sized fae standing on the moss below dwarfed by its painted face, dramatic dwarfing register',
    ],
    instructions: `Each entry is ONE specific DWARFING SCALE-ANCHOR COMPANION, 30-55 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific animal species, (b) DWARFING position (perched ON a single feature / under its looming face / fits inside a single body-part / etc.), (c) painted tactile detail, (d) explicit scale-contrast phrase ("fae no taller than the X" / "fits inside Y" / "Z alone wider than her body"). NO "beside" / "equal scale". NO creature description of fae. NO predatory aggression. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_tiny_fae_macro_perch: {
    format: 'simple',
    theme: `MACRO PERCH for FaeBot's tiny-fae path. Each entry describes ONE specific normal-scale object that the palm-sized fae is ON, IN, or RIDING — rendered as ENORMOUS relative to her. Each entry 20-40 words.

⚠️ THE BAR: each perch is a normal-sized forest object (mushroom-cap, leaf, branch-tip, acorn, flower-bell, dewdrop-rim, pebble) painted at its natural scale but THE WORLD RELATIVE TO HER — the mushroom-cap is HER throne, the dewdrop is HER cup, the flower-bell is HER bedroom. Establishes the macro perspective.

⚠️ PERCH CATEGORIES (across 25 entries):
  • ~5 MUSHROOM PERCHES — red-spotted toadstool / amber bracket-mushroom / pearl-glow mushroom / oyster-mushroom / morel
  • ~5 LEAF PERCHES — fern-frond / oak-leaf / maple-leaf / lily-pad / lotus-leaf
  • ~3 FLOWER PERCHES — foxglove-bell / tulip-bell / poppy-petal / iris-petal / rose-petal
  • ~3 BRANCH / TWIG — moss-covered branch / hanging twig / fern-tip / vine-curl
  • ~2 NATURAL FOREST OBJECT — fallen-acorn / pine-cone / berry-cluster / pebble
  • ~2 DEWDROP / WATER — dewdrop-rim / lily-pad-edge / mushroom-cap-puddle / leaf-bowl-of-rain
  • ~2 CREATURE-AS-MOUNT — riding a beetle / on a bird-back / on a butterfly / fawn-hoof
  • ~3 MAGICAL OBJECT — glowing-mushroom / glowing-seed / lichen-cluster / spider-silk-thread

⚠️ EVERY entry MUST include:
  - SPECIFIC PERCH OBJECT
  - HOW IT DWARFS HER (the X is HER Y / she fits on/in/inside its Z)
  - PAINTED TACTILE DETAIL (cap-texture / leaf-vein / petal-curve / etc.)

🚫 STRICT BANS:
  • NO creature description of fae
  • NO creature description of scale-anchor companion (separate axis)
  • NO modern objects
  • NO objects too tiny to be a perch (no dust-mote / no spore)`,
    touchpoints: [
      'Standing on a red-spotted toadstool with painted white-spotted crimson cap and pale gills below, the cap forms HER throne — the toadstool is twice her height',
      'Seated on a hanging amber bracket-mushroom that juts from a tree-trunk like a shelf, painted curved wood-and-spore texture, the mushroom is HER bench',
      'Curled inside an open foxglove-bell with painted pink-and-purple mottled-throat detail, the bell is HER bedroom, painted soft petal-curve dwarfing her',
      'Perched on a single furled fern-frond with painted lacy green spiral-detail, the frond is HER ladder, painted gallery-tier macro scale',
      'Standing on a wet lily-pad floating on water with painted jade green-leaf-veining, the pad is HER raft, the painted water surface reflects upward',
      'Seated on a giant fallen acorn with painted brown-and-tan cap-scales, the acorn is HER stool, painted close-up tactile detail',
      'Perched on the curling edge of a giant tulip-petal with painted pearl-pink curve, the petal is HER seat at 3x her height',
      'Standing on a moss-covered branch with painted velvety green-moss texture, the moss-strands are HER tall grass at hip-height',
      'Curled inside a single overturned poppy-petal with painted scarlet crinkled-silk texture, the petal is HER hammock, painted close-up detail',
      'Balanced on the rim of a giant dewdrop catching the canopy-light, painted refractive-clarity, the dewdrop is HER mirror, painted shimmer detail',
      'Riding on the back of a stag-beetle with painted iridescent blue-green carapace, the beetle is HER mount, painted close-up shell-detail',
      'Perched on the curl of a giant fern-tendril unfurling, painted soft-green spiral-detail, the fern-tendril is HER playground-slide',
      'Seated on a pine-cone with painted brown-and-tan layered scales, the pine-cone is HER chair, painted gallery-tier macro detail',
      'Standing inside a pearl-glow mushroom cap with painted soft cyan inner-glow, the glowing mushroom is HER lantern-room, painted magical register',
      'Perched on a single hanging spider-silk thread with painted iridescent sheen, the thread is HER tightrope at her scale, painted delicate detail',
      'Curled on a giant lichen-cluster with painted pale-grey-green texture, the lichen is HER cushion, painted close-up tactile register',
      'Seated on a moss-and-leaf-cushion on a fallen-log with painted green-moss texture and brown bark, the log is HER vast couch',
      'Standing on a curling oak-leaf with painted veined-detail and curled-edge, the leaf is HER cape blown back, painted close-up tactile register',
      'Balanced on a single dewdrop on the tip of a fern-frond, painted refractive-clarity, the dewdrop is HER perch and her cup',
      'Riding on the back of a robin with painted feathered breast-detail, the robin is HER mount soaring through the canopy',
      'Perched on the curl of a giant ivy-tendril winding around a trunk, painted green-leaf-veining detail, the ivy-tendril is HER hammock',
      'Curled inside an iris-petal with painted yellow-falls and purple bearded-detail, the petal is HER bedroom-curtain',
      'Seated on a glowing-mushroom cap with painted soft pearl-cyan inner-light, the mushroom is HER throne-lantern, painted magical register',
      'Standing on a single overturned rose-petal with painted pink-and-cream crinkled-silk texture, the petal is HER stage at her scale',
      'Perched on a cluster of dewdrops along a spider-silk strand, painted refractive-clarity, the dewdrops are HER stepping-stones',
    ],
    instructions: `Each entry is ONE specific MACRO PERCH, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific perch object, (b) how it dwarfs her ("HER throne / HER bedroom / HER cushion"), (c) painted tactile detail. NO creature description (fae or companion). NO modern objects. NO objects too tiny. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_tiny_fae_forest_micro_biome: {
    format: 'simple',
    theme: `FOREST MICRO BIOME for FaeBot's tiny-fae path. Each entry describes ONE specific patch of enchanted forest rendered FROM the palm-sized fae's perspective — the world at HER scale. Each entry 25-50 words.

⚠️ THE BAR: each biome is a macro-perspective forest setting where normal-sized forest features are RENDERED ENORMOUS — giant ferns at her height, towering moss-tufts, fallen-acorn-boulders, mushroom-groves at her scale, moss-canyons, beetle-roads through moss. The world is painted FROM her eye-level looking at her tiny world.

⚠️ BIOME CATEGORIES (across 25 entries):
  • ~4 GIANT FERN GROVES — fern-fronds towering like trees at her scale
  • ~3 MUSHROOM GROVES — giant mushrooms forming a forest at her scale
  • ~3 MOSS-CANYONS — vertical moss-tufts forming walls at her scale
  • ~3 ACORN-BOULDER FOREST-FLOOR — fallen acorns the size of boulders to her
  • ~3 BLOOM-BOWERS — bell-flowers / foxgloves at her scale forming chambers
  • ~3 DEWDROP-FOREST — leaf-clusters with hanging dewdrops at her scale
  • ~2 ROOT-CATHEDRAL — gnarled ancient roots rising overhead like cathedral
  • ~2 LICHEN-COLONY — silver-grey lichen-clusters forming a cluster at her scale
  • ~2 PETAL-CARPET FOREST-FLOOR — fallen petals making a carpet at her scale

⚠️ EVERY entry MUST include:
  - SPECIFIC FOREST FEATURE rendered ENORMOUS at her scale
  - WORLD-AT-HER-SCALE detail (fern-frond is HER tree / moss-tuft is HER hill / acorn is HER boulder)
  - MULTI-TIER MACRO DEPTH (foreground detail / midground feature / background fading into atmospheric haze)

🚫 STRICT BANS:
  • NO creature description of fae or companion (separate axes)
  • NO modern setting / urban elements
  • NO regular-perspective forest (this is MACRO from her perspective)
  • NO open meadows / garden fields`,
    touchpoints: [
      'A giant fern-grove rendered at fairy-scale with fern-fronds towering like green spiral-trees, moss-floor receding into soft painted depth, painted close-up fern-leaf-veining detail in foreground',
      'A mushroom-grove at her scale with painted red-spotted toadstools and amber bracket-mushrooms forming a fairy-cathedral overhead, moss-floor below, painted depth fading into golden-light haze',
      'A vertical moss-canyon with painted velvety green-moss walls rising on either side at her scale, dewdrops clinging to the moss like jewels, painted gallery-tier macro register',
      'A fallen-acorn-boulder forest-floor with painted brown acorns scattered like ancient stones at her scale, painted leaf-cluster details between, soft painted haze beyond',
      'A bloom-bower of giant foxglove-bells with painted pink-and-purple mottled blooms hanging overhead like chandeliers, painted moss-floor underneath, atmospheric depth',
      'A dewdrop-forest of leaf-clusters with hanging dewdrops the size of marbles at her scale, painted refractive-clarity on every drop, painted gallery-tier register',
      'A root-cathedral of gnarled ancient oak-roots rising overhead at her scale, painted bark-textured curves forming a natural ceiling, moss-floor below, soft painted dappled light filtering through',
      'A lichen-colony with painted pale-grey-green lichen-clusters forming a cluster of small caves at her scale, painted close-up tactile detail',
      'A petal-carpet forest-floor with painted scattered fallen pink-and-cream petals carpeting the ground at her scale, painted gallery-tier soft register',
      'A giant fern-and-moss patch with painted unfurling green fern-fronds taller than her, painted velvety moss-floor and lichen-clusters, painted depth fading into pearl-mist',
      'A mushroom-grove of pearl-glow mushrooms at her scale with painted soft cyan inner-light from the gills, moss-floor underneath, painted magical atmospheric depth',
      'A moss-canyon with foxglove-spires growing up the walls in painted pink-purple cluster, hanging-vine-blooms cascading at her scale, painted vertical-scale register',
      'A bloom-bower of giant tulip-bells in pearl-pink-and-cream forming chambers at her scale, painted petal-curves dwarfing her, soft painted bloom-mist beyond',
      'A fern-grove with morning dewdrops scattered across every frond at her scale, painted refractive-clarity, painted dappled god-rays piercing through, magical macro depth',
      'An acorn-boulder forest-floor scattered with fallen-acorns and tiny twigs at her scale, painted close-up tactile texture, painted depth fading into soft amber haze',
      'A root-cathedral of birch-roots rising overhead at her scale, painted pale silver-bark curves, painted moss-floor below threaded with tiny wildflowers',
      'A dewdrop-forest of spider-silk-strands with dewdrops clinging like pearl-strings at her scale, painted gallery-tier refractive-clarity register',
      'A petal-carpet forest-floor of fallen cherry-blossom petals carpeting the ground at her scale, painted scattered green-moss patches, painted ethereal pearl-pink atmosphere',
      'A mushroom-and-moss patch with painted red-spotted toadstools at her scale and painted velvety moss-floor between, painted dappled forest-light',
      'A giant fern-canyon with vertical fern-fronds forming walls at her scale, painted moss-floor below threaded with tiny wildflowers, painted depth',
      'A bloom-bower of cascading wisteria-clusters at her scale with painted violet petal-cluster forming a natural cathedral, painted moss-floor below, dappled light',
      'A lichen-colony forest-floor with painted silver-grey lichen-tufts the size of bushes at her scale, painted scattered moss-patches between, painted gallery-tier macro register',
      'A dewdrop-forest of fern-fronds with hanging dewdrops at her scale, painted refractive-clarity on each drop, painted dappled god-rays piercing through magical atmosphere',
      'A petal-carpet forest-floor of fallen-rose petals carpeting the ground at her scale, painted close-up red-and-cream crinkled-silk texture, painted depth',
      'A mushroom-grove of amber bracket-mushrooms growing up a fallen-log at her scale, painted bark-and-fungi textures, painted gallery-tier macro forest register',
    ],
    instructions: `Each entry is ONE specific FOREST MICRO BIOME, 25-50 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific forest feature ENORMOUS at her scale, (b) world-at-her-scale detail ("HER tree / HER boulder / HER chandelier"), (c) multi-tier macro depth. NO fae description. NO modern. NO regular-perspective forest. NO open meadows. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_tiny_fae_lighting: {
    format: 'simple',
    theme: `LIGHTING (time-of-day + light drama) for FaeBot's tiny-fae path. Each entry describes ONE specific time-of-day + light moment combination tuned for macro-perspective fairy renders. Each entry 25-45 words.

⚠️ THE BAR: each entry establishes a SPECIFIC light moment with macro-photography drama — golden-hour through canopy onto her, dappled god-rays piercing fern-canopy, moonlit silver on her wings, blue-hour with firefly-glow at her scale, soft pearl-mist dawn through forest. Light is its own character.

⚠️ LIGHTING CATEGORIES (across 25 entries):
  • ~7 GOLDEN-HOUR — afternoon warm-amber through canopy / late-afternoon backlight gilding her wings
  • ~4 DAWN — soft-pink dawn / pearl-mist dawn / golden dawn beams through forest
  • ~4 BLUE-HOUR / TWILIGHT — cool-blue twilight with firefly-glow at her scale / violet-twilight magical glow
  • ~3 MIDDAY — bright midday god-rays piercing canopy / harsh dappled light filtering through ferns
  • ~3 MOONLIT — silver moonlight on dewy ferns / blue-moon ambient through canopy
  • ~3 BIOLUMINESCENT — soft pollen-light ambient at her scale / glowing-mushroom register / firefly-cluster ambient
  • ~1 RARE — aurora-light filtering through canopy / will-o-wisp orbit at her scale

⚠️ EVERY entry MUST include:
  - SPECIFIC TIME-OF-DAY
  - SPECIFIC LIGHT QUALITY (god-rays / shafts / ambient / dappled)
  - PALETTE CUE
  - HOW IT CATCHES HER (catching her wings / gilding her hair / silhouetting her form)

🚫 STRICT BANS:
  • NO creature description (fae or companion)
  • NO biome description (separate axis)
  • NO weather (separate axis)
  • NO modern light sources
  • NO photographic technique language
  • NO storm / lightning / dark-grey-blue (peaceful enchanted register only)`,
    touchpoints: [
      'Golden afternoon god-rays piercing the fern-canopy in dramatic shafts of warm-amber light, gilding her wings translucent, painted dust-motes catching the beams at her scale',
      'Late-afternoon warm sidelight raking across her perch from a low angle, painted long shadows stretching across the moss-floor, warm-amber palette with cool-blue shadows',
      'Magic-hour golden light filtering through the canopy with painted dappled warm patterns across her wings, painted-storybook softness, warm-amber-and-gold palette',
      'Late-afternoon backlight piercing through her translucent wings creating warm halo-glow on every wing-vein, painted soft warm-amber register, atmospheric backlit depth',
      'Golden warm sidelight from a low angle creating long painted shadows, warm halo-glow around her hair, cool-blue shadows pooling in the negative space',
      'Magic-hour dappled gold patches catching her perch in painted warm-amber spots, painted soft register, atmospheric forest light at her scale',
      'Golden-hour through cathedral canopy creating warm-amber and emerald dappled pattern on the moss-floor, gilding her wings in painted soft warm light',
      'Pearl-mist dawn beams angling low through the canopy in shafts of soft white-gold, drifting mist catching the beams, fresh painted-morning register, cool-warm contrast at her scale',
      'Soft-pink dawn light filtering through the canopy with rose-gold-and-lavender palette, gentle peaceful painted-storybook register, early-morning warmth on her wings',
      'Golden dawn beams angling through the canopy from a low east angle, drifting dust-motes catching the beams, warm-gold painted register, fresh-morning gilded wings',
      'Fresh-spring morning light with soft cool-warm palette and gentle dappled patterns on her perch, painted hopeful register, dewdrop-glints catching low warm light',
      'Cool-blue twilight with warm-yellow under-light from fireflies illuminating her face from below, cool-blue ambient overhead, magical twilight drama at her scale',
      'Blue-hour twilight with the last warm-orange of sunset bleeding through painted distant trunks, cool-blue overhead transitioning to warm-amber at the horizon',
      'Magical violet-twilight glow saturating the forest in soft lavender-and-blue, faint pollen-light particles at her scale, dreamy painted-fantasy register',
      'Blue-hour low warm under-light from will-o-wisps illuminating her face from below, cool-blue ambient overhead, dramatic painted underlight register',
      'Midday god-rays piercing the canopy in dramatic vertical shafts of brilliant white-gold, harsh painted contrast between shafted-light and deep-shadow at her scale',
      'High-noon canopy-filter with painted dappled bright-gold patches across her perch, harsh-amber-with-cool-shadow painted contrast',
      'Strong midday backlight piercing through her wings creating dramatic silhouette-edges, painted warm-gold-and-shadow register, dramatic high-contrast lighting drama',
      'Silver moonlight shafts cutting through the canopy creating cool-blue painted shafts illuminating her wings, deep-blue shadow ambient, magical night register',
      'Blue-moon ambient flooding the forest with cool silver-blue painted light, soft white-glow on her wing-edges, magical hushed nighttime register at her scale',
      'Moonlit silver-and-violet ambient with distant moon visible through the canopy gap, scattered pixel-stars beyond, deep-blue painted ambient saturating the scene',
      'Soft cyan-glow ambient from bioluminescent moss carpeting the forest floor, gentle teal-and-violet painted illumination at her scale, magical register',
      'Pearl-glow from cluster of glowing mushrooms casting soft cyan-warm light onto her wings, magical bioluminescent painted register with warm-cool contrast',
      'Firefly-cluster ambient with warm-yellow firefly-glows orbiting at her scale, painted soft warm-amber register, magical evening glow',
      'Aurora-light filtering through the upper-canopy in soft green-and-pink curtains, painted magical multi-color ambient on the moss-floor, magical arctic-painted register',
    ],
    instructions: `Each entry is ONE specific LIGHTING moment, 25-45 words. Format: prose, comma-separated phrases. MANDATORY — (a) time-of-day, (b) light quality, (c) palette cue, (d) how it catches her. NO creature. NO biome. NO weather. NO modern. NO photographic language. NO storm/lightning. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_tiny_fae_weather: {
    format: 'simple',
    theme: `WEATHER (air condition + drifting accents) for FaeBot's tiny-fae path. Each entry describes ONE specific atmospheric air condition + drifting accents at fairy-scale. Each entry 20-40 words.

⚠️ THE BAR: each entry establishes a SPECIFIC air condition with drifting accents adding painted-storybook depth at her macro scale. ALWAYS peaceful — no destructive storms. Particles often at her scale (dewdrop-glints / drifting pollen / firefly-drift).

⚠️ WEATHER CATEGORIES (across 25 entries):
  • ~5 PETAL-DRIFT — drifting petals at her scale / falling petal-snow / scattered settled petals
  • ~4 MIST / FOG — dawn mist drifting through ferns / low pearl-mist / soft forest-mist haze
  • ~4 DEW-GLINTS — glistening morning dew on every leaf / pearl-dew droplets / dew-soaked
  • ~3 RAIN — gentle rain on ferns / soft drizzle / post-rain wet-shimmer
  • ~3 POLLEN-HAZE — drifting golden pollen-motes / floating spore-light / pollen catching beams
  • ~3 BREEZE — gentle fern-bobbing breeze / soft wind moving foliage / petals stirring softly
  • ~2 CLEAR / STILL — clear painted-still air with crisp forest visibility / motionless forest hush
  • ~1 SNOW-DUST — winter petal-snow / first-frost on petal-edges

⚠️ EVERY entry MUST include:
  - SPECIFIC AIR CONDITION
  - DRIFTING ACCENTS (at her scale: dew-glints, pollen-motes, petal-drift, firefly-drift)
  - PALETTE / TEMPERATURE CUE

🚫 STRICT BANS:
  • NO creature description (separate axes)
  • NO biome description (separate axis)
  • NO lighting (separate axis)
  • NO catastrophic weather
  • NO modern weather references`,
    touchpoints: [
      'Drifting cherry-blossom petals filling the painted air at her scale in soft pink-snow, gentle motion captured, magical painted-spring register',
      'Falling petal-snow through the painted air in pearl-pink drift at her scale, settled petal-carpet underfoot, magical painted register',
      'Wisteria petals drifting in painted violet-clusters at her scale from overhead, soft pearl-violet palette, magical spring register',
      'Drifting rose-petals through the painted air at her scale in soft crimson-and-cream cascade, magical painted register',
      'Drifting magnolia-petals through painted depth in painted large pearl-cream petals at her scale, painted gallery-tier register',
      'Soft dawn mist drifting slowly through the ferns in pearl-grey wisps at her scale, painted depth softening the fronds, fresh painted-morning hush',
      'Low pearl-mist settled across the moss-floor at her hip-height (knee-height to her), painted depth with edges fading into haze',
      'Soft forest-mist drifting through painted depth in cool pink-grey wisps at her scale, painted gallery-tier ethereal register',
      'Soft drifting mist threading between fern-fronds in painted whisps at her scale, atmospheric depth softening the surrounding ferns, magical hushed register',
      'Glistening morning dew on painted leaves and petal-edges, painted reflective droplet detail at her scale, fresh-morning painted register',
      'Pearl-dew droplets on painted bloom-petals catching the painted light in painted pearl-glints at her scale, fresh-morning crystal register',
      'Dew-soaked forest-patch with painted shimmering droplets across every leaf-edge at her scale, painted fresh peaceful register',
      'Shimmering dewdrops on every spider-silk thread at her scale, painted refractive-clarity, painted fresh-morning glitter',
      'Gentle rain dripping from leaves and fern-edges with painted water-droplets visible at her scale, painted soft pattering atmosphere, wet-shimmer register',
      'Soft drizzle painting every surface with a wet shimmer at her scale, painted gentle rain-pixels suspended, painted fresh peaceful register',
      'Post-rain wet shimmer with every painted bloom and fern glistening with dew-and-rain droplets at her scale, painted reflective register',
      'Drifting golden pollen-motes catching the canopy light at her scale in painted soft warm-light specks, painted magical register',
      'Floating pollen-clouds drifting through the painted depth at her scale, painted soft warm-glow, magical register',
      'Pollen-snow drifting through the painted air at her scale in painted golden-warm motes, painted magical register',
      'Gentle fern-bobbing breeze with painted fern-fronds swaying in soft synchronized motion, magical painted-life register at her scale',
      'Petals stirring on a gentle breeze with painted soft-motion drift through painted depth at her scale, magical painted register',
      'Soft wind moving painted foliage with painted bloom-cluster swaying gently at her scale, magical alive-forest register',
      'Clear painted-still air with crisp painted visibility into the forest depth at her scale, painted gallery-tier clarity, motionless hush register',
      'Motionless painted forest hush with crystalline clear air at her scale, every painted leaf-edge sharply painted, painted gallery-tier stillness register',
      'First-frost dusting painted petal-edges in soft pearl-white at her scale, painted gentle winter-petal-snow drifting through the painted air, magical register',
    ],
    instructions: `Each entry is ONE specific WEATHER condition, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) air condition, (b) drifting accents at her scale, (c) palette/temperature cue. NO creature. NO biome. NO lighting. NO catastrophic weather. NO modern references. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_tiny_fae_action: {
    format: 'simple',
    theme: `FAE ACTION + COMPOSITION (captured moment at her scale) for FaeBot's tiny-fae path. Each entry describes ONE specific candid moment with composition framing baked in. Each entry 30-50 words.

⚠️ THE BAR: each entry describes a SPECIFIC captured-on-camera moment at fairy-scale with composition spec baked in. NEVER posing, NEVER eye-contact. Caught-in-the-act, candid macro moment. Often interacting with the scale-anchor companion or perch.

⚠️ ACTION CATEGORIES (across 25 entries):
  • ~5 NATURE INTERACTION — cradling a glowing seed / drinking from dewdrop / brushing companion-fur / picking pollen
  • ~5 COMPANION-INTERACTION — petting a sleeping bird / whispering to fox-cub / lifting a butterfly-wing / kissing a bee
  • ~3 INSPECTING — examining a fallen petal / studying a beetle-carapace / inspecting a leaf-edge
  • ~3 LISTENING / STILL — head tilted listening / motionless watching / pausing mid-step
  • ~3 RESTING — sleeping inside a flower-bell / curled on moss-tuft / leaning on mushroom-stem
  • ~3 MOVEMENT — mid-flight near a butterfly / mid-step across a leaf-bridge / drifting through the air
  • ~3 MAGIC-CASTING — releasing pollen-from-fingertips / cradling a will-o-wisp / fingertips trailing sparks

⚠️ COMPOSITION SPEC must be baked in per entry — choose ONE per entry:
  - extreme close-up macro perspective, fae fills 35-50% of frame, depth-of-field tight on her
  - macro shot at her scale, fae 30-45% of frame, dappled light catching her wings, atmospheric forest behind softly blurred
  - mid-shot showing fae + her perch, fae 30-40% of frame, surrounding micro-flora visible
  - low-angle macro looking up at the fae from forest-floor level, silhouette against canopy
  - three-quarter view of fae mid-flight or mid-perch, wings spread or folded
  - intimate close-up on the fae interacting with a tiny object, fae 35-55% of frame
  - side-profile macro shot, fae caught in a quiet moment, wings catching backlight
  - over-the-shoulder framing past a giant petal in foreground, the fae visible beyond

🚫 STRICT BANS:
  • NO posing for camera / NO eye-contact with viewer
  • NO sexualized framing
  • NO violence / NO scared / NO edgy moods
  • NO creature description (separate axis)
  • NO biome description (separate axis)`,
    touchpoints: [
      'Cradling a glowing magical-seed in her painted cupped palms, captured extreme close-up macro perspective, fae fills 40% of frame, painted depth-of-field tight on her, eyes lowered to the seed',
      'Drinking water from a single dewdrop with one painted finger dipped in, captured macro shot at her scale, fae 35% of frame, dappled light catching her wings, intimate register',
      'Brushing the soft fur of a sleeping fox-cub gently with painted reverent fingertips, captured intimate close-up on the fae interacting with the cub, fae 40% of frame, eyes lowered',
      'Picking a golden pollen-mote from a stamen with one painted hand, captured macro shot at her scale, fae 35% of frame, painted dappled light',
      'Whispering to a sleeping mouse with painted lips near its ear, captured intimate close-up on the fae interacting, fae 40% of frame, painted gentle register',
      'Petting a robin gently with one painted hand on its painted feathered breast, captured three-quarter view of fae mid-perch, wings folded, fae 30% of frame',
      'Lifting a butterfly-wing edge with one painted finger in painted reverence, captured macro shot at her scale, fae and butterfly equal-scale, painted intimate register',
      'Whispering to a fox-cub close to its painted ear, captured intimate close-up on her hand near its painted whisker, fae 40% of frame, painted gentle moment',
      'Examining a single fallen petal in her painted cupped palms, captured extreme close-up macro perspective, fae fills 45% of frame, head bowed in concentration',
      'Studying a beetle-carapace with painted reverent fingertips brushing its iridescent shell, captured intimate close-up, fae 40% of frame, painted gentle moment',
      'Inspecting a leaf-edge with one painted finger tracing its painted vein-pattern, captured macro shot at her scale, fae 35% of frame, painted dappled light',
      'Head tilted listening to a distant forest sound, captured side-profile macro shot, fae caught in a quiet moment, wings catching backlight, fae 35% of frame',
      'Motionless watching a passing dragonfly in the painted distance, captured three-quarter view of fae mid-perch, fae 30% of frame, painted candid register',
      'Pausing mid-step across a fern-frond bridge, captured low-angle macro looking up at the fae from forest-floor level, silhouette against canopy',
      'Sleeping curled inside a foxglove-bell with painted petals dwarfing her body, captured intimate close-up on the fae interacting with her bedroom, fae 45% of frame, head bowed in sleep',
      'Curled on a moss-tuft pillow with painted soft moss texture beneath, captured side-profile macro shot, fae 40% of frame, painted intimate resting register',
      'Leaning on a mushroom-stem with one painted shoulder forward, captured side-profile macro shot in painted stillness, fae 35% of frame, painted intimate moment',
      'Mid-flight beside a passing butterfly, captured three-quarter view of fae mid-flight, wings spread, painted soft motion, fae 30% of frame',
      'Mid-step across a leaf-bridge between two mossy boulders, captured low-angle macro looking up at her from forest-floor level, painted dappled light',
      'Drifting through the air between mushroom-caps in painted soft motion, captured three-quarter view, wings spread, fae 30% of frame, painted magical-motion register',
      'Releasing painted golden pollen from her painted fingertips into the air, captured extreme close-up macro, fae fills 40% of frame, painted gentle magical register',
      'Cradling a single will-o-wisp in her painted cupped palms, captured extreme close-up macro, fae fills 45% of frame, head bowed over the painted glowing-light, magical register',
      'Fingertips trailing painted sparkle-light, captured side-profile macro shot, fae 35% of frame, wings catching backlight, painted magical register',
      'Riding on the back of a stag-beetle with painted hands resting lightly on its carapace, captured three-quarter view of fae on the beetle, fae 30% of frame, painted journey register',
      'Over-the-shoulder framing past a giant painted petal in foreground, the fae visible beyond perched at her natural scale, painted depth showing her tiny size, fae 25% of frame',
    ],
    instructions: `Each entry is ONE specific candid action with composition spec baked in, 30-50 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific candid action, (b) composition spec, (c) fae % of frame, (d) face/posture detail. NO posing. NO eye-contact. NO violence/scared. NO creature description. NO biome description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_tiny_fae_magical_flavor: {
    format: 'simple',
    theme: `MAGICAL FLAVOR (supernatural accent at her scale) for FaeBot's tiny-fae path. Each entry describes ONE specific magical accent visible in the scene at fairy-scale. Each entry 15-35 words.

⚠️ THE BAR: each entry is a SPECIFIC magical detail painted as luminous painted register at her macro scale. Range from subtle (pollen-haze at her scale) to dramatic (will-o-wisp-cluster orbiting her).

⚠️ MAGIC CATEGORIES (across 25 entries):
  • ~6 POLLEN-TRAIL — drifting golden pollen-trail behind her wings / pollen-cloud / silver pollen-motes
  • ~5 FAIRY-DUST / SPARKLES — spiral of fairy-dust / glittering trail / sparkle-fingertips
  • ~4 FIREFLIES — firefly-orbiting-her-scale / cluster of fireflies / firefly-trail
  • ~3 GLOWING-SEED — cupped in her painted palm / hovering above her hand / orbiting her
  • ~3 GLOWING WINGS — luminous wing-edges / glowing wing-trail / sparkle-veining
  • ~2 WILL-O-WISP — single will-o-wisp / wisp orbit at her scale
  • ~2 MAGIC AURA — soft halo around her / glowing veins under skin

⚠️ EVERY entry MUST include:
  - SPECIFIC MAGIC TYPE
  - POSITION OR INTERACTION (orbiting her / cupped in her hand / behind her wings / etc.)
  - LIGHT QUALITY (luminous / glowing / sparkling)
  - HER SCALE implied (at her scale / behind her tiny wings / etc.)

🚫 STRICT BANS:
  • NO crude particle-effect language
  • NO modern-CGI references
  • NO creature description
  • NO violence`,
    touchpoints: [
      'Drifting golden pollen-trail behind her painted wings in soft warm-light motes, magical macro register',
      'Pollen-cloud drifting at her scale in painted golden-warm haze, painted magical register',
      'Silver pollen-motes drifting upward from her painted hand into the painted air, magical register',
      'Glowing painted pollen-trail trailing behind her like painted slow embers at her scale, magical motion register',
      'Soft pollen-light particles drifting through the painted depth around her at her scale, magical ambient register',
      'Golden painted pollen-ribbon trailing behind her through the air in painted slow motion, magical register',
      'Spiral of painted fairy-dust rising from her painted fingertips in soft sparkle-glow, magical register at her scale',
      'Glittering painted fairy-dust trail drifting from her painted hand into the surrounding air, magical register',
      'Painted sparkle-fingertips trailing painted-gold light as she moves, magical motion register',
      'Painted fairy-dust scattering around her painted form in painted soft glittering motes, magical register',
      'Glittering painted pollen-and-fairy-dust mix drifting around her in painted golden glow, magical register',
      'Cluster of painted fireflies orbiting her painted form in painted soft warm-yellow points at her scale, magical evening register',
      'Single painted firefly hovering near her painted cheek in painted soft warm-glow at her scale, magical intimate register',
      'Painted firefly-cluster trail drifting through the painted depth around her at her scale, magical fae register',
      'Painted firefly-orbit around her painted wings in painted soft warm-yellow points, magical register',
      'Two painted fireflies suspended near her painted shoulders in painted soft warm-glow, magical intimate register',
      'Glowing painted magical-seed cupped in her painted palms with painted pearl-light radiating, magical intimate register',
      'Painted glowing-seed hovering just above her painted open hand in painted soft warm-light, magical register',
      'Glowing painted seed orbiting around her painted form in painted soft pearl-light, magical register',
      'Luminous painted wing-edges with painted soft golden-warm light tracing every painted wing-vein, magical register',
      'Painted glowing wing-trail trailing behind her in painted soft sparkle-glow, magical motion register',
      'Painted sparkle-veining radiating soft painted golden-warm glow from her painted wings, magical register',
      'Single bright painted will-o-wisp hovering near her painted cupped palm in painted soft golden-warm glow, magical fae register at her scale',
      'Painted wisp orbiting her painted face in painted soft pearl-glow at her scale, magical intimate register',
      'Soft painted halo around her painted head in painted luminous golden-warm glow, magical sacred register',
    ],
    instructions: `Each entry is ONE specific MAGICAL FLAVOR accent, 15-35 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific magic type, (b) position or interaction, (c) light quality, (d) her scale implied. NO crude particle-effect. NO modern-CGI. NO creature description. NO violence. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_tiny_fae_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHOR (closest macro depth element) for FaeBot's tiny-fae path. Each entry describes ONE specific tactile foreground element at fairy-scale bringing true 3-tier depth. Each entry 20-40 words.

⚠️ THE BAR: each entry adds proper 3-tier macro composition depth — closest macro element + her in midground + atmospheric background. NEVER blocks her — frames her. At her scale these foreground elements are GIANT.

⚠️ FOREGROUND CATEGORIES (across 25 entries):
  • ~5 GIANT PETAL / LEAF EDGE — petal-edge sweeping foreground / curling leaf
  • ~4 DEWDROP CLUSTER — hanging dewdrops on leaf-edge / dewdrop-string on spider-silk
  • ~4 MOSS-TUFT / FERN-FROND — towering moss-tuft / hanging fern-frond / cluster of moss-spires
  • ~3 BLOOM-CLUSTER FOREGROUND — foxglove-bell at her foreground edge / bluebell-cluster
  • ~3 SPIDER-SILK THREAD — single hanging silk-thread / web-corner with dewdrop / silk-bridge
  • ~3 MUSHROOM EDGE — bracket-mushroom edge in foreground / toadstool-cap edge / glowing-mushroom-cluster
  • ~2 PINE-NEEDLE / TWIG CLUSTER — pine-needle-cluster / twig-cluster foreground
  • ~1 BUTTERFLY-WING / INSECT-PART — butterfly-wing-edge in foreground / dragonfly-wing-edge

⚠️ EVERY entry MUST include:
  - SPECIFIC TYPE
  - POSITION IN FRAME (foreground-left / lower-right / arching across / etc.)
  - TACTILE DETAIL at her scale

🚫 STRICT BANS:
  • NO creature description (fae or companion)
  • NO biome / setting (separate axis)
  • NO weather (separate axis)
  • NO modern objects
  • NO blocking the fae — element frames her, not obscures her`,
    touchpoints: [
      'Giant rose-petal sweeping across the foreground-left at her scale in painted pearl-pink crinkled-silk texture, painted soft tactile foreground',
      'Curling oak-leaf at foreground-right with painted vein-detail and painted curled-edge, painted close-up tactile foreground at her scale',
      'Cluster of hanging dewdrops on a leaf-edge in painted foreground with painted refractive-clarity glints, painted gallery-tier macro detail',
      'Hanging fern-frond cascading from the upper-left foreground in painted lacy green spiral-detail at her scale, painted tactile foreground',
      'Single magnolia-petal in painted foreground sweeping across the lower frame at her scale in painted cream-and-pink texture',
      'Cluster of dewdrops on spider-silk threads spanning the painted foreground in painted refractive-clarity glints, painted magical macro detail',
      'Towering moss-tuft in foreground-left with painted velvety green-moss texture at her scale, painted tactile foreground',
      'Hanging painted fern-frond cascading from the upper painted foreground with painted lacy detail, painted gallery-tier macro foreground',
      'Painted cluster of moss-spires in the lower painted foreground with painted velvety detail at her scale, painted tactile depth',
      'Foxglove-bell in painted foreground-right with painted pink-and-purple mottled-throat detail dominating the frame edge, painted macro detail',
      'Painted bluebell-cluster in painted foreground-left with painted soft-violet bell-shapes catching the light, painted macro detail at her scale',
      'Painted lily-of-the-valley cluster in painted foreground at her scale with painted delicate bell-shapes, painted tactile macro detail',
      'Single hanging spider-silk thread in painted foreground with painted iridescent sheen at her scale, painted delicate detail',
      'Web-corner in painted foreground with painted dewdrops clinging like pearls to the silk-strands at her scale, painted magical macro detail',
      'Silk-bridge spanning the painted foreground in painted iridescent sheen with painted dewdrops at intervals, painted gallery-tier macro detail',
      'Bracket-mushroom edge curving into the painted foreground-right with painted amber wood-and-spore texture, painted tactile detail at her scale',
      'Toadstool-cap edge sweeping across the painted foreground-left with painted red-spotted detail, painted close-up tactile foreground',
      'Glowing-mushroom-cluster in painted foreground-right with painted soft pearl-cyan inner-glow on the gills, magical macro register',
      'Pine-needle-cluster in painted foreground with painted soft-green needle-detail at her scale, painted tactile macro foreground',
      'Twig-cluster sweeping across the painted lower foreground with painted brown bark-detail at her scale, painted close-up tactile macro detail',
      'Painted unfurling fern-tendril in painted foreground-left with painted spiral-detail at her scale, painted gallery-tier macro foreground',
      'Cluster of painted spore-pods on a fern-back in painted foreground with painted close-up detail, painted tactile depth',
      'Butterfly-wing edge curving into the painted foreground-right with painted iridescent-pattern detail, painted partner-flight macro register',
      'Dragonfly-wing edge sweeping across the painted foreground with painted veined-iridescent detail at her scale, painted macro register',
      'Single painted hanging acorn in painted foreground with painted brown cap-scale detail at her scale, painted tactile macro foreground',
    ],
    instructions: `Each entry is ONE specific FOREGROUND ANCHOR at her scale, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific type, (b) position in frame, (c) tactile detail at her scale. NO creature. NO biome. NO weather. NO modern. NO blocking. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_tiny_fae_botanical_accent: {
    format: 'simple',
    theme: `40%-GATED BOTANICAL ACCENT (signature bloom species cluster at her scale) for FaeBot's tiny-fae path. Each entry describes ONE specific named-species bloom cluster painted at fairy-scale. Each entry 20-40 words.

⚠️ THE BAR: each entry is a SPECIFIC named bloom species painted with species-specific detail at her macro scale — chromatic pop. The bloom-cluster is at fairy-scale (a single foxglove-bell is HER doorway, a bluebell is HER bell).

⚠️ BLOOM SPECIES VARIETY (across 25 entries — varied flora):
  Spring: bluebells / foxgloves / wood-anemones / lily-of-the-valley / primrose / forget-me-nots / wisteria / wild-rose / dogwood
  Summer: honeysuckle / jasmine / wild-iris / columbine / harebells / clematis
  Autumn: asters / wild-chrysanthemum / autumn-crocus
  Year-round: moss-rose / wood-violets / glowing-fungus / luminous-mushroom-cluster

⚠️ EVERY entry MUST include:
  - SPECIFIC NAMED SPECIES (NEVER generic "wildflowers")
  - COLOR DETAIL
  - POSITION RELATIVE TO HER (at her feet / beside her / hanging overhead / etc.)
  - HER SCALE IMPLIED (a single bell is HER doorway / cluster taller than her / etc.)

🚫 STRICT BANS:
  • NO generic "flowers" / "wildflowers"
  • NO creature description
  • NO biome
  • NO lighting / weather`,
    touchpoints: [
      'Cluster of indigo-blue bluebells at her painted scale carpeting the moss-floor at her feet, painted soft pearl-violet bell-shapes each as tall as her shoulder',
      'Tall foxglove-spires blooming behind her in painted pink-and-purple bell-shaped clusters, each bell larger than her head, painted at her macro scale',
      'Painted wood-anemones scattered across the moss at her painted feet in painted white-petal clusters with golden centers, painted at her scale',
      'Painted lily-of-the-valley clusters at her feet with painted delicate white bell-shapes on painted slender green stems, painted at her scale',
      'Painted primrose cluster crowning the mossy ground beside her with painted pale-yellow petal-rosettes, painted at her scale',
      'Painted forget-me-nots scattered through the moss in painted soft-blue clusters with painted golden centers, painted at her scale',
      'Painted wisteria-cascade hanging in painted violet-clusters above her like painted natural cathedral, painted at her scale',
      'Painted wild-rose bramble blooming beside her shoulder in painted pink-and-cream cluster with painted thorny vines, painted at her scale',
      'Painted dogwood-blossom branch overhanging her with painted white-and-pink four-petal blooms, painted at her scale',
      'Painted honeysuckle-cluster trailing through painted depth behind her in painted yellow-and-cream trumpet-blooms each taller than her hand',
      'Painted jasmine-cluster nearby with painted white-star blooms scattered through painted green-leaves, painted at her scale',
      'Painted wild-iris cluster in painted purple-and-yellow blooms emerging from the painted moss at her scale',
      'Painted columbine-cluster blooming beside her in painted red-and-yellow nodding bell-shapes, painted at her scale',
      'Painted harebells nodding gently in painted blue clusters from a painted mossy rock at her scale, magical fae register',
      'Painted clematis-blossoms cascading through painted depth in painted soft pearl-purple star-shaped clusters, painted at her scale',
      'Painted wild-aster cluster blooming at her feet in painted violet-and-pink star-shaped blooms, painted at her scale',
      'Painted wild-chrysanthemum cluster in painted golden-yellow ruffled blooms at her scale, magical autumn register',
      'Painted autumn-crocus emerging from painted moss in painted delicate pale-violet cluster at her scale, magical seasonal register',
      'Painted moss-rose cluster blooming from painted painted ground in painted soft pearl-pink rosettes at her scale',
      'Painted wood-violets clustered through the painted moss at her feet in painted soft purple-and-yellow petal-clusters, painted at her scale',
      'Painted snowdrop cluster nodding at her painted feet in painted pale-white bell-shapes with green-tip detail, painted at her scale',
      'Painted star-of-bethlehem cluster scattered through painted moss in painted small white star-shaped blooms with green-stripe detail',
      'Painted glowing-fungus cluster emerging from painted moss in painted soft pearl-cyan glow-shapes, painted at her scale',
      'Painted luminous-mushroom cluster painted ringing her painted feet in painted soft pearl-glow shapes, magical fae register at her scale',
      'Painted small-toad-stool cluster painted at her feet in painted red-and-white spotted painted detail, painted at her scale',
    ],
    instructions: `Each entry is ONE specific BOTANICAL ACCENT cluster at her scale, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific named species, (b) color detail, (c) position relative to her, (d) her scale implied. NO generic "flowers". NO creature. NO biome. NO lighting/weather. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },


  // ─── dryad-portrait path (2026-05-21 axis-system migration, 10 axes) ───
  faebot_dryad_portrait_creature: {
    format: 'simple',
    theme: `DRYAD CREATURE (features-only, NO posture) for FaeBot's dryad-portrait path. Each entry is ONE unified description of a single adult-scale tree-bound mythic dryad — species + skin treatment + plant-merged hair + plant-garment + anatomical extras + magical signature. NO posture / action / expression (those are separate axes). Each entry 40-70 words.

⚠️ THE BAR: each dryad reads as a SINGLE coherent adult-scale mythic plant-merged feminine spirit. Mythic-creature beauty, NEVER human-model beauty. 5+ stacked exotic features per dryad. Painterly-real (Manchess + Giancola + Bonner + Froud lineage).

⚠️ EVERY ENTRY MUST include AT LEAST 5 of these stacked exotic feature categories (and OMIT posture/action — those are separate):
  - SPECIES LINEAGE — dryad / hamadryad / naiad / meliae / moss-maiden / Leshy-spirit / Forest Queen / sidhe / Tylwyth Teg / fox-spirit / swan-maiden / vine-nymph / hellebore-nymph / etc.
  - SKIN TREATMENT — translucent with constellations / bark-textured / moss-tinted olive / bioluminescent-freckled / mottled green-flecked / luminous porcelain / silver-bark patches / lichen-detail / pale-jade
  - PLANT-MERGED HAIR — living vines woven with blooms / river-water flowing / pale willow-fronds / wisteria-petals cascading / moss tendrils with asphodel / dark pine-needles crowned with antlers / silver-leaf cascade / autumn-leaf flowing / cherry-blossom braided
  - PLANT-MERGED GARMENT — petal-shawl / leaf-bodice woven of ferns / vine-skirt / silk-petal wrap / overlapping rose-petals / moss-skirt with woven ivy / cape of willow-leaves / draped garland of clematis / birch-bark tunic / overlapping calla-lily
  - ANATOMICAL EXTRAS — small antlers branching with leaves / luna-moth wings / dragonfly wings veined with sap / multiple delicate gills / third eye glowing / pointed feathered ears / vertical-slit pupils / branching deer-antlers / bird-spine / lichen patches on temples
  - MAGICAL SIGNATURE — glowing pearl-iris eyes / glowing vein-patterns under skin / soft halo of pollen-light / luminescent freckles / glowing-amber eyes / pale luminous-aura / fingertips trailing sparkles / softly glowing third eye

⚠️ SPECIES DISTRIBUTION (across 25 entries):
  • ~5 TREE-DRYADS (oak / birch / rowan / willow / ash / pine / cherry-blossom / yew / maple)
  • ~3 WATER-DRYADS (naiad / river-naiad / pond-nymph / waterfall-naiad)
  • ~3 NYMPHS (moonlight / vine / flower / forest)
  • ~3 ANIMAL-MERGED (fox-spirit / owl-fae / deer-spirit / swan-maiden / hare-spirit)
  • ~3 PIXIE / FAE-COURT (queen / sidhe / Tylwyth Teg)
  • ~2 LESHY / GREEN-MAN (forest-spirit elders, masculine register OK)
  • ~2 INSECT-FAE (glow-moth / dragonfly-fae / firefly-fae)
  • ~2 RARE / OTHERWORLDLY (Meliae / hamadryad / banshee-spirit / hellebore-nymph)
  • ~2 KODAMA / WOODLAND-SPRITE (smaller mythic beings still adult-scale)

🚫 STRICT BANS:
  • NO posture / action / expression (separate axes — creature is features ONLY)
  • NO human-model beauty / NO pin-up / NO sexualized framing
  • NO modern attire / NO contemporary references
  • NO scared / angry / edgy / dark moods
  • NO bare chest, NO nipples, NO topless`,
    touchpoints: [
      'A rowan-dryad with bark-textured shoulders fading to smooth moss-tinted skin, hair of living vines woven with tiny crimson rowan berries, draped garland of ivy across collarbone, small antlers branching with autumn leaves, softly glowing amber eyes radiating gentle light, lichen-detail on her temples',
      'A birch-hamadryad with mottled green-flecked skin like dappled forest light, waist-long hair of pale willow-fronds threaded with white moonflowers, thin wrap of pale silk-petal across her chest, a third eye glowing softly on her forehead, bioluminescent freckles tracing her collarbone',
      'A naiad with translucent skin showing faint glowing vein-patterns, hair of slowly-flowing river-water woven with silver water-lily petals, shoulder-strap of woven vine, delicate gills along her neck, luminous pearl-iris eyes, dewdrops crowning her hairline like jewels',
      'An ash-tree Meliae with lichen-detail on her cheekbones, fern-frond hair fanning behind her shoulders, cape of overlapping willow-leaves baring one shoulder, softly glowing vertical-slit pupils, tiny bioluminescent freckles tracing her collarbone, silver-bark patches on her wrists',
      'A moss-maiden with skin of deep moss-tinted gold-olive, hair of moss tendrils with white asphodel buds cascading past her waist, petal-shawl over a band of folded leaves, tall pointed ears feathered with down, softly glowing amber eyes, lichen-patches across her shoulders',
      'An oak-dryad with bark-textured shoulders fading to smooth moss-tinted skin, long hair of living vines woven with tiny yellow blossoms, leaf-petal bodice and moss-skirt of woven ferns, small antlers branching with fresh oak-leaves, glowing-amber eyes, bark-rune patterns down her arms',
      'A willow-dryad with silver-bark patches on her arms, hair of pale willow-fronds cascading past her waist, draped cape of overlapping willow-leaves, glowing-amber eyes, weeping-willow tendrils framing her face like a curtain, faint constellation-freckles on her cheekbones',
      'A cherry-blossom dryad with porcelain-pale skin showing the faintest pink undertones, hair of dark moss threaded with pink cherry-blossom branches, draped bodice of overlapping silk-petals, small antlers crowned with cherry-blossom buds, soft pearl-iris eyes',
      'A pine-dryad with bark-textured shoulders, hair of dark pine-needles woven with pine-cones, draped cape of pine-bough, weathered amber eyes, small antlers branching with fresh pine-sprouts, weathered hands resting at her sides, soft bioluminescent freckles',
      'A yew-dryad with mottled green-and-grey skin, waist-long hair of dark yew-needles threaded with crimson yew-berries, draped cape of yew-bough with weathered bark-textured shoulders, glowing-violet eyes, dark vine-runes inked along her collarbone',
      'A maple-dryad with smooth golden-amber skin, hair of cascading orange-and-red maple-leaves threaded with bronze-vine, draped autumn-leaf cape, small antlers branching with autumn-leaves, soft amber eyes, lichen-patches at her temples',
      'A river-naiad with translucent silver-blue skin, hair of slowly-flowing river-water woven with white lotus-petals, draped silk-petal shawl over a shoulder, delicate translucent gills along her neck, luminous pearl-iris eyes, dewdrop-pearls scattered across her shoulders',
      'A pond-nymph with translucent pale-jade skin, hair of cascading lily-leaves threaded with floating-bloom buds, draped petal-shawl of overlapping water-lily petals, delicate gills along her painted neck, soft glowing-blue eyes',
      'A waterfall-naiad with translucent skin showing tiny constellations beneath, hair of cascading silver-mist threaded with tiny water-droplets, draped silk-petal shawl woven with silver-thread, luminous pearl-iris eyes, soft mist-aura at her shoulders',
      'A moonlight nymph with bioluminescent freckles tracing her collarbone, hair of moss tendrils with white asphodel buds, shoulder-strap of woven vine and skirt of overlapping calla-lily petals, a third eye glowing softly on her forehead, soft pearl-skin aura',
      'A vine-nymph with lichen-detail on cheekbones, moss-tinted gold-olive skin, hair of living vines woven with tiny purple clematis blooms, draped garland of ivy across her torso with low vine-skirt, tall pointed ears feathered with down, glowing-amber eyes',
      'A flower-nymph with porcelain skin showing faint pink undertones, hair of cherry-blossom branches with white moonflowers woven through, draped bodice of overlapping rose-petals, small antlers crowned with foxglove-bells, soft pollen-light haloing her face',
      'A fox-spirit dryad with mottled green-flecked skin, hair of pale willow-fronds threaded with foxglove blooms, thin wrap of silk-petal across chest with vine-skirt, luminous amber eyes with vertical-slit pupils, three small fox-tails tipped in silver visible at her shoulder',
      'An owl-fae with mottled bark-textured skin, feathered hair of pale willow-fronds with single white moonflowers, owl-feather cape draped across shoulders, large pearl-iris eyes with horizontal-slit pupils, soft bioluminescent freckles on her temples',
      'A deer-spirit dryad with mottled green-flecked skin, hair of dark moss threaded with autumn-leaves, draped cape of overlapping willow-leaves, large branching deer-antlers crowning her head, soft fawn-marks dotting her shoulders, glowing amber eyes',
      'A swan-maiden with translucent skin showing tiny constellations, hair of pale willow-fronds woven with single white moonflowers, cape of overlapping willow-leaves draped across shoulders, delicate gills along her graceful neck, luminous pearl-iris eyes, soft white-feather aura',
      'A fae queen with skin like luminous pearl and subtle vine-pattern marks, floor-length hair of living vines woven with hundreds of tiny white flowers, flowing gown of woven petals at her shoulders, regal antler-crown woven with honeysuckle, soft glowing-violet eyes',
      'A Tylwyth Teg sidhe with cascading silver hair threaded with gold-leaf and dewdrop-pearls, layered robe of overlapping willow-leaves at her shoulders, porcelain skin with faint constellation freckles, delicate pointed ears, soft glowing-violet eyes',
      'A Leshy-spirit with bark-textured skin showing faint glowing vein-patterns, hair of dark pine-needles crowned with branching antlers sprouting tiny oak-leaves, loose tunic of birch-bark strips at his shoulders, eyes like deep forest amber, weathered face',
      'A hellebore-nymph with translucent pale-cream skin showing faint green undertones, hair of cascading nodding hellebore-blooms threaded with green leaves, draped petal-shawl of overlapping hellebore-blooms with green-leaf bodice, glowing-violet eyes, soft bioluminescent collarbone freckles',
    ],
    instructions: `Each entry is ONE unified mythic adult-scale dryad description (features ONLY), 40-70 words. Format: prose, comma-separated phrases. MANDATORY — 5+ stacked exotic features (species + skin + plant-merged hair + plant-garment + anatomical extras + magical signature). NO posture / action / expression. NO human-model beauty. NO modern attire. NO scared/edgy moods. NO bare chest. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_dryad_portrait_expression_moment: {
    format: 'simple',
    theme: `EXPRESSION MOMENT (face + eyes state) for FaeBot's dryad-portrait path. Each entry describes ONE specific face/eye intimate moment. Each entry 15-30 words.

⚠️ THE BAR: each entry is a SPECIFIC captured intimate facial moment — NEVER posing, NEVER eye-contact with viewer. Eyes lowered, closed, looking off-frame, or focused on something else in the scene. Soft contemplation, listening, blessing, communion.

⚠️ EXPRESSION CATEGORIES (across 25 entries):
  • ~5 EYES LOWERED / DOWNWARD GAZE — eyes lowered to her cupped palm / looking down at moss / gazing at a single bloom
  • ~4 EYES CLOSED — eyes closed in soft contemplation / cheek pressed to bark with eyes closed / eyes closed in blessing
  • ~3 SIDE PROFILE — face in soft profile / single eye visible in side-profile / cheek-and-jaw in profile
  • ~3 LOOKING OFF-FRAME — eyes following a drifting petal / watching a distant creature / gaze off into deep forest
  • ~3 LIPS PARTED LISTENING — lips slightly parted as she listens / face tilted listening / mouth softly open in wonder
  • ~3 SOFT EMOTION — tears catching light at lash-line / soft smile / wonder / contentment / quiet sorrow
  • ~2 CHEEK-PRESSED — cheek pressed against ancient bark / cheek on a flower / cheek nuzzled against tree
  • ~2 HEAD-BOWED — head bowed in reverence / blessing / quiet awe

🚫 STRICT BANS:
  • NO eye-contact with viewer / NO direct gaze at camera
  • NO posed expression / NO model-poses
  • NO violence / NO scared / NO edgy moods
  • NO creature description (separate axis)
  • NO gesture / hand language (separate axis)`,
    touchpoints: [
      'Eyes lowered to her cupped palms, soft glowing-amber gaze fixed downward in quiet contemplation, lashes painted long over her cheek',
      'Eyes closed in soft contemplation, lips slightly parted, painted serene expression with faint pollen-light at her temples',
      'Side profile, single luminous pearl-iris eye visible in painted candid stillness, lashes long against cheek',
      'Looking off-frame to follow a drifting petal, soft glowing-violet eyes fixed on something just outside the painted frame',
      'Lips slightly parted as she listens, face tilted in soft attention, painted intimate hush register',
      'Tears catching the painted light at her lash-line, soft glowing-amber eyes lowered in quiet sorrow-and-beauty',
      'Cheek pressed against ancient bark with eyes half-closed, painted serene communion expression',
      'Head bowed in painted reverence, soft glowing pearl-iris eyes lowered, hair veiling her face partially',
      'Eyes closed in painted blessing-pose, faint smile at her lips, soft pollen-light at her temples',
      'Side profile, eyes lowered, painted gentle contemplation, hair falling forward across one cheek',
      'Eyes lowered watching her own fingertips, painted intimate moment of self-attention, soft glowing eyes',
      'Three-quarter profile gazing softly at a single drifting firefly, painted candid moment of attention',
      'Eyes closed with cheek nuzzled against a glowing-bloom near her face, painted blissful contemplation',
      'Lips softly open in wonder at something off-frame, painted gentle awe register, eyes glowing softly',
      'Head bowed deeply in blessing, painted serene expression, faint pollen-light dusting her face',
      'Side profile with eyes following an invisible breeze, painted candid moment, lashes long',
      'Soft painted smile at her lips, eyes lowered to a small bloom she cradles near her face, gentle joy',
      'Cheek pressed gently against a moss-clad tree-trunk, eyes closed in painted intimate communion register',
      'Looking down at her own shoulder where a small creature has perched, painted candid attention',
      'Painted quiet sorrow expression — eyes lowered, single tear at lash, soft warm-light catching the tear-glint',
      'Lips slightly parted in painted whispered-blessing-pose, eyes closed, hand softly raised near her face',
      'Painted face turned away from viewer in three-quarter rear angle, just a slice of cheek and ear visible',
      'Eyes following a drifting will-o-wisp off-frame, painted gentle attentive expression',
      'Painted serene contentment expression with eyes closed and a soft sigh at her lips, faint magical aura',
      'Head tilted in painted listening-pose, eyes half-closed, lips softly closed, intimate hush register',
    ],
    instructions: `Each entry is ONE specific EXPRESSION MOMENT, 15-30 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific face/eye state, (b) NEVER eye-contact with viewer, (c) intimate candid register. NO creature description. NO gesture/hand. NO posing. NO edgy moods. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_dryad_portrait_gesture_pose: {
    format: 'simple',
    theme: `GESTURE / POSE (hand + shoulder posture) for FaeBot's dryad-portrait path. Each entry describes ONE specific hand or shoulder posture. Each entry 15-30 words.

⚠️ THE BAR: each entry is a SPECIFIC captured intimate gesture — hands at her cheek, cupping magic, brushing hair, pressed to chest, etc. Never tense, never posed, always candid intimate stillness.

⚠️ GESTURE CATEGORIES (across 25 entries):
  • ~5 HANDS CUPPED — cupping a glowing seed / cupping a tiny bloom / cupping pollen-light / cupping a dewdrop
  • ~4 HANDS AT FACE — fingertips at her cheek / hand brushing hair back / palm pressed to her own jaw / fingertips at her lips
  • ~3 HANDS AT CHEST — hands clasped at chest / one palm pressed to heart / arms crossed softly over chest
  • ~3 ONE SHOULDER FORWARD — three-quarter turn with one shoulder forward / shoulder-roll in candid stillness
  • ~3 HANDS RESTING — arms loose at her sides / one hand lifted slightly / hands resting on a branch
  • ~3 INTERACTION — fingertips brushing bark / palm pressed to tree-trunk / hand reaching toward a falling petal
  • ~2 BLESSING — one palm raised gently in blessing / two hands lifted in offering
  • ~2 GENTLE STILLNESS — both hands clasped softly / hands folded in her lap / hands at her sides relaxed

🚫 STRICT BANS:
  • NO posed gesture / NO model-pose
  • NO tense / aggressive hand language
  • NO eye-contact-with-viewer-via-gesture (no waving)
  • NO creature description (separate axis)
  • NO expression / face state (separate axis)`,
    touchpoints: [
      'Both hands cupped at chest level cradling a softly glowing seed, fingers curled gently around the painted light',
      'One hand lifted to her face fingertips brushing hair back from her painted cheek',
      'Both hands clasped softly at her chest in painted gentle gesture of contemplation',
      'Three-quarter turn with one shoulder forward, painted hair cascading over the back of her painted shoulder',
      'Arms loose at her painted sides in candid stillness, one painted hand slightly lifted',
      'Fingertips brushing ancient bark in painted reverent contact, palm flat against the painted tree-trunk',
      'One palm raised gently at her painted shoulder in blessing-gesture, fingers curled softly',
      'Both painted hands folded softly in her painted lap, candid stillness',
      'One painted hand lifted to softly touch a hanging vine near her face',
      'Painted both hands cupped near her face cradling a tiny bloom, painted intimate close gesture',
      'One painted palm pressed to her own heart, the other resting at her painted hip',
      'Two painted hands lifted in offering toward a painted will-o-wisp at chest level',
      'Painted fingertips at her own lips in soft thoughtful gesture, candid stillness',
      'One painted shoulder bare and forward, the other draped with falling hair, painted intimate three-quarter',
      'Painted both hands clasped softly together at chest, fingers interlaced in candid gentle stillness',
      'Painted one hand lifted to a flower-crown adornment in her hair, gentle gesture',
      'Painted hand reaching toward a falling petal that hovers just at her painted shoulder',
      'Painted palm pressed gently against a moss-clad tree-trunk beside her, painted communion gesture',
      'Painted both hands cradling a glowing pollen-cloud at chest level, fingers curled around the painted light',
      'Painted one hand lifted with palm-up at painted shoulder height holding a glowing-magic spark',
      'Painted arms crossed softly at her chest, painted hands resting on opposite painted shoulders',
      'Painted fingertips at the corner of her painted jaw in soft self-touch, candid intimate gesture',
      'Painted both hands gathered together in her painted lap holding a single fallen leaf',
      'Painted one shoulder rolled forward, painted hand lifted to brush a strand of vine-hair from her cheek',
      'Painted both painted hands held cupped to release a single butterfly drifting upward from her painted palms',
    ],
    instructions: `Each entry is ONE specific GESTURE/POSE, 15-30 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific hand or shoulder posture, (b) candid intimate stillness, (c) never tense. NO creature description. NO expression. NO posed. NO aggressive. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_dryad_portrait_composition: {
    format: 'simple',
    theme: `PORTRAIT COMPOSITION (tight framing spec) for FaeBot's dryad-portrait path. Each entry describes ONE specific tight-portrait framing. Each entry 20-40 words.

⚠️ THE BAR: each entry is a SPECIFIC tight-portrait framing — head/shoulders/bust scale only. NEVER full-body, NEVER wide-shot, NEVER landscape-with-figure. Face/shoulders fill 50-80% of the frame.

⚠️ COMPOSITION CATEGORIES (across 25 entries):
  • ~5 TIGHT CLOSE-UP — face fills 35-50% of frame, head and shoulders only
  • ~5 BUST FRAMING — chest-up framing, head + shoulders + collarbone fill 60-80% of frame
  • ~4 3/4 PROFILE — face turned in 3/4 profile, eyes/lashes/cheek-detail readable
  • ~3 SIDE PROFILE — full side profile, single eye visible, hair-vine detail
  • ~3 OVER-SHOULDER — viewer behind her, profile of cheek + ear-tip + flower-crown visible
  • ~2 EXTREME CLOSE-UP — face fills 50-60% of frame, eyelashes / lichen-cheek readable
  • ~2 INTIMATE-HANDS — head + shoulders + cupped hands fill 70% of frame, hands close to face
  • ~1 RARE — half-turned-back angle / chin-up bust / cross-collarbone

⚠️ EVERY entry MUST include:
  - FRAMING SPEC (face fills X% / bust framing / head and shoulders)
  - POSE ORIENTATION (3/4 profile / side profile / over-shoulder / front-3-quarter)
  - WHAT'S VISIBLE (eyelashes / collarbone / flower-crown / cheek-detail / etc.)

🚫 STRICT BANS:
  • NO full-body / NO wide-shot / NO landscape-with-figure
  • NO eye-contact-with-viewer framing
  • NO creature description (separate axis)
  • NO expression / pose detail (separate axes)`,
    touchpoints: [
      'Tight close-up portrait, head and shoulders only, face fills 40% of frame, head turned in candid 3/4 profile',
      'Bust framing chest-up, dryad off-center via rule-of-thirds, head + shoulders + collarbone fill 70% of frame, hair cascading',
      'Close portrait, face in soft profile, single eye visible, hair-vines and flower-crown clearly readable, head fills 45% of frame',
      'Three-quarter close portrait, dryad half-turned away — back of one shoulder + side of face visible — face turned toward something off-frame',
      'Intimate close-up, hands in foreground cupping a glowing magic element, dryad face above looking down at it, head + shoulders + cupped hands fill 70% of frame',
      'Tight side-profile bust portrait, dryad in stillness, soft backlight rimming her silhouette, head + neck + shoulder fill 65% of frame',
      'Extreme close-up of face turned in 3/4 profile, eyelashes / lichen-cheek-detail / vine-hair-strands all readable, face fills 55% of frame',
      'Over-the-shoulder portrait, viewer behind her, profile of her cheek + jaw + ear-tip + flower-crown visible, hair flowing forward',
      'Bust framing centered, face turned in soft profile, painted hair cascading past her shoulder, head + shoulders + chest fill 75% of frame',
      'Tight head-and-shoulders close-up, face in 3/4 profile, eyes lowered, painted lashes long across cheek, face fills 40% of frame',
      'Close portrait with shoulder-roll three-quarter angle, painted collarbone-detail and flower-crown both readable, face fills 38% of frame',
      'Bust framing centered with face in soft profile turned away from viewer, painted hair cascading behind her, head + shoulders fill 70% of frame',
      'Intimate close-up with one painted hand at her face, fingertips at temple, painted cupped-hand and face-detail both readable',
      'Tight side-profile portrait, painted face turned fully sideways, painted antler-crown silhouette against the backdrop',
      'Three-quarter front-of-shoulder portrait, painted face turned slightly toward camera but eyes off-frame, head + shoulders fill 65% of frame',
      'Painted half-turned-back angle, painted shoulder-blade visible on far side, painted face profile turned away',
      'Close portrait with painted soft backlight rimming her silhouette, painted face in 3/4 profile, painted hair-detail clearly readable',
      'Tight head-and-collarbone close-up, painted face turned down to her painted cupped hands, head + collarbone fill 60% of frame',
      'Bust framing with painted chin-up tilt, painted face turned slightly upward looking off-frame, painted neck and collarbone detail',
      'Cross-collarbone angle close-up, painted dryad with painted arm crossed over her chest, painted face in 3/4 profile',
      'Painted three-quarter rear angle, painted ear-tip and painted cheek visible, painted hair flowing forward, painted shoulder-blade in foreground',
      'Painted intimate close-up with painted face filling 50% of frame, painted bioluminescent freckles and painted lichen-detail clearly readable',
      'Painted bust framing with painted face turned in soft profile away from viewer, painted antlers extending up past the top of the frame',
      'Painted side-profile portrait with painted single eye visible in candid stillness, painted hair veiling far side of face',
      'Painted close-up with painted face partially veiled by a fall of painted hair-vines, painted intimate hidden-but-revealed register',
    ],
    instructions: `Each entry is ONE specific PORTRAIT COMPOSITION, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) framing spec, (b) pose orientation, (c) what's visible. NO full-body. NO eye-contact-with-viewer. NO creature description. NO expression/pose detail. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_dryad_portrait_adornment: {
    format: 'simple',
    theme: `ADORNMENT (woven into hair / face / shoulders) for FaeBot's dryad-portrait path. Each entry describes ONE specific natural adornment painted with species-specific detail. Each entry 15-30 words.

⚠️ THE BAR: each entry is a SPECIFIC natural adornment — flower-crown, berry-cluster, leaf-veil, dewdrops on temple, lichen-pattern, antler-decor. Painted with species-specific detail at painted gallery-tier register.

⚠️ ADORNMENT CATEGORIES (across 25 entries):
  • ~5 FLOWER CROWN — bluebell crown / foxglove crown / wild-rose crown / wisteria crown / dogwood crown
  • ~4 BERRY CLUSTER — rowan berries woven in hair / blackthorn berry / red-currant cluster
  • ~3 LEAF VEIL — autumn-leaf veil / fern-frond veil / cascading-vine veil
  • ~3 DEWDROP / GLINT — dewdrops crowning hair like jewels / dewdrops at lash / pearl-shimmer at temple
  • ~3 LICHEN / MOSS PATCH — silver-lichen patch on cheekbone / moss-tuft at temple
  • ~2 ANTLER DECOR — antler-tips wrapped with leaves / flowers blooming from antler-base
  • ~2 BUTTERFLY / FIREFLY — butterfly perched on her painted antler-tip / firefly at her shoulder
  • ~2 PETAL / FLORAL CASCADE — cascading petal-veil / drifting petal-crown
  • ~1 RARE / UNIQUE — single moonflower at her temple / glowing-rune at her brow

🚫 STRICT BANS:
  • NO modern jewelry / NO metal jewelry / NO contemporary accessories
  • NO creature description (separate axis)
  • NO expression / gesture (separate axes)
  • NO oversized cartoon decor`,
    touchpoints: [
      'Painted bluebell crown woven through her hair in soft pearl-violet bell-shapes, painted intimate adornment register',
      'Painted foxglove crown of pink-and-purple bell-shaped clusters circling her painted brow, painted gallery-tier register',
      'Painted wild-rose crown with painted pink-and-cream blooms threaded through her painted hair, painted soft register',
      'Painted wisteria-cluster crown of cascading violet racemes draping past her painted ears, painted ethereal adornment',
      'Painted dogwood-blossom crown with painted white-and-pink four-petal blooms woven across her painted brow',
      'Painted rowan-berries woven through her painted hair in painted crimson-and-gold clusters, painted autumn register',
      'Painted blackthorn-berry cluster threaded through her painted hair in painted deep-purple-and-black detail, painted gallery-tier',
      'Painted red-currant cluster at her painted temple in painted small bright-red beads, painted natural-adornment register',
      'Painted autumn-leaf veil cascading from her painted hair in painted red-orange-gold layered leaves, painted seasonal register',
      'Painted fern-frond veil cascading at her painted shoulder in painted lacy green-leaf-detail, painted ethereal adornment',
      'Painted cascading-vine veil with painted small white-blooms threaded down past her painted ear, painted gentle adornment',
      'Painted dewdrops crowning her painted hairline like painted jewels in painted refractive-clarity glints, painted gallery-tier adornment',
      'Painted dewdrop-pearls scattered across her painted shoulders in painted glistening detail, painted shimmer register',
      'Painted pearl-shimmer at her painted temple where painted skin meets painted hair, painted soft glowing detail',
      'Painted silver-lichen patch on her painted cheekbone in painted soft pale-grey-green detail, painted intimate texture',
      'Painted moss-tuft at her painted temple woven through her painted hair, painted velvety green texture',
      'Painted lichen-rune pattern inked along her painted jaw in painted soft silver-grey, painted ancient-tree register',
      'Painted antler-tips wrapped with painted ivy-and-blooms in painted natural decoration register',
      'Painted small flowers blooming directly from her painted antler-base in painted soft pearl-violet clusters',
      'Painted small monarch butterfly perched on her painted antler-tip, painted intimate companion-adornment',
      'Painted firefly hovering at her painted shoulder in painted soft warm-yellow glow, painted intimate magical detail',
      'Painted cascading petal-veil of painted pink-cherry-blossom petals drifting from her painted hair down past her painted shoulder',
      'Painted drifting petal-crown of painted soft pearl-white petals haloing her painted head, painted ethereal register',
      'Painted single moonflower at her painted temple in painted luminous white-and-pearl detail, painted soft glow',
      'Painted glowing-rune at her painted brow in painted soft cyan light, painted ancient-magical adornment register',
    ],
    instructions: `Each entry is ONE specific ADORNMENT, 15-30 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific natural adornment type, (b) species-specific or texture detail, (c) position (in hair / on shoulder / at temple / etc.). NO modern jewelry. NO creature description. NO expression/gesture. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_dryad_portrait_forest_backdrop: {
    format: 'simple',
    theme: `FOREST BACKDROP (soft-focus behind her) for FaeBot's dryad-portrait path. Each entry describes ONE specific enchanted-forest setting painted softly out-of-focus behind her. Each entry 25-45 words.

⚠️ THE BAR: each backdrop is an enchanted-forest setting painted SOFTLY behind her at portrait depth-of-field — never competing with her presence. Tactile foreground / midground holds her / background fades into soft painted mist. Atmospheric haze sells the depth.

⚠️ BACKDROP CATEGORIES (across 25 entries):
  • ~4 ANCIENT OAK GROVE — softly-blurred oak trunks and dappled god-rays behind her
  • ~3 FERN GROTTO — soft fern-fronds blurred at midground depth
  • ~3 BIRCH GLADE — pale birch trunks softly out-of-focus behind her
  • ~3 WILLOW THICKET — cascading willow-branches blurred behind her
  • ~3 WISTERIA-CASCADE — violet wisteria draping softly out-of-focus
  • ~3 SAKURA GROVE — pink-blossom canopy softly behind her
  • ~2 AUTUMN-BLAZE — autumn-leaf canopy softly behind
  • ~2 MOSS-CANYON — moss-cliff walls softly blurred at depth
  • ~2 BIOLUMINESCENT GLEN — softly-glowing fungi or moss behind her at depth

⚠️ EVERY entry MUST include:
  - SPECIFIC FOREST TYPE
  - SOFTLY OUT-OF-FOCUS / atmospheric haze cue
  - MULTI-TIER DEPTH (foreground tactile / midground her / background fading)

🚫 STRICT BANS:
  • NO open meadow / NO landscape-with-figure
  • NO creature description (separate axis)
  • NO lighting / weather (separate axes)
  • NO competing focal element behind her`,
    touchpoints: [
      'Ancient oak grove softly out-of-focus behind her in painted warm-amber and emerald tones, painted dappled god-rays piercing the canopy, painted atmospheric haze sells the depth',
      'Soft fern-grotto behind her with painted lacy fern-fronds blurred at midground depth, painted moss-tones receding into atmospheric pearl-mist',
      'Birch-glade behind her with painted pale slender birch-trunks softly out-of-focus, painted dappled light filtering through pale-bark silhouettes',
      'Willow-thicket behind her with painted cascading weeping-willow branches blurred at depth, painted soft-green and silver receding into pearl-mist',
      'Wisteria-cascade behind her with painted violet-purple racemes draping softly out-of-focus, painted dappled twilight filtering through',
      'Sakura-grove behind her with painted pink-blossom canopy softly out-of-focus, painted drifting petals through dappled light',
      'Autumn-blaze maple grove behind her with painted brilliant orange-red-gold canopy softly out-of-focus, painted dappled warm light',
      'Moss-canyon behind her with painted moss-covered cliff walls softly out-of-focus at depth, painted vertical green-tones receding',
      'Bioluminescent glen behind her with painted softly-glowing moss and mushroom-clusters out-of-focus at depth, painted magical pearl-cyan ambient',
      'Ancient oak sun-cathedral behind her with painted massive twisted gnarled trunks softly out-of-focus, painted dappled god-rays piercing canopy',
      'Hidden fern-grotto behind her with painted moss-covered boulders and giant fern-fronds blurred at depth, painted atmospheric haze',
      'Pale-bark birch-glade behind her with painted scattered moss-floor and tiny mushroom-rings softly out-of-focus, painted dappled light',
      'Willow-thicket along stream behind her with painted weeping-willow branches creating natural curtains softly out-of-focus, painted reflective light',
      'Wisteria-cascade woodland behind her with painted ancient oak trunks supporting violet wisteria draping softly out-of-focus, painted twilight register',
      'Sakura-grove forest behind her with painted pink cherry-blossom canopy and ancient lichen-rich trunks softly out-of-focus, painted ethereal register',
      'Autumn-blaze oak grove behind her with painted russet-and-gold canopy softly out-of-focus, painted dappled warm-amber light',
      'Moss-canyon enchanted glen behind her with painted moss-cliff walls softly out-of-focus, painted hanging-vine-blooms cascading from above',
      'Bioluminescent fairy-circle behind her with painted glowing mushroom-cluster ringing a mossy hollow softly out-of-focus, painted magical pearl-glow',
      'Redwood cathedral behind her with painted massive ridged ancient trunks rising into a soaring canopy softly out-of-focus, painted cinnamon-red ambient',
      'Cherry-blossom grove behind her with painted pink-blossom canopy and ancient trunks softly out-of-focus, painted ethereal pearl-pink mist',
      'Yew-grove behind her with painted twisted dark-green yew-trees softly out-of-focus at depth, painted deep blue-green mystery',
      'Hemlock cathedral behind her with painted towering ancient hemlock trees and hanging-moss curtains softly out-of-focus, painted deep emerald shadow',
      'Magnolia grove behind her with painted large white magnolia-blossoms suspended like lanterns softly out-of-focus, painted ethereal spring register',
      'Fern-and-vine grove behind her with painted unfurling fern-fronds and cascading-vine-blooms softly out-of-focus, painted dappled register',
      'Painted hidden moss-and-mushroom grove behind her with painted ancient mossy stumps and clustered mushrooms softly out-of-focus, painted enchanted register',
    ],
    instructions: `Each entry is ONE specific FOREST BACKDROP, 25-45 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific forest type, (b) softly out-of-focus / atmospheric haze cue, (c) multi-tier depth implied. NO open meadow. NO creature description. NO lighting/weather. NO competing focal element. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_dryad_portrait_lighting: {
    format: 'simple',
    theme: `CLOSE-PORTRAIT LIGHTING for FaeBot's dryad-portrait path. Each entry describes ONE specific lighting register tuned for tight portraits. Each entry 25-45 words.

⚠️ THE BAR: each lighting entry is tuned for INTIMATE PORTRAIT register — rim-light silhouetting her, dappled light through canopy onto her face, soft-warm side-light gilding her features, moonlit silver on her hair. Light catches HER, not the landscape.

⚠️ LIGHTING CATEGORIES (across 25 entries):
  • ~6 GOLDEN-HOUR — warm-amber sidelight gilding her face / golden backlight haloing her hair
  • ~4 DAPPLED — dappled canopy-light through forest hitting her face / dappled god-rays
  • ~4 RIM-LIGHT — soft backlight rimming her silhouette / glowing wing-edges
  • ~3 BLUE-HOUR / TWILIGHT — cool-blue twilight with warm-yellow accent on her face
  • ~3 MOONLIT — silver moonlight on her hair / blue-moon ambient on her shoulders
  • ~3 BIOLUMINESCENT — soft pollen-glow at her temples / firefly-light on her cheek
  • ~2 DAWN — soft-pink dawn light gilding her features

⚠️ EVERY entry MUST include:
  - SPECIFIC TIME-OF-DAY
  - SPECIFIC LIGHT QUALITY (rim / dappled / sidelight / underlight)
  - HOW IT CATCHES HER (gilding her hair / haloing her silhouette / catching her cheekbone / rim-lighting her wings)
  - PALETTE CUE

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome description (separate axis)
  • NO weather (separate axis)
  • NO storm / lightning / dark-grey-blue (peaceful enchanted register only)`,
    touchpoints: [
      'Golden-hour warm-amber sidelight raking across her painted face from a low angle, painted long shadows defining her cheekbones, warm-gold and cool-blue contrast',
      'Late-afternoon golden backlight haloing her painted hair from behind, painted warm rim-light tracing the silhouette of every painted strand',
      'Magic-hour golden light gilding her painted face with warm-amber-and-gold palette, painted-storybook softness',
      'Golden-hour through canopy creating painted dappled warm-light patterns across her painted shoulders and face',
      'Late-afternoon warm light filtering through painted overlapping leaves creating painted golden-pink dappled patterns on her painted face',
      'Golden warm sidelight from a low angle creating painted long shadows, painted warm halo-glow around her painted hair',
      'Dappled canopy-light through forest hitting her painted cheekbone in painted soft warm-amber spots, painted intimate close-portrait register',
      'Dappled god-rays piercing the canopy in painted shafts of warm-amber light reaching her painted shoulder, painted gallery-tier portrait light',
      'Soft dappled gold patches catching her painted face in painted warm-amber spots, painted intimate forest light at her scale',
      'Painted dappled green-gold canopy-light filtering through painted leaves onto her painted face, painted ethereal portrait register',
      'Soft backlight rimming her painted silhouette in painted warm-gold edge-light, painted intimate close-up rim-light register',
      'Painted glowing wing-edges with painted soft golden-warm light tracing the silhouette of her painted wings, painted magical rim-light',
      'Painted soft backlight rimming her painted hair in painted halo-glow, painted intimate close-portrait register',
      'Painted rim-light from below silhouetting her painted face in painted warm-glow against a darker painted backdrop',
      'Painted cool-blue twilight with painted warm-yellow accent from a nearby will-o-wisp illuminating her painted face from below',
      'Painted blue-hour twilight with painted last warm-orange of sunset bleeding through painted distant trunks, painted soft warm catching her painted cheekbone',
      'Painted magical violet-twilight glow saturating the scene in painted soft lavender-and-blue, painted faint pollen-light at her painted temple',
      'Painted silver moonlight catching her painted hair in painted cool-blue-and-silver edge-light, painted hushed magical register',
      'Painted blue-moon ambient flooding the scene with painted cool silver-blue painted light, painted soft white-glow on her painted shoulders',
      'Painted moonlit silver-and-violet ambient with painted distant moon visible through the canopy gap, painted deep-blue saturating her painted hair',
      'Painted soft pollen-glow at her painted temples in painted warm-gold soft-light, painted bioluminescent register',
      'Painted firefly-light on her painted cheek in painted soft warm-yellow glow, painted intimate magical register',
      'Painted bioluminescent ambient with painted softly-glowing fungi behind her casting painted soft pearl-cyan light on her painted shoulder',
      'Painted soft-pink dawn light gilding her painted face with painted rose-gold-and-lavender palette, painted gentle peaceful register',
      'Painted golden dawn beams angling through the canopy from a low east angle catching her painted face in painted warm-gold side-light',
    ],
    instructions: `Each entry is ONE specific LIGHTING moment, 25-45 words. Format: prose, comma-separated phrases. MANDATORY — (a) time-of-day, (b) light quality, (c) how it catches her, (d) palette cue. NO creature. NO biome. NO weather. NO storm/lightning. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_dryad_portrait_weather: {
    format: 'simple',
    theme: `WEATHER (air condition + drifting accents) for FaeBot's dryad-portrait path. Each entry describes ONE specific atmospheric air condition tuned for close-portrait. Each entry 20-40 words.

⚠️ THE BAR: each weather entry establishes a SPECIFIC air condition with drifting accents that adds painted-storybook depth NEAR HER FACE / SHOULDERS — drifting petals past her cheek, dew on her shoulders, pollen-shimmer at her temple, gentle mist in her hair. Weather is intimate at portrait scale.

⚠️ WEATHER CATEGORIES (across 25 entries):
  • ~5 PETAL-DRIFT — drifting petals past her face / petal cascade by her shoulder
  • ~4 MIST / FOG — soft mist drifting through her hair / mist softening backdrop
  • ~4 DEW-GLINTS — dewdrops on her shoulders / dew on her hair-strands
  • ~3 POLLEN-HAZE — drifting golden pollen-motes near her temples / pollen shimmer at her shoulders
  • ~3 GENTLE-BREEZE — gentle breeze moving her hair / soft wind in her vine-strands
  • ~3 DRIFTING-LEAVES — autumn-leaves drifting past her shoulder / single falling leaf
  • ~2 CLEAR / STILL — clear painted-still air with crisp portrait visibility
  • ~1 SNOW-DUST — winter petal-snow / first-frost on her shoulder

⚠️ EVERY entry MUST include:
  - SPECIFIC AIR CONDITION
  - DRIFTING ACCENT (at portrait scale: petals past her face / dew on shoulder / pollen at temple)
  - PALETTE / TEMPERATURE CUE

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome description (separate axis)
  • NO lighting (separate axis)
  • NO catastrophic weather
  • NO storm / lightning`,
    touchpoints: [
      'Drifting cherry-blossom petals past her painted face in painted soft pink-snow, gentle motion captured in painted portrait register',
      'Painted falling petal-snow drifting past her painted shoulder in painted pearl-pink drift, magical painted spring register',
      'Painted wisteria petals drifting in painted violet-clusters past her painted ear from overhead, painted soft pearl-violet palette',
      'Painted drifting rose-petals past her painted cheek in painted soft crimson-and-cream cascade, magical painted register',
      'Painted drifting magnolia-petals in painted large pearl-cream petals past her painted shoulder, painted gallery-tier register',
      'Painted soft dawn mist drifting through her painted hair in painted pearl-grey wisps, painted depth softening backdrop, painted fresh painted-morning hush',
      'Painted low pearl-mist drifting past her painted shoulder, painted depth softening her painted silhouette, painted ethereal register',
      'Painted soft forest-mist drifting through painted depth around her painted face in painted soft cool-grey wisps, painted gallery-tier register',
      'Painted soft drifting mist threading through her painted vine-hair-strands in painted whisps, painted atmospheric depth, magical hushed register',
      'Painted glistening dewdrops on her painted shoulders in painted reflective droplet detail, painted fresh-morning register',
      'Painted pearl-dew droplets on her painted hair-strands catching the painted light in painted pearl-glints, painted fresh-morning crystal register',
      'Painted dew-soaked painted shoulders and painted hair with painted shimmering droplets, painted fresh peaceful register',
      'Painted shimmering dew at her painted lash-line and painted collarbone in painted pearl-glints, painted gallery-tier intimate detail',
      'Painted drifting golden pollen-motes near her painted temples in painted soft warm-light specks, painted magical register',
      'Painted floating pollen-clouds drifting past her painted shoulder in painted soft warm-glow, painted magical register',
      'Painted pollen-shimmer at her painted shoulders in painted golden-warm motes, painted magical register',
      'Painted gentle breeze moving her painted hair in painted soft synchronized motion, painted magical painted-life register',
      'Painted petals stirring on a painted gentle breeze drifting past her painted face in painted soft-motion drift, painted magical register',
      'Painted soft wind in her painted vine-strands moving softly across her painted shoulder, painted magical alive register',
      'Painted autumn-leaves drifting past her painted shoulder in painted red-orange-gold flakes, painted seasonal register',
      'Painted single falling autumn-leaf past her painted cheek in painted gentle painted-motion, painted seasonal register',
      'Painted settled autumn-leaf carpet stirring softly visible behind her painted shoulder, painted soft seasonal register',
      'Painted clear painted-still air with crisp painted visibility into the painted forest depth behind her, painted gallery-tier intimate clarity',
      'Painted motionless painted forest hush with painted crystalline clear air, every painted detail of her painted face sharp, painted intimate stillness register',
      'Painted first-frost dusting her painted shoulders in painted soft pearl-white, painted gentle winter-petal-snow drifting past her painted face',
    ],
    instructions: `Each entry is ONE specific WEATHER condition, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) air condition, (b) drifting accent at portrait scale, (c) palette/temperature cue. NO creature. NO biome. NO lighting. NO catastrophic weather. NO storm/lightning. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_dryad_portrait_magical_flavor: {
    format: 'simple',
    theme: `MAGICAL FLAVOR (visible magic at her face / shoulders) for FaeBot's dryad-portrait path. Each entry describes ONE specific magical signature painted near her face or shoulders. Each entry 15-30 words.

⚠️ THE BAR: each magical entry is a SPECIFIC luminous detail painted near her face / shoulders at intimate portrait scale — glowing veins under skin / pollen-shimmer at her temples / fireflies near her cheek / soft halo. Magic intimately close to her, never crude particle-effect.

⚠️ MAGIC CATEGORIES (across 25 entries):
  • ~6 GLOWING VEINS — glowing-blue veins under skin / amber veins on her wrists
  • ~5 POLLEN / SHIMMER — pollen-shimmer at her temples / golden pollen-halo / silver pollen-motes
  • ~4 FIREFLY / WISP — fireflies near her cheek / single will-o-wisp at her shoulder
  • ~3 SOFT HALO — soft golden halo around her head / gentle pearl-aura
  • ~3 GLOWING EYES — softly glowing amber eyes / pearl-iris glow / luminous-pupil light
  • ~2 FINGERTIP-SPARKS — fairy-dust trailing from her fingertips / sparkle at her hands
  • ~2 INNER GLOW — soft inner light radiating from her skin / luminescent freckles glowing

⚠️ EVERY entry MUST include:
  - SPECIFIC MAGIC TYPE
  - POSITION (at her temple / on her cheek / under her skin / around her head / etc.)
  - LIGHT QUALITY (luminous / glowing / sparkling / soft)

🚫 STRICT BANS:
  • NO crude particle-effect language
  • NO modern-CGI references
  • NO creature description (separate axis)
  • NO violence`,
    touchpoints: [
      'Painted glowing-blue veins visible under her painted skin pulsing faintly with painted magical light',
      'Painted amber veins on her painted wrists glowing softly in painted gentle warm-light, painted magical register',
      'Painted glowing vein-patterns traced down her painted collarbone in painted soft cyan light, painted intimate magical register',
      'Painted soft inner-glow radiating from her painted skin in painted warm-golden ambient, painted gentle magical register',
      'Painted luminous freckles tracing her painted collarbone in painted pearl-glow points, painted intimate detail',
      'Painted glowing rune-patterns visible at her painted temple in painted soft cyan ambient, painted ancient-magical register',
      'Painted golden pollen-shimmer at her painted temples in painted soft warm-light haze, painted intimate magical register',
      'Painted golden pollen-halo around her painted head in painted soft warm-gold ring, painted sacred register',
      'Painted silver pollen-motes drifting around her painted face in painted soft pearl-light specks',
      'Painted soft pollen-light around her painted shoulders in painted warm-gold ambient, painted gentle register',
      'Painted drifting pollen-motes painted glowing at her painted brow in painted golden-warm light',
      'Painted cluster of painted fireflies near her painted cheek in painted soft warm-yellow points, painted magical register',
      'Painted single firefly hovering near her painted painted ear in painted soft warm-glow, painted intimate register',
      'Painted firefly-cluster orbiting her painted face in painted soft warm-yellow points, painted evening register',
      'Painted single will-o-wisp at her painted shoulder in painted soft pearl-glow, painted intimate magical register',
      'Painted soft golden halo around her painted head in painted luminous warm-light, painted sacred register',
      'Painted gentle pearl-aura surrounding her painted form in painted soft warm-glow, painted magical ambient register',
      'Painted faint magical aura around her painted painted silhouette in painted soft white-light, painted gentle register',
      'Painted softly glowing amber eyes radiating painted gentle warm-light, painted magical register',
      'Painted pearl-iris glow in her painted lowered eyes, painted soft luminous register',
      'Painted luminous-pupil light at her painted eyes in painted gentle pearl-glow, painted intimate magical register',
      'Painted fairy-dust trailing from her painted fingertips in painted soft golden sparkle, painted magical register',
      'Painted sparkle at her painted hands in painted golden-warm light, painted gentle magical-cast register',
      'Painted bioluminescent freckles glowing on her painted shoulders in painted soft pearl-glow points',
      'Painted soft luminous-aura at her painted hands in painted gentle warm-glow, painted magical register',
    ],
    instructions: `Each entry is ONE specific MAGICAL FLAVOR accent, 15-30 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific magic type, (b) position near her face/shoulders, (c) light quality. NO crude particle-effect. NO modern-CGI. NO creature description. NO violence. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_dryad_portrait_foreground_anchor: {
    format: 'simple',
    theme: `40%-GATED FOREGROUND ANCHOR (closest depth element bringing 3-tier portrait depth) for FaeBot's dryad-portrait path. Each entry describes ONE specific tactile foreground element close to the camera. Each entry 20-40 words.

⚠️ THE BAR: each entry is a SPECIFIC tactile element close to the camera (NOT blocking her face) that brings 3-tier portrait depth — hanging vine, fern-frond, drifting petal-cluster softly out-of-focus near the camera, framing her without obscuring her.

⚠️ FOREGROUND CATEGORIES (across 25 entries):
  • ~5 HANGING VINE / WILLOW — hanging-vine curtain in foreground corner / weeping willow
  • ~4 FERN FRONDS — fern-frond arching in foreground / fern-tip near camera
  • ~3 DRIFTING PETALS — drifting petal-cluster in foreground / cascade of petals close to camera
  • ~3 HANGING MOSS / LICHEN — hanging moss-curtain / lichen-cluster
  • ~3 BLOOM CLUSTER — foxglove-bell at foreground corner / cherry-blossom branch / wisteria
  • ~3 BUTTERFLY / FIREFLY — butterfly-wing-edge / firefly-cluster
  • ~2 DEWDROP / WATER — dewdrop-cluster on leaf / pearl-droplet
  • ~2 BRANCH / TWIG — mossy branch tip / twig-cluster

⚠️ EVERY entry MUST include:
  - SPECIFIC TYPE
  - POSITION IN FRAME (foreground-left / lower-right / arching across / etc.)
  - TACTILE DETAIL (softly out-of-focus)

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome / setting (separate axis)
  • NO weather (separate axis)
  • NO modern objects
  • NO blocking her face`,
    touchpoints: [
      'Hanging vine-curtain in painted foreground-left with painted bloom-laden tendrils softly out-of-focus cascading from above, painted intimate framing',
      'Weeping willow branches draping softly out-of-focus in painted foreground-right with painted delicate willow-leaves, framing her face without blocking',
      'Hanging ivy-vines threading across the painted upper-left foreground softly out-of-focus, painted leaf-veining detail',
      'Bloom-laden hanging vine-cluster in painted foreground-right with painted foxglove-bells softly out-of-focus, painted gentle framing',
      'Wisteria-cascade hanging in painted foreground-left with painted violet petals softly out-of-focus, painted spring framing',
      'Tall fern-cluster arching across the painted bottom of the frame softly out-of-focus with painted lacy fronds, painted tactile foreground detail',
      'Painted fern-fronds in painted foreground-left softly out-of-focus with painted leaf-veining, painted soft cool-green palette',
      'Painted unfurling fern-fronds in painted foreground-right with painted spiral-detail softly out-of-focus, painted ethereal register',
      'Painted tall fern-grass cluster across the painted lower painted depth softly out-of-focus with painted delicate leaf-edge detail',
      'Painted drifting cherry-blossom petal-cluster filling the painted foreground softly out-of-focus in painted pink-snow, painted soft motion captured',
      'Painted autumn-leaf drift in painted foreground softly out-of-focus with painted red-orange-gold leaves cascading',
      'Painted drifting petal-cluster across the painted foreground softly out-of-focus in painted pearl-pink, painted magical register',
      'Painted hanging moss-curtain in painted foreground-left softly out-of-focus with painted velvety green strands, painted intimate framing',
      'Painted lichen-cluster in painted foreground-right softly out-of-focus with painted pale-grey-green texture, painted close-up tactile detail',
      'Painted hanging moss-cascade in painted foreground softly out-of-focus from upper-left, painted dripping spanish-moss register',
      'Painted foxglove-bell at painted foreground corner softly out-of-focus with painted pink-and-purple mottled-throat detail, painted intimate framing',
      'Painted cherry-blossom branch at painted foreground-left softly out-of-focus with painted pink petals, painted intimate framing',
      'Painted wisteria-cluster at painted foreground-right softly out-of-focus with painted violet racemes, painted ethereal framing',
      'Painted butterfly-wing edge at painted foreground-right softly out-of-focus with painted iridescent-pattern detail, painted intimate framing',
      'Painted firefly-cluster in painted foreground softly out-of-focus with painted soft warm-yellow points, painted magical evening register',
      'Painted dragonfly-wing edge sweeping across the painted foreground softly out-of-focus with painted veined-iridescent detail',
      'Painted dewdrop-cluster on a painted leaf in painted foreground softly out-of-focus with painted refractive-clarity glints',
      'Painted pearl-droplet on a painted petal-edge in painted foreground softly out-of-focus, painted gallery-tier intimate detail',
      'Painted mossy branch tip in painted foreground softly out-of-focus with painted velvety green-moss texture, painted intimate framing',
      'Painted twig-cluster in painted foreground softly out-of-focus with painted brown bark-detail, painted gallery-tier intimate framing',
    ],
    instructions: `Each entry is ONE specific FOREGROUND ANCHOR, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific type, (b) position in frame, (c) softly out-of-focus tactile detail. NO creature. NO biome. NO weather. NO modern. NO blocking her face. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },


  // ─── fairy-court path (2026-05-21 axis-system migration, 10 axes) ───
  faebot_fairy_court_subject: {
    format: 'simple',
    theme: `COURT SUBJECT (queen + optional attendants) for FaeBot's fairy-court path. Each entry describes ONE specific composition of the fae court — either a SOLITARY REGAL QUEEN or a SMALL COURT of 2-5 figures with the queen at center. Each entry 50-90 words. The queen has 5+ stacked exotic regal features.

⚠️ THE BAR: each entry reads as a single COURT composition. Solo queen OR small group (1-5 figures). 5+ stacked exotic features on the queen (species + skin + plant-merged hair + regal gown + crown/diadem + magical signature). NEVER posing for camera. NEVER eye-contact.

⚠️ COURT-SIZE DISTRIBUTION (across 25 entries):
  • ~12 SOLO QUEEN — alone on her throne / standing alone in sacred circle / walking through grove
  • ~6 QUEEN + 1 ATTENDANT — lady-in-waiting holding her train / 1 attendant kneeling at her feet
  • ~5 QUEEN + 2-3 ATTENDANTS — processional / small court arrangement
  • ~2 QUEEN + 4 ATTENDANTS — fuller small court (max 5 total figures)

⚠️ EVERY ENTRY MUST include AT LEAST 5 stacked exotic features on the queen:
  - SPECIES LINEAGE — fae queen / sidhe / Tylwyth Teg / forest queen / dryad-queen / hamadryad-queen / oak-queen / autumn-queen / moon-queen
  - SKIN TREATMENT — luminous pearl / porcelain-pale with bioluminescent freckles / translucent constellation-glow / moss-tinted gold-olive / silver-bark patches
  - PLANT-MERGED HAIR — living vines woven with hundreds of tiny flowers / cascading silver hair threaded with gold-leaf / dark moss with violet wisteria / silver birch-bark strands with autumn leaves
  - REGAL GOWN — flowing gown of woven petals with long trailing leaf-train / layered robe of overlapping willow-leaves / ceremonial robes of woven oak-leaves with embroidered vine-cord / regal cloak of fern-fronds / floor-length gown of moss and dew-spider-silk
  - CROWN/DIADEM (one) — living antler-crown sprouting tiny leaves / diadem of woven vines with a single luminous stone / gold-leaf circlet of branching laurel / coronet of tiny living butterflies / ivy-and-moss diadem
  - ANATOMICAL EXTRAS — tall sapphire-veined antlers / pointed ears / luminescent freckles / glowing third eye / regal stature
  - MAGICAL SIGNATURE — soft amber halo / glowing-pearl skin / pollen-glow at her shoulders / will-o-wisp orbit / butterflies orbiting her crown

⚠️ ATTENDANT DETAIL (when present):
  - Attendants are also fae — slender, otherworldly, ceremonial register
  - "Lady-in-waiting holding her train" / "2 attendants fanning behind her" / "1 sidhe kneeling at her feet" / "3 attendants in slow procession"
  - Attendants are SMALLER than the queen in visual weight / less elaborate adornment

🚫 STRICT BANS:
  • NO castle / built architecture (separate axis handles setting)
  • NO eye-contact-with-viewer
  • NO posing-for-camera / NO model-poses
  • NO sexualized framing
  • NO bare chest, NO nipples, NO topless
  • NO violence / NO weapons / NO threatening register
  • NO crowds beyond 5 total figures`,
    touchpoints: [
      'A fae queen seated upon a moss-throne grown into ancient oak roots, skin like luminous pearl with subtle vine-pattern marks, floor-length hair of living vines woven with hundreds of tiny white flowers, flowing gown of woven petals with a long trailing leaf-train, living antler-crown sprouting tiny leaves, soft amber halo at her shoulders, gaze cast gently downward',
      'Three Tylwyth Teg sidhe in slow procession through a moonlit wisteria-archway, the queen at center with cascading silver hair threaded with gold-leaf and dewdrop-pearls, layered robe of overlapping willow-leaves with vine-belted waist and floor-length skirt, diadem of woven vines with a single luminous stone, two attendants flanking',
      'The fae queen standing alone in a sacred-stone-circle at twilight, porcelain-pale skin with bioluminescent freckles tracing her collarbone, elaborate braided hair of dark moss with violet wisteria flowing past her waist, regal cloak of fern-fronds over a leaf-bodice and floor-sweeping skirt, ivy-and-moss diadem',
      'A queen on her moss-throne extending one luminous hand outward, translucent skin with constellation-glow beneath, long pearl-white hair with a coronet of tiny living butterflies, ceremonial robes of woven oak-leaves with embroidered vine-cord, tall sapphire-veined antlers, eyes lowered in gentle blessing',
      'A fae queen walking slowly through her court in a fern-grotto, a lady-in-waiting holding the train of her gown, moss-tinted gold-olive skin, floor-length hair of silver birch-bark strands woven with autumn leaves, long elegant gown of moss and dew-spider-silk, gold-leaf circlet of branching laurel',
      'A solo autumn-queen seated upon a moss-and-root throne, smooth golden-amber skin, hair of cascading orange-and-red maple-leaves threaded with bronze-vine, regal autumn-leaf cloak over a leaf-bodice and floor-length skirt, branching antlers crowned with autumn-leaves, soft amber halo',
      'A moon-queen standing alone in a moonlit clearing, translucent silver-blue skin with constellation-freckles, waist-long silver hair threaded with white moonflowers, flowing gown of moonlit silk-petal with a silver-vine train, diadem of woven moonflowers with a single pearl, gentle pearl-glow',
      'Four sidhe in a small court — queen at center with two ladies-in-waiting behind and one sidhe kneeling at her feet, queen has cascading dark-moss hair with violet wisteria, regal cloak of fern-fronds, antler-crown woven with honeysuckle, eyes lowered in ceremonial blessing',
      'A solo oak-queen on an ancient moss-and-root throne, bark-textured shoulders fading to smooth moss-tinted skin, floor-length hair of living vines woven with tiny yellow blossoms, ceremonial leaf-petal gown with a long trailing fern-train, living antler-crown branching with fresh oak-leaves',
      'A solo dryad-queen standing in a sacred clearing with hands lifted in blessing, porcelain-pale skin with constellation freckles, waist-long hair of pale willow-fronds threaded with white moonflowers, layered robe of overlapping willow-leaves with vine-belted waist, third eye glowing softly on her forehead',
      'A queen seated cross-legged on a moss-cushion before her court, two ladies-in-waiting standing behind her in ceremonial robes, queen with luminous pearl skin and hair of dark moss with violet wisteria, regal cloak of fern-fronds, antler-crown woven with honeysuckle',
      'A solo hamadryad-queen on her throne grown into ancient yew-roots, mottled silver-and-green skin, dark yew-needle hair threaded with crimson yew-berries, ceremonial robes of yew-bough with woven-vine belt, dark-vine diadem with a single luminous stone',
      'Three sidhe walking in slow procession through an oak-cathedral grove, queen at center holding a glowing-orb in her painted cupped palms, two attendants flanking, queen with cascading silver hair and a coronet of butterflies, layered robe of willow-leaves',
      'A solo flower-queen standing alone in a meadow-clearing within the forest, porcelain skin with faint pink undertones, waist-long hair of cherry-blossom branches with white moonflowers, draped bodice of overlapping rose-petals over a floor-length petal-skirt, antler-crown crowned with foxglove-bells',
      'A queen seated on her moss-throne with one painted hand raised in painted blessing-gesture, luminous skin radiating soft warm light, painted antler-crown of branching deer-antlers wrapped with painted ivy, painted regal robe of layered painted oak-leaves, painted soft amber halo',
      'A solo fae-queen walking through a wisteria-cascade arbor alone, porcelain-glowing skin, painted waist-long silver hair threaded with painted gold-leaf, painted layered painted robe of painted willow-leaves with painted floor-length train, painted diadem of painted woven-vine',
      'A queen with one attendant kneeling at her painted feet offering a painted floating-orb of painted magical-light, queen with painted moss-tinted gold-olive skin and painted floor-length hair of painted silver birch-bark, painted regal robe of painted leaf-and-fern',
      'A solo Tylwyth Teg queen standing painted alone at the center of a painted sacred-stone-circle at painted twilight, painted porcelain skin with painted constellation-freckles, painted braided painted dark-moss hair, painted ceremonial robe of painted woven-petal',
      'Four sidhe in a small painted court — painted queen at center painted seated, painted three attendants painted standing behind her in painted ceremonial half-circle, painted queen with painted floor-length hair of painted living-vines',
      'A solo autumn-court queen with her painted leaf-cloak trailing behind her painted form, painted golden-amber skin, painted hair of painted cascading autumn-leaves, painted regal painted leaf-cloak over a painted floor-length painted leaf-gown, painted antler-crown of painted autumn-leaves',
      'A queen on her painted throne with painted two attendants behind her each painted holding a single painted glowing-orb, painted queen with painted luminous pearl-skin and painted floor-length painted dark-moss hair, painted regal painted petal-gown',
      'A solo winter-queen painted standing alone in a painted snow-clearing within the painted forest, painted translucent pearl-skin, painted waist-long painted silver-frost hair, painted regal painted icicle-petal cloak, painted diadem of painted frosted-leaves',
      'A solo painted spring-queen painted standing alone in a painted blossoming clearing, painted porcelain-pink-glowing skin, painted hair of painted cherry-blossom branches, painted regal painted petal-cloak over a painted floor-length painted blossom-gown, painted antler-crown of painted cherry-blossom buds',
      'A painted summer-court queen on her painted moss-throne with painted three attendants painted standing behind her in painted ceremonial half-circle, painted queen with painted golden-bronze skin and painted floor-length painted golden-leaf hair, painted regal painted sunflower-petal gown',
      'A solo painted moonlit-court queen painted walking slowly through a painted moonlit grove painted alone, painted silver-blue painted skin, painted waist-long painted silver-moon hair, painted regal painted moonflower-petal cloak, painted diadem of painted moonflowers',
    ],
    instructions: `Each entry is ONE unified COURT SUBJECT description, 50-90 words. Format: prose, comma-separated phrases. MANDATORY — (a) court size (solo / queen+1 / queen+2-3 / queen+4 attendants), (b) 5+ stacked exotic features on queen (species + skin + plant-hair + gown + crown + magical signature), (c) attendant arrangement if present. NO castle / built architecture. NO eye-contact. NO posing. NO sexualized. NO bare chest. NO violence. NO crowds beyond 5. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_fairy_court_ceremonial_moment: {
    format: 'simple',
    theme: `CEREMONIAL MOMENT for FaeBot's fairy-court path. Each entry describes ONE specific solemn / ceremonial moment captured in the painted court scene. Each entry 20-40 words.

⚠️ THE BAR: each entry is a SPECIFIC ceremonial / dignified moment — blessing, procession, extending hand, receiving offering, silent watching. NEVER tense, NEVER violent, NEVER posing.

⚠️ MOMENT CATEGORIES (across 25 entries):
  • ~5 BLESSING — palms raised in blessing / hands lifted in benediction / casting a sacred-spell
  • ~4 PROCESSION — walking in slow procession / passing through arch / following a path
  • ~4 EXTENDING HAND — extending hand toward sacred animal / offering an open palm / reaching for a floating orb
  • ~3 RECEIVING — accepting an offering from a kneeling attendant / receiving a flower / accepting a glowing-orb
  • ~3 SILENT WATCHING — gazing into a sacred pool / watching a distant point / contemplating the grove
  • ~3 SEATED CEREMONY — seated on throne in audience / consulting with attendant / holding court
  • ~3 STANDING STILL — standing alone in stone-circle / motionless watching / quiet vigil
  • ~1 RARE — kneeling herself in painted reverence / offering blessing to the grove

🚫 STRICT BANS:
  • NO posed-for-camera moments
  • NO eye-contact with viewer
  • NO violence / weapons / aggression
  • NO creature description (separate axis)`,
    touchpoints: [
      'Palms raised in gentle blessing over a small offering of moss and wildflowers at her painted feet, eyes lowered in painted serene focus',
      'Hands lifted in benediction-gesture toward a painted glowing-light at chest level, painted soft-amber halo at her shoulders',
      'Casting a sacred-spell with painted fingertips trailing painted pollen-light, painted eyes half-closed in concentration',
      'Walking in slow painted procession through her painted court, painted gown trailing behind, painted soft step',
      'Passing through a painted wisteria-arch with painted attendants flanking, painted ceremonial register, painted slow gait',
      'Following a painted moss-path through a painted ancient grove with painted slow ceremonial step, painted hands resting at her painted sides',
      'Painted three figures in painted slow procession through a painted moonlit clearing, painted dignified register, painted equal step',
      'Extending one painted hand toward a painted small white-stag knelt before her painted throne, painted gentle gesture of painted recognition',
      'Offering an painted open painted palm toward a painted floating-orb at painted chest level, painted soft amber halo at her painted shoulders',
      'Reaching for a painted will-o-wisp painted floating before her painted face, painted gentle painted curiosity register',
      'Painted accepting a painted offering of painted flowers from a painted kneeling attendant, painted gentle painted reception register',
      'Painted receiving a painted single glowing-bloom from a painted attendant in painted ceremonial moment',
      'Painted accepting a painted glowing-orb-of-magic from a painted kneeling sidhe, painted painted reverent painted moment',
      'Painted gazing painted into a painted sacred pool at her painted feet with painted eyes half-closed in painted contemplation',
      'Painted watching a painted distant painted point through painted the painted canopy, painted serene painted silent vigil',
      'Painted contemplating the painted painted ancient grove around her with painted lowered painted gaze, painted quiet painted reverence',
      'Painted seated on her painted moss-throne in painted painted audience, painted hands painted resting on the painted throne-arms, painted ceremonial painted register',
      'Painted consulting painted gently with a painted kneeling attendant at her painted side, painted gentle painted gesture of painted hand near painted attendant',
      'Painted holding court painted with painted three painted attendants in painted half-circle painted before her painted throne, painted ceremonial register',
      'Painted standing alone painted in a painted sacred painted stone-circle, painted hands painted clasped softly painted before her, painted dignified painted register',
      'Painted motionless painted watching painted from the painted edge of a painted clearing, painted ceremonial painted vigil register',
      'Painted quiet painted vigil with painted eyes painted closed, painted hands painted at her painted sides, painted serene painted register',
      'Painted kneeling painted herself in painted reverence at the painted base of an painted ancient tree, painted offering painted painted blessing register',
      'Painted offering painted blessing to the painted grove itself with painted painted hands painted raised upward, painted serene painted register',
      'Painted painted both painted hands cupped painted at painted chest painted cradling a painted glowing-painted orb of painted magic, painted serene painted moment',
    ],
    instructions: `Each entry is ONE specific CEREMONIAL MOMENT, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific solemn/ceremonial action, (b) NEVER eye-contact, (c) dignified register. NO posing. NO violence. NO creature description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_fairy_court_composition: {
    format: 'simple',
    theme: `COURT COMPOSITION (3/4 to full-body framing) for FaeBot's fairy-court path. Each entry describes ONE specific framing spec for the court. Each entry 20-40 words.

⚠️ THE BAR: each entry is a SPECIFIC composition spec — 3/4-body / full-figure / wide-medium-with-attendants / mid-shot with attendant. Court occupies 40-65% of frame at body-scale. NEVER tight close-up. NEVER tiny-scale.

⚠️ COMPOSITION CATEGORIES (across 25 entries):
  • ~6 THREE-QUARTER BODY — 3/4 body framing of queen on throne or standing
  • ~5 FULL-FIGURE — full-body standing queen / processional
  • ~4 PROCESSIONAL — wide-medium framing of queen + attendants walking
  • ~3 QUEEN + KNEELING ATTENDANT — queen with one figure kneeling in foreground
  • ~3 LOW-ANGLE LOOKING UP — slight low-angle at throne / standing queen
  • ~2 OVER-SHOULDER — viewer behind attendant, queen visible across the frame
  • ~2 SACRED-CIRCLE WIDE — queen alone in stone-circle with full-figure framing

⚠️ EVERY entry MUST include:
  - FRAMING SPEC (3/4-body / full-figure / wide-medium / etc.)
  - COURT OCCUPATION PERCENTAGE (40-65% of frame)
  - POSE ORIENTATION

🚫 STRICT BANS:
  • NO tight close-up / portrait scale
  • NO tiny-fairy scale
  • NO landscape-with-figure (figure must dominate)
  • NO creature description (separate axis)`,
    touchpoints: [
      'Three-quarter-body framing of the queen on her moss-throne, queen fills 50% of frame, ancient grove framing the throne',
      'Full-figure shot of the queen standing in a sacred-stone-circle at twilight, queen fills 55% of frame, ancient stones around her',
      'Wide-medium framing of a small processional (queen + 2 attendants) walking through a wisteria-archway, group fills 55% of frame',
      'Medium shot of queen seated, one attendant kneeling at her feet, queen fills 50% of frame, the kneeling figure smaller in foreground',
      'Three-quarter shot from a slight low-angle (looking up at the throne), queen fills 60% of frame, antler-crown framing the canopy',
      'Mid-shot of queen extending a hand toward a sacred animal knelt or perched before her, both fill 60% of frame together',
      'Wide processional shot, queen at center with 2-4 fae fanning around her, all turned in the same direction, group fills 55% of frame',
      'Full-body portrait of a solo regal fae walking slowly through her grove, body fills 55% of frame, hair and gown trailing behind',
      'Three-quarter-body framing of solo queen on throne, hands resting on throne-arms, body fills 50% of frame, painted ceremonial register',
      'Full-figure shot of queen alone in a fern-grotto, body fills 55% of frame, painted moss-floor at her painted feet',
      'Wide-medium framing of queen + 1 lady-in-waiting (holding train), group fills 55% of frame, painted processional register',
      'Three-quarter-body of queen seated with attendant kneeling beside her painted offering a glowing-orb, both fill 60% of frame',
      'Full-figure of solo queen painted standing alone in a sacred clearing, body fills 50% of frame, painted dignified register',
      'Wide processional shot with painted queen + 3 attendants walking in painted slow line, all fill 55% of frame',
      'Mid-shot of painted queen seated with one painted attendant standing painted behind her, both fill 55% of frame',
      'Slight low-angle full-figure of painted queen, painted antler-crown reaching into the painted canopy, body fills 60% of frame',
      'Painted three-quarter-body framing of painted queen extending painted painted hand toward a painted floating-orb at painted chest level, painted body fills 50% of frame',
      'Painted full-figure of painted queen at painted center of painted sacred-stone-circle, painted body fills 55% of frame, painted stones around her',
      'Painted wide-medium framing of painted queen + painted 4 attendants in painted half-circle, painted group fills 55% of frame',
      'Painted mid-shot of painted queen + painted 2 attendants painted seated together painted on painted moss-clearing, painted group fills 55% of frame',
      'Painted over-shoulder framing from painted behind a painted attendant, painted queen visible across the painted frame, painted attendant in painted foreground',
      'Painted over-shoulder painted framing painted past a painted kneeling sidhe, painted queen painted visible on her painted throne, painted attendant in painted foreground',
      'Painted slight painted low-angle painted three-quarter-body of painted queen on her painted moss-throne, painted body fills 60% of frame, painted antlers reaching into painted canopy',
      'Painted full-figure painted of painted solo painted queen painted standing alone in a painted painted moonlit painted clearing, painted body fills 55% of frame',
      'Painted wide-medium painted framing of painted queen + painted 3 painted attendants painted in painted procession painted through painted oak-cathedral, painted group fills 55% of frame',
    ],
    instructions: `Each entry is ONE specific COURT COMPOSITION, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) framing spec, (b) court occupation %, (c) pose orientation. NO tight close-up. NO tiny-scale. NO landscape-with-figure. NO creature description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_fairy_court_regalia: {
    format: 'simple',
    theme: `REGALIA (crown / accessory / held object) for FaeBot's fairy-court path. Each entry describes ONE specific regal accessory or held object. Each entry 15-30 words.

⚠️ THE BAR: each entry is a SPECIFIC mythic regalia — natural materials, never metal-cast jewelry, never modern accessories. Antler-crowns / woven-vine diadems / gold-leaf circlets / orb-of-light / staff / cup. Painted with mythic detail.

⚠️ REGALIA CATEGORIES (across 25 entries):
  • ~6 CROWNS — antler-crown / woven-vine diadem / circlet / coronet
  • ~5 STAVES / WANDS — gnarled-wood staff / vine-wound wand / branch-staff
  • ~4 HELD ORBS — orb-of-light cradled in palms / single floating-orb at chest
  • ~3 CUP / CHALICE — painted-leaf chalice / dewdrop-cup / moss-bowl
  • ~3 SACRED OBJECT — single blooming staff / glowing-seed cradled / fern-frond
  • ~2 SIGNATURE PENDANT — single pearl pendant / moonstone at her throat / glowing-amber pendant
  • ~2 TRAIN / CAPE detail — cape clasp of leaf-and-vine / floor-length leaf-train

⚠️ EVERY entry MUST include:
  - SPECIFIC REGALIA TYPE (crown / staff / orb / etc.)
  - MATERIAL (natural — moss / vine / leaf / wood / pearl / dewdrop / glowing-light)
  - POSITION (on her head / held in hands / at her throat / etc.)

🚫 STRICT BANS:
  • NO metal jewelry / NO modern jewelry / NO gemstone-set crowns
  • NO weapons / NO violence
  • NO creature description (separate axis)
  • NO oversized cartoon detail`,
    touchpoints: [
      'Painted living antler-crown sprouting tiny fresh oak-leaves and tiny blooms, painted natural mythic regalia detail',
      'Painted diadem of woven dark-vines with a single luminous pearl-stone at the brow, painted mythic regal detail',
      'Painted gold-leaf circlet of branching laurel-leaves crowning her painted hair, painted ceremonial register',
      'Painted coronet of tiny living butterflies orbiting her painted brow, painted magical mythic register',
      'Painted antler-crown of branching deer-antlers wrapped with painted ivy and painted small white-blooms, painted natural regalia',
      'Painted woven-flower-crown of foxgloves and bluebells circling her painted head, painted spring-court register',
      'Painted gnarled-wood staff held in her painted hand, painted weathered bark-detail with painted glowing-rune at the tip',
      'Painted vine-wound wand held softly in her painted painted fingertips, painted woven-vine detail with painted glowing-seed at the tip',
      'Painted branch-staff with painted blooming bloom at the tip, painted held lightly in her painted painted hand',
      'Painted gnarled-staff with painted glowing-amber-stone at the top, painted ceremonial register',
      'Painted simple painted wooden staff with painted ivy spiraling around it, painted natural mythic register',
      'Painted orb-of-light cradled in her painted painted cupped palms, painted soft pearl-glow radiating outward',
      'Painted single painted floating-orb at her painted painted chest level, painted soft pearl-light radiating outward',
      'Painted glowing-orb of painted gentle pearl-light painted held in her painted painted open palm, painted painted magical register',
      'Painted small painted glowing-globe painted floating at her painted painted brow, painted soft warm-amber-glow',
      'Painted painted leaf-chalice held in her painted painted cupped hand, painted natural painted ceremonial register',
      'Painted dewdrop-cup of painted painted hollow-leaf, painted reflective-clarity detail',
      'Painted moss-bowl of painted hollow-stone, painted held in her painted painted painted hand',
      'Painted single painted blooming-staff with painted painted lily blooming at the painted tip, painted held lightly',
      'Painted painted glowing-seed cradled gently in her painted painted painted cupped palms, painted soft pearl-glow',
      'Painted painted single painted fern-frond held painted softly in her painted painted hand, painted natural register',
      'Painted painted single painted pearl-pendant at her painted painted throat on a painted painted woven-silk-cord',
      'Painted painted moonstone painted pendant at her painted painted throat, painted painted pale luminous-glow',
      'Painted painted single painted glowing-amber-pendant painted at her painted painted throat on a painted painted vine-cord',
      'Painted painted floor-length painted leaf-train trailing painted behind her painted gown, painted painted leaf-cluster detail',
    ],
    instructions: `Each entry is ONE specific REGALIA, 15-30 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific regalia type, (b) natural material, (c) position. NO metal jewelry. NO weapons. NO creature description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_fairy_court_forest_backdrop: {
    format: 'simple',
    theme: `SACRED FOREST BACKDROP for FaeBot's fairy-court path. Each entry describes ONE specific sacred-grove enchanted-forest setting wrapping the court. Each entry 25-50 words.

⚠️ THE BAR: each backdrop is an enchanted sacred-grove setting wrapping the court — ancient oak grove / wisteria-cascade arbor / standing-stone-circle / fern-grotto throne / yew-grove. Atmospheric depth fading to painted distance. NEVER built architecture.

⚠️ BACKDROP CATEGORIES (across 25 entries):
  • ~5 ANCIENT OAK CATHEDRAL — soaring oak-cathedral with dappled god-rays
  • ~4 WISTERIA-CASCADE ARBOR — violet wisteria draping overhead like cathedral ceiling
  • ~4 SACRED-STONE-CIRCLE — ancient standing-stones surrounding the queen
  • ~3 FERN-GROTTO — moss-covered boulders cradling the court
  • ~3 YEW-GROVE — twisted dark-green yew-trees ringing the clearing
  • ~3 BIRCH-GLADE — pale slender birch-trunks framing the scene
  • ~2 SACRED CLEARING — mossy-clearing in deep forest
  • ~1 RARE — ancient mushroom-grove ring / bioluminescent glen

⚠️ EVERY entry MUST include:
  - SPECIFIC FOREST TYPE (named tree species + structural feature)
  - 2+ SIGNATURE FEATURES (moss-covered roots / ancient stones / hanging vines)
  - MULTI-TIER DEPTH

🚫 STRICT BANS:
  • NO castle / built architecture / stone-masonry / carved stones (standing-stones OK)
  • NO modern setting
  • NO creature description / regalia (separate axes)
  • NO lighting / weather (separate axes)`,
    touchpoints: [
      'Ancient oak-cathedral grove with painted massive twisted gnarled trunks, painted moss-covered roots crossing the forest-floor, painted hanging-vines from above, painted dappled god-rays piercing canopy, painted multi-tier depth',
      'Wisteria-cascade arbor with painted violet-wisteria racemes draping from above like a painted natural cathedral ceiling, painted moss-grown path through, painted gallery-tier ceremonial register',
      'Sacred standing-stone-circle in painted moonlit clearing, painted ancient weathered stones ringing the queen, painted moss-floor at the painted stone-bases, painted atmospheric mist',
      'Hidden fern-grotto cradled by painted moss-covered boulders, painted tall lacy fern-fronds towering, painted ancient bark-textured stones surrounding, painted ceremonial register',
      'Ancient yew-grove with painted twisted dark-green yew-trees ringing the painted sacred clearing, painted weathered standing-stones half-buried in painted moss, painted deep blue-green mystery',
      'Birch-glade with painted pale slender birch-trunks rising tall and graceful around the painted court, painted scattered moss-floor with painted mushroom-rings, painted ethereal painted register',
      'Sacred clearing in deep painted ancient forest, painted moss-floor surrounded by painted massive ancient tree-trunks, painted dappled light filtering through, painted multi-tier depth',
      'Ancient mushroom-ring grove with painted massive ancient mushroom-spires ringing the painted forest clearing, painted soft pearl-glow emanating from gills, painted moss-carpet, painted magical register',
      'Bioluminescent glen with painted softly glowing-moss carpeting the forest-floor in painted soft cyan-and-violet, painted glowing-mushrooms surrounding the painted clearing, painted magical ceremonial register',
      'Ancient oak-cathedral with painted soaring trunks rising into a painted vaulted canopy, painted hanging-moss curtains from above, painted moss-and-fern floor, painted gallery-tier sacred register',
      'Painted oak-cathedral with painted vast twisted ancient trunks like painted columns, painted moss-and-root throne grown from the painted floor, painted dappled god-rays piercing the painted canopy',
      'Painted hidden fern-grotto cradled by painted ancient stones, painted lacy painted fern-fronds soaring overhead, painted dripping painted moss-cliffs, painted ceremonial register',
      'Painted wisteria-cathedral with painted cascading violet-wisteria draping from painted ancient oak-branches overhead, painted moss-grown path through, painted ethereal painted register',
      'Painted wisteria-arbor over a painted winding moss-path, painted violet-cluster draping from above, painted scattered fallen wisteria-petals on the path below, painted gallery-tier register',
      'Painted sacred-stone-circle painted at painted twilight, painted ancient weathered stones painted half-buried in moss, painted distant treeline painted silhouette, painted atmospheric register',
      'Painted ancient ring of painted standing-stones, painted moss-covered painted bases, painted single tall painted dolmen at the center, painted twilight-blue painted atmosphere',
      'Painted moss-and-boulder fern-grotto, painted dripping painted ferns from painted cliff-walls, painted hidden painted grotto-floor of painted moss-and-stone, painted ceremonial register',
      'Painted yew-grove painted clearing with painted twisted dark-green painted yew-trees painted ringing painted ancient standing-stones, painted deep blue-green painted painted mystery',
      'Painted painted ancient painted yew-cathedral with painted twisted painted dark trunks painted forming painted natural columns, painted deep painted shadowy painted register',
      'Painted birch-glade clearing with painted slender painted pale-bark birch-trunks painted in painted close formation, painted dappled painted light, painted ethereal painted register',
      'Painted sacred painted clearing in painted ancient painted oak-forest, painted moss-floor painted carpet, painted painted hanging-moss painted curtains painted draping from painted above',
      'Painted hidden painted grove painted of painted ancient painted mossy painted oak-trees, painted painted moss-and-root painted throne painted grown painted from painted the painted floor',
      'Painted painted ancient painted painted forest painted clearing painted at painted painted twilight, painted painted moss-floor painted with painted painted scattered painted painted mushroom-rings',
      'Painted painted bioluminescent painted painted glen painted with painted painted softly painted glowing-moss painted carpeting painted the painted painted forest-floor, painted painted magical painted painted register',
      'Painted painted ancient painted painted painted oak-grove painted painted with painted painted scattered painted painted moss-and-vine painted painted thrones painted painted grown painted painted from painted painted roots',
    ],
    instructions: `Each entry is ONE specific SACRED FOREST BACKDROP, 25-50 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific forest type, (b) 2+ signature features, (c) multi-tier depth. NO castle / built architecture. NO modern. NO creature/regalia. NO lighting/weather. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_fairy_court_lighting: {
    format: 'simple',
    theme: `COURT LIGHTING for FaeBot's fairy-court path. Each entry describes ONE specific lighting register tuned for ceremonial court scenes. Each entry 25-45 words.

⚠️ THE BAR: each lighting entry is tuned for CEREMONIAL COURT register — moonlit silver / twilight violet / golden-hour-through-trees / bioluminescent ambient / dawn-pink. The light is dignified, atmospheric, never harsh.

⚠️ LIGHTING CATEGORIES (across 25 entries):
  • ~6 GOLDEN-HOUR — warm-amber through ancient trees / golden-glow on queen's gown
  • ~4 MOONLIT — silver moonlight on the clearing / blue-moon ambient
  • ~4 TWILIGHT — magical violet twilight / blue-hour with warm-yellow accents
  • ~3 DAWN — soft-pink dawn / pearl-mist dawn through the grove
  • ~3 BIOLUMINESCENT — soft pollen-glow / glowing-moss ambient
  • ~3 DAPPLED — dappled canopy-light through the grove on the queen
  • ~2 SOFT-CANDLELIT — soft warm-amber from will-o-wisps / glowing crown

⚠️ EVERY entry MUST include:
  - SPECIFIC TIME-OF-DAY
  - SPECIFIC LIGHT QUALITY (shafts / ambient / sidelight / underlight)
  - HOW IT CATCHES THE QUEEN (gilding her gown / haloing her crown / catching her hair)
  - PALETTE CUE

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome description (separate axis)
  • NO weather (separate axis)
  • NO storm / lightning / dark-grey-blue (peaceful ceremonial register only)`,
    touchpoints: [
      'Painted golden-hour warm-amber light filtering through the painted ancient grove in painted shafts, painted gilding her painted gown and painted antler-crown',
      'Painted late-afternoon warm sidelight raking across her painted form, painted long shadows defining her painted ceremonial silhouette, warm-gold palette',
      'Painted magic-hour golden light painting her painted gown with painted warm-amber and golden palette, painted-storybook softness',
      'Painted golden warm sidelight gilding her painted hair and her painted antler-crown, painted soft warm-amber halo at her painted shoulders',
      'Painted late-afternoon backlight haloing her painted silhouette in painted warm-gold rim-light, painted ceremonial register',
      'Painted golden-hour through canopy creating painted dappled warm-light patterns on her painted shoulders and gown, painted intimate ceremonial register',
      'Painted silver moonlight on the painted clearing, painted cool-blue ambient with painted silver edge-light catching her painted crown',
      'Painted blue-moon ambient flooding the painted scene with painted cool silver-blue painted light, painted soft white-glow on her painted shoulders',
      'Painted moonlit silver-and-violet ambient with painted distant moon visible through the canopy gap, painted deep-blue saturating the scene',
      'Painted bright moonlight painted illuminating the painted sacred-stone-circle, painted long painted moon-shadows from the painted stones, painted cool-blue palette',
      'Painted cool-blue twilight with painted warm-yellow accents from painted will-o-wisps at her painted shoulders, painted ceremonial register',
      'Painted blue-hour twilight with painted last painted warm-orange of painted sunset bleeding through painted distant trunks, painted soft warm catching her painted gown',
      'Painted magical violet-twilight glow saturating the painted scene in painted soft lavender-and-blue, painted faint pollen-light particles in the painted air',
      'Painted twilight with painted deepening blue-and-violet sky, painted soft warm light on her painted face from below, painted ceremonial intimate register',
      'Painted soft-pink dawn light gilding her painted face with painted rose-gold-and-lavender palette, painted gentle peaceful ceremonial register',
      'Painted golden dawn beams angling through the painted canopy from a painted low east angle catching her painted painted painted painted face in painted warm-gold side-light',
      'Painted pearl-mist dawn beams angling low through the painted grove in painted shafts of painted soft white-gold, painted drifting mist catching the beams',
      'Painted soft pollen-glow at her painted painted painted shoulders in painted warm-gold soft-light, painted bioluminescent ceremonial register',
      'Painted bioluminescent ambient with painted softly-glowing fungi painted behind her painted casting painted soft pearl-cyan light on her painted shoulders',
      'Painted soft cyan-glow ambient from painted bioluminescent moss painted carpeting the painted forest-floor, painted gentle teal-and-violet painted illumination',
      'Painted dappled canopy-light through painted forest hitting her painted painted painted painted painted face in painted soft warm-amber spots',
      'Painted dappled god-rays piercing the canopy in painted shafts of painted warm-amber light reaching her painted shoulder, painted gallery-tier ceremonial light',
      'Painted soft dappled gold patches catching her painted painted painted painted painted painted face in painted warm-amber spots, painted intimate ceremonial register',
      'Painted soft warm-amber light from painted multiple painted will-o-wisps painted orbiting her painted crown, painted ceremonial register',
      'Painted soft candlelit warm-glow from painted glowing-amber crown painted illuminating her painted face from above, painted ceremonial register',
    ],
    instructions: `Each entry is ONE specific LIGHTING moment, 25-45 words. Format: prose, comma-separated phrases. MANDATORY — (a) time-of-day, (b) light quality, (c) how it catches the queen, (d) palette cue. NO creature. NO biome. NO weather. NO storm/lightning. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_fairy_court_weather: {
    format: 'simple',
    theme: `WEATHER (air condition + drifting accents) for FaeBot's fairy-court path. Each entry describes ONE specific atmospheric air condition + drifting accents tuned for court scenes. Each entry 20-40 words.

⚠️ THE BAR: each weather entry establishes a SPECIFIC atmospheric air condition with drifting accents adding painted-ceremonial depth. Particles tuned for court scenes — drifting petals through the grove, mist softening the painted backdrop, pollen-haze at her shoulders.

⚠️ WEATHER CATEGORIES (across 25 entries):
  • ~5 PETAL-DRIFT — drifting petals through the grove / petal cascade past her gown
  • ~4 MIST / FOG — soft mist drifting through the grove / mist softening backdrop
  • ~4 DEW-GLINTS — dewdrops on her gown / dew on her hair-strands / morning dew on stones
  • ~3 POLLEN-HAZE — drifting golden pollen-motes through the painted air / pollen-shimmer
  • ~3 GENTLE-BREEZE — gentle breeze moving her painted gown-train / soft wind in her hair
  • ~3 DRIFTING-LEAVES — autumn-leaves drifting through the grove / single falling leaf
  • ~2 CLEAR / STILL — clear painted-still air with crisp grove visibility
  • ~1 SNOW-DUST — winter petal-snow / first-frost on her gown

⚠️ EVERY entry MUST include:
  - SPECIFIC AIR CONDITION
  - DRIFTING ACCENT (at court scale)
  - PALETTE / TEMPERATURE CUE

🚫 STRICT BANS:
  • NO creature description (separate axis)
  • NO biome description (separate axis)
  • NO lighting (separate axis)
  • NO catastrophic weather
  • NO storm / lightning`,
    touchpoints: [
      'Drifting cherry-blossom petals through the painted grove in painted soft pink-snow, gentle motion captured, magical painted-spring ceremonial register',
      'Painted falling petal-snow drifting past her painted gown in painted pearl-pink drift, magical painted register',
      'Painted wisteria petals drifting in painted violet-clusters from overhead through the painted grove, painted soft pearl-violet palette',
      'Painted drifting rose-petals past her painted gown in painted soft crimson-and-cream cascade, magical painted register',
      'Painted drifting magnolia-petals in painted large pearl-cream petals through the painted grove, painted gallery-tier register',
      'Painted soft dawn mist drifting through the painted grove in painted pearl-grey wisps, painted atmospheric depth softening backdrop',
      'Painted low pearl-mist drifting at painted knee-height through the painted clearing, painted depth softening painted distant trunks',
      'Painted soft forest-mist drifting through painted depth in painted soft cool-grey wisps, painted gallery-tier ethereal ceremonial register',
      'Painted soft drifting mist threading through the painted grove in painted whisps, painted atmospheric depth, magical hushed register',
      'Painted glistening dewdrops on her painted gown-train in painted reflective droplet detail, painted fresh-morning register',
      'Painted pearl-dew droplets on her painted hair-strands catching the painted light in painted pearl-glints, painted fresh-morning crystal register',
      'Painted morning dew on the painted ancient stones around her in painted shimmering droplet detail, painted fresh peaceful register',
      'Painted shimmering dew on the painted moss-floor around her in painted pearl-glints, painted gallery-tier register',
      'Painted drifting golden pollen-motes through the painted air around her in painted soft warm-light specks, painted magical register',
      'Painted floating pollen-clouds drifting through the painted grove in painted soft warm-glow, painted magical ceremonial register',
      'Painted pollen-shimmer at her painted shoulders in painted golden-warm motes, painted ceremonial register',
      'Painted gentle breeze moving her painted gown-train in painted soft synchronized motion, painted magical alive register',
      'Painted soft wind moving her painted hair in painted gentle motion, painted magical alive-grove register',
      'Painted petals stirring on a painted gentle breeze drifting past her painted painted form in painted soft-motion drift, painted magical register',
      'Painted autumn-leaves drifting through the painted grove in painted red-orange-gold flakes, painted seasonal register',
      'Painted single falling autumn-leaf past her painted shoulder in painted gentle painted-motion, painted seasonal register',
      'Painted settled autumn-leaf carpet stirring softly painted around her painted feet, painted soft seasonal register',
      'Painted clear painted-still air with painted crisp painted visibility into the painted grove depth, painted gallery-tier intimate clarity',
      'Painted motionless painted grove hush with painted crystalline clear air, painted every detail sharp, painted intimate stillness register',
      'Painted first-frost dusting her painted painted painted gown-train in painted soft pearl-white, painted gentle winter-petal-snow drifting through painted air',
    ],
    instructions: `Each entry is ONE specific WEATHER condition, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) air condition, (b) drifting accent, (c) palette/temperature cue. NO creature. NO biome. NO lighting. NO catastrophic weather. NO storm/lightning. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_fairy_court_magical_flavor: {
    format: 'simple',
    theme: `ROYAL MAGICAL FLAVOR for FaeBot's fairy-court path. Each entry describes ONE specific royal magic signature visible in the painted court scene. Each entry 15-30 words.

⚠️ THE BAR: each magical entry is a SPECIFIC luminous detail painted as royal/ceremonial — butterflies orbiting her crown / pollen-halo at her shoulders / will-o-wisps trailing the procession / glowing crown.

⚠️ MAGIC CATEGORIES (across 25 entries):
  • ~5 BUTTERFLIES ORBITING — butterfly cluster orbiting her painted crown
  • ~5 POLLEN-HALO — soft pollen-halo at her shoulders / pollen-cloud
  • ~4 WILL-O-WISPS — will-o-wisps trailing the procession / single wisp at her hand
  • ~4 GLOWING-CROWN — antler-crown glowing softly / coronet-of-light
  • ~3 GLOWING-AURA — soft pearl-aura around her painted form / golden halo
  • ~2 FAIRY-DUST — fairy-dust trailing from her painted fingertips / glittering trail
  • ~2 FIREFLIES — fireflies orbiting at her painted gown

⚠️ EVERY entry MUST include:
  - SPECIFIC MAGIC TYPE
  - POSITION (around her crown / at her shoulders / trailing her form / etc.)
  - LIGHT QUALITY (luminous / glowing / sparkling)

🚫 STRICT BANS:
  • NO crude particle-effect language
  • NO modern-CGI references
  • NO creature description
  • NO violence`,
    touchpoints: [
      'Painted cluster of butterflies orbiting her painted antler-crown in painted soft-color clusters, painted magical royal register',
      'Painted monarch-butterflies orbiting her painted painted crown in painted orange-and-black cluster, painted magical register',
      'Painted gold-and-silver butterflies orbiting her painted hair in painted soft cluster, painted ceremonial magic register',
      'Painted single luna-moth painted perched on her painted antler-tip with painted iridescent green wings spread, painted magical register',
      'Painted butterfly-cluster orbiting her painted painted gown-train in painted gentle motion, painted ceremonial register',
      'Painted soft pollen-halo at her painted shoulders in painted warm-gold soft-light, painted magical ceremonial register',
      'Painted pollen-cloud at her painted painted form in painted soft warm-glow, painted magical register',
      'Painted golden pollen-mist around her painted crown in painted soft warm-light, painted ceremonial royal register',
      'Painted silver pollen-motes drifting around her painted painted form in painted soft pearl-light, painted magical register',
      'Painted painted drifting pollen-light around her painted shoulders in painted soft warm-glow, painted magical ceremonial register',
      'Painted will-o-wisps trailing the painted procession in painted soft warm-yellow points, painted magical procession register',
      'Painted single painted will-o-wisp painted floating at her painted painted painted painted shoulder in painted soft pearl-glow, painted intimate ceremonial register',
      'Painted three painted will-o-wisps orbiting her painted painted painted form in painted soft pearl-glow, painted magical register',
      'Painted painted wisps trailing her painted painted gown-train in painted soft warm-glow, painted ceremonial register',
      'Painted antler-crown painted glowing softly in painted soft pearl-light, painted magical royal register',
      'Painted painted coronet-of-light around her painted painted brow in painted soft warm-glow, painted ceremonial register',
      'Painted painted diadem painted glowing softly with painted soft pearl-light at her painted brow, painted royal magical register',
      'Painted painted gold-leaf-circlet painted glowing softly in painted warm-amber light, painted magical register',
      'Painted soft pearl-aura around her painted painted painted form in painted gentle painted warm-glow, painted magical ambient register',
      'Painted soft golden halo around her painted painted painted form in painted painted luminous warm-light, painted sacred register',
      'Painted painted gentle painted pearl-aura at her painted shoulders in painted soft warm-glow, painted magical register',
      'Painted painted fairy-dust trailing painted from her painted painted painted painted fingertips in painted soft golden sparkle, painted magical register',
      'Painted painted glittering painted painted painted fairy-dust painted trail painted drifting from her painted painted painted hand into the painted painted painted air, painted magical register',
      'Painted painted cluster of painted fireflies orbiting her painted painted painted painted gown-train in painted soft warm-yellow points, painted magical evening register',
      'Painted painted firefly-cluster painted around her painted painted painted painted shoulder in painted soft warm-glow at painted painted dusk, painted ceremonial register',
    ],
    instructions: `Each entry is ONE specific MAGICAL FLAVOR accent, 15-30 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific magic type, (b) position around her, (c) light quality. NO crude particle-effect. NO modern-CGI. NO creature description. NO violence. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_fairy_court_foreground_anchor: {
    format: 'simple',
    theme: `FOREGROUND ANCHOR for FaeBot's fairy-court path. Each entry describes ONE specific tactile foreground element bringing 3-tier depth. Each entry 20-40 words.

⚠️ THE BAR: each entry is a SPECIFIC tactile element close to the camera bringing 3-tier court depth — hanging vine, hanging-moss curtain, fern-frond cluster, drifting petal-cluster, painted standing-stone-edge.

⚠️ FOREGROUND CATEGORIES (across 25 entries):
  • ~5 HANGING VINE / WILLOW — hanging-vine curtain / weeping willow draping
  • ~4 HANGING MOSS / LICHEN — hanging spanish-moss curtain / lichen-cluster
  • ~4 FERN-CLUSTER — fern-frond cascading / fern-tip cluster
  • ~3 STANDING-STONE EDGE — painted ancient stone edge / weathered stone foreground
  • ~3 BLOOM CLUSTER — foxglove-spires foreground / wisteria-cluster
  • ~3 DRIFTING PETAL-CLUSTER — drifting petals close to camera
  • ~3 ROOT / BRANCH — gnarled root crossing foreground / mossy branch tip

⚠️ EVERY entry MUST include:
  - SPECIFIC TYPE
  - POSITION IN FRAME
  - TACTILE DETAIL

🚫 STRICT BANS:
  • NO creature description
  • NO biome / setting (separate axis)
  • NO weather (separate axis)
  • NO modern objects
  • NO blocking the court`,
    touchpoints: [
      'Hanging vine-curtain in painted foreground-left with painted bloom-laden tendrils cascading from above, painted intimate ceremonial framing',
      'Weeping willow branches draping softly out-of-focus in painted foreground-right, framing the court without blocking',
      'Hanging ivy-vines threading across the painted upper-left foreground, painted leaf-veining detail',
      'Bloom-laden hanging vine-cluster in painted foreground-right with painted foxglove-bells, painted gentle framing',
      'Wisteria-cascade hanging in painted foreground-left with painted violet petals, painted ceremonial framing',
      'Hanging spanish-moss curtain in painted foreground softly out-of-focus from upper-left, painted dripping detail',
      'Lichen-cluster in painted foreground-right with painted pale-grey-green texture, painted close-up tactile detail',
      'Hanging moss-cascade in painted foreground softly out-of-focus, painted gentle framing register',
      'Painted lichen-rune patterns on painted moss in painted foreground softly out-of-focus, painted ancient register',
      'Tall fern-cluster arching across the painted bottom of the frame, painted lacy fronds, painted tactile foreground detail',
      'Painted fern-fronds in painted foreground-left softly out-of-focus with painted leaf-veining, painted soft cool-green palette',
      'Painted unfurling fern-fronds in painted foreground-right with painted spiral-detail, painted ethereal register',
      'Painted tall fern-grass cluster across the painted lower painted depth with painted delicate leaf-edge detail',
      'Painted ancient standing-stone edge sweeping across painted foreground-left with painted moss-and-lichen texture, painted intimate framing',
      'Painted weathered stone edge in painted foreground-right with painted ancient rune-detail softly out-of-focus, painted ceremonial register',
      'Painted moss-covered stone foreground sweeping across the painted lower frame, painted gallery-tier tactile detail',
      'Painted foxglove-spires in painted foreground-left in painted pink-and-purple bell-clusters, painted intimate framing',
      'Painted wisteria-cluster in painted foreground-right softly out-of-focus with painted violet racemes, painted ethereal framing',
      'Painted bluebell-cluster in painted foreground softly out-of-focus with painted soft-violet bells, painted intimate framing',
      'Painted drifting cherry-blossom petal-cluster filling the painted foreground in painted pink-snow, painted soft motion captured',
      'Painted drifting petal-cluster across the painted foreground in painted pearl-pink, painted magical register',
      'Painted autumn-leaf drift in painted foreground with painted red-orange-gold leaves cascading, painted seasonal register',
      'Painted gnarled ancient root crossing the painted foreground earth, painted twisted bark-detail, painted depth anchor',
      'Painted moss-covered fallen log across the painted foreground, painted weathered bark-detail, painted depth anchor',
      'Painted mossy branch tip in painted foreground softly out-of-focus, painted velvety green-moss texture, painted intimate framing',
    ],
    instructions: `Each entry is ONE specific FOREGROUND ANCHOR, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific type, (b) position in frame, (c) tactile detail. NO creature. NO biome. NO weather. NO modern. NO blocking. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },

  faebot_fairy_court_sacred_companion: {
    format: 'simple',
    theme: `40%-GATED SACRED COMPANION for FaeBot's fairy-court path. Each entry describes ONE specific sacred animal attending the court at NORMAL scale (queen is adult-sized, animal at its natural size). Each entry 20-40 words.

⚠️ THE BAR: each companion is a SACRED forest creature attending the court at NORMAL scale — white stag / raven / owl / fox / hare / wolf (gentle) / butterfly cluster. Knelt before the queen, perched on her shoulder, sitting at her feet. NOT a tiny-fae dwarfing-scale companion.

⚠️ COMPANION CATEGORIES (across 25 entries):
  • ~5 WHITE-STAG — white stag knelt before her / standing in profile / approaching gently
  • ~4 RAVEN / CORVID — raven on her shoulder / raven perched on her staff / two ravens
  • ~4 OWL — great-horned-owl on a branch behind her / owl perched on her arm
  • ~3 FOX — silver-fox at her feet / red-fox sitting beside her
  • ~3 HARE — hare-doe sitting at her feet / hare watching from nearby
  • ~3 WOLF (GENTLE) — wolf-pack lying at her feet (gentle) / single wolf curled
  • ~2 BUTTERFLY CLUSTER — butterfly cluster orbiting her painted head and shoulders
  • ~1 RARE — small bear cub / kitsune / mythical creature

⚠️ EVERY entry MUST include:
  - SPECIFIC SACRED ANIMAL
  - HOW IT INTERACTS (knelt before her / perched on shoulder / sitting at her feet)
  - PAINTED TACTILE DETAIL (white fur / iridescent feathers / soft fur)

🚫 STRICT BANS:
  • NO predatory aggressive postures (creature is gentle / sacred / dignified)
  • NO scaling against the queen (this is NOT a tiny-fae dwarfing companion — queen is adult-sized)
  • NO creature description of queen (separate axis)
  • NO violence`,
    touchpoints: [
      'A pure white stag knelt before the queens painted throne, painted antlers branching with painted small blooms, painted serene gaze',
      'A large painted white stag standing in painted profile beside the queen, painted long antlers reaching upward, painted gentle stance',
      'A painted young white stag painted approaching gently with painted lowered antlers, painted ceremonial register',
      'A painted raven perched on the queens painted painted shoulder with painted iridescent black plumage, painted ceremonial register',
      'A painted raven painted perched on the painted top of the queens painted painted staff, painted dignified register',
      'Painted two painted ravens painted flanking the painted queen on either painted shoulder, painted iridescent black plumage',
      'A painted great-horned-owl perched on a painted branch behind the queen, painted tufted ears and painted large yellow eyes',
      'A painted owl painted perched on the painted queens painted painted painted arm with painted painted soft brown plumage',
      'A painted snowy-owl painted painted perched on a painted painted branch above the queen, painted painted white plumage and painted dark eyes',
      'A painted silver-fox sitting at the painted queens painted painted feet, painted soft silver-grey fur, painted gentle painted ceremonial register',
      'A painted red-fox sitting beside the painted queen on her painted moss-throne, painted soft russet fur, painted curious painted gaze',
      'A painted snow-fox painted painted curled at the painted queens painted painted feet, painted soft white fur, painted gentle register',
      'A painted hare-doe painted sitting motionless at the painted queens painted painted feet, painted soft brown-and-grey fur, painted tall ears upright',
      'A painted snow-hare painted painted curled nearby on the painted moss, painted soft white fur, painted gentle painted register',
      'A painted hare painted watching from painted painted nearby ferns, painted gentle painted register',
      'A painted wolf-pack of painted two painted wolves painted lying at the painted queens painted painted feet, painted soft grey fur, painted gentle dignified register',
      'A painted single painted wolf painted curled painted at the painted queens painted painted feet, painted soft white-and-grey fur, painted gentle painted register',
      'A painted lone painted painted wolf painted painted standing beside the painted queen, painted painted painted soft brown fur, painted dignified gaze',
      'Painted cluster of painted painted butterflies painted orbiting the painted queens painted painted head and painted painted shoulders, painted soft-color clusters',
      'Painted cluster of painted painted monarch-butterflies painted orbiting the painted queen in painted orange-and-black cluster, painted ceremonial register',
      'Painted painted cluster of painted painted painted silver-butterflies painted painted orbiting the painted painted queens painted painted form, painted soft pearl register',
      'A painted small painted bear-cub painted painted sitting beside the painted queens painted painted throne with painted soft brown fur, painted gentle register',
      'A painted small painted painted bear-cub painted painted curled at the painted queens painted painted painted feet, painted soft brown fur, painted painted gentle painted register',
      'A painted kitsune-spirit painted with painted multiple painted painted soft white tails painted sitting beside the painted queen, painted painted ceremonial register',
      'A painted painted painted painted three-tailed painted painted painted fox-spirit painted painted painted sitting at the painted painted painted painted queens painted painted feet, painted painted painted painted painted painted soft russet painted painted fur, painted painted gentle painted painted register',
    ],
    instructions: `Each entry is ONE specific SACRED COMPANION, 20-40 words. Format: prose, comma-separated phrases. MANDATORY — (a) specific sacred animal, (b) how it interacts (knelt / perched / sitting), (c) painted tactile detail. NO predatory. NO dwarfing-scale. NO creature description of queen. NO violence. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line, no internal newlines.`,
  },


};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  if (recipe.format === 'simple') {
    return `${recipe.theme}

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }
  throw new Error(`Unknown recipe.format "${recipe.format}"`);
}

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: SONNET, max_tokens: 16000, messages: [{ role: 'user', content: prompt }] }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally { clearTimeout(timeoutId); }
}

function parseArray(text) {
  const body = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) { if (current) entries.push(current); current = m[2].trim(); }
    else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) => e.replace(/^["']|["']$/g, '').replace(/^[-•*]\s*/, '').trim())
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

const STOPWORDS = new Set(['the','a','an','and','or','but','with','of','in','on','at','to','for','from','by','as','is','are','was','were','be','been','being','have','has','had','this','that','these','those','it','its','they','them','their','her','his','into','onto','through','across','over','under','near','around','between','one','two','three','some','any','all','no','not','than','then','also','so','very','more','most','many','much','each','every','other','another','same','such','only','own','just','still','here','there','where','when','what','who','wide','tall','long','high','low','large','small','massive','huge','vast','above','below','beside','behind','toward','within','throughout']);

function signatureOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  const tokens = body.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 4 && !STOPWORDS.has(w)).slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map(); const seenTitles = new Map();
  const kept = []; const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) { dropped.push({ entry: e.slice(0, 80), reason: 'title' }); continue; }
    const sig = signatureOf(e);
    if (sig.length < 10) { if (title) seenTitles.set(title, e); kept.push(e); continue; }
    if (seenSigs.has(sig)) { dropped.push({ entry: e.slice(0, 80), reason: 'body' }); continue; }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try { arr = parseArray(text); }
  catch (e) { console.error('Parse failed:', e.message); console.error('First 400 chars:', text.slice(0, 400)); return []; }
  if (!Array.isArray(arr) || arr.length === 0) { console.warn('  ⚠ Sonnet returned no usable entries'); return []; }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/faebot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) { try { preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch {} }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  if (TARGET !== null) console.log(`Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`);
  else console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  let pool = [...preExisting]; let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(`\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`);
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) { console.warn('  ⚠ empty Sonnet response — stopping iteration'); break; }
    const within = dedupe(fresh);
    if (within.dropped.length > 0) console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) { console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping'); break; }
  }
  console.log(`\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`);
  if (DRY) { console.log('\nDry-run — not writing to disk.'); return; }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) { fs.copyFileSync(outPath, bakPath); console.log(`Backed up existing pool → ${bakPath}`); }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
