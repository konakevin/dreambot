/**
 * Medium-specific photo restyle prompt templates.
 *
 * Each medium defines:
 *   - model: which AI model produces the best results
 *   - buildPrompt: custom prompt template with vibe woven into the medium's language
 *
 * The vibe is NOT appended at the end — it's integrated into each medium's
 * visual language so the mood manifests through the medium's own tools
 * (brush intensity, brick colors, palette warmth, etc.)
 *
 * Models:
 *   'kontext-max' — Preserves face/likeness. Used for most mediums.
 *   'flux-dev'    — Full artistic rebuild. Only for LEGO (minifigures are non-human).
 */

export type PhotoModel = 'kontext-max' | 'flux-dev';

interface PhotoRestyleConfig {
  model: PhotoModel;
  buildPrompt: (photo: string, vibe: string, hint: string) => string;
}

export function getPhotoRestyleConfig(mediumKey: string): PhotoRestyleConfig | null {
  return MEDIUM_CONFIGS[mediumKey] ?? null;
}

const MEDIUM_CONFIGS: Record<string, PhotoRestyleConfig> = {

  // ═══════════════════════════════════════════════════════════════════════
  // FLUX-DEV — LEGO (minifigures are non-human, needs full rebuild)
  // ═══════════════════════════════════════════════════════════════════════

  lego: {
    model: 'flux-dev',
    buildPrompt: (photo, vibe, hint) => `You are writing a prompt for Flux AI to generate a photograph of a real LEGO diorama.

PHOTO TO RECREATE AS LEGO:
${photo}

Write a prompt (50-70 words, comma-separated) for a PHOTOGRAPH of a REAL LEGO SET:
- Start with: "Photograph of a real LEGO brick diorama"
- The person is a LEGO MINIFIGURE: painted dot eyes, printed smile, C-shaped hands, snap-on hair piece, skin tone matching the person. Match their clothing colors.
- EVERY object is built from LEGO bricks — visible studs, snap-together construction
- Floor is a LEGO baseplate. Walls are stacked bricks. Furniture is brick-built.
- If the person is very young/small, use a short-legs minifigure. Match gender with hair piece.
- Portrait 9:16

MOOD — express this through brick color choices, lighting angle, and atmosphere of the diorama:
${vibe}
${hint ? `\nUSER REQUEST: "${hint}"` : ''}
Output ONLY the prompt.`,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // KONTEXT MAX — preserves face/likeness, medium-specific instructions
  // ═══════════════════════════════════════════════════════════════════════

  pixel_art: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this entire photo into 16-bit SNES-era pixel art. Every single pixel must become part of a visible pixel grid.

The person becomes a pixel art sprite — blocky features, simple dot eyes, hair and clothing rendered in carefully placed pixels matching their real colors. NO smooth skin, NO photorealistic features — everything is chunky pixels.

Background, furniture, objects — ALL rendered as pixel art with visible grid alignment. Dithering for shadows. Crisp pixel edges with NO anti-aliasing. No smooth gradients anywhere. Think Chrono Trigger, Secret of Mana quality. Portrait 9:16.

Express the mood through PALETTE SELECTION — the color palette sets the entire emotional tone:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  stained_glass: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this entire photo into a stained glass window panel.

Every element must become colored glass pieces separated by bold black lead lines (cames). The person's face becomes simplified glass pieces — 4-6 panels with thick lead outlines defining features. Hair becomes flowing glass panels. Clothing becomes larger flat glass sections in matching colors.

Background, furniture, objects — ALL become stained glass pieces with lead dividers. Light glows from BEHIND the glass making everything luminous and translucent. Bold graphic clarity. Portrait 9:16.

Express the mood through GLASS COLOR CHOICES and BACKLIGHT WARMTH — jewel tones set the emotion:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  embroidery: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this entire photo into hand embroidery on linen fabric. Every single element must become visible thread stitches — no photographic elements remaining.

The person's face becomes cross-stitch X patterns. Hair becomes satin stitch in matching color. Clothing becomes long-and-short stitch with matching thread colors. Skin is stitched in flesh-tone thread. Background walls, furniture, objects — ALL become embroidered.

Visible natural linen weave texture between all stitched areas. French knots for small details like eyes. Raised thread catching light. The entire image should look like flat needlework viewed straight-on. Portrait 9:16.

Express the mood through THREAD COLOR WARMTH and STITCH DENSITY — dense rich stitching for intensity, sparse delicate stitching for calm:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  anime: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into anime illustration style.

Clean confident ink outlines with varying weight — thick for silhouettes, thin for details. Flat cel-shaded coloring with strategic gradient shading on skin and hair. Eyes larger and more expressive — with multiple light reflections. Hair simplified into flowing dynamic shapes with sheen highlights. Smooth cel-shaded skin. Clean flat color areas with simple shadow shapes for clothing. Keep the same person's features — but stylized as anime. Same hair color, clothing colors. Portrait 9:16.

Express the mood through BACKGROUND PAINTING STYLE and COLOR SATURATION — the background carries the emotional atmosphere (Shinkai-style backgrounds respond beautifully to mood):
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  watercolor: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into a watercolor painting on cold-pressed paper.

Every surface must look painted with transparent watercolor washes. Skin becomes soft washes with paper texture showing through. Hair is flowing wet-on-wet brushstrokes with bleeding edges. Clothing uses layered transparent washes, darker pigment in folds. Background dissolves into loose, bleeding washes — lost-and-found edges. Leave areas of pure white paper for highlights. Granulating pigment texture throughout. Keep the same person, face, pose, expression — but PAINTED. Portrait 9:16.

Express the mood through WASH INTENSITY and COLOR TEMPERATURE — heavy saturated washes for drama, light airy washes for calm, cool blues for melancholy, warm golds for joy:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  oil_painting: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into a classical oil painting on canvas.

Thick impasto brushstrokes in highlights — visible paint ridges catching light. Thinner transparent glazes in shadows. Skin has visible color mixing — adjacent strokes of different hues. Hair is painted with loaded, confident palette knife strokes. Background has bold, expressive paint application. Canvas texture visible throughout. Keep the same person, face, pose, expression — but as an oil painting with physical weight and texture. Portrait 9:16.

Express the mood through BRUSHSTROKE ENERGY and LIGHT DIRECTION — aggressive impasto for intensity, smooth glazes for serenity, dramatic chiaroscuro for darkness, warm diffused light for comfort:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  pencil_sketch: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into a detailed pencil drawing on textured paper.

Every surface rendered in graphite. Skin has smooth, carefully blended graphite with subtle hatching for form. Hair drawn with confident flowing pencil strokes. Clothing shows cross-hatching following the form and folds. Background uses looser, atmospheric graphite — smudged tones for depth. Pure white paper for brightest highlights. Darkest shadows are velvet-black compressed graphite. Keep the same person, face, pose. The line quality should be confident and masterful. Portrait 9:16.

Express the mood through LINE WEIGHT and TONAL CONTRAST — heavy dark hatching for drama, light delicate lines for gentleness, high contrast for intensity, soft mid-tones for calm:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  claymation: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into claymation stop-motion animation.

The person becomes a smooth sculpted CLAY FIGURE — matte clay with subtle fingerprint textures. Eyes are painted glass beads, slightly oversized. Hair is a sculpted clay piece. Clothing appears knitted or felted at miniature scale. ALL furniture and objects are handcrafted miniatures — painted wood, craft materials. Background is a handcrafted set with painted backdrop. Keep the same pose, expression, clothing colors — but EVERYTHING is clay. Portrait 9:16.

Express the mood through SET LIGHTING and CLAY COLOR PALETTE — theatrical spotlights for drama, warm practicals for cozy, cool ambient for mystery, bright even light for whimsy:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  '3d_render': {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into a Pixar-quality 3D animated render.

The person becomes a stylized 3D character — soft rounded shapes, appealing proportions. Skin has subsurface scattering glow. Eyes are large, glossy with complex reflections. Hair is soft flowing 3D strands. Clothing has soft cloth simulation. Keep the same person's features, hair color, clothing colors — but as a Pixar character. Portrait 9:16.

Express the mood through VOLUMETRIC LIGHTING and COLOR PALETTE — god rays for epic, soft bounce light for warmth, dramatic rim lighting for intensity, pastel palette for gentleness:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  comic_book: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into a comic book graphic novel illustration.

Bold confident INK OUTLINES around everything — thick for silhouettes, thin for details. Flat saturated color areas — no photographic gradients. Ben-Day dot halftone patterns in mid-tones and shadows. Skin is flat-colored with bold ink shadow shapes. Hair simplified into graphic shapes with thick ink strokes. Keep the same person, features, clothing colors — but with ink outlines and flat comic coloring. Everything has that hand-inked, printed quality. Portrait 9:16.

Express the mood through INK WEIGHT and COLOR INTENSITY — heavy blacks and high contrast for dark/dramatic, bright primaries for energy, muted palette for somber, pop art colors for fun:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  neon: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into a neon-lit scene.

Entire scene lit by NEON — glowing tube lights, LED strips. Background becomes dark so neon POPS with maximum contrast. Electric colors casting colored light on the subject's face and body. Add atmospheric haze/fog making light beams visible. Surfaces become wet/reflective — rain-slicked, chrome, glass. Multiple neon sources creating doubled reflections and color bleeds. Keep the same person, face, pose — but bathed in dramatic neon. Portrait 9:16.

Express the mood through NEON COLOR CHOICES and ATMOSPHERE DENSITY — hot pink/cyan for energy, cool blue/purple for calm, dense fog for mystery, clear air for clarity:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  disney: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into classic Disney 2D animation style — Renaissance era (Lion King, Little Mermaid, Aladdin).

The person becomes a Disney character — expressive face with large emotive eyes, clean flowing ink outlines, smooth cel-painted color with luminous highlights. Hair flows with graceful exaggerated movement. Skin has warm Disney color with soft shadow shapes. Background becomes a lush painted Disney environment. Keep the same person's features, hair color, clothing colors — but as a hand-drawn Disney character. Portrait 9:16.

Express the mood through BACKGROUND PAINTING and COLOR VIBRANCY — Disney backgrounds carry enormous emotional weight:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  sack_boy: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into LittleBigPlanet Sack Boy craft world style.

The person becomes a KNITTED FABRIC DOLL — visible stitching on skin, button eyes, zipper mouth, yarn hair matching their real hair color. Body is a soft stuffed form. Clothing becomes felt and fabric patches in matching colors. ALL background elements become craft materials — cardboard walls, corrugated paper, cork, sponge, stickers, tape rolls. Everything looks handmade on a craft table. Warm desk lamp lighting. Portrait 9:16.

Express the mood through CRAFT MATERIAL CHOICES and LIGHTING WARMTH — colorful felt for joy, muted burlap for calm, glitter for magic:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  funko_pop: {
    model: 'flux-dev',
    buildPrompt: (photo, vibe, hint) => `You are writing a prompt for Flux AI to generate a photograph of a Funko Pop vinyl figure.

PERSON TO RECREATE AS FUNKO POP:
${photo}

Write a prompt (50-70 words, comma-separated) for a PRODUCT PHOTOGRAPH of a FUNKO POP FIGURE:
- Start with: "Product photograph of a Funko Pop vinyl collectible figure on a display shelf, soft studio lighting"
- The person becomes a FUNKO POP: massively oversized head (3x body), tiny body, dot eyes, no mouth, glossy vinyl plastic surface, painted-on clothing details matching their real colors
- Hair is a solid sculpted plastic piece matching their hair color
- Standing on a small circular black base
- Apply the vibe through background color and lighting mood: ${vibe}
- Portrait 9:16
${hint ? `USER REQUEST: "${hint}"` : ''}
Output ONLY the prompt.`,
  },

  ghibli: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into Studio Ghibli animation style — Spirited Away, Totoro, Howl's Moving Castle.

The person becomes a Ghibli character — natural rounded proportions (NOT exaggerated anime), realistically-sized expressive eyes, warm watercolor-like skin shading. Hair is soft and natural with gentle movement. Clothing has simple, clean painted shapes. Background becomes a breathtakingly detailed Ghibli painted landscape — atmospheric clouds, living nature, incredible depth. The palette is rich but gentle — earthy greens, sky blues, warm golds. Keep the same person's features and colors. Portrait 9:16.

Express the mood through LANDSCAPE ATMOSPHERE and NATURAL LIGHT — Ghibli's emotional power lives in the sky, wind, and light:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  tim_burton: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into Tim Burton's gothic whimsy style — Nightmare Before Christmas, Corpse Bride.

The person becomes a Burton character — elongated thin limbs, slightly oversized head, sunken eyes with dark circles, pale skin. Hair becomes wild and angular. Spiral motifs appear in hair and surroundings. Color palette shifts to predominantly black, white, grey with pops of deep purple or blood red. Background becomes crooked angular architecture — leaning buildings, twisted trees, curling fences. Black and white stripes on clothing. Dark whimsy, not horror. Keep their core features recognizable. Portrait 9:16.

Express the mood through SHADOW DEPTH and ACCENT COLOR CHOICE — deeper shadows for darker mood, more color pops for whimsy:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  pop_art: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into bold Pop Art style — Andy Warhol meets Roy Lichtenstein.

Flat areas of MAXIMUM SATURATION primary colors — no photographic gradients anywhere. Thick black outlines define every shape. Ben-Day halftone dots fill all shadows and mid-tones. Skin becomes flat bold color. Hair becomes a solid graphic shape. Background is a flat contrasting color. Everything is graphic, commercial, unapologetically bold. NO subtlety, NO smooth blending — flat color blocks and dot patterns only. Keep the same person's features but rendered in pure Pop Art graphic style. Portrait 9:16.

Express the mood through COLOR INTENSITY and DOT DENSITY — hot colors for energy, cool for calm, dense dots for drama:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  minecraft: {
    model: 'flux-dev',
    buildPrompt: (photo, vibe, hint) => `You are writing a prompt for Flux AI to generate a Minecraft-style scene.

SCENE TO RECREATE AS MINECRAFT:
${photo}

Write a prompt (50-70 words, comma-separated) for a MINECRAFT GAME SCREENSHOT:
- Start with: "Minecraft voxel world screenshot, everything built from cubic blocks, pixelated block textures"
- The person becomes a MINECRAFT CHARACTER: square head, rectangular body, pixelated skin texture on flat cube faces. Match their clothing colors.
- Every surface is textured blocks — dirt, stone, wood planks, grass
- Trees are wood block columns with leaf blocks on top
- Apply the vibe through block palette and sky color: ${vibe}
- Portrait 9:16
- If person is very small, make a smaller character model
${hint ? `USER REQUEST: "${hint}"` : ''}
Output ONLY the prompt.`,
  },

  felt: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) => `COMPLETELY transform this photo into a needle-felted stop-motion puppet scene — Coraline / Kubo and the Two Strings style.

The person becomes a NEEDLE-FELTED WOOL PUPPET — visible fiber texture on skin, hand-painted precise eyes, individual wool strand hair matching their real color. Clothing becomes real miniature fabric with tiny visible stitches, actual buttons, thread seams in matching colors. ALL surroundings become a handcrafted miniature set — real wood, fabric, paper, wire at tiny scale. Dramatic cinematic lighting casting long shadows. Slightly uncanny but beautiful. Portrait 9:16.

Express the mood through LIGHTING DRAMA and MATERIAL WARMTH — warm wool tones for comfort, cold stark lighting for unease, rich saturated felt for vibrancy:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  '8bit': {
    model: 'flux-dev',
    buildPrompt: (photo, vibe, hint) => `You are writing a prompt for Flux AI to generate NES-era 8-bit pixel art.

SCENE TO RECREATE AS 8-BIT:
${photo}

Write a prompt (40-60 words, comma-separated) for an 8-BIT NES GAME SCREEN:
- Start with: "NES 8-bit pixel art, extremely limited color palette, large chunky pixels, very low resolution"
- The person becomes a SIMPLE 8-BIT SPRITE: 2-pixel dot eyes, no facial detail, iconic silhouette only, matching clothing colors
- Background is simple repeating tile patterns — flat color blocks, NO gradients, NO dithering
- Think original Mario, Mega Man, Zelda NES quality
- Apply the vibe through the limited palette choice: ${vibe}
- Portrait 9:16
${hint ? `USER REQUEST: "${hint}"` : ''}
Output ONLY the prompt.`,
  },
};

// ── Reimagine prompt builders ──────────────────────────────────────────────
// Reimagine always uses flux-dev (new scene from scratch).
// Medium-specific templates for mediums that need special handling.

const REIMAGINE_TEMPLATES: Record<string, (photo: string, scenario: string, vibe: string) => string> = {
  lego: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for a PHOTOGRAPH of a LEGO diorama:
- Start with: "Photograph of a real LEGO brick diorama"
- Subject from photo: ${photo} — becomes a LEGO MINIFIGURE (painted eyes, C-shaped hands, snap-on hair, matching clothing colors)
- NEW SCENARIO: ${scenario} — build this entire scene from LEGO bricks, studs visible everywhere
- Express mood through brick colors and lighting: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  pixel_art: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for a pixel art scene:
- Start with: "16-bit pixel art, SNES era, visible pixel grid, limited 24-color palette"
- Subject from photo: ${photo} — becomes a pixel art sprite (blocky features, dot eyes, matching clothing colors)
- NEW SCENARIO: ${scenario} — render entirely in pixel art
- Express mood through palette warmth/coolness: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  stained_glass: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for a stained glass window:
- Start with: "Stained glass window panel, bold black lead cames, jewel-tone translucent glass, warm backlight"
- Subject from photo: ${photo} — becomes a stained glass figure (lead outlines, colored glass panels)
- NEW SCENARIO: ${scenario} — all elements are stained glass with lead dividers
- Express mood through glass color warmth: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  embroidery: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for embroidery artwork:
- Start with: "Flat embroidery artwork on natural linen fabric, cross-stitch and satin stitch, visible thread texture"
- Subject from photo: ${photo} — entirely stitched (cross-stitch face, satin-stitch hair, matching thread colors)
- NEW SCENARIO: ${scenario} — all elements embroidered, visible linen weave between stitches
- Express mood through thread color choices: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  funko_pop: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for a Funko Pop figure:
- Start with: "Product photograph of a Funko Pop vinyl collectible figure"
- Subject from photo: ${photo} — becomes a FUNKO POP (oversized head, tiny body, dot eyes, glossy vinyl, matching clothing colors)
- NEW SCENARIO: ${scenario} — setting built as a Funko Pop display diorama
- Express mood through lighting: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  minecraft: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for a Minecraft scene:
- Start with: "Minecraft voxel world, everything built from cubic blocks, pixelated textures"
- Subject from photo: ${photo} — becomes a MINECRAFT CHARACTER (square head, rectangular body, pixelated skin)
- NEW SCENARIO: ${scenario} — entire scene built from Minecraft blocks
- Express mood through block palette and sky: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  '8bit': (photo, scenario, vibe) => `Write a Flux AI prompt (40-60 words) for NES 8-bit art:
- Start with: "NES 8-bit pixel art, extremely limited color palette, large chunky pixels"
- Subject from photo: ${photo} — becomes a SIMPLE 8-BIT SPRITE (2-pixel eyes, iconic silhouette, matching colors)
- NEW SCENARIO: ${scenario} — rendered in flat 8-bit tile patterns
- Express mood through limited palette: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,
};

export function buildReimaginePrompt(
  mediumKey: string,
  photoDescription: string,
  scenario: string,
  vibeDirective: string
): string | null {
  const template = REIMAGINE_TEMPLATES[mediumKey];
  if (!template) return null;
  return template(photoDescription, scenario, vibeDirective.slice(0, 200));
}
