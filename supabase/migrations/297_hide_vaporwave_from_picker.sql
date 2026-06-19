-- 297_hide_vaporwave_from_picker.sql
--
-- Fully remove Octane (render), Magazine (hyperreal), and Vaporwave as USER
-- mediums — "not available to users" anywhere:
--   1. PICKER: is_public=false drops them from every Create picker mode (New
--      Scene / text / Restyle). The get_dream_mediums RPC already gates on
--      is_public (migration 295), so no code change/rebuild — server-side filter.
--      (Octane/Magazine were already hidden by 295; this adds Vaporwave.)
--   2. NIGHTLY: is_dream_eligible=false pulls all three from the nightly
--      auto-dream roll so they never render TO a user. (Vaporwave was already
--      ineligible; this adds Octane + Magazine.)
--
-- is_active stays TRUE so:
--   • bots that use Octane BY KEY (MechBot/DinoBot/TinyBot) are unaffected, and
--   • historical dreams that used any of the three still resolve the medium by
--     key for DLT / re-render.
--
-- Kevin: "i don't even want it shown as a medium for any mode … these are not
-- available to users."

-- 1. Hide from the picker (Vaporwave — the other two already hidden by 295).
UPDATE public.dream_mediums SET is_public = false WHERE key = 'vaporwave';

-- 2. Pull all three from the nightly auto-dream roll.
UPDATE public.dream_mediums
SET is_dream_eligible = false
WHERE key IN ('render', 'hyperreal', 'vaporwave');
