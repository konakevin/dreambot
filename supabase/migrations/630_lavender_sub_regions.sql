-- 630: Lavender Fields' sub-regions catch up with its own pool (Kevin 2026-09-30: "go ahead and fix the lavender
-- sub-regions too"). The romance top-up (mig 614) added lavender places in Drôme Provençale, Furano, Hitchin and
-- Yorkshire, Wanaka, Tihany, Sequim and San Juan Island without adding them here, so the pool cleanup's on-card check
-- (scripts/clean-location-pools.js) read those farms as off-card. Every place named in the active pool is now covered.
-- Data only: no edge function reads sub_regions (the generators and QA tools do). Re-runnable.

UPDATE public.location_cards
SET sub_regions = ARRAY[
  'Provence (Valensole, Senanque Abbey, Sault, Gordes, Luberon, Roussillon, Menerbes, Lacoste, Lourmarin, Simiane-la-Rotonde, Forcalquier, Plateau d''Albion, Silvacane, Le Thoronet, Trigance)',
  'Drome Provencale (Grignan, Nyons)',
  'Hokkaido (Farm Tomita, Biei, Kamifurano, Nakafurano, Furano, Shikisai-no-Oka)',
  'England (Heacham, Snowshill, Mayfield, Hitchin, Yorkshire)',
  'Elsewhere (Brihuega, Hvar, Tasmania, Wanaka, Tihany, Sequim, San Juan Island)'
]::text[]
WHERE name = 'lavender fields';
