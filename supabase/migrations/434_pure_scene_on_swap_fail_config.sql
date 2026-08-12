-- DREAM_CAST_HARDENING_PLAN.md (Kevin, 2026-08-11): when a face swap is UNUSABLE
-- (dual cascade / solo failed / identity far below floor), re-render the dream as
-- a pure empty scene instead of shipping random strangers as the user. Live kill-
-- switch (default TRUE = never ship strangers; flip to false to restore the old
-- ship-the-unswapped-render behavior).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS pure_scene_on_swap_fail boolean NOT NULL DEFAULT true;
