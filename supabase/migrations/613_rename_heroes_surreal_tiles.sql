-- 613: two tile names users see (Kevin 2026-09-30: "we need a better tile name than 'Heroes' and also 'Surreal
-- Dreams'"; he picked Action & Adventure and Dreamscapes). Titles and descriptions only: the tile keys stay, so saved
-- picks, the scenario scope and the tile-image picker are unaffected. Surreal's description still named the retired
-- Land of Giants and Gravity's Off cards (mig 609). Re-runnable.

UPDATE public.picker_tiles
SET title = 'Action & Adventure', description = 'Superheroes, spies, summits, and stadium glory'
WHERE key = 'heroes';

UPDATE public.picker_tiles
SET title = 'Dreamscapes', description = 'Glowing worlds and impossible, playful wonders'
WHERE key = 'surreal_dreams';
