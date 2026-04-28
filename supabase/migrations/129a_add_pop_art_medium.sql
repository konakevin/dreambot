-- Add Pop Art medium

INSERT INTO public.dream_mediums (
  key, label, description, directive, flux_fragment,
  is_active, is_scene_only, is_character_only, face_swaps, nightly_skip,
  sort_order
) VALUES (
  'pop_art', 'Pop Art', 'Bold graphic halftones',
  'Render as bold pop art — the graphic, high-impact visual language of screen-printed posters and 1960s commercial art. VISUAL IDENTITY: thick black ink outlines defining every shape, flat high-contrast color fills with no subtle gradients, halftone dot patterns for shading and texture, clean vector-like contours. COLOR: vibrant saturated palette dominated by primary colors (red, blue, yellow) plus hot pink, cyan, and orange. Colors are flat and punchy — never muddy, never muted, never photorealistic. Every color choice should feel like a deliberate graphic design decision. COMPOSITION: simplified bold shapes, dramatic cropped framing, strong figure-ground contrast. Backgrounds are flat color fields or simple geometric patterns. TEXTURE: visible halftone dots, screen-print registration marks, comic book print grain. The image should feel like it was pulled from a printing press, not a camera. STYLE: channel the energy of Lichtenstein and Warhol without copying specific works. Exaggerated expressions, playful graphic boldness, retro advertising confidence. Never photorealistic, never painterly, never soft — always crisp, flat, and punchy.',
  'Pop art illustration, bold graphic design, thick black ink outlines, high-contrast flat colors, vibrant saturated palette, halftone dot shading, comic book print texture, screen-printed poster look, clean vector-like shapes, dramatic simplified lighting, sharp edge highlights, retro 1960s advertising aesthetic, playful exaggerated expression, crisp contours, minimal gradients, high visual punch, gallery-quality pop art print',
  true, false, false, false, false, 18
) ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  directive = EXCLUDED.directive,
  flux_fragment = EXCLUDED.flux_fragment,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;
