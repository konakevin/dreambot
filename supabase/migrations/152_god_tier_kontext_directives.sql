-- Migration 152: God-tier kontext_directive rewrites for every active medium.
--
-- Restyle path (Create + photo + Restyle toggle) sends Kontext the
-- medium's `kontext_directive` as the primary instruction. Old directives
-- read like generic "transform into X" descriptions — they produced
-- average-quality results and didn't push Kontext toward flattering,
-- masterwork-tier output.
--
-- New pattern, applied to all 15 mediums with kontext_directives + 1 new
-- directive for `pop_art` (previously NULL):
--   1. Open with "museum-quality" + a top-tier exemplar reference (master
--      artist or studio). Anchors Kontext to the BEST example of the style.
--   2. Skin/face = explicitly flattering, never distorted.
--   3. Element-by-element transformation (skin / hair / clothing /
--      background / lighting), each phrased flatteringly.
--   4. Identity preservation: "Keep the exact composition, subjects, and
--      likeness."
--   5. Explicit NEGATIVE directives for the common ugly failure modes
--      Kontext drifts toward (muddy, amateurish, distorted, garish).
--   6. ~120-150 word target per CLAUDE.md rule.
--
-- LEGO and Vinyl use the hardcoded flux-dev `MEDIUM_CONFIGS` in
-- supabase/functions/_shared/photoPrompts.ts (full Sonnet+Flux rebuild
-- because minifigures and Funko Pops are non-human proportions, not a
-- Kontext "transform" — that template is updated in the same commit).

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- animation
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality 3D animation render in the tradition of Pixar and DreamWorks. Skin becomes smooth subsurface-scattered surfaces with warm flattering studio lighting — features stylized appealingly, never cartoonishly distorted. Hair becomes sculpted flowing strands with soft volume and crisp catchlights. Clothing becomes clean digital fabric with believable folds. Background becomes a vibrant rendered 3D environment with depth and atmospheric light. Color palette is rich saturated cinema tones — warm and inviting. NOT muddy, NOT amateurish, NOT exaggerated proportions. The overall feel is heartwarming and polished, like a hero shot from a feature animated film. Keep the exact composition, subjects, and likeness.'
WHERE key = 'animation';

-- ───────────────────────────────────────────────────────────────────────
-- anime
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality anime illustration in the tradition of Studio Ghibli and Makoto Shinkai. Skin becomes smooth cel-painted surface with warm flattering shadows and a delicate soft blush — features rendered with care, never exaggerated. Hair becomes flowing inked strokes with crisp highlights and dynamic shape. Clothing becomes clean cel-shaded color blocks with confident black outlines — thick on silhouettes, thin on details. Background becomes a luminous painted anime environment with cinematic light. Color palette is vibrant saturated anime tones — vivid but never garish. NOT chibi, NOT amateurish, NOT generic moe. The overall feel is masterful and cinematic, like a key frame from a feature film. Keep the exact composition, subjects, and likeness.'
WHERE key = 'anime';

-- ───────────────────────────────────────────────────────────────────────
-- canvas (oil painting)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality oil painting on canvas in the tradition of John Singer Sargent and William-Adolphe Bouguereau. Skin becomes warm luminous tones with seamless brushwork transitions, painted flatteringly like a classical portrait — features rendered with care. Hair becomes flowing painted strokes with soft volume. Clothing becomes confident layered glazes with rich texture. Background becomes a rich atmospheric painted environment with golden light, depth, and soft gradations. Color palette is deep saturated oil pigment — warm earth tones, ivory whites, ultramarine blues. NOT muddy, NOT chunky impasto, NOT messy. The overall feel is masterful and refined, like a gallery oil portrait. Keep the exact composition, subjects, and likeness.'
WHERE key = 'canvas';

-- ───────────────────────────────────────────────────────────────────────
-- claymation
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality claymation stop-motion render in the tradition of Aardman and Laika. Skin becomes smooth sculpted clay with subtle fingerprint textures and warm flattering studio lighting — features stylized appealingly, never grotesque. Eyes become polished painted glass beads with a gentle gleam. Hair becomes a sculpted clay piece with shaped detail. Clothing becomes textured felt and fabric appliqué. Background becomes a handcrafted miniature diorama with practical lighting. Color palette is warm saturated film stock — rich but never garish. NOT lumpy, NOT amateurish, NOT distorted features. The overall feel is charming and polished, like a frame from a feature stop-motion film. Keep the exact composition, subjects, and likeness.'
WHERE key = 'claymation';

-- ───────────────────────────────────────────────────────────────────────
-- comics
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality comic book illustration in the tradition of Alex Ross and Jim Lee. Skin becomes smooth ink-and-color shading with confident flattering modeling — features rendered with care, never exaggerated. Hair becomes flowing inked strokes with crisp highlights. Clothing becomes bold cel-shaded color blocks with elegant black ink linework — thick on silhouettes, thin on details. Background becomes a dynamic painted comic environment with dramatic lighting. Color palette is rich saturated comic-book pigment — vivid but never garish. NOT cartoonish, NOT pop-art polka dots, NOT amateurish. The overall feel is heroic and polished, like a premium graphic-novel cover. Keep the exact composition, subjects, and likeness.'
WHERE key = 'comics';

-- ───────────────────────────────────────────────────────────────────────
-- fairytale (Disney Renaissance)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality 2D hand-drawn animation in the tradition of Disney Renaissance (Beauty & the Beast, Aladdin, The Little Mermaid). Skin becomes smooth cel-painted with soft flattering gradients and a warm delicate blush — features rendered with care, never exaggerated. Hair becomes flowing inked strokes with shaped volume and confident highlights. Clothing becomes cel-shaded color with crisp black linework. Background becomes a painted fairy-tale environment with magical lighting and atmospheric depth. Color palette is rich saturated storybook tones — magical, warm, never garish. NOT generic cartoon, NOT amateurish, NOT exaggerated proportions. The overall feel is masterful and enchanting, like a key frame from a classic animated feature. Keep the exact composition, subjects, and likeness.'
WHERE key = 'fairytale';

-- ───────────────────────────────────────────────────────────────────────
-- handcrafted (LBP Sackboy)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality Little Big Planet handmade-craft world rendered as tilt-shift toy photography. Subjects become knitted burlap Sackboy-style dolls with hessian fabric texture, X-stitched seams, big button eyes with thread crosses, an embroidered mouth, yarn hair — features rendered charmingly, never grotesque. Clothing becomes patchwork felt with pinking-shear edges and bright thread detail. Background becomes a 2.5D diorama of cardboard cutouts, cork floors, sponge bushes, pipe-cleaner trees, paper flowers, felt clouds. Lighting is soft warm cozy with shallow depth of field. Color palette is rich saturated craft-store tones — warm and inviting. NOT photoreal, NOT plastic, NOT 3D CGI, NOT anime. The overall feel is whimsical and polished, like a hero shot from the game. Keep the exact composition, subjects, and likeness.'
WHERE key = 'handcrafted';

-- ───────────────────────────────────────────────────────────────────────
-- illustration (gestural painterly)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality hand-drawn illustration in the tradition of Joaquín Sorolla and James Gurney. Skin becomes confident gestural brush marks with warm flattering modeling — features rendered with care. Hair becomes flowing brushstrokes with shaped volume and crisp highlights. Clothing becomes expressive paint marks with confident silhouettes. Background becomes a vibrant painted environment with dynamic light and atmospheric depth. Color palette is rich saturated illustration pigment — bold but never garish. NOT amateurish, NOT muddy, NOT scribbly. The overall feel is masterful and alive, like a finished editorial cover. Keep the exact composition, subjects, and likeness.'
WHERE key = 'illustration';

-- ───────────────────────────────────────────────────────────────────────
-- pencil (colored pencil)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality colored-pencil drawing in the tradition of Prismacolor masters. Skin becomes soft layered crosshatch with warm flattering modeling and luminous waxy buildup — features rendered with care. Hair becomes flowing layered pencil strokes with shaped volume. Clothing becomes layered colored-pencil texture with confident silhouettes. Background becomes a richly rendered colored-pencil environment with subtle paper grain showing through. Color palette is rich waxy pigment — warm earth tones with selective vivid accents. NOT amateurish, NOT scribbly, NOT muddy. The overall feel is masterful and refined, like a competition-winning portrait drawing. Keep the exact composition, subjects, and likeness.'
WHERE key = 'pencil';

-- ───────────────────────────────────────────────────────────────────────
-- photography
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality professional photograph in the tradition of Annie Leibovitz and Peter Lindbergh. Skin becomes natural luminous tones with flattering soft studio lighting and gentle highlight rolloff — features rendered beautifully, never harsh. Hair becomes shaped detail with crisp catchlights. Clothing becomes well-lit fabric with rich texture. Background becomes a softly defocused environment with depth and atmosphere. Color palette is rich balanced tones — warm and editorial. NOT amateurish, NOT harsh on-camera flash, NOT distorted. The overall feel is elegant and polished, like a fashion magazine cover. Keep the exact composition, subjects, and likeness.'
WHERE key = 'photography';

-- ───────────────────────────────────────────────────────────────────────
-- pixels (16-bit SNES)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality 16-bit SNES pixel-art piece in the tradition of Capcom and Square''s golden era. Subjects become carefully placed pixel sprites with crisp dithered shading — features rendered charmingly, never grotesque. Skin uses confident pixel highlights and gentle dithered shadows. Hair becomes shaped pixel clusters with bright highlight pixels. Clothing becomes clean pixel blocks with strong silhouette readability. Background becomes a layered pixel-art environment with parallax depth. Color palette is rich limited retro tones — vibrant but never noisy. NOT smoothed, NOT anti-aliased, NOT generic 8-bit, NOT amateurish. The overall feel is masterful and nostalgic, like a key frame from a classic JRPG. Keep the exact composition, subjects, and likeness.'
WHERE key = 'pixels';

-- ───────────────────────────────────────────────────────────────────────
-- pop_art (NEW — was NULL, fell through to generic prompt)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality pop-art portrait in the tradition of Andy Warhol and Roy Lichtenstein. Skin becomes flat saturated color blocks with confident bold outlines — features rendered cleanly, never distorted. Hair becomes a single flat color shape with shaped highlight blocks. Clothing becomes high-contrast solid color blocks with crisp silhouettes. Background becomes a graphic pop-art panel with bold flat color, with optional Ben-Day dot accents in the background only (NOT on faces). Color palette is rich vibrant primary tones — pinks, electric yellows, deep blues, hot reds. NOT amateurish, NOT muddy, NOT messy linework. The overall feel is iconic and polished, like a museum-piece silkscreen portrait. Keep the exact composition, subjects, and likeness.'
WHERE key = 'pop_art';

-- ───────────────────────────────────────────────────────────────────────
-- render (hyperreal CGI)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality hyperreal CGI render in the tradition of Octane and high-end product visualization. Skin becomes smooth subsurface-scattered surface with warm flattering studio lighting — features rendered beautifully, never plasticky. Hair becomes individually rendered strands with soft volume and crisp catchlights. Clothing becomes flawlessly modeled fabric with believable detail. Background becomes a luxe rendered 3D environment with ray-traced reflections, volumetric light, and soft depth-of-field. Color palette is rich balanced cinema tones — vivid but never garish. NOT plasticky, NOT uncanny, NOT oversaturated. The overall feel is elegant and polished, like a luxury product hero shot. Keep the exact composition, subjects, and likeness.'
WHERE key = 'render';

-- ───────────────────────────────────────────────────────────────────────
-- storybook (Beatrix Potter / E.H. Shepard)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality children''s-book illustration in the tradition of Beatrix Potter and E.H. Shepard. Skin becomes soft warm watercolor washes with delicate flattering modeling — features rendered tenderly, never exaggerated. Hair becomes flowing painted strokes with soft volume. Clothing becomes hand-painted fabric with charming detail. Background becomes a cozy painted storybook environment with warm light and atmospheric depth. Color palette is rich gentle pastel tones — inviting and timeless. NOT amateurish, NOT cartoonish, NOT garish. The overall feel is enchanting and polished, like a treasured first-edition children''s book illustration. Keep the exact composition, subjects, and likeness.'
WHERE key = 'storybook';

-- ───────────────────────────────────────────────────────────────────────
-- vaporwave (mood-driven aesthetic — flatter the figure, glitch the world)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality vaporwave composition in the tradition of polished retrowave artists. Skin retains natural flattering tones with a soft pink-magenta glow — features rendered with care, never glitched. Hair becomes shaped detail with subtle chromatic-aberration highlights. Clothing becomes saturated retro silhouettes. Background becomes a luxe sunset-gradient environment with electric pink, cyan, and purple — checkerboard floor, distant pyramids or palm silhouettes, soft scan lines. Lighting is dreamy magenta-purple glow with elegant volumetric haze. Color palette is rich saturated 80s/90s retrowave — bold but never garish. NOT distorted features, NOT glitched faces, NOT amateurish. The overall feel is dreamy and polished, like a hero retrowave album cover. Keep the exact composition, subjects, and likeness.'
WHERE key = 'vaporwave';

-- ───────────────────────────────────────────────────────────────────────
-- watercolor
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET kontext_directive =
'Transform this image into a museum-quality watercolor painting in the tradition of John Singer Sargent and Winslow Homer. Skin becomes luminous transparent washes with delicate warm undertones, painted flatteringly with seamless wet-into-wet blending — features rendered with care. Hair becomes flowing pigment strokes with soft edges and shaped highlights. Clothing becomes layered washes with confident negative-space whites. Background becomes an atmospheric watercolor environment with paper grain showing through, soft light, and refined wet-on-wet bleeds. Color palette is rich saturated pigment — never muddy, never overworked. NOT a rough sketch, NOT amateurish, NOT distorted features. The overall feel is masterful and polished, like a gallery-piece portrait. Keep the exact composition, subjects, and likeness.'
WHERE key = 'watercolor';

COMMIT;
