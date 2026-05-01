-- 141 — uploads.first_dream flag
--
-- Tags renders that came from the generate-first-dream Edge Function so we
-- can analyze post-launch quality and tune cells based on banger rate.

ALTER TABLE public.uploads
  ADD COLUMN first_dream boolean NOT NULL DEFAULT false;

CREATE INDEX idx_uploads_first_dream
  ON public.uploads (first_dream)
  WHERE first_dream = true;
