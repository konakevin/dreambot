-- 457: Day-of "hero" dreams — ONE curated, honed recipe per (holiday, surface, register),
-- personalized per user by deterministic AXES so no two heroes are clones.
--
-- Kevin (2026-09-04): NO day-of seed pools. On the holiday itself every nightly user gets a
-- guaranteed, grand, on-brand hero dream: the couple render if they have a +1, else themselves.
-- The recipe is a template: `{palette}` / `{flourish}` / `{role}` / `{time}` placeholders in
-- attire + scene are filled from the row's `axes` JSON, each axis picked by a hash of
-- (user_id, holiday, year) — stable + reproducible per user, evenly spread across users, and
-- different again next year. The register (cozy vs eerie) comes from the user's Vibe Profile
-- Cute↔Terrifying slider so the hero honors their taste. Pure math: _shared/holidayHero.ts.
--
-- Surfaces: 'couple' (dual face swap), 'male' / 'female' (solo, gendered so costumes can be
-- properly gendered instead of the unisex compromise the everyday pools need).
-- Register 'default' is the fallback when a holiday doesn't author cozy/eerie variants.
-- Face-swap rules still apply (HOLIDAY_DREAMS_PLAN.md §6): attire = clothing only, no masks /
-- hoods-up / face occlusion; couples keep a clear gap between heads; scene is pure environment.

CREATE TABLE IF NOT EXISTS public.holiday_hero_prompts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday     text NOT NULL REFERENCES public.holidays(key) ON DELETE CASCADE,
  surface     text NOT NULL CHECK (surface IN ('couple', 'male', 'female')),
  register    text NOT NULL DEFAULT 'default' CHECK (register IN ('cozy', 'eerie', 'default')),
  attire      text NOT NULL,
  scene       text NOT NULL,
  medium_key  text,          -- pinned face-swap-safe medium (NULL = the rolled medium)
  medium_ban  text,
  pose_pool   text,          -- NULL = couples → refined 'partner' poses, solos → 'glamour'
  axes        jsonb NOT NULL DEFAULT '{}'::jsonb,  -- {"palette":[...],"flourish":[...],"role":[...],"time":[...]}
  disabled    boolean NOT NULL DEFAULT false,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (holiday, surface, register)
);

COMMENT ON TABLE public.holiday_hero_prompts IS
  'Day-of hero dream recipes (one per holiday × surface × register). Placeholders {axis} in attire/scene are filled from `axes` by a per-user hash (_shared/holidayHero.ts).';

-- Service-role only (the render reads it); same posture as holiday_scenes.
ALTER TABLE public.holiday_hero_prompts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_holiday_hero_prompts_holiday
  ON public.holiday_hero_prompts (holiday) WHERE NOT disabled;

SELECT count(*) AS hero_rows FROM public.holiday_hero_prompts;
