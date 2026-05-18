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
  // ─── flower-fairy R7: bloom_gown rewritten as SOLID FLOWER-WALL (no fabric, no silhouette names) ───
  faebot_flower_fairy_bloom_gown: {
    format: 'simple',
    theme: `FLOWER-EXPLOSION ENGULFING HER BODY for the FaeBot flower-fairy path (R8). Each entry describes a MAXIMALIST FLOWER-BLAST drenching her body from neck to floor and spilling outward into the foreground. NEVER use the words "dress" / "gown" / "skirt" / "silhouette" / "bodice" / "sleeves" / "fabric" / "wall" / "garment" — those pull Flux's clothing prior. Just describe her body as ENGULFED / OVERFLOWING / DRENCHED / BURIED / CASCADING in maximalist flowers. Each entry 30-60 words.

⚠️ FRAMING LANGUAGE (use these verbs/phrases):
  • "MAXIMALIST FLOWER-EXPLOSION engulfing her body neck to floor"
  • "torrential bloom-cascade drenching her from collarbone to feet"
  • "her body OVERFLOWING with [flowers] spilling outward into the foreground"
  • "petal-storm CASCADING from her neck, her arms, her hips, her thighs"
  • "her form is BURIED inside a maximalist bloom-storm"
  • "FLOWER-BLAST covering every inch of her body and overflowing beyond her shape"
  • "she stands at the center of a flower-explosion that engulfs her entirely"

⚠️ MULTI-SPECIES + COLOR THEME — 3-6 named flower species in ONE bold coordinated color palette.

⚠️ COLOR THEMES (distribute):
  SUNSET (red/orange/pink/coral/gold) | TWILIGHT PURPLES | BLUSH PINKS | MONOCHROME WHITE
  RAINBOW EXPLOSION | DEEP BURGUNDY + WINE | GOLD + AMBER + COPPER | OCEAN COOL
  EMERALD FOREST | PASTEL CANDY | TROPICAL BOLD | AUTUMN HARVEST | DUSK FIRE
  BLUE + WHITE | PINK + GOLD | VIOLET + CREAM | NAVY + BURGUNDY | MAGENTA + ORANGE

🚫 STRICT BANS:
  • NO words: dress / gown / skirt / silhouette / bodice / sleeves / fabric / cloth / garment / tulle / chiffon / satin / silk / wall / wearing
  • NO single-species
  • NO hair references
  • NO mention of clothing-style or garment-shape`,
    touchpoints: [
      'SUNSET FLOWER-BLAST — maximalist flower-explosion engulfing her body neck to floor with red roses + coral peonies + orange ranunculus + golden marigolds + amber dahlias, blooms cascade down her arms her hips her thighs and spill outward into the foreground bouquet, her body buried inside a torrential sunset bloom-storm',
      'TWILIGHT PURPLE EXPLOSION — her body engulfed and overflowing with lavender wisteria + violet anemones + indigo iris + periwinkle sweet-pea + deep-purple dahlias drenching her from collarbone to feet, petal-storm cascading from her form into the foreground',
      'BLUSH PINK ENGULFING-STORM — torrential bloom-cascade drenching her body with soft pink peonies + blush garden roses + cream ranunculus + ivory jasmine + pale-blush cabbage roses, every inch buried under maximalist blush-pink flower-explosion overflowing beyond her shape',
      'MONOCHROME WHITE FLOWER-BLAST — her form completely engulfed in maximalist white roses + cream gardenias + ivory peonies + pearl-white jasmine + pale-blush hellebore, a snow-white bloom-storm cascading from her neck out into the foreground',
      'RAINBOW FLOWER-EXPLOSION — maximalist bloom-blast engulfing her body with red poppies + orange marigolds + yellow daisies + green hellebore + blue cornflowers + purple anemones, rainbow petal-storm overflowing her form in every direction',
      'CORAL TROPICAL ENGULFING-BLAST — her body drenched and engulfed by coral peonies + peach garden roses + apricot ranunculus + warm sunset dahlias + golden marigolds, tropical bloom-cascade overflowing from neck to feet into the foreground',
      'BURGUNDY WINE FLOWER-STORM — torrential bloom-explosion drenching her body with burgundy dahlias + plum cosmos + maroon roses + dark-crimson ranunculus + black-purple calla, dark wine-spectrum petals cascading and overflowing beyond her form',
      'GOLD AMBER FLOWER-BLAST — her body engulfed by maximalist explosion of golden marigolds + amber rudbeckia + copper dahlias + warm yellow daisies + bronze chrysanthemums, metallic bloom-storm cascading and spilling outward',
      'OCEAN COOL ENGULFING-STORM — her form buried inside torrential cascade of aqua hydrangeas + teal sea-holly + ice-blue forget-me-nots + seafoam hellebore + pearl-white roses, cool ocean-spectrum bloom-explosion overflowing her body',
      'EMERALD FOREST FLOWER-BLAST — her body engulfed and overflowing with green hellebore + white daisies + pale yellow primrose + lavender sweet-pea + emerald succulents, maximalist forest bloom-storm cascading neck to floor',
      'PASTEL CANDY EXPLOSION — torrential cascade of pastel pink + lilac + mint + butter-yellow + sky-blue tiny blooms engulfing her body, cotton-candy flower-storm drenching her form and spilling into foreground',
      'TROPICAL BOLD FLOWER-BLAST — her body buried inside maximalist explosion of hot pink hibiscus + tropical orange marigolds + magenta bougainvillea + bright yellow plumeria + saturated coral ginger, bold tropical bloom-storm overflowing her form',
      'AUTUMN HARVEST ENGULFING-STORM — her body drenched and engulfed by rust chrysanthemums + russet dahlias + ochre marigolds + burnt-orange roses + ruby-wine cosmos, autumn bloom-cascade overflowing from collarbone to feet',
      'DUSK FIRE FLOWER-BLAST — her form completely engulfed by torrential cascade of deep red roses + orange peonies + crimson ranunculus + gold marigolds + warm-amber dahlias, dusk-fire bloom-explosion overflowing beyond her shape',
      'BLUE + WHITE COASTAL ENGULFING-BLAST — her body drenched and engulfed in sky-blue hydrangeas + white roses + ice-blue forget-me-nots + pearl-white jasmine + soft cornflower-blue, coastal bloom-storm cascading from neck to floor',
      'PINK + GOLD ROMANTIC BLAST — her body engulfed by maximalist cascade of soft pink garden roses + gold-amber ranunculus + cream peonies + pale rose-gold dahlias + pearl-pink sweet-pea, romantic bloom-explosion overflowing her form',
      'VIOLET + CREAM FLOWER-STORM — torrential cascade of violet iris + cream-white roses + lavender peonies + pearl-white anemones + soft violet sweet-pea engulfing her body neck to floor',
      'CHERRY-BLOSSOM EXPLOSION — her form buried inside maximalist explosion of pink + white cherry blossom petals + pink camellias + cream magnolias, cherry-blossom storm cascading and overflowing from her body',
      'RED + BURGUNDY BLAST — her body engulfed and drenched in deep red roses + burgundy dahlias + crimson peonies + dark-wine cosmos + black-red ranunculus, maximalist crimson bloom-storm overflowing her form',
      'YELLOW MEADOW SUN-EXPLOSION — her body completely engulfed by yellow daisies + golden marigolds + butter-yellow ranunculus + cream-yellow daffodils + sunshine chrysanthemums, maximalist sun bloom-cascade overflowing her form',
      'LILAC + BABY-BLUE SPRING BLAST — torrential cascade of lilac + baby-blue + pale-lavender + soft periwinkle + sky-blue forget-me-nots engulfing her body, spring bloom-storm cascading neck to floor',
      'TEAL + ROSE-GOLD VINTAGE BLAST — her body buried inside maximalist explosion of teal hydrangeas + rose-gold dahlias + dusty-pink roses + warm copper ranunculus + cream-white peonies, vintage bloom-storm overflowing her form',
      'BLACK ROSE + WHITE GOTH BLAST — her body engulfed by torrential cascade of dark-burgundy black-roses + white roses + deep-violet anemones + ivory gardenias + pearl-pink hellebore, gothic bloom-storm cascading and overflowing',
      'PEACH + CREAM SOFT BLAST — her body drenched and engulfed by peach garden roses + cream peonies + soft apricot ranunculus + pearl-white jasmine + warm-cream camellias, soft bloom-cascade overflowing her form',
      'MAGENTA + ORANGE BOLD BLAST — her body buried inside maximalist explosion of hot magenta dahlias + bright orange marigolds + fuchsia peonies + coral ranunculus + saturated tropical bougainvillea, bold bloom-storm overflowing her form',
      'MINT + WHITE FRESH BLAST — her body completely engulfed in mint-green hellebore + white roses + pale-green succulents + ivory jasmine + soft seafoam ranunculus, fresh bloom-cascade overflowing her form',
      'BUTTER YELLOW + BLUSH BLAST — her body drenched and engulfed by butter-yellow daisies + blush garden roses + cream-yellow ranunculus + soft pink peonies + pearl-yellow chrysanthemums, soft bloom-storm overflowing',
      'INDIGO + VIOLET DEEP BLAST — her body engulfed by torrential cascade of indigo irises + violet wisteria + deep-purple anemones + dark-violet sweet-pea + plum dahlias, deep-purple bloom-storm overflowing her form',
      'ORANGE + CORAL TROPICAL BLAST — her body buried inside maximalist explosion of bright orange marigolds + coral hibiscus + tropical-peach plumeria + warm orange-yellow ranunculus + sunset bougainvillea, tropical bloom-storm overflowing',
      'AMBER + COPPER METALLIC BLAST — her body engulfed and drenched in amber dahlias + copper-orange chrysanthemums + warm-bronze ranunculus + gold-amber marigolds + russet roses, metallic bloom-storm overflowing her form',
    ],
    instructions: `Each entry is ONE FLOWER-EXPLOSION engulfing her body, 30-60 words. Format: "COLOR-THEME NAME BLAST/EXPLOSION/STORM — her body engulfed/buried/drenched by [3-6 named species], bloom-cascade overflowing/spilling beyond her form". NEVER use words: dress / gown / skirt / silhouette / bodice / fabric / wall / garment. ALWAYS use engulfing/overflowing/cascading verbs. MULTI-SPECIES + COLOR-THEMED. Output as a NUMBERED list, one per line.`,
  },


  // ─── flower-fairy R7: hair_floral rewritten — flowers REPLACE the hair-mass ───
  faebot_flower_fairy_hair_floral: {
    format: 'simple',
    theme: `HAIR-REPLACED-BY-FLOWERS for the FaeBot flower-fairy path. Each entry is ONE specific HAIR-REPLACEMENT cascade where flowers REPLACE the hair-strands themselves — not "flowers threaded through hair" but "flowers AS the hair-mass". The hair appears to BE a flower-cascade flowing from her scalp like hair would. Each entry 30-50 words.

⚠️ FRAMING: the flowers REPLACE the hair-strands. Describe the cascade as if you can't see any hair-strand at all — only flower-strands flowing from her scalp down to waist/back like a flower-waterfall. Lead with phrases like "hair entirely REPLACED by", "cascading FLOWER-HAIR of", "flower-strands flowing from her scalp", "flower-waterfall in place of hair".

⚠️ MULTI-SPECIES + COLOR THEME — 3-6 named species per entry in ONE bold coordinated palette.

🚫 STRICT BANS:
  • NO "flower-crown" / NO "wreath" / NO "halo of flowers"
  • NO "woven through" / NO "tucked in" / NO "small floral accents"
  • NO single-species
  • NO mention of hair-color showing through (hair-color is in separate axis)
  • NO mention of dress / fabric / face / eyes`,
    touchpoints: [
      'SUNSET FLOWER-HAIR REPLACEMENT — hair entirely REPLACED by a waist-length cascade of red roses + coral peonies + orange ranunculus + golden marigolds + amber dahlias flowing like flower-strands from her scalp, no hair-strands visible, pure sunset flower-waterfall',
      'TWILIGHT PURPLE FLOWER-HAIR — flower-strands of lavender wisteria + violet anemones + indigo iris + periwinkle sweet-pea + deep-purple dahlias flowing from her scalp to waist, hair entirely replaced by purple flower-cascade',
      'BLUSH PINK FLOWER-HAIR — hair entirely REPLACED by cascade of soft pink peonies + blush garden roses + cream ranunculus + ivory jasmine + pale-blush cabbage roses flowing from scalp to waist, pure blush flower-waterfall',
      'MONOCHROME WHITE FLOWER-HAIR — flower-strands of white roses + cream gardenias + ivory peonies + pearl-white jasmine + pale-blush hellebore flowing from her scalp like hair, no actual hair visible, snow-white flower-waterfall',
      'RAINBOW FLOWER-HAIR — hair entirely REPLACED by rainbow cascade of red poppies + orange marigolds + yellow daisies + green hellebore + blue cornflowers + purple anemones flowing from scalp like flower-strands',
      'CORAL TROPICAL FLOWER-HAIR — flower-cascade of coral peonies + peach garden roses + apricot ranunculus + warm sunset dahlias + golden marigolds replacing hair-mass entirely, pure flower-waterfall',
      'BURGUNDY WINE FLOWER-HAIR — hair REPLACED by waterfall of burgundy dahlias + plum cosmos + maroon roses + dark-crimson ranunculus + black-purple calla, no hair-strands visible',
      'GOLD AMBER FLOWER-HAIR — flower-strands of golden marigolds + amber rudbeckia + copper dahlias + warm yellow daisies + bronze chrysanthemums flowing from scalp, hair entirely replaced',
      'OCEAN COOL FLOWER-HAIR — hair entirely REPLACED by cascade of aqua hydrangeas + teal sea-holly + ice-blue forget-me-nots + seafoam hellebore + pearl-white roses flowing from scalp',
      'EMERALD FOREST FLOWER-HAIR — flower-cascade of green hellebore + white daisies + pale yellow primrose + lavender sweet-pea + emerald succulents replacing hair entirely',
      'PASTEL CANDY FLOWER-HAIR — flower-strands of pastel pink + lilac + mint + butter-yellow + sky-blue tiny blooms flowing from scalp, cotton-candy flower-waterfall replacing hair',
      'TROPICAL BOLD FLOWER-HAIR — hair REPLACED by hot pink hibiscus + tropical orange marigolds + magenta bougainvillea + bright yellow plumeria + saturated coral ginger flowing from scalp',
      'AUTUMN HARVEST FLOWER-HAIR — flower-cascade of rust chrysanthemums + russet dahlias + ochre marigolds + burnt-orange roses + ruby-wine cosmos replacing hair-mass entirely',
      'DUSK FIRE FLOWER-HAIR — hair entirely REPLACED by waterfall of deep red roses + orange peonies + crimson ranunculus + gold marigolds + warm-amber dahlias, dusk-fire flower-waterfall',
      'BLUE + WHITE COASTAL FLOWER-HAIR — flower-strands of sky-blue hydrangeas + white roses + ice-blue forget-me-nots + pearl-white jasmine + soft cornflower-blue flowing from scalp like hair',
      'PINK + GOLD ROMANTIC FLOWER-HAIR — hair REPLACED by cascade of soft pink garden roses + gold-amber ranunculus + cream peonies + pale rose-gold dahlias + pearl-pink sweet-pea',
      'VIOLET + CREAM FLOWER-HAIR — flower-cascade of violet iris + cream-white roses + lavender peonies + pearl-white anemones + soft violet sweet-pea replacing hair entirely',
      'CHERRY-BLOSSOM FLOWER-HAIR — hair entirely REPLACED by pink + white cherry blossom petals + pink camellias + cream magnolias flowing from scalp like cherry-blossom hair-strands',
      'RED + BURGUNDY FLOWER-HAIR — flower-strands of deep red roses + burgundy dahlias + crimson peonies + dark-wine cosmos + black-red ranunculus flowing from scalp, hair entirely replaced',
      'YELLOW MEADOW FLOWER-HAIR — hair REPLACED by waterfall of yellow daisies + golden marigolds + butter-yellow ranunculus + cream-yellow daffodils + sunshine chrysanthemums',
      'LILAC + BABY-BLUE SPRING FLOWER-HAIR — flower-cascade of lilac + baby-blue + pale-lavender + soft periwinkle + sky-blue forget-me-nots flowing from scalp',
      'TEAL + ROSE-GOLD VINTAGE FLOWER-HAIR — hair entirely REPLACED by teal hydrangeas + rose-gold dahlias + dusty-pink roses + warm copper ranunculus + cream-white peonies',
      'BLACK ROSE + WHITE GOTH FLOWER-HAIR — flower-strands of dark-burgundy black-roses + white roses + deep-violet anemones + ivory gardenias + pearl-pink hellebore replacing hair',
      'PEACH + CREAM FLOWER-HAIR — hair REPLACED by cascade of peach garden roses + cream peonies + soft apricot ranunculus + pearl-white jasmine + warm-cream camellias',
      'MAGENTA + ORANGE BOLD FLOWER-HAIR — flower-strands of hot magenta dahlias + bright orange marigolds + fuchsia peonies + coral ranunculus + saturated tropical bougainvillea flowing from scalp',
      'MINT + WHITE FRESH FLOWER-HAIR — flower-cascade of mint-green hellebore + white roses + pale-green succulents + ivory jasmine + soft seafoam ranunculus replacing hair entirely',
      'BUTTER YELLOW + BLUSH FLOWER-HAIR — hair entirely REPLACED by butter-yellow daisies + blush garden roses + cream-yellow ranunculus + soft pink peonies + pearl-yellow chrysanthemums',
      'INDIGO + VIOLET DEEP FLOWER-HAIR — flower-strands of indigo irises + violet wisteria + deep-purple anemones + dark-violet sweet-pea + plum dahlias flowing from scalp, deep-purple flower-waterfall',
      'ORANGE + CORAL TROPICAL FLOWER-HAIR — hair REPLACED by bright orange marigolds + coral hibiscus + tropical-peach plumeria + warm orange-yellow ranunculus + sunset bougainvillea',
      'AMBER + COPPER METALLIC FLOWER-HAIR — flower-cascade of amber dahlias + copper-orange chrysanthemums + warm-bronze ranunculus + gold-amber marigolds + russet roses replacing hair-mass',
    ],
    instructions: `Each entry is ONE HAIR-REPLACED-BY-FLOWERS cascade, 30-50 words. Format: "COLOR-THEME NAME FLOWER-HAIR — hair entirely REPLACED by cascade of [3-6 named flower species] flowing from scalp to waist". NEVER "woven through" / NEVER "crown" / NEVER "wreath". ALWAYS "REPLACED" / "flower-strands flowing from scalp" / "flower-cascade replacing hair". MULTI-SPECIES + COLOR-THEMED. Output as a NUMBERED list, one per line.`,
  },

  // ─── flower-fairy DNA: fairy_creature (unified mythic-fae description) ───
  faebot_flower_fairy_fairy_creature: {
    format: 'simple',
    theme: `MYTHIC FLOWER-FAIRY CREATURES for the FaeBot flower-fairy path. Each entry is ONE unified mythic-fae creature description — 50-90 words per entry — combining ethnicity-essence + skin-glow + hair + fae-features + plant-merged details + magical signature. NEVER a human-model description. ALWAYS an otherworldly fae being.

⚠️ MANDATORY FEATURES per entry (stack these):
  • Race/ethnicity essence (European-fae / Mediterranean-fae / Latin-American-fae / Asian-fae / African-American-fae — distribute evenly across all 5)
  • Luminous fae-glowing skin (specify tone: porcelain-glowing / olive-glowing / amber-glowing / pearl-glowing / bronze-glowing / etc.)
  • Delicate pointed elf-ears (always — defining fae feature)
  • Subtle fae markings (luminescent runes / golden tattoo-traces / petal-pattern markings on cheekbones, brow, or collarbone)
  • Hair (color + texture + length) integrated with floral elements
  • Large stylized expressive jewel-tone eyes (color varies)
  • Plant-merged feature (vines threaded through hair / leaf-cluster crown / bloom-petals growing from temples / mossy-skin patches / glowing pollen on cheekbones)
  • Magical signature (visible glowing veins / sparkle-dust on skin / firefly-glow around her / luminescent freckles)

🚫 STRICT BANS:
  • NO "10/10 stunning beauty" / NO model-language / NO magazine-cover / NO Pinterest beauty
  • NO realistic-skin-texture / NO photoreal-pore description
  • NO sexual / suggestive language
  • NO modern / human / mundane references

✓ MOOD: peaceful confident at-home-in-her-wildness. She is a magical garden-creature, calm and wondrous.

Channel: Brian Froud fae paintings + Pre-Raphaelite Persephone / Flora / Spring Goddess oil paintings + Alphonse Mucha art-nouveau fairy panels + Disney Tinker Bell × Tolkien elf-queen lineage. Diverse ethnicities + diverse hair colors + diverse magical signatures.

Each entry 50-90 words.`,
    touchpoints: [
      'EUROPEAN FLOWER-FAIRY with luminous porcelain-glowing skin and subtle golden fae-markings tracing her cheekbones, long platinum-blonde waves cascading with tiny baby-breath woven through, delicate pointed elf-ears, large stylized violet-jewel eyes with star-shaped catchlights, soft sparkle-dust drifting from her temples, calm wondrous expression, mythic Pre-Raphaelite fae register',
      'MEDITERRANEAN FLOWER-FAIRY with luminous olive-toast-glowing skin and copper fae-markings on her brow, long auburn curly hair cascading with rosebuds woven through, delicate pointed elf-ears, large stylized hazel-amber eyes with multiple catchlights, faint glowing pollen dusting her shoulders, wild confident garden-creature presence',
      'LATIN AMERICAN FLOWER-FAIRY with luminous warm-amber-glowing skin and bronze fae-markings tracing her collarbone, long dark-brown wavy hair with cosmos-blooms woven throughout, delicate pointed elf-ears, large stylized chocolate-amber eyes with sparkle-glow, faint glowing veins under her skin pulsing gently, mythic-creature beauty in candid moment',
      'ASIAN FLOWER-FAIRY with luminous pearl-white-glowing skin and silver fae-markings on her temples, sleek jet-black long-wavy hair with cherry-blossom petals tucked throughout, delicate pointed elf-ears, large stylized violet-jewel eyes with multiple star-catchlights, soft firefly-glow halo around her body, otherworldly serene fae presence',
      'AFRICAN AMERICAN FLOWER-FAIRY with luminous deep-bronze-and-gold-glowing skin and gold fae-markings tracing her cheekbones and brow, long box-braids with foxglove-and-lily-of-the-valley woven through every braid, delicate pointed elf-ears, large stylized emerald-green eyes with golden inner glow, regal at-home-in-her-wildness presence',
      'EUROPEAN FAE with porcelain-glowing skin tinted soft rose, long honey-blonde voluminous curls with daisies + cosmos + wildflowers woven throughout, pointed elf-ears, large stylized sky-blue eyes with crystal catchlights, faint glow-vines pulsing under her wrists and collarbone, dreamy wondrous garden-being',
      'MEDITERRANEAN FAE with warm-olive-glowing skin and amber fae-markings on her cheeks, long chestnut wavy hair with rose-and-jasmine woven through, pointed elf-ears, large stylized hazel-green eyes with golden flecks, soft glowing pollen dusting her shoulders and arms, wild garden-spirit at-home in bloom-meadow',
      'BRAZILIAN FAE with golden-brown-glowing skin and bronze fae-markings tracing her temples, long voluminous dark-brown curls with bird-of-paradise + tropical orchid woven through, pointed elf-ears, large stylized chocolate-brown eyes with amber glow, soft firefly-cloud around her, tropical sun-fae presence',
      'KOREAN FAE with luminous pearl-fair skin and silver fae-markings on her cheekbones, sleek straight black hair with cherry-blossom petals scattered throughout, pointed elf-ears, large stylized doe-brown eyes with pink-glow catchlights, soft silver pollen-dust drifting around her, ethereal moon-fae serenity',
      'PERSIAN FAE with luminous warm-olive-amber-glowing skin and gold fae-markings under her brow, long dark wavy hair with sweet-pea + lilac woven through, pointed elf-ears, large stylized amber-jewel eyes with depth and sparkle, faint glowing pulse-lines visible on her temples, wild romantic fae spirit',
      'WEST AFRICAN FAE with luminous deep-ebony-and-gold-glowing skin and gold fae-markings tracing her cheekbones, intricate cornrow braids with jasmine-cascade woven throughout, pointed elf-ears, large stylized amber eyes with golden inner light, regal magical-creature beauty',
      'POLYNESIAN FAE with luminous golden-tan-glowing skin and white-pearl fae-markings on her brow, long jet-black wavy hair with plumeria-and-tiare woven through, pointed elf-ears, large stylized chocolate-amber eyes with sparkle catchlights, soft pearl-glow halo around her, tropical island-fae serenity',
      'SCANDINAVIAN FAE with porcelain-fair-glowing skin and pale-silver fae-markings on her temples, long wheat-blonde braided hair with forget-me-nots + bluebells woven through, pointed elf-ears, large stylized ice-blue eyes with crystal catchlights, faint silver glow-veins under her skin, cool moonlit-fae register',
      'INDIAN FAE with luminous caramel-glowing skin and gold fae-markings on her forehead (subtle henna-style), long wavy black hair with marigold + jasmine + rose woven throughout, pointed elf-ears, large stylized warm-amber eyes with depth, soft golden glow-veins under her skin, regal jewel-fae spirit',
      'IRISH FAE with pale-rose-glowing skin and faint freckles + green fae-markings on her cheeks, long red-copper curls with bluebells + wild violets + clover woven through, pointed elf-ears, large stylized emerald-green eyes with golden inner glow, soft firefly-cloud around her, wild-meadow-fae presence',
      'ETHIOPIAN FAE with luminous medium-brown-glowing skin and gold fae-markings tracing her brow, tall slender stature, long dark hair in braided crown with star-shaped white-jasmine woven through, pointed elf-ears, large stylized golden-amber eyes with star catchlights, soft glow-vines pulsing on her arms',
      'FILIPINO FAE with luminous golden-tan-glowing skin and copper fae-markings on her cheekbones, long dark-brown wavy hair with sampaguita + ylang-ylang + frangipani woven through, pointed elf-ears, large stylized chocolate-brown eyes with warm catchlights, faint glowing pollen dusting her, tropical garden-fae',
      'GREEK FAE with olive-glowing skin and bronze fae-markings on her cheeks, long chestnut waves with daphne + olive-blossom + crocus woven through, pointed elf-ears, large stylized warm-hazel eyes with golden glow, soft glow-veins under her wrists, classical garden-fae presence',
      'EGYPTIAN FAE with warm-olive-amber-glowing skin and gold fae-markings tracing her almond-shaped eyes (Cleopatra-style), long dark hair in elegant updo with lotus + papyrus woven through, pointed elf-ears, large stylized dark-amber eyes with gold inner light, regal desert-bloom fae spirit',
      'INDONESIAN FAE with luminous golden-tan-glowing skin and pearl fae-markings on her temples, long dark wavy hair with tiare + hibiscus + plumeria woven through, pointed elf-ears, large stylized warm-brown eyes with soft pink-glow catchlights, gentle firefly-cloud around her, tropical-island fae',
      'AFRICAN AMERICAN FAE with luminous medium-brown-glowing skin and copper fae-markings on her cheekbones, voluminous afro curls with peonies + dahlias + roses woven throughout, pointed elf-ears, large stylized amber eyes with golden glow, soft pollen-dust drifting around her, regal magical-creature beauty',
      'NIGERIAN FAE with luminous deep-ebony-glowing skin and gold fae-markings tracing her cheekbones and brow, intricate locs cascading with hibiscus + bird-of-paradise + tropical orchids woven through, pointed elf-ears, large stylized golden-amber eyes with star catchlights, regal warrior-fae spirit',
      'MEXICAN FAE with luminous warm-tan-glowing skin and copper fae-markings on her cheeks, long dark-brown wavy hair with marigold + dahlia + cosmos woven throughout, pointed elf-ears, large stylized chocolate-brown eyes with warm catchlights, soft glow-veins on her temples, sun-warmed fae spirit',
      'JAPANESE FAE with luminous pearl-pale-glowing skin and silver fae-markings on her cheeks, sleek long black hair in elegant flowing updo with cherry-blossom petals woven throughout, pointed elf-ears, large stylized violet-jewel eyes with star catchlights, soft sparkle-dust drifting around her, ethereal sakura-fae serenity',
      'PUERTO RICAN FAE with luminous golden-tan-glowing skin and amber fae-markings on her brow, long dark wavy hair with hibiscus + bougainvillea woven through, pointed elf-ears, large stylized warm-amber eyes with sunset-glow catchlights, faint glowing veins under her wrists, tropical fae spirit',
      'NORTHERN EUROPEAN FAE with porcelain-fair-glowing skin and pale-blue fae-markings on her temples, long platinum-blonde waves with snowdrops + lily-of-the-valley woven through, pointed elf-ears, large stylized cornflower-blue eyes with silver catchlights, faint silver glow-mist around her, ethereal winter-spring fae',
      'MAORI FAE with warm-golden-brown-glowing skin and bronze fae-markings tracing her cheekbones in subtle traditional pattern, long dark wavy hair with kowhai-blossom + harakeke woven through, pointed elf-ears, large stylized dark-brown eyes with copper catchlights, soft glow-pollen drifting around her',
      'EUROPEAN FAIRY with porcelain-glowing skin and rose fae-markings on her cheeks, long flowing red waves with garden-rose petals woven throughout, pointed elf-ears, large stylized emerald-green eyes with crystal catchlights, faint glow-vines pulsing on her temples, wild rose-garden fae spirit',
      'ASIAN FAIRY with luminous pale-fair skin and pearl fae-markings on her temples, sleek long black hair half-up with peony-blooms woven through, pointed elf-ears, large stylized aqua-blue eyes with sparkle catchlights, soft pearl-pollen drifting around her, lake-fae serenity',
      'AFRICAN AMERICAN FAIRY with luminous bronze-and-gold-glowing skin and gold fae-markings on her cheekbones, long box-braids with hibiscus + tropical orchid + plumeria woven through every braid, pointed elf-ears, large stylized amber-and-gold eyes with star catchlights, regal tropical-fae presence',
      'LATIN AMERICAN FAIRY with luminous golden-tan-glowing skin and bronze fae-markings on her temples, long voluminous dark-brown curls with bougainvillea + hibiscus woven through, pointed elf-ears, large stylized warm-amber eyes with sunset-glow, faint glowing pulse-veins on her wrists, vibrant garden-fae',
    ],
    instructions: `Each entry is ONE MYTHIC FLOWER-FAIRY CREATURE unified description, 50-90 words. Format: "ETHNIC ESSENCE CAPS + features: skin glow + fae markings + hair + elf-ears + eyes + plant-merge + magical signature, all woven into one paragraph". DISTRIBUTE across all 5 races (European / Mediterranean / Latin American / Asian / African American). ALWAYS pointed elf-ears, ALWAYS luminous fae-glowing skin, ALWAYS fae markings, ALWAYS magical signature. NEVER human-model language. Output as a NUMBERED list, one per line.`,
  },

  // ─── flower-fairy DNA: floral_attire (organic flower-woven natural attire) ───
  faebot_flower_fairy_floral_attire: {
    format: 'simple',
    theme: `ORGANIC FLOWER-WOVEN FAIRY ATTIRE for the FaeBot flower-fairy path. NOT couture, NOT designer, NOT fashion — ORGANIC fae-grown attire where flowers + vines + leaves + petals weave around her body as if she GREW them from her own skin. Each entry 30-60 words.

⚠️ MANDATORY:
  • ORGANIC / NATURAL / FAE-GROWN — never "couture gown" / never "designer dress"
  • Lush abundant flower coverage — same volume as bloom-spirit but described as natural-organic
  • COLOR-THEMED (sunset / twilight / blush / monochrome / rainbow / etc.)
  • MULTI-SPECIES flowers woven together

🚫 STRICT BANS:
  • NO "couture" / NO "designer" / NO "fashion" / NO "magazine-cover gown"
  • NO mention of hair (hair is in fairy_creature)
  • NO single-species attire

✓ FORMS to vary:
  Petal-dress (made of overlapping petals like scales) | Vine-bodice + cascading petal-skirt | Bloom-cluster gown grown from her body | Leaf-and-vine garment with bloom accents | Floral-cape draped from shoulders | Bloom-tutu / petal-skirt | Flowing organic-floral wraps | Vine-corset with bloom-skirt | Petal-cascade gown grown from waist

Channel: Brian Froud fae attire + Pre-Raphaelite Flora + Mucha art-nouveau flower-women + Disney Tinker Bell organic-leaf-dress × × Pre-Raphaelite Persephone.`,
    touchpoints: [
      'ORGANIC SUNSET PETAL-CASCADE attire — flower-and-petal garment that has GROWN naturally from her body in sunset-colors of red roses + coral peonies + orange ranunculus + golden marigolds, layers of overlapping petals draping like a natural fae-gown from shoulder to bare feet',
      'TWILIGHT VINE-AND-BLOOM ATTIRE — lavender + violet wisteria vines woven across her torso into a bodice + cascading purple iris + bluebell petals forming a skirt, organic fae-grown floral wrap',
      'BLUSH PETAL-DRESS — soft pink peony + blush rose + cream ranunculus + ivory jasmine + pale-blush cabbage rose petals overlapping like scales forming an organic gown that flows around her',
      'MONOCHROME WHITE BLOOM-WRAP — white roses + cream gardenias + ivory peonies + pearl-white jasmine grown together as a flowing fae-wrap, ethereal snow-white organic attire',
      'RAINBOW WILDFLOWER GARMENT — red poppies + orange marigolds + yellow daisies + green hellebore + blue cornflowers + purple anemones woven naturally around her body, rainbow wildflower fae-attire',
      'CORAL TROPICAL FAE-DRESS — coral peonies + peach roses + apricot ranunculus + warm sunset dahlias + golden marigolds growing organically around her in cascading tropical layers',
      'BURGUNDY WINE BLOOM-CASCADE — burgundy dahlias + plum cosmos + maroon roses + dark-crimson ranunculus + black-purple calla petals draping naturally as a wine-spectrum fae attire',
      'GOLD AMBER COPPER LEAF-GARMENT — golden marigolds + amber rudbeckia + copper dahlias + warm yellow daisies + bronze chrysanthemums woven naturally as a metallic fae-attire',
      'OCEAN COOL BLOOM-WRAP — aqua hydrangeas + teal sea-holly + ice-blue forget-me-nots + seafoam hellebore + pearl-white roses cascading naturally as a cool ocean fae-attire',
      'EMERALD FOREST VINE-AND-LEAF GARMENT — green hellebore + leaves + pale-yellow primrose + lavender sweet-pea + emerald succulents woven naturally around her as forest-fae attire',
      'PASTEL CANDY PETAL-WRAP — pastel pink + lilac + mint + butter-yellow + sky-blue tiny blooms grown together as an organic candy-cotton fae-attire',
      'TROPICAL BOLD BLOOM-CLOTH — hot pink hibiscus + tropical orange marigolds + magenta bougainvillea + bright yellow plumeria + saturated coral ginger growing organically around her',
      'AUTUMN HARVEST BLOOM-DRAPE — rust chrysanthemums + russet dahlias + ochre marigolds + burnt-orange roses + ruby-wine cosmos in autumn organic-attire cascade',
      'BLUE + WHITE COASTAL BLOOM-WRAP — sky-blue hydrangeas + white roses + ice-blue forget-me-nots + pearl-white jasmine + soft cornflower-blue growing naturally around her',
      'PINK + GOLD ROMANTIC PETAL-GROWTH — soft pink garden roses + gold-amber ranunculus + cream peonies + pale rose-gold dahlias + pearl-pink sweet-pea organically draping her body',
      'VIOLET + CREAM ETHEREAL PETAL-CASCADE — violet iris + cream-white roses + lavender peonies + pearl-white anemones + soft violet sweet-pea growing as fae-attire',
      'CHERRY-BLOSSOM PETAL-DRESS — pink and white cherry blossom petals overlapping in scale-like layers forming an organic fae-gown grown from her body',
      'YELLOW MEADOW SUN-CLOTH — yellow daisies + golden marigolds + butter-yellow ranunculus + cream-yellow daffodils + sunshine chrysanthemums woven naturally as sun-fae attire',
      'LILAC + BABY-BLUE SPRING WRAP — lilac + baby-blue + pale-lavender + soft periwinkle + sky-blue forget-me-nots grown as an organic spring-fae attire',
      'TEAL + ROSE-GOLD VINTAGE BLOOM-ATTIRE — teal hydrangeas + rose-gold dahlias + dusty-pink roses + warm copper ranunculus + cream-white peonies organically woven around her',
      'BLACK ROSE + WHITE GOTH PETAL-WRAP — dark-burgundy black-roses + white roses + deep-violet anemones + ivory gardenias + pearl-pink hellebore organically draping her',
      'PEACH + CREAM SOFT BLOOM-ROBE — peach garden roses + cream peonies + soft apricot ranunculus + pearl-white jasmine + warm-cream camellias as a gentle fae-attire',
      'MAGENTA + ORANGE BOLD GROWTH — hot magenta dahlias + bright orange marigolds + fuchsia peonies + coral ranunculus + saturated tropical bougainvillea organically woven',
      'COOL MINT + WHITE FRESH ATTIRE — mint-green hellebore + white roses + pale-green succulents + ivory jasmine + soft seafoam ranunculus growing naturally around her',
      'BUTTER YELLOW + BLUSH SOFT CLOTH — butter-yellow daisies + blush garden roses + cream-yellow ranunculus + soft pink peonies + pearl-yellow chrysanthemums organically draping',
      'INDIGO + VIOLET DEEP WRAP — indigo irises + violet wisteria + deep-purple anemones + dark-violet sweet-pea + plum dahlias growing as deep-purple fae attire',
      'ORANGE + CORAL TROPICAL ROBE — bright orange marigolds + coral hibiscus + tropical-peach plumeria + warm orange-yellow ranunculus + sunset bougainvillea organically grown',
      'BLUSH + DUSTY-PINK ROMANCE WRAP — soft blush garden roses + dusty-pink peonies + pale pink ranunculus + cream-blush cabbage roses + baby-pink sweet-pea organically draping',
      'AMBER + COPPER METALLIC GROWTH — amber dahlias + copper-orange chrysanthemums + warm-bronze ranunculus + gold-amber marigolds + russet roses woven naturally around her',
      'IRIDESCENT FAIRY PASTEL ATTIRE — iridescent pastel mix of mint + lavender + baby-blue + cream-yellow + pearl-pink organic blooms growing as ethereal fairy-cascade attire',
    ],
    instructions: `Each entry is ONE ORGANIC FLOWER-WOVEN FAE ATTIRE, 30-60 words. Format: "COLOR-THEME NAME CAPS — fae-attire form + 3-6 named flower species in color theme + organic-growing description". MULTI-SPECIES + COLOR-THEMED + ORGANIC (never couture). NEVER mention hair. Output as a NUMBERED list, one per line.`,
  },

  // ─── flower-fairy DNA: candid_action (candid mid-action fae moments) ───
  faebot_flower_fairy_candid_action: {
    format: 'simple',
    theme: `CANDID MID-ACTION FAIRY MOMENTS for the FaeBot flower-fairy path. Each entry is ONE specific candid caught-on-camera moment of a flower-fairy at peace in her garden. Each entry 15-30 words.

⚠️ MANDATORY — every action is GENTLE / PEACEFUL / WONDROUS / MAGICAL. NEVER posing for camera. NEVER direct eye-contact. Caught-on-camera-candid feel.

🚫 STRICT BANS:
  • NO posing / NO modeling / NO direct eye-contact
  • NO violence / NO conflict
  • NO sexualized actions

✓ MOMENT TYPES:
  • Bloom-interaction (cupping nectar, weaving petal-spell, sipping dew, kissing petal)
  • Movement (dancing through petals, twirling barefoot, walking through meadow, leaping over a stream)
  • Stillness (lounging in petals, seated on stone, resting against tree, peeking from behind blooms)
  • Conversation with garden-life (whispering to butterfly, listening to a flower, watching a firefly, smiling at a bee)
  • Spell-casting (palms cupping glowing pollen, fingers tracing magical sigil, conjuring petal-storm)
  • Discovery (reaching for a bloom, gazing at glow-pollen, examining a leaf, gently touching dew)`,
    touchpoints: [
      'dancing barefoot through a meadow of petals, hair flowing behind her, wings spread for balance, eyes lowered to the ground in joyful focus',
      'cupping a small glowing pollen-cloud in her palms, head tilted down to watch it pulse, soft smile, eyes lowered to her hands',
      'reaching toward a hanging bloom with one delicate finger, body curved with the motion, wings partially spread, face in soft profile',
      'seated on a mossy stone weaving a flower-spell with her fingers, eyes on her work, hair falling forward, candid quiet moment',
      'lounging on a bed of fallen petals, body relaxed and reclined, one hand trailing in the petals, eyes on a butterfly nearby',
      'twirling mid-spin with floral skirt swirling outward, wings spread wide, hair and petals trailing in motion, candid joyful moment',
      'whispering to a small bird perched on her wrist, head tilted toward it, smile of recognition, eyes meeting the bird not viewer',
      'kneeling beside a bloom-cluster, head bent close as if smelling them, hair cascading forward, candid peaceful moment',
      'walking through a wisteria-tunnel, head turned to watch the hanging blossoms, body half-profile, wings folded behind her',
      'tracing a magical sigil in the air with one finger, glowing trail following the motion, eyes on her finger-tip not viewer',
      'leaping over a small garden-stream mid-motion, body airborne, wings flared, hair streaming, eyes ahead on her landing',
      'sipping dew from a flower-cup held in both hands, eyes downcast on the dew, lips lightly touching the petal-rim, peaceful moment',
      'peeking out from behind a bloom-cluster with one eye visible, playful candid moment, wings partially hidden by foliage',
      'gently touching a glowing firefly that has landed on her finger-tip, eyes on the firefly, wings still, soft wonder',
      'spinning in slow-motion through golden-hour glow, arms outstretched, head tilted back with eyes closed, ecstatic peaceful joy',
      'resting against a tree-trunk with one arm braced, gazing out into the deep garden, candid contemplative moment',
      'wading ankle-deep through a bloom-meadow, hand brushing the bloom-tops, body half-turned, wings catching back-light',
      'cradling a small forest-creature (mouse / chick / froglet) in her cupped palms, head bent toward it, smile of tenderness',
      'plucking a bloom and tucking it into her hair with one hand, body in soft three-quarter, eyes on the bloom not viewer',
      'spinning a single petal in mid-air with magical telekinesis, finger pointed toward it, eyes following the petals motion',
      'tipping her head back to laugh, eyes closed with the joy, wings spread wide, candid unselfconscious moment',
      'kneeling in a bloom-patch examining a glowing-vein leaf, finger-tip resting on it, completely absorbed in the moment',
      'walking through a soft falling petal-rain, head tilted up to feel them, wings partially open, candid peaceful moment',
      'crouching to plant a glowing seed in the soil, fingers gentle in the earth, eyes on the seed, candid ritual moment',
      'reaching up to pluck a hanging bloom from a vine, body stretched on tiptoes, candid graceful moment',
      'sitting cross-legged on a moss-patch with a butterfly resting on her knee, gazing at it with reverent attention',
      'leaning into a wisteria-cascade and pressing her face into the blooms, eyes closed in the fragrance, peaceful moment',
      'spinning a small petal-storm around her with magical gestures, wings spread, head turned within the petal-swirl',
      'wading through tall grass with bloom-stalks brushing her shoulders, hand trailing through the meadow-tops, candid moment',
      'kneeling beside a bubbling spring to whisper a fae-blessing over the water, hands cupped above the surface',
    ],
    instructions: `Each entry is ONE specific CANDID MID-ACTION MOMENT, 15-30 words. NEVER posing / NEVER direct eye-contact / always mid-motion or peaceful candid moment. Eyes elsewhere (lowered / on object / in profile / closed). Output as a NUMBERED list, one per line.`,
  },

  // ─── flower-fairy DNA: magical_signature (60%-gated visible magic) ───
  faebot_flower_fairy_magical_signature: {
    format: 'simple',
    theme: `MAGICAL SIGNATURES for the FaeBot flower-fairy path. Each entry is ONE specific visible magic element rendered near her — glowing pollen, sparkle-dust, firefly-cloud, etc. Each entry 15-30 words.`,
    touchpoints: [
      'soft glowing pollen-dust cloud floating around her shoulders in suspended sparkle-particles, gold-and-pearl glints catching the painted light',
      'small swarm of fireflies floating around her at twilight, dozens of green-pulse lights at every depth, magical glow',
      'soft luminous halo glow outlining her silhouette from behind, ethereal back-light creating a magical-aura',
      'petals raining down around her in slow-motion, individual petals suspended in the painted light',
      'glowing magical-vines pulsing softly on her arms and temples, faint luminescent pattern under her skin',
      'crystal-prism light fragments scattered across her wings from an off-frame magical source, rainbow-glints',
      'cloud of tiny butterflies fluttering around her in the soft painted air, dreamy swarm-detail',
      'visible magical sigil traced in glowing light in the air beside her, half-fading, candid spell-moment',
      'fine dewdrops on every petal and on her skin catching the light in glittering points',
      'soft moonbeam falling on her face from above, the rest of the scene in cool twilight blue',
      'warm fae-lantern glow from a nearby floating lantern catching one side of her face in amber',
      'small bumblebee or jewel-tone insect circling near her hand, wings caught mid-buzz in painted detail',
      'sparkle-dust scattered through her hair and across her wing-arc, individual glitter-points catching light',
      'single petal frozen mid-fall in front of her face in the foreground, motion-frozen painted detail',
      'soft ethereal mist drifting around her ankles, the upper body in clear painted detail',
      'single warm golden-hour fire-ray slanting from the upper-left across her face, jewel-tone glow on her cheek',
      'vast suspended magical-dust galaxy around her with thousands of tiny sparkle-points at every depth, dreamlike',
      'solitary white-moth perched on a bloom in her hair at night, wings translucent in moonlight',
      'aurora-like color-glow in the upper backdrop above her, ethereal magic-light register, painted',
      'glowing pollen-storm dispersing in side-light around her, golden particles catching the warm painted light',
      'fae-orb of soft warm light hovering near her shoulder, glowing softly like a captured firefly',
      'rainbow-shimmer iridescent magic-veil floating behind her wings, prismatic light-effect',
      'glowing vine-rune wrapping around her arm in a magical pattern, soft luminous trace',
      'small swirling tornado of petals beside her, magical motion suspended in the painted frame',
      'glowing pearl-mist halo around her wings, magical wing-glow catching the painted brushwork',
      'fae-light snowflakes (impossible-petal-snow) falling slowly around her, magical winter-spring fae-detail',
      'glowing magical bloom-bud opening in time-lapse near her hand, painted transformation moment',
      'small swarm of dragonflies hovering near her wings in jewel-tone iridescence, candid garden-life',
      'twin moons hanging in the painted sky behind her, magical fae-world atmosphere',
      'glow-vines snaking through the foreground around her body, painted magical detail',
    ],
    instructions: `Each entry is ONE specific MAGICAL SIGNATURE rendered visibly near the fairy, 15-30 words. Always magical / dreamy / soft / painted register. Output as a NUMBERED list, one per line.`,
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
