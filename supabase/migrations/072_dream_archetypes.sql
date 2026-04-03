-- Dream Archetypes: pre-built sub-personalities that users are matched to.
-- Each dream picks ONE archetype and commits fully to that identity.

CREATE TABLE public.dream_archetypes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key             text UNIQUE NOT NULL,          -- e.g. 'cozy_chef', 'neon_gamer'
  name            text NOT NULL,                 -- human-readable display name
  description     text NOT NULL,                 -- what this archetype is about
  -- Trigger traits: which user selections activate this archetype
  trigger_interests    text[] NOT NULL DEFAULT '{}',
  trigger_moods        text[] NOT NULL DEFAULT '{}',
  trigger_personality  text[] NOT NULL DEFAULT '{}',
  trigger_eras         text[] NOT NULL DEFAULT '{}',
  trigger_settings     text[] NOT NULL DEFAULT '{}',
  min_matches          int NOT NULL DEFAULT 3,    -- how many triggers must match
  -- Creative brief for Haiku when dreaming as this archetype
  prompt_context  text NOT NULL,                 -- rich description for the LLM
  -- Optional style hints (engine still picks randomly, but these are weighted)
  flavor_keywords text[] NOT NULL DEFAULT '{}',  -- extra keywords to inject
  is_active       boolean NOT NULL DEFAULT true,
  -- Seasonal archetypes: null = evergreen (always active), dates = only active in window
  season_start    date,              -- e.g. '2026-12-01'
  season_end      date,              -- e.g. '2026-12-25'
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_archetypes_active ON public.dream_archetypes(is_active) WHERE is_active = true;

-- Junction: links users to their matched archetypes (just foreign keys)
CREATE TABLE public.user_archetypes (
  user_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  archetype_id  uuid NOT NULL REFERENCES public.dream_archetypes(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, archetype_id)
);

CREATE INDEX idx_user_archetypes_user ON public.user_archetypes(user_id);

-- RLS
ALTER TABLE public.dream_archetypes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read archetypes"
  ON public.dream_archetypes FOR SELECT USING (true);

ALTER TABLE public.user_archetypes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own archetypes"
  ON public.user_archetypes FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage both tables (for matching algorithm)
CREATE POLICY "Service can manage archetypes"
  ON public.dream_archetypes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage user_archetypes"
  ON public.user_archetypes FOR ALL USING (true) WITH CHECK (true);
