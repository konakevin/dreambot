-- 299_add_kawaii_high_fantasy_vibes.sql
--
-- Two new user-pickable vibes:
--   • kawaii       — cute Japanese kawaii aesthetic (Sanrio / Pop-Mart sweetness)
--   • high_fantasy — Tolkien / D&D high-fantasy grandeur (elves, dungeons, dragons)
--
-- Same shape as the existing specialty vibes (coquette/whimsical/nightshade):
-- is_active=true so they show in the Create vibe picker; is_dream_eligible=false
-- so they're not auto-rolled in nightly (user-pickable only). The directive ends
-- with the standard SCENE-only guardrail so the vibe dresses the scene/atmosphere
-- without tinting the subject's real skin/hair. mood_profile placed on the
-- cute↔terrifying / minimal↔maximal / peaceful↔chaotic / realistic↔surreal axes.
-- No code change: vibes flow through get_dream_vibes → the picker automatically.
--
-- Re-runnable (ON CONFLICT upsert).

INSERT INTO public.dream_vibes (key, label, description, directive, sort_order, is_active, is_dream_eligible, mood_profile)
VALUES
(
  'kawaii',
  'Kawaii',
  'Cute overload',
  'Adorable Japanese kawaii cuteness in full bloom — the scene is sweet, soft, and irresistibly cute. A candy palette of pastel pink, mint, baby blue, lavender, butter yellow, and creamy white with pops of bright candy color. Rounded chunky no-sharp-corners shapes everywhere; squishy soft textures — felt, fluff, jelly, mochi, marshmallow, plush, glossy vinyl-toy sheen. Cute motifs scattered through the scene: hearts, stars, bows, rainbows, fluffy clouds, sparkles, tiny wings, polka dots, sprinkles. Sweet treats abound — macarons, ice cream, strawberries, cupcakes, bubble tea, candy. Friendly little mascot creatures with smiling faces and blushing cheeks — Sanrio and Pop-Mart designer-toy charm. Stickers, bubbles, and glittering sparkles drift through the air. The mood is joyful, gentle, and overflowing with cuteness — a sugar-sweet daydream where everything wants to be hugged. Add kawaii cuteness to the scene rather than replacing it.

IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject''s skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.',
  21,
  true,
  false,
  '{"cute_terrifying":-1,"minimal_maximal":0.7,"peaceful_chaotic":-0.3,"realistic_surreal":0.5}'::jsonb
),
(
  'high_fantasy',
  'High Fantasy',
  'Elves & dragons',
  'Grand high-fantasy splendor — the sweeping epic world of Tolkien, Dungeons & Dragons, and classic sword-and-sorcery. Majestic medieval-fantasy landscapes: misty mountain peaks and snow-capped ranges, ancient mossy forests pierced by shafts of golden light, winding rivers and waterfalls, rolling green vales. Architecture of legend — soaring elven cities of white stone and silver filigree, mighty dwarven halls carved deep into mountains, weathered castle keeps and watchtowers, ruined fortresses, torch-lit dungeon corridors of rough-hewn stone. Heraldic banners, rune-carved monuments, ornate engraved armor and weaponry, flowing traveling cloaks and capes, glowing enchanted blades. Distant dragons wheeling over the crags, mythic beasts at the treeline. A rich earthy palette — deep forest greens, weathered stone grays, royal blues and crimsons, burnished gold and bronze, warm torchlight against cool mountain mist. Atmospheric depth: drifting fog, god-rays through the canopy, vast questing horizons. The mood is adventurous and awe-struck — a legendary realm on the eve of a great quest, ancient, vast, and brimming with myth.

IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject''s skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.',
  22,
  true,
  false,
  '{"cute_terrifying":0.2,"minimal_maximal":0.8,"peaceful_chaotic":0.2,"realistic_surreal":0.6}'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  directive = EXCLUDED.directive,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  is_dream_eligible = EXCLUDED.is_dream_eligible,
  mood_profile = EXCLUDED.mood_profile;
