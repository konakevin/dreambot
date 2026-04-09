-- Dream Jobs — tracks in-flight and completed dream generation jobs.
-- Enables "Queue This" flow where user can dismiss the loading screen
-- and get notified when the dream is ready.

CREATE TABLE public.dream_jobs (
  id uuid PRIMARY KEY,  -- client-generated, passed in request
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'done', 'failed', 'nsfw')),
  result_image_url text,
  result_prompt text,
  result_medium text,
  result_vibe text,
  upload_id uuid REFERENCES public.uploads(id),
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX idx_dream_jobs_user_status ON public.dream_jobs(user_id, status);

ALTER TABLE public.dream_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own jobs"
  ON public.dream_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can manage jobs"
  ON public.dream_jobs FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
