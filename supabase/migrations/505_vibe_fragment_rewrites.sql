-- 505_vibe_fragment_rewrites.sql — vibe matrix round C lesson (NIGHTLY_VIBES_AUDIT.md §5): with the fragment placed
-- EARLY (before the person) Flux obeys it, so a fragment that names the SKY / a light source ABOVE / the night as a
-- place pulls the camera outside the location and shrinks or shadows the face (epic identity 0.36, dark 0.45,
-- moonlit faceless). Rule for every fragment: describe light ON SURFACES AND ON THE SUBJECT, name a warm accent
-- light near the person, never a sky / cloud / star / moon-as-object noun, never "from above".
UPDATE public.dream_vibes AS v SET flux_fragment = f.frag FROM (VALUES
  ('epic',      'grand golden light streaming in with long sun rays, deep dramatic shadow, a solemn monumental glow on every surface and the subject'),
  ('dark',      'deep velvety shadow across the scene, one warm lantern glow lighting the subject, teal and violet glints in the gloom'),
  ('moonlit',   'cool silver moonlight washing over every surface and the subject, deep indigo shadows, a faint low mist, one warm lantern nearby'),
  ('aurora',    'green, teal and violet aurora glow rippling overhead and spilling onto every surface and the subject, deep night-blue shadows, one warm lantern accent'),
  ('prism',     'soft bright light with rainbow refractions and prismatic flares across the scene, an iridescent sheen on glass and water, the subject lit clean and warm'),
  ('spotlight', 'a single warm theatrical spotlight on the subject with haze glowing in the beam, the surroundings falling into deep shadow, a faint cool rim light'),
  ('cozy',      'warm golden lamplight over everything, soft amber shadows, an intimate sheltered warmth on the subject')
) AS f(key, frag) WHERE v.key = f.key;
