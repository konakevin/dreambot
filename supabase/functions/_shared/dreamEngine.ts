/**
 * Dream Engine Categories — the curated medium and vibe definitions that power DreamBot.
 *
 * Each medium directive tells Haiku how a master of that craft thinks.
 * Each vibe directive shapes the mood, lighting, composition, and emotion.
 * Combined, they produce stunning results regardless of user input.
 *
 * "My Mediums" / "My Vibes" = personalized from user's profile
 * "Surprise Me" = random pick from the full curated pool
 */

// ── Types ───────────────────────────────────────────────────────────────

export interface DreamMedium {
  key: string;
  label: string;
  /** Creative brief for Haiku's concept generator. null = derived at runtime */
  directive: string | null;
  /** Technical prefix for the final Flux prompt. null = derived at runtime */
  fluxFragment: string | null;
}

export interface DreamVibe {
  key: string;
  label: string;
  /** Creative brief for Haiku's concept generator. null = derived at runtime */
  directive: string | null;
}

// ── Mediums ─────────────────────────────────────────────────────────────

export const DREAM_MEDIUMS: DreamMedium[] = [
  {
    key: 'my_mediums',
    label: 'My Mediums',
    directive: null,
    fluxFragment: null,
  },
  {
    key: 'surprise_me',
    label: 'Surprise Me',
    directive: null,
    fluxFragment: null,
  },
  {
    key: 'pixel_art',
    label: 'Pixel Art',
    directive:
      'You are designing a scene as a pixel art master. Think SNES-era craftsmanship — every single pixel is intentional. Use a limited, harmonious color palette (16-32 colors max). Dithering for gradients. Visible pixel grid but with sophisticated color choices that create depth and atmosphere. The constraint of the medium IS the beauty — find elegance in the limitation. Think Superbrothers, Hyper Light Drifter, or Celeste. Environments should have layered parallax depth. Characters should have iconic silhouettes readable at low resolution. Lighting is achieved through palette shifts, not gradients.',
    fluxFragment:
      '16-bit pixel art, carefully placed pixels, limited harmonious color palette, dithered gradients, retro game aesthetic, crisp pixel edges',
  },
  {
    key: 'watercolor',
    label: 'Watercolor',
    directive:
      "You are a master watercolorist working wet-on-wet on cold-pressed Arches paper. Your genius is knowing when to STOP — watercolor's beauty is in what you leave unpainted. The white of the paper is your brightest light. Build transparent layers: light washes first, then richer pigment in the shadows. Let colors bloom and bleed into each other at the edges — controlled accidents are your signature. Granulating pigments (cerulean, raw umber, burnt sienna) create natural texture. Lost-and-found edges: some boundaries sharp and defined, others dissolving into nothing. The painting should look effortless, like it happened in one confident sitting.",
    fluxFragment:
      'Watercolor painting on textured paper, transparent layered washes, wet-on-wet blooms, soft bleeding edges, white paper glowing through, visible confident brushstrokes, granulating pigments',
  },
  {
    key: 'oil_painting',
    label: 'Oil Painting',
    directive:
      "You are painting in the tradition of the great oil painters — think the emotional weight of Rembrandt's light, the color boldness of Sorolla, the textural bravery of Freud. Thick impasto in the lights, thinner transparent darks. The paint itself is a character — visible palette knife marks, loaded brushstrokes that catch light on their ridges. Color mixing happens on the canvas, not just the palette — adjacent strokes of different hues vibrate against each other. Rich, warm undertones even in cool passages. The painting should feel like it has physical weight and took weeks of layered sessions.",
    fluxFragment:
      'Oil painting on canvas, thick impasto brushstrokes, visible palette knife texture, rich layered glazes, Rembrandt-inspired chiaroscuro lighting, warm undertones, painterly color mixing',
  },
  {
    key: 'anime',
    label: 'Anime',
    directive:
      "You are a top-tier anime production designer — think Makoto Shinkai's backgrounds married with Ghibli's character warmth. Clean, confident linework with varying weight (thick outlines, thin details). Flat cel-shaded color with strategic gradient shading on skin and hair. Eyes are expressive windows — large, detailed, with multiple light reflections. Backgrounds are painted with photographic detail and atmospheric perspective while characters maintain clean graphic simplicity. The contrast between detailed world and stylized characters creates the anime magic. Hair and fabric should have dynamic flow suggesting movement even in still frames.",
    fluxFragment:
      'Anime illustration, clean ink linework, cel-shaded coloring, expressive detailed eyes, Makoto Shinkai inspired backgrounds, dynamic hair flow, vibrant saturated colors',
  },
  {
    key: 'lego',
    label: 'LEGO',
    directive:
      "Everything in this scene is built entirely from LEGO bricks. Every surface, every object, every element of nature — all LEGO. Water is translucent blue bricks. Fire is orange and yellow pieces. Trees are green leaf elements on brown trunk pieces. The ground has visible studs. Characters are minifigures with painted expressions and snap-on accessories. The genius is in the creative problem-solving — how do you represent clouds, water, smoke, light with rigid plastic bricks? That constraint creates charm. Lighting should be realistic as if this is a photograph of an actual LEGO diorama on someone's table.",
    fluxFragment:
      'LEGO brick diorama, everything constructed from LEGO pieces, plastic studs visible on every surface, minifigure characters, photographed like a real LEGO set, soft realistic lighting',
  },
  {
    key: 'claymation',
    label: 'Claymation',
    directive:
      'This is a scene from a premium stop-motion animation studio — think Laika (Coraline, Kubo) or Aardman (Wallace & Gromit). Characters and objects are sculpted from smooth, matte clay with subtle fingerprint textures that remind you a human hand shaped them. Eyes are glass beads or painted spheres. Fabric textures are knitted or felted at miniature scale. Sets are handcrafted — painted plywood backdrops, miniature furniture with visible construction. Lighting is theatrical, with warm practicals and cool ambient fill. Everything has that slightly imperfect, handmade quality that makes stop-motion feel alive.',
    fluxFragment:
      'Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures, glass bead eyes, handcrafted miniature sets, theatrical warm lighting, Laika Studios quality',
  },
  {
    key: '3d_render',
    label: '3D Render',
    directive:
      'You are a Pixar-level character designer and environment artist. Everything has that premium animated film quality — soft, rounded shapes with appealing proportions. Subsurface scattering on skin makes characters glow with life. Materials are physically accurate but stylized: glossy eyes with complex reflections, soft cloth with microfiber detail, translucent ears and fingertips. Environments are lush with volumetric lighting — god rays, atmospheric haze, warm bounce light. Color palettes are carefully art-directed, not random. Every frame should look like it could be a poster for a $200M animated feature.',
    fluxFragment:
      'Pixar-quality 3D render, soft rounded appealing shapes, subsurface scattering, volumetric lighting, physically based materials, vibrant art-directed color palette, cinematic depth of field',
  },
  {
    key: 'pencil_sketch',
    label: 'Pencil Sketch',
    directive:
      "You are a master draftsman in the tradition of Da Vinci's notebooks and Sargent's charcoal portraits. Every line has purpose and confidence — no scratchy uncertainty. Build form through hatching and cross-hatching, varying the density and direction to sculpt three-dimensional volume on flat paper. Leave areas of pure white paper for your brightest highlights. The darkest values come from layered graphite compressed into velvet blacks. Smudged tones for atmospheric depth. The beauty is in the LINE — its weight, its rhythm, its economy. One confident stroke can describe an entire fold of fabric or the curve of a cheekbone.",
    fluxFragment:
      'Detailed pencil sketch on textured paper, confident graphite linework, hatching and cross-hatching, dramatic tonal range from white paper to velvet blacks, masterful draftsmanship',
  },
  {
    key: 'neon',
    label: 'Neon',
    directive:
      "This scene is lit entirely by neon — glowing tube lights, LED strips, holographic projections. The background is dark (night, deep shadow, black surfaces) so the neon POPS with maximum contrast. Colors are electric: hot pink, cyan, purple, acid green, amber. Neon light bounces off wet surfaces — rain-slicked streets, chrome, glass — creating doubled reflections and color bleeds. There's atmospheric haze or fog that makes the light beams visible. The aesthetic is premium cyberpunk meets Tokyo night photography. Every surface is a canvas for reflected neon color.",
    fluxFragment:
      'Neon-lit night scene, glowing tube lights, electric cyan and hot pink, rain-slicked reflective surfaces, atmospheric fog catching light beams, dark moody background, cyberpunk noir',
  },
  {
    key: 'stained_glass',
    label: 'Stained Glass',
    directive:
      "This entire scene is rendered as a grand stained glass window — the kind you'd find in a medieval cathedral but with modern subject matter. Bold black leading lines (cames) define every shape with confident graphic clarity. Each glass piece is a single jewel-tone color: ruby red, sapphire blue, emerald green, amber gold, deep purple. Light appears to come from BEHIND the glass, making everything glow with translucent luminosity. Composition should be symmetrical or radially balanced, like a rose window. Small detailed pieces in faces and focal points, larger simple pieces in backgrounds. The constraints of the medium create graphic power.",
    fluxFragment:
      'Stained glass window artwork, bold black leading lines, jewel-tone translucent colors glowing with backlight, ruby sapphire emerald amber, graphic symmetrical composition, cathedral quality',
  },
  {
    key: 'comic_book',
    label: 'Comic Book',
    directive:
      "You are designing a splash page for a premium graphic novel — think Mike Mignola's bold shadows, Moebius's intricate worlds, or Fiona Staples's emotional characters. Bold confident ink outlines with varying line weight — thick for silhouettes and shadows, thin for interior detail. Flat areas of saturated color with Ben-Day dot patterns in the mid-tones. Dynamic composition with dramatic angles — low shots looking up, extreme foreshortening, Dutch angles. Motion lines and speed streaks for energy. Sound effect typography integrated into the composition. The page should feel like it's bursting with kinetic energy.",
    fluxFragment:
      'Comic book art, bold ink outlines, dynamic composition, halftone Ben-Day dots, saturated flat colors, dramatic foreshortening, kinetic energy, graphic novel splash page quality',
  },
  {
    key: 'embroidery',
    label: 'Embroidery',
    directive:
      'Every element in this scene is rendered as if stitched by hand on fabric. Cross-stitch for flat areas with visible grid texture. Satin stitch for smooth surfaces and lettering. French knots for dots and texture points. Long-and-short stitch for gradients and shading. The fabric background (natural linen or cotton) is visible between stitched elements. Thread colors are rich and saturated — DMC embroidery floss palette. The hoop or frame edge might be partially visible. Light catches the raised thread creating subtle dimensionality. The patience and craft of handwork should radiate from every element.',
    fluxFragment:
      'Hand embroidery on linen fabric, cross-stitch and satin stitch techniques, visible thread texture, rich DMC floss colors, fabric background showing through, raised dimensional stitching',
  },
  {
    key: 'disney',
    label: 'Storybook',
    directive:
      'You are a classic Disney 2D animation artist from the Renaissance era — think The Lion King, The Little Mermaid, Aladdin. Characters have expressive, emotive faces with large eyes that convey personality. Clean, confident ink outlines with smooth, flowing lines. Rich cel-painted color with luminous highlights and soft shadows. Backgrounds are lush painted environments — every frame is a work of art. Hair and fabric flow with exaggerated, graceful movement. Characters feel alive with warmth, appeal, and personality. The magic of hand-drawn animation radiates from every stroke.',
    fluxFragment:
      'Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors, expressive character design, luminous highlights, Renaissance Disney quality',
  },
  {
    key: 'sack_boy',
    label: 'Sack Boy',
    directive:
      'Everything in this scene is crafted from real-world materials at miniature scale — the LittleBigPlanet aesthetic. Characters are knitted fabric dolls with visible stitching, button eyes, and zipper mouths. Their bodies are soft stuffed forms with yarn hair and felt accessories. The environment is built from cardboard, corrugated paper, fabric swatches, sponge, cork, and stickers. Platforms are wooden rulers and tape rolls. Backgrounds are painted cardboard with visible brush marks. Everything has that handmade, tactile, craft-table quality — you can almost feel the textures. Lighting is warm and soft like a desk lamp illuminating a craft project.',
    fluxFragment:
      'LittleBigPlanet Sack Boy style, knitted fabric characters, button eyes, zipper details, cardboard and craft material world, visible stitching, handmade tactile quality, warm desk lamp lighting',
  },
  {
    key: 'funko_pop',
    label: 'Funko Pop',
    directive:
      'Everything is rendered as a Funko Pop vinyl collectible figure. Characters have massively oversized heads (3x body proportion) with tiny bodies, small dot eyes, no mouth (or tiny line mouth), and simplified features. The surface is glossy vinyl plastic with a subtle sheen. Hair is a solid sculpted plastic piece. Clothing details are painted on, not textured. The figure stands on a small circular black base. The aesthetic is cute, collectible, and stylized — maximum personality through minimal features. Think of it as a photograph of the actual vinyl figure on a shelf.',
    fluxFragment:
      'Funko Pop vinyl figure style, oversized head, tiny body, glossy plastic surface, dot eyes, no mouth, painted clothing details, collectible figure on display base, product photography',
  },
  {
    key: 'ghibli',
    label: 'Ghibli',
    directive:
      "You are a Studio Ghibli artist — think Spirited Away, My Neighbor Totoro, Howl's Moving Castle. The style is softer and more painterly than standard anime. Characters have natural, rounded proportions — not exaggerated anime features. Eyes are expressive but realistic in size. Skin tones are warm with soft watercolor-like shading. Backgrounds are breathtakingly detailed painted landscapes with incredible atmospheric perspective — clouds that feel alive, grass that sways, water that sparkles. There is a sense of quiet wonder and lived-in warmth in every scene. Nature is almost a character itself. The palette is rich but never harsh — earthy greens, sky blues, warm golds.",
    fluxFragment:
      'Studio Ghibli animation style, soft painterly rendering, warm natural color palette, detailed painted backgrounds, atmospheric clouds, gentle character design, Miyazaki quality, hand-painted cel animation',
  },
  {
    key: 'tim_burton',
    label: 'Gothic',
    directive:
      "You are designing in Tim Burton's signature gothic whimsy style — think Nightmare Before Christmas, Corpse Bride, Edward Scissorhands. Characters have exaggerated proportions: impossibly thin limbs, elongated necks, oversized heads with sunken eyes ringed in dark circles. Spiral motifs everywhere — in hair, architecture, landscapes. The color palette is stark: predominantly black, white, and grey with strategic pops of deep purple, blood red, or sickly green. Environments are crooked and angular — buildings lean, trees twist, fences curl. Stripes (black and white) appear on clothing and objects. Everything feels slightly unsettling but endearing — dark whimsy, not horror.",
    fluxFragment:
      'Tim Burton gothic style, spindly elongated limbs, spiral motifs, black and white with purple accents, crooked angular architecture, sunken dark-ringed eyes, dark whimsical aesthetic',
  },
  {
    key: 'pop_art',
    label: 'Pop Art',
    directive:
      'You are creating in the style of Andy Warhol and Roy Lichtenstein. Bold, flat areas of highly saturated primary and secondary colors — red, blue, yellow, green, orange, purple at maximum intensity. Ben-Day dots (halftone pattern) fill shadows and mid-tones. Thick black outlines define every shape with graphic clarity. The image may be divided into 2-4 color variations of the same subject (Warhol grid style). Text elements, speech bubbles, or onomatopoeia can be integrated. The aesthetic is commercial, graphic, and unapologetically bold — advertising meets fine art. No subtlety, no gradients — flat color and graphic power.',
    fluxFragment:
      'Pop art style, Andy Warhol screen print, bold flat primary colors at maximum saturation, Ben-Day halftone dots, thick black outlines, graphic commercial aesthetic',
  },
  {
    key: 'minecraft',
    label: 'Minecraft',
    directive:
      'Everything in this scene is built from cubic voxel blocks — the Minecraft aesthetic. Characters are blocky with square heads, rectangular bodies, and pixelated skin textures mapped onto flat cube faces. Every surface is a grid of textured blocks — dirt, stone, wood planks, grass with flowers. Trees are columns of wood blocks topped with leaf blocks. Water is translucent blue blocks. The sky has square clouds. Lighting creates blocky shadows. The charm is in the constraint — representing complex scenes with nothing but cubes. It should look like a screenshot from inside the game, or a photograph of a LEGO-like diorama made of cubes.',
    fluxFragment:
      'Minecraft voxel style, everything built from cubic blocks, pixelated block textures, square character heads, blocky terrain, grass and dirt blocks, game screenshot aesthetic',
  },
  {
    key: '8bit',
    label: '8-Bit',
    directive:
      "You are creating NES-era 8-bit pixel art — think original Mario, Mega Man, Legend of Zelda on the NES. This is MORE primitive than 16-bit SNES pixel art. The color palette is extremely limited (12-16 colors max from the NES palette). Pixels are LARGE and chunky — very low resolution. Characters are simple — 2-pixel eyes, no detail in faces, iconic silhouettes only. No dithering, no gradients — flat color blocks only. Backgrounds are simple repeating tile patterns. The aesthetic is charming BECAUSE of its severe limitations. Everything should feel like it's running on 1985 hardware.",
    fluxFragment:
      'NES 8-bit pixel art, extremely limited color palette, large chunky pixels, very low resolution, simple iconic character sprites, flat color blocks, retro 1985 gaming aesthetic',
  },
  {
    key: 'felt',
    label: 'Felt',
    directive:
      'You are creating a scene in the style of Laika stop-motion films — think Coraline, Kubo and the Two Strings. Characters are needle-felted wool puppets with visible fiber texture on their skin. Eyes are hand-painted with eerie precision. Hair is individual strands of dyed wool carefully placed. Clothing is real miniature fabric — tiny stitches visible, real buttons, actual thread seams. The world is a handcrafted miniature set built from real materials — wood, fabric, paper, wire — but at a tiny scale. Lighting is dramatic and cinematic, casting long shadows across the miniature sets. Everything has that slightly uncanny, beautiful-but-unsettling quality that makes Laika films unforgettable.',
    fluxFragment:
      'Needle-felted stop-motion puppet, visible wool fiber texture, hand-crafted miniature set, real fabric clothing with tiny stitches, Laika Studios Coraline quality, dramatic cinematic lighting, handmade miniature world',
  },
];

// ── Vibes ───────────────────────────────────────────────────────────────

export const DREAM_VIBES: DreamVibe[] = [
  {
    key: 'my_vibes',
    label: 'My Vibes',
    directive: null,
  },
  {
    key: 'surprise_me',
    label: 'Surprise Me',
    directive: null,
  },
  {
    key: 'cinematic',
    label: 'Cinematic',
    directive:
      'This is a frame from an Oscar-winning film. Compose it in 2.39:1 widescreen — use the horizontal space to create tension between subject and environment. Lighting is motivated by a visible or implied source: a window, a streetlight, a fire. Three-point lighting with the key at 45 degrees creating sculpted shadows on faces. Color grade is teal-and-orange or a deliberate complementary palette. Depth is created with atmospheric haze between foreground and background. Every element in frame serves the story. The viewer should feel like something just happened or is about to happen — frozen narrative tension.',
  },
  {
    key: 'dreamy',
    label: 'Dreamy',
    directive:
      "Everything floats in a soft, ethereal haze. Light doesn't come from one direction — it seems to emanate from within the scene itself, creating a gentle omnidirectional glow. Colors are pastels shifted toward lavender, blush pink, powder blue, and soft gold. Edges dissolve into each other — nothing has a hard boundary. There's a sense of weightlessness: objects might float slightly, fabric drifts without wind, hair defies gravity. The atmosphere is thick with soft particles — pollen, dust motes, tiny lights. The scene should feel like the moment between sleeping and waking when reality is beautifully uncertain.",
  },
  {
    key: 'dark',
    label: 'Dark',
    directive:
      "Embrace the shadows. The majority of the frame is in deep shadow — rich, velvety blacks and near-blacks. Light is rare and precious: a single candle, a crack under a door, moonlight through clouds. Where light exists, it creates dramatic contrast — bright highlights against crushing darks. Color palette is severely restricted: deep teal, dried blood red, cold steel blue, desaturated amber. The mood is contemplative and weighty, not necessarily scary — think Caravaggio's dramatic chiaroscuro or Gregory Crewdson's suburban noir. Negative space is powerful. What you can't see matters as much as what you can.",
  },
  {
    key: 'chaos',
    label: 'Chaos',
    directive:
      "Rules don't exist here. Multiple conflicting light sources in impossible colors. Perspective bends — parallel lines converge wrong, scale shifts within the frame. Colors CLASH deliberately: electric complementaries at maximum saturation. Textures collide — organic next to geometric, smooth against rough. Composition breaks the frame — elements extend beyond the edges, overlap uncomfortably, create visual tension. There's too much to look at and that's the point. The scene should feel like it's vibrating with unstable energy, like reality is glitching. Beautiful in its overwhelming excess.",
  },
  {
    key: 'cozy',
    label: 'Cozy',
    directive:
      'Everything is warm and close. The scene is an intimate space — small rooms, nooks, corners, sheltered spots. Lighting is soft and warm: candlelight, string lights, fireplace glow, golden afternoon sun through curtains. The color palette centers on warm neutrals: cream, honey, cinnamon, soft rust, forest green. Textures you want to touch: chunky knit blankets, worn wood, ceramic mugs, soft fur, old book pages. The composition is close and enveloping — the viewer is IN the cozy space, not observing from outside. Depth of field is shallow, making the immediate surroundings feel like a warm embrace. Steam rising from something hot.',
  },
  {
    key: 'minimal',
    label: 'Minimal',
    directive:
      'Less is everything. One subject, vast negative space. The background is a single tone or a subtle gradient — it exists only to make the subject sing. Composition is mathematical: perfect center, extreme rule-of-thirds, or radical asymmetry. Color palette is two to three colors maximum, and one dominates 80% of the frame. Every element that could be removed HAS been removed. What remains must be perfect in form and placement. Lighting is clean and simple — one source, soft or hard, creating a clear statement. The image should feel like a held breath — quiet, deliberate, and impossible to simplify further.',
  },
  {
    key: 'epic',
    label: 'Epic',
    directive:
      "SCALE. The subject exists within something impossibly vast — towering mountains, endless skies, cathedral-sized interiors, cosmic expanses. Camera angle is extreme: dramatic low angle looking up, or a high wide shot that reveals the world's enormity. Atmospheric perspective creates depth — foreground sharp and saturated, background fading through layers of haze. Light is dramatic and directional: god rays breaking through clouds, golden hour painting everything warm, or cold blue moonlight illuminating a vast landscape. The color palette is rich and full-range. The viewer should feel small and awed, like standing at the edge of the Grand Canyon.",
  },
  {
    key: 'nostalgic',
    label: 'Nostalgic',
    directive:
      'This is a memory being remembered fondly. Everything is shifted toward warm golden tones — late afternoon in eternal summer. Shadows are soft and lifted, never threatening. Focus is slightly soft, like looking through old glass or tears of joy. Details from a specific era peek through: vintage objects, period clothing, retro signage, old cars. Light has that magic-hour quality where everything glows from within. The composition feels personal and intimate, like a photograph taken by someone who was there and loved the moment. Lens flare and light bloom add to the romanticized warmth. Time has made everything more beautiful than it probably was.',
  },
  {
    key: 'psychedelic',
    label: 'Psychedelic',
    directive:
      "Reality is melting, breathing, and pulsing with impossible color. Every surface has organic flowing patterns — fractals, mandalas, paisley, flowing liquid forms. Colors are at MAXIMUM saturation and in combinations that vibrate: magenta against lime green, electric blue against hot orange. Forms morph into each other — a face becomes a landscape becomes an animal becomes a galaxy. Symmetry appears and breaks. The sky might be a swirling vortex of color. Edges ripple and breathe. Multiple patterns overlay at different scales. The image should feel like it's moving even though it's still — an optical experience that rewards long staring.",
  },
  {
    key: 'peaceful',
    label: 'Peaceful',
    directive:
      "Absolute stillness. The scene is in a state of perfect calm — still water reflecting sky, windless fields, quiet dawn light. Colors are soft and harmonious: sage green, powder blue, warm grey, soft white, pale gold. Nothing in the scene demands urgent attention — the eye wanders gently across the composition. Horizontal lines dominate: horizons, still waterlines, lying figures. Light is soft and even — overcast sky, pre-dawn blue, or the last glow of twilight. Sound would be absent if this had audio. The composition is balanced and stable. The viewer's breathing should slow down looking at this image.",
  },
  {
    key: 'whimsical',
    label: 'Whimsical',
    directive:
      "Physics are optional and reality is playful. Objects are slightly the wrong size — oversized mushrooms, tiny doors, floating islands. Colors are candy-bright but in sophisticated combinations: mint green with coral, periwinkle with marigold. Architecture curves and spirals instead of standing straight. Characters have exaggerated proportions — big heads, tiny feet, enormous eyes. Plants and nature are fantastical — trees with spiral trunks, flowers that glow, grass in impossible colors. The scene should feel like a children's book illustration made by a fine artist — playful but beautifully crafted. Light comes from unexpected places. Gravity is more of a suggestion than a rule.",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────

/** Get only the curated mediums (excludes My Mediums and Surprise Me) */
export const CURATED_MEDIUMS = DREAM_MEDIUMS.filter((m) => m.directive !== null);

/** Get only the curated vibes (excludes My Vibes and Surprise Me) */
export const CURATED_VIBES = DREAM_VIBES.filter((v) => v.directive !== null);

/** Pick a random curated medium */
export function randomMedium(): DreamMedium {
  return CURATED_MEDIUMS[Math.floor(Math.random() * CURATED_MEDIUMS.length)];
}

/** Pick a random curated vibe */
export function randomVibe(): DreamVibe {
  return CURATED_VIBES[Math.floor(Math.random() * CURATED_VIBES.length)];
}

/**
 * Subject invention prompt for when the user provides no input.
 * Uses their profile interests/aesthetics for flavor.
 */
import { DREAM_SCENE_TEMPLATES } from './dreamTemplates.ts';

/**
 * Build a dream scene by picking a random Sonnet-generated template
 * and filling its slots with the user's dream seeds.
 * No AI call needed — the templates ARE the creativity.
 */
export function buildDreamScene(dreamSeeds: {
  characters: string[];
  places: string[];
  things: string[];
}): string {
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const template = pick(DREAM_SCENE_TEMPLATES);

  // Fill template slots with random seeds, or generic fallbacks
  const character =
    dreamSeeds.characters.length > 0 ? pick(dreamSeeds.characters) : 'a wandering figure';
  const place = dreamSeeds.places.length > 0 ? pick(dreamSeeds.places) : 'a forgotten city';
  const thing = dreamSeeds.things.length > 0 ? pick(dreamSeeds.things) : 'glowing fragments';

  return template
    .replace(/\$\{character\}/g, character)
    .replace(/\$\{place\}/g, place)
    .replace(/\$\{thing\}/g, thing);
}

/**
 * Fallback: AI-powered subject invention for when templates aren't enough.
 * Uses Haiku to riff on seeds — called by the V2 text path.
 */
export function buildSubjectInventionPrompt(
  dreamSeeds: { characters: string[]; places: string[]; things: string[] },
  aesthetics: string[]
): string {
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const allSeeds = [...dreamSeeds.characters, ...dreamSeeds.places, ...dreamSeeds.things];
  const shuffled = [...allSeeds].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, Math.min(allSeeds.length, 2));

  const seedHint = picked.length > 0 ? `Raw ingredients (use loosely): ${picked.join(', ')}` : '';

  const aestheticHint = aesthetics.length > 0 ? `Aesthetic: ${aesthetics.join(', ')}` : '';

  return `Dream up a scene. Be surreal, impossible, beautiful, unsettling. Surprise me.

${seedHint}
${aestheticHint}

15-30 words. What do we SEE? Output ONLY the scene description.`;
}
