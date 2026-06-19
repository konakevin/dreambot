-- 286_counter_decrement_floor.sql
--
-- Clamp the comment_count / reply_count decrements to >= 0 (Architect audit,
-- 2026-06-18). The like_count decrement already uses GREATEST(...,0) (mig 281),
-- but the comment-count trigger (mig 039) did not — a double-DELETE (orphaned FK
-- cascade, retried delete) could drive the denormalized counters negative and
-- drift them away from the true row count. Redefines update_comment_counts()
-- preserving the increment logic verbatim, adding the floor on both decrements.
CREATE OR REPLACE FUNCTION public.update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE uploads SET comment_count = comment_count + 1 WHERE id = NEW.upload_id;
    IF NEW.parent_id IS NOT NULL THEN
      UPDATE comments SET reply_count = reply_count + 1 WHERE id = NEW.parent_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE uploads SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.upload_id;
    IF OLD.parent_id IS NOT NULL THEN
      UPDATE comments SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = OLD.parent_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
