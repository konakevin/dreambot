-- Allow users to read their own uploads regardless of is_active.
-- This is needed for My Dreams (private dreams have is_active=false).

CREATE POLICY "Users can view their own uploads"
  ON public.uploads FOR SELECT
  USING (auth.uid() = user_id);

-- Allow friends to view each other's dreams (including private ones).
-- Uses the friendships table to check accepted friend status.

CREATE POLICY "Friends can view each others uploads"
  ON public.uploads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.friendships
      WHERE status = 'accepted'
        AND (
          (user_a = auth.uid() AND user_b = user_id)
          OR (user_b = auth.uid() AND user_a = user_id)
        )
    )
  );
