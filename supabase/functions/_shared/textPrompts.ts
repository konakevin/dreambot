/**
 * Medium-specific text dream prompt templates.
 *
 * Each medium gets a custom Haiku brief that produces the best Flux prompt
 * for text-to-image generation. The user's prompt (or invented subject)
 * is the subject, medium directive shapes the style, vibe shapes the mood.
 *
 * All text dreams go through Flux-dev (or SDXL for anime/pixel art).
 */

/**
 * Build a medium-specific Haiku brief for a text dream.
 * Returns the brief that Haiku will use to write the final Flux prompt.
 * Returns null if no custom template exists (caller uses generic concept generator).
 */
export function buildTextDreamPrompt(
  mediumKey: string,
  subject: string,
  vibeDirective: string,
  fluxFragment: string
): string | null {
  const template = TEXT_TEMPLATES[mediumKey];
  if (!template) return null;
  return template(subject, vibeDirective, fluxFragment);
}

const TEXT_TEMPLATES: Record<
  string,
  (subject: string, vibe: string, fluxFragment: string) => string
> = {
  lego: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for a PHOTOGRAPH of a REAL LEGO SET:
- Start with: "Photograph of a real LEGO brick diorama, soft studio lighting, shallow depth of field"
- Subject: ${subject} — built ENTIRELY from LEGO bricks. Characters are minifigures with painted expressions, snap-on hair, C-shaped hands
- EVERY object, surface, and background element is LEGO — visible studs, snap-together construction
- Floor is a baseplate. Walls are stacked bricks.
- Portrait 9:16

Express the mood through brick color choices and lighting: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  pixel_art: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for pixel art:
- Start with: "16-bit pixel art, SNES era, visible pixel grid, limited 24-color palette, crisp pixel edges"
- Subject: ${subject} — rendered as pixel art sprites and pixel environments
- Characters have blocky features, dot eyes, iconic silhouettes
- Dithered shading for depth, NO anti-aliasing, NO smooth gradients
- Think Chrono Trigger, Celeste, Hyper Light Drifter quality
- Portrait 9:16

Express the mood through palette selection: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  stained_glass: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for a stained glass window:
- Start with: "Stained glass window panel, bold black lead cames, jewel-tone translucent glass glowing with warm backlight"
- Subject: ${subject} — rendered as colored glass pieces separated by bold black lead lines
- Characters are simplified glass figures with lead outlines defining features
- Colors: ruby, sapphire, emerald, amber, deep purple
- Light from BEHIND makes everything glow with luminosity
- Portrait 9:16

Express the mood through glass color warmth and composition: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  embroidery: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for embroidery artwork:
- Start with: "Hand embroidery artwork on natural linen fabric, cross-stitch and satin stitch, visible thread texture, raised dimensional stitching"
- Subject: ${subject} — entirely stitched on fabric. Characters are cross-stitch figures, environments are stitched backgrounds
- Visible linen weave between stitched areas. French knots for details.
- Rich DMC floss colors. Thread catches light with raised dimensionality.
- Portrait 9:16

Express the mood through thread color warmth and stitch density: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  anime: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for anime illustration:
- Start with: "Anime illustration, clean ink linework, cel-shaded coloring, expressive detailed eyes, vibrant saturated colors"
- Subject: ${subject} — drawn in anime style with clean confident ink outlines, cel-shaded flat color
- Characters have expressive eyes with light reflections, dynamic flowing hair
- Backgrounds are painted with atmospheric detail (Shinkai-style)
- Portrait 9:16

Express the mood through background atmosphere and color saturation: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  watercolor: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for a watercolor painting:
- Start with: "Watercolor painting on textured paper, transparent layered washes, wet-on-wet blooms, soft bleeding edges, white paper glowing through"
- Subject: ${subject} — painted with transparent watercolor washes, granulating pigments
- Lost-and-found edges: some sharp, some dissolving into nothing
- Areas of pure white paper for highlights. Controlled accidents at edges.
- Portrait 9:16

Express the mood through wash intensity and color temperature: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  oil_painting: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for an oil painting:
- Start with: "Oil painting on canvas, thick impasto brushstrokes, visible palette knife texture, rich layered glazes"
- Subject: ${subject} — painted with thick impasto in lights, transparent glazes in darks
- Visible brushstrokes, palette knife marks catching light, canvas texture throughout
- Adjacent strokes of different hues vibrating against each other
- Portrait 9:16

Express the mood through brushstroke energy and light direction: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  pencil_sketch: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for a pencil drawing:
- Start with: "Detailed pencil sketch on textured paper, confident graphite linework, hatching and cross-hatching, dramatic tonal range"
- Subject: ${subject} — drawn in graphite with masterful draftsmanship
- Hatching and cross-hatching for form and shadow. Pure white paper for highlights.
- Velvet-black compressed graphite for deepest darks. Smudged tones for atmosphere.
- Portrait 9:16

Express the mood through line weight and tonal contrast: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  claymation: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for claymation:
- Start with: "Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures, glass bead eyes, handcrafted miniature sets"
- Subject: ${subject} — sculpted from smooth matte clay with subtle fingerprint textures
- Characters have glass bead eyes, knitted/felted clothing. Sets are handcrafted miniatures.
- Theatrical lighting with warm practicals and cool ambient fill
- Portrait 9:16

Express the mood through set lighting and clay color palette: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  '3d_render': (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for a 3D render:
- Start with: "Pixar-quality 3D render, soft rounded appealing shapes, subsurface scattering, volumetric lighting, cinematic depth of field"
- Subject: ${subject} — as a stylized 3D animated scene with Pixar-level quality
- Soft rounded shapes, glossy eyes with reflections, subsurface scattering on skin
- Lush environment with volumetric lighting, god rays, warm bounce light
- Portrait 9:16

Express the mood through volumetric lighting and color palette: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  neon: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for a neon-lit scene:
- Start with: "Neon-lit night scene, glowing tube lights, electric cyan and hot pink, rain-slicked reflective surfaces, atmospheric fog catching light beams"
- Subject: ${subject} — bathed in dramatic neon lighting against dark background
- Electric colors: hot pink, cyan, purple, acid green. Atmospheric haze making light beams visible.
- Wet reflective surfaces doubling the neon. Cyberpunk noir aesthetic.
- Portrait 9:16

Express the mood through neon color choices and atmosphere density: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  comic_book: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for comic book art:
- Start with: "Comic book art, bold ink outlines, dynamic composition, halftone Ben-Day dots, saturated flat colors, graphic novel splash page quality"
- Subject: ${subject} — drawn with bold confident ink outlines, flat saturated color
- Ben-Day dot halftone patterns in mid-tones. Varying line weight for depth.
- Dynamic composition with dramatic angles. Kinetic energy.
- Portrait 9:16

Express the mood through ink weight and color intensity: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  disney: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for Disney animation:
- Start with: "Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors, Renaissance Disney quality"
- Subject: ${subject} — as a Disney animated character with expressive emotive face, large eyes conveying personality
- Clean confident ink outlines, luminous cel-painted color, lush painted backgrounds
- Hair and fabric flow with graceful movement. Warmth and appeal radiate from every stroke.
- Portrait 9:16

Express the mood through background painting and color vibrancy: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  sack_boy: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for LittleBigPlanet style:
- Start with: "LittleBigPlanet Sack Boy style, knitted fabric characters, button eyes, zipper details, cardboard and craft material world, handmade tactile quality"
- Subject: ${subject} — as knitted fabric dolls with button eyes, zipper mouths, yarn hair
- Environment built from cardboard, corrugated paper, fabric, sponge, cork, stickers
- Warm desk lamp lighting. Everything has handmade craft-table quality.
- Portrait 9:16

Express the mood through craft material choices and lighting warmth: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  funko_pop: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for a Funko Pop figure:
- Start with: "Product photograph of a Funko Pop vinyl collectible figure on a display shelf, soft studio lighting"
- Subject: ${subject} — as a Funko Pop with massively oversized head, tiny body, dot eyes, no mouth, glossy vinyl surface
- Hair is solid sculpted plastic. Clothing details painted on.
- Standing on small circular black base. Cute, collectible, maximum personality through minimal features.
- Portrait 9:16

Express the mood through background color and lighting: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  ghibli: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for Studio Ghibli style:
- Start with: "Studio Ghibli animation style, soft painterly rendering, warm natural color palette, detailed painted backgrounds, Miyazaki quality"
- Subject: ${subject} — in Ghibli's soft painterly style with natural rounded proportions
- Breathtakingly detailed painted landscapes, atmospheric clouds, living nature
- Quiet wonder and lived-in warmth. Earthy greens, sky blues, warm golds.
- Portrait 9:16

Express the mood through landscape atmosphere and natural light: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  tim_burton: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for Tim Burton style:
- Start with: "Tim Burton gothic style, spindly elongated limbs, spiral motifs, black and white with purple accents, dark whimsical aesthetic"
- Subject: ${subject} — in Burton's gothic whimsy with exaggerated thin limbs, oversized heads, sunken dark-ringed eyes
- Spiral motifs everywhere. Stark palette: black, white, grey with pops of deep purple or blood red.
- Crooked angular architecture. Dark whimsy, not horror.
- Portrait 9:16

Express the mood through shadow depth and accent color choice: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  pop_art: (subject, vibe) => `Write a Flux AI prompt (50-70 words, comma-separated) for Pop Art:
- Start with: "Pop art style, Andy Warhol screen print, bold flat primary colors at maximum saturation, Ben-Day halftone dots, thick black outlines"
- Subject: ${subject} — in bold flat areas of maximum saturation primary colors
- Ben-Day dots in shadows and mid-tones. Thick black outlines defining every shape.
- Graphic, commercial, unapologetically bold. No subtlety, no gradients.
- Portrait 9:16

Express the mood through color intensity and dot density: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  minecraft: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for Minecraft style:
- Start with: "Minecraft voxel world, everything built from cubic blocks, pixelated block textures, game screenshot aesthetic"
- Subject: ${subject} — built from cubic voxel blocks. Characters have square heads, rectangular bodies.
- Every surface is textured blocks — dirt, stone, wood planks, grass. Trees are wood block columns with leaf blocks.
- Blocky shadows. The charm is in the cubic constraint.
- Portrait 9:16

Express the mood through block palette and sky color: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  '8bit': (
    subject,
    vibe
  ) => `Write a Flux AI prompt (40-60 words, comma-separated) for NES 8-bit art:
- Start with: "NES 8-bit pixel art, extremely limited color palette, large chunky pixels, very low resolution, retro 1985 gaming aesthetic"
- Subject: ${subject} — as simple 8-bit sprites. 2-pixel eyes, no facial detail, iconic silhouettes only.
- NO dithering, NO gradients — flat color blocks only. Simple repeating tile backgrounds.
- Charming BECAUSE of severe limitations. 1985 hardware feel.
- Portrait 9:16

Express the mood through limited palette choice: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,

  felt: (
    subject,
    vibe
  ) => `Write a Flux AI prompt (50-70 words, comma-separated) for felt/stop-motion:
- Start with: "Needle-felted stop-motion puppet scene, visible wool fiber texture, handcrafted miniature set, Laika Studios Coraline quality"
- Subject: ${subject} — as needle-felted wool puppets with hand-painted eyes, individual wool strand hair
- Real miniature fabric clothing with tiny stitches, actual buttons, thread seams
- World is handcrafted miniature — wood, fabric, paper, wire at tiny scale
- Dramatic cinematic lighting. Slightly uncanny but beautiful.
- Portrait 9:16

Express the mood through lighting drama and material warmth: ${vibe.slice(0, 200)}
Output ONLY the prompt.`,
};
