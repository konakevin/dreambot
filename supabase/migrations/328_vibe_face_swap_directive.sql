-- 328_vibe_face_swap_directive.sql (2026-07-06)
--
-- Vibe-level face-swap directive override — the vibe twin of migration 154's
-- dream_mediums.face_swap_directive.
--
-- Why: the kawaii vibe was disabled 2026-07-05 because its directive
-- ("Sanrio… mascot creatures with smiling faces… Pop-Mart charm") primes
-- Flux's big-anime-eye prior on the PRE-SWAP character render; the face swap
-- then fails to fully replace the stylized face and leaves eye remnants —
-- the same disease the fairytale MEDIUM had, cured there by a face_swap_
-- directive that keeps the world stylized but mandates photoreal human face
-- proportions. Vibes had no such column, so the vibe's directive reached the
-- swap brief raw (singleBriefBuilder/dualBriefBuilder inject it as MOOD).
--
-- The edge builders now use face_swap_directive when set (NULL → regular
-- directive, fully backward compatible). Scope: the override is read ONLY on
-- face-swap-eligible renders — pure-scene kawaii renders keep the full
-- big-eye-mascot glory.
--
-- ORDER OF OPERATIONS: run this, deploy generate-dream + nightly-dreams +
-- first-dream-render, THEN re-enable kawaii (is_active=true).

ALTER TABLE public.dream_vibes ADD COLUMN IF NOT EXISTS face_swap_directive TEXT;

COMMENT ON COLUMN public.dream_vibes.face_swap_directive IS
  'Swap-safe directive replacement used ONLY on face-swap renders (single + dual brief builders). NULL = use the regular directive. The vibe twin of dream_mediums.face_swap_directive (migration 154): keeps the vibe''s WORLD styling but mandates photoreal human face proportions so the pre-swap render is swap-compatible.';

UPDATE public.dream_vibes
SET face_swap_directive = 'Adorable Japanese kawaii cuteness in full bloom — the scene is sweet, soft, and irresistibly cute. A candy palette of pastel pink, mint, baby blue, lavender, butter yellow, and creamy white with pops of bright candy color. Rounded chunky no-sharp-corners shapes everywhere; squishy soft textures — felt, fluff, jelly, mochi, marshmallow, plush, glossy vinyl-toy sheen. Cute motifs scattered through the scene: hearts, stars, bows, rainbows, fluffy clouds, sparkles, polka dots, sprinkles. Sweet treats abound — macarons, ice cream, strawberries, cupcakes, bubble tea, candy. Small plush mascot creatures may appear as background props. Add kawaii cuteness to the scene rather than replacing it. CRITICAL FACE RULE — NON-NEGOTIABLE: ALL human characters MUST have photorealistic adult human face proportions. Eyes MUST be normal human size — the same size you would see in a photograph. Do NOT enlarge eyes even slightly. Do NOT apply kawaii, chibi, anime, mascot, or sticker styling to any human face or head. The WORLD and the props are kawaii; human FACES are realistic and photographic. IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject''s skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.'
WHERE key = 'kawaii';
