-- 577_llm_prompt_overlays.sql — model-specific prompt tuning as data (LLM_5_5_TUNING_PLAN.md, phase 0).
--
-- WHY. Our prompts are tuned for Sonnet 4.6; 5.5 needs its own tuning (couples: scenery, faces toward the camera,
-- wardrobe fit, props; cast reads; beat length). An overlay changes the prompt for ONE job on ONE model, applied inside
-- the Anthropic client per model (supabase/functions/_shared/anthropic.ts applyOverlays), so tuning 5.5 can never
-- change what 4.6 is sent: nightly's restore point and today's Create couples stay byte-identical.
--
--   key     unique name, e.g. 'slots55-r1-scenery'. Overlays for the same job + model apply in key order.
--   job     an LLM_JOBS key (create_slots, nightly_slots, create_brief, location_beat, cast_hair, ...)
--   model   the model it applies to, e.g. 'claude-sonnet-5-5'
--   mode    append | prepend | replace (replace swaps the first exact occurrence of `find`; a miss is stamped)
--   active  true = every request for that job + model (production); false = QA only, picked per request with
--           qa_llm_overlays (Create) / force_llm_overlays (nightly). A tuning round therefore needs no deploy.
--
-- Stamps: llm_overlay:<job>:<key> when applied, llm_overlay_miss:<job>:<key> when a replace found nothing,
-- qa:llm_overlay:<key> / qa:llm_overlay_unknown:<key> for the QA pick. Service-role only (RLS on, no policies).
-- Rollback of any overlay: UPDATE public.llm_prompt_overlays SET active = false WHERE key = '<key>';

CREATE TABLE IF NOT EXISTS public.llm_prompt_overlays (
  key text PRIMARY KEY,
  job text NOT NULL,
  model text NOT NULL,
  mode text NOT NULL DEFAULT 'append' CHECK (mode IN ('append', 'prepend', 'replace')),
  find text,
  body text NOT NULL,
  active boolean NOT NULL DEFAULT false,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT llm_overlay_replace_needs_find CHECK (mode <> 'replace' OR find IS NOT NULL)
);

ALTER TABLE public.llm_prompt_overlays ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.llm_prompt_overlays IS
  'Model-specific prompt overlays (LLM_5_5_TUNING_PLAN.md). One job x one model each; active = production, inactive = QA pick only. Mig 577.';
