-- 149_users_pro_mode_flux_model.sql
--
-- Adds pro_mode_flux_model column to users table for the Create-screen
-- "Pro Mode — Use my exact prompt" feature. When the user toggles Pro Mode
-- on, generate-dream sends their prompt verbatim to the chosen Flux model.
-- Default to flux-1.1-pro (current hardcoded value before this migration).

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS pro_mode_flux_model TEXT
    NOT NULL DEFAULT 'black-forest-labs/flux-1.1-pro'
    CHECK (pro_mode_flux_model IN (
      'black-forest-labs/flux-dev',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-2-dev',
      'black-forest-labs/flux-2-pro'
    ));

COMMENT ON COLUMN public.users.pro_mode_flux_model IS
  'User-selected Flux model for Pro Mode renders (Create-screen toggle that sends the user prompt verbatim to Flux). Default flux-1.1-pro. Settings → Pro Mode.';
