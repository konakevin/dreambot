-- Migration 042: Allow comment owner OR post owner to delete comments

-- Drop old update-based "delete" policy
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- Real DELETE policy: comment owner or post owner can delete
CREATE POLICY "Users can delete comments" ON comments FOR DELETE
  USING (
    user_id = auth.uid()
    OR upload_id IN (SELECT id FROM uploads WHERE user_id = auth.uid())
  );

-- Keep UPDATE for editing (own comments only)
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE
  USING (user_id = auth.uid());
