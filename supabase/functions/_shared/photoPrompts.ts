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
    buildPrompt: (
      photo,
      vibe,
      hint
    ) => `You are writing a prompt for Flux AI to generate a photograph of a real LEGO diorama.

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

  pixels: {
    model: 'kontext-max',
    buildPrompt: (
      _photo,
      vibe,
      hint
    ) => `COMPLETELY transform this entire photo into 16-bit SNES-era pixel art. Every single pixel must become part of a visible pixel grid.

The person becomes a pixel art sprite — blocky features, simple dot eyes, hair and clothing rendered in carefully placed pixels matching their real colors. NO smooth skin, NO photorealistic features — everything is chunky pixels.

Background, furniture, objects — ALL rendered as pixel art with visible grid alignment. Dithering for shadows. Crisp pixel edges with NO anti-aliasing. No smooth gradients anywhere. Think Chrono Trigger, Secret of Mana quality. Portrait 9:16.

Express the mood through PALETTE SELECTION — the color palette sets the entire emotional tone:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  anime: {
    model: 'kontext-max',
    buildPrompt: (
      _photo,
      vibe,
      hint
    ) => `COMPLETELY transform this photo into anime illustration style.

Clean confident ink outlines with varying weight — thick for silhouettes, thin for details. Cel-shaded coloring with strategic gradient shading on skin and hair. Eyes larger and more expressive with light reflections. Hair simplified into flowing dynamic shapes with sheen highlights. Smooth cel-shaded skin. The anime style can range freely — cute and soft, dark and intense, epic and dramatic, or gentle and warm. Let the mood guide the tone. Keep the same person's features — but stylized as anime. Same hair color, clothing colors. Portrait 9:16.

Express the mood through BACKGROUND PAINTING STYLE and ANIME TONE — the mood determines whether this feels like a gentle slice-of-life or an intense action scene:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  watercolor: {
    model: 'kontext-max',
    buildPrompt: (
      _photo,
      vibe,
      hint
    ) => `COMPLETELY transform this photo into a watercolor painting on cold-pressed paper.

Every surface must look painted with transparent watercolor washes. Skin becomes soft washes with paper texture showing through. Hair is flowing wet-on-wet brushstrokes with bleeding edges. Clothing uses layered transparent washes, darker pigment in folds. Background dissolves into loose, bleeding washes — lost-and-found edges. Leave areas of pure white paper for highlights. Granulating pigment texture throughout. Keep the same person, face, pose, expression — but PAINTED. Portrait 9:16.

Express the mood through WASH INTENSITY and COLOR TEMPERATURE — heavy saturated washes for drama, light airy washes for calm, cool blues for melancholy, warm golds for joy:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  canvas: {
    model: 'kontext-max',
    buildPrompt: (
      _photo,
      vibe,
      hint
    ) => `COMPLETELY transform this photo into a classical oil painting on canvas.

Thick impasto brushstrokes in highlights — visible paint ridges catching light. Thinner transparent glazes in shadows. Skin has visible color mixing — adjacent strokes of different hues. Hair is painted with loaded, confident palette knife strokes. Background has bold, expressive paint application. Canvas texture visible throughout. Keep the same person, face, pose, expression — but as an oil painting with physical weight and texture. Portrait 9:16.

Express the mood through BRUSHSTROKE ENERGY and LIGHT DIRECTION — aggressive impasto for intensity, smooth glazes for serenity, dramatic chiaroscuro for darkness, warm diffused light for comfort:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  pencil: {
    model: 'kontext-max',
    buildPrompt: (
      _photo,
      vibe,
      hint
    ) => `COMPLETELY transform this photo into a detailed COLORED pencil drawing on textured paper — Prismacolor master quality, NOT graphite.

CRITICAL — preserve identity: keep the person's exact face, gender, skin tone, age, and core features. Male subjects stay male, female subjects stay female. Render their clothing in colored pencil but keep its style and gender presentation.

Every surface rendered with visible individual colored pencil strokes built up in layers. Directional hatching to suggest form. Skin has rich layered color with warm and cool tones blended. Hair is confident layered strokes matching their hair color. Clothing shows directional pencil work. Background has looser strokes with paper tooth showing through. Eraser marks visible at highlights. Confident hand-drawn line quality — never photographic, never digital-smooth. Portrait 9:16.

Express the mood through COLOR PALETTE and STROKE INTENSITY — vibrant warm hues for joy, muted cool tones for melancholy, bold strokes for drama, soft delicate layers for gentleness:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  claymation: {
    model: 'kontext-max',
    buildPrompt: (
      _photo,
      vibe,
      hint
    ) => `COMPLETELY transform this photo into claymation stop-motion animation.

The person becomes a smooth sculpted CLAY FIGURE — matte clay with subtle fingerprint textures. Eyes are painted glass beads, slightly oversized. Hair is a sculpted clay piece. Clothing appears knitted or felted at miniature scale. ALL furniture and objects are handcrafted miniatures — painted wood, craft materials. Background is a handcrafted set with painted backdrop. Keep the same pose, expression, clothing colors — but EVERYTHING is clay. Portrait 9:16.

Express the mood through SET LIGHTING and CLAY COLOR PALETTE — theatrical spotlights for drama, warm practicals for cozy, cool ambient for mystery, bright even light for whimsy:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  comics: {
    model: 'kontext-max',
    buildPrompt: (
      _photo,
      vibe,
      hint
    ) => `COMPLETELY transform this photo into a comic book graphic novel illustration.

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

  handcrafted: {
    model: 'kontext-max',
    buildPrompt: (
      _photo,
      vibe,
      hint
    ) => `COMPLETELY transform this photo into LittleBigPlanet Sack Boy craft world style.

The person becomes a KNITTED FABRIC DOLL — visible stitching on skin, button eyes, zipper mouth, yarn hair matching their real hair color. Body is a soft stuffed form. Clothing becomes felt and fabric patches in matching colors. ALL background elements become craft materials — cardboard walls, corrugated paper, cork, sponge, stickers, tape rolls. Everything looks handmade on a craft table. Warm desk lamp lighting. Portrait 9:16.

Express the mood through CRAFT MATERIAL CHOICES and LIGHTING WARMTH — colorful felt for joy, muted burlap for calm, glitter for magic:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  vinyl: {
    model: 'flux-dev',
    buildPrompt: (
      photo,
      vibe,
      hint
    ) => `You are writing a prompt for Flux AI to generate a photograph of a Funko Pop vinyl figure.

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

  gothic: {
    model: 'kontext-max',
    buildPrompt: (
      _photo,
      vibe,
      hint
    ) => `COMPLETELY transform this photo into Tim Burton's gothic whimsy style — Nightmare Before Christmas, Corpse Bride.

The person becomes a Burton character — elongated thin limbs, slightly oversized head, sunken eyes with dark circles, pale skin. Hair becomes wild and angular. Spiral motifs appear in hair and surroundings. Color palette shifts to predominantly black, white, grey with pops of deep purple or blood red. Background becomes crooked angular architecture — leaning buildings, twisted trees, curling fences. Black and white stripes on clothing. Dark whimsy, not horror. Keep their core features recognizable. Portrait 9:16.

Express the mood through SHADOW DEPTH and ACCENT COLOR CHOICE — deeper shadows for darker mood, more color pops for whimsy:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  animation: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) =>
      `COMPLETELY transform this photo into a 3D cartoon render — Pixar/DreamWorks quality but more stylized and exaggerated than realistic 3D.

The person becomes a cartoon character — rounder face, bigger eyes, simplified features with maximum appeal. Exaggerated proportions — slightly larger head, expressive hands. Smooth plastic-like skin with warm subsurface glow. Hair is thick stylized strands with bounce. Clothing becomes simplified with bold saturated colors. Background becomes a colorful 3D cartoon environment. Keep the same person's features, hair color, clothing colors. Portrait 9:16.

Express the mood through LIGHTING COLOR and ENVIRONMENT STYLE — bright bouncy light for fun, moody dramatic light for intensity:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  storybook: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) =>
      `COMPLETELY transform this photo into a children's book illustration — warm, gentle, hand-painted quality.

The person becomes a sweet illustrated character — soft rounded features, rosy cheeks, gentle smile, slightly larger eyes with warmth. Hair is soft painted strokes in matching color. Clothing becomes simple charming shapes with gentle patterns. Skin has visible warm brushstrokes. Background becomes a cozy storybook scene — soft watercolor washes, gentle details, friendly environment. Everything feels safe, warm, inviting. The style should feel hand-painted with love, like a Caldecott Medal winner. Keep same person's features and colors. Portrait 9:16.

Express the mood through WARMTH OF PALETTE and BACKGROUND DETAIL — golden tones for comfort, cool pastels for wonder, lush detail for enchantment:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  vaporwave: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) =>
      `COMPLETELY transform this photo into vaporwave aesthetic.

Shift the entire color palette to pink, cyan, and purple. Add glitch effects — horizontal scan lines, RGB channel separation, pixel distortion artifacts. Skin takes on a pink/purple tint. Background transforms into a surreal vaporwave landscape — checkered floors extending to infinity, Greek marble busts, palm trees, sunset gradients, floating geometric shapes, Japanese text overlays. CRT monitor glow effect on edges. Everything has that nostalgic 90s digital aesthetic. Keep the same person, face, pose. Portrait 9:16.

Express the mood through COLOR SATURATION and GLITCH INTENSITY — heavy glitch for chaos, smooth gradients for calm, deep purples for melancholy:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  coquette: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) =>
      `Keep this photo looking photographically REAL — real skin, real textures, real materials — but push everything into surreal impossibility.

Apply extreme color grading: hyper-saturated, shifted hues — skin glows with unnatural warmth, shadows are deep electric blue or magenta. Add double-exposure blending with cosmic elements — galaxies, nebulae, or organic textures bleeding through the person's silhouette. Warp the environment subtly: reflections that don't match, impossible geometry in the background, light sources that shouldn't exist. Hair or clothing might defy gravity. The sky could be an ocean, flowers might be crystalline. Lens effects pushed to extremes — heavy chromatic aberration, prismatic light splits, lens flare from invisible sources. Everything is sharp and detailed like a real photo, but the scene is impossible and dreamlike. Portrait 9:16.

Express the mood through COLOR SATURATION DIRECTION and REALITY DISTORTION LEVEL — warm saturated for euphoric, cool desaturated for eerie, maximum distortion for chaos:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  photography: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) =>
      `Make this photo look like a great natural photograph — NOT a studio shoot, NOT heavily edited.

Keep the person EXACTLY as they are — same face, same features. Place them in a believable real environment with natural ambient lighting. No dramatic studio setups, no artificial rim lighting, no heavy color grading. The lighting should come from whatever is naturally in the scene — sunlight, street lights, window light. Skin looks like real skin, not airbrushed. Colors are true to life, not pushed or saturated. The image should feel like a great candid photo someone took, not a retouched magazine image. No filters, no HDR look, no artificial glow.

Express the mood through the ENVIRONMENT and TIME OF DAY — not through post-processing effects:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  surreal: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) =>
      `Keep this photo looking photographically REAL — real skin, real textures, real materials — but push everything into surreal impossibility.

CRITICAL — preserve identity: keep the person's exact face, gender, skin tone, age, and core features. The surreal treatment applies to COLOR, LIGHTING, and ENVIRONMENT — not to the person's identity.

Apply extreme color grading: hyper-saturated, shifted hues — skin glows with unnatural warmth, shadows are deep electric blue or magenta. Add double-exposure blending with cosmic elements — galaxies, nebulae, or organic textures bleeding through the subject's silhouette. Warp the environment subtly: reflections that don't match, impossible geometry, light sources that shouldn't exist. Lens effects pushed to extremes — chromatic aberration, prismatic light splits, lens flare. Sharp and detailed like a real photo, but the scene is impossible and dreamlike. Portrait 9:16.

Express the mood through COLOR SATURATION and REALITY DISTORTION — warm saturated for euphoric, cool desaturated for eerie, maximum distortion for chaos:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  twilight: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) =>
      `COMPLETELY transform this photo into a richly painterly dark fantasy illustration in the style of Castlevania game art, Bloodborne concept art, and Berserk manga.

CRITICAL — preserve the person's identity: keep their exact face, gender, skin tone, age, and core features. If they are male, they MUST remain male — masculine jawline, masculine hair, masculine fashion (tailored coats, high collars, cloaks, leather harnesses, NOT dresses or gowns). If they are female, they remain female. NEVER change their gender. NEVER put male subjects in dresses, gowns, skirts, corsets, or feminine bodices.

Render them as a dark fantasy version of themselves: pale painterly skin with rich shading, eyes with a faint supernatural glow, ornate gothic period clothing matching their gender, dramatic painterly brushwork. Background becomes a moonlit gothic environment — cathedral ruins, twisted forest, candlelit crypt, foggy graveyard. Color palette: deep purples, teals, midnight blues, crimson, bone whites, with magical glowing accents.

Express the mood through atmospheric color and dramatic chiaroscuro lighting:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  fairytale: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) =>
      `COMPLETELY transform this photo into classic 2D hand-drawn princess animation — Disney Renaissance style (Beauty and the Beast, Aladdin, Mulan, Pocahontas), Don Bluth, classic 2D fairytale animation. Strictly 2D traditional cel animation, NEVER 3D CGI.

CRITICAL — preserve identity: keep the person's exact face, gender, skin tone, age, and core features. Male subjects stay male with masculine animated features (defined jaw, broader shoulders, masculine hair, masculine clothing). Female subjects stay female. NEVER change their gender.

Render them as a fully hand-drawn 2D animated character — clean flowing ink outlines, smooth cel-painted skin (NOT photorealistic), large expressive eyes, simplified animated features. Hair becomes flowing painted strokes matching their color. Clothing becomes simplified cel-painted shapes in their actual colors. Background becomes a lush painted watercolor environment with golden hour lighting. Portrait 9:16.

Express the mood through BACKGROUND PAINTING and COLOR WARMTH — rich golden tones for romance, cool blues for melancholy, vibrant primaries for joy:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },

  shimmer: {
    model: 'kontext-max',
    buildPrompt: (_photo, vibe, hint) =>
      `Apply maximum glamour editorial production value to this photo — Vogue cover quality.

CRITICAL — preserve identity completely: keep the person EXACTLY as they are. Same face, same features, same gender, same body, same hair. This medium ENHANCES the existing photo with cinematic lighting and effects, it does NOT redraw or restyle the person. Do NOT change their gender, do NOT swap their clothing for opposite-gender garments.

Push every visual effect to its peak: dramatic rim lighting outlining the subject in gold, magic hour golden light streaming through the scene, sparkles and glitter particles floating in the air, lens flare, shimmering iridescent highlights, vibrant saturated colors, flawless film-like skin tones, shallow cinematic depth of field. The image stays photorealistic but becomes the most stunning version of itself. Portrait 9:16.

Express the mood through LIGHTING COLOR and SPARKLE DENSITY — warm gold for romance, cool silver/blue for ethereal, dense glitter for magic, soft bokeh for dreaminess:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
  },
};

// ── Reimagine prompt builders ──────────────────────────────────────────────
// Reimagine always uses flux-dev (new scene from scratch).
// Medium-specific templates for mediums that need special handling.

const REIMAGINE_TEMPLATES: Record<
  string,
  (photo: string, scenario: string, vibe: string) => string
> = {
  lego: (
    photo,
    scenario,
    vibe
  ) => `Write a Flux AI prompt (50-70 words) for a PHOTOGRAPH of a LEGO diorama:
- Start with: "Photograph of a real LEGO brick diorama"
- Subject from photo: ${photo} — becomes a LEGO MINIFIGURE (painted eyes, C-shaped hands, snap-on hair, matching clothing colors)
- NEW SCENARIO: ${scenario} — build this entire scene from LEGO bricks, studs visible everywhere
- Express mood through brick colors and lighting: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  pixels: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for a pixel art scene:
- Start with: "16-bit pixel art, SNES era, visible pixel grid, limited 24-color palette"
- Subject from photo: ${photo} — becomes a pixel art sprite (blocky features, dot eyes, matching clothing colors)
- NEW SCENARIO: ${scenario} — render entirely in pixel art
- Express mood through palette warmth/coolness: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  vinyl: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for a Funko Pop figure:
- Start with: "Product photograph of a Funko Pop vinyl collectible figure"
- Subject from photo: ${photo} — becomes a FUNKO POP (oversized head, tiny body, dot eyes, glossy vinyl, matching clothing colors)
- NEW SCENARIO: ${scenario} — setting built as a Funko Pop display diorama
- Express mood through lighting: ${vibe}
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
