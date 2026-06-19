-- Migration 296: short, poppy medium descriptions for the picker.
--
-- The medium picker now shows a blurb on the right of each row (like the vibe
-- picker — "Pure zen", "Far out & melty"). The existing dream_mediums.description
-- values were literal ("Classic oil painting"); rewrite them in the same punchy
-- voice. Each blurb is grounded in what the medium actually RENDERS (its directive
-- + flux_fragment), not just its name. UI-only field — never touches generation.

UPDATE public.dream_mediums SET description = CASE key
  -- Real Face
  WHEN 'canvas'       THEN 'Old-master oils'
  WHEN 'comics'       THEN 'Inked comic panels'
  WHEN 'fairytale'    THEN 'Hand-drawn fairy tale'
  WHEN 'illustration' THEN 'Bold & hand-drawn'
  WHEN 'hyperreal'    THEN 'Glossy cover shoot'
  WHEN 'render'       THEN 'Glossy CGI shine'
  WHEN 'pencil'       THEN 'Colored-pencil sketch'
  WHEN 'photography'  THEN 'Crisp pro photo'
  WHEN 'pop_art'      THEN 'Screen-print pop'
  WHEN 'storybook'    THEN 'Cozy picture-book'
  WHEN 'vaporwave'    THEN 'Neon synthwave glow'
  WHEN 'watercolor'   THEN 'Soft dreamy washes'
  -- Dream Art
  WHEN 'animation'    THEN 'Pixar-style 3D'
  WHEN 'anime'        THEN 'Anime hero energy'
  WHEN 'claymation'   THEN 'Squishy clay world'
  WHEN 'handcrafted'  THEN 'Stitched & yarny'
  WHEN 'lego'         THEN 'LEGO brick build'
  WHEN 'pixels'       THEN 'Retro pixel sprite'
  WHEN 'vinyl'        THEN 'Big-head vinyl toy'
  ELSE description
END
WHERE key IN (
  'canvas','comics','fairytale','illustration','hyperreal','render','pencil',
  'photography','pop_art','storybook','vaporwave','watercolor',
  'animation','anime','claymation','handcrafted','lego','pixels','vinyl'
);
