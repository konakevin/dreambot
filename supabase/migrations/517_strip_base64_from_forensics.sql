-- 517_strip_base64_from_forensics.sql (2026-09-14)
--
-- WHY. The `dual_target:<attempt>:<target>` forensics stamp (added 2026-09-13 during the flux couple drill) records
-- the base render each swap attempt worked from. flux returns an https URL; gemini and grok return the image inline
-- as a `data:image/png;base64,…` string. So for two of the three models the stamp wrote the whole IMAGE, as text,
-- into ai_generation_log.fallback_reasons: 34 of 120 sampled rows carried 56 MB between them, largest row 2.85 MB.
--
-- That column is what scripts/check-forensics.js and the dream_forensics / dream_forensics_recent RPCs read, so the
-- stamp meant to make failures diagnosable was making them undiagnosable — a plain select over recent renders hits
-- the statement timeout. The code fix (dualSwapPipeline.ts, same day) stamps `:inline` instead. This cleans the
-- rows already written, which would otherwise sit there until the 30-day prune (mig 274).
--
-- ROWS ARE NOT DELETED. Only the offending ARRAY ELEMENT is rewritten, in place, preserving order and every other
-- stamp on the row — the forensics value (which attempt, which model, which failure reason) is fully retained.
-- A data URI could never be fetched later anyway, so nothing recoverable is lost.
UPDATE public.ai_generation_log
   SET fallback_reasons = (
     SELECT array_agg(
              CASE WHEN r LIKE 'dual_target:%:data:%'
                   THEN regexp_replace(r, '^(dual_target:[0-9]+:).*$', '\1inline')
                   ELSE r END
              ORDER BY ord)
       FROM unnest(fallback_reasons) WITH ORDINALITY AS t(r, ord)
   )
 WHERE EXISTS (
     SELECT 1 FROM unnest(fallback_reasons) AS x(r) WHERE x.r LIKE 'dual_target:%:data:%'
   );
