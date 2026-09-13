-- 514_dual_side_check_mode.sql — 2026-09-12. Kevin's aquarelle couple shipped with his face on the woman and hers on
-- the man: the Haiku gender pre-read (the only signal routing the dual swap) misread a sketchy painted couple, and
-- neither the identity gate (each pasted face matches its own source) nor the broken-only quality gate can see a
-- cross. dualSwapPipeline.ts now takes a SECOND independent read (which side wears the LEFT-locked outfit,
-- _shared/wardrobeSides.ts) and requires agreement. Modes: off (single read, byte-identical to before) · shadow
-- (both reads stamped, nothing changes) · enforce (no dispatch without two agreeing reads → re-render → solo).
-- Shadow first to size the conflict / unresolved rate on real renders, then enforce.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dual_side_check_mode text NOT NULL DEFAULT 'shadow';
ALTER TABLE public.engine_config DROP CONSTRAINT IF EXISTS engine_config_dual_side_check_mode_valid;
ALTER TABLE public.engine_config
  ADD CONSTRAINT engine_config_dual_side_check_mode_valid
  CHECK (dual_side_check_mode IN ('off', 'shadow', 'enforce'));
COMMENT ON COLUMN public.engine_config.dual_side_check_mode IS
  'Dual face-swap second-signal side check (wardrobe read must agree with the gender read): off | shadow | enforce. 2026-09-12.';
