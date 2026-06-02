#!/usr/bin/env node
/**
 * Generate an OceanBot axis pool using Sonnet.
 *
 * Mirrors the gen-bloombot-pool.js / gen-mechbot-pool.js infrastructure:
 * signature-based dedup, --target iterative gen+dedup loop, append-mode
 * preservation of existing entries. Pool recipes are OceanBot-bespoke.
 *
 * 2026-06-01: Phase 1 ships ONLY the mermaid-myth path-bespoke pools + the
 * 3 universal pools used by every render (lighting / atmospheres /
 * scene_palettes). The other 12 path pools land in Phase 2 (parallel
 * agents). MVP-25 cap until Kevin signs off on quality.
 *
 * Usage:
 *   node scripts/gen-oceanbot-pool.js --pool mermaid_myth_mermaid_archetype --target 25
 *   node scripts/gen-oceanbot-pool.js --pool lighting --target 25
 *
 * Output: scripts/bots/oceanbot/seeds/<pool>.json
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
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '25'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────
// OceanBot-shared aesthetic vocabulary (used across all pool recipes)
// ─────────────────────────────────────────────────────────────────────────
//
// OceanBot's identity: BBC Blue Planet × Pre-Raphaelite oil painting ×
// Master and Commander. The OCEAN is the hero. Every entry should imply
// cinematic ocean atmosphere — caustic light, water-column depth, painterly
// register. The 4 mediums are hyperreal / render / canvas / illustration —
// so entries must work across photoreal AND painted-canvas contexts.
//
// Cross-bot lessons baked in (per feedback_*.md memory + playbook):
//   • NEVER use negation language inside entries — "no people / no fog"
//     LEAKS through Flux's CLIP and renders the banned word. Phrase
//     positively. Bans live only in DO-NOT-write sections of the meta-prompt.
//   • NEVER list multiple regions/biomes in one entry — Flux's tokenizer
//     attends to the first-named noun. "Atlantic or Pacific or Caribbean"
//     all render as Atlantic.
//   • MVP-25 cap — every pool targets 25 entries (Kevin's review-then-scale
//     rule). Don't target 200 until Kevin approves quality.
//   • Each entry should imply lush multi-tier ocean depth: foreground
//     element + midground anchor + atmospheric horizon.

// ─────────────────────────────────────────────────────────────────────────
// POOL RECIPES — OceanBot mermaid-myth + universal (2026-06-01)
// ─────────────────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // mermaid-myth path-bespoke pools (11)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  mermaid_myth_mermaid_archetype: {
    format: 'simple',
    theme: `TRADITIONAL ONE-TAIL MERMAID ARCHETYPES for OceanBot's mermaid-myth path. Each entry is ONE specific Pre-Raphaelite painted mermaid hero — WHO she is mid-myth. Each entry 18-30 words.

⚠️ MANDATORY ANATOMY — every entry implies a SINGLE FUSED FISH TAIL ending in ONE FLUKE. The mermaid is half-human upper body fused into one continuous scaled tail. Half-fish-half-human. NEVER name "legs / feet / two tails / split tail / Starbucks tail / siren-with-legs / woman wading on land / walking-on-shore". Use words like "her tail curled beneath her", "her fluke draped over the rock", "half-submerged from the waist down" — phrasing that BAKES IN the single-tail anatomy.

⚠️ PAINTED REGISTER — Pre-Raphaelite oil-painting aesthetic. Waterhouse / Rossetti / Burne-Jones / Bouguereau / Alma-Tadema / Frederic Leighton lineage. Classical-modest drapery (sea-silk wrap, kelp-strand sash, draped fabric, flowing wet linen, pearl-chain coverings) — beauty without nudity. Museum-grade painterly figure work. Not lewd, not anime-styled, not cartoonish, not photoreal-glamour.

✓ VARIETY MANDATE — distribute across these emotional ARCHETYPES (roughly 3 entries each):
  A. **SIREN / LURE** — singing into wind, mid-call, beckoning ship, mouth-open song mid-air
  B. **MOURNER / GRIEF** — head bowed over wrecked ship, tear on cheek, hand on drowned sailor's locket, watching empty horizon
  C. **GUARDIAN / KEEPER** — sea-witch protecting pearl, holding lantern aloft, watching reef, sea-temple priestess
  D. **LOVER / WAITING** — gazing toward a far ship, hand on heart, draped over moonlit rock waiting, salt-tear forming
  E. **HARBINGER / STORM-BRINGER** — arm raised commanding waves, hair whipping in storm wind, calling lightning
  F. **PEARL-DIVER / RECLAIMER** — surfacing with treasure, golden chain in hand, broken figurehead pulled from depths
  G. **ANCIENT / QUEEN** — coral-crown, draped in barnacle-encrusted regalia, throne of sea-stone, eternal patience
  H. **YOUNG / DREAMING** — combing hair on rocks, looking up at stars, half-asleep on driftwood, distant-eyed reverie

🚫 STRICT BANS (in DO-NOT section — never written into entries):
  • No nudity, no exposed nipples, no exposed crotch, no exposed buttocks — classical drapery or natural coverings always
  • No legs, no feet, no toes, no ankles, no two tails, no bifurcated tail, no split tail, no Starbucks-logo silhouette
  • No woman walking on land, no standing on shore, no wading from waist up only
  • No anime / chibi / cartoon / Disney register
  • No photoreal glamour / pinup / beach-photoshoot register
  • No people / boats / ships in the SAME entry as her — those come from other axes

Lineage to channel: John William Waterhouse (A Mermaid 1900, Lamia, The Siren), Frederic Leighton (Fisherman and Syren), Edward Burne-Jones (Sea Nymph paintings), Herbert James Draper (Ulysses and the Sirens), Bouguereau (sea-themed nymphs), Rossetti (water nymphs). Museum-grade painted oil register.`,
    touchpoints: [
      'SIREN MID-SONG — her head tilted back, mouth open in haunting call, dark hair streaming on sea-wind, tail curled around the basalt rock beneath her, throat exposed to moonlight',
      'MOURNER OVER WRECK — bowed over the splintered prow of a wreck, hand resting on drowned sailor\'s rusted locket, her fluke trailing through dark water, classical drapery wet against shoulders',
      'PEARL-KEEPER — cradling an immense glowing pearl against her chest, kelp-sash draped over one shoulder, tail half-submerged with scales catching lantern-glow from below',
      'STORM-HARBINGER — one arm raised commanding the rising sea, wet hair whipped sideways in gale, scaled tail anchored to a wave-battered stone, eyes locked on the dark horizon',
      'YOUNG DREAMER COMBING HAIR — perched on a moonlit sea-stone combing long wet hair with a shell, fluke folded neatly behind her, gaze distant toward stars above the water',
      'CORAL-CROWNED QUEEN — barnacle-encrusted regalia draped over shoulders, coral diadem set in tangled hair, her single tail coiled regally around an ancient throne-stone, eyes ancient',
      'SEA-WITCH WITH LANTERN — holding a fish-oil lantern aloft over still water, her painted-oil profile lit warm against fog-bank dark, tail submerged with fluke just breaking the surface',
      'WAITING LOVER ON MOONLIT ROCK — draped in flowing wet sea-silk, gazing toward a distant horizon with one hand pressed to her heart, her scaled tail hanging gracefully down the rock-face',
      'TEMPLE PRIESTESS — kneeling at a submerged altar-stone, kelp-sash and pearl-chain regalia, her tail folded reverently beneath, head bowed in painted-oil contemplation',
      'DROWNED-LOVE MOURNER — clutching a sodden carved wooden figurehead to her chest, salt-tear on her cheek, her single fluke draped over moss-slick driftwood, hair plastered with grief',
      'CALL-ACROSS-FOG SIREN — leaning forward from her sea-stone, one arm extended outward calling into rolling fog, her tail anchored behind, classical wet drapery clinging to her shoulders',
      'STAR-GAZING REVERIE — reclining on smooth water-polished basalt, head tilted up toward the night sky, her fluke trailing in shallow tide-pool water, painted-oil moonlight on bare arms',
      'WRECK-CLAIMING — surfacing through churning foam with a treasure-chest hauled half-out of dark water, scaled tail breaking the wave behind her, hair plastered to her cheek',
      'KELP-FOREST GUARDIAN — half-hidden among swaying kelp fronds, watching with steady gaze through the green submarine light, her fluke caught in a slow current behind her',
      'FOG-SURFACING — rising from grey fog-curtained water, only her upper body emerging into the painted-oil mist, hands cupped reverently, her tail unseen below the fog-line',
      'PHOSPHORESCENT BLOOM SIREN — drifting through a sea of glowing blue plankton, light catching the scales of her tail, painted-oil cool-blue chiaroscuro across her bare shoulders',
      'STORM-BRIDE — clinging to a tilted ship-mast in lashing rain, her scaled tail anchored against the wave-curl, hair sodden against her cheek, lightning illuminating her painted profile',
    ],
    instructions: `Each entry is ONE specific Pre-Raphaelite painted mermaid archetype, 18-30 words. Format: "ARCHETYPE NAME CAPS — body posture / hand position / gaze direction / tail-anatomy phrase / drapery". Vary across emotional categories. Always imply ONE single fused fish tail with one fluke. Always classical-modest drapery. NEVER name legs / feet / two-tails. NEVER name people / boats / ships IN THE SAME ENTRY (those axes are separate). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  mermaid_myth_tail_detail: {
    format: 'simple',
    theme: `MERMAID TAIL SCALE + FLUKE DETAILS for OceanBot's mermaid-myth path. Each entry is ONE specific painted-oil description of the mermaid's tail — its color, scale pattern, fluke shape, sheen, texture. Each entry 14-22 words.

⚠️ ANATOMY LOCK — every entry describes ONE SINGLE FUSED FISH TAIL ending in ONE FLUKE. ALWAYS singular: "her tail", "the tail", "her fluke", "the fluke". NEVER plural ("tails / flukes"), NEVER split ("two tails / bifurcated"), NEVER Starbucks-logo. The tail is one continuous scaled appendage from waist to a single fluke.

⚠️ PAINTED REGISTER — describe the tail as a Pre-Raphaelite painter would render it: visible brushwork, painted iridescence, glazed shadow, impasto highlights. NOT digital-rendered, NOT photoreal-fish, NOT cartoon-shiny.

✓ VARIETY — distribute across:
  A. COLOR (~6 entries): teal / emerald / sapphire / pearl / silver / copper / amethyst / obsidian / coral-pink / rose-gold / cobalt
  B. SCALE PATTERN (~5): tiny pinscale / overlapping ovate / mosaic / chainmail / pebble / fractal small-to-large / fish-leaf
  C. FLUKE SHAPE (~5): wide crescent / forked moon / spade / split-fin / paddle-broad / sweeping ribbon
  D. SHEEN / FINISH (~4): wet glistening / matte velvet / iridescent rainbow-shift / metallic burnished / pearl-glazed
  E. TEXTURE / DETAIL (~5): salt-crusted / barnacle-flecked / kelp-strand wrapped / coral-touched / scarred-veteran / age-mottled

🚫 BANS: no legs / feet / ankles / two tails / split-tail. No anime sparkle / Disney teal-rendered. Always painted-oil register, never photoreal-glamour.

Lineage: Waterhouse 1900 "A Mermaid" tail — burnished copper-bronze with painted highlights. Burne-Jones sea-nymph tails — emerald-and-teal Pre-Raphaelite glaze. Frederic Leighton — pearl-irridescent painted scales.`,
    touchpoints: [
      'deep emerald scales with painted iridescent glaze, broad crescent fluke sweeping wide, museum-grade brushwork visible in highlights',
      'burnished copper-bronze scales with impasto golden highlights, forked-moon fluke, wet sheen catching candlelit warm tones',
      'pearl-iridescent overlapping ovate scales shifting rose to silver, paddle-broad fluke, dewdrop wetness across painted surface',
      'cobalt-and-sapphire chainmail-pattern scales, sweeping ribbon-fluke trailing through water, Pre-Raphaelite oil-glaze brushwork',
      'rose-gold pinscale tail with painted blush undertones, split-fin fluke, salt-crystal flecks catching warm lamp-glow',
      'obsidian-black scales tipped with peacock-blue iridescence, wide spade-fluke, painted oil-glaze gleaming wet over museum-grade brushwork',
      'silver-and-pearl mosaic scales catching cool moonlight, forked crescent fluke, Pre-Raphaelite glazed translucent sheen',
      'amethyst-violet scales with copper edging, sweeping wide fluke, kelp-strand wrapped loosely around the upper tail',
      'teal-jade pebble-pattern scales, painted iridescent brushwork, broad paddle-fluke with translucent painted edge-glow',
      'coral-pink chainmail scales graduating to deep crimson at the fluke, painted oil-glaze with classical impasto highlights',
      'velvet-matte pewter scales scarred with old fishing-line marks, broad crescent fluke, age-veteran painted oil register',
      'barnacle-flecked deep-bronze scales with painted patina, paddle-broad fluke, salt-encrustation visible in highlights',
      'iridescent rainbow-shift scales swimming with painted hues from emerald through gold to violet, sweeping ribbon fluke',
      'pearl-glazed snow-white scales with palest blue undertones, forked-moon fluke, ethereal Pre-Raphaelite luminance',
      'fractal scale pattern small-to-large from waist to fluke, deep oceanic blue with painted highlights, wide crescent finish',
    ],
    instructions: `Each entry 14-22 words describing the painted-oil tail. Always singular ("her tail / the fluke"). Mix color + scale pattern + fluke shape + sheen + texture. Always Pre-Raphaelite painted register. NEVER plural / two-tails / split / legs / feet. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  mermaid_myth_ocean_setting: {
    format: 'simple',
    theme: `OCEAN SETTINGS for OceanBot mermaid-myth — WHERE the painted mermaid is mid-myth. Each entry is ONE specific location anchoring her scene. Each entry 18-28 words.

⚠️ ANATOMY-COMPATIBLE — every setting must accommodate a SINGLE-TAIL MERMAID half-submerged or perched. Pick locations where she can either: rest on a sea-stone with her tail half-in-water, drape over a wreck with her fluke trailing, breach from foam, surface through fog, or coil around an underwater throne. NEVER name "beach where she stands / shoreline she walks / cliff path / dunes she sits dry on" — settings must imply water around her.

⚠️ PAINTED REGISTER — Pre-Raphaelite seascape backdrop. Aivazovsky / Turner / Caspar David Friedrich / Bocklin (Isle of the Dead) lineage. Multi-tier depth: foreground tier (her perch/anchor) + midground (water surface, fog, rocks) + horizon (sky, distant land, weather).

✓ VARIETY — distribute across:
  A. SEA-STONE / TIDE-ROCK (~5) — moonlit basalt, wave-battered granite, water-polished pillar, lichen-mossed boulder, smooth pumice
  B. WRECK / RUIN (~4) — wave-eaten galleon prow, sunken figurehead, ribcage-hull, broken mast in shallows
  C. KELP / CORAL (~3) — kelp-forest glade, coral-shelf throne, anemone garden, sea-fan grove
  D. FOG / TIDE (~3) — fog-curtained tide-flat, rolling sea-mist bay, lantern-fog cove
  E. COVE / GROTTO (~3) — sea-cave mouth, hidden grotto pool, hollowed cliff-base
  F. STORM SEA (~3) — gale-tossed wave-crest, lightning-lit swell, hurricane-eye still water
  G. SHALLOW REEF (~2) — bioluminescent shallows, phosphorescent tide-pool
  H. ARCTIC / POLAR (~2) — iceberg-shadow water, polar-sea ice-edge

🚫 BANS: no beaches she stands on, no land paths, no city harbors with docks she's beside (the mermaid is OF the sea, not visiting it).

Lineage: Aivazovsky stormy-sea backdrops, Bocklin's painted island brooding, Caspar David Friedrich's foggy painted shores.`,
    touchpoints: [
      'MOONLIT BASALT SEA-STONE rising from glassy black tide, polished by centuries of wave, fog-bank rolling in the deep middle-distance, low silver sky beyond',
      'WAVE-EATEN GALLEON PROW jutting from shallow swell, splintered painted figurehead at the waterline, distant storm-cloud darkening the painted oil horizon',
      'KELP-FOREST GLADE rendered in painted submarine green, slow caustic light filtering down through canopy, towering kelp-stalks fading into depth-blue darkness',
      'FOG-CURTAINED COVE at dawn, glassy still water surrounded by mist-shrouded sea-cliffs, painted-oil grey-white luminance, distant lantern-glow on the rocks',
      'CORAL-SHELF THRONE on a sun-shaft reef, painted caustic-light dappling sand below, swirl of small silver fish in midground, blue depth fading to dark behind',
      'STORM-TOSSED WAVE-CREST under lightning-fractured black sky, painted Aivazovsky swell rising vast in foreground, distant ship struggling in deep middle-distance',
      'SUNKEN FIGUREHEAD-CARVED PROW resting on submarine sandbed, half-buried in pale sand, kelp-strands waving above, painted oil caustic-light dappling',
      'WATER-POLISHED PILLAR STONE in a hidden sea-cave grotto, painted aqua-light reflecting on dripping cave walls, mouth of cave opening to bright daylight',
      'PHOSPHORESCENT TIDE-POOL on basalt shelf at night, glowing cyan-blue plankton lighting the painted-oil shallow water, dark sea visible beyond',
      'HURRICANE-EYE STILL WATER ringed by towering storm-wall clouds, painted-oil oppressive light, glassy black sea reflecting the eye-circle above',
      'LICHEN-MOSSED SEA-BOULDER half-submerged in painted morning swell, golden Pre-Raphaelite light raking across mossy crown, distant cliffs in deep haze',
      'BIOLUMINESCENT SHALLOWS at midnight low-tide, painted cool-blue glow rising from the sand below, dark night sky meeting the dark sea on the horizon',
      'HOLLOWED CLIFF-BASE GROTTO with painted seawater pouring through a low arch, golden lantern-glow inside, breaking surf framing the cave-mouth',
      'BROKEN MAST IN SHALLOWS leaning at storm-bent angle, painted weathered timber, ropes still tangled, painted-oil sunset behind on the deep horizon',
      'ICEBERG-SHADOW WATER painted in glacial-cyan tones, towering iceberg face filling the painted-oil background, breath-cold mist curling on the surface',
    ],
    instructions: `Each entry is ONE ocean setting for a half-submerged or sea-perched single-tail mermaid, 18-28 words. Format: "SETTING NAME CAPS — primary anchor + midground water/fog + horizon/depth note". Vary across the 8 categories. Always water-accommodating (no dry beaches she stands on). Always Pre-Raphaelite / Aivazovsky / Bocklin painted-oil register. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  mermaid_myth_painterly_tradition: {
    format: 'simple',
    theme: `PAINTERLY TRADITION DIRECTIVES for OceanBot mermaid-myth. Each entry is ONE specific Pre-Raphaelite / Romantic / Symbolist painter lineage to channel. Each entry 14-24 words.

⚠️ MANDATORY — name an EXPLICIT painter or named painting tradition. This is the brushwork/palette/glaze register modifier. Flux's training has these painters by name and renders the right register when invoked.

✓ VARIETY — distribute across:
  A. PRE-RAPHAELITE BROTHERHOOD (~6) — John William Waterhouse, Dante Gabriel Rossetti, Edward Burne-Jones, Holman Hunt, John Everett Millais, Frederic Leighton
  B. NEOCLASSICAL ROMANTIC (~4) — William-Adolphe Bouguereau, Lawrence Alma-Tadema, Herbert Draper, Lord Frederic Leighton
  C. ROMANTIC MARINE (~3) — Ivan Aivazovsky, J.M.W. Turner, Caspar David Friedrich
  D. SYMBOLIST (~3) — Arnold Bocklin (Isle of the Dead), Gustave Moreau, Odilon Redon
  E. GENERIC MUSEUM-OIL (~2) — "19th-century museum-grade oil painting", "Pre-Raphaelite Brotherhood register"

🚫 BANS: no modern illustrator names (Boris Vallejo / Frazetta / Brom / Royo / Greg Rutkowski / Artgerm / WLOP). Mermaid-myth lineage is 1850-1910 European painted-oil tradition, NOT 1970s pulp-paperback fantasy.

Each entry should be USABLE as a direct lineage clause in a brief. Examples: "Waterhouse 1900 'A Mermaid' painted-oil tradition", "Pre-Raphaelite Brotherhood brushwork with classical glaze".`,
    touchpoints: [
      'John William Waterhouse 1900 "A Mermaid" painted-oil tradition, visible brushwork, classical glaze, museum-grade Pre-Raphaelite figure work',
      'Edward Burne-Jones sea-nymph painted-oil register, Pre-Raphaelite Brotherhood brushwork with emerald-and-amber palette',
      'Frederic Leighton "Fisherman and Syren" painted-oil tradition, classical drapery, warm lamp-glow lit figure',
      'Herbert James Draper "Ulysses and the Sirens" painted-oil register, dramatic Pre-Raphaelite figure painting',
      'Dante Gabriel Rossetti water-nymph painted-oil register, Pre-Raphaelite Brotherhood brushwork',
      'Holman Hunt Pre-Raphaelite Brotherhood painted-oil tradition, jewel-tone glazed brushwork',
      'William-Adolphe Bouguereau classical academic painted-oil register, smooth Pre-Raphaelite-adjacent figure work',
      'Lawrence Alma-Tadema neoclassical painted-oil register, marble-cool sea-themed figure work',
      'Ivan Aivazovsky 19th-century romantic sea painting tradition, painted-oil storm-light, museum-grade marine brushwork',
      'J.M.W. Turner Romantic painted-oil seascape register, atmospheric chiaroscuro, painted light dissolving into mist',
      'Caspar David Friedrich Romantic painted-oil tradition, brooding contemplative figure backed by atmospheric sea',
      'Arnold Bocklin "Isle of the Dead" painted-oil register, symbolist sea-painting brushwork, painted oppressive atmosphere',
      'Gustave Moreau symbolist painted-oil tradition, jewel-toned glazed brushwork, decadent painted figure work',
      'Odilon Redon symbolist painted-oil register, dreamy Pre-Raphaelite-adjacent brushwork',
      '19th-century European museum-grade painted-oil tradition, Pre-Raphaelite Brotherhood brushwork, classical glaze',
      'Pre-Raphaelite Brotherhood painted-oil register with classical Romantic figure-painting, museum-grade brushwork',
    ],
    instructions: `Each entry 14-24 words. Name an explicit painter, painting, or named tradition. Always 1850-1910 European painted-oil register. NEVER name modern pulp-fantasy illustrators (Frazetta / Vallejo / Brom). Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  mermaid_myth_lighting_pattern: {
    format: 'simple',
    theme: `LIGHTING PATTERNS for OceanBot mermaid-myth painted scenes. Each entry is ONE specific painted-oil lighting type rendering the mermaid figure. Each entry 14-22 words.

✓ VARIETY — distribute across:
  A. NATURAL DAYLIGHT (~4) — golden hour rake, blue hour hush, dawn coral wash, overcast cool diffuse
  B. NIGHT / MOON (~5) — moonlit silver wash, full-moon halo, crescent-moon faint blue, starlit cool, moon-through-cloud
  C. STORM / WEATHER (~3) — lightning flash, storm-break sun-shaft, painted-oil rainfall diffuse
  D. ARTIFICIAL / LANTERN (~3) — fish-oil lantern glow, ship-lantern from below, candlelit warm, distant lighthouse beam
  E. BIOLUMINESCENT / PHOSPHORESCENT (~3) — plankton-glow rising, jellyfish-light pooling, deep-sea creature-glow
  F. SUBMARINE CAUSTIC (~3) — sun-shaft caustic through water, dappled water-light, deep-blue diffuse
  G. CHIAROSCURO (~3) — strong rim-light against dark void, painted Caravaggio-cold contrast, painted candlelit half-shadow

🚫 BANS: no cinematic film-light language (key/fill/rim with three-point setup), no studio-strobe. This is PAINTED light — natural sources, atmospheric, oil-glaze rendered.

Each entry should be USABLE as a lighting clause in a brief, written as the painter would describe their light.`,
    touchpoints: [
      'low golden-hour rake across her wet shoulders, painted Pre-Raphaelite warm-amber chiaroscuro, deep cool shadow falling into ocean dark',
      'full-moon silver halo painting her bare arms cool-blue, painted-oil moonlight scattered across the water surface, deep shadow beyond',
      'lantern-glow from below the rock she perches on, warm painted amber lighting the underside of her chin, cool shadow above',
      'lightning-flash mid-strike illuminating her painted profile in stark Pre-Raphaelite cold-white, deep dramatic chiaroscuro across her tail',
      'submarine caustic sun-shaft dappling her tail through water, painted aqua-and-green light playing across scales, depth-dark beyond',
      'phosphorescent plankton-glow rising around her in painted cyan-blue, painted-oil cool light pooling on her shoulders and tail',
      'painted-oil dawn coral-wash across the horizon and onto her painted skin, warm pink-and-amber gradient lit upper body',
      'crescent-moon faint blue light painting her in painted-oil cool monochrome, silver edges and deep navy shadow throughout',
      'painted-oil overcast diffuse cool-grey light, no harsh shadows, soft Pre-Raphaelite even illumination across the figure',
      'candlelit warm painted chiaroscuro from a single fish-oil lantern at her hip, classical Caravaggio-cold dark behind her',
      'painted bioluminescent jellyfish-light pooling around her tail in soft cyan, painted-oil cool register, dark midnight water beyond',
      'storm-break sun-shaft piercing dark cloud and striking her shoulders in painted Pre-Raphaelite golden chiaroscuro',
      'starlit cool faint light, painted-oil deep night register, just enough silver to define her painted-figure silhouette',
      'distant lighthouse beam sweeping across her wet skin painting her in periodic Pre-Raphaelite painted-amber wash, dark between',
      'painted-oil blue-hour hush, last twilight gradient across the horizon, painted figure caught in cool silver-blue Pre-Raphaelite light',
    ],
    instructions: `Each entry 14-22 words describing PAINTED light on the mermaid figure. Pre-Raphaelite / Romantic / Symbolist oil-painting language. NEVER cinematic film-light terms (key/fill/rim). Always atmospheric natural-source painted light. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  mermaid_myth_foreground_element: {
    format: 'simple',
    theme: `FOREGROUND ELEMENTS for OceanBot mermaid-myth — ONE specific close-to-camera anchor in front of (or beside) the painted mermaid. Each entry 14-22 words.

⚠️ NOT THE MERMAID — these are things AROUND her, near the camera, framing the scene. The mermaid is the hero anchor; foreground is the close-tier of multi-tier depth.

✓ VARIETY — distribute across:
  A. NATURAL OCEAN (~6) — kelp fronds curling close, sea-foam burst, breaking wave-crest, drifting petals of sea-flowers, salt-spray catching light, churning bubbles
  B. SHELL / SEA-LIFE (~4) — strewn nautilus shells, scattered pearls, sea-glass, drifting jellyfish-bell, anemone clump, sand-dollar pile
  C. WRECK DEBRIS (~4) — rope-coil and chain, splintered ship-timber, drowned rusted helmet, smashed barrel, tattered painted oil-flag, broken figurehead-hand
  D. STONE / CORAL (~3) — moss-slick basalt, lichen-mottled rock face, coral cluster, water-polished pillar-stone, encrusted boulder
  E. WEATHER / ATMOSPHERIC (~3) — drifting fog-curl, rain droplets on wet rock, blowing salt-mist, light god-shaft striking foreground

🚫 BANS: no human figures, no animals as foreground (those are scale_provers separately). No words mentioning the mermaid herself.

Each entry should imply texture, painted-oil specificity, and contribute to multi-tier depth.`,
    touchpoints: [
      'curling kelp fronds drifting in the immediate foreground, painted Pre-Raphaelite emerald-and-bronze brushwork visible on each ribbon-leaf',
      'salt-spray burst captured mid-leap, painted-oil droplets catching golden warm light against the dark wet rock-face below',
      'scattered nautilus shells across moss-slick basalt in the close foreground, painted iridescent spirals and barnacle-flecks',
      'tangled rope-coil and rusted iron chain spilling from the foreground rock, painted-oil weathered texture, salt-encrusted',
      'drifting pearl strand caught on a foreground coral cluster, painted Pre-Raphaelite iridescent highlights, deep red coral beneath',
      'splintered ship-timber jutting from the wave-curl in the immediate foreground, painted-oil weathered brushwork, broken iron nails',
      'breaking wave-crest curling up close-to-camera, painted Aivazovsky white-foam crown against dark deep painted-oil water below',
      'churning foam-bubbles drifting close in the foreground, painted-oil pearlescent sphere-highlights against painted dark water',
      'drowned rusted ship-helmet half-buried in foreground sand, painted-oil patina, single barnacle adhered to crown, kelp-strand wrapping it',
      'water-polished pillar-stone with mossy crown in the immediate foreground, painted Pre-Raphaelite lichen-mottled brushwork, dripping wet',
      'drifting jellyfish-bell pulsing through the foreground water, painted Pre-Raphaelite translucent dome with trailing tentacles',
      'broken painted figurehead-hand resting in the foreground tide, splintered carved-wood fingers, painted-oil age-patina visible',
      'sea-glass shards strewn across painted wet basalt in the foreground, painted-oil reflective shards in cool blue and green',
      'crushed barrel-stave fragment with iron banding spilling from foreground rock-shelf, painted-oil weathered brushwork, painted wood-grain',
      'anemone clump on foreground tide-pool rock, painted-oil sea-anemone fronds spread, painted submarine micro-detail',
      'painted fog-curl drifting through the close foreground, soft Pre-Raphaelite atmospheric brushwork, partial wet-rock visible through mist',
      'painted god-shaft of warm light striking the foreground rock surface, painted-oil dramatic ray illuminating wet stone texture',
    ],
    instructions: `Each entry 14-22 words describing ONE close-tier foreground element. Painted Pre-Raphaelite oil register. Contributes to multi-tier depth. NEVER mention the mermaid herself or humans/animals. NEVER cinematic-photography terms. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  mermaid_myth_sea_phenomenon: {
    format: 'simple',
    theme: `SEA PHENOMENA / ATMOSPHERIC BACKGROUND EVENTS for OceanBot mermaid-myth. Each entry is ONE specific painted background event woven into the painted-oil seascape. Each entry 14-22 words.

⚠️ BACKGROUND TIER — these are DEEP-DISTANCE atmospheric events, NOT foreground (foreground_element is separate). They occupy the midground or horizon and add painted-oil mood.

✓ VARIETY — distribute across:
  A. STORM / LIGHTNING (~3) — distant lightning forking, lightning-flash on horizon, painted storm-wall, lightning-illuminated wave-crest
  B. SUN / WEATHER (~4) — painted sun-pillar through cloud-break, painted oil rainbow over distant swell, painted golden-hour sun on far horizon, dawn coral-wash on cloud-bank
  C. WAVE / SWELL (~3) — distant rogue-wave rising, painted Aivazovsky towering swell, breaking wave on far reef, churning whirlpool
  D. FOG / MIST (~3) — rolling fog-bank approaching, painted oil mist-curtain lifting, painted phantom-haze on horizon
  E. BIOLUMINESCENT (~3) — phosphorescent-glow rising in distant water, painted plankton bloom illuminating far sea, painted-oil red-tide bloom
  F. ATMOSPHERIC (~3) — painted oil aurora over polar horizon, painted moon-pillar reflected on sea, painted-oil sun-pillar at sunset
  G. NATURAL WONDER (~3) — distant whale-spout, painted breaching distant whale silhouette, painted spinner-dolphin pod leaping far away

🚫 BANS: no man-made ships/lighthouses (those are scale_provers separately). no foreground-close events.

Each entry should add painted-oil ATMOSPHERIC drama to the deep middle-distance or horizon.`,
    touchpoints: [
      'painted distant lightning forking across the storm-wall on the far horizon, painted-oil Pre-Raphaelite cold-white illumination, deep grey cloud receding',
      'painted sun-pillar piercing a break in the dark cloud-wall on the deep horizon, painted-oil golden ray striking the painted swell below',
      'painted-oil rolling fog-bank approaching from the deep horizon, painted Pre-Raphaelite cool grey-white mist-curtain consuming the painted distant sea',
      'distant rogue-wave rising vast in the painted middle-distance, painted Aivazovsky towering swell crowned with painted foam, dark hollow beneath',
      'painted phosphorescent plankton bloom illuminating the far swell in cyan-blue, painted-oil cool register, dark painted midnight sea around it',
      'painted-oil aurora rippling across the polar horizon, painted green-and-purple Pre-Raphaelite atmospheric brushwork, painted ice-edge sea below',
      'painted-oil dawn coral-wash on the cloud-bank above the painted horizon, painted Pre-Raphaelite pink-and-amber gradient melting into deep sea',
      'painted distant whale-spout rising from the deep middle-distance, painted-oil mist-plume visible against the painted horizon-line beyond',
      'painted breaching whale silhouette tiny in the painted middle-distance, painted-oil splash crown frozen mid-air, painted Aivazovsky brushwork',
      'painted-oil red-tide bloom staining the distant sea crimson, painted Pre-Raphaelite atmospheric murk, painted dark sky receding above',
      'painted whirlpool churning in the painted middle-distance, painted-oil dark vortex pulling at the painted surface, deep ominous brushwork',
      'painted oil rainbow arcing over the distant painted swell, painted Pre-Raphaelite delicate brushwork, painted storm-break sun on the horizon',
      'painted moon-pillar reflected on the still painted sea, painted-oil silver column stretching from the painted moon to the painted foreground edge',
      'painted spinner-dolphin pod leaping in the deep painted middle-distance, painted-oil splashes frozen mid-arc, painted joyful brushwork',
      'painted-oil sun-pillar at painted sunset, painted Pre-Raphaelite vertical golden column reflected on the painted glassy sea, painted dark headland silhouette',
    ],
    instructions: `Each entry 14-22 words describing ONE deep-distance painted-oil atmospheric phenomenon. Pre-Raphaelite / Aivazovsky / Turner register. NEVER man-made (lighthouses / ships — those are separate). NEVER foreground close-tier events. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  mermaid_myth_scale_provers: {
    format: 'simple',
    theme: `SCALE PROVERS for OceanBot mermaid-myth — small far-distance figures that prove the painted scene's scale and add narrative depth. Each entry 14-22 words.

⚠️ SCALE-PROVER ROLE — these are TINY in the deep middle-distance or horizon. They prove how vast the painted-oil seascape is by being small. NEVER close-foreground.

✓ VARIETY — distribute across:
  A. SHIPS (~5) — distant galleon silhouette, painted brig on horizon, sinking ship tiny in distance, far-off three-masted ship under sail, ghost-ship silhouette
  B. SEA-LIFE (~5) — distant dolphin pod, painted whale-back surfacing far away, gulls wheeling tiny against painted sky, distant seal head bobbing, painted petrel skimming
  C. LIGHTHOUSE / SHORE (~3) — painted lighthouse beam tiny on the deep horizon, painted shore-cliff silhouette, painted distant fishing village
  D. PEOPLE-FAR (~3) — painted distant fisherman in tiny boat, painted shipwrecked sailor tiny on far raft, painted distant figures on far shore
  E. ATMOSPHERIC (~4) — painted wheeling gulls in deep sky, painted school-of-fish silhouette far below water, painted distant kelp-floats, painted distant whale-fluke

🚫 BANS: no close-up figures, no foreground people, no animals close to the mermaid. ALWAYS tiny / silhouetted / deep-distance.

Each entry should imply painted-oil small-scale narrative element in the deep painted distance.`,
    touchpoints: [
      'painted tiny three-masted galleon silhouette on the deep horizon, painted Pre-Raphaelite ship-rigging visible as fine brushwork, painted full sail',
      'painted distant whale-back surfacing tiny in the painted middle-distance, painted spray-cloud just visible, painted Aivazovsky scale-mark',
      'painted wheeling gulls tiny in the painted upper sky, painted-oil V-shapes against the painted cloud-bank, scale anchors to the deep painted air',
      'painted shipwrecked sailor tiny on a painted broken-mast raft drifting on the painted deep middle-distance swell, painted Pre-Raphaelite mourning brushwork',
      'painted lighthouse beam tiny on the painted deep horizon-cliff, painted Pre-Raphaelite distant glow, painted dark headland silhouette below',
      'painted distant dolphin pod leaping in the painted deep middle-distance, painted-oil silver arcs frozen mid-leap, painted joyful brushwork',
      'painted ghost-ship silhouette half-translucent on the painted deep horizon, painted Pre-Raphaelite phantom rigging against the painted moonlit sky',
      'painted sinking ship tiny in the painted middle-distance, painted-oil bow tilted skyward, painted Pre-Raphaelite tragedy in distant scale',
      'painted distant brig on the painted dawn horizon, painted-oil silhouette under painted full sail, painted Pre-Raphaelite golden light upon her hull',
      'painted seal-head bobbing tiny in the painted middle-distance, painted-oil dark dome on the painted glassy water, painted Pre-Raphaelite small-life witness',
      'painted petrel skimming tiny over the painted distant swell, painted-oil silhouette against the painted bright horizon, painted Pre-Raphaelite small-scale brushwork',
      'painted distant fishing village silhouetted on the painted far shore, painted-oil cluster of cottages and one painted spire, painted Pre-Raphaelite scale-anchor',
      'painted school-of-fish silhouette far below in the painted submarine depths, painted-oil swirling cloud of tiny painted forms, painted scale-mark',
      'painted distant kelp-floats bobbing tiny on the painted far swell, painted-oil pale spheres against the painted dark water, painted small-scale anchor',
      'painted distant fisherman in painted tiny dory rowing across the painted middle-distance, painted-oil solitary figure, painted Pre-Raphaelite scale-anchor',
    ],
    instructions: `Each entry 14-22 words describing ONE tiny deep-distance scale-prover. Always FAR / TINY / silhouetted. Painted Pre-Raphaelite / Aivazovsky register. NEVER close-up or foreground. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  mermaid_myth_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING MANDATES for OceanBot mermaid-myth painted scenes. Each entry is ONE explicit composition instruction in painter's language — how the painted-oil viewer is positioned relative to the mermaid. Each entry 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the camera angle / framing as the LAW. This is how Pre-Raphaelite painters described their figure compositions. Examples: "LOW ANGLE looking up at her on her sea-stone", "THREE-QUARTER from sea-foam below", "WIDE PROFILE with horizon line".

⚠️ ALL CAMERA CHOICES MUST KEEP THE MERMAID READABLE — she's the painted hero. Either she fills 40-60% of frame OR she anchors a wider painted seascape. NEVER frame her as a tiny dot.

✓ VARIETY — distribute across:
  A. LOW-ANGLE / FROM-BELOW (~5) — viewer in surf below her stone, looking up; camera in sea-foam crouched; painted underwater looking up through wave-curl
  B. THREE-QUARTER PROFILE (~4) — painted-oil viewer at 3/4 from her side, classical figure pose; painted-oil viewer over her shoulder
  C. WIDE / ENVIRONMENTAL (~4) — painted wide profile with horizon line; painted distant view of her on stone with the seascape vast around her
  D. INTIMATE MID-DISTANCE (~3) — painted mid-shot at painter's eye-level; painted-oil close enough to read her painted face and gaze
  E. AERIAL / FROM-ABOVE (~2) — painted oil bird's-eye looking down at her on her stone, painted seascape spread below
  F. OVER-THE-SHOULDER (~2) — painted-oil from behind her looking toward distant horizon, her painted profile partial

🚫 BANS: NO modern cinema framing terms (dolly / dutch / tilt-up). Use painter's language. NEVER "selfie" / "POV". NEVER frames where she's invisible.

Each entry should be USABLE as a composition clause Flux honors faithfully.`,
    touchpoints: [
      'LOW ANGLE looking up at her on her sea-stone, painter\'s viewpoint at the surf-line below, heroic upward gaze, Pre-Raphaelite figure looming against sky',
      'THREE-QUARTER PROFILE from her right side, classical figure pose, painted-oil composition with the ocean horizon line crossing behind her shoulder',
      'WIDE ENVIRONMENTAL PROFILE with horizon line low in frame, the mermaid filling the left half, vast seascape extending to right and behind her',
      'INTIMATE MID-DISTANCE at painter\'s eye-level, close enough to read her facial expression, painted shoulders down to fluke visible in single frame',
      'AERIAL BIRD\'S-EYE from above looking down onto her sea-stone, seascape spread below her, ripple-rings of foam radiating around the rock for scale',
      'OVER-THE-SHOULDER from behind her, her hair and shoulder filling the close foreground, the distant horizon and any far ship receding into deep middle-distance',
      'LOW ANGLE FROM THE SURF below her stone, golden-hour rim-light on her shoulders, Pre-Raphaelite heroic angle, deep dramatic scale up the rock-face',
      'THREE-QUARTER FROM SEA-FOAM BELOW, heroic painter\'s angle, dramatic upward scale, classical Pre-Raphaelite figure-painting pose visible',
      'UNDERWATER LOOKING UP through wave-curl at her silhouette breaking the surface, submarine register, caustic light fracturing her painted outline',
      'WIDE PROFILE with distant horizon line, her painted figure filling the lower third, vast painted sky filling the upper two thirds',
      'INTIMATE FROM HER LEFT, painter close enough that her face dominates the canvas, painted-oil brushwork rendering her expression with museum specificity',
      'ENVIRONMENTAL ESTABLISHING SHOT — vast seascape with the mermaid one third in from the left, small but central as the painted-oil hero anchor',
      'CLOSE THREE-QUARTER capture of upper-body and waist-fluke transition, her face turned toward the viewer, classical Pre-Raphaelite painted-oil portrait scale',
      'LOW ANGLE FROM WAIST-DEEP SURF, dramatic upward perspective, painted Pre-Raphaelite hero-figure register, her shoulders cutting against the sky',
      'WIDE BIRD\'S-EYE LOOKING DOWN, her painted figure small but compositionally central, the seascape mostly water-surface with the rock as anchor-point',
    ],
    instructions: `Each entry 14-22 words. Painter's-language composition mandates. Always keep her readable. Vary across 6 framing categories. NEVER modern cinema terms / NEVER selfie / POV. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  mermaid_myth_surprise_element: {
    format: 'simple',
    theme: `SURPRISE ELEMENTS for OceanBot mermaid-myth — ONE unexpected painted detail that elevates the scene from generic-mermaid to specific-story. Each entry 14-22 words.

⚠️ STORY-INTRODUCING — these are the "WAIT, WHAT?" details that make the painted scene memorable. A drowned sailor's locket. A single rose floating. A tear catching light. They imply a backstory without explaining it.

✓ VARIETY — distribute across:
  A. HUMAN ARTIFACT / LOST LOVE (~5) — drowned sailor's locket in her hand, painted wedding ring tangled in her hair, painted broken music-box, painted miniature painted portrait drifting, painted love-letter dissolved
  B. NATURE / WILDLIFE (~4) — painted seabird perched on her shoulder, painted seal head looking at her from nearby water, painted jellyfish pulsing near her hand, painted painted-oil starfish on her tail
  C. EMOTIONAL (~3) — painted single salt-tear catching painted-oil light, painted-oil her hand pressed to painted heart, painted-oil hair plastered against painted cheek
  D. SYMBOLIC / MYTHIC (~4) — painted sea-glass spelling unreadable letters, painted single painted-oil rose floating near her, painted compass-needle painted spinning in her painted hand, painted painted-oil hourglass drifting
  E. ATMOSPHERIC (~3) — painted ghost-light hovering near her hand, painted phosphorescent jellyfish painted-oil glowing near her, painted-oil unexpected raven on a painted nearby rock

Each entry should imply painted-oil narrative depth — a story Flux can render specifically.`,
    touchpoints: [
      'a drowned sailor\'s rusted locket cradled in her hand, the miniature portrait inside still visible, Pre-Raphaelite mournful detail',
      'a single white seabird perched on her bare shoulder, painted with Pre-Raphaelite gull-detail, small-scale painted witness',
      'a single salt-tear catching moonlight on her cheek, Pre-Raphaelite emotional anchor, soft painted-oil brushwork on the wet streak',
      'a gold wedding ring tangled in her long wet hair, a faint glint visible against her cheek, painted-oil specificity',
      'a single red painted-oil rose floating in the shallow water near her hand, Pre-Raphaelite symbolic anchor',
      'a seal-head looking up at her from nearby water, dark dome eyes meeting hers, Pre-Raphaelite intimate gaze-exchange',
      'a phosphorescent jellyfish glowing near her hand, cyan-blue illumination spilling onto her painted palm',
      'a broken music-box drifting in the shallow water beside her, tarnished brass detail rendered in Pre-Raphaelite painted-oil',
      'sea-glass shards scattered around her, with faint half-readable letters etched into one of them, Pre-Raphaelite mystery anchor',
      'a small starfish clinging to the painted scales of her tail, Pre-Raphaelite small-scale detail',
      'a brass compass-needle spinning in her open palm, the cardinal markings rendered in painted-oil detail, cryptic narrative anchor',
      'an unexpected raven perched on a nearby rock, a dark sentinel detail, Pre-Raphaelite gothic anchor in the painted scene',
      'her own hand pressed to her heart in classical gesture, painted-oil wet drapery beneath, Pre-Raphaelite emotional anchor',
      'a miniature portrait drifting in the water near her, the face of a lost love visible through painted-oil wetness',
      'a faint ghost-light hovering near her hand, Pre-Raphaelite phantom glow, mysterious narrative anchor',
    ],
    instructions: `Each entry 14-22 words. Story-implying painted-oil detail. Pre-Raphaelite register. Implies backstory without spelling it out. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  mermaid_myth_drama: {
    format: 'simple',
    theme: `DRAMA LAYER — conditional painted-oil escalation woven SUBTLY into mermaid-myth scenes when the layer fires. Each entry 14-22 words describing ONE atmospheric dramatic shift.

⚠️ SUBTLE WEAVING — the drama layer fires at gate 0.5, meaning ~50% of renders get this on top. It's an ELEVATION not a replacement. Should COMBINE with the rest of the scene, not dominate.

✓ VARIETY — distribute across:
  A. WEATHER SHIFT (~4) — painted storm rising at her back, painted lightning fracturing distant sky, painted fog rolling in fast, painted dawn breaking through rain
  B. NARRATIVE EVENT (~4) — painted distant ship being claimed by painted leviathan tentacle, painted ghost-ship emerging from painted fog, painted phosphorescent surge rising painted, painted whale breaching far
  C. MAGICAL / MYTHIC (~3) — painted her song visible as painted-oil light-ribbons rising, painted second mermaid surfacing from painted-oil foam, painted ancient sea-god silhouette in deep distance
  D. EMOTIONAL ESCALATION (~3) — painted her painted-oil arm raised in painted invocation, painted painted-oil her painted-oil hair beginning to lift painted in supernatural wind, painted painted-oil her painted-oil tail beginning to glow
  E. ATMOSPHERIC INTENSITY (~3) — painted painted-oil all the sky turning painted-oil blood-red sunset, painted painted-oil aurora painted-oil intensifying above, painted painted-oil tide pulling back unnaturally far

Each entry should ADD painted-oil drama without breaking the painted-oil composition's hero (the mermaid).`,
    touchpoints: [
      'a storm rising at her back, the dark cloud-wall closing in, distant lightning forking, Aivazovsky drama escalating across the painted scene',
      'a distant ship being claimed by a leviathan tentacle, a vast dark form rising from the deep middle-distance, narrative threat anchored far',
      'her song made visible as pale light-ribbons rising from her throat into the painted sky, supernatural Pre-Raphaelite escalation',
      'a ghost-ship emerging from fog in the middle-distance, Pre-Raphaelite phantom hull, painted dread anchor far from her sea-stone',
      'an aurora intensifying above the polar horizon, green-and-purple supernatural ribbons rippling across the painted-oil sky',
      'a second mermaid surfacing from foam in the middle-distance, dark hair breaking the surface, painted Pre-Raphaelite companion-anchor',
      'the tide pulling back unnaturally far, dry seabed exposed in the middle-distance, painted dread before the impending wave',
      'her own arm raised in invocation, the sea responding around her with ripples spreading outward, painted-oil supernatural escalation',
      'all the sky turning blood-red at sunset, painted Aivazovsky ominous atmosphere, the seascape dipped in painted crimson',
      'a whale breaching far in the middle-distance, massive silhouette frozen mid-leap, painted-oil Pre-Raphaelite scale escalation',
      'an ancient sea-god silhouette in the deep distance, a bearded colossus half-visible through painted-oil storm-mist',
      'a phosphorescent surge rising around her, cyan-blue illumination intensifying through the painted water, magical Pre-Raphaelite glow',
      'her tail beginning to glow, painted scales emitting faint inner light, supernatural escalation captured in painted-oil',
      'fog rolling in fast from the deep middle-distance, Pre-Raphaelite mist-curtain closing in, threat anchored at the horizon',
      'her hair beginning to lift in supernatural wind, painted-oil escalation, the storm responding to her presence',
    ],
    instructions: `Each entry 14-22 words. Subtle painted-oil dramatic escalation. ADDS to the scene, doesn't dominate. Vary across weather / narrative / magical / emotional / atmospheric categories. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Universal pools (3) — shared across all 13 OceanBot paths
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  lighting: {
    format: 'simple',
    theme: `UNIVERSAL OCEAN LIGHTING modes for OceanBot. Each entry is ONE specific painted-or-photoreal lighting type used across any of OceanBot's 13 paths (deep-sea, polar, storm, mermaid, ghost-ship, pirates, etc.). Each entry 14-22 words.

⚠️ MEDIUM-AGNOSTIC — these work for hyperreal / render / canvas / illustration. Don't lock to one medium.

✓ VARIETY — distribute across (ocean-themed lighting types):
  A. SUBMARINE / UNDERWATER (~4) — caustic sun-shafts, dappled water-light, deep-blue diffuse, bioluminescent-glow
  B. SURFACE / DAYLIGHT (~4) — golden-hour rake, blue hour hush, dawn coral, overcast cool diffuse
  C. NIGHT / MOON (~4) — full-moon silver, crescent-moon faint blue, starlit cool, moon-through-cloud
  D. STORM / WEATHER (~3) — lightning flash, storm-break sun-shaft, painted-oil rainfall diffuse
  E. ARTIFICIAL (~3) — fish-oil lantern, ship-lantern glow, distant lighthouse beam
  F. POLAR / COLD (~3) — glacial-cyan diffuse, painted-oil aurora, low-sun amber on ice
  G. CHIAROSCURO (~3) — strong rim-light against dark void, painted candlelit, painted Caravaggio-cold contrast

Each entry should be USABLE as a lighting clause for any of the 13 OceanBot paths.`,
    touchpoints: [
      'submarine caustic sun-shafts dappling the water column, cool aqua-and-green light playing across surfaces, depth-dark falling away beyond',
      'low golden-hour rake across the ocean surface, warm-amber chiaroscuro, deep cool shadow extending into the painted distance',
      'full-moon silver halo painting everything cool-blue, scattered moonlight glinting across the painted water surface',
      'lightning-flash mid-strike, stark cold-white illumination, dramatic Pre-Raphaelite chiaroscuro carving deep shadow',
      'bioluminescent plankton-glow rising in cyan-blue, cool light pooling on the painted-oil surface, depth-dark beneath',
      'dawn coral-wash across the horizon, pink-and-amber gradient melting into the deep painted-oil sea',
      'overcast diffuse cool-grey light, no harsh shadows, even Pre-Raphaelite illumination throughout the scene',
      'fish-oil lantern warm chiaroscuro from a single source, classical Caravaggio-cold darkness in the surround',
      'glacial-cyan diffuse polar light, cool painted-oil register across ice-edge sea',
      'aurora rippling cool-green-and-purple across the polar scene, Pre-Raphaelite atmospheric brushwork',
      'distant lighthouse beam sweeping across wet surfaces, periodic warm-amber wash, dark intervals between sweeps',
      'starlit cool faint light, painted-oil deep night register, just enough silver to define silhouettes',
      'blue-hour hush, last twilight gradient across the horizon, cool silver-blue Pre-Raphaelite light',
      'storm-break sun-shaft piercing dark cloud, Pre-Raphaelite golden chiaroscuro stabbing through painted-oil darkness',
      'crescent-moon faint blue light, painted-oil cool monochrome, silver edges against deep navy shadow',
      'candlelit warm chiaroscuro from a single warm source, classical Caravaggio-cold darkness surrounding',
      'low-sun amber on polar ice, warm rake across glacial surface, painted-oil cold shadow extending into distance',
      'dappled water-light playing across upper surfaces, shifting bright-and-dark mosaic, Pre-Raphaelite atmospheric brushwork',
    ],
    instructions: `Each entry 14-22 words. Ocean-themed painted-or-photoreal lighting clause. Medium-agnostic. Vary across submarine / surface / night / storm / artificial / polar / chiaroscuro categories. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  atmospheres: {
    format: 'simple',
    theme: `UNIVERSAL OCEAN ATMOSPHERE modes for OceanBot. Each entry is ONE specific atmospheric register used across any of OceanBot's 13 paths. Each entry 14-22 words.

⚠️ MEDIUM-AGNOSTIC — works for hyperreal / render / canvas / illustration.

✓ VARIETY — distribute across:
  A. CLEAR / OPEN (~3) — crisp-clear painted air, painted-oil cathedral clarity, painted painted blue-bright daylight
  B. MIST / FOG (~5) — painted rolling fog-curtain, painted-oil sea-mist drift, painted painted phantom-haze, painted painted soft fog-curl, painted painted dawn-mist
  C. SALT / SPRAY (~3) — painted salt-mist drifting, painted spray-curtain, painted painted-oil salt-laden painted air
  D. STORM / WEATHER (~3) — painted storm-air dense, painted monsoon-humidity, painted painted heavy-pressure painted-oil air
  E. UNDERWATER (~3) — painted cathedral-stillness underwater, painted painted-oil submarine quiet, painted painted painted submerged calm
  F. ARCTIC / COLD (~3) — painted arctic-stillness, painted-oil glacier-breath, painted painted painted painted polar-hush
  G. PHOSPHORESCENT / MAGICAL (~2) — painted phosphorescent-haze, painted painted-oil glowing-air
  H. PAINTED-NIGHT (~2) — painted painted-oil night-warm-air, painted painted painted painted moonlit-cool

Each entry should be USABLE as an atmosphere clause for any OceanBot path.`,
    touchpoints: [
      'crisp-clear air with cathedral clarity, Pre-Raphaelite atmospheric brushwork, the distant horizon razor-sharp against the painted sky',
      'a rolling fog-curtain drifting across the scene, cool grey-white mist consuming the painted middle-distance',
      'painted-oil sea-mist drifting low across the water, Pre-Raphaelite soft atmospheric brushwork softening every horizon line',
      'salt-mist drifting through the air, briny texture-laden painted register, fine droplets catching the light',
      'storm-air dense and heavy, painted-oil heavy-pressure Aivazovsky register, the charged atmosphere before lightning',
      'cathedral-stillness underwater, submarine painted-oil quiet hush, light filtering down in slow shafts',
      'arctic-stillness, painted-oil glacier-breath cold-clear air, every breath visible against the polar painted scene',
      'a phantom-haze drifting between sea-stones, Pre-Raphaelite atmospheric softening, mysterious painted register',
      'painted-oil glacier-breath cold air, polar painted register, the breath of the ice itself visible',
      'a spray-curtain hanging in the air after a wave-break, painted-oil salt droplets suspended in the light',
      'monsoon-humidity heavy in the painted air, moisture-laden tropical register, the air thick with rain-pressure',
      'phosphorescent-haze suffusing the painted-oil cool air, faint glowing register from bioluminescent particles',
      'painted-oil night-warm-air, painted summer ocean-air register, soft and humid with painted moonlight',
      'dawn-mist drifting in painted-oil pale Pre-Raphaelite softness, the world half-revealed through painted veils',
      'glowing-air suffused with phosphorescent particles, painted-oil register where the very atmosphere holds magical light',
      'painted clear-blue daylight, painted-oil even diffusion, every wave-crest and ship-line carved with Pre-Raphaelite clarity',
      'salt-laden dawn air drifting across the painted ocean, painted-oil cool-warm gradient, fine mist catching first light',
      'painted Aivazovsky charged storm-air, oppressive painted-oil heaviness, the painted world holding its breath',
    ],
    instructions: `Each entry 14-22 words. Ocean-themed painted-or-photoreal atmosphere clause. Medium-agnostic. Vary across the 8 categories. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },

  scene_palettes: {
    format: 'simple',
    theme: `UNIVERSAL OCEAN COLOR PALETTES for OceanBot. Each entry is ONE specific cinematic-or-painted color palette used across any of OceanBot's 13 paths. Each entry 14-22 words.

⚠️ MEDIUM-AGNOSTIC — works for hyperreal / render / canvas / illustration.

✓ VARIETY — distribute across:
  A. WARM / SUNSET (~3) — golden-amber, copper-salmon sunset, painted-oil coral-pink dawn
  B. COOL / BLUE (~4) — abyssal-black-and-cyan, painted-oil cool teal, glacier-cyan-white, deep navy-and-silver
  C. STORM / DRAMATIC (~3) — Aivazovsky-storm-amber, painted-oil charcoal-and-gold, painted slate-and-silver
  D. PAINTERLY CLASSIC (~3) — Pre-Raphaelite mossy-jade, painted-oil burnished bronze, painted Burne-Jones emerald
  E. MONOCHROME (~2) — pewter-monochrome, painted-oil silver-tone
  F. BIOLUMINESCENT / MAGICAL (~3) — bioluminescent-cobalt-emerald, painted-oil phosphorescent-blue, painted painted-oil glowing-cyan-and-violet
  G. CINEMATIC (~2) — teal-and-orange cinematic, painted-oil painted Hollywood blockbuster register

Each entry should be USABLE as a palette clause for any OceanBot path.`,
    touchpoints: [
      'cinematic teal-and-orange palette, saturated cool-and-warm contrast, painted Hollywood blockbuster register',
      'abyssal-black-and-cyan palette, deep-sea register with bioluminescent cyan accents against the black void',
      'Aivazovsky-storm-amber palette, golden sun-break in the dark storm-cloud, Pre-Raphaelite drama through painted chiaroscuro',
      'Pre-Raphaelite mossy-jade palette, Burne-Jones emerald-and-amber, Pre-Raphaelite Brotherhood brushwork register',
      'polar-silver-blue palette, glacier-cyan with cool whites, painted-oil polar register',
      'sunset-coral-salmon palette, warm sky-gradient melting into the deep-ocean dark below',
      'monochrome-pewter palette, silver-tone painted Pre-Raphaelite register, classical brushwork',
      'glacier-cyan-white palette, cold polar light, painted-oil arctic register',
      'bioluminescent-cobalt-emerald palette, glowing-blue-and-green phosphorescent register against the painted-oil dark water',
      'burnished bronze palette, Pre-Raphaelite warm-amber painted-oil brushwork',
      'charcoal-and-gold palette, dramatic storm-light register, Aivazovsky chiaroscuro through painted scene',
      'deep navy-and-silver palette, moonlit painted register, Pre-Raphaelite cool-night brushwork',
      'coral-pink dawn palette, warm-gradient horizon melting into the deep painted sea',
      'slate-and-silver palette, overcast painted register, Pre-Raphaelite muted brushwork',
      'phosphorescent-blue palette, glowing-cool bioluminescent register, painted-oil cool light',
      'glowing-cyan-and-violet palette, magical phosphorescent painted-oil register',
      'golden-amber sunset palette, copper-and-salmon horizon, warm Pre-Raphaelite painted register',
      'painted Burne-Jones jade-and-bronze palette, Pre-Raphaelite Brotherhood emerald-tone register',
    ],
    instructions: `Each entry 14-22 words. Ocean-themed color palette clause. Medium-agnostic. Vary across the 7 categories. Output a NUMBERED list, one entry per line, NO internal newlines.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Infrastructure (copied verbatim from gen-bloombot-pool.js, adapted)
// ─────────────────────────────────────────────────────────────────────────

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

━━━ NO-NEGATION-LEAK MANDATE — GLOBAL, NON-NEGOTIABLE ━━━
NEVER write a banned word even to negate it — Flux's CLIP tokenizer ignores "no/not/never" and renders the banned word. Phrase positively. Banned content is only mentioned in the meta-prompt's DO-NOT section above, NEVER inside the entries you produce.

━━━ NO-MULTI-REGION-NAMING MANDATE — GLOBAL ━━━
NEVER list multiple regions / biomes / styles in one entry ("Mediterranean or Caribbean or Adriatic"). Flux attends to the first-named noun. Pick ONE region per entry.

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
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) =>
      e
        .replace(/^["']|["']$/g, '')
        .replace(/^[-•*]\s*/, '')
        .trim()
    )
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'with', 'of', 'in', 'on', 'at', 'to',
  'for', 'from', 'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'this', 'that', 'these', 'those', 'it', 'its', 'they',
  'them', 'their', 'her', 'his', 'into', 'onto', 'through', 'across', 'over',
  'under', 'near', 'around', 'between', 'one', 'two', 'three', 'some', 'any',
  'all', 'no', 'not', 'than', 'then', 'also', 'so', 'very', 'more', 'most',
  'many', 'much', 'each', 'every', 'other', 'another', 'same', 'such', 'only',
  'own', 'just', 'still', 'here', 'there', 'where', 'when', 'what', 'who',
  'wide', 'tall', 'long', 'high', 'low', 'large', 'small', 'massive', 'huge',
  'vast', 'above', 'below', 'beside', 'behind', 'toward', 'within', 'throughout',
  // OceanBot-specific high-frequency stopwords (painted-oil register
  // hammers these — exclude from dedup signature so the tail end of a
  // batch doesn't collapse to a 'painted painted painted' fingerprint).
  'painted', 'oil',
]);

function signatureOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  const tokens = body
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map();
  const seenTitles = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'body' });
      continue;
    }
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
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn('  ⚠ Sonnet returned no usable entries');
    return [];
  }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/oceanbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  if (TARGET !== null)
    console.log(
      `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
    );
  else
    console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    const within = dedupe(fresh);
    if (within.dropped.length > 0)
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
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
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }
  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );
  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
