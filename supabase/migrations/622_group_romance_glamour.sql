-- 622: the Love & Luxury group is renamed Romance & Glamour (Kevin 2026-09-30: "i don't like love and luxury for a title").
-- Holds Romantic Escapes and Jet Set. One column, no build.

UPDATE public.picker_tiles SET section = 'Romance & Glamour' WHERE section = 'Love & Luxury';
