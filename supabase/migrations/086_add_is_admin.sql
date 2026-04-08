ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Set initial admins
UPDATE users SET is_admin = true WHERE id IN (
  'eab700d8-f11a-4f47-a3a1-addda6fb67ec',
  '0779b973-6cd4-4d16-a53d-9e286f6e39db'
);
