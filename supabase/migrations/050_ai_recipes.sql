-- Migration 050: AI Recipe System
--
-- Stores user taste profiles ("recipes") for personalized AI image generation.
-- Each user has one active recipe built during onboarding.
-- Recipes are JSONB to allow schema evolution without migrations.

-- 1. User recipes table
CREATE TABLE public.user_recipes (
  user_id              uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  recipe               jsonb NOT NULL DEFAULT '{}',
  onboarding_completed boolean NOT NULL DEFAULT false,
  ai_enabled           boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recipe"
  ON public.user_recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own recipe"
  ON public.user_recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recipe"
  ON public.user_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Service role can read all recipes for daily generation
CREATE POLICY "Service role reads all recipes"
  ON public.user_recipes FOR SELECT USING (true);

-- 2. AI generation log — tracks every image generated
CREATE TABLE public.ai_generation_log (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  upload_id         uuid REFERENCES public.uploads(id) ON DELETE SET NULL,
  recipe_snapshot   jsonb NOT NULL,
  rolled_axes       jsonb NOT NULL,
  enhanced_prompt   text NOT NULL,
  model_used        text NOT NULL DEFAULT 'flux-pro-v1.1',
  cost_cents        numeric(6,2) NOT NULL DEFAULT 3.0,
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','generating','completed','failed')),
  error_message     text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_gen_log_user ON public.ai_generation_log(user_id, created_at DESC);
CREATE INDEX idx_ai_gen_log_status ON public.ai_generation_log(status) WHERE status IN ('pending','generating');

ALTER TABLE public.ai_generation_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own generation log"
  ON public.ai_generation_log FOR SELECT USING (auth.uid() = user_id);

-- 3. Daily budget tracking
CREATE TABLE public.ai_generation_budget (
  user_id            uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date               date NOT NULL DEFAULT CURRENT_DATE,
  images_generated   integer NOT NULL DEFAULT 0,
  total_cost_cents   numeric(8,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

ALTER TABLE public.ai_generation_budget ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own budget"
  ON public.ai_generation_budget FOR SELECT USING (auth.uid() = user_id);

-- 4. Add columns to uploads for AI tracking
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS is_ai_generated boolean NOT NULL DEFAULT false;
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS ai_prompt text;

-- 5. Add flag to users for routing (skip onboarding check if true)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS has_ai_recipe boolean NOT NULL DEFAULT false;

-- 6. Cost monitoring view
CREATE OR REPLACE VIEW public.ai_cost_summary AS
SELECT date, COUNT(*) as images, SUM(total_cost_cents) as cost_cents
FROM public.ai_generation_budget
GROUP BY date ORDER BY date DESC;
