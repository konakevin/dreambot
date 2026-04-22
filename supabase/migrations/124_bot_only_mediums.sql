-- Migration 124: Bot-only mediums — Phase 1 (schema only, no code changes)
--
-- Goal: formalize a class of mediums that exist in dream_mediums but are
-- reserved for BOT engine usage ONLY. Never exposed to users, never rendered
-- by V4 / nightly / restyle pipelines. This unlocks per-medium Flux routing
-- for bot dreams (via dream_mediums.allowed_models) without polluting the
-- user-facing medium picker.
--
-- Defense layers (belt + suspenders):
--   1. is_bot_only boolean column
--   2. CHECK constraint: cannot be simultaneously active AND bot-only
--   3. get_dream_mediums() RPC filters is_bot_only = false (UI can't see them)
--   4. V4/nightly modelPicker filter is_active = true (already filters them out)
--
-- Phase 1 adds the schema + seeds the 3 known bot-only mediums
-- (gothic, gothic-realistic, gothic-whimsy). Phase 2-4 (shared modelPicker
-- extraction + bot engine routing + validation) comes later, isolated.
--
-- IMPORTANT: no V4/nightly code changes in this migration. All existing
-- queries continue working unchanged (is_active=true filters already skip
-- bot-only rows since we only mark is_active=false rows as bot-only).

BEGIN;

-- ── 1. Schema: add is_bot_only column ───────────────────────────────────

ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS is_bot_only boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.dream_mediums.is_bot_only IS
  'True = reserved for bot engine only. Never shown to users, never rendered by V4/nightly/restyle. Must be is_active=false (enforced by CHECK constraint).';

-- ── 2. CHECK constraint: is_bot_only ⟹ NOT is_active ────────────────────

ALTER TABLE public.dream_mediums
  DROP CONSTRAINT IF EXISTS no_active_botonly;

ALTER TABLE public.dream_mediums
  ADD CONSTRAINT no_active_botonly
  CHECK (NOT (is_active = true AND is_bot_only = true));

-- ── 3. Mark existing bot-only rows ──────────────────────────────────────
--
-- 'gothic' is used by GothBot as a bot-only tag (via bot.mediums). It
-- already exists in dream_mediums as is_active=false with allowed_models
-- configured. Just needs the flag.

UPDATE public.dream_mediums
  SET is_bot_only = true
  WHERE key = 'gothic';

-- ── 4. Insert new bot-only rows ─────────────────────────────────────────
--
-- 'gothic-realistic' and 'gothic-whimsy' are new bot-only mediums used by
-- GothBot. They have no user-facing directive or flux_fragment (bot engine
-- composes prompts via mediumStyles + promptPrefixByMedium in bot config).
-- Only allowed_models matters here — that's what the modelPicker reads.

INSERT INTO public.dream_mediums
  (key, label, is_active, is_bot_only, allowed_models,
   directive, flux_fragment, sort_order,
   is_scene_only, is_character_only, nightly_skip, face_swaps,
   is_public, character_render_mode, preferred_model)
VALUES
  ('gothic-realistic', 'Gothic Realistic',
    false, true,
    ARRAY[
      'black-forest-labs/flux-dev',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-2-dev',
      'black-forest-labs/flux-2-pro'
    ],
    '(bot-only — prompt composition handled by bot engine)',
    '',
    999,
    false, false, false, false,
    false, 'embodied',
    'black-forest-labs/flux-2-pro'),
  ('gothic-whimsy', 'Gothic Whimsy',
    false, true,
    ARRAY[
      'black-forest-labs/flux-dev',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-2-dev'
    ],
    '(bot-only — prompt composition handled by bot engine)',
    '',
    999,
    false, false, false, false,
    false, 'embodied',
    'black-forest-labs/flux-2-dev')
ON CONFLICT (key) DO UPDATE SET
  is_bot_only = EXCLUDED.is_bot_only,
  allowed_models = EXCLUDED.allowed_models,
  directive = EXCLUDED.directive,
  flux_fragment = EXCLUDED.flux_fragment,
  is_active = EXCLUDED.is_active;

-- ── 5. Update get_dream_mediums RPC to filter bot-only rows ─────────────
--
-- UI users MUST NOT see bot-only mediums in the picker. Current RPC already
-- filters is_active=true — since bot-only rows are is_active=false, they
-- were already invisible. But we add explicit is_bot_only=false filter as
-- belt-and-suspenders against accidental future activations.

DROP FUNCTION IF EXISTS public.get_dream_mediums();
CREATE FUNCTION public.get_dream_mediums()
RETURNS TABLE (
  key text,
  label text,
  directive text,
  flux_fragment text,
  sort_order integer,
  is_scene_only boolean,
  is_character_only boolean,
  nightly_skip boolean,
  face_swaps boolean,
  character_render_mode text,
  kontext_directive text
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    key, label, directive, flux_fragment, sort_order,
    is_scene_only, is_character_only, nightly_skip, face_swaps,
    character_render_mode, kontext_directive
  FROM public.dream_mediums
  WHERE is_active = true
    AND is_bot_only = false
  ORDER BY sort_order;
$$;

GRANT EXECUTE ON FUNCTION public.get_dream_mediums() TO anon, authenticated, service_role;

-- ── 6. Verification queries (run these after migration to confirm) ──────
--
-- Expected: 0 rows (constraint violation shouldn't be possible)
--   SELECT * FROM public.dream_mediums WHERE is_active = true AND is_bot_only = true;
--
-- Expected: gothic, gothic-realistic, gothic-whimsy all is_bot_only=true
--   SELECT key, is_active, is_bot_only, allowed_models
--     FROM public.dream_mediums
--     WHERE is_bot_only = true
--     ORDER BY key;
--
-- Expected: get_dream_mediums() returns 17+ rows, NONE with key starting 'gothic'
--   SELECT key FROM public.get_dream_mediums() ORDER BY key;

COMMIT;
