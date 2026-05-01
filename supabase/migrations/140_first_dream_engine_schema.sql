-- 140 — First Dream Engine schema
--
-- Adds:
--   * location_cards.location_class — classifies the 90 location cards into
--     10 visual classes (urban, coastal, forest, mountain, desert, interior,
--     architectural, garden, aquatic, sky_cosmic) for the persona × location
--     matrix lookup.
--   * object_cards.object_class — classifies the 77 object cards into 7
--     classes (personal, companion, vehicle, magical, natural, tech, food).
--   * users.first_dream_completed_at — guards the one-shot first-dream flow.
--     Set when the first-dream pipeline completes and posts. Onboarding
--     route checks this and redirects to feed if non-null.
--   * first_dream_cells — 33 tuned recipes (3 personas × 10 location classes
--     + 3 persona-base fallbacks). Engine reads from this at runtime to
--     build Sonnet briefs that hit a curated quality bar on first impression.
--
-- Spec: memory/project_first_dream_engine_spec.md (Phase 0 locked 2026-05-01)

-- ── location_cards.location_class ─────────────────────────────────────

ALTER TABLE public.location_cards
  ADD COLUMN location_class text NOT NULL DEFAULT 'general';

ALTER TABLE public.location_cards
  ADD CONSTRAINT location_cards_location_class_check
  CHECK (location_class IN (
    'urban', 'coastal', 'forest', 'mountain', 'desert',
    'interior', 'architectural', 'garden', 'aquatic', 'sky_cosmic',
    'general'
  ));

-- Backfill is handled by scripts/backfill-first-dream-classes.js
-- (run separately so the mapping can be code-reviewed independently of
--  the DDL).

-- ── object_cards.object_class ─────────────────────────────────────────

ALTER TABLE public.object_cards
  ADD COLUMN object_class text NOT NULL DEFAULT 'personal';

ALTER TABLE public.object_cards
  ADD CONSTRAINT object_cards_object_class_check
  CHECK (object_class IN (
    'personal', 'companion', 'vehicle', 'magical', 'natural',
    'tech', 'food'
  ));

-- ── users.first_dream_completed_at ────────────────────────────────────
-- Used by the onboarding route guard and the first-dream pipeline. Once
-- set, the first-dream flow is closed for that user — they can only
-- generate dreams via the regular Create / V4 / DLT paths.

ALTER TABLE public.users
  ADD COLUMN first_dream_completed_at timestamptz;

CREATE INDEX idx_users_first_dream_completed_at
  ON public.users (first_dream_completed_at)
  WHERE first_dream_completed_at IS NOT NULL;

-- ── first_dream_cells ─────────────────────────────────────────────────
-- 33 rows seeded by scripts/seed-first-dream-cells.js. Each row is a
-- tuned recipe consumed by the first-dream pipeline. The (persona,
-- location_class) tuple is the lookup key.

CREATE TABLE public.first_dream_cells (
  persona text NOT NULL,
  location_class text NOT NULL,

  -- Composition: framing, angle, subject placement, foreground/midground/background guidance
  composition_brief text NOT NULL,

  -- Lighting recipe: locked light direction, color temperature, mood
  lighting_recipe text NOT NULL,

  -- Camera recipe: focal length, depth of field, tilt, distance
  camera_recipe text NOT NULL,

  -- Sensory anchors: 2-4 keys from the sensory anchor pool that LOCK in for this cell
  sensory_anchor_keys text[] NOT NULL DEFAULT '{}',

  -- Allowed mediums for this cell. Engine picks ONE at random from this list.
  -- Curated user-pickable subset only — no bot-only mediums on first dream.
  allowed_mediums text[] NOT NULL,

  -- Allowed object classes. If user's object class is not in this list,
  -- the object is dropped from the brief.
  allowed_object_classes text[] NOT NULL DEFAULT '{}',

  -- Banned phrases — engine filters these out of the final Sonnet brief.
  banned_phrases text[] NOT NULL DEFAULT '{}',

  -- Banner caption template — interpolated with {place} and {medium} for the
  -- bot message that accompanies the post.
  banner_caption_template text NOT NULL,

  -- Vibe directive override. First-dream cells lock vibe to wonder/cinematic/
  -- ethereal regardless of user's mood sliders, since first impressions favor
  -- awe over edge.
  forced_vibe_key text NOT NULL,

  -- Persona-base fallback flag. When location_class = 'base', this cell is
  -- the safety net for that persona regardless of location.
  is_base_fallback boolean NOT NULL DEFAULT false,

  -- Quality tracking
  quality_grade numeric DEFAULT NULL,           -- last self-grade 0-5
  quality_runs integer NOT NULL DEFAULT 0,      -- total renders against this cell
  last_tuned_at timestamptz DEFAULT NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (persona, location_class),

  CONSTRAINT first_dream_cells_persona_check
    CHECK (persona IN ('portrait', 'vista', 'couple')),

  CONSTRAINT first_dream_cells_location_class_check
    CHECK (location_class IN (
      'urban', 'coastal', 'forest', 'mountain', 'desert',
      'interior', 'architectural', 'garden', 'aquatic', 'sky_cosmic',
      'base'
    ))
);

-- Rows are seeded by scripts/seed-first-dream-cells.js — keeps the recipe
-- text out of the migration so it can be tuned without DDL churn.

CREATE INDEX idx_first_dream_cells_persona ON public.first_dream_cells (persona);
CREATE INDEX idx_first_dream_cells_location_class ON public.first_dream_cells (location_class);

-- ── RLS: service-role-only access ─────────────────────────────────────
-- first_dream_cells is read by the Edge Function (service role) when
-- building the first-dream brief. End users should NEVER read or write
-- this table directly via anon/authenticated keys — the cell text could
-- be reverse-engineered to game prompts. Enable RLS with no policies;
-- service role bypasses RLS by default.

ALTER TABLE public.first_dream_cells ENABLE ROW LEVEL SECURITY;
