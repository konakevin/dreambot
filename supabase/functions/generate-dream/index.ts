/**
 * Edge Function: generate-dream
 *
 * Server-side dream generation. Receives a recipe (or raw prompt),
 * builds the prompt via the recipe engine, optionally enhances via Haiku,
 * generates an image via Replicate Flux, persists to Storage, and returns
 * the permanent URL.
 *
 * POST /functions/v1/generate-dream
 * Authorization: Bearer <user JWT>
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildPromptInput, buildRawPrompt, buildHaikuPrompt } from '../_shared/recipeEngine.ts';
import type { Recipe } from '../_shared/recipe.ts';
import type {
  VibeProfile,
  PromptMode,
  ConceptRecipe,
  DreamCastMember,
} from '../_shared/vibeProfile.ts';
import {
  buildConceptPrompt,
  buildConceptPromptV2,
  buildPolisherPrompt,
  buildPolisherPromptV2,
  buildFallbackConcept,
  buildFallbackFluxPrompt,
  parseConceptJson,
} from '../_shared/vibeEngine.ts';
import { buildSubjectInventionPrompt, buildDreamScene } from '../_shared/dreamEngine.ts';
import { getPhotoRestyleConfig, buildReimaginePrompt } from '../_shared/photoPrompts.ts';
import { rollDream, NIGHTLY_SKIP_MEDIUMS } from '../_shared/dreamAlgorithm.ts';
import { assembleScene } from '../_shared/sceneEngine.ts';
import { getLocationCard, getObjectCard } from '../_shared/essenceCards.ts';
import type { LocationCard, ObjectCard } from '../_shared/essenceCards.ts';
import { describeWithVision, VISION_PROMPTS } from '../_shared/vision.ts';
import { resolveMediumFromDb, resolveVibeFromDb } from '../_shared/dreamStyles.ts';

const MAX_DAILY_GENERATIONS = 50;

// Curated + engine pool merged — all mediums in one place per model
const CURATED_FLUX_STYLES = [
  // Kevin's handpicked
  'Bob Ross happy little trees, soft landscape, calm mountains, warm and gentle',
  'Faded vintage photograph, slightly overexposed, warm nostalgic tones',
  'Ornate embossed leather book cover style',
  'Miniature tilt-shift photograph, toy-like depth of field, vivid saturated',
  'Cottagecore illustrated, wildflowers, linen, soft pastoral warmth',
  'Solarpunk, lush green futurism, solar panels on organic architecture',
  'Cute 3D character render, soft rounded shapes, vibrant colors',
  'DMT visionary art style, sacred geometry, infinite recursive patterns, overwhelming color',
  'Spider-Verse mixed media, comic dots, paint splatters, dynamic angles',
  'A whimsical chalk drawing on sidewalk, colorful and wobbly',
  '1960s Pan Am advertisement illustration style, glamorous jet-age optimism, bold colors',
  'Vaporwave aesthetic, pink and cyan gradients, Greek statues, surreal consumerism',
  'A blacklight poster, psychedelic velvet colors glowing in the dark',
  'Acid trip visuals, melting surfaces, breathing walls, colors bleeding into each other',
  'Art nouveau, Alphonse Mucha style, flowing organic lines',
  'Gustav Klimt gold-leaf Byzantine mosaic, ornate patterns',
  'Adorable chibi kawaii illustration, pastel watercolors, big sparkly eyes',
  'Pixar-style 3D render, soft rounded shapes, vibrant colors',
  'Dreamworks animation style, expressive characters, cinematic lighting',
  'A knitted Sackboy character, LittleBigPlanet craft world, buttons and zippers',
  'Aardman claymation, Wallace & Gromit smooth clay, expressive faces',
  'Soft shoujo manga claymation stop-motion, visible fingerprint textures in clay',
  'K-pop album cover aesthetic, glossy, soft lighting, pastel gradients',
  'Tim Burton gothic illustration, spindly limbs, spiral shapes, dark whimsy',
  'LEGO brick diorama, everything built from LEGO, plastic studs visible',
  'Comic book panel, bold ink outlines, halftone dots',
  'Monet impressionist, soft water lilies, dappled light, dreamy blur',
  'LEGO minifigure in a realistic world, tiny plastic character',
  'Muppet-style felt puppet world, fuzzy textures, googly eyes, Jim Henson whimsy',
  'LittleBigPlanet craft world, knitted characters, cardboard and sticker scenery',
  'Baroque oil painting, Caravaggio dramatic chiaroscuro, deep shadows, golden light',
  'Digital painting, cinematic lighting, vivid colors',
  'Digital illustration, clean lines, vibrant composition',
  'Fantasy illustration, lush detail, dramatic lighting',
  'Papercraft diorama, handmade paper cutouts, miniature world',
  'Ultra-realistic photograph, DSLR, 8K detail',
  'Picasso cubist style, fragmented geometric faces, multiple perspectives',
  // From engine pool
  'oil painting on canvas, visible brushstrokes, impressionist',
  'vintage Disney animation cel, 1950s hand-drawn style',
  'ukiyo-e Japanese woodblock print, flat color, bold outlines',
  'chalk pastel on black paper, soft edges, dramatic contrast',
  'claymation stop-motion, visible fingerprint textures in clay',
  'retro 1980s airbrush illustration, chrome and gradients',
  'botanical scientific illustration, ink linework with watercolor',
  'stained glass window, bold black leading, jewel-tone translucent color',
  'neon sign art, glowing tube lights on dark brick wall',
  'low-poly geometric 3D render, faceted surfaces',
  'pencil sketch with watercolor splashes, loose linework',
  'fantasy book cover illustration, lush detail, dramatic lighting',
  'cross-stitch embroidery on fabric, every element stitched in thread, visible grid texture',
  'everything is shiny molded plastic, like toys in a playset — glossy surfaces, seam lines',
  'entire world built from LEGO bricks, everything is LEGO — plastic studs visible everywhere',
  'classic Disney 2D animation, clean ink outlines, cel-shaded, 1990s era',
  'Wes Anderson symmetrical composition, pastel color palette, dollhouse miniature',
  'vintage travel poster, bold flat shapes, limited color palette, art deco lettering',
  'dreamy soft-focus film photography, 35mm grain, light leaks, golden tones',
  'felt and fabric diorama, stitched textures, button eyes, handmade craft',
  'Funko Pop vinyl figure style, oversized head, tiny body, glossy plastic',
  'mosaic tile artwork, small colorful square tiles, ancient Roman style',
  'pop art screen print, bold primary colors, Andy Warhol style',
  'cyberpunk neon cityscape style, rain-slicked surfaces, holographic ads',
  'Tron digital world, glowing neon lines on black, light trails, geometric',
  "gouache painting, thick opaque paint, matte finish, children's book illustration",
  'origami paper sculpture, crisp folds, white paper with colored accents',
  'woodcut print, bold carved lines, high contrast black and white with one accent color',
  'shadow puppet theater, silhouettes against warm backlit screen',
  'Japanese ink sumi-e, minimal brushstrokes, zen simplicity, negative space',
  'voxel 3D art, chunky isometric blocks, Minecraft meets cute',
  'Frida Kahlo surrealist style, lush flowers, vivid symbolic colors, folk art motifs',
  'Banksy street art, stencil graffiti, political irony, concrete wall',
  'Edward Hopper lonely realism, empty diners, long shadows, isolation',
  'Keith Haring bold outlines, dancing figures, primary colors, street art',
  'MC Escher impossible architecture, tessellations, mind-bending perspective',
  'Basquiat neo-expressionist, raw, crown motif, scrawled text, street',
  'Hokusai Great Wave style, Japanese woodblock, dramatic ocean, Mount Fuji',
  'Rothko color field, massive blocks of bleeding color, meditative',
  'Dalí melting clocks surrealism, desert dreamscape, impossible objects',
  'Warhol repeated screen print, bold flat pop art colors, celebrity style',
  'Rankin/Bass stop-motion, classic Christmas special, felt snow and glitter',
  'Laika stop-motion, Coraline/Kubo style, dark handcrafted beauty',
  'golden age storybook illustration, Beatrix Potter watercolor, gentle linework',
  'marble sculpture, Michelangelo carved stone, dramatic form',
  'charcoal drawing on textured paper, smudged dramatic shadows',
  'tarot card illustration, ornate gold borders, mystical symbolism',
  'vintage newspaper comic strip, Ben-Day dots, speech bubbles, Calvin & Hobbes warmth',
  'Looney Tunes cartoon, exaggerated squash and stretch, painted backgrounds, slapstick energy',
  '1920s Steamboat Willie style, black and white rubber hose animation, simple shapes',
  'pointillism, entire image made of tiny colored dots, Seurat style',
  'Mondrian De Stijl, bold black grid lines, primary color blocks, geometric abstraction',
  'Bauhaus design, clean geometric shapes, primary colors, functional minimalism',
  'Soviet Constructivist propaganda poster, bold red and black, angular typography',
  'Art Brut outsider art, raw untrained style, intense emotion, unconventional materials',
  'dark academia aesthetic, leather-bound books, candlelit libraries, autumn tones',
  'heavy metal album cover, dark fantasy, skulls and fire, intricate detail',
  'Blue Note jazz album cover, bold graphic shapes, smoky atmosphere, cool tones',
  'hyperrealistic CGI render, impossibly sharp detail, every pore and fiber visible',
  'kaleidoscope vision, infinite symmetrical reflections, fractal patterns, shifting geometry',
  'Alex Grey visionary art, translucent bodies, energy meridians, cosmic consciousness',
  'Retro sci-fi pulp magazine cover, 1950s ray guns and rockets, bold lettering',
  'Pop surrealism, Mark Ryden style, big-eyed figures, unsettling cute, candy colors',
  'Colorful steampunk illustration, brass gears, copper pipes, Victorian machinery',
  'Retro futurism, sleek chrome, atomic age optimism, space-age design',
  'Surrealism, impossible dreamscape, floating objects, melting reality',
  '3D blind box collectible figure, chibi proportions, glossy vinyl, display packaging',
  'Collage art, cut paper, mixed textures, layered fragments, editorial style',
  'Risograph print, limited color overlap, grainy texture, indie zine aesthetic',
  'Minimalist 80s retro, neon grid, sunset gradient, clean geometric shapes',
  'Glitch art, corrupted pixels, data moshing, digital distortion, vivid color bands',
  'Polygon art, geometric faceted surfaces, crystalline low-poly world',
  'Coloring book style, clean black outlines, white fill, intricate patterns',
  'Fantasy art style, epic and painterly, rich saturated colors, magical atmosphere',
  'Western cartoon style, bold outlines, exaggerated expressions, flat vivid colors',
  'Retro game style, 16-bit sprite art, vibrant pixel palette, nostalgic',
  'Light and airy, soft glowing whites, ethereal luminosity, delicate',
  'Candy aesthetic, glossy sugar-coated surfaces, pastel swirls, sweet and shiny',
  'Bubble aesthetic, iridescent floating spheres, translucent rainbow reflections, dreamy',
  '3D printed, visible layer lines, matte plastic filament, single-color sculptural',
];

const CURATED_SDXL_STYLES = [
  // Kevin's handpicked
  '8-bit pixel art, NES color palette, chunky pixels, retro gaming',
  'Retro anime VHS aesthetic, 1990s cel animation, warm grain, scanlines',
  'Digital illustration, anime style, clean lines, vibrant colors',
  'Studio Ghibli anime watercolor, hand-painted cel animation',
  'Anime illustration, expressive eyes, dynamic composition',
  'Manga panel, detailed ink work, dramatic shading',
  'Van Gogh swirling brushstrokes, vivid blues and yellows, thick impasto',
  'Lo-fi anime dreamscape, cozy room, warm lighting, chill vibes',
  'Makoto Shinkai style with photorealistic anime backgrounds, dramatic sky',
  'Soft shoujo manga illustration, sparkly eyes, flower petals, gentle pastels',
  'A whimsical cottagecore illustration, gentle linework, pastoral',
  // From engine pool
  'shonen manga action scene, speed lines, dramatic angles, high energy',
  'isometric pixel art, retro game aesthetic, crisp edges',
  'lo-fi hip hop album cover, cozy room, warm lighting, anime-inspired chill',
  'Cel-shaded video game cutscene, Zelda Breath of the Wild style',
  'Webtoon digital comic style, clean lines, soft gradients, vertical panel',
  'Anime art, vibrant colors, expressive characters, dynamic action',
  'Japanese illustration, delicate linework, soft washes, elegant composition',
  'Impressionism, loose visible brushstrokes, dappled light, plein air',
  'Marker illustration, bold Copic marker strokes, vibrant ink on paper',
];

interface RequestBody {
  /** Which Flux model to use */
  mode: 'flux-dev' | 'flux-kontext';
  /** User's taste recipe — server builds the prompt from this */
  recipe?: Recipe;
  /** Pre-built prompt */
  prompt?: string;
  /** Optional user hint to weave into the dream */
  hint?: string;
  /** Base64 data URL for flux-kontext (photo-to-image) */
  input_image?: string;
  /** Custom Haiku brief — used for photo reimagining (upload.tsx dream()) */
  haiku_brief?: string;
  /** Fallback prompt if Haiku fails — paired with haiku_brief */
  haiku_fallback?: string;
  /** Photo style: restyle (keep likeness) or reimagine (new scene) */
  photo_style?: 'restyle' | 'reimagine';
  /** Whether to persist the image to Storage (default: true) */
  persist?: boolean;
  /** Skip Haiku enhancement — use raw prompt from recipe engine (faster) */
  skip_enhance?: boolean;
  /** Vibe Profile v2 — two-pass prompt generation */
  vibe_profile?: import('../_shared/vibeProfile.ts').VibeProfile;
  /** Prompt mode for vibe profile generation (legacy) */
  prompt_mode?: import('../_shared/vibeProfile.ts').PromptMode;
  /** V2 engine — curated medium key (e.g., 'watercolor', 'pixels', 'surprise_me') */
  medium_key?: string;
  /** V2 engine — curated vibe key (e.g., 'cinematic', 'epic', 'surprise_me') */
  vibe_key?: string;
  /** Test mode: force a specific cast role ('self', 'plus_one', 'pet', 'self+plus_one', etc.) */
  force_cast_role?: string | null;
  /** Test mode: override medium selection */
  force_medium?: string;
  /** Test mode: override vibe selection */
  force_vibe?: string;
  /** Client-generated job ID for queue tracking */
  job_id?: string;
  /** Style transfer: original post's ai_prompt used as style template for DLT */
  style_prompt?: string;
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');

  if (!REPLICATE_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured: missing REPLICATE_API_TOKEN' }),
      { status: 500 }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Create a user-scoped client from the request's Authorization header.
  // The Supabase gateway already validates the JWT before invoking the function,
  // so we can trust the token and use it to identify the user.
  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(
    supabaseUrl,
    Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey,
    {
      global: { headers: { Authorization: authHeader } },
    }
  );
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    console.error(
      '[generate-dream] Auth failed:',
      authError?.message,
      'header:',
      authHeader.slice(0, 30)
    );
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const userId = user.id;

  // Service role client for database operations (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Parse request body
  let body: RequestBody;
  try {
    body = await req.json();
    console.log(
      '[generate-dream] BODY KEYS:',
      Object.keys(body),
      'force_cast_role:',
      body.force_cast_role
    );
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  let {
    mode,
    recipe,
    vibe_profile,
    prompt_mode,
    medium_key,
    vibe_key,
    prompt: rawPrompt,
    hint,
    input_image,
    haiku_brief,
    haiku_fallback,
    photo_style = 'restyle',
    persist = false,
    skip_enhance = false,
  } = body;

  // Read test-mode params directly from body (bypass TS destructuring issues)
  const force_cast_role = (body as Record<string, unknown>).force_cast_role as
    | string
    | null
    | undefined;
  const force_medium = (body as Record<string, unknown>).force_medium as string | undefined;
  const force_vibe = (body as Record<string, unknown>).force_vibe as string | undefined;
  const force_nightly_path = (body as Record<string, unknown>).force_nightly_path as
    | string
    | undefined;
  const jobId = (body as Record<string, unknown>).job_id as string | undefined;
  const style_prompt = (body as Record<string, unknown>).style_prompt as string | undefined;

  console.log(
    '[generate-dream] RAW TEST PARAMS:',
    JSON.stringify({ force_cast_role, force_medium, force_vibe, medium_key, vibe_key })
  );

  if (!mode || !['flux-dev', 'flux-kontext'].includes(mode)) {
    return new Response(
      JSON.stringify({ error: 'Invalid mode. Must be "flux-dev" or "flux-kontext"' }),
      { status: 400 }
    );
  }

  if (mode === 'flux-kontext' && !input_image) {
    return new Response(JSON.stringify({ error: 'flux-kontext mode requires input_image' }), {
      status: 400,
    });
  }

  if (!recipe && !rawPrompt && !haiku_brief && !vibe_profile && !medium_key && !vibe_key) {
    return new Response(
      JSON.stringify({
        error: 'Must provide recipe, vibe_profile, medium_key, prompt, or haiku_brief',
      }),
      {
        status: 400,
      }
    );
  }

  // ── Timing ─────────────────────────────────────────────────────────────────
  const t0 = Date.now();
  const timings: Record<string, number> = {};
  let lastLap = t0;
  const lap = (label: string) => {
    const now = Date.now();
    const stepMs = now - lastLap;
    const totalMs = now - t0;
    timings[label] = stepMs;
    console.log(`[generate-dream] ⏱ ${label}: ${stepMs}ms (total: ${totalMs}ms)`);
    lastLap = now;
  };

  // ── Rate limit check ──────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const { data: budgetRow } = await supabase
    .from('ai_generation_budget')
    .select('images_generated')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  lap('rate-limit-check');

  const todayCount = budgetRow?.images_generated ?? 0;
  if (todayCount >= MAX_DAILY_GENERATIONS) {
    return new Response(
      JSON.stringify({
        error: 'Daily generation limit reached. Try again tomorrow!',
        retry_after: secondsUntilMidnightUTC(),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // ── Create dream job (queue tracking) ──────────────────────────────────
  if (jobId) {
    try {
      await supabase.from('dream_jobs').insert({
        id: jobId,
        user_id: userId,
        status: 'processing',
      });
    } catch {
      /* non-critical — job tracking is best-effort */
    }
  }

  // ── Build prompt ──────────────────────────────────────────────────────────
  let finalPrompt: string;

  let logAxes: Record<string, unknown> = {};
  let conceptJson: Record<string, unknown> | null = null;
  let photoOverrideMode: string | null = null;
  let resolvedMediumKey: string | undefined;
  let resolvedVibeKey: string | undefined;
  let faceSwapSource: string | undefined; // original photo for face swap after generation

  console.log(
    '[generate-dream] RAW BODY:',
    JSON.stringify({
      medium_key,
      vibe_key,
      photo_style,
      has_input_image: !!input_image,
      hint: hint?.slice(0, 50),
      mode,
    })
  );

  // Nightly path: triggered by my_mediums/my_vibes (legacy) or surprise_me with no user input
  // If user provides a hint or prompt, surprise_me should still honor their input — not random scene
  const isNightly =
    vibe_profile &&
    ((medium_key === 'my_mediums' && vibe_key === 'my_vibes') ||
      (medium_key === 'surprise_me' &&
        vibe_key === 'surprise_me' &&
        !rawPrompt &&
        !hint &&
        !input_image));
  if (isNightly) {
    try {
      // ══════════════════════════════════════════════════════════════════
      // ══ NIGHTLY DREAMBOT PATH — fully isolated, no shared templates ══
      // ══════════════════════════════════════════════════════════════════
      const nightlyProfile = vibe_profile as VibeProfile;
      // Watercolor removed from nightly — Kontext restyle consistently fails to transform
      let nightlyMedium = await resolveMediumFromDb('my_mediums', nightlyProfile.art_styles);
      if (nightlyMedium.key === 'watercolor') {
        nightlyMedium = await resolveMediumFromDb('my_mediums', nightlyProfile.art_styles);
        if (NIGHTLY_SKIP_MEDIUMS.has(nightlyMedium.key)) {
          nightlyMedium = await resolveMediumFromDb('my_mediums', nightlyProfile.art_styles);
          if (NIGHTLY_SKIP_MEDIUMS.has(nightlyMedium.key)) {
            nightlyMedium = await resolveMediumFromDb('anime');
          }
        }
      }
      // Test mode overrides: force specific medium/vibe
      if (force_medium) {
        nightlyMedium = await resolveMediumFromDb(force_medium);
      }
      let nightlyVibe = await resolveVibeFromDb('my_vibes', nightlyProfile.aesthetics);
      if (force_vibe) {
        nightlyVibe = await resolveVibeFromDb(force_vibe);
      }
      resolvedMediumKey = nightlyMedium.key;
      resolvedVibeKey = nightlyVibe.key;

      console.log(
        '[generate-dream] NIGHTLY DREAMBOT | medium:',
        nightlyMedium.key,
        '| vibe:',
        nightlyVibe.key,
        '| force_cast_role:',
        force_cast_role,
        '| typeof:',
        typeof force_cast_role
      );

      // Step 1: Pick a mood-weighted scene template from 6,200+ Sonnet-generated DB templates
      const seeds = nightlyProfile.dream_seeds ?? { characters: [], places: [], things: [] };
      const moods = nightlyProfile.moods ?? {
        peaceful_chaotic: 0.5,
        cute_terrifying: 0.3,
        minimal_maximal: 0.5,
        realistic_surreal: 0.5,
      };
      let dreamSubject: string;

      // Check if we'll inject a cast member — decided before template selection
      // Describe any undescribed cast members server-side via Anthropic vision
      // Describe any undescribed cast members server-side via Llama Vision (Replicate)
      const castMembers = nightlyProfile.dream_cast ?? [];
      const REPLICATE_KEY = Deno.env.get('REPLICATE_API_TOKEN');
      for (const member of castMembers) {
        if (
          !member.description &&
          member.thumb_url &&
          member.thumb_url.startsWith('http') &&
          REPLICATE_KEY
        ) {
          try {
            const descPrompt =
              member.role === 'pet'
                ? 'Describe this animal: species, breed, coat color/pattern, fur texture, eye color, ear shape, size, build, age, distinguishing features. 2-3 sentences.'
                : 'Describe this person for an AI artist creating a stylized character. Include: exact age estimate, face shape, eye color, hair (exact color, length, texture, style), facial hair if any, skin tone, build, clothing colors/style, distinguishing features (glasses, freckles, jewelry, tattoos). 3 sentences max. Be EXTREMELY specific.';
            const createRes = await fetch(
              'https://api.replicate.com/v1/models/meta/llama-3.2-90b-vision/predictions',
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${REPLICATE_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  input: { image: member.thumb_url, prompt: descPrompt, max_tokens: 300 },
                }),
              }
            );
            if (!createRes.ok) throw new Error(`Replicate ${createRes.status}`);
            const pred = await createRes.json();
            for (let i = 0; i < 30; i++) {
              await new Promise((r) => setTimeout(r, 2000));
              const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
                headers: { Authorization: `Bearer ${REPLICATE_KEY}` },
              });
              const pData = await poll.json();
              if (pData.status === 'succeeded') {
                member.description = (
                  Array.isArray(pData.output) ? pData.output.join('') : (pData.output ?? '')
                ).trim();
                console.log(
                  `[generate-dream] Described cast ${member.role}:`,
                  member.description.slice(0, 60)
                );
                break;
              }
              if (pData.status === 'failed') throw new Error(pData.error);
            }
          } catch (descErr) {
            console.warn(
              `[generate-dream] Failed to describe cast ${member.role}:`,
              (descErr as Error).message
            );
          }
        }
      }
      const describedCastMembers = castMembers.filter(
        (m: DreamCastMember) => m.description && m.thumb_url && m.thumb_url.startsWith('http')
      );

      // Roll the dream algorithm (path selection + cast + personal elements)
      const dreamRoll = rollDream(
        describedCastMembers,
        nightlyMedium.key,
        nightlyMedium.faceSwaps,
        force_cast_role,
        force_nightly_path
      );
      const {
        nightlyPath,
        composition,
        castMembers: selectedCast,
        includeLocation,
        includeObject,
      } = dreamRoll;
      const castPick = selectedCast.length > 0 ? (selectedCast[0] as DreamCastMember) : null;
      console.log(
        '[generate-dream] Dream roll:',
        nightlyPath,
        composition,
        '| cast:',
        selectedCast.map((m) => m.role),
        '| location:',
        includeLocation,
        '| object:',
        includeObject
      );

      // Assemble scene from modular pools (Scene DNA engine)
      const userPlace =
        includeLocation && seeds.places.length > 0
          ? seeds.places[Math.floor(Math.random() * seeds.places.length)]
          : undefined;
      const thingsPool = [...seeds.things, ...seeds.characters];
      const userThing =
        includeObject && thingsPool.length > 0
          ? thingsPool[Math.floor(Math.random() * thingsPool.length)]
          : undefined;

      // Fetch essence cards in parallel (lazy-generates on first encounter)
      let locationCard: LocationCard | null = null;
      let objectCard: ObjectCard | null = null;
      const cardPromises: Promise<void>[] = [];
      if (userPlace && ANTHROPIC_KEY) {
        cardPromises.push(
          getLocationCard(userPlace, ANTHROPIC_KEY)
            .then((c) => {
              locationCard = c;
            })
            .catch((err) => {
              console.warn('[generate-dream] Location card failed:', (err as Error).message);
            })
        );
      }
      if (userThing && ANTHROPIC_KEY) {
        cardPromises.push(
          getObjectCard(userThing, ANTHROPIC_KEY)
            .then((c) => {
              objectCard = c;
            })
            .catch((err) => {
              console.warn('[generate-dream] Object card failed:', (err as Error).message);
            })
        );
      }
      if (cardPromises.length > 0) await Promise.all(cardPromises);
      console.log(
        '[generate-dream] Essence cards | place:',
        userPlace ?? 'none',
        '| locationCard:',
        locationCard ? locationCard.cinematic_phrases.length + ' phrases' : 'null',
        '| thing:',
        userThing ?? 'none',
        '| objectCard:',
        objectCard ? objectCard.visual_forms.length + ' forms' : 'null'
      );
      lap('essence-cards');

      dreamSubject = assembleScene({
        isFaceSwap:
          nightlyMedium.faceSwaps &&
          composition === 'character' &&
          castPick != null &&
          castPick.role !== 'pet',
        includeLocation,
        includeObject,
        userPlace,
        userThing,
        locationCard: locationCard ?? undefined,
        objectCard: objectCard ?? undefined,
        moodAxis: moods,
      });

      console.log('[generate-dream] Scene DNA:', dreamSubject.slice(0, 200));
      lap('nightly-subject');

      // Step 2: Shared context for both cast and non-cast paths
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
      const shotDirection = SHOT_DIRECTIONS[Math.floor(Math.random() * SHOT_DIRECTIONS.length)];

      const moodWords = (m: typeof moods) => {
        const axis = (val: number, low: string, mid: string, high: string) =>
          val < 0.3 ? low : val > 0.7 ? high : mid;
        return [
          axis(m.peaceful_chaotic, 'peaceful', 'balanced energy', 'chaotic'),
          axis(m.cute_terrifying, 'cute and warm', 'balanced light and dark', 'dark and intense'),
          axis(
            m.minimal_maximal,
            'minimal and clean',
            'moderate detail',
            'maximalist, more-is-more'
          ),
          axis(
            m.realistic_surreal,
            'grounded and realistic',
            'somewhat dreamlike',
            'fully surreal'
          ),
        ].join(', ');
      };

      // Build personal context — use card data when available (budget: 2 location phrases, 1 object phrase)
      const dreamerWorld: string[] = [];
      if (includeLocation && userPlace) {
        if (
          locationCard &&
          locationCard.cinematic_phrases &&
          locationCard.cinematic_phrases.length > 0
        ) {
          const pick2 = locationCard.cinematic_phrases.sort(() => Math.random() - 0.5).slice(0, 2);
          dreamerWorld.push(`Location texture: ${pick2.join(', ')}`);
        } else {
          dreamerWorld.push(`Set the scene in or near: ${userPlace}`);
        }
      }
      if (includeObject && userThing) {
        if (objectCard && objectCard.visual_forms && objectCard.visual_forms.length > 0) {
          const form =
            objectCard.visual_forms[Math.floor(Math.random() * objectCard.visual_forms.length)];
          dreamerWorld.push(`Scene object: ${form}`);
        } else {
          dreamerWorld.push(`Include this object naturally in the scene: ${userThing}`);
        }
      }
      const dreamerContext =
        dreamerWorld.length > 0
          ? `\nPERSONAL ELEMENTS — weave these into the scene:\n- ${dreamerWorld.join('\n- ')}`
          : '';
      const avoidList = nightlyProfile.avoid?.length
        ? `\nNEVER INCLUDE: ${nightlyProfile.avoid.join(', ')}`
        : '';

      // ── DREAM COMPOSITION PATHS ──
      const mediumStyle = nightlyMedium.key.replace(/_/g, ' ');

      // Build cast description block for Sonnet
      const castDescBlock =
        selectedCast.length > 0
          ? selectedCast
              .map((m, i) => {
                const desc =
                  (m as DreamCastMember).description ??
                  (m.role === 'pet' ? 'a small creature' : 'a figure');
                return selectedCast.length === 1
                  ? `THE MAIN CHARACTER (include these traits but STYLIZED — NOT photorealistic):\n${desc}`
                  : `CHARACTER ${i + 1} (${m.role}):\n${desc}`;
              })
              .join('\n\n')
          : '';
      const castInstruction =
        selectedCast.length > 1
          ? `Render ALL ${selectedCast.length} characters as ${mediumStyle} CHARACTERS — stylized, artistic. Show them TOGETHER interacting in the scene.`
          : selectedCast.length === 1
            ? `Render them as a ${mediumStyle} CHARACTER — stylized, illustrated, artistic. NOT a real photograph.`
            : '';

      const shortCastDesc = castPick
        ? (castPick.description?.split(',')[0] ??
          (castPick.role === 'pet' ? 'a small creature' : 'a figure'))
        : null;

      let nightlyBrief: string;

      if (composition === 'character') {
        const isFaceSwapScene = nightlyMedium.faceSwaps && castPick && castPick.role !== 'pet';

        if (isFaceSwapScene) {
          // Face-swap brief: scene first, then HARD face lock, then character
          nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

STRUCTURE:
1. Start with: "${nightlyMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (50% of words)
3. SUBJECT FRAMING (must be early in the prompt)
4. CHARACTER (20% of words)
5. CAMERA + MOOD (20% of words)
6. End with: no text, no words, no letters, no watermarks, ultra detailed

SCENE (make it EPIC):
${dreamSubject}

MANDATORY — include this EXACT phrase unchanged somewhere in the prompt:
"front-facing subject facing the camera, three-quarter front angle, eyes visible, no back view, no rear angle"

COMPOSITION RULES (must obey):
- Subject facing camera. No back view. No rear angle. No over-the-shoulder. No silhouette.
- No crouching, no kneeling, no looking down, no looking away from camera.
- The character is visible and facing the viewer in the scene.

CHARACTER IN THE SCENE:
${castDescBlock}
Do NOT over-describe the face. Just "natural human face" is enough. Push detail into clothing, pose, and environment.

MOOD: ${nightlyVibe.directive}
${dreamerContext}${avoidList}

RULES:
- SCENE FIRST, then the mandatory face phrase, then character details.
- Include "foreground midground background, layered composition" in the prompt.
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;
        } else {
          // Non-face-swap brief: standard scene-first approach
          nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

CRITICAL STRUCTURE — follow this order EXACTLY:
1. Start with: "${nightlyMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (spend 60% of words here — this is the star)
3. CHARACTER placed naturally in the scene (spend 20% of words)
4. CAMERA + MOOD (spend 20% of words)
5. End with: no text, no words, no letters, no watermarks, ultra detailed

SCENE (describe this world — make it EPIC):
${dreamSubject}

CHARACTER IN THE SCENE:
${castDescBlock}
${castInstruction}

MOOD: ${nightlyVibe.directive}
${dreamerContext}${avoidList}

RULES:
- SCENE FIRST in the prompt. The environment must be rich, detailed, layered.
- Include "foreground midground background, layered composition" in the prompt.
- The character is IN the world, not posing for a portrait.
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;
        }
        logAxes = {
          medium: nightlyMedium.key,
          vibe: nightlyVibe.key,
          engine: 'nightly-cast-character',
          nightlyPath,
          castRoles: selectedCast.map((m) => m.role),
        };
      } else if (composition === 'epic_tiny') {
        const tinyDesc =
          selectedCast.length > 1
            ? `tiny ${mediumStyle}-style figures: ${selectedCast.map((m) => m.description?.split(',')[0] ?? m.role).join(' and ')}`
            : `a tiny ${mediumStyle}-style ${shortCastDesc}`;
        nightlyBrief = `You are a cinematographer composing an EPIC, VAST scene. Write a Flux AI prompt (60-90 words, comma-separated).

MEDIUM: ${nightlyMedium.fluxFragment}

STYLE GUIDE (follow this closely):
${nightlyMedium.directive}

DREAM SCENE (this is the ENTIRE focus — describe in maximum vivid detail):
${dreamSubject}

Somewhere in this vast scene, barely visible: ${tinyDesc}. They occupy less than 5% of the image. The scene is EVERYTHING.

CAMERA: ${shotDirection}
MOOD: ${nightlyVibe.directive}
${dreamerContext}${avoidList}

Write the prompt:
1. Start with the art medium
2. Spend 90% of words on the ENVIRONMENT — architecture, physics, materials, light, weather
3. Mention the tiny ${selectedCast.length > 1 ? 'figures' : 'character'} in ONE short phrase at the very end
4. End with: no text, no words, no letters, no watermarks, hyper detailed
Output ONLY the prompt.`;
        logAxes = {
          medium: nightlyMedium.key,
          vibe: nightlyVibe.key,
          engine: 'nightly-cast-epic',
          nightlyPath,
          castRoles: selectedCast.map((m) => m.role),
        };
      } else {
        // ── Pure scene — no character, just breathtaking art ──
        nightlyBrief = `You are a cinematographer composing a single breathtaking frame. Write a Flux AI prompt (60-90 words, comma-separated).

MEDIUM: ${nightlyMedium.fluxFragment}

DREAM SCENE (this is sacred — do NOT water it down):
${dreamSubject}

CAMERA/COMPOSITION: ${shotDirection}
MOOD: ${nightlyVibe.directive}
${dreamerContext}${avoidList}

Write the prompt:
1. Start with the art medium
2. Describe the EXACT scene — every surreal detail preserved
3. NO PEOPLE. NO CHARACTERS. NO FIGURES. Pure environment.
4. Name specific materials, textures, light sources (NOUNS not adjectives)
5. End with: no text, no words, no letters, no watermarks, hyper detailed, masterwork composition
Output ONLY the prompt.`;
        logAxes = {
          medium: nightlyMedium.key,
          vibe: nightlyVibe.key,
          engine: 'nightly-pure-scene',
        };
      }

      try {
        finalPrompt = await nightlySonnet(nightlyBrief, ANTHROPIC_KEY, 200);
        if (finalPrompt.length < 20) throw new Error('too short');
      } catch {
        finalPrompt = `${nightlyMedium.fluxFragment}, ${dreamSubject}, ${nightlyVibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, no text, hyper detailed`;
      }

      // Post-process: brute force face lock for face-swap dreams.
      // Even if Sonnet dropped or weakened the face constraints, this appends them.
      const isFaceSwapDream =
        nightlyMedium.faceSwaps &&
        composition === 'character' &&
        castPick &&
        castPick.role !== 'pet';
      if (isFaceSwapDream) {
        finalPrompt +=
          ', front-facing subject facing the camera, three-quarter front angle, head turned toward camera, eyes visible, no back view, no rear angle, no silhouette';
      }

      // Face swap for nightly cast dreams — humans only, not pets.
      // Only fires when: (a) single human cast member selected, (b) medium supports face swap,
      // (c) composition includes a character (not pure_scene).
      if (
        castPick &&
        castPick.role !== 'pet' &&
        castPick.thumb_url &&
        castPick.thumb_url.startsWith('http') &&
        nightlyMedium.faceSwaps &&
        composition !== 'pure_scene' &&
        selectedCast.length === 1
      ) {
        faceSwapSource = castPick.thumb_url;
        console.log(
          `[generate-dream] 🎭 Nightly face swap: ${castPick.role} → ${nightlyMedium.key}`
        );
      }

      console.log(
        `[generate-dream] Nightly ${nightlyPath}/${composition}:`,
        finalPrompt.slice(0, 200)
      );
      lap('nightly-done');
    } catch (nightlyErr) {
      console.error(
        '[generate-dream] NIGHTLY PATH CRASHED:',
        (nightlyErr as Error).message,
        (nightlyErr as Error).stack
      );
      return new Response(
        JSON.stringify({ error: `Nightly path error: ${(nightlyErr as Error).message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else if (medium_key || vibe_key) {
    // ── V2 ENGINE: Medium + Vibe directive-based generation ──────────
    const vibeProfile = vibe_profile as VibeProfile | undefined;

    // Resolve medium and vibe to real curated entries — never store placeholders
    const medium = await resolveMediumFromDb(medium_key, vibeProfile?.art_styles);
    const vibe = await resolveVibeFromDb(vibe_key, vibeProfile?.aesthetics);

    resolvedMediumKey = medium.key;
    resolvedVibeKey = vibe.key;

    const isPhoto = !!input_image;
    console.log(
      '[generate-dream] V2 ENGINE | medium:',
      medium.key,
      '| vibe:',
      vibe.key,
      '| isPhoto:',
      isPhoto,
      '| photo_style:',
      photo_style,
      '| has_input_image:',
      !!input_image
    );

    if (isPhoto && photo_style === 'reimagine') {
      // ── REIMAGINE (solo): vision describe → medium template or generic brief → flux-dev ──
      console.log('[generate-dream] ⏱ REIMAGINE: starting vision...');
      try {
        const photoDescription = await describeWithVision(
          input_image!,
          VISION_PROMPTS.photoSubject,
          REPLICATE_TOKEN,
          100
        );
        lap('reimagine-vision');
        console.log('[generate-dream] ⏱ Vision done:', photoDescription.slice(0, 120));

        const userHint = hint ?? '';
        const reimagineTemplate = buildReimaginePrompt(
          medium.key,
          photoDescription,
          userHint,
          vibe.directive!
        );

        if (reimagineTemplate) {
          finalPrompt = await enhanceViaHaiku(
            reimagineTemplate,
            reimagineTemplate,
            ANTHROPIC_KEY,
            150
          );
        } else {
          const styleRef = style_prompt
            ? `\n- Reference style (match this aesthetic): ${style_prompt.slice(0, 300)}`
            : '';
          const genericBrief = `Write a Flux AI prompt (50-70 words, comma-separated phrases) for an image:
- Start with: "${medium.fluxFragment}"
- Subject from photo: ${photoDescription}
- The user wants: ${userHint || 'a creative reimagining'}
- Render in ${medium.key} style
- Mood: ${vibe.directive!.slice(0, 200)}${styleRef}
- Framing: waist-up to three-quarter body. The person's face must be clearly visible and well-lit. Show the person IN the scene, interacting with elements around them. The environment should be visible — don't crop it out.
- DO NOT invent your own scenario — use the user's request EXACTLY
Output ONLY the prompt.`;
          finalPrompt = await enhanceViaHaiku(genericBrief, genericBrief, ANTHROPIC_KEY, 150);
        }

        photoOverrideMode = 'flux-dev';
        // No face swap — reimagine produces a likeness-based caricature, not an exact photo
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-reimagine',
        };
        console.log('[generate-dream] Reimagine prompt:', finalPrompt.slice(0, 150));
      } catch (err) {
        console.error('[generate-dream] REIMAGINE FAILED:', (err as Error).message);
        // Fallback: use the hint as a raw prompt with medium styling
        finalPrompt = `${medium.fluxFragment}, ${hint ?? 'a creative scene'}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-reimagine-fallback',
          error: (err as Error).message,
        };
      }
      lap('reimagine-done');
    } else if (isPhoto) {
      // ── RESTYLE: per-medium config determines model and prompt ──
      const config = getPhotoRestyleConfig(medium.key);

      if (config && config.model === 'flux-dev') {
        // Vision describe → Haiku rewrite → flux-dev
        const photoDescription = await describeWithVision(
          input_image!,
          VISION_PROMPTS.photoSubject,
          REPLICATE_TOKEN,
          100
        );
        console.log(
          '[generate-dream] Restyle (flux-dev) photo description:',
          photoDescription.slice(0, 120)
        );
        const restyleBrief = config.buildPrompt(
          photoDescription,
          vibe.directive!.slice(0, 200),
          hint ?? ''
        );
        finalPrompt = await enhanceViaHaiku(restyleBrief, restyleBrief, ANTHROPIC_KEY, 150);
        photoOverrideMode = 'flux-dev';
      } else if (config) {
        // Kontext-max: send instruction directly (NO Haiku rewrite)
        finalPrompt = config.buildPrompt('', vibe.directive!.slice(0, 200), hint ?? '');
        finalPrompt +=
          '\nIMPORTANT: The person must be RECOGNIZABLE — keep their face, features, and likeness. Render them in the art style but they must still look like the same person.';
      } else {
        // No medium-specific config — use generic Kontext restyle
        finalPrompt = `Transform this photo into ${medium.fluxFragment ?? medium.key} style. Keep the same person, same pose, same expression, facing the camera. ${vibe.directive!.slice(0, 200)} Portrait 9:16.${hint ? ` ${hint}` : ''}`;
      }

      logAxes = {
        medium: medium.key,
        vibe: vibe.key,
        engine: config?.model === 'flux-dev' ? 'v2-restyle-fluxdev' : 'v2-restyle-kontext',
      };
      console.log('[generate-dream] Restyle prompt:', finalPrompt.slice(0, 150));
      lap('restyle-done');
    } else {
      // ── TEXT PATH ──
      const userSubject = rawPrompt ?? hint ?? '';

      // Detect self-references ("put me", "I am", "myself") → inject cast description + face swap
      // Only use cast photo when there's NO attached photo — if a photo is attached, the reimagine path handles it
      const selfCast = !isPhoto
        ? vibeProfile?.dream_cast?.find(
            (m: DreamCastMember) => m.role === 'self' && m.thumb_url && m.description
          )
        : undefined;
      const mentionsSelf =
        userSubject &&
        selfCast &&
        /\b(put me|place me|make me|show me|me as|me in|me on|me at|me \w+ing|i am|i'm|myself|my face)\b/i.test(
          userSubject
        );

      if (mentionsSelf && userSubject) {
        // ── SELF-INSERT TEXT PATH: user's description + face swap from cast photo ──
        const selfDesc = selfCast.description
          .replace(/^#.*\n/gm, '')
          .replace(/\*\*/g, '')
          .slice(0, 250);
        console.log('[generate-dream] 🎭 SELF-INSERT TEXT: injecting cast description + face swap');

        try {
          const selfBrief = `You are a cinematographer. Write a Flux AI prompt (60-80 words, comma-separated).

=== THE MAIN CHARACTER (THIS IS THE USER — render them EXACTLY as described, especially their gender) ===
${selfDesc}

GENDER LOCK — non-negotiable: the character's gender, sex, age, build, ethnicity, and core features above are SACRED. If they are male, render them MALE with masculine features and masculine clothing. If they are female, render them FEMALE. NEVER swap genders. NEVER put a male character in a dress, gown, skirt, corset, or feminine bodice. NEVER feminize a masculine subject's hair or features. NEVER masculinize a feminine subject. The style below is ONLY a rendering treatment — it does not change who the character is.

=== SCENE — the user asked for ===
${userSubject}

=== STYLE (apply this aesthetic to the character above, respecting their gender) ===
${medium.directive}

=== MOOD ===
${vibe.directive}

COMPOSITION — THIS IS CRITICAL:
${(() => {
  const shots = [
    '1. HEAD AND SHOULDERS framing — face fills ~30% of the frame. Person interacting with one key prop or element.',
    '1. CHEST-UP framing — face fills ~25% of the frame. Show the person holding, touching, or using something from the scene.',
    '1. WAIST-UP framing — face fills ~20% of the frame. Person actively engaged in the scene — gesturing, reaching, leaning.',
    '1. THREE-QUARTER BODY framing — show from knees up. Face fills ~15% of the frame. Person surrounded by scene elements, interacting with the environment.',
  ];
  return shots[Math.floor(Math.random() * shots.length)];
})()}
2. Face must be CLEARLY VISIBLE and well-lit — no tiny faces, no silhouettes, no faces in shadow
3. NEVER use full body shots, extreme wide shots, aerial views, or show the person tiny in a vast landscape
4. Show the character DOING something — interacting with objects, environment, or props from the scene
5. Name specific materials, textures, light sources
6. End with: no text, no words, no letters, no watermarks, hyper detailed
Output ONLY the prompt.`;

          finalPrompt = await nightlySonnet(selfBrief, ANTHROPIC_KEY, 200);
          if (finalPrompt.length < 10) throw new Error('too short');

          // Face swap only if the medium supports it (from DB)
          if (medium.faceSwaps) {
            faceSwapSource = selfCast.thumb_url;
          }
          logAxes = {
            medium: medium.key,
            vibe: vibe.key,
            engine: 'v2-self-insert-text',
            faceSwap: medium.faceSwaps,
          };
          console.log('[generate-dream] Self-insert prompt:', finalPrompt.slice(0, 150));
          lap('self-insert-done');
        } catch (err) {
          console.error('[generate-dream] SELF-INSERT FAILED:', (err as Error).message);
          finalPrompt = `${medium.fluxFragment}, ${userSubject}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, no text, no words, no letters, no watermarks, hyper detailed`;
          logAxes = {
            medium: medium.key,
            vibe: vibe.key,
            engine: 'v2-self-insert-fallback',
            error: (err as Error).message,
          };
          lap('self-insert-done');
        }
      } else if (style_prompt) {
        // Style transfer: merge the original post's style with the user's subject
        const stSubject = userSubject || 'a surprising new scene that fits this style';
        const styleTransferBrief = `You are a cinematographer. You have a reference Flux AI prompt that produced a stunning image.
Your job: write a NEW Flux AI prompt (60-90 words, comma-separated) that keeps the EXACT same visual style, mood, lighting, color palette, and medium technique — but with a DIFFERENT subject.

REFERENCE PROMPT (copy the style, NOT the subject):
"${style_prompt.slice(0, 500)}"

NEW SUBJECT (the user wants this):
"${stSubject}"

Rules:
1. Start with the same art medium/style fragment as the reference
2. Preserve the lighting, palette, mood, and compositional approach
3. Replace the subject entirely with the user's request
4. End with: no text, no words, no letters, no watermarks, hyper detailed
Output ONLY the prompt.`;

        try {
          finalPrompt = await nightlySonnet(styleTransferBrief, ANTHROPIC_KEY, 200);
          if (finalPrompt.length < 10) throw new Error('too short');
        } catch {
          finalPrompt = `${medium.fluxFragment}, ${stSubject}, ${vibe.directive && vibe.directive.split('.')[0] ? vibe.directive.split('.')[0] : 'dramatic atmosphere'}, no text, no words, no letters, no watermarks, hyper detailed`;
        }

        logAxes = { medium: medium.key, vibe: vibe.key, engine: 'v2-style-transfer' };
        console.log('[generate-dream] V2 style transfer:', finalPrompt.slice(0, 150));
        lap('style-transfer-done');
      } else if (userSubject) {
        // User provided a prompt — subject-first brief so the medium styles the subject rather than replacing it
        const userBrief = `You are a cinematographer. Write a Flux AI prompt (60-90 words, comma-separated).

=== SUBJECT (THIS IS WHAT YOU ARE DRAWING — it MUST be the focus of the image) ===
${userSubject}

The subject above is non-negotiable. Whatever the user described MUST appear prominently in the frame. Do NOT substitute with atmospheric scenery or generic props. If they said "a girl", draw the girl. If they said "a fox", draw the fox. If they said "a castle", draw the castle. The style below is ONLY a rendering treatment — it does not replace the subject.

=== STYLE (apply this aesthetic treatment to the subject above) ===
${medium.directive}

=== MOOD ===
${vibe.directive}

Write the Flux prompt:
1. START the prompt by describing the SUBJECT in rich detail — who they are, what they look like, their pose, their expression, what they are doing. Expand any vague user description with specifics that fit the style.
2. THEN describe the environment AROUND the subject (still keeping the subject as the focus)
3. THEN add the style descriptors: "${medium.fluxFragment}"
4. Name specific materials, textures, light sources (NOUNS not adjectives)
5. End with: no text, no words, no letters, no watermarks, hyper detailed

The final Flux prompt should feel like "[detailed subject description], [environment that surrounds them], [medium style], [mood]" — never like "[medium style] scene with [subject mentioned]".

CREATIVITY RULES:
- Do NOT default to horns, demon features, or Maleficent-style tropes on characters. Reach for more interesting accessories and features: unusual hair colors and styles, hats, masks, jewelry, tattoos, unusual eye colors, freckles, face paint, scars, antlers (only if animal-appropriate), unusual clothing textures, unusual pets, etc.
- Invent details that feel surprising but fitting for the medium and subject.

Output ONLY the prompt.`;

        try {
          finalPrompt = await nightlySonnet(userBrief, ANTHROPIC_KEY, 200);
          if (finalPrompt.length < 10) throw new Error('too short');
        } catch {
          finalPrompt = `${medium.fluxFragment}, ${userSubject}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, no text, no words, no letters, no watermarks, hyper detailed`;
        }

        logAxes = { medium: medium.key, vibe: vibe.key, engine: 'v2-text-directive' };
        console.log('[generate-dream] V2 text (directive):', finalPrompt.slice(0, 150));
        lap('text-prompt-done');
      } else {
        // No user prompt — user picked a specific medium — invent a scene that showcases IT
        const v2Brief = `You are an art director. Write a Flux AI prompt (60-90 words, comma-separated) that perfectly showcases this art medium at its best.

=== MEDIUM (this is what you are showcasing) ===
${medium.directive}

Flux fragment: ${medium.fluxFragment}

=== MOOD ===
${vibe.directive}

Invent a SUBJECT AND SCENE that this medium renders beautifully — whatever would look most iconic in this style. Pick something concrete: a character, creature, or signature scene element the medium is known for. Build the environment around that subject. Apply the medium's style language to everything.

Rules:
1. Start with a concrete subject, not an abstract environment
2. The subject should feel inevitable for this medium — the thing it was made to render
3. Name specific materials, textures, light sources (NOUNS not adjectives)
4. Do NOT default to horns, demon features, or Maleficent-style tropes on characters — reach for more interesting details: unusual hair, hats, masks, jewelry, tattoos, unusual eye colors, freckles, face paint, scars, unusual clothing, unusual pets
5. End with: no text, no words, no letters, no watermarks, hyper detailed

Output ONLY the prompt.`;

        try {
          finalPrompt = await nightlySonnet(v2Brief, ANTHROPIC_KEY, 200);
          if (finalPrompt.length < 10) throw new Error('too short');
        } catch {
          finalPrompt = `${medium.fluxFragment}, ${dreamScene}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, no text, no words, no letters, no watermarks, hyper detailed`;
        }

        logAxes = { medium: medium.key, vibe: vibe.key, engine: 'v2-surprise' };
        console.log('[generate-dream] V2 surprise (nightly-quality):', finalPrompt.slice(0, 150));
        lap('surprise-done');
      }
    }
    lap('v2-engine-done');
  } else if (rawPrompt) {
    finalPrompt = rawPrompt;
    lap('prompt-raw');
  } else if (haiku_brief) {
    finalPrompt = await enhanceViaHaiku(haiku_brief, haiku_fallback ?? haiku_brief, ANTHROPIC_KEY);
    lap('prompt-haiku-brief');
  } else if (vibe_profile) {
    // LEGACY TWO-PASS VIBE ENGINE
    const vibeProfile = vibe_profile as VibeProfile;
    const promptMode = (prompt_mode as PromptMode) ?? 'dream_me';

    // Pass 1: Concept Generator
    let concept: ConceptRecipe;
    let conceptBrief = buildConceptPrompt(vibeProfile, promptMode, Math.random());

    console.log('[generate-dream] hint received:', hint ? hint.slice(0, 80) : 'NONE');
    console.log('[generate-dream] input_image:', input_image ? 'YES' : 'NO');
    console.log('[generate-dream] prompt_mode:', promptMode);

    // Inject style reference BEFORE concept generation — hard override
    if (hint) {
      conceptBrief = `${hint}\n\n---\n\n${conceptBrief}`;
      console.log('[generate-dream] Style hint injected at TOP of concept brief');
    }

    // If photo is attached, tell the concept generator to reimagine it
    if (input_image) {
      conceptBrief += `\n\nIMPORTANT: This is a PHOTO REIMAGINING. The user uploaded a photo. KEEP THE MAIN SUBJECT — whatever or whoever is in the photo MUST remain the focus. Reimagine everything AROUND the subject: transform the environment, change the art style, add fantastical elements, alter the lighting and mood. The subject stays, the world changes. This is NOT a replacement — it's a creative reimagining of the same subject in a dream world.`;
    }

    console.log('[generate-dream] Concept brief length:', conceptBrief.length);
    console.log('[generate-dream] Concept brief tail:', conceptBrief.slice(-200));

    try {
      const conceptRaw = await haikuJson(conceptBrief, ANTHROPIC_KEY, 600);
      console.log('[generate-dream] Haiku concept JSON:', conceptRaw.slice(0, 200));
      concept = JSON.parse(conceptRaw) as ConceptRecipe;
      conceptJson = concept as unknown as Record<string, unknown>;
      console.log('[generate-dream] Concept style:', concept.style);
      console.log('[generate-dream] Concept palette:', concept.palette);
    } catch (err) {
      console.warn(
        '[generate-dream] Concept parse failed, using fallback:',
        (err as Error).message
      );
      concept = buildFallbackConcept(vibeProfile);
    }

    // Pass 2: Prompt Polisher
    const polisherBrief = buildPolisherPrompt(concept);
    try {
      const polished = await enhanceViaHaiku(polisherBrief, '', ANTHROPIC_KEY, 150);
      finalPrompt = polished.length >= 10 ? polished : buildFallbackFluxPrompt(concept);
    } catch {
      finalPrompt = buildFallbackFluxPrompt(concept);
    }

    console.log('[generate-dream] Final Flux prompt:', finalPrompt.slice(0, 150));

    lap('two-pass-done');
  } else if (recipe) {
    // THREE-PART SONG (legacy): roll which dream type this is
    // 50% archetype (focused narrative), 30% chord (pure blend), 20% beauty (pure visual)
    const dreamRoll = Math.random();
    const dreamMode = dreamRoll < 0.5 ? 'archetype' : dreamRoll < 0.8 ? 'chord' : 'beauty';

    let archetype:
      | {
          key: string;
          name: string;
          prompt_context: string;
          flavor_keywords: string[];
          trigger_interests?: string[];
          trigger_moods?: string[];
        }
      | undefined;
    if (dreamMode === 'archetype') {
      try {
        const { data: userArchs } = await supabase
          .from('user_archetypes')
          .select('archetype_id')
          .eq('user_id', userId);
        if (userArchs && userArchs.length > 0) {
          const randomArch = userArchs[Math.floor(Math.random() * userArchs.length)];
          const { data: arch } = await supabase
            .from('dream_archetypes')
            .select('key, name, prompt_context, flavor_keywords, trigger_interests, trigger_moods')
            .eq('id', randomArch.archetype_id)
            .single();
          if (arch) archetype = arch;
        }
      } catch {
        /* non-critical — falls back to chord path */
      }
    }

    // Build ingredients — archetype identity injected into Haiku brief, not the engine
    const input = buildPromptInput(recipe);

    // Pick a random style from the full pot (Flux + SDXL), route accordingly
    const allStyles = [...CURATED_FLUX_STYLES, ...CURATED_SDXL_STYLES];
    input.medium = allStyles[Math.floor(Math.random() * allStyles.length)];

    logAxes = {
      medium: input.medium,
      mood: input.mood,
      lighting: input.lighting,
      interests: input.interests,
      dreamSubject: input.dreamSubject,
      sceneType: input.sceneType,
      action: input.action,
      settingKeywords: input.settingKeywords,
      eraKeywords: input.eraKeywords,
      sceneAtmosphere: input.sceneAtmosphere,
      colorKeywords: input.colorKeywords,
      weirdnessModifier: input.weirdnessModifier,
      scaleModifier: input.scaleModifier,
      personalityTags: input.personalityTags,
      spiritAppears: input.spiritAppears,
      spiritCompanion: input.spiritCompanion,
      archetype: archetype?.key ?? 'none',
      dreamMode,
    };
    const fallback = buildRawPrompt(input);

    if (skip_enhance) {
      finalPrompt = fallback;
      lap('prompt-raw-skip');
    } else {
      let haikuBrief: string;

      if (dreamMode === 'beauty') {
        // BEAUTY MODE: pure visual poetry — environment, light, texture, no characters
        haikuBrief = `You are painting a place, not telling a story. No characters, no figures, no creatures. Just a breathtaking environment that makes someone stop scrolling and stare.

Think: the light after a storm. A canyon at golden hour. An alien ocean at dawn. A forest floor after rain. Textures you can feel. Light that has weight. Depth that pulls you in.

Medium: ${input.medium}
Setting: ${input.settingKeywords}, ${input.eraKeywords}
Mood: ${input.mood}, ${input.lighting}
Palette: ${input.colorKeywords || 'vivid and expressive'}
Weather: ${input.sceneAtmosphere}

Write an image prompt (max 50 words). Start with the art medium. You can go macro (a single dewdrop, a crack in ancient stone) or epic (an infinite horizon, a cathedral of clouds). Just make it GORGEOUS. No people. No text. Output ONLY the prompt.`;
      } else {
        // CHORD or ARCHETYPE mode — use the standard Chord template
        haikuBrief = buildHaikuPrompt(input);

        // If archetype is active, inject its creative brief so Haiku knows the identity
        if (archetype) {
          haikuBrief += `\n\nTONIGHT'S DREAM IDENTITY: ${archetype.name}\n${archetype.prompt_context}\n\nUse the ingredients above but channel them through this identity. The dream should feel like it came from "${archetype.name}."`;
        }
      }

      logAxes.promptPath = dreamMode + (archetype ? '+' + archetype.key : '');

      if (hint) {
        haikuBrief += `\n\nIMPORTANT: The user requested "${hint}". Make this the heart of the dream — use their taste profile to style it, but this wish is the subject.`;
      }

      // Store what we sent to Haiku so we can compare input vs output
      logAxes.haikuBrief = haikuBrief.slice(0, 2000);

      finalPrompt = await enhanceViaHaiku(haikuBrief, fallback, ANTHROPIC_KEY);
      logAxes.usedFallback = finalPrompt === fallback;
      lap('prompt-haiku-recipe');
    }
  } else {
    return new Response(JSON.stringify({ error: 'No prompt source provided' }), { status: 400 });
  }

  const effectiveMode = photoOverrideMode ?? mode;
  const effectiveInputImage = photoOverrideMode ? undefined : input_image;

  finalPrompt = sanitizePrompt(finalPrompt);

  const { model: pickedModel } = pickModel(effectiveMode, finalPrompt, resolvedMediumKey);
  logAxes.model = pickedModel;
  console.log(
    `[generate-dream] User ${userId}, mode=${effectiveMode}, model=${pickedModel}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  // ── Generate image via Replicate ──────────────────────────────────────────
  try {
    console.log(`[generate-dream] ⏱ Starting image generation (model: ${pickedModel})...`);
    let tempUrl = await generateImage(
      effectiveMode,
      finalPrompt,
      effectiveInputImage,
      REPLICATE_TOKEN
    );
    lap('image-gen');
    console.log(`[generate-dream] ⏱ Image generation complete`);

    // Face swap: paste original face onto generated image
    if (faceSwapSource && tempUrl) {
      try {
        let sourceUrl: string;
        let swapFileName: string | null = null;
        if (faceSwapSource.startsWith('http')) {
          // Already a public URL (e.g., cast thumb_url)
          sourceUrl = faceSwapSource;
          lap('face-swap-upload');
        } else {
          // Base64 data URL — upload to temp storage first
          console.log('[generate-dream] ⏱ Starting face swap upload...');
          const base64Data = faceSwapSource.replace(/^data:image\/\w+;base64,/, '');
          const swapBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          swapFileName = `temp/${userId}/faceswap-${Date.now()}.jpg`;
          await supabase.storage
            .from('uploads')
            .upload(swapFileName, swapBytes, { contentType: 'image/jpeg', upsert: true });
          const { data: swapUrlData } = supabase.storage.from('uploads').getPublicUrl(swapFileName);
          sourceUrl = swapUrlData.publicUrl;
          lap('face-swap-upload');
        }
        console.log('[generate-dream] ⏱ Face swap upload done, starting swap...');

        tempUrl = await faceSwap(sourceUrl, tempUrl, REPLICATE_TOKEN);

        if (swapFileName) {
          supabase.storage
            .from('uploads')
            .remove([swapFileName])
            .catch(() => {});
        }
        lap('face-swap-model');
        console.log('[generate-dream] ⏱ Face swap complete');
        logAxes.faceSwapResult = 'success';
      } catch (err) {
        console.warn(
          '[generate-dream] Face swap failed, using unswapped image:',
          (err as Error).message
        );
        logAxes.faceSwapResult = 'failed';
        logAxes.faceSwapError = (err as Error).message;
      }
    }

    let imageUrl = tempUrl;

    // Persist to Storage + log in parallel (log doesn't need the permanent URL)
    timings.total = Date.now() - t0;
    const [persistedUrl] = await Promise.all([
      persistToStorage(tempUrl, userId, supabase),
      supabase
        .from('ai_generation_log')
        .insert({
          user_id: userId,
          recipe_snapshot: recipe ?? {},
          rolled_axes: { ...logAxes, timings },
          enhanced_prompt: finalPrompt,
          model_used: pickedModel,
          cost_cents: 3,
          status: 'completed',
        })
        .then(() => {})
        .catch(() => {}),
    ]);
    imageUrl = persistedUrl;
    lap('persist-done');

    // Draft upload + budget upsert in parallel (both need imageUrl but not each other)
    let uploadId: string | undefined;
    const caption = finalPrompt.length > 200 ? finalPrompt.slice(0, 197) + '...' : finalPrompt;
    const [uploadResult] = await Promise.all([
      supabase
        .from('uploads')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          caption,
          ai_prompt: finalPrompt,
          ai_concept: conceptJson,
          dream_medium: resolvedMediumKey ?? null,
          dream_vibe: resolvedVibeKey ?? null,
          is_active: false,
          is_posted: false,
          width: 768,
          height: 1664,
        })
        .select('id')
        .single(),
      supabase
        .from('ai_generation_budget')
        .upsert(
          {
            user_id: userId,
            date: today,
            images_generated: todayCount + 1,
            total_cost_cents: (todayCount + 1) * 3,
          },
          { onConflict: 'user_id,date' }
        )
        .then(() => {})
        .catch(() => {}),
    ]);
    uploadId = uploadResult.data?.id;
    if (uploadResult.error) {
      console.error('[generate-dream] Failed to create draft upload:', uploadResult.error.message);
    }

    // Job update + notification in parallel (both need uploadId but not each other)
    const notifBody = hint
      ? `dream:Your dream is ready: ${hint.slice(0, 150)}`
      : `dream:Your dream is ready: ${resolvedMediumKey ?? 'surprise'}/${resolvedVibeKey ?? 'surprise'}`;

    await Promise.all([
      jobId
        ? supabase
            .from('dream_jobs')
            .update({
              status: 'done',
              result_image_url: imageUrl,
              result_prompt: finalPrompt,
              result_medium: resolvedMediumKey ?? null,
              result_vibe: resolvedVibeKey ?? null,
              upload_id: uploadId ?? null,
              completed_at: new Date().toISOString(),
            })
            .eq('id', jobId)
            .then(() => {})
            .catch(() => {})
        : Promise.resolve(),
      uploadId
        ? supabase
            .from('notifications')
            .insert({
              recipient_id: userId,
              actor_id: userId,
              type: 'dream_generated',
              upload_id: uploadId,
              body: notifBody,
            })
            .then(() => {})
            .catch(() => {})
        : Promise.resolve(),
    ]);

    lap('total');
    console.log(`[generate-dream] ✅ Done in ${Date.now() - t0}ms for user ${userId}`);

    return new Response(
      JSON.stringify({
        image_url: imageUrl,
        prompt_used: finalPrompt,
        ai_concept: conceptJson,
        dream_mode: logAxes.dreamMode ?? mode,
        archetype: logAxes.archetype ?? null,
        model: logAxes.model ?? null,
        resolved_medium: resolvedMediumKey ?? null,
        resolved_vibe: resolvedVibeKey ?? null,
        job_id: jobId ?? null,
        upload_id: uploadId ?? null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const errMsg = (err as Error).message;
    console.error(`[generate-dream] Error for user ${userId}:`, errMsg);

    // Update dream job on failure
    if (jobId) {
      const isNsfw = errMsg.includes('NSFW') || errMsg.includes('safety');
      try {
        await supabase
          .from('dream_jobs')
          .update({
            status: isNsfw ? 'nsfw' : 'failed',
            error: errMsg,
            completed_at: new Date().toISOString(),
          })
          .eq('id', jobId);

        // Refund sparkle server-side for NSFW (client may not receive the error)
        if (isNsfw) {
          await supabase.rpc('grant_sparkles', {
            p_user_id: userId,
            p_amount: 1,
            p_reason: 'nsfw_refund',
          });
        }
      } catch {
        /* non-critical */
      }
    }

    return new Response(JSON.stringify({ error: errMsg }), { status: 500 });
  }
});

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Call Haiku expecting a JSON response. Uses prefilled assistant to force raw JSON output. */
async function haikuJson(
  brief: string,
  anthropicKey: string | undefined,
  maxTokens: number = 300
): Promise<string> {
  if (!anthropicKey) throw new Error('No API key');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [
        { role: 'user', content: brief },
        { role: 'assistant', content: '{' },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Haiku ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text?.trim() ?? '';
  // Prepend the { we prefilled
  return '{' + text;
}

async function enhanceViaHaiku(
  brief: string,
  fallback: string,
  anthropicKey: string | undefined,
  maxTokens: number = 150
): Promise<string> {
  if (!anthropicKey) return fallback;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: brief }],
      }),
    });
    if (!res.ok) throw new Error(`Haiku ${res.status}`);
    const data = await res.json();
    const text = data.content?.[0]?.text?.trim() ?? '';
    return text.length >= 10 ? text : fallback;
  } catch (err) {
    console.warn('[generate-dream] Haiku fallback:', (err as Error).message);
    return fallback;
  }
}

/** Sonnet call — used ONLY by the nightly DreamBot path for higher creativity */
async function nightlySonnet(
  brief: string,
  anthropicKey: string | undefined,
  maxTokens: number = 200
): Promise<string> {
  if (!anthropicKey) throw new Error('No API key');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: brief }],
    }),
  });
  if (!res.ok) throw new Error(`Sonnet ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text?.trim() ?? '';
  if (text.length < 10) throw new Error('Sonnet response too short');
  console.log('[generate-dream] Sonnet nightly prompt:', text.slice(0, 150));
  return text;
}

// Route to the best model based on the medium/prompt content
function pickModel(
  mode: string,
  prompt: string,
  mediumKey?: string
): { model: string; inputOverrides: Record<string, unknown> } {
  const sdxlOverrides = { width: 768, height: 1344, num_inference_steps: 30, guidance_scale: 7.5 };

  if (mode === 'flux-kontext') {
    return { model: 'black-forest-labs/flux-kontext-pro', inputOverrides: {} };
  }

  // SDXL routing by medium key
  const SDXL_ALWAYS = new Set(['anime', 'pixels']);
  const SDXL_HALF = new Set<string>(); // 50/50 SDXL vs Flux
  if (mediumKey && SDXL_ALWAYS.has(mediumKey)) {
    return { model: 'sdxl', inputOverrides: sdxlOverrides };
  }
  if (mediumKey && SDXL_HALF.has(mediumKey) && Math.random() < 0.5) {
    return { model: 'sdxl', inputOverrides: sdxlOverrides };
  }

  // SDXL fallback by keyword (for legacy/recipe paths — only when no medium key provided)
  if (!mediumKey) {
    const p = prompt.toLowerCase();
    if (
      p.includes('anime') ||
      p.includes('manga') ||
      p.includes('pixel art') ||
      p.includes('8-bit') ||
      p.includes('16-bit')
    ) {
      return { model: 'sdxl', inputOverrides: sdxlOverrides };
    }
  }

  // Default: Flux Dev
  return { model: 'black-forest-labs/flux-dev', inputOverrides: {} };
}

async function generateImage(
  mode: string,
  prompt: string,
  inputImage: string | undefined,
  replicateToken: string
): Promise<string> {
  const { model, inputOverrides } = pickModel(mode, prompt);
  const isSDXL = model === 'sdxl';
  const SDXL_VERSION = '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc';

  const input: Record<string, unknown> = {
    prompt,
    ...(!isSDXL
      ? {
          aspect_ratio: '9:16',
          num_outputs: 1,
          output_format: 'jpg',
        }
      : {
          width: 768,
          height: 1344,
          num_outputs: 1,
        }),
    ...inputOverrides,
  };

  if (mode === 'flux-kontext' && inputImage) {
    input.input_image = inputImage;
    input.output_quality = 90;
    input.safety_tolerance = 2;
    input.prompt_upsampling = true;
  }

  // SDXL uses version-based API, Flux uses model-based API
  const url = isSDXL
    ? 'https://api.replicate.com/v1/predictions'
    : `https://api.replicate.com/v1/models/${model}/predictions`;
  const body = isSDXL ? { version: SDXL_VERSION, input } : { input };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    const body = await res.json();
    const retryAfter = body.retry_after ?? 6;
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return generateImage(mode, prompt, inputImage, replicateToken);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Replicate submit failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  if (!data.id) throw new Error('No prediction ID');

  // Poll for result
  const maxPolls = mode === 'flux-kontext' ? 30 : 60;
  const intervalMs = mode === 'flux-kontext' ? 2000 : 1500;

  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'succeeded') {
      const url = typeof pollData.output === 'string' ? pollData.output : pollData.output?.[0];
      if (url) return url;
    }
    if (pollData.status === 'failed' || pollData.status === 'canceled') {
      const errMsg = pollData.error ?? 'unknown';
      const isNsfw =
        /nsfw|safety|content.?filter|inappropriate|violat/i.test(errMsg) ||
        /nsfw|safety/i.test(JSON.stringify(pollData.logs ?? ''));
      if (isNsfw) {
        throw new Error('NSFW_CONTENT: The generated image was flagged by our safety filters.');
      }
      throw new Error(`Generation ${pollData.status}: ${errMsg}`);
    }
  }
  throw new Error('Generation timed out');
}

async function persistToStorage(
  tempUrl: string,
  userId: string,
  supabase: ReturnType<typeof createClient>
): Promise<string> {
  const resp = await fetch(tempUrl);
  if (!resp.ok) throw new Error(`Failed to download image: ${resp.status}`);
  const buf = await resp.arrayBuffer();

  // Detect actual image format from magic bytes
  const bytes = new Uint8Array(buf.slice(0, 4));
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const ext = isPng ? 'png' : 'jpg';
  const contentType = isPng ? 'image/png' : 'image/jpeg';

  const fileName = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('uploads').upload(fileName, buf, { contentType });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

function secondsUntilMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  return Math.ceil((midnight.getTime() - now.getTime()) / 1000);
}

function sanitizePrompt(prompt: string): string {
  return prompt
    .replace(/\bbaby\b/gi, 'small cute character')
    .replace(/\binfant\b/gi, 'small cute character')
    .replace(/\btoddler\b/gi, 'small character')
    .replace(/\bchild\b/gi, 'young character')
    .replace(/\bchildren\b/gi, 'young characters')
    .replace(/\bkid\b/gi, 'young character')
    .replace(/\bkids\b/gi, 'young characters')
    .replace(/\bminor\b/gi, 'young person')
    .replace(/\bcrib\b/gi, 'small cozy bed')
    .replace(/\bnursery\b/gi, 'cozy room')
    .replace(/\bdiaper\b/gi, 'outfit')
    .replace(/\bonesie\b/gi, 'romper suit')
    .replace(/\bnewborn\b/gi, 'tiny character')
    .replace(/\b\d+[\s-]*months?\s*old\b/gi, 'very small')
    .replace(/\bnude\b/gi, '')
    .replace(/\bnaked\b/gi, '');
}

/** Swap the face from sourceImage onto targetImage using codeplugtech/face-swap. */
async function faceSwap(
  sourceImageDataUrl: string,
  targetImageUrl: string,
  replicateToken: string
): Promise<string> {
  // Create prediction using codeplugtech/face-swap (version-based API)
  const FACE_SWAP_VERSION = '278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34';
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: FACE_SWAP_VERSION,
      input: {
        swap_image: sourceImageDataUrl,
        input_image: targetImageUrl,
      },
    }),
  });

  if (!res.ok) throw new Error(`Face swap create failed: ${res.status}`);
  const data = await res.json();
  if (!data.id) throw new Error('No prediction ID from face swap');

  // Poll for result (45 attempts × 2s = 90s max — model can cold-start slowly)
  for (let i = 0; i < 45; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'succeeded') {
      const url = typeof pollData.output === 'string' ? pollData.output : pollData.output?.[0];
      if (url) return url;
    }
    if (pollData.status === 'failed' || pollData.status === 'canceled') {
      throw new Error(`Face swap ${pollData.status}: ${pollData.error ?? 'unknown'}`);
    }
  }
  throw new Error('Face swap timed out');
}

interface CompanionMatch {
  roles: string[];
  members: DreamCastMember[];
  _faceSwapSources?: string[];
}

/**
 * Detect companion references in the user's prompt and match to cast members.
 * Returns null if no companions detected or no matching cast data.
 */
function detectCompanionRequest(hint: string, cast: DreamCastMember[]): CompanionMatch | null {
  const lower = hint.toLowerCase();
  const roles: string[] = [];
  const members: DreamCastMember[] = [];

  // Plus one patterns
  const plusOnePatterns = [
    /\b(?:my|the)\s+(?:wife|husband|partner|girlfriend|boyfriend|fiancee?|spouse|significant other|babe|boo)\b/i,
    /\b(?:me\s+and|with)\s+(?:my|the)\s+(?:wife|husband|partner|girlfriend|boyfriend|fiancee?|spouse|significant other|babe|boo)\b/i,
    /\b(?:\+1|plus\s*one|plus\s*1)\b/i,
    /\b(?:me\s+and|with)\s+(?:my|the)\s+(?:\+1|plus\s*one|plus\s*1)\b/i,
    /\bus\b.*\btogether\b/i,
    /\bcouple\b/i,
  ];

  // Pet patterns
  const petPatterns = [
    /\b(?:my|the|our)\s+(?:dog|cat|pet|puppy|kitten|bird|parrot|bunny|rabbit|hamster|guinea pig)\b/i,
    /\b(?:me\s+and|with)\s+(?:my|the|our)\s+(?:dog|cat|pet|puppy|kitten|bird|parrot|bunny|rabbit|hamster|guinea pig)\b/i,
  ];

  const plusOne = cast.find((m) => m.role === 'plus_one' && m.description && m.thumb_url);
  const pet = cast.find((m) => m.role === 'pet' && m.description && m.thumb_url);

  if (plusOne && plusOnePatterns.some((p) => p.test(lower))) {
    roles.push('plus_one');
    members.push(plusOne);
  }

  if (pet && petPatterns.some((p) => p.test(lower))) {
    roles.push('pet');
    members.push(pet);
  }

  if (members.length === 0) return null;

  console.log('[detectCompanionRequest] Matched roles:', roles, 'from hint:', hint.slice(0, 80));
  return { roles, members };
}
