-- 145 — Add bot-only hyperreal mediums for AncientBot and StarBot.
--
-- Background: Tonight (2026-05-03) we developed a "hyperreal cinematic
-- concept-art" aesthetic for both AncientBot (ancient civilizations rendered
-- as LOTR/Avatar concept-art) and StarBot (sci-fi rendered as Denis
-- Villeneuve film-still concept-art). It was implemented as bot-config
-- overrides of the existing `render` medium — which works but pollutes
-- the meaning of `render` for those two bots.
--
-- This migration formalizes each bot's hyperreal aesthetic as its own
-- bot-only medium row. The bot configs then reference these new keys
-- instead of overriding `render`. Behavior is unchanged; the architecture
-- is cleaner and the `render` medium reverts to its original DB definition
-- for both bots.
--
-- Both mediums are bot-only (is_active=false, is_bot_only=true) — engine
-- resolves them for DLT/runtime, user-facing medium picker doesn't show them.
--
-- The two mediums have IDENTICAL VFX/rendering language for now (Kevin:
-- "for now it can be identical, but we may tweak per bot later"). They're
-- separate keys so each bot can diverge later without affecting the other.

INSERT INTO public.dream_mediums (
  key, label, directive, flux_fragment,
  is_active, is_bot_only, is_character_only,
  face_swaps, character_render_mode,
  sort_order
) VALUES
(
  'ancientbot_hyperreal',
  'Ancient Hyperreal',
  'Render as a hyperrealistic photoreal cinematic concept-art still — the rendering register of LOTR / Avatar / Game of Thrones / Dune concept matte paintings, executed with photoreal AI precision rather than hand-painted. Light behaves like physics — ray-traced reflections, volumetric god-rays piercing atmospheric depth haze, dust motes catching light shafts, photoreal subsurface scattering on skin. Stone has photoreal weathering. Fabric drapes with cloth-physics weight. Faces have pore-level skin detail. The frame should make the viewer think "this is a still from an epic fantasy film" — NOT a painting, NOT an illustration, NOT a drawing. Movie-poster composition. Mythic epic scale. Crowds of period-accurate figures populating the scene at varied foreground-to-distant scale. Atmospheric depth haze separating planes (foreground sharp, midground hazy, distant city luminous). God rays, slight bloom, floating sparks/particles. Rich saturated color with cool blue-violet shadows. Hard bans on the wrong register: NEVER painted, NEVER painterly, NEVER illustration, NEVER cartoon, NEVER 2D-art, NEVER watercolor, NEVER oil-painting brushstrokes, NEVER concept-sketch, NEVER stylized, NEVER drawing, NEVER hand-painted finish. The image MUST look photographed.',
  'hyperrealistic photoreal cinematic concept art, ray-traced volumetric lighting, atmospheric depth haze, photoreal stone fabric and skin textures, golden hour god rays, slight bloom and lens flare, 8K film-still precision, NOT painted NOT illustration NOT drawing — photographed, like a still from an epic fantasy film',
  false, -- is_active (bot-only, hidden from picker)
  true,  -- is_bot_only
  false, -- is_character_only
  false, -- face_swaps
  'natural',
  9999
),
(
  'starbot_hyperreal',
  'Starbot Hyperreal',
  'Render as a hyperrealistic photoreal cinematic concept-art still set in a sci-fi world — the rendering register of Denis Villeneuve sci-fi (Blade Runner 2049 / Dune / Arrival), executed with photoreal AI precision. Light behaves like physics — ray-traced reflections off polished surfaces, volumetric atmospheric depth, dust motes catching light shafts, photoreal subsurface scattering on skin and weathered metals. Future-tech surfaces have photoreal weathering — micrometeorite-pock damage, salt-corrosion blooms, soot striping, plasma-burn pits, kill-tally engravings. The frame should make the viewer think "this is a still from a $300M sci-fi film" — NOT painted, NOT illustration, NOT drawing, NOT cartoon, NOT stylized. Movie-poster composition. Mythic epic scale. Atmospheric lens flare and slight bloom. Dust motes in light shafts. Every plane filled with detail. Rich color with cool blue-violet shadows where appropriate. Hard bans on the wrong register: NEVER painted, NEVER painterly, NEVER illustration, NEVER cartoon, NEVER 2D-art, NEVER stylized, NEVER toy, NEVER videogame.',
  'hyperrealistic photoreal cinematic sci-fi concept art, ray-traced volumetric lighting, atmospheric depth haze, photoreal future-tech and alien-world surfaces, slight bloom and lens flare, 8K film-still precision, mythic epic scale, like a still from a Denis Villeneuve sci-fi film — NOT painted, NOT illustration, NOT drawing, NOT cartoon, NOT stylized, NOT toy, NOT videogame',
  false, -- is_active (bot-only, hidden from picker)
  true,  -- is_bot_only
  false, -- is_character_only
  false, -- face_swaps
  'natural',
  9999
)
ON CONFLICT (key) DO NOTHING;
