-- Track seed generations and usage for self-regenerating bot seed pools.
-- Each batch of seeds is a "generation". When all seeds in a generation are used,
-- the bot auto-generates a fresh batch. Old generations are disabled, not deleted.

ALTER TABLE dream_templates ADD COLUMN generation integer NOT NULL DEFAULT 1;
ALTER TABLE dream_templates ADD COLUMN used_at timestamptz;
