-- Location Cards: rich cinematic descriptions of locations, shared across all users.
-- Generated lazily by Sonnet on first encounter, reused forever.
CREATE TABLE IF NOT EXISTS public.location_cards (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL UNIQUE,
  tags            text[] NOT NULL DEFAULT '{}',
  prompt_version  int NOT NULL DEFAULT 1,
  model_version   text NOT NULL DEFAULT 'claude-sonnet-4-5-20250929',
  visual_palette  text[] NOT NULL DEFAULT '{}',
  atmosphere      text[] NOT NULL DEFAULT '{}',
  architecture    text[] NOT NULL DEFAULT '{}',
  light_signature text[] NOT NULL DEFAULT '{}',
  texture_details text[] NOT NULL DEFAULT '{}',
  cinematic_phrases text[] NOT NULL DEFAULT '{}',
  fusion_settings jsonb NOT NULL DEFAULT '{}',
  is_approved     boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_location_cards_name ON public.location_cards(name);
ALTER TABLE public.location_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read location_cards" ON public.location_cards FOR SELECT USING (true);

-- Object Cards: rich cinematic descriptions of objects, shared across all users.
CREATE TABLE IF NOT EXISTS public.object_cards (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL UNIQUE,
  tags                  text[] NOT NULL DEFAULT '{}',
  prompt_version        int NOT NULL DEFAULT 1,
  model_version         text NOT NULL DEFAULT 'claude-sonnet-4-5-20250929',
  visual_forms          text[] NOT NULL DEFAULT '{}',
  material_textures     text[] NOT NULL DEFAULT '{}',
  signature_details     text[] NOT NULL DEFAULT '{}',
  scale_contexts        text[] NOT NULL DEFAULT '{}',
  interaction_modes     text[] NOT NULL DEFAULT '{}',
  environment_bindings  text[] NOT NULL DEFAULT '{}',
  role_options          text[] NOT NULL DEFAULT '{}',
  fusion_forms          jsonb NOT NULL DEFAULT '{}',
  soft_presence_forms   text[] NOT NULL DEFAULT '{}',
  faceswap_forbidden    text[] NOT NULL DEFAULT '{}',
  faceswap_safe_positive text[] NOT NULL DEFAULT '{}',
  is_approved           boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_object_cards_name ON public.object_cards(name);
ALTER TABLE public.object_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read object_cards" ON public.object_cards FOR SELECT USING (true);

-- Auto-update updated_at on both tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER location_cards_updated_at
  BEFORE UPDATE ON public.location_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER object_cards_updated_at
  BEFORE UPDATE ON public.object_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
