-- 301_lego_vinyl_restyle_model_pool.sql
--
-- Peg LEGO + Vinyl RESTYLE to flux-1.1-pro / flux-1.1-pro-ultra only.
--
-- Those two use the flux-dev REBUILD path (vision-describe → Sonnet → render from
-- scratch). Previously the render model was picked at random from the medium's
-- full allowed_models pool (7 models incl. Flux-2, Nano Banana, GPT). We don't
-- touch allowed_models (nightly + new-scene share it) — instead set a
-- restyle-specific POOL in client_meta.restyle_models that the restyle render
-- picks one from (restyle-photo / dreamStyles read it). Kept as a 2-model pool so
-- restyles still vary between the two.

UPDATE public.dream_mediums
SET client_meta = coalesce(client_meta, '{}'::jsonb)
  || '{"restyle_models": ["black-forest-labs/flux-1.1-pro", "black-forest-labs/flux-1.1-pro-ultra"]}'::jsonb
WHERE key IN ('lego', 'vinyl');
