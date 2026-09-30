-- 625: the Middle East & Africa tile is titled Africa & Arabia (Kevin 2026-09-30: it was "the only tile that has a two
-- line title, let's fix"; he picked the name). Title only; key middle_east_africa unchanged.

UPDATE public.picker_tiles SET title = 'Africa & Arabia' WHERE key = 'middle_east_africa';
