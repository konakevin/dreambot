-- 507_app_vibe_fragments.sql — fragments for the 12 active Create vibes the 2026-09-11 matrix had left out on
-- judgment alone (Kevin: "did we really test all the vibes in the app?"). Same rules as mig 504/505 (light /
-- palette / set dressing on surfaces AND the subject, no sky nouns, no "from above"), each carrying the vibe's own
-- identity. They render through the matrix (rounds e/f/g) exactly like the other 20; nothing is excluded by fiat.
UPDATE public.dream_vibes AS v SET flux_fragment = f.frag FROM (VALUES
  ('coquette',     'soft blush-pink and champagne light, lace, ribbons and pearls dressing the scene, a dreamy romantic glow on the subject'),
  ('kawaii',       'candy-pastel palette of pink, mint and baby blue over everything, rounded chunky shapes, sparkles and a sugar-sweet glow on the subject'),
  ('high_fantasy', 'torch and lantern light of a high-fantasy realm, banners and silver filigree dressing the scene, an enchanted golden glow on the subject'),
  ('whimsical',    'storybook-bright pastel light, oversized teacups and tiny doors tucked into the scene, sparkles and a playful warm glow on the subject'),
  ('surreal',      'crisp dream-logic light with impossible touches, a tiny moon in daylight and a doorway opening into cloud tucked into the scene, the subject lit clean'),
  ('fierce',       'blazing saturated color and hard directional light, wind-whipped leaves in the air, a charged electric glow on the subject'),
  ('voltage',      'neon tube light in magenta and cyan, wet reflective surfaces doubling the color, deep shadow between pools of light, the subject lit by the neon'),
  ('ancient',      'moss and lichen over weathered stone, roots through the flagstones, aged earthy light and the patina of centuries on every surface'),
  ('macabre',      'spooky-cute set dressing of spirals, stripes and crooked lanterns, a palette of Halloween orange, poison green and midnight purple, a playful eerie glow on the subject'),
  ('shimmer',      'a flattering soft-light bloom on the highlights, a gentle rim light and dewy catchlights on the subject, a subtle vignette'),
  ('minimal',      'clean quiet light, one calm tone behind the subject, generous negative space, soft even shadow'),
  ('psychedelic',  'flowing kaleidoscope pattern and rainbow color melting across every surface, mandala geometry radiating behind the subject, crisp and vivid')
) AS f(key, frag) WHERE v.key = f.key;
