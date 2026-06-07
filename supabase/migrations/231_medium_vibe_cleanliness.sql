-- Migration 231: Medium + Vibe cleanliness pass
--
-- Keeps the three Create-screen layers in their lanes:
--   * MEDIUM  = how it's rendered (technique/material) — must NOT inject scene content.
--   * VIBE    = an intentional scene+mood accent — must NOT override the medium or repaint the subject.
--   * SUBJECT = who the person is — never tinted by a vibe's palette.
--
-- Pure data change (no schema/RPC/type change). Directives + flux_fragments are read live from
-- these tables by get_dream_mediums/get_dream_vibes (client) and the generate/nightly/restyle
-- engines (server), so this takes effect on the next request — no Edge deploy needed.
--
-- Surgical edits use REPLACE() to stay faithful to the original text (and are idempotent: a
-- second run finds nothing to replace). Full rewrites (vaporwave, hyperreal) use SET.

-- ============================================================================
-- A. MEDIUMS — strip injected scene content, keep pure technique
-- ============================================================================

-- vaporwave: FULL STRIP to pure technique. Removed all imagery anchors (Greek busts, dolphins,
-- palm trees, grid floor, oversized sun, malls/arcades) + the NEGATIVES cascade. Scene content
-- now comes entirely from the prompt + vibe.
UPDATE public.dream_mediums
SET directive = 'Render in a high-definition retro-futuristic 3D CGI style — a polished synthwave aesthetic. Smooth surfaces with sharp specular highlights, glossy plastic and polished chrome, crisp clean edges, high fidelity throughout. Color treatment is neon-gradient: magenta, cyan, purple, and hot pink bleeding into pastel glow, airbrushed gradient transitions, high-contrast rim lighting and glowing edges. Finishing texture carries a subtle VHS scanline overlay, soft light bloom, and a dreamy haze. The register is crisp polished CGI — smooth, vivid, hi-tech retro. Apply this aesthetic to whatever subject and framing is provided.',
    flux_fragment = 'high-definition retro-futuristic 3D CGI render, polished synthwave look, glossy plastic and chrome, sharp specular highlights, neon magenta cyan purple gradients, pastel glow, airbrushed transitions, glowing rim light, VHS scanline overlay'
WHERE key = 'vaporwave';

-- hyperreal: RESCOPE from "National Geographic nature photography" to subject-agnostic
-- editorial hyper-real realism (flatters portraits/objects/scenes equally). Removed the
-- 12-item NOT-cascade (which risked seeding the very things it banned).
UPDATE public.dream_mediums
SET directive = 'Editorial hyper-real realism — the look of a flawless high-end photograph where everything reads more beautifully than reality usually offers, yet stays believable. Colors are richly saturated and pushed just slightly past life. Beautiful natural light with deep shadow detail and luminous highlights. Ultra-sharp focus throughout, every texture crisp and tactile, fine micro-detail on every surface. Gentle cinematic color grading. Flatters any subject equally — a portrait, an object, a landscape, a full scene — with that rare too-perfect-to-be-real quality that comes from perfect light, timing, and composition. Real photographic register, gallery-grade finish.',
    flux_fragment = 'editorial hyper-real realism, high-end photographic finish, colors pushed slightly past reality yet believable, beautiful natural light, deep shadow detail, luminous highlights, ultra-sharp focus, crisp tactile texture, gentle cinematic grading'
WHERE key = 'hyperreal';

-- anime: drop the injected Japanese-scenery sentence (cherry blossoms / torii / bamboo).
UPDATE public.dream_mediums
SET directive = REPLACE(directive,
  'Cherry blossoms, bamboo forests, torii gates, traditional Japanese elements welcome when they fit. ',
  '')
WHERE key = 'anime';

-- fairytale: drop the injected fairy-tale-imagery sentence (castles / enchanted forests).
UPDATE public.dream_mediums
SET directive = REPLACE(directive,
  'Fairy tale imagery: castles, enchanted forests, magical transformations, talking animal companions. ',
  '')
WHERE key = 'fairytale';

-- render: drop the "bioluminescent forests" content seed, keep the CGI-grade reference.
UPDATE public.dream_mediums
SET directive = REPLACE(directive,
  'Think Avatar bioluminescent forests, Unreal Engine 5 cinematics',
  'Think Avatar-grade CGI, Unreal Engine 5 cinematics')
WHERE key = 'render';

-- pop_art: drop the closing negation (positive "crisp, flat, punchy" already carries it) +
-- trim the over-length flux_fragment.
UPDATE public.dream_mediums
SET directive = REPLACE(directive,
  'Never photorealistic, never painterly, never soft — always crisp, flat, and punchy.',
  'Always crisp, flat, and punchy.'),
    flux_fragment = 'pop art illustration, bold graphic design, thick black ink outlines, high-contrast flat color fills, vibrant saturated palette, halftone dot shading, screen-printed poster look, retro 1960s advertising look, crisp contours, high visual punch'
WHERE key = 'pop_art';

-- ============================================================================
-- B. VIBES — stop overriding the medium
-- ============================================================================

-- macabre: DE-MEDIUM. (1) reframe the opening from a rendering style to a tonal mood,
-- (2) remove the explicit hand-drawn render directives, (3) reword its guardrail to the new
-- standard. Result pulls scene+mood but lets the chosen medium render it.
UPDATE public.dream_vibes
SET directive = REPLACE(directive,
  'Whimsical illustration aesthetic — ',
  'Playfully-morbid whimsical charm — the tonal world of ')
WHERE key = 'macabre';

UPDATE public.dream_vibes
SET directive = REPLACE(directive,
  ' Hand-drawn feel: visible pen strokes, crosshatching, slightly uneven lines.',
  '')
WHERE key = 'macabre';

UPDATE public.dream_vibes
SET directive = REPLACE(directive,
  'IMPORTANT: this vibe describes the illustration STYLE and ENVIRONMENT palette only. Subject skin, hair, and complexion are independent — do not let the palette list describe the character''s body.',
  'IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject''s skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.')
WHERE key = 'macabre';

-- cinematic: drop the photographic-render artifacts (anamorphic letterbox + film grain) that
-- fight painted mediums; keep narrative-moment, composition, depth, filmic grading.
UPDATE public.dream_vibes
SET directive = REPLACE(directive, 'Anamorphic letterbox feel. Subtle film grain. ', '')
WHERE key = 'cinematic';

-- peaceful: remove landscape-painter name-drops (impose a painterly render + echo-leak risk);
-- the stillness/calm scene+mood already carries the vibe.
UPDATE public.dream_vibes
SET directive = REPLACE(directive,
  'Think Andrew Wyeth''s pastoral quiet, Winslow Homer''s calm seascapes, John Constable''s English countryside, Hudson River School landscape painters (Thomas Cole, Frederic Church). ',
  '')
WHERE key = 'peaceful';

-- ============================================================================
-- C. VIBES — add the subject-body guardrail to every vibe that lacks it
-- ============================================================================
-- dark already has an equivalent guardrail; macabre was reworded above. Append the standard
-- one line to the remaining 18 active vibes. Idempotent via the NOT LIKE guard.
UPDATE public.dream_vibes
SET directive = directive || E'\n\nIMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject''s skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.'
WHERE key IN (
  'cinematic','cozy','minimal','epic','nostalgic','psychedelic','peaceful','whimsical',
  'ethereal','arcane','ancient','enchanted','fierce','coquette','nightshade','shimmer',
  'surreal','voltage'
)
AND directive NOT LIKE '%colors the SCENE and ATMOSPHERE only%';
