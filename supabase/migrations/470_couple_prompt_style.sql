-- 2026-09-07 ablation (Kevin: "why is 1.1pro so flakey … can we fix the positioning?"): on the identical couple
-- prompt, flux-1.1-pro produced 0/4 usable base renders with the assembled LEGACY order (medium + scene lead,
-- the people ~300 words in → tiny / profile / from behind) and 4/4 with a SUBJECT-FIRST order (the two people +
-- one compact framing line first, scene and medium after) in three different mediums. The swap pipeline was
-- never at fault — it was handed base renders with no faces. characterSlotPrompt.ts implements
-- 'subject_first' behind this knob; default 'legacy' keeps every prompt byte-identical until the A/B.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS couple_prompt_style text NOT NULL DEFAULT 'legacy'
  CHECK (couple_prompt_style IN ('legacy', 'subject_first'));
