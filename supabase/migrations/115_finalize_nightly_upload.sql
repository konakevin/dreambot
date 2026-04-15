-- Finalize a nightly dream upload: set bot_message, from_wish.
-- Called by the nightly-dreams.js script after the Edge Function creates the draft upload.
-- Runs as SECURITY DEFINER to bypass the freeze_upload_columns_on_update trigger
-- (which blocks client-side updates to bot_message and from_wish).

CREATE OR REPLACE FUNCTION public.finalize_nightly_upload(
  p_upload_id uuid,
  p_bot_message text DEFAULT NULL,
  p_from_wish text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Temporarily disable the freeze trigger for this transaction
  ALTER TABLE public.uploads DISABLE TRIGGER trg_freeze_upload_columns;

  UPDATE public.uploads
  SET bot_message = p_bot_message,
      from_wish = p_from_wish
  WHERE id = p_upload_id;

  ALTER TABLE public.uploads ENABLE TRIGGER trg_freeze_upload_columns;
END;
$$;
