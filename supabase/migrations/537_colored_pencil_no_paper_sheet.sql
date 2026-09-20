-- 537_colored_pencil_no_paper_sheet.sql — colored pencil renders EDGE TO EDGE, not as a drawing lying on a
-- sheet of paper, 2026-09-20. Kevin: "what is causing this weird style with the white border on top/bottom?
-- … let's fix that so it doesn't render as on a 'sheet of paper', but instead a fullscreen render".
--
-- WHAT WAS WRONG
-- `nightly_colored_pencil` named PAPER as a physical object in all three of its texts: the directive opened with
-- "a detailed colored pencil drawing ON TEXTURED PAPER", and both fragments carried "paper texture showing
-- through" plus "grainy tooth texture". Every one of those phrases is meant as a SURFACE QUALITY — the grain of
-- the sheet visible under the pigment. Nano Banana Pro (google/gemini-3-image-preview, which mig 536 just pinned
-- to this look on couples) reads them as COMPOSITION and draws the sheet itself: the scene rendered as a
-- rectangle of artwork floating on a cream page with a margin on all four sides. The app's card is wider than the
-- render, so it crops the left and right margins and leaves visible bands top and bottom. The border is in the
-- pixels; nothing in the pipeline added it.
--
-- WHY THE WORDING AND NOT A COUNTER-INSTRUCTION
-- Two house rules forbid the obvious fixes. Negation LEAKS ("no paper border", "no margins" teaches the model the
-- token), and a framing clause like "fills the entire frame" must never go on a FACE-SWAP fragment, because
-- amplifying the scene shrinks the couple until the dual detector cannot split two clean faces. So this is purely
-- SUBTRACTIVE plus a reword: the grain is described as living IN THE STROKES and IN THE PIGMENT, which is what we
-- always meant, and no sheet is named anywhere. Nothing is added about framing.
--
-- SCOPE: this look only. Twelve other nightly looks name paper, canvas or a sketchbook (chromolithograph, marker,
-- aquarelle_graphite, lineless_watercolor, watercolor_ink, hand_drawn_illustration, watercolor_paper, oil_pastel,
-- halloween_watercolor_ink and three disabled ones). They have rendered correctly for months on flux and
-- gemini-2, which do not take the phrase literally, so they are deliberately untouched. If any of them is ever
-- pinned to Nano Banana Pro, re-check it for this same border first.
--
-- ROLLBACK (restores the exact prior text):
--   UPDATE public.dream_mediums SET
--     flux_fragment = 'colored pencil drawing, prismacolor art, visible pencil strokes, directional hatching, paper texture showing through, layered transparent color, hand-drawn quality, grainy tooth texture, confident linework with eraser marks, waxy colored pencil sheen, master colored pencil art style',
--     face_swap_flux_fragment = 'realistic human face with normal sized eyes and natural adult proportions, thin subtle eyebrows, the face rendered true-to-life and lifelike, drawn in colored pencil, prismacolor art, visible pencil strokes, directional hatching, paper texture showing through, layered transparent color, hand-drawn quality, grainy tooth texture, confident linework'
--   WHERE key = 'nightly_colored_pencil';
--   (the directive's prior text is in this file's git history)
BEGIN;

UPDATE public.dream_mediums SET
  flux_fragment =
    'colored pencil drawing, prismacolor art, visible pencil strokes, directional hatching, fine grain visible within every stroke, layered transparent color, hand-drawn quality, soft grainy pigment, confident linework with eraser marks, waxy colored pencil sheen, master colored pencil art style',
  face_swap_flux_fragment =
    'realistic human face with normal sized eyes and natural adult proportions, thin subtle eyebrows, the face rendered true-to-life and lifelike, drawn in colored pencil, prismacolor art, visible pencil strokes, directional hatching, fine grain visible within every stroke, layered transparent color, hand-drawn quality, soft grainy pigment, confident linework',
  directive =
    'Render as a detailed colored pencil drawing — ALWAYS full color, rich and vibrant, the kind of work you would see from a master colored pencil artist. The medium is ALWAYS the full prismacolor spectrum — color is the entire point. Visual identity: visible individual pencil strokes built up in layers, directional hatching to suggest form, clearly drawn edges, fine grain showing through the color subtly everywhere, highlights preserved as untouched bare highlights rather than added as opaque white. Color use: the full spectrum of colored pencils, layered to create depth through transparency, optical blending in the layers rather than mixing on a palette, slight waxy sheen where pencil layers are built up thickly, full saturation built up through many passes. Shading uses cross-hatching, stippling, and directional strokes — darker areas show as tighter denser pencil marks, lighter areas show the grain more visibly. Confident lines that show the hand of the artist, occasional eraser marks or overlapping strokes adding to the handmade feel.'
WHERE key = 'nightly_colored_pencil';

COMMIT;
