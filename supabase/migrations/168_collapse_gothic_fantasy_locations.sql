-- 168 — Collapse gothic locations into "Gothic Realm" meta entry +
-- fold fantasy standalones into "High Fantasy" meta entry.
--
-- Follows the Ancient-Wonders / Sci-Fi-Worlds pattern: a single meta
-- picker entry stands in for many similar destinations. Reduces picker
-- noise and consolidates biome/iconic-spot setup work to one entry per
-- meta category instead of one per destination.
--
-- Gothic collapse (4 → 1):
--   Victorian London, Transylvania, Haunted Cathedral, Noir Cityscape
--   → deprecated (is_approved=false, picker_category=null)
--   → new "Gothic Realm" picker entry with biome=gothic_historic
--   Their iconic atmospheres (Victorian streets, vampire castles, cathedrals,
--   noir cities) become candidate sub_regions / iconic_spots within the
--   Gothic Realm meta — handled in Stage 1 (gen-location-hints) + Stage 2
--   (gen-iconic-spots-50).
--
-- Fantasy fold (3 → existing meta):
--   Enchanted Forest, Floating Sky Islands, Underwater City (Atlantis)
--   → deprecated; High Fantasy (already has biome=fantasy_imagined)
--   already covers them as sub-genres. The other 3 fantasy entries
--   (Wizard Academy, Fairy Tale Kingdom, Cloud Kingdom) are already
--   is_approved=false so no change needed.

-- ── Gothic: deprecate 4 standalones ──────────────────────────────────
UPDATE public.location_cards
  SET is_approved = false, picker_category = NULL
  WHERE name IN ('victorian london', 'transylvania', 'haunted cathedral', 'noir cityscape');

-- ── Gothic: insert "Gothic Realm" meta entry ────────────────────────
-- Uses ON CONFLICT idempotency in case the migration is re-run.
INSERT INTO public.location_cards (
  name, display_name, picker_category, picker_sort_order,
  biome, is_approved
) VALUES (
  'gothic realm', 'Gothic Realm', 'gothic', 1,
  'gothic_historic', true
)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  picker_category = EXCLUDED.picker_category,
  picker_sort_order = EXCLUDED.picker_sort_order,
  biome = EXCLUDED.biome,
  is_approved = true;

-- ── Fantasy: deprecate 3 standalones (fold into High Fantasy meta) ──
UPDATE public.location_cards
  SET is_approved = false, picker_category = NULL
  WHERE name IN ('enchanted forest', 'floating sky islands', 'underwater city atlantis');
-- High Fantasy already has biome=fantasy_imagined; no change needed.

NOTIFY pgrst, 'reload schema';
