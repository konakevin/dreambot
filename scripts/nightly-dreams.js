#!/usr/bin/env node

/**
 * nightly-dreams.js — Generate one dream per eligible user.
 * Uses the Sonnet template pipeline: DB template → slot fill → Sonnet prompt → Flux.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx REPLICATE_API_TOKEN=xxx node scripts/nightly-dreams.js
 *
 * Options:
 *   --max-budget <cents>   Stop after spending this much (default: 500 = $5)
 *   --batch-size <n>       Process n users in parallel (default: 5)
 *   --dry-run              Build prompts but don't generate images
 */

const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

// ── Config ──────────────────────────────────────────────────────────────────

function readEnvFile() {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
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
const envFile = readEnvFile();
function getKey(name) {
  return process.env[name] || envFile[name];
}

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');
const REPLICATE_TOKEN = getKey('REPLICATE_API_TOKEN');
const ANTHROPIC_KEY = getKey('ANTHROPIC_API_KEY');
const MAX_BUDGET_CENTS = parseInt(
  process.argv.find((_, i, a) => a[i - 1] === '--max-budget') ?? '500',
  10
);
const BATCH_SIZE = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--batch-size') ?? '5', 10);
const DRY_RUN = process.argv.includes('--dry-run');
const COST_PER_IMAGE_CENTS = 3;

if (!SUPABASE_KEY || !REPLICATE_TOKEN) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY or REPLICATE_API_TOKEN');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
const anthropic = ANTHROPIC_KEY ? new Anthropic({ apiKey: ANTHROPIC_KEY }) : null;

// ── Curated mediums & vibes (mirrored from dreamEngine.ts) ────────────────

// We only need the keys + fluxFragments + directives for the nightly pipeline.
// Instead of duplicating the full definitions, we load the user's art_styles/aesthetics
// and map them to the curated pool. For fallback we use a compact subset.
const CURATED_MEDIUMS = [
  {
    key: 'pixel_art',
    fluxFragment:
      '16-bit pixel art, carefully placed pixels, limited harmonious color palette, dithered gradients, retro game aesthetic, crisp pixel edges',
  },
  // watercolor removed — Kontext restyle consistently fails to transform
  {
    key: 'oil_painting',
    fluxFragment:
      'Oil painting on canvas, thick impasto brushstrokes, visible palette knife texture, rich layered glazes, Rembrandt-inspired chiaroscuro lighting, warm undertones, painterly color mixing',
  },
  {
    key: 'anime',
    fluxFragment: null,
    includes_mediums: ['cute_anime', 'dark_anime'],
  },
  {
    key: 'lego',
    fluxFragment:
      'LEGO brick diorama, everything constructed from LEGO pieces, plastic studs visible on every surface, minifigure characters, photographed like a real LEGO set, soft realistic lighting',
  },
  {
    key: 'claymation',
    fluxFragment:
      'Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures, glass bead eyes, handcrafted miniature sets, theatrical warm lighting, Laika Studios quality',
  },
  {
    key: '3d_render',
    fluxFragment:
      'Pixar-quality 3D render, soft rounded appealing shapes, subsurface scattering, volumetric lighting, physically based materials, vibrant art-directed color palette, cinematic depth of field',
  },
  // pencil_sketch removed — inconsistent results in nightly
  // neon removed — replaced with cyberpunk
  {
    key: 'cyberpunk',
    fluxFragment:
      'Cyberpunk cityscape, towering megastructures, holographic advertisements, rain-soaked chrome surfaces, neon-drenched fog, flying vehicles, massive scale dystopian architecture, Blade Runner aesthetic',
  },
  {
    key: 'stained_glass',
    fluxFragment:
      'Stained glass window artwork, bold black leading lines, jewel-tone translucent colors glowing with backlight, ruby sapphire emerald amber, graphic symmetrical composition, cathedral quality',
  },
  {
    key: 'comic_book',
    fluxFragment:
      'Comic book art, bold ink outlines, dynamic composition, halftone Ben-Day dots, saturated flat colors, dramatic foreshortening, kinetic energy, graphic novel splash page quality',
  },
  {
    key: 'embroidery',
    fluxFragment:
      'Hand embroidery on linen fabric, cross-stitch and satin stitch techniques, visible thread texture, rich DMC floss colors, fabric background showing through, raised dimensional stitching',
  },
  {
    key: 'disney',
    fluxFragment:
      'Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors, expressive character design, luminous highlights, Renaissance Disney quality',
  },
  {
    key: 'sack_boy',
    fluxFragment:
      'LittleBigPlanet Sack Boy style, knitted fabric characters, button eyes, zipper details, cardboard and craft material world, visible stitching, handmade tactile quality, warm desk lamp lighting',
  },
  {
    key: 'funko_pop',
    fluxFragment:
      'Funko Pop vinyl figure style, oversized head, tiny body, glossy plastic surface, dot eyes, no mouth, painted clothing details, collectible figure on display base, product photography',
  },
  {
    key: 'ghibli',
    fluxFragment:
      'Studio Ghibli animation style, soft painterly rendering, warm natural color palette, detailed painted backgrounds, atmospheric clouds, gentle character design, Miyazaki quality, hand-painted cel animation',
  },
  {
    key: 'tim_burton',
    fluxFragment:
      'Tim Burton gothic style, spindly elongated limbs, spiral motifs, black and white with purple accents, crooked angular architecture, sunken dark-ringed eyes, dark whimsical aesthetic',
  },
  {
    key: 'pop_art',
    fluxFragment:
      'Pop art style, Andy Warhol screen print, bold flat primary colors at maximum saturation, Ben-Day halftone dots, thick black outlines, graphic commercial aesthetic',
  },
  {
    key: 'minecraft',
    fluxFragment:
      'Minecraft voxel style, everything built from cubic blocks, pixelated block textures, square character heads, blocky terrain, grass and dirt blocks, game screenshot aesthetic',
  },
  {
    key: '8bit',
    fluxFragment:
      'NES 8-bit pixel art, extremely limited color palette, large chunky pixels, very low resolution, simple iconic character sprites, flat color blocks, retro 1985 gaming aesthetic',
  },
  {
    key: 'paper_cutout',
    fluxFragment:
      'Construction paper cutout animation, flat 2D paper characters with rough-cut edges, visible paper texture, simple glued-on circle eyes, layered paper backgrounds, crude charming aesthetic, straight-on camera angle',
  },
  {
    key: 'retro_poster',
    fluxFragment:
      'Vintage retro travel poster, bold flat color blocks, screen-printed aesthetic, Art Deco influence, simplified geometric forms, limited palette, 1940s illustration style, dramatic diagonal composition',
  },
  {
    key: 'childrens_book',
    fluxFragment:
      "Children's picture book illustration, soft watercolor washes on textured paper, rounded friendly character designs, warm inviting palette, gentle hand-drawn linework, cozy magical atmosphere, storybook quality",
  },
  {
    key: 'vaporwave',
    fluxFragment:
      'Vaporwave aesthetic, hot pink and cyan and purple palette, glitch effects, marble busts, palm trees, retro grid floor, VHS artifacts, 80s nostalgia, digital sunset, RGB color separation',
  },
  {
    key: 'fantasy',
    fluxFragment:
      'Epic fantasy digital concept art, hyper-detailed, vivid saturated colors, dramatic volumetric lighting, vast magical scale, crisp polished rendering, AAA game art quality',
  },
  {
    key: 'ukiyo_e',
    fluxFragment:
      'Japanese ukiyo-e woodblock print, bold black outlines, flat color fills, Hokusai wave style, indigo and vermillion palette, stylized clouds, traditional Edo period aesthetic, decorative composition',
  },
  {
    key: 'art_deco',
    fluxFragment:
      'Art Deco style, geometric patterns, sunburst motifs, gold and black and emerald palette, polished brass and marble, 1920s glamour, Chrysler Building aesthetic, luxurious symmetrical composition',
  },
  {
    key: 'steampunk',
    fluxFragment:
      'Steampunk aesthetic, brass gears and copper pipes, Victorian machinery, ornate mechanical complexity, airships, goggles and leather, warm metallic palette, steam venting, clockwork mechanisms',
  },
  {
    key: 'cute_anime',
    fluxFragment:
      'Kawaii chibi anime style, oversized heads, enormous sparkly eyes, pastel pink lavender mint palette, soft rounded forms, floating hearts and stars, sparkle effects, maximum cuteness, Sanrio aesthetic',
  },
  {
    key: 'dark_anime',
    fluxFragment:
      'Dark seinen anime, sharp angular character design, intense narrow eyes, muted moody palette, hyper-detailed backgrounds, dramatic cinematic lighting, Ghost in the Shell Akira aesthetic, atmospheric rain and smoke',
  },
];

const CURATED_VIBES = [
  {
    key: 'cinematic',
    directive:
      'This is a frame from an Oscar-winning film. Compose it in 2.39:1 widescreen — use the horizontal space to create tension between subject and environment.',
  },
  {
    key: 'dreamy',
    directive:
      "Everything floats in a soft, ethereal haze. Light doesn't come from one direction — it seems to emanate from within the scene itself, creating a gentle omnidirectional glow.",
  },
  {
    key: 'dark',
    directive:
      'Embrace the shadows. The majority of the frame is in deep shadow — rich, velvety blacks and near-blacks. Light is rare and precious.',
  },
  {
    key: 'chaos',
    directive:
      "Rules don't exist here. Multiple conflicting light sources in impossible colors. Perspective bends — parallel lines converge wrong, scale shifts within the frame.",
  },
  {
    key: 'cozy',
    directive:
      'Everything is warm and close. The scene is an intimate space — small rooms, nooks, corners, sheltered spots. Lighting is soft and warm.',
  },
  {
    key: 'minimal',
    directive:
      'Less is everything. One subject, vast negative space. The background is a single tone or a subtle gradient.',
  },
  {
    key: 'epic',
    directive:
      'SCALE. The subject exists within something impossibly vast — towering mountains, endless skies, cathedral-sized interiors, cosmic expanses.',
  },
  {
    key: 'nostalgic',
    directive:
      'This is a memory being remembered fondly. Everything is shifted toward warm golden tones — late afternoon in eternal summer.',
  },
  {
    key: 'psychedelic',
    directive:
      'Reality is melting, breathing, and pulsing with impossible color. Every surface has organic flowing patterns — fractals, mandalas, paisley.',
  },
  {
    key: 'peaceful',
    directive:
      'Absolute stillness. The scene is in a state of perfect calm — still water reflecting sky, windless fields, quiet dawn light.',
  },
  {
    key: 'whimsical',
    directive:
      'Physics are optional and reality is playful. Objects are slightly the wrong size — oversized mushrooms, tiny doors, floating islands.',
  },
];

const TEMPLATE_CATEGORIES = [
  'cosmic',
  'microscopic',
  'impossible_architecture',
  'giant_objects',
  'peaceful_absurdity',
  'beautiful_melancholy',
  'cosmic_horror',
  'joyful_chaos',
  'eerie_stillness',
  'broken_gravity',
  'wrong_materials',
  'time_distortion',
  'merged_worlds',
  'living_objects',
  'impossible_weather',
  'overgrown',
  'bioluminescence',
  'dreams_within_dreams',
  'memory_distortion',
  'abandoned_running',
  'transformation',
  'reflections',
  'machines',
  'music_sound',
  'underwater',
  'doors_portals',
  'collections',
  'decay_beauty',
  'childhood',
  'transparency',
  'cinematic',
];

const SHOT_DIRECTIONS = [
  'extreme low angle looking up, dramatic forced perspective, subject towering overhead',
  'tilt-shift miniature effect, shallow depth of field, toy-like scale',
  'silhouette against blazing backlight, rim lighting, dramatic contrast',
  'macro lens extreme close-up, impossibly detailed textures, creamy bokeh background',
  'aerial view looking straight down, geometric patterns, vast scale',
  'through rain-covered glass, soft distortion, reflections overlapping the scene',
  'dutch angle, dramatic tension, off-kilter framing',
  'wide establishing shot, tiny subject in vast environment, epic scale',
  'over-the-shoulder perspective, voyeuristic, intimate framing',
  'symmetrical dead-center composition, Wes Anderson framing, obsessive balance',
  'fisheye lens distortion, warped edges, immersive and disorienting',
  'long exposure motion blur, streaks of light, frozen and flowing simultaneously',
  'reflection shot, scene mirrored in water or glass, doubled reality',
  'extreme depth, foreground object sharp, background stretching to infinity',
  'candid snapshot feeling, slightly off-center, caught mid-moment',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Dream Algorithm (mirrored from lib/dreamAlgorithm.ts) ──
const CAST_PROBABILITY = 0.75;
const SCENE_ONLY_SET = new Set([
  'oil_painting',
  'embroidery',
  'watercolor',
  'vaporwave',
  'retro_poster',
  'pop_art',
  '8bit',
  'pixel_art',
  'fantasy',
]);
const CHARACTER_SET = new Set(['claymation', 'lego', 'funko_pop', 'disney', 'sack_boy']);
const WHO_THRESHOLDS = [
  { max: 15, roles: ['self'] },
  { max: 25, roles: ['plus_one'] },
  { max: 35, roles: ['pet'] },
  { max: 75, roles: ['self', 'plus_one'] },
  { max: 90, roles: ['self', 'pet'] },
  { max: 100, roles: ['self', 'plus_one', 'pet'] },
];

function rollDream(describedCast, mediumKey) {
  const findRole = (r) => describedCast.find((m) => m.role === r);
  let castPick = null;
  let multiCast = [];

  if (
    describedCast.length > 0 &&
    !SCENE_ONLY_SET.has(mediumKey) &&
    Math.random() < CAST_PROBABILITY
  ) {
    const whoRoll = Math.random() * 100;
    const match = WHO_THRESHOLDS.find((t) => whoRoll < t.max);
    if (match) {
      const members = match.roles.map((r) => findRole(r)).filter(Boolean);
      if (members.length > 1) {
        multiCast = members;
        castPick = members[0];
      } else if (members.length === 1) {
        castPick = members[0];
      } else {
        castPick = describedCast[0];
      }
    }
  }

  let dreamPath;
  if (!castPick || SCENE_ONLY_SET.has(mediumKey)) {
    dreamPath = 'pure_scene';
  } else if (CHARACTER_SET.has(mediumKey)) {
    dreamPath = 'character';
  } else if (multiCast.length > 1) {
    dreamPath = 'character';
  } else {
    dreamPath = Math.random() < 0.6 ? 'character' : 'epic_tiny';
  }

  return { dreamPath, castPick, multiCast };
}

function pickWeightedCategory(moods) {
  const w = {
    cosmic: 1 + moods.realistic_surreal * 0.5,
    microscopic: 1 + (1 - moods.minimal_maximal) * 0.5,
    impossible_architecture: 1 + moods.realistic_surreal * 0.5 + moods.minimal_maximal * 0.3,
    giant_objects: 1 + moods.minimal_maximal * 0.5,
    peaceful_absurdity: 1 + (1 - moods.peaceful_chaotic) * 0.8 + (1 - moods.cute_terrifying) * 0.3,
    beautiful_melancholy:
      1 + (1 - moods.peaceful_chaotic) * 0.5 + (1 - moods.minimal_maximal) * 0.3,
    cosmic_horror: 1 + moods.cute_terrifying * 0.8 + moods.realistic_surreal * 0.3,
    joyful_chaos: 1 + moods.peaceful_chaotic * 0.8 + (1 - moods.cute_terrifying) * 0.3,
    eerie_stillness: 1 + (1 - moods.peaceful_chaotic) * 0.5 + moods.cute_terrifying * 0.5,
    broken_gravity: 1 + moods.peaceful_chaotic * 0.3 + moods.realistic_surreal * 0.5,
    wrong_materials: 1 + moods.realistic_surreal * 0.8,
    time_distortion: 1 + moods.realistic_surreal * 0.8,
    merged_worlds: 1 + moods.realistic_surreal * 0.5 + moods.minimal_maximal * 0.3,
    living_objects: 1 + (1 - moods.cute_terrifying) * 0.3 + moods.realistic_surreal * 0.3,
    impossible_weather: 1 + moods.peaceful_chaotic * 0.3 + moods.realistic_surreal * 0.3,
    overgrown: 1 + (1 - moods.peaceful_chaotic) * 0.3,
    bioluminescence: 1 + (1 - moods.cute_terrifying) * 0.5 + (1 - moods.peaceful_chaotic) * 0.3,
    dreams_within_dreams: 1 + moods.realistic_surreal * 0.8 + moods.minimal_maximal * 0.3,
    memory_distortion: 1 + (1 - moods.peaceful_chaotic) * 0.3 + moods.realistic_surreal * 0.5,
    abandoned_running: 1 + moods.cute_terrifying * 0.3 + (1 - moods.peaceful_chaotic) * 0.3,
    transformation: 1 + moods.realistic_surreal * 0.5 + moods.peaceful_chaotic * 0.3,
    reflections: 1 + (1 - moods.minimal_maximal) * 0.3 + moods.realistic_surreal * 0.3,
    machines: 1 + moods.minimal_maximal * 0.5 + moods.peaceful_chaotic * 0.3,
    music_sound: 1 + moods.peaceful_chaotic * 0.3,
    underwater: 1 + (1 - moods.peaceful_chaotic) * 0.3,
    doors_portals: 1 + moods.realistic_surreal * 0.5,
    collections: 1 + moods.minimal_maximal * 0.8,
    decay_beauty: 1 + moods.cute_terrifying * 0.5 + (1 - moods.peaceful_chaotic) * 0.3,
    childhood: 1 + (1 - moods.cute_terrifying) * 0.5,
    transparency: 1 + moods.realistic_surreal * 0.5 + (1 - moods.minimal_maximal) * 0.3,
    cinematic: 1 + moods.minimal_maximal * 0.3,
  };
  const entries = Object.entries(w);
  const totalWeight = entries.reduce((a, [, v]) => a + v, 0);
  let roll = Math.random() * totalWeight;
  for (const [cat, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return cat;
  }
  return entries[0][0];
}

function resolveMedium(profile) {
  let medium;
  if (profile.art_styles?.length) {
    const key = pick(profile.art_styles);
    medium = CURATED_MEDIUMS.find((m) => m.key === key) ?? pick(CURATED_MEDIUMS);
  } else {
    medium = pick(CURATED_MEDIUMS);
  }
  // Aggregate mediums: randomly pick one of the sub-mediums
  if (medium.includes_mediums?.length) {
    const subKey = pick(medium.includes_mediums);
    const sub = CURATED_MEDIUMS.find((m) => m.key === subKey);
    if (sub) return sub;
  }
  return medium;
}

function resolveVibe(profile) {
  if (profile.aesthetics?.length) {
    const key = pick(profile.aesthetics);
    return CURATED_VIBES.find((v) => v.key === key) ?? pick(CURATED_VIBES);
  }
  return pick(CURATED_VIBES);
}

// ── Cast routing ───────────────────────────────────────────────────────────

async function generateKontextImage(prompt, inputImageUrl) {
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, input_image: inputImageUrl, aspect_ratio: '9:16', output_format: 'jpg' },
      }),
    }
  );
  if (!res.ok) throw new Error(`Kontext create failed: ${res.status}`);
  const pred = await res.json();
  if (!pred.id) throw new Error('No prediction ID');
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded')
      return typeof data.output === 'string' ? data.output : data.output?.[0];
    if (data.status === 'failed') throw new Error(`Failed: ${data.error}`);
  }
  throw new Error('Timed out');
}

const STYLIZED_MEDIUMS = new Set([
  'pixel_art',
  'lego',
  'claymation',
  'anime',
  'comic_book',
  'disney',
  'sack_boy',
  'funko_pop',
  'ghibli',
  'tim_burton',
  'pop_art',
  'minecraft',
  '8bit',
  'paper_cutout',
]);

const COST_KONTEXT_CENTS = 4;

// ── Per-medium prompt templates (cast stylized path) ───────────────────────

const MEDIUM_TEMPLATES = {
  lego: (s, v) =>
    `Write a Flux AI prompt (50-70 words, comma-separated) for a PHOTOGRAPH of a REAL LEGO SET:\n- Start with: "Photograph of a real LEGO brick diorama, soft studio lighting, shallow depth of field"\n- Subject: ${s} — built ENTIRELY from LEGO bricks. Characters are minifigures with painted expressions, snap-on hair, C-shaped hands\n- EVERY object, surface, and background element is LEGO — visible studs, snap-together construction\n- End with: no text, no words, no letters, no watermarks, hyper detailed. NEVER place the character standing centered on a path, road, sidewalk, or trail.\nExpress the mood through brick color choices and lighting: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
  pixel_art: (s, v) =>
    `Write a Flux AI prompt (50-70 words, comma-separated) for pixel art:\n- Start with: "16-bit pixel art, SNES era, visible pixel grid, limited 24-color palette, crisp pixel edges"\n- Subject: ${s} — rendered as pixel art sprites and pixel environments\n- Characters have blocky features, dot eyes, iconic silhouettes\n- Dithered shading, NO anti-aliasing, NO smooth gradients\n- End with: no text, no words, no letters, no watermarks, hyper detailed. NEVER place the character standing centered on a path, road, sidewalk, or trail.\nExpress the mood through palette selection: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
  claymation: (s, v) =>
    `Write a Flux AI prompt (50-70 words, comma-separated) for claymation:\n- Start with: "Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures, glass bead eyes, handcrafted miniature sets"\n- Subject: ${s} — sculpted from smooth matte clay with subtle fingerprint textures\n- Characters have glass bead eyes, knitted/felted clothing. Sets are handcrafted miniatures.\n- End with: no text, no words, no letters, no watermarks, hyper detailed. NEVER place the character standing centered on a path, road, sidewalk, or trail.\nExpress the mood through set lighting and clay color palette: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
  anime: (s, v) =>
    `Write a Flux AI prompt (50-70 words, comma-separated) for anime illustration:\n- Start with: "Anime illustration, clean ink linework, cel-shaded coloring, expressive detailed eyes, vibrant saturated colors"\n- Subject: ${s} — drawn in anime style with clean ink outlines, cel-shaded flat color\n- Characters have expressive eyes with light reflections, dynamic flowing hair\n- Backgrounds painted with atmospheric detail (Shinkai-style)\n- End with: no text, no words, no letters, no watermarks, hyper detailed. NEVER place the character standing centered on a path, road, sidewalk, or trail.\nExpress the mood through background atmosphere and color saturation: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
  comic_book: (s, v) =>
    `Write a Flux AI prompt (50-70 words, comma-separated) for comic book art:\n- Start with: "Comic book art, bold ink outlines, dynamic composition, halftone Ben-Day dots, saturated flat colors, graphic novel splash page quality"\n- Subject: ${s} — drawn with bold confident ink outlines, flat saturated color\n- Ben-Day dot halftone patterns in mid-tones. Dynamic angles. Kinetic energy.\n- End with: no text, no words, no letters, no watermarks, hyper detailed. NEVER place the character standing centered on a path, road, sidewalk, or trail.\nExpress the mood through ink weight and color intensity: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
  disney: (s, v) =>
    `Write a Flux AI prompt (50-70 words, comma-separated) for Disney animation:\n- Start with: "Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors, Renaissance Disney quality"\n- Subject: ${s} — as a Disney animated character with expressive emotive face, large eyes\n- Clean ink outlines, luminous cel-painted color, lush painted backgrounds\n- End with: no text, no words, no letters, no watermarks, hyper detailed. NEVER place the character standing centered on a path, road, sidewalk, or trail.\nExpress the mood through background painting and color vibrancy: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
  ghibli: (s, v) =>
    `Write a Flux AI prompt (50-70 words, comma-separated) for Studio Ghibli:\n- Start with: "Studio Ghibli animation style, soft painterly rendering, warm natural palette, detailed painted backgrounds, Miyazaki quality"\n- Subject: ${s} — in Ghibli style with natural rounded proportions, warm watercolor-like shading\n- Breathtaking painted landscapes with atmospheric perspective. Nature as a character.\n- End with: no text, no words, no letters, no watermarks, hyper detailed. NEVER place the character standing centered on a path, road, sidewalk, or trail.\nExpress the mood through landscape detail and palette warmth: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
  tim_burton: (s, v) =>
    `Write a Flux AI prompt (50-70 words, comma-separated) for Tim Burton style:\n- Start with: "Tim Burton gothic illustration, spindly elongated limbs, spiral motifs, black and white with purple accents, crooked angular architecture"\n- Subject: ${s} — with impossibly thin limbs, elongated neck, sunken dark-ringed eyes\n- Spiral motifs in hair, architecture. Stark black/white/grey with pops of purple or blood red.\n- End with: no text, no words, no letters, no watermarks, hyper detailed. NEVER place the character standing centered on a path, road, sidewalk, or trail.\nExpress the mood through angular environment and shadow intensity: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
  '3d_render': (s, v) =>
    `Write a Flux AI prompt (50-70 words, comma-separated) for a 3D render:\n- Start with: "Pixar-quality 3D render, soft rounded appealing shapes, subsurface scattering, volumetric lighting, cinematic depth of field"\n- Subject: ${s} — as a stylized 3D animated scene with Pixar-level quality\n- Soft rounded shapes, glossy eyes, subsurface scattering on skin\n- End with: no text, no words, no letters, no watermarks, hyper detailed. NEVER place the character standing centered on a path, road, sidewalk, or trail.\nExpress the mood through volumetric lighting and color palette: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
};

// ── Image generation ────────────────────────────────────────────────────────

async function generateImage(prompt) {
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, aspect_ratio: '9:16', num_outputs: 1, output_format: 'jpg' },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Replicate ${res.status}: ${body.slice(0, 200)}`);
  }

  const pred = await res.json();
  if (!pred.id) throw new Error('No prediction ID');

  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded') return data.output?.[0];
    if (data.status === 'failed') throw new Error(`Failed: ${data.error}`);
  }
  throw new Error('Timed out');
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌙 Nightly Dream Generation (Sonnet Template Pipeline)`);
  console.log(`   Budget: ${MAX_BUDGET_CENTS}¢ | Batch: ${BATCH_SIZE} | Dry run: ${DRY_RUN}\n`);

  const today = new Date().toISOString().slice(0, 10);
  const { data: users, error } = await sb
    .from('user_recipes')
    .select('user_id, recipe, dream_wish, wish_modifiers, wish_recipient_ids')
    .eq('onboarding_completed', true)
    .eq('ai_enabled', true);

  if (error) {
    console.error('DB error:', error.message);
    process.exit(1);
  }
  console.log(`Found ${users.length} eligible users`);

  const { data: todayBudgets } = await sb
    .from('ai_generation_budget')
    .select('user_id')
    .eq('date', today);
  const alreadyDreamed = new Set((todayBudgets ?? []).map((b) => b.user_id));

  const eligible = users.filter((u) => !alreadyDreamed.has(u.user_id));
  console.log(`${eligible.length} haven't dreamed today\n`);

  let totalCost = 0;
  let generated = 0;
  let failed = 0;

  for (let i = 0; i < eligible.length; i += BATCH_SIZE) {
    if (totalCost >= MAX_BUDGET_CENTS) {
      console.log(`\n⚠️  Budget limit reached (${totalCost}¢ / ${MAX_BUDGET_CENTS}¢). Stopping.`);
      break;
    }

    const batch = eligible.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (user) => {
        const recipe = user.recipe;
        const wish = user.dream_wish;
        const isV2 = recipe?.version === 2;

        let prompt;
        let dreamMediumKey = null;
        let dreamVibeKey = null;
        let castPick = null;

        if (isV2 && anthropic) {
          // ── SONNET TEMPLATE PIPELINE ──
          const medium = resolveMedium(recipe);
          const vibe = resolveVibe(recipe);
          dreamMediumKey = medium.key;
          dreamVibeKey = vibe.key;
          const seeds = recipe.dream_seeds ?? { characters: [], places: [], things: [] };

          // Step 1: Pick mood-weighted template from DB
          const moods = recipe.moods ?? {
            peaceful_chaotic: 0.5,
            cute_terrifying: 0.3,
            minimal_maximal: 0.5,
            realistic_surreal: 0.5,
          };
          let dreamSubject;
          try {
            const category = pickWeightedCategory(moods);
            const { data: rows, error: tmplErr } = await sb
              .from('dream_templates')
              .select('template')
              .eq('category', category)
              .eq('disabled', false)
              .limit(200);

            if (tmplErr || !rows?.length) throw new Error(tmplErr?.message ?? 'No templates');

            const template = pick(rows).template;
            const character =
              seeds.characters.length > 0 ? pick(seeds.characters) : 'a wandering figure';
            const place = seeds.places.length > 0 ? pick(seeds.places) : 'a forgotten city';
            const thing = seeds.things.length > 0 ? pick(seeds.things) : 'glowing fragments';

            dreamSubject = template
              .replace(/\$\{character\}/g, character)
              .replace(/\$\{place\}/g, place)
              .replace(/\$\{thing\}/g, thing);
          } catch {
            const fallbackSeeds = [
              ...seeds.characters.slice(0, 1),
              ...seeds.places.slice(0, 1),
              ...seeds.things.slice(0, 1),
            ].filter(Boolean);
            dreamSubject =
              fallbackSeeds.length > 0
                ? `A surreal dream featuring ${fallbackSeeds.join(' and ')} in an impossible landscape`
                : 'A surreal impossible dreamscape with unexpected elements and impossible geometry';
          }

          // Step 2: Roll dream algorithm (cast selection + composition)
          const cast = (recipe.dream_cast ?? []).filter((m) => m.description);
          const dreamRoll = rollDream(cast, medium.key);
          castPick = dreamRoll.castPick;
          const multiCast = dreamRoll.multiCast;

          // Step 3: Inject wish
          if (wish) {
            dreamSubject += `. DREAM WISH (make this the heart): "${wish}"`;
          }

          // Step 4: Sonnet prompt writer with personalization context
          const shotDirection = pick(SHOT_DIRECTIONS);
          const aestheticFlavor = recipe.aesthetics?.length
            ? `\nFLAVOR (the dreamer vibes with): ${recipe.aesthetics.slice(0, 4).join(', ')}`
            : '';
          const avoidList = recipe.avoid?.length
            ? `\nNEVER INCLUDE: ${recipe.avoid.join(', ')}`
            : '';
          const allSeeds = [...seeds.characters, ...seeds.places, ...seeds.things];
          const extraSeeds =
            allSeeds.length > 0
              ? `\nDREAMER'S INGREDIENTS (weave 1-2 in naturally if they fit the scene): ${allSeeds
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 4)
                  .join(', ')}`
              : '';

          // ── THREE DREAM COMPOSITION PATHS ──
          const shortCastDesc = castPick
            ? (castPick.description?.split(',')[0] ??
              (castPick.role === 'pet' ? 'a small creature' : 'a figure'))
            : null;
          const mediumStyle = medium.key.replace(/_/g, ' ');

          // Path already decided by rollDream() above
          const { dreamPath } = dreamRoll;

          let nightlyBrief;

          if (dreamPath === 'character') {
            // ── PATH A: Character dream — character is the focus, scene wraps around them ──
            nightlyBrief = `You are a ${mediumStyle} artist. Write a Flux AI prompt (60-90 words, comma-separated).\n\nMEDIUM: ${medium.fluxFragment}\n\nCreate a scene where a ${mediumStyle}-style ${shortCastDesc} is the main character experiencing this dream:\n${dreamSubject}\n\nThe character is rendered fully in ${mediumStyle} style — NOT photorealistic. They are DOING something in the scene, not just standing and staring at the camera. Show them interacting with the surreal environment.\n\nCAMERA: ${shotDirection}\nMOOD: ${vibe.directive}\n${aestheticFlavor}${extraSeeds}${avoidList}\n\nStart with the art medium. End with: no text, no words, no letters, no watermarks, hyper detailed.\nOutput ONLY the prompt.`;
          } else if (dreamPath === 'epic_tiny') {
            // ── PATH C: Epic scene + tiny character — vast landscape, character is a tiny detail ──
            nightlyBrief = `You are a cinematographer composing an EPIC, VAST scene. Write a Flux AI prompt (60-90 words, comma-separated).\n\nMEDIUM: ${medium.fluxFragment}\n\nDREAM SCENE (this is the ENTIRE focus — describe in maximum vivid detail):\n${dreamSubject}\n\nSomewhere in this vast scene, barely visible, is a tiny ${mediumStyle}-style ${shortCastDesc}. They occupy less than 5% of the image. The scene is EVERYTHING.\n\nCAMERA: ${shotDirection}\nMOOD: ${vibe.directive}\n${aestheticFlavor}${extraSeeds}${avoidList}\n\nWrite the prompt:\n1. Start with the art medium\n2. Spend 90% of words on the ENVIRONMENT\n3. Mention the tiny character in ONE short phrase at the very end\n4. End with: no text, no words, no letters, no watermarks, hyper detailed\nOutput ONLY the prompt.`;
          } else {
            // ── PATH B: Pure scene — no character, just breathtaking art ──
            nightlyBrief = `You are a cinematographer composing a single breathtaking frame. Write a Flux AI prompt (60-90 words, comma-separated).\n\nMEDIUM: ${medium.fluxFragment}\n\nDREAM SCENE (this is sacred — do NOT water it down):\n${dreamSubject}\n\nCAMERA/COMPOSITION: ${shotDirection}\nMOOD: ${vibe.directive}\n${aestheticFlavor}${extraSeeds}${avoidList}\n\nWrite the prompt:\n1. Start with the art medium\n2. Describe the EXACT scene — every surreal detail preserved\n3. NO PEOPLE. NO CHARACTERS. NO FIGURES. Pure environment.\n4. Name specific materials, textures, light sources (NOUNS not adjectives)\n5. End with: no text, no words, no letters, no watermarks, hyper detailed, masterwork composition\nOutput ONLY the prompt.`;
          }

          try {
            const msg = await anthropic.messages.create({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 200,
              messages: [{ role: 'user', content: nightlyBrief }],
            });
            const text = msg.content?.[0]?.text?.trim() ?? '';
            if (text.length < 20) throw new Error('too short');
            prompt = text;
          } catch {
            prompt = `${medium.fluxFragment}, ${dreamSubject}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, no text, hyper detailed`;
          }

          console.log(`  [${dreamPath}]`);
        } else {
          // Non-V2 fallback
          const medium = pick(CURATED_MEDIUMS);
          const vibe = pick(CURATED_VIBES);
          prompt = wish
            ? `${medium.fluxFragment}, "${wish}", ${vibe.directive.split('.')[0]}, portrait 9:16, hyper detailed`
            : `${medium.fluxFragment}, a surreal impossible dreamscape, ${vibe.directive.split('.')[0]}, portrait 9:16, hyper detailed`;
        }

        process.stdout.write(`  ${user.user_id.slice(0, 8)}... `);

        if (DRY_RUN) {
          console.log('PROMPT:', prompt.slice(0, 150));
          return;
        }

        let tempUrl;
        try {
          tempUrl = await generateImage(prompt);
          if (!tempUrl) throw new Error('No URL returned');
        } catch (genErr) {
          const msg = genErr?.message ?? '';
          if (msg.toLowerCase().includes('nsfw') || msg.toLowerCase().includes('safety')) {
            if (wish) {
              try {
                await sb.from('notifications').insert({
                  recipient_id: user.user_id,
                  actor_id: user.user_id,
                  type: 'dream_generated',
                  body: `Your wish couldn't be dreamed — it was a bit too spicy. Try a different wish!`,
                });
                await sb
                  .from('user_recipes')
                  .update({ dream_wish: null, wish_modifiers: null })
                  .eq('user_id', user.user_id);
              } catch {}
            }
          }
          throw genErr;
        }

        // Persist to Supabase Storage
        const imgResp = await fetch(tempUrl);
        if (!imgResp.ok) throw new Error('Failed to download generated image');
        const imgBuf = Buffer.from(await imgResp.arrayBuffer());
        const fileName = `${user.user_id}/${Date.now()}.jpg`;

        const { error: storageErr } = await sb.storage
          .from('uploads')
          .upload(fileName, imgBuf, { contentType: 'image/jpeg' });
        if (storageErr) throw new Error(`Storage upload failed: ${storageErr.message}`);

        const { data: urlData } = sb.storage.from('uploads').getPublicUrl(fileName);
        const imageUrl = urlData.publicUrl;

        // Bot message via Haiku
        let botMessage = null;
        if (ANTHROPIC_KEY) {
          try {
            const { data: recentDreams } = await sb
              .from('uploads')
              .select('ai_prompt, from_wish')
              .eq('user_id', user.user_id)
              .eq('is_ai_generated', true)
              .order('created_at', { ascending: false })
              .limit(5);

            const recentContext = (recentDreams ?? [])
              .map((d) => d.ai_prompt?.slice(0, 80))
              .filter(Boolean);
            const pastWishes = (recentDreams ?? []).map((d) => d.from_wish).filter(Boolean);

            let memoryBlock = '';
            if (recentContext.length > 0)
              memoryBlock += `\nOPTIONAL CONTEXT (reference ONLY if genuinely interesting, otherwise ignore):\n- Recent dreams: ${recentContext.join(' | ')}`;
            if (pastWishes.length > 0) memoryBlock += `\n- Past wishes: ${pastWishes.join(', ')}`;
            if (wish) memoryBlock += `\n- Tonight's wish: "${wish}"`;

            const msgRes = await anthropic.messages.create({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 60,
              messages: [
                {
                  role: 'user',
                  content: `You are a Dream Bot — a tiny creative spirit living in someone's phone, making dreams nightly. Playful, warm, a little weird. You love your human.

Tonight's dream prompt: "${prompt.slice(0, 200)}"

Write ONE short reaction to making this dream. 8-15 words max.

CRITICAL RULES:
- NEVER start with "Okay so" or "Not gonna lie" or "Honestly"
- NEVER use the phrases "hit different", "chef's kiss", "you're welcome", "no regrets", "trust the process"
- Every message must have a DIFFERENT opening word/structure
- Reference ONE specific thing from the prompt — a creature, place, color, or vibe
- React to the creative choice, don't describe the image
- No emojis. Max one exclamation mark.
${memoryBlock}

Output ONLY the message, nothing else.`,
                },
              ],
            });

            const text = msgRes.content?.[0]?.text?.trim() ?? '';
            if (text.length >= 5 && text.length <= 200) botMessage = text;
          } catch {
            // Non-critical
          }
        }

        // Insert upload
        const { data: uploadRow } = await sb
          .from('uploads')
          .insert({
            user_id: user.user_id,
            categories: ['art'],
            image_url: imageUrl,
            caption: null,
            ai_prompt: prompt,
            dream_medium: dreamMediumKey,
            dream_vibe: dreamVibeKey,
            is_approved: true,
            is_active: true,
            from_wish: wish || null,
            bot_message: botMessage,
          })
          .select('id')
          .single();

        const uploadId = uploadRow?.id;

        // Send notification
        const notifBody = (wish ? 'wish:' : 'dream:') + (botMessage || '');
        try {
          await sb.from('notifications').insert({
            recipient_id: user.user_id,
            actor_id: user.user_id,
            type: 'dream_generated',
            upload_id: uploadId,
            body: notifBody,
          });
        } catch {}

        // Send to wish recipients
        if (user.wish_recipient_ids?.length > 0) {
          const uniqueRecipients = [...new Set(user.wish_recipient_ids)].filter(
            (rid) => rid !== user.user_id
          );
          if (uniqueRecipients.length > 0) {
            try {
              await sb.from('notifications').insert(
                uniqueRecipients.map((rid) => ({
                  recipient_id: rid,
                  actor_id: user.user_id,
                  type: 'dream_generated',
                  upload_id: uploadId,
                  body: wish ? `Wished you a dream: "${wish.slice(0, 50)}"` : 'Wished you a dream',
                }))
              );
            } catch {}
          }
        }

        // Log generation
        const actualCostCents = COST_PER_IMAGE_CENTS;
        const modelUsed = 'flux-dev';
        try {
          await sb.from('ai_generation_log').insert({
            user_id: user.user_id,
            recipe_snapshot: recipe,
            enhanced_prompt: prompt,
            model_used: modelUsed,
            cost_cents: actualCostCents,
            status: 'completed',
          });
        } catch {}

        // Update budget
        try {
          await sb.from('ai_generation_budget').upsert(
            {
              user_id: user.user_id,
              date: today,
              images_generated: 1,
              total_cost_cents: actualCostCents,
            },
            { onConflict: 'user_id,date' }
          );
        } catch {}

        // Clear wish after use
        if (wish) {
          await sb
            .from('user_recipes')
            .update({ dream_wish: null, wish_recipient_ids: null, wish_modifiers: null })
            .eq('user_id', user.user_id);
        }

        console.log('✅', wish ? `(wish: "${wish.slice(0, 30)}")` : '');
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') {
        generated++;
        totalCost += COST_PER_IMAGE_CENTS;
      } else {
        failed++;
        console.log('❌', r.reason?.message?.slice(0, 80));
      }
    }

    if (i + BATCH_SIZE < eligible.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n✨ Done! Generated: ${generated} | Failed: ${failed} | Cost: ${totalCost}¢`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
