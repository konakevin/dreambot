-- Fix: allow uploads to be deleted even when referenced by dream_jobs
ALTER TABLE public.dream_jobs
  DROP CONSTRAINT IF EXISTS dream_jobs_upload_id_fkey,
  ADD CONSTRAINT dream_jobs_upload_id_fkey
    FOREIGN KEY (upload_id) REFERENCES public.uploads(id) ON DELETE SET NULL;
